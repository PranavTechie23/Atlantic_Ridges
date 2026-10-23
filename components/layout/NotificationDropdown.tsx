"use client";

import React, { useState, useRef, useEffect } from "react";
import { useApp } from "../../lib/context/AppContext";
import { Bell, Check, Clock, ChevronRight } from "lucide-react";
import { SeverityBadge } from "../ui/Badge";

export function NotificationDropdown() {
  const { notifications, unreadCount, markNotificationsAsRead, openEvidenceDrawer } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="relative p-2 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-[#181B22] border border-transparent hover:border-[#262A33] transition-colors"
        title="Notifications"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500 animate-pulse" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl bg-[#111318] border border-[#262A33] shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="p-3.5 border-b border-[#262A33] flex items-center justify-between bg-[#151820]">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-zinc-100">Market Alerts</span>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-red-500/10 text-red-400 border border-red-500/20">
                  {unreadCount} new
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                onClick={markNotificationsAsRead}
                className="text-[11px] text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
              >
                <Check className="w-3 h-3" />
                Mark all as read
              </button>
            )}
          </div>

          <div className="max-h-[360px] overflow-y-auto divide-y divide-[#1D212B]">
            {notifications.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  if (item.evidenceId) {
                    openEvidenceDrawer(item.evidenceId);
                    setIsOpen(false);
                  }
                }}
                className={`p-3.5 hover:bg-[#181B22] cursor-pointer transition-colors ${
                  !item.read ? "bg-blue-950/10" : ""
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-1.5">
                    <SeverityBadge severity={item.severity} />
                    <span className="text-xs font-semibold text-zinc-300">
                      {item.competitor}
                    </span>
                  </div>
                  <span className="text-[10px] text-zinc-500 font-mono flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5" />
                    {item.time}
                  </span>
                </div>
                <h4 className="text-xs font-medium text-zinc-200 mt-1 leading-snug">
                  {item.title}
                </h4>
                <p className="text-[11px] text-zinc-400 mt-0.5 leading-relaxed line-clamp-2">
                  {item.description}
                </p>
                {item.evidenceId && (
                  <div className="mt-2 text-[10px] font-mono text-blue-400 flex items-center gap-1">
                    <span>Inspect evidence payload</span>
                    <ChevronRight className="w-3 h-3" />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="p-2 border-t border-[#262A33] bg-[#0E1015] text-center">
            <span className="text-[10px] text-zinc-500">
              Autonomous alerting via Webhooks & Continuous Diff Engine
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
