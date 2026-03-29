import { NextRequest, NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase";

type ExportFormat = "json" | "csv";

function isAuthorized(req: NextRequest): boolean {
  const required = process.env.RUNS_API_KEY;
  if (!required) return true;
  const auth = req.headers.get("authorization") ?? "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  return token === required;
}

function toCsvValue(value: unknown): string {
  const raw =
    value == null
      ? ""
      : typeof value === "string"
      ? value
      : JSON.stringify(value);
  return `"${raw.replaceAll('"', '""')}"`;
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const limitRaw = Number(url.searchParams.get("limit") ?? 50);
  const limit = Number.isFinite(limitRaw)
    ? Math.max(1, Math.min(500, Math.trunc(limitRaw)))
    : 50;
  const format = (url.searchParams.get("format") ?? "json") as ExportFormat;

  try {
    const sb = getServiceSupabase();
    const { data, error } = await sb
      .from("runs")
      .select("id,domain,task,status,agent_outputs,final_output,presentation,created_at,completed_at")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const rows = data ?? [];

    if (format === "csv") {
      const headers = [
        "id",
        "domain",
        "task",
        "status",
        "created_at",
        "completed_at",
        "final_output",
        "presentation",
      ];

      const csv = [
        headers.join(","),
        ...rows.map((row) =>
          [
            row.id,
            row.domain,
            row.task,
            row.status,
            row.created_at,
            row.completed_at,
            row.final_output,
            row.presentation,
          ]
            .map(toCsvValue)
            .join(",")
        ),
      ].join("\n");

      return new NextResponse(csv, {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="solofirm-runs-${new Date().toISOString().slice(0, 10)}.csv"`,
          "Cache-Control": "no-store",
        },
      });
    }

    return NextResponse.json(
      {
        exportedAt: new Date().toISOString(),
        count: rows.length,
        runs: rows,
      },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to export runs" },
      { status: 500 }
    );
  }
}
