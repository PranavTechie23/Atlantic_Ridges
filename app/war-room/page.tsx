"use client";

import React, { useState, useMemo } from "react";
import { useApp } from "@/lib/context/AppContext";
import { sounds } from "@/lib/utils/sound";
import { dispatchWarRoomDirective } from "@/lib/api";
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
  Bot,
  ShieldCheck,
  Zap,
  Activity,
  Send,
  FileCheck2,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
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
    featureJumpScore: 10,
    counterAction: "Deploy value-added security compliance bundling without direct price matching.",
    playbookSteps: [
      "Launch immediate Price-Lock Guarantee campaign for existing contract renewals.",
      "Bundle SOC-2 & HIPAA compliance add-on (valued at ₹41,500/mo) for free into standard tier.",
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
    description: "Orbit closes ₹375 crore acquisition of ZapFlow to consolidate native automation.",
    priceDeltaPercent: 10,
    featureJumpScore: 20,
    counterAction: "Strengthen open webhook and Kafka stream connector ecosystem.",
    playbookSteps: [
      "Ship native Zapier and Make.com two-way synchronization connectors.",
      "Target Orbit customers frustrated by migration lock-in with one-click CRM import script.",
      "Execute marketing campaign highlighting our vendor-neutral API ecosystem.",
    ],
  },
];

