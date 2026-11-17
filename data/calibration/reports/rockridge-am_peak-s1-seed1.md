# Calibration report: rockridge am_peak scale 1 seed 1 (60 min)

Offered demand 22396 veh/h x scale 1 = 22396 veh/h. Run took 34.3 s wall clock. Flow tables use the window after a 10 min warm-up; select-link and health figures cover the whole run from an empty network.

## Stability (design D4)

| Criterion | Threshold | Value | Result |
| --- | --- | --- | --- |
| Gridlock removals | 0 | 0 | pass |
| Backlog / spawned | < 2% | 0.0% (0 of 22432) | pass |
| Arterial mean speed (run) | > 4 m/s | 9.07 m/s (last 15 min 9.13) | pass |

Overall: **STABLE**. Mean trip delay 128 s, mean trip time 376 s, completed 22664, unroutable 0.

| t (min) | vehicles in network | backlog | completed | removals | arterial speed in interval (m/s) |
| --- | --- | --- | --- | --- | --- |
| 5 | 2457 | 1 | 1955 | 0 | 8.86 |
| 10 | 2493 | 1 | 3839 | 0 | 8.83 |
| 15 | 2403 | 10 | 5754 | 0 | 9.10 |
| 20 | 2441 | 2 | 7612 | 0 | 9.07 |
| 25 | 2404 | 2 | 9501 | 0 | 9.05 |
| 30 | 2432 | 6 | 11370 | 0 | 9.06 |
| 35 | 2431 | 4 | 13295 | 0 | 9.34 |
| 40 | 2385 | 1 | 15186 | 0 | 9.19 |
| 45 | 2434 | 2 | 16980 | 0 | 8.93 |
| 50 | 2373 | 2 | 18881 | 0 | 8.93 |
| 55 | 2353 | 4 | 20802 | 0 | 9.03 |
| 60 | 2304 | 0 | 22664 | 0 | 9.44 |
## Wandering (completed car trips)

Detour ratio = distance driven (link and movement lengths) over the shortest network distance from the trip's origin to its destination. Detour against the free-flow route uses the time-shortest route with no congestion and no noise, which is what a purposeful driver without live information would follow (it differs from the shortest distance when a faster, longer road exists). A switch is a change of the remaining route while en route. Loops: the same link twice or the same node three or more times. Reversals: a link followed by its reverse within 200 m. 'Study-area vehicle-miles' are miles driven on links inside the study area; the last column is the share of them driven by trips with a detour ratio above 1.3. Guided drivers re-evaluate their route every epoch; the others keep their departure route unless it is blocked.

| Trips | n | Switches per trip | With a switch | Mean detour | Median detour | Detour > 1.3 | Detour > 2 | Mean detour vs free-flow route | Vs free-flow route > 1.3 | Loops | Reversals | Study veh-miles | Of them by detour > 1.3 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| all trips | 20912 | 0.02 | 1.5% | 1.089 | 1.052 | 5.0% | 0.0% | 1.024 | 2.0% | 0.0% | 0.2% | 2168 | 8.3% |
| gate to gate | 7214 | 0.03 | 2.7% | 1.092 | 1.067 | 3.5% | 0.0% | 1.023 | 1.8% | 0.0% | 0.1% | 500 | 8.1% |
| with a local end | 13698 | 0.01 | 0.9% | 1.088 | 1.048 | 5.8% | 0.0% | 1.024 | 2.1% | 0.0% | 0.2% | 1668 | 8.3% |
| guided drivers | 9597 | 0.03 | 3.3% | 1.090 | 1.053 | 5.1% | 0.0% | 1.024 | 2.1% | 0.0% | 0.1% | 982 | 9.1% |
| other drivers | 11315 | 0.00 | 0.1% | 1.089 | 1.051 | 4.9% | 0.0% | 1.023 | 2.0% | 0.0% | 0.2% | 1186 | 7.6% |

## Reported patterns (diagnostics; configured in the targets file under `patterns`)

(a) Trips between the surface gates on the north side of the ramps and the freeway mainline gates, and the local-street (residential and service links in the study area) vehicle-miles they drive. Share = of all completed trips' local-street vehicle-miles (350 miles). No observed counterpart exists for this quantity (the targets file has only the select-link shares above).

| Trips | n trips | Local-street veh-miles | Share of all local-street veh-miles |
| --- | --- | --- | --- |
| surface gates to the freeway | 978 | 26.0 | 7% |
| freeway to the surface gates | 1233 | 26.6 | 8% |

