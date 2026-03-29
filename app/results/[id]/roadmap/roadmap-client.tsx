"use client";

import type { Presentation } from "@/types/agents";
import RoadmapTimeline from "@/components/RoadmapTimeline";

interface RoadmapPageClientProps {
  runId: string;
  presentation: Presentation;
}

export default function RoadmapPageClient({
  runId,
  presentation,
}: RoadmapPageClientProps) {
  const { brandTheme, roadmap } = presentation;
  const fontUrl = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(brandTheme.fontFamily)}:wght@400;600;700;800&display=swap`;

  return (
    <div className="space-y-6">
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link rel="stylesheet" href={fontUrl} />

      {/* Roadmap hero */}
      <div
        className="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-8 shadow-sm"
        style={{
          background: `linear-gradient(180deg, ${brandTheme.accentColor}06 0%, white 30%)`,
          fontFamily: `'${brandTheme.fontFamily}', sans-serif`,
        }}
      >
        <RoadmapTimeline
          steps={roadmap}
          accentColor={brandTheme.accentColor}
          selectedBusinessStructure={presentation.selectedBusinessStructure}
          businessStructureOptions={[
            "LLC",
            "S-Corp",
            "C-Corp",
            "Sole Proprietorship",
            "Not sure",
          ]}
          runId={runId}
          businessState={presentation.location}
          businessName={presentation.businessName}
          teamSize={presentation.teamSize}
        />
      </div>
    </div>
  );
}
