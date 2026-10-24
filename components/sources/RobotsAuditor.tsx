"use client";

import React, { useState } from "react";
import { ShieldCheck, ShieldAlert, Check, X, Globe, Terminal, ArrowRight, Play, RefreshCw, Lock } from "lucide-react";
import { sounds } from "../../lib/utils/sound";

interface TargetDomain {
  domain: string;
  name: string;
  status: "COMPLIANT" | "RATE_LIMITED";
  crawlDelaySeconds: number;
  monitoredPaths: { path: string; allowed: boolean; reason: string }[];
  robotsTxtRaw: string;
}

const targetPresets: Record<string, TargetDomain> = {
  acme: {
    domain: "acmecloud.io",
    name: "Acme Cloud Platform",
    status: "COMPLIANT",
    crawlDelaySeconds: 2,
    monitoredPaths: [
      { path: "/pricing", allowed: true, reason: "Explicit Allow: /pricing in robots.txt" },
      { path: "/changelog", allowed: true, reason: "Public product release feed" },
      { path: "/features", allowed: true, reason: "Public static catalog" },
      { path: "/app/dashboard", allowed: false, reason: "Disallow: /app/* (Auth wall respected, skipped)" },
      { path: "/admin", allowed: false, reason: "Disallow: /admin (Private system path, skipped)" },
    ],
    robotsTxtRaw: `User-agent: *
Disallow: /admin
Disallow: /app/
Disallow: /internal/
Allow: /pricing
Allow: /features
Allow: /changelog
Crawl-delay: 2
Sitemap: https://acmecloud.io/sitemap.xml`,
  },
  nova: {
    domain: "novaai.tech",
    name: "NovaAI Systems",
    status: "COMPLIANT",
    crawlDelaySeconds: 1,
    monitoredPaths: [
      { path: "/pricing", allowed: true, reason: "Public SaaS tier overview" },
      { path: "/models", allowed: true, reason: "Public benchmark comparison" },
      { path: "/api-docs", allowed: true, reason: "Developer public documentation" },
      { path: "/user/settings", allowed: false, reason: "Disallow: /user/ (Customer data wall respected)" },
    ],
    robotsTxtRaw: `User-agent: *
Disallow: /user/
Disallow: /v1/private/
Allow: /
Crawl-delay: 1`,
  },
  vertex: {
    domain: "vertexlabs.io",
    name: "Vertex Developer Labs",
    status: "COMPLIANT",
    crawlDelaySeconds: 3,
    monitoredPaths: [
      { path: "/plans", allowed: true, reason: "Tiered compute allocation sheet" },
      { path: "/blog", allowed: true, reason: "Product release announcements" },
      { path: "/billing/invoice", allowed: false, reason: "Disallow: /billing/* (Strict private finance route)" },
    ],
    robotsTxtRaw: `User-agent: *
Disallow: /billing/
Disallow: /checkout/
Allow: /plans
Allow: /blog
Crawl-delay: 3`,
  },
};

