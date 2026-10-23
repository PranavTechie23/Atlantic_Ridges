"use client";

import React, { useState, useMemo } from "react";
import { useApp } from "../../lib/context/AppContext";
import { mockChanges } from "../../lib/mock-data/changes";
import { ChangeCategory } from "../../lib/types";
import { SeverityBadge, CategoryBadge } from "../../components/ui/Badge";
import {
  Calendar,
  Clock,
  ShieldCheck,
  ArrowRight,
  Filter,
  Layers,
  ExternalLink,
  History,
} from "lucide-react";
import { ScrollReveal } from "../../components/ui/ScrollReveal";

export default function TimelinePage() {
  const { openEvidenceDrawer } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<ChangeCategory | "all">("all");
  const [timeframe, setTimeframe] = useState<"7D" | "30D" | "90D">("30D");

  const filteredEvents = useMemo(() => {
    let list = [...mockChanges];

    if (selectedCategory !== "all") {
      list = list.filter((item) => item.category === selectedCategory);
    }

    if (timeframe === "7D") {
      const sevenDaysAgo = new Date("2026-10-16T00:00:00Z").getTime();
      list = list.filter((item) => new Date(item.detectedAt).getTime() >= sevenDaysAgo);
    }

    // Sort by date descending
    list.sort((a, b) => new Date(b.detectedAt).getTime() - new Date(a.detectedAt).getTime());

    return list;
  }, [selectedCategory, timeframe]);

  // Group events by date string
  const groupedEvents = useMemo(() => {
    const groups: Record<string, typeof filteredEvents> = {};
    filteredEvents.forEach((ev) => {
      const d = new Date(ev.detectedAt).toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
      if (!groups[d]) groups[d] = [];
      groups[d].push(ev);
    });
    return groups;
  }, [filteredEvents]);

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#F5F7FA]">
            Competitive Timeline
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Trace how competitors evolved over time across pricing, product features, and positioning.
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 flex-wrap text-xs">
          {/* Timeframe */}
          <div className="flex items-center bg-[#111318] p-0.5 rounded-lg border border-[#262A33]">
            {(["7D", "30D", "90D"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTimeframe(t)}
                className={`px-2.5 py-1 rounded font-mono transition-colors ${
                  timeframe === t
                    ? "bg-blue-600 text-white"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        <button
          onClick={() => setSelectedCategory("all")}
          className={`px-3 py-1.5 rounded-lg border transition-colors ${
            selectedCategory === "all"
              ? "bg-blue-600 border-blue-500 text-white font-semibold"
              : "bg-[#111318] border-[#262A33] text-zinc-400 hover:text-zinc-200"
          }`}
        >
          All Categories ({mockChanges.length})
        </button>
        {(["pricing", "features", "launch", "positioning", "announcements"] as const).map(
          (cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg border capitalize transition-colors ${
                selectedCategory === cat
                  ? "bg-blue-600 border-blue-500 text-white font-semibold"
                  : "bg-[#111318] border-[#262A33] text-zinc-400 hover:text-zinc-200"
              }`}
            >
              {cat}
            </button>
          )
        )}
      </div>

      {/* Vertical Timeline */}
      <div className="relative pl-6 sm:pl-8 border-l border-[#262A33] space-y-10 mt-6">
        {Object.entries(groupedEvents).map(([dateLabel, events]) => (
          <div key={dateLabel} className="relative space-y-4">
            {/* Timeline Marker Date */}
            <div className="absolute -left-[31px] sm:-left-[39px] top-0 flex items-center gap-3">
              <div className="w-3.5 h-3.5 rounded-full bg-blue-500 ring-4 ring-slate-100 dark:ring-[#08090C] shrink-0" />
            </div>

            <div className="font-mono text-xs font-bold uppercase tracking-wider text-blue-400">
              {dateLabel}
            </div>

            {/* Events on this date */}
            <div className="space-y-4">
              {events.map((ev, evIdx) => (
                <ScrollReveal
                  key={ev.id}
                  direction="up"
                  delayMs={evIdx * 50}
                  className="w-full"
                >
                  <div className="p-5 rounded-xl bg-[#111318] border border-[#262A33] hover:border-blue-500/40 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300 space-y-3 group hover:translate-x-1">
                    <div className="flex items-center justify-between gap-3 flex-wrap">
                      <div className="flex items-center gap-2">
                        <SeverityBadge severity={ev.severity} />
                        <CategoryBadge category={ev.category} />
                        <span className="text-zinc-600">·</span>
                        <span className="text-xs font-bold text-zinc-200">
                          {ev.competitorName}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-zinc-500 font-mono">
                        <span className="flex items-center gap-1 text-emerald-400">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                          {ev.confidence}% Confidence
                        </span>
                      </div>
                    </div>

                    <h3 className="text-base font-semibold text-zinc-100 group-hover:text-blue-300 transition-colors">
                      {ev.title}
                    </h3>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      {ev.summary}
                    </p>

                    {/* Diff if present */}
                    {ev.beforeState && ev.afterState && (
                      <div className="p-3 rounded-lg bg-[#0C0E12] border border-[#262A33] grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs group-hover:border-[#383E4C] transition-colors">
                        <div>
                          <span className="text-[10px] font-mono uppercase text-red-400 block mb-0.5">
                            Previous
                          </span>
                          <div className="text-zinc-400 font-mono text-[11px]">
                            {ev.beforeState}
                          </div>
                        </div>
                        <div className="sm:border-l sm:border-[#262A33] sm:pl-3">
                          <span className="text-[10px] font-mono uppercase text-emerald-400 block mb-0.5">
                            Revised
                          </span>
                          <div className="text-zinc-200 font-mono text-[11px] font-medium">
                            {ev.afterState}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Footer link to drawer */}
                    <div className="pt-2 flex items-center justify-between text-xs">
                      <span className="text-zinc-500 text-[11px]">
                        Why it matters: <span className="text-zinc-300 font-medium">{ev.whyItMatters.slice(0, 100)}...</span>
                      </span>

                      <button
                        onClick={() => openEvidenceDrawer(ev.evidenceId)}
                        className="px-3 py-1.5 rounded-md bg-[#181B22] hover:bg-blue-600/20 text-blue-400 font-medium flex items-center gap-1.5 transition-all group-hover:border group-hover:border-blue-500/30 shrink-0"
                      >
                        <span>View Provenance</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
