"use client";

import { useEffect, useState } from "react";
import type { Run } from "@/types/agents";
import { getRunFromSession } from "@/lib/run-session";
import RoadmapPageClient from "./roadmap-client";

export default function RoadmapPageLoader({ runId }: { runId: string }) {
  const [run, setRun] = useState<Run | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setRun(getRunFromSession(runId));
    setChecked(true);
  }, [runId]);

  if (!checked) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-sm text-zinc-400">Loading roadmap...</div>
      </div>
    );
  }

  const presentation = run?.presentation;
  if (!presentation?.roadmap?.length) {
    return (
      <div className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50 p-8 text-center">
        <p className="text-sm text-zinc-400">
          No roadmap available yet. Complete the agent pipeline to generate your
          90-day roadmap.
        </p>
      </div>
    );
  }

  return <RoadmapPageClient runId={runId} presentation={presentation} />;
}
