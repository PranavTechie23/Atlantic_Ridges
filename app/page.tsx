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
          <div className="landing-eyebrow inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-300 text-xs font-semibold tracking-wide">
            <Sparkles className="w-3.5 h-3.5" />
            HACKNOVA&apos;26 · Competitor Intelligence Agent
          </div>
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
          <div className="landing-preview relative w-full max-w-5xl mt-5 text-left">
            <div className="landing-preview-glow pointer-events-none absolute -inset-8 rounded-[2rem] blur-3xl" />
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#090d18]/90 shadow-[0_35px_100px_-35px_rgba(37,99,235,0.45)] backdrop-blur-2xl">
              <div className="flex items-center justify-between border-b border-white/[0.08] px-4 py-3 sm:px-6">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5"><i className="h-2 w-2 rounded-full bg-red-400/80"/><i className="h-2 w-2 rounded-full bg-amber-300/80"/><i className="h-2 w-2 rounded-full bg-emerald-400/80"/></div>
                  <span className="font-mono text-[10px] tracking-[0.18em] text-slate-400">PRYSM / COMMAND CENTER</span>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/[0.08] px-2.5 py-1 font-mono text-[9px] uppercase tracking-wider text-emerald-300"><i className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400"/>Live monitoring</span>
              </div>
              <div className="grid gap-4 p-4 sm:grid-cols-[1.4fr_0.8fr] sm:p-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-2.5">
                    {[['12','Competitors'],['38','Signals found'],['94','Avg. confidence']].map(([n,l])=><div key={l} className="rounded-xl border border-white/[0.08] bg-white/[0.035] p-3 sm:p-4"><div className="font-mono text-xl font-semibold tracking-tight text-white sm:text-2xl">{n}<span className="text-blue-400">{l==='Avg. confidence'?'%':'+'}</span></div><div className="mt-1 text-[9px] uppercase tracking-[0.12em] text-slate-500 sm:text-[10px]">{l}</div></div>)}
                  </div>
                  <div className="rounded-xl border border-white/[0.08] bg-white/[0.025] p-4 sm:p-5">
                    <div className="mb-4 flex items-center justify-between"><div><div className="flex items-center gap-2 text-xs font-semibold text-slate-200"><Activity className="h-3.5 w-3.5 text-blue-400"/>Market signal activity</div><div className="mt-1 text-[10px] text-slate-500">Competitive moves detected over time</div></div><span className="font-mono text-[9px] text-slate-500">LAST 30 DAYS</span></div>
                    <div className="landing-chart relative h-28 overflow-hidden rounded-lg"><div className="absolute inset-0 landing-chart-grid"/><svg viewBox="0 0 600 120" preserveAspectRatio="none" className="absolute inset-0 h-full w-full"><defs><linearGradient id="signalFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#3b82f6" stopOpacity=".36"/><stop offset="100%" stopColor="#3b82f6" stopOpacity="0"/></linearGradient><linearGradient id="signalLine"><stop stopColor="#38bdf8"/><stop offset="100%" stopColor="#818cf8"/></linearGradient></defs><path d="M0 94 C42 88 47 72 90 78 S144 92 180 65 S230 72 270 56 S324 68 360 42 S415 66 450 48 S500 59 540 26 S575 42 600 15 V120 H0Z" fill="url(#signalFill)"/><path d="M0 94 C42 88 47 72 90 78 S144 92 180 65 S230 72 270 56 S324 68 360 42 S415 66 450 48 S500 59 540 26 S575 42 600 15" fill="none" stroke="url(#signalLine)" strokeWidth="2.5" vectorEffect="non-scaling-stroke"/><circle cx="540" cy="26" r="4" fill="#7dd3fc" stroke="#0b1120" strokeWidth="3" vectorEffect="non-scaling-stroke"/></svg></div>
                    <div className="mt-3 flex justify-between font-mono text-[9px] text-slate-600"><span>OCT 01</span><span>OCT 08</span><span>OCT 15</span><span>OCT 23</span></div>
                  </div>
                </div>
                <div className="rounded-xl border border-rose-300/15 bg-gradient-to-br from-rose-400/[0.08] via-white/[0.025] to-transparent p-4 sm:p-5">
                  <div className="mb-4 flex items-center justify-between"><span className="font-mono text-[9px] font-semibold uppercase tracking-[0.18em] text-rose-300">Priority intelligence</span><span className="rounded-md border border-rose-300/20 bg-rose-300/10 px-2 py-1 font-mono text-[9px] text-rose-200">HIGH IMPACT</span></div>
                  <div className="text-[10px] text-slate-500">ACME CLOUD <span className="px-1 text-slate-700">/</span> PRICING</div>
                  <h3 className="mt-2 text-lg font-semibold leading-snug text-white">Pro plan price increased by 30%</h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-400">A verified pricing change surfaced in monitored public sources.</p>
                  <div className="mt-4 rounded-lg border border-white/[0.07] bg-black/20 p-3"><div className="flex items-center gap-2 text-[10px] text-slate-500"><Shield className="h-3 w-3 text-emerald-400"/>Source verified <span className="ml-auto font-mono text-emerald-300">94% confidence</span></div><div className="mt-2 h-px bg-white/[0.07]"/><div className="mt-2 flex items-center justify-between font-mono text-[10px]"><span className="text-slate-500">₹999 <span className="text-slate-700">→</span> ₹1,299</span><span className="text-rose-300">+30%</span></div></div>
                  <div className="mt-4 flex items-center justify-between text-[10px] text-slate-500"><span>OCT 23, 2026</span><span className="inline-flex items-center gap-1 text-blue-300">Open evidence <ArrowUpRight className="h-3 w-3"/></span></div>
                </div>
              </div>
              <div className="flex items-center justify-between border-t border-white/[0.07] px-4 py-2.5 sm:px-6"><span className="font-mono text-[9px] text-slate-600">EVIDENCE FIRST · EVERY SIGNAL SOURCE LINKED</span><span className="hidden font-mono text-[9px] text-slate-600 sm:block">MARKET INTELLIGENCE / 01</span></div>
            </div>
          </div>
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
