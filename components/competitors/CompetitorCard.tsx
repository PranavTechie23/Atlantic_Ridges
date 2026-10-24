"use client";

import React from "react";
import { Competitor } from "../../lib/types";
import { ThreatScoreBadge } from "../ui/ThreatScoreBadge";
import { StatusBadge } from "../ui/Badge";
import { ArrowRight, Clock, TrendingUp, TrendingDown, ExternalLink, Bot } from "lucide-react";
import Link from "next/link";
import { useApp } from "../../lib/context/AppContext";

export function CompetitorCard({
  competitor,
  rank,
}: {
  competitor: Competitor;
  rank?: number;
}) {
  const { openChatWithPrompt } = useApp();
  return (
    <div className="p-5 sm:p-6 rounded-xl bg-[#111318] border border-[#262A33] hover:border-blue-500/40 hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between group shadow-xs hover:shadow-lg relative overflow-hidden">
      {/* Top subtle highlight gradient on hover */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-linear-to-r from-transparent via-blue-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#181B22] border border-[#262A33] flex items-center justify-center font-mono font-bold text-sm text-zinc-100 group-hover:border-blue-500/50 group-hover:text-blue-400 group-hover:scale-105 transition-all shadow-xs">
              {competitor.logoText}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <Link
                  href={`/competitors/${competitor.id}`}
                  className="text-base font-bold text-zinc-100 hover:text-blue-400 transition-colors flex items-center gap-1"
                >
                  <span>{competitor.name}</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                </Link>
                {typeof rank === "number" && (
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#1A1D26] text-zinc-400 border border-zinc-700/40">
                    #{rank}
                  </span>
                )}
              </div>
              <div className="text-xs text-zinc-400 font-medium">{competitor.category}</div>
            </div>
          </div>

          <StatusBadge status={competitor.monitoringStatus === "active" ? "active" : "paused"} />
        </div>

        <p className="mt-3 text-xs text-zinc-400 line-clamp-2 leading-relaxed">
          {competitor.tagline}
        </p>

        {/* Threat Score & Trend */}
        <div className="mt-4 p-3 rounded-lg bg-[#0C0E12] border border-[#262A33] flex items-center justify-between shadow-2xs">
          <div className="space-y-0.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-semibold">
              Threat Score
            </span>
            <div>
              <ThreatScoreBadge score={competitor.threatScore} size="sm" showLabel={true} />
            </div>
          </div>

          <div className="text-right space-y-0.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-semibold">
              Velocity
            </span>
            <div className="flex items-center justify-end gap-1 text-xs font-mono font-bold">
              {competitor.trend === "up" ? (
                <span className="text-amber-400 flex items-center gap-0.5">
                  <TrendingUp className="w-3 h-3" />
                  +{competitor.trendDelta} pts
                </span>
              ) : (
                <span className="text-emerald-400 flex items-center gap-0.5">
                  <TrendingDown className="w-3 h-3" />
                  {competitor.trendDelta} pts
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Breakdown progress metrics */}
        <div className="mt-3.5 grid grid-cols-2 gap-2 text-[11px]">
          <div className="p-2.5 rounded-lg bg-[#14171E] border border-[#262A33]">
            <span className="text-zinc-500 block text-[10px] font-mono uppercase">Pricing Pressure</span>
            <span className="font-mono font-bold text-zinc-200 text-xs">
              {competitor.metrics.pricingPressure}/100
            </span>
          </div>
          <div className="p-2.5 rounded-lg bg-[#14171E] border border-[#262A33]">
            <span className="text-zinc-500 block text-[10px] font-mono uppercase">Feature Velocity</span>
            <span className="font-mono font-bold text-zinc-200 text-xs">
              {competitor.metrics.featureVelocity}/100
            </span>
          </div>
        </div>

        {/* Latest Detected Change */}
        <div className="mt-3.5 space-y-1">
          <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-semibold">
            Latest Movement
          </span>
          <div className="text-xs text-zinc-300 line-clamp-2 leading-relaxed font-medium">
            {competitor.latestChange.title}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-5 pt-3 border-t border-[#1F232D] flex items-center justify-between text-xs text-zinc-500 font-mono">
        <span className="flex items-center gap-1 text-[11px]">
          <Clock className="w-3 h-3 text-zinc-500" />
          {competitor.lastScanTime}
        </span>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => openChatWithPrompt(`Analyze ${competitor.name}'s current threat level, recent pricing/feature mutations, and counter-tactics.`)}
            className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 hover:scale-105 transition-transform cursor-pointer"
            title={`Ask PRYSM AI Copilot about ${competitor.name}`}
          >
            <Bot className="w-3 h-3" />
            <span className="hidden sm:inline">Ask AI</span>
          </button>
          <Link
            href={`/competitors/${competitor.id}`}
            className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
          >
            <span>Profile</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
