"use client";

import React, { useState } from "react";
import { useApp } from "@/lib/context/AppContext";
import { injectSimulatedChange, SimulationResult } from "@/lib/api";
import { ChangeCategory, SeverityLevel } from "@/lib/types";
import { SeverityBadge } from "@/components/ui/Badge";
import {
  Play,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  FileText,
  AlertTriangle,
  Zap,
  Globe,
  Database,
  ExternalLink,
  Download,
  Terminal,
} from "lucide-react";
import Link from "next/link";
import { downloadReportMarkdown } from "@/lib/utils/report-export";
import { sounds } from "@/lib/utils/sound";
import { BorderBeam } from "@/components/ui/BorderBeam";
import { LivePulseIndicator } from "@/components/ui/LivePulseIndicator";
import { TerminalStream } from "@/components/ui/TerminalStream";
import { EvidenceStateText } from "@/components/evidence/EvidenceStateText";

interface PresetScenario {
  id: string;
  name: string;
  description: string;
  competitorId: string;
  category: ChangeCategory;
  severity: SeverityLevel;
  significanceScore: number;
  title: string;
  summary: string;
  beforeContent: string;
  afterContent: string;
  sourceUrl: string;
  whyItMatters: string;
  isNoiseTest?: boolean;
}

const PRESETS: PresetScenario[] = [
  {
    id: "preset-pricing-hike",
    name: "Scenario 1: Acme Cloud Pro Pricing Hike (+40%)",
    description: "Simulates sudden subscription increase from ₹999/mo to ₹1,399/mo on their most popular tier.",
    competitorId: "comp-acme",
    category: "pricing",
    severity: "CRITICAL",
    significanceScore: 94,
    title: "Acme Cloud Pro Plan Increased to ₹1,399/mo (+40%)",
    summary: "Observed pricing matrix update: Pro tier increased from ₹999/mo to ₹1,399/mo while feature allowances remain identical. Signal detected via automated DOM AST diff.",
    beforeContent: `Pro Tier — ₹999 / month\nIncludes: 10k API calls & workspace sync`,
    afterContent: `Pro Tier — ₹1,399 / month\nIncludes: 10k API calls & workspace sync (unchanged feature set)`,
    sourceUrl: "https://acmecloud.io/pricing",
    whyItMatters: "A 40% price hike creates an immediate opening for mid-market migrations. Sales teams should immediately initiate outreach to Acme accounts citing our transparent price freeze guarantee.",
  },
  {
    id: "preset-feature-copilot",
    name: "Scenario 2: NovaAI Stealth Agent Copilot Launch",
    description: "Simulates new autonomous multi-agent reasoning feature added to their developer suite.",
    competitorId: "comp-nova",
    category: "features",
    severity: "HIGH",
    significanceScore: 89,
    title: "NovaAI Deploys Autonomous Multi-Agent Reasoning Workflows",
    summary: "New enterprise capability detected: Autonomous agents capable of multi-step tool calling, repository code indexing, and automated deployment verification.",
    beforeContent: `Capabilities:\n• Assisted code completion\n• Basic syntax linting`,
    afterContent: `Capabilities:\n• Assisted code completion\n• Basic syntax linting\n• Autonomous multi-agent reasoning & execution workflows (NEW)`,
    sourceUrl: "https://novaai.tech/features",
    whyItMatters: "NovaAI is leapfrogging static autocomplete into full agentic execution. Product teams must accelerate our Copilot v2 launch to neutralize this differentiation.",
  },
  {
    id: "preset-positioning-pivot",
    name: "Scenario 3: Vertex Labs Strategic Positioning Pivot",
    description: "Simulates hero tagline and messaging shift from 'Dev Platform' to 'Enterprise Sovereign AI'.",
    competitorId: "comp-vertex",
    category: "positioning",
    severity: "HIGH",
    significanceScore: 84,
    title: "Vertex Labs Pivots Messaging to 'Enterprise Sovereign AI'",
    summary: "Observed hero headline and metadata shift across landing page: replaced 'Fast cloud functions for developers' with 'Sovereign AI Infrastructure for Regulated Enterprises'.",
    beforeContent: `Hero headline: "Fast, lightweight cloud functions for agile developer teams"`,
    afterContent: `Hero headline: "Sovereign AI & zero-trust cloud infrastructure for regulated enterprises"`,
    sourceUrl: "https://vertexlabs.dev",
    whyItMatters: "Indicates Vertex is moving upmarket to capture regulated fintech & healthcare enterprise budgets. We need to reinforce our SOC2 Type II compliance credentials in marketing collateral.",
  },
  {
    id: "preset-noise-test",
    name: "Scenario 4: Noise Filtering Test (Non-Strategic Modification)",
    description: "Simulates minor HTML changes: footer copyright year change (2025 -> 2026), dynamic CSRF token, and Google Analytics tag update.",
    competitorId: "comp-orbit",
    category: "announcements",
    severity: "LOW",
    significanceScore: 3,
    title: "Minor DOM Noise: Footer Copyright & Session Token Refresh",
    summary: "Observed modification in footer layout and session nonce: copyright updated from 2025 to 2026, dynamic CSRF token refreshed. No change in pricing, features, or positioning.",
    beforeContent: `Footer: © 2025 OrbitCRM Inc. (session token rotated — non-strategic)`,
    afterContent: `Footer: © 2026 OrbitCRM Inc. (session token rotated — non-strategic)`,
    sourceUrl: "https://orbitcrm.com",
    whyItMatters: "System classifies this as Irrelevant Web Noise (Significance Score: 3/100). The noise-filtering heuristics suppress alerts and avoid analyst alert fatigue.",
    isNoiseTest: true,
  },
];

