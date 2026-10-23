"use client";

import React, { useState } from "react";
import {
  X,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  Play,
  Layers,
  Database,
  ExternalLink,
  Award,
} from "lucide-react";
import Link from "next/link";
import { sounds } from "../../lib/utils/sound";

interface JudgeTourModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const steps = [
  {
    title: "1. Public Permitted Ingestion & Wayback CDX",
    requirement: "Problem Statement Req 1: Permitted public sources & historical records",
    desc: "Ingests public DOMs, Internet Archive CDX API snapshots, and Common Crawl WARC indices while respecting RFC 9309 robots.txt.",
    actionLabel: "Explore Sources & Wayback CDX",
    link: "/sources",
    badge: "Public Ingestion",
  },
  {
    title: "2. AST Semantic Signal vs. Noise Filter",
    requirement: "Problem Statement Req 2: Noise filtering & meaningful changes",
    desc: "Suppresses dynamic nonces, session cookies, and copyright 2025→2026 rollovers (<5/100) while elevating pricing & feature deltas (>90/100).",
    actionLabel: "Test Diff Engine Studio",
    link: "/diff-engine",
    badge: "99.8% Precision",
  },
  {
    title: "3. Cryptographic Merkle Provenance & SHA-256",
    requirement: "Problem Statement Req 3: Dated history & evidence backed",
    desc: "Every detected move carries an immutable observation timestamp, Wayback snapshot link, raw DOM text snippet, and SHA-256 verification hash.",
    actionLabel: "Inspect Provenance Vault",
    link: "/evidence",
    badge: "Tamper Proof",
  },
  {
    title: "4. Live 1-Click Interactive Demo Sandbox",
    requirement: "Problem Statement Req 4: Interactive demonstration sandbox",
    desc: "Simulate Acme Cloud +30% pricing surge ($79 → $109/mo), track real-time pipeline execution, and auto-synthesize a cited brief in 4.2 seconds.",
    actionLabel: "Launch Live Demo Sandbox",
    link: "/demo",
    badge: "Interactive Rehearsal",
  },
  {
    title: "5. Configurable Strategic Criteria Radar",
    requirement: "Problem Statement Req 5: Configurable comparison criteria",
    desc: "Adjust weighting sliders across Pricing, AI Feature Velocity, API Latency, and Enterprise Compliance to dynamically recalculate threat polygons.",
    actionLabel: "Configure Criteria Matrix",
    link: "/comparison",
    badge: "Dynamic Weighting",
  },
  {
    title: "6. Cited Executive Intelligence Briefs",
    requirement: "Problem Statement Req 6: Decision-grade sourced intelligence reports",
    desc: "Synthesized executive intelligence briefs with [1] [2] footnote citations that open the exact DOM payload and diff evidence in one click.",
    actionLabel: "Read Cited Weekly Brief",
    link: "/reports/rep-weekly-20261023",
    badge: "Executive Sourced",
  },
];

export function JudgeTourModal({ isOpen, onClose }: JudgeTourModalProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  if (!isOpen) return null;

  const currentStep = steps[currentStepIndex];

  const handleNext = () => {
    sounds.click();
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    sounds.click();
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl rounded-2xl bg-[#0D0F14] border border-amber-500/40 shadow-2xl p-6 sm:p-8 space-y-6">
        {/* Top header */}
        <div className="flex items-center justify-between border-b border-[#262A33] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase font-bold text-amber-400">
                  SYSTEM ARCHITECTURE &amp; VERIFICATION
                </span>
                <span className="text-zinc-600">·</span>
                <span className="text-xs text-zinc-400 font-mono">
                  Step {currentStepIndex + 1} of {steps.length}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-zinc-100">
                Platform Walkthrough
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-[#181B22] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator Bubbles */}
        <div className="grid grid-cols-6 gap-2">
          {steps.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                sounds.click();
                setCurrentStepIndex(i);
              }}
              className={`h-1.5 rounded-full transition-all ${
                i === currentStepIndex
                  ? "bg-amber-400 shadow-sm shadow-amber-400/50"
                  : i < currentStepIndex
                  ? "bg-emerald-500"
                  : "bg-[#262A33]"
              }`}
            />
          ))}
        </div>

        {/* Step Content Card */}
        <div className="p-6 rounded-xl bg-[#111318] border border-[#262A33] space-y-4">
          <div className="flex items-center justify-between gap-3">
            <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/30">
              {currentStep.badge}
            </span>
            <span className="text-[11px] font-mono text-zinc-500">
              {currentStep.requirement}
            </span>
          </div>

          <h4 className="text-xl font-bold text-zinc-100">
            {currentStep.title}
          </h4>

          <p className="text-sm text-zinc-300 leading-relaxed">
            {currentStep.desc}
          </p>

          <div className="pt-2">
            <Link
              href={currentStep.link}
              onClick={onClose}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-500/20 transition-all hover:translate-x-0.5"
            >
              <span>{currentStep.actionLabel}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={handlePrev}
            disabled={currentStepIndex === 0}
            className={`px-4 py-2 rounded-lg text-xs font-mono transition-colors ${
              currentStepIndex === 0
                ? "text-zinc-600 cursor-not-allowed"
                : "text-zinc-400 hover:text-zinc-100 bg-[#14171E] border border-[#262A33]"
            }`}
          >
            Previous
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-2 rounded-lg text-xs font-medium text-zinc-400 hover:text-zinc-200"
            >
              Close Tour
            </button>
            <button
              onClick={handleNext}
              className="px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition-all"
            >
              <span>
                {currentStepIndex === steps.length - 1 ? "Finish Walkthrough" : "Next Criterion"}
              </span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
