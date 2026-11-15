# Calibration report: rockridge pm_peak scale 1 seed 1 (60 min)

Offered demand 25105 veh/h x scale 1 = 25105 veh/h. Run took 26.7 s wall clock. Flow tables use the window after a 10 min warm-up; select-link and health figures cover the whole run from an empty network.

## Stability (design D4)

| Criterion | Threshold | Value | Result |
| --- | --- | --- | --- |
| Gridlock removals | 0 | 0 | pass |
| Backlog / spawned | < 2% | 0.0% (10 of 25412) | pass |
| Arterial mean speed (run) | > 4 m/s | 9.34 m/s (last 15 min 9.30) | pass |

Overall: **STABLE**. Mean trip delay 123 s, mean trip time 410 s, completed 24577, unroutable 0.

| t (min) | vehicles in network | backlog | completed | removals | arterial speed in interval (m/s) |
| --- | --- | --- | --- | --- | --- |
| 5 | 2835 | 8 | 2189 | 0 | 9.55 |
| 10 | 2839 | 3 | 4263 | 0 | 9.37 |
| 15 | 2969 | 4 | 6232 | 0 | 9.48 |
| 20 | 3065 | 5 | 8283 | 0 | 9.24 |
| 25 | 2979 | 7 | 10447 | 0 | 9.25 |
| 30 | 3194 | 6 | 12413 | 0 | 9.37 |
| 35 | 3267 | 7 | 14463 | 0 | 9.20 |
| 40 | 3259 | 7 | 16495 | 0 | 9.38 |
| 45 | 3315 | 4 | 18508 | 0 | 9.38 |
| 50 | 3455 | 2 | 20473 | 0 | 9.37 |
| 55 | 3599 | 4 | 22561 | 0 | 9.31 |
| 60 | 3776 | 10 | 24577 | 0 | 9.23 |
## Wandering (completed car trips)

Detour ratio = distance driven (link and movement lengths) over the shortest network distance from the trip's origin to its destination. Detour against the free-flow route uses the time-shortest route with no congestion and no noise, which is what a purposeful driver without live information would follow (it differs from the shortest distance when a faster, longer road exists). A switch is a change of the remaining route while en route. Loops: the same link twice or the same node three or more times. Reversals: a link followed by its reverse within 200 m. 'Study-area vehicle-miles' are miles driven on links inside the study area; the last column is the share of them driven by trips with a detour ratio above 1.3. Guided drivers re-evaluate their route every epoch; the others keep their departure route unless it is blocked.

| Trips | n | Switches per trip | With a switch | Mean detour | Median detour | Detour > 1.3 | Detour > 2 | Mean detour vs free-flow route | Vs free-flow route > 1.3 | Loops | Reversals | Study veh-miles | Of them by detour > 1.3 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| all trips | 22444 | 0.01 | 0.5% | 1.084 | 1.047 | 4.1% | 0.0% | 1.024 | 1.2% | 0.0% | 5.0% | 2309 | 6.9% |
| gate to gate | 7918 | 0.01 | 0.8% | 1.081 | 1.048 | 2.7% | 0.0% | 1.021 | 0.6% | 0.0% | 8.0% | 503 | 7.2% |
| with a local end | 14526 | 0.00 | 0.4% | 1.085 | 1.047 | 4.9% | 0.0% | 1.026 | 1.5% | 0.0% | 3.4% | 1806 | 6.9% |
| guided drivers | 10255 | 0.01 | 1.2% | 1.084 | 1.046 | 4.2% | 0.0% | 1.024 | 1.2% | 0.0% | 5.1% | 1064 | 6.9% |
| other drivers | 12189 | 0.00 | 0.0% | 1.084 | 1.048 | 4.0% | 0.0% | 1.025 | 1.2% | 0.0% | 4.9% | 1245 | 7.0% |

## Reported patterns (diagnostics; configured in the targets file under `patterns`)

(a) Trips between the surface gates on the north side of the ramps and the freeway mainline gates, and the local-street (residential and service links in the study area) vehicle-miles they drive. Share = of all completed trips' local-street vehicle-miles (420 miles). No observed counterpart exists for this quantity (the targets file has only the select-link shares above).

