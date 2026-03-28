import { NextRequest, NextResponse } from "next/server";
import { CHAT_MODEL, getOpenAI } from "@/lib/openai";
import { AGENT_PROMPTS } from "@/types/agents";

export async function POST(req: NextRequest) {
  try {
    const { context } = await req.json();
    const openai = getOpenAI();

    const completion = await openai.chat.completions.create({
      model: CHAT_MODEL,
      messages: [
        { role: "system", content: AGENT_PROMPTS.planner },
        { role: "user", content: context ?? "" },
      ],
      max_tokens: 4000,
    });

    return NextResponse.json({
      agentId: "planner",
      content: completion.choices[0]?.message?.content ?? "",
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
