import { Users, Flame, TrendingUp, Clock, Zap, CalendarClock } from "lucide-react";

export default function StatsCards({ leads = [], loading = false }) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="kpi-card p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-16 h-3 skeleton" />
              <div className="w-7 h-7 rounded-lg skeleton" />
            </div>
            <div className="w-12 h-7 skeleton" />
            <div className="w-24 h-2.5 skeleton" />
          </div>
        ))}
      </div>
    );
  }

  const total = leads.length;
  const hot = leads.filter((l) => l.analysis?.priority === "HOT").length;
  const warm = leads.filter((l) => l.analysis?.priority === "WARM").length;
  const cold = leads.filter((l) => l.analysis?.priority === "COLD").length;
  const highPriority = leads.filter(
    (l) => l.analysis?.priority === "HOT" && l.analysis?.urgency === "HIGH"
  ).length;
  const dueNow = leads.filter(
    (l) => l.follow_up_status === "PENDING" && l.follow_up_due_at && new Date(l.follow_up_due_at) <= new Date()
  ).length;

  const kpis = [
    {
      label: "Total Leads",
      value: total,
      caption: "Active pipeline",
      icon: Users,
      iconColor: "text-slate-300",
      iconBg: "bg-slate-500/15 border-slate-500/20",
      accentValue: "text-slate-100",
    },
    {
      label: "Hot Leads",
      value: hot,
      caption: "Score 75–100",
      icon: Flame,
      iconColor: "text-red-400",
      iconBg: "bg-red-500/15 border-red-500/25",
      accentValue: "text-red-400",
    },
    {
      label: "Warm Leads",
      value: warm,
      caption: "Score 40–74",
      icon: TrendingUp,
      iconColor: "text-amber-400",
      iconBg: "bg-amber-500/15 border-amber-500/25",
      accentValue: "text-amber-400",
    },
    {
      label: "Cold Leads",
      value: cold,
      caption: "Score 0–39",
      icon: Clock,
      iconColor: "text-slate-400",
      iconBg: "bg-slate-500/15 border-slate-500/25",
      accentValue: "text-slate-300",
    },
    {
      label: "High Priority",
      value: highPriority,
      caption: "Hot + High urgency",
      icon: Zap,
      iconColor: "text-indigo-400",
      iconBg: "bg-indigo-500/15 border-indigo-500/25",
      accentValue: "text-indigo-300",
    },
    {
      label: "Follow-ups Due",
      value: dueNow,
      caption: "Action pending",
      icon: CalendarClock,
      iconColor: dueNow > 0 ? "text-rose-400" : "text-emerald-400",
      iconBg: dueNow > 0 ? "bg-rose-500/15 border-rose-500/25" : "bg-emerald-500/15 border-emerald-500/25",
      accentValue: dueNow > 0 ? "text-rose-400" : "text-emerald-400",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3.5">
      {kpis.map((kpi) => {
        const Icon = kpi.icon;
        return (
          <div key={kpi.label} className="kpi-card flex flex-col justify-between group">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 truncate">
                {kpi.label}
              </span>
              <div
                className={`w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${kpi.iconBg}`}
              >
                <Icon className={`w-3.5 h-3.5 ${kpi.iconColor}`} />
              </div>
            </div>

            <div className="my-1">
              <div className={`text-2xl md:text-3xl font-bold tracking-tight ${kpi.accentValue}`}>
                {kpi.value}
              </div>
            </div>

            <div className="text-[11px] text-slate-400 font-medium truncate">
              {kpi.caption}
            </div>
          </div>
        );
      })}
    </div>
  );
}
