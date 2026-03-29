import { getRun } from "@/lib/get-run";
import PlanPageClient from "./plan-client";
import PlanPageLoader from "./plan-loader";

export default async function PlanPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const run = await getRun(id);

  // If Supabase has the run, render server-side immediately
  if (run) {
    const presentation = run.presentation;
    const planDocument =
      presentation?.planDocument ??
      run.final_output ??
      run.agent_outputs?.planner?.content;

    if (planDocument) {
      return (
        <PlanPageClient
          planDocument={planDocument}
          businessName={
            presentation?.businessName ?? run.domain ?? "Your Business"
          }
          runId={id}
          brandTheme={presentation?.brandTheme}
          roadmapSteps={presentation?.roadmap ?? []}
        />
      );
    }
  }

  // Supabase row not ready yet — client component reads from sessionStorage
  return <PlanPageLoader runId={id} />;
}
