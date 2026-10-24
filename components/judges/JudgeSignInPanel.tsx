"use client";

import Link from "next/link";
import { Shield, Copy, Check, LogIn, KeyRound } from "lucide-react";
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
    <div className="rounded-xl border border-emerald-500/30 bg-linear-to-br from-emerald-500/[0.08] to-[#0D0F14] p-5 sm:p-6 space-y-4">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0">
          <Shield className="w-5 h-5 text-emerald-400" />
        </div>
        <div className="space-y-1 min-w-0">
          <h2 className="text-sm font-bold text-[#F5F7FA] tracking-tight">Judge workspace access</h2>
          <p className="text-[11px] text-zinc-400 leading-relaxed max-w-xl">
            Seeded PostgreSQL account with <span className="text-zinc-300 font-mono">scrypt</span>{" "}
            password hashes and <span className="text-zinc-300 font-mono">HttpOnly</span> sessions.
            Run test #5 or <span className="text-emerald-400/90">/api/auth/security-audit</span> after
            sign-in.
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 rounded-lg bg-[#111318] border border-[#262A33] px-4 py-3 font-mono text-[11px]">
        <KeyRound className="w-4 h-4 text-zinc-500 shrink-0 hidden sm:block" aria-hidden />
        <div className="flex-1 grid sm:grid-cols-2 gap-2 sm:gap-6 min-w-0">
          <div className="truncate">
            <span className="text-zinc-500 mr-2">email</span>
            <span className="text-zinc-200">{DEMO_ACCESS_COPY.email}</span>
          </div>
          <div>
            <span className="text-zinc-500 mr-2">password</span>
            <span className="text-zinc-200">{DEMO_ACCESS_COPY.password}</span>
          </div>
        </div>
        <button
          type="button"
          onClick={copyAll}
          className="shrink-0 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#262A33] text-zinc-400 hover:text-zinc-200 hover:border-zinc-600 text-[10px] font-semibold uppercase tracking-wide transition-colors"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      <div className="flex flex-wrap gap-2.5">
        <Link
          href="/login?autofill=judge&next=/judges"
          onClick={() => sounds.click()}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-900/30 transition-all hover:scale-[1.02]"
        >
          <LogIn className="w-4 h-4" />
          Sign in with judge account
        </Link>
        <span className="text-[10px] text-zinc-500 self-center">
          Requires <span className="font-mono text-zinc-400">npm run db:seed</span>
        </span>
      </div>
    </div>
  );
}
