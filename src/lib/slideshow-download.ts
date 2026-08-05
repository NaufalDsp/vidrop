import { zipSync } from "fflate";
import type { SlideshowImage } from "../types/video";

function extensionFor(blob: Blob) {
  if (blob.type.includes("png")) return "png";
  if (blob.type.includes("webp")) return "webp";
  return "jpg";
}

async function fetchImage(image: SlideshowImage, postId: string) {
  const response = await fetch(image.url);
  if (!response.ok) throw new Error(`IMAGE_${image.index}_FAILED`);
  const blob = await response.blob();
  return {
    name: `vidrop-${postId}-${String(image.index).padStart(2, "0")}.${extensionFor(blob)}`,
    bytes: new Uint8Array(await blob.arrayBuffer()),
  };
}

export async function createSlideshowZip(
  images: SlideshowImage[],
  postId: string,
  onProgress: (completed: number, total: number) => void,
) {
  const files: Record<string, Uint8Array> = {};
  let nextIndex = 0;
  let completed = 0;

  async function worker() {
    while (nextIndex < images.length) {
      const image = images[nextIndex++];
      const file = await fetchImage(image, postId);
      files[file.name] = file.bytes;
      completed += 1;
      onProgress(completed, images.length);
    }
  }

  await Promise.all(Array.from({ length: Math.min(4, images.length) }, () => worker()));
  return new Blob([zipSync(files, { level: 0 })], { type: "application/zip" });
}
