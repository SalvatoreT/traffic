## Context

In the last full run the unconstrained search reached -49% through cars and the `charter` profile -90%. One unconstrained option with more interventions scored worse than a smaller one.

## Diagnosis

1. Candidate cap. Locations are ranked by baseline cut-through and the top 40 get candidates. The charter profile drops boundary locations first, so it gets 40 interior locations; the unconstrained list spends slots on busy boundary locations, so it lacks interior filters the charter run finds. On the reduced run the unconstrained list gained 23 candidates from the interior rule alone.
2. Greedy beam. The beam keeps 3 packages, screens on one seed and a short run, and stops when a level does not beat the best so far. A package that the charter search reached through a different order is not reachable again.
3. Selection. Options were non-dominated on reduction, harm and size, so a larger package with less harm could be listed with a lower reduction than a smaller one.

## Decisions

D1. A profile without the boundary limit keeps the top locations overall plus the top interior ones, so it offers every location a stricter profile offers (`generate_with`).

D2. Warm start. A proposals-file group with the same network and demand hashes lends its chosen search packages (decoded with a Rust port of the app's link decoder, `explore/decode.rs`). Packages the profile allows (type and boundary) and that pass the access check are screened first. Their interventions are matched to candidates or added as candidates. They run as a second beam beside the singles beam, so a strong large package does not push small ones out. They are always rechecked, beyond the finalist cap, because one-seed screening is noisy. A seed package is rechecked on the same runs as in its own group, so the looser group cannot score below the stricter one on the same inputs.

D3. `--profile a,b` and `--profile all` run profiles in order, stricter first, writing the file after each; each later run reads the file and so starts from the earlier groups. `--no-warm-start` turns it off.

D4. Option selection adds a Pareto-consistency pass: sorted by size, a package is kept only if no smaller kept package cuts through cars at least as much. The note says why.

D5. A decode failure (for example a one-way mark on a street that bends by more than 45 degrees, which the app also cannot place) skips that package with a line on stderr.

## Verification

Reduced search on the real network: PM only, seeds 1 and 2, beam 2, depth 3, 10 locations, expand 6, screening 10 min, recheck 20 min, 5 finalists, `--profile all`. Pilot group best option -51.8% through cars (3 interventions); unconstrained group best option -57.9% (4 interventions), with the pilot's two chosen packages rechecked in the unconstrained run. Both groups list options in increasing size and increasing reduction.
