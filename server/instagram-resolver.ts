import type { ResolvedMedia, ResolvedMediaItem } from "./media-types.js";
import { ResolverError } from "./resolver-error.js";
import { requestCobalt } from "./cobalt-client.js";

const REQUEST_TIMEOUT_MS = 15_000;

function asString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function safeUrl(value: unknown): string | undefined {
  const candidate = asString(value);
  if (!candidate) return undefined;
  try {
    const parsed = new URL(candidate.replaceAll("&amp;", "&"));
    return parsed.protocol === "https:" ? parsed.toString() : undefined;
  } catch { return undefined; }
}

function shortcodeFrom(url: string) {
  const match = new URL(url).pathname.match(/^\/(?:p|reel|reels|tv)\/([^/]+)/i);
  if (!match?.[1]) throw new ResolverError("UNSUPPORTED_URL", "Use a public Instagram post or Reel link.", 400);
  return match[1];
}

function findMediaNode(value: unknown): Record<string, unknown> | undefined {
  if (!value || typeof value !== "object") return undefined;
  if (Array.isArray(value)) {
    for (const child of value) { const found = findMediaNode(child); if (found) return found; }
    return undefined;
  }
  const record = value as Record<string, unknown>;
  if (record.shortcode_media && typeof record.shortcode_media === "object") return record.shortcode_media as Record<string, unknown>;
  if (record.xdt_shortcode_media && typeof record.xdt_shortcode_media === "object") return record.xdt_shortcode_media as Record<string, unknown>;
  if ((record.video_url || record.display_url) && (record.shortcode || record.id)) return record;
  for (const child of Object.values(record)) { const found = findMediaNode(child); if (found) return found; }
  return undefined;
}

function meta(html: string, property: string) {
  const escaped = property.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const patterns = [
    new RegExp(`<meta[^>]+property=["']${escaped}["'][^>]+content=["']([^"']+)["']`, "i"),
    new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+property=["']${escaped}["']`, "i"),
  ];
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match?.[1]) return match[1].replaceAll("&amp;", "&").replaceAll("&quot;", '"');
  }
}

function nodeItems(node: Record<string, unknown>): ResolvedMediaItem[] {
  const sidecar = node.edge_sidecar_to_children as { edges?: Array<{ node?: Record<string, unknown> }> } | undefined;
  const carousel = Array.isArray(node.carousel_media) ? node.carousel_media as Record<string, unknown>[] : undefined;
  const children = sidecar?.edges?.map((edge) => edge.node).filter((item): item is Record<string, unknown> => Boolean(item)) ?? carousel ?? [node];
  return children.flatMap((item, index) => {
    const videoUrl = safeUrl(item.video_url);
    const imageUrl = safeUrl(item.display_url) ?? safeUrl(item.thumbnail_src);
    const url = videoUrl ?? imageUrl;
    if (!url) return [];
    return [{ id: `item-${index + 1}`, index: index + 1, type: videoUrl ? "video" : "photo", url, ...(videoUrl && imageUrl ? { thumbnail: imageUrl } : {}) } satisfies ResolvedMediaItem];
  });
}

function textFromNode(node: Record<string, unknown>, key: string) {
  return asString(node[key]);
}

async function resolveWithConfiguredProvider(url: string, shortcode: string): Promise<ResolvedMedia> {
  const payload = await requestCobalt(url, { downloadMode: "auto" }, "Instagram");
  const status = asString(payload.status);
  let items: ResolvedMediaItem[] = [];
  if (status === "picker" && Array.isArray(payload.picker)) {
    items = payload.picker.slice(0, 35).flatMap((item, index) => {
      const itemUrl = safeUrl(item.url);
      const type = item.type === "video" ? "video" : item.type === "photo" ? "photo" : undefined;
      if (!itemUrl || !type) return [];
      const thumbnail = safeUrl(item.thumb);
      return [{ id: `item-${index + 1}`, index: index + 1, type, url: itemUrl, ...(thumbnail ? { thumbnail } : {}) } satisfies ResolvedMediaItem];
    });
  } else if (status === "redirect" || status === "tunnel") {
    const mediaUrl = safeUrl(payload.url);
    if (mediaUrl) items = [{ id: "item-1", index: 1, type: "video", url: mediaUrl }];
  }
  if (!items.length) {
    const providerCode = asString(payload.error?.code) ?? "unknown";
    throw new ResolverError("MEDIA_NOT_AVAILABLE", `The Instagram provider could not return this media (${providerCode}).`, 404);
  }
  const photos = items.filter((item) => item.type === "photo");
  const first = items[0];
  const isCarousel = items.length > 1;
  const audioUrl = safeUrl(payload.audio);
  return {
    id: shortcode,
    platform: "instagram",
    mediaType: isCarousel ? "carousel" : first.type === "video" ? "video" : "photo",
    title: "Instagram post",
    author: { username: "instagram" },
    thumbnail: first.thumbnail ?? (first.type === "photo" ? first.url : undefined),
    duration: 0,
    formats: !isCarousel && first.type === "video" ? [{ id: "original", type: "video", format: "mp4", quality: "Original", url: first.url }] : [],
    items,
    images: photos,
    audio: { available: Boolean(audioUrl), ...(audioUrl ? { url: audioUrl } : {}) },
  };
}

