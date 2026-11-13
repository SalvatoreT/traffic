## Context

The baseline-calibration change was archived on 2026-11-13 with eleven known limits (its D40). The user then decided that two of them are not acceptable as limits. This change works on those two with public observed data that earlier rounds did not have, and takes in a second user decision of the same day about where local trips load. Figures are in `data/calibration/rockridge.record.md`, seventeenth round. D numbers of the earlier change are cited as "earlier D35" and so on.

## Goals / Non-Goals

Goals: correct the model inputs at the 52nd St off-ramp from observed counts, lanes and phasing; test the route-time explanation of the Colby St gap against observed travel times; load local trips along blocks; state every before and after figure.

Non-goals: PM stability as such; a calibrated status; rerunning the proposal searches and publishing data (the lead session does both).

## Decisions

### D1 User decisions of 2026-11-13
- The PM peak stays experimental, and no further work goes into PM stability as such. The limit at Adeline St, Martin Luther King Jr Way and Stanford Ave stands.
- Two gaps are not accepted as known limits, and work continues without waiting for data from the user: the 52nd St off-ramp at Shattuck Ave (473 veh/h modeled against 1,278, Clifton St 1,527 against 972), and Colby St northbound losing its traffic before Alcatraz Ave. This supersedes the "stop tuning" of earlier D35 and the "nothing was changed" of earlier D39.
- Relayed by the lead session the same day: local trips load mid-block instead of at intersections, everywhere; and the 187 veh/h that the demand put at the junction of 63rd St and Hillegass Ave are audited and spread if they are an artifact.

### D2 Public observed data comes first
Two certified environmental impact reports hold peak-hour turning-movement counts, lane configurations and signal worksheets inside the model area ([CHRCO-EIR2014], [SafewayCollege-DEIR2011]), and the county's level-of-service monitoring holds measured peak-period speeds on three arterials ([ACTC-LOS2014], [ACTC-LOS2018]). All were downloaded and the tables read; `docs/references.md` says what was read in each. [TelegraphCS2013] gives bus speeds and computed delays and is context only. Hosts that did not answer: web.archive.org (no connection) and realestate.ucsf.edu (HTTP 403, the newer hospital building EIR). Not searched in depth: the MacArthur BART transit village EIR (it is on the City's page), Caltrans PeMS ramp detectors, Berkeley counts.

### D3 Published intersection counts are count stations
A data file lists each counted intersection with its source, date, location, the street and bearing of every leg, and volumes by approach and movement. The build places each leg on the network by street name, distance and bearing, with no street name in code, and makes a station for the volume entering and leaving on each leg (weight 1) and a movement constraint for each left or right turn of at least 25 veh/h (weight 0.5, because turns restate part of the legs). Fourteen intersections give 100 leg stations and 78 movements. ASSUMPTION: no growth from 2010 or 2013; midday is the PM count times 0.62 at half weight. Alternatives: the existing compass-leg reader of the Oakland counts knows PM volumes only and no movements; extending it would have kept two formats for one kind of data.

### D4 A counted hour on a ramp comes before ADT times K
Where a counted leg is a ramp, its station replaces the ADT times 0.09 station. Six ramps: the counted hours are 63% to 97% of the ADT-based values. Ramps that share one published ADT row share what the row leaves after the counted one. Without that rule the two Martin Luther King Jr Way on-ramps were asked to carry 2,416 veh/h where the row gives 1,737.

### D5 An observed approach can have a phase of its own
The worksheets show a protected eastbound left at Shattuck Ave and 52nd St (cycle 110 s, 33.5 s; westbound through 27.6 s) and two alternating streams at the Martin Luther King Jr Way ramp signal (cycle 50 s, 29 s for the 1,547 veh/h bound for the on-ramp). The simulator grouped approaches of one street into one phase with permissive lefts. `signalObservations` now takes a heading (one side of a street), a location (when the names match several signals) and `ownPhase`. An approach marked so leaves its street's phase and runs alone with the observed green. That is split phasing [FHWA-STM2008] (section 4.3.4). ASSUMPTION: a lead-lag protected left is shown as split phases, so the eastbound through at Shattuck Ave gets 33.5 s where it has 57.2 s. Midday uses the PM timing (ASSUMPTION). Alternative: per-movement signal states, which would need the signal state to leave the link; not done.

