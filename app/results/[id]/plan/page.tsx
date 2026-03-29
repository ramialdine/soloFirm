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

  const presentation = run.presentation;

  // Prefer the composed planDocument (all 7 agents); fall back to planner-only then final_output
  const planDocument =
    presentation?.planDocument ??
    run.final_output ??
    run.agent_outputs?.planner?.content;

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
        presentation?.businessName ?? run.domain ?? "Your Business"
      }
      brandTheme={presentation?.brandTheme}
      roadmapSteps={presentation?.roadmap ?? []}
    />
  );
}
