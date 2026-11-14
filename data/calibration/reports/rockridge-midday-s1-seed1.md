# Calibration report: rockridge midday scale 1 seed 1 (60 min)

Offered demand 15813 veh/h x scale 1 = 15813 veh/h. Run took 16.1 s wall clock. Flow tables use the window after a 10 min warm-up; select-link and health figures cover the whole run from an empty network.

## Stability (design D4)

| Criterion | Threshold | Value | Result |
| --- | --- | --- | --- |
| Gridlock removals | 0 | 0 | pass |
| Backlog / spawned | < 2% | 0.0% (1 of 15889) | pass |
| Arterial mean speed (run) | > 4 m/s | 10.04 m/s (last 15 min 10.02) | pass |

Overall: **STABLE**. Mean trip delay 72 s, mean trip time 365 s, completed 15983, unroutable 0.

| t (min) | vehicles in network | backlog | completed | removals | arterial speed in interval (m/s) |
| --- | --- | --- | --- | --- | --- |
| 5 | 1701 | 0 | 1356 | 0 | 10.06 |
| 10 | 1598 | 0 | 2745 | 0 | 10.02 |
| 15 | 1605 | 1 | 4048 | 0 | 10.18 |
| 20 | 1596 | 2 | 5340 | 0 | 10.03 |
| 25 | 1667 | 1 | 6614 | 0 | 9.96 |
| 30 | 1698 | 3 | 7946 | 0 | 9.94 |
| 35 | 1717 | 0 | 9290 | 0 | 10.15 |
| 40 | 1666 | 0 | 10652 | 0 | 10.08 |
| 45 | 1641 | 0 | 11970 | 0 | 10.00 |
| 50 | 1692 | 0 | 13270 | 0 | 9.95 |
| 55 | 1689 | 1 | 14605 | 0 | 10.04 |
| 60 | 1648 | 1 | 15983 | 0 | 10.07 |
## Wandering (completed car trips)

Detour ratio = distance driven (link and movement lengths) over the shortest network distance from the trip's origin to its destination. Detour against the free-flow route uses the time-shortest route with no congestion and no noise, which is what a purposeful driver without live information would follow (it differs from the shortest distance when a faster, longer road exists). A switch is a change of the remaining route while en route. Loops: the same link twice or the same node three or more times. Reversals: a link followed by its reverse within 200 m. 'Study-area vehicle-miles' are miles driven on links inside the study area; the last column is the share of them driven by trips with a detour ratio above 1.3. Guided drivers re-evaluate their route every epoch; the others keep their departure route unless it is blocked.

| Trips | n | Switches per trip | With a switch | Mean detour | Median detour | Detour > 1.3 | Detour > 2 | Mean detour vs free-flow route | Vs free-flow route > 1.3 | Loops | Reversals | Study veh-miles | Of them by detour > 1.3 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| all trips | 14760 | 0.00 | 0.1% | 1.092 | 1.059 | 4.7% | 0.0% | 1.029 | 1.8% | 0.0% | 5.4% | 1402 | 7.7% |
| gate to gate | 5948 | 0.00 | 0.1% | 1.094 | 1.070 | 3.6% | 0.1% | 1.028 | 2.1% | 0.0% | 8.0% | 405 | 6.9% |
| with a local end | 8812 | 0.00 | 0.0% | 1.091 | 1.054 | 5.4% | 0.0% | 1.030 | 1.7% | 0.0% | 3.7% | 997 | 8.0% |
| guided drivers | 6720 | 0.00 | 0.1% | 1.092 | 1.059 | 4.7% | 0.0% | 1.029 | 1.9% | 0.0% | 5.2% | 630 | 8.1% |
| other drivers | 8040 | 0.00 | 0.0% | 1.092 | 1.059 | 4.6% | 0.0% | 1.029 | 1.8% | 0.0% | 5.6% | 773 | 7.3% |

## Reported patterns (diagnostics; configured in the targets file under `patterns`)

(a) Trips between the surface gates on the north side of the ramps and the freeway mainline gates, and the local-street (residential and service links in the study area) vehicle-miles they drive. Share = of all completed trips' local-street vehicle-miles (261 miles). No observed counterpart exists for this quantity (the targets file has only the select-link shares above).

