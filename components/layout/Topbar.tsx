"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { useApp } from "../../lib/context/AppContext";
import { Search, RefreshCw, ChevronRight, Volume2, VolumeX } from "lucide-react";
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
    openScanModal,
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
      className={`fixed top-0 right-0 z-20 h-14 bg-surface-header/80 backdrop-blur-xl border-b border-app shadow-[0_4px_20px_-16px_rgba(15,23,42,0.3)] transition-all duration-200 flex items-center justify-between px-4 sm:px-5 ${sidebarOffset}`}
    >
      {/* Left: Breadcrumbs & Live Status */}
      <div className="flex items-center gap-2 min-w-0">
        <Link
          href="/dashboard"
          className="font-mono text-app-muted hover:text-app-secondary text-xs hidden sm:inline shrink-0"
        >
          PRYSM
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-app-muted hidden sm:inline shrink-0" />
        <span className="font-semibold text-sm text-app-primary truncate">{getBreadcrumb()}</span>
        <span className="hidden xl:inline-flex items-center ml-2 shrink-0">
          {isScanningActive ? (
            <LivePulseIndicator status="verifying" label="Scanning" sublabel="live" />
          ) : (
            <span className="text-[11px] text-app-muted font-mono">· last scan {lastScanText}</span>
          )}
        </span>
      </div>

      {/* Right: Clean, Uncluttered Actions */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        {/* Quick Search */}
        <button
          type="button"
          onClick={openSearchModal}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-app bg-surface-secondary/70 hover:bg-surface-secondary text-app-muted hover:text-app-primary text-xs transition-all shadow-2xs cursor-pointer"
        >
          <Search className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Search...</span>
          <kbd className="hidden sm:inline text-[10px] font-mono px-1.5 py-0.5 rounded border border-app bg-surface-primary text-app-muted">
            ⌘K
          </kbd>
        </button>

        {/* Primary Scan Action */}
        <button
          type="button"
          onClick={openScanModal}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-all shadow-xs cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isScanningActive ? "animate-spin" : ""}`} />
          <span>Scan</span>
        </button>

        {/* Subtle Separator */}
        <div className="h-4 w-px bg-slate-200 dark:bg-zinc-800 mx-1 hidden sm:block" />

        {/* Audio Sound FX Toggle */}
        <button
          type="button"
          onClick={handleToggleSound}
          className="p-2 rounded-lg border border-app text-app-muted hover:text-app-primary hover:bg-surface-secondary transition-colors cursor-pointer"
          title={soundOn ? "Mute audio sound effects" : "Enable audio sound effects"}
        >
          {soundOn ? <Volume2 className="w-4 h-4 text-blue-500" /> : <VolumeX className="w-4 h-4 text-zinc-400" />}
        </button>

        {/* Theme Toggle, Notifications, Profile */}
        <ThemeToggle variant="icon" />
        <NotificationDropdown />
        <UserMenu />
      </div>
    </header>
  );
}
