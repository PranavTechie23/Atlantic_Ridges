"use client";

import Link from "next/link";
import { ChevronRight, Scale } from "lucide-react";

/** Single-line pointer — credentials live on /judges, not on the consumer login form. */
export function JudgeAccessDisclosure() {
  return (
    <p className="mt-4 text-center text-[11px] text-app-muted leading-relaxed">
      <Scale className="w-3 h-3 inline-block -mt-0.5 mr-1 opacity-70" aria-hidden />
      {" "}
      <Link
        href="/judges"
        className="auth-text-link font-semibold text-blue-600 dark:text-blue-400 inline-flex items-center gap-0.5"
      >
        
        <ChevronRight className="w-3 h-3" />
      </Link>{" "}
     
    </p>
  );
}
