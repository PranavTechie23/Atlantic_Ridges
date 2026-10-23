"use client";

import React from "react";
import { useApp } from "../../lib/context/AppContext";
import { X, Keyboard } from "lucide-react";

function modKeyLabel() {
  if (typeof navigator !== "undefined" && /Win|Linux/i.test(navigator.platform)) return "Ctrl";
  return "⌘";
}

const SHORTCUTS = (mod: string) => [
  { keys: [mod, "K"], label: "Open global search" },
  { keys: ["?"], label: "Show keyboard shortcuts" },
  { keys: ["Esc"], label: "Close drawer / modal" },
];

export function KeyboardShortcutsModal() {
  const { isShortcutsModalOpen, closeShortcutsModal } = useApp();
  const mod = modKeyLabel();
  const rows = SHORTCUTS(mod);

  if (!isShortcutsModalOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 dark:bg-black/70 backdrop-blur-sm">
      <button type="button" className="absolute inset-0" aria-label="Close" onClick={closeShortcutsModal} />
      <div className="relative w-full max-w-md dashboard-card rounded-2xl p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Keyboard className="w-5 h-5 text-blue-500" />
            <h2 className="text-lg font-semibold text-app-primary">Keyboard shortcuts</h2>
          </div>
          <button
            type="button"
            onClick={closeShortcutsModal}
            className="p-1.5 rounded-lg text-app-muted hover:text-app-primary hover:bg-surface-secondary"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <ul className="space-y-3">
          {rows.map((row) => (
            <li key={row.label} className="flex items-center justify-between gap-4 text-sm">
              <span className="text-app-secondary">{row.label}</span>
              <div className="flex gap-1">
                {row.keys.map((k) => (
                  <kbd
                    key={k}
                    className="min-w-[28px] text-center px-1.5 py-0.5 rounded border border-app bg-surface-secondary text-[11px] font-mono text-app-muted"
                  >
                    {k}
                  </kbd>
                ))}
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-5 text-[11px] text-app-muted text-center">
          Press <kbd className="font-mono px-1 rounded border border-app">?</kbd> anytime to toggle this panel.
        </p>
      </div>
    </div>
  );
}
