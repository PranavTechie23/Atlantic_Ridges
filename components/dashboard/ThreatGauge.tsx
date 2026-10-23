"use client";

import React, { useEffect, useId, useState } from "react";
import { ShieldAlert, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { AnimatedCounter } from "../ui/AnimatedCounter";

interface ThreatGaugeProps {
  overallScore?: number;
  pricingPressure?: number;
  featureVelocity?: number;
  aiCapability?: number;
  launchActivity?: number;
  compact?: boolean;
}

function MetricBar({
  label,
  value,
  color,
  change,
  delay,
  animate,
}: {
  label: string;
  value: number;
  color: string;
  change: string;
  delay: number;
  animate: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs gap-2">
        <span className="text-app-muted text-[11px] font-medium truncate">{label}</span>
        <div className="flex items-center gap-1.5 font-mono shrink-0">
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400">{change}</span>
          <span className="font-bold text-app-primary text-xs tabular-nums">
            {value}
            <span className="text-[10px] text-app-muted font-sans">/100</span>
          </span>
        </div>
      </div>
      <div className="w-full h-1.5 rounded-full bg-surface-secondary dark:bg-[#1A1D26] overflow-hidden">
        <div
          className={`h-full rounded-full ${color} ${animate ? "motion-progress-bar" : "w-0"}`}
          style={
            animate
              ? ({
                  "--bar-target": `${value}%`,
                  "--bar-delay": `${delay}ms`,
                } as React.CSSProperties)
              : undefined
          }
        />
      </div>
    </div>
  );
}

export function ThreatGauge({
  overallScore = 82,
  pricingPressure = 78,
  featureVelocity = 91,
  aiCapability = 88,
  launchActivity = 74,
  compact = false,
}: ThreatGaugeProps) {
  const gradientId = useId();
  const radius = compact ? 56 : 64;
  const circumference = Math.PI * radius;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setMounted(true);
      return;
    }
    const t = window.setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  const strokeDashoffset = circumference - (overallScore / 100) * circumference;

  const allMetrics = [
    { label: "Pricing pressure", value: pricingPressure, color: "bg-amber-400", change: "+14%" },
    { label: "Feature velocity", value: featureVelocity, color: "bg-blue-500", change: "+22%" },
    { label: "AI capability", value: aiCapability, color: "bg-indigo-500", change: "+35%" },
    { label: "Launch activity", value: launchActivity, color: "bg-violet-500", change: "+8%" },
  ];
  const metrics = compact ? allMetrics.slice(0, 2) : allMetrics;

  const gaugeSize = compact ? 152 : 168;
  const clipHeight = compact ? 82 : 92;

  return (
    <div className="dashboard-card rounded-xl flex flex-col h-full overflow-hidden">
      <div className="flex items-start justify-between gap-3 p-5 sm:p-6 pb-4 border-b border-app shrink-0">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-app-primary flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0" aria-hidden />
            <span className="truncate">Threat overview</span>
          </h3>
          <p className="text-[11px] text-app-muted mt-1 leading-snug">
            {compact ? "Cross-vector pressure index" : "Cross-vector market pressure"}
          </p>
        </div>
        <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/25 uppercase shrink-0">
          High
        </span>
      </div>

      <div className="px-5 sm:px-6 py-4 flex flex-col items-center">
        <div
          className="relative w-full flex justify-center overflow-hidden"
          style={{ height: clipHeight }}
          aria-hidden
        >
          <svg
            width={gaugeSize}
            height={gaugeSize}
            viewBox="0 0 160 160"
            className="absolute top-0 left-1/2 -translate-x-1/2 -rotate-90"
            style={{ marginTop: compact ? -8 : -4 }}
          >
            <circle
              cx="80"
              cy="80"
              r={radius}
              fill="none"
              className="stroke-surface-secondary dark:stroke-[#1D212B]"
              strokeWidth="11"
              strokeDasharray={circumference}
              strokeLinecap="round"
            />
            <circle
              cx="80"
              cy="80"
              r={radius}
              fill="none"
              stroke={`url(#${gradientId})`}
              strokeWidth="11"
              strokeDasharray={circumference}
              strokeDashoffset={mounted ? strokeDashoffset : circumference}
              strokeLinecap="round"
              style={{
                transition: "stroke-dashoffset 1.35s cubic-bezier(0.22, 1, 0.36, 1)",
              }}
            />
            <defs>
              <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3B82F6" />
                <stop offset="50%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#EF4444" />
              </linearGradient>
            </defs>
          </svg>

          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none">
            <span className="text-3xl font-extrabold font-mono text-app-primary tracking-tight tabular-nums leading-none">
              <AnimatedCounter value={mounted ? overallScore : 0} duration={1200} />
            </span>
            <span className="text-[10px] text-app-muted font-mono tracking-widest uppercase font-semibold mt-0.5">
              / 100
            </span>
          </div>
        </div>
        <p className="text-[10px] text-app-muted text-center mt-1 font-medium">Composite threat score</p>
      </div>

      <div className="px-5 sm:px-6 pb-5 sm:pb-6 space-y-3 flex-1">
        {metrics.map((m, i) => (
          <MetricBar key={m.label} {...m} delay={300 + i * 100} animate={mounted} />
        ))}

        <Link
          href="/comparison"
          className="mt-2 w-full py-2.5 px-3 rounded-lg border border-app hover:bg-blue-600 hover:text-white hover:border-blue-600 text-xs font-semibold text-app-secondary flex items-center justify-center gap-1.5 transition-all duration-300 group"
        >
          <span>{compact ? "Compare competitors" : "Open comparison matrix"}</span>
          <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
        </Link>
      </div>
    </div>
  );
}
