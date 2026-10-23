"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { printIntelligenceBrief } from "@/lib/utils/report-export";
import { getReport } from "@/lib/api";
import { IntelligenceReport } from "@/lib/types";
import { useApp } from "@/lib/context/AppContext";
import { SeverityBadge } from "@/components/ui/Badge";
import { ShieldCheck, CornerDownRight, CheckCircle2 } from "lucide-react";
import { mockReports } from "@/lib/mock-data/reports";
import { ReportExportBar } from "./ReportExportBar";
import { Reveal } from "@/components/ui/Motion";

export function ReportDetailView({ id }: { id: string }) {
  const { openEvidenceDrawer } = useApp();
  const [report, setReport] = useState<IntelligenceReport | null>(
    () => mockReports.find((r) => r.id === id) || null
  );

  useEffect(() => {
    getReport(id).then((data) => {
      if (data) setReport(data);
    });
  }, [id]);

  if (!report) {
    return (
      <div className="p-12 text-center text-app-muted">
        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        Loading intelligence brief…
      </div>
    );
  }

  const CitationMarker = ({ index }: { index: number }) => {
    const citation = report.citations[String(index)];
    return (
      <>
        <button
          type="button"
          onClick={() => {
            if (citation?.evidenceId) openEvidenceDrawer(citation.evidenceId);
            else openEvidenceDrawer("ev-acme-pricing-20261023");
          }}
          className="screen-citation inline-flex items-center justify-center px-1.5 py-0.5 mx-0.5 rounded text-[10px] font-mono font-bold bg-blue-500/20 text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white border border-blue-500/30 align-super transition-colors cursor-pointer"
          title={citation?.label || "Inspect evidence"}
        >
          [{index}]
        </button>
        <sup className="print-citation hidden">[{index}]</sup>
      </>
    );
  };

  const exportMeta = {
    generated: new Date().toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    }),
  };

  return (
    <div className="report-print-root space-y-6 pb-20 max-w-5xl mx-auto">
      <div className="print-only report-print-running-header" aria-hidden>
        <span className="report-print-run-brand">PRYSM · Market Intelligence</span>
        <span className="report-print-run-title">{report.title}</span>
      </div>
      <div className="print-only report-print-running-footer" aria-hidden>
        <span>Internal strategy only · Evidence-backed brief</span>
        <span className="report-print-page" />
      </div>

      <ReportExportBar report={report} />

      {/* Print-only cover block */}
      <div className="print-only report-print-cover">
        <div className="report-print-logo">PRYSM · Market Intelligence</div>
        <h1 className="report-print-title">{report.title}</h1>
        <p className="report-print-subtitle">{report.subtitle}</p>
        <dl className="report-print-meta">
          <div>
            <dt>Period</dt>
            <dd>{report.period}</dd>
          </div>
          <div>
            <dt>Report date</dt>
            <dd>{report.date}</dd>
          </div>
          <div>
            <dt>Confidence</dt>
            <dd>{report.confidenceAvg}% verified</dd>
          </div>
        </dl>
        <p className="report-print-classification">Internal strategy only · Evidence-backed</p>
      </div>

      <article className="report-document p-8 sm:p-12 rounded-2xl dashboard-card border border-app space-y-10">
        <header className="screen-only space-y-4 border-b border-app pb-8">
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-bold uppercase tracking-wider bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/30">
              Executive intelligence brief
            </span>
            <span className="text-xs text-app-muted font-mono">Classification: internal strategy only</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-app-primary tracking-tight">{report.title}</h1>
          <p className="text-sm text-app-secondary leading-relaxed max-w-3xl">{report.subtitle}</p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-app text-xs font-mono">
            <div>
              <span className="text-app-muted text-[10px] block uppercase">Report date</span>
              <span className="text-app-primary font-semibold">{report.date}</span>
            </div>
            <div>
              <span className="text-app-muted text-[10px] block uppercase">Surveillance period</span>
              <span className="text-app-primary font-semibold">{report.period}</span>
            </div>
            <div>
              <span className="text-app-muted text-[10px] block uppercase">Audited entities</span>
              <span className="text-app-primary font-semibold">{report.competitorCount} competitors</span>
            </div>
            <div>
              <span className="text-app-muted text-[10px] block uppercase">Audit confidence</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{report.confidenceAvg}% verified</span>
            </div>
          </div>
        </header>

        <section className="report-section space-y-3">
          <h2 className="report-section-title">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            1. Executive summary
          </h2>
          <div className="report-prose p-5 rounded-xl bg-surface-secondary border border-app text-sm leading-relaxed text-app-primary space-y-3">
            <p>{report.executiveSummary}</p>
            {report.keyChanges.length > 0 && (
              <p className="text-app-secondary text-xs leading-relaxed">
                Primary drivers this period include{" "}
                {report.keyChanges.slice(0, 2).map((kc, i) => (
                  <React.Fragment key={kc.id}>
                    {i > 0 ? " and " : ""}
                    <strong>{kc.competitor}</strong>
                    <CitationMarker index={kc.citationIndex} />
                  </React.Fragment>
                ))}
                .
              </p>
            )}
            <p className="text-app-muted text-xs">
              All statements reference immutable DOM snapshots preserved in PRYSM Evidence Explorer.
            </p>
          </div>
        </section>

        {report.keyChanges.length > 0 && (
          <Reveal delay={80}>
            <section className="report-section space-y-4">
              <h2 className="report-section-title">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                2. Key changes detected & verified
              </h2>
              <div className="space-y-3">
                {report.keyChanges.map((kc) => (
                  <div
                    key={kc.id}
                    className="report-card p-4 rounded-xl bg-surface-secondary border border-app space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-blue-600 dark:text-blue-400">{kc.competitor}</span>
                        <SeverityBadge severity={kc.impact} />
                      </div>
                      <div className="flex items-center gap-1.5 screen-only">
                        <button
                          type="button"
                          onClick={() => openEvidenceDrawer(kc.evidenceId)}
                          className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-mono"
                        >
                          Inspect payload
                        </button>
                        <CitationMarker index={kc.citationIndex} />
                      </div>
                      <span className="print-only text-xs font-mono">[{kc.citationIndex}]</span>
                    </div>
                    <h3 className="text-sm font-semibold text-app-primary">{kc.title}</h3>
                    <p className="text-xs text-app-secondary leading-relaxed">{kc.summary}</p>
                  </div>
                ))}
              </div>
            </section>
          </Reveal>
        )}

        {report.competitiveMovement.length > 0 && (
          <Reveal delay={120}>
            <section className="report-section space-y-4">
              <h2 className="report-section-title">
                <span className="w-2 h-2 rounded-full bg-violet-500" />
                3. Competitive movement & posture matrix
              </h2>
              <div className="rounded-xl border border-app overflow-hidden">
                <table className="report-table w-full text-left text-xs">
                  <thead>
                    <tr>
                      <th>Competitor</th>
                      <th>Strategic shift</th>
                      <th>Posture</th>
                      <th>Threat impact</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.competitiveMovement.map((cm, i) => (
                      <tr key={i}>
                        <td className="font-semibold text-app-primary">{cm.competitor}</td>
                        <td className="text-app-secondary">{cm.shift}</td>
                        <td>
                          <span className="report-posture">{cm.direction}</span>
                        </td>
                        <td className="font-mono font-bold">{cm.impactScore}/100</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </Reveal>
        )}

        {report.strategicImplications.length > 0 && (
          <Reveal delay={160}>
            <section className="report-section space-y-4">
              <h2 className="report-section-title">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                4. Strategic implications
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {report.strategicImplications.map((si, i) => (
                  <div key={i} className="report-card p-4 rounded-xl bg-surface-secondary border border-app space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-xs font-bold text-app-primary flex items-center gap-1.5">
                        <CornerDownRight className="w-3.5 h-3.5 text-blue-500" />
                        {si.title}
                      </h3>
                      <span className="screen-only flex gap-0.5">
                        {si.citationIndices.map((idx) => (
                          <CitationMarker key={idx} index={idx} />
                        ))}
                      </span>
                    </div>
                    <p className="text-xs text-app-secondary leading-relaxed">{si.description}</p>
                  </div>
                ))}
              </div>
            </section>
          </Reveal>
        )}

        {report.recommendedActions.length > 0 && (
          <Reveal delay={200}>
            <section className="report-section space-y-4">
              <h2 className="report-section-title">
                <span className="w-2 h-2 rounded-full bg-sky-500" />
                5. Recommended actions
              </h2>
              <div className="space-y-3">
                {report.recommendedActions.map((ra, i) => (
                  <div
                    key={i}
                    className="report-card p-4 rounded-xl bg-surface-secondary border border-app flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <SeverityBadge severity={ra.priority} />
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-surface-primary text-app-muted border border-app">
                          Dept: {ra.department}
                        </span>
                      </div>
                      <h3 className="text-sm font-semibold text-app-primary">{ra.title}</h3>
                      <p className="text-xs text-app-secondary">{ra.description}</p>
                    </div>
                    <div className="text-xs text-emerald-600 dark:text-emerald-400 font-mono flex items-center gap-1 shrink-0 screen-only">
                      <CheckCircle2 className="w-4 h-4" />
                      Assigned to roadmap
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </Reveal>
        )}

        {Object.keys(report.citations).length > 0 && (
          <Reveal delay={240}>
            <section className="report-section space-y-4 pt-6 border-t border-app">
              <h2 className="report-section-title">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                6. Evidence appendix
              </h2>
              <div className="p-4 rounded-xl bg-surface-secondary border border-app divide-y divide-app text-xs font-mono">
                {Object.entries(report.citations)
                  .sort(([a], [b]) => Number(a) - Number(b))
                  .map(([index, cit]) => (
                    <div key={index} className="py-3 first:pt-0 last:pb-0 flex items-start justify-between gap-4">
                      <div className="flex items-start gap-2 min-w-0">
                        <span className="text-blue-600 dark:text-blue-400 font-bold shrink-0">[{index}]</span>
                        <div>
                          <div className="text-app-primary font-medium font-sans">{cit.label}</div>
                          <div className="text-[11px] text-app-muted font-sans mt-0.5">{cit.snippet}</div>
                          <div className="print-only text-[10px] text-app-muted mt-1">Evidence: {cit.evidenceId}</div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => openEvidenceDrawer(cit.evidenceId)}
                        className="screen-only px-2.5 py-1 rounded bg-surface-primary hover:bg-blue-600/10 text-blue-600 dark:text-blue-400 text-[11px] font-sans font-semibold shrink-0 transition-colors border border-app"
                      >
                        View diff
                      </button>
                    </div>
                  ))}
              </div>
            </section>
          </Reveal>
        )}

        <footer className="print-only report-print-footer">
          <p>
            PRYSM · Observe. Verify. Decide. · Generated {exportMeta.generated} · Report ID: {report.id}
          </p>
          <p>Save as PDF: use Print → Destination: Save as PDF · Include background graphics for best results.</p>
        </footer>
      </article>
    </div>
  );
}