### D6 A crosswalk runs with the approach beside it
Left-turners with a protected phase waited for pedestrians on the crosswalk they turn over. Among the two neighboring approaches the crosswalk had taken the first found, which was the one whose left turn crosses it. It now takes the approach on the next leg clockwise, the traffic that runs beside it ([FHWA-STM2008] section 4.2.1), before the other. Signals whose neighbors share a phase are not affected.

### D7 Lanes: marked left lanes, sorting ahead, keeping to a side
- A left-turn lane marked along a link [OSMTurnLanes] stores left-turners for the whole link, and they use no other lane (`MARKED_LEFT_LANE`). It was a three-car pocket, and left-turners stood at the head of every lane.
- A driver sorts for the first turn at a link end with a choice within 150 m beyond the link entered, passing link ends with one movement (`LANE_LOOKAHEAD_M`, ASSUMPTION). A ramp that joins a street by its only movement, a right turn, had put every driver in the right lane.
- A driver sorting for a turn uses only the lanes on that side, the middle lane of an odd number included, and waits when they are full (`TURN_LANE_HALF`, ASSUMPTION).
Earlier D32 tried the first two and an unopposed left on the old demand and kept none, because half the ramp's drivers turned left there. They were tried again because the counted split is 24% and the observed phase now exists as data. Validation: b9 passes (818 against 815 to 1,075), nothing else moved, and case b12 was added (unopposed left lane, 660 veh/h at green share 0.5; range from the saturation flow of [FHWA-SIG2004] times 0.85 to 1.0, the factor an ASSUMPTION).

### D8 Route costs by turning movement
The router's link time was the mean over all vehicles leaving a link. Each movement now carries the difference between the time of the vehicles that made it and the link mean, so link plus movement cost is the larger of free-flow time and that movement's measured time (`ROUTE_COST_BY_TURN`). Free-flow routing for the wandering metrics uses the static costs. No parameter was added. Limit: when a turn queue spills onto the link before, the wait is measured on a link with one movement and is charged to everyone again.

### D9 Drive-through lanes are not streets
About 460 veh/h used a fast-food drive-through lane as a cut between Shattuck Ave and 52nd St. The importer now leaves out `service=drive-through` with parking aisles and driveways [OSMService]: 20 ways, 36 links, 2 gates at the model edge. The study area's links are unchanged.

### D10 Colby St: the route-time explanation was tested and does not hold
- Observed Telegraph Ave times are a target in the assessment. The simulator is inside the observed range northbound and southbound in the PM peak (350 s and 371 s against 302 to 420 and 300 to 376), so it does not run Telegraph Ave too fast.
- The router does use loaded times: measured per link from the probe run on, per movement since D8. On them the route over Colby St and the left onto Alcatraz Ave is 13% dearer than the best route from the freeway to Telegraph Ave north, 15% on free-flow times, 18% when the control constants are left out. The constants in `node-delays.json` are added on top of measured times that contain the wait; this double count is the same on every route and was left as it is. No per-approach or volume-dependent node delay was added, because none would change the ranking.
- The prior puts 2 veh/h on the left turn and the fit reaches 9 at the bound.
- Result: the last block carries 143 against 164 after D12 and D13, by trips that end on it. The left turn is at 10 against 131. The cause is in the trip table, not in route times.

### D11 Local flows may be scaled up to 10
The factor bound of local flows goes from 3 to 10, as for ramp flows. The local prior counts trips of resident workers only; inside the study area the volunteer count put trip ends at 3.4 to 4.2 times that prior (earlier D20), above the bound. The methods the fit follows have no bound ([VanZuylen1980], [Willumsen1981]). Measured before D12 and D13: headline share error 19.7 to 10.7 points, PM removals 2.20 to 1.30. The fit stays polarized (half the counted flows at the lower bound); that is a limit, D14.

