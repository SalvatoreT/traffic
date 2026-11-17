# Calibration report: rockridge pm_peak scale 1 seed 1 (60 min)

Offered demand 26371 veh/h x scale 1 = 26371 veh/h. Run took 37.8 s wall clock. Flow tables use the window after a 10 min warm-up; select-link and health figures cover the whole run from an empty network.

## Stability (design D4)

| Criterion | Threshold | Value | Result |
| --- | --- | --- | --- |
| Gridlock removals | 0 | 1 | FAIL |
| Backlog / spawned | < 2% | 0.9% (234 of 26313) | pass |
| Arterial mean speed (run) | > 4 m/s | 8.26 m/s (last 15 min 7.88) | pass |

Overall: **NOT STABLE**. Mean trip delay 167 s, mean trip time 419 s, completed 26113, unroutable 0.

| t (min) | vehicles in network | backlog | completed | removals | arterial speed in interval (m/s) |
| --- | --- | --- | --- | --- | --- |
| 5 | 3015 | 5 | 2259 | 0 | 8.61 |
| 10 | 3069 | 14 | 4398 | 0 | 8.40 |
| 15 | 3087 | 21 | 6643 | 0 | 8.49 |
| 20 | 3018 | 9 | 8891 | 1 | 8.65 |
| 25 | 3054 | 36 | 11074 | 1 | 8.61 |
| 30 | 3153 | 62 | 13173 | 1 | 8.20 |
| 35 | 3108 | 94 | 15415 | 1 | 7.98 |
| 40 | 3157 | 112 | 17558 | 1 | 8.25 |
| 45 | 3195 | 129 | 19676 | 1 | 8.42 |
| 50 | 3187 | 147 | 21881 | 1 | 8.29 |
| 55 | 3284 | 193 | 24009 | 1 | 7.74 |
| 60 | 3321 | 234 | 26113 | 1 | 7.62 |
## Wandering (completed car trips)

Detour ratio = distance driven (link and movement lengths) over the shortest network distance from the trip's origin to its destination. Detour against the free-flow route uses the time-shortest route with no congestion and no noise, which is what a purposeful driver without live information would follow (it differs from the shortest distance when a faster, longer road exists). A switch is a change of the remaining route while en route. Loops: the same link twice or the same node three or more times. Reversals: a link followed by its reverse within 200 m. 'Study-area vehicle-miles' are miles driven on links inside the study area; the last column is the share of them driven by trips with a detour ratio above 1.3. Guided drivers re-evaluate their route every epoch; the others keep their departure route unless it is blocked.

| Trips | n | Switches per trip | With a switch | Mean detour | Median detour | Detour > 1.3 | Detour > 2 | Mean detour vs free-flow route | Vs free-flow route > 1.3 | Loops | Reversals | Study veh-miles | Of them by detour > 1.3 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| all trips | 23877 | 0.03 | 2.6% | 1.090 | 1.054 | 4.7% | 0.0% | 1.033 | 2.5% | 0.0% | 0.3% | 2459 | 8.4% |
| gate to gate | 8614 | 0.05 | 4.4% | 1.092 | 1.068 | 4.0% | 0.0% | 1.033 | 2.2% | 0.0% | 0.2% | 576 | 13.3% |
| with a local end | 15263 | 0.02 | 1.6% | 1.089 | 1.049 | 5.1% | 0.0% | 1.033 | 2.7% | 0.0% | 0.3% | 1883 | 6.9% |
| guided drivers | 11046 | 0.06 | 5.5% | 1.092 | 1.055 | 4.8% | 0.0% | 1.034 | 2.6% | 0.0% | 0.3% | 1158 | 8.3% |
| other drivers | 12831 | 0.00 | 0.2% | 1.088 | 1.054 | 4.6% | 0.0% | 1.031 | 2.5% | 0.0% | 0.2% | 1301 | 8.6% |

## Reported patterns (diagnostics; configured in the targets file under `patterns`)

(a) Trips between the surface gates on the north side of the ramps and the freeway mainline gates, and the local-street (residential and service links in the study area) vehicle-miles they drive. Share = of all completed trips' local-street vehicle-miles (483 miles). No observed counterpart exists for this quantity (the targets file has only the select-link shares above).

| Trips | n trips | Local-street veh-miles | Share of all local-street veh-miles |
| --- | --- | --- | --- |
| surface gates to the freeway | 1651 | 39.5 | 8% |
| freeway to the surface gates | 1385 | 28.5 | 6% |

(b) Corridor trips: completed trips from beyond one end of the corridor's study-area extent (the bypass street and its arterial together) to beyond the other end, within a lateral limit of the corridor, by direction. 'Bypass' = at least N blocks (links) on the bypass street; 'arterial' = fewer bypass blocks and at least N on the arterial; 'other' = neither (another street, the freeway or a short use); blocks are counted on the corridor's study-area links. No observed counterpart exists for these shares. The related observed values are in the select-link table above: northbound Hillegass Ave traffic rarely ends on College Ave (6%), 21 to 33% jogs to Benvenue Ave, and southbound freeway-bound drivers on College Ave commonly arrive via Ashby Ave and Benvenue Ave and jog to Hillegass Ave.

