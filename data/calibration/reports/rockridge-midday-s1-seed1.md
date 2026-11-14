# Calibration report: rockridge midday scale 1 seed 1 (60 min)

Offered demand 15813 veh/h x scale 1 = 15813 veh/h. Run took 25.0 s wall clock. Flow tables use the window after a 10 min warm-up; select-link and health figures cover the whole run from an empty network.

## Stability (design D4)

| Criterion | Threshold | Value | Result |
| --- | --- | --- | --- |
| Gridlock removals | 0 | 0 | pass |
| Backlog / spawned | < 2% | 0.0% (0 of 15890) | pass |
| Arterial mean speed (run) | > 4 m/s | 9.99 m/s (last 15 min 9.93) | pass |

Overall: **STABLE**. Mean trip delay 73 s, mean trip time 367 s, completed 15987, unroutable 0.

| t (min) | vehicles in network | backlog | completed | removals | arterial speed in interval (m/s) |
| --- | --- | --- | --- | --- | --- |
| 5 | 1702 | 0 | 1353 | 0 | 10.00 |
| 10 | 1608 | 0 | 2733 | 0 | 9.98 |
| 15 | 1611 | 2 | 4039 | 0 | 10.11 |
| 20 | 1589 | 2 | 5345 | 0 | 10.17 |
| 25 | 1661 | 2 | 6617 | 0 | 9.94 |
| 30 | 1708 | 0 | 7937 | 0 | 10.02 |
| 35 | 1725 | 0 | 9280 | 0 | 10.03 |
| 40 | 1692 | 0 | 10624 | 0 | 9.99 |
| 45 | 1662 | 0 | 11947 | 0 | 9.93 |
| 50 | 1705 | 2 | 13253 | 0 | 9.97 |
| 55 | 1725 | 3 | 14565 | 0 | 9.76 |
| 60 | 1643 | 0 | 15987 | 0 | 10.05 |
## Wandering (completed car trips)

Detour ratio = distance driven (link and movement lengths) over the shortest network distance from the trip's origin to its destination. Detour against the free-flow route uses the time-shortest route with no congestion and no noise, which is what a purposeful driver without live information would follow (it differs from the shortest distance when a faster, longer road exists). A switch is a change of the remaining route while en route. Loops: the same link twice or the same node three or more times. Reversals: a link followed by its reverse within 200 m. 'Study-area vehicle-miles' are miles driven on links inside the study area; the last column is the share of them driven by trips with a detour ratio above 1.3. Guided drivers re-evaluate their route every epoch; the others keep their departure route unless it is blocked.

| Trips | n | Switches per trip | With a switch | Mean detour | Median detour | Detour > 1.3 | Detour > 2 | Mean detour vs free-flow route | Vs free-flow route > 1.3 | Loops | Reversals | Study veh-miles | Of them by detour > 1.3 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| all trips | 14766 | 0.00 | 0.1% | 1.091 | 1.060 | 4.1% | 0.0% | 1.028 | 1.3% | 0.0% | 5.4% | 1322 | 7.1% |
| gate to gate | 5947 | 0.00 | 0.1% | 1.091 | 1.071 | 2.5% | 0.1% | 1.026 | 1.1% | 0.0% | 7.9% | 384 | 7.1% |
| with a local end | 8819 | 0.00 | 0.2% | 1.091 | 1.056 | 5.1% | 0.0% | 1.029 | 1.5% | 0.0% | 3.8% | 938 | 7.1% |
| guided drivers | 6731 | 0.00 | 0.3% | 1.092 | 1.060 | 4.2% | 0.0% | 1.029 | 1.4% | 0.0% | 5.1% | 589 | 7.1% |
| other drivers | 8035 | 0.00 | 0.0% | 1.091 | 1.060 | 4.0% | 0.0% | 1.027 | 1.3% | 0.0% | 5.7% | 733 | 7.1% |

## Reported patterns (diagnostics; configured in the targets file under `patterns`)

