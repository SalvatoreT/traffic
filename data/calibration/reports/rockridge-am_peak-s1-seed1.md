# Calibration report: rockridge am_peak scale 1 seed 1 (60 min)

Offered demand 21981 veh/h x scale 1 = 21981 veh/h. Run took 23.2 s wall clock. Flow tables use the window after a 10 min warm-up; select-link and health figures cover the whole run from an empty network.

## Stability (design D4)

| Criterion | Threshold | Value | Result |
| --- | --- | --- | --- |
| Gridlock removals | 0 | 4 | FAIL |
| Backlog / spawned | < 2% | 0.0% (2 of 22202) | pass |
| Arterial mean speed (run) | > 4 m/s | 8.52 m/s (last 15 min 8.45) | pass |

Overall: **NOT STABLE**. Mean trip delay 157 s, mean trip time 416 s, completed 22243, unroutable 0.

| t (min) | vehicles in network | backlog | completed | removals | arterial speed in interval (m/s) |
| --- | --- | --- | --- | --- | --- |
| 5 | 2582 | 2 | 1904 | 0 | 8.93 |
| 10 | 2609 | 2 | 3691 | 1 | 8.46 |
| 15 | 2685 | 2 | 5490 | 1 | 8.48 |
| 20 | 2678 | 7 | 7393 | 1 | 8.43 |
| 25 | 2640 | 8 | 9317 | 2 | 8.60 |
| 30 | 2671 | 5 | 11115 | 2 | 8.21 |
| 35 | 2568 | 2 | 13055 | 3 | 8.61 |
| 40 | 2642 | 4 | 14849 | 3 | 8.59 |
| 45 | 2713 | 9 | 16614 | 4 | 8.61 |
| 50 | 2680 | 3 | 18461 | 4 | 8.24 |
| 55 | 2691 | 3 | 20293 | 4 | 8.37 |
| 60 | 2575 | 2 | 22243 | 4 | 8.74 |
## Wandering (completed car trips)

Detour ratio = distance driven (link and movement lengths) over the shortest network distance from the trip's origin to its destination. Detour against the free-flow route uses the time-shortest route with no congestion and no noise, which is what a purposeful driver without live information would follow (it differs from the shortest distance when a faster, longer road exists). A switch is a change of the remaining route while en route. Loops: the same link twice or the same node three or more times. Reversals: a link followed by its reverse within 200 m. 'Study-area vehicle-miles' are miles driven on links inside the study area; the last column is the share of them driven by trips with a detour ratio above 1.3. Guided drivers re-evaluate their route every epoch; the others keep their departure route unless it is blocked.

| Trips | n | Switches per trip | With a switch | Mean detour | Median detour | Detour > 1.3 | Detour > 2 | Mean detour vs free-flow route | Vs free-flow route > 1.3 | Loops | Reversals | Study veh-miles | Of them by detour > 1.3 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| all trips | 20377 | 0.03 | 2.6% | 1.094 | 1.061 | 4.9% | 0.0% | 1.031 | 1.8% | 0.0% | 6.1% | 2064 | 9.0% |
| gate to gate | 7270 | 0.05 | 4.4% | 1.098 | 1.073 | 3.1% | 0.0% | 1.031 | 1.4% | 0.0% | 8.9% | 371 | 9.2% |
| with a local end | 13107 | 0.02 | 1.6% | 1.092 | 1.055 | 5.9% | 0.0% | 1.031 | 2.1% | 0.0% | 4.5% | 1694 | 8.9% |
| guided drivers | 9357 | 0.05 | 5.2% | 1.095 | 1.061 | 5.2% | 0.0% | 1.031 | 2.0% | 0.0% | 6.4% | 921 | 8.2% |
| other drivers | 11020 | 0.00 | 0.4% | 1.093 | 1.060 | 4.7% | 0.0% | 1.031 | 1.7% | 0.0% | 5.7% | 1143 | 9.6% |

## Reported patterns (diagnostics; configured in the targets file under `patterns`)

