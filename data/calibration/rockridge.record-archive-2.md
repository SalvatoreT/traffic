# Rockridge baseline calibration record: archive, part 2

Rounds from the seventeenth on, moved unchanged from `rockridge.record.md` (round seventeen on 2026-11-15, rounds eighteen to twenty-one on 2026-11-16, rounds twenty-two to twenty-four in round 33, rounds twenty-five and twenty-six in round 38) to keep that file under the 200 KB limit of the pre-commit hook. `rockridge.record-archive.md` holds rounds one to sixteen and is full. Newer rounds and the main step table are in `rockridge.record.md`.

## Seventeenth round: published counts, the 52nd Street ramp, Colby St, where local trips load (change ramp-and-colby-calibration)

Decisions D1 to D14 in `openspec/changes/archive/2026-11-13-ramp-and-colby-calibration/design.md`. Seeds 1 to 10, scale 1.0, 60 minutes, initial loading on. Before is the shipped state of the sixteenth round (network fc4e7eac8da330d0, demand a4952df61abc41fd). After: network c05a22fc9ebe8816, demand 7f462d0790a61860 (offered AM 21,567, midday 15,892, PM 24,910 veh/h), and a changed simulator. The validation suite stands at 49 of 59: case b9 (two lanes, 10% left turns) now passes at 818 veh/h per lane against 815 to 1,075, and the new case b12 (a lane of left turns with no opposing traffic) gives 660 veh/h at a green share of 0.5.

### What was found in public documents

| Source | What it holds | Used as |
| --- | --- | --- |
| [CHRCO-EIR2014], Appendix C | Count sheets of 2013-09-19, AM and PM, at 21 intersections around 52nd St; Synchro worksheets with lanes, phases and greens | 9 intersections in the fit; signal timing at Shattuck Ave and 52nd St and at the SR-24 ramps on Martin Luther King Jr Way |
| [SafewayCollege-DEIR2011], appendix | PM demand volumes of 2010-03-16 at 15 intersections around College Ave and Claremont Ave; worksheets | 5 intersections in the fit |
| [ACTC-LOS2014], [ACTC-LOS2018] | Peak-period speeds on Telegraph Ave, Shattuck Ave and College Ave, 2012 to 2018 | travel-time targets in the assessment |
| [TelegraphCS2013] | Bus speeds and computed intersection delays on Telegraph Ave | context only |

The counts corrected three inputs. The 52nd St off-ramp carried 1,024 veh/h in the PM peak hour, where ADT times an assumed K of 0.09 gave 1,278; the Clifton St off-ramp 617 where the ADT gave 972. At Shattuck Ave and 52nd St, 342 of the 1,427 eastbound vehicles turned left or around (24%); the old demand put 44% of that approach on the left turn. Ashby Ave west of Claremont Ave carried a demand volume of 783 eastbound and 649 westbound, where the AADT had given 1,163 and 952.

### Stability, before and after

| Period | Before: removals per hour (min to max) | Before: backlog (seeds under 2%) | Before: arterial speed (m/s) | After: removals per hour (min to max) | After: backlog (seeds under 2%) | After: arterial speed (m/s) | Rule D16 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| PM peak | 1.80 (0 to 4) | 0.54% (10 of 10) | 7.60 | 2.30 (1 to 8) | 0.19% (10 of 10) | 7.82 | fails |
| AM peak | 0.10 (0 to 1) | 0.03% (10 of 10) | 9.27 | 0.10 (0 to 1) | 0.03% (10 of 10) | 8.78 | holds |
| Midday | 0.00 | 0.00% (10 of 10) | 9.96 | 0.00 | 0.01% (10 of 10) | 9.85 | holds |

PM fails on removals alone, as before. Per the user's decision of 2026-11-13 no work went into PM stability as such. Completed trips in the PM peak: 24,119 per hour (22,881 before).

### The steps, PM peak, seeds 1 to 10

Each row adds to the one above. Ramp figures are veh/h on the ramp link; the counts are 1,024 (52nd St) and 617 (Clifton St).

| State | Removals per hour | 52nd St off-ramp | Clifton St off-ramp | Eastbound approach at Shattuck Ave (counted 1,427) |
| --- | --- | --- | --- | --- |
| Before | 1.80 | 473 | 1,527 | 590 |
| Counts in the fit, old simulator | 6.10 | 473 | 1,310 | 541 |
| Observed phases at Shattuck Ave and 52nd St (D5) | 5.40 | 400 | 1,358 | 523 |
| Marked left-turn lane holds its link, drivers sort 150 m ahead (D7) | 8.90 | 418 | 1,346 | 534 |
| Turning drivers keep to their side of the road (D7) | 6.00 | 394 | 1,342 | 578 |
| Route costs by turning movement (D8) | 4.20 | 466 | 1,272 | 688 |
| Crosswalk served with the approach beside it (D6) | 4.80 | 551 | 1,201 | 786 |
| Drive-through lanes out of the network, refit (D9) | 5.80 | 563 | 1,237 | 835 |
| Observed phases at the Martin Luther King Jr Way ramps, shared ramp row (D4, D5) | 2.20 | 500 | 1,280 | 682 |
| Local flows may be scaled up to 10 times (D11) | 1.30 | 538 | 1,175 | 736 |
| Local trips start and end along the block (D13), same demand | 2.10 | 588 | 1,126 | 784 |
| Census blocks spread over nearby junctions, refit (D12): after | 2.30 | 544 | 1,216 | 755 |

The second row shows what the counts did to an unchanged simulator: 20 of its 61 removals sat at the Martin Luther King Jr Way ramp signal, where the count puts 1,547 veh/h on a turn across the northbound street that the model ran as a permissive left. The observed timing gives that stream a phase of its own. The removals of the last four rows range over 0 to 8 per seed, so their differences are not significant.

### The 52nd Street off-ramp (A)

| Quantity, PM peak | Counted | Before | After |
| --- | --- | --- | --- |
| 52nd St off-ramp | 1,024 (ADT times K: 1,278) | 473 | 544 |
| Clifton St off-ramp | 617 (ADT times K: 972) | 1,527 | 1,216 |
| Telegraph Ave off-ramp at Aileen St | 621 (ADT times K) | 844 | 908 |
| Martin Luther King Jr Way off-ramp | 1,614 | 1,599 | 1,546 |
| 52nd St on-ramp | 996 | 1,140 | 972 |
| Hudson St on-ramp | 598 | 934 | 794 |
| Eastbound approach at Shattuck Ave | 1,427 | 590 | 755 |
| Eastbound left onto Shattuck Ave north | 302 (and 40 U-turns) | not recorded | 232 |
| Eastbound right onto Shattuck Ave south | 172 | not recorded | 146 |

The static assignment of the fit meets the ramp counts (52nd St 1,046 in the first refit). The simulator does not. The gap at 52nd St fell from 805 to 480 veh/h, 254 of that because the target had been wrong. The gap at Clifton St is 599 against 555 before, measured against the counts. What the traces showed, and what each fix did:

- Left-turners stood at the head of all four lanes of the approach. The link carries a marked left lane, which the simulator treated as a three-car pocket. With D7 the through lanes clear in every green.
- Left-turners waited through the first seconds of their green for pedestrians on the crosswalk they turn over. The crosswalk had been given the phase of the wrong neighbor (D6).
- About 460 veh/h from Shattuck Ave southbound reached 52nd St through a fast-food drive-through lane north of the corner, and cars turning left into it stopped the single northbound lane (D9).
- A link's measured time was one number, so the wait of the left-turn lane made the approach look slow to through drivers (D8).

What is left: the left turn discharges 232 veh/h where 342 were counted. Left-turners fill the marked lane, then the 7 m link behind it and the left lane of the ramp, where the mean delay is 96 s. That delay is measured on the ramp link, which has one movement at its end, so through drivers at the freeway gate still see it and leave by Clifton St and Aileen St. The validation case b12 puts an unopposed left-turn lane at 1,320 veh/h per hour of green, 0.79 of the through lane; at this junction, into a 32 m single-lane block, it reaches about half of that. The next steps are the discharge of a turn into a short exit link, and a route cost that separates the sorted lanes of a link whose queue has spilled back from the link ahead.

### Colby St northbound (B)

| Quantity (PM) | Counted | Before | After |
| --- | --- | --- | --- |
| Colby St, median block NB / SB | 174 / 160 | 155 / 198 | 159 / 206 |
| Hillegass Ave, median block NB / SB | 110 / 168 | 103 / 189 | 99 / 139 |
| Colby St, North St to Alcatraz Ave NB | 164 | 57 | 143 |
| Colby St NB to Alcatraz Ave west | 131 | 5 | 10 |
| Colby St NB to Alcatraz Ave east | 32 | 6 | 14 |
| Colby St SB to Claremont Ave northeast | 75 (doubtful reading) | 0 | 1 |
| Colby St whole street NB / SB | 102 / 39 | 44 / 97 | 120 / 108 |
| Entries from Alcatraz Ave at Colby St and Hillegass Ave | 360 | 313 | 325 |
| Entries from the Telegraph Ave side | 264 | 443 | 440 |
| Cross streets to Telegraph Ave, modeled over counted: 60th / 61st / 62nd / 63rd St | 1 | 1.94 / 1.69 / 1.55 / 1.54 | 2.30 / 1.50 / 1.48 / 1.19 |

The last block now carries 143 against 164, and the whole street northbound 120 against 102. The reason has to be stated plainly: with D12 and D13 trips bound for the corner of Colby St and Alcatraz Ave drive up the block and leave the road along it. The counted cars turned onto Alcatraz Ave, and that left turn is still at 10 against 131. The block is met and the movement is not.

What was tested (D10):

- Observed travel times. Telegraph Ave northbound from 51st St to Russell St took 302 to 420 s in the four monitored years (12.1 to 16.8 mph in the PM peak). The simulator gives 350 s (368 s before). So the model does not run Telegraph Ave faster than it is, and the idea of D39, that drivers find Telegraph Ave slower than the model does, has no support in the data.
- Loaded costs in the router. The simulator routes on measured link times from the first second (the probe run of D27) and updates them every minute; since D8 they are measured per movement. On those times the cheapest route from the freeway to Telegraph Ave north of Alcatraz Ave costs 573 s and the route over Colby St and the left turn 646 s, 13% more (15% more on free-flow times). Loaded times do not bring Colby St closer.
- The router's control constants. They are added on top of measured times that already contain the wait, on every route alike. Without them the route over Colby St is 18% dearer.
- The prior and the bound. The assignment before the fit puts 2 veh/h on the left turn. The fit raises its flows to the bound and reaches 9. With the bound of local flows at 10 (D11) nothing changes for this movement: the trip table holds almost no trip whose near-best route takes the turn.

So the open question is which trips these are. They are not freeway trips kept off Telegraph Ave by congestion. They may be trips to places west along Alcatraz Ave or north of it that the trip table puts elsewhere.

### Arterial travel times, PM peak

| Segment | Free flow (s) | Simulated (s) | Simulated (mph) | Observed (mph), 2012 to 2018 | Observed (s) | Inside the range |
| --- | --- | --- | --- | --- | --- | --- |
| Telegraph Ave NB, 51st St to Russell St | 185 | 350 | 14.5 | 16.8, 14.9, 12.1, 15.1 | 302 to 420 | yes |
| Telegraph Ave SB | 185 | 371 | 13.7 | 16.0, 16.9, 13.5, 16.4 | 300 to 376 | yes |
| Shattuck Ave NB, 51st St to Alcatraz Ave | 127 | 278 | 10.5 | 20.3, 18.2, 16.4, 16.4 | 144 to 178 | no, too slow |
| Shattuck Ave SB | 127 | 246 | 11.8 | 13.2, 18.5, 15.8, 17.3 | 158 to 221 | no, too slow |
| College Ave NB, Miles Ave to Ashby Ave | 135 | 221 | 13.5 | 15.9, 15.5, 10.0, 9.4 | 188 to 318 | yes |
| College Ave SB | 135 | 209 | 14.3 | 11.2, 14.8, 10.2, 11.6 | 202 to 293 | yes |

Shattuck Ave is the new finding: the simulator is 60 to 100 s slower than any monitored year over 1.3 km. In the AM peak Telegraph Ave southbound (331 s against 245 to 285) and Shattuck Ave northbound (180 s against 130 to 160) are too slow as well.

### Where local trips load

The user reported cars that seemed to come out of a modal filter at 63rd St and Hillegass Ave, and decided on 2026-11-13 that local trips load mid-block and that the size of that origin be audited.

| PM peak, interior origins | Before the change | After |
| --- | --- | --- |
| Loading nodes in the model / in the study area | 702 / 37 | 1,101 / 57 |
| Nodes that send out trips in the PM peak | 556 | 882 |
| Largest node (veh/h out) | 519 (Colby St in Berkeley) | 214 (College Ave, Claremont Ave and 62nd St) |
| Share of the ten largest nodes | 28% | 15% |
| 63rd St and Hillegass Ave (veh/h out / in) | 185 / 48 | 97 / 21 |
| Study-area origins, all nodes | 929 | 951 |

The 185 veh/h were a prior of 46 for the four census blocks around the corner (about 236 resident workers and 118 jobs) times 4.1 from the fit. At 0.35 PM departures per detached dwelling [PBC-TripRates2022] they would need about 530 dwellings. It was an artifact of loading each block at one corner (D12). In the simulator a trip with a local end now pulls out from the curb between a quarter and three quarters of the way along a block next to its origin, when the gap rule of gate insertion is met for the vehicle ahead and the one behind, and leaves the road the same way on its last block (D13). It never crossed its origin junction before either; it appeared at the junction's edge. On the same demand the change moved PM removals from 1.30 to 2.10 per hour, the 52nd St ramp from 538 to 588 and the last block of Colby St from 70 to 73, all inside the seed noise except the Colby St block after the refit, as said above.

### Headline shares and count stations, PM

| Share | Observed | Before | After |
| --- | --- | --- | --- |
| Hillegass Ave NB from the freeway | 47 | 71.4 | 51.4 (within 10) |
| Colby St NB from the freeway | 47 | 78.1 | 69.1 |
| Hillegass Ave SB to the freeway | 68 | 73.4 (within 10) | 50.9 |
| Colby St SB to the freeway | 45 | 60.5 | 57.5 |

Mean absolute error 19.1 points before, 14.0 after; one of four within 10 points in both. With the bound change alone (before D12 and D13) the error was 10.7 with two of four within 10.

| Set (GEH below 5, size bands in brackets, mean GEH) | Before | After |
| --- | --- | --- |
| All fitted | 81 (102) of 120, 68% (85%), 4.2 | 115 (137) of 190, 61% (72%), 5.4 |
| All held out | 19 (23) of 31, 61% (74%), 5.8 | 26 (32) of 55, 47% (58%), 5.8 |
| Interior blocks, fitted (89) | 67 (88), 75% (99%), 3.4 | 70 (88), 79% (99%), 3.0 |
| Interior blocks, held out (18) | 14 (18), 78% (100%), 3.1 | 13 (18), 72% (100%), 3.1 |
| Other stations, fitted | 14 (14) of 31, 45%, 6.4 | 45 (49) of 101, 45% (49%), 7.4 |
| Other stations, held out | 5 (5) of 13, 38%, 9.6 | 13 (14) of 37, 35% (38%), 7.2 |

The pooled share fell because the set grew by 70 stations at busy junctions, where the simulator is furthest from the counts: Telegraph Ave at 51st St carries 395 of 1,070 veh/h on its west leg, and the legs between 51st St and 52nd St about half their counts. The interior blocks did not get worse. The cross-validation assessment (demand fitted without the held-out stations) gives 26 of 55 held-out stations below GEH 5 and a mean GEH of 7.2.

### Status under D18

Stability holds in AM and midday and fails in the PM peak on removals; the share rule fails; the station rule is not met. The area stays `uncalibrated`, `experimentalPeriods` is `["pm_peak"]`, midday stays the default. The `calibration.note` reads: "The PM peak still removes about two stuck vehicles per hour, and the 52nd St off-ramp carries 544 veh/h against 1,024 counted."

### Known limits

