"use client";

import Link from "next/link";
import { Shield, Copy, Check, LogIn, KeyRound, Sparkles } from "lucide-react";
import { useState } from "react";
import { DEMO_ACCESS_COPY } from "../../lib/auth/demo-access";
import { sounds } from "../../lib/utils/sound";

export function JudgeSignInPanel() {
  const [copied, setCopied] = useState(false);

  const copyAll = () => {
    void navigator.clipboard.writeText(
      `${DEMO_ACCESS_COPY.email}\n${DEMO_ACCESS_COPY.password}`
    );
    sounds.playTick();
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/[0.04] p-5 sm:p-6 space-y-4">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0">
          <Shield className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
        </div>
        <div className="space-y-1 min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-app-primary tracking-tight">
              Demo Workspace Access
            </h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
              Verified Account
            </span>
          </div>
          <p className="text-[11px] text-app-secondary leading-relaxed max-w-xl">
            Optional pre-provisioned account for exploring the demo workspace. Account access uses <span className="text-app-primary font-mono font-semibold">scrypt</span>{" "}
            password hashing and <span className="text-app-primary font-mono font-semibold">HttpOnly</span> sessions.
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 rounded-lg bg-surface-primary border border-app px-4 py-3 font-mono text-[11px] shadow-2xs">
        <KeyRound className="w-4 h-4 text-app-muted shrink-0 hidden sm:block" aria-hidden />
        <div className="flex-1 grid sm:grid-cols-2 gap-2 sm:gap-6 min-w-0">
          <div className="truncate">
            <span className="text-app-muted mr-2 uppercase text-[10px] font-bold">Email</span>
            <span className="text-app-primary font-semibold">{DEMO_ACCESS_COPY.email}</span>
          </div>
          <div>
            <span className="text-app-muted mr-2 uppercase text-[10px] font-bold">Password</span>
            <span className="text-app-primary font-semibold">{DEMO_ACCESS_COPY.password}</span>
          </div>
        </div>
        <button
          type="button"
          onClick={copyAll}
          className="shrink-0 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg border border-app text-app-muted hover:text-app-primary hover:bg-surface-secondary text-[10px] font-semibold uppercase tracking-wide transition-colors cursor-pointer"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Link
          href="/login?autofill=demo&next=/dashboard"
          onClick={() => sounds.click()}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-sm transition-all hover:scale-[1.02]"
        >
          <LogIn className="w-4 h-4" />
          Sign in to Demo Workspace
        </Link>
        <span className="text-[11px] text-app-muted">
          Opens the sample intelligence workspace
        </span>
      </div>
    </div>
  );
}