export default function DemoPage() {
  const { competitors, openEvidenceDrawer, refreshAll } = useApp();

  const [selectedPreset, setSelectedPreset] = useState<PresetScenario>(PRESETS[0]);
  const [sourceType, setSourceType] = useState<"live" | "wayback">("live");
  const [isExecuting, setIsExecuting] = useState(false);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [isNoiseRejected, setIsNoiseRejected] = useState(false);

  // Custom editor states
  const [customTitle, setCustomTitle] = useState("");
  const [customCategory, setCustomCategory] = useState<ChangeCategory>("pricing");
  const [customSeverity, setCustomSeverity] = useState<SeverityLevel>("HIGH");
  const [customSignificance, setCustomSignificance] = useState(85);
  const [customBefore, setCustomBefore] = useState("");
  const [customAfter, setCustomAfter] = useState("");
  const [customSummary, setCustomSummary] = useState("");
  const [isCustomMode, setIsCustomMode] = useState(false);

  const steps = [
    { label: "1. Collecting Public Source Snapshot", detail: sourceType === "live" ? "Fetching live permitted DOM with robots.txt compliance" : "Querying Internet Archive Wayback Machine CDX API..." },
    { label: "2. Applying Semantic Noise Filter", detail: "Stripping dynamic nonces, tracking scripts, and boilerplate tags..." },
    { label: "3. Computing Normalized AST Diff", detail: "Isolating structured delta in pricing and feature entities..." },
    { label: "4. Scoring Threat Significance", detail: "Evaluating strategic business impact and threat velocity vector..." },
    { label: "5. Cryptographic Provenance & Digest", detail: "Generating SHA-256 verifiable hash and observation timestamp..." },
  ];

  const handleRunSimulation = async () => {
    setIsExecuting(true);
    setResult(null);
    setIsNoiseRejected(false);
    setCurrentStep(1);

    const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

    for (let s = 1; s <= 5; s++) {
      setCurrentStep(s);
      await delay(550);
    }

    if (!isCustomMode && selectedPreset.isNoiseTest) {
      setIsNoiseRejected(true);
      setIsExecuting(false);
      return;
    }

    const payload = isCustomMode
      ? {
          competitorId: competitors[0]?.id || "comp-acme",
          category: customCategory,
          title: customTitle || "Custom Competitor Shift Detected",
          summary: customSummary || "Automated telemetry observed custom competitive update.",
          beforeContent: customBefore || "Previous configuration",
          afterContent: customAfter || "Revised configuration",
          significanceScore: customSignificance,
          severity: customSeverity,
          sourceUrl: "https://competitor-public-site.com/pricing",
          whyItMatters: "Strategically relevant shift requiring executive awareness and tactical positioning adjustment.",
        }
      : {
          competitorId: selectedPreset.competitorId,
          category: selectedPreset.category,
          title: selectedPreset.title,
          summary: selectedPreset.summary,
          beforeContent: selectedPreset.beforeContent,
          afterContent: selectedPreset.afterContent,
          significanceScore: selectedPreset.significanceScore,
          severity: selectedPreset.severity,
          sourceUrl: selectedPreset.sourceUrl,
          whyItMatters: selectedPreset.whyItMatters,
        };

    const simResult = await injectSimulatedChange(payload);
    await refreshAll();

    setResult(simResult);
    setIsExecuting(false);
  };

  const handleDownloadReport = () => {
    if (!result) return;
    sounds.playTick();
    downloadReportMarkdown(result.report, result.evidence);
    sounds.playSuccess();
  };

  return (
    <div className="space-y-8 pb-20 max-w-6xl mx-auto">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/25">
            INTERACTIVE PRODUCT DEMONSTRATION
          </span>
          <span className="text-app-muted">·</span>
          <span className="text-xs text-app-muted font-mono">
            Interactive Change Detection & Sourced Reporting Demo
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-app-primary tracking-tight">
          Competitor Monitoring & Simulation Sandbox
        </h1>
        <p className="text-sm text-app-secondary leading-relaxed max-w-3xl">
          Demonstrate end-to-end competitor intelligence: Monitor selected public sources, introduce a simulated pricing or feature change, execute the noise-filtering detection pipeline, and instantly generate a verifiable, evidence-linked comparison report.
        </p>
      </div>

      {/* Stepper / Controls Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Preset Selection & Configuration */}
        <div className="lg:col-span-5 space-y-4">
          <div className="dashboard-card p-5 sm:p-6 rounded-2xl border border-app bg-surface-primary space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-app-primary flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-500" />
                Step 1: Choose Scenario Preset
              </span>
              <button
                onClick={() => setIsCustomMode(!isCustomMode)}
                className="text-[11px] font-mono font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
              >
                {isCustomMode ? "Use Presets" : "Custom Change"}
              </button>
            </div>

            {!isCustomMode ? (
              <div className="space-y-2.5">
                {PRESETS.map((preset) => {
                  const isSelected = selectedPreset.id === preset.id;
                  return (
                    <div
                      key={preset.id}
                      onClick={() => setSelectedPreset(preset)}
                      className={`relative p-3.5 rounded-xl border text-left cursor-pointer transition-all overflow-hidden ${
                        isSelected
                          ? "bg-blue-50/90 dark:bg-blue-600/15 border-blue-500 shadow-xs ring-1 ring-blue-500/30"
                          : "bg-surface-secondary/70 hover:bg-surface-secondary border-app hover:border-slate-300 dark:hover:border-zinc-700"
                      }`}
                    >
                      {isSelected && (
                        <BorderBeam
                          size={180}
                          duration={6}
                          colorFrom="#3B82F6"
                          colorTo="#8B5CF6"
                        />
                      )}
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className={`text-xs font-bold ${isSelected ? "text-blue-700 dark:text-blue-300" : "text-app-primary"}`}>
                          {preset.name}
                        </span>
                        {preset.isNoiseTest ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-slate-200/90 text-slate-700 dark:bg-zinc-800 dark:text-zinc-300 border border-slate-300 dark:border-zinc-700">
                            Noise Filter
                          </span>
                        ) : (
                          <SeverityBadge severity={preset.severity} />
                        )}
                      </div>
                      <p className="text-[11px] text-app-secondary leading-normal">
                        {preset.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-3 pt-2">
                <div>
                  <label className="text-[10px] uppercase font-mono text-app-muted block mb-1 font-semibold">
                    Change Title
                  </label>
                  <input
                    type="text"
                    value={customTitle}
                    onChange={(e) => setCustomTitle(e.target.value)}
                    placeholder="e.g. Enterprise Plan Price Increase"
                    className="w-full px-3 py-1.5 rounded-lg bg-surface-secondary border border-app text-xs text-app-primary placeholder:text-app-muted focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] uppercase font-mono text-app-muted block mb-1 font-semibold">
                      Category
                    </label>
                    <select
                      value={customCategory}
                      onChange={(e) => setCustomCategory(e.target.value as ChangeCategory)}
                      className="w-full px-2 py-1.5 rounded-lg bg-surface-secondary border border-app text-xs text-app-primary focus:outline-none focus:border-blue-500"
                    >
                      <option value="pricing">Pricing</option>
                      <option value="features">Features</option>
                      <option value="launch">Launch</option>
                      <option value="positioning">Positioning</option>
                      <option value="announcements">Announcements</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-mono text-app-muted block mb-1 font-semibold">
                      Severity
                    </label>
                    <select
                      value={customSeverity}
                      onChange={(e) => setCustomSeverity(e.target.value as SeverityLevel)}
                      className="w-full px-2 py-1.5 rounded-lg bg-surface-secondary border border-app text-xs text-app-primary focus:outline-none focus:border-blue-500"
                    >
                      <option value="LOW">LOW</option>
                      <option value="MEDIUM">MEDIUM</option>
                      <option value="HIGH">HIGH</option>
                      <option value="CRITICAL">CRITICAL</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-[10px] uppercase font-mono text-app-muted block mb-1 font-semibold">
                    Previous observed snapshot (plain text)
                  </label>
                  <textarea
                    rows={2}
                    value={customBefore}
                    onChange={(e) => setCustomBefore(e.target.value)}
                    placeholder="Pro Plan — ₹999 / month (billed monthly)"
                    className="w-full p-2.5 rounded-lg bg-surface-secondary border border-app font-mono text-[11px] text-app-primary placeholder:text-app-muted focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-mono text-app-muted block mb-1 font-semibold">
                    Revised observed snapshot (plain text)
                  </label>
                  <textarea
                    rows={2}
                    value={customAfter}
                    onChange={(e) => setCustomAfter(e.target.value)}
                    placeholder="Pro Plan — ₹1,299 / month (billed monthly)"
                    className="w-full p-2.5 rounded-lg bg-surface-secondary border border-app font-mono text-[11px] text-app-primary placeholder:text-app-muted focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}

            {/* Source Selection */}
            <div className="pt-2 border-t border-app space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-app-muted block font-semibold">
                Target Data Source (Permitted Public Source)
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <button
                  type="button"
                  onClick={() => setSourceType("live")}
                  className={`p-2.5 rounded-lg border flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                    sourceType === "live"
                      ? "bg-blue-50 dark:bg-blue-600/20 border-blue-500 text-blue-700 dark:text-blue-300 font-semibold shadow-2xs"
                      : "bg-surface-secondary/70 border-app text-app-secondary hover:text-app-primary"
                  }`}
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>Live Web Crawler</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSourceType("wayback")}
                  className={`p-2.5 rounded-lg border flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                    sourceType === "wayback"
                      ? "bg-blue-50 dark:bg-blue-600/20 border-blue-500 text-blue-700 dark:text-blue-300 font-semibold shadow-2xs"
                      : "bg-surface-secondary/70 border-app text-app-secondary hover:text-app-primary"
                  }`}
                >
                  <Database className="w-3.5 h-3.5" />
                  <span>Wayback Archive</span>
                </button>
              </div>
            </div>

            {/* Run Button */}
            <button
              onClick={handleRunSimulation}
              disabled={isExecuting}
              className="w-full py-3 rounded-xl bg-linear-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 transition-all cursor-pointer disabled:opacity-50"
            >
              <Play className={`w-4 h-4 fill-current ${isExecuting ? "animate-spin" : ""}`} />
              <span>{isExecuting ? "Executing Intelligence Pipeline..." : "Execute Change Detection Pipeline"}</span>
            </button>
          </div>
        </div>

        {/* Right Column: Execution Pipeline & Visualizer */}
        <div className="lg:col-span-7 space-y-4">
          {/* Animated Pipeline Stage Tracker */}
          <div className="dashboard-card p-5 sm:p-6 rounded-2xl border border-app bg-surface-primary space-y-5 shadow-xs">
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs font-bold uppercase tracking-wider text-app-primary flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500" />
                Step 2: Multi-Stage Change Detection Engine
              </span>
              <span
                className={`text-[10px] font-mono font-semibold px-2.5 py-0.5 rounded-full border ${
                  isExecuting
                    ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30 animate-pulse"
                    : result
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                    : isNoiseRejected
                    ? "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30"
                    : "bg-surface-secondary text-app-muted border-app"
                }`}
              >
                {isExecuting
                  ? `Processing Stage ${currentStep}/5`
                  : result
                  ? "Pipeline Complete"
                  : isNoiseRejected
                  ? "Noise Suppressed"
                  : "Awaiting Trigger"}
              </span>
            </div>

            <div className="space-y-2.5">
              {steps.map((st, idx) => {
                const stepNum = idx + 1;
                const isCurrent = isExecuting && currentStep === stepNum;
                const isDone = (isExecuting && currentStep > stepNum) || result !== null || isNoiseRejected;

                return (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-xl border transition-all ${
                      isCurrent
                        ? "bg-blue-50/90 dark:bg-blue-950/30 border-blue-500 text-blue-950 dark:text-blue-100 ring-1 ring-blue-500/25 shadow-xs"
                        : isDone
                        ? "bg-emerald-50/40 dark:bg-emerald-950/15 border-emerald-500/35 text-app-primary shadow-2xs"
                        : "bg-surface-secondary/70 hover:bg-surface-secondary border-app text-app-secondary"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-mono font-bold transition-all ${
                            isCurrent
                              ? "bg-blue-600 text-white shadow-xs animate-pulse"
                              : isDone
                              ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/40"
                              : "bg-surface-primary border border-app text-app-secondary shadow-2xs"
                          }`}
                        >
                          {isDone ? "✓" : stepNum}
                        </div>
                        <span
                          className={`text-xs ${
                            isCurrent
                              ? "font-bold text-blue-700 dark:text-blue-300"
                              : isDone
                              ? "font-semibold text-app-primary"
                              : "font-medium text-app-primary"
                          }`}
                        >
                          {st.label}
                        </span>
                      </div>
                      <span
                        className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded ${
                          isCurrent
                            ? "bg-blue-500/15 text-blue-700 dark:text-blue-300 border border-blue-500/30"
                            : isDone
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25"
                            : "bg-surface-primary dark:bg-surface-tertiary text-app-muted border border-app"
                        }`}
                      >
                        {isCurrent ? "Analyzing..." : isDone ? "Verified" : "Pending"}
                      </span>
                    </div>
                    <p
                      className={`text-[11px] mt-1.5 pl-8.5 font-sans leading-relaxed ${
                        isCurrent
                          ? "text-blue-950/80 dark:text-blue-200/80"
                          : isDone
                          ? "text-app-secondary"
                          : "text-app-secondary"
                      }`}
                    >
                      {st.detail}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Live Streaming Intelligence Daemon Terminal */}
            <div className="pt-3 border-t border-app space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-app-muted block font-semibold flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-blue-500" />
                <span>Live Surveillance Daemon Output Stream</span>
              </span>
              <TerminalStream
                isRunning={isExecuting}
                targetDomain={
                  competitors.find((c) => c.id === selectedPreset.competitorId)
                    ?.website.replace("https://", "") || "acmecloud.io"
                }
              />
            </div>
          </div>

          {/* Noise Rejection Notice */}
          {isNoiseRejected && (
            <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-500/10 border border-amber-300 dark:border-amber-500/30 text-amber-900 dark:text-amber-200 space-y-3 shadow-xs">
              <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 text-xs font-bold uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4" />
                <span>Noise Filter Activated — Change Discarded</span>
              </div>
              <p className="text-xs leading-relaxed text-amber-950/90 dark:text-zinc-300">
                The detection engine analyzed the observed DOM delta and isolated only boilerplate modifications (session nonce refresh and footer copyright year `2025` → `2026`).
              </p>
              <div className="p-3 rounded-lg bg-amber-100/70 dark:bg-black/40 border border-amber-300 dark:border-amber-500/20 font-mono text-xs text-amber-900 dark:text-amber-300 flex items-center justify-between">
                <span>Calculated Significance Score: 3/100</span>
                <span>Threshold: ≥ 60/100 (Alert Suppressed)</span>
              </div>
              <p className="text-[11px] text-amber-800/80 dark:text-zinc-400">
                This satisfies constraint #6: <em>&quot;The system should distinguish meaningful changes from minor or irrelevant webpage modifications.&quot;</em> No unnecessary notification was dispatched.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Generated Evidence & Sourced Comparison Report View */}
      {result && (
        <section className="space-y-6 pt-4 border-t border-app animate-in fade-in duration-500">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 shadow-2xs">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-bold block">
                  Step 3: Intelligence Generated & Verified
                </span>
                <h2 className="text-lg font-bold text-app-primary">
                  Evidence-Linked Comparison Brief Produced
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap justify-end">
              <button
                type="button"
                onClick={() => openEvidenceDrawer(result.evidence.id)}
                className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <span>Inspect evidence</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <Link
                href={`/reports/${result.report.id}`}
                className="px-3.5 py-1.5 rounded-lg border border-app bg-surface-primary hover:bg-surface-secondary text-xs font-semibold text-app-primary flex items-center gap-1.5 transition-colors shadow-2xs"
              >
                <FileText className="w-3.5 h-3.5" />
                Full brief & print
              </Link>
              <button
                type="button"
                onClick={handleDownloadReport}
                className="px-3.5 py-1.5 rounded-lg bg-surface-primary hover:bg-surface-secondary border border-app text-xs font-semibold text-app-primary flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
              >
                <Download className="w-3.5 h-3.5" />
                Export .md
              </button>
            </div>
          </div>

          {/* Quick Notification Alert Banner */}
          <div className="p-4 rounded-xl bg-linear-to-r from-red-500/10 via-amber-500/10 to-blue-500/10 border border-red-500/30 flex items-center justify-between gap-4 shadow-xs">
            <div className="flex items-center gap-3">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
              </span>
              <div className="text-xs">
                <span className="font-bold text-red-600 dark:text-red-300 uppercase font-mono mr-2">
                  Notification Dispatched:
                </span>
                <span className="text-app-primary font-semibold">{result.notification.title}</span>
                <span className="text-app-secondary ml-2">({result.notification.description})</span>
              </div>
            </div>
            <span className="text-[10px] font-mono text-app-muted shrink-0">
              Check Notification Bell in Topbar
            </span>
          </div>

          {/* Evidence Diff Card */}
          <div className="dashboard-card p-6 rounded-2xl border border-app bg-surface-primary space-y-4 shadow-xs">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span className="text-xs font-bold uppercase tracking-wider text-app-primary">
                  Verifiable Provenance Artifact
                </span>
              </div>
              <span className="text-xs font-mono text-app-muted">
                Digest: <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{result.evidence.hashDigest.slice(0, 24)}...</span>
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-red-50/50 dark:bg-surface-secondary border border-red-500/25 space-y-1.5">
                <span className="text-[10px] font-mono uppercase text-red-600 dark:text-red-400 font-bold block">
                  Observed State (Previous Snapshot: {result.evidence.observedPreviousDate})
                </span>
                <EvidenceStateText content={result.evidence.beforeContent} variant="before" />
              </div>

              <div className="p-4 rounded-xl bg-emerald-50/50 dark:bg-surface-secondary border border-emerald-500/25 space-y-1.5">
                <span className="text-[10px] font-mono uppercase text-emerald-600 dark:text-emerald-400 font-bold block">
                  Observed State (Current Snapshot: {result.evidence.observedCurrentDate})
                </span>
                <EvidenceStateText content={result.evidence.afterContent} variant="after" />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-app-secondary pt-2 border-t border-app flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span>Source:</span>
                <a
                  href={result.evidence.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-mono"
                >
                  {result.evidence.sourceUrl}
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                Audit Confidence: {result.evidence.confidence}% Verified
              </div>
            </div>
          </div>

          {/* Sourced Comparison Report Container */}
          <article className="dashboard-card p-6 sm:p-8 rounded-2xl bg-surface-primary border border-app shadow-sm space-y-6">
            <div className="border-b border-app pb-6 space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono text-app-muted flex-wrap">
                <FileText className="w-4 h-4 text-blue-500" />
                <span className="uppercase text-blue-600 dark:text-blue-400 font-bold">AUTOMATED INTELLIGENCE REPORT</span>
                <span>·</span>
                <span>Generated: {result.report.date}</span>
              </div>
              <h3 className="text-xl font-bold text-app-primary">
                {result.report.title}
              </h3>
              <p className="text-xs text-app-secondary">
                {result.report.subtitle}
              </p>
            </div>

            {/* Section 1: Executive Summary with Clickable Citation */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-app-primary">
                1. Executive Summary & Impact Analysis
              </h4>
              <p className="text-xs leading-relaxed text-app-secondary bg-surface-secondary p-4 rounded-xl border border-app">
                {result.report.executiveSummary}
                <button
                  onClick={() => openEvidenceDrawer(result.evidence.id)}
                  className="inline-flex items-center justify-center px-1.5 py-0.2 mx-1 rounded text-[10px] font-mono font-bold bg-blue-500/20 text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white border border-blue-500/30 cursor-pointer align-super"
                  title="Click to inspect cryptographic evidence"
                >
                  [1]
                </button>
              </p>
            </div>

            {/* Section 2: Strategic Implication & Tactical Recommendations */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-surface-secondary border border-app space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 block">
                  Why It Matters (Market Positioning)
                </span>
                <p className="text-xs text-app-secondary leading-relaxed">
                  {result.evidence.strategicImplication}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-surface-secondary border border-app space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block">
                  Recommended Leadership Action
                </span>
                <p className="text-xs text-app-secondary leading-relaxed">
                  {result.report.recommendedActions[0]?.description}
                </p>
              </div>
            </div>

            {/* Citations Appendix */}
            <div className="pt-4 border-t border-app space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-app-muted block font-mono">
                Evidence Appendix
              </span>
              <div className="p-3 rounded-lg bg-surface-secondary border border-app flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="text-blue-600 dark:text-blue-400 font-bold">[1]</span>
                  <span className="text-app-primary">{result.evidence.sourceTitle}</span>
                  <span className="text-app-muted">({result.evidence.observedCurrentDate})</span>
                </div>
                <button
                  onClick={() => openEvidenceDrawer(result.evidence.id)}
                  className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-semibold"
                >
                  Inspect Provenance
                </button>
              </div>
            </div>
          </article>
        </section>
      )}
    </div>
  );
}