| Trips | n trips | Local-street veh-miles | Share of all local-street veh-miles |
| --- | --- | --- | --- |
| surface gates to the freeway | 1109 | 29.9 | 11% |
| freeway to the surface gates | 822 | 20.6 | 8% |

(b) Corridor trips: completed trips from beyond one end of the corridor's study-area extent (the bypass street and its arterial together) to beyond the other end, within a lateral limit of the corridor, by direction. 'Bypass' = at least N blocks (links) on the bypass street; 'arterial' = fewer bypass blocks and at least N on the arterial; 'other' = neither (another street, the freeway or a short use); blocks are counted on the corridor's study-area links. No observed counterpart exists for these shares. The related observed values are in the select-link table above: northbound Hillegass Ave traffic rarely ends on College Ave (6%), 21 to 33% jogs to Benvenue Ave, and southbound freeway-bound drivers on College Ave commonly arrive via Ashby Ave and Benvenue Ave and jog to Hillegass Ave.

| Bypass | Arterial | N | Direction | Corridor trips | Bypass | Arterial | Other | Mean bypass blocks |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue | College Avenue | 3 | N | 971 | 3% | 16% | 81% | 0.1 |
| Hillegass Avenue | College Avenue | 3 | S | 1000 | 5% | 21% | 74% | 0.2 |

## Per-mode results

Offered: 15813 car veh/h; 105 bicycle flows (386/h); 2000 pedestrian flows (1582/h). Bicycle and pedestrian volumes are assumptions, not counts.

| Mode | In network | Completed | Mean time (s) | Other |
| --- | --- | --- | --- | --- |
| Car | 1648 | 15983 | 365 | |
| Bicycle | 25 | 416 | 166 | |
| Pedestrian | 180 | 1496 | 444 | mean crossing delay 7.1 s |

Vulnerable road users (surrogate indicators): pedestrian conflicts 220, bicycle conflicts 163, close passes 195, pedestrian injury-risk index 0.050, bicycle injury-risk index 0.068 (proxy), mean vehicle speed at pedestrian encounters 2.51 m/s.


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
| SR-24 off-ramp traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | OBSERVED turn count x ASSUMPTION share (131 left turns x 0.40) | 52 (38 to 62) | 31 | below |
| Telegraph Ave and south-side traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | ASSUMPTION: the through left-turners (131 x 0.62 = 81) that are not off-ramp traffic | 29 (19 to 43) | 31 | within |
| SR-24 off-ramp traffic using Colby St to reach College Ave and Berkeley (right at Alcatraz Ave) | OBSERVED turn count x ASSUMPTION share (32 right turns x 0.40) | 13 (9 to 15) | 7 | below |
| Telegraph Ave and south-side traffic using Colby St to reach College Ave and Berkeley | ASSUMPTION: the through right-turners (32 x 0.62 = 20) that are not off-ramp traffic | 7 (5 to 11) | 6 | within |
| Intents listed, together | | 101 (71 to 131) | 75 | |
| Other through cars (no intent listed) | | | 2 | |

Model through cars by origin and destination group (largest 12 of 19 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 23.0 | Telegraph Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Telegraph Ave from the north (Berkeley) | 9.0 | Telegraph Avenue |
| Telegraph Ave to the south (downtown Oakland) | Telegraph Ave from the north (Berkeley) | 8.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Ashby Ave from the west (Emeryville and I-80) | 4.0 | none near the study area |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Telegraph Ave from the north (Berkeley) | 4.0 | none near the study area |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Alcatraz Ave from the west (Emeryville side) | 3.0 | none near the study area |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) | 3.0 | Claremont Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Emeryville and West Oakland streets (55th to 67th Streets) | 3.0 | none near the study area |
| West Oakland to the southwest (Adeline St, Market St) | Claremont Ave and Tunnel Rd toward the hills | 3.0 | Claremont Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 3.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 3.0 | SR-24 |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 2.0 | Telegraph Avenue |
| other pairs | | 9.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 47 veh/h; none near the study area 15 veh/h; Claremont Avenue 7 veh/h; SR-24 then Telegraph Avenue 4 veh/h; SR-24 3 veh/h; SR-24 then Claremont Avenue then College Avenue 1 veh/h.

