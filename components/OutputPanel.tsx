"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Presentation, AgentId, AgentOutput } from "@/types/agents";
import { SummaryCard } from "./AgentCard";
import { AGENT_META } from "@/types/agents";
import AccountSetupWizard from "./AccountSetupWizard";

// ── Legacy tabbed output (still used as a detail view) ──

interface OutputPanelProps {
  finalOutput: string | null;
  isComplete: boolean;
}

const SECTIONS = [
  { id: "roadmap", label: "90-Day Plan", marker: "## 90-Day Launch Roadmap" },
  { id: "market", label: "Market Intel", marker: "## Market Intelligence" },
  { id: "legal", label: "Legal", marker: "## Legal Documents & Compliance" },
  { id: "finance", label: "Financial", marker: "## Financial Setup Guide" },
  { id: "brand", label: "Brand", marker: "## Brand Package" },
  { id: "social", label: "Social Media", marker: "## Social Media Launch Kit" },
  { id: "review", label: "Review", marker: "## Launch Readiness Review" },
];

function splitSections(output: string): Record<string, string> {
  const result: Record<string, string> = {};

  for (let i = 0; i < SECTIONS.length; i++) {
    const section = SECTIONS[i];
    const startIndex = output.indexOf(section.marker);
    if (startIndex === -1) continue;

    let endIndex = output.length;
    for (let j = i + 1; j < SECTIONS.length; j++) {
      const nextIdx = output.indexOf(SECTIONS[j].marker);
      if (nextIdx > startIndex) {
        const separatorIdx = output.lastIndexOf("---", nextIdx);
        endIndex = separatorIdx > startIndex ? separatorIdx : nextIdx;
        break;
      }
    }

    result[section.id] = output.slice(startIndex, endIndex).trim();
  }

  return result;
}

