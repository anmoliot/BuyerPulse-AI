import { useState } from "react";
import { api } from "../services/api";
import CopyButton from "./CopyButton";
import { isDue, plusHours } from "../utils/format";

export default function FollowUpCopilot({ lead, onUpdateLead }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  if (!lead || !lead.analysis) {
    return (
      <div
        className="card"
        style={{ padding: "32px 24px", textAlign: "center" }}
      >
        <div style={{ fontFamily: "'Caveat', cursive", fontSize: "1.5rem", fontWeight: 700, color: "var(--dp-color-line)", marginBottom: 8 }}>
          Analyze this lead first
        </div>
        <p style={{ fontFamily: "'Kalam', cursive", fontSize: "0.9rem", color: "var(--dp-color-ink-muted)" }}>
          Analyze this lead to unlock follow-up intelligence.
        </p>
      </div>
    );
  }

  async function generate() {
    setBusy(true);
    setError(null);
    try {
      const res = await api.followup({ lead: lead.intake, analysis: lead.analysis });
      onUpdateLead({
        follow_up: res,
        follow_up_due_at: plusHours(res.follow_up_hours),
        follow_up_status: "PENDING",
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  const due = lead.follow_up_status === "PENDING" && isDue(lead.follow_up_due_at);
  const dueAt = lead.follow_up_due_at ? new Date(lead.follow_up_due_at).toLocaleString() : "—";

  const sevColor = { HIGH: "#9e3a2e", MEDIUM: "#c8a830", LOW: "#2d6a2d" };
  const sevBg = { HIGH: "rgba(158,58,46,0.08)", MEDIUM: "rgba(240,223,160,0.3)", LOW: "rgba(45,106,45,0.07)" };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Status + Actions header */}
      <div className="card" style={{ padding: "20px 24px" }}>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
          }}
        >
          <div>
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
              Follow-up status
            </div>
            <div
              style={{
                fontFamily: "'Caveat', cursive",
                fontSize: "1.6rem",
                fontWeight: 800,
                color: due ? "var(--dp-color-accent)" : "#2d6a2d",
                lineHeight: 1.1,
                marginBottom: 4,
              }}
            >
              {due ? "⚠ Needs follow-up" : "✓ On track"}
            </div>
            <div style={{ fontFamily: "'Kalam', cursive", fontSize: "0.8rem", color: "var(--dp-color-ink-muted)" }}>
              Due: {dueAt}
            </div>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            <button className="btn-primary" onClick={generate} disabled={busy} style={{ fontSize: "0.9rem" }}>
              {busy ? "Generating…" : "✨ Generate follow-up"}
            </button>
            <button
              className="btn-secondary"
              onClick={() => onUpdateLead({ follow_up_status: "DONE" })}
              disabled={lead.follow_up_status === "DONE"}
              style={{ fontSize: "0.9rem" }}
            >
              ✓ Mark done
            </button>
            <button
              className="btn-ghost"
              onClick={() => onUpdateLead({ follow_up_status: "PENDING", follow_up_due_at: plusHours(24) })}
              style={{ fontSize: "0.9rem" }}
            >
              ⏱ Snooze 24h
            </button>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div
          style={{
            padding: "12px 16px",
            background: "rgba(158,58,46,0.06)",
            border: "1.5px solid var(--dp-color-accent)",
            borderRadius: "9px 4px 17px 5px / 4px 12px 5px 9px",
            fontFamily: "'Kalam', cursive",
            fontSize: "0.9rem",
            color: "var(--dp-color-accent)",
          }}
        >
          {error}
        </div>
      )}

      {/* Follow-up content */}
      {lead.follow_up ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
          {/* Why + action + decay */}
          <div className="card" style={{ padding: "20px" }}>
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
              Why follow up
            </div>
            <p style={{ fontFamily: "'Kalam', cursive", fontSize: "0.9rem", color: "var(--dp-color-ink)", marginBottom: 14, lineHeight: 1.6 }}>
              {lead.follow_up.reason}
            </p>

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
              Recommended action
            </div>
            <p style={{ fontFamily: "'Kalam', cursive", fontSize: "0.9rem", color: "var(--dp-color-ink)", marginBottom: 14, lineHeight: 1.6 }}>
              {lead.follow_up.recommended_action}
            </p>

            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
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
                Decay risk
              </span>
              {lead.follow_up.decay_risk && (
                <span
                  style={{
                    fontFamily: "'Caveat', cursive",
                    fontSize: "0.85rem",
                    fontWeight: 700,
                    color: sevColor[lead.follow_up.decay_risk] || "#b3ac9d",
                    background: sevBg[lead.follow_up.decay_risk] || "rgba(179,172,157,0.1)",
                    border: `1.5px solid ${sevColor[lead.follow_up.decay_risk] || "#b3ac9d"}`,
                    borderRadius: "12px 4px 12px 4px / 4px 12px 4px 12px",
                    padding: "1px 10px",
                  }}
                >
                  {lead.follow_up.decay_risk}
                </span>
              )}
            </div>
          </div>

          {/* Suggested message */}
          <div className="card" style={{ padding: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <div
                style={{
                  fontFamily: "'Caveat', cursive",
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: "var(--dp-color-annotation)",
                }}
              >
                ✍ Suggested message
              </div>
              <CopyButton text={lead.follow_up.follow_up_message} />
            </div>
            <div
              style={{
                fontFamily: "'Kalam', cursive",
                fontSize: "0.9rem",
                color: "var(--dp-color-ink)",
                whiteSpace: "pre-wrap",
                lineHeight: 1.7,
                background: "rgba(255,255,255,0.7)",
                border: "1px dashed var(--dp-color-line)",
                borderRadius: "5px 2px 10px 3px / 2px 8px 3px 5px",
                padding: "12px 14px",
              }}
            >
              {lead.follow_up.follow_up_message}
            </div>
          </div>
        </div>
      ) : (
        <div
          style={{
            padding: "48px 24px",
            textAlign: "center",
            border: "2px dashed var(--dp-color-line)",
            borderRadius: "9px 4px 17px 5px / 4px 12px 5px 9px",
            fontFamily: "'Kalam', cursive",
            fontSize: "0.9rem",
            color: "var(--dp-color-ink-muted)",
          }}
        >
          No follow-up generated yet. Click "Generate follow-up" to create one.
        </div>
      )}
    </div>
  );
}
