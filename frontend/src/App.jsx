import { useCallback, useEffect, useState } from "react";
import { Routes, Route, useParams, useNavigate, Link } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import Dashboard from "./components/Dashboard";
import StatsCards from "./components/StatsCards";
import LeadForm from "./components/LeadForm";
import LeadTable from "./components/LeadTable";
import LeadDetailPanel from "./components/LeadDetailPanel";
import SalesCopilot from "./components/SalesCopilot";
import FollowUpCopilot from "./components/FollowUpCopilot";
import { useLeads } from "./hooks/useLeads";
import { api } from "./services/api";
import { Sparkles, Plus, ArrowLeft } from "lucide-react";

export default function App() {
  const { leads, addLead, retryAnalysis, updateLead, loadDemo, clearAll } = useLeads();
  const [aiConfigured, setAiConfigured] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    api.health().then((h) => setAiConfigured(!!h.ai_configured)).catch(() => setAiConfigured(false));
  }, []);

  const handleUpdateLead = useCallback(
    (id, patch) => updateLead(id, patch),
    [updateLead]
  );

  return (
    <div className="min-h-screen flex bg-[#f5efdf] text-[#1e382c] font-sans selection:bg-[#e0e5d3] selection:text-[#1e382c]">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar
          aiConfigured={aiConfigured}
          onMenuClick={() => setMobileOpen(true)}
          onLoadDemo={leads.length === 0 ? loadDemo : undefined}
        />
        <main className="flex-1 p-4 md:p-6 lg:p-8 space-y-8 max-w-[1400px] w-full mx-auto">
          <Routes>
            <Route path="/" element={<Dashboard leads={leads} loadDemo={loadDemo} clearAll={clearAll} />} />
            <Route path="/leads" element={<LeadsPage leads={leads} loadDemo={loadDemo} clearAll={clearAll} />} />
            <Route
              path="/leads/new"
              element={
                <div className="max-w-3xl mx-auto">
                  <LeadForm onSubmit={addLead} onLoadDemo={loadDemo} />
                </div>
              }
            />
            <Route path="/leads/:id" element={<LeadDetailRoute leads={leads} onRetry={retryAnalysis} />} />
            <Route
              path="/leads/:id/copilot"
              element={<CopilotRoute leads={leads} onUpdateLead={handleUpdateLead} />}
            />
            <Route
              path="/leads/:id/followup"
              element={<FollowUpRoute leads={leads} onUpdateLead={handleUpdateLead} />}
            />
            <Route
              path="*"
              element={
                <div className="botanical-card p-10 text-center max-w-md mx-auto my-12">
                  <h2 className="text-2xl font-serif mb-2 text-[#1e382c]">Page not found</h2>
                  <p className="text-sm text-[#4a6353] mb-6">The requested destination does not exist.</p>
                  <Link to="/" className="botanical-button-primary">Return to Dashboard</Link>
                </div>
              }
            />
          </Routes>
        </main>
      </div>
    </div>
  );
}

function LeadsPage({ leads, loadDemo, clearAll }) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#d4d0bd]">
        <div>
          <span className="botanical-eyebrow">Directory</span>
          <h1 className="text-2xl md:text-3xl font-serif text-[#1e382c] mt-1">
            Buyer Leads Queue
          </h1>
          <p className="text-sm text-[#4a6353] mt-1">
            Full repository of qualified buyers, requirements, urgency, and follow-up timelines.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={loadDemo} className="botanical-button-secondary text-sm">
            <Sparkles className="w-4 h-4 text-[#895440]" />
            <span>Load Demo Leads</span>
          </button>
          <Link to="/leads/new" className="botanical-button-primary text-sm">
            <Plus className="w-4 h-4" />
            <span>Add Lead</span>
          </Link>
        </div>
      </div>

      <StatsCards leads={leads} />
      <LeadTable leads={leads} onLoadDemo={loadDemo} />
    </div>
  );
}

function LeadDetailRoute({ leads, onRetry }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const lead = leads.find((l) => l.id === id);
  if (!lead) {
    return (
      <div className="botanical-card p-8 text-center max-w-md mx-auto my-12 space-y-4">
        <div className="text-lg font-serif text-[#1e382c]">Lead not found</div>
        <p className="text-sm text-[#4a6353]">This record may have been cleared or removed from local storage.</p>
        <button className="botanical-button-secondary inline-flex items-center gap-1.5" onClick={() => navigate("/leads")}>
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Leads Queue</span>
        </button>
      </div>
    );
  }
  return (
    <div className="space-y-4">
      <button
        onClick={() => navigate("/leads")}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-[#4a6353] hover:text-[#1e382c] transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Leads Queue</span>
      </button>
      <LeadDetailPanel lead={lead} onRetry={onRetry} />
    </div>
  );
}

function CopilotRoute({ leads, onUpdateLead }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const lead = leads.find((l) => l.id === id);
  if (!lead) return <div className="botanical-card p-6">Lead not found.</div>;
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-[#d4d0bd]">
        <div>
          <span className="botanical-eyebrow">Interactive AI Agent</span>
          <h1 className="text-2xl font-serif text-[#1e382c] mt-0.5">Sales Copilot · {lead.intake.name}</h1>
        </div>
        <button className="botanical-button-secondary text-sm" onClick={() => navigate(`/leads/${lead.id}`)}>
          Back to Lead Intelligence
        </button>
      </div>
      <SalesCopilot lead={lead} onUpdateLead={(patch) => onUpdateLead(lead.id, patch)} />
    </div>
  );
}

function FollowUpRoute({ leads, onUpdateLead }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const lead = leads.find((l) => l.id === id);
  if (!lead) return <div className="botanical-card p-6">Lead not found.</div>;
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-[#d4d0bd]">
        <div>
          <span className="botanical-eyebrow">Decay-Protected Follow-up</span>
          <h1 className="text-2xl font-serif text-[#1e382c] mt-0.5">Follow-up Copilot · {lead.intake.name}</h1>
        </div>
        <button className="botanical-button-secondary text-sm" onClick={() => navigate(`/leads/${lead.id}`)}>
          Back to Lead Intelligence
        </button>
      </div>
      <FollowUpCopilot lead={lead} onUpdateLead={(patch) => onUpdateLead(lead.id, patch)} />
    </div>
  );
}
