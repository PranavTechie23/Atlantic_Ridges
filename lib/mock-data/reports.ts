import { IntelligenceReport } from "../types";

export const mockReports: IntelligenceReport[] = [
  {
    id: "rep-weekly-20261023",
    title: "Weekly Competitive Intelligence Brief",
    subtitle: "Consolidated market signals, pricing velocity, and AI capability shifts",
    date: "2026-10-23",
    period: "16 Oct – 23 Oct 2026",
    competitorCount: 12,
    changesCount: 27,
    highImpactCount: 8,
    confidenceAvg: 94.7,
    executiveSummary:
      "Competitive activity accelerated significantly across the enterprise software sector this week, driven primarily by an aggressive 30% price expansion from Acme Cloud and the commercial launch of NovaAI's autonomous Copilot v3. Competitors are aggressively bundling autonomous workflow capabilities to justify 20–30% higher subscription fees, while lower-tier developer platforms like Vertex Labs are tightening free quotas to curtail GPU and bandwidth overhead.",
    keyChanges: [
      {
        id: "kc-1",
        title: "Acme Cloud Pro Plan Increased by 30% (₹999 → ₹1,299/mo)",
        competitor: "Acme Cloud",
        impact: "HIGH",
        summary:
          "Adjusted baseline monthly pricing by ₹300 while bundling 500 workflow runs, testing willingness-to-pay after their workflow canvas rollout.",
        citationIndex: 1,
        evidenceId: "ev-acme-pricing-20261023",
      },
      {
        id: "kc-2",
        title: "NovaAI Copilot v3 Launched with Proactive Agent Supervision",
        competitor: "NovaAI",
        impact: "CRITICAL",
        summary:
          "Commercialized self-executing multi-agent operations across Salesforce, Jira, and Slack, shifting from reactive chat to autonomous execution.",
        citationIndex: 2,
        evidenceId: "ev-nova-launch-20261018",
      },
      {
        id: "kc-3",
        title: "OrbitCRM Bundled Unmetered API and Predictive Churn in Enterprise",
        competitor: "OrbitCRM",
        impact: "HIGH",
        summary:
          "Folded former ₹15,000/mo add-on module directly into standard Enterprise seats and removed rate limits to lock in mid-market data teams.",
        citationIndex: 3,
        evidenceId: "ev-orbit-features-20261012",
      },
      {
        id: "kc-4",
        title: "Vertex Labs Free Bandwidth Reduced by 50% with Hard Paywall",
        competitor: "Vertex Labs",
        impact: "MEDIUM",
        summary:
          "Cut free quota from 100GB to 50GB to limit infrastructure burn from hobbyists, sparking community migration discussions.",
        citationIndex: 4,
        evidenceId: "ev-vertex-pricing-20261016",
      },
      {
        id: "kc-5",
        title: "Acme Cloud Introduced Drag-and-Drop Workflow Canvas",
        competitor: "Acme Cloud",
        impact: "HIGH",
        summary:
          "Released visual orchestration canvas directly competing with standalone iPaaS workflow automation platforms.",
        citationIndex: 5,
        evidenceId: "ev-acme-workflows-20261022",
      },
    ],
    competitiveMovement: [
      {
        competitor: "Acme Cloud",
        shift: "Monetizing workflow automation with +30% price hike across core user base",
        impactScore: 82,
        direction: "offensive",
      },
      {
        competitor: "NovaAI",
        shift: "Establishing market leadership in autonomous multi-agent reasoning",
        impactScore: 92,
        direction: "offensive",
      },
      {
        competitor: "OrbitCRM",
        shift: "Strengthening enterprise retention through unmetered data pipelines",
        impactScore: 84,
        direction: "defensive",
      },
      {
        competitor: "Vertex Labs",
        shift: "Protecting margins by restricting non-paying developer bandwidth",
        impactScore: 76,
        direction: "defensive",
      },
      {
        competitor: "NexaSuite",
        shift: "Rebranding to Autonomous Operations OS backed by $28M Series B",
        impactScore: 81,
        direction: "pivot",
      },
    ],
    strategicImplications: [
      {
        title: "Immediate Pricing Headroom in Mid-Market SaaS",
        description:
          "Acme Cloud's price jump to ₹1,299/mo creates a 44% price delta compared to our ₹899 Growth plan. Our sales team should actively pitch Acme prospects on cost savings with identical automation capabilities.",
        citationIndices: [1, 5],
      },
      {
        title: "Customer Expectations Pivoting from Chatbots to Autonomous Agents",
        description:
          "NovaAI's launch of Copilot v3 represents a permanent paradigm shift in enterprise evaluation criteria. RFI/RFP requests over the next two quarters will demand proof of multi-step autonomous execution rather than standard text summaries.",
        citationIndices: [2],
      },
      {
        title: "Enterprise Retention Defense via API Unmetering",
        description:
          "OrbitCRM's removal of API caps illustrates how incumbents are using unmetered data piping to prevent developer churn to modern alternatives.",
        citationIndices: [3],
      },
      {
        title: "Hobbyist Developer Displacement and Inbound Migration Opportunity",
        description:
          "Vertex Labs' 50% bandwidth reduction and hard paywall has generated developer discontent across community forums, providing a prime window for customer acquisition.",
        citationIndices: [4],
      },
    ],
    recommendedActions: [
      {
        title: "Launch 'Switch from Acme' Price-Lock Campaign",
        priority: "CRITICAL",
        department: "Marketing",
        description:
          "Deploy targeted landing pages and search advertising guaranteeing a 2-year price lock at ₹899/mo for verified Acme Cloud migrations.",
      },
      {
        title: "Accelerate Autonomous Tool-Execution Beta",
        priority: "HIGH",
        department: "Product",
        description:
          "Fast-track our autonomous agent supervisor into private beta by mid-November to counter NovaAI's market narrative.",
      },
      {
        title: "Deploy 1-Click Vertex Migration Tool",
        priority: "MEDIUM",
        department: "Product",
        description:
          "Release a CLI script allowing Vertex developers to replicate their edge configurations to our platform in under 3 minutes.",
      },
      {
        title: "Reposition Enterprise Sales Collateral Around Auditability",
        priority: "HIGH",
        department: "Sales",
        description:
          "Equip AE teams with battlecards highlighting our deterministic audit log versus NovaAI's opaque agent decision-making.",
      },
    ],
    citations: {
      "1": {
        id: "cit-1",
        evidenceId: "ev-acme-pricing-20261023",
        label: "Acme Cloud Pricing Table (DOM snapshot #plan-pro-price)",
        snippet: "Pro Plan updated from ₹999/mo to ₹1,299/mo (+30.0%) with 500 workflow runs.",
      },
      "2": {
        id: "cit-2",
        evidenceId: "ev-nova-launch-20261018",
        label: "NovaAI Blog & Product Hunt Release Log",
        snippet: "General availability announcement of Copilot v3 autonomous supervisor.",
      },
      "3": {
        id: "cit-3",
        evidenceId: "ev-orbit-features-20261012",
        label: "OrbitCRM Enterprise Tier Specification Sheet",
        snippet: "API limits removed; predictive churn scoring included at zero additional cost.",
      },
      "4": {
        id: "cit-4",
        evidenceId: "ev-vertex-pricing-20261016",
        label: "Vertex Labs Fair Use Policy DOM Revision",
        snippet: "Free egress allowance reduced from 100GB to 50GB with hard cut-off.",
      },
      "5": {
        id: "cit-5",
        evidenceId: "ev-acme-workflows-20261022",
        label: "Acme Cloud Workflows Launch Announcement",
        snippet: "Visual drag-and-drop workflow canvas deployed to all Pro and Business tenants.",
      },
    },
  },
  {
    id: "rep-pricing-q3",
    title: "Q3 Pricing Shifts & Enterprise Elasticity Report",
    subtitle: "Analysis of 18 B2B pricing model updates and inflation pass-through",
    date: "2026-10-14",
    period: "Q3 2026 (Jul – Sep)",
    competitorCount: 16,
    changesCount: 42,
    highImpactCount: 14,
    confidenceAvg: 96.2,
    executiveSummary:
      "A comprehensive retrospective on how enterprise software providers adjusted list pricing, minimum seat commitments, and AI add-on surcharges throughout Q3 2026.",
    keyChanges: [],
    competitiveMovement: [],
    strategicImplications: [],
    recommendedActions: [],
    citations: {},
  },
  {
    id: "rep-ai-copilot",
    title: "AI Copilot Landscape & Agentic Automation Matrix",
    subtitle: "Comparative benchmark of 24 enterprise copilot architectures and security sandboxes",
    date: "2026-10-07",
    period: "September 2026",
    competitorCount: 24,
    changesCount: 58,
    highImpactCount: 19,
    confidenceAvg: 95.1,
    executiveSummary:
      "Evaluates the transition from prompt-based generative assistants to autonomous tool-using agents across CRM, ERP, and collaboration software.",
    keyChanges: [],
    competitiveMovement: [],
    strategicImplications: [],
    recommendedActions: [],
    citations: {},
  },
  {
    id: "rep-developer-edge",
    title: "Developer Tools & Edge Compute Dynamics",
    subtitle: "Tracking cloud egress changes, compute pricing wars, and serverless runtimes",
    date: "2026-09-28",
    period: "August – September 2026",
    competitorCount: 9,
    changesCount: 31,
    highImpactCount: 7,
    confidenceAvg: 93.8,
    executiveSummary:
      "Insights into how developer infrastructure players are balancing free-tier acquisition costs with rising GPU cluster expenses.",
    keyChanges: [],
    competitiveMovement: [],
    strategicImplications: [],
    recommendedActions: [],
    citations: {},
  },
  {
    id: "rep-compliance-trust",
    title: "Enterprise Compliance & Trust Velocity Benchmark",
    subtitle: "SOC 2, ISO 27001, and FedRAMP certification tracking across competitors",
    date: "2026-09-15",
    period: "Q3 2026",
    competitorCount: 12,
    changesCount: 18,
    highImpactCount: 4,
    confidenceAvg: 98.4,
    executiveSummary:
      "Tracks how fast challenger SaaS startups are securing enterprise compliance badges to clear institutional procurement hurdles.",
    keyChanges: [],
    competitiveMovement: [],
    strategicImplications: [],
    recommendedActions: [],
    citations: {},
  },
];
