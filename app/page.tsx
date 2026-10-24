"use client";

import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  Radar,
  FileText,
  GitCompare,
  Sparkles,
  Activity,
  ArrowUpRight,
  Shield,
} from "lucide-react";
import { ThemeToggle } from "../components/ui/ThemeToggle";
import { Reveal, StaggerGrid } from "../components/ui/Motion";
import { HeroRotatingPhrase } from "../components/landing/HeroRotatingPhrase";
import { HeroPreviewCard } from "../components/landing/HeroPreviewCard";

const features = [
  {
    icon: Radar,
    title: "Change radar",
    desc: "Recency × impact scatter so critical pricing moves surface first.",
  },
  {
    icon: ShieldCheck,
    title: "Verified evidence",
    desc: "Source URL, observation date, confidence, and SHA-256 on every signal.",
  },
  {
    icon: FileText,
    title: "Cited briefs",
    desc: "Executive reports with [1] [2] markers that open the exact artifact.",
  },
  {
    icon: GitCompare,
    title: "Comparison matrix",
    desc: "Configurable strategic vectors with synthesized intelligence narrative.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-app text-app-primary overflow-hidden page-enter">
      <div className="absolute inset-0 auth-grid opacity-30 pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-500/10 dark:bg-blue-500/20 blur-3xl rounded-full pointer-events-none" />

      <header className="relative z-10 border-b border-app bg-surface-primary/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-linear-to-br from-blue-500 via-indigo-600 to-violet-700 flex items-center justify-center shadow-md">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="12 2 2 22 22 22" />
              </svg>
            </div>
            <span className="font-mono text-lg font-extrabold tracking-wider">PRYSM</span>
          </Link>
          <div className="flex items-center gap-2 ml-auto">
            <ThemeToggle variant="icon" />
            <Link
              href="/login"
              className="hidden sm:inline text-sm font-medium text-app-secondary hover:text-app-primary px-3 py-1.5"
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              className="text-sm font-semibold px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white shadow-sm transition-all"
            >
              Get started
            </Link>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-6xl mx-auto px-6 pt-20 sm:pt-24 pb-24">
        <Reveal eager>
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-8 sm:space-y-10">
          <h1 className="text-[2.35rem] leading-[1.05] sm:text-6xl md:text-7xl lg:text-[4.75rem] font-bold tracking-tight">
            <span className="block text-app-primary">Turn market noise into</span>
            <span className="block mt-2 sm:mt-3 min-h-[1.15em]">
              <HeroRotatingPhrase />
              <span className="text-app-primary">.</span>
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-app-secondary max-w-2xl leading-relaxed">
            Evidence-first monitoring for pricing, features, launches, and positioning.
            Every claim is dated, sourced, and one click away from verification.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Link
              href="/signup"
              className="landing-cta-primary inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-lg shadow-blue-500/20 transition-all"
            >
              Start free workspace
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-app bg-surface-primary hover:bg-surface-secondary font-semibold text-app-primary transition-all"
            >
              Open command center
            </Link>
          </div>
          <HeroPreviewCard />
        </div>
        </Reveal>

        <StaggerGrid className="mt-20 grid sm:grid-cols-2 lg:grid-cols-4 gap-4" staggerMs={90}>
          {features.map((f) => (
            <div
              key={f.title}
              className="landing-feature-card group p-5 rounded-2xl border border-app bg-surface-primary shadow-sm hover:border-blue-500/30 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 h-full"
            >
              <f.icon className="w-8 h-8 text-blue-600 dark:text-blue-400 mb-3 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3" />
              <h3 className="font-semibold text-app-primary mb-1">{f.title}</h3>
              <p className="text-sm text-app-secondary leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </StaggerGrid>

        <Reveal delay={200}>
        <div className="mt-16 rounded-2xl border border-app bg-surface-secondary p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-left">
            <h2 className="text-xl font-bold text-app-primary">Ready for the 3-minute executive demo?</h2>
            <p className="text-sm text-app-secondary mt-2 max-w-md">
              Acme Pro +30% pricing → evidence drawer → Run Scan → cited weekly brief. Rehearse the full pipeline.
            </p>
          </div>
          <Link
            href="/demo"
            className="shrink-0 px-5 py-2.5 rounded-lg bg-linear-to-r from-amber-500 to-orange-500 text-white font-bold text-sm shadow-md"
          >
            ⭐ Interactive demo sandbox
          </Link>
        </div>
        </Reveal>
      </main>

      <footer className="relative z-10 border-t border-app py-8 text-center text-xs text-app-muted font-mono">
        PRYSM · Observe. Verify. Decide.
      </footer>
    </div>
  );
}
