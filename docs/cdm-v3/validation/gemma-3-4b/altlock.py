"""Test alternative lock STRUCTURES on existing data (the simultaneity rule
gives 0 locks because dH and r decouple on Gemma). Two candidates:
  A) 2-of-3 signals true, >=2 consecutive layers
  B) sequential: a dH>=1.4 layer FOLLOWED within 3 layers by an r<=0.45 layer
     (entropy collapses, THEN the representation settles)
"""
import json
from pathlib import Path

TH_DH, TH_R, TH_GINI = 1.4, 0.45, 0.78
src = sorted(Path("results").glob("cdm_calibration_*.json"))[-1]
data = json.loads(src.read_text(encoding="utf-8"))

print(f"{'probe':16} {'CDM':>5} {'2of3_lock':>9} {'seq_lock':>8}")
print("-" * 44)
a_hits = b_hits = 0
for tag, r in data["results"].items():
    pl = r["per_layer"]; n = len(pl["delta_h"])
    dh = [pl["delta_h"][l] >= TH_DH for l in range(n)]
    rr = [pl["convergence_ratio"][l] <= TH_R for l in range(n)]
    gi = [(pl["gini"][l] or 0) >= TH_GINI for l in range(n)]

    # A) 2-of-3, >=2 consecutive
    two = [sum([dh[l], rr[l], gi[l]]) >= 2 for l in range(n)]
    a_lock = next((l for l in range(n - 1) if two[l] and two[l + 1]), None)

    # B) sequential dH -> r within 3 layers
    b_lock = None
    for l in range(n):
        if dh[l]:
            for k in range(l + 1, min(l + 4, n)):
                if rr[k]:
                    b_lock = l
                    break
        if b_lock is not None:
            break

    if a_lock is not None: a_hits += 1
    if b_lock is not None: b_hits += 1
    print(f"{tag:16} {r['cdm_score']:>5} {str(a_lock):>9} {str(b_lock):>8}")

print(f"\nA) 2-of-3 rule:   {a_hits}/14 runs lock")
print(f"B) sequential:    {b_hits}/14 runs lock")
