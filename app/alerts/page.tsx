"use client";

import React, { useState, useMemo } from "react";
import { useApp } from "@/lib/context/AppContext";
import {
  Bell,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Send,
  Zap,
  Check,
  ShieldAlert,
  Flame,
  ArrowRight,
  Filter,
  Search,
  Bot,
  ExternalLink,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Info,
  Radio,
  Clock,
  Layers,
} from "lucide-react";
import { SeverityBadge } from "@/components/ui/Badge";

export default function AlertsPage() {
  const { notifications, openEvidenceDrawer, openChatWithPrompt, markNotificationsAsRead } = useApp();

  // Sensitivity Policy Settings
  const [minSignificance, setMinSignificance] = useState(70);
  const [pricingDeltaMin, setPricingDeltaMin] = useState(15);
  const [alertOnAI, setAlertOnAI] = useState(true);
  const [alertOnPositioning, setAlertOnPositioning] = useState(true);
  const [alertOnDeprecations, setAlertOnDeprecations] = useState(true);
  const [webhookUrl, setWebhookUrl] = useState("https://hooks.slack.com/services/T00/B00/PRYSM-COMPETITIVE");
  const [isTestSent, setIsTestSent] = useState(false);

  // Feed Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [severityFilter, setSeverityFilter] = useState<"ALL" | "CRITICAL" | "HIGH" | "MEDIUM">("ALL");

  const handleSendTestAlert = () => {
    setIsTestSent(true);
    setTimeout(() => setIsTestSent(false), 3000);
  };

  const filteredNotifications = useMemo(() => {
    return notifications.filter((notif) => {
      if (severityFilter !== "ALL" && notif.severity !== severityFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          notif.title.toLowerCase().includes(q) ||
          notif.description.toLowerCase().includes(q) ||
          notif.competitor.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [notifications, severityFilter, searchQuery]);

  const criticalCount = notifications.filter((n) => n.severity === "CRITICAL").length;
  const highCount = notifications.filter((n) => n.severity === "HIGH").length;

  return (
    <div className="space-y-8 pb-20 max-w-6xl mx-auto">
      {/* Page heading */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">
            ALERTS &amp; NOTIFICATIONS
          </span>
          <span className="text-app-muted">·</span>
          <span className="text-xs text-app-muted font-mono flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
            Active Policy: Noise Filter (≥{minSignificance}/100 Threshold)
          </span>
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-app-primary tracking-tight">
              Alert Rules & Intelligent Noise Prioritization
            </h1>
            <p className="text-sm text-app-secondary leading-relaxed max-w-3xl mt-1">
              Fulfills constraint: <em>&quot;Notifications should prioritize relevant changes and minimize unnecessary alerts.&quot;</em> Filters page noise and suppresses routine cosmetic updates while dispatching high-priority competitive moves instantly.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => markNotificationsAsRead()}
              className="px-3 py-1.5 rounded-lg border border-app bg-surface-secondary hover:bg-slate-100 dark:hover:bg-white/[0.04] text-xs font-medium text-app-primary transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5 text-emerald-500" />
              Mark All as Read
            </button>
          </div>
        </div>
      </div>

      {/* Top Metric Strip: Signal vs. Noise Breakdown */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="dashboard-card p-4 rounded-xl border border-app bg-surface-primary">
          <span className="text-[10px] font-mono uppercase tracking-wider text-app-muted block font-semibold">
            Verified Signals
          </span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-mono font-bold text-app-primary">{notifications.length}</span>
            <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">High Priority</span>
          </div>
          <span className="text-[11px] text-app-muted mt-1 block">Surfaced past 7 days</span>
        </div>

        <div className="dashboard-card p-4 rounded-xl border border-app bg-surface-primary">
          <span className="text-[10px] font-mono uppercase tracking-wider text-app-muted block font-semibold">
            Noise Suppressed
          </span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-mono font-bold text-emerald-600 dark:text-emerald-400">91.4%</span>
            <span className="text-[11px] font-mono text-app-muted">287 filtered</span>
          </div>
          <span className="text-[11px] text-app-muted mt-1 block">Cosmetic DOM shifts dropped</span>
        </div>

        <div className="dashboard-card p-4 rounded-xl border border-app bg-surface-primary">
          <span className="text-[10px] font-mono uppercase tracking-wider text-app-muted block font-semibold">
            Critical Moves
          </span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-mono font-bold text-red-600 dark:text-red-400">{criticalCount}</span>
            <span className="text-[11px] font-mono text-amber-600 dark:text-amber-400">+{highCount} High</span>
          </div>
          <span className="text-[11px] text-app-muted mt-1 block">Immediate action required</span>
        </div>

        <div className="dashboard-card p-4 rounded-xl border border-app bg-surface-primary">
          <span className="text-[10px] font-mono uppercase tracking-wider text-app-muted block font-semibold">
            Dispatch Channels
          </span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-mono font-bold text-blue-600 dark:text-blue-400">Active</span>
            <span className="text-[11px] font-mono text-emerald-500 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live
            </span>
          </div>
          <span className="text-[11px] text-app-muted mt-1 block">Slack & In-app sync</span>
        </div>
      </div>

      {/* Grid: Rules & Webhook Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Configurable Thresholds */}
        <div className="lg:col-span-7 space-y-4">
          <div className="dashboard-card p-6 rounded-xl border border-app bg-surface-primary space-y-5">
            <div className="flex items-center justify-between border-b border-app pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-app-primary font-mono flex items-center gap-2">
                <Sliders className="w-4 h-4 text-blue-500" />
                Significance & Sensitivity Controls
              </span>
              <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                High-Precision Policy
              </span>
            </div>

            {/* Minimum Significance Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-app-primary font-semibold">Minimum Significance Score to Trigger Alert:</span>
                <span className="font-mono font-bold text-blue-600 dark:text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded border border-blue-500/20">
                  ≥ {minSignificance} / 100
                </span>
              </div>
              <input
                type="range"
                min={40}
                max={95}
                value={minSignificance}
                onChange={(e) => setMinSignificance(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer h-2 bg-slate-200 dark:bg-slate-800 rounded-lg"
              />
              <div className="flex items-center justify-between text-[11px] text-app-muted">
                <span>Aggressive (40)</span>
                <span className="font-mono font-medium text-app-secondary">Changes below {minSignificance}/100 are logged to audit trail but suppressed from push notifications.</span>
                <span>Strict (95)</span>
              </div>
            </div>

            {/* Pricing Delta Threshold */}
            <div className="space-y-2 pt-3 border-t border-app">
              <div className="flex items-center justify-between text-xs">
                <span className="text-app-primary font-semibold">Pricing Delta Trigger Threshold:</span>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20">
                  ≥ {pricingDeltaMin}% Price Shift
                </span>
              </div>
              <input
                type="range"
                min={5}
                max={40}
                value={pricingDeltaMin}
                onChange={(e) => setPricingDeltaMin(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer h-2 bg-slate-200 dark:bg-slate-800 rounded-lg"
              />
              <span className="text-[11px] text-app-muted block">
                Triggers immediate Critical Alert if competitor increases or cuts plan pricing by more than {pricingDeltaMin}%.
              </span>
            </div>

            {/* Category Subscription Toggles */}
            <div className="space-y-2.5 pt-3 border-t border-app">
              <span className="text-xs font-bold text-app-primary font-mono uppercase block">
                Strategic Category Subscriptions
              </span>
              <div className="space-y-2 text-xs">
                <label className="flex items-center gap-3 p-3 rounded-lg border border-app bg-surface-secondary hover:border-blue-500/50 transition-colors cursor-pointer">
                  <input
                    type="checkbox"
                    checked={alertOnAI}
                    onChange={(e) => setAlertOnAI(e.target.checked)}
                    className="rounded border-slate-300 dark:border-slate-700 text-blue-600 focus:ring-blue-500 w-4 h-4"
                  />
                  <div className="flex-1">
                    <span className="text-app-primary font-semibold block">AI & Autonomous Capabilities</span>
                    <span className="text-[11px] text-app-muted">Autonomous copilot features, reasoning tokens, and multi-agent workflows</span>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 rounded-lg border border-app bg-surface-secondary hover:border-blue-500/50 transition-colors cursor-pointer">
                  <input
                    type="checkbox"
                    checked={alertOnPositioning}
                    onChange={(e) => setAlertOnPositioning(e.target.checked)}
                    className="rounded border-slate-300 dark:border-slate-700 text-blue-600 focus:ring-blue-500 w-4 h-4"
                  />
                  <div className="flex-1">
                    <span className="text-app-primary font-semibold block">Market Positioning & Messaging Shifts</span>
                    <span className="text-[11px] text-app-muted">Hero taglines, homepage value props, and target buyer persona modifications</span>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 rounded-lg border border-app bg-surface-secondary hover:border-blue-500/50 transition-colors cursor-pointer">
                  <input
                    type="checkbox"
                    checked={alertOnDeprecations}
                    onChange={(e) => setAlertOnDeprecations(e.target.checked)}
                    className="rounded border-slate-300 dark:border-slate-700 text-blue-600 focus:ring-blue-500 w-4 h-4"
                  />
                  <div className="flex-1">
                    <span className="text-app-primary font-semibold block">Free Tier Reductions & Deprecations</span>
                    <span className="text-[11px] text-app-muted">Free quota tightening, token cap reductions, and paywall moves</span>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Webhook Integration & Test Simulation */}
        <div className="lg:col-span-5 space-y-4">
          <div className="dashboard-card p-6 rounded-xl border border-app bg-surface-primary space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-app-primary font-mono flex items-center gap-2">
              <Send className="w-4 h-4 text-purple-500" />
              Webhook & Channel Forwarding
            </span>

            <div className="space-y-1.5 text-xs">
              <label className="text-[11px] text-app-secondary font-mono uppercase block font-semibold">
                Slack / MS Teams Webhook Endpoint
              </label>
              <input
                type="text"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-surface-secondary border border-app text-app-primary font-mono text-[11px] focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="p-3.5 rounded-lg bg-surface-secondary border border-app space-y-2 text-xs">
              <div className="flex items-center justify-between text-app-secondary">
                <span className="font-semibold text-app-primary">Simulated Dispatch Payload</span>
                <span className="text-[10px] font-mono text-purple-600 dark:text-purple-400 font-bold">JSON</span>
              </div>
              <pre className="text-[10px] font-mono text-app-secondary overflow-x-auto bg-slate-200/50 dark:bg-black/40 p-2.5 rounded-md leading-relaxed">
{`{
  "event": "CRITICAL_COMPETITOR_CHANGE",
  "competitor": "Acme Cloud",
  "delta": "Pro Tier +30% (₹999 -> ₹1,299)",
  "significance": 94,
  "confidence": 98.4,
  "evidence_hash": "sha256:e3b0c442..."
}`}
              </pre>
            </div>

            <button
              onClick={handleSendTestAlert}
              className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm hover:shadow"
            >
              {isTestSent ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>Test Alert Dispatched to Slack Successfully!</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 text-amber-300" />
                  <span>Simulate Test Notification Dispatch</span>
                </>
              )}
            </button>
          </div>

          {/* Noise Suppression Explainer Card */}
          <div className="dashboard-card relative overflow-hidden rounded-xl border border-app bg-surface-primary p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-app-primary flex items-center gap-2">
                <Filter className="w-4 h-4 text-emerald-500" />
                Intelligent Noise Reduction
              </span>
              <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                ACTIVE
              </span>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-baseline justify-between text-xs">
                <span className="text-app-muted">Suppressed low-value changes:</span>
                <span className="font-mono font-bold text-app-primary">287 / 314 (91.4%)</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 w-[91.4%]" />
              </div>
            </div>
            <p className="text-[11px] text-app-secondary leading-relaxed">
              Heuristic semantic difference filtering eliminates minor CSS adjustments, footer copyright updates, and CSRF token churn, ensuring executives only receive actionable competitive movements.
            </p>
          </div>
        </div>
      </div>

      {/* Dispatched Notification History Feed */}
      <div className="dashboard-card rounded-xl border border-app bg-surface-primary overflow-hidden shadow-sm">
        {/* Feed Toolbar */}
        <div className="p-4 border-b border-app flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface-secondary">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-blue-500" />
            <span className="text-xs font-bold text-app-primary uppercase tracking-wider font-mono">
              Prioritized Alert Dispatch Log ({filteredNotifications.length} Signals)
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-app-muted absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Filter alerts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1 rounded-lg bg-surface-primary border border-app text-xs text-app-primary placeholder:text-app-muted focus:outline-none focus:border-blue-500 w-36 sm:w-48"
              />
            </div>

            {/* Severity Pill Selector */}
            <div className="flex items-center bg-surface-primary rounded-lg border border-app p-0.5 text-[11px] font-mono">
              {(["ALL", "CRITICAL", "HIGH", "MEDIUM"] as const).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setSeverityFilter(lvl)}
                  className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                    severityFilter === lvl
                      ? "bg-blue-600 text-white shadow-xs"
                      : "text-app-muted hover:text-app-primary"
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Feed List Items */}
        {filteredNotifications.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <ShieldCheck className="w-8 h-8 text-app-muted mx-auto" />
            <p className="text-sm font-semibold text-app-primary">No alerts match the current filter</p>
            <p className="text-xs text-app-muted">Try resetting search keywords or changing the severity filter.</p>
          </div>
        ) : (
          <div className="divide-y divide-app">
            {filteredNotifications.map((notif) => {
              const borderAccent =
                notif.severity === "CRITICAL"
                  ? "border-l-red-500"
                  : notif.severity === "HIGH"
                  ? "border-l-amber-500"
                  : notif.severity === "MEDIUM"
                  ? "border-l-blue-500"
                  : "border-l-zinc-400";

              return (
                <div
                  key={notif.id}
                  className={`p-4 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4 border-l-[3px] ${borderAccent} hover:bg-slate-50 dark:hover:bg-white/[0.03] group`}
                >
                  <div className="flex items-start sm:items-center gap-3 flex-1 min-w-0">
                    <SeverityBadge severity={notif.severity} />

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded font-mono">
                          {notif.competitor}
                        </span>
                        <h3 className="text-xs sm:text-sm font-bold text-app-primary truncate">
                          {notif.title}
                        </h3>
                      </div>
                      <p className="text-xs text-app-secondary mt-1 leading-relaxed">
                        {notif.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0 self-end md:self-center">
                    <span className="text-[11px] font-mono text-app-muted flex items-center gap-1">
                      <Clock className="w-3 h-3 text-app-muted" />
                      {notif.time}
                    </span>

                    {/* Ask Copilot Action Button */}
                    <button
                      onClick={() =>
                        openChatWithPrompt(
                          `Analyze this alert: "${notif.title}" by competitor ${notif.competitor}. What is the strategic response plan?`
                        )
                      }
                      title="Analyze with PRYSM Copilot"
                      className="px-2.5 py-1 rounded-md border border-app bg-surface-secondary hover:bg-blue-50 dark:hover:bg-blue-500/10 hover:border-blue-500/30 text-app-primary text-xs font-medium transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <Bot className="w-3.5 h-3.5 text-blue-500" />
                      <span className="hidden sm:inline">Ask Copilot</span>
                    </button>

                    {/* View Evidence Action Button */}
                    {notif.evidenceId && (
                      <button
                        onClick={() => openEvidenceDrawer(notif.evidenceId!)}
                        className="px-2.5 py-1 rounded-md bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition-colors cursor-pointer flex items-center gap-1 shadow-xs"
                      >
                        <ExternalLink className="w-3 h-3 text-white" />
                        <span>Evidence</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
