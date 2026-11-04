export default function AnalysisCards({ analysis }) {
  if (!analysis) return null;
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div className="card p-4">
        <div className="text-xs uppercase text-slate-400 mb-1">Summary</div>
        <p className="text-sm text-slate-200">{analysis.summary}</p>
      </div>
      <div className="card p-4">
        <div className="text-xs uppercase text-slate-400 mb-1">Intent</div>
        <p className="text-sm text-slate-200">{analysis.intent}</p>
      </div>
      <div className="card p-4 md:col-span-2">
        <div className="text-xs uppercase text-slate-400 mb-1">Requirements</div>
        <ul className="flex flex-wrap gap-2">
          {analysis.requirements?.map((r, i) => (
            <li key={i} className="chip bg-ink-700 text-slate-200">{r}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
