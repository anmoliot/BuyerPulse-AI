import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { PRIORITY_COLORS, priorityRank, urgencyRank } from "../utils/priority";
import { relativeTime } from "../utils/format";

export default function LeadTable({ leads }) {
  const [sort, setSort] = useState("score");
  const [filter, setFilter] = useState("ALL");
  const [q, setQ] = useState("");

  const rows = useMemo(() => {
    let out = leads.filter((l) => {
      if (filter !== "ALL" && l.analysis?.priority !== filter) return false;
      if (q) {
        const needle = q.toLowerCase();
        return (
          l.intake.name.toLowerCase().includes(needle) ||
          l.intake.location.toLowerCase().includes(needle)
        );
      }
      return true;
    });
    if (sort === "score") out = out.sort((a, b) => (b.analysis?.lead_score ?? -1) - (a.analysis?.lead_score ?? -1));
    if (sort === "urgency") out = out.sort((a, b) => urgencyRank(b.analysis?.urgency) - urgencyRank(a.analysis?.urgency));
    if (sort === "newest") out = out.sort((a, b) => (b.created_at || "").localeCompare(a.created_at || ""));
    if (sort === "priority") out = out.sort((a, b) => priorityRank(b.analysis?.priority) - priorityRank(a.analysis?.priority));
    return out;
  }, [leads, sort, filter, q]);

  return (
    <div className="card overflow-hidden">
      <div className="flex flex-wrap gap-3 items-center p-4 border-b border-ink-700">
        <input
          className="input max-w-xs"
          placeholder="Search name or location…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <select className="input max-w-[160px]" value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="ALL">All priorities</option>
          <option value="HOT">HOT</option>
          <option value="WARM">WARM</option>
          <option value="COLD">COLD</option>
        </select>
        <select className="input max-w-[180px]" value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="score">Sort: Score</option>
          <option value="priority">Sort: Priority</option>
          <option value="urgency">Sort: Urgency</option>
          <option value="newest">Sort: Newest</option>
        </select>
        <span className="text-xs text-slate-500 ml-auto">{rows.length} leads</span>
      </div>

      {rows.length === 0 ? (
        <div className="p-10 text-center text-slate-400">
          No leads yet. Use <span className="text-accent-soft">Load demo leads</span> or add a lead.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-slate-400 text-xs uppercase">
              <tr className="border-b border-ink-700">
                <th className="text-left px-4 py-3">Name</th>
                <th className="text-left px-4 py-3">Location</th>
                <th className="text-left px-4 py-3">Budget</th>
                <th className="text-left px-4 py-3">Requirement</th>
                <th className="text-left px-4 py-3">Timeline</th>
                <th className="text-left px-4 py-3">Score</th>
                <th className="text-left px-4 py-3">Priority</th>
                <th className="text-left px-4 py-3">Urgency</th>
                <th className="text-left px-4 py-3">Follow-up</th>
                <th className="text-left px-4 py-3">Created</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((l) => (
                <tr key={l.id} className="border-b border-ink-700 hover:bg-ink-700/40">
                  <td className="px-4 py-3">
                    <Link to={`/leads/${l.id}`} className="font-medium text-slate-100 hover:text-accent-soft">
                      {l.intake.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-slate-300">{l.intake.location}</td>
                  <td className="px-4 py-3 text-slate-300">{l.intake.budget}</td>
                  <td className="px-4 py-3 text-slate-300 max-w-[220px] truncate">{l.intake.property_requirement}</td>
                  <td className="px-4 py-3 text-slate-300">{l.intake.buying_timeline}</td>
                  <td className="px-4 py-3">{l.analysis ? l.analysis.lead_score : <span className="text-slate-500">—</span>}</td>
                  <td className="px-4 py-3">
                    {l.analysis ? (
                      <span className={`chip ${PRIORITY_COLORS[l.analysis.priority]}`}>{l.analysis.priority}</span>
                    ) : l.analysis_error ? (
                      <span className="chip bg-red-500/15 text-red-300 border border-red-500/30">Error</span>
                    ) : (
                      <span className="chip bg-slate-500/15 text-slate-300">Pending</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-300">{l.analysis?.urgency || "—"}</td>
                  <td className="px-4 py-3 text-slate-300">{l.analysis?.follow_up_hours ? `${l.analysis.follow_up_hours}h` : "—"}</td>
                  <td className="px-4 py-3 text-slate-400">{relativeTime(l.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
