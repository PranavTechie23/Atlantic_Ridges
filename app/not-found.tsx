import Link from "next/link";
import { ArrowRight, Home, LayoutDashboard } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-dvh flex items-center justify-center bg-app p-6 page-enter">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-linear-to-br from-blue-500 via-indigo-600 to-violet-700 shadow-lg">
          <span className="font-mono text-2xl font-bold text-white">404</span>
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-app-primary">Signal not found</h1>
          <p className="text-sm text-app-secondary leading-relaxed">
            This route isn&apos;t in the intelligence graph. It may have moved or never existed in this workspace.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl btn-cta-primary text-white text-sm font-semibold"
          >
            <LayoutDashboard className="w-4 h-4" />
            Command Center
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-app text-sm font-medium text-app-secondary hover:text-app-primary hover:bg-surface-secondary transition-colors"
          >
            <Home className="w-4 h-4" />
            Home
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
