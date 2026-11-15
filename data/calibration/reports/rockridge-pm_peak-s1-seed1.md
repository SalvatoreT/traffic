# Calibration report: rockridge pm_peak scale 1 seed 1 (60 min)

Offered demand 25156 veh/h x scale 1 = 25156 veh/h. Run took 27.1 s wall clock. Flow tables use the window after a 10 min warm-up; select-link and health figures cover the whole run from an empty network.

## Stability (design D4)

| Criterion | Threshold | Value | Result |
| --- | --- | --- | --- |
| Gridlock removals | 0 | 0 | pass |
| Backlog / spawned | < 2% | 0.0% (3 of 25242) | pass |
| Arterial mean speed (run) | > 4 m/s | 9.32 m/s (last 15 min 9.33) | pass |

Overall: **STABLE**. Mean trip delay 122 s, mean trip time 410 s, completed 24571, unroutable 0.

| t (min) | vehicles in network | backlog | completed | removals | arterial speed in interval (m/s) |
| --- | --- | --- | --- | --- | --- |
| 5 | 3009 | 4 | 2050 | 0 | 9.21 |
| 10 | 3061 | 9 | 4096 | 0 | 9.10 |
| 15 | 3048 | 4 | 6183 | 0 | 9.28 |
| 20 | 2951 | 4 | 8319 | 0 | 9.62 |
| 25 | 3066 | 7 | 10338 | 0 | 9.40 |
| 30 | 3137 | 4 | 12348 | 0 | 9.40 |
| 35 | 3317 | 6 | 14316 | 0 | 9.12 |
| 40 | 3264 | 7 | 16402 | 0 | 9.22 |
| 45 | 3376 | 9 | 18448 | 0 | 9.51 |
| 50 | 3486 | 5 | 20410 | 0 | 9.14 |
| 55 | 3530 | 4 | 22493 | 0 | 9.53 |
| 60 | 3578 | 3 | 24571 | 0 | 9.32 |
## Wandering (completed car trips)

Detour ratio = distance driven (link and movement lengths) over the shortest network distance from the trip's origin to its destination. Detour against the free-flow route uses the time-shortest route with no congestion and no noise, which is what a purposeful driver without live information would follow (it differs from the shortest distance when a faster, longer road exists). A switch is a change of the remaining route while en route. Loops: the same link twice or the same node three or more times. Reversals: a link followed by its reverse within 200 m. 'Study-area vehicle-miles' are miles driven on links inside the study area; the last column is the share of them driven by trips with a detour ratio above 1.3. Guided drivers re-evaluate their route every epoch; the others keep their departure route unless it is blocked.

| Trips | n | Switches per trip | With a switch | Mean detour | Median detour | Detour > 1.3 | Detour > 2 | Mean detour vs free-flow route | Vs free-flow route > 1.3 | Loops | Reversals | Study veh-miles | Of them by detour > 1.3 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| all trips | 22472 | 0.01 | 0.6% | 1.083 | 1.046 | 4.0% | 0.0% | 1.023 | 1.1% | 0.0% | 5.1% | 2328 | 6.9% |
| gate to gate | 8209 | 0.01 | 0.8% | 1.082 | 1.048 | 2.7% | 0.0% | 1.018 | 0.8% | 0.0% | 7.7% | 567 | 7.6% |
| with a local end | 14263 | 0.01 | 0.5% | 1.084 | 1.045 | 4.7% | 0.0% | 1.026 | 1.3% | 0.0% | 3.6% | 1761 | 6.6% |
| guided drivers | 10252 | 0.01 | 1.3% | 1.083 | 1.047 | 3.9% | 0.0% | 1.023 | 1.1% | 0.0% | 5.4% | 1086 | 6.9% |
| other drivers | 12220 | 0.00 | 0.0% | 1.083 | 1.046 | 4.1% | 0.0% | 1.023 | 1.1% | 0.0% | 4.9% | 1242 | 6.9% |

## Reported patterns (diagnostics; configured in the targets file under `patterns`)

(a) Trips between the surface gates on the north side of the ramps and the freeway mainline gates, and the local-street (residential and service links in the study area) vehicle-miles they drive. Share = of all completed trips' local-street vehicle-miles (428 miles). No observed counterpart exists for this quantity (the targets file has only the select-link shares above).

