import { NavLink } from "react-router-dom";
import { LayoutDashboard, Users, UserPlus, X, Sparkles } from "lucide-react";

const navigationItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, note: "Overview" },
  { to: "/leads", label: "Leads Queue", icon: Users, note: "Prioritized" },
  { to: "/leads/new", label: "Add Lead", icon: UserPlus, note: "New inquiry" },
];

// Minimal botanical leaf mark
const BotanicalLeafMark = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0">
    <path
      d="M12 21C12 21 5 16 5 9.5C5 5.5 8.5 2.5 12 2.5C15.5 2.5 19 5.5 19 9.5C19 16 12 21 12 21Z"
      stroke="#1e382c"
      strokeWidth="1.25"
      fill="#e0e5d3"
    />
    <path
      d="M12 4.5V19"
      stroke="#1e382c"
      strokeWidth="1.25"
      strokeLinecap="round"
    />
    <path
      d="M12 9L15.5 7"
      stroke="#1e382c"
      strokeWidth="1"
      strokeLinecap="round"
    />
    <path
      d="M12 12L8.5 10"
      stroke="#1e382c"
      strokeWidth="1"
      strokeLinecap="round"
    />
    <path
      d="M12 15L15 13.5"
      stroke="#1e382c"
      strokeWidth="1"
      strokeLinecap="round"
    />
  </svg>
);

export default function Sidebar({ mobileOpen, setMobileOpen }) {
  const content = (
    <div className="flex flex-col h-full bg-[#fbf8f0] border-r border-[#d4d0bd] p-6 text-[#1e382c]">
      {/* Brand Header */}
      <div className="pb-6 mb-6 border-b border-[#d4d0bd]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BotanicalLeafMark />
            <div>
              <div className="font-serif text-2xl font-normal tracking-tight text-[#1e382c] leading-none">
                BuyerPulse
              </div>
              <div className="font-sans text-[11px] font-semibold tracking-[0.14em] uppercase text-[#895440] mt-1">
                AI Copilot
              </div>
            </div>
          </div>

          {setMobileOpen && (
            <button
              onClick={() => setMobileOpen(false)}
              className="md:hidden p-1.5 rounded-full hover:bg-[#e0e5d3] text-[#3d5446] transition"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <p className="font-sans text-xs text-[#697961] mt-3 leading-relaxed">
          Lead qualification &amp; follow-up intelligence for real estate teams.
        </p>
      </div>

      {/* Navigation Label */}
      <div className="font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-[#697961] mb-3 px-3">
        Workspace
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1.5 flex-1">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              onClick={() => setMobileOpen && setMobileOpen(false)}
              className={({ isActive }) =>
                `group flex items-center justify-between px-3.5 py-2.5 rounded-xl font-sans text-sm font-medium transition-all ${
                  isActive
                    ? "bg-[#e0e5d3] text-[#1e382c] border-l-2 border-[#1e382c] shadow-sm font-semibold"
                    : "text-[#3d5446] hover:bg-[#e0e5d3]/50 hover:text-[#1e382c]"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 transition-colors ${
                        isActive ? "text-[#1e382c]" : "text-[#697961] group-hover:text-[#1e382c]"
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>
                  <span
                    className={`text-[11px] tracking-wide font-sans ${
                      isActive ? "text-[#697961]" : "text-[#b5baa4] group-hover:text-[#697961]"
                    }`}
                  >
                    {item.note}
                  </span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Workspace status footer */}
      <div className="pt-4 border-t border-[#d4d0bd] space-y-3">
        <div className="bg-[#e0e5d3]/50 rounded-2xl p-3 border border-[#d4d0bd]">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#1e382c]" />
            <span className="font-sans text-xs font-semibold text-[#1e382c]">Acme Realty</span>
          </div>
          <div className="font-sans text-[11px] text-[#697961]">
            Prototype workspace · local state
          </div>
        </div>

        <div className="font-sans text-[11px] text-[#8c9b88] text-center">
          BuyerPulse AI · Gemini 3.8 Flash
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
            className="fixed inset-0 bg-[#1e382c]/40 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative w-72 max-w-[85vw] h-full shadow-xl z-10">
            {content}
          </div>
        </div>
      )}
    </>
  );
}
