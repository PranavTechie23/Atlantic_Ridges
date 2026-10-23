"use client";

import React, { Suspense } from "react";
import { usePathname } from "next/navigation";
import { AppProvider, useApp } from "../../lib/context/AppContext";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { EvidenceDrawer } from "./EvidenceDrawer";
import { RunScanModal } from "./RunScanModal";
import { AddCompetitorModal } from "./AddCompetitorModal";
import { GlobalSearchModal } from "./GlobalSearchModal";
import { KeyboardShortcutsModal } from "./KeyboardShortcutsModal";
import { WelcomeToast } from "./WelcomeToast";
import { RouteGuard } from "../auth/RouteGuard";
import { isStandaloneShellPath } from "../../lib/auth/routes";
import { AuthLoadingScreen } from "../auth/AuthLoadingScreen";
import { ScrollProgressBar } from "../ui/ScrollProgressBar";
import { FloatingQuickActions } from "../ui/FloatingQuickActions";
import { AuthSessionFlash } from "../auth/AuthSessionFlash";

function ShellInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isSidebarCollapsed, isSigningOut } = useApp();
  const standalone = isStandaloneShellPath(pathname);

  if (standalone) {
    return (
      <div className="min-h-screen bg-app text-app-primary">
        <Suspense fallback={<AuthLoadingScreen />}>{children}</Suspense>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-app text-app-primary">
      <Suspense fallback={<div className="w-[220px] bg-surface-sidebar" />}>
        <Sidebar />
      </Suspense>

      <Suspense fallback={<div className="h-14 bg-surface-header" />}>
        <Topbar />
      </Suspense>

      <ScrollProgressBar />

      <main
        className={`pt-14 transition-all duration-200 min-h-screen flex flex-col ${
          isSidebarCollapsed ? "pl-[68px]" : "pl-[220px]"
        }`}
      >
        <div className="flex-1 p-4 sm:p-5 lg:p-6 max-w-6xl w-full mx-auto">
          <Suspense fallback={<div className="p-8 text-center text-app-muted animate-pulse">Loading intelligence...</div>}>
            {children}
          </Suspense>
        </div>
      </main>

      <FloatingQuickActions />
      <EvidenceDrawer />
      <RunScanModal />
      <AddCompetitorModal />
      <GlobalSearchModal />
      <KeyboardShortcutsModal />
      <WelcomeToast />

      {isSigningOut && (
        <AuthSessionFlash
          fullScreen
          variant="sign-out"
          message="Signed out"
          subtitle="Securing your session…"
        />
      )}
    </div>
  );
}

function GuardedShell({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<AuthLoadingScreen />}>
      <RouteGuard>
        <ShellInner>{children}</ShellInner>
      </RouteGuard>
    </Suspense>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <AppProvider>
      <GuardedShell>{children}</GuardedShell>
    </AppProvider>
  );
}
