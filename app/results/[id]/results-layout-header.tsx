"use client";

import { useEffect, useState } from "react";
import type { Run } from "@/types/agents";

interface Props {
  runId: string;
  businessName: string | null;
  status: string | null;
  createdAt: string | null;
}

export default function ResultsLayoutHeader({
  runId,
  businessName: serverBusinessName,
  status: serverStatus,
  createdAt: serverCreatedAt,
}: Props) {
  const [businessName, setBusinessName] = useState(serverBusinessName);
  const [status, setStatus] = useState(serverStatus);
  const [createdAt, setCreatedAt] = useState(serverCreatedAt);

  useEffect(() => {
    // If server didn't have the run yet, read from sessionStorage
    if (!serverBusinessName) {
      try {
        const stored = sessionStorage.getItem(`run_${runId}`);
        if (stored) {
          const run: Run = JSON.parse(stored);
          setBusinessName(run.presentation?.businessName ?? run.domain ?? "Your Business");
          setStatus(run.status);
          setCreatedAt(run.created_at);
        }
      } catch { /* non-fatal */ }
    }
  }, [runId, serverBusinessName]);

  if (!businessName) return null;

  return (
    <div className="mx-auto max-w-5xl px-6 pt-6">
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
