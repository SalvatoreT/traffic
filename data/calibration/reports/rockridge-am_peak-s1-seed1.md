# Calibration report: rockridge am_peak scale 1 seed 1 (60 min)

Offered demand 21902 veh/h x scale 1 = 21902 veh/h. Run took 20.3 s wall clock. Flow tables use the window after a 10 min warm-up; select-link and health figures cover the whole run from an empty network.

## Stability (design D4)

| Criterion | Threshold | Value | Result |
| --- | --- | --- | --- |
| Gridlock removals | 0 | 0 | pass |
| Backlog / spawned | < 2% | 0.0% (2 of 22051) | pass |
| Arterial mean speed (run) | > 4 m/s | 9.61 m/s (last 15 min 9.57) | pass |

Overall: **STABLE**. Mean trip delay 117 s, mean trip time 409 s, completed 21667, unroutable 0.

| t (min) | vehicles in network | backlog | completed | removals | arterial speed in interval (m/s) |
| --- | --- | --- | --- | --- | --- |
| 5 | 2599 | 7 | 1785 | 0 | 9.72 |
| 10 | 2591 | 2 | 3608 | 0 | 9.35 |
| 15 | 2636 | 2 | 5413 | 0 | 9.65 |
| 20 | 2647 | 0 | 7271 | 0 | 9.75 |
| 25 | 2729 | 6 | 9015 | 0 | 9.75 |
| 30 | 2755 | 2 | 10828 | 0 | 9.51 |
| 35 | 2819 | 4 | 12628 | 0 | 9.40 |
| 40 | 2825 | 1 | 14430 | 0 | 9.69 |
| 45 | 2739 | 3 | 16328 | 0 | 9.86 |
| 50 | 2823 | 2 | 18073 | 0 | 9.56 |
| 55 | 2825 | 2 | 19855 | 0 | 9.53 |
| 60 | 2894 | 2 | 21667 | 0 | 9.63 |
## Wandering (completed car trips)

Detour ratio = distance driven (link and movement lengths) over the shortest network distance from the trip's origin to its destination. Detour against the free-flow route uses the time-shortest route with no congestion and no noise, which is what a purposeful driver without live information would follow (it differs from the shortest distance when a faster, longer road exists). A switch is a change of the remaining route while en route. Loops: the same link twice or the same node three or more times. Reversals: a link followed by its reverse within 200 m. 'Study-area vehicle-miles' are miles driven on links inside the study area; the last column is the share of them driven by trips with a detour ratio above 1.3. Guided drivers re-evaluate their route every epoch; the others keep their departure route unless it is blocked.

| Trips | n | Switches per trip | With a switch | Mean detour | Median detour | Detour > 1.3 | Detour > 2 | Mean detour vs free-flow route | Vs free-flow route > 1.3 | Loops | Reversals | Study veh-miles | Of them by detour > 1.3 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| all trips | 19879 | 0.01 | 0.6% | 1.089 | 1.051 | 4.6% | 0.0% | 1.025 | 1.7% | 0.0% | 5.4% | 1841 | 8.7% |
| gate to gate | 7845 | 0.01 | 0.9% | 1.091 | 1.060 | 3.1% | 0.1% | 1.021 | 1.5% | 0.0% | 8.0% | 463 | 10.3% |
| with a local end | 12034 | 0.00 | 0.4% | 1.088 | 1.047 | 5.6% | 0.0% | 1.027 | 1.8% | 0.0% | 3.7% | 1378 | 8.1% |
| guided drivers | 9025 | 0.01 | 1.3% | 1.089 | 1.051 | 4.5% | 0.0% | 1.025 | 1.6% | 0.0% | 5.6% | 830 | 8.5% |
| other drivers | 10854 | 0.00 | 0.0% | 1.089 | 1.051 | 4.7% | 0.1% | 1.024 | 1.7% | 0.0% | 5.2% | 1010 | 8.8% |

## Reported patterns (diagnostics; configured in the targets file under `patterns`)

(a) Trips between the surface gates on the north side of the ramps and the freeway mainline gates, and the local-street (residential and service links in the study area) vehicle-miles they drive. Share = of all completed trips' local-street vehicle-miles (345 miles). No observed counterpart exists for this quantity (the targets file has only the select-link shares above).