(a) Trips between the surface gates on the north side of the ramps and the freeway mainline gates, and the local-street (residential and service links in the study area) vehicle-miles they drive. Share = of all completed trips' local-street vehicle-miles (254 miles). No observed counterpart exists for this quantity (the targets file has only the select-link shares above).

| Trips | n trips | Local-street veh-miles | Share of all local-street veh-miles |
| --- | --- | --- | --- |
| surface gates to the freeway | 1110 | 29.2 | 11% |
| freeway to the surface gates | 820 | 20.9 | 8% |

(b) Corridor trips: completed trips from beyond one end of the corridor's study-area extent (the bypass street and its arterial together) to beyond the other end, within a lateral limit of the corridor, by direction. 'Bypass' = at least N blocks (links) on the bypass street; 'arterial' = fewer bypass blocks and at least N on the arterial; 'other' = neither (another street, the freeway or a short use); blocks are counted on the corridor's study-area links. No observed counterpart exists for these shares. The related observed values are in the select-link table above: northbound Hillegass Ave traffic rarely ends on College Ave (6%), 21 to 33% jogs to Benvenue Ave, and southbound freeway-bound drivers on College Ave commonly arrive via Ashby Ave and Benvenue Ave and jog to Hillegass Ave.

| Bypass | Arterial | N | Direction | Corridor trips | Bypass | Arterial | Other | Mean bypass blocks |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue | College Avenue | 3 | N | 976 | 3% | 16% | 81% | 0.1 |
| Hillegass Avenue | College Avenue | 3 | S | 1003 | 4% | 23% | 73% | 0.2 |

## Per-mode results

Offered: 15813 car veh/h; 105 bicycle flows (386/h); 2000 pedestrian flows (1582/h). Bicycle and pedestrian volumes are assumptions, not counts.

| Mode | In network | Completed | Mean time (s) | Other |
| --- | --- | --- | --- | --- |
| Car | 1643 | 15987 | 367 | |
| Bicycle | 25 | 416 | 167 | |
| Pedestrian | 179 | 1497 | 445 | mean crossing delay 7.4 s |

Vulnerable road users (surrogate indicators): pedestrian conflicts 216, bicycle conflicts 166, close passes 194, pedestrian injury-risk index 0.049, bicycle injury-risk index 0.070 (proxy), mean vehicle speed at pedestrian encounters 2.49 m/s.


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
| Telegraph Ave and south-side traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | ASSUMPTION: the through left-turners (131 x 0.62 = 81) that are not off-ramp traffic | 29 (19 to 43) | 29 | within |
| SR-24 off-ramp traffic using Colby St to reach College Ave and Berkeley (right at Alcatraz Ave) | OBSERVED turn count x ASSUMPTION share (32 right turns x 0.40) | 13 (9 to 15) | 5 | below |
| Telegraph Ave and south-side traffic using Colby St to reach College Ave and Berkeley | ASSUMPTION: the through right-turners (32 x 0.62 = 20) that are not off-ramp traffic | 7 (5 to 11) | 9 | within |
| Intents listed, together | | 101 (71 to 131) | 74 | |
| Other through cars (no intent listed) | | | 5 | |

Model through cars by origin and destination group (largest 12 of 21 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 23.0 | Telegraph Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Telegraph Ave from the north (Berkeley) | 7.0 | Telegraph Avenue |
| Telegraph Ave to the south (downtown Oakland) | Telegraph Ave from the north (Berkeley) | 7.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Alcatraz Ave from the west (Emeryville side) | 6.0 | none near the study area |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 5.0 | Telegraph Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Telegraph Ave from the north (Berkeley) | 4.0 | none near the study area |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Ashby Ave from the west (Emeryville and I-80) | 3.0 | none near the study area |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) | 3.0 | Claremont Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Claremont Ave and Tunnel Rd toward the hills | 3.0 | Claremont Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 3.0 | SR-24 |
| San Pablo Ave (Emeryville and West Oakland) | Claremont Ave and Tunnel Rd toward the hills | 2.0 | Alcatraz Avenue then Claremont Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Emeryville and West Oakland streets (55th to 67th Streets) | 2.0 | Claremont Avenue |
| other pairs | | 11.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 45 veh/h; none near the study area 14 veh/h; Claremont Avenue 9 veh/h; SR-24 then Telegraph Avenue 4 veh/h; SR-24 3 veh/h; Alcatraz Avenue then Claremont Avenue 2 veh/h.

