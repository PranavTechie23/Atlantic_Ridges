"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Activity,
  Shield,
  ShieldCheck,
  ArrowUpRight,
  Zap,
  TrendingUp,
  Lock,
  Layers,
  Sparkles,
  ExternalLink,
  CheckCircle2,
} from "lucide-react";
import { BorderBeam } from "../ui/BorderBeam";

interface SignalPreview {
  id: string;
  competitor: string;
  category: string;
  severity: string;
  severityColor: string;
  title: string;
  summary: string;
  before: string;
  after: string;
  delta: string;
  date: string;
  confidence: number;
  hash: string;
  url: string;
  chartX: number;
  chartY: number;
}

const SIGNALS: SignalPreview[] = [
  {
    id: "acme-pricing",
    competitor: "ACME CLOUD",
    category: "PRICING SHIFT",
    severity: "HIGH IMPACT",
    severityColor: "text-rose-400 bg-rose-500/10 border-rose-500/20",
    title: "Pro plan price increased by 30%",
    summary: "AST semantic diff detected core tier price hike and user seat cap enforcement across public pricing table.",
    before: "₹999 / mo · Unlimited seats",
    after: "₹1,299 / mo · 5 seats max (+₹199/seat)",
    delta: "+30.0% Price Jump · Seat Caps Enforced",
    date: "OCT 23, 2026",
    confidence: 94,
    hash: "sha256: 7f3b8a...e29a01",
    url: "acmecloud.io/pricing",
    chartX: 540,
    chartY: 26,
  },
  {
    id: "hyperscale-ai",
    competitor: "HYPERSCALE AI",
    category: "FEATURE LAUNCH",
    severity: "CRITICAL",
    severityColor: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    title: "Autonomous Copilot v2 deployed",
    summary: "Changelog and documentation AST parser revealed new reasoning-agent API endpoints and enterprise SLA tier.",
    before: "Manual prompt workflows only",
    after: "Autonomous multi-agent orchestration v2",
    delta: "Tier 1 Feature Disruption",
    date: "OCT 15, 2026",
    confidence: 98,
    hash: "sha256: c41d20...89b142",
    url: "hyperscale.ai/changelog",
    chartX: 360,
    chartY: 42,
  },
  {
    id: "datapulse-sla",
    competitor: "DATAPULSE",
    category: "TERMS REVISION",
    severity: "STRATEGIC",
    severityColor: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
    title: "Enterprise uptime SLA lowered to 99.0%",
    summary: "Legal terms of service revision identified subtle degradation of credit penalty and response times.",
    before: "99.95% availability (4hr response)",
    after: "99.00% availability (24hr response)",
    delta: "Competitive Wedge: -0.95% SLA",
    date: "OCT 08, 2026",
    confidence: 91,
    hash: "sha256: 3a9ef2...f01c77",
    url: "datapulse.io/legal/sla",
    chartX: 180,
    chartY: 65,
  },
];

