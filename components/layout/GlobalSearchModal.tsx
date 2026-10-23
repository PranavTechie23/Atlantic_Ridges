"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useApp } from "../../lib/context/AppContext";
import {
  Search,
  X,
  Building2,
  Zap,
  FileText,
  ArrowRight,
  ShieldCheck,
  Compass,
} from "lucide-react";
import { mockChanges } from "../../lib/mock-data/changes";
import { mockReports } from "../../lib/mock-data/reports";
import { mockEvidence } from "../../lib/mock-data/evidence";
import { searchAppPages, type AppPageEntry } from "../../lib/navigation/app-pages";
import { useRouter } from "next/navigation";

const GROUP_LABEL: Record<AppPageEntry["group"], string> = {
  command: "Command",
  intelligence: "Intelligence",
  showcase: "Showcase",
  tools: "Tools",
};

export function GlobalSearchModal() {
  const { isSearchModalOpen, closeSearchModal, competitors, openEvidenceDrawer } = useApp();
  const [query, setQuery] = useState("");
  const router = useRouter();

  const trimmed = query.trim();
  const hasQuery = trimmed.length > 0;

  const pageResults = useMemo(() => searchAppPages(trimmed, 8), [trimmed]);

  const searchResults = useMemo(() => {
    if (!hasQuery) return null;
    const q = trimmed.toLowerCase();

    const matchedCompetitors = competitors.filter(
      (c) => c.name.toLowerCase().includes(q) || c.category.toLowerCase().includes(q)
    );

    const matchedChanges = mockChanges.filter(
      (ch) =>
        ch.title.toLowerCase().includes(q) ||
        ch.summary.toLowerCase().includes(q) ||
        ch.competitorName.toLowerCase().includes(q)
    );

    const matchedEvidence = mockEvidence.filter(
      (ev) =>
        ev.title.toLowerCase().includes(q) ||
        ev.rawExcerpt.toLowerCase().includes(q) ||
        ev.competitorName.toLowerCase().includes(q)
    );

    const matchedReports = mockReports.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        r.executiveSummary.toLowerCase().includes(q) ||
        r.period.toLowerCase().includes(q)
    );

    return {
      competitors: matchedCompetitors.slice(0, 3),
      changes: matchedChanges.slice(0, 4),
      evidence: matchedEvidence.slice(0, 3),
      reports: matchedReports.slice(0, 2),
      total:
        matchedCompetitors.length +
        matchedChanges.length +
        matchedEvidence.length +
        matchedReports.length +
        pageResults.length,
    };
  }, [hasQuery, trimmed, competitors, pageResults.length]);

  const navigate = (href: string) => {
    closeSearchModal();
    setQuery("");
    router.push(href);
  };

  React.useEffect(() => {
    if (!isSearchModalOpen) setQuery("");
  }, [isSearchModalOpen]);

  if (!isSearchModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-20 p-4 bg-black/50 dark:bg-black/70 backdrop-blur-sm">
      <button type="button" className="absolute inset-0" aria-label="Close search" onClick={closeSearchModal} />

      <div className="relative w-full max-w-2xl dashboard-card rounded-2xl shadow-2xl overflow-hidden z-10 motion-pop">
        <div className="p-4 border-b border-app flex items-center gap-3 bg-surface-secondary/80">
          <Search className="w-5 h-5 text-blue-500 shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Search pages, competitors, signals, evidence, reports…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-app-primary placeholder:text-app-muted focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="p-1 rounded text-app-muted hover:text-app-primary"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] font-mono text-app-muted border border-app bg-surface-primary">
            ESC
          </span>
        </div>

        <div className="max-h-[min(60vh,520px)] overflow-y-auto p-4 space-y-4">
          {!hasQuery && (
            <div className="space-y-4">
              <p className="text-xs text-app-muted text-center">
                Jump to any workspace view or search live mock intelligence.
              </p>
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-wider text-app-muted mb-2 px-2 flex items-center gap-1.5">
                  <Compass className="w-3 h-3 text-blue-500" />
                  Quick navigation
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                  {pageResults.map((p) => (
                    <button
                      key={p.href}
                      type="button"
                      onClick={() => navigate(p.href)}
                      className="flex items-center justify-between p-2.5 rounded-lg hover:bg-surface-secondary text-left transition-colors group"
                    >
                      <div>
                        <div className="text-xs font-medium text-app-primary group-hover:text-blue-600 dark:group-hover:text-blue-400">
                          {p.label}
                        </div>
                        <div className="text-[10px] text-app-muted">{GROUP_LABEL[p.group]}</div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-app-muted group-hover:text-blue-500" />
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] text-app-muted pt-2">
                <span>Try:</span>
                {["Acme pricing", "Radar", "War Room", "Weekly report"].map((suggest) => (
                  <button
                    key={suggest}
                    type="button"
                    onClick={() => setQuery(suggest)}
                    className="px-2 py-0.5 rounded-lg border border-app bg-surface-secondary text-app-secondary hover:border-blue-500/40"
                  >
                    {suggest}
                  </button>
                ))}
              </div>
            </div>
          )}

          {hasQuery && pageResults.length > 0 && (
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-app-muted mb-2 px-2">
                Pages
              </div>
              <div className="space-y-1">
                {pageResults.map((p) => (
                  <button
                    key={p.href}
                    type="button"
                    onClick={() => navigate(p.href)}
                    className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-surface-secondary text-left group"
                  >
                    <span className="text-xs text-app-primary font-medium">{p.label}</span>
                    <span className="text-[10px] font-mono text-app-muted">{p.href}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {searchResults && searchResults.total === 0 && (
            <div className="py-8 text-center text-xs text-app-muted">
              No matches for &quot;{query}&quot;. Try a competitor name or &quot;demo&quot;, &quot;radar&quot;, &quot;evidence&quot;.
            </div>
          )}

          {searchResults && searchResults.competitors.length > 0 && (
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-app-muted mb-2 px-2 flex items-center gap-1.5">
                <Building2 className="w-3 h-3 text-blue-500" />
                Competitors
              </div>
              <div className="space-y-1">
                {searchResults.competitors.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => navigate(`/competitors/${c.id}`)}
                    className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-surface-secondary text-left group"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded bg-surface-secondary border border-app flex items-center justify-center text-xs font-mono font-bold text-app-secondary">
                        {c.logoText}
                      </span>
                      <div>
                        <div className="text-xs font-medium text-app-primary">{c.name}</div>
                        <div className="text-[11px] text-app-muted">{c.category}</div>
                      </div>
                    </div>
                    <span className="text-[11px] font-mono text-app-muted">
                      Threat {c.threatScore}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {searchResults && searchResults.changes.length > 0 && (
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-app-muted mb-2 px-2 flex items-center gap-1.5">
                <Zap className="w-3 h-3 text-amber-500" />
                Signals
              </div>
              <div className="space-y-1">
                {searchResults.changes.map((ch) => (
                  <button
                    key={ch.id}
                    type="button"
                    onClick={() => {
                      closeSearchModal();
                      setQuery("");
                      openEvidenceDrawer(ch.evidenceId);
                    }}
                    className="w-full p-2.5 rounded-lg hover:bg-surface-secondary text-left group"
                  >
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[10px] uppercase font-bold text-blue-600 dark:text-blue-400">
                        {ch.competitorName}
                      </span>
                      <span className="text-app-muted">·</span>
                      <span className="text-[10px] uppercase font-mono text-amber-600 dark:text-amber-400">
                        {ch.severity}
                      </span>
                    </div>
                    <div className="text-xs text-app-primary line-clamp-1">{ch.title}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {searchResults && searchResults.evidence.length > 0 && (
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-app-muted mb-2 px-2 flex items-center gap-1.5">
                <ShieldCheck className="w-3 h-3 text-emerald-500" />
                Evidence
              </div>
              <div className="space-y-1">
                {searchResults.evidence.map((ev) => (
                  <button
                    key={ev.id}
                    type="button"
                    onClick={() => {
                      closeSearchModal();
                      setQuery("");
                      openEvidenceDrawer(ev.id);
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-surface-secondary text-left"
                  >
                    <div className="min-w-0">
                      <div className="text-xs text-app-primary font-medium truncate">{ev.title}</div>
                      <div className="text-[11px] text-app-muted font-mono truncate">{ev.sourceTitle}</div>
                    </div>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono shrink-0 ml-2">
                      {ev.confidence}%
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {searchResults && searchResults.reports.length > 0 && (
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-app-muted mb-2 px-2 flex items-center gap-1.5">
                <FileText className="w-3 h-3 text-indigo-500" />
                Reports
              </div>
              <div className="space-y-1">
                {searchResults.reports.map((rep) => (
                  <button
                    key={rep.id}
                    type="button"
                    onClick={() => navigate(`/reports/${rep.id}`)}
                    className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-surface-secondary text-left group"
                  >
                    <div>
                      <div className="text-xs text-app-primary font-medium">{rep.title}</div>
                      <div className="text-[11px] text-app-muted">{rep.period}</div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-app-muted group-hover:text-blue-500" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="px-4 py-2.5 border-t border-app bg-surface-secondary/50 flex flex-wrap items-center justify-between gap-2 text-[11px] text-app-muted">
          <div className="flex items-center gap-3">
            <span>
              Shortcuts:{" "}
              <kbd className="font-mono px-1 rounded border border-app bg-surface-primary">?</kbd>
            </span>
          </div>
          <span className="hidden sm:inline">Signals include SHA-256 evidence hashes</span>
        </div>
      </div>
    </div>
  );
}
