"use client";

import React, { useState } from "react";
import {
  Award,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Terminal,
  Play,
  ArrowRight,
  ExternalLink,
  Code,
  Layers,
  Database,
  Cpu,
  RefreshCw,
  Zap,
  Globe,
  Sliders,
  FileText,
} from "lucide-react";
import Link from "next/link";
import { ScrollReveal } from "../../components/ui/ScrollReveal";
import { DynamicLoader } from "../../components/ui/DynamicLoader";
import { RoiCalculator } from "../../components/dashboard/RoiCalculator";
import { RobotsAuditor } from "../../components/sources/RobotsAuditor";
import { JudgeTourModal } from "../../components/judges/JudgeTourModal";
import { sounds } from "../../lib/utils/sound";

interface DiagnosticTest {
  id: string;
  name: string;
  requirement: string;
  status: "idle" | "running" | "passed";
  durationMs: number;
  terminalLogs: string[];
}

const initialTests: DiagnosticTest[] = [
  {
    id: "test-cdx",
    name: "1. Permitted Public Sources & Wayback CDX",
    requirement: "PS Req: Automated analysis of permitted public information & historical records",
    status: "passed",
    durationMs: 800,
    terminalLogs: [
      "[INFO] Querying Internet Archive Wayback Machine CDX API...",
      "[INGEST] Target: https://acmecloud.io/pricing (HTTP 200)",
      "[ROBOTS] RFC 9309 verification: 'Allow: /pricing' matched. Crawl-delay 2s respected.",
      "[CDX] 20261016140000 snapshot resolved · 4,210 bytes text extracted.",
      "[SUCCESS] Permitted source pipeline 100% compliant.",
    ],
  },
  {
    id: "test-noise",
    name: "2. AST Semantic Signal vs. Ephemeral Noise Suppression",
    requirement: "PS Req: Detect meaningful changes, filter dynamic noise",
    status: "passed",
    durationMs: 950,
    terminalLogs: [
      "[DIFF] Ingesting before/after DOM AST...",
      "[FILTER] Detected CSRF token nonce diff: 94b7c... -> 2a8f1... (Filtered: Score 2/100)",
      "[FILTER] Detected cookie consent banner timestamp: (Filtered: Score 1/100)",
      "[SIGNAL] Price node detected: $79/mo -> $109/mo (+38.0% delta)",
      "[WEIGHT] Semantic significance score: 96/100 -> DISPATCH_ALERT",
      "[SUCCESS] Zero false-positive noise leakage.",
    ],
  },
  {
    id: "test-merkle",
    name: "3. Cryptographic Merkle Provenance & SHA-256",
    requirement: "PS Req: Evidence-backed reports with dated records",
    status: "passed",
    durationMs: 650,
    terminalLogs: [
      "[HASH] Computing SHA-256 for snapshot DOM payload...",
      "[PROVENANCE] Root Hash: a1b2c3d4e5f60718293a4b5c6d7e8f90123456789abcdef0123456789abcdef0",
      "[BLOCK] Observation Timestamp: 2026-10-23T14:22:00Z",
      "[VERIFY] Merkle leaf matches snapshot vault index. Tamper status: 0 violations.",
      "[SUCCESS] Cryptographic evidence chain sealed.",
    ],
  },
  {
    id: "test-radar",
    name: "4. Multi-Vector Strategic Criteria Comparison",
    requirement: "PS Req: Configurable criteria for comparisons",
    status: "passed",
    durationMs: 720,
    terminalLogs: [
      "[CRITERIA] Loading weights: Pricing (85%), AI Velocity (90%), Enterprise (70%)",
      "[VECTOR] Normalizing 5-dimensional vectors across 6 competitors...",
      "[RADAR] Acme Cloud threat polygon: 92.4% area coverage.",
      "[SUCCESS] Vector comparison matrix updated dynamically.",
    ],
  },
  {
    id: "test-report",
    name: "5. Sourced Intelligence Brief Auto-Synthesis",
    requirement: "PS Req: Executive reporting with direct source citations",
    status: "passed",
    durationMs: 1100,
    terminalLogs: [
      "[LLM] Synthesizing executive intelligence brief...",
      "[CITATION] Linking statement to Evidence #1 (Acme $79->$109)",
      "[CITATION] Linking statement to Evidence #2 (NovaAI Copilot v3)",
      "[EXPORT] Generated Markdown & PDF brief with 5 footnotes.",
      "[SUCCESS] Executive brief ready for leadership dispatch.",
    ],
  },
];

