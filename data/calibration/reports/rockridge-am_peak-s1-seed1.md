# Calibration report: rockridge am_peak scale 1 seed 1 (60 min)

Offered demand 21902 veh/h x scale 1 = 21902 veh/h. Run took 32.1 s wall clock. Flow tables use the window after a 10 min warm-up; select-link and health figures cover the whole run from an empty network.

## Stability (design D4)

| Criterion | Threshold | Value | Result |
| --- | --- | --- | --- |
| Gridlock removals | 0 | 0 | pass |
| Backlog / spawned | < 2% | 0.0% (1 of 22052) | pass |
| Arterial mean speed (run) | > 4 m/s | 9.60 m/s (last 15 min 9.56) | pass |

Overall: **STABLE**. Mean trip delay 122 s, mean trip time 414 s, completed 21675, unroutable 0.

| t (min) | vehicles in network | backlog | completed | removals | arterial speed in interval (m/s) |
| --- | --- | --- | --- | --- | --- |
| 5 | 2614 | 5 | 1760 | 0 | 9.73 |
| 10 | 2596 | 5 | 3588 | 0 | 9.29 |
| 15 | 2657 | 1 | 5381 | 0 | 9.44 |
| 20 | 2712 | 2 | 7192 | 0 | 9.68 |
| 25 | 2760 | 2 | 8976 | 0 | 9.70 |
| 30 | 2795 | 2 | 10776 | 0 | 9.64 |
| 35 | 2816 | 3 | 12620 | 0 | 9.65 |
| 40 | 2807 | 2 | 14435 | 0 | 9.73 |
| 45 | 2778 | 4 | 16276 | 0 | 9.61 |
| 50 | 2834 | 0 | 18052 | 0 | 9.42 |
| 55 | 2824 | 4 | 19842 | 0 | 9.42 |
| 60 | 2875 | 1 | 21675 | 0 | 9.85 |
## Wandering (completed car trips)

Detour ratio = distance driven (link and movement lengths) over the shortest network distance from the trip's origin to its destination. Detour against the free-flow route uses the time-shortest route with no congestion and no noise, which is what a purposeful driver without live information would follow (it differs from the shortest distance when a faster, longer road exists). A switch is a change of the remaining route while en route. Loops: the same link twice or the same node three or more times. Reversals: a link followed by its reverse within 200 m. 'Study-area vehicle-miles' are miles driven on links inside the study area; the last column is the share of them driven by trips with a detour ratio above 1.3. Guided drivers re-evaluate their route every epoch; the others keep their departure route unless it is blocked.

| Trips | n | Switches per trip | With a switch | Mean detour | Median detour | Detour > 1.3 | Detour > 2 | Mean detour vs free-flow route | Vs free-flow route > 1.3 | Loops | Reversals | Study veh-miles | Of them by detour > 1.3 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| all trips | 19897 | 0.01 | 0.5% | 1.089 | 1.051 | 4.6% | 0.0% | 1.025 | 1.6% | 0.0% | 5.4% | 1884 | 8.7% |
| gate to gate | 7843 | 0.01 | 0.6% | 1.091 | 1.061 | 2.8% | 0.1% | 1.021 | 1.1% | 0.0% | 8.0% | 477 | 9.2% |
| with a local end | 12054 | 0.00 | 0.5% | 1.088 | 1.047 | 5.8% | 0.0% | 1.027 | 1.9% | 0.0% | 3.7% | 1408 | 8.5% |
| guided drivers | 9055 | 0.01 | 1.1% | 1.089 | 1.052 | 4.6% | 0.0% | 1.025 | 1.6% | 0.0% | 5.7% | 853 | 8.5% |
| other drivers | 10842 | 0.00 | 0.0% | 1.089 | 1.051 | 4.6% | 0.0% | 1.024 | 1.6% | 0.0% | 5.2% | 1031 | 8.9% |

## Reported patterns (diagnostics; configured in the targets file under `patterns`)

(a) Trips between the surface gates on the north side of the ramps and the freeway mainline gates, and the local-street (residential and service links in the study area) vehicle-miles they drive. Share = of all completed trips' local-street vehicle-miles (343 miles). No observed counterpart exists for this quantity (the targets file has only the select-link shares above).

