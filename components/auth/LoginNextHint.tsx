"use client";

import { useSearchParams } from "next/navigation";
import { DEFAULT_APP_HOME, peekRedirect } from "../../lib/auth/routes";
import { Lock } from "lucide-react";

const LABELS: Record<string, string> = {
  "/dashboard": "Command Center",
  "/demo": "Demo Sandbox",
  "/competitors": "Competitors",
  "/radar": "Change Radar",
  "/reports": "Reports",
  "/evidence": "Evidence Explorer",
};

function labelFor(path: string) {
  if (LABELS[path]) return LABELS[path];
  if (path.startsWith("/reports/")) return "Executive Brief";
  if (path.startsWith("/competitors/")) return "Competitor Profile";
  return "this page";
}

export function LoginNextHint() {
  const searchParams = useSearchParams();
  const raw = searchParams.get("next");
  if (!raw) return null;

  const next = peekRedirect(raw) || (raw === "/dashboard" ? DEFAULT_APP_HOME : "");
  if (!next) return null;

  const displayPath = next;

  return (
    <div className="auth-hint-enter mb-5 flex items-start gap-2 rounded-xl border border-blue-500/25 bg-blue-500/10 px-3 py-2.5 text-xs text-app-secondary">
      <Lock className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
      <span>
        Sign in to continue to{" "}
        <strong className="text-app-primary">{labelFor(displayPath)}</strong>
      </span>
    </div>
  );
}
