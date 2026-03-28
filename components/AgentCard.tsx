"use client";

import { AGENT_META, type AgentId, type AgentStatus } from "@/types/agents";

const statusStyles: Record<AgentStatus, { bg: string; ring: string; text: string; dot: string }> = {
  idle: { bg: "bg-zinc-50", ring: "ring-zinc-200", text: "text-zinc-400", dot: "bg-zinc-300" },
  running: { bg: "bg-blue-50", ring: "ring-blue-300", text: "text-blue-700", dot: "bg-blue-500 animate-pulse" },
  complete: { bg: "bg-emerald-50", ring: "ring-emerald-300", text: "text-emerald-700", dot: "bg-emerald-500" },
  error: { bg: "bg-red-50", ring: "ring-red-300", text: "text-red-700", dot: "bg-red-500" },
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
    <button
      type="button"
      onClick={onToggle}
      className={`w-full text-left rounded-xl p-4 ring-1 transition-all ${style.bg} ${style.ring} hover:shadow-md`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className={`inline-block h-2.5 w-2.5 rounded-full ${style.dot}`} />
          <div>
            <p className="text-sm font-semibold text-zinc-900">{meta.label}</p>
            <p className="text-xs text-zinc-500">{meta.description}</p>
          </div>
        </div>
        <span className={`text-xs font-medium uppercase tracking-wide ${style.text}`}>
          {status}
        </span>
      </div>

      {expanded && content && (
        <div className="mt-3 max-h-64 overflow-y-auto rounded-lg bg-white/70 p-3 text-xs leading-relaxed text-zinc-700 whitespace-pre-wrap">
          {content}
        </div>
      )}
    </button>
  );
}
