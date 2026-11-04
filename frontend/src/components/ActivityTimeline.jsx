import { relativeTime } from "../utils/format";

export default function ActivityTimeline({ lead }) {
  if (!lead) return null;
  const events = [];
  events.push({ ts: lead.created_at, label: "Lead created" });
  if (lead.analysis) events.push({ ts: lead.updated_at, label: "AI analysis completed" });
  if (lead.analysis_error) events.push({ ts: lead.updated_at, label: `Analysis failed: ${lead.analysis_error}` });
  if (lead.follow_up) events.push({ ts: lead.updated_at, label: "Follow-up strategy generated" });
  (lead.chat_history || []).forEach((h, i) => {
    if (h.role === "user") events.push({ ts: h.ts, label: `Copilot Q${i + 1}` });
  });
  events.sort((a, b) => (a.ts || "").localeCompare(b.ts || ""));

  return (
    <div className="card p-4">
      <div className="text-xs uppercase text-slate-400 mb-2">Activity</div>
      <ol className="border-l border-ink-700 pl-4 space-y-2">
        {events.map((e, i) => (
          <li key={i} className="relative">
            <span className="absolute -left-[21px] top-1.5 w-2 h-2 rounded-full bg-accent" />
            <div className="text-sm text-slate-200">{e.label}</div>
            <div className="text-xs text-slate-500">{relativeTime(e.ts)}</div>
          </li>
        ))}
      </ol>
    </div>
  );
}
