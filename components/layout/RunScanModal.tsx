"use client";

import React, { useMemo, useState } from "react";
import { useApp } from "../../lib/context/AppContext";
import {
  X,
  RefreshCw,
  CheckCircle2,
  Database,
  Search,
  Layers,
  ArrowRight,
  Check,
  Network,
  Clock,
} from "lucide-react";

const SCAN_VECTORS = [
  { id: "pricing", label: "Pricing & Plans", icon: Database },
  { id: "features", label: "Features & Matrix", icon: Layers },
  { id: "announcements", label: "Announcements & PR", icon: Search },
  { id: "positioning", label: "Positioning & Messaging", icon: Network },
] as const;

const scanSteps = [
  { num: 1, title: "Collecting sources", desc: "Fetching DOM snapshots & RSS feeds" },
  { num: 2, title: "Normalizing content", desc: "Stripping dynamic and tracking tags" },
  { num: 3, title: "Detecting changes", desc: "Subtree diffing & semantic extraction" },
  { num: 4, title: "Scoring significance", desc: "Evaluating market threat impact (0-100)" },
  { num: 5, title: "Verifying evidence", desc: "Calculating SHA256 cryptographic proofs" },
];

function SelectionCheckbox({ checked }: { checked: boolean }) {
  return (
    <div
      className={`w-4 h-4 shrink-0 rounded flex items-center justify-center border transition-colors ${
        checked
          ? "bg-blue-600 border-blue-500 text-white"
          : "border-app bg-surface-secondary"
      }`}
      aria-hidden
    >
      {checked && <Check className="w-3 h-3 stroke-[3]" />}
    </div>
  );
}

