import { notFound } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import type { Run, AgentId } from "@/types/agents";
import { AGENT_META } from "@/types/agents";
import { MarkdownBody } from "@/components/OutputPanel";

async function getRun(id: string): Promise<Run | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  const sb = createClient(url, key);
  const { data } = await sb.from("runs").select("*").eq("id", id).single();
  return data as Run | null;
}

const AGENT_IDS: AgentId[] = ["planner", "research", "legal", "finance", "brand", "critic"];

export default async function ResultsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const run = await getRun(id);

  if (!run) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <nav className="border-b border-zinc-200 bg-white px-6 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-tight text-zinc-900">SoloFirm</Link>
          <Link href="/dashboard" className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700">
            Launch Your Business
          </Link>
        </div>
      </nav>

      <div className="mx-auto max-w-5xl space-y-8 p-6">
        {/* Header */}
        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center gap-3">
            <span className={`rounded-full px-3 py-1 text-xs font-medium ${
              run.status === "complete" ? "bg-emerald-100 text-emerald-700"
                : run.status === "partial" ? "bg-amber-100 text-amber-700"
                : "bg-red-100 text-red-700"
            }`}>
              {run.status}
            </span>
            <span className="text-xs text-zinc-400">
              {new Date(run.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            </span>
          </div>
          <h1 className="mt-3 text-2xl font-bold text-zinc-900">{run.domain}</h1>
          <p className="mt-1 text-sm text-zinc-500">{run.task}</p>
        </div>

        {/* Agent Deliverables */}
        <div>
          <h2 className="mb-3 text-sm font-medium text-zinc-700">Launch Package</h2>
          <div className="space-y-3">
            {AGENT_IDS.map((agentId) => {
              const output = run.agent_outputs?.[agentId];
              if (!output?.content) return null;
              const meta = AGENT_META[agentId];
              return (
                <details key={agentId} className="rounded-xl border border-zinc-200 bg-white shadow-sm group" open={agentId === "planner"}>
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
        </div>
      </div>
    </div>
  );
}
