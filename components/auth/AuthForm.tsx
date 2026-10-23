"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { getSafeRedirect } from "../../lib/auth/routes";
import { LoginNextHint } from "./LoginNextHint";
import {
  Loader2,
  Mail,
  Lock,
  User,
  ArrowRight,
  Eye,
  EyeOff,
  Globe,
  Briefcase,
  Check,
} from "lucide-react";
import { useApp } from "../../lib/context/AppContext";
import { cn } from "../../lib/utils";
import { sounds } from "../../lib/utils/sound";
import { AuthSessionFlash } from "./AuthSessionFlash";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function Field({
  label,
  id,
  type,
  value,
  onChange,
  placeholder,
  icon: Icon,
  autoComplete,
  staggerMs = 0,
  showValidWhen,
}: {
  label: string;
  id: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  icon: React.ComponentType<{ className?: string }>;
  autoComplete?: string;
  staggerMs?: number;
  showValidWhen?: (v: string) => boolean;
}) {
  const [show, setShow] = useState(false);
  const [focused, setFocused] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword && show ? "text" : type;
  const valid = showValidWhen?.(value) ?? false;
  const showValid = valid && value.trim().length > 0 && !focused;

  return (
    <div
      className="auth-field-stagger space-y-2"
      style={{ "--field-delay": `${staggerMs}ms` } as React.CSSProperties}
    >
      <label htmlFor={id} className="text-sm font-medium text-app-primary">
        {label}
      </label>
      <div className="relative group">
        <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-app-muted group-focus-within:text-blue-500 transition-colors duration-200" />
        <input
          id={id}
          type={inputType}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          aria-invalid={value.length > 0 && showValidWhen && !valid ? true : undefined}
          className={cn(
            "auth-field-input w-full pl-11 py-3 rounded-xl text-sm text-app-primary placeholder:text-app-muted focus:outline-none transition-[box-shadow,border-color] duration-200",
            isPassword || showValid ? "pr-11" : "pr-4",
            value.trim().length > 0 && "auth-field-filled",
            showValid && "auth-field-valid-ring"
          )}
        />
        {showValid && (
          <Check
            className="absolute right-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-emerald-500 pointer-events-none"
            aria-hidden
          />
        )}
        {isPassword && (
          <button
            type="button"
            onClick={() => {
              sounds.playTick();
              setShow((s) => !s);
            }}
            className={cn(
              "absolute top-1/2 -translate-y-1/2 text-app-muted hover:text-app-secondary p-0.5 transition-colors",
              showValid ? "right-10" : "right-3.5"
            )}
            aria-label={show ? "Hide password" : "Show password"}
          >
            {show ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
          </button>
        )}
      </div>
    </div>
  );
}

function useAfterAuthRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  return () => {
    const next = getSafeRedirect(searchParams.get("next"));
    router.push(next);
  };
}

function useAuthSuccessTransition() {
  const [success, setSuccess] = useState(false);
  const goAfterAuth = useAfterAuthRedirect();

  const complete = () => {
    sounds.playSuccess();
    setSuccess(true);
    window.setTimeout(() => goAfterAuth(), 520);
  };

  return { success, complete, goAfterAuth };
}

function AuthDivider() {
  return (
    <div className="relative py-2">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-app" />
      </div>
      <div className="relative flex justify-center">
        <span className="bg-surface-primary dark:bg-[#12141c] px-3 text-[10px] uppercase tracking-[0.15em] text-app-muted font-semibold">
          or
        </span>
      </div>
    </div>
  );
}

function SocialButtons({ onDemo }: { onDemo?: () => void }) {
  const wrapDemo = () => {
    sounds.playTick();
    onDemo?.();
  };
  return (
    <div className="auth-field-stagger grid grid-cols-2 gap-3" style={{ "--field-delay": "0ms" } as React.CSSProperties}>
      <button
        type="button"
        onClick={wrapDemo}
        className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-app dark:border-white/10 bg-surface-primary dark:bg-white/[0.04] text-sm font-medium text-app-secondary hover:text-app-primary hover:border-blue-500/40 hover:-translate-y-0.5 transition-all duration-200"
      >
        <Globe className="w-4 h-4 text-blue-500" />
        Demo SSO
      </button>
      <button
        type="button"
        onClick={wrapDemo}
        className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-app dark:border-white/10 bg-surface-primary dark:bg-white/[0.04] text-sm font-medium text-app-secondary hover:text-app-primary hover:border-blue-500/40 hover:-translate-y-0.5 transition-all duration-200 active:scale-[0.98]"
      >
        <Briefcase className="w-4 h-4" />
        Work account
      </button>
    </div>
  );
}

