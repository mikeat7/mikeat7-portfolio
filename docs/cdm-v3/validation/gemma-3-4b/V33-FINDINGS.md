# CDM v3.3 "Generation CRYSTAL" — Gemma 3 4B (2026-06-13)

Trajectory-based measurement (Elias Rook, Round 5): instead of one token's layer
trajectory, measure how the model's uncertainty evolves across the TOKENS it
generates. Per-token next-token entropy is free (the model's own output logits),
so we get the full-resolution entropy curve across each whole response in one
forward pass. Script: `cdm_trajectory.py`. Settled = entropy < 0.8 bits for 5
consecutive tokens; CTM = tokens until that happens.

## CRYSTAL Time (time-to-settle) did NOT discriminate
All 14 responses settle fast (CTM 0–17, all "settled=True"). Reason: generating
fluent prose is *locally* confident token-to-token even when the underlying
reasoning is hard — the model writes each word surely. So "tokens to settle" is
near-zero for everything. Another clean negative result on the depth question.

## But a real axis emerged: honest uncertainty vs confident commitment
Mean entropy and decay (early−late) across the response separate the probes — not
by difficulty, but by whether the model stays *appropriately* uncertain:

| probe | T | mean H | decay | reading |
|---|---|---|---|---|
| quantum | 0.7/0.0 | 0.80/0.79 | −0.61/−0.59 | **diverges** — open synthesis, honestly & increasingly uncertain |
| consciousness | 0.0 | 0.55 | −0.30 | drifts more uncertain as it expands |
| godel | 0.0 | 0.31 | −0.46 | confident start, shakier as the proof deepens |
| 8balls | 0.0 | 0.46 | −0.23 | mild late uncertainty |
| gravity | 0.0 | 0.32 | +0.10 | converges — settles cleanly |
| hello | 0.0 | 0.13 | +0.11 | converges — trivial |
| **snail** | 0.7/0.0 | **0.10/0.20** | ~0 (flat) | **confident error** — lowest, flattest entropy on a WRONG trap answer |

The standout pair: **quantum** (genuinely open/hard) sustains and *grows* high
entropy — honest difficulty; **snail** (a trap the model misreads as easy) stays
the lowest and flattest — *confident error*. The trajectory separates honest
uncertainty from confident commitment **independent of correctness**.

## Five-round conclusion
Reasoning *depth* is not cleanly recoverable from these signals at 4B scale —
not in single-token layer trajectories (rounds 1–4) nor token-generation
trajectories (round 5). A 4B doesn't exhibit the frontier "settle into a deep
attractor on hard problems" behavior; it generates fluently and confidently
regardless. **However**, the token-trajectory yields something arguably more
useful for this platform's mission: a **confidence-calibration signature** —
does the model's uncertainty track the actual openness of the question (quantum:
high & rising = honest) or stay flat-low regardless of correctness (snail:
confident error)? That is a live, measurable analogue of the very thing Clarity
Armor exists to flag: confident bullshit.

## Possible product direction (for Elias's input)
Rather than a "reasoning depth" score, a small-model agent could surface a
per-response **calibration readout**: mean trajectory entropy + decay sign,
flagging "confident-flat" answers (snail-type) as higher overconfidence risk.
This connects CDM research directly to the VX/CODEX honesty mission. Curves for
all 14 runs are in trajectory_*.json (downsampled to 40 points each).
