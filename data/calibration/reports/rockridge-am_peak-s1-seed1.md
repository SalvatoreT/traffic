# Calibration report: rockridge am_peak scale 1 seed 1 (60 min)

Offered demand 21981 veh/h x scale 1 = 21981 veh/h. Run took 23.3 s wall clock. Flow tables use the window after a 10 min warm-up; select-link and health figures cover the whole run from an empty network.

## Stability (design D4)

| Criterion | Threshold | Value | Result |
| --- | --- | --- | --- |
| Gridlock removals | 0 | 2 | FAIL |
| Backlog / spawned | < 2% | 0.0% (2 of 22202) | pass |
| Arterial mean speed (run) | > 4 m/s | 8.57 m/s (last 15 min 8.53) | pass |

Overall: **NOT STABLE**. Mean trip delay 152 s, mean trip time 412 s, completed 22230, unroutable 0.

| t (min) | vehicles in network | backlog | completed | removals | arterial speed in interval (m/s) |
| --- | --- | --- | --- | --- | --- |
| 5 | 2576 | 2 | 1910 | 0 | 8.99 |
| 10 | 2580 | 5 | 3718 | 0 | 8.59 |
| 15 | 2716 | 1 | 5461 | 0 | 8.33 |
| 20 | 2707 | 8 | 7364 | 0 | 8.35 |
| 25 | 2659 | 10 | 9298 | 0 | 8.78 |
| 30 | 2649 | 4 | 11138 | 2 | 8.38 |
| 35 | 2530 | 2 | 13094 | 2 | 8.50 |
| 40 | 2590 | 3 | 14903 | 2 | 8.65 |
| 45 | 2626 | 4 | 16708 | 2 | 8.68 |
| 50 | 2657 | 4 | 18485 | 2 | 8.57 |
| 55 | 2619 | 2 | 20368 | 2 | 8.70 |
| 60 | 2590 | 2 | 22230 | 2 | 8.32 |
## Wandering (completed car trips)

Detour ratio = distance driven (link and movement lengths) over the shortest network distance from the trip's origin to its destination. Detour against the free-flow route uses the time-shortest route with no congestion and no noise, which is what a purposeful driver without live information would follow (it differs from the shortest distance when a faster, longer road exists). A switch is a change of the remaining route while en route. Loops: the same link twice or the same node three or more times. Reversals: a link followed by its reverse within 200 m. 'Study-area vehicle-miles' are miles driven on links inside the study area; the last column is the share of them driven by trips with a detour ratio above 1.3. Guided drivers re-evaluate their route every epoch; the others keep their departure route unless it is blocked.

| Trips | n | Switches per trip | With a switch | Mean detour | Median detour | Detour > 1.3 | Detour > 2 | Mean detour vs free-flow route | Vs free-flow route > 1.3 | Loops | Reversals | Study veh-miles | Of them by detour > 1.3 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| all trips | 20364 | 0.02 | 2.4% | 1.093 | 1.060 | 4.7% | 0.0% | 1.030 | 1.6% | 0.0% | 5.9% | 2035 | 8.3% |
| gate to gate | 7255 | 0.03 | 3.3% | 1.096 | 1.072 | 2.6% | 0.0% | 1.029 | 1.1% | 0.0% | 8.7% | 361 | 7.3% |
| with a local end | 13109 | 0.02 | 1.9% | 1.092 | 1.055 | 5.8% | 0.0% | 1.030 | 1.8% | 0.0% | 4.4% | 1674 | 8.5% |
| guided drivers | 9353 | 0.05 | 4.7% | 1.095 | 1.061 | 4.9% | 0.0% | 1.030 | 1.8% | 0.0% | 6.1% | 912 | 8.0% |
| other drivers | 11011 | 0.00 | 0.4% | 1.092 | 1.060 | 4.4% | 0.0% | 1.029 | 1.4% | 0.0% | 5.7% | 1123 | 8.6% |

## Reported patterns (diagnostics; configured in the targets file under `patterns`)

