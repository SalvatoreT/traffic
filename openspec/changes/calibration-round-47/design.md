## Context

Baseline for this round: the published model of 2026-11-18, unchanged by round 45, with round 46's `rampK` rule present in the code and off. Network 53c823f20d9165ed, demand 9cdebdabf05c4460, training demand 2f9ae152b9bbf78e, simulator fingerprint d45a275dd7be0713cec6a64394b7d8a9. Ten seeds per period: PM fitted 74 of 92 recent stations within GEH 5, PM held out 14 of 24, AM fitted 70 of 77, AM held out 14 of 19, D5 4 of 4, whole-street traversals 8 of 8, D16 holds, validation 67 of 74.

The finding. One Caltrans ramp row, WB ON FR CALDECOTT LANE (1,350 ADT in 2024, postmile R5.584), is shared by two network on-ramps, nodes 1695 (link 4080) and 1711 (link 4058). `matchRampVolumes` gives each ramp half the row, and `buildStations` makes one station per ramp: `ramp on 1695` and `ramp on 1711`, 61 veh/h each in the PM peak (52 each in the AM, derived). A turn ban sends the flow to one of them. The split target is therefore unmeetable on one ramp and too low on the other. In the audit's seed-1 run, `ramp on 1695` carries 103 and `ramp on 1711` carries 151 against 61 each. The static fit shows the same thing: PM final 61 and 103 against 61 and 61, total 164 against a row total of 122. The row is one observation; its honest target is its sum.

Round 46's design D9 left this out because the fit then needs a station whose target constrains the sum of flows over several links.

## Decisions

D1. Lead decision, 2026-11-19: round 47 is the Caldecott Lane pair-sum station. The project lead decides adoption after the results. It is independent of round 46: with that round's `rampK` rule on or off, the merged target is the sum of the member targets at whatever K the build uses.

