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
  /** Server-verified account vs. local demo workspace */
  authSource?: "database" | "guest";
}

interface AppContextType {
  // Auth (Postgres + scrypt when DB available; guest workspace in localStorage)
  user: AuthUser | null;
  authReady: boolean;
  authError: string | null;
  clearAuthError: () => void;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (data: { name: string; email: string; password: string }) => Promise<boolean>;
  logout: () => void;
  /** Sign-out with the same animated feedback as sign-in */
  signOutAnimated: () => Promise<void>;
  clearSignOutOverlay: () => void;
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

  // PRYSM AI Chatbot Copilot
  isChatOpen: boolean;
  openChat: () => void;
  closeChat: () => void;
  toggleChat: () => void;
  chatInitialPrompt: string | null;
  openChatWithPrompt: (prompt: string) => void;
  clearChatInitialPrompt: () => void;

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
  authSource: "guest",
};

const GUEST_STORAGE_KEY = "prysm-auth-guest";

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
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInitialPrompt, setChatInitialPrompt] = useState<string | null>(null);
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

    (async () => {
      try {
        const res = await fetch("/api/auth/session", { credentials: "include" });
        if (res.ok) {
          const data = (await res.json()) as { user?: AuthUser };
          if (data.user) {
            setUser({ ...data.user, authSource: "database" });
            try {
              localStorage.removeItem(GUEST_STORAGE_KEY);
              localStorage.removeItem("prysm-auth-user");
            } catch {}
            setAuthReady(true);
            return;
          }
        }
      } catch {
        /* offline or DB down */
      }

      try {
        if (localStorage.getItem(GUEST_STORAGE_KEY) === "true") {
          setUser(GUEST_USER);
        } else {
          const legacy = localStorage.getItem("prysm-auth-user");
          if (legacy) {
            localStorage.removeItem("prysm-auth-user");
          }
        }
      } catch {
        /* no session */
      }
      setAuthReady(true);
    })();
  }, []);

  const persistGuest = useCallback((active: boolean) => {
    try {
      if (active) localStorage.setItem(GUEST_STORAGE_KEY, "true");
      else localStorage.removeItem(GUEST_STORAGE_KEY);
      localStorage.removeItem("prysm-auth-user");
    } catch {}
  }, []);

  const persistUser = useCallback(
    (next: AuthUser | null) => {
      setUser(next);
      if (next?.authSource === "guest") {
        persistGuest(true);
      } else if (!next) {
        persistGuest(false);
      }
    },
    [persistGuest]
  );

  const clearAuthError = useCallback(() => setAuthError(null), []);

  const login = useCallback(async (email: string, password: string) => {
    setAuthError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = (await res.json()) as { user?: AuthUser; error?: string };
      if (!res.ok) {
        setAuthError(data.error ?? "Sign in failed.");
        return false;
      }
      if (data.user) {
        persistGuest(false);
        setUser({ ...data.user, authSource: "database" });
      }
      return true;
    } catch {
      setAuthError("Network error. Check your connection and try again.");
      return false;
    }
  }, [persistGuest]);

  const signup = useCallback(
    async (data: { name: string; email: string; password: string }) => {
      setAuthError(null);
      try {
        const res = await fetch("/api/auth/signup", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        const body = (await res.json()) as { user?: AuthUser; error?: string };
        if (!res.ok) {
          setAuthError(body.error ?? "Sign up failed.");
          return false;
        }
        if (body.user) {
          persistGuest(false);
          setUser({ ...body.user, authSource: "database" });
        }
        return true;
      } catch {
        setAuthError("Network error. Check your connection and try again.");
        return false;
      }
    },
    [persistGuest]
  );

  const logout = useCallback(() => {
    void fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    persistUser(null);
    setAuthError(null);
  }, [persistUser]);

  const clearSignOutOverlay = useCallback(() => {
    setIsSigningOut(false);
  }, []);

  const signOutAnimated = useCallback(async () => {
    if (isSigningOut) return;
    setIsSigningOut(true);
    sounds.playTick();
    try {
      await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    } catch {
      /* proceed — local session still clears */
    }
    await new Promise<void>((resolve) => {
      window.setTimeout(resolve, SIGN_OUT_ANIMATION_MS);
    });
    persistUser(null);
    setAuthError(null);
  }, [isSigningOut, persistUser]);

  const continueAsGuest = useCallback(() => {
    void fetch("/api/auth/logout", { method: "POST", credentials: "include" });
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
      if ((e.metaKey || e.ctrlKey) && (e.key === "j" || e.key === "J")) {
        e.preventDefault();
        setIsChatOpen((prev) => !prev);
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
        setIsChatOpen(false);
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
        clearSignOutOverlay,
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
        isChatOpen,
        openChat: () => {
          setIsChatOpen(true);
        },
        closeChat: () => {
          setIsChatOpen(false);
          setChatInitialPrompt(null);
        },
        toggleChat: () => {
          setIsChatOpen((prev) => !prev);
        },
        chatInitialPrompt,
        openChatWithPrompt: (prompt: string) => {
          setChatInitialPrompt(prompt);
          setIsChatOpen(true);
        },
        clearChatInitialPrompt: () => setChatInitialPrompt(null),
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
