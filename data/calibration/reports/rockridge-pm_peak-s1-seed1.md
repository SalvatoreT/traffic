# Calibration report: rockridge pm_peak scale 1 seed 1 (60 min)

Offered demand 25252 veh/h x scale 1 = 25252 veh/h. Run took 27.9 s wall clock. Flow tables use the window after a 10 min warm-up; select-link and health figures cover the whole run from an empty network.

## Stability (design D4)

| Criterion | Threshold | Value | Result |
| --- | --- | --- | --- |
| Gridlock removals | 0 | 0 | pass |
| Backlog / spawned | < 2% | 0.1% (15 of 25147) | pass |
| Arterial mean speed (run) | > 4 m/s | 9.31 m/s (last 15 min 9.17) | pass |

Overall: **STABLE**. Mean trip delay 134 s, mean trip time 423 s, completed 24360, unroutable 0.

| t (min) | vehicles in network | backlog | completed | removals | arterial speed in interval (m/s) |
| --- | --- | --- | --- | --- | --- |
| 5 | 2857 | 9 | 2075 | 0 | 9.55 |
| 10 | 3060 | 6 | 4033 | 0 | 9.45 |
| 15 | 3120 | 4 | 6085 | 0 | 9.06 |
| 20 | 3168 | 6 | 8117 | 0 | 9.22 |
| 25 | 3160 | 4 | 10193 | 0 | 9.49 |
| 30 | 3200 | 4 | 12267 | 0 | 9.64 |
| 35 | 3265 | 1 | 14302 | 0 | 9.40 |
| 40 | 3376 | 15 | 16298 | 0 | 9.01 |
| 45 | 3419 | 6 | 18313 | 0 | 9.37 |
| 50 | 3504 | 12 | 20314 | 0 | 9.24 |
| 55 | 3667 | 12 | 22292 | 0 | 9.05 |
| 60 | 3681 | 15 | 24360 | 0 | 9.22 |
## Wandering (completed car trips)

Detour ratio = distance driven (link and movement lengths) over the shortest network distance from the trip's origin to its destination. Detour against the free-flow route uses the time-shortest route with no congestion and no noise, which is what a purposeful driver without live information would follow (it differs from the shortest distance when a faster, longer road exists). A switch is a change of the remaining route while en route. Loops: the same link twice or the same node three or more times. Reversals: a link followed by its reverse within 200 m. 'Study-area vehicle-miles' are miles driven on links inside the study area; the last column is the share of them driven by trips with a detour ratio above 1.3. Guided drivers re-evaluate their route every epoch; the others keep their departure route unless it is blocked.

| Trips | n | Switches per trip | With a switch | Mean detour | Median detour | Detour > 1.3 | Detour > 2 | Mean detour vs free-flow route | Vs free-flow route > 1.3 | Loops | Reversals | Study veh-miles | Of them by detour > 1.3 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| all trips | 22340 | 0.01 | 0.6% | 1.087 | 1.049 | 4.6% | 0.0% | 1.026 | 1.5% | 0.0% | 5.3% | 2385 | 7.9% |
| gate to gate | 8009 | 0.01 | 0.9% | 1.084 | 1.050 | 2.8% | 0.0% | 1.021 | 0.9% | 0.0% | 7.8% | 570 | 7.6% |
| with a local end | 14331 | 0.00 | 0.5% | 1.088 | 1.049 | 5.5% | 0.0% | 1.029 | 1.9% | 0.0% | 3.8% | 1816 | 8.0% |
| guided drivers | 10226 | 0.01 | 1.3% | 1.087 | 1.050 | 4.6% | 0.0% | 1.026 | 1.6% | 0.0% | 5.4% | 1091 | 7.0% |
| other drivers | 12114 | 0.00 | 0.0% | 1.086 | 1.049 | 4.5% | 0.0% | 1.026 | 1.5% | 0.0% | 5.1% | 1294 | 8.6% |

## Reported patterns (diagnostics; configured in the targets file under `patterns`)