export default function OutputPanel({ finalOutput, isComplete }: OutputPanelProps) {
  const firstAvailableTab = SECTIONS[0].id;
  const [activeTab, setActiveTab] = useState(firstAvailableTab);

  if (!finalOutput && !isComplete) {
    return (
      <div className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50 p-8 text-center">
        <p className="text-sm text-zinc-400">
          Your business launch package will appear here once all agents complete.
        </p>
      </div>
    );
  }

  if (!finalOutput) return null;

  const sections = splitSections(finalOutput);
  const hasAnySections = Object.keys(sections).length > 0;

  return (
    <div className="rounded-xl border border-zinc-200 bg-white shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-4">
        <div>
          <h2 className="text-lg font-semibold text-zinc-900">Your Business Launch Package</h2>
          <p className="mt-0.5 text-xs text-zinc-500">Complete package from 6 specialized AI agents</p>
        </div>
        {isComplete && (
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
            Complete
          </span>
        )}
      </div>

      {/* Tab navigation */}
      {hasAnySections && (
        <div className="border-b border-zinc-100 px-4 overflow-x-auto">
          <div className="flex gap-1 min-w-max">
            {SECTIONS.map((section) => (
              sections[section.id] ? (
                <button
                  key={section.id}
                  onClick={() => setActiveTab(section.id)}
                  className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 -mb-px ${
                    activeTab === section.id
                      ? "border-zinc-900 text-zinc-900"
                      : "border-transparent text-zinc-400 hover:text-zinc-700"
                  }`}
                >
                  {section.label}
                </button>
              ) : null
            ))}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-6 md:p-8">
        {hasAnySections && sections[activeTab] ? (
          <MarkdownBody content={sections[activeTab]} />
        ) : (
          <MarkdownBody content={finalOutput} />
        )}
      </div>
    </div>
  );
}

// ── Branded packaging panel (the new "reveal" experience) ──

const AGENT_IDS: AgentId[] = ["planner", "research", "legal", "finance", "brand", "social", "critic"];

interface PackagingPanelProps {
  presentation: Presentation;
  outputs: Record<AgentId, AgentOutput>;
  onPresentationChange: (updated: Presentation) => void;
  onFinalize: () => void;
  runId: string | null;
  saving?: boolean;
  businessLocation?: string;
}

export function PackagingPanel({
  presentation,
  outputs,
  onPresentationChange,
  onFinalize,
  runId,
  saving,
  businessLocation,
}: PackagingPanelProps) {
  const { brandTheme } = presentation;

  return (
    <div className="space-y-6">
      {/* Business identity header — editable */}
      <div
        className="relative overflow-hidden rounded-2xl border border-zinc-200 shadow-sm"
        style={{
          background: `linear-gradient(135deg, ${brandTheme.primaryColor}08 0%, ${brandTheme.accentColor}12 100%)`,
        }}
      >
        <div className="px-6 py-8 sm:px-8">
          <p className="text-xs font-medium uppercase tracking-widest text-zinc-400 mb-3">Your Business</p>

          {/* Editable business name */}
          <input
            type="text"
            value={presentation.businessName}
            onChange={(e) =>
              onPresentationChange({ ...presentation, businessName: e.target.value })
            }
            className="block w-full bg-transparent text-3xl sm:text-4xl font-bold text-zinc-900 border-none outline-none placeholder:text-zinc-300 focus:ring-0 p-0"
            placeholder="Business Name"
          />

          {/* Editable tagline */}
          <input
            type="text"
            value={presentation.tagline}
            onChange={(e) =>
              onPresentationChange({ ...presentation, tagline: e.target.value })
            }
            className="mt-2 block w-full bg-transparent text-lg text-zinc-500 border-none outline-none placeholder:text-zinc-300 focus:ring-0 p-0"
            placeholder="Your tagline"
          />

          {/* Brand theme swatches — editable */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="text-xs text-zinc-400 mr-1">Theme:</span>
            {(["primaryColor", "secondaryColor", "accentColor"] as const).map((key) => (
              <label key={key} className="group relative cursor-pointer">
                <div
                  className="h-7 w-7 rounded-full ring-2 ring-white shadow-sm transition-transform group-hover:scale-110"
                  style={{ backgroundColor: brandTheme[key] }}
                />
                <input
                  type="color"
                  value={brandTheme[key]}
                  onChange={(e) =>
                    onPresentationChange({
                      ...presentation,
                      brandTheme: { ...brandTheme, [key]: e.target.value },
                    })
                  }
                  className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                />
              </label>
            ))}
            <input
              type="text"
              value={brandTheme.fontFamily}
              onChange={(e) =>
                onPresentationChange({
                  ...presentation,
                  brandTheme: { ...brandTheme, fontFamily: e.target.value },
                })
              }
              className="ml-2 rounded-lg border border-zinc-200 bg-white/80 px-3 py-1 text-xs text-zinc-600 w-28 focus:border-zinc-400 focus:outline-none"
              placeholder="Font family"
            />
          </div>
        </div>
      </div>

      {/* Agent summary cards */}
      <div>
        <h3 className="mb-3 text-sm font-medium text-zinc-700">Your Launch Package</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          {AGENT_IDS.map((id) => {
            const summary = presentation.agentSummaries.find((s) => s.agentId === id);
            if (!summary || !outputs[id]?.content) return null;
            return (
              <SummaryCard
                key={id}
                agentId={id}
                summary={summary}
                content={outputs[id].content}
                brandTheme={brandTheme}
              />
            );
          })}
        </div>
      </div>

      {/* Account setup wizard */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
        <AccountSetupWizard
          presentation={presentation}
          businessLocation={businessLocation}
        />
      </div>

      {/* Finalize bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-zinc-200 bg-white px-5 py-4 shadow-sm">
        <div>
          <p className="text-sm font-medium text-zinc-700">Happy with your package?</p>
          <p className="text-xs text-zinc-400">Edit the name, tagline, or colors above, then finalize.</p>
        </div>
        <div className="flex items-center gap-3">
          {runId && (
            <button
              type="button"
              onClick={() => navigator.clipboard.writeText(`${window.location.origin}/results/${runId}`)}
              className="rounded-lg border border-zinc-200 px-4 py-2 text-xs font-medium text-zinc-500 hover:text-zinc-900 transition-colors"
            >
              Copy link
            </button>
          )}
          <button
            type="button"
            onClick={onFinalize}
            disabled={saving}
            className="rounded-xl bg-zinc-900 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-zinc-700 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Finalize & Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Summary-first results view (used in results/[id] page) ──

interface ResultsPresentationProps {
  presentation: Presentation;
  outputs: Record<AgentId, AgentOutput>;
}

export function ResultsPresentation({ presentation, outputs }: ResultsPresentationProps) {
  const { brandTheme } = presentation;

  return (
    <div className="space-y-6">
      {/* Business identity header */}
      <div
        className="relative overflow-hidden rounded-2xl border border-zinc-200 shadow-sm"
        style={{
          background: `linear-gradient(135deg, ${brandTheme.primaryColor}08 0%, ${brandTheme.accentColor}12 100%)`,
        }}
      >
        <div className="px-6 py-8 sm:px-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900">{presentation.businessName}</h1>
          <p className="mt-2 text-lg text-zinc-500">{presentation.tagline}</p>
          <div className="mt-5 flex items-center gap-2">
            {(["primaryColor", "secondaryColor", "accentColor"] as const).map((key) => (
              <div
                key={key}
                className="h-5 w-5 rounded-full ring-2 ring-white shadow-sm"
                style={{ backgroundColor: brandTheme[key] }}
              />
            ))}
            <span className="ml-2 text-xs text-zinc-400">{brandTheme.fontFamily}</span>
          </div>
        </div>
      </div>

      {/* Agent summary cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        {AGENT_IDS.map((id) => {
          const summary = presentation.agentSummaries.find((s) => s.agentId === id);
          if (!summary || !outputs[id]?.content) return null;
          return (
            <SummaryCard
              key={id}
              agentId={id}
              summary={summary}
              content={outputs[id].content}
              brandTheme={brandTheme}
            />
          );
        })}
      </div>
    </div>
  );
}

export function MarkdownBody({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ children }) => (
          <h1 className="mt-8 mb-3 text-2xl font-bold text-zinc-900 first:mt-0">{children}</h1>
        ),
        h2: ({ children }) => (
          <h2 className="mt-7 mb-2 text-xl font-semibold text-zinc-900 border-b border-zinc-100 pb-1.5 first:mt-0">{children}</h2>
        ),
        h3: ({ children }) => (
          <h3 className="mt-5 mb-2 text-base font-semibold text-zinc-800">{children}</h3>
        ),
        h4: ({ children }) => (
          <h4 className="mt-4 mb-1 text-sm font-semibold text-zinc-700 uppercase tracking-wide">{children}</h4>
        ),
        p: ({ children }) => (
          <p className="mb-3 text-sm leading-relaxed text-zinc-700">{children}</p>
        ),
        ul: ({ children }) => (
          <ul className="mb-4 ml-4 space-y-1 list-disc text-zinc-700">{children}</ul>
        ),
        ol: ({ children }) => (
          <ol className="mb-4 ml-4 space-y-1 list-decimal text-zinc-700">{children}</ol>
        ),
        li: ({ children }) => (
          <li className="text-sm leading-relaxed text-zinc-700 pl-1">{children}</li>
        ),
        table: ({ children }) => (
          <div className="my-4 overflow-x-auto rounded-lg border border-zinc-200">
            <table className="w-full border-collapse text-sm">{children}</table>
          </div>
        ),
        thead: ({ children }) => (
          <thead className="bg-zinc-50">{children}</thead>
        ),
        th: ({ children }) => (
          <th className="border-b border-zinc-200 px-4 py-2.5 text-left text-xs font-semibold text-zinc-600 uppercase tracking-wide">
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td className="border-b border-zinc-100 px-4 py-2.5 text-sm text-zinc-700">
            {children}
          </td>
        ),
        tr: ({ children }) => (
          <tr className="hover:bg-zinc-50 transition-colors">{children}</tr>
        ),
        strong: ({ children }) => (
          <strong className="font-semibold text-zinc-900">{children}</strong>
        ),
        em: ({ children }) => (
          <em className="italic text-zinc-600">{children}</em>
        ),
        hr: () => (
          <hr className="my-8 border-zinc-200" />
        ),
        blockquote: ({ children }) => (
          <blockquote className="my-4 border-l-4 border-blue-200 bg-blue-50 pl-4 pr-3 py-2 rounded-r-lg text-zinc-700 italic">
            {children}
          </blockquote>
        ),
        code: ({ children, className }) => {
          const isBlock = className?.includes("language-");
          return isBlock ? (
            <code className="block my-3 rounded-lg bg-zinc-900 p-4 text-xs font-mono text-zinc-100 overflow-x-auto">
              {children}
            </code>
          ) : (
            <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-xs font-mono text-zinc-800">
              {children}
            </code>
          );
        },
        a: ({ children, href }) => (
          <a href={href} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
            {children}
          </a>
        ),
        input: ({ type, checked }) => {
          if (type === "checkbox") {
            return (
              <input type="checkbox" checked={checked ?? false} readOnly className="mr-2 rounded accent-emerald-600" />
            );
          }
          return null;
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