| Trips | n trips | Local-street veh-miles | Share of all local-street veh-miles |
| --- | --- | --- | --- |
| surface gates to the freeway | 1251 | 26.0 | 8% |
| freeway to the surface gates | 1003 | 24.0 | 7% |

(b) Corridor trips: completed trips from beyond one end of the corridor's study-area extent (the bypass street and its arterial together) to beyond the other end, within a lateral limit of the corridor, by direction. 'Bypass' = at least N blocks (links) on the bypass street; 'arterial' = fewer bypass blocks and at least N on the arterial; 'other' = neither (another street, the freeway or a short use); blocks are counted on the corridor's study-area links. No observed counterpart exists for these shares. The related observed values are in the select-link table above: northbound Hillegass Ave traffic rarely ends on College Ave (6%), 21 to 33% jogs to Benvenue Ave, and southbound freeway-bound drivers on College Ave commonly arrive via Ashby Ave and Benvenue Ave and jog to Hillegass Ave.

| Bypass | Arterial | N | Direction | Corridor trips | Bypass | Arterial | Other | Mean bypass blocks |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue | College Avenue | 3 | N | 868 | 5% | 10% | 85% | 0.2 |
| Hillegass Avenue | College Avenue | 3 | S | 1075 | 3% | 21% | 77% | 0.1 |

## Per-mode results

Offered: 21902 car veh/h; 497 bicycle flows (702/h); 2000 pedestrian flows (1340/h). Bicycle and pedestrian volumes are assumptions, not counts.

| Mode | In network | Completed | Mean time (s) | Other |
| --- | --- | --- | --- | --- |
| Car | 2875 | 21675 | 414 | |
| Bicycle | 54 | 699 | 240 | |
| Pedestrian | 168 | 1314 | 464 | mean crossing delay 7.7 s |

Vulnerable road users (surrogate indicators): pedestrian conflicts 241, bicycle conflicts 412, close passes 684, pedestrian injury-risk index 0.048, bicycle injury-risk index 0.070 (proxy), mean vehicle speed at pedestrian encounters 2.47 m/s.


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
| SR-24 off-ramp traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | OBSERVED turn count x ASSUMPTION share (131 left turns x 0.40) | 52 (38 to 62) | 38 | within |
| Telegraph Ave and south-side traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | ASSUMPTION: the through left-turners (131 x 0.62 = 81) that are not off-ramp traffic | 29 (19 to 43) | 44 | above |
| SR-24 off-ramp traffic using Colby St to reach College Ave and Berkeley (right at Alcatraz Ave) | OBSERVED turn count x ASSUMPTION share (32 right turns x 0.40) | 13 (9 to 15) | 4 | below |
| Telegraph Ave and south-side traffic using Colby St to reach College Ave and Berkeley | ASSUMPTION: the through right-turners (32 x 0.62 = 20) that are not off-ramp traffic | 7 (5 to 11) | 1 | below |
| Intents listed, together | | 101 (71 to 131) | 87 | |
| Other through cars (no intent listed) | | | 0 | |

Model through cars by origin and destination group (largest 12 of 15 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 25.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) | 10.0 | Claremont Avenue |
| Telegraph Ave to the south (downtown Oakland) | Telegraph Ave from the north (Berkeley) | 10.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Emeryville and West Oakland streets (55th to 67th Streets) | 9.0 | Claremont Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Telegraph Ave from the north (Berkeley) | 7.0 | none near the study area |
| West Oakland to the southwest (Adeline St, Market St) | Telegraph Ave from the north (Berkeley) | 5.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Alcatraz Ave from the west (Emeryville side) | 4.0 | Claremont Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 4.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Ashby Ave from the west (Emeryville and I-80) | 3.0 | none near the study area |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Ashby Ave from the west (Emeryville and I-80) | 3.0 | SR-24 then Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 2.0 | College Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Alcatraz Ave from the west (Emeryville side) | 2.0 | SR-24 then Telegraph Avenue |
| other pairs | | 3.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 45 veh/h; Claremont Avenue 24 veh/h; none near the study area 10 veh/h; SR-24 then Telegraph Avenue 5 veh/h; College Avenue 2 veh/h; SR-24 then Telegraph Avenue then Alcatraz Avenue 1 veh/h.

