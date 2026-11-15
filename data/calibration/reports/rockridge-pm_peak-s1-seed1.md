# Calibration report: rockridge pm_peak scale 1 seed 1 (60 min)

Offered demand 25105 veh/h x scale 1 = 25105 veh/h. Run took 26.5 s wall clock. Flow tables use the window after a 10 min warm-up; select-link and health figures cover the whole run from an empty network.

## Stability (design D4)

| Criterion | Threshold | Value | Result |
| --- | --- | --- | --- |
| Gridlock removals | 0 | 3 | FAIL |
| Backlog / spawned | < 2% | 0.1% (13 of 25407) | pass |
| Arterial mean speed (run) | > 4 m/s | 7.82 m/s (last 15 min 7.52) | pass |

Overall: **NOT STABLE**. Mean trip delay 187 s, mean trip time 446 s, completed 24678, unroutable 0.

| t (min) | vehicles in network | backlog | completed | removals | arterial speed in interval (m/s) |
| --- | --- | --- | --- | --- | --- |
| 5 | 2965 | 17 | 2095 | 0 | 8.61 |
| 10 | 2950 | 33 | 4167 | 0 | 7.96 |
| 15 | 3096 | 6 | 6149 | 0 | 7.99 |
| 20 | 3185 | 4 | 8208 | 1 | 8.27 |
| 25 | 3233 | 20 | 10227 | 1 | 8.16 |
| 30 | 3286 | 35 | 12339 | 1 | 7.92 |
| 35 | 3349 | 12 | 14421 | 3 | 7.24 |
| 40 | 3312 | 6 | 16484 | 3 | 7.55 |
| 45 | 3221 | 27 | 18622 | 3 | 7.96 |
| 50 | 3411 | 16 | 20547 | 3 | 7.84 |
| 55 | 3588 | 11 | 22608 | 3 | 7.71 |
| 60 | 3715 | 13 | 24678 | 3 | 7.01 |
## Wandering (completed car trips)

Detour ratio = distance driven (link and movement lengths) over the shortest network distance from the trip's origin to its destination. Detour against the free-flow route uses the time-shortest route with no congestion and no noise, which is what a purposeful driver without live information would follow (it differs from the shortest distance when a faster, longer road exists). A switch is a change of the remaining route while en route. Loops: the same link twice or the same node three or more times. Reversals: a link followed by its reverse within 200 m. 'Study-area vehicle-miles' are miles driven on links inside the study area; the last column is the share of them driven by trips with a detour ratio above 1.3. Guided drivers re-evaluate their route every epoch; the others keep their departure route unless it is blocked.

| Trips | n | Switches per trip | With a switch | Mean detour | Median detour | Detour > 1.3 | Detour > 2 | Mean detour vs free-flow route | Vs free-flow route > 1.3 | Loops | Reversals | Study veh-miles | Of them by detour > 1.3 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| all trips | 22490 | 0.06 | 5.2% | 1.101 | 1.065 | 6.2% | 0.0% | 1.039 | 2.8% | 0.0% | 5.8% | 2435 | 12.7% |
| gate to gate | 8050 | 0.09 | 8.3% | 1.102 | 1.076 | 5.1% | 0.0% | 1.040 | 2.4% | 0.0% | 9.0% | 534 | 15.3% |
| with a local end | 14440 | 0.04 | 3.5% | 1.100 | 1.059 | 6.9% | 0.0% | 1.039 | 3.1% | 0.0% | 4.0% | 1901 | 12.0% |
| guided drivers | 10304 | 0.11 | 10.6% | 1.102 | 1.066 | 6.6% | 0.0% | 1.040 | 3.1% | 0.0% | 5.8% | 1140 | 12.7% |
| other drivers | 12186 | 0.01 | 0.6% | 1.100 | 1.065 | 5.9% | 0.0% | 1.038 | 2.6% | 0.0% | 5.8% | 1295 | 12.7% |

## Reported patterns (diagnostics; configured in the targets file under `patterns`)

(a) Trips between the surface gates on the north side of the ramps and the freeway mainline gates, and the local-street (residential and service links in the study area) vehicle-miles they drive. Share = of all completed trips' local-street vehicle-miles (565 miles). No observed counterpart exists for this quantity (the targets file has only the select-link shares above).

| Trips | n trips | Local-street veh-miles | Share of all local-street veh-miles |
| --- | --- | --- | --- |
| surface gates to the freeway | 1643 | 44.1 | 8% |
| freeway to the surface gates | 1117 | 35.7 | 6% |

