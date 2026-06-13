"""
CDM v3.2 "Effort + Settlement" — Elias Rook (2026-06-13).
Recomputed from the v3.1 JSON (all per-layer arrays already saved — no model
re-run needed). Decouples EFFORT (work done = |ΔH| magnitude) from SETTLEMENT
(final confidence), to credit hard problems where a 4B thinks hard but can't
settle.

  effort_score = max|ΔH|/12 + cumulative|ΔH|/(n*3)   [layers>=15 weighted 1.5x]
  cdm = (0.40*effort + 0.25*final_entropy_norm + 0.25*stability
         + 0.10*late_focus_norm) * 100
  lock: >=2 consecutive layers with |ΔH|>=2.5 (effort spike) OR final-entropy
        collapse; density (effort/collapse layers, late-weighted) >= 0.18
  bands: reflex <38, deliberation 38-58, deep 59-74, insight >74
"""
import json, sys
from pathlib import Path

W_EFFORT, W_FINALH, W_STAB, W_LATEFOCUS = 0.40, 0.25, 0.25, 0.10
DH_SPIKE = 2.5          # |ΔH| effort-spike threshold
DH_COLLAPSE = 1.4       # entropy-collapse threshold (positive drop)
LOCK_WINDOW = 2
LOCK_DENSITY = 0.18
LATE = 15               # layers >= this weighted 1.5x in effort + density
LATE_FOCUS = 20         # late-focus averages layers >= this

def band(s):
    return ("reflex" if s < 38 else "deliberation" if s <= 58
            else "deep" if s <= 74 else "insight")

src = Path(sys.argv[1]) if len(sys.argv) > 1 else sorted(
    Path("results-v31").glob("cdm_calibration_*.json"))[-1]
data = json.loads(src.read_text(encoding="utf-8"))

rows = []
for tag, r in data["results"].items():
    pl = r["per_layer"]
    dh = pl["delta_h"]
    n = len(dh)
    absdh = [abs(x) for x in dh]
    max_abs = max(absdh)
    cumulative = sum(absdh[l] * (1.5 if l >= LATE else 1.0) for l in range(n))
    effort = max_abs / 12.0 + cumulative / (n * 3.0)

    final_norm = r["entropy_norm"]            # 1/(1+exp(finalH-1))
    stab = r["output_stability"]

    # late focus: use per-layer Gini on late layers (focus ratio is saturated);
    # normalize 0.78..1.0 -> 0..1
    gini = [g for g in (pl["gini"][LATE_FOCUS:]) if g is not None]
    late_focus_norm = 0.0
    if gini:
        mg = sum(gini) / len(gini)
        late_focus_norm = max(0.0, min(1.0, (mg - 0.78) / (1.0 - 0.78)))

    cdm = min(100.0, max(0.0,
        (W_EFFORT * effort + W_FINALH * final_norm +
         W_STAB * stab + W_LATEFOCUS * late_focus_norm) * 100))

    # lock: effort spikes OR collapse, per layer
    eff_or_col = [(absdh[l] >= DH_SPIKE or dh[l] >= DH_COLLAPSE) for l in range(n)]
    lock_layer = next((l for l in range(n - LOCK_WINDOW + 1)
                       if all(eff_or_col[l:l + LOCK_WINDOW])), None)
    wsum = sum(1.5 if l >= LATE else 1.0 for l in range(n))
    whit = sum((1.5 if l >= LATE else 1.0) for l in range(n) if eff_or_col[l])
    density = whit / wsum
    locked = lock_layer is not None and density >= LOCK_DENSITY

    rows.append((tag, round(cdm, 1), band(cdm), locked, lock_layer,
                 round(density, 3), round(max_abs, 2), round(effort, 3),
                 r["final_entropy_bits"], stab))

print(f"v3.2 Effort+Settlement — recomputed from {src.name}\n")
hdr = f"{'probe':16} {'CDM':>5} {'band':12} {'lock':>5} {'dens':>5} {'maxDH':>6} {'effort':>6} {'finalH':>6} {'stab':>5}"
print(hdr); print("-" * len(hdr))
for r in rows:
    print(f"{r[0]:16} {r[1]:>5} {r[2]:12} {str(r[3]):>5} {r[5]:>5.2f} "
          f"{r[6]:>6} {r[7]:>6} {r[8]:>6} {r[9]:>5}")
scores = [r[1] for r in rows]
nlock = sum(1 for r in rows if r[3])
print(f"\nspread {min(scores):.1f}-{max(scores):.1f} ({max(scores)-min(scores):.1f} pts), "
      f"locks {nlock}/{len(rows)}")

# Save markdown for the repo
md = [f"# CDM v3.2 Effort+Settlement — Gemma 3 4B (recomputed {src.name})", "",
      "| Probe | T | CDM | Band | Lock | Dens | max|dH| | effort | finalH | stab |",
      "|---|---|---|---|---|---|---|---|---|---|"]
for r in rows:
    p, t = r[0].split("@T")
    md.append(f"| {p} | {t} | {r[1]} | {r[2]} | {r[3]} | {r[5]} | {r[6]} | {r[7]} | {r[8]} | {r[9]} |")
md.append(f"\nspread {min(scores):.1f}-{max(scores):.1f}, locks {nlock}/{len(rows)}")
Path("results-v31/v32_table.md").write_text("\n".join(md), encoding="utf-8")
print("\nsaved results-v31/v32_table.md")