(a) Trips between the surface gates on the north side of the ramps and the freeway mainline gates, and the local-street (residential and service links in the study area) vehicle-miles they drive. Share = of all completed trips' local-street vehicle-miles (450 miles). No observed counterpart exists for this quantity (the targets file has only the select-link shares above).

| Trips | n trips | Local-street veh-miles | Share of all local-street veh-miles |
| --- | --- | --- | --- |
| surface gates to the freeway | 1777 | 42.4 | 9% |
| freeway to the surface gates | 929 | 29.7 | 7% |

(b) Corridor trips: completed trips from beyond one end of the corridor's study-area extent (the bypass street and its arterial together) to beyond the other end, within a lateral limit of the corridor, by direction. 'Bypass' = at least N blocks (links) on the bypass street; 'arterial' = fewer bypass blocks and at least N on the arterial; 'other' = neither (another street, the freeway or a short use); blocks are counted on the corridor's study-area links. No observed counterpart exists for these shares. The related observed values are in the select-link table above: northbound Hillegass Ave traffic rarely ends on College Ave (6%), 21 to 33% jogs to Benvenue Ave, and southbound freeway-bound drivers on College Ave commonly arrive via Ashby Ave and Benvenue Ave and jog to Hillegass Ave.

| Bypass | Arterial | N | Direction | Corridor trips | Bypass | Arterial | Other | Mean bypass blocks |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue | College Avenue | 3 | N | 1483 | 2% | 17% | 81% | 0.1 |
| Hillegass Avenue | College Avenue | 3 | S | 1446 | 5% | 24% | 70% | 0.2 |

## Per-mode results

Offered: 25252 car veh/h; 626 bicycle flows (764/h); 2000 pedestrian flows (1731/h). Bicycle and pedestrian volumes are assumptions, not counts.

| Mode | In network | Completed | Mean time (s) | Other |
| --- | --- | --- | --- | --- |
| Car | 3681 | 24360 | 423 | |
| Bicycle | 62 | 779 | 265 | |
| Pedestrian | 223 | 1617 | 446 | mean crossing delay 8.7 s |

Vulnerable road users (surrogate indicators): pedestrian conflicts 375, bicycle conflicts 505, close passes 496, pedestrian injury-risk index 0.049, bicycle injury-risk index 0.066 (proxy), mean vehicle speed at pedestrian encounters 2.51 m/s.


## Through cars on the counted blocks (a car is through when neither trip end is in the study area)

Observed through range = from the cars that drove the whole street (volunteer count, a lower bound) to the block volume less the cars whose trip ends along the street (an upper bound). Observed freeway-end trips = observed block volume times the observed freeway share of the street (the headline share of the targets file); these include freeway trips that end inside the study area, so they are not an expected through count. Modeled through = select-link trips with no end in the study area, per hour. Modeled freeway = select-link trips from or to a freeway node, per hour.

| Block | Observed volume (veh/h) | Observed freeway share | Observed freeway-end trips (veh/h) | Observed through range (veh/h) | Modeled through (veh/h) | In range | Modeled freeway trips (veh/h) |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue NB | 110 | 47.0% | 52 | 48 to 95 | 62 | yes | 116 |
| Colby Street NB | 174 | 47.0% | 82 | 102 to 145 | 122 | yes | 96 |
| Hillegass Avenue SB | 160 | 68.0% | 109 | 79 to 120 | 118 | yes | 143 |
| Colby Street SB | 160 | 45.0% | 72 | 39 to 117 | 115 | yes | 126 |

## Intent map: through cars by where they come from and where they are going

Through = neither trip end is in the study area. Groups are the approach groups of the area config (data/areas); a node that is not a gate takes the group of the nearest surface gate (ASSUMPTION). The arterial is the one a trip would use on the shortest free-flow path with the study area's residential and service streets closed, where that path runs on a boundary street near the study area.

Model figures are the mean of 1 seed(s), per hour of the run. Basis: OBSERVED = read from the resident volunteer count of Feb 25, 2025 or its headline shares; ASSUMPTION = inferred from those numbers or chosen.

### Colby Street NB

