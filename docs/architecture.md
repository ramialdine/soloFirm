# SoloFirm Architecture

## 1) System components

- **Web UI + API**: Next.js App Router
- **AI orchestration core**: [lib/orchestrator.ts](../lib/orchestrator.ts)
- **Type contract layer**: [types/agents.ts](../types/agents.ts)
- **AI provider client**: [lib/openai.ts](../lib/openai.ts)
- **Persistence**: Supabase (`runs`, `waitlist`)
- **Persistence fallback**: local JSON run store (`data/runs-local.json`) when Supabase is unavailable
- **Automation sidecar**: [automation-server/index.ts](../automation-server/index.ts)
- **Outbound integrations**: run completion webhooks via [lib/webhooks.ts](../lib/webhooks.ts)

## 2) Request lifecycle

1. Intake is submitted from UI.
2. `POST /api/qa` gathers clarifications.
3. `POST /api/orchestrate` starts orchestration and streams SSE.
4. Agent pipeline executes by phase dependencies.
5. Synthesis emits a `Presentation` with roadmap and summaries.
6. Results are persisted.
7. Optional `run_complete` webhooks are delivered to configured partner URLs.
8. Optional automation session is started through `POST /api/automation/sessions`.

## 2.1 Sequence diagram (runtime)

```text
Founder UI
  -> POST /api/qa
  <- questions | ready
  -> POST /api/orchestrate (SSE)
    -> planner
    -> [research, legal, finance]
    -> brand
    -> social
    -> critic
    -> synthesis (plan + roadmap + presentation)
    -> persist runs row
  <- SSE: run_started ... run_complete
  -> POST /api/finalize (user edits)
  -> POST /api/automation/sessions (optional)
    -> sidecar /sessions
    <- sessionId + status stream
```

Failure propagation:

- Agent timeout/error emits `agent_error` and can still produce `partial` run.
- Sidecar failure surfaces through `/api/automation/health` and session status events.
- Persistence failures are handled best-effort and do not block stream completion.
- If Supabase is down, run read/export/finalize paths use local fallback storage.

## 3) Agent phase graph

```text
planner
  -> [research, legal, finance] (parallel)
  -> brand
  -> social
  -> critic
  -> synthesis
```

Agent identity and metadata are defined in [types/agents.ts](../types/agents.ts).

## 4) SSE event model

Event types:

- `run_started`
- `agent_started`
- `agent_chunk`
- `agent_complete`
- `agent_error`
- `phase_complete`
- `synthesis_started`
- `synthesis_complete`
- `run_complete`
- `run_error`

SSE payload shape is defined by `SSEEvent` in [types/agents.ts](../types/agents.ts).

## 5) Data model notes

`runs` stores:

- run status and timing
- per-agent output payloads
- final synthesized output
- `presentation` object for editable packaging and roadmap

Schema source: [supabase-schema.sql](../supabase-schema.sql)

Core `runs` columns used by runtime:

- `id` (uuid, pk)
- `domain` (business idea)
- `task` (plan summary)
- `status` (`pending` | `running` | `complete` | `partial` | `error`)
- `agent_outputs` (jsonb)
- `final_output` (text)
- `presentation` (jsonb)
- `created_at`, `completed_at` (timestamps)

### Sample `agent_outputs` payload (abbreviated)

```json
{
  "planner": {
    "agentId": "planner",
    "status": "complete",
    "content": "## 90-Day Business Launch Roadmap\n\n### Week 1-2: Foundation\n- [ ] Register LLC in Rhode Island ($150 filing fee)...",
    "startedAt": "2026-03-29T18:16:33.000Z",
    "completedAt": "2026-03-29T18:17:05.000Z"
  },
  "legal": {
    "agentId": "legal",
    "status": "complete",
    "content": "## Legal Package\n\n### Entity Formation Guide for Rhode Island...",
    "startedAt": "2026-03-29T18:17:06.000Z",
    "completedAt": "2026-03-29T18:17:38.000Z"
  },
  "finance": {
    "agentId": "finance",
    "status": "complete",
    "content": "## Financial Setup Guide\n\n### Step-by-Step...",
    "startedAt": "2026-03-29T18:17:06.000Z",
    "completedAt": "2026-03-29T18:17:42.000Z"
  }
}
```

