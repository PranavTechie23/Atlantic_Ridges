"use client";

/** Placeholder while priority changes load — removed from DOM when data is ready. */
export function PrioritySignalsSkeleton() {
  return (
    <div className="space-y-3" aria-busy="true" aria-label="Loading priority signals">
      <div className="dashboard-card rounded-xl p-5 sm:p-6 space-y-4 overflow-hidden">
        <div className="flex gap-2">
          <div className="h-5 w-16 rounded-md bg-surface-secondary dark:bg-white/5" />
          <div className="h-5 w-24 rounded-md bg-surface-secondary dark:bg-white/5" />
        </div>
        <div className="h-6 w-3/4 max-w-md rounded-md bg-surface-secondary dark:bg-white/5" />
        <div className="h-4 w-full rounded-md bg-surface-secondary dark:bg-white/5" />
        <div className="grid sm:grid-cols-2 gap-3 pt-2">
          <div className="h-20 rounded-xl bg-surface-secondary dark:bg-black/20 border border-app" />
          <div className="h-20 rounded-xl bg-surface-secondary dark:bg-black/20 border border-app" />
        </div>
        <div className="flex justify-between pt-2 border-t border-app">
          <div className="h-4 w-28 rounded bg-surface-secondary dark:bg-white/5" />
          <div className="h-9 w-32 rounded-lg bg-blue-500/20" />
        </div>
      </div>
    </div>
  );
}
