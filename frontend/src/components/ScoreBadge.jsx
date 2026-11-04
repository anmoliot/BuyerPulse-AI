import { PRIORITY_COLORS } from "../utils/priority";

export default function ScoreBadge({ score = 0, priority, urgency, confidence, size = "md" }) {
  const r = size === "sm" ? 20 : 26;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(100, score));
  const stroke = `stroke-dasharray:${c};stroke-dashoffset:${c - (pct / 100) * c}`;

  return (
    <div className="flex items-center gap-3">
      <div className="relative" style={{ width: r * 2 + 8, height: r * 2 + 8 }}>
        <svg width={r * 2 + 8} height={r * 2 + 8} className="rotate-[-90deg]">
          <circle cx={r + 4} cy={r + 4} r={r} strokeWidth="4" className="stroke-ink-700" fill="none" />
          <circle
            cx={r + 4}
            cy={r + 4}
            r={r}
            strokeWidth="4"
            fill="none"
            className="stroke-accent"
            style={{ strokeDasharray: c, strokeDashoffset: c - (pct / 100) * c, transition: "stroke-dashoffset 400ms" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center text-sm font-semibold">
          {pct}
        </div>
      </div>
      <div className="flex flex-col">
        <span className={`chip ${PRIORITY_COLORS[priority] || ""}`}>{priority || "—"}</span>
        <span className="text-xs text-slate-400 mt-1">
          {urgency} urgency · {confidence} conf.
        </span>
      </div>
    </div>
  );
}
