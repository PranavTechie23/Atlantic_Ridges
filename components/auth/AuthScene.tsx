"use client";

/** Animated ambient layers — scoped to left hero so the form side stays clean */
export function AuthScene() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
      <div className="auth-aurora absolute inset-0 opacity-90 dark:opacity-100" />
      <div className="hidden lg:block absolute inset-y-0 left-0 w-1/2 overflow-hidden">
        <div className="auth-nebula auth-nebula-a absolute w-[380px] h-[380px] left-[5%] top-[12%]" />
        <div className="auth-nebula auth-nebula-b absolute w-[320px] h-[320px] left-[30%] top-[55%]" />
        <div className="auth-scan-line absolute inset-x-0" />
      </div>
      <div className="hidden lg:block absolute inset-y-0 right-0 w-1/2 bg-linear-to-l from-transparent to-[var(--background)] opacity-80 dark:opacity-90" />
    </div>
  );
}
