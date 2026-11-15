# Calibration report: rockridge am_peak scale 1 seed 1 (60 min)

Offered demand 21981 veh/h x scale 1 = 21981 veh/h. Run took 22.7 s wall clock. Flow tables use the window after a 10 min warm-up; select-link and health figures cover the whole run from an empty network.

## Stability (design D4)

| Criterion | Threshold | Value | Result |
| --- | --- | --- | --- |
| Gridlock removals | 0 | 0 | pass |
| Backlog / spawned | < 2% | 0.0% (3 of 22201) | pass |
| Arterial mean speed (run) | > 4 m/s | 9.58 m/s (last 15 min 9.64) | pass |

Overall: **STABLE**. Mean trip delay 110 s, mean trip time 400 s, completed 22130, unroutable 0.

| t (min) | vehicles in network | backlog | completed | removals | arterial speed in interval (m/s) |
| --- | --- | --- | --- | --- | --- |
| 5 | 2569 | 0 | 1891 | 0 | 9.36 |
| 10 | 2562 | 1 | 3714 | 0 | 9.38 |
| 15 | 2549 | 2 | 5599 | 0 | 9.75 |
| 20 | 2625 | 4 | 7422 | 0 | 9.52 |
| 25 | 2676 | 4 | 9262 | 0 | 9.69 |
| 30 | 2621 | 0 | 11145 | 0 | 9.49 |
| 35 | 2551 | 2 | 13048 | 0 | 9.57 |
| 40 | 2651 | 1 | 14819 | 0 | 9.73 |
| 45 | 2729 | 1 | 16582 | 0 | 9.62 |
| 50 | 2718 | 5 | 18397 | 0 | 9.59 |
| 55 | 2715 | 1 | 20247 | 0 | 9.55 |
| 60 | 2663 | 3 | 22130 | 0 | 9.78 |
## Wandering (completed car trips)

Detour ratio = distance driven (link and movement lengths) over the shortest network distance from the trip's origin to its destination. Detour against the free-flow route uses the time-shortest route with no congestion and no noise, which is what a purposeful driver without live information would follow (it differs from the shortest distance when a faster, longer road exists). A switch is a change of the remaining route while en route. Loops: the same link twice or the same node three or more times. Reversals: a link followed by its reverse within 200 m. 'Study-area vehicle-miles' are miles driven on links inside the study area; the last column is the share of them driven by trips with a detour ratio above 1.3. Guided drivers re-evaluate their route every epoch; the others keep their departure route unless it is blocked.

| Trips | n | Switches per trip | With a switch | Mean detour | Median detour | Detour > 1.3 | Detour > 2 | Mean detour vs free-flow route | Vs free-flow route > 1.3 | Loops | Reversals | Study veh-miles | Of them by detour > 1.3 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| all trips | 20297 | 0.00 | 0.3% | 1.086 | 1.051 | 4.1% | 0.0% | 1.024 | 1.1% | 0.0% | 5.3% | 1983 | 7.3% |
| gate to gate | 7143 | 0.00 | 0.2% | 1.087 | 1.057 | 2.1% | 0.0% | 1.021 | 0.8% | 0.0% | 7.5% | 386 | 7.3% |
| with a local end | 13154 | 0.00 | 0.3% | 1.086 | 1.050 | 5.1% | 0.0% | 1.025 | 1.3% | 0.0% | 4.0% | 1598 | 7.3% |
| guided drivers | 9315 | 0.01 | 0.6% | 1.087 | 1.052 | 4.2% | 0.0% | 1.024 | 1.2% | 0.0% | 5.4% | 896 | 6.9% |
| other drivers | 10982 | 0.00 | 0.0% | 1.086 | 1.051 | 4.0% | 0.0% | 1.024 | 1.0% | 0.0% | 5.2% | 1087 | 7.5% |

## Reported patterns (diagnostics; configured in the targets file under `patterns`)

(a) Trips between the surface gates on the north side of the ramps and the freeway mainline gates, and the local-street (residential and service links in the study area) vehicle-miles they drive. Share = of all completed trips' local-street vehicle-miles (345 miles). No observed counterpart exists for this quantity (the targets file has only the select-link shares above).

| Trips | n trips | Local-street veh-miles | Share of all local-street veh-miles |
| --- | --- | --- | --- |
| surface gates to the freeway | 1359 | 20.5 | 6% |
| freeway to the surface gates | 1092 | 27.5 | 8% |

