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

## Implementation record

The implementing session started on 2026-11-17 from `2774adc`. The decisions below were made while applying the change. D9 was committed before any challenger ran on benchmark data.

### D5. What the implementation verified in the audit

The committed evidence passes its own hash check (17 artifacts). The frozen network, demand and areas files are byte-identical to the files `main` serves today (`6a8285d5…`, `bef51b68…`, `386731eb…`), so the audit's inputs are the current inputs. `git diff f8197de HEAD -- crates/` is empty. The audit's source revision already contained whole-street Slow Streets (`182d0d7`), the four objectives (`26e0170`), and the lowest-detour rule, the displacement drop and the all-car pictures (`b55bb56`). The audit therefore benchmarked the search as it is now. The displacement drop and the pictures act after the recheck, so they do not enter screening or the beam in either case.

Each numbered claim was checked against the evidence:

- Independent recount of `screen-results.projection.json`: 298 nonempty subsets, 58 conflicting, 240 legal, one access rejection (`[0,1,5]`), 239 simulated. The best screening score is 38.163 for `[1,7,9]`. Nine nondominated packages exist; the beam visited seven and missed `[3,11]` and `[6,9,11]`. It forwarded 13 finalists. The strongest missed package is `[2,4,5]` at 34.291, and its pair parents score 4.672, 10.231 and -0.315.
- `search_bench evidence` replays the current production beam on the frozen table. All four objective stages ask for the recorded packages in the recorded order (71, 71, 75 and 75 visited), the 13 finalists match, and 75 runs are charged.
- `search_bench spot` reran 19 of the audit's packages on today's build: the 12 singles, `[1,7,9]`, `[2,4,5]`, `[3,11]`, `[6,9,11]`, `[0,3,11]`, `[7,9]` and `[0,1,5]`, each at 20 minutes on seed 1 against the 20-minute baseline on seeds 1 to 3. Every reduction, adjusted harm, score and detour is bit-identical to the audit's. The full exhaustive rerun is part of the benchmark table (D9).
- The pruning record (`SearchState::trace`) gives the same three paths as the audit. Dana/North (index 3) is the only single that does not reduce through traffic, so it never enters the extension list; it reaches packages only as a repair move next to Colby/North. `[6,9]` loses the same-place comparison to `[7,9]` at depth 2, and 6 never returns because it lost the same comparison among singles. Singles 2 and 4 rank sixth and seventh by score, outside the beam width of 5, and single 5 loses the same-place comparison to 7.
- The confirmation file gives 24.3757 for `[1,7,9]` and 27.0743 for `[2,4,5]` on seeds 201 to 210. That reversal is between 20-minute screening and independent full-hour runs. The full-hour selection runs production would use (seeds 1 to 3) were never made for these packages; the benchmark table adds them (D9).

Two framing points from the request to implement differ from the record. The search did not change after the audit's revision, as shown above. The Dana omission did not cause the beam's misses in the finite benchmark, because the beam was given all twelve candidates. It is a separate loss in the production pipeline, measured in D7.

### D6. Benchmark runner

`crates/sim/src/explore/bench.rs` and the `search_bench` binary implement D1. A case file in `data/search-benchmark/` freezes the candidates (as interventions, decoded through the scenario-link round trip and adopted in file order), depth, period, baseline seeds, screening settings, full-hour selection runs, confirmation seeds, search settings, known packages and named candidate subsets.

The table phase checks access for every conflict-free package up to the depth and simulates each passing package once per run setting (minutes and seed). It keeps a compact summary of each run: through cars, rejection counters, completed inside trips, and all-car and through flow per harm block. Every finished run is appended to a checkpoint file, so an interrupted run continues where it stopped. One results file is written at the end, sorted, and does not depend on `--jobs`. Its identity names the case hash, the simulator fingerprint and the SHA-256 of each input. When the inputs differ from the case's frozen hashes, the file says so and the result is a separate, current-input result.

