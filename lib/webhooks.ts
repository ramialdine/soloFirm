import crypto from "crypto";
import type { Run } from "@/types/agents";

function parseWebhookTargets(): string[] {
  const raw = process.env.RUN_COMPLETE_WEBHOOK_URLS ?? "";
  return raw
    .split(",")
    .map((value) => value.trim())
    .filter((value) => /^https?:\/\//i.test(value));
}

function sign(body: string): string | null {
  const secret = process.env.WEBHOOK_SIGNING_SECRET?.trim();
  if (!secret) return null;
  return crypto.createHmac("sha256", secret).update(body).digest("hex");
}

export interface WebhookDeliverySummary {
  attempted: number;
  delivered: number;
  failed: number;
}

export async function deliverRunCompleteWebhook(run: Run): Promise<WebhookDeliverySummary> {
  const urls = parseWebhookTargets();
  if (urls.length === 0) return { attempted: 0, delivered: 0, failed: 0 };

  const payload = {
    event: "run_complete",
    timestamp: new Date().toISOString(),
    data: {
      id: run.id,
      status: run.status,
      createdAt: run.created_at,
      completedAt: run.completed_at,
      businessName: run.presentation?.businessName ?? run.domain,
      roadmapSteps: run.presentation?.roadmap?.length ?? 0,
    },
  };

  const body = JSON.stringify(payload);
  const signature = sign(body);

  const results = await Promise.allSettled(
    urls.map(async (url) => {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-solofirm-event": "run_complete",
          ...(signature ? { "x-solofirm-signature": signature } : {}),
        },
        body,
        signal: AbortSignal.timeout(4000),
      });
      return res.ok;
    })
  );

  const delivered = results.filter(
    (result) => result.status === "fulfilled" && result.value
  ).length;

  return {
    attempted: urls.length,
    delivered,
    failed: urls.length - delivered,
  };
}
