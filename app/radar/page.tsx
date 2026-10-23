"use client";

import React, { useState, useMemo, useCallback } from "react";
import { useApp } from "../../lib/context/AppContext";
import { mockChanges } from "../../lib/mock-data/changes";
import { ChangeCategory, ChangeItem } from "../../lib/types";
import { CategoryBadge, SeverityBadge } from "../../components/ui/Badge";
import { ArrowRight, Info } from "lucide-react";
import { Reveal } from "../../components/ui/Motion";
import { LivePulseIndicator } from "../../components/ui/LivePulseIndicator";

const CATEGORIES: (ChangeCategory | "all")[] = [
  "all",
  "pricing",
  "features",
  "launch",
  "positioning",
  "announcements",
];

const categoryStyles: Record<
  ChangeCategory,
  { ring: string; bg: string; text: string; hex: string }
> = {
  pricing: {
    ring: "ring-emerald-500/40",
    bg: "bg-emerald-500",
    text: "text-emerald-700 dark:text-emerald-300",
    hex: "#10B981",
  },
  features: {
    ring: "ring-indigo-500/40",
    bg: "bg-indigo-500",
    text: "text-indigo-700 dark:text-indigo-300",
    hex: "#6366F1",
  },
  launch: {
    ring: "ring-violet-500/40",
    bg: "bg-violet-500",
    text: "text-violet-700 dark:text-violet-300",
    hex: "#8B5CF6",
  },
  positioning: {
    ring: "ring-sky-500/40",
    bg: "bg-sky-500",
    text: "text-sky-700 dark:text-sky-300",
    hex: "#0EA5E9",
  },
  announcements: {
    ring: "ring-amber-500/40",
    bg: "bg-amber-500",
    text: "text-amber-700 dark:text-amber-300",
    hex: "#F59E0B",
  },
};

/** Nudge overlapping points apart in % space */
function spreadPoints(
  points: { id: string; x: number; y: number; radius: number }[],
  minGap = 4.5,
  iterations = 12
) {
  const coords = points.map((p) => ({ ...p }));
  for (let iter = 0; iter < iterations; iter++) {
    for (let i = 0; i < coords.length; i++) {
      for (let j = i + 1; j < coords.length; j++) {
        const a = coords[i];
        const b = coords[j];
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const dist = Math.hypot(dx, dy) || 0.01;
        const need = minGap + (a.radius + b.radius) / 80;
        if (dist < need) {
          const push = (need - dist) / 2;
          const nx = dx / dist;
          const ny = dy / dist;
          a.x = Math.max(14, Math.min(86, a.x - nx * push));
          a.y = Math.max(14, Math.min(86, a.y - ny * push));
          b.x = Math.max(14, Math.min(86, b.x + nx * push));
          b.y = Math.max(14, Math.min(86, b.y + ny * push));
        }
      }
    }
  }
  return coords;
}

