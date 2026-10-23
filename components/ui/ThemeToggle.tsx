"use client";

import React from "react";
import { useApp } from "../../lib/context/AppContext";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle({
  variant = "icon",
}: {
  variant?: "icon" | "full";
}) {
  const { theme, toggleTheme } = useApp();
  const isDark = theme === "dark";

  if (variant === "full") {
    return (
      <button
        onClick={toggleTheme}
        className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium text-app-muted hover:text-app-primary hover:bg-surface-secondary border border-transparent hover:border-app transition-all"
      >
        <span className="flex items-center gap-2.5">
          {isDark ? (
            <Moon className="w-4 h-4 text-indigo-400" />
          ) : (
            <Sun className="w-4 h-4 text-amber-500" />
          )}
          <span>{isDark ? "Dark Theme" : "Light Theme"}</span>
        </span>
        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-surface-secondary text-app-muted border border-app uppercase">
          {theme}
        </span>
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="relative p-2 rounded-lg text-app-muted hover:text-app-primary hover:bg-surface-secondary border border-transparent hover:border-app transition-all group"
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      aria-label="Toggle Dark and Light mode"
    >
      <div className="relative w-4 h-4">
        <Sun
          className={`w-4 h-4 text-amber-400 absolute inset-0 transition-transform duration-300 ${
            isDark ? "scale-0 rotate-90 opacity-0" : "scale-100 rotate-0 opacity-100"
          }`}
        />
        <Moon
          className={`w-4 h-4 text-indigo-400 absolute inset-0 transition-transform duration-300 ${
            isDark ? "scale-100 rotate-0 opacity-100" : "scale-0 -rotate-90 opacity-0"
          }`}
        />
      </div>
    </button>
  );
}
