import { notFound } from "next/navigation";
import { getRun } from "@/lib/get-run";
import RoadmapPageClient from "./roadmap-client";

export default async function RoadmapPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const run = await getRun(id);

  if (!run) {
    notFound();
  }

  const presentation = run.presentation;

  if (!presentation || !presentation.roadmap?.length) {
    return (
      <div className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50 p-8 text-center">
        <p className="text-sm text-zinc-400">
          No roadmap available yet. Complete the agent pipeline to generate your
          90-day roadmap.
        </p>
      </div>
    );
  }

  return (
    <RoadmapPageClient
      runId={id}
      presentation={presentation}
    />
  );
}