export default function ChangeRadarPage() {
  const { openEvidenceDrawer } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<ChangeCategory | "all">("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const radarPoints = useMemo(() => {
    const referenceDate = new Date("2026-10-23T12:00:00Z").getTime();

    const raw = mockChanges.map((item) => {
      const itemDate = new Date(item.detectedAt).getTime();
      const daysAgo = Math.max(0, (referenceDate - itemDate) / (1000 * 60 * 60 * 24));
      const xPercent = Math.max(14, Math.min(86, 86 - (daysAgo / 18) * 72));
      const yPercent = Math.max(14, Math.min(86, 86 - ((item.significanceScore - 50) / 50) * 72));
      const radius = Math.max(14, Math.min(22, 12 + (item.significanceScore / 100) * 10));

      return {
        ...item,
        daysAgo: Math.round(daysAgo),
        x: xPercent,
        y: yPercent,
        radius,
      };
    });

    const spread = spreadPoints(raw);
    return raw.map((item) => {
      const s = spread.find((p) => p.id === item.id)!;
      return { ...item, x: s.x, y: s.y };
    });
  }, []);

  const filteredPoints = useMemo(() => {
    if (selectedCategory === "all") return radarPoints;
    return radarPoints.filter((p) => p.category === selectedCategory);
  }, [radarPoints, selectedCategory]);

  const activeSignal: ChangeItem | null = useMemo(() => {
    const id = selectedId ?? filteredPoints[0]?.id ?? null;
    if (!id) return null;
    return filteredPoints.find((p) => p.id === id) ?? null;
  }, [selectedId, filteredPoints]);

  const selectSignal = useCallback((id: string) => {
    setSelectedId(id);
  }, []);

  return (
    <div className="space-y-6 pb-12 max-w-5xl page-enter">
      <Reveal>
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-app-primary">Change Radar</h1>
          <p className="text-sm text-app-secondary max-w-xl">
            Recency versus business impact. Larger bubbles mean higher significance.
          </p>
        </div>
        <LivePulseIndicator status="verifying" label="360° Threat Sweep Active" sublabel="Live Sector Scan" />
      </header>

      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => {
          const count =
            cat === "all" ? radarPoints.length : radarPoints.filter((p) => p.category === cat).length;
          const active = selectedCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => {
                setSelectedCategory(cat);
                setSelectedId(null);
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-colors border ${
                active
                  ? "bg-blue-600 border-blue-600 text-white"
                  : "border-app bg-surface-primary text-app-secondary hover:text-app-primary hover:border-blue-500/30"
              }`}
            >
              {cat === "all" ? `All (${count})` : `${cat} (${count})`}
            </button>
          );
        })}
      </div>
      </Reveal>

      <Reveal delay={100}>
      <div className="rounded-2xl border border-app bg-surface-primary shadow-sm overflow-hidden">
        {/* Category legend */}
        <div className="flex flex-wrap gap-3 px-4 py-3 border-b border-app bg-surface-secondary/50">
          {(Object.keys(categoryStyles) as ChangeCategory[]).map((cat) => (
            <span key={cat} className="flex items-center gap-1.5 text-[11px] text-app-secondary capitalize">
              <span className={`w-2 h-2 rounded-full ${categoryStyles[cat].bg}`} />
              {cat}
            </span>
          ))}
        </div>

        {/* Chart with external axis labels */}
        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-[auto_1fr] grid-rows-[1fr_auto] gap-x-3 gap-y-2">
            <div className="flex items-center justify-center row-span-1">
              <span className="text-[11px] font-medium text-app-muted -rotate-90 whitespace-nowrap tracking-wide">
                Impact ↑
              </span>
            </div>

            <div className="relative">
              <div className="absolute left-0 top-0 bottom-0 w-8 flex flex-col justify-between py-2 pointer-events-none z-10">
                <span className="text-[10px] text-app-muted font-mono">100</span>
                <span className="text-[10px] text-app-muted font-mono">50</span>
              </div>
              <div className="absolute bottom-0 left-8 right-0 h-6 flex justify-between items-end px-2 pointer-events-none z-10">
                <span className="text-[10px] text-app-muted font-mono">20d ago</span>
                <span className="text-[10px] text-app-muted font-mono">Today</span>
              </div>

              <div className="relative ml-8 mr-1 mb-6 h-[min(420px,55vh)] min-h-[320px] rounded-xl border border-app bg-surface-secondary/40 dark:bg-[#0a0c10]/80 overflow-hidden">
                <svg className="absolute inset-0 w-full h-full pointer-events-none text-app-muted" aria-hidden>
                  <defs>
                    <pattern id="radarGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path
                        d="M 40 0 L 0 0 0 40"
                        fill="none"
                        stroke="currentColor"
                        strokeOpacity="0.08"
                        strokeWidth="1"
                      />
                    </pattern>
                    <linearGradient id="radarSweepBeam" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#radarGrid)" />
                  <line x1="0" y1="50%" x2="100%" y2="50%" stroke="currentColor" strokeOpacity="0.12" />
                  <line x1="50%" y1="0" x2="50%" y2="100%" stroke="currentColor" strokeOpacity="0.12" />
                  <circle cx="50%" cy="50%" r="35%" fill="none" stroke="currentColor" strokeOpacity="0.1" strokeDasharray="4 6" />
                  <circle cx="50%" cy="50%" r="22%" fill="none" stroke="currentColor" strokeOpacity="0.08" strokeDasharray="4 6" />
                  <circle cx="50%" cy="50%" r="10%" fill="none" stroke="currentColor" strokeOpacity="0.06" />

                  {/* High-tech rotating radar beam */}
                  <g className="animate-radar-sweep origin-center">
                    <line x1="50%" y1="50%" x2="50%" y2="0%" stroke="url(#radarSweepBeam)" strokeWidth="2.5" />
                  </g>
                </svg>

                {filteredPoints.map((point, index) => {
                  const style = categoryStyles[point.category];
                  const isSelected = activeSignal?.id === point.id;
                  const size = point.radius * 2;

                  return (
                    <button
                      key={point.id}
                      type="button"
                      style={{
                        left: `${point.x}%`,
                        top: `${point.y}%`,
                        width: size,
                        height: size,
                        "--pop-delay": `${index * 45}ms`,
                      } as React.CSSProperties}
                      className={`motion-pop absolute rounded-full flex items-center justify-center font-mono text-[10px] font-bold text-white shadow-md transition-all z-20 ${style.bg} ${
                        isSelected
                          ? `ring-4 ${style.ring} scale-110 z-30`
                          : "opacity-90 hover:opacity-100 hover:scale-105"
                      } ${point.significanceScore >= 90 ? "ring-2 ring-red-400/50" : ""}`}
                      onClick={() => selectSignal(point.id)}
                      onMouseEnter={() => selectSignal(point.id)}
                      aria-label={`${point.competitorName}, score ${point.significanceScore}`}
                    >
                      {point.significanceScore}
                    </button>
                  );
                })}
              </div>
            </div>

            <div />
            <p className="text-center text-[11px] text-app-muted font-medium tracking-wide">Recency →</p>
          </div>

          {/* Quadrant guide — outside plot, readable */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
            <div className="rounded-lg border border-red-500/20 bg-red-500/5 px-3 py-2 text-app-secondary">
              <span className="font-semibold text-red-600 dark:text-red-400">Top right · </span>
              Recent + high impact — act first
            </div>
            <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 px-3 py-2 text-app-secondary">
              <span className="font-semibold text-amber-700 dark:text-amber-400">Top left · </span>
              High impact, older — track trend
            </div>
            <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 px-3 py-2 text-app-secondary">
              <span className="font-semibold text-blue-600 dark:text-blue-400">Bottom right · </span>
              Recent, moderate — watch list
            </div>
            <div className="rounded-lg border border-app bg-surface-secondary px-3 py-2 text-app-muted">
              <span className="font-semibold text-app-secondary">Bottom left · </span>
              Lower priority / ambient noise
            </div>
          </div>
        </div>
      </div>
      </Reveal>

      <Reveal delay={200}>
      <div className="rounded-xl border border-app bg-surface-primary p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4">
        {activeSignal ? (
          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-semibold text-app-primary">{activeSignal.competitorName}</span>
              <SeverityBadge severity={activeSignal.severity} />
              <CategoryBadge category={activeSignal.category} />
              <span className="text-xs font-mono text-app-muted">{activeSignal.significanceScore}/100</span>
            </div>
            <p className="text-sm font-medium text-app-primary leading-snug">{activeSignal.title}</p>
            <p className="text-xs text-app-secondary line-clamp-2">{activeSignal.whyItMatters}</p>
          </div>
        ) : (
          <div className="flex items-start gap-2 text-sm text-app-secondary flex-1">
            <Info className="w-4 h-4 shrink-0 mt-0.5 text-blue-500" />
            Select a bubble to preview the signal, then open verified evidence.
          </div>
        )}

        <button
          type="button"
          onClick={() => {
            const id = activeSignal?.evidenceId ?? "ev-acme-pricing-20261023";
            openEvidenceDrawer(id);
          }}
          className="shrink-0 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-colors"
        >
          Open evidence
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
      </Reveal>
    </div>
  );
}
