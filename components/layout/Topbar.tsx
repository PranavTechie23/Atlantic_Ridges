"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { useApp } from "../../lib/context/AppContext";
import { Search, RefreshCw, Plus, ChevronRight, Volume2, VolumeX, Keyboard, Sparkles, Bot } from "lucide-react";
import { LivePulseIndicator } from "../ui/LivePulseIndicator";
import { NotificationDropdown } from "./NotificationDropdown";
import { ThemeToggle } from "../ui/ThemeToggle";
import { UserMenu } from "./UserMenu";
import { sounds } from "../../lib/utils/sound";
import Link from "next/link";

export function Topbar() {
  const pathname = usePathname();
  const [soundOn, setSoundOn] = useState<boolean>(() => sounds.isEnabled());
  const {
    openSearchModal,
    openShortcutsModal,
    openScanModal,
    openAddCompetitorModal,
    openChat,
    isSidebarCollapsed,
    lastScanText,
    isScanningActive,
  } = useApp();

  const handleToggleSound = () => {
    const next = sounds.toggleSound();
    setSoundOn(next);
  };

  const getBreadcrumb = () => {
    if (pathname === "/audit" || pathname === "/judges") return "System Audit & Compliance";
    if (pathname === "/dashboard" || pathname === "/") return "Command Center";
    if (pathname === "/demo") return "Demo Sandbox";
    if (pathname === "/topology") return "Market Topology & Constellation";
    if (pathname === "/war-room") return "War Room Scenario Simulator";
    if (pathname === "/time-machine") return "Visual Time-Machine";
    if (pathname === "/diff-engine") return "Diff Engine";
    if (pathname === "/sources") return "Public Sources & Wayback";
    if (pathname === "/alerts") return "Alerts";
    if (pathname === "/docs") return "Docs";
    if (pathname === "/settings") return "Settings";
    if (pathname?.startsWith("/competitors/")) return "Competitor";
    if (pathname === "/competitors") return "Competitors";
    if (pathname === "/radar") return "Radar";
    if (pathname === "/timeline") return "Timeline";
    if (pathname === "/comparison") return "Comparison";
    if (pathname === "/evidence") return "Evidence";
    if (pathname?.startsWith("/reports/")) return "Brief";
    if (pathname === "/reports") return "Reports";
    return "PRYSM";
  };

  const sidebarOffset = isSidebarCollapsed ? "left-[68px]" : "left-[220px]";

  return (
    <header
      className={`fixed top-0 right-0 z-20 h-14 bg-surface-header/75 backdrop-blur-xl border-b border-app shadow-[0_8px_32px_-24px_rgba(15,23,42,0.5)] transition-all duration-200 flex items-center justify-between px-4 sm:px-5 ${sidebarOffset}`}
    >
      <div className="flex items-center gap-2 min-w-0">
        <Link
          href="/dashboard"
          className="font-mono text-app-muted hover:text-app-secondary text-xs hidden sm:inline shrink-0"
        >
          PRYSM
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-app-muted hidden sm:inline shrink-0" />
        <span className="font-medium text-sm text-app-primary truncate">{getBreadcrumb()}</span>
        <span className="hidden xl:inline-flex items-center ml-2 shrink-0">
          {isScanningActive ? (
            <LivePulseIndicator status="verifying" label="Scanning" sublabel="live" />
          ) : (
            <span className="text-[11px] text-app-muted font-mono">· last scan {lastScanText}</span>
          )}
        </span>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        <Link
          href="/audit"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 text-xs font-bold transition-all shadow-xs group"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500 group-hover:rotate-12 transition-transform duration-300" />
          <span>System Audit</span>
        </Link>

        <button
          type="button"
          onClick={() => {
            sounds.playChirp();
            openChat();
          }}
          className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg border border-blue-500/40 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 hover:text-blue-300 text-xs font-semibold transition-all group cursor-pointer"
          title="Open PRYSM AI Intelligence Copilot (⌘J)"
        >
          <Bot className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform" />
          <span className="hidden sm:inline">Copilot</span>
          <kbd className="hidden lg:inline text-[10px] font-mono px-1 py-0.5 rounded border border-blue-500/30 bg-blue-950/40 text-blue-300">
            ⌘J
          </kbd>
        </button>

        <button
          type="button"
          onClick={openSearchModal}
          className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-lg border border-app bg-surface-secondary text-app-muted hover:text-app-primary text-xs transition-all"
        >
          <Search className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Search</span>
          <kbd className="hidden lg:inline text-[10px] font-mono px-1 py-0.5 rounded border border-app bg-surface-primary text-app-muted">
            ⌘K
          </kbd>
        </button>

        <button
          type="button"
          onClick={openShortcutsModal}
          className="hidden md:flex p-2 rounded-lg border border-app text-app-muted hover:text-app-primary hover:bg-surface-secondary"
          title="Keyboard shortcuts (?)"
        >
          <Keyboard className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={openAddCompetitorModal}
          className="hidden lg:flex items-center gap-1 p-2 rounded-lg border border-app text-app-muted hover:text-app-primary hover:bg-surface-secondary"
          title="Add competitor"
        >
          <Plus className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={openScanModal}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isScanningActive ? "animate-spin" : ""}`} />
          <span className="hidden xs:inline sm:inline">Scan</span>
        </button>

        {/* Audio Sound FX Toggle */}
        <button
          type="button"
          onClick={handleToggleSound}
          className="p-2 rounded-lg border border-app text-app-muted hover:text-app-primary hover:bg-surface-secondary transition-colors cursor-pointer"
          title={soundOn ? "Mute audio sound effects" : "Enable futuristic audio feedback"}
        >
          {soundOn ? <Volume2 className="w-4 h-4 text-blue-400" /> : <VolumeX className="w-4 h-4 text-zinc-500" />}
        </button>

        <ThemeToggle variant="icon" />
        <NotificationDropdown />
        <UserMenu />
      </div>
    </header>
  );
}
