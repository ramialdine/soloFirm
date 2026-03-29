import { NextRequest, NextResponse } from "next/server";
import { CHAT_MODEL, getOpenAI } from "@/lib/openai";

export const maxDuration = 30;

const AI_TEST_MODE =
  process.env.AI_TEST_MODE === "true" || process.env.TEST_MODE === "true";

function toTitleCase(value: string) {
  return value
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function buildFallbackName(idea: string): string {
  const stop = new Set([
    "the", "and", "for", "with", "from", "that", "this", "your", "business",
    "service", "company", "startup", "platform", "app", "tool", "online",
    "local", "based", "help",
  ]);
  const keywords = idea
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length >= 4 && !stop.has(w))
    .slice(0, 2)
    .map(toTitleCase);
  const core = keywords[0] || "Northstar";
  const suffixes = ["Studio", "Works", "Labs", "Collective", "Foundry"];
  const idx =
    Math.abs(idea.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0)) %
    suffixes.length;
  return `${core} ${suffixes[idx]}`;
}

export async function POST(req: NextRequest) {
  try {
    const { businessIdea, location, budgetRange } = await req.json();

    if (!businessIdea?.trim()) {
      return NextResponse.json(
        { error: "businessIdea is required" },
        { status: 400 }
      );
    }

    if (AI_TEST_MODE) {
      const seed = toTitleCase(
        businessIdea.split(/\s+/).slice(0, 2).join(" ") || "Solo Launch"
      );
      return NextResponse.json({
        businessName: `${seed} Studio`,
        nameSuggestions: [
          `${seed} Studio`,
          `${seed} Labs`,
          `${seed} Works`,
          `${seed} Collective`,
          `${seed} Co.`,
        ],
        tagline: "From idea to launch in one run",
      });
    }

    const fallbackName = buildFallbackName(businessIdea);

    try {
      const openai = getOpenAI();
      const response = await openai.chat.completions.create({
        model: CHAT_MODEL,
        messages: [
          {
            role: "system",
            content: `You are a startup naming strategist. Return ONLY valid JSON:
{"businessName":"...","nameSuggestions":["...","...","...","..."],"tagline":"..."}

Rules:
- businessName: concept-driven, brandable, 1-3 words, pronounceable, NOT the literal first words of the idea.
- nameSuggestions: 4-6 distinct options including businessName. Vary styles — wordmark, metaphor, portmanteau, compound.
- tagline: one short phrase capturing the value proposition.
- No markdown fences, no prose outside the JSON.`,
          },
          {
            role: "user",
            content: `Business idea: ${businessIdea}\nLocation: ${location || "United States"}\nBudget: ${budgetRange || "Not specified"}`,
          },
        ],
        max_tokens: 400,
      });

      const raw = response.choices?.[0]?.message?.content ?? "";
      let parsed: {
        businessName?: string;
        nameSuggestions?: string[];
        tagline?: string;
      } | null = null;

      try {
        parsed = JSON.parse(raw.trim());
      } catch {
        const match = raw.match(/\{[\s\S]*\}/);
        if (match) {
          try {
            parsed = JSON.parse(match[0]);
          } catch { /* ignore */ }
        }
      }

      if (parsed?.businessName) {
        return NextResponse.json({
          businessName: toTitleCase(parsed.businessName),
          nameSuggestions: (parsed.nameSuggestions ?? [])
            .filter((s): s is string => typeof s === "string" && s.trim().length > 0)
            .map((s) => toTitleCase(s))
            .slice(0, 6),
          tagline: typeof parsed.tagline === "string" ? parsed.tagline : "",
        });
      }
    } catch { /* fall through to fallback */ }

    return NextResponse.json({
      businessName: fallbackName,
      nameSuggestions: [
        fallbackName,
        `${fallbackName.split(" ")[0]} Labs`,
        `${fallbackName.split(" ")[0]} Studio`,
        `${fallbackName.split(" ")[0]} Co.`,
      ],
      tagline: "",
    });
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
