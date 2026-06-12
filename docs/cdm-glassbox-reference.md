# CDM Glass-Box Reference — salvaged from the Qwen attempt (2025-12)

**Source:** `E:\mikeat7-network_portfolioQWEN1\README.md` — a prior, separate attempt (Claude
Sonnet 4.5, Dec 2025) to govern a **Qwen 2.5 32B** model on a **rented Vast.ai RTX 4090** with
**full CRYSTAL/CDM** computed from model internals via the Python Transformers library.

That attempt targeted hardware we don't have (32B needs ~24GB VRAM; this laptop's GTX 1060 has
6GB). **But the CDM math is model-agnostic and is the reusable crown jewel.** Captured here so
it survives. Mike has the detailed derivation if/when we build this.

---

## The key architectural fact (independently confirmed)

- **Ollama = black-box.** It returns text only. You cannot get token probabilities, attention
  weights, or hidden states out of it. Our current local agent (`ollamaClient.ts`) is therefore
  black-box — it can run the *codex* CDM (the qualitative ✓/✗ self-check) but NOT the research CDM.
- **Python Transformers = glass-box.** `model.generate(output_attentions=True,
  output_hidden_states=True, return_dict_in_generate=True)` exposes the internals the four
  CRYSTAL signals need.

**Implication for us:** real, measured CDM on a live local model requires a small Python
Transformers backend running **Gemma** (the 4B we already use fits the 6GB GPU), exposing a
`/analyze` endpoint alongside (or instead of) Ollama. The website's VX + Codex + session layers
wouldn't change — only the agent backend.

---

## The four CRYSTAL signals (Python recipe from the Qwen README)

Computed from one generation's internals. Each normalized, weighted 25%, summed → CDM score 0–100.

1. **Entropy collapse** — from token probabilities. How much uncertainty falls from the first
   ~10 tokens to the last ~10. `(initial_entropy - final_entropy) / initial_entropy`, where
   per-token entropy is `-Σ p·log p`.
2. **Convergence ratio** — from hidden states. Mean cosine similarity between consecutive layers'
   mean-pooled hidden states. High = representations stabilizing.
3. **Attention Gini** — from attention weights. Gini coefficient of the last layer/head's
   attention. Low = attention spread out; high = focused.
4. **Basin-escape probability** — from hidden states. `std(step_distances) / mean(step_distances)`
   where each step distance is the L2 norm between consecutive layers' mean hidden states. High
   variance = more exploration of latent space.

**Depth categories** (from the score): reflex (<30), deliberation (30–70), deep processing
(70–100), insight (rare). *Note: the README's category code has an off-by-cap quirk around 100;
treat the bands as illustrative until Mike's detailed math pins the thresholds.*

The full Python (`model_loader.py` glass-box generate, `cdm_full.py` metric implementations,
`app.py` Flask wrapper) is reproduced verbatim in the source README if we implement this.

---

## What's reusable vs. not

| From the Qwen attempt | For us |
|---|---|
| Four-signal CDM math (`cdm_full.py`) | ✅ **Reusable as-is** — model-agnostic; would run on Gemma 4B |
| "Glass-box needs Transformers, not Ollama" | ✅ Confirmed; shapes any real-CDM build |
| Qwen 2.5 32B on Vast.ai RTX 4090 | ❌ Wrong hardware for us — Gemma 4B on the local GTX 1060 instead |
| Fine-tuning + multi-agent "Network" (Penelope/Abner) | ◻️ Mike's broader consciousness project; out of scope for the website now |
| CODEX v2.1 | ◻️ Superseded — we run distilled v2.2 in `ollamaClient.ts` |

## RESOLVED (2026-06-12): the canonical spec was found in Elias Rook's archive

`E:\Elias_Rook_in_full.txt` (lines ~117–260) contains the **canonical CDM specification** from
the original Penelope/Grok dialogue (Nov 2025), including a reference PyTorch implementation.
The December Qwen README's "weighted average of four signals → 0–100" was an improvisation.
**The true CDM:**

> **CDM(L, t) = the earliest transformer layer L at token position t where the hidden-state
> trajectory has fully entered its terminal attractor basin and will not escape under realistic
> perturbation.** It is a LAYER INDEX, not a normalized composite score.