(a) Trips between the surface gates on the north side of the ramps and the freeway mainline gates, and the local-street (residential and service links in the study area) vehicle-miles they drive. Share = of all completed trips' local-street vehicle-miles (389 miles). No observed counterpart exists for this quantity (the targets file has only the select-link shares above).

| Trips | n trips | Local-street veh-miles | Share of all local-street veh-miles |
| --- | --- | --- | --- |
| surface gates to the freeway | 1378 | 22.2 | 6% |
| freeway to the surface gates | 1088 | 26.7 | 7% |

(b) Corridor trips: completed trips from beyond one end of the corridor's study-area extent (the bypass street and its arterial together) to beyond the other end, within a lateral limit of the corridor, by direction. 'Bypass' = at least N blocks (links) on the bypass street; 'arterial' = fewer bypass blocks and at least N on the arterial; 'other' = neither (another street, the freeway or a short use); blocks are counted on the corridor's study-area links. No observed counterpart exists for these shares. The related observed values are in the select-link table above: northbound Hillegass Ave traffic rarely ends on College Ave (6%), 21 to 33% jogs to Benvenue Ave, and southbound freeway-bound drivers on College Ave commonly arrive via Ashby Ave and Benvenue Ave and jog to Hillegass Ave.

| Bypass | Arterial | N | Direction | Corridor trips | Bypass | Arterial | Other | Mean bypass blocks |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue | College Avenue | 3 | N | 1109 | 4% | 13% | 83% | 0.2 |
| Hillegass Avenue | College Avenue | 3 | S | 1278 | 3% | 26% | 71% | 0.1 |

## Per-mode results

Offered: 21981 car veh/h; 497 bicycle flows (702/h); 2000 pedestrian flows (1340/h). Bicycle and pedestrian volumes are assumptions, not counts.

| Mode | In network | Completed | Mean time (s) | Other |
| --- | --- | --- | --- | --- |
| Car | 2590 | 22230 | 412 | |
| Bicycle | 47 | 712 | 254 | |
| Pedestrian | 169 | 1203 | 470 | mean crossing delay 7.7 s |

Vulnerable road users (surrogate indicators): pedestrian conflicts 232, bicycle conflicts 833, close passes 700, pedestrian injury severity mean 0.046 (AIS4+, 7899 supported of 7899 encounters), cyclist injury severity mean 0.062 (MAIS3+F, 3238 supported of 6086 encounters) (separate endpoints, never summed), mean vehicle speed at pedestrian encounters 2.40 m/s.


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
| SR-24 off-ramp traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | OBSERVED turn count x ASSUMPTION share (131 left turns x 0.40) | 52 (38 to 62) | 42 | within |
| Telegraph Ave and south-side traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | ASSUMPTION: the through left-turners (131 x 0.62 = 81) that are not off-ramp traffic | 29 (19 to 43) | 23 | within |
| SR-24 off-ramp traffic using Colby St to reach College Ave and Berkeley (right at Alcatraz Ave) | OBSERVED turn count x ASSUMPTION share (32 right turns x 0.40) | 13 (9 to 15) | -0 | below |
| Telegraph Ave and south-side traffic using Colby St to reach College Ave and Berkeley | ASSUMPTION: the through right-turners (32 x 0.62 = 20) that are not off-ramp traffic | 7 (5 to 11) | 17 | above |
| Intents listed, together | | 101 (71 to 131) | 82 | |
| Other through cars (no intent listed) | | | 3 | |

Model through cars by origin and destination group (largest 12 of 14 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 42.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 15.0 | Claremont Avenue then College Avenue then Alcatraz Avenue |
| Telegraph Ave to the south (downtown Oakland) | Telegraph Ave from the north (Berkeley) | 12.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Shattuck Ave from the north (Berkeley) | 3.0 | College Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Telegraph Ave from the north (Berkeley) | 3.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Ashby Ave from the west (Emeryville and I-80) | 2.0 | Claremont Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Ashby Ave from the west (Emeryville and I-80) | 1.0 | Claremont Avenue then Alcatraz Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | College Ave from the north (Berkeley) | 1.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | West Oakland to the southwest (Adeline St, Market St) | 1.0 | Claremont Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) | 1.0 | none near the study area |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 1.0 | College Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Emeryville and West Oakland streets (55th to 67th Streets) | 1.0 | Claremont Avenue |
| other pairs | | 2.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 59 veh/h; Claremont Avenue then College Avenue then Alcatraz Avenue 15 veh/h; Claremont Avenue 4 veh/h; College Avenue 4 veh/h; Claremont Avenue then Alcatraz Avenue 1 veh/h; SR-24 1 veh/h.

