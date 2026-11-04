export default function Topbar({ aiConfigured }) {
  return (
    <header className="h-14 flex items-center justify-between px-4 md:px-6 border-b border-ink-700 bg-ink-800/60 backdrop-blur sticky top-0 z-10">
      <div className="text-sm text-slate-300">
        AI Lead Qualification & Follow-up Copilot
      </div>
      <div className="flex items-center gap-3">
        <span
          className={`chip ${
            aiConfigured === null
              ? "bg-slate-500/15 text-slate-300 border border-slate-500/30"
              : aiConfigured === true
              ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
              : "bg-red-500/15 text-red-300 border border-red-500/30"
          }`}
        >
          {aiConfigured === null ? "Checking AI…" : aiConfigured === true ? "AI online" : "AI offline"}
        </span>
      </div>
    </header>
  );
}
