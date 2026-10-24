"use client";

import React, { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Activity } from "lucide-react";
import { useApp } from "../../lib/context/AppContext";
import { SegmentedControl } from "../ui/SegmentedControl";
import { sounds } from "../../lib/utils/sound";

interface SignalDataPoint {
  date: string;
  displayDate: string;
  pricing: number;
  features: number;
  launch: number;
  positioning: number;
  announcements: number;
  totalSignals: number;
  competitorHighlight: string;
  topChange: string;
  significance: number;
}

const rawSignalData: SignalDataPoint[] = [
  { date: "2026-09-24", displayDate: "Sep 24", pricing: 1, features: 2, launch: 0, positioning: 1, announcements: 1, totalSignals: 5, competitorHighlight: "OrbitCRM", topChange: "API pricing review", significance: 71 },
  { date: "2026-09-27", displayDate: "Sep 27", pricing: 2, features: 1, launch: 1, positioning: 0, announcements: 2, totalSignals: 6, competitorHighlight: "Vertex Labs", topChange: "Node 14 deprecation", significance: 65 },
  { date: "2026-09-30", displayDate: "Sep 30", pricing: 0, features: 3, launch: 1, positioning: 1, announcements: 1, totalSignals: 6, competitorHighlight: "Acme Cloud", topChange: "Storage tier update", significance: 68 },
  { date: "2026-10-03", displayDate: "Oct 03", pricing: 1, features: 2, launch: 0, positioning: 2, announcements: 1, totalSignals: 6, competitorHighlight: "PulseDesk", topChange: "SLA rule updates", significance: 60 },
  { date: "2026-10-06", displayDate: "Oct 06", pricing: 2, features: 1, launch: 1, positioning: 1, announcements: 2, totalSignals: 7, competitorHighlight: "OrbitCRM", topChange: "Snowflake clean room partnership", significance: 73 },
  { date: "2026-10-09", displayDate: "Oct 09", pricing: 1, features: 2, launch: 2, positioning: 3, announcements: 3, totalSignals: 11, competitorHighlight: "NexaSuite", topChange: "₹230 crore Series B & Rebranding to Autonomous OS", significance: 82 },
  { date: "2026-10-12", displayDate: "Oct 12", pricing: 3, features: 4, launch: 1, positioning: 1, announcements: 1, totalSignals: 10, competitorHighlight: "OrbitCRM", topChange: "Unmetered API & Predictive churn rollout", significance: 84 },
  { date: "2026-10-15", displayDate: "Oct 15", pricing: 1, features: 3, launch: 2, positioning: 1, announcements: 2, totalSignals: 9, competitorHighlight: "PulseDesk", topChange: "Multilingual ticket sentiment engine", significance: 68 },
  { date: "2026-10-18", displayDate: "Oct 18", pricing: 2, features: 5, launch: 4, positioning: 2, announcements: 3, totalSignals: 16, competitorHighlight: "NovaAI", topChange: "Copilot v3 launch & Pro price ₹2,499→₹3,199", significance: 92 },
  { date: "2026-10-21", displayDate: "Oct 21", pricing: 2, features: 3, launch: 1, positioning: 2, announcements: 1, totalSignals: 9, competitorHighlight: "Acme Cloud", topChange: "Enterprise plan pricing adjustment", significance: 79 },
  { date: "2026-10-23", displayDate: "Oct 23", pricing: 4, features: 4, launch: 2, positioning: 2, announcements: 2, totalSignals: 14, competitorHighlight: "Acme Cloud", topChange: "Pro Plan price hike ₹999 -> ₹1,299 (+30%)", significance: 94 },
];