(b) Corridor trips: completed trips from beyond one end of the corridor's study-area extent (the bypass street and its arterial together) to beyond the other end, within a lateral limit of the corridor, by direction. 'Bypass' = at least N blocks (links) on the bypass street; 'arterial' = fewer bypass blocks and at least N on the arterial; 'other' = neither (another street, the freeway or a short use); blocks are counted on the corridor's study-area links. No observed counterpart exists for these shares. The related observed values are in the select-link table above: northbound Hillegass Ave traffic rarely ends on College Ave (6%), 21 to 33% jogs to Benvenue Ave, and southbound freeway-bound drivers on College Ave commonly arrive via Ashby Ave and Benvenue Ave and jog to Hillegass Ave.

| Bypass | Arterial | N | Direction | Corridor trips | Bypass | Arterial | Other | Mean bypass blocks |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue | College Avenue | 3 | N | 1003 | 4% | 18% | 78% | 0.2 |
| Hillegass Avenue | College Avenue | 3 | S | 1270 | 3% | 20% | 77% | 0.1 |

## Per-mode results

Offered: 22396 car veh/h; 497 bicycle flows (702/h); 2000 pedestrian flows (1340/h). Bicycle and pedestrian volumes are assumptions, not counts.

| Mode | In network | Completed | Mean time (s) | Other |
| --- | --- | --- | --- | --- |
| Car | 2304 | 22664 | 376 | |
| Bicycle | 50 | 721 | 245 | |
| Pedestrian | 177 | 1221 | 460 | mean crossing delay 6.9 s |

Vulnerable road users (surrogate indicators): pedestrian conflicts 175, bicycle conflicts 802, close passes 618, pedestrian injury severity mean 0.045 (AIS4+, 7268 supported of 7268 encounters), cyclist injury severity mean 0.063 (MAIS3+F, 2941 supported of 5407 encounters) (separate endpoints, never summed), mean vehicle speed at pedestrian encounters 2.33 m/s.


## Through cars on the counted blocks (a car is through when neither trip end is in the study area)

Observed through range = from the cars that drove the whole street (volunteer count, a lower bound) to the block volume less the cars whose trip ends along the street (an upper bound). Observed freeway-end trips = observed block volume times the observed freeway share of the street (the headline share of the targets file); these include freeway trips that end inside the study area, so they are not an expected through count. Modeled through = select-link trips with no end in the study area, per hour. Modeled freeway = select-link trips from or to a freeway node, per hour.

| Block | Observed volume (veh/h) | Observed freeway share | Observed freeway-end trips (veh/h) | Observed through range (veh/h) | Modeled through (veh/h) | In range | Modeled freeway trips (veh/h) |
| --- | --- | --- | --- | --- | --- | --- | --- |

Fitted: Colby Street NB, Colby Street SB, Hillegass Avenue NB, Hillegass Avenue SB are targets of the demand fit (`countFit.throughTargets`, calibration round 39), so these rows are no longer an independent check. The checks that stay independent are the held-out count stations, the headline freeway shares, stability and the arterial travel times.

## Intent map: through cars by where they come from and where they are going

Through = neither trip end is in the study area. Groups are the approach groups of the area config (data/areas); a node that is not a gate takes the group of the nearest surface gate (ASSUMPTION). The arterial is the one a trip would use on the shortest free-flow path with the study area's residential and service streets closed, where that path runs on a boundary street near the study area.

Model figures are the mean of 1 seed(s), per hour of the run. Basis: OBSERVED = read from the resident volunteer count of Feb 25, 2025 or its headline shares; ASSUMPTION = inferred from those numbers or chosen.

### Colby Street NB

