"use client";

import React from "react";

interface LivePulseIndicatorProps {
  status?: "active" | "alert" | "idle" | "verifying";
  label?: string;
  sublabel?: string;
}

export function LivePulseIndicator({
  status = "active",
  label = "Surveillance Active",
  sublabel = "2.0s Heartbeat",
}: LivePulseIndicatorProps) {
  const colorMap = {
    active: {
      ping: "bg-emerald-400",
      dot: "bg-emerald-500",
      border: "border-emerald-500/25 dark:border-emerald-500/20",
      bg: "bg-emerald-500/10 dark:bg-emerald-500/8",
      text: "text-emerald-600 dark:text-emerald-400",
    },
    alert: {
      ping: "bg-red-400",
      dot: "bg-red-500",
      border: "border-red-500/25",
      bg: "bg-red-500/10",
      text: "text-red-500 dark:text-red-400",
    },
    verifying: {
      ping: "bg-blue-400",
      dot: "bg-blue-500",
      border: "border-blue-500/25",
      bg: "bg-blue-500/10",
      text: "text-blue-600 dark:text-blue-400",
    },
    idle: {
      ping: "bg-zinc-400",
      dot: "bg-zinc-500",
      border: "border-app",
      bg: "bg-surface-secondary",
      text: "text-app-muted",
    },
  };

  const c = colorMap[status];

  return (
    <div
      className={`pulse-soft inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full border ${c.border} ${c.bg} backdrop-blur-sm transition-all`}
    >
      <span className="relative flex h-2 w-2">
        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${c.ping} opacity-60`} />
        <span className={`relative inline-flex rounded-full h-2 w-2 ${c.dot}`} />
      </span>
      <div className="flex items-center gap-1.5 text-xs leading-none">
        <span className={`font-semibold ${c.text}`}>{label}</span>
        {sublabel && (
          <>
            <span className="text-app-muted hidden sm:inline">·</span>
            <span className="text-app-muted text-[10px] hidden sm:inline">{sublabel}</span>
          </>
        )}
      </div>
    </div>
  );
}
