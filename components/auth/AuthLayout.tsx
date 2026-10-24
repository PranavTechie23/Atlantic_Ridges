"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "../ui/ThemeToggle";
import { AuthVisual } from "./AuthVisual";
import { AuthScene } from "./AuthScene";
import { Reveal } from "../ui/Motion";
import { BorderBeam } from "../ui/BorderBeam";
import { AuthSpotlightHost } from "./AuthSpotlight";
import { AuthTabs } from "./AuthTabs";
import { AuthTrustRow } from "./AuthTrustRow";
import { JudgeAccessDisclosure } from "./JudgeAccessDisclosure";

export function AuthLayout({
  children,
  title,
  subtitle,
}: {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  const pathname = usePathname();
  const isForgot = pathname?.includes("forgot");
  const isLogin = pathname === "/login";

  return (
    <div className="relative min-h-dvh w-full overflow-x-hidden bg-app">
      <AuthScene />

      <div className="relative z-10 min-h-dvh grid lg:grid-cols-2">
        {/* Left — full-height brand canvas */}
        <div className="hidden lg:flex flex-col min-h-dvh border-r border-app auth-left-panel relative overflow-hidden isolate">
          <div className="auth-grid auth-grid-drift absolute inset-0 opacity-[0.35] dark:opacity-[0.2]" aria-hidden />

          <AuthSpotlightHost className="flex flex-col flex-1 min-h-dvh p-10 xl:p-14">
          <div className="relative flex items-center justify-between shrink-0">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="auth-logo-mark w-11 h-11 rounded-2xl bg-linear-to-br from-blue-500 via-indigo-600 to-violet-700 flex items-center justify-center shadow-lg shadow-indigo-500/40 group-hover:scale-105 transition-transform duration-300 ring-2 ring-white/10">
                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="12 2 2 22 22 22" />
                  <line x1="12" y1="2" x2="12" y2="22" />
                </svg>
              </div>
              <div>
                <span className="font-mono text-xl font-extrabold tracking-wider text-app-primary block">
                  PRYSM
                </span>
                <span className="text-[11px] text-app-muted">Market intelligence</span>
              </div>
            </Link>
            <ThemeToggle variant="icon" />
          </div>

          <div className="relative flex-1 flex flex-col justify-center py-6 space-y-8 max-w-xl z-10">
            <Reveal>
              <div className="space-y-4">
                <h1 className="text-[2.35rem] xl:text-[2.75rem] font-bold leading-[1.08] tracking-tight text-app-primary">
                  Competitive moves you can{" "}
                  <span className="auth-headline-gradient text-transparent bg-clip-text bg-linear-to-r from-blue-500 via-indigo-500 to-violet-500">
                    prove in the room
                  </span>
                  .
                </h1>
                <p className="text-[15px] text-app-secondary leading-relaxed">
                  Monitor pricing, features, and positioning with dated sources and one-click verification.
                </p>
              </div>
            </Reveal>
            <AuthVisual />
          </div>
          </AuthSpotlightHost>
        </div>

        {/* Right — form column fills viewport */}
        <div className="flex flex-col min-h-dvh auth-right-panel relative">
          <div className="lg:hidden flex items-center justify-between p-5 border-b border-app bg-surface-primary/70 backdrop-blur-xl shrink-0">
            <Link href="/" className="font-mono font-extrabold text-lg text-app-primary">
              PRYSM
            </Link>
            <ThemeToggle variant="icon" />
          </div>

          <div className="flex-1 flex items-center justify-center p-6 sm:p-8 lg:p-10 xl:p-12 relative z-10">
            <div className="w-full max-w-[440px] auth-form-enter">
              {!isForgot && <AuthTabs />}

              <div className="auth-panel-card rounded-2xl p-8 sm:p-9 relative overflow-hidden">
                <BorderBeam size={200} duration={18} borderWidth={1} colorFrom="#3B82F6" colorTo="#8B5CF6" />
                <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-linear-to-b from-blue-500/[0.07] to-transparent dark:from-blue-500/10" />
                <div className="relative mb-7 space-y-1.5">
                  <h2 className="text-[1.65rem] font-bold tracking-tight text-app-primary">{title}</h2>
                  <p className="text-sm text-app-secondary leading-relaxed">{subtitle}</p>
                </div>
                <div className="relative">{children}</div>
              </div>

              <AuthTrustRow />
              {isLogin && !isForgot ? <JudgeAccessDisclosure /> : null}
              <p className="mt-5 text-center">
                <Link href="/" className="auth-text-link text-xs text-app-muted inline-flex items-center gap-1">
                  <span aria-hidden className="auth-link-arrow">
                    ←
                  </span>{" "}
                  Back to home
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
