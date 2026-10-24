"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Bell, Palette, User, Shield, Mail, LogOut } from "lucide-react";
import { useApp } from "../../lib/context/AppContext";
import { signOutToLogin } from "../../lib/auth/useSignOutToLogin";
import { ThemeToggle } from "../../components/ui/ThemeToggle";

export default function SettingsPage() {
  const router = useRouter();
  const { user, theme, signOutAnimated, isSigningOut } = useApp();

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-app-primary">Account & preferences</h1>
        <p className="text-sm text-app-secondary mt-1">
          Workspace profile, appearance, and alert defaults for your intelligence desk.
        </p>
      </div>

      <section className="rounded-xl border border-app bg-surface-primary overflow-hidden">
        <div className="px-5 py-4 border-b border-app flex items-center gap-2">
          <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <h2 className="text-sm font-semibold text-app-primary">Profile</h2>
        </div>
        <div className="p-5 space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-linear-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-lg font-bold text-white">
              {user?.initials ?? "?"}
            </div>
            <div>
              <p className="font-semibold text-app-primary">{user?.name ?? "Not signed in"}</p>
              <p className="text-sm text-app-muted font-mono">{user?.email ?? "—"}</p>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-0.5">{user?.plan ?? "—"}</p>
              {user?.authSource === "database" ? (
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  Verified session · scrypt-hashed credentials in PostgreSQL
                </p>
              ) : user?.authSource === "guest" ? (
                <p className="text-[11px] text-amber-600 dark:text-amber-400 mt-1">
                  Demo workspace — sign in with a workspace account to view account security details
                </p>
              ) : null}
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <label className="block">
              <span className="text-xs text-app-secondary">Display name</span>
              <input
                readOnly
                value={user?.name ?? ""}
                className="mt-1 w-full px-3 py-2 rounded-lg bg-surface-secondary border border-app text-sm text-app-primary"
              />
            </label>
            <label className="block">
              <span className="text-xs text-app-secondary">Email</span>
              <input
                readOnly
                value={user?.email ?? ""}
                className="mt-1 w-full px-3 py-2 rounded-lg bg-surface-secondary border border-app text-sm text-app-primary"
              />
            </label>
          </div>

          <div className="pt-2 border-t border-app flex items-center justify-between">
            <span className="text-xs text-app-muted">Need to switch accounts?</span>
            <button
              type="button"
              disabled={isSigningOut}
              onClick={async () => {
                await signOutToLogin(signOutAnimated, router);
              }}
              className="px-3.5 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 text-xs font-semibold border border-red-500/30 transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign out</span>
            </button>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-app bg-surface-primary overflow-hidden">
        <div className="px-5 py-4 border-b border-app flex items-center gap-2">
          <Palette className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <h2 className="text-sm font-semibold text-app-primary">Appearance</h2>
        </div>
        <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-app-primary">Theme</p>
            <p className="text-xs text-app-muted mt-0.5">
              Currently using <span className="font-mono capitalize">{theme}</span> mode across the workspace.
            </p>
          </div>
          <ThemeToggle variant="full" />
        </div>
      </section>

      <section className="rounded-xl border border-app bg-surface-primary overflow-hidden">
        <div className="px-5 py-4 border-b border-app flex items-center gap-2">
          <Bell className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          <h2 className="text-sm font-semibold text-app-primary">Notifications</h2>
        </div>
        <div className="p-5 space-y-3">
          {[
            { label: "Critical & high severity alerts", on: true },
            { label: "Daily digest for medium signals", on: true },
            { label: "Weekly executive brief ready", on: false },
          ].map((row) => (
            <label
              key={row.label}
              className="flex items-center justify-between py-2 border-b border-app last:border-0 cursor-pointer"
            >
              <span className="text-sm text-app-secondary">{row.label}</span>
              <input type="checkbox" defaultChecked={row.on} className="rounded border-app" />
            </label>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-app bg-surface-primary overflow-hidden">
        <div className="px-5 py-4 border-b border-app flex items-center gap-2">
          <Shield className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <h2 className="text-sm font-semibold text-app-primary">Data collection</h2>
        </div>
        <p className="p-5 text-sm text-app-secondary leading-relaxed">
          Public pages only. Respect robots.txt and site terms. All observations store provenance for audit.
        </p>
      </section>

      <p className="text-xs text-app-muted flex items-center gap-2">
        <Mail className="w-3.5 h-3.5" />
        Need SSO or team seats? Contact enterprise sales — backend hooks are API-ready.
      </p>
    </div>
  );
}