export function RunScanModal() {
  const {
    isScanModalOpen,
    closeScanModal,
    competitors,
    isScanningActive,
    triggerScanSimulation,
    scanProgress,
    openEvidenceDrawer,
  } = useApp();

  const [selectedCompetitors, setSelectedCompetitors] = useState<string[]>([
    "comp-acme",
    "comp-nova",
    "comp-orbit",
    "comp-vertex",
  ]);

  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    "pricing",
    "features",
    "announcements",
    "positioning",
  ]);

  const visibleCompetitors = useMemo(() => competitors.slice(0, 6), [competitors]);

  const canStartScan =
    selectedCompetitors.length > 0 && selectedCategories.length > 0 && !isScanningActive;

  const estimatedMinutes = useMemo(() => {
    const workload = selectedCompetitors.length * selectedCategories.length;
    return Math.max(1, Math.ceil(workload / 6));
  }, [selectedCompetitors.length, selectedCategories.length]);

  if (!isScanModalOpen) return null;

  const toggleComp = (id: string) => {
    setSelectedCompetitors((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((item) => item !== cat) : [...prev, cat]
    );
  };

  const setAllCompetitors = (selectAll: boolean) => {
    setSelectedCompetitors(selectAll ? visibleCompetitors.map((c) => c.id) : []);
  };

  const setAllVectors = (selectAll: boolean) => {
    setSelectedCategories(selectAll ? SCAN_VECTORS.map((v) => v.id) : []);
  };

  const handleStartScan = async () => {
    if (!canStartScan) return;
    await triggerScanSimulation(selectedCompetitors);
  };

  const showConfig = !isScanningActive && !scanProgress.completed;
  const progressPct =
    scanProgress.total > 0
      ? Math.min(100, Math.round((scanProgress.step / scanProgress.total) * 100))
      : 0;

  const tileClass = (checked: boolean) =>
    `flex items-center justify-between gap-2 p-2.5 rounded-xl border text-xs text-left transition-all ${
      checked
        ? "bg-blue-500/10 border-blue-500/35 text-app-primary font-medium shadow-[inset_0_0_0_1px_rgba(59,130,246,0.08)]"
        : "dashboard-inset text-app-secondary hover:border-blue-500/25 hover:bg-surface-secondary"
    }`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 dark:bg-black/70 backdrop-blur-sm"
      role="presentation"
    >
      <button
        type="button"
        className="absolute inset-0"
        aria-label="Close scan dialog"
        onClick={isScanningActive ? undefined : closeScanModal}
        disabled={isScanningActive}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="run-scan-title"
        className="relative w-full max-w-xl dashboard-card rounded-2xl shadow-2xl overflow-hidden z-10 motion-pop"
      >
        {(isScanningActive || scanProgress.completed) && (
          <div
            className="h-0.5 bg-surface-secondary"
            aria-hidden
          >
            <div
              className={`h-full transition-all duration-500 ease-out ${
                scanProgress.completed ? "bg-emerald-500" : "bg-blue-500"
              }`}
              style={{ width: scanProgress.completed ? "100%" : `${progressPct}%` }}
            />
          </div>
        )}

        <div className="px-6 py-4 border-b border-app flex items-center justify-between bg-surface-secondary/80">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-500 shrink-0">
              <RefreshCw className={`w-4 h-4 ${isScanningActive ? "animate-spin" : ""}`} />
            </div>
            <div className="min-w-0">
              <h3 id="run-scan-title" className="text-base font-semibold text-app-primary truncate">
                Run Competitive Scan
              </h3>
              <p className="text-xs text-app-muted">
                Initiate autonomous web crawl and change detection
              </p>
            </div>
          </div>

          {!isScanningActive && (
            <button
              type="button"
              onClick={closeScanModal}
              className="p-1.5 rounded-lg text-app-muted hover:text-app-primary hover:bg-surface-secondary shrink-0"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="p-6 space-y-6 max-h-[min(70vh,560px)] overflow-y-auto">
          {showConfig && (
            <>
              <div>
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-app-muted">
                    Select Competitors ({selectedCompetitors.length})
                  </label>
                  <div className="flex items-center gap-2 text-[11px]">
                    <button
                      type="button"
                      onClick={() => setAllCompetitors(true)}
                      className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                    >
                      Select all
                    </button>
                    <span className="text-app-muted">·</span>
                    <button
                      type="button"
                      onClick={() => setAllCompetitors(false)}
                      className="text-app-muted hover:text-app-primary hover:underline"
                    >
                      Clear
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {visibleCompetitors.map((c) => {
                    const isChecked = selectedCompetitors.includes(c.id);
                    return (
                      <button
                        key={c.id}
                        type="button"
                        aria-pressed={isChecked}
                        onClick={() => toggleComp(c.id)}
                        className={tileClass(isChecked)}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="w-6 h-6 rounded-lg bg-surface-secondary border border-app flex items-center justify-center text-[10px] font-mono font-bold text-app-secondary shrink-0">
                            {c.logoText}
                          </span>
                          <span className="truncate">{c.name}</span>
                        </div>
                        <SelectionCheckbox checked={isChecked} />
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-app-muted">
                    Scan Vectors ({selectedCategories.length})
                  </label>
                  <div className="flex items-center gap-2 text-[11px]">
                    <button
                      type="button"
                      onClick={() => setAllVectors(true)}
                      className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                    >
                      Select all
                    </button>
                    <span className="text-app-muted">·</span>
                    <button
                      type="button"
                      onClick={() => setAllVectors(false)}
                      className="text-app-muted hover:text-app-primary hover:underline"
                    >
                      Clear
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {SCAN_VECTORS.map((cat) => {
                    const isChecked = selectedCategories.includes(cat.id);
                    const Icon = cat.icon;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        aria-pressed={isChecked}
                        onClick={() => toggleCategory(cat.id)}
                        className={tileClass(isChecked)}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <Icon
                            className={`w-3.5 h-3.5 shrink-0 ${
                              isChecked ? "text-blue-500" : "text-app-muted"
                            }`}
                          />
                          <span className="leading-tight">{cat.label}</span>
                        </div>
                        <SelectionCheckbox checked={isChecked} />
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 rounded-xl border border-app bg-surface-secondary/60 px-3.5 py-2.5 text-[11px] text-app-muted">
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-blue-500" />
                  Est. ~{estimatedMinutes} min
                </span>
                <span>
                  {selectedCompetitors.length} competitor
                  {selectedCompetitors.length === 1 ? "" : "s"} × {selectedCategories.length} vector
                  {selectedCategories.length === 1 ? "" : "s"}
                </span>
              </div>
            </>
          )}

          {isScanningActive && (
            <div className="py-2 space-y-5">
              <div className="space-y-2 text-center">
                <div className="inline-flex p-3 rounded-full bg-blue-500/10 text-blue-500 mb-1 border border-blue-500/20">
                  <RefreshCw className="w-6 h-6 animate-spin" />
                </div>
                <h4 className="text-sm font-semibold text-app-primary">{scanProgress.label}</h4>
                <p className="text-xs text-app-muted font-mono">
                  Stage {scanProgress.step} of {scanProgress.total}
                </p>
              </div>

              <div className="space-y-2">
                {scanSteps.map((step) => {
                  const isDone = scanProgress.step > step.num;
                  const isCurrent = scanProgress.step === step.num;
                  return (
                    <div
                      key={step.num}
                      className={`flex items-center justify-between gap-2 p-2.5 rounded-xl border text-xs transition-colors ${
                        isCurrent
                          ? "bg-blue-500/10 border-blue-500/35"
                          : isDone
                            ? "dashboard-inset border-emerald-500/25"
                            : "border-app bg-surface-secondary/40 opacity-70"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                            isDone
                              ? "bg-emerald-500 text-white"
                              : isCurrent
                                ? "bg-blue-500 text-white animate-pulse"
                                : "bg-surface-secondary border border-app text-app-muted"
                          }`}
                        >
                          {isDone ? <Check className="w-3 h-3 stroke-[3]" /> : step.num}
                        </div>
                        <div className="min-w-0">
                          <div className="font-medium text-app-primary">{step.title}</div>
                          <div className="text-[11px] text-app-muted">{step.desc}</div>
                        </div>
                      </div>
                      {isCurrent && (
                        <span className="font-mono text-[10px] text-blue-500 animate-pulse shrink-0">
                          RUNNING
                        </span>
                      )}
                      {isDone && (
                        <span className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400 shrink-0">
                          DONE
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {!isScanningActive && scanProgress.completed && (
            <div className="py-2 space-y-6">
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                <h4 className="text-base font-semibold text-app-primary">Scan Complete & Verified</h4>
                <p className="text-xs text-app-muted">
                  Autonomous crawl executed across {selectedCompetitors.length} competitors and{" "}
                  {selectedCategories.length} scan vectors.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-xl dashboard-inset text-center">
                  <div className="text-xl font-bold font-mono text-app-primary">
                    {scanProgress.detectedChanges}
                  </div>
                  <div className="text-[11px] text-app-muted mt-1">Meaningful Changes</div>
                </div>

                <div className="p-3 rounded-xl dashboard-inset border-amber-500/25 text-center">
                  <div className="text-xl font-bold font-mono text-amber-600 dark:text-amber-400">
                    {scanProgress.highImpactCount}
                  </div>
                  <div className="text-[11px] text-app-muted mt-1">High Impact Signals</div>
                </div>

                <div className="p-3 rounded-xl dashboard-inset text-center">
                  <div className="text-xl font-bold font-mono text-blue-600 dark:text-blue-400">
                    {scanProgress.avgConfidence}%
                  </div>
                  <div className="text-[11px] text-app-muted mt-1">Avg Confidence</div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                    Featured Signal Detected
                  </div>
                  <div className="text-xs text-app-secondary truncate">
                    Acme Cloud Pro Plan: ₹999 → ₹1,299 / mo (+30%)
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    closeScanModal();
                    openEvidenceDrawer("ev-acme-pricing-20261023");
                  }}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-colors shrink-0"
                >
                  <span>View Evidence</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-app bg-surface-secondary/50 flex items-center justify-between gap-3">
          {showConfig ? (
            <>
              <button
                type="button"
                onClick={closeScanModal}
                className="px-4 py-2 rounded-lg text-xs font-medium text-app-muted hover:text-app-primary"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleStartScan}
                disabled={!canStartScan}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:pointer-events-none text-white rounded-lg text-xs font-semibold flex items-center gap-2 shadow-sm transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Start Scan</span>
              </button>
            </>
          ) : scanProgress.completed ? (
            <button
              type="button"
              onClick={closeScanModal}
              className="w-full py-2.5 rounded-lg text-xs font-medium bg-surface-secondary border border-app text-app-primary hover:bg-surface-primary transition-colors"
            >
              Done
            </button>
          ) : (
            <p className="text-xs text-app-muted italic mx-auto text-center">
              Synthesizing and indexing threat signals…
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
