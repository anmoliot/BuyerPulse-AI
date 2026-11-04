import { useEffect, useState, useCallback } from "react";
import { loadLeads, saveLeads, resetLeads } from "../services/localStorage";
import { api } from "../services/api";
import { shortId, plusHours } from "../utils/format";

export function useLeads() {
  const [leads, setLeads] = useState([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setLeads(loadLeads());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveLeads(leads);
  }, [leads, hydrated]);

  const upsert = useCallback((lead) => {
    setLeads((prev) => {
      const idx = prev.findIndex((l) => l.id === lead.id);
      if (idx === -1) return [lead, ...prev];
      const copy = [...prev];
      copy[idx] = lead;
      return copy;
    });
  }, []);

  const remove = useCallback((id) => {
    setLeads((prev) => prev.filter((l) => l.id !== id));
  }, []);

  const addLead = useCallback(
    async (intake) => {
      const lead = {
        id: shortId(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        status: "NEW",
        follow_up_status: "PENDING",
        follow_up_due_at: plusHours(24),
        intake,
        analysis: null,
        chat_history: [],
        follow_up: null,
        analysis_error: null,
      };
      upsert(lead);
      try {
        const analysis = await api.analyzeLead(intake);
        const updated = {
          ...lead,
          analysis,
          follow_up_due_at: plusHours(analysis.follow_up_hours),
          updated_at: new Date().toISOString(),
        };
        upsert(updated);
        return updated;
      } catch (err) {
        const failed = { ...lead, analysis_error: err.message };
        upsert(failed);
        return failed;
      }
    },
    [upsert]
  );

  const retryAnalysis = useCallback(
    async (id) => {
      const lead = leads.find((l) => l.id === id);
      if (!lead) return;
      try {
        const analysis = await api.analyzeLead(lead.intake);
        upsert({
          ...lead,
          analysis,
          analysis_error: null,
          follow_up_due_at: plusHours(analysis.follow_up_hours),
          updated_at: new Date().toISOString(),
        });
      } catch (err) {
        upsert({ ...lead, analysis_error: err.message });
      }
    },
    [leads, upsert]
  );

  const updateLead = useCallback(
    (id, patch) => {
      setLeads((prev) =>
        prev.map((l) => (l.id === id ? { ...l, ...patch, updated_at: new Date().toISOString() } : l))
      );
    },
    []
  );

  const loadDemo = useCallback(async () => {
    const demo = await api.demoLeads();
    const results = await Promise.all(
      demo.map(async (intake) => {
        const lead = {
          id: shortId(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          status: "NEW",
          follow_up_status: "PENDING",
          follow_up_due_at: plusHours(24),
          intake,
          analysis: null,
          chat_history: [],
          follow_up: null,
          analysis_error: null,
        };
        try {
          const analysis = await api.analyzeLead(intake);
          return { ...lead, analysis, follow_up_due_at: plusHours(analysis.follow_up_hours) };
        } catch (err) {
          return { ...lead, analysis_error: err.message };
        }
      })
    );
    setLeads((prev) => [...results, ...prev]);
  }, []);

  const clearAll = useCallback(() => {
    resetLeads();
    setLeads([]);
  }, []);

  return { leads, hydrated, addLead, retryAnalysis, updateLead, loadDemo, remove, clearAll };
}
