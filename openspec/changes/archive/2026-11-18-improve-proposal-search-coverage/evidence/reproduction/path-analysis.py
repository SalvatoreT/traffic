#!/usr/bin/env python3
"""Explain observed beam omissions by replaying its control flow over fixed results."""
import json
import hashlib
from pathlib import Path

ROOT = Path(__file__).resolve().parent
v = json.loads((ROOT / "screen-results.json").read_text())
assert v["phase"] == "complete"
oracle = {tuple(r["set"]): r for r in v["evaluations"]}
cands = v["metadata"]["candidates"]
net = json.loads((ROOT / "public/data/rockridge.network.json").read_text())
blocks = v["harmBlocks"]
seen, order = {}, []
trace = []


def evaluate(sets):
    for s in sets:
        s = tuple(s)
        if s not in seen:
            seen[s] = len(order)
            order.append(s)


def valid(s):
    return oracle[s]["reject"] is None


def floor():
    return 0.5 * max([0.0] + [oracle[s]["reductionPct"] for s in order if valid(s)])


def weight(size):
    return 0.1 * min((size - 1) / 2, 1)


def rank(s, obj, w=None):
    e = oracle[s]
    if obj == "least-detour" and e["reductionPct"] >= floor():
        return 1000 - max(-500, min(500, e["detourS"]))
    return e["reductionPct"] - (weight(len(s)) if w is None else w) * e["harm"]


def places(s):
    out = []
    for i in s:
        c = cands[i]
        if c["kind"] in ("slow_street", "speed_limit"):
            out.append("s:" + (c["places"][0] if c["places"] else ""))
        elif c["block"] is not None:
            out.append("b" + str(c["block"]))
        else:
            out.append("n" + ".".join(str(n) for n in c["nodes"]))
    return tuple(sorted(out))


def distinct(ranked, width):
    chosen, used = [], set()
    for s in ranked:
        if len(chosen) >= width:
            break
        p = places(s)
        if p not in used:
            chosen.append(s)
            used.add(p)
    return chosen


def conflict(a, b):
    x, y = cands[a], cands[b]
    if x["key"] == y["key"]:
        return True
    if x["block"] is not None and x["block"] == y["block"]:
        return True
    slow = lambda c: c["kind"] in ("slow_street", "speed_limit")
    if slow(x) and slow(y) and "slow_street" in (x["kind"], y["kind"]) and x["places"][:1] == y["places"][:1]:
        return True
    on_node = lambda c: c["block"] is None and c["kind"] not in ("turn_ban", "slow_street")
    if on_node(x) and on_node(y) and x["nodes"] == y["nodes"]:
        return True
    node_kind = {"node_filter", "diagonal_diverter", "traffic_circle", "control", "signal_timing"}
    return (x["kind"] == "turn_ban" and y["kind"] in node_kind or y["kind"] == "turn_ban" and x["kind"] in node_kind) and x["nodes"] == y["nodes"]


for stage in v["beamStages"]:
    obj = stage["objective"]
    ok = lambda i: obj != "no-closures" or cands[i]["kind"] in {"slow_street", "speed_limit", "one_way", "control", "traffic_circle", "speed_hump", "turn_ban"}
    depth = 2 if obj == "fewest-changes" else 3
    singles = [(i,) for i in range(12) if ok(i)]
    evaluate(singles)
    ranked = sorted((s for s in singles if valid(s)), key=lambda s: (-rank(s, obj), s[0]))
    positive = [s for s in ranked if oracle[s]["reductionPct"] > 0]
    top = [s[0] for s in distinct(positive, 12)]
    usable = [ok(i) and (i,) in seen and valid((i,)) for i in range(12)]
    beam = distinct(ranked, 5)
    stage_trace = {"objective": obj, "initialRankedSingles": ranked,
                   "positiveSingleExtensionCandidates": top,
                   "initialBeam": beam, "levels": []}
    for d in range(2, depth + 1):
        new_sets, expanded = [], []
        for member in beam:
            ext = list(top)
            hot = sorted((i for i, inc in enumerate(oracle[member]["blockIncreases"]) if inc > 10),
                         key=lambda i: (-oracle[member]["blockIncreases"][i], i))[:3]
            repair = []
            for hb in hot:
                blk = blocks[hb]
                first = net["links"][blk["links"][0]]
                ends = {first["from"], first["to"]}
                for i, c in enumerate(cands):
                    near = c["block"] == blk["index"] or any(n in ends for n in c["nodes"])
                    if near and usable[i] and i not in ext:
                        ext.append(i)
                        repair.append(i)
            children = []
            for i in ext:
                if i in member or any(conflict(i, j) for j in member):
                    continue
                s = tuple(sorted(member + (i,)))
                children.append(s)
                if s not in new_sets:
                    new_sets.append(s)
            expanded.append({"parent": member, "extensionCandidates": ext,
                             "repairCandidates": repair, "hotBlocks": [blocks[i]["label"] for i in hot],
                             "children": children})
        evaluate(new_sets)
        level = sorted((s for s in new_sets if valid(s)), key=lambda s: (-rank(s, obj), seen[s]))
        w = weight(len(level[0])) if level else 0
        prev_best = max((rank(s, obj, w) for s in beam), default=-float("inf"))
        level_best = rank(level[0], obj, w) if level else -float("inf")
        stopped = level_best <= prev_best + 1e-9
        kept = [] if stopped else distinct(level, 5)
        stage_trace["levels"].append({"depth": d, "parents": beam, "expansions": expanded,
                                      "rankedChildren": [{"set": s, "rank": rank(s, obj), "coreScore": oracle[s]["score"], "places": places(s)} for s in level],
                                      "stopped": stopped, "nextBeam": kept})
        if stopped:
            break
        beam = kept
    assert order == [tuple(s) for s in stage["visitedSets"]], f"Replay diverged at {obj}"
    stage_trace["visitedCount"] = len(order)
    trace.append(stage_trace)

