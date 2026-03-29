const runs = [
  {
    businessIdea: "Mobile car detailing service for busy professionals in Providence",
    location: "Rhode Island",
    budgetRange: "$5,000 - $25,000",
    entityPreference: "LLC",
    teamSize: "Solo",
  },
  {
    businessIdea: "Boutique bookkeeping studio for freelancers and contractors",
    location: "Rhode Island",
    budgetRange: "$1,000 - $5,000",
    entityPreference: "LLC",
    teamSize: "Solo",
  },
  {
    businessIdea: "At-home personal training and nutrition coaching business",
    location: "Rhode Island",
    budgetRange: "$1,000 - $5,000",
    entityPreference: "LLC",
    teamSize: "Solo",
  },
];

const BASE_URL = process.env.BENCH_BASE_URL || "http://localhost:3003";
const OUTPUT_FILE = process.env.BENCH_OUTPUT_FILE || "docs/benchmark-results.json";

function parseEventLine(line) {
  if (!line.startsWith("data: ")) return null;
  try {
    return JSON.parse(line.slice(6));
  } catch {
    return null;
  }
}

function specificity(steps) {
  if (!Array.isArray(steps) || steps.length === 0) return 0;
  const vague = /(optimi[sz]e|improve|analyze|review|consider|research\b)/i;
  const concrete = steps.filter((s) => {
    const action = String(s?.action ?? "");
    const title = String(s?.title ?? "");
    return action.length >= 20 && !vague.test(title);
  });
  return Math.round((concrete.length / steps.length) * 100);
}

async function runOnce(payload) {
  const res = await fetch(`${BASE_URL}/api/orchestrate`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok || !res.body) {
    throw new Error(`orchestrate failed: ${res.status}`);
  }

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
      if (event?.type === "run_complete" && event.run) {
        run = event.run;
      }
    }
  }

  if (!run) {
    throw new Error("run_complete event missing");
  }

  const createdAt = run.created_at;
  const completedAt = run.completed_at;
  const tlrMin = ((new Date(completedAt) - new Date(createdAt)) / 60000).toFixed(2);
  const steps = run.presentation?.roadmap ?? [];

  let automationStarted = false;
  try {
    const businessName = run.presentation?.businessName || "SoloFirm Benchmark Business";
    const aRes = await fetch(`${BASE_URL}/api/automation/sessions`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ businessName, platforms: ["google-business"] }),
    });
    const aData = await aRes.json();
    automationStarted = Boolean(aRes.ok && aData?.sessionId);
  } catch {
    automationStarted = false;
  }

  return {
    runId: run.id,
    businessIdea: payload.businessIdea,
    createdAt,
    completedAt,
    tlrMin,
    stepsGenerated: steps.length,
    specificPct: specificity(steps),
    automationStarted,
  };
}

async function main() {
  const fs = await import("node:fs/promises");
  const results = [];
  for (const payload of runs) {
    const result = await runOnce(payload);
    results.push(result);
    console.log(
      `DONE ${result.runId} | TLR ${result.tlrMin} min | steps ${result.stepsGenerated} | automation ${result.automationStarted}`
    );
  }

  console.log("JSON_RESULT_START");
  console.log(JSON.stringify(results, null, 2));
  console.log("JSON_RESULT_END");

  await fs.writeFile(OUTPUT_FILE, `${JSON.stringify(results, null, 2)}\n`, "utf8");
  console.log(`WROTE ${OUTPUT_FILE}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
