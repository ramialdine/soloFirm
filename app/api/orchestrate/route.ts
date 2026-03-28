import { NextRequest } from "next/server";
import { orchestrate } from "@/lib/orchestrator";
import { getServiceSupabase } from "@/lib/supabase";
import type { SSEEvent } from "@/types/agents";

export const maxDuration = 300;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      businessIdea,
      location,
      budgetRange,
      entityPreference,
      teamSize,
      documents,
      clarifyingAnswers,
      planSummary,
    } = body;

    if (!businessIdea) {
      return new Response(
        JSON.stringify({ error: "businessIdea is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        const emit = (event: SSEEvent) => {
          const data = `data: ${JSON.stringify(event)}\n\n`;
          controller.enqueue(encoder.encode(data));
        };

        try {
          const run = await orchestrate(
            {
              businessIdea,
              location: location || "United States",
              budgetRange: budgetRange || "Not specified",
              entityPreference: entityPreference || "Not sure",
              teamSize: teamSize || "Solo",
              documents,
              clarifyingAnswers,
              planSummary,
            },
            emit
          );

          // Persist to Supabase (best-effort)
          try {
            const sb = getServiceSupabase();
            await sb.from("runs").upsert({
              id: run.id,
              domain: run.domain,
              task: run.task,
              status: run.status,
              agent_outputs: run.agent_outputs,
              final_output: run.final_output,
              created_at: run.created_at,
              completed_at: run.completed_at,
            });
          } catch {
            // best-effort
          }

          controller.close();
        } catch (err: unknown) {
          emit({
            type: "run_error",
            error: err instanceof Error ? err.message : "Unknown error",
            timestamp: new Date().toISOString(),
          });
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch {
    return new Response(
      JSON.stringify({ error: "Invalid request body" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }
}
