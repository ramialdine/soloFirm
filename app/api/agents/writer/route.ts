import { NextRequest, NextResponse } from "next/server";
import { CHAT_MODEL, getOpenAI } from "@/lib/openai";
import { AGENT_PROMPTS } from "@/types/agents";

export async function POST(req: NextRequest) {
  try {
    const { domain, task, context } = await req.json();
    const openai = getOpenAI();

    const userMessage = context
      ? `Domain: ${domain}\nTask: ${task}\n\n${context}`
      : `Domain: ${domain}\nTask: ${task}`;

    const completion = await openai.chat.completions.create({
      model: CHAT_MODEL,
      messages: [
        { role: "system", content: AGENT_PROMPTS.writer },
        { role: "user", content: userMessage },
      ],
      max_tokens: 2000,
    });

    return NextResponse.json({
      agentId: "writer",
      content: completion.choices[0]?.message?.content ?? "",
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
