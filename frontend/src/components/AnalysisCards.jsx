export default function AnalysisCards({ analysis }) {
  if (!analysis) return null;

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
      {/* Summary scrap */}
      <div
        className="card"
        style={{ padding: "16px 20px" }}
      >
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
          ✏ Summary
        </div>
        <p style={{ fontFamily: "'Kalam', cursive", fontSize: "0.9rem", color: "var(--dp-color-ink)", lineHeight: 1.6 }}>
          {analysis.summary}
        </p>
      </div>

      {/* Intent scrap */}
      <div className="card" style={{ padding: "16px 20px" }}>
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
          → Intent
        </div>
        <p style={{ fontFamily: "'Kalam', cursive", fontSize: "0.9rem", color: "var(--dp-color-ink)", lineHeight: 1.6 }}>
          {analysis.intent}
        </p>
      </div>

      {/* Requirements chips */}
      <div className="card" style={{ padding: "16px 20px", gridColumn: "1 / -1" }}>
        <div
          style={{
            fontFamily: "'Caveat', cursive",
            fontSize: "0.78rem",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            color: "var(--dp-color-annotation)",
            marginBottom: 10,
          }}
        >
          ☑ Requirements
        </div>
        <ul style={{ display: "flex", flexWrap: "wrap", gap: 8, listStyle: "none", padding: 0, margin: 0 }}>
          {analysis.requirements?.map((r, i) => (
            <li
              key={i}
              style={{
                fontFamily: "'Kalam', cursive",
                fontSize: "0.85rem",
                color: "var(--dp-color-ink)",
                background: "var(--dp-color-highlight)",
                border: "1.5px solid #c8a830",
                borderRadius: "12px 4px 14px 4px / 4px 14px 4px 12px",
                padding: "2px 12px",
              }}
            >
              {r}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
