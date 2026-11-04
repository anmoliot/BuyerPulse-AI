export function relativeTime(iso) {
  if (!iso) return "—";
  const diff = Date.now() - new Date(iso).getTime();
  const s = Math.floor(diff / 1000);
  if (s < 60) return "just now";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

export function isDue(iso) {
  if (!iso) return false;
  return new Date(iso).getTime() <= Date.now();
}

export function plusHours(h) {
  return new Date(Date.now() + h * 3600 * 1000).toISOString();
}

export function shortId() {
  return "id-" + Math.random().toString(36).slice(2, 10) + "-" + Date.now().toString(36);
}
