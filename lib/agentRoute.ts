import { NextRequest, NextResponse } from "next/server";
import { CHAT_MODEL, getOpenAI } from "@/lib/openai";
import { AGENT_PROMPTS, type AgentId } from "@/types/agents";

type BodyShape = {
  domain?: string;
  task?: string;
  context?: string;
};

interface AgentRouteConfig {
  agentId: AgentId;
  maxTokens: number;
  mode: "context" | "domain-task";
}

function buildUserMessage(body: BodyShape, mode: AgentRouteConfig["mode"]) {
  if (mode === "context") {
    return body.context ?? "";
  }

  const domain = body.domain ?? "";
  const task = body.task ?? "";
  const context = body.context?.trim();
  return context
    ? `Domain: ${domain}\nTask: ${task}\n\n${context}`
    : `Domain: ${domain}\nTask: ${task}`;
}

export function createAgentRoute(config: AgentRouteConfig) {
  return async function POST(req: NextRequest) {
    try {
      const body = (await req.json()) as BodyShape;
      const openai = getOpenAI();

      const completion = await openai.chat.completions.create({
        model: CHAT_MODEL,
        messages: [
          { role: "system", content: AGENT_PROMPTS[config.agentId] },
          { role: "user", content: buildUserMessage(body, config.mode) },
        ],
        max_tokens: config.maxTokens,
      });

      return NextResponse.json({
        agentId: config.agentId,
        content: completion.choices[0]?.message?.content ?? "",
      });
    } catch (err: unknown) {
      return NextResponse.json(
        { error: err instanceof Error ? err.message : "Unknown error" },
        { status: 500 }
      );
    }
  };
}
