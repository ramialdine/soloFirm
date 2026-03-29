import { NextRequest, NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase";

function isAuthorized(req: NextRequest): boolean {
  const required = process.env.RUNS_API_KEY;
  if (!required) return true;
  const auth = req.headers.get("authorization") ?? "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  return token === required;
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = params;
  if (!id?.trim()) {
    return NextResponse.json({ error: "Run id is required" }, { status: 400 });
  }

  try {
    const sb = getServiceSupabase();
    const { data, error } = await sb
      .from("runs")
      .select("id,domain,task,status,agent_outputs,final_output,presentation,created_at,completed_at")
      .eq("id", id)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Run not found" }, { status: 404 });
    }

    return NextResponse.json({ run: data });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to fetch run" },
      { status: 500 }
    );
  }
}
