import type { VideoData } from "../types/video";

type ResolverResponse =
  | { success: true; data: VideoData }
  | { success: false; error: { code: string; message: string } };

export async function resolveVideo(url: string, signal?: AbortSignal): Promise<VideoData> {
  const response = await fetch("/api/resolve", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
    signal,
  });

  if (!response.ok) {
    if (response.status === 404) throw new Error("API_NOT_CONFIGURED");
    if (response.status === 429) throw new Error("RATE_LIMITED");
    throw new Error("RESOLVER_ERROR");
  }

  const payload = (await response.json()) as ResolverResponse;
  if (!payload.success) throw new Error(payload.error.code || "RESOLVER_ERROR");
  return payload.data;
}

export async function getDemoVideo(): Promise<VideoData> {
  await new Promise((resolve) => window.setTimeout(resolve, 1350));
  return {
    id: "vidrop-demo",
    title: "Golden hour, quiet streets, and a little reminder to slow down.",
    author: { username: "madebyvidrop", displayName: "Vidrop Studio" },
    duration: 24,
    formats: [
      { id: "original", type: "video", format: "mp4", quality: "Original", watermark: false, url: "#demo-download" },
      { id: "1080", type: "video", format: "mp4", quality: "1080p", watermark: false, url: "#demo-download" },
      { id: "720", type: "video", format: "mp4", quality: "720p", watermark: false, url: "#demo-download" },
    ],
    audio: { available: true, url: "#demo-download" },
  };
}
