export const PRIORITY_COLORS = {
  HOT: "bg-red-500/15 text-red-300 border border-red-500/30",
  WARM: "bg-amber-500/15 text-amber-300 border border-amber-500/30",
  COLD: "bg-sky-500/15 text-sky-300 border border-sky-500/30",
};

export const SEVERITY_COLORS = {
  HIGH: "bg-red-500/15 text-red-300 border border-red-500/30",
  MEDIUM: "bg-amber-500/15 text-amber-300 border border-amber-500/30",
  LOW: "bg-sky-500/15 text-sky-300 border border-sky-500/30",
};

export function priorityFromScore(score) {
  if (score >= 75) return "HOT";
  if (score >= 40) return "WARM";
  return "COLD";
}

export function urgencyRank(u) {
  return { HIGH: 3, MEDIUM: 2, LOW: 1 }[u] || 0;
}

export function priorityRank(p) {
  return { HOT: 3, WARM: 2, COLD: 1 }[p] || 0;
}
