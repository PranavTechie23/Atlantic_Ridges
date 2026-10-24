/**
 * PRYSM AI Knowledge Base & Fallback Reasoning Engine
 * Powers both the strict LLM system prompts and the zero-key built-in intelligence engine.
 */

import { mockCompetitors } from "../mock-data/competitors";
import { mockChanges } from "../mock-data/changes";
import { mockEvidence } from "../mock-data/evidence";
import { mockReports } from "../mock-data/reports";
import { validateDomainRelevance, STRICT_GUARDRAIL_REFUSAL_MESSAGE } from "./guardrail";

export const PRYSM_SYSTEM_PROMPT = `You are PRYSM AI — the dedicated Executive Competitive Intelligence Copilot for the PRYSM Platform (Event: HACKNOVA '26, Track: Competitor Intelligence & Automated Market Sensing).

### 🚨 ABSOLUTE ZERO-TOLERANCE GUARDRAIL (CRITICAL):
1. YOU MUST NEVER PROVIDE "OUTER INFORMATION".
2. Outer information includes: general world knowledge, history, world capitals, sports, athletes, recipes, food, celebrity gossip, movies, unrelated coding algorithms (like leetcode or web development unrelated to PRYSM), poems, jokes, weather, or creative writing.
3. If the user asks ANY question outside of PRYSM, competitor intelligence, monitored competitors, pricing shifts, AST diffing, cryptographic evidence, War Room simulations, or ethical crawling compliance:
   YOU MUST IMMEDIATELY AND POLITELY REFUSE WITH THIS EXACT MESSAGE:
   "🔒 Scope Guard Notice: I am strictly specialized as PRYSM's Competitive Intelligence Agent. My system instructions forbid answering general world knowledge, outer topics, or unrelated inquiries. I am strictly grounded in PRYSM's monitored competitors, evidence ledger, AST diff pipeline, and platform capabilities. How can I help you analyze competitors or market intelligence today?"
4. Do NOT attempt to answer a piece of the outside question before refusing. Refuse directly.

### 🎯 YOUR SPECIALIZED DOMAIN & CORE THESIS:
"If PRYSM cannot point to a verified source URL, timestamp, and SHA-256 content hash for a statement, that statement does not appear in an executive report."

### 🏛️ SYSTEM ARCHITECTURE & FACT BASE:
1. **Core Competitors Under Active Radar:**
${mockCompetitors.map((c) => `   - **${c.name}** (Threat Score: ${c.threatScore}/100 [${c.threatLevel}], Category: ${c.category}): Latest change: "${c.latestChange?.title}" (${c.latestChange?.impact} impact).`).join("\n")}

2. **AST Diff Engine & Noise Suppression:**
   - Normalizes raw HTML into Abstract Syntax Trees before diffing.
   - Filters out 95% of web noise: dynamic CSRF tokens, rotating testimonials, cookie banners, analytics pixels, timestamps.
   - Mathematical Significance Scoring: Computes S = w_p * ΔP + w_f * ΔF + w_c * ΔC + w_v * V_t. Only changes scoring >= 65 trigger high-severity alerts.

3. **Cryptographic Evidence Ledger:**
   - Every raw DOM snapshot is hashed with salted SHA-256 (Salt: 'prysm-sha256-evidence-audit-salt-2026').
   - Links changes to immutable evidence items (e.g. [ev-acme-pricing-20261023], [ev-nova-launch-20261018]).
   - Executive Briefs feature clickable numbered citations [1], [2] opening the slide-over Evidence Drawer.

4. **Strategic War Room & ARR Simulation:**
   - Simulates revenue loss if competitor makes an aggressive price move or AI release.
   - Provides win-rate impact projections and recommended counter-campaign playbooks.

5. **Permitted Crawling & RFC 9309 Compliance:**
   - Strictly respects robots.txt.
   - Implements polite 2000ms delay between consecutive requests.
   - Custom User Agent: 'PRYSM-Intelligence-Bot/1.0 (+https://prysm.intel/compliance; ethical research)'.
   - Integrates Internet Archive Wayback Machine CDX API to reconstruct historical pricing back to 2024 without abusive scraping.

### 💬 RESPONSE GUIDELINES:
- Be concise, analytical, and authoritative like an elite corporate strategy & intelligence director.
- Format with clean Markdown, bullet points, and bold text.
- Include evidence citations whenever stating numbers (e.g., "[Evidence: ev-acme-pricing-20261023]").
- Keep answers tightly focused on PRYSM data and market intelligence.
`;