| Trips | n trips | Local-street veh-miles | Share of all local-street veh-miles |
| --- | --- | --- | --- |
| surface gates to the freeway | 1270 | 26.2 | 8% |
| freeway to the surface gates | 1009 | 24.8 | 7% |

(b) Corridor trips: completed trips from beyond one end of the corridor's study-area extent (the bypass street and its arterial together) to beyond the other end, within a lateral limit of the corridor, by direction. 'Bypass' = at least N blocks (links) on the bypass street; 'arterial' = fewer bypass blocks and at least N on the arterial; 'other' = neither (another street, the freeway or a short use); blocks are counted on the corridor's study-area links. No observed counterpart exists for these shares. The related observed values are in the select-link table above: northbound Hillegass Ave traffic rarely ends on College Ave (6%), 21 to 33% jogs to Benvenue Ave, and southbound freeway-bound drivers on College Ave commonly arrive via Ashby Ave and Benvenue Ave and jog to Hillegass Ave.

| Bypass | Arterial | N | Direction | Corridor trips | Bypass | Arterial | Other | Mean bypass blocks |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue | College Avenue | 3 | N | 872 | 5% | 11% | 84% | 0.2 |
| Hillegass Avenue | College Avenue | 3 | S | 1059 | 3% | 20% | 77% | 0.1 |

## Per-mode results

Offered: 21902 car veh/h; 497 bicycle flows (702/h); 2000 pedestrian flows (1340/h). Bicycle and pedestrian volumes are assumptions, not counts.

| Mode | In network | Completed | Mean time (s) | Other |
| --- | --- | --- | --- | --- |
| Car | 2894 | 21667 | 409 | |
| Bicycle | 53 | 701 | 240 | |
| Pedestrian | 165 | 1317 | 463 | mean crossing delay 7.1 s |

Vulnerable road users (surrogate indicators): pedestrian conflicts 231, bicycle conflicts 396, close passes 718, pedestrian injury-risk index 0.048, bicycle injury-risk index 0.070 (proxy), mean vehicle speed at pedestrian encounters 2.46 m/s.


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
| SR-24 off-ramp traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | OBSERVED turn count x ASSUMPTION share (131 left turns x 0.40) | 52 (38 to 62) | 39 | within |
| Telegraph Ave and south-side traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | ASSUMPTION: the through left-turners (131 x 0.62 = 81) that are not off-ramp traffic | 29 (19 to 43) | 43 | within |
| SR-24 off-ramp traffic using Colby St to reach College Ave and Berkeley (right at Alcatraz Ave) | OBSERVED turn count x ASSUMPTION share (32 right turns x 0.40) | 13 (9 to 15) | 3 | below |
| Telegraph Ave and south-side traffic using Colby St to reach College Ave and Berkeley | ASSUMPTION: the through right-turners (32 x 0.62 = 20) that are not off-ramp traffic | 7 (5 to 11) | 1 | below |
| Intents listed, together | | 101 (71 to 131) | 86 | |
| Other through cars (no intent listed) | | | 2 | |

Model through cars by origin and destination group (largest 12 of 17 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 26.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) | 11.0 | Claremont Avenue |
| Telegraph Ave to the south (downtown Oakland) | Telegraph Ave from the north (Berkeley) | 11.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Emeryville and West Oakland streets (55th to 67th Streets) | 8.0 | Claremont Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Telegraph Ave from the north (Berkeley) | 7.0 | none near the study area |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Alcatraz Ave from the west (Emeryville side) | 4.0 | Claremont Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Telegraph Ave from the north (Berkeley) | 4.0 | Telegraph Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Ashby Ave from the west (Emeryville and I-80) | 3.0 | SR-24 then Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 3.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Ashby Ave from the west (Emeryville and I-80) | 2.0 | none near the study area |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 2.0 | College Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Alcatraz Ave from the west (Emeryville side) | 2.0 | SR-24 then Telegraph Avenue |
| other pairs | | 5.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 45 veh/h; Claremont Avenue 24 veh/h; none near the study area 9 veh/h; SR-24 then Telegraph Avenue 5 veh/h; College Avenue 2 veh/h; Alcatraz Avenue then Claremont Avenue 1 veh/h.

