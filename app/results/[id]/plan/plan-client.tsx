"use client";

import { useState, useMemo } from "react";
import { MarkdownBody } from "@/components/OutputPanel";
import type { RoadmapStep } from "@/types/agents";

interface PlanPageClientProps {
  planDocument: string;
  businessName: string;
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

function buildToc(markdown: string): TocEntry[] {
  const entries: TocEntry[] = [];
  const lines = markdown.split("\n");
  for (const line of lines) {
    const match = line.match(/^(#{2,3})\s+(.+)/);
    if (!match) continue;
    const level = match[1].length;
    const text = match[2].trim();
    const id = text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");
    entries.push({ id, text, level });
  }
  return entries;
}

function addAnchorsToMarkdown(markdown: string): string {
  return markdown.replace(/^(#{2,3})\s+(.+)/gm, (_match, hashes, text) => {
    const id = text
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");
    return `${hashes} <span id="${id}"></span>${text}`;
  });
}

export default function PlanPageClient({
  planDocument,
  businessName,
  brandTheme,
  roadmapSteps,
}: PlanPageClientProps) {
  const [showToc, setShowToc] = useState(true);

  const accentColor = brandTheme?.accentColor ?? "#10b981";
  const fontFamily = brandTheme?.fontFamily ?? "Inter";
  const fontUrl = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontFamily)}:wght@400;600;700;800&display=swap`;

  const toc = useMemo(() => buildToc(planDocument), [planDocument]);
  const anchored = useMemo(
    () => addAnchorsToMarkdown(planDocument),
    [planDocument]
  );

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
    } catch {
      /* fallback: no-op */
    }
  };

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
            {roadmapSteps.length > 0 &&
              ` · ${roadmapSteps.length} roadmap steps`}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs font-medium text-zinc-600 hover:bg-zinc-50 transition-colors"
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
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
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="6 9 6 2 18 2 18 9" />
              <path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2" />
              <rect x="6" y="14" width="12" height="8" />
            </svg>
            Print / PDF
          </button>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Table of Contents sidebar */}
        {toc.length > 0 && showToc && (
          <aside className="hidden lg:block w-56 shrink-0">
            <div className="sticky top-6 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wide">
                  Contents
                </h3>
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
            <MarkdownBody content={anchored} />
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