### Hillegass Avenue NB

Observed (PM): 94 cars entered at the south end, 48 drove the whole street, 109 left it at Alcatraz Ave (43 west, 54 east, 12 straight), and 47% of the block's trips came from a freeway. ASSUMPTION: freeway-origin through cars are 40 veh/h (52 freeway-origin trips times 94 / (94 + 29)), spread over the exits in proportion (0.37); the through share of exits is 48 / 109 = 0.44.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Hillegass Ave to reach Alcatraz Ave west and Telegraph Ave north | OBSERVED turn count x ASSUMPTION share (43 left turns x 0.37) | 16 (9 to 20) | 9 | within |
| SR-24 off-ramp traffic using Hillegass Ave to reach College Ave and Berkeley | OBSERVED turn count x ASSUMPTION share (54 right turns x 0.37) | 20 (11 to 25) | 28 | above |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach Alcatraz Ave west | ASSUMPTION: through exits (43 x 0.44) that are not off-ramp traffic | 3 (0 to 10) | 9 | within |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach College Ave and Berkeley | ASSUMPTION: through exits (54 x 0.44) that are not off-ramp traffic | 4 (0 to 13) | 8 | within |
| Intents listed, together | | 43 (20 to 68) | 54 | |
| Other through cars (no intent listed) | | | 1 | |

Model through cars by origin and destination group (largest 12 of 17 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 15.0 | SR-24 |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | College Ave from the north (Berkeley) | 9.0 | SR-24 then Claremont Avenue then College Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 5.0 | Telegraph Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Claremont Ave and Tunnel Rd toward the hills | 4.0 | Claremont Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 4.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Alcatraz Ave from the west (Emeryville side) | 2.0 | none near the study area |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Ashby Ave from the west (Emeryville and I-80) | 2.0 | College Avenue then Alcatraz Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 2.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) | 2.0 | Claremont Avenue then College Avenue then Alcatraz Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Emeryville and West Oakland streets (55th to 67th Streets) | 2.0 | SR-24 |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Telegraph Ave from the north (Berkeley) | 2.0 | none near the study area |
| Claremont Ave and Tunnel Rd toward the hills | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 1.0 | Claremont Avenue then Alcatraz Avenue |
| other pairs | | 5.0 | |

By the arterial these cars would otherwise use: SR-24 18 veh/h; Telegraph Avenue 13 veh/h; SR-24 then Claremont Avenue then College Avenue 9 veh/h; Claremont Avenue 5 veh/h; none near the study area 4 veh/h; Claremont Avenue then College Avenue then Alcatraz Avenue 2 veh/h.

### Hillegass Avenue SB

Observed (PM): 178 cars entered at the top (76 turned in from Alcatraz Ave west, 98 from the east, 4 came straight from the north), 79 drove the whole street, and 68% of the block's trips (109 veh/h) went to a freeway. ASSUMPTION: freeway-bound cars that did not join mid-street are 87 veh/h (109 x 178 / (178 + 44)), half of the 174 turn-ins; low = the whole-street share of the turn-ins (0.45), high = the freeway-bound share without the mid-street correction (0.63).

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Telegraph Ave, Alcatraz Ave west and West Berkeley traffic turning off Alcatraz Ave onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (76 turn-ins x 0.50) | 38 (34 to 48) | 25 | below |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (98 turn-ins x 0.50) | 49 (44 to 62) | 35 | below |
| Intents listed, together | | 87 (78 to 110) | 60 | |
| Other through cars (no intent listed) | | | 13 | |

