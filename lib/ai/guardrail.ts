/**
 * PRYSM AI Guardrail & Domain Verification Engine
 * Strictly prevents the assistant from leaking or providing outer, non-PRYSM information.
 */

export interface DomainCheckResult {
  isAllowed: boolean;
  reason?: string;
  category?: "competitor" | "evidence" | "diff-engine" | "war-room" | "compliance" | "platform" | "outer-rejected";
}

// Patterns that indicate an explicitly outer/unrelated question
const OUTER_DOMAIN_PATTERNS = [
  // Food & Recipes
  /\b(recipe|cook|bake|ingredient|pasta|cake|pizza|cuisine|delicious|restaurant|dinner|breakfast|lunch)\b/i,
  // Sports & Games
  /\b(football|cricket|messi|ronaldo|nba|nfl|fifa|world cup|olympics|tennis|basketball|baseball)\b/i,
  // Entertainment & Celebrities
  /\b(movie|actor|actress|hollywood|bollywood|singer|song|album|celebrity|taylor swift|marvel|disney)\b/i,
  // General geography & history trivia
  /\b(capital of|president of|prime minister of|who is the king of|ancient rome|world war|pyramid|dynasty)\b/i,
  // Weather
  /\b(weather in|forecast|temperature in|humidity in|rain in|snowing in)\b/i,
  // General unrelated coding
  /\b(write a python script to (sort|reverse|scrape amazon|download)|two sum|leetcode|bubble sort|binary search tree|invert a binary tree)\b/i,
  // Creative / Roleplay
  /\b(write a poem|write a song|tell me a joke|tell a story|bedtime story|riddle|pretend you are a dog|roleplay)\b/i,
  // Philosophy / Astrological / General personal
  /\b(meaning of life|horoscope|zodiac|my girlfriend|my boyfriend|love advice|dating advice)\b/i,
  // Medical & Health
  /\b(symptoms of|headache cure|medication for|diagnose|cure for cancer)\b/i,
];

// Patterns that confirm PRYSM domain relevance
const PRYSM_DOMAIN_PATTERNS = [
  /\b(prysm|hacknova|competitor|competitors|rival|market|radar|threat|score|threat score)\b/i,
  /\b(acme|nova|apexmetrics|pulse|zenith|starlight|novaai|acme cloud|pulsecorp|zenithops)\b/i,
  /\b(pricing|price|hike|plan|starter|pro|business|enterprise|tier|billing|arr|mrr|churn)\b/i,
  /\b(ast|diff|dom|sanitiz|nonce|pixel|tracking|filter|html parse|semantic diff|mutation)\b/i,
  /\b(sha-?256|hash|cryptograph|evidence|evd|ledger|merkle|digest|proof|audit|baseline)\b/i,
  /\b(war room|scenario|simulation|counter-measure|elasticity|battlecard|win rate)\b/i,
  /\b(wayback|cdx|common crawl|rfc 9309|robots\.txt|rate limit|polite|ethical crawl)\b/i,
  /\b(executive brief|citation|report|brief|summary|dashboard|topology|time-machine|comparison)\b/i,
  /\b(api key|gemini|openai|scan|live scan|monitored|alert|webhook|slack)\b/i,
];

/**
 * Checks if a user's prompt is within the authorized PRYSM domain
 */
export function validateDomainRelevance(prompt: string): DomainCheckResult {
  const trimmed = prompt.trim();
  if (!trimmed) {
    return { isAllowed: false, reason: "Empty query" };
  }

  // Greetings are allowed as long as they aren't followed by outer questions
  if (/^(hi|hello|hey|greetings|good (morning|afternoon|evening)|help|who are you|what can you do)[\s!?.]*$/i.test(trimmed)) {
    return { isAllowed: true, category: "platform" };
  }

  // Check if it clearly matches outer/unrelated domain
  const hasOuterMatch = OUTER_DOMAIN_PATTERNS.some((pattern) => pattern.test(trimmed));
  const hasPrysmMatch = PRYSM_DOMAIN_PATTERNS.some((pattern) => pattern.test(trimmed));

  // If outer match found and no strong PRYSM keyword present, immediately reject
  if (hasOuterMatch && !hasPrysmMatch) {
    return {
      isAllowed: false,
      category: "outer-rejected",
      reason: "Query outside PRYSM operational scope (detected non-market / general trivia topic)",
    };
  }

  // If explicit PRYSM keywords found, allow
  if (hasPrysmMatch) {
    let cat: DomainCheckResult["category"] = "platform";
    if (/\b(acme|nova|apex|pulse|zenith|starlight|competitor)\b/i.test(trimmed)) cat = "competitor";
    else if (/\b(evidence|sha-?256|hash|digest|audit)\b/i.test(trimmed)) cat = "evidence";
    else if (/\b(ast|diff|nonce|dom)\b/i.test(trimmed)) cat = "diff-engine";
    else if (/\b(war room|arr|simulation|churn)\b/i.test(trimmed)) cat = "war-room";
    else if (/\b(wayback|cdx|rfc 9309|robots)\b/i.test(trimmed)) cat = "compliance";

    return { isAllowed: true, category: cat };
  }

  // If short and generic (e.g. "tell me more", "explain that", "show details", "why?"), allow in context
  if (trimmed.length < 50 && !hasOuterMatch) {
    return { isAllowed: true, category: "platform" };
  }

  // Otherwise, default to rejecting outer queries to guarantee zero leak
  return {
    isAllowed: false,
    category: "outer-rejected",
    reason: "Query does not appear to pertain to PRYSM, competitor intelligence, or platform data",
  };
}

export const STRICT_GUARDRAIL_REFUSAL_MESSAGE = `🔒 **PRYSM Domain Guardrail Active**

I am **PRYSM's Evidence-First Competitive Intelligence Copilot**. My operational guidelines strictly prohibit answering queries regarding general world knowledge, external trivia, creative writing, or topics outside PRYSM.

I am exclusively authorized to assist with:
• **Competitor Radar & Moves:** Acme Cloud, NovaAI, ApexMetrics, PulseCorp, ZenithOps, Starlight Systems.
• **Pricing & Feature Intelligence:** Price hikes (+30% Acme Pro), tier changes, packaging shifts.
• **Cryptographic Evidence Ledger:** SHA-256 hash digests, DOM snapshots, Wayback CDX citations.
• **Pipeline Engineering:** Normalized AST Diffing, dynamic nonce stripping, RFC 9309 robots.txt compliance.
• **Strategic War Room:** ARR loss modeling, churn elasticity, counter-positioning playbooks.

*Please ask a question related to PRYSM's monitored market data or platform architecture!*`;
