"use client";

import { useEffect, useState } from "react";
import type { Run } from "@/types/agents";
import { getRunFromSession } from "@/lib/run-session";
import PlanPageClient from "./plan-client";

export default function PlanPageLoader({ runId }: { runId: string }) {
  const [run, setRun] = useState<Run | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setRun(getRunFromSession(runId));
    setChecked(true);
  }, [runId]);

  if (!checked) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-sm text-zinc-400">Loading your plan...</div>
      </div>
    );
  }

  const planDocument =
    run?.presentation?.planDocument ??
    run?.final_output ??
    run?.agent_outputs?.planner?.content;

  if (!planDocument) {
    return (
      <div className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50 p-8 text-center">
        <p className="text-sm text-zinc-400">
          No plan available yet. Complete the agent pipeline to generate your
          full launch plan.
        </p>
      </div>
    );
  }

  return (
    <PlanPageClient
      planDocument={planDocument}
      businessName={
        run?.presentation?.businessName ?? run?.domain ?? "Your Business"
      }
      runId={runId}
      brandTheme={run?.presentation?.brandTheme}
      roadmapSteps={run?.presentation?.roadmap ?? []}
    />
  );
}
