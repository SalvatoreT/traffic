# Calibration report: rockridge pm_peak scale 1 seed 1 (60 min)

Offered demand 25343 veh/h x scale 1 = 25343 veh/h. Run took 31.2 s wall clock. Flow tables use the window after a 10 min warm-up; select-link and health figures cover the whole run from an empty network.

## Stability (design D4)

| Criterion | Threshold | Value | Result |
| --- | --- | --- | --- |
| Gridlock removals | 0 | 0 | pass |
| Backlog / spawned | < 2% | 0.0% (10 of 25266) | pass |
| Arterial mean speed (run) | > 4 m/s | 9.23 m/s (last 15 min 9.25) | pass |

Overall: **STABLE**. Mean trip delay 134 s, mean trip time 424 s, completed 24358, unroutable 0.

| t (min) | vehicles in network | backlog | completed | removals | arterial speed in interval (m/s) |
| --- | --- | --- | --- | --- | --- |
| 5 | 2907 | 10 | 2077 | 0 | 9.41 |
| 10 | 3103 | 5 | 4055 | 0 | 9.20 |
| 15 | 3128 | 2 | 6105 | 0 | 9.02 |
| 20 | 3209 | 7 | 8119 | 0 | 9.13 |
| 25 | 3205 | 5 | 10260 | 0 | 9.26 |
| 30 | 3224 | 13 | 12348 | 0 | 9.36 |
| 35 | 3347 | 5 | 14370 | 0 | 9.25 |
| 40 | 3431 | 4 | 16391 | 0 | 9.01 |
| 45 | 3424 | 7 | 18422 | 0 | 9.34 |
| 50 | 3568 | 19 | 20392 | 0 | 9.42 |
| 55 | 3748 | 10 | 22364 | 0 | 9.19 |
| 60 | 3843 | 10 | 24358 | 0 | 9.14 |
## Wandering (completed car trips)

Detour ratio = distance driven (link and movement lengths) over the shortest network distance from the trip's origin to its destination. Detour against the free-flow route uses the time-shortest route with no congestion and no noise, which is what a purposeful driver without live information would follow (it differs from the shortest distance when a faster, longer road exists). A switch is a change of the remaining route while en route. Loops: the same link twice or the same node three or more times. Reversals: a link followed by its reverse within 200 m. 'Study-area vehicle-miles' are miles driven on links inside the study area; the last column is the share of them driven by trips with a detour ratio above 1.3. Guided drivers re-evaluate their route every epoch; the others keep their departure route unless it is blocked.

| Trips | n | Switches per trip | With a switch | Mean detour | Median detour | Detour > 1.3 | Detour > 2 | Mean detour vs free-flow route | Vs free-flow route > 1.3 | Loops | Reversals | Study veh-miles | Of them by detour > 1.3 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| all trips | 22295 | 0.01 | 0.8% | 1.088 | 1.051 | 4.6% | 0.0% | 1.028 | 1.6% | 0.0% | 5.2% | 2286 | 7.7% |
| gate to gate | 8045 | 0.01 | 1.1% | 1.085 | 1.050 | 3.1% | 0.0% | 1.023 | 1.4% | 0.0% | 7.7% | 545 | 8.0% |
| with a local end | 14250 | 0.01 | 0.7% | 1.090 | 1.052 | 5.5% | 0.0% | 1.030 | 1.8% | 0.0% | 3.8% | 1741 | 7.7% |
| guided drivers | 10181 | 0.02 | 1.7% | 1.089 | 1.052 | 4.8% | 0.0% | 1.028 | 1.8% | 0.0% | 5.1% | 1038 | 7.2% |
| other drivers | 12114 | 0.00 | 0.1% | 1.088 | 1.051 | 4.5% | 0.0% | 1.028 | 1.5% | 0.0% | 5.3% | 1248 | 8.1% |

## Reported patterns (diagnostics; configured in the targets file under `patterns`)

