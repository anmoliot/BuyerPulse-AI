import { NavLink } from "react-router-dom";
import { LayoutDashboard, Users, UserPlus, Sparkles, Building2, ShieldCheck, X } from "lucide-react";

const navigationItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/leads", label: "Leads", icon: Users },
  { to: "/leads/new", label: "Add Lead", icon: UserPlus },
];

export default function Sidebar({ mobileOpen, setMobileOpen }) {
  const content = (
    <div className="flex flex-col h-full bg-surface-900 border-r border-white/[0.06] p-4 text-slate-200">
      {/* Brand Header */}
      <div className="flex items-center justify-between pb-5 mb-5 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-glow">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 font-bold tracking-tight text-slate-100 text-base">
              <span>BuyerPulse</span>
              <span className="text-[10px] font-semibold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-1.5 py-0.2 rounded-md">
                AI
              </span>
            </div>
            <div className="text-[11px] text-slate-400 font-medium">Real Estate Intelligence</div>
          </div>
        </div>

        {/* Mobile close button */}
        {setMobileOpen && (
          <button
            onClick={() => setMobileOpen(false)}
            className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06]"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Main Navigation */}
      <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 px-3 mb-2">
        Platform
      </div>
      <nav className="flex flex-col gap-1.5">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              onClick={() => setMobileOpen && setMobileOpen(false)}
              className={({ isActive }) =>
                `group relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs md:text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? "bg-indigo-600/15 text-indigo-300 shadow-sm border border-indigo-500/20"
                    : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {/* Left accent bar on active route */}
                  {isActive && (
                    <span className="absolute left-0 top-2 bottom-2 w-1 bg-indigo-500 rounded-r-full" />
                  )}
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? "text-indigo-400" : "text-slate-400 group-hover:text-slate-200"
                    }`}
                  />
                  <span>{item.label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Workspace Footer / Prototype State */}
      <div className="mt-auto pt-4 border-t border-white/[0.06] space-y-3">
        <div className="bg-surface-850/90 border border-white/[0.06] rounded-xl p-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-surface-800 border border-white/[0.08] flex items-center justify-center text-slate-300">
            <Building2 className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-semibold text-slate-200 truncate">Acme Realty Group</div>
            <div className="flex items-center gap-1 text-[11px] text-slate-500">
              <ShieldCheck className="w-3 h-3 text-indigo-400 inline" />
              <span>Prototype Sandbox</span>
            </div>
          </div>
        </div>

        <div className="px-1 text-[11px] text-slate-500 flex items-center justify-between">
          <span>Client-only store</span>
          <span className="font-mono text-[10px] text-slate-400">v1.0.0</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Fixed Sidebar */}
      <aside className="hidden md:flex md:flex-col w-64 h-screen sticky top-0 shrink-0 z-20">
        {content}
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative w-72 max-w-[80vw] h-full shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            {content}
          </div>
        </div>
      )}
    </>
  );
}
