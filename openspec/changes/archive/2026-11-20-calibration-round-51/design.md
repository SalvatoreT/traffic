## Context

Baseline for this round: the published model of 2026-11-18, unchanged by rounds 44 to 50. Network 53c823f20d9165ed, demand 9cdebdabf05c4460, training demand 2f9ae152b9bbf78e, simulator fingerprint d45a275dd7be0713cec6a64394b7d8a9. Ten seeds per period: PM fitted 74 of 92 recent stations within GEH 5, PM held out 14 of 24, AM fitted 70 of 77, AM held out 14 of 19, D5 4 of 4, whole-street traversals 8 of 8, D16 holds, validation 67 of 74.

Rounds 48 to 50 moved the fit's station membership onto the simulator's own routes and then capped the trip ends the fit was allowed to add (gates in round 49, every node in round 50). Round 50 held every ceiling, cut offered demand by about 8 to 10%, passed the screen and failed the ten-seed keep rule on two lines: PM held out 13 of 24 and D5 headline shares 2 of 4. In PM, Hillegass Ave SB to the freeway was 51.3 against 68 observed and Colby St SB 34.7 against 45. Rounds 48 and 49 ended at the same two shares and the same 13 of 24.

What the code does with the shares, checked in this round:

- The observed route shares (`countFit.shares`, weight 3) are ratio constraints built by `routeShareTally` in `tools/lib/share-targets.ts` and hooked in `load()` in `tools/lib/demand-fit.ts`. Each flow's membership is the fraction of the static assignment's sampled routes that use the block. `load()` never reads `countFit.throughTargets.measured`.
- The through-car targets (`selectLink` entries with `fitThrough`) read `measured[period].hits[targetId]`. The membership loop writes `runs: 0` and `hits: {}` there, so they keep static membership.
- Count stations take the simulator's pairs (rounds 48 to 50).
- The report binary scores a share on the simulator's trips: the numerator is the trips on the block whose origin ("from") or destination ("to") is a node with a motorway-class link, the denominator all trips on the block.

So the fit meets its share targets on routes the simulator does not use. The lead's hypothesis is that this mismatch causes the D5 failures. Nothing in the evidence tests it yet: the round 50 report gives the static-route shares, and nobody has the fit's share on simulated membership. This round gives the fit both numbers for every share.

Found while preparing, and first in the report: the shipped config has no through-car target. Commit c503d84 (2026-11-17) removed `fitThrough` and `observedCorridorThroughVehPerHour` from the targets file because the resident count does not measure all through trips that use any block. `loadThrough` therefore builds an empty target list and the fit report says "No comparable unique-corridor through counts enter this fit". D2 below is implemented as asked and tested, and it is inert on the shipped data. The candidate tests the shares only. Options for the lead are in the preparation notes below.

## Decisions

The lead made D1 to D8 on 2026-11-19, before any run. They are recorded here as the lead's. Preparation choices follow as P1 to P8 and are marked as such.

D1. (Lead.) No simulator change. Fingerprint d45a275dd7be0713cec6a64394b7d8a9 (`crates/sim/fingerprint.rs` skips `src/bin`, and `calibrate.rs` is not edited in this round either). Baseline network 53c823f20d9165ed, demand 9cdebdabf05c4460, training demand 2f9ae152b9bbf78e.

D2. (Lead.) Through-car targets take simulated membership inside the loop. Per pass the driver pools the `blocks` of the collected `sod-<period>-<seed>.json` files (per select-link run, the `(origin, destination, n)` of every trip that hit a link of the run) with the existing `pooledMembership(sets, inStudy)` in `tools/lib/through-membership.ts`, and writes runs, source, hits and trips into the membership file it already writes. `measured[period].hits[targetId]` then exists and `demand-fit.ts` uses it. Same pooling over passes, same evidence checks and same leak guards as for the stations.

