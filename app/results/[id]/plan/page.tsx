import { notFound } from "next/navigation";
import { getRun } from "@/lib/get-run";
import PlanPageClient from "./plan-client";

export default async function PlanPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const run = await getRun(id);

  if (!run) {
    notFound();
  }

  const plannerContent = run.agent_outputs?.planner?.content;
  const presentation = run.presentation;

  if (!plannerContent) {
    return (
      <div className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50 p-8 text-center">
        <p className="text-sm text-zinc-400">
          No plan available yet. Complete the agent pipeline to generate your
          full 90-day plan.
        </p>
      </div>
    );
  }

  return (
    <PlanPageClient
      plannerContent={plannerContent}
      businessName={presentation?.businessName ?? run.domain ?? "Your Business"}
      brandTheme={presentation?.brandTheme}
      roadmapSteps={presentation?.roadmap ?? []}
    />
  );
}
