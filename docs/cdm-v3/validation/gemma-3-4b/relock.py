"""
Re-apply Elias's Small Model Addendum lock rule to the EXISTING calibration
data (no model re-run needed — per-layer arrays are already saved).

Elias 2026-06-12 (round 2):
  entropy collapse dH >= 1.4 bits
  convergence ratio r <= 0.45
  Gini ABSOLUTE >= 0.78   (replaces gini-delta; baseline already ceilinged)
  output stability >= 0.70
  lock window >= 2 consecutive layers
  lock density >= 0.25 secondary
  bands: reflex <40, deliberation 40-58, deep 59-72, insight >72
"""
import json, sys
from pathlib import Path

TH_DH, TH_R, TH_GINI_ABS, WIN = 1.4, 0.45, 0.78, 2

def band(s):
    return ("reflex" if s < 40 else "deliberation" if s <= 58
            else "deep" if s <= 72 else "insight")

src = Path(sys.argv[1]) if len(sys.argv) > 1 else sorted(
    Path("results").glob("cdm_calibration_*.json"))[-1]
data = json.loads(src.read_text(encoding="utf-8"))

print(f"Re-locking {src.name} with Elias round-2 rule "
      f"(dH>={TH_DH}, r<={TH_R}, giniABS>={TH_GINI_ABS}, window>={WIN})\n")
print(f"{'probe':16} {'CDM':>5} {'newband':12} {'lockL':>5} {'dens':>5}")
print("-" * 50)

rows = []
for tag, r in data["results"].items():
    pl = r["per_layer"]
    n = len(pl["delta_h"])
    flags = []
    for l in range(n):
        gini = pl["gini"][l]
        ok = (pl["delta_h"][l] >= TH_DH and
              pl["convergence_ratio"][l] <= TH_R and
              gini is not None and gini >= TH_GINI_ABS)
        flags.append(ok)
    lock_layer = None
    for l in range(n - WIN + 1):
        if all(flags[l:l + WIN]):
            lock_layer = l
            break
    density = sum(flags) / n
    nb = band(r["cdm_score"])
    rows.append((tag, r["cdm_score"], nb, lock_layer, round(density, 3)))
    print(f"{tag:16} {r['cdm_score']:>5} {nb:12} "
          f"{str(lock_layer):>5} {density:>5.2f}")

locked = [r for r in rows if r[3] is not None]
print(f"\nLocks found: {len(locked)}/{len(rows)} runs "
      f"(was 0/14 with frontier thresholds)")
if locked:
    print("Lock layers:", sorted(set(r[3] for r in locked)))
