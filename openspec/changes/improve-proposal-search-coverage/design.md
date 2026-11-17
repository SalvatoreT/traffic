## Context

On 2026-11-17 the user asked to test proposal search, then to land the findings as an OpenSpec change for another session. The completed experiment used source `f8197de0d6fc9d5bf02098c260cb73f4456d38fa`, the full Rockridge network with 1,762 nodes and 4,411 directed links, and the input hashes in [evidence/frozen-inputs.json](evidence/frozen-inputs.json). Implementation remains future work. This change stays open after the handoff commit.

The repository was synchronized to `12868ab` before preparing the handoff. That revision includes a separate compact-area experiment; `crates/sim` and the current proposal specification are unchanged from the benchmark revision. The benchmark's network and demand identities remain unchanged; its numbers must not be relabeled as compact-area results or current results after an input change.

## Findings that motivate the work

[findings.md](findings.md) and its evidence files record the protocol, results, provenance, and limits. The main results are:

| Finding | Interpretation |
| --- | --- |
| The beam found the exact best screening score, 38.163, using 75 scenario simulations versus 239 for exhaustive evaluation | The existing search was efficient in this finite space; exhaustive evaluation was a quality reference with a larger budget |
| Seven of nine exact nondominated screening packages were visited | Best-score agreement does not establish coverage of useful tradeoffs; these dimensions were through reduction, adjusted harm, and number of changes |
| The standard generator returned 219 candidates but omitted all three Dana choices in the frozen manifest | Candidate generation needs its own coverage audit, separate from package search |
| Full-hour confirmation scored the beam's screening winner at 24.38 and the strongest missed package at 27.07 | Short-run ordering did not hold for these two packages; this does not identify the best full-hour package in the finite space |

The missed package carried 9.1 more through cars/hour, with a paired 95% interval from -22.3 to +40.5, so the through difference is unresolved. Its largest measured side-street increase was +57.6 cars/hour, versus +97.3 for the beam's choice, both on Martin between Claremont and Ayala. Dana between North and Alcatraz carried 26.3 more cars/hour under the missed package. These comparisons do not support a claim that it improves every street. Scores use ten-seed summaries, have no score confidence interval, and retain the project's existing adjusted-harm assumptions.

The experiment was a cold search over 12 candidates with at most three interventions. It did not load known packages or replay the published search over its full candidate universe and depth. It used the actual production beam, evaluator, conflict/access checks, objective order, and finalist functions. Exact exhaustive evaluation followed the beam run; it could not inform the recorded beam decisions. Confirmation used a shortlist frozen from screening results and PM seeds 201 through 210. All settings are experiment choices, not empirical claims about driver behavior.

### Pruning mechanisms established by replay

Candidate indices refer to [evidence/candidates.json](evidence/candidates.json). The exact control-flow replay matched all four objective-specific visited sequences, including order.

- `[3,11]`, the Dana/North filter with Slow Hillegass, was a missed nondominated package. Dana/North worsened through traffic alone, so it was excluded from ordinary positive-single extensions. It did not survive the initial beam, and repair moves did not recover it.
- `[6,9,11]`, a partial Hillegass/63rd filter with Slow Colby and Slow Hillegass, was another missed tradeoff. The partial filter lost to a competing intervention at the same junction. A surviving parent could add the winning variant, but did not reconsider this one.
- `[2,4,5]`, filters at eastern Colby/63rd, Dana/63rd, and Hillegass/63rd, was the strongest missed screening package and the higher-scoring confirmation package. Its singles lost the beam-width or same-place selection, and none of its pair parents formed.

The first two mechanisms arise in `beam_search_in` and `distinct_places` in `crates/sim/src/explore/search.rs`. The third also depends on width and the candidate ordering. The current repair rule is useful but did not cover these cases. Later tests must retain the distinction between a package never generated, never simulated, simulated then pruned, and simulated but not forwarded as a finalist.

## Decisions

### D1. Keep an exact finite reference and separate search from model validation

Promote the experiment into a runnable benchmark that imports the production evaluator and constraints. Freeze candidate identities, source and method versions, network/demand hashes, periods, seeds, horizons, objective order, budgets, and known-package inputs before scoring. Enumerate every subset up to the declared depth, retain each rejection reason, and preserve both visited packages and forwarded finalists. Run each search with isolated state, then use exhaustive results only to measure the missed score and tradeoffs.

A cold run measures discovery without previous solutions. A separate run with known packages measures the deployed workflow. Give every competing search the same known packages in that comparison and count the mandatory rechecks separately; preserve the existing known-package retention contract.

Use the frozen full network for historical reproduction. Do not crop the network to save benchmark time. A compact network, changed demand, or different model is a separately identified experiment. Reproducing the recorded numbers requires the frozen inputs, not a download assumed to be unchanged.

Alternative considered: compare only the published winners. That cannot distinguish candidate omission from pruning and gives no exact quality reference. Exhaustive evaluation of the full production universe is too expensive; the finite reference has an explicit limited scope.