### Hillegass Avenue NB

Observed (PM): 94 cars entered at the south end, 48 drove the whole street, 109 left it at Alcatraz Ave (43 west, 54 east, 12 straight), and 47% of the block's trips came from a freeway. ASSUMPTION: freeway-origin through cars are 40 veh/h (52 freeway-origin trips times 94 / (94 + 29)), spread over the exits in proportion (0.37); the through share of exits is 48 / 109 = 0.44.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Hillegass Ave to reach Alcatraz Ave west and Telegraph Ave north | OBSERVED turn count x ASSUMPTION share (43 left turns x 0.37) | 16 (9 to 20) | 23 | above |
| SR-24 off-ramp traffic using Hillegass Ave to reach College Ave and Berkeley | OBSERVED turn count x ASSUMPTION share (54 right turns x 0.37) | 20 (11 to 25) | 25 | within |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach Alcatraz Ave west | ASSUMPTION: through exits (43 x 0.44) that are not off-ramp traffic | 3 (0 to 10) | 10 | within |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach College Ave and Berkeley | ASSUMPTION: through exits (54 x 0.44) that are not off-ramp traffic | 4 (0 to 13) | 9 | within |
| Intents listed, together | | 43 (20 to 68) | 67 | |
| Other through cars (no intent listed) | | | 3 | |

Model through cars by origin and destination group (largest 12 of 20 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 16.0 | SR-24 |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 15.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Emeryville and West Oakland streets (55th to 67th Streets) | 6.0 | College Avenue then Alcatraz Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 6.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) | 3.0 | Claremont Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Claremont Ave and Tunnel Rd toward the hills | 3.0 | Claremont Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Telegraph Ave from the north (Berkeley) | 3.0 | none near the study area |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | College Ave from the north (Berkeley) | 3.0 | SR-24 then Claremont Avenue then College Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 2.0 | Telegraph Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Alcatraz Ave from the west (Emeryville side) | 2.0 | SR-24 then Telegraph Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Shattuck Ave from the north (Berkeley) | 2.0 | SR-24 then Telegraph Avenue then Alcatraz Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | San Pablo Ave (Emeryville and West Oakland) | 1.0 | College Avenue then Alcatraz Avenue |
| other pairs | | 8.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 25 veh/h; SR-24 16 veh/h; Claremont Avenue 9 veh/h; College Avenue then Alcatraz Avenue 7 veh/h; SR-24 then Claremont Avenue then College Avenue 3 veh/h; SR-24 then Telegraph Avenue 3 veh/h.

### Hillegass Avenue SB

Observed (PM): 178 cars entered at the top (76 turned in from Alcatraz Ave west, 98 from the east, 4 came straight from the north), 79 drove the whole street, and 68% of the block's trips (109 veh/h) went to a freeway. ASSUMPTION: freeway-bound cars that did not join mid-street are 87 veh/h (109 x 178 / (178 + 44)), half of the 174 turn-ins; low = the whole-street share of the turn-ins (0.45), high = the freeway-bound share without the mid-street correction (0.63).

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Telegraph Ave, Alcatraz Ave west and West Berkeley traffic turning off Alcatraz Ave onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (76 turn-ins x 0.50) | 38 (34 to 48) | 14 | below |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (98 turn-ins x 0.50) | 49 (44 to 62) | 21 | below |
| Intents listed, together | | 87 (78 to 110) | 35 | |
| Other through cars (no intent listed) | | | 8 | |