### Hillegass Avenue NB

Observed (PM): 94 cars entered at the south end, 48 drove the whole street, 109 left it at Alcatraz Ave (43 west, 54 east, 12 straight), and 47% of the block's trips came from a freeway. ASSUMPTION: freeway-origin through cars are 40 veh/h (52 freeway-origin trips times 94 / (94 + 29)), spread over the exits in proportion (0.37); the through share of exits is 48 / 109 = 0.44.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Hillegass Ave to reach Alcatraz Ave west and Telegraph Ave north | OBSERVED turn count x ASSUMPTION share (43 left turns x 0.37) | 16 (9 to 20) | 23 | above |
| SR-24 off-ramp traffic using Hillegass Ave to reach College Ave and Berkeley | OBSERVED turn count x ASSUMPTION share (54 right turns x 0.37) | 20 (11 to 25) | 27 | above |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach Alcatraz Ave west | ASSUMPTION: through exits (43 x 0.44) that are not off-ramp traffic | 3 (0 to 10) | 7 | within |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach College Ave and Berkeley | ASSUMPTION: through exits (54 x 0.44) that are not off-ramp traffic | 4 (0 to 13) | 8 | within |
| Intents listed, together | | 43 (20 to 68) | 65 | |
| Other through cars (no intent listed) | | | 3 | |

