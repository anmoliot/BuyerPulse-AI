import { Menu, Sparkles, RefreshCw, Cpu } from "lucide-react";

export default function Topbar({ aiConfigured, onMenuClick, onLoadDemo }) {
  return (
    <header className="h-16 shrink-0 flex items-center justify-between px-4 md:px-8 border-b border-white/[0.06] bg-surface-900/80 backdrop-blur-md sticky top-0 z-10 transition-colors">
      {/* Left: Mobile hamburger & breadcrumb */}
      <div className="flex items-center gap-3">
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 font-medium">
            <span>BuyerPulse</span>
            <span className="text-slate-600">/</span>
          </div>
          <h1 className="text-sm md:text-base font-semibold text-slate-100 tracking-tight">
            Sales Command Center
          </h1>
        </div>
      </div>

      {/* Right: Quick actions & AI Status Badge */}
      <div className="flex items-center gap-3">
        {onLoadDemo && (
          <button
            onClick={onLoadDemo}
            className="btn-secondary !py-1.5 !px-3 text-xs hidden sm:inline-flex"
            title="Load 5 pre-computed sample inquiries"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Load Demo Leads</span>
          </button>
        )}

        {/* AI Status Badge */}
        <div
          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border backdrop-blur-sm transition-all duration-200 ${
            aiConfigured === null
              ? "bg-slate-500/10 text-slate-300 border-slate-500/20"
              : aiConfigured === true
              ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/25 shadow-sm shadow-emerald-500/10"
              : "bg-red-500/10 text-red-300 border-red-500/25 shadow-sm shadow-red-500/10"
          }`}
        >
          {aiConfigured === null ? (
            <>
              <RefreshCw className="w-3 h-3 text-slate-400 animate-spin" />
              <span>Checking AI…</span>
            </>
          ) : aiConfigured === true ? (
            <>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="flex items-center gap-1">
                <Cpu className="w-3 h-3 text-emerald-400" />
                <span>AI Connected</span>
              </span>
            </>
          ) : (
            <>
              <span className="inline-flex rounded-full h-2 w-2 bg-red-500" />
              <span>AI Offline</span>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
