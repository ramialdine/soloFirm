import { getRun } from "@/lib/get-run";
import type { AgentId } from "@/types/agents";
import { AGENT_META } from "@/types/agents";
import { MarkdownBody } from "@/components/OutputPanel";
import { SummaryCard } from "@/components/AgentCard";
import AgentOutputsLoader from "./agent-outputs-loader";

const AGENT_IDS: AgentId[] = [
  "planner",
  "research",
  "legal",
  "finance",
  "brand",
  "social",
  "critic",
];

export default async function ResultsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const run = await getRun(id);

  // No Supabase data yet — client reads from sessionStorage
  if (!run) {
    return <AgentOutputsLoader runId={id} />;
  }

  const hasPresentation = run.presentation && run.presentation.businessName;

  if (!hasPresentation) {
    return (
      <div className="space-y-6">
        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-zinc-900">{run.domain}</h1>
          <p className="mt-1 text-sm text-zinc-500">{run.task}</p>
        </div>

        <div>
          <h2 className="mb-3 text-sm font-medium text-zinc-700">
            Launch Package
          </h2>
          <div className="space-y-3">
            {AGENT_IDS.map((agentId) => {
              const output = run.agent_outputs?.[agentId];
              if (!output?.content) return null;
              const meta = AGENT_META[agentId];
              return (
                <details
                  key={agentId}
                  className="rounded-xl border border-zinc-200 bg-white shadow-sm group"
                  open={agentId === "planner"}
                >
                  <summary className="flex cursor-pointer items-center justify-between p-5 list-none">
                    <div>
                      <span className="font-semibold text-zinc-900">
                        {meta.label}
                      </span>
                      <span className="ml-2 text-sm text-zinc-400">
                        -- {meta.deliverable}
                      </span>
                    </div>
                    <span className="text-zinc-400 text-sm group-open:rotate-180 transition-transform">
                      {"\u25BC"}
                    </span>
                  </summary>
                  <div className="border-t border-zinc-100 px-6 py-5">
                    <MarkdownBody content={output.content} />
                  </div>
                </details>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  const presentation = run.presentation!;
  const { brandTheme } = presentation;
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
          <h1
            className="text-3xl sm:text-4xl font-bold text-zinc-900"
            style={{ fontFamily: `'${brandTheme.fontFamily}', sans-serif` }}
          >
            {presentation.businessName}
          </h1>
          <p className="mt-2 text-lg text-zinc-500">{presentation.tagline}</p>
          <div className="mt-5 flex items-center gap-2">
            {(["primaryColor", "secondaryColor", "accentColor"] as const).map(
              (key) => (
                <div
                  key={key}
                  className="h-5 w-5 rounded-full ring-2 ring-white shadow-sm"
                  style={{ backgroundColor: brandTheme[key] }}
                />
              )
            )}
            <span className="ml-2 text-xs text-zinc-400">
              {brandTheme.fontFamily}
            </span>
          </div>
        </div>
      </div>

      <div>
        <h2 className="mb-4 text-sm font-semibold text-zinc-700 uppercase tracking-wide">
          Agent Deliverables
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {AGENT_IDS.map((id) => {
            const summary = presentation.agentSummaries.find(
              (s) => s.agentId === id
            );
            if (!summary || !run.agent_outputs[id]?.content) return null;
            return (
              <div key={id} id={`agent-card-${id}`}>
                <SummaryCard
                  agentId={id}
                  summary={summary}
                  content={run.agent_outputs[id].content}
                  brandTheme={brandTheme}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