function PasswordStrength({ password }: { password: string }) {
  const score = useMemo(() => {
    if (!password) return 0;
    let s = 0;
    if (password.length >= 6) s++;
    if (password.length >= 10) s++;
    if (/[A-Z]/.test(password) && /[0-9]/.test(password)) s++;
    return s;
  }, [password]);

  if (!password) return null;

  const labels = ["Weak", "Fair", "Strong"];
  const colors = ["bg-red-500", "bg-amber-500", "bg-emerald-500"];

  return (
    <div className="space-y-1.5" aria-live="polite">
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
              i < score ? colors[score - 1] : "bg-surface-tertiary dark:bg-zinc-800"
            }`}
          />
        ))}
      </div>
      <p className="text-[11px] text-app-muted">{labels[Math.max(0, score - 1)] || "Too short"}</p>
    </div>
  );
}

export function LoginForm() {
  const { login, continueAsGuest, authError, clearAuthError } = useApp();
  const { success, complete, goAfterAuth } = useAuthSuccessTransition();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [loggedOutFlash, setLoggedOutFlash] = useState(false);

  useEffect(() => {
    if (searchParams?.get("loggedOut") !== "true") return;
    setLoggedOutFlash(true);
    sounds.playSuccess();
    try {
      window.history.replaceState(null, "", "/login");
    } catch {
      /* ignore */
    }
    const timer = window.setTimeout(() => setLoggedOutFlash(false), 2400);
    return () => window.clearTimeout(timer);
  }, [searchParams]);

  const goDemo = () => {
    continueAsGuest();
    sounds.playChirp();
    goAfterAuth();
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearAuthError();
    setLoading(true);
    const ok = await login(email, password);
    if (ok) {
      complete();
      setLoading(false);
      return;
    }
    setLoading(false);
  };

  return (
    <div className="relative">
      {success && (
        <AuthSessionFlash variant="sign-in" message="Signed in" subtitle="Redirecting…" />
      )}
      {loggedOutFlash && (
        <AuthSessionFlash
          variant="sign-out"
          message="Signed out"
          subtitle="Session secured — sign in when you're ready"
        />
      )}
    <form onSubmit={submit} className="space-y-5">
      <LoginNextHint />
      {authError && (
        <div className="auth-error-banner text-sm text-red-600 dark:text-red-400 bg-red-500/10 border border-red-500/25 rounded-xl px-4 py-3">
          {authError}
        </div>
      )}

      <SocialButtons onDemo={goDemo} />
      <AuthDivider />

      <Field
        label="Email"
        id="email"
        type="email"
        value={email}
        onChange={setEmail}
        placeholder="you@company.com"
        icon={Mail}
        autoComplete="email"
        staggerMs={60}
        showValidWhen={(v) => EMAIL_RE.test(v.trim())}
      />
      <Field
        label="Password"
        id="password"
        type="password"
        value={password}
        onChange={setPassword}
        placeholder="••••••••"
        icon={Lock}
        autoComplete="current-password"
        staggerMs={120}
        showValidWhen={(v) => v.length >= 6}
      />

      <div
        className="auth-field-stagger flex items-center justify-between text-sm"
        style={{ "--field-delay": "180ms" } as React.CSSProperties}
      >
        <label className="flex items-center gap-2 text-app-secondary cursor-pointer select-none">
          <input type="checkbox" className="auth-checkbox rounded border-app" defaultChecked />
          Remember me
        </label>
        <Link href="/forgot-password" className="auth-text-link text-blue-600 dark:text-blue-400 font-medium">
          Forgot password?
        </Link>
      </div>

      <button
        type="submit"
        disabled={loading || success}
        className={cn(
          "auth-primary-btn w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-white text-sm font-semibold disabled:opacity-60",
          loading && "auth-btn-loading"
        )}
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin relative z-10" />
            <span className="relative z-10 sr-only sm:not-sr-only sm:inline">Securing session…</span>
          </>
        ) : (
          <>
            Sign in to workspace
            <ArrowRight className="auth-btn-arrow w-4 h-4" />
          </>
        )}
      </button>

      <button
        type="button"
        onClick={goDemo}
        className="w-full py-2.5 text-sm font-medium text-app-muted hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
      >
        Continue with demo workspace
      </button>
    </form>
    </div>
  );
}

export function SignupForm() {
  const { success, complete, goAfterAuth } = useAuthSuccessTransition();
  const { signup, continueAsGuest, authError, clearAuthError } = useApp();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearAuthError();
    setLoading(true);
    const ok = await signup({ name, email, password });
    if (ok) {
      complete();
      setLoading(false);
      return;
    }
    setLoading(false);
  };

  return (
    <div className="relative">
      {success && (
        <AuthSessionFlash variant="sign-in" message="Workspace created" subtitle="Redirecting…" />
      )}
    <form onSubmit={submit} className="space-y-5">
      {authError && (
        <div className="auth-error-banner text-sm text-red-600 dark:text-red-400 bg-red-500/10 border border-red-500/25 rounded-xl px-4 py-3">
          {authError}
        </div>
      )}

      <Field
        label="Full name"
        id="name"
        type="text"
        value={name}
        onChange={setName}
        placeholder="Alex Morgan"
        icon={User}
        autoComplete="name"
        staggerMs={40}
        showValidWhen={(v) => v.trim().length >= 2}
      />
      <Field
        label="Work email"
        id="email"
        type="email"
        value={email}
        onChange={setEmail}
        placeholder="you@company.com"
        icon={Mail}
        autoComplete="email"
        staggerMs={90}
        showValidWhen={(v) => EMAIL_RE.test(v.trim())}
      />
      <div className="space-y-2 auth-field-stagger" style={{ "--field-delay": "140ms" } as React.CSSProperties}>
        <Field
          label="Password"
          id="password"
          type="password"
          value={password}
          onChange={setPassword}
          placeholder="Min. 6 characters"
          icon={Lock}
          autoComplete="new-password"
          showValidWhen={(v) => v.length >= 10 && /[A-Z]/.test(v) && /[0-9]/.test(v)}
        />
        <PasswordStrength password={password} />
      </div>

      <p className="text-xs text-app-muted leading-relaxed auth-field-stagger" style={{ "--field-delay": "190ms" } as React.CSSProperties}>
        By creating an account you agree to monitor only permitted public sources and respect site terms.
      </p>

      <button
        type="submit"
        disabled={loading || success}
        className={cn(
          "auth-primary-btn w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-white text-sm font-semibold disabled:opacity-60 auth-field-stagger",
          loading && "auth-btn-loading"
        )}
        style={{ "--field-delay": "220ms" } as React.CSSProperties}
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin relative z-10" />
            <span className="relative z-10 sr-only sm:not-sr-only sm:inline">Provisioning workspace…</span>
          </>
        ) : (
          <>
            Create workspace
            <ArrowRight className="auth-btn-arrow w-4 h-4" />
          </>
        )}
      </button>

      <p className="text-center text-xs text-app-muted pt-1 auth-field-stagger" style={{ "--field-delay": "260ms" } as React.CSSProperties}>
        Or{" "}
        <button
          type="button"
          onClick={() => {
            continueAsGuest();
            sounds.playChirp();
            goAfterAuth();
          }}
          className="auth-text-link text-blue-600 dark:text-blue-400 font-medium"
        >
          continue with demo workspace
        </button>
      </p>
    </form>
    </div>
  );
}

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    sounds.playSuccess();
    setSent(true);
  };

  if (sent) {
    return (
      <div className="space-y-5 text-center py-2 auth-success-flash">
        <div className="auth-success-ring w-14 h-14 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
          <Mail className="w-7 h-7 auth-success-check" />
        </div>
        <p className="text-sm text-app-secondary leading-relaxed">
          If an account exists for <strong className="text-app-primary">{email}</strong>, check your
          inbox for reset instructions.
        </p>
        <Link href="/login" className="auth-text-link inline-flex text-sm font-semibold text-blue-600 dark:text-blue-400">
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <Field
        label="Email"
        id="email"
        type="email"
        value={email}
        onChange={setEmail}
        placeholder="you@company.com"
        icon={Mail}
        autoComplete="email"
        showValidWhen={(v) => EMAIL_RE.test(v.trim())}
      />
      <button
        type="submit"
        disabled={loading || !EMAIL_RE.test(email.trim())}
        className={cn(
          "auth-primary-btn w-full py-3.5 rounded-xl text-white text-sm font-semibold disabled:opacity-60",
          loading && "auth-btn-loading"
        )}
      >
        {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto relative z-10" /> : "Send reset link"}
      </button>
      <p className="text-center text-sm text-app-muted">
        <Link href="/login" className="auth-text-link text-blue-600 dark:text-blue-400 font-semibold">
          Back to sign in
        </Link>
      </p>
    </form>
  );
}
