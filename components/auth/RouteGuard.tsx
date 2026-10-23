"use client";

import React, { useEffect, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useApp } from "../../lib/context/AppContext";
import {
  DEFAULT_APP_HOME,
  getSafeRedirect,
  isAuthOnlyPath,
  isPublicPath,
} from "../../lib/auth/routes";
import { AuthLoadingScreen } from "./AuthLoadingScreen";

export function RouteGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, authReady } = useApp();
  const redirecting = useRef(false);

  useEffect(() => {
    redirecting.current = false;
  }, [pathname]);

  useEffect(() => {
    if (!authReady || !pathname) return;

    const isAuthed = Boolean(user);
    const nextParam = searchParams.get("next");

    if (!isAuthed && !isPublicPath(pathname)) {
      if (redirecting.current) return;
      redirecting.current = true;
      const loginUrl = `/login?next=${encodeURIComponent(pathname)}`;
      router.replace(loginUrl);
      return;
    }

    if (isAuthed && isAuthOnlyPath(pathname)) {
      if (redirecting.current) return;
      redirecting.current = true;
      router.replace(getSafeRedirect(nextParam, DEFAULT_APP_HOME));
      return;
    }

    if (isAuthed && pathname === "/") {
      if (redirecting.current) return;
      redirecting.current = true;
      router.replace(DEFAULT_APP_HOME);
      return;
    }

    redirecting.current = false;
  }, [authReady, user, pathname, router, searchParams]);

  if (!authReady) {
    return <AuthLoadingScreen />;
  }

  const isAuthed = Boolean(user);
  if (!isAuthed && pathname && !isPublicPath(pathname)) {
    return <AuthLoadingScreen />;
  }

  if (isAuthed && pathname && (isAuthOnlyPath(pathname) || pathname === "/")) {
    return <AuthLoadingScreen />;
  }

  return <>{children}</>;
}
