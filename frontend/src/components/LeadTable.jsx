import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  SlidersHorizontal,
  Flame,
  Clock,
  ArrowUpDown,
  MapPin,
  ChevronRight,
  AlertTriangle,
  Sparkles,
  UserPlus,
  RefreshCw,
  Building,
} from "lucide-react";
import { PRIORITY_COLORS, priorityRank, urgencyRank } from "../utils/priority";
import { relativeTime } from "../utils/format";

function getInitials(name = "") {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return (name.slice(0, 2) || "LP").toUpperCase();
}

function ScoreCircle({ score }) {
  if (score === null || score === undefined) {
    return <span className="text-slate-500 font-mono text-xs">—</span>;
  }

  const radius = 14;
  const stroke = 2.5;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  let color = "#64748b"; // cold
  if (score >= 75) color = "#ef4444"; // hot
  else if (score >= 40) color = "#f59e0b"; // warm

  return (
    <div className="flex items-center gap-2">
      <div className="relative inline-flex items-center justify-center">
        <svg height={radius * 2} width={radius * 2} className="rotate-[-90deg]">
          <circle
            stroke="rgba(255, 255, 255, 0.08)"
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          <circle
            stroke={color}
            fill="transparent"
            strokeWidth={stroke}
            strokeDasharray={`${circumference} ${circumference}`}
            style={{ strokeDashoffset }}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
        </svg>
        <span className="absolute text-[10px] font-bold font-mono text-slate-100">
          {score}
        </span>
      </div>
    </div>
  );
}

