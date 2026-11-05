import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Sparkles,
  Plus,
  AlertTriangle,
  ChevronRight,
  Trash2,
  ArrowRight,
  ShieldAlert,
  Clock3,
  CheckCircle2,
  Clock,
} from "lucide-react";
import StatsCards from "./StatsCards";
import LeadTable from "./LeadTable";
import { relativeTime } from "../utils/format";

// Tall arched abstract botanical architectural composition
const BotanicalArchedVisual = () => (
  <div className="relative w-48 md:w-56 h-64 shrink-0 hidden sm:block overflow-hidden rounded-t-[110px] rounded-b-[24px] border border-[#d4d0bd] bg-[#e0e5d3]/40 p-4">
    <svg viewBox="0 0 200 240" fill="none" className="w-full h-full" aria-hidden="true">
      {/* Outer arch line */}
      <path
        d="M20 240V100C20 55.8 55.8 20 100 20C144.2 20 180 55.8 180 100V240"
        stroke="#697961"
        strokeWidth="1"
        strokeDasharray="3 3"
      />
      {/* Inner solid arch */}
      <path
        d="M40 240V105C40 71.9 66.9 45 100 45C133.1 45 160 71.9 160 105V240"
        stroke="#1e382c"
        strokeWidth="1.25"
      />
      {/* Architectural sun / horizon */}
      <circle cx="100" cy="115" r="32" fill="#e6cbb8" opacity="0.65" />
      <circle cx="100" cy="115" r="20" stroke="#895440" strokeWidth="1" />
      
      {/* Botanical leaf silhouette */}
      <path
        d="M100 230C100 230 65 190 65 140C65 110 82 85 100 85C118 85 135 110 135 140C135 190 100 230 100 230Z"
        fill="#e0e5d3"
        stroke="#1e382c"
        strokeWidth="1.25"
      />
      <path
        d="M100 95V225"
        stroke="#1e382c"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="M100 130L120 115"
        stroke="#1e382c"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <path
        d="M100 155L80 140"
        stroke="#1e382c"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <path
        d="M100 180L120 165"
        stroke="#1e382c"
        strokeWidth="1"
        strokeLinecap="round"
      />
    </svg>
  </div>
);

