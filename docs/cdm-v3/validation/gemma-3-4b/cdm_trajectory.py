"""
CDM v3.3 "Generation CRYSTAL" — trajectory-based measurement (Elias Rook, Round 5).

Round 1-4 showed no clean reasoning-depth axis in a SINGLE token's per-layer
trajectory at 4B scale. v3.3 looks at the TOKEN dimension instead: how the
model's uncertainty evolves across the words it generates (true CRYSTAL Time).

Key efficiency: the per-generated-token uncertainty is FREE — the model's own
output logits at each response position give it directly (no logit lens needed).
So we measure the FULL-resolution entropy trajectory across the whole response in
one forward pass, rather than sampling a few positions.

Metrics per response:
  entropy[t]  = Shannon entropy (bits) of the model's prediction at response token t
  early/late  = mean entropy over first / last 25% of the response
  decay       = early - late  (does the model converge as it writes?)
  CTM         = first token index where entropy stays < SETTLE_BITS for >=K tokens
                (the "thinking time" before settling; = R if it never settles)
  ctm_frac    = CTM / response_length
  mean/peak/final entropy

Hypothesis under test: hard prompts either take LONGER to settle (high CTM) or
never settle (high late entropy), while easy prompts settle almost immediately.

Theory: Elias Rook. Implementation: mikeat7 network. 2026-06-13.
"""
import argparse, gc, json, time
from datetime import datetime
from pathlib import Path
import numpy as np

SETTLE_BITS = 0.8     # entropy below this = "settled" on this token
SETTLE_RUN  = 5       # consecutive settled tokens to call it CRYSTAL Time
MAX_SEQ     = 1024


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--model", default="unsloth/gemma-3-4b-it")
    ap.add_argument("--responses", default="results/responses.json")
    ap.add_argument("--outdir", default="results-v33")
    ap.add_argument("--greedy-only", action="store_true",
                    help="only analyze T0.0 responses (Elias's v3.3 sketch)")
    args = ap.parse_args()
    outdir = Path(args.outdir); outdir.mkdir(parents=True, exist_ok=True)

    responses = json.loads(Path(args.responses).read_text(encoding="utf-8"))
    if args.greedy_only:
        responses = {k: v for k, v in responses.items() if k.endswith("@T0.0")}

    import torch
    from transformers import AutoModelForCausalLM, AutoTokenizer
    print(f"[v33] Loading {args.model} (bf16 CPU) ...", flush=True)
    tok = AutoTokenizer.from_pretrained(args.model)
    try:
        model = AutoModelForCausalLM.from_pretrained(
            args.model, dtype=torch.bfloat16, device_map="cpu",
            attn_implementation="eager", low_cpu_mem_usage=True)
    except Exception as e:
        print(f"[v33] causal load failed ({e}); trying image-text-to-text")
        from transformers import AutoModelForImageTextToText
        model = AutoModelForImageTextToText.from_pretrained(
            args.model, dtype=torch.bfloat16, device_map="cpu",
            attn_implementation="eager", low_cpu_mem_usage=True)
    model.eval()

    def entropy_bits(logits_row):
        logp = torch.log_softmax(logits_row.float(), dim=-1)
        p = torch.exp(logp)
        m = p > 1e-10
        return float((-(p[m] * logp[m]).sum() / np.log(2)).item())

    results = {}
    for tag, resp in responses.items():
        t0 = time.time()
        prompt_msgs = [{"role": "user", "content": resp["prompt"]}]
        full_msgs = prompt_msgs + [{"role": "assistant", "content": resp["text"]}]
        prompt_ids = tok.apply_chat_template(prompt_msgs, tokenize=True,
                        add_generation_prompt=True, return_tensors="pt")
        if not torch.is_tensor(prompt_ids):
            prompt_ids = prompt_ids["input_ids"]
        full = tok.apply_chat_template(full_msgs, tokenize=True,
                        add_generation_prompt=False, return_tensors="pt")
        if not torch.is_tensor(full):
            full = full["input_ids"]
        if full.shape[1] > MAX_SEQ:
            full = full[:, :MAX_SEQ]
        p_len = min(prompt_ids.shape[1], full.shape[1] - 2)
        seq = full.shape[1]

        with torch.no_grad():
            out = model(full, use_cache=False, return_dict=True)
            logits = out.logits[0]   # [seq, vocab]

        # positions p_len-1 .. seq-2 predict the response tokens
        ent = [entropy_bits(logits[p]) for p in range(p_len - 1, seq - 1)]
        del out, logits; gc.collect()
        R = len(ent)
        if R < 4:
            continue
        E = np.array(ent)
        q = max(1, R // 4)
        early = float(E[:q].mean()); late = float(E[-q:].mean())
        decay = early - late
        # CRYSTAL Time: first index with a settled run
        ctm = R
        for i in range(R - SETTLE_RUN + 1):
            if np.all(E[i:i + SETTLE_RUN] < SETTLE_BITS):
                ctm = i; break
        # downsample curve to <=40 points for storage
        idx = np.linspace(0, R - 1, min(40, R)).astype(int)
        curve = [round(float(E[i]), 3) for i in idx]

        results[tag] = {
            "resp_tokens": R,
            "mean_entropy": round(float(E.mean()), 3),
            "early_entropy": round(early, 3),
            "late_entropy": round(late, 3),
            "decay": round(decay, 3),
            "peak_entropy": round(float(E.max()), 3),
            "final_entropy": round(float(E[-1]), 3),
            "ctm": ctm,
            "ctm_frac": round(ctm / R, 3),
            "settled": ctm < R,
            "curve": curve,
            "wall_s": round(time.time() - t0, 1),
        }
        m = results[tag]
        print(f"[v33] {tag:18} R={R:4} mean={m['mean_entropy']:.2f} "
              f"early={m['early_entropy']:.2f} late={m['late_entropy']:.2f} "
              f"decay={m['decay']:+.2f} CTM={m['ctm']}({m['ctm_frac']:.2f}) "
              f"settled={m['settled']} ({m['wall_s']}s)", flush=True)

    stamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    (outdir / f"trajectory_{stamp}.json").write_text(
        json.dumps({"meta": {"date": stamp, "settle_bits": SETTLE_BITS,
                    "settle_run": SETTLE_RUN, "model": args.model,
                    "protocol": "Elias v3.3 Generation CRYSTAL"},
                    "results": results}, indent=2), encoding="utf-8")

    # markdown
    md = ["# CDM v3.3 Generation CRYSTAL — Gemma 3 4B", "",
          f"settled = entropy < {SETTLE_BITS} bits for {SETTLE_RUN} consecutive tokens; "
          f"CTM = tokens until that happens (= response length if never).", "",
          "| Probe | T | Rtok | mean | early | late | decay | CTM | CTM% | settled |",
          "|---|---|---|---|---|---|---|---|---|---|"]
    for tag, m in results.items():
        p, t = tag.split("@T")
        md.append(f"| {p} | {t} | {m['resp_tokens']} | {m['mean_entropy']} | "
                  f"{m['early_entropy']} | {m['late_entropy']} | {m['decay']:+} | "
                  f"{m['ctm']} | {m['ctm_frac']} | {m['settled']} |")
    (outdir / f"trajectory_{stamp}.md").write_text("\n".join(md), encoding="utf-8")
    print(f"\n[done] {outdir}/trajectory_{stamp}.json + .md")


if __name__ == "__main__":
    main()