export async function resolveInstagramMedia(url: string): Promise<ResolvedMedia> {
  const shortcode = shortcodeFrom(url);
  const canonicalUrl = `https://www.instagram.com/p/${encodeURIComponent(shortcode)}/`;
  let response: Response;
  const headers = { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124 Safari/537.36", "Accept-Language": "en-US,en;q=0.9" };
  try {
    response = await fetch(`${canonicalUrl}?__a=1&__d=dis`, {
      headers,
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
    if (!response.ok && response.status !== 429) {
      response = await fetch(canonicalUrl, { headers, signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS) });
    }
  } catch (error) {
    if (error instanceof Error && error.name === "TimeoutError") throw new ResolverError("REQUEST_TIMEOUT", "Instagram took too long to respond.", 504);
    throw new ResolverError("NETWORK_ERROR", "Instagram could not be reached.");
  }

  if (response.status === 429) throw new ResolverError("RATE_LIMITED", "Instagram temporarily limited this request.", 429);
  if (response.status === 404) throw new ResolverError("MEDIA_NOT_FOUND", "This Instagram post could not be found.", 404);
  if (!response.ok) throw new ResolverError("RESOLVER_ERROR", "Instagram returned an unexpected response.");

  const contentType = response.headers.get("content-type") ?? "";
  let node: Record<string, unknown> | undefined;
  let html = "";
  if (contentType.includes("application/json")) {
    node = findMediaNode(await response.json());
  } else {
    html = await response.text();
    for (const match of html.matchAll(/<script[^>]*type=["']application\/json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
      try { node = findMediaNode(JSON.parse(match[1])); } catch { /* Ignore unrelated scripts. */ }
      if (node) break;
    }
  }

  let items = node ? nodeItems(node) : [];
  if (!items.length && html) {
    const videoUrl = safeUrl(meta(html, "og:video"));
    const imageUrl = safeUrl(meta(html, "og:image"));
    if (videoUrl) items = [{ id: "item-1", index: 1, type: "video", url: videoUrl, ...(imageUrl ? { thumbnail: imageUrl } : {}) }];
    else if (imageUrl) items = [{ id: "item-1", index: 1, type: "photo", url: imageUrl }];
  }
  if (!items.length) return resolveWithConfiguredProvider(url, shortcode);

  const owner = node?.owner as Record<string, unknown> | undefined;
  const username = asString(owner?.username) ?? "instagram";
  const displayName = asString(owner?.full_name);
  const title = textFromNode(node ?? {}, "title") ?? meta(html, "og:description") ?? "Instagram post";
  const single = items[0];
  const photos = items.filter((item) => item.type === "photo");
  const isCarousel = items.length > 1;
  return {
    id: shortcode,
    platform: "instagram",
    mediaType: isCarousel ? "carousel" : single.type === "video" ? "video" : "photo",
    title,
    author: { username, ...(displayName ? { displayName } : {}) },
    thumbnail: single.thumbnail ?? (single.type === "photo" ? single.url : undefined),
    duration: 0,
    formats: !isCarousel && single.type === "video" ? [{ id: "original", type: "video", format: "mp4", quality: "Original", url: single.url }] : [],
    items,
    images: photos,
    audio: { available: false },
  };
}
