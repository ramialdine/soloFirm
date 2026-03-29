import Link from "next/link";
import { getRun } from "@/lib/get-run";
import ResultsNav from "./results-nav";
import ResultsLayoutHeader from "./results-layout-header";

export default async function ResultsLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const run = await getRun(id);

  // If Supabase doesn't have the run yet (e.g. race condition on first load),
  // still render the shell — the child page will load data from sessionStorage.
  const businessName = run
    ? (run.presentation?.businessName ?? run.domain ?? "Your Business")
    : null;
  const status = run?.status ?? null;
  const createdAt = run?.created_at ?? null;

  return (
    <div className="min-h-screen bg-zinc-50">
      <nav className="border-b border-zinc-200 bg-white px-6 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Link
            href="/"
            className="text-xl font-bold tracking-tight text-zinc-900"
          >
            SoloFirm
          </Link>
          <Link
            href="/dashboard"
            className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700"
          >
            Launch Your Business
          </Link>
        </div>
      </nav>

      {/* Status badge + date — client component reads sessionStorage if server data unavailable */}
      <ResultsLayoutHeader
        runId={id}
        businessName={businessName}
        status={status}
        createdAt={createdAt}
        roadmapSource={run?.presentation?.roadmapSource ?? null}
      />

      {/* Sub-page navigation tabs */}
      <ResultsNav id={id} />

      <div className="mx-auto max-w-5xl p-6">{children}</div>
    </div>
  );
}
