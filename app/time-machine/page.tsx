"use client";

import React, { useState } from "react";
import { useApp } from "@/lib/context/AppContext";
import { sounds } from "@/lib/utils/sound";
import {
  History,
  Split,
  Eye,
  Sliders,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Layers,
  Zap,
  Globe,
  ExternalLink,
} from "lucide-react";
import { BorderBeam } from "@/components/ui/BorderBeam";
import { LivePulseIndicator } from "@/components/ui/LivePulseIndicator";

interface TimeMachineSnapshot {
  date: string;
  label: string;
  badge: string;
  tagline: string;
  proPrice: string;
  enterprisePrice: string;
  features: string[];
  bannerNotice?: string;
  sourceDigest: string;
}

const PRESET_SNAPSHOTS: Record<string, { before: TimeMachineSnapshot; after: TimeMachineSnapshot }> = {
  "comp-acme": {
    before: {
      date: "2025-11-20",
      label: "Historical Snapshot (Nov 2025)",
      badge: "Legacy Baseline",
      tagline: "Simple cloud collaboration and document storage for modern teams.",
      proPrice: "₹999",
      enterprisePrice: "₹5,499",
      features: [
        "10,000 API Requests / min",
        "Standard Role-Based Access Control",
        "Basic CSV and PDF Funnel Exports",
        "Email Support (24h SLA)",
      ],
      sourceDigest: "sha256:8b408b0857945d9e52c80389279e8cf1c21c7263c9a12c8ff462e088c4d62c1a",
    },
    after: {
      date: "2026-10-23",
      label: "Current Verified Snapshot (Oct 2026)",
      badge: "Active Production",
      tagline: "The intelligent automation and workspace engine for high-velocity teams.",
      proPrice: "₹1,299 (+30%)",
      enterprisePrice: "₹5,999 (+9.1%)",
      features: [
        "10,000 API Requests / min",
        "Standard Role-Based Access Control + SAML SSO",
        "Basic CSV and PDF Funnel Exports + Real-time Funnels",
        "Autonomous Multi-Agent Workflow Canvas (NEW)",
        "Priority Slack Connect Channel (NEW)",
      ],
      bannerNotice: "Special Notice: Pricing updated on 23 Oct 2026 to support Copilot 2.1 deployment.",
      sourceDigest: "sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    },
  },
  "comp-nova": {
    before: {
      date: "2025-04-12",
      label: "Historical Snapshot (Apr 2025)",
      badge: "Legacy Baseline",
      tagline: "Next-generation developer assistant for fast code autocomplete.",
      proPrice: "₹2,499",
      enterprisePrice: "Custom",
      features: [
        "Assisted Code Completion",
        "Basic Syntax Linting",
        "Single-File Context Window",
      ],
      sourceDigest: "sha256:3a4b9c1d8e7f6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b",
    },
    after: {
      date: "2026-10-18",
      label: "Current Verified Snapshot (Oct 2026)",
      badge: "Active Production",
      tagline: "Autonomous Agentic Software Engineering Platform.",
      proPrice: "₹3,199 (+28%)",
      enterprisePrice: "₹24,999",
      features: [
        "Assisted Code Completion",
        "Basic Syntax Linting",
        "Full-Repository Multi-File Code Indexing (UPDATED)",
        "Autonomous Reasoning Agent Copilot v3 (NEW)",
        "Zero-Trust SOC-2 Type II Enclave (NEW)",
      ],
      sourceDigest: "sha256:9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8e",
    },
  },
};

export default function TimeMachinePage() {
  const { openEvidenceDrawer } = useApp();
  const [selectedCompId, setSelectedCompId] = useState<string>("comp-acme");
  const [splitPos, setSplitPos] = useState<number>(50); // percentage 0 to 100
  const [isGhostOverlay, setIsGhostOverlay] = useState<boolean>(false);

  const currentPair = PRESET_SNAPSHOTS[selectedCompId] || PRESET_SNAPSHOTS["comp-acme"];

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    sounds.playTick();
    setSplitPos(Number(e.target.value));
  };

  return (
    <div className="space-y-8 pb-20 max-w-6xl mx-auto select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              VISUAL RECONSTRUCTION ENGINE
            </span>
            <span className="text-zinc-600">·</span>
            <LivePulseIndicator status="verifying" label="Temporal Diff Active" sublabel="Side-by-Side Reconstruction" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F5F7FA] tracking-tight">
            Visual Time-Machine &amp; Split-Screen Ghost Diff
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-2xl">
            Slide horizontally across historical competitor snapshots to reveal exact visual landing page and pricing mutations over time.
          </p>
        </div>

        {/* Competitor Toggle Pills */}
        <div className="flex items-center gap-2 bg-[#111318] p-1.5 rounded-xl border border-[#262A33] text-xs font-mono">
          <button
            onClick={() => {
              sounds.playChirp();
              setSelectedCompId("comp-acme");
            }}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
              selectedCompId === "comp-acme" ? "bg-blue-600 text-white" : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Acme Cloud
          </button>
          <button
            onClick={() => {
              sounds.playChirp();
              setSelectedCompId("comp-nova");
            }}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
              selectedCompId === "comp-nova" ? "bg-blue-600 text-white" : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            NovaAI
          </button>
        </div>
      </div>

      {/* Interactive Controls Bar */}
      <div className="p-4 rounded-xl bg-[#111318] border border-[#262A33] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-mono">
        <div className="flex items-center gap-3">
          <Split className="w-4 h-4 text-blue-400" />
          <span className="text-zinc-300 font-bold uppercase">Drag Split-Screen Position:</span>
          <span className="text-blue-400 font-bold bg-blue-500/10 px-2 py-0.5 rounded">
            {splitPos}% Revised / {100 - splitPos}% Legacy
          </span>
        </div>

        <div className="flex items-center gap-4 flex-1 max-w-xs">
          <span className="text-[10px] text-red-400">Past</span>
          <input
            type="range"
            min={5}
            max={95}
            value={splitPos}
            onChange={handleSliderChange}
            className="w-full accent-blue-500 cursor-pointer"
          />
          <span className="text-[10px] text-emerald-400">Present</span>
        </div>

        <button
          onClick={() => {
            sounds.playChirp();
            setIsGhostOverlay(!isGhostOverlay);
          }}
          className={`px-3 py-1.5 rounded-lg border font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
            isGhostOverlay
              ? "bg-purple-600/20 border-purple-500 text-purple-300"
              : "bg-[#0C0E12] border-[#262A33] text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Ghost Overlay: {isGhostOverlay ? "ON" : "OFF"}</span>
        </button>
      </div>

      {/* Main Split-Screen Visual Comparison Stage */}
      <div className="relative rounded-2xl bg-[#0C0E12] border border-[#262A33] overflow-hidden shadow-2xl h-[520px]">
        {/* LEFT / UNDER LAYER: BEFORE STATE (PAST) */}
        <div className="absolute inset-0 p-8 flex flex-col justify-between bg-radial from-[#151922] to-[#0A0C10] border-r border-[#262A33]">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded text-xs font-mono font-bold bg-red-500/15 text-red-400 border border-red-500/30 uppercase">
                {currentPair.before.label}
              </span>
              <span className="text-xs font-mono text-zinc-500">
                Observed: {currentPair.before.date}
              </span>
            </div>

            <div className="space-y-2 pt-2">
              <h2 className="text-xl sm:text-2xl font-bold text-zinc-200 max-w-md">
                {currentPair.before.tagline}
              </h2>
            </div>

            {/* Pricing Card Simulation */}
            <div className="p-5 rounded-xl bg-[#111318]/90 border border-red-500/30 max-w-md space-y-3 shadow-lg">
              <div className="flex justify-between items-baseline">
                <span className="text-xs font-bold uppercase font-mono text-zinc-400">Pro Subscription</span>
                <span className="text-2xl font-bold font-mono text-zinc-100">{currentPair.before.proPrice}</span>
              </div>
              <ul className="space-y-1.5 text-xs text-zinc-400 font-sans">
                {currentPair.before.features.map((feat, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="text-zinc-600">•</span>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="text-[10px] font-mono text-zinc-500 truncate">
            Digest: <span className="text-zinc-400">{currentPair.before.sourceDigest}</span>
          </div>
        </div>

        {/* RIGHT / OVERLAY LAYER: AFTER STATE (PRESENT) CLIPPED BY SPLIT POSITION */}
        <div
          style={{ clipPath: `inset(0 0 0 ${splitPos}%)` }}
          className={`absolute inset-0 p-8 flex flex-col justify-between bg-radial from-[#0E1726] to-[#090D14] border-l border-blue-500/40 transition-none ${
            isGhostOverlay ? "opacity-85 mix-blend-screen" : ""
          }`}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded text-xs font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 uppercase">
                {currentPair.after.label}
              </span>
              <span className="text-xs font-mono text-emerald-400 font-semibold">
                ✓ Cryptographically Verified
              </span>
            </div>

            <div className="space-y-2 pt-2">
              <h2 className="text-xl sm:text-2xl font-bold text-zinc-100 max-w-md">
                {currentPair.after.tagline}
              </h2>
            </div>

            {/* Revised Pricing Card Simulation with Highlighted Changes */}
            <div className="p-5 rounded-xl bg-[#111318]/90 border border-emerald-500/40 max-w-md space-y-3 shadow-2xl relative overflow-hidden">
              <BorderBeam size={160} duration={6} colorFrom="#10B981" colorTo="#3B82F6" />
              <div className="flex justify-between items-baseline">
                <span className="text-xs font-bold uppercase font-mono text-zinc-300">Pro Subscription</span>
                <span className="text-2xl font-bold font-mono text-emerald-400">{currentPair.after.proPrice}</span>
              </div>
              <ul className="space-y-1.5 text-xs text-zinc-300 font-sans">
                {currentPair.after.features.map((feat, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className={feat.includes("(NEW)") ? "text-emerald-400 font-bold" : "text-zinc-600"}>
                      ✓
                    </span>
                    <span className={feat.includes("(NEW)") ? "text-emerald-300 font-semibold" : ""}>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="text-[10px] font-mono text-zinc-500 truncate">
            Digest: <span className="text-emerald-400">{currentPair.after.sourceDigest}</span>
          </div>
        </div>

        {/* DRAGGABLE VERTICAL DIVIDER LINE WITH PULSING HANDLE */}
        <div
          style={{ left: `${splitPos}%` }}
          className="absolute top-0 bottom-0 w-1 bg-blue-500 shadow-xl pointer-events-none z-40 -translate-x-1/2 flex items-center justify-center"
        >
          <div className="w-8 h-8 rounded-full bg-blue-600 border-2 border-white shadow-2xl flex items-center justify-center text-white text-[10px] font-bold">
            ⇄
          </div>
        </div>
      </div>

      {/* Bottom Provenance Strip */}
      <div className="p-5 rounded-xl bg-[#111318] border border-[#262A33] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-200 font-mono">
              Visual State Hash Verification
            </span>
          </div>
          <p className="text-xs text-zinc-400">
            Both historical DOM captures are preserved with immutable SHA-256 hashes in PRYSM&apos;s audit vault.
          </p>
        </div>

        <button
          onClick={() => {
            sounds.playSuccess();
            openEvidenceDrawer("ev-acme-pricing-20261023");
          }}
          className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white flex items-center gap-1.5 self-start sm:self-auto transition-colors cursor-pointer"
        >
          <span>Inspect Provenance Artifact</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
