# SoloFirm API Contracts

## Conventions

- JSON unless noted otherwise.
- Validation failures return `400`.
- Server/proxy failures return `5xx`.

## Authentication

- Internal app routes currently rely on server-side access patterns.
- External run-read/export endpoints support optional bearer auth with `RUNS_API_KEY`.
	- If `RUNS_API_KEY` is set, callers must pass `Authorization: Bearer <RUNS_API_KEY>`.
	- If unset, endpoints are open for local/dev usage.

## Versioning and rate limits

- Versioning: current version is implicit `v1` (path-stable for this hackathon).
- Planned: explicit `/api/v1/...` pathing post-hackathon.
- Rate limits: no hard limit yet in code; recommended gateway/app-level throttling for production.

## App API routes

### POST /api/qa

Purpose: Intake clarification and plan finalization helper.

Request body:

- `intake` (required)
- `round` (optional: `1 | 2`)
- `history` (optional)
- `finalize` (optional boolean)

Response:

- Round 1: `{ questions: [{ question, options[] }] }`
- Round 2 ready: `{ ready: true, message }`
- Round 2 follow-up: `{ ready: false, questions: [...] }`
- Finalize: `{ plan: string }`

Implementation: [app/api/qa/route.ts](../app/api/qa/route.ts)

### POST /api/orchestrate

Purpose: Start full multi-agent orchestration.

Request body:

- `businessIdea` (required)
- `location`, `budgetRange`, `entityPreference`, `teamSize` (optional)
- `documents`, `clarifyingAnswers`, `planSummary` (optional)

Response:

- `text/event-stream` with typed `SSEEvent` entries.

Implementation: [app/api/orchestrate/route.ts](../app/api/orchestrate/route.ts)

### POST /api/finalize

Purpose: Persist finalized presentation edits.

Request body:

- `runId` (required)
- `presentation` (required)

Response:

- `{ ok: true }`

Implementation: [app/api/finalize/route.ts](../app/api/finalize/route.ts)

### POST /api/parse-documents

Purpose: Parse uploaded files into extracted text.

Accepted file formats:

- `.pdf`
- `.docx`
- `.txt`, `.md`, `.csv`

Response:

- `{ text: string }`

Implementation: [app/api/parse-documents/route.ts](../app/api/parse-documents/route.ts)

### POST /api/waitlist

Purpose: Add email to waitlist table.

Request body:

- `email` (required)

Response:

- `{ ok: true }`

Implementation: [app/api/waitlist/route.ts](../app/api/waitlist/route.ts)

### GET /api/runs/:id

Purpose: Retrieve one persisted run record by ID.

Path params:

- `id` (required)

Response:

- `{ run: { id, domain, task, status, agent_outputs, final_output, presentation, created_at, completed_at } }`

Implementation: [app/api/runs/[id]/route.ts](../app/api/runs/[id]/route.ts)

### GET /api/runs/export

Purpose: Export recent run records for advisors/incubators/analytics.

Query params:

- `limit` (optional, default `50`, max `500`)
- `format` (optional: `json` | `csv`, default `json`)

Response:

- JSON mode: `{ exportedAt, count, runs[] }`
- CSV mode: downloadable CSV file

Implementation: [app/api/runs/export/route.ts](../app/api/runs/export/route.ts)

### GET /api/automation/health

Purpose: Verify automation sidecar availability.

Response:

- Healthy: `{ ok: true }`
- Unhealthy: `{ ok: false, reason }`

Implementation: [app/api/automation/health/route.ts](../app/api/automation/health/route.ts)

### POST /api/automation/sessions

Purpose: Proxy request to sidecar to start an automation session.

Response:

- Mirrors sidecar response/status.

Implementation: [app/api/automation/sessions/route.ts](../app/api/automation/sessions/route.ts)

### POST /api/accounts/google-business

Purpose: Create or update Google Business profile with OAuth session context.

Implementation: [app/api/accounts/google-business/route.ts](../app/api/accounts/google-business/route.ts)

### POST /api/accounts/youtube

Purpose: Configure YouTube channel details with OAuth session context.

Implementation: [app/api/accounts/youtube/route.ts](../app/api/accounts/youtube/route.ts)

### POST /api/brand/logo

Purpose: Generate and return logo SVG using AI + sanitization.

Implementation: [app/api/brand/logo/route.ts](../app/api/brand/logo/route.ts)

## Automation sidecar API

Base: `AUTOMATION_SERVER_URL` (default `http://localhost:3001`)

Auth: `Authorization: Bearer ${AUTOMATION_SECRET}`

### POST /sessions

Creates a sidecar automation session.

### GET /sessions/:id/events

SSE event stream for session status/log/screenshot updates.

### POST /sessions/:id/resume

Resumes paused session (phone/SMS/CAPTCHA).

### DELETE /sessions/:id

Terminates and cleans up session.

### GET /health

Sidecar health check.

Implementation: [automation-server/index.ts](../automation-server/index.ts)

## API consumer story (incubator workflow)

Example: an incubator tracks founder progress weekly.

1. Incubator backend stores `RUNS_API_KEY` and calls `GET /api/runs/export?limit=100&format=json`.
2. It ingests `status`, `created_at`, `completed_at`, and `presentation` to compute completion and TLR stats.
3. Program managers open specific run details using `GET /api/runs/:id`.
4. The incubator dashboard maps each run to cohort milestones (plan-ready, roadmap-ready, automation-started).

This gives external stakeholders structured, machine-readable access without coupling to UI internals.