/**
 * Built-in High-Fidelity Knowledge Engine (Runs locally without requiring an API key)
 */
export function generateLocalVaultResponse(prompt: string): string {
  const guard = validateDomainRelevance(prompt);
  if (!guard.isAllowed) {
    return STRICT_GUARDRAIL_REFUSAL_MESSAGE;
  }

  const p = prompt.toLowerCase();

  // 1. Acme Cloud pricing hike
  if (p.includes("acme") && (p.includes("price") || p.includes("pricing") || p.includes("hike") || p.includes("30%"))) {
    return `### 📊 Acme Cloud Pricing Mutation Analysis

PRYSM detected an executive-level pricing increase on **Acme Cloud** on **October 23, 2026 at 09:45 UTC**:

- **Target Plan:** Pro Tier
- **Old Price:** ₹999 / month
- **New Price:** **₹1,299 / month (+30.0%)**
- **New Feature Added:** \`500 Automated Workflow Runs / mo\`
- **Significance Score:** **88/100 (HIGH IMPACT)**
- **Cryptographic Hash:** \`sha256:4f89a910ecb29381c818f9104882bcde7102eac694f6e\`
- **Evidence Verification:** Verified in **[Evidence Vault: ev-acme-pricing-20261023]**

#### Strategic Recommendation:
Acme is testing price elasticity following their workflow builder release. Their Pro plan is now **44% more expensive than our starter tier (₹899)**. We recommend immediately launching a targeted Google Ad campaign on *"Acme Cloud alternative"* with our price-lock guarantee.`;
  }

  // 2. NovaAI
  if (p.includes("nova") || p.includes("copilot")) {
    const nova = mockCompetitors.find((c) => c.slug === "nova-ai");
    return `### ⚡ NovaAI Threat Intelligence Profile

- **Current Threat Score:** **${nova?.threatScore ?? 92}/100 (${nova?.threatLevel ?? "CRITICAL"})** — Trend: ▲ +9 pts this month.
- **Core Capability:** Autonomous market reasoning & generative ops.
- **Key Metrics:**
  - Feature Velocity: **96/100**
  - AI Capability: **97/100**
  - Launch Activity: **92/100**
- **Latest Detected Move:** *New AI Copilot launched with self-executing workflows* (Observed Oct 18, 2026).
- **Evidence ID:** \`ev-nova-launch-20261018\` (\`sha256:9a32c0...418\`)

#### Risk Assessment:
NovaAI represents our highest technical threat. Their autonomous agent workflows directly challenge our mid-market retention. Recommendation: Accelerate PRYSM agentic workflows and emphasize verified cryptographic evidence integrity where NovaAI hallucinations occur.`;
  }

  // 3. AST Diff Engine
  if (p.includes("ast") || p.includes("diff") || p.includes("noise") || p.includes("nonce")) {
    return `### ⚙️ PRYSM Normalized AST Diff Engine

Traditional line-by-line git diffing produces over **95% false positives** due to web noise. PRYSM solves this through a multi-stage AST pipeline:

1. **DOM Extraction & Normalization:**
   - Parses raw HTML into an Abstract Syntax Tree using structured DOM traversal.
   - Strips dynamic nonces, session cookies, CSRF tokens, and Google Tag Manager pixels.
2. **Noise Suppression Filters:**
   - Ignores rotating testimonials, dynamic copyright dates (\`2024 -> 2026\`), and personalized user banners.
3. **Structured Entity Extraction:**
   - Isolates pricing cards (\`.plan-card\`, \`[data-pricing]\`), feature checklists, and navigation headers.
4. **Mathematical Significance Scoring ($S$):**
   $$S = w_p \\cdot \\Delta P + w_f \\cdot \\Delta F + w_c \\cdot \\Delta C + w_v \\cdot V_t$$
   - Changes scoring $\\ge 65$ are classified as **HIGH/CRITICAL** and pushed to executive alert channels.

*Inspect the live diff visualizer at [/diff-engine](/diff-engine)!*`;
  }

  // 4. Evidence Ledger & SHA-256 Hashing
  if (p.includes("evidence") || p.includes("hash") || p.includes("sha") || p.includes("ledger") || p.includes("cryptograph")) {
    return `### 🛡️ Cryptographic Evidence Vault & Merkle Integrity

PRYSM adheres to our core principle: **"No claim without cryptographic provenance."**

- **Payload Hashing:** Every ingested DOM snapshot is hashed with salted SHA-256 (\`prysm-sha256-evidence-audit-salt-2026\`).
- **Audit Verification:** The hash digest guarantees that competitor pricing screenshots or DOM excerpts have not been tampered with or synthesized.
- **Total Verified Evidence Records:** ${mockEvidence.length} active forensic evidence items in PostgreSQL 18+ vault.
- **Wayback Machine Integration:** Historical baselines are backlinked to Internet Archive CDX timestamps for permanent legal reproducibility.

*You can open any evidence item by clicking on citations in executive briefs or browsing [/evidence](/evidence).*`;
  }

  // 5. War Room & ARR Simulation
  if (p.includes("war room") || p.includes("arr") || p.includes("simulation") || p.includes("scenario") || p.includes("churn")) {
    return `### ⚔️ PRYSM Strategic War Room & ARR Risk Simulator

The **War Room** (\`/war-room\`) enables product leaders to simulate competitive market shocks before they impact revenue:

- **Scenario 1: Competitor Price Undercut (-20%)**
  - Simulated Churn Risk: **3.8% ARR exposure** (~₹1.18 crore ARR).
  - Recommended Defense: Deploy feature parity battlecard and offer annual prepayment discount.
- **Scenario 2: NovaAI Killer Feature Parity Launch**
  - Simulated Enterprise Win-Rate Impact: **-12% decrease**.
  - Recommended Counter-Measure: Emphasize PRYSM SOC 2 compliance, auditability, and SHA-256 evidence verification.

*Test scenarios live in the interactive sandbox at [/war-room](/war-room).*`;
  }

  // 6. RFC 9309 & Ethical Crawling
  if (p.includes("rfc") || p.includes("robot") || p.includes("crawl") || p.includes("ethical") || p.includes("wayback") || p.includes("cdx")) {
    return `### 🌐 Ethical Ingestion & RFC 9309 Compliance

PRYSM operates with strict ethical compliance:

- **RFC 9309 Standard:** We parse and strictly honor \`robots.txt\` directives on all monitored domains. Disallowed paths (e.g. \`/admin\`, \`/app\`, \`/private\`) are never crawled.
- **Politeness Delay:** Enforces a mandatory **2,000ms delay** between requests to prevent server strain.
- **User Agent:** \`PRYSM-Intelligence-Bot/1.0 (+https://prysm.intel/compliance; ethical research)\`
- **Zero Headless Session Spoofing:** We only observe publicly visible pricing tables, changelogs, and press releases.
- **Wayback CDX API:** Leverages Internet Archive's public CDX API for historical timeline comparison.`;
  }

  // 7. General Competitor Overview
  if (p.includes("competitor") || p.includes("overview") || p.includes("radar") || p.includes("summary")) {
    return `### 📡 PRYSM Monitored Competitor Radar Overview

We are currently tracking **${mockCompetitors.length} primary competitors** across 6 market sectors:

${mockCompetitors
  .map(
    (c) =>
      `• **${c.name}** — Threat: **${c.threatScore}/100** [${c.threatLevel}] | Focus: *${c.tagline}* | Latest: *${c.latestChange?.title}*`
  )
  .join("\n")}

**Key Insight:** Pricing pressure has increased by **+18%** this quarter, led by Acme Cloud's Pro tier hike and NovaAI's autonomous copilot rollout.

*Ask me about any specific competitor for deep metric breakdowns and battlecards!*`;
  }

  // Default PRYSM response
  return `### 👁️ PRYSM Intelligence Agent Ready

I am grounded in PRYSM's verified competitor data, evidence ledger, and AST diff pipeline.

**Here is what you can ask me right now:**
1. *"Analyze Acme Cloud's +30% price hike and recommended counter-strategy."*
2. *"Compare NovaAI vs Acme Cloud threat scores and velocity."*
3. *"How does the AST Diff Engine filter out cosmetic web noise?"*
4. *"Show the SHA-256 cryptographic evidence record for [ev-acme-pricing-20261023]."*
5. *"What does the War Room ARR simulation predict if NovaAI cuts pricing?"*
6. *"How does PRYSM comply with RFC 9309 robots.txt standards?"*

*(Note: My domain guardrail is active to guarantee zero external information leakage).*`;
}