Model through cars by origin and destination group (largest 12 of 14 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 25.0 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 16.0 | Claremont Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 9.0 | Claremont Avenue then SR-24 |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 7.0 | College Avenue then Claremont Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 5.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 3.0 | Claremont Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 1.0 | Alcatraz Avenue then Claremont Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Telegraph Ave to the south (downtown Oakland) | 1.0 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | West Oakland to the southwest (Adeline St, Market St) | 1.0 | Claremont Avenue |
| College Ave from the north (Berkeley) | West Oakland to the southwest (Adeline St, Market St) | 1.0 | College Avenue then Claremont Avenue |
| Berkeley hills to the northeast (Evergreen Ln, Gravatt Dr) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 1.0 | Claremont Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) | 1.0 | College Avenue then Alcatraz Avenue |
| other pairs | | 2.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 32 veh/h; Claremont Avenue then SR-24 25 veh/h; College Avenue then Claremont Avenue then SR-24 7 veh/h; Claremont Avenue 5 veh/h; College Avenue then Alcatraz Avenue 2 veh/h; Alcatraz Avenue then Claremont Avenue 1 veh/h.

### Colby Street SB

Observed (PM): 139 cars entered at the top (76 from Alcatraz Ave west, 50 from the east, 13 from the north), 39 drove the whole street, 45% of the block's trips (72 veh/h) went to a freeway and 22% came by way of Telegraph Ave. ASSUMPTION: freeway-bound cars that did not join mid-street are 46 veh/h (72 x 139 / (139 + 79)), 0.365 of the 126 turn-ins; low = the whole-street share (0.31), high = the unadjusted freeway share (0.57). The Telegraph Ave cars are the 22% x 160 = 35 of the 76 west turn-ins.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Southbound Telegraph Ave traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (35 Telegraph Ave cars x 0.365) | 13 (11 to 20) | 16 | within |
| Alcatraz Ave west, Ashby Ave and West Berkeley traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (41 other west turn-ins x 0.365) | 15 (13 to 23) | 13 | within |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (50 east turn-ins x 0.365) | 18 (15 to 29) | 17 | within |
| Intents listed, together | | 46 (39 to 72) | 46 | |
| Other through cars (no intent listed) | | | 14 | |

Model through cars by origin and destination group (largest 12 of 19 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 12.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 8.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 7.0 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 6.0 | Claremont Avenue then SR-24 |
| Shattuck Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 5.0 | none near the study area |
| Ashby Ave from the west (Emeryville and I-80) | SR-13 Warren Freeway (via SR-24 east) | 4.0 | SR-24 |
| Ashby Ave from the west (Emeryville and I-80) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 2.0 | SR-24 |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 2.0 | College Avenue then Claremont Avenue then SR-24 |
| Telegraph Ave from the north (Berkeley) | SR-13 Warren Freeway (via SR-24 east) | 2.0 | none near the study area |
| Telegraph Ave from the north (Berkeley) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 2.0 | none near the study area |
| Emeryville and West Oakland streets (55th to 67th Streets) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 2.0 | Telegraph Avenue then Claremont Avenue |
| Alcatraz Ave from the west (Emeryville side) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 1.0 | Alcatraz Avenue then College Avenue |
| other pairs | | 7.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 28 veh/h; none near the study area 9 veh/h; SR-24 8 veh/h; Claremont Avenue then SR-24 6 veh/h; Claremont Avenue 3 veh/h; College Avenue then Claremont Avenue then SR-24 2 veh/h.

### Study area, all residential and service streets

Model: 395 through cars per hour.

Model through cars by origin and destination group (largest 12 of 57 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 43.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 31.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 27.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 23.0 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 19.0 | Claremont Avenue then SR-24 |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 18.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 18.0 | SR-24 |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Alcatraz Ave from the west (Emeryville side) | 17.0 | Claremont Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Ashby Ave from the west (Emeryville and I-80) | 16.0 | none near the study area |
| West Oakland to the southwest (Adeline St, Market St) | Claremont Ave and Tunnel Rd toward the hills | 15.0 | Claremont Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave to the south (downtown Oakland) | 13.0 | Claremont Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | College Ave from the north (Berkeley) | 11.0 | SR-24 then Claremont Avenue then College Avenue |
| other pairs | | 144.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 183 veh/h; Claremont Avenue 74 veh/h; none near the study area 37 veh/h; SR-24 28 veh/h; Claremont Avenue then SR-24 19 veh/h; SR-24 then Claremont Avenue then College Avenue 11 veh/h.

By origin group: South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 86; SR-24 eastbound off-ramps (arriving from Oakland and I-980) 78; Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 58; Telegraph Ave from the north (Berkeley) 48; West Oakland to the southwest (Adeline St, Market St) 27; Claremont Ave and Tunnel Rd toward the hills 24; Emeryville and West Oakland streets (55th to 67th Streets) 13; Telegraph Ave to the south (downtown Oakland) 12; SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) 11; College Ave from the north (Berkeley) 9.

By destination group: SR-24 westbound on-ramps (toward Oakland and I-980) 104; Telegraph Ave from the north (Berkeley) 58; Claremont Ave and Tunnel Rd toward the hills 44; South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 40; Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 32; Alcatraz Ave from the west (Emeryville side) 19; Ashby Ave from the west (Emeryville and I-80) 19; Telegraph Ave to the south (downtown Oakland) 15; College Ave from the north (Berkeley) 14; West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) 12.


