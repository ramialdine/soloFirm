"use client";

import { useState, useMemo, useRef, useCallback, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";
import type { RoadmapStep } from "@/types/agents";

interface PlanPageClientProps {
  planDocument: string;
  businessName: string;
  runId?: string;
  brandTheme?: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    fontFamily: string;
  };
  roadmapSteps: RoadmapStep[];
}

interface TocEntry {
  id: string;
  text: string;
  level: number;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");
}

function childrenToText(children: React.ReactNode): string {
  if (typeof children === "string") return children;
  if (Array.isArray(children)) return (children as React.ReactNode[]).map(childrenToText).join("");
  if (children !== null && typeof children === "object") {
    const el = children as { props?: { children?: React.ReactNode } };
    if (el.props?.children !== undefined) return childrenToText(el.props.children);
  }
  return "";
}

function buildToc(markdown: string): TocEntry[] {
  const entries: TocEntry[] = [];
  for (const line of markdown.split("\n")) {
    const match = line.match(/^(#{2,3})\s+(.+)/);
    if (!match) continue;
    const text = match[2].trim();
    entries.push({ id: slugify(text), text, level: match[1].length });
  }
  return entries;
}

// Count checkboxes in markdown so we can pre-build keys
function countCheckboxes(markdown: string): string[] {
  const keys: string[] = [];
  const lines = markdown.split("\n");
  for (const line of lines) {
    const m = line.match(/^\s*[-*]\s+\[([ x])\]\s+(.+)/i);
    if (m) keys.push(slugify(m[2].trim().slice(0, 80)));
  }
  return keys;
}

export default function PlanPageClient({
  planDocument,
  businessName,
  runId,
  brandTheme,
  roadmapSteps,
}: PlanPageClientProps) {
  const [showToc, setShowToc] = useState(true);
  const [checks, setChecks] = useState<Record<string, boolean>>({});
  const storageKey = `plan_checks_${runId ?? "default"}`;

  // Load saved checkbox state
  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) setChecks(JSON.parse(stored));
    } catch { /* non-fatal */ }
  }, [storageKey]);

  const toggleCheck = useCallback((key: string) => {
    setChecks((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      try { localStorage.setItem(storageKey, JSON.stringify(next)); } catch { /* non-fatal */ }
      return next;
    });
  }, [storageKey]);

  const accentColor = brandTheme?.accentColor ?? "#10b981";
  const fontFamily = brandTheme?.fontFamily ?? "Inter";
  const fontUrl = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontFamily)}:wght@400;600;700;800&display=swap`;

  const toc = useMemo(() => buildToc(planDocument), [planDocument]);

  // Pre-extract checkbox keys in order so the counter approach stays stable
  const checkboxKeys = useMemo(() => countCheckboxes(planDocument), [planDocument]);
  const checkboxIndex = useRef(0);

  // Count completed tasks for progress bar
  const totalTasks = checkboxKeys.length;
  const completedTasks = checkboxKeys.filter((k) => checks[k]).length;

  const handlePrint = () => {
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.write(`<!DOCTYPE html><html><head><title>${businessName} — Launch Plan</title>
<style>
body{font-family:${fontFamily},-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:820px;margin:40px auto;padding:0 24px;line-height:1.7;color:#111}
h1{border-bottom:2px solid ${accentColor};padding-bottom:.3em;margin-bottom:.5em}
h2{margin-top:2em;color:${accentColor};font-size:1.2em;border-bottom:1px solid #e5e7eb;padding-bottom:.3em}
h3{margin-top:1.5em;font-size:1em}
table{border-collapse:collapse;width:100%;margin:1em 0}
th,td{border:1px solid #d1d5db;padding:8px 12px;text-align:left;font-size:.9em}
th{background:#f9fafb;font-weight:600}
ul,ol{margin:.5em 0 .5em 1.5em}
li{margin:.3em 0}
@media print{body{margin:20px}h2{break-after:avoid}table{break-inside:avoid}}
</style></head><body>`);
    w.document.write(`<h1>${businessName} — Full Launch Plan</h1>`);
    w.document.write(
      `<div style="white-space:pre-wrap;font-size:.95em">${planDocument
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")}</div>`
    );
    w.document.write("</body></html>");
    w.document.close();
    w.focus();
    w.print();
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(planDocument);
    } catch { /* fallback: no-op */ }
  };

  // Reset the counter before every render so it always matches document order
  checkboxIndex.current = 0;

  // Build the ReactMarkdown components — must be inside render so closures see latest checks
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const markdownComponents = useMemo((): any => {
    return {
      h1: ({ children }: { children: React.ReactNode }) => (
        <h1 className="mt-8 mb-3 text-2xl font-bold text-zinc-900 first:mt-0">{children}</h1>
      ),
      h2: ({ children }: { children: React.ReactNode }) => {
        const id = slugify(childrenToText(children));
        return (
          <h2 id={id} className="mt-7 mb-2 text-xl font-semibold text-zinc-900 border-b border-zinc-100 pb-1.5 first:mt-0 scroll-mt-20">
            {children}
          </h2>
        );
      },
      h3: ({ children }: { children: React.ReactNode }) => {
        const id = slugify(childrenToText(children));
        return (
          <h3 id={id} className="mt-5 mb-2 text-base font-semibold text-zinc-800 scroll-mt-20">
            {children}
          </h3>
        );
      },
      p: ({ children }: { children: React.ReactNode }) => (
        <p className="mb-3 text-sm leading-relaxed text-zinc-700">{children}</p>
      ),
      ul: ({ children }: { children: React.ReactNode }) => (
        <ul className="mb-4 space-y-1">{children}</ul>
      ),
      ol: ({ children }: { children: React.ReactNode }) => (
        <ol className="mb-4 ml-4 space-y-1 list-decimal text-zinc-700">{children}</ol>
      ),
      li: ({ children, ...props }: { children: React.ReactNode; checked?: boolean | null }) => {
        // GFM task list item
        if (props.checked !== null && props.checked !== undefined) {
          return (
            <li className="flex gap-0 list-none">
              {children}
            </li>
          );
        }
        return <li className="text-sm leading-relaxed text-zinc-700 pl-1 ml-4 list-disc">{children}</li>;
      },
      input: ({ type, checked: defaultChecked }: { type?: string; checked?: boolean }) => {
        if (type !== "checkbox") return null;
        const idx = checkboxIndex.current++;
        const key = checkboxKeys[idx] ?? `task_${idx}`;
        const isChecked = checks[key] ?? (defaultChecked ?? false);
        return (
          <button
            type="button"
            onClick={() => toggleCheck(key)}
            className={`mr-2 mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-all ${
              isChecked
                ? "border-emerald-500 bg-emerald-500 text-white"
                : "border-zinc-300 bg-white hover:border-zinc-400"
            }`}
            aria-label={isChecked ? "Mark incomplete" : "Mark complete"}
          >
            {isChecked && (
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M2 5l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </button>
        );
      },
      table: ({ children }: { children: React.ReactNode }) => (
        <div className="my-4 overflow-x-auto rounded-lg border border-zinc-200">
          <table className="w-full border-collapse text-sm">{children}</table>
        </div>
      ),
      thead: ({ children }: { children: React.ReactNode }) => (
        <thead className="bg-zinc-50">{children}</thead>
      ),
      th: ({ children }: { children: React.ReactNode }) => (
        <th className="border-b border-zinc-200 px-4 py-2.5 text-left text-xs font-semibold text-zinc-600 uppercase tracking-wide">
          {children}
        </th>
      ),
      td: ({ children }: { children: React.ReactNode }) => (
        <td className="border-b border-zinc-100 px-4 py-2.5 text-sm text-zinc-700">{children}</td>
      ),
      tr: ({ children }: { children: React.ReactNode }) => (
        <tr className="hover:bg-zinc-50 transition-colors">{children}</tr>
      ),
      strong: ({ children }: { children: React.ReactNode }) => (
        <strong className="font-semibold text-zinc-900">{children}</strong>
      ),
      em: ({ children }: { children: React.ReactNode }) => (
        <em className="italic text-zinc-600">{children}</em>
      ),
      hr: () => <hr className="my-8 border-zinc-200" />,
      blockquote: ({ children }: { children: React.ReactNode }) => (
        <blockquote className="my-4 border-l-4 border-blue-200 bg-blue-50 pl-4 pr-3 py-2 rounded-r-lg text-zinc-700 italic">
          {children}
        </blockquote>
      ),
      code: ({ children, className }: { children: React.ReactNode; className?: string }) => {
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
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checks, checkboxKeys, toggleCheck]);

  return (
    <div className="space-y-6">
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link rel="stylesheet" href={fontUrl} />

      {/* Header with actions */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2
            className="text-xl font-bold text-zinc-900"
            style={{ fontFamily: `'${fontFamily}', sans-serif` }}
          >
            {businessName} — Full 90-Day Plan
          </h2>
          <p className="text-sm text-zinc-500 mt-1">
            Full launch package — all 7 agent outputs in one document
            {roadmapSteps.length > 0 && ` · ${roadmapSteps.length} roadmap steps`}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs font-medium text-zinc-600 hover:bg-zinc-50 transition-colors"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" />
              <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
            </svg>
            Copy
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-1.5 rounded-lg bg-zinc-900 px-4 py-2 text-xs font-semibold text-white hover:bg-zinc-700 transition-colors"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 6 2 18 2 18 9" />
              <path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2" />
              <rect x="6" y="14" width="12" height="8" />
            </svg>
            Print / PDF
          </button>
        </div>
      </div>

      {/* Progress bar (shown when there are task checkboxes) */}
      {totalTasks > 0 && (
        <div className="rounded-xl border border-zinc-200 bg-white px-5 py-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-zinc-700">Launch Progress</span>
            <span className="text-sm font-semibold text-zinc-900">
              {completedTasks} / {totalTasks} tasks
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-zinc-100 overflow-hidden">
            <div
              className="h-2 rounded-full transition-all duration-500"
              style={{
                width: `${totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0}%`,
                backgroundColor: accentColor,
              }}
            />
          </div>
          {completedTasks === totalTasks && totalTasks > 0 && (
            <p className="mt-2 text-xs font-medium" style={{ color: accentColor }}>
              All tasks complete — you're ready to launch! 🎉
            </p>
          )}
        </div>
      )}

      <div className="flex gap-6">
        {/* Table of Contents sidebar */}
        {toc.length > 0 && showToc && (
          <aside className="hidden lg:block w-56 shrink-0">
            <div className="sticky top-6 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wide">Contents</h3>
                <button
                  type="button"
                  onClick={() => setShowToc(false)}
                  className="text-xs text-zinc-300 hover:text-zinc-500"
                >
                  Hide
                </button>
              </div>
              <nav className="space-y-1">
                {toc.map((entry) => (
                  <a
                    key={entry.id}
                    href={`#${entry.id}`}
                    className={`block text-xs text-zinc-500 hover:text-zinc-900 transition-colors truncate ${
                      entry.level === 3 ? "pl-3" : ""
                    }`}
                  >
                    {entry.text}
                  </a>
                ))}
              </nav>
            </div>
          </aside>
        )}

        {/* Plan content */}
        <div className="flex-1 min-w-0 rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8 shadow-sm">
          <div style={{ fontFamily: `'${fontFamily}', sans-serif` }}>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={markdownComponents}
            >
              {planDocument}
            </ReactMarkdown>
          </div>
        </div>
      </div>

      {/* Toggle TOC back */}
      {!showToc && toc.length > 0 && (
        <button
          type="button"
          onClick={() => setShowToc(true)}
          className="fixed bottom-6 left-6 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs font-medium text-zinc-600 shadow-md hover:bg-zinc-50 transition-colors"
        >
          Show Contents
        </button>
      )}
    </div>
  );
}
