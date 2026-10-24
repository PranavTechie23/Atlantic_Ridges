"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const PHRASES = [
  "competitive signals",
  "pricing intelligence",
  "launch alerts",
  "verified evidence",
  "strategic clarity",
] as const;

export function HeroRotatingPhrase() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const tick = window.setInterval(() => {
      setVisible(false);
      window.setTimeout(() => {
        setIndex((i) => (i + 1) % PHRASES.length);
        setVisible(true);
      }, 320);
    }, 3400);

    return () => window.clearInterval(tick);
  }, []);

  return (
    <span
      aria-live="polite"
      className={cn(
        "inline-block auth-headline-gradient text-transparent bg-clip-text bg-linear-to-r from-blue-600 via-indigo-600 to-violet-600",
        "transition-all duration-300 ease-out",
        visible ? "opacity-100 translate-y-0 blur-0" : "opacity-0 translate-y-3 blur-[2px]"
      )}
    >
      {PHRASES[index]}
    </span>
  );
}
