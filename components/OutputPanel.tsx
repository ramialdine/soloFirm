"use client";

interface OutputPanelProps {
  finalOutput: string | null;
  isComplete: boolean;
}

export default function OutputPanel({ finalOutput, isComplete }: OutputPanelProps) {
  if (!finalOutput && !isComplete) {
    return (
      <div className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50 p-8 text-center">
        <p className="text-sm text-zinc-400">
          The synthesized deliverable will appear here once all agents complete.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-4">
        <h2 className="text-lg font-semibold text-zinc-900">Final Deliverable</h2>
        {isComplete && (
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
            Complete
          </span>
        )}
      </div>
      <div className="prose prose-sm max-w-none p-6 text-zinc-700 whitespace-pre-wrap">
        {finalOutput}
      </div>
    </div>
  );
}