export function MarketSignalChart() {
  const { theme } = useApp();
  const isDark = theme === "dark";
  const [timeframe, setTimeframe] = useState<"7D" | "30D" | "90D">("30D");

  const filteredData = React.useMemo(() => {
    if (timeframe === "7D") {
      return rawSignalData.slice(-4);
    }
    if (timeframe === "90D") {
      return [
        { date: "2026-08-01", displayDate: "Aug 01", pricing: 1, features: 1, launch: 0, positioning: 1, announcements: 1, totalSignals: 4, competitorHighlight: "Acme Cloud", topChange: "Infrastructure update", significance: 55 },
        { date: "2026-08-20", displayDate: "Aug 20", pricing: 2, features: 2, launch: 1, positioning: 0, announcements: 1, totalSignals: 6, competitorHighlight: "NovaAI", topChange: "Beta assistant launch", significance: 70 },
        ...rawSignalData,
      ];
    }
    return rawSignalData;
  }, [timeframe]);

  return (
    <div className="dashboard-card p-5 sm:p-6 rounded-xl space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-app-primary flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-500" />
            Market signal activity
          </h3>
          <p className="text-xs text-app-secondary mt-0.5">
            Pricing, features, and launch events over time
          </p>
        </div>

        <SegmentedControl
          value={timeframe}
          onChange={(t) => {
            sounds.playTick();
            setTimeframe(t);
          }}
          options={[
            { value: "7D", label: "7D" },
            { value: "30D", label: "30D" },
            { value: "90D", label: "90D" },
          ]}
        />
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-3.5 flex-wrap text-xs font-mono text-app-muted pt-1">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-xs" />
          Pricing
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-xs" />
          Features
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-violet-400 shadow-xs" />
          Product Launch
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-sky-400 shadow-xs" />
          Positioning
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-xs" />
          Announcements
        </span>
      </div>

      {/* Chart Canvas */}
      <div className="h-64 sm:h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={filteredData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            key={timeframe}
          >
            <defs>
              <linearGradient id="pricingGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.45} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="featuresGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366F1" stopOpacity={0.45} />
                <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="launchGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.45} />
                <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke={isDark ? "#1D212B" : "#E2E8F0"}
              vertical={false}
            />

            <XAxis
              dataKey="displayDate"
              stroke={isDark ? "#5A6270" : "#64748B"}
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: isDark ? "#262A33" : "#E2E8F0" }}
            />
            <YAxis
              stroke={isDark ? "#5A6270" : "#64748B"}
              fontSize={11}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
            />

            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload as SignalDataPoint;
                  return (
                    <div className="rounded-xl bg-[#111318] border border-[#262A33] p-3.5 shadow-2xl text-xs space-y-1.5 font-sans min-w-[240px]">
                      <div className="flex items-center justify-between border-b border-[#262A33] pb-1.5">
                        <span className="font-mono text-zinc-400">{data.date}</span>
                        <span className="font-mono font-bold text-blue-400">
                          {data.totalSignals} Signals
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-amber-400">
                          {data.competitorHighlight}
                        </span>
                        <div className="text-zinc-100 font-semibold leading-snug mt-0.5">
                          {data.topChange}
                        </div>
                      </div>
                      <div className="pt-1.5 border-t border-[#1F232D] flex items-center justify-between text-[11px] font-mono text-zinc-400">
                        <span>Threat Significance:</span>
                        <span className="text-emerald-400 font-bold">
                          {data.significance} / 100
                        </span>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />

            <Area
              type="monotone"
              dataKey="pricing"
              stackId="1"
              stroke="#10B981"
              fill="url(#pricingGradient)"
              strokeWidth={2}
              isAnimationActive
              animationDuration={1400}
              animationEasing="ease-out"
            />
            <Area
              type="monotone"
              dataKey="features"
              stackId="1"
              stroke="#6366F1"
              fill="url(#featuresGradient)"
              strokeWidth={2}
              isAnimationActive
              animationDuration={1600}
              animationEasing="ease-out"
            />
            <Area
              type="monotone"
              dataKey="launch"
              stackId="1"
              stroke="#8B5CF6"
              fill="url(#launchGradient)"
              strokeWidth={2}
              isAnimationActive
              animationDuration={1800}
              animationEasing="ease-out"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
