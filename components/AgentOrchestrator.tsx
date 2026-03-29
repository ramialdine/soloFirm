"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AgentCard from "./AgentCard";
import OutputPanel, { PackagingPanel } from "./OutputPanel";
import { MarkdownBody } from "./OutputPanel";
import type {
  AgentId,
  AgentOutput,
  AgentStatus,
  SSEEvent,
  IntakeData,
  QAQuestion,
  QAHistoryEntry,
  Presentation,
} from "@/types/agents";
import { AGENT_META } from "@/types/agents";

const AGENT_IDS: AgentId[] = ["planner", "research", "legal", "finance", "brand", "social", "critic"];

type Step = "intake" | "qa" | "brand-selection" | "running" | "packaging" | "complete";
type QaSource = "ai" | "fallback" | "test" | "unknown";

interface QaMetaPayload {
  _meta?: {
    source?: QaSource;
    reason?: string;
    attempts?: number;
    mode?: string;
  };
}

const STAGES = [
  { value: "Solo", label: "Solo founder" },
  { value: "2-3 co-founders", label: "2-3 co-founders" },
  { value: "Small team (4-10)", label: "Small team (4-10)" },
];

const BUDGETS = [
  { value: "$0 - $1,000", label: "$0 – $1,000 (bootstrapping)" },
  { value: "$1,000 - $5,000", label: "$1,000 – $5,000" },
  { value: "$5,000 - $25,000", label: "$5,000 – $25,000" },
  { value: "$25,000+", label: "$25,000+" },
];

const ENTITIES = [
  { value: "LLC", label: "LLC" },
  { value: "S-Corp", label: "S-Corp" },
  { value: "C-Corp", label: "C-Corp" },
  { value: "Sole Proprietorship", label: "Sole Proprietorship" },
  { value: "Not sure", label: "Not sure yet" },
];

const US_STATES = [
  "Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut",
  "Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa",
  "Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan",
  "Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire",
  "New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio",
  "Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota",
  "Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia",
  "Wisconsin","Wyoming",
];

function makeInitialOutputs(): Record<AgentId, AgentOutput> {
  const out: Partial<Record<AgentId, AgentOutput>> = {};
  for (const id of AGENT_IDS) {
    out[id] = { agentId: id, status: "idle", content: "" };
  }
  return out as Record<AgentId, AgentOutput>;
}

const OPTION_LETTERS = ["A", "B", "C", "D", "E"];

// ── Inline QuestionCard ───────────────────────────────────────────────────────

interface QuestionCardProps {
  index: number;
  roundIndex: number; // offset for display numbering
  question: QAQuestion;
  selected: string[];
  otherValue: string;
  onToggle: (answer: string) => void;
  onOtherChange: (val: string) => void;
}

