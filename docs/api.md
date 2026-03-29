# SoloFirm API Contracts

## Conventions

- JSON unless noted otherwise.
- Validation failures return `400`.
- Server/proxy failures return `5xx`.
- Auth failures return `401` for protected read/export endpoints.
- Local fallback behavior is enabled for run read/export and finalize persistence paths.

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

Status codes:

- `200` success
- `400` invalid intake payload
- `500` route-level failure (with safe fallback question payload where possible)

Implementation: [app/api/qa/route.ts](../app/api/qa/route.ts)

### POST /api/orchestrate

Purpose: Start full multi-agent orchestration.

Request body:

- `businessIdea` (required)
- `location`, `budgetRange`, `entityPreference`, `teamSize` (optional)
- `documents`, `clarifyingAnswers`, `planSummary` (optional)

Response:

- `text/event-stream` with typed `SSEEvent` entries.

Status codes:

- `200` stream established
- `400` invalid request body or missing `businessIdea`

Implementation: [app/api/orchestrate/route.ts](../app/api/orchestrate/route.ts)

### POST /api/finalize

Purpose: Persist finalized presentation edits.

Request body:

- `runId` (required)
- `presentation` (required)

Response:

- `{ ok: true }`

Status codes:

- `200` success
- `400` missing `runId` or `presentation`

Reliability note:

- If Supabase update fails, route attempts local fallback persistence (`data/runs-local.json`).

Implementation: [app/api/finalize/route.ts](../app/api/finalize/route.ts)

### POST /api/parse-documents

Purpose: Parse uploaded files into extracted text.

Accepted file formats:

- `.pdf`
- `.docx`
- `.txt`, `.md`, `.csv`

Response:

- `{ text: string }`

Status codes:

- `200` success
- `400` unsupported/missing file input
- `500` parser failure

Implementation: [app/api/parse-documents/route.ts](../app/api/parse-documents/route.ts)

### POST /api/waitlist

Purpose: Add email to waitlist table.

Request body:

- `email` (required)

Response:

- `{ ok: true }`

Status codes:

- `200` success
- `400` invalid email payload
- `409` duplicate email (when constrained by unique index)

Implementation: [app/api/waitlist/route.ts](../app/api/waitlist/route.ts)

### GET /api/runs/:id

Purpose: Retrieve one persisted run record by ID.

Path params:

- `id` (required)

Response:

- `{ run: { id, domain, task, status, agent_outputs, final_output, presentation, created_at, completed_at } }`

Notes:

- If Supabase is unavailable, endpoint falls back to local run storage (`data/runs-local.json`).

Status codes:

- `200` success
- `400` missing run id
- `401` invalid/missing bearer token when `RUNS_API_KEY` is configured
- `404` run not found in both Supabase and local fallback
- `500` unexpected server error with no fallback hit

Implementation: [app/api/runs/[id]/route.ts](../app/api/runs/[id]/route.ts)

### GET /api/runs/export

Purpose: Export recent run records for advisors/incubators/analytics.

Query params:

- `limit` (optional, default `50`, max `500`)
- `format` (optional: `json` | `csv`, default `json`)

Response:

- JSON mode: `{ exportedAt, count, runs[] }`
- CSV mode: downloadable CSV file

Notes:

- If Supabase export fails, endpoint falls back to local run storage export.

Status codes:

- `200` success (`json` response or `text/csv` download)
- `401` invalid/missing bearer token when `RUNS_API_KEY` is configured
- `500` unexpected export error (rare; fallback path should still return `200` in most cases)

Implementation: [app/api/runs/export/route.ts](../app/api/runs/export/route.ts)

### GET /api/webhooks/run-complete

Purpose: Publish the `run_complete` webhook contract for external integrators.

Response:

- JSON schema for event payload and signing headers.

Status codes:

- `200` success

Implementation: [app/api/webhooks/run-complete/route.ts](../app/api/webhooks/run-complete/route.ts)

## Outbound webhook delivery

