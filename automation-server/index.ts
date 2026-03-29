import express from "express";
import cors from "cors";
import { randomUUID } from "crypto";
import type { AutomationStatus, AutomationLogEntry, AutomationParams, PlatformCredentials, AutomationPlatform } from "../types/automation";
import { runSocialSetup } from "./automations/index";
import { runMockSetup } from "./automations/mock";

const TEST_MODE = process.env.TEST_MODE === "true";

const app = express();
const PORT = process.env.AUTOMATION_PORT ? parseInt(process.env.AUTOMATION_PORT) : 3001;
const AUTOMATION_SECRET = process.env.AUTOMATION_SECRET ?? "dev-secret";

app.use(cors());
app.use(express.json());

// ── Auth middleware ───────────────────────────────────────────────────────────
function requireAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
  const auth = req.headers.authorization;
  if (auth !== `Bearer ${AUTOMATION_SECRET}`) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  next();
}

// ── Session registry ──────────────────────────────────────────────────────────
interface Session {
  sessionId: string;
  status: AutomationStatus;
  pendingResolve?: (value: string) => void;
  screenshotInterval?: ReturnType<typeof setInterval>;
  log: AutomationLogEntry[];
  credentials: Partial<Record<AutomationPlatform, PlatformCredentials>>;
  sseClients: express.Response[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  stagehand?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  page?: any; // Active V3 Page for screenshots and navigation
}

const sessions = new Map<string, Session>();

function emitSSE(session: Session, entry: AutomationLogEntry) {
  session.log.push(entry);
  const data = `data: ${JSON.stringify(entry)}\n\n`;
  for (const client of session.sseClients) {
    try { client.write(data); } catch { /* client disconnected */ }
  }
}

function emitLog(session: Session, message: string) {
  emitSSE(session, { type: "log", message, timestamp: new Date().toISOString() });
}

function emitStatus(session: Session, status: AutomationStatus) {
  session.status = status;
  emitSSE(session, { type: "status", status, timestamp: new Date().toISOString() });
}

async function captureScreenshot(session: Session) {
  if (!session.page) return;
  try {
    const buffer = await session.page.screenshot({ type: "jpeg", quality: 60 });
    const dataUrl = `data:image/jpeg;base64,${(buffer as Buffer).toString("base64")}`;
    emitSSE(session, { type: "screenshot", screenshotDataUrl: dataUrl, timestamp: new Date().toISOString() });
  } catch { /* page may be navigating */ }
}

function pause(session: Session, status: "paused_phone" | "paused_sms" | "paused_captcha"): Promise<string> {
  emitStatus(session, status);
  return new Promise((resolve) => {
    session.pendingResolve = resolve;
  });
}

// ── POST /sessions — create a new automation session ─────────────────────────
app.post("/sessions", requireAuth, async (req, res) => {
  const params = req.body as AutomationParams;
  if (!params?.businessName) {
    res.status(400).json({ error: "businessName is required" });
    return;
  }

  const sessionId = randomUUID();
  const session: Session = {
    sessionId,
    status: "idle",
    log: [],
    credentials: {},
    sseClients: [],
  };
  sessions.set(sessionId, session);

  res.json({ sessionId });

  // Run automation in background (don't await)
  runAutomation(session, params).catch((err) => {
    emitLog(session, `Fatal error: ${err?.message ?? String(err)}`);
    emitStatus(session, "error");
    if (session.screenshotInterval) clearInterval(session.screenshotInterval);
  });
});

async function runAutomation(session: Session, params: AutomationParams) {
  emitStatus(session, "running");

  if (TEST_MODE) {
    emitLog(session, "[TEST MODE] Skipping browser — using dummy data");
    const platforms = params.platforms ?? ["gmail", "instagram", "facebook", "twitter", "tiktok", "linkedin", "youtube"];
    try {
      await runMockSetup(
        session,
        platforms,
        params,
        (msg) => emitLog(session, msg),
        (s) => pause(session, s),
        (dataUrl) => emitSSE(session, { type: "screenshot", screenshotDataUrl: dataUrl, timestamp: new Date().toISOString() }),
      );
    } finally {
      emitCredentialsAndFinish(session);
    }
    return;
  }

  // Dynamic import to avoid loading Stagehand at startup
  const { Stagehand } = await import("@browserbasehq/stagehand");
  emitLog(session, "Launching browser…");

  const stagehand = new Stagehand({
    env: "LOCAL",
    verbose: 0,
    localBrowserLaunchOptions: {
      headless: false,
      viewport: { width: 900, height: 700 },
    },
    model: {
      modelName: "gemini-2.5-flash-preview-04-17",
      apiKey: process.env.GEMINI_API_KEY ?? "",
    },
  });

  await stagehand.init();
  session.stagehand = stagehand;

  // Open the first page explicitly — activePage() is undefined until we do this
  const page = await stagehand.context.newPage();
  session.page = page;

  // Start screenshot polling
  session.screenshotInterval = setInterval(() => captureScreenshot(session), 2000);

  try {
    await runSocialSetup(
      session,
      stagehand,
      page,
      params,
      (msg) => emitLog(session, msg),
      (s: "paused_phone" | "paused_sms" | "paused_captcha") => pause(session, s),
    );
    emitCredentialsAndFinish(session);
  } finally {
    if (session.screenshotInterval) clearInterval(session.screenshotInterval);
    await captureScreenshot(session);
    await stagehand.close();
    session.stagehand = undefined;
  }
}

function emitCredentialsAndFinish(session: Session) {
  for (const [platform, creds] of Object.entries(session.credentials) as [AutomationPlatform, PlatformCredentials][]) {
    emitSSE(session, {
      type: "credential",
      platform,
      credentials: { ...creds },
      timestamp: new Date().toISOString(),
    });
  }
  for (const platform of Object.keys(session.credentials) as AutomationPlatform[]) {
    const c = session.credentials[platform];
    if (c) c.password = "[cleared]";
  }
  emitStatus(session, "complete");
}

// ── GET /sessions/:id/events — SSE stream ─────────────────────────────────────
app.get("/sessions/:id/events", requireAuth, (req, res) => {
  const session = sessions.get(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id);
  if (!session) {
    res.status(404).json({ error: "Session not found" });
    return;
  }

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  // Replay existing log to new client
  for (const entry of session.log) {
    res.write(`data: ${JSON.stringify(entry)}\n\n`);
  }

  session.sseClients.push(res);

  req.on("close", () => {
    session.sseClients = session.sseClients.filter((c) => c !== res);
  });
});

// ── POST /sessions/:id/resume — unblock a paused automation ──────────────────
app.post("/sessions/:id/resume", requireAuth, (req, res) => {
  const session = sessions.get(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id);
  if (!session) {
    res.status(404).json({ error: "Session not found" });
    return;
  }
  if (!session.pendingResolve) {
    res.status(409).json({ error: "Session is not paused" });
    return;
  }
  const value: string = req.body.code ?? req.body.phone ?? "";
  session.pendingResolve(value);
  session.pendingResolve = undefined;
  emitStatus(session, "running");
  res.json({ ok: true });
});

// ── DELETE /sessions/:id ──────────────────────────────────────────────────────
app.delete("/sessions/:id", requireAuth, async (req, res) => {
  const session = sessions.get(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id);
  if (!session) {
    res.status(404).json({ error: "Session not found" });
    return;
  }
  if (session.screenshotInterval) clearInterval(session.screenshotInterval);
  if (session.stagehand) {
    try { await session.stagehand.close(); } catch { /* ignore */ }
  }
  sessions.delete(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id);
  res.json({ ok: true });
});

// ── Health check ──────────────────────────────────────────────────────────────
app.get("/health", (_req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`[automation-server] Running on http://localhost:${PORT}`);
});