function QuestionCard({
  index,
  roundIndex,
  question,
  selected,
  otherValue,
  onToggle,
  onOtherChange,
}: QuestionCardProps) {
  const displayNum = roundIndex + index + 1;
  const options = [...question.options, "Other — tell me more", "I don't know"];
  const isOtherSelected = selected.includes("__other__");

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
      <p className="mb-1 text-sm font-medium text-zinc-500">Question {displayNum}</p>
      <p className="mb-1 text-base font-semibold text-zinc-900 leading-snug">{question.question}</p>
      <p className="mb-4 text-xs text-zinc-400">Select all that apply</p>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {options.map((opt, j) => {
          const key = j === 3 ? "__other__" : opt;
          const isSelected = selected.includes(key);

          return (
            <button
              key={j}
              type="button"
              onClick={() => onToggle(key)}
              className={`group flex items-start gap-3 rounded-xl border-2 px-4 py-3 text-left text-sm transition-all ${
                isSelected
                  ? "border-blue-500 bg-blue-50 text-blue-900"
                  : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50"
              }`}
            >
              <span
                className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded text-xs font-bold transition-colors ${
                  isSelected
                    ? "bg-blue-500 text-white"
                    : "bg-zinc-100 text-zinc-500 group-hover:bg-zinc-200"
                }`}
              >
                {isSelected ? "✓" : OPTION_LETTERS[j]}
              </span>
              <span className="leading-snug">{opt}</span>
            </button>
          );
        })}
      </div>

      {isOtherSelected && (
        <div className="mt-3">
          <input
            type="text"
            value={otherValue}
            onChange={(e) => {
              onOtherChange(e.target.value);
            }}
            onBlur={() => {
              if (!otherValue.trim()) onToggle("__other__");
            }}
            placeholder="Describe your situation…"
            autoFocus
            className="w-full rounded-xl border border-zinc-300 px-4 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function AgentOrchestrator() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("intake");

  // Intake form
  const [intake, setIntake] = useState<IntakeData>({
    businessIdea: "",
    location: "",
    budgetRange: "$1,000 - $5,000",
    entityPreference: "Not sure",
    teamSize: "Solo",
  });
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Q&A state
  const [qaRound, setQaRound] = useState<1 | 2>(1);
  const [qaQuestions, setQaQuestions] = useState<QAQuestion[]>([]);
  const [qaAnswers, setQaAnswers] = useState<Record<number, string[]>>({});
  const [qaOtherValues, setQaOtherValues] = useState<Record<number, string>>({});
  const [qaHistory, setQaHistory] = useState<QAHistoryEntry[]>([]);
  const [qaLoading, setQaLoading] = useState(false);
  const [qaReadyMessage, setQaReadyMessage] = useState("");
  const [planSummary, setPlanSummary] = useState("");
  const [qaSource, setQaSource] = useState<QaSource>("unknown");
  const [qaSourceReason, setQaSourceReason] = useState<string>("");

  // Agent execution state
  const [outputs, setOutputs] = useState<Record<AgentId, AgentOutput>>(makeInitialOutputs);
  const [finalOutput, setFinalOutput] = useState<string | null>(null);
  const [runId, setRunId] = useState<string | null>(null);
  const [expandedAgent, setExpandedAgent] = useState<AgentId | null>(null);
  const [currentPhase, setCurrentPhase] = useState(0);
  const abortRef = useRef<AbortController | null>(null);

  // Packaging state
  const [presentation, setPresentation] = useState<Presentation | null>(null);
  const [packagingReady, setPackagingReady] = useState(false);
  const [saving, setSaving] = useState(false);
  const [synthesizing, setSynthesizing] = useState(false);

  // Brand selection state (pre-run)
  const [brandName, setBrandName] = useState("");
  const [brandSuggestions, setBrandSuggestions] = useState<string[]>([]);
  const [brandTagline, setBrandTagline] = useState("");
  const [brandAccentColor, setBrandAccentColor] = useState("#10b981");
  const [brandFontFamily, setBrandFontFamily] = useState("Inter");
  const [loadingBrand, setLoadingBrand] = useState(false);

  // ── Persist state across OAuth redirects ──
  const STORAGE_KEY = "solofirm_run_state";

  // Save state to sessionStorage whenever we're in packaging/complete
  useEffect(() => {
    if ((step === "packaging" || step === "complete") && presentation) {
      const state = {
        step,
        intake,
        outputs,
        finalOutput,
        runId,
        presentation,
        currentPhase,
      };
      try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch { /* quota exceeded — non-fatal */ }
    }
  }, [step, intake, outputs, finalOutput, runId, presentation, currentPhase]);

  // Restore state on mount if available
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        const state = JSON.parse(saved);
        if (state.step === "packaging" || state.step === "social-setup" || state.step === "complete") {
          setStep(state.step);
          setIntake(state.intake);
          setOutputs(state.outputs);
          setFinalOutput(state.finalOutput);
          setRunId(state.runId);
          setPresentation(state.presentation);
          setCurrentPhase(state.currentPhase);
        }
      }
    } catch { /* corrupt data — ignore */ }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const updateAgent = useCallback((agentId: AgentId, update: Partial<AgentOutput>) => {
    setOutputs((prev) => ({
      ...prev,
      [agentId]: { ...prev[agentId], ...update },
    }));
  }, []);

  const applyQaMeta = useCallback((data: QaMetaPayload) => {
    const source = data?._meta?.source ?? "unknown";
    const reason = data?._meta?.reason ?? "";
    setQaSource(source);
    setQaSourceReason(reason);

    if (source === "fallback") {
      console.warn("QA questions are using fallback defaults", data?._meta);
    }
    if (source === "test") {
      console.warn("QA questions are in TEST_MODE mock mode", data?._meta);
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? []);
    setFiles((prev) => {
      const names = new Set(prev.map((f) => f.name));
      return [...prev, ...selected.filter((f) => !names.has(f.name))];
    });
  };

  // Resolve the display value for an answer — joins multi-select choices
  const resolveAnswer = (qIndex: number): string => {
    const selections = qaAnswers[qIndex] ?? [];
    return selections
      .map((s) => (s === "__other__" ? qaOtherValues[qIndex]?.trim() ?? "" : s))
      .filter(Boolean)
      .join("; ");
  };

  // All current questions have at least one non-empty selection
  const allAnswered =
    qaQuestions.length > 0 &&
    qaQuestions.every((_, i) => resolveAnswer(i).trim() !== "");

  // ── Finalize: get plan summary ───────────────────────────────────────────
  const finalizePlan = async (history: QAHistoryEntry[]) => {
    setQaLoading(true);
    try {
      const res = await fetch("/api/qa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ intake, history, finalize: true }),
      });
      if (res.ok) {
        const { plan } = await res.json();
        if (plan) setPlanSummary(plan);
      }
    } catch { /* non-fatal */ }
    finally {
      setQaLoading(false);
    }
  };

  // ── Retry Q&A after empty result ─────────────────────────────────────────
  const retryQa = async () => {
    setQaLoading(true);
    try {
      const res = await fetch("/api/qa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ intake, round: 1, history: [] }),
      });
      if (res.ok) {
        const data = await res.json();
        applyQaMeta(data);
        if (data.ready) {
          setQaReadyMessage(data.message ?? "");
          await finalizePlan([]);
        } else {
          setQaQuestions(data.questions ?? []);
          setQaRound(1);
        }
      }
    } catch { /* ignore */ } finally {
      setQaLoading(false);
    }
  };

  // ── Step 1: Submit intake → get round 1 questions ───────────────────────
  const handleIntakeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!intake.businessIdea.trim() || !intake.location.trim()) return;
    setQaLoading(true);

    // Parse uploaded documents
    let documents = "";
    if (files.length > 0) {
      try {
        const form = new FormData();
        files.forEach((f) => form.append("files", f));
        const res = await fetch("/api/parse-documents", { method: "POST", body: form });
        if (res.ok) {
          const { text } = await res.json();
          documents = text ?? "";
        }
      } catch { /* non-fatal */ }
    }

    const updatedIntake = { ...intake, documents };
    setIntake(updatedIntake);

    try {
      const res = await fetch("/api/qa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ intake: updatedIntake, round: 1, history: [] }),
      });
      if (res.ok) {
        const data = await res.json();
        applyQaMeta(data);
        // If the API returned ready:true immediately (edge case), skip to finalize
        if (data.ready) {
          setQaReadyMessage(data.message ?? "");
          setStep("qa");
          await finalizePlan([]);
        } else {
          setQaQuestions(data.questions ?? []);
          setQaRound(1);
          setStep("qa");
        }
      } else {
        throw new Error("Q&A unavailable");
      }
    } catch {
      // Skip Q&A entirely on failure
      setStep("running");
      startOrchestration(updatedIntake, "", "");
    } finally {
      setQaLoading(false);
    }
  };

  // ── Step 2: Submit answers → round 2 or finalize ────────────────────────
  const handleQaSubmit = async () => {
    if (!allAnswered || qaLoading) return;

    // Build history from current round's answers
    const currentHistory: QAHistoryEntry[] = [
      ...qaHistory,
      ...qaQuestions.map((q, i) => ({
        question: q.question,
        answer: resolveAnswer(i),
      })),
    ];

    setQaLoading(true);

    if (qaRound === 2) {
      // Always finalize after round 2
      setQaHistory(currentHistory);
      setQaAnswers({});
      setQaOtherValues({});
      setQaQuestions([]);
      await finalizePlan(currentHistory);
      return;
    }

    // Round 1 done → ask AI if more questions needed
    try {
      const res = await fetch("/api/qa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ intake, round: 2, history: currentHistory }),
      });

      if (res.ok) {
        const data = await res.json();
        applyQaMeta(data);

        if (data.ready || !data.questions?.length) {
          // AI has enough info → auto-finalize
          setQaReadyMessage(data.message ?? "");
          setQaHistory(currentHistory);
          setQaAnswers({});
          setQaOtherValues({});
          setQaQuestions([]);
          await finalizePlan(currentHistory);
        } else {
          // Show round 2 questions
          setQaHistory(currentHistory);
          setQaAnswers({});
          setQaOtherValues({});
          setQaQuestions(data.questions);
          setQaRound(2);
          setQaLoading(false);
        }
      }
    } catch {
      // Fallback: finalize anyway
      setQaHistory(currentHistory);
      await finalizePlan(currentHistory);
    }
  };

  // ── Step 3a: Transition to brand selection ───────────────────────────────
  const handleGoToBrandSelection = async () => {
    setStep("brand-selection");
    setLoadingBrand(true);
    try {
      const res = await fetch("/api/naming", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessIdea: intake.businessIdea,
          location: intake.location,
          budgetRange: intake.budgetRange,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        const suggestions: string[] = data.nameSuggestions ?? [];
        setBrandSuggestions(suggestions);
        const firstName = suggestions[0] ?? data.businessName ?? "";
        setBrandName(firstName);
        setBrandTagline(data.tagline ?? "");
      }
    } catch { /* use empty state */ }
    finally { setLoadingBrand(false); }
  };

  // ── Step 3b: Launch agents from brand selection ───────────────────────────
  const handleLaunchFromBrandSelection = () => {
    const clarifyingAnswers = qaHistory
      .map((h) => `Q: ${h.question}\nA: ${h.answer}`)
      .join("\n\n");
    setStep("running");
    startOrchestration(
      {
        ...intake,
        selectedBusinessName: brandName.trim() || undefined,
        selectedAccentColor: brandAccentColor !== "#10b981" ? brandAccentColor : undefined,
        selectedFontFamily: brandFontFamily !== "Inter" ? brandFontFamily : undefined,
      },
      clarifyingAnswers,
      planSummary
    );
  };

  // ── Step 3: Launch agents (legacy — called when skipping brand selection) ──
  const handleLaunchAgents = () => {
    const clarifyingAnswers = qaHistory
      .map((h) => `Q: ${h.question}\nA: ${h.answer}`)
      .join("\n\n");

    setStep("running");
    startOrchestration(intake, clarifyingAnswers, planSummary);
  };

  const startOrchestration = async (
    intakeData: IntakeData,
    clarifyingAnswers: string,
    plan: string
  ) => {
    setOutputs(makeInitialOutputs());
    setFinalOutput(null);
    setRunId(null);
    setCurrentPhase(0);
    setExpandedAgent(null);

    abortRef.current = new AbortController();

    try {
      const res = await fetch("/api/orchestrate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...intakeData,
          clarifyingAnswers,
          planSummary: plan,
        }),
        signal: abortRef.current.signal,
      });

      if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}`);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          const match = line.match(/^data: ([\s\S]+)$/);
          if (!match) continue;

          try {
            const event: SSEEvent = JSON.parse(match[1]);

            switch (event.type) {
              case "run_started":
                setRunId(event.run?.id ?? null);
                break;
              case "agent_started":
                if (event.agentId) {
                  updateAgent(event.agentId, { status: "running" as AgentStatus });
                }
                break;
              case "agent_chunk":
                if (event.agentId && event.content) {
                  setOutputs((prev) => ({
                    ...prev,
                    [event.agentId!]: {
                      ...prev[event.agentId!],
                      content: prev[event.agentId!].content + event.content,
                    },
                  }));
                }
                break;
              case "agent_complete":
                if (event.agentId) {
                  updateAgent(event.agentId, { status: "complete" as AgentStatus });
                }
                break;
              case "agent_error":
                if (event.agentId) {
                  updateAgent(event.agentId, { status: "error" as AgentStatus, error: event.error });
                }
                break;
              case "phase_complete":
                setCurrentPhase(event.phase ?? 0);
                break;
              case "synthesis_started":
                setSynthesizing(true);
                break;
              case "synthesis_complete":
                setSynthesizing(false);
                if (event.presentation) {
                  setPresentation(event.presentation);
                }
                break;
              case "run_complete": {
                const completedRunId = event.run?.id ?? null;
                setFinalOutput(event.run?.final_output ?? null);
                setRunId(completedRunId);
                if (event.run?.presentation) {
                  setPresentation(event.run.presentation);
                }
                setPackagingReady(true);
                // Orchestrate route already saved to Supabase — go directly to plan page
                if (completedRunId) {
                  router.push(`/results/${completedRunId}/plan`);
                } else {
                  setStep("packaging"); // fallback if no runId
                }
                break;
              }
            }
          } catch { /* skip malformed */ }
        }
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name !== "AbortError") {
        console.error("Orchestration failed:", err);
      }
    }
  };

  const handleStartOver = () => {
    setStep("intake");
    setIntake({ businessIdea: "", location: "", budgetRange: "$1,000 - $5,000", entityPreference: "Not sure", teamSize: "Solo" });
    setFiles([]);
    setQaRound(1);
    setQaQuestions([]);
    setQaAnswers({});
    setQaOtherValues({});
    setQaHistory([]);
    setQaLoading(false);
    setQaReadyMessage("");
    setPlanSummary("");
    setOutputs(makeInitialOutputs());
    setFinalOutput(null);
    setRunId(null);
    setCurrentPhase(0);
    setExpandedAgent(null);
    setPresentation(null);
    setPackagingReady(false);
    setSaving(false);
    setSynthesizing(false);
    try { sessionStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
  };

  const handleFinalize = async () => {
    if (!runId || !presentation) return;
    setSaving(true);
    try {
      await fetch("/api/finalize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ runId, presentation }),
      });
    } catch { /* best-effort */ }
    setSaving(false);
    // Navigate to the roadmap results page (the new tabbed interface)
    router.push(`/results/${runId}/roadmap`);
  };

  const phaseLabels = ["Waiting", "Research", "Legal · Finance", "Brand", "Social Media", "Planning", "Review"];

  const getAgentDisplayContent = useCallback((agentId: AgentId) => {
    const base = outputs[agentId]?.content ?? "";
    if (agentId !== "legal") return base;
    if (!presentation) return base;
    return `## Selected Filing Details\n- Business Name: **${presentation.businessName}**\n- Entity Structure: **${presentation.selectedBusinessStructure ?? "Not selected yet"}**\n\n---\n\n${base}`;
  }, [outputs, presentation]);

  // Scroll to top on stage transitions
  useEffect(() => {
    if (step === "packaging" || step === "complete") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [step]);

  // ── RENDER ────────────────────────────────────────────────────────────────

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-6">

      {/* ── Step indicator ── */}
      <div className="flex items-center gap-2 text-xs">
        {[
          { key: "intake", label: "Your Business" },
          { key: "qa", label: "Quick Questions" },
          { key: "brand-selection", label: "Your Brand" },
          { key: "running", label: "Agents Working" },
          { key: "complete", label: "Launch Ready" },
        ].map((s, i, arr) => {
          const stepOrder = ["intake", "qa", "brand-selection", "running", "packaging", "complete"];
          const currentIdx = stepOrder.indexOf(step);
          const thisIdx = stepOrder.indexOf(s.key);
          const isDone = currentIdx > thisIdx;
          const isCurrent = step === s.key;

          return (
            <div key={s.key} className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <span
                  className={`flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold ${
                    isDone
                      ? "bg-emerald-500 text-white"
                      : isCurrent
                        ? "bg-zinc-900 text-white"
                        : "bg-zinc-100 text-zinc-400"
                  }`}
                >
                  {isDone ? "✓" : i + 1}
                </span>
                <span className={`font-medium ${isCurrent ? "text-zinc-900" : isDone ? "text-emerald-600" : "text-zinc-400"}`}>
                  {s.label}
                </span>
              </div>
              {i < arr.length - 1 && (
                <div className={`h-px w-6 ${isDone ? "bg-emerald-300" : "bg-zinc-200"}`} />
              )}
            </div>
          );
        })}
      </div>

      {/* ══════════════════════════════════════════════════════ */}
      {/* STEP 1: INTAKE FORM                                   */}
      {/* ══════════════════════════════════════════════════════ */}
      {step === "intake" && (
        <form onSubmit={handleIntakeSubmit} className="space-y-5 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <div>
            <h2 className="text-xl font-semibold text-zinc-900">Launch Your Business</h2>
            <p className="mt-1 text-sm text-zinc-500">
              Describe your idea and our AI team will produce your complete launch package — legal docs, financials, brand, social media, and a 90-day plan.
            </p>
          </div>

          <div>
            <label htmlFor="businessIdea" className="mb-1.5 block text-sm font-medium text-zinc-700">
              What&apos;s your business idea?
            </label>
            <textarea
              id="businessIdea"
              value={intake.businessIdea}
              onChange={(e) => setIntake((p) => ({ ...p, businessIdea: e.target.value }))}
              placeholder="e.g., A personal training business in Austin where I offer 1-on-1 coaching for busy professionals who want to get fit without spending hours at the gym."
              rows={4}
              className="w-full resize-none rounded-xl border border-zinc-300 px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
            <p className="mt-1 text-xs text-zinc-400">The more specific you are, the better your package will be.</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="location" className="mb-1.5 block text-sm font-medium text-zinc-700">Where will this operate?</label>
              <select
                id="location"
                value={intake.location}
                onChange={(e) => setIntake((p) => ({ ...p, location: e.target.value }))}
                className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              >
                <option value="">Select a state</option>
                {US_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="entity" className="mb-1.5 block text-sm font-medium text-zinc-700">Entity type preference</label>
              <select
                id="entity"
                value={intake.entityPreference}
                onChange={(e) => setIntake((p) => ({ ...p, entityPreference: e.target.value }))}
                className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {ENTITIES.map((e) => <option key={e.value} value={e.value}>{e.label}</option>)}
              </select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="budget" className="mb-1.5 block text-sm font-medium text-zinc-700">Starting budget</label>
              <select
                id="budget"
                value={intake.budgetRange}
                onChange={(e) => setIntake((p) => ({ ...p, budgetRange: e.target.value }))}
                className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {BUDGETS.map((b) => <option key={b.value} value={b.value}>{b.label}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="team" className="mb-1.5 block text-sm font-medium text-zinc-700">Team size</label>
              <select
                id="team"
                value={intake.teamSize}
                onChange={(e) => setIntake((p) => ({ ...p, teamSize: e.target.value }))}
                className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {STAGES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
          </div>

          {/* File Upload */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-700">
              Upload documents <span className="font-normal text-zinc-400">(optional)</span>
            </label>
            <div
              className="cursor-pointer rounded-xl border-2 border-dashed border-zinc-200 px-4 py-5 text-center transition-colors hover:border-zinc-300 hover:bg-zinc-50"
              onClick={() => fileInputRef.current?.click()}
            >
              <input ref={fileInputRef} type="file" multiple accept=".pdf,.docx,.txt,.md,.csv" onChange={handleFileChange} className="hidden" />
              <p className="text-sm text-zinc-500">
                <span className="font-medium text-zinc-700">Click to upload</span> — pitch deck, business plan, or research
              </p>
              <p className="mt-1 text-xs text-zinc-400">PDF, DOCX, TXT, CSV</p>
            </div>
            {files.length > 0 && (
              <ul className="mt-2 space-y-1">
                {files.map((f) => (
                  <li key={f.name} className="flex items-center justify-between rounded-lg border border-zinc-200 bg-white px-3 py-2">
                    <span className="text-sm text-zinc-700">{f.name} <span className="text-xs text-zinc-400">({(f.size / 1024).toFixed(0)} KB)</span></span>
                    <button type="button" onClick={() => setFiles((p) => p.filter((x) => x.name !== f.name))} className="text-xs text-zinc-400 hover:text-red-500">✕</button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <button
            type="submit"
            disabled={qaLoading || !intake.businessIdea.trim() || !intake.location}
            className="flex items-center gap-2 rounded-xl bg-zinc-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {qaLoading ? (
              <>
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" strokeLinecap="round"/>
                </svg>
                Preparing your consultant…
              </>
            ) : "Continue →"}
          </button>
        </form>
      )}

      {/* ══════════════════════════════════════════════════════ */}
      {/* STEP 2: STRUCTURED Q&A                               */}
      {/* ══════════════════════════════════════════════════════ */}
      {step === "qa" && (
        <div className="space-y-4">
          {/* Header */}
          <div className="rounded-2xl border border-zinc-200 bg-white px-6 py-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-zinc-900">
                  {planSummary
                    ? "Plan ready!"
                    : qaLoading && qaQuestions.length === 0
                      ? "Reviewing your idea…"
                      : qaRound === 1
                        ? "A few quick questions"
                        : "One more thing…"}
                </h2>
                <p className="mt-0.5 text-sm text-zinc-500">
                  {planSummary
                    ? "Your plan summary is ready. Launch the agents to build the full package."
                    : qaLoading && qaQuestions.length === 0
                      ? "Our AI consultant is reviewing your business idea…"
                      : qaRound === 1
                        ? "Click the options that best describe your situation. Choose D to write your own answer."
                        : "A couple more questions to sharpen your plan."}
                </p>
                {!planSummary && qaSource !== "unknown" && (
                  <p className="mt-1 text-xs text-zinc-400">
                    Question source: {qaSource.toUpperCase()}
                    {qaSourceReason ? ` (${qaSourceReason.replaceAll("_", " ")})` : ""}
                  </p>
                )}
              </div>
              {!planSummary && qaQuestions.length > 0 && (
                <div className="shrink-0 rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600">
                  Round {qaRound} of 2
                </div>
              )}
            </div>
          </div>

          {/* Loading spinner */}
          {qaLoading && qaQuestions.length === 0 && !planSummary && (
            <div className="flex items-center justify-center gap-3 rounded-2xl border border-zinc-200 bg-white py-12 shadow-sm">
              <svg className="h-5 w-5 animate-spin text-zinc-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" strokeLinecap="round"/>
              </svg>
              <span className="text-sm text-zinc-500">
                {qaRound === 1 ? "Reading your idea and preparing questions…" : "Processing your answers…"}
              </span>
            </div>
          )}

          {/* Empty state — questions failed to load */}
          {!qaLoading && qaQuestions.length === 0 && !planSummary && !qaReadyMessage && (
            <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm text-center">
              <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="10" cy="10" r="8"/>
                  <path d="M10 6v5M10 14h.01" strokeLinecap="round"/>
                </svg>
              </div>
              <p className="text-sm font-medium text-zinc-700 mb-1">Couldn&apos;t load questions</p>
              <p className="text-xs text-zinc-400 mb-5">There was a problem reaching the AI. You can retry or skip straight to the agents.</p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={retryQa}
                  className="rounded-xl border border-zinc-200 bg-white px-5 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
                >
                  Retry
                </button>
                <button
                  onClick={() => { setStep("running"); startOrchestration(intake, "", ""); }}
                  className="rounded-xl bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-zinc-700"
                >
                  Skip to agents →
                </button>
              </div>
            </div>
          )}

          {/* Auto-ready message (AI decided it has enough) */}
          {qaReadyMessage && !planSummary && (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4">
              <p className="text-sm text-emerald-800">{qaReadyMessage}</p>
              <p className="mt-1 text-xs text-emerald-600">Building your plan summary…</p>
            </div>
          )}

          {/* Question cards */}
          {qaQuestions.length > 0 && !planSummary && (
            <>
              {qaQuestions.map((q, i) => (
                <QuestionCard
                  key={`${qaRound}-${i}`}
                  index={i}
                  roundIndex={qaRound === 2 ? qaHistory.length : 0}
                  question={q}
                  selected={qaAnswers[i] ?? []}
                  otherValue={qaOtherValues[i] ?? ""}
                  onToggle={(answer) =>
                    setQaAnswers((prev) => {
                      const current = prev[i] ?? [];
                      const next = current.includes(answer)
                        ? current.filter((a) => a !== answer)
                        : [...current, answer];
                      return { ...prev, [i]: next };
                    })
                  }
                  onOtherChange={(val) => {
                    setQaOtherValues((prev) => ({ ...prev, [i]: val }));
                    setQaAnswers((prev) => {
                      const current = prev[i] ?? [];
                      if (!current.includes("__other__")) return { ...prev, [i]: [...current, "__other__"] };
                      return prev;
                    });
                  }}
                />
              ))}

              {/* Submit button */}
              <div className="flex items-center gap-4">
                <button
                  onClick={handleQaSubmit}
                  disabled={!allAnswered || qaLoading}
                  className="flex items-center gap-2 rounded-xl bg-zinc-900 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {qaLoading ? (
                    <>
                      <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" strokeLinecap="round"/>
                      </svg>
                      Processing…
                    </>
                  ) : qaRound === 2 ? (
                    "Build my plan →"
                  ) : (
                    "Continue →"
                  )}
                </button>
                {!allAnswered && (
                  <p className="text-xs text-zinc-400">Answer all questions to continue</p>
                )}
              </div>
            </>
          )}

          {/* Plan ready → launch */}
          {planSummary && (
            <div className="rounded-2xl border border-emerald-200 bg-white p-6 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8l3.5 3.5L13 4.5" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-zinc-900">Plan summary ready</p>
                  <p className="mt-1 text-sm text-zinc-500">
                    Your AI team is ready to build the full package — legal docs, financials, brand identity, social media kit, and your 90-day roadmap.
                  </p>
                  <button
                    onClick={handleGoToBrandSelection}
                    className="mt-4 flex items-center gap-2 rounded-xl bg-zinc-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-zinc-700"
                  >
                    Pick your brand →
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════ */}
      {/* STEP 2b: BRAND SELECTION                             */}
      {/* ══════════════════════════════════════════════════════ */}
      {step === "brand-selection" && (
        <div className="space-y-5">
          {/* Header */}
          <div className="rounded-2xl border border-zinc-200 bg-white px-6 py-6 shadow-sm">
            <h2 className="text-xl font-semibold text-zinc-900">Name your business</h2>
            <p className="mt-1 text-sm text-zinc-500">
              Pick a name, accent color, and font before your agents get to work.
            </p>
          </div>

          {/* Name suggestions */}
          {loadingBrand ? (
            <div className="flex items-center justify-center gap-3 rounded-2xl border border-zinc-200 bg-white py-12 shadow-sm">
              <svg className="h-5 w-5 animate-spin text-zinc-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" strokeLinecap="round"/>
              </svg>
              <span className="text-sm text-zinc-500">Generating name ideas for your business…</span>
            </div>
          ) : (
            <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-zinc-800 mb-3">Pick a business name</h3>
                {brandSuggestions.length > 0 && (
                  <div className="grid gap-2 sm:grid-cols-2 mb-3">
                    {brandSuggestions.map((name) => {
                      const selected = brandName === name;
                      return (
                        <button
                          key={name}
                          type="button"
                          onClick={() => setBrandName(name)}
                          className={`rounded-xl border px-4 py-2.5 text-left text-sm font-medium transition-colors ${
                            selected
                              ? "border-zinc-900 bg-zinc-900 text-white"
                              : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-400"
                          }`}
                        >
                          {name}
                        </button>
                      );
                    })}
                  </div>
                )}
                <input
                  type="text"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  placeholder="Or type a custom name…"
                  className="w-full rounded-xl border border-zinc-200 px-4 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-400 focus:outline-none"
                />
              </div>
              {brandTagline && (
                <div>
                  <h3 className="text-sm font-semibold text-zinc-800 mb-1.5">Tagline</h3>
                  <input
                    type="text"
                    value={brandTagline}
                    onChange={(e) => setBrandTagline(e.target.value)}
                    className="w-full rounded-xl border border-zinc-200 px-4 py-2.5 text-sm text-zinc-600 placeholder:text-zinc-400 focus:border-zinc-400 focus:outline-none"
                  />
                </div>
              )}
            </div>
          )}

          {/* Accent color */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-zinc-800 mb-3">Brand accent color</h3>
            <div className="flex flex-wrap items-center gap-3">
              {["#10b981","#3b82f6","#8b5cf6","#f43f5e","#f59e0b","#06b6d4","#ec4899"].map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setBrandAccentColor(color)}
                  className={`h-8 w-8 rounded-full ring-2 ring-offset-2 transition-transform hover:scale-110 ${
                    brandAccentColor === color ? "ring-zinc-900 scale-110" : "ring-transparent"
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
              <label className="relative cursor-pointer">
                <div
                  className="h-8 w-8 rounded-full ring-2 ring-offset-2 ring-zinc-300 flex items-center justify-center text-xs text-zinc-500 overflow-hidden"
                  style={{ backgroundColor: /^#[0-9a-f]{6}$/i.test(brandAccentColor) ? brandAccentColor : undefined }}
                >
                  <span className="text-white text-[10px] font-bold select-none">+</span>
                </div>
                <input
                  type="color"
                  value={brandAccentColor}
                  onChange={(e) => setBrandAccentColor(e.target.value)}
                  className="absolute inset-0 opacity-0 cursor-pointer h-full w-full"
                />
              </label>
              <span className="text-xs text-zinc-400 font-mono">{brandAccentColor}</span>
            </div>
          </div>

          {/* Font family */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-zinc-800 mb-3">Font family</h3>
            <select
              value={brandFontFamily}
              onChange={(e) => setBrandFontFamily(e.target.value)}
              className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-700 focus:border-zinc-400 focus:outline-none sm:w-64"
            >
              {["Inter","Poppins","Montserrat","Roboto","Open Sans","Lato","Raleway","Nunito",
                "Playfair Display","Merriweather","Work Sans","DM Sans","Outfit","Space Grotesk",
                "IBM Plex Sans","Manrope","Sora"].map((font) => (
                <option key={font} value={font}>{font}</option>
              ))}
            </select>
          </div>

          {/* Launch button */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setStep("qa")}
              className="text-sm text-zinc-400 hover:text-zinc-700 transition-colors"
            >
              ← Back
            </button>
            <button
              type="button"
              onClick={handleLaunchFromBrandSelection}
              disabled={!brandName.trim() || loadingBrand}
              className="flex items-center gap-2 rounded-xl bg-zinc-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-zinc-700 disabled:opacity-40"
            >
              Launch {brandName.trim() ? `"${brandName}" ` : ""}agents →
            </button>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════ */}
      {/* STEP 3: AGENT EXECUTION                              */}
      {/* ══════════════════════════════════════════════════════ */}
      {step === "running" && (
        <>
          {/* Phase progress */}
          <div className="flex flex-wrap items-center gap-2">
            {phaseLabels.map((label, i) => (
              <div key={label} className="flex items-center gap-2">
                <div className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                  currentPhase > i
                    ? "bg-emerald-100 text-emerald-700"
                    : currentPhase === i
                      ? "bg-blue-100 text-blue-700 ring-1 ring-blue-300"
                      : "bg-zinc-100 text-zinc-400"
                }`}>
                  {label}
                </div>
                {i < phaseLabels.length - 1 && (
                  <div className={`h-px w-4 shrink-0 ${currentPhase > i ? "bg-emerald-300" : "bg-zinc-200"}`} />
                )}
              </div>
            ))}
          </div>

          {/* Agent grid */}
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-medium text-zinc-700">Agents</h3>
              <p className="text-xs text-zinc-400">Click any card to view full output</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {AGENT_IDS.map((id) => (
                <AgentCard
                  key={id}
                  agentId={id}
                  status={outputs[id].status}
                  content={outputs[id].content}
                  expanded={false}
                  onToggle={() => outputs[id].content ? setExpandedAgent(id) : undefined}
                />
              ))}
            </div>
          </div>

          {/* Synthesis progress indicator */}
          {synthesizing && (
            <div className="flex items-center gap-3 rounded-2xl border border-blue-200 bg-blue-50 px-5 py-4">
              <svg className="h-5 w-5 animate-spin text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" strokeLinecap="round"/>
              </svg>
              <div>
                <p className="text-sm font-semibold text-blue-900">Synthesizing your launch plan...</p>
                <p className="text-xs text-blue-600">Building your roadmap from agent outputs</p>
              </div>
            </div>
          )}
        </>
      )}

      {/* ══════════════════════════════════════════════════════ */}
      {/* STEP 4: PACKAGING — "Your business is ready" reveal   */}
      {/* ══════════════════════════════════════════════════════ */}
      {step === "packaging" && presentation && (
        <>
          {/* Transition header */}
          <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white px-6 py-8 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                <path d="M22 4L12 14.01l-3-3" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-zinc-900">Your business is ready</h2>
            <p className="mt-2 text-sm text-zinc-500 max-w-md mx-auto">
              7 AI agents have built your complete launch package. Follow your 90-day roadmap to bring it all to life.
            </p>
          </div>

          <PackagingPanel
            presentation={presentation}
            outputs={outputs}
            onPresentationChange={setPresentation}
            onFinalize={handleFinalize}
            runId={runId}
            saving={saving}
            businessLocation={intake.location}
          />
        </>
      )}

      {/* ══════════════════════════════════════════════════════ */}
      {/* STEP 5: COMPLETE — launch ready                       */}
      {/* ══════════════════════════════════════════════════════ */}
      {step === "complete" && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white px-6 py-10 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                <path d="M22 4L12 14.01l-3-3" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-zinc-900">{presentation?.businessName ?? "Your Business"} is Launch Ready</h2>
            <p className="mt-2 text-sm text-zinc-500 max-w-md mx-auto">
              Your launch package has been saved. Follow the roadmap, check off each step, and build momentum week by week.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {runId ? (
              <>
                <Link
                  href={`/results/${runId}/roadmap`}
                  className="flex items-center gap-3 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm hover:border-zinc-300 transition-colors text-left"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 20V10"/><path d="M18 20V4"/><path d="M6 20v-4"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-zinc-900">View 90-Day Roadmap</p>
                    <p className="text-xs text-zinc-500">Track progress and check off steps</p>
                  </div>
                </Link>

                <Link
                  href={`/results/${runId}`}
                  className="flex items-center gap-3 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm hover:border-zinc-300 transition-colors text-left"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-zinc-900">View Agent Outputs</p>
                    <p className="text-xs text-zinc-500">All 7 agent reports in detail</p>
                  </div>
                </Link>

                <Link
                  href={`/results/${runId}/plan`}
                  className="flex items-center gap-3 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm hover:border-zinc-300 transition-colors text-left"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-zinc-100">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#71717a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 6h16M4 12h16M4 18h10"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-zinc-900">Full 90-Day Plan</p>
                    <p className="text-xs text-zinc-500">Complete readable plan document</p>
                  </div>
                </Link>

                <button
                  type="button"
                  onClick={() => navigator.clipboard.writeText(`${window.location.origin}/results/${runId}`)}
                  className="flex items-center gap-3 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm hover:border-zinc-300 transition-colors text-left"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-zinc-100">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#71717a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-zinc-900">Copy Shareable Link</p>
                    <p className="text-xs text-zinc-500">Share your launch package with others</p>
                  </div>
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setStep("packaging")}
                className="flex items-center gap-3 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm hover:border-zinc-300 transition-colors text-left"
              >
                <div>
                  <p className="text-sm font-semibold text-zinc-900">Back to Roadmap</p>
                </div>
              </button>
            )}
          </div>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={handleStartOver}
              className="text-sm text-zinc-400 hover:text-zinc-700 transition-colors"
            >
              Start a new business analysis
            </button>
          </div>
        </div>
      )}

      {/* ── Agent output modal ── */}
      {expandedAgent && outputs[expandedAgent]?.content && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={() => setExpandedAgent(null)}
        >
          <div
            className="relative flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex shrink-0 items-center justify-between border-b border-zinc-100 px-6 py-4">
              <div>
                <h2 className="text-lg font-semibold text-zinc-900">{AGENT_META[expandedAgent].label}</h2>
                <p className="text-sm text-zinc-500">{AGENT_META[expandedAgent].deliverable}</p>
              </div>
              <button
                onClick={() => setExpandedAgent(null)}
                className="rounded-full p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M12.207 3.793a1 1 0 0 1 0 1.414L9.414 8l2.793 2.793a1 1 0 0 1-1.414 1.414L8 9.414l-2.793 2.793a1 1 0 0 1-1.414-1.414L6.586 8 3.793 5.207a1 1 0 0 1 1.414-1.414L8 6.586l2.793-2.793a1 1 0 0 1 1.414 0z"/>
                </svg>
              </button>
            </div>
            <div className="overflow-y-auto px-6 py-5">
              <MarkdownBody content={getAgentDisplayContent(expandedAgent)} />
            </div>
            <div className="flex shrink-0 items-center justify-between border-t border-zinc-100 px-6 py-3">
              <button
                onClick={() => {
                  const idx = AGENT_IDS.indexOf(expandedAgent);
                  const prev = AGENT_IDS[idx - 1];
                  if (prev && outputs[prev]?.content) setExpandedAgent(prev);
                }}
                disabled={AGENT_IDS.indexOf(expandedAgent) === 0 || !outputs[AGENT_IDS[AGENT_IDS.indexOf(expandedAgent) - 1]]?.content}
                className="text-xs text-zinc-500 hover:text-zinc-900 disabled:opacity-30"
              >
                ← Previous
              </button>
              <span className="text-xs text-zinc-400">{AGENT_IDS.indexOf(expandedAgent) + 1} / {AGENT_IDS.length}</span>
              <button
                onClick={() => {
                  const idx = AGENT_IDS.indexOf(expandedAgent);
                  const next = AGENT_IDS[idx + 1];
                  if (next && outputs[next]?.content) setExpandedAgent(next);
                }}
                disabled={AGENT_IDS.indexOf(expandedAgent) === AGENT_IDS.length - 1 || !outputs[AGENT_IDS[AGENT_IDS.indexOf(expandedAgent) + 1]]?.content}
                className="text-xs text-zinc-500 hover:text-zinc-900 disabled:opacity-30"
              >
                Next →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
