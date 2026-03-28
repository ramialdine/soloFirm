"use client";

import { useState, useCallback, useRef } from "react";
import AgentCard from "./AgentCard";
import OutputPanel from "./OutputPanel";
import type { AgentId, AgentOutput, AgentStatus, SSEEvent } from "@/types/agents";
import { AGENT_META } from "@/types/agents";

const AGENT_IDS: AgentId[] = ["research", "finance", "strategy", "legal", "writer", "critic"];

function makeInitialOutputs(): Record<AgentId, AgentOutput> {
  const out: Partial<Record<AgentId, AgentOutput>> = {};
  for (const id of AGENT_IDS) {
    out[id] = { agentId: id, status: "idle", content: "" };
  }
  return out as Record<AgentId, AgentOutput>;
}

export default function AgentOrchestrator() {
  const [domain, setDomain] = useState("");
  const [task, setTask] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [outputs, setOutputs] = useState<Record<AgentId, AgentOutput>>(makeInitialOutputs);
  const [finalOutput, setFinalOutput] = useState<string | null>(null);
  const [runId, setRunId] = useState<string | null>(null);
  const [expandedAgent, setExpandedAgent] = useState<AgentId | null>(null);
  const [currentPhase, setCurrentPhase] = useState(0);
  const abortRef = useRef<AbortController | null>(null);

  const updateAgent = useCallback((agentId: AgentId, update: Partial<AgentOutput>) => {
    setOutputs((prev) => ({
      ...prev,
      [agentId]: { ...prev[agentId], ...update },
    }));
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!domain.trim() || !task.trim() || isRunning) return;

      setIsRunning(true);
      setOutputs(makeInitialOutputs());
      setFinalOutput(null);
      setRunId(null);
      setCurrentPhase(0);
      setExpandedAgent(null);

      abortRef.current = new AbortController();

      try {
        const res = await fetch("/api/orchestrate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ domain: domain.trim(), task: task.trim() }),
          signal: abortRef.current.signal,
        });

        if (!res.ok || !res.body) {
          throw new Error(`HTTP ${res.status}`);
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n\n");
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            const match = line.match(/^data: ([\s\S]+)$/);
            if (!match) continue;

            try {
              const event: SSEEvent = JSON.parse(match[1]);

              switch (event.type) {
                case "run_started":
                  setRunId(event.run?.id ?? null);
                  break;

                case "agent_started":
                  if (event.agentId) {
                    updateAgent(event.agentId, { status: "running" as AgentStatus });
                    setExpandedAgent(event.agentId);
                  }
                  break;

                case "agent_chunk":
                  if (event.agentId && event.content) {
                    setOutputs((prev) => ({
                      ...prev,
                      [event.agentId!]: {
                        ...prev[event.agentId!],
                        content: prev[event.agentId!].content + event.content,
                      },
                    }));
                  }
                  break;

                case "agent_complete":
                  if (event.agentId) {
                    updateAgent(event.agentId, { status: "complete" as AgentStatus });
                  }
                  break;

                case "agent_error":
                  if (event.agentId) {
                    updateAgent(event.agentId, {
                      status: "error" as AgentStatus,
                      error: event.error,
                    });
                  }
                  break;

                case "phase_complete":
                  setCurrentPhase(event.phase ?? 0);
                  break;

                case "run_complete":
                  setFinalOutput(event.run?.final_output ?? null);
                  setRunId(event.run?.id ?? null);
                  break;
              }
            } catch {
              // Skip malformed SSE lines
            }
          }
        }
      } catch (err: unknown) {
        if (err instanceof Error && err.name !== "AbortError") {
          console.error("Orchestration failed:", err);
        }
      } finally {
        setIsRunning(false);
      }
    },
    [domain, task, isRunning, updateAgent]
  );

  const phaseLabels = ["Waiting", "Research & Finance", "Strategy & Legal", "Synthesis", "Critical Review"];

  return (
    <div className="mx-auto max-w-5xl space-y-8 p-6">
      {/* Task Input */}
      <form onSubmit={handleSubmit} className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-zinc-900">Start Analysis</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="domain" className="mb-1 block text-sm font-medium text-zinc-700">
              Domain / Industry
            </label>
            <input
              id="domain"
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="e.g., SaaS Healthcare, E-commerce Fashion"
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              disabled={isRunning}
            />
          </div>
          <div>
            <label htmlFor="task" className="mb-1 block text-sm font-medium text-zinc-700">
              Task / Question
            </label>
            <input
              id="task"
              type="text"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              placeholder="e.g., Evaluate market entry strategy for..."
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              disabled={isRunning}
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={isRunning || !domain.trim() || !task.trim()}
          className="mt-4 rounded-lg bg-zinc-900 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isRunning ? "Running..." : "Run Analysis"}
        </button>
      </form>

      {/* Phase Progress */}
      {(isRunning || finalOutput) && (
        <div className="flex items-center gap-2">
          {phaseLabels.map((label, i) => (
            <div key={label} className="flex items-center gap-2">
              <div
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  currentPhase >= i
                    ? "bg-emerald-100 text-emerald-700"
                    : isRunning && currentPhase === i - 1
                      ? "bg-blue-100 text-blue-700 animate-pulse"
                      : "bg-zinc-100 text-zinc-400"
                }`}
              >
                {label}
              </div>
              {i < phaseLabels.length - 1 && (
                <div className={`h-px w-6 ${currentPhase > i ? "bg-emerald-300" : "bg-zinc-200"}`} />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Agent Cards */}
      {(isRunning || finalOutput) && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {AGENT_IDS.map((id) => (
            <AgentCard
              key={id}
              agentId={id}
              status={outputs[id].status}
              content={outputs[id].content}
              expanded={expandedAgent === id}
              onToggle={() => setExpandedAgent(expandedAgent === id ? null : id)}
            />
          ))}
        </div>
      )}

      {/* Output Panel */}
      {(isRunning || finalOutput) && (
        <OutputPanel finalOutput={finalOutput} isComplete={!!finalOutput} />
      )}

      {/* Share Link */}
      {runId && finalOutput && (
        <div className="text-center">
          <a
            href={`/results/${runId}`}
            className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
          >
            Share this result: /results/{runId}
          </a>
        </div>
      )}
    </div>
  );
}
