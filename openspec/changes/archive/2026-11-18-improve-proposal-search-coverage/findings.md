# Proposal-search benchmark findings

The production beam found the highest screening score in a frozen local search space using 75 simulations, compared with 239 for exhaustive evaluation. It missed two of nine nondominated tradeoffs. A missed package scored higher than the screening winner in the subsequent full-hour confirmation: 27.07 versus 24.38. The difference came from a smaller displacement penalty; the difference in through traffic remained unresolved.

These are results from the uncalibrated model at source revision `f8197de0d6fc9d5bf02098c260cb73f4456d38fa`, tested on 2026-11-17. They concern the original `rockridge` network, with 1,762 nodes and 4,411 directed links. The later `rockridge-compact` experiment is outside this benchmark. The handoff is a proposal for future implementation; it does not change the search or select a street plan.

## Frozen protocol

[candidates.json](evidence/candidates.json) records the geographic selection rule, intervention definitions and protocol, frozen before scenario scores were inspected. The test used the full network and 12 candidate interventions, with packages of at most three changes. There are 298 nonempty subsets before conflict filtering; 58 conflict combinations leave 240 packages. The existing whole-package access check rejected one, so 239 packages required simulation.

Screening used PM peak, seed 1 and 20 minutes. Baseline spread used seeds 1–3; the harness also prepared the 60-minute baseline. The production beam used width 5, expansion limit 12, depth 3, all four objectives in production order, finalist cap 12 and harm weight 0.1. These are experimental settings and existing search assumptions, not calibrated behavioral parameters. The beam ran first on a fresh state. Its visited sets were frozen before exhaustive evaluation filled the remaining cache entries. No unseen exhaustive score entered the beam.

The benchmark called the existing `beam_search_in`, `eval_batch`, conflict/access checks, scoring, nondominated filtering and finalist selection. Known packages and warm starts were disabled. It therefore tests a cold search over a deliberately small candidate universe, rather than replaying the published full search, which can use known packages and more interventions. Exhaustive evaluation uses more computation and is a reference for finite-space quality, not an equal-budget competing optimizer.

Before confirmation results were read, the protocol selected the union of the highest core-score beam-visited package, the highest core-score exhaustive package and the highest core-score package the beam missed. The empty baseline was eligible at score zero; score ties used manifest-index order. Deduplication left two packages plus baseline. Confirmation used PM peak, 60 minutes, seeds 201–210: 30 simulations, with no reselection. [confirmation-selection.json](evidence/confirmation-selection.json) preserves the frozen choices and screening scores.

## Candidate identities

Indices below are zero-based and apply only to the frozen manifest. The two Colby/63rd locations are separate T-junctions about 59 meters apart. Matching their shared street names would collapse different interventions.

| Index | Stable ID | Intervention |
| --- | --- | --- |
| 0 | `filter-colby-north` | Full filter at Colby/North, node 819 |
| 1 | `filter-colby-63rd-west` | Full filter at western Colby/63rd junction toward Dana, node 793 |
| 2 | `filter-colby-63rd-east` | Full filter at eastern Colby/63rd junction toward Hillegass, node 1071 |
| 3 | `filter-dana-north` | Full filter at Dana/North, node 820 |
| 4 | `filter-dana-63rd` | Full filter at Dana/63rd, node 794 |
| 5 | `filter-hillegass-63rd` | Full filter at Hillegass/63rd, node 1090 |
| 6 | `filter-hillegass-only-63rd` | Filter Hillegass legs at 63rd, keeping 63rd connected |
| 7 | `diverter-hillegass-63rd-1` | Hillegass/63rd diagonal diverter, bearing 41 degrees |
| 8 | `diverter-hillegass-63rd-2` | Hillegass/63rd diagonal diverter, bearing 127 degrees |
| 9 | `slow-colby` | Colby Slow Street, 15 mph |
| 10 | `slow-dana` | Dana Slow Street, 15 mph |
| 11 | `slow-hillegass` | Hillegass Slow Street, 15 mph |

The manifest and [description.json](evidence/description.json) preserve exact links, leg IDs and canonical movement checks. The production candidate generator returned 219 choices under this baseline, but only nine of the 12 frozen candidates were present. All three Dana choices, indices 3, 4 and 10, were absent. This is a separate coverage issue: the restricted beam was explicitly given all 12, including those Dana choices, and still missed useful combinations.

## Screening result

| Quantity | Beam | Exhaustive reference |
| --- | ---: | ---: |
| Scenario simulations | 75 | 239 |
| Highest core score | 38.162999 | 38.162999 |
| Highest-scoring package | `[1,7,9]` | `[1,7,9]` |
| Exact nondominated packages found | 7 | 9 |

The beam saved about 69% of scenario simulations and forwarded 13 packages. The configured core finalist cap was 12; the union with objective-specific finalists can exceed that cap. The nondominated comparison uses the production dimensions: more through-traffic reduction, less adjusted harm and fewer interventions. It does not add resident detour as a fourth dimension. The two missed frontier packages are `[6,9,11]` and `[3,11]`; neither was selected for full-hour confirmation under the frozen rule. The strongest missed core-score package was `[2,4,5]`, with screening score 34.290566.

[analysis-summary.json](evidence/analysis-summary.json) records independent enumeration, score, frontier, coverage and tie-handling checks. [screen-results.projection.json](evidence/screen-results.projection.json) preserves all 240 evaluation records' numeric fields, block changes, visited sets and stage histories. Its omissions and source hash are explicit.

## Why the beam missed these packages

[search-path-analysis.json](evidence/search-path-analysis.json) records a replay of production control flow over the completed screening values. It matched all four recorded visited-set sequences, including their order. This replay explains the observed omissions; it does not test an alternative optimizer.

