"use client";

import React, { useState } from "react";
import { DollarSign, Clock, TrendingUp, Zap, Sparkles, ShieldCheck, ChevronRight } from "lucide-react";
import { AnimatedCounter } from "../ui/AnimatedCounter";
import { sounds } from "../../lib/utils/sound";

export function RoiCalculator() {
  const [competitors, setCompetitors] = useState<number>(12);
  const [analystHourlyRate, setAnalystHourlyRate] = useState<number>(85);
  const [checkFrequencyDays, setCheckFrequencyDays] = useState<number>(7);

  // Math:
  // Manual competitor monitoring: ~3 hours per competitor per week across pricing, docs, features, blogs
  const weeklyAnalystHours = competitors * 3;
  const annualHoursSaved = Math.round(weeklyAnalystHours * 52 * 0.92); // 92% automated
  const annualCostSavings = Math.round(annualHoursSaved * analystHourlyRate);
  
  // Speedup: Manual average reaction latency = 14 days; PRYSM = ~4 minutes
  const speedupFactor = "99.8%";

  // Churn protection: 1 deal saved per year per 6 competitors monitored
  const dealsProtected = Math.max(1, Math.round(competitors / 6));
  const estimatedRevenueProtected = dealsProtected * 45000; // $45k average ACV

  const handleCompetitorChange = (val: number) => {
    setCompetitors(val);
    sounds.playTick();
  };

  const handleRateChange = (val: number) => {
    setAnalystHourlyRate(val);
    sounds.playTick();
  };

  return (
    <div className="p-6 sm:p-8 rounded-2xl bg-[#0D0F14] border border-[#262A33] shadow-2xl space-y-6 relative overflow-hidden">
      {/* Decorative ambient gradient */}
      <div className="absolute -top-12 -right-12 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              STRATEGIC ROI CALCULATOR
            </span>
            <span className="text-zinc-600">·</span>
            <span className="text-xs text-zinc-400 font-mono">Enterprise Efficiency Benchmark</span>
          </div>
          <h2 className="text-xl font-bold text-zinc-100 tracking-tight">
            Quantify Strategic Impact & Time-to-Action
          </h2>
          <p className="text-xs text-zinc-400 mt-1 max-w-xl">
            Simulate how continuous automated surveillance displaces manual web checks, eliminates competitor blindspots, and prevents lost enterprise deals.
          </p>
        </div>

        <div className="p-2.5 rounded-xl bg-[#14171E] border border-[#262A33] text-right shrink-0">
          <span className="text-[10px] font-mono uppercase text-zinc-500 block">Surveillance Speedup</span>
          <span className="text-base font-extrabold font-mono text-emerald-400">14 Days → 4 Mins</span>
        </div>
      </div>

      {/* Interactive Controls Sliders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 rounded-xl bg-[#111318] border border-[#262A33]">
        {/* Competitor count slider */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-zinc-300 font-medium">Monitored Competitors</span>
            <span className="font-mono font-bold text-blue-400 text-sm">{competitors} entities</span>
          </div>
          <input
            type="range"
            min={3}
            max={50}
            step={1}
            value={competitors}
            onChange={(e) => handleCompetitorChange(Number(e.target.value))}
            className="w-full accent-blue-500 h-1.5 bg-[#1E232E] rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[10px] font-mono text-zinc-500">
            <span>3 (Seed)</span>
            <span>25 (Growth)</span>
            <span>50 (Global Enterprise)</span>
          </div>
        </div>

        {/* Analyst hourly rate slider */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-zinc-300 font-medium">Blended Analyst / Strategist Rate</span>
            <span className="font-mono font-bold text-emerald-400 text-sm">${analystHourlyRate} / hr</span>
          </div>
          <input
            type="range"
            min={40}
            max={250}
            step={5}
            value={analystHourlyRate}
            onChange={(e) => handleRateChange(Number(e.target.value))}
            className="w-full accent-emerald-500 h-1.5 bg-[#1E232E] rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[10px] font-mono text-zinc-500">
            <span>$40 / hr</span>
            <span>$120 / hr</span>
            <span>$250 / hr</span>
          </div>
        </div>
      </div>

      {/* Reactive ROI Output Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Annual Analyst Hours Saved */}
        <div className="p-4 rounded-xl bg-[#111318] border border-[#262A33] hover:border-blue-500/40 transition-colors">
          <div className="flex items-center justify-between text-zinc-500 mb-2">
            <span className="text-[10px] font-mono uppercase tracking-wider">Annual Time Saved</span>
            <Clock className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black font-mono text-zinc-100">
            <AnimatedCounter value={annualHoursSaved} suffix=" hrs" />
          </div>
          <p className="text-[11px] text-zinc-400 mt-1">
            Replaces {(weeklyAnalystHours).toFixed(0)}h/wk of manual webpage reading
          </p>
        </div>

        {/* Annual Labor Cost Saved */}
        <div className="p-4 rounded-xl bg-[#111318] border border-[#262A33] hover:border-emerald-500/40 transition-colors">
          <div className="flex items-center justify-between text-zinc-500 mb-2">
            <span className="text-[10px] font-mono uppercase tracking-wider">Annual Cost Saved</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black font-mono text-emerald-400">
            $<AnimatedCounter value={annualCostSavings} />
          </div>
          <p className="text-[11px] text-zinc-400 mt-1">
            Straight-line operational savings on manual research
          </p>
        </div>

        {/* Strategic Latency Reduction */}
        <div className="p-4 rounded-xl bg-[#111318] border border-[#262A33] hover:border-amber-500/40 transition-colors">
          <div className="flex items-center justify-between text-zinc-500 mb-2">
            <span className="text-[10px] font-mono uppercase tracking-wider">Detection Latency</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black font-mono text-amber-400">
            {speedupFactor}
          </div>
          <p className="text-[11px] text-zinc-400 mt-1">
            Detect moves before competitors finish marketing rollouts
          </p>
        </div>

        {/* Protected Annual Deal Pipeline */}
        <div className="p-4 rounded-xl bg-[#111318] border border-[#262A33] hover:border-purple-500/40 transition-colors">
          <div className="flex items-center justify-between text-zinc-500 mb-2">
            <span className="text-[10px] font-mono uppercase tracking-wider">ARR Protected</span>
            <ShieldCheck className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black font-mono text-purple-300">
            $<AnimatedCounter value={estimatedRevenueProtected} />
          </div>
          <p className="text-[11px] text-zinc-400 mt-1">
            ~{dealsProtected} enterprise renewals safeguarded via timely counter-offers
          </p>
        </div>
      </div>

      {/* Comparison Timeline: Manual vs PRYSM */}
      <div className="p-4 rounded-xl bg-[#0C0E12] border border-[#262A33] space-y-3 text-xs">
        <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500 font-bold block">
          Incident Timeline: Competitor +30% Price Surge Response
        </span>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-3 rounded-lg bg-[#14171E] border border-red-500/20 space-y-1.5">
            <div className="flex items-center justify-between font-bold text-red-400">
              <span>Manual Workflow</span>
              <span className="font-mono text-[11px]">~14 Days Avg.</span>
            </div>
            <p className="text-zinc-400 text-[11px] leading-relaxed">
              Day 1: Competitor updates pricing quietly. Day 6: Customer mentions it on sales call. Day 11: Analyst manually checks Wayback snapshots. Day 14: Sales enablement memo distributed (deal lost).
            </p>
          </div>

          <div className="p-3 rounded-lg bg-[#14171E] border border-emerald-500/30 space-y-1.5">
            <div className="flex items-center justify-between font-bold text-emerald-400">
              <span>PRYSM Autonomous Agent</span>
              <span className="font-mono text-[11px]">~4 Minutes</span>
            </div>
            <p className="text-zinc-300 text-[11px] leading-relaxed">
              Min 0: DOM crawler detects $79 → $109 diff. Min 1: AST noise filter validates pricing node. Min 2: Merkle hash generated. Min 4: Alert dispatched to Slack & sales playbook auto-generated.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
