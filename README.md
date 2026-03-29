# SoloFirm

SoloFirm is an AI launch operating system for first-time founders. It combines:

1. A **Thinking Engine** (multi-agent business planning and synthesis)
2. An **Action Engine** (automation sidecar for setup workflows)

The main user flow:

1. Founder submits intake
2. AI asks clarifying questions
3. Agents run in dependency phases
4. Output is synthesized into a launch package + roadmap
5. User can finalize edits and trigger setup actions

## Quick start

### 1) Install

```bash
npm install
```

### 2) Configure environment

Copy [.env.example](.env.example) to `.env.local` and fill required values.

Minimum required:

- `GEMINI_API_KEY` (or `OPENAI_API_KEY`)
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

Optional but recommended for automation features:

- `AUTOMATION_SERVER_URL`
- `AUTOMATION_SECRET`
- `RUNS_API_KEY` (optional bearer auth for `/api/runs/*` endpoints)
- `RUN_COMPLETE_WEBHOOK_URLS` (optional outbound `run_complete` integrations)
- `WEBHOOK_SIGNING_SECRET` (optional HMAC signing secret for outbound webhooks)
- Google OAuth credentials (`GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `AUTH_SECRET`)

### 3) Run modes

- Web only:

```bash
npm run dev
```

- Full stack (web + automation sidecar):

```bash
npm run dev:full
```

- Test mode (isolated web + mock automation):

```bash
npm run dev:test
```

## Scripts

Defined in [package.json](package.json):

- `dev` → launcher (`node scripts/dev.mjs`)
- `dev:web` → Next.js web server
- `dev:full:web` → full-mode web server on isolated dist/port
- `dev:test:web` → test-mode web server
- `dev:full` → web + automation sidecar
- `dev:test` → test web + test automation sidecar
- `automation` → Express sidecar
- `automation:test` → sidecar in mock mode
- `build`, `start`, `lint`

## Architecture at a glance

- Frontend + API routes: Next.js App Router
- Orchestration core: [lib/orchestrator.ts](lib/orchestrator.ts)
- Agent and payload types: [types/agents.ts](types/agents.ts)
- AI provider adapter: [lib/openai.ts](lib/openai.ts)
- Persistence: Supabase (`runs`, `waitlist`)
- Automation runtime: [automation-server/index.ts](automation-server/index.ts)

Detailed architecture docs: [docs/architecture.md](docs/architecture.md)

## API surface (current)

Primary app routes:

- `POST /api/qa`
- `POST /api/orchestrate` (SSE)
- `POST /api/finalize`
- `POST /api/parse-documents`
- `POST /api/waitlist`
- `GET /api/runs/:id`
- `GET /api/runs/export` (`?format=json|csv&limit=50`)
- `GET /api/webhooks/run-complete`
- `GET /api/automation/health`
- `POST /api/automation/sessions`
- `POST /api/accounts/google-business`
- `POST /api/accounts/youtube`
- `POST /api/brand/logo`

Full endpoint contracts: [docs/api.md](docs/api.md)

## Data model

Schema source: [supabase-schema.sql](supabase-schema.sql)

Main table:

- `runs` stores orchestration state, agent outputs, final output, and presentation payload.

Secondary table:

- `waitlist` stores unique emails.

## Troubleshooting

### "Another next dev server is already running"

Kill port listeners and restart:

```bash
lsof -tiTCP -sTCP:LISTEN | xargs kill -15
```

Then rerun `npm run dev:full`.

### Agents seem mocked instead of real

Check that these are not set to `true` in your shell/env:

- `AI_TEST_MODE`
- `TEST_MODE`

### Automation sidecar not reachable

1. Ensure `npm run automation` is running.
2. Confirm `AUTOMATION_SERVER_URL` matches sidecar port.
3. Check health route: `GET /api/automation/health`.

### Broken logo/image rendering

See image handling and fallbacks in [docs/operations.md](docs/operations.md).

## Documentation index

- Master plan: [masterPlan.md](masterPlan.md)
- Architecture: [docs/architecture.md](docs/architecture.md)
- API contracts: [docs/api.md](docs/api.md)
- Operations runbook: [docs/operations.md](docs/operations.md)
- Evidence checklist: [docs/evidence-pack.md](docs/evidence-pack.md)

## Judging/demo focus

For the fastest evaluation path, use the evidence checklist in [docs/evidence-pack.md](docs/evidence-pack.md) and run the single-take script in [docs/operations.md](docs/operations.md).
