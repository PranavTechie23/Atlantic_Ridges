"use client";

import React, { useState } from "react";
import {
  Filter,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  Code,
  Sparkles,
  Layers,
  Sliders,
  RefreshCw,
  Eye,
  Info,
} from "lucide-react";

interface DiffTestCase {
  id: string;
  title: string;
  type: "noise" | "signal";
  category: "pricing" | "features" | "boilerplate" | "tokens";
  description: string;
  rawBefore: string;
  rawAfter: string;
  normalizedBefore: string;
  normalizedAfter: string;
  rawDiffTokens: string[];
  noiseTokens: string[];
  semanticDelta: string;
  significanceScore: number;
  decision: "SUPPRESSED_NOISE" | "CRITICAL_SIGNAL" | "HIGH_SIGNAL";
  explanation: string;
}

const TEST_CASES: DiffTestCase[] = [
  {
    id: "tc-copyright-noise",
    title: "1. Footer Copyright & Session Nonce (Boilerplate Noise)",
    type: "noise",
    category: "boilerplate",
    description: "Webpage changed copyright year from 2025 to 2026 and regenerated a dynamic anti-CSRF session token in a hidden form input.",
    rawBefore: `<footer class="site-footer">\n  <input type="hidden" name="__csrf" value="tok_98247a19ffb" />\n  <script src="https://analytics.io/pixel.js?v=4.2.1"></script>\n  <p>© 2025 Acme Inc. All rights reserved.</p>\n</footer>`,
    rawAfter: `<footer class="site-footer">\n  <input type="hidden" name="__csrf" value="tok_41872bc890a" />\n  <script src="https://analytics.io/pixel.js?v=4.2.2"></script>\n  <p>© 2026 Acme Inc. All rights reserved.</p>\n</footer>`,
    normalizedBefore: `{ "entity": "footer", "content": "Acme Inc. All rights reserved." }`,
    normalizedAfter: `{ "entity": "footer", "content": "Acme Inc. All rights reserved." }`,
    rawDiffTokens: ["tok_98247a19ffb -> tok_41872bc890a", "v=4.2.1 -> v=4.2.2", "2025 -> 2026"],
    noiseTokens: ["__csrf (Ephemeral session token)", "pixel.js version query", "Copyright year rollover"],
    semanticDelta: "Zero commercial or product change detected after noise filtration.",
    significanceScore: 2,
    decision: "SUPPRESSED_NOISE",
    explanation: "Normalized AST matches previous baseline with 100% semantic identity. Filter heuristics strip ephemeral nonces, tracking scripts, and copyright date rollovers. No notification dispatched.",
  },
  {
    id: "tc-pricing-signal",
    title: "2. Strategic Pricing Hike on Pro Tier (+30%)",
    type: "signal",
    category: "pricing",
    description: "Competitor increased pricing on their core Pro plan from ₹999 to ₹1,299 per month while preserving plan deliverables.",
    rawBefore: `<div class="tier-card" data-plan="pro">\n  <h3 class="plan-name">Pro Tier</h3>\n  <div class="pricing-box">\n    <span class="currency">₹</span><span class="amount">999</span><span class="period">/month</span>\n  </div>\n  <ul class="features"><li>10,000 API calls</li></ul>\n</div>`,
    rawAfter: `<div class="tier-card" data-plan="pro">\n  <h3 class="plan-name">Pro Tier</h3>\n  <div class="pricing-box">\n    <span class="currency">₹</span><span class="amount">1,299</span><span class="period">/month</span>\n  </div>\n  <ul class="features"><li>10,000 API calls</li></ul>\n</div>`,
    normalizedBefore: `{\n  "entity": "pricing_tier",\n  "plan": "Pro",\n  "currency": "INR",\n  "price": 999,\n  "billing": "monthly",\n  "allowance": "10000 API calls"\n}`,
    normalizedAfter: `{\n  "entity": "pricing_tier",\n  "plan": "Pro",\n  "currency": "INR",\n  "price": 1299,\n  "billing": "monthly",\n  "allowance": "10000 API calls"\n}`,
    rawDiffTokens: ["999 -> 1,299 (+30.0%)"],
    noiseTokens: [],
    semanticDelta: "Entity: Pro Plan price mutated from 999 to 1299 (+30.0%). Currency: INR.",
    significanceScore: 94,
    decision: "CRITICAL_SIGNAL",
    explanation: "Pricing entity numeric difference exceeds the >10% threshold. Classified as CRITICAL_SIGNAL. Dispatches instant alert and stores cryptographic SHA-256 evidence item.",
  },
  {
    id: "tc-feature-launch",
    title: "3. Stealth Feature Drop (Autonomous AI Agents)",
    type: "signal",
    category: "features",
    description: "Competitor quietly appended an autonomous reasoning agent feature to their enterprise capability checklist.",
    rawBefore: `<div class="capabilities-list">\n  <div class="item">Automated Code Linting</div>\n  <div class="item">GitHub Action Trigger</div>\n</div>`,
    rawAfter: `<div class="capabilities-list">\n  <div class="item">Automated Code Linting</div>\n  <div class="item">GitHub Action Trigger</div>\n  <div class="item new-badge">Autonomous Multi-Agent Copilot with Reasoning Tokens</div>\n</div>`,
    normalizedBefore: `{\n  "entity": "feature_matrix",\n  "features": ["Automated Code Linting", "GitHub Action Trigger"]\n}`,
    normalizedAfter: `{\n  "entity": "feature_matrix",\n  "features": ["Automated Code Linting", "GitHub Action Trigger", "Autonomous Multi-Agent Copilot with Reasoning Tokens"]\n}`,
    rawDiffTokens: ["+ Autonomous Multi-Agent Copilot with Reasoning Tokens"],
    noiseTokens: ["new-badge class token"],
    semanticDelta: "Feature Entity added: 'Autonomous Multi-Agent Copilot with Reasoning Tokens'.",
    significanceScore: 89,
    decision: "HIGH_SIGNAL",
    explanation: "Identified new high-value capability keyword vector (Agentic, Copilot, Reasoning). Feature velocity score incremented; comparison matrix updated automatically.",
  },
  {
    id: "tc-cookie-banner",
    title: "4. Cookie Consent & Tag Manager Script Injection",
    type: "noise",
    category: "tokens",
    description: "Third-party OneTrust cookie banner script updated and injected dynamic tracking beacons into the DOM header.",
    rawBefore: `<div id="onetrust-consent-sdk" data-version="8.1.0">\n  <button class="onetrust-close-btn-handler">Accept</button>\n</div>`,
    rawAfter: `<div id="onetrust-consent-sdk" data-version="8.2.4">\n  <button class="onetrust-close-btn-handler">Accept All Cookies</button>\n  <script>window.dataLayer.push({'gtm.start': 17612349182});</script>\n</div>`,
    normalizedBefore: `<!-- Sanitized: Zero Business Content -->`,
    normalizedAfter: `<!-- Sanitized: Zero Business Content -->`,
    rawDiffTokens: ["8.1.0 -> 8.2.4", "Accept -> Accept All Cookies", "dataLayer.push"],
    noiseTokens: ["OneTrust banner wrapper", "gtm.start dynamic timestamp", "Cookie consent UI string"],
    semanticDelta: "Zero business entity detected. Tag classified under heuristic filter list [onetrust, consent, gtm, dataLayer].",
    significanceScore: 1,
    decision: "SUPPRESSED_NOISE",
    explanation: "Completely discarded by Stage 2 Preprocessor before AST comparison. Preserves system resources and avoids polluting intelligence digests.",
  },
];

