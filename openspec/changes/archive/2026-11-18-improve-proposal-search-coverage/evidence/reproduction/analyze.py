#!/usr/bin/env python3
"""Audit the frozen search experiment and select confirmation runs without rerunning it."""

import argparse
import collections
import hashlib
import itertools
import json
import math
from pathlib import Path


ROOT = Path(__file__).resolve().parent
EXPECTED_MANIFEST_SHA256 = "5d80919fa160c06e89cdb813b7961df3a7496938adf15f1d471ede0321edb133"
OBJECTIVES = ["most-removed", "no-closures", "least-detour", "fewest-changes"]


def sha256(data):
    return hashlib.sha256(data).hexdigest()


def read_json(path):
    raw = path.read_bytes()
    return json.loads(raw), sha256(raw)


def write_once(path, obj):
    data = (json.dumps(obj, indent=2, sort_keys=True, allow_nan=False) + "\n").encode()
    if path.exists():
        assert path.read_bytes() == data, f"Refusing to change frozen output: {path}"
        return sha256(data)
    with path.open("xb") as f:
        f.write(data)
    return sha256(data)


def key(row):
    return tuple(row["set"])


def valid(row):
    return row["reject"] is None


def baseline():
    return {"set": [], "reject": None, "score": 0.0, "reductionPct": 0.0,
            "harm": 0.0, "detourS": 0.0, "rawIncrease": 0.0,
            "rawWorstLabel": None, "labels": ["Baseline"], "link": None}


def best(rows, include_baseline=False):
    eligible = [r for r in rows if valid(r)]
    if include_baseline:
        eligible.append(baseline())
    return min(eligible, key=lambda r: (-r["score"], key(r)), default=None)


def nondominated(rows):
    eligible = [r for r in rows if valid(r) and r["reductionPct"] > 0.0]
    out = set()
    for a in eligible:
        dominated = any(
            key(a) != key(b)
            and b["reductionPct"] >= a["reductionPct"]
            and b["harm"] <= a["harm"]
            and len(b["set"]) <= len(a["set"])
            and (b["reductionPct"] > a["reductionPct"]
                 or b["harm"] < a["harm"]
                 or len(b["set"]) < len(a["set"]))
            for b in eligible
        )
        if not dominated:
            out.add(key(a))
    return out


def describe(row, candidates):
    if row is None:
        return None
    return {"set": row["set"],
            "candidateIds": [candidates[i]["id"] for i in row["set"]],
            "labels": [candidates[i]["label"] for i in row["set"]] or ["Baseline"],
            "score": row["score"], "reductionPct": row["reductionPct"],
            "adjustedHarm": row["harm"], "residentDetourSeconds": row["detourS"],
            "largestRawAllCarIncrease": row.get("rawIncrease"),
            "largestRawIncreaseBlock": row.get("rawWorstLabel"),
            "scenarioLink": row.get("link")}


def load_inputs(args):
    manifest, manifest_sha = read_json(args.manifest)
    assert manifest_sha == EXPECTED_MANIFEST_SHA256, "Frozen candidate manifest changed"
    result, result_sha = read_json(args.input)
    assert result["metadata"]["manifest"] == manifest, "Embedded candidate manifest changed"
    assert result["metadata"]["sourceRevision"] == manifest["sourceRevision"]
    return manifest, manifest_sha, result, result_sha


def capture_beam(args):
    manifest, manifest_sha, result, result_sha = load_inputs(args)
    if "beam" not in result:
        print(json.dumps({"status": "beam-not-complete", "phase": result["phase"]}))
        return
    lookup = {key(r): r for r in result["evaluations"]}
    visited = sorted(tuple(s) for s in result["beam"]["visitedSets"])
    snapshot = {"schema": "search-benchmark-beam-snapshot-1",
                "candidateManifestSha256": manifest_sha,
                "sourceRevision": manifest["sourceRevision"],
                "sourceCheckpointSha256": result_sha,
                "sourceCheckpointPhase": result["phase"],
                "capturedBeforeExhaustiveCompletion": result["phase"] != "complete",
                "beam": result["beam"],
                "evaluations": [lookup[s] for s in visited]}
    digest = write_once(args.snapshot, snapshot)
    print(json.dumps({"status": "captured", "rows": len(visited),
                      "beforeExhaustiveCompletion": snapshot["capturedBeforeExhaustiveCompletion"],
                      "file": str(args.snapshot), "sha256": digest}))