## Select-link shares: modeled vs observed (design D5: headline = freeway shares, tolerance +/-10 pp)

- Hillegass Avenue NB: 4 links (path Claremont Avenue -> Alcatraz Avenue (434 m)), 136 trips (118 completed)
- Colby Street NB: 8 links (path Claremont Avenue -> Alcatraz Avenue (680 m)), 160 trips (147 completed)
- Hillegass Avenue SB: 4 links (path Alcatraz Avenue -> Claremont Avenue (433 m)), 111 trips (109 completed)
- Colby Street SB: 8 links (path Alcatraz Avenue -> Claremont Avenue (680 m)), 144 trips (134 completed)

| Block | Side | Via | Observed | Modeled | Diff (pp) | n trips | Headline |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue NB | from | freeway | 47% | 51% | +4 | 136 | within |
| Hillegass Avenue NB | to | Benvenue Avenue | 21% (PM 33%) | 0% | -21 | 136 |  |
| Hillegass Avenue NB | to | College Avenue | 6% | 15% | +9 | 136 |  |
| Hillegass Avenue NB | to | Alcatraz Avenue WB | 27% | 32% | +5 | 136 |  |
| Colby Street NB | from | freeway | 47% | 38% | -9 | 160 | within |
| Colby Street NB | to | Alcatraz Avenue WB | 48% | 64% | +16 | 160 |  |
| Colby Street NB | to | Telegraph Avenue | 25% | 40% | +15 | 160 |  |
| Colby Street NB | to | College Avenue | 3% | 6% | +3 | 160 |  |
| Hillegass Avenue SB | from | Alcatraz Avenue WB | 46% | 35% | -11 | 111 |  |
| Hillegass Avenue SB | from | Benvenue Avenue | 26% | 2% | -24 | 111 |  |
| Hillegass Avenue SB | from | College Avenue | 16% | 16% | +0 | 111 |  |
| Hillegass Avenue SB | to | freeway | 57% (PM 68%) | 69% | +12 | 111 | OUTSIDE |
| Colby Street SB | from | Alcatraz Avenue EB | 43% | 23% | -20 | 144 |  |
| Colby Street SB | from | Alcatraz Avenue WB | 46% | 19% | -27 | 144 |  |
| Colby Street SB | from | Telegraph Avenue | 22% | 22% | +0 | 144 |  |
| Colby Street SB | to | freeway | 45% | 44% | -1 | 144 | within |
| Colby Street SB | to | Forest Street | 34% | 17% | -17 | 144 |  |

Headline shares within tolerance: 3 of 4. Observed column uses the PM-peak share where one is given and the period is pm_peak. 'Via' shares are the fraction of select-link trips using that street before (from) or after (to) the block; freeway = origin / destination gate with a motorway-class link attached.

## Claremont ramps: streets used before the on-ramp / after the off-ramp

Observed shares are for traffic from/to the north only. 'Modeled' is over all trips on the ramps and any visit to the street (an upper bound for streets that serve both sides). 'Modeled, side' counts only trips whose surface end lies on the side of the ramp stated in the targets file (`freewayRamp.side`), and for a street with a qualifier ("north of X") only its links on that side of X.