D3. (Lead.) Select-link share constraints take simulated membership from the same `blocks` export. For a share on a block, a pair's denominator membership is its simulated share of trips that hit the block (pooled trips on the block over pooled offered trips of the pair), with the same `priorTrips` 5 shrinkage toward the static fraction that stations use (ASSUMPTION, as there). The numerator is the same restricted to pairs whose origin ("from") or destination ("to") is a freeway node. This is the node set `share-targets.ts` already builds, and the definition behind `node_fw[origin]` and `node_fw[dest]` in the calibrate report, so the fit is balanced on the quantity the model is scored on. Ramp via-street shares stay on static routes: nothing exports them per pair. A share whose block has no simulated hit keeps static routes and is listed, as zero-hit stations are.

D4. (Lead.) D2 and D3 sit behind explicit sub-switches of the candidate's `simulatedMembership` entry, `"throughTargets": true` and `"shares": true`. Absent, rounds 48 to 50 behave unchanged and their tests pass untouched. Pass 0 and midday stay static as before. Training view: use exactly the share and through targets the training build already uses, and take pairs only from runs of the training demand. If any share or through target turned out to be derived from data the frozen split withholds, stop and report; the split is not changed.

D5. (Lead.) One candidate, `shares-membership.json`: the node ceilings exactly as in round 50 (`gatePriorTotals`, scope `allNodes`, `staticFit` anchor, tolerance 0, weight 10) plus `simulatedMembership` with stations, through targets and shares. The loop, the screen, and ten seeds if the screen passes. The 3% abort and the 10%-below warning stay. D5 shares are both fit targets and keep-rule criteria, as they are in the baseline (shares weight 3). Passing D5 would show that the fit can now reach its own share targets in the simulator. The held-out station counts remain the independent check, and the verdict says so.

D6. (Lead.) Keep rule and screen unchanged from round 50: PM fitted at least 74 of 92, PM held out at least 14 of 24, AM fitted at least 70 of 77, AM held out at least 14 of 19, D5 4 of 4, whole-street 8 of 8, D16 holds in every period, validation 67 of 74. The screen, three seeds (1 to 3) in AM and PM: each of the four counts no more than 3 stations below the baseline's own three-seed screen, no car cleared from gridlock in the judged zone, and backlog under 2% in 3 of 3 seeds in AM and PM. One figure below its line fails the candidate; the rule is not loosened after a result.

D7. (Lead.) Reported, not conditions: round 50's lists, plus per pass, for each share target, the fit's own share on the static routes and on simulated membership against the target, and for each through target the fit's figure against its target.

D8. (Lead.) Runbook for the laptop modeled on round 50's: `target/membership-loop` and `target/membership` moved aside, evidence under `openspec/changes/calibration-round-51/evidence/`, dev branch `salvatoret/peaceful-fermi-dlwt0u`, the same never-list, node-prior dumps as compact CSV under 190 KB each, and the archived round 50 `scripts/nodes.cjs` and `shares.cjs` reused. Citations: no new reference from memory; ASSUMPTION labels as in rounds 48 to 50.

P1. (Preparation choice.) The block pairs are pooled twice per period because the two uses have different definitions. Through targets count trips with neither end in the study area (`pooledMembership` with the study-area node set, as round 39 defined it) and go to the top level of the period, where the fit already reads them. Shares count every trip on the block, so the same function runs with an empty node set and the result goes under `blocks`. Hits in both are keyed `through <street> <direction>`, the id the through targets already use. Both reuse `pooledMembership`'s arithmetic, so a pair's hits over its offered trips is its share of trips on the block.

P2. (Preparation choice.) A block with no counted trip is not written, so it keeps static routes in the fit, and is named in a per-pass zero-hit list (`zeroHit` under `blocks`, `throughZeroHit` at the period level). Writing an empty hit table instead would make the fit take a membership of near zero. For the through pool, a block whose every trip has an end in the study area is also a zero-hit block. The training file's leak check (`assertNoWithheld`) also reads these keys.