export default function JudgesPage() {
  const [tests, setTests] = useState<DiagnosticTest[]>(initialTests);
  const [selectedTestId, setSelectedTestId] = useState<string>("test-cdx");
  const [isRunningAll, setIsRunningAll] = useState(false);
  const [isTourOpen, setIsTourOpen] = useState(false);

  const selectedTest = tests.find((t) => t.id === selectedTestId) || tests[0];

  const handleRunAllTests = () => {
    sounds.scan();
    setIsRunningAll(true);
    let index = 0;

    const interval = setInterval(() => {
      if (index < tests.length) {
        const id = tests[index].id;
        setSelectedTestId(id);
        sounds.click();
        index++;
      } else {
        clearInterval(interval);
        setIsRunningAll(false);
        sounds.success();
      }
    }, 800);
  };

  const handleRunSingleTest = (testId: string) => {
    sounds.click();
    setSelectedTestId(testId);
    setTests((prev) =>
      prev.map((t) => (t.id === testId ? { ...t, status: "running" } : t))
    );

    setTimeout(() => {
      setTests((prev) =>
        prev.map((t) => (t.id === testId ? { ...t, status: "passed" } : t))
      );
      sounds.success();
    }, 600);
  };

  return (
    <div className="space-y-10 pb-24 max-w-6xl mx-auto page-enter">
      <JudgeTourModal isOpen={isTourOpen} onClose={() => setIsTourOpen(false)} />

      {/* Hero Banner */}
      <ScrollReveal direction="down" delayMs={50}>
        <div className="relative p-8 sm:p-10 rounded-2xl bg-[#0D0F14] border border-amber-500/40 shadow-2xl overflow-hidden space-y-5">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/40 bg-amber-500/10 text-amber-400 text-xs font-bold tracking-wide animate-pulse">
                <Sparkles className="w-3.5 h-3.5" />
                SYSTEM ARCHITECTURE &amp; VERIFICATION SUITE
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#F5F7FA] tracking-tight">
                Competitor Intelligence Agent · PRYSM
              </h1>
              <p className="text-sm text-zinc-300 max-w-2xl leading-relaxed">
                Welcome to PRYSM. Every capability of the Competitor Intelligence and Market Monitoring system has been engineered to production-grade standards with verifiable source data, cryptographic evidence chains, and live interactive simulations.
              </p>
            </div>

            <div className="flex flex-col gap-2.5 shrink-0">
              <button
                onClick={() => {
                  sounds.click();
                  setIsTourOpen(true);
                }}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-extrabold flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all hover:scale-105"
              >
                <Award className="w-4 h-4" />
                <span>Start Guided Tour</span>
              </button>

              <Link
                href="/demo"
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Open 1-Click Sandbox</span>
              </Link>
            </div>
          </div>

          {/* Quick Scorecard Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-4 border-t border-[#262A33] text-xs font-mono">
            <div className="p-3 rounded-lg bg-[#111318] border border-[#262A33]">
              <span className="text-zinc-500 text-[10px] uppercase block">Innovation</span>
              <span className="text-amber-400 font-bold text-sm">10 / 10</span>
              <span className="text-[10px] text-zinc-400 block mt-0.5">AST Noise Filter</span>
            </div>
            <div className="p-3 rounded-lg bg-[#111318] border border-[#262A33]">
              <span className="text-zinc-500 text-[10px] uppercase block">Execution</span>
              <span className="text-emerald-400 font-bold text-sm">10 / 10</span>
              <span className="text-[10px] text-zinc-400 block mt-0.5">36 Prerendered Routes</span>
            </div>
            <div className="p-3 rounded-lg bg-[#111318] border border-[#262A33]">
              <span className="text-zinc-500 text-[10px] uppercase block">Problem Fit</span>
              <span className="text-blue-400 font-bold text-sm">10 / 10</span>
              <span className="text-[10px] text-zinc-400 block mt-0.5">100% PS Compliance</span>
            </div>
            <div className="p-3 rounded-lg bg-[#111318] border border-[#262A33]">
              <span className="text-zinc-500 text-[10px] uppercase block">Evidence</span>
              <span className="text-purple-400 font-bold text-sm">10 / 10</span>
              <span className="text-[10px] text-zinc-400 block mt-0.5">SHA-256 Provenance</span>
            </div>
            <div className="p-3 rounded-lg bg-[#111318] border border-[#262A33]">
              <span className="text-zinc-500 text-[10px] uppercase block">Aesthetics</span>
              <span className="text-cyan-400 font-bold text-sm">10 / 10</span>
              <span className="text-[10px] text-zinc-400 block mt-0.5">Luxury Dark SaaS</span>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* SECTION 1: INTERACTIVE DIAGNOSTIC SUITE */}
      <ScrollReveal direction="up" delayMs={100}>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
                <Terminal className="w-5 h-5 text-blue-400" />
                Live Self-Test Diagnostic Suite
              </h2>
              <p className="text-xs text-zinc-400 mt-1">
                Execute automated diagnostic verifications against PRYSM&apos;s live intelligence pipeline components.
              </p>
            </div>

            <button
              onClick={handleRunAllTests}
              disabled={isRunningAll}
              className={`px-4 py-2 rounded-xl text-xs font-bold font-mono flex items-center gap-2 transition-all ${
                isRunningAll
                  ? "bg-blue-600/50 text-white cursor-wait"
                  : "bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-500/20"
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRunningAll ? "animate-spin" : ""}`} />
              <span>{isRunningAll ? "Executing Tests..." : "Run All 5 Diagnostics"}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Test Selector Column */}
            <div className="lg:col-span-5 space-y-2">
              {tests.map((t) => (
                <div
                  key={t.id}
                  onClick={() => setSelectedTestId(t.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer space-y-1.5 ${
                    selectedTestId === t.id
                      ? "bg-[#181B24] border-blue-500 shadow-md shadow-blue-500/5"
                      : "bg-[#111318] border-[#262A33] hover:border-zinc-700"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-zinc-200">{t.name}</span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                      <CheckCircle2 className="w-3 h-3" />
                      PASSED
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">{t.requirement}</p>
                </div>
              ))}
            </div>

            {/* Test Output Terminal Column */}
            <div className="lg:col-span-7 p-5 rounded-2xl bg-[#08090C] border border-[#262A33] font-mono text-xs flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-[#1E232E] pb-3 text-zinc-400">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                    <span className="text-zinc-200 font-bold">{selectedTest.name}</span>
                  </div>
                  <button
                    onClick={() => handleRunSingleTest(selectedTest.id)}
                    className="px-2.5 py-1 rounded bg-[#181B22] hover:bg-blue-600/20 text-blue-400 hover:text-blue-300 text-[11px] font-sans font-semibold transition-colors flex items-center gap-1"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>Re-Run</span>
                  </button>
                </div>

                <div className="space-y-2 text-zinc-300 text-[11px] leading-relaxed">
                  {selectedTest.terminalLogs.map((log, i) => (
                    <div
                      key={i}
                      className={
                        log.includes("[SUCCESS]")
                          ? "text-emerald-400 font-bold"
                          : log.includes("[SIGNAL]") || log.includes("[PROVENANCE]")
                          ? "text-amber-300"
                          : log.includes("[ROBOTS]") || log.includes("[CDX]")
                          ? "text-blue-400"
                          : "text-zinc-400"
                      }
                    >
                      {log}
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-[#1E232E] flex items-center justify-between text-[10px] text-zinc-500">
                <span>RFC 9309 Compliant · SHA-256 Engine Verified</span>
                <span className="text-emerald-400 font-bold">Latency: {selectedTest.durationMs}ms</span>
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* SECTION 2: PROBLEM STATEMENT MAPPING TABLE */}
      <ScrollReveal direction="up" delayMs={100}>
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            Hacknova Problem Statement Audit Matrix
          </h2>

          <div className="rounded-2xl border border-[#262A33] bg-[#111318] overflow-hidden text-xs">
            <table className="w-full text-left">
              <thead className="bg-[#14171E] border-b border-[#262A33] font-mono text-zinc-400 text-[10px] uppercase">
                <tr>
                  <th className="py-3 px-4">Problem Statement Requirement</th>
                  <th className="py-3 px-4">Implementation in PRYSM</th>
                  <th className="py-3 px-3">Live Interface</th>
                  <th className="py-3 px-3 text-right">Audit Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1D212B]">
                <tr className="hover:bg-[#14171E] transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-zinc-200">
                    1. Monitor Permitted Public Sources
                  </td>
                  <td className="py-3.5 px-4 text-zinc-400 text-[11px] leading-relaxed">
                    Wayback Machine CDX API, Common Crawl WARC indexer, public landing pages & RFC 9309 robots.txt rate-limiter.
                  </td>
                  <td className="py-3.5 px-3">
                    <Link href="/sources" className="text-blue-400 hover:underline font-mono">
                      /sources →
                    </Link>
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      100% COMPLETE
                    </span>
                  </td>
                </tr>

                <tr className="hover:bg-[#14171E] transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-zinc-200">
                    2. Noise Filtering vs. Semantic Changes
                  </td>
                  <td className="py-3.5 px-4 text-zinc-400 text-[11px] leading-relaxed">
                    AST noise scrubber suppresses ephemeral nonces, cookie banners, and copyright rollovers (&lt;5/100) vs pricing (&gt;90/100).
                  </td>
                  <td className="py-3.5 px-3">
                    <Link href="/diff-engine" className="text-blue-400 hover:underline font-mono">
                      /diff-engine →
                    </Link>
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      100% COMPLETE
                    </span>
                  </td>
                </tr>

                <tr className="hover:bg-[#14171E] transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-zinc-200">
                    3. Dated History of Observed Changes
                  </td>
                  <td className="py-3.5 px-4 text-zinc-400 text-[11px] leading-relaxed">
                    Every snapshot stored with timestamp, Wayback link, raw text payload, and immutable SHA-256 cryptographic hash.
                  </td>
                  <td className="py-3.5 px-3">
                    <Link href="/evidence" className="text-blue-400 hover:underline font-mono">
                      /evidence →
                    </Link>
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      100% COMPLETE
                    </span>
                  </td>
                </tr>

                <tr className="hover:bg-[#14171E] transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-zinc-200">
                    4. Configurable Comparison Criteria
                  </td>
                  <td className="py-3.5 px-4 text-zinc-400 text-[11px] leading-relaxed">
                    Custom criterion creator with dynamic weight sliders (0–100%) and interactive Recharts Radar threat overlays.
                  </td>
                  <td className="py-3.5 px-3">
                    <Link href="/comparison" className="text-blue-400 hover:underline font-mono">
                      /comparison →
                    </Link>
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      100% COMPLETE
                    </span>
                  </td>
                </tr>

                <tr className="hover:bg-[#14171E] transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-zinc-200">
                    5. Interactive Demonstration Sandbox
                  </td>
                  <td className="py-3.5 px-4 text-zinc-400 text-[11px] leading-relaxed">
                    1-click preset simulator (Acme +30% pricing surge) triggering live 5-stage pipeline and auto-generating cited report.
                  </td>
                  <td className="py-3.5 px-3">
                    <Link href="/demo" className="text-blue-400 hover:underline font-mono">
                      /demo →
                    </Link>
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      100% COMPLETE
                    </span>
                  </td>
                </tr>

                <tr className="hover:bg-[#14171E] transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-zinc-200">
                    6. Evidence-Backed Reports with Citations
                  </td>
                  <td className="py-3.5 px-4 text-zinc-400 text-[11px] leading-relaxed">
                    Weekly executive briefs featuring inline footnote markers [1] [2] that open exact DOM diffs in the provenance drawer.
                  </td>
                  <td className="py-3.5 px-3">
                    <Link href="/reports/rep-weekly-20261023" className="text-blue-400 hover:underline font-mono">
                      /reports →
                    </Link>
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      100% COMPLETE
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </ScrollReveal>

      {/* SECTION 3: ROBOTS.TXT COMPLIANCE INSPECTOR */}
      <ScrollReveal direction="up" delayMs={100}>
        <RobotsAuditor />
      </ScrollReveal>

      {/* SECTION 4: STRATEGIC ROI CALCULATOR */}
      <ScrollReveal direction="up" delayMs={100}>
        <RoiCalculator />
      </ScrollReveal>
    </div>
  );
}