| Direction | Via | Observed | Modeled | n ramp trips | Modeled, side | n side trips |
| --- | --- | --- | --- | --- | --- | --- |
| onto freeway | College Avenue | 16% | 17% | 485 | 20% | 425 |
| onto freeway | Hillegass Avenue | 12% | 14% | 485 | 16% | 425 |
| onto freeway | Martin Street | 10% | 14% | 485 | 16% | 425 |
| onto freeway | Colby Street | 8% | 10% | 485 | 12% | 425 |
| onto freeway | Telegraph Avenue north of Alcatraz Avenue | 8% | 12% | 485 | 11% | 425 |
| onto freeway | Benvenue Avenue | 5% | 3% | 485 | 4% | 425 |
| from freeway | College Avenue | 10% | 8% | 617 | 10% | 468 |
| from freeway | Martin Street | 10% | 11% | 617 | 15% | 468 |
| from freeway | Colby Street | 8% | 8% | 617 | 11% | 468 |
| from freeway | Hillegass Avenue | 5% | 6% | 617 | 9% | 468 |
| from freeway | Benvenue Avenue | 3% | 1% | 617 | 1% | 468 |

## Top 15 links by delay

| Link | Street | Class | Lanes | Len (m) | End node control | Delay (veh-h) | Stopped (veh-h) | Mean stopped veh | Flow (veh/h) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1662 | 52nd Street | Secondary | 4 | 53 | signal | 5.26 | 4.31 | 4.3 | 680 |
| 1051 | Adeline Street | Secondary | 4 | 50 | signal | 4.79 | 3.93 | 3.9 | 716 |
| 1122 | Alcatraz Avenue | Tertiary | 1 | 299 | signal | 3.50 | 2.20 | 2.2 | 514 |
| 4143 | Adeline Street | Secondary | 3 | 185 | signal | 3.35 | 1.92 | 1.9 | 668 |
| 769 | Martin Luther King Junior Way | Secondary | 3 | 112 | signal | 3.26 | 2.07 | 2.1 | 971 |
| 1037 | Sacramento Street | Tertiary | 3 | 40 | signal | 3.07 | 2.31 | 2.3 | 943 |
| 1108 | Market Street | Secondary | 4 | 36 | signal | 3.01 | 2.71 | 2.7 | 618 |
| 2005 | Shattuck Avenue | Tertiary | 1 | 92 | signal | 3.00 | 2.18 | 2.2 | 512 |
| 3463 | Tunnel Road | Primary | 2 | 52 | signal | 2.87 | 2.41 | 2.4 | 714 |
| 498 | Sacramento Street | Tertiary | 3 | 48 | signal | 2.77 | 2.03 | 2.0 | 712 |
| 535 | Ashby Avenue | Primary | 2 | 210 | signal | 2.60 | 1.36 | 1.4 | 785 |
| 108 | Stanford Avenue | Secondary | 3 | 61 | signal | 2.53 | 1.47 | 1.5 | 778 |
| 1025 | Martin Luther King Junior Way | Secondary | 3 | 79 | signal | 2.35 | 1.84 | 1.8 | 355 |
| 114 | San Pablo Avenue | Primary | 3 | 46 | signal | 2.31 | 1.56 | 1.6 | 608 |
| 755 | Market Street | Tertiary | 2 | 77 | signal | 2.20 | 1.91 | 1.9 | 220 |

## Top 15 nodes by blocked time

Blocked time = lane-head seconds waiting at the stop line without permission (signal red, conflict, stop sign or no downstream space).

