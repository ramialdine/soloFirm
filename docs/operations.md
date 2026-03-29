# SoloFirm Operations Runbook

## 1) Local setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env.local` from [.env.example](../.env.example).

3. Start full stack:

```bash
npm run dev:full
```

## 2) Run modes

- Web only: `npm run dev`
- Full stack: `npm run dev:full`
- Test stack: `npm run dev:test`

## 3) Common checks

### Verify web server

- Open the local URL printed by Next.js.

### Verify automation sidecar

- Call `GET /api/automation/health`.

### Verify SSE orchestration

- Start a run and confirm events progress through `agent_started`, `agent_complete`, `run_complete`.

## 4) Failure handling

### Port conflicts

```bash
lsof -tiTCP -sTCP:LISTEN | xargs kill -15
```

### Automation sidecar unavailable

- Ensure sidecar process is running.
- Confirm `AUTOMATION_SERVER_URL` matches sidecar port.
- Confirm `AUTOMATION_SECRET` matches both app and sidecar.

### Generic QA questions

- Check for `AI_TEST_MODE` or `TEST_MODE` flags.
- Review logs in [app/api/qa/route.ts](../app/api/qa/route.ts).

### Broken image state (blue question mark)

- Validate logo payload is non-empty and correctly encoded.
- Fallback to explicit placeholder UI if payload validation fails.

## 5) Demo protocol (single take)

1. Submit intake.
2. Complete Q&A.
3. Observe real-time agent stream.
4. Confirm roadmap appears immediately after completion.
5. Toggle checklist steps and verify progress updates.
6. Trigger one automation session.
7. Show persisted result.

## 6) Go/No-Go checklist before submission

- [ ] No manual dead zone after run completion
- [ ] Roadmap checkboxes are actionable and specific
- [ ] QA round 1 is context-aware
- [ ] No broken image UI
- [ ] Automation health endpoint returns OK
- [ ] README and docs are current

## 7) T-4h scope freeze rule

If behind schedule at T-4h, cut work in this order:

1. Visual polish and non-critical UI refinements.
2. Optional ecosystem enhancements beyond `GET /api/runs/:id` and `GET /api/runs/export`.
3. Nice-to-have automation extensions (keep at least one proven action path).

Do **not** cut:

- End-to-end run stability
- Plan/roadmap generation quality
- Evidence artifact collection
- Demo script rehearsal

## 8) Internal benchmark protocol (same-day)

Run 1 smoke benchmark by T+8h, then complete 2 more by T+20h and record all 3 in [docs/benchmark-results.md](benchmark-results.md):

1. Start timestamp
2. Completion timestamp
3. Generated roadmap step count
4. Whether automation session started
5. Notes on failures/recovery

Use these runs as feasibility/impact proof for judging.

## 9) Evidence regeneration protocol (submission lock)

Run these scripts against the active test stack before final submission:

1. `node scripts/run-benchmarks.mjs`
2. `node scripts/capture-evidence.mjs`
3. `node scripts/capture-qa-evidence.mjs`
4. `node scripts/capture-finalize-evidence.mjs`
5. `node scripts/capture-progress-evidence.mjs`
6. `node scripts/capture-automation-evidence.mjs`

Expected artifact outputs:

- [docs/benchmark-results.json](benchmark-results.json)
- [docs/benchmark-results.md](benchmark-results.md)
- [docs/evidence/sse-transcript.ndjson](evidence/sse-transcript.ndjson)
- [docs/evidence/run-proof.json](evidence/run-proof.json)
- [docs/evidence/qa-specificity.json](evidence/qa-specificity.json)
- [docs/evidence/finalize-persistence.json](evidence/finalize-persistence.json)
- [docs/evidence/progress-update.json](evidence/progress-update.json)
- [docs/evidence/automation-events.ndjson](evidence/automation-events.ndjson)
- [docs/evidence/automation-resume-check.json](evidence/automation-resume-check.json)
- [docs/evidence/reliability-check.json](evidence/reliability-check.json)

## 10) Documentation quality gate (must pass)

Before freeze, confirm all are true:

- README script names exactly match [package.json](../package.json) scripts.
- API docs include every active route used in demo flow.
- Architecture reflects real runtime fallback behavior (Supabase + local store).
- Evidence links in [docs/evidence-pack.md](evidence-pack.md) resolve to existing files.
- Judge mapping in [docs/submission-pack.md](submission-pack.md) matches latest metrics.