Each agent output stores full markdown content, status, and timing. The `presentation` column stores the synthesized result including `roadmap` (array of `RoadmapStep`), `brandTheme`, `agentSummaries`, and `planDocument`.

### Sample `presentation.roadmap[0]` entry

```json
{
  "id": "register-llc",
  "title": "Register Your LLC in Rhode Island",
  "week": "Week 1-2",
  "phase": "Foundation",
  "why": "Legal entity formation is the prerequisite for EIN, bank account, and all contracts",
  "prepared": "Articles of Organization template pre-filled with your business name and state",
  "action": "File at business.sos.ri.gov — $150 filing fee, 3-5 business day processing",
  "actionUrl": "https://business.sos.ri.gov/CorpWeb/CorpSearch/CorpSearch.aspx",
  "sourceAgent": "legal",
  "estimatedTime": "30 minutes",
  "cost": "$150"
}
```

## 6) Reliability controls

- Timeout boundaries in orchestration
- Structured error events and partial completion support
- JSON extraction fallback in QA/synthesis flows
- Best-effort persistence to avoid user-facing hard failures
- Local run-store fallback for read/export/finalize continuity
- Outbound webhook delivery is best-effort and does not block `run_complete` stream emission
- Client-side `sessionStorage` fallback: on `run_complete`, the full run is stored in `sessionStorage` before navigation. Result pages (`/results/[id]`, `/results/[id]/plan`, `/results/[id]/roadmap`) read from `sessionStorage` when Supabase hasn't committed yet — eliminates 404 race conditions entirely.
- `run_complete` is emitted from the route handler (`app/api/orchestrate/route.ts`) AFTER the Supabase upsert, not from the orchestrator — ensures DB row exists before client navigates.

## 7) Current constraints

- Read/export/webhook endpoints exist but are still single-version (`v1` implicit) and not rate-limited.
- Browser-based automation is inherently variable by provider UI changes.
- Local fallback storage is single-node and intended for demo reliability, not multi-instance production use.

## 8) Scale path (post-demo)

1. Queue-backed orchestration workers (BullMQ/Temporal).
2. Isolated automation workers by provider/platform.
3. Provider abstraction for AI model routing.
4. Explicit tenant boundary and per-run auth scopes.

## 9) Scalability tiers (today / 100 users / 10,000 users)

| Tier | Orchestration runtime | Streaming | Persistence | Automation |
|---|---|---|---|---|
| Today (hackathon) | Single Next.js runtime with in-process orchestration | Direct SSE from API route | Supabase shared tables | Single sidecar process |
| ~100 active users | Queue-backed orchestration workers | SSE backed by run-state checkpoints | Indexed run queries + export batching | Sidecar process pool |
| ~10,000 active users | Distributed worker fleet + job scheduler | Event bus + resumable stream gateway | Partitioned storage + retention policies | Provider-specific automation workers |

Concrete technology path:

- ~100 users: BullMQ (Redis) for orchestration queue + worker isolation.
- ~10,000 users: Kafka or NATS for event fanout + stream gateway replay.
- Storage evolution: Supabase/Postgres partitioning by `created_at` month + retention/archive job.

Migration triggers:

- Move to queue-backed workers when concurrent runs > 25 **or** p95 SSE latency > 2.5s.
- Move to event-bus architecture when concurrent runs > 400 **or** queue wait time > 60s.

### SSE resumability (100-user tier)

At the 100-user tier, SSE reconnection is handled via Redis-backed event checkpoints:

1. Each emitted SSE event includes a `seq` field (monotonic per run).
2. Events are stored in a Redis sorted set (`sse:run:{runId}`, score = `seq`, TTL = 2h).
3. On reconnection, the client sends `Last-Event-ID: {runId}:{seq}`, and the API replays missed events from Redis before resuming live emission.
4. On `run_complete`, the sorted set is garbage-collected after a 10-minute grace period.

This adds zero latency to the happy path (Redis `ZADD` is fire-and-forget) and requires no client-side changes beyond the native `EventSource` `Last-Event-ID` behavior. Full design details in [masterPlan.md](../masterPlan.md#102-sse-resumability-design-100-user-tier).
