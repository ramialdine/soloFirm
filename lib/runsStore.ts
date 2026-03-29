import fs from "node:fs/promises";
import path from "node:path";
import type { Run } from "@/types/agents";

export type PersistedRun = {
  id: string;
  domain: string;
  task: string;
  status: string;
  agent_outputs: Run["agent_outputs"];
  final_output: Run["final_output"];
  presentation: Run["presentation"];
  created_at: string;
  completed_at: string | null;
};

const STORE_DIR = path.join(process.cwd(), "data");
const STORE_FILE = path.join(STORE_DIR, "runs-local.json");

async function readRuns(): Promise<PersistedRun[]> {
  try {
    const raw = await fs.readFile(STORE_FILE, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as PersistedRun[]) : [];
  } catch {
    return [];
  }
}

async function writeRuns(rows: PersistedRun[]) {
  await fs.mkdir(STORE_DIR, { recursive: true });
  await fs.writeFile(STORE_FILE, `${JSON.stringify(rows, null, 2)}\n`, "utf8");
}

export async function upsertLocalRun(run: PersistedRun): Promise<void> {
  const rows = await readRuns();
  const idx = rows.findIndex((r) => r.id === run.id);
  if (idx >= 0) rows[idx] = run;
  else rows.unshift(run);
  await writeRuns(rows);
}

export async function getLocalRunById(id: string): Promise<PersistedRun | null> {
  const rows = await readRuns();
  return rows.find((row) => row.id === id) ?? null;
}

export async function listLocalRuns(limit: number): Promise<PersistedRun[]> {
  const rows = await readRuns();
  return rows
    .slice()
    .sort((a, b) => (a.created_at < b.created_at ? 1 : -1))
    .slice(0, limit);
}
