"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "../../lib/context/AppContext";
import {
  LayoutDashboard,
  Building2,
  Radar,
  History,
  GitCompare,
  ShieldCheck,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  Play,
  Layers,
  Globe,
  Bell,
  BookOpen,
  Compass,
  Swords,
  Split,
  Sparkles,
  Award,
} from "lucide-react";

function SidebarUserCard({ collapsed }: { collapsed: boolean }) {
  const { user } = useApp();
  return (
    <Link
      href="/settings"
      className={`flex items-center gap-2.5 p-2 rounded-lg border border-app bg-surface-secondary hover:border-blue-500/30 transition-colors ${
        collapsed ? "justify-center" : ""
      }`}
    >
      <div className="w-8 h-8 rounded-full bg-linear-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-xs font-bold text-white shrink-0">
        {user?.initials ?? "?"}
      </div>
      {!collapsed && (
        <div className="flex-1 min-w-0">
          <div className="text-xs font-semibold text-app-primary truncate">{user?.name ?? "Sign in"}</div>
          <div className="text-[10px] text-app-muted truncate">{user?.plan ?? "Guest"}</div>
        </div>
      )}
    </Link>
  );
}

function NavSection({
  title,
  collapsed,
  children,
}: {
  title: string;
  collapsed: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-0.5">
      {!collapsed && (
        <div className="px-2.5 mb-1 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-app-muted">
          {title}
        </div>
      )}
      {children}
    </div>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const { isSidebarCollapsed, toggleSidebar } = useApp();

  const commandNav = [{ label: "Overview", href: "/dashboard", icon: LayoutDashboard }];

  const intelligenceNav = [
    { label: "Competitors", href: "/competitors", icon: Building2 },
    { label: "Radar", href: "/radar", icon: Radar },
    { label: "Timeline", href: "/timeline", icon: History },
    { label: "Comparison", href: "/comparison", icon: GitCompare },
    { label: "Evidence", href: "/evidence", icon: ShieldCheck },
    { label: "Reports", href: "/reports", icon: FileText },
  ];

  const showcaseNav = [
    { label: "System Audit", href: "/audit", icon: Award, highlight: true },
    { label: "Demo Sandbox", href: "/demo", icon: Play, highlight: true },
    { label: "Market Topology", href: "/topology", icon: Compass },
    { label: "War Room", href: "/war-room", icon: Swords },
    { label: "Time Machine", href: "/time-machine", icon: Split },
  ];

  const toolsNav = [
    { label: "Diff engine", href: "/diff-engine", icon: Layers },
    { label: "Sources", href: "/sources", icon: Globe },
    { label: "Alerts", href: "/alerts", icon: Bell },
    { label: "Docs", href: "/docs", icon: BookOpen },
  ];

  const renderLink = (item: {
    label: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    highlight?: boolean;
  }) => {
    const isActive =
      pathname === item.href || (item.href !== "/dashboard" && pathname?.startsWith(item.href));

    return (
      <Link
        key={item.href}
        href={item.href}
        title={isSidebarCollapsed ? item.label : undefined}
        className={`relative flex items-center gap-3 px-2.5 py-2 rounded-lg text-[13px] font-medium transition-all ${
          isActive
            ? "bg-blue-600/12 text-blue-600 dark:text-blue-400 font-semibold"
            : "text-app-muted hover:text-app-primary hover:bg-surface-secondary"
        } ${isSidebarCollapsed ? "justify-center px-0" : ""} ${
          item.highlight && !isActive ? "text-amber-700 dark:text-amber-400/90" : ""
        }`}
      >
        {isActive && (
          <span className="absolute left-0 top-2 bottom-2 w-0.5 rounded-full bg-blue-500" />
        )}
        <item.icon className={`w-[18px] h-[18px] shrink-0 ${isActive ? "text-blue-600 dark:text-blue-400" : ""}`} />
        {!isSidebarCollapsed && <span className="truncate">{item.label}</span>}
      </Link>
    );
  };

  return (
    <aside
      className={`fixed top-0 bottom-0 left-0 z-30 flex flex-col bg-surface-sidebar border-r border-app transition-all duration-200 select-none ${
        isSidebarCollapsed ? "w-[68px]" : "w-[220px]"
      }`}
    >
      <div className="h-14 border-b border-app flex items-center justify-between px-3">
        <Link href="/dashboard" className="flex items-center gap-2 overflow-hidden min-w-0">
          <div className="w-8 h-8 rounded-lg bg-linear-to-br from-blue-500 via-indigo-600 to-violet-700 flex items-center justify-center shrink-0">
            <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="12 2 2 22 22 22" />
            </svg>
          </div>
          {!isSidebarCollapsed && (
            <span className="font-mono text-sm font-extrabold tracking-wider text-app-primary truncate">
              PRYSM
            </span>
          )}
        </Link>
        <button
          type="button"
          onClick={toggleSidebar}
          className="p-1.5 rounded-md text-app-muted hover:text-app-primary hover:bg-surface-secondary"
        >
          {isSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-2 py-3 space-y-4">
        <NavSection title="Command" collapsed={isSidebarCollapsed}>
          {commandNav.map(renderLink)}
        </NavSection>

        <NavSection title="Intelligence" collapsed={isSidebarCollapsed}>
          {intelligenceNav.map(renderLink)}
        </NavSection>

        <NavSection title="Showcase" collapsed={isSidebarCollapsed}>
          {showcaseNav.map(renderLink)}
        </NavSection>

        <NavSection title="Tools" collapsed={isSidebarCollapsed}>
          {toolsNav.map(renderLink)}
        </NavSection>
      </div>

      <div className="p-2 border-t border-app space-y-1">
        <Link
          href="/settings"
          className={`flex items-center gap-3 px-2.5 py-2 rounded-lg text-[13px] text-app-muted hover:text-app-primary hover:bg-surface-secondary ${
            isSidebarCollapsed ? "justify-center" : ""
          } ${pathname === "/settings" ? "bg-blue-600/12 text-blue-600 dark:text-blue-400" : ""}`}
        >
          <Settings className="w-[18px] h-[18px]" />
          {!isSidebarCollapsed && <span>Settings</span>}
        </Link>
        <SidebarUserCard collapsed={isSidebarCollapsed} />
      </div>
    </aside>
  );
}
