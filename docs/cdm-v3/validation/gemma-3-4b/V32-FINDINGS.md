# CDM v3.2 "Effort + Settlement" Results — Gemma 3 4B (2026-06-13)

Recomputed from the v3.1 per-layer data (no model re-run). Elias's v3.2 decouples
EFFORT (work = |ΔH| magnitude) from SETTLEMENT (final confidence), to credit hard
problems where a 4B thinks hard but can't settle. Script: `reprocess_v32.py`.

## Result: inversion removed, but top-end discrimination collapsed
Spread 59.6–100, **13/14 lock**, almost everything "insight." quantum/snail no longer
bottom out (the inversion is gone) — but now *easy* prompts score just as high, because
the effort term is high for everything.

## Why: effort is dominated by EARLY-layer churn, not reasoning
max |ΔH| per probe, early (layers 0–14) vs late (20–33):

| probe | early max|ΔH| | late max|ΔH| |
|---|---|---|
| hello@T0.7 | 8.10 | 5.74 |
| snail@T0.7 | 11.53 | 3.81 |
| quantum@T0.7 | 7.54 | 5.17 |
| quantum@T0.0 | 8.43 | 1.73 |
| godel@T0.0 | 5.90 | 5.76 |

The largest swings are EARLY for nearly every probe — including trivial `hello`. Early
|ΔH| (read via logit lens) reflects the model first encoding *any* input, not reasoning.
So max|ΔH| over all layers measures universal representational churn → high for all → no
discrimination. Late-only |ΔH| is modest and ALSO doesn't cleanly separate easy/hard
(quantum@T0.0 has the lowest late effort, 1.73 — it flatlined late rather than reasoned).

## Three-round synthesis (the honest picture)
| Metric | Behavior on Gemma 3 4B |
|---|---|
| Terminal settledness (final entropy + stability) | discriminates, but measures task EASE (inverts depth) |
| Total effort (max/cumulative \|ΔH\|) | washes out — early-layer churn is universal |
| Late-layer effort | noisy, no clean easy/hard split |
| Gini, attention focus, Euclidean convergence | saturated / oscillating — dead at this scale |

**Tentative conclusion:** the final-token, per-layer signal set may simply not contain a
clean "reasoning depth" axis at 4B scale. A 4B doesn't exhibit the frontier behavior CDM
was built on (settle into a deep attractor on hard problems) — it shows effort without
settlement, and the effort is dominated by encoding churn.

## Methodological idea for round 4 (for Elias)
We have only analyzed the FINAL token's per-LAYER trajectory. Frontier CDM/CTM was about
the GENERATION trajectory across many TOKENS (CRYSTAL Time = settling over emitted tokens).
The depth signal may live in the TOKEN dimension — how next-token entropy / hidden-state
movement evolves across the generated sequence — not the layer dimension of one token.
That is a larger build (capture per-generated-token states) but is the more faithful CDM
and may be where 4B reasoning is actually visible. Proposed to Elias 2026-06-13.
