# SoloFirm Evidence Pack Checklist

Use this file as the final judge-facing validation list.

## A) Product proof

- [x] One full run from intake to `run_complete`
- [x] Unified roadmap/90-day checklist visible and populated
- [x] At least 12 generated checklist steps
- [x] Progress updates after checking items (roadmap + plan page checkboxes)
- [x] Finalized presentation persisted to run
- [x] Interactive plan page with task checkboxes, progress bar, and localStorage persistence
- [x] Pre-run brand selection (name, accent color, font) before agents execute
- [x] Client-side sessionStorage fallback prevents 404 on all result pages

## B) Execution proof

- [x] Automation health check succeeds
- [x] Automation session starts from app flow
- [x] Sidecar event stream visible (`status` + `log`)
- [x] At least one pause/resume state demonstrated or simulated

## C) Measurement proof

- [x] 3 benchmark run records captured
- [x] TLR computed for each run
- [x] Step specificity rate computed
- [x] QA specificity sample documented
- [x] [Benchmark results sheet](benchmark-results.md) is populated (no `pending` values)

## D) Reliability proof

- [x] Controlled failure example (e.g., sidecar down)
- [x] Graceful fallback behavior shown
- [x] No user-blocking crash during flow

## E) Documentation proof

- [x] README reflects real scripts and env vars
- [x] API docs match implemented endpoints
- [x] Architecture doc reflects current runtime
- [x] Operations runbook used in rehearsal
- [x] Judge-facing rubric-to-proof mapping exists

### Documentation scoring evidence (direct links)

- README parity anchor: [README.md](../README.md)
- API contract parity: [docs/api.md](api.md)
- Runtime and reliability architecture: [docs/architecture.md](architecture.md)
- Reproducible ops and evidence protocol: [docs/operations.md](operations.md)
- Rubric mapping packet: [docs/submission-pack.md](submission-pack.md)

## Linked artifacts

- Full run + event stream: [docs/evidence/sse-transcript.ndjson](evidence/sse-transcript.ndjson)
- Run completion + roadmap step count: [docs/evidence/run-proof.json](evidence/run-proof.json)
- Finalize persistence proof: [docs/evidence/finalize-persistence.json](evidence/finalize-persistence.json)
- Progress update proof: [docs/evidence/progress-update.json](evidence/progress-update.json)
- Automation health + controlled failure: [docs/evidence/reliability-check.json](evidence/reliability-check.json)
- Automation status/log + resume simulation: [docs/evidence/automation-events.ndjson](evidence/automation-events.ndjson), [docs/evidence/automation-resume-check.json](evidence/automation-resume-check.json)
- QA specificity sample: [docs/evidence/qa-specificity.json](evidence/qa-specificity.json)
- Benchmark table source: [docs/benchmark-results.json](benchmark-results.json)

## Submission bundle

Include these files in final review:

1. [masterPlan.md](../masterPlan.md)
2. [README.md](../README.md)
3. [docs/architecture.md](architecture.md)
4. [docs/api.md](api.md)
5. [docs/operations.md](operations.md)
6. [docs/submission-pack.md](submission-pack.md)
7. [docs/benchmark-results.md](benchmark-results.md)