export default function LeadTable({
  leads = [],
  loading = false,
  activeFilter,
  onFilterChange,
  onLoadDemo,
}) {
  const navigate = useNavigate();
  const [internalFilter, setInternalFilter] = useState("ALL");
  const [sort, setSort] = useState("score");
  const [q, setQ] = useState("");

  const currentFilter = activeFilter !== undefined ? activeFilter : internalFilter;
  const setCurrentFilter = onFilterChange || setInternalFilter;

  const rows = useMemo(() => {
    let out = leads.filter((l) => {
      if (currentFilter !== "ALL" && l.analysis?.priority !== currentFilter) return false;
      if (q.trim()) {
        const needle = q.toLowerCase();
        const nameMatch = l.intake?.name?.toLowerCase().includes(needle);
        const locMatch = l.intake?.location?.toLowerCase().includes(needle);
        const reqMatch = l.intake?.property_requirement?.toLowerCase().includes(needle);
        return nameMatch || locMatch || reqMatch;
      }
      return true;
    });

    if (sort === "score") {
      out = [...out].sort((a, b) => (b.analysis?.lead_score ?? -1) - (a.analysis?.lead_score ?? -1));
    } else if (sort === "urgency") {
      out = [...out].sort((a, b) => urgencyRank(b.analysis?.urgency) - urgencyRank(a.analysis?.urgency));
    } else if (sort === "newest") {
      out = [...out].sort((a, b) => (b.created_at || "").localeCompare(a.created_at || ""));
    } else if (sort === "priority") {
      out = [...out].sort((a, b) => priorityRank(b.analysis?.priority) - priorityRank(a.analysis?.priority));
    }
    return out;
  }, [leads, sort, currentFilter, q]);

  if (loading) {
    return (
      <div className="card overflow-hidden">
        <div className="p-4 border-b border-white/[0.06] flex items-center justify-between">
          <div className="w-48 h-8 skeleton" />
          <div className="w-24 h-8 skeleton" />
        </div>
        <div className="divide-y divide-white/[0.06]">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="p-4 flex items-center gap-4">
              <div className="w-9 h-9 rounded-full skeleton shrink-0" />
              <div className="space-y-1.5 flex-1">
                <div className="w-32 h-4 skeleton" />
                <div className="w-48 h-3 skeleton" />
              </div>
              <div className="w-16 h-6 skeleton" />
              <div className="w-12 h-6 skeleton" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden border border-white/[0.08]">
      {/* Table Toolbar & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 bg-surface-900/60 border-b border-white/[0.06]">
        <div className="flex flex-wrap items-center gap-2.5 flex-1 max-w-xl">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              className="input !pl-9 !py-1.5 text-xs md:text-sm"
              placeholder="Search by buyer, location, or requirement…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            {q && (
              <button
                onClick={() => setQ("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-200"
              >
                ×
              </button>
            )}
          </div>

          {/* Segmented Priority Filter Controls */}
          <div className="flex items-center bg-surface-950 border border-white/[0.08] rounded-lg p-0.5 text-xs">
            {["ALL", "HOT", "WARM", "COLD"].map((p) => {
              const active = currentFilter === p;
              return (
                <button
                  key={p}
                  onClick={() => setCurrentFilter(p)}
                  className={`px-2.5 py-1 rounded-md font-medium transition-all duration-150 ${
                    active
                      ? p === "HOT"
                        ? "bg-red-500/20 text-red-300 shadow-sm"
                        : p === "WARM"
                        ? "bg-amber-500/20 text-amber-300 shadow-sm"
                        : p === "COLD"
                        ? "bg-slate-500/20 text-slate-300 shadow-sm"
                        : "bg-indigo-600 text-white shadow-sm"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {p === "ALL" ? "All" : p}
                </button>
              );
            })}
          </div>
        </div>

        {/* Sort Selector & Meta Count */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              className="bg-surface-900 border border-white/[0.08] text-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-indigo-500"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="score">Sort: Score</option>
              <option value="priority">Sort: Priority</option>
              <option value="urgency">Sort: Urgency</option>
              <option value="newest">Sort: Newest</option>
            </select>
          </div>

          <span className="text-xs font-mono text-slate-400 bg-surface-950 px-2 py-1 rounded border border-white/[0.06]">
            {rows.length} {rows.length === 1 ? "lead" : "leads"}
          </span>
        </div>
      </div>

      {/* Empty State */}
      {rows.length === 0 ? (
        <div className="empty-state py-14 px-6 text-center">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-3 shadow-glow">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-slate-200 mb-1">
            {q || currentFilter !== "ALL" ? "No matching leads found" : "Pipeline is empty"}
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mb-5">
            {q || currentFilter !== "ALL"
              ? "Try adjusting your search criteria or priority filter."
              : "Ingest your first buyer inquiry or load 5 realistic pre-computed demo leads to evaluate intelligence scoring."}
          </p>

          <div className="flex items-center gap-2">
            {onLoadDemo && (
              <button onClick={onLoadDemo} className="btn-primary">
                <Sparkles className="w-4 h-4" />
                <span>Load Demo Leads</span>
              </button>
            )}
            <Link to="/leads/new" className="btn-secondary">
              <UserPlus className="w-4 h-4" />
              <span>Add Lead</span>
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-left text-xs md:text-sm">
              <thead className="bg-surface-900/90 text-[11px] font-semibold uppercase tracking-wider text-slate-400 border-b border-white/[0.06] sticky top-0">
                <tr>
                  <th className="py-3 px-4">Buyer & Location</th>
                  <th className="py-3 px-4">Requirement & Budget</th>
                  <th className="py-3 px-4">Timeline</th>
                  <th className="py-3 px-4">AI Score</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Urgency</th>
                  <th className="py-3 px-4">Follow-up Window</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {rows.map((lead) => {
                  const hasAnalysis = !!lead.analysis;
                  const isHot = lead.analysis?.priority === "HOT";
                  const isHighUrgency = lead.analysis?.urgency === "HIGH";

                  return (
                    <tr
                      key={lead.id}
                      onClick={() => navigate(`/leads/${lead.id}`)}
                      className="group cursor-pointer hover:bg-surface-800/60 transition-colors duration-150"
                    >
                      {/* Buyer Name & Location */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center font-semibold text-xs shrink-0 border transition-transform group-hover:scale-105 ${
                              isHot
                                ? "bg-red-500/10 text-red-400 border-red-500/25"
                                : "bg-surface-800 text-slate-300 border-white/[0.08]"
                            }`}
                          >
                            {getInitials(lead.intake?.name)}
                          </div>
                          <div className="min-w-0">
                            <div className="font-semibold text-slate-100 group-hover:text-indigo-400 transition-colors truncate max-w-[170px]">
                              {lead.intake?.name}
                            </div>
                            <div className="flex items-center gap-1 text-xs text-slate-400 truncate max-w-[170px] mt-0.5">
                              <MapPin className="w-3 h-3 shrink-0 text-slate-500" />
                              <span className="truncate">{lead.intake?.location}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Requirement & Budget */}
                      <td className="py-3.5 px-4 max-w-[240px]">
                        <div className="truncate text-slate-200 text-xs font-medium">
                          {lead.intake?.property_requirement}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono mt-0.5 flex items-center gap-1">
                          <span className="text-slate-500">Budget:</span>
                          <span className="text-emerald-400 font-semibold">{lead.intake?.budget}</span>
                        </div>
                      </td>

                      {/* Timeline */}
                      <td className="py-3.5 px-4 text-xs text-slate-300 whitespace-nowrap">
                        <span className="bg-surface-900 px-2 py-1 rounded border border-white/[0.06] text-slate-300">
                          {lead.intake?.buying_timeline}
                        </span>
                      </td>

                      {/* AI Score */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <ScoreCircle score={lead.analysis?.lead_score} />
                      </td>

                      {/* Priority */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {hasAnalysis ? (
                          <span className={`badge ${PRIORITY_COLORS[lead.analysis.priority]}`}>
                            {lead.analysis.priority === "HOT" && <Flame className="w-3 h-3 inline" />}
                            {lead.analysis.priority}
                          </span>
                        ) : lead.analysis_error ? (
                          <span className="badge badge-danger">Error</span>
                        ) : (
                          <span className="badge badge-cold">Pending</span>
                        )}
                      </td>

                      {/* Urgency */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-xs">
                        {lead.analysis?.urgency ? (
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                isHighUrgency
                                  ? "bg-red-400 animate-pulse"
                                  : lead.analysis.urgency === "MEDIUM"
                                  ? "bg-amber-400"
                                  : "bg-slate-400"
                              }`}
                            />
                            <span
                              className={
                                isHighUrgency
                                  ? "text-red-300 font-medium"
                                  : "text-slate-400"
                              }
                            >
                              {lead.analysis.urgency}
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-600">—</span>
                        )}
                      </td>

                      {/* Follow-up Window */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-xs text-slate-300 font-mono">
                        {lead.analysis?.follow_up_hours ? (
                          <span className="flex items-center gap-1 text-slate-300">
                            <Clock className="w-3 h-3 text-slate-500" />
                            {lead.analysis.follow_up_hours}h window
                          </span>
                        ) : (
                          <span className="text-slate-600">—</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-xs">
                        {hasAnalysis ? (
                          <span className="badge bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                            Analyzed
                          </span>
                        ) : lead.analysis_error ? (
                          <span className="badge bg-red-500/10 text-red-400 border-red-500/20">
                            Failed
                          </span>
                        ) : (
                          <span className="badge bg-amber-500/10 text-amber-300 border-amber-500/20">
                            Processing
                          </span>
                        )}
                      </td>

                      {/* Row Action Arrow */}
                      <td className="py-3.5 px-4 text-right">
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg text-slate-400 group-hover:text-indigo-400 group-hover:bg-white/[0.06] transition-colors">
                          <ChevronRight className="w-4 h-4" />
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile / Tablet Responsive Cards */}
          <div className="lg:hidden divide-y divide-white/[0.06]">
            {rows.map((lead) => {
              const hasAnalysis = !!lead.analysis;
              const isHot = lead.analysis?.priority === "HOT";

              return (
                <div
                  key={lead.id}
                  onClick={() => navigate(`/leads/${lead.id}`)}
                  className="p-4 hover:bg-surface-800/40 active:bg-surface-800/70 cursor-pointer space-y-3 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center font-semibold text-xs border ${
                          isHot
                            ? "bg-red-500/10 text-red-400 border-red-500/25"
                            : "bg-surface-800 text-slate-300 border-white/[0.08]"
                        }`}
                      >
                        {getInitials(lead.intake?.name)}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-100 text-sm">{lead.intake?.name}</div>
                        <div className="flex items-center gap-1 text-xs text-slate-400">
                          <MapPin className="w-3 h-3 text-slate-500" />
                          <span>{lead.intake?.location}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <ScoreCircle score={lead.analysis?.lead_score} />
                      <ChevronRight className="w-4 h-4 text-slate-500" />
                    </div>
                  </div>

                  <div className="text-xs text-slate-300 line-clamp-1">
                    {lead.intake?.property_requirement}
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-white/[0.04] text-xs">
                    <div className="flex items-center gap-2">
                      {hasAnalysis && (
                        <span className={`badge ${PRIORITY_COLORS[lead.analysis.priority]}`}>
                          {lead.analysis.priority}
                        </span>
                      )}
                      <span className="text-slate-400 text-[11px] font-mono">
                        {lead.intake?.budget}
                      </span>
                    </div>

                    <span className="text-[11px] text-slate-500">
                      {relativeTime(lead.created_at)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
