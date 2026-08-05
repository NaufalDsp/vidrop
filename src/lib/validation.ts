import { z } from "zod";

const tiktokHosts = new Set([
  "tiktok.com",
  "www.tiktok.com",
  "m.tiktok.com",
  "vm.tiktok.com",
  "vt.tiktok.com",
]);
export const mediaUrlSchema = z
  .string()
  .trim()
  .url("Enter a complete TikTok URL.")
  .refine((value) => {
    try {
      const parsed = new URL(value);
      return parsed.protocol === "https:" && tiktokHosts.has(parsed.hostname.toLowerCase());
    } catch {
      return false;
    }
  }, "Use a public TikTok post link.");

export function validateMediaUrl(value: string) {
  return mediaUrlSchema.safeParse(value);
}
