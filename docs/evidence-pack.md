# SoloFirm Evidence Pack Checklist

Use this file as the final judge-facing validation list.

## A) Product proof

- [ ] One full run from intake to `run_complete`
- [ ] Unified roadmap/90-day checklist visible and populated
- [ ] At least 12 generated checklist steps
- [ ] Progress updates after checking items
- [ ] Finalized presentation persisted to run

## B) Execution proof

- [ ] Automation health check succeeds
- [ ] Automation session starts from app flow
- [ ] Sidecar event stream visible (`status` + `log`)
- [ ] At least one pause/resume state demonstrated or simulated

## C) Measurement proof

- [ ] 3 benchmark run records captured
- [ ] TLR computed for each run
- [ ] Step specificity rate computed
- [ ] QA specificity sample documented

## D) Reliability proof

- [ ] Controlled failure example (e.g., sidecar down)
- [ ] Graceful fallback behavior shown
- [ ] No user-blocking crash during flow

## E) Documentation proof

- [ ] README reflects real scripts and env vars
- [ ] API docs match implemented endpoints
- [ ] Architecture doc reflects current runtime
- [ ] Operations runbook used in rehearsal

## Submission bundle

Include these files in final review:

1. [masterPlan.md](../masterPlan.md)
2. [README.md](../README.md)
3. [docs/architecture.md](architecture.md)
4. [docs/api.md](api.md)
5. [docs/operations.md](operations.md)
6. Benchmark results file (create before final submission)