export default function Dashboard({ leads = [], loadDemo, clearAll }) {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("ALL");

  const total = leads.length;
  const hotCount = leads.filter((l) => l.analysis?.priority === "HOT").length;
  const warmCount = leads.filter((l) => l.analysis?.priority === "WARM").length;
  const coldCount = leads.filter((l) => l.analysis?.priority === "COLD").length;

  const hotPct = total > 0 ? Math.round((hotCount / total) * 100) : 0;
  const warmPct = total > 0 ? Math.round((warmCount / total) * 100) : 0;
  const coldPct = total > 0 ? Math.max(0, 100 - hotPct - warmPct) : 0;

  const attentionLeads = useMemo(() => {
    return leads
      .filter((l) => {
        const hasHighUrgency = l.analysis?.urgency === "HIGH";
        const hasHighObjection = l.analysis?.objections?.some((o) => o.severity === "HIGH");
        const isFollowUpDue =
          l.follow_up_status === "PENDING" &&
          l.follow_up_due_at &&
          new Date(l.follow_up_due_at) <= new Date();
        return hasHighUrgency || hasHighObjection || isFollowUpDue;
      })
      .slice(0, 4);
  }, [leads]);

  const recentActivities = useMemo(() => {
    const list = [];
    leads.forEach((l) => {
      list.push({
        id: `${l.id}-created`,
        leadId: l.id,
        leadName: l.intake?.name || "Unknown Lead",
        type: "CREATED",
        title: "New Lead Intake",
        detail: `${l.intake?.property_requirement} · ${l.intake?.location}`,
        timestamp: l.created_at,
      });
      if (l.analysis) {
        list.push({
          id: `${l.id}-analyzed`,
          leadId: l.id,
          leadName: l.intake?.name || "Unknown Lead",
          type: "ANALYZED",
          title: `AI Intelligence Qualified (${l.analysis.priority} · Score ${l.analysis.lead_score})`,
          detail: l.analysis.summary?.slice(0, 90) + "…",
          timestamp: l.created_at,
        });
      }
      if (l.follow_up_status === "DONE") {
        list.push({
          id: `${l.id}-followup`,
          leadId: l.id,
          leadName: l.intake?.name || "Unknown Lead",
          type: "FOLLOWUP",
          title: "Follow-up Completed",
          detail: "Outreach logged by sales agent",
          timestamp: l.created_at,
        });
      }
    });
    return list.slice(0, 5);
  }, [leads]);

  return (
    <div className="space-y-8">
      {/* ── 1. Editorial Hero Section ── */}
      <div className="botanical-card rounded-[34px] p-6 md:p-10 flex flex-col sm:flex-row items-center justify-between gap-8 bg-[#fbf8f0]">
        <div className="flex-1 max-w-2xl">
          <span className="botanical-eyebrow">Real Estate Lead Intelligence</span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#1e382c] tracking-tight mt-2 mb-3 leading-[1.12]">
            Know which buyer needs you <span className="italic text-[#895440]">next</span>.
          </h1>
          <p className="font-sans text-sm md:text-base text-[#4a6353] leading-relaxed mb-6 max-w-xl">
            Real-time AI buyer qualification, objection radar, and automated follow-up urgency.
            Turn passive inquiries into ready-to-close appointments.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Link to="/leads/new" className="botanical-button-primary">
              <Plus className="w-4 h-4" />
              <span>Add Lead</span>
            </Link>

            <button onClick={loadDemo} className="botanical-button-secondary">
              <Sparkles className="w-4 h-4 text-[#895440]" />
              <span>Load Demo Leads</span>
            </button>

            {leads.length > 0 && (
              <button
                onClick={clearAll}
                className="botanical-button-ghost text-xs text-[#895440] hover:text-[#6f4230]"
                title="Reset all local demo leads"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        <BotanicalArchedVisual />
      </div>

      {/* ── 2. KPI Section ── */}
      <StatsCards leads={leads} />

      {/* ── 3. Priority Distribution ── */}
      <div className="botanical-card rounded-[34px] p-6 bg-[#fbf8f0]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <div className="font-serif text-xl font-normal text-[#1e382c] flex items-center gap-2">
              <span>Priority Distribution</span>
              <span className="font-sans text-xs text-[#697961] font-normal">
                (Click segment to filter table below)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-5 font-sans text-xs">
            <button
              onClick={() => setActiveFilter(activeFilter === "HOT" ? "ALL" : "HOT")}
              className={`flex items-center gap-2 transition-opacity ${
                activeFilter !== "ALL" && activeFilter !== "HOT" ? "opacity-40" : "opacity-100"
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-[#895440]" />
              <span className="font-medium text-[#1e382c]">HOT ({hotCount})</span>
              <span className="text-[#697961]">{hotPct}%</span>
            </button>

            <button
              onClick={() => setActiveFilter(activeFilter === "WARM" ? "ALL" : "WARM")}
              className={`flex items-center gap-2 transition-opacity ${
                activeFilter !== "ALL" && activeFilter !== "WARM" ? "opacity-40" : "opacity-100"
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-[#e6cbb8] border border-[#895440]/30" />
              <span className="font-medium text-[#1e382c]">WARM ({warmCount})</span>
              <span className="text-[#697961]">{warmPct}%</span>
            </button>

            <button
              onClick={() => setActiveFilter(activeFilter === "COLD" ? "ALL" : "COLD")}
              className={`flex items-center gap-2 transition-opacity ${
                activeFilter !== "ALL" && activeFilter !== "COLD" ? "opacity-40" : "opacity-100"
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-[#e0e5d3] border border-[#697961]/30" />
              <span className="font-medium text-[#1e382c]">COLD ({coldCount})</span>
              <span className="text-[#697961]">{coldPct}%</span>
            </button>
          </div>
        </div>

        {/* Segmented bar */}
        <div className="h-3 w-full bg-[#e0e5d3]/40 rounded-full overflow-hidden flex p-0.5 border border-[#d4d0bd]">
          {total === 0 ? (
            <div className="w-full h-full bg-[#e0e5d3]/30 rounded-full" />
          ) : (
            <>
              {hotPct > 0 && (
                <div
                  style={{ width: `${hotPct}%` }}
                  onClick={() => setActiveFilter(activeFilter === "HOT" ? "ALL" : "HOT")}
                  className="h-full bg-[#895440] rounded-l-full cursor-pointer hover:opacity-90 transition-all"
                  title={`HOT: ${hotCount} (${hotPct}%)`}
                />
              )}
              {warmPct > 0 && (
                <div
                  style={{ width: `${warmPct}%` }}
                  onClick={() => setActiveFilter(activeFilter === "WARM" ? "ALL" : "WARM")}
                  className="h-full bg-[#e6cbb8] cursor-pointer hover:opacity-90 transition-all"
                  title={`WARM: ${warmCount} (${warmPct}%)`}
                />
              )}
              {coldPct > 0 && (
                <div
                  style={{ width: `${coldPct}%` }}
                  onClick={() => setActiveFilter(activeFilter === "COLD" ? "ALL" : "COLD")}
                  className="h-full bg-[#b5baa4] rounded-r-full cursor-pointer hover:opacity-90 transition-all"
                  title={`COLD: ${coldCount} (${coldPct}%)`}
                />
              )}
            </>
          )}
        </div>
      </div>

      {/* ── 4. Leads Needing Attention & Recent Activity (Side-by-Side) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Leads Needing Attention (Clay panel) */}
        <div className="botanical-clay-panel p-6 rounded-[34px] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#895440]/20">
              <div className="flex items-center gap-2.5">
                <AlertTriangle className="w-4 h-4 text-[#895440]" />
                <h3 className="font-serif text-xl font-normal text-[#1e382c]">
                  Leads Needing Attention
                </h3>
              </div>
              <span className="font-sans text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#895440]/15 text-[#895440]">
                {attentionLeads.length} flagged
              </span>
            </div>

            {attentionLeads.length === 0 ? (
              <div className="py-10 text-center font-sans text-xs text-[#4a6353]">
                <CheckCircle2 className="w-6 h-6 text-[#1e382c] mx-auto mb-2 opacity-60" />
                No urgent bottlenecks. All follow-up schedules are on track.
              </div>
            ) : (
              <div className="space-y-3">
                {attentionLeads.map((lead) => {
                  const highObjection = lead.analysis?.objections?.find((o) => o.severity === "HIGH");
                  const isHighUrgency = lead.analysis?.urgency === "HIGH";

                  return (
                    <div
                      key={lead.id}
                      onClick={() => navigate(`/leads/${lead.id}`)}
                      className="group p-3.5 rounded-2xl bg-[#fbf8f0] border border-[#d4d0bd] hover:border-[#895440]/40 hover:shadow-subtle cursor-pointer transition-all flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-serif text-base font-normal text-[#1e382c] group-hover:text-[#895440] transition-colors truncate">
                            {lead.intake?.name}
                          </span>
                          {lead.analysis && (
                            <span
                              className={`botanical-badge !py-0.5 !px-2 text-[10px] ${
                                lead.analysis.priority === "HOT"
                                  ? "botanical-badge-hot"
                                  : lead.analysis.priority === "WARM"
                                  ? "botanical-badge-warm"
                                  : "botanical-badge-cold"
                              }`}
                            >
                              {lead.analysis.priority}
                            </span>
                          )}
                        </div>

                        <div className="font-sans text-xs text-[#697961] truncate mt-1 flex items-center gap-1.5">
                          {highObjection ? (
                            <span className="text-[#895440] flex items-center gap-1 font-medium">
                              <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                              <span className="truncate">Objection: {highObjection.detail}</span>
                            </span>
                          ) : isHighUrgency ? (
                            <span className="text-[#895440] flex items-center gap-1 font-medium">
                              <Clock3 className="w-3.5 h-3.5 shrink-0" />
                              <span>High Urgency · Follow-up {lead.analysis?.follow_up_hours || 24}h</span>
                            </span>
                          ) : (
                            <span>Follow-up window pending</span>
                          )}
                        </div>
                      </div>

                      <ChevronRight className="w-4 h-4 text-[#895440] group-hover:translate-x-0.5 transition-transform shrink-0" />
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {attentionLeads.length > 0 && (
            <div className="mt-4 pt-3 border-t border-[#895440]/20 text-right">
              <Link
                to="/leads"
                className="font-sans text-xs font-semibold text-[#895440] hover:text-[#6f4230] inline-flex items-center gap-1"
              >
                <span>View all in priority queue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>

        {/* Right: Recent Intelligence Stream (Sage panel) */}
        <div className="botanical-sage-panel p-6 rounded-[34px]">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#697961]/25">
            <div className="flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-[#1e382c]" />
              <h3 className="font-serif text-xl font-normal text-[#1e382c]">
                Recent Intelligence Stream
              </h3>
            </div>
            <span className="font-sans text-xs text-[#697961]">Live events</span>
          </div>

          {recentActivities.length === 0 ? (
            <div className="py-10 text-center font-sans text-xs text-[#4a6353]">
              No recent activity. Load demo leads or add a lead to see live updates.
            </div>
          ) : (
            <div className="botanical-timeline space-y-4">
              {recentActivities.map((act) => (
                <div key={act.id} className="relative group">
                  <span className="absolute -left-[24px] top-1.5 w-2 h-2 rounded-full bg-[#1e382c] ring-4 ring-[#e0e5d3]" />
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="font-sans text-xs font-semibold text-[#1e382c]">
                      {act.title}
                    </span>
                    <span className="font-sans text-[11px] text-[#697961] shrink-0">
                      {relativeTime(act.timestamp)}
                    </span>
                  </div>
                  <div className="font-sans text-xs text-[#4a6353] truncate mt-0.5">
                    <span className="font-medium text-[#1e382c]">{act.leadName}</span> — {act.detail}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── 5. Main Lead Table ── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <div>
            <span className="botanical-eyebrow">Priority Queue</span>
            <h2 className="font-serif text-2xl font-normal text-[#1e382c] tracking-tight mt-0.5">
              Prioritized Lead Queue
            </h2>
          </div>
          <span className="font-sans text-xs text-[#697961]">
            Ordered by explainable AI scoring &amp; intent
          </span>
        </div>

        <LeadTable
          leads={leads}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          onLoadDemo={loadDemo}
        />
      </div>
    </div>
  );
}
