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
    <div className="space-y-4">
      <div className="card p-5 flex flex-col md:flex-row md:items-center gap-4">
        <div className="flex-1">
          <div className="text-xs text-slate-400">Lead</div>
          <div className="text-xl font-semibold">{lead.intake.name}</div>
          <div className="text-sm text-slate-400">{lead.intake.location} · {lead.intake.budget}</div>
        </div>
        {a && <ScoreBadge score={a.lead_score} priority={a.priority} urgency={a.urgency} confidence={a.confidence} />}
        <div className="flex gap-2">
          <button className="btn-ghost" onClick={() => navigate(`/leads/${lead.id}/copilot`)}>Open Copilot</button>
          <button className="btn-ghost" onClick={() => navigate(`/leads/${lead.id}/followup`)}>Follow-up</button>
        </div>
      </div>

      {!a && lead.analysis_error && (
        <div className="card p-4 border-red-500/30 bg-red-500/5">
          <div className="text-sm text-red-300">Analysis failed: {lead.analysis_error}</div>
          <button className="btn-primary mt-2" onClick={() => onRetry(lead.id)}>Retry analysis</button>
        </div>
      )}

      {a && <AnalysisCards analysis={a} />}
      {a && (
        <div className="grid lg:grid-cols-2 gap-4">
          <ObjectionRadar objections={a.objections} />
          <CallReadyBrief lead={lead} analysis={a} />
        </div>
      )}

      {a && (
        <div className="card p-4">
          <div className="text-xs uppercase text-slate-400 mb-2">Trust & evidence</div>
          <div className="grid md:grid-cols-2 gap-4">
            <Section title="Stated facts" tone="text-emerald-300" items={a.stated_facts} />
            <Section title="AI inferences" tone="text-amber-300" items={a.ai_inferences} />
            <Section title="Missing info" tone="text-sky-300" items={a.missing_information} />
            <Section title="Discovery questions" tone="text-fuchsia-300" items={a.discovery_questions} />
          </div>
          <div className="text-xs text-slate-500 mt-3">
            Score is decision support, not a prediction. Verify all facts before acting.
          </div>
        </div>
      )}

      {a && (
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div className="text-xs uppercase text-slate-400">Suggested response</div>
            <CopyButton text={a.suggested_response} />
          </div>
          <p className="text-sm text-slate-200 mt-2">{a.suggested_response}</p>
        </div>
      )}

      <ActivityTimeline lead={lead} />
    </div>
  );
}

function Section({ title, items = [], tone }) {
  return (
    <div>
      <div className={`text-xs uppercase mb-1 ${tone}`}>{title}</div>
      {items.length ? (
        <ul className="list-disc list-inside text-sm text-slate-300 space-y-1">
          {items.map((x, i) => <li key={i}>{x}</li>)}
        </ul>
      ) : (
        <div className="text-sm text-slate-500">—</div>
      )}
    </div>
  );
}
