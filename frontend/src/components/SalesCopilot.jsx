import { useState, useRef, useEffect } from "react";
import { api } from "../services/api";
import CopyButton from "./CopyButton";
import { shortId } from "../utils/format";

export default function SalesCopilot({ lead, onUpdateLead }) {
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const bottomRef = useRef(null);

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
          Run AI analysis before opening Copilot.
        </p>
      </div>
    );
  }

  const history = lead.chat_history || [];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history, busy]);

  async function send(e) {
    e?.preventDefault?.();
    if (!input.trim() || busy) return;
    const question = input.trim();
    setInput("");
    setError(null);
    const userMsg = { role: "user", content: question, ts: new Date().toISOString() };
    const nextHistory = [...history, userMsg];
    onUpdateLead({ chat_history: nextHistory });
    setBusy(true);
    try {
      const res = await api.chat({
        lead: lead.intake,
        analysis: lead.analysis,
        history: nextHistory.slice(-8),
        question,
      });
      const assistantMsg = {
        id: shortId(),
        role: "assistant",
        content: res.answer,
        suggested_action: res.suggested_action,
        ts: new Date().toISOString(),
      };
      onUpdateLead({ chat_history: [...nextHistory, assistantMsg] });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      className="card"
      style={{ display: "flex", flexDirection: "column", height: "70vh", minHeight: 480 }}
    >
      {/* Context strip */}
      <div
        style={{
          padding: "10px 16px",
          borderBottom: "1.5px solid var(--dp-color-line)",
          background: "rgba(52,76,105,0.06)",
          borderRadius: "inherit inherit 0 0",
          display: "flex",
          alignItems: "center",
          gap: 8,
          flexWrap: "wrap",
        }}
      >
        <span
          style={{
            fontFamily: "'Caveat', cursive",
            fontSize: "0.85rem",
            fontWeight: 700,
            color: "var(--dp-color-annotation)",
            background: "rgba(52,76,105,0.08)",
            border: "1.5px solid rgba(52,76,105,0.3)",
            borderRadius: "20px 6px 20px 6px / 6px 20px 6px 20px",
            padding: "2px 12px",
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          💬 Copilot · {lead.intake.name} · {lead.analysis.priority} · Score {lead.analysis.lead_score}
        </span>
      </div>

      {/* Chat messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: 12 }}>
        {history.length === 0 && (
          <div
            style={{
              textAlign: "center",
              fontFamily: "'Kalam', cursive",
              fontSize: "0.9rem",
              color: "var(--dp-color-ink-muted)",
              padding: "32px 16px",
              border: "2px dashed var(--dp-color-line)",
              borderRadius: "9px 4px 17px 5px / 4px 12px 5px 9px",
            }}
          >
            Ask anything about this lead.<br />
            <span style={{ color: "var(--dp-color-annotation)", fontFamily: "'Caveat', cursive", fontWeight: 700 }}>Try: "What should I emphasize during the call?"</span>
          </div>
        )}

        {history.map((m, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: m.role === "user" ? "flex-end" : "flex-start",
            }}
          >
            <div
              style={{
                maxWidth: "82%",
                padding: "10px 14px",
                borderRadius: m.role === "user"
                  ? "12px 3px 12px 12px"
                  : "3px 12px 12px 12px",
                background: m.role === "user"
                  ? "var(--dp-color-accent)"
                  : "rgba(255,255,255,0.8)",
                border: m.role === "user"
                  ? "1.5px solid rgba(100,20,10,0.4)"
                  : "1.5px solid var(--dp-color-line)",
                boxShadow: "2px 2px 0 0 rgba(56,53,47,0.1)",
              }}
            >
              <div
                style={{
                  fontFamily: "'Kalam', cursive",
                  fontSize: "0.9rem",
                  color: m.role === "user" ? "#fff" : "var(--dp-color-ink)",
                  whiteSpace: "pre-wrap",
                  lineHeight: 1.6,
                }}
              >
                {m.content}
              </div>
              {m.suggested_action && (
                <div
                  style={{
                    marginTop: 8,
                    paddingTop: 8,
                    borderTop: "1px dashed rgba(255,255,255,0.3)",
                    fontFamily: "'Kalam', cursive",
                    fontSize: "0.78rem",
                    color: m.role === "user" ? "rgba(255,255,255,0.8)" : "var(--dp-color-annotation)",
                  }}
                >
                  ➜ {m.suggested_action}
                </div>
              )}
              {m.role === "assistant" && (
                <div style={{ marginTop: 6, display: "flex", justifyContent: "flex-end" }}>
                  <CopyButton text={m.content} />
                </div>
              )}
            </div>
          </div>
        ))}

        {busy && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontFamily: "'Kalam', cursive",
              fontSize: "0.85rem",
              color: "var(--dp-color-ink-muted)",
            }}
          >
            <span style={{ display: "inline-block", animation: "sketch-shimmer 1.5s infinite" }}>✏</span>
            Thinking…
          </div>
        )}
        {error && (
          <div
            style={{
              fontFamily: "'Kalam', cursive",
              fontSize: "0.85rem",
              color: "var(--dp-color-accent)",
              padding: "8px 12px",
              background: "rgba(158,58,46,0.06)",
              border: "1.5px solid var(--dp-color-accent)",
              borderRadius: "6px 2px 10px 2px",
            }}
          >
            Error: {error}
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <form
        onSubmit={send}
        style={{
          padding: "10px 14px",
          borderTop: "1.5px solid var(--dp-color-line)",
          display: "flex",
          gap: 10,
          background: "rgba(247,242,231,0.5)",
        }}
      >
        <input
          className="input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask your sales copilot…"
          disabled={busy}
          style={{ flex: 1, fontSize: "0.9rem" }}
        />
        <button
          type="submit"
          className="btn-primary"
          disabled={busy || !input.trim()}
          style={{ fontSize: "0.9rem", whiteSpace: "nowrap" }}
        >
          Send →
        </button>
      </form>
    </div>
  );
}
