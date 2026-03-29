"use client";

import { useState } from "react";
import { AGENT_META, type AgentId, type AgentStatus, type AgentSummary } from "@/types/agents";
import { MarkdownBody } from "./OutputPanel";

const statusStyles: Record<AgentStatus, { bg: string; ring: string; text: string; dot: string; label: string }> = {
  idle:     { bg: "bg-zinc-50",     ring: "ring-zinc-200",    text: "text-zinc-400",    dot: "bg-zinc-300",                   label: "Waiting" },
  running:  { bg: "bg-blue-50",     ring: "ring-blue-300",    text: "text-blue-700",    dot: "bg-blue-500 animate-pulse",     label: "Running" },
  complete: { bg: "bg-emerald-50",  ring: "ring-emerald-300", text: "text-emerald-700", dot: "bg-emerald-500",                label: "Done" },
  error:    { bg: "bg-red-50",      ring: "ring-red-300",     text: "text-red-700",     dot: "bg-red-500",                   label: "Error" },
};

const AGENT_ICONS: Record<AgentId, string> = {
  planner: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01",
  research: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
  legal: "M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3",
  finance: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  brand: "M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01",
  social: "M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z",
  critic: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
};

const AGENT_PHOTOS: Partial<Record<AgentId, string>> = {
  planner: "/agent-planner.png",
  research: "/agent-research.png",
  legal: "/agent-legal.png",
  finance: "/agent-finance.png",
  brand: "/agent-brand.png",
  social: "/agent-social.png",
  critic: "/agent-critic.svg",
};

// ── Compact card for the "running" phase (same as before but cleaner) ──

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
            <div className="flex items-start gap-2">
              {AGENT_PHOTOS[agentId] && (
                <img
                  src={AGENT_PHOTOS[agentId]}
                  alt={meta.label}
                  className="h-10 w-10 rounded-lg object-cover shrink-0"
                />
              )}
              <div>
                <p className="text-sm font-semibold text-zinc-900">{meta.label}</p>
                <p className="mt-0.5 text-xs text-zinc-500">{meta.deliverable}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className={`text-xs font-medium ${style.text}`}>{style.label}</span>
            {content && (
              <span className="text-zinc-300 text-xs">{expanded ? "\u25B2" : "\u25BC"}</span>
            )}
          </div>
        </div>

        {/* Live streaming preview */}
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

// ── Summary-first "character" card for the packaging/complete phase ──

interface SummaryCardProps {
  agentId: AgentId;
  summary: AgentSummary;
  content: string;
  brandTheme?: { primaryColor: string; secondaryColor: string; accentColor: string };
}

export function SummaryCard({ agentId, summary, content, brandTheme }: SummaryCardProps) {
  const [expanded, setExpanded] = useState(false);
  const meta = AGENT_META[agentId];
  const iconPath = AGENT_ICONS[agentId];

  const accentColor = brandTheme?.accentColor ?? "#10b981";
  const primaryColor = brandTheme?.primaryColor ?? "#18181b";

  return (
    <div className="group rounded-2xl border border-zinc-200 bg-white shadow-sm overflow-hidden transition-all hover:shadow-md">
      {/* Header with photo or icon */}
      <div className="px-5 pt-5 pb-4">
        <div className="flex items-start gap-3">
          {AGENT_PHOTOS[agentId] ? (
            <img
              src={AGENT_PHOTOS[agentId]}
              alt={meta.label}
              className="h-16 w-16 rounded-xl object-cover shrink-0"
            />
          ) : (
            <div
              className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl"
              style={{ backgroundColor: `${accentColor}15` }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke={accentColor}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d={iconPath} />
              </svg>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-zinc-400 uppercase tracking-wide">{meta.label}</p>
            <p className="mt-0.5 text-sm font-semibold text-zinc-900 leading-snug">{summary.headline}</p>
          </div>
        </div>

        {/* Bullet takeaways */}
        <ul className="mt-3 space-y-1.5">
          {summary.bullets.map((bullet, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-zinc-600">
              <span
                className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                style={{ backgroundColor: accentColor }}
              />
              <span className="leading-snug">{bullet}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Expand/collapse toggle */}
      <div className="border-t border-zinc-100">
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="flex w-full items-center justify-between px-5 py-3 text-xs font-medium text-zinc-400 hover:text-zinc-700 transition-colors"
        >
          <span>{expanded ? "Hide full analysis" : "View full analysis"}</span>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`transition-transform ${expanded ? "rotate-180" : ""}`}
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>

        {expanded && (
          <div className="border-t border-zinc-100 px-5 py-4 max-h-[500px] overflow-y-auto">
            <MarkdownBody content={content} />
          </div>
        )}
      </div>
    </div>
  );
}
