import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { Check, Clock3, Download, LoaderCircle, Music2, Play, RotateCcw, ShieldCheck, Video } from "lucide-react";
import type { MediaFormat, VideoData } from "../types/video";

type Props = {
  data: VideoData;
  notice: string;
  onDownload: (format: MediaFormat) => Promise<void>;
  onReset: () => void;
};

export function ResultCard({ data, notice, onDownload, onReset }: Props) {
  const videoFormats = useMemo(() => data.formats.filter((item) => item.type === "video"), [data.formats]);
  const [selectedId, setSelectedId] = useState(videoFormats[0]?.id ?? "");
  const [mode, setMode] = useState<"video" | "audio">("video");
  const [isDownloading, setIsDownloading] = useState(false);
  const selected = videoFormats.find((item) => item.id === selectedId) ?? videoFormats[0];
  const downloadItem: MediaFormat | undefined = mode === "video" ? selected : data.audio?.url ? {
    id: "audio",
    type: "audio",
    format: "mp3",
    quality: "Audio",
    url: data.audio.url,
  } : undefined;

  return (
    <motion.section id="result" className="result-card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      <div className="video-preview">
        {data.thumbnail ? <img src={data.thumbnail} alt={`Preview of ${data.title}`} /> : <div className="preview-art" aria-label="Video preview placeholder"><span className="sun" /><span className="horizon" /><span className="street-line one" /><span className="street-line two" /></div>}
        <button type="button" className="play-button" aria-label="Play video preview"><Play size={20} fill="currentColor" /></button>
        <span className="duration"><Clock3 size={13} /> 0:{String(data.duration).padStart(2, "0")}</span>
        <span className="preview-label">Preview</span>
      </div>

      <div className="result-content">
        <div className="creator-row">
          <div><span className="display-name">{data.author.displayName}</span><span className="username">@{data.author.username}</span></div>
          <span className="clean-badge"><ShieldCheck size={14} /> No watermark</span>
        </div>
        <p className="caption">{data.title}</p>

        {videoFormats.length > 1 && (
          <fieldset className="control-group">
            <legend>Video quality</legend>
            <div className="choice-grid quality-grid">
              {videoFormats.map((format) => (
                <button className={selectedId === format.id ? "selected" : ""} type="button" key={format.id} onClick={() => setSelectedId(format.id)}>
                  {format.quality}{selectedId === format.id && <Check size={15} />}
                </button>
              ))}
            </div>
          </fieldset>
        )}

        <fieldset className="control-group">
          <legend>Format</legend>
          <div className="choice-grid format-grid">
            <button className={mode === "video" ? "selected" : ""} type="button" onClick={() => setMode("video")}><Video size={17} /> Video MP4</button>
            <button className={mode === "audio" ? "selected" : ""} type="button" disabled={!data.audio?.available} onClick={() => setMode("audio")}><Music2 size={17} /> Audio MP3</button>
          </div>
        </fieldset>

        <button
          className="primary-button download-button"
          type="button"
          disabled={!downloadItem || isDownloading}
          onClick={async () => {
            if (!downloadItem) return;
            setIsDownloading(true);
            await onDownload(downloadItem);
            setIsDownloading(false);
          }}
        >
          {isDownloading ? <LoaderCircle className="spin" size={19} /> : <Download size={19} />}
          {isDownloading ? "Preparing download..." : `Download ${mode === "video" ? "video" : "audio"}`}
        </button>
        {notice && <p className="result-notice" role="status">{notice}</p>}
        <button className="reset-button" type="button" onClick={onReset}><RotateCcw size={15} /> Download another video</button>
      </div>
    </motion.section>
  );
}