| Trips | n trips | Local-street veh-miles | Share of all local-street veh-miles |
| --- | --- | --- | --- |
| surface gates to the freeway | 1779 | 41.4 | 10% |
| freeway to the surface gates | 959 | 35.7 | 8% |

(b) Corridor trips: completed trips from beyond one end of the corridor's study-area extent (the bypass street and its arterial together) to beyond the other end, within a lateral limit of the corridor, by direction. 'Bypass' = at least N blocks (links) on the bypass street; 'arterial' = fewer bypass blocks and at least N on the arterial; 'other' = neither (another street, the freeway or a short use); blocks are counted on the corridor's study-area links. No observed counterpart exists for these shares. The related observed values are in the select-link table above: northbound Hillegass Ave traffic rarely ends on College Ave (6%), 21 to 33% jogs to Benvenue Ave, and southbound freeway-bound drivers on College Ave commonly arrive via Ashby Ave and Benvenue Ave and jog to Hillegass Ave.

| Bypass | Arterial | N | Direction | Corridor trips | Bypass | Arterial | Other | Mean bypass blocks |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue | College Avenue | 3 | N | 1561 | 3% | 16% | 81% | 0.1 |
| Hillegass Avenue | College Avenue | 3 | S | 1467 | 6% | 26% | 68% | 0.3 |

## Per-mode results

Offered: 25156 car veh/h; 626 bicycle flows (764/h); 2000 pedestrian flows (1731/h). Bicycle and pedestrian volumes are assumptions, not counts.

| Mode | In network | Completed | Mean time (s) | Other |
| --- | --- | --- | --- | --- |
| Car | 3578 | 24571 | 410 | |
| Bicycle | 67 | 742 | 264 | |
| Pedestrian | 226 | 1653 | 405 | mean crossing delay 8.8 s |

Vulnerable road users (surrogate indicators): pedestrian conflicts 309, bicycle conflicts 466, close passes 517, pedestrian injury-risk index 0.049, bicycle injury-risk index 0.066 (proxy), mean vehicle speed at pedestrian encounters 2.47 m/s.


## Through cars on the counted blocks (a car is through when neither trip end is in the study area)

Observed through range = from the cars that drove the whole street (volunteer count, a lower bound) to the block volume less the cars whose trip ends along the street (an upper bound). Observed freeway-end trips = observed block volume times the observed freeway share of the street (the headline share of the targets file); these include freeway trips that end inside the study area, so they are not an expected through count. Modeled through = select-link trips with no end in the study area, per hour. Modeled freeway = select-link trips from or to a freeway node, per hour.

| Block | Observed volume (veh/h) | Observed freeway share | Observed freeway-end trips (veh/h) | Observed through range (veh/h) | Modeled through (veh/h) | In range | Modeled freeway trips (veh/h) |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue NB | 110 | 47.0% | 52 | 48 to 95 | 89 | yes | 122 |
| Colby Street NB | 174 | 47.0% | 82 | 102 to 145 | 124 | yes | 123 |
| Hillegass Avenue SB | 160 | 68.0% | 109 | 79 to 120 | 129 | above | 140 |
| Colby Street SB | 160 | 45.0% | 72 | 39 to 117 | 99 | yes | 97 |

## Intent map: through cars by where they come from and where they are going

Through = neither trip end is in the study area. Groups are the approach groups of the area config (data/areas); a node that is not a gate takes the group of the nearest surface gate (ASSUMPTION). The arterial is the one a trip would use on the shortest free-flow path with the study area's residential and service streets closed, where that path runs on a boundary street near the study area.

Model figures are the mean of 1 seed(s), per hour of the run. Basis: OBSERVED = read from the resident volunteer count of Feb 25, 2025 or its headline shares; ASSUMPTION = inferred from those numbers or chosen.

### Colby Street NB

Observed: block volume 174 veh/h, whole-street cars 102, so through cars 102 to 145 veh/h. Model: 124 through cars per hour.

