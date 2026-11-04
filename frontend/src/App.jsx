import { useCallback, useEffect, useState } from "react";
import { Routes, Route, useParams, useNavigate, Link } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import StatsCards from "./components/StatsCards";
import LeadForm from "./components/LeadForm";
import LeadTable from "./components/LeadTable";
import LeadDetailPanel from "./components/LeadDetailPanel";
import SalesCopilot from "./components/SalesCopilot";
import FollowUpCopilot from "./components/FollowUpCopilot";
import { useLeads } from "./hooks/useLeads";
import { api } from "./services/api";

export default function App() {
  const { leads, addLead, retryAnalysis, updateLead, loadDemo, clearAll } = useLeads();
  const [aiConfigured, setAiConfigured] = useState(null);

  useEffect(() => {
    api.health().then((h) => setAiConfigured(!!h.ai_configured)).catch(() => setAiConfigured(false));
  }, []);

  const handleUpdateLead = useCallback(
    (id, patch) => updateLead(id, patch),
    [updateLead]
  );

  return (
    <div className="min-h-screen flex bg-ink-900 text-slate-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Topbar aiConfigured={aiConfigured} />
        <main className="p-4 md:p-6 space-y-6 max-w-[1400px] w-full mx-auto">
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
            <Route path="*" element={<div className="card p-6">Page not found.</div>} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

function Dashboard({ leads, loadDemo, clearAll }) {
  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex gap-2">
          <button className="btn-ghost" onClick={clearAll}>Clear leads</button>
          <button className="btn-primary" onClick={loadDemo}>Load demo leads</button>
        </div>
      </header>
      <StatsCards leads={leads} />
      <LeadTable leads={leads} />
    </div>
  );
}

function LeadsPage({ leads, loadDemo, clearAll }) {
  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Leads</h1>
        <div className="flex gap-2">
          <Link to="/leads/new" className="btn-ghost">Add lead</Link>
          <button className="btn-ghost" onClick={clearAll}>Clear</button>
          <button className="btn-primary" onClick={loadDemo}>Load demo leads</button>
        </div>
      </header>
      <StatsCards leads={leads} />
      <LeadTable leads={leads} />
    </div>
  );
}

function LeadDetailRoute({ leads, onRetry }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const lead = leads.find((l) => l.id === id);
  if (!lead) return <div className="card p-6">Lead not found. <button className="btn-ghost ml-2" onClick={() => navigate("/leads")}>Back</button></div>;
  return (
    <div className="space-y-4">
      <button onClick={() => navigate("/leads")} className="text-sm text-slate-400 hover:text-slate-200">← Back to leads</button>
      <LeadDetailPanel lead={lead} onRetry={onRetry} />
    </div>
  );
}

function CopilotRoute({ leads, onUpdateLead }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const lead = leads.find((l) => l.id === id);
  if (!lead) return <div className="card p-6">Lead not found.</div>;
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Sales Copilot · {lead.intake.name}</h1>
        <button className="btn-ghost" onClick={() => navigate(`/leads/${lead.id}`)}>Back to lead</button>
      </div>
      <SalesCopilot lead={lead} onUpdateLead={(patch) => onUpdateLead(lead.id, patch)} />
    </div>
  );
}

function FollowUpRoute({ leads, onUpdateLead }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const lead = leads.find((l) => l.id === id);
  if (!lead) return <div className="card p-6">Lead not found.</div>;
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Follow-up · {lead.intake.name}</h1>
        <button className="btn-ghost" onClick={() => navigate(`/leads/${lead.id}`)}>Back to lead</button>
      </div>
      <FollowUpCopilot lead={lead} onUpdateLead={(patch) => onUpdateLead(lead.id, patch)} />
    </div>
  );
}
