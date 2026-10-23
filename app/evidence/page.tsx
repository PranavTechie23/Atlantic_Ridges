"use client";

import React, { useState, useMemo } from "react";
import { useApp } from "../../lib/context/AppContext";
import { mockEvidence } from "../../lib/mock-data/evidence";
import { SeverityBadge, CategoryBadge, StatusBadge } from "../../components/ui/Badge";
import {
  ShieldCheck,
  Search,
  ExternalLink,
  Calendar,
  Clock,
  Cpu,
  Hash,
  ArrowRight,
  Filter,
  CheckCircle2,
  FileCode,
} from "lucide-react";

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
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-[#F5F7FA]">
              Evidence Explorer
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Cryptographically Verified
            </span>
          </div>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Every intelligence signal is traceable to its original DOM snapshot and cryptographic hash.
          </p>
        </div>

        {/* Global verification stat */}
        <div className="flex items-center gap-3 p-2.5 rounded-lg bg-[#111318] border border-[#262A33] text-xs font-mono self-start sm:self-auto">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="text-zinc-300">
            {mockEvidence.length} Signals Verified · 0 Flagged
          </span>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="p-3 rounded-xl bg-[#111318] border border-[#262A33] flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search verified snippets, URLs, or competitors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-[#0C0E12] border border-[#262A33] rounded-lg text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-2.5 py-1 rounded font-medium transition-colors ${
              selectedCategory === "all"
                ? "bg-blue-600 text-white"
                : "text-zinc-400 hover:text-zinc-200"
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
                    : "text-zinc-400 hover:text-zinc-200"
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
            className="p-5 rounded-xl bg-[#111318] border border-[#262A33] hover:border-zinc-700 transition-all flex flex-col justify-between space-y-4 group"
          >
            <div className="space-y-3">
              {/* Header Badges */}
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                    {ev.competitorName}
                  </span>
                  <span className="text-zinc-600">·</span>
                  <CategoryBadge category={ev.category} />
                  <SeverityBadge severity={ev.severity} />
                </div>

                <StatusBadge status={ev.verificationStatus} />
              </div>

              {/* Title */}
              <h3 className="text-base font-semibold text-zinc-100 group-hover:text-blue-200 transition-colors">
                {ev.title}
              </h3>

              {/* Before vs After Visual Snapshot */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {/* BEFORE */}
                <div className="p-3 rounded-lg bg-[#0C0E12] border border-[#262A33] space-y-1.5 overflow-hidden">
                  <div className="flex items-center justify-between font-mono text-[10px] text-red-400">
                    <span className="font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                      BEFORE
                    </span>
                    <span className="text-zinc-500">
                      {new Date(ev.observedPreviousDate).toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="text-zinc-300 font-mono text-[11px] leading-relaxed max-h-24 overflow-y-auto whitespace-pre-wrap">
                    {ev.beforeContent}
                  </div>
                </div>

                {/* AFTER */}
                <div className="p-3 rounded-lg bg-[#0C0E12] border border-[#262A33] space-y-1.5 overflow-hidden">
                  <div className="flex items-center justify-between font-mono text-[10px] text-emerald-400">
                    <span className="font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      AFTER
                    </span>
                    <span className="text-zinc-500">
                      {new Date(ev.observedCurrentDate).toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="text-zinc-200 font-mono text-[11px] leading-relaxed max-h-24 overflow-y-auto whitespace-pre-wrap font-medium">
                    {ev.afterContent}
                  </div>
                </div>
              </div>

              {/* Meta information: Source, Method, Hash */}
              <div className="p-3 rounded-lg bg-[#14171E] border border-[#262A33] space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500 text-[11px]">Detection Engine:</span>
                  <span className="text-zinc-300 font-mono text-[11px]">
                    {ev.detectionMethod}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500 text-[11px]">Confidence Score:</span>
                  <span className="text-emerald-400 font-mono font-bold text-[11px]">
                    {ev.confidence}% Verified
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500 text-[11px] flex items-center gap-1">
                    <Hash className="w-3 h-3 text-zinc-500" />
                    Hash:
                  </span>
                  <span className="text-zinc-400 font-mono text-[10px] truncate max-w-[220px]">
                    {ev.hashDigest}
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-[#1F232D] flex items-center justify-between gap-3">
              <a
                href={ev.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-zinc-400 hover:text-zinc-200 flex items-center gap-1 font-mono"
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