### Hillegass Avenue NB

Observed (PM): 94 cars entered at the south end, 48 drove the whole street, 109 left it at Alcatraz Ave (43 west, 54 east, 12 straight), and 47% of the block's trips came from a freeway. ASSUMPTION: freeway-origin through cars are 40 veh/h (52 freeway-origin trips times 94 / (94 + 29)), spread over the exits in proportion (0.37); the through share of exits is 48 / 109 = 0.44.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Hillegass Ave to reach Alcatraz Ave west and Telegraph Ave north | OBSERVED turn count x ASSUMPTION share (43 left turns x 0.37) | 16 (9 to 20) | 23 | above |
| SR-24 off-ramp traffic using Hillegass Ave to reach College Ave and Berkeley | OBSERVED turn count x ASSUMPTION share (54 right turns x 0.37) | 20 (11 to 25) | 31 | above |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach Alcatraz Ave west | ASSUMPTION: through exits (43 x 0.44) that are not off-ramp traffic | 3 (0 to 10) | 12 | above |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach College Ave and Berkeley | ASSUMPTION: through exits (54 x 0.44) that are not off-ramp traffic | 4 (0 to 13) | 10 | within |
| Intents listed, together | | 43 (20 to 68) | 76 | |
| Other through cars (no intent listed) | | | 5 | |

