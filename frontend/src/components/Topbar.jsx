import { Menu, Sparkles } from "lucide-react";

export default function Topbar({ aiConfigured, onMenuClick, onLoadDemo }) {
  return (
    <header className="sticky top-0 z-10 shrink-0 flex items-center justify-between px-4 md:px-8 h-16 bg-[#f5efdf]/95 backdrop-blur-sm border-b border-[#d4d0bd]">
      {/* Left: Mobile menu toggle + Page title */}
      <div className="flex items-center gap-3">
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            className="md:hidden p-2 rounded-xl text-[#3d5446] hover:bg-[#e0e5d3] transition"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <div className="flex items-center gap-2.5">
          <span className="font-serif text-xl md:text-2xl font-normal text-[#1e382c] tracking-tight">
            BuyerPulse Command Center
          </span>
        </div>
      </div>

      {/* Right: Actions + AI Connection status */}
      <div className="flex items-center gap-3">
        {onLoadDemo && (
          <button
            onClick={onLoadDemo}
            className="botanical-button-secondary text-xs !py-1.5 !px-3.5 hidden sm:inline-flex"
            title="Load 5 pre-computed sample inquiries"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#895440]" />
            <span>Load Demo Leads</span>
          </button>
        )}

        {/* AI Status Badge */}
        <div
          className={`flex items-center gap-2 px-3 py-1 rounded-full font-sans text-xs font-medium border transition-colors ${
            aiConfigured === null
              ? "bg-[#e6cbb8]/50 border-[#d4d0bd] text-[#6d4231]"
              : aiConfigured
              ? "bg-[#e0e5d3] border-[#b5baa4] text-[#1e382c]"
              : "bg-[#895440]/15 border-[#895440]/30 text-[#895440]"
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full transition-colors ${
              aiConfigured === null
                ? "bg-[#895440] animate-pulse"
                : aiConfigured
                ? "bg-[#1e382c]"
                : "bg-[#895440]"
            }`}
          />
          <span>
            {aiConfigured === null
              ? "Checking AI…"
              : aiConfigured
              ? "AI connected"
              : "AI offline"}
          </span>
        </div>
      </div>
    </header>
  );
}
