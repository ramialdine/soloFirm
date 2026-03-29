"use client";

import { useEffect, useState } from "react";
import { getRunFromSession } from "@/lib/run-session";
import type { RoadmapSource } from "@/types/agents";

interface Props {
  runId: string;
  businessName: string | null;
  status: string | null;
  createdAt: string | null;
  roadmapSource?: RoadmapSource | null;
}

export default function ResultsLayoutHeader({
  runId,
  businessName: serverBusinessName,
  status: serverStatus,
  createdAt: serverCreatedAt,
  roadmapSource: serverRoadmapSource,
}: Props) {
  const [businessName, setBusinessName] = useState(serverBusinessName);
  const [status, setStatus] = useState(serverStatus);
  const [createdAt, setCreatedAt] = useState(serverCreatedAt);
  const [roadmapSource, setRoadmapSource] = useState(serverRoadmapSource ?? null);

  useEffect(() => {
    // If server didn't have the run yet, read from sessionStorage
    if (!serverBusinessName) {
      const run = getRunFromSession(runId);
      if (run) {
        setBusinessName(run.presentation?.businessName ?? run.domain ?? "Your Business");
        setStatus(run.status);
        setCreatedAt(run.created_at);
        setRoadmapSource(run.presentation?.roadmapSource ?? null);
      }
    }
  }, [runId, serverBusinessName]);

  if (!businessName) return null;

  return (
    <div className="mx-auto max-w-5xl px-6 pt-6 space-y-3">
      {roadmapSource === "test_mock" && (
        <div className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-2.5 text-sm text-amber-800">
          <strong>Test Mode</strong> — This roadmap was generated from mock data, not real agent output.
        </div>
      )}
      {roadmapSource === "deterministic_fallback" && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm text-blue-700">
          <strong>Fallback Mode</strong> — Synthesis JSON failed. Roadmap was extracted from raw agent outputs via deterministic parser.
        </div>
      )}
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-lg font-bold text-zinc-900">{businessName}</h1>
        {status && (
          <span
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              status === "complete"
                ? "bg-emerald-100 text-emerald-700"
                : status === "partial"
                  ? "bg-amber-100 text-amber-700"
                  : "bg-red-100 text-red-700"
            }`}
          >
            {status}
          </span>
        )}
        {createdAt && (
          <span className="text-xs text-zinc-400">
            {new Date(createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        )}
      </div>
    </div>
  );
}
