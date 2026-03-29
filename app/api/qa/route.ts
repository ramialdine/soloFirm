import { NextRequest } from "next/server";
import { getOpenAI, CHAT_MODEL } from "@/lib/openai";
import type { IntakeData, QAHistoryEntry } from "@/types/agents";
import { QA_ROUND1_PROMPT, QA_ROUND2_PROMPT, QA_FINALIZE_PROMPT } from "@/types/agents";

export const maxDuration = 30;
const TEST_MODE = process.env.TEST_MODE === "true";

function buildIntakeContext(intake: IntakeData): string {
  return `FOUNDER INTAKE:
- Business Idea: ${intake.businessIdea}
- Operating State: ${intake.location}
- Starting Budget: ${intake.budgetRange}
- Entity Preference: ${intake.entityPreference}
- Team Size: ${intake.teamSize}${intake.documents ? `\n- Uploaded Documents:\n${intake.documents}` : ""}`;
}

function buildContextWithHistory(intake: IntakeData, history: QAHistoryEntry[]): string {
  const intakeCtx = buildIntakeContext(intake);
  if (!history.length) return intakeCtx;
  const qaCtx = history
    .map((h, i) => `Q${i + 1}: ${h.question}\nA${i + 1}: ${h.answer}`)
    .join("\n\n");
  return `${intakeCtx}\n\nCLARIFYING Q&A:\n${qaCtx}`;
}

/** Try several strategies to extract JSON from a raw LLM response string. */
function extractJSON(raw: string): Record<string, unknown> | null {
  if (!raw?.trim()) return null;

  // Strategy 1: direct parse
  try { return JSON.parse(raw.trim()); } catch { /* continue */ }

  // Strategy 2: strip markdown fences  ```json ... ```
  try {
    const fenced = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();
    return JSON.parse(fenced);
  } catch { /* continue */ }

  // Strategy 3: find the first {...} block in the response
  try {
    const match = raw.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]);
  } catch { /* continue */ }

  return null;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      intake: IntakeData;
      round?: 1 | 2;
      history?: QAHistoryEntry[];
      finalize?: boolean;
    };

    const { intake, round = 1, history = [], finalize = false } = body;

    if (!intake?.businessIdea) {
      return Response.json({ error: "businessIdea is required" }, { status: 400 });
    }

    if (TEST_MODE) {
      if (finalize) {
        return Response.json({
          plan: `## Business Overview\n${intake.businessIdea} is positioned for a fast, low-friction launch in ${intake.location}.\n\n## Target Market\nEarly adopters with high urgency and clear willingness to pay.\n\n## Revenue & Pricing Model\nSimple starter package + premium upsell path.\n\n## Competitive Positioning\nFaster execution and clearer onboarding than local alternatives.\n\n## Key Risks\nExecution consistency, channel fit, and cash discipline.\n\n## First 90 Days — Priorities\n1) Validate demand, 2) Formalize entity + banking, 3) Launch offer and acquisition loop.`,
        });
      }

      if (round === 1) {
        return Response.json({
          questions: [
            {
              question: "Which business name direction do you prefer?",
              options: ["Professional and trust-based", "Modern and bold", "Friendly and local"],
            },
            {
              question: "How should you deliver your core service first?",
              options: ["Hands-on local delivery", "Fully online workflow", "Hybrid model"],
            },
            {
              question: "Which customer acquisition channel should lead launch?",
              options: ["Direct outreach", "Social content", "Referral partnerships"],
            },
          ],
        });
      }

      return Response.json({
        ready: true,
        message: "Great choices — we have enough data to build your launch package.",
      });
    }

    const openai = getOpenAI();
    const context = buildContextWithHistory(intake, history);

    // ── Finalize: produce a structured plan summary ──────────────────────
    if (finalize) {
      const response = await openai.chat.completions.create({
        model: CHAT_MODEL,
        messages: [
          { role: "system", content: QA_FINALIZE_PROMPT },
          { role: "user", content: context },
        ],
        max_tokens: 2048,
      });
      const plan = response.choices?.[0]?.message?.content ?? "";
      return Response.json({ plan });
    }

    // ── Round 1 or 2: return structured questions ────────────────────────
    const systemPrompt = round === 1 ? QA_ROUND1_PROMPT : QA_ROUND2_PROMPT;

    // Append a reminder to the user message so models that ignore system prompts still output JSON
    const userMessage = `${context}\n\nIMPORTANT: Respond with ONLY a raw JSON object (no markdown, no backticks, no explanation). Follow the exact schema in your instructions.`;

    const response = await openai.chat.completions.create({
      model: CHAT_MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
      max_tokens: 1024,
    });

    const raw = response.choices?.[0]?.message?.content ?? "";
    const parsed = extractJSON(raw);

    if (!parsed) {
      console.error("Q&A: failed to parse JSON from model response:", raw.slice(0, 300));
      // Return a safe fallback instead of crashing
      return Response.json({
        questions: [
          {
            question: "How do you plan to primarily reach your first customers?",
            options: [
              "Social media & organic content",
              "Personal network & word of mouth",
              "Paid ads or local partnerships",
            ],
          },
          {
            question: "What's the core way your business makes money?",
            options: [
              "Recurring subscription or membership",
              "Per-session, per-project, or one-time fee",
              "Product sales or e-commerce",
            ],
          },
          {
            question: "How will you deliver your product or service?",
            options: [
              "In-person or locally",
              "Fully online or remote",
              "Hybrid — both in-person and online",
            ],
          },
        ],
      });
    }

    if (round === 2) {
      if (parsed.ready === true) {
        return Response.json({
          ready: true,
          message: parsed.message ?? "I have everything I need to build your plan!",
        });
      }
      const questions = Array.isArray(parsed.questions) ? parsed.questions : [];
      if (questions.length === 0) {
        return Response.json({ ready: true, message: "Perfect — building your plan now!" });
      }
      return Response.json({ ready: false, questions: questions.slice(0, 2) });
    }

    // Round 1
    const questions = Array.isArray(parsed.questions) ? parsed.questions : [];
    return Response.json({ questions: questions.slice(0, 4) });
  } catch (err) {
    console.error("Q&A route error:", err);
    // Hard fallback — never leave the user stuck
    return Response.json({
      questions: [
        {
          question: "How do you plan to primarily reach your first customers?",
          options: [
            "Social media & organic content",
            "Personal network & word of mouth",
            "Paid ads or local partnerships",
          ],
        },
        {
          question: "What's the core way your business makes money?",
          options: [
            "Recurring subscription or membership",
            "Per-session, per-project, or one-time fee",
            "Product sales or e-commerce",
          ],
        },
      ],
    });
  }
}