Observed: block volume 174 veh/h, whole-street cars 102, so through cars 102 to 145 veh/h. Model: 122 through cars per hour.

Observed (PM): 182 cars entered at the south end, 102 drove the whole street, 164 left it at Alcatraz Ave (131 left, 32 right, 1 straight), and 47% of the block's trips came from a freeway (the headline share). ASSUMPTION: freeway-origin cars that do not end along the street are 65 veh/h (the 82 freeway-origin trips on the block, 47% of 174, times the 182 / (182 + 47) of its cars that entered at the south end rather than joining on the way), spread over the 164 exits in proportion (0.40); the other through cars come from the Telegraph Ave and south-side approaches that feed the street's south end. Ranges: low = 131 (32) x 0.47 x 0.62 (the whole-street share of exits), high = 131 (32) x 0.47.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | OBSERVED turn count x ASSUMPTION share (131 left turns x 0.40) | 52 (38 to 62) | 43 | within |
| Telegraph Ave and south-side traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | ASSUMPTION: the through left-turners (131 x 0.62 = 81) that are not off-ramp traffic | 29 (19 to 43) | 40 | within |
| SR-24 off-ramp traffic using Colby St to reach College Ave and Berkeley (right at Alcatraz Ave) | OBSERVED turn count x ASSUMPTION share (32 right turns x 0.40) | 13 (9 to 15) | 16 | above |
| Telegraph Ave and south-side traffic using Colby St to reach College Ave and Berkeley | ASSUMPTION: the through right-turners (32 x 0.62 = 20) that are not off-ramp traffic | 7 (5 to 11) | 22 | above |
| Intents listed, together | | 101 (71 to 131) | 121 | |
| Other through cars (no intent listed) | | | 1 | |

