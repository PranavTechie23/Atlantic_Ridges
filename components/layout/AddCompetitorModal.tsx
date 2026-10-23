"use client";

import React, { useState } from "react";
import { useApp } from "../../lib/context/AppContext";
import { X, Plus, Globe, Tag, Clock, ShieldAlert } from "lucide-react";

export function AddCompetitorModal() {
  const { isAddCompetitorModalOpen, closeAddCompetitorModal, createCompetitor } = useApp();

  const [name, setName] = useState("");
  const [website, setWebsite] = useState("");
  const [category, setCategory] = useState("Cloud SaaS & Collaboration");
  const [tagline, setTagline] = useState("");
  const [frequency, setFrequency] = useState("Hourly (Continuous)");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [monitors, setMonitors] = useState({
    pricing: true,
    features: true,
    announcements: true,
    positioning: true,
  });

  if (!isAddCompetitorModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !website.trim()) return;

    setIsSubmitting(true);
    try {
      const logoText = name
        .split(" ")
        .map((w) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();

      await createCompetitor({
        name: name.trim(),
        website: website.trim(),
        category,
        tagline: tagline.trim() || "Competitor in market monitoring index",
        logoText: logoText || "CO",
        threatScore: 70,
        threatLevel: "MEDIUM",
        trend: "stable",
        trendDelta: 0,
        metrics: {
          pricingPressure: 65,
          featureVelocity: 70,
          aiCapability: 68,
          launchActivity: 60,
          integrations: 75,
          analytics: 70,
          automation: 65,
          marketPosition: 68,
        },
        latestChange: {
          title: "Initial monitoring baseline established",
          category: "positioning",
          date: new Date().toISOString(),
          impact: "LOW",
          evidenceId: "ev-acme-pricing-20261023",
        },
        lastScanTime: "Just added",
        monitoringStatus: "active",
      });

      setName("");
      setWebsite("");
      setTagline("");
      closeAddCompetitorModal();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div className="fixed inset-0" onClick={closeAddCompetitorModal} />

      <div className="relative w-full max-w-lg bg-[#111318] border border-[#262A33] rounded-xl shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-[#262A33] flex items-center justify-between bg-[#151820]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-[#F5F7FA]">Add Competitor</h3>
              <p className="text-xs text-zinc-400">
                Setup autonomous crawler and change telemetry
              </p>
            </div>
          </div>

          <button
            onClick={closeAddCompetitorModal}
            className="p-1 rounded-md text-zinc-400 hover:text-zinc-200 hover:bg-[#1F232D]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 block mb-1.5">
              Competitor Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Acme Cloud"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#0C0E12] border border-[#262A33] rounded-lg text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 block mb-1.5 flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-zinc-500" />
              Website URL
            </label>
            <input
              type="url"
              required
              placeholder="https://acmecloud.io"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#0C0E12] border border-[#262A33] rounded-lg text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 block mb-1.5 flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-zinc-500" />
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-[#0C0E12] border border-[#262A33] rounded-lg text-xs text-zinc-200 focus:outline-none focus:border-blue-500"
              >
                <option value="Cloud SaaS & Collaboration">Cloud SaaS & Collab</option>
                <option value="Generative AI & Agentic Ops">GenAI & Agents</option>
                <option value="CRM & Revenue Operations">CRM & Revenue</option>
                <option value="Developer Tools & Infrastructure">Developer Tools</option>
                <option value="Customer Support & Service">Customer Support</option>
                <option value="ERP & Operations">ERP & Operations</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 block mb-1.5 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-zinc-500" />
                Monitoring Frequency
              </label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                className="w-full px-3 py-2 bg-[#0C0E12] border border-[#262A33] rounded-lg text-xs text-zinc-200 focus:outline-none focus:border-blue-500"
              >
                <option value="Real-time (Webhooks + DOM)">Real-time (DOM poll)</option>
                <option value="Hourly (Continuous)">Hourly (Continuous)</option>
                <option value="Daily">Daily Snapshot</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 block mb-1.5">
              Tagline / Market Role (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Fast-growing productivity suite targeting mid-market"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="w-full px-3 py-2 bg-[#0C0E12] border border-[#262A33] rounded-lg text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Monitoring Vector Checkboxes */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 block mb-2">
              Active Monitoring Vectors
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                { key: "pricing", label: "Pricing Tables & Tier Matrix" },
                { key: "features", label: "Feature Matrix & Release Notes" },
                { key: "announcements", label: "Blog, PR & Product Hunt" },
                { key: "positioning", label: "Homepage Copy & Meta Tags" },
              ].map((v) => (
                <label
                  key={v.key}
                  className="flex items-center gap-2 p-2 rounded bg-[#0E1015] border border-[#262A33] text-zinc-300 cursor-pointer hover:bg-[#14171E]"
                >
                  <input
                    type="checkbox"
                    checked={monitors[v.key as keyof typeof monitors]}
                    onChange={(e) =>
                      setMonitors({
                        ...monitors,
                        [v.key]: e.target.checked,
                      })
                    }
                    className="accent-blue-600 rounded"
                  />
                  <span>{v.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-[#262A33] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={closeAddCompetitorModal}
              className="px-4 py-2 text-xs font-medium text-zinc-400 hover:text-zinc-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !name || !website}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isSubmitting ? "Indexing..." : "Start Monitoring"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
