import { mockCompetitors } from "../mock-data/competitors";
import { mockChanges } from "../mock-data/changes";
import { mockEvidence } from "../mock-data/evidence";
import { mockReports } from "../mock-data/reports";
import { mockNotifications } from "../mock-data/notifications";
import {
  Competitor,
  ChangeItem,
  EvidenceItem,
  IntelligenceReport,
  NotificationItem,
  ChangeCategory,
  SeverityLevel,
} from "../types";

export interface ChangeFilterOptions {
  category?: ChangeCategory | "all";
  severity?: SeverityLevel | "all";
  competitorId?: string;
  timeframe?: "7D" | "30D" | "90D" | "all";
  search?: string;
}

export interface ThreatOverviewData {
  overallScore: number;
  threatLevel: SeverityLevel;
  pricingPressure: number;
  featureVelocity: number;
  aiCapability: number;
  launchActivity: number;
  monitoredCount: number;
  changesThisWeek: number;
  highImpactCount: number;
  avgConfidence: number;
}

export interface ScanSimulationStep {
  step: number;
  total: number;
  label: string;
  detail: string;
}

// In-memory clones to allow dynamic frontend actions (add competitor, notes, etc.)
let activeCompetitors: Competitor[] = [...mockCompetitors];
let activeChanges: ChangeItem[] = [...mockChanges];
let activeEvidence: EvidenceItem[] = [...mockEvidence];
let activeNotifications: NotificationItem[] = [...mockNotifications];

export async function getCompetitors(): Promise<Competitor[]> {
  await new Promise((r) => setTimeout(r, 50));
  return [...activeCompetitors];
}

export async function getCompetitor(idOrSlug: string): Promise<Competitor | null> {
  await new Promise((r) => setTimeout(r, 40));
  const found = activeCompetitors.find(
    (c) => c.id === idOrSlug || c.slug === idOrSlug
  );
  return found ? { ...found } : null;
}

export async function addCompetitor(newComp: Omit<Competitor, "id" | "slug" | "history">): Promise<Competitor> {
  await new Promise((r) => setTimeout(r, 120));
  const slug = newComp.name.toLowerCase().replace(/[^a-z0-9]/g, "-");
  const created: Competitor = {
    ...newComp,
    id: `comp-${Date.now()}`,
    slug,
    history: [
      { date: "2026-10-01", threatScore: Math.max(30, newComp.threatScore - 5) },
      { date: "2026-10-23", threatScore: newComp.threatScore },
    ],
  };
  activeCompetitors = [created, ...activeCompetitors];
  return created;
}

export async function getChanges(filters?: ChangeFilterOptions): Promise<ChangeItem[]> {
  await new Promise((r) => setTimeout(r, 50));
  let list = [...activeChanges];

  if (filters?.category && filters.category !== "all") {
    list = list.filter((c) => c.category === filters.category);
  }
  if (filters?.severity && filters.severity !== "all") {
    list = list.filter((c) => c.severity === filters.severity);
  }
  if (filters?.competitorId) {
    list = list.filter((c) => c.competitorId === filters.competitorId);
  }
  if (filters?.search) {
    const q = filters.search.toLowerCase();
    list = list.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.summary.toLowerCase().includes(q) ||
        c.competitorName.toLowerCase().includes(q)
    );
  }
  return list;
}

export async function getChange(id: string): Promise<ChangeItem | null> {
  await new Promise((r) => setTimeout(r, 40));
  const item = activeChanges.find((c) => c.id === id);
  return item ? { ...item } : null;
}

export async function getEvidenceList(competitorId?: string): Promise<EvidenceItem[]> {
  await new Promise((r) => setTimeout(r, 50));
  if (competitorId) {
    return activeEvidence.filter((e) => e.competitorId === competitorId);
  }
  return [...activeEvidence];
}

export async function getEvidence(id: string): Promise<EvidenceItem | null> {
  await new Promise((r) => setTimeout(r, 280));
  const item = activeEvidence.find((e) => e.id === id);
  return item ? { ...item } : null;
}

