export type Platform = "tiktok" | "instagram";
export type MediaType = "video" | "photo" | "slideshow" | "carousel";

export type MediaFormat = {
  id: string;
  type: "video" | "audio";
  format: "mp4" | "mp3";
  quality: string;
  watermark?: boolean;
  url: string;
};

export type MediaItem = {
  id: string;
  index: number;
  url: string;
  type: "photo" | "video";
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
  formats: MediaFormat[];
  images: MediaItem[];
  items: MediaItem[];
  audio?: { available: boolean; url?: string };
};

export type DownloadStatus = "idle" | "loading" | "success" | "error";