Model through cars by origin and destination group (largest 12 of 9 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 14.0 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 10.0 | Claremont Avenue then SR-24 |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 9.0 | College Avenue then Claremont Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 4.0 | Alcatraz Avenue then College Avenue then Claremont Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 2.0 | Claremont Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Berkeley hills to the northeast (Evergreen Ln, Gravatt Dr) | 1.0 | Alcatraz Avenue then Claremont Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Telegraph Ave to the south (downtown Oakland) | 1.0 | Telegraph Avenue |
| College Ave from the north (Berkeley) | Telegraph Ave to the south (downtown Oakland) | 1.0 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 1.0 | Telegraph Avenue |

By the arterial these cars would otherwise use: Telegraph Avenue 17 veh/h; Claremont Avenue then SR-24 12 veh/h; College Avenue then Claremont Avenue then SR-24 9 veh/h; Alcatraz Avenue then College Avenue then Claremont Avenue 4 veh/h; Alcatraz Avenue then Claremont Avenue 1 veh/h.

### Colby Street SB

Observed (PM): 139 cars entered at the top (76 from Alcatraz Ave west, 50 from the east, 13 from the north), 39 drove the whole street, 45% of the block's trips (72 veh/h) went to a freeway and 22% came by way of Telegraph Ave. ASSUMPTION: freeway-bound cars that did not join mid-street are 46 veh/h (72 x 139 / (139 + 79)), 0.365 of the 126 turn-ins; low = the whole-street share (0.31), high = the unadjusted freeway share (0.57). The Telegraph Ave cars are the 22% x 160 = 35 of the 76 west turn-ins.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Southbound Telegraph Ave traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (35 Telegraph Ave cars x 0.365) | 13 (11 to 20) | 13 | within |
| Alcatraz Ave west, Ashby Ave and West Berkeley traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (41 other west turn-ins x 0.365) | 15 (13 to 23) | 14 | within |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (50 east turn-ins x 0.365) | 18 (15 to 29) | 29 | within |
| Intents listed, together | | 46 (39 to 72) | 56 | |
| Other through cars (no intent listed) | | | 36 | |

Model through cars by origin and destination group (largest 12 of 20 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 28.0 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 12.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 9.0 | Alcatraz Avenue then College Avenue then Claremont Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Telegraph Ave to the south (downtown Oakland) | 8.0 | Telegraph Avenue |
| Shattuck Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 8.0 | none near the study area |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | West Oakland to the southwest (Adeline St, Market St) | 5.0 | Alcatraz Avenue then Telegraph Avenue |
| College Ave from the north (Berkeley) | Telegraph Ave to the south (downtown Oakland) | 4.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 3.0 | Telegraph Avenue then Alcatraz Avenue then Claremont Avenue |
| Emeryville and West Oakland streets (55th to 67th Streets) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 3.0 | Alcatraz Avenue then College Avenue then Claremont Avenue |
| Alcatraz Ave from the west (Emeryville side) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 2.0 | SR-24 |
| Alcatraz Ave from the west (Emeryville side) | SR-13 Warren Freeway (via SR-24 east) | 1.0 | SR-24 |
| Ashby Ave from the west (Emeryville and I-80) | SR-13 Warren Freeway (via SR-24 east) | 1.0 | SR-24 |
| other pairs | | 8.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 52 veh/h; Alcatraz Avenue then College Avenue then Claremont Avenue 12 veh/h; none near the study area 11 veh/h; Alcatraz Avenue then Telegraph Avenue 5 veh/h; SR-24 5 veh/h; Telegraph Avenue then Alcatraz Avenue then Claremont Avenue 3 veh/h.

### Study area, all residential and service streets

Model: 479 through cars per hour.

Model through cars by origin and destination group (largest 12 of 58 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 46.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 43.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) | 42.0 | Claremont Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 40.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 29.0 | Telegraph Avenue |
| Telegraph Ave to the south (downtown Oakland) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 24.0 | Telegraph Avenue then Alcatraz Avenue then College Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Emeryville and West Oakland streets (55th to 67th Streets) | 18.0 | Claremont Avenue |
| Telegraph Ave to the south (downtown Oakland) | SR-24 westbound on-ramps (toward Oakland and I-980) | 17.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 16.0 | Alcatraz Avenue then College Avenue then Claremont Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 16.0 | SR-24 |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave to the south (downtown Oakland) | 15.0 | Claremont Avenue then Telegraph Avenue |
| Telegraph Ave to the south (downtown Oakland) | Telegraph Ave from the north (Berkeley) | 12.0 | Telegraph Avenue |
| other pairs | | 161.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 215 veh/h; Claremont Avenue 86 veh/h; SR-24 27 veh/h; none near the study area 26 veh/h; Telegraph Avenue then Alcatraz Avenue then College Avenue 24 veh/h; Alcatraz Avenue then College Avenue then Claremont Avenue 23 veh/h.

By origin group: South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 106; SR-24 eastbound off-ramps (arriving from Oakland and I-980) 91; Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 89; Telegraph Ave to the south (downtown Oakland) 57; Telegraph Ave from the north (Berkeley) 42; SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) 22; Claremont Ave and Tunnel Rd toward the hills 15; College Ave from the north (Berkeley) 14; West Oakland to the southwest (Adeline St, Market St) 10; Shattuck Ave from the north (Berkeley) 9.

By destination group: SR-24 westbound on-ramps (toward Oakland and I-980) 133; Telegraph Ave from the north (Berkeley) 74; South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 48; West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) 44; Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 42; Telegraph Ave to the south (downtown Oakland) 28; Claremont Ave and Tunnel Rd toward the hills 26; Emeryville and West Oakland streets (55th to 67th Streets) 18; Alcatraz Ave from the west (Emeryville side) 12; Ashby Ave from the west (Emeryville and I-80) 12.