P3. (Preparation choice.) The denominator uses `measuredShare`, the function stations and through targets already use, with the static fraction of the flow's sampled routes as the prior and the pinned (assumed-movement) flows' static share taken out as it is for them. The numerator is then the denominator for a pair with a freeway end and 0 otherwise. In the static tally the two are equal for freeway-end pairs too (a trip that hits the block and has a freeway end), so only the denominator's source changes. A pair with simulated trips on the block enters the constraint even when no static route uses the block; before, the constraint had only the static routes' pairs.

P4. (Preparation choice.) `routeShareTally.constraints` takes an optional membership function. The fit passes one only when the sub-switch is on and the period's file has `blocks`. The static version of each simulated share is kept in the spec (`staticRatio`) so the report can evaluate both at the same volumes. The static fit that anchors the node ceilings is built without any measured file, so its shares and through targets are static, as before.

P5. (Preparation choice.) The fit report gets, only when a share took simulated membership, one machine-readable line per share and period (`Share <period> <label>: simulated|static; target T%; offered O% (static routes P%); final F% (static routes S%); N flows.`), and for each through target with simulated membership the same in cars per hour. Per period a note says `select-link shares take simulated membership (N runs; K of M share constraints; ...)`. The loop checks that note (runs, and at least one constraint when the file has simulated block trips) so a silent fall back to static shares stops the loop, as it does for stations. With the switches absent nothing is added to the report.

P6. (Preparation choice.) The loop prints the share and through lines of each build, lists zero-hit blocks per pass, and writes both to its report under "Share and through targets, by build". The loop gate on offered demand (3% abort, 10% warning) is unchanged.

P7. (Preparation choice.) The sub-switches also gate the fit: with `simulatedMembership` present and `throughTargets` false, through hits in a file are ignored. Without a `simulatedMembership` entry (the round 39 measured file) the through targets behave as before.

P8. (Preparation choice.) Nothing in the split treats the targets file: `withheldObservations` and `withheldStationIds` cover count-station observations only, the shares are StreetLight device-sample estimates, and the through targets whose street run holds a held-out block are already left out of the training view by `loadThrough`. The training build therefore uses the same share and through targets as the shipped build, and its simulated pairs come only from `iter<k>/training` runs. No share or through target is derived from withheld data, so the stop condition of D4 did not apply.

## Checked in the container

All builds used `--out-root` (scratch directories), so nothing under `data/` or `public/data/` changed in the checkout. Inputs: the committed network (53c823f20d9165ed), and the OSM extract and raw demand files copied from the main checkout. A 4-core container with up to five builds running at once. The fingerprint step of the builds that read a membership file used the main checkout's compiled `fingerprint` binary, which prints d45a275dd7be0713cec6a64394b7d8a9.