Searches are replayed against the table. `SearchState::replay` returns a package's row only when the search asks for it through `eval_batch`, and charges it as a live run would: access rejections are free, simulated packages cost one run each, and a budget truncates in the same order. Simulation is deterministic for a seed, so a replay is the live search. Three checks support that: on a synthetic network the table's evaluation equals `eval_screen` bit for bit and the replayed search asks for the same packages in the same order as the live one; on the audit's table the replay reproduces all recorded sequences; and the spot rerun above matches. A replay cannot see rows it did not ask for, which keeps the exhaustive reference out of search decisions.

With one seed, `eval_runs` is `eval_screen`. With several seeds it applies the recheck's rule: means over seeds, rejection on the means, harm from the mean increase against the baseline's seed spread. The full-hour selection score of a package uses the same rule on the full-hour seeds, which is the recheck's score for one period.

Known-package runs give every competitor the same known packages: those in `data/proposals/rockridge.seeds.json` (SHA-256 `e118f5a6…`) made only of the case's candidates. For the two Colby cases these are `[0,6]`, `[1,5]` and `[7,9]`; the second cluster has none, so it has only cold runs. The sub-package screening that known packages force is reported as `knownCharged`.

The search code gains no behavior. `Eval` is cloneable, `eval_screen` is public, `distinct_places` can report what it dropped, and the beam records its pruning decisions only when a trace is switched on (production leaves it off). The generator's location ranking moved into `ranked_locations` and `kept_locations` without changing its output. The engine and its fingerprint are untouched.

`npm run shard -- benchmark run|fetch` moves case results through the bucket with the same checks as the other kinds (D10).

### D7. Candidate coverage and the bypass supplement

`search_bench coverage` runs the case period's baseline on its first seed with select-link records, as the search does, and reports for every case candidate whether the production generator offers it and why not. On the PM baseline with 40 locations the generator offers 219 candidates at 113 ranked locations; the 40th kept location carries 66 through trips an hour.

| Candidate | Generated | Reason |
| --- | --- | --- |
| Dana/North filter (3) | no | Node 820 ranks 92nd with 25 through trips an hour |
| Dana/63rd filter (4) | no | Node 794 ranks 67th with 47 through trips an hour |
| Slow Dana (10) | no | Dana's busiest block carries 10% of the busiest block's through trips; the Slow Street rule needs 25% |

In the AM baseline the generator offers 218 candidates; Dana/North ranks 79th (cutoff 39 an hour), Dana/63rd is generated, and Dana's busiest block carries 13%. The published search ranks locations over all three periods together, so its own coverage can differ from these single-period figures.

`explore::bypass` takes, for each generated candidate that closes a movement, the legal bypass witnesses of `redistribution::analyze` [Wardrop1952; Peeta2001] whose free-flow cost exceeds the baseline path's by at most 90 seconds. The blocks and in-study junctions those paths pass are candidate locations, except where a generated candidate already acts. Each candidate keeps its six locations with the most closed movements routed through them (ties: cheaper bypass). Across candidates, locations on the bypasses of the most candidates come first, then the most closed movements, then the cheapest bypass, up to one supplementary location per hotspot location. The supplement offers only closure designs (block filter, junction filter, per-street filter, diagonal diverter) and keeps the Slow Street threshold. All four limits are ASSUMPTIONS, chosen to keep the supplement to about the size of the hotspot list, and the ranking uses legal connectivity only, never traffic volume.

On the PM baseline the supplement adds 38 candidates at 33 places (22 block filters, 12 junction filters, 4 diverters), all passing the access check alone. Among them are the whole-junction filters at Dana/North and Dana/63rd, both Dana blocks between 63rd and Alcatraz, and North Street between Colby and Dana. The Colby/North filter's own bypass list names Dana/North, Dana/63rd, both Dana blocks and node 827, which matches the route around a Colby closure via 63rd and Dana. Slow Dana stays out under the existing rule; enabling quiet Slow Streets would need a separate spec amendment.

