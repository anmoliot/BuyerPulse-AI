import { NavLink } from "react-router-dom";

const items = [
  { to: "/", label: "Dashboard", icon: "▦" },
  { to: "/leads", label: "Leads", icon: "◎" },
  { to: "/leads/new", label: "Add Lead", icon: "＋" },
];

export default function Sidebar() {
  return (
    <aside className="hidden md:flex md:flex-col w-60 bg-ink-800 border-r border-ink-700 p-4">
      <div className="mb-6">
        <div className="text-lg font-bold tracking-tight">BuyerPulse <span className="text-accent-soft">AI</span></div>
        <div className="text-xs text-slate-400 mt-1">Real-estate sales copilot</div>
      </div>
      <nav className="flex flex-col gap-1">
        {items.map((it) => (
          <NavLink
            key={it.to}
            to={it.to}
            end={it.to === "/"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm ${
                isActive ? "bg-accent text-white" : "text-slate-300 hover:bg-ink-700"
              }`
            }
          >
            <span className="text-base">{it.icon}</span>
            {it.label}
          </NavLink>
        ))}
      </nav>
      <div className="mt-auto text-xs text-slate-500">
        Prototype · localStorage only
      </div>
    </aside>
  );
}