(b) Corridor trips: completed trips from beyond one end of the corridor's study-area extent (the bypass street and its arterial together) to beyond the other end, within a lateral limit of the corridor, by direction. 'Bypass' = at least N blocks (links) on the bypass street; 'arterial' = fewer bypass blocks and at least N on the arterial; 'other' = neither (another street, the freeway or a short use); blocks are counted on the corridor's study-area links. No observed counterpart exists for these shares. The related observed values are in the select-link table above: northbound Hillegass Ave traffic rarely ends on College Ave (6%), 21 to 33% jogs to Benvenue Ave, and southbound freeway-bound drivers on College Ave commonly arrive via Ashby Ave and Benvenue Ave and jog to Hillegass Ave.

| Bypass | Arterial | N | Direction | Corridor trips | Bypass | Arterial | Other | Mean bypass blocks |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue | College Avenue | 3 | N | 1336 | 4% | 19% | 78% | 0.2 |
| Hillegass Avenue | College Avenue | 3 | S | 1484 | 7% | 19% | 74% | 0.3 |

## Per-mode results

Offered: 25105 car veh/h; 626 bicycle flows (764/h); 2000 pedestrian flows (1731/h). Bicycle and pedestrian volumes are assumptions, not counts.

| Mode | In network | Completed | Mean time (s) | Other |
| --- | --- | --- | --- | --- |
| Car | 3715 | 24678 | 446 | |
| Bicycle | 61 | 791 | 266 | |
| Pedestrian | 197 | 1669 | 435 | mean crossing delay 8.4 s |

Vulnerable road users (surrogate indicators): pedestrian conflicts 256, bicycle conflicts 1031, close passes 641, pedestrian injury severity mean 0.039 (AIS4+, 10695 supported of 10695 encounters), cyclist injury severity mean 0.067 (MAIS3+F, 3833 supported of 7492 encounters) (separate endpoints, never summed), mean vehicle speed at pedestrian encounters 2.12 m/s.


## Through cars on the counted blocks (a car is through when neither trip end is in the study area)

Observed through range = from the cars that drove the whole street (volunteer count, a lower bound) to the block volume less the cars whose trip ends along the street (an upper bound). Observed freeway-end trips = observed block volume times the observed freeway share of the street (the headline share of the targets file); these include freeway trips that end inside the study area, so they are not an expected through count. Modeled through = select-link trips with no end in the study area, per hour. Modeled freeway = select-link trips from or to a freeway node, per hour.

| Block | Observed volume (veh/h) | Observed freeway share | Observed freeway-end trips (veh/h) | Observed through range (veh/h) | Modeled through (veh/h) | In range | Modeled freeway trips (veh/h) |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue NB | 110 | 47.0% | 52 | 48 to 95 | 83 | yes | 149 |
| Colby Street NB | 174 | 47.0% | 82 | 102 to 145 | 142 | yes | 134 |
| Hillegass Avenue SB | 160 | 68.0% | 109 | 79 to 120 | 205 | above | 160 |
| Colby Street SB | 160 | 45.0% | 72 | 39 to 117 | 216 | above | 124 |

## Intent map: through cars by where they come from and where they are going

Through = neither trip end is in the study area. Groups are the approach groups of the area config (data/areas); a node that is not a gate takes the group of the nearest surface gate (ASSUMPTION). The arterial is the one a trip would use on the shortest free-flow path with the study area's residential and service streets closed, where that path runs on a boundary street near the study area.

Model figures are the mean of 1 seed(s), per hour of the run. Basis: OBSERVED = read from the resident volunteer count of Feb 25, 2025 or its headline shares; ASSUMPTION = inferred from those numbers or chosen.

### Colby Street NB

Observed: block volume 174 veh/h, whole-street cars 102, so through cars 102 to 145 veh/h. Model: 142 through cars per hour.

