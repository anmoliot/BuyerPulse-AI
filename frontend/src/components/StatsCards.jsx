export default function StatsCards({ leads }) {
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

  const items = [
    { label: "Total leads", value: total, tone: "text-slate-100" },
    { label: "Hot", value: hot, tone: "text-red-300" },
    { label: "Warm", value: warm, tone: "text-amber-300" },
    { label: "Cold", value: cold, tone: "text-sky-300" },
    { label: "High priority", value: highPriority, tone: "text-fuchsia-300" },
    { label: "Follow-up due", value: dueNow, tone: "text-emerald-300" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
      {items.map((it) => (
        <div key={it.label} className="card p-4">
          <div className="text-xs text-slate-400">{it.label}</div>
          <div className={`text-2xl font-bold mt-1 ${it.tone}`}>{it.value}</div>
        </div>
      ))}
    </div>
  );
}
