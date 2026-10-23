"use client";

import React from "react";

export function AuthLoadingScreen() {
  return (
    <div className="min-h-dvh flex flex-col items-center justify-center bg-app gap-6">
      <div className="relative">
        <div className="absolute inset-0 rounded-2xl bg-blue-500/20 blur-xl animate-pulse" />
        <div className="relative w-14 h-14 rounded-2xl bg-linear-to-br from-blue-500 via-indigo-600 to-violet-700 flex items-center justify-center shadow-lg">
          <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="12 2 2 22 22 22" />
          </svg>
        </div>
      </div>
      <div className="text-center space-y-2">
        <p className="font-mono text-sm font-bold tracking-wider text-app-primary">PRYSM</p>
        <p className="text-xs text-app-muted animate-pulse">Loading workspace…</p>
      </div>
    </div>
  );
}
