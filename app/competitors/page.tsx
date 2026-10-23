"use client";

import React, { useState, useMemo } from "react";
import { useApp } from "../../lib/context/AppContext";
import { CompetitorCard } from "../../components/competitors/CompetitorCard";
import { CompetitorTable } from "../../components/competitors/CompetitorTable";
import {
  Search,
  Plus,
  LayoutGrid,
  Table as TableIcon,
  SlidersHorizontal,
  ArrowUpDown,
  Building2,
} from "lucide-react";

import { ScrollReveal } from "../../components/ui/ScrollReveal";
import { ShimmerCardSkeleton, DynamicLoader } from "../../components/ui/DynamicLoader";

export default function CompetitorsPage() {
  const { competitors, openAddCompetitorModal } = useApp();
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [searchQuery, setSearchQuery] = useState("");
  const [threatFilter, setThreatFilter] = useState<"ALL" | "CRITICAL" | "HIGH" | "MEDIUM">("ALL");
  const [sortBy, setSortBy] = useState<"threat" | "velocity" | "name">("threat");
  const [isFiltering, setIsFiltering] = useState(false);

  const filteredCompetitors = useMemo(() => {
    let list = [...competitors];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q) ||
          c.tagline.toLowerCase().includes(q)
      );
    }

    if (threatFilter !== "ALL") {
      list = list.filter((c) => c.threatLevel === threatFilter);
    }

    list.sort((a, b) => {
      if (sortBy === "threat") return b.threatScore - a.threatScore;
      if (sortBy === "velocity") return b.metrics.featureVelocity - a.metrics.featureVelocity;
      return a.name.localeCompare(b.name);
    });

    return list;
  }, [competitors, searchQuery, threatFilter, sortBy]);

  const handleFilterChange = (lvl: typeof threatFilter) => {
    setIsFiltering(true);
    setThreatFilter(lvl);
    window.setTimeout(() => setIsFiltering(false), 220);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#F5F7FA]">
            Competitors
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Monitor competitive movement across your market.
          </p>
        </div>

        <button
          onClick={openAddCompetitorModal}
          className="px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white flex items-center gap-2 self-start sm:self-auto shadow-xs transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Competitor</span>
        </button>
      </div>

      {/* Control Bar: Search, Filters, Sorters, View Mode */}
      <div className="p-3 rounded-xl bg-[#111318] border border-[#262A33] flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Filter by name, industry, or positioning keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-[#0C0E12] border border-[#262A33] rounded-lg text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Filter & Sort controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Threat level filter */}
          <div className="flex items-center gap-1 bg-[#0C0E12] p-1 rounded-lg border border-[#262A33]">
            <span className="text-zinc-500 text-[11px] px-1.5">Threat:</span>
            {(["ALL", "CRITICAL", "HIGH", "MEDIUM"] as const).map((lvl) => (
              <button
                key={lvl}
                onClick={() => handleFilterChange(lvl)}
                className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors ${
                  threatFilter === lvl
                    ? "bg-blue-600 text-white shadow-xs"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>

          {/* Sort dropdown */}
          <div className="flex items-center gap-1 bg-[#0C0E12] px-2 py-1 rounded-lg border border-[#262A33] text-zinc-400">
            <ArrowUpDown className="w-3 h-3 text-zinc-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-xs text-zinc-200 focus:outline-none cursor-pointer"
            >
              <option value="threat" className="bg-[#111318]">Sort: Threat Score</option>
              <option value="velocity" className="bg-[#111318]">Sort: Velocity</option>
              <option value="name" className="bg-[#111318]">Sort: Name (A-Z)</option>
            </select>
          </div>

          {/* View toggle: Table / Grid */}
          <div className="flex items-center bg-[#0C0E12] p-0.5 rounded-lg border border-[#262A33]">
            <button
              onClick={() => setViewMode("table")}
              className={`p-1.5 rounded transition-colors ${
                viewMode === "table"
                  ? "bg-[#1E232F] text-blue-400"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
              title="Table view"
            >
              <TableIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded transition-colors ${
                viewMode === "grid"
                  ? "bg-[#1E232F] text-blue-400"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
              title="Card grid view"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content: Table or Grid */}
      {isFiltering ? (
        <ShimmerCardSkeleton count={6} />
      ) : filteredCompetitors.length === 0 ? (
        <div className="p-12 text-center rounded-xl bg-[#111318] border border-[#262A33] space-y-3">
          <Building2 className="w-8 h-8 text-zinc-600 mx-auto" />
          <p className="text-sm text-zinc-400">
            No competitors match your active query.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setThreatFilter("ALL");
            }}
            className="text-xs text-blue-400 hover:underline"
          >
            Reset filters
          </button>
        </div>
      ) : viewMode === "table" ? (
        <ScrollReveal direction="up" delayMs={50}>
          <CompetitorTable competitors={filteredCompetitors} />
        </ScrollReveal>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCompetitors.map((c, idx) => (
            <ScrollReveal key={c.id} direction="up" delayMs={idx * 60}>
              <CompetitorCard competitor={c} rank={idx + 1} />
            </ScrollReveal>
          ))}
        </div>
      )}
    </div>
  );
}