export default function DiffEnginePage() {
  const [selectedCase, setSelectedCase] = useState<DiffTestCase>(TEST_CASES[0]);

  // Interactive toggle states
  const [stripNonces, setStripNonces] = useState(true);
  const [stripTracking, setStripTracking] = useState(true);
  const [stripCopyright, setStripCopyright] = useState(true);
  const [enableAstNormalization, setEnableAstNormalization] = useState(true);
  const [thresholdScore, setThresholdScore] = useState(60);

  // Dynamic calculation based on active toggles
  const effectiveScore = selectedCase.type === "noise" && (!stripNonces || !stripCopyright)
    ? 68 // Without filters, noise would be mistaken for a false positive!
    : selectedCase.significanceScore;

  const isSuppressed = effectiveScore < thresholdScore;

  return (
    <div className="space-y-8 pb-20 max-w-6xl mx-auto">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20">
            HACKNOVA &apos;26 REQUIREMENT 6
          </span>
          <span className="text-zinc-500">·</span>
          <span className="text-xs text-zinc-400 font-mono">
            Noise vs. Semantic Signal Separation Architecture
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F5F7FA] tracking-tight">
          Change Detection & Noise-Filtering Engine
        </h1>
        <p className="text-sm text-zinc-400 leading-relaxed max-w-3xl">
          Constraint: <em>&quot;The system should distinguish meaningful changes from minor or irrelevant webpage modifications.&quot;</em> Test how PRYSM strips ephemeral web nonces, tracking scripts, and boilerplate changes to isolate true strategic signals.
        </p>
      </div>

      {/* Case Selector Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {TEST_CASES.map((tc) => {
          const isSelected = selectedCase.id === tc.id;
          return (
            <button
              key={tc.id}
              onClick={() => setSelectedCase(tc)}
              className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                isSelected
                  ? "bg-blue-600/15 border-blue-500/50 shadow-md ring-1 ring-blue-500/30"
                  : "bg-[#111318] border-[#262A33] hover:border-zinc-700"
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span
                  className={`px-1.5 py-0.2 rounded text-[10px] font-mono uppercase font-bold ${
                    tc.type === "noise"
                      ? "bg-zinc-800 text-zinc-400 border border-zinc-700"
                      : "bg-red-500/15 text-red-400 border border-red-500/30"
                  }`}
                >
                  {tc.type === "noise" ? "Noise Test" : "Strategic Signal"}
                </span>
                <span className="text-xs font-mono font-semibold text-zinc-300">
                  Score: {tc.significanceScore}/100
                </span>
              </div>
              <h3 className={`text-xs font-bold line-clamp-1 ${isSelected ? "text-blue-300" : "text-zinc-200"}`}>
                {tc.title}
              </h3>
              <p className="text-[11px] text-zinc-400 mt-1 line-clamp-2">
                {tc.description}
              </p>
            </button>
          );
        })}
      </div>

      {/* Interactive Controls & Filters Panel */}
      <div className="p-5 rounded-xl bg-[#111318] border border-[#262A33] space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#262A33] pb-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-200 font-mono">
            <Sliders className="w-4 h-4 text-blue-400" />
            <span>Interactive Noise-Filter Layer Controls</span>
          </div>
          <span className="text-[11px] text-zinc-400">
            Toggle filter layers below to observe how the significance score recalculates
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <label className="flex items-center gap-2.5 p-2.5 rounded-lg bg-[#0C0E12] border border-[#262A33] cursor-pointer hover:border-zinc-700 transition-colors">
            <input
              type="checkbox"
              checked={stripNonces}
              onChange={(e) => setStripNonces(e.target.checked)}
              className="rounded border-zinc-700 text-blue-600 focus:ring-0"
            />
            <span className="text-zinc-300">Strip CSRF & Session Nonces</span>
          </label>

          <label className="flex items-center gap-2.5 p-2.5 rounded-lg bg-[#0C0E12] border border-[#262A33] cursor-pointer hover:border-zinc-700 transition-colors">
            <input
              type="checkbox"
              checked={stripTracking}
              onChange={(e) => setStripTracking(e.target.checked)}
              className="rounded border-zinc-700 text-blue-600 focus:ring-0"
            />
            <span className="text-zinc-300">Strip Google Tag & Analytics</span>
          </label>

          <label className="flex items-center gap-2.5 p-2.5 rounded-lg bg-[#0C0E12] border border-[#262A33] cursor-pointer hover:border-zinc-700 transition-colors">
            <input
              type="checkbox"
              checked={stripCopyright}
              onChange={(e) => setStripCopyright(e.target.checked)}
              className="rounded border-zinc-700 text-blue-600 focus:ring-0"
            />
            <span className="text-zinc-300">Filter Copyright Year Rollovers</span>
          </label>

          <label className="flex items-center gap-2.5 p-2.5 rounded-lg bg-[#0C0E12] border border-[#262A33] cursor-pointer hover:border-zinc-700 transition-colors">
            <input
              type="checkbox"
              checked={enableAstNormalization}
              onChange={(e) => setEnableAstNormalization(e.target.checked)}
              className="rounded border-zinc-700 text-blue-600 focus:ring-0"
            />
            <span className="text-zinc-300">Entity AST Normalization</span>
          </label>
        </div>

        {/* Threshold Slider */}
        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <span className="text-zinc-400 font-mono uppercase text-[11px]">
              Significance Threshold for Alert Dispatch:
            </span>
            <span className="font-mono font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/30">
              ≥ {thresholdScore} / 100
            </span>
          </div>
          <input
            type="range"
            min={20}
            max={90}
            value={thresholdScore}
            onChange={(e) => setThresholdScore(Number(e.target.value))}
            className="w-full sm:w-64 accent-blue-500 cursor-pointer"
          />
        </div>
      </div>

      {/* Side-by-side Visual Inspection Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Raw HTML DOM Diff */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-5 rounded-xl bg-[#111318] border border-[#262A33] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2 font-mono">
                <Code className="w-4 h-4 text-blue-400" />
                Raw Ingested HTML (Pre-Filter)
              </span>
              <span className="text-[10px] font-mono text-zinc-500">Unfiltered DOM</span>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div className="p-3 rounded-lg bg-[#0C0E12] border border-red-500/20 space-y-1">
                <span className="text-[10px] text-red-400 uppercase font-bold block">Previous Snapshot</span>
                <pre className="text-zinc-400 overflow-x-auto p-2 bg-black/40 rounded text-[11px] leading-relaxed">
                  {selectedCase.rawBefore}
                </pre>
              </div>

              <div className="p-3 rounded-lg bg-[#0C0E12] border border-emerald-500/20 space-y-1">
                <span className="text-[10px] text-emerald-400 uppercase font-bold block">Revised Snapshot</span>
                <pre className="text-zinc-200 overflow-x-auto p-2 bg-black/40 rounded text-[11px] leading-relaxed">
                  {selectedCase.rawAfter}
                </pre>
              </div>
            </div>

            {selectedCase.noiseTokens.length > 0 && (
              <div className="pt-2 border-t border-[#1D212B] space-y-1.5">
                <span className="text-[10px] font-mono uppercase text-amber-400 block font-bold">
                  Identified Noise Vectors (Targeted for Elimination):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedCase.noiseTokens.map((tok, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/10 text-amber-300 border border-amber-500/20"
                    >
                      {tok}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Normalized Semantic AST & Decision */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-5 rounded-xl bg-[#111318] border border-[#262A33] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2 font-mono">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                Normalized Semantic Entity AST
              </span>
              <span className="text-[10px] font-mono text-emerald-400 font-semibold">
                Post-Filter Stage
              </span>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div className="p-3 rounded-lg bg-[#0C0E12] border border-[#262A33] space-y-1">
                <span className="text-[10px] text-zinc-400 uppercase font-bold block">Sanitized Normalized State</span>
                <pre className="text-zinc-200 overflow-x-auto p-2 bg-black/40 rounded text-[11px] leading-relaxed">
                  {selectedCase.normalizedAfter}
                </pre>
              </div>

              <div className="p-3.5 rounded-lg bg-[#0C0E12] border border-[#262A33] space-y-1">
                <span className="text-[10px] text-blue-400 uppercase font-bold block">Computed Semantic Delta</span>
                <p className="text-xs text-zinc-300 font-sans leading-relaxed">
                  {selectedCase.semanticDelta}
                </p>
              </div>
            </div>

            {/* Decision Banner */}
            <div
              className={`p-4 rounded-xl border text-xs space-y-2 ${
                isSuppressed
                  ? "bg-zinc-900 border-zinc-700 text-zinc-300"
                  : "bg-red-500/15 border-red-500/40 text-red-200"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold font-mono uppercase tracking-wider">
                  {isSuppressed ? (
                    <>
                      <ShieldCheck className="w-4 h-4 text-zinc-400" />
                      <span className="text-zinc-300">Action: Suppressed (Noise Discarded)</span>
                    </>
                  ) : (
                    <>
                      <ShieldAlert className="w-4 h-4 text-red-400" />
                      <span className="text-red-300">Action: Strategic Signal Dispatched</span>
                    </>
                  )}
                </div>
                <span className="font-mono font-bold text-sm">
                  Score: {effectiveScore}/100
                </span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                {selectedCase.explanation}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
