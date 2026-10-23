"use client";

import React, { useCallback, useEffect, useState } from "react";

/** Wraps hero content with a soft cursor-following glow (desktop + fine pointer only). */
export function AuthSpotlightHost({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const [pos, setPos] = useState({ x: 50, y: 40 });
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const mqFine = window.matchMedia("(pointer: fine)");
    const mqReduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mqLg = window.matchMedia("(min-width: 1024px)");

    const sync = () => {
      setEnabled(mqFine.matches && !mqReduce.matches && mqLg.matches);
    };
    sync();
    mqFine.addEventListener("change", sync);
    mqReduce.addEventListener("change", sync);
    mqLg.addEventListener("change", sync);
    return () => {
      mqFine.removeEventListener("change", sync);
      mqReduce.removeEventListener("change", sync);
      mqLg.removeEventListener("change", sync);
    };
  }, []);

  const onMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!enabled) return;
      const rect = e.currentTarget.getBoundingClientRect();
      setPos({
        x: ((e.clientX - rect.left) / rect.width) * 100,
        y: ((e.clientY - rect.top) / rect.height) * 100,
      });
    },
    [enabled]
  );

  return (
    <div className={`relative ${className}`} onMouseMove={onMove}>
      {enabled && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden z-0" aria-hidden>
          <div
            className="auth-spotlight absolute inset-0"
            style={
              {
                "--spot-x": `${pos.x}%`,
                "--spot-y": `${pos.y}%`,
              } as React.CSSProperties
            }
          />
        </div>
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
