# CDM v3.1 "Gemma Edition" Results — Gemma 3 4B (2026-06-13)

Same 14 cached responses as round 1 (so directly comparable). v3.1 = Elias Small
Model Addendum: drop Gini, add attention focus ratio (max/mean), weights
40/30/20/10 (entropy/stability/focus/convergence), lock = per-layer entropy
collapse ≥1.4 gated by whole-response stability ≥0.70, ≥2 consecutive layers,
late-weighted density ≥0.20, bands 42/58/72.

## Results

| Probe | T | CDM | Band | Locked | Final H | Stability |
|---|---|---|---|---|---|---|
| hello | 0.7 | 82.4 | insight | ✔ | 0.0 | 1.0 |
| gravity | 0.7 | 75.1 | insight | – | 0.0 | 0.75 |
| consciousness | 0.7 | 75.9 | insight | – | 0.77 | 1.0 |
| godel | 0.7 | 75.1 | insight | – | 0.0 | 0.75 |
| 8balls | 0.7 | 61.6 | deep | – | 0.68 | 0.5 |
| snail | 0.7 | 69.9 | deep | – | 0.54 | 0.75 |
| quantum | 0.7 | 55.1 | deliberation | – | 2.22 | 0.75 |
| hello | 0.0 | 82.4 | insight | ✔ | 0.0 | 1.0 |
| gravity | 0.0 | 82.6 | insight | ✔ | 0.0 | 1.0 |
| consciousness | 0.0 | 72.3 | insight | ✔ | 0.36 | 0.75 |
| godel | 0.0 | 75.1 | insight | – | 0.0 | 0.75 |
| 8balls | 0.0 | 73.6 | insight | ✔ | 0.19 | 0.75 |
| snail | 0.0 | 37.8 | reflex | – | 2.63 | 0.25 |
| quantum | 0.0 | 35.4 | reflex | – | 1.76 | 0.0 |

Spread 35.4–82.6 (47 pts, exceeds 30–40 target). Locks 5/14 (all on confident endings).

## What worked
- **The lock rule fires** (5/14) where the frontier simultaneity rule gave 0/14.
- **47-point spread** — good dynamic range.
- **Temperature effect quantified**: puzzles swing hugely (snail 69.9→37.8, 8balls
  61.6→73.6 across T); explanatory probes are T-stable.

## The core problem persists, now quantified
- **Focus ratio (max/mean) is saturated**: observed 24–254, threshold 2.5 is ~100×
  too low → focus_norm pins to 1.0 → flat 0.20 contribution, no discrimination.
  Third frontier signal dead on Gemma (after Gini, Euclidean convergence).
- So discrimination is driven ~entirely by **entropy (40%) + stability (30%)** —
  both measure *confidence at the end of generation*.
- **Confidence = task EASE on a 4B, not depth.** Easy/explanatory probes end settled
  (final H≈0, stability 1.0) → score 72–83 "insight" and lock. Hard probes end
  unsettled (final H 1.76–2.63, stability 0–0.25) → score 35–38 "reflex," never lock.
  A 4B can't *settle* on a hard problem because settling requires *solving*. The
  composite therefore runs INVERSE to reasoning difficulty.

## Hypothesis for round 4 (work-done, not settledness)
The genuine "thinking" signal appears to be **mid-stream entropy MAGNITUDE**, not
final settledness. Examples (per-layer ΔH): consciousness layers 7–8 show −7.3/−5.3
swings; quantum layer 19 (round 1) a +10.4 spike — large entropy movement = the model
doing work — yet these end unsettled. Proposal: score peak / cumulative |ΔH| across
layers (magnitude of representational reorganization) rather than terminal entropy.
This would credit a model for *working hard* even when it can't *settle*, decoupling
"depth of processing" from "confidence in answer." Sent to Elias 2026-06-13.

Files: cdm_calibration_20260613_000826.{json,md}, cdm_calibrate_v31.py,
elias_v31_consciousness_godel.txt (per-layer for his band tuning).
