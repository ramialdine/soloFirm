# SoloFirm Submission Pack (Rubric → Proof)

This document maps judging dimensions to concrete, repo-local evidence.

## 1) Vision clarity

- Product promise and flow: [README.md](../README.md)
- North-star framing and constraints: [masterPlan.md](../masterPlan.md)

## 2) Technical depth

- Runtime architecture and event model: [docs/architecture.md](architecture.md)
- Typed orchestration/event contracts in code: [types/agents.ts](../types/agents.ts)
- Core orchestrator implementation: [lib/orchestrator.ts](../lib/orchestrator.ts)

## 3) Innovation and differentiation

- Dual engine model (planning + action): [docs/architecture.md](architecture.md)
- End-to-end execution evidence: [docs/evidence/sse-transcript.ndjson](evidence/sse-transcript.ndjson)
- Automation lifecycle evidence: [docs/evidence/automation-events.ndjson](evidence/automation-events.ndjson)

## 4) Feasibility and execution rigor

- Operational runbook and freeze strategy: [docs/operations.md](operations.md)
- Go/No-Go and failure handling: [docs/operations.md](operations.md)

## 5) API ecosystem thinking

- Full app/sidecar contracts: [docs/api.md](api.md)
- Run retrieval/export endpoints: [app/api/runs/[id]/route.ts](../app/api/runs/[id]/route.ts), [app/api/runs/export/route.ts](../app/api/runs/export/route.ts)
- Webhook contract endpoint: [app/api/webhooks/run-complete/route.ts](../app/api/webhooks/run-complete/route.ts)

## 6) Reliability and resilience

- Controlled failure + graceful behavior proof: [docs/evidence/reliability-check.json](evidence/reliability-check.json)
- Persistence fallback implementation: [lib/runsStore.ts](../lib/runsStore.ts)
- Finalize persistence evidence: [docs/evidence/finalize-persistence.json](evidence/finalize-persistence.json)

## 7) Measured impact and performance

- Benchmark summary (3 runs): [docs/benchmark-results.md](benchmark-results.md)
- Raw benchmark source: [docs/benchmark-results.json](benchmark-results.json)
- Run-level completion artifact: [docs/evidence/run-proof.json](evidence/run-proof.json)
- QA specificity artifact: [docs/evidence/qa-specificity.json](evidence/qa-specificity.json)

## 8) Product completeness

- Evidence checklist (all critical boxes): [docs/evidence-pack.md](evidence-pack.md)
- Progress interaction proof: [docs/evidence/progress-update.json](evidence/progress-update.json)
- Run APIs + finalization flow: [docs/api.md](api.md)
- Interactive plan page with task checkboxes + progress bar: [app/results/[id]/plan/plan-client.tsx](../app/results/[id]/plan/plan-client.tsx)
- Pre-run brand selection: [components/AgentOrchestrator.tsx](../components/AgentOrchestrator.tsx)
- Client resilience (sessionStorage fallback): [app/results/[id]/plan/plan-loader.tsx](../app/results/[id]/plan/plan-loader.tsx)

## 9) Documentation score defense

This repo includes all required doc layers, each tied to concrete artifacts:

1. Product + setup + scripts: [README.md](../README.md)
2. Architecture + scale path + reliability: [docs/architecture.md](architecture.md)
3. API contracts and statuses: [docs/api.md](api.md)
4. Operational protocol + evidence regeneration: [docs/operations.md](operations.md)
5. Judge checklist and links: [docs/evidence-pack.md](evidence-pack.md)
6. Rubric mapping (this file): [docs/submission-pack.md](submission-pack.md)

## 10) Reviewer quick path (under 5 minutes)

1. Read [README.md](../README.md)
2. Validate interfaces in [docs/api.md](api.md)
3. Validate runtime/reliability in [docs/architecture.md](architecture.md)
4. Confirm proof artifacts in [docs/evidence-pack.md](evidence-pack.md)
5. Spot-check metrics in [docs/benchmark-results.md](benchmark-results.md)
