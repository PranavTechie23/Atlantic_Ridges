"use client";

import React, { useLayoutEffect, useRef, useState } from "react";
import { cn } from "../../lib/utils";

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  className,
  size = "sm",
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  className?: string;
  size?: "sm" | "md";
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [indicator, setIndicator] = useState({ left: 0, width: 0, ready: false });

  useLayoutEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const active = track.querySelector<HTMLElement>(`[data-segment-active="true"]`);
    if (!active) return;
    const t = track.getBoundingClientRect();
    const a = active.getBoundingClientRect();
    setIndicator({ left: a.left - t.left, width: a.width, ready: true });
  }, [value, options.length]);

  return (
    <div
      ref={trackRef}
      className={cn(
        "auth-tab-track relative inline-flex p-0.5 rounded-lg",
        size === "md" && "p-1 rounded-xl",
        className
      )}
      role="tablist"
    >
      <span
        className={cn(
          "auth-tab-slider absolute top-0.5 bottom-0.5 rounded-md transition-[left,width] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
          size === "md" && "top-1 bottom-1 rounded-lg",
          !indicator.ready && "opacity-0"
        )}
        style={{ left: indicator.left, width: indicator.width }}
        aria-hidden
      />
      {options.map((opt) => {
        const active = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            role="tab"
            aria-selected={active}
            data-segment-active={active ? "true" : "false"}
            onClick={() => onChange(opt.value)}
            className={cn(
              "relative z-10 font-mono font-semibold transition-colors duration-200",
              size === "sm" ? "px-3 py-1 text-xs rounded-md" : "px-4 py-2 text-sm rounded-lg",
              active ? "text-app-primary" : "text-app-muted hover:text-app-secondary"
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
