import { NextRequest } from "next/server";
import { getOpenAI, CHAT_MODEL } from "@/lib/openai";
import type { IntakeData, QAMessage, QAPhase } from "@/types/agents";
import { QA_SYSTEM_PROMPT, QA_FINALIZE_PROMPT } from "@/types/agents";

export const maxDuration = 30;

function buildIntakeContext(intake: IntakeData): string {
  return `FOUNDER INTAKE:
- Business Idea: ${intake.businessIdea}
- Location: ${intake.location}
- Budget Range: ${intake.budgetRange}
- Entity Preference: ${intake.entityPreference}
- Team Size: ${intake.teamSize}${intake.documents ? `\n- Uploaded Documents:\n${intake.documents}` : ""}`;
}

export async function POST(req: NextRequest) {
  try {
    const { intake, messages } = (await req.json()) as {
      intake: IntakeData;
      messages: QAMessage[];
    };

    if (!intake?.businessIdea) {
      return Response.json(
        { error: "businessIdea is required" },
        { status: 400 }
      );
    }

    const openai = getOpenAI();
    const intakeContext = buildIntakeContext(intake);

    // Determine phase: if we only have the intake (no user answers yet), ask questions.
    // If we have user answers, finalize the plan summary.
    const hasUserAnswers = messages.some((m) => m.role === "user");
    const systemPrompt = hasUserAnswers ? QA_FINALIZE_PROMPT : QA_SYSTEM_PROMPT;

    const chatMessages: Array<{ role: "system" | "user" | "assistant"; content: string }> = [
      { role: "system", content: systemPrompt },
      { role: "user", content: intakeContext },
    ];

    // Add conversation history
    for (const msg of messages) {
      chatMessages.push({ role: msg.role, content: msg.content });
    }

    const response = await openai.chat.completions.create({
      model: CHAT_MODEL,
      messages: chatMessages,
      max_tokens: 1500,
    });

    const content = response.choices?.[0]?.message?.content ?? "";
    const phase: QAPhase = hasUserAnswers ? "complete" : "asking";

    return Response.json({
      message: content,
      phase,
      ...(phase === "complete" ? { plan: content } : {}),
    });
  } catch (err) {
    console.error("Q&A error:", err);
    return Response.json(
      { error: "Failed to process Q&A" },
      { status: 500 }
    );
  }
}
