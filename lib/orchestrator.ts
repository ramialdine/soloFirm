import { v4 as uuidv4 } from "uuid";
import type {
  AgentId,
  AgentOutput,
  Run,
  SSEEvent,
  RunInput,
} from "@/types/agents";
import { AGENT_PROMPTS } from "@/types/agents";
import { CHAT_MODEL, getOpenAI } from "@/lib/openai";

const AGENT_TIMEOUT_MS = 30_000;

type Emitter = (event: SSEEvent) => void;

function now() {
  return new Date().toISOString();
}

function makeEmptyOutputs(): Record<AgentId, AgentOutput> {
  const ids: AgentId[] = [
    "research",
    "finance",
    "strategy",
    "legal",
    "writer",
    "critic",
  ];
  const out: Partial<Record<AgentId, AgentOutput>> = {};
  for (const id of ids) {
    out[id] = { agentId: id, status: "idle", content: "" };
  }
  return out as Record<AgentId, AgentOutput>;
}

async function callAgent(
  agentId: AgentId,
  systemPrompt: string,
  userMessage: string,
  emit: Emitter
): Promise<string> {
  emit({
    type: "agent_started",
    agentId,
    timestamp: now(),
  });

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
        max_tokens: 2000,
      },
      { signal: controller.signal }
    );

    let fullContent = "";

    for await (const chunk of stream) {
      const delta = chunk.choices?.[0]?.delta?.content;
      if (delta) {
        fullContent += delta;
        emit({
          type: "agent_chunk",
          agentId,
          content: delta,
          timestamp: now(),
        });
      }
    }

    clearTimeout(timeout);

    emit({
      type: "agent_complete",
      agentId,
      content: fullContent,
      timestamp: now(),
    });

    return fullContent;
  } catch (err: unknown) {
    clearTimeout(timeout);

    const isTimeout =
      err instanceof Error && err.name === "AbortError";
    const fallback = isTimeout
      ? `[${agentId} timed out after ${AGENT_TIMEOUT_MS / 1000}s — partial results unavailable]`
      : `[${agentId} encountered an error: ${err instanceof Error ? err.message : "Unknown error"}]`;

    emit({
      type: "agent_error",
      agentId,
      error: fallback,
      timestamp: now(),
    });

    return fallback;
  }
}

export async function orchestrate(
  input: RunInput,
  emit: Emitter
): Promise<Run> {
  const runId = uuidv4();
  const outputs = makeEmptyOutputs();

  const run: Run = {
    id: runId,
    domain: input.domain,
    task: input.task,
    status: "running",
    agent_outputs: outputs,
    final_output: null,
    created_at: now(),
    completed_at: null,
  };

  emit({ type: "run_started", run, timestamp: now() });

  const basePrompt = `Domain: ${input.domain}\nTask: ${input.task}`;

  // ── Phase 1: Research + Finance (parallel) ──
  const [researchResult, financeResult] = await Promise.all([
    callAgent("research", AGENT_PROMPTS.research, basePrompt, emit),
    callAgent("finance", AGENT_PROMPTS.finance, basePrompt, emit),
  ]);

  outputs.research = {
    agentId: "research",
    status: researchResult.startsWith("[") ? "error" : "complete",
    content: researchResult,
    completedAt: now(),
  };
  outputs.finance = {
    agentId: "finance",
    status: financeResult.startsWith("[") ? "error" : "complete",
    content: financeResult,
    completedAt: now(),
  };

  emit({ type: "phase_complete", phase: 1, timestamp: now() });

  // ── Phase 2: Strategy + Legal (parallel, gated on Phase 1) ──
  const phase2Context = `${basePrompt}\n\n--- Research Findings ---\n${researchResult}\n\n--- Financial Analysis ---\n${financeResult}`;

  const [strategyResult, legalResult] = await Promise.all([
    callAgent("strategy", AGENT_PROMPTS.strategy, phase2Context, emit),
    callAgent("legal", AGENT_PROMPTS.legal, phase2Context, emit),
  ]);

  outputs.strategy = {
    agentId: "strategy",
    status: strategyResult.startsWith("[") ? "error" : "complete",
    content: strategyResult,
    completedAt: now(),
  };
  outputs.legal = {
    agentId: "legal",
    status: legalResult.startsWith("[") ? "error" : "complete",
    content: legalResult,
    completedAt: now(),
  };

  emit({ type: "phase_complete", phase: 2, timestamp: now() });

  // ── Phase 3: Writer (sequential, needs all prior outputs) ──
  const writerContext = `${basePrompt}

--- Research Findings ---
${researchResult}

--- Financial Analysis ---
${financeResult}

--- Strategic Recommendations ---
${strategyResult}

--- Legal Considerations ---
${legalResult}`;

  const writerResult = await callAgent(
    "writer",
    AGENT_PROMPTS.writer,
    writerContext,
    emit
  );

  outputs.writer = {
    agentId: "writer",
    status: writerResult.startsWith("[") ? "error" : "complete",
    content: writerResult,
    completedAt: now(),
  };

  emit({ type: "phase_complete", phase: 3, timestamp: now() });

  // ── Phase 4: Critic (sequential, needs writer output) ──
  const criticContext = `${writerContext}

--- Synthesized Deliverable ---
${writerResult}`;

  const criticResult = await callAgent(
    "critic",
    AGENT_PROMPTS.critic,
    criticContext,
    emit
  );

  outputs.critic = {
    agentId: "critic",
    status: criticResult.startsWith("[") ? "error" : "complete",
    content: criticResult,
    completedAt: now(),
  };

  emit({ type: "phase_complete", phase: 4, timestamp: now() });

  // ── Finalize ──
  const hasErrors = Object.values(outputs).some((o) => o.status === "error");

  run.agent_outputs = outputs;
  run.final_output = `${writerResult}\n\n---\n\n## Critical Review\n\n${criticResult}`;
  run.status = hasErrors ? "partial" : "complete";
  run.completed_at = now();

  emit({ type: "run_complete", run, timestamp: now() });

  return run;
}
