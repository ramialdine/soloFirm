import fs from "node:fs/promises";

const BASE_URL = process.env.BENCH_BASE_URL || "http://localhost:3004";

function parseEventLine(line) {
  if (!line.startsWith("data: ")) return null;
  try {
    return JSON.parse(line.slice(6));
  } catch {
    return null;
  }
}

async function openSession() {
  const res = await fetch(`${BASE_URL}/api/automation/sessions`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      businessName: "SoloFirm Evidence Session",
      platforms: ["google-business"],
    }),
  });

  const body = await res.json();
  if (!res.ok || !body?.sessionId) {
    throw new Error(`session start failed: ${res.status} ${JSON.stringify(body)}`);
  }

  return body.sessionId;
}

async function captureEvents(sessionId) {
  const res = await fetch(`${BASE_URL}/api/automation/sessions/${sessionId}/events`);
  if (!res.ok || !res.body) {
    throw new Error(`events stream failed: ${res.status}`);
  }

  const events = [];
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  const deadline = Date.now() + 15000;

  while (Date.now() < deadline) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      const event = parseEventLine(line.trim());
      if (!event) continue;
      events.push(event);
      if (event.type === "status" && event.status === "complete") {
        return events;
      }
    }
  }

  return events;
}

async function captureResumeAttempt(sessionId) {
  const res = await fetch(`${BASE_URL}/api/automation/sessions/${sessionId}/resume`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ code: "000000" }),
  });
  return {
    status: res.status,
    body: await res.text(),
  };
}

async function main() {
  await fs.mkdir("docs/evidence", { recursive: true });

  const sessionId = await openSession();
  const events = await captureEvents(sessionId);
  const resumeAttempt = await captureResumeAttempt(sessionId);

  await fs.writeFile(
    "docs/evidence/automation-events.ndjson",
    `${events.map((e) => JSON.stringify(e)).join("\n")}\n`,
    "utf8"
  );

  await fs.writeFile(
    "docs/evidence/automation-resume-check.json",
    `${JSON.stringify({ sessionId, resumeAttempt }, null, 2)}\n`,
    "utf8"
  );

  console.log("WROTE docs/evidence/automation-events.ndjson");
  console.log("WROTE docs/evidence/automation-resume-check.json");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
