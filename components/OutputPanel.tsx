"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Presentation, AgentId, AgentOutput, RoadmapStep } from "@/types/agents";
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


interface LaunchPlanPanelProps {
  steps: RoadmapStep[];
  businessName: string;
  accentColor: string;
  plannerContent?: string; // raw planner markdown for supplementary detail in PDF
}

function LaunchPlanPanel({ steps, businessName, accentColor, plannerContent }: LaunchPlanPanelProps) {
  const handlePrint = () => {
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.write(`<!DOCTYPE html><html><head><title>${businessName} — 90-Day Launch Plan</title><style>
      body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:820px;margin:40px auto;padding:0 24px;line-height:1.7;color:#111}
      h1{border-bottom:2px solid #10b981;padding-bottom:.3em;margin-bottom:.5em}
      h2{margin-top:2em;color:#10b981;font-size:1.2em}
      .step{margin:1em 0;padding:.8em 1em;border-left:3px solid #d1d5db;background:#fafafa;border-radius:0 8px 8px 0}
      .step-title{font-weight:700;font-size:1em;margin:0}
      .step-meta{color:#888;font-size:.85em;margin:.2em 0}
      .step-action{margin-top:.5em;font-size:.95em}
      .step-why{color:#555;font-style:italic;font-size:.9em;margin-top:.3em}
      @media print{body{margin:20px}.step{break-inside:avoid}}
    </style></head><body>`);
    w.document.write(`<h1>${businessName} — 90-Day Launch Plan</h1>`);

    // Group steps by phase
    const phases = new Map<string, typeof steps>();
    for (const step of steps) {
      const list = phases.get(step.phase) ?? [];
      list.push(step);
      phases.set(step.phase, list);
    }
    for (const [phase, phaseSteps] of phases) {
      w.document.write(`<h2>${phase}</h2>`);
      for (const s of phaseSteps) {
        w.document.write(`<div class="step">
          <p class="step-title">${s.title}</p>
          <p class="step-meta">${s.week} &middot; ${s.estimatedTime ?? ""} &middot; ${s.cost ?? "Free"}</p>
          <p class="step-action"><strong>Action:</strong> ${s.action}</p>
          <p class="step-why">${s.why}</p>
        </div>`);
      }
    }

    // Append raw planner detail as supplementary
    if (plannerContent) {
      w.document.write(`<hr style="margin:2em 0"><h2>Full Agent Analysis</h2><div style="white-space:pre-wrap;font-size:.9em;color:#444">${plannerContent.replace(/</g,"&lt;").replace(/>/g,"&gt;")}</div>`);
    }

    w.document.write("</body></html>");
    w.document.close();
    w.focus();
    w.print();
  };

  // Group by phase for inline display
  const phases = new Map<string, RoadmapStep[]>();
  for (const step of steps) {
    const list = phases.get(step.phase) ?? [];
    list.push(step);
    phases.set(step.phase, list);
  }

  const completedCount = steps.length; // all steps shown
  const phaseEntries = Array.from(phases.entries());

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm overflow-hidden">
      {/* Header */}
      <div
        className="flex items-center gap-3 px-5 py-4"
        style={{ background: `linear-gradient(135deg, ${accentColor}12, ${accentColor}22)` }}
      >
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
          style={{ backgroundColor: `${accentColor}25` }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-sm font-bold text-zinc-900">Your 90-Day Launch Plan</h2>
          <p className="text-xs text-zinc-500">{completedCount} steps across {phaseEntries.length} phases — built from your agent analysis</p>
        </div>
        <button
          type="button"
          onClick={handlePrint}
          className="ml-auto flex items-center gap-1.5 rounded-lg bg-zinc-900 px-4 py-2 text-xs font-semibold text-white hover:bg-zinc-700 transition-colors shrink-0"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/><rect x="6" y="14" width="12" height="8"/>
          </svg>
          Download PDF
        </button>
      </div>
      {/* Phase overview */}
      <div className="px-5 py-4 border-t border-zinc-100">
        <div className="flex flex-wrap gap-3">
          {phaseEntries.map(([phase, phaseSteps]) => (
            <div
              key={phase}
              className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium"
              style={{ backgroundColor: `${accentColor}10`, color: accentColor }}
            >
              <span className="font-bold">{phase}</span>
              <span className="opacity-60">{phaseSteps.length} steps</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
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
  businessLocation,
}: PackagingPanelProps) {
  const { brandTheme } = presentation;
  const nameSuggestions = deriveNameSuggestions(presentation, outputs.brand?.content ?? "");

  // Ensure AI-suggested font is in the dropdown
  const fontOptions = FONT_OPTIONS.includes(brandTheme.fontFamily)
    ? FONT_OPTIONS
    : [brandTheme.fontFamily, ...FONT_OPTIONS];

  // Google Fonts URL for live preview
  const fontUrl = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(brandTheme.fontFamily)}:wght@400;600;700;800&display=swap`;

  return (
    <div className="space-y-6">
      {/* Load selected Google Font */}
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link rel="stylesheet" href={fontUrl} />

      {/* ── HERO: 90-Day Launch Plan (Planner output) ── */}
      {presentation.roadmap && presentation.roadmap.length > 0 && (
        <LaunchPlanPanel
          steps={presentation.roadmap}
          businessName={presentation.businessName}
          accentColor={brandTheme.accentColor}
          plannerContent={outputs.planner?.content}
        />
      )}

      {/* ── Roadmap Timeline ── */}
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
            businessState={businessLocation}
            runId={runId ?? undefined}
            onViewAgent={(agentId) => {
              document.getElementById(`agent-card-${agentId}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
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

      {/* ── Logo ── */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold text-zinc-800">Logo</h3>
            <p className="text-xs text-zinc-500 mt-1">
              Use Canva&apos;s free logo generator — plug in your brand colors and name from the Brand Package above.
            </p>
          </div>
          <a
            href="https://www.canva.com/create/logos/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-lg bg-zinc-900 px-4 py-2 text-xs font-semibold text-white hover:bg-zinc-700 transition-colors"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
              <path d="M15 3h6v6M10 14L21 3" />
            </svg>
            Create on Canva →
          </a>
        </div>
      </div>

      {/* ── Save bar ── */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-zinc-200 bg-white px-5 py-4 shadow-sm">
        <div>
          <p className="text-sm font-medium text-zinc-700">Happy with your roadmap and brand?</p>
          <p className="text-xs text-zinc-400">Finalize to lock in your launch package.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => document.getElementById("packaging-agent-outputs")?.scrollIntoView({ behavior: "smooth", block: "start" })}
            className="rounded-lg border border-zinc-200 px-4 py-2 text-xs font-medium text-zinc-500 hover:text-zinc-900 transition-colors"
          >
            View agent outputs ↓
          </button>
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

      {/* ── Agent output cards (inline — no Supabase needed, exclude planner since it's shown above) ── */}
      <div id="packaging-agent-outputs" className="grid gap-4 sm:grid-cols-2">
        {AGENT_IDS.filter((id) => id !== "planner").map((id) => {
          const output = outputs[id];
          if (!output?.content) return null;
          const summary = presentation.agentSummaries?.find((s) => s.agentId === id);
          return (
            <div key={id} id={`agent-card-${id}`}>
              <SummaryCard
                agentId={id}
                summary={summary ?? { agentId: id, headline: AGENT_META[id].deliverable, bullets: [] }}
                content={id === "legal" ? withLegalSelections(output.content, presentation) : output.content}
                brandTheme={presentation.brandTheme}
              />
            </div>
          );
        })}
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

      {/* 90-Day Launch Plan */}
      {presentation.roadmap && presentation.roadmap.length > 0 && (
        <LaunchPlanPanel
          steps={presentation.roadmap}
          businessName={presentation.businessName}
          accentColor={brandTheme.accentColor}
          plannerContent={outputs.planner?.content}
        />
      )}

      {/* Roadmap timeline */}
      {presentation.roadmap && presentation.roadmap.length > 0 && (
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6 shadow-sm">
          <RoadmapTimeline
            steps={presentation.roadmap}
            accentColor={brandTheme.accentColor}
            onViewAgent={(agentId) => {
              document.getElementById(`agent-card-${agentId}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
          />
        </div>
      )}

      {/* Agent summary cards (exclude planner since it's shown above) */}
      <div className="grid gap-4 sm:grid-cols-2">
        {AGENT_IDS.filter((id) => id !== "planner").map((id) => {
          const summary = presentation.agentSummaries.find((s) => s.agentId === id);
          if (!summary || !outputs[id]?.content) return null;
          return (
            <div key={id} id={`agent-card-${id}`}>
              <SummaryCard
                agentId={id}
                summary={summary}
                content={id === "legal" ? withLegalSelections(outputs[id].content, presentation) : outputs[id].content}
                brandTheme={brandTheme}
              />
            </div>
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