1. Switch absent (the config as committed), with the new code: shipped demand 9cdebdabf05c4460, training demand 2f9ae152b9bbf78e, stations file byte-identical to the committed one, and both fit reports (`rockridge.fit.md`, `rockridge.fit.cv.md`) byte-identical to the committed ones.
2. Candidate entry (`apply-candidate.py` output, config hash 1080597767aac58c), no membership file: the build says "No simulated membership file for the shipped view", the periods are identical to the baseline's (`JSON.stringify(periods)` equal), and the report has no ceiling section and no share lines.
3. A made-up membership file with through hits and block pairs (plumbing check, not a model result; the generator is not committed). Per period, 8 random pairs for each of the 337 (PM) or 272 (AM) selected stations, 60 random pairs per select-link block, and 40 random pairs per block with both ends outside the study area, each pair taking 30% of its offered trips over 20 runs. The first select-link block, Hillegass Ave NB, has no trips on purpose, to exercise the zero-hit path. The through-car target needs a targets file that the repository no longer has, so the build ran on a scratch copy of `data/calibration/rockridge.targets.json` with `fitThrough` and a corridor through count (PM 90, AM 60 veh/h) on Colby St NB; those values are made up. The shipped view, with the node ceilings in both builds. The first build has both sub-switches on; the reference has the entry without them and its own file without block pairs (a second config, so a second hash).

   - Both sub-switches took effect. The fit report notes, in each peak period, "select-link shares take simulated membership (20 runs; 3 of 4 share constraints; ... blocks without a simulated trip keep static routes: Hillegass Avenue NB, trips from the freeway; ramp via-street shares keep static routes)" and "through targets take simulated membership (20 runs; 1 of 1 targets)". The 11 ramp via-street shares per period stay static. The reference build has no Share line.
   - Shares, fit share on simulated membership (static routes in parentheses), offered then final, against the target. PM: Colby St NB, target 47: 47 (69) to 44 (52). Hillegass Ave SB, target 68: 74 (82) to 68 (57). Colby St SB, target 45: 63 (86) to 63 (58). AM: Colby St NB 47: 46 (70) to 38 (53). Hillegass Ave SB 57: 63 (83) to 49 (71). Colby St SB 45: 61 (82) to 50 (48). With made-up pairs the two memberships differ by 5 to 25 points, which is the size of mismatch the round is meant to expose; the numbers say nothing about the real one.
   - Through target, cars per hour, simulated membership (static routes), offered then final: PM target 90: 139 (143) to 122 (131); AM target 60: 71 (77) to 66 (72).
   - Offered car demand, static fit to final (the ceilings hold, 0 stations above their ceiling in both builds): with both sub-switches PM 27,693 to 26,283 and AM 23,211 to 21,843; reference PM 26,260 and AM 21,890. By flow type, PM final through, local, ramp: 6,579, 8,530, 11,174 against the reference's 6,589, 8,504, 11,167. The sub-switches move the fit by a few tens of veh/h in total on these pairs, which is what a plumbing check with made-up pairs can show.
   - Build time about 21 minutes for each of the two builds, run together and sharing four cores with up to three other builds for part of it.
4. `npx vitest run tools/` (44 files pass, 504 tests, 6 skipped), `npx tsc --noEmit -p .` (only the missing WASM package) and `openspec validate calibration-round-51 --strict --no-interactive`. The new tests (`tools/block-membership.test.ts`, three additions in `tools/membership-loop.test.ts`) cover: the sub-switches absent equal to unchanged behavior; through hits written and used; the share numerator and denominator from pooled blocks with the freeway-node rule on both sides; the prior's shrinkage; a pair the static routes miss; a zero-hit share staying static and listed; the through pool leaving out study-area trips and the share pool keeping them; the training file naming nothing withheld; the fit's static anchor ignoring the block pairs; the report lines, the shares note and the loop's check of it. No existing assertion changed.

Reading the check. The mechanism does what D2 and D3 say, in the build the loop will run, and the report gives the two versions of every share. It also shows the build still holds the node ceilings with the shares on simulated membership (nothing above a ceiling). It does not show whether real simulated pairs move the shares.


## What is not known

- Whether the mismatch is real. The fit's share on the static routes and on simulated membership have not been compared in any run. If they differ little in pass 1, the hypothesis is wrong and the D5 failures have another cause.
- Whether shares fitted on simulated membership pull the same trips the node ceilings hold. With every node capped the fit can only move trips among pairs. A share that needs more freeway-end trips on a block than the ceilings allow cannot be met, and the report's "Stations that cannot be met" and the share lines will show it.
- How noisy a block's simulated share is. A block with about 200 trips per hour has, over ten seeds and three passes, a few thousand trips, but a pair's membership rests on the few trips of that pair, shrunk by a prior of 5 trips. Pairs with a handful of simulated trips are mostly static, which may be too much or too little.
- Whether the through half does anything. The shipped config has no through target. If the lead restores one, the data it needs is a measured count of unique through trips on a street run, which the resident count does not give.
- Whether the three-pass loop converges with the shares moving too. The stop rule is unchanged and compares station flows and pairs only.

## Risks