Observed (PM): 182 cars entered at the south end, 102 drove the whole street, 164 left it at Alcatraz Ave (131 left, 32 right, 1 straight), and 47% of the block's trips came from a freeway (the headline share). ASSUMPTION: freeway-origin cars that do not end along the street are 65 veh/h (the 82 freeway-origin trips on the block, 47% of 174, times the 182 / (182 + 47) of its cars that entered at the south end rather than joining on the way), spread over the 164 exits in proportion (0.40); the other through cars come from the Telegraph Ave and south-side approaches that feed the street's south end. Ranges: low = 131 (32) x 0.47 x 0.62 (the whole-street share of exits), high = 131 (32) x 0.47.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | OBSERVED turn count x ASSUMPTION share (131 left turns x 0.40) | 52 (38 to 62) | 56 | within |
| Telegraph Ave and south-side traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | ASSUMPTION: the through left-turners (131 x 0.62 = 81) that are not off-ramp traffic | 29 (19 to 43) | 35 | within |
| SR-24 off-ramp traffic using Colby St to reach College Ave and Berkeley (right at Alcatraz Ave) | OBSERVED turn count x ASSUMPTION share (32 right turns x 0.40) | 13 (9 to 15) | 17 | above |
| Telegraph Ave and south-side traffic using Colby St to reach College Ave and Berkeley | ASSUMPTION: the through right-turners (32 x 0.62 = 20) that are not off-ramp traffic | 7 (5 to 11) | 15 | above |
| Intents listed, together | | 101 (71 to 131) | 123 | |
| Other through cars (no intent listed) | | | 1 | |

Model through cars by origin and destination group (largest 12 of 15 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 56.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 12.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Ashby Ave from the west (Emeryville and I-80) | 11.0 | none near the study area |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 10.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Shattuck Ave from the north (Berkeley) | 8.0 | Claremont Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Emeryville and West Oakland streets (55th to 67th Streets) | 7.0 | Claremont Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | College Ave from the north (Berkeley) | 4.0 | SR-24 then Claremont Avenue then College Avenue |
| Telegraph Ave to the south (downtown Oakland) | Telegraph Ave from the north (Berkeley) | 4.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 3.0 | SR-24 |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) | 2.0 | none near the study area |
| West Oakland to the southwest (Adeline St, Market St) | Claremont Ave and Tunnel Rd toward the hills | 2.0 | Alcatraz Avenue then Claremont Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Telegraph Ave from the north (Berkeley) | 2.0 | Telegraph Avenue |
| other pairs | | 3.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 85 veh/h; Claremont Avenue 15 veh/h; none near the study area 13 veh/h; SR-24 then Claremont Avenue then College Avenue 4 veh/h; Alcatraz Avenue then Claremont Avenue 3 veh/h; SR-24 3 veh/h.

### Hillegass Avenue NB

Observed: block volume 110 veh/h, whole-street cars 48, so through cars 48 to 95 veh/h. Model: 89 through cars per hour.

Observed (PM): 94 cars entered at the south end, 48 drove the whole street, 109 left it at Alcatraz Ave (43 west, 54 east, 12 straight), and 47% of the block's trips came from a freeway. ASSUMPTION: freeway-origin through cars are 40 veh/h (52 freeway-origin trips times 94 / (94 + 29)), spread over the exits in proportion (0.37); the through share of exits is 48 / 109 = 0.44.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Hillegass Ave to reach Alcatraz Ave west and Telegraph Ave north | OBSERVED turn count x ASSUMPTION share (43 left turns x 0.37) | 16 (9 to 20) | 20 | within |
| SR-24 off-ramp traffic using Hillegass Ave to reach College Ave and Berkeley | OBSERVED turn count x ASSUMPTION share (54 right turns x 0.37) | 20 (11 to 25) | 28 | above |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach Alcatraz Ave west | ASSUMPTION: through exits (43 x 0.44) that are not off-ramp traffic | 3 (0 to 10) | 9 | within |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach College Ave and Berkeley | ASSUMPTION: through exits (54 x 0.44) that are not off-ramp traffic | 4 (0 to 13) | 24 | above |
| Intents listed, together | | 43 (20 to 68) | 81 | |
| Other through cars (no intent listed) | | | 8 | |

