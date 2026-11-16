# Rockridge baseline calibration record: archive, part 2

Rounds from the seventeenth on, moved unchanged from `rockridge.record.md` (round seventeen on 2026-11-15, rounds eighteen to twenty-one on 2026-11-16) to keep that file under the 200 KB limit of the pre-commit hook. `rockridge.record-archive.md` holds rounds one to sixteen and is full. Newer rounds and the main step table are in `rockridge.record.md`.

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
