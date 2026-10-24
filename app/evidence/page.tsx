"use client";

import React, { useState, useMemo } from "react";
import { useApp } from "../../lib/context/AppContext";
import { mockEvidence } from "../../lib/mock-data/evidence";
import { SeverityBadge, CategoryBadge, StatusBadge } from "../../components/ui/Badge";
import {
  ShieldCheck,
  Search,
  ExternalLink,
  Hash,
  ArrowRight,
} from "lucide-react";
import { EvidenceStateText } from "../../components/evidence/EvidenceStateText";

export default function EvidenceExplorerPage() {
  const { openEvidenceDrawer } = useApp();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filteredEvidence = useMemo(() => {
    let list = [...mockEvidence];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (ev) =>
          ev.title.toLowerCase().includes(q) ||
          ev.competitorName.toLowerCase().includes(q) ||
          ev.rawExcerpt.toLowerCase().includes(q) ||
          ev.detectionMethod.toLowerCase().includes(q)
      );
    }

    if (selectedCategory !== "all") {
      list = list.filter((ev) => ev.category === selectedCategory);
    }

    return list;
  }, [searchQuery, selectedCategory]);

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl font-bold tracking-tight text-app-primary">Evidence Explorer</h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/25">
              Cryptographically Verified
            </span>
          </div>
          <p className="text-xs sm:text-sm text-app-muted mt-1">
            Every intelligence signal is traceable to its original DOM snapshot and cryptographic hash.
          </p>
        </div>

        <div className="flex items-center gap-3 p-2.5 rounded-lg bg-surface-primary border border-app text-xs font-mono self-start sm:self-auto shadow-xs">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span className="text-app-secondary">
            {mockEvidence.length} Signals Verified · 0 Flagged
          </span>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="p-3 rounded-xl bg-surface-primary border border-app flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-3.5 h-3.5 text-app-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search verified snippets, URLs, or competitors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-surface-secondary dark:bg-[#0C0E12] border border-app rounded-lg text-xs text-app-primary placeholder:text-app-muted focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-2.5 py-1 rounded font-medium transition-colors ${
              selectedCategory === "all"
                ? "bg-blue-600 text-white"
                : "text-app-muted hover:text-app-primary hover:bg-surface-secondary"
            }`}
          >
            All Evidence ({mockEvidence.length})
          </button>
          {(["pricing", "features", "launch", "positioning", "announcements"] as const).map(
            (cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded font-medium capitalize transition-colors ${
                  selectedCategory === cat
                    ? "bg-blue-600 text-white"
                    : "text-app-muted hover:text-app-primary hover:bg-surface-secondary"
                }`}
              >
                {cat}
              </button>
            )
          )}
        </div>
      </div>

      {/* Evidence Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredEvidence.map((ev) => (
          <div
            key={ev.id}
            className="p-5 rounded-xl bg-surface-primary border border-app hover:border-slate-300 dark:hover:border-zinc-700 transition-all flex flex-col justify-between space-y-4 group shadow-xs"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                    {ev.competitorName}
                  </span>
                  <span className="text-app-muted">·</span>
                  <CategoryBadge category={ev.category} />
                  <SeverityBadge severity={ev.severity} />
                </div>

                <StatusBadge status={ev.verificationStatus} />
              </div>

              <h3 className="text-base font-semibold text-app-primary group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors">
                {ev.title}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-surface-secondary border border-app space-y-1.5 overflow-hidden">
                  <div className="flex items-center justify-between font-mono text-[10px] text-red-600 dark:text-red-400">
                    <span className="font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 dark:bg-red-400" />
                      BEFORE
                    </span>
                    <span className="text-app-muted">
                      {new Date(ev.observedPreviousDate).toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <EvidenceStateText
                    content={ev.beforeContent}
                    variant="before"
                    className="max-h-24 overflow-y-auto"
                  />
                </div>

                <div className="p-3 rounded-lg bg-surface-secondary border border-app space-y-1.5 overflow-hidden">
                  <div className="flex items-center justify-between font-mono text-[10px] text-emerald-700 dark:text-emerald-400">
                    <span className="font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400" />
                      AFTER
                    </span>
                    <span className="text-app-muted">
                      {new Date(ev.observedCurrentDate).toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <EvidenceStateText
                    content={ev.afterContent}
                    variant="after"
                    className="max-h-24 overflow-y-auto"
                  />
                </div>
              </div>

              <div className="p-3 rounded-lg bg-surface-secondary border border-app space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-app-muted text-[11px]">Detection Engine:</span>
                  <span className="text-app-secondary font-mono text-[11px]">{ev.detectionMethod}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-app-muted text-[11px]">Confidence Score:</span>
                  <span className="text-emerald-700 dark:text-emerald-400 font-mono font-bold text-[11px]">
                    {ev.confidence}% Verified
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-app-muted text-[11px] flex items-center gap-1">
                    <Hash className="w-3 h-3" />
                    Hash:
                  </span>
                  <span className="text-app-muted font-mono text-[10px] truncate max-w-[220px]">
                    {ev.hashDigest}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-app flex items-center justify-between gap-3">
              <a
                href={ev.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-app-muted hover:text-app-primary flex items-center gap-1 font-mono"
              >
                <span>Open Source</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              <button
                onClick={() => openEvidenceDrawer(ev.id)}
                className="px-3.5 py-1.5 rounded-md bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white flex items-center gap-1.5 transition-colors"
              >
                <span>Inspect in Drawer</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