Model through cars by origin and destination group (largest 12 of 22 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 17.0 | SR-24 |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 11.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | College Ave from the north (Berkeley) | 8.0 | SR-24 then Claremont Avenue then College Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 6.0 | SR-24 then Claremont Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 5.0 | College Avenue then Alcatraz Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Shattuck Ave from the north (Berkeley) | 4.0 | College Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Shattuck Ave from the north (Berkeley) | 4.0 | SR-24 then Telegraph Avenue then Alcatraz Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 3.0 | Telegraph Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Ashby Ave from the west (Emeryville and I-80) | 3.0 | SR-24 then Telegraph Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Telegraph Ave from the north (Berkeley) | 3.0 | none near the study area |
| College Ave from the north (Berkeley) | San Pablo Ave (Emeryville and West Oakland) | 2.0 | College Avenue then Claremont Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Alcatraz Ave from the west (Emeryville side) | 2.0 | College Avenue then Alcatraz Avenue |
| other pairs | | 13.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 21 veh/h; SR-24 18 veh/h; College Avenue then Alcatraz Avenue 8 veh/h; SR-24 then Claremont Avenue then College Avenue 8 veh/h; SR-24 then Claremont Avenue 6 veh/h; College Avenue 4 veh/h.

### Hillegass Avenue SB

Observed (PM): 178 cars entered at the top (76 turned in from Alcatraz Ave west, 98 from the east, 4 came straight from the north), 79 drove the whole street, and 68% of the block's trips (109 veh/h) went to a freeway. ASSUMPTION: freeway-bound cars that did not join mid-street are 87 veh/h (109 x 178 / (178 + 44)), half of the 174 turn-ins; low = the whole-street share of the turn-ins (0.45), high = the freeway-bound share without the mid-street correction (0.63).

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Telegraph Ave, Alcatraz Ave west and West Berkeley traffic turning off Alcatraz Ave onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (76 turn-ins x 0.50) | 38 (34 to 48) | 18 | below |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (98 turn-ins x 0.50) | 49 (44 to 62) | 31 | below |
| Intents listed, together | | 87 (78 to 110) | 49 | |
| Other through cars (no intent listed) | | | 30 | |

Model through cars by origin and destination group (largest 12 of 12 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 21.0 | Claremont Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 18.0 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 17.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 6.0 | Claremont Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Telegraph Ave to the south (downtown Oakland) | 4.0 | Telegraph Avenue |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 4.0 | College Avenue then Claremont Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | West Oakland to the southwest (Adeline St, Market St) | 3.0 | Claremont Avenue |
| Telegraph Ave from the north (Berkeley) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 2.0 | Telegraph Avenue |
| Alcatraz Ave from the west (Emeryville side) | Berkeley hills to the northeast (Evergreen Ln, Gravatt Dr) | 1.0 | Alcatraz Avenue then Claremont Avenue |
| Ashby Ave from the west (Emeryville and I-80) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 1.0 | SR-24 |
| College Ave from the north (Berkeley) | San Pablo Ave (Emeryville and West Oakland) | 1.0 | none near the study area |
| Emeryville and West Oakland streets (55th to 67th Streets) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 1.0 | Alcatraz Avenue then College Avenue |

By the arterial these cars would otherwise use: Telegraph Avenue 41 veh/h; Claremont Avenue then SR-24 27 veh/h; College Avenue then Claremont Avenue then SR-24 4 veh/h; Claremont Avenue 3 veh/h; Alcatraz Avenue then Claremont Avenue 1 veh/h; Alcatraz Avenue then College Avenue 1 veh/h.

### Colby Street SB

Observed (PM): 139 cars entered at the top (76 from Alcatraz Ave west, 50 from the east, 13 from the north), 39 drove the whole street, 45% of the block's trips (72 veh/h) went to a freeway and 22% came by way of Telegraph Ave. ASSUMPTION: freeway-bound cars that did not join mid-street are 46 veh/h (72 x 139 / (139 + 79)), 0.365 of the 126 turn-ins; low = the whole-street share (0.31), high = the unadjusted freeway share (0.57). The Telegraph Ave cars are the 22% x 160 = 35 of the 76 west turn-ins.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Southbound Telegraph Ave traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (35 Telegraph Ave cars x 0.365) | 13 (11 to 20) | 13 | within |
| Alcatraz Ave west, Ashby Ave and West Berkeley traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (41 other west turn-ins x 0.365) | 15 (13 to 23) | 14 | within |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (50 east turn-ins x 0.365) | 18 (15 to 29) | 32 | above |
| Intents listed, together | | 46 (39 to 72) | 59 | |
| Other through cars (no intent listed) | | | 64 | |

Model through cars by origin and destination group (largest 12 of 22 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 29.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 29.0 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 12.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | West Oakland to the southwest (Adeline St, Market St) | 11.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Telegraph Ave to the south (downtown Oakland) | 9.0 | Telegraph Avenue |
| Shattuck Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 8.0 | none near the study area |
| Claremont Ave and Tunnel Rd toward the hills | Emeryville and West Oakland streets (55th to 67th Streets) | 3.0 | Claremont Avenue then Alcatraz Avenue |
| Emeryville and West Oakland streets (55th to 67th Streets) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 3.0 | Alcatraz Avenue then College Avenue |
| Ashby Ave from the west (Emeryville and I-80) | SR-13 Warren Freeway (via SR-24 east) | 2.0 | SR-24 |
| Ashby Ave from the west (Emeryville and I-80) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 2.0 | SR-24 |
| Claremont Ave and Tunnel Rd toward the hills | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 2.0 | Claremont Avenue then Alcatraz Avenue then Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 2.0 | Claremont Avenue then SR-24 |
| other pairs | | 11.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 92 veh/h; none near the study area 9 veh/h; SR-24 6 veh/h; Alcatraz Avenue then College Avenue 4 veh/h; Claremont Avenue 3 veh/h; Claremont Avenue then Alcatraz Avenue 3 veh/h.

### Study area, all residential and service streets

Model: 541 through cars per hour.

Model through cars by origin and destination group (largest 12 of 72 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 64.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 59.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 55.0 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 26.0 | Telegraph Avenue |
| Telegraph Ave to the south (downtown Oakland) | SR-24 westbound on-ramps (toward Oakland and I-980) | 24.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 22.0 | Claremont Avenue then College Avenue then Alcatraz Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 21.0 | Claremont Avenue then SR-24 |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 20.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | West Oakland to the southwest (Adeline St, Market St) | 17.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 17.0 | SR-24 |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Shattuck Ave from the north (Berkeley) | 15.0 | College Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Telegraph Ave to the south (downtown Oakland) | 13.0 | Telegraph Avenue |
| other pairs | | 188.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 317 veh/h; Claremont Avenue 32 veh/h; SR-24 31 veh/h; none near the study area 27 veh/h; Claremont Avenue then College Avenue then Alcatraz Avenue 22 veh/h; Claremont Avenue then SR-24 21 veh/h.

By origin group: Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 166; SR-24 eastbound off-ramps (arriving from Oakland and I-980) 100; South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 66; Telegraph Ave to the south (downtown Oakland) 48; Telegraph Ave from the north (Berkeley) 39; Claremont Ave and Tunnel Rd toward the hills 34; West Oakland to the southwest (Adeline St, Market St) 23; SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) 12; Emeryville and West Oakland streets (55th to 67th Streets) 11; Shattuck Ave from the north (Berkeley) 10.

By destination group: SR-24 westbound on-ramps (toward Oakland and I-980) 149; South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 93; Telegraph Ave from the north (Berkeley) 81; Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 54; Claremont Ave and Tunnel Rd toward the hills 30; Shattuck Ave from the north (Berkeley) 19; West Oakland to the southwest (Adeline St, Market St) 18; College Ave from the north (Berkeley) 17; Emeryville and West Oakland streets (55th to 67th Streets) 17; Ashby Ave from the west (Emeryville and I-80) 16.


## Through cars by intent (cut-through intent view)

A through car is tallied once, under the first intent that fits it (the on-ramp on its planned route, the off-ramp it has driven, or the origin and destination groups of its trip), at the moment the through count counts it. Cars an hour over the run, the same window as the through-car figure (543 an hour).

| Intent | Basis | Cars an hour | Share |
| --- | --- | --- | --- |
| on-2853241697 | observed | 151 | 28% |
| Other on-ramps | assumed | 16 | 3% |
| off-52990846 | observed | 99 | 18% |
| Other off-ramps | assumed | 18 | 3% |
| Downtown, south and west Oakland traffic using side streets to reach Berkeley and Telegraph Ave north | assumed | 71 | 13% |
| Berkeley and Telegraph Ave north traffic using side streets to reach downtown, south and west Oakland | assumed | 101 | 19% |
| Oakland cross-town traffic (West Oakland, Broadway, Piedmont, Emeryville) using side streets near Claremont Ave and Telegraph Ave | assumed | 40 | 7% |
| Other (no intent listed) |  | 47 | 9% |

Intents listed cover 91% of through cars.


## Select-link shares: modeled vs observed (design D5: headline = freeway shares, tolerance +/-10 pp)

- Hillegass Avenue NB: 4 links (path Claremont Avenue -> Alcatraz Avenue (434 m)), 195 trips (186 completed)
- Colby Street NB: 8 links (path Claremont Avenue -> Alcatraz Avenue (680 m)), 219 trips (206 completed)
- Hillegass Avenue SB: 4 links (path Alcatraz Avenue -> Claremont Avenue (433 m)), 127 trips (119 completed)
- Colby Street SB: 8 links (path Alcatraz Avenue -> Claremont Avenue (680 m)), 297 trips (269 completed)

| Block | Side | Via | Observed | Modeled | Diff (pp) | n trips | Headline |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue NB | from | freeway | 47% | 54% | +7 | 195 | within |
| Hillegass Avenue NB | to | Benvenue Avenue | 21% (PM 33%) | 8% | -13 | 195 |  |
| Hillegass Avenue NB | to | College Avenue | 6% | 13% | +7 | 195 |  |
| Hillegass Avenue NB | to | Alcatraz Avenue WB | 27% | 33% | +6 | 195 |  |
| Colby Street NB | from | freeway | 47% | 45% | -2 | 219 | within |
| Colby Street NB | to | Alcatraz Avenue WB | 48% | 51% | +3 | 219 |  |
| Colby Street NB | to | Telegraph Avenue | 25% | 51% | +26 | 219 |  |
| Colby Street NB | to | College Avenue | 3% | 5% | +2 | 219 |  |
| Hillegass Avenue SB | from | Alcatraz Avenue WB | 46% | 27% | -19 | 127 |  |
| Hillegass Avenue SB | from | Benvenue Avenue | 26% | 0% | -26 | 127 |  |
| Hillegass Avenue SB | from | College Avenue | 16% | 11% | -5 | 127 |  |
| Hillegass Avenue SB | to | freeway | 57% (PM 68%) | 65% | +8 | 127 | within |
| Colby Street SB | from | Alcatraz Avenue EB | 43% | 18% | -25 | 297 |  |
| Colby Street SB | from | Alcatraz Avenue WB | 46% | 12% | -34 | 297 |  |
| Colby Street SB | from | Telegraph Avenue | 22% | 16% | -6 | 297 |  |
| Colby Street SB | to | freeway | 45% | 47% | +2 | 297 | within |
| Colby Street SB | to | Forest Street | 34% | 10% | -24 | 297 |  |

Headline shares within tolerance: 4 of 4. Observed column uses the PM-peak share where one is given and the period is pm_peak. 'Via' shares are the fraction of select-link trips using that street before (from) or after (to) the block; freeway = origin / destination gate with a motorway-class link attached.

## Claremont ramps: streets used before the on-ramp / after the off-ramp

Observed shares are for traffic from/to the north only. 'Modeled' is over all trips on the ramps and any visit to the street (an upper bound for streets that serve both sides). 'Modeled, side' counts only trips whose surface end lies on the side of the ramp stated in the targets file (`freewayRamp.side`), and for a street with a qualifier ("north of X") only its links on that side of X.

| Direction | Via | Observed | Modeled | n ramp trips | Modeled, side | n side trips |
| --- | --- | --- | --- | --- | --- | --- |
| onto freeway | College Avenue | 16% | 15% | 662 | 18% | 570 |
| onto freeway | Hillegass Avenue | 12% | 11% | 662 | 13% | 570 |
| onto freeway | Martin Street | 10% | 15% | 662 | 14% | 570 |
| onto freeway | Colby Street | 8% | 14% | 662 | 16% | 570 |
| onto freeway | Telegraph Avenue north of Alcatraz Avenue | 8% | 15% | 662 | 11% | 570 |
| onto freeway | Benvenue Avenue | 5% | 3% | 662 | 3% | 570 |
| from freeway | College Avenue | 10% | 13% | 650 | 14% | 634 |
| from freeway | Martin Street | 10% | 13% | 650 | 13% | 634 |
| from freeway | Colby Street | 8% | 12% | 650 | 12% | 634 |
| from freeway | Hillegass Avenue | 5% | 7% | 650 | 7% | 634 |
| from freeway | Benvenue Avenue | 3% | 4% | 650 | 4% | 634 |

## Top 15 links by delay

| Link | Street | Class | Lanes | Len (m) | End node control | Delay (veh-h) | Stopped (veh-h) | Mean stopped veh | Flow (veh/h) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 4143 | Adeline Street | Secondary | 3 | 185 | signal | 25.48 | 20.07 | 20.1 | 684 |
| 1025 | Martin Luther King Junior Way | Secondary | 3 | 79 | signal | 9.90 | 8.37 | 8.4 | 625 |
| 1122 | Alcatraz Avenue | Tertiary | 1 | 299 | signal | 9.66 | 6.24 | 6.2 | 434 |
| 1108 | Market Street | Secondary | 4 | 36 | signal | 8.37 | 7.43 | 7.4 | 743 |
| 2037 | Alcatraz Avenue | Tertiary | 1 | 202 | uncontrolled | 8.36 | 6.25 | 6.3 | 330 |
| 1049 | Adeline Street | Secondary | 4 | 43 | signal | 7.25 | 5.99 | 6.0 | 910 |
| 1024 | Martin Luther King Junior Way | Secondary | 3 | 75 | two_way_stop | 7.21 | 5.79 | 5.8 | 716 |
| 115 | San Pablo Avenue | Primary | 3 | 54 | signal | 6.42 | 4.89 | 4.9 | 1056 |
| 1092 | (unnamed) | Service | 1 | 110 | uncontrolled | 5.92 | 5.21 | 5.2 | 145 |
| 1051 | Adeline Street | Secondary | 4 | 50 | signal | 5.85 | 4.79 | 4.8 | 1114 |
| 303 | Baker Street | Residential | 1 | 104 | two_way_stop | 5.83 | 5.55 | 5.5 | 52 |
| 108 | Stanford Avenue | Secondary | 3 | 61 | signal | 5.76 | 4.22 | 4.2 | 1009 |
| 1666 | 52nd Street | Secondary | 4 | 39 | signal | 5.66 | 4.94 | 4.9 | 684 |
| 4175 | (unnamed) | Motorway | 2 | 142 | uncontrolled | 5.62 | 0.97 | 1.0 | 1480 |
| 4150 | Alcatraz Avenue | Tertiary | 1 | 160 | uncontrolled | 5.60 | 4.25 | 4.3 | 229 |

## Top 15 nodes by blocked time

Blocked time = lane-head seconds waiting at the stop line without permission (signal red, conflict, stop sign or no downstream space).

| Node | Streets | Control | Gate | Blocked (lane-h) | of which no downstream space | Signal plan at end (cycle: greens) |
| --- | --- | --- | --- | --- | --- | --- |
| 446 | Market Street / Stanford Avenue | signal |  | 4.84 | 0.18 | 75 s: 50/15 |
| 447 | Adeline Street / Alcatraz Avenue | signal |  | 4.64 | 0.37 | 75 s: 28/37 |
| 680 | 52nd Street / Shattuck Avenue | signal |  | 4.52 | 0.10 | 90 s: 18/19/37 |
| 30 | 57th Street / Adeline Street / Market Street | signal |  | 3.56 | 0.04 | 75 s: 26/17/16 |
| 479 | Adeline Street / Martin Luther King Junior Way / Stanford Avenue | signal |  | 3.29 | 0.07 | 120 s: 38/72 |
| 37 | San Pablo Avenue / Stanford Avenue | signal |  | 3.29 | 0.04 | 75 s: 41/24 |
| 185 | Alcatraz Avenue / Sacramento Street | signal |  | 3.28 | 0.12 | 75 s: 37/28 |
| 944 | Ashby Avenue / Shattuck Avenue | signal |  | 2.73 | 0.03 | 75 s: 44/21 |
| 1080 | 62nd Street / Claremont Avenue / College Avenue | signal |  | 2.58 | 0.03 | 75 s: 19/26/15 |
| 331 | 52nd Street / Martin Luther King Junior Way | signal |  | 2.54 | 0.02 | 75 s: 48/17 |
| 851 | Alcatraz Avenue / Telegraph Avenue | signal |  | 2.52 | 0.11 | 75 s: 45/20 |
| 1406 | Ashby Avenue / Claremont Avenue | signal |  | 2.50 | 0.15 | 75 s: 50/15 |
| 242 | Ashby Avenue / Martin Luther King Junior Way | signal |  | 2.50 | 0.00 | 75 s: 36/29 |
| 713 | 51st Street / Telegraph Avenue | signal |  | 2.45 | 0.02 | 75 s: 35/30 |
| 947 | Ashby Avenue / Telegraph Avenue | signal |  | 2.42 | 0.00 | 75 s: 25/40 |

Phases of the five most blocked signals (green s: approach links with their lanes, link ids in brackets):

- node 446: 50 s: Stanford Avenue 1L [941], Stanford Avenue 3L [1055]; 15 s: Market Street 4L [1108], Market Street 3L [1111]
- node 447: 28 s: Adeline Street 4L [1049], Adeline Street 4L [1051]; 37 s: Alcatraz Avenue 2L [1048], Alcatraz Avenue 2L [1133]
- node 680: 18 s: 52nd Street 4L [1662]; 19 s: 52nd Street 4L [1666], 52nd Street 4L [1662]; 37 s: Shattuck Avenue 2L [1653], Shattuck Avenue 2L [1705]
- node 30: 26 s: Adeline Street 1L [747], Adeline Street 1L [1030]; 17 s: Market Street 2L [755], Market Street 2L [1113]; 16 s: 57th Street 1L [44], 57th Street 1L [1151]
- node 479: 38 s: Martin Luther King Junior Way 3L [1025], Adeline Street 3L [4143]; 72 s: Stanford Avenue 1L [4139]

## Gridlock removals by link (top 10)

| Link | Street | End node | Control | Removals | First at (min) |
| --- | --- | --- | --- | --- | --- |
| 1060 | California Street | California Street | uncontrolled | 1 | 25.4 |
| 978 | Harmon Street | Harmon Street / King Street | traffic_circle | 1 | 29.1 |

## Junction recovery

Policy `physical`. Node entries by cars and cyclists in the run: 714909 (settle interval 0). An admission is an entry the ordinary rule would have refused; head-seconds count the time a waiting head vehicle had the reason invoked, and the part of it in which it still could not enter. Courtesy and the yield fallback change priority only; under `physical` the conflict bypass never admits.

| Reason | Admissions per hour | Per 1,000 entries | Head-s invoked | Head-s blocked |
| --- | --- | --- | --- | --- |
| courtesy | 244.0 | 0.341 | 1048 | 967 |
| yield fallback | 115.0 | 0.161 | 35 | 0 |
| conflict bypass | 0.0 | 0.000 | 81 | 81 |

Vehicles removed while held in a node by a full exit: 0 (0.0 per hour, included in the gridlock removals).

| Node | Streets | Control | Courtesy | Yield fallback | Conflict bypass | Held removals |
| --- | --- | --- | --- | --- | --- | --- |
| 165 | Alcatraz Avenue / Baker Street | two_way_stop | 14 | 11 | 0 | 0 |
| 436 | 62nd Street / Adeline Street / Stanford Avenue | two_way_stop | 19 | 1 | 0 | 0 |
| 430 | Alcatraz Avenue / King Street | two_way_stop | 7 | 10 | 0 | 0 |
| 479 | Adeline Street / Martin Luther King Junior Way / Stanford Avenue | signal | 14 | 0 | 0 | 0 |
| 1220 | Ashby Avenue / College Avenue | signal | 13 | 0 | 0 | 0 |
| 457 | Alcatraz Avenue / California Street | two_way_stop | 4 | 7 | 0 | 0 |
| 492 | Aileen Street / Shattuck Avenue | two_way_stop | 1 | 9 | 0 | 0 |
| 528 | Shattuck Avenue / Woolsey Street | two_way_stop | 3 | 7 | 0 | 0 |
| 460 | Alcatraz Avenue / Ellis Street | two_way_stop | 7 | 2 | 0 | 0 |
| 1429 | Claremont Avenue / Claremont Boulevard | two_way_stop | 9 | 0 | 0 | 0 |

## Entry backlog by origin node at end of run (top 10)

| Node | Streets | Trips waiting | Offered veh/h (before scale) |
| --- | --- | --- | --- |
| 666 | Hudson Street / Locksley Avenue | 1 | 19 |
| 943 | Telegraph Avenue / Ward Street | 1 | 1396 |

## Flow on key streets (veh/h per direction, study-area links of 40 m or more)

| Street | Direction of travel | Links | Median flow | Max flow |
| --- | --- | --- | --- | --- |
| Telegraph | N | 12 | 803 | 829 |
| Telegraph | S | 10 | 812 | 918 |
| College | N | 3 | 220 | 221 |
| College | S | 3 | 450 | 450 |
| Claremont | N | 6 | 409 | 682 |
| Claremont | S | 7 | 415 | 856 |
| Alcatraz | E | 6 | 401 | 443 |
| Alcatraz | W | 6 | 300 | 323 |
| Hillegass | N | 4 | 110 | 127 |
| Hillegass | S | 4 | 79 | 88 |
| Colby | N | 7 | 127 | 133 |
| Colby | S | 7 | 158 | 206 |
| Martin | E | 2 | 130 | 130 |
| Martin | W | 2 | 110 | 110 |

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
