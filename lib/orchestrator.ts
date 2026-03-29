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
const TEST_MODE = process.env.TEST_MODE === "true";

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

  if (TEST_MODE) {
    const mockContent: Record<AgentId, string> = {
      planner: `### Week 1-2\n- Validate offer with 10 customer interviews\n- Choose business structure and register entity\n- Apply for EIN and open business checking account\n\n### Week 3-6\n- Build MVP landing page and onboarding flow\n- Finalize pricing and pilot terms\n\n### Week 7-12\n- Launch outreach campaign and track conversion KPIs`,
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

const SYNTHESIS_PROMPT = `You are a brand synthesis engine. Given a complete business launch package from 7 specialist agents, extract a cohesive presentation layer AND a structured roadmap.

CRITICAL: Return ONLY a valid JSON object — no markdown, no explanation, no preamble.

{
  "businessName": "The best business name from the Brand Agent output (or generate one if none exists)",
  "nameSuggestions": ["Name option 1", "Name option 2", "Name option 3", "Name option 4", "Name option 5"],
  "tagline": "The best tagline from the Brand Agent output",
  "selectedBusinessStructure": "One of: LLC, S-Corp, C-Corp, Sole Proprietorship",
  "brandTheme": {
    "primaryColor": "#hex from brand package color palette",
    "secondaryColor": "#hex from brand package",
    "accentColor": "#hex from brand package",
    "fontFamily": "The heading font recommendation from brand package"
  },
  "brandTemplate": {
    "voice": "2-3 words that define brand voice",
    "pillars": ["pillar 1", "pillar 2", "pillar 3"],
    "taglineVariants": ["variant 1", "variant 2", "variant 3"],
    "visualDirection": "1-2 sentences describing visual style",
    "logoPrompt": "A production-ready prompt for an AI image/logo model"
  },
  "agentSummaries": [
    {
      "agentId": "planner",
      "headline": "One punchy sentence summarizing the planner's key output",
      "bullets": ["Key takeaway 1", "Key takeaway 2", "Key takeaway 3"]
    },
    { "agentId": "research", "headline": "...", "bullets": ["...", "...", "..."] },
    { "agentId": "legal", "headline": "...", "bullets": ["...", "...", "..."] },
    { "agentId": "finance", "headline": "...", "bullets": ["...", "...", "..."] },
    { "agentId": "brand", "headline": "...", "bullets": ["...", "...", "..."] },
    { "agentId": "social", "headline": "...", "bullets": ["...", "...", "..."] },
    { "agentId": "critic", "headline": "...", "bullets": ["...", "...", "..."] }
  ],
  "roadmap": [
    {
      "id": "choose-entity",
      "title": "Choose Your Business Structure",
      "week": "Week 1",
      "phase": "Foundation",
      "why": "One sentence on why this matters — specific to THIS business",
      "prepared": "What the launch package already provides (e.g., 'LLC vs S-Corp comparison table in your Legal Package')",
      "action": "Exact next step with specifics (e.g., 'File Articles of Organization at sos.texas.gov — $300 filing fee')",
      "actionUrl": "https://direct-link-if-applicable.gov",
      "agentId": "legal",
      "estimatedTime": "30 minutes",
      "cost": "$300"
    }
  ]
}

Rules for agentSummaries:
- businessName: Use the brand agent's top name recommendation. If none, invent a memorable one.
- nameSuggestions: Provide 4-6 strong options the founder can choose from. Include businessName as one option.
- tagline: Use the brand agent's top tagline pick.
- selectedBusinessStructure: Pick the best recommendation based on Legal + Finance outputs.
- brandTheme colors: Extract exact hex codes from brand package. If unavailable, pick professional defaults.
- fontFamily: Use the heading font from the brand package.
- brandTemplate: Keep it concise and practical (voice, 3 pillars, 3 tagline variants, visual direction, and a detailed logoPrompt for AI generation).
- Each headline should be exciting and specific — NOT generic. Reference the actual business.
- Each bullet: a concrete fact or deliverable, max 15 words.
- Include ALL 7 agents in order: planner, research, legal, finance, brand, social, critic.

Rules for roadmap (VERY IMPORTANT — this is the user's step-by-step journey):
- Extract 12-18 discrete action steps from the Planner, Legal, Finance, Brand, and Social agents.
- Steps must be in chronological order (Week 1 first, Week 12 last).
- Each step must be a SINGLE concrete action, not a category. "Register LLC in Texas" not "Handle legal stuff".
- "why" must be specific to this business — not generic advice.
- "prepared" must reference what's already in their launch package. E.g., "Your Legal Package includes a draft Articles of Organization template" or "See Financial Setup Guide for bank comparison table".
- "action" must be the EXACT next physical step. Include specific websites, costs, timelines.
- "actionUrl" should be the direct URL where they can take action (government websites, signup pages, etc.). Omit if no direct URL.
- "agentId" links to which agent's deliverable is most relevant for this step.
- "estimatedTime" — how long this step takes (e.g., "15 minutes", "1-3 business days").
- "cost" — what it costs, if anything. Use "Free" for free steps.
- Cover these phases in order: Foundation (entity, EIN, bank), Legal & Compliance (licenses, insurance), Product & Brand (website, brand assets), Marketing & Launch (social, content, soft launch), Growth (first customers, metrics).
- The first 3-4 steps should be things they can do TODAY.`;

async function synthesizePresentation(
  outputs: Record<AgentId, AgentOutput>,
  intake: IntakeData,
  emit: Emitter
): Promise<Presentation | null> {
  if (TEST_MODE) {
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
      ],
    };

    emit({ type: "synthesis_complete", presentation: mock, timestamp: now() });
    return mock;
  }

  const agentIds: AgentId[] = ["planner", "research", "legal", "finance", "brand", "social", "critic"];
  const summaryInput = agentIds
    .map((id) => `--- ${AGENT_META[id].label} Output ---\n${outputs[id].content.slice(0, 2000)}`)
    .join("\n\n");

  try {
    const openai = getOpenAI();
    const response = await openai.chat.completions.create({
      model: CHAT_MODEL,
      messages: [
        { role: "system", content: SYNTHESIS_PROMPT },
        { role: "user", content: summaryInput },
      ],
      max_tokens: 4000,
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
      { id: "launch-social", title: "Set Up Social Media Accounts", week: "Week 4-5", phase: "Marketing", why: "Your audience needs to find you before launch day.", prepared: "Your Social Media Kit has bios, content pillars, and a 30-day calendar.", action: "Create accounts using the Account Setup Wizard above.", agentId: "social", estimatedTime: "1 hour", cost: "Free" },
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
  const baseContext = buildBusinessContext(intake);

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

  // ── Phase 1: Planner (solo — creates the roadmap everything else references) ──
  const plannerResult = await callAgent("planner", AGENT_PROMPTS.planner, baseContext, emit);

  outputs.planner = {
    agentId: "planner",
    status: isError(plannerResult) ? "error" : "complete",
    content: plannerResult,
    completedAt: now(),
  };

  emit({ type: "phase_complete", phase: 1, timestamp: now() });

  // ── Phase 2: Research + Legal + Finance (parallel, gated on Planner) ──
  const phase2Context = `${baseContext}

--- Launch Roadmap (from Planner Agent) ---
${plannerResult}`;

  const [researchResult, legalResult, financeResult] = await Promise.all([
    callAgent("research", AGENT_PROMPTS.research, phase2Context, emit),
    callAgent("legal", AGENT_PROMPTS.legal, phase2Context, emit),
    callAgent("finance", AGENT_PROMPTS.finance, phase2Context, emit),
  ]);

  outputs.research = {
    agentId: "research",
    status: isError(researchResult) ? "error" : "complete",
    content: researchResult,
    completedAt: now(),
  };
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

  // ── Phase 3: Brand (solo, needs Research for competitive context) ──
  const brandContext = `${phase2Context}

--- Market Intelligence (from Research Agent) ---
${researchResult}`;

  const brandResult = await callAgent("brand", AGENT_PROMPTS.brand, brandContext, emit);

  outputs.brand = {
    agentId: "brand",
    status: isError(brandResult) ? "error" : "complete",
    content: brandResult,
    completedAt: now(),
  };

  emit({ type: "phase_complete", phase: 3, timestamp: now() });

  // ── Phase 4: Social Media (needs brand for identity context) ──
  const socialContext = `${brandContext}

--- Brand Package (Brand) ---
${brandResult}`;

  const socialResult = await callAgent("social", AGENT_PROMPTS.social, socialContext, emit);

  outputs.social = {
    agentId: "social",
    status: isError(socialResult) ? "error" : "complete",
    content: socialResult,
    completedAt: now(),
  };

  emit({ type: "phase_complete", phase: 4, timestamp: now() });

  // ── Phase 5: Critic (reviews everything) ──
  const criticContext = `${baseContext}

--- Launch Roadmap (Planner) ---
${plannerResult}

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

  const criticResult = await callAgent("critic", AGENT_PROMPTS.critic, criticContext, emit);

  outputs.critic = {
    agentId: "critic",
    status: isError(criticResult) ? "error" : "complete",
    content: criticResult,
    completedAt: now(),
  };

  emit({ type: "phase_complete", phase: 5, timestamp: now() });

  // ── Synthesis: derive presentation metadata ──
  const presentation = await synthesizePresentation(outputs, intake, emit);

  if (presentation && !presentation.selectedBusinessStructure) {
    presentation.selectedBusinessStructure = intake.entityPreference || "Not sure";
  }

  if (presentation) {
    const generated = buildNameSuggestions(presentation.businessName, intake.businessIdea);
    const merged = Array.from(
      new Set([...(presentation.nameSuggestions ?? []), ...generated])
    );
    presentation.nameSuggestions = merged.slice(0, 6);
  }

  // ── Finalize ──
  const hasErrors = Object.values(outputs).some((o) => o.status === "error");

  run.agent_outputs = outputs;
  run.presentation = presentation;
  run.final_output = `# Your Business Launch Package

## 90-Day Launch Roadmap
${plannerResult}

---

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

## Launch Readiness Review
${criticResult}`;

  run.status = hasErrors ? "partial" : "complete";
  run.completed_at = now();

  emit({ type: "run_complete", run, timestamp: now() });

  return run;
}
