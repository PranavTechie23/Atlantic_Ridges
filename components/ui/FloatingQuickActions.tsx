"use client";

import React, { useState, useEffect } from "react";
import { ArrowUp, Play, RefreshCw, Volume2, VolumeX, Sparkles, Bot } from "lucide-react";
import Link from "next/link";
import { useApp } from "@/lib/context/AppContext";
import { sounds } from "@/lib/utils/sound";

export function FloatingQuickActions() {
  const { openScanModal, openChat } = useApp();
  const [isVisible, setIsVisible] = useState(false);
  const [soundOn, setSoundOn] = useState(() => sounds.isEnabled());

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 320) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    sounds.playTick();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleToggleSound = () => {
    const next = sounds.toggleSound();
    setSoundOn(next);
  };

  if (!isVisible) return null;

  return (
    <div className="no-print print:hidden fixed bottom-6 right-24 sm:right-26 z-35 flex items-center gap-1.5 sm:gap-2 p-1.5 rounded-full bg-[#111318]/90 border border-[#262A33] backdrop-blur-xl shadow-2xl animate-in fade-in slide-in-from-bottom-5 duration-300">
      <button
        onClick={() => {
          sounds.playChirp();
          openChat();
        }}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-linear-to-r from-blue-600/30 to-indigo-600/30 border border-blue-500/40 text-blue-300 text-xs font-bold hover:scale-105 transition-all shadow-md cursor-pointer"
        title="Open PRYSM AI Copilot (⌘J)"
      >
        <Bot className="w-3.5 h-3.5 text-cyan-400" />
        <span className="hidden sm:inline">Copilot</span>
      </button>
      <Link
        href="/audit"
        onClick={() => sounds.playChirp()}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-linear-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold hover:scale-105 transition-all shadow-md"
        title="Comprehensive System Architecture & Verification Suite"
      >
        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
        <span className="hidden sm:inline">System Audit</span>
      </Link>

      <Link
        href="/demo"
        onClick={() => sounds.playChirp()}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-300 text-xs font-semibold hover:scale-105 transition-all"
        title="Open interactive demonstration sandbox"
      >
        <Play className="w-3.5 h-3.5 fill-current text-blue-400" />
        <span className="hidden sm:inline">Sandbox</span>
      </Link>

      <button
        onClick={() => {
          sounds.playTick();
          openScanModal();
        }}
        className="p-2 rounded-full bg-[#181B22] hover:bg-[#222734] border border-[#262A33] text-zinc-300 hover:text-white transition-colors cursor-pointer"
        title="Trigger live scan simulation"
      >
        <RefreshCw className="w-3.5 h-3.5" />
      </button>

      <button
        onClick={handleToggleSound}
        className="p-2 rounded-full bg-[#181B22] hover:bg-[#222734] border border-[#262A33] text-zinc-300 hover:text-white transition-colors cursor-pointer"
        title={soundOn ? "Mute audio sound effects" : "Enable futuristic sound effects"}
      >
        {soundOn ? <Volume2 className="w-3.5 h-3.5 text-blue-400" /> : <VolumeX className="w-3.5 h-3.5 text-zinc-500" />}
      </button>

      <button
        onClick={scrollToTop}
        className="p-2 rounded-full bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/30 transition-all hover:-translate-y-0.5 cursor-pointer"
        title="Scroll back to top"
      >
        <ArrowUp className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
