"use client";

import Link from "next/link";
import { Sparkles, X } from "lucide-react";
import { useApp } from "../../lib/context/AppContext";
import { useEffect, useState } from "react";

const DISMISS_KEY = "prysm-guest-banner-dismissed";

export function GuestModeBanner() {
  const { user } = useApp();
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    try {
      setDismissed(sessionStorage.getItem(DISMISS_KEY) === "1");
    } catch {
      setDismissed(false);
    }
  }, []);

  if (dismissed || !user || user.id !== "guest") return null;

  return (
    <div className="mb-6 flex flex-col sm:flex-row sm:items-center gap-3 rounded-xl border border-amber-500/25 bg-amber-500/10 dark:bg-amber-500/8 px-4 py-3 text-sm">
      <div className="flex items-start gap-2 flex-1 min-w-0">
        <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
        <p className="text-app-secondary">
          <span className="font-semibold text-app-primary">Demo workspace</span> — sample intelligence data.
          Create an account to save preferences, or keep exploring the platform demo.
        </p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <Link
          href="/signup"
          className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors"
        >
          Create account
        </Link>
        <button
          type="button"
          onClick={() => {
            setDismissed(true);
            try {
              sessionStorage.setItem(DISMISS_KEY, "1");
            } catch {
              /* ignore */
            }
          }}
          className="p-1.5 rounded-lg text-app-muted hover:text-app-primary hover:bg-surface-secondary"
          aria-label="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
