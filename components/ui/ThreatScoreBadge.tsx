import React from "react";
import { cn } from "../../lib/utils";
import { SeverityLevel } from "../../lib/types";

export function ThreatScoreBadge({
  score,
  size = "md",
  showLabel = true,
}: {
  score: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}) {
  const getLevel = (s: number): { label: SeverityLevel; color: string; border: string; bg: string } => {
    if (s >= 90) return { label: "CRITICAL", color: "text-red-400", border: "border-red-500/30", bg: "bg-red-500/10" };
    if (s >= 80) return { label: "HIGH", color: "text-amber-400", border: "border-amber-500/30", bg: "bg-amber-500/10" };
    if (s >= 65) return { label: "MEDIUM", color: "text-blue-400", border: "border-blue-500/30", bg: "bg-blue-500/10" };
    return { label: "LOW", color: "text-zinc-400", border: "border-zinc-500/30", bg: "bg-zinc-500/10" };
  };

  const level = getLevel(score);

  if (size === "sm") {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 px-2 py-0.5 rounded font-mono text-xs font-semibold border",
          level.bg,
          level.border,
          level.color
        )}
      >
        <span>{score}</span>
        <span className="text-[10px] text-zinc-500 font-sans">/100</span>
      </span>
    );
  }

  if (size === "lg") {
    return (
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "flex items-baseline gap-1 px-3 py-1.5 rounded-lg border font-mono",
            level.bg,
            level.border,
            level.color
          )}
        >
          <span className="text-2xl font-bold tracking-tight">{score}</span>
          <span className="text-xs text-zinc-500 font-sans">/ 100</span>
        </div>
        {showLabel && (
          <span
            className={cn(
              "px-2 py-0.5 rounded text-xs font-semibold tracking-wider uppercase border",
              level.bg,
              level.border,
              level.color
            )}
          >
            {level.label}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-2">
      <span
        className={cn(
          "inline-flex items-baseline gap-0.5 px-2 py-1 rounded font-mono text-sm font-bold border",
          level.bg,
          level.border,
          level.color
        )}
      >
        <span>{score}</span>
        <span className="text-[10px] text-zinc-500 font-sans">/100</span>
      </span>
      {showLabel && (
        <span className={cn("text-[11px] font-medium tracking-wider uppercase", level.color)}>
          {level.label}
        </span>
      )}
    </div>
  );
}
