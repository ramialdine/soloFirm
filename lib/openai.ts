import OpenAI from "openai";

let _client: OpenAI | null = null;

const GEMINI_OPENAI_BASE_URL =
  "https://generativelanguage.googleapis.com/v1beta/openai/";

export const CHAT_MODEL =
  process.env.AI_MODEL ?? process.env.OPENAI_MODEL ?? "gemini-2.5-flash";

export function getOpenAI(): OpenAI {
  const geminiApiKey = process.env.GEMINI_API_KEY;
  const openAiApiKey = process.env.OPENAI_API_KEY;
  const apiKey = geminiApiKey ?? openAiApiKey;

  if (!apiKey) {
    throw new Error("Missing AI API key. Set GEMINI_API_KEY or OPENAI_API_KEY.");
  }

  if (!_client) {
    _client = new OpenAI({
      apiKey,
      ...(geminiApiKey ? { baseURL: GEMINI_OPENAI_BASE_URL } : {}),
    });
  }
  return _client;
}
