import { Users, Flame, TrendingUp, Compass, Zap, CalendarClock } from "lucide-react";

function BotanicalKpiCard({ label, value, caption, icon: Icon, tone = "default" }) {
  // Tone styling
  const toneMap = {
    default: {
      bg: "bg-[#fbf8f0]",
      iconBg: "bg-[#e0e5d3]",
      iconColor: "text-[#1e382c]",
      numColor: "text-[#1e382c]",
    },
    hot: {
      bg: "bg-[#fbf8f0]",
      iconBg: "bg-[#895440]/15",
      iconColor: "text-[#895440]",
      numColor: "text-[#895440]",
    },
    warm: {
      bg: "bg-[#fbf8f0]",
      iconBg: "bg-[#e6cbb8]/60",
      iconColor: "text-[#6d4231]",
      numColor: "text-[#1e382c]",
    },
    cold: {
      bg: "bg-[#fbf8f0]",
      iconBg: "bg-[#e0e5d3]/70",
      iconColor: "text-[#697961]",
      numColor: "text-[#1e382c]",
    },
    urgent: {
      bg: "bg-[#fbf8f0]",
      iconBg: "bg-[#895440]/15",
      iconColor: "text-[#895440]",
      numColor: "text-[#895440]",
    },
    due: {
      bg: "bg-[#fbf8f0]",
      iconBg: "bg-[#e6cbb8]/60",
      iconColor: "text-[#6d4231]",
      numColor: "text-[#1e382c]",
    },
  };

  const style = toneMap[tone] || toneMap.default;

  return (
    <div
      className={`${style.bg} border border-[#d4d0bd] rounded-[34px] p-5 md:p-6 flex flex-col justify-between transition-all duration-interaction hover:-translate-y-0.5 hover:shadow-subtle`}
    >
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-[#697961]">
          {label}
        </span>
        <div className={`w-8 h-8 rounded-full ${style.iconBg} flex items-center justify-center shrink-0`}>
          <Icon className={`w-4 h-4 ${style.iconColor}`} />
        </div>
      </div>

      <div className={`font-serif text-3xl md:text-4xl font-normal ${style.numColor} leading-none mb-2`}>
        {value}
      </div>

      <div className="font-sans text-xs text-[#4a6353]">
        {caption}
      </div>
    </div>
  );
}

export default function StatsCards({ leads = [], loading = false }) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="botanical-card rounded-[34px] p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="botanical-skeleton w-14 h-3" />
              <div className="botanical-skeleton w-8 h-8 rounded-full" />
            </div>
            <div className="botanical-skeleton w-12 h-8" />
            <div className="botanical-skeleton w-20 h-3" />
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
    (l) =>
      l.follow_up_status === "PENDING" &&
      l.follow_up_due_at &&
      new Date(l.follow_up_due_at) <= new Date()
  ).length;

  const stats = [
    {
      label: "Total Leads",
      value: total,
      caption: "In local registry",
      icon: Users,
      tone: "default",
    },
    {
      label: "Hot Leads",
      value: hot,
      caption: total > 0 ? `${Math.round((hot / total) * 100)}% of pipeline` : "Ready to close",
      icon: Flame,
      tone: "hot",
    },
    {
      label: "Warm Leads",
      value: warm,
      caption: "Nurture & qualify",
      icon: TrendingUp,
      tone: "warm",
    },
    {
      label: "Cold Leads",
      value: cold,
      caption: "Long-term horizon",
      icon: Compass,
      tone: "cold",
    },
    {
      label: "High Priority",
      value: highPriority,
      caption: "Immediate action",
      icon: Zap,
      tone: "urgent",
    },
    {
      label: "Follow-ups Due",
      value: dueNow,
      caption: dueNow > 0 ? "Requires outreach" : "All schedules fresh",
      icon: CalendarClock,
      tone: "due",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
      {stats.map((s, idx) => (
        <BotanicalKpiCard key={idx} {...s} />
      ))}
    </div>
  );
}