Model through cars by origin and destination group (largest 12 of 22 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 27.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 14.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 9.0 | Claremont Avenue then College Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Ashby Ave from the west (Emeryville and I-80) | 9.0 | SR-24 then Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 8.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Ashby Ave from the west (Emeryville and I-80) | 7.0 | none near the study area |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 7.0 | SR-24 |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Shattuck Ave from the north (Berkeley) | 6.0 | Claremont Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Emeryville and West Oakland streets (55th to 67th Streets) | 6.0 | Claremont Avenue |
| Telegraph Ave to the south (downtown Oakland) | Telegraph Ave from the north (Berkeley) | 6.0 | Telegraph Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Telegraph Ave from the north (Berkeley) | 5.0 | Telegraph Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Telegraph Ave from the north (Berkeley) | 5.0 | none near the study area |
| other pairs | | 13.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 62 veh/h; Claremont Avenue 17 veh/h; none near the study area 12 veh/h; Claremont Avenue then College Avenue 9 veh/h; SR-24 then Telegraph Avenue 9 veh/h; SR-24 7 veh/h.

### Hillegass Avenue NB

Observed: block volume 110 veh/h, whole-street cars 48, so through cars 48 to 95 veh/h. Model: 62 through cars per hour.

Observed (PM): 94 cars entered at the south end, 48 drove the whole street, 109 left it at Alcatraz Ave (43 west, 54 east, 12 straight), and 47% of the block's trips came from a freeway. ASSUMPTION: freeway-origin through cars are 40 veh/h (52 freeway-origin trips times 94 / (94 + 29)), spread over the exits in proportion (0.37); the through share of exits is 48 / 109 = 0.44.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Hillegass Ave to reach Alcatraz Ave west and Telegraph Ave north | OBSERVED turn count x ASSUMPTION share (43 left turns x 0.37) | 16 (9 to 20) | 22 | above |
| SR-24 off-ramp traffic using Hillegass Ave to reach College Ave and Berkeley | OBSERVED turn count x ASSUMPTION share (54 right turns x 0.37) | 20 (11 to 25) | 21 | within |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach Alcatraz Ave west | ASSUMPTION: through exits (43 x 0.44) that are not off-ramp traffic | 3 (0 to 10) | 3 | within |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach College Ave and Berkeley | ASSUMPTION: through exits (54 x 0.44) that are not off-ramp traffic | 4 (0 to 13) | 14 | above |
| Intents listed, together | | 43 (20 to 68) | 60 | |
| Other through cars (no intent listed) | | | 2 | |

Model through cars by origin and destination group (largest 12 of 19 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 14.0 | SR-24 |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 12.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 7.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | College Ave from the north (Berkeley) | 4.0 | SR-24 then Claremont Avenue then College Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 3.0 | Telegraph Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | San Pablo Ave (Emeryville and West Oakland) | 3.0 | SR-24 |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Shattuck Ave from the north (Berkeley) | 3.0 | SR-24 then Telegraph Avenue then Alcatraz Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Telegraph Ave from the north (Berkeley) | 3.0 | none near the study area |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 3.0 | SR-24 then Claremont Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Alcatraz Ave from the west (Emeryville side) | 1.0 | Claremont Avenue then Alcatraz Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Alcatraz Ave from the west (Emeryville side) | 1.0 | Claremont Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | San Pablo Ave (Emeryville and West Oakland) | 1.0 | College Avenue then Alcatraz Avenue |
| other pairs | | 7.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 25 veh/h; SR-24 17 veh/h; SR-24 then Claremont Avenue then College Avenue 4 veh/h; SR-24 then Claremont Avenue 3 veh/h; SR-24 then Telegraph Avenue then Alcatraz Avenue 3 veh/h; none near the study area 3 veh/h.

### Hillegass Avenue SB

Observed: block volume 160 veh/h, whole-street cars 79, so through cars 79 to 120 veh/h. Model: 118 through cars per hour.

Observed (PM): 178 cars entered at the top (76 turned in from Alcatraz Ave west, 98 from the east, 4 came straight from the north), 79 drove the whole street, and 68% of the block's trips (109 veh/h) went to a freeway. ASSUMPTION: freeway-bound cars that did not join mid-street are 87 veh/h (109 x 178 / (178 + 44)), half of the 174 turn-ins; low = the whole-street share of the turn-ins (0.45), high = the freeway-bound share without the mid-street correction (0.63).

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Telegraph Ave, Alcatraz Ave west and West Berkeley traffic turning off Alcatraz Ave onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (76 turn-ins x 0.50) | 38 (34 to 48) | 43 | within |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (98 turn-ins x 0.50) | 49 (44 to 62) | 60 | within |
| Intents listed, together | | 87 (78 to 110) | 103 | |
| Other through cars (no intent listed) | | | 15 | |

Model through cars by origin and destination group (largest 12 of 14 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 43.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 29.0 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 14.0 | Claremont Avenue then SR-24 |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 13.0 | College Avenue then Claremont Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 5.0 | Telegraph Avenue |
| Ashby Ave from the west (Emeryville and I-80) | College Ave from the north (Berkeley) | 3.0 | Alcatraz Avenue then College Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 2.0 | Alcatraz Avenue then College Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 2.0 | Claremont Avenue |
| Berkeley hills to the northeast (Evergreen Ln, Gravatt Dr) | SR-24 westbound on-ramps (toward Oakland and I-980) | 2.0 | Claremont Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Oakland hills to the east (Broadway Terrace, Mountain Blvd, Moraga Ave) | 1.0 | Alcatraz Avenue then College Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Telegraph Ave to the south (downtown Oakland) | 1.0 | Telegraph Avenue |
| West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 1.0 | College Avenue |
| other pairs | | 2.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 79 veh/h; Claremont Avenue then SR-24 16 veh/h; College Avenue then Claremont Avenue then SR-24 13 veh/h; Alcatraz Avenue then College Avenue 6 veh/h; Claremont Avenue 2 veh/h; Alcatraz Avenue then Claremont Avenue 1 veh/h.

### Colby Street SB

Observed: block volume 160 veh/h, whole-street cars 39, so through cars 39 to 117 veh/h. Model: 115 through cars per hour.

Observed (PM): 139 cars entered at the top (76 from Alcatraz Ave west, 50 from the east, 13 from the north), 39 drove the whole street, 45% of the block's trips (72 veh/h) went to a freeway and 22% came by way of Telegraph Ave. ASSUMPTION: freeway-bound cars that did not join mid-street are 46 veh/h (72 x 139 / (139 + 79)), 0.365 of the 126 turn-ins; low = the whole-street share (0.31), high = the unadjusted freeway share (0.57). The Telegraph Ave cars are the 22% x 160 = 35 of the 76 west turn-ins.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Southbound Telegraph Ave traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (35 Telegraph Ave cars x 0.365) | 13 (11 to 20) | 19 | within |
| Alcatraz Ave west, Ashby Ave and West Berkeley traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (41 other west turn-ins x 0.365) | 15 (13 to 23) | 17 | within |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (50 east turn-ins x 0.365) | 18 (15 to 29) | 47 | above |
| Intents listed, together | | 46 (39 to 72) | 83 | |
| Other through cars (no intent listed) | | | 32 | |

Model through cars by origin and destination group (largest 12 of 19 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 32.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 20.0 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 19.0 | Telegraph Avenue |
| Shattuck Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 8.0 | none near the study area |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 7.0 | Claremont Avenue then SR-24 |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 7.0 | College Avenue then Claremont Avenue then SR-24 |
| Alcatraz Ave from the west (Emeryville side) | SR-13 Warren Freeway (via SR-24 east) | 4.0 | SR-24 |
| Telegraph Ave from the north (Berkeley) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 4.0 | Telegraph Avenue |
| Alcatraz Ave from the west (Emeryville side) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 2.0 | SR-24 |
| Ashby Ave from the west (Emeryville and I-80) | SR-13 Warren Freeway (via SR-24 east) | 2.0 | SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 2.0 | Alcatraz Avenue then College Avenue |
| Ashby Ave from the west (Emeryville and I-80) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 1.0 | Claremont Avenue |
| other pairs | | 7.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 77 veh/h; SR-24 10 veh/h; none near the study area 9 veh/h; Claremont Avenue then SR-24 7 veh/h; College Avenue then Claremont Avenue then SR-24 7 veh/h; Alcatraz Avenue then College Avenue 2 veh/h.

### Study area, all residential and service streets

Model: 643 through cars per hour.

Model through cars by origin and destination group (largest 12 of 57 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 99.0 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 68.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 46.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 45.0 | Telegraph Avenue |
| West Oakland to the southwest (Adeline St, Market St) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 36.0 | Telegraph Avenue then Claremont Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 36.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 32.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Emeryville and West Oakland streets (55th to 67th Streets) | 22.0 | Claremont Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 21.0 | SR-24 |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 20.0 | Claremont Avenue then SR-24 |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 18.0 | Claremont Avenue then College Avenue |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 17.0 | College Avenue then Claremont Avenue then SR-24 |
| other pairs | | 183.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 386 veh/h; Claremont Avenue 50 veh/h; SR-24 37 veh/h; Telegraph Avenue then Claremont Avenue 36 veh/h; none near the study area 26 veh/h; Claremont Avenue then SR-24 22 veh/h.

By origin group: Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 156; SR-24 eastbound off-ramps (arriving from Oakland and I-980) 108; South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 98; Telegraph Ave from the north (Berkeley) 82; West Oakland to the southwest (Adeline St, Market St) 66; SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) 27; Telegraph Ave to the south (downtown Oakland) 24; Claremont Ave and Tunnel Rd toward the hills 22; College Ave from the north (Berkeley) 18; Ashby Ave from the west (Emeryville and I-80) 15.

By destination group: SR-24 westbound on-ramps (toward Oakland and I-980) 227; South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 103; Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 85; Telegraph Ave from the north (Berkeley) 85; Claremont Ave and Tunnel Rd toward the hills 36; Emeryville and West Oakland streets (55th to 67th Streets) 22; College Ave from the north (Berkeley) 18; Ashby Ave from the west (Emeryville and I-80) 17; Shattuck Ave from the north (Berkeley) 16; San Pablo Ave (Emeryville and West Oakland) 7.


## Select-link shares: modeled vs observed (design D5: headline = freeway shares, tolerance +/-10 pp)

- Hillegass Avenue NB: 4 links (path Claremont Avenue -> Alcatraz Avenue (434 m)), 205 trips (190 completed)
- Colby Street NB: 8 links (path Claremont Avenue -> Alcatraz Avenue (680 m)), 285 trips (250 completed)
- Hillegass Avenue SB: 4 links (path Alcatraz Avenue -> Claremont Avenue (433 m)), 209 trips (182 completed)
- Colby Street SB: 8 links (path Alcatraz Avenue -> Claremont Avenue (680 m)), 286 trips (263 completed)

| Block | Side | Via | Observed | Modeled | Diff (pp) | n trips | Headline |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue NB | from | freeway | 47% | 53% | +6 | 205 | within |
| Hillegass Avenue NB | to | Benvenue Avenue | 21% (PM 33%) | 5% | -28 | 205 |  |
| Hillegass Avenue NB | to | College Avenue | 6% | 13% | +7 | 205 |  |
| Hillegass Avenue NB | to | Alcatraz Avenue WB | 27% | 30% | +3 | 205 |  |
| Colby Street NB | from | freeway | 47% | 32% | -15 | 285 | OUTSIDE |
| Colby Street NB | to | Alcatraz Avenue WB | 48% | 51% | +3 | 285 |  |
| Colby Street NB | to | Telegraph Avenue | 25% | 27% | +2 | 285 |  |
| Colby Street NB | to | College Avenue | 3% | 8% | +5 | 285 |  |
| Hillegass Avenue SB | from | Alcatraz Avenue WB | 46% | 33% | -13 | 209 |  |
| Hillegass Avenue SB | from | Benvenue Avenue | 26% | 5% | -21 | 209 |  |
| Hillegass Avenue SB | from | College Avenue | 16% | 16% | -0 | 209 |  |
| Hillegass Avenue SB | to | freeway | 57% (PM 68%) | 68% | -0 | 209 | within |
| Colby Street SB | from | Alcatraz Avenue EB | 43% | 21% | -22 | 286 |  |
| Colby Street SB | from | Alcatraz Avenue WB | 46% | 18% | -28 | 286 |  |
| Colby Street SB | from | Telegraph Avenue | 22% | 17% | -5 | 286 |  |
| Colby Street SB | to | freeway | 45% | 44% | -1 | 286 | within |
| Colby Street SB | to | Forest Street | 34% | 25% | -9 | 286 |  |

Headline shares within tolerance: 3 of 4. Observed column uses the PM-peak share where one is given and the period is pm_peak. 'Via' shares are the fraction of select-link trips using that street before (from) or after (to) the block; freeway = origin / destination gate with a motorway-class link attached.

## Claremont ramps: streets used before the on-ramp / after the off-ramp

Observed shares are for traffic from/to the north only. 'Modeled' is over all trips on the ramps and any visit to the street (an upper bound for streets that serve both sides). 'Modeled, side' counts only trips whose surface end lies on the side of the ramp stated in the targets file (`freewayRamp.side`), and for a street with a qualifier ("north of X") only its links on that side of X.

| Direction | Via | Observed | Modeled | n ramp trips | Modeled, side | n side trips |
| --- | --- | --- | --- | --- | --- | --- |
| onto freeway | College Avenue | 16% | 14% | 901 | 15% | 816 |
| onto freeway | Hillegass Avenue | 12% | 14% | 901 | 16% | 816 |
| onto freeway | Martin Street | 10% | 12% | 901 | 13% | 816 |
| onto freeway | Colby Street | 8% | 11% | 901 | 12% | 816 |
| onto freeway | Telegraph Avenue north of Alcatraz Avenue | 8% | 15% | 901 | 12% | 816 |
| onto freeway | Benvenue Avenue | 5% | 4% | 901 | 5% | 816 |
| from freeway | College Avenue | 10% | 8% | 822 | 10% | 726 |
| from freeway | Martin Street | 10% | 12% | 822 | 13% | 726 |
| from freeway | Colby Street | 8% | 8% | 822 | 9% | 726 |
| from freeway | Hillegass Avenue | 5% | 7% | 822 | 8% | 726 |
| from freeway | Benvenue Avenue | 3% | 3% | 822 | 4% | 726 |

## Top 15 links by delay

| Link | Street | Class | Lanes | Len (m) | End node control | Delay (veh-h) | Stopped (veh-h) | Mean stopped veh | Flow (veh/h) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 4143 | Adeline Street | Secondary | 3 | 185 | signal | 19.13 | 15.21 | 15.2 | 502 |
| 1025 | Martin Luther King Junior Way | Secondary | 3 | 79 | signal | 9.09 | 7.48 | 7.5 | 859 |
| 769 | Martin Luther King Junior Way | Secondary | 3 | 112 | signal | 7.29 | 4.54 | 4.5 | 1568 |
| 3344 | Domingo Avenue | Residential | 1 | 110 | signal | 6.32 | 5.27 | 5.3 | 197 |
| 4397 | Ashby Avenue | Primary | 2 | 96 | signal | 6.16 | 4.04 | 4.0 | 1033 |
| 4382 | Warren Freeway | Motorway | 2 | 744 | uncontrolled | 5.78 | 1.05 | 1.1 | 1109 |
| 1051 | Adeline Street | Secondary | 4 | 50 | signal | 5.59 | 4.54 | 4.5 | 1189 |
| 1037 | Sacramento Street | Tertiary | 3 | 40 | signal | 5.57 | 4.46 | 4.5 | 1266 |
| 2005 | Shattuck Avenue | Tertiary | 1 | 92 | signal | 5.08 | 3.83 | 3.8 | 445 |
| 1122 | Alcatraz Avenue | Tertiary | 1 | 299 | signal | 5.02 | 3.45 | 3.4 | 361 |
| 3395 | Ashby Avenue | Primary | 1 | 129 | signal | 5.00 | 2.62 | 2.6 | 965 |
| 2008 | Shattuck Avenue | Tertiary | 1 | 93 | signal | 4.90 | 3.85 | 3.8 | 400 |
| 1662 | 52nd Street | Secondary | 4 | 53 | signal | 4.89 | 3.48 | 3.5 | 1162 |
| 498 | Sacramento Street | Tertiary | 3 | 48 | signal | 4.77 | 3.79 | 3.8 | 770 |
| 3447 | Claremont Avenue | Secondary | 3 | 43 | signal | 4.72 | 4.03 | 4.0 | 437 |

## Top 15 nodes by blocked time

Blocked time = lane-head seconds waiting at the stop line without permission (signal red, conflict, stop sign or no downstream space).

| Node | Streets | Control | Gate | Blocked (lane-h) | of which no downstream space | Signal plan at end (cycle: greens) |
| --- | --- | --- | --- | --- | --- | --- |
| 446 | Market Street / Stanford Avenue | signal |  | 5.27 | 0.09 | 75 s: 44/21 |
| 680 | 52nd Street / Shattuck Avenue | signal |  | 5.16 | 0.03 | 110 s: 30/28/38 |
| 447 | Adeline Street / Alcatraz Avenue | signal |  | 4.29 | 0.13 | 75 s: 33/32 |
| 185 | Alcatraz Avenue / Sacramento Street | signal |  | 3.69 | 0.02 | 75 s: 39/26 |
| 30 | 57th Street / Adeline Street / Market Street | signal |  | 3.33 | 0.02 | 75 s: 17/24/19 |
| 1080 | 62nd Street / Claremont Avenue / College Avenue | signal |  | 3.31 | 0.04 | 75 s: 15/30/15 |
| 37 | San Pablo Avenue / Stanford Avenue | signal |  | 3.22 | 0.00 | 75 s: 33/32 |
| 479 | Adeline Street / Martin Luther King Junior Way / Stanford Avenue | signal |  | 3.14 | 0.00 | 75 s: 19/46 |
| 851 | Alcatraz Avenue / Telegraph Avenue | signal |  | 3.03 | 0.03 | 75 s: 42/23 |
| 331 | 52nd Street / Martin Luther King Junior Way | signal |  | 2.94 | 0.00 | 75 s: 37/28 |
| 1069 | Claremont Avenue / Colby Street / Forest Street | signal |  | 2.93 | 0.00 | 79 s: 25/4/35 |
| 1406 | Ashby Avenue / Claremont Avenue | signal |  | 2.75 | 0.05 | 80 s: 55/15 |
| 237 | Ashby Avenue / Sacramento Street | signal |  | 2.72 | 0.00 | 75 s: 44/21 |
| 713 | 51st Street / Telegraph Avenue | signal |  | 2.68 | 0.00 | 75 s: 32/33 |
| 944 | Ashby Avenue / Shattuck Avenue | signal |  | 2.64 | 0.00 | 75 s: 46/19 |

Phases of the five most blocked signals (green s: approach links with their lanes, link ids in brackets):

- node 446: 44 s: Stanford Avenue 1L [941], Stanford Avenue 3L [1055]; 21 s: Market Street 4L [1108], Market Street 3L [1111]
- node 680: 30 s: 52nd Street 4L [1662]; 28 s: 52nd Street 4L [1666], 52nd Street 4L [1662]; 38 s: Shattuck Avenue 2L [1653], Shattuck Avenue 2L [1705]
- node 447: 33 s: Adeline Street 4L [1049], Adeline Street 4L [1051]; 32 s: Alcatraz Avenue 2L [1048], Alcatraz Avenue 2L [1133]
- node 185: 39 s: Alcatraz Avenue 1L [363], Alcatraz Avenue 1L [1162]; 26 s: Sacramento Street 3L [1036], Sacramento Street 3L [1037]
- node 30: 17 s: Adeline Street 1L [747], Adeline Street 1L [1030]; 24 s: Market Street 2L [755], Market Street 2L [1113]; 19 s: 57th Street 1L [44], 57th Street 1L [1151]

## Entry backlog by origin node at end of run (top 10)

| Node | Streets | Trips waiting | Offered veh/h (before scale) |
| --- | --- | --- | --- |
| 1232 | Ashby Avenue / Claremont Crescent | 8 | 31 |
| 1080 | 62nd Street / Claremont Avenue / College Avenue | 2 | 205 |
| 1372 | Domingo Avenue / Russell Street | 2 | 31 |
| 164 | Baker Street / Harmon Street | 1 | 10 |
| 323 | 52nd Street / West Street | 1 | 24 |
| 1025 | College Avenue / Hudson Street / Manila Avenue | 1 | 34 |

## Flow on key streets (veh/h per direction, study-area links of 40 m or more)

| Street | Direction of travel | Links | Median flow | Max flow |
| --- | --- | --- | --- | --- |
| Telegraph | N | 12 | 1122 | 1156 |
| Telegraph | S | 10 | 838 | 874 |
| College | N | 3 | 394 | 395 |
| College | S | 3 | 701 | 702 |
| Claremont | N | 6 | 410 | 605 |
| Claremont | S | 7 | 325 | 892 |
| Alcatraz | E | 6 | 638 | 672 |
| Alcatraz | W | 6 | 350 | 446 |
| Hillegass | N | 4 | 108 | 136 |
| Hillegass | S | 4 | 161 | 172 |
| Colby | N | 7 | 154 | 192 |
| Colby | S | 7 | 150 | 164 |
| Martin | E | 2 | 145 | 145 |
| Martin | W | 2 | 108 | 108 |

## Largest demand origins (offered, before scale)

| Node | Streets | Veh/h |
| --- | --- | --- |
| 602 | Grove Shafter Freeway | 4123 |
| 1672 | Warren Freeway | 1280 |
| 265 | Ashby Avenue | 1134 |
| 183 | San Pablo Avenue | 1101 |
| 943 | Telegraph Avenue / Ward Street | 1098 |
| 974 | Broadway | 798 |
| 763 | Telegraph Avenue | 653 |
| 184 | Alcatraz Avenue | 524 |
| 276 | Martin Luther King Junior Way | 464 |
| 1719 | Grove Shafter Freeway | 420 |
