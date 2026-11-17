"""Select a benchmark candidate cluster from a coverage report by a structural rule (no scenario scores).

python3 data/search-benchmark/select-cluster.py COVERAGE.json EXCLUDE_CASE.json OUT_CASE.json ID PERIOD

Rule (change improve-proposal-search-coverage, design D5): the anchor is the busiest location the generator keeps whose position lies more
than EXCLUDE_M from every junction of the excluded case. The pool is every generated or supplementary closure candidate (whole or
per-street junction filter, diagonal diverter, block filter) and every generated Slow Street whose position lies within RADIUS_M of the
anchor, in generator order and then supplement order, with at most PER_PLACE designs at one place. The first SIZE form the case.
"""
import json
import math
import sys

EXCLUDE_M, RADIUS_M, PER_PLACE, SIZE = 400.0, 300.0, 2, 12
KINDS = {"node_filter", "diagonal_diverter", "modal_filter", "slow_street"}

cov = json.load(open(sys.argv[1]))
excl = json.load(open(sys.argv[2]))
out_path, case_id, period = sys.argv[3], sys.argv[4], sys.argv[5]

gen = cov["generatedCandidates"]
sup = [dict(c, supplement=True) for c in cov["supplementCandidates"]]
excluded_nodes = {c["iv"].get("node") for c in excl["candidates"] if c["iv"].get("node") is not None}
xy_of_node = {}
for c in gen + sup:
    if c["block"] is None and c["nodes"]:
        xy_of_node[c["nodes"][0]] = c["xy"]
excl_xy = [xy_of_node[n] for n in excluded_nodes if n in xy_of_node]
dist = lambda a, b: math.hypot(a[0] - b[0], a[1] - b[1])


def loc_key(c):
    return f"b{c['block']}" if c["block"] is not None else ("s" + "/".join(c["places"]) if c["kind"] == "slow_street" else f"n{c['nodes'][0]}")


anchor = None
for k in cov["keptLocations"]:
    kind, idx = k["location"].split("(")[0], int(k["location"].split("(")[1].rstrip(")"))
    here = [c for c in gen if c["kind"] in KINDS - {"slow_street"} and ((kind == "Block" and c["block"] == idx) or (kind == "Node" and c["block"] is None and c["nodes"] == [idx]))]
    if here and all(dist(here[0]["xy"], e) > EXCLUDE_M for e in excl_xy):
        anchor = (k, here[0]["xy"])
        break
assert anchor, "no anchor"
pool, per = [], {}
for c in gen + sup:
    if c["kind"] not in KINDS or dist(c["xy"], anchor[1]) > RADIUS_M:
        continue
    key = loc_key(c)
    if per.get(key, 0) >= PER_PLACE:
        continue
    per[key] = per.get(key, 0) + 1
    pool.append(c)
pool = pool[:SIZE]
case = dict(excl)
case.update({
    "id": case_id,
    "period": period,
    "selection": f"Structural cluster rule of data/search-benchmark/select-cluster.py on the {cov['period']} baseline coverage report (seed {cov['seed']}, {cov['generator']['locations']} locations, bypass supplement on): anchor {anchor[0]['location']} (kept rank {anchor[0]['rank']}), the first location more than {EXCLUDE_M:.0f} m from every junction of case {excl['id']}; closure candidates and Slow Streets within {RADIUS_M:.0f} m, at most {PER_PLACE} designs per place, first {SIZE} in generator then supplement order. Held-out candidate set: frozen before any of its packages was simulated.",
    "candidates": [{"id": f"c{i:02d}", "iv": {k: v for k, v in c["iv"].items() if v is not None}, **({"origin": "bypass-supplement"} if c.get("supplement") else {})} for i, c in enumerate(pool)],
    "known": [],
})
json.dump(case, open(out_path, "w"), indent=1)
print(anchor[0], len(pool))
for c in pool:
    print(" ", c["kind"], c["label"], "(supplement)" if c.get("supplement") else "")
