# Rockridge baseline calibration record: archive, part 2

Rounds from the seventeenth on, moved unchanged from `rockridge.record.md` (round seventeen on 2026-11-15) to keep that file under the 200 KB limit of the pre-commit hook. `rockridge.record-archive.md` holds rounds one to sixteen and is full. Newer rounds and the main step table are in `rockridge.record.md`.

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