| Package | Observed exclusion path | Follow-up to test |
| --- | --- | --- |
| `[6,9,11]` | Pair `[6,9]` lost the same-location variant comparison to `[7,9]`. Retained parent `[9,11]` could add variant 7, but variant 6 was absent from its normal extensions and repair did not restore it. | Preserve or revisit different movement restrictions at the same junction. |
| `[3,11]` | Dana/North alone worsened through traffic by about 2.64%, excluding it from positive-single extensions. Singleton 3 was not retained; the repair rules did not add it to parent 11. Together they reduced through traffic by about 8.68%. | Reserve a bounded way to explore useful combinations whose individual members score poorly. |
| `[2,4,5]` | Singles 2 and 4 lost the initial width-five selection; 5 lost same-location selection to 7. None of the triple's three pair parents was visited. Its pair core scores were about 4.67, 10.23 and −0.32, compared with 34.29 for the triple. | Test coordinated path-family candidates and bounded exploration beyond retained single-parent lineages. |

Posthoc enumeration of immediate deletions from the 13 forwarded finalists requires just two unseen combinations here and recovers `[3,11]` by deleting 0 from `[0,3,11]`. The full add/delete/swap neighborhood adds 93 unseen combinations and recovers both missed frontier packages, but not `[2,4,5]`. Same-junction variant swaps over all visited packages add 78 unseen combinations and reach `[2,4,5]` and `[6,9,11]`. These counts use the completed finite oracle; they are not independent performance evidence for the proposed edits.

## Independent full-hour confirmation

Package `[1,7,9]`, the best beam and exhaustive screening result, filters the western Colby/63rd junction, adds the 41-degree Hillegass/63rd diverter and makes Colby a Slow Street. Package `[2,4,5]`, the strongest missed screening result, filters the eastern Colby/63rd junction, Dana/63rd and Hillegass/63rd.

| PM metric, ten seeds | Baseline | Screening winner `[1,7,9]` | Strongest missed `[2,4,5]` |
| --- | ---: | ---: | ---: |
| Through cars/hour | 830.9 | 570.5 | 579.6 |
| Through reduction | 0% | 31.34% | 30.24% |
| Core score | 0 | 24.3757 | 27.0743 |
| Largest raw side-street increase, cars/hour | 0 | 97.3 | 57.6 |
| Adjusted harm, cars/hour | 0 | 69.6386 | 31.7 |
| Completed local-trip mean time change, seconds | 0 | +1.3728 | +0.1714 |
| Mean gridlock removals | 1.2 | 1.7 | 1.8 |
| Mean end-of-run entry backlog | 157.2 | 160.5 | 187.0 |

Scores are computed from the ten-run summaries using the production scoring rule, not by averaging per-seed scores. No confidence interval is assigned to the nonlinear score or maximum. The missed package's higher score is a descriptive reversal between these two selected packages, not a full-hour optimum across all 240 combinations.

Both largest raw increases occur on Martin between Claremont and Ayala: 270.8 cars/hour at baseline, 368.1 for the screening winner and 328.4 for the missed package. The missed-minus-winner through difference is +9.1 cars/hour, with paired 95% interval [−22.3, +40.5]; the difference remains unresolved, and the interval does not establish equivalence. The local-trip-time difference is −1.2014 seconds, interval [−3.6479, +1.2452], also unresolved. These time averages cover completed local trips, so they exclude unfinished trips.

The missed package does not improve every street. Relative to the screening winner, it carries 14.1 fewer cars/hour on 63rd between Colby and Dana and 78.3 fewer on Dana between 63rd and North, but 26.3 more on Dana between North and Alcatraz. Its Martin flow is 39.7 cars/hour lower, with pointwise interval [−62.3, −17.1]. Block intervals are not adjusted for inspecting multiple blocks or selecting the worst block.

All 30 runs completed. Neither package failed the production rejection rules; no invalid interventions or unroutable requests were reported. Both still had backlog and gridlock removals. Passing those rules does not validate the simulation against observed traffic. An independent verification recomputed 5,906 scalar comparisons from original checkpoints, checked all 30 run identities and the frozen hashes, and passed. [confirmation-results.json](evidence/confirmation-results.json) preserves the complete aggregate JSON, including its per-seed block flows and metrics, with whitespace compacted only.

The selected scenario fragments are preserved verbatim for reopening against matching inputs:

```text
#v1;a=rockridge;p=pm_peak;s=mn,9q9p3fprdr~dd,9q9p642ut2,41~ss,9q9p3cx9rf
#v1;a=rockridge;p=pm_peak;s=mn,9q9p3fr6b9~mn,9q9p3fnqdk~mn,9q9p642ut2
```

## Implementation priorities and limits

Start with candidate coverage, junction-variant retention and bounded deletion/swap checks. Compare each change against the current beam under the same simulation budget. Keep the exhaustive reference separate from that budget competition. Test both cold and known-package starts, preserve all rejection and demand-accounting results, and predeclare the next confirmation shortlist and unused seeds. The 201–210 outcomes have now informed these recommendations and cannot serve as untouched confirmation of the revised search.

The full-hour reversal also warrants testing screening fidelity: compare ranking stability under longer horizons or additional screening seeds before spending more effort optimizing a short-run surrogate. No revised screening schedule, graph-based generator, evolutionary optimizer or edited beam was run in this experiment.

This single-period, restricted-space benchmark cannot establish global search optimality, the quality of the published full search, transferability to another network extent, or real-world effects. Seed intervals hold demand, network and behavior fixed; they exclude uncertainty in calibration, model form and observed day-to-day traffic. [evidence/README.md](evidence/README.md) explains the committed artifacts, original hashes and requirements for an independent rerun.
