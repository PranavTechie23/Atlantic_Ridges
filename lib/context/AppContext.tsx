"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  Competitor,
  EvidenceItem,
  NotificationItem,
} from "../types";
import {
  getCompetitors,
  addCompetitor as apiAddCompetitor,
  getNotifications,
  markAllNotificationsRead,
  getEvidence,
} from "../api";
import { sounds } from "../utils/sound";
import { SIGN_OUT_ANIMATION_MS } from "../auth/sign-out";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  plan: string;
  initials: string;
}

interface AppContextType {
  // Auth (demo — persisted in localStorage)
  user: AuthUser | null;
  authReady: boolean;
  authError: string | null;
  clearAuthError: () => void;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (data: { name: string; email: string; password: string }) => Promise<boolean>;
  logout: () => void;
  /** Sign-out with the same animated feedback as sign-in */
  signOutAnimated: () => Promise<void>;
  isSigningOut: boolean;
  continueAsGuest: () => void;

  // Theme (Dark / Light)
  theme: "dark" | "light";
  toggleTheme: () => void;
  setTheme: (theme: "dark" | "light") => void;

  // Evidence Drawer
  selectedEvidenceId: string | null;
  selectedEvidence: EvidenceItem | null;
  evidenceLoading: boolean;
  isEvidenceDrawerOpen: boolean;
  openEvidenceDrawer: (evidenceId: string) => void;
  closeEvidenceDrawer: () => void;

  // Modals
  isScanModalOpen: boolean;
  openScanModal: () => void;
  closeScanModal: () => void;

  isAddCompetitorModalOpen: boolean;
  openAddCompetitorModal: () => void;
  closeAddCompetitorModal: () => void;

  isSearchModalOpen: boolean;
  openSearchModal: () => void;
  closeSearchModal: () => void;

  isShortcutsModalOpen: boolean;
  openShortcutsModal: () => void;
  closeShortcutsModal: () => void;

  // Sidebar
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;

  // Notifications
  notifications: NotificationItem[];
  unreadCount: number;
  markNotificationsAsRead: () => void;
  refreshNotifications: () => Promise<void>;
  refreshAll: () => Promise<void>;

  // Competitors
  competitors: Competitor[];
  refreshCompetitors: () => Promise<void>;
  createCompetitor: (data: Omit<Competitor, "id" | "slug" | "history">) => Promise<Competitor>;

