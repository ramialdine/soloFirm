"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface OutputPanelProps {
  finalOutput: string | null;
  isComplete: boolean;
}

const SECTIONS = [
  { id: "roadmap", label: "90-Day Launch Plan", marker: "## 90-Day Launch Roadmap" },
  { id: "market", label: "Market Intelligence", marker: "## Market Intelligence" },
  { id: "legal", label: "Legal & Compliance", marker: "## Legal Documents & Compliance" },
  { id: "finance", label: "Financial Setup", marker: "## Financial Setup Guide" },
  { id: "brand", label: "Brand Package", marker: "## Brand Package" },
  { id: "review", label: "Launch Review", marker: "## Launch Readiness Review" },
];

function splitSections(output: string): Record<string, string> {
  const result: Record<string, string> = {};

  for (let i = 0; i < SECTIONS.length; i++) {
    const section = SECTIONS[i];
    const startIndex = output.indexOf(section.marker);
    if (startIndex === -1) continue;

    // Find the end: either the next section marker or end of string
    let endIndex = output.length;
    for (let j = i + 1; j < SECTIONS.length; j++) {
      const nextIdx = output.indexOf(SECTIONS[j].marker);
      if (nextIdx > startIndex) {
        // Check for a "---" separator before the next section
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
  const [activeTab, setActiveTab] = useState("roadmap");

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
