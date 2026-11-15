# Calibration report: rockridge am_peak scale 1 seed 1 (60 min)

Offered demand 22106 veh/h x scale 1 = 22106 veh/h. Run took 83.5 s wall clock. Flow tables use the window after a 10 min warm-up; select-link and health figures cover the whole run from an empty network.

## Stability (design D4)

| Criterion | Threshold | Value | Result |
| --- | --- | --- | --- |
| Gridlock removals | 0 | 0 | pass |
| Backlog / spawned | < 2% | 0.0% (8 of 22274) | pass |
| Arterial mean speed (run) | > 4 m/s | 9.03 m/s (last 15 min 9.24) | pass |

Overall: **STABLE**. Mean trip delay 135 s, mean trip time 393 s, completed 22501, unroutable 0.

| t (min) | vehicles in network | backlog | completed | removals | arterial speed in interval (m/s) |
| --- | --- | --- | --- | --- | --- |
| 5 | 2478 | 4 | 1984 | 0 | 9.32 |
| 10 | 2454 | 8 | 3815 | 0 | 9.10 |
| 15 | 2500 | 2 | 5657 | 0 | 9.02 |
| 20 | 2549 | 4 | 7518 | 0 | 8.71 |
| 25 | 2555 | 8 | 9411 | 0 | 9.07 |
| 30 | 2540 | 4 | 11279 | 0 | 8.68 |
| 35 | 2505 | 2 | 13163 | 0 | 8.85 |
| 40 | 2511 | 2 | 15032 | 0 | 8.99 |
| 45 | 2497 | 3 | 16863 | 0 | 8.91 |
| 50 | 2454 | 0 | 18727 | 0 | 8.90 |
| 55 | 2470 | 2 | 20593 | 0 | 9.43 |
| 60 | 2363 | 8 | 22501 | 0 | 9.38 |
## Wandering (completed car trips)

Detour ratio = distance driven (link and movement lengths) over the shortest network distance from the trip's origin to its destination. Detour against the free-flow route uses the time-shortest route with no congestion and no noise, which is what a purposeful driver without live information would follow (it differs from the shortest distance when a faster, longer road exists). A switch is a change of the remaining route while en route. Loops: the same link twice or the same node three or more times. Reversals: a link followed by its reverse within 200 m. 'Study-area vehicle-miles' are miles driven on links inside the study area; the last column is the share of them driven by trips with a detour ratio above 1.3. Guided drivers re-evaluate their route every epoch; the others keep their departure route unless it is blocked.

| Trips | n | Switches per trip | With a switch | Mean detour | Median detour | Detour > 1.3 | Detour > 2 | Mean detour vs free-flow route | Vs free-flow route > 1.3 | Loops | Reversals | Study veh-miles | Of them by detour > 1.3 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| all trips | 20666 | 0.01 | 1.4% | 1.089 | 1.055 | 4.3% | 0.0% | 1.025 | 1.4% | 0.0% | 5.7% | 1983 | 8.6% |
| gate to gate | 7432 | 0.03 | 2.6% | 1.090 | 1.065 | 2.6% | 0.0% | 1.022 | 1.0% | 0.0% | 8.2% | 348 | 8.7% |
| with a local end | 13234 | 0.01 | 0.7% | 1.089 | 1.052 | 5.3% | 0.0% | 1.027 | 1.7% | 0.0% | 4.3% | 1635 | 8.6% |
| guided drivers | 9486 | 0.03 | 3.0% | 1.090 | 1.055 | 4.5% | 0.0% | 1.026 | 1.7% | 0.0% | 5.9% | 906 | 8.3% |
| other drivers | 11180 | 0.00 | 0.0% | 1.088 | 1.054 | 4.2% | 0.0% | 1.024 | 1.2% | 0.0% | 5.5% | 1077 | 8.9% |

## Reported patterns (diagnostics; configured in the targets file under `patterns`)

(a) Trips between the surface gates on the north side of the ramps and the freeway mainline gates, and the local-street (residential and service links in the study area) vehicle-miles they drive. Share = of all completed trips' local-street vehicle-miles (387 miles). No observed counterpart exists for this quantity (the targets file has only the select-link shares above).

| Trips | n trips | Local-street veh-miles | Share of all local-street veh-miles |
| --- | --- | --- | --- |
| surface gates to the freeway | 1384 | 19.5 | 5% |
| freeway to the surface gates | 1106 | 26.2 | 7% |

