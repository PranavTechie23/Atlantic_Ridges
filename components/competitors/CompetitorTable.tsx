"use client";

import React from "react";
import { Competitor } from "../../lib/types";
import { ThreatScoreBadge } from "../ui/ThreatScoreBadge";
import { StatusBadge } from "../ui/Badge";
import { ArrowRight, TrendingUp, TrendingDown, Clock, ShieldAlert } from "lucide-react";
import Link from "next/link";

export function CompetitorTable({ competitors }: { competitors: Competitor[] }) {
  return (
    <div className="rounded-xl border border-[#262A33] bg-[#111318] overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#14171E] border-b border-[#262A33] text-zinc-400 uppercase font-mono text-[10px] tracking-wider">
            <tr>
              <th className="py-3 px-4 font-semibold">Competitor</th>
              <th className="py-3 px-3 font-semibold">Threat Score</th>
              <th className="py-3 px-3 font-semibold">Pricing</th>
              <th className="py-3 px-3 font-semibold">Feature Velocity</th>
              <th className="py-3 px-3 font-semibold">AI Capability</th>
              <th className="py-3 px-4 font-semibold">Latest Meaningful Change</th>
              <th className="py-3 px-3 font-semibold">Last Scan</th>
              <th className="py-3 px-3 font-semibold">Status</th>
              <th className="py-3 px-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1D212B]">
            {competitors.map((c, idx) => (
              <tr
                key={c.id}
                className="hover:bg-[#161922] transition-colors group cursor-pointer"
              >
                {/* Competitor Logo & Name */}
                <td className="py-3.5 px-4">
                  <Link
                    href={`/competitors/${c.id}`}
                    className="flex items-center gap-2.5"
                  >
                    <span className="w-7 h-7 rounded-lg bg-[#1D212B] border border-zinc-800 flex items-center justify-center font-mono font-bold text-xs text-zinc-200 group-hover:border-blue-500/50 group-hover:text-blue-400 transition-colors">
                      {c.logoText}
                    </span>
                    <div>
                      <div className="font-semibold text-zinc-100 group-hover:text-blue-400 transition-colors flex items-center gap-1.5">
                        <span>{c.name}</span>
                        <span className="text-[10px] font-mono text-zinc-500">#{idx + 1}</span>
                      </div>
                      <div className="text-[11px] text-zinc-500 truncate max-w-[140px]">
                        {c.category}
                      </div>
                    </div>
                  </Link>
                </td>

                {/* Threat Score */}
                <td className="py-3.5 px-3">
                  <div className="flex items-center gap-1.5">
                    <ThreatScoreBadge score={c.threatScore} size="sm" showLabel={false} />
                    {c.trend === "up" ? (
                      <TrendingUp className="w-3 h-3 text-amber-400" />
                    ) : (
                      <TrendingDown className="w-3 h-3 text-emerald-400" />
                    )}
                  </div>
                </td>

                {/* Pricing Pressure */}
                <td className="py-3.5 px-3 font-mono">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-zinc-200">{c.metrics.pricingPressure}</span>
                    <div className="w-12 h-1.5 rounded-full bg-[#1A1D26] overflow-hidden hidden sm:block">
                      <div
                        className="h-full bg-amber-400"
                        style={{ width: `${c.metrics.pricingPressure}%` }}
                      />
                    </div>
                  </div>
                </td>

                {/* Feature Velocity */}
                <td className="py-3.5 px-3 font-mono">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-zinc-200">{c.metrics.featureVelocity}</span>
                    <div className="w-12 h-1.5 rounded-full bg-[#1A1D26] overflow-hidden hidden sm:block">
                      <div
                        className="h-full bg-blue-500"
                        style={{ width: `${c.metrics.featureVelocity}%` }}
                      />
                    </div>
                  </div>
                </td>

                {/* AI Capability */}
                <td className="py-3.5 px-3 font-mono">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-zinc-200">{c.metrics.aiCapability}</span>
                    <div className="w-12 h-1.5 rounded-full bg-[#1A1D26] overflow-hidden hidden sm:block">
                      <div
                        className="h-full bg-indigo-500"
                        style={{ width: `${c.metrics.aiCapability}%` }}
                      />
                    </div>
                  </div>
                </td>

                {/* Latest Change */}
                <td className="py-3.5 px-4 max-w-xs">
                  <div className="text-zinc-200 font-medium line-clamp-1 group-hover:text-zinc-100">
                    {c.latestChange.title}
                  </div>
                  <div className="text-[10px] text-zinc-500 font-mono">
                    Category: {c.latestChange.category}
                  </div>
                </td>

                {/* Last Scan */}
                <td className="py-3.5 px-3 text-zinc-500 font-mono text-[11px] whitespace-nowrap">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-zinc-600" />
                    <span>{c.lastScanTime}</span>
                  </div>
                </td>

                {/* Status */}
                <td className="py-3.5 px-3 whitespace-nowrap">
                  <StatusBadge status={c.monitoringStatus === "active" ? "active" : "paused"} />
                </td>

                {/* Action */}
                <td className="py-3.5 px-3 text-right">
                  <Link
                    href={`/competitors/${c.id}`}
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-blue-400 hover:bg-[#1F232D] inline-flex items-center gap-1 transition-colors"
                    title={`View ${c.name} Profile`}
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
