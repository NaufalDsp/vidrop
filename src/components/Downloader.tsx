import { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Check,
  Clipboard,
  Download,
  Link2,
  LoaderCircle,
  RotateCcw,
  Sparkles,
  XCircle,
} from "lucide-react";
import { validateTikTokUrl } from "../lib/validation";
import { resolveVideo } from "../services/resolver";
import type { DownloadStatus, MediaFormat, VideoData } from "../types/video";
import { ResultCard } from "./ResultCard";

function getErrorMessage(code: string) {
  const messages: Record<string, string> = {
    VIDEO_PRIVATE: "This video appears to be private.",
    VIDEO_REMOVED: "This video is no longer available.",
    VIDEO_NOT_FOUND: "We couldn't find a video at that link.",
    RATE_LIMITED: "Too many requests. Please try again shortly.",
    REQUEST_TIMEOUT: "The resolver took too long. Please try again.",
    MEDIA_NOT_AVAILABLE: "No downloadable video source is available for this post.",
    UNSUPPORTED_URL: "Only public TikTok video links are supported.",
    API_NOT_CONFIGURED: "The video resolver is not available right now.",
    NETWORK_ERROR: "Check your connection and try again.",
  };
  return messages[code] ?? "We couldn't process this video right now.";
}

export function Downloader() {
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState<DownloadStatus>("idle");
  const [message, setMessage] = useState("");
  const [data, setData] = useState<VideoData | null>(null);
  const [pasted, setPasted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const validation = url ? validateTikTokUrl(url) : null;

  async function handlePaste() {
    try {
      const clipboardText = await navigator.clipboard.readText();
      setUrl(clipboardText);
      setPasted(true);
      window.setTimeout(() => setPasted(false), 1200);
    } catch {
      inputRef.current?.focus();
      setMessage("Paste permission was blocked. Use Ctrl+V instead.");
    }
  }

  async function processVideo() {
    const parsed = validateTikTokUrl(url);
    if (!parsed.success) {
      setMessage(parsed.error.issues[0]?.message ?? "Enter a valid TikTok URL.");
      setStatus("idle");
      return;
    }

    setMessage("");
    setData(null);
    setStatus("loading");
    try {
      const video = await resolveVideo(parsed.data);
      setData(video);
      setStatus("success");
      window.setTimeout(() => document.getElementById("result")?.scrollIntoView({ behavior: "smooth", block: "center" }), 80);
    } catch (error) {
      const code = error instanceof Error ? error.message : "RESOLVER_ERROR";
      setMessage(getErrorMessage(code));
      setStatus("error");
    }
  }

  function reset() {
    setUrl("");
    setData(null);
    setMessage("");
    setStatus("idle");
    window.setTimeout(() => inputRef.current?.focus(), 50);
  }

  async function startDownload(format: MediaFormat) {
    setMessage("");
    try {
      const response = await fetch(format.url);
      if (!response.ok) throw new Error("MEDIA_DOWNLOAD_FAILED");

      const objectUrl = URL.createObjectURL(await response.blob());
      const anchor = document.createElement("a");
      anchor.href = objectUrl;
      anchor.download = `vidrop-${data?.id ?? "tiktok"}.${format.format}`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1_000);
      setMessage("Your download has started.");
    } catch {
      setMessage("The direct download was blocked. The media has been opened in a new tab instead.");
      window.open(format.url, "_blank", "noopener,noreferrer");
    }
  }

  return (
    <>
      <motion.section
        className="hero"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      >
        <div className="eyebrow"><Sparkles size={14} /> Clean video. Zero clutter.</div>
        <h1>Drop the link.<br /><span>Keep the moment.</span></h1>
        <p className="hero-copy">Download TikTok videos in the best available quality—fast, simple, and without an account.</p>

        <form className="download-form" onSubmit={(event) => { event.preventDefault(); void processVideo(); }} noValidate>
          <label className="sr-only" htmlFor="tiktok-url">TikTok video URL</label>
          <div className={`url-field ${validation?.success ? "valid" : ""} ${url && validation && !validation.success ? "invalid" : ""}`}>
            <Link2 size={20} aria-hidden="true" />
            <input
              ref={inputRef}
              id="tiktok-url"
              type="url"
              value={url}
              onChange={(event) => { setUrl(event.target.value); setMessage(""); }}
              placeholder="Paste a TikTok video URL"
              autoComplete="url"
              disabled={status === "loading"}
              aria-invalid={Boolean(url && validation && !validation.success)}
              aria-describedby="url-feedback"
            />
            {validation?.success && <Check className="valid-check" size={18} aria-hidden="true" />}
            <button className="paste-button" type="button" onClick={() => void handlePaste()} disabled={status === "loading"}>
              {pasted ? <Check size={16} /> : <Clipboard size={16} />}
              {pasted ? "Pasted" : "Paste"}
            </button>
          </div>
          <div id="url-feedback" className="form-feedback" aria-live="polite">
            {url && validation && !validation.success ? validation.error.issues[0]?.message : message && status === "idle" ? message : " "}
          </div>
          <button className="primary-button" type="submit" disabled={!validation?.success || status === "loading"}>
            {status === "loading" ? <><LoaderCircle className="spin" size={19} /> Finding your video...</> : <><Download size={19} /> Get video</>}
          </button>
        </form>

        <div className="trust-row" aria-label="Product benefits">
          <span><Check size={14} /> No login</span>
          <span><Check size={14} /> No link history</span>
          <span><Check size={14} /> Mobile ready</span>
        </div>
      </motion.section>

      <AnimatePresence mode="wait">
        {status === "loading" && <LoadingCard key="loading" />}
        {status === "success" && data && (
          <ResultCard key="result" data={data} onDownload={startDownload} onReset={reset} notice={message} />
        )}
        {status === "error" && (
          <motion.section id="result" className="error-card" key="error" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <span className="error-icon"><XCircle size={24} /></span>
            <h2>We couldn't fetch this video.</h2>
            <p>{message}</p>
            <div className="error-actions">
              <button type="button" className="secondary-button" onClick={() => void processVideo()}><RotateCcw size={17} /> Try again</button>
              <button type="button" className="text-button" onClick={reset}>Use another link</button>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </>
  );
}

function LoadingCard() {
  return (
    <motion.section id="result" className="result-card loading-card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} aria-live="polite">
      <div className="skeleton preview-skeleton" />
      <div className="skeleton-content">
        <div><span className="loading-kicker"><LoaderCircle className="spin" size={16} /> Finding video...</span><p>This may take a few seconds.</p></div>
        <div className="skeleton line short" /><div className="skeleton line" /><div className="skeleton line medium" />
        <div className="skeleton pills" /><div className="skeleton button-skeleton" />
      </div>
    </motion.section>
  );
}
