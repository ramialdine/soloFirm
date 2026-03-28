import { NextRequest } from "next/server";
import { orchestrate } from "@/lib/orchestrator";
import { getServiceSupabase } from "@/lib/supabase";
import type { SSEEvent } from "@/types/agents";

export const maxDuration = 120; // Allow up to 2 minutes for full orchestration

export async function POST(req: NextRequest) {
  try {
    const { domain, task } = await req.json();

    if (!domain || !task) {
      return new Response(
        JSON.stringify({ error: "domain and task are required" }),
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
          const run = await orchestrate({ domain, task }, emit);

          // Persist to Supabase (best-effort, don't fail the stream)
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
            // Supabase persistence is best-effort for MVP
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
