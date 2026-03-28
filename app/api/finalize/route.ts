import { NextRequest } from "next/server";
import { getServiceSupabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { runId, presentation } = await req.json();

    if (!runId || !presentation) {
      return new Response(
        JSON.stringify({ error: "runId and presentation are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    try {
      const sb = getServiceSupabase();
      await sb
        .from("runs")
        .update({ presentation })
        .eq("id", runId);
    } catch {
      // best-effort — Supabase may not be configured
    }

    return new Response(JSON.stringify({ ok: true }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return new Response(
      JSON.stringify({ error: "Invalid request body" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }
}
