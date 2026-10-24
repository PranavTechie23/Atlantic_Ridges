"use client";

import React, { useEffect, useRef, useState } from "react";
import type { IntelligenceReport } from "@/lib/types";
import {
  attachReportPrintHandlers,
  downloadReportJson,
  downloadReportMarkdown,
  printIntelligenceBrief,
} from "@/lib/utils/report-export";
import { sounds } from "@/lib/utils/sound";
import {
  Check,
  ChevronDown,
  ChevronLeft,
  Copy,
  Download,
  FileJson,
  FileText,
  Printer,
  Share2,
} from "lucide-react";
import Link from "next/link";

type ExportKind = "md" | "json" | "print" | "link";

export function ReportExportBar({ report }: { report: IntelligenceReport }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => attachReportPrintHandlers(), []);

  useEffect(() => {
    if (!menuOpen) return;
    const onDoc = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [menuOpen]);

  const flash = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2800);
  };

  const runExport = (kind: ExportKind) => {
    setMenuOpen(false);
    sounds.playTick();

    if (kind === "md") {
      downloadReportMarkdown(report);
      sounds.playSuccess();
      flash("Markdown brief downloaded");
      return;
    }
    if (kind === "json") {
      downloadReportJson(report);
      sounds.playSuccess();
      flash("JSON export downloaded");
      return;
    }
    if (kind === "print") {
      flash("Generating PDF dossier... Select 'Save as PDF'");
      printIntelligenceBrief(report);
      return;
    }
    if (kind === "link") {
      const url = typeof window !== "undefined" ? window.location.href : "";
      navigator.clipboard.writeText(url).then(
        () => {
          sounds.playSuccess();
          flash("Share link copied");
        },
        () => flash("Could not copy link")
      );
    }
  };

  return (
    <div className="no-print relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-app pb-4">
      <Link
        href="/reports"
        className="text-xs text-app-muted hover:text-app-primary flex items-center gap-1 font-medium transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to all reports
      </Link>

      <div className="flex items-center gap-2 flex-wrap justify-end">
        {toast && (
          <span className="inline-flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium animate-in fade-in">
            <Check className="w-3.5 h-3.5" />
            {toast}
          </span>
        )}

        <button
          type="button"
          onClick={() => runExport("print")}
          className="px-3.5 py-1.5 rounded-lg border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-xs font-semibold text-red-600 dark:text-red-400 flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
          title="Print to PDF dossier (Tip: check 'Background graphics' for cover styling)"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Export PDF Dossier</span>
        </button>

        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
            aria-expanded={menuOpen}
            aria-haspopup="menu"
          >
            <Download className="w-3.5 h-3.5" />
            Export Format
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${menuOpen ? "rotate-180" : ""}`} />
          </button>

          {menuOpen && (
            <div
              role="menu"
              className="absolute right-0 top-full mt-1.5 w-56 rounded-xl border border-app bg-surface-primary shadow-xl py-1 z-50 animate-in fade-in zoom-in-95 duration-150"
            >
              <button
                type="button"
                role="menuitem"
                onClick={() => runExport("print")}
                className="w-full px-3 py-2 text-left text-xs text-app-primary hover:bg-surface-secondary flex items-center gap-2 font-medium"
              >
                <Printer className="w-4 h-4 text-red-500" />
                Executive PDF (.pdf)
              </button>
              <button
                type="button"
                role="menuitem"
                onClick={() => runExport("md")}
                className="w-full px-3 py-2 text-left text-xs text-app-secondary hover:bg-surface-secondary flex items-center gap-2"
              >
                <FileText className="w-4 h-4 text-blue-500" />
                Markdown Brief (.md)
              </button>
              <button
                type="button"
                role="menuitem"
                onClick={() => runExport("json")}
                className="w-full px-3 py-2 text-left text-xs text-app-secondary hover:bg-surface-secondary flex items-center gap-2"
              >
                <FileJson className="w-4 h-4 text-violet-500" />
                Structured JSON (.json)
              </button>
              <button
                type="button"
                role="menuitem"
                onClick={() => runExport("link")}
                className="w-full px-3 py-2 text-left text-xs text-app-secondary hover:bg-surface-secondary flex items-center gap-2"
              >
                <Share2 className="w-4 h-4 text-emerald-500" />
                Copy share link
              </button>
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  navigator.clipboard.writeText(report.executiveSummary).then(() => {
                    sounds.playTick();
                    flash("Executive summary copied");
                    setMenuOpen(false);
                  });
                }}
                className="w-full px-3 py-2 text-left text-xs text-app-secondary hover:bg-surface-secondary flex items-center gap-2 border-t border-app"
              >
                <Copy className="w-4 h-4 text-app-muted" />
                Copy exec summary
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
