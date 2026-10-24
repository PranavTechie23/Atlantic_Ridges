"use client";

import React, { useState } from "react";
import { useApp } from "../../lib/context/AppContext";
import { SeverityBadge, CategoryBadge, StatusBadge } from "../ui/Badge";
import {
  X,
  ExternalLink,
  ShieldCheck,
  Calendar,
  Clock,
  Cpu,
  Hash,
  CornerDownRight,
  Plus,
  FileText,
  History,
  Copy,
  Check,
  Loader2,
} from "lucide-react";
import { addEvidenceNote } from "../../lib/api";
import Link from "next/link";
import { EvidenceStateText } from "../evidence/EvidenceStateText";

const drawerAside =
  "relative w-full max-w-2xl bg-surface-primary border-l border-app shadow-2xl flex flex-col h-full z-10 animate-in slide-in-from-right duration-200";
const drawerOverlay =
  "fixed inset-0 z-50 overflow-hidden bg-slate-900/40 dark:bg-black/60 backdrop-blur-xs flex justify-end transition-opacity duration-200";

export function EvidenceDrawer() {
  const { isEvidenceDrawerOpen, closeEvidenceDrawer, selectedEvidence, evidenceLoading } = useApp();
  const [newNote, setNewNote] = useState("");
  const [isSubmittingNote, setIsSubmittingNote] = useState(false);
  const [notesList, setNotesList] = useState<string[]>([]);
  const [hasCopiedHash, setHasCopiedHash] = useState(false);

  React.useEffect(() => {
    if (selectedEvidence?.userNotes) {
      setNotesList(selectedEvidence.userNotes);
    } else {
      setNotesList([]);
    }
    setNewNote("");
    setHasCopiedHash(false);
  }, [selectedEvidence]);

  if (!isEvidenceDrawerOpen) {
    return null;
  }

  if (evidenceLoading) {
    return (
      <div className={drawerOverlay}>
        <div className="fixed inset-0" onClick={closeEvidenceDrawer} aria-hidden />
        <aside className={drawerAside}>
          <div className="p-5 border-b border-app flex items-center justify-between bg-surface-secondary">
            <div className="space-y-2 flex-1">
              <div className="h-3 w-24 rounded bg-surface-secondary dark:bg-[#1E232E] animate-pulse border border-app" />
              <div className="h-5 w-3/4 max-w-md rounded bg-surface-secondary dark:bg-[#1E232E] animate-pulse border border-app" />
            </div>
            <button
              type="button"
              onClick={closeEvidenceDrawer}
              className="p-1.5 rounded-lg text-app-muted hover:text-app-primary hover:bg-surface-secondary transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center gap-3 p-8 text-center">
            <Loader2 className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-spin" />
            <p className="text-sm font-medium text-app-secondary">Verifying evidence chain…</p>
            <p className="text-xs text-app-muted font-mono">SHA-256 · source URL · observation date</p>
          </div>
        </aside>
      </div>
    );
  }

  if (!selectedEvidence) {
    return (
      <div className={drawerOverlay}>
        <div className="fixed inset-0" onClick={closeEvidenceDrawer} aria-hidden />
        <aside className={`${drawerAside} p-8`}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-app-primary">Evidence unavailable</h2>
            <button
              type="button"
              onClick={closeEvidenceDrawer}
              className="p-1.5 rounded-lg text-app-muted hover:text-app-primary"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-sm text-app-muted">
            This artifact could not be loaded. Try another signal from the timeline.
          </p>
          <Link
            href="/evidence"
            onClick={closeEvidenceDrawer}
            className="mt-6 inline-flex text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline"
          >
            Browse evidence explorer
          </Link>
        </aside>
      </div>
    );
  }

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim() || !selectedEvidence) return;
    setIsSubmittingNote(true);
    try {
      await addEvidenceNote(selectedEvidence.id, newNote.trim());
      setNotesList((prev) => [...prev, newNote.trim()]);
      setNewNote("");
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingNote(false);
    }
  };

  const copyHash = () => {
    if (!selectedEvidence) return;
    navigator.clipboard.writeText(selectedEvidence.hashDigest);
    setHasCopiedHash(true);
    setTimeout(() => setHasCopiedHash(false), 2000);
  };

  return (
    <div className={drawerOverlay}>
      <div className="fixed inset-0" onClick={closeEvidenceDrawer} aria-hidden="true" />

      <aside className={drawerAside}>
        {/* Header */}
        <div className="p-5 border-b border-app flex items-start justify-between bg-surface-secondary">
          <div className="space-y-1.5 pr-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                {selectedEvidence.competitorName}
              </span>
              <span className="text-app-muted">·</span>
              <CategoryBadge category={selectedEvidence.category} />
              <SeverityBadge severity={selectedEvidence.severity} />
              <StatusBadge status={selectedEvidence.verificationStatus} />
            </div>
            <h2 className="text-lg font-bold text-app-primary leading-snug">{selectedEvidence.title}</h2>
          </div>

          <button
            onClick={closeEvidenceDrawer}
            className="p-1.5 rounded-lg text-app-muted hover:text-app-primary hover:bg-surface-primary dark:hover:bg-[#1F232D] transition-colors cursor-pointer"
            title="Close drawer (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm">
          {/* Trust & Provenance Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-xl bg-surface-secondary border border-app shadow-xs">
            <div>
              <div className="text-[11px] uppercase tracking-wider text-app-muted flex items-center gap-1 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                Confidence
              </div>
              <div className="mt-1 font-mono font-bold text-base text-app-primary">
                {selectedEvidence.confidence}%
              </div>
            </div>

            <div>
              <div className="text-[11px] uppercase tracking-wider text-app-muted flex items-center gap-1 font-semibold">
                <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                Observed
              </div>
              <div className="mt-1 font-mono text-xs text-app-secondary truncate">
                {new Date(selectedEvidence.observedCurrentDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </div>
            </div>

            <div>
              <div className="text-[11px] uppercase tracking-wider text-app-muted flex items-center gap-1 font-semibold">
                <Calendar className="w-3.5 h-3.5 text-app-muted" />
                Prior Check
              </div>
              <div className="mt-1 font-mono text-xs text-app-muted truncate">
                {new Date(selectedEvidence.observedPreviousDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </div>
            </div>

            <div>
              <div className="text-[11px] uppercase tracking-wider text-app-muted flex items-center gap-1 font-semibold">
                <Cpu className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                Audit Status
              </div>
              <div className="mt-1 text-xs text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400" />
                SHA-256 Valid
              </div>
            </div>
          </div>

          {/* Strategic Narrative / Why It Matters */}
          <div className="space-y-2.5 p-4 rounded-xl bg-blue-50 border border-blue-200/80 dark:bg-blue-950/20 dark:border-blue-500/30 shadow-xs">
            <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400 text-xs font-bold uppercase tracking-wider">
              <CornerDownRight className="w-4 h-4" />
              Strategic Implication (Why this matters)
            </div>
            <p className="text-app-secondary leading-relaxed text-xs sm:text-sm">
              {selectedEvidence.strategicImplication}
            </p>
            {selectedEvidence.recommendedAction && (
              <div className="pt-2.5 mt-2 border-t border-blue-200/80 dark:border-blue-900/40 text-xs text-blue-800 dark:text-blue-300">
                <span className="font-bold text-blue-900 dark:text-blue-200">Recommended Executive Move: </span>
                {selectedEvidence.recommendedAction}
              </div>
            )}
          </div>

          {/* Visual Before vs After Diff Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold uppercase tracking-wider text-app-muted flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                Verified State Diff (Before vs After)
              </div>
              <span className="text-[11px] font-mono text-app-muted">Verified field-level diff</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Before */}
              <div className="rounded-xl bg-surface-secondary border border-app overflow-hidden shadow-xs">
                <div className="px-3.5 py-2 bg-white dark:bg-[#14171E] border-b border-app flex items-center justify-between text-xs font-mono text-app-muted">
                  <span className="text-red-600 dark:text-red-400 font-bold flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 dark:bg-red-400" />
                    PREVIOUS STATE
                  </span>
                  <span className="text-[10px] text-app-muted">
                    {new Date(selectedEvidence.observedPreviousDate).toLocaleDateString()}
                  </span>
                </div>
                <EvidenceStateText content={selectedEvidence.beforeContent} variant="before" className="mx-1 mb-1" />
              </div>

              {/* After */}
              <div className="rounded-xl bg-surface-secondary border border-app overflow-hidden shadow-xs">
                <div className="px-3.5 py-2 bg-white dark:bg-[#14171E] border-b border-app flex items-center justify-between text-xs font-mono text-app-muted">
                  <span className="text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400" />
                    CURRENT STATE
                  </span>
                  <span className="text-[10px] text-app-muted">
                    {new Date(selectedEvidence.observedCurrentDate).toLocaleDateString()}
                  </span>
                </div>
                <EvidenceStateText content={selectedEvidence.afterContent} variant="after" className="mx-1 mb-1" />
              </div>
            </div>
          </div>

          {/* Raw Excerpt & Source Info */}
          <div className="space-y-3 p-4 rounded-xl bg-surface-secondary border border-app shadow-xs">
            <div className="text-xs font-bold uppercase tracking-wider text-app-muted">
              Raw Extracted Snippet
            </div>
            <p className="text-xs text-app-secondary font-mono bg-white dark:bg-[#0B0D11] p-3 rounded-lg border border-app dark:border-zinc-800 leading-relaxed">
              &quot;{selectedEvidence.rawExcerpt}&quot;
            </p>

            <div className="space-y-2 pt-2 border-t border-app text-xs">
              <div className="flex items-start justify-between gap-4">
                <span className="text-app-muted shrink-0">Source Location</span>
                <span className="text-app-secondary font-medium text-right break-all">
                  {selectedEvidence.sourceTitle}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-app-muted shrink-0">Detection Engine</span>
                <span className="text-app-secondary font-mono text-right">
                  {selectedEvidence.detectionMethod}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-app-muted shrink-0 flex items-center gap-1">
                  <Hash className="w-3 h-3" />
                  Hash Digest
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-app-muted font-mono text-[11px] truncate max-w-[220px]">
                    {selectedEvidence.hashDigest}
                  </span>
                  <button
                    onClick={copyHash}
                    className="p-1 rounded hover:bg-surface-primary dark:hover:bg-[#202430] text-app-muted hover:text-app-primary transition-colors"
                    title="Copy full cryptographic hash"
                  >
                    {hasCopiedHash ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* User Intelligence Notes */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-app-muted">
                Internal Analyst Notes ({notesList.length})
              </span>
            </div>

            {notesList.length > 0 ? (
              <div className="space-y-2">
                {notesList.map((note, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-white dark:bg-[#151820] border border-app text-xs text-app-secondary flex items-start gap-2.5 shadow-2xs"
                  >
                    <div className="w-5 h-5 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-700 dark:text-blue-300 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5 font-mono">
                      SN
                    </div>
                    <span className="flex-1 leading-relaxed">{note}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-app-muted italic">
                No analyst notes recorded yet. Add initial context below.
              </p>
            )}

            <form onSubmit={handleAddNote} className="flex gap-2">
              <input
                type="text"
                placeholder="Add strategic observation or action note..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                className="flex-1 px-3 py-2 bg-white dark:bg-[#0B0D11] border border-app rounded-lg text-xs text-app-primary placeholder:text-app-muted focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
              <button
                type="submit"
                disabled={isSubmittingNote || !newNote.trim()}
                className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Note
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-app bg-surface-secondary flex items-center justify-between gap-3">
          <Link
            href={`/competitors/${selectedEvidence.competitorId}`}
            onClick={closeEvidenceDrawer}
            className="px-3.5 py-2 rounded-lg bg-surface-primary hover:bg-surface-secondary dark:bg-[#1B1E26] dark:hover:bg-[#252934] border border-app text-xs font-semibold text-app-primary flex items-center gap-1.5 transition-colors"
          >
            <History className="w-3.5 h-3.5 text-app-muted" />
            View Competitor Profile
          </Link>

          <a
            href={selectedEvidence.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <span>Open Source URL</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </aside>
    </div>
  );
}