| Trips | n trips | Local-street veh-miles | Share of all local-street veh-miles |
| --- | --- | --- | --- |
| surface gates to the freeway | 1607 | 28.5 | 7% |
| freeway to the surface gates | 1097 | 39.0 | 9% |

(b) Corridor trips: completed trips from beyond one end of the corridor's study-area extent (the bypass street and its arterial together) to beyond the other end, within a lateral limit of the corridor, by direction. 'Bypass' = at least N blocks (links) on the bypass street; 'arterial' = fewer bypass blocks and at least N on the arterial; 'other' = neither (another street, the freeway or a short use); blocks are counted on the corridor's study-area links. No observed counterpart exists for these shares. The related observed values are in the select-link table above: northbound Hillegass Ave traffic rarely ends on College Ave (6%), 21 to 33% jogs to Benvenue Ave, and southbound freeway-bound drivers on College Ave commonly arrive via Ashby Ave and Benvenue Ave and jog to Hillegass Ave.

| Bypass | Arterial | N | Direction | Corridor trips | Bypass | Arterial | Other | Mean bypass blocks |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue | College Avenue | 3 | N | 1359 | 3% | 15% | 82% | 0.1 |
| Hillegass Avenue | College Avenue | 3 | S | 1577 | 4% | 23% | 73% | 0.2 |

## Per-mode results

Offered: 25105 car veh/h; 626 bicycle flows (764/h); 2000 pedestrian flows (1731/h). Bicycle and pedestrian volumes are assumptions, not counts.

| Mode | In network | Completed | Mean time (s) | Other |
| --- | --- | --- | --- | --- |
| Car | 3776 | 24577 | 410 | |
| Bicycle | 61 | 791 | 266 | |
| Pedestrian | 199 | 1668 | 433 | mean crossing delay 8.4 s |

Vulnerable road users (surrogate indicators): pedestrian conflicts 328, bicycle conflicts 506, close passes 741, pedestrian injury-risk index 0.048, bicycle injury-risk index 0.071 (proxy), mean vehicle speed at pedestrian encounters 2.45 m/s.


## Through cars on the counted blocks (a car is through when neither trip end is in the study area)

Observed through range = from the cars that drove the whole street (volunteer count, a lower bound) to the block volume less the cars whose trip ends along the street (an upper bound). Observed freeway-end trips = observed block volume times the observed freeway share of the street (the headline share of the targets file); these include freeway trips that end inside the study area, so they are not an expected through count. Modeled through = select-link trips with no end in the study area, per hour. Modeled freeway = select-link trips from or to a freeway node, per hour.

| Block | Observed volume (veh/h) | Observed freeway share | Observed freeway-end trips (veh/h) | Observed through range (veh/h) | Modeled through (veh/h) | In range | Modeled freeway trips (veh/h) |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue NB | 110 | 47.0% | 52 | 48 to 95 | 69 | yes | 124 |
| Colby Street NB | 174 | 47.0% | 82 | 102 to 145 | 142 | yes | 138 |
| Hillegass Avenue SB | 160 | 68.0% | 109 | 79 to 120 | 102 | yes | 135 |
| Colby Street SB | 160 | 45.0% | 72 | 39 to 117 | 98 | yes | 96 |

## Intent map: through cars by where they come from and where they are going

Through = neither trip end is in the study area. Groups are the approach groups of the area config (data/areas); a node that is not a gate takes the group of the nearest surface gate (ASSUMPTION). The arterial is the one a trip would use on the shortest free-flow path with the study area's residential and service streets closed, where that path runs on a boundary street near the study area.

Model figures are the mean of 1 seed(s), per hour of the run. Basis: OBSERVED = read from the resident volunteer count of Feb 25, 2025 or its headline shares; ASSUMPTION = inferred from those numbers or chosen.

### Colby Street NB

Observed: block volume 174 veh/h, whole-street cars 102, so through cars 102 to 145 veh/h. Model: 142 through cars per hour.

