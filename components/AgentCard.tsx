"use client";

import { AGENT_META, type AgentId, type AgentStatus } from "@/types/agents";
import { MarkdownBody } from "./OutputPanel";

const statusStyles: Record<AgentStatus, { bg: string; ring: string; text: string; dot: string; label: string }> = {
  idle:     { bg: "bg-zinc-50",     ring: "ring-zinc-200",    text: "text-zinc-400",    dot: "bg-zinc-300",                   label: "Waiting" },
  running:  { bg: "bg-blue-50",     ring: "ring-blue-300",    text: "text-blue-700",    dot: "bg-blue-500 animate-pulse",     label: "Running" },
  complete: { bg: "bg-emerald-50",  ring: "ring-emerald-300", text: "text-emerald-700", dot: "bg-emerald-500",                label: "Done" },
  error:    { bg: "bg-red-50",      ring: "ring-red-300",     text: "text-red-700",     dot: "bg-red-500",                   label: "Error" },
};

interface AgentCardProps {
  agentId: AgentId;
  status: AgentStatus;
  content: string;
  expanded?: boolean;
  onToggle?: () => void;
}

export default function AgentCard({ agentId, status, content, expanded, onToggle }: AgentCardProps) {
  const meta = AGENT_META[agentId];
  const style = statusStyles[status];

  return (
    <div className={`rounded-xl ring-1 transition-all ${style.bg} ${style.ring}`}>
      <button
        type="button"
        onClick={onToggle}
        className="w-full text-left p-4 hover:opacity-80 transition-opacity"
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-3">
            <span className={`mt-1 inline-block h-2.5 w-2.5 shrink-0 rounded-full ${style.dot}`} />
            <div>
              <p className="text-sm font-semibold text-zinc-900">{meta.label}</p>
              <p className="mt-0.5 text-xs text-zinc-500">{meta.deliverable}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className={`text-xs font-medium ${style.text}`}>{style.label}</span>
            {content && (
              <span className="text-zinc-300 text-xs">{expanded ? "▲" : "▼"}</span>
            )}
          </div>
        </div>

        {/* Live streaming preview — show last ~200 chars while running */}
        {status === "running" && content && !expanded && (
          <p className="mt-2 text-xs text-zinc-500 line-clamp-2 leading-relaxed">
            {content.slice(-200)}
          </p>
        )}
      </button>

      {expanded && content && (
        <div className="border-t border-white/60 mx-4 mb-4 pt-3 max-h-96 overflow-y-auto">
          <MarkdownBody content={content} />
        </div>
      )}
    </div>
  );
}
