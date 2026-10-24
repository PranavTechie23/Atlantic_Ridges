"use client";

import { Fingerprint, Lock, Shield } from "lucide-react";

const items = [
  { icon: Lock, label: "scrypt password hashes" },
  { icon: Shield, label: "HttpOnly sessions" },
  { icon: Fingerprint, label: "Evidence SHA-256" },
];

export function AuthTrustRow() {
  return (
    <ul className="mt-6 flex flex-wrap justify-center gap-x-4 gap-y-2 text-[10px] text-app-muted auth-trust-enter">
      {items.map(({ icon: Icon, label }) => (
        <li key={label} className="inline-flex items-center gap-1.5">
          <Icon className="w-3 h-3 text-blue-500/80 dark:text-blue-400/80" aria-hidden />
          <span>{label}</span>
        </li>
      ))}
    </ul>
  );
}
