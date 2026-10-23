"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useLayoutEffect, useRef, useState } from "react";
import { cn } from "../../lib/utils";

const tabs = [
  { href: "/login", label: "Sign in" },
  { href: "/signup", label: "Create account" },
];

export function AuthTabs() {
  const pathname = usePathname();
  const trackRef = useRef<HTMLDivElement>(null);
  const [indicator, setIndicator] = useState({ left: 0, width: 0, ready: false });

  useLayoutEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const active = track.querySelector<HTMLElement>('[data-auth-tab-active="true"]');
    if (!active) return;
    const t = track.getBoundingClientRect();
    const a = active.getBoundingClientRect();
    setIndicator({ left: a.left - t.left, width: a.width, ready: true });
  }, [pathname]);

  return (
    <div
      ref={trackRef}
      className="auth-tab-track relative flex p-1 rounded-xl mb-5 backdrop-blur-sm"
      role="tablist"
      aria-label="Authentication"
    >
      <span
        className={cn(
          "auth-tab-slider absolute top-1 bottom-1 rounded-lg transition-[left,width] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
          !indicator.ready && "opacity-0"
        )}
        style={{ left: indicator.left, width: indicator.width }}
        aria-hidden
      />
      {tabs.map((tab) => {
        const active = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            role="tab"
            aria-selected={active}
            data-auth-tab-active={active ? "true" : "false"}
            className={cn(
              "relative z-10 flex-1 text-center py-2.5 rounded-lg text-sm font-semibold transition-colors duration-200",
              active ? "text-app-primary" : "text-app-muted hover:text-app-secondary"
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
