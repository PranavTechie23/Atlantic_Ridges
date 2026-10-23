"use client";

import { Check, LogOut } from "lucide-react";
import { cn } from "../../lib/utils";

export type AuthSessionFlashVariant = "sign-in" | "sign-out";

type AuthSessionFlashProps = {
  message?: string;
  subtitle?: string;
  variant?: AuthSessionFlashVariant;
  /** Cover the viewport (sign-out from app shell) vs. overlay the auth form card */
  fullScreen?: boolean;
};

export function AuthSessionFlash({
  message,
  subtitle = "Redirecting…",
  variant = "sign-in",
  fullScreen = false,
}: AuthSessionFlashProps) {
  const isSignOut = variant === "sign-out";
  const Icon = isSignOut ? LogOut : Check;
  const resolvedMessage =
    message ?? (isSignOut ? "Signed out" : "Workspace secured");

  const ringClass = isSignOut
    ? "bg-blue-500/15 text-blue-600 dark:text-blue-400"
    : "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400";

  const iconClass = isSignOut
    ? "text-blue-600 dark:text-blue-400"
    : "text-emerald-500";

  return (
    <div
      className={cn(
        "auth-success-flash z-20 flex flex-col items-center justify-center",
        fullScreen
          ? "fixed inset-0 bg-black/45 dark:bg-black/55 backdrop-blur-md"
          : "absolute -inset-8 sm:-inset-9 rounded-2xl bg-surface-primary/95 dark:bg-[#12141c]/95 backdrop-blur-md"
      )}
      role="status"
      aria-live="polite"
    >
      <div
        className={cn(
          "auth-success-ring w-14 h-14 rounded-full flex items-center justify-center mb-3",
          ringClass
        )}
      >
        <Icon className={cn("w-7 h-7 auth-success-check", iconClass)} strokeWidth={2.5} />
      </div>
      <p className="text-sm font-semibold text-app-primary">{resolvedMessage}</p>
      <p className="text-xs text-app-muted mt-1">{subtitle}</p>
    </div>
  );
}

/** @deprecated Use AuthSessionFlash */
export function AuthSuccessFlash(props: { message?: string }) {
  return (
    <AuthSessionFlash
      variant="sign-in"
      message={props.message}
      subtitle="Redirecting…"
    />
  );
}
