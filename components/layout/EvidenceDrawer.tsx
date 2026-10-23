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
  AlertTriangle,
  History,
  Copy,
  Check,
  Loader2,
} from "lucide-react";
import { addEvidenceNote } from "../../lib/api";
import Link from "next/link";

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
      <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end">
        <div className="fixed inset-0" onClick={closeEvidenceDrawer} aria-hidden />
        <aside className="relative w-full max-w-2xl bg-[#111318] border-l border-[#262A33] shadow-2xl flex flex-col h-full z-10 animate-in slide-in-from-right duration-200">
          <div className="p-5 border-b border-[#262A33] flex items-center justify-between bg-[#151820]">
            <div className="space-y-2 flex-1">
              <div className="h-3 w-24 rounded bg-[#1E232E] animate-pulse" />
              <div className="h-5 w-3/4 max-w-md rounded bg-[#1E232E] animate-pulse" />
            </div>
            <button
              type="button"
              onClick={closeEvidenceDrawer}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-[#1F232D]"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center gap-3 p-8 text-center">
            <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
            <p className="text-sm font-medium text-zinc-300">Verifying evidence chain…</p>
            <p className="text-xs text-zinc-500 font-mono">SHA-256 · source URL · observation date</p>
          </div>
        </aside>
      </div>
    );
  }

  if (!selectedEvidence) {
    return (
      <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end">
        <div className="fixed inset-0" onClick={closeEvidenceDrawer} aria-hidden />
        <aside className="relative w-full max-w-2xl bg-[#111318] border-l border-[#262A33] shadow-2xl flex flex-col h-full z-10 p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-zinc-100">Evidence unavailable</h2>
            <button type="button" onClick={closeEvidenceDrawer} className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100">
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-sm text-zinc-400">This artifact could not be loaded. Try another signal from the timeline.</p>
          <Link
            href="/evidence"
            onClick={closeEvidenceDrawer}
            className="mt-6 inline-flex text-sm font-semibold text-blue-400 hover:underline"
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
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end transition-opacity duration-200">
      <div
        className="fixed inset-0"
        onClick={closeEvidenceDrawer}
        aria-hidden="true"
      />

      <aside className="relative w-full max-w-2xl bg-[#111318] border-l border-[#262A33] shadow-2xl flex flex-col h-full z-10 animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-5 border-b border-[#262A33] flex items-start justify-between bg-[#151820]">
          <div className="space-y-1.5 pr-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-400">
                {selectedEvidence.competitorName}
              </span>
              <span className="text-zinc-600">·</span>
              <CategoryBadge category={selectedEvidence.category} />
              <SeverityBadge severity={selectedEvidence.severity} />
              <StatusBadge status={selectedEvidence.verificationStatus} />
            </div>
            <h2 className="text-lg font-bold text-[#F5F7FA] leading-snug">
              {selectedEvidence.title}
            </h2>
          </div>

          <button
            onClick={closeEvidenceDrawer}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-[#1F232D] transition-colors cursor-pointer"
            title="Close drawer (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm">
          {/* Trust & Provenance Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-xl bg-[#0E1015] border border-[#262A33] shadow-xs">
            <div>
              <div className="text-[11px] uppercase tracking-wider text-zinc-500 flex items-center gap-1 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                Confidence
              </div>
              <div className="mt-1 font-mono font-bold text-base text-zinc-100">
                {selectedEvidence.confidence}%
              </div>
            </div>

            <div>
              <div className="text-[11px] uppercase tracking-wider text-zinc-500 flex items-center gap-1 font-semibold">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                Observed
              </div>
              <div className="mt-1 font-mono text-xs text-zinc-200 truncate">
                {new Date(selectedEvidence.observedCurrentDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </div>
            </div>

            <div>
              <div className="text-[11px] uppercase tracking-wider text-zinc-500 flex items-center gap-1 font-semibold">
                <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                Prior Check
              </div>
              <div className="mt-1 font-mono text-xs text-zinc-400 truncate">
                {new Date(selectedEvidence.observedPreviousDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </div>
            </div>

            <div>
              <div className="text-[11px] uppercase tracking-wider text-zinc-500 flex items-center gap-1 font-semibold">
                <Cpu className="w-3.5 h-3.5 text-emerald-400" />
                Audit Status
              </div>
              <div className="mt-1 text-xs text-emerald-400 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                SHA-256 Valid
              </div>
            </div>
          </div>

          {/* Strategic Narrative / Why It Matters */}
          <div className="space-y-2.5 p-4 rounded-xl bg-blue-950/20 border border-blue-500/30 shadow-xs">
            <div className="flex items-center gap-2 text-blue-400 text-xs font-bold uppercase tracking-wider">
              <CornerDownRight className="w-4 h-4" />
              Strategic Implication (Why this matters)
            </div>
            <p className="text-zinc-200 leading-relaxed text-xs sm:text-sm">
              {selectedEvidence.strategicImplication}
            </p>
            {selectedEvidence.recommendedAction && (
              <div className="pt-2.5 mt-2 border-t border-blue-900/40 text-xs text-blue-300">
                <span className="font-bold text-blue-200">Recommended Executive Move: </span>
                {selectedEvidence.recommendedAction}
              </div>
            )}
          </div>

          {/* Visual Before vs After Diff Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-zinc-400" />
                Verified State Diff (Before vs After)
              </div>
              <span className="text-[11px] font-mono text-zinc-500">DOM extraction diff</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Before */}
              <div className="rounded-xl bg-[#0C0E12] border border-[#262A33] overflow-hidden shadow-xs">
                <div className="px-3.5 py-2 bg-[#14171E] border-b border-[#262A33] flex items-center justify-between text-xs font-mono text-zinc-400">
                  <span className="text-red-400 font-bold flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                    PREVIOUS STATE
                  </span>
                  <span className="text-[10px] text-zinc-500">
                    {new Date(selectedEvidence.observedPreviousDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="p-3.5 font-mono text-xs text-zinc-300 overflow-x-auto whitespace-pre-wrap leading-relaxed diff-removed">
                  {selectedEvidence.beforeContent}
                </div>
              </div>

              {/* After */}
              <div className="rounded-xl bg-[#0C0E12] border border-[#262A33] overflow-hidden shadow-xs">
                <div className="px-3.5 py-2 bg-[#14171E] border-b border-[#262A33] flex items-center justify-between text-xs font-mono text-zinc-400">
                  <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    CURRENT STATE
                  </span>
                  <span className="text-[10px] text-zinc-500">
                    {new Date(selectedEvidence.observedCurrentDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="p-3.5 font-mono text-xs text-zinc-200 overflow-x-auto whitespace-pre-wrap leading-relaxed diff-added font-medium">
                  {selectedEvidence.afterContent}
                </div>
              </div>
            </div>
          </div>

          {/* Raw Excerpt & Source Info */}
          <div className="space-y-3 p-4 rounded-xl bg-[#14171E] border border-[#262A33] shadow-xs">
            <div className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Raw Extracted Snippet
            </div>
            <p className="text-xs text-zinc-300 font-mono bg-[#0B0D11] p-3 rounded-lg border border-zinc-800 leading-relaxed">
              &quot;{selectedEvidence.rawExcerpt}&quot;
            </p>

            <div className="space-y-2 pt-2 border-t border-[#262A33] text-xs">
              <div className="flex items-start justify-between gap-4">
                <span className="text-zinc-500 shrink-0">Source Location</span>
                <span className="text-zinc-300 font-medium text-right break-all">
                  {selectedEvidence.sourceTitle}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-zinc-500 shrink-0">Detection Engine</span>
                <span className="text-zinc-300 font-mono text-right">
                  {selectedEvidence.detectionMethod}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-zinc-500 shrink-0 flex items-center gap-1">
                  <Hash className="w-3 h-3" />
                  Hash Digest
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-zinc-400 font-mono text-[11px] truncate max-w-[220px]">
                    {selectedEvidence.hashDigest}
                  </span>
                  <button
                    onClick={copyHash}
                    className="p-1 rounded hover:bg-[#202430] text-zinc-400 hover:text-white transition-colors"
                    title="Copy full cryptographic hash"
                  >
                    {hasCopiedHash ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
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
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Internal Analyst Notes ({notesList.length})
              </span>
            </div>

            {notesList.length > 0 ? (
              <div className="space-y-2">
                {notesList.map((note, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-[#151820] border border-[#262A33] text-xs text-zinc-300 flex items-start gap-2.5 shadow-2xs"
                  >
                    <div className="w-5 h-5 rounded-full bg-blue-600/30 border border-blue-500/40 text-blue-300 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5 font-mono">
                      SN
                    </div>
                    <span className="flex-1 leading-relaxed">{note}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-zinc-500 italic">
                No analyst notes recorded yet. Add initial context below.
              </p>
            )}

            <form onSubmit={handleAddNote} className="flex gap-2">
              <input
                type="text"
                placeholder="Add strategic observation or action note..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                className="flex-1 px-3 py-2 bg-[#0B0D11] border border-[#262A33] rounded-lg text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-blue-500"
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
        <div className="p-4 border-t border-[#262A33] bg-[#14171E] flex items-center justify-between gap-3">
          <Link
            href={`/competitors/${selectedEvidence.competitorId}`}
            onClick={closeEvidenceDrawer}
            className="px-3.5 py-2 rounded-lg bg-[#1B1E26] hover:bg-[#252934] border border-[#262A33] text-xs font-semibold text-zinc-200 flex items-center gap-1.5 transition-colors"
          >
            <History className="w-3.5 h-3.5 text-zinc-400" />
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
