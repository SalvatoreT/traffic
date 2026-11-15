# Calibration report: rockridge pm_peak scale 1 seed 1 (60 min)

Offered demand 25105 veh/h x scale 1 = 25105 veh/h. Run took 23.4 s wall clock. Flow tables use the window after a 10 min warm-up; select-link and health figures cover the whole run from an empty network.

## Stability (design D4)

| Criterion | Threshold | Value | Result |
| --- | --- | --- | --- |
| Gridlock removals | 0 | 0 | pass |
| Backlog / spawned | < 2% | 0.0% (9 of 25413) | pass |
| Arterial mean speed (run) | > 4 m/s | 9.37 m/s (last 15 min 9.25) | pass |

Overall: **STABLE**. Mean trip delay 123 s, mean trip time 409 s, completed 24569, unroutable 0.

| t (min) | vehicles in network | backlog | completed | removals | arterial speed in interval (m/s) |
| --- | --- | --- | --- | --- | --- |
| 5 | 2840 | 7 | 2184 | 0 | 9.57 |
| 10 | 2824 | 2 | 4278 | 0 | 9.40 |
| 15 | 2955 | 4 | 6245 | 0 | 9.48 |
| 20 | 3039 | 5 | 8308 | 0 | 9.22 |
| 25 | 2987 | 7 | 10438 | 0 | 9.42 |
| 30 | 3117 | 5 | 12490 | 0 | 9.63 |
| 35 | 3217 | 6 | 14513 | 0 | 9.35 |
| 40 | 3290 | 7 | 16463 | 0 | 9.48 |
| 45 | 3374 | 2 | 18450 | 0 | 9.13 |
| 50 | 3490 | 3 | 20436 | 0 | 9.28 |
| 55 | 3588 | 4 | 22571 | 0 | 9.36 |
| 60 | 3784 | 9 | 24569 | 0 | 9.11 |
## Wandering (completed car trips)

Detour ratio = distance driven (link and movement lengths) over the shortest network distance from the trip's origin to its destination. Detour against the free-flow route uses the time-shortest route with no congestion and no noise, which is what a purposeful driver without live information would follow (it differs from the shortest distance when a faster, longer road exists). A switch is a change of the remaining route while en route. Loops: the same link twice or the same node three or more times. Reversals: a link followed by its reverse within 200 m. 'Study-area vehicle-miles' are miles driven on links inside the study area; the last column is the share of them driven by trips with a detour ratio above 1.3. Guided drivers re-evaluate their route every epoch; the others keep their departure route unless it is blocked.

| Trips | n | Switches per trip | With a switch | Mean detour | Median detour | Detour > 1.3 | Detour > 2 | Mean detour vs free-flow route | Vs free-flow route > 1.3 | Loops | Reversals | Study veh-miles | Of them by detour > 1.3 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| all trips | 22437 | 0.00 | 0.4% | 1.083 | 1.046 | 4.0% | 0.0% | 1.024 | 1.1% | 0.0% | 5.0% | 2310 | 7.1% |
| gate to gate | 7924 | 0.01 | 0.5% | 1.082 | 1.048 | 2.6% | 0.0% | 1.021 | 0.6% | 0.0% | 8.1% | 500 | 6.7% |
| with a local end | 14513 | 0.00 | 0.4% | 1.084 | 1.046 | 4.8% | 0.0% | 1.025 | 1.4% | 0.0% | 3.3% | 1809 | 7.2% |
| guided drivers | 10254 | 0.01 | 0.9% | 1.083 | 1.045 | 4.0% | 0.0% | 1.023 | 1.1% | 0.0% | 4.9% | 1072 | 6.3% |
| other drivers | 12183 | 0.00 | 0.0% | 1.084 | 1.047 | 4.1% | 0.0% | 1.024 | 1.2% | 0.0% | 5.0% | 1238 | 7.8% |

## Reported patterns (diagnostics; configured in the targets file under `patterns`)

(a) Trips between the surface gates on the north side of the ramps and the freeway mainline gates, and the local-street (residential and service links in the study area) vehicle-miles they drive. Share = of all completed trips' local-street vehicle-miles (425 miles). No observed counterpart exists for this quantity (the targets file has only the select-link shares above).

