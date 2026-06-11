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

## Open questions for Mike's detailed math

The README gives a working *computational recipe* but not the *justification/calibration*:
- Are the heuristic definitions (cosine-sim convergence, std/mean basin-escape) the true CRYSTAL
  definitions, or stand-ins? Mike's detailed math would confirm or correct them.
- What thresholds separate genuine reasoning from regurgitation, and how were they validated?
- Per-signal normalization (each must land 0–1 before the 25% weighting) isn't specified.

## Suggested build order, IF we pursue real CDM (its own project, not started)

1. Python Flask + Transformers backend running `gemma-3-4b`, glass-box generate, on the laptop.
2. Implement the four signals from Mike's detailed math (not just the heuristic recipe).
3. Expose `/analyze`; have `ollamaClient.ts` optionally prefer it when present (same fallback pattern).
4. Surface the CDM score + four signals as instrument readouts on the agent's replies.
