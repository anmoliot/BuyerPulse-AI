import axios from "axios";

const BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
const client = axios.create({ baseURL: BASE, timeout: 40000 });

function unwrap(p) {
  return p.then((r) => r.data).catch((err) => {
    const detail = err?.response?.data?.detail || err.message || "Request failed";
    throw new Error(detail);
  });
}

export const api = {
  health: () => unwrap(client.get("/api/health")),
  demoLeads: () => unwrap(client.get("/api/leads/demo")),
  analyzeLead: (intake) => unwrap(client.post("/api/leads/analyze", intake)),
  chat: (payload) => unwrap(client.post("/api/copilot/chat", payload)),
  followup: (payload) => unwrap(client.post("/api/copilot/followup", payload)),
};