(a) Trips between the surface gates on the north side of the ramps and the freeway mainline gates, and the local-street (residential and service links in the study area) vehicle-miles they drive. Share = of all completed trips' local-street vehicle-miles (385 miles). No observed counterpart exists for this quantity (the targets file has only the select-link shares above).

| Trips | n trips | Local-street veh-miles | Share of all local-street veh-miles |
| --- | --- | --- | --- |
| surface gates to the freeway | 1381 | 23.9 | 6% |
| freeway to the surface gates | 1095 | 26.5 | 7% |

(b) Corridor trips: completed trips from beyond one end of the corridor's study-area extent (the bypass street and its arterial together) to beyond the other end, within a lateral limit of the corridor, by direction. 'Bypass' = at least N blocks (links) on the bypass street; 'arterial' = fewer bypass blocks and at least N on the arterial; 'other' = neither (another street, the freeway or a short use); blocks are counted on the corridor's study-area links. No observed counterpart exists for these shares. The related observed values are in the select-link table above: northbound Hillegass Ave traffic rarely ends on College Ave (6%), 21 to 33% jogs to Benvenue Ave, and southbound freeway-bound drivers on College Ave commonly arrive via Ashby Ave and Benvenue Ave and jog to Hillegass Ave.

| Bypass | Arterial | N | Direction | Corridor trips | Bypass | Arterial | Other | Mean bypass blocks |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue | College Avenue | 3 | N | 1115 | 4% | 13% | 83% | 0.2 |
| Hillegass Avenue | College Avenue | 3 | S | 1278 | 3% | 25% | 72% | 0.2 |

## Per-mode results

Offered: 21981 car veh/h; 497 bicycle flows (702/h); 2000 pedestrian flows (1340/h). Bicycle and pedestrian volumes are assumptions, not counts.

| Mode | In network | Completed | Mean time (s) | Other |
| --- | --- | --- | --- | --- |
| Car | 2575 | 22243 | 416 | |
| Bicycle | 46 | 713 | 255 | |
| Pedestrian | 168 | 1204 | 470 | mean crossing delay 7.6 s |

Vulnerable road users (surrogate indicators): pedestrian conflicts 224, bicycle conflicts 899, close passes 714, pedestrian injury severity mean 0.046 (AIS4+, 7927 supported of 7927 encounters), cyclist injury severity mean 0.062 (MAIS3+F, 3293 supported of 6115 encounters) (separate endpoints, never summed), mean vehicle speed at pedestrian encounters 2.40 m/s.


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
| SR-24 off-ramp traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | OBSERVED turn count x ASSUMPTION share (131 left turns x 0.40) | 52 (38 to 62) | 41 | within |
| Telegraph Ave and south-side traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | ASSUMPTION: the through left-turners (131 x 0.62 = 81) that are not off-ramp traffic | 29 (19 to 43) | 28 | within |
| SR-24 off-ramp traffic using Colby St to reach College Ave and Berkeley (right at Alcatraz Ave) | OBSERVED turn count x ASSUMPTION share (32 right turns x 0.40) | 13 (9 to 15) | -0 | below |
| Telegraph Ave and south-side traffic using Colby St to reach College Ave and Berkeley | ASSUMPTION: the through right-turners (32 x 0.62 = 20) that are not off-ramp traffic | 7 (5 to 11) | 15 | above |
| Intents listed, together | | 101 (71 to 131) | 84 | |
| Other through cars (no intent listed) | | | 2 | |

Model through cars by origin and destination group (largest 12 of 13 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 41.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 14.0 | Claremont Avenue then College Avenue then Alcatraz Avenue |
| Telegraph Ave to the south (downtown Oakland) | Telegraph Ave from the north (Berkeley) | 12.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Ashby Ave from the west (Emeryville and I-80) | 3.0 | Claremont Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Shattuck Ave from the north (Berkeley) | 3.0 | College Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Emeryville and West Oakland streets (55th to 67th Streets) | 3.0 | Claremont Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Telegraph Ave from the north (Berkeley) | 3.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) | 2.0 | none near the study area |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | West Oakland to the southwest (Adeline St, Market St) | 1.0 | Claremont Avenue |
| Claremont Ave and Tunnel Rd toward the hills | Emeryville and West Oakland streets (55th to 67th Streets) | 1.0 | none near the study area |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Alcatraz Ave from the west (Emeryville side) | 1.0 | College Avenue then Alcatraz Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 1.0 | College Avenue |
| other pairs | | 1.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 56 veh/h; Claremont Avenue then College Avenue then Alcatraz Avenue 14 veh/h; Claremont Avenue 7 veh/h; College Avenue 4 veh/h; none near the study area 3 veh/h; College Avenue then Alcatraz Avenue 1 veh/h.

