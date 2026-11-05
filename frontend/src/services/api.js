import axios from "axios";

// If VITE_API_BASE_URL is explicitly configured, use it.
// In development (localhost), default to http://localhost:8000.
// In production on Vercel, default to "" (same-origin relative /api/*).
const rawBase =
  typeof import.meta.env.VITE_API_BASE_URL === "string" && import.meta.env.VITE_API_BASE_URL.trim() !== ""
    ? import.meta.env.VITE_API_BASE_URL
    : import.meta.env.DEV
    ? "http://localhost:8000"
    : "";

const BASE = rawBase.replace(/\/+$/, "");
const client = axios.create({ baseURL: BASE, timeout: 65000 });

function unwrap(p) {
  return p
    .then((r) => r.data)
    .catch((err) => {
      let detail = err?.response?.data?.detail;
      if (!detail) {
        if (err.message === "Network Error") {
          detail = "Network error: Unable to reach AI service. Please verify server connection.";
        } else if (err.code === "ECONNABORTED" || err.message?.includes("timeout")) {
          detail = "AI service request timed out. Please retry.";
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
