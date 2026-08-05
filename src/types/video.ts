export type MediaFormat = {
  id: string;
  type: "video" | "audio";
  format: "mp4" | "mp3";
  quality: string;
  watermark?: boolean;
  url: string;
};

export type VideoData = {
  id: string;
  title: string;
  author: { username: string; displayName?: string };
  thumbnail?: string;
  duration: number;
  formats: MediaFormat[];
  audio?: { available: boolean; url?: string };
};

export type DownloadStatus = "idle" | "loading" | "success" | "error";