### Hillegass Avenue NB

Observed (PM): 94 cars entered at the south end, 48 drove the whole street, 109 left it at Alcatraz Ave (43 west, 54 east, 12 straight), and 47% of the block's trips came from a freeway. ASSUMPTION: freeway-origin through cars are 40 veh/h (52 freeway-origin trips times 94 / (94 + 29)), spread over the exits in proportion (0.37); the through share of exits is 48 / 109 = 0.44.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Hillegass Ave to reach Alcatraz Ave west and Telegraph Ave north | OBSERVED turn count x ASSUMPTION share (43 left turns x 0.37) | 16 (9 to 20) | 25 | above |
| SR-24 off-ramp traffic using Hillegass Ave to reach College Ave and Berkeley | OBSERVED turn count x ASSUMPTION share (54 right turns x 0.37) | 20 (11 to 25) | 31 | above |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach Alcatraz Ave west | ASSUMPTION: through exits (43 x 0.44) that are not off-ramp traffic | 3 (0 to 10) | 12 | above |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach College Ave and Berkeley | ASSUMPTION: through exits (54 x 0.44) that are not off-ramp traffic | 4 (0 to 13) | 13 | within |
| Intents listed, together | | 43 (20 to 68) | 81 | |
| Other through cars (no intent listed) | | | 4 | |

