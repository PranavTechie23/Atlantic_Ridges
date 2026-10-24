import React from "react";
import { cn } from "../../lib/utils";
import { SeverityLevel, ChangeCategory } from "../../lib/types";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "outline" | "severity" | "category" | "status";
  severity?: SeverityLevel;
  category?: ChangeCategory;
  children: React.ReactNode;
}

export function SeverityBadge({
  severity,
  className,
}: {
  severity: SeverityLevel;
  className?: string;
}) {
  const styles = {
    CRITICAL: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/30",
    HIGH: "bg-amber-500/10 text-amber-800 dark:text-amber-400 border-amber-500/30",
    MEDIUM: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/30",
    LOW: "bg-slate-500/10 text-slate-600 dark:text-zinc-400 border-slate-500/25 dark:border-zinc-500/30",
  }[severity];

  const dot = {
    CRITICAL: "bg-red-500 dark:bg-red-400",
    HIGH: "bg-amber-500 dark:bg-amber-400",
    MEDIUM: "bg-blue-500 dark:bg-blue-400",
    LOW: "bg-slate-500 dark:bg-zinc-400",
  }[severity];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium border tracking-wider uppercase",
        styles,
        className
      )}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full animate-pulse", dot)} />
      {severity}
    </span>
  );
}

export function CategoryBadge({
  category,
  className,
}: {
  category: ChangeCategory;
  className?: string;
}) {
  const labels: Record<ChangeCategory, string> = {
    pricing: "Pricing",
    features: "Features",
    launch: "Product Launch",
    positioning: "Positioning",
    announcements: "Announcement",
  };

  const colors: Record<ChangeCategory, string> = {
    pricing: "bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border-emerald-500/25 dark:border-emerald-500/20",
    features: "bg-indigo-500/10 text-indigo-800 dark:text-indigo-300 border-indigo-500/25 dark:border-indigo-500/20",
    launch: "bg-violet-500/10 text-violet-800 dark:text-violet-300 border-violet-500/25 dark:border-violet-500/20",
    positioning: "bg-sky-500/10 text-sky-800 dark:text-sky-300 border-sky-500/25 dark:border-sky-500/20",
    announcements: "bg-amber-500/10 text-amber-800 dark:text-amber-300 border-amber-500/25 dark:border-amber-500/20",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border tracking-wide",
        colors[category] || "bg-zinc-800 text-zinc-300 border-zinc-700",
        className
      )}
    >
      {labels[category] || category}
    </span>
  );
}

export function StatusBadge({
  status,
  className,
}: {
  status: "active" | "verified" | "pending" | "paused" | "flagged";
  className?: string;
}) {
  const styles = {
    active: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30",
    verified: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/30",
    pending: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30",
    paused: "bg-slate-500/10 text-slate-600 dark:text-zinc-400 border-slate-500/25 dark:border-zinc-500/30",
    flagged: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/30",
  }[status];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border uppercase tracking-wider",
        styles,
        className
      )}
    >
      {status === "verified" && (
        <svg className="w-3 h-3 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
        </svg>
      )}
      {status === "active" && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
      {status}
    </span>
  );
}
