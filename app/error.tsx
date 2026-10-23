"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, LayoutDashboard, RefreshCw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-dvh flex items-center justify-center bg-app p-6 page-enter">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-500/15 border border-amber-500/30">
          <AlertTriangle className="w-8 h-8 text-amber-600 dark:text-amber-400" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-app-primary">Intelligence pipeline interrupted</h1>
          <p className="text-sm text-app-secondary leading-relaxed">
            Something failed while rendering this view. You can retry or return to the command center.
          </p>
          {error.digest && (
            <p className="text-[10px] font-mono text-app-muted">Ref: {error.digest}</p>
          )}
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl btn-cta-primary text-white text-sm font-semibold"
          >
            <RefreshCw className="w-4 h-4" />
            Try again
          </button>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-app text-sm font-medium text-app-secondary hover:text-app-primary hover:bg-surface-secondary transition-colors"
          >
            <LayoutDashboard className="w-4 h-4" />
            Command Center
          </Link>
        </div>
      </div>
    </div>
  );
}