| Trips | n trips | Local-street veh-miles | Share of all local-street veh-miles |
| --- | --- | --- | --- |
| surface gates to the freeway | 1620 | 28.6 | 7% |
| freeway to the surface gates | 1097 | 37.0 | 9% |

(b) Corridor trips: completed trips from beyond one end of the corridor's study-area extent (the bypass street and its arterial together) to beyond the other end, within a lateral limit of the corridor, by direction. 'Bypass' = at least N blocks (links) on the bypass street; 'arterial' = fewer bypass blocks and at least N on the arterial; 'other' = neither (another street, the freeway or a short use); blocks are counted on the corridor's study-area links. No observed counterpart exists for these shares. The related observed values are in the select-link table above: northbound Hillegass Ave traffic rarely ends on College Ave (6%), 21 to 33% jogs to Benvenue Ave, and southbound freeway-bound drivers on College Ave commonly arrive via Ashby Ave and Benvenue Ave and jog to Hillegass Ave.

| Bypass | Arterial | N | Direction | Corridor trips | Bypass | Arterial | Other | Mean bypass blocks |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue | College Avenue | 3 | N | 1349 | 3% | 15% | 81% | 0.1 |
| Hillegass Avenue | College Avenue | 3 | S | 1571 | 4% | 25% | 71% | 0.2 |

## Per-mode results

Offered: 25105 car veh/h; 626 bicycle flows (764/h); 2000 pedestrian flows (1731/h). Bicycle and pedestrian volumes are assumptions, not counts.

| Mode | In network | Completed | Mean time (s) | Other |
| --- | --- | --- | --- | --- |
| Car | 3784 | 24569 | 409 | |
| Bicycle | 61 | 791 | 266 | |
| Pedestrian | 197 | 1670 | 433 | mean crossing delay 8.3 s |

Vulnerable road users (surrogate indicators): pedestrian conflicts 293, bicycle conflicts 499, close passes 713, pedestrian injury-risk index 0.047, bicycle injury-risk index 0.071 (proxy), mean vehicle speed at pedestrian encounters 2.40 m/s.


## Through cars on the counted blocks (a car is through when neither trip end is in the study area)

Observed through range = from the cars that drove the whole street (volunteer count, a lower bound) to the block volume less the cars whose trip ends along the street (an upper bound). Observed freeway-end trips = observed block volume times the observed freeway share of the street (the headline share of the targets file); these include freeway trips that end inside the study area, so they are not an expected through count. Modeled through = select-link trips with no end in the study area, per hour. Modeled freeway = select-link trips from or to a freeway node, per hour.

| Block | Observed volume (veh/h) | Observed freeway share | Observed freeway-end trips (veh/h) | Observed through range (veh/h) | Modeled through (veh/h) | In range | Modeled freeway trips (veh/h) |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue NB | 110 | 47.0% | 52 | 48 to 95 | 78 | yes | 130 |
| Colby Street NB | 174 | 47.0% | 82 | 102 to 145 | 134 | yes | 136 |
| Hillegass Avenue SB | 160 | 68.0% | 109 | 79 to 120 | 106 | yes | 127 |
| Colby Street SB | 160 | 45.0% | 72 | 39 to 117 | 100 | yes | 98 |

## Intent map: through cars by where they come from and where they are going

Through = neither trip end is in the study area. Groups are the approach groups of the area config (data/areas); a node that is not a gate takes the group of the nearest surface gate (ASSUMPTION). The arterial is the one a trip would use on the shortest free-flow path with the study area's residential and service streets closed, where that path runs on a boundary street near the study area.

Model figures are the mean of 1 seed(s), per hour of the run. Basis: OBSERVED = read from the resident volunteer count of Feb 25, 2025 or its headline shares; ASSUMPTION = inferred from those numbers or chosen.

### Colby Street NB

Observed: block volume 174 veh/h, whole-street cars 102, so through cars 102 to 145 veh/h. Model: 134 through cars per hour.

