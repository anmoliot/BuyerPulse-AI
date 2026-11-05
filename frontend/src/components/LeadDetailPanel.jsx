import { useNavigate } from "react-router-dom";
import AnalysisCards from "./AnalysisCards";
import ObjectionRadar from "./ObjectionRadar";
import CallReadyBrief from "./CallReadyBrief";
import ActivityTimeline from "./ActivityTimeline";
import ScoreBadge from "./ScoreBadge";
import CopyButton from "./CopyButton";

export default function LeadDetailPanel({ lead, onRetry }) {
  const navigate = useNavigate();
  if (!lead) return null;
  const a = lead.analysis;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* ── Lead Header Card ── */}
      <div
        className="card"
        style={{ padding: "20px 24px" }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 16,
          }}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontFamily: "'Kalam', cursive",
                fontSize: "0.75rem",
                color: "var(--dp-color-ink-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: 4,
              }}
            >
              Lead
            </div>
            <h2
              style={{
                fontFamily: "'Caveat', cursive",
                fontSize: "1.9rem",
                fontWeight: 800,
                color: "var(--dp-color-ink)",
                lineHeight: 1.1,
                marginBottom: 4,
              }}
            >
              {lead.intake.name}
            </h2>
            <div style={{ fontFamily: "'Kalam', cursive", fontSize: "0.9rem", color: "var(--dp-color-ink-muted)" }}>
              {lead.intake.location} · {lead.intake.budget}
            </div>
          </div>

          {a && <ScoreBadge score={a.lead_score} priority={a.priority} urgency={a.urgency} confidence={a.confidence} />}

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button className="btn-secondary" style={{ fontSize: "0.9rem" }} onClick={() => navigate(`/leads/${lead.id}/copilot`)}>
              💬 Open Copilot
            </button>
            <button className="btn-secondary" style={{ fontSize: "0.9rem" }} onClick={() => navigate(`/leads/${lead.id}/followup`)}>
              📅 Follow-up
            </button>
          </div>
        </div>
      </div>

      {/* ── Analysis Error ── */}
      {!a && lead.analysis_error && (
        <div
          style={{
            padding: "16px 20px",
            background: "rgba(158,58,46,0.06)",
            border: "1.5px solid var(--dp-color-accent)",
            borderRadius: "9px 4px 17px 5px / 4px 12px 5px 9px",
          }}
        >
          <div
            style={{ fontFamily: "'Kalam', cursive", fontSize: "0.9rem", color: "var(--dp-color-accent)", marginBottom: 10 }}
          >
            Analysis failed: {lead.analysis_error}
          </div>
          <button className="btn-primary" onClick={() => onRetry(lead)}>
            Retry analysis
          </button>
        </div>
      )}

      {/* ── Analysis Cards ── */}
      {a && <AnalysisCards analysis={a} />}

      {/* ── Objection Radar + Call Brief ── */}
      {a && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
          <ObjectionRadar objections={a.objections} />
          <CallReadyBrief lead={lead} analysis={a} />
        </div>
      )}

      {/* ── Trust & Evidence ── */}
      {a && (
        <div className="card" style={{ padding: "20px" }}>
          <div
            style={{
              fontFamily: "'Caveat', cursive",
              fontSize: "1.15rem",
              fontWeight: 700,
              color: "var(--dp-color-ink)",
              marginBottom: 14,
              paddingBottom: 10,
              borderBottom: "1.5px solid var(--dp-color-line)",
            }}
          >
            🔍 Trust &amp; Evidence
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
            <EvidenceSection title="Stated facts" items={a.stated_facts} color="#2d6a2d" />
            <EvidenceSection title="AI inferences" items={a.ai_inferences} color="#c8a830" />
            <EvidenceSection title="Missing info" items={a.missing_information} color="var(--dp-color-annotation)" />
            <EvidenceSection title="Discovery questions" items={a.discovery_questions} color="#7a2d6a" />
          </div>
          <div
            style={{
              fontFamily: "'Kalam', cursive",
              fontSize: "0.75rem",
              color: "var(--dp-color-ink-muted)",
              marginTop: 14,
              paddingTop: 10,
              borderTop: "1px dashed var(--dp-color-line)",
              fontStyle: "italic",
            }}
          >
            Score is decision support, not a prediction. Verify all facts before acting.
          </div>
        </div>
      )}

      {/* ── Suggested Response ── */}
      {a && (
        <div className="card" style={{ padding: "20px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 10,
            }}
          >
            <div
              style={{
                fontFamily: "'Caveat', cursive",
                fontSize: "1.1rem",
                fontWeight: 700,
                color: "var(--dp-color-ink)",
              }}
            >
              ✍ Suggested Response
            </div>
            <CopyButton text={a.suggested_response} />
          </div>
          <p
            style={{
              fontFamily: "'Kalam', cursive",
              fontSize: "0.9rem",
              color: "var(--dp-color-ink)",
              lineHeight: 1.7,
              background: "rgba(255,255,255,0.6)",
              border: "1px dashed var(--dp-color-line)",
              borderRadius: "5px 2px 10px 3px / 2px 8px 3px 5px",
              padding: "12px 16px",
            }}
          >
            {a.suggested_response}
          </p>
        </div>
      )}

      {/* ── Activity Timeline ── */}
      <ActivityTimeline lead={lead} />
    </div>
  );
}

function EvidenceSection({ title, items = [], color }) {
  return (
    <div>
      <div
        style={{
          fontFamily: "'Caveat', cursive",
          fontSize: "0.78rem",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          color,
          marginBottom: 6,
        }}
      >
        {title}
      </div>
      {items.length ? (
        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 4 }}>
          {items.map((x, i) => (
            <li
              key={i}
              style={{
                fontFamily: "'Kalam', cursive",
                fontSize: "0.85rem",
                color: "var(--dp-color-ink)",
                display: "flex",
                alignItems: "flex-start",
                gap: 6,
              }}
            >
              <span style={{ color, fontWeight: 700, flexShrink: 0 }}>–</span>
              {x}
            </li>
          ))}
        </ul>
      ) : (
        <div style={{ fontFamily: "'Kalam', cursive", fontSize: "0.85rem", color: "var(--dp-color-line)" }}>—</div>
      )}
    </div>
  );
}