Observed (PM): 182 cars entered at the south end, 102 drove the whole street, 164 left it at Alcatraz Ave (131 left, 32 right, 1 straight), and 47% of the block's trips came from a freeway (the headline share). ASSUMPTION: freeway-origin cars that do not end along the street are 65 veh/h (the 82 freeway-origin trips on the block, 47% of 174, times the 182 / (182 + 47) of its cars that entered at the south end rather than joining on the way), spread over the 164 exits in proportion (0.40); the other through cars come from the Telegraph Ave and south-side approaches that feed the street's south end. Ranges: low = 131 (32) x 0.47 x 0.62 (the whole-street share of exits), high = 131 (32) x 0.47.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | OBSERVED turn count x ASSUMPTION share (131 left turns x 0.40) | 52 (38 to 62) | 46 | within |
| Telegraph Ave and south-side traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | ASSUMPTION: the through left-turners (131 x 0.62 = 81) that are not off-ramp traffic | 29 (19 to 43) | 28 | within |
| SR-24 off-ramp traffic using Colby St to reach College Ave and Berkeley (right at Alcatraz Ave) | OBSERVED turn count x ASSUMPTION share (32 right turns x 0.40) | 13 (9 to 15) | 7 | below |
| Telegraph Ave and south-side traffic using Colby St to reach College Ave and Berkeley | ASSUMPTION: the through right-turners (32 x 0.62 = 20) that are not off-ramp traffic | 7 (5 to 11) | 24 | above |
| Intents listed, together | | 101 (71 to 131) | 105 | |
| Other through cars (no intent listed) | | | 1 | |