## Select-link shares: modeled vs observed (design D5: headline = freeway shares, tolerance +/-10 pp)

- Hillegass Avenue NB: 4 links (path Claremont Avenue -> Alcatraz Avenue (434 m)), 164 trips (152 completed)
- Colby Street NB: 8 links (path Claremont Avenue -> Alcatraz Avenue (680 m)), 221 trips (202 completed)
- Hillegass Avenue SB: 4 links (path Alcatraz Avenue -> Claremont Avenue (433 m)), 99 trips (91 completed)
- Colby Street SB: 8 links (path Alcatraz Avenue -> Claremont Avenue (680 m)), 229 trips (214 completed)

| Block | Side | Via | Observed | Modeled | Diff (pp) | n trips | Headline |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue NB | from | freeway | 47% | 55% | +8 | 164 | within |
| Hillegass Avenue NB | to | Benvenue Avenue | 21% (PM 33%) | 5% | -16 | 164 |  |
| Hillegass Avenue NB | to | College Avenue | 6% | 13% | +7 | 164 |  |
| Hillegass Avenue NB | to | Alcatraz Avenue WB | 27% | 35% | +8 | 164 |  |
| Colby Street NB | from | freeway | 47% | 45% | -2 | 221 | within |
| Colby Street NB | to | Alcatraz Avenue WB | 48% | 57% | +9 | 221 |  |
| Colby Street NB | to | Telegraph Avenue | 25% | 40% | +15 | 221 |  |
| Colby Street NB | to | College Avenue | 3% | 6% | +3 | 221 |  |
| Hillegass Avenue SB | from | Alcatraz Avenue WB | 46% | 28% | -18 | 99 |  |
| Hillegass Avenue SB | from | Benvenue Avenue | 26% | 1% | -25 | 99 |  |
| Hillegass Avenue SB | from | College Avenue | 16% | 16% | +0 | 99 |  |
| Hillegass Avenue SB | to | freeway | 57% (PM 68%) | 64% | +7 | 99 | within |
| Colby Street SB | from | Alcatraz Avenue EB | 43% | 27% | -16 | 229 |  |
| Colby Street SB | from | Alcatraz Avenue WB | 46% | 12% | -34 | 229 |  |
| Colby Street SB | from | Telegraph Avenue | 22% | 21% | -1 | 229 |  |
| Colby Street SB | to | freeway | 45% | 52% | +7 | 229 | within |
| Colby Street SB | to | Forest Street | 34% | 7% | -27 | 229 |  |

Headline shares within tolerance: 4 of 4. Observed column uses the PM-peak share where one is given and the period is pm_peak. 'Via' shares are the fraction of select-link trips using that street before (from) or after (to) the block; freeway = origin / destination gate with a motorway-class link attached.

## Claremont ramps: streets used before the on-ramp / after the off-ramp

Observed shares are for traffic from/to the north only. 'Modeled' is over all trips on the ramps and any visit to the street (an upper bound for streets that serve both sides). 'Modeled, side' counts only trips whose surface end lies on the side of the ramp stated in the targets file (`freewayRamp.side`), and for a street with a qualifier ("north of X") only its links on that side of X.