### D12 A census block loads the junctions around it
Audit: each LODES block loaded its nearest residential-street node, 702 nodes for 1,027 blocks, 37 in the study area. The junction of 63rd St and Hillegass Ave sent out 185 veh/h in the PM peak: a prior of 46 times 4.1 from the fit, a fifth of the study area's origins. At 0.35 PM departures per detached dwelling [PBC-TripRates2022] that is about 530 dwellings, where the four blocks around hold about 236 resident workers. Decision: a block loads every residential-street node within 150 m of its centroid in equal parts (`local.spreadRadiusM`, ASSUMPTION). 1,101 loading nodes, 57 in the study area; the largest node sends out 214 veh/h (519), 63rd St and Hillegass Ave 97. Not done: a cap on a node's fitted trip ends against its prior.

### D13 Local trips start and end along the block
A trip from a node that is not a gate pulls out from the curb of its first link, in the curb lane, at a position fixed per trip between 25% and 75% of the block (`MID_BLOCK_LO`, ASSUMPTION; blocks under 20 m keep the junction end, `MID_BLOCK_MIN_M`, ASSUMPTION). It enters from a standstill when the IDM desired gap [Treiber2000] holds for it behind its leader and for the follower behind it, the rule of gate insertion applied to both neighbors. A trip to a node that is not a gate leaves the road at such a position on its last link. The first link is the one the router chose under the current interventions, so no trip has to cross a closed node. Partial link times of these trips do not enter the route costs. Gates are unchanged. ASSUMPTION: the vehicle does not slow down to leave. The UI draws vehicles from simulator positions and needs no change; the provenance note that the Sources panel shows now says where local trips start.

### D14 Known limits at the close of the change
1. PM removals 2.30 per hour. Not worked on (D1).
2. Permissive left turns enter ahead of queued opposing vehicles (earlier D38). Unchanged.
3. The 52nd St off-ramp: 544 against 1,024 counted, Clifton St 1,216 against 617. Tried: D3 to D9. Left: the left turn discharges 232 veh/h against 342 into a 32 m single-lane block, the queue reaches the ramp, and D8 cannot separate it there. Next: discharge of a turn into a short exit link; route costs by sorted lane.
4. Headline shares: error 14.0 points (19.1). Tried: D11, D12.
5. The left turn from Colby St onto Alcatraz Ave west, 10 against 131, and toward Claremont Ave northeast, 1 against 75. Tried: D10. Needs origins and destinations of that traffic.
6. Ashby Ave at Claremont Ave: resolved by the count (783 and 649 counted, 648 and 681 modeled).
7. Claremont Ave north of Ashby Ave: the leg is counted now; the gate is still a class default.
8. `YIELD_FALLBACK_S` 90 s. Unchanged.
9. Counts of 2010 and 2013 with no growth; one count day on the interior streets.
10. Leave-one-corridor-out cross-validation not run.
11. U-turn at the gate stub of Dana St at Ward St. Unchanged.
12. Shattuck Ave between 51st St and Alcatraz Ave is 60 to 100 s slower than observed in the PM peak.
13. The fit is polarized, and single nodes still rise above their prior.
14. Telegraph Ave at 51st St and 52nd St carries about half its counted volumes in the simulator.

## Risks / Trade-offs

- The lane rules and the route costs act on every multilane link and every route. The validation suite did not regress and AM and midday hold the stability rule, but the PM peak moved from 1.80 to 2.30 removals per hour.
- The pooled station score fell from 68% to 61% below GEH 5 because 70 stations at busy junctions were added; the interior blocks did not get worse.
- Counts of 2010 and 2013 sit beside counts of 2018 to 2025.
- The network and demand hashes changed, so the published proposals are stale.