Model through cars by origin and destination group (largest 12 of 10 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 46.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 24.0 | Telegraph Avenue |
| Telegraph Ave to the south (downtown Oakland) | Telegraph Ave from the north (Berkeley) | 18.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Ashby Ave from the west (Emeryville and I-80) | 6.0 | Claremont Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 4.0 | SR-24 |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 3.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Emeryville and West Oakland streets (55th to 67th Streets) | 2.0 | Claremont Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 1.0 | Telegraph Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Telegraph Ave from the north (Berkeley) | 1.0 | Telegraph Avenue |
| SR-13 Warren Freeway (via SR-24 east) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 1.0 | Claremont Avenue then Alcatraz Avenue |

By the arterial these cars would otherwise use: Telegraph Avenue 93 veh/h; Claremont Avenue 8 veh/h; SR-24 4 veh/h; Claremont Avenue then Alcatraz Avenue 1 veh/h.

### Hillegass Avenue NB

Observed (PM): 94 cars entered at the south end, 48 drove the whole street, 109 left it at Alcatraz Ave (43 west, 54 east, 12 straight), and 47% of the block's trips came from a freeway. ASSUMPTION: freeway-origin through cars are 40 veh/h (52 freeway-origin trips times 94 / (94 + 29)), spread over the exits in proportion (0.37); the through share of exits is 48 / 109 = 0.44.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Hillegass Ave to reach Alcatraz Ave west and Telegraph Ave north | OBSERVED turn count x ASSUMPTION share (43 left turns x 0.37) | 16 (9 to 20) | 20 | within |
| SR-24 off-ramp traffic using Hillegass Ave to reach College Ave and Berkeley | OBSERVED turn count x ASSUMPTION share (54 right turns x 0.37) | 20 (11 to 25) | 27 | above |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach Alcatraz Ave west | ASSUMPTION: through exits (43 x 0.44) that are not off-ramp traffic | 3 (0 to 10) | 1 | within |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach College Ave and Berkeley | ASSUMPTION: through exits (54 x 0.44) that are not off-ramp traffic | 4 (0 to 13) | 20 | above |
| Intents listed, together | | 43 (20 to 68) | 68 | |
| Other through cars (no intent listed) | | | 1 | |

Model through cars by origin and destination group (largest 12 of 18 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 15.0 | SR-24 |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 13.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 10.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 6.0 | SR-24 then Claremont Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | College Ave from the north (Berkeley) | 5.0 | SR-24 then Claremont Avenue then College Avenue |
| Telegraph Ave to the south (downtown Oakland) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 5.0 | Telegraph Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Alcatraz Ave from the west (Emeryville side) | 2.0 | SR-24 then Telegraph Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Shattuck Ave from the north (Berkeley) | 2.0 | SR-24 then Telegraph Avenue then Alcatraz Avenue |
| Telegraph Ave to the south (downtown Oakland) | College Ave from the north (Berkeley) | 2.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | College Ave from the north (Berkeley) | 1.0 | College Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Claremont Ave and Tunnel Rd toward the hills | 1.0 | Claremont Avenue |
| SR-13 Warren Freeway (via SR-24 east) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 1.0 | Claremont Avenue then Alcatraz Avenue |
| other pairs | | 6.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 31 veh/h; SR-24 16 veh/h; SR-24 then Claremont Avenue 6 veh/h; SR-24 then Claremont Avenue then College Avenue 5 veh/h; SR-24 then Telegraph Avenue 3 veh/h; Claremont Avenue 2 veh/h.

### Hillegass Avenue SB

Observed (PM): 178 cars entered at the top (76 turned in from Alcatraz Ave west, 98 from the east, 4 came straight from the north), 79 drove the whole street, and 68% of the block's trips (109 veh/h) went to a freeway. ASSUMPTION: freeway-bound cars that did not join mid-street are 87 veh/h (109 x 178 / (178 + 44)), half of the 174 turn-ins; low = the whole-street share of the turn-ins (0.45), high = the freeway-bound share without the mid-street correction (0.63).

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Telegraph Ave, Alcatraz Ave west and West Berkeley traffic turning off Alcatraz Ave onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (76 turn-ins x 0.50) | 38 (34 to 48) | 13 | below |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (98 turn-ins x 0.50) | 49 (44 to 62) | 27 | below |
| Intents listed, together | | 87 (78 to 110) | 40 | |
| Other through cars (no intent listed) | | | 30 | |

Model through cars by origin and destination group (largest 12 of 9 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 21.0 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 13.0 | Claremont Avenue then SR-24 |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 13.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 8.0 | Claremont Avenue then SR-24 |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 6.0 | College Avenue then Claremont Avenue then SR-24 |
| Telegraph Ave from the north (Berkeley) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 5.0 | College Avenue |
| Telegraph Ave from the north (Berkeley) | College Ave from the north (Berkeley) | 2.0 | College Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Telegraph Ave to the south (downtown Oakland) | 1.0 | Claremont Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Emeryville and West Oakland streets (55th to 67th Streets) | 1.0 | Claremont Avenue then Alcatraz Avenue |

By the arterial these cars would otherwise use: Telegraph Avenue 34 veh/h; Claremont Avenue then SR-24 21 veh/h; College Avenue 7 veh/h; College Avenue then Claremont Avenue then SR-24 6 veh/h; Claremont Avenue 1 veh/h; Claremont Avenue then Alcatraz Avenue 1 veh/h.

### Colby Street SB

Observed (PM): 139 cars entered at the top (76 from Alcatraz Ave west, 50 from the east, 13 from the north), 39 drove the whole street, 45% of the block's trips (72 veh/h) went to a freeway and 22% came by way of Telegraph Ave. ASSUMPTION: freeway-bound cars that did not join mid-street are 46 veh/h (72 x 139 / (139 + 79)), 0.365 of the 126 turn-ins; low = the whole-street share (0.31), high = the unadjusted freeway share (0.57). The Telegraph Ave cars are the 22% x 160 = 35 of the 76 west turn-ins.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Southbound Telegraph Ave traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (35 Telegraph Ave cars x 0.365) | 13 (11 to 20) | 18 | within |
| Alcatraz Ave west, Ashby Ave and West Berkeley traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (41 other west turn-ins x 0.365) | 15 (13 to 23) | 17 | within |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (50 east turn-ins x 0.365) | 18 (15 to 29) | 15 | within |
| Intents listed, together | | 46 (39 to 72) | 50 | |
| Other through cars (no intent listed) | | | 44 | |

Model through cars by origin and destination group (largest 12 of 20 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 27.0 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 17.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 8.0 | Telegraph Avenue |
| Shattuck Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 7.0 | none near the study area |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | West Oakland to the southwest (Adeline St, Market St) | 5.0 | Telegraph Avenue |
| Alcatraz Ave from the west (Emeryville side) | SR-13 Warren Freeway (via SR-24 east) | 4.0 | SR-24 |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 4.0 | College Avenue then Claremont Avenue then SR-24 |
| Alcatraz Ave from the west (Emeryville side) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 3.0 | SR-24 |
| College Ave from the north (Berkeley) | Telegraph Ave to the south (downtown Oakland) | 3.0 | Telegraph Avenue |
| Ashby Ave from the west (Emeryville and I-80) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 2.0 | Claremont Avenue |
| Ashby Ave from the west (Emeryville and I-80) | SR-13 Warren Freeway (via SR-24 east) | 2.0 | SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 2.0 | Alcatraz Avenue then Telegraph Avenue |
| other pairs | | 10.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 60 veh/h; SR-24 10 veh/h; none near the study area 8 veh/h; College Avenue then Claremont Avenue then SR-24 4 veh/h; Claremont Avenue 3 veh/h; Claremont Avenue then SR-24 3 veh/h.

### Study area, all residential and service streets

Model: 464 through cars per hour.

Model through cars by origin and destination group (largest 12 of 56 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 64.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 55.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 53.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 44.0 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 28.0 | Telegraph Avenue |
| Telegraph Ave to the south (downtown Oakland) | Telegraph Ave from the north (Berkeley) | 18.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Ashby Ave from the west (Emeryville and I-80) | 15.0 | Claremont Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 15.0 | SR-24 |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 13.0 | Claremont Avenue then SR-24 |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 13.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Shattuck Ave from the north (Berkeley) | 12.0 | Claremont Avenue |
| Telegraph Ave from the north (Berkeley) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 11.0 | Telegraph Avenue |
| other pairs | | 123.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 316 veh/h; Claremont Avenue 45 veh/h; SR-24 27 veh/h; none near the study area 19 veh/h; Claremont Avenue then SR-24 14 veh/h; College Avenue then Claremont Avenue then SR-24 7 veh/h.

By origin group: Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 111; South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 110; SR-24 eastbound off-ramps (arriving from Oakland and I-980) 88; Telegraph Ave from the north (Berkeley) 43; Telegraph Ave to the south (downtown Oakland) 39; Claremont Ave and Tunnel Rd toward the hills 14; College Ave from the north (Berkeley) 11; San Pablo Ave (Emeryville and West Oakland) 9; Ashby Ave from the west (Emeryville and I-80) 8; Shattuck Ave from the north (Berkeley) 8.

By destination group: SR-24 westbound on-ramps (toward Oakland and I-980) 107; Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 95; Telegraph Ave from the north (Berkeley) 78; South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 70; Claremont Ave and Tunnel Rd toward the hills 22; College Ave from the north (Berkeley) 17; Ashby Ave from the west (Emeryville and I-80) 16; Shattuck Ave from the north (Berkeley) 14; Emeryville and West Oakland streets (55th to 67th Streets) 12; Telegraph Ave to the south (downtown Oakland) 7.


## Through cars by intent (cut-through intent view)

A through car is tallied once, under the first intent that fits it (the on-ramp on its planned route, the off-ramp it has driven, or the origin and destination groups of its trip), at the moment the through count counts it. Cars an hour over the run, the same window as the through-car figure (469 an hour).

| Intent | Basis | Cars an hour | Share |
| --- | --- | --- | --- |
| on-2853241697 | observed | 108 | 23% |
| Other on-ramps | assumed | 12 | 3% |
| off-52990846 | observed | 90 | 19% |
| Other off-ramps | assumed | 10 | 2% |
| Downtown, south and west Oakland traffic using side streets to reach Berkeley and Telegraph Ave north | assumed | 116 | 25% |
| Berkeley and Telegraph Ave north traffic using side streets to reach downtown, south and west Oakland | assumed | 75 | 16% |
| Oakland cross-town traffic (West Oakland, Broadway, Piedmont, Emeryville) using side streets near Claremont Ave and Telegraph Ave | assumed | 32 | 7% |
| Other (no intent listed) |  | 26 | 6% |

Intents listed cover 94% of through cars.


## Select-link shares: modeled vs observed (design D5: headline = freeway shares, tolerance +/-10 pp)

- Hillegass Avenue NB: 4 links (path Claremont Avenue -> Alcatraz Avenue (434 m)), 148 trips (139 completed)
- Colby Street NB: 8 links (path Claremont Avenue -> Alcatraz Avenue (680 m)), 201 trips (186 completed)
- Hillegass Avenue SB: 4 links (path Alcatraz Avenue -> Claremont Avenue (433 m)), 115 trips (112 completed)
- Colby Street SB: 8 links (path Alcatraz Avenue -> Claremont Avenue (680 m)), 231 trips (223 completed)

| Block | Side | Via | Observed | Modeled | Diff (pp) | n trips | Headline |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue NB | from | freeway | 47% | 57% | +10 | 148 | within |
| Hillegass Avenue NB | to | Benvenue Avenue | 21% (PM 33%) | 8% | -13 | 148 |  |
| Hillegass Avenue NB | to | College Avenue | 6% | 16% | +10 | 148 |  |
| Hillegass Avenue NB | to | Alcatraz Avenue WB | 27% | 33% | +6 | 148 |  |
| Colby Street NB | from | freeway | 47% | 49% | +2 | 201 | within |
| Colby Street NB | to | Alcatraz Avenue WB | 48% | 54% | +6 | 201 |  |
| Colby Street NB | to | Telegraph Avenue | 25% | 41% | +16 | 201 |  |
| Colby Street NB | to | College Avenue | 3% | 2% | -1 | 201 |  |
| Hillegass Avenue SB | from | Alcatraz Avenue WB | 46% | 23% | -23 | 115 |  |
| Hillegass Avenue SB | from | Benvenue Avenue | 26% | 3% | -23 | 115 |  |
| Hillegass Avenue SB | from | College Avenue | 16% | 18% | +2 | 115 |  |
| Hillegass Avenue SB | to | freeway | 57% (PM 68%) | 63% | +6 | 115 | within |
| Colby Street SB | from | Alcatraz Avenue EB | 43% | 23% | -20 | 231 |  |
| Colby Street SB | from | Alcatraz Avenue WB | 46% | 9% | -37 | 231 |  |
| Colby Street SB | from | Telegraph Avenue | 22% | 18% | -4 | 231 |  |
| Colby Street SB | to | freeway | 45% | 50% | +5 | 231 | within |
| Colby Street SB | to | Forest Street | 34% | 13% | -21 | 231 |  |

Headline shares within tolerance: 4 of 4. Observed column uses the PM-peak share where one is given and the period is pm_peak. 'Via' shares are the fraction of select-link trips using that street before (from) or after (to) the block; freeway = origin / destination gate with a motorway-class link attached.

## Claremont ramps: streets used before the on-ramp / after the off-ramp

Observed shares are for traffic from/to the north only. 'Modeled' is over all trips on the ramps and any visit to the street (an upper bound for streets that serve both sides). 'Modeled, side' counts only trips whose surface end lies on the side of the ramp stated in the targets file (`freewayRamp.side`), and for a street with a qualifier ("north of X") only its links on that side of X.

| Direction | Via | Observed | Modeled | n ramp trips | Modeled, side | n side trips |
| --- | --- | --- | --- | --- | --- | --- |
| onto freeway | College Avenue | 16% | 14% | 659 | 15% | 584 |
| onto freeway | Hillegass Avenue | 12% | 13% | 659 | 14% | 584 |
| onto freeway | Martin Street | 10% | 11% | 659 | 12% | 584 |
| onto freeway | Colby Street | 8% | 14% | 659 | 16% | 584 |
| onto freeway | Telegraph Avenue north of Alcatraz Avenue | 8% | 10% | 659 | 9% | 584 |
| onto freeway | Benvenue Avenue | 5% | 4% | 659 | 5% | 584 |
| from freeway | College Avenue | 10% | 11% | 651 | 11% | 615 |
| from freeway | Martin Street | 10% | 10% | 651 | 11% | 615 |
| from freeway | Colby Street | 8% | 11% | 651 | 12% | 615 |
| from freeway | Hillegass Avenue | 5% | 8% | 651 | 9% | 615 |
| from freeway | Benvenue Avenue | 3% | 2% | 651 | 2% | 615 |

## Top 15 links by delay

| Link | Street | Class | Lanes | Len (m) | End node control | Delay (veh-h) | Stopped (veh-h) | Mean stopped veh | Flow (veh/h) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 4175 | (unnamed) | Motorway | 2 | 142 | uncontrolled | 23.19 | 4.58 | 4.6 | 1522 |
| 3395 | Ashby Avenue | Primary | 1 | 129 | signal | 8.63 | 6.99 | 7.0 | 467 |
| 460 | Sacramento Street | Tertiary | 2 | 104 | two_way_stop | 7.82 | 6.52 | 6.5 | 406 |
| 2921 | Russell Street | Residential | 1 | 260 | uncontrolled | 7.31 | 5.27 | 5.3 | 196 |
| 834 | Martin Luther King Junior Way | Secondary | 4 | 49 | signal | 7.17 | 5.27 | 5.3 | 1385 |
| 1049 | Adeline Street | Secondary | 4 | 43 | signal | 6.91 | 5.86 | 5.9 | 998 |
| 755 | Market Street | Tertiary | 2 | 77 | signal | 6.44 | 5.50 | 5.5 | 505 |
| 1666 | 52nd Street | Secondary | 4 | 39 | signal | 6.03 | 5.33 | 5.3 | 641 |
| 1108 | Market Street | Secondary | 4 | 36 | signal | 5.98 | 4.87 | 4.9 | 1114 |
| 764 | Martin Luther King Junior Way | Secondary | 4 | 48 | signal | 5.73 | 4.60 | 4.6 | 1369 |
| 115 | San Pablo Avenue | Primary | 3 | 54 | signal | 5.64 | 4.56 | 4.6 | 716 |
| 1051 | Adeline Street | Secondary | 4 | 50 | signal | 5.46 | 4.71 | 4.7 | 818 |
| 3001 | College Avenue | Tertiary | 1 | 107 | signal | 5.07 | 3.79 | 3.8 | 520 |
| 4167 | (unnamed) | Motorway | 3 | 75 | uncontrolled | 4.91 | 1.37 | 1.4 | 2416 |
| 3370 | The Uplands | Tertiary | 1 | 311 | uncontrolled | 4.77 | 3.64 | 3.6 | 186 |

## Top 15 nodes by blocked time

Blocked time = lane-head seconds waiting at the stop line without permission (signal red, conflict, stop sign or no downstream space).

| Node | Streets | Control | Gate | Blocked (lane-h) | of which no downstream space | Signal plan at end (cycle: greens) |
| --- | --- | --- | --- | --- | --- | --- |
| 447 | Adeline Street / Alcatraz Avenue | signal |  | 4.98 | 0.10 | 75 s: 22/43 |
| 680 | 52nd Street / Shattuck Avenue | signal |  | 4.57 | 0.02 | 90 s: 18/19/37 |
| 446 | Market Street / Stanford Avenue | signal |  | 4.52 | 0.16 | 75 s: 31/34 |
| 332 | 55th Street / Martin Luther King Junior Way | signal |  | 3.34 | 0.04 | 75 s: 34/31 |
| 1406 | Ashby Avenue / Claremont Avenue | signal |  | 3.21 | 0.27 | 75 s: 29/16/15 |
| 37 | San Pablo Avenue / Stanford Avenue | signal |  | 3.14 | 0.02 | 75 s: 25/40 |
| 30 | 57th Street / Adeline Street / Market Street | signal |  | 3.08 | 0.02 | 75 s: 21/18/21 |
| 185 | Alcatraz Avenue / Sacramento Street | signal |  | 2.96 | 0.05 | 75 s: 35/30 |
| 242 | Ashby Avenue / Martin Luther King Junior Way | signal |  | 2.90 | 0.01 | 75 s: 41/24 |
| 479 | Adeline Street / Martin Luther King Junior Way / Stanford Avenue | signal |  | 2.84 | 0.02 | 75 s: 48/17 |
| 851 | Alcatraz Avenue / Telegraph Avenue | signal |  | 2.61 | 0.06 | 75 s: 43/22 |
| 713 | 51st Street / Telegraph Avenue | signal |  | 2.48 | 0.01 | 75 s: 42/23 |
| 944 | Ashby Avenue / Shattuck Avenue | signal |  | 2.41 | 0.02 | 75 s: 43/22 |
| 1220 | Ashby Avenue / College Avenue | signal |  | 2.34 | 0.04 | 75 s: 35/30 |
| 331 | 52nd Street / Martin Luther King Junior Way | signal |  | 2.21 | 0.02 | 75 s: 48/17 |

Phases of the five most blocked signals (green s: approach links with their lanes, link ids in brackets):

- node 447: 22 s: Adeline Street 4L [1049], Adeline Street 4L [1051]; 43 s: Alcatraz Avenue 2L [1048], Alcatraz Avenue 2L [1133]
- node 680: 18 s: 52nd Street 4L [1662]; 19 s: 52nd Street 4L [1666], 52nd Street 4L [1662]; 37 s: Shattuck Avenue 2L [1653], Shattuck Avenue 2L [1705]
- node 446: 31 s: Stanford Avenue 3L [941], Stanford Avenue 3L [1055]; 34 s: Market Street 4L [1108], Market Street 3L [1111]
- node 332: 34 s: Martin Luther King Junior Way 4L [764], Martin Luther King Junior Way 4L [834]; 31 s: 55th Street 1L [712], 55th Street 1L [715]
- node 1406: 29 s: Ashby Avenue 1L [3395], Ashby Avenue 2L [3426]; 16 s: Claremont Avenue 2L [4329]; 15 s: Claremont Avenue 3L [3447]

## Cars cleared from gridlock near and far (judged zone)

Judged zone: the study area, its bounding streets and the junctions on them, plus nodes within 200 m of it along the network (111 nodes, 329 links). A far clearing counts against the stability rule when its blocking chain (vehicles held at least 60 s by a full exit, at the 5 s snapshot before it) reaches a link in the zone.

| Buffer (m) | Near | Far | Far, chain reaches the zone | Judged |
| --- | --- | --- | --- | --- |
| 100.0 | 0 | 0 | 0 | 0 |
| 200.0 | 0 | 0 | 0 | 0 |
| 400.0 | 0 | 0 | 0 | 0 |

Entry backlog at the end of the run: 0 trips waiting at origins in the zone, of 0 in all.

| Bounding street | Links | Longest standing queue on one link (m) | Link (length m) | At (min) | Share of samples with a link full |
| --- | --- | --- | --- | --- | --- |
| Telegraph Avenue | 28 | 65.0 | 1979 (81.0) | 16.4 | 0.002 |
| Alcatraz Avenue | 14 | 72.0 | 4188 (143.0) | 13.6 | 0.012 |
| College Avenue | 6 | 85.0 | 2805 (102.0) | 51.7 | 0.002 |
| Claremont Avenue | 13 | 55.0 | 2776 (161.0) | 54.5 | 0.0 |
| CA 24 | 3 | 33.0 | 1945 (188.0) | 37.7 | 0.0 |

## Junction recovery

Policy `physical`. Node entries by cars and cyclists in the run: 694887 (settle interval 0). An admission is an entry the ordinary rule would have refused; head-seconds count the time a waiting head vehicle had the reason invoked, and the part of it in which it still could not enter. Courtesy and the yield fallback change priority only; under `physical` the conflict bypass never admits.

| Reason | Admissions per hour | Per 1,000 entries | Head-s invoked | Head-s blocked |
| --- | --- | --- | --- | --- |
| courtesy | 161.0 | 0.232 | 416 | 372 |
| yield fallback | 19.0 | 0.027 | 5 | 0 |
| conflict bypass | 0.0 | 0.000 | 7 | 7 |

Vehicles removed while held in a node by a full exit: 0 (0.0 per hour, included in the gridlock removals).

| Node | Streets | Control | Courtesy | Yield fallback | Conflict bypass | Held removals |
| --- | --- | --- | --- | --- | --- | --- |
| 1429 | Claremont Avenue / Claremont Boulevard | two_way_stop | 15 | 1 | 0 | 0 |
| 1152 | Ashby Avenue / Ashby Place / Elmwood Avenue | two_way_stop | 7 | 2 | 0 | 0 |
| 1425 | Ashby Avenue | uncontrolled | 9 | 0 | 0 | 0 |
| 30 | 57th Street / Adeline Street / Market Street | signal | 8 | 0 | 0 | 0 |
| 141 | 63rd Street / Lowell Street / Market Street | two_way_stop | 6 | 2 | 0 | 0 |
| 727 | 52nd Street | uncontrolled | 8 | 0 | 0 | 0 |
| 165 | Alcatraz Avenue / Baker Street | two_way_stop | 7 | 0 | 0 | 0 |
| 1220 | Ashby Avenue / College Avenue | signal | 7 | 0 | 0 | 0 |
| 1399 | Bridge Road / Tunnel Road | two_way_stop | 4 | 2 | 0 | 0 |
| 1405 | Claremont Boulevard / Russell Street | two_way_stop | 6 | 0 | 0 | 0 |

## Flow on key streets (veh/h per direction, study-area links of 40 m or more)

| Street | Direction of travel | Links | Median flow | Max flow |
| --- | --- | --- | --- | --- |
| Telegraph | N | 12 | 902 | 935 |
| Telegraph | S | 10 | 997 | 1030 |
| College | N | 3 | 323 | 324 |
| College | S | 3 | 392 | 392 |
| Claremont | N | 6 | 274 | 589 |
| Claremont | S | 7 | 400 | 776 |
| Alcatraz | E | 6 | 479 | 494 |
| Alcatraz | W | 6 | 450 | 478 |
| Hillegass | N | 4 | 84 | 84 |
| Hillegass | S | 4 | 77 | 79 |
| Colby | N | 7 | 113 | 121 |
| Colby | S | 7 | 139 | 175 |
| Martin | E | 2 | 94 | 94 |
| Martin | W | 2 | 101 | 101 |

## Largest demand origins (offered, before scale)

| Node | Streets | Veh/h |
| --- | --- | --- |
| 602 | Grove Shafter Freeway | 3677 |
| 265 | Ashby Avenue | 1242 |
| 943 | Telegraph Avenue / Ward Street | 1056 |
| 183 | San Pablo Avenue | 1042 |
| 1672 | Warren Freeway | 780 |
| 1719 | Grove Shafter Freeway | 627 |
| 971 | Pleasant Valley Avenue | 504 |
| 763 | Telegraph Avenue | 498 |
| 1756 | Claremont Avenue | 459 |
| 275 | Market Street | 435 |
