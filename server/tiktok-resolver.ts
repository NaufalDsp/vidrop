const TIKWM_API_URL = "https://www.tikwm.com/api/";
const REQUEST_TIMEOUT_MS = 15_000;

const allowedTikTokHosts = new Set([
  "tiktok.com",
  "www.tiktok.com",
  "m.tiktok.com",
  "vm.tiktok.com",
  "vt.tiktok.com",
]);

export type ResolvedMediaFormat = {
  id: string;
  type: "video";
  format: "mp4";
  quality: string;
  watermark: false;
  url: string;
};

export type ResolvedImage = {
  id: string;
  index: number;
  url: string;
};

export type ResolvedVideo = {
  id: string;
  mediaType: "video" | "photo" | "slideshow";
  title: string;
  author: { username: string; displayName?: string };
  thumbnail?: string;
  duration: number;
  formats: ResolvedMediaFormat[];
  images: ResolvedImage[];
  audio?: { available: boolean; url?: string };
};

type TikwmAuthor = {
  unique_id?: unknown;
  nickname?: unknown;
};

export type TikwmPayload = {
  code?: unknown;
  msg?: unknown;
  data?: {
    id?: unknown;
    title?: unknown;
    duration?: unknown;
    cover?: unknown;
    origin_cover?: unknown;
    play?: unknown;
    hdplay?: unknown;
    size?: unknown;
    hd_size?: unknown;
    images?: unknown;
    music?: unknown;
    author?: TikwmAuthor;
  } | null;
};

export class ResolverError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly status = 502,
  ) {
    super(message);
    this.name = "ResolverError";
  }
}

function asNonEmptyString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function asSafeMediaUrl(value: unknown): string | undefined {
  const candidate = asNonEmptyString(value);
  if (!candidate) return undefined;

  try {
    const parsed = new URL(candidate);
    return parsed.protocol === "https:" ? parsed.toString() : undefined;
  } catch {
    return undefined;
  }
}

export function parseTikTokUrl(value: unknown): string {
  if (typeof value !== "string" || value.length > 2_048) {
    throw new ResolverError("INVALID_URL", "Enter a valid TikTok URL.", 400);
  }

  let parsed: URL;
  try {
    parsed = new URL(value.trim());
  } catch {
    throw new ResolverError("INVALID_URL", "Enter a valid TikTok URL.", 400);
  }

  if (parsed.protocol !== "https:" || !allowedTikTokHosts.has(parsed.hostname.toLowerCase())) {
    throw new ResolverError("UNSUPPORTED_URL", "Only public TikTok links are supported.", 400);
  }

  parsed.hash = "";
  return parsed.toString();
}

export function normalizeTikwmPayload(payload: TikwmPayload): ResolvedVideo {
  if (payload.code !== 0 || !payload.data) {
    const providerMessage = asNonEmptyString(payload.msg)?.toLowerCase() ?? "";
    if (providerMessage.includes("private")) {
      throw new ResolverError("VIDEO_PRIVATE", "This video appears to be private.", 404);
    }
    if (providerMessage.includes("not found") || providerMessage.includes("invalid")) {
      throw new ResolverError("VIDEO_NOT_FOUND", "Video could not be found.", 404);
    }
    throw new ResolverError("RESOLVER_ERROR", "The video provider could not process this link.");
  }

  const id = asNonEmptyString(payload.data.id);
  const images = Array.isArray(payload.data.images)
    ? payload.data.images
      .map(asSafeMediaUrl)
      .filter((url): url is string => Boolean(url))
      .slice(0, 35)
      .map((url, index) => ({ id: `image-${index + 1}`, index: index + 1, url }))
    : [];
  const hasPositiveSize = (value: unknown) => typeof value !== "number" || value > 0;
  const standardUrl = hasPositiveSize(payload.data.size) ? asSafeMediaUrl(payload.data.play) : undefined;
  const hdUrl = hasPositiveSize(payload.data.hd_size) ? asSafeMediaUrl(payload.data.hdplay) : undefined;

  if (!id || (!standardUrl && !hdUrl && images.length === 0)) {
    throw new ResolverError("MEDIA_NOT_AVAILABLE", "No downloadable media source was returned.", 404);
  }

  const formats: ResolvedMediaFormat[] = [];
  if (hdUrl) {
    formats.push({ id: "hd", type: "video", format: "mp4", quality: "HD", watermark: false, url: hdUrl });
  }
  if (standardUrl && standardUrl !== hdUrl) {
    formats.push({ id: "original", type: "video", format: "mp4", quality: "Original", watermark: false, url: standardUrl });
  }

  const audioUrl = asSafeMediaUrl(payload.data.music);
  const duration = typeof payload.data.duration === "number" && Number.isFinite(payload.data.duration)
    ? Math.max(0, Math.round(payload.data.duration))
    : 0;

  return {
    id,
    mediaType: images.length === 1 ? "photo" : images.length > 1 ? "slideshow" : "video",
    title: asNonEmptyString(payload.data.title) ?? (images.length === 1 ? "TikTok photo" : images.length > 1 ? "TikTok slideshow" : "TikTok video"),
    author: {
      username: asNonEmptyString(payload.data.author?.unique_id) ?? "tiktok",
      displayName: asNonEmptyString(payload.data.author?.nickname),
    },
    thumbnail: asSafeMediaUrl(payload.data.cover) ?? asSafeMediaUrl(payload.data.origin_cover),
    duration,
    formats: images.length > 0 ? [] : formats,
    images,
    audio: { available: Boolean(audioUrl), ...(audioUrl ? { url: audioUrl } : {}) },
  };
}

export async function resolveTikTokVideo(url: string): Promise<ResolvedVideo> {
  const body = new URLSearchParams({ url, hd: "1" });

  let response: Response;
  try {
    response = await fetch(TIKWM_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        "User-Agent": "Vidrop/0.1 (+https://github.com/NaufalDsp/vidrop)",
      },
      body,
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
  } catch (error) {
    if (error instanceof Error && error.name === "TimeoutError") {
      throw new ResolverError("REQUEST_TIMEOUT", "The resolver took too long to respond.", 504);
    }
    throw new ResolverError("NETWORK_ERROR", "The resolver could not be reached.", 502);
  }

  if (response.status === 429) {
    throw new ResolverError("RATE_LIMITED", "Too many requests. Try again shortly.", 429);
  }
  if (!response.ok) {
    throw new ResolverError("RESOLVER_ERROR", "The resolver returned an unexpected response.", 502);
  }

  let payload: TikwmPayload;
  try {
    payload = (await response.json()) as TikwmPayload;
  } catch {
    throw new ResolverError("RESOLVER_ERROR", "The resolver returned invalid data.", 502);
  }

  return normalizeTikwmPayload(payload);
}
