export type Platform = "tiktok" | "instagram";
export type MediaType = "video" | "photo" | "slideshow" | "carousel";

export type ResolvedMediaFormat = {
  id: string;
  type: "video";
  format: "mp4";
  quality: string;
  watermark?: false;
  url: string;
};

export type ResolvedMediaItem = {
  id: string;
  index: number;
  type: "photo" | "video";
  url: string;
  thumbnail?: string;
};

export type ResolvedMedia = {
  id: string;
  platform: Platform;
  mediaType: MediaType;
  title: string;
  author: { username: string; displayName?: string };
  thumbnail?: string;
  duration: number;
  formats: ResolvedMediaFormat[];
  items: ResolvedMediaItem[];
  images: ResolvedMediaItem[];
  audio?: { available: boolean; url?: string };
};
