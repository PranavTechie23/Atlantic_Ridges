"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, Settings, User, ChevronDown } from "lucide-react";
import { useApp } from "../../lib/context/AppContext";
import { signOutToLogin } from "../../lib/auth/useSignOutToLogin";
export function UserMenu() {
  const router = useRouter();
  const { user, signOutAnimated, isSigningOut } = useApp();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const initials = user?.initials ?? "?";

  const handleLogout = async () => {
    setOpen(false);
    await signOutToLogin(signOutAnimated, router);
  };

  if (!user) {
    return (
      <Link
        href="/login"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-app text-xs font-medium text-app-secondary hover:bg-surface-secondary transition-all"
      >
        <User className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Sign in</span>
      </Link>
    );
  }

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-lg hover:bg-surface-secondary border border-transparent hover:border-app transition-all"
      >
        <div className="relative">
          <div className="w-7 h-7 rounded-full bg-linear-to-tr from-blue-600 to-indigo-600 border border-blue-400/30 flex items-center justify-center text-xs font-bold text-white">
            {initials}
          </div>
          <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-surface-primary" />
        </div>
        <ChevronDown className={`w-3.5 h-3.5 text-app-muted transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 rounded-xl border border-app bg-surface-primary shadow-xl py-1 z-50 animate-in fade-in slide-in-from-top-1">
          <div className="px-3 py-2.5 border-b border-app">
            <p className="text-xs font-semibold text-app-primary truncate">{user.name}</p>
            <p className="text-[10px] text-app-muted truncate font-mono">{user.email}</p>
            <p className="text-[10px] text-blue-600 dark:text-blue-400 mt-1">{user.plan}</p>
          </div>
          <Link
            href="/settings"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-3 py-2 text-xs text-app-secondary hover:bg-surface-secondary hover:text-app-primary"
          >
            <Settings className="w-3.5 h-3.5" />
            Account & preferences
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            disabled={isSigningOut}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-600 dark:text-red-400 hover:bg-red-500/10 disabled:opacity-50 disabled:pointer-events-none"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