| Bypass | Arterial | N | Direction | Corridor trips | Bypass | Arterial | Other | Mean bypass blocks |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue | College Avenue | 3 | N | 1512 | 3% | 18% | 79% | 0.1 |
| Hillegass Avenue | College Avenue | 3 | S | 1371 | 6% | 25% | 69% | 0.2 |

## Per-mode results

Offered: 26371 car veh/h; 626 bicycle flows (764/h); 2000 pedestrian flows (1731/h). Bicycle and pedestrian volumes are assumptions, not counts.

| Mode | In network | Completed | Mean time (s) | Other |
| --- | --- | --- | --- | --- |
| Car | 3321 | 26113 | 419 | |
| Bicycle | 54 | 789 | 268 | |
| Pedestrian | 221 | 1658 | 416 | mean crossing delay 7.8 s |

Vulnerable road users (surrogate indicators): pedestrian conflicts 296, bicycle conflicts 1206, close passes 693, pedestrian injury severity mean 0.042 (AIS4+, 10608 supported of 10608 encounters), cyclist injury severity mean 0.069 (MAIS3+F, 3898 supported of 8317 encounters) (separate endpoints, never summed), mean vehicle speed at pedestrian encounters 2.24 m/s.


## Through cars on the counted blocks (a car is through when neither trip end is in the study area)

Observed through range = from the cars that drove the whole street (volunteer count, a lower bound) to the block volume less the cars whose trip ends along the street (an upper bound). Observed freeway-end trips = observed block volume times the observed freeway share of the street (the headline share of the targets file); these include freeway trips that end inside the study area, so they are not an expected through count. Modeled through = select-link trips with no end in the study area, per hour. Modeled freeway = select-link trips from or to a freeway node, per hour.

| Block | Observed volume (veh/h) | Observed freeway share | Observed freeway-end trips (veh/h) | Observed through range (veh/h) | Modeled through (veh/h) | In range | Modeled freeway trips (veh/h) |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue NB | 110 | 47.0% | 52 | 48 to 95 | 81 | yes | 124 |
| Colby Street NB | 174 | 47.0% | 82 | 102 to 145 | 143 | yes | 157 |
| Hillegass Avenue SB | 160 | 68.0% | 109 | 79 to 120 | 128 | above | 120 |
| Colby Street SB | 160 | 45.0% | 72 | 39 to 117 | 113 | yes | 122 |

Fitted: Colby Street NB, Colby Street SB, Hillegass Avenue NB, Hillegass Avenue SB are targets of the demand fit (`countFit.throughTargets`, calibration round 39), so these rows are no longer an independent check. The checks that stay independent are the held-out count stations, the headline freeway shares, stability and the arterial travel times.

## Intent map: through cars by where they come from and where they are going

Through = neither trip end is in the study area. Groups are the approach groups of the area config (data/areas); a node that is not a gate takes the group of the nearest surface gate (ASSUMPTION). The arterial is the one a trip would use on the shortest free-flow path with the study area's residential and service streets closed, where that path runs on a boundary street near the study area.

Model figures are the mean of 1 seed(s), per hour of the run. Basis: OBSERVED = read from the resident volunteer count of Feb 25, 2025 or its headline shares; ASSUMPTION = inferred from those numbers or chosen.

### Colby Street NB

Observed: block volume 174 veh/h, whole-street cars 102, so through cars 102 to 145 veh/h. Model: 143 through cars per hour.

Observed (PM): 182 cars entered at the south end, 102 drove the whole street, 164 left it at Alcatraz Ave (131 left, 32 right, 1 straight), and 47% of the block's trips came from a freeway (the headline share). ASSUMPTION: freeway-origin cars that do not end along the street are 65 veh/h (the 82 freeway-origin trips on the block, 47% of 174, times the 182 / (182 + 47) of its cars that entered at the south end rather than joining on the way), spread over the 164 exits in proportion (0.40); the other through cars come from the Telegraph Ave and south-side approaches that feed the street's south end. Ranges: low = 131 (32) x 0.47 x 0.62 (the whole-street share of exits), high = 131 (32) x 0.47.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | OBSERVED turn count x ASSUMPTION share (131 left turns x 0.40) | 52 (38 to 62) | 49 | within |
| Telegraph Ave and south-side traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | ASSUMPTION: the through left-turners (131 x 0.62 = 81) that are not off-ramp traffic | 29 (19 to 43) | 40 | within |
| SR-24 off-ramp traffic using Colby St to reach College Ave and Berkeley (right at Alcatraz Ave) | OBSERVED turn count x ASSUMPTION share (32 right turns x 0.40) | 13 (9 to 15) | 12 | within |
| Telegraph Ave and south-side traffic using Colby St to reach College Ave and Berkeley | ASSUMPTION: the through right-turners (32 x 0.62 = 20) that are not off-ramp traffic | 7 (5 to 11) | 39 | above |
| Intents listed, together | | 101 (71 to 131) | 140 | |
| Other through cars (no intent listed) | | | 3 | |

