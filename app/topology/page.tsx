"use client";

import React, { useState, useEffect, useRef } from "react";
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
} from "lucide-react";
import Link from "next/link";
import { BorderBeam } from "@/components/ui/BorderBeam";
import { LivePulseIndicator } from "@/components/ui/LivePulseIndicator";

export default function MarketTopologyPage() {
  const { competitors, openEvidenceDrawer } = useApp();
  const [selectedComp, setSelectedComp] = useState<Competitor | null>(competitors[0] || null);
  const [orbitSpeed, setOrbitSpeed] = useState<number>(1);
  const [showVectors, setShowVectors] = useState<boolean>(true);
  const [showGravityRings, setShowGravityRings] = useState<boolean>(true);
  const [currentAngle, setCurrentAngle] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // Animated rotation loop
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentAngle((prev) => (prev + 0.5 * orbitSpeed) % 360);
    }, 40);
    return () => clearInterval(interval);
  }, [orbitSpeed, isPaused]);

  // Compute orbital positions based on threat scores and categories
  const orbitalNodes = competitors.map((comp, idx) => {
    // Higher threat = closer orbit distance to center!
    const baseRadius = 260 - (comp.threatScore / 100) * 140; // 120px to 260px
    const phaseOffset = (idx * (360 / competitors.length)) * (Math.PI / 180);
    const speedMultiplier = 0.8 + (idx % 3) * 0.4;
    const currentRad = (currentAngle * speedMultiplier * Math.PI) / 180 + phaseOffset;

    const x = Math.cos(currentRad) * baseRadius;
    const y = Math.sin(currentRad) * baseRadius * 0.72; // Isometric tilt effect!

    return {
      comp,
      x,
      y,
      baseRadius,
      size: Math.max(34, Math.min(54, (comp.threatScore / 100) * 52)),
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
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-purple-500/10 text-purple-400 border border-purple-500/30">
              NEXT-GEN VISUAL INTELLIGENCE
            </span>
            <span className="text-zinc-600">·</span>
            <LivePulseIndicator status="active" label="Orbital Dynamics Engaged" sublabel="Live Gravitational Matrix" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F5F7FA] tracking-tight">
            Market Constellation & Topology Map
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-2xl">
            An interactive isometric market simulation where competitors orbit around your strategic core. Gravitational distance scales with threat level; node size scales with market capability.
          </p>
        </div>

        {/* Tactical Controls */}
        <div className="flex items-center gap-2 bg-[#111318] p-1.5 rounded-xl border border-[#262A33] text-xs font-mono">
          <button
            onClick={() => {
              sounds.playTick();
              setIsPaused(!isPaused);
            }}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
              isPaused ? "bg-amber-500/20 text-amber-300 border border-amber-500/40" : "bg-[#181B22] text-zinc-300"
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
              showVectors ? "bg-blue-600 text-white" : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Vectors: {showVectors ? "ON" : "OFF"}
          </button>
        </div>
      </div>

      {/* Main Interactive Solar Canvas */}
      <div className="relative rounded-2xl bg-[#090B0F] border border-[#262A33] overflow-hidden shadow-2xl h-[560px] flex items-center justify-center">
        {/* Ambient starfield & radial space grid */}
        <div className="absolute inset-0 pointer-events-none opacity-40">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.12)_0%,transparent_70%)]" />
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="spaceGrid" width="48" height="48" patternUnits="userSpaceOnUse">
                <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#262A33" strokeOpacity="0.4" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#spaceGrid)" />
          </svg>
        </div>

        {/* Gravity Elliptical Rings */}
        {showGravityRings && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className="w-[240px] h-[172px] rounded-full border border-red-500/20 border-dashed animate-pulse" />
            <div className="absolute w-[380px] h-[272px] rounded-full border border-amber-500/15 border-dashed" />
            <div className="absolute w-[520px] h-[374px] rounded-full border border-blue-500/10 border-dashed" />
          </div>
        )}

        {/* SVG Threat Vector Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
          {showVectors &&
            orbitalNodes.map((node, i) => {
              const centerX = 50; // percentage
              const centerY = 50;
              const isSelected = selectedComp?.id === node.comp.id;

              return (
                <g key={i}>
                  <line
                    x1="50%"
                    y1="50%"
                    x2={`calc(50% + ${node.x}px)`}
                    y2={`calc(50% + ${node.y}px)`}
                    stroke={isSelected ? "#3B82F6" : node.comp.threatScore > 80 ? "#EF4444" : "#6366F1"}
                    strokeWidth={isSelected ? 2 : 1}
                    strokeDasharray={isSelected ? "none" : "3 3"}
                    strokeOpacity={isSelected ? 0.8 : 0.35}
                  />
                </g>
              );
            })}
        </svg>

        {/* CENTER CORE: OUR PLATFORM */}
        <div className="relative z-20 flex flex-col items-center justify-center group cursor-pointer">
          <div className="relative w-20 h-20 rounded-2xl bg-linear-to-tr from-blue-600 via-indigo-600 to-violet-700 p-0.5 shadow-2xl shadow-blue-500/40 flex items-center justify-center">
            <BorderBeam size={120} duration={6} colorFrom="#38BDF8" colorTo="#818CF8" />
            <div className="w-full h-full rounded-2xl bg-[#0E1015] flex flex-col items-center justify-center p-2 text-center">
              <Sparkles className="w-5 h-5 text-blue-400 mb-0.5 animate-bounce" />
              <span className="font-mono text-[10px] font-bold text-white uppercase tracking-wider">
                OUR CORE
              </span>
              <span className="text-[9px] text-zinc-400 font-mono">Baseline</span>
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
                className={`relative rounded-xl flex items-center justify-center font-mono font-bold text-xs transition-all ${
                  isSelected
                    ? "bg-blue-600 text-white shadow-xl ring-4 ring-blue-400/50 scale-110"
                    : isHighThreat
                    ? "bg-[#181B24] border-2 border-red-500/80 text-red-400 shadow-lg shadow-red-500/20"
                    : "bg-[#14171E] border border-blue-500/40 text-zinc-200"
                }`}
              >
                {isSelected && (
                  <BorderBeam size={100} duration={4} colorFrom="#60A5FA" colorTo="#F43F5E" />
                )}
                <span>{node.comp.logoText || node.comp.name.slice(0, 2).toUpperCase()}</span>

                {/* Threat Score Badge Pill */}
                <span className="absolute -top-2 -right-2 px-1.5 py-0.2 rounded-full text-[9px] font-mono font-extrabold bg-black border border-zinc-700 text-white">
                  {node.comp.threatScore}
                </span>
              </div>

              {/* Floating Name Label */}
              <div
                className={`absolute top-full left-1/2 -translate-x-1/2 mt-1 px-2 py-0.5 rounded bg-black/90 border border-zinc-800 text-[10px] font-mono text-zinc-200 whitespace-nowrap pointer-events-none transition-all ${
                  isSelected ? "opacity-100 scale-100" : "opacity-0 group-hover:opacity-100 scale-95"
                }`}
              >
                {node.comp.name}
              </div>
            </div>
          );
        })}

        {/* Orbit Legend Watermark */}
        <div className="absolute bottom-4 left-6 text-[10px] font-mono text-zinc-500 space-y-1 pointer-events-none">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            <span>Inner Orbit: Immediate Danger Zone (&gt; 80 Threat)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            <span>Outer Orbit: Emerging &amp; Secondary Competitors</span>
          </div>
        </div>

        {/* Speed Slider in bottom right */}
        <div className="absolute bottom-4 right-6 flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-[#262A33] text-xs font-mono">
          <span className="text-[10px] text-zinc-400 uppercase">Orbit Velocity:</span>
          <input
            type="range"
            min={0.2}
            max={3}
            step={0.2}
            value={orbitSpeed}
            onChange={(e) => setOrbitSpeed(Number(e.target.value))}
            className="w-24 accent-blue-500 cursor-pointer"
          />
          <span className="text-blue-400 font-bold">{orbitSpeed}x</span>
        </div>
      </div>

      {/* Selected Entity Holographic Telemetry HUD */}
      {selectedComp && (
        <div className="p-6 rounded-2xl bg-linear-to-br from-[#111318] to-[#151922] border border-blue-500/30 space-y-5 shadow-2xl animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#262A33] pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/40 text-blue-400 font-mono font-bold flex items-center justify-center text-sm shadow-md">
                {selectedComp.logoText}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-zinc-100">{selectedComp.name}</h2>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-red-500/10 text-red-400 border border-red-500/20 font-bold">
                    Threat: {selectedComp.threatScore}/100
                  </span>
                </div>
                <p className="text-xs text-zinc-400">{selectedComp.tagline}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href={`/competitors/${selectedComp.id}`}
                className="px-3.5 py-1.5 rounded-lg bg-[#181B22] hover:bg-[#202530] border border-[#262A33] text-xs font-semibold text-zinc-200 flex items-center gap-1.5 transition-colors"
              >
                <span>Full Deep Dive Profile</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              <button
                onClick={() => {
                  sounds.playSuccess();
                  openEvidenceDrawer(selectedComp.latestChange.evidenceId);
                }}
                className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Inspect Cryptographic Evidence</span>
              </button>
            </div>
          </div>

          {/* Metric Telemetry Radar Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
            <div className="p-3 rounded-xl bg-[#0C0E12] border border-[#262A33] space-y-1">
              <span className="text-[10px] text-zinc-500 uppercase block">Pricing Pressure</span>
              <div className="text-base font-bold text-emerald-400">
                {selectedComp.metrics.pricingPressure}/100
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#0C0E12] border border-[#262A33] space-y-1">
              <span className="text-[10px] text-zinc-500 uppercase block">Feature Velocity</span>
              <div className="text-base font-bold text-indigo-400">
                {selectedComp.metrics.featureVelocity}/100
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#0C0E12] border border-[#262A33] space-y-1">
              <span className="text-[10px] text-zinc-500 uppercase block">AI Capability</span>
              <div className="text-base font-bold text-purple-400">
                {selectedComp.metrics.aiCapability}/100
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#0C0E12] border border-[#262A33] space-y-1">
              <span className="text-[10px] text-zinc-500 uppercase block">Workflow Automation</span>
              <div className="text-base font-bold text-sky-400">
                {selectedComp.metrics.automation}/100
              </div>
            </div>
          </div>

          {/* Latest Observed Signal Banner */}
          <div className="p-4 rounded-xl bg-[#0C0E12] border border-blue-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <Zap className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <span className="text-[10px] font-mono uppercase text-zinc-500 block">
                  Latest Verified Mutation ({selectedComp.lastScanTime})
                </span>
                <span className="text-zinc-200 font-semibold">{selectedComp.latestChange.title}</span>
              </div>
            </div>

            <button
              onClick={() => {
                sounds.playChirp();
                openEvidenceDrawer(selectedComp.latestChange.evidenceId);
              }}
              className="text-xs text-blue-400 hover:text-blue-300 font-mono flex items-center gap-1 self-start sm:self-auto cursor-pointer"
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
