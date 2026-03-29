import Link from "next/link";
import { notFound } from "next/navigation";
import { getRun } from "@/lib/get-run";
import ResultsNav from "./results-nav";

export default async function ResultsLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const run = await getRun(id);

  if (!run) {
    notFound();
  }

  const businessName =
    run.presentation?.businessName ?? run.domain ?? "Your Business";

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

      {/* Status badge + date */}
      <div className="mx-auto max-w-5xl px-6 pt-6">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-lg font-bold text-zinc-900">{businessName}</h1>
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
            {new Date(run.created_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>
      </div>

      {/* Sub-page navigation tabs */}
      <ResultsNav id={id} />

      <div className="mx-auto max-w-5xl p-6">{children}</div>
    </div>
  );
}