- The share constraint is a fit target and a keep-rule criterion. If D5 passes, that shows the fit reaches its own targets in the simulator, not that the model is right. The held-out station counts are the independent check, and they have failed in the same place in three rounds.
- Shares fitted with simulated membership may pull to-freeway traffic up and the Claremont Ave on-ramp (598 counted) away from its count. The ramp table in the reported lists shows it.
- Share membership from ten seeds is noisy on blocks with about 200 trips per hour. Pass-to-pass changes in a share will partly be noise, and the 1/n pooling keeps pass 0's static-route runs in the pool permanently, as it does for stations.
- Moving a share's membership changes which flows the share constraint touches. Pairs that enter only through simulated trips were free before and are now tied to a share, which can move local trips into the blocks.
- The ceilings still freeze the static fit's errors at each node (round 50's risk). The share constraint can only trade among pairs.
- The loop has not run with the block export pooled. A seed run that lacks `blocks` stops the loop at the pooling step.

## Lead decision on the low-demand stop (2026-11-19)

The loop ran three passes and the final builds without aborting. The final shipped PM build offered 24,688 car veh/h, 10.6% below the static fit's 27,609, past the 10% warning line (an assumption), and the driver stopped before the screen, the validation or the ten seeds. The other three final builds were inside the line (shipped AM 92.4%, training PM 90.1%, training AM 91.5%).

The lead decided to continue with the screen and the ten seeds on the saved candidate. The reasons:

- The 10% line is a stop-and-report point, not a keep-rule line. It asks for a decision and does not fail a candidate.
- Round 50 ran in full at 9.98% below the static fit, so the two candidates carry practically the same volume. The comparison needs the same measurements.
- The keep rule (D6) and the screen are unchanged, so the shortfall cannot loosen either.
- The shortfall is reported with the result, and adoption is the project lead's decision.

The loop was not rerun. The screen and the ten seeds ran on the saved config, fit reports and demand files, whose hashes were checked first.

## Outcome

The candidate passed the screen and every line of the keep rule (D6) on seeds 1 to 10: PM fitted 82, PM held out 14 (exactly at its line), AM fitted 74, AM held out 15, D5 4 of 4, whole-street 8 of 8, D16 holds in every period, validation 67 of 74. D5 is not independent evidence, because the shares are fit targets. The shortfall in offered demand (shipped PM 10.6% below the static fit) was reported with the result.

The lead wrote a fresh-seed confirmation rule on 2026-11-19, before the run: on seeds 11 to 20 the candidate must be no worse than the baseline on every keep-rule line computed on the same seeds. It failed on one line. Whole-street traversals are 7 of 8 for the candidate against 8 of 8 for the baseline, because PM Colby St southbound is 78 cars an hour modeled against 39 counted (GEH 5.0; the baseline on the same seeds is 58, GEH 2.8). Every other line holds or improves. The baseline itself is below the keep-rule line on these seeds for PM held out (13) and AM held out (13).

The staged proposal search on the candidate (laptop commit 2557fc9) was never published. Baseline through cars per hour on the candidate are PM 806.9, AM 414.0, midday 386.8 and mean 535.9, against the published 709.2, 429.1, 386.8 and 508.4. The six options and the comparison with search-c5 are in the record entry.

Decisions of the project lead (2026-11-19):

1. Publish round 51 only if the fresh-seed check holds; otherwise record it and come back to it.
2. After the check failed: do not adopt it and keep the published model. The next step is to fit the counted whole-street traversals on the simulator's routes, on top of round 51. They then stop being an independent check, as the route shares did in round 51. The held-out station counts stay independent.

The evidence is under `evidence/`, from laptop commits d28897d (stopped at the low-demand warning), d4b2095 (screen and ten seeds), 2557fc9 (staged search) and 6c5ff1b (confirmation), all unsigned. The two membership files were sent as 7 gzip parts on the development branch only (6c5ff1b) and are not on main. The record entry is in `data/calibration/rockridge.record.md`. The code is on `main` with the switches off, and the shipped config has neither `gatePriorTotals` nor `simulatedMembership`. Published data (network 53c823f20d9165ed, demand 9cdebdabf05c4460) is unchanged and the model status stays "Not calibrated".
