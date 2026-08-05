import { ArrowDownToLine, Play } from "lucide-react";

export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <a className="brand" href="#top" aria-label="Vidrop home">
      <span className="brand-mark" aria-hidden="true">
        <ArrowDownToLine size={19} strokeWidth={2.4} />
        <Play className="brand-play" size={8} fill="currentColor" />
      </span>
      {!compact && <span>vidrop</span>}
    </a>
  );
}
