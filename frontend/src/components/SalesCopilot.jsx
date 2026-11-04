import { useState } from "react";
import { api } from "../services/api";
import CopyButton from "./CopyButton";
import { shortId } from "../utils/format";

export default function SalesCopilot({ lead, onUpdateLead }) {
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  if (!lead || !lead.analysis) {
    return <div className="card p-6 text-slate-400">Analyze this lead before opening Copilot.</div>;
  }
  const history = lead.chat_history || [];

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
    <div className="card flex flex-col h-[70vh] min-h-[480px]">
      <div className="p-3 border-b border-ink-700 flex items-center gap-2">
        <span className="chip bg-accent/20 text-accent-soft border border-accent/40">
          Context: {lead.intake.name} · {lead.analysis.priority} · Score {lead.analysis.lead_score}
        </span>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {history.length === 0 && (
          <div className="text-sm text-slate-500">Ask anything about this lead. Try: “What should I emphasize during the call?”</div>
        )}
        {history.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[85%] rounded-xl px-3 py-2 text-sm ${
              m.role === "user" ? "bg-accent text-white" : "bg-ink-700 text-slate-100"
            }`}>
              <div className="whitespace-pre-wrap">{m.content}</div>
              {m.suggested_action && (
                <div className="mt-2 text-xs text-slate-300 border-t border-ink-600 pt-2">
                  ➜ {m.suggested_action}
                </div>
              )}
              {m.role === "assistant" && (
                <div className="mt-1 flex justify-end">
                  <CopyButton text={m.content} />
                </div>
              )}
            </div>
          </div>
        ))}
        {busy && <div className="text-xs text-slate-500">Thinking…</div>}
        {error && <div className="text-xs text-red-400">Error: {error}</div>}
      </div>
      <form onSubmit={send} className="p-3 border-t border-ink-700 flex gap-2">
        <input
          className="input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask your sales copilot…"
        />
        <button className="btn-primary" disabled={busy || !input.trim()}>Send</button>
      </form>
    </div>
  );
}