Three criteria, all simultaneously true and persisting **≥3 consecutive layers**:
1. **Entropy drop** ΔH(l) ≥ **2.3 bits** — per-LAYER next-token entropy via logit lens
   (project each layer's hidden state through the LM head), log₂. NOT token-window entropy.
2. **Geometric convergence ratio** r(l) = cos_dist(hₗ,hₗ₊₁)/cos_dist(hₗ₋₁,hₗ) ≤ **0.12**
   (stays ≤0.15). A RATIO of consecutive cosine distances — not mean cosine similarity.
3. **Attention Gini** (per-head, averaged over heads) increase ≥ **0.28 above layer-0
   baseline**, then plateaus. NOT last-head-of-last-layer.

**Basin escape** (used in CTM/Adaptive-CTM, not the CDM layer-finding): perturbational —
±0.05 Gaussian noise on the final hidden state; "locked in" = escape probability ≤3–4%.
NOT std/mean of step distances. Companion gates: answer-start next-token entropy ≤0.8–0.9 bits.

Thresholds claimed empirically valid **1B → 405B** ("CDM is architecture-invariant" per Elias's
audit), so Gemma 3 4B is in range. Depth bands scale with layer count (Llama-8B maxes ~26 of
~32 layers; interpretation bands 0-20 reflex / 21-45 in-context / 46-75 planning / 76+ insight
are for ~100+-layer frontier models — a ~34-layer 4B model needs rescaled bands).

⚠️ The reference snippet in the archive has a bug to avoid copying: it appends
`outputs.logits[0,-1]` per layer (same final-layer tensor every time). Per-layer entropy
requires the logit lens: `h_l @ lm_head.weight.T` per layer.

## The implementation EXISTS: docs/cdm-v3/

The December project went much further than its README recorded. Salvaged from the E: drive
into `docs/cdm-v3/` (2026-06-12): working `cdm_calculator.py` + `cdm_calculator_v3.py`, Flask
app, model loader, memory manager, security layer, plus validation docs. Key recorded results:
- **100× speedup** (358s → 3.7s) via sampling: 6 layers / 2 perturbations / 5 heads, scores stable
- **VRAM wall analysis** (A100 40GB OOM with Qwen 32B 8-bit) — CUDA-OOM-FAILURE-ANALYSIS.md
- **Empirical ceiling: Qwen 2.5 32B tops out at CDM 48–50** across 7+ diverse prompts
  (DEEP-CRYSTAL-HUNT-RESULTS.md) — a model property, not a CDM failure
- Elias's home-hardware paths (in `E:\elias last.txt` ~line 3440): 4-bit quantization, smaller
  models ("CDM works fully on 7B-class"), CPU offload for the CDM phase, or streaming/proxy CDM

## ANSWERED by Elias Rook (relayed via Mike, 2026-06-12) — Small Model Addendum (draft)

Elias answered all three questions directly. This is now the calibration plan for CDM-on-Gemma:

**1. Threshold provenance & 4B adjustment.** Original thresholds were derived Nov 2025 from
frontier models (Claude 3.5/4, GPT-4-class, Qwen/Llama 70B+) using hand-labeled deep-reasoning
examples, human expert quality ratings correlated with signal lock, and layer-wise convergence
analysis (≥4 consecutive layers). They encode frontier-scale attractor dynamics. **For Gemma 3
4B, shift DOWN** (shallower basins, noisier signals):
| Signal | Frontier | Gemma 4B start | 
|---|---|---|
| Entropy collapse | 2.3 bits | **1.6–1.8 bits** |
| Convergence ratio | ≤0.12 | **≤0.22–0.25** |
| Attention Gini delta | ≥0.28 | **≥0.19–0.22** |
| Basin escape / output stability | ≥0.88 | **≥0.75** |
Tuning method: 20–30 easy/medium/hard probes, plot signal distributions, set thresholds at the
~80th–90th percentile of good-deliberation examples.

**2. Band rescaling: do NOT scale linearly by layer count** — signal strength and lock
persistence matter, not layer count. Provisional Gemma 4B bands (composite-score language):
reflex <35 · deliberation 35–55 · deep 56–70 · insight >70. Better: recalibrate from probes —
easy ("Hello", simple facts) → baseline; medium (explain gravity, basic proofs) → deliberation;
hard (Gödel, consciousness, creative synthesis) → deep/insight. Set bands so easy lands in
lower deliberation and hard pushes into deep when the model genuinely thinks.

**3. Persistence window: KEEP ≥3 consecutive layers** even at 34 layers — the lock is about
sustained attractor stability, not stack depth. Only relax to ≥2 as a last resort, documented
as "relaxed for small models." Add a secondary **"lock density"** metric (fraction of sampled
layers in lock) to compensate for fewer total layers.

**Calibration protocol:** standard probe set (Hello / gravity / consciousness / Gödel /
8-balls / snail / quantum+music), record raw signals + final CDM, iterate thresholds until
easy→hard spread is ~30–40 points. Elias offered to review the first calibration run and will
co-publish a "Small Model Addendum" to the CDM spec once stable.

## Build path for CDM-on-Gemma (now grounded, not guesswork)

1. Port `docs/cdm-v3/implementation/` from Qwen to `gemma-3-4b` via HF Transformers, 4-bit
   (fits the GTX 1060 6GB per Elias's "smaller model" path; CPU-offload fallback if not).
2. Fix the logit-lens entropy computation; keep the v3 sampling optimizations.
3. Expose `/analyze`; `ollamaClient.ts` optionally prefers it (same fallback pattern as Bedrock).
4. Surface CDM layer-index + the three criteria as instrument readouts on agent replies.