def validate_snapshot(snapshot, lookup, candidates):
    sets = [tuple(s) for s in snapshot["visitedSets"]]
    assert len(sets) == len(set(sets)), "Duplicate visited set"
    assert snapshot["evaluations"] == len(sets)
    assert set(sets) <= set(lookup), "Visited set missing from exhaustive results"
    rows = [lookup[s] for s in sets]
    winner = best(rows, include_baseline=True)
    assert key(winner) == tuple(snapshot["bestScoreSet"]), "Winner/tie rule mismatch"
    assert math.isclose(winner["score"], snapshot["bestScore"], abs_tol=1e-10)
    assert nondominated(rows) == {tuple(s) for s in snapshot["nonDominatedSets"]}
    finalists = {tuple(s) for s in snapshot["finalistSets"]}
    assert finalists <= set(sets), "Finalist was not evaluated"
    assert all(valid(lookup[s]) and lookup[s]["reductionPct"] > 0 for s in finalists)
    return sets, rows, winner, finalists


def analyze(args):
    manifest, manifest_sha, result, result_sha = load_inputs(args)
    assert result["phase"] == "complete", f"Screening is not complete: {result['phase']}"
    meta = result["metadata"]
    candidates = manifest["candidates"]
    assert len(candidates) == 12
    assert meta["periods"] == ["pm_peak"] and meta["seeds"] == [1, 2, 3]
    assert (meta["screenMinutes"], meta["minutes"], meta["beam"], meta["expand"], meta["depth"]) == (20, 60, 5, 12, 3)
    assert meta["harmWeight"] == 0.1 and meta["finalists"] == 12
    assert meta["objectives"] == OBJECTIVES
    assert not meta["knownPackages"] and not meta["warmStarts"]
    assert result["enumeratedNonempty"] == 298
    assert result["conflictingPackages"] == 58
    assert result["legalCandidateCombinations"] == 240

    # The frozen list has one mutually exclusive group: four Hillegass/63rd variants.
    # Every other candidate is on a different site/street and can be combined under
    # the production conflict rules. Whole-package access is judged by the engine.
    exclusive = {5, 6, 7, 8}
    assert all(candidates[i]["iv"].get("node") == 1090 for i in exclusive)
    expected = {s for n in (1, 2, 3) for s in itertools.combinations(range(12), n)
                if len(set(s) & exclusive) <= 1}
    assert len(expected) == 240
    rows = result["evaluations"]
    lookup = {key(r): r for r in rows}
    assert len(rows) == len(lookup), "Duplicate exhaustive evaluation"
    assert set(lookup) == expected, "Exhaustive package coverage mismatch"
    for r in rows:
        if valid(r):
            assert all(math.isfinite(r[f]) for f in ("score", "reductionPct", "harm", "detourS"))
            assert math.isclose(r["score"], r["reductionPct"] - meta["harmWeight"] * r["harm"], abs_tol=1e-9)
            assert len(r["blockIncreases"]) == len(result["harmBlocks"])
            raw_index = min(range(len(r["blockIncreases"])), key=lambda i: (-r["blockIncreases"][i], i))
            assert raw_index == r["rawWorst"]
            assert r["rawIncrease"] == r["blockIncreases"][raw_index]

    visited, beam_rows, beam_best, forwarded = validate_snapshot(result["beam"], lookup, candidates)
    all_sets, _, oracle_best, oracle_forwarded = validate_snapshot(result["exhaustive"], lookup, candidates)
    assert set(all_sets) == expected
    beam_sets = set(visited)
    stages = []
    prior_sets, prior_sims, prior_log_length = set(), 0, 0
    assert [s["objective"] for s in result["beamStages"]] == OBJECTIVES
    for stage in result["beamStages"]:
        stage_sets, _, winner, _ = validate_snapshot(stage, lookup, candidates)
        stage_set = set(stage_sets)
        assert prior_sets <= stage_set <= beam_sets
        assert prior_sims <= stage["simulations"] <= len(stage_set)
        stages.append({"objective": stage["objective"], "cumulativeEvaluations": len(stage_set),
                       "newEvaluations": len(stage_set - prior_sets),
                       "cumulativeSimulations": stage["simulations"],
                       "newSimulations": stage["simulations"] - prior_sims,
                       "bestCoreScore": winner["score"], "bestCoreScoreSet": winner["set"],
                       "objectiveFinalistSets": stage.get("objectiveFinalistSets", []),
                       "newSearchLog": stage["log"][prior_log_length:]})
        prior_sets, prior_sims = stage_set, stage["simulations"]
        prior_log_length = len(stage["log"])
    assert prior_sets == beam_sets

    immutable_check = {"available": False,
                       "note": "No separate beam score snapshot was available; membership, winners, and frontiers were checked against final evaluations."}
    if args.snapshot.exists():
        original, original_sha = read_json(args.snapshot)
        assert original["candidateManifestSha256"] == manifest_sha
        assert original["sourceRevision"] == manifest["sourceRevision"]
        assert original["beam"] == result["beam"], "Beam snapshot mutated"
        assert {key(r) for r in original["evaluations"]} == beam_sets
        assert all(r == lookup[key(r)] for r in original["evaluations"]), "Beam evaluation changed during exhaustive fill"
        immutable_check = {"available": True, "sha256": original_sha,
                           "checkedRows": len(original["evaluations"]),
                           "capturedBeforeExhaustiveCompletion": original["capturedBeforeExhaustiveCompletion"]}

    frontier = nondominated(rows)
    missed = [r for r in rows if key(r) not in beam_sets]
    best_missed = best(missed)
    missed_frontier = sorted(frontier - beam_sets, key=lambda s: (-lookup[s]["score"], s))
    roles = [("beam-best", beam_best), ("exhaustive-best", oracle_best), ("strongest-missed", best_missed)]
    selections = {}
    for role, r in roles:
        if r is None or not r["set"]:
            continue
        s = key(r)
        if s not in selections:
            selections[s] = {"id": role, "set": r["set"], "roles": [],
                             "screening": describe(r, candidates)}
        selections[s]["roles"].append(role)
    assert len(selections) <= 3
    freeze = {"schema": "search-benchmark-confirmation-selection-1",
              "sourceRevision": manifest["sourceRevision"],
              "simulatorFingerprint": meta["simulatorFingerprint"],
              "networkHash": meta["networkHash"], "demandHash": meta["demandHash"],
              "candidateManifestSha256": manifest_sha, "screeningResultsSha256": result_sha,
              "analysisScriptSha256": sha256(Path(__file__).read_bytes()),
              "selectionProtocol": manifest["protocol"]["confirmation"],
              "baselineIncludedByRunner": True,
              "sets": list(selections.values())}
    frozen_sha = write_once(args.selection, freeze)
    present = result["productionCandidatePresence"]
    assert len(present) == len(candidates)
    score_gap = oracle_best["score"] - beam_best["score"]
    assert score_gap >= 0
    summary = {"schema": "search-benchmark-analysis-1",
               "provenance": {"sourceRevision": manifest["sourceRevision"],
                              "simulatorFingerprint": meta["simulatorFingerprint"],
                              "networkHash": meta["networkHash"], "demandHash": meta["demandHash"],
                              "candidateManifestSha256": manifest_sha, "screeningResultsSha256": result_sha,
                              "analysisScriptSha256": sha256(Path(__file__).read_bytes()),
                              "confirmationSelectionSha256": frozen_sha},
               "checks": {"passed": True, "enumeratedNonempty": 298,
                          "conflictingPackages": 58, "coveredNonconflictingPackages": 240,
                          "immutableBeamScores": immutable_check},
               "beam": {"visitedPackages": len(beam_sets), "simulations": result["beam"]["simulations"],
                        "validPackages": sum(valid(r) for r in beam_rows), "forwardedPackages": len(forwarded),
                        "best": describe(beam_best, candidates), "stages": stages},
               "exhaustive": {"visitedPackages": len(rows), "simulations": result["exhaustive"]["simulations"],
                              "validPackages": sum(valid(r) for r in rows),
                              "rejectedPackages": sum(not valid(r) for r in rows),
                              "best": describe(oracle_best, candidates)},
               "comparison": {"screeningScoreGap": score_gap,
                              "sameBestSet": key(oracle_best) == key(beam_best),
                              "unvisitedPackages": len(missed),
                              "unvisitedValidPackages": sum(valid(r) for r in missed),
                              "strongestMissed": describe(best_missed, candidates),
                              "oracleFrontierCount": len(frontier),
                              "oracleFrontierVisitedCount": len(frontier & beam_sets),
                              "oracleFrontierForwardedCount": len(frontier & forwarded),
                              "oracleFrontierRecall": len(frontier & beam_sets) / len(frontier) if frontier else None,
                              "missedFrontier": [describe(lookup[s], candidates) for s in missed_frontier],
                              "visitedFrontierNotForwarded": [describe(lookup[s], candidates) for s in sorted((frontier & beam_sets) - forwarded)],
                              "exhaustiveAdditionalSimulations": result["exhaustive"]["simulations"] - result["beam"]["simulations"]},
               "candidateGeneration": {"productionCandidateCount": result["productionCandidateCount"],
                                       "frozenCandidatesPresent": sum(x["present"] for x in present),
                                       "absent": [candidates[i]["id"] for i, x in enumerate(present) if not x["present"]]},
               "singletonDiagnostics": [{"index": i, "id": c["id"],
                                         "reject": lookup[(i,)]["reject"],
                                         "score": lookup[(i,)]["score"],
                                         "reductionPct": lookup[(i,)]["reductionPct"],
                                         "harm": lookup[(i,)]["harm"],
                                         "rawIncrease": lookup[(i,)].get("rawIncrease"),
                                         "rawIncreaseBlock": lookup[(i,)].get("rawWorstLabel"),
                                         "productionCandidatePresent": present[i]["present"]}
                                        for i, c in enumerate(candidates)],
               "confirmation": {"file": str(args.selection), "packageCount": len(selections),
                                "totalRunsIncludingBaseline": (len(selections) + 1) * 10,
                                "selections": list(selections.values())},
               "limits": ["Exact within the frozen candidate universe and screening conditions only.",
                          "Cold search without prior packages; not a replay of the published full search.",
                          "The exhaustive oracle uses more evaluations; it is a quality reference, not an equal-budget competitor.",
                          "Confirmation covers the frozen primary-score representatives, not all objectives or every package.",
                          "No claim of field validation or model-form uncertainty coverage."]}
    summary_sha = write_once(args.output, summary)
    print(json.dumps({"status": "checked-and-frozen", "analysis": str(args.output), "sha256": summary_sha,
                      "beamVisited": len(beam_sets), "oraclePackages": len(rows),
                      "scoreGap": score_gap, "frontierFound": len(frontier & beam_sets),
                      "frontierTotal": len(frontier), "confirmationPackages": len(selections),
                      "selectionFile": str(args.selection)}, indent=2))


