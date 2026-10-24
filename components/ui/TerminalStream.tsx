"use client";

import React, { useState, useEffect } from "react";
import { Terminal, ShieldCheck, Check, Sparkles, Copy } from "lucide-react";

interface TerminalStreamProps {
  isRunning?: boolean;
  onComplete?: () => void;
  targetDomain?: string;
  className?: string;
}

export function TerminalStream({
  isRunning = true,
  onComplete,
  targetDomain = "acmecloud.io",
  className = "",
}: TerminalStreamProps) {
  const [logs, setLogs] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const streamSteps = [
    `[INFO] Ingest pipeline triggered for target: https://${targetDomain}/pricing`,
    `[ROBOTS] Ingesting https://${targetDomain}/robots.txt... OK (200)`,
    `[COMPLY] User-Agent 'PRYSM-Intelligence-Bot' checked against 14 Disallow directives -> PERMITTED`,
    `[RATE] Enforcing polite crawl delay: 2,000ms backoff interval active`,
    `[FETCH] Ingesting public DOM snapshot... 48.2 KB payload received`,
    `[FILTER] Stage 2: Stripping CSRF nonces (tok_982a...) & OneTrust cookie subtree`,
    `[FILTER] Stage 2: Eliminating Google Tag Manager dynamic beacons (gtm.start)`,
    `[AST] Generating normalized AST entity tree... 4 pricing tiers mapped`,
    `[DIFF] Comparing current DOM AST vs 2026-10-20 snapshot baseline...`,
    `[MUTATION] DETECTED: Pro Tier increased ₹999 -> ₹1,299/mo (+30.0%)`,
    `[SCORE] Evaluating significance: wp=0.40(Δp) + wf=0.30(Δf) -> Score: 94/100 (CRITICAL)`,
    `[HASH] Calculating SHA-256 digest: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`,
    `[EVIDENCE] Immutable provenance artifact anchored to vault with timestamp 2026-10-23T09:45:00Z`,
    `[DISPATCH] Real-time notification routed to strategy desk. Executive Brief synthesized.`,
  ];

  useEffect(() => {
    if (!isRunning) return;

    setLogs([]);
    let currentIndex = 0;

    const interval = setInterval(() => {
      if (currentIndex < streamSteps.length) {
        setLogs((prev) => [...prev, streamSteps[currentIndex]]);
        currentIndex++;
      } else {
        clearInterval(interval);
        if (onComplete) onComplete();
      }
    }, 280);

    return () => clearInterval(interval);
  }, [isRunning, targetDomain]);

  const handleCopyLogs = () => {
    navigator.clipboard.writeText(logs.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`rounded-xl border border-slate-800 bg-[#0A0C10] font-mono text-xs overflow-hidden shadow-xl ${className}`}
    >
      {/* Terminal Title Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/95 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
          </div>
          <span className="text-[11px] text-slate-300 font-semibold ml-2 flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-blue-400" />
            <span>PRYSM Surveillance Daemon v1.0.0</span>
          </span>
        </div>

        <button
          onClick={handleCopyLogs}
          className="text-[10px] text-slate-300 hover:text-white flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors cursor-pointer"
        >
          {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
          <span>{copied ? "Copied" : "Copy Output"}</span>
        </button>
      </div>

      {/* Stream Window */}
      <div className="p-4 space-y-1.5 max-h-72 overflow-y-auto select-text text-[11px] leading-relaxed">
        {logs.map((log, index) => {
          let color = "text-zinc-400";
          if (log.includes("[INFO]")) color = "text-blue-400";
          if (log.includes("[ROBOTS]") || log.includes("[COMPLY]")) color = "text-emerald-400";
          if (log.includes("[MUTATION]") || log.includes("[SCORE]")) color = "text-amber-400 font-bold";
          if (log.includes("[HASH]") || log.includes("[EVIDENCE]")) color = "text-purple-400";
          if (log.includes("[DISPATCH]")) color = "text-emerald-300 font-bold";

          return (
            <div key={index} className={`flex items-start gap-2 ${color} animate-in fade-in duration-200`}>
              <span className="text-zinc-600 select-none text-[10px]">{String(index + 1).padStart(2, "0")}</span>
              <span className="font-mono">{log}</span>
            </div>
          );
        })}

        {/* Pulsing Command Prompt Cursor */}
        <div className="flex items-center gap-1.5 text-blue-400 pt-1">
          <span className="text-emerald-400 font-bold">❯</span>
          <span className="w-2 h-4 bg-blue-400 inline-block animate-pulse" />
        </div>
      </div>
    </div>
  );
}
