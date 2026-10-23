export type ChangeCategory =
  | "pricing"
  | "features"
  | "launch"
  | "positioning"
  | "announcements";

export type SeverityLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export interface CompetitorMetrics {
  pricingPressure: number;
  featureVelocity: number;
  aiCapability: number;
  launchActivity: number;
  integrations: number;
  analytics: number;
  automation: number;
  marketPosition: number;
}

export interface CompetitorPlanPricing {
  name: string;
  priceCurrent: number;
  pricePrevious: number;
  currency: "INR" | "USD";
  billingCycle: string;
  changeDeltaPercent: number;
  observedDate: string;
  sourceUrl: string;
  popular?: boolean;
}

export interface CompetitorFeatureItem {
  name: string;
  category: string;
  status: "AVAILABLE" | "UNAVAILABLE" | "NEW" | "UPDATED";
  note?: string;
  lastUpdated?: string;
}

export interface CompetitorPositioning {
  currentClaim: string;
  previousClaim: string;
  detectedShift: string;
  confidence: number;
  detectedDate: string;
  toneShift: string;
}

export interface CompetitorAnnouncement {
  id: string;
  title: string;
  date: string;
  type: "Blog" | "Press Release" | "Release Notes" | "Product Hunt";
  url: string;
  summary: string;
  impactScore: number;
}

export interface Competitor {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  category: string;
  website: string;
  logoText: string;
  threatScore: number;
  threatLevel: SeverityLevel;
  trend: "up" | "down" | "stable";
  trendDelta: number;
  metrics: CompetitorMetrics;
  latestChange: {
    title: string;
    category: ChangeCategory;
    date: string;
    impact: SeverityLevel;
    evidenceId: string;
  };
  lastScanTime: string;
  monitoringStatus: "active" | "paused" | "degraded";
  history: { date: string; threatScore: number }[];
  plans?: CompetitorPlanPricing[];
  features?: CompetitorFeatureItem[];
  positioning?: CompetitorPositioning;
  announcements?: CompetitorAnnouncement[];
}

export interface ChangeItem {
  id: string;
  competitorId: string;
  competitorName: string;
  category: ChangeCategory;
  title: string;
  summary: string;
  significanceScore: number;
  severity: SeverityLevel;
  detectedAt: string;
  confidence: number;
  evidenceId: string;
  beforeState?: string;
  afterState?: string;
  changeDelta?: string;
  whyItMatters: string;
}

export interface EvidenceItem {
  id: string;
  changeId: string;
  competitorId: string;
  competitorName: string;
  title: string;
  category: ChangeCategory;
  severity: SeverityLevel;
  confidence: number;
  observedCurrentDate: string;
  observedPreviousDate: string;
  sourceUrl: string;
  sourceTitle: string;
  detectionMethod: string;
  verificationStatus: "verified" | "pending" | "flagged";
  hashDigest: string;
  beforeContent: string;
  afterContent: string;
  rawExcerpt: string;
  strategicImplication: string;
  recommendedAction?: string;
  userNotes?: string[];
}

export interface ReportCitation {
  id: string;
  evidenceId: string;
  label: string;
  snippet: string;
}

export interface IntelligenceReport {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  period: string;
  competitorCount: number;
  changesCount: number;
  highImpactCount: number;
  confidenceAvg: number;
  executiveSummary: string;
  keyChanges: {
    id: string;
    title: string;
    competitor: string;
    impact: SeverityLevel;
    summary: string;
    citationIndex: number;
    evidenceId: string;
  }[];
  competitiveMovement: {
    competitor: string;
    shift: string;
    impactScore: number;
    direction: "offensive" | "defensive" | "pivot";
  }[];
  strategicImplications: {
    title: string;
    description: string;
    citationIndices: number[];
  }[];
  recommendedActions: {
    title: string;
    priority: "HIGH" | "MEDIUM" | "CRITICAL";
    department: "Product" | "Sales" | "Executive" | "Marketing";
    description: string;
  }[];
  citations: Record<string, ReportCitation>;
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  severity: SeverityLevel;
  competitor: string;
  read: boolean;
  evidenceId?: string;
}
