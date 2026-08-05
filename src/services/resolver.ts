import type { ResolvedMedia } from "../types/media";

type ResolverResponse =
  | { success: true; data: ResolvedMedia }
  | { success: false; error: { code: string; message: string } };

export async function resolveMedia(url: string, signal?: AbortSignal): Promise<ResolvedMedia> {
  const response = await fetch("/api/resolve", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
    signal,
  });

  const payload = await response.json().catch(() => null) as ResolverResponse | null;
  if (!response.ok) {
    if (payload && !payload.success) throw new Error(payload.error.code || "RESOLVER_ERROR");
    if (response.status === 404) throw new Error("API_NOT_CONFIGURED");
    if (response.status === 429) throw new Error("RATE_LIMITED");
    throw new Error("RESOLVER_ERROR");
  }

  if (!payload) throw new Error("RESOLVER_ERROR");
  if (!payload.success) throw new Error(payload.error.code || "RESOLVER_ERROR");
  return payload.data;
}
