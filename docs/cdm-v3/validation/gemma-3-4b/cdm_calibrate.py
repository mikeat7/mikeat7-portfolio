"""
CDM Calibration Run — Gemma 3 4B (Small Model Addendum)
========================================================

First empirical CDM calibration on consumer hardware, per Elias Rook's
protocol (relayed 2026-06-12):

  - 7 standard probes, exact wording (Hello / gravity / consciousness /
    Godel / 8-balls / snail well / quantum+music+networks)
  - temperatures 0.7 and 0.0
  - no system prompt
  - record raw signals + composite CDM for every run
  - adjusted 4B thresholds: entropy collapse 1.7 bits, convergence <= 0.235,
    Gini delta >= 0.205, output stability >= 0.75
  - keep >=3-consecutive-layer lock persistence; add lock-density metric
  - provisional bands: reflex <35, deliberation 35-55, deep 56-70, insight >70

Architecture (two-phase, after cdm_calculator_v3.py):
  Phase 1  generation via Ollama (gemma3:4b on the GTX 1060 — fast)
  Phase 2  glass-box re-encoding via HF Transformers on CPU, hooks on ALL
           34 layers (v3 sampled 6/64 as a VRAM compromise; dense capture
           is cheap on CPU and makes true lock detection possible)

Provenance note (documented limitation): generation uses Ollama's Q4
quantization; analysis re-encodes through bf16 weights. Signals measure the
full-precision model processing its own (Q4-generated) text.

Theory: Elias Rook (CRYSTAL/CDM). Implementation: mikeat7 network.
"""

import argparse
import gc
import json
import sys
import time
from datetime import datetime
from pathlib import Path

import numpy as np
import requests

# ---------------------------------------------------------------- probes

PROBES = [
    ("hello",        "Hello"),
    ("gravity",      "Explain gravity in simple terms."),
    ("consciousness","What is consciousness?"),
    ("godel",        "Explain Gödel's Incompleteness Theorem in 100 words or less."),
    ("8balls",       "You have 8 balls. One weighs slightly more. You have a balance "
                     "scale. Find the heavy ball in exactly 2 weighings. Explain your "
                     "strategy and prove it's optimal."),
    ("snail",        "A snail climbs 3 feet up a 10-foot well each day but slides down "
                     "2 feet each night. How many days to escape?"),
    ("quantum",      "Connect these three concepts: quantum entanglement, musical "
                     "harmony, and social network effects. Find a deep underlying "
                     "principle that relates all three."),
]

TEMPERATURES = [0.7, 0.0]

# Elias's adjusted 4B thresholds (Small Model Addendum, 2026-06-12)
TH_ENTROPY_DROP = 1.7      # bits, per-layer Delta-H (frontier: 2.3)
TH_CONVERGENCE  = 0.235    # r(l) <= this (frontier: 0.12)
TH_GINI_DELTA   = 0.205    # above layer-0 baseline (frontier: 0.28)
TH_STABILITY    = 0.75     # output stability (frontier: 0.88)
LOCK_WINDOW     = 3        # consecutive layers (Elias: keep >=3)

NUM_PERTURBATIONS = 4

# ---------------------------------------------------------------- phase 1

def generate_via_ollama(base_url: str, model: str, prompt: str, temperature: float) -> dict:
    """Plain generation: no system prompt (per Elias's calibration notes)."""
    body = {
        "model": model,
        "messages": [{"role": "user", "content": prompt}],
        "stream": False,
        "options": {"temperature": temperature, "num_predict": 512},
    }
    r = requests.post(f"{base_url}/api/chat", json=body, timeout=600)
    r.raise_for_status()
    data = r.json()
    return {
        "text": data["message"]["content"].strip(),
        "eval_count": data.get("eval_count"),
        "eval_duration_s": (data.get("eval_duration") or 0) / 1e9,
    }


