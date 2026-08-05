import { useMemo, useState } from "react";
import { motion } from "motion/react";
import {
  Check, ChevronLeft, ChevronRight, Clock3, Download, Images, LoaderCircle,
  Music2, Play, RotateCcw, ShieldCheck, Video,
} from "lucide-react";
import type { MediaFormat, SlideshowImage, VideoData } from "../types/video";

type Props = {
  data: VideoData;
  notice: string;
  onDownload: (format: MediaFormat) => Promise<void>;
  onImageDownload: (image: SlideshowImage) => Promise<void>;
  onSlideshowDownload: (onProgress: (completed: number, total: number) => void) => Promise<void>;
  onReset: () => void;
};

export function ResultCard({ data, notice, onDownload, onImageDownload, onSlideshowDownload, onReset }: Props) {
  const videoFormats = useMemo(() => data.formats.filter((item) => item.type === "video"), [data.formats]);
  const isPhotoPost = data.mediaType === "photo" && data.images.length === 1;
  const isSlideshow = data.mediaType === "slideshow" && data.images.length > 1;
  const isImagePost = isPhotoPost || isSlideshow;
  const [selectedId, setSelectedId] = useState(videoFormats[0]?.id ?? "");
  const [mode, setMode] = useState<"video" | "audio">("video");
  const [slideIndex, setSlideIndex] = useState(0);
  const [downloadMode, setDownloadMode] = useState<"idle" | "single" | "all">("idle");
  const [progress, setProgress] = useState({ completed: 0, total: 0 });
  const selected = videoFormats.find((item) => item.id === selectedId) ?? videoFormats[0];
  const currentImage = data.images[slideIndex];
  const downloadItem: MediaFormat | undefined = mode === "video" ? selected : data.audio?.url ? {
    id: "audio", type: "audio", format: "mp3", quality: "Audio", url: data.audio.url,
  } : undefined;

  function moveSlide(direction: number) {
    setSlideIndex((current) => (current + direction + data.images.length) % data.images.length);
  }

  async function runSingleImageDownload() {
    if (!currentImage) return;
    setDownloadMode("single");
    try { await onImageDownload(currentImage); } finally { setDownloadMode("idle"); }
  }

  async function runSlideshowDownload() {
    setDownloadMode("all");
    setProgress({ completed: 0, total: data.images.length });
    try { await onSlideshowDownload((completed, total) => setProgress({ completed, total })); }
    catch { /* The parent displays the actionable error message. */ }
    finally { setDownloadMode("idle"); }
  }

  return (
    <motion.section id="result" className="result-card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      <div className={`video-preview ${isImagePost ? "slideshow-preview" : ""}`}>
        {isImagePost ? (
          <>
            <img src={currentImage.url} alt={isPhotoPost ? `Photo from ${data.title}` : `Slide ${currentImage.index} of ${data.images.length} from ${data.title}`} />
            {isSlideshow && <><button type="button" className="slide-control previous" onClick={() => moveSlide(-1)} aria-label="Previous image"><ChevronLeft size={22} /></button><button type="button" className="slide-control next" onClick={() => moveSlide(1)} aria-label="Next image"><ChevronRight size={22} /></button><span className="slide-counter"><Images size={13} /> {currentImage.index} / {data.images.length}</span></>}
            <span className="preview-label">{isPhotoPost ? "Photo post" : "Photo slideshow"}</span>
          </>
        ) : (
          <>
            {data.thumbnail ? <img src={data.thumbnail} alt={`Preview of ${data.title}`} /> : <div className="preview-art" aria-label="Video preview placeholder"><span className="sun" /><span className="horizon" /><span className="street-line one" /><span className="street-line two" /></div>}
            <button type="button" className="play-button" aria-label="Play video preview"><Play size={20} fill="currentColor" /></button>
            <span className="duration"><Clock3 size={13} /> 0:{String(data.duration).padStart(2, "0")}</span>
            <span className="preview-label">Preview</span>
          </>
        )}
      </div>

      <div className="result-content">
        <div className="creator-row">
          <div><span className="display-name">{data.author.displayName}</span><span className="username">@{data.author.username}</span></div>
          <span className="clean-badge"><ShieldCheck size={14} /> {isPhotoPost ? "1 photo" : isSlideshow ? `${data.images.length} photos` : "No watermark"}</span>
        </div>
        <p className="caption">{data.title}</p>

        {isImagePost ? (
          <div className="slideshow-actions">
            <button className="secondary-download-button" type="button" disabled={downloadMode !== "idle"} onClick={() => void runSingleImageDownload()}>
              {downloadMode === "single" ? <LoaderCircle className="spin" size={18} /> : <Download size={18} />}
              {downloadMode === "single" ? "Preparing image..." : `Download image ${currentImage.index}`}
            </button>
            {isSlideshow && (
              <button className="primary-button download-button" type="button" disabled={downloadMode !== "idle"} onClick={() => void runSlideshowDownload()}>
                {downloadMode === "all" ? <LoaderCircle className="spin" size={19} /> : <Images size={19} />}
                {downloadMode === "all" ? `Preparing ${progress.completed} of ${progress.total}...` : "Download all images (.zip)"}
              </button>
            )}
            {data.audio?.available && (
              <button className="audio-download-button" type="button" disabled={downloadMode !== "idle"} onClick={() => data.audio?.url && void onDownload({ id: "audio", type: "audio", format: "mp3", quality: "Audio", url: data.audio.url })}>
                <Music2 size={16} /> Download {isPhotoPost ? "photo" : "slideshow"} audio
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
