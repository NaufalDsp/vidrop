import { useMemo, useState } from "react";
import { motion } from "motion/react";
import {
  Check, ChevronLeft, ChevronRight, Clock3, Download, Images, LoaderCircle,
  Music2, RotateCcw, ShieldCheck, Video,
} from "lucide-react";
import type { MediaFormat, MediaItem, ResolvedMedia } from "../types/media";

type Props = {
  data: ResolvedMedia;
  notice: string;
  onDownload: (format: MediaFormat) => Promise<void>;
  onImageDownload: (image: MediaItem) => Promise<void>;
  onSlideshowDownload: (onProgress: (completed: number, total: number) => void) => Promise<void>;
  onReset: () => void;
};

export function ResultCard({ data, notice, onDownload, onImageDownload, onSlideshowDownload, onReset }: Props) {
  const videoFormats = useMemo(() => data.formats.filter((item) => item.type === "video"), [data.formats]);
  const isPhotoPost = data.mediaType === "photo" && data.images.length === 1;
  const isSlideshow = data.mediaType === "slideshow" && data.images.length > 1;
  const isCarousel = data.mediaType === "carousel" && data.items.length > 1;
  const isCollection = isSlideshow || isCarousel;
  const isImagePost = isPhotoPost || isCollection;
  const [selectedId, setSelectedId] = useState(videoFormats[0]?.id ?? "");
  const [mode, setMode] = useState<"video" | "audio">("video");
  const [slideIndex, setSlideIndex] = useState(0);
  const [downloadMode, setDownloadMode] = useState<"idle" | "single" | "all">("idle");
  const [progress, setProgress] = useState({ completed: 0, total: 0 });
  const selected = videoFormats.find((item) => item.id === selectedId) ?? videoFormats[0];
  const currentItem = data.items[slideIndex];
  const downloadItem: MediaFormat | undefined = mode === "video" ? selected : data.audio?.url ? {
    id: "audio", type: "audio", format: "mp3", quality: "Audio", url: data.audio.url,
  } : undefined;

  function moveSlide(direction: number) {
    setSlideIndex((current) => (current + direction + data.items.length) % data.items.length);
  }

  async function runSingleImageDownload() {
    if (!currentItem) return;
    setDownloadMode("single");
    try { await onImageDownload(currentItem); } finally { setDownloadMode("idle"); }
  }

  async function runSlideshowDownload() {
    setDownloadMode("all");
    setProgress({ completed: 0, total: data.items.length });
    try { await onSlideshowDownload((completed, total) => setProgress({ completed, total })); }
    catch { /* The parent displays the actionable error message. */ }
    finally { setDownloadMode("idle"); }
  }

  return (
    <motion.section id="result" className="result-card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      <div className={`video-preview ${isImagePost ? "slideshow-preview" : ""}`}>
        {isImagePost ? (
          <>
            {currentItem.type === "video" ? <video src={currentItem.url} poster={currentItem.thumbnail} controls playsInline /> : <img src={currentItem.url} alt={isPhotoPost ? `Photo from ${data.title}` : `Item ${currentItem.index} of ${data.items.length} from ${data.title}`} />}
            {isCollection && <><button type="button" className="slide-control previous" onClick={() => moveSlide(-1)} aria-label="Previous item"><ChevronLeft size={22} /></button><button type="button" className="slide-control next" onClick={() => moveSlide(1)} aria-label="Next item"><ChevronRight size={22} /></button><span className="slide-counter"><Images size={13} /> {currentItem.index} / {data.items.length}</span></>}
            <span className="preview-label">{isPhotoPost ? "Photo post" : isCarousel ? "Instagram carousel" : "Photo slideshow"}</span>
          </>
        ) : (
          <>
            {selected?.url ? <video src={selected.url} poster={data.thumbnail} controls playsInline /> : <div className="preview-art" aria-label="Video preview placeholder"><span className="sun" /><span className="horizon" /><span className="street-line one" /><span className="street-line two" /></div>}
            <span className="duration"><Clock3 size={13} /> 0:{String(data.duration).padStart(2, "0")}</span>
            <span className="preview-label">Preview</span>
          </>
        )}
      </div>

      <div className="result-content">
        <div className="creator-row">
          <div><span className="platform-name">{data.platform === "instagram" ? "Instagram" : "TikTok"}</span><span className="display-name">{data.author.displayName}</span><span className="username">@{data.author.username}</span></div>
          <span className="clean-badge"><ShieldCheck size={14} /> {isPhotoPost ? "1 photo" : isCollection ? `${data.items.length} items` : "No watermark"}</span>
        </div>
        <p className="caption">{data.title}</p>

        {isImagePost ? (
          <div className="slideshow-actions">
            <button className="secondary-download-button" type="button" disabled={downloadMode !== "idle"} onClick={() => void runSingleImageDownload()}>
              {downloadMode === "single" ? <LoaderCircle className="spin" size={18} /> : <Download size={18} />}
              {downloadMode === "single" ? "Preparing media..." : `Download ${currentItem.type === "video" ? "video" : "image"} ${currentItem.index}`}
            </button>
            {isCollection && (
              <button className="primary-button download-button" type="button" disabled={downloadMode !== "idle"} onClick={() => void runSlideshowDownload()}>
                {downloadMode === "all" ? <LoaderCircle className="spin" size={19} /> : <Images size={19} />}
                {downloadMode === "all" ? `Preparing ${progress.completed} of ${progress.total}...` : "Download all media (.zip)"}
              </button>
            )}
            {data.audio?.available && (
              <button className="audio-download-button" type="button" disabled={downloadMode !== "idle"} onClick={() => data.audio?.url && void onDownload({ id: "audio", type: "audio", format: "mp3", quality: "Audio", url: data.audio.url })}>
                <Music2 size={16} /> Download post audio
              </button>
            )}
          </div>
        ) : (
          <>
            {videoFormats.length > 1 && <fieldset className="control-group"><legend>Video quality</legend><div className="choice-grid quality-grid">{videoFormats.map((format) => <button className={selectedId === format.id ? "selected" : ""} type="button" key={format.id} onClick={() => setSelectedId(format.id)}>{format.quality}{selectedId === format.id && <Check size={15} />}</button>)}</div></fieldset>}
            <fieldset className="control-group"><legend>Format</legend><div className="choice-grid format-grid"><button className={mode === "video" ? "selected" : ""} type="button" onClick={() => setMode("video")}><Video size={17} /> Video MP4</button><button className={mode === "audio" ? "selected" : ""} type="button" disabled={!data.audio?.available} onClick={() => setMode("audio")}><Music2 size={17} /> Audio MP3</button></div></fieldset>
            <button className="primary-button download-button" type="button" disabled={!downloadItem || downloadMode !== "idle"} onClick={async () => { if (!downloadItem) return; setDownloadMode("single"); try { await onDownload(downloadItem); } finally { setDownloadMode("idle"); } }}>
              {downloadMode === "single" ? <LoaderCircle className="spin" size={19} /> : <Download size={19} />}{downloadMode === "single" ? "Preparing download..." : `Download ${mode === "video" ? "video" : "audio"}`}
            </button>
          </>
        )}
        {notice && <p className="result-notice" role="status">{notice}</p>}
        <button className="reset-button" type="button" onClick={onReset}><RotateCcw size={15} /> Download another post</button>
      </div>
    </motion.section>
  );
}