Model through cars by origin and destination group (largest 12 of 18 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 16.0 | SR-24 |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 15.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 8.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Emeryville and West Oakland streets (55th to 67th Streets) | 5.0 | College Avenue then Alcatraz Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Claremont Ave and Tunnel Rd toward the hills | 3.0 | Claremont Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Telegraph Ave from the north (Berkeley) | 3.0 | none near the study area |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | College Ave from the north (Berkeley) | 3.0 | SR-24 then Claremont Avenue then College Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Alcatraz Ave from the west (Emeryville side) | 2.0 | Claremont Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 2.0 | Telegraph Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Alcatraz Ave from the west (Emeryville side) | 2.0 | SR-24 then Telegraph Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Shattuck Ave from the north (Berkeley) | 2.0 | SR-24 then Telegraph Avenue then Alcatraz Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | San Pablo Ave (Emeryville and West Oakland) | 1.0 | College Avenue then Alcatraz Avenue |
| other pairs | | 6.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 26 veh/h; SR-24 16 veh/h; Claremont Avenue 7 veh/h; College Avenue then Alcatraz Avenue 6 veh/h; none near the study area 4 veh/h; SR-24 then Claremont Avenue then College Avenue 3 veh/h.

### Hillegass Avenue SB

Observed (PM): 178 cars entered at the top (76 turned in from Alcatraz Ave west, 98 from the east, 4 came straight from the north), 79 drove the whole street, and 68% of the block's trips (109 veh/h) went to a freeway. ASSUMPTION: freeway-bound cars that did not join mid-street are 87 veh/h (109 x 178 / (178 + 44)), half of the 174 turn-ins; low = the whole-street share of the turn-ins (0.45), high = the freeway-bound share without the mid-street correction (0.63).

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Telegraph Ave, Alcatraz Ave west and West Berkeley traffic turning off Alcatraz Ave onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (76 turn-ins x 0.50) | 38 (34 to 48) | 15 | below |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (98 turn-ins x 0.50) | 49 (44 to 62) | 20 | below |
| Intents listed, together | | 87 (78 to 110) | 35 | |
| Other through cars (no intent listed) | | | 10 | |

Model through cars by origin and destination group (largest 12 of 9 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 15.0 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 10.0 | Claremont Avenue then SR-24 |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 9.0 | College Avenue then Claremont Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 6.0 | Alcatraz Avenue then College Avenue then Claremont Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Berkeley hills to the northeast (Evergreen Ln, Gravatt Dr) | 1.0 | Alcatraz Avenue then Claremont Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 1.0 | Claremont Avenue then SR-24 |
| College Ave from the north (Berkeley) | Telegraph Ave to the south (downtown Oakland) | 1.0 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 1.0 | Telegraph Avenue |
| Emeryville and West Oakland streets (55th to 67th Streets) | College Ave from the north (Berkeley) | 1.0 | Alcatraz Avenue then College Avenue |

By the arterial these cars would otherwise use: Telegraph Avenue 17 veh/h; Claremont Avenue then SR-24 11 veh/h; College Avenue then Claremont Avenue then SR-24 9 veh/h; Alcatraz Avenue then College Avenue then Claremont Avenue 6 veh/h; Alcatraz Avenue then Claremont Avenue 1 veh/h; Alcatraz Avenue then College Avenue 1 veh/h.

### Colby Street SB

Observed (PM): 139 cars entered at the top (76 from Alcatraz Ave west, 50 from the east, 13 from the north), 39 drove the whole street, 45% of the block's trips (72 veh/h) went to a freeway and 22% came by way of Telegraph Ave. ASSUMPTION: freeway-bound cars that did not join mid-street are 46 veh/h (72 x 139 / (139 + 79)), 0.365 of the 126 turn-ins; low = the whole-street share (0.31), high = the unadjusted freeway share (0.57). The Telegraph Ave cars are the 22% x 160 = 35 of the 76 west turn-ins.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Southbound Telegraph Ave traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (35 Telegraph Ave cars x 0.365) | 13 (11 to 20) | 18 | within |
| Alcatraz Ave west, Ashby Ave and West Berkeley traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (41 other west turn-ins x 0.365) | 15 (13 to 23) | 14 | within |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (50 east turn-ins x 0.365) | 18 (15 to 29) | 21 | within |
| Intents listed, together | | 46 (39 to 72) | 53 | |
| Other through cars (no intent listed) | | | 23 | |

Model through cars by origin and destination group (largest 12 of 19 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 20.0 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 12.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 10.0 | Alcatraz Avenue then College Avenue then Claremont Avenue |
| Shattuck Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 7.0 | none near the study area |
| Telegraph Ave from the north (Berkeley) | SR-13 Warren Freeway (via SR-24 east) | 5.0 | none near the study area |
| Alcatraz Ave from the west (Emeryville side) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 2.0 | SR-24 |
| Ashby Ave from the west (Emeryville and I-80) | SR-13 Warren Freeway (via SR-24 east) | 2.0 | SR-24 |
| Ashby Ave from the west (Emeryville and I-80) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 2.0 | SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 2.0 | Telegraph Avenue then Alcatraz Avenue then Claremont Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | West Oakland to the southwest (Adeline St, Market St) | 2.0 | Alcatraz Avenue then Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Telegraph Ave to the south (downtown Oakland) | 2.0 | Telegraph Avenue |
| College Ave from the north (Berkeley) | Telegraph Ave to the south (downtown Oakland) | 2.0 | Telegraph Avenue |
| other pairs | | 8.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 36 veh/h; none near the study area 13 veh/h; Alcatraz Avenue then College Avenue then Claremont Avenue 12 veh/h; SR-24 7 veh/h; Alcatraz Avenue then Telegraph Avenue 2 veh/h; Claremont Avenue 2 veh/h.

### Study area, all residential and service streets

Model: 466 through cars per hour.

Model through cars by origin and destination group (largest 12 of 55 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 44.0 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 40.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) | 38.0 | Claremont Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 36.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 28.0 | Telegraph Avenue |
| Telegraph Ave to the south (downtown Oakland) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 25.0 | Telegraph Avenue then Alcatraz Avenue then College Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 20.0 | Alcatraz Avenue then College Avenue then Claremont Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Emeryville and West Oakland streets (55th to 67th Streets) | 20.0 | Claremont Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 16.0 | SR-24 |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave to the south (downtown Oakland) | 15.0 | Claremont Avenue then Telegraph Avenue |
| Telegraph Ave to the south (downtown Oakland) | SR-24 westbound on-ramps (toward Oakland and I-980) | 12.0 | Telegraph Avenue |
| Telegraph Ave to the south (downtown Oakland) | Telegraph Ave from the north (Berkeley) | 11.0 | Telegraph Avenue |
| other pairs | | 161.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 192 veh/h; Claremont Avenue 91 veh/h; SR-24 29 veh/h; Alcatraz Avenue then College Avenue then Claremont Avenue 27 veh/h; Telegraph Avenue then Alcatraz Avenue then College Avenue 25 veh/h; none near the study area 25 veh/h.

By origin group: South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 110; SR-24 eastbound off-ramps (arriving from Oakland and I-980) 91; Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 76; Telegraph Ave to the south (downtown Oakland) 52; Telegraph Ave from the north (Berkeley) 48; SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) 21; Claremont Ave and Tunnel Rd toward the hills 15; College Ave from the north (Berkeley) 13; West Oakland to the southwest (Adeline St, Market St) 11; Emeryville and West Oakland streets (55th to 67th Streets) 10.

By destination group: SR-24 westbound on-ramps (toward Oakland and I-980) 115; Telegraph Ave from the north (Berkeley) 74; South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 55; Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 43; West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) 40; Claremont Ave and Tunnel Rd toward the hills 23; Telegraph Ave to the south (downtown Oakland) 21; Emeryville and West Oakland streets (55th to 67th Streets) 20; Alcatraz Ave from the west (Emeryville side) 14; Ashby Ave from the west (Emeryville and I-80) 14.


## Select-link shares: modeled vs observed (design D5: headline = freeway shares, tolerance +/-10 pp)

- Hillegass Avenue NB: 4 links (path Claremont Avenue -> Alcatraz Avenue (434 m)), 165 trips (151 completed)
- Colby Street NB: 8 links (path Claremont Avenue -> Alcatraz Avenue (680 m)), 224 trips (204 completed)
- Hillegass Avenue SB: 4 links (path Alcatraz Avenue -> Claremont Avenue (433 m)), 94 trips (86 completed)
- Colby Street SB: 8 links (path Alcatraz Avenue -> Claremont Avenue (680 m)), 211 trips (192 completed)

| Block | Side | Via | Observed | Modeled | Diff (pp) | n trips | Headline |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue NB | from | freeway | 47% | 56% | +9 | 165 | within |
| Hillegass Avenue NB | to | Benvenue Avenue | 21% (PM 33%) | 6% | -15 | 165 |  |
| Hillegass Avenue NB | to | College Avenue | 6% | 12% | +6 | 165 |  |
| Hillegass Avenue NB | to | Alcatraz Avenue WB | 27% | 38% | +11 | 165 |  |
| Colby Street NB | from | freeway | 47% | 46% | -1 | 224 | within |
| Colby Street NB | to | Alcatraz Avenue WB | 48% | 55% | +7 | 224 |  |
| Colby Street NB | to | Telegraph Avenue | 25% | 39% | +14 | 224 |  |
| Colby Street NB | to | College Avenue | 3% | 5% | +2 | 224 |  |
| Hillegass Avenue SB | from | Alcatraz Avenue WB | 46% | 28% | -18 | 94 |  |
| Hillegass Avenue SB | from | Benvenue Avenue | 26% | 1% | -25 | 94 |  |
| Hillegass Avenue SB | from | College Avenue | 16% | 15% | -1 | 94 |  |
| Hillegass Avenue SB | to | freeway | 57% (PM 68%) | 68% | +11 | 94 | OUTSIDE |
| Colby Street SB | from | Alcatraz Avenue EB | 43% | 30% | -13 | 211 |  |
| Colby Street SB | from | Alcatraz Avenue WB | 46% | 8% | -38 | 211 |  |
| Colby Street SB | from | Telegraph Avenue | 22% | 21% | -1 | 211 |  |
| Colby Street SB | to | freeway | 45% | 53% | +8 | 211 | within |
| Colby Street SB | to | Forest Street | 34% | 8% | -26 | 211 |  |

Headline shares within tolerance: 3 of 4. Observed column uses the PM-peak share where one is given and the period is pm_peak. 'Via' shares are the fraction of select-link trips using that street before (from) or after (to) the block; freeway = origin / destination gate with a motorway-class link attached.

## Claremont ramps: streets used before the on-ramp / after the off-ramp

Observed shares are for traffic from/to the north only. 'Modeled' is over all trips on the ramps and any visit to the street (an upper bound for streets that serve both sides). 'Modeled, side' counts only trips whose surface end lies on the side of the ramp stated in the targets file (`freewayRamp.side`), and for a street with a qualifier ("north of X") only its links on that side of X.

| Direction | Via | Observed | Modeled | n ramp trips | Modeled, side | n side trips |
| --- | --- | --- | --- | --- | --- | --- |
| onto freeway | College Avenue | 16% | 14% | 665 | 15% | 589 |
| onto freeway | Hillegass Avenue | 12% | 11% | 665 | 12% | 589 |
| onto freeway | Martin Street | 10% | 17% | 665 | 18% | 589 |
| onto freeway | Colby Street | 8% | 12% | 665 | 14% | 589 |
| onto freeway | Telegraph Avenue north of Alcatraz Avenue | 8% | 11% | 665 | 11% | 589 |
| onto freeway | Benvenue Avenue | 5% | 5% | 665 | 5% | 589 |
| from freeway | College Avenue | 10% | 8% | 800 | 10% | 651 |
| from freeway | Martin Street | 10% | 9% | 800 | 11% | 651 |
| from freeway | Colby Street | 8% | 12% | 800 | 14% | 651 |
| from freeway | Hillegass Avenue | 5% | 6% | 800 | 8% | 651 |
| from freeway | Benvenue Avenue | 3% | 2% | 800 | 2% | 651 |

## Top 15 links by delay

| Link | Street | Class | Lanes | Len (m) | End node control | Delay (veh-h) | Stopped (veh-h) | Mean stopped veh | Flow (veh/h) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 4143 | Adeline Street | Secondary | 3 | 185 | signal | 20.59 | 13.31 | 13.3 | 1007 |
| 1122 | Alcatraz Avenue | Tertiary | 1 | 299 | signal | 15.40 | 11.53 | 11.5 | 336 |
| 1051 | Adeline Street | Secondary | 4 | 50 | signal | 7.53 | 6.37 | 6.4 | 1139 |
| 1025 | Martin Luther King Junior Way | Secondary | 3 | 79 | signal | 6.70 | 5.02 | 5.0 | 935 |
| 1662 | 52nd Street | Secondary | 4 | 53 | signal | 6.02 | 4.87 | 4.9 | 799 |
| 769 | Martin Luther King Junior Way | Secondary | 3 | 112 | signal | 5.29 | 3.23 | 3.2 | 1380 |
| 115 | San Pablo Avenue | Primary | 3 | 54 | signal | 5.09 | 4.09 | 4.1 | 792 |
| 108 | Stanford Avenue | Secondary | 3 | 61 | signal | 4.92 | 2.93 | 2.9 | 1535 |
| 1049 | Adeline Street | Secondary | 4 | 43 | signal | 4.91 | 3.83 | 3.8 | 1049 |
| 1037 | Sacramento Street | Tertiary | 3 | 40 | signal | 4.73 | 3.77 | 3.8 | 1021 |
| 2008 | Shattuck Avenue | Tertiary | 1 | 93 | signal | 4.56 | 3.48 | 3.5 | 426 |
| 2303 | Telegraph Avenue | Secondary | 2 | 104 | signal | 4.29 | 2.73 | 2.7 | 1283 |
| 2248 | Telegraph Avenue | Secondary | 2 | 104 | signal | 4.21 | 2.21 | 2.2 | 1651 |
| 1111 | Market Street | Tertiary | 3 | 31 | signal | 4.04 | 3.40 | 3.4 | 944 |
| 1108 | Market Street | Secondary | 4 | 36 | signal | 4.02 | 3.53 | 3.5 | 907 |

## Top 15 nodes by blocked time

Blocked time = lane-head seconds waiting at the stop line without permission (signal red, conflict, stop sign or no downstream space).

| Node | Streets | Control | Gate | Blocked (lane-h) | of which no downstream space | Signal plan at end (cycle: greens) |
| --- | --- | --- | --- | --- | --- | --- |
| 680 | 52nd Street / Shattuck Avenue | signal |  | 5.52 | 0.02 | 90 s: 22/19/34 |
| 446 | Market Street / Stanford Avenue | signal |  | 5.47 | 0.08 | 75 s: 47/18 |
| 447 | Adeline Street / Alcatraz Avenue | signal |  | 4.89 | 0.13 | 75 s: 26/39 |
| 185 | Alcatraz Avenue / Sacramento Street | signal |  | 3.62 | 0.03 | 75 s: 36/29 |
| 30 | 57th Street / Adeline Street / Market Street | signal |  | 3.20 | 0.01 | 75 s: 20/25/15 |
| 37 | San Pablo Avenue / Stanford Avenue | signal |  | 3.18 | 0.00 | 75 s: 24/41 |
| 479 | Adeline Street / Martin Luther King Junior Way / Stanford Avenue | signal |  | 2.86 | 0.02 | 75 s: 25/40 |
| 944 | Ashby Avenue / Shattuck Avenue | signal |  | 2.84 | 0.00 | 75 s: 44/21 |
| 851 | Alcatraz Avenue / Telegraph Avenue | signal |  | 2.68 | 0.04 | 75 s: 39/26 |
| 1406 | Ashby Avenue / Claremont Avenue | signal |  | 2.45 | 0.08 | 75 s: 50/15 |
| 713 | 51st Street / Telegraph Avenue | signal |  | 2.40 | 0.00 | 75 s: 29/36 |
| 501 | Alcatraz Avenue / Shattuck Avenue | signal |  | 2.40 | 0.06 | 100 s: 55/35 |
| 947 | Ashby Avenue / Telegraph Avenue | signal |  | 2.33 | 0.00 | 75 s: 15/50 |
| 332 | 55th Street / Martin Luther King Junior Way | signal |  | 2.28 | 0.00 | 75 s: 40/25 |
| 242 | Ashby Avenue / Martin Luther King Junior Way | signal |  | 2.27 | 0.00 | 75 s: 41/24 |

Phases of the five most blocked signals (green s: approach links with their lanes, link ids in brackets):

- node 680: 22 s: 52nd Street 4L [1662]; 19 s: 52nd Street 4L [1666]; 34 s: Shattuck Avenue 2L [1653], Shattuck Avenue 2L [1705]
- node 446: 47 s: Stanford Avenue 1L [941], Stanford Avenue 3L [1055]; 18 s: Market Street 4L [1108], Market Street 3L [1111]
- node 447: 26 s: Adeline Street 4L [1049], Adeline Street 4L [1051]; 39 s: Alcatraz Avenue 2L [1048], Alcatraz Avenue 2L [1133]
- node 185: 36 s: Alcatraz Avenue 1L [363], Alcatraz Avenue 1L [1162]; 29 s: Sacramento Street 3L [1036], Sacramento Street 3L [1037]
- node 30: 20 s: Adeline Street 1L [747], Adeline Street 1L [1030]; 25 s: Market Street 2L [755], Market Street 2L [1113]; 15 s: 57th Street 1L [44], 57th Street 1L [1151]

## Entry backlog by origin node at end of run (top 10)

| Node | Streets | Trips waiting | Offered veh/h (before scale) |
| --- | --- | --- | --- |
| 702 | Aileen Street / Telegraph Avenue | 1 | 6 |
| 1128 | Alcatraz Avenue / Benvenue Avenue | 1 | 23 |

## Flow on key streets (veh/h per direction, study-area links of 40 m or more)

| Street | Direction of travel | Links | Median flow | Max flow |
| --- | --- | --- | --- | --- |
| Telegraph | N | 12 | 754 | 802 |
| Telegraph | S | 10 | 662 | 718 |
| College | N | 3 | 169 | 170 |
| College | S | 3 | 278 | 280 |
| Claremont | N | 6 | 360 | 646 |
| Claremont | S | 7 | 359 | 685 |
| Alcatraz | E | 6 | 314 | 350 |
| Alcatraz | W | 6 | 452 | 563 |
| Hillegass | N | 4 | 102 | 115 |
| Hillegass | S | 4 | 67 | 68 |
| Colby | N | 7 | 121 | 124 |
| Colby | S | 7 | 119 | 130 |
| Martin | E | 2 | 118 | 118 |
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
