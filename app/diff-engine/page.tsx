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
  const noiseFiltersEnabled = stripNonces && stripTracking && stripCopyright && enableAstNormalization;
  const effectiveScore = selectedCase.type === "noise" && !noiseFiltersEnabled
    ? 68
    : selectedCase.significanceScore;

  const isSuppressed = effectiveScore < thresholdScore;

  return (
    <div className="space-y-8 pb-20 max-w-6xl mx-auto">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20">
            CHANGE ANALYSIS WORKBENCH
          </span>
          <span className="text-app-muted">·</span>
          <span className="text-xs text-app-secondary font-mono">
            Explore how page changes can be interpreted
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-app-primary tracking-tight">
          Change Detection & Noise-Filtering Engine
        </h1>
        <p className="text-sm text-app-secondary leading-relaxed max-w-3xl">
          Compare prepared page-change examples and see how noise-filter settings affect their illustrative priority. This interactive prototype uses predefined cases; it does not analyze a live webpage.
        </p>
      </div>

      <div className="flex items-start gap-3 rounded-xl border border-blue-500/20 bg-blue-500/[0.06] px-4 py-3 text-xs text-app-secondary">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />
        <p><span className="font-semibold text-app-primary">How to use this page:</span> choose an example, inspect the before/after content, then adjust the filters and alert threshold. Scores and outcomes are illustrative demo values.</p>
      </div>

      {/* Case Selector Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
        {TEST_CASES.map((tc) => {
          const isSelected = selectedCase.id === tc.id;
          return (
            <button
              key={tc.id}
              onClick={() => setSelectedCase(tc)}
              className={`min-w-0 p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                isSelected
                  ? "bg-blue-600/15 border-blue-500/50 shadow-md ring-1 ring-blue-500/30"
                  : "bg-surface-primary border-app hover:border-blue-400 dark:hover:border-zinc-700"
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <span
                  className={`px-1.5 py-0.2 rounded text-[10px] font-mono uppercase font-bold ${
                    tc.type === "noise"
                      ? "bg-slate-100 text-slate-600 border border-slate-200 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700"
                      : "bg-red-50 text-red-700 border border-red-200 dark:bg-red-500/15 dark:text-red-400 dark:border-red-500/30"
                  }`}
                >
                  {tc.type === "noise" ? "Noise Test" : "Strategic Signal"}
                </span>
                <span className="text-xs font-mono font-semibold text-app-secondary">
                  Example score: {tc.significanceScore}/100
                </span>
              </div>
              <h3 className={`text-xs font-bold leading-snug line-clamp-2 min-h-8 ${isSelected ? "text-blue-700 dark:text-blue-300" : "text-app-primary"}`}>
                {tc.title}
              </h3>
              <p className="text-[11px] text-app-secondary mt-1 line-clamp-2">
                {tc.description}
              </p>
            </button>
          );
        })}
      </div>

      {/* Interactive Controls & Filters Panel */}
      <div className="p-5 rounded-xl bg-surface-primary border border-app space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-app pb-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-app-primary font-mono">
            <Sliders className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>Interactive Noise-Filter Layer Controls</span>
          </div>
          <span className="text-[11px] text-app-muted">
            Toggle filter layers below to observe how the significance score recalculates
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 text-xs">
          <label className="flex items-center gap-2.5 p-2.5 rounded-lg bg-surface-secondary border border-app cursor-pointer hover:border-blue-400 transition-colors">
            <input
              type="checkbox"
              checked={stripNonces}
              onChange={(e) => setStripNonces(e.target.checked)}
              className="rounded border-slate-300 dark:border-zinc-700 text-blue-600 focus:ring-0"
            />
            <span className="text-app-secondary">Strip CSRF & Session Nonces</span>
          </label>

          <label className="flex items-center gap-2.5 p-2.5 rounded-lg bg-surface-secondary border border-app cursor-pointer hover:border-blue-400 transition-colors">
            <input
              type="checkbox"
              checked={stripTracking}
              onChange={(e) => setStripTracking(e.target.checked)}
              className="rounded border-slate-300 dark:border-zinc-700 text-blue-600 focus:ring-0"
            />
            <span className="text-app-secondary">Strip Google Tag & Analytics</span>
          </label>

          <label className="flex items-center gap-2.5 p-2.5 rounded-lg bg-surface-secondary border border-app cursor-pointer hover:border-blue-400 transition-colors">
            <input
              type="checkbox"
              checked={stripCopyright}
              onChange={(e) => setStripCopyright(e.target.checked)}
              className="rounded border-slate-300 dark:border-zinc-700 text-blue-600 focus:ring-0"
            />
            <span className="text-app-secondary">Filter Copyright Year Rollovers</span>
          </label>

          <label className="flex items-center gap-2.5 p-2.5 rounded-lg bg-surface-secondary border border-app cursor-pointer hover:border-blue-400 transition-colors">
            <input
              type="checkbox"
              checked={enableAstNormalization}
              onChange={(e) => setEnableAstNormalization(e.target.checked)}
              className="rounded border-slate-300 dark:border-zinc-700 text-blue-600 focus:ring-0"
            />
            <span className="text-app-secondary">Entity AST Normalization</span>
          </label>
        </div>

        {/* Threshold Slider */}
        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <span className="text-app-secondary font-mono uppercase text-[11px]">
              Illustrative Alert Threshold:
            </span>
            <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 dark:text-blue-400 dark:bg-blue-500/10 dark:border-blue-500/30">
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
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 items-start">
        {/* Left: Raw HTML DOM Diff */}
        <div className="min-w-0 space-y-4">
          <div className="p-5 rounded-xl bg-surface-primary border border-app space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-app-primary flex items-center gap-2 font-mono">
                <Code className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                Example Page Content (Before Filtering)
              </span>
              <span className="text-[10px] font-mono text-app-muted">Prepared example</span>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div className="p-3 rounded-lg bg-red-50/70 dark:bg-red-950/20 border border-red-200 dark:border-red-500/20 space-y-1">
                <span className="text-[10px] text-red-700 dark:text-red-400 uppercase font-bold block">Previous Snapshot</span>
                <pre className="text-app-secondary overflow-x-auto whitespace-pre-wrap break-words p-3 bg-surface-secondary rounded-lg text-[11px] leading-relaxed max-h-64">
                  {selectedCase.rawBefore}
                </pre>
              </div>

              <div className="p-3 rounded-lg bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-500/20 space-y-1">
                <span className="text-[10px] text-emerald-700 dark:text-emerald-400 uppercase font-bold block">Revised Snapshot</span>
                <pre className="text-app-primary overflow-x-auto whitespace-pre-wrap break-words p-3 bg-surface-secondary rounded-lg text-[11px] leading-relaxed max-h-64">
                  {selectedCase.rawAfter}
                </pre>
              </div>
            </div>

            {selectedCase.noiseTokens.length > 0 && (
              <div className="pt-3 border-t border-app space-y-1.5">
                <span className="text-[10px] font-mono uppercase text-amber-700 dark:text-amber-400 block font-bold">
                  Identified Noise Vectors (Targeted for Elimination):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedCase.noiseTokens.map((tok, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-50 text-amber-800 border border-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/20"
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
        <div className="min-w-0 space-y-4">
          <div className="p-5 rounded-xl bg-surface-primary border border-app space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-app-primary flex items-center gap-2 font-mono">
                <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                Example Normalized Output
              </span>
              <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400 font-semibold">
                Illustrative result
              </span>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div className="p-3 rounded-lg bg-surface-secondary border border-app space-y-1">
                <span className="text-[10px] text-app-muted uppercase font-bold block">{enableAstNormalization ? "Example normalized state" : "Normalization disabled · raw example"}</span>
                <pre className="text-app-primary overflow-x-auto whitespace-pre-wrap break-words p-3 bg-surface-secondary rounded-lg text-[11px] leading-relaxed max-h-64">
                  {enableAstNormalization ? selectedCase.normalizedAfter : selectedCase.rawAfter}
                </pre>
              </div>

              <div className="p-3.5 rounded-lg bg-surface-secondary border border-app space-y-1">
                <span className="text-[10px] text-blue-700 dark:text-blue-400 uppercase font-bold block">Example Change Summary</span>
                <p className="text-xs text-app-secondary font-sans leading-relaxed">
                  {selectedCase.semanticDelta}
                </p>
              </div>
            </div>

            {/* Decision Banner */}
            <div
              className={`p-4 rounded-xl border text-xs space-y-2 ${
                isSuppressed
                  ? "bg-slate-100 border-slate-200 text-slate-700 dark:bg-zinc-900 dark:border-zinc-700 dark:text-zinc-300"
                  : "bg-red-50 border-red-200 text-red-800 dark:bg-red-500/15 dark:border-red-500/40 dark:text-red-200"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold font-mono uppercase tracking-wider">
                  {isSuppressed ? (
                    <>
                      <ShieldCheck className="w-4 h-4 text-slate-500 dark:text-zinc-400" />
                      <span>Outcome: Below alert threshold</span>
                    </>
                  ) : (
                    <>
                      <ShieldAlert className="w-4 h-4 text-red-600 dark:text-red-400" />
                      <span>Outcome: Meets alert threshold</span>
                    </>
                  )}
                </div>
                <span className="font-mono font-bold text-sm">
                  Score: {effectiveScore}/100
                </span>
              </div>
              <p className="text-xs text-app-secondary leading-relaxed font-sans">
                {isSuppressed
                  ? `Illustrative outcome: this case falls below the current alert threshold (${thresholdScore}/100).`
                  : `Illustrative outcome: this case meets the current alert threshold (${thresholdScore}/100).`}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
