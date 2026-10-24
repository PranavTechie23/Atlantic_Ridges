"use client";

import React, { useState, useMemo } from "react";
import { useApp } from "../../lib/context/AppContext";
import {
  GitCompare,
  Sparkles,
  CornerDownRight,
  ShieldAlert,
  ArrowRight,
  Plus,
  Sliders,
  Download,
  Check,
  X,
  Layers,
  BarChart2,
  Table as TableIcon,
} from "lucide-react";
import Link from "next/link";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

interface Criterion {
  id: string;
  label: string;
  categoryKey?: string;
  weight: number; // 0 to 100%
  customScores?: Record<string, number>; // For custom added criteria
}

export default function ComparisonPage() {
  const { competitors, openEvidenceDrawer } = useApp();

  const [criteria, setCriteria] = useState<Criterion[]>([
    { id: "crit-pricing", label: "Pricing Pressure", categoryKey: "pricingPressure", weight: 20 },
    { id: "crit-velocity", label: "Feature Velocity", categoryKey: "featureVelocity", weight: 20 },
    { id: "crit-ai", label: "AI Capability", categoryKey: "aiCapability", weight: 25 },
    { id: "crit-automation", label: "Workflow Automation", categoryKey: "automation", weight: 15 },
    { id: "crit-analytics", label: "Analytics & Telemetry", categoryKey: "analytics", weight: 10 },
    { id: "crit-position", label: "Market Position", categoryKey: "marketPosition", weight: 10 },
  ]);

  const [activeView, setActiveView] = useState<"matrix" | "radar" | "battlecard">("matrix");
  const [selectedCompetitorIds, setSelectedCompetitorIds] = useState<string[]>([
    "comp-acme",
    "comp-nova",
    "comp-orbit",
  ]);

  // Modal / Input for new custom criterion
  const [isAddingCustom, setIsAddingCustom] = useState(false);
  const [newCriterionName, setNewCriterionName] = useState("");
  const [newCriterionWeight, setNewCriterionWeight] = useState(15);
  const [customDefaultScore, setCustomDefaultScore] = useState(75);

  const handleAddCriterion = () => {
    if (!newCriterionName.trim()) return;
    const newId = `crit-custom-${Date.now()}`;
    const initialScores: Record<string, number> = {};
    competitors.forEach((c) => {
      initialScores[c.id] = Math.max(40, Math.min(98, customDefaultScore + Math.floor(Math.random() * 20 - 10)));
    });

    setCriteria((prev) => [
      ...prev,
      {
        id: newId,
        label: newCriterionName.trim(),
        weight: newCriterionWeight,
        customScores: initialScores,
      },
    ]);

    setNewCriterionName("");
    setIsAddingCustom(false);
  };

  const handleRemoveCriterion = (id: string) => {
    setCriteria((prev) => prev.filter((c) => c.id !== id));
  };

  const handleWeightChange = (id: string, weight: number) => {
    setCriteria((prev) =>
      prev.map((c) => (c.id === id ? { ...c, weight } : c))
    );
  };

  const toggleCompetitorSelection = (id: string) => {
    setSelectedCompetitorIds((prev) =>
      prev.includes(id)
        ? prev.length > 1
          ? prev.filter((i) => i !== id)
          : prev
        : [...prev, id]
    );
  };

  // Helper for heatmap cell color intensity
  const getHeatmapColor = (score: number) => {
    if (score >= 90)
      return "bg-red-500/12 text-red-800 dark:text-red-400 font-bold border border-red-500/35 dark:border-red-500/30";
    if (score >= 80)
      return "bg-amber-500/12 text-amber-900 dark:text-amber-300 font-semibold border border-amber-500/35 dark:border-amber-500/30";
    if (score >= 70)
      return "bg-blue-500/12 text-blue-800 dark:text-blue-300 font-medium border border-blue-500/35 dark:border-blue-500/30";
    return "bg-slate-100 dark:bg-[#161922] text-slate-600 dark:text-zinc-400 border border-slate-200 dark:border-[#262A33]";
  };

  // Helper to get score for a criterion on a competitor
  const getScore = (crit: Criterion, compId: string) => {
    if (crit.customScores && crit.customScores[compId] !== undefined) {
      return crit.customScores[compId];
    }
    const comp = competitors.find((c) => c.id === compId);
    if (!comp) return 50;
    const key = crit.categoryKey as keyof typeof comp.metrics;
    return comp.metrics && comp.metrics[key] !== undefined ? comp.metrics[key] : 70;
  };

  // Calculate weighted overall score for each competitor
  const weightedScores = useMemo(() => {
    const totalWeight = criteria.reduce((sum, c) => sum + c.weight, 0) || 1;
    const scores: Record<string, number> = {};

    competitors.forEach((comp) => {
      let weightedSum = 0;
      criteria.forEach((crit) => {
        const sc = getScore(crit, comp.id);
        weightedSum += sc * crit.weight;
      });
      scores[comp.id] = Math.round(weightedSum / totalWeight);
    });

    return scores;
  }, [competitors, criteria]);

  // Radar chart data preparation
  const radarChartData = useMemo(() => {
    return criteria.map((crit) => {
      const row: Record<string, string | number> = {
        criterion: crit.label,
      };
      selectedCompetitorIds.forEach((id) => {
        const comp = competitors.find((c) => c.id === id);
        if (comp) {
          row[comp.name] = getScore(crit, comp.id);
        }
      });
      return row;
    });
  }, [criteria, selectedCompetitorIds, competitors]);

  const radarColors = ["#3B82F6", "#10B981", "#8B5CF6", "#F59E0B", "#EC4899"];

  const handleExportCSV = () => {
    let csv = "Criterion,Weight," + competitors.map((c) => c.name).join(",") + "\n";
    criteria.forEach((crit) => {
      const row = [crit.label, `${crit.weight}%`];
      competitors.forEach((comp) => {
        row.push(String(getScore(crit, comp.id)));
      });
      csv += row.join(",") + "\n";
    });
    csv += "Weighted Overall Score,100%," + competitors.map((c) => weightedScores[c.id]).join(",") + "\n";

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `PRYSM-Competitor-Comparison-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 pb-20 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/25">
              COMPETITOR INTELLIGENCE
            </span>
            <span className="text-app-muted">·</span>
            <span className="text-xs text-app-muted font-mono">
              Configurable Product Criteria & Weighted Comparison
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-app-primary mt-1">
            Competitive Comparison Matrix
          </h1>
          <p className="text-xs sm:text-sm text-app-muted mt-1">
            Compare competitors against fully configurable product criteria, adjust strategic weights, and synthesize actionable positioning briefs.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleExportCSV}
            className="px-3 py-1.5 rounded-lg bg-surface-primary hover:bg-surface-secondary dark:bg-[#14171E] dark:hover:bg-[#1A1E26] border border-app text-xs font-semibold text-app-secondary flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <Link
            href="/reports/rep-weekly-20261023"
            className="px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white flex items-center gap-1.5 transition-colors"
          >
            <span>Synthesize Executive Brief</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* View Switcher & Competitor Chips */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-surface-primary border border-app shadow-xs">
        {/* Competitor Multi-Select Filter */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[11px] font-mono uppercase text-app-muted font-bold mr-1">
            Compare:
          </span>
          {competitors.slice(0, 6).map((comp) => {
            const isSelected = selectedCompetitorIds.includes(comp.id);
            return (
              <button
                key={comp.id}
                onClick={() => toggleCompetitorSelection(comp.id)}
                className={`px-2.5 py-1 rounded-lg border text-xs font-mono transition-colors flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? "bg-blue-500/15 border-blue-500/50 text-blue-800 dark:text-blue-300 font-bold"
                    : "bg-surface-secondary dark:bg-[#0C0E12] border-app text-app-muted hover:text-app-primary"
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? "bg-blue-600 dark:bg-blue-400" : "bg-slate-400 dark:bg-zinc-600"}`} />
                <span>{comp.name}</span>
              </button>
            );
          })}
        </div>

        {/* View Mode Buttons */}
        <div className="flex items-center gap-1 bg-surface-secondary dark:bg-[#0C0E12] p-1 rounded-lg border border-app self-start md:self-auto text-xs font-mono">
          <button
            onClick={() => setActiveView("matrix")}
            className={`px-3 py-1.5 rounded font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeView === "matrix" ? "bg-blue-600 text-white" : "text-app-muted hover:text-app-primary"
            }`}
          >
            <TableIcon className="w-3.5 h-3.5" />
            <span>Heatmap Matrix</span>
          </button>
          <button
            onClick={() => setActiveView("radar")}
            className={`px-3 py-1.5 rounded font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeView === "radar" ? "bg-blue-600 text-white" : "text-app-muted hover:text-app-primary"
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span>Radar Polygon</span>
          </button>
        </div>
      </div>

      {/* Configurable Criteria & Weight Sliders Management Bar */}
      <div className="p-5 rounded-xl bg-surface-primary border border-app space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-app-secondary font-mono">
              Configurable Product Criteria ({criteria.length} Active Vectors)
            </span>
          </div>

          <button
            onClick={() => setIsAddingCustom(!isAddingCustom)}
            className="px-3 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/15 border border-blue-500/35 text-blue-800 dark:text-blue-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Custom Criterion</span>
          </button>
        </div>

        {/* Add custom criteria inline form */}
        {isAddingCustom && (
          <div className="p-4 rounded-xl bg-blue-50/80 dark:bg-[#0C0E12] border border-blue-200/80 dark:border-blue-500/30 space-y-3 animate-in fade-in">
            <span className="text-xs font-bold text-blue-800 dark:text-blue-300 uppercase font-mono">
              Define New Strategic Vector:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="e.g. SOC2 Type II Compliance, Self-Hosted API"
                value={newCriterionName}
                onChange={(e) => setNewCriterionName(e.target.value)}
                className="px-3 py-1.5 rounded bg-white dark:bg-[#111318] border border-app text-xs text-app-primary focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
              <div className="flex items-center gap-2">
                <span className="text-xs text-app-muted font-mono">Weight:</span>
                <input
                  type="number"
                  min={5}
                  max={50}
                  value={newCriterionWeight}
                  onChange={(e) => setNewCriterionWeight(Number(e.target.value))}
                  className="w-16 px-2 py-1.5 rounded bg-white dark:bg-[#111318] border border-app text-xs text-app-primary font-mono"
                />
                <span className="text-xs text-app-muted">%</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleAddCriterion}
                  className="px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white flex-1 cursor-pointer"
                >
                  Save Vector
                </button>
                <button
                  onClick={() => setIsAddingCustom(false)}
                  className="p-1.5 rounded bg-surface-secondary dark:bg-zinc-800 text-app-muted hover:text-app-primary cursor-pointer border border-app"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Criteria Pills with Weight Adjustment */}
        <div className="flex items-center gap-2 flex-wrap text-xs font-mono">
          {criteria.map((crit) => (
            <div
              key={crit.id}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-secondary dark:bg-[#0C0E12] border border-app"
            >
              <span className="text-app-primary font-medium">{crit.label}</span>
              <span className="text-blue-700 dark:text-blue-400 font-bold bg-blue-500/10 px-1.5 py-0.2 rounded">
                {crit.weight}%
              </span>
              {crit.id.startsWith("crit-custom-") && (
                <button
                  onClick={() => handleRemoveCriterion(crit.id)}
                  className="text-zinc-500 hover:text-red-400 ml-1 cursor-pointer"
                  title="Remove custom criterion"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* VIEW 1: MATRIX TABLE */}
      {activeView === "matrix" && (
        <div className="rounded-xl border border-app bg-surface-primary overflow-hidden shadow-md dark:shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-surface-secondary dark:bg-[#14171E] border-b border-app text-app-muted text-[11px] uppercase">
                <tr>
                  <th className="py-3.5 px-4 font-semibold w-64">
                    Evaluation Criterion / Weight
                  </th>
                  {competitors.filter((c) => selectedCompetitorIds.includes(c.id)).map((comp) => (
                    <th key={comp.id} className="py-3.5 px-3 text-center min-w-[130px]">
                      <Link href={`/competitors/${comp.id}`} className="inline-flex flex-col items-center group">
                        <span className="text-app-primary group-hover:text-blue-600 dark:group-hover:text-blue-400 font-bold transition-colors">
                          {comp.name}
                        </span>
                        <span className="text-[10px] text-app-muted font-normal">
                          Threat: {comp.threatScore}
                        </span>
                      </Link>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-[#1D212B]">
                {criteria.map((crit) => (
                  <tr key={crit.id} className="hover:bg-surface-secondary/80 dark:hover:bg-[#161922] transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-app-primary">
                      <div className="flex items-center justify-between">
                        <span>{crit.label}</span>
                        <span className="text-[10px] text-app-muted font-normal">
                          (wt: {crit.weight}%)
                        </span>
                      </div>
                    </td>
                    {competitors.filter((c) => selectedCompetitorIds.includes(c.id)).map((comp) => {
                      const score = getScore(crit, comp.id);
                      return (
                        <td key={comp.id} className="py-3.5 px-3 text-center">
                          <div className={`inline-flex items-center justify-center w-12 py-1 rounded border font-mono text-xs ${getHeatmapColor(score)}`}>
                            {score}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}

                {/* Weighted Composite Overall Score Row */}
                <tr className="bg-blue-50/90 dark:bg-[#14171E] font-bold border-t-2 border-blue-500/40">
                  <td className="py-4 px-4 text-blue-800 dark:text-blue-300 font-bold uppercase tracking-wider">
                    COMPOSITE WEIGHTED SCORE
                  </td>
                  {competitors.filter((c) => selectedCompetitorIds.includes(c.id)).map((comp) => (
                    <td key={comp.id} className="py-4 px-3 text-center">
                      <span className="inline-flex items-center justify-center px-3 py-1 rounded-md bg-blue-600 text-white font-bold text-xs shadow-xs">
                        {weightedScores[comp.id]} / 100
                      </span>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 2: RADAR CHART */}
      {activeView === "radar" && (
        <div className="p-6 rounded-2xl bg-surface-primary border border-app shadow-md dark:shadow-2xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-app-secondary font-mono">
              Multi-Competitor Strategic Vector Radar
            </span>
            <span className="text-xs text-app-muted font-mono">
              Comparing {selectedCompetitorIds.length} Entities
            </span>
          </div>

          <div className="h-[440px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarChartData}>
                <PolarGrid stroke="#262A33" strokeDasharray="3 3" />
                <PolarAngleAxis dataKey="criterion" stroke="#8E95A5" tick={{ fill: "#8E95A5", fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#262A33" tick={{ fill: "#606778", fontSize: 10 }} />
                {selectedCompetitorIds.map((id, index) => {
                  const comp = competitors.find((c) => c.id === id);
                  if (!comp) return null;
                  const color = radarColors[index % radarColors.length];
                  return (
                    <Radar
                      key={comp.id}
                      name={comp.name}
                      dataKey={comp.name}
                      stroke={color}
                      fill={color}
                      fillOpacity={0.25}
                    />
                  );
                })}
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0D0F14",
                    border: "1px solid #262A33",
                    borderRadius: "8px",
                    color: "#F5F7FA",
                    fontSize: "12px",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "12px", color: "#A0A8B8" }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* PRYSM Strategic Synthesis */}
      <div className="p-6 rounded-xl bg-linear-to-br from-blue-50 via-white to-indigo-50/90 dark:from-[#12151D] dark:to-[#171B24] border border-blue-200/90 dark:border-blue-500/30 space-y-4 shadow-md dark:shadow-xl">
        <div className="flex items-center gap-2 text-blue-800 dark:text-blue-400 text-xs font-semibold uppercase tracking-wider font-mono">
          <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span>PRYSM Strategic Intelligence Synthesis</span>
        </div>

        <p className="text-slate-700 dark:text-zinc-200 text-sm leading-relaxed font-medium">
          &quot;NovaAI leads on AI Capability (97/100), while Acme Cloud dominates on Workflow Automation (91/100). However, Acme&apos;s recent 30% price expansion on their core Pro plan has increased their Pricing Pressure index to 78, creating an immediate opportunity to capture mid-market accounts.&quot;
        </p>

        <div className="pt-3 border-t border-blue-200/80 dark:border-[#262A33] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <span className="text-slate-600 dark:text-zinc-400">
            Observation Basis: 6 Competitors · 27 Verified Changes · 94.7% Average Cryptographic Verification
          </span>
          <button
            onClick={() => openEvidenceDrawer("ev-acme-pricing-20261023")}
            className="text-blue-700 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 font-semibold flex items-center gap-1 cursor-pointer shrink-0"
          >
            <span>Inspect Verified Price Hike Evidence</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
