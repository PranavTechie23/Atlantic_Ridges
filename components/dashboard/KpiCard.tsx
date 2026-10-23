"use client";

import React from "react";
import { TrendingUp, TrendingDown, LucideIcon } from "lucide-react";
import { AnimatedCounter } from "../ui/AnimatedCounter";

interface KpiCardProps {
  title: string;
  value: string | number;
  change: string;
  isPositive?: boolean;
  context: string;
  icon: LucideIcon;
  sparklineData: number[];
  minimal?: boolean;
}

export function KpiCard({
  title,
  value,
  change,
  isPositive = true,
  context,
  icon: Icon,
}: KpiCardProps) {
  const numValue = typeof value === "number" ? value : parseFloat(String(value).replace(/[^0-9.]/g, ""));
  const hasSuffix = typeof value === "string" && value.includes("%");

  return (
    <div className="dashboard-card relative rounded-xl overflow-hidden group hover:-translate-y-0.5 p-4">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-12 bg-linear-to-b from-blue-500/[0.06] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 dark:from-blue-500/10" />

      <div className="relative flex items-center justify-between gap-2">
        <span className="text-[11px] font-medium text-app-muted uppercase tracking-wide">{title}</span>
        <div className="p-1.5 rounded-lg bg-surface-secondary dark:bg-white/[0.04] text-app-muted group-hover:text-blue-400 transition-colors duration-300">
          <Icon className="w-4 h-4 shrink-0" />
        </div>
      </div>

      <div className="relative mt-2.5 text-2xl font-bold font-mono text-app-primary tracking-tight">
        {!isNaN(numValue) ? (
          <AnimatedCounter
            value={numValue}
            decimals={hasSuffix ? 1 : 0}
            suffix={hasSuffix ? "%" : ""}
            duration={1200}
          />
        ) : (
          value
        )}
      </div>

      <div className="relative mt-2 flex items-center gap-2 text-[11px]">
        {isPositive ? (
          <TrendingUp className="w-3 h-3 text-emerald-500" />
        ) : (
          <TrendingDown className="w-3 h-3 text-app-muted" />
        )}
        <span className={isPositive ? "text-emerald-500 dark:text-emerald-400 font-medium" : "text-app-muted"}>
          {change}
        </span>
        <span className="text-app-muted">· {context}</span>
      </div>
    </div>
  );
}