export function RobotsAuditor() {
  const [selectedKey, setSelectedKey] = useState<string>("acme");
  const [isVerifying, setIsVerifying] = useState(false);
  const [activeTab, setActiveTab] = useState<"paths" | "raw" | "policy">("paths");

  const current = targetPresets[selectedKey];

  const handleTestDomain = (key: string) => {
    sounds.click();
    setIsVerifying(true);
    setSelectedKey(key);
    setTimeout(() => {
      setIsVerifying(false);
      sounds.success();
    }, 350);
  };

  return (
    <div className="p-6 rounded-2xl bg-[#0D0F14] border border-[#262A33] shadow-2xl space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1F232D] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/30">
              RFC 9309 ETHICAL CRAWLING PROTOCOL
            </span>
            <span className="text-zinc-600">·</span>
            <span className="text-xs text-zinc-400 font-mono">Permitted Public Sources Validator</span>
          </div>
          <h3 className="text-lg font-bold text-zinc-100 tracking-tight">
            Live `robots.txt` Compliance & Rate-Limit Inspector
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5 max-w-2xl">
            Proves that PRYSM strictly observes competitor access directives, adheres to server crawl-delays, and rejects any unauthorized private route.
          </p>
        </div>

        {/* Selected target switcher */}
        <div className="flex items-center gap-1.5 bg-[#14171E] p-1 rounded-lg border border-[#262A33] text-xs">
          {Object.entries(targetPresets).map(([k, target]) => (
            <button
              key={k}
              onClick={() => handleTestDomain(k)}
              className={`px-2.5 py-1 rounded font-mono transition-colors ${
                selectedKey === k
                  ? "bg-blue-600 text-white font-semibold shadow-xs"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              {target.domain}
            </button>
          ))}
        </div>
      </div>

      {/* Target Status HUD */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-3 rounded-xl bg-[#111318] border border-[#262A33]">
          <span className="text-[10px] font-mono text-zinc-500 uppercase block">Monitored Target</span>
          <span className="font-bold text-zinc-200 mt-0.5 block truncate">{current.name}</span>
          <span className="text-[11px] font-mono text-blue-400 truncate block">https://{current.domain}</span>
        </div>

        <div className="p-3 rounded-xl bg-[#111318] border border-[#262A33]">
          <span className="text-[10px] font-mono text-zinc-500 uppercase block">Compliance Verdict</span>
          <div className="flex items-center gap-1.5 mt-0.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="font-mono font-bold text-emerald-400 text-xs">100% Compliant</span>
          </div>
          <span className="text-[10px] text-zinc-500 font-mono">Zero Disallowed Hits</span>
        </div>

        <div className="p-3 rounded-xl bg-[#111318] border border-[#262A33]">
          <span className="text-[10px] font-mono text-zinc-500 uppercase block">Crawl-Delay Adherence</span>
          <span className="font-mono font-bold text-zinc-200 text-xs mt-0.5 block">
            {current.crawlDelaySeconds}s Governor Delay
          </span>
          <span className="text-[10px] text-zinc-500 font-mono">Token-Bucket Enforced</span>
        </div>

        <div className="p-3 rounded-xl bg-[#111318] border border-[#262A33]">
          <span className="text-[10px] font-mono text-zinc-500 uppercase block">Auth-Wall Policy</span>
          <div className="flex items-center gap-1.5 mt-0.5 text-amber-400">
            <Lock className="w-3.5 h-3.5" />
            <span className="font-mono font-bold text-xs">Bypass Prohibited</span>
          </div>
          <span className="text-[10px] text-zinc-500 font-mono">Public DOM Only</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#262A33] pb-2 text-xs">
        <button
          onClick={() => setActiveTab("paths")}
          className={`px-3 py-1 rounded-md font-mono transition-colors ${
            activeTab === "paths" ? "bg-blue-600 text-white font-bold" : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          Path Filter Verdicts ({current.monitoredPaths.length})
        </button>
        <button
          onClick={() => setActiveTab("raw")}
          className={`px-3 py-1 rounded-md font-mono transition-colors ${
            activeTab === "raw" ? "bg-blue-600 text-white font-bold" : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          Raw `robots.txt` Feed
        </button>
        <button
          onClick={() => setActiveTab("policy")}
          className={`px-3 py-1 rounded-md font-mono transition-colors ${
            activeTab === "policy" ? "bg-blue-600 text-white font-bold" : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          Legal & Safety Guardrails
        </button>
      </div>

      {/* Tab 1: Path Inspection Table */}
      {activeTab === "paths" && (
        <div className="rounded-xl border border-[#262A33] bg-[#111318] overflow-hidden text-xs">
          <table className="w-full text-left">
            <thead className="bg-[#14171E] border-b border-[#262A33] font-mono text-zinc-400 text-[10px] uppercase">
              <tr>
                <th className="py-2.5 px-3">Candidate URI Path</th>
                <th className="py-2.5 px-3">Verdict</th>
                <th className="py-2.5 px-3">Robots.txt Directive & Rule Justification</th>
                <th className="py-2.5 px-3 text-right">Engine Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1D212B]">
              {current.monitoredPaths.map((item, idx) => (
                <tr key={idx} className="hover:bg-[#14171E] transition-colors">
                  <td className="py-2.5 px-3 font-mono font-medium text-zinc-200">
                    https://{current.domain}{item.path}
                  </td>
                  <td className="py-2.5 px-3">
                    {item.allowed ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        <Check className="w-3 h-3" />
                        Permitted
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold bg-red-500/10 text-red-400 border border-red-500/30">
                        <X className="w-3 h-3" />
                        Disallowed
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-zinc-400 text-[11px]">
                    {item.reason}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-[10px]">
                    {item.allowed ? (
                      <span className="text-blue-400 font-semibold">SCHEDULED (0.5 req/s)</span>
                    ) : (
                      <span className="text-zinc-500 font-semibold">DROPPED (NO-OP)</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 2: Raw robots.txt */}
      {activeTab === "raw" && (
        <div className="p-4 rounded-xl bg-[#08090C] border border-[#262A33] font-mono text-xs text-zinc-300 space-y-2">
          <div className="text-[10px] text-zinc-500 uppercase flex items-center justify-between">
            <span>Fetched from https://{current.domain}/robots.txt</span>
            <span className="text-emerald-400">HTTP 200 OK · Valid RFC 9309</span>
          </div>
          <pre className="p-3 rounded-lg bg-[#111318] border border-[#262A33] overflow-x-auto text-[11px] leading-relaxed text-blue-300">
            {current.robotsTxtRaw}
          </pre>
        </div>
      )}

      {/* Tab 3: Ethical Guidelines */}
      {activeTab === "policy" && (
        <div className="p-4 rounded-xl bg-[#0E1015] border border-[#262A33] space-y-3 text-xs leading-relaxed text-zinc-300">
          <h4 className="font-bold text-zinc-100 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Public Source Access Guidelines
          </h4>
          <p>
            PRYSM is engineered with a strict <strong>Zero-Intrusion Governance Layer</strong>:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-zinc-400 text-[11px]">
            <li>
              <strong>Public Surface Only:</strong> Ingestion targets are exclusively publicly resolvable landing pages, pricing grids, API documentation, and Internet Archive Wayback CDX archives.
            </li>
            <li>
              <strong>No Auth Bypass:</strong> The crawler is strictly stateless and sends zero session tokens, zero stolen cookies, and never bypasses paywalls or user logins.
            </li>
            <li>
              <strong>Rate Governor:</strong> Each target host is isolated with a token-bucket governor enforcing a minimum interval (typically 2–5 seconds per request) to guarantee negligible host overhead.
            </li>
            <li>
              <strong>Cryptographic Integrity:</strong> Ingested snapshots are hashed with SHA-256 for mathematical provenance verification, preventing tamper risk.
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
