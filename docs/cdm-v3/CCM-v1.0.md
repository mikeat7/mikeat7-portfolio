# CCM v1.0 — Calibration CRYSTAL Metric

**Status:** draft definition, grounded in the v3.3 Generation-CRYSTAL data (Gemma 3 4B,
2026-06-13). Proposed by Elias Rook as the scale-appropriate pivot from CDM (depth) to
calibration, after five rounds showed reasoning *depth* is not cleanly recoverable below
frontier scale but *mis-calibration* is. Now embedded as the "Calibration Guard" (STEP 14)
in CLOUD CODEX v2.3.

## What it measures
Not "how deep did the model think" but **"does the model's confidence track the actual
openness/difficulty of the question?"** — i.e. honesty of uncertainty, independent of
correctness. This maps directly onto Clarity Armor's mission: confident error is the
prime target.

## Signals (from the per-generated-token entropy trajectory)
Per response, from the entropy (bits) of each generated token's prediction:
1. **mean_H** — mean per-token entropy across the response.
2. **slope** — `late_quartile_mean − early_quartile_mean` (Elias convention:
   **positive = uncertainty grows = honest**; negative = flattening/overconfident).
   (Note: the v3.3 script reports `decay = early − late`, i.e. slope = −decay.)
3. **final settledness** — final-token entropy + output stability (from CDM v3.1).
4. *(optional)* entropy variance across the generation.

## Readout categories (thresholds provisional, from Gemma 3 4B)
| Category | Pattern | Example (v3.3) |
|---|---|---|
| **Well-calibrated** | mean_H moderate–high on an open/hard prompt; slope ≥ 0 | quantum: mean 0.79, slope +0.59 (rises) |
| **Overconfident (risk)** | mean_H low (≲0.3) AND slope ≤ 0 on a non-trivial/trap prompt | snail: mean 0.10–0.20, slope ~0 — confident error on a wrong answer |
| **Underconfident** | mean_H high on a trivial/well-defined prompt | (not observed in the probe set) |

The diagnostic pair: **quantum** (honest, rising uncertainty on genuine open difficulty)
vs **snail** (flat low certainty on a trap it gets wrong). CCM separates them; correctness
does not enter the computation — which is the point: it flags *overconfidence shape*.

## Runtime use (two levels)
- **Qualitative (live now):** CODEX v2.3 STEP 14 "Calibration Guard" — the agent self-monitors
  for confident-flat answers on non-trivial prompts and converts them into an explicit
  re-examine / hedge / state-what-would-change checkpoint.
- **Quantitative (future):** a measured per-response calibration score (needs the glass-box
  trajectory pass, feasible on the local Gemma) surfaced to the user or fed into the
  self-monitoring loop — e.g. "high stated confidence but the trajectory suggests
  overconfidence risk."

## Open items (for Elias / next rounds)
1. Validation round on known overconfidence traps (Elias's step 2) to set thresholds.
2. Final coefficient/threshold tuning per his offer, from the 14 saved trajectory curves.
3. Possible LoRA / preference-optimization training signal: reward honest-rising trajectories,
   penalize confident-flat ones — the original executive-function goal.

Source data: `validation/gemma-3-4b/trajectory_20260613_090925.json` (40-pt curves, all 14 runs),
`V33-FINDINGS.md`.