(a) Trips between the surface gates on the north side of the ramps and the freeway mainline gates, and the local-street (residential and service links in the study area) vehicle-miles they drive. Share = of all completed trips' local-street vehicle-miles (442 miles). No observed counterpart exists for this quantity (the targets file has only the select-link shares above).

| Trips | n trips | Local-street veh-miles | Share of all local-street veh-miles |
| --- | --- | --- | --- |
| surface gates to the freeway | 1801 | 40.8 | 9% |
| freeway to the surface gates | 938 | 28.8 | 7% |

(b) Corridor trips: completed trips from beyond one end of the corridor's study-area extent (the bypass street and its arterial together) to beyond the other end, within a lateral limit of the corridor, by direction. 'Bypass' = at least N blocks (links) on the bypass street; 'arterial' = fewer bypass blocks and at least N on the arterial; 'other' = neither (another street, the freeway or a short use); blocks are counted on the corridor's study-area links. No observed counterpart exists for these shares. The related observed values are in the select-link table above: northbound Hillegass Ave traffic rarely ends on College Ave (6%), 21 to 33% jogs to Benvenue Ave, and southbound freeway-bound drivers on College Ave commonly arrive via Ashby Ave and Benvenue Ave and jog to Hillegass Ave.

| Bypass | Arterial | N | Direction | Corridor trips | Bypass | Arterial | Other | Mean bypass blocks |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue | College Avenue | 3 | N | 1549 | 2% | 17% | 80% | 0.1 |
| Hillegass Avenue | College Avenue | 3 | S | 1454 | 6% | 24% | 71% | 0.2 |

## Per-mode results

Offered: 25343 car veh/h; 626 bicycle flows (764/h); 2000 pedestrian flows (1731/h). Bicycle and pedestrian volumes are assumptions, not counts.

| Mode | In network | Completed | Mean time (s) | Other |
| --- | --- | --- | --- | --- |
| Car | 3843 | 24358 | 424 | |
| Bicycle | 64 | 778 | 266 | |
| Pedestrian | 226 | 1614 | 448 | mean crossing delay 9.5 s |

Vulnerable road users (surrogate indicators): pedestrian conflicts 315, bicycle conflicts 499, close passes 515, pedestrian injury-risk index 0.049, bicycle injury-risk index 0.066 (proxy), mean vehicle speed at pedestrian encounters 2.47 m/s.


## Through cars on the counted blocks (a car is through when neither trip end is in the study area)

Observed through range = from the cars that drove the whole street (volunteer count, a lower bound) to the block volume less the cars whose trip ends along the street (an upper bound). Observed freeway-end trips = observed block volume times the observed freeway share of the street (the headline share of the targets file); these include freeway trips that end inside the study area, so they are not an expected through count. Modeled through = select-link trips with no end in the study area, per hour. Modeled freeway = select-link trips from or to a freeway node, per hour.

| Block | Observed volume (veh/h) | Observed freeway share | Observed freeway-end trips (veh/h) | Observed through range (veh/h) | Modeled through (veh/h) | In range | Modeled freeway trips (veh/h) |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue NB | 110 | 47.0% | 52 | 48 to 95 | 75 | yes | 117 |
| Colby Street NB | 174 | 47.0% | 82 | 102 to 145 | 122 | yes | 105 |
| Hillegass Avenue SB | 160 | 68.0% | 109 | 79 to 120 | 116 | yes | 130 |
| Colby Street SB | 160 | 45.0% | 72 | 39 to 117 | 123 | above | 121 |

## Intent map: through cars by where they come from and where they are going

Through = neither trip end is in the study area. Groups are the approach groups of the area config (data/areas); a node that is not a gate takes the group of the nearest surface gate (ASSUMPTION). The arterial is the one a trip would use on the shortest free-flow path with the study area's residential and service streets closed, where that path runs on a boundary street near the study area.

Model figures are the mean of 1 seed(s), per hour of the run. Basis: OBSERVED = read from the resident volunteer count of Feb 25, 2025 or its headline shares; ASSUMPTION = inferred from those numbers or chosen.

### Colby Street NB

Observed: block volume 174 veh/h, whole-street cars 102, so through cars 102 to 145 veh/h. Model: 122 through cars per hour.

