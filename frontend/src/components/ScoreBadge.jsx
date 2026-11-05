export default function ScoreBadge({ score = 0, priority, urgency, confidence, size = "md" }) {
  const dim = size === "sm" ? 52 : 68;
  const r = size === "sm" ? 20 : 26;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(100, score));
  const offset = c - (pct / 100) * c;

  const priorityColor = { HOT: "#9e3a2e", WARM: "#c8a830", COLD: "#8a8278" };
  const priorityBg = { HOT: "rgba(158,58,46,0.1)", WARM: "rgba(240,223,160,0.4)", COLD: "rgba(179,172,157,0.15)" };
  const col = priorityColor[priority] || "#b3ac9d";
  const bg = priorityBg[priority] || "rgba(179,172,157,0.1)";

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      {/* Sketch score circle */}
      <div style={{ position: "relative", width: dim, height: dim }}>
        <svg
          width={dim}
          height={dim}
          viewBox={`0 0 ${dim} ${dim}`}
          style={{ transform: "rotate(-90deg)" }}
        >
          {/* Rough outer ring */}
          <circle
            cx={dim / 2}
            cy={dim / 2}
            r={r}
            strokeWidth="3"
            stroke="var(--dp-color-line)"
            fill="none"
            strokeDasharray="4 2"
          />
          {/* Score arc */}
          <circle
            cx={dim / 2}
            cy={dim / 2}
            r={r}
            strokeWidth="4"
            fill="none"
            stroke={col}
            strokeLinecap="round"
            style={{
              strokeDasharray: c,
              strokeDashoffset: offset,
              transition: "stroke-dashoffset 500ms ease",
            }}
          />
        </svg>
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "'Caveat', cursive",
            fontSize: size === "sm" ? "1rem" : "1.25rem",
            fontWeight: 800,
            color: col,
          }}
        >
          {pct}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {/* Priority badge */}
        <span
          style={{
            fontFamily: "'Caveat', cursive",
            fontSize: "0.9rem",
            fontWeight: 700,
            color: col,
            background: bg,
            border: `1.5px solid ${col}`,
            borderRadius: "20px 6px 20px 6px / 6px 20px 6px 20px",
            padding: "1px 10px",
            display: "inline-block",
          }}
        >
          {priority || "—"}
        </span>
        {/* Meta */}
        <span
          style={{
            fontFamily: "'Kalam', cursive",
            fontSize: "0.78rem",
            color: "var(--dp-color-ink-muted)",
          }}
        >
          {urgency} urgency · {confidence} conf.
        </span>
      </div>
    </div>
  );
}
