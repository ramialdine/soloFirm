"use client";

import { useState, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Presentation, AgentId, AgentOutput } from "@/types/agents";
import { SummaryCard } from "./AgentCard";
import { AGENT_META } from "@/types/agents";
import RoadmapTimeline from "./RoadmapTimeline";

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

const FONT_OPTIONS = [
  "Inter", "Poppins", "Montserrat", "Roboto", "Open Sans",
  "Lato", "Raleway", "Nunito", "Playfair Display", "Merriweather",
  "Source Sans Pro", "Work Sans", "DM Sans", "Outfit", "Space Grotesk",
  "IBM Plex Sans", "Manrope", "Sora",
];

interface PackagingPanelProps {
  presentation: Presentation;
  outputs: Record<AgentId, AgentOutput>;
  onPresentationChange: (updated: Presentation) => void;
  onFinalize: () => void;
  runId: string | null;
  saving?: boolean;
  businessLocation?: string;
}

function titleCase(value: string): string {
  return value
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function deriveNameSuggestions(presentation: Presentation, brandContent: string): string[] {
  const candidates = new Set<string>();

  for (const name of presentation.nameSuggestions ?? []) {
    if (name?.trim()) candidates.add(titleCase(name.trim()));
  }

  if (presentation.businessName?.trim()) {
    candidates.add(titleCase(presentation.businessName.trim()));
  }

  const quoted = Array.from(brandContent.matchAll(/["“]([A-Za-z0-9&'\-\s]{3,40})["”]/g))
    .map((m) => titleCase(m[1].trim()))
    .filter((name) => name.split(" ").length <= 4);
  for (const name of quoted) candidates.add(name);

  const seed = titleCase((presentation.businessName || "Nova Launch").split(" ").slice(0, 2).join(" "));
  const generated = [
    `${seed} Labs`,
    `${seed} Studio`,
    `${seed} Works`,
    `${seed} Collective`,
    `${seed} Co.`,
  ];
  for (const name of generated) candidates.add(name);

  return Array.from(candidates).filter(Boolean).slice(0, 8);
}

function buildFallbackLogoSvg(presentation: Presentation): string {
  const safeName = (presentation.businessName || "SoloFirm").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const safeTagline = (presentation.tagline || "Launch your business in one run").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const { primaryColor, secondaryColor, accentColor } = presentation.brandTheme;
  return `<svg width="1200" height="320" viewBox="0 0 1200 320" fill="none" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="sf" x1="24" y1="24" x2="296" y2="296"><stop offset="0" stop-color="${secondaryColor}"/><stop offset="1" stop-color="${accentColor}"/></linearGradient></defs><rect x="24" y="24" width="272" height="272" rx="56" fill="url(#sf)"/><path d="M95 188c18 20 36 30 61 30 25 0 40-10 40-25 0-13-8-20-29-24l-31-6c-42-8-62-30-62-64 0-37 31-62 77-62 31 0 59 11 78 31" stroke="white" stroke-width="20" stroke-linecap="round"/><text x="338" y="168" fill="${primaryColor}" font-family="Inter, Arial, sans-serif" font-size="108" font-weight="800">${safeName}</text><text x="342" y="216" fill="#475569" font-family="Inter, Arial, sans-serif" font-size="34">${safeTagline}</text></svg>`;
}

function withLegalSelections(content: string, presentation: Presentation): string {
  const lines = [
    "## Selected Filing Details",
    `- Business Name: **${presentation.businessName}**`,
    `- Entity Structure: **${presentation.selectedBusinessStructure ?? "Not selected yet"}**`,
    "",
    "---",
    "",
  ];
  return `${lines.join("\n")}${content}`;
}

export function PackagingPanel({
  presentation,
  outputs,
  onPresentationChange,
  onFinalize,
  runId,
  saving,
}: PackagingPanelProps) {
  const { brandTheme } = presentation;
  const [logoLoading, setLogoLoading] = useState(false);
  const [logoError, setLogoError] = useState<string | null>(null);
  const [logoModalOpen, setLogoModalOpen] = useState(false);
  const nameSuggestions = deriveNameSuggestions(presentation, outputs.brand?.content ?? "");

  const currentLogoSvg = presentation.brandTemplate?.logoSvg ?? "";

  const handleDownloadSvg = useCallback(() => {
    if (!currentLogoSvg) return;
    const blob = new Blob([currentLogoSvg], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${presentation.businessName || "solofirm"}-logo.svg`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  }, [currentLogoSvg, presentation.businessName]);

  // Ensure AI-suggested font is in the dropdown
  const fontOptions = FONT_OPTIONS.includes(brandTheme.fontFamily)
    ? FONT_OPTIONS
    : [brandTheme.fontFamily, ...FONT_OPTIONS];

  const generateLogo = async () => {
    setLogoLoading(true);
    setLogoError(null);
    try {
      const res = await fetch("/api/brand/logo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessName: presentation.businessName,
          tagline: presentation.tagline,
          brandTheme: presentation.brandTheme,
          logoPrompt: presentation.brandTemplate?.logoPrompt,
          businessContext: presentation.brandTemplate?.visualDirection,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error || "Logo generation failed");
      }
      const data = await res.json();
      if (data?.svg) {
        onPresentationChange({
          ...presentation,
          brandTemplate: {
            ...(presentation.brandTemplate ?? {}),
            logoSvg: data.svg,
          },
        });
        setLogoModalOpen(true);
      } else {
        throw new Error("No SVG was returned by the logo service");
      }
    } catch (err) {
      const fallbackSvg = buildFallbackLogoSvg(presentation);
      onPresentationChange({
        ...presentation,
        brandTemplate: {
          ...(presentation.brandTemplate ?? {}),
          logoSvg: fallbackSvg,
        },
      });
      setLogoError(err instanceof Error ? err.message : "Could not generate logo from API; fallback logo created.");
      setLogoModalOpen(true);
    } finally {
      setLogoLoading(false);
    }
  };

  // Gate logo: require business name to be set before generating
  const canGenerateLogo = presentation.businessName.trim().length > 0;

  // Google Fonts URL for live preview
  const fontUrl = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(brandTheme.fontFamily)}:wght@400;600;700;800&display=swap`;

  return (
    <div className="space-y-6">
      {/* Load selected Google Font */}
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link rel="stylesheet" href={fontUrl} />

      {/* ── HERO: 90-Day Roadmap ── */}
      {presentation.roadmap && presentation.roadmap.length > 0 && (
        <div
          className="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6 shadow-sm"
          style={{
            background: `linear-gradient(180deg, ${brandTheme.accentColor}06 0%, white 30%)`,
            fontFamily: `'${brandTheme.fontFamily}', sans-serif`,
          }}
        >
          <RoadmapTimeline
            steps={presentation.roadmap}
            accentColor={brandTheme.accentColor}
            selectedBusinessStructure={presentation.selectedBusinessStructure}
            onBusinessStructureChange={(value) =>
              onPresentationChange({ ...presentation, selectedBusinessStructure: value })
            }
            businessStructureOptions={["LLC", "S-Corp", "C-Corp", "Sole Proprietorship", "Not sure"]}
          />
        </div>
      )}

      {/* ── Business identity — name, tagline, theme ── */}
      <div
        className="relative overflow-hidden rounded-2xl border border-zinc-200 shadow-sm"
        style={{
          background: `linear-gradient(135deg, ${brandTheme.primaryColor}08 0%, ${brandTheme.accentColor}12 100%)`,
          fontFamily: `'${brandTheme.fontFamily}', sans-serif`,
        }}
      >
        <div className="px-6 py-8 sm:px-8">
          <p className="text-xs font-medium uppercase tracking-widest text-zinc-400 mb-3">Your Business</p>

          <input
            type="text"
            value={presentation.businessName}
            onChange={(e) =>
              onPresentationChange({ ...presentation, businessName: e.target.value })
            }
            className="block w-full bg-transparent text-3xl sm:text-4xl font-bold text-zinc-900 border-none outline-none placeholder:text-zinc-300 focus:ring-0 p-0"
            style={{ fontFamily: `'${brandTheme.fontFamily}', sans-serif` }}
            placeholder="Business Name"
          />

          <input
            type="text"
            value={presentation.tagline}
            onChange={(e) =>
              onPresentationChange({ ...presentation, tagline: e.target.value })
            }
            className="mt-2 block w-full bg-transparent text-lg text-zinc-500 border-none outline-none placeholder:text-zinc-300 focus:ring-0 p-0"
            placeholder="Your tagline"
          />

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
            <select
              value={brandTheme.fontFamily}
              onChange={(e) =>
                onPresentationChange({
                  ...presentation,
                  brandTheme: { ...brandTheme, fontFamily: e.target.value },
                })
              }
              className="ml-2 rounded-lg border border-zinc-200 bg-white/80 px-3 py-1.5 text-xs text-zinc-600 w-36 focus:border-zinc-400 focus:outline-none"
            >
              {fontOptions.map((font) => (
                <option key={font} value={font} style={{ fontFamily: font }}>
                  {font}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* ── Name suggestions ── */}
      {nameSuggestions.length > 0 && (
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-zinc-800">Pick your business name</h3>
          <p className="mt-1 text-xs text-zinc-500">
            Choose one option below, or keep editing the custom name above.
          </p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {nameSuggestions.map((name) => {
              const selected = presentation.businessName === name;
              return (
                <button
                  key={name}
                  type="button"
                  onClick={() => onPresentationChange({ ...presentation, businessName: name })}
                  className={`rounded-lg border px-3 py-2 text-left text-sm transition-colors ${
                    selected
                      ? "border-zinc-900 bg-zinc-900 text-white"
                      : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300"
                  }`}
                  style={{ fontFamily: `'${brandTheme.fontFamily}', sans-serif` }}
                >
                  {name}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── AI Logo ── */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold text-zinc-800">AI Logo</h3>
            <p className="text-xs text-zinc-500 mt-1">
              {canGenerateLogo
                ? "Generate a logo using your brand identity."
                : "Set your business name above to unlock logo generation."}
            </p>
          </div>
          <button
            type="button"
            onClick={generateLogo}
            disabled={logoLoading || !canGenerateLogo}
            className="rounded-lg bg-zinc-900 px-4 py-2 text-xs font-semibold text-white hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {logoLoading ? "Generating..." : currentLogoSvg ? "Regenerate Logo" : "Generate AI Logo"}
          </button>
        </div>

        {logoError && (
          <p className="mt-2 text-xs text-amber-700">{logoError}</p>
        )}

        {presentation.brandTemplate?.logoSvg ? (
          <div className="mt-4 rounded-xl border border-zinc-200 bg-zinc-50 p-4">
            <div className="mb-2 flex items-center justify-between gap-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Logo preview</p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setLogoModalOpen(true)}
                  className="rounded-md border border-zinc-200 px-2.5 py-1 text-xs font-medium text-zinc-600 hover:text-zinc-900"
                >
                  Open
                </button>
                <button
                  type="button"
                  onClick={handleDownloadSvg}
                  className="rounded-md border border-zinc-200 px-2.5 py-1 text-xs font-medium text-zinc-600 hover:text-zinc-900"
                >
                  Download SVG
                </button>
              </div>
            </div>
            <div
              className="[&>svg]:h-24 [&>svg]:w-auto"
              dangerouslySetInnerHTML={{ __html: presentation.brandTemplate.logoSvg }}
            />
          </div>
        ) : null}
      </div>

      {/* ── Save bar ── */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-zinc-200 bg-white px-5 py-4 shadow-sm">
        <div>
          <p className="text-sm font-medium text-zinc-700">Happy with your roadmap and brand?</p>
          <p className="text-xs text-zinc-400">Your progress is saved. Finalize to lock in your launch package.</p>
        </div>
        <div className="flex items-center gap-3">
          {runId && (
            <a
              href={`/results/${runId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-zinc-200 px-4 py-2 text-xs font-medium text-zinc-500 hover:text-zinc-900 transition-colors"
            >
              View agent outputs
            </a>
          )}
          <button
            type="button"
            onClick={onFinalize}
            disabled={saving}
            className="rounded-xl bg-zinc-900 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-zinc-700 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save & Finalize"}
          </button>
        </div>
      </div>

      {/* Logo popup */}
      {logoModalOpen && currentLogoSvg && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={() => setLogoModalOpen(false)}
        >
          <div
            className="w-full max-w-4xl rounded-2xl bg-white shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-3">
              <div>
                <p className="text-sm font-semibold text-zinc-900">Generated Logo</p>
                <p className="text-xs text-zinc-500">Preview and download for immediate use</p>
              </div>
              <button
                type="button"
                onClick={() => setLogoModalOpen(false)}
                className="rounded-full p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-800"
              >
                ✕
              </button>
            </div>
            <div className="p-6 bg-zinc-50">
              <div
                className="rounded-xl border border-zinc-200 bg-white p-6 [&>svg]:w-full [&>svg]:h-auto"
                dangerouslySetInnerHTML={{ __html: currentLogoSvg }}
              />
            </div>
            <div className="flex justify-end gap-2 border-t border-zinc-100 px-5 py-3">
              <button
                type="button"
                onClick={() => setLogoModalOpen(false)}
                className="rounded-lg border border-zinc-200 px-4 py-2 text-xs font-medium text-zinc-600"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleDownloadSvg}
                className="rounded-lg bg-zinc-900 px-4 py-2 text-xs font-semibold text-white hover:bg-zinc-700"
              >
                Download SVG
              </button>
            </div>
          </div>
        </div>
      )}
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
  const fontUrl = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(brandTheme.fontFamily)}:wght@400;600;700;800&display=swap`;

  return (
    <div className="space-y-6">
      {/* Load selected Google Font */}
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link rel="stylesheet" href={fontUrl} />

      {/* Business identity header */}
      <div
        className="relative overflow-hidden rounded-2xl border border-zinc-200 shadow-sm"
        style={{
          background: `linear-gradient(135deg, ${brandTheme.primaryColor}08 0%, ${brandTheme.accentColor}12 100%)`,
          fontFamily: `'${brandTheme.fontFamily}', sans-serif`,
        }}
      >
        <div className="px-6 py-8 sm:px-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900" style={{ fontFamily: `'${brandTheme.fontFamily}', sans-serif` }}>{presentation.businessName}</h1>
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

      {/* Roadmap timeline */}
      {presentation.roadmap && presentation.roadmap.length > 0 && (
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6 shadow-sm">
          <RoadmapTimeline
            steps={presentation.roadmap}
            accentColor={brandTheme.accentColor}
          />
        </div>
      )}

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
              content={id === "legal" ? withLegalSelections(outputs[id].content, presentation) : outputs[id].content}
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
