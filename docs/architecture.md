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
