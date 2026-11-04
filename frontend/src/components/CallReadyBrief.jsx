import CopyButton from "./CopyButton";

export default function CallReadyBrief({ lead, analysis }) {
  if (!lead || !analysis) return null;
  const opening = analysis.suggested_response || "Hi, thanks for reaching out. Let me help you with your requirement.";
  const primary = analysis.objections?.[0];

  return (
    <div className="card p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="text-xs uppercase text-slate-400">Call-ready brief</div>
        <span className="text-xs text-slate-500">read in &lt; 30s</span>
      </div>
      <Row label="Requirement" value={lead.intake.property_requirement} />
      <Row label="Budget & timeline" value={`${lead.intake.budget} · ${lead.intake.buying_timeline}`} />
      <Row label="Primary objection" value={primary ? `${primary.type} — ${primary.detail}` : "None"} />
      <Row label="Best next action" value={analysis.recommended_action} />
      <div>
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs uppercase text-slate-400">Opening line</span>
          <CopyButton text={opening} />
        </div>
        <div className="bg-ink-900 border border-ink-700 rounded-lg p-3 text-sm text-slate-200 italic">"{opening}"</div>
      </div>
      <div>
        <div className="text-xs uppercase text-slate-400 mb-1">Questions to ask</div>
        <ul className="list-disc list-inside text-sm text-slate-300 space-y-1">
          {(analysis.discovery_questions || []).map((q, i) => <li key={i}>{q}</li>)}
        </ul>
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex flex-col md:flex-row md:items-start gap-1 md:gap-3">
      <span className="text-xs uppercase text-slate-400 md:w-40 shrink-0">{label}</span>
      <span className="text-sm text-slate-200">{value}</span>
    </div>
  );
}