Observed (PM): 182 cars entered at the south end, 102 drove the whole street, 164 left it at Alcatraz Ave (131 left, 32 right, 1 straight), and 47% of the block's trips came from a freeway (the headline share). ASSUMPTION: freeway-origin cars that do not end along the street are 65 veh/h (the 82 freeway-origin trips on the block, 47% of 174, times the 182 / (182 + 47) of its cars that entered at the south end rather than joining on the way), spread over the 164 exits in proportion (0.40); the other through cars come from the Telegraph Ave and south-side approaches that feed the street's south end. Ranges: low = 131 (32) x 0.47 x 0.62 (the whole-street share of exits), high = 131 (32) x 0.47.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | OBSERVED turn count x ASSUMPTION share (131 left turns x 0.40) | 52 (38 to 62) | 65 | above |
| Telegraph Ave and south-side traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | ASSUMPTION: the through left-turners (131 x 0.62 = 81) that are not off-ramp traffic | 29 (19 to 43) | 39 | within |
| SR-24 off-ramp traffic using Colby St to reach College Ave and Berkeley (right at Alcatraz Ave) | OBSERVED turn count x ASSUMPTION share (32 right turns x 0.40) | 13 (9 to 15) | 22 | above |
| Telegraph Ave and south-side traffic using Colby St to reach College Ave and Berkeley | ASSUMPTION: the through right-turners (32 x 0.62 = 20) that are not off-ramp traffic | 7 (5 to 11) | 14 | above |
| Intents listed, together | | 101 (71 to 131) | 140 | |
| Other through cars (no intent listed) | | | 2 | |

