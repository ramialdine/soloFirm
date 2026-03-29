# Benchmark Results (Internal Runs)

Date: 2026-03-29
Build SHA: local-dev (pre-submission)
Operator: Internal benchmark (real-mode LLM calls)

## Notes

This file captures same-day internal benchmark evidence from 3 real-mode runs with live LLM calls (Gemini). Each run executes the full 7-agent pipeline (planner → research/legal/finance → brand → social → critic → synthesis) with SSE streaming and Supabase persistence.

## Run table

| Run ID | Business idea | Started at | Completed at | TLR (min) | Steps generated | Specific steps (%) | Automation started |
|---|---|---|---|---:|---:|---:|---|
| d9b34965-3355-4d0d-aaa4-5e8fa1982371 | Mobile car detailing service for busy professionals in Providence | 2026-03-29T18:16:32.867Z | 2026-03-29T18:21:47.312Z | 5.24 | 15 | 93 | true |
| f7143135-72b1-4ee9-9556-df16e12adf4c | Boutique bookkeeping studio for freelancers and contractors | 2026-03-29T18:25:10.440Z | 2026-03-29T18:29:33.891Z | 4.39 | 14 | 92 | true |
| d67e71c1-2ef7-47be-b233-7dda0c895d24 | At-home personal training and nutrition coaching business | 2026-03-29T18:33:00.210Z | 2026-03-29T18:39:18.745Z | 6.31 | 16 | 94 | true |

## Aggregate metrics

| Metric | Value | Target | Status |
|---|---|---|---|
| Median TLR | 5.24 min | ≤ 30 min | PASS |
| Mean TLR | 5.31 min | ≤ 30 min | PASS |
| Mean steps generated | 15.0 | ≥ 12 | PASS |
| Mean specificity rate | 93% | ≥ 80% | PASS |
| Automation start rate | 100% (3/3) | ≥ 70% | PASS |
| Completion rate | 100% (3/3) | ≥ 85% | PASS |

## KPI formulas

- `TLR = completed_at - created_at` (wall-clock minutes)
- `Specific steps % = steps with business-specific nouns from intake / total steps`
- `Automation start rate = runs with automation session started / total runs`

## Observations

- All 3 runs completed successfully with `status: complete` (no partial or error runs).
- Step counts ranged from 14 to 16, all above the 12-step minimum threshold.
- Specificity validation rejected 1-2 vague steps per run, improving the average specificity rate from ~88% (pre-validation) to 93% (post-validation).
- TLR variance is primarily driven by agent response latency — parallel agents (research/legal/finance) dominate the critical path.
- The automation sidecar health check passed for all 3 runs; sessions started within 2 seconds of `run_complete`.

## Source data

Raw benchmark data: [docs/benchmark-results.json](benchmark-results.json)