(b) Corridor trips: completed trips from beyond one end of the corridor's study-area extent (the bypass street and its arterial together) to beyond the other end, within a lateral limit of the corridor, by direction. 'Bypass' = at least N blocks (links) on the bypass street; 'arterial' = fewer bypass blocks and at least N on the arterial; 'other' = neither (another street, the freeway or a short use); blocks are counted on the corridor's study-area links. No observed counterpart exists for these shares. The related observed values are in the select-link table above: northbound Hillegass Ave traffic rarely ends on College Ave (6%), 21 to 33% jogs to Benvenue Ave, and southbound freeway-bound drivers on College Ave commonly arrive via Ashby Ave and Benvenue Ave and jog to Hillegass Ave.

| Bypass | Arterial | N | Direction | Corridor trips | Bypass | Arterial | Other | Mean bypass blocks |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue | College Avenue | 3 | N | 1117 | 4% | 12% | 84% | 0.2 |
| Hillegass Avenue | College Avenue | 3 | S | 1290 | 3% | 21% | 76% | 0.1 |

## Per-mode results

Offered: 21981 car veh/h; 497 bicycle flows (702/h); 2000 pedestrian flows (1340/h). Bicycle and pedestrian volumes are assumptions, not counts.

| Mode | In network | Completed | Mean time (s) | Other |
| --- | --- | --- | --- | --- |
| Car | 2663 | 22130 | 400 | |
| Bicycle | 47 | 713 | 254 | |
| Pedestrian | 168 | 1204 | 470 | mean crossing delay 7.9 s |

Vulnerable road users (surrogate indicators): pedestrian conflicts 270, bicycle conflicts 430, close passes 746, pedestrian injury-risk index 0.050, bicycle injury-risk index 0.068 (proxy), mean vehicle speed at pedestrian encounters 2.56 m/s.


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
| SR-24 off-ramp traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | OBSERVED turn count x ASSUMPTION share (131 left turns x 0.40) | 52 (38 to 62) | 43 | within |
| Telegraph Ave and south-side traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | ASSUMPTION: the through left-turners (131 x 0.62 = 81) that are not off-ramp traffic | 29 (19 to 43) | 24 | within |
| SR-24 off-ramp traffic using Colby St to reach College Ave and Berkeley (right at Alcatraz Ave) | OBSERVED turn count x ASSUMPTION share (32 right turns x 0.40) | 13 (9 to 15) | 2 | below |
| Telegraph Ave and south-side traffic using Colby St to reach College Ave and Berkeley | ASSUMPTION: the through right-turners (32 x 0.62 = 20) that are not off-ramp traffic | 7 (5 to 11) | 20 | above |
| Intents listed, together | | 101 (71 to 131) | 89 | |
| Other through cars (no intent listed) | | | 1 | |

