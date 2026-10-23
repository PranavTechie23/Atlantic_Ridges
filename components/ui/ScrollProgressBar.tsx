"use client";

import React, { useEffect, useState } from "react";

export function ScrollProgressBar() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const currentProgress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, currentProgress)));
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (scrollProgress <= 0.5) return null;

  return (
    <div className="fixed top-14 left-0 right-0 z-30 h-0.5 bg-transparent pointer-events-none">
      <div
        style={{ width: `${scrollProgress}%` }}
        className="h-full bg-linear-to-r from-blue-500 via-indigo-500 to-purple-500 shadow-[0_0_12px_rgba(59,130,246,0.8)] transition-all duration-100 ease-out"
      />
    </div>
  );
}
