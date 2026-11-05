export default function ObjectionRadar({ objections = [] }) {
  const sevColor = { HIGH: "#9e3a2e", MEDIUM: "#c8a830", LOW: "#2d6a2d" };
  const sevBg = {
    HIGH: "rgba(158,58,46,0.08)",
    MEDIUM: "rgba(240,223,160,0.3)",
    LOW: "rgba(45,106,45,0.07)",
  };

  if (!objections.length) {
    return (
      <div
        className="card"
        style={{ padding: "20px", fontFamily: "'Kalam', cursive", fontSize: "0.9rem", color: "var(--dp-color-ink-muted)", textAlign: "center" }}
      >
        ✓ No objections detected.
      </div>
    );
  }

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
        {/* radar icon SVG */}
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <circle cx="9" cy="9" r="8" stroke="var(--dp-color-accent)" strokeWidth="1.5" strokeDasharray="3 2" />
          <circle cx="9" cy="9" r="5" stroke="var(--dp-color-line)" strokeWidth="1" />
          <circle cx="9" cy="9" r="2" fill="var(--dp-color-accent)" />
        </svg>
        Objection Radar
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {objections.map((o, i) => {
          const col = sevColor[o.severity] || "#b3ac9d";
          const bg = sevBg[o.severity] || "rgba(179,172,157,0.1)";
          return (
            <div
              key={i}
              style={{
                padding: "12px 14px",
                background: bg,
                border: `1.5px solid ${col}`,
                borderRadius: "8px 3px 12px 3px / 3px 10px 3px 8px",
                position: "relative",
              }}
            >
              {/* severity marker line */}
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: 3,
                  background: col,
                  borderRadius: "3px 0 0 3px",
                }}
              />
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, paddingLeft: 8 }}>
                <span
                  style={{
                    fontFamily: "'Caveat', cursive",
                    fontSize: "1rem",
                    fontWeight: 700,
                    color: "var(--dp-color-ink)",
                  }}
                >
                  {o.type}
                </span>
                <span
                  style={{
                    fontFamily: "'Caveat', cursive",
                    fontSize: "0.78rem",
                    fontWeight: 700,
                    color: col,
                    background: `${bg}`,
                    border: `1px solid ${col}`,
                    borderRadius: "12px 4px 12px 4px / 4px 12px 4px 12px",
                    padding: "0 8px",
                  }}
                >
                  {o.severity}
                </span>
              </div>
              <div
                style={{ fontFamily: "'Kalam', cursive", fontSize: "0.85rem", color: "var(--dp-color-ink)", paddingLeft: 8, marginBottom: 6 }}
              >
                {o.detail}
              </div>
              <div
                style={{ fontFamily: "'Kalam', cursive", fontSize: "0.78rem", color: "var(--dp-color-ink-muted)", paddingLeft: 8 }}
              >
                <span style={{ fontWeight: 700, color: "var(--dp-color-annotation)" }}>Handling: </span>
                {o.handling_strategy}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
