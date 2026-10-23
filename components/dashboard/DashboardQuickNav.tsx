"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Radar, History, ShieldCheck, GitCompare } from "lucide-react";
import { cn } from "../../lib/utils";

const links = [
  { href: "/radar", label: "Change radar", icon: Radar },
  { href: "/timeline", label: "Timeline", icon: History },
  { href: "/evidence", label: "Evidence", icon: ShieldCheck },
  { href: "/comparison", label: "Compare", icon: GitCompare },
];

export function DashboardQuickNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap gap-2" aria-label="Quick navigation">
      {links.map(({ href, label, icon: Icon }) => {
        const active = pathname === href || pathname?.startsWith(`${href}/`);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[11px] font-medium transition-all duration-200",
              active
                ? "border-blue-500/40 bg-blue-500/10 text-blue-700 dark:text-blue-300"
                : "border-app bg-surface-primary text-app-secondary hover:text-app-primary hover:border-blue-500/35 hover:bg-surface-secondary"
            )}
          >
            <Icon className={cn("w-3.5 h-3.5", active ? "text-blue-500" : "text-blue-500/80")} aria-hidden />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