Observed (PM): 182 cars entered at the south end, 102 drove the whole street, 164 left it at Alcatraz Ave (131 left, 32 right, 1 straight), and 47% of the block's trips came from a freeway (the headline share). ASSUMPTION: freeway-origin cars that do not end along the street are 65 veh/h (the 82 freeway-origin trips on the block, 47% of 174, times the 182 / (182 + 47) of its cars that entered at the south end rather than joining on the way), spread over the 164 exits in proportion (0.40); the other through cars come from the Telegraph Ave and south-side approaches that feed the street's south end. Ranges: low = 131 (32) x 0.47 x 0.62 (the whole-street share of exits), high = 131 (32) x 0.47.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | OBSERVED turn count x ASSUMPTION share (131 left turns x 0.40) | 52 (38 to 62) | 64 | above |
| Telegraph Ave and south-side traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | ASSUMPTION: the through left-turners (131 x 0.62 = 81) that are not off-ramp traffic | 29 (19 to 43) | 41 | within |
| SR-24 off-ramp traffic using Colby St to reach College Ave and Berkeley (right at Alcatraz Ave) | OBSERVED turn count x ASSUMPTION share (32 right turns x 0.40) | 13 (9 to 15) | 14 | within |
| Telegraph Ave and south-side traffic using Colby St to reach College Ave and Berkeley | ASSUMPTION: the through right-turners (32 x 0.62 = 20) that are not off-ramp traffic | 7 (5 to 11) | 13 | above |
| Intents listed, together | | 101 (71 to 131) | 132 | |
| Other through cars (no intent listed) | | | 2 | |

