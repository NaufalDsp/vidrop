import { z } from "zod";

const allowedHosts = new Set([
  "tiktok.com",
  "www.tiktok.com",
  "m.tiktok.com",
  "vm.tiktok.com",
  "vt.tiktok.com",
]);

export const tiktokUrlSchema = z
  .string()
  .trim()
  .url("Enter a complete TikTok URL.")
  .refine((value) => {
    try {
      return allowedHosts.has(new URL(value).hostname.toLowerCase());
    } catch {
      return false;
    }
  }, "That doesn't look like a TikTok video link.");

export function validateTikTokUrl(value: string) {
  return tiktokUrlSchema.safeParse(value);
}
