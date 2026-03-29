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

## Developer onboarding (quick start for partners)

To integrate with SoloFirm as a third-party developer (e.g., incubator dashboard, advisor tool):

1. **Obtain an API key**: request `RUNS_API_KEY` from the SoloFirm admin.
2. **Set the auth header**: include `Authorization: Bearer <your-key>` on all `/api/runs/*` requests.
3. **Make your first call**:
   ```bash
   curl -H "Authorization: Bearer YOUR_KEY" \
     https://your-solofirm-host/api/runs/export?limit=5&format=json
   ```
4. **Parse the response**: each run object includes `presentation.roadmap` (step-level task data), `presentation.businessName`, `agent_outputs` (per-agent markdown), and timing fields for TLR computation.
5. **Set up webhooks** (optional): configure `RUN_COMPLETE_WEBHOOK_URLS` to receive real-time notifications when runs complete. Verify payloads with `x-solofirm-signature` HMAC (see Outbound webhook delivery section below).

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

Example request (round 1):

```json
{
  "intake": {
    "businessIdea": "Mobile dog grooming service",
    "location": "Austin, Texas",
    "budgetRange": "$5,000-$10,000",
    "entityPreference": "LLC",
    "teamSize": "Solo"
  },
  "round": 1
}
```

Example response (round 1):

```json
{
  "questions": [
    {
      "question": "How will you primarily reach dog owners in Austin for your mobile grooming service?",
      "options": ["Instagram and local Facebook groups", "Nextdoor and neighborhood flyers", "Partnerships with local vets and pet stores"]
    },
    {
      "question": "What is your pricing strategy for mobile dog grooming in the Austin market?",
      "options": ["Premium pricing ($80-120 per session)", "Mid-range competitive ($50-80 per session)", "Volume-based with package discounts"]
    }
  ]
}
```

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
- `selectedBusinessName`, `selectedAccentColor`, `selectedFontFamily` (optional, from pre-run brand selection)

Response:

- `text/event-stream` with typed `SSEEvent` entries.

Example request:

```json
{
  "businessIdea": "Mobile dog grooming service",
  "location": "Austin, Texas",
  "budgetRange": "$5,000-$10,000",
  "entityPreference": "LLC",
  "teamSize": "Solo",
  "planSummary": "Launch a premium mobile dog grooming service...",
  "selectedBusinessName": "Paws & Go",
  "selectedAccentColor": "#10b981",
  "selectedFontFamily": "Inter"
}
```

Example SSE stream (abbreviated):

```
data: {"type":"run_started","run":{"id":"abc-123","status":"running"},"timestamp":"2026-03-29T18:16:32.867Z"}

data: {"type":"agent_started","agentId":"planner","timestamp":"2026-03-29T18:16:33.000Z"}

data: {"type":"agent_chunk","agentId":"planner","content":"## 90-Day Business Launch Roadmap...","timestamp":"2026-03-29T18:16:34.000Z"}

data: {"type":"agent_complete","agentId":"planner","timestamp":"2026-03-29T18:17:05.000Z"}

data: {"type":"phase_complete","phase":1,"timestamp":"2026-03-29T18:17:05.100Z"}

data: {"type":"synthesis_complete","presentation":{...},"timestamp":"2026-03-29T18:20:15.000Z"}

data: {"type":"run_complete","run":{"id":"abc-123","status":"complete","presentation":{...}},"timestamp":"2026-03-29T18:20:16.000Z"}
```

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

Example request:

```bash
curl -H "Authorization: Bearer <RUNS_API_KEY>" \
  https://localhost:3000/api/runs/d9b34965-3355-4d0d-aaa4-5e8fa1982371
```

Example response:

```json
{
  "run": {
    "id": "d9b34965-3355-4d0d-aaa4-5e8fa1982371",
    "domain": "Mobile dog grooming service",
    "task": "Launch a premium mobile dog grooming service in Austin...",
    "status": "complete",
    "agent_outputs": { "planner": { "agentId": "planner", "status": "complete", "content": "..." }, "...": "..." },
    "final_output": "## 90-Day Business Launch Roadmap...",
    "presentation": { "businessName": "Paws & Go", "roadmap": [...], "brandTheme": {...} },
    "created_at": "2026-03-29T18:16:32.867Z",
    "completed_at": "2026-03-29T18:20:16.000Z"
  }
}
```

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

