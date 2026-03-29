import type { Run } from "@/types/agents";

/**
 * Shared helpers for reading/writing run data in sessionStorage.
 * Used by AgentOrchestrator (write) and result page loaders (read)
 * to bridge the gap between SSE completion and Supabase persistence.
 */

const RUN_KEY_PREFIX = "run_";

export function saveRunToSession(run: Run): void {
  try {
    sessionStorage.setItem(`${RUN_KEY_PREFIX}${run.id}`, JSON.stringify(run));
  } catch {
    // storage full — non-fatal
  }
}

export function getRunFromSession(runId: string): Run | null {
  try {
    const stored = sessionStorage.getItem(`${RUN_KEY_PREFIX}${runId}`);
    return stored ? (JSON.parse(stored) as Run) : null;
  } catch {
    return null;
  }
}
