"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { useApp } from "../../lib/context/AppContext";
import { CheckCircle2, ArrowRight, X, Sparkles, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { sounds } from "../../lib/utils/sound";

export function WelcomeToast() {
  const { user, authReady, openEvidenceDrawer } = useApp();
  const [visible, setVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [progress, setProgress] = useState(0); // 0% -> 100%
  const [isPaused, setIsPaused] = useState(false);

  const durationMs = 5000; // 5 seconds display
  const isPausedRef = useRef(false);
  const startTimeRef = useRef<number>(0);
  const elapsedRef = useRef<number>(0);
  const rafRef = useRef<number | null>(null);
  const completedRef = useRef(false);

  // Sync ref with paused state without breaking the loop
  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  const triggerExit = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    setIsExiting(true);
    setTimeout(() => {
      setVisible(false);
    }, 380);
  }, []);

  const startCountdown = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    completedRef.current = false;
    setIsExiting(false);
    setProgress(0);
    elapsedRef.current = 0;
    startTimeRef.current = performance.now();

    const loop = (now: number) => {
      if (!isPausedRef.current) {
        elapsedRef.current += now - startTimeRef.current;
      }
      startTimeRef.current = now;

      const pct = Math.min(100, (elapsedRef.current / durationMs) * 100);
      setProgress(pct);

      if (pct < 100) {
        rafRef.current = requestAnimationFrame(loop);
      } else {
        // Loader has reached 100% completion!
        setProgress(100);
        sounds.playSuccess();
        // Give 200ms for user to see the 100% full green laser before vanishing
        setTimeout(() => {
          triggerExit();
        }, 200);
      }
    };

    rafRef.current = requestAnimationFrame(loop);
  }, [durationMs, triggerExit]);

  useEffect(() => {
    if (!authReady || !user) return;

    // Small entrance delay for smooth page reveal
    const timer = setTimeout(() => {
      setVisible(true);
      sounds.playChirp();
      startCountdown();
    }, 400);

    // Allow manual re-trigger via custom event
    const handleReTrigger = () => {
      setVisible(true);
      startCountdown();
    };
    window.addEventListener("prysm:show-welcome", handleReTrigger);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("prysm:show-welcome", handleReTrigger);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [authReady, user, startCountdown]);

  const handleDismiss = () => {
    sounds.playTick();
    triggerExit();
  };

  const handleInspectSignal = (e: React.MouseEvent) => {
    e.preventDefault();
    sounds.playChirp();
    openEvidenceDrawer("ev-acme-pricing-20261023");
    triggerExit();
  };

  if (!visible || !user) return null;

  const displayName = user.name || "Strategist";

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className={`fixed bottom-6 right-4 sm:right-6 z-50 max-w-md w-[calc(100vw-2rem)] sm:w-auto pointer-events-auto transition-all duration-380 ease-out ${
        isExiting
          ? "opacity-0 translate-y-4 scale-95 pointer-events-none"
          : "opacity-100 translate-y-0 scale-100 animate-in fade-in slide-in-from-bottom-4"
      }`}
      role="status"
      aria-live="polite"
    >
      <div className="relative rounded-2xl p-4 shadow-2xl bg-[#051810]/95 dark:bg-[#03130c]/98 backdrop-blur-2xl border-2 border-emerald-500/60 shadow-[0_12px_40px_rgba(5,150,105,0.28)] flex flex-col gap-3 overflow-hidden group hover:border-emerald-400 transition-all duration-300">
        {/* Emerald Ambient Glow */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-emerald-500/25 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-teal-500/15 rounded-full blur-xl pointer-events-none" />

        {/* Header Row */}
        <div className="flex items-start justify-between gap-3 relative z-10">
          <div className="flex items-center gap-2.5">
            {/* Glowing Green Shield Icon */}
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center shrink-0 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.4)]">
              <ShieldCheck className="w-5 h-5 text-emerald-300" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                </span>
                <span className="text-[10px] font-bold tracking-wider uppercase text-emerald-400">
                  Surveillance Engine Live
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
                  12 Active
                </span>
              </div>
              <h4 className="text-sm font-bold text-white tracking-tight mt-0.5">
                Welcome, {displayName}
              </h4>
            </div>
          </div>

          {/* Dismiss Button */}
          <button
            type="button"
            onClick={handleDismiss}
            className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-emerald-500/20 border border-transparent hover:border-emerald-500/30 transition-all shrink-0 cursor-pointer"
            aria-label="Dismiss notification"
            title="Dismiss notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Message Content */}
        <p className="text-xs text-emerald-100/90 leading-relaxed relative z-10">
          Continuous market monitoring is active. High-impact{" "}
          <strong className="text-emerald-300 font-semibold">Acme +30% pricing surge</strong> was verified across historical CDX snapshots.
        </p>

        {/* Action Buttons Row */}
        <div className="flex items-center justify-between gap-2 pt-1 border-t border-emerald-500/20 relative z-10">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleInspectSignal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-bold transition-all shadow-[0_0_12px_rgba(16,185,129,0.5)] hover:shadow-[0_0_16px_rgba(16,185,129,0.8)] cursor-pointer hover:-translate-y-0.5"
            >
              <Sparkles className="w-3.5 h-3.5 fill-current" />
              <span>Inspect Acme Signal</span>
              <ArrowRight className="w-3 h-3" />
            </button>

            <Link
              href="/demo"
              onClick={handleDismiss}
              className="text-xs text-emerald-300/80 hover:text-emerald-200 font-medium px-2 py-1 rounded-md hover:bg-emerald-500/10 transition-colors"
            >
              Demo Sandbox
            </Link>
          </div>

          <span className="text-[10px] font-mono text-emerald-400/70 hidden sm:inline">
            {Math.round(progress)}%
          </span>
        </div>

        {/* Bottom High-Precision Green Laser Loader Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-emerald-950/80 overflow-hidden">
          <div
            className="h-full transition-[width] ease-linear"
            style={{
              width: `${progress}%`,
              background: "linear-gradient(90deg, #059669 0%, #10B981 50%, #34D399 100%)",
              boxShadow: "0 0 14px rgba(52, 211, 153, 0.95)",
              transitionDuration: isPaused ? "0ms" : "75ms",
            }}
            aria-hidden
          />
        </div>
      </div>
    </div>
  );
}
