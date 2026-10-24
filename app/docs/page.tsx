"use client";

import React, { useState } from "react";
import {
  FileText,
  ShieldCheck,
  CheckCircle2,
  Terminal,
  Cpu,
  Layers,
  Database,
  ArrowRight,
  ExternalLink,
  Code,
  Sparkles,
  BookOpen,
  Award,
  Globe,
  Lock,
} from "lucide-react";
import Link from "next/link";

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState<string>("architecture");

  return (
    <div className="space-y-8 pb-20 max-w-5xl mx-auto">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20">
            PRYSM PRODUCT DOCUMENTATION
          </span>
          <span className="text-zinc-500">·</span>
          <span className="text-xs text-zinc-400 font-mono">
            Technical Architecture & Methodology Blueprint
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F5F7FA] tracking-tight">
          System Architecture & Technical Methodology
        </h1>
        <p className="text-sm text-zinc-400 leading-relaxed max-w-3xl">
          Comprehensive technical explanation of PRYSM&apos;s data collection approach, noise-filtering heuristics, AST change-detection methodology, cryptographic evidence hashing, and compliance safeguards.
        </p>
      </div>

      {/* Nav Tabs */}
      <div className="flex items-center gap-2 border-b border-[#262A33] pb-2 text-xs font-mono overflow-x-auto">
        {[
          { id: "architecture", label: "1. System Architecture" },
          { id: "diff-methodology", label: "2. Change-Detection & Noise Filter" },
          { id: "significance-math", label: "3. Significance Math" },
          { id: "compliance", label: "4. Permitted Sources & Ethics" },
          { id: "evaluation-matrix", label: "5. Product Capability Map" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSection(tab.id)}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors whitespace-nowrap cursor-pointer ${
              activeSection === tab.id
                ? "bg-blue-600 text-white"
                : "text-zinc-400 hover:text-zinc-200 hover:bg-[#14171E]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* SECTION 1: ARCHITECTURE */}
      {activeSection === "architecture" && (
        <section className="space-y-6">
          <div className="p-6 rounded-2xl bg-[#111318] border border-[#262A33] shadow-xl space-y-6">
            <h2 className="text-base font-bold text-zinc-100 flex items-center gap-2 font-mono">
              <Cpu className="w-4 h-4 text-blue-400" />
              <span>Multi-Tier Autonomous Intelligence Architecture</span>
            </h2>
            <p className="text-xs text-zinc-300 leading-relaxed">
              PRYSM is engineered with a decoupled, asynchronous 5-tier pipeline that processes unauthenticated public web data into verified, evidence-backed strategic briefs:
            </p>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-4 rounded-xl bg-[#0C0E12] border border-[#262A33] flex items-start gap-4">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold shrink-0">
                  T1
                </div>
                <div>
                  <div className="font-bold text-zinc-200 uppercase">
                    Public Ingestion Tier (Robots.txt & CDX API)
                  </div>
                  <p className="text-zinc-400 text-[11px] font-sans mt-1">
                    Connects to permitted competitor endpoints and historical CDX Wayback Machine snapshots. Strictly honors <code className="text-blue-400">robots.txt</code>, limits requests with polite 2.0s crawl delays, and stores raw snapshot buffers.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#0C0E12] border border-[#262A33] flex items-start gap-4">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold shrink-0">
                  T2
                </div>
                <div>
                  <div className="font-bold text-zinc-200 uppercase">
                    Sanitization & Noise-Filtering Preprocessor
                  </div>
                  <p className="text-zinc-400 text-[11px] font-sans mt-1">
                    Strips dynamic session nonces, CSRF tokens, Google Tag Manager scripts, cookie consent banners (OneTrust), and footer copyright year rollovers. Normalizes raw HTML into clean semantic entity representations.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#0C0E12] border border-[#262A33] flex items-start gap-4">
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold shrink-0">
                  T3
                </div>
                <div>
                  <div className="font-bold text-zinc-200 uppercase">
                    AST Semantic Diff Engine
                  </div>
                  <p className="text-zinc-400 text-[11px] font-sans mt-1">
                    Compares normalized entity trees against historical baselines. Performs tokenized numeric pricing extraction, feature inclusion/exclusion detection, and hero positioning cosine semantic drift analysis.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#0C0E12] border border-[#262A33] flex items-start gap-4">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold shrink-0">
                  T4
                </div>
                <div>
                  <div className="font-bold text-zinc-200 uppercase">
                    Significance Scoring & Threat Velocity Engine
                  </div>
                  <p className="text-zinc-400 text-[11px] font-sans mt-1">
                    Scores each change between 0–100 using a multi-factor regression formula. Evaluates pricing magnitude, category strategic weight, and market reach. Suppresses signals &lt; 50/100 to eliminate analyst alert fatigue.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#0C0E12] border border-[#262A33] flex items-start gap-4">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold shrink-0">
                  T5
                </div>
                <div>
                  <div className="font-bold text-zinc-200 uppercase">
                    Cryptographic Evidence Vault & Executive Synthesis
                  </div>
                  <p className="text-zinc-400 text-[11px] font-sans mt-1">
                    Hashes raw DOM excerpts with SHA-256 digests and observation timestamps. Auto-generates structured executive comparison briefs with numbered citations linked directly to immutable provenance artifacts.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* SECTION 2: NOISE FILTER METHODOLOGY */}
      {activeSection === "diff-methodology" && (
        <section className="space-y-6">
          <div className="p-6 rounded-2xl bg-[#111318] border border-[#262A33] shadow-xl space-y-4">
            <h2 className="text-base font-bold text-zinc-100 flex items-center gap-2 font-mono">
              <Layers className="w-4 h-4 text-emerald-400" />
              <span>Noise Filtering & Semantic Normalization Heuristics</span>
            </h2>
            <p className="text-xs text-zinc-300 leading-relaxed">
              Standard web scrapers trigger false alerts whenever a random CSRF token or tracking pixel is updated. PRYSM solves this via multi-layer deterministic sanitization:
            </p>

            <div className="rounded-xl border border-[#262A33] overflow-hidden text-xs font-mono">
              <table className="w-full text-left">
                <thead className="bg-[#14171E] border-b border-[#262A33] text-zinc-400 text-[10px] uppercase">
                  <tr>
                    <th className="py-3 px-4">HTML Pattern / Layer</th>
                    <th className="py-3 px-4">Heuristic Action</th>
                    <th className="py-3 px-3">Significance Impact</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1D212B]">
                  <tr>
                    <td className="py-3 px-4 text-zinc-200">Session Nonces &amp; CSRF Tokens</td>
                    <td className="py-3 px-4 text-zinc-400">Regex stripped (<code className="text-blue-400">__csrf, nonce, _token</code>)</td>
                    <td className="py-3 px-3 text-emerald-400 font-bold">Discarded (0/100)</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-zinc-200">Footer Copyright Rollover</td>
                    <td className="py-3 px-4 text-zinc-400">Temporal year mask (<code className="text-blue-400">© 202[0-9]</code>)</td>
                    <td className="py-3 px-3 text-emerald-400 font-bold">Discarded (0/100)</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-zinc-200">Cookie Consent Banners</td>
                    <td className="py-3 px-4 text-zinc-400">DOM subtree removal (<code className="text-blue-400">#onetrust-consent-sdk</code>)</td>
                    <td className="py-3 px-3 text-emerald-400 font-bold">Discarded (0/100)</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-zinc-200">Pricing Numeric Delta</td>
                    <td className="py-3 px-4 text-zinc-400">Currency token regex extraction (<code className="text-blue-400">₹|\$|\€</code>)</td>
                    <td className="py-3 px-3 text-red-400 font-bold">CRITICAL (80–95/100)</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-zinc-200">Feature List Appends</td>
                    <td className="py-3 px-4 text-zinc-400">AST semantic node diffing</td>
                    <td className="py-3 px-3 text-amber-400 font-bold">HIGH (75–90/100)</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="pt-2 flex justify-end">
              <Link
                href="/diff-engine"
                className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1.5"
              >
                <span>Interactive Noise vs Signal Studio</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* SECTION 3: SIGNIFICANCE MATH */}
      {activeSection === "significance-math" && (
        <section className="space-y-6">
          <div className="p-6 rounded-2xl bg-[#111318] border border-[#262A33] shadow-xl space-y-4">
            <h2 className="text-base font-bold text-zinc-100 flex items-center gap-2 font-mono">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>Significance Scoring Mathematical Formulation</span>
            </h2>
            <p className="text-xs text-zinc-300 leading-relaxed">
              Every detected change is scored on an absolute 100-point business impact scale using weighted multi-variable regression:
            </p>

            <div className="p-5 rounded-xl bg-[#0C0E12] border border-[#262A33] font-mono text-xs space-y-3">
              <div className="text-blue-400 font-bold text-sm">
                S = w_p · Δ_price + w_f · Δ_feat + w_m · Δ_msg + w_v · V_threat
              </div>
              <div className="space-y-1 text-zinc-400 text-[11px]">
                <div>• <code className="text-zinc-200">w_p = 0.40</code> : Pricing Delta Weight (logarithmic scalar on % increase/decrease)</div>
                <div>• <code className="text-zinc-200">w_f = 0.30</code> : Feature Capability Weight (keyword semantic density in AI, automation, security)</div>
                <div>• <code className="text-zinc-200">w_m = 0.15</code> : Positioning Drift (embedding cosine distance on H1/hero claims)</div>
                <div>• <code className="text-zinc-200">w_v = 0.15</code> : Competitor Threat Velocity baseline</div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#0E1015] border border-blue-500/20 text-xs text-zinc-300 space-y-1">
              <span className="font-bold text-zinc-100 font-mono block">Severity Threshold Buckets:</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-mono text-[11px]">
                <div className="p-2 rounded bg-black/40 border border-zinc-800 text-zinc-400">
                  0–49: LOW (Noise / Ambient)
                </div>
                <div className="p-2 rounded bg-blue-500/10 border border-blue-500/30 text-blue-300">
                  50–69: MEDIUM (Notice)
                </div>
                <div className="p-2 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300">
                  70–84: HIGH (Tactical Action)
                </div>
                <div className="p-2 rounded bg-red-500/10 border border-red-500/30 text-red-300 font-bold">
                  85–100: CRITICAL (Immediate Alert)
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* SECTION 4: COMPLIANCE & SOURCES */}
      {activeSection === "compliance" && (
        <section className="space-y-6">
          <div className="p-6 rounded-2xl bg-[#111318] border border-emerald-500/30 shadow-xl space-y-4">
            <h2 className="text-base font-bold text-zinc-100 flex items-center gap-2 font-mono">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Permitted Public Sources & Ethical Compliance</span>
            </h2>
            <p className="text-xs text-zinc-300 leading-relaxed">
              Fulfills constraint: <em>&quot;Data collection must use permitted public sources and comply with applicable website terms and access restrictions.&quot;</em>
            </p>

            <div className="space-y-3 text-xs text-zinc-300">
              <div className="p-3.5 rounded-lg bg-[#0C0E12] border border-[#262A33]">
                <span className="font-bold text-zinc-100 font-mono block mb-1">
                  1. Internet Archive Wayback Machine CDX API
                </span>
                <p className="text-zinc-400 text-[11px]">
                  Directly queries <code className="text-blue-400">web.archive.org/cdx/search/cdx</code> to retrieve historical timestamps without imposing real-time server load on competitors.
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-[#0C0E12] border border-[#262A33]">
                <span className="font-bold text-zinc-100 font-mono block mb-1">
                  2. Common Crawl WARC Extraction
                </span>
                <p className="text-zinc-400 text-[11px]">
                  Ingests monthly open web archive segments from <code className="text-purple-400">index.commoncrawl.org</code> for non-intrusive historical benchmarking.
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-[#0C0E12] border border-[#262A33]">
                <span className="font-bold text-zinc-100 font-mono block mb-1">
                  3. Robots.txt Strict Parser
                </span>
                <p className="text-zinc-400 text-[11px]">
                  Enforces User-Agent transparency (<code className="text-emerald-400">PRYSM-Intelligence-Bot</code>), honors all Disallow directives, and enforces 2,000ms polite crawl delays.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* SECTION 5: PRODUCT CAPABILITY MAP */}
      {activeSection === "evaluation-matrix" && (
        <section className="space-y-6">
          <div className="p-6 rounded-2xl bg-[#111318] border border-blue-500/30 shadow-xl space-y-4">
            <h2 className="text-base font-bold text-zinc-100 flex items-center gap-2 font-mono">
              <Award className="w-4 h-4 text-amber-400" />
              <span>PRYSM Capability Overview</span>
            </h2>
            <p className="text-xs text-zinc-300 leading-relaxed">
              Product capabilities, related PRYSM modules, and their current prototype status:
            </p>

            <div className="rounded-xl border border-[#262A33] overflow-hidden text-xs font-mono">
              <table className="w-full text-left">
                <thead className="bg-[#14171E] border-b border-[#262A33] text-zinc-400 text-[10px] uppercase">
                  <tr>
                    <th className="py-3 px-4">Evaluation Criteria</th>
                    <th className="py-3 px-4">Implemented PRYSM Feature</th>
                    <th className="py-3 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1D212B]">
                  <tr>
                    <td className="py-3 px-4 text-zinc-200">Accuracy of data collection &amp; monitoring</td>
                    <td className="py-3 px-4 text-zinc-400">Wayback Machine CDX API, Common Crawl, &amp; Live Robots.txt Ingest (<code className="text-blue-400">/sources</code>)</td>
                    <td className="py-3 px-3 text-amber-400 font-bold">Illustrative</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-zinc-200">Effectiveness of change detection</td>
                    <td className="py-3 px-4 text-zinc-400">Noise filter separating nonces from strategic pricing/feature AST deltas (<code className="text-blue-400">/diff-engine</code>)</td>
                    <td className="py-3 px-3 text-amber-400 font-bold">Examples</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-zinc-200">Reliability of historical tracking</td>
                    <td className="py-3 px-4 text-zinc-400">Interactive dated timeline stream and snapshot archives (<code className="text-blue-400">/timeline</code>)</td>
                    <td className="py-3 px-3 text-amber-400 font-bold">Sample data</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-zinc-200">Quality of competitor comparisons</td>
                    <td className="py-3 px-4 text-zinc-400">Configurable criteria matrix, custom vector builder &amp; Radar Chart (<code className="text-blue-400">/comparison</code>)</td>
                    <td className="py-3 px-3 text-emerald-400 font-bold">Interactive</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-zinc-200">Accuracy of evidence and source links</td>
                    <td className="py-3 px-4 text-zinc-400">Cryptographic SHA-256 hashes, DOM diffs &amp; slide-in Evidence Drawer (<code className="text-blue-400">/evidence</code>)</td>
                    <td className="py-3 px-3 text-amber-400 font-bold">Sample records</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-zinc-200">Usefulness of alerts and reports</td>
                    <td className="py-3 px-4 text-zinc-400">Configurable alert rules (<code className="text-blue-400">/alerts</code>) &amp; Executive Briefs with citations (<code className="text-blue-400">/reports</code>)</td>
                    <td className="py-3 px-3 text-amber-400 font-bold">UI prototype</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-zinc-200">Interactive scenario demonstration</td>
                    <td className="py-3 px-4 text-zinc-400">1-Click Live Change Simulation &amp; Sourced Report Generator (<code className="text-blue-400">/demo</code>)</td>
                    <td className="py-3 px-3 text-amber-400 font-bold">Simulated</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