Observed (PM): 182 cars entered at the south end, 102 drove the whole street, 164 left it at Alcatraz Ave (131 left, 32 right, 1 straight), and 47% of the block's trips came from a freeway (the headline share). ASSUMPTION: freeway-origin cars that do not end along the street are 65 veh/h (the 82 freeway-origin trips on the block, 47% of 174, times the 182 / (182 + 47) of its cars that entered at the south end rather than joining on the way), spread over the 164 exits in proportion (0.40); the other through cars come from the Telegraph Ave and south-side approaches that feed the street's south end. Ranges: low = 131 (32) x 0.47 x 0.62 (the whole-street share of exits), high = 131 (32) x 0.47.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | OBSERVED turn count x ASSUMPTION share (131 left turns x 0.40) | 52 (38 to 62) | 62 | within |
| Telegraph Ave and south-side traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | ASSUMPTION: the through left-turners (131 x 0.62 = 81) that are not off-ramp traffic | 29 (19 to 43) | 39 | within |
| SR-24 off-ramp traffic using Colby St to reach College Ave and Berkeley (right at Alcatraz Ave) | OBSERVED turn count x ASSUMPTION share (32 right turns x 0.40) | 13 (9 to 15) | 13 | within |
| Telegraph Ave and south-side traffic using Colby St to reach College Ave and Berkeley | ASSUMPTION: the through right-turners (32 x 0.62 = 20) that are not off-ramp traffic | 7 (5 to 11) | 23 | above |
| Intents listed, together | | 101 (71 to 131) | 137 | |
| Other through cars (no intent listed) | | | 5 | |