Example request:

```bash
curl -H "Authorization: Bearer <RUNS_API_KEY>" \
  "https://localhost:3000/api/runs/export?limit=2&format=json"
```

Example response:

```json
{
  "exportedAt": "2026-03-29T19:00:00.000Z",
  "count": 2,
  "runs": [
    {
      "id": "d9b34965-...",
      "domain": "Mobile dog grooming service",
      "status": "complete",
      "created_at": "2026-03-29T18:16:32.867Z",
      "completed_at": "2026-03-29T18:20:16.000Z",
      "presentation": { "businessName": "Paws & Go", "roadmap": [...] }
    },
    {
      "id": "a1c2e3f4-...",
      "domain": "Online tutoring platform",
      "status": "complete",
      "created_at": "2026-03-29T17:00:00.000Z",
      "completed_at": "2026-03-29T17:05:30.000Z",
      "presentation": { "businessName": "BrightPath", "roadmap": [...] }
    }
  ]
}
```

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

### GET /api/automation/sessions/:id/events

Purpose: Proxy SSE event stream from the sidecar for a running automation session. Streams `status`, `log`, and `screenshot` events as the session progresses.

Response:

- `text/event-stream` — proxied directly from the sidecar event stream.

Status codes:

- `200` stream established
- `404` session not found or sidecar unavailable

Implementation: [app/api/automation/sessions/[id]/events/route.ts](../app/api/automation/sessions/[id]/events/route.ts)

### POST /api/automation/sessions/:id/resume

Purpose: Proxy a resume signal to the sidecar for a paused automation session (e.g., after phone verification or CAPTCHA).

Request body:

- Forwarded as-is to the sidecar (typically `{ input: string }` for the resume value).

Response:

- Mirrors sidecar response/status.

Status codes:

- `2xx` resume accepted
- `4xx/5xx` bubbled from sidecar proxy path

Implementation: [app/api/automation/sessions/[id]/resume/route.ts](../app/api/automation/sessions/[id]/resume/route.ts)

### POST /api/accounts/google-business

Purpose: Create a Google Business Profile location using OAuth session credentials. Requires an existing Google Business account; if none exists, returns a `400` with guidance to create one at business.google.com first.

Request body:

- `businessName` (required)
- `address` (optional: `{ street, city, state, zip }`)
- `phone` (optional)
- `website` (optional)
- `category` (optional, e.g. `"Mobile Car Detailing"`)
- `description` (optional)

Response:

- `{ ok: true, locationName, title, message }` on success.
- `{ error }` on failure.

Status codes:

- `200` success
- `400` missing `businessName` or no Google Business account found
- `401` no valid auth session
- `5xx` provider or proxy failure

Implementation: [app/api/accounts/google-business/route.ts](../app/api/accounts/google-business/route.ts)

### POST /api/accounts/youtube

Purpose: Update YouTube channel branding (title and description) for the authenticated Google account's existing channel. If no channel exists, returns `ok: false` with a link to youtube.com/create_channel — YouTube does not expose a channel-creation API.

Request body:

- `channelName` (required)
- `description` (optional)

Response:

- Existing channel found: `{ ok: true, channelId, url, message, existing: true }`
- No channel found: `{ ok: false, error, createUrl }`

Status codes:

- `200` success (channel updated or channel-not-found guidance returned)
- `400` missing `channelName`
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

Example request:

```json
{
  "businessName": "Paws & Go LLC",
  "state": "Rhode Island",
  "teamSize": "Solo"
}
```

Example response: `200 OK` with `Content-Type: application/pdf` and `Content-Disposition: attachment; filename="Paws-Go-LLC-Articles-of-Organization.pdf"`.

Currently supported states for PDF form filling: **Rhode Island**. Other states return `400` with an explanatory error message. The roadmap provides direct Secretary of State filing links for all 50 states regardless of PDF support.

Implementation: [app/api/docs/fill-pdf/route.ts](../app/api/docs/fill-pdf/route.ts)

### /api/auth/* (NextAuth)

Purpose: Authentication/session lifecycle endpoints managed by NextAuth handlers.

Implementation: [app/api/auth/[...nextauth]/route.ts](../app/api/auth/[...nextauth]/route.ts)

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