Model through cars by origin and destination group (largest 12 of 15 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 65.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 18.0 | Claremont Avenue then College Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 10.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Emeryville and West Oakland streets (55th to 67th Streets) | 9.0 | Claremont Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 9.0 | SR-24 |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 8.0 | Telegraph Avenue |
| Telegraph Ave to the south (downtown Oakland) | Telegraph Ave from the north (Berkeley) | 6.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Ashby Ave from the west (Emeryville and I-80) | 4.0 | none near the study area |
| West Oakland to the southwest (Adeline St, Market St) | Claremont Ave and Tunnel Rd toward the hills | 4.0 | Claremont Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | College Ave from the north (Berkeley) | 3.0 | SR-24 then Claremont Avenue then College Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Telegraph Ave from the north (Berkeley) | 2.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | San Pablo Ave (Emeryville and West Oakland) | 1.0 | College Avenue then Alcatraz Avenue |
| other pairs | | 3.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 92 veh/h; Claremont Avenue then College Avenue 18 veh/h; Claremont Avenue 14 veh/h; SR-24 9 veh/h; none near the study area 4 veh/h; SR-24 then Claremont Avenue then College Avenue 3 veh/h.

### Hillegass Avenue NB

Observed: block volume 110 veh/h, whole-street cars 48, so through cars 48 to 95 veh/h. Model: 69 through cars per hour.

Observed (PM): 94 cars entered at the south end, 48 drove the whole street, 109 left it at Alcatraz Ave (43 west, 54 east, 12 straight), and 47% of the block's trips came from a freeway. ASSUMPTION: freeway-origin through cars are 40 veh/h (52 freeway-origin trips times 94 / (94 + 29)), spread over the exits in proportion (0.37); the through share of exits is 48 / 109 = 0.44.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Hillegass Ave to reach Alcatraz Ave west and Telegraph Ave north | OBSERVED turn count x ASSUMPTION share (43 left turns x 0.37) | 16 (9 to 20) | 20 | within |
| SR-24 off-ramp traffic using Hillegass Ave to reach College Ave and Berkeley | OBSERVED turn count x ASSUMPTION share (54 right turns x 0.37) | 20 (11 to 25) | 27 | above |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach Alcatraz Ave west | ASSUMPTION: through exits (43 x 0.44) that are not off-ramp traffic | 3 (0 to 10) | 6 | within |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach College Ave and Berkeley | ASSUMPTION: through exits (54 x 0.44) that are not off-ramp traffic | 4 (0 to 13) | 13 | within |
| Intents listed, together | | 43 (20 to 68) | 66 | |
| Other through cars (no intent listed) | | | 3 | |

Model through cars by origin and destination group (largest 12 of 20 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 15.0 | SR-24 |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 9.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | College Ave from the north (Berkeley) | 8.0 | SR-24 then Claremont Avenue then College Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 4.0 | Telegraph Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Ashby Ave from the west (Emeryville and I-80) | 4.0 | SR-24 then Telegraph Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | San Pablo Ave (Emeryville and West Oakland) | 4.0 | SR-24 |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 4.0 | SR-24 then Claremont Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Claremont Ave and Tunnel Rd toward the hills | 3.0 | Claremont Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Telegraph Ave from the north (Berkeley) | 3.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | San Pablo Ave (Emeryville and West Oakland) | 2.0 | none near the study area |
| West Oakland to the southwest (Adeline St, Market St) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 2.0 | Claremont Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Alcatraz Ave from the west (Emeryville side) | 2.0 | SR-24 then Telegraph Avenue |
| other pairs | | 9.0 | |

By the arterial these cars would otherwise use: SR-24 20 veh/h; Telegraph Avenue 18 veh/h; SR-24 then Claremont Avenue then College Avenue 8 veh/h; Claremont Avenue 7 veh/h; SR-24 then Telegraph Avenue 6 veh/h; SR-24 then Claremont Avenue 4 veh/h.

### Hillegass Avenue SB

Observed: block volume 160 veh/h, whole-street cars 79, so through cars 79 to 120 veh/h. Model: 102 through cars per hour.

Observed (PM): 178 cars entered at the top (76 turned in from Alcatraz Ave west, 98 from the east, 4 came straight from the north), 79 drove the whole street, and 68% of the block's trips (109 veh/h) went to a freeway. ASSUMPTION: freeway-bound cars that did not join mid-street are 87 veh/h (109 x 178 / (178 + 44)), half of the 174 turn-ins; low = the whole-street share of the turn-ins (0.45), high = the freeway-bound share without the mid-street correction (0.63).

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Telegraph Ave, Alcatraz Ave west and West Berkeley traffic turning off Alcatraz Ave onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (76 turn-ins x 0.50) | 38 (34 to 48) | 39 | within |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (98 turn-ins x 0.50) | 49 (44 to 62) | 49 | within |
| Intents listed, together | | 87 (78 to 110) | 88 | |
| Other through cars (no intent listed) | | | 14 | |

Model through cars by origin and destination group (largest 12 of 12 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 39.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 27.0 | Telegraph Avenue |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 12.0 | College Avenue then Claremont Avenue then SR-24 |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 8.0 | Claremont Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 5.0 | Telegraph Avenue |
| West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 3.0 | College Avenue |
| Ashby Ave from the west (Emeryville and I-80) | College Ave from the north (Berkeley) | 2.0 | Alcatraz Avenue then College Avenue |
| Telegraph Ave from the north (Berkeley) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 2.0 | College Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Berkeley hills to the northeast (Evergreen Ln, Gravatt Dr) | 1.0 | none near the study area |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 1.0 | Claremont Avenue |
| Claremont Ave and Tunnel Rd toward the hills | Telegraph Ave to the south (downtown Oakland) | 1.0 | Claremont Avenue |
| Berkeley hills to the northeast (Evergreen Ln, Gravatt Dr) | SR-24 westbound on-ramps (toward Oakland and I-980) | 1.0 | SR-24 |

By the arterial these cars would otherwise use: Telegraph Avenue 71 veh/h; College Avenue then Claremont Avenue then SR-24 12 veh/h; Claremont Avenue then SR-24 8 veh/h; College Avenue 5 veh/h; Alcatraz Avenue then College Avenue 2 veh/h; Claremont Avenue 2 veh/h.

### Colby Street SB

Observed: block volume 160 veh/h, whole-street cars 39, so through cars 39 to 117 veh/h. Model: 98 through cars per hour.

Observed (PM): 139 cars entered at the top (76 from Alcatraz Ave west, 50 from the east, 13 from the north), 39 drove the whole street, 45% of the block's trips (72 veh/h) went to a freeway and 22% came by way of Telegraph Ave. ASSUMPTION: freeway-bound cars that did not join mid-street are 46 veh/h (72 x 139 / (139 + 79)), 0.365 of the 126 turn-ins; low = the whole-street share (0.31), high = the unadjusted freeway share (0.57). The Telegraph Ave cars are the 22% x 160 = 35 of the 76 west turn-ins.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Southbound Telegraph Ave traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (35 Telegraph Ave cars x 0.365) | 13 (11 to 20) | 11 | within |
| Alcatraz Ave west, Ashby Ave and West Berkeley traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (41 other west turn-ins x 0.365) | 15 (13 to 23) | 12 | below |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (50 east turn-ins x 0.365) | 18 (15 to 29) | 32 | above |
| Intents listed, together | | 46 (39 to 72) | 55 | |
| Other through cars (no intent listed) | | | 43 | |

Model through cars by origin and destination group (largest 12 of 20 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 27.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 18.0 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 12.0 | Claremont Avenue then SR-24 |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 9.0 | Telegraph Avenue |
| Shattuck Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 6.0 | none near the study area |
| Ashby Ave from the west (Emeryville and I-80) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 4.0 | SR-24 |
| Ashby Ave from the west (Emeryville and I-80) | College Ave from the north (Berkeley) | 2.0 | Alcatraz Avenue then College Avenue |
| Ashby Ave from the west (Emeryville and I-80) | SR-13 Warren Freeway (via SR-24 east) | 2.0 | SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | West Oakland to the southwest (Adeline St, Market St) | 2.0 | Telegraph Avenue |
| West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 2.0 | College Avenue |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 2.0 | College Avenue then Claremont Avenue then SR-24 |
| Telegraph Ave from the north (Berkeley) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 2.0 | Telegraph Avenue |
| other pairs | | 10.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 60 veh/h; Claremont Avenue then SR-24 12 veh/h; none near the study area 12 veh/h; SR-24 6 veh/h; Alcatraz Avenue then College Avenue 2 veh/h; Claremont Avenue 2 veh/h.

### Study area, all residential and service streets

Model: 616 through cars per hour.

Model through cars by origin and destination group (largest 12 of 57 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 74.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 72.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 49.0 | Claremont Avenue then College Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 48.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 43.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Emeryville and West Oakland streets (55th to 67th Streets) | 37.0 | Claremont Avenue |
| West Oakland to the southwest (Adeline St, Market St) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 28.0 | Telegraph Avenue then Claremont Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 23.0 | SR-24 |
| Emeryville and West Oakland streets (55th to 67th Streets) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 21.0 | none near the study area |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 20.0 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 19.0 | Claremont Avenue then SR-24 |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 19.0 | Telegraph Avenue |
| other pairs | | 163.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 323 veh/h; Claremont Avenue 69 veh/h; Claremont Avenue then College Avenue 49 veh/h; none near the study area 41 veh/h; SR-24 37 veh/h; Telegraph Avenue then Claremont Avenue 28 veh/h.

By origin group: SR-24 eastbound off-ramps (arriving from Oakland and I-980) 129; Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 125; South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 125; Telegraph Ave from the north (Berkeley) 63; West Oakland to the southwest (Adeline St, Market St) 47; Telegraph Ave to the south (downtown Oakland) 24; Claremont Ave and Tunnel Rd toward the hills 22; Emeryville and West Oakland streets (55th to 67th Streets) 22; College Ave from the north (Berkeley) 14; Ashby Ave from the west (Emeryville and I-80) 11.

By destination group: SR-24 westbound on-ramps (toward Oakland and I-980) 171; Telegraph Ave from the north (Berkeley) 134; South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 106; Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 54; Claremont Ave and Tunnel Rd toward the hills 40; Emeryville and West Oakland streets (55th to 67th Streets) 38; College Ave from the north (Berkeley) 17; Shattuck Ave from the north (Berkeley) 12; San Pablo Ave (Emeryville and West Oakland) 11; Ashby Ave from the west (Emeryville and I-80) 10.


## Through cars by intent (cut-through intent view)

A through car is tallied once, under the first intent whose origin and destination groups hold its trip ends, at the moment the through count counts it. Cars an hour over the run, the same window as the through-car figure (621 an hour).

| Intent | Basis | Cars an hour | Share |
| --- | --- | --- | --- |
| Berkeley and College Ave traffic using Hillegass Ave, Colby St and nearby side streets to reach the SR-24 on-ramps | observed | 94 | 15% |
| Southbound Telegraph Ave and west-side traffic turning off Alcatraz Ave onto Colby St or Hillegass Ave to reach the SR-24 on-ramps | observed | 56 | 9% |
| SR-24 off-ramp traffic using Colby St, Hillegass Ave and nearby side streets to reach Berkeley and Telegraph Ave north | observed | 109 | 18% |
| SR-24 off-ramp traffic using side streets to reach Alcatraz Ave west, Ashby Ave and Claremont Ave toward the hills | assumed | 33 | 5% |
| Downtown, south and west Oakland traffic using side streets to reach Berkeley and Telegraph Ave north | assumed | 99 | 16% |
| Berkeley and Telegraph Ave north traffic using side streets to reach downtown, south and west Oakland | assumed | 59 | 10% |
| Oakland cross-town traffic (West Oakland, Broadway, Piedmont, Emeryville) using side streets near Claremont Ave and Telegraph Ave | assumed | 85 | 14% |
| Claremont Ave, hills and south Oakland traffic using side streets to reach the SR-24 on-ramps | assumed | 32 | 5% |
| Other (no intent listed) |  | 54 | 9% |

Intents listed cover 91% of through cars.


## Select-link shares: modeled vs observed (design D5: headline = freeway shares, tolerance +/-10 pp)

- Hillegass Avenue NB: 4 links (path Claremont Avenue -> Alcatraz Avenue (434 m)), 221 trips (193 completed)
- Colby Street NB: 8 links (path Claremont Avenue -> Alcatraz Avenue (680 m)), 292 trips (270 completed)
- Hillegass Avenue SB: 4 links (path Alcatraz Avenue -> Claremont Avenue (433 m)), 192 trips (176 completed)
- Colby Street SB: 8 links (path Alcatraz Avenue -> Claremont Avenue (680 m)), 242 trips (227 completed)

| Block | Side | Via | Observed | Modeled | Diff (pp) | n trips | Headline |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue NB | from | freeway | 47% | 52% | +5 | 221 | within |
| Hillegass Avenue NB | to | Benvenue Avenue | 21% (PM 33%) | 2% | -31 | 221 |  |
| Hillegass Avenue NB | to | College Avenue | 6% | 18% | +12 | 221 |  |
| Hillegass Avenue NB | to | Alcatraz Avenue WB | 27% | 28% | +1 | 221 |  |
| Colby Street NB | from | freeway | 47% | 45% | -2 | 292 | within |
| Colby Street NB | to | Alcatraz Avenue WB | 48% | 46% | -2 | 292 |  |
| Colby Street NB | to | Telegraph Avenue | 25% | 39% | +14 | 292 |  |
| Colby Street NB | to | College Avenue | 3% | 5% | +2 | 292 |  |
| Hillegass Avenue SB | from | Alcatraz Avenue WB | 46% | 26% | -20 | 192 |  |
| Hillegass Avenue SB | from | Benvenue Avenue | 26% | 7% | -19 | 192 |  |
| Hillegass Avenue SB | from | College Avenue | 16% | 19% | +3 | 192 |  |
| Hillegass Avenue SB | to | freeway | 57% (PM 68%) | 67% | -1 | 192 | within |
| Colby Street SB | from | Alcatraz Avenue EB | 43% | 20% | -23 | 242 |  |
| Colby Street SB | from | Alcatraz Avenue WB | 46% | 15% | -31 | 242 |  |
| Colby Street SB | from | Telegraph Avenue | 22% | 17% | -5 | 242 |  |
| Colby Street SB | to | freeway | 45% | 40% | -5 | 242 | within |
| Colby Street SB | to | Forest Street | 34% | 21% | -13 | 242 |  |

Headline shares within tolerance: 4 of 4. Observed column uses the PM-peak share where one is given and the period is pm_peak. 'Via' shares are the fraction of select-link trips using that street before (from) or after (to) the block; freeway = origin / destination gate with a motorway-class link attached.

## Claremont ramps: streets used before the on-ramp / after the off-ramp

Observed shares are for traffic from/to the north only. 'Modeled' is over all trips on the ramps and any visit to the street (an upper bound for streets that serve both sides). 'Modeled, side' counts only trips whose surface end lies on the side of the ramp stated in the targets file (`freewayRamp.side`), and for a street with a qualifier ("north of X") only its links on that side of X.

| Direction | Via | Observed | Modeled | n ramp trips | Modeled, side | n side trips |
| --- | --- | --- | --- | --- | --- | --- |
| onto freeway | College Avenue | 16% | 15% | 790 | 16% | 711 |
| onto freeway | Hillegass Avenue | 12% | 13% | 790 | 15% | 711 |
| onto freeway | Martin Street | 10% | 12% | 790 | 12% | 711 |
| onto freeway | Colby Street | 8% | 9% | 790 | 10% | 711 |
| onto freeway | Telegraph Avenue north of Alcatraz Avenue | 8% | 13% | 790 | 10% | 711 |
| onto freeway | Benvenue Avenue | 5% | 3% | 790 | 3% | 711 |
| from freeway | College Avenue | 10% | 10% | 767 | 10% | 734 |
| from freeway | Martin Street | 10% | 10% | 767 | 11% | 734 |
| from freeway | Colby Street | 8% | 14% | 767 | 15% | 734 |
| from freeway | Hillegass Avenue | 5% | 6% | 767 | 6% | 734 |
| from freeway | Benvenue Avenue | 3% | 2% | 767 | 2% | 734 |

## Top 15 links by delay

| Link | Street | Class | Lanes | Len (m) | End node control | Delay (veh-h) | Stopped (veh-h) | Mean stopped veh | Flow (veh/h) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 4143 | Adeline Street | Secondary | 3 | 185 | signal | 18.70 | 15.26 | 15.3 | 490 |
| 1025 | Martin Luther King Junior Way | Secondary | 3 | 79 | signal | 9.54 | 8.08 | 8.1 | 751 |
| 4397 | Ashby Avenue | Primary | 2 | 96 | signal | 8.70 | 5.75 | 5.7 | 990 |
| 1122 | Alcatraz Avenue | Tertiary | 1 | 299 | signal | 6.84 | 4.51 | 4.5 | 475 |
| 769 | Martin Luther King Junior Way | Secondary | 3 | 112 | signal | 6.36 | 3.87 | 3.9 | 1508 |
| 4382 | Warren Freeway | Motorway | 2 | 744 | uncontrolled | 5.86 | 1.04 | 1.0 | 1142 |
| 1051 | Adeline Street | Secondary | 4 | 50 | signal | 5.26 | 4.10 | 4.1 | 1199 |
| 2819 | College Avenue | Tertiary | 2 | 50 | signal | 5.18 | 4.02 | 4.0 | 858 |
| 3344 | Domingo Avenue | Residential | 1 | 110 | signal | 5.13 | 4.07 | 4.1 | 317 |
| 3395 | Ashby Avenue | Primary | 1 | 129 | signal | 4.95 | 2.54 | 2.5 | 936 |
| 1108 | Market Street | Secondary | 4 | 36 | signal | 4.81 | 4.23 | 4.2 | 1018 |
| 1037 | Sacramento Street | Tertiary | 3 | 40 | signal | 4.74 | 3.67 | 3.7 | 1294 |
| 115 | San Pablo Avenue | Primary | 3 | 54 | signal | 4.67 | 3.56 | 3.6 | 736 |
| 1662 | 52nd Street | Secondary | 4 | 53 | signal | 4.64 | 3.18 | 3.2 | 1228 |
| 2008 | Shattuck Avenue | Tertiary | 1 | 93 | signal | 4.55 | 3.55 | 3.6 | 472 |

## Top 15 nodes by blocked time

Blocked time = lane-head seconds waiting at the stop line without permission (signal red, conflict, stop sign or no downstream space).

| Node | Streets | Control | Gate | Blocked (lane-h) | of which no downstream space | Signal plan at end (cycle: greens) |
| --- | --- | --- | --- | --- | --- | --- |
| 446 | Market Street / Stanford Avenue | signal |  | 5.74 | 0.09 | 80 s: 54/16 |
| 680 | 52nd Street / Shattuck Avenue | signal |  | 4.99 | 0.01 | 110 s: 30/28/38 |
| 447 | Adeline Street / Alcatraz Avenue | signal |  | 3.97 | 0.12 | 75 s: 35/30 |
| 1080 | 62nd Street / Claremont Avenue / College Avenue | signal |  | 3.72 | 0.08 | 75 s: 15/30/15 |
| 479 | Adeline Street / Martin Luther King Junior Way / Stanford Avenue | signal |  | 3.68 | 0.00 | 80 s: 18/52 |
| 185 | Alcatraz Avenue / Sacramento Street | signal |  | 3.53 | 0.03 | 75 s: 33/32 |
| 30 | 57th Street / Adeline Street / Market Street | signal |  | 3.39 | 0.02 | 75 s: 17/28/15 |
| 37 | San Pablo Avenue / Stanford Avenue | signal |  | 3.33 | 0.00 | 75 s: 28/37 |
| 713 | 51st Street / Telegraph Avenue | signal |  | 3.00 | 0.00 | 75 s: 34/31 |
| 851 | Alcatraz Avenue / Telegraph Avenue | signal |  | 2.85 | 0.03 | 75 s: 41/24 |
| 944 | Ashby Avenue / Shattuck Avenue | signal |  | 2.82 | 0.00 | 75 s: 41/24 |
| 1406 | Ashby Avenue / Claremont Avenue | signal |  | 2.75 | 0.02 | 75 s: 50/15 |
| 1069 | Claremont Avenue / Colby Street / Forest Street | signal |  | 2.72 | 0.00 | 79 s: 22/4/38 |
| 501 | Alcatraz Avenue / Shattuck Avenue | signal |  | 2.59 | 0.02 | 75 s: 26/39 |
| 242 | Ashby Avenue / Martin Luther King Junior Way | signal |  | 2.57 | 0.00 | 75 s: 42/23 |

Phases of the five most blocked signals (green s: approach links with their lanes, link ids in brackets):

- node 446: 54 s: Stanford Avenue 1L [941], Stanford Avenue 3L [1055]; 16 s: Market Street 4L [1108], Market Street 3L [1111]
- node 680: 30 s: 52nd Street 4L [1662]; 28 s: 52nd Street 4L [1666], 52nd Street 4L [1662]; 38 s: Shattuck Avenue 2L [1653], Shattuck Avenue 2L [1705]
- node 447: 35 s: Adeline Street 4L [1049], Adeline Street 4L [1051]; 30 s: Alcatraz Avenue 2L [1048], Alcatraz Avenue 2L [1133]
- node 1080: 15 s: Claremont Avenue 2L [2756], Claremont Avenue 2L [2798]; 30 s: College Avenue 2L [2761], College Avenue 2L [2819]; 15 s: 62nd Street 1L [2622]
- node 479: 18 s: Martin Luther King Junior Way 3L [1025], Adeline Street 3L [4143]; 52 s: Stanford Avenue 1L [4139]

## Entry backlog by origin node at end of run (top 10)

| Node | Streets | Trips waiting | Offered veh/h (before scale) |
| --- | --- | --- | --- |
| 1080 | 62nd Street / Claremont Avenue / College Avenue | 3 | 142 |
| 1430 | Claremont Avenue / Russell Street | 3 | 32 |
| 924 | Ashby Avenue / Regent Street | 2 | 40 |
| 1089 | 63rd Street / College Avenue | 1 | 342 |
| 1232 | Ashby Avenue / Claremont Crescent | 1 | 31 |

## Flow on key streets (veh/h per direction, study-area links of 40 m or more)

| Street | Direction of travel | Links | Median flow | Max flow |
| --- | --- | --- | --- | --- |
| Telegraph | N | 12 | 1087 | 1140 |
| Telegraph | S | 10 | 834 | 904 |
| College | N | 3 | 341 | 342 |
| College | S | 3 | 846 | 858 |
| Claremont | N | 6 | 395 | 602 |
| Claremont | S | 7 | 331 | 748 |
| Alcatraz | E | 6 | 582 | 592 |
| Alcatraz | W | 6 | 358 | 433 |
| Hillegass | N | 4 | 108 | 144 |
| Hillegass | S | 4 | 126 | 128 |
| Colby | N | 7 | 156 | 194 |
| Colby | S | 7 | 140 | 169 |
| Martin | E | 2 | 124 | 124 |
| Martin | W | 2 | 100 | 100 |

## Largest demand origins (offered, before scale)

| Node | Streets | Veh/h |
| --- | --- | --- |
| 602 | Grove Shafter Freeway | 4111 |
| 1672 | Warren Freeway | 1289 |
| 265 | Ashby Avenue | 1134 |
| 183 | San Pablo Avenue | 987 |
| 943 | Telegraph Avenue / Ward Street | 976 |
| 974 | Broadway | 808 |
| 763 | Telegraph Avenue | 636 |
| 276 | Martin Luther King Junior Way | 524 |
| 184 | Alcatraz Avenue | 460 |
| 104 | San Pablo Avenue | 382 |