### Hillegass Avenue NB

Observed (PM): 94 cars entered at the south end, 48 drove the whole street, 109 left it at Alcatraz Ave (43 west, 54 east, 12 straight), and 47% of the block's trips came from a freeway. ASSUMPTION: freeway-origin through cars are 40 veh/h (52 freeway-origin trips times 94 / (94 + 29)), spread over the exits in proportion (0.37); the through share of exits is 48 / 109 = 0.44.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Hillegass Ave to reach Alcatraz Ave west and Telegraph Ave north | OBSERVED turn count x ASSUMPTION share (43 left turns x 0.37) | 16 (9 to 20) | 8 | below |
| SR-24 off-ramp traffic using Hillegass Ave to reach College Ave and Berkeley | OBSERVED turn count x ASSUMPTION share (54 right turns x 0.37) | 20 (11 to 25) | 29 | above |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach Alcatraz Ave west | ASSUMPTION: through exits (43 x 0.44) that are not off-ramp traffic | 3 (0 to 10) | 9 | within |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach College Ave and Berkeley | ASSUMPTION: through exits (54 x 0.44) that are not off-ramp traffic | 4 (0 to 13) | 13 | within |
| Intents listed, together | | 43 (20 to 68) | 59 | |
| Other through cars (no intent listed) | | | 2 | |