SoloFirm emits outbound webhook notifications whenever a run reaches `run_complete`.

Configuration:

- `RUN_COMPLETE_WEBHOOK_URLS`: comma-separated destination URLs.
- `WEBHOOK_SIGNING_SECRET`: optional signing key.

Headers:

- `x-solofirm-event: run_complete`
- `x-solofirm-signature: <hmac_sha256_hex>` (only when signing secret is set)

Payload:

```json
{
	"event": "run_complete",
	"timestamp": "2026-03-29T00:00:00.000Z",
	"data": {
		"id": "uuid",
		"status": "complete",
		"createdAt": "ISO-8601",
		"completedAt": "ISO-8601",
		"businessName": "Acme Studio",
		"roadmapSteps": 14
	}
}
```

Delivery implementation: [lib/webhooks.ts](../lib/webhooks.ts)

Signature verification reference (receiver side):

1. Read raw request body as bytes/string.
2. Compute `HMAC_SHA256(body, WEBHOOK_SIGNING_SECRET)`.
3. Compare hex digest with `x-solofirm-signature`.
4. Verify `x-solofirm-event === run_complete`.

### GET /api/automation/health

Purpose: Verify automation sidecar availability.

Response:

- Healthy: `{ ok: true }`
- Unhealthy: `{ ok: false, reason }`

Status codes:

- `200` sidecar reachable
- `502` sidecar unavailable/unhealthy

Implementation: [app/api/automation/health/route.ts](../app/api/automation/health/route.ts)

### POST /api/automation/sessions

Purpose: Proxy request to sidecar to start an automation session.

Response:

- Mirrors sidecar response/status.

Status codes:

- `2xx` session accepted by sidecar
- `4xx/5xx` bubbled from sidecar proxy path

Implementation: [app/api/automation/sessions/route.ts](../app/api/automation/sessions/route.ts)

### POST /api/accounts/google-business

Purpose: Create or update Google Business profile with OAuth session context.

Status codes:

- `200` success
- `400` invalid payload
- `401` no valid auth session
- `5xx` provider or proxy failure

Implementation: [app/api/accounts/google-business/route.ts](../app/api/accounts/google-business/route.ts)

### POST /api/accounts/youtube

Purpose: Configure YouTube channel details with OAuth session context.

Status codes:

- `200` success
- `400` invalid payload
- `401` no valid auth session
- `5xx` provider or proxy failure

Implementation: [app/api/accounts/youtube/route.ts](../app/api/accounts/youtube/route.ts)

### POST /api/brand/logo

Purpose: Generate and return logo SVG using AI + sanitization.

Status codes:

- `200` success
- `400` invalid prompt/context input
- `5xx` provider or sanitization failure

Implementation: [app/api/brand/logo/route.ts](../app/api/brand/logo/route.ts)

### POST /api/naming

Purpose: Generate business name, suggestions, and optional tagline from intake context.

Request body:

- `businessIdea` (required)
- `location`, `budgetRange` (optional)

Response:

- `{ businessName, nameSuggestions[], tagline }`

Status codes:

- `200` success
- `400` missing `businessIdea` or invalid JSON

Implementation: [app/api/naming/route.ts](../app/api/naming/route.ts)

### POST /api/docs/fill-pdf

Purpose: Fill supported LLC formation PDF forms and return generated PDF bytes.

Request body:

- `businessName` (required)
- `state` (required, must be supported)
- `teamSize` (optional)

Response:

- `application/pdf` binary body with download filename.

Status codes:

- `200` success
- `400` missing fields or unsupported state
- `500` PDF generation failure

Implementation: [app/api/docs/fill-pdf/route.ts](../app/api/docs/fill-pdf/route.ts)

### /api/auth/* (NextAuth)

Purpose: Authentication/session lifecycle endpoints managed by NextAuth handlers.

Implementation: [app/api/auth/[...nextauth]/route.ts](../app/api/auth/[...nextauth]/route.ts)

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