export async function addEvidenceNote(evidenceId: string, noteText: string): Promise<EvidenceItem | null> {
  await new Promise((r) => setTimeout(r, 100));
  const item = activeEvidence.find((e) => e.id === evidenceId);
  if (!item) return null;
  item.userNotes = [...(item.userNotes || []), noteText];
  return { ...item };
}

export async function getReports(): Promise<IntelligenceReport[]> {
  await new Promise((r) => setTimeout(r, 50));
  return [...mockReports];
}

export async function getReport(id: string): Promise<IntelligenceReport | null> {
  await new Promise((r) => setTimeout(r, 40));
  const rep = mockReports.find((r) => r.id === id);
  return rep ? { ...rep } : null;
}

export async function getThreatOverview(): Promise<ThreatOverviewData> {
  await new Promise((r) => setTimeout(r, 40));
  return {
    overallScore: 82,
    threatLevel: "HIGH",
    pricingPressure: 78,
    featureVelocity: 91,
    aiCapability: 88,
    launchActivity: 74,
    monitoredCount: 12,
    changesThisWeek: 27,
    highImpactCount: 8,
    avgConfidence: 94.7,
  };
}

export async function getNotifications(): Promise<NotificationItem[]> {
  await new Promise((r) => setTimeout(r, 30));
  return [...activeNotifications];
}

export async function markAllNotificationsRead(): Promise<void> {
  await new Promise((r) => setTimeout(r, 40));
  activeNotifications = activeNotifications.map((n) => ({ ...n, read: true }));
}

export interface SimulationResult {
  change: ChangeItem;
  evidence: EvidenceItem;
  notification: NotificationItem;
  report: IntelligenceReport;
  updatedCompetitor: Competitor;
}

