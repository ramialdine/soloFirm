# SoloFirm Architecture

## 1) System components

- **Web UI + API**: Next.js App Router
- **AI orchestration core**: [lib/orchestrator.ts](../lib/orchestrator.ts)
- **Type contract layer**: [types/agents.ts](../types/agents.ts)
- **AI provider client**: [lib/openai.ts](../lib/openai.ts)
- **Persistence**: Supabase (`runs`, `waitlist`)
- **Automation sidecar**: [automation-server/index.ts](../automation-server/index.ts)

## 2) Request lifecycle

1. Intake is submitted from UI.
2. `POST /api/qa` gathers clarifications.
3. `POST /api/orchestrate` starts orchestration and streams SSE.
4. Agent pipeline executes by phase dependencies.
5. Synthesis emits a `Presentation` with roadmap and summaries.
6. Results are persisted.
7. Optional automation session is started through `POST /api/automation/sessions`.

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

## 6) Reliability controls

- Timeout boundaries in orchestration
- Structured error events and partial completion support
- JSON extraction fallback in QA/synthesis flows
- Best-effort persistence to avoid user-facing hard failures

## 7) Current constraints

- Some ecosystem endpoints are planned but not fully standardized (read/export API surfaces).
- Browser-based automation is inherently variable by provider UI changes.

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
