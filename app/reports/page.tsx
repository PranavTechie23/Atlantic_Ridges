"use client";

import React, { useState } from "react";
import { mockReports } from "../../lib/mock-data/reports";
import { FileText, ArrowRight, Calendar, ShieldCheck, Download, Check } from "lucide-react";
import Link from "next/link";
import { Reveal, StaggerGrid } from "../../components/ui/Motion";
import { downloadReportMarkdown } from "../../lib/utils/report-export";
import { sounds } from "../../lib/utils/sound";

export default function ReportsPage() {
  const [exportedId, setExportedId] = useState<string | null>(null);

  const handleQuickExport = (reportId: string) => {
    const report = mockReports.find((r) => r.id === reportId);
    if (!report) return;
    downloadReportMarkdown(report);
    sounds.playSuccess();
    setExportedId(reportId);
    window.setTimeout(() => setExportedId(null), 2500);
  };

  return (
    <div className="space-y-6 pb-16 page-enter">
      <Reveal>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-app-primary">Intelligence reports</h1>
            <p className="text-xs sm:text-sm text-app-secondary mt-1 max-w-xl">
              Executive briefs with cited evidence, exportable as Markdown or print-ready PDF via your browser.
            </p>
          </div>

          <Link
            href="/reports/rep-weekly-20261023"
            className="px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white flex items-center gap-2 self-start sm:self-auto shadow-sm transition-colors"
          >
            <FileText className="w-3.5 h-3.5" />
            Latest brief · 23 Oct 2026
          </Link>
        </div>
      </Reveal>

      <StaggerGrid className="grid grid-cols-1 md:grid-cols-2 gap-6" staggerMs={90}>
        {mockReports.map((report) => (
          <article
            key={report.id}
            className="dashboard-card p-6 rounded-xl flex flex-col justify-between space-y-4 group relative overflow-hidden hover:-translate-y-0.5 transition-transform duration-300"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/30">
                  {report.period}
                </span>
                <span className="text-xs text-app-muted font-mono flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {report.date}
                </span>
              </div>

              <h2 className="text-lg font-bold text-app-primary group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {report.title}
              </h2>

              <p className="text-xs text-app-secondary line-clamp-2 leading-relaxed">
                {report.subtitle || report.executiveSummary}
              </p>

              <div className="p-3 rounded-lg bg-surface-secondary border border-app grid grid-cols-3 gap-2 text-center text-xs">
                <div>
                  <div className="font-mono font-bold text-app-primary">{report.competitorCount}</div>
                  <div className="text-[10px] text-app-muted mt-0.5">Competitors</div>
                </div>
                <div>
                  <div className="font-mono font-bold text-amber-600 dark:text-amber-400">{report.changesCount}</div>
                  <div className="text-[10px] text-app-muted mt-0.5">Changes</div>
                </div>
                <div>
                  <div className="font-mono font-bold text-red-500 dark:text-red-400">{report.highImpactCount}</div>
                  <div className="text-[10px] text-app-muted mt-0.5">High impact</div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-app flex items-center justify-between gap-2 flex-wrap">
              <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                {report.confidenceAvg}% confidence
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickExport(report.id)}
                  className="px-3 py-2 rounded-lg border border-app bg-surface-primary hover:border-blue-500/40 text-xs font-medium text-app-secondary flex items-center gap-1.5 transition-colors"
                  title="Download Markdown export"
                >
                  {exportedId === report.id ? (
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                  ) : (
                    <Download className="w-3.5 h-3.5" />
                  )}
                  <span className="hidden sm:inline">Export .md</span>
                </button>
                <Link
                  href={`/reports/${report.id}`}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white flex items-center gap-1.5 transition-all"
                >
                  Open
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          </article>
        ))}
      </StaggerGrid>
    </div>
  );
}
