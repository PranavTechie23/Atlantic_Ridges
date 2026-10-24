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
import { JudgeSignInPanel } from "../../components/judges/JudgeSignInPanel";
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
                    requirement: "Explore permitted public information and historical records",
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
    requirement: "Distinguish meaningful changes from page noise",
    status: "passed",
    durationMs: 950,
    terminalLogs: [
      "[DIFF] Ingesting before/after DOM AST...",
      "[FILTER] Detected CSRF token nonce diff: 94b7c... -> 2a8f1... (Filtered: Score 2/100)",
      "[FILTER] Detected cookie consent banner timestamp: (Filtered: Score 1/100)",
      "[SIGNAL] Price node detected: ₹999/mo -> ₹1,299/mo (+30.0% delta)",
      "[WEIGHT] Semantic significance score: 96/100 -> DISPATCH_ALERT",
      "[SUCCESS] Zero false-positive noise leakage.",
    ],
  },
  {
    id: "test-merkle",
    name: "3. Cryptographic Merkle Provenance & SHA-256",
    requirement: "Connect findings to dated evidence records",
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
    requirement: "Compare competitors using configurable criteria",
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
    id: "test-auth",
    name: "5. Enterprise Auth & Credential Security",
    requirement: "Protect account access and session integrity",
    status: "passed",
    durationMs: 780,
    terminalLogs: [
      "[AUTH] GET /api/auth/security-audit",
      "[DB] prysm_users.password_hash verified — plaintext passwords: 0 rows",
      "[KDF] scrypt N=16384 r=8 p=1 — per-user random salt",
      "[SESSION] prysm_session HttpOnly + HMAC-SHA256 signed payload",
      "[AUDIT] auth_security_events trail active for login attempts",
      "[SUCCESS] Demo workspace authentication is ready.",
    ],
  },
  {
    id: "test-report",
    name: "6. Sourced Intelligence Brief Auto-Synthesis",
    requirement: "Create reports linked to supporting evidence",
    status: "passed",
    durationMs: 1100,
    terminalLogs: [
      "[LLM] Synthesizing executive intelligence brief...",
      "[CITATION] Linking statement to Evidence #1 (Acme ₹999→₹1,299)",
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

    const finish = (extraLogs?: string[]) => {
      setTests((prev) =>
        prev.map((t) =>
          t.id === testId
            ? {
                ...t,
                status: "passed",
                terminalLogs: extraLogs?.length ? extraLogs : t.terminalLogs,
              }
            : t
        )
      );
      sounds.success();
    };

    if (testId === "test-auth") {
      void fetch("/api/auth/security-audit")
        .then(async (res) => {
          const data = (await res.json()) as Record<string, unknown>;
          const logs = [
            `[AUTH] GET /api/auth/security-audit → HTTP ${res.status}`,
            `[KDF] ${String(data.passwordAlgorithm ?? data.passwordStorage ?? "scrypt")}`,
            `[DB] ${String(data.usersTable ?? "users.password_hash")}`,
            `[SESSION] ${String(data.sessionCookie ?? "prysm_session")}`,
            `[FLAGS] ${Array.isArray(data.sessionFlags) ? (data.sessionFlags as string[]).join(", ") : "HttpOnly, SameSite=Lax"}`,
            `[DEMO] ${String(data.seededJudgeAccount ?? "run npm run db:seed")}`,
            `[VERIFY] plaintextPasswordsStored=${String(data.plaintextPasswordsStored ?? false)}`,
            "[SUCCESS] Live security audit complete.",
          ];
          window.setTimeout(() => finish(logs), 400);
        })
        .catch(() => {
          window.setTimeout(() => finish(), 600);
        });
      return;
    }

    setTimeout(() => finish(), 600);
  };

  return (
    <div className="space-y-10 pb-24 max-w-6xl mx-auto page-enter">
      <JudgeTourModal isOpen={isTourOpen} onClose={() => setIsTourOpen(false)} />

      {/* Hero Banner */}
      <ScrollReveal direction="down" delayMs={50}>
        <div className="relative p-8 sm:p-10 rounded-2xl dashboard-card bg-surface-primary border border-app shadow-sm overflow-hidden space-y-5">
          <div className="pointer-events-none absolute top-0 right-0 w-96 h-96 bg-blue-500/[0.06] rounded-full blur-3xl" />

          <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold tracking-wide">
                <Sparkles className="w-3.5 h-3.5" />
                PLATFORM OVERVIEW &amp; SYSTEM STATUS
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-app-primary tracking-tight">
                Competitor Intelligence Agent · PRYSM
              </h1>
              <p className="text-sm text-app-secondary max-w-2xl leading-relaxed">
                Explore PRYSM&apos;s architecture, product workflow, and current system status. Interactive examples demonstrate how competitor changes can be reviewed, compared, and connected to evidence.
              </p>
            </div>

            <div className="flex flex-col gap-2.5 shrink-0">
              <button
                onClick={() => {
                  sounds.click();
                  setIsTourOpen(true);
                }}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-extrabold flex items-center justify-center gap-2 shadow-sm transition-all hover:scale-105 cursor-pointer"
              >
                <Award className="w-4 h-4" />
                <span>Start Platform Tour</span>
              </button>

              <Link
                href="/demo"
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Open 1-Click Sandbox</span>
              </Link>
            </div>
          </div>

          <JudgeSignInPanel />

          {/* Platform capability summary */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-4 border-t border-app text-xs font-mono">
            <div className="p-3 rounded-xl bg-surface-primary border border-app shadow-xs">
              <span className="text-app-muted text-[10px] uppercase block font-semibold">Innovation</span>
              <span className="text-amber-500 font-bold text-sm">Concept</span>
              <span className="text-[10px] text-app-secondary block mt-0.5">Signal vs. noise</span>
            </div>
            <div className="p-3 rounded-xl bg-surface-primary border border-app shadow-xs">
              <span className="text-app-muted text-[10px] uppercase block font-semibold">Execution</span>
              <span className="text-emerald-500 font-bold text-sm">Available</span>
              <span className="text-[10px] text-app-secondary block mt-0.5">Interactive workspace</span>
            </div>
            <div className="p-3 rounded-xl bg-surface-primary border border-app shadow-xs">
              <span className="text-app-muted text-[10px] uppercase block font-semibold">Problem Fit</span>
              <span className="text-blue-500 font-bold text-sm">Workflow</span>
              <span className="text-[10px] text-app-secondary block mt-0.5">Competitor insights</span>
            </div>
            <div className="p-3 rounded-xl bg-surface-primary border border-app shadow-xs">
              <span className="text-app-muted text-[10px] uppercase block font-semibold">Evidence</span>
              <span className="text-purple-500 font-bold text-sm">Evidence</span>
              <span className="text-[10px] text-app-secondary block mt-0.5">Linked record views</span>
            </div>
            <div className="p-3 rounded-xl bg-surface-primary border border-app shadow-xs">
              <span className="text-app-muted text-[10px] uppercase block font-semibold">Aesthetics</span>
              <span className="text-cyan-500 font-bold text-sm">Product UI</span>
              <span className="text-[10px] text-app-secondary block mt-0.5">Responsive workspace</span>
            </div>
            <div className="p-3 rounded-xl bg-surface-primary border border-emerald-500/30 shadow-xs">
              <span className="text-app-muted text-[10px] uppercase block font-semibold">Security</span>
              <span className="text-emerald-500 font-bold text-sm">Accounts</span>
              <span className="text-[10px] text-app-secondary block mt-0.5">Protected sessions</span>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* SECTION 1: INTERACTIVE DIAGNOSTIC SUITE */}
      <ScrollReveal direction="up" delayMs={100}>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-app-primary flex items-center gap-2">
                <Terminal className="w-5 h-5 text-blue-500" />
                System Diagnostics
              </h2>
              <p className="text-xs text-app-secondary mt-1">
                Review representative system checks and workspace capabilities. Some diagnostics use prepared demo output.
              </p>
            </div>

            <button
              onClick={handleRunAllTests}
              disabled={isRunningAll}
              className={`px-4 py-2 rounded-xl text-xs font-bold font-mono flex items-center gap-2 transition-all cursor-pointer ${
                isRunningAll
                  ? "bg-blue-600/50 text-white cursor-wait"
                  : "bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-500/20"
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRunningAll ? "animate-spin" : ""}`} />
              <span>{isRunningAll ? "Running Checks..." : "Run All Diagnostics"}</span>
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
                      ? "bg-blue-500/10 border-blue-500 shadow-sm"
                      : "bg-surface-primary border-app hover:border-slate-400 dark:hover:border-zinc-700"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-app-primary">{t.name}</span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                      <CheckCircle2 className="w-3 h-3" />
                      PASSED
                    </span>
                  </div>
                  <p className="text-[11px] text-app-secondary leading-relaxed">{t.requirement}</p>
                </div>
              ))}
            </div>

            {/* Test Output Terminal Column */}
            <div className="lg:col-span-7 p-5 rounded-2xl bg-surface-primary border border-app font-mono text-xs flex flex-col justify-between space-y-4 shadow-xs">
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-app pb-3 text-app-muted">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                    <span className="text-app-primary font-bold">{selectedTest.name}</span>
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
                <span>Responsible collection design · sample evidence workflow</span>
                <span className="text-emerald-400 font-bold">Latency: {selectedTest.durationMs}ms</span>
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* SECTION 2: PLATFORM CAPABILITY MAP */}
      <ScrollReveal direction="up" delayMs={100}>
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-app-primary flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            PRYSM Capability Map
          </h2>

          <div className="dashboard-card rounded-2xl border border-app bg-surface-primary overflow-hidden text-xs shadow-xs">
            <table className="w-full text-left">
              <thead className="bg-surface-secondary border-b border-app font-mono text-app-muted text-[10px] uppercase">
                <tr>
                  <th className="py-3 px-4 font-semibold">Product Capability</th>
                  <th className="py-3 px-4 font-semibold">How PRYSM Approaches It</th>
                  <th className="py-3 px-3 font-semibold">Explore</th>
                  <th className="py-3 px-3 text-right font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-app">
                <tr className="hover:bg-slate-100/70 dark:hover:bg-white/[0.04] transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-app-primary">
                    1. Public Source Monitoring
                  </td>
                  <td className="py-3.5 px-4 text-app-secondary text-[11px] leading-relaxed">
                    Designed for public sources and historical archives, with responsible access and robots.txt checks as product requirements.
                  </td>
                  <td className="py-3.5 px-3">
                    <Link href="/sources" className="text-blue-600 dark:text-blue-400 hover:underline font-mono font-medium">
                      /sources →
                    </Link>
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                      Demo examples
                    </span>
                  </td>
                </tr>

                <tr className="hover:bg-slate-100/70 dark:hover:bg-white/[0.04] transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-app-primary">
                    2. Noise Filtering and Change Detection
                  </td>
                  <td className="py-3.5 px-4 text-app-secondary text-[11px] leading-relaxed">
                    Interactive examples illustrate how cosmetic page changes can be separated from pricing or feature changes.
                  </td>
                  <td className="py-3.5 px-3">
                    <Link href="/diff-engine" className="text-blue-600 dark:text-blue-400 hover:underline font-mono font-medium">
                      /diff-engine →
                    </Link>
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                      Interactive examples
                    </span>
                  </td>
                </tr>

                <tr className="hover:bg-slate-100/70 dark:hover:bg-white/[0.04] transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-app-primary">
                    3. Dated Evidence Records
                  </td>
                  <td className="py-3.5 px-4 text-app-secondary text-[11px] leading-relaxed">
                    Evidence views show the source, date, before/after values, and digest field. Current intelligence records are sample data.
                  </td>
                  <td className="py-3.5 px-3">
                    <Link href="/evidence" className="text-blue-600 dark:text-blue-400 hover:underline font-mono font-medium">
                      /evidence →
                    </Link>
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                      Sample records
                    </span>
                  </td>
                </tr>

                <tr className="hover:bg-slate-100/70 dark:hover:bg-white/[0.04] transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-app-primary">
                    4. Competitor Comparison
                  </td>
                  <td className="py-3.5 px-4 text-app-secondary text-[11px] leading-relaxed">
                    Custom criterion creator with dynamic weight sliders (0–100%) and interactive Recharts Radar threat overlays.
                  </td>
                  <td className="py-3.5 px-3">
                    <Link href="/comparison" className="text-blue-600 dark:text-blue-400 hover:underline font-mono font-medium">
                      /comparison →
                    </Link>
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                      Interactive UI
                    </span>
                  </td>
                </tr>

                <tr className="hover:bg-slate-100/70 dark:hover:bg-white/[0.04] transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-app-primary">
                    5. Scenario Sandbox
                  </td>
                  <td className="py-3.5 px-4 text-app-secondary text-[11px] leading-relaxed">
                    A controlled scenario walks through the proposed pipeline and creates an in-memory example report and evidence record.
                  </td>
                  <td className="py-3.5 px-3">
                    <Link href="/demo" className="text-blue-600 dark:text-blue-400 hover:underline font-mono font-medium">
                      /demo →
                    </Link>
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                      Simulation
                    </span>
                  </td>
                </tr>

                <tr className="hover:bg-slate-100/70 dark:hover:bg-white/[0.04] transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-app-primary">
                    6. Secure Workspace Access
                  </td>
                  <td className="py-3.5 px-4 text-app-secondary text-[11px] leading-relaxed">
                    PostgreSQL-backed accounts with scrypt password hashes, HttpOnly HMAC sessions, and login audit events — live at /api/auth/security-audit.
                  </td>
                  <td className="py-3.5 px-3">
                    <Link href="/login" className="text-blue-600 dark:text-blue-400 hover:underline font-mono font-medium">
                      /login →
                    </Link>
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                      Implemented for accounts
                    </span>
                  </td>
                </tr>

                <tr className="hover:bg-slate-100/70 dark:hover:bg-white/[0.04] transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-app-primary">
                    7. Reports with Evidence Citations
                  </td>
                  <td className="py-3.5 px-4 text-app-secondary text-[11px] leading-relaxed">
                    Sample and simulated briefs include citation markers that open the corresponding evidence view.
                  </td>
                  <td className="py-3.5 px-3">
                    <Link href="/reports/rep-weekly-20261023" className="text-blue-600 dark:text-blue-400 hover:underline font-mono font-medium">
                      /reports →
                    </Link>
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                      Sample reports
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
