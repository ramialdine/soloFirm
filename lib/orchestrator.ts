import { v4 as uuidv4 } from "uuid";
import type {
  AgentId,
  AgentOutput,
  Run,
  SSEEvent,
  IntakeData,
  Presentation,
  AgentSummary,
} from "@/types/agents";
import { AGENT_PROMPTS, AGENT_META } from "@/types/agents";
import { CHAT_MODEL, getOpenAI } from "@/lib/openai";

const AGENT_TIMEOUT_MS = 60_000;
const AI_TEST_MODE =
  process.env.AI_TEST_MODE === "true" || process.env.TEST_MODE === "true";

type Emitter = (event: SSEEvent) => void;

function now() {
  return new Date().toISOString();
}

function toTitleCase(value: string) {
  return value
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function buildNameSuggestions(primary: string, idea: string): string[] {
  const cleanPrimary = toTitleCase(primary || "Your Business");
  const words = idea
    .replace(/[^a-zA-Z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2)
    .slice(0, 3)
    .map((w) => toTitleCase(w));

  const stem = words.join(" ") || cleanPrimary;
  const options = [
    cleanPrimary,
    `${stem} Labs`,
    `${stem} Studio`,
    `${stem} Works`,
    `${stem} Collective`,
    `${stem} Co.`,
  ];

  return Array.from(new Set(options)).slice(0, 6);
}

function extractIdeaKeywords(idea: string): string[] {
  const stop = new Set([
    "the", "and", "for", "with", "from", "that", "this", "your", "business", "service",
    "company", "startup", "platform", "app", "tool", "online", "local", "based", "help",
  ]);

  return idea
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length >= 4 && !stop.has(w))
    .slice(0, 4)
    .map(toTitleCase);
}

function buildConceptFallbackName(idea: string): string {
  const keywords = extractIdeaKeywords(idea);
  const core = keywords[0] || "Northstar";
  const suffixes = ["Studio", "Works", "Labs", "Collective", "Foundry"];
  const idx = Math.abs(
    idea.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0)
  ) % suffixes.length;
  return `${core} ${suffixes[idx]}`;
}

function extractJsonObject(raw: string): Record<string, unknown> | null {
  if (!raw?.trim()) return null;
  try {
    return JSON.parse(raw.trim()) as Record<string, unknown>;
  } catch {
    const match = raw.match(/\{[\s\S]*\}/);
    if (!match) return null;
    try {
      return JSON.parse(match[0]) as Record<string, unknown>;
    } catch {
      return null;
    }
  }
}

interface InitialNaming {
  businessName: string;
  nameSuggestions: string[];
  tagline?: string;
}

async function generateInitialNaming(intake: IntakeData): Promise<InitialNaming> {
  if (AI_TEST_MODE) {
    const seed = toTitleCase(intake.businessIdea.split(/\s+/).slice(0, 2).join(" ") || "Solo Launch");
    return {
      businessName: `${seed} Studio`,
      nameSuggestions: buildNameSuggestions(`${seed} Studio`, intake.businessIdea),
      tagline: "From idea to launch in one run",
    };
  }

  const fallbackName = buildConceptFallbackName(intake.businessIdea);
  const fallback: InitialNaming = {
    businessName: fallbackName,
    nameSuggestions: buildNameSuggestions(fallbackName, intake.businessIdea),
  };

  try {
    const openai = getOpenAI();
    const response = await openai.chat.completions.create({
      model: CHAT_MODEL,
      messages: [
        {
          role: "system",
          content: `You are a startup naming strategist. Return ONLY JSON: {"businessName":"...","nameSuggestions":["..."],"tagline":"..."}.

Rules:
- businessName must be concept-driven and brandable, not just the first words from the user idea.
- Keep names 1-3 words, pronounceable, and startup-ready.
- Provide 4-6 nameSuggestions including businessName.
- Ensure suggestions are distinct (not just suffix swaps).
- tagline should reflect the business value proposition.
- No markdown, no extra text.`,
        },
        {
          role: "user",
          content: `Business idea: ${intake.businessIdea}\nLocation: ${intake.location}\nBudget: ${intake.budgetRange}`,
        },
      ],
      max_tokens: 400,
    });

    const raw = response.choices?.[0]?.message?.content ?? "";
    const parsed = extractJsonObject(raw);
    if (!parsed) return fallback;

    const businessName =
      (typeof parsed.businessName === "string" && parsed.businessName.trim()) || fallback.businessName;
    const parsedSuggestions = Array.isArray(parsed.nameSuggestions)
      ? parsed.nameSuggestions.filter((v): v is string => typeof v === "string" && v.trim().length > 0)
      : [];

    return {
      businessName: toTitleCase(businessName),
      nameSuggestions: Array.from(
        new Set([toTitleCase(businessName), ...parsedSuggestions.map((s) => toTitleCase(s)), ...fallback.nameSuggestions])
      ).slice(0, 6),
      tagline: typeof parsed.tagline === "string" ? parsed.tagline : undefined,
    };
  } catch {
    return fallback;
  }
}