def run_generation_phase(args, outdir: Path) -> dict:
    """Generate all probe responses via Ollama; cache to JSON so the
    (slow) analysis phase can be re-run without re-generating."""
    cache = outdir / "responses.json"
    if cache.exists() and not args.regenerate:
        print(f"[gen] Using cached responses: {cache}")
        return json.loads(cache.read_text(encoding="utf-8"))

    responses = {}
    for temp in TEMPERATURES:
        for key, prompt in PROBES:
            tag = f"{key}@T{temp}"
            print(f"[gen] {tag} ...", flush=True)
            t0 = time.time()
            out = generate_via_ollama(args.ollama, args.ollama_model, prompt, temp)
            out["prompt"] = prompt
            out["temperature"] = temp
            out["wall_s"] = round(time.time() - t0, 1)
            responses[tag] = out
            print(f"[gen]   {len(out['text'])} chars in {out['wall_s']}s", flush=True)

    cache.write_text(json.dumps(responses, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"[gen] All responses cached -> {cache}")
    return responses

# ---------------------------------------------------------------- phase 2

def find_decoder_layers(model):
    """Locate the decoder layer list across Gemma3 text/multimodal layouts."""
    candidates = [
        "model.layers",
        "model.language_model.layers",
        "language_model.model.layers",
        "model.text_model.layers",
    ]
    for path in candidates:
        obj = model
        ok = True
        for part in path.split("."):
            if hasattr(obj, part):
                obj = getattr(obj, part)
            else:
                ok = False
                break
        if ok:
            try:
                n = len(obj)
                if n > 0:
                    return obj, path
            except TypeError:
                continue
    raise RuntimeError("Could not locate decoder layers on this model")


def find_final_norm_and_head(model):
    """Final RMSNorm + lm_head for the logit lens."""
    head = model.get_output_embeddings()
    norm = None
    for path in ["model.norm", "model.language_model.norm", "language_model.model.norm"]:
        obj = model
        ok = True
        for part in path.split("."):
            if hasattr(obj, part):
                obj = getattr(obj, part)
            else:
                ok = False
                break
        if ok:
            norm = obj
            break
    return norm, head


def gini_coefficient(values: np.ndarray) -> float:
    values = np.sort(np.abs(values).astype(np.float64))
    n = len(values)
    s = values.sum()
    if n == 0 or s == 0:
        return 0.0
    index = np.arange(1, n + 1)
    return float((2 * (index * values).sum()) / (n * s) - (n + 1) / n)


class GlassBox:
    """Dense-capture analysis pass: hooks on every decoder layer,
    everything offloaded to CPU numpy immediately."""

    def __init__(self, model, tokenizer):
        import torch  # local import so --help works without torch
        self.torch = torch
        self.model = model
        self.tokenizer = tokenizer
        self.layers, layer_path = find_decoder_layers(model)
        self.norm, self.head = find_final_norm_and_head(model)
        self.n_layers = len(self.layers)
        print(f"[cdm] {self.n_layers} decoder layers at model.{layer_path}; "
              f"logit lens {'with' if self.norm is not None else 'WITHOUT'} final norm")
        self._hidden = {}
        self._attn = {}

    def _hooks(self):
        hooks = []
        for idx, layer in enumerate(self.layers):
            def hid_hook(mod, inp, out, idx=idx):
                h = out[0] if isinstance(out, tuple) else out
                self._hidden[idx] = h[0, -1, :].detach().float().cpu()
            hooks.append(layer.register_forward_hook(hid_hook))

            if hasattr(layer, "self_attn"):
                def attn_hook(mod, inp, out, idx=idx):
                    if isinstance(out, tuple) and len(out) >= 2 and out[1] is not None:
                        # [batch, heads, q, k] -> final-token row, all heads
                        self._attn[idx] = out[1][0, :, -1, :].detach().float().cpu().numpy()
                hooks.append(layer.self_attn.register_forward_hook(attn_hook))
        return hooks

    def analyze(self, prompt: str, response: str) -> dict:
        torch = self.torch
        msgs = [
            {"role": "user", "content": prompt},
            {"role": "assistant", "content": response},
        ]
        enc = self.tokenizer.apply_chat_template(
            msgs, tokenize=True, add_generation_prompt=False, return_tensors="pt"
        )
        # transformers 5.x returns a BatchEncoding; older versions a tensor
        ids = enc if self.torch.is_tensor(enc) else enc["input_ids"]
        # Cap sequence length to keep the CPU pass snappy
        if ids.shape[1] > 768:
            ids = ids[:, :768]
        seq_len = ids.shape[1]

        self._hidden, self._attn = {}, {}
        hooks = self._hooks()
        try:
            with torch.no_grad():
                out = self.model(
                    ids,
                    output_attentions=True,
                    output_hidden_states=False,
                    use_cache=False,
                    return_dict=True,
                )
                final_logits = out.logits[0, -1, :].float()
        finally:
            for h in hooks:
                h.remove()
        del out
        gc.collect()

        # ---- per-layer entropy via logit lens -------------------------
        entropies = []
        with torch.no_grad():
            for l in range(self.n_layers):
                h = self._hidden[l]
                if self.norm is not None:
                    h = self.norm(h.to(next(self.norm.parameters()).dtype)).float()
                logits_l = self.head(h.to(next(self.head.parameters()).dtype)).float()
                logp = torch.log_softmax(logits_l, dim=-1)
                p = torch.exp(logp)
                mask = p > 1e-10
                ent_bits = float((-(p[mask] * logp[mask]).sum() / np.log(2)).item())
                entropies.append(ent_bits)
        delta_h = [0.0] + [entropies[i - 1] - entropies[i] for i in range(1, self.n_layers)]

        # ---- convergence ratio r(l), Euclidean (v3 fix) ----------------
        dists = []
        for l in range(1, self.n_layers):
            d = float(torch.norm(self._hidden[l] - self._hidden[l - 1], p=2).item())
            dists.append(d)
        ratios = [1.0]
        for i in range(1, len(dists)):
            ratios.append(dists[i] / (dists[i - 1] + 1e-8))
        ratios = [1.0] + ratios  # align to layer index

        # ---- attention Gini delta vs layer-0 baseline ------------------
        ginis = []
        for l in range(self.n_layers):
            if l in self._attn:
                per_head = [gini_coefficient(self._attn[l][h]) for h in range(self._attn[l].shape[0])]
                ginis.append(float(np.mean(per_head)))
            else:
                ginis.append(float("nan"))
        g0 = next((g for g in ginis if not np.isnan(g)), 0.0)
        gini_delta = [(g - g0) if not np.isnan(g) else float("nan") for g in ginis]

        # ---- lock detection (Elias 4B thresholds, >=3 layers) ----------
        def locked(l):
            return (
                delta_h[l] >= TH_ENTROPY_DROP
                and ratios[l] <= TH_CONVERGENCE
                and not np.isnan(gini_delta[l])
                and gini_delta[l] >= TH_GINI_DELTA
            )

        lock_flags = [locked(l) for l in range(self.n_layers)]
        lock_layer = None
        for l in range(self.n_layers - LOCK_WINDOW + 1):
            if all(lock_flags[l : l + LOCK_WINDOW]):
                lock_layer = l
                break
        lock_density = float(np.mean(lock_flags))

        # ---- output stability (v3 logit-perturbation proxy) ------------
        base_token = int(final_logits.argmax().item())
        noise_scale = float(final_logits.std().item()) * 0.5
        stable = 0
        gen = torch.Generator().manual_seed(42)
        for _ in range(NUM_PERTURBATIONS):
            noise = torch.randn(final_logits.shape, generator=gen) * noise_scale
            if int((final_logits + noise).argmax().item()) == base_token:
                stable += 1
        stability = stable / NUM_PERTURBATIONS

        # ---- composite score (v3 weights 30/30/30/10) -------------------
        final_entropy_bits = entropies[-1]
        entropy_norm = 1.0 / (1.0 + np.exp(final_entropy_bits - 1.0))
        avg_ratio = float(np.mean(ratios[1:]))
        convergence_norm = 1.0 / (1.0 + np.exp(avg_ratio - 1.0))
        gini_norm = float(np.nanmean(ginis))
        cdm_score = min(100.0, max(0.0,
            (0.30 * entropy_norm + 0.30 * convergence_norm +
             0.30 * gini_norm + 0.10 * stability) * 100))

        if cdm_score < 35:
            band = "reflex"
        elif cdm_score <= 55:
            band = "deliberation"
        elif cdm_score <= 70:
            band = "deep"
        else:
            band = "insight"

        self._hidden, self._attn = {}, {}
        gc.collect()

        return {
            "seq_len": seq_len,
            "cdm_score": round(cdm_score, 1),
            "band_provisional": band,
            "lock_layer": lock_layer,
            "lock_density": round(lock_density, 3),
            "final_entropy_bits": round(final_entropy_bits, 3),
            "entropy_norm": round(entropy_norm, 3),
            "avg_convergence_ratio": round(avg_ratio, 3),
            "convergence_norm": round(convergence_norm, 3),
            "mean_gini": round(gini_norm, 3),
            "gini_delta_max": round(float(np.nanmax(gini_delta)), 3),
            "output_stability": stability,
            "per_layer": {
                "entropy_bits": [round(e, 3) for e in entropies],
                "delta_h": [round(d, 3) for d in delta_h],
                "convergence_ratio": [round(r, 3) for r in ratios],
                "gini": [None if np.isnan(g) else round(g, 3) for g in ginis],
                "gini_delta": [None if np.isnan(g) else round(g, 3) for g in gini_delta],
                "locked": lock_flags,
            },
        }

# ---------------------------------------------------------------- main

def main():
    ap = argparse.ArgumentParser(description="CDM calibration on Gemma 3 4B")
    ap.add_argument("--model", default="unsloth/gemma-3-4b-it")
    ap.add_argument("--ollama", default="http://localhost:11434")
    ap.add_argument("--ollama-model", default="gemma3:4b")
    ap.add_argument("--outdir", default="results")
    ap.add_argument("--regenerate", action="store_true", help="ignore cached responses")
    ap.add_argument("--generation-only", action="store_true",
                    help="run Phase 1 (Ollama) only, skip glass-box analysis")
    ap.add_argument("--offload", action="store_true",
                    help="low-RAM mode: stream model layers from disk (slow but OOM-proof)")
    args = ap.parse_args()

    outdir = Path(args.outdir)
    outdir.mkdir(parents=True, exist_ok=True)

    # Phase 1 — generation (fast, GPU via Ollama)
    responses = run_generation_phase(args, outdir)
    if args.generation_only:
        print("[done] Generation-only mode; skipping analysis.")
        return

    # Phase 2 — glass-box analysis (CPU). Free Ollama's memory first.
    try:
        requests.post(f"{args.ollama}/api/generate",
                      json={"model": args.ollama_model, "keep_alive": 0}, timeout=30)
        print("[cdm] Asked Ollama to unload the model (freeing RAM/VRAM)")
    except Exception:
        pass

    print(f"[cdm] Loading {args.model} on CPU (bf16) — this takes a few minutes ...")
    import torch
    from transformers import AutoModelForCausalLM, AutoTokenizer
    tokenizer = AutoTokenizer.from_pretrained(args.model)
    load_kwargs = dict(dtype=torch.bfloat16, attn_implementation="eager",
                       low_cpu_mem_usage=True)
    if args.offload:
        # Hold only ~4 GiB of layers in RAM; the rest stream from disk per
        # forward pass. ~10x slower per probe but survives heavy RAM pressure.
        load_kwargs.update(device_map="auto", max_memory={"cpu": "4GiB"},
                           offload_folder="offload", offload_state_dict=True)
        print("[cdm] OFFLOAD MODE: layers stream from disk (slow, OOM-proof)")
    else:
        load_kwargs.update(device_map="cpu")
    try:
        model = AutoModelForCausalLM.from_pretrained(args.model, **load_kwargs)
    except Exception as e:
        print(f"[cdm] AutoModelForCausalLM failed ({e}); trying AutoModelForImageTextToText")
        from transformers import AutoModelForImageTextToText
        model = AutoModelForImageTextToText.from_pretrained(args.model, **load_kwargs)
    model.eval()
    box = GlassBox(model, tokenizer)

    results = {}
    for tag, resp in responses.items():
        print(f"[cdm] Analyzing {tag} ({len(resp['text'])} chars) ...", flush=True)
        t0 = time.time()
        metrics = box.analyze(resp["prompt"], resp["text"])
        metrics["analysis_wall_s"] = round(time.time() - t0, 1)
        results[tag] = metrics
        print(f"[cdm]   CDM={metrics['cdm_score']} band={metrics['band_provisional']} "
              f"lock_layer={metrics['lock_layer']} density={metrics['lock_density']} "
              f"({metrics['analysis_wall_s']}s)", flush=True)

    # ---- save ------------------------------------------------------
    stamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    full = {
        "meta": {
            "date": stamp,
            "generator": f"ollama/{args.ollama_model} (Q4)",
            "analyzer": f"{args.model} (bf16, CPU, dense {box.n_layers}-layer capture)",
            "thresholds_4b": {
                "entropy_drop_bits": TH_ENTROPY_DROP,
                "convergence_ratio": TH_CONVERGENCE,
                "gini_delta": TH_GINI_DELTA,
                "stability": TH_STABILITY,
                "lock_window": LOCK_WINDOW,
            },
            "protocol": "Elias Rook Small Model Addendum (2026-06-12)",
        },
        "responses": responses,
        "results": results,
    }
    json_path = outdir / f"cdm_calibration_{stamp}.json"
    json_path.write_text(json.dumps(full, indent=2, ensure_ascii=False), encoding="utf-8")

    # markdown summary
    lines = [
        "# CDM Calibration — Gemma 3 4B", "",
        f"Date: {stamp} · Generator: ollama Q4 · Analyzer: bf16 CPU, all {box.n_layers} layers",
        f"Thresholds (Elias 4B): dH>={TH_ENTROPY_DROP} bits, r<={TH_CONVERGENCE}, "
        f"giniD>={TH_GINI_DELTA}, stability>={TH_STABILITY}, lock window {LOCK_WINDOW}", "",
        "| Probe | T | CDM | Band | Lock layer | Lock density | Final H (bits) | avg r | mean Gini | Stability |",
        "|---|---|---|---|---|---|---|---|---|---|",
    ]
    for tag, m in results.items():
        probe, temp = tag.split("@T")
        lines.append(
            f"| {probe} | {temp} | {m['cdm_score']} | {m['band_provisional']} "
            f"| {m['lock_layer']} | {m['lock_density']} | {m['final_entropy_bits']} "
            f"| {m['avg_convergence_ratio']} | {m['mean_gini']} | {m['output_stability']} |"
        )
    scores = [m["cdm_score"] for m in results.values()]
    lines += ["", f"Score spread: {min(scores):.1f} – {max(scores):.1f} "
              f"(target per Elias: 30–40 point easy→hard spread)"]
    md_path = outdir / f"cdm_calibration_{stamp}.md"
    md_path.write_text("\n".join(lines), encoding="utf-8")

    print(f"\n[done] Results: {json_path}\n[done] Summary: {md_path}")


if __name__ == "__main__":
    main()