With the first rule tried (each candidate's locations in path order, half as many locations), the Dana junctions were cut. The final rule was chosen before any scenario of the benchmark was scored.

`explore --bypass-locations N` and `--supplement delete|swap|coordinated|all` switch the supplement and the search moves on. Both are off by default; when used, the group's `settings.searchExtensions` records them.

### D8. Supplementary search moves

`explore::supplement` runs after the objective beams, through `eval_batch`, with an allowance of charged runs. Deletions take each forwarded finalist, in production finalist order, with one intervention removed. Swaps take every screened valid package, best score first, and replace one intervention with another design at the same place. Coordinated starts are candidate pairs where one candidate lies on a legal bypass of the other, cheapest bypass first, whatever their single scores. The first round interleaves the three queues, with coordinated pairs limited to half of their share. A second round, if the allowance remains, takes the rest of the deletion and swap queues and grows the best coordinated pairs by a candidate linked to either member. Conflicts, depth, access, objectives and the cache are the beam's own. ASSUMPTIONS: the orders and the split.

Synthetic fixtures cover each mechanism the audit found. Two singles that each worsen through traffic but work together are never paired by the beam and are reached by coordinated starts. A junction design that loses alone is never extended and returns through a swap, without both designs in one package. A pair inside a triple that the beam reached by a repair move is reached by a deletion. A ladder network shows a quiet parallel street getting supplementary closures, with the same result under other street names and shifted ids.

### D9. Frozen comparison protocol

Frozen in this commit, before any challenger ran on benchmark data. Changing any of it after results are seen makes the comparison exploratory.

Cases (`data/search-benchmark/`, SHA-256 prefixes at freezing):

| Case | Period | Candidates | Role | Known packages |
| --- | --- | --- | --- | --- |
| `colby-north-pm` (`816329f0`) | PM | The audit's twelve | Development: its misses shaped the challengers; reported, does not decide | `[0,6]`, `[1,5]`, `[7,9]` |
| `colby-north-am` (`dd2c9646`) | AM | The audit's twelve | Held out (period) | same |
| `second-cluster-pm` (`b198d681`) | PM | Twelve chosen by `select-cluster.py` around Ayala/Forest and Colby between McAuley and 61st | Held out (candidate set) | none |

All cases use depth 3, baseline seeds 1 to 3, beam width 5, 12 extension singles, 12 finalists, harm weight 0.1 and the four objectives in production order. These match the published search except its depth of 6. Screening settings: 20 minutes on seed 1 (the production setting and the primary setting), 20 minutes on seeds 1 to 3, 30 minutes on seed 1, and 60 minutes on seed 1. The full-hour selection reference is 60 minutes on seeds 1 to 3, the production recheck. Confirmation uses 60 minutes on seeds 301 to 310. Those seeds are unused: discovery uses 1 to 3, the assessment 1 to 10, the production confirmation 101 to 110 and the audit 201 to 210.

Methods, each replayed cold and, where the case has them, with known packages:

- `beam`: the production search. Its charged runs are B.
- `beam+X@extra`: the beam, then the supplement X with an allowance A = ceil(0.25 B). ASSUMPTION: the share. Labeled extra budget.
- `beam+X@equal`: the beam stopped after B - A charged runs, then X with A. Total at most B.
- `wide@equal`: the beam with width 7 and 16 extension singles, stopped at the charged runs of `beam+all@extra`: the equal-cost alternative to spending the allowance on the supplement.
- X is `delete`, `swap`, `coordinated` or `all`. Challenger variants run only at the primary setting; the other settings run only `beam`.

Ties: queues and beams follow the production orders above. Best packages break score ties by fewer changes, then the lexicographically smaller set. Nondominated sets and finalists use the production functions. An objective's best package on the full-hour runs is the highest score among eligible packages; for least detour, the lowest detour among packages reducing at least half the best reduction of all packages.

Measures per run: best screening score and its gap to the exhaustive best; exact nondominated packages visited and forwarded; finalists; for the forwarded shortlist, the best full-hour selection score and its gap to the best of all packages, whether each objective's full-hour best is in the shortlist, its reduction, adjusted harm, largest raw all-car increase and resident detour; access and run rejections; charged runs and simulated minutes. Per screening setting: Spearman rank correlation of screening and full-hour scores over all valid packages, top-5 and top-10 overlap, and the full-hour rank of the screening winner. Per named candidate subset: the best screening and full-hour packages inside it.

A search challenger X is adopted only if, at the primary setting, over the held-out cases and their cold and known runs:

1. In every run, X@extra's screening gap is at most the beam's plus 0.5, its full-hour gap at most the beam's plus 0.5, and it finds at least as many objective bests.
2. Summed over the runs, X@extra gains on the beam: mean forwarded nondominated recall up by at least 0.10, or two more objective bests found, or the summed full-hour gap lower by at least 1.0.
3. X@extra is no worse than `wide@equal` on summed recall, objective bests found and full-hour gap, and better on at least one.
4. X@equal's summed full-hour gap is at most the beam's plus 1.0.

Among passing challengers the one with the lowest summed full-hour gap is adopted, then higher recall, then the simpler of delete, swap, coordinated and all. The adopted form is X@extra (the deployable one); its allowance stays a quarter of the beam's runs.

A screening setting S replaces 20 minutes on one seed only if, on every held-out case with the cold beam: its full-hour gap is at most the primary's plus 0.5 and it finds at least as many objective bests; its Spearman correlation is at least the primary's minus 0.02; and its simulated minutes are at most 3.5 times the primary's. Summed over held-out cases it must lower the full-hour gap by at least 1.0 or find one more objective best. On the confirmation seeds, wherever S and the primary pick different full-hour bests from their shortlists, S's pick must score at least the primary's minus 0.5 in every such case and at least 0.5 more in one. If the picks never differ, nothing is gained and the default stays. The cheapest passing setting is adopted.

Confirmation shortlist per case, frozen by `search_bench confirm` before any confirmation run and never rewritten: the full-hour best of the cold shortlists of `beam` at every setting, of every `@extra` challenger and of `wide@equal` at the primary setting, and the full-hour best of all packages, deduplicated. Each is run with the baseline on seeds 301 to 310 at 60 minutes. The report keeps every outcome: the production score over those seeds, paired through-car and inside-trip-time changes against the baseline [NIST-Handbook], and the paired through-car difference against the first shortlisted package. Intervals are pointwise, the nonlinear score and the largest block increase get none, trip times cover completed trips only, and an interval that includes zero is unresolved, not equivalence.

If no challenger or setting passes, the production defaults stay, the diagnostics stay, and the negative result is recorded with its evidence. `decide()` in `bench.rs` encodes these rules; this text is the reference if they differ.

Expected cost: a case table is 65,130 simulated minutes for the Colby cases and 68,910 for the second cluster; confirmation adds about 4,000 per case. Measured here: 1.14 simulated minutes per CPU second on one core.

### D10. Where the benchmark runs

Tables and confirmations exceed what the shared four-core cloud machine should run, so they run on a 12-core machine with the commands in `data/search-benchmark/README.md`, directly or through `npm run shard -- benchmark run`. Analysis and decisions replay the tables and need no simulation, so they run anywhere. The shard kind uploads a case's results only after checking the simulator fingerprint, the network and demand hashes and the case hash against the job, and `benchmark fetch` repeats the checks and writes nothing when one fails.

### D11. Contracts reused

The confirmation report uses the paired Student t method of `proposal-evidence-integrity` (`paired-t-2`) unchanged, and the bypass supplement reads the legal movement graph and witnesses of `explain-traffic-redistribution` without changing them. Neither open change needs a different requirement from this one. Search-method provenance stays separate from the simulator's: benchmark files record their method version and source revision beside the fingerprint, and a production search that uses the experimental settings records them under `settings.searchExtensions`.
