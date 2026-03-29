"use client";

import { useState } from "react";
import type { RoadmapStep, RoadmapStepStatus, AgentId } from "@/types/agents";
import { AGENT_META } from "@/types/agents";

interface RoadmapTimelineProps {
  steps: RoadmapStep[];
  accentColor?: string;
  onViewAgent?: (agentId: AgentId) => void;
}

// Group steps by phase
function groupByPhase(steps: RoadmapStep[]): { phase: string; steps: RoadmapStep[] }[] {
  const groups: { phase: string; steps: RoadmapStep[] }[] = [];
  for (const step of steps) {
    const last = groups[groups.length - 1];
    if (last && last.phase === step.phase) {
      last.steps.push(step);
    } else {
      groups.push({ phase: step.phase, steps: [step] });
    }
  }
  return groups;
}

export default function RoadmapTimeline({ steps, accentColor = "#10b981", onViewAgent }: RoadmapTimelineProps) {
  // Track which steps the user has checked off (persisted to localStorage)
  const [completed, setCompleted] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem("solofirm_roadmap_progress");
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });

  const [expandedStep, setExpandedStep] = useState<string | null>(null);

  const toggleComplete = (id: string) => {
    setCompleted((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      try { localStorage.setItem("solofirm_roadmap_progress", JSON.stringify([...next])); } catch { /* ignore */ }
      return next;
    });
  };

  const getStatus = (step: RoadmapStep, index: number): RoadmapStepStatus => {
    if (completed.has(step.id)) return "complete";
    // First uncompleted step is "current"
    const firstUncompleted = steps.findIndex((s) => !completed.has(s.id));
    if (index === firstUncompleted) return "current";
    return "upcoming";
  };

  const completedCount = steps.filter((s) => completed.has(s.id)).length;
  const progress = steps.length > 0 ? Math.round((completedCount / steps.length) * 100) : 0;

  const phaseGroups = groupByPhase(steps);

  return (
    <div className="space-y-6">
      {/* Header with progress */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-zinc-900">Your Launch Roadmap</h3>
          <p className="text-sm text-zinc-500 mt-0.5">
            {completedCount} of {steps.length} steps complete
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="h-3 w-32 rounded-full bg-zinc-100 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${progress}%`, backgroundColor: accentColor }}
            />
          </div>
          <span className="text-sm font-semibold" style={{ color: accentColor }}>
            {progress}%
          </span>
        </div>
      </div>

      {/* Phase groups */}
      {phaseGroups.map((group) => (
        <div key={group.phase}>
          {/* Phase header */}
          <div className="flex items-center gap-2 mb-3">
            <div
              className="h-px flex-1"
              style={{ backgroundColor: `${accentColor}30` }}
            />
            <span
              className="text-xs font-bold uppercase tracking-widest px-2"
              style={{ color: accentColor }}
            >
              {group.phase}
            </span>
            <div
              className="h-px flex-1"
              style={{ backgroundColor: `${accentColor}30` }}
            />
          </div>

          {/* Steps */}
          <div className="relative">
            {/* Vertical timeline line */}
            <div
              className="absolute left-[15px] top-0 bottom-0 w-px"
              style={{ backgroundColor: `${accentColor}20` }}
            />

            <div className="space-y-1">
              {group.steps.map((step) => {
                const globalIndex = steps.indexOf(step);
                const status = getStatus(step, globalIndex);
                const isExpanded = expandedStep === step.id;

                return (
                  <div key={step.id} className="relative pl-10">
                    {/* Timeline dot */}
                    <div className="absolute left-0 top-3">
                      <button
                        type="button"
                        onClick={() => toggleComplete(step.id)}
                        className={`flex h-[30px] w-[30px] items-center justify-center rounded-full border-2 transition-all ${
                          status === "complete"
                            ? "border-transparent text-white"
                            : status === "current"
                              ? "border-transparent text-white shadow-md"
                              : "border-zinc-200 bg-white text-zinc-300 hover:border-zinc-300"
                        }`}
                        style={
                          status === "complete"
                            ? { backgroundColor: accentColor }
                            : status === "current"
                              ? { backgroundColor: accentColor, boxShadow: `0 0 0 4px ${accentColor}20` }
                              : undefined
                        }
                      >
                        {status === "complete" ? (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 6L9 17l-5-5" />
                          </svg>
                        ) : status === "current" ? (
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M5 3l14 9-14 9V3z" />
                          </svg>
                        ) : (
                          <span className="h-2 w-2 rounded-full bg-zinc-200" />
                        )}
                      </button>
                    </div>

                    {/* Step card */}
                    <div
                      className={`rounded-xl border transition-all ${
                        status === "complete"
                          ? "border-zinc-100 bg-zinc-50/50"
                          : status === "current"
                            ? "border-zinc-200 bg-white shadow-sm"
                            : "border-zinc-100 bg-white"
                      }`}
                      style={
                        status === "current"
                          ? { boxShadow: `0 0 0 1px ${accentColor}30, 0 1px 3px rgba(0,0,0,0.05)` }
                          : undefined
                      }
                    >
                      {/* Step header — always visible */}
                      <button
                        type="button"
                        onClick={() => setExpandedStep(isExpanded ? null : step.id)}
                        className="flex w-full items-center gap-3 px-4 py-3 text-left"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p
                              className={`text-sm font-semibold ${
                                status === "complete" ? "text-zinc-400 line-through" : "text-zinc-900"
                              }`}
                            >
                              {step.title}
                            </p>
                          </div>
                          <div className="flex items-center gap-3 mt-0.5">
                            <span className="text-xs text-zinc-400">{step.week}</span>
                            {step.estimatedTime && (
                              <span className="text-xs text-zinc-400">{step.estimatedTime}</span>
                            )}
                            {step.cost && step.cost !== "Free" && (
                              <span className="text-xs text-zinc-400">{step.cost}</span>
                            )}
                            {step.cost === "Free" && (
                              <span className="text-xs font-medium" style={{ color: accentColor }}>Free</span>
                            )}
                          </div>
                        </div>
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className={`shrink-0 text-zinc-300 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                        >
                          <path d="M6 9l6 6 6-6" />
                        </svg>
                      </button>

                      {/* Expanded detail panel */}
                      {isExpanded && (
                        <div className="border-t border-zinc-100 px-4 py-4 space-y-3">
                          {/* Why it matters */}
                          <div>
                            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-1">
                              Why this matters
                            </p>
                            <p className="text-sm text-zinc-700 leading-relaxed">{step.why}</p>
                          </div>

                          {/* What's prepared */}
                          <div
                            className="rounded-lg px-3 py-2.5"
                            style={{ backgroundColor: `${accentColor}08` }}
                          >
                            <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: accentColor }}>
                              Already prepared for you
                            </p>
                            <p className="text-sm text-zinc-700 leading-relaxed">{step.prepared}</p>
                            {step.agentId && onViewAgent && (
                              <button
                                type="button"
                                onClick={() => onViewAgent(step.agentId!)}
                                className="mt-1.5 text-xs font-medium hover:underline"
                                style={{ color: accentColor }}
                              >
                                View {AGENT_META[step.agentId].label} output →
                              </button>
                            )}
                          </div>

                          {/* Exact next action */}
                          <div>
                            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-1">
                              Your next action
                            </p>
                            <p className="text-sm text-zinc-800 font-medium leading-relaxed">{step.action}</p>
                          </div>

                          {/* Action buttons */}
                          <div className="flex flex-wrap gap-2 pt-1">
                            {step.actionUrl && (
                              <a
                                href={step.actionUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-semibold text-white transition-colors"
                                style={{ backgroundColor: accentColor }}
                              >
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                                  <path d="M15 3h6v6" />
                                  <path d="M10 14L21 3" />
                                </svg>
                                Go to site
                              </a>
                            )}
                            <button
                              type="button"
                              onClick={() => toggleComplete(step.id)}
                              className={`flex items-center gap-1.5 rounded-lg border px-4 py-2 text-xs font-medium transition-colors ${
                                status === "complete"
                                  ? "border-zinc-200 text-zinc-500 hover:text-zinc-700"
                                  : "border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                              }`}
                            >
                              {status === "complete" ? (
                                "Undo"
                              ) : (
                                <>
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20 6L9 17l-5-5" />
                                  </svg>
                                  Mark complete
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
