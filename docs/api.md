# SoloFirm API Contracts

## Conventions

- JSON unless noted otherwise.
- Validation failures return `400`.
- Server/proxy failures return `5xx`.

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