(b) Corridor trips: completed trips from beyond one end of the corridor's study-area extent (the bypass street and its arterial together) to beyond the other end, within a lateral limit of the corridor, by direction. 'Bypass' = at least N blocks (links) on the bypass street; 'arterial' = fewer bypass blocks and at least N on the arterial; 'other' = neither (another street, the freeway or a short use); blocks are counted on the corridor's study-area links. No observed counterpart exists for these shares. The related observed values are in the select-link table above: northbound Hillegass Ave traffic rarely ends on College Ave (6%), 21 to 33% jogs to Benvenue Ave, and southbound freeway-bound drivers on College Ave commonly arrive via Ashby Ave and Benvenue Ave and jog to Hillegass Ave.

| Bypass | Arterial | N | Direction | Corridor trips | Bypass | Arterial | Other | Mean bypass blocks |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue | College Avenue | 3 | N | 1117 | 4% | 14% | 82% | 0.2 |
| Hillegass Avenue | College Avenue | 3 | S | 1286 | 3% | 25% | 72% | 0.1 |

## Per-mode results

Offered: 22106 car veh/h; 497 bicycle flows (702/h); 2000 pedestrian flows (1340/h). Bicycle and pedestrian volumes are assumptions, not counts.

| Mode | In network | Completed | Mean time (s) | Other |
| --- | --- | --- | --- | --- |
| Car | 2363 | 22501 | 393 | |
| Bicycle | 46 | 714 | 254 | |
| Pedestrian | 167 | 1205 | 470 | mean crossing delay 7.8 s |

Vulnerable road users (surrogate indicators): pedestrian conflicts 239, bicycle conflicts 938, close passes 834, pedestrian injury severity mean 0.045 (AIS4+, 7976 supported of 7976 encounters), cyclist injury severity mean 0.062 (MAIS3+F, 3501 supported of 6719 encounters) (separate endpoints, never summed), mean vehicle speed at pedestrian encounters 2.38 m/s.


## Through cars on the counted blocks (a car is through when neither trip end is in the study area)

Observed through range = from the cars that drove the whole street (volunteer count, a lower bound) to the block volume less the cars whose trip ends along the street (an upper bound). Observed freeway-end trips = observed block volume times the observed freeway share of the street (the headline share of the targets file); these include freeway trips that end inside the study area, so they are not an expected through count. Modeled through = select-link trips with no end in the study area, per hour. Modeled freeway = select-link trips from or to a freeway node, per hour.

| Block | Observed volume (veh/h) | Observed freeway share | Observed freeway-end trips (veh/h) | Observed through range (veh/h) | Modeled through (veh/h) | In range | Modeled freeway trips (veh/h) |
| --- | --- | --- | --- | --- | --- | --- | --- |

## Intent map: through cars by where they come from and where they are going

Through = neither trip end is in the study area. Groups are the approach groups of the area config (data/areas); a node that is not a gate takes the group of the nearest surface gate (ASSUMPTION). The arterial is the one a trip would use on the shortest free-flow path with the study area's residential and service streets closed, where that path runs on a boundary street near the study area.

Model figures are the mean of 1 seed(s), per hour of the run. Basis: OBSERVED = read from the resident volunteer count of Feb 25, 2025 or its headline shares; ASSUMPTION = inferred from those numbers or chosen.

### Colby Street NB

Observed (PM): 182 cars entered at the south end, 102 drove the whole street, 164 left it at Alcatraz Ave (131 left, 32 right, 1 straight), and 47% of the block's trips came from a freeway (the headline share). ASSUMPTION: freeway-origin cars that do not end along the street are 65 veh/h (the 82 freeway-origin trips on the block, 47% of 174, times the 182 / (182 + 47) of its cars that entered at the south end rather than joining on the way), spread over the 164 exits in proportion (0.40); the other through cars come from the Telegraph Ave and south-side approaches that feed the street's south end. Ranges: low = 131 (32) x 0.47 x 0.62 (the whole-street share of exits), high = 131 (32) x 0.47.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | OBSERVED turn count x ASSUMPTION share (131 left turns x 0.40) | 52 (38 to 62) | 42 | within |
| Telegraph Ave and south-side traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | ASSUMPTION: the through left-turners (131 x 0.62 = 81) that are not off-ramp traffic | 29 (19 to 43) | 23 | within |
| SR-24 off-ramp traffic using Colby St to reach College Ave and Berkeley (right at Alcatraz Ave) | OBSERVED turn count x ASSUMPTION share (32 right turns x 0.40) | 13 (9 to 15) | 1 | below |
| Telegraph Ave and south-side traffic using Colby St to reach College Ave and Berkeley | ASSUMPTION: the through right-turners (32 x 0.62 = 20) that are not off-ramp traffic | 7 (5 to 11) | 17 | above |
| Intents listed, together | | 101 (71 to 131) | 83 | |
| Other through cars (no intent listed) | | | 4 | |

