"use client";

import React, { useState, useMemo } from "react";
import { useApp } from "@/lib/context/AppContext";
import { sounds } from "@/lib/utils/sound";
import {
  Flame,
  ShieldAlert,
  Play,
  RotateCcw,
  Sparkles,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Sliders,
  DollarSign,
  Download,
  Users,
  Target,
  Swords,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { BorderBeam } from "@/components/ui/BorderBeam";
import { LivePulseIndicator } from "@/components/ui/LivePulseIndicator";

interface SimulationScenario {
  id: string;
  title: string;
  competitor: string;
  category: "pricing" | "features" | "m&a";
  description: string;
  priceDeltaPercent: number;
  featureJumpScore: number;
  marketShareShift: number; // percentage
  arrRiskK: number; // thousands of USD
  counterAction: string;
  playbookSteps: string[];
}

const PRESET_WAR_ROOM_SCENARIOS: SimulationScenario[] = [
  {
    id: "sc-acme-undercut",
    title: "Aggressive Enterprise Price War by Acme Cloud (-25%)",
    competitor: "Acme Cloud",
    category: "pricing",
    description: "Acme cuts their Enterprise plan by 25% to capture migrating mid-market accounts.",
    priceDeltaPercent: -25,
    featureJumpScore: 5,
    marketShareShift: -3.8,
    arrRiskK: 240,
    counterAction: "Deploy value-added security compliance bundling without direct price matching.",
    playbookSteps: [
      "Launch immediate Price-Lock Guarantee campaign for existing contract renewals.",
      "Bundle SOC-2 & HIPAA compliance add-on (valued at $500/mo) for free into standard tier.",
      "Equip outbound sales teams with TCO (Total Cost of Ownership) comparison calculator.",
    ],
  },
  {
    id: "sc-nova-copilot",
    title: "NovaAI Deploys Free Autonomous Reasoning Copilot",
    competitor: "NovaAI",
    category: "features",
    description: "Nova bundles agentic multi-step reasoning models for free in their starter tier.",
    priceDeltaPercent: 0,
    featureJumpScore: 28,
    marketShareShift: -5.4,
    arrRiskK: 410,
    counterAction: "Accelerate Copilot v2 launch with multi-repo deterministic code indexing.",
    playbookSteps: [
      "Prioritize agentic workflow automation in next 14-day sprint roadmap.",
      "Publish benchmark whitepaper proving our deterministic auditability vs Nova's hallucination risks.",
      "Offer 50,000 free token credits for verified developer signups.",
    ],
  },
  {
    id: "sc-orbit-acquisition",
    title: "OrbitCRM Acquires Workflow Automation Startup",
    competitor: "OrbitCRM",
    category: "m&a",
    description: "Orbit closes $45M acquisition of ZapFlow to consolidate native automation.",
    priceDeltaPercent: 10,
    featureJumpScore: 20,
    marketShareShift: -2.9,
    arrRiskK: 185,
    counterAction: "Strengthen open webhook and Kafka stream connector ecosystem.",
    playbookSteps: [
      "Ship native Zapier and Make.com two-way synchronization connectors.",
      "Target Orbit customers frustrated by migration lock-in with one-click CRM import script.",
      "Execute marketing campaign highlighting our vendor-neutral API ecosystem.",
    ],
  },
];

export default function WarRoomPage() {
  const { competitors, openEvidenceDrawer } = useApp();

  const [selectedScenario, setSelectedScenario] = useState<SimulationScenario>(PRESET_WAR_ROOM_SCENARIOS[0]);
  const [customPriceDelta, setCustomPriceDelta] = useState<number>(-25);
  const [customFeatureDelta, setCustomFeatureDelta] = useState<number>(10);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simulatedRuns, setSimulatedRuns] = useState<number>(1000);

  // Dynamic simulation outcomes
  const projectedLoss = useMemo(() => {
    const base = Math.abs(customPriceDelta) * 9.5 + customFeatureDelta * 14.2;
    return Math.round(base);
  }, [customPriceDelta, customFeatureDelta]);

  // Projected trajectory data for Recharts
  const trajectoryData = useMemo(() => {
    return [
      { month: "Current", baselineShare: 24, projectedShare: 24, threatImpact: 0 },
      { month: "+1 Mo", baselineShare: 25, projectedShare: 23.2, threatImpact: 8 },
      { month: "+2 Mo", baselineShare: 26.5, projectedShare: 22.1, threatImpact: 19 },
      { month: "+3 Mo", baselineShare: 28, projectedShare: 21.0, threatImpact: 31 },
      { month: "+4 Mo", baselineShare: 29.5, projectedShare: 20.2, threatImpact: 42 },
      { month: "+6 Mo", baselineShare: 32, projectedShare: 19.5, threatImpact: 58 },
    ];
  }, []);

  const handleRunSimulation = () => {
    sounds.playAlert();
    setIsSimulating(true);
    setTimeout(() => {
      sounds.playSuccess();
      setIsSimulating(false);
    }, 800);
  };

  const handleSelectScenario = (sc: SimulationScenario) => {
    sounds.playTick();
    setSelectedScenario(sc);
    setCustomPriceDelta(sc.priceDeltaPercent);
    setCustomFeatureDelta(sc.featureJumpScore);
  };

  return (
    <div className="space-y-8 pb-20 max-w-6xl mx-auto">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-red-500/10 text-red-400 border border-red-500/20">
            STRATEGIC WAR ROOM &amp; PREDICTIVE MODELING
          </span>
          <span className="text-zinc-500">·</span>
          <LivePulseIndicator status="alert" label="Monte Carlo Engine Ready" sublabel="1,000 Iterations" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F5F7FA] tracking-tight">
          Competitor Scenario &amp; Counter-Offensive Simulator
        </h1>
        <p className="text-sm text-zinc-400 leading-relaxed max-w-3xl">
          Model potential competitor moves before they happen. Simulate enterprise price wars, stealth feature releases, and positioning assaults with automated predictive risk modeling and counter-playbooks.
        </p>
      </div>

      {/* Grid: Scenario Selection & Interactive Sliders */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Preset Scenarios */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-2xl bg-[#111318] border border-[#262A33] space-y-4 shadow-xl">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-200 font-mono flex items-center gap-2">
              <Swords className="w-4 h-4 text-red-400" />
              <span>Select Competitive Assault Scenario</span>
            </span>

            <div className="space-y-2.5">
              {PRESET_WAR_ROOM_SCENARIOS.map((sc) => {
                const isSelected = selectedScenario.id === sc.id;
                return (
                  <div
                    key={sc.id}
                    onClick={() => handleSelectScenario(sc)}
                    className={`relative p-3.5 rounded-xl border text-left cursor-pointer transition-all overflow-hidden ${
                      isSelected
                        ? "bg-red-500/10 border-red-500/50 shadow-md ring-1 ring-red-500/30"
                        : "bg-[#0C0E12] border-[#262A33] hover:border-zinc-700"
                    }`}
                  >
                    {isSelected && (
                      <BorderBeam size={160} duration={6} colorFrom="#EF4444" colorTo="#F97316" />
                    )}
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-red-400 font-mono">
                        {sc.competitor}
                      </span>
                      <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.2 rounded border border-amber-500/20">
                        {sc.category.toUpperCase()}
                      </span>
                    </div>
                    <h3 className="text-xs font-bold text-zinc-100">{sc.title}</h3>
                    <p className="text-[11px] text-zinc-400 mt-1 leading-normal">
                      {sc.description}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Custom Sliders for Fine-Tuning */}
            <div className="pt-3 border-t border-[#1D212B] space-y-4 text-xs font-mono">
              <div className="space-y-1.5">
                <div className="flex justify-between text-zinc-300">
                  <span>Competitor Price Shift:</span>
                  <span className={customPriceDelta < 0 ? "text-red-400 font-bold" : "text-emerald-400 font-bold"}>
                    {customPriceDelta}%
                  </span>
                </div>
                <input
                  type="range"
                  min={-50}
                  max={50}
                  step={5}
                  value={customPriceDelta}
                  onChange={(e) => setCustomPriceDelta(Number(e.target.value))}
                  className="w-full accent-red-500 cursor-pointer"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-zinc-300">
                  <span>Competitor Feature Velocity Jump:</span>
                  <span className="text-indigo-400 font-bold">+{customFeatureDelta} pts</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={40}
                  step={2}
                  value={customFeatureDelta}
                  onChange={(e) => setCustomFeatureDelta(Number(e.target.value))}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
              </div>

              <button
                onClick={handleRunSimulation}
                disabled={isSimulating}
                className="w-full py-3 rounded-xl bg-linear-to-r from-red-600 via-rose-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-red-500/20 transition-all cursor-pointer"
              >
                <Play className={`w-4 h-4 fill-current ${isSimulating ? "animate-spin" : ""}`} />
                <span>{isSimulating ? "Running Monte Carlo (1,000 iterations)..." : "Run War Room Simulation"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Projected Trajectory & Playbook */}
        <div className="lg:col-span-7 space-y-4">
          {/* Key Impact Forecast Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-xl bg-[#111318] border border-red-500/30 space-y-1">
              <span className="text-[10px] uppercase font-mono text-zinc-400 block">
                Estimated ARR at Risk
              </span>
              <div className="text-xl font-bold font-mono text-red-400">
                -${projectedLoss}k
              </div>
              <span className="text-[10px] text-zinc-500 font-mono">Annualized churn exposure</span>
            </div>

            <div className="p-4 rounded-xl bg-[#111318] border border-amber-500/30 space-y-1">
              <span className="text-[10px] uppercase font-mono text-zinc-400 block">
                Market Share Delta
              </span>
              <div className="text-xl font-bold font-mono text-amber-400">
                {selectedScenario.marketShareShift}%
              </div>
              <span className="text-[10px] text-zinc-500 font-mono">6-month projection</span>
            </div>

            <div className="p-4 rounded-xl bg-[#111318] border border-emerald-500/30 space-y-1">
              <span className="text-[10px] uppercase font-mono text-zinc-400 block">
                Playbook Counter Efficacy
              </span>
              <div className="text-xl font-bold font-mono text-emerald-400">
                88.5%
              </div>
              <span className="text-[10px] text-zinc-500 font-mono">Risk mitigated</span>
            </div>
          </div>

          {/* Interactive Trajectory Chart */}
          <div className="p-5 rounded-xl bg-[#111318] border border-[#262A33] space-y-3 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-200 font-mono">
                Projected Market Share Trajectory (Without Counter-Offensive)
              </span>
              <span className="text-[10px] font-mono text-zinc-500">6-Month Horizon</span>
            </div>

            <div className="h-48 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trajectoryData} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="projectedGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#EF4444" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="baselineGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1D212B" />
                  <XAxis dataKey="month" stroke="#606778" tick={{ fontSize: 10, fill: "#8E95A5" }} />
                  <YAxis stroke="#606778" tick={{ fontSize: 10, fill: "#8E95A5" }} domain={[15, 35]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0D0F14",
                      border: "1px solid #262A33",
                      borderRadius: "8px",
                      fontSize: "11px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="baselineShare"
                    name="Baseline Share %"
                    stroke="#3B82F6"
                    fill="url(#baselineGrad)"
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="projectedShare"
                    name="Impacted Share %"
                    stroke="#EF4444"
                    fill="url(#projectedGrad)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recommended Counter-Offensive Playbook */}
          <div className="p-5 rounded-xl bg-linear-to-br from-[#12151E] to-[#181D28] border border-blue-500/30 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-blue-300 font-mono">
                  Recommended Counter-Offensive Playbook
                </span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 font-bold">
                ✓ Strategy Team Assigned
              </span>
            </div>

            <p className="text-xs text-zinc-200 font-medium leading-relaxed">
              &quot;{selectedScenario.counterAction}&quot;
            </p>

            <div className="space-y-2 pt-1 border-t border-[#262A33]">
              {selectedScenario.playbookSteps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs">
                  <div className="w-4 h-4 rounded-full bg-blue-500/20 text-blue-400 font-mono text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <span className="text-zinc-300 leading-normal">{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