| Node | Streets | Control | Gate | Blocked (lane-h) | of which no downstream space | Signal plan at end (cycle: greens) |
| --- | --- | --- | --- | --- | --- | --- |
| 680 | 52nd Street / Shattuck Avenue | signal |  | 4.90 | 0.01 | 110 s: 34/28/34 |
| 446 | Market Street / Stanford Avenue | signal |  | 3.89 | 0.01 | 75 s: 50/15 |
| 447 | Adeline Street / Alcatraz Avenue | signal |  | 3.67 | 0.01 | 75 s: 22/43 |
| 30 | 57th Street / Adeline Street / Market Street | signal |  | 2.76 | 0.00 | 75 s: 30/15/15 |
| 185 | Alcatraz Avenue / Sacramento Street | signal |  | 2.67 | 0.01 | 75 s: 35/30 |
| 37 | San Pablo Avenue / Stanford Avenue | signal |  | 2.48 | 0.00 | 75 s: 30/35 |
| 851 | Alcatraz Avenue / Telegraph Avenue | signal |  | 2.33 | 0.01 | 75 s: 40/25 |
| 1080 | 62nd Street / Claremont Avenue / College Avenue | signal |  | 2.24 | 0.00 | 75 s: 15/30/15 |
| 1069 | Claremont Avenue / Colby Street / Forest Street | signal |  | 2.17 | 0.00 | 147 s: 69/10/53 |
| 501 | Alcatraz Avenue / Shattuck Avenue | signal |  | 2.12 | 0.01 | 75 s: 26/39 |
| 479 | Adeline Street / Martin Luther King Junior Way / Stanford Avenue | signal |  | 2.10 | 0.00 | 75 s: 15/50 |
| 713 | 51st Street / Telegraph Avenue | signal |  | 2.08 | 0.00 | 75 s: 45/20 |
| 944 | Ashby Avenue / Shattuck Avenue | signal |  | 2.04 | 0.00 | 75 s: 22/43 |
| 17 | 45th Street / San Pablo Avenue | signal |  | 2.03 | 0.00 | 75 s: 27/38 |
| 242 | Ashby Avenue / Martin Luther King Junior Way | signal |  | 1.86 | 0.00 | 75 s: 37/28 |

Phases of the five most blocked signals (green s: approach links with their lanes, link ids in brackets):

- node 680: 34 s: 52nd Street 4L [1662]; 28 s: 52nd Street 4L [1666]; 34 s: Shattuck Avenue 2L [1653], Shattuck Avenue 2L [1705]
- node 446: 50 s: Stanford Avenue 1L [941], Stanford Avenue 3L [1055]; 15 s: Market Street 4L [1108], Market Street 3L [1111]
- node 447: 22 s: Adeline Street 4L [1049], Adeline Street 4L [1051]; 43 s: Alcatraz Avenue 2L [1048], Alcatraz Avenue 2L [1133]
- node 30: 30 s: Adeline Street 1L [747], Adeline Street 1L [1030]; 15 s: Market Street 2L [755], Market Street 2L [1113]; 15 s: 57th Street 1L [44], 57th Street 1L [1151]
- node 185: 35 s: Alcatraz Avenue 1L [363], Alcatraz Avenue 1L [1162]; 30 s: Sacramento Street 3L [1036], Sacramento Street 3L [1037]

## Entry backlog by origin node at end of run (top 10)

| Node | Streets | Trips waiting | Offered veh/h (before scale) |
| --- | --- | --- | --- |
| 1000 | Desmond Street / Glendale Avenue | 1 | 10 |

## Flow on key streets (veh/h per direction, study-area links of 40 m or more)

| Street | Direction of travel | Links | Median flow | Max flow |
| --- | --- | --- | --- | --- |
| Telegraph | N | 12 | 569 | 594 |
| Telegraph | S | 10 | 475 | 486 |
| College | N | 3 | 227 | 230 |
| College | S | 3 | 388 | 388 |
| Claremont | N | 6 | 284 | 415 |
| Claremont | S | 7 | 234 | 445 |
| Alcatraz | E | 6 | 391 | 398 |
| Alcatraz | W | 6 | 236 | 316 |
| Hillegass | N | 4 | 79 | 90 |
| Hillegass | S | 4 | 71 | 82 |
| Colby | N | 7 | 71 | 107 |
| Colby | S | 7 | 59 | 74 |
| Martin | E | 2 | 107 | 107 |
| Martin | W | 2 | 92 | 92 |

## Largest demand origins (offered, before scale)

| Node | Streets | Veh/h |
| --- | --- | --- |
| 602 | Grove Shafter Freeway | 2527 |
| 1672 | Warren Freeway | 823 |
| 265 | Ashby Avenue | 781 |
| 943 | Telegraph Avenue / Ward Street | 703 |
| 183 | San Pablo Avenue | 616 |
| 974 | Broadway | 455 |
| 763 | Telegraph Avenue | 393 |
| 184 | Alcatraz Avenue | 364 |
| 275 | Market Street | 334 |
| 1756 | Claremont Avenue | 297 |
