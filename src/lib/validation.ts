import { z } from "zod";

const tiktokHosts = new Set([
  "tiktok.com",
  "www.tiktok.com",
  "m.tiktok.com",
  "vm.tiktok.com",
  "vt.tiktok.com",
]);
const instagramHosts = new Set(["instagram.com", "www.instagram.com", "m.instagram.com"]);

export const mediaUrlSchema = z
  .string()
  .trim()
  .url("Enter a complete TikTok or Instagram URL.")
  .refine((value) => {
    try {
      const parsed = new URL(value);
      const host = parsed.hostname.toLowerCase();
      if (tiktokHosts.has(host)) return true;
      return instagramHosts.has(host) && /^\/(?:p|reel|reels|tv)\/[^/]+/i.test(parsed.pathname);
    } catch {
      return false;
    }
  }, "Use a public TikTok post or Instagram post/Reel link.");

export function validateMediaUrl(value: string) {
  return mediaUrlSchema.safeParse(value);
}