This list replaces the one of the sixteenth round. Design D14 has the same list with what was newly tried.

1. PM removals (2.30 per hour). Not worked on, by decision. The places of the removals were not traced again in the final state; the observed phasing of Adeline St at Martin Luther King Jr Way and at Alcatraz Ave is not in the two reports read.
2. Permissive left turns enter ahead of queued opposing vehicles (D38 of the earlier change). Unchanged. Case b9 now passes, by lane sorting.
3. The 52nd St off-ramp: 544 against 1,024 counted; Clifton St 1,216 against 617. Narrowed, not closed. Needs the left-turn discharge into a short block and route costs by sorted lane (above).
4. Headline freeway shares: mean error 14.0 points, Colby St NB 22 points high, Hillegass Ave SB 17 low.
5. The left turn from Colby St onto Alcatraz Ave west (10 against 131) and the turn toward Claremont Ave northeast (1 against 75). The last block's volume is met by trips that end on it. 60th St carries 2.3 times its count. Telegraph Ave travel times are ruled out as the cause.
6. Ashby Ave at Claremont Ave: resolved as a data question. The count gives 783 and 649 veh/h; the simulator carries 648 and 681.
7. Claremont Ave north of Ashby Ave: the 2010 count gives the leg (549 entering the junction, 697 leaving); the gate stays a class default.
8. `YIELD_FALLBACK_S` at 90 s. Unchanged.
9. One count day per interior street; the published counts are from 2010 and 2013 with no growth applied.
10. Leave-one-corridor-out cross-validation not run.
11. The U-turn at the gate stub of Dana St at Ward St. Unchanged.
12. New: Shattuck Ave between 51st St and Alcatraz Ave runs 60 to 100 s slow in the PM peak.
13. New: the fit is polarized. Half of the counted flows end at the lower bound and flows that touch no count are scaled to a tenth. Single nodes still rise above their prior (214 veh/h at one corner).
14. New: Telegraph Ave at 51st St and 52nd St carries about half its counted turning volumes in the simulator.

The proposals in `data/proposals` and `public/data/rockridge.proposals.json` belong to the earlier network and demand and are stale by hash; the searches have to be rerun.

## Eighteenth round: what held the 52nd Street ramp, Colby St left turn (change ramp-discharge-and-through-check)

Seeds 1 to 10, scale 1.0, 60 minutes. Before is the state of the seventeenth round (network c05a22fc9ebe8816, demand 7f462d0790a61860). Network and demand are byte-identical after `npm run data`, so the hashes did not change. Only the simulator changed. Design decisions are in `openspec/changes/archive/*-ramp-discharge-and-through-check/design.md`.

### What limited the ramp

Traces of seed 1 (CAL_TRACE on links 4160, 1749, 1662 and 1652, one-second steps through one signal cycle) show this chain. The ramp (link 4160) had 40 to 56 cars in its left lane and two or three in the right lane. Drivers who sort for the left turn at Shattuck Ave take that lane two links ahead. The cars at the head of the 7 m link behind the signal (1749) waited for room in the marked left lane of the approach (1662), which held six cars, its full length, at the end of every red. The three through lanes of the approach stood empty during their green. The left lane let through about seven cars per 110 s cycle, 231 veh/h, where the count is 342 including U-turns and a protected left in 33.5 s of green can pass 15 or more.

The head of the left lane alternated between rolling up and braking at the line. The room check on the exit lane (link 1652, 32 m, one lane) failed for 3 to 9 s at a time with one or two cars in it. Each vehicle crossing the node held its length plus 2 m on the exit lane until it emerged, and the next vehicle checked the room that was left. Two cars crossing a 12 m left turn hold 13 m of a 32 m link, so the third waited for the first to be 21 m clear. The OSM tags match the network: way 393902217 is `turn:lanes=right|right` (two lanes, both turning right onto 52nd St), way 393902204 is `left|||`, way 307521315 one lane northbound. Signal timing was not the limit (the observed phases of the seventeenth round are in), and gap acceptance was not either: the left turn is protected.

### What changed

With `RESERVE_EXIT_ROOM` false (an ASSUMPTION, `params.rs`) a crossing vehicle no longer reserves exit-lane room. The next vehicle checks the room in front of the lane tail with 2 s of leader motion credited, and a vehicle that finds no physical room on emerging stays in the node. The ramp's mean delay fell from 83 s to 11 s and the left lane no longer stands full.

| PM peak, seeds 1 to 10 | Counted | Before | After |
| --- | --- | --- | --- |
| 52nd St off-ramp, veh/h | 1,024 | 544 | 700 |
| Clifton St off-ramp, veh/h | 617 | 1,216 | 1,014 |
| Eastbound approach at Shattuck Ave, veh/h | 1,427 | 755 | 830 |
| Eastbound left onto Shattuck Ave north, veh/h | 342 | 232 | 211 |
| Colby St, North St to Alcatraz Ave NB, veh/h | 164 | 143 | 139 |
| Colby St NB to Alcatraz Ave west, veh/h | 131 | 10 | 11 |
| Colby St SB to Claremont Ave northeast, veh/h | 75 | 1 | 0 |
| Removals per hour (min to max) | below 1 | 2.30 (1 to 8) | 0.30 (0 to 1) |
| Backlog, seeds under 2% | | 0.19% (10) | 0.06% (10) |
| Arterial speed, m/s | | 7.82 | 9.24 |
| Headline share error, points (D5) | within 10 | 14.0 | 16.0 |
| Stations below GEH 5, fitted (190) | 85% | 115 of 190, 61% | 132 of 190, 69% |
| Stations below GEH 5, held out (55) | 85% | 26 of 55, 47% | 31 of 55, 56% |
| AM peak removals per hour | below 1 | 0.10 | 0.00 |
| Midday removals per hour | below 1 | 0.00 | 0.00 |

The PM peak now holds the stability rule D16 in all ten seeds. The ramp is no longer held by its own signal and approach. The remaining 324 veh/h of the gap and the 397 veh/h excess at Clifton St are a route-choice question: the static assignment of the fit puts about 1,046 on the 52nd St ramp and the simulator's drivers at the freeway gate split differently. The left turn at the signal still passes 211 veh/h against 342 counted. The lane no longer fills, so the count is now set by how many drivers choose the left turn, not by the lane.

Headline shares moved the wrong way: Hillegass Ave NB from the freeway 52.3 (observed 47), Colby St NB from the freeway 74.1 (47), Hillegass Ave SB to the freeway 56.1 (68), Colby St SB to the freeway 64.9 (45). With the ramp open, more freeway traffic uses the Colby St corridor. The PM share rule D5 fails and the station rule is not met, so the status stays `uncalibrated` and PM stays in `experimentalPeriods`. The `calibration.note` in `data/areas/rockridge.json` was updated to the new numbers.

### Tried and not kept

- Crediting a vehicle still crossing with motion at its exit speed once it has emerged, with the room horizon set to the asking vehicle's crossing time: ramp 402 veh/h, removals 4.30 per hour, speed 7.15 m/s.
- The same with a look-ahead of the approach time (at most 4 s) and the tail projection capped at the stop line: ramp 439, removals 5.20.
- Both keep part of the reservation, loaded the network further and did not free the left lane.

### Validation suite and tests

The suite stands at 50 of 59 (49 before). Case c2 (two signals 100 m apart, adaptive plan) now passes at 0.94 of the long-spacing flow and left `KNOWN_DEVIATIONS`. The golden metrics of the two small test networks moved in the third digit and were updated with the reason in `tests.rs`. `npm test` passes.

### Colby St northbound left turn

The turning count at Colby St and Alcatraz Ave (131 veh/h toward west) is already a station in the fit with the volunteer count's route diagram and the StreetLight share (48% of Colby St NB trips leave by Alcatraz Ave west). The fit report shows it at 9 veh/h assigned, 87% of its flows pinned at the upper bound of 10, and the only flows whose path crosses it are two 63rd St entries of 7 to 8 veh/h. A multiplicative fit cannot create flow on a movement that no flow of the table crosses, and the table crosses it with almost nothing because the router prefers other routes. In the seventeenth round the route over Colby St cost 13% more than the one by Telegraph Ave (573 s against 646 s), outside the 8% noise of the assignment and of the drivers. It is not a turn-cost artifact: the left penalty (4 s) applies to the whole route and the node delay constants are the same on every route. After this round the movement is still at 11 veh/h, so the simulator change did not move it.

It cannot be fixed with the data in the repository without making the assignment disagree with the simulator's own router. The data that would fix it: origins and destinations of the trips that turn left from Colby St onto Alcatraz Ave west in the PM peak (a StreetLight select-link or a plate or Bluetooth survey at that movement, with the zones on both ends). With those, flows for the pairs can be added to the trip table and the router's preference for Telegraph Ave tested against them. The count of 75 toward Claremont Ave northeast is a doubtful reading (notes file) and stays at 0.

### Through cars on the counted blocks

