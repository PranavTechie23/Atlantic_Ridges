export interface AppPageEntry {
  href: string;
  label: string;
  keywords: string[];
  group: "command" | "intelligence" | "showcase" | "tools";
}

export const APP_PAGES: AppPageEntry[] = [
  { href: "/dashboard", label: "Command Center", keywords: ["overview", "home", "kpi"], group: "command" },
  { href: "/audit", label: "System Audit & Compliance", keywords: ["audit", "compliance", "verification", "matrix"], group: "showcase" },
  { href: "/demo", label: "Interactive Demo Sandbox", keywords: ["simulate", "inject", "demo", "sandbox"], group: "showcase" },
  { href: "/topology", label: "Market Topology", keywords: ["constellation", "graph", "map"], group: "showcase" },
  { href: "/war-room", label: "War Room", keywords: ["scenario", "simulator"], group: "showcase" },
  { href: "/time-machine", label: "Time Machine", keywords: ["history", "replay"], group: "showcase" },
  { href: "/competitors", label: "Competitors", keywords: ["acme", "directory"], group: "intelligence" },
  { href: "/radar", label: "Change Radar", keywords: ["scatter", "impact"], group: "intelligence" },
  { href: "/timeline", label: "Timeline", keywords: ["history", "chronological"], group: "intelligence" },
  { href: "/comparison", label: "Comparison Matrix", keywords: ["heatmap", "vectors"], group: "intelligence" },
  { href: "/evidence", label: "Evidence Explorer", keywords: ["sha256", "verified"], group: "intelligence" },
  { href: "/reports", label: "Executive Reports", keywords: ["brief", "weekly"], group: "intelligence" },
  { href: "/reports/rep-weekly-20261023", label: "Weekly Brief (Oct 23)", keywords: ["citations", "acme"], group: "intelligence" },
  { href: "/diff-engine", label: "Diff Engine", keywords: ["noise", "normalize"], group: "tools" },
  { href: "/sources", label: "Public Sources", keywords: ["wayback", "crawl"], group: "tools" },
  { href: "/alerts", label: "Alert Rules", keywords: ["threshold", "notify"], group: "tools" },
  { href: "/settings", label: "Settings", keywords: ["account", "theme"], group: "tools" },
  { href: "/docs", label: "Technical Docs", keywords: ["architecture", "api"], group: "tools" },
];

export function searchAppPages(query: string, limit = 6): AppPageEntry[] {
  const q = query.toLowerCase().trim();
  if (!q) return APP_PAGES.slice(0, 8);
  return APP_PAGES.filter(
    (p) =>
      p.label.toLowerCase().includes(q) ||
      p.href.toLowerCase().includes(q) ||
      p.keywords.some((k) => k.includes(q) || q.includes(k))
  ).slice(0, limit);
}
