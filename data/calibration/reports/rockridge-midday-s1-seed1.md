# Calibration report: rockridge midday scale 1 seed 1 (60 min)

Offered demand 15997 veh/h x scale 1 = 15997 veh/h. Run took 19.1 s wall clock. Flow tables use the window after a 10 min warm-up; select-link and health figures cover the whole run from an empty network.

## Stability (design D4)

| Criterion | Threshold | Value | Result |
| --- | --- | --- | --- |
| Gridlock removals | 0 | 0 | pass |
| Backlog / spawned | < 2% | 0.0% (1 of 16119) | pass |
| Arterial mean speed (run) | > 4 m/s | 10.05 m/s (last 15 min 10.10) | pass |

Overall: **STABLE**. Mean trip delay 70 s, mean trip time 363 s, completed 16162, unroutable 0.

| t (min) | vehicles in network | backlog | completed | removals | arterial speed in interval (m/s) |
| --- | --- | --- | --- | --- | --- |
| 5 | 1735 | 1 | 1406 | 0 | 9.91 |
| 10 | 1638 | 0 | 2805 | 0 | 9.87 |
| 15 | 1679 | 0 | 4125 | 0 | 9.90 |
| 20 | 1765 | 1 | 5448 | 0 | 10.02 |
| 25 | 1646 | 1 | 6865 | 0 | 10.09 |
| 30 | 1638 | 0 | 8261 | 0 | 10.24 |
| 35 | 1723 | 1 | 9530 | 0 | 10.15 |
| 40 | 1704 | 2 | 10850 | 0 | 10.10 |
| 45 | 1644 | 0 | 12207 | 0 | 10.05 |
| 50 | 1722 | 0 | 13541 | 0 | 10.05 |
| 55 | 1671 | 2 | 14884 | 0 | 10.20 |
| 60 | 1731 | 1 | 16162 | 0 | 10.06 |
## Wandering (completed car trips)

Detour ratio = distance driven (link and movement lengths) over the shortest network distance from the trip's origin to its destination. Detour against the free-flow route uses the time-shortest route with no congestion and no noise, which is what a purposeful driver without live information would follow (it differs from the shortest distance when a faster, longer road exists). A switch is a change of the remaining route while en route. Loops: the same link twice or the same node three or more times. Reversals: a link followed by its reverse within 200 m. 'Study-area vehicle-miles' are miles driven on links inside the study area; the last column is the share of them driven by trips with a detour ratio above 1.3. Guided drivers re-evaluate their route every epoch; the others keep their departure route unless it is blocked.

| Trips | n | Switches per trip | With a switch | Mean detour | Median detour | Detour > 1.3 | Detour > 2 | Mean detour vs free-flow route | Vs free-flow route > 1.3 | Loops | Reversals | Study veh-miles | Of them by detour > 1.3 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| all trips | 14892 | 0.00 | 0.1% | 1.089 | 1.055 | 4.0% | 0.0% | 1.026 | 1.2% | 0.0% | 4.8% | 1394 | 6.8% |
| gate to gate | 5609 | 0.00 | 0.1% | 1.092 | 1.067 | 2.4% | 0.0% | 1.023 | 0.7% | 0.0% | 8.1% | 329 | 7.3% |
| with a local end | 9283 | 0.00 | 0.1% | 1.087 | 1.050 | 5.0% | 0.0% | 1.027 | 1.4% | 0.0% | 2.8% | 1065 | 6.7% |
| guided drivers | 6858 | 0.00 | 0.3% | 1.089 | 1.054 | 3.8% | 0.0% | 1.025 | 1.2% | 0.0% | 5.1% | 623 | 7.6% |
| other drivers | 8034 | 0.00 | 0.0% | 1.089 | 1.056 | 4.1% | 0.0% | 1.026 | 1.2% | 0.0% | 4.5% | 771 | 6.2% |

