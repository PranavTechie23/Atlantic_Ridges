import React from "react";
import { cn } from "../../lib/utils";
import { formatEvidenceState } from "../../lib/utils/evidence-display";

export function EvidenceStateText({
  content,
  variant,
  className,
}: {
  content: string;
  variant: "before" | "after";
  className?: string;
}) {
  const text = formatEvidenceState(content);

  return (
    <div
      className={cn(
        "text-[11px] sm:text-xs leading-relaxed whitespace-pre-wrap font-sans rounded-md px-2.5 py-2",
        variant === "before" ? "diff-removed" : "diff-added",
        variant === "after" && "font-medium",
        className
      )}
    >
      {text}
    </div>
  );
}
