import fs from "node:fs/promises";

const BASE_URL = process.env.BENCH_BASE_URL || "http://localhost:3004";

async function loadRunId() {
  const raw = await fs.readFile("docs/benchmark-results.json", "utf8");
  const rows = JSON.parse(raw);
  if (!Array.isArray(rows) || rows.length === 0) {
    throw new Error("benchmark-results.json has no runs");
  }
  return rows[0].runId;
}

async function fetchRun(runId) {
  const res = await fetch(`${BASE_URL}/api/runs/${runId}`);
  if (!res.ok) throw new Error(`fetch run failed: ${res.status}`);
  const body = await res.json();
  return body.run;
}

function progress(steps = []) {
  const total = Array.isArray(steps) ? steps.length : 0;
  if (total === 0) return { total: 0, complete: 0, pct: 0 };
  const complete = steps.filter((s) => s?.status === "complete").length;
  return { total, complete, pct: Math.round((complete / total) * 100) };
}

async function main() {
  const runId = await loadRunId();
  const before = await fetchRun(runId);

  const steps = [...(before?.presentation?.roadmap ?? [])];
  const beforeProgress = progress(steps);

  const nowIso = new Date().toISOString();
  const updatedSteps = steps.map((step, idx) =>
    idx < 2
      ? { ...step, status: "complete", completedAt: nowIso }
      : step
  );

  const presentation = {
    ...(before.presentation ?? {}),
    roadmap: updatedSteps,
  };

  const finalizeRes = await fetch(`${BASE_URL}/api/finalize`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ runId, presentation }),
  });

  const after = await fetchRun(runId);
  const afterProgress = progress(after?.presentation?.roadmap ?? []);

  await fs.mkdir("docs/evidence", { recursive: true });
  await fs.writeFile(
    "docs/evidence/progress-update.json",
    `${JSON.stringify(
      {
        runId,
        finalizeStatus: finalizeRes.status,
        before: beforeProgress,
        after: afterProgress,
      },
      null,
      2
    )}\n`,
    "utf8"
  );

  console.log("WROTE docs/evidence/progress-update.json");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
