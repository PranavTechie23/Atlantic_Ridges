"use client";

import React, { useEffect, useRef, useState } from "react";
import { cn } from "../../lib/utils";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  /** Stagger delay in ms */
  delay?: number;
  as?: "div" | "section" | "article" | "li";
  /** Skip intersection observer — use for above-the-fold / sticky panels */
  eager?: boolean;
};

export function Reveal({ children, className, delay = 0, as: Tag = "div", eager = false }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(eager);

  useEffect(() => {
    if (eager) {
      setVisible(true);
      return;
    }

    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.06, rootMargin: "0px 0px -32px 0px" }
    );
    observer.observe(el);

    const fallback = window.setTimeout(() => setVisible(true), 2200);

    return () => {
      observer.disconnect();
      clearTimeout(fallback);
    };
  }, [eager]);

  const Component = Tag as React.ElementType;

  return (
    <Component
      ref={ref}
      className={cn("motion-reveal", visible && "motion-reveal-visible", className)}
      style={{ "--motion-delay": `${delay}ms` } as React.CSSProperties}
    >
      {children}
    </Component>
  );
}

export function StaggerGrid({
  children,
  className,
  staggerMs = 70,
}: {
  children: React.ReactNode;
  className?: string;
  staggerMs?: number;
}) {
  return (
    <div className={className}>
      {React.Children.map(children, (child, i) =>
        React.isValidElement(child) ? (
          <Reveal delay={i * staggerMs} className="h-full">
            {child}
          </Reveal>
        ) : (
          child
        )
      )}
    </div>
  );
}