Model through cars by origin and destination group (largest 12 of 15 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 49.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 37.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Shattuck Ave from the north (Berkeley) | 11.0 | Claremont Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Ashby Ave from the west (Emeryville and I-80) | 10.0 | none near the study area |
| Telegraph Ave to the south (downtown Oakland) | Telegraph Ave from the north (Berkeley) | 9.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 6.0 | SR-24 then Claremont Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 5.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | College Ave from the north (Berkeley) | 4.0 | SR-24 then Claremont Avenue then College Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Emeryville and West Oakland streets (55th to 67th Streets) | 3.0 | Claremont Avenue |
| San Pablo Ave (Emeryville and West Oakland) | Claremont Ave and Tunnel Rd toward the hills | 2.0 | Alcatraz Avenue then Claremont Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Telegraph Ave from the north (Berkeley) | 2.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 2.0 | SR-24 |
| other pairs | | 3.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 104 veh/h; Claremont Avenue 14 veh/h; none near the study area 10 veh/h; SR-24 then Claremont Avenue 6 veh/h; SR-24 then Claremont Avenue then College Avenue 4 veh/h; Alcatraz Avenue then Claremont Avenue 2 veh/h.

### Hillegass Avenue NB

Observed: block volume 110 veh/h, whole-street cars 48, so through cars 48 to 95 veh/h. Model: 81 through cars per hour.

Observed (PM): 94 cars entered at the south end, 48 drove the whole street, 109 left it at Alcatraz Ave (43 west, 54 east, 12 straight), and 47% of the block's trips came from a freeway. ASSUMPTION: freeway-origin through cars are 40 veh/h (52 freeway-origin trips times 94 / (94 + 29)), spread over the exits in proportion (0.37); the through share of exits is 48 / 109 = 0.44.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Hillegass Ave to reach Alcatraz Ave west and Telegraph Ave north | OBSERVED turn count x ASSUMPTION share (43 left turns x 0.37) | 16 (9 to 20) | 22 | above |
| SR-24 off-ramp traffic using Hillegass Ave to reach College Ave and Berkeley | OBSERVED turn count x ASSUMPTION share (54 right turns x 0.37) | 20 (11 to 25) | 30 | above |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach Alcatraz Ave west | ASSUMPTION: through exits (43 x 0.44) that are not off-ramp traffic | 3 (0 to 10) | 5 | within |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach College Ave and Berkeley | ASSUMPTION: through exits (54 x 0.44) that are not off-ramp traffic | 4 (0 to 13) | 23 | above |
| Intents listed, together | | 43 (20 to 68) | 80 | |
| Other through cars (no intent listed) | | | 1 | |

Model through cars by origin and destination group (largest 12 of 20 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 16.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 15.0 | SR-24 |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 14.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | College Ave from the north (Berkeley) | 9.0 | SR-24 then Claremont Avenue then College Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 4.0 | SR-24 then Claremont Avenue |
| Telegraph Ave to the south (downtown Oakland) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 3.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Claremont Ave and Tunnel Rd toward the hills | 2.0 | Claremont Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 2.0 | Telegraph Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Claremont Ave and Tunnel Rd toward the hills | 2.0 | Claremont Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Ashby Ave from the west (Emeryville and I-80) | 2.0 | SR-24 then Telegraph Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 2.0 | Claremont Avenue then Alcatraz Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | San Pablo Ave (Emeryville and West Oakland) | 2.0 | SR-24 |
| other pairs | | 8.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 37 veh/h; SR-24 17 veh/h; SR-24 then Claremont Avenue then College Avenue 9 veh/h; Claremont Avenue 5 veh/h; SR-24 then Claremont Avenue 4 veh/h; SR-24 then Telegraph Avenue 3 veh/h.

### Hillegass Avenue SB

Observed: block volume 160 veh/h, whole-street cars 79, so through cars 79 to 120 veh/h. Model: 128 through cars per hour.

Observed (PM): 178 cars entered at the top (76 turned in from Alcatraz Ave west, 98 from the east, 4 came straight from the north), 79 drove the whole street, and 68% of the block's trips (109 veh/h) went to a freeway. ASSUMPTION: freeway-bound cars that did not join mid-street are 87 veh/h (109 x 178 / (178 + 44)), half of the 174 turn-ins; low = the whole-street share of the turn-ins (0.45), high = the freeway-bound share without the mid-street correction (0.63).

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Telegraph Ave, Alcatraz Ave west and West Berkeley traffic turning off Alcatraz Ave onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (76 turn-ins x 0.50) | 38 (34 to 48) | 46 | within |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (98 turn-ins x 0.50) | 49 (44 to 62) | 57 | within |
| Intents listed, together | | 87 (78 to 110) | 103 | |
| Other through cars (no intent listed) | | | 25 | |

Model through cars by origin and destination group (largest 12 of 13 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 46.0 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 22.0 | Claremont Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 21.0 | Telegraph Avenue |
| Ashby Ave from the west (Emeryville and I-80) | College Ave from the north (Berkeley) | 12.0 | Alcatraz Avenue then College Avenue |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 10.0 | College Avenue then Claremont Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 4.0 | Telegraph Avenue |
| San Pablo Ave (Emeryville and West Oakland) | Claremont Ave and Tunnel Rd toward the hills | 3.0 | Alcatraz Avenue then Claremont Avenue |
| Telegraph Ave from the north (Berkeley) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 3.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 2.0 | Claremont Avenue |
| Berkeley hills to the northeast (Evergreen Ln, Gravatt Dr) | SR-24 westbound on-ramps (toward Oakland and I-980) | 2.0 | SR-24 |
| Ashby Ave from the west (Emeryville and I-80) | Berkeley hills to the northeast (Evergreen Ln, Gravatt Dr) | 1.0 | none near the study area |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 1.0 | Claremont Avenue |
| other pairs | | 1.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 75 veh/h; Claremont Avenue then SR-24 22 veh/h; Alcatraz Avenue then College Avenue 12 veh/h; College Avenue then Claremont Avenue then SR-24 10 veh/h; Alcatraz Avenue then Claremont Avenue 3 veh/h; Claremont Avenue 3 veh/h.

### Colby Street SB

Observed: block volume 160 veh/h, whole-street cars 39, so through cars 39 to 117 veh/h. Model: 113 through cars per hour.

Observed (PM): 139 cars entered at the top (76 from Alcatraz Ave west, 50 from the east, 13 from the north), 39 drove the whole street, 45% of the block's trips (72 veh/h) went to a freeway and 22% came by way of Telegraph Ave. ASSUMPTION: freeway-bound cars that did not join mid-street are 46 veh/h (72 x 139 / (139 + 79)), 0.365 of the 126 turn-ins; low = the whole-street share (0.31), high = the unadjusted freeway share (0.57). The Telegraph Ave cars are the 22% x 160 = 35 of the 76 west turn-ins.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Southbound Telegraph Ave traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (35 Telegraph Ave cars x 0.365) | 13 (11 to 20) | 12 | within |
| Alcatraz Ave west, Ashby Ave and West Berkeley traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (41 other west turn-ins x 0.365) | 15 (13 to 23) | 15 | within |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (50 east turn-ins x 0.365) | 18 (15 to 29) | 44 | above |
| Intents listed, together | | 46 (39 to 72) | 71 | |
| Other through cars (no intent listed) | | | 42 | |

Model through cars by origin and destination group (largest 12 of 23 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 25.0 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 12.0 | Claremont Avenue then SR-24 |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 12.0 | Telegraph Avenue |
| Ashby Ave from the west (Emeryville and I-80) | College Ave from the north (Berkeley) | 11.0 | Alcatraz Avenue then College Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 9.0 | Telegraph Avenue |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 6.0 | College Avenue then Claremont Avenue then SR-24 |
| Ashby Ave from the west (Emeryville and I-80) | SR-13 Warren Freeway (via SR-24 east) | 5.0 | SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Telegraph Ave to the south (downtown Oakland) | 5.0 | Telegraph Avenue |
| Shattuck Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 4.0 | none near the study area |
| Emeryville and West Oakland streets (55th to 67th Streets) | Claremont Ave and Tunnel Rd toward the hills | 4.0 | Alcatraz Avenue then Claremont Avenue |
| Alcatraz Ave from the west (Emeryville side) | SR-13 Warren Freeway (via SR-24 east) | 3.0 | SR-24 |
| Telegraph Ave from the north (Berkeley) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 3.0 | Telegraph Avenue |
| other pairs | | 14.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 56 veh/h; Claremont Avenue then SR-24 12 veh/h; Alcatraz Avenue then College Avenue 11 veh/h; SR-24 10 veh/h; Alcatraz Avenue then Claremont Avenue 7 veh/h; College Avenue then Claremont Avenue then SR-24 6 veh/h.

### Study area, all residential and service streets

Model: 779 through cars per hour.

Model through cars by origin and destination group (largest 12 of 62 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 113.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 70.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 69.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 59.0 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 54.0 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 33.0 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 28.0 | Claremont Avenue then SR-24 |
| Ashby Ave from the west (Emeryville and I-80) | College Ave from the north (Berkeley) | 27.0 | Alcatraz Avenue then College Avenue |
| West Oakland to the southwest (Adeline St, Market St) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 27.0 | Telegraph Avenue then Claremont Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Emeryville and West Oakland streets (55th to 67th Streets) | 21.0 | Claremont Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Shattuck Ave from the north (Berkeley) | 19.0 | Claremont Avenue |
| West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) | SR-24 westbound on-ramps (toward Oakland and I-980) | 18.0 | none near the study area |
| other pairs | | 241.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 475 veh/h; Claremont Avenue 71 veh/h; none near the study area 59 veh/h; SR-24 29 veh/h; Claremont Avenue then SR-24 28 veh/h; Alcatraz Avenue then Claremont Avenue 27 veh/h.

By origin group: South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 186; Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 166; SR-24 eastbound off-ramps (arriving from Oakland and I-980) 103; Telegraph Ave from the north (Berkeley) 91; West Oakland to the southwest (Adeline St, Market St) 40; Ashby Ave from the west (Emeryville and I-80) 38; Emeryville and West Oakland streets (55th to 67th Streets) 33; Claremont Ave and Tunnel Rd toward the hills 30; Telegraph Ave to the south (downtown Oakland) 24; West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) 18.

By destination group: SR-24 westbound on-ramps (toward Oakland and I-980) 202; Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 151; South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 148; Telegraph Ave from the north (Berkeley) 86; Claremont Ave and Tunnel Rd toward the hills 45; College Ave from the north (Berkeley) 43; Emeryville and West Oakland streets (55th to 67th Streets) 22; Shattuck Ave from the north (Berkeley) 20; Telegraph Ave to the south (downtown Oakland) 15; Ashby Ave from the west (Emeryville and I-80) 12.


## Through cars by intent (cut-through intent view)

A through car is tallied once, under the first intent that fits it (the on-ramp on its planned route, the off-ramp it has driven, or the origin and destination groups of its trip), at the moment the through count counts it. Cars an hour over the run, the same window as the through-car figure (782 an hour).

| Intent | Basis | Cars an hour | Share |
| --- | --- | --- | --- |
| on-2853241697 | observed | 203 | 26% |
| Other on-ramps | assumed | 13 | 2% |
| off-52990846 | observed | 101 | 13% |
| Other off-ramps | assumed | 9 | 1% |
| Downtown, south and west Oakland traffic using side streets to reach Berkeley and Telegraph Ave north | assumed | 175 | 22% |
| Berkeley and Telegraph Ave north traffic using side streets to reach downtown, south and west Oakland | assumed | 123 | 16% |
| Oakland cross-town traffic (West Oakland, Broadway, Piedmont, Emeryville) using side streets near Claremont Ave and Telegraph Ave | assumed | 68 | 9% |
| Other (no intent listed) |  | 90 | 12% |

Intents listed cover 88% of through cars.


## Select-link shares: modeled vs observed (design D5: headline = freeway shares, tolerance +/-10 pp)

- Hillegass Avenue NB: 4 links (path Claremont Avenue -> Alcatraz Avenue (434 m)), 235 trips (209 completed)
- Colby Street NB: 8 links (path Claremont Avenue -> Alcatraz Avenue (680 m)), 321 trips (291 completed)
- Hillegass Avenue SB: 4 links (path Alcatraz Avenue -> Claremont Avenue (433 m)), 179 trips (168 completed)
- Colby Street SB: 8 links (path Alcatraz Avenue -> Claremont Avenue (680 m)), 297 trips (273 completed)

| Block | Side | Via | Observed | Modeled | Diff (pp) | n trips | Headline |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue NB | from | freeway | 47% | 52% | +5 | 235 | within |
| Hillegass Avenue NB | to | Benvenue Avenue | 21% (PM 33%) | 2% | -31 | 235 |  |
| Hillegass Avenue NB | to | College Avenue | 6% | 15% | +9 | 235 |  |
| Hillegass Avenue NB | to | Alcatraz Avenue WB | 27% | 24% | -3 | 235 |  |
| Colby Street NB | from | freeway | 47% | 48% | +1 | 321 | within |
| Colby Street NB | to | Alcatraz Avenue WB | 48% | 39% | -9 | 321 |  |
| Colby Street NB | to | Telegraph Avenue | 25% | 30% | +5 | 321 |  |
| Colby Street NB | to | College Avenue | 3% | 7% | +4 | 321 |  |
| Hillegass Avenue SB | from | Alcatraz Avenue WB | 46% | 33% | -13 | 179 |  |
| Hillegass Avenue SB | from | Benvenue Avenue | 26% | 6% | -20 | 179 |  |
| Hillegass Avenue SB | from | College Avenue | 16% | 19% | +3 | 179 |  |
| Hillegass Avenue SB | to | freeway | 57% (PM 68%) | 64% | -4 | 179 | within |
| Colby Street SB | from | Alcatraz Avenue EB | 43% | 20% | -23 | 297 |  |
| Colby Street SB | from | Alcatraz Avenue WB | 46% | 14% | -32 | 297 |  |
| Colby Street SB | from | Telegraph Avenue | 22% | 20% | -2 | 297 |  |
| Colby Street SB | to | freeway | 45% | 39% | -6 | 297 | within |
| Colby Street SB | to | Forest Street | 34% | 25% | -9 | 297 |  |

Headline shares within tolerance: 4 of 4. Observed column uses the PM-peak share where one is given and the period is pm_peak. 'Via' shares are the fraction of select-link trips using that street before (from) or after (to) the block; freeway = origin / destination gate with a motorway-class link attached.

## Claremont ramps: streets used before the on-ramp / after the off-ramp

Observed shares are for traffic from/to the north only. 'Modeled' is over all trips on the ramps and any visit to the street (an upper bound for streets that serve both sides). 'Modeled, side' counts only trips whose surface end lies on the side of the ramp stated in the targets file (`freewayRamp.side`), and for a street with a qualifier ("north of X") only its links on that side of X.

| Direction | Via | Observed | Modeled | n ramp trips | Modeled, side | n side trips |
| --- | --- | --- | --- | --- | --- | --- |
| onto freeway | College Avenue | 16% | 14% | 841 | 16% | 709 |
| onto freeway | Hillegass Avenue | 12% | 14% | 841 | 17% | 709 |
| onto freeway | Martin Street | 10% | 7% | 841 | 8% | 709 |
| onto freeway | Colby Street | 8% | 10% | 841 | 12% | 709 |
| onto freeway | Telegraph Avenue north of Alcatraz Avenue | 8% | 14% | 841 | 11% | 709 |
| onto freeway | Benvenue Avenue | 5% | 6% | 841 | 7% | 709 |
| from freeway | College Avenue | 10% | 9% | 762 | 10% | 726 |
| from freeway | Martin Street | 10% | 10% | 762 | 10% | 726 |
| from freeway | Colby Street | 8% | 10% | 762 | 11% | 726 |
| from freeway | Hillegass Avenue | 5% | 8% | 762 | 8% | 726 |
| from freeway | Benvenue Avenue | 3% | 2% | 762 | 2% | 726 |

## Top 15 links by delay

| Link | Street | Class | Lanes | Len (m) | End node control | Delay (veh-h) | Stopped (veh-h) | Mean stopped veh | Flow (veh/h) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 4175 | (unnamed) | Motorway | 2 | 142 | uncontrolled | 23.43 | 4.41 | 4.4 | 1528 |
| 2921 | Russell Street | Residential | 1 | 260 | uncontrolled | 17.28 | 14.99 | 15.0 | 168 |
| 4143 | Adeline Street | Secondary | 3 | 185 | signal | 10.48 | 6.88 | 6.9 | 1112 |
| 1089 | Market Street | Tertiary | 2 | 111 | two_way_stop | 9.85 | 6.68 | 6.7 | 1032 |
| 1051 | Adeline Street | Secondary | 4 | 50 | signal | 9.53 | 8.03 | 8.0 | 1476 |
| 4397 | Ashby Avenue | Primary | 2 | 96 | signal | 9.42 | 7.39 | 7.4 | 462 |
| 4167 | (unnamed) | Motorway | 3 | 75 | uncontrolled | 9.28 | 2.75 | 2.7 | 2416 |
| 3395 | Ashby Avenue | Primary | 1 | 129 | signal | 9.10 | 7.33 | 7.3 | 427 |
| 3434 | Claremont Avenue | Secondary | 1 | 93 | all_way_stop | 7.93 | 4.57 | 4.6 | 468 |
| 4329 | Claremont Avenue | Secondary | 2 | 113 | signal | 7.87 | 6.65 | 6.6 | 424 |
| 460 | Sacramento Street | Tertiary | 2 | 104 | two_way_stop | 7.36 | 6.13 | 6.1 | 390 |
| 1049 | Adeline Street | Secondary | 4 | 43 | signal | 6.80 | 5.77 | 5.8 | 985 |
| 1126 | Market Street | Tertiary | 2 | 113 | two_way_stop | 6.80 | 4.57 | 4.6 | 997 |
| 3370 | The Uplands | Tertiary | 1 | 311 | uncontrolled | 6.69 | 4.87 | 4.9 | 251 |
| 704 | Martin Luther King Junior Way | Secondary | 4 | 68 | signal | 6.39 | 5.02 | 5.0 | 1370 |

## Top 15 nodes by blocked time

Blocked time = lane-head seconds waiting at the stop line without permission (signal red, conflict, stop sign or no downstream space).

| Node | Streets | Control | Gate | Blocked (lane-h) | of which no downstream space | Signal plan at end (cycle: greens) |
| --- | --- | --- | --- | --- | --- | --- |
| 447 | Adeline Street / Alcatraz Avenue | signal |  | 5.20 | 0.21 | 75 s: 36/29 |
| 680 | 52nd Street / Shattuck Avenue | signal |  | 4.80 | 0.05 | 110 s: 30/28/38 |
| 446 | Market Street / Stanford Avenue | signal |  | 4.35 | 0.17 | 75 s: 35/30 |
| 331 | 52nd Street / Martin Luther King Junior Way | signal |  | 4.15 | 0.03 | 75 s: 34/31 |
| 1406 | Ashby Avenue / Claremont Avenue | signal |  | 3.93 | 0.32 | 75 s: 30/15/15 |
| 1080 | 62nd Street / Claremont Avenue / College Avenue | signal |  | 3.67 | 0.10 | 75 s: 17/28/15 |
| 479 | Adeline Street / Martin Luther King Junior Way / Stanford Avenue | signal |  | 3.54 | 0.04 | 75 s: 41/24 |
| 30 | 57th Street / Adeline Street / Market Street | signal |  | 3.48 | 0.04 | 75 s: 28/17/15 |
| 37 | San Pablo Avenue / Stanford Avenue | signal |  | 3.32 | 0.05 | 75 s: 31/34 |
| 185 | Alcatraz Avenue / Sacramento Street | signal |  | 3.26 | 0.12 | 75 s: 28/37 |
| 242 | Ashby Avenue / Martin Luther King Junior Way | signal |  | 3.18 | 0.01 | 75 s: 43/22 |
| 1069 | Claremont Avenue / Colby Street / Forest Street | signal |  | 2.99 | 0.03 | 79 s: 21/4/39 |
| 17 | 45th Street / San Pablo Avenue | signal |  | 2.94 | 0.02 | 75 s: 24/41 |
| 332 | 55th Street / Martin Luther King Junior Way | signal |  | 2.91 | 0.04 | 75 s: 38/27 |
| 851 | Alcatraz Avenue / Telegraph Avenue | signal |  | 2.91 | 0.05 | 75 s: 48/17 |

Phases of the five most blocked signals (green s: approach links with their lanes, link ids in brackets):

- node 447: 36 s: Adeline Street 4L [1049], Adeline Street 4L [1051]; 29 s: Alcatraz Avenue 2L [1048], Alcatraz Avenue 2L [1133]
- node 680: 30 s: 52nd Street 4L [1662]; 28 s: 52nd Street 4L [1666], 52nd Street 4L [1662]; 38 s: Shattuck Avenue 2L [1653], Shattuck Avenue 2L [1705]
- node 446: 35 s: Stanford Avenue 3L [941], Stanford Avenue 3L [1055]; 30 s: Market Street 4L [1108], Market Street 3L [1111]
- node 331: 34 s: Martin Luther King Junior Way 4L [704], Martin Luther King Junior Way 4L [761]; 31 s: 52nd Street 2L [758], 52nd Street 1L [760]
- node 1406: 30 s: Ashby Avenue 1L [3395], Ashby Avenue 2L [3426]; 15 s: Claremont Avenue 2L [4329]; 15 s: Claremont Avenue 3L [3447]

## Gridlock removals by link (top 10)

| Link | Street | End node | Control | Removals | First at (min) |
| --- | --- | --- | --- | --- | --- |
| 3042 | Pine Avenue | Pine Avenue / Russell Street | two_way_stop | 1 | 16.8 |

## Cars cleared from gridlock near and far (judged zone)

Judged zone: the study area, its bounding streets and the junctions on them, plus nodes within 200 m of it along the network (111 nodes, 329 links). A far clearing counts against the stability rule when its blocking chain (vehicles held at least 60 s by a full exit, at the 5 s snapshot before it) reaches a link in the zone.

| Buffer (m) | Near | Far | Far, chain reaches the zone | Judged |
| --- | --- | --- | --- | --- |
| 100.0 | 0 | 1 | 0 | 0 |
| 200.0 | 0 | 1 | 0 | 0 |
| 400.0 | 0 | 1 | 0 | 0 |

| Far node | Streets | Distance from the study area (m) | Cleared | Chain reaches the zone |
| --- | --- | --- | --- | --- |
| 1198 | Pine Avenue / Russell Street | 1162.0 | 1 | 0 |

Entry backlog at the end of the run: 1 trips waiting at origins in the zone, of 234 in all.

| Bounding street | Links | Longest standing queue on one link (m) | Link (length m) | At (min) | Share of samples with a link full |
| --- | --- | --- | --- | --- | --- |
| Telegraph Avenue | 28 | 91.0 | 2030 (101.0) | 34.9 | 0.06 |
| Alcatraz Avenue | 14 | 59.0 | 4238 (84.0) | 21.0 | 0.0 |
| College Avenue | 6 | 78.0 | 2805 (102.0) | 45.3 | 0.022 |
| Claremont Avenue | 13 | 55.0 | 2776 (161.0) | 26.8 | 0.0 |
| CA 24 | 3 | 36.0 | 1945 (188.0) | 11.5 | 0.0 |

## Junction recovery

Policy `physical`. Node entries by cars and cyclists in the run: 813337 (settle interval 0). An admission is an entry the ordinary rule would have refused; head-seconds count the time a waiting head vehicle had the reason invoked, and the part of it in which it still could not enter. Courtesy and the yield fallback change priority only; under `physical` the conflict bypass never admits.

| Reason | Admissions per hour | Per 1,000 entries | Head-s invoked | Head-s blocked |
| --- | --- | --- | --- | --- |
| courtesy | 278.0 | 0.342 | 1147 | 1061 |
| yield fallback | 122.0 | 0.150 | 36 | 0 |
| conflict bypass | 0.0 | 0.000 | 10 | 10 |

Vehicles removed while held in a node by a full exit: 0 (0.0 per hour, included in the gridlock removals).

| Node | Streets | Control | Courtesy | Yield fallback | Conflict bypass | Held removals |
| --- | --- | --- | --- | --- | --- | --- |
| 1429 | Claremont Avenue / Claremont Boulevard | two_way_stop | 23 | 1 | 0 | 0 |
| 141 | 63rd Street / Lowell Street / Market Street | two_way_stop | 14 | 6 | 0 | 0 |
| 1405 | Claremont Boulevard / Russell Street | two_way_stop | 12 | 5 | 0 | 0 |
| 395 | 65th Street / Shattuck Avenue | two_way_stop | 9 | 3 | 0 | 0 |
| 464 | 61st Street / Market Street | two_way_stop | 1 | 9 | 0 | 0 |
| 528 | Shattuck Avenue / Woolsey Street | two_way_stop | 3 | 7 | 0 | 0 |
| 767 | 58th Street / Shattuck Avenue | two_way_stop | 6 | 4 | 0 | 0 |
| 30 | 57th Street / Adeline Street / Market Street | signal | 9 | 0 | 0 | 0 |
| 125 | Alcatraz Avenue / Idaho Street | two_way_stop | 5 | 4 | 0 | 0 |
| 501 | Alcatraz Avenue / Shattuck Avenue | signal | 9 | 0 | 0 | 0 |

## Entry backlog by origin node at end of run (top 10)

| Node | Streets | Trips waiting | Offered veh/h (before scale) |
| --- | --- | --- | --- |
| 602 | Grove Shafter Freeway | 197 | 4107 |
| 1756 | Claremont Avenue | 23 | 503 |
| 648 | 54th Street / Shattuck Avenue | 3 | 19 |
| 721 | 54th Street / Shattuck Avenue | 3 | 14 |
| 1408 | Avalon Avenue / Claremont Avenue | 3 | 11 |
| 474 | 60th Street / Adeline Street | 1 | 8 |
| 654 | 53rd Street / Shattuck Avenue | 1 | 20 |
| 1080 | 62nd Street / Claremont Avenue / College Avenue | 1 | 170 |
| 1164 | College Avenue / Prince Street | 1 | 0 |
| 1204 | Webster Street | 1 | 9 |

## Flow on key streets (veh/h per direction, study-area links of 40 m or more)

| Street | Direction of travel | Links | Median flow | Max flow |
| --- | --- | --- | --- | --- |
| Telegraph | N | 12 | 1036 | 1111 |
| Telegraph | S | 10 | 1098 | 1134 |
| College | N | 3 | 445 | 445 |
| College | S | 3 | 566 | 566 |
| Claremont | N | 6 | 467 | 683 |
| Claremont | S | 7 | 336 | 797 |
| Alcatraz | E | 6 | 518 | 539 |
| Alcatraz | W | 6 | 354 | 367 |
| Hillegass | N | 4 | 133 | 137 |
| Hillegass | S | 4 | 130 | 133 |
| Colby | N | 7 | 170 | 217 |
| Colby | S | 7 | 145 | 186 |
| Martin | E | 2 | 100 | 100 |
| Martin | W | 2 | 151 | 151 |

## Largest demand origins (offered, before scale)

| Node | Streets | Veh/h |
| --- | --- | --- |
| 602 | Grove Shafter Freeway | 4107 |
| 265 | Ashby Avenue | 1134 |
| 1719 | Grove Shafter Freeway | 997 |
| 183 | San Pablo Avenue | 989 |
| 974 | Broadway | 800 |
| 1672 | Warren Freeway | 768 |
| 943 | Telegraph Avenue / Ward Street | 736 |
| 763 | Telegraph Avenue | 694 |
| 1756 | Claremont Avenue | 503 |
| 577 | Martin Luther King Junior Way | 476 |
