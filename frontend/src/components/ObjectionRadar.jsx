import { SEVERITY_COLORS } from "../utils/priority";

export default function ObjectionRadar({ objections = [] }) {
  if (!objections.length) {
    return <div className="card p-4 text-sm text-slate-400">No objections detected.</div>;
  }
  return (
    <div className="card p-4 space-y-3">
      <div className="text-xs uppercase text-slate-400">Objection radar</div>
      {objections.map((o, i) => (
        <div key={i} className="border border-ink-700 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-semibold text-slate-100">{o.type}</span>
            <span className={`chip ${SEVERITY_COLORS[o.severity]}`}>{o.severity}</span>
          </div>
          <div className="text-sm text-slate-300">{o.detail}</div>
          <div className="text-xs text-slate-400 mt-2">
            <span className="font-medium text-slate-300">Handling:</span> {o.handling_strategy}
          </div>
        </div>
      ))}
    </div>
  );
}
