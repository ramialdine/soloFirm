import { notFound } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import type { Run, AgentId } from "@/types/agents";
import { AGENT_META } from "@/types/agents";

async function getRun(id: string): Promise<Run | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) return null;

  const sb = createClient(url, key);
  const { data } = await sb.from("runs").select("*").eq("id", id).single();
  return data as Run | null;
}

export default async function ResultsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const run = await getRun(id);

  if (!run) {
    notFound();
  }

  const agentIds: AgentId[] = ["research", "finance", "strategy", "legal", "writer", "critic"];

  return (
    <div className="min-h-screen bg-zinc-50">
      <nav className="border-b border-zinc-200 bg-white px-6 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-tight text-zinc-900">
            SoloFirm
          </Link>
          <Link
            href="/dashboard"
            className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700"
          >
            Run Your Own
          </Link>
        </div>
      </nav>

      <div className="mx-auto max-w-5xl space-y-8 p-6">
        {/* Header */}
        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                run.status === "complete"
                  ? "bg-emerald-100 text-emerald-700"
                  : run.status === "partial"
                    ? "bg-amber-100 text-amber-700"
                    : "bg-red-100 text-red-700"
              }`}
            >
              {run.status}
            </span>
            <span className="text-xs text-zinc-400">
              {new Date(run.created_at).toLocaleDateString()}
            </span>
          </div>
          <h1 className="mt-3 text-2xl font-bold text-zinc-900">{run.task}</h1>
          <p className="mt-1 text-sm text-zinc-500">Domain: {run.domain}</p>
        </div>

        {/* Agent Outputs */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {agentIds.map((id) => {
            const output = run.agent_outputs?.[id];
            if (!output?.content) return null;
            const meta = AGENT_META[id];
            return (
              <details key={id} className="rounded-xl border border-zinc-200 bg-white shadow-sm">
                <summary className="cursor-pointer p-4">
                  <span className="font-semibold text-zinc-900">{meta.label}</span>
                  <span className="ml-2 text-xs text-zinc-400">{meta.description}</span>
                </summary>
                <div className="border-t border-zinc-100 p-4 text-sm text-zinc-700 whitespace-pre-wrap">
                  {output.content}
                </div>
              </details>
            );
          })}
        </div>

        {/* Final Output */}
        {run.final_output && (
          <div className="rounded-xl border border-zinc-200 bg-white shadow-sm">
            <div className="border-b border-zinc-100 px-6 py-4">
              <h2 className="text-lg font-semibold text-zinc-900">Final Deliverable</h2>
            </div>
            <div className="p-6 text-sm leading-relaxed text-zinc-700 whitespace-pre-wrap">
              {run.final_output}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