Model through cars by origin and destination group (largest 12 of 21 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 17.0 | SR-24 |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 12.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 9.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | College Ave from the north (Berkeley) | 8.0 | SR-24 then Claremont Avenue then College Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 6.0 | SR-24 then Claremont Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Shattuck Ave from the north (Berkeley) | 4.0 | College Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Shattuck Ave from the north (Berkeley) | 4.0 | SR-24 then Telegraph Avenue then Alcatraz Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 3.0 | Telegraph Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Ashby Ave from the west (Emeryville and I-80) | 3.0 | SR-24 then Telegraph Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Telegraph Ave from the north (Berkeley) | 3.0 | none near the study area |
| College Ave from the north (Berkeley) | San Pablo Ave (Emeryville and West Oakland) | 2.0 | College Avenue then Claremont Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Alcatraz Ave from the west (Emeryville side) | 2.0 | College Avenue then Alcatraz Avenue |
| other pairs | | 12.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 29 veh/h; SR-24 18 veh/h; SR-24 then Claremont Avenue then College Avenue 8 veh/h; SR-24 then Claremont Avenue 6 veh/h; College Avenue 5 veh/h; SR-24 then Telegraph Avenue 5 veh/h.

### Hillegass Avenue SB

Observed (PM): 178 cars entered at the top (76 turned in from Alcatraz Ave west, 98 from the east, 4 came straight from the north), 79 drove the whole street, and 68% of the block's trips (109 veh/h) went to a freeway. ASSUMPTION: freeway-bound cars that did not join mid-street are 87 veh/h (109 x 178 / (178 + 44)), half of the 174 turn-ins; low = the whole-street share of the turn-ins (0.45), high = the freeway-bound share without the mid-street correction (0.63).

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Telegraph Ave, Alcatraz Ave west and West Berkeley traffic turning off Alcatraz Ave onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (76 turn-ins x 0.50) | 38 (34 to 48) | 17 | below |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (98 turn-ins x 0.50) | 49 (44 to 62) | 31 | below |
| Intents listed, together | | 87 (78 to 110) | 48 | |
| Other through cars (no intent listed) | | | 31 | |

Model through cars by origin and destination group (largest 12 of 9 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 21.0 | Claremont Avenue then SR-24 |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 17.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 16.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | West Oakland to the southwest (Adeline St, Market St) | 6.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 6.0 | Claremont Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Telegraph Ave to the south (downtown Oakland) | 6.0 | Telegraph Avenue |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 4.0 | College Avenue then Claremont Avenue then SR-24 |
| College Ave from the north (Berkeley) | Telegraph Ave to the south (downtown Oakland) | 2.0 | Alcatraz Avenue then Telegraph Avenue |
| Alcatraz Ave from the west (Emeryville side) | Berkeley hills to the northeast (Evergreen Ln, Gravatt Dr) | 1.0 | Alcatraz Avenue then Claremont Avenue |

By the arterial these cars would otherwise use: Telegraph Avenue 45 veh/h; Claremont Avenue then SR-24 27 veh/h; College Avenue then Claremont Avenue then SR-24 4 veh/h; Alcatraz Avenue then Telegraph Avenue 2 veh/h; Alcatraz Avenue then Claremont Avenue 1 veh/h.

### Colby Street SB

Observed (PM): 139 cars entered at the top (76 from Alcatraz Ave west, 50 from the east, 13 from the north), 39 drove the whole street, 45% of the block's trips (72 veh/h) went to a freeway and 22% came by way of Telegraph Ave. ASSUMPTION: freeway-bound cars that did not join mid-street are 46 veh/h (72 x 139 / (139 + 79)), 0.365 of the 126 turn-ins; low = the whole-street share (0.31), high = the unadjusted freeway share (0.57). The Telegraph Ave cars are the 22% x 160 = 35 of the 76 west turn-ins.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Southbound Telegraph Ave traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (35 Telegraph Ave cars x 0.365) | 13 (11 to 20) | 9 | below |
| Alcatraz Ave west, Ashby Ave and West Berkeley traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (41 other west turn-ins x 0.365) | 15 (13 to 23) | 20 | within |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (50 east turn-ins x 0.365) | 18 (15 to 29) | 33 | above |
| Intents listed, together | | 46 (39 to 72) | 62 | |
| Other through cars (no intent listed) | | | 54 | |

Model through cars by origin and destination group (largest 12 of 23 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 32.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 23.0 | Telegraph Avenue |
| Shattuck Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 12.0 | none near the study area |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | West Oakland to the southwest (Adeline St, Market St) | 10.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Telegraph Ave to the south (downtown Oakland) | 8.0 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 8.0 | Telegraph Avenue |
| Ashby Ave from the west (Emeryville and I-80) | SR-13 Warren Freeway (via SR-24 east) | 2.0 | SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | San Pablo Ave (Emeryville and West Oakland) | 2.0 | Claremont Avenue |
| West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) | SR-24 westbound on-ramps (toward Oakland and I-980) | 2.0 | none near the study area |
| Claremont Ave and Tunnel Rd toward the hills | Emeryville and West Oakland streets (55th to 67th Streets) | 2.0 | Claremont Avenue |
| Telegraph Ave from the north (Berkeley) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 2.0 | Telegraph Avenue |
| Emeryville and West Oakland streets (55th to 67th Streets) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 2.0 | Alcatraz Avenue then College Avenue |
| other pairs | | 11.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 83 veh/h; none near the study area 16 veh/h; Claremont Avenue 6 veh/h; SR-24 6 veh/h; Alcatraz Avenue then College Avenue 3 veh/h; Alcatraz Avenue then Claremont Avenue 1 veh/h.

### Study area, all residential and service streets

Model: 567 through cars per hour.

Model through cars by origin and destination group (largest 12 of 71 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 68.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 54.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 52.0 | Telegraph Avenue |
| Telegraph Ave to the south (downtown Oakland) | SR-24 westbound on-ramps (toward Oakland and I-980) | 30.0 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 27.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 26.0 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 21.0 | Claremont Avenue then SR-24 |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 21.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | West Oakland to the southwest (Adeline St, Market St) | 18.0 | Telegraph Avenue |
| Shattuck Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 18.0 | none near the study area |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 17.0 | SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Telegraph Ave to the south (downtown Oakland) | 14.0 | Telegraph Avenue |
| other pairs | | 201.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 344 veh/h; Claremont Avenue 40 veh/h; none near the study area 35 veh/h; SR-24 32 veh/h; Claremont Avenue then SR-24 21 veh/h; College Avenue 19 veh/h.

By origin group: Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 169; SR-24 eastbound off-ramps (arriving from Oakland and I-980) 100; South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 71; Telegraph Ave to the south (downtown Oakland) 52; Telegraph Ave from the north (Berkeley) 36; Claremont Ave and Tunnel Rd toward the hills 35; West Oakland to the southwest (Adeline St, Market St) 23; Shattuck Ave from the north (Berkeley) 19; SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) 13; San Pablo Ave (Emeryville and West Oakland) 10.

By destination group: SR-24 westbound on-ramps (toward Oakland and I-980) 173; South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 83; Telegraph Ave from the north (Berkeley) 79; Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 57; Claremont Ave and Tunnel Rd toward the hills 29; Emeryville and West Oakland streets (55th to 67th Streets) 23; College Ave from the north (Berkeley) 20; West Oakland to the southwest (Adeline St, Market St) 19; Telegraph Ave to the south (downtown Oakland) 18; Shattuck Ave from the north (Berkeley) 16.


## Through cars by intent (cut-through intent view)

A through car is tallied once, under the first intent that fits it (the on-ramp on its planned route, the off-ramp it has driven, or the origin and destination groups of its trip), at the moment the through count counts it. Cars an hour over the run, the same window as the through-car figure (566 an hour).

| Intent | Basis | Cars an hour | Share |
| --- | --- | --- | --- |
| on-2853241697 | observed | 173 | 31% |
| Other on-ramps | assumed | 13 | 2% |
| off-52990846 | observed | 100 | 18% |
| Other off-ramps | assumed | 26 | 5% |
| Downtown, south and west Oakland traffic using side streets to reach Berkeley and Telegraph Ave north | assumed | 71 | 13% |
| Berkeley and Telegraph Ave north traffic using side streets to reach downtown, south and west Oakland | assumed | 95 | 17% |
| Oakland cross-town traffic (West Oakland, Broadway, Piedmont, Emeryville) using side streets near Claremont Ave and Telegraph Ave | assumed | 43 | 8% |
| Other (no intent listed) |  | 45 | 8% |

Intents listed cover 92% of through cars.


## Select-link shares: modeled vs observed (design D5: headline = freeway shares, tolerance +/-10 pp)

- Hillegass Avenue NB: 4 links (path Claremont Avenue -> Alcatraz Avenue (434 m)), 197 trips (185 completed)
- Colby Street NB: 8 links (path Claremont Avenue -> Alcatraz Avenue (680 m)), 216 trips (196 completed)
- Hillegass Avenue SB: 4 links (path Alcatraz Avenue -> Claremont Avenue (433 m)), 136 trips (122 completed)
- Colby Street SB: 8 links (path Alcatraz Avenue -> Claremont Avenue (680 m)), 291 trips (263 completed)

| Block | Side | Via | Observed | Modeled | Diff (pp) | n trips | Headline |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue NB | from | freeway | 47% | 53% | +6 | 197 | within |
| Hillegass Avenue NB | to | Benvenue Avenue | 21% (PM 33%) | 8% | -13 | 197 |  |
| Hillegass Avenue NB | to | College Avenue | 6% | 13% | +7 | 197 |  |
| Hillegass Avenue NB | to | Alcatraz Avenue WB | 27% | 36% | +9 | 197 |  |
| Colby Street NB | from | freeway | 47% | 45% | -2 | 216 | within |
| Colby Street NB | to | Alcatraz Avenue WB | 48% | 50% | +2 | 216 |  |
| Colby Street NB | to | Telegraph Avenue | 25% | 52% | +27 | 216 |  |
| Colby Street NB | to | College Avenue | 3% | 2% | -1 | 216 |  |
| Hillegass Avenue SB | from | Alcatraz Avenue WB | 46% | 26% | -20 | 136 |  |
| Hillegass Avenue SB | from | Benvenue Avenue | 26% | 1% | -25 | 136 |  |
| Hillegass Avenue SB | from | College Avenue | 16% | 11% | -5 | 136 |  |
| Hillegass Avenue SB | to | freeway | 57% (PM 68%) | 62% | +6 | 136 | within |
| Colby Street SB | from | Alcatraz Avenue EB | 43% | 16% | -27 | 291 |  |
| Colby Street SB | from | Alcatraz Avenue WB | 46% | 10% | -36 | 291 |  |
| Colby Street SB | from | Telegraph Avenue | 22% | 18% | -4 | 291 |  |
| Colby Street SB | to | freeway | 45% | 49% | +4 | 291 | within |
| Colby Street SB | to | Forest Street | 34% | 10% | -24 | 291 |  |

Headline shares within tolerance: 4 of 4. Observed column uses the PM-peak share where one is given and the period is pm_peak. 'Via' shares are the fraction of select-link trips using that street before (from) or after (to) the block; freeway = origin / destination gate with a motorway-class link attached.

## Claremont ramps: streets used before the on-ramp / after the off-ramp

Observed shares are for traffic from/to the north only. 'Modeled' is over all trips on the ramps and any visit to the street (an upper bound for streets that serve both sides). 'Modeled, side' counts only trips whose surface end lies on the side of the ramp stated in the targets file (`freewayRamp.side`), and for a street with a qualifier ("north of X") only its links on that side of X.

| Direction | Via | Observed | Modeled | n ramp trips | Modeled, side | n side trips |
| --- | --- | --- | --- | --- | --- | --- |
| onto freeway | College Avenue | 16% | 14% | 680 | 16% | 586 |
| onto freeway | Hillegass Avenue | 12% | 12% | 680 | 14% | 586 |
| onto freeway | Martin Street | 10% | 16% | 680 | 15% | 586 |
| onto freeway | Colby Street | 8% | 14% | 680 | 16% | 586 |
| onto freeway | Telegraph Avenue north of Alcatraz Avenue | 8% | 16% | 680 | 13% | 586 |
| onto freeway | Benvenue Avenue | 5% | 2% | 680 | 2% | 586 |
| from freeway | College Avenue | 10% | 13% | 649 | 14% | 633 |
| from freeway | Martin Street | 10% | 13% | 649 | 14% | 633 |
| from freeway | Colby Street | 8% | 12% | 649 | 12% | 633 |
| from freeway | Hillegass Avenue | 5% | 7% | 649 | 8% | 633 |
| from freeway | Benvenue Avenue | 3% | 4% | 649 | 4% | 633 |

## Top 15 links by delay

| Link | Street | Class | Lanes | Len (m) | End node control | Delay (veh-h) | Stopped (veh-h) | Mean stopped veh | Flow (veh/h) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 4143 | Adeline Street | Secondary | 3 | 185 | signal | 24.07 | 17.90 | 17.9 | 880 |
| 1025 | Martin Luther King Junior Way | Secondary | 3 | 79 | signal | 11.07 | 9.72 | 9.7 | 522 |
| 1122 | Alcatraz Avenue | Tertiary | 1 | 299 | signal | 9.26 | 6.93 | 6.9 | 301 |
| 2037 | Alcatraz Avenue | Tertiary | 1 | 202 | uncontrolled | 8.74 | 7.00 | 7.0 | 314 |
| 1108 | Market Street | Secondary | 4 | 36 | signal | 8.71 | 7.80 | 7.8 | 714 |
| 1024 | Martin Luther King Junior Way | Secondary | 3 | 75 | two_way_stop | 6.85 | 5.42 | 5.4 | 674 |
| 1049 | Adeline Street | Secondary | 4 | 43 | signal | 6.54 | 5.43 | 5.4 | 871 |
| 115 | San Pablo Avenue | Primary | 3 | 54 | signal | 6.25 | 4.69 | 4.7 | 1087 |
| 1116 | Market Street | Tertiary | 2 | 87 | uncontrolled | 6.21 | 5.54 | 5.5 | 280 |
| 108 | Stanford Avenue | Secondary | 3 | 61 | signal | 5.80 | 4.16 | 4.2 | 1064 |
| 303 | Baker Street | Residential | 1 | 104 | two_way_stop | 5.70 | 5.38 | 5.4 | 38 |
| 1666 | 52nd Street | Secondary | 4 | 39 | signal | 5.63 | 4.92 | 4.9 | 683 |
| 1051 | Adeline Street | Secondary | 4 | 50 | signal | 5.49 | 4.43 | 4.4 | 1117 |
| 1036 | Sacramento Street | Tertiary | 3 | 43 | signal | 5.38 | 4.45 | 4.5 | 856 |
| 1037 | Sacramento Street | Tertiary | 3 | 40 | signal | 5.35 | 4.37 | 4.4 | 978 |

## Top 15 nodes by blocked time

Blocked time = lane-head seconds waiting at the stop line without permission (signal red, conflict, stop sign or no downstream space).

| Node | Streets | Control | Gate | Blocked (lane-h) | of which no downstream space | Signal plan at end (cycle: greens) |
| --- | --- | --- | --- | --- | --- | --- |
| 446 | Market Street / Stanford Avenue | signal |  | 4.90 | 0.16 | 75 s: 50/15 |
| 447 | Adeline Street / Alcatraz Avenue | signal |  | 4.56 | 0.26 | 75 s: 28/37 |
| 680 | 52nd Street / Shattuck Avenue | signal |  | 4.52 | 0.08 | 90 s: 18/19/37 |
| 479 | Adeline Street / Martin Luther King Junior Way / Stanford Avenue | signal |  | 3.48 | 0.06 | 85 s: 31/44 |
| 30 | 57th Street / Adeline Street / Market Street | signal |  | 3.47 | 0.03 | 75 s: 22/23/15 |
| 37 | San Pablo Avenue / Stanford Avenue | signal |  | 3.23 | 0.04 | 75 s: 36/29 |
| 185 | Alcatraz Avenue / Sacramento Street | signal |  | 3.23 | 0.07 | 75 s: 31/34 |
| 944 | Ashby Avenue / Shattuck Avenue | signal |  | 2.68 | 0.03 | 75 s: 46/19 |
| 1406 | Ashby Avenue / Claremont Avenue | signal |  | 2.67 | 0.17 | 75 s: 50/15 |
| 1080 | 62nd Street / Claremont Avenue / College Avenue | signal |  | 2.59 | 0.02 | 75 s: 19/26/15 |
| 947 | Ashby Avenue / Telegraph Avenue | signal |  | 2.57 | 0.00 | 75 s: 23/42 |
| 713 | 51st Street / Telegraph Avenue | signal |  | 2.54 | 0.01 | 75 s: 33/32 |
| 851 | Alcatraz Avenue / Telegraph Avenue | signal |  | 2.44 | 0.05 | 75 s: 45/20 |
| 332 | 55th Street / Martin Luther King Junior Way | signal |  | 2.39 | 0.03 | 75 s: 38/27 |
| 242 | Ashby Avenue / Martin Luther King Junior Way | signal |  | 2.39 | 0.00 | 75 s: 34/31 |

Phases of the five most blocked signals (green s: approach links with their lanes, link ids in brackets):

- node 446: 50 s: Stanford Avenue 1L [941], Stanford Avenue 3L [1055]; 15 s: Market Street 4L [1108], Market Street 3L [1111]
- node 447: 28 s: Adeline Street 4L [1049], Adeline Street 4L [1051]; 37 s: Alcatraz Avenue 2L [1048], Alcatraz Avenue 2L [1133]
- node 680: 18 s: 52nd Street 4L [1662]; 19 s: 52nd Street 4L [1666], 52nd Street 4L [1662]; 37 s: Shattuck Avenue 2L [1653], Shattuck Avenue 2L [1705]
- node 479: 31 s: Martin Luther King Junior Way 3L [1025], Adeline Street 3L [4143]; 44 s: Stanford Avenue 1L [4139]
- node 30: 22 s: Adeline Street 1L [747], Adeline Street 1L [1030]; 23 s: Market Street 2L [755], Market Street 2L [1113]; 15 s: 57th Street 1L [44], 57th Street 1L [1151]

## Gridlock removals by link (top 10)

| Link | Street | End node | Control | Removals | First at (min) |
| --- | --- | --- | --- | --- | --- |
| 1060 | California Street | California Street | uncontrolled | 1 | 5.3 |
| 978 | Harmon Street | Harmon Street / King Street | traffic_circle | 1 | 22.3 |
| 921 | King Street | 63rd Street / King Street | two_way_stop | 1 | 33.5 |
| 989 | 61st Street | 61st Street / Market Street | two_way_stop | 1 | 40.2 |

## Junction recovery

Policy `physical`. Node entries by cars and cyclists in the run: 716955 (settle interval 0). An admission is an entry the ordinary rule would have refused; head-seconds count the time a waiting head vehicle had the reason invoked, and the part of it in which it still could not enter. Courtesy and the yield fallback change priority only; under `physical` the conflict bypass never admits.

| Reason | Admissions per hour | Per 1,000 entries | Head-s invoked | Head-s blocked |
| --- | --- | --- | --- | --- |
| courtesy | 294.0 | 0.410 | 1155 | 1061 |
| yield fallback | 134.0 | 0.187 | 40 | 0 |
| conflict bypass | 0.0 | 0.000 | 147 | 147 |

Vehicles removed while held in a node by a full exit: 0 (0.0 per hour, included in the gridlock removals).

| Node | Streets | Control | Courtesy | Yield fallback | Conflict bypass | Held removals |
| --- | --- | --- | --- | --- | --- | --- |
| 165 | Alcatraz Avenue / Baker Street | two_way_stop | 15 | 11 | 0 | 0 |
| 436 | 62nd Street / Adeline Street / Stanford Avenue | two_way_stop | 22 | 2 | 0 | 0 |
| 342 | 56th Street / Shattuck Avenue | two_way_stop | 5 | 12 | 0 | 0 |
| 430 | Alcatraz Avenue / King Street | two_way_stop | 7 | 10 | 0 | 0 |
| 492 | Aileen Street / Shattuck Avenue | two_way_stop | 5 | 10 | 0 | 0 |
| 479 | Adeline Street / Martin Luther King Junior Way / Stanford Avenue | signal | 12 | 1 | 0 | 0 |
| 1152 | Ashby Avenue / Ashby Place / Elmwood Avenue | two_way_stop | 12 | 1 | 0 | 0 |
| 766 | 57th Street / Shattuck Avenue | two_way_stop | 2 | 10 | 0 | 0 |
| 1220 | Ashby Avenue / College Avenue | signal | 12 | 0 | 0 | 0 |
| 395 | 65th Street / Shattuck Avenue | two_way_stop | 8 | 3 | 0 | 0 |

## Entry backlog by origin node at end of run (top 10)

| Node | Streets | Trips waiting | Offered veh/h (before scale) |
| --- | --- | --- | --- |
| 1134 | Claremont Avenue / Claremont Crescent | 2 | 12 |

## Flow on key streets (veh/h per direction, study-area links of 40 m or more)

| Street | Direction of travel | Links | Median flow | Max flow |
| --- | --- | --- | --- | --- |
| Telegraph | N | 12 | 818 | 847 |
| Telegraph | S | 10 | 899 | 1001 |
| College | N | 3 | 217 | 220 |
| College | S | 3 | 438 | 438 |
| Claremont | N | 6 | 414 | 680 |
| Claremont | S | 7 | 439 | 869 |
| Alcatraz | E | 6 | 385 | 428 |
| Alcatraz | W | 6 | 317 | 362 |
| Hillegass | N | 4 | 113 | 133 |
| Hillegass | S | 4 | 89 | 94 |
| Colby | N | 7 | 127 | 132 |
| Colby | S | 7 | 152 | 193 |
| Martin | E | 2 | 145 | 145 |
| Martin | W | 2 | 107 | 107 |

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
