"use client";

import { useEffect, useState } from "react";
import type { Run, AgentId } from "@/types/agents";
import { AGENT_META } from "@/types/agents";
import { MarkdownBody } from "@/components/OutputPanel";
import { SummaryCard } from "@/components/AgentCard";

const AGENT_IDS: AgentId[] = [
  "planner",
  "research",
  "legal",
  "finance",
  "brand",
  "social",
  "critic",
];

export default function AgentOutputsLoader({ runId }: { runId: string }) {
  const [run, setRun] = useState<Run | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(`run_${runId}`);
      if (stored) setRun(JSON.parse(stored));
    } catch { /* non-fatal */ }
    setChecked(true);
  }, [runId]);

  if (!checked) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-sm text-zinc-400">Loading agent outputs...</div>
      </div>
    );
  }

  if (!run) {
    return (
      <div className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50 p-8 text-center">
        <p className="text-sm text-zinc-400">No agent data available.</p>
      </div>
    );
  }

  const presentation = run.presentation;
  const brandTheme = presentation?.brandTheme;

  if (presentation?.businessName && brandTheme) {
    const fontUrl = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(brandTheme.fontFamily)}:wght@400;600;700;800&display=swap`;
    return (
      <div className="space-y-6">
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link rel="stylesheet" href={fontUrl} />

        <div
          className="relative overflow-hidden rounded-2xl border border-zinc-200 shadow-sm"
          style={{
            background: `linear-gradient(135deg, ${brandTheme.primaryColor}08 0%, ${brandTheme.accentColor}12 100%)`,
            fontFamily: `'${brandTheme.fontFamily}', sans-serif`,
          }}
        >
          <div className="px-6 py-8 sm:px-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900" style={{ fontFamily: `'${brandTheme.fontFamily}', sans-serif` }}>
              {presentation.businessName}
            </h1>
            <p className="mt-2 text-lg text-zinc-500">{presentation.tagline}</p>
            <div className="mt-5 flex items-center gap-2">
              {(["primaryColor", "secondaryColor", "accentColor"] as const).map((key) => (
                <div key={key} className="h-5 w-5 rounded-full ring-2 ring-white shadow-sm" style={{ backgroundColor: brandTheme[key] }} />
              ))}
              <span className="ml-2 text-xs text-zinc-400">{brandTheme.fontFamily}</span>
            </div>
          </div>
        </div>

        <div>
          <h2 className="mb-4 text-sm font-semibold text-zinc-700 uppercase tracking-wide">Agent Deliverables</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {AGENT_IDS.map((id) => {
              const summary = presentation.agentSummaries?.find((s) => s.agentId === id);
              if (!summary || !run.agent_outputs[id]?.content) return null;
              return (
                <div key={id}>
                  <SummaryCard agentId={id} summary={summary} content={run.agent_outputs[id].content} brandTheme={brandTheme} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Legacy fallback
  return (
    <div className="space-y-3">
      {AGENT_IDS.map((id) => {
        const output = run.agent_outputs?.[id];
        if (!output?.content) return null;
        const meta = AGENT_META[id];
        return (
          <details key={id} className="rounded-xl border border-zinc-200 bg-white shadow-sm group" open={id === "planner"}>
            <summary className="flex cursor-pointer items-center justify-between p-5 list-none">
              <div>
                <span className="font-semibold text-zinc-900">{meta.label}</span>
                <span className="ml-2 text-sm text-zinc-400">— {meta.deliverable}</span>
              </div>
              <span className="text-zinc-400 text-sm group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div className="border-t border-zinc-100 px-6 py-5">
              <MarkdownBody content={output.content} />
            </div>
          </details>
        );
      })}
    </div>
  );
}
