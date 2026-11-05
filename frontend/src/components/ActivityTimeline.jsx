import { relativeTime } from "../utils/format";

export default function ActivityTimeline({ lead }) {
  if (!lead) return null;

  const events = [];
  events.push({ ts: lead.created_at, label: "Lead created", type: "CREATE" });
  if (lead.analysis) events.push({ ts: lead.updated_at, label: "AI analysis completed", type: "AI" });
  if (lead.analysis_error) events.push({ ts: lead.updated_at, label: `Analysis failed: ${lead.analysis_error}`, type: "ERROR" });
  if (lead.follow_up) events.push({ ts: lead.updated_at, label: "Follow-up strategy generated", type: "FOLLOWUP" });
  (lead.chat_history || []).forEach((h, i) => {
    if (h.role === "user") events.push({ ts: h.ts, label: `Copilot Q${i + 1}`, type: "CHAT" });
  });
  events.sort((a, b) => (a.ts || "").localeCompare(b.ts || ""));

  const dotColor = {
    CREATE: "var(--dp-color-annotation)",
    AI: "#2d6a2d",
    ERROR: "var(--dp-color-accent)",
    FOLLOWUP: "#c8a830",
    CHAT: "var(--dp-color-line)",
  };

  return (
    <div className="card" style={{ padding: "20px" }}>
      <div
        style={{
          fontFamily: "'Caveat', cursive",
          fontSize: "1.15rem",
          fontWeight: 700,
          color: "var(--dp-color-ink)",
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 14,
          paddingBottom: 10,
          borderBottom: "1.5px solid var(--dp-color-line)",
        }}
      >
        {/* clock SVG */}
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="7" stroke="var(--dp-color-line)" strokeWidth="1.5" strokeDasharray="3 1.5" />
          <line x1="8" y1="8" x2="8" y2="4" stroke="var(--dp-color-ink)" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="8" y1="8" x2="11" y2="10" stroke="var(--dp-color-ink)" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        Activity
      </div>

      <div style={{ position: "relative", paddingLeft: 24 }}>
        {/* Dashed vertical line */}
        <div
          style={{
            position: "absolute",
            left: 7,
            top: 6,
            bottom: 6,
            width: 1.5,
            borderLeft: "1.5px dashed var(--dp-color-line)",
          }}
        />

        <ol style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 14 }}>
          {events.map((e, i) => (
            <li key={i} style={{ position: "relative" }}>
              {/* Dot */}
              <span
                style={{
                  position: "absolute",
                  left: -24 + 7 - 4,
                  top: 5,
                  width: 9,
                  height: 9,
                  borderRadius: "50%",
                  background: dotColor[e.type] || "var(--dp-color-line)",
                  border: "2px solid var(--dp-color-ground)",
                  display: "block",
                }}
              />
              <div
                style={{
                  fontFamily: "'Caveat', cursive",
                  fontSize: "1rem",
                  fontWeight: 700,
                  color: e.type === "ERROR" ? "var(--dp-color-accent)" : "var(--dp-color-ink)",
                }}
              >
                {e.label}
              </div>
              <div
                style={{
                  fontFamily: "'Kalam', cursive",
                  fontSize: "0.75rem",
                  color: "var(--dp-color-ink-muted)",
                  marginTop: 1,
                }}
              >
                {relativeTime(e.ts)}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
