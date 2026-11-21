## Context

Baseline for this round: the published model, round 52 (adopted and published 2026-11-20, rebuilt on the faster simulator 2026-11-21 with every number identical). Simulator fingerprint 6b886c8f52ee07397773ddd0ebbcb447, network 53c823f20d9165ed, demand config 2405ff02c92b2837 (it contains `countFit.gatePriorTotals` with scope `outsideStudyArea` and `countFit.throughTargets.simulatedMembership` with `throughTargets`, `shares` and `routeWeightPerBlock`), demand 2d16d8f8eb0950ca, cross-validation demand 1c3b1666f24156f1, membership files 56e688e7e5749d23 (shipped) and cf32e3e0d9e6f23e (training) in `target/membership/` and in R2 under `demand/membership/`. Ten seeds: PM fitted 81 of 92, PM held out 14 of 24, AM fitted 72 of 77, AM held out 15 of 19, D5 4 of 4, whole-street 8 of 8, D16 holds, validation 67 of 74. Fresh seeds 11 to 20: 82, 14, 74, 16, D5 4 of 4, whole-street 8 of 8. The demand build now stops when a membership file is present with mismatching evidence.

PM Colby Street southbound is the weakest line: the model sends about 75 cars an hour the whole street against 39 counted (GEH 4.7; 67 on seeds 11 to 20).

What the count says (checked in this round, `data/calibration/rockridge.volunteer-count-2025-02-25.json`, `routeDiagrams`, and `data/calibration/rockridge.targets.json`):

