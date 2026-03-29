import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    event: "run_complete",
    delivery: {
      source: "SoloFirm",
      configuredByEnv: "RUN_COMPLETE_WEBHOOK_URLS",
      signingHeader: "x-solofirm-signature",
      signingAlgorithm: "HMAC-SHA256",
      eventHeader: "x-solofirm-event",
    },
    payload: {
      event: "run_complete",
      timestamp: "2026-03-29T00:00:00.000Z",
      data: {
        id: "uuid",
        status: "complete",
        createdAt: "ISO-8601",
        completedAt: "ISO-8601",
        businessName: "string",
        roadmapSteps: 12,
      },
    },
  });
}
