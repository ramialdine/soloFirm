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

type Emitter = (event: SSEEvent) => void;

function now() {
  return new Date().toISOString();
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
  "tagline": "The best tagline from the Brand Agent output",
  "brandTheme": {
    "primaryColor": "#hex from brand package color palette",
    "secondaryColor": "#hex from brand package",
    "accentColor": "#hex from brand package",
    "fontFamily": "The heading font recommendation from brand package"
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
- tagline: Use the brand agent's top tagline pick.
- brandTheme colors: Extract exact hex codes from brand package. If unavailable, pick professional defaults.
- fontFamily: Use the heading font from the brand package.
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
  emit: Emitter
): Promise<Presentation | null> {
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
    tagline: "Ready to launch",
    brandTheme: {
      primaryColor: "#18181b",
      secondaryColor: "#3b82f6",
      accentColor: "#10b981",
      fontFamily: "Inter",
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
  const presentation = await synthesizePresentation(outputs, emit);

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