| Direction | Via | Observed | Modeled | n ramp trips | Modeled, side | n side trips |
| --- | --- | --- | --- | --- | --- | --- |
| onto freeway | College Avenue | 16% | 14% | 676 | 15% | 609 |
| onto freeway | Hillegass Avenue | 12% | 11% | 676 | 12% | 609 |
| onto freeway | Martin Street | 10% | 16% | 676 | 17% | 609 |
| onto freeway | Colby Street | 8% | 14% | 676 | 16% | 609 |
| onto freeway | Telegraph Avenue north of Alcatraz Avenue | 8% | 13% | 676 | 12% | 609 |
| onto freeway | Benvenue Avenue | 5% | 5% | 676 | 5% | 609 |
| from freeway | College Avenue | 10% | 8% | 741 | 10% | 629 |
| from freeway | Martin Street | 10% | 10% | 741 | 12% | 629 |
| from freeway | Colby Street | 8% | 11% | 741 | 14% | 629 |
| from freeway | Hillegass Avenue | 5% | 7% | 741 | 8% | 629 |
| from freeway | Benvenue Avenue | 3% | 2% | 741 | 2% | 629 |

## Top 15 links by delay

| Link | Street | Class | Lanes | Len (m) | End node control | Delay (veh-h) | Stopped (veh-h) | Mean stopped veh | Flow (veh/h) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 4143 | Adeline Street | Secondary | 3 | 185 | signal | 19.11 | 11.79 | 11.8 | 1040 |
| 1122 | Alcatraz Avenue | Tertiary | 1 | 299 | signal | 11.67 | 9.20 | 9.2 | 274 |
| 1025 | Martin Luther King Junior Way | Secondary | 3 | 79 | signal | 8.34 | 6.91 | 6.9 | 844 |
| 1051 | Adeline Street | Secondary | 4 | 50 | signal | 5.57 | 4.51 | 4.5 | 1144 |
| 769 | Martin Luther King Junior Way | Secondary | 3 | 112 | signal | 5.18 | 3.16 | 3.2 | 1381 |
| 115 | San Pablo Avenue | Primary | 3 | 54 | signal | 5.17 | 4.15 | 4.1 | 857 |
| 1662 | 52nd Street | Secondary | 4 | 53 | signal | 4.99 | 3.79 | 3.8 | 886 |
| 108 | Stanford Avenue | Secondary | 3 | 61 | signal | 4.84 | 2.84 | 2.8 | 1547 |
| 1666 | 52nd Street | Secondary | 4 | 39 | signal | 4.69 | 4.08 | 4.1 | 835 |
| 1049 | Adeline Street | Secondary | 4 | 43 | signal | 4.62 | 3.46 | 3.5 | 1139 |
| 2248 | Telegraph Avenue | Secondary | 2 | 104 | signal | 4.43 | 2.29 | 2.3 | 1667 |
| 2005 | Shattuck Avenue | Tertiary | 1 | 92 | signal | 4.40 | 3.59 | 3.6 | 336 |
| 2008 | Shattuck Avenue | Tertiary | 1 | 93 | signal | 4.36 | 3.54 | 3.5 | 319 |
| 1111 | Market Street | Tertiary | 3 | 31 | signal | 4.28 | 3.68 | 3.7 | 840 |
| 2303 | Telegraph Avenue | Secondary | 2 | 104 | signal | 3.98 | 2.44 | 2.4 | 1291 |

## Top 15 nodes by blocked time

Blocked time = lane-head seconds waiting at the stop line without permission (signal red, conflict, stop sign or no downstream space).