Model through cars by origin and destination group (largest 12 of 18 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 62.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 18.0 | Claremont Avenue then College Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 16.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 9.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Emeryville and West Oakland streets (55th to 67th Streets) | 6.0 | Claremont Avenue |
| Telegraph Ave to the south (downtown Oakland) | Telegraph Ave from the north (Berkeley) | 6.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Ashby Ave from the west (Emeryville and I-80) | 4.0 | none near the study area |
| West Oakland to the southwest (Adeline St, Market St) | Claremont Ave and Tunnel Rd toward the hills | 4.0 | Claremont Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Shattuck Ave from the north (Berkeley) | 3.0 | Claremont Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | College Ave from the north (Berkeley) | 3.0 | SR-24 then Claremont Avenue then College Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | San Pablo Ave (Emeryville and West Oakland) | 2.0 | Claremont Avenue then Alcatraz Avenue |
| San Pablo Ave (Emeryville and West Oakland) | Claremont Ave and Tunnel Rd toward the hills | 2.0 | Alcatraz Avenue then Claremont Avenue |
| other pairs | | 7.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 96 veh/h; Claremont Avenue then College Avenue 18 veh/h; Claremont Avenue 14 veh/h; none near the study area 5 veh/h; Alcatraz Avenue then Claremont Avenue 3 veh/h; SR-24 then Claremont Avenue then College Avenue 3 veh/h.

### Hillegass Avenue NB

Observed: block volume 110 veh/h, whole-street cars 48, so through cars 48 to 95 veh/h. Model: 83 through cars per hour.

Observed (PM): 94 cars entered at the south end, 48 drove the whole street, 109 left it at Alcatraz Ave (43 west, 54 east, 12 straight), and 47% of the block's trips came from a freeway. ASSUMPTION: freeway-origin through cars are 40 veh/h (52 freeway-origin trips times 94 / (94 + 29)), spread over the exits in proportion (0.37); the through share of exits is 48 / 109 = 0.44.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Hillegass Ave to reach Alcatraz Ave west and Telegraph Ave north | OBSERVED turn count x ASSUMPTION share (43 left turns x 0.37) | 16 (9 to 20) | 14 | within |
| SR-24 off-ramp traffic using Hillegass Ave to reach College Ave and Berkeley | OBSERVED turn count x ASSUMPTION share (54 right turns x 0.37) | 20 (11 to 25) | 37 | above |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach Alcatraz Ave west | ASSUMPTION: through exits (43 x 0.44) that are not off-ramp traffic | 3 (0 to 10) | 10 | within |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach College Ave and Berkeley | ASSUMPTION: through exits (54 x 0.44) that are not off-ramp traffic | 4 (0 to 13) | 17 | above |
| Intents listed, together | | 43 (20 to 68) | 78 | |
| Other through cars (no intent listed) | | | 5 | |

Model through cars by origin and destination group (largest 12 of 21 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 21.0 | SR-24 |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 8.0 | SR-24 then Claremont Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | College Ave from the north (Berkeley) | 8.0 | SR-24 then Claremont Avenue then College Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 8.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 6.0 | Telegraph Avenue |
| Telegraph Ave to the south (downtown Oakland) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 5.0 | Telegraph Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Telegraph Ave from the north (Berkeley) | 4.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | San Pablo Ave (Emeryville and West Oakland) | 3.0 | College Avenue then Alcatraz Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 3.0 | Claremont Avenue then College Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 3.0 | Claremont Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Ashby Ave from the west (Emeryville and I-80) | 3.0 | SR-24 then Telegraph Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | San Pablo Ave (Emeryville and West Oakland) | 2.0 | SR-24 |
| other pairs | | 9.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 24 veh/h; SR-24 23 veh/h; SR-24 then Claremont Avenue 8 veh/h; SR-24 then Claremont Avenue then College Avenue 8 veh/h; Claremont Avenue 5 veh/h; College Avenue then Alcatraz Avenue 5 veh/h.

### Hillegass Avenue SB

Observed: block volume 160 veh/h, whole-street cars 79, so through cars 79 to 120 veh/h. Model: 205 through cars per hour.

Observed (PM): 178 cars entered at the top (76 turned in from Alcatraz Ave west, 98 from the east, 4 came straight from the north), 79 drove the whole street, and 68% of the block's trips (109 veh/h) went to a freeway. ASSUMPTION: freeway-bound cars that did not join mid-street are 87 veh/h (109 x 178 / (178 + 44)), half of the 174 turn-ins; low = the whole-street share of the turn-ins (0.45), high = the freeway-bound share without the mid-street correction (0.63).

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Telegraph Ave, Alcatraz Ave west and West Berkeley traffic turning off Alcatraz Ave onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (76 turn-ins x 0.50) | 38 (34 to 48) | 41 | within |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (98 turn-ins x 0.50) | 49 (44 to 62) | 59 | within |
| Intents listed, together | | 87 (78 to 110) | 100 | |
| Other through cars (no intent listed) | | | 105 | |

Model through cars by origin and destination group (largest 12 of 24 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 40.0 | Telegraph Avenue |
| Ashby Ave from the west (Emeryville and I-80) | College Ave from the north (Berkeley) | 33.0 | Alcatraz Avenue then College Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 30.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 29.0 | Telegraph Avenue |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 16.0 | College Avenue then Claremont Avenue then SR-24 |
| Telegraph Ave from the north (Berkeley) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 13.0 | College Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 11.0 | Claremont Avenue then SR-24 |
| West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 6.0 | College Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 4.0 | Alcatraz Avenue then College Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | West Oakland to the southwest (Adeline St, Market St) | 4.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | San Pablo Ave (Emeryville and West Oakland) | 3.0 | College Avenue then Alcatraz Avenue |
| College Ave from the north (Berkeley) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 3.0 | College Avenue |
| other pairs | | 13.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 104 veh/h; Alcatraz Avenue then College Avenue 37 veh/h; College Avenue 22 veh/h; College Avenue then Claremont Avenue then SR-24 16 veh/h; Claremont Avenue then SR-24 11 veh/h; none near the study area 5 veh/h.

### Colby Street SB

Observed: block volume 160 veh/h, whole-street cars 39, so through cars 39 to 117 veh/h. Model: 216 through cars per hour.

Observed (PM): 139 cars entered at the top (76 from Alcatraz Ave west, 50 from the east, 13 from the north), 39 drove the whole street, 45% of the block's trips (72 veh/h) went to a freeway and 22% came by way of Telegraph Ave. ASSUMPTION: freeway-bound cars that did not join mid-street are 46 veh/h (72 x 139 / (139 + 79)), 0.365 of the 126 turn-ins; low = the whole-street share (0.31), high = the unadjusted freeway share (0.57). The Telegraph Ave cars are the 22% x 160 = 35 of the 76 west turn-ins.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Southbound Telegraph Ave traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (35 Telegraph Ave cars x 0.365) | 13 (11 to 20) | 13 | within |
| Alcatraz Ave west, Ashby Ave and West Berkeley traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (41 other west turn-ins x 0.365) | 15 (13 to 23) | 23 | within |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (50 east turn-ins x 0.365) | 18 (15 to 29) | 40 | above |
| Intents listed, together | | 46 (39 to 72) | 76 | |
| Other through cars (no intent listed) | | | 140 | |

Model through cars by origin and destination group (largest 12 of 27 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 73.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 23.0 | Telegraph Avenue |
| Ashby Ave from the west (Emeryville and I-80) | College Ave from the north (Berkeley) | 21.0 | Alcatraz Avenue then College Avenue |
| Telegraph Ave from the north (Berkeley) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 15.0 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 12.0 | Claremont Avenue then SR-24 |
| West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 11.0 | College Avenue |
| Shattuck Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 9.0 | none near the study area |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 9.0 | Telegraph Avenue |
| West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) | SR-24 westbound on-ramps (toward Oakland and I-980) | 6.0 | none near the study area |
| Ashby Ave from the west (Emeryville and I-80) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 5.0 | SR-24 |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 5.0 | College Avenue then Claremont Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | West Oakland to the southwest (Adeline St, Market St) | 4.0 | Telegraph Avenue |
| other pairs | | 23.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 127 veh/h; Alcatraz Avenue then College Avenue 23 veh/h; none near the study area 23 veh/h; Claremont Avenue then SR-24 12 veh/h; College Avenue 11 veh/h; SR-24 7 veh/h.

### Study area, all residential and service streets

Model: 971 through cars per hour.

Model through cars by origin and destination group (largest 12 of 75 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 149.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 96.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 73.0 | Telegraph Avenue |
| Ashby Ave from the west (Emeryville and I-80) | College Ave from the north (Berkeley) | 54.0 | Alcatraz Avenue then College Avenue |
| Telegraph Ave from the north (Berkeley) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 47.0 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 47.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 44.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 42.0 | Claremont Avenue then College Avenue |
| West Oakland to the southwest (Adeline St, Market St) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 31.0 | Telegraph Avenue then Claremont Avenue |
| Telegraph Ave to the south (downtown Oakland) | SR-24 westbound on-ramps (toward Oakland and I-980) | 30.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Emeryville and West Oakland streets (55th to 67th Streets) | 25.0 | Claremont Avenue |
| West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) | SR-24 westbound on-ramps (toward Oakland and I-980) | 23.0 | none near the study area |
| other pairs | | 310.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 547 veh/h; none near the study area 85 veh/h; Alcatraz Avenue then College Avenue 64 veh/h; Claremont Avenue 60 veh/h; Claremont Avenue then College Avenue 42 veh/h; SR-24 34 veh/h.

By origin group: Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 280; South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 134; SR-24 eastbound off-ramps (arriving from Oakland and I-980) 132; Telegraph Ave from the north (Berkeley) 99; Ashby Ave from the west (Emeryville and I-80) 74; Telegraph Ave to the south (downtown Oakland) 50; West Oakland to the southwest (Adeline St, Market St) 46; West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) 41; Claremont Ave and Tunnel Rd toward the hills 25; College Ave from the north (Berkeley) 24.

By destination group: SR-24 westbound on-ramps (toward Oakland and I-980) 262; South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 251; Telegraph Ave from the north (Berkeley) 129; Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 112; College Ave from the north (Berkeley) 67; Claremont Ave and Tunnel Rd toward the hills 42; Emeryville and West Oakland streets (55th to 67th Streets) 28; San Pablo Ave (Emeryville and West Oakland) 16; Shattuck Ave from the north (Berkeley) 15; West Oakland to the southwest (Adeline St, Market St) 10.


## Through cars by intent (cut-through intent view)

A through car is tallied once, under the first intent that fits it (the on-ramp on its planned route, the off-ramp it has driven, or the origin and destination groups of its trip), at the moment the through count counts it. Cars an hour over the run, the same window as the through-car figure (983 an hour).

| Intent | Basis | Cars an hour | Share |
| --- | --- | --- | --- |
| on-2853241697 | observed | 268 | 27% |
| Other on-ramps | assumed | 13 | 1% |
| off-52990846 | observed | 136 | 14% |
| Other off-ramps | assumed | 11 | 1% |
| Downtown, south and west Oakland traffic using side streets to reach Berkeley and Telegraph Ave north | assumed | 128 | 13% |
| Berkeley and Telegraph Ave north traffic using side streets to reach downtown, south and west Oakland | assumed | 217 | 22% |
| Oakland cross-town traffic (West Oakland, Broadway, Piedmont, Emeryville) using side streets near Claremont Ave and Telegraph Ave | assumed | 70 | 7% |
| Other (no intent listed) |  | 140 | 14% |

Intents listed cover 86% of through cars.


## Select-link shares: modeled vs observed (design D5: headline = freeway shares, tolerance +/-10 pp)

- Hillegass Avenue NB: 4 links (path Claremont Avenue -> Alcatraz Avenue (434 m)), 252 trips (226 completed)
- Colby Street NB: 8 links (path Claremont Avenue -> Alcatraz Avenue (680 m)), 296 trips (270 completed)
- Hillegass Avenue SB: 4 links (path Alcatraz Avenue -> Claremont Avenue (433 m)), 329 trips (296 completed)
- Colby Street SB: 8 links (path Alcatraz Avenue -> Claremont Avenue (680 m)), 395 trips (356 completed)

| Block | Side | Via | Observed | Modeled | Diff (pp) | n trips | Headline |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue NB | from | freeway | 47% | 50% | +3 | 252 | within |
| Hillegass Avenue NB | to | Benvenue Avenue | 21% (PM 33%) | 5% | -28 | 252 |  |
| Hillegass Avenue NB | to | College Avenue | 6% | 20% | +14 | 252 |  |
| Hillegass Avenue NB | to | Alcatraz Avenue WB | 27% | 23% | -4 | 252 |  |
| Colby Street NB | from | freeway | 47% | 43% | -4 | 296 | within |
| Colby Street NB | to | Alcatraz Avenue WB | 48% | 45% | -3 | 296 |  |
| Colby Street NB | to | Telegraph Avenue | 25% | 43% | +18 | 296 |  |
| Colby Street NB | to | College Avenue | 3% | 5% | +2 | 296 |  |
| Hillegass Avenue SB | from | Alcatraz Avenue WB | 46% | 26% | -20 | 329 |  |
| Hillegass Avenue SB | from | Benvenue Avenue | 26% | 7% | -19 | 329 |  |
| Hillegass Avenue SB | from | College Avenue | 16% | 14% | -2 | 329 |  |
| Hillegass Avenue SB | to | freeway | 57% (PM 68%) | 47% | -21 | 329 | OUTSIDE |
| Colby Street SB | from | Alcatraz Avenue EB | 43% | 29% | -14 | 395 |  |
| Colby Street SB | from | Alcatraz Avenue WB | 46% | 15% | -31 | 395 |  |
| Colby Street SB | from | Telegraph Avenue | 22% | 33% | +11 | 395 |  |
| Colby Street SB | to | freeway | 45% | 31% | -14 | 395 | OUTSIDE |
| Colby Street SB | to | Forest Street | 34% | 24% | -10 | 395 |  |

Headline shares within tolerance: 2 of 4. Observed column uses the PM-peak share where one is given and the period is pm_peak. 'Via' shares are the fraction of select-link trips using that street before (from) or after (to) the block; freeway = origin / destination gate with a motorway-class link attached.

## Claremont ramps: streets used before the on-ramp / after the off-ramp

Observed shares are for traffic from/to the north only. 'Modeled' is over all trips on the ramps and any visit to the street (an upper bound for streets that serve both sides). 'Modeled, side' counts only trips whose surface end lies on the side of the ramp stated in the targets file (`freewayRamp.side`), and for a street with a qualifier ("north of X") only its links on that side of X.

| Direction | Via | Observed | Modeled | n ramp trips | Modeled, side | n side trips |
| --- | --- | --- | --- | --- | --- | --- |
| onto freeway | College Avenue | 16% | 11% | 879 | 12% | 776 |
| onto freeway | Hillegass Avenue | 12% | 14% | 879 | 15% | 776 |
| onto freeway | Martin Street | 10% | 15% | 879 | 13% | 776 |
| onto freeway | Colby Street | 8% | 10% | 879 | 12% | 776 |
| onto freeway | Telegraph Avenue north of Alcatraz Avenue | 8% | 20% | 879 | 15% | 776 |
| onto freeway | Benvenue Avenue | 5% | 3% | 879 | 3% | 776 |
| from freeway | College Avenue | 10% | 9% | 770 | 10% | 737 |
| from freeway | Martin Street | 10% | 11% | 770 | 11% | 737 |
| from freeway | Colby Street | 8% | 12% | 770 | 13% | 737 |
| from freeway | Hillegass Avenue | 5% | 7% | 770 | 8% | 737 |
| from freeway | Benvenue Avenue | 3% | 2% | 770 | 2% | 737 |

## Top 15 links by delay

| Link | Street | Class | Lanes | Len (m) | End node control | Delay (veh-h) | Stopped (veh-h) | Mean stopped veh | Flow (veh/h) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 4143 | Adeline Street | Secondary | 3 | 185 | signal | 31.55 | 27.54 | 27.5 | 517 |
| 4397 | Ashby Avenue | Primary | 2 | 96 | signal | 13.22 | 10.46 | 10.5 | 475 |
| 1025 | Martin Luther King Junior Way | Secondary | 3 | 79 | signal | 11.64 | 10.23 | 10.2 | 413 |
| 1108 | Market Street | Secondary | 4 | 36 | signal | 10.21 | 9.24 | 9.2 | 739 |
| 2921 | Russell Street | Residential | 1 | 260 | uncontrolled | 9.94 | 8.10 | 8.1 | 190 |
| 711 | 55th Street | Tertiary | 1 | 238 | signal | 8.64 | 6.93 | 6.9 | 318 |
| 1024 | Martin Luther King Junior Way | Secondary | 3 | 75 | two_way_stop | 8.63 | 7.15 | 7.1 | 554 |
| 4382 | Warren Freeway | Motorway | 2 | 744 | uncontrolled | 7.53 | 2.56 | 2.6 | 1043 |
| 460 | Sacramento Street | Tertiary | 2 | 104 | two_way_stop | 7.00 | 5.79 | 5.8 | 367 |
| 1607 | Telegraph Avenue | Secondary | 2 | 94 | signal | 6.93 | 4.45 | 4.5 | 1229 |
| 1002 | Adeline Street | Secondary | 3 | 71 | uncontrolled | 6.84 | 6.04 | 6.0 | 542 |
| 1116 | Market Street | Tertiary | 2 | 87 | uncontrolled | 6.59 | 5.97 | 6.0 | 238 |
| 1049 | Adeline Street | Secondary | 4 | 43 | signal | 6.52 | 5.65 | 5.6 | 536 |
| 3395 | Ashby Avenue | Primary | 1 | 129 | signal | 6.45 | 4.47 | 4.5 | 502 |
| 2819 | College Avenue | Tertiary | 2 | 50 | signal | 6.42 | 5.39 | 5.4 | 584 |

## Top 15 nodes by blocked time

Blocked time = lane-head seconds waiting at the stop line without permission (signal red, conflict, stop sign or no downstream space).

| Node | Streets | Control | Gate | Blocked (lane-h) | of which no downstream space | Signal plan at end (cycle: greens) |
| --- | --- | --- | --- | --- | --- | --- |
| 446 | Market Street / Stanford Avenue | signal |  | 5.20 | 0.18 | 90 s: 65/15 |
| 680 | 52nd Street / Shattuck Avenue | signal |  | 4.91 | 0.10 | 110 s: 30/28/38 |
| 1080 | 62nd Street / Claremont Avenue / College Avenue | signal |  | 4.44 | 0.16 | 75 s: 21/21/18 |
| 447 | Adeline Street / Alcatraz Avenue | signal |  | 4.24 | 0.51 | 75 s: 25/40 |
| 479 | Adeline Street / Martin Luther King Junior Way / Stanford Avenue | signal |  | 3.69 | 0.04 | 120 s: 25/85 |
| 185 | Alcatraz Avenue / Sacramento Street | signal |  | 3.47 | 0.25 | 75 s: 39/26 |
| 30 | 57th Street / Adeline Street / Market Street | signal |  | 3.34 | 0.06 | 75 s: 17/24/18 |
| 37 | San Pablo Avenue / Stanford Avenue | signal |  | 3.15 | 0.05 | 75 s: 32/33 |
| 1069 | Claremont Avenue / Colby Street / Forest Street | signal |  | 2.99 | 0.03 | 79 s: 24/4/36 |
| 1406 | Ashby Avenue / Claremont Avenue | signal |  | 2.93 | 0.23 | 75 s: 49/16 |
| 944 | Ashby Avenue / Shattuck Avenue | signal |  | 2.86 | 0.12 | 75 s: 50/15 |
| 242 | Ashby Avenue / Martin Luther King Junior Way | signal |  | 2.84 | 0.00 | 75 s: 45/20 |
| 851 | Alcatraz Avenue / Telegraph Avenue | signal |  | 2.76 | 0.09 | 75 s: 50/15 |
| 1373 | Ashby Avenue / Domingo Avenue / Tunnel Road | signal |  | 2.67 | 0.09 | 75 s: 30/35 |
| 331 | 52nd Street / Martin Luther King Junior Way | signal |  | 2.67 | 0.03 | 75 s: 45/20 |

Phases of the five most blocked signals (green s: approach links with their lanes, link ids in brackets):

- node 446: 65 s: Stanford Avenue 1L [941], Stanford Avenue 3L [1055]; 15 s: Market Street 4L [1108], Market Street 3L [1111]
- node 680: 30 s: 52nd Street 4L [1662]; 28 s: 52nd Street 4L [1666], 52nd Street 4L [1662]; 38 s: Shattuck Avenue 2L [1653], Shattuck Avenue 2L [1705]
- node 1080: 21 s: Claremont Avenue 2L [2756], Claremont Avenue 2L [2798]; 21 s: College Avenue 2L [2761], College Avenue 2L [2819]; 18 s: 62nd Street 1L [2622]
- node 447: 25 s: Adeline Street 4L [1049], Adeline Street 4L [1051]; 40 s: Alcatraz Avenue 2L [1048], Alcatraz Avenue 2L [1133]
- node 479: 25 s: Martin Luther King Junior Way 3L [1025], Adeline Street 3L [4143]; 85 s: Stanford Avenue 1L [4139]

## Gridlock removals by link (top 10)

| Link | Street | End node | Control | Removals | First at (min) |
| --- | --- | --- | --- | --- | --- |
| 934 | 60th Street | 60th Street / Market Street | two_way_stop | 1 | 18.9 |
| 1048 | Alcatraz Avenue | Adeline Street / Alcatraz Avenue | signal | 1 | 31.4 |
| 922 | King Street | Alcatraz Avenue / King Street | two_way_stop | 1 | 32.1 |

## Junction recovery

Policy `physical`. Node entries by cars and cyclists in the run: 793403 (settle interval 0). An admission is an entry the ordinary rule would have refused; head-seconds count the time a waiting head vehicle had the reason invoked, and the part of it in which it still could not enter. Courtesy and the yield fallback change priority only; under `physical` the conflict bypass never admits.

| Reason | Admissions per hour | Per 1,000 entries | Head-s invoked | Head-s blocked |
| --- | --- | --- | --- | --- |
| courtesy | 465.0 | 0.586 | 1968 | 1813 |
| yield fallback | 224.0 | 0.282 | 68 | 0 |
| conflict bypass | 0.0 | 0.000 | 41 | 41 |

Vehicles removed while held in a node by a full exit: 0 (0.0 per hour, included in the gridlock removals).

| Node | Streets | Control | Courtesy | Yield fallback | Conflict bypass | Held removals |
| --- | --- | --- | --- | --- | --- | --- |
| 436 | 62nd Street / Adeline Street / Stanford Avenue | two_way_stop | 25 | 2 | 0 | 0 |
| 1429 | Claremont Avenue / Claremont Boulevard | two_way_stop | 23 | 2 | 0 | 0 |
| 165 | Alcatraz Avenue / Baker Street | two_way_stop | 15 | 7 | 0 | 0 |
| 342 | 56th Street / Shattuck Avenue | two_way_stop | 6 | 14 | 0 | 0 |
| 492 | Aileen Street / Shattuck Avenue | two_way_stop | 4 | 13 | 0 | 0 |
| 1080 | 62nd Street / Claremont Avenue / College Avenue | signal | 16 | 0 | 0 | 0 |
| 457 | Alcatraz Avenue / California Street | two_way_stop | 7 | 8 | 0 | 0 |
| 824 | 57th Street / Telegraph Avenue | two_way_stop | 7 | 8 | 0 | 0 |
| 437 | Adeline Street / Genoa Street | two_way_stop | 9 | 4 | 0 | 0 |
| 528 | Shattuck Avenue / Woolsey Street | two_way_stop | 5 | 8 | 0 | 0 |

## Entry backlog by origin node at end of run (top 10)

| Node | Streets | Trips waiting | Offered veh/h (before scale) |
| --- | --- | --- | --- |
| 648 | 54th Street / Shattuck Avenue | 2 | 20 |
| 654 | 53rd Street / Shattuck Avenue | 2 | 19 |
| 702 | Aileen Street / Telegraph Avenue | 2 | 14 |
| 924 | Ashby Avenue / Regent Street | 2 | 40 |
| 1080 | 62nd Street / Claremont Avenue / College Avenue | 2 | 142 |
| 448 | Adeline Street / Harmon Street | 1 | 10 |
| 1089 | 63rd Street / College Avenue | 1 | 342 |
| 1183 | Ashby Avenue / Elmwood Court | 1 | 2 |

## Flow on key streets (veh/h per direction, study-area links of 40 m or more)

| Street | Direction of travel | Links | Median flow | Max flow |
| --- | --- | --- | --- | --- |
| Telegraph | N | 12 | 1039 | 1135 |
| Telegraph | S | 10 | 1019 | 1073 |
| College | N | 3 | 412 | 416 |
| College | S | 3 | 584 | 589 |
| Claremont | N | 6 | 497 | 701 |
| Claremont | S | 7 | 439 | 919 |
| Alcatraz | E | 6 | 454 | 517 |
| Alcatraz | W | 6 | 295 | 336 |
| Hillegass | N | 4 | 145 | 149 |
| Hillegass | S | 4 | 233 | 280 |
| Colby | N | 7 | 148 | 196 |
| Colby | S | 7 | 206 | 281 |
| Martin | E | 2 | 168 | 168 |
| Martin | W | 2 | 110 | 110 |

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