function makeEmptyOutputs(): Record<AgentId, AgentOutput> {
  const ids: AgentId[] = ["planner", "research", "legal", "finance", "brand", "social", "critic"];
  const out: Partial<Record<AgentId, AgentOutput>> = {};
  for (const id of ids) {
    out[id] = { agentId: id, status: "idle", content: "" };
  }
  return out as Record<AgentId, AgentOutput>;
}

function buildBusinessContext(intake: IntakeData): string {
  const lines = [
    `Business Idea: ${intake.businessIdea}`,
    `Location: ${intake.location}`,
    `Budget: ${intake.budgetRange}`,
    `Entity Preference: ${intake.entityPreference}`,
    `Team: ${intake.teamSize}`,
  ];

  if (intake.clarifyingAnswers?.trim()) {
    lines.push("", "--- Founder's Clarifying Answers ---", intake.clarifyingAnswers.trim());
  }

  if (intake.planSummary?.trim()) {
    lines.push("", "--- Business Direction Summary ---", intake.planSummary.trim());
  }

  if (intake.documents?.trim()) {
    lines.push("", "--- Uploaded Documents ---", intake.documents.trim(), "--- End Documents ---");
  }

  return lines.join("\n");
}

async function callAgent(
  agentId: AgentId,
  systemPrompt: string,
  userMessage: string,
  emit: Emitter
): Promise<string> {
  emit({ type: "agent_started", agentId, timestamp: now() });

  if (AI_TEST_MODE) {
    const mockContent: Record<AgentId, string> = {
      planner: `### Week 1-2\n- Validate offer with 10 customer interviews in your local market\n- File LLC formation with your state business portal\n- Apply for EIN on irs.gov and save confirmation letter\n- Open business checking account and connect bookkeeping software\n\n### Week 3-4\n- Purchase domain and publish a one-page conversion landing page\n- Set up lead capture form with automatic email follow-up\n- Finalize service packages with clear scope, timeline, and deliverables\n- Define pilot pricing and create invoice templates\n\n### Week 5-8\n- Launch first outbound campaign to 50 ideal customers\n- Publish 8 short-form content posts with one clear CTA\n- Collect first 5 customer testimonials and add to website\n- Track weekly KPIs: leads, calls booked, close rate, and CAC\n\n### Week 9-12\n- Build referral loop with scripted ask after delivery\n- Document SOPs for onboarding, delivery, and retention\n- Review unit economics and raise price if close rate remains high`,
      research: `### Market Snapshot\n- Primary customer segment identified with urgent pain\n- 5 local and online competitors analyzed\n- Pricing opportunity: premium-lite positioning with faster turnaround`,
      legal: `### Entity + Compliance\n- Recommended: LLC (convert to S-Corp later if tax-efficient)\n- Draft filing checklist and operating agreement outline\n- Required compliance steps listed by state and timeline`,
      finance: `### Financial Setup\n- Business bank + bookkeeping stack recommended\n- 12-month simple cashflow model and breakeven target\n- Weekly KPI dashboard: leads, close rate, CAC, cash runway`,
      brand: `### Brand Package\n- Name candidates, tagline options, voice attributes\n- Color palette + typography pairings\n- Logo concept directions and visual style`,
      social: `### Social Launch Kit\n- Platform prioritization and posting cadence\n- Bio/copy templates and 30-day content prompts\n- Launch-week campaign with CTA and tracking links`,
      critic: `### Critical Review\n- Biggest risk: inconsistent execution cadence\n- Mitigation: weekly operating rhythm and KPI checkpoints\n- Fastest win: targeted offer + direct outreach loop`,
    };

    const content = mockContent[agentId];
    emit({ type: "agent_chunk", agentId, content, timestamp: now() });
    emit({ type: "agent_complete", agentId, content, timestamp: now() });
    return content;
  }

  const openai = getOpenAI();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), AGENT_TIMEOUT_MS);

  try {
    const stream = await openai.chat.completions.create(
      {
        model: CHAT_MODEL,
        stream: true,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage },
        ],
        max_tokens: 4000,
      },
      { signal: controller.signal }
    );

    let fullContent = "";

    for await (const chunk of stream) {
      const delta = chunk.choices?.[0]?.delta?.content;
      if (delta) {
        fullContent += delta;
        emit({ type: "agent_chunk", agentId, content: delta, timestamp: now() });
      }
    }

    clearTimeout(timeout);
    emit({ type: "agent_complete", agentId, content: fullContent, timestamp: now() });
    return fullContent;
  } catch (err: unknown) {
    clearTimeout(timeout);

    const isTimeout = err instanceof Error && err.name === "AbortError";
    const fallback = isTimeout
      ? `[${agentId} timed out after ${AGENT_TIMEOUT_MS / 1000}s — partial results unavailable]`
      : `[${agentId} encountered an error: ${err instanceof Error ? err.message : "Unknown error"}]`;

    emit({ type: "agent_error", agentId, error: fallback, timestamp: now() });
    return fallback;
  }
}

