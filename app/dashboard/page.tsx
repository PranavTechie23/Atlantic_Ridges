"use client";

import React, { useEffect, useState } from "react";
import { KpiCard } from "../../components/dashboard/KpiCard";
import { CriticalIntelligenceCard } from "../../components/dashboard/CriticalIntelligenceCard";
import { ThreatGauge } from "../../components/dashboard/ThreatGauge";
import { MarketSignalChart } from "../../components/dashboard/MarketSignalChart";
import { getChanges } from "../../lib/api";
import { ChangeItem } from "../../lib/types";
import { useApp } from "../../lib/context/AppContext";
import { Building2, Zap, ShieldCheck, ArrowRight, Play, Sparkles } from "lucide-react";
import Link from "next/link";
import { LivePulseIndicator } from "../../components/ui/LivePulseIndicator";
import { Reveal, StaggerGrid } from "../../components/ui/Motion";
import { GuestModeBanner } from "../../components/layout/GuestModeBanner";
import { PrioritySignalsSkeleton } from "../../components/dashboard/PrioritySignalsSkeleton";
import { DashboardQuickNav } from "../../components/dashboard/DashboardQuickNav";
import { RoiCalculator } from "../../components/dashboard/RoiCalculator";

export default function DashboardPage() {
  const { openEvidenceDrawer, lastScanText } = useApp();
  const [changes, setChanges] = useState<ChangeItem[]>([]);
  const [signalsReady, setSignalsReady] = useState(false);

  useEffect(() => {
    let active = true;
    getChanges().then((data) => {
      if (!active) return;
      setChanges(data);
      setSignalsReady(true);
    });
    return () => {
      active = false;
    };
  }, []);

  const priorityChanges = changes
    .filter((c) => c.severity === "HIGH" || c.severity === "CRITICAL")
    .slice(0, 3);

  const [featured, ...rest] = priorityChanges;

  return (
    <div className="relative space-y-8 pb-10 page-enter">
      <GuestModeBanner />
      <div className="dashboard-ambient pointer-events-none absolute -top-10 left-1/3 -z-10 h-64 w-80 rounded-full bg-blue-500/10 blur-[100px] dark:bg-blue-600/12" />
      <div className="dashboard-ambient pointer-events-none absolute top-40 right-10 -z-10 h-56 w-72 rounded-full bg-indigo-500/8 blur-[90px] dark:bg-indigo-600/10" />

      <Reveal>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1.5">
              <LivePulseIndicator
                status="active"
                label="Continuous Market Surveillance"
                sublabel="CDX & Web Sync"
              />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-app-primary">
              Command Center
            </h1>
            <p className="text-sm text-app-secondary mt-1 max-w-lg">
              High-impact signals across your monitored competitors.
              <span className="hidden sm:inline text-app-muted"> · Last scan {lastScanText}</span>
            </p>
            <div className="mt-4">
              <DashboardQuickNav />
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <Link
              href="/demo"
              className="btn-demo-ghost inline-flex items-center gap-2 px-4 py-2 rounded-xl text-amber-700 dark:text-amber-300/95 text-xs font-bold hover:border-amber-400/50 transition-all duration-300 group"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500 group-hover:rotate-12 transition-transform duration-300" />
              <span>Interactive Demo</span>
            </Link>

            <button
              type="button"
              onClick={() => openEvidenceDrawer("ev-acme-pricing-20261023")}
              className="btn-cta-primary inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white transition-all duration-300 hover:-translate-y-0.5"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Acme +30% pricing</span>
            </button>
          </div>
        </div>
      </Reveal>

      <StaggerGrid className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4" staggerMs={80}>
        <KpiCard
          title="Monitored"
          value={12}
          change="+2"
          context="competitors"
          isPositive
          icon={Building2}
          sparklineData={[8, 9, 10, 11, 12]}
          minimal
        />
        <KpiCard
          title="Changes"
          value={27}
          change="+8"
          context="this week"
          isPositive
          icon={Zap}
          sparklineData={[12, 18, 21, 27]}
          minimal
        />
        <KpiCard
          title="High impact"
          value={8}
          change="+3"
          context="today"
          isPositive
          icon={Zap}
          sparklineData={[2, 4, 6, 8]}
          minimal
        />
        <KpiCard
          title="Confidence"
          value="94.7%"
          change="+2.4%"
          context="verified"
          isPositive
          icon={ShieldCheck}
          sparklineData={[91, 93, 94.7]}
          minimal
        />
      </StaggerGrid>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 xl:gap-6 items-stretch">
        <section className="xl:col-span-8 flex flex-col space-y-4 min-h-0">
          <Reveal delay={100}>
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-app-primary">Priority signals</h2>
              <Link
                href="/timeline"
                className="text-xs text-blue-600 dark:text-blue-400 font-medium flex items-center gap-1 hover:underline group"
              >
                All changes
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-300" />
              </Link>
            </div>
          </Reveal>

          {!signalsReady && <PrioritySignalsSkeleton />}

          {signalsReady && featured && (
            <CriticalIntelligenceCard item={featured} featured revealEager revealDelay={80} />
          )}

          {signalsReady && rest.length > 0 && (
            <div className="space-y-2">
              {rest.map((item, i) => (
                <CriticalIntelligenceCard key={item.id} item={item} compact revealDelay={250 + i * 80} />
              ))}
            </div>
          )}

          {signalsReady && !featured && (
            <div className="dashboard-card rounded-xl p-8 text-center space-y-3">
              <p className="text-sm text-app-secondary">No high-impact signals in the queue.</p>
              <Link
                href="/radar"
                className="inline-flex text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
              >
                Open change radar
              </Link>
            </div>
          )}
        </section>

        <aside className="xl:col-span-4 xl:sticky xl:top-20 self-start w-full min-w-0">
          <Reveal eager delay={120}>
            <ThreatGauge compact />
          </Reveal>
        </aside>
      </div>

      <Reveal delay={300}>
        <MarketSignalChart />
      </Reveal>

      <Reveal delay={350}>
        <RoiCalculator />
      </Reveal>
    </div>
  );
}