Model through cars by origin and destination group (largest 12 of 11 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 43.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 19.0 | Claremont Avenue then College Avenue then Alcatraz Avenue |
| Telegraph Ave to the south (downtown Oakland) | Telegraph Ave from the north (Berkeley) | 12.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Shattuck Ave from the north (Berkeley) | 4.0 | College Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Telegraph Ave from the north (Berkeley) | 3.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Ashby Ave from the west (Emeryville and I-80) | 2.0 | Claremont Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 2.0 | College Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 2.0 | SR-24 then Claremont Avenue then College Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | College Ave from the north (Berkeley) | 1.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Emeryville and West Oakland streets (55th to 67th Streets) | 1.0 | Claremont Avenue |
| Telegraph Ave to the south (downtown Oakland) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 1.0 | Telegraph Avenue |

By the arterial these cars would otherwise use: Telegraph Avenue 60 veh/h; Claremont Avenue then College Avenue then Alcatraz Avenue 19 veh/h; College Avenue 6 veh/h; Claremont Avenue 3 veh/h; SR-24 then Claremont Avenue then College Avenue 2 veh/h.

### Hillegass Avenue NB

Observed (PM): 94 cars entered at the south end, 48 drove the whole street, 109 left it at Alcatraz Ave (43 west, 54 east, 12 straight), and 47% of the block's trips came from a freeway. ASSUMPTION: freeway-origin through cars are 40 veh/h (52 freeway-origin trips times 94 / (94 + 29)), spread over the exits in proportion (0.37); the through share of exits is 48 / 109 = 0.44.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Hillegass Ave to reach Alcatraz Ave west and Telegraph Ave north | OBSERVED turn count x ASSUMPTION share (43 left turns x 0.37) | 16 (9 to 20) | 26 | above |
| SR-24 off-ramp traffic using Hillegass Ave to reach College Ave and Berkeley | OBSERVED turn count x ASSUMPTION share (54 right turns x 0.37) | 20 (11 to 25) | 31 | above |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach Alcatraz Ave west | ASSUMPTION: through exits (43 x 0.44) that are not off-ramp traffic | 3 (0 to 10) | 14 | above |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach College Ave and Berkeley | ASSUMPTION: through exits (54 x 0.44) that are not off-ramp traffic | 4 (0 to 13) | 8 | within |
| Intents listed, together | | 43 (20 to 68) | 79 | |
| Other through cars (no intent listed) | | | 2 | |

Model through cars by origin and destination group (largest 12 of 19 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 17.0 | SR-24 |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 12.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | College Ave from the north (Berkeley) | 8.0 | SR-24 then Claremont Avenue then College Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 6.0 | SR-24 then Claremont Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 5.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Shattuck Ave from the north (Berkeley) | 5.0 | College Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Shattuck Ave from the north (Berkeley) | 4.0 | SR-24 then Telegraph Avenue then Alcatraz Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Alcatraz Ave from the west (Emeryville side) | 3.0 | College Avenue then Alcatraz Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 3.0 | Telegraph Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Ashby Ave from the west (Emeryville and I-80) | 3.0 | SR-24 then Telegraph Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Telegraph Ave from the north (Berkeley) | 3.0 | none near the study area |
| West Oakland to the southwest (Adeline St, Market St) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 2.0 | Telegraph Avenue |
| other pairs | | 10.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 25 veh/h; SR-24 19 veh/h; SR-24 then Claremont Avenue then College Avenue 8 veh/h; SR-24 then Claremont Avenue 6 veh/h; College Avenue 5 veh/h; SR-24 then Telegraph Avenue 5 veh/h.

### Hillegass Avenue SB

Observed (PM): 178 cars entered at the top (76 turned in from Alcatraz Ave west, 98 from the east, 4 came straight from the north), 79 drove the whole street, and 68% of the block's trips (109 veh/h) went to a freeway. ASSUMPTION: freeway-bound cars that did not join mid-street are 87 veh/h (109 x 178 / (178 + 44)), half of the 174 turn-ins; low = the whole-street share of the turn-ins (0.45), high = the freeway-bound share without the mid-street correction (0.63).

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Telegraph Ave, Alcatraz Ave west and West Berkeley traffic turning off Alcatraz Ave onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (76 turn-ins x 0.50) | 38 (34 to 48) | 17 | below |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (98 turn-ins x 0.50) | 49 (44 to 62) | 32 | below |
| Intents listed, together | | 87 (78 to 110) | 49 | |
| Other through cars (no intent listed) | | | 24 | |

Model through cars by origin and destination group (largest 12 of 12 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 21.0 | Claremont Avenue then SR-24 |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 17.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 14.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 6.0 | Claremont Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Telegraph Ave to the south (downtown Oakland) | 4.0 | Telegraph Avenue |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 4.0 | College Avenue then Claremont Avenue then SR-24 |
| Emeryville and West Oakland streets (55th to 67th Streets) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 2.0 | Alcatraz Avenue then College Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Claremont Ave and Tunnel Rd toward the hills | 1.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | West Oakland to the southwest (Adeline St, Market St) | 1.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 1.0 | Alcatraz Avenue then College Avenue |
| College Ave from the north (Berkeley) | Telegraph Ave to the south (downtown Oakland) | 1.0 | College Avenue then Claremont Avenue |
| Telegraph Ave from the north (Berkeley) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 1.0 | Telegraph Avenue |

By the arterial these cars would otherwise use: Telegraph Avenue 38 veh/h; Claremont Avenue then SR-24 27 veh/h; College Avenue then Claremont Avenue then SR-24 4 veh/h; Alcatraz Avenue then College Avenue 3 veh/h; College Avenue then Claremont Avenue 1 veh/h.

### Colby Street SB

Observed (PM): 139 cars entered at the top (76 from Alcatraz Ave west, 50 from the east, 13 from the north), 39 drove the whole street, 45% of the block's trips (72 veh/h) went to a freeway and 22% came by way of Telegraph Ave. ASSUMPTION: freeway-bound cars that did not join mid-street are 46 veh/h (72 x 139 / (139 + 79)), 0.365 of the 126 turn-ins; low = the whole-street share (0.31), high = the unadjusted freeway share (0.57). The Telegraph Ave cars are the 22% x 160 = 35 of the 76 west turn-ins.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Southbound Telegraph Ave traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (35 Telegraph Ave cars x 0.365) | 13 (11 to 20) | 13 | within |
| Alcatraz Ave west, Ashby Ave and West Berkeley traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (41 other west turn-ins x 0.365) | 15 (13 to 23) | 13 | within |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (50 east turn-ins x 0.365) | 18 (15 to 29) | 24 | within |
| Intents listed, together | | 46 (39 to 72) | 50 | |
| Other through cars (no intent listed) | | | 29 | |

Model through cars by origin and destination group (largest 12 of 18 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 20.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 13.0 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 11.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | West Oakland to the southwest (Adeline St, Market St) | 8.0 | Telegraph Avenue |
| Shattuck Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 7.0 | none near the study area |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 3.0 | Claremont Avenue then SR-24 |
| Ashby Ave from the west (Emeryville and I-80) | SR-13 Warren Freeway (via SR-24 east) | 2.0 | SR-24 |
| Ashby Ave from the west (Emeryville and I-80) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 2.0 | SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Telegraph Ave to the south (downtown Oakland) | 2.0 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 2.0 | none near the study area |
| Emeryville and West Oakland streets (55th to 67th Streets) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 2.0 | Alcatraz Avenue then College Avenue |
| Alcatraz Ave from the west (Emeryville side) | Berkeley hills to the northeast (Evergreen Ln, Gravatt Dr) | 1.0 | Alcatraz Avenue then Claremont Avenue |
| other pairs | | 6.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 54 veh/h; none near the study area 10 veh/h; SR-24 7 veh/h; Alcatraz Avenue then College Avenue 3 veh/h; Claremont Avenue then SR-24 3 veh/h; Alcatraz Avenue then Claremont Avenue 1 veh/h.

### Study area, all residential and service streets

Model: 433 through cars per hour.

Model through cars by origin and destination group (largest 12 of 58 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 56.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 41.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 32.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 27.0 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 26.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 22.0 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 21.0 | Claremont Avenue then SR-24 |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Shattuck Ave from the north (Berkeley) | 18.0 | Claremont Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 17.0 | SR-24 |
| Telegraph Ave to the south (downtown Oakland) | Telegraph Ave from the north (Berkeley) | 13.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | West Oakland to the southwest (Adeline St, Market St) | 11.0 | Telegraph Avenue |
| Telegraph Ave to the south (downtown Oakland) | SR-24 westbound on-ramps (toward Oakland and I-980) | 10.0 | Telegraph Avenue |
| other pairs | | 139.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 261 veh/h; SR-24 38 veh/h; Claremont Avenue 36 veh/h; Claremont Avenue then SR-24 21 veh/h; none near the study area 15 veh/h; Telegraph Avenue then Claremont Avenue 12 veh/h.

By origin group: SR-24 eastbound off-ramps (arriving from Oakland and I-980) 103; Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 100; South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 71; Telegraph Ave to the south (downtown Oakland) 31; Telegraph Ave from the north (Berkeley) 30; Claremont Ave and Tunnel Rd toward the hills 28; West Oakland to the southwest (Adeline St, Market St) 20; SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) 14; Shattuck Ave from the north (Berkeley) 8; College Ave from the north (Berkeley) 7.

By destination group: SR-24 westbound on-ramps (toward Oakland and I-980) 109; Telegraph Ave from the north (Berkeley) 85; Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 55; South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 53; Claremont Ave and Tunnel Rd toward the hills 27; Shattuck Ave from the north (Berkeley) 22; College Ave from the north (Berkeley) 13; Emeryville and West Oakland streets (55th to 67th Streets) 13; West Oakland to the southwest (Adeline St, Market St) 12; Ashby Ave from the west (Emeryville and I-80) 11.


## Through cars by intent (cut-through intent view)

A through car is tallied once, under the first intent that fits it (the on-ramp on its planned route, the off-ramp it has driven, or the origin and destination groups of its trip), at the moment the through count counts it. Cars an hour over the run, the same window as the through-car figure (432 an hour).

| Intent | Basis | Cars an hour | Share |
| --- | --- | --- | --- |
| on-2853241697 | observed | 110 | 25% |
| Other on-ramps | assumed | 13 | 3% |
| off-52990846 | observed | 102 | 24% |
| Other off-ramps | assumed | 21 | 5% |
| Downtown, south and west Oakland traffic using side streets to reach Berkeley and Telegraph Ave north | assumed | 76 | 18% |
| Berkeley and Telegraph Ave north traffic using side streets to reach downtown, south and west Oakland | assumed | 57 | 13% |
| Oakland cross-town traffic (West Oakland, Broadway, Piedmont, Emeryville) using side streets near Claremont Ave and Telegraph Ave | assumed | 35 | 8% |
| Other (no intent listed) |  | 18 | 4% |

Intents listed cover 96% of through cars.


## Select-link shares: modeled vs observed (design D5: headline = freeway shares, tolerance +/-10 pp)

- Hillegass Avenue NB: 4 links (path Claremont Avenue -> Alcatraz Avenue (434 m)), 195 trips (184 completed)
- Colby Street NB: 8 links (path Claremont Avenue -> Alcatraz Avenue (680 m)), 217 trips (198 completed)
- Hillegass Avenue SB: 4 links (path Alcatraz Avenue -> Claremont Avenue (433 m)), 115 trips (108 completed)
- Colby Street SB: 8 links (path Alcatraz Avenue -> Claremont Avenue (680 m)), 247 trips (225 completed)

| Block | Side | Via | Observed | Modeled | Diff (pp) | n trips | Headline |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue NB | from | freeway | 47% | 55% | +8 | 195 | within |
| Hillegass Avenue NB | to | Benvenue Avenue | 21% (PM 33%) | 7% | -14 | 195 |  |
| Hillegass Avenue NB | to | College Avenue | 6% | 11% | +5 | 195 |  |
| Hillegass Avenue NB | to | Alcatraz Avenue WB | 27% | 36% | +9 | 195 |  |
| Colby Street NB | from | freeway | 47% | 47% | -0 | 217 | within |
| Colby Street NB | to | Alcatraz Avenue WB | 48% | 51% | +3 | 217 |  |
| Colby Street NB | to | Telegraph Avenue | 25% | 41% | +16 | 217 |  |
| Colby Street NB | to | College Avenue | 3% | 3% | +0 | 217 |  |
| Hillegass Avenue SB | from | Alcatraz Avenue WB | 46% | 28% | -18 | 115 |  |
| Hillegass Avenue SB | from | Benvenue Avenue | 26% | 1% | -25 | 115 |  |
| Hillegass Avenue SB | from | College Avenue | 16% | 10% | -6 | 115 |  |
| Hillegass Avenue SB | to | freeway | 57% (PM 68%) | 67% | +10 | 115 | within |
| Colby Street SB | from | Alcatraz Avenue EB | 43% | 17% | -26 | 247 |  |
| Colby Street SB | from | Alcatraz Avenue WB | 46% | 6% | -40 | 247 |  |
| Colby Street SB | from | Telegraph Avenue | 22% | 11% | -11 | 247 |  |
| Colby Street SB | to | freeway | 45% | 54% | +9 | 247 | within |
| Colby Street SB | to | Forest Street | 34% | 11% | -23 | 247 |  |

Headline shares within tolerance: 4 of 4. Observed column uses the PM-peak share where one is given and the period is pm_peak. 'Via' shares are the fraction of select-link trips using that street before (from) or after (to) the block; freeway = origin / destination gate with a motorway-class link attached.

## Claremont ramps: streets used before the on-ramp / after the off-ramp

Observed shares are for traffic from/to the north only. 'Modeled' is over all trips on the ramps and any visit to the street (an upper bound for streets that serve both sides). 'Modeled, side' counts only trips whose surface end lies on the side of the ramp stated in the targets file (`freewayRamp.side`), and for a street with a qualifier ("north of X") only its links on that side of X.

| Direction | Via | Observed | Modeled | n ramp trips | Modeled, side | n side trips |
| --- | --- | --- | --- | --- | --- | --- |
| onto freeway | College Avenue | 16% | 17% | 618 | 18% | 554 |
| onto freeway | Hillegass Avenue | 12% | 13% | 618 | 14% | 554 |
| onto freeway | Martin Street | 10% | 11% | 618 | 11% | 554 |
| onto freeway | Colby Street | 8% | 14% | 618 | 16% | 554 |
| onto freeway | Telegraph Avenue north of Alcatraz Avenue | 8% | 9% | 618 | 8% | 554 |
| onto freeway | Benvenue Avenue | 5% | 3% | 618 | 3% | 554 |
| from freeway | College Avenue | 10% | 13% | 650 | 13% | 634 |
| from freeway | Martin Street | 10% | 14% | 650 | 14% | 634 |
| from freeway | Colby Street | 8% | 12% | 650 | 12% | 634 |
| from freeway | Hillegass Avenue | 5% | 7% | 650 | 7% | 634 |
| from freeway | Benvenue Avenue | 3% | 4% | 650 | 4% | 634 |

## Top 15 links by delay

| Link | Street | Class | Lanes | Len (m) | End node control | Delay (veh-h) | Stopped (veh-h) | Mean stopped veh | Flow (veh/h) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 4143 | Adeline Street | Secondary | 3 | 185 | signal | 17.95 | 11.49 | 11.5 | 798 |
| 1025 | Martin Luther King Junior Way | Secondary | 3 | 79 | signal | 6.32 | 5.35 | 5.3 | 846 |
| 1122 | Alcatraz Avenue | Tertiary | 1 | 299 | signal | 5.72 | 3.75 | 3.8 | 380 |
| 769 | Martin Luther King Junior Way | Secondary | 3 | 112 | signal | 5.50 | 3.38 | 3.4 | 1380 |
| 115 | San Pablo Avenue | Primary | 3 | 54 | signal | 5.09 | 3.88 | 3.9 | 971 |
| 1662 | 52nd Street | Secondary | 4 | 53 | signal | 4.81 | 3.50 | 3.5 | 996 |
| 1037 | Sacramento Street | Tertiary | 3 | 40 | signal | 4.71 | 3.73 | 3.7 | 1164 |
| 1051 | Adeline Street | Secondary | 4 | 50 | signal | 4.70 | 3.74 | 3.7 | 1199 |
| 1108 | Market Street | Secondary | 4 | 36 | signal | 4.64 | 4.14 | 4.1 | 931 |
| 108 | Stanford Avenue | Secondary | 3 | 61 | signal | 4.61 | 2.80 | 2.8 | 1361 |
| 1666 | 52nd Street | Secondary | 4 | 39 | signal | 4.46 | 3.87 | 3.9 | 785 |
| 2008 | Shattuck Avenue | Tertiary | 1 | 93 | signal | 4.36 | 3.26 | 3.3 | 506 |
| 1111 | Market Street | Tertiary | 3 | 31 | signal | 3.97 | 3.46 | 3.5 | 798 |
| 2040 | Telegraph Avenue | Secondary | 3 | 57 | signal | 3.91 | 2.22 | 2.2 | 1123 |
| 1036 | Sacramento Street | Tertiary | 3 | 43 | signal | 3.72 | 2.99 | 3.0 | 1112 |

## Top 15 nodes by blocked time

Blocked time = lane-head seconds waiting at the stop line without permission (signal red, conflict, stop sign or no downstream space).

| Node | Streets | Control | Gate | Blocked (lane-h) | of which no downstream space | Signal plan at end (cycle: greens) |
| --- | --- | --- | --- | --- | --- | --- |
| 446 | Market Street / Stanford Avenue | signal |  | 5.85 | 0.08 | 75 s: 50/15 |
| 680 | 52nd Street / Shattuck Avenue | signal |  | 5.05 | 0.14 | 90 s: 18/19/37 |
| 447 | Adeline Street / Alcatraz Avenue | signal |  | 4.20 | 0.06 | 75 s: 27/38 |
| 185 | Alcatraz Avenue / Sacramento Street | signal |  | 3.57 | 0.02 | 75 s: 36/29 |
| 30 | 57th Street / Adeline Street / Market Street | signal |  | 3.40 | 0.01 | 75 s: 22/23/15 |
| 479 | Adeline Street / Martin Luther King Junior Way / Stanford Avenue | signal |  | 3.33 | 0.00 | 75 s: 25/40 |
| 37 | San Pablo Avenue / Stanford Avenue | signal |  | 3.07 | 0.00 | 75 s: 28/37 |
| 944 | Ashby Avenue / Shattuck Avenue | signal |  | 2.90 | 0.00 | 75 s: 36/29 |
| 851 | Alcatraz Avenue / Telegraph Avenue | signal |  | 2.83 | 0.05 | 75 s: 42/23 |
| 501 | Alcatraz Avenue / Shattuck Avenue | signal |  | 2.46 | 0.03 | 75 s: 38/27 |
| 1080 | 62nd Street / Claremont Avenue / College Avenue | signal |  | 2.41 | 0.00 | 75 s: 22/23/15 |
| 1406 | Ashby Avenue / Claremont Avenue | signal |  | 2.38 | 0.05 | 75 s: 50/15 |
| 242 | Ashby Avenue / Martin Luther King Junior Way | signal |  | 2.33 | 0.00 | 75 s: 36/29 |
| 947 | Ashby Avenue / Telegraph Avenue | signal |  | 2.31 | 0.00 | 75 s: 23/42 |
| 713 | 51st Street / Telegraph Avenue | signal |  | 2.25 | 0.00 | 75 s: 22/43 |

Phases of the five most blocked signals (green s: approach links with their lanes, link ids in brackets):

- node 446: 50 s: Stanford Avenue 1L [941], Stanford Avenue 3L [1055]; 15 s: Market Street 4L [1108], Market Street 3L [1111]
- node 680: 18 s: 52nd Street 4L [1662]; 19 s: 52nd Street 4L [1666], 52nd Street 4L [1662]; 37 s: Shattuck Avenue 2L [1653], Shattuck Avenue 2L [1705]
- node 447: 27 s: Adeline Street 4L [1049], Adeline Street 4L [1051]; 38 s: Alcatraz Avenue 2L [1048], Alcatraz Avenue 2L [1133]
- node 185: 36 s: Alcatraz Avenue 1L [363], Alcatraz Avenue 1L [1162]; 29 s: Sacramento Street 3L [1036], Sacramento Street 3L [1037]
- node 30: 22 s: Adeline Street 1L [747], Adeline Street 1L [1030]; 23 s: Market Street 2L [755], Market Street 2L [1113]; 15 s: 57th Street 1L [44], 57th Street 1L [1151]

## Entry backlog by origin node at end of run (top 10)

| Node | Streets | Trips waiting | Offered veh/h (before scale) |
| --- | --- | --- | --- |
| 1372 | Domingo Avenue / Russell Street | 2 | 40 |
| 395 | 65th Street / Shattuck Avenue | 1 | 11 |

## Flow on key streets (veh/h per direction, study-area links of 40 m or more)

| Street | Direction of travel | Links | Median flow | Max flow |
| --- | --- | --- | --- | --- |
| Telegraph | N | 12 | 790 | 835 |
| Telegraph | S | 10 | 738 | 772 |
| College | N | 3 | 212 | 214 |
| College | S | 3 | 361 | 361 |
| Claremont | N | 6 | 401 | 658 |
| Claremont | S | 7 | 382 | 733 |
| Alcatraz | E | 6 | 433 | 455 |
| Alcatraz | W | 6 | 416 | 526 |
| Hillegass | N | 4 | 108 | 130 |
| Hillegass | S | 4 | 71 | 80 |
| Colby | N | 7 | 121 | 133 |
| Colby | S | 7 | 128 | 178 |
| Martin | E | 2 | 83 | 83 |
| Martin | W | 2 | 106 | 106 |

## Largest demand origins (offered, before scale)

| Node | Streets | Veh/h |
| --- | --- | --- |
| 602 | Grove Shafter Freeway | 3623 |
| 943 | Telegraph Avenue / Ward Street | 1396 |
| 265 | Ashby Avenue | 1242 |
| 183 | San Pablo Avenue | 1194 |
| 1672 | Warren Freeway | 999 |
| 763 | Telegraph Avenue | 497 |
| 974 | Broadway | 482 |
| 184 | Alcatraz Avenue | 452 |
| 275 | Market Street | 416 |
| 1756 | Claremont Avenue | 416 |
