"use client";

import { useState, useCallback, useRef } from "react";
import AgentCard from "./AgentCard";
import OutputPanel from "./OutputPanel";
import type {
  AgentId,
  AgentOutput,
  AgentStatus,
  SSEEvent,
  IntakeData,
  QAMessage,
} from "@/types/agents";
import { AGENT_META } from "@/types/agents";

const AGENT_IDS: AgentId[] = ["planner", "research", "legal", "finance", "brand", "critic"];

type Step = "intake" | "qa" | "running" | "complete";

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

function makeInitialOutputs(): Record<AgentId, AgentOutput> {
  const out: Partial<Record<AgentId, AgentOutput>> = {};
  for (const id of AGENT_IDS) {
    out[id] = { agentId: id, status: "idle", content: "" };
  }
  return out as Record<AgentId, AgentOutput>;
}

// ── US States dropdown ──
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

export default function AgentOrchestrator() {
  // Step tracking
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
  const [qaMessages, setQaMessages] = useState<QAMessage[]>([]);
  const [qaInput, setQaInput] = useState("");
  const [qaLoading, setQaLoading] = useState(false);
  const [planSummary, setPlanSummary] = useState("");

  // Agent execution state
  const [outputs, setOutputs] = useState<Record<AgentId, AgentOutput>>(makeInitialOutputs);
  const [finalOutput, setFinalOutput] = useState<string | null>(null);
  const [runId, setRunId] = useState<string | null>(null);
  const [expandedAgent, setExpandedAgent] = useState<AgentId | null>(null);
  const [currentPhase, setCurrentPhase] = useState(0);
  const abortRef = useRef<AbortController | null>(null);

  const updateAgent = useCallback((agentId: AgentId, update: Partial<AgentOutput>) => {
    setOutputs((prev) => ({
      ...prev,
      [agentId]: { ...prev[agentId], ...update },
    }));
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? []);
    setFiles((prev) => {
      const names = new Set(prev.map((f) => f.name));
      return [...prev, ...selected.filter((f) => !names.has(f.name))];
    });
  };

  // ── Step 1: Submit intake → start Q&A ──
  const handleIntakeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!intake.businessIdea.trim() || !intake.location.trim()) return;

    setQaLoading(true);

    // Parse documents if uploaded
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

    // Ask the Planner Agent for clarifying questions
    try {
      const res = await fetch("/api/qa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ intake: updatedIntake, messages: [] }),
      });
      if (res.ok) {
        const { message } = await res.json();
        setQaMessages([{ role: "assistant", content: message }]);
        setStep("qa");
      }
    } catch {
      // If Q&A fails, skip to direct orchestration
      setStep("running");
      startOrchestration(updatedIntake, "", "");
    } finally {
      setQaLoading(false);
    }
  };

  // ── Step 2: Answer questions → finalize plan ──
  const handleQaAnswer = async () => {
    if (!qaInput.trim() || qaLoading) return;

    const userMessage: QAMessage = { role: "user", content: qaInput.trim() };
    const updatedMessages = [...qaMessages, userMessage];
    setQaMessages(updatedMessages);
    setQaInput("");
    setQaLoading(true);

    try {
      const res = await fetch("/api/qa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ intake, messages: updatedMessages }),
      });
      if (res.ok) {
        const { message, phase, plan } = await res.json();
        setQaMessages((prev) => [...prev, { role: "assistant", content: message }]);
        if (phase === "complete" && plan) {
          setPlanSummary(plan);
        }
      }
    } catch { /* handle gracefully */ }
    finally {
      setQaLoading(false);
    }
  };

  // ── Step 3: Launch agents ──
  const handleLaunchAgents = () => {
    const clarifyingAnswers = qaMessages
      .filter((m) => m.role === "user")
      .map((m) => m.content)
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
                  setExpandedAgent((cur) => cur ?? event.agentId!);
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
                setExpandedAgent(null);
                break;
              case "run_complete":
                setFinalOutput(event.run?.final_output ?? null);
                setRunId(event.run?.id ?? null);
                setStep("complete");
                break;
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
    setQaMessages([]);
    setQaInput("");
    setPlanSummary("");
    setOutputs(makeInitialOutputs());
    setFinalOutput(null);
    setRunId(null);
    setCurrentPhase(0);
    setExpandedAgent(null);
  };

  // ── Phase progress display ──
  const phaseLabels = [
    "Waiting",
    "Planning",
    "Research · Legal · Finance",
    "Brand",
    "Review",
  ];

  return (
    <div className="mx-auto max-w-5xl space-y-8 p-6">

      {/* ── STEP INDICATOR ── */}
      <div className="flex items-center gap-3 text-sm">
        {[
          { key: "intake", label: "1. Tell us about your business" },
          { key: "qa", label: "2. Answer questions" },
          { key: "running", label: "3. Agents working" },
          { key: "complete", label: "4. Your launch package" },
        ].map((s, i, arr) => (
          <div key={s.key} className="flex items-center gap-3">
            <span className={`font-medium ${
              step === s.key ? "text-blue-700" :
              arr.findIndex((x) => x.key === step) > i ? "text-emerald-600" : "text-zinc-400"
            }`}>
              {s.label}
            </span>
            {i < arr.length - 1 && <span className="text-zinc-300">→</span>}
          </div>
        ))}
      </div>

      {/* ══════════════════════════════════════════════════════ */}
      {/* STEP 1: INTAKE FORM                                   */}
      {/* ══════════════════════════════════════════════════════ */}
      {step === "intake" && (
        <form onSubmit={handleIntakeSubmit} className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm space-y-5">
          <div>
            <h2 className="text-xl font-semibold text-zinc-900">Start Your Business Launch</h2>
            <p className="mt-1 text-sm text-zinc-500">
              Tell us about your business idea, and our AI agents will produce a complete launch package — legal docs, financial setup, brand identity, and a step-by-step plan.
            </p>
          </div>

          {/* Business Idea */}
          <div>
            <label htmlFor="businessIdea" className="mb-1.5 block text-sm font-medium text-zinc-700">
              What&apos;s your business idea?
            </label>
            <textarea
              id="businessIdea"
              value={intake.businessIdea}
              onChange={(e) => setIntake((p) => ({ ...p, businessIdea: e.target.value }))}
              placeholder="e.g., A meal prep delivery service for busy professionals in Austin. We'll source from local farms, offer weekly subscription boxes, and deliver within a 30-mile radius."
              rows={4}
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
              required
            />
            <p className="mt-1 text-xs text-zinc-400">The more detail you give, the better your launch package will be.</p>
          </div>

          {/* Location + Entity */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="location" className="mb-1.5 block text-sm font-medium text-zinc-700">
                Where will this operate?
              </label>
              <select
                id="location"
                value={intake.location}
                onChange={(e) => setIntake((p) => ({ ...p, location: e.target.value }))}
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              >
                <option value="">Select a state</option>
                {US_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="entity" className="mb-1.5 block text-sm font-medium text-zinc-700">
                Entity type preference
              </label>
              <select
                id="entity"
                value={intake.entityPreference}
                onChange={(e) => setIntake((p) => ({ ...p, entityPreference: e.target.value }))}
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {ENTITIES.map((e) => <option key={e.value} value={e.value}>{e.label}</option>)}
              </select>
            </div>
          </div>

          {/* Budget + Team */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="budget" className="mb-1.5 block text-sm font-medium text-zinc-700">
                Starting budget
              </label>
              <select
                id="budget"
                value={intake.budgetRange}
                onChange={(e) => setIntake((p) => ({ ...p, budgetRange: e.target.value }))}
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {BUDGETS.map((b) => <option key={b.value} value={b.value}>{b.label}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="team" className="mb-1.5 block text-sm font-medium text-zinc-700">
                Team size
              </label>
              <select
                id="team"
                value={intake.teamSize}
                onChange={(e) => setIntake((p) => ({ ...p, teamSize: e.target.value }))}
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {STAGES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
          </div>

          {/* File Upload */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-700">
              Upload documents <span className="text-zinc-400 font-normal">(optional)</span>
            </label>
            <div
              className="rounded-lg border-2 border-dashed border-zinc-200 bg-zinc-50 px-4 py-5 text-center hover:border-zinc-300 hover:bg-zinc-100 transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.docx,.txt,.md,.csv"
                onChange={handleFileChange}
                className="hidden"
              />
              <p className="text-sm text-zinc-500">
                <span className="font-medium text-zinc-700">Click to upload</span> pitch deck, business plan, financials, or research
              </p>
              <p className="mt-1 text-xs text-zinc-400">PDF, DOCX, TXT, CSV</p>
            </div>
            {files.length > 0 && (
              <ul className="mt-2 space-y-1">
                {files.map((f) => (
                  <li key={f.name} className="flex items-center justify-between rounded-lg border border-zinc-200 bg-white px-3 py-2">
                    <span className="text-sm text-zinc-700">{f.name} <span className="text-xs text-zinc-400">({(f.size / 1024).toFixed(0)} KB)</span></span>
                    <button type="button" onClick={() => setFiles((p) => p.filter((x) => x.name !== f.name))} className="text-zinc-400 hover:text-red-500 text-xs">✕</button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <button
            type="submit"
            disabled={qaLoading || !intake.businessIdea.trim() || !intake.location}
            className="rounded-lg bg-zinc-900 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {qaLoading ? "Preparing your consultant…" : "Continue →"}
          </button>
        </form>
      )}

      {/* ══════════════════════════════════════════════════════ */}
      {/* STEP 2: Q&A WITH PLANNER                              */}
      {/* ══════════════════════════════════════════════════════ */}
      {step === "qa" && (
        <div className="rounded-xl border border-zinc-200 bg-white shadow-sm overflow-hidden">
          <div className="border-b border-zinc-100 px-6 py-4">
            <h2 className="text-lg font-semibold text-zinc-900">A few quick questions</h2>
            <p className="mt-0.5 text-sm text-zinc-500">
              Your AI consultant needs a bit more context to build the best plan.
            </p>
          </div>

          {/* Chat messages */}
          <div className="max-h-[480px] overflow-y-auto p-6 space-y-4">
            {qaMessages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] rounded-xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-zinc-900 text-white"
                    : "bg-zinc-100 text-zinc-800"
                }`}>
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                </div>
              </div>
            ))}
            {qaLoading && (
              <div className="flex justify-start">
                <div className="bg-zinc-100 rounded-xl px-4 py-3 text-sm text-zinc-400 animate-pulse">
                  Thinking…
                </div>
              </div>
            )}
          </div>

          {/* Input area */}
          <div className="border-t border-zinc-100 p-4">
            {planSummary ? (
              <div className="space-y-3">
                <p className="text-sm text-emerald-700 font-medium">
                  ✓ Plan summary ready. Launch your agents to build the full package.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={handleLaunchAgents}
                    className="rounded-lg bg-zinc-900 px-6 py-2.5 text-sm font-medium text-white hover:bg-zinc-700"
                  >
                    Launch Agents →
                  </button>
                  <button
                    onClick={() => { setPlanSummary(""); setQaMessages((prev) => prev.slice(0, -1)); }}
                    className="text-sm text-zinc-500 hover:text-zinc-900"
                  >
                    Ask more questions
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex gap-3">
                <textarea
                  value={qaInput}
                  onChange={(e) => setQaInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleQaAnswer();
                    }
                  }}
                  placeholder="Type your answers here…"
                  rows={3}
                  className="flex-1 rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                  disabled={qaLoading}
                />
                <button
                  onClick={handleQaAnswer}
                  disabled={qaLoading || !qaInput.trim()}
                  className="self-end rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-50"
                >
                  Send
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════ */}
      {/* STEP 3 & 4: AGENT EXECUTION + RESULTS                */}
      {/* ══════════════════════════════════════════════════════ */}
      {(step === "running" || step === "complete") && (
        <>
          {/* Phase Progress */}
          <div className="flex flex-wrap items-center gap-2">
            {phaseLabels.map((label, i) => (
              <div key={label} className="flex items-center gap-2">
                <div
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                    currentPhase > i
                      ? "bg-emerald-100 text-emerald-700"
                      : step === "running" && currentPhase === i
                        ? "bg-blue-100 text-blue-700 ring-1 ring-blue-300"
                        : "bg-zinc-100 text-zinc-400"
                  }`}
                >
                  {label}
                </div>
                {i < phaseLabels.length - 1 && (
                  <div className={`h-px w-5 shrink-0 ${currentPhase > i ? "bg-emerald-300" : "bg-zinc-200"}`} />
                )}
              </div>
            ))}
          </div>

          {/* Agent Cards */}
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-medium text-zinc-700">Agents</h3>
              <p className="text-xs text-zinc-400">Click to expand</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {AGENT_IDS.map((id) => (
                <AgentCard
                  key={id}
                  agentId={id}
                  status={outputs[id].status}
                  content={outputs[id].content}
                  expanded={expandedAgent === id}
                  onToggle={() => setExpandedAgent(expandedAgent === id ? null : id)}
                />
              ))}
            </div>
          </div>

          {/* Output Panel */}
          <OutputPanel finalOutput={finalOutput} isComplete={step === "complete"} />

          {/* Share + New Run */}
          {step === "complete" && runId && (
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-zinc-200 bg-white px-4 py-3">
              <div>
                <p className="text-sm text-zinc-600">
                  Shareable link:{" "}
                  <a href={`/results/${runId}`} className="font-medium text-blue-600 hover:underline">
                    /results/{runId}
                  </a>
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => navigator.clipboard.writeText(`${window.location.origin}/results/${runId}`)}
                  className="text-xs text-zinc-500 hover:text-zinc-900 border border-zinc-200 rounded-md px-3 py-1.5"
                >
                  Copy link
                </button>
                <button
                  type="button"
                  onClick={handleStartOver}
                  className="text-xs text-zinc-500 hover:text-zinc-900 border border-zinc-200 rounded-md px-3 py-1.5"
                >
                  New analysis
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