def self_test():
    def r(s, score, red=1, harm=0):
        return {"set": s, "score": score, "reductionPct": red, "harm": harm, "reject": None}
    assert best([r([2], 4), r([1], 4)], True)["set"] == [1]
    assert best([r([0], 0)], True)["set"] == []
    assert best([r([0], -1)], True)["set"] == []
    assert best([], False) is None
    assert nondominated([r([0], 1, 2, 0), r([1, 2], 1, 1, 0)]) == {(0,)}
    assert nondominated([r([0], 1, 2, 1), r([1], 1, 1, 0)]) == {(0,), (1,)}
    all_sets = [s for n in (1, 2, 3) for s in itertools.combinations(range(12), n)]
    assert len(all_sets) == 298
    assert sum(len(set(s) & {5, 6, 7, 8}) > 1 for s in all_sets) == 58
    print("Analysis self-checks passed; no experiment results read.")


def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument("--input", type=Path, default=ROOT / "screen-results.json")
    p.add_argument("--manifest", type=Path, default=ROOT / "candidates.json")
    p.add_argument("--snapshot", type=Path, default=ROOT / "beam-score-snapshot.json")
    p.add_argument("--output", type=Path, default=ROOT / "analysis-summary.json")
    p.add_argument("--selection", type=Path, default=ROOT / "confirmation-selection.json")
    p.add_argument("--capture-beam", action="store_true")
    p.add_argument("--self-test", action="store_true")
    args = p.parse_args()
    if args.self_test:
        self_test()
    elif args.capture_beam:
        capture_beam(args)
    else:
        analyze(args)


if __name__ == "__main__":
    main()
