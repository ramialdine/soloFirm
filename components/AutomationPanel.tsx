"use client";

import { useState, useEffect, useRef } from "react";
import type { AutomationStatus, AutomationLogEntry, AutomationPlatform, PlatformCredentials } from "@/types/automation";

interface AutomationPanelProps {
  businessName: string;
}

const PLATFORMS: AutomationPlatform[] = ["gmail", "instagram"];

const PLATFORM_LABELS: Record<AutomationPlatform, string> = {
  gmail: "Gmail",
  instagram: "Instagram",
};

const STATUS_MESSAGES: Partial<Record<AutomationStatus, string>> = {
  idle: "Ready to start",
  running: "Working…",
  paused_phone: "Enter your phone number to continue",
  paused_sms: "Enter the verification code sent to your phone",
  paused_captcha: "Complete the step in the browser window, then click Continue",
  complete: "All accounts created!",
  error: "Something went wrong",
};

export default function AutomationPanel({ businessName }: AutomationPanelProps) {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [status, setStatus] = useState<AutomationStatus>("idle");
  const [latestScreenshot, setLatestScreenshot] = useState<string | null>(null);
  const [log, setLog] = useState<AutomationLogEntry[]>([]);
  const [logOpen, setLogOpen] = useState(false);
  const [credentials, setCredentials] = useState<Partial<Record<AutomationPlatform, PlatformCredentials>>>({});
  const [shownCredentials, setShownCredentials] = useState<Partial<Record<AutomationPlatform, boolean>>>({});
  const [inputValue, setInputValue] = useState("");
  const [completedPlatforms, setCompletedPlatforms] = useState<AutomationPlatform[]>([]);
  const [currentPlatform, setCurrentPlatform] = useState<AutomationPlatform>("gmail");
  const [starting, setStarting] = useState(false);
  const [serverOnline, setServerOnline] = useState<boolean | null>(null); // null = checking
  const inputRef = useRef<HTMLInputElement>(null);

  // Check sidecar health on mount
  useEffect(() => {
    fetch("/api/automation/health")
      .then((r) => setServerOnline(r.ok))
      .catch(() => setServerOnline(false));
  }, []);

  // Focus input when paused
  useEffect(() => {
    if (status === "paused_phone" || status === "paused_sms") {
      inputRef.current?.focus();
    }
  }, [status]);

  // Track current platform from log messages
  useEffect(() => {
    const last = [...log].reverse().find((e) => e.type === "log" && e.message?.toLowerCase().includes("instagram"));
    if (last) setCurrentPlatform("instagram");
  }, [log]);

  // Track completed platforms from credentials
  useEffect(() => {
    setCompletedPlatforms(Object.keys(credentials) as AutomationPlatform[]);
  }, [credentials]);

  async function startSession() {
    setStarting(true);
    try {
      const res = await fetch("/api/automation/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessName, platforms: ["gmail", "instagram"] }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error ?? `Server returned ${res.status}`);
      }
      const { sessionId: sid } = await res.json();
      setSessionId(sid);
      connectSSE(sid);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      const isOffline = msg.includes("fetch failed") || msg.includes("ECONNREFUSED") || msg.includes("502") || msg.includes("503");
      if (isOffline) setServerOnline(false);
      setStatus("error");
      setLog((prev) => [...prev, { type: "error", message: msg, timestamp: new Date().toISOString() }]);
    } finally {
      setStarting(false);
    }
  }

  function connectSSE(sid: string) {
    const es = new EventSource(`/api/automation/sessions/${sid}/events`);
    es.onmessage = (e) => {
      try {
        const entry: AutomationLogEntry = JSON.parse(e.data);
        if (entry.type === "screenshot" && entry.screenshotDataUrl) {
          setLatestScreenshot(entry.screenshotDataUrl);
        } else if (entry.type === "status" && entry.status) {
          setStatus(entry.status);
          if (entry.status === "complete") es.close();
          if (entry.status === "error") es.close();
        } else if (entry.type === "credential" && entry.platform && entry.credentials) {
          setCredentials((prev) => ({ ...prev, [entry.platform!]: entry.credentials! }));
        } else {
          setLog((prev) => [...prev, entry]);
        }
      } catch { /* ignore malformed events */ }
    };
    es.onerror = () => {
      es.close();
      setStatus((s) => s === "complete" ? s : "error");
    };
  }

  async function submitResume() {
    if (!sessionId || !inputValue.trim()) return;
    const value = inputValue.trim();
    setInputValue("");
    setStatus("running");
    await fetch(`/api/automation/sessions/${sessionId}/resume`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(
        status === "paused_phone" ? { phone: value } : { code: value }
      ),
    });
  }

  async function resumeCaptcha() {
    if (!sessionId) return;
    setStatus("running");
    await fetch(`/api/automation/sessions/${sessionId}/resume`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: "continue" }),
    });
  }

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text).catch(() => {});
  }

  const isPaused = status === "paused_phone" || status === "paused_sms" || status === "paused_captcha";

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="rounded-2xl border border-zinc-200 bg-white px-6 py-5 shadow-sm">
        <h2 className="text-lg font-semibold text-zinc-900">Account Setup</h2>
        <p className="mt-0.5 text-sm text-zinc-500">
          A browser will open and create your Gmail and Instagram accounts automatically.
          You&apos;ll only need to verify your phone number.
        </p>
      </div>

      {/* Platform progress */}
      <div className="flex gap-3 rounded-2xl border border-zinc-200 bg-white px-6 py-4 shadow-sm">
        {PLATFORMS.map((p) => {
          const done = completedPlatforms.includes(p);
          const active = !done && p === currentPlatform && status !== "idle" && status !== "complete";
          return (
            <div key={p} className="flex items-center gap-2">
              <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                done ? "bg-emerald-500 text-white" : active ? "bg-blue-500 text-white" : "bg-zinc-100 text-zinc-400"
              }`}>
                {done ? "✓" : PLATFORM_LABELS[p][0]}
              </span>
              <span className={`text-sm font-medium ${done ? "text-emerald-700" : active ? "text-blue-700" : "text-zinc-400"}`}>
                {PLATFORM_LABELS[p]}
              </span>
              {p !== PLATFORMS[PLATFORMS.length - 1] && (
                <span className="ml-1 text-zinc-200">—</span>
              )}
            </div>
          );
        })}
      </div>

      {/* Browser viewport */}
      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-50 shadow-sm">
        <div className="aspect-video w-full relative bg-zinc-100 flex items-center justify-center">
          {latestScreenshot ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={latestScreenshot} alt="Browser preview" className="h-full w-full object-contain" />
          ) : (
            <div className="text-center">
              <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-zinc-200">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="2" y="4" width="16" height="13" rx="2"/>
                  <path d="M2 8h16"/>
                  <circle cx="5" cy="6" r="0.5" fill="currentColor"/>
                  <circle cx="7.5" cy="6" r="0.5" fill="currentColor"/>
                  <circle cx="10" cy="6" r="0.5" fill="currentColor"/>
                </svg>
              </div>
              <p className="text-xs text-zinc-400">Browser window will appear here</p>
            </div>
          )}
          {status === "running" && (
            <div className="absolute top-2 right-2 flex items-center gap-1.5 rounded-full bg-black/60 px-2.5 py-1 text-xs text-white backdrop-blur-sm">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-400" />
              Live
            </div>
          )}
        </div>

        {/* Status strip */}
        <div className={`flex items-center gap-2 px-4 py-3 text-sm ${
          status === "error" ? "bg-red-50 text-red-700" :
          status === "complete" ? "bg-emerald-50 text-emerald-700" :
          isPaused ? "bg-amber-50 text-amber-800" :
          "bg-white text-zinc-600"
        }`}>
          {status === "running" && (
            <svg className="h-3.5 w-3.5 animate-spin shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" strokeLinecap="round"/>
            </svg>
          )}
          <span>{STATUS_MESSAGES[status] ?? status}</span>
        </div>
      </div>

      {/* Server offline warning */}
      {serverOnline === false && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 shadow-sm">
          <p className="text-sm font-semibold text-amber-900 mb-1">Automation server is not running</p>
          <p className="mb-3 text-sm text-amber-700">
            Open a second terminal in your project folder and run:
          </p>
          <pre className="mb-3 overflow-x-auto rounded-lg bg-amber-100 px-4 py-3 text-xs font-mono text-amber-900 whitespace-pre-wrap">
            {`GEMINI_API_KEY=your_key \\\nAUTOMATION_SECRET=dev-secret \\\nnpx ts-node --esm automation-server/index.ts`}
          </pre>
          <button
            onClick={() => {
              setServerOnline(null);
              fetch("/api/automation/health")
                .then((r) => setServerOnline(r.ok))
                .catch(() => setServerOnline(false));
            }}
            className="rounded-xl border border-amber-300 bg-white px-4 py-2 text-sm font-medium text-amber-800 hover:bg-amber-50"
          >
            Check again
          </button>
        </div>
      )}

      {/* Start button */}
      {status === "idle" && serverOnline !== false && (
        <button
          onClick={startSession}
          disabled={starting || serverOnline === null}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-900 py-3 text-sm font-semibold text-white transition-colors hover:bg-zinc-700 disabled:opacity-50"
        >
          {starting || serverOnline === null ? (
            <>
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" strokeLinecap="round"/>
              </svg>
              {serverOnline === null ? "Checking server…" : "Starting…"}
            </>
          ) : "Start Guided Setup →"}
        </button>
      )}

      {/* Pause input — phone or SMS */}
      {(status === "paused_phone" || status === "paused_sms") && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 shadow-sm">
          <p className="mb-3 text-sm font-medium text-amber-900">
            {status === "paused_phone" ? "Enter your phone number" : "Enter the 6-digit code"}
          </p>
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type={status === "paused_phone" ? "tel" : "text"}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") submitResume(); }}
              placeholder={status === "paused_phone" ? "+1 555 000 0000" : "123456"}
              maxLength={status === "paused_sms" ? 8 : undefined}
              className="flex-1 rounded-xl border border-amber-300 bg-white px-4 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
            <button
              onClick={submitResume}
              disabled={!inputValue.trim()}
              className="rounded-xl bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-zinc-700 disabled:opacity-40"
            >
              {status === "paused_phone" ? "Send Code" : "Verify"}
            </button>
          </div>
        </div>
      )}

      {/* Captcha / manual step */}
      {status === "paused_captcha" && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 shadow-sm">
          <p className="mb-3 text-sm font-medium text-amber-900">
            Complete the step in the browser window, then click Continue.
          </p>
          <button
            onClick={resumeCaptcha}
            className="rounded-xl bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-zinc-700"
          >
            Continue →
          </button>
        </div>
      )}

      {/* Credentials — shown on complete */}
      {status === "complete" && Object.keys(credentials).length > 0 && (
        <div className="rounded-2xl border border-emerald-200 bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 text-xs font-bold">✓</span>
            <p className="font-semibold text-zinc-900">Accounts created</p>
          </div>
          <div className="space-y-3">
            {(Object.entries(credentials) as [AutomationPlatform, PlatformCredentials][]).map(([platform, creds]) => (
              <div key={platform} className="rounded-xl border border-zinc-100 bg-zinc-50 p-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-400">{PLATFORM_LABELS[platform]}</p>
                <div className="space-y-1.5 text-sm">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-zinc-500 shrink-0">Email</span>
                    <span className="font-mono text-zinc-800 text-xs truncate">{creds.email}</span>
                    <button onClick={() => copyToClipboard(creds.email)} className="shrink-0 text-xs text-zinc-400 hover:text-zinc-700">[copy]</button>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-zinc-500 shrink-0">Username</span>
                    <span className="font-mono text-zinc-800 text-xs truncate">@{creds.username}</span>
                    <button onClick={() => copyToClipboard(creds.username)} className="shrink-0 text-xs text-zinc-400 hover:text-zinc-700">[copy]</button>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-zinc-500 shrink-0">Password</span>
                    <span className="font-mono text-zinc-800 text-xs truncate">
                      {shownCredentials[platform] ? creds.password : "••••••••••••"}
                    </span>
                    <div className="flex shrink-0 gap-2">
                      <button
                        onClick={() => setShownCredentials((prev) => ({ ...prev, [platform]: !prev[platform] }))}
                        className="text-xs text-zinc-400 hover:text-zinc-700"
                      >
                        {shownCredentials[platform] ? "hide" : "show"}
                      </button>
                      <button onClick={() => copyToClipboard(creds.password)} className="text-xs text-zinc-400 hover:text-zinc-700">[copy]</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-amber-600">
            ⚠ Save these credentials now — they are not stored anywhere.
          </p>
        </div>
      )}

      {/* Error state */}
      {status === "error" && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-center shadow-sm">
          <p className="text-sm font-medium text-red-700 mb-1">Automation encountered an error</p>
          <p className="text-xs text-red-500 mb-4">Check the log below for details.</p>
          <button
            onClick={() => { setStatus("idle"); setSessionId(null); setLatestScreenshot(null); setLog([]); setCredentials({}); setCompletedPlatforms([]); }}
            className="rounded-xl border border-red-200 bg-white px-5 py-2 text-sm font-medium text-red-700 hover:bg-red-50"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Log accordion */}
      {log.length > 0 && (
        <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm overflow-hidden">
          <button
            onClick={() => setLogOpen((o) => !o)}
            className="flex w-full items-center justify-between px-5 py-3 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
          >
            <span>Activity log ({log.filter((e) => e.type === "log" || e.type === "error").length} entries)</span>
            <span className="text-zinc-400">{logOpen ? "▲" : "▼"}</span>
          </button>
          {logOpen && (
            <div className="max-h-48 overflow-y-auto border-t border-zinc-100 px-5 py-3 space-y-1">
              {log.filter((e) => e.type === "log" || e.type === "error").map((entry, i) => (
                <div key={i} className={`flex gap-2 text-xs ${entry.type === "error" ? "text-red-600" : "text-zinc-500"}`}>
                  <span className="shrink-0 text-zinc-300">{new Date(entry.timestamp).toLocaleTimeString()}</span>
                  <span>{entry.message}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
