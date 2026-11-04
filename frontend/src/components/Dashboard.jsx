import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Sparkles,
  Plus,
  Flame,
  TrendingUp,
  Clock,
  AlertTriangle,
  ChevronRight,
  Trash2,
  ArrowRight,
  ShieldAlert,
  Clock3,
  CalendarCheck,
  CheckCircle2,
} from "lucide-react";
import StatsCards from "./StatsCards";
import LeadTable from "./LeadTable";
import { relativeTime } from "../utils/format";
import { PRIORITY_COLORS } from "../utils/priority";

export default function Dashboard({ leads = [], loadDemo, clearAll }) {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("ALL");

  // Priority calculations
  const total = leads.length;
  const hotCount = leads.filter((l) => l.analysis?.priority === "HOT").length;
  const warmCount = leads.filter((l) => l.analysis?.priority === "WARM").length;
  const coldCount = leads.filter((l) => l.analysis?.priority === "COLD").length;

  const hotPct = total > 0 ? Math.round((hotCount / total) * 100) : 0;
  const warmPct = total > 0 ? Math.round((warmCount / total) * 100) : 0;
  const coldPct = total > 0 ? Math.max(0, 100 - hotPct - warmPct) : 0;

  // Leads needing attention: Urgent, high objections, or due follow-ups
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

  // Recent activity stream from lead creation and analysis
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
          timestamp: l.created_at, // sequential representation
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
    <div className="space-y-6">
      {/* 1. Hero / Command Center Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-white/[0.06]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-100">
              Lead Command Center
            </h1>
            <span className="text-[11px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
              Live Pipeline
            </span>
          </div>
          <p className="text-xs md:text-sm text-slate-400">
            Real-time AI buyer qualification, objection radar, and automated follow-up urgency.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          {leads.length > 0 && (
            <button
              onClick={clearAll}
              className="btn-ghost !px-2.5 text-xs text-slate-400 hover:text-red-400"
              title="Clear all local leads"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}

          <button onClick={loadDemo} className="btn-secondary text-xs md:text-sm">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>Load Demo Leads</span>
          </button>

          <Link to="/leads/new" className="btn-primary text-xs md:text-sm">
            <Plus className="w-4 h-4" />
            <span>Add Lead</span>
          </Link>
        </div>
      </div>

      {/* 2. KPI Cards Row */}
      <StatsCards leads={leads} />

      {/* 3. Priority Distribution Bar */}
      <div className="card p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div>
            <div className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <span>Priority Distribution</span>
              <span className="text-xs text-slate-500 font-normal">
                (Click segment to filter table below)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <button
              onClick={() => setActiveFilter(activeFilter === "HOT" ? "ALL" : "HOT")}
              className={`flex items-center gap-1.5 transition-opacity ${
                activeFilter !== "ALL" && activeFilter !== "HOT" ? "opacity-40" : "opacity-100"
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
              <span className="text-slate-300 font-medium">HOT ({hotCount})</span>
              <span className="text-slate-500 font-mono text-[11px]">{hotPct}%</span>
            </button>

            <button
              onClick={() => setActiveFilter(activeFilter === "WARM" ? "ALL" : "WARM")}
              className={`flex items-center gap-1.5 transition-opacity ${
                activeFilter !== "ALL" && activeFilter !== "WARM" ? "opacity-40" : "opacity-100"
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span className="text-slate-300 font-medium">WARM ({warmCount})</span>
              <span className="text-slate-500 font-mono text-[11px]">{warmPct}%</span>
            </button>

            <button
              onClick={() => setActiveFilter(activeFilter === "COLD" ? "ALL" : "COLD")}
              className={`flex items-center gap-1.5 transition-opacity ${
                activeFilter !== "ALL" && activeFilter !== "COLD" ? "opacity-40" : "opacity-100"
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-slate-500" />
              <span className="text-slate-300 font-medium">COLD ({coldCount})</span>
              <span className="text-slate-500 font-mono text-[11px]">{coldPct}%</span>
            </button>
          </div>
        </div>

        {/* Segmented Bar */}
        <div className="h-3 w-full bg-surface-950 rounded-full overflow-hidden flex p-0.5 border border-white/[0.06]">
          {total === 0 ? (
            <div className="w-full h-full bg-white/[0.05] rounded-full" />
          ) : (
            <>
              {hotPct > 0 && (
                <div
                  style={{ width: `${hotPct}%` }}
                  onClick={() => setActiveFilter(activeFilter === "HOT" ? "ALL" : "HOT")}
                  className="h-full bg-gradient-to-r from-red-600 to-rose-500 rounded-l-full cursor-pointer hover:brightness-110 transition-all"
                  title={`HOT: ${hotCount} (${hotPct}%)`}
                />
              )}
              {warmPct > 0 && (
                <div
                  style={{ width: `${warmPct}%` }}
                  onClick={() => setActiveFilter(activeFilter === "WARM" ? "ALL" : "WARM")}
                  className="h-full bg-gradient-to-r from-amber-500 to-amber-400 cursor-pointer hover:brightness-110 transition-all"
                  title={`WARM: ${warmCount} (${warmPct}%)`}
                />
              )}
              {coldPct > 0 && (
                <div
                  style={{ width: `${coldPct}%` }}
                  onClick={() => setActiveFilter(activeFilter === "COLD" ? "ALL" : "COLD")}
                  className="h-full bg-slate-600 rounded-r-full cursor-pointer hover:brightness-110 transition-all"
                  title={`COLD: ${coldCount} (${coldPct}%)`}
                />
              )}
            </>
          )}
        </div>
      </div>

      {/* 4. Leads Needing Attention & Recent Activity (Side-by-Side on Desktop) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Left: Leads Needing Attention */}
        <div className="card p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 pb-3 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-semibold text-slate-100">
                  Leads Needing Attention
                </h3>
              </div>
              <span className="text-[11px] font-mono text-slate-400">
                {attentionLeads.length} flagged
              </span>
            </div>

            {attentionLeads.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-500">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto mb-2 opacity-60" />
                No urgent bottlenecks. All leads have fresh outreach schedules.
              </div>
            ) : (
              <div className="space-y-2.5">
                {attentionLeads.map((lead) => {
                  const highObjection = lead.analysis?.objections?.find((o) => o.severity === "HIGH");
                  const isHighUrgency = lead.analysis?.urgency === "HIGH";

                  return (
                    <div
                      key={lead.id}
                      onClick={() => navigate(`/leads/${lead.id}`)}
                      className="group p-3 rounded-lg bg-surface-900/60 border border-white/[0.06] hover:border-white/[0.14] hover:bg-surface-800/80 cursor-pointer transition-all flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-xs text-slate-200 group-hover:text-indigo-400 transition-colors truncate">
                            {lead.intake?.name}
                          </span>
                          {lead.analysis && (
                            <span className={`badge !py-0 !px-1.5 text-[10px] ${PRIORITY_COLORS[lead.analysis.priority]}`}>
                              {lead.analysis.priority}
                            </span>
                          )}
                        </div>

                        <div className="text-[11px] text-slate-400 truncate mt-1 flex items-center gap-1.5">
                          {highObjection ? (
                            <span className="text-rose-400 flex items-center gap-1">
                              <ShieldAlert className="w-3 h-3 shrink-0" />
                              <span className="truncate">Objection: {highObjection.detail}</span>
                            </span>
                          ) : isHighUrgency ? (
                            <span className="text-amber-400 flex items-center gap-1">
                              <Clock3 className="w-3 h-3 shrink-0" />
                              <span>High Urgency · Follow-up {lead.analysis?.follow_up_hours || 24}h</span>
                            </span>
                          ) : (
                            <span>Follow-up window pending</span>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/leads/${lead.id}`);
                        }}
                        className="btn-ghost !p-1.5 text-xs text-slate-400 group-hover:text-indigo-400 shrink-0"
                        title="Open lead intelligence"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {attentionLeads.length > 0 && (
            <div className="mt-3 pt-3 border-t border-white/[0.04] text-right">
              <Link
                to="/leads"
                className="text-xs text-indigo-400 hover:text-indigo-300 inline-flex items-center gap-1 font-medium"
              >
                <span>View all in priority queue</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          )}
        </div>

        {/* Right: Recent Activity Stream */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-3 pb-3 border-b border-white/[0.06]">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-semibold text-slate-100">
                Recent Intelligence Stream
              </h3>
            </div>
            <span className="text-[11px] font-mono text-slate-400">Live events</span>
          </div>

          {recentActivities.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500">
              No recent activity. Load demo leads or add a lead to see live updates.
            </div>
          ) : (
            <div className="space-y-3.5 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-[1px] before:bg-white/[0.08]">
              {recentActivities.map((act) => (
                <div key={act.id} className="relative pl-7 group">
                  <span className="absolute left-2 top-1.5 -translate-x-1/2 w-2 h-2 rounded-full bg-indigo-500 ring-4 ring-surface-850" />
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="text-xs font-semibold text-slate-200 group-hover:text-indigo-300 transition-colors">
                      {act.title}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono shrink-0">
                      {relativeTime(act.timestamp)}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 truncate mt-0.5">
                    <span className="text-slate-300 font-medium">{act.leadName}</span> — {act.detail}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 5. Main Lead Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-base font-semibold text-slate-100 tracking-tight">
            Prioritized Lead Queue
          </h2>
          <span className="text-xs text-slate-400">
            Ordered by explainable AI scoring & intent
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