## Reported patterns (diagnostics; configured in the targets file under `patterns`)

(a) Trips between the surface gates on the north side of the ramps and the freeway mainline gates, and the local-street (residential and service links in the study area) vehicle-miles they drive. Share = of all completed trips' local-street vehicle-miles (253 miles). No observed counterpart exists for this quantity (the targets file has only the select-link shares above).

| Trips | n trips | Local-street veh-miles | Share of all local-street veh-miles |
| --- | --- | --- | --- |
| surface gates to the freeway | 1043 | 23.0 | 9% |
| freeway to the surface gates | 724 | 22.1 | 9% |

(b) Corridor trips: completed trips from beyond one end of the corridor's study-area extent (the bypass street and its arterial together) to beyond the other end, within a lateral limit of the corridor, by direction. 'Bypass' = at least N blocks (links) on the bypass street; 'arterial' = fewer bypass blocks and at least N on the arterial; 'other' = neither (another street, the freeway or a short use); blocks are counted on the corridor's study-area links. No observed counterpart exists for these shares. The related observed values are in the select-link table above: northbound Hillegass Ave traffic rarely ends on College Ave (6%), 21 to 33% jogs to Benvenue Ave, and southbound freeway-bound drivers on College Ave commonly arrive via Ashby Ave and Benvenue Ave and jog to Hillegass Ave.

| Bypass | Arterial | N | Direction | Corridor trips | Bypass | Arterial | Other | Mean bypass blocks |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue | College Avenue | 3 | N | 910 | 3% | 15% | 82% | 0.2 |
| Hillegass Avenue | College Avenue | 3 | S | 924 | 5% | 22% | 74% | 0.2 |

## Per-mode results

Offered: 15997 car veh/h; 105 bicycle flows (386/h); 2000 pedestrian flows (1582/h). Bicycle and pedestrian volumes are assumptions, not counts.

| Mode | In network | Completed | Mean time (s) | Other |
| --- | --- | --- | --- | --- |
| Car | 1731 | 16162 | 363 | |
| Bicycle | 11 | 404 | 171 | |
| Pedestrian | 219 | 1469 | 445 | mean crossing delay 7.6 s |

Vulnerable road users (surrogate indicators): pedestrian conflicts 237, bicycle conflicts 140, close passes 132, pedestrian injury-risk index 0.048, bicycle injury-risk index 0.078 (proxy), mean vehicle speed at pedestrian encounters 2.48 m/s.


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
| SR-24 off-ramp traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | OBSERVED turn count x ASSUMPTION share (131 left turns x 0.40) | 52 (38 to 62) | 36 | below |
| Telegraph Ave and south-side traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | ASSUMPTION: the through left-turners (131 x 0.62 = 81) that are not off-ramp traffic | 29 (19 to 43) | 23 | within |
| SR-24 off-ramp traffic using Colby St to reach College Ave and Berkeley (right at Alcatraz Ave) | OBSERVED turn count x ASSUMPTION share (32 right turns x 0.40) | 13 (9 to 15) | 13 | within |
| Telegraph Ave and south-side traffic using Colby St to reach College Ave and Berkeley | ASSUMPTION: the through right-turners (32 x 0.62 = 20) that are not off-ramp traffic | 7 (5 to 11) | 3 | below |
| Intents listed, together | | 101 (71 to 131) | 75 | |
| Other through cars (no intent listed) | | | 6 | |

