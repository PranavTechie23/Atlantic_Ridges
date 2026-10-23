import { EvidenceItem } from "../types";

export const mockEvidence: EvidenceItem[] = [
  {
    id: "ev-acme-pricing-20261023",
    changeId: "ch-acme-01",
    competitorId: "comp-acme",
    competitorName: "Acme Cloud",
    title: "Pro Plan price increased from ₹999 to ₹1,299 / month",
    category: "pricing",
    severity: "HIGH",
    confidence: 97,
    observedCurrentDate: "2026-10-23T09:45:00Z",
    observedPreviousDate: "2026-10-22T18:00:00Z",
    sourceUrl: "https://acmecloud.io/pricing",
    sourceTitle: "Acme Cloud Plans & Pricing Table (HTML DOM Element: #plan-pro-price)",
    detectionMethod: "Structured price extraction & DOM subtree diffing",
    verificationStatus: "verified",
    hashDigest: "sha256:4f89a910ecb29381c818f9104882bcde7102eac694f6e",
    beforeContent: `<div class="plan-card" id="plan-pro">
  <h3 class="plan-title">Pro Plan</h3>
  <div class="price-wrapper">
    <span class="currency">₹</span>
    <span class="amount">999</span>
    <span class="period">/ month</span>
  </div>
  <p class="billing-note">Billed monthly or ₹849 billed annually</p>
  <ul class="features">
    <li>5 Team Seats included</li>
    <li>Unlimited storage</li>
    <li>Standard integrations</li>
  </ul>
</div>`,
    afterContent: `<div class="plan-card" id="plan-pro">
  <h3 class="plan-title">Pro Plan</h3>
  <div class="price-wrapper">
    <span class="currency">₹</span>
    <span class="amount">1,299</span>
    <span class="period">/ month</span>
  </div>
  <p class="billing-note">Billed monthly or ₹1,099 billed annually</p>
  <ul class="features">
    <li>5 Team Seats included</li>
    <li>Unlimited storage</li>
    <li>500 Automated Workflow Runs / mo <span class="badge">NEW</span></li>
    <li>Standard integrations</li>
  </ul>
</div>`,
    rawExcerpt: "Pro Plan price changed from ₹999/mo to ₹1,299/mo (+30%). New feature badge added: '500 Automated Workflow Runs / mo'.",
    strategicImplication: "Acme is leveraging the launch of their workflow canvas to test pricing elasticity. Their Pro plan is now 44% more expensive than our starter tier (₹899). We can capture churned users by running targeted Google Search ads on 'Acme Cloud alternative'.",
    recommendedAction: "Launch comparison landing page highlighting our ₹899 price lock and zero-code workflow automations.",
    userNotes: [
      "Verified on mobile Safari and desktop Chrome. No regional A/B test detected — change is global.",
    ],
  },
  {
    id: "ev-nova-launch-20261018",
    changeId: "ch-nova-01",
    competitorId: "comp-nova",
    competitorName: "NovaAI",
    title: "Nova Copilot v3 launched with autonomous agent supervisor",
    category: "launch",
    severity: "CRITICAL",
    confidence: 98,
    observedCurrentDate: "2026-10-18T14:15:00Z",
    observedPreviousDate: "2026-10-17T21:00:00Z",
    sourceUrl: "https://nova-ai.systems/blog/nova-copilot-v3",
    sourceTitle: "NovaAI Official Blog: Introducing Copilot v3 with Proactive Agents",
    detectionMethod: "NLP release parser & semantic entity extraction",
    verificationStatus: "verified",
    hashDigest: "sha256:7bc330198aaef4919020302bcf927492cfa710",
    beforeContent: `<meta name="description" content="Nova AI: The generative assistant that drafts emails and summarizes meeting transcripts." />
<h1 class="hero-title">Your team's AI writing partner</h1>`,
    afterContent: `<meta name="description" content="Nova Copilot v3: Proactive enterprise agent supervisor that plans, executes, and confirms multi-system operational tasks." />
<h1 class="hero-title">Autonomous execution for enterprise workflows</h1>`,
    rawExcerpt: "Today we are releasing Nova Copilot v3. Unlike passive chatbots that wait for prompts, Copilot v3 monitors webhooks and autonomously executes workflows across Salesforce, Jira, and Slack without human intervention.",
    strategicImplication: "NovaAI is shifting category perception from basic LLM prompt wrappers into full Agentic Process Automation (APA). This will appeal heavily to enterprise buyers looking to cut operational headcount.",
    recommendedAction: "Accelerate our Q4 autonomous actions roadmap and highlight our deterministic audit trail in contrast to Nova's black-box agents.",
    userNotes: [
      "Product Hunt launch reached #1 with 1,840 upvotes. Multiple enterprise beta logos featured (Stripe, Datadog alumni).",
    ],
  },
  {
    id: "ev-orbit-features-20261012",
    changeId: "ch-orbit-01",
    competitorId: "comp-orbit",
    competitorName: "OrbitCRM",
    title: "Enterprise tier bundled with unmetered API & predictive churn scoring",
    category: "features",
    severity: "HIGH",
    confidence: 94,
    observedCurrentDate: "2026-10-12T11:20:00Z",
    observedPreviousDate: "2026-10-11T12:00:00Z",
    sourceUrl: "https://orbitcrm.com/pricing",
    sourceTitle: "OrbitCRM Enterprise Tier Specification Table",
    detectionMethod: "DOM feature matrix diffing & structured token analysis",
    verificationStatus: "verified",
    hashDigest: "sha256:8892ca019fe8290bcdae6102874bb1a293817",
    beforeContent: `<tr>
  <td>API Daily Limit</td>
  <td>50,000 requests / day (Overages: ₹50 per 10k)</td>
</tr>
<tr>
  <td>Predictive Churn Scoring</td>
  <td>Add-on module (₹15,000 / month)</td>
</tr>`,
    afterContent: `<tr>
  <td>API Daily Limit</td>
  <td><strong>Unmetered streaming access</strong> (No overage fees)</td>
</tr>
<tr>
  <td>Predictive Churn Scoring</td>
  <td><strong>Included native in Enterprise</strong></td>
</tr>`,
    rawExcerpt: "OrbitCRM removed the ₹15,000/mo add-on fee for Predictive Churn and replaced the 50,000 request API cap with unmetered access for Enterprise clients.",
    strategicImplication: "Orbit is protecting its large accounts against modern data stack alternatives by eliminating friction points in API billing.",
    recommendedAction: "Audit our API pricing tier to ensure our webhook quotas remain competitive for developers.",
    userNotes: [],
  },
  {
    id: "ev-vertex-pricing-20261016",
    changeId: "ch-vertex-01",
    competitorId: "comp-vertex",
    competitorName: "Vertex Labs",
    title: "Free tier bandwidth reduced from 100GB to 50GB",
    category: "pricing",
    severity: "MEDIUM",
    confidence: 92,
    observedCurrentDate: "2026-10-16T16:00:00Z",
    observedPreviousDate: "2026-10-15T09:00:00Z",
    sourceUrl: "https://vertexlabs.dev/pricing",
    sourceTitle: "Vertex Labs Terms & Tier Allowances",
    detectionMethod: "DOM numeric regex extractor",
    verificationStatus: "verified",
    hashDigest: "sha256:590219caec8198f219018471bdcca7291a271",
    beforeContent: `<div class="tier-limits">
  <span>Free Bandwidth: 100 GB / month</span>
  <span>Soft throttle at threshold</span>
</div>`,
    afterContent: `<div class="tier-limits">
  <span>Free Bandwidth: 50 GB / month</span>
  <span class="warning">Hard cut-off requiring Pro upgrade</span>
</div>`,
    rawExcerpt: "Vertex Labs halved the free hobby quota to 50GB and instituted a hard cut-off wall.",
    strategicImplication: "Developer backlash noted on Hacker News (240 comments). Developers are actively looking for alternative edge hosting platforms.",
    recommendedAction: "Publish an instant migration guide for Vertex Labs developers with 1-click import.",
    userNotes: ["HN thread link archived in internal knowledge base."],
  },
  {
    id: "ev-pulse-features-20261015",
    changeId: "ch-pulse-01",
    competitorId: "comp-pulse",
    competitorName: "PulseDesk",
    title: "Multilingual ticket sentiment analysis launched",
    category: "features",
    severity: "MEDIUM",
    confidence: 89,
    observedCurrentDate: "2026-10-15T08:30:00Z",
    observedPreviousDate: "2026-10-14T10:00:00Z",
    sourceUrl: "https://pulsedesk.app/features/sentiment",
    sourceTitle: "PulseDesk Global Sentiment Release",
    detectionMethod: "Web crawler & DOM semantic analysis",
    verificationStatus: "verified",
    hashDigest: "sha256:1900287aedb7289190aaecf00129759283917",
    beforeContent: `<div class="feature-overview">Keyword tagging and manual priority flagging.</div>`,
    afterContent: `<div class="feature-overview">Real-time emotional sentiment scoring in 24 languages with instant manager alerts.</div>`,
    rawExcerpt: "Automatically scores customer frustration level 1-100 across 24 languages.",
    strategicImplication: "Improves their enterprise appeal to cross-border D2C and consumer fintech clients.",
    recommendedAction: "Evaluate adding emotional telemetry to our customer interaction log.",
    userNotes: [],
  },
  {
    id: "ev-nexa-pos-20261009",
    changeId: "ch-nexa-01",
    competitorId: "comp-nexa",
    competitorName: "NexaSuite",
    title: "Brand positioning shifted to Autonomous Operations OS",
    category: "positioning",
    severity: "HIGH",
    confidence: 93,
    observedCurrentDate: "2026-10-09T10:15:00Z",
    observedPreviousDate: "2026-10-08T18:00:00Z",
    sourceUrl: "https://nexasuite.cloud",
    sourceTitle: "NexaSuite Homepage Meta & Hero Copy",
    detectionMethod: "Semantic embedding similarity & text diffing",
    verificationStatus: "verified",
    hashDigest: "sha256:3991028baadcf8892019941a9e88716381029",
    beforeContent: `<title>NexaSuite | Cloud Accounting & Billing ERP</title>
<h1>Cloud accounting and billing ERP software for Indian businesses</h1>`,
    afterContent: `<title>NexaSuite | Autonomous Operations OS</title>
<h1>The autonomous financial operations operating system for modern enterprises</h1>`,
    rawExcerpt: "Headline shift: 'Cloud accounting and billing ERP' -> 'The autonomous financial operations operating system for modern enterprises'.",
    strategicImplication: "Transitioning away from localized SME accounting into high-ticket global ERP deals.",
    recommendedAction: "Monitor whether they open offices in Singapore or Dubai.",
    userNotes: [],
  },
  {
    id: "ev-acme-workflows-20261022",
    changeId: "ch-acme-02",
    competitorId: "comp-acme",
    competitorName: "Acme Cloud",
    title: "Acme Workflows visual canvas released",
    category: "features",
    severity: "HIGH",
    confidence: 96,
    observedCurrentDate: "2026-10-22T13:00:00Z",
    observedPreviousDate: "2026-10-21T15:00:00Z",
    sourceUrl: "https://acmecloud.io/blog/announcing-workflows",
    sourceTitle: "Acme Cloud Product Release Blog",
    detectionMethod: "Blog feed RSS and DOM screenshot analysis",
    verificationStatus: "verified",
    hashDigest: "sha256:66778901caeeff82910283719001bca2718",
    beforeContent: `No visual automation builder. Only email notifications based on document edits.`,
    afterContent: `Visual drag-and-drop workflow canvas supporting conditional branches, multi-app triggers, and approval chains.`,
    rawExcerpt: "Build complex operational workflows in minutes with Acme Workflows drag-and-drop builder.",
    strategicImplication: "Acme is moving into our core process automation domain.",
    recommendedAction: "Stress test our workflow execution latency and UX to maintain product superiority.",
    userNotes: [],
  },
  {
    id: "ev-nova-pricing-20261018",
    changeId: "ch-nova-02",
    competitorId: "comp-nova",
    competitorName: "NovaAI",
    title: "NovaAI Pro seat price increased from $39 to $49",
    category: "pricing",
    severity: "HIGH",
    confidence: 95,
    observedCurrentDate: "2026-10-18T15:30:00Z",
    observedPreviousDate: "2026-10-17T20:00:00Z",
    sourceUrl: "https://nova-ai.systems/pricing",
    sourceTitle: "NovaAI Pricing Plan Matrix",
    detectionMethod: "Structured price extraction",
    verificationStatus: "verified",
    hashDigest: "sha256:22910398bbccfe9819203871900aef1283",
    beforeContent: `<span class="price">$39</span><span class="unit">/ user / mo</span>`,
    afterContent: `<span class="price">$49</span><span class="unit">/ user / mo</span>`,
    rawExcerpt: "Pro seat cost bumped by $10 (+25.6%) coinciding with Copilot v3 release.",
    strategicImplication: "High willingness-to-pay demonstrated by their early enterprise cohort.",
    recommendedAction: "Maintain our $35 price point to emphasize superior value-for-money.",
    userNotes: [],
  },
  {
    id: "ev-orbit-pricing-20261012",
    changeId: "ch-orbit-03",
    competitorId: "comp-orbit",
    competitorName: "OrbitCRM",
    title: "OrbitCRM enforced 10-seat minimum on Enterprise contracts",
    category: "pricing",
    severity: "HIGH",
    confidence: 96,
    observedCurrentDate: "2026-10-12T11:45:00Z",
    observedPreviousDate: "2026-10-11T12:00:00Z",
    sourceUrl: "https://orbitcrm.com/pricing",
    sourceTitle: "OrbitCRM Contractual Minimums Footnote",
    detectionMethod: "Legal disclaimer DOM crawler",
    verificationStatus: "verified",
    hashDigest: "sha256:8819203881caef9001928371bdca881729",
    beforeContent: `<p class="terms">Enterprise tier available on annual contracts without seat minimums.</p>`,
    afterContent: `<p class="terms">Enterprise tier requires a minimum of 10 seats on annual agreement (₹744,000 / year base).</p>`,
    rawExcerpt: "Minimum commitment established at 10 seats for Enterprise tier.",
    strategicImplication: "Leaves mid-market companies with 3-9 users stranded without advanced features.",
    recommendedAction: "Launch 'No Minimum Seat Commitment' campaign targeted at Orbit prospects.",
    userNotes: [],
  },
  {
    id: "ev-nexa-funding-20261009",
    changeId: "ch-nexa-02",
    competitorId: "comp-nexa",
    competitorName: "NexaSuite",
    title: "NexaSuite closed $28M Series B round",
    category: "announcements",
    severity: "HIGH",
    confidence: 99,
    observedCurrentDate: "2026-10-09T08:00:00Z",
    observedPreviousDate: "2026-10-08T12:00:00Z",
    sourceUrl: "https://nexasuite.cloud/news/series-b",
    sourceTitle: "NexaSuite Press Room",
    detectionMethod: "News RSS & verified SEC/MCA corporate filing match",
    verificationStatus: "verified",
    hashDigest: "sha256:99001827caecff1892019947bbde881029",
    beforeContent: `Total raised: $12M`,
    afterContent: `Total raised: $40M after $28M Series B led by Peak Partners`,
    rawExcerpt: "NexaSuite secures $28M Series B to build autonomous operations OS for global enterprises.",
    strategicImplication: "Substantial cash reserves will fuel aggressive outbound SDR hiring.",
    recommendedAction: "Strengthen our product moat in automated reconciliations.",
    userNotes: [],
  },
];
