/** Routes that never require a session */
export const PUBLIC_PATHS = [
  "/",
  "/login",
  "/signup",
  "/forgot-password",
  "/docs",
  "/demo",
] as const;

/** Auth forms — signed-in users are sent to the app */
export const AUTH_ONLY_PATHS = ["/login", "/signup", "/forgot-password"] as const;

export const DEFAULT_APP_HOME = "/dashboard";

export function isPublicPath(pathname: string | null): boolean {
  if (!pathname) return false;
  if (PUBLIC_PATHS.includes(pathname as (typeof PUBLIC_PATHS)[number])) return true;
  return false;
}

export function isAuthOnlyPath(pathname: string | null): boolean {
  if (!pathname) return false;
  return AUTH_ONLY_PATHS.includes(pathname as (typeof AUTH_ONLY_PATHS)[number]);
}

/** App shell without sidebar (marketing + auth) */
export function isStandaloneShellPath(pathname: string | null): boolean {
  if (!pathname) return false;
  return (
    pathname === "/" ||
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname === "/forgot-password"
  );
}

/** Prevent open redirects */
export function getSafeRedirect(next: string | null | undefined, fallback = DEFAULT_APP_HOME): string {
  if (!next || typeof next !== "string") return fallback;
  if (!next.startsWith("/") || next.startsWith("//")) return fallback;
  if (isAuthOnlyPath(next)) return fallback;
  if (next === "/") return fallback;
  return next;
}

/** Same as getSafeRedirect but allows empty string when invalid (for hint UI) */
export function peekRedirect(next: string | null | undefined): string {
  if (!next || typeof next !== "string") return "";
  if (!next.startsWith("/") || next.startsWith("//")) return "";
  if (isAuthOnlyPath(next) || next === "/") return "";
  return next;
}
