"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/lib/context/AppContext";
import { Competitor } from "@/lib/types";
import { sounds } from "@/lib/utils/sound";
import {
  Globe,
  Compass,
  Zap,
  Flame,
  ShieldCheck,
  Maximize2,
  Sliders,
  RotateCw,
  Sparkles,
  ArrowRight,
  Eye,
  Info,
  Layers,
  Crosshair,
  Activity,
  Bot,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { BorderBeam } from "@/components/ui/BorderBeam";
import { LivePulseIndicator } from "@/components/ui/LivePulseIndicator";

export default function MarketTopologyPage() {
  const { competitors, openEvidenceDrawer, openChatWithPrompt, theme } = useApp();
  const isDarkMode = theme === "dark";
  const [selectedComp, setSelectedComp] = useState<Competitor | null>(competitors[0] || null);
  const [orbitSpeed, setOrbitSpeed] = useState<number>(1);
  const [showVectors, setShowVectors] = useState<boolean>(true);
  const [showGravityRings, setShowGravityRings] = useState<boolean>(true);
  const [currentAngle, setCurrentAngle] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // Smooth orbital rotation loop
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentAngle((prev) => (prev + 0.4 * orbitSpeed) % 360);
    }, 30);
    return () => clearInterval(interval);
  }, [orbitSpeed, isPaused]);

  // Canvas coordinate system: 900 x 540 (Center = 450, 270)
  const CANVAS_W = 900;
  const CANVAS_H = 540;
  const CX = CANVAS_W / 2;
  const CY = CANVAS_H / 2;

  // Separate competitors into 3 distinct, non-colliding orbital tiers
  // Inner: Threat >= 80, Mid: 70 <= Threat < 80, Outer: Threat < 70
  const orbitalNodes = competitors.map((comp, idx) => {
    let orbitTierRadius = 215; // default mid
    let tierSpeed = 1.0;

    if (comp.threatScore >= 80) {
      orbitTierRadius = 140; // Danger Zone (closer)
      tierSpeed = 1.2;
    } else if (comp.threatScore < 70) {
      orbitTierRadius = 280; // Outer Orbit
      tierSpeed = 0.8;
    }

    // Phase offset distributed evenly so nodes in the same tier never collide
    const phaseOffset = (idx * (360 / competitors.length)) * (Math.PI / 180);
    const angleRad = (currentAngle * tierSpeed * Math.PI) / 180 + phaseOffset;

    // Isometric perspective tilt (Y squashed by 0.65)
    const x = Math.cos(angleRad) * orbitTierRadius;
    const y = Math.sin(angleRad) * orbitTierRadius * 0.65;

    return {
      comp,
      x,
      y,
      svgX: CX + x,
      svgY: CY + y,
      orbitTierRadius,
      size: Math.max(38, Math.min(54, (comp.threatScore / 100) * 52)),
    };
  });

  const handleSelectNode = (comp: Competitor) => {
    sounds.playChirp();
    setSelectedComp(comp);
  };

  return (
    <div className="space-y-6 pb-20 max-w-6xl mx-auto select-none">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/30">
              NEXT-GEN VISUAL INTELLIGENCE
            </span>
            <span className="text-app-muted">·</span>
            <LivePulseIndicator status="active" label="Orbital Dynamics Engaged" sublabel="Live Gravitational Matrix" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-app-primary tracking-tight">
            Market Constellation & Topology Map
          </h1>
          <p className="text-xs sm:text-sm text-app-secondary mt-1 max-w-2xl">
            An interactive isometric market simulation where competitors orbit around your strategic core. Gravitational distance scales with threat level; node size scales with market capability.
          </p>
        </div>

        {/* Tactical Controls */}
        <div className="flex items-center gap-2 bg-surface-primary p-1.5 rounded-xl border border-app text-xs font-mono shadow-xs">
          <button
            onClick={() => {
              sounds.playTick();
              setIsPaused(!isPaused);
            }}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
              isPaused
                ? "bg-amber-500/20 text-amber-600 dark:text-amber-300 border border-amber-500/40"
                : "bg-surface-secondary text-app-primary hover:bg-slate-100 dark:hover:bg-white/[0.04]"
            }`}
          >
            {isPaused ? "Resume Orbit" : "Pause Orbit"}
          </button>

          <button
            onClick={() => {
              sounds.playTick();
              setShowVectors(!showVectors);
            }}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
              showVectors
                ? "bg-blue-600 text-white shadow-xs"
                : "text-app-muted hover:text-app-primary"
            }`}
          >
            Vectors: {showVectors ? "ON" : "OFF"}
          </button>
        </div>
      </div>

      {/* Main Interactive Solar Canvas */}
      <div className="relative rounded-2xl border border-app bg-slate-100/70 dark:bg-[#07090E] overflow-hidden shadow-xs h-[560px] flex items-center justify-center transition-colors">
        {/* Ambient starfield & radial space grid */}
        <div className="absolute inset-0 pointer-events-none opacity-60">
          <div
            className={`absolute inset-0 ${
              isDarkMode
                ? "bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.18)_0%,transparent_70%)]"
                : "bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.08)_0%,transparent_70%)]"
            }`}
          />
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="spaceGrid" width="48" height="48" patternUnits="userSpaceOnUse">
                <path
                  d="M 48 0 L 0 0 0 48"
                  fill="none"
                  stroke={isDarkMode ? "#262A33" : "#CBD5E1"}
                  strokeOpacity={isDarkMode ? "0.4" : "0.75"}
                  strokeWidth="1"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#spaceGrid)" />
          </svg>
        </div>

        {/* Gravity Elliptical Rings */}
        {showGravityRings && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            {/* Inner Danger Ring: 140px radius */}
            <div className="w-[280px] h-[182px] rounded-full border border-red-500/40 dark:border-red-500/25 border-dashed" />
            {/* Mid Orbit: 215px radius */}
            <div className="absolute w-[430px] h-[280px] rounded-full border border-amber-500/40 dark:border-amber-500/20 border-dashed" />
            {/* Outer Orbit: 280px radius */}
            <div className="absolute w-[560px] h-[364px] rounded-full border border-blue-500/35 dark:border-blue-500/15 border-dashed" />
          </div>
        )}

        {/* SVG Threat Vector Lines (Uses precise ViewBox coordinates so lines never glitch or shoot to corner) */}
        <svg
          viewBox={`0 0 ${CANVAS_W} ${CANVAS_H}`}
          className="absolute inset-0 w-full h-full pointer-events-none z-10"
        >
          {showVectors &&
            orbitalNodes.map((node, i) => {
              const isSelected = selectedComp?.id === node.comp.id;
              const strokeColor = isSelected
                ? "#2563EB"
                : node.comp.threatScore >= 80
                ? "#EF4444"
                : isDarkMode
                ? "#6366F1"
                : "#4F46E5";

              return (
                <g key={i}>
                  <line
                    x1={CX}
                    y1={CY}
                    x2={node.svgX}
                    y2={node.svgY}
                    stroke={strokeColor}
                    strokeWidth={isSelected ? 2.5 : node.comp.threatScore >= 80 ? 1.5 : 1}
                    strokeDasharray={isSelected ? "none" : "3 3"}
                    strokeOpacity={isSelected ? 0.95 : node.comp.threatScore >= 80 ? 0.7 : 0.45}
                  />
                </g>
              );
            })}
        </svg>

        {/* CENTER CORE: OUR PLATFORM */}
        <div className="relative z-20 flex flex-col items-center justify-center group cursor-pointer">
          <div className="relative w-20 h-20 rounded-2xl bg-linear-to-tr from-blue-600 via-indigo-600 to-violet-700 p-0.5 shadow-xl shadow-blue-500/30 flex items-center justify-center">
            <BorderBeam size={120} duration={6} colorFrom="#38BDF8" colorTo="#818CF8" />
            <div className="w-full h-full rounded-2xl bg-white dark:bg-[#0E1015] flex flex-col items-center justify-center p-2 text-center shadow-inner">
              <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400 mb-0.5 animate-bounce" />
              <span className="font-mono text-[10px] font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                OUR CORE
              </span>
              <span className="text-[9px] text-blue-600 dark:text-blue-400 font-mono font-semibold">
                Baseline
              </span>
            </div>
          </div>
        </div>

        {/* ORBITAL COMPETITOR NODES */}
        {orbitalNodes.map((node) => {
          const isSelected = selectedComp?.id === node.comp.id;
          const isHighThreat = node.comp.threatScore >= 80;

          return (
            <div
              key={node.comp.id}
              onClick={() => handleSelectNode(node.comp)}
              style={{
                transform: `translate(calc(-50% + ${node.x}px), calc(-50% + ${node.y}px))`,
                left: "50%",
                top: "50%",
              }}
              className="absolute z-30 cursor-pointer transition-transform duration-75 hover:scale-125 group"
            >
              <div
                style={{
                  width: `${node.size}px`,
                  height: `${node.size}px`,
                }}
                className={`relative rounded-xl flex items-center justify-center font-mono font-bold text-xs transition-all shadow-md ${
                  isSelected
                    ? "bg-blue-600 text-white shadow-xl ring-4 ring-blue-400/50 scale-110"
                    : isHighThreat
                    ? "bg-white dark:bg-slate-900 border-2 border-red-500 text-red-600 dark:text-red-400 shadow-md shadow-red-500/20"
                    : "bg-white dark:bg-slate-900 border border-slate-300 dark:border-blue-500/40 text-slate-800 dark:text-zinc-200"
                }`}
              >
                {isSelected && (
                  <BorderBeam size={100} duration={4} colorFrom="#60A5FA" colorTo="#F43F5E" />
                )}
                <span>{node.comp.logoText || node.comp.name.slice(0, 2).toUpperCase()}</span>

                {/* Threat Score Badge Pill */}
                <span className="absolute -top-2.5 -right-2.5 px-1.5 py-0.2 rounded-full text-[9px] font-mono font-extrabold bg-slate-900 text-white shadow-xs border border-white/20">
                  {node.comp.threatScore}
                </span>
              </div>

              {/* Floating Name Label on Hover/Selected */}
              <div
                className={`absolute top-full left-1/2 -translate-x-1/2 mt-1.5 px-2.5 py-0.5 rounded-md bg-slate-900 text-[10px] font-mono text-white whitespace-nowrap pointer-events-none transition-all shadow-xl z-50 ${
                  isSelected ? "opacity-100 scale-100" : "opacity-0 group-hover:opacity-100 scale-95"
                }`}
              >
                {node.comp.name}
              </div>
            </div>
          );
        })}

        {/* Orbit Legend Watermark */}
        <div className="absolute bottom-4 left-6 text-[10px] font-mono space-y-1.5 pointer-events-none bg-white/95 dark:bg-black/60 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-200 dark:border-white/10 shadow-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            <span className="text-slate-700 dark:text-zinc-300 font-medium">Inner Orbit: Immediate Danger Zone (&gt; 80 Threat)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="text-slate-700 dark:text-zinc-300 font-medium">Mid Orbit: Active Competitors (70–79 Threat)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            <span className="text-slate-700 dark:text-zinc-300 font-medium">Outer Orbit: Emerging &amp; Secondary Competitors</span>
          </div>
        </div>

        {/* Speed Slider in bottom right */}
        <div className="absolute bottom-4 right-6 flex items-center gap-2 bg-white/95 dark:bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200 dark:border-white/10 text-xs font-mono shadow-xs">
          <span className="text-[10px] text-slate-700 dark:text-zinc-300 uppercase font-semibold">Orbit Velocity:</span>
          <input
            type="range"
            min={0.2}
            max={3}
            step={0.2}
            value={orbitSpeed}
            onChange={(e) => setOrbitSpeed(Number(e.target.value))}
            aria-label="Orbit Velocity Slider"
            className="w-24 accent-blue-600 dark:accent-blue-500 cursor-pointer h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg"
          />
          <span className="text-blue-600 dark:text-blue-400 font-bold">{orbitSpeed}x</span>
        </div>
      </div>

      {/* Selected Entity Holographic Telemetry HUD */}
      {selectedComp && (
        <div className="dashboard-card p-6 rounded-2xl border border-app bg-surface-primary space-y-5 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-app pb-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-blue-600/10 border border-blue-500/30 text-blue-600 dark:text-blue-400 font-mono font-bold flex items-center justify-center text-sm shadow-xs">
                {selectedComp.logoText}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-lg font-bold text-app-primary">{selectedComp.name}</h2>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 font-bold">
                    Threat: {selectedComp.threatScore}/100
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 font-bold">
                    {selectedComp.category}
                  </span>
                </div>
                <p className="text-xs text-app-secondary mt-0.5">{selectedComp.tagline}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() =>
                  openChatWithPrompt(
                    `Analyze competitor ${selectedComp.name} (Threat score ${selectedComp.threatScore}/100). What are their key strengths and where can we exploit their positioning?`
                  )
                }
                className="px-3.5 py-1.5 rounded-lg border border-app bg-surface-secondary hover:bg-blue-50 dark:hover:bg-blue-500/10 text-xs font-semibold text-app-primary flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Bot className="w-3.5 h-3.5 text-blue-500" />
                <span>Ask Copilot</span>
              </button>

              <Link
                href={`/competitors/${selectedComp.id}`}
                className="px-3.5 py-1.5 rounded-lg bg-surface-secondary hover:bg-slate-100 dark:hover:bg-white/[0.04] border border-app text-xs font-semibold text-app-primary flex items-center gap-1.5 transition-colors"
              >
                <span>Full Profile</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              <button
                onClick={() => {
                  sounds.playSuccess();
                  openEvidenceDrawer(selectedComp.latestChange.evidenceId);
                }}
                className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Inspect Cryptographic Evidence</span>
              </button>
            </div>
          </div>

          {/* Metric Telemetry Radar Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
            <div className="p-3 rounded-xl bg-surface-secondary border border-app space-y-1">
              <span className="text-[10px] text-app-muted uppercase block font-semibold">Pricing Pressure</span>
              <div className="text-base font-bold text-emerald-600 dark:text-emerald-400">
                {selectedComp.metrics.pricingPressure}/100
              </div>
            </div>

            <div className="p-3 rounded-xl bg-surface-secondary border border-app space-y-1">
              <span className="text-[10px] text-app-muted uppercase block font-semibold">Feature Velocity</span>
              <div className="text-base font-bold text-indigo-600 dark:text-indigo-400">
                {selectedComp.metrics.featureVelocity}/100
              </div>
            </div>

            <div className="p-3 rounded-xl bg-surface-secondary border border-app space-y-1">
              <span className="text-[10px] text-app-muted uppercase block font-semibold">AI Capability</span>
              <div className="text-base font-bold text-purple-600 dark:text-purple-400">
                {selectedComp.metrics.aiCapability}/100
              </div>
            </div>

            <div className="p-3 rounded-xl bg-surface-secondary border border-app space-y-1">
              <span className="text-[10px] text-app-muted uppercase block font-semibold">Workflow Automation</span>
              <div className="text-base font-bold text-sky-600 dark:text-sky-400">
                {selectedComp.metrics.automation}/100
              </div>
            </div>
          </div>

          {/* Latest Observed Signal Banner */}
          <div className="p-4 rounded-xl bg-surface-secondary border border-app flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <Zap className="w-4 h-4 text-amber-500 shrink-0" />
              <div>
                <span className="text-[10px] font-mono uppercase text-app-muted block font-semibold">
                  Latest Verified Mutation ({selectedComp.lastScanTime})
                </span>
                <span className="text-app-primary font-semibold">{selectedComp.latestChange.title}</span>
              </div>
            </div>

            <button
              onClick={() => {
                sounds.playChirp();
                openEvidenceDrawer(selectedComp.latestChange.evidenceId);
              }}
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-mono flex items-center gap-1 self-start sm:self-auto cursor-pointer"
            >
              <span>View Diff &amp; Hash</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