  // Scan simulation state
  isScanningActive: boolean;
  lastScanText: string;
  triggerScanSimulation: (selectedCompIds: string[]) => Promise<void>;
  scanProgress: {
    step: number;
    total: number;
    label: string;
    completed: boolean;
    detectedChanges: number;
    highImpactCount: number;
    avgConfidence: number;
  };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const GUEST_USER: AuthUser = {
  id: "guest",
  name: "Intelligence Desk",
  email: "demo@prysm.io",
  plan: "Enterprise Demo",
  initials: "SN",
};

function buildUser(name: string, email: string): AuthUser {
  const parts = name.trim().split(/\s+/);
  const initials =
    parts.length >= 2
      ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
      : name.slice(0, 2).toUpperCase();
  return {
    id: `user-${Date.now()}`,
    name: name.trim(),
    email: email.trim().toLowerCase(),
    plan: "Pro Intelligence",
    initials,
  };
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Theme state with localStorage persistence
  const [theme, setThemeState] = useState<"dark" | "light">("dark");

  const [selectedEvidenceId, setSelectedEvidenceId] = useState<string | null>(null);
  const [selectedEvidence, setSelectedEvidence] = useState<EvidenceItem | null>(null);
  const [evidenceLoading, setEvidenceLoading] = useState(false);
  const [isEvidenceDrawerOpen, setIsEvidenceDrawerOpen] = useState(false);

  const [isScanModalOpen, setIsScanModalOpen] = useState(false);
  const [isAddCompetitorModalOpen, setIsAddCompetitorModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isShortcutsModalOpen, setIsShortcutsModalOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [lastScanText, setLastScanText] = useState("4 min ago");

  const [isSigningOut, setIsSigningOut] = useState(false);
  const [isScanningActive, setIsScanningActive] = useState(false);
  const [scanProgress, setScanProgress] = useState({
    step: 0,
    total: 5,
    label: "Idle",
    completed: false,
    detectedChanges: 0,
    highImpactCount: 0,
    avgConfidence: 0,
  });

  // Initialize theme + auth on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("prysm-theme");
      if (saved === "light" || saved === "dark") {
        setThemeState(saved);
        document.documentElement.classList.toggle("dark", saved === "dark");
      } else {
        document.documentElement.classList.add("dark");
      }
    } catch {
      document.documentElement.classList.add("dark");
    }

    try {
      const raw = localStorage.getItem("prysm-auth-user");
      if (raw) {
        setUser(JSON.parse(raw) as AuthUser);
      }
    } catch {
      /* no session — user stays null until login or demo workspace */
    }
    setAuthReady(true);
  }, []);

  const persistUser = useCallback((next: AuthUser | null) => {
    setUser(next);
    try {
      if (next) localStorage.setItem("prysm-auth-user", JSON.stringify(next));
      else localStorage.removeItem("prysm-auth-user");
    } catch {}
  }, []);

  const clearAuthError = useCallback(() => setAuthError(null), []);

  const login = useCallback(async (email: string, password: string) => {
    setAuthError(null);
    await new Promise((r) => setTimeout(r, 500));
    if (!email.includes("@") || password.length < 6) {
      setAuthError("Enter a valid email and password (6+ characters).");
      return false;
    }
    const name = email.split("@")[0].replace(/[._]/g, " ");
    const formatted = name.charAt(0).toUpperCase() + name.slice(1);
    persistUser(buildUser(formatted, email));
    return true;
  }, [persistUser]);

  const signup = useCallback(
    async (data: { name: string; email: string; password: string }) => {
      setAuthError(null);
      await new Promise((r) => setTimeout(r, 600));
      if (!data.name.trim() || !data.email.includes("@")) {
        setAuthError("Name and a valid email are required.");
        return false;
      }
      if (data.password.length < 6) {
        setAuthError("Password must be at least 6 characters.");
        return false;
      }
      persistUser(buildUser(data.name, data.email));
      return true;
    },
    [persistUser]
  );

  const logout = useCallback(() => {
    persistUser(null);
    setAuthError(null);
  }, [persistUser]);

  const signOutAnimated = useCallback(() => {
    if (isSigningOut) return Promise.resolve();
    setIsSigningOut(true);
    sounds.playSuccess();
    return new Promise<void>((resolve) => {
      window.setTimeout(() => {
        persistUser(null);
        setAuthError(null);
        setIsSigningOut(false);
        resolve();
      }, SIGN_OUT_ANIMATION_MS);
    });
  }, [isSigningOut, persistUser]);

  const continueAsGuest = useCallback(() => {
    persistUser(GUEST_USER);
  }, [persistUser]);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      try {
        localStorage.setItem("prysm-theme", next);
      } catch {}
      document.documentElement.classList.toggle("dark", next === "dark");
      return next;
    });
  }, []);

  const setTheme = useCallback((newTheme: "dark" | "light") => {
    setThemeState(newTheme);
    try {
      localStorage.setItem("prysm-theme", newTheme);
    } catch {}
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  }, []);

  const loadInitialData = useCallback(async () => {
    try {
      const [comps, notifs] = await Promise.all([
        getCompetitors(),
        getNotifications(),
      ]);
      setCompetitors(comps);
      setNotifications(notifs);
    } catch (e) {
      console.error("Failed to load initial data", e);
    }
  }, []);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const typing =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable;

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsSearchModalOpen((prev) => !prev);
        setIsShortcutsModalOpen(false);
      }
      if (e.key === "?" && !typing && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        setIsShortcutsModalOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setIsSearchModalOpen(false);
        setIsScanModalOpen(false);
        setIsAddCompetitorModalOpen(false);
        setIsEvidenceDrawerOpen(false);
        setIsShortcutsModalOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const openEvidenceDrawer = useCallback(async (evidenceId: string) => {
    setSelectedEvidenceId(evidenceId);
    setSelectedEvidence(null);
    setIsEvidenceDrawerOpen(true);
    setEvidenceLoading(true);
    sounds.playTick();
    try {
      const item = await getEvidence(evidenceId);
      setSelectedEvidence(item);
      if (item) sounds.playSuccess();
    } finally {
      setEvidenceLoading(false);
    }
  }, []);

  const closeEvidenceDrawer = useCallback(() => {
    setIsEvidenceDrawerOpen(false);
    setSelectedEvidenceId(null);
    setSelectedEvidence(null);
    setEvidenceLoading(false);
  }, []);

  const toggleSidebar = useCallback(() => {
    setIsSidebarCollapsed((prev) => !prev);
  }, []);

  const markNotificationsAsRead = useCallback(async () => {
    await markAllNotificationsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const refreshNotifications = useCallback(async () => {
    const notifs = await getNotifications();
    setNotifications(notifs);
  }, []);

  const refreshCompetitors = useCallback(async () => {
    const comps = await getCompetitors();
    setCompetitors(comps);
  }, []);

  const refreshAll = useCallback(async () => {
    const [comps, notifs] = await Promise.all([
      getCompetitors(),
      getNotifications(),
    ]);
    setCompetitors(comps);
    setNotifications(notifs);
  }, []);

  const createCompetitor = useCallback(
    async (data: Omit<Competitor, "id" | "slug" | "history">) => {
      const created = await apiAddCompetitor(data);
      await refreshCompetitors();
      return created;
    },
    [refreshCompetitors]
  );

  const triggerScanSimulation = useCallback(
    async (selectedCompIds: string[]) => {
      setIsScanningActive(true);
      setScanProgress({
        step: 1,
        total: 5,
        label: "Collecting source snapshots...",
        completed: false,
        detectedChanges: 0,
        highImpactCount: 0,
        avgConfidence: 0,
      });

      const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

      await delay(700);
      setScanProgress((prev) => ({
        ...prev,
        step: 2,
        label: "Normalizing and stripping dynamic DOM tags...",
      }));

      await delay(700);
      setScanProgress((prev) => ({
        ...prev,
        step: 3,
        label: "Detecting semantic diffs & extracting pricing tables...",
      }));

      await delay(800);
      setScanProgress((prev) => ({
        ...prev,
        step: 4,
        label: "Scoring business significance & computing threat vectors...",
      }));

      await delay(700);
      setScanProgress((prev) => ({
        ...prev,
        step: 5,
        label: "Verifying cryptographic proof & DOM hashes...",
      }));

      await delay(600);
      setScanProgress({
        step: 5,
        total: 5,
        label: "Scan complete",
        completed: true,
        detectedChanges: Math.max(3, Math.min(selectedCompIds.length * 2, 7)),
        highImpactCount: 2,
        avgConfidence: 97.2,
      });
      setIsScanningActive(false);
      setLastScanText("Just now");
    },
    []
  );

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <AppContext.Provider
      value={{
        user,
        authReady,
        authError,
        clearAuthError,
        login,
        signup,
        logout,
        signOutAnimated,
        isSigningOut,
        continueAsGuest,
        theme,
        toggleTheme,
        setTheme,
        selectedEvidenceId,
        selectedEvidence,
        evidenceLoading,
        isEvidenceDrawerOpen,
        openEvidenceDrawer,
        closeEvidenceDrawer,
        isScanModalOpen,
        openScanModal: () => setIsScanModalOpen(true),
        closeScanModal: () => {
          setIsScanModalOpen(false);
          setIsScanningActive(false);
          setScanProgress({
            step: 0,
            total: 5,
            label: "Idle",
            completed: false,
            detectedChanges: 0,
            highImpactCount: 0,
            avgConfidence: 0,
          });
        },
        isAddCompetitorModalOpen,
        openAddCompetitorModal: () => setIsAddCompetitorModalOpen(true),
        closeAddCompetitorModal: () => setIsAddCompetitorModalOpen(false),
        isSearchModalOpen,
        openSearchModal: () => setIsSearchModalOpen(true),
        closeSearchModal: () => setIsSearchModalOpen(false),
        isShortcutsModalOpen,
        openShortcutsModal: () => setIsShortcutsModalOpen(true),
        closeShortcutsModal: () => setIsShortcutsModalOpen(false),
        isSidebarCollapsed,
        toggleSidebar,
        notifications,
        unreadCount,
        markNotificationsAsRead,
        refreshNotifications,
        refreshAll,
        competitors,
        refreshCompetitors,
        createCompetitor,
        isScanningActive,
        lastScanText,
        triggerScanSimulation,
        scanProgress,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
