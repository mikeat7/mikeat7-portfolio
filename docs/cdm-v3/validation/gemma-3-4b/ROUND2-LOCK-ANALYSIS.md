# CDM Round-2 Lock Analysis — Gemma 3 4B (2026-06-13)

Re-processing of the 14-run calibration (no model re-run; per-layer arrays from
`cdm_calibration_20260612_212333.json`) applying Elias Rook's round-2 Small Model
Addendum thresholds, plus structural diagnostics. Scripts: `relock.py`,
`diagnose_lock.py`, `altlock.py` (in D:\cdm-gemma).

## Elias round-2 thresholds still yield ZERO simultaneous locks
dH≥1.4, r≤0.45, Gini-abs≥0.78, window≥2 → 0/14 locks (was 0/14 at frontier thresholds).
Relaxing thresholds does not help, because the problem is the rule STRUCTURE, not the values.

## Why: the conjunction fails (signal decoupling)
Across 476 layer-observations (14 runs × ~34 layers):

| Condition | Hit rate |
|---|---|
| Gini ≥ 0.78 | **95.0%** (saturated — no discrimination) |
| dH ≥ 1.4 | 16.8% |
| r ≤ 0.45 | 8.2% |
| dH AND r | **1.1%** ← binding constraint |
| dH AND Gini | 16.6% |
| r AND Gini | 7.8% |
| all three (1-layer) | 0.8% |

The frontier CRYSTAL lock assumes entropy-collapse and geometric-convergence
co-occur at the same layer (the attractor "snap"). **On Gemma 3 4B they are
temporally decoupled** — entropy collapses at some layers, convergence at others,
coinciding only 1.1% of the time. dH≥1.4 is late-weighted (early 5 / mid 33 / late 42),
consistent with Elias's "weight late layers" note.

## Alternative lock structures tested (existing data)
- **2-of-3, ≥2 consecutive: 13/14 lock** — too permissive; Gini's 95% saturation makes
  it collapse to "Gini + (dH or r)". Lock layer varies (3–25) without clear meaning.
- **Sequential dH→r within 3 layers: 1/14 lock** — too strict; r≤0.45 too rare to follow.

## Implication (for Elias's structural decision)
Two of the four frontier signals are unreliable on this architecture:
- **Gini**: saturated (95% ≥ 0.78) — sliding-window attention. Replace with attention
  focus ratio (max/mean) per Elias, or drop from the lock.
- **Euclidean convergence r**: oscillates, rarely low (8.2%) — revert to cosine, or drop.

The two robust signals are **entropy (per-layer ΔH + final entropy)** and **output
stability** — both discriminate difficulty cleanly (easy→0 bits/1.0 stable;
quantum/snail→1.76–2.63 bits/0.0–0.25 stable). A small-model lock may need to be
built primarily on these two, with attention-focus replacing Gini.

## Next step (pending)
Full re-run capturing **attention focus ratio (max/mean attention)** as a new per-layer
signal (needs ~9GB free RAM → browser closed). Then Elias refines the lock structure
on signals that actually fire.
