"""Why do locks never form? Measure how often each condition holds, and how
often they CO-OCCUR at the same layer, across all 14 runs x 34 layers."""
import json, sys
from pathlib import Path

TH_DH, TH_R, TH_GINI = 1.4, 0.45, 0.78
src = sorted(Path("results").glob("cdm_calibration_*.json"))[-1]
data = json.loads(src.read_text(encoding="utf-8"))

tot = 0
c_dh = c_r = c_gini = 0
c_dh_r = c_dh_gini = c_r_gini = c_all = 0
# where does dH>=1.4 land? (layer histogram, thirds)
dh_layers = []

for tag, r in data["results"].items():
    pl = r["per_layer"]; n = len(pl["delta_h"])
    for l in range(n):
        tot += 1
        dh = pl["delta_h"][l] >= TH_DH
        rr = pl["convergence_ratio"][l] <= TH_R
        gi = (pl["gini"][l] or 0) >= TH_GINI
        if dh: c_dh += 1; dh_layers.append(l / (n - 1))
        if rr: c_r += 1
        if gi: c_gini += 1
        if dh and rr: c_dh_r += 1
        if dh and gi: c_dh_gini += 1
        if rr and gi: c_r_gini += 1
        if dh and rr and gi: c_all += 1

pct = lambda x: f"{100*x/tot:5.1f}%"
print(f"Across {tot} layer-observations (14 runs x ~34 layers):\n")
print(f"  dH>=1.4 alone           {pct(c_dh)}")
print(f"  r<=0.45 alone           {pct(c_r)}")
print(f"  gini>=0.78 alone        {pct(c_gini)}")
print(f"  dH AND r                {pct(c_dh_r)}")
print(f"  dH AND gini             {pct(c_dh_gini)}")
print(f"  r AND gini              {pct(c_r_gini)}")
print(f"  ALL THREE (1-layer lock){pct(c_all)}")
early = sum(1 for x in dh_layers if x < 0.33)
mid   = sum(1 for x in dh_layers if 0.33 <= x < 0.66)
late  = sum(1 for x in dh_layers if x >= 0.66)
print(f"\n  Where dH>=1.4 fires: early {early}, mid {mid}, late {late} "
      f"(late-weighted = the real settling signal per Elias)")
print(f"\n  Binding constraint: the conjunction (dH AND r) at {pct(c_dh_r)} — "
      f"entropy-drop layers and convergence layers rarely coincide on Gemma.")
