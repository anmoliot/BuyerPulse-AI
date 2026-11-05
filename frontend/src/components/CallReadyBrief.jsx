import CopyButton from "./CopyButton";

export default function CallReadyBrief({ lead, analysis }) {
  if (!lead || !analysis) return null;
  const opening = analysis.suggested_response || "Hi, thanks for reaching out. Let me help you with your requirement.";
  const primary = analysis.objections?.[0];

  return (
    <div className="card" style={{ padding: "20px" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 14,
          paddingBottom: 10,
          borderBottom: "1.5px solid var(--dp-color-line)",
        }}
      >
        <span
          style={{
            fontFamily: "'Caveat', cursive",
            fontSize: "1.15rem",
            fontWeight: 700,
            color: "var(--dp-color-ink)",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          📋 Call-Ready Brief
        </span>
        <span
          style={{
            fontFamily: "'Kalam', cursive",
            fontSize: "0.72rem",
            color: "var(--dp-color-ink-muted)",
            background: "var(--dp-color-highlight)",
            border: "1px solid #c8a830",
            borderRadius: "8px 2px 8px 2px / 2px 8px 2px 8px",
            padding: "1px 8px",
          }}
        >
          read in &lt; 30s
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <BriefRow label="Requirement" value={lead.intake.property_requirement} />
        <BriefRow label="Budget & timeline" value={`${lead.intake.budget} · ${lead.intake.buying_timeline}`} />
        <BriefRow label="Primary objection" value={primary ? `${primary.type} — ${primary.detail}` : "None"} />
        <BriefRow label="Best next action" value={analysis.recommended_action} />

        {/* Opening line */}
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
            <span
              style={{
                fontFamily: "'Caveat', cursive",
                fontSize: "0.78rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "var(--dp-color-annotation)",
              }}
            >
              Opening line
            </span>
            <CopyButton text={opening} />
          </div>
          <div
            style={{
              background: "rgba(255,255,255,0.7)",
              border: "1.5px solid var(--dp-color-annotation)",
              borderRadius: "5px 2px 10px 3px / 2px 8px 3px 5px",
              padding: "10px 14px",
              fontFamily: "'Kalam', cursive",
              fontSize: "0.9rem",
              color: "var(--dp-color-ink)",
              fontStyle: "italic",
              boxShadow: "inset 2px 2px 0 0 rgba(52,76,105,0.06)",
            }}
          >
            "{opening}"
          </div>
        </div>

        {/* Discovery questions */}
        <div>
          <div
            style={{
              fontFamily: "'Caveat', cursive",
              fontSize: "0.78rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: "var(--dp-color-annotation)",
              marginBottom: 6,
            }}
          >
            Questions to ask
          </div>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 5 }}>
            {(analysis.discovery_questions || []).map((q, i) => (
              <li
                key={i}
                style={{
                  fontFamily: "'Kalam', cursive",
                  fontSize: "0.85rem",
                  color: "var(--dp-color-ink)",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 8,
                }}
              >
                <span style={{ color: "var(--dp-color-accent)", fontWeight: 700, fontFamily: "'Caveat', cursive", fontSize: "1rem" }}>?</span>
                {q}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function BriefRow({ label, value }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <span
        style={{
          fontFamily: "'Caveat', cursive",
          fontSize: "0.72rem",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          color: "var(--dp-color-annotation)",
        }}
      >
        {label}
      </span>
      <span style={{ fontFamily: "'Kalam', cursive", fontSize: "0.9rem", color: "var(--dp-color-ink)" }}>{value}</span>
    </div>
  );
}
