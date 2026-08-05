export type MediaFormat = {
  id: string;
  type: "video" | "audio";
  format: "mp4" | "mp3";
  quality: string;
  watermark?: boolean;
  url: string;
};

export type SlideshowImage = {
  id: string;
  index: number;
  url: string;
};

export type VideoData = {
  id: string;
  mediaType: "video" | "photo" | "slideshow";
  title: string;
  author: { username: string; displayName?: string };
  thumbnail?: string;
  duration: number;
  formats: MediaFormat[];
  images: SlideshowImage[];
  audio?: { available: boolean; url?: string };
};

export type DownloadStatus = "idle" | "loading" | "success" | "error";