The calibrate report has a new section for this, and a `throughCheck` entry in its JSON. A car is through when neither trip end is in the study area (commit 0bea4af). Expected is the observed block volume (median of the volunteer count's blocks, `observedVehPerHour` in the targets file) times the observed freeway share. PM, seed mean over ten seeds:

| Block | Observed volume | Freeway share | Expected through | Modeled through | Modeled trips with a freeway end |
| --- | --- | --- | --- | --- | --- |
| Hillegass Ave NB | 110 | 47% | 52 | 42 | 99 |
| Colby St NB | 174 | 47% | 82 | 43 | 170 |
| Hillegass Ave SB | 160 | 68% | 109 | 34 | 104 |
| Colby St SB | 160 | 45% | 72 | 67 | 152 |

The two kinds of figure differ because most freeway trips on these streets end in the study area and are not through. Colby St NB carries 170 veh/h with a freeway end against an observed 174 x 47% = 82: the corridor carries about twice the freeway traffic that was observed, which matches its headline share of 74 against 47.

### What remains

1. 52nd St off-ramp 700 against 1,024 and Clifton St 1,014 against 617: the split at the freeway gate. Next step is the cost loop on the new baseline (`tools/cost-loop.ts`); it was not run because it rebuilds the demand and the last run (seventeenth round data) did not improve the shares.
2. Headline shares, mean error 16.0 points, Colby St NB and SB to the freeway 27 and 20 points high.
3. Colby St left turn: needs the origin-destination data above.
4. Eastbound left turn at Shattuck Ave and 52nd St: 211 against 342 counted.

## Nineteenth round: through cars on Hillegass Ave and Colby St, the ramp split, the Colby St left turn (change through-cars-and-ramp-split)

Seeds 1 to 10, scale 1.0, 60 minutes. Before: network c05a22fc9ebe8816, demand 7f462d0790a61860. After: network c05a22fc9ebe8816 (unchanged), demand 9971e748dcad8069 (changed). Simulator unchanged. Decisions are in `openspec/changes/archive/*-through-cars-and-ramp-split/design.md`.

### What the data supports

The round 18 "expected through" (block volume times freeway share) is the observed number of freeway-end trips, not a through count: freeway trips that end inside the study area are in the share. The volunteer count gives a better reading. Cars that drove the whole street are through cars (a lower bound); the block volume less the cars whose trip ended along the street is an upper bound. The calibrate report now prints that range.

| PM block | Observed volume | Observed freeway-end trips | Observed through range | Before (round 18), through / freeway-end | After, through / freeway-end |
| --- | --- | --- | --- | --- | --- |
| Hillegass Ave NB | 110 | 52 | 48 to 95 | 42 / 99 | 46 / 99 |
| Colby St NB | 174 | 82 | 102 to 145 | 43 / 170 | 71 / 127 |
| Hillegass Ave SB | 160 | 109 | 79 to 120 | 34 / 104 | 38 / 112 |
| Colby St SB | 160 | 72 | 39 to 117 | 67 / 152 | 84 / 120 |

Are the model's local-end freeway trips plausible? The total of study-area trip ends is: [PBC-TripRates2022] gives 0.94 PM trips per detached dwelling, so the 1,789 ends of the old demand need about 1,900 dwellings, and the study area (0.53 km2) has 1,368 resident workers in LODES. Dwelling counts are not in the data we hold (2020 census block housing units need an API key), so this is a range and not a test. The pairing is not plausible: 72% of destinations and 80% of origins at study-area nodes had a freeway at the other end, above the highest freeway share seen on any counted block (68%). Two causes were found. Census blocks across Alcatraz Ave and Telegraph Ave loaded the boundary corners (study-area nodes) and were scaled up with the study area's blocks, so 100 of 203 veh/h on Colby NB ended at the Colby St and Alcatraz Ave corner and never turned. And the count-implied ends (927 and 940) subtracted only the counted whole streets as through.

### What changed

- Side rule: a block loads only nodes on its own side of the study-area boundary. Offered study-area ends fell from 263 and 216 to 174 and 132.
- Through share of the counted streets (45%, Martin St AM 48%) applied to four uncounted entries (ASSUMPTION): ends 804 and 817. Scale cap 4 to 8.
- Route-share weight 0.5 to 3, whole-street count weight 0.5 to 1.
- Report: observed through range; the old product is called observed freeway-end trips.

| PM peak, seeds 1 to 10 | Target | Before | After |
| --- | --- | --- | --- |
| Headline shares Hillegass NB / Colby NB from, Hillegass SB / Colby SB to freeway | 47 / 47 / 68 / 45 | 52.3 / 74.1 / 56.1 / 64.9 | 56.8 / 51.8 / 67.3 / 66.4 |
| Mean headline error, points (D5, within 10) | | 16.0 | 9.2 (3 of 4 within 10) |
| 52nd St off-ramp / Clifton St off-ramp, veh/h | 1,024 / 617 | 700 / 1,014 | 653 / 1,087 |
| Colby NB left onto Alcatraz west / east, veh/h | 131 / 32 | 11 / 8 | 13 / 7 |
| Colby St whole street NB / SB (observed) | 102 / 39 | | 72 / 55 |
| Alcatraz Ave entries at Colby St and Hillegass Ave | 360 | 325 | 136 |
| Removals per hour (min to max) | below 1 | 0.30 (0 to 1) | 0.30 (0 to 2) |
| Stations below GEH 5, fitted / held out | 85% | 69% / 56% | 65% / 55% |
| AM removals per hour; midday | below 1 | 0.00; 0.00 | 0.00; 0.00 |
| Telegraph Ave NB / SB travel time, s (observed 302 to 420 / 300 to 376) | | 307 / 308 | 299 / 299 |

D5 still fails (Colby St SB to the freeway is 21 points high: the fit's own static share is 44 against the simulator's 66, a routing difference). The station rule is not met. The area stays `uncalibrated`, `experimentalPeriods` stays `["pm_peak"]` (all three periods hold D16 now, but share and station rules fail, so no flag changed).

### The 52nd St and Clifton St ramps

Diagnosed. With the router's free-flow costs the flows from the freeway gates use the 52nd St ramp at 1,014 veh/h and Clifton St at 729 (the static fit: 1,039 and 730). Adding the simulator's measured link delays gives 785 and 951 against 706 and 990 simulated, so the split is the delay on the 52nd St side, and demand is assigned to one mainline gate, not per ramp gate. Fix attempted: measured delays in the fit (one cost-loop step by hand). Ramps 802 and 956 and removals 0.1 with the old weights, but 727 and 1,008 and removals 5.8 per hour with the heavier share weights, so it was not kept. Two or three damped iterations are needed and each rebuild takes 8 minutes; not run.

### The Colby St left turn

Tested and the round 18 conclusion holds, with a reason. The movement costs 19.9 s in the router. Of 6,019 veh/h of freeway-origin flows, 5,466 cost more than 40% above their best route when they use it, and 128 veh/h are within 10% with measured delays. The fit pins 87% of these flows at their bound. Residential cost factor 1.0 in the simulator gave 9 veh/h. Needed: origins and destinations of the 131 left-turners (select-link or plate survey), or travel times on Colby St, to show that drivers see Colby St as cheaper than the router does.

### Tried and not kept

- Cap on the freeway share of study-area ends at 0.5 and 0.7: shares 38 / 35 / 53 / 30 and 39 / 44 / 52 / 31, through cars lower, removals 0.1 and 0.8. Left in the config as `studyEndFreewayCap`, unset.
- Residential cost factor 1.0 or 1.1 in the simulator, old demand: shares 50 / 64 / 52 / 52, removals 1.3 and 1.2.
- Side rule alone (no weights): shares 70 / 75 / 61 / 70, removals 3.4.

### What remains

1. Colby St SB to the freeway 66 against 45 (simulator against the static fit's 44).
2. Alcatraz Ave entries at Colby St and Hillegass Ave: 136 against 360 counted, a regression; the north-side origins now sit beyond the corner and the router prefers other routes. Through on Colby NB 71 against at least 102, Hillegass SB 38 against at least 79.
3. Ramps 653 against 1,024 and 1,087 against 617: damped cost loop.
4. Colby St left turn: data above.

## Twentieth round: the assumed Colby St left turn, Alcatraz Ave entries, the ramp loop (change calibration-round-20)

Seeds 1 to 10, scale 1.0, 60 minutes. Before: network c05a22fc9ebe8816, demand 9971e748dcad8069. After: network c05a22fc9ebe8816 (unchanged), demand 259ceb1f64135196 (changed). The simulator gained an additive `via` field on demand flows; a demand file without it gives the same results as before (the round 19 demand reproduces 0.30 removals and the shares of that round). Decisions are in `openspec/changes/archive/*-calibration-round-20/design.md`.

### Result

| PM peak, seeds 1 to 10 | Target | Before (round 19) | After |
| --- | --- | --- | --- |
| Colby St NB left onto Alcatraz Ave west / east, veh/h | 131 / 32 | 13 / 7 | 137 / 7 |
| Alcatraz Ave entries at Colby St, Hillegass Ave, Dana St, veh/h | 360 | 136 | 189 |
| 52nd St off-ramp / Clifton St off-ramp, veh/h | 1,024 / 617 | 653 / 1,087 | 692 / 990 |
| Through cars Colby St NB (observed 102 to 145) | | 71 | 121 |
| Through cars Hillegass Ave SB (79 to 120) | | 38 | 24 |
| Through cars Hillegass Ave NB (48 to 95) | | 46 | 53 |
| Through cars Colby St SB (39 to 117) | | 84 | 54 |
| Whole-street cars Colby St NB / SB (102 / 39) | | 72 / 55 | 82 / 44 |
| Whole-street cars Hillegass Ave NB / SB (48 / 79) | | | 49 / 14 |
| Headline shares Hillegass NB / Colby NB from, Hillegass SB / Colby SB to freeway | 47 / 47 / 68 / 45 | 56.8 / 51.8 / 67.3 / 66.4 | 51.7 / 37.2 / 52.5 / 38.2 |
| Mean headline error, points (D5, within 10) | | 9.2 (3 of 4 within 10) | 9.2 (3 of 4 within 10; Hillegass SB is 15.5 low) |
| Removals per hour, PM; AM; midday | below 1 | 0.30; 0.00; 0.00 | 0.00; 0.10; 0.00 |
| Stations below GEH 5, PM fitted (190) / held out (55) | 85% | 65% / 55% | 67% / 65% |
| Telegraph Ave NB / SB travel time, s (observed 302 to 420 / 300 to 376) | | 299 / 299 | 298 / 304 |

D5 still fails (Hillegass Ave SB to the freeway is 15.5 points low) and the station rule is not met, so the area stays `uncalibrated` and `experimentalPeriods` stays `["pm_peak"]`. All three periods hold D16. The AM peak has one removal in seed 4 at 52nd St and Shattuck Ave (link 1662) (the signal approach studied in round 18).

### 1. The Colby St left turn, forced (ASSUMPTION)

Project lead decision of 2026-11-14: add an assumed set of trips so the modeled turn matches the 131 counted. The mechanism is `assumedMovementFlows` in the demand config (`tools/lib/assumed-movements.ts`, no street names in code). Candidates are the flows of the seed table whose route through the movement costs at most 1.3 times their best route (the median pair costs 1.20); the 131 veh/h are split over them in proportion to their seed volume, 0.62 over flows with no end in the study area. The share comes from the volunteer count: 102 cars drove the whole of Colby St northbound and 164 left it at Alcatraz Ave, so 62% of the exits are whole-street cars. Result: 52 flows, 81 veh/h through (largest origins the SR-24 gate 602, 32 veh/h, and the two Tunnel Road gates, 14 and 13; largest destinations Ward St, 28, and Ashby Ave, 23) and 50 veh/h local (origins along Colby St and 63rd St at College Ave, mostly bound for the freeway gates and Ward St). The flows carry `via`; the simulator routes the trip to the approach link, through the turn and on, and the fit holds their volume. The modeled turn is 137 against 131; AM 86 against 78, midday 82 against 81. Colby St NB through cars rose from 71 to 121, inside the observed 102 to 145. Labeled an ASSUMPTION in code, config, the fit report, the demand provenance (Sources page), `data/demand/README.md` (steps 51 to 54) and the design.

### 2. Alcatraz Ave entries (136 against 360)

In the fit the three entry links sit at the upper bounds of their flows (Hillegass Ave 43 of 178 after the fit, Colby St 76 of 139, Dana St 10 of 43). The flows that cross them are trips of nodes north of Alcatraz Ave, which since the side rule no longer sit on the boundary corners. The study-area trip-rate factor (4.6 and 6.2, from the volunteer count) applies only to study-area blocks, so those trips are at the unscaled rate; before the side rule the corners were study-area nodes and took the factor by accident, which is where the 325 came from. The count belongs partly to a different set of trips: about 340 of the 360 entries are turns from Alcatraz Ave itself (76 and 50 onto Colby St, 76 and 98 onto Hillegass Ave, about 40 onto Dana St), cars on the arterial that turn in, and about 20 come straight from the streets north. Those turns are counted movements the table cannot reach, the same kind as the Colby St left.

Fix: blocks whose loading node lies outside the study area within 250 m of it take the study-area factor (`local.countCalibration.neighborM`, `neighborScale` 1, ASSUMPTION). Entries 152 to 189 (136 before the round), through cars and whole-street counts on all four blocks moved toward the observed ranges, removals 0.00. Tried (PM, ten seeds; the first row has the assumed left turn only):

| Variant | Entries | PM removals per hour | Headline error, points | Through cars Colby NB / Hillegass SB / Hillegass NB / Colby SB |
| --- | --- | --- | --- | --- |
| No neighbor factor | 152 | 0.20 | 10.2 | 123 / 38 / 48 / 85 |
| 250 m x 1.0 (kept) | 189 | 0.00 | 9.2 | 121 / 24 / 53 / 54 |
| 400 m x 0.5 | 190 | 1.20 | 6.1 | 127 / 42 / 52 / 78 |
| 400 m x 1.0 | 244 | 3.00 | 11.7 | 128 / 29 / 50 / 94 |

The count is not reached. The five Alcatraz Ave turn-ins as assumed movements through the same mechanism (config only, not shipped, needs an project lead decision; 337 veh/h of assumed trips): without the neighbor factor entries 365, through cars 130 / 91 / 42 / 101 (Hillegass SB inside 79 to 120), removals 0.20, headline error 9.6 (Hillegass SB 52.4); with it entries 343, through cars 127 / 84 / 42 / 89, removals 1.10, error 10.3. The entries are in the design (D8).

### 3. The ramp split, damped measured-delay loop

`tools/cost-loop.ts` ran with a new objective (`--objective ramp`: keep an iteration only if PM removals stay below 1.0 per hour, the counted off-ramps move toward their counts by at least 25 veh/h and the headline error is within 0.5 points). Results are in `rockridge.cost-loop.md`. Iteration 0 is the baseline (removals 0.00, ramp count error 247 veh/h); iteration 1 (measured delays of iteration 0): removals 7.90, headline error 15.5, ramp count error 352; iteration 2 (successive average, cost gap 0.078, converged): removals 6.90, error 15.1, ramp error 307. The PM peak loses stability in both. In iteration 2, 26 of the 66 removals the seed reports list are at the Ashby Ave and Claremont Ave signal (links 4329 and 3395), the rest at Domingo Ave, Claremont Crescent and the 52nd St approach. Not kept: no delays file ships, and the 52nd St ramp stays at 692 and Clifton St at 990. The loop stops at the first unstable iteration; `--no-stop` (new) let it run the second. Free-flow assignment (BPR alpha 0) and alpha 0.05 give the same split (701 and 1,001 veh/h) and removals of 1.0.

### 4. Colby St SB freeway share, static against simulator

Diagnosed on the round 19 demand plus the assumed turn (static 44.2%, simulator 69.0%, three seeds). The static assignment loads the Colby St SB block with 408 veh/h, of which 216 veh/h are trips between nodes north and far south or west with no freeway end (Regent St to Market St 41, 66th St at Dana St to Lawton Ave 38, Hillegass Ave at Woolsey St to 43rd St 25, and so on) spread over several routes. The simulator's drivers put 46 veh/h of those pairs on the block. The freeway-bound trips are about equal in the two (180 and 129 veh/h). So the static share is lower because its denominator holds long-distance pairs that the simulator sends elsewhere. Probable cause, not tested directly: the volume-delay function of the assignment loads Telegraph Ave and College Ave more than the simulator does (its arterial speed is 9.3 m/s), and the cost loop that would test it destabilizes the PM peak (above). Free-flow costs (alpha 0) did not change the simulator's shares. With the neighbor factor the two agree (static 39.5%, simulator 39.2%; seeds 1 to 3) and the shipped simulator share is 38.2, 6.8 points low. The agreement came from the changed demand, not from a routing fix.

### What remains

1. Hillegass Ave SB: through cars 24 against 79 to 120, whole-street cars 14 against 79, entries 89 against 178, freeway share 52.5 against 68. The counted turn-ins from Alcatraz Ave fix it (D8) with an project lead decision; the router sends those cars by Telegraph Ave and Claremont Ave, where the model is too fast (Telegraph Ave NB 298 s against 302 to 420 observed).
2. 52nd St and Clifton St off-ramps 692 and 990 against 1,024 and 617. Measured delays make the PM peak unstable; the share constraints (weight 3) pull freeway trips onto the Colby St and Hillegass Ave side, which the Clifton St ramp serves.
3. Hillegass Ave SB to the freeway 52.5 against 68, Colby St NB from the freeway 37.2 against 47.

## Twenty-first round: intents of through cars (change through-trip-intents)

Seeds 1 to 10, scale 1.0, 60 minutes. Before: network c05a22fc9ebe8816, demand 259ceb1f64135196 (round 20). After: network c05a22fc9ebe8816 (unchanged), demand 67f09a8c56c92603 (changed). The simulator is unchanged. Decisions are in `openspec/changes/archive/*-through-trip-intents/design.md`.

Project lead decision of 2026-11-14. Asked whether to force the five counted Alcatraz Ave turn-ins the way round 20 forced the Colby St northbound left, the project lead answered: "Can you try mapping out intent for cut through like Southbound Telegraph cutting through Colby to get to 24 Eastbound. Or Berkeley traffic bypassing College via Hillegass to get to 24, etc." So through cars are explained and shaped by intent: where the driver comes from, where they are going and which arterial they avoid. Part A is a report (the intent map). Part B shapes the demand by intent.

### Result

| PM peak, seeds 1 to 10 | Target | Before (round 20) | After |
| --- | --- | --- | --- |
| Through cars Hillegass Ave SB (observed 79 to 120) | | 24 | 111 |
| Through cars Colby St SB (39 to 117) | | 54 | 109 |
| Through cars Hillegass Ave NB (48 to 95) | | 53 | 72 |
| Through cars Colby St NB (102 to 145) | | 121 | 149 |
| Through cars on all residential and service streets of the study area (no observed counterpart) | | 482 | 675 |
| Whole-street cars Hillegass Ave NB / SB (48 / 79) | | 49 / 14 | 44 / 72 |
| Whole-street cars Colby St NB / SB (102 / 39) | | 82 / 44 | 80 / 48 |
| Headline shares Hillegass Ave NB / Colby St NB from, Hillegass Ave SB / Colby St SB to freeway | 47 / 47 / 68 / 45 | 51.7 / 37.2 / 52.5 / 38.2 | 46.8 / 37.0 / 61.7 / 42.6 |
| Mean headline error, points (D5, within 10) | | 9.2 (3 of 4 within 10) | 4.7 (4 of 4 within 10) |
| Alcatraz Ave entries at Colby St, Hillegass Ave, Dana St (assessment) | 360 | 189 | 259 |
| Counted Alcatraz Ave turns, modeled (counted): Colby St NB left / right | 131 / 32 | 137 / 7 | 138 / 31 |
| Alcatraz Ave onto Colby St SB from the west / east | 76 / 50 | 27 / 20 | 57 / 34 |
| Hillegass Ave NB left / right onto Alcatraz Ave | 43 / 54 | 39 / 13 | 55 / 53 |
| Alcatraz Ave onto Hillegass Ave SB from the west / east | 76 / 98 | 65 / 8 | 79 / 57 |
| 52nd St off-ramp / Clifton St off-ramp, veh/h | 1,024 / 617 | 692 / 990 | 683 / 986 |
| Removals per hour, PM; AM; midday (D16: below 1.0) | below 1 | 0.00; 0.10; 0.00 | 0.40; 0.00; 0.00 |
| Stations below GEH 5, PM fitted (190) / held out (55) | 85% | 67% (128) / 65% (36) | 68% (130) / 62% (34) |
| Stations below GEH 5, AM fitted (153) / held out (47); midday fitted (192) / held out (56) | 85% | 67% / 62%; 77% / 77% | 66% / 64%; 76% / 79% |
| Telegraph Ave NB / SB travel time, s (observed 302 to 420 / 300 to 376) | | 298 / 304 | 299 / 304 |

D5 now holds (all four headline shares within 10 points; Colby St NB from the freeway is 10 points low at 37.0 against 47). The station rule is still not met (68% of the fitted stations below GEH 5 against 85%), so the area stays `uncalibrated`. The three periods hold D16; the PM peak has 4 removals in 10 runs (seeds 2, 5, 9 and 10; two at the Shattuck Ave and 52nd St signal, link 1705, one at Claremont Crescent), against none before. `experimentalPeriods` stays `["pm_peak"]`: the assessment suggests none because all periods are stable, and earlier rounds kept the flag while share and station rules failed. That is a decision for the project lead and is not changed here. The AM and midday turn counts were not measured against targets of their own beyond the station fit above.

### Part A: the intent map

`calibrate` (single run and the ten-seed summary) now prints, for the four counted blocks and for all residential and service streets of the study area, the through cars per hour by origin group and destination group, and the arterial each trip would otherwise use: the boundary streets that its shortest free-flow path runs on near the study area when the study area's own residential streets are closed. The groups are data in `approachGroups` of `data/areas/rockridge.json` (20 groups for the 123 gates: Telegraph Ave and College Ave from the north, Alcatraz Ave from the west, SR-24 on-ramps and off-ramps by direction and end, and the other streets of each compass side). Blocks that are not gates take the group of the nearest surface gate, so a group name such as "South-east Oakland" is the name of a gate and its surroundings and not a measured place. The derivation is `tools/lib/approach-groups.ts`, the report is `crates/sim/src/bin/calibrate/intent.rs`.

What the map says about the round 20 state (PM, ten seeds): 482 through veh/h used a residential or service street of the study area, 274 of them on a path that would otherwise be Telegraph Ave, 66 Claremont Ave, 25 Telegraph Ave then Claremont Ave and 24 College Ave then Alcatraz Ave. The largest pairs were SR-24 eastbound off-ramp traffic bound for Berkeley side streets (80), Berkeley side streets bound for the SR-24 westbound on-ramps (45) and for south-east Oakland (40), and the reverse (33). The two counted southbound blocks were short of their observed ranges for a reason the map shows: Hillegass Ave southbound had 24 through cars and almost none of them turned in from Alcatraz Ave (the count has 174 turn-ins and 4 cars coming straight from the north); the model's through cars came down Hillegass Ave from the Berkeley side-street gates.

After shaping by intent: 675 through veh/h on those streets, 386 of them on a path that would otherwise be Telegraph Ave. By destination, 194 veh/h go to the SR-24 westbound on-ramps and 8 to the eastbound on-ramps. That follows the network and the gate totals, not a count: the on-ramp at Hudson St that Colby St and Hillegass Ave reach by way of Claremont Ave is tagged westbound in the network, and the westbound exit gate carries four times the trips of the eastbound one (3,491 and 879 veh/h in the PM demand). No source in the repository splits the freeway-bound cars of these blocks by direction, so "to SR-24 eastbound" is rare in the model and the data neither support nor contradict that.

### What the data say about intent, observed and assumed

Observed (volunteer count of Feb 25, 2025, PM peak; whole streets are the cars that drove from one end to the other):

- Hillegass Ave SB: 178 cars entered at the top (76 turned in from Alcatraz Ave from the west, 98 from the east, 4 came straight from the north), 79 drove the whole street, 40 ended their trip along it, 68% of the block's trips (109 veh/h) were freeway-bound. Via shares: 46% by way of Alcatraz Ave WB, 26% Benvenue Ave, 16% College Ave.
- Colby St SB: 139 entered at the top (76 from the west, 50 from the east, 13 from the north), 39 drove the whole street, 43 ended along it, 45% (72 veh/h) were freeway-bound, 22% came by way of Telegraph Ave.
- Colby St NB: 182 entered at the south end (121 from the southwest of Claremont Ave, 57 from Forest St, 4 from the northeast), 102 drove the whole street, 164 left at Alcatraz Ave (131 left, 32 right, 1 straight), 47% came from a freeway.
- Hillegass Ave NB: 94 entered at the south end, 48 drove the whole street, 109 left at Alcatraz Ave (43 west, 54 east, 12 straight), 47% came from a freeway; 33% went on to Benvenue Ave and 6% to College Ave.

Inferred (ASSUMPTION): the freeway-bound or freeway-origin cars that did not join the street mid-block are the block's freeway trips times entering / (entering + joined mid-block), spread over the turn counts in proportion. That gives 87 veh/h for Hillegass Ave SB (0.50 of the 174 turn-ins), 46 for Colby St SB (0.365 of 126), 65 for Colby St NB (0.40 of the 164 exits) and 40 for Hillegass Ave NB (0.37 of 109). Observed ranges bound them: the low end uses the whole-street share, the high end the unadjusted freeway share. Which approach group the cars belong to within a side of Alcatraz Ave is assumed, except for the 22% of Colby St SB trips that came by way of Telegraph Ave (35 of the 76 turn-ins from the west). No through traffic is placed from the hills onto the northbound streets, because only 4 of the 182 cars entering Colby St at the south end came from the northeast of Claremont Ave.

### The intents, model against implied (PM, ten seeds, veh/h)

One row per intent. "Implied" is the number the counts imply with its range; "before" and "after" are the model's through cars between the same groups on that block (mean of ten seeds). The rows are not independent of the block totals: the through cars of the model that no listed intent covers are the last row of each block.

| Intent | Basis | Implied (range) | Before | After |
| --- | --- | --- | --- | --- |
| Hillegass Avenue SB: through cars 24 before, 111 after | | | | |
| Telegraph Ave, Alcatraz Ave west and West Berkeley traffic turning off Alcatraz Ave onto Hillegass Ave to reach SR-24 | OBSERVED count x ASSUMPTION share | 38 (34 to 48) | 0 | 39 |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Hillegass Ave to reach SR-24 | OBSERVED count x ASSUMPTION share | 49 (44 to 62) | 1 | 53 |
| Other through cars, no intent listed | | | 23 | 18 |
| Colby Street SB: through cars 55 before, 109 after | | | | |
| Southbound Telegraph Ave traffic using Colby St to reach SR-24 | OBSERVED count x ASSUMPTION share | 13 (11 to 20) | 9 | 24 |
| Alcatraz Ave west, Ashby Ave and West Berkeley traffic using Colby St to reach SR-24 | OBSERVED count x ASSUMPTION share | 15 (13 to 23) | 0 | 16 |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Colby St to reach SR-24 | OBSERVED count x ASSUMPTION share | 18 (15 to 29) | 17 | 39 |
| Other through cars, no intent listed | | | 28 | 30 |
| Colby Street NB: through cars 121 before, 149 after | | | | |
| SR-24 off-ramp traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | OBSERVED count x ASSUMPTION share | 52 (38 to 62) | 17 | 54 |
| Telegraph Ave and south-side traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | ASSUMPTION | 29 (19 to 43) | 36 | 51 |
| SR-24 off-ramp traffic using Colby St to reach College Ave and Berkeley (right at Alcatraz Ave) | OBSERVED count x ASSUMPTION share | 13 (9 to 15) | 19 | 18 |
| Telegraph Ave and south-side traffic using Colby St to reach College Ave and Berkeley | ASSUMPTION | 7 (5 to 11) | 13 | 24 |
| Other through cars, no intent listed | | | 36 | 2 |
| Hillegass Avenue NB: through cars 53 before, 72 after | | | | |
| SR-24 off-ramp traffic using Hillegass Ave to reach Alcatraz Ave west and Telegraph Ave north | OBSERVED count x ASSUMPTION share | 16 (9 to 20) | 0 | 17 |
| SR-24 off-ramp traffic using Hillegass Ave to reach College Ave and Berkeley | OBSERVED count x ASSUMPTION share | 20 (11 to 25) | 16 | 21 |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach Alcatraz Ave west | ASSUMPTION | 3 (0 to 10) | 9 | 8 |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach College Ave and Berkeley | ASSUMPTION | 4 (0 to 13) | 22 | 23 |
| Other through cars, no intent listed | | | 6 | 3 |

The southbound intents land inside their ranges where the demand forces them (Hillegass Ave from both sides, Colby St from the west without Telegraph Ave). They are above their range where plain flows between the same groups also use the street: Southbound Telegraph Ave traffic on Colby St is 24 against 13 implied, and College Ave and Berkeley traffic turning onto Colby St is 39 against 18. The northbound south-side intents are above for the same reason (Colby St left 51 against 29, right 24 against 7, Hillegass Ave east 23 against 4). The counted movement volumes are not exceeded by the assumed flows (they are pinned at the stated shares); the modeled turns are above the counts at two movements (Colby St NB left 138 against 131, Hillegass Ave NB left 55 against 43) because plain flows add to the assumed ones.

### Part B: what changed in the demand

- `assumedMovementFlows` movements can carry `intents` (origin group, destination group, share of the count or PM veh/h). Candidates are the seed flows between the two groups whose route through the movement is within 1.3 times their best route and does not loop; the volume is split over them in proportion to their seed volume. Intents of one movement cannot add up to more than its count. Tests: `tools/assumed-movements.test.ts`, `tools/approach-groups.test.ts`, `calibrate/intent.rs`.
- The Colby St northbound left keeps its 131 veh/h and 0.62 through share, now as SR-24 off-ramp traffic 0.40, Telegraph Ave and south-side traffic 0.22 and residents leaving 0.38. Round 20's candidates included Tunnel Rd gates (27 veh/h); the count does not support through traffic from the northeast there, and the intents drop it.
- New movements: Colby St northbound right (32), Hillegass Ave northbound left and right (43, 54), Alcatraz Ave onto Hillegass Ave southbound (76, 98) and onto Colby St southbound (76, 50). PM assumed volume in total: 393 veh/h (260 on the northbound turn-outs with their local shares, 133 freeway-bound turn-ins). Dana St is left out.
- Double counting: the plain flow of each pair that an assumed flow also serves gives up the trips the assumed flow carries before the fit, at most 80% of it (PM 336 veh/h, AM 182, midday 196). The fit rescales plain flows to the counts afterwards, so this is a better starting point. It does not keep a pair's total at its seed value: the south-side intents above show plain flows returning.
- Everything is labeled ASSUMPTION in the config, the fit report (intents table), the demand provenance, `data/demand/README.md` (steps 55 to 58), the targets file and the design.
- D16 held at these volumes, so nothing was backed off.

### Tried and not kept

East side turns by the observed via shares: the Hillegass Ave northbound east turns placed on the Berkeley side-street group (33% of those trips go on to Benvenue Ave, 6% to College Ave) and the Hillegass Ave southbound turn-in from the east split by the 26% and 16% via shares of Benvenue Ave and College Ave. PM, ten seeds: removals 1.3 per hour (13 in total against 4, so D16 fails), headline error 5.6 with 3 of 4 within 10, Hillegass Ave northbound trips reaching College Ave 20.6% (observed 6%) and Benvenue Ave 10.4% (observed 33%), Hillegass Ave southbound from Benvenue Ave 4.8% (observed 26%). The routes to the Berkeley side-street gates use College Ave, so the destination group does not change the observed via shares.

### What did not work, and what remains

1. The via shares of the streets east of Hillegass Ave are not reproduced. Hillegass Ave northbound trips reaching College Ave rose from 6.2% to 16.4% (observed 6%) and those reaching Benvenue Ave stay at 4.1% (observed 33%); Hillegass Ave southbound trips from Benvenue Ave are 4.1% against 26%. The shares that did move toward the data: Hillegass Ave southbound from Alcatraz Ave WB 4.5% to 30.1% (46%), from College Ave 2.0% to 16.4% (16%), Colby St southbound from Alcatraz Ave EB 11.7% to 24.3% (43%) and from WB 8.8% to 15.3% (46%).
2. Where candidates are scarce the intent lands on one pair: the turn-in from the west onto Hillegass Ave has 3 candidate flows and 2 kept, and all 38 veh/h are Telegraph Ave from the north to the SR-24 westbound on-ramps. The intent is honored, the variety of origins is not.
3. Colby St northbound trips from a freeway are 37.0% against 47. The off-ramp intents carry 52 + 13 veh/h through the left and right turns, and plain flows from other origins keep the share down. The Clifton St off-ramp is 986 against 617 and the 52nd St off-ramp 683 against 1,024, unchanged.
4. Colby St northbound through cars are 149 against an upper bound of 145 (the block volume 174 less 29 cars that end along it).
5. The intent map ignores signal delay and turn bans in its alternative path, so it says which arterial is avoided and not what the driver saves. The 400 m and 100 m thresholds of the arterial label are assumptions.
6. Colby St SB and Hillegass Ave NB east-turn intents have no observed origin split beyond the sides of Alcatraz Ave.
7. The proposals file (`data/proposals/rockridge.md`) carries the round 19 demand hash; `explore` has not been rerun.

## Twenty-second round: detour check for assumed flows (change via-detour-fallback)

PM peak, seeds 1 to 10, scale 1.0, 60 minutes. Network c05a22fc9ebe8816 (unchanged). Demand 67f09a8c56c92603 to 8efd5df07ab6557a: volumes identical, each assumed flow now carries `via.maxDetour` and, for 445 of 455 PM flows, one alternative movement. The simulator changed (detour check, alternatives, loop rule). Decisions are in `openspec/changes/archive/*-via-detour-fallback/design.md`.

The project lead opened a scenario with modal filters at Martin St and Ayala Ave and at Ayala Ave and Forest St and diverters at 62nd St and Colby St and at 63rd St and Hillegass Ave, and asked why 63rd St got busy. The simulator kept sending assumed-movement trips through their Colby St and Hillegass Ave movements after the diverters cut the way to them, and they looped around 63rd St and Colby St. 63rd St went from 1,073 to 1,556 veh/h (seeds 1 to 3); with every `via` removed from the demand it went up 44. Now a movement is made only while its free-flow route costs at most `maxDetour` (1.3, ASSUMPTION) times the plain route in the current network and adds no loop the plain route does not have; else the driver tries the alternative (the same turn on the parallel street, ASSUMPTION) and then the plain route.

### Baseline

| PM peak, seeds 1 to 10 | Round 21 (same demand file) | After |
| --- | --- | --- |
| Through cars Hillegass Ave SB / Colby St SB / Hillegass Ave NB / Colby St NB | 111 / 109 / 72 / 149 | 112 / 107 / 73 / 144 |
| Headline shares | 46.8 / 37.0 / 61.7 / 42.6 | 48.0 / 37.9 / 60.7 / 41.9 |
| Study-area through cars | 675 | 671 |
| Removals per hour (PM / AM / midday) | 0.40 / - / - | 1.10 / 0.10 / 0.00 |

The round 21 simulator run on this demand file reproduces the round 21 numbers exactly. The first version of the check used live costs and dropped 24 of the 353 baseline assumed movements per hour (through cars on Colby St NB 136); judging on free-flow costs and ignoring loops that the plain route has too leaves 9 of 353 dropped.

PM removals are 1.10 per hour over seeds 1 to 10 (rule: below 1.0). They sit at hill nodes (Glenwood Glade, Margarido Dr) that assumed trips do not use (4 of about 660 trips per hour through the first node are `via`). Seeds 11 to 20 give 0.40 for the new simulator and 0.60 for the round 21 one; the round 21 simulator at scale 1.001 gives 0.50 on seeds 1 to 10. The ten-seed removal mean moves by this much without any change that touches them, so it is not a measure of the check.

### Project lead's scenario, PM peak, seeds 1 to 3

63rd St, all blocks: 1,063 to 1,115 veh/h (was 1,073 to 1,556). Trips of assumed flows with a repeated node, one end inside: 2% to 2% (was 4% to 35%). Through trips on local streets: 574 to 210 per run (was 579 to 363). Displaced traffic goes to Telegraph Ave between 52nd and 58th St (+170 to +250 veh/h in each seed) and, locally, to 61st St, 60th St and McAuley St. The per-block table is in the design.

### What remains

- 10 PM assumed flows (66 veh/h, the southbound turn-ins from the west) have no alternative because their intents name different groups on the two streets.
- A trip with a long route passes the 1.3 tolerance with a detour of several blocks: about 13 trips per run turn onto 63rd St from Telegraph Ave to make the Colby St turn onto Alcatraz Ave. Whether 1.3 of the whole trip is the right tolerance for a block-scale detour is open (ASSUMPTION).
- The PM removal mean of 1.10 on seeds 1 to 10 is noise at remote nodes, but the stability rule reads it as a fail; the project lead may want a ruling.

## Twenty-third round: lead-lag at 52nd St and Shattuck Ave, alternatives by pair, ramp split, stations (change calibration-round-23)

PM peak, seeds 1 to 10 (removals also 11 to 20), scale 1.0, 60 minutes. Before: network c05a22fc9ebe8816, demand 8efd5df07ab6557a. After: network 5fe8241a6ba1e306 (changed: the signal observations at 52nd St and Shattuck Ave), demand 222fb062e8e5dc1c (changed: `via.alternatives` of 10 more PM flows, volumes identical). The simulator changed (an approach can be in two phases). Decisions are in `openspec/changes/archive/*-calibration-round-23/design.md`. The "before" column was measured again on the round 22 files at the start of this round and matches round 22.

### Result

| PM peak, seeds 1 to 10 | Target | Before | After |
| --- | --- | --- | --- |
| Through cars Hillegass Ave SB / Colby St SB / Hillegass Ave NB / Colby St NB | 79-120 / 39-117 / 48-95 / 102-145 | 112 / 107 / 73 / 144 | 111 / 103 / 74 / 146 |
| Whole-street cars Hillegass Ave SB / Colby St SB / Hillegass Ave NB / Colby St NB | 79 / 39 / 48 / 102 | 71 / 49 / 44 / 78 | 73 / 49 / 44 / 81 |
| Headline shares Hillegass Ave NB from / Colby St NB from / Hillegass Ave SB to / Colby St SB to | 47 / 47 / 68 / 45 | 48.0 / 37.9 / 60.7 / 41.9 | 47.8 / 37.7 / 61.0 / 40.5 |
| Mean headline error, points (D5, within 10) | | 5.1 (4 of 4) | 5.4 (4 of 4) |
| Alcatraz Ave entries at Colby St, Hillegass Ave, Dana St | 360 | 259 | 251 |
| 52nd St off-ramp / Clifton St off-ramp, veh/h | 1,024 / 617 | 682 / 982 | 899 / 828 |
| Eastbound approach at Shattuck Ave and 52nd St, veh/h | 1,427 | 833 | 1,110 |
| Removals per hour, PM seeds 1-10 / 11-20 / all 20 (D16: below 1.0) | below 1 | 1.10 / 0.40 / 0.75 | 0.40 / 0.30 / 0.35 |
| Removals per hour, AM / midday | below 1 | 0.10 / 0.00 | 0.00 / 0.00 |
| Stations below GEH 5, PM fitted (190) / held out (55) | 85% | 127 (67%) / 34 (62%) | 131 (69%) / 34 (62%) |
| Stations below GEH 5, AM fitted (153) / held out (47) | 85% | 102 (67%) / 30 (64%) | 103 (67%) / 33 (70%) |
| Stations below GEH 5, midday fitted (192) / held out (56) | 85% | 146 (76%) / 44 (79%) | 148 (77%) / 44 (79%) |
| Off-ramps AM (counted 898 / 524) and midday (635 / 383), 52nd St / Clifton St | | 631 / 807 and 570 / 574 | 807 / 696 and 750 / 477 |
| Telegraph Ave NB / SB travel time, s (observed 302-420 / 300-376) | | 299 / 306 | 298 / 306 |
| Completed trips per hour, arterial speed (m/s) | | 24,523, 9.33 | 24,558, 9.31 |

The through-car and share changes are inside the seed spread (the interval of a ten-seed mean is about 4 veh/h on the through cars and 2 points on the shares); Colby St NB is 1 above its observed upper bound of 145 where it was 1 below. The through cars on AM and midday are not measured: the through check has no AM or midday targets.

### 1. Where the removals were, and the cause

Seeds 1 to 20 of the round 22 state had 15 removals (1.10 per hour on seeds 1 to 10, 0.40 on 11 to 20). The seed reports list them (the round 22 note naming Glenwood Glade and Margarido Dr does not match the lists):

| Site | Removals (seeds) | Cause |
| --- | --- | --- |
| 52nd St eastbound approach at Shattuck Ave: links 1669, 1749 and 1662 (the ramp merge and the approach) and link 1705 (Shattuck Ave northbound) | 10 (2, 6, 9, 14, 16) | The signal plan. The worksheet gives eastbound left 33.5 s, eastbound through 57.2 s, westbound through 27.6 s, northbound 34.9 s and southbound 25.4 s in a 110 s cycle [CHRCO-EIR2014]. Round 17 put the eastbound approach in a phase of its own with the 33.5 s of the left and the westbound approach in one with its 27.6 s, so the eastbound through had 33.5 s against 57.2 s. The approach carries the 52nd St off-ramp (1,024 veh/h counted) and the ramp's queue stood on the merge. |
| Alcatraz Ave at Shattuck Ave, link 2081 | 1 (8) | Not investigated; no repeat |
| Claremont Crescent, link 3376 | 3 (3, 15) | The Crescent leaves Claremont Ave and joins Ashby Ave by a 9.6 m one-way link behind an OSM stop sign; its last car waits to merge into the Ashby Ave eastbound lane, which holds the Claremont Ave signal queue. The Ashby Ave approach has one lane in the network (OSM `lanes=2` for both directions) while the Synchro worksheet of the Safeway study gives it a saturation flow of 3,490 (two lane groups); whether a short second lane exists is not in the extract. Not changed |
| Service link 3418 near the Ashby Ave and Tunnel Rd gate | 1 (2) | Not investigated; no repeat |

After the change the same 20 seeds have 7 removals: Claremont Crescent 4 (seeds 3 and 4), Shattuck Ave northbound (link 1705) 1, Avalon Ave 1 and an unnamed link 1. The 20-seed mean is 0.35 (0.40 and 0.30). The three periods hold D16.

The fix is `runsWithHeading` in the signal observations: the eastbound approach has green alone for 57.2 less 27.6 s and then together with the westbound approach for 27.6 s, and the northbound and southbound approaches take the rest (37.8 s against 34.9 observed). AM uses 37.7 s and 19.4 s of its worksheet, midday the PM plan (ASSUMPTION as before). The eastbound through now has the 57.2 s of its worksheet; the left turn keeps 29.6 s alone and the permissive green of the shared phase (ASSUMPTION: the worksheet's left phase is 33.5 s).

### 2. The west-side turn-ins have alternatives

`withAlternatives` matched an intent of one street with an intent of another by exact group names (`west-side` against `telegraph-north` and `west-side-other`), which left 10 PM flows (66 veh/h) without an alternative. It now matches on the pair: a movement is an alternative when one of its intents has an origin set and a destination set that contain the origin group and the destination group of the flow's pair. All 455 PM flows (393 veh/h; AM 260, midday 386) now have one. Volumes did not change (no flow differs in origin, destination or volume). The baseline run is identical flow by flow in the through cars, shares and link flows, because nothing in it is blocked.

### 3. The off-ramp split

Origin-destination groups (`CAL_DUMP_RAMP_TRIPS`, new; PM, seeds 1 to 3, round 22 demand, after the signal change): every ramp trip starts at the SR-24 eastbound mainline gate (node 602). By destination group, veh/h on the 52nd St ramp / the Clifton St ramp: south Oakland 413 / 393, Berkeley side streets north of Alcatraz Ave 130 / 174, Telegraph Ave south 201 / 4, the study area 5 / 105, West Berkeley 71 / 2, Telegraph Ave north 4 / 46, the hills 0 / 38, College Ave north 0 / 27. The groups that tip the split are south Oakland (1,151 veh/h from that gate in total) and the Berkeley side streets, whose two paths cost the same to within seconds.

Path cost (router, PM, free-flow and loaded with the simulator's mean link delays): for south Oakland the Clifton St path costs 1.4 s more than the 52nd St path free-flow, and 32.5 s less loaded before the signal change, 19.1 s less after it. For the Berkeley side streets 1.4 s more free-flow, 25.7 s less before and 8.3 s less after. The loaded difference was the queue at Shattuck Ave: for one large destination the 52nd St path had 20 s of delay on the ramp link, 31 s on the approach and 20 s at Telegraph Ave and 51st St before the signal change, and 16 s, 16 s and 18 s after; the Clifton St path had 11 s at the ramp signal.

What in the network could make Clifton St cheaper, checked: the Clifton St ramp approach has 7.2 s of delay in the Safeway worksheet [SafewayCollege-DEIR2011] and 9 to 12 s in the model, so the ramp signal is not too kind (the worksheet gives the ramp 52.0 s of 80, Claremont Ave 21.0 s; the round 17 plan lets Claremont Ave have 30 to 40%). Signals exist at Clifton St, Hudson St, Colby St and Forest St, College Ave, Ashby Ave and 52nd St on Claremont Ave; lanes, speed (25 mph) and the 77 turn bans were checked against OSM in rounds 12 and 17 and no ban touches the ramps. The Telegraph Ave and 51st St signal (the 52nd St path) has 18 to 22 s of delay in the model against 37 s (eastbound) and 47 s (westbound) in its worksheet [CHRCO-EIR2014], so the 52nd St path is too cheap there, not too dear. No defect was found at Clifton St. The split moved by the signal fix (1,024 / 617 counted; 682 / 982 before, 899 / 828 after, AM 807 / 696 against 898 / 524, midday 750 / 477 against 635 / 383).

What remains is a loaded-cost gap of the static fit. Its own assignment has 1,045 on the 52nd St ramp and 718 on the Clifton St ramp (the Clifton St ramp is a held-out station, 16% above its count), against 899 and 828 in the simulator.

### 4. Stations

Failing stations, PM (GEH 5 or more; model low / high): 84 of 245 before (64 / 20), 80 after (58 / 22). 56 of the 84 are turning-movement count stations of the two environmental reviews (100 stations, 44 pass, model 0.82 of the counts in total), against 13 of 107 volunteer-count stations (94 pass, ratio 1.02) and 15 of 38 others (ramps, Caltrans, OakDOT; 23 pass, ratio 0.92).

| Corridor | Stations | Fail before (low / high) | Fail after (low / high) |
| --- | --- | --- | --- |
| SR-24 ramps (Caltrans ADT) | 16 | 6 (2 / 4) | 6 (2 / 4) |
| MLK Way and 55th St | 8 | 6 (6 / 0) | 6 (6 / 0) |
| Telegraph Ave and 51st St | 8 | 7 (7 / 0) | 6 (6 / 0) |
| Market St and 55th St (OakDOT) | 8 | 5 (5 / 0) | 5 (5 / 0) |
| MLK Way and 52nd St | 8 | 7 (7 / 0) | 5 (5 / 0) |
| Shattuck Ave and 52nd St | 8 | 6 (5 / 1) | 5 (4 / 1) |
| Alcatraz Ave and Claremont Ave | 6 | 5 (4 / 1) | 5 (4 / 1) |
| Ayala Ave (volunteer count) | 8 | 4 (0 / 4) | 4 (0 / 4) |
| SR-24 ramps and 52nd St | 6 | 5 (5 / 0) | 4 (4 / 0) |
| Telegraph Ave, 52nd St and Claremont Ave | 8 | 3 (3 / 0) | 4 (3 / 1) |
| Ashby Ave and Claremont Ave | 8 | 3 (3 / 0) | 3 (3 / 0) |

Causes:

1. The eastbound phasing at 52nd St and Shattuck Ave (fixed above): the stations on the 52nd St corridor from the ramp to Telegraph Ave gained 1 to 2 passes each at MLK Way and 52nd St, Shattuck Ave and 52nd St and the ramp intersection. Fitted stations 127 to 131 of 190; held out unchanged at 34 of 55.
2. A deficit of the demand fit. The turning-movement stations are low by 15% in total and almost all of the failures are low (58 of 80), at counts of 2010 and 2013 that are 20 to 45% above what the fit reaches: the fit's own static assignment is 865 against 1,152 at Telegraph Ave and 51st St (northbound leg). In the fit report the median factor of the counted flows is 0.10, the lower bound, in all three periods (3,490 of 8,165 AM flows sit on it), so the trip table is far larger than the counts support and the counts disagree with each other. The counts are used with no growth from the count year (ASSUMPTION in the config). The cause is the seed table and the count set, and the fix is a change to the fit, not to stations, so none was made.
3. A channelized right turn at Ashby Ave and Claremont Ave: link 3449 (an unnamed one-way link from the Ashby Ave node 37 m east of the signal to the Claremont Ave node 43 m north-east of it) carries 491 veh/h in the model, but the count's north leg and the station mapping use link 3446 alone (198 against 697). The two together give 689. The movement from Ashby Ave eastbound (link 3425) to link 3449 also exists in the router at 5.5 s, a sharp left turn across the westbound lanes onto a one-way slip, and the model uses it; whether it exists on the street was not verified. Not changed.

### Tried and not kept

Observed plans for 14 more signals from the two traffic studies (17 observations, PM peak only, greens of the cross street or of the split phases; the worksheets are listed in `docs/references.md`). PM, ten seeds (through cars Hillegass Ave SB / Colby St SB / Hillegass Ave NB / Colby St NB, headline error, removals per hour, stations fitted / held out, Telegraph Ave NB / SB s), each group on top of the kept state (`signalObservations` at 52nd St and Shattuck Ave):

| Variant | Through cars | Error | Removals | Stations | Telegraph |
| --- | --- | --- | --- | --- | --- |
| Kept state | 111 / 103 / 74 / 146 | 5.4 | 0.40 | 131 / 34 | 298 / 306 |
| Claremont Ave: Ashby Ave, Clifton St, Hudson St, College Ave (4 signals) | 117 / 101 / 70 / 148 | 5.9 | 0.20 | 131 / 36 | 300 / 306 |
| College Ave: Ashby Ave, Alcatraz Ave, Miles Ave, Shafter Ave, Manila Ave (5) | 119 / 113 / 65 / 143 | 6.6 | 0.30 | 129 / 32 | 299 / 305 |
| Telegraph Ave and west: Alcatraz Ave, 55th St twice, MLK Way and 52nd St, 52nd St and Claremont Ave (5) | 110 / 104 / 73 / 152 | 4.6 | 0.20 | 133 / 33 | 295 / 286 |
| All 14 | 123 / 114 / 66 / 150 | 6.6 | 0.00 | 133 / 32 | 295 / 289 |

None is kept. The College Ave group moves Hillegass Ave SB and Colby St SB to the top of their ranges and the Hillegass Ave SB share to 58.3 for no station gain; the Telegraph Ave group gives Telegraph Ave more green than the Webster plan did and takes Telegraph Ave SB out of the observed range (290 s against 300 to 376), which answers the question on Telegraph Ave: the plans of the sources speed it up, so the gap of 299 s against 302 s does not come from the signals that have worksheets (4 of about 11 on the segment). The Claremont Ave group lowers removals from 0.40 to 0.20 (a difference of 2 in ten runs) and moves the through cars of Hillegass Ave SB up by 6.

Two more changes were left out: an extra Ashby Ave approach lane at Claremont Ave (no source for where a second lane starts) and a ban on the sharp left turn onto link 3449 (not verified on the street).

### Project lead's scenario check (PM, seeds 1 to 3)

Filters at Martin St and Ayala Ave and at Ayala Ave and Forest St, diagonal diverters at 62nd St and Colby St and at 63rd St and Hillegass Ave (bearing 41), as in round 22:

| Block (63rd St) | Round 22: veh/h | Round 22: through | Round 23: veh/h | Round 23: through |
| --- | --- | --- | --- | --- |
| Telegraph to Canning (EB) | 65 to 109 | 42 to 74 | 68 to 102 | 43 to 67 |
| Canning to Dana (EB) | 58 to 97 | 36 to 64 | 59 to 94 | 37 to 60 |
| Dana to Colby (EB) | 41 to 66 | 20 to 42 | 44 to 66 | 22 to 41 |
| Colby to Hillegass (EB) | 29 to 19 | 3 to 10 | 24 to 28 | 6 to 20 |
| Hillegass to Colby (WB) | 42 to 43 | 8 to 2 | 41 to 43 | 8 to 2 |
| Colby to Dana (WB) | 37 to 51 | 10 to 7 | 37 to 71 | 10 to 30 |
| Dana to Canning (WB) | 49 to 70 | 11 to 12 | 46 to 90 | 10 to 35 |
| Canning to Telegraph (WB) | 39 to 46 | 8 to 6 | 36 to 44 | 7 to 6 |
| College to Hillegass (WB) | 69 to 17 | 18 to 1 | 70 to 16 | 20 to 1 |
| Hillegass to College (EB) | 38 to 17 | 12 to 2 | 34 to 18 | 15 to 1 |
| 63rd St, all blocks | 1,063 to 1,115 | | 1,021 to 1,165 | |

63rd St rises 14% (+144 veh/h) where round 22 had +5% (+52); the original fault was +483. It is a rise and no surge. Run with the round 22 demand file on the new network, the rise is +102 (1,021 to 1,123): about 40 veh/h of it comes from the new alternatives and the rest is the new network and the spread of three seeds (the difference of two three-seed means is about 40 veh/h). The 40 veh/h are the west-side turn-in trips that now fall back on the parallel street's turn-in: they turn in on Colby St, turn west at the diverter on 62nd St or 63rd St and reach Telegraph Ave, on the two westbound blocks west of Colby St (through cars 10 to 30 and 10 to 35). They do not loop: the share of assumed-flow trips with a node visited twice is 3 to 4% (one end inside) and 8.5% (through) in the scenario against 2% and 8.6% in round 22 and 1.6% and 8.4% in the baseline. Trips of assumed-flow pairs that make an assumed movement: 347 to 149 per run (round 22: 344 to 116). Through trips on local streets: 562 to 234 per run (579 to 210). Local street flow in the study area: 797 to 534 veh-km/h; the gains are on 61st St (+29), 60th St (+17), 63rd St (+10), McAuley St (+9), 62nd St (+7) and Canning St (+6), the losses on Colby St (-99), Hillegass Ave (-68), Ayala Ave (-62), Martin St (-41) and 57th and 58th St (-24, -20).

### Rules and status

D16 (stability): holds in all three periods (PM 0.40, AM 0.00, midday 0.00 per hour). D5 (headline shares within 10 points): holds, mean error 5.4; Hillegass Ave SB is 7 low. The through cars are inside the observed ranges on three blocks and 1 above on Colby St NB. The station rule fails: PM 69% fitted and 62% held out, AM 67% and 70%, midday 77% and 79%, against 85%. So `status` stays `uncalibrated` and `experimentalPeriods` stays `["pm_peak"]`; the assessment suggests none because all periods are stable, and that is the project lead's call as in round 21.

### What remains

1. Station fit: 31% of the PM fitted stations fail, 51 of the 80 failures at the 2010 and 2013 intersection counts, low by 15%. The fit's lower bound (median factor 0.10) says the trip table and the count set disagree; a change to the fit (growth from the count year, or the counts' weights) is the next test.
2. The off-ramp split is 899 / 828 against 1,024 / 617; the static fit puts 718 on the Clifton St ramp, and the simulator's loaded costs favor Clifton St by 19 s for south Oakland trips.
3. Claremont Crescent (4 of the 7 removals left) needs the real lane layout of Ashby Ave at Claremont Ave.
4. The Ashby Ave and Claremont Ave slip lane (link 3449) is used by eastbound cars in the model and is missing from the count's leg stations.
5. 63rd St rises 14% in the project lead's scenario because the west-side turn-in trips now keep their intent by way of the parallel street. Whether that is wanted is the project lead's call.

## Twenty-fourth round: count recency, the Ashby Ave slip link (change count-recency-weights)

PM peak, seeds 1 to 10 (AM and midday also 1 to 10), scale 1.0, 60 minutes. Before: network 5fe8241a6ba1e306, demand 222fb062e8e5dc1c (rebuilt at the start of the round: same hash). After: network 5fe8241a6ba1e306 (unchanged), demand 74a9882dd4286e12. The simulator did not change. Decisions are in `openspec/changes/archive/*-count-recency-weights/design.md`.

The project lead's decision: "Let's make sure the newer data is more important than the 2010/2013 data". Every count station now carries its source and count year, and the fit multiplies the weight of a station by a band weight of its age (`countFit.recency` in the area config, reference year 2026, one band edge at 10 years, ASSUMPTION).

### Count years

| Source | Count year | Where it comes from | Age (years) | PM stations in the fit |
| --- | --- | --- | --- | --- |
| Resident volunteer count | 2025 | Count date, 2025-02-25 | 1 | 126 |
| Caltrans AADT (SR-13, SR-123) | 2024 | Count year 2023-24 of the service, set as 2024 in the config | 2 | 8 |
| Caltrans ramp ADT, latest row | 2024 (3 stations), 2012 (13) | Latest year of the published row; the Claremont and Telegraph rows only have 2012 | 2 and 14 | 3 and 13 |
| OakDOT turning-movement counts | 2019 (mean of 2018, 2018, 2019, 2021) | Year prefix of the file names | 7 | 20 |
| Children's Hospital EIR counts | 2013 | Count date, 2013-09-19 | 13 | 112 |
| Safeway EIR counts | 2010 | Count date, 2010-03-16 | 16 | 61 |

No source lacks a date. A station whose year is null would take the last band (treated as old).

### Settings tested

The weight multiplies the station weight of every station older than 10 years (the 2010 and 2013 intersection counts and the 2012 ramp rows). PM peak, seeds 1 to 10:

| Old counts at | Removals per hour | Through cars HSB / CSB / HNB / CNB | Headline shares | Error | 52nd St / Clifton St off-ramps | Fitted / held out below GEH 5 | Recent sources fitted | Volunteer count fitted |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Round 23 state | 0.40 | 111 / 103 / 74 / 146 | 47.8 / 37.7 / 61.0 / 40.5 | 5.4 | 899 / 828 | 131 / 34 | not reported | not reported |
| 1.0 (slip link only) | 0.20 | 112 / 109 / 68 / 142 | 49.9 / 38.6 / 62.4 / 40.7 | 5.3 | 881 / 882 | 133 / 35 | 82 of 94 | 80 of 89 |
| 0.5 (kept) | 0.10 | 110 / 97 / 66 / 139 | 50.1 / 37.7 / 64.6 / 41.9 | 4.7 | 900 / 883 | 130 / 35 | 82 of 94 | 80 of 89 |
| 0.25 | 0.20 | 111 / 96 / 65 / 138 | 50.3 / 39.0 / 64.8 / 42.9 | 4.2 | 903 / 937 | 129 / 33 | 82 of 94 | 79 of 89 |
| 0 (held out only) | 4.70 | 141 / 153 / 75 / 149 | 50.3 / 43.0 / 60.2 / 41.5 | 4.7 | 624 / 1,150 | 80 of 106 / 48 of 139 | 71 of 94 | 68 of 89 |

Observed through cars 79-120 / 39-117 / 48-95 / 102-145. D5 and D16 hold at 1.0, 0.5 and 0.25. Held out only fails D16 (4.70 removals per hour), puts Hillegass Ave SB and Colby St SB above their ranges and takes the Telegraph Ave travel times to 393 / 408 s: the old counts include the 2012 Claremont and Telegraph ramp rows and the ramp legs of the 52nd St, Martin Luther King Jr Way and Clifton St counts, and the ramp flows lose their anchor. It is rejected.

In the static fit (fit report, PM) the weights do what they should where counts disagree: the volunteer count's assigned volume over its counts is 0.885 at 1.0, 0.900 at 0.5, 0.915 at 0.25 and 0.959 with the old counts held out, while the 2010 Safeway counts go from 1.013 to 1.035, 1.065 and unscored. The fit meets nearly every count either way (the weights decide only in tension), so the change in pass rates is small. In the simulator the recent sources are at the same pass count at 1.0 and 0.5 (82 of 94), and the Safeway counts lose 3 of 26 passes (14, 11, 10 at 1.0, 0.5, 0.25). Down-weighting old counts does not raise the pass rate of any group in the simulator; its measurable cost is those 3 stations, and its measurable gain is a lower headline error (5.3, 4.7, 4.2) and removals (0.20, 0.10, 0.20, inside the seed spread).

Kept: 0.5. It follows the project lead's decision with a middle value, holds D5 and D16, keeps the four through blocks inside their ranges (Colby St NB 139: 3 under the 1.0 value, and 7 under the round 23 value, which was 1 above its range), and costs 3 stations of 190 against 1.0. 1.0 is not kept because it ignores the decision; 0.25 is not kept because the Clifton St ramp moves to 937 against 617 counted for no station gain.

### Growth from the count year

Not applied. A published trend would have to show that traffic grew since 2010 or 2013. The sources held do not. The Caltrans ramp ADT workbooks [CaltransRampADT] give eight SR-24 and SR-13 rows with two counts at least three years apart: changes of -2.1 to +1.0% a year, median -0.8%, no consistent sign (the Grove-52nd St ramps, the nearest to the study area, fell 4.4% and 5.7% from 2012 to 2019). The OakDOT counts [OaklandTMC] at Telegraph Ave and Alcatraz Ave fall from 3,263 (mean of the two 2018 counts) to 3,130 (2019) and 2,827 vehicles entering (2021, a pandemic year); at Market St and 55th St from 1,970 to 1,846 and 1,765. The Alameda CTC monitoring reports [ACTC-LOS2018] are speeds, not volumes. No source gives a rate for the arterials, and a positive rate would run against the counts above, so none was invented. The config has `growthPerYear` by source id (empty); a unit test covers the rule.

### Ashby Ave and Claremont Ave: the slip link

Link 3449 (OSM way 435129990, a one-way `primary_link`) leaves Ashby Ave 37 m east of the signal and joins Claremont Ave 43 m north-east of it. The Synchro worksheet of the Safeway study [SafewayCollege-DEIR2011] (PDF page 482) counts the westbound right turn (239 vph) in the signalized westbound lane group, with no separate right-turn lane, so the count is of vehicles that turn right by either path. The station mapping used only the signal's own links: the north leg leaving was link 3446 (198 modeled against 697 counted) and the east leg entering link 3426 alone, so the vehicles on the slip were missing from both. An unnamed one-way link that leaves the leg's street where the approach link starts, or joins it where the exit link ends, with its other end within the node radius, is now part of the leg (`mapLeg`; no street name in code). The north leg leaving is [3446, 3449] (697) and the east leg entering [3426, 3449] (881). The westbound approach to the north leg (239) can use the slip and has no movement station now (the fit report lists it); the other movement stations keep their single links. The Ashby Ave and Claremont Ave corridor ratio on the simulator's flows goes from 0.88 to 1.01. The round 23 note that the eastbound approach could turn onto the slip stands: the router has a sharp turn from link 3425 onto 3449, not verified on the street and left as it was.

### Result

| PM peak, seeds 1 to 10 | Target | Before | After |
| --- | --- | --- | --- |
| Through cars Hillegass Ave SB / Colby St SB / Hillegass Ave NB / Colby St NB | 79-120 / 39-117 / 48-95 / 102-145 | 111 / 103 / 74 / 146 | 110 / 97 / 66 / 139 |
| Headline shares Hillegass Ave NB from / Colby St NB from / Hillegass Ave SB to / Colby St SB to | 47 / 47 / 68 / 45 | 47.8 / 37.7 / 61.0 / 40.5 | 50.1 / 37.7 / 64.6 / 41.9 |
| Mean headline error, points (D5, within 10) | | 5.4 (4 of 4) | 4.7 (4 of 4) |
| Removals per hour PM / AM / midday (D16: below 1.0) | below 1 | 0.40 / 0.00 / 0.00 | 0.10 / 0.00 / 0.00 |
| Alcatraz Ave entries at Colby St, Hillegass Ave, Dana St | 360 | 251 | 255 |
| 52nd St off-ramp / Clifton St off-ramp, veh/h | 1,024 / 617 | 899 / 828 | 900 / 883 |
| Telegraph Ave NB / SB travel time, s (observed 302-420 / 300-376) | | 298 / 306 | 300 / 307 |
| Completed trips per hour, arterial speed (m/s) | | 24,558, 9.31 | 24,468, 9.41 |
| Stations below GEH 5, PM fitted (190) / held out (55) | 85% | 131 (69%) / 34 (62%) | 130 (68%) / 35 (64%) |
| Stations below GEH 5, AM fitted (153) / held out (47) | 85% | 103 (67%) / 33 (70%) | 104 (68%) / 31 (66%) |
| Stations below GEH 5, midday fitted (192) / held out (56) | 85% | 148 (77%) / 44 (79%) | 149 (78%) / 39 (70%) |
| Off-ramps AM and midday, 52nd St / Clifton St (counted 898 / 524 and 635 / 383) | | 807 / 696 and 750 / 477 | 834 / 763 and 737 / 505 |

The through-car and share changes are inside the seed spread (the interval of a ten-seed mean is about 4 veh/h and 2 points). The held-out column of the assessment labels the stations; they are in the shipped fit, so it is not out of sample (the fit report's held-out figures are).

### Stations by source and count year

Simulator flows, mean over seeds 1 to 10 (kept setting; below GEH 5, fitted / held out). Ages are from the reference year 2026.

| Source | Count year | PM | AM | Midday |
| --- | --- | --- | --- | --- |
| Volunteer count | 2025 | 80 of 89 / 16 of 18 | 69 of 77 / 17 of 19 | 88 of 91 / 19 of 19 |
| Caltrans AADT | 2024 | 1 of 3 / 2 of 3 | 3 of 3 / 3 of 3 | 3 of 3 / 2 of 3 |
| Caltrans ramp ADT | 2024 | 1 of 2 / 1 of 1 | 1 of 2 / 1 of 1 | 1 of 2 / 1 of 1 |
| OakDOT counts | 2019 | 9 of 12 / 2 of 4 | 9 of 12 / 1 of 4 | 10 of 12 / 3 of 4 |
| Children's Hospital EIR | 2013 | 22 of 48 / 8 of 16 | 16 of 48 / 8 of 16 | 20 of 48 / 5 of 16 |
| Caltrans ramp ADT | 2012 | 6 of 10 / 0 of 3 | 6 of 10 / 1 of 3 | 8 of 10 / 1 of 3 |
| Safeway EIR | 2010 | 11 of 26 / 6 of 10 | 0 of 1 / 0 of 1 | 19 of 26 / 8 of 10 |

The fit report (`data/demand/rockridge.fit.md` and the station files) has the same table for the static assignment, fitted and held out, per period.

### Rules and status

The station rule (more than 85% of stations below GEH 5) is reported as written, for all sources and for sources counted in the last five years (age 5 or less, which here is the volunteer count, the Caltrans AADT and the 2024 ramp rows):

| Period | All sources fitted | All sources held out | Recent sources fitted | Recent sources held out |
| --- | --- | --- | --- | --- |
| PM | 130 of 190 (68%), not met | 35 of 55 (64%), not met | 82 of 94 (87%), met | 19 of 22 (86%), met |
| AM | 104 of 153 (68%), not met | 31 of 47 (66%), not met | 73 of 82 (89%), met | 21 of 23 (91%), met |
| Midday | 149 of 192 (78%), not met | 39 of 56 (70%), not met | 92 of 96 (96%), met | 22 of 23 (96%), met |

An honest reading: the rule is not met overall, and it is met on the recent sources in all three periods, with or without the weights (PM recent sources are 82 of 94 at weight 1.0 as well). The recent set is dominated by one hour of one day of resident counting (89 of the 94 PM stations, 90% pass); the other recent sources are 3 Caltrans AADT stations and 2 ramp stations, 1 of 3 and 1 of 2 below GEH 5. The older sources (age 7 and more) pass 48 of 96 in the PM (50%) and are the failures of the rule. The weights do not close that gap: the counts of 2010 and 2013 are 20 to 45% above what the fit reaches, and the median factor of the counted flows is still at its lower bound (see the fit report). Whether the rule should apply to recent sources only is the project lead's call: that is a change of the published rule [WebTAG-M3.1], it would also discard the 2018 to 2021 counts of the city (age 7), and it rests on one day. It was not made. D16 and D5 hold. (Superseded by the project lead decisions below: the status is now `calibrated`.)

### Project lead decisions after the round (change station-rule-recent-counts)

On 2026-11-14 the project lead decided that the station rule is judged on counts from the last five years ("Recent only, with caveat"), with the pass rate of older counts reported beside it and the one-day basis of the recent set stated, and that PM peak is no longer experimental. The assessment then decides the status. The window is `countFit.recency` (`referenceYear` 2026, `recentYears` 5).

| Period | D16 | D5 | Recent counts, fitted | Recent counts, held out | Through cars | Older counts, fitted / held out |
| --- | --- | --- | --- | --- | --- | --- |
| AM | pass (0.00) | not gated | 73 of 82 (89%), pass | 21 of 23 (91%), pass | no target | 31 of 71 (44%) / 10 of 24 (42%) |
| Midday | pass (0.00) | not gated | 92 of 96 (96%), pass | 22 of 23 (96%), pass | no target | 57 of 96 (59%) / 17 of 33 (52%) |
| PM | pass (0.10) | pass (4 of 4, error 4.7) | 82 of 94 (87%), pass | 19 of 22 (86%), pass | pass (66 / 139 / 110 / 97 inside 48-95 / 102-145 / 79-120 / 39-117) | 48 of 96 (50%) / 16 of 33 (48%) |

Every rule passes, so the assessment prescribes `calibrated` with no experimental period, and `status` is `calibrated`. What still does not match, and is disclosed in the calibration note, the caveat on the Sources page and the banner: the recent set is mostly one hour of one day of resident counting (89 of the 94 PM fitted stations; 107 of 116 with the held-out ones); older counts pass 50% in the PM; Colby St NB through cars are 139 against 102 to 145 and its whole-street cars 80 against 102 (ratio 0.78); the Colby St NB freeway share is 37.7% against 47% (9.3 points, 0.7 inside the limit); the 52nd St and Clifton St off-ramps carry 900 and 883 against 1,024 and 617. The recent held-out margin is thin (19 of 22: 3 more failures would break it) and AM and midday have no through-car targets. The held-out column of the assessment is a label (those stations are in the shipped fit).

### What remains

1. The station rule: 60 of 190 PM stations fail, 48 of them at sources aged 7 years or more. The trip table is larger than the counts support (lower bound median factor); a fit that scales the whole table down, or a seed table with a smaller local share, is the next test.
2. The Clifton St off-ramp is 883 against 617 counted; the 52nd St off-ramp is 900 against 1,024 (unchanged by this round).
3. Claremont Crescent needs the real lane layout of Ashby Ave at Claremont Ave; the sharp turn from Ashby Ave eastbound onto the slip link is not verified on the street.
4. Whether the rule should apply to recent sources only (project lead).

## Twenty-fifth round: Colby St NB whole-street cars, the off-ramp split, older counts (change calibration-round-25)

PM peak, seeds 1 to 10 (AM and midday also 1 to 10), scale 1.0, 60 minutes. Before: network 5fe8241a6ba1e306, demand 74a9882dd4286e12 (rebuilt at the start of the round with the cross-validation fit skipped, `SKIP_CV=1`: the same flows). After: network 5fe8241a6ba1e306 (unchanged), demand 8695ddc28b152c35. The simulator did not change; `calibrate` gained a debug dump of the trails of trips that use given links. The "before" column was measured again on the round 24 files and matches round 24. Decisions are in `openspec/changes/archive/*-calibration-round-25/design.md`.

Three changes are kept, all in the demand builder: ramp choice made upstream (`ramps.choice`), full weight for ramp counts (`countFit.recency.exemptRamps`) and whole-street intents for Colby St northbound (`wholeStreet`, with the through intents at 0.47 and 0.15 of the exits). Each is an ASSUMPTION and is labeled so in the config. The other tests of the round (lower bound 0.05, lower local trip rates, the two changes taken apart) are under "Tried and not kept".

### Result

| PM peak, seeds 1 to 10 | Target | Before | After |
| --- | --- | --- | --- |
| Through cars Hillegass Ave SB / Colby St SB / Hillegass Ave NB / Colby St NB | 79-120 / 39-117 / 48-95 / 102-145 | 110 / 97 / 66 / 139 | 104 / 100 / 73 / 138 |
| Whole-street cars, same four blocks | 79 / 39 / 48 / 102 | 75 / 47 / 41 / 80 | 70 / 46 / 46 / 95 |
| Headline shares Hillegass Ave NB from / Colby St NB from / Hillegass Ave SB to / Colby St SB to | 47 / 47 / 68 / 45 | 50.1 / 37.7 / 64.6 / 41.9 | 54.6 / 42.7 / 63.2 / 40.8 |
| Mean headline error, points (D5, within 10) | | 4.7 (4 of 4) | 5.2 (4 of 4; Hillegass Ave NB is 7.6 high) |
| Removals per hour PM / AM / midday (D16: below 1.0) | below 1 | 0.10 / 0.00 / 0.00 | 0.00 / 0.00 / 0.00 |
| Alcatraz Ave entries at Colby St, Hillegass Ave, Dana St | 360 | 255 | 242 |
| Colby St entries at Claremont Ave / Forest St (counted 182 / 58) | | 157 / 48 | 187 / 56 |
| 52nd St off-ramp / Clifton St off-ramp, PM (counted 1,024 / 617) | | 900 / 883 | 1,001 / 733 |
| Same, AM (898 / 524) and midday (635 / 383) | | 834 / 763 and 737 / 505 | 892 / 626 and 670 / 480 |
| Telegraph Ave NB / SB travel time, s (observed 302-420 / 300-376) | | 300 / 307 | 298 / 306 |
| Completed trips per hour, arterial speed (m/s) | | 24,468, 9.41 | 24,485, 9.37 |
| Recent counts below GEH 5, PM fitted / held out | above 85% | 82 of 94 (87%) / 19 of 22 (86%) | 84 of 94 (89%) / 19 of 22 (86%) |
| Same, AM | | 73 of 82 (89%) / 21 of 23 (91%) | 73 of 82 (89%) / 22 of 23 (96%) |
| Same, midday | | 92 of 96 (96%) / 22 of 23 (96%) | 90 of 96 (94%) / 22 of 23 (96%) |
| Older counts below GEH 5, PM fitted / held out | reported | 48 of 96 (50%) / 16 of 33 (48%) | 52 of 96 (54%) / 18 of 33 (55%) |
| Same, AM | | 31 of 71 (44%) / 10 of 24 (42%) | 29 of 71 (41%) / 13 of 24 (54%) |
| Same, midday | | 57 of 96 (59%) / 17 of 33 (52%) | 54 of 96 (56%) / 21 of 33 (64%) |
| All counts below GEH 5, PM fitted / held out | | 130 of 190 (68%) / 35 of 55 (64%) | 136 of 190 (72%) / 37 of 55 (67%) |

The interval of a ten-seed mean is about 4 veh/h on the through cars and 2 points on the shares, so the through-car changes and the Alcatraz Ave entries (255 to 242) are inside the seed spread except Colby St entries and whole-street cars, which move by more. The older counts together (fitted and held out) go from 64 to 70 of 129 in the PM, 41 to 42 of 95 in the AM and 74 to 75 of 129 at midday: only the PM gain is outside the noise (the AM and midday fitted figures fall by 2 and 3 stations).

### 1. Colby St northbound: where the whole-street cars were lost

The count has 182 cars entering at the south end (121 from Claremont Ave, 57 from Forest St, 4 other), 102 driving the whole street, 51 turning off and 29 ending along it; 47 turn on from side streets and about 15 start on the street. The model had 80 whole-street cars, 157 and 48 entries at Claremont Ave and Forest St (counted 182 and 58) and 187 cars on the last block against 164 counted.

The trails of Colby St northbound (`CAL_DUMP_PATH_TRIPS`, seeds 1 and 2 of the round 24 state, per 60-minute run) say where it goes wrong:

| Cars | Per run | Whole street |
| --- | --- | --- |
| Entered at the south end, SR-24 off-ramp origin, through | 40.5 | 38.5 |
| Entered at the south end, Telegraph Ave and south side, through | 42.0 | 24.0 |
| Entered at the south end, with a local end (SR-24 36.0, south side 21.0) | 57.0 | 8.5 |
| Joined from a side street, local end | 77.0 | |
| Joined from a side street, through | 29.5 | |

1. The entries at the south end are short by 14% (both movements 0.86 of the count) and the model has 106 cars joining from side streets where the count has about 62. The through cars (neither end in the study area) that join are the assumed through intents: they must make the left or right turn at Alcatraz Ave, and the cheapest way to that turn for a car from Telegraph Ave or the ramps is often 63rd St, which reaches the north end of Colby St. 29.5 through cars per run joined that way, mostly by 63rd St, and 18 of the 42 south-side through cars left Colby St early to Telegraph Ave. The intents assume 101 veh/h through cars; 62 per run (70 per hour) drove the whole street.
2. Mid-block loss to side streets exists but is not the main loss. Of the cars that entered at the south end, 49% left before Alcatraz Ave (count: 44%), which the turn-off counts allow (51 and 29).
3. The assumed volumes are not too large. The through intents add up to 101 veh/h against 102 whole-street cars counted, and the exits at Alcatraz Ave were right (166 against 163 counted). The shortfall is in the route taken to the turn, not in the volume.

The fix. An assumed movement can name the volunteer count's whole-street route (`wholeStreet`), and its through intents take only seed flows whose route to the turn enters Colby St at its first link. The candidates of the off-ramp intent fall from 34 to 3 flows and those of the south-side intent from 96 to 82 (PM). On the old demand this alone (C in the table below) gave 103 whole-street cars and the entries 178 and 49, with the freeway share at 37.2% (0.2 inside the limit), so the freeway cars were the next gap: the street's freeway share is 0.47 of its trips and the intents had put 65 of the 102 whole-street cars on the ramps. Taking every freeway-origin trip of the street to be a whole-street car (the upper end of the round 21 range, 77 of 163 exits) gives 0.47 and 0.15 for the two through intents; the 0.38 local share is unchanged, so the intents still add up to the counted exits. With the ramp choice (part 2) the freeway share is 42.7% (4.3 below observed, was 9.3), whole-street cars 95 (observed 102) and the entry at Claremont Ave 187 (182).

What did not work or remains: 95 against 102 is inside the ten-seed interval of the model but not at the count; Hillegass Ave NB's freeway share went up (50.1 to 54.6, 7.6 above observed) with the ramp choice and is the largest headline error; the Alcatraz Ave entries fell 13 (255 to 242). The Colby St SB left turn onto Claremont Ave toward College Ave (75 counted, 1 modeled) is unchanged.

### 2. The off-ramp split

(a) Delays. Model delay per approach (PM, seed mean of the link delay, the round 24 state) against the Existing PM worksheets of [SafewayCollege-DEIR2011] and [CHRCO-EIR2014] (HCM approach delay, s; read in the PDFs on 2026-11-15):

| Approach | Model | Worksheet |
| --- | --- | --- |
| Clifton St ramp (EB) / Clifton St (WB) at Claremont Ave | 10.7 / 8.3 | 7.2 / 5.4 |
| Claremont Ave NB / SB at Clifton St | 22.3 / 16.8 | 27.7 / 23.7 |
| Claremont Ave NB / SB at Hudson St | 7.2 / 4.9 | 12.7 / 20.9 |
| Hudson St (WB) at Claremont Ave | 25.4 | 22.5 |
| Claremont Ave NB / SB at Ashby Ave | 36.1 / 36.1 | 70.3 / 45.5 |
| Telegraph Ave EB / WB / NB / SB at 51st St | 16.9 / 18.1 / 13.0 / 25.0 | 37.2 / 47.2 / 35.7 / 63.0 |
| 52nd St EB / WB / NB / SB at Shattuck Ave | 15.3 / 21.3 / 27.9 / 10.0 | 21.8 / 42.7 / 33.6 / 59.2 |
| Telegraph Ave NB / SB at 52nd St and Claremont Ave | 15.8 / 7.1 | 11.6 / 13.3 |

Most approaches are faster in the model than in their worksheets, and the shortfall is largest on the 52nd St path. At Telegraph Ave and 51st St it is 20 to 38 s on all four approaches (the 37 s and 47 s of round 23 are the eastbound and westbound approaches), at Shattuck Ave and 52nd St 6.5 s on the eastbound approach the ramp trips use and 21 s westbound, and at Telegraph Ave, 52nd St and Claremont Ave the eastbound 52nd St approach has 87 s in the worksheet against 15.8 s. On the Clifton St path the shortfall is 5 to 7 s on Claremont Ave at Clifton St (the ramp approach is 3.5 s too slow, 10.7 against 7.2), 5 to 16 s at Hudson St and 9 to 34 s at Ashby Ave. The 52nd St ramp approach has 12.9 s in the model; the worksheet of the ramp and 52nd St (unsignalized) gives an average delay of 7.5 s. Correcting the delays would make the 52nd St path dearer relative to the Clifton St path, the opposite of what the counts need (1,024 on 52nd St, 617 on Clifton St). The costs do not explain the split. The Claremont Crescent merge has no worksheet and was not changed.

(b) Destination mix. Clifton St ramp trips by destination group (per 60-minute run, round 24 state): south Oakland 403, Berkeley north 164, study area 131, Telegraph Ave north 50, Claremont hills 33, College Ave north 25; the 52nd St ramp: south Oakland 434, Telegraph Ave south 204, Berkeley north 121, Berkeley northwest 61. South Oakland is split 52 to 48 between the ramps, which is what two paths within 1.4 s give. The count at the Clifton St terminal (SafewayCollege 2010) says otherwise: of 617 cars, 442 turn north on Claremont Ave, 67 south and the rest go straight on to Clifton St. The model sent 193 south (2.9 times the count) and 484 north. The 2010 count and the 2013 count at 52nd St therefore put the south Oakland trips on the 52nd St ramp; the model put half of them on the Clifton St ramp because that is where its router sent them.

The static fit already agreed with the counts: its assignment has 63 south and 504 north at the Clifton St terminal, 1,045 on the 52nd St ramp and 752 on the Clifton St ramp (22% over; weight 0.5 for counts of 2010 and 2013). The simulator did not follow it because the ramp is chosen by the simulator's costs, not the fit's. Two changes:

- Ramp counts keep full weight (`exemptRamps`). The Claremont Ave and Telegraph Ave ramp counts are all older than 10 years: the 52nd St count is of 2013, the Clifton St count of 2010 and the Caltrans rows of 2012. They are the only ramp evidence, so down-weighting them removes the anchor of the split. The static fit now has 1,015 on the 52nd St ramp and 631 on the Clifton St ramp (counted 1,024 and 617). Should the ramp counts be exempt? Yes: they are the only ramp evidence. What the exemption does in the simulator on its own is in the table of variants.
- Ramp choice made upstream (`ramps.choice`). Each off-ramp flow is divided over the ramps its final static assignment uses and carries the ramp as its `via` (1,432 PM flows, 411 of them divided over two ramps or more). The simulator keeps the ramp while it costs at most 1.3 times the plain route. In the simulator the Clifton St terminal now has 63 south (67 counted), 472 north (442) and 733 on the ramp (617), the 52nd St ramp 1,001 (1,024) and the Telegraph Ave and Aileen St off-ramp 670 (Caltrans 621). In AM the ramps carry 892 / 626 against 898 / 524 counted (834 / 763 before) and at midday 670 / 480 against 635 / 383 (737 / 505).

The Clifton St ramp is still 116 over its count in the PM (the static assignment has 631). A destination mix that sends the south Oakland trips to the 52nd St ramp is now an assumption of the fit and not a result of the router: a scenario that makes the Clifton St path much cheaper does not move these trips until the detour test (1.3) fails.

### 3. Older counts: is the trip table too large?

The hypothesis. The median factor of the counted flows sits at the lower bound 0.10, so the seed table is larger than the counts support. Measured on the seed flows (`FIT_DUMP`) and the final demand (PM):

| Flows | Seed veh/h | Final veh/h | Flows at the lower bound | Seed volume at the bound |
| --- | --- | --- | --- | --- |
| Through | 8,459 | 4,542 | 1,191 of 1,814 (66%) | 5,822 (69%) |
| Local | 6,175 | 8,588 | 1,888 of 3,431 (55%) | 3,742 (61%) |
| Ramp | 13,068 | 11,674 | 1,215 of 2,659 (46%) | 6,033 (46%) |

(AM: through 49% of flows at the bound, local 26%, ramp 34%.) The through seed is cut to 54%, almost all of it on pairs to and from the hills: San Pablo Ave to Claremont hills 422 to 110 veh/h (91% of its seed at the bound), southwest Oakland to Claremont hills 250 to 77, West Berkeley to Claremont hills 250 to 63, Claremont hills to San Pablo Ave 249 to 25, to southwest Oakland 184 to 18. Southwest Oakland to Ashby Ave west goes up (176 to 208). The local seed is too small, not too large: it is raised by 40%.

What the failing older stations show:

1. The static assignment meets the older counts. In the PM it has 170 of 206 older stations below GEH 5 (83%) and carries 0.98 of the 2013 counts and 1.04 of the 2010 counts, while the simulator passes 54% and carries 0.84 and 0.94 of them. Per source, simulator over static: 0.86 for the 2013 counts, 0.91 for the 2010 counts, 0.90 for the city counts, 1.00 for the ramps. The shortfall is between the static assignment and the simulator, not in the size of the table.
2. It sits on the west side. Simulator over count by corridor (PM, after this round): Telegraph Ave and 51st St 0.72, Market St and 55th St 0.80, MLK Way and 55th St 0.79, SR-24 ramps and 52nd St 0.83, MLK Way and 52nd St 0.83, Telegraph Ave, 52nd St and Claremont Ave 0.82, Shattuck Ave and 52nd St 0.87; the corridors north and east are at 0.95 to 1.03. Telegraph Ave northbound at 52nd St has 614 against 1,124 counted, at 51st St 434 against 739; the static fit itself reaches 846 and 496 there (it cannot meet those counts against the gate counts of 2018 and 2019). The ramp choice gives back some of it: the older counts pass 64 of 129 before and 70 after (PM), the 52nd St corridor stations 1 to 2 each.
3. Turns and approach totals fail alike. PM older leg totals (entering and leaving volumes by leg and ramps): 61 of 116 below GEH 5 (53%), model at 0.87 of the counts; older turning movements: 39 of 73 (53%), 0.84, with 13 of 17 passing under 50 veh/h and 26 of 56 above. So it is not the 2010 and 2013 turn splits: the approach totals fail as often. The counts of 2013 fail most (47% of legs and 52% of movements).
4. The seed is not the cause. Lower bound 0.05 (ramp and local 0.05 as well) leaves the older counts where they were (63 of 129 against 64); local trip rates cut to 60% lower them (55 of 129) and break the guards (table of variants). Raising through flows is not supported: the through table is already cut to 54%, and the fit raises the pairs the older counts need.

What is left, and why it stays: the older counts are 2010 and 2013 counts of an area where the gates' 2018 to 2021 counts are lower, the median change of the published ramp series is -0.8% a year, and the simulator delivers 0.84 of the static volumes on the west side. A growth rate would make the older counts agree better (a rate of -0.8% a year takes 13 years to 0.90), but round 24 found no verified rate for the arterials and this round did not add one. The delivery gap of the simulator on the west corridors (a feedback loop on volumes, like the cost loop of round 20) is the next test.

### Tried and not kept

PM, ten seeds; through cars Hillegass Ave SB / Colby St SB / Hillegass Ave NB / Colby St NB, shares as above, removals, ramps, whole-street cars on Colby St NB, recent counts fitted / held out, older counts fitted:

| Variant | Through cars | Shares | Removals | Ramps | Colby NB whole | Recent | Older |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Round 24 state | 110 / 97 / 66 / 139 | 50.1 / 37.7 / 64.6 / 41.9 | 0.10 | 900 / 883 | 80 | 82 / 94, 19 / 22 | 48 of 96 |
| Ramp counts at full weight only | 108 / 104 / 65 / 140 | 50.4 / 37.3 / 63.4 / 41.8 | 0.10 | 878 / 849 | 80 | 80 / 94, 20 / 22 | 47 of 96 |
| Ramp choice only (ramp counts at weight 0.5) | 105 / 103 / 71 / 136 | 54.5 / 41.1 / 61.5 / 42.6 | 0.40 | 1,019 / 754 | 83 | 82 / 94, 19 / 22 | 52 of 96 |
| Ramp counts at full weight and ramp choice | 99 / 98 / 70 / 136 | 53.9 / 39.3 / 61.5 / 42.4 | 0.30 | 1,007 / 708 | 81 | 82 / 94, 19 / 22 | 52 of 96 |
| Whole-street intents only (0.40 and 0.22) | 104 / 99 / 65 / 143 | 50.8 / 37.2 / 63.0 / 42.0 | 0.00 | 905 / 904 | 103 | 85 / 94, 19 / 22 | 47 of 96 |
| Both, intents at 0.40 and 0.22 | 113 / 104 / 70 / 132 | 54.6 / 38.7 / 60.6 / 40.5 | 0.10 | 1,012 / 719 | 89 | 84 / 94, 19 / 22 | 55 of 96 |
| Both, intents at 0.47 and 0.15 (kept) | 104 / 100 / 73 / 138 | 54.6 / 42.7 / 63.2 / 40.8 | 0.00 | 1,001 / 733 | 95 | 84 / 94, 19 / 22 | 52 of 96 |
| Lower bound 0.05 (round 24 state) | 104 / 89 / 69 / 132 | 50.4 / 38.0 / 61.6 / 40.5 | 0.00 | 910 / 872 | 79 | 85 / 94, 20 / 22 | 48 of 96 |
| Kept state with local trip rates at 60% | 103 / 118 / 65 / 129 | 47.5 / 51.5 / 83.3 / 68.6 | 0.10 | 1,023 / 778 | 94 | 78 / 94, 16 / 22 | 45 of 96 |

The ramp choice does the work on the ramps (1,019 / 754 alone). Full ramp weights alone change the static fit (1,015 / 631) and leave the simulator where it was (878 / 849); with the choice they take the Clifton St ramp from 754 to 708 and the PM removals from 0.40 to 0.30 (733 and 0.00 in the kept state, which also has the whole-street intents). The ramp choice alone raises the Hillegass Ave NB freeway share by 4.4 points (50.1 to 54.5), and that stays. The whole-street intents alone make the Colby St NB freeway share worse (37.2%, 0.2 inside the limit); with the 0.47 and 0.15 intents the shares and the whole-street cars are the best of the set. The older-count passes are 52 to 55 of 96 in every variant with the ramp choice, so the choice among them rests on the Colby St figures and the shares. The lower bound 0.05 does not raise the older counts and is not kept. Local trip rates at 60% break D5 (Hillegass Ave SB to the freeway 83%, Colby St SB 69%), the through-car check (Colby St SB 118 against 39 to 117) and the recent station rule (16 of 22 held out), which is what the fit's raising of the local table by 40% says.

Not tried: growth from the count year (round 24), a feedback loop on volumes (above), Hillegass Ave NB whole-street intents (its whole-street cars, 46 against 48, are right).

### Project lead's scenario checks (PM, seeds 1 to 3)

Run with `diag63` (the 63rd St scenario of round 22: filters at Martin St and Ayala Ave and at Ayala Ave and Forest St, diagonal diverters at 62nd St and Colby St and at 63rd St and Hillegass Ave) and `mf` (six filters), each on the round 24 demand and on this round's:

| Scenario | Round 24 demand | Round 25 demand |
| --- | --- | --- |
| 63rd St, all blocks, veh/h | 1,072 to 1,181 (+10%) | 993 to 1,056 (+6%) |
| 63rd St, Telegraph Ave to Canning St (EB), through cars | 41 to 64 | 18 to 33 |
| Assumed-flow trips with a node visited twice, base to scenario | 8.2% to 8.7% | 7.6% to 8.1% |
| Ramp-flow trips with a node visited twice | | 1.4% to 1.6% (every trip makes its ramp movement) |
| Six filters: local street flow, veh-km/h | 803 to 321 | 748 to 308 |
| Six filters: assumed-flow trips with a node visited twice | 8.2% to 9.4% | 7.6% to 8.5% |

No via-trip loops: the repeated-node share rises by about 0.5 points in the 63rd St scenario and 0.9 in the six-filter scenario on both demands. The base flow on the east blocks of 63rd St falls (65 to 48 on the Telegraph Ave to Canning St block) because the whole-street intents no longer send the through cars up Colby St from 63rd St, and the rise in the scenario is smaller (+63 veh/h against +109).

### Rules and status

D16 holds in all three periods (PM, AM and midday 0.00 removals per hour). D5 holds (4 of 4, mean error 5.2; Hillegass Ave NB 7.6 high). The through cars are inside the observed ranges on all four blocks (Colby St NB 138 of 102 to 145). The station rule on counts from the last five years holds in all three periods, fitted and held out (PM 89% and 86%, AM 89% and 96%, midday 94% and 96%); the PM held-out margin is the same thin 19 of 22. The assessment prescribes `calibrated` with no experimental period, and `status` stays `calibrated`. The calibration note and caveat carry the new numbers. Older counts pass 54% in the PM (AM 41%, midday 56%), the recent set is still mostly one hour of one day (107 of the 116 PM stations), and the caveat lists the remaining mismatches.

### What remains

1. Older counts: the simulator carries 0.84 of what the static assignment gives on the west corridors (Telegraph Ave and 51st St 0.72 of the count), and the static fit does not meet Telegraph Ave northbound at 52nd and 51st either. A feedback loop on volumes, or a growth rate for the older counts if the project lead supplies a source, are the next tests.
2. The Clifton St off-ramp is 733 against 617 in the PM and 626 against 524 in the AM; the 52nd St ramp is within 3% in the PM and the AM.
3. Hillegass Ave NB freeway share 54.6 against 47 and the Alcatraz Ave entries (242 against 360, Dana St 5 against 43).
4. The delays at Telegraph Ave and 51st St (17 to 25 s against 37 to 63 s) and at Claremont Ave and Ashby Ave are below their worksheets; no change was made because the split does not depend on them.
5. Claremont Crescent needs the real lane layout of Ashby Ave at Claremont Ave; the sharp turn from Ashby Ave eastbound onto the slip link is not verified.

## Twenty-sixth round: review fixes to the demand and the verdict (change calibration-round-26)

PM peak, AM and midday, seeds 1 to 10, scale 1.0, 60 minutes, `calibrate` built from commit 068e927 (the libm commit of the simulator fixes; interim results on the earlier binary agreed within seed spread). Before: network 5fe8241a6ba1e306, demand 8695ddc28b152c35 (round 25). After: network 5fe8241a6ba1e306 (unchanged), demand 6f2e5661ad6e3ba9 (rebuilt twice: same hash). Cross-validation demand f9c66e8df7b39d1d. Decisions are in `openspec/changes/archive/*-calibration-round-26/design.md`. No parameter was tuned toward a verdict: the checks were corrected and the status is what they say, `uncalibrated` (the area was `calibrated` before).

### What was wrong, reproduced

1. The held-out rule was in sample. The shipped demand is fitted with every station, so the PM validation stations scored 19 of 22 there. The assessment now runs the same ten seeds on the cross-validation demand (the fit without them, with the same ramp split and intent annotation as the shipped file) and scores them there.
2. Midday has no counts. Every midday target is the PM count times 0.62 (so is the AM or midday target of an ADT-based station and of a ramp with no AM count). The stations carry `derived` and the rule skips them: midday has no judged stations (232 of its 248 scored stations are derived; the other 16 have no recent count), and the verdict says "midday is checked for stability only". The caveat quotes no midday rates.
3. The AM trip ends counted five Telegraph Ave entries (60th, McAuley, 59th, 58th, 57th St; 199 veh/h together in the PM) as zero. They now take the PM count times 0.74 (entering) and the exits of 58th and 57th St the PM count times 0.78 (ASSUMPTION).
4. Plain flows of other pairs that make a counted turn kept at least 0.1 of their volume on top of the pinned flows. They now give up volume to the count (ASSUMPTION, `naturalDetour` 1.05): 375 veh/h PM from 137 flows (AM 318, midday 224).
5. Chained freeway links (3981 to 3984 to 3979; 4057 to 4081 to 4083 to 4077) divided flows into parts of one physical route. PM off-ramp flows divided: 353 of 1,344 (before 411 of 1,432).
6. Local intent flows had the other street's turn as an alternative; only through flows have alternatives now.

### Result

| PM peak, seeds 1 to 10 | Target | Before | After |
| --- | --- | --- | --- |
| Through cars Hillegass Ave SB / Colby St SB / Hillegass Ave NB / Colby St NB | 79-120 / 39-117 / 48-95 / 102-145 | 104 / 100 / 73 / 138 | 109 / 110 / 70 / 151 (Colby St NB outside) |
| Whole-street cars, same four blocks | 79 / 39 / 48 / 102 | 70 / 46 / 46 / 95 | 69 / 54 / 44 / 98 |
| Headline shares Hillegass Ave NB from / Colby St NB from / Hillegass Ave SB to / Colby St SB to | 47 / 47 / 68 / 45 | 54.6 / 42.7 / 63.2 / 40.8 | 53.9 / 41.9 / 65.1 / 43.2 |
| Mean headline error, points (D5) | within 10 | 5.2 (4 of 4) | 4.1 (4 of 4) |
| Removals per hour PM / AM / midday (D16: below 1.0) | below 1 | 0.00 / 0.00 / 0.00 | 0.00 / 0.00 / 0.00 |
| 52nd St off-ramp / Clifton St off-ramp, PM (counted 1,024 / 617) | | 1,001 / 733 | 1,043 / 726 |
| Same, AM (898 / 524) and midday (635 / 383) | | 892 / 626 and 670 / 480 | 881 / 638 and 650 / 466 |
| Alcatraz Ave entries at Colby St, Hillegass Ave, Dana St, PM | 360 | 242 | 233 |
| Hillegass Ave NB left turn onto Alcatraz Ave, PM / AM / midday (counted 43 / 42 / 27) | | 56 (PM only) | 48 / 47 / 34 |
| Colby St NB left turn onto Alcatraz Ave, PM / AM / midday (counted 131 / 78 / 81) | | 134 (PM only) | 132 / 80 / 84 |
| AM local trip ends implied by the count, destinations / origins (veh/h) | | 479 / 584 | 627 / 686 |
| AM trips in the demand after the fit, local / through (veh/h) | | 6,741 / 4,667 | 7,815 / 4,124 |
| Recent counts below GEH 5, PM fitted / held out in sample / held out out of sample | above 85% | 84 of 94 (89%) / 19 of 22 (86%) / not measured | 85 of 94 (90%) / 20 of 22 (91%) / 17 of 22 (77%) |
| Same, AM | | 73 of 82 (89%) / 22 of 23 (96%) / not measured | 71 of 77 (92%) / 19 of 19 (100%) / 17 of 19 (89%) |
| Midday | | 90 of 96 (94%) / 22 of 23 (96%) | no midday counts; stability only |
| Older counts below GEH 5, PM fitted / held out out of sample | reported | 52 of 96 (54%) / not measured | 50 of 96 (52%) / 14 of 33 (42%) |
| Same, AM | | 29 of 71 (41%) / not measured | 28 of 60 (47%) / 7 of 20 (35%) |

The AM sim reports no through-car check (the targets file has only PM whole-street counts), so AM through cars are known from the demand only: 5,826 to 5,587 veh/h offered and 4,667 to 4,124 after the fit. The ten-seed interval is about 4 veh/h on the through cars and 2 points on the shares.

### Verdict under the corrected rules

| Period | D16 | D5 | Station rule, recent, fitted | Station rule, recent, held out (out of sample) | Through cars |
| --- | --- | --- | --- | --- | --- |
| AM peak | holds | not gated | 71 of 77, pass | 17 of 19 (89%), pass | no target |
| Midday | holds | not gated | no counts | no counts | no target |
| PM peak | holds | holds | 85 of 94, pass | 17 of 22 (77%), fail | fail: Colby St NB 151 against 102 to 145 |

Status `uncalibrated`, no experimental period. Two checks fail in the PM peak. The held-out stations pass 77% on a fit that did not see them, against 91% on the fit that did, which is the over-fit the in-sample figure hid. Colby St northbound has 151 through cars against an upper bound of 145; it was 138 before. The cause was not investigated: the whole-street cars (98 against 102) and the freeway share (41.9% against 47) are close to their counts, so the extra cars end along the street or join it, which the changed local trip rates and the natural-flow cut both touch. The minimum for judging the held-out rule is 10 recent stations (ASSUMPTION): AM has 19 and PM 22.

### Assumed flows from the SR-24 off-ramps: not fixed

18 assumed flows from the mainline gates (PM 113 veh/h, AM 72, midday 70, 2% of the 5,734 PM off-ramp veh/h) carry the Colby St or Hillegass Ave movement as `via`, so the ramp split skips them and the simulator chooses their ramp. A two-stage `via` needs a change in `crates/sim`.

### Scenario regression, no via loops

63rd St scenario (two filters, two diverters) and the six-filter scenario (proposal p5), PM peak, seeds 1 to 3, no gridlock removals, no unroutable trips, no invalid interventions. Share of assumed-flow trips that visit a node twice, baseline / scenario: 7.9% / 8.4% (63rd St) and 7.9% / 9.2% (six filters), round 25 7.6% / 8.1% and 7.6% / 8.5%; the share that still makes the blocked movement falls from 23% to 7% and 0%. Ramp flows: 1.4% / 1.6% and 1.4% / 1.5% revisits.

### What remains

The Alcatraz Ave entries (233 against 360), the Alcatraz Ave turn-ins onto Colby St and Hillegass Ave southbound (45 and 31 against 76 and 50, 54 against 98) and the 52nd St and Martin Luther King Jr Way movements stay low; the natural-flow cut removes trips that the turn-ins also used. Older counts pass 52% (PM) and 47% (AM) fitted and 42% and 35% held out. Colby St northbound through cars are above their range.
