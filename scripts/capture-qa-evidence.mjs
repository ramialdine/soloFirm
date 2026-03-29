import fs from "node:fs/promises";

const BASE_URL = process.env.BENCH_BASE_URL || "http://localhost:3004";

const intake = {
  businessIdea: "Mobile car detailing service for busy professionals in Providence",
  location: "Rhode Island",
  budgetRange: "$5,000 - $25,000",
  entityPreference: "LLC",
  teamSize: "Solo",
};

const expectedTerms = ["detailing", "providence", "mobile", "professionals", "rhode island"];

function calcSpecificity(questions) {
  if (!Array.isArray(questions) || questions.length === 0) return 0;
  const hits = questions.filter((q) => {
    const text = String(q?.question ?? "").toLowerCase();
    return expectedTerms.some((term) => text.includes(term));
  }).length;
  return Math.round((hits / questions.length) * 100);
}

async function main() {
  const res = await fetch(`${BASE_URL}/api/qa`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ intake, round: 1, history: [] }),
  });

  const data = await res.json();
  const questions = data.questions ?? [];
  const specificityPct = calcSpecificity(questions);

  await fs.mkdir("docs/evidence", { recursive: true });
  await fs.writeFile(
    "docs/evidence/qa-specificity.json",
    `${JSON.stringify({ specificityPct, questions }, null, 2)}\n`,
    "utf8"
  );

  console.log("WROTE docs/evidence/qa-specificity.json");
  console.log(`SPECIFICITY ${specificityPct}%`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
