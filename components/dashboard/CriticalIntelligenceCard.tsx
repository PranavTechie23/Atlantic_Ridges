"use client";

import React, { useState } from "react";
import { ChangeItem } from "../../lib/types";
import { SeverityBadge, CategoryBadge } from "../ui/Badge";
import { ArrowRight, ChevronRight } from "lucide-react";
import { useApp } from "../../lib/context/AppContext";
import { BorderBeam } from "../ui/BorderBeam";
import { Reveal } from "../ui/Motion";

export function CriticalIntelligenceCard({
  item,
  compact = false,
  featured = false,
  revealDelay = 0,
  revealEager = false,
}: {
  item: ChangeItem;
  compact?: boolean;
  featured?: boolean;
  revealDelay?: number;
  revealEager?: boolean;
}) {
  const { openEvidenceDrawer } = useApp();
  const [hovered, setHovered] = useState(false);

  const borderAccent = {
    CRITICAL: "border-l-red-500",
    HIGH: "border-l-amber-500",
    MEDIUM: "border-l-blue-500",
    LOW: "border-l-zinc-400",
  }[item.severity];

  if (compact) {
    return (
      <Reveal delay={revealDelay} eager={revealEager}>
        <button
          type="button"
          onClick={() => openEvidenceDrawer(item.evidenceId)}
          className={`dashboard-card w-full text-left flex items-center gap-3 p-3 rounded-xl border-l-[3px] ${borderAccent} hover:-translate-y-0 group`}
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-0.5">
              <span className="text-xs font-semibold text-app-primary truncate">{item.competitorName}</span>
              <CategoryBadge category={item.category} />
            </div>
            <p className="text-sm text-app-secondary truncate">{item.title}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-mono font-bold text-app-muted">{item.significanceScore}</span>
            <ChevronRight className="w-4 h-4 text-app-muted group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all duration-300" />
          </div>
        </button>
      </Reveal>
    );
  }

  return (
    <Reveal delay={revealDelay} eager={revealEager}>
      <article
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={`dashboard-card relative rounded-xl border-l-4 ${borderAccent} overflow-hidden ${
          featured ? "ring-1 ring-blue-500/15 dark:ring-blue-500/20" : ""
        }`}
      >
        {featured && hovered && (
          <BorderBeam size={280} duration={10} colorFrom="#3B82F6" colorTo="#6366F1" borderWidth={1} />
        )}
        <div className={featured ? "p-5 sm:p-6" : "p-4 sm:p-5"}>
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <SeverityBadge severity={item.severity} />
            <CategoryBadge category={item.category} />
            <span className="text-sm font-semibold text-app-primary">{item.competitorName}</span>
            <span className="text-xs text-app-muted ml-auto font-mono">{item.confidence}% verified</span>
          </div>

          <h3 className="text-lg font-semibold text-app-primary leading-snug">{item.title}</h3>
          <p className="mt-1.5 text-sm text-app-secondary line-clamp-2">{item.summary}</p>

          {featured && item.beforeState && item.afterState && (
            <div className="dashboard-inset mt-4 grid sm:grid-cols-2 gap-3 p-4 rounded-xl text-sm overflow-hidden">
              <div className="diff-reveal-before">
                <p className="text-[10px] font-mono uppercase text-red-500 dark:text-red-400 mb-1.5">Before</p>
                <p className="font-mono text-app-secondary text-xs leading-relaxed">{item.beforeState}</p>
              </div>
              <div className="sm:border-l sm:border-app sm:pl-3 diff-reveal-after">
                <p className="text-[10px] font-mono uppercase text-emerald-600 dark:text-emerald-400 mb-1.5">After</p>
                <p className="font-mono text-app-primary text-xs font-medium leading-relaxed">{item.afterState}</p>
                {item.changeDelta && (
                  <span className="inline-block mt-2 text-[11px] font-mono text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/15">
                    {item.changeDelta}
                  </span>
                )}
              </div>
            </div>
          )}

          <div className="mt-4 flex items-center justify-between gap-3 pt-4 border-t border-app">
            <span className="text-xs text-app-muted">
              Significance{" "}
              <strong className="font-mono text-app-primary">{item.significanceScore}</strong>/100
            </span>
            <button
              type="button"
              onClick={() => openEvidenceDrawer(item.evidenceId)}
              className="btn-cta-primary inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-white text-xs font-semibold transition-all duration-300 hover:gap-2 group"
            >
              View evidence
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-300" />
            </button>
          </div>
        </div>
      </article>
    </Reveal>
  );
}
