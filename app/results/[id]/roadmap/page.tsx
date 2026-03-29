import { getRun } from "@/lib/get-run";
import RoadmapPageClient from "./roadmap-client";
import RoadmapPageLoader from "./roadmap-loader";

export default async function RoadmapPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const run = await getRun(id);

  if (run?.presentation?.roadmap?.length) {
    return (
      <RoadmapPageClient runId={id} presentation={run.presentation} />
    );
  }

  // Supabase row not ready yet — client reads from sessionStorage
  return <RoadmapPageLoader runId={id} />;
}