| Node | Streets | Control | Gate | Blocked (lane-h) | of which no downstream space | Signal plan at end (cycle: greens) |
| --- | --- | --- | --- | --- | --- | --- |
| 446 | Market Street / Stanford Avenue | signal |  | 5.42 | 0.08 | 75 s: 47/18 |
| 680 | 52nd Street / Shattuck Avenue | signal |  | 4.95 | 0.17 | 90 s: 18/19/37 |
| 447 | Adeline Street / Alcatraz Avenue | signal |  | 4.24 | 0.06 | 75 s: 24/41 |
| 30 | 57th Street / Adeline Street / Market Street | signal |  | 3.53 | 0.01 | 75 s: 20/25/15 |
| 479 | Adeline Street / Martin Luther King Junior Way / Stanford Avenue | signal |  | 3.46 | 0.01 | 75 s: 28/37 |
| 185 | Alcatraz Avenue / Sacramento Street | signal |  | 3.28 | 0.03 | 75 s: 36/29 |
| 37 | San Pablo Avenue / Stanford Avenue | signal |  | 3.24 | 0.00 | 75 s: 25/40 |
| 944 | Ashby Avenue / Shattuck Avenue | signal |  | 2.73 | 0.00 | 75 s: 47/18 |
| 947 | Ashby Avenue / Telegraph Avenue | signal |  | 2.53 | 0.00 | 75 s: 17/48 |
| 851 | Alcatraz Avenue / Telegraph Avenue | signal |  | 2.51 | 0.04 | 75 s: 40/25 |
| 1406 | Ashby Avenue / Claremont Avenue | signal |  | 2.45 | 0.09 | 75 s: 50/15 |
| 713 | 51st Street / Telegraph Avenue | signal |  | 2.34 | 0.00 | 75 s: 28/37 |
| 501 | Alcatraz Avenue / Shattuck Avenue | signal |  | 2.33 | 0.19 | 75 s: 37/28 |
| 237 | Ashby Avenue / Sacramento Street | signal |  | 2.27 | 0.00 | 75 s: 47/18 |
| 242 | Ashby Avenue / Martin Luther King Junior Way | signal |  | 2.18 | 0.00 | 75 s: 40/25 |

Phases of the five most blocked signals (green s: approach links with their lanes, link ids in brackets):

- node 446: 47 s: Stanford Avenue 1L [941], Stanford Avenue 3L [1055]; 18 s: Market Street 4L [1108], Market Street 3L [1111]
- node 680: 18 s: 52nd Street 4L [1662]; 19 s: 52nd Street 4L [1666], 52nd Street 4L [1662]; 37 s: Shattuck Avenue 2L [1653], Shattuck Avenue 2L [1705]
- node 447: 24 s: Adeline Street 4L [1049], Adeline Street 4L [1051]; 41 s: Alcatraz Avenue 2L [1048], Alcatraz Avenue 2L [1133]
- node 30: 20 s: Adeline Street 1L [747], Adeline Street 1L [1030]; 25 s: Market Street 2L [755], Market Street 2L [1113]; 15 s: 57th Street 1L [44], 57th Street 1L [1151]
- node 479: 28 s: Martin Luther King Junior Way 3L [1025], Adeline Street 3L [4143]; 37 s: Stanford Avenue 1L [4139]

## Entry backlog by origin node at end of run (top 10)

| Node | Streets | Trips waiting | Offered veh/h (before scale) |
| --- | --- | --- | --- |
| 702 | Aileen Street / Telegraph Avenue | 1 | 6 |

## Flow on key streets (veh/h per direction, study-area links of 40 m or more)

| Street | Direction of travel | Links | Median flow | Max flow |
| --- | --- | --- | --- | --- |
| Telegraph | N | 12 | 767 | 806 |
| Telegraph | S | 10 | 697 | 770 |
| College | N | 3 | 161 | 161 |
| College | S | 3 | 294 | 294 |
| Claremont | N | 6 | 355 | 647 |
| Claremont | S | 7 | 365 | 725 |
| Alcatraz | E | 6 | 314 | 350 |
| Alcatraz | W | 6 | 420 | 530 |
| Hillegass | N | 4 | 101 | 109 |
| Hillegass | S | 4 | 66 | 67 |
| Colby | N | 7 | 116 | 120 |
| Colby | S | 7 | 138 | 151 |
| Martin | E | 2 | 110 | 110 |
| Martin | W | 2 | 110 | 110 |

## Largest demand origins (offered, before scale)

| Node | Streets | Veh/h |
| --- | --- | --- |
| 602 | Grove Shafter Freeway | 3694 |
| 943 | Telegraph Avenue / Ward Street | 1755 |
| 265 | Ashby Avenue | 1242 |
| 1672 | Warren Freeway | 1148 |
| 183 | San Pablo Avenue | 1011 |
| 763 | Telegraph Avenue | 531 |
| 275 | Market Street | 495 |
| 184 | Alcatraz Avenue | 372 |
| 971 | Pleasant Valley Avenue | 339 |
| 1756 | Claremont Avenue | 333 |