- Colby Street SB, PM: of 139 cars entering at the top, 39 drove the whole street, 57 turned off at cross streets and 43 ended their trip along the street (`destinationAlongRoute`, the diagram's `midBlockLeaving`; 139 = 39 + 57 + 43). The cross streets take 3 to 17 cars each, below `volunteerCount.minMovementVeh` 25, so none is a station. The 43 is in the targets file as `endAlongVehPerHour` and nothing fits it.
- The published PM demand has car trip ends (origins and destinations, veh/h) at the Colby Street interior nodes: destinations 819: 0.7, 1071: 0.7, 793: 5.0, 786: 1.3, 1070: 3.1, 799: 12.4, 828: 29.1 (52 in all, mostly McAuley Street at 828); origins 819: 17.3, 1071: 8.5, 793: 1.3. So the fit fills the seven block counts (139 to 170 cars an hour each) with end-to-end cars.
- The controls along Colby Street match OpenStreetMap and the imagery audit, so the network is not the cause.

The end-along targets in the targets file, all from `routeDiagrams.tableTotals.destinationAlongRoute`: Hillegass Avenue NB (PM 15, AM 9), Colby Street NB (PM 29, AM 14), Hillegass Avenue SB (PM 40, AM 9), Colby Street SB (PM 43, AM 15). Eight figures, none for midday. The count has one more run with the field (Martin Street toward Telegraph Avenue, AM, 3), which is not a select-link run and is not used. One table does not add up: Hillegass Avenue SB PM lists 178 entering, 31 turned off, 40 ended along and 79 whole street, and the diagram sum of the turn-offs is 59 (178 = 59 + 40 + 79), recorded in the file's reconciliation note; the end-along figure 40 is not affected.

## Revision of 2026-11-21 (D8): why seeding was added

The first version of this change (constraint only) was wiring-checked in the container before any laptop run (the table under "First version" below). It could not work: in PM the pairs that use Colby Street SB and end at an interior node carry 0.3 cars an hour against 43 counted (Hillegass Avenue SB 1.7 against 40), and the northbound runs start far above their figures (Colby Street NB 101 against 29, Hillegass Avenue NB 83 against 15). The fit scales pairs that exist, so the southbound figures stayed unmet and the Colby Street SB whole-street fit stayed at 56 with and without the constraint. The lead asked for option 2 of that finding, seeding the missing pairs, on the same change and branch. The round keeps its number because nothing ran on the laptop. The cause is structural zeros: the fit moves pairs by multiplicative updates, so a pair absent from the seed table stays absent however large the shortfall, and the first design had no pair that could carry the southbound end-along cars. P12 says why no citation is given for that.

### Diagnosis: why the seed table has almost no trips from the Alcatraz side ending along Colby Street or Hillegass Avenue

Read from the shipped-view seed table of the published PM demand (before the fit, after thinning, the `FIT_DUMP` table of the wiring-check build) and from a pre-thinning dump of the same build (an instrumented copy of the build, not committed). Cars an hour; interior nodes are Colby Street 786, 793, 799, 819, 828, 1070, 1071 and Hillegass Avenue 1085, 1086, 1090.

| PM, seed inbound to the interior nodes by origin | Before thinning | After thinning |
| --- | --- | --- |
| Colby Street: freeway gates (ramp flows) | 118.3 | 120.9 |
| Colby Street: surface gates | 8.6 | 7.1 |
| Colby Street: interior origins | 4.3 | 1.4 |
| Colby Street: all, pairs | 131.2, 8,259 | 129.4, 28 |
| Hillegass Avenue: freeway gates / surface gates / interior | 99.0 / 9.3 / 5.2 | 101.2 / 7.6 / 8.3 |
| Colby Street: from the 50 northern surface gates (north of Alcatraz Avenue, off the motorway) | 3.2 | 3.6 |
| Hillegass Avenue: from the northern surface gates | not read | 0.0 |

- (i) Gate sector weights. Not the cause. The non-ramp trips that end at these nodes total 13 an hour before any weighting: the nodes' own block trip generation (LODES trips times the external share) is small, and the sector weights only decide from which gate those 13 come (3.2 from the northern surface gates, led by 1717, 1548 and 943 at 0.6 or less). The 118 an hour that make up most of the inbound volume are freeway ramp flows placed on the blocks by the ramp water-filling (gates 602, 1719, 1672), not sector weights.
- (ii) `maxLocalShareOfGate` (0.5). Not the cause. It caps a gate's local trips at half its target (hundreds of veh/h); these pairs are 0.1 to 0.6 an hour each.
- (iii) Thinning. Not the cause of the shortfall. It cuts 8,259 pairs to 28 for Colby Street, but the iterative proportional fitting that follows restores every node's destination total (131.2 before, 129.4 after) and every gate's origin total. It changes which pairs exist, not how much arrives.
- (iv) Routing by another street. Part of it, for the pairs that exist. Of the 129 an hour after thinning, the static assignment puts 2.0 on Colby Street SB's first block (4.7 on any link of the run) and 78.4 on the first block of Colby Street NB (88.5 on any link); the simulated pairs of the published pool put 0.0 on the SB run (any link) and 99.8 on the NB run. The 118 ramp cars arrive from the south. Of the 3.6 an hour from the northern surface gates, 0.8 use the SB first block, 1.1 any SB link and 0.0 (simulated). The block export carries only trips that used any link of a run, so the simulated figure for the first block alone is not available.
- (v) The node rule. Not the cause: it only separates the first block (2.0) from any link of the run (4.7).

Answer: the pairs are absent, not rerouted. The table has 3.6 an hour from the northern surface gates to the Colby Street interior nodes and nothing to the Hillegass Avenue ones, against 43 and 40 counted, and the inbound it does have arrives from the south. Seeding therefore helps. Its candidate pairs are chosen among those whose own static routes enter by the first block, so (iv) cannot defeat the pairs it adds. The coordinator's rule to stop and report if the cause were (iv) or (v) did not fire.

## Decisions

D1 to D8 are the lead's, written on 2026-11-21 before any run. Preparation choices follow as P1 to P6 and are marked as such.

D1. (Lead.) No simulator change (fingerprint stays 6b886c8f52ee07397773ddd0ebbcb447). No change to the stations file or the frozen split (`data/demand/rockridge.split.json`): the new targets are fit constraints built inside the fit, like the route shares, not stations.

D2. (Lead.) New fit target "ended along the street". For every `selectLink` run in the targets file that lists `endAlongVehPerHour` for a period, a constraint: the sum over origin-destination pairs whose destination is a node of the run other than its first node of flow times the pair's share of trips that hit a link of the run equals `endAlongVehPerHour`. Membership from the simulated `blocks` export (`calibrate --select-od`, the pooled per-run pairs the loop keeps for the shares since round 51) with the same `priorTrips` 5 shrinkage toward the static-route fraction. Behind a sub-switch of `simulatedMembership`, `"endAlong": true`, plus a weight `countFit.endAlong.weight`, candidate value 2 (ASSUMPTION: the weight of the ramp counts; the figure is a count over one PM or AM peak hour by volunteers). Absent switch: published behavior byte-identical. What it pins: with the top block, the whole-street count and the end-along count all fitted, the turn-offs are pinned too (139 = 39 + 57 + 43 on Colby Street SB PM).

D3. (Lead.) Views. The end-along figures describe the whole street between its ends, like the route stations, which the frozen split withholds from the training view because held blocks lie on them. Same rule: the shipped view only; the training (cross-validation) build never sees them where a held block lies on the run. The split is not edited.

D4. (Lead.) One candidate, `end-along.json`: the published config plus the sub-switch, the weight and (D8) `seedPairs`. `apply-candidate.py` edits the committed config, which already has the round 52 entries; it prints the new config hash (19b6d2c3957f4f56). The laptop restores the committed config after the run. The loop (three passes), the screen, ten seeds, then automatically the fresh-seed confirmation.

D5. (Lead.) Keep rule, re-based on the published model: a candidate is adopted only if none is worse than the baseline. PM fitted at least 81 of 92, PM held out at least 14 of 24, AM fitted at least 72 of 77, AM held out at least 15 of 19, D5 4 of 4, whole-street 8 of 8, D16 holds in every period, validation 67 of 74. Screen as round 52 (three seeds; each count no more than 3 below the baseline's own screen; no car cleared from gridlock in the judged zone; backlog under 2% in 3 of 3 seeds, AM and PM). Fresh-seed confirmation on seeds 11 to 20 against the baseline on the same seeds, no worse on every line. New improvement test, written before any run, because passing the keep rule alone would only show "no worse": the round is worth adopting only if PM Colby Street SB whole-street traversals fall by at least 15 cars an hour against the baseline on both seed sets (baseline 75 and 67; counted 39). The threshold is an ASSUMPTION, about four standard errors of the ten-seed mean (se 3.4 to 4.4). Adoption remains the project lead's decision.

D6. (Lead.) Reported, not conditions: round 52's lists; for each run with an end-along target the target, the fit value per pass (static-route and simulated-membership versions) and the simulated ten-seed figure computed from the per-seed `blocks` (trips that hit the run and end at the run's nodes); trip ends at the Colby Street and Hillegass Avenue interior nodes, static against final; the four whole-street values; the Colby Street SB blocks; the shares including "to Forest Street" and "from Alcatraz"; offered demand against the static fit.

D7. (Lead.) Laptop runbook modeled on round 52's, with the published `target/membership` files moved aside and restored afterwards (the build now stops on mismatched evidence, and the published files are needed to rebuild the baseline), the restore verifying demand 2d16d8f8eb0950ca and cross-validation demand 1c3b1666f24156f1; evidence under `openspec/changes/calibration-round-53/evidence/`; development branch `salvatoret/peaceful-fermi-dlwt0u` by merging `origin/calibration-round-53`; the never-list (nothing to main, no `data:push`, no `/api/` requests, no upload token, no secrets in messages, no edit to `data/areas/rockridge.json`, no `--publish`); expected times from the laptop's measured ones on the faster simulator.

D8. (Lead.) No new reference from memory; ASSUMPTION labels as in rounds 48 to 52.

D9. (Lead, 2026-11-21, after the wiring check.) Seeding, behind a new switch `countFit.endAlong.seedPairs` (absent: the build without seeding; it needs the end-along sub-switch). For each end-along run whose static-route end-along flow in the seed table is under its target, add pairs from origin to interior node so that the run's flow starts at the target (shortfall = target minus existing). Origins: the origins of the pairs that the membership (simulated when available, else static) puts on the run's first block, in proportion to their flow there, leaving out interior nodes of the run. Destinations: the run's interior nodes that are local destination nodes, in proportion to their existing seed destination volume (equal parts if all are zero). Only routable pairs whose static route enters by the first block are kept, and the weights are renormalized. The added volume is taken from the other inbound pairs of the same node, pro rata, so each node's destination total in the seed is unchanged; a node with less to give caps the addition and the report says so. New pairs take static membership until a simulated run contains them. Shipped view only; the training view has no seeds and no constraint (checked below by diffing its periods against the published cross-validation demand). The origin and destination proportions are ASSUMPTIONS and the target figures are DATA. Fit report: one table per period with, for each run, the target, the seed flow before seeding, the added and capped volume, the offered flow after seeding and the final flow, and the destination totals of the affected nodes before and after.

P1. (Preparation choice.) The nodes that count are those strictly between the run's ends: the heads of the run's links that are also the tail of another link of the run (`interiorNodes`, `tools/lib/share-targets.ts`). Colby Street, both directions: 786, 793, 799, 819, 828, 1070, 1071 (run ends 853 at Alcatraz Avenue and 1069 at Claremont Avenue). Hillegass Avenue, both directions: 1085, 1086, 1090 (ends 1110 and 798). Why: the count's three categories partition the cars that enter at the top (turned off at a cross street, ended along the street, drove the whole street). The simulator counts a whole-street trip when a car has driven every link of the run in order, from the first link's start to the last link's stop line (`crates/sim/src/sim/corridor.rs`). A trip that ends at the run's last node has driven every link, so it is a whole-street candidate in the count's sense; counting it as end-along too would pull the two figures against each other. A trip cannot end at the first node and have used the run. Whether the simulator's whole-street observer sees a trip that ends at the last node was not checked here (no simulation); excluding the node keeps the categories apart either way. The lead's text allowed the last node; this is the choice to review. It is one line: `interiorNodes`.

P2. (Preparation choice.) Where the constraint lives in the fit: in the station-level set `counts`, so it enters both the count-only fit and the final fit (as the through targets and the whole-street route stations do), not only the second fit as the shares do. Flows that touch it count as counted for the median rule and the capacity guard's cut, like any other count. The report's "fitted stations within tolerance" does not count it.

P3. (Preparation choice.) "Static routes when no membership is in use (pass 0, midday)" is read narrowly. The constraint exists only in a period whose membership file carries block pairs (`blocks`), because pass 0 and the check "candidate entry with no membership file gives the periods of a static build" require it, and midday has no target. Inside such a period a run with no simulated trip takes static routes (its share is the static fraction of the flow's sampled routes that use a link of the run, the denominator of the select-link share) and the report says `static`. The static fit that anchors the ceilings has no membership, so it has no constraint. If the lead wants the static-route version in pass 0, the change is the gate `endOn` in `fitPeriod`, and pass 0 would then no longer reproduce the baseline periods.

P4. (Preparation choice.) The training-view test is the one the through targets use in `loadThrough`: a run is left out if any held block station of the frozen split (the `count block <link>` ids among the withheld stations) is one of the run's links. The split expresses the same relation from the other side in `withheldAggregates`: each aggregate station that covers a held block is listed with those blocks, and the route stations are withheld that way. Both give: all four runs have a held block on them (Hillegass Avenue NB 2674, Colby Street NB 2593 and 2601, Hillegass Avenue SB 2673, Colby Street SB 2594 and 2602), so the training view has no end-along constraint at all and its periods should equal the published cross-validation demand's. Consequence stated here because it matters for the verdict: the held-out rows of the keep rule (PM 14 of 24, AM 15 of 19) are scored on the cross-validation demand and cannot move; the fitted rows, the whole-street line and the improvement test carry the evidence.

P5. (Preparation choice.) The sub-switch needs `simulatedMembership.shares` true (the block pairs the constraint reads are the shares' pool) and `countFit.endAlong.weight` above 0; `countFit.endAlong` without the sub-switch stops the build. The weight is read once per build and applies to every run.

P6. (Preparation choice.) The loop checks that a shipped build from pass 1 has an `End along` line for every period it fits and stops otherwise, prints and records the lines (target, fit on the membership used and on static routes, after the count-only fit, offered, flows, nodes) and warns when a run took static routes. The report section and lines are written only when a constraint exists, so a build without the sub-switch writes the same report as before.

P7. (Preparation choice.) Seeding lives in `tools/lib/end-along-seed.ts` and runs in `tools/build-demand.ts` just before `fitPeriod`, in the shipped view and only in a period whose membership file carries block pairs (so pass 0, midday, the static anchor fit and the training view are untouched). It sizes the pairs with a free static assignment (the fit's `draws` and `dispersion`, one draw set, not the fit's successive-averages assignment), so its "before" figure (PM Colby Street SB 3.2) differs a little from the fit's own static figure for the same table (2.4 in the first version); the fit's offered figure after seeding is the one the fit uses and is reported beside it.

P8. (Preparation choice.) An origin's weight is the sum over its existing flows of the volume times the smaller of the pair's static first-block share and its membership on the run (simulated when the pooled file has trips on the run, else the static share). The block export has only trips that used any link of a run, so the first block alone cannot be read from simulated trips; the minimum keeps a pair from counting on the first block when either source says it does not use it. A candidate pair is kept when its static routes enter by the first block in at least half of the draws (ASSUMPTION, `SEED_FIRST_BLOCK_SHARE`).

P9. (Preparation choice.) The volume taken from a node's other inbound pairs is capped at 80% of it (ASSUMPTION, the cap the assumed-movement carve uses for a single flow; the lead's text said to cap at what the node has). The sizing allows for what the other pairs lose: they carry their own end-along share, so the added volume is the shortfall divided by the added pairs' yield minus the node's average share of the pairs it takes from (the net yield); where the net yield is not positive nothing is added.

P10. (Preparation choice.) A pair that seeding added and that is not in the pooled trips keeps its static membership in every membership call of the fit (station, route, share and end-along), through the `skip` argument of `measuredShare`; without that, "no simulated trip" reads as "never uses the run" and the new pair gets membership near zero. A pair that seeding added and that is in the pooled trips takes its simulated membership.

P11. (Preparation choice.) Timing. Pass 0 builds without a membership file, so it does not seed; the new pairs first appear in the demand of the pass 1 build and so in the pass 1 simulation (the coordinator's text said the pass 0 simulation; pass 0 has no seeds). The pool of passes 0 and 1 counts their trips from pass 1 only (`pooledMembership` weights trips by each set's own volume; tested). The loop stops if a shipped build from pass 1 has no `End along seed` line, and prints the lines.

P12. (Preparation choice.) References. `docs/references.md` has [VanZuylen1980], [Willumsen1981], [Bell1991], [Cascetta1993], [Marzano2008] and others on count-based matrix estimation; none is verified to say anything about structural zeros in a seed matrix under multiplicative updating (that a pair absent from the seed stays absent). No citation is added. The seeding, its proportions and its cap stay ASSUMPTIONS, the targets DATA.

## Checked in the container, second version (with seeding)

All builds ran in the container on 2026-11-21 with `--out-root`, so nothing under `data/` or `public/data/` changed. Simulator fingerprint 6b886c8f52ee07397773ddd0ebbcb447 (RAN). Candidate config hash 19b6d2c3957f4f56.

(a) Switch absent, config as committed (2405ff02c92b2837), published membership files in `target/membership/`, the code of this revision: shipped demand 2d16d8f8eb0950ca and cross-validation demand 1c3b1666f24156f1 reproduce.

(b) Candidate entry with seeding (config 19b6d2c3957f4f56 with the membership paths pointed at files that do not exist), shipped view: the `periods` arrays are JSON-equal to those of the static build of the committed config made before this revision (old code), so no seeding or constraint runs without a membership file (PM 27,612, AM 23,204, midday 16,221 car veh/h).

(c) Candidate entry with seeding and the published membership files, hand-stamped in a scratch copy only (a copy of the candidate config whose membership paths point at the stamped files; its hash, 78251525b7a7211b, is in the stamp; the stamped files were never in `target/membership/`, which still holds the published files, hash-checked afterwards: 56e688e7e5749d23 and cf32e3e0d9e6f23e). Both views built.

Training view: its `periods` are JSON-equal to the published cross-validation demand's. The file itself differs from 1c3b1666f24156f1 only in `build.config` (the config hash), as it must. All four runs are listed as left out and no run is seeded, so the held-out rows of the keep rule cannot move.

Shipped view, seeding table (cars an hour; "seed before" and "after" are static routes on the seed table, "offered" is the fit's own figure on the membership it uses, "final" the fit's result; nothing is capped):

| Run (period) | Target | Seed before | Added | Seed after | Fit offered | Final (static routes) | Pairs, origins |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Colby Street SB (PM) | 43 | 3.2 | 45.8 | 43.0 | 38.5 | 49.1 (49.2) | 99, 25 |
| Hillegass Avenue SB (PM) | 40 | 4.7 | 39.4 | 40.0 | 38.2 | 37.1 (37.7) | 36, 13 |
| Colby Street NB (PM) | 29 | 85.9 | 0 | 85.9 | 62.7 | 33.1 (22.8) | none |
| Hillegass Avenue NB (PM) | 15 | 84.0 | 0 | 84.0 | 53.3 | 18.7 (19.1) | none |
| Colby Street SB (AM) | 15 | 2.7 | 15.0 | 15.0 | 13.2 | 17.3 (18.3) | 622, 130 |
| Hillegass Avenue SB (AM) | 9 | 3.1 | 6.4 | 9.0 | 7.2 | 9.1 (9.7) | 56, 20 |
| Colby Street NB (AM) | 14 | 41.8 | 0 | 41.8 | 44.4 | 20.0 (22.5) | none |
| Hillegass Avenue NB (AM) | 9 | 69.3 | 0 | 69.3 | 62.4 | 10.6 (15.2) | none |

Every interior node's destination total is equal before and after seeding in all eight rows (the report lists them; PM Colby Street 786 13.0, 793 18.6, 799 31.0, 819 7.1, 828 20.0, 1070 25.2, 1071 6.7). The northbound runs are not seeded (already above their figures). Their offered figure fell, PM Colby Street NB from 101.0 to 62.7, because the exchange takes volume from the pairs that used them.

Does the static preview move the Colby Street SB whole street toward 39? Yes, by 7 cars an hour (PM, target 39, after the count-only fit / final):

| Station, final (target) | Published model (switch absent) | With seeding |
| --- | --- | --- |
| PM Colby Street SB whole street | 49 / 56 | 45 / 49 |
| PM Hillegass Avenue SB whole street (79) | 71 / 67 | 72 / 66 |
| PM Colby Street NB whole street (102) | 100 / 100 | 100 / 100 |
| PM Hillegass Avenue NB whole street (48) | 52 / 52 | 54 / 54 |
| AM Colby Street SB whole street (46) | 44 / 42 | 44 / 43 |
| AM Hillegass Avenue SB whole street (36) | 37 / 36 | 37 / 37 |
| AM Colby Street NB whole street (33) | 45 / 47 | 47 / 48 |
| AM Hillegass Avenue NB whole street (34) | 42 / 44 | 42 / 44 |
| PM Colby Street SB blocks, final (links 2594, 2600, 2592, 2598, 2596, 2602, 2606; counts 170, 162, 162, 160, 159, 156, 139) | 138, 119, 126, 98, 120, 121, 102 | 139, 148, 105, 124, 136, 152, 142 |
| PM Colby Street SB share to the freeway, final (45%) | 47% | 41% |
| PM car veh/h, final (static fit) | 24,759 (27,609) | 24,840 (27,739) |
| AM car veh/h, final (static fit) | 21,510 (23,202) | 21,508 (23,220) |
| Fitted stations within their tolerance after the fit, PM / AM | 169 of 343 / 147 of 278 | 184 of 343 / 148 of 278 |

Six of the seven PM Colby Street SB blocks end closer to their counts (link 2592 ends further). The whole-street fit figure is a static preview: the fit assigns by successive averages and the simulator's own route choice decides the ten-seed figure, which is 75 for the published model. Midday is identical to the published demand. The PM demand file offers 24,841 car veh/h against 24,760 (AM 21,509 against 21,511).

PM trip ends at the interior nodes, destinations, published against seeded (seed table before the fit in the diagnosis): 819 0.7 to 12.9, 1071 0.7 to 4.8, 793 5.0 to 8.1, 786 1.3 to 2.2, 1070 3.1 to 3.1, 799 12.4 to 16.9, 828 29.1 to 48.3 (Colby Street 52.3 to 96.3). All ten nodes: destinations 101.8 to 174.6, origins 140.7 to 129.6; AM destinations 139.2 to 120.4, origins 172.8 to 167.4. The fit grows the seeded pairs (PM node 828 from 20 in the seed table to 48), so the final demand has more local trips that end along Colby Street and Hillegass Avenue. The seeded PM table has 87 pairs into the Colby Street interior nodes that the published demand does not have (127 flows against 42), AM 168 (200 against 32).

The first version's PM Colby Street SB end-along figure was 0.2 final against 43; it is now 49.1.


## First version (no seeding), checked 2026-11-21 before the revision

All builds ran in the container on 2026-11-21 with `--out-root`, so nothing under `data/` or `public/data/` changed. Simulator fingerprint 6b886c8f52ee07397773ddd0ebbcb447 (RAN).

(a) Switch absent, config as committed (2405ff02c92b2837), published membership files in `target/membership/` (56e688e7e5749d23, cf32e3e0d9e6f23e): shipped demand 2d16d8f8eb0950ca and cross-validation demand 1c3b1666f24156f1. Both reproduce.

(b) Candidate entry (first version, config 35ba56ab82aa7070, with the membership paths pointed at files that do not exist), shipped view, against a build of the committed config with the same paths pointed away (static membership): the `periods` arrays are JSON-equal (PM 27,612, AM 23,204, midday 16,221 car veh/h), and the fit reports are identical apart from the config and file paths. The candidate's report has no end-along text and says "No simulated membership file".

(c) Candidate entry (first version) with the published membership files, hand-stamped for the candidate's config hash in a scratch copy (a wiring check; the stamped files were never in `target/membership/` for longer than the two builds, and the published files were put back and hash-checked). Both views built. The training view notes all four runs as left out (`end-along target <run>: its street run holds a held-out block; left out of the training view`) and has no end-along line, as P4 predicts. The shipped view has the eight constraints, all `simulated`.

| PM, published membership | Switch absent (published model) | Switch on (candidate) |
| --- | --- | --- |
| Colby Street SB end-along, target 43: offered / after fit / final | none | 0.3 / 0.2 / 0.2 (static routes 2.4 / 0.7 / 0.8), 13 flows, 86% of its flows at the upper bound |
| Colby Street NB end-along, target 29 | none | 101.0 / 31.4 / 33.8 (static routes 100.7 / 27.1 / 25.1) |
| Hillegass Avenue SB end-along, target 40 | none | 1.7 / 16.7 / 16.7 |
| Hillegass Avenue NB end-along, target 15 | none | 82.8 / 16.7 / 18.5 |
| Colby Street SB whole-street route station, target 39: after fit / final | 49 / 56 | 48 / 56 |
| Colby Street SB blocks, final (counts 139 to 170) | 98 to 138 | 98 to 139 |
| Hillegass Avenue SB whole street, final (79 counted) | 67 | 67 |
| Colby Street SB share to the freeway, final (target 45%) | 47% | 47% |
| Offered car demand, final (static fit 27,609) | 24,759 | 24,745 |
| Non-gate trip ends inside the study area, origins / destinations, static fit to final | 951 to 794 / 734 to 614 | 951 to 790 / 734 to 599 |

PM trip ends at the Colby Street interior nodes, destinations (published demand against the candidate's; the seed table before the fit in brackets): 819 0.7 to 2.1 (12.0), 1071 0.7 to 3.5 (9.6), 793 5.0 to 4.4 (18.6), 786 1.3 to 2.1 (13.0), 1070 3.1 to 2.5 (25.2), 799 12.4 to 8.6 (31.0), 828 29.1 to 18.9 (20.0); all ten nodes (with Hillegass Avenue 1085, 1086, 1090): destinations 101.8 to 84.4, origins 140.7 to 136.9. AM, same nodes: destinations 139.2 to 114.8, origins 172.8 to 168.0; AM end-along fits are close for Colby Street SB (target 15, final 12.8) and Hillegass Avenue SB (target 9, final 7.3) because the table offers 2.3 and 1.3 and scales them toward the figure, and above target for the NB runs (Colby 22.4 against 14, Hillegass 10.7 against 9). Offered AM demand 21,510 to 21,497.

Finding (the reason for the revision). The constraint does not do what it was meant to do on the southbound runs. In PM the pairs that use Colby Street SB and end at an interior node carry 0.3 cars an hour in the table, against 43 counted (Hillegass Avenue SB 1.7 against 40). The seed table has 130 an hour of destinations at the Colby Street interior nodes, but they come from the south or the cross streets, so their membership on the southbound run is near zero; the trips the count describes (from the Alcatraz Avenue side to a destination along the street) are not in the table. Scaling existing pairs cannot add them, so the southbound end-along figures stay unmet, the whole-street route figure and the Colby Street SB blocks do not move (56 and 98 to 139 either way), and the simulated Colby Street SB whole-street figure (75 in ten seeds) is not expected to fall by the 15 that the improvement test asks. The northbound runs have the opposite problem: the offered PM Colby Street NB figure is 101 cars an hour against 29 counted, so that constraint pulls interior destinations down (PM destinations at the Colby Street nodes fall from 52 to 42), the reverse of what the round wants.

The lead chose option 2 (seeding); see the revision above.

## What is not known

- Whether the simulator will route the seeded pairs as the static assignment does. Seeding keeps a candidate only when its static routes enter by the first block in at least half the draws; the simulator's route choice has its own noise and the pairs have no simulated trips until the pass 1 runs. The first pooled pass shows it: the end-along lines of pass 1 and 2 give the fit's figure on simulated membership against the static one.
- Whether the ten-seed simulated Colby Street SB whole-street figure falls by 15 (the improvement test). The static preview moves the fit from 56 to 49 against 39, a drop of 7 in the fit's own figure; the published model's fit figure (56) became 75 in the simulation, so the preview alone does not decide it.
- Whether seeded trip ends are plausible. They are an assumption about where the count's 43 cars begin (origins by their flow on the first block), not an observation. The count says the cars entered at the top and ended along the street; it does not say from where. The fit grows the seeded pairs (PM destination 828 from 20 in the seed table to 48 in the final demand).
- Whether more local ends along the street raise backlog or gridlock clearances in the judged zone, and whether the held-out rows are unaffected as designed (P4: the training view has no seeds and no constraint, so they cannot move).
- Whether the seeding's exchange (volume taken from the other inbound pairs, which are mostly freeway ramp flows) disturbs the ramp counts. The fit re-pulls them; the SR-24 ramp lists of the runbook show it.

## Risks

- The fit may grow the seeded pairs beyond what the count says (PM Colby Street SB end-along final 49.1 against 43), and the interior streets and cross streets near the ends of Colby Street and Hillegass Avenue take the extra load.
- The exchange lowers northbound end-along volume (PM Colby Street NB offered 101.0 before, 62.7 after) because it takes from the pairs that used the run. That moves the northbound runs toward their figures, which is intended, but it also moves volume off the ramp flows.
- The weight 2, the node rule, the first-block share of one half, the origin and destination proportions and the 80% cap are assumptions with no reference (P12).
- Seeded pairs enlarge the table by a few hundred pairs in AM (622 Colby Street SB pairs from 130 origins). The thinning cap of 8,000 flows is applied before seeding, so the table grows by that much.
- The loop has not run with the new report lines or with seeding. A mismatch stops the loop at the check. The training view's membership pool is built from runs of a demand that is the published cross-validation demand, so its membership file should equal the published training file apart from its config hash.

## Outcome

Ran on the project lead's laptop on 2026-11-21 from 1:24 to 3:11 PM Pacific (runbook steps A to F and I; evidence commit 93899cf on the dev branch salvatoret/peaceful-fermi-dlwt0u, run at 2fdd5f7). Simulator fingerprint 6b886c8f52ee07397773ddd0ebbcb447. The loop took 3,969 s, exited 0 and ran three passes plus the final builds. The stop rule and the abort did not fire. The report-only warning did: offered car demand in the final shipped PM build is 10.1% below the static fit (89.9%). Candidate config 19b6d2c3957f4f56, demand a009d7bb4722a7c9, cross-validation demand afbe8635af49dc7f, membership files 87b61668bfa7781d (shipped) and 196188c75964afa8 (training). The published model was restored and verified afterward (demand 2d16d8f8eb0950ca, cross-validation demand 1c3b1666f24156f1, config 2405ff02c92b2837).

The candidate passed the three-seed screen and failed one line of the ten-seed keep rule (D5): the headline shares. PM Hillegass Avenue SB to the freeway is 53.5% against 68 counted (baseline 60.0%), so 3 of 4 shares are within 10 points and the mean error is 6.2 (baseline 3.8). Every other line equals the baseline's: PM fitted 81 of 92, PM held out 14 of 24, AM fitted 72 of 77, AM held out 15 of 19, whole-street 8 of 8, D16 holds, validation 67 of 74.

The improvement test also failed, on seeds 1 to 10: PM Colby Street SB whole-street traversals fell from 74.5 to 62.6 cars an hour, a fall of 11.9 against the 15 required (counted 39). Because the keep rule failed, the fresh-seed confirmation and the proposal search did not run.

What the switches did. The simulated end-along figures moved to their targets in all eight run-periods (PM Colby Street SB 0.0 to 56.7 against 43, Hillegass Avenue SB 3.3 to 41.4 against 40, Hillegass Avenue NB 40.2 to 18.6 against 15, Colby Street NB 46.3 to 34.5 against 29). The seeded pairs end along the street, so none of them reaches the freeway. They raised the Hillegass Avenue SB block's trips from 197.1 to 219.9 cars an hour while the trips that went on to the freeway stayed at 118.0 and 118.1. The share fell because its denominator grew. The record entry has the numbers per pass.

Deviations on the laptop (none changed code or scripts: `git diff 88965b2 93899cf -- tools openspec/changes/calibration-round-53/scripts openspec/changes/calibration-round-53/runbook.md` is empty):

1. The morning's restamp loop folder was moved to `target/restamp52-loop`, because `target/r52-loop` already holds round 52's loop.
2. `pass0-check.txt` reads `false` for pass 0 against `demand.base*.json`. The runbook's comparison was written when the baseline was a static build; the baseline is now the published simulated-membership model, so pass 0 cannot equal it. Pass 0 equals the restamp's pass 0 (the static build of the committed config) in both views, and the final training demand's periods equal the published cross-validation demand's. Only the `build` stamp differs, which carries the config hash.
3. The baseline per-seed directories on the laptop are `target/assess-seeds/60` and `60-cv`, from the restamp's `assess --publish`.

The README also lists a `build-logs/` folder that is not in the commit; the final build figures are in `loop.txt`, `seeding.md` and the `fit/` reports.

Not adopted, and no user decision was involved: the keep rule failed. The published model stays round 52. Both switches (`endAlong` and `seedPairs`) are in the code and off in the committed config (hash 2405ff02c92b2837); the candidate exists only in `candidates/end-along.json`. The record entry in `data/calibration/rockridge.record.md` holds the full tables and the lead for round 54. The evidence is in this change's `evidence/` folder.