D2. The station family. A config entry `countFit.linkGroups` is a list of `{stations: [id, ...], id?, _note?}`. `tools/lib/link-groups.ts` replaces the member stations by one station: `links` and `detectors` are the members' in order, the target of every period is the sum of the member targets, the weight is the larger member weight, `records` and `observations` are the members' together, `derived` is the union (a period is a scaled copy if any member's is), `held`, `source` and `year` are the members' common values. The id is the member ids joined with " + " unless the entry gives one. The code reads no street names and no node numbers; the group is data in the config. With no entry nothing runs and every output is byte-identical.

D3. How it enters the fit. The merged station is an ordinary constraint with `links` [4080, 4058] (`toCons` in `tools/lib/demand-fit.ts` copies it unchanged). `assigned` in `tools/lib/fit-counts.ts` already sums the assigned volume over a constraint's links, and `membership` already adds a flow's share on each of them (capped at 1), so the fit's log-ratio step `log(target / assigned)` is taken on the sum: every flow that uses either on-ramp is pulled toward the row total and the fit may place it on either ramp. Per-flow bounds, the stopping rule and the "stations that cannot be met" list apply as before; the merged station is one row in the station tables. Round 46's ramp stations on several freeway links (for example a ramp with an on-leg and an off-leg at one node) already use the same path, so nothing in the fit changes. The share-target step (`impliedVolumes`) receives the merged station as one ramp target of 122 where it received two of 61 (the sum over the ramp's links is the same).

Weight. The members each had the ramp weight 2 (ramps are exempt from the recency bands). The merged station keeps 2: a flow that used one on-ramp was pulled with weight 2 by its station before and is pulled with weight 2 by the merged station now. ASSUMPTION: this is the choice that leaves the pull on each flow unchanged; a weight of 4 is not tested.

D4. What the group may and may not contain. Every member is a link station (no route feature), of one kind, with detectors on all links or none, with no link in common, and every member shares a source observation with the first (the Caltrans row). The members must carry the same source and count year. The build stops, with a message, when any of that fails.

D5. The frozen split. The split is not re-frozen and `npm run data:split` is not run. The split file (`data/demand/rockridge.split.json`) has one dependency group for the row, `ramp-row 04-ALA-024 PM R5.584 "WB ON FR CALDECOTT LANE"`, whose stations are `ramp on 1695` and `ramp on 1711`, and `held: false`. Both halves are fitted, in both views; they are on the same side, so nothing is stopped. The split names both ids and `checkManifest` rejects a station list that lacks one of them, so the merge runs after `checkManifest` and `applySplit` (and after the training view's leak check) and before the recency weights. The split therefore still sees the two stations of the build; the stations file and the fit see the merged station with id `ramp on 1695 + ramp on 1711`. In the shipped view the build checks that the members' `held` flags agree before it merges; in the training view a member that is absent while another is present stops the build, and a group none of whose members is present is left out with a note. `--freeze-split` exits before the merge, so it would see the two stations too. The assessment reads `held` from the stations file, so the merged station is scored as fitted. The Rust code reads the split only to withhold route-feature stations, and the merged station has none.

D6. Scoring. No Rust change. `scoreStations` and `stationFlow` in `tools/lib/assess.ts` already sum the simulated flow over a station's links, each at its own detector (`start` for an on-ramp), and compare it with the station target by GEH on the seed mean. The merged station is scored as the sum of the flows on links 4080 and 4058 against 122 veh/h. The Rust `calibrate` reads `links` and `detectors` per station only to observe link detectors for `--select-od`, one per link, and needs nothing new. Limit: the score cannot tell which of the two ramps carries the flow, and a sum that passes could hide a sum of 61 on each ramp as well as 122 on one. That is the point of the change (the row says nothing about the division), and the simulated flow on each link is still in the seed reports and is listed in the report.

D7. Denominators. In the PM the two members are two of the 92 recent fitted stations (2024, not derived); the merged station is one. PM fitted becomes 91, from `denominators.mjs` on the candidate stations file (RAN). PM held out stays 24. In the AM the members are derived (the AM target is the PM count times a factor, ASSUMPTION) and are not judged, so AM fitted stays 77 and AM held out stays 19. Every other station is unchanged: no station is added, removed or moved between held out and fitted except the merge, and no target of a remaining station changes (`targets-changed.mjs`: 0 changed, 2 removed, 1 added). The station file has 356 stations against 357.

D8. Keep rule, written before any run of the candidate and copied from round 46's D4 against the same baseline lines. A candidate is adopted only if none of these is worse:

- recent PM fitted stations within GEH 5: see the two fills below
- PM held out: at least 14 of 24
- AM fitted: at least 70 of 77
- AM held out: at least 14 of 19
- the baseline-calibration decision D5 holds, with 4 of 4 headline shares within 10 points
- all 8 whole-street traversal counts within GEH 5
- the baseline-calibration decision D16 (stability) holds in every period
- the validation suite still passes 67 of 74 at the same fingerprint

The PM fitted line needs care because the merged station replaces two stations. Let `b` be how many of `ramp on 1695` and `ramp on 1711` are within GEH 5 in the PM ten-seed baseline (0, 1 or 2). It is read from a baseline ten-seed set made on the laptop (`station-table.ts`), because the published assessment lists only the 12 largest misses and does not store the other stations; it is a baseline value, read before any candidate is assessed. In the audit's seed-1 run `ramp on 1695` passed (GEH 4.6) and `ramp on 1711` failed (8.7). The baseline set must reproduce 74 of 92, 14 of 24, 70 of 77 and 14 of 19, or the run stops.

- Common stations: the 90 recent PM fitted stations other than the two members. The baseline has 74 - b of 90. The candidate must have at least 74 - b of 90. The merged station cannot make up a loss here.
- Every station: the candidate's 91. The best the merge can do is turn two members into one passing station, so the line is 74 - max(0, b - 1) of 91. With b = 0 or 1 that is 74 of 91, with b = 2 it is 73 of 91.

A candidate passes only if both fills pass. One figure below its line fails the candidate. The rule is not loosened after a result. The merged station's own GEH and its flow against 122 are reported, not conditions.

D9. Screen. As in round 46's D6: the candidate gets the ten-seed assessment only if a three-seed diagnostic (seeds 1 to 3, AM and PM, no verdict) is no more than 3 stations below the baseline's own three-seed diagnostic on each of the four station counts, judged on the common stations (the candidate figures without the merged station, the baseline figures without its two members), and shows no car cleared from gridlock in the judged zone. The tolerance of 3 is an assumption about seed noise, written before any screen ran.

D10. Reported, not conditions: the Caldecott Lane stations (the off-ramp at node 1695 and the merged station, with the simulated flow on each of links 4080 and 4058); the five diagonal stations in the PM; every SR-24 ramp, simulated against its count or target; mean through cars per hour in the study area; Shattuck Ave, Telegraph Ave and College Ave travel times.

D11. What the candidate can and cannot show. The merge changes one constraint in a fit of 356 stations. It removes an unmeetable pair and lets the 122 veh/h of the row go to the ramp the network allows. It cannot lift the PM fitted count by more than the one station it replaces, and it can lower it by one if the merged station fails where a member passed. The static fit moves the two ramps from 164 veh/h in total to 129 (target 122). Whether the simulator follows is not known: in the baseline the simulation carries 254 on the two ramps in seed 1 where the static fit has 164.

D12. The heavy runs (baseline set, screens, validation, assessment) run on the user's laptop from `runbook.md`. This change was prepared in a cloud container: demand builds only, no simulation.

## Checked in the container

- Rule off. The code in this change with no `linkGroups` entry reproduces the baseline: shipped demand 9cdebdabf05c4460, training demand 2f9ae152b9bbf78e (built with `--out-root`, outside `public/data`). The committed network file hashes to 53c823f20d9165ed and the importer was not rerun. The code touches neither the simulator nor the network, so the fingerprint stays d45a275dd7be0713cec6a64394b7d8a9. The stations file built with the rule off is byte-identical to the committed `data/demand/rockridge.stations.json`.
- Rule on (`caldecott-pair-sum`). Shipped demand a97b0d3fdd118cc8, training demand b9464e7b65bdd542. Both views print one `link group` line. The stations file has 356 stations: `ramp on 1695` and `ramp on 1711` are gone, `ramp on 1695 + ramp on 1711` is in (links 4080 and 4058, detectors `start`, `start`, targets AM 103, midday 75, PM 122, held false, 2024). No other target changed. The split file is untouched. Denominators from the candidate stations file: PM fitted 91, PM held out 24, AM fitted 77, AM held out 19; the baseline file gives 92, 24, 77, 19.
- Static fit, PM, final assignment against target (the fit's own result, not the simulator). Shipped view, baseline to candidate: `ramp on 1695` 61 against 61 and `ramp on 1711` 103 against 61 (sum 164 against 122), to the merged station 129 against 122. By link, from the assignment dump: link 4080 (node 1695) 61 and link 4058 (node 1711) 103, total 164, to link 4080 3 and link 4058 126, total 129; the fit puts the row on the one ramp the network allows. AM (derived target): sum 165 against 103 to 136 against 103. The off-ramp at node 1695 does not change (110 against 113 in both).
- `npx vitest run tools/link-groups.test.ts` passes (13 tests); the TS-side result of the whole suite is in the report of this change. The typecheck shows only the missing WASM package, as on the base branch.

## What is not known

- Whether the simulator follows the static fit.
- Whether the merged station passes: a sum of 122 sits between the two members' current simulated flows (254 together in seed 1), so a pass needs the demand to fall, not only to move.
- The baseline pass status of the two members over ten seeds (`b`).
- Whether the weight of the merged station should be 2 or 4 (D3).

## Risks

- The candidate may only trade one failing station for one failing station: the PM fitted count then moves by at most one. Both fills of D8 exist so that this cannot be counted as a gain.
- A merged station is one row in the station file. Anything that reads the station list by member id (a re-freeze of the split, an old assessment compared by station id) will not find the members. The split is not re-frozen; old assessments are compared by label.
