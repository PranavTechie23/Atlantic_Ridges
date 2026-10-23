"use client";

import React, { useEffect, useState } from "react";
import { ShieldCheck, TrendingUp, Globe } from "lucide-react";
import { LivePulseIndicator } from "../ui/LivePulseIndicator";
import { AnimatedCounter } from "../ui/AnimatedCounter";
import { BorderBeam } from "../ui/BorderBeam";

const HASH_TAIL = "8f3a9b2e…c21d";

export function AuthVisual({ compact = false }: { compact?: boolean }) {
  const [score, setScore] = useState(0);
  const [hashVisible, setHashVisible] = useState("");
  const [observedAgo, setObservedAgo] = useState("just now");

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setHashVisible(HASH_TAIL);
      return;
    }
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setHashVisible(HASH_TAIL.slice(0, Math.min(i, HASH_TAIL.length)));
      if (i >= HASH_TAIL.length) window.clearInterval(id);
    }, 45);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    const start = Date.now();
    const id = window.setInterval(() => {
      const s = Math.floor((Date.now() - start) / 1000);
      if (s < 5) setObservedAgo("just now");
      else if (s < 60) setObservedAgo(`${s}s ago`);
      else setObservedAgo(`${Math.floor(s / 60)}m ago`);
    }, 2000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setScore(82);
      return;
    }
    const start = performance.now();
    const duration = 1400;
    let frame: number;
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setScore(Math.round(82 * eased));
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div
      className={`relative w-full ${compact ? "max-w-sm mx-auto" : "max-w-[420px] lg:mx-0"}`}
    >
      <div
        className="auth-visual-card auth-card-enter auth-signal-showcase relative rounded-2xl overflow-hidden"
        style={{ "--enter-delay": "0ms" } as React.CSSProperties}
      >
        <BorderBeam size={220} duration={14} borderWidth={1} colorFrom="#EF4444" colorTo="#3B82F6" />
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-linear-to-b from-red-500/[0.06] via-transparent to-transparent dark:from-red-500/10"
          aria-hidden
        />

        <div className="relative p-4 sm:p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <LivePulseIndicator status="alert" label="Live signal" sublabel="2s heartbeat" />
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/12 text-red-600 dark:text-red-400 font-semibold border border-red-500/25">
                Critical
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-medium border border-blue-500/20">
                Pricing
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-xl bg-surface-secondary border border-app flex items-center justify-center text-[11px] font-mono font-bold text-app-primary shrink-0">
              AC
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-app-primary truncate">Acme Cloud</p>
              <p className="text-[10px] text-app-muted flex items-center gap-1 truncate">
                <Globe className="w-3 h-3 shrink-0" />
                acme.cloud/pricing · {observedAgo}
              </p>
            </div>
            <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-2 py-0.5 rounded-full shrink-0">
              <TrendingUp className="w-3 h-3" />
              +30%
            </span>
          </div>

          <p className="text-[15px] sm:text-base font-semibold text-app-primary leading-snug tracking-tight">
            Pro tier price increase detected across checkout and marketing pages
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-3 items-center">
            <div className="inline-flex items-center gap-2.5 text-sm font-mono px-3 py-2 rounded-xl bg-surface-secondary dark:bg-black/25 border border-app w-fit">
              <span className="line-through text-app-muted text-xs">₹999</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold text-base">
                ₹<AnimatedCounter value={1299} duration={1600} decimals={0} />
              </span>
              <span className="text-app-muted text-xs">/ mo</span>
            </div>

            <div className="space-y-1.5 min-w-0">
              <div className="flex items-center justify-between gap-2 text-[11px]">
                <span className="text-app-muted font-medium">Threat score</span>
                <span className="font-mono tabular-nums text-app-primary">
                  <strong className="text-red-600 dark:text-red-400">{score}</strong>
                  <span className="text-app-muted">/100</span>
                </span>
              </div>
              <div className="h-2 rounded-full bg-surface-secondary dark:bg-black/40 overflow-hidden border border-app">
                <span
                  className="auth-threat-bar block h-full rounded-full bg-linear-to-r from-amber-500 via-orange-500 to-red-500"
                  style={{ width: `${score}%`, animation: "none" }}
                />
              </div>
            </div>
          </div>

          <div className="auth-verify-strip relative rounded-xl border border-emerald-500/20 bg-emerald-500/[0.06] dark:bg-emerald-500/[0.08] px-3.5 py-3">
            <div className="flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5 auth-verify-icon" />
              <div className="min-w-0 space-y-1">
                <p className="text-xs font-medium text-app-primary">
                  Evidence verified ·{" "}
                  <span className="text-emerald-600 dark:text-emerald-400">97% confidence</span>
                </p>
                <p className="text-[10px] font-mono text-app-muted truncate">
                  sha256:{hashVisible || "…"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
