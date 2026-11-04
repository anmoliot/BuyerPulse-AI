import { useState } from "react";
import { api } from "../services/api";
import CopyButton from "./CopyButton";
import { isDue, plusHours } from "../utils/format";
import { SEVERITY_COLORS } from "../utils/priority";

export default function FollowUpCopilot({ lead, onUpdateLead }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  if (!lead || !lead.analysis) {
    return <div className="card p-6 text-slate-400">Analyze this lead to unlock follow-up intelligence.</div>;
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

  return (
    <div className="space-y-4">
      <div className="card p-4 flex items-center justify-between">
        <div>
          <div className="text-xs uppercase text-slate-400">Follow-up status</div>
          <div className="text-lg font-semibold">
            {due ? <span className="text-red-300">Needs follow-up</span> : "On track"}
          </div>
          <div className="text-xs text-slate-500">
            Due {lead.follow_up_due_at ? new Date(lead.follow_up_due_at).toLocaleString() : "—"}
          </div>
        </div>
        <div className="flex gap-2">
          <button className="btn-primary" onClick={generate} disabled={busy}>
            {busy ? "Generating…" : "Generate follow-up"}
          </button>
          <button
            className="btn-ghost"
            onClick={() => onUpdateLead({ follow_up_status: "DONE" })}
            disabled={lead.follow_up_status === "DONE"}
          >
            Mark done
          </button>
          <button
            className="btn-ghost"
            onClick={() =>
              onUpdateLead({
                follow_up_status: "PENDING",
                follow_up_due_at: plusHours(24),
              })
            }
          >
            Snooze 24h
          </button>
        </div>
      </div>

      {error && <div className="card p-3 border-red-500/30 bg-red-500/5 text-sm text-red-300">{error}</div>}

      {lead.follow_up ? (
        <div className="grid md:grid-cols-2 gap-4">
          <div className="card p-4 space-y-2">
            <div className="text-xs uppercase text-slate-400">Why follow up</div>
            <p className="text-sm text-slate-200">{lead.follow_up.reason}</p>
            <div className="text-xs uppercase text-slate-400 mt-2">Recommended action</div>
            <p className="text-sm text-slate-200">{lead.follow_up.recommended_action}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs uppercase text-slate-400">Decay risk</span>
              <span className={`chip ${SEVERITY_COLORS[lead.follow_up.decay_risk]}`}>{lead.follow_up.decay_risk}</span>
            </div>
          </div>
          <div className="card p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs uppercase text-slate-400">Suggested message</div>
              <CopyButton text={lead.follow_up.follow_up_message} />
            </div>
            <p className="text-sm text-slate-200 whitespace-pre-wrap">{lead.follow_up.follow_up_message}</p>
          </div>
        </div>
      ) : (
        <div className="card p-6 text-sm text-slate-400">
          No follow-up generated yet. Click “Generate follow-up”.
        </div>
      )}
    </div>
  );
}