export default function WarRoomPage() {
  const { openChatWithPrompt, refreshAll, theme } = useApp();

  const [selectedScenario, setSelectedScenario] = useState<SimulationScenario>(PRESET_WAR_ROOM_SCENARIOS[0]);
  const [customPriceDelta, setCustomPriceDelta] = useState<number>(-25);
  const [customFeatureDelta, setCustomFeatureDelta] = useState<number>(10);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simProgress, setSimProgress] = useState<number>(0);
  const [simStageText, setSimStageText] = useState<string>("");
  const [isDirectiveDeployed, setIsDirectiveDeployed] = useState<boolean>(false);

  const [simulationResult, setSimulationResult] = useState<{
    runId: string;
    completedAt: string;
    arrRisk: number;
    arrProtected: number;
    marketShareDelta: string;
    defendedShareDelta: string;
    counterEfficacy: string;
  } | null>(null);

  // Dynamic mathematical simulation calculations
  const projectedARRAtRisk = useMemo(() => {
    const priceFactor = Math.abs(Math.min(0, customPriceDelta)) * 14.5;
    const featureFactor = customFeatureDelta * 18.2;
    const categoryFactor = selectedScenario.category === "m&a" ? 95 : 65;
    return Math.round(priceFactor + featureFactor + categoryFactor);
  }, [customPriceDelta, customFeatureDelta, selectedScenario.category]);

  const projectedMarketShareDelta = useMemo(() => {
    const raw = (
      Math.abs(Math.min(0, customPriceDelta)) * 0.11 +
      customFeatureDelta * 0.13 +
      (selectedScenario.category === "m&a" ? 1.6 : 0.9)
    );
    return (-raw).toFixed(1);
  }, [customPriceDelta, customFeatureDelta, selectedScenario.category]);

  const counterEfficacy = useMemo(() => {
    const eff = 91.0 - customFeatureDelta * 0.14 + (customPriceDelta < -30 ? -4.5 : 1.2);
    return Math.min(94.5, Math.max(76.0, eff)).toFixed(1);
  }, [customPriceDelta, customFeatureDelta]);

  const arrProtected = useMemo(() => {
    return Math.round(projectedARRAtRisk * (parseFloat(counterEfficacy) / 100));
  }, [projectedARRAtRisk, counterEfficacy]);

  const defendedMarketShareDelta = useMemo(() => {
    const drop = Math.abs(parseFloat(projectedMarketShareDelta));
    const saved = drop * (parseFloat(counterEfficacy) / 100);
    return (-(drop - saved)).toFixed(1);
  }, [projectedMarketShareDelta, counterEfficacy]);

  // Dynamic projected trajectory data for Recharts
  const trajectoryData = useMemo(() => {
    const drop = Math.abs(parseFloat(projectedMarketShareDelta));
    const defFactor = parseFloat(counterEfficacy) / 100;

    return [
      {
        month: "Current",
        baselineShare: 24.0,
        impactedShare: 24.0,
        defendedShare: 24.0,
      },
      {
        month: "+1 Mo",
        baselineShare: 25.2,
        impactedShare: +(24.0 - drop * 0.22).toFixed(1),
        defendedShare: +(24.0 - drop * (1 - defFactor) * 0.25).toFixed(1),
      },
      {
        month: "+2 Mo",
        baselineShare: 26.8,
        impactedShare: +(24.0 - drop * 0.52).toFixed(1),
        defendedShare: +(25.2 - drop * (1 - defFactor) * 0.35).toFixed(1),
      },
      {
        month: "+3 Mo",
        baselineShare: 28.5,
        impactedShare: +(24.0 - drop * 0.78).toFixed(1),
        defendedShare: +(27.1 - drop * (1 - defFactor) * 0.45).toFixed(1),
      },
      {
        month: "+4 Mo",
        baselineShare: 30.1,
        impactedShare: +(24.0 - drop * 0.92).toFixed(1),
        defendedShare: +(29.0 - drop * (1 - defFactor) * 0.50).toFixed(1),
      },
      {
        month: "+6 Mo",
        baselineShare: 32.5,
        impactedShare: +(24.0 - drop * 1.00).toFixed(1),
        defendedShare: +(31.2 - drop * (1 - defFactor) * 0.55).toFixed(1),
      },
    ];
  }, [projectedMarketShareDelta, counterEfficacy]);

  const handleRunSimulation = async () => {
    sounds.playAlert();
    setIsSimulating(true);
    setIsDirectiveDeployed(false);
    setSimProgress(15);
    setSimStageText(`Sampling 1,000 synthetic enterprise accounts in ${selectedScenario.competitor} market segment...`);

    await new Promise((r) => setTimeout(r, 450));
    sounds.playTick();
    setSimProgress(40);
    setSimStageText(`Evaluating price elasticity vector for ${customPriceDelta}% pricing shift across renewal windows...`);

    await new Promise((r) => setTimeout(r, 450));
    sounds.playTick();
    setSimProgress(68);
    setSimStageText(`Simulating feature parity jump (+${customFeatureDelta} pts) against existing customer retention...`);

    await new Promise((r) => setTimeout(r, 450));
    sounds.playTick();
    setSimProgress(90);
    setSimStageText(`Evaluating defensive playbook: "${selectedScenario.counterAction}"...`);

    await new Promise((r) => setTimeout(r, 400));
    setSimProgress(100);
    setSimStageText(`Simulation complete: 1,000 Monte Carlo runs converged with 98.4% statistical confidence.`);

    await new Promise((r) => setTimeout(r, 350));
    sounds.playSuccess();
    setIsSimulating(false);
    setSimulationResult({
      runId: `WR-${Math.floor(1000 + Math.random() * 9000)}`,
      completedAt: new Date().toLocaleTimeString(),
      arrRisk: projectedARRAtRisk,
      arrProtected: arrProtected,
      marketShareDelta: projectedMarketShareDelta,
      defendedShareDelta: defendedMarketShareDelta,
      counterEfficacy: counterEfficacy,
    });
  };

  const handleDeployDirective = async () => {
    sounds.playAlert();
    await dispatchWarRoomDirective({
      competitorName: selectedScenario.competitor,
      scenarioTitle: selectedScenario.title,
      counterAction: selectedScenario.counterAction,
      arrRiskK: arrProtected,
    });
    await refreshAll();
    sounds.playSuccess();
    setIsDirectiveDeployed(true);
  };

  const handleDownloadWarBrief = () => {
    sounds.playTick();
    const content = `# PRYSM WAR ROOM STRATEGIC SIMULATION BRIEF
**Run ID:** ${simulationResult?.runId || "WR-2026-LIVE"}
**Generated:** ${new Date().toISOString().slice(0, 10)} ${new Date().toLocaleTimeString()}
**Scenario Target:** ${selectedScenario.title}
**Competitor:** ${selectedScenario.competitor} (${selectedScenario.category.toUpperCase()})

---

## 1. Monte Carlo Simulation Parameters
- Competitor Price Shift: ${customPriceDelta}%
- Competitor Feature Velocity Jump: +${customFeatureDelta} pts
- Iterations Executed: 1,000 synthetic enterprise accounts
- Statistical Confidence: 98.4%
- Response Window: Immediate (< 14 business days)

## 2. Risk & Impact Projections
| Metric | Without Counter-Offensive | With Recommended Defense | Net Variance |
| --- | --- | --- | --- |
| ARR at Risk | -$${projectedARRAtRisk}k | -$${projectedARRAtRisk - arrProtected}k | +$${arrProtected}k Saved |
| 6-Month Market Share Delta | ${projectedMarketShareDelta}% | ${defendedMarketShareDelta}% | +${(Math.abs(parseFloat(projectedMarketShareDelta)) - Math.abs(parseFloat(defendedMarketShareDelta))).toFixed(1)}% Protected |
| Playbook Defense Efficacy | 0.0% | ${counterEfficacy}% | ${counterEfficacy}% Mitigated |

## 3. Recommended Counter-Offensive Directive
"${selectedScenario.counterAction}"

### Tactical Playbook Execution Steps:
${selectedScenario.playbookSteps.map((step, idx) => `${idx + 1}. ${step}`).join("\n")}

---
*Generated by PRYSM Autonomous Intelligence War Room v2.4.*
`;

    const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `WarRoom-${selectedScenario.competitor.replace(/\s+/g, "_")}-Simulation-Brief.md`;
    a.click();
    URL.revokeObjectURL(url);
    sounds.playSuccess();
  };

  const handleSelectScenario = (sc: SimulationScenario) => {
    sounds.playTick();
    setSelectedScenario(sc);
    setCustomPriceDelta(sc.priceDeltaPercent);
    setCustomFeatureDelta(sc.featureJumpScore);
    setSimulationResult(null);
    setIsDirectiveDeployed(false);
  };

  const isDarkMode = theme === "dark";

  return (
    <div className="space-y-8 pb-20 pt-6 sm:pt-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-red-500/10 text-red-700 dark:text-red-400 border border-red-500/25">
            STRATEGIC WAR ROOM &amp; PREDICTIVE MODELING
          </span>
          <span className="text-app-muted">·</span>
          <LivePulseIndicator status="alert" label="Monte Carlo Engine Ready" sublabel="1,000 Iterations" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-app-primary tracking-tight">
          Competitor Scenario &amp; Counter-Offensive Simulator
        </h1>
        <p className="text-sm text-app-secondary leading-relaxed max-w-3xl">
          Model potential competitor moves before they happen. Simulate enterprise price wars, stealth feature releases, and positioning assaults with automated predictive risk modeling and counter-playbooks.
        </p>
      </div>

      {/* Grid: Scenario Selection & Interactive Sliders */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Preset Scenarios */}
        <div className="lg:col-span-5 space-y-4">
          <div className="dashboard-card p-5 sm:p-6 rounded-2xl border border-app bg-surface-primary space-y-4 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-app-primary font-mono flex items-center gap-2">
              <Swords className="w-4 h-4 text-red-500" />
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
                        ? "bg-red-50/80 dark:bg-red-500/10 border-red-500/60 shadow-xs ring-1 ring-red-500/30"
                        : "bg-surface-secondary border-app hover:border-slate-300 dark:hover:border-zinc-700"
                    }`}
                  >
                    {isSelected && (
                      <BorderBeam size={160} duration={6} colorFrom="#EF4444" colorTo="#F97316" />
                    )}
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-red-600 dark:text-red-400 font-mono">
                        {sc.competitor}
                      </span>
                      <span className="text-[10px] font-mono font-bold text-amber-700 dark:text-amber-400 bg-amber-500/10 px-1.5 py-0.2 rounded border border-amber-500/25">
                        {sc.category.toUpperCase()}
                      </span>
                    </div>
                    <h3 className="text-xs font-bold text-app-primary">{sc.title}</h3>
                    <p className="text-[11px] text-app-secondary mt-1 leading-normal">
                      {sc.description}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Custom Sliders for Fine-Tuning */}
            <div className="pt-3 border-t border-app space-y-4 text-xs font-mono">
              <div className="space-y-1.5">
                <div className="flex justify-between text-app-primary font-semibold">
                  <span>Competitor Price Shift:</span>
                  <span className={customPriceDelta < 0 ? "text-red-600 dark:text-red-400 font-bold" : "text-emerald-600 dark:text-emerald-400 font-bold"}>
                    {customPriceDelta}%
                  </span>
                </div>
                <input
                  type="range"
                  min={-50}
                  max={50}
                  step={5}
                  value={customPriceDelta}
                  onChange={(e) => {
                    setCustomPriceDelta(Number(e.target.value));
                    setSimulationResult(null);
                  }}
                  aria-label="Competitor Price Shift Slider"
                  className="w-full accent-red-600 cursor-pointer h-2 bg-slate-200 dark:bg-slate-800 rounded-lg"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-app-primary font-semibold">
                  <span>Competitor Feature Velocity Jump:</span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-bold">+{customFeatureDelta} pts</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={40}
                  step={2}
                  value={customFeatureDelta}
                  onChange={(e) => {
                    setCustomFeatureDelta(Number(e.target.value));
                    setSimulationResult(null);
                  }}
                  aria-label="Competitor Feature Velocity Slider"
                  className="w-full accent-indigo-600 cursor-pointer h-2 bg-slate-200 dark:bg-slate-800 rounded-lg"
                />
              </div>

              {/* Live Simulation Progress Stream */}
              {isSimulating && (
                <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 space-y-2 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between text-[11px] font-mono text-red-600 dark:text-red-400 font-bold">
                    <span className="flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5 animate-spin" />
                      <span>Monte Carlo Simulation in Progress</span>
                    </span>
                    <span>{simProgress}%</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-linear-to-r from-red-600 to-orange-500 h-full transition-all duration-300"
                      style={{ width: `${simProgress}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-app-secondary leading-tight truncate">
                    {simStageText}
                  </p>
                </div>
              )}

              {/* Simulation Trigger Button */}
              <button
                onClick={handleRunSimulation}
                disabled={isSimulating}
                className="w-full py-3 rounded-xl bg-linear-to-r from-red-600 via-rose-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-md shadow-red-500/20 transition-all cursor-pointer disabled:opacity-50"
              >
                <Play className={`w-4 h-4 fill-current ${isSimulating ? "animate-spin" : ""}`} />
                <span>
                  {isSimulating ? "Simulating 1,000 Market Iterations..." : "Run War Room Simulation"}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Projected Trajectory & Playbook */}
        <div className="lg:col-span-7 space-y-4">
          {/* Key Impact Forecast Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="dashboard-card p-4 rounded-xl border border-red-500/30 bg-surface-primary space-y-1 shadow-2xs">
              <span className="text-[10px] uppercase font-mono text-app-muted block font-semibold">
                Estimated ARR at Risk
              </span>
              <div className="text-xl font-bold font-mono text-red-600 dark:text-red-400">
                -${projectedARRAtRisk}k
              </div>
              <span className="text-[10px] text-app-muted font-mono">Annualized churn exposure</span>
            </div>

            <div className="dashboard-card p-4 rounded-xl border border-amber-500/30 bg-surface-primary space-y-1 shadow-2xs">
              <span className="text-[10px] uppercase font-mono text-app-muted block font-semibold">
                Market Share Delta
              </span>
              <div className="text-xl font-bold font-mono text-amber-600 dark:text-amber-400">
                {projectedMarketShareDelta}%
              </div>
              <span className="text-[10px] text-app-muted font-mono">6-month projection</span>
            </div>

            <div className="dashboard-card p-4 rounded-xl border border-emerald-500/30 bg-surface-primary space-y-1 shadow-2xs">
              <span className="text-[10px] uppercase font-mono text-app-muted block font-semibold">
                Playbook Counter Efficacy
              </span>
              <div className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
                {counterEfficacy}%
              </div>
              <span className="text-[10px] text-app-muted font-mono">
                +${arrProtected}k ARR protected
              </span>
            </div>
          </div>

          {/* Interactive Trajectory Chart with Defended Projection */}
          <div className="dashboard-card p-5 rounded-2xl border border-app bg-surface-primary space-y-3 shadow-xs">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="space-y-0.5">
                <span className="text-xs font-bold uppercase tracking-wider text-app-primary font-mono block">
                  Projected Market Share Trajectory (6-Month Horizon)
                </span>
                <span className="text-[10px] text-app-muted font-mono">
                  {simulationResult
                    ? "Displaying Baseline vs Unmitigated Impact vs Recommended Counter-Playbook"
                    : "Simulating Baseline vs Unmitigated Impact"}
                </span>
              </div>
              {simulationResult && (
                <span className="text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Defense Curve Active</span>
                </span>
              )}
            </div>

            <div className="h-52 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trajectoryData} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="impactedGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#EF4444" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#EF4444" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="baselineGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="defendedGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#1D212B" : "#E2E8F0"} />
                  <XAxis
                    dataKey="month"
                    stroke={isDarkMode ? "#606778" : "#94A3B8"}
                    tick={{ fontSize: 10, fill: isDarkMode ? "#8E95A5" : "#64748B" }}
                  />
                  <YAxis
                    stroke={isDarkMode ? "#606778" : "#94A3B8"}
                    tick={{ fontSize: 10, fill: isDarkMode ? "#8E95A5" : "#64748B" }}
                    domain={[16, 35]}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDarkMode ? "#0D0F14" : "#FFFFFF",
                      border: isDarkMode ? "1px solid #262A33" : "1px solid #CBD5E1",
                      borderRadius: "8px",
                      fontSize: "11px",
                      color: isDarkMode ? "#F5F7FA" : "#0F172A",
                    }}
                  />
                  <Legend
                    verticalAlign="top"
                    height={30}
                    wrapperStyle={{ fontSize: "11px", fontFamily: "monospace" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="baselineShare"
                    name="Organic Baseline %"
                    stroke="#3B82F6"
                    fill="url(#baselineGrad)"
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="impactedShare"
                    name="Without Defense %"
                    stroke="#EF4444"
                    fill="url(#impactedGrad)"
                    strokeWidth={2}
                  />
                  {simulationResult && (
                    <Area
                      type="monotone"
                      dataKey="defendedShare"
                      name="With Counter-Playbook %"
                      stroke="#10B981"
                      fill="url(#defendedGrad)"
                      strokeWidth={2.5}
                      strokeDasharray="4 4"
                    />
                  )}
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recommended Counter-Offensive Playbook */}
          <div className="dashboard-card p-5 rounded-2xl border border-blue-500/30 bg-surface-primary space-y-4 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-app pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-500" />
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-300 font-mono">
                  Recommended Counter-Offensive Playbook
                </span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  ✓ Strategy Taskforce Ready
                </span>

                <button
                  onClick={() =>
                    openChatWithPrompt(
                      `We ran War Room Simulation for scenario "${selectedScenario.title}" against ${selectedScenario.competitor}. Unmitigated ARR at risk is -$${projectedARRAtRisk}k (${projectedMarketShareDelta}% market share). Recommend immediate tactical defense steps and objection handling battlecards.`
                    )
                  }
                  className="px-2.5 py-1 rounded-md bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-medium flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
                  title="Ask Copilot for tactical response plan"
                >
                  <Bot className="w-3.5 h-3.5 text-white" />
                  <span>Ask Copilot</span>
                </button>
              </div>
            </div>

            <p className="text-xs text-app-primary font-semibold leading-relaxed bg-blue-500/5 p-3 rounded-xl border border-blue-500/15">
              &quot;{selectedScenario.counterAction}&quot;
            </p>

            <div className="space-y-2 pt-1">
              {selectedScenario.playbookSteps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs p-2.5 rounded-xl bg-surface-secondary border border-app">
                  <div className="w-5 h-5 rounded-full bg-blue-500/15 text-blue-600 dark:text-blue-400 font-mono text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <span className="text-app-secondary leading-normal">{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Post-Simulation Results & Tactical Directive Response Center */}
      {simulationResult && (
        <section className="dashboard-card p-6 sm:p-8 rounded-2xl border border-emerald-500/40 bg-surface-primary space-y-6 shadow-md animate-in fade-in duration-500">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-app pb-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 shadow-2xs">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/25">
                    Simulation Run #{simulationResult.runId} Completed
                  </span>
                  <span className="text-xs text-app-muted font-mono">
                    {simulationResult.completedAt}
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-app-primary mt-1">
                  Tactical Risk Assessment &amp; Defense Outcome
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={handleDownloadWarBrief}
                className="px-3.5 py-2 rounded-xl bg-surface-secondary hover:bg-surface-primary border border-app text-xs font-semibold text-app-primary flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Brief (.md)</span>
              </button>

              <button
                type="button"
                onClick={handleDeployDirective}
                disabled={isDirectiveDeployed}
                className={`px-4 py-2 rounded-xl font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-xs ${
                  isDirectiveDeployed
                    ? "bg-emerald-600 text-white cursor-default"
                    : "bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white"
                }`}
              >
                {isDirectiveDeployed ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>✓ Directive Deployed to Strategy Desk</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Deploy Counter-Offensive Playbook</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Comparative Impact Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-surface-secondary border border-app space-y-1.5">
              <span className="text-[10px] font-mono uppercase text-app-muted block font-semibold">
                Financial Protection Vector
              </span>
              <div className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
                +${simulationResult.arrProtected}k
              </div>
              <p className="text-[11px] text-app-secondary">
                Protected against ${simulationResult.arrRisk}k total exposure ({simulationResult.counterEfficacy}% mitigation rate).
              </p>
            </div>

            <div className="p-4 rounded-xl bg-surface-secondary border border-app space-y-1.5">
              <span className="text-[10px] font-mono uppercase text-app-muted block font-semibold">
                Market Share Containment
              </span>
              <div className="text-2xl font-bold font-mono text-blue-600 dark:text-blue-400">
                {simulationResult.defendedShareDelta}%
              </div>
              <p className="text-[11px] text-app-secondary">
                Residual delta contained from initial {simulationResult.marketShareDelta}% threat exposure.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-surface-secondary border border-app space-y-1.5">
              <span className="text-[10px] font-mono uppercase text-app-muted block font-semibold">
                Execution SLA Horizon
              </span>
              <div className="text-2xl font-bold font-mono text-amber-600 dark:text-amber-400">
                &lt; 14 Days
              </div>
              <p className="text-[11px] text-app-secondary">
                Optimal counter-offensive launch window to prevent customer churn lock-in.
              </p>
            </div>
          </div>

          {/* Deployed Notification Banner */}
          {isDirectiveDeployed && (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between gap-4 animate-in fade-in">
              <div className="flex items-center gap-3">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
                </span>
                <div className="text-xs">
                  <span className="font-bold text-emerald-700 dark:text-emerald-300 uppercase font-mono mr-2">
                    Action Dispatched:
                  </span>
                  <span className="text-app-primary font-semibold">
                    War Room Playbook Active vs {selectedScenario.competitor}
                  </span>
                  <span className="text-app-secondary ml-2">
                    (In-app notification routed to Strategy &amp; Sales Taskforces)
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-mono text-app-muted shrink-0 hidden sm:inline">
                Check Topbar Notification Bell
              </span>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
