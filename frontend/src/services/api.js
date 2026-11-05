import axios from "axios";

const rawBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
const BASE = rawBase.replace(/\/+$/, "");
const client = axios.create({ baseURL: BASE, timeout: 65000 });

function unwrap(p) {
  return p
    .then((r) => r.data)
    .catch((err) => {
      let detail = err?.response?.data?.detail;
      if (!detail) {
        if (err.message === "Network Error") {
          detail = "Network error: Unable to reach AI service. The server may be waking up from sleep or blocked by CORS. Please retry in a few seconds.";
        } else if (err.code === "ECONNABORTED" || err.message?.includes("timeout")) {
          detail = "AI service request timed out. If the backend is on a free tier, it may be waking up; please retry.";
        } else {
          detail = err.message || "Request failed";
        }
      }
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