Model through cars by origin and destination group (largest 12 of 19 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 15.0 | SR-24 |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | College Ave from the north (Berkeley) | 9.0 | SR-24 then Claremont Avenue then College Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 5.0 | SR-24 then Claremont Avenue then College Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 5.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Ashby Ave from the west (Emeryville and I-80) | 4.0 | none near the study area |
| West Oakland to the southwest (Adeline St, Market St) | Claremont Ave and Tunnel Rd toward the hills | 4.0 | Claremont Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 3.0 | Telegraph Avenue |
| Telegraph Ave to the south (downtown Oakland) | Claremont Ave and Tunnel Rd toward the hills | 3.0 | Claremont Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Alcatraz Ave from the west (Emeryville side) | 2.0 | none near the study area |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Emeryville and West Oakland streets (55th to 67th Streets) | 2.0 | SR-24 |
| Claremont Ave and Tunnel Rd toward the hills | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 1.0 | Claremont Avenue then Alcatraz Avenue |
| College Ave from the north (Berkeley) | San Pablo Ave (Emeryville and West Oakland) | 1.0 | College Avenue then Alcatraz Avenue |
| other pairs | | 7.0 | |

By the arterial these cars would otherwise use: SR-24 18 veh/h; SR-24 then Claremont Avenue then College Avenue 14 veh/h; Telegraph Avenue 10 veh/h; none near the study area 8 veh/h; Claremont Avenue 7 veh/h; Claremont Avenue then Alcatraz Avenue 1 veh/h.

### Hillegass Avenue SB

Observed (PM): 178 cars entered at the top (76 turned in from Alcatraz Ave west, 98 from the east, 4 came straight from the north), 79 drove the whole street, and 68% of the block's trips (109 veh/h) went to a freeway. ASSUMPTION: freeway-bound cars that did not join mid-street are 87 veh/h (109 x 178 / (178 + 44)), half of the 174 turn-ins; low = the whole-street share of the turn-ins (0.45), high = the freeway-bound share without the mid-street correction (0.63).

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Telegraph Ave, Alcatraz Ave west and West Berkeley traffic turning off Alcatraz Ave onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (76 turn-ins x 0.50) | 38 (34 to 48) | 25 | below |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (98 turn-ins x 0.50) | 49 (44 to 62) | 34 | below |
| Intents listed, together | | 87 (78 to 110) | 59 | |
| Other through cars (no intent listed) | | | 11 | |

Model through cars by origin and destination group (largest 12 of 11 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 25.0 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 16.0 | Claremont Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 8.0 | Claremont Avenue then SR-24 |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 7.0 | College Avenue then Claremont Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 6.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 3.0 | Claremont Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 1.0 | Alcatraz Avenue then Claremont Avenue |
| Claremont Ave and Tunnel Rd toward the hills | West Oakland to the southwest (Adeline St, Market St) | 1.0 | Claremont Avenue |
| Berkeley hills to the northeast (Evergreen Ln, Gravatt Dr) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 1.0 | Claremont Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | San Pablo Ave (Emeryville and West Oakland) | 1.0 | College Avenue then Alcatraz Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Claremont Ave and Tunnel Rd toward the hills | 1.0 | Claremont Avenue |

By the arterial these cars would otherwise use: Telegraph Avenue 31 veh/h; Claremont Avenue then SR-24 24 veh/h; College Avenue then Claremont Avenue then SR-24 7 veh/h; Claremont Avenue 6 veh/h; Alcatraz Avenue then Claremont Avenue 1 veh/h; College Avenue then Alcatraz Avenue 1 veh/h.

### Colby Street SB

Observed (PM): 139 cars entered at the top (76 from Alcatraz Ave west, 50 from the east, 13 from the north), 39 drove the whole street, 45% of the block's trips (72 veh/h) went to a freeway and 22% came by way of Telegraph Ave. ASSUMPTION: freeway-bound cars that did not join mid-street are 46 veh/h (72 x 139 / (139 + 79)), 0.365 of the 126 turn-ins; low = the whole-street share (0.31), high = the unadjusted freeway share (0.57). The Telegraph Ave cars are the 22% x 160 = 35 of the 76 west turn-ins.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Southbound Telegraph Ave traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (35 Telegraph Ave cars x 0.365) | 13 (11 to 20) | 13 | within |
| Alcatraz Ave west, Ashby Ave and West Berkeley traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (41 other west turn-ins x 0.365) | 15 (13 to 23) | 11 | below |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (50 east turn-ins x 0.365) | 18 (15 to 29) | 20 | within |
| Intents listed, together | | 46 (39 to 72) | 44 | |
| Other through cars (no intent listed) | | | 21 | |

Model through cars by origin and destination group (largest 12 of 17 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 13.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 11.0 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 11.0 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 6.0 | Claremont Avenue then SR-24 |
| Shattuck Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 5.0 | none near the study area |
| Ashby Ave from the west (Emeryville and I-80) | SR-13 Warren Freeway (via SR-24 east) | 4.0 | SR-24 |
| Ashby Ave from the west (Emeryville and I-80) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 2.0 | SR-24 |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 2.0 | College Avenue then Claremont Avenue then SR-24 |
| Telegraph Ave from the north (Berkeley) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 2.0 | none near the study area |
| Emeryville and West Oakland streets (55th to 67th Streets) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 2.0 | Alcatraz Avenue then College Avenue |
| Alcatraz Ave from the west (Emeryville side) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 1.0 | Alcatraz Avenue then College Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 1.0 | Claremont Avenue |
| other pairs | | 5.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 35 veh/h; none near the study area 9 veh/h; Claremont Avenue then SR-24 6 veh/h; SR-24 6 veh/h; Alcatraz Avenue then College Avenue 3 veh/h; Claremont Avenue 3 veh/h.

### Study area, all residential and service streets

Model: 396 through cars per hour.

Model through cars by origin and destination group (largest 12 of 52 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 42.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 30.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 30.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 26.0 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 19.0 | Claremont Avenue then SR-24 |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Alcatraz Ave from the west (Emeryville side) | 18.0 | none near the study area |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 18.0 | SR-24 |
| West Oakland to the southwest (Adeline St, Market St) | Claremont Ave and Tunnel Rd toward the hills | 16.0 | Claremont Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 15.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 14.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Ashby Ave from the west (Emeryville and I-80) | 13.0 | none near the study area |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave to the south (downtown Oakland) | 12.0 | Claremont Avenue |
| other pairs | | 143.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 183 veh/h; Claremont Avenue 59 veh/h; none near the study area 49 veh/h; SR-24 26 veh/h; Claremont Avenue then SR-24 19 veh/h; Alcatraz Avenue then Claremont Avenue 12 veh/h.

By origin group: South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 90; SR-24 eastbound off-ramps (arriving from Oakland and I-980) 74; Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 61; Telegraph Ave from the north (Berkeley) 44; Claremont Ave and Tunnel Rd toward the hills 24; West Oakland to the southwest (Adeline St, Market St) 24; Emeryville and West Oakland streets (55th to 67th Streets) 16; Telegraph Ave to the south (downtown Oakland) 15; SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) 12; College Ave from the north (Berkeley) 10.

By destination group: SR-24 westbound on-ramps (toward Oakland and I-980) 107; Telegraph Ave from the north (Berkeley) 54; Claremont Ave and Tunnel Rd toward the hills 50; South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 41; Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 34; Alcatraz Ave from the west (Emeryville side) 21; Ashby Ave from the west (Emeryville and I-80) 16; College Ave from the north (Berkeley) 15; West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) 12; Telegraph Ave to the south (downtown Oakland) 12.


## Select-link shares: modeled vs observed (design D5: headline = freeway shares, tolerance +/-10 pp)

- Hillegass Avenue NB: 4 links (path Claremont Avenue -> Alcatraz Avenue (434 m)), 144 trips (128 completed)
- Colby Street NB: 8 links (path Claremont Avenue -> Alcatraz Avenue (680 m)), 157 trips (143 completed)
- Hillegass Avenue SB: 4 links (path Alcatraz Avenue -> Claremont Avenue (433 m)), 107 trips (102 completed)
- Colby Street SB: 8 links (path Alcatraz Avenue -> Claremont Avenue (680 m)), 144 trips (130 completed)

| Block | Side | Via | Observed | Modeled | Diff (pp) | n trips | Headline |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue NB | from | freeway | 47% | 49% | +2 | 144 | within |
| Hillegass Avenue NB | to | Benvenue Avenue | 21% (PM 33%) | 1% | -20 | 144 |  |
| Hillegass Avenue NB | to | College Avenue | 6% | 17% | +11 | 144 |  |
| Hillegass Avenue NB | to | Alcatraz Avenue WB | 27% | 28% | +1 | 144 |  |
| Colby Street NB | from | freeway | 47% | 37% | -10 | 157 | OUTSIDE |
| Colby Street NB | to | Alcatraz Avenue WB | 48% | 64% | +16 | 157 |  |
| Colby Street NB | to | Telegraph Avenue | 25% | 39% | +14 | 157 |  |
| Colby Street NB | to | College Avenue | 3% | 5% | +2 | 157 |  |
| Hillegass Avenue SB | from | Alcatraz Avenue WB | 46% | 35% | -11 | 107 |  |
| Hillegass Avenue SB | from | Benvenue Avenue | 26% | 2% | -24 | 107 |  |
| Hillegass Avenue SB | from | College Avenue | 16% | 15% | -1 | 107 |  |
| Hillegass Avenue SB | to | freeway | 57% (PM 68%) | 72% | +15 | 107 | OUTSIDE |
| Colby Street SB | from | Alcatraz Avenue EB | 43% | 26% | -17 | 144 |  |
| Colby Street SB | from | Alcatraz Avenue WB | 46% | 19% | -27 | 144 |  |
| Colby Street SB | from | Telegraph Avenue | 22% | 22% | -0 | 144 |  |
| Colby Street SB | to | freeway | 45% | 42% | -3 | 144 | within |
| Colby Street SB | to | Forest Street | 34% | 23% | -11 | 144 |  |

Headline shares within tolerance: 2 of 4. Observed column uses the PM-peak share where one is given and the period is pm_peak. 'Via' shares are the fraction of select-link trips using that street before (from) or after (to) the block; freeway = origin / destination gate with a motorway-class link attached.

## Claremont ramps: streets used before the on-ramp / after the off-ramp

Observed shares are for traffic from/to the north only. 'Modeled' is over all trips on the ramps and any visit to the street (an upper bound for streets that serve both sides). 'Modeled, side' counts only trips whose surface end lies on the side of the ramp stated in the targets file (`freewayRamp.side`), and for a street with a qualifier ("north of X") only its links on that side of X.

| Direction | Via | Observed | Modeled | n ramp trips | Modeled, side | n side trips |
| --- | --- | --- | --- | --- | --- | --- |
| onto freeway | College Avenue | 16% | 18% | 484 | 20% | 427 |
| onto freeway | Hillegass Avenue | 12% | 14% | 484 | 15% | 427 |
| onto freeway | Martin Street | 10% | 16% | 484 | 18% | 427 |
| onto freeway | Colby Street | 8% | 9% | 484 | 11% | 427 |
| onto freeway | Telegraph Avenue north of Alcatraz Avenue | 8% | 11% | 484 | 11% | 427 |
| onto freeway | Benvenue Avenue | 5% | 4% | 484 | 4% | 427 |
| from freeway | College Avenue | 10% | 8% | 519 | 9% | 443 |
| from freeway | Martin Street | 10% | 12% | 519 | 14% | 443 |
| from freeway | Colby Street | 8% | 9% | 519 | 10% | 443 |
| from freeway | Hillegass Avenue | 5% | 8% | 519 | 9% | 443 |
| from freeway | Benvenue Avenue | 3% | 1% | 519 | 1% | 443 |

## Top 15 links by delay

| Link | Street | Class | Lanes | Len (m) | End node control | Delay (veh-h) | Stopped (veh-h) | Mean stopped veh | Flow (veh/h) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1122 | Alcatraz Avenue | Tertiary | 1 | 299 | signal | 5.06 | 3.60 | 3.6 | 426 |
| 4143 | Adeline Street | Secondary | 3 | 185 | signal | 4.32 | 2.63 | 2.6 | 586 |
| 1051 | Adeline Street | Secondary | 4 | 50 | signal | 4.09 | 3.39 | 3.4 | 613 |
| 1662 | 52nd Street | Secondary | 4 | 53 | signal | 3.72 | 2.56 | 2.6 | 947 |
| 2005 | Shattuck Avenue | Tertiary | 1 | 92 | signal | 3.43 | 2.31 | 2.3 | 702 |
| 1108 | Market Street | Secondary | 4 | 36 | signal | 3.19 | 2.89 | 2.9 | 617 |
| 769 | Martin Luther King Junior Way | Secondary | 3 | 112 | signal | 3.05 | 1.99 | 2.0 | 860 |
| 1037 | Sacramento Street | Tertiary | 3 | 40 | signal | 2.98 | 2.22 | 2.2 | 961 |
| 3463 | Tunnel Road | Primary | 2 | 52 | signal | 2.96 | 2.49 | 2.5 | 713 |
| 498 | Sacramento Street | Tertiary | 3 | 48 | signal | 2.83 | 2.08 | 2.1 | 700 |
| 535 | Ashby Avenue | Primary | 2 | 210 | signal | 2.60 | 1.36 | 1.4 | 772 |
| 108 | Stanford Avenue | Secondary | 3 | 61 | signal | 2.44 | 1.42 | 1.4 | 757 |
| 114 | San Pablo Avenue | Primary | 3 | 46 | signal | 2.40 | 1.66 | 1.7 | 604 |
| 115 | San Pablo Avenue | Primary | 3 | 54 | signal | 2.20 | 1.73 | 1.7 | 490 |
| 3344 | Domingo Avenue | Residential | 1 | 110 | signal | 2.19 | 1.40 | 1.4 | 380 |

## Top 15 nodes by blocked time

Blocked time = lane-head seconds waiting at the stop line without permission (signal red, conflict, stop sign or no downstream space).

| Node | Streets | Control | Gate | Blocked (lane-h) | of which no downstream space | Signal plan at end (cycle: greens) |
| --- | --- | --- | --- | --- | --- | --- |
| 680 | 52nd Street / Shattuck Avenue | signal |  | 4.28 | 0.01 | 110 s: 30/28/38 |
| 446 | Market Street / Stanford Avenue | signal |  | 4.11 | 0.01 | 75 s: 50/15 |
| 447 | Adeline Street / Alcatraz Avenue | signal |  | 3.58 | 0.01 | 75 s: 16/49 |
| 185 | Alcatraz Avenue / Sacramento Street | signal |  | 2.68 | 0.01 | 75 s: 36/29 |
| 30 | 57th Street / Adeline Street / Market Street | signal |  | 2.61 | 0.00 | 75 s: 30/15/15 |
| 37 | San Pablo Avenue / Stanford Avenue | signal |  | 2.48 | 0.00 | 75 s: 30/35 |
| 501 | Alcatraz Avenue / Shattuck Avenue | signal |  | 2.41 | 0.01 | 120 s: 46/64 |
| 713 | 51st Street / Telegraph Avenue | signal |  | 2.27 | 0.00 | 75 s: 38/27 |
| 1080 | 62nd Street / Claremont Avenue / College Avenue | signal |  | 2.27 | 0.00 | 75 s: 15/30/15 |
| 1069 | Claremont Avenue / Colby Street / Forest Street | signal |  | 2.23 | 0.00 | 147 s: 82/10/40 |
| 851 | Alcatraz Avenue / Telegraph Avenue | signal |  | 2.21 | 0.01 | 75 s: 40/25 |
| 944 | Ashby Avenue / Shattuck Avenue | signal |  | 2.15 | 0.00 | 75 s: 21/44 |
| 479 | Adeline Street / Martin Luther King Junior Way / Stanford Avenue | signal |  | 2.03 | 0.00 | 75 s: 18/47 |
| 17 | 45th Street / San Pablo Avenue | signal |  | 1.98 | 0.00 | 75 s: 28/37 |
| 1406 | Ashby Avenue / Claremont Avenue | signal |  | 1.89 | 0.01 | 75 s: 50/15 |

Phases of the five most blocked signals (green s: approach links with their lanes, link ids in brackets):

- node 680: 30 s: 52nd Street 4L [1662]; 28 s: 52nd Street 4L [1666], 52nd Street 4L [1662]; 38 s: Shattuck Avenue 2L [1653], Shattuck Avenue 2L [1705]
- node 446: 50 s: Stanford Avenue 1L [941], Stanford Avenue 3L [1055]; 15 s: Market Street 4L [1108], Market Street 3L [1111]
- node 447: 16 s: Adeline Street 4L [1049], Adeline Street 4L [1051]; 49 s: Alcatraz Avenue 2L [1048], Alcatraz Avenue 2L [1133]
- node 185: 36 s: Alcatraz Avenue 1L [363], Alcatraz Avenue 1L [1162]; 29 s: Sacramento Street 3L [1036], Sacramento Street 3L [1037]
- node 30: 30 s: Adeline Street 1L [747], Adeline Street 1L [1030]; 15 s: Market Street 2L [755], Market Street 2L [1113]; 15 s: 57th Street 1L [44], 57th Street 1L [1151]

## Flow on key streets (veh/h per direction, study-area links of 40 m or more)

| Street | Direction of travel | Links | Median flow | Max flow |
| --- | --- | --- | --- | --- |
| Telegraph | N | 12 | 523 | 548 |
| Telegraph | S | 10 | 420 | 430 |
| College | N | 3 | 227 | 229 |
| College | S | 3 | 416 | 419 |
| Claremont | N | 6 | 278 | 414 |
| Claremont | S | 7 | 238 | 436 |
| Alcatraz | E | 6 | 374 | 394 |
| Alcatraz | W | 6 | 217 | 289 |
| Hillegass | N | 4 | 89 | 91 |
| Hillegass | S | 4 | 66 | 77 |
| Colby | N | 7 | 70 | 102 |
| Colby | S | 7 | 65 | 78 |
| Martin | E | 2 | 113 | 113 |
| Martin | W | 2 | 82 | 82 |

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
