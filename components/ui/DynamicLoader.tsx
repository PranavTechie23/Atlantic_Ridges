"use client";

import React, { useState, useEffect, useRef } from "react";
import { Shield } from "lucide-react";

interface DynamicLoaderProps {
  label?: string;
  sublabel?: string;
  durationMs?: number;
  onComplete?: () => void;
  /** When true, unmounts after progress hits 100% (optional fade). Default true. */
  hideWhenDone?: boolean;
}

export function DynamicLoader({
  label = "Decrypting Sector Telemetry...",
  sublabel = "Ingesting unauthenticated DOM snapshots & parsing CDX index",
  durationMs = 1200,
  onComplete,
  hideWhenDone = true,
}: DynamicLoaderProps) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<"loading" | "fading" | "hidden">("loading");
  const onCompleteRef = useRef(onComplete);
  const completedRef = useRef(false);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    completedRef.current = false;
    setProgress(0);
    setPhase("loading");

    let startTimestamp: number | null = null;
    let animId = 0;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const elapsed = timestamp - startTimestamp;
      const p = Math.min(100, (elapsed / durationMs) * 100);
      setProgress(p);

      if (p < 100) {
        animId = requestAnimationFrame(step);
      } else if (!completedRef.current) {
        completedRef.current = true;
        onCompleteRef.current?.();
        if (hideWhenDone) {
          setPhase("fading");
          window.setTimeout(() => setPhase("hidden"), 300);
        }
      }
    };

    animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [durationMs, hideWhenDone]);

  if (phase === "hidden") return null;

  return (
    <div
      className={`p-8 rounded-2xl bg-[#0D0F14] border border-[#262A33] shadow-2xl flex flex-col items-center justify-center text-center space-y-5 max-w-md mx-auto my-8 ${
        phase === "fading" ? "loader-done-fade" : ""
      }`}
    >
      {/* Animated Concentric Scanning Rings */}
      <div className="relative w-20 h-20 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border-2 border-blue-500/20 border-t-blue-500 animate-spin" />
        <div className="absolute inset-2 rounded-full border-2 border-purple-500/20 border-b-purple-500 animate-[spin_1.5s_linear_infinite_reverse]" />
        <div className="absolute inset-4 rounded-full border border-emerald-500/30 animate-pulse" />
        <Shield className="w-6 h-6 text-blue-400 animate-pulse" />
      </div>

      <div className="space-y-1.5">
        <div className="text-sm font-bold font-mono text-zinc-100 flex items-center justify-center gap-2">
          <span>{label}</span>
          <span className="text-blue-400 font-bold">{Math.round(progress)}%</span>
        </div>
        <p className="text-xs text-zinc-400 max-w-xs">{sublabel}</p>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-[#181B22] h-1.5 rounded-full overflow-hidden border border-[#262A33]">
        <div
          style={{ width: `${progress}%` }}
          className="h-full bg-linear-to-r from-blue-500 via-indigo-500 to-emerald-400 transition-all duration-75"
        />
      </div>
    </div>
  );
}

// Holographic skeleton shimmer card for dynamic loading content
export function ShimmerCardSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="p-4 rounded-xl border border-[#262A33] bg-[#111318] relative overflow-hidden space-y-3"
        >
          <div className="absolute inset-0 -translate-x-full animate-[shimmer-sweep_2s_infinite] bg-linear-to-r from-transparent via-white/5 to-transparent" />
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#181B22]" />
            <div className="space-y-1.5 flex-1">
              <div className="h-3.5 w-1/3 rounded bg-[#181B22]" />
              <div className="h-2.5 w-1/2 rounded bg-[#181B22]/70" />
            </div>
            <div className="h-4 w-12 rounded bg-[#181B22]" />
          </div>
          <div className="h-10 w-full rounded-lg bg-[#0C0E12]" />
        </div>
      ))}
    </div>
  );
}
