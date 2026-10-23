"use client";

import React, { useState } from "react";
import { useApp } from "@/lib/context/AppContext";
import {
  Bell,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Mail,
  Send,
  Zap,
  Volume2,
  Check,
  ShieldAlert,
  Flame,
  ArrowRight,
  Filter,
} from "lucide-react";
import { SeverityBadge } from "@/components/ui/Badge";

export default function AlertsPage() {
  const { notifications, openEvidenceDrawer } = useApp();

  const [minSignificance, setMinSignificance] = useState(70);
  const [pricingDeltaMin, setPricingDeltaMin] = useState(15);
  const [alertOnAI, setAlertOnAI] = useState(true);
  const [alertOnPositioning, setAlertOnPositioning] = useState(true);
  const [alertOnDeprecations, setAlertOnDeprecations] = useState(true);
  const [webhookUrl, setWebhookUrl] = useState("https://hooks.slack.com/services/T00/B00/PRYSM-COMPETITIVE");
  const [isTestSent, setIsTestSent] = useState(false);

  const handleSendTestAlert = () => {
    setIsTestSent(true);
    setTimeout(() => setIsTestSent(false), 3000);
  };

  return (
    <div className="space-y-8 pb-20 max-w-6xl mx-auto">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-red-500/10 text-red-400 border border-red-500/20">
            HACKNOVA &apos;26 REQUIREMENT
          </span>
          <span className="text-zinc-500">·</span>
          <span className="text-xs text-zinc-400 font-mono">
            Change Prioritization & Intelligent Alert Filtering
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F5F7FA] tracking-tight">
          Alert Rules & Notification Prioritization
        </h1>
        <p className="text-sm text-zinc-400 leading-relaxed max-w-3xl">
          Fulfills constraint: <em>&quot;Notifications should prioritize relevant changes and minimize unnecessary alerts.&quot;</em> Configure high-precision thresholds to prevent alert fatigue while ensuring zero missed competitive opportunities.
        </p>
      </div>

      {/* Grid: Rules & Webhook Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Configurable Thresholds */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-6 rounded-xl bg-[#111318] border border-[#262A33] space-y-5 shadow-xl">
            <div className="flex items-center justify-between border-b border-[#262A33] pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-200 font-mono flex items-center gap-2">
                <Sliders className="w-4 h-4 text-blue-400" />
                Significance & Sensitivity Thresholds
              </span>
              <span className="text-[11px] font-mono text-emerald-400 font-semibold">
                Active Policy: High-Precision
              </span>
            </div>

            {/* Minimum Significance Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-300 font-medium">Minimum Significance Score to Trigger Alert:</span>
                <span className="font-mono font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                  ≥ {minSignificance} / 100
                </span>
              </div>
              <input
                type="range"
                min={40}
                max={95}
                value={minSignificance}
                onChange={(e) => setMinSignificance(Number(e.target.value))}
                className="w-full accent-blue-500 cursor-pointer"
              />
              <span className="text-[11px] text-zinc-500 block">
                Any change scored below {minSignificance}/100 is logged to audit logs but suppressed from push notifications.
              </span>
            </div>

            {/* Pricing Delta Threshold */}
            <div className="space-y-2 pt-2 border-t border-[#1D212B]">
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-300 font-medium">Pricing Delta Trigger (% Change):</span>
                <span className="font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  ≥ {pricingDeltaMin}% Price Shift
                </span>
              </div>
              <input
                type="range"
                min={5}
                max={40}
                value={pricingDeltaMin}
                onChange={(e) => setPricingDeltaMin(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <span className="text-[11px] text-zinc-500 block">
                Triggers immediate Critical Alert if competitor increases or cuts plan price by more than {pricingDeltaMin}%.
              </span>
            </div>

            {/* Category Toggles */}
            <div className="space-y-2 pt-2 border-t border-[#1D212B]">
              <span className="text-xs font-bold text-zinc-300 font-mono uppercase block mb-1">
                Strategic Category Subscription Filters
              </span>
              <div className="space-y-2 text-xs">
                <label className="flex items-center gap-3 p-2.5 rounded-lg bg-[#0C0E12] border border-[#262A33] cursor-pointer hover:border-zinc-700 transition-colors">
                  <input
                    type="checkbox"
                    checked={alertOnAI}
                    onChange={(e) => setAlertOnAI(e.target.checked)}
                    className="rounded border-zinc-700 text-blue-600 focus:ring-0"
                  />
                  <div className="flex-1">
                    <span className="text-zinc-200 font-semibold block">AI & Agentic Capabilities</span>
                    <span className="text-[11px] text-zinc-500">Autonomous copilot features, reasoning tokens, and agent workflows</span>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-2.5 rounded-lg bg-[#0C0E12] border border-[#262A33] cursor-pointer hover:border-zinc-700 transition-colors">
                  <input
                    type="checkbox"
                    checked={alertOnPositioning}
                    onChange={(e) => setAlertOnPositioning(e.target.checked)}
                    className="rounded border-zinc-700 text-blue-600 focus:ring-0"
                  />
                  <div className="flex-1">
                    <span className="text-zinc-200 font-semibold block">Market Positioning & Messaging Shifts</span>
                    <span className="text-[11px] text-zinc-500">Landing page hero taglines, target buyer persona modifications</span>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-2.5 rounded-lg bg-[#0C0E12] border border-[#262A33] cursor-pointer hover:border-zinc-700 transition-colors">
                  <input
                    type="checkbox"
                    checked={alertOnDeprecations}
                    onChange={(e) => setAlertOnDeprecations(e.target.checked)}
                    className="rounded border-zinc-700 text-blue-600 focus:ring-0"
                  />
                  <div className="flex-1">
                    <span className="text-zinc-200 font-semibold block">Free Tier Reductions & Deprecations</span>
                    <span className="text-[11px] text-zinc-500">Free quota tightening, token cap decreases, and paywall moves</span>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Webhook Integration & Test Simulation */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 rounded-xl bg-[#111318] border border-[#262A33] space-y-4 shadow-xl">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-200 font-mono flex items-center gap-2">
              <Send className="w-4 h-4 text-purple-400" />
              Webhook & Channel Forwarding
            </span>

            <div className="space-y-2 text-xs">
              <label className="text-[11px] text-zinc-400 font-mono uppercase block">
                Slack / MS Teams Webhook Endpoint
              </label>
              <input
                type="text"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                className="w-full px-3 py-2 rounded bg-[#0C0E12] border border-[#262A33] text-zinc-200 font-mono text-[11px] focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="p-3 rounded-lg bg-[#0C0E12] border border-[#262A33] space-y-2 text-xs">
              <div className="flex items-center justify-between text-zinc-300">
                <span className="font-semibold">Simulated Payload Format</span>
                <span className="text-[10px] font-mono text-purple-400">JSON</span>
              </div>
              <pre className="text-[10px] font-mono text-zinc-400 overflow-x-auto bg-black/40 p-2 rounded">
                {`{\n  "event": "CRITICAL_COMPETITOR_CHANGE",\n  "competitor": "Acme Cloud",\n  "delta": "Pro Tier +30% (₹999 -> ₹1,299)",\n  "digest": "sha256:e3b0c442...",\n  "confidence": 98.4\n}`}
              </pre>
            </div>

            <button
              onClick={handleSendTestAlert}
              className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
            >
              {isTestSent ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>Test Alert Dispatched Successfully!</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  <span>Simulate Test Notification Dispatch</span>
                </>
              )}
            </button>
          </div>

          {/* Quick Stats on Noise Suppression */}
          <div className="p-5 rounded-xl bg-linear-to-br from-[#12151D] to-[#181D27] border border-blue-500/20 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400 font-mono">
                Noise Reduction Telemetry
              </span>
              <span className="text-xs font-mono text-emerald-400 font-bold">
                91.4% Filtered
              </span>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed">
              In the past 30 days, PRYSM observed <strong>314 raw webpage mutations</strong>. The noise engine successfully filtered out <strong>287 minor modifications</strong>, surfacing only <strong>27 high-conviction strategic signals</strong> to strategy leadership.
            </p>
          </div>
        </div>
      </div>

      {/* Dispatched Notification History */}
      <div className="rounded-xl border border-[#262A33] bg-[#111318] overflow-hidden shadow-2xl space-y-0">
        <div className="p-4 bg-[#14171E] border-b border-[#262A33] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-bold text-zinc-100 uppercase tracking-wider font-mono">
              Prioritized Alert Dispatch Log ({notifications.length} Verified Alerts)
            </span>
          </div>
        </div>

        <div className="divide-y divide-[#1D212B]">
          {notifications.map((notif) => (
            <div key={notif.id} className="p-4 hover:bg-[#14171E] transition-colors flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <SeverityBadge severity={notif.severity} />
                <div>
                  <div className="text-xs font-bold text-zinc-200">
                    {notif.title}
                  </div>
                  <div className="text-[11px] text-zinc-400 mt-0.5">
                    {notif.description}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="text-[11px] font-mono text-zinc-500">{notif.time}</span>
                {notif.evidenceId && (
                  <button
                    onClick={() => openEvidenceDrawer(notif.evidenceId!)}
                    className="px-2.5 py-1 rounded bg-[#181B22] hover:bg-blue-600/20 text-blue-400 text-xs font-mono font-medium transition-colors cursor-pointer"
                  >
                    Evidence
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