Observed (PM): 182 cars entered at the south end, 102 drove the whole street, 164 left it at Alcatraz Ave (131 left, 32 right, 1 straight), and 47% of the block's trips came from a freeway (the headline share). ASSUMPTION: freeway-origin cars that do not end along the street are 65 veh/h (the 82 freeway-origin trips on the block, 47% of 174, times the 182 / (182 + 47) of its cars that entered at the south end rather than joining on the way), spread over the 164 exits in proportion (0.40); the other through cars come from the Telegraph Ave and south-side approaches that feed the street's south end. Ranges: low = 131 (32) x 0.47 x 0.62 (the whole-street share of exits), high = 131 (32) x 0.47.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | OBSERVED turn count x ASSUMPTION share (131 left turns x 0.40) | 52 (38 to 62) | 44 | within |
| Telegraph Ave and south-side traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | ASSUMPTION: the through left-turners (131 x 0.62 = 81) that are not off-ramp traffic | 29 (19 to 43) | 39 | within |
| SR-24 off-ramp traffic using Colby St to reach College Ave and Berkeley (right at Alcatraz Ave) | OBSERVED turn count x ASSUMPTION share (32 right turns x 0.40) | 13 (9 to 15) | 18 | above |
| Telegraph Ave and south-side traffic using Colby St to reach College Ave and Berkeley | ASSUMPTION: the through right-turners (32 x 0.62 = 20) that are not off-ramp traffic | 7 (5 to 11) | 20 | above |
| Intents listed, together | | 101 (71 to 131) | 121 | |
| Other through cars (no intent listed) | | | 1 | |

