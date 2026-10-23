"use client";

import React, { useState, useEffect } from "react";
import { getCompetitor, getChanges, getEvidenceList } from "../../lib/api";
import { Competitor, ChangeItem, EvidenceItem } from "../../lib/types";
import { ThreatScoreBadge } from "../ui/ThreatScoreBadge";
import { StatusBadge, SeverityBadge, CategoryBadge } from "../ui/Badge";
import { CriticalIntelligenceCard } from "../dashboard/CriticalIntelligenceCard";
import { useApp } from "../../lib/context/AppContext";
import {
  RefreshCw,
  FileText,
  ExternalLink,
  TrendingUp,
  Clock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Minus,
  Sparkles,
  Zap,
  ArrowUpRight,
  Swords,
  Crosshair,
  Copy,
  Check,
  AlertTriangle,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Link from "next/link";
import { formatCurrency } from "../../lib/utils";
import { mockCompetitors } from "@/lib/mock-data/competitors";
import { mockChanges } from "@/lib/mock-data/changes";
import { mockEvidence } from "@/lib/mock-data/evidence";

interface TabItem {
  id: "overview" | "pricing" | "features" | "positioning" | "announcements" | "history" | "evidence" | "battlecard";
  label: string;
  count?: number;
}

export function CompetitorDetailView({ id }: { id: string }) {
  const { openScanModal, openEvidenceDrawer } = useApp();

  const [competitor, setCompetitor] = useState<Competitor | null>(
    () => mockCompetitors.find((c) => c.id === id || c.slug === id) || null
  );
  const [changes, setChanges] = useState<ChangeItem[]>(
    () => mockChanges.filter((ch) => ch.competitorId === id)
  );
  const [evidenceList, setEvidenceList] = useState<EvidenceItem[]>(
    () => mockEvidence.filter((ev) => ev.competitorId === id)
  );
  const [activeTab, setActiveTab] = useState<
    "overview" | "pricing" | "features" | "positioning" | "announcements" | "history" | "evidence" | "battlecard"
  >("overview");
  const [copiedBattlecard, setCopiedBattlecard] = useState(false);

  useEffect(() => {
    async function loadData() {
      const comp = await getCompetitor(id);
      if (comp) setCompetitor(comp);
      const [cList, eList] = await Promise.all([
        getChanges({ competitorId: id }),
        getEvidenceList(id),
      ]);
      setChanges(cList);
      setEvidenceList(eList);
    }
    loadData();
  }, [id]);

  if (!competitor) {
    return (
      <div className="p-12 text-center text-zinc-500">
        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        Loading competitor telemetry...
      </div>
    );
  }

  const tabs: TabItem[] = [
    { id: "overview", label: "Overview" },
    { id: "battlecard", label: "⚔️ Battlecard" },
    { id: "pricing", label: "Pricing", count: competitor.plans?.length },
    { id: "features", label: "Features", count: competitor.features?.length },
    { id: "positioning", label: "Positioning" },
    { id: "announcements", label: "Announcements", count: competitor.announcements?.length },
    { id: "history", label: "History" },
    { id: "evidence", label: "Evidence", count: evidenceList.length },
  ];

  return (
    <div className="space-y-6 pb-16">
      {/* Competitor Header Showcase */}
      <div className="p-6 rounded-xl bg-[#111318] border border-[#262A33] flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-xl bg-[#181B22] border border-[#262A33] flex items-center justify-center font-mono font-bold text-xl text-zinc-100 shadow-md">
            {competitor.logoText}
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-bold text-zinc-100">
                {competitor.name}
              </h1>
              <StatusBadge status={competitor.monitoringStatus === "active" ? "active" : "paused"} />
              <a
                href={competitor.website}
                target="_blank"
                rel="noreferrer"
                className="text-zinc-500 hover:text-zinc-300 text-xs flex items-center gap-1 font-mono"
              >
                <span>{competitor.website.replace("https://", "")}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <p className="text-xs sm:text-sm text-zinc-400">
              {competitor.tagline}
            </p>
          </div>
        </div>

        {/* Threat Score & Top Actions */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="p-3 rounded-lg bg-[#0C0E12] border border-[#262A33]">
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block mb-1">
              Threat Score
            </span>
            <ThreatScoreBadge score={competitor.threatScore} size="lg" showLabel={true} />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={openScanModal}
              className="px-3.5 py-2 rounded-lg bg-[#181B24] hover:bg-[#202430] border border-[#262A33] text-xs font-semibold text-zinc-200 flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5 text-zinc-400" />
              <span>Run Scan</span>
            </button>

            <Link
              href="/reports/rep-weekly-20261023"
              className="px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Generate Report</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1 border-b border-[#262A33] overflow-x-auto pb-1 text-xs font-medium">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-t-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                isActive
                  ? "bg-[#181B22] text-blue-400 border-b-2 border-blue-500 font-semibold"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-[#111318]"
              }`}
            >
              <span>{tab.label}</span>
              {typeof tab.count === "number" && (
                <span className="px-1.5 py-0.2 rounded font-mono text-[10px] bg-[#262A33] text-zinc-300">
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Breakdown progress metrics */}
            <div className="lg:col-span-5 p-5 rounded-xl bg-[#111318] border border-[#262A33] space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Threat Breakdown Vectors
              </h3>
              <div className="space-y-3">
                {[
                  { label: "Pricing Pressure", val: competitor.metrics.pricingPressure, color: "bg-amber-400" },
                  { label: "Feature Velocity", val: competitor.metrics.featureVelocity, color: "bg-blue-500" },
                  { label: "Launch Frequency", val: competitor.metrics.launchActivity, color: "bg-violet-500" },
                  { label: "AI Capability", val: competitor.metrics.aiCapability, color: "bg-indigo-500" },
                  { label: "Automation Moat", val: competitor.metrics.automation, color: "bg-emerald-400" },
                ].map((m) => (
                  <div key={m.label} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-zinc-400">{m.label}</span>
                      <span className="font-mono font-bold text-zinc-200">{m.val}/100</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-[#181B22] overflow-hidden">
                      <div className={`h-full ${m.color}`} style={{ width: `${m.val}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 30-Day Threat Score Chart */}
            <div className="lg:col-span-7 p-5 rounded-xl bg-[#111318] border border-[#262A33] space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Threat Score Trend (Last 30 Days)
                  </h3>
                  <p className="text-[11px] text-zinc-500">
                    Evaluated daily from pricing changes, commits, and market noise
                  </p>
                </div>
                <div className="flex items-center gap-1 font-mono text-xs font-bold text-amber-400">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>+{competitor.trendDelta} pts</span>
                </div>
              </div>

              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={competitor.history}>
                    <defs>
                      <linearGradient id="compThreatGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="date"
                      stroke="#5A6270"
                      fontSize={10}
                      tickLine={false}
                      axisLine={{ stroke: "#262A33" }}
                    />
                    <YAxis
                      domain={[50, 100]}
                      stroke="#5A6270"
                      fontSize={10}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const pt = payload[0].payload;
                          return (
                            <div className="p-2 rounded bg-[#0C0E12] border border-[#262A33] text-xs font-mono">
                              <span className="text-zinc-400">{pt.date}: </span>
                              <span className="text-amber-400 font-bold">
                                {pt.threatScore}/100
                              </span>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="threatScore"
                      stroke="#F59E0B"
                      strokeWidth={2}
                      fill="url(#compThreatGrad)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Latest Intelligence Cards */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-blue-400" />
              Latest Intelligence for {competitor.name}
            </h3>
            <div className="space-y-3">
              {changes.map((item) => (
                <CriticalIntelligenceCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PRICING */}
      {activeTab === "pricing" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-zinc-100">
                Tier & Plan Pricing Matrix
              </h2>
              <p className="text-xs text-zinc-400">
                Cryptographically tracked baseline prices and detected revisions
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {competitor.plans?.map((plan) => (
              <div
                key={plan.name}
                className={`p-5 rounded-xl border flex flex-col justify-between ${
                  plan.popular
                    ? "bg-[#141822] border-blue-500/50 shadow-lg shadow-blue-500/10"
                    : "bg-[#111318] border-[#262A33]"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                      {plan.name} Plan
                    </span>
                    {plan.popular && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-500 text-white font-semibold">
                        FLAGSHIP
                      </span>
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold font-mono text-zinc-100">
                        {formatCurrency(plan.priceCurrent, plan.currency)}
                      </span>
                      <span className="text-xs text-zinc-500">{plan.billingCycle}</span>
                    </div>

                    {plan.changeDeltaPercent > 0 && (
                      <div className="flex items-center gap-2 text-xs font-mono">
                        <span className="text-zinc-500 line-through">
                          {formatCurrency(plan.pricePrevious, plan.currency)}
                        </span>
                        <span className="text-amber-400 font-bold bg-amber-500/10 px-1.5 py-0.2 rounded border border-amber-500/30">
                          +{plan.changeDeltaPercent}%
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#1F232D] space-y-1 text-xs text-zinc-400">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-zinc-500">Observed:</span>
                      <span className="font-mono text-zinc-300">{plan.observedDate}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-[#1F232D]">
                  <button
                    onClick={() => openEvidenceDrawer(competitor.latestChange.evidenceId)}
                    className="w-full py-1.5 px-3 rounded-md bg-[#181B22] hover:bg-blue-600/20 text-blue-400 text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
                  >
                    <span>View Evidence Payload</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: FEATURES */}
      {activeTab === "features" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-zinc-100">
                Feature Availability Matrix
              </h2>
              <p className="text-xs text-zinc-400">
                Tracked capability vectors, recently updated capabilities, and roadmap additions
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-[#262A33] bg-[#111318] overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#14171E] border-b border-[#262A33] text-zinc-400 uppercase font-mono text-[10px]">
                <tr>
                  <th className="py-3 px-4">Feature Vector</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-4">Technical Note / Observation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1D212B]">
                {competitor.features?.map((f) => (
                  <tr key={f.name} className="hover:bg-[#161922] transition-colors">
                    <td className="py-3 px-4 font-semibold text-zinc-200">
                      {f.name}
                    </td>
                    <td className="py-3 px-3 text-zinc-400 font-mono text-[11px]">
                      {f.category}
                    </td>
                    <td className="py-3 px-3">
                      {f.status === "NEW" && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-500/10 text-purple-400 border border-purple-500/30">
                          NEW
                        </span>
                      )}
                      {f.status === "UPDATED" && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                          UPDATED
                        </span>
                      )}
                      {f.status === "AVAILABLE" && (
                        <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Available</span>
                        </span>
                      )}
                      {f.status === "UNAVAILABLE" && (
                        <span className="inline-flex items-center gap-1 text-zinc-500 font-medium">
                          <Minus className="w-3.5 h-3.5" />
                          <span>Not Available</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-zinc-300">
                      {f.note || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: POSITIONING */}
      {activeTab === "positioning" && competitor.positioning && (
        <div className="space-y-6">
          <div className="p-6 rounded-xl bg-[#111318] border border-[#262A33] space-y-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-4 h-4 text-sky-400" />
                <h2 className="text-sm font-semibold text-zinc-100">
                  Extracted Positioning & Brand Narrative
                </h2>
              </div>
              <p className="text-xs text-zinc-400">
                Semantic comparison between historical marketing copy and current website headline
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-[#0C0E12] border border-[#262A33] space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-red-400 block">
                  Prior Value Proposition
                </span>
                <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                  &quot;{competitor.positioning.previousClaim}&quot;
                </p>
              </div>

              <div className="p-4 rounded-lg bg-[#0C0E12] border border-blue-500/40 space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 block">
                  Current Value Proposition (Active)
                </span>
                <p className="text-xs text-zinc-100 leading-relaxed font-sans font-medium">
                  &quot;{competitor.positioning.currentClaim}&quot;
                </p>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-[#14171F] border border-[#262A33] space-y-2">
              <span className="text-[11px] font-semibold text-blue-400 uppercase tracking-wider">
                Detected Semantic Shift:
              </span>
              <p className="text-xs text-zinc-200 leading-relaxed">
                {competitor.positioning.detectedShift}
              </p>
              <div className="pt-2 flex items-center justify-between text-xs text-zinc-500 font-mono">
                <span>Tone Observation: {competitor.positioning.toneShift}</span>
                <span className="text-emerald-400 font-bold">
                  {competitor.positioning.confidence}% Model Confidence
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: ANNOUNCEMENTS */}
      {activeTab === "announcements" && (
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-zinc-100">
            Announcements & Press Feed
          </h2>
          <div className="space-y-3">
            {competitor.announcements?.map((ann) => (
              <div
                key={ann.id}
                className="p-4 rounded-xl bg-[#111318] border border-[#262A33] flex items-start justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#1D212B] text-zinc-300 border border-zinc-700">
                      {ann.type}
                    </span>
                    <span className="text-xs text-zinc-500 font-mono">{ann.date}</span>
                  </div>
                  <h3 className="text-sm font-semibold text-zinc-100">{ann.title}</h3>
                  <p className="text-xs text-zinc-400">{ann.summary}</p>
                </div>

                <a
                  href={ann.url}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-lg bg-[#181B22] border border-[#262A33] text-zinc-400 hover:text-white shrink-0"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: HISTORY */}
      {activeTab === "history" && (
        <div className="p-6 rounded-xl bg-[#111318] border border-[#262A33] space-y-4">
          <h2 className="text-sm font-semibold text-zinc-100">
            Historical Surveillance Snapshots
          </h2>
          <div className="space-y-3">
            {competitor.history.map((h, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 rounded-lg bg-[#0C0E12] border border-[#262A33] text-xs font-mono"
              >
                <span className="text-zinc-400">{h.date}</span>
                <span className="text-zinc-200">
                  Threat Index Score: <span className="text-amber-400 font-bold">{h.threatScore}</span>
                </span>
                <span className="text-[11px] text-emerald-400">Archived DOM Verified</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 7: EVIDENCE */}
      {activeTab === "evidence" && (
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-zinc-100">
            Linked Cryptographic Evidence Records ({evidenceList.length})
          </h2>
          <div className="space-y-3">
            {evidenceList.map((ev) => (
              <div
                key={ev.id}
                className="p-4 rounded-xl bg-[#111318] border border-[#262A33] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <SeverityBadge severity={ev.severity} />
                    <CategoryBadge category={ev.category} />
                    <span className="text-xs font-mono text-emerald-400">
                      {ev.confidence}% Verified
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-zinc-100">{ev.title}</h3>
                  <p className="text-xs text-zinc-400 line-clamp-1">{ev.sourceTitle}</p>
                </div>

                <button
                  onClick={() => openEvidenceDrawer(ev.id)}
                  className="px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white flex items-center gap-1.5 self-start sm:self-auto shrink-0 transition-colors"
                >
                  <span>Open In Drawer</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 8: BATTLECARD */}
      {activeTab === "battlecard" && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-[#0D0F14] border border-[#262A33] shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1E232E] pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-red-500/10 text-red-400 border border-red-500/30">
                    EXECUTIVE SALES BATTLECARD
                  </span>
                  <span className="text-zinc-600">·</span>
                  <span className="text-xs text-zinc-400 font-mono">Counter-Offensive Playbook</span>
                </div>
                <h2 className="text-xl font-bold text-zinc-100 tracking-tight">
                  How to Win Against {competitor.name}
                </h2>
                <p className="text-xs text-zinc-400 mt-1 max-w-2xl">
                  Evidence-backed talking points, kill criteria, and RFP landmines generated from verified competitor movements.
                </p>
              </div>

              <button
                onClick={() => {
                  setCopiedBattlecard(true);
                  setTimeout(() => setCopiedBattlecard(false), 2000);
                }}
                className="px-4 py-2 rounded-xl bg-[#14171E] hover:bg-[#1E232F] border border-[#262A33] text-xs font-semibold text-zinc-200 flex items-center gap-2 transition-colors self-start sm:self-auto shrink-0 cursor-pointer"
              >
                {copiedBattlecard ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Battlecard Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Copy Battlecard</span>
                  </>
                )}
              </button>
            </div>

            {/* Quick Kill Points */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                <Crosshair className="w-4 h-4 text-red-400" />
                Key Kill Points (Top 3 Vulnerabilities)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="p-4 rounded-xl bg-[#111318] border border-red-500/20 space-y-1.5">
                  <span className="font-bold text-red-400 block font-mono text-[11px]">1. Stealth Pricing Inflation</span>
                  <p className="text-zinc-300 text-[11px] leading-relaxed">
                    Recent +30% unannounced price surge on their Pro tier ($79 → $109/mo) has alienated growth-stage accounts. Frame our predictable pricing model as a hedge.
                  </p>
                  <button
                    onClick={() => openEvidenceDrawer("ev-acme-pricing-20261023")}
                    className="text-[10px] text-blue-400 hover:underline font-mono inline-flex items-center gap-1 pt-1"
                  >
                    <span>View Price Diff Evidence [1]</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-[#111318] border border-amber-500/20 space-y-1.5">
                  <span className="font-bold text-amber-400 block font-mono text-[11px]">2. Closed Ecosystem Lock-In</span>
                  <p className="text-zinc-300 text-[11px] leading-relaxed">
                    Their new Copilot v3 is strictly locked to their proprietary hosting infrastructure, forcing cloud migration. Contrast with our open multi-cloud deployment.
                  </p>
                  <button
                    onClick={() => openEvidenceDrawer("ev-nova-launch-20261023")}
                    className="text-[10px] text-blue-400 hover:underline font-mono inline-flex items-center gap-1 pt-1"
                  >
                    <span>View Ecosystem Evidence [2]</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-[#111318] border border-emerald-500/20 space-y-1.5">
                  <span className="font-bold text-emerald-400 block font-mono text-[11px]">3. Opaque Black-Box Claims</span>
                  <p className="text-zinc-300 text-[11px] leading-relaxed">
                    They make marketing claims without cryptographic proof. PRYSM provides SHA-256 Merkle root verification on every monitored change.
                  </p>
                  <span className="text-[10px] text-emerald-400 font-mono block pt-1">
                    SHA-256 Audit Trail Guaranteed
                  </span>
                </div>
              </div>
            </div>

            {/* Objection Handling Matrix */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                <Swords className="w-4 h-4 text-blue-400" />
                Objection Handling Matrix for Sales Reps
              </h3>
              <div className="rounded-xl border border-[#262A33] bg-[#111318] overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-[#14171E] border-b border-[#262A33] font-mono text-zinc-400 text-[10px] uppercase">
                    <tr>
                      <th className="py-3 px-4 w-1/3">When the Customer Says</th>
                      <th className="py-3 px-4">Evidence-Backed Response</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1D212B]">
                    <tr className="hover:bg-[#14171E] transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-zinc-200 align-top">
                        &quot;{competitor.name} just launched autonomous copilot workflows, so they seem more advanced.&quot;
                      </td>
                      <td className="py-3.5 px-4 text-zinc-300 text-[11px] leading-relaxed">
                        &quot;Notice their fine print: they bundled Copilot specifically to justify an immediate +38% price hike on all renewal contracts, and their token consumption limits are heavily throttled. With our platform, you receive transparent compute guarantees with zero stealth price increases.&quot;
                      </td>
                    </tr>
                    <tr className="hover:bg-[#14171E] transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-zinc-200 align-top">
                        &quot;{competitor.name} claims to have higher enterprise uptime SLAs.&quot;
                      </td>
                      <td className="py-3.5 px-4 text-zinc-300 text-[11px] leading-relaxed">
                        &quot;Our automated public monitoring detected that they quietly amended their status page terms on October 18th to exclude maintenance windows from penalty rebates. We back our 99.99% SLA with automated cryptographic telemetry.&quot;
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* RFP Landmines to Lay */}
            <div className="p-4 rounded-xl bg-[#08090C] border border-[#262A33] space-y-2 text-xs">
              <span className="font-mono text-[10px] uppercase tracking-wider text-amber-400 font-bold block flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                RFP Landmines to Lay with Procurement
              </span>
              <ul className="list-disc pl-5 space-y-1 text-zinc-400 text-[11px]">
                <li>Ask vendor: &quot;Can you guarantee fixed price protection for 24 months without automatic Copilot tier add-ons?&quot; (They cannot; their roadmap relies on mandatory bundling).</li>
                <li>Ask vendor: &quot;Do you provide immutable historical snapshots of all service-tier changes with cryptographic SHA-256 hashes?&quot; (Only PRYSM provides this).</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
