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
import { PrysmChatbot } from "../chat/PrysmChatbot";
import { AuthSessionFlash } from "../auth/AuthSessionFlash";
import { SIGN_OUT_COPY } from "../../lib/auth/sign-out";

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
    <div
      className={`min-h-screen bg-app text-app-primary transition-[filter,opacity] duration-300 ${
        isSigningOut ? "auth-shell-chrome-dim" : ""
      }`}
    >
      <div aria-hidden="true" className="workspace-atmosphere" />
      <Suspense fallback={<div className="w-[220px] bg-surface-sidebar" />}>
        <Sidebar />
      </Suspense>

      <Suspense fallback={<div className="h-14 bg-surface-header" />}>
        <Topbar />
      </Suspense>

      <ScrollProgressBar />

      <main
        className={`pt-14 transition-all duration-300 min-h-screen flex flex-col ${
          isSidebarCollapsed ? "pl-[68px]" : "pl-[220px]"
        } ${isSigningOut ? "auth-shell-signing-out" : ""}`}
      >
        <div className="flex-1 p-4 sm:p-5 lg:p-6 max-w-6xl w-full mx-auto">
          <Suspense fallback={<div className="p-8 text-center text-app-muted animate-pulse">Loading intelligence...</div>}>
            {children}
          </Suspense>
        </div>
      </main>

      <EvidenceDrawer />
      <RunScanModal />
      <AddCompetitorModal />
      <GlobalSearchModal />
      <KeyboardShortcutsModal />
      <WelcomeToast />
      <PrysmChatbot />

      {isSigningOut && (
        <AuthSessionFlash
          fullScreen
          variant="sign-out"
          message={SIGN_OUT_COPY.overlay.message}
          subtitle={SIGN_OUT_COPY.overlay.subtitle}
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