Model through cars by origin and destination group (largest 12 of 14 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 36.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Ashby Ave from the west (Emeryville and I-80) | 8.0 | none near the study area |
| Telegraph Ave to the south (downtown Oakland) | Telegraph Ave from the north (Berkeley) | 8.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 7.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 5.0 | SR-24 |
| West Oakland to the southwest (Adeline St, Market St) | Telegraph Ave from the north (Berkeley) | 4.0 | Telegraph Avenue |
| College Ave from the north (Berkeley) | Alcatraz Ave from the west (Emeryville side) | 3.0 | College Avenue then Alcatraz Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 3.0 | Claremont Avenue then College Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 2.0 | Claremont Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Claremont Ave and Tunnel Rd toward the hills | 1.0 | Telegraph Avenue then Alcatraz Avenue then Claremont Avenue |
| College Ave from the north (Berkeley) | San Pablo Ave (Emeryville and West Oakland) | 1.0 | College Avenue then Claremont Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 1.0 | Telegraph Avenue |
| other pairs | | 2.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 56 veh/h; none near the study area 8 veh/h; SR-24 5 veh/h; Claremont Avenue then College Avenue 3 veh/h; College Avenue then Alcatraz Avenue 3 veh/h; Claremont Avenue 2 veh/h.

### Hillegass Avenue NB

Observed (PM): 94 cars entered at the south end, 48 drove the whole street, 109 left it at Alcatraz Ave (43 west, 54 east, 12 straight), and 47% of the block's trips came from a freeway. ASSUMPTION: freeway-origin through cars are 40 veh/h (52 freeway-origin trips times 94 / (94 + 29)), spread over the exits in proportion (0.37); the through share of exits is 48 / 109 = 0.44.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Hillegass Ave to reach Alcatraz Ave west and Telegraph Ave north | OBSERVED turn count x ASSUMPTION share (43 left turns x 0.37) | 16 (9 to 20) | 12 | within |
| SR-24 off-ramp traffic using Hillegass Ave to reach College Ave and Berkeley | OBSERVED turn count x ASSUMPTION share (54 right turns x 0.37) | 20 (11 to 25) | 22 | within |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach Alcatraz Ave west | ASSUMPTION: through exits (43 x 0.44) that are not off-ramp traffic | 3 (0 to 10) | 5 | within |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach College Ave and Berkeley | ASSUMPTION: through exits (54 x 0.44) that are not off-ramp traffic | 4 (0 to 13) | 16 | above |
| Intents listed, together | | 43 (20 to 68) | 55 | |
| Other through cars (no intent listed) | | | 6 | |

Model through cars by origin and destination group (largest 12 of 19 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 12.0 | SR-24 |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 10.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 10.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 6.0 | SR-24 then Claremont Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 4.0 | College Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | College Ave from the north (Berkeley) | 4.0 | SR-24 then Claremont Avenue then College Avenue |
| Telegraph Ave to the south (downtown Oakland) | Claremont Ave and Tunnel Rd toward the hills | 2.0 | Claremont Avenue |
| Telegraph Ave to the south (downtown Oakland) | Berkeley hills to the northeast (Evergreen Ln, Gravatt Dr) | 2.0 | Telegraph Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Shattuck Ave from the north (Berkeley) | 1.0 | Claremont Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Emeryville and West Oakland streets (55th to 67th Streets) | 1.0 | College Avenue then Alcatraz Avenue |
| College Ave from the north (Berkeley) | Alcatraz Ave from the west (Emeryville side) | 1.0 | College Avenue then Alcatraz Avenue |
| College Ave from the north (Berkeley) | West Oakland to the southwest (Adeline St, Market St) | 1.0 | College Avenue then Claremont Avenue |
| other pairs | | 7.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 21 veh/h; SR-24 13 veh/h; SR-24 then Claremont Avenue 6 veh/h; Claremont Avenue 4 veh/h; College Avenue 4 veh/h; SR-24 then Claremont Avenue then College Avenue 4 veh/h.

### Hillegass Avenue SB

Observed (PM): 178 cars entered at the top (76 turned in from Alcatraz Ave west, 98 from the east, 4 came straight from the north), 79 drove the whole street, and 68% of the block's trips (109 veh/h) went to a freeway. ASSUMPTION: freeway-bound cars that did not join mid-street are 87 veh/h (109 x 178 / (178 + 44)), half of the 174 turn-ins; low = the whole-street share of the turn-ins (0.45), high = the freeway-bound share without the mid-street correction (0.63).

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Telegraph Ave, Alcatraz Ave west and West Berkeley traffic turning off Alcatraz Ave onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (76 turn-ins x 0.50) | 38 (34 to 48) | 26 | below |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (98 turn-ins x 0.50) | 49 (44 to 62) | 35 | below |
| Intents listed, together | | 87 (78 to 110) | 61 | |
| Other through cars (no intent listed) | | | 14 | |

Model through cars by origin and destination group (largest 12 of 11 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 26.0 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 17.0 | Claremont Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 9.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 9.0 | Claremont Avenue then SR-24 |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 8.0 | College Avenue then Claremont Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 1.0 | Claremont Avenue |
| West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 1.0 | Claremont Avenue |
| Berkeley hills to the northeast (Evergreen Ln, Gravatt Dr) | West Oakland to the southwest (Adeline St, Market St) | 1.0 | Claremont Avenue |
| Shattuck Ave from the north (Berkeley) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 1.0 | College Avenue |
| Emeryville and West Oakland streets (55th to 67th Streets) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 1.0 | Alcatraz Avenue then College Avenue |
| Emeryville and West Oakland streets (55th to 67th Streets) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 1.0 | Claremont Avenue |

By the arterial these cars would otherwise use: Telegraph Avenue 35 veh/h; Claremont Avenue then SR-24 26 veh/h; College Avenue then Claremont Avenue then SR-24 8 veh/h; Claremont Avenue 4 veh/h; Alcatraz Avenue then College Avenue 1 veh/h; College Avenue 1 veh/h.

### Colby Street SB

Observed (PM): 139 cars entered at the top (76 from Alcatraz Ave west, 50 from the east, 13 from the north), 39 drove the whole street, 45% of the block's trips (72 veh/h) went to a freeway and 22% came by way of Telegraph Ave. ASSUMPTION: freeway-bound cars that did not join mid-street are 46 veh/h (72 x 139 / (139 + 79)), 0.365 of the 126 turn-ins; low = the whole-street share (0.31), high = the unadjusted freeway share (0.57). The Telegraph Ave cars are the 22% x 160 = 35 of the 76 west turn-ins.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Southbound Telegraph Ave traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (35 Telegraph Ave cars x 0.365) | 13 (11 to 20) | 13 | within |
| Alcatraz Ave west, Ashby Ave and West Berkeley traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (41 other west turn-ins x 0.365) | 15 (13 to 23) | 5 | below |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (50 east turn-ins x 0.365) | 18 (15 to 29) | 25 | within |
| Intents listed, together | | 46 (39 to 72) | 43 | |
| Other through cars (no intent listed) | | | 17 | |

Model through cars by origin and destination group (largest 12 of 17 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 13.0 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 12.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 9.0 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 6.0 | Claremont Avenue then SR-24 |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 6.0 | College Avenue then Claremont Avenue then SR-24 |
| Ashby Ave from the west (Emeryville and I-80) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 2.0 | SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Telegraph Ave to the south (downtown Oakland) | 2.0 | Claremont Avenue |
| Alcatraz Ave from the west (Emeryville side) | SR-13 Warren Freeway (via SR-24 east) | 1.0 | SR-24 |
| Ashby Ave from the west (Emeryville and I-80) | Berkeley hills to the northeast (Evergreen Ln, Gravatt Dr) | 1.0 | SR-24 |
| Ashby Ave from the west (Emeryville and I-80) | SR-13 Warren Freeway (via SR-24 east) | 1.0 | SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Claremont Ave and Tunnel Rd toward the hills | 1.0 | Telegraph Avenue then Alcatraz Avenue then Claremont Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | San Pablo Ave (Emeryville and West Oakland) | 1.0 | Telegraph Avenue |
| other pairs | | 5.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 35 veh/h; Claremont Avenue then SR-24 6 veh/h; College Avenue then Claremont Avenue then SR-24 6 veh/h; SR-24 5 veh/h; Claremont Avenue 4 veh/h; none near the study area 2 veh/h.

### Study area, all residential and service streets

Model: 351 through cars per hour.

Model through cars by origin and destination group (largest 12 of 57 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 47.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 40.0 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 33.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 32.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 22.0 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 20.0 | Claremont Avenue then SR-24 |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 17.0 | SR-24 |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Ashby Ave from the west (Emeryville and I-80) | 14.0 | none near the study area |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 14.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 12.0 | College Avenue |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 10.0 | College Avenue then Claremont Avenue then SR-24 |
| Telegraph Ave to the south (downtown Oakland) | Telegraph Ave from the north (Berkeley) | 8.0 | Telegraph Avenue |
| other pairs | | 82.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 211 veh/h; SR-24 28 veh/h; Claremont Avenue 20 veh/h; Claremont Avenue then SR-24 20 veh/h; none near the study area 17 veh/h; College Avenue 13 veh/h.

By origin group: SR-24 eastbound off-ramps (arriving from Oakland and I-980) 92; Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 85; South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 41; Telegraph Ave from the north (Berkeley) 35; Claremont Ave and Tunnel Rd toward the hills 24; Telegraph Ave to the south (downtown Oakland) 17; College Ave from the north (Berkeley) 16; West Oakland to the southwest (Adeline St, Market St) 12; Emeryville and West Oakland streets (55th to 67th Streets) 8; Shattuck Ave from the north (Berkeley) 5.

By destination group: SR-24 westbound on-ramps (toward Oakland and I-980) 108; Telegraph Ave from the north (Berkeley) 71; Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 41; South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 39; Claremont Ave and Tunnel Rd toward the hills 34; Ashby Ave from the west (Emeryville and I-80) 16; College Ave from the north (Berkeley) 9; San Pablo Ave (Emeryville and West Oakland) 6; West Oakland to the southwest (Adeline St, Market St) 5; Alcatraz Ave from the west (Emeryville side) 4.


## Through cars by intent (cut-through intent view)

A through car is tallied once, under the first intent whose origin and destination groups hold its trip ends, at the moment the through count counts it. Cars an hour over the run, the same window as the through-car figure (352 an hour).

| Intent | Basis | Cars an hour | Share |
| --- | --- | --- | --- |
| Berkeley and College Ave traffic using Hillegass Ave, Colby St and nearby side streets to reach the SR-24 on-ramps | observed | 51 | 14% |
| Southbound Telegraph Ave and west-side traffic turning off Alcatraz Ave onto Colby St or Hillegass Ave to reach the SR-24 on-ramps | observed | 38 | 11% |
| SR-24 off-ramp traffic using Colby St, Hillegass Ave and nearby side streets to reach Berkeley and Telegraph Ave north | observed | 74 | 21% |
| SR-24 off-ramp traffic using side streets to reach Alcatraz Ave west, Ashby Ave and Claremont Ave toward the hills | assumed | 21 | 6% |
| Downtown, south and west Oakland traffic using side streets to reach Berkeley and Telegraph Ave north | assumed | 41 | 12% |
| Berkeley and Telegraph Ave north traffic using side streets to reach downtown, south and west Oakland | assumed | 39 | 11% |
| Oakland cross-town traffic (West Oakland, Broadway, Piedmont, Emeryville) using side streets near Claremont Ave and Telegraph Ave | assumed | 24 | 7% |
| Claremont Ave, hills and south Oakland traffic using side streets to reach the SR-24 on-ramps | assumed | 26 | 7% |
| Other (no intent listed) |  | 38 | 11% |

Intents listed cover 89% of through cars.


## Select-link shares: modeled vs observed (design D5: headline = freeway shares, tolerance +/-10 pp)

- Hillegass Avenue NB: 4 links (path Claremont Avenue -> Alcatraz Avenue (434 m)), 145 trips (132 completed)
- Colby Street NB: 8 links (path Claremont Avenue -> Alcatraz Avenue (680 m)), 193 trips (176 completed)
- Hillegass Avenue SB: 4 links (path Alcatraz Avenue -> Claremont Avenue (433 m)), 133 trips (125 completed)
- Colby Street SB: 8 links (path Alcatraz Avenue -> Claremont Avenue (680 m)), 137 trips (125 completed)

| Block | Side | Via | Observed | Modeled | Diff (pp) | n trips | Headline |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue NB | from | freeway | 47% | 48% | +1 | 145 | within |
| Hillegass Avenue NB | to | Benvenue Avenue | 21% (PM 33%) | 1% | -20 | 145 |  |
| Hillegass Avenue NB | to | College Avenue | 6% | 8% | +2 | 145 |  |
| Hillegass Avenue NB | to | Alcatraz Avenue WB | 27% | 34% | +7 | 145 |  |
| Colby Street NB | from | freeway | 47% | 37% | -10 | 193 | within |
| Colby Street NB | to | Alcatraz Avenue WB | 48% | 52% | +4 | 193 |  |
| Colby Street NB | to | Telegraph Avenue | 25% | 35% | +10 | 193 |  |
| Colby Street NB | to | College Avenue | 3% | 4% | +1 | 193 |  |
| Hillegass Avenue SB | from | Alcatraz Avenue WB | 46% | 28% | -18 | 133 |  |
| Hillegass Avenue SB | from | Benvenue Avenue | 26% | 5% | -21 | 133 |  |
| Hillegass Avenue SB | from | College Avenue | 16% | 11% | -5 | 133 |  |
| Hillegass Avenue SB | to | freeway | 57% (PM 68%) | 59% | +2 | 133 | within |
| Colby Street SB | from | Alcatraz Avenue EB | 43% | 21% | -22 | 137 |  |
| Colby Street SB | from | Alcatraz Avenue WB | 46% | 18% | -28 | 137 |  |
| Colby Street SB | from | Telegraph Avenue | 22% | 17% | -5 | 137 |  |
| Colby Street SB | to | freeway | 45% | 51% | +6 | 137 | within |
| Colby Street SB | to | Forest Street | 34% | 14% | -20 | 137 |  |

Headline shares within tolerance: 4 of 4. Observed column uses the PM-peak share where one is given and the period is pm_peak. 'Via' shares are the fraction of select-link trips using that street before (from) or after (to) the block; freeway = origin / destination gate with a motorway-class link attached.

## Claremont ramps: streets used before the on-ramp / after the off-ramp

Observed shares are for traffic from/to the north only. 'Modeled' is over all trips on the ramps and any visit to the street (an upper bound for streets that serve both sides). 'Modeled, side' counts only trips whose surface end lies on the side of the ramp stated in the targets file (`freewayRamp.side`), and for a street with a qualifier ("north of X") only its links on that side of X.

| Direction | Via | Observed | Modeled | n ramp trips | Modeled, side | n side trips |
| --- | --- | --- | --- | --- | --- | --- |
| onto freeway | College Avenue | 16% | 15% | 453 | 17% | 401 |
| onto freeway | Hillegass Avenue | 12% | 16% | 453 | 18% | 401 |
| onto freeway | Martin Street | 10% | 15% | 453 | 16% | 401 |
| onto freeway | Colby Street | 8% | 12% | 453 | 13% | 401 |
| onto freeway | Telegraph Avenue north of Alcatraz Avenue | 8% | 12% | 453 | 9% | 401 |
| onto freeway | Benvenue Avenue | 5% | 4% | 453 | 5% | 401 |
| from freeway | College Avenue | 10% | 9% | 488 | 9% | 482 |
| from freeway | Martin Street | 10% | 11% | 488 | 11% | 482 |
| from freeway | Colby Street | 8% | 11% | 488 | 12% | 482 |
| from freeway | Hillegass Avenue | 5% | 8% | 488 | 8% | 482 |
| from freeway | Benvenue Avenue | 3% | 3% | 488 | 3% | 482 |

## Top 15 links by delay

| Link | Street | Class | Lanes | Len (m) | End node control | Delay (veh-h) | Stopped (veh-h) | Mean stopped veh | Flow (veh/h) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1051 | Adeline Street | Secondary | 4 | 50 | signal | 4.01 | 3.29 | 3.3 | 589 |
| 4143 | Adeline Street | Secondary | 3 | 185 | signal | 3.90 | 2.13 | 2.1 | 665 |
| 769 | Martin Luther King Junior Way | Secondary | 3 | 112 | signal | 3.56 | 2.32 | 2.3 | 968 |
| 1122 | Alcatraz Avenue | Tertiary | 1 | 299 | signal | 3.30 | 1.91 | 1.9 | 566 |
| 1037 | Sacramento Street | Tertiary | 3 | 40 | signal | 3.15 | 2.52 | 2.5 | 1057 |
| 1662 | 52nd Street | Secondary | 4 | 53 | signal | 2.98 | 2.06 | 2.1 | 860 |
| 498 | Sacramento Street | Tertiary | 3 | 48 | signal | 2.85 | 2.07 | 2.1 | 738 |
| 1108 | Market Street | Secondary | 4 | 36 | signal | 2.83 | 2.49 | 2.5 | 732 |
| 1111 | Market Street | Tertiary | 3 | 31 | signal | 2.80 | 2.44 | 2.4 | 799 |
| 535 | Ashby Avenue | Primary | 2 | 210 | signal | 2.73 | 1.42 | 1.4 | 752 |
| 2005 | Shattuck Avenue | Tertiary | 1 | 92 | signal | 2.71 | 1.99 | 2.0 | 430 |
| 755 | Market Street | Tertiary | 2 | 77 | signal | 2.52 | 2.04 | 2.0 | 443 |
| 115 | San Pablo Avenue | Primary | 3 | 54 | signal | 2.50 | 1.99 | 2.0 | 487 |
| 1049 | Adeline Street | Secondary | 4 | 43 | signal | 2.43 | 2.05 | 2.1 | 404 |
| 2008 | Shattuck Avenue | Tertiary | 1 | 93 | signal | 2.37 | 1.64 | 1.6 | 456 |

## Top 15 nodes by blocked time

Blocked time = lane-head seconds waiting at the stop line without permission (signal red, conflict, stop sign or no downstream space).

| Node | Streets | Control | Gate | Blocked (lane-h) | of which no downstream space | Signal plan at end (cycle: greens) |
| --- | --- | --- | --- | --- | --- | --- |
| 446 | Market Street / Stanford Avenue | signal |  | 4.33 | 0.04 | 75 s: 50/15 |
| 680 | 52nd Street / Shattuck Avenue | signal |  | 4.03 | 0.07 | 110 s: 30/28/38 |
| 447 | Adeline Street / Alcatraz Avenue | signal |  | 3.74 | 0.01 | 75 s: 15/50 |
| 185 | Alcatraz Avenue / Sacramento Street | signal |  | 2.85 | 0.01 | 75 s: 35/30 |
| 30 | 57th Street / Adeline Street / Market Street | signal |  | 2.65 | 0.01 | 75 s: 17/28/15 |
| 1080 | 62nd Street / Claremont Avenue / College Avenue | signal |  | 2.41 | 0.01 | 75 s: 15/30/15 |
| 1069 | Claremont Avenue / Colby Street / Forest Street | signal |  | 2.35 | 0.00 | 147 s: 91/10/31 |
| 37 | San Pablo Avenue / Stanford Avenue | signal |  | 2.34 | 0.00 | 75 s: 24/41 |
| 501 | Alcatraz Avenue / Shattuck Avenue | signal |  | 2.29 | 0.02 | 75 s: 33/32 |
| 851 | Alcatraz Avenue / Telegraph Avenue | signal |  | 2.24 | 0.02 | 75 s: 39/26 |
| 944 | Ashby Avenue / Shattuck Avenue | signal |  | 2.14 | 0.00 | 75 s: 24/41 |
| 331 | 52nd Street / Martin Luther King Junior Way | signal |  | 2.06 | 0.00 | 75 s: 38/27 |
| 479 | Adeline Street / Martin Luther King Junior Way / Stanford Avenue | signal |  | 2.04 | 0.00 | 75 s: 18/47 |
| 1406 | Ashby Avenue / Claremont Avenue | signal |  | 2.02 | 0.01 | 75 s: 50/15 |
| 242 | Ashby Avenue / Martin Luther King Junior Way | signal |  | 2.00 | 0.00 | 75 s: 35/30 |

Phases of the five most blocked signals (green s: approach links with their lanes, link ids in brackets):

- node 446: 50 s: Stanford Avenue 1L [941], Stanford Avenue 3L [1055]; 15 s: Market Street 4L [1108], Market Street 3L [1111]
- node 680: 30 s: 52nd Street 4L [1662]; 28 s: 52nd Street 4L [1666], 52nd Street 4L [1662]; 38 s: Shattuck Avenue 2L [1653], Shattuck Avenue 2L [1705]
- node 447: 15 s: Adeline Street 4L [1049], Adeline Street 4L [1051]; 50 s: Alcatraz Avenue 2L [1048], Alcatraz Avenue 2L [1133]
- node 185: 35 s: Alcatraz Avenue 1L [363], Alcatraz Avenue 1L [1162]; 30 s: Sacramento Street 3L [1036], Sacramento Street 3L [1037]
- node 30: 17 s: Adeline Street 1L [747], Adeline Street 1L [1030]; 28 s: Market Street 2L [755], Market Street 2L [1113]; 15 s: 57th Street 1L [44], 57th Street 1L [1151]

## Entry backlog by origin node at end of run (top 10)

| Node | Streets | Trips waiting | Offered veh/h (before scale) |
| --- | --- | --- | --- |
| 151 | 66th Street / Baker Street | 1 | 10 |

## Flow on key streets (veh/h per direction, study-area links of 40 m or more)

| Street | Direction of travel | Links | Median flow | Max flow |
| --- | --- | --- | --- | --- |
| Telegraph | N | 12 | 636 | 672 |
| Telegraph | S | 10 | 370 | 383 |
| College | N | 3 | 223 | 223 |
| College | S | 3 | 428 | 430 |
| Claremont | N | 6 | 270 | 416 |
| Claremont | S | 7 | 215 | 414 |
| Alcatraz | E | 6 | 409 | 420 |
| Alcatraz | W | 6 | 278 | 331 |
| Hillegass | N | 4 | 83 | 97 |
| Hillegass | S | 4 | 94 | 98 |
| Colby | N | 7 | 100 | 112 |
| Colby | S | 7 | 77 | 101 |
| Martin | E | 2 | 95 | 95 |
| Martin | W | 2 | 62 | 62 |

## Largest demand origins (offered, before scale)

| Node | Streets | Veh/h |
| --- | --- | --- |
| 602 | Grove Shafter Freeway | 2564 |
| 265 | Ashby Avenue | 781 |
| 943 | Telegraph Avenue / Ward Street | 777 |
| 1672 | Warren Freeway | 719 |
| 183 | San Pablo Avenue | 706 |
| 974 | Broadway | 435 |
| 763 | Telegraph Avenue | 355 |
| 184 | Alcatraz Avenue | 349 |
| 275 | Market Street | 295 |
| 104 | San Pablo Avenue | 291 |
