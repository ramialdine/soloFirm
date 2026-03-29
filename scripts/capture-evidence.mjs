import fs from "node:fs/promises";

const BASE_URL = process.env.BENCH_BASE_URL || "http://localhost:3004";

const payload = {
  businessIdea: "Neighborhood bookkeeping and tax-prep studio for freelancers",
  location: "Rhode Island",
  budgetRange: "$1,000 - $5,000",
  entityPreference: "LLC",
  teamSize: "Solo",
};

function parseEventLine(line) {
  if (!line.startsWith("data: ")) return null;
  try {
    return JSON.parse(line.slice(6));
  } catch {
    return null;
  }
}

async function captureSSE() {
  const res = await fetch(`${BASE_URL}/api/orchestrate`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok || !res.body) {
    throw new Error(`orchestrate failed: ${res.status}`);
  }

  const events = [];
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let run = null;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      const event = parseEventLine(line.trim());
      if (!event) continue;
      events.push({
        type: event.type,
        agentId: event.agentId ?? null,
        phase: event.phase ?? null,
        timestamp: event.timestamp,
      });
      if (event.type === "run_complete" && event.run) {
        run = {
          id: event.run.id,
          createdAt: event.run.created_at,
          completedAt: event.run.completed_at,
          status: event.run.status,
          roadmapSteps: event.run.presentation?.roadmap?.length ?? 0,
        };
      }
    }
  }

  return { events, run };
}

async function captureAutomationChecks() {
  const healthRes = await fetch(`${BASE_URL}/api/automation/health`);
  const healthBody = await healthRes.text();

  const failRes = await fetch(`${BASE_URL}/api/automation/sessions`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ platforms: ["google-business"] }),
  });
  const failBody = await failRes.text();

  return {
    health: { status: healthRes.status, body: healthBody },
    controlledFailure: { status: failRes.status, body: failBody },
  };
}

async function main() {
  await fs.mkdir("docs/evidence", { recursive: true });

  const { events, run } = await captureSSE();
  const automation = await captureAutomationChecks();

  await fs.writeFile(
    "docs/evidence/sse-transcript.ndjson",
    `${events.map((e) => JSON.stringify(e)).join("\n")}\n`,
    "utf8"
  );

  await fs.writeFile(
    "docs/evidence/run-proof.json",
    `${JSON.stringify({ run, eventCount: events.length }, null, 2)}\n`,
    "utf8"
  );

  await fs.writeFile(
    "docs/evidence/reliability-check.json",
    `${JSON.stringify(automation, null, 2)}\n`,
    "utf8"
  );

  console.log("WROTE docs/evidence/sse-transcript.ndjson");
  console.log("WROTE docs/evidence/run-proof.json");
  console.log("WROTE docs/evidence/reliability-check.json");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