export async function injectSimulatedChange(payload: {
  competitorId: string;
  category: ChangeCategory;
  title: string;
  summary: string;
  beforeContent: string;
  afterContent: string;
  significanceScore: number;
  severity: SeverityLevel;
  sourceUrl: string;
  whyItMatters: string;
}): Promise<SimulationResult> {
  await new Promise((r) => setTimeout(r, 300));
  const timestamp = new Date().toISOString();
  const dateFormatted = timestamp.slice(0, 10);
  const targetComp = activeCompetitors.find((c) => c.id === payload.competitorId) || activeCompetitors[0];

  const changeId = `ch-sim-${Date.now()}`;
  const evidenceId = `ev-sim-${Date.now()}`;
  const reportId = `rep-sim-${Date.now()}`;

  // Simple pseudo SHA-256 for browser demo verification
  const rawHash = Array.from(`${payload.afterContent}-${timestamp}`)
    .reduce((acc, char) => (acc * 31 + char.charCodeAt(0)) >>> 0, 0)
    .toString(16)
    .padStart(8, "0");
  const hashDigest = `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b785${rawHash}`;

  const newChange: ChangeItem = {
    id: changeId,
    competitorId: targetComp.id,
    competitorName: targetComp.name,
    category: payload.category,
    title: payload.title,
    summary: payload.summary,
    significanceScore: payload.significanceScore,
    severity: payload.severity,
    detectedAt: timestamp,
    confidence: 98,
    evidenceId: evidenceId,
    beforeState: payload.beforeContent.slice(0, 120),
    afterState: payload.afterContent.slice(0, 120),
    whyItMatters: payload.whyItMatters,
  };

  const newEvidence: EvidenceItem = {
    id: evidenceId,
    changeId: changeId,
    competitorId: targetComp.id,
    competitorName: targetComp.name,
    title: payload.title,
    category: payload.category,
    severity: payload.severity,
    confidence: 98,
    observedCurrentDate: dateFormatted,
    observedPreviousDate: "2026-10-20",
    sourceUrl: payload.sourceUrl,
    sourceTitle: `${targetComp.name} Official Public Source`,
    detectionMethod: "Normalized DOM Tree AST Diff + Wayback CDX Verification",
    verificationStatus: "verified",
    hashDigest: hashDigest,
    beforeContent: payload.beforeContent,
    afterContent: payload.afterContent,
    rawExcerpt: `Verified snapshot (${dateFormatted}): ${payload.afterContent.replace(/\s+/g, " ").slice(0, 220)}… Digest: ${hashDigest.slice(0, 18)}…`,
    strategicImplication: payload.whyItMatters,
    userNotes: ["Auto-captured during Hacknova Live Demo Simulation."],
  };

  const newNotification: NotificationItem = {
    id: `notif-sim-${Date.now()}`,
    title: `[${payload.severity}] ${targetComp.name}: ${payload.title}`,
    description: payload.summary,
    time: "Just now",
    severity: payload.severity,
    competitor: targetComp.name,
    read: false,
    evidenceId: evidenceId,
  };

  const newReport: IntelligenceReport = {
    id: reportId,
    title: `Target Intelligence Brief: ${targetComp.name} Strategic Update`,
    subtitle: `Evidence-linked verification of recent competitor movement detected on ${dateFormatted}`,
    date: dateFormatted,
    period: "24-Hour Surveillance Window",
    competitorCount: 1,
    changesCount: 1,
    highImpactCount: 1,
    confidenceAvg: 98.4,
    executiveSummary: `Automated surveillance detected an immediate ${payload.severity.toLowerCase()} shift by ${targetComp.name} in ${payload.category}. Verified telemetry confirms: "${payload.summary}". All claims are anchored to cryptographic DOM digest ${hashDigest.slice(0, 12)}...`,
    keyChanges: [
      {
        id: `kc-sim-${Date.now()}`,
        title: payload.title,
        competitor: targetComp.name,
        impact: payload.severity,
        summary: payload.summary,
        citationIndex: 1,
        evidenceId: evidenceId,
      },
    ],
    competitiveMovement: [
      {
        competitor: targetComp.name,
        shift: payload.summary,
        impactScore: payload.significanceScore,
        direction: payload.severity === "CRITICAL" ? "offensive" : "pivot",
      },
    ],
    strategicImplications: [
      {
        title: "Immediate Market Repositioning",
        description: payload.whyItMatters,
        citationIndices: [1],
      },
    ],
    recommendedActions: [
      {
        title: `Counter-${payload.category} Strategic Review`,
        priority: payload.severity === "LOW" ? "MEDIUM" : payload.severity,
        department: payload.category === "pricing" ? "Sales" : "Product",
        description: `Convene cross-functional strategy taskforce to assess counter-maneuvers against ${targetComp.name}.`,
      },
    ],
    citations: {
      "1": {
        id: "cit-sim-1",
        evidenceId: evidenceId,
        label: `${targetComp.name} ${payload.category.toUpperCase()} Shift`,
        snippet: payload.afterContent.slice(0, 140),
      },
    },
  };

  // Update in-memory state
  activeChanges = [newChange, ...activeChanges];
  activeEvidence = [newEvidence, ...activeEvidence];
  activeNotifications = [newNotification, ...activeNotifications];
  mockReports.unshift(newReport);

  // Update target competitor's threat score and latest change
  const updatedComp: Competitor = {
    ...targetComp,
    threatScore: Math.min(99, targetComp.threatScore + (payload.severity === "CRITICAL" ? 6 : 3)),
    latestChange: {
      title: payload.title,
      category: payload.category,
      date: timestamp,
      impact: payload.severity,
      evidenceId: evidenceId,
    },
    lastScanTime: "Just now",
  };

  activeCompetitors = activeCompetitors.map((c) =>
    c.id === updatedComp.id ? updatedComp : c
  );

  return {
    change: newChange,
    evidence: newEvidence,
    notification: newNotification,
    report: newReport,
    updatedCompetitor: updatedComp,
  };
}