Model through cars by origin and destination group (largest 12 of 22 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 16.0 | SR-24 |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 15.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 12.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 6.0 | SR-24 then Claremont Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | College Ave from the north (Berkeley) | 6.0 | SR-24 then Claremont Avenue then College Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Ashby Ave from the west (Emeryville and I-80) | 5.0 | College Avenue then Alcatraz Avenue |
| Telegraph Ave to the south (downtown Oakland) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 5.0 | Telegraph Avenue |
| SR-13 Warren Freeway (via SR-24 east) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 4.0 | Claremont Avenue then Alcatraz Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Telegraph Ave from the north (Berkeley) | 4.0 | none near the study area |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Shattuck Ave from the north (Berkeley) | 2.0 | Claremont Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Claremont Ave and Tunnel Rd toward the hills | 2.0 | Alcatraz Avenue then Claremont Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Alcatraz Ave from the west (Emeryville side) | 2.0 | SR-24 then Telegraph Avenue |
| other pairs | | 10.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 34 veh/h; SR-24 16 veh/h; College Avenue then Alcatraz Avenue 6 veh/h; SR-24 then Claremont Avenue 6 veh/h; SR-24 then Claremont Avenue then College Avenue 6 veh/h; none near the study area 6 veh/h.

### Hillegass Avenue SB

Observed: block volume 160 veh/h, whole-street cars 79, so through cars 79 to 120 veh/h. Model: 129 through cars per hour.

Observed (PM): 178 cars entered at the top (76 turned in from Alcatraz Ave west, 98 from the east, 4 came straight from the north), 79 drove the whole street, and 68% of the block's trips (109 veh/h) went to a freeway. ASSUMPTION: freeway-bound cars that did not join mid-street are 87 veh/h (109 x 178 / (178 + 44)), half of the 174 turn-ins; low = the whole-street share of the turn-ins (0.45), high = the freeway-bound share without the mid-street correction (0.63).

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Telegraph Ave, Alcatraz Ave west and West Berkeley traffic turning off Alcatraz Ave onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (76 turn-ins x 0.50) | 38 (34 to 48) | 41 | within |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (98 turn-ins x 0.50) | 49 (44 to 62) | 69 | above |
| Intents listed, together | | 87 (78 to 110) | 110 | |
| Other through cars (no intent listed) | | | 19 | |

Model through cars by origin and destination group (largest 12 of 14 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 41.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 34.0 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 23.0 | Claremont Avenue then SR-24 |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 9.0 | College Avenue then Claremont Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 6.0 | Telegraph Avenue |
| Ashby Ave from the west (Emeryville and I-80) | College Ave from the north (Berkeley) | 3.0 | Alcatraz Avenue then College Avenue |
| Berkeley hills to the northeast (Evergreen Ln, Gravatt Dr) | SR-24 westbound on-ramps (toward Oakland and I-980) | 3.0 | Claremont Avenue then SR-24 |
| Ashby Ave from the west (Emeryville and I-80) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 2.0 | Alcatraz Avenue then Claremont Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Oakland hills to the east (Broadway Terrace, Mountain Blvd, Moraga Ave) | 2.0 | Alcatraz Avenue then College Avenue |
| West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 2.0 | College Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 1.0 | Alcatraz Avenue then College Avenue |
| Claremont Ave and Tunnel Rd toward the hills | Telegraph Ave to the south (downtown Oakland) | 1.0 | Claremont Avenue |
| other pairs | | 2.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 82 veh/h; Claremont Avenue then SR-24 26 veh/h; College Avenue then Claremont Avenue then SR-24 9 veh/h; Alcatraz Avenue then College Avenue 6 veh/h; Alcatraz Avenue then Claremont Avenue 2 veh/h; College Avenue 2 veh/h.

### Colby Street SB

Observed: block volume 160 veh/h, whole-street cars 39, so through cars 39 to 117 veh/h. Model: 99 through cars per hour.

Observed (PM): 139 cars entered at the top (76 from Alcatraz Ave west, 50 from the east, 13 from the north), 39 drove the whole street, 45% of the block's trips (72 veh/h) went to a freeway and 22% came by way of Telegraph Ave. ASSUMPTION: freeway-bound cars that did not join mid-street are 46 veh/h (72 x 139 / (139 + 79)), 0.365 of the 126 turn-ins; low = the whole-street share (0.31), high = the unadjusted freeway share (0.57). The Telegraph Ave cars are the 22% x 160 = 35 of the 76 west turn-ins.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Southbound Telegraph Ave traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (35 Telegraph Ave cars x 0.365) | 13 (11 to 20) | 20 | within |
| Alcatraz Ave west, Ashby Ave and West Berkeley traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (41 other west turn-ins x 0.365) | 15 (13 to 23) | 12 | below |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (50 east turn-ins x 0.365) | 18 (15 to 29) | 35 | above |
| Intents listed, together | | 46 (39 to 72) | 67 | |
| Other through cars (no intent listed) | | | 32 | |

Model through cars by origin and destination group (largest 12 of 22 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 25.0 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 16.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 14.0 | Telegraph Avenue |
| Shattuck Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 9.0 | none near the study area |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 6.0 | Claremont Avenue then SR-24 |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 4.0 | College Avenue then Claremont Avenue then SR-24 |
| Telegraph Ave from the north (Berkeley) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 4.0 | none near the study area |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 3.0 | Alcatraz Avenue then College Avenue |
| West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 3.0 | College Avenue |
| Ashby Ave from the west (Emeryville and I-80) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 2.0 | SR-24 |
| Telegraph Ave from the north (Berkeley) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 2.0 | Telegraph Avenue |
| Alcatraz Ave from the west (Emeryville side) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 1.0 | SR-24 |
| other pairs | | 10.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 58 veh/h; none near the study area 14 veh/h; Claremont Avenue then SR-24 6 veh/h; Alcatraz Avenue then College Avenue 4 veh/h; College Avenue then Claremont Avenue then SR-24 4 veh/h; Alcatraz Avenue then Claremont Avenue 3 veh/h.

### Study area, all residential and service streets

Model: 634 through cars per hour.

Model through cars by origin and destination group (largest 12 of 58 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 83.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 71.0 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 68.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 40.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 35.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 32.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Emeryville and West Oakland streets (55th to 67th Streets) | 31.0 | Claremont Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 26.0 | Claremont Avenue then SR-24 |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Shattuck Ave from the north (Berkeley) | 19.0 | Claremont Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 19.0 | SR-24 |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Ashby Ave from the west (Emeryville and I-80) | 18.0 | College Avenue then Alcatraz Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 17.0 | Claremont Avenue then College Avenue |
| other pairs | | 175.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 364 veh/h; Claremont Avenue 62 veh/h; Claremont Avenue then SR-24 29 veh/h; none near the study area 29 veh/h; SR-24 24 veh/h; Alcatraz Avenue then Claremont Avenue 22 veh/h.

By origin group: SR-24 eastbound off-ramps (arriving from Oakland and I-980) 135; Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 130; South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 127; Telegraph Ave from the north (Berkeley) 82; Claremont Ave and Tunnel Rd toward the hills 29; West Oakland to the southwest (Adeline St, Market St) 28; Telegraph Ave to the south (downtown Oakland) 21; Ashby Ave from the west (Emeryville and I-80) 17; College Ave from the north (Berkeley) 14; Shattuck Ave from the north (Berkeley) 11.

By destination group: SR-24 westbound on-ramps (toward Oakland and I-980) 214; Telegraph Ave from the north (Berkeley) 99; Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 87; South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 71; Claremont Ave and Tunnel Rd toward the hills 40; Emeryville and West Oakland streets (55th to 67th Streets) 32; Ashby Ave from the west (Emeryville and I-80) 21; Shattuck Ave from the north (Berkeley) 21; College Ave from the north (Berkeley) 19; West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) 7.


## Through cars by intent (cut-through intent view)

A through car is tallied once, under the first intent whose origin and destination groups hold its trip ends, at the moment the through count counts it. Cars an hour over the run, the same window as the through-car figure (633 an hour).

| Intent | Basis | Cars an hour | Share |
| --- | --- | --- | --- |
| Berkeley and College Ave traffic using Hillegass Ave, Colby St and nearby side streets to reach the SR-24 on-ramps | observed | 107 | 17% |
| Southbound Telegraph Ave and west-side traffic turning off Alcatraz Ave onto Colby St or Hillegass Ave to reach the SR-24 on-ramps | observed | 74 | 12% |
| SR-24 off-ramp traffic using Colby St, Hillegass Ave and nearby side streets to reach Berkeley and Telegraph Ave north | observed | 124 | 20% |
| SR-24 off-ramp traffic using side streets to reach Alcatraz Ave west, Ashby Ave and Claremont Ave toward the hills | assumed | 23 | 4% |
| Downtown, south and west Oakland traffic using side streets to reach Berkeley and Telegraph Ave north | assumed | 87 | 14% |
| Berkeley and Telegraph Ave north traffic using side streets to reach downtown, south and west Oakland | assumed | 50 | 8% |
| Oakland cross-town traffic (West Oakland, Broadway, Piedmont, Emeryville) using side streets near Claremont Ave and Telegraph Ave | assumed | 78 | 12% |
| Claremont Ave, hills and south Oakland traffic using side streets to reach the SR-24 on-ramps | assumed | 41 | 6% |
| Other (no intent listed) |  | 49 | 8% |

Intents listed cover 92% of through cars.


## Select-link shares: modeled vs observed (design D5: headline = freeway shares, tolerance +/-10 pp)

- Hillegass Avenue NB: 4 links (path Claremont Avenue -> Alcatraz Avenue (434 m)), 210 trips (193 completed)
- Colby Street NB: 8 links (path Claremont Avenue -> Alcatraz Avenue (680 m)), 281 trips (259 completed)
- Hillegass Avenue SB: 4 links (path Alcatraz Avenue -> Claremont Avenue (433 m)), 205 trips (194 completed)
- Colby Street SB: 8 links (path Alcatraz Avenue -> Claremont Avenue (680 m)), 241 trips (226 completed)

| Block | Side | Via | Observed | Modeled | Diff (pp) | n trips | Headline |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue NB | from | freeway | 47% | 54% | +7 | 210 | within |
| Hillegass Avenue NB | to | Benvenue Avenue | 21% (PM 33%) | 2% | -31 | 210 |  |
| Hillegass Avenue NB | to | College Avenue | 6% | 15% | +9 | 210 |  |
| Hillegass Avenue NB | to | Alcatraz Avenue WB | 27% | 30% | +3 | 210 |  |
| Colby Street NB | from | freeway | 47% | 42% | -5 | 281 | within |
| Colby Street NB | to | Alcatraz Avenue WB | 48% | 53% | +5 | 281 |  |
| Colby Street NB | to | Telegraph Avenue | 25% | 34% | +9 | 281 |  |
| Colby Street NB | to | College Avenue | 3% | 7% | +4 | 281 |  |
| Hillegass Avenue SB | from | Alcatraz Avenue WB | 46% | 38% | -8 | 205 |  |
| Hillegass Avenue SB | from | Benvenue Avenue | 26% | 3% | -23 | 205 |  |
| Hillegass Avenue SB | from | College Avenue | 16% | 19% | +3 | 205 |  |
| Hillegass Avenue SB | to | freeway | 57% (PM 68%) | 68% | -0 | 205 | within |
| Colby Street SB | from | Alcatraz Avenue EB | 43% | 24% | -19 | 241 |  |
| Colby Street SB | from | Alcatraz Avenue WB | 46% | 15% | -31 | 241 |  |
| Colby Street SB | from | Telegraph Avenue | 22% | 22% | +0 | 241 |  |
| Colby Street SB | to | freeway | 45% | 40% | -5 | 241 | within |
| Colby Street SB | to | Forest Street | 34% | 19% | -15 | 241 |  |

Headline shares within tolerance: 4 of 4. Observed column uses the PM-peak share where one is given and the period is pm_peak. 'Via' shares are the fraction of select-link trips using that street before (from) or after (to) the block; freeway = origin / destination gate with a motorway-class link attached.

## Claremont ramps: streets used before the on-ramp / after the off-ramp

Observed shares are for traffic from/to the north only. 'Modeled' is over all trips on the ramps and any visit to the street (an upper bound for streets that serve both sides). 'Modeled, side' counts only trips whose surface end lies on the side of the ramp stated in the targets file (`freewayRamp.side`), and for a street with a qualifier ("north of X") only its links on that side of X.

| Direction | Via | Observed | Modeled | n ramp trips | Modeled, side | n side trips |
| --- | --- | --- | --- | --- | --- | --- |
| onto freeway | College Avenue | 16% | 16% | 812 | 17% | 736 |
| onto freeway | Hillegass Avenue | 12% | 16% | 812 | 18% | 736 |
| onto freeway | Martin Street | 10% | 11% | 812 | 12% | 736 |
| onto freeway | Colby Street | 8% | 10% | 812 | 11% | 736 |
| onto freeway | Telegraph Avenue north of Alcatraz Avenue | 8% | 16% | 812 | 13% | 736 |
| onto freeway | Benvenue Avenue | 5% | 4% | 812 | 4% | 736 |
| from freeway | College Avenue | 10% | 10% | 727 | 10% | 703 |
| from freeway | Martin Street | 10% | 13% | 727 | 13% | 703 |
| from freeway | Colby Street | 8% | 12% | 727 | 13% | 703 |
| from freeway | Hillegass Avenue | 5% | 7% | 727 | 8% | 703 |
| from freeway | Benvenue Avenue | 3% | 3% | 727 | 3% | 703 |

## Top 15 links by delay

| Link | Street | Class | Lanes | Len (m) | End node control | Delay (veh-h) | Stopped (veh-h) | Mean stopped veh | Flow (veh/h) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 4143 | Adeline Street | Secondary | 3 | 185 | signal | 21.14 | 17.21 | 17.2 | 522 |
| 1122 | Alcatraz Avenue | Tertiary | 1 | 299 | signal | 11.04 | 8.42 | 8.4 | 277 |
| 4397 | Ashby Avenue | Primary | 2 | 96 | signal | 8.35 | 5.66 | 5.7 | 911 |
| 1025 | Martin Luther King Junior Way | Secondary | 3 | 79 | signal | 7.92 | 6.41 | 6.4 | 740 |
| 769 | Martin Luther King Junior Way | Secondary | 3 | 112 | signal | 6.74 | 4.08 | 4.1 | 1580 |
| 1051 | Adeline Street | Secondary | 4 | 50 | signal | 6.69 | 5.58 | 5.6 | 996 |
| 3395 | Ashby Avenue | Primary | 1 | 129 | signal | 5.19 | 2.70 | 2.7 | 977 |
| 1037 | Sacramento Street | Tertiary | 3 | 40 | signal | 5.11 | 4.11 | 4.1 | 1303 |
| 1607 | Telegraph Avenue | Secondary | 2 | 94 | signal | 5.10 | 2.76 | 2.8 | 1325 |
| 115 | San Pablo Avenue | Primary | 3 | 54 | signal | 5.03 | 3.87 | 3.9 | 805 |
| 4329 | Claremont Avenue | Secondary | 2 | 113 | signal | 4.99 | 3.79 | 3.8 | 377 |
| 498 | Sacramento Street | Tertiary | 3 | 48 | signal | 4.97 | 4.06 | 4.1 | 726 |
| 3344 | Domingo Avenue | Residential | 1 | 110 | signal | 4.87 | 3.72 | 3.7 | 365 |
| 1108 | Market Street | Secondary | 4 | 36 | signal | 4.79 | 4.16 | 4.2 | 1142 |
| 1111 | Market Street | Tertiary | 3 | 31 | signal | 4.66 | 4.04 | 4.0 | 833 |

## Top 15 nodes by blocked time

Blocked time = lane-head seconds waiting at the stop line without permission (signal red, conflict, stop sign or no downstream space).

| Node | Streets | Control | Gate | Blocked (lane-h) | of which no downstream space | Signal plan at end (cycle: greens) |
| --- | --- | --- | --- | --- | --- | --- |
| 446 | Market Street / Stanford Avenue | signal |  | 5.55 | 0.11 | 75 s: 47/18 |
| 680 | 52nd Street / Shattuck Avenue | signal |  | 5.15 | 0.04 | 110 s: 30/28/38 |
| 447 | Adeline Street / Alcatraz Avenue | signal |  | 4.46 | 0.13 | 75 s: 25/40 |
| 1080 | 62nd Street / Claremont Avenue / College Avenue | signal |  | 3.71 | 0.03 | 75 s: 16/29/15 |
| 185 | Alcatraz Avenue / Sacramento Street | signal |  | 3.69 | 0.02 | 75 s: 37/28 |
| 37 | San Pablo Avenue / Stanford Avenue | signal |  | 3.43 | 0.00 | 75 s: 33/32 |
| 30 | 57th Street / Adeline Street / Market Street | signal |  | 3.31 | 0.02 | 75 s: 17/28/15 |
| 479 | Adeline Street / Martin Luther King Junior Way / Stanford Avenue | signal |  | 3.29 | 0.00 | 75 s: 16/49 |
| 713 | 51st Street / Telegraph Avenue | signal |  | 3.20 | 0.00 | 75 s: 37/28 |
| 947 | Ashby Avenue / Telegraph Avenue | signal |  | 2.98 | 0.00 | 75 s: 19/46 |
| 1069 | Claremont Avenue / Colby Street / Forest Street | signal |  | 2.97 | 0.00 | 79 s: 23/4/37 |
| 237 | Ashby Avenue / Sacramento Street | signal |  | 2.96 | 0.00 | 75 s: 45/20 |
| 1406 | Ashby Avenue / Claremont Avenue | signal |  | 2.90 | 0.02 | 85 s: 60/15 |
| 851 | Alcatraz Avenue / Telegraph Avenue | signal |  | 2.88 | 0.02 | 75 s: 47/18 |
| 242 | Ashby Avenue / Martin Luther King Junior Way | signal |  | 2.57 | 0.00 | 75 s: 48/17 |

Phases of the five most blocked signals (green s: approach links with their lanes, link ids in brackets):

- node 446: 47 s: Stanford Avenue 1L [941], Stanford Avenue 3L [1055]; 18 s: Market Street 4L [1108], Market Street 3L [1111]
- node 680: 30 s: 52nd Street 4L [1662]; 28 s: 52nd Street 4L [1666], 52nd Street 4L [1662]; 38 s: Shattuck Avenue 2L [1653], Shattuck Avenue 2L [1705]
- node 447: 25 s: Adeline Street 4L [1049], Adeline Street 4L [1051]; 40 s: Alcatraz Avenue 2L [1048], Alcatraz Avenue 2L [1133]
- node 1080: 16 s: Claremont Avenue 2L [2756], Claremont Avenue 2L [2798]; 29 s: College Avenue 2L [2761], College Avenue 2L [2819]; 15 s: 62nd Street 1L [2622]
- node 185: 37 s: Alcatraz Avenue 1L [363], Alcatraz Avenue 1L [1162]; 28 s: Sacramento Street 3L [1036], Sacramento Street 3L [1037]

## Entry backlog by origin node at end of run (top 10)

| Node | Streets | Trips waiting | Offered veh/h (before scale) |
| --- | --- | --- | --- |
| 602 | Grove Shafter Freeway | 1 | 4107 |
| 1080 | 62nd Street / Claremont Avenue / College Avenue | 1 | 198 |
| 1672 | Warren Freeway | 1 | 1237 |

## Flow on key streets (veh/h per direction, study-area links of 40 m or more)

| Street | Direction of travel | Links | Median flow | Max flow |
| --- | --- | --- | --- | --- |
| Telegraph | N | 12 | 1214 | 1265 |
| Telegraph | S | 10 | 740 | 776 |
| College | N | 3 | 427 | 431 |
| College | S | 3 | 661 | 666 |
| Claremont | N | 6 | 444 | 647 |
| Claremont | S | 7 | 348 | 845 |
| Alcatraz | E | 6 | 554 | 570 |
| Alcatraz | W | 6 | 331 | 344 |
| Hillegass | N | 4 | 106 | 112 |
| Hillegass | S | 4 | 154 | 158 |
| Colby | N | 7 | 154 | 180 |
| Colby | S | 7 | 142 | 161 |
| Martin | E | 2 | 125 | 125 |
| Martin | W | 2 | 122 | 122 |

## Largest demand origins (offered, before scale)

| Node | Streets | Veh/h |
| --- | --- | --- |
| 602 | Grove Shafter Freeway | 4107 |
| 1672 | Warren Freeway | 1237 |
| 265 | Ashby Avenue | 1134 |
| 183 | San Pablo Avenue | 1094 |
| 943 | Telegraph Avenue / Ward Street | 1085 |
| 974 | Broadway | 782 |
| 763 | Telegraph Avenue | 655 |
| 184 | Alcatraz Avenue | 524 |
| 276 | Martin Luther King Junior Way | 459 |
| 1719 | Grove Shafter Freeway | 445 |