Model through cars by origin and destination group (largest 12 of 14 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 42.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 17.0 | Claremont Avenue then College Avenue then Alcatraz Avenue |
| Telegraph Ave to the south (downtown Oakland) | Telegraph Ave from the north (Berkeley) | 12.0 | Telegraph Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Telegraph Ave from the north (Berkeley) | 4.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Ashby Ave from the west (Emeryville and I-80) | 2.0 | Claremont Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Shattuck Ave from the north (Berkeley) | 2.0 | College Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Ashby Ave from the west (Emeryville and I-80) | 1.0 | Claremont Avenue then Alcatraz Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | College Ave from the north (Berkeley) | 1.0 | Telegraph Avenue |
| San Pablo Ave (Emeryville and West Oakland) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 1.0 | Claremont Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) | 1.0 | none near the study area |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 1.0 | College Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Emeryville and West Oakland streets (55th to 67th Streets) | 1.0 | Claremont Avenue |
| other pairs | | 2.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 60 veh/h; Claremont Avenue then College Avenue then Alcatraz Avenue 17 veh/h; Claremont Avenue 4 veh/h; College Avenue 3 veh/h; Alcatraz Avenue then Claremont Avenue 1 veh/h; Claremont Avenue then Alcatraz Avenue 1 veh/h.

### Hillegass Avenue NB

Observed (PM): 94 cars entered at the south end, 48 drove the whole street, 109 left it at Alcatraz Ave (43 west, 54 east, 12 straight), and 47% of the block's trips came from a freeway. ASSUMPTION: freeway-origin through cars are 40 veh/h (52 freeway-origin trips times 94 / (94 + 29)), spread over the exits in proportion (0.37); the through share of exits is 48 / 109 = 0.44.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Hillegass Ave to reach Alcatraz Ave west and Telegraph Ave north | OBSERVED turn count x ASSUMPTION share (43 left turns x 0.37) | 16 (9 to 20) | 26 | above |
| SR-24 off-ramp traffic using Hillegass Ave to reach College Ave and Berkeley | OBSERVED turn count x ASSUMPTION share (54 right turns x 0.37) | 20 (11 to 25) | 30 | above |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach Alcatraz Ave west | ASSUMPTION: through exits (43 x 0.44) that are not off-ramp traffic | 3 (0 to 10) | 13 | above |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach College Ave and Berkeley | ASSUMPTION: through exits (54 x 0.44) that are not off-ramp traffic | 4 (0 to 13) | 9 | within |
| Intents listed, together | | 43 (20 to 68) | 78 | |
| Other through cars (no intent listed) | | | 3 | |