function isError(content: string) {
  return content.startsWith("[") && content.includes("error");
}

// ── Multi-agent task extraction ───────────────────────────────────────────────

interface AgentTask {
  sourceAgent: AgentId;
  title: string;
  week: string;
  phase: string;
}

/** Extract up to `limit` actionable bullet-point tasks from any agent's output */
function extractAgentTasks(
  agentId: AgentId,
  content: string,
  defaultPhase: string,
  limit = 7
): AgentTask[] {
  const tasks: AgentTask[] = [];
  let currentPhase = defaultPhase;

  for (const line of content.split("\n")) {
    // Phase transitions from section headers
    if (/^#{1,4}.*(?:week\s*[1-2]|foundation|admin|legal|financial|setup|entity)/i.test(line))
      currentPhase = "Foundation";
    else if (/^#{1,4}.*(?:week\s*[3-5]|brand|build|product|develop|design|identity)/i.test(line))
      currentPhase = "Build";
    else if (/^#{1,4}.*(?:week\s*[6-8]|launch|market|content|outreach|social)/i.test(line))
      currentPhase = "Launch";
    else if (/^#{1,4}.*(?:week\s*[9-9]|week\s*1[0-9]|grow|scale|optim|revenue)/i.test(line))
      currentPhase = "Grow";

    const taskMatch = line.match(/^[-*]\s*(?:\[[ x]\]\s*)?(.{10,})/);
    if (taskMatch) {
      const text = taskMatch[1].trim();
      if (text.length < 15 || /^https?:\/\//.test(text)) continue;
      tasks.push({
        sourceAgent: agentId,
        title: text.replace(/\*\*/g, "").slice(0, 120),
        week: "Week 1",
        phase: currentPhase,
      });
    }
    if (tasks.length >= limit) break;
  }
  return tasks;
}

// ── Planner task extraction ──────────────────────────────────────────────────

interface PlannerTask {
  title: string;
  week: string;
  phase: string;
  detail: string;
}

function extractPlannerTasks(plannerOutput: string): PlannerTask[] {
  const tasks: PlannerTask[] = [];
  let currentWeek = "Week 1";
  let currentPhase = "Foundation";

  // Map week ranges to phases
  const phaseForWeek = (w: string): string => {
    const num = parseInt(w.match(/\d+/)?.[0] ?? "1");
    if (num <= 2) return "Foundation";
    if (num <= 5) return "Build";
    if (num <= 8) return "Launch";
    return "Grow";
  };

  const lines = plannerOutput.split("\n");
  for (const line of lines) {
    // Detect week headers: "### Week 1-2: Foundation" or "### Week 3-4"
    const weekMatch = line.match(/^#{1,4}\s*Week\s*(\d[\d\-–]*)/i);
    if (weekMatch) {
      currentWeek = `Week ${weekMatch[1].replace("–", "-")}`;
      currentPhase = phaseForWeek(currentWeek);
      // Also pick up phase from header if present: "### Week 1-2: Foundation"
      const phaseInHeader = line.match(/:\s*(.+)/);
      if (phaseInHeader) {
        const p = phaseInHeader[1].trim();
        if (/found|setup|admin|legal/i.test(p)) currentPhase = "Foundation";
        else if (/brand|product|build|develop/i.test(p)) currentPhase = "Build";
        else if (/launch|market|content|outreach/i.test(p)) currentPhase = "Launch";
        else if (/grow|scale|optim|custom/i.test(p)) currentPhase = "Grow";
      }
      continue;
    }

    // Detect phase-only headers: "### Foundation", "### Growth"
    const phaseMatch = line.match(/^#{1,4}\s*(Foundation|Build|Launch|Grow|Growth|Scale|Marketing|Brand|Product|Legal|Financial)/i);
    if (phaseMatch && !weekMatch) {
      const p = phaseMatch[1];
      if (/found|legal|financial/i.test(p)) currentPhase = "Foundation";
      else if (/brand|product|build/i.test(p)) currentPhase = "Build";
      else if (/launch|market/i.test(p)) currentPhase = "Launch";
      else if (/grow|scale/i.test(p)) currentPhase = "Grow";
      continue;
    }

    // Extract tasks from checkbox lines or bullet points
    const taskMatch = line.match(/^[-*]\s*(?:\[[ x]\]\s*)?(.{10,})/);
    if (taskMatch) {
      const text = taskMatch[1].trim();
      // Skip items that are clearly sub-details (too short, start with lowercase, or are URLs)
      if (text.length < 15 || /^https?:\/\//.test(text)) continue;
      tasks.push({
        title: text.replace(/\*\*/g, "").slice(0, 120),
        week: currentWeek,
        phase: currentPhase,
        detail: text,
      });
    }
  }

  return tasks;
}

// ── Synthesis prompt ─────────────────────────────────────────────────────────

const SYNTHESIS_PROMPT = `You are a brand synthesis engine. Given a business launch package from specialist agents AND a pre-extracted list of planner tasks, produce a cohesive presentation JSON.

CRITICAL: Return ONLY a valid JSON object — no markdown, no explanation, no preamble.

{
  "businessName": "Best name from Brand Agent (or generate one)",
  "nameSuggestions": ["Name 1", "Name 2", "Name 3", "Name 4", "Name 5"],
  "tagline": "Best tagline from Brand Agent",
  "selectedBusinessStructure": "LLC | S-Corp | C-Corp | Sole Proprietorship",
  "brandTheme": {
    "primaryColor": "#hex",
    "secondaryColor": "#hex",
    "accentColor": "#hex",
    "fontFamily": "Font name"
  },
  "brandTemplate": {
    "voice": "2-3 words",
    "pillars": ["pillar 1", "pillar 2", "pillar 3"],
    "taglineVariants": ["v1", "v2", "v3"],
    "visualDirection": "1-2 sentences",
    "logoPrompt": "Detailed AI logo generation prompt"
  },
  "agentSummaries": [
    {"agentId": "planner", "headline": "...", "bullets": ["...", "...", "..."]},
    {"agentId": "research", "headline": "...", "bullets": ["...", "...", "..."]},
    {"agentId": "legal", "headline": "...", "bullets": ["...", "...", "..."]},
    {"agentId": "finance", "headline": "...", "bullets": ["...", "...", "..."]},
    {"agentId": "brand", "headline": "...", "bullets": ["...", "...", "..."]},
    {"agentId": "social", "headline": "...", "bullets": ["...", "...", "..."]},
    {"agentId": "critic", "headline": "...", "bullets": ["...", "...", "..."]}
  ],
  "derivedFromPlanner": true,
  "roadmap": [
    {
      "id": "kebab-case-id",
      "title": "Specific actionable task title",
      "week": "Week N",
      "phase": "Foundation | Build | Launch | Grow",
      "why": "Business-specific reason",
      "prepared": "What the launch package already provides for this step",
      "action": "Exact next physical step with specifics",
      "actionUrl": "https://...",
      "agentId": "planner",
      "sourceAgent": "planner",
      "estimatedTime": "15 minutes",
      "cost": "Free"
    }
  ]
}

ROADMAP RULES (CRITICAL — roadmap must be multi-agent, not planner-only):
- A pre-extracted list of task candidates from ALL agents is provided under "--- Multi-Agent Task Candidates ---".
- Each candidate is tagged [sourceAgent / phase]. You MUST use these as your primary source.
- Convert each viable candidate into a roadmap step, setting "sourceAgent" to the tag shown (legal, finance, brand, social, research, planner).
- Keep every actionable, specific task. Drop only true duplicates or vague sub-details.
- Enrich each step with: why (specific to this business), prepared (what the launch package provides), action (exact next step with specifics), estimatedTime, cost.
- Map steps to exactly 4 phases: Foundation (legal/admin/financial setup), Build (brand/product/website), Launch (content/social/outreach), Grow (revenue/retention/scale).
- Output 15-22 roadmap steps total, in chronological order, distributed across phases.
- Prefer legal/finance steps in Foundation, brand steps in Build, social/content steps in Launch, growth tactics in Grow.
- Each step id must be a unique kebab-case string derived from the title.
- NEVER invent generic placeholder steps. Every step must trace back to a specific agent deliverable.

AGENT SUMMARIES RULES:
- Include ALL 7 agents in order: planner, research, legal, finance, brand, social, critic.
- Each headline: exciting, specific to THIS business. Not generic.
- Each bullet: concrete fact or deliverable, max 15 words.
- businessName: Use brand agent's top pick. nameSuggestions: 4-6 options.
- selectedBusinessStructure: Best rec from Legal + Finance.
- brandTheme: Extract hex codes from brand package.`;

async function synthesizePresentation(
  outputs: Record<AgentId, AgentOutput>,
  intake: IntakeData,
  emit: Emitter
): Promise<Presentation | null> {
  if (AI_TEST_MODE) {
    const mock: Presentation = {
      businessName: "SoloSpark",
      nameSuggestions: ["SoloSpark", "LaunchFoundry", "FounderLift", "PilotGrid", "Northline Studio"],
      tagline: "From idea to launch in one run",
      selectedBusinessStructure: intake.entityPreference || "LLC",
      brandTheme: {
        primaryColor: "#18181b",
        secondaryColor: "#2563eb",
        accentColor: "#10b981",
        fontFamily: "Inter",
      },
      brandTemplate: {
        voice: "Confident, practical, founder-first",
        pillars: ["Clarity", "Execution", "Momentum"],
        taglineVariants: ["Launch faster, smarter", "Build with momentum", "Strategy that ships"],
        visualDirection: "Clean geometric forms, high contrast typography, modern startup aesthetic.",
        logoPrompt: "Create a modern geometric startup logo with icon + wordmark for SoloSpark using deep charcoal, electric blue, and emerald accent.",
      },
      agentSummaries: [
        { agentId: "planner", headline: "Your 90-day launch roadmap is set", bullets: ["Priorities sequenced week-by-week", "Critical path is clearly defined", "Immediate actions identified"] },
        { agentId: "research", headline: "Your market opportunity is validated", bullets: ["Customer segment is specific", "Competitive whitespace identified", "Pricing direction established"] },
        { agentId: "legal", headline: "Your legal structure is ready to execute", bullets: ["Entity recommendation prepared", "Compliance checklist provided", "Filing sequence clarified"] },
        { agentId: "finance", headline: "Your financial baseline is investor-ready", bullets: ["Cashflow model established", "Key KPIs selected", "Breakeven target defined"] },
        { agentId: "brand", headline: "Your brand identity is now cohesive", bullets: ["Name options generated", "Voice and messaging aligned", "Visual direction documented"] },
        { agentId: "social", headline: "Your launch content system is ready", bullets: ["Platform strategy prioritized", "30-day content plan included", "CTAs and hooks prepared"] },
        { agentId: "critic", headline: "Your execution risks are now controlled", bullets: ["Top risks surfaced", "Mitigations mapped", "Fastest path to traction identified"] },
      ],
      roadmap: [
        { id: "choose-entity", title: "Choose Your Business Structure", week: "Week 1", phase: "Foundation", why: "This determines liability and tax treatment for your launch.", prepared: "See your Legal Package for entity comparison and recommendation.", action: "Select LLC or S-Corp and confirm with your filing plan.", agentId: "legal", estimatedTime: "15 minutes", cost: "Free" },
        { id: "register-entity", title: "Register Your Business", week: "Week 1", phase: "Foundation", why: "Registration unlocks EIN, banking, and contracts.", prepared: "Legal checklist and filing order are prepared for you.", action: "File your entity with the state portal.", agentId: "legal", estimatedTime: "30 minutes", cost: "Varies by state" },
        { id: "apply-ein", title: "Apply for EIN", week: "Week 1", phase: "Foundation", why: "You need EIN for banking and taxes.", prepared: "Financial setup guide includes required fields.", action: "Submit EIN application via IRS online portal.", actionUrl: "https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online", agentId: "finance", estimatedTime: "10 minutes", cost: "Free" },
        { id: "open-bank", title: "Open a Business Bank Account", week: "Week 2", phase: "Foundation", why: "Separates personal and business funds and simplifies bookkeeping.", prepared: "Finance package includes a bank comparison matrix.", action: "Choose one bank and submit account application.", agentId: "finance", estimatedTime: "20 minutes", cost: "Free" },
        { id: "bookkeeping", title: "Set Up Bookkeeping Stack", week: "Week 2", phase: "Foundation", why: "Accurate books are required for taxes and decision making.", prepared: "Chart of accounts template and KPI list are prepared.", action: "Connect your bank account to bookkeeping software and enable transaction rules.", agentId: "finance", estimatedTime: "45 minutes", cost: "$0-$30/month" },
        { id: "offer-design", title: "Finalize Service Packages", week: "Week 3", phase: "Build", why: "Clear packaging improves close rates during early sales.", prepared: "Planner + Research outputs define positioning and customer pains.", action: "Publish three package tiers with scope, turnaround, and price.", agentId: "planner", estimatedTime: "60 minutes", cost: "Free" },
        { id: "landing-page", title: "Launch Conversion Landing Page", week: "Week 3", phase: "Build", why: "You need a destination for outreach and ad traffic.", prepared: "Brand colors, messaging, and CTA copy are ready.", action: "Deploy a one-page site with lead form, offer, and testimonial block.", agentId: "brand", estimatedTime: "2 hours", cost: "$0-$30" },
        { id: "brand-assets", title: "Publish Brand Asset Kit", week: "Week 4", phase: "Build", why: "Consistent identity increases trust across channels.", prepared: "Logo prompt, palette, and voice pillars are prepared.", action: "Create logo lockups, social banner, and profile images.", agentId: "brand", estimatedTime: "90 minutes", cost: "$0-$100" },
        { id: "social-profiles", title: "Create Social Profiles", week: "Week 4", phase: "Launch", why: "Prospects need proof and contact channels before buying.", prepared: "Bios and content pillars are prepared by Social Agent.", action: "Set up Instagram, LinkedIn, and YouTube business profiles.", agentId: "social", estimatedTime: "45 minutes", cost: "Free" },
        { id: "outreach-sprint", title: "Run 50-Prospect Outreach Sprint", week: "Week 5", phase: "Launch", why: "Early traction validates offer and pricing quickly.", prepared: "Research-defined ICP and messaging templates are prepared.", action: "Send personalized outreach to 50 ideal prospects over 5 days.", agentId: "research", estimatedTime: "5 days", cost: "Free" },
        { id: "content-cadence", title: "Ship 8 Launch Content Posts", week: "Week 6", phase: "Launch", why: "Consistent content builds credibility and inbound leads.", prepared: "30-day content prompts and hooks are in the Social Kit.", action: "Publish 8 posts with one CTA per post and track response.", agentId: "social", estimatedTime: "4 hours", cost: "Free" },
        { id: "kpi-review", title: "Weekly KPI Review Loop", week: "Week 7-12", phase: "Grow", why: "Execution discipline reduces drift and improves conversion.", prepared: "Critic risk list and KPI dashboard template are ready.", action: "Review leads, close rate, CAC, and retention every Friday.", agentId: "critic", estimatedTime: "30 minutes/week", cost: "Free" },
        { id: "referral-loop", title: "Install Referral Ask Workflow", week: "Week 8", phase: "Grow", why: "Referrals lower CAC and increase trust.", prepared: "Post-delivery scripts and email templates are prepared.", action: "Send referral request to every satisfied customer within 24 hours of delivery.", agentId: "planner", estimatedTime: "30 minutes", cost: "Free" },
      ],
    };

    emit({ type: "synthesis_complete", presentation: mock, timestamp: now() });
    return mock;
  }

  const agentIds: AgentId[] = ["planner", "research", "legal", "finance", "brand", "social", "critic"];
  const businessContext = buildBusinessContext(intake);

  // Extract structured tasks from ALL agents — each tagged with sourceAgent
  const plannerTasks = extractPlannerTasks(outputs.planner?.content ?? "").map((t) => ({
    sourceAgent: "planner" as AgentId,
    title: t.title,
    phase: t.phase,
    week: t.week,
  }));

  const multiAgentTasks = [
    ...plannerTasks,
    ...extractAgentTasks("legal",    outputs.legal?.content    ?? "", "Foundation"),
    ...extractAgentTasks("finance",  outputs.finance?.content  ?? "", "Foundation"),
    ...extractAgentTasks("brand",    outputs.brand?.content    ?? "", "Build"),
    ...extractAgentTasks("social",   outputs.social?.content   ?? "", "Launch"),
    ...extractAgentTasks("research", outputs.research?.content ?? "", "Foundation", 4),
  ];

  const taskCandidates = multiAgentTasks.length > 0
    ? `\n\n--- Multi-Agent Task Candidates (USE THESE AS ROADMAP SOURCE) ---\n${
        multiAgentTasks
          .map((t, i) => `${i + 1}. [${t.sourceAgent} / ${t.phase}] ${t.title}`)
          .join("\n")
      }`
    : "";

  const summaryInput = `${businessContext}\n\n` + agentIds
    .map((id) => `--- ${AGENT_META[id].label} Output ---\n${outputs[id].content.slice(0, 2800)}`)
    .join("\n\n") + taskCandidates;

  emit({ type: "synthesis_started", timestamp: now() });

  try {
    const openai = getOpenAI();
    const response = await openai.chat.completions.create({
      model: CHAT_MODEL,
      messages: [
        { role: "system", content: SYNTHESIS_PROMPT },
        { role: "user", content: summaryInput },
      ],
      max_tokens: 6000,
    });

    const raw = response.choices?.[0]?.message?.content ?? "";

    // Parse JSON from response (try direct, then strip markdown)
    let parsed: Presentation | null = null;
    try {
      parsed = JSON.parse(raw);
    } catch {
      const match = raw.match(/\{[\s\S]*\}/);
      if (match) parsed = JSON.parse(match[0]);
    }

    if (parsed && parsed.businessName && parsed.agentSummaries) {
      emit({ type: "synthesis_complete", presentation: parsed, timestamp: now() });
      return parsed;
    }
  } catch (err) {
    console.error("Synthesis failed:", err);
  }

  // Fallback: build a minimal presentation from raw outputs
  const fallback: Presentation = {
    businessName: "Your Business",
    nameSuggestions: [
      "Your Business Co.",
      "Summit Launch Studio",
      "Northstar Ventures",
      "Catalyst Collective",
      "Foundry Works",
    ],
    tagline: "Ready to launch",
    selectedBusinessStructure: intake.entityPreference || "Not sure",
    brandTheme: {
      primaryColor: "#18181b",
      secondaryColor: "#3b82f6",
      accentColor: "#10b981",
      fontFamily: "Inter",
    },
    brandTemplate: {
      voice: "Clear, trustworthy, modern",
      pillars: ["Credibility", "Simplicity", "Execution"],
      taglineVariants: ["Built to launch", "From idea to revenue", "Launch in one run"],
      visualDirection: "Minimal modern typography, strong contrast, geometric iconography.",
      logoPrompt: "Design a modern startup logo for 'Your Business' using bold geometric forms, clean sans-serif typography, and a blue/green palette with transparent background.",
    },
    agentSummaries: agentIds.map((id) => ({
      agentId: id,
      headline: `${AGENT_META[id].deliverable} complete`,
      bullets: [AGENT_META[id].description],
    })),
    roadmap: [
      { id: "choose-entity", title: "Choose Your Business Structure", week: "Week 1", phase: "Foundation", why: "Your liability protection and tax treatment depend on this decision.", prepared: "See your Legal Package for an entity comparison table.", action: "Review the Legal Agent's recommendation and decide on LLC vs S-Corp.", agentId: "legal", estimatedTime: "15 minutes", cost: "Free" },
      { id: "register-entity", title: "Register Your Business", week: "Week 1", phase: "Foundation", why: "You can't open a bank account or get an EIN without this.", prepared: "Your Legal Package includes a draft Articles of Organization.", action: "File with your state's Secretary of State office.", agentId: "legal", estimatedTime: "30 minutes", cost: "Varies by state" },
      { id: "apply-ein", title: "Apply for an EIN", week: "Week 1", phase: "Foundation", why: "Required for business banking, hiring, and tax filing.", prepared: "Your Financial Setup Guide has step-by-step EIN instructions.", action: "Apply online at irs.gov — instant approval.", actionUrl: "https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online", agentId: "finance", estimatedTime: "10 minutes", cost: "Free" },
      { id: "open-bank", title: "Open a Business Bank Account", week: "Week 2", phase: "Foundation", why: "Separates personal and business finances from day one.", prepared: "Your Financial Setup Guide compares 5 banks with pricing.", action: "Pick a bank from the comparison table and apply online.", agentId: "finance", estimatedTime: "20 minutes", cost: "Free" },
      { id: "setup-brand", title: "Finalize Brand Identity", week: "Week 3-4", phase: "Brand", why: "Consistent branding builds trust before you have customers.", prepared: "Your Brand Package has colors, fonts, logo concepts, and messaging.", action: "Hand the Brand Package to a designer or use Canva to build assets.", agentId: "brand", estimatedTime: "2-3 hours", cost: "Free-$200" },
      { id: "launch-social", title: "Set Up Social Media Accounts", week: "Week 4-5", phase: "Marketing", why: "Your audience needs to find you before launch day.", prepared: "Your Social Media Kit has bios, content pillars, and a 30-day content calendar.", action: "Create business profiles on Instagram, Facebook, and LinkedIn using your brand colors and bio from the Social Media Kit.", agentId: "social", estimatedTime: "1 hour", cost: "Free" },
    ],
  };

  emit({ type: "synthesis_complete", presentation: fallback, timestamp: now() });
  return fallback;
}

export async function orchestrate(
  intake: IntakeData,
  emit: Emitter
): Promise<Run> {
  const runId = uuidv4();
  const outputs = makeEmptyOutputs();

  // Use pre-selected name if the user chose one in the brand-selection step
  const initialNaming = intake.selectedBusinessName
    ? {
        businessName: intake.selectedBusinessName,
        nameSuggestions: buildNameSuggestions(intake.selectedBusinessName, intake.businessIdea),
        tagline: undefined,
      }
    : await generateInitialNaming(intake);

  const baseContext = `${buildBusinessContext(intake)}

--- Business Name (generated before planning) ---
${initialNaming.businessName}

--- Candidate Name Options ---
${initialNaming.nameSuggestions.map((n) => `- ${n}`).join("\n")}
${initialNaming.tagline ? `\n\n--- Early Tagline Direction ---\n${initialNaming.tagline}` : ""}`;

  const run: Run = {
    id: runId,
    domain: intake.businessIdea,
    task: intake.planSummary ?? intake.businessIdea,
    status: "running",
    agent_outputs: outputs,
    final_output: null,
    presentation: null,
    created_at: now(),
    completed_at: null,
  };

  emit({ type: "run_started", run, timestamp: now() });

  // ── Phase 1: Research (solo — builds market foundation) ──
  const researchResult = await callAgent("research", AGENT_PROMPTS.research, baseContext, emit);

  outputs.research = {
    agentId: "research",
    status: isError(researchResult) ? "error" : "complete",
    content: researchResult,
    completedAt: now(),
  };

  emit({ type: "phase_complete", phase: 1, timestamp: now() });

  // ── Phase 2: Legal + Finance (parallel, informed by Research) ──
  const phase2Context = `${baseContext}

--- Market Intelligence (from Research Agent) ---
${researchResult}`;

  const [legalResult, financeResult] = await Promise.all([
    callAgent("legal", AGENT_PROMPTS.legal, phase2Context, emit),
    callAgent("finance", AGENT_PROMPTS.finance, phase2Context, emit),
  ]);

  outputs.legal = {
    agentId: "legal",
    status: isError(legalResult) ? "error" : "complete",
    content: legalResult,
    completedAt: now(),
  };
  outputs.finance = {
    agentId: "finance",
    status: isError(financeResult) ? "error" : "complete",
    content: financeResult,
    completedAt: now(),
  };

  emit({ type: "phase_complete", phase: 2, timestamp: now() });

  // ── Phase 3: Brand (informed by Research + Legal + Finance) ──
  const brandContext = `${phase2Context}

--- Legal Package (from Legal Agent) ---
${legalResult}

--- Financial Setup Guide (from Finance Agent) ---
${financeResult}`;

  const brandResult = await callAgent("brand", AGENT_PROMPTS.brand, brandContext, emit);

  outputs.brand = {
    agentId: "brand",
    status: isError(brandResult) ? "error" : "complete",
    content: brandResult,
    completedAt: now(),
  };

  emit({ type: "phase_complete", phase: 3, timestamp: now() });

  // ── Phase 4: Social Media (informed by Brand + everything so far) ──
  const socialContext = `${brandContext}

--- Brand Package (from Brand Agent) ---
${brandResult}`;

  const socialResult = await callAgent("social", AGENT_PROMPTS.social, socialContext, emit);

  outputs.social = {
    agentId: "social",
    status: isError(socialResult) ? "error" : "complete",
    content: socialResult,
    completedAt: now(),
  };

  emit({ type: "phase_complete", phase: 4, timestamp: now() });

  // ── Phase 5: Planner (runs LAST — synthesizes all previous agents into the definitive 90-day plan) ──
  const plannerContext = `${baseContext}

--- Market Intelligence (Research) ---
${researchResult}

--- Legal Package (Legal) ---
${legalResult}

--- Financial Setup Guide (Finance) ---
${financeResult}

--- Brand Package (Brand) ---
${brandResult}

--- Social Media Launch Kit (Social) ---
${socialResult}`;

  const plannerResult = await callAgent("planner", AGENT_PROMPTS.planner, plannerContext, emit);

  outputs.planner = {
    agentId: "planner",
    status: isError(plannerResult) ? "error" : "complete",
    content: plannerResult,
    completedAt: now(),
  };

  emit({ type: "phase_complete", phase: 5, timestamp: now() });

  // ── Phase 6: Critic (reviews everything including the completed Plan) ──
  const criticContext = `${baseContext}

--- Market Intelligence (Research) ---
${researchResult}

--- Legal Package (Legal) ---
${legalResult}

--- Financial Setup Guide (Finance) ---
${financeResult}

--- Brand Package (Brand) ---
${brandResult}

--- Social Media Launch Kit (Social) ---
${socialResult}

--- 90-Day Launch Plan (Planner) ---
${plannerResult}`;

  const criticResult = await callAgent("critic", AGENT_PROMPTS.critic, criticContext, emit);

  outputs.critic = {
    agentId: "critic",
    status: isError(criticResult) ? "error" : "complete",
    content: criticResult,
    completedAt: now(),
  };

  emit({ type: "phase_complete", phase: 6, timestamp: now() });

  // ── Synthesis: derive presentation metadata ──
  const presentation = await synthesizePresentation(outputs, intake, emit);

  if (presentation) {
    if (!presentation.selectedBusinessStructure) {
      presentation.selectedBusinessStructure = intake.entityPreference || "Not sure";
    }

    // Respect pre-selected business name (overrides synthesis result)
    if (intake.selectedBusinessName) {
      presentation.businessName = intake.selectedBusinessName;
    } else if (!presentation.businessName || presentation.businessName === "Your Business") {
      presentation.businessName = initialNaming.businessName;
    }

    if (!presentation.tagline && initialNaming.tagline) {
      presentation.tagline = initialNaming.tagline;
    }

    // Respect pre-selected brand colors / font
    if (intake.selectedAccentColor) {
      presentation.brandTheme = {
        ...presentation.brandTheme,
        accentColor: intake.selectedAccentColor,
      };
    }
    if (intake.selectedFontFamily) {
      presentation.brandTheme = {
        ...presentation.brandTheme,
        fontFamily: intake.selectedFontFamily,
      };
    }

    const generated = buildNameSuggestions(presentation.businessName, intake.businessIdea);
    const merged = Array.from(
      new Set([
        ...initialNaming.nameSuggestions,
        ...(presentation.nameSuggestions ?? []),
        ...generated,
      ])
    );
    presentation.nameSuggestions = merged.slice(0, 8);
  }

  // ── Finalize ──
  const hasErrors = Object.values(outputs).some((o) => o.status === "error");

  run.agent_outputs = outputs;

  // Build the composed plan document from all agents (used by /results/[id]/plan)
  const planDocument = `# Your Business Launch Package

## Market Intelligence
${researchResult}

---

## Legal Documents & Compliance
${legalResult}

---

## Financial Setup Guide
${financeResult}

---

## Brand Package
${brandResult}

---

## Social Media Launch Kit
${socialResult}

---

## 90-Day Launch Roadmap
${plannerResult}

---

## Launch Readiness Review
${criticResult}`;

  if (presentation) {
    presentation.planDocument = planDocument;
  }

  run.presentation = presentation;
  run.final_output = `# Your Business Launch Package

## Market Intelligence
${researchResult}

---

## Legal Documents & Compliance
${legalResult}

---

## Financial Setup Guide
${financeResult}

---

## Brand Package
${brandResult}

---

## Social Media Launch Kit
${socialResult}

---

## 90-Day Launch Roadmap
${plannerResult}

---

## Launch Readiness Review
${criticResult}`;

  run.status = hasErrors ? "partial" : "complete";
  run.completed_at = now();

  return run;
}