Model through cars by origin and destination group (largest 12 of 17 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 64.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 21.0 | Claremont Avenue then College Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 10.0 | Telegraph Avenue |
| Telegraph Ave to the south (downtown Oakland) | Telegraph Ave from the north (Berkeley) | 6.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 5.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Emeryville and West Oakland streets (55th to 67th Streets) | 5.0 | Claremont Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Claremont Ave and Tunnel Rd toward the hills | 5.0 | Claremont Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Ashby Ave from the west (Emeryville and I-80) | 4.0 | none near the study area |
| West Oakland to the southwest (Adeline St, Market St) | Telegraph Ave from the north (Berkeley) | 3.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | College Ave from the north (Berkeley) | 3.0 | SR-24 then Claremont Avenue then College Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Shattuck Ave from the north (Berkeley) | 2.0 | Claremont Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | College Ave from the north (Berkeley) | 1.0 | Telegraph Avenue |
| other pairs | | 5.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 90 veh/h; Claremont Avenue then College Avenue 21 veh/h; Claremont Avenue 13 veh/h; none near the study area 5 veh/h; SR-24 then Claremont Avenue then College Avenue 3 veh/h; College Avenue then Alcatraz Avenue 1 veh/h.

### Hillegass Avenue NB

Observed: block volume 110 veh/h, whole-street cars 48, so through cars 48 to 95 veh/h. Model: 78 through cars per hour.

Observed (PM): 94 cars entered at the south end, 48 drove the whole street, 109 left it at Alcatraz Ave (43 west, 54 east, 12 straight), and 47% of the block's trips came from a freeway. ASSUMPTION: freeway-origin through cars are 40 veh/h (52 freeway-origin trips times 94 / (94 + 29)), spread over the exits in proportion (0.37); the through share of exits is 48 / 109 = 0.44.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Hillegass Ave to reach Alcatraz Ave west and Telegraph Ave north | OBSERVED turn count x ASSUMPTION share (43 left turns x 0.37) | 16 (9 to 20) | 16 | within |
| SR-24 off-ramp traffic using Hillegass Ave to reach College Ave and Berkeley | OBSERVED turn count x ASSUMPTION share (54 right turns x 0.37) | 20 (11 to 25) | 37 | above |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach Alcatraz Ave west | ASSUMPTION: through exits (43 x 0.44) that are not off-ramp traffic | 3 (0 to 10) | 6 | within |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach College Ave and Berkeley | ASSUMPTION: through exits (54 x 0.44) that are not off-ramp traffic | 4 (0 to 13) | 15 | above |
| Intents listed, together | | 43 (20 to 68) | 74 | |
| Other through cars (no intent listed) | | | 4 | |

Model through cars by origin and destination group (largest 12 of 22 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 22.0 | SR-24 |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | College Ave from the north (Berkeley) | 8.0 | SR-24 then Claremont Avenue then College Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 8.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 7.0 | SR-24 then Claremont Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 4.0 | Telegraph Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Claremont Ave and Tunnel Rd toward the hills | 4.0 | Claremont Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Ashby Ave from the west (Emeryville and I-80) | 4.0 | SR-24 then Telegraph Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Telegraph Ave from the north (Berkeley) | 3.0 | Telegraph Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 2.0 | Claremont Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Alcatraz Ave from the west (Emeryville side) | 2.0 | SR-24 then Telegraph Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | San Pablo Ave (Emeryville and West Oakland) | 2.0 | SR-24 |
| Telegraph Ave to the south (downtown Oakland) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 2.0 | Telegraph Avenue |
| other pairs | | 10.0 | |

By the arterial these cars would otherwise use: SR-24 25 veh/h; Telegraph Avenue 18 veh/h; Claremont Avenue 8 veh/h; SR-24 then Claremont Avenue then College Avenue 8 veh/h; SR-24 then Claremont Avenue 7 veh/h; SR-24 then Telegraph Avenue 6 veh/h.

### Hillegass Avenue SB

Observed: block volume 160 veh/h, whole-street cars 79, so through cars 79 to 120 veh/h. Model: 106 through cars per hour.

Observed (PM): 178 cars entered at the top (76 turned in from Alcatraz Ave west, 98 from the east, 4 came straight from the north), 79 drove the whole street, and 68% of the block's trips (109 veh/h) went to a freeway. ASSUMPTION: freeway-bound cars that did not join mid-street are 87 veh/h (109 x 178 / (178 + 44)), half of the 174 turn-ins; low = the whole-street share of the turn-ins (0.45), high = the freeway-bound share without the mid-street correction (0.63).

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Telegraph Ave, Alcatraz Ave west and West Berkeley traffic turning off Alcatraz Ave onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (76 turn-ins x 0.50) | 38 (34 to 48) | 39 | within |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (98 turn-ins x 0.50) | 49 (44 to 62) | 49 | within |
| Intents listed, together | | 87 (78 to 110) | 88 | |
| Other through cars (no intent listed) | | | 18 | |

Model through cars by origin and destination group (largest 12 of 13 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 39.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 27.0 | Telegraph Avenue |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 12.0 | College Avenue then Claremont Avenue then SR-24 |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 8.0 | Claremont Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 6.0 | Telegraph Avenue |
| West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 4.0 | College Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 3.0 | Alcatraz Avenue then College Avenue |
| Telegraph Ave from the north (Berkeley) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 2.0 | College Avenue |
| Ashby Ave from the west (Emeryville and I-80) | College Ave from the north (Berkeley) | 1.0 | Alcatraz Avenue then College Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Berkeley hills to the northeast (Evergreen Ln, Gravatt Dr) | 1.0 | none near the study area |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 1.0 | Claremont Avenue |
| Claremont Ave and Tunnel Rd toward the hills | Telegraph Ave to the south (downtown Oakland) | 1.0 | Claremont Avenue |
| other pairs | | 1.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 72 veh/h; College Avenue then Claremont Avenue then SR-24 12 veh/h; Claremont Avenue then SR-24 8 veh/h; College Avenue 6 veh/h; Alcatraz Avenue then College Avenue 4 veh/h; Claremont Avenue 2 veh/h.

### Colby Street SB

Observed: block volume 160 veh/h, whole-street cars 39, so through cars 39 to 117 veh/h. Model: 100 through cars per hour.

Observed (PM): 139 cars entered at the top (76 from Alcatraz Ave west, 50 from the east, 13 from the north), 39 drove the whole street, 45% of the block's trips (72 veh/h) went to a freeway and 22% came by way of Telegraph Ave. ASSUMPTION: freeway-bound cars that did not join mid-street are 46 veh/h (72 x 139 / (139 + 79)), 0.365 of the 126 turn-ins; low = the whole-street share (0.31), high = the unadjusted freeway share (0.57). The Telegraph Ave cars are the 22% x 160 = 35 of the 76 west turn-ins.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Southbound Telegraph Ave traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (35 Telegraph Ave cars x 0.365) | 13 (11 to 20) | 14 | within |
| Alcatraz Ave west, Ashby Ave and West Berkeley traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (41 other west turn-ins x 0.365) | 15 (13 to 23) | 11 | below |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (50 east turn-ins x 0.365) | 18 (15 to 29) | 36 | above |
| Intents listed, together | | 46 (39 to 72) | 61 | |
| Other through cars (no intent listed) | | | 39 | |

Model through cars by origin and destination group (largest 12 of 20 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 22.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 21.0 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 12.0 | Claremont Avenue then SR-24 |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 11.0 | Telegraph Avenue |
| Shattuck Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 6.0 | none near the study area |
| Ashby Ave from the west (Emeryville and I-80) | College Ave from the north (Berkeley) | 3.0 | Alcatraz Avenue then College Avenue |
| Ashby Ave from the west (Emeryville and I-80) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 3.0 | SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | West Oakland to the southwest (Adeline St, Market St) | 3.0 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 3.0 | none near the study area |
| Ashby Ave from the west (Emeryville and I-80) | SR-13 Warren Freeway (via SR-24 east) | 2.0 | SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Berkeley hills to the northeast (Evergreen Ln, Gravatt Dr) | 2.0 | none near the study area |
| West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 2.0 | College Avenue |
| other pairs | | 10.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 61 veh/h; Claremont Avenue then SR-24 12 veh/h; none near the study area 12 veh/h; SR-24 5 veh/h; Alcatraz Avenue then College Avenue 4 veh/h; College Avenue 2 veh/h.

### Study area, all residential and service streets

Model: 618 through cars per hour.

Model through cars by origin and destination group (largest 12 of 64 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 73.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 72.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 48.0 | Claremont Avenue then College Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 48.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 42.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Emeryville and West Oakland streets (55th to 67th Streets) | 35.0 | Claremont Avenue |
| West Oakland to the southwest (Adeline St, Market St) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 30.0 | Telegraph Avenue then Claremont Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 23.0 | SR-24 |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 22.0 | SR-24 then Claremont Avenue |
| Emeryville and West Oakland streets (55th to 67th Streets) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 22.0 | none near the study area |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 19.0 | Claremont Avenue then SR-24 |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 17.0 | Telegraph Avenue |
| other pairs | | 167.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 297 veh/h; Claremont Avenue 69 veh/h; Claremont Avenue then College Avenue 48 veh/h; none near the study area 40 veh/h; SR-24 35 veh/h; Telegraph Avenue then Claremont Avenue 30 veh/h.

By origin group: SR-24 eastbound off-ramps (arriving from Oakland and I-980) 130; Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 129; South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 119; Telegraph Ave from the north (Berkeley) 62; West Oakland to the southwest (Adeline St, Market St) 50; Telegraph Ave to the south (downtown Oakland) 24; Emeryville and West Oakland streets (55th to 67th Streets) 24; Claremont Ave and Tunnel Rd toward the hills 21; College Ave from the north (Berkeley) 13; Ashby Ave from the west (Emeryville and I-80) 12.

By destination group: SR-24 westbound on-ramps (toward Oakland and I-980) 171; Telegraph Ave from the north (Berkeley) 132; South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 106; Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 60; Claremont Ave and Tunnel Rd toward the hills 42; Emeryville and West Oakland streets (55th to 67th Streets) 37; College Ave from the north (Berkeley) 18; Shattuck Ave from the north (Berkeley) 12; Ashby Ave from the west (Emeryville and I-80) 8; SR-24 eastbound on-ramps (toward the Caldecott Tunnel) 7.


## Through cars by intent (cut-through intent view)

A through car is tallied once, under the first intent that fits it (the on-ramp on its planned route, the off-ramp it has driven, or the origin and destination groups of its trip), at the moment the through count counts it. Cars an hour over the run, the same window as the through-car figure (622 an hour).

| Intent | Basis | Cars an hour | Share |
| --- | --- | --- | --- |
| on-2853241697 | observed | 172 | 28% |
| Other on-ramps | assumed | 10 | 2% |
| off-52990846 | observed | 134 | 22% |
| Other off-ramps | assumed | 12 | 2% |
| Downtown, south and west Oakland traffic using side streets to reach Berkeley and Telegraph Ave north | assumed | 97 | 16% |
| Berkeley and Telegraph Ave north traffic using side streets to reach downtown, south and west Oakland | assumed | 57 | 9% |
| Oakland cross-town traffic (West Oakland, Broadway, Piedmont, Emeryville) using side streets near Claremont Ave and Telegraph Ave | assumed | 85 | 14% |
| Other (no intent listed) |  | 55 | 9% |

Intents listed cover 91% of through cars.


## Select-link shares: modeled vs observed (design D5: headline = freeway shares, tolerance +/-10 pp)

- Hillegass Avenue NB: 4 links (path Claremont Avenue -> Alcatraz Avenue (434 m)), 228 trips (205 completed)
- Colby Street NB: 8 links (path Claremont Avenue -> Alcatraz Avenue (680 m)), 293 trips (274 completed)
- Hillegass Avenue SB: 4 links (path Alcatraz Avenue -> Claremont Avenue (433 m)), 192 trips (181 completed)
- Colby Street SB: 8 links (path Alcatraz Avenue -> Claremont Avenue (680 m)), 241 trips (222 completed)

| Block | Side | Via | Observed | Modeled | Diff (pp) | n trips | Headline |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue NB | from | freeway | 47% | 52% | +5 | 228 | within |
| Hillegass Avenue NB | to | Benvenue Avenue | 21% (PM 33%) | 4% | -29 | 228 |  |
| Hillegass Avenue NB | to | College Avenue | 6% | 17% | +11 | 228 |  |
| Hillegass Avenue NB | to | Alcatraz Avenue WB | 27% | 26% | -1 | 228 |  |
| Colby Street NB | from | freeway | 47% | 45% | -2 | 293 | within |
| Colby Street NB | to | Alcatraz Avenue WB | 48% | 46% | -2 | 293 |  |
| Colby Street NB | to | Telegraph Avenue | 25% | 40% | +15 | 293 |  |
| Colby Street NB | to | College Avenue | 3% | 4% | +1 | 293 |  |
| Hillegass Avenue SB | from | Alcatraz Avenue WB | 46% | 28% | -18 | 192 |  |
| Hillegass Avenue SB | from | Benvenue Avenue | 26% | 5% | -21 | 192 |  |
| Hillegass Avenue SB | from | College Avenue | 16% | 19% | +3 | 192 |  |
| Hillegass Avenue SB | to | freeway | 57% (PM 68%) | 63% | -5 | 192 | within |
| Colby Street SB | from | Alcatraz Avenue EB | 43% | 24% | -19 | 241 |  |
| Colby Street SB | from | Alcatraz Avenue WB | 46% | 16% | -30 | 241 |  |
| Colby Street SB | from | Telegraph Avenue | 22% | 17% | -5 | 241 |  |
| Colby Street SB | to | freeway | 45% | 41% | -4 | 241 | within |
| Colby Street SB | to | Forest Street | 34% | 17% | -17 | 241 |  |

Headline shares within tolerance: 4 of 4. Observed column uses the PM-peak share where one is given and the period is pm_peak. 'Via' shares are the fraction of select-link trips using that street before (from) or after (to) the block; freeway = origin / destination gate with a motorway-class link attached.

## Claremont ramps: streets used before the on-ramp / after the off-ramp

Observed shares are for traffic from/to the north only. 'Modeled' is over all trips on the ramps and any visit to the street (an upper bound for streets that serve both sides). 'Modeled, side' counts only trips whose surface end lies on the side of the ramp stated in the targets file (`freewayRamp.side`), and for a street with a qualifier ("north of X") only its links on that side of X.

| Direction | Via | Observed | Modeled | n ramp trips | Modeled, side | n side trips |
| --- | --- | --- | --- | --- | --- | --- |
| onto freeway | College Avenue | 16% | 16% | 783 | 17% | 712 |
| onto freeway | Hillegass Avenue | 12% | 14% | 783 | 15% | 712 |
| onto freeway | Martin Street | 10% | 12% | 783 | 12% | 712 |
| onto freeway | Colby Street | 8% | 10% | 783 | 11% | 712 |
| onto freeway | Telegraph Avenue north of Alcatraz Avenue | 8% | 13% | 783 | 10% | 712 |
| onto freeway | Benvenue Avenue | 5% | 2% | 783 | 3% | 712 |
| from freeway | College Avenue | 10% | 9% | 767 | 10% | 734 |
| from freeway | Martin Street | 10% | 11% | 767 | 11% | 734 |
| from freeway | Colby Street | 8% | 13% | 767 | 13% | 734 |
| from freeway | Hillegass Avenue | 5% | 7% | 767 | 7% | 734 |
| from freeway | Benvenue Avenue | 3% | 2% | 767 | 2% | 734 |

## Top 15 links by delay

| Link | Street | Class | Lanes | Len (m) | End node control | Delay (veh-h) | Stopped (veh-h) | Mean stopped veh | Flow (veh/h) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 4143 | Adeline Street | Secondary | 3 | 185 | signal | 21.09 | 17.15 | 17.2 | 491 |
| 1025 | Martin Luther King Junior Way | Secondary | 3 | 79 | signal | 9.33 | 7.78 | 7.8 | 862 |
| 4397 | Ashby Avenue | Primary | 2 | 96 | signal | 7.78 | 5.28 | 5.3 | 931 |
| 1122 | Alcatraz Avenue | Tertiary | 1 | 299 | signal | 6.93 | 4.44 | 4.4 | 437 |
| 769 | Martin Luther King Junior Way | Secondary | 3 | 112 | signal | 6.77 | 4.11 | 4.1 | 1559 |
| 4382 | Warren Freeway | Motorway | 2 | 744 | uncontrolled | 5.79 | 1.05 | 1.1 | 1147 |
| 1051 | Adeline Street | Secondary | 4 | 50 | signal | 5.33 | 4.12 | 4.1 | 1271 |
| 2819 | College Avenue | Tertiary | 2 | 50 | signal | 5.13 | 3.95 | 3.9 | 894 |
| 2008 | Shattuck Avenue | Tertiary | 1 | 93 | signal | 4.93 | 3.88 | 3.9 | 442 |
| 1108 | Market Street | Secondary | 4 | 36 | signal | 4.84 | 4.25 | 4.3 | 1024 |
| 115 | San Pablo Avenue | Primary | 3 | 54 | signal | 4.61 | 3.42 | 3.4 | 793 |
| 1662 | 52nd Street | Secondary | 4 | 53 | signal | 4.57 | 3.10 | 3.1 | 1235 |
| 3344 | Domingo Avenue | Residential | 1 | 110 | signal | 4.51 | 3.42 | 3.4 | 347 |
| 1111 | Market Street | Tertiary | 3 | 31 | signal | 4.48 | 3.94 | 3.9 | 793 |
| 3395 | Ashby Avenue | Primary | 1 | 129 | signal | 4.45 | 2.28 | 2.3 | 917 |

## Top 15 nodes by blocked time

Blocked time = lane-head seconds waiting at the stop line without permission (signal red, conflict, stop sign or no downstream space).

| Node | Streets | Control | Gate | Blocked (lane-h) | of which no downstream space | Signal plan at end (cycle: greens) |
| --- | --- | --- | --- | --- | --- | --- |
| 446 | Market Street / Stanford Avenue | signal |  | 5.73 | 0.09 | 75 s: 49/16 |
| 680 | 52nd Street / Shattuck Avenue | signal |  | 5.18 | 0.03 | 110 s: 30/28/38 |
| 447 | Adeline Street / Alcatraz Avenue | signal |  | 3.79 | 0.11 | 75 s: 34/31 |
| 1080 | 62nd Street / Claremont Avenue / College Avenue | signal |  | 3.70 | 0.07 | 75 s: 15/30/15 |
| 479 | Adeline Street / Martin Luther King Junior Way / Stanford Avenue | signal |  | 3.64 | 0.00 | 85 s: 20/55 |
| 185 | Alcatraz Avenue / Sacramento Street | signal |  | 3.44 | 0.02 | 75 s: 35/30 |
| 30 | 57th Street / Adeline Street / Market Street | signal |  | 3.32 | 0.01 | 75 s: 17/28/15 |
| 37 | San Pablo Avenue / Stanford Avenue | signal |  | 3.29 | 0.00 | 75 s: 30/35 |
| 851 | Alcatraz Avenue / Telegraph Avenue | signal |  | 2.95 | 0.03 | 75 s: 43/22 |
| 713 | 51st Street / Telegraph Avenue | signal |  | 2.87 | 0.00 | 75 s: 31/34 |
| 1069 | Claremont Avenue / Colby Street / Forest Street | signal |  | 2.79 | 0.00 | 79 s: 20/4/40 |
| 1406 | Ashby Avenue / Claremont Avenue | signal |  | 2.76 | 0.01 | 75 s: 50/15 |
| 947 | Ashby Avenue / Telegraph Avenue | signal |  | 2.75 | 0.00 | 75 s: 25/40 |
| 944 | Ashby Avenue / Shattuck Avenue | signal |  | 2.60 | 0.00 | 75 s: 46/19 |
| 242 | Ashby Avenue / Martin Luther King Junior Way | signal |  | 2.55 | 0.00 | 75 s: 40/25 |

Phases of the five most blocked signals (green s: approach links with their lanes, link ids in brackets):

- node 446: 49 s: Stanford Avenue 1L [941], Stanford Avenue 3L [1055]; 16 s: Market Street 4L [1108], Market Street 3L [1111]
- node 680: 30 s: 52nd Street 4L [1662]; 28 s: 52nd Street 4L [1666], 52nd Street 4L [1662]; 38 s: Shattuck Avenue 2L [1653], Shattuck Avenue 2L [1705]
- node 447: 34 s: Adeline Street 4L [1049], Adeline Street 4L [1051]; 31 s: Alcatraz Avenue 2L [1048], Alcatraz Avenue 2L [1133]
- node 1080: 15 s: Claremont Avenue 2L [2756], Claremont Avenue 2L [2798]; 30 s: College Avenue 2L [2761], College Avenue 2L [2819]; 15 s: 62nd Street 1L [2622]
- node 479: 20 s: Martin Luther King Junior Way 3L [1025], Adeline Street 3L [4143]; 55 s: Stanford Avenue 1L [4139]

## Entry backlog by origin node at end of run (top 10)

| Node | Streets | Trips waiting | Offered veh/h (before scale) |
| --- | --- | --- | --- |
| 1080 | 62nd Street / Claremont Avenue / College Avenue | 3 | 142 |
| 654 | 53rd Street / Shattuck Avenue | 2 | 19 |
| 924 | Ashby Avenue / Regent Street | 2 | 40 |
| 1093 | College Avenue / Harwood Avenue | 2 | 132 |

## Flow on key streets (veh/h per direction, study-area links of 40 m or more)

| Street | Direction of travel | Links | Median flow | Max flow |
| --- | --- | --- | --- | --- |
| Telegraph | N | 12 | 1117 | 1194 |
| Telegraph | S | 10 | 782 | 846 |
| College | N | 3 | 338 | 338 |
| College | S | 3 | 890 | 894 |
| Claremont | N | 6 | 388 | 596 |
| Claremont | S | 7 | 336 | 779 |
| Alcatraz | E | 6 | 571 | 592 |
| Alcatraz | W | 6 | 331 | 409 |
| Hillegass | N | 4 | 118 | 144 |
| Hillegass | S | 4 | 122 | 128 |
| Colby | N | 7 | 152 | 198 |
| Colby | S | 7 | 125 | 160 |
| Martin | E | 2 | 125 | 125 |
| Martin | W | 2 | 95 | 95 |

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
