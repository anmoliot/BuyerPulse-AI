import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, ChevronRight, MapPin, Sparkles } from "lucide-react";
import { priorityRank, urgencyRank } from "../utils/priority";
import { relativeTime } from "../utils/format";

// Minimal Botanical Sprig for Empty State
const BotanicalSprig = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true" className="mx-auto mb-4 opacity-75">
    <path
      d="M24 42V10"
      stroke="#697961"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M24 10C24 10 20 6 15 8C10 10 12 16 16 17C20 18 24 14 24 10Z"
      fill="#e0e5d3"
      stroke="#1e382c"
      strokeWidth="1.25"
    />
    <path
      d="M24 16C24 16 29 13 34 16C39 19 36 24 32 24C28 24 24 20 24 16Z"
      fill="#e0e5d3"
      stroke="#1e382c"
      strokeWidth="1.25"
    />
    <path
      d="M24 23C24 23 18 21 14 25C10 29 14 33 18 32C22 31 24 27 24 23Z"
      fill="#e6cbb8"
      stroke="#895440"
      strokeWidth="1.25"
    />
    <path
      d="M24 30C24 30 30 29 33 33C36 37 32 40 28 39C24 38 24 33 24 30Z"
      fill="#e0e5d3"
      stroke="#1e382c"
      strokeWidth="1.25"
    />
  </svg>
);

// Refined circular score badge
function BotanicalScore({ score }) {
  if (score === null || score === undefined) {
    return <span className="font-sans text-xs text-[#b5baa4]">—</span>;
  }

  const isHot = score >= 75;
  const strokeColor = isHot ? "#895440" : score >= 40 ? "#6d4231" : "#697961";
  const radius = 15;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(100, Math.max(0, score)) / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center w-10 h-10">
      <svg className="w-10 h-10 -rotate-90">
        <circle
          cx="20"
          cy="20"
          r={radius}
          stroke="#d4d0bd"
          strokeWidth="2"
          fill="none"
        />
        <circle
          cx="20"
          cy="20"
          r={radius}
          stroke={strokeColor}
          strokeWidth="2"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="none"
          className="transition-all duration-500 ease-out"
        />
      </svg>
      <span className="absolute font-serif text-sm font-normal text-[#1e382c]">
        {score}
      </span>
    </div>
  );
}

function PriorityBadge({ priority }) {
  if (!priority) return null;
  const badgeClass =
    priority === "HOT"
      ? "botanical-badge-hot"
      : priority === "WARM"
      ? "botanical-badge-warm"
      : "botanical-badge-cold";

  return <span className={badgeClass}>{priority}</span>;
}