Model through cars by origin and destination group (largest 12 of 23 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 28.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 10.0 | Telegraph Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Ashby Ave from the west (Emeryville and I-80) | 9.0 | SR-24 then Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 9.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Ashby Ave from the west (Emeryville and I-80) | 8.0 | none near the study area |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 8.0 | Claremont Avenue then College Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 8.0 | SR-24 |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Shattuck Ave from the north (Berkeley) | 7.0 | Claremont Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Emeryville and West Oakland streets (55th to 67th Streets) | 6.0 | Claremont Avenue |
| Telegraph Ave to the south (downtown Oakland) | Telegraph Ave from the north (Berkeley) | 6.0 | Telegraph Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Telegraph Ave from the north (Berkeley) | 5.0 | none near the study area |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Claremont Ave and Tunnel Rd toward the hills | 3.0 | Claremont Avenue |
| other pairs | | 15.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 57 veh/h; Claremont Avenue 20 veh/h; none near the study area 14 veh/h; SR-24 then Telegraph Avenue 9 veh/h; Claremont Avenue then College Avenue 8 veh/h; SR-24 8 veh/h.

### Hillegass Avenue NB

Observed: block volume 110 veh/h, whole-street cars 48, so through cars 48 to 95 veh/h. Model: 75 through cars per hour.

Observed (PM): 94 cars entered at the south end, 48 drove the whole street, 109 left it at Alcatraz Ave (43 west, 54 east, 12 straight), and 47% of the block's trips came from a freeway. ASSUMPTION: freeway-origin through cars are 40 veh/h (52 freeway-origin trips times 94 / (94 + 29)), spread over the exits in proportion (0.37); the through share of exits is 48 / 109 = 0.44.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Hillegass Ave to reach Alcatraz Ave west and Telegraph Ave north | OBSERVED turn count x ASSUMPTION share (43 left turns x 0.37) | 16 (9 to 20) | 22 | above |
| SR-24 off-ramp traffic using Hillegass Ave to reach College Ave and Berkeley | OBSERVED turn count x ASSUMPTION share (54 right turns x 0.37) | 20 (11 to 25) | 23 | within |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach Alcatraz Ave west | ASSUMPTION: through exits (43 x 0.44) that are not off-ramp traffic | 3 (0 to 10) | 6 | within |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach College Ave and Berkeley | ASSUMPTION: through exits (54 x 0.44) that are not off-ramp traffic | 4 (0 to 13) | 19 | above |
| Intents listed, together | | 43 (20 to 68) | 70 | |
| Other through cars (no intent listed) | | | 5 | |

Model through cars by origin and destination group (largest 12 of 23 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 15.0 | SR-24 |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 12.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 10.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 5.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Ashby Ave from the west (Emeryville and I-80) | 4.0 | College Avenue then Alcatraz Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | San Pablo Ave (Emeryville and West Oakland) | 3.0 | SR-24 |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Shattuck Ave from the north (Berkeley) | 3.0 | SR-24 then Telegraph Avenue then Alcatraz Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Telegraph Ave from the north (Berkeley) | 3.0 | none near the study area |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | College Ave from the north (Berkeley) | 3.0 | SR-24 then Claremont Avenue then College Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 2.0 | Telegraph Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Claremont Ave and Tunnel Rd toward the hills | 2.0 | Alcatraz Avenue then Claremont Avenue |
| West Oakland to the southwest (Adeline St, Market St) | College Ave from the north (Berkeley) | 2.0 | Telegraph Avenue |
| other pairs | | 11.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 34 veh/h; SR-24 18 veh/h; College Avenue then Alcatraz Avenue 6 veh/h; Alcatraz Avenue then Claremont Avenue 3 veh/h; SR-24 then Claremont Avenue then College Avenue 3 veh/h; SR-24 then Telegraph Avenue then Alcatraz Avenue 3 veh/h.

### Hillegass Avenue SB

Observed: block volume 160 veh/h, whole-street cars 79, so through cars 79 to 120 veh/h. Model: 116 through cars per hour.

Observed (PM): 178 cars entered at the top (76 turned in from Alcatraz Ave west, 98 from the east, 4 came straight from the north), 79 drove the whole street, and 68% of the block's trips (109 veh/h) went to a freeway. ASSUMPTION: freeway-bound cars that did not join mid-street are 87 veh/h (109 x 178 / (178 + 44)), half of the 174 turn-ins; low = the whole-street share of the turn-ins (0.45), high = the freeway-bound share without the mid-street correction (0.63).

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Telegraph Ave, Alcatraz Ave west and West Berkeley traffic turning off Alcatraz Ave onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (76 turn-ins x 0.50) | 38 (34 to 48) | 44 | within |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (98 turn-ins x 0.50) | 49 (44 to 62) | 57 | within |
| Intents listed, together | | 87 (78 to 110) | 101 | |
| Other through cars (no intent listed) | | | 15 | |

Model through cars by origin and destination group (largest 12 of 12 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 44.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 26.0 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 14.0 | Claremont Avenue then SR-24 |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 13.0 | College Avenue then Claremont Avenue then SR-24 |
| Ashby Ave from the west (Emeryville and I-80) | College Ave from the north (Berkeley) | 5.0 | Alcatraz Avenue then College Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 5.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 2.0 | Claremont Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Telegraph Ave to the south (downtown Oakland) | 2.0 | Telegraph Avenue |
| Berkeley hills to the northeast (Evergreen Ln, Gravatt Dr) | SR-24 westbound on-ramps (toward Oakland and I-980) | 2.0 | Claremont Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 1.0 | Alcatraz Avenue then College Avenue |
| West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 1.0 | College Avenue |
| Telegraph Ave from the north (Berkeley) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 1.0 | Telegraph Avenue |

By the arterial these cars would otherwise use: Telegraph Avenue 78 veh/h; Claremont Avenue then SR-24 16 veh/h; College Avenue then Claremont Avenue then SR-24 13 veh/h; Alcatraz Avenue then College Avenue 6 veh/h; Claremont Avenue 2 veh/h; College Avenue 1 veh/h.

### Colby Street SB

Observed: block volume 160 veh/h, whole-street cars 39, so through cars 39 to 117 veh/h. Model: 123 through cars per hour.

Observed (PM): 139 cars entered at the top (76 from Alcatraz Ave west, 50 from the east, 13 from the north), 39 drove the whole street, 45% of the block's trips (72 veh/h) went to a freeway and 22% came by way of Telegraph Ave. ASSUMPTION: freeway-bound cars that did not join mid-street are 46 veh/h (72 x 139 / (139 + 79)), 0.365 of the 126 turn-ins; low = the whole-street share (0.31), high = the unadjusted freeway share (0.57). The Telegraph Ave cars are the 22% x 160 = 35 of the 76 west turn-ins.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Southbound Telegraph Ave traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (35 Telegraph Ave cars x 0.365) | 13 (11 to 20) | 21 | above |
| Alcatraz Ave west, Ashby Ave and West Berkeley traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (41 other west turn-ins x 0.365) | 15 (13 to 23) | 16 | within |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (50 east turn-ins x 0.365) | 18 (15 to 29) | 48 | above |
| Intents listed, together | | 46 (39 to 72) | 85 | |
| Other through cars (no intent listed) | | | 38 | |

Model through cars by origin and destination group (largest 12 of 19 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 35.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 21.0 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 21.0 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 8.0 | Claremont Avenue then SR-24 |
| Shattuck Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 8.0 | none near the study area |
| Telegraph Ave from the north (Berkeley) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 7.0 | Telegraph Avenue |
| Alcatraz Ave from the west (Emeryville side) | SR-13 Warren Freeway (via SR-24 east) | 4.0 | SR-24 |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 4.0 | College Avenue then Claremont Avenue then SR-24 |
| Ashby Ave from the west (Emeryville and I-80) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 3.0 | Claremont Avenue |
| Alcatraz Ave from the west (Emeryville side) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 2.0 | SR-24 |
| Ashby Ave from the west (Emeryville and I-80) | SR-13 Warren Freeway (via SR-24 east) | 2.0 | SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 1.0 | Alcatraz Avenue then College Avenue |
| other pairs | | 7.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 84 veh/h; none near the study area 10 veh/h; SR-24 9 veh/h; Claremont Avenue then SR-24 8 veh/h; Claremont Avenue 5 veh/h; College Avenue then Claremont Avenue then SR-24 4 veh/h.

### Study area, all residential and service streets

Model: 646 through cars per hour.

Model through cars by origin and destination group (largest 12 of 59 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 92.0 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 68.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 47.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 45.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 44.0 | Telegraph Avenue |
| West Oakland to the southwest (Adeline St, Market St) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 31.0 | Telegraph Avenue then Claremont Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 26.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Emeryville and West Oakland streets (55th to 67th Streets) | 25.0 | Claremont Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 23.0 | SR-24 |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 20.0 | Claremont Avenue then SR-24 |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 17.0 | College Avenue then Claremont Avenue then SR-24 |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Ashby Ave from the west (Emeryville and I-80) | 17.0 | College Avenue then Alcatraz Avenue |
| other pairs | | 191.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 377 veh/h; Claremont Avenue 54 veh/h; SR-24 35 veh/h; Telegraph Avenue then Claremont Avenue 31 veh/h; none near the study area 24 veh/h; Claremont Avenue then SR-24 22 veh/h.

By origin group: Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 148; SR-24 eastbound off-ramps (arriving from Oakland and I-980) 119; South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 104; Telegraph Ave from the north (Berkeley) 85; West Oakland to the southwest (Adeline St, Market St) 52; SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) 27; Telegraph Ave to the south (downtown Oakland) 26; Claremont Ave and Tunnel Rd toward the hills 21; College Ave from the north (Berkeley) 18; Ashby Ave from the west (Emeryville and I-80) 14.

By destination group: SR-24 westbound on-ramps (toward Oakland and I-980) 221; South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 103; Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 85; Telegraph Ave from the north (Berkeley) 80; Claremont Ave and Tunnel Rd toward the hills 46; Ashby Ave from the west (Emeryville and I-80) 27; Emeryville and West Oakland streets (55th to 67th Streets) 27; Shattuck Ave from the north (Berkeley) 16; College Ave from the north (Berkeley) 13; SR-13 Warren Freeway (via SR-24 east) 6.


## Select-link shares: modeled vs observed (design D5: headline = freeway shares, tolerance +/-10 pp)

- Hillegass Avenue NB: 4 links (path Claremont Avenue -> Alcatraz Avenue (434 m)), 223 trips (202 completed)
- Colby Street NB: 8 links (path Claremont Avenue -> Alcatraz Avenue (680 m)), 291 trips (257 completed)
- Hillegass Avenue SB: 4 links (path Alcatraz Avenue -> Claremont Avenue (433 m)), 203 trips (182 completed)
- Colby Street SB: 8 links (path Alcatraz Avenue -> Claremont Avenue (680 m)), 300 trips (278 completed)

| Block | Side | Via | Observed | Modeled | Diff (pp) | n trips | Headline |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue NB | from | freeway | 47% | 50% | +3 | 223 | within |
| Hillegass Avenue NB | to | Benvenue Avenue | 21% (PM 33%) | 4% | -29 | 223 |  |
| Hillegass Avenue NB | to | College Avenue | 6% | 14% | +8 | 223 |  |
| Hillegass Avenue NB | to | Alcatraz Avenue WB | 27% | 30% | +3 | 223 |  |
| Colby Street NB | from | freeway | 47% | 34% | -13 | 291 | OUTSIDE |
| Colby Street NB | to | Alcatraz Avenue WB | 48% | 52% | +4 | 291 |  |
| Colby Street NB | to | Telegraph Avenue | 25% | 26% | +1 | 291 |  |
| Colby Street NB | to | College Avenue | 3% | 9% | +6 | 291 |  |
| Hillegass Avenue SB | from | Alcatraz Avenue WB | 46% | 34% | -12 | 203 |  |
| Hillegass Avenue SB | from | Benvenue Avenue | 26% | 5% | -21 | 203 |  |
| Hillegass Avenue SB | from | College Avenue | 16% | 18% | +2 | 203 |  |
| Hillegass Avenue SB | to | freeway | 57% (PM 68%) | 64% | -4 | 203 | within |
| Colby Street SB | from | Alcatraz Avenue EB | 43% | 21% | -22 | 300 |  |
| Colby Street SB | from | Alcatraz Avenue WB | 46% | 15% | -31 | 300 |  |
| Colby Street SB | from | Telegraph Avenue | 22% | 23% | +1 | 300 |  |
| Colby Street SB | to | freeway | 45% | 40% | -5 | 300 | within |
| Colby Street SB | to | Forest Street | 34% | 19% | -15 | 300 |  |

Headline shares within tolerance: 3 of 4. Observed column uses the PM-peak share where one is given and the period is pm_peak. 'Via' shares are the fraction of select-link trips using that street before (from) or after (to) the block; freeway = origin / destination gate with a motorway-class link attached.

## Claremont ramps: streets used before the on-ramp / after the off-ramp

Observed shares are for traffic from/to the north only. 'Modeled' is over all trips on the ramps and any visit to the street (an upper bound for streets that serve both sides). 'Modeled, side' counts only trips whose surface end lies on the side of the ramp stated in the targets file (`freewayRamp.side`), and for a street with a qualifier ("north of X") only its links on that side of X.

| Direction | Via | Observed | Modeled | n ramp trips | Modeled, side | n side trips |
| --- | --- | --- | --- | --- | --- | --- |
| onto freeway | College Avenue | 16% | 14% | 833 | 16% | 727 |
| onto freeway | Hillegass Avenue | 12% | 14% | 833 | 16% | 727 |
| onto freeway | Martin Street | 10% | 11% | 833 | 12% | 727 |
| onto freeway | Colby Street | 8% | 12% | 833 | 13% | 727 |
| onto freeway | Telegraph Avenue north of Alcatraz Avenue | 8% | 15% | 833 | 13% | 727 |
| onto freeway | Benvenue Avenue | 5% | 4% | 833 | 4% | 727 |
| from freeway | College Avenue | 10% | 8% | 782 | 9% | 671 |
| from freeway | Martin Street | 10% | 11% | 782 | 13% | 671 |
| from freeway | Colby Street | 8% | 8% | 782 | 9% | 671 |
| from freeway | Hillegass Avenue | 5% | 7% | 782 | 8% | 671 |
| from freeway | Benvenue Avenue | 3% | 4% | 782 | 4% | 671 |

## Top 15 links by delay

| Link | Street | Class | Lanes | Len (m) | End node control | Delay (veh-h) | Stopped (veh-h) | Mean stopped veh | Flow (veh/h) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 4143 | Adeline Street | Secondary | 3 | 185 | signal | 17.87 | 13.69 | 13.7 | 510 |
| 1025 | Martin Luther King Junior Way | Secondary | 3 | 79 | signal | 7.99 | 6.52 | 6.5 | 630 |
| 1122 | Alcatraz Avenue | Tertiary | 1 | 299 | signal | 7.71 | 5.63 | 5.6 | 272 |
| 1051 | Adeline Street | Secondary | 4 | 50 | signal | 6.86 | 5.78 | 5.8 | 976 |
| 3395 | Ashby Avenue | Primary | 1 | 129 | signal | 6.54 | 3.91 | 3.9 | 906 |
| 3344 | Domingo Avenue | Residential | 1 | 110 | signal | 6.05 | 4.74 | 4.7 | 383 |
| 4382 | Warren Freeway | Motorway | 2 | 744 | uncontrolled | 5.96 | 1.10 | 1.1 | 1102 |
| 4329 | Claremont Avenue | Secondary | 2 | 113 | signal | 5.44 | 4.23 | 4.2 | 342 |
| 769 | Martin Luther King Junior Way | Secondary | 3 | 112 | signal | 5.42 | 3.33 | 3.3 | 1296 |
| 4150 | Alcatraz Avenue | Tertiary | 1 | 160 | uncontrolled | 5.34 | 2.91 | 2.9 | 445 |
| 1662 | 52nd Street | Secondary | 4 | 53 | signal | 5.01 | 3.60 | 3.6 | 1168 |
| 498 | Sacramento Street | Tertiary | 3 | 48 | signal | 4.97 | 4.04 | 4.0 | 800 |
| 1037 | Sacramento Street | Tertiary | 3 | 40 | signal | 4.71 | 3.66 | 3.7 | 1223 |
| 115 | San Pablo Avenue | Primary | 3 | 54 | signal | 4.42 | 3.30 | 3.3 | 838 |
| 3447 | Claremont Avenue | Secondary | 3 | 43 | signal | 4.36 | 3.71 | 3.7 | 397 |

## Top 15 nodes by blocked time

Blocked time = lane-head seconds waiting at the stop line without permission (signal red, conflict, stop sign or no downstream space).

| Node | Streets | Control | Gate | Blocked (lane-h) | of which no downstream space | Signal plan at end (cycle: greens) |
| --- | --- | --- | --- | --- | --- | --- |
| 446 | Market Street / Stanford Avenue | signal |  | 5.40 | 0.12 | 75 s: 47/18 |
| 680 | 52nd Street / Shattuck Avenue | signal |  | 4.99 | 0.08 | 110 s: 30/28/38 |
| 447 | Adeline Street / Alcatraz Avenue | signal |  | 4.55 | 0.11 | 75 s: 28/37 |
| 185 | Alcatraz Avenue / Sacramento Street | signal |  | 3.47 | 0.04 | 75 s: 37/28 |
| 37 | San Pablo Avenue / Stanford Avenue | signal |  | 3.38 | 0.00 | 75 s: 32/33 |
| 30 | 57th Street / Adeline Street / Market Street | signal |  | 3.17 | 0.01 | 75 s: 17/28/15 |
| 1080 | 62nd Street / Claremont Avenue / College Avenue | signal |  | 3.16 | 0.04 | 75 s: 15/30/15 |
| 1406 | Ashby Avenue / Claremont Avenue | signal |  | 3.15 | 0.13 | 75 s: 50/15 |
| 851 | Alcatraz Avenue / Telegraph Avenue | signal |  | 2.99 | 0.04 | 75 s: 40/25 |
| 237 | Ashby Avenue / Sacramento Street | signal |  | 2.88 | 0.00 | 75 s: 43/22 |
| 1069 | Claremont Avenue / Colby Street / Forest Street | signal |  | 2.81 | 0.00 | 79 s: 24/4/36 |
| 944 | Ashby Avenue / Shattuck Avenue | signal |  | 2.80 | 0.00 | 75 s: 40/25 |
| 479 | Adeline Street / Martin Luther King Junior Way / Stanford Avenue | signal |  | 2.77 | 0.00 | 75 s: 15/50 |
| 713 | 51st Street / Telegraph Avenue | signal |  | 2.71 | 0.00 | 75 s: 35/30 |
| 947 | Ashby Avenue / Telegraph Avenue | signal |  | 2.61 | 0.00 | 75 s: 27/38 |

Phases of the five most blocked signals (green s: approach links with their lanes, link ids in brackets):

- node 446: 47 s: Stanford Avenue 1L [941], Stanford Avenue 3L [1055]; 18 s: Market Street 4L [1108], Market Street 3L [1111]
- node 680: 30 s: 52nd Street 4L [1662]; 28 s: 52nd Street 4L [1666], 52nd Street 4L [1662]; 38 s: Shattuck Avenue 2L [1653], Shattuck Avenue 2L [1705]
- node 447: 28 s: Adeline Street 4L [1049], Adeline Street 4L [1051]; 37 s: Alcatraz Avenue 2L [1048], Alcatraz Avenue 2L [1133]
- node 185: 37 s: Alcatraz Avenue 1L [363], Alcatraz Avenue 1L [1162]; 28 s: Sacramento Street 3L [1036], Sacramento Street 3L [1037]
- node 37: 32 s: San Pablo Avenue 3L [114], San Pablo Avenue 3L [115]; 33 s: Stanford Avenue 3L [108], Stanford Avenue 2L [4109]

## Entry backlog by origin node at end of run (top 10)

| Node | Streets | Trips waiting | Offered veh/h (before scale) |
| --- | --- | --- | --- |
| 1093 | College Avenue / Harwood Avenue | 4 | 263 |
| 1025 | College Avenue / Hudson Street / Manila Avenue | 2 | 34 |
| 1372 | Domingo Avenue / Russell Street | 2 | 78 |
| 1128 | Alcatraz Avenue / Benvenue Avenue | 1 | 36 |
| 1232 | Ashby Avenue / Claremont Crescent | 1 | 31 |

## Flow on key streets (veh/h per direction, study-area links of 40 m or more)

| Street | Direction of travel | Links | Median flow | Max flow |
| --- | --- | --- | --- | --- |
| Telegraph | N | 12 | 1116 | 1150 |
| Telegraph | S | 10 | 779 | 821 |
| College | N | 3 | 416 | 418 |
| College | S | 3 | 670 | 670 |
| Claremont | N | 6 | 376 | 560 |
| Claremont | S | 7 | 289 | 792 |
| Alcatraz | E | 6 | 575 | 584 |
| Alcatraz | W | 6 | 353 | 444 |
| Hillegass | N | 4 | 116 | 148 |
| Hillegass | S | 4 | 161 | 163 |
| Colby | N | 7 | 143 | 187 |
| Colby | S | 7 | 163 | 190 |
| Martin | E | 2 | 119 | 119 |
| Martin | W | 2 | 108 | 108 |

## Largest demand origins (offered, before scale)

| Node | Streets | Veh/h |
| --- | --- | --- |
| 602 | Grove Shafter Freeway | 4099 |
| 1672 | Warren Freeway | 1262 |
| 265 | Ashby Avenue | 1134 |
| 183 | San Pablo Avenue | 1119 |
| 943 | Telegraph Avenue / Ward Street | 998 |
| 974 | Broadway | 799 |
| 763 | Telegraph Avenue | 723 |
| 184 | Alcatraz Avenue | 515 |
| 1756 | Claremont Avenue | 471 |
| 276 | Martin Luther King Junior Way | 439 |
