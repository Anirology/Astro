import { useState } from "react";
import Astro, { type AstroMood } from "./Astro";

export default function AstroGuide({
  mood,
  message,
  hint,
  compact = false,
  onHint,
}: {
  mood: AstroMood;
  message: string;
  hint?: string;
  compact?: boolean;
  onHint?: () => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`astro-guide ${compact ? "astro-guide-compact" : ""}`}>
      <Astro mood={mood} small />
      <div className="astro-guide-copy">
        <span className="eyebrow turquoise">ASTRO'S TIP</span>
        <p>{message}</p>
        {hint && (
          <button
            className="hint-toggle"
            type="button"
            onClick={() => {
              setOpen(!open);
              onHint?.();
            }}
            aria-expanded={open}
          >
            {open ? "Hide hint" : "Need a hint?"}
          </button>
        )}
        {open && hint && <p className="hint-content">{hint}</p>}
      </div>
    </div>
  );
}