export function HeroPreviewCard() {
  const [activeIdx, setActiveIdx] = useState(0);
  const current = SIGNALS[activeIdx];

  return (
    <div className="landing-preview relative w-full max-w-5xl mt-6 text-left">
      {/* Ambient background glow */}
      <div className="landing-preview-glow pointer-events-none absolute -inset-8 rounded-[2.5rem] blur-3xl opacity-75 dark:opacity-100" />

      {/* Floating Satellite Badge 1 (Top-Right): Live Ingestion Stream */}
      <div className="hidden lg:flex items-center gap-2.5 absolute -top-4 -right-4 z-20 px-3.5 py-1.5 rounded-full bg-slate-900/95 border border-blue-500/30 text-white shadow-xl shadow-blue-500/15 backdrop-blur-md animate-bounce duration-1000">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
        </span>
        <span className="font-mono text-[11px] font-medium tracking-tight">
          <span className="text-blue-400 font-semibold">3 changes</span> verified today
        </span>
      </div>

      {/* Floating Satellite Badge 2 (Bottom-Right): SHA-256 Verification Badge */}
      <div className="hidden md:flex items-center gap-2 absolute -bottom-3 -right-2 z-20 px-3 py-1.5 rounded-xl bg-slate-950/90 border border-emerald-500/30 text-emerald-300 shadow-xl shadow-emerald-500/10 backdrop-blur-md">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
        <span className="font-mono text-[10px] tracking-wide text-slate-300">
          SHA-256 Ledger: <span className="text-emerald-400 font-semibold">100% Cryptographic Proof</span>
        </span>
      </div>

      {/* Main Window Frame */}
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#090d18]/95 shadow-[0_35px_100px_-35px_rgba(37,99,235,0.45)] backdrop-blur-2xl">
        {/* Subtle Animated Glowing Border */}
        <BorderBeam size={320} duration={12} colorFrom="#38bdf8" colorTo="#818cf8" borderWidth={1.5} />

        {/* Window Title Bar */}
        <div className="flex items-center justify-between border-b border-white/[0.08] px-4 py-3 sm:px-6 bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <i className="h-2.5 w-2.5 rounded-full bg-red-400/80 inline-block" />
              <i className="h-2.5 w-2.5 rounded-full bg-amber-300/80 inline-block" />
              <i className="h-2.5 w-2.5 rounded-full bg-emerald-400/80 inline-block" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[11px] font-semibold tracking-[0.18em] text-slate-300">
                PRYSM / COMMAND CENTER
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[9px] font-mono bg-blue-500/15 text-blue-400 border border-blue-500/25">
                v2.6 AST ENGINE
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/25 bg-emerald-400/[0.08] px-2.5 py-1 font-mono text-[9px] uppercase tracking-wider text-emerald-300">
              <i className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
              Live monitoring
            </span>
          </div>
        </div>

        {/* Main Content: Two Columns */}
        <div className="grid gap-5 p-4 sm:p-6 lg:grid-cols-[1.2fr_1fr]">
          {/* LEFT COLUMN: Telemetry & Activity Chart */}
          <div className="space-y-4">
            {/* Top KPI row */}
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { n: "12", suffix: "+", l: "Competitors", sub: "Monitored 24/7" },
                { n: "38", suffix: "+", l: "Signals found", sub: "Semantic diffs" },
                { n: "94", suffix: "%", l: "Avg. confidence", sub: "AST verified" },
              ].map((kpi) => (
                <div
                  key={kpi.l}
                  className="rounded-xl border border-white/[0.08] bg-white/[0.035] p-3 sm:p-4 hover:border-blue-500/30 transition-colors"
                >
                  <div className="font-mono text-xl sm:text-2xl font-bold tracking-tight text-white flex items-baseline gap-0.5">
                    {kpi.n}
                    <span className="text-blue-400 text-lg font-normal">{kpi.suffix}</span>
                  </div>
                  <div className="mt-1 text-[9px] sm:text-[10px] uppercase font-semibold tracking-[0.12em] text-slate-400">
                    {kpi.l}
                  </div>
                  <div className="text-[9px] text-slate-500 hidden sm:block mt-0.5">{kpi.sub}</div>
                </div>
              ))}
            </div>

            {/* Signal Activity Chart */}
            <div className="rounded-xl border border-white/[0.08] bg-white/[0.025] p-4 sm:p-5 relative overflow-hidden">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
                    <Activity className="h-3.5 w-3.5 text-blue-400" />
                    Market signal activity
                  </div>
                  <div className="mt-1 text-[10px] text-slate-400">
                    Competitive moves detected over time · Click dates to inspect
                  </div>
                </div>
                <span className="font-mono text-[9px] text-blue-400 font-semibold bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                  LAST 30 DAYS
                </span>
              </div>

              {/* Chart SVG with Interactive Hotspots */}
              <div className="landing-chart relative h-32 overflow-hidden rounded-lg border border-white/[0.04]">
                <div className="absolute inset-0 landing-chart-grid" />
                <svg viewBox="0 0 600 120" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
                  <defs>
                    <linearGradient id="signalFill" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity=".38" />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="signalLine" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#38bdf8" />
                      <stop offset="50%" stopColor="#818cf8" />
                      <stop offset="100%" stopColor="#ec4899" />
                    </linearGradient>
                  </defs>

                  {/* Shaded Area */}
                  <path
                    d="M0 94 C42 88 47 72 90 78 S144 92 180 65 S230 72 270 56 S324 68 360 42 S415 66 450 48 S500 59 540 26 S575 42 600 15 V120 H0Z"
                    fill="url(#signalFill)"
                  />

                  {/* Spline Path */}
                  <path
                    d="M0 94 C42 88 47 72 90 78 S144 92 180 65 S230 72 270 56 S324 68 360 42 S415 66 450 48 S500 59 540 26 S575 42 600 15"
                    fill="none"
                    stroke="url(#signalLine)"
                    strokeWidth="2.5"
                    vectorEffect="non-scaling-stroke"
                  />

                  {/* Static Chart points */}
                  <circle cx="180" cy="65" r="3.5" fill="#818cf8" stroke="#090d18" strokeWidth="2" />
                  <circle cx="360" cy="42" r="3.5" fill="#a855f7" stroke="#090d18" strokeWidth="2" />
                  <circle cx="540" cy="26" r="4.5" fill="#38bdf8" stroke="#090d18" strokeWidth="2" />

                  {/* Active Highlight Marker Ring */}
                  <circle
                    cx={current.chartX}
                    cy={current.chartY}
                    r="8"
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="1.5"
                    className="animate-ping"
                    style={{ transformOrigin: `${current.chartX}px ${current.chartY}px` }}
                  />
                  <circle
                    cx={current.chartX}
                    cy={current.chartY}
                    r="5"
                    fill="#38bdf8"
                    stroke="#ffffff"
                    strokeWidth="2"
                  />
                </svg>
              </div>

              {/* Chart Date Tabs (Interactive!) */}
              <div className="mt-3 flex justify-between font-mono text-[9px] text-slate-400">
                <button
                  type="button"
                  onClick={() => setActiveIdx(0)}
                  className="hover:text-white transition-colors"
                >
                  OCT 01
                </button>
                <button
                  type="button"
                  onClick={() => setActiveIdx(2)}
                  className={`px-1.5 py-0.5 rounded transition-all ${
                    activeIdx === 2
                      ? "bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/30"
                      : "hover:text-white"
                  }`}
                >
                  OCT 08 (SLA Move)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveIdx(1)}
                  className={`px-1.5 py-0.5 rounded transition-all ${
                    activeIdx === 1
                      ? "bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30"
                      : "hover:text-white"
                  }`}
                >
                  OCT 15 (Copilot Launch)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveIdx(0)}
                  className={`px-1.5 py-0.5 rounded transition-all ${
                    activeIdx === 0
                      ? "bg-blue-500/20 text-blue-300 font-semibold border border-blue-500/30"
                      : "hover:text-white"
                  }`}
                >
                  OCT 23 (Price +30%)
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Priority Intelligence & AST Semantic Diff (Bracketed in User Screenshot!) */}
          <div className="flex flex-col rounded-xl border border-rose-300/20 bg-linear-to-br from-rose-500/[0.09] via-indigo-500/[0.04] to-transparent p-4 sm:p-5 relative shadow-lg">
            {/* Interactive Signal Switcher Tabs */}
            <div className="flex items-center gap-1.5 p-1 rounded-lg bg-black/40 border border-white/[0.06] mb-3.5">
              {SIGNALS.map((sig, idx) => (
                <button
                  key={sig.id}
                  type="button"
                  onClick={() => setActiveIdx(idx)}
                  className={`flex-1 text-center py-1 px-2 rounded-md font-mono text-[10px] transition-all duration-200 truncate ${
                    activeIdx === idx
                      ? "bg-white/10 text-white font-semibold shadow-sm border border-white/10"
                      : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]"
                  }`}
                >
                  {sig.competitor.split(" ")[0]}
                </button>
              ))}
            </div>

            {/* Header info */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.16em] text-rose-300">
                  {current.category}
                </span>
                <span className="text-slate-600 text-xs">·</span>
                <span className="font-mono text-[9px] text-slate-400">{current.date}</span>
              </div>
              <span
                className={`rounded-md border px-2 py-0.5 font-mono text-[9px] font-semibold tracking-wide ${current.severityColor}`}
              >
                {current.severity}
              </span>
            </div>

            {/* Competitor domain badge */}
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
              <span className="font-semibold text-slate-200">{current.competitor}</span>
              <span className="text-slate-600">/</span>
              <span className="font-mono text-[10px] text-slate-400 truncate flex items-center gap-1">
                {current.url}
                <ExternalLink className="h-2.5 w-2.5 text-slate-500" />
              </span>
            </div>

            {/* Main Title & Summary */}
            <h3 className="mt-2 text-base sm:text-lg font-semibold leading-snug text-white">
              {current.title}
            </h3>
            <p className="mt-1 text-xs leading-relaxed text-slate-300">
              {current.summary}
            </p>

            {/* AST Semantic Diff Box (Before vs After) */}
            <div className="mt-3.5 rounded-lg border border-white/[0.08] bg-black/40 p-3 space-y-2">
              <div className="flex items-center justify-between text-[10px] font-mono">
                <span className="text-slate-400 flex items-center gap-1">
                  <Layers className="h-3 w-3 text-blue-400" /> AST Semantic Diff
                </span>
                <span className="text-amber-300 font-semibold bg-amber-500/10 px-1.5 py-0.2 rounded border border-amber-500/20 text-[9px]">
                  {current.delta}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                {/* Before Box */}
                <div className="rounded border border-red-500/20 bg-red-500/[0.06] p-2">
                  <div className="text-[9px] font-mono uppercase text-red-400 font-semibold mb-0.5">
                    − Baseline
                  </div>
                  <div className="font-mono text-[11px] text-red-200 leading-tight">
                    {current.before}
                  </div>
                </div>

                {/* After Box */}
                <div className="rounded border border-emerald-500/25 bg-emerald-500/[0.08] p-2">
                  <div className="text-[9px] font-mono uppercase text-emerald-400 font-semibold mb-0.5">
                    + Detected Move
                  </div>
                  <div className="font-mono text-[11px] text-emerald-200 font-medium leading-tight">
                    {current.after}
                  </div>
                </div>
              </div>

              {/* Cryptographic Proof row */}
              <div className="pt-2 border-t border-white/[0.06] flex flex-wrap items-center justify-between text-[10px] gap-2">
                <div className="flex items-center gap-1.5 text-slate-400">
                  <ShieldCheck className="h-3 w-3 text-emerald-400" />
                  <span className="font-mono text-emerald-300">{current.confidence}% confidence</span>
                </div>
                <span className="font-mono text-[9px] text-slate-500 bg-white/[0.04] px-1.5 py-0.5 rounded border border-white/[0.06]">
                  {current.hash}
                </span>
              </div>
            </div>

            {/* CTAs / Links inside card */}
            <div className="mt-3.5 pt-3 border-t border-white/[0.08] flex items-center justify-between">
              <Link
                href="/diff-engine"
                className="inline-flex items-center gap-1 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
              >
                Inspect full AST diff <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
              <Link
                href="/demo"
                className="text-[11px] font-mono text-slate-400 hover:text-white px-2 py-1 rounded bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] transition-all"
              >
                Rehearse pipeline →
              </Link>
            </div>
          </div>
        </div>

        {/* Window Bottom Status Bar */}
        <div className="flex items-center justify-between border-t border-white/[0.07] px-4 py-2.5 sm:px-6 bg-black/20">
          <span className="font-mono text-[9px] text-slate-500 flex items-center gap-2">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
            EVIDENCE FIRST · EVERY CLAIM CRYPTOGRAPHICALLY DATED & HASHED
          </span>
          <span className="hidden font-mono text-[9px] text-slate-500 sm:block">
            RFC 9309 PERMITTED CRAWL · ZERO DOM HALLUCINATIONS
          </span>
        </div>
      </div>
    </div>
  );
}
