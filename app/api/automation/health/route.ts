import { NextResponse } from "next/server";

const SIDECAR = process.env.AUTOMATION_SERVER_URL ?? "http://localhost:3001";

export async function GET() {
  try {
    const res = await fetch(`${SIDECAR}/health`, { signal: AbortSignal.timeout(3000) });
    if (res.ok) return NextResponse.json({ ok: true });
    return NextResponse.json({ ok: false, reason: "Sidecar returned an error" }, { status: 502 });
  } catch {
    return NextResponse.json({ ok: false, reason: "Automation server is not running" }, { status: 503 });
  }
}