### D2. Audit bypass coverage before changing the optimizer

Record baseline-generator inclusion for every benchmark candidate by canonical effective intervention, then identify why an absent candidate was excluded. Use the existing legal movement graph to generate a bounded supplement of closure candidates along bypasses affected by candidate packages. Store the path or connectivity evidence behind each supplement, apply current intervention/profile/access rules, and deduplicate by effective intervention.

A legal bypass warrants consideration; it does not establish its future traffic volume. Keep unweighted legal connectivity separate from any demand-weighted prioritization. The implementation must use generic graph/data rules and test them on a synthetic network whose street names and IDs differ from Rockridge.

The current Slow Street specification requires a baseline-through threshold. This change does not silently relax it. The first supplement can use already-allowed closure types. If experiments justify adding quiet Slow Streets, explicitly amend that existing requirement and document the new assumption before enabling them in production.

Alternative considered: add the three missing Dana interventions as hard-coded candidates. That would fit one observed omission and fail the requirement that study areas are data. A minimum cut alone also cannot rank traffic displacement or resident access costs; graph candidates still require simulation and access checks.

### D3. Add bounded exploration around the beam and measure its cost

Test a supplementary search phase with an explicit evaluation allowance. It should be able to revisit alternative designs at a junction and consider coordinated packages containing weak or negative single interventions. Candidate methods include deletion/replacement moves, a limited set of alternative junction designs, and graph-generated coordinated starts. Keep cache keys, conflict checks, legal access, objective restrictions, and depth limits shared with the existing search.

The first inexpensive diagnostic is deletion of a finalist's interventions. In the completed table, deleting one intervention from each of the 13 forwarded finalists adds only two unseen packages and recovers `[3,11]`. Broader local-edit and same-junction neighborhoods recover other missed packages at greater cost. Those are post hoc membership checks against the exhaustive table. No modified optimizer was run, and no improvement at equal budget has been established.

Before scoring a follow-up, declare how evaluation budget is split between the original beam and supplementary moves, how ties and revisits are handled, and which quality/cost thresholds will decide adoption. Compare against the unchanged beam at the same total charged budget. Also report an extra-budget comparison if useful, labeled separately. Count total simulation work when screening horizons differ, not only package count.

Use synthetic regression fixtures for complementary weak singles and competing junction variants. The recorded Rockridge misses are diagnostic cases, not packages the implementation must publish. Test other frozen candidate sets or periods before choosing defaults.

Alternative considered: replace the beam with NSGA-II immediately. The beam already found the best screening score with substantially fewer calls. The evidence supports testing specific omissions before accepting the tuning and runtime cost of a replacement. An evolutionary challenger remains an optional later experiment under the same protocol.

### D4. Measure screening fidelity and preserve confirmation separation

Compare short screening with a declared alternative such as a longer horizon or additional screening seeds. Measure whether the eventual shortlist retains packages that perform well in full-hour selection runs, along with simulation cost and rank changes. Hold model inputs fixed for this comparison so a demand or extent change does not masquerade as a search improvement. Record the effect of each experimental change separately before combining them.

Freeze the comparative shortlist before unused confirmation seeds are read, retain every confirmation outcome, and report paired differences under the existing `proposal-evidence-integrity` contract. A confirmation-dependent revision needs fresh confirmation seeds or an exploratory label. The current ten-seed schedule is a recorded experiment choice, not a guarantee of precision [WebTAG-M3.1; TfL-TMG4].

Reuse the existing paired t method and its assumptions [NIST-Handbook], including its fixed-model scope. Keep the raw maximum distinct from the adjusted penalty, state that selected-block intervals are pointwise, and do not infer equivalence from an interval that includes zero. The completed experiment did not calculate uncertainty for the nonlinear score or establish a full-hour finite-space optimum.

Alternative considered: increase beam width alone. That may reduce pruning, but it does not establish that the short-run objective orders the resulting finalists reliably. Search coverage and screening fidelity need separate measurements.

## Compatibility and implementation order

Start with the portable benchmark and diagnostics. Add candidate supplementation behind an experimental option, then evaluate supplementary search moves and screening settings independently. Preserve the four named objectives, existing known-package behavior, canonical scenario round trips, and current proposal evidence schema unless a new field requires a version change. Candidate and search changes are not a reason to alter the simulation fingerprint's scope; record their own source/method identity.

`proposal-evidence-integrity` owns paired estimates and confirmation provenance. `explain-traffic-redistribution` owns legal movement and traced redistribution semantics. Reuse their implementations and reconcile their open spec deltas when this change is applied. `compact-model-extent` owns the alternative network extent; rerun a separately identified benchmark if that extent becomes the production input.

Acceptance requires verified enumeration and deterministic replay, meaningful regression fixtures for the observed mechanisms, and a preregistered equal-budget comparison against the current beam. Any adopted method must satisfy the declared quality/runtime criteria and report failures and unresolved comparisons. If no challenger meets them, retain the current search, keep the diagnostics, and record the negative result. Archive only after implementation, required checks, and the adoption decision are complete.
