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

async function main() {
  const runId = await loadRunId();
  const before = await fetchRun(runId);

  const originalName = before?.presentation?.businessName ?? "Your Business";
  const updatedName = `${originalName} Verified`;

  const presentation = {
    ...(before.presentation ?? {}),
    businessName: updatedName,
  };

  const finalizeRes = await fetch(`${BASE_URL}/api/finalize`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ runId, presentation }),
  });

  const finalizeBody = await finalizeRes.text();
  const after = await fetchRun(runId);

  await fs.mkdir("docs/evidence", { recursive: true });
  await fs.writeFile(
    "docs/evidence/finalize-persistence.json",
    `${JSON.stringify(
      {
        runId,
        finalizeStatus: finalizeRes.status,
        finalizeBody,
        businessNameBefore: originalName,
        businessNameAfter: after?.presentation?.businessName ?? null,
        persisted: after?.presentation?.businessName === updatedName,
      },
      null,
      2
    )}\n`,
    "utf8"
  );

  console.log("WROTE docs/evidence/finalize-persistence.json");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
