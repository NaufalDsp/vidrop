import type { Platform } from "./media-types.js";
import { resolveInstagramMedia } from "./instagram-resolver.js";
import { ResolverError } from "./resolver-error.js";
import { resolveTikTokMedia } from "./tiktok-resolver.js";

const platformHosts: Record<Platform, Set<string>> = {
  tiktok: new Set(["tiktok.com", "www.tiktok.com", "m.tiktok.com", "vm.tiktok.com", "vt.tiktok.com"]),
  instagram: new Set(["instagram.com", "www.instagram.com", "m.instagram.com"]),
};

export function parseMediaUrl(value: unknown): { url: string; platform: Platform } {
  if (typeof value !== "string" || value.length > 2_048) throw new ResolverError("INVALID_URL", "Enter a valid media URL.", 400);
  let parsed: URL;
  try { parsed = new URL(value.trim()); } catch { throw new ResolverError("INVALID_URL", "Enter a complete media URL.", 400); }
  if (parsed.protocol !== "https:") throw new ResolverError("UNSUPPORTED_URL", "Only secure TikTok and Instagram links are supported.", 400);
  const hostname = parsed.hostname.toLowerCase();
  const platform = (Object.entries(platformHosts) as Array<[Platform, Set<string>]>).find(([, hosts]) => hosts.has(hostname))?.[0];
  if (!platform) throw new ResolverError("UNSUPPORTED_PLATFORM", "Vidrop currently supports TikTok and Instagram links.", 400);
  parsed.hash = "";
  return { url: parsed.toString(), platform };
}

export function resolveMedia(url: string, platform: Platform) {
  if (platform === "tiktok") return resolveTikTokMedia(url);
  return resolveInstagramMedia(url);
}
