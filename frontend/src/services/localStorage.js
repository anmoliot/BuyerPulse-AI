const KEY = "buyerpulse.leads.v1";

export function loadLeads() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveLeads(leads) {
  try {
    localStorage.setItem(KEY, JSON.stringify(leads));
  } catch {
    /* quota or corruption — non-fatal */
  }
}

export function resetLeads() {
  localStorage.removeItem(KEY);
}