Model through cars by origin and destination group (largest 12 of 20 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 16.0 | SR-24 |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 12.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 7.0 | SR-24 then Claremont Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | College Ave from the north (Berkeley) | 7.0 | SR-24 then Claremont Avenue then College Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 6.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Shattuck Ave from the north (Berkeley) | 4.0 | College Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Shattuck Ave from the north (Berkeley) | 4.0 | SR-24 then Telegraph Avenue then Alcatraz Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Alcatraz Ave from the west (Emeryville side) | 3.0 | College Avenue then Alcatraz Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 3.0 | Telegraph Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Ashby Ave from the west (Emeryville and I-80) | 3.0 | SR-24 then Telegraph Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Telegraph Ave from the north (Berkeley) | 3.0 | none near the study area |
| West Oakland to the southwest (Adeline St, Market St) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 2.0 | Telegraph Avenue |
| other pairs | | 11.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 26 veh/h; SR-24 18 veh/h; SR-24 then Claremont Avenue 7 veh/h; SR-24 then Claremont Avenue then College Avenue 7 veh/h; SR-24 then Telegraph Avenue 5 veh/h; College Avenue 4 veh/h.

### Hillegass Avenue SB

Observed (PM): 178 cars entered at the top (76 turned in from Alcatraz Ave west, 98 from the east, 4 came straight from the north), 79 drove the whole street, and 68% of the block's trips (109 veh/h) went to a freeway. ASSUMPTION: freeway-bound cars that did not join mid-street are 87 veh/h (109 x 178 / (178 + 44)), half of the 174 turn-ins; low = the whole-street share of the turn-ins (0.45), high = the freeway-bound share without the mid-street correction (0.63).

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Telegraph Ave, Alcatraz Ave west and West Berkeley traffic turning off Alcatraz Ave onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (76 turn-ins x 0.50) | 38 (34 to 48) | 17 | below |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (98 turn-ins x 0.50) | 49 (44 to 62) | 31 | below |
| Intents listed, together | | 87 (78 to 110) | 48 | |
| Other through cars (no intent listed) | | | 25 | |

Model through cars by origin and destination group (largest 12 of 11 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 21.0 | Claremont Avenue then SR-24 |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 17.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 12.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Telegraph Ave to the south (downtown Oakland) | 7.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 6.0 | Claremont Avenue then SR-24 |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 4.0 | College Avenue then Claremont Avenue then SR-24 |
| Telegraph Ave from the north (Berkeley) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 2.0 | Telegraph Avenue |
| Alcatraz Ave from the west (Emeryville side) | Berkeley hills to the northeast (Evergreen Ln, Gravatt Dr) | 1.0 | Alcatraz Avenue then Claremont Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | West Oakland to the southwest (Adeline St, Market St) | 1.0 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | Emeryville and West Oakland streets (55th to 67th Streets) | 1.0 | Claremont Avenue then Alcatraz Avenue |
| College Ave from the north (Berkeley) | Telegraph Ave to the south (downtown Oakland) | 1.0 | College Avenue then Claremont Avenue |

By the arterial these cars would otherwise use: Telegraph Avenue 39 veh/h; Claremont Avenue then SR-24 27 veh/h; College Avenue then Claremont Avenue then SR-24 4 veh/h; Alcatraz Avenue then Claremont Avenue 1 veh/h; Claremont Avenue then Alcatraz Avenue 1 veh/h; College Avenue then Claremont Avenue 1 veh/h.

### Colby Street SB

Observed (PM): 139 cars entered at the top (76 from Alcatraz Ave west, 50 from the east, 13 from the north), 39 drove the whole street, 45% of the block's trips (72 veh/h) went to a freeway and 22% came by way of Telegraph Ave. ASSUMPTION: freeway-bound cars that did not join mid-street are 46 veh/h (72 x 139 / (139 + 79)), 0.365 of the 126 turn-ins; low = the whole-street share (0.31), high = the unadjusted freeway share (0.57). The Telegraph Ave cars are the 22% x 160 = 35 of the 76 west turn-ins.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Southbound Telegraph Ave traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (35 Telegraph Ave cars x 0.365) | 13 (11 to 20) | 10 | below |
| Alcatraz Ave west, Ashby Ave and West Berkeley traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (41 other west turn-ins x 0.365) | 15 (13 to 23) | 13 | within |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (50 east turn-ins x 0.365) | 18 (15 to 29) | 23 | within |
| Intents listed, together | | 46 (39 to 72) | 46 | |
| Other through cars (no intent listed) | | | 57 | |

Model through cars by origin and destination group (largest 12 of 20 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 24.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 21.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | West Oakland to the southwest (Adeline St, Market St) | 10.0 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 9.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Telegraph Ave to the south (downtown Oakland) | 7.0 | Telegraph Avenue |
| Shattuck Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 7.0 | none near the study area |
| Telegraph Ave from the north (Berkeley) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 5.0 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | Emeryville and West Oakland streets (55th to 67th Streets) | 3.0 | Claremont Avenue then Alcatraz Avenue |
| Ashby Ave from the west (Emeryville and I-80) | SR-13 Warren Freeway (via SR-24 east) | 2.0 | SR-24 |
| Ashby Ave from the west (Emeryville and I-80) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 2.0 | SR-24 |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 2.0 | Claremont Avenue then SR-24 |
| College Ave from the north (Berkeley) | Telegraph Ave to the south (downtown Oakland) | 2.0 | Alcatraz Avenue then Telegraph Avenue |
| other pairs | | 9.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 76 veh/h; none near the study area 9 veh/h; SR-24 8 veh/h; Claremont Avenue then Alcatraz Avenue 3 veh/h; Alcatraz Avenue then Telegraph Avenue 2 veh/h; Claremont Avenue then SR-24 2 veh/h.

### Study area, all residential and service streets

Model: 514 through cars per hour.

Model through cars by origin and destination group (largest 12 of 69 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 59.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 55.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 47.0 | Telegraph Avenue |
| Telegraph Ave to the south (downtown Oakland) | SR-24 westbound on-ramps (toward Oakland and I-980) | 27.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 26.0 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 25.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 24.0 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 21.0 | Claremont Avenue then SR-24 |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 16.0 | SR-24 |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Shattuck Ave from the north (Berkeley) | 15.0 | Claremont Avenue |
| Telegraph Ave from the north (Berkeley) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 14.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Telegraph Ave to the south (downtown Oakland) | 13.0 | Telegraph Avenue |
| other pairs | | 172.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 326 veh/h; Claremont Avenue 36 veh/h; SR-24 32 veh/h; Claremont Avenue then SR-24 21 veh/h; none near the study area 21 veh/h; Telegraph Avenue then Claremont Avenue 15 veh/h.

By origin group: Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 143; SR-24 eastbound off-ramps (arriving from Oakland and I-980) 102; South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 70; Telegraph Ave to the south (downtown Oakland) 49; Telegraph Ave from the north (Berkeley) 40; Claremont Ave and Tunnel Rd toward the hills 28; West Oakland to the southwest (Adeline St, Market St) 23; SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) 14; College Ave from the north (Berkeley) 11; Shattuck Ave from the north (Berkeley) 8.

By destination group: SR-24 westbound on-ramps (toward Oakland and I-980) 132; South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 95; Telegraph Ave from the north (Berkeley) 81; Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 56; Claremont Ave and Tunnel Rd toward the hills 24; Shattuck Ave from the north (Berkeley) 19; Telegraph Ave to the south (downtown Oakland) 18; Emeryville and West Oakland streets (55th to 67th Streets) 18; College Ave from the north (Berkeley) 16; West Oakland to the southwest (Adeline St, Market St) 12.


## Through cars by intent (cut-through intent view)

A through car is tallied once, under the first intent that fits it (the on-ramp on its planned route, the off-ramp it has driven, or the origin and destination groups of its trip), at the moment the through count counts it. Cars an hour over the run, the same window as the through-car figure (515 an hour).

| Intent | Basis | Cars an hour | Share |
| --- | --- | --- | --- |
| on-2853241697 | observed | 134 | 26% |
| Other on-ramps | assumed | 13 | 3% |
| off-52990846 | observed | 101 | 20% |
| Other off-ramps | assumed | 20 | 4% |
| Downtown, south and west Oakland traffic using side streets to reach Berkeley and Telegraph Ave north | assumed | 73 | 14% |
| Berkeley and Telegraph Ave north traffic using side streets to reach downtown, south and west Oakland | assumed | 102 | 20% |
| Oakland cross-town traffic (West Oakland, Broadway, Piedmont, Emeryville) using side streets near Claremont Ave and Telegraph Ave | assumed | 40 | 8% |
| Other (no intent listed) |  | 32 | 6% |

Intents listed cover 94% of through cars.


## Select-link shares: modeled vs observed (design D5: headline = freeway shares, tolerance +/-10 pp)

- Hillegass Avenue NB: 4 links (path Claremont Avenue -> Alcatraz Avenue (434 m)), 197 trips (188 completed)
- Colby Street NB: 8 links (path Claremont Avenue -> Alcatraz Avenue (680 m)), 220 trips (208 completed)
- Hillegass Avenue SB: 4 links (path Alcatraz Avenue -> Claremont Avenue (433 m)), 125 trips (120 completed)
- Colby Street SB: 8 links (path Alcatraz Avenue -> Claremont Avenue (680 m)), 283 trips (262 completed)

| Block | Side | Via | Observed | Modeled | Diff (pp) | n trips | Headline |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue NB | from | freeway | 47% | 53% | +6 | 197 | within |
| Hillegass Avenue NB | to | Benvenue Avenue | 21% (PM 33%) | 9% | -12 | 197 |  |
| Hillegass Avenue NB | to | College Avenue | 6% | 15% | +9 | 197 |  |
| Hillegass Avenue NB | to | Alcatraz Avenue WB | 27% | 35% | +8 | 197 |  |
| Colby Street NB | from | freeway | 47% | 49% | +2 | 220 | within |
| Colby Street NB | to | Alcatraz Avenue WB | 48% | 47% | -1 | 220 |  |
| Colby Street NB | to | Telegraph Avenue | 25% | 43% | +18 | 220 |  |
| Colby Street NB | to | College Avenue | 3% | 5% | +2 | 220 |  |
| Hillegass Avenue SB | from | Alcatraz Avenue WB | 46% | 29% | -17 | 125 |  |
| Hillegass Avenue SB | from | Benvenue Avenue | 26% | 1% | -25 | 125 |  |
| Hillegass Avenue SB | from | College Avenue | 16% | 10% | -6 | 125 |  |
| Hillegass Avenue SB | to | freeway | 57% (PM 68%) | 69% | +12 | 125 | OUTSIDE |
| Colby Street SB | from | Alcatraz Avenue EB | 43% | 14% | -29 | 283 |  |
| Colby Street SB | from | Alcatraz Avenue WB | 46% | 11% | -35 | 283 |  |
| Colby Street SB | from | Telegraph Avenue | 22% | 15% | -7 | 283 |  |
| Colby Street SB | to | freeway | 45% | 48% | +3 | 283 | within |
| Colby Street SB | to | Forest Street | 34% | 10% | -24 | 283 |  |

Headline shares within tolerance: 3 of 4. Observed column uses the PM-peak share where one is given and the period is pm_peak. 'Via' shares are the fraction of select-link trips using that street before (from) or after (to) the block; freeway = origin / destination gate with a motorway-class link attached.

## Claremont ramps: streets used before the on-ramp / after the off-ramp

Observed shares are for traffic from/to the north only. 'Modeled' is over all trips on the ramps and any visit to the street (an upper bound for streets that serve both sides). 'Modeled, side' counts only trips whose surface end lies on the side of the ramp stated in the targets file (`freewayRamp.side`), and for a street with a qualifier ("north of X") only its links on that side of X.

| Direction | Via | Observed | Modeled | n ramp trips | Modeled, side | n side trips |
| --- | --- | --- | --- | --- | --- | --- |
| onto freeway | College Avenue | 16% | 16% | 637 | 18% | 552 |
| onto freeway | Hillegass Avenue | 12% | 12% | 637 | 14% | 552 |
| onto freeway | Martin Street | 10% | 15% | 637 | 14% | 552 |
| onto freeway | Colby Street | 8% | 13% | 637 | 15% | 552 |
| onto freeway | Telegraph Avenue north of Alcatraz Avenue | 8% | 13% | 637 | 8% | 552 |
| onto freeway | Benvenue Avenue | 5% | 3% | 637 | 3% | 552 |
| from freeway | College Avenue | 10% | 13% | 646 | 13% | 630 |
| from freeway | Martin Street | 10% | 14% | 646 | 14% | 630 |
| from freeway | Colby Street | 8% | 12% | 646 | 13% | 630 |
| from freeway | Hillegass Avenue | 5% | 7% | 646 | 7% | 630 |
| from freeway | Benvenue Avenue | 3% | 4% | 646 | 4% | 630 |

## Top 15 links by delay

| Link | Street | Class | Lanes | Len (m) | End node control | Delay (veh-h) | Stopped (veh-h) | Mean stopped veh | Flow (veh/h) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1051 | Adeline Street | Secondary | 4 | 50 | signal | 8.33 | 7.20 | 7.2 | 1156 |
| 265 | 59th Street | Residential | 1 | 150 | two_way_stop | 7.05 | 5.68 | 5.7 | 139 |
| 460 | Sacramento Street | Tertiary | 2 | 104 | two_way_stop | 6.75 | 5.54 | 5.5 | 468 |
| 115 | San Pablo Avenue | Primary | 3 | 54 | signal | 6.59 | 5.17 | 5.2 | 922 |
| 1037 | Sacramento Street | Tertiary | 3 | 40 | signal | 6.36 | 5.31 | 5.3 | 1054 |
| 769 | Martin Luther King Junior Way | Secondary | 3 | 112 | signal | 5.97 | 3.87 | 3.9 | 1354 |
| 108 | Stanford Avenue | Secondary | 3 | 61 | signal | 5.80 | 4.08 | 4.1 | 1258 |
| 4143 | Adeline Street | Secondary | 3 | 185 | signal | 5.77 | 2.71 | 2.7 | 1368 |
| 4175 | (unnamed) | Motorway | 2 | 142 | uncontrolled | 5.53 | 1.06 | 1.1 | 1484 |
| 1025 | Martin Luther King Junior Way | Secondary | 3 | 79 | signal | 5.50 | 4.17 | 4.2 | 803 |
| 1049 | Adeline Street | Secondary | 4 | 43 | signal | 5.37 | 4.41 | 4.4 | 911 |
| 1630 | Telegraph Avenue | Secondary | 3 | 36 | signal | 5.11 | 4.46 | 4.5 | 552 |
| 1036 | Sacramento Street | Tertiary | 3 | 43 | signal | 5.10 | 4.15 | 4.2 | 935 |
| 315 | Stanford Avenue | Secondary | 2 | 354 | uncontrolled | 5.09 | 2.59 | 2.6 | 1258 |
| 2037 | Alcatraz Avenue | Tertiary | 1 | 202 | uncontrolled | 5.09 | 3.83 | 3.8 | 391 |

## Top 15 nodes by blocked time

Blocked time = lane-head seconds waiting at the stop line without permission (signal red, conflict, stop sign or no downstream space).

| Node | Streets | Control | Gate | Blocked (lane-h) | of which no downstream space | Signal plan at end (cycle: greens) |
| --- | --- | --- | --- | --- | --- | --- |
| 447 | Adeline Street / Alcatraz Avenue | signal |  | 4.93 | 0.13 | 75 s: 26/39 |
| 446 | Market Street / Stanford Avenue | signal |  | 4.70 | 0.20 | 75 s: 36/29 |
| 680 | 52nd Street / Shattuck Avenue | signal |  | 4.43 | 0.09 | 90 s: 18/19/37 |
| 30 | 57th Street / Adeline Street / Market Street | signal |  | 3.64 | 0.04 | 75 s: 24/21/15 |
| 185 | Alcatraz Avenue / Sacramento Street | signal |  | 3.43 | 0.07 | 75 s: 34/31 |
| 37 | San Pablo Avenue / Stanford Avenue | signal |  | 3.24 | 0.04 | 75 s: 25/40 |
| 479 | Adeline Street / Martin Luther King Junior Way / Stanford Avenue | signal |  | 3.12 | 0.02 | 75 s: 43/22 |
| 944 | Ashby Avenue / Shattuck Avenue | signal |  | 2.81 | 0.02 | 75 s: 46/19 |
| 613 | 52nd Street / Claremont Avenue / Telegraph Avenue | signal |  | 2.66 | 0.08 | 75 s: 46/19 |
| 713 | 51st Street / Telegraph Avenue | signal |  | 2.56 | 0.01 | 75 s: 38/27 |
| 851 | Alcatraz Avenue / Telegraph Avenue | signal |  | 2.54 | 0.03 | 75 s: 42/23 |
| 947 | Ashby Avenue / Telegraph Avenue | signal |  | 2.54 | 0.00 | 75 s: 26/39 |
| 331 | 52nd Street / Martin Luther King Junior Way | signal |  | 2.47 | 0.02 | 75 s: 41/24 |
| 1080 | 62nd Street / Claremont Avenue / College Avenue | signal |  | 2.44 | 0.02 | 75 s: 19/26/15 |
| 242 | Ashby Avenue / Martin Luther King Junior Way | signal |  | 2.41 | 0.00 | 75 s: 38/27 |

Phases of the five most blocked signals (green s: approach links with their lanes, link ids in brackets):

- node 447: 26 s: Adeline Street 4L [1049], Adeline Street 4L [1051]; 39 s: Alcatraz Avenue 2L [1048], Alcatraz Avenue 2L [1133]
- node 446: 36 s: Stanford Avenue 3L [941], Stanford Avenue 3L [1055]; 29 s: Market Street 4L [1108], Market Street 3L [1111]
- node 680: 18 s: 52nd Street 4L [1662]; 19 s: 52nd Street 4L [1666], 52nd Street 4L [1662]; 37 s: Shattuck Avenue 2L [1653], Shattuck Avenue 2L [1705]
- node 30: 24 s: Adeline Street 1L [747], Adeline Street 1L [1030]; 21 s: Market Street 2L [755], Market Street 2L [1113]; 15 s: 57th Street 1L [44], 57th Street 1L [1151]
- node 185: 34 s: Alcatraz Avenue 1L [363], Alcatraz Avenue 1L [1162]; 31 s: Sacramento Street 3L [1036], Sacramento Street 3L [1037]

## Junction recovery

Policy `physical`. Node entries by cars and cyclists in the run: 718271 (settle interval 0). An admission is an entry the ordinary rule would have refused; head-seconds count the time a waiting head vehicle had the reason invoked, and the part of it in which it still could not enter. Courtesy and the yield fallback change priority only; under `physical` the conflict bypass never admits.

| Reason | Admissions per hour | Per 1,000 entries | Head-s invoked | Head-s blocked |
| --- | --- | --- | --- | --- |
| courtesy | 175.0 | 0.244 | 574 | 520 |
| yield fallback | 69.0 | 0.096 | 20 | 0 |
| conflict bypass | 0.0 | 0.000 | 8 | 8 |

Vehicles removed while held in a node by a full exit: 0 (0.0 per hour, included in the gridlock removals).

| Node | Streets | Control | Courtesy | Yield fallback | Conflict bypass | Held removals |
| --- | --- | --- | --- | --- | --- | --- |
| 30 | 57th Street / Adeline Street / Market Street | signal | 14 | 0 | 0 | 0 |
| 165 | Alcatraz Avenue / Baker Street | two_way_stop | 9 | 4 | 0 | 0 |
| 1152 | Ashby Avenue / Ashby Place / Elmwood Avenue | two_way_stop | 8 | 4 | 0 | 0 |
| 1220 | Ashby Avenue / College Avenue | signal | 12 | 0 | 0 | 0 |
| 1429 | Claremont Avenue / Claremont Boulevard | two_way_stop | 9 | 1 | 0 | 0 |
| 147 | 59th Street / Grace Avenue / Los Angeles Street | two_way_stop | 7 | 2 | 0 | 0 |
| 127 | 59th Street / Idaho Street | two_way_stop | 7 | 1 | 0 | 0 |
| 457 | Alcatraz Avenue / California Street | two_way_stop | 2 | 6 | 0 | 0 |
| 338 | 55th Street / Shattuck Avenue | signal | 7 | 0 | 0 | 0 |
| 342 | 56th Street / Shattuck Avenue | two_way_stop | 1 | 6 | 0 | 0 |

## Entry backlog by origin node at end of run (top 10)

| Node | Streets | Trips waiting | Offered veh/h (before scale) |
| --- | --- | --- | --- |
| 265 | Ashby Avenue | 2 | 1242 |
| 125 | Alcatraz Avenue / Idaho Street | 1 | 26 |
| 342 | 56th Street / Shattuck Avenue | 1 | 4 |
| 395 | 65th Street / Shattuck Avenue | 1 | 11 |
| 847 | Fairview Street / Shattuck Avenue | 1 | 5 |
| 1192 | Lewiston Avenue | 1 | 148 |
| 1381 | Alvarado Road / Vicente Road | 1 | 35 |

## Flow on key streets (veh/h per direction, study-area links of 40 m or more)

| Street | Direction of travel | Links | Median flow | Max flow |
| --- | --- | --- | --- | --- |
| Telegraph | N | 12 | 704 | 786 |
| Telegraph | S | 10 | 694 | 744 |
| College | N | 3 | 236 | 238 |
| College | S | 3 | 430 | 430 |
| Claremont | N | 6 | 401 | 672 |
| Claremont | S | 7 | 409 | 838 |
| Alcatraz | E | 6 | 410 | 461 |
| Alcatraz | W | 6 | 360 | 391 |
| Hillegass | N | 4 | 103 | 134 |
| Hillegass | S | 4 | 80 | 85 |
| Colby | N | 7 | 127 | 137 |
| Colby | S | 7 | 152 | 193 |
| Martin | E | 2 | 136 | 136 |
| Martin | W | 2 | 113 | 113 |

## Largest demand origins (offered, before scale)

| Node | Streets | Veh/h |
| --- | --- | --- |
| 602 | Grove Shafter Freeway | 3623 |
| 943 | Telegraph Avenue / Ward Street | 1364 |
| 265 | Ashby Avenue | 1242 |
| 183 | San Pablo Avenue | 1185 |
| 1672 | Warren Freeway | 999 |
| 763 | Telegraph Avenue | 496 |
| 974 | Broadway | 481 |
| 184 | Alcatraz Avenue | 449 |
| 1756 | Claremont Avenue | 416 |
| 275 | Market Street | 416 |