function getInitials(name = "") {
  const parts = name.trim().split(/\s+/);
  return parts.length >= 2
    ? (parts[0][0] + parts[1][0]).toUpperCase()
    : (name.slice(0, 2) || "LP").toUpperCase();
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
        return (
          l.intake?.name?.toLowerCase().includes(needle) ||
          l.intake?.location?.toLowerCase().includes(needle) ||
          l.intake?.property_requirement?.toLowerCase().includes(needle)
        );
      }
      return true;
    });

    if (sort === "score")
      out = [...out].sort((a, b) => (b.analysis?.lead_score ?? -1) - (a.analysis?.lead_score ?? -1));
    else if (sort === "urgency")
      out = [...out].sort((a, b) => urgencyRank(b.analysis?.urgency) - urgencyRank(a.analysis?.urgency));
    else if (sort === "newest")
      out = [...out].sort((a, b) => (b.created_at || "").localeCompare(a.created_at || ""));
    else if (sort === "priority")
      out = [...out].sort((a, b) => priorityRank(b.analysis?.priority) - priorityRank(a.analysis?.priority));
    return out;
  }, [leads, sort, currentFilter, q]);

  if (loading) {
    return (
      <div className="botanical-card rounded-[34px] overflow-hidden p-6 space-y-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-center gap-4 py-3 border-b border-[#d4d0bd]">
            <div className="botanical-skeleton w-10 h-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="botanical-skeleton w-36 h-4" />
              <div className="botanical-skeleton w-24 h-3" />
            </div>
            <div className="botanical-skeleton w-16 h-6 rounded-full" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="botanical-card rounded-[34px] overflow-hidden bg-[#fbf8f0]">
      {/* ── Toolbar ── */}
      <div className="p-4 md:p-5 border-b border-[#d4d0bd] flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8c9b88]" />
          <input
            type="text"
            className="botanical-input !pl-10 !py-2 text-sm"
            placeholder="Search buyers, locations, requirements…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>

        {/* Priority Segmented Filter */}
        <div className="flex items-center gap-1 p-1 rounded-full bg-[#e0e5d3]/50 border border-[#d4d0bd]">
          {["ALL", "HOT", "WARM", "COLD"].map((p) => {
            const active = currentFilter === p;
            return (
              <button
                key={p}
                onClick={() => setCurrentFilter(p)}
                className={`font-sans text-xs font-semibold px-3.5 py-1.5 rounded-full transition-all ${
                  active
                    ? "bg-[#1e382c] text-[#f5efdf] shadow-sm"
                    : "text-[#3d5446] hover:text-[#1e382c]"
                }`}
              >
                {p === "ALL" ? "All" : p}
              </button>
            );
          })}
        </div>

        {/* Sort & Count */}
        <div className="flex items-center gap-3">
          <span className="font-sans text-xs text-[#697961]">Sort:</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="bg-[#ffffff] border border-[#d4d0bd] rounded-xl px-3 py-1.5 font-sans text-xs text-[#1e382c] outline-none focus:ring-2 focus:ring-[#1e382c]/10"
          >
            <option value="score">Score (High → Low)</option>
            <option value="priority">Priority</option>
            <option value="urgency">Urgency</option>
            <option value="newest">Newest</option>
          </select>

          <span className="font-sans text-xs text-[#697961] hidden sm:inline ml-2">
            {rows.length} {rows.length === 1 ? "lead" : "leads"}
          </span>
        </div>
      </div>

      {/* ── Empty State ── */}
      {rows.length === 0 ? (
        <div className="botanical-empty-state m-6">
          <BotanicalSprig />
          <h3 className="font-serif text-2xl font-normal text-[#1e382c] mb-2">
            {q || currentFilter !== "ALL" ? "No matching buyer leads" : "No leads in pipeline"}
          </h3>
          <p className="font-sans text-sm text-[#4a6353] max-w-sm mb-6">
            {q || currentFilter !== "ALL"
              ? "Try adjusting your search terms or filter selection."
              : "Load demo buyer inquiries to explore AI lead scoring, or add your first inquiry."}
          </p>
          <div className="flex gap-3 flex-wrap justify-center">
            {onLoadDemo && (
              <button onClick={onLoadDemo} className="botanical-button-primary text-sm">
                <Sparkles className="w-4 h-4 text-[#e6cbb8]" />
                <span>Load Demo Leads</span>
              </button>
            )}
            <Link to="/leads/new" className="botanical-button-secondary text-sm">
              Add Lead
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* ── Desktop Table ── */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#d4d0bd] bg-[#e0e5d3]/25">
                  <th className="py-3.5 px-6 font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-[#1e382c]">
                    Buyer &amp; Location
                  </th>
                  <th className="py-3.5 px-4 font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-[#1e382c]">
                    Requirement &amp; Budget
                  </th>
                  <th className="py-3.5 px-4 font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-[#1e382c]">
                    Timeline
                  </th>
                  <th className="py-3.5 px-4 font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-[#1e382c]">
                    AI Score
                  </th>
                  <th className="py-3.5 px-4 font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-[#1e382c]">
                    Priority
                  </th>
                  <th className="py-3.5 px-4 font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-[#1e382c]">
                    Urgency
                  </th>
                  <th className="py-3.5 px-4 font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-[#1e382c]">
                    Status
                  </th>
                  <th className="py-3.5 px-4" />
                </tr>
              </thead>
              <tbody className="divide-y divide-[#d4d0bd]">
                {rows.map((lead) => {
                  const hasAnalysis = !!lead.analysis;
                  const isHighUrgency = lead.analysis?.urgency === "HIGH";

                  return (
                    <tr
                      key={lead.id}
                      onClick={() => navigate(`/leads/${lead.id}`)}
                      className="group cursor-pointer hover:bg-[#e0e5d3]/35 transition-colors duration-interaction"
                    >
                      {/* Buyer + Location */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3.5">
                          <div className="w-10 h-10 rounded-full bg-[#e0e5d3] border border-[#b5baa4] text-[#1e382c] font-sans font-medium text-xs flex items-center justify-center shrink-0">
                            {getInitials(lead.intake?.name)}
                          </div>
                          <div>
                            <div className="font-serif text-base font-normal text-[#1e382c] group-hover:text-[#895440] transition-colors">
                              {lead.intake?.name}
                            </div>
                            <div className="font-sans text-xs text-[#697961] flex items-center gap-1 mt-0.5">
                              <MapPin className="w-3 h-3 text-[#8c9b88]" />
                              <span>{lead.intake?.location}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Requirement + Budget */}
                      <td className="py-4 px-4 max-w-xs">
                        <div className="font-sans text-xs text-[#1e382c] truncate">
                          {lead.intake?.property_requirement}
                        </div>
                        <div className="font-sans text-xs font-semibold text-[#895440] mt-0.5">
                          {lead.intake?.budget}
                        </div>
                      </td>

                      {/* Timeline */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className="font-sans text-xs text-[#4a6353] px-2.5 py-1 rounded-full bg-[#e0e5d3]/50 border border-[#d4d0bd]">
                          {lead.intake?.buying_timeline}
                        </span>
                      </td>

                      {/* Score */}
                      <td className="py-4 px-4">
                        <BotanicalScore score={lead.analysis?.lead_score} />
                      </td>

                      {/* Priority */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        {hasAnalysis ? (
                          <PriorityBadge priority={lead.analysis.priority} />
                        ) : lead.analysis_error ? (
                          <span className="botanical-badge-danger">Error</span>
                        ) : (
                          <span className="font-sans text-xs text-[#8c9b88] italic">Analyzing…</span>
                        )}
                      </td>

                      {/* Urgency */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        {lead.analysis?.urgency ? (
                          <span
                            className={`font-sans text-xs font-medium ${
                              isHighUrgency ? "text-[#895440] font-semibold" : "text-[#4a6353]"
                            }`}
                          >
                            {lead.analysis.urgency}
                          </span>
                        ) : (
                          <span className="text-[#8c9b88] text-xs">—</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        {hasAnalysis ? (
                          <span className="font-sans text-xs font-medium text-[#245237]">
                            ✓ Ready
                          </span>
                        ) : lead.analysis_error ? (
                          <span className="font-sans text-xs font-medium text-[#895440]">
                            ✕ Retry required
                          </span>
                        ) : (
                          <span className="font-sans text-xs text-[#8c9b88] italic">
                            Queued…
                          </span>
                        )}
                      </td>

                      {/* Chevron */}
                      <td className="py-4 px-4 text-right">
                        <ChevronRight className="w-4 h-4 text-[#8c9b88] group-hover:text-[#1e382c] group-hover:translate-x-0.5 transition-all" />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* ── Mobile Card Layout ── */}
          <div className="lg:hidden divide-y divide-[#d4d0bd]">
            {rows.map((lead) => {
              const hasAnalysis = !!lead.analysis;

              return (
                <div
                  key={lead.id}
                  onClick={() => navigate(`/leads/${lead.id}`)}
                  className="p-4 hover:bg-[#e0e5d3]/30 transition-colors cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#e0e5d3] border border-[#b5baa4] text-[#1e382c] font-sans font-medium text-xs flex items-center justify-center shrink-0">
                        {getInitials(lead.intake?.name)}
                      </div>
                      <div>
                        <div className="font-serif text-lg font-normal text-[#1e382c]">
                          {lead.intake?.name}
                        </div>
                        <div className="font-sans text-xs text-[#697961]">
                          {lead.intake?.location}
                        </div>
                      </div>
                    </div>
                    <BotanicalScore score={lead.analysis?.lead_score} />
                  </div>

                  <div className="font-sans text-xs text-[#4a6353] mb-3 truncate">
                    {lead.intake?.property_requirement} ·{" "}
                    <span className="font-semibold text-[#895440]">{lead.intake?.budget}</span>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {hasAnalysis && <PriorityBadge priority={lead.analysis.priority} />}
                      <span className="font-sans text-[11px] text-[#697961]">
                        {lead.intake?.buying_timeline}
                      </span>
                    </div>
                    <span className="font-sans text-[11px] text-[#8c9b88]">
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