assert order == [tuple(s) for s in v["beam"]["visitedSets"]]
targets = [(6, 9, 11), (3, 11), (2, 4, 5)]
target_paths = []
for target in targets:
    paths = []
    for st in trace:
        for level in st["levels"]:
            if level["depth"] != len(target):
                continue
            for i in target:
                parent = tuple(j for j in target if j != i)
                expansion = next((e for e in level["expansions"] if tuple(e["parent"]) == parent), None)
                paths.append({"objective": st["objective"], "parent": parent, "add": i,
                              "parentWasExpanded": expansion is not None,
                              "additionWasOffered": expansion is not None and i in expansion["extensionCandidates"],
                              "parentVisited": parent in seen,
                              "parentCoreScore": oracle[parent]["score"],
                              "extensionCandidates": expansion["extensionCandidates"] if expansion else None,
                              "hotBlocks": expansion["hotBlocks"] if expansion else None})
    neighbors = []
    for s in seen:
        removed, added = sorted(set(s) - set(target)), sorted(set(target) - set(s))
        if max(len(removed), len(added)) == 1 and valid(s):
            neighbors.append({"from": s, "fromCoreScore": oracle[s]["score"],
                              "remove": removed, "add": added,
                              "forwarded": list(s) in v["beam"]["finalistSets"]})
    neighbors.sort(key=lambda x: (-x["fromCoreScore"], x["from"]))
    target_paths.append({"target": target, "score": oracle[target]["score"],
                         "attemptedPaths": paths, "oneEditNeighbors": neighbors})

forwarded = {tuple(s) for s in v["beam"]["finalistSets"]}
unseen = set(oracle) - set(seen)
def one_edit(s, t):
    return max(len(set(s) - set(t)), len(set(t) - set(s))) == 1
def same_site_variant(s, t):
    removed, added = set(s) - set(t), set(t) - set(s)
    return len(removed) == len(added) == 1 and (removed | added) <= {5, 6, 7, 8}
def deletion(s, t):
    return set(t) < set(s) and len(t) + 1 == len(s)
neighborhoods = []
for name, pool, rule in [("one-edit-from-forwarded", forwarded, one_edit),
                         ("same-site-variant-from-all-visited", seen, same_site_variant),
                         ("same-site-variant-from-forwarded", forwarded, same_site_variant),
                         ("deletion-from-forwarded", forwarded, deletion)]:
    added = {t for t in unseen if any(rule(s, t) for s in pool)}
    neighborhoods.append({"rule": name, "additionalCombinations": len(added),
                          "validAdditionalCombinations": sum(valid(t) for t in added),
                          "targetsReached": sorted(added & set(targets)),
                          "additionalSets": sorted(added)})

out = {"schema": "search-benchmark-path-analysis-1", "replayedVisitedSequenceExactly": True,
       "sourceRevision": v["metadata"]["sourceRevision"],
       "screeningResultsSha256": hashlib.sha256((ROOT / "screen-results.json").read_bytes()).hexdigest(),
       "scriptSha256": hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),
       "note": "Control-flow replay over completed screening values. No new simulations; no confirmation results read. No alternative algorithm has been tested.",
       "trace": trace, "targets": target_paths,
       "posthocNeighborhoodCounts": neighborhoods,
       "neighborhoodLimit": "Finite-oracle neighborhood enumeration only; no alternative search was run, and these posthoc choices have not been independently tested."}
(ROOT / "search-path-analysis.json").write_text(json.dumps(out, indent=2) + "\n")
print("Exact replay matched all four recorded visited-set sequences.")
for t in target_paths:
    print("Target", t["target"], "score", round(t["score"], 3))
    for p in t["attemptedPaths"]:
        if p["parentWasExpanded"]:
            print(" ", p["objective"], p["parent"], "+", p["add"], "offered", p["additionWasOffered"], "extensions", p["extensionCandidates"])
    print("  Best one-edit neighbors:", t["oneEditNeighbors"][:3])
