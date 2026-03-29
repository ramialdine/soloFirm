import { NextRequest, NextResponse } from "next/server";
import { CHAT_MODEL, getOpenAI } from "@/lib/openai";

export const maxDuration = 45;
const AI_TEST_MODE =
  process.env.AI_TEST_MODE === "true" || process.env.TEST_MODE === "true";

function extractSvg(raw: string): string | null {
  if (!raw) return null;
  const match = raw.match(/<svg[\s\S]*?<\/svg>/i);
  if (!match) return null;
  return match[0]
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/on\w+="[^"]*"/gi, "");
}

export async function POST(req: NextRequest) {
  try {
    const { businessName, tagline, brandTheme, logoPrompt, businessContext } = await req.json();

    if (!businessName?.trim()) {
      return NextResponse.json({ error: "businessName is required" }, { status: 400 });
    }

    if (AI_TEST_MODE) {
      const svg = `<svg width="1200" height="320" viewBox="0 0 1200 320" fill="none" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${brandTheme?.secondaryColor || "#2563EB"}"/><stop offset="1" stop-color="${brandTheme?.accentColor || "#10B981"}"/></linearGradient></defs><rect x="24" y="24" width="272" height="272" rx="56" fill="url(#g)"/><path d="M95 188c18 20 36 30 61 30 25 0 40-10 40-25 0-13-8-20-29-24l-31-6c-42-8-62-30-62-64 0-37 31-62 77-62 31 0 59 11 78 31" stroke="white" stroke-width="20" stroke-linecap="round"/><text x="338" y="170" fill="#0F172A" font-family="Inter, Arial, sans-serif" font-size="110" font-weight="800">${String(businessName).replace(/</g, "&lt;")}</text><text x="342" y="218" fill="#475569" font-family="Inter, Arial, sans-serif" font-size="34">${String(tagline || "Launch your business in one run").replace(/</g, "&lt;")}</text></svg>`;
      return NextResponse.json({ svg });
    }

    const contextLine = businessContext ? `\nBusiness: ${businessContext}` : "";
    const prompt = logoPrompt || `Design a modern SVG logo for "${businessName}".
Tagline: ${tagline || ""}${contextLine}
Brand colors: primary ${brandTheme?.primaryColor || "#2563EB"}, secondary ${brandTheme?.secondaryColor || "#0F172A"}, accent ${brandTheme?.accentColor || "#10B981"}.
Font: ${brandTheme?.fontFamily || "Inter"}.

Requirements:
- Return ONLY valid SVG markup (no markdown fences, no prose).
- 1200x320 viewBox optimized for web header.
- Include icon + wordmark text "${businessName}" using the specified font family.
- The icon should visually represent the business domain/industry.
- Professional, minimal, startup aesthetic.
- Accessible contrast, transparent background.
- Use clean geometric shapes and readable text.`;

    const openai = getOpenAI();
    const completion = await openai.chat.completions.create({
      model: CHAT_MODEL,
      messages: [
        {
          role: "system",
          content: "You are a brand designer. Output only raw SVG markup.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 2000,
    });

    const raw = completion.choices?.[0]?.message?.content ?? "";
    const svg = extractSvg(raw);

    if (!svg) {
      return NextResponse.json(
        { error: "Model did not return valid SVG" },
        { status: 422 }
      );
    }

    return NextResponse.json({ svg });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
