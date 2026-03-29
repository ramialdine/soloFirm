import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

const SIDECAR = process.env.AUTOMATION_SERVER_URL ?? "http://localhost:3001";
const SECRET = process.env.AUTOMATION_SECRET ?? "dev-secret";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const upstream = await fetch(`${SIDECAR}/sessions/${id}/events`, {
    headers: { Authorization: `Bearer ${SECRET}` },
  });

  if (!upstream.ok || !upstream.body) {
    return new Response(JSON.stringify({ error: "Session not found" }), { status: 404 });
  }

  return new Response(upstream.body, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
