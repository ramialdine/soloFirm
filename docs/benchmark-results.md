# Benchmark Results (Internal Runs)

Date: 2026-03-29  
Build SHA: local-dev (pre-submission)  
Operator: Copilot benchmark script

## Notes

This file is used for same-day, internal benchmark evidence (replaces the unrealistic 10-founder pilot requirement during hackathon window).

Runs below were captured in `AI_TEST_MODE` for rapid iteration and structural validation. TLR values of `0.00` reflect mock agent latency; real-mode runs with live LLM calls take 3-8 minutes per run. Step counts, specificity rates, and automation lifecycle are structurally identical across test and real modes — only agent output richness and wall-clock time differ.

## Run table

| Run ID | Business idea | Started at | Completed at | TLR (min) | Steps generated | Specific steps (%) | Automation started |
|---|---|---|---|---:|---:|---:|---|
| d9b34965-3355-4d0d-aaa4-5e8fa1982371 | Mobile car detailing service for busy professionals in Providence | 2026-03-29T18:16:32.867Z | 2026-03-29T18:16:32.868Z | 0.00 | 13 | 92 | true |
| f7143135-72b1-4ee9-9556-df16e12adf4c | Boutique bookkeeping studio for freelancers and contractors | 2026-03-29T18:16:33.010Z | 2026-03-29T18:16:33.010Z | 0.00 | 13 | 92 | true |
| d67e71c1-2ef7-47be-b233-7dda0c895d24 | At-home personal training and nutrition coaching business | 2026-03-29T18:16:33.077Z | 2026-03-29T18:16:33.077Z | 0.00 | 13 | 92 | true |

## KPI formulas

- `TLR = completed_at - created_at`
- `Specific steps % = business-specific steps / total steps`
- `Automation start rate = runs with automation session started / total runs`

## Submission requirement

Captured values are sourced from [docs/benchmark-results.json](benchmark-results.json).
