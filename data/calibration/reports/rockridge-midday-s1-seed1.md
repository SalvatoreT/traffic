# Calibration report: rockridge midday scale 1 seed 1 (60 min)

Offered demand 15997 veh/h x scale 1 = 15997 veh/h. Run took 17.2 s wall clock. Flow tables use the window after a 10 min warm-up; select-link and health figures cover the whole run from an empty network.

## Stability (design D4)

| Criterion | Threshold | Value | Result |
| --- | --- | --- | --- |
| Gridlock removals | 0 | 0 | pass |
| Backlog / spawned | < 2% | 0.0% (1 of 16119) | pass |
| Arterial mean speed (run) | > 4 m/s | 9.64 m/s (last 15 min 9.68) | pass |

Overall: **STABLE**. Mean trip delay 106 s, mean trip time 365 s, completed 16236, unroutable 0.

| t (min) | vehicles in network | backlog | completed | removals | arterial speed in interval (m/s) |
| --- | --- | --- | --- | --- | --- |
| 5 | 1745 | 0 | 1460 | 0 | 9.60 |
| 10 | 1647 | 1 | 2860 | 0 | 9.54 |
| 15 | 1673 | 0 | 4194 | 0 | 9.59 |
| 20 | 1760 | 2 | 5516 | 0 | 9.67 |
| 25 | 1648 | 1 | 6925 | 0 | 9.63 |
| 30 | 1619 | 2 | 8340 | 0 | 9.91 |
| 35 | 1686 | 0 | 9632 | 0 | 9.85 |
| 40 | 1644 | 0 | 10977 | 0 | 9.51 |
| 45 | 1647 | 0 | 12266 | 0 | 9.37 |
| 50 | 1703 | 1 | 13624 | 0 | 9.76 |
| 55 | 1651 | 2 | 14965 | 0 | 9.67 |
| 60 | 1721 | 1 | 16236 | 0 | 9.62 |
## Wandering (completed car trips)

Detour ratio = distance driven (link and movement lengths) over the shortest network distance from the trip's origin to its destination. Detour against the free-flow route uses the time-shortest route with no congestion and no noise, which is what a purposeful driver without live information would follow (it differs from the shortest distance when a faster, longer road exists). A switch is a change of the remaining route while en route. Loops: the same link twice or the same node three or more times. Reversals: a link followed by its reverse within 200 m. 'Study-area vehicle-miles' are miles driven on links inside the study area; the last column is the share of them driven by trips with a detour ratio above 1.3. Guided drivers re-evaluate their route every epoch; the others keep their departure route unless it is blocked.

| Trips | n | Switches per trip | With a switch | Mean detour | Median detour | Detour > 1.3 | Detour > 2 | Mean detour vs free-flow route | Vs free-flow route > 1.3 | Loops | Reversals | Study veh-miles | Of them by detour > 1.3 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| all trips | 14903 | 0.01 | 0.5% | 1.089 | 1.056 | 3.9% | 0.0% | 1.026 | 1.2% | 0.0% | 5.0% | 1390 | 7.0% |
| gate to gate | 5620 | 0.01 | 1.0% | 1.094 | 1.072 | 2.3% | 0.0% | 1.025 | 0.7% | 0.0% | 8.8% | 308 | 6.0% |
| with a local end | 9283 | 0.00 | 0.2% | 1.086 | 1.049 | 4.8% | 0.0% | 1.026 | 1.5% | 0.0% | 2.8% | 1082 | 7.3% |
| guided drivers | 6859 | 0.01 | 1.1% | 1.089 | 1.054 | 3.7% | 0.0% | 1.025 | 1.2% | 0.0% | 5.2% | 626 | 6.6% |
| other drivers | 8044 | 0.00 | 0.0% | 1.089 | 1.057 | 4.0% | 0.0% | 1.026 | 1.2% | 0.0% | 4.9% | 764 | 7.3% |

## Reported patterns (diagnostics; configured in the targets file under `patterns`)

(a) Trips between the surface gates on the north side of the ramps and the freeway mainline gates, and the local-street (residential and service links in the study area) vehicle-miles they drive. Share = of all completed trips' local-street vehicle-miles (280 miles). No observed counterpart exists for this quantity (the targets file has only the select-link shares above).

| Trips | n trips | Local-street veh-miles | Share of all local-street veh-miles |
| --- | --- | --- | --- |
| surface gates to the freeway | 1040 | 21.3 | 8% |
| freeway to the surface gates | 730 | 20.2 | 7% |

(b) Corridor trips: completed trips from beyond one end of the corridor's study-area extent (the bypass street and its arterial together) to beyond the other end, within a lateral limit of the corridor, by direction. 'Bypass' = at least N blocks (links) on the bypass street; 'arterial' = fewer bypass blocks and at least N on the arterial; 'other' = neither (another street, the freeway or a short use); blocks are counted on the corridor's study-area links. No observed counterpart exists for these shares. The related observed values are in the select-link table above: northbound Hillegass Ave traffic rarely ends on College Ave (6%), 21 to 33% jogs to Benvenue Ave, and southbound freeway-bound drivers on College Ave commonly arrive via Ashby Ave and Benvenue Ave and jog to Hillegass Ave.

| Bypass | Arterial | N | Direction | Corridor trips | Bypass | Arterial | Other | Mean bypass blocks |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue | College Avenue | 3 | N | 904 | 4% | 20% | 77% | 0.2 |
| Hillegass Avenue | College Avenue | 3 | S | 931 | 5% | 24% | 71% | 0.2 |

## Per-mode results

Offered: 15997 car veh/h; 105 bicycle flows (386/h); 2000 pedestrian flows (1582/h). Bicycle and pedestrian volumes are assumptions, not counts.

| Mode | In network | Completed | Mean time (s) | Other |
| --- | --- | --- | --- | --- |
| Car | 1721 | 16236 | 365 | |
| Bicycle | 11 | 404 | 171 | |
| Pedestrian | 220 | 1468 | 445 | mean crossing delay 7.6 s |

Vulnerable road users (surrogate indicators): pedestrian conflicts 209, bicycle conflicts 316, close passes 132, pedestrian injury severity mean 0.045 (AIS4+, 7611 supported of 7611 encounters), cyclist injury severity mean 0.079 (MAIS3+F, 1013 supported of 1765 encounters) (separate endpoints, never summed), mean vehicle speed at pedestrian encounters 2.37 m/s.


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
| SR-24 off-ramp traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | OBSERVED turn count x ASSUMPTION share (131 left turns x 0.40) | 52 (38 to 62) | 35 | below |
| Telegraph Ave and south-side traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | ASSUMPTION: the through left-turners (131 x 0.62 = 81) that are not off-ramp traffic | 29 (19 to 43) | 20 | within |
| SR-24 off-ramp traffic using Colby St to reach College Ave and Berkeley (right at Alcatraz Ave) | OBSERVED turn count x ASSUMPTION share (32 right turns x 0.40) | 13 (9 to 15) | 7 | below |
| Telegraph Ave and south-side traffic using Colby St to reach College Ave and Berkeley | ASSUMPTION: the through right-turners (32 x 0.62 = 20) that are not off-ramp traffic | 7 (5 to 11) | 8 | within |
| Intents listed, together | | 101 (71 to 131) | 70 | |
| Other through cars (no intent listed) | | | 6 | |

Model through cars by origin and destination group (largest 12 of 12 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 35.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Ashby Ave from the west (Emeryville and I-80) | 8.0 | none near the study area |
| Telegraph Ave to the south (downtown Oakland) | Telegraph Ave from the north (Berkeley) | 8.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 7.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 6.0 | Telegraph Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Telegraph Ave from the north (Berkeley) | 4.0 | Telegraph Avenue |
| College Ave from the north (Berkeley) | Alcatraz Ave from the west (Emeryville side) | 3.0 | College Avenue then Alcatraz Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Claremont Ave and Tunnel Rd toward the hills | 1.0 | Telegraph Avenue then Alcatraz Avenue then Claremont Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Shattuck Ave from the north (Berkeley) | 1.0 | Claremont Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 1.0 | Telegraph Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 1.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | College Ave from the north (Berkeley) | 1.0 | SR-24 then Claremont Avenue then College Avenue |

By the arterial these cars would otherwise use: Telegraph Avenue 62 veh/h; none near the study area 8 veh/h; College Avenue then Alcatraz Avenue 3 veh/h; Claremont Avenue 1 veh/h; SR-24 then Claremont Avenue then College Avenue 1 veh/h; Telegraph Avenue then Alcatraz Avenue then Claremont Avenue 1 veh/h.

### Hillegass Avenue NB

Observed (PM): 94 cars entered at the south end, 48 drove the whole street, 109 left it at Alcatraz Ave (43 west, 54 east, 12 straight), and 47% of the block's trips came from a freeway. ASSUMPTION: freeway-origin through cars are 40 veh/h (52 freeway-origin trips times 94 / (94 + 29)), spread over the exits in proportion (0.37); the through share of exits is 48 / 109 = 0.44.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Hillegass Ave to reach Alcatraz Ave west and Telegraph Ave north | OBSERVED turn count x ASSUMPTION share (43 left turns x 0.37) | 16 (9 to 20) | 12 | within |
| SR-24 off-ramp traffic using Hillegass Ave to reach College Ave and Berkeley | OBSERVED turn count x ASSUMPTION share (54 right turns x 0.37) | 20 (11 to 25) | 26 | above |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach Alcatraz Ave west | ASSUMPTION: through exits (43 x 0.44) that are not off-ramp traffic | 3 (0 to 10) | 3 | within |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach College Ave and Berkeley | ASSUMPTION: through exits (54 x 0.44) that are not off-ramp traffic | 4 (0 to 13) | 10 | within |
| Intents listed, together | | 43 (20 to 68) | 51 | |
| Other through cars (no intent listed) | | | 6 | |

Model through cars by origin and destination group (largest 12 of 18 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 16.0 | SR-24 |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 10.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 6.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 5.0 | SR-24 then Claremont Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | College Ave from the north (Berkeley) | 4.0 | SR-24 then Claremont Avenue then College Avenue |
| College Ave from the north (Berkeley) | Alcatraz Ave from the west (Emeryville side) | 2.0 | College Avenue then Alcatraz Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 2.0 | Telegraph Avenue |
| Telegraph Ave to the south (downtown Oakland) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 2.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Emeryville and West Oakland streets (55th to 67th Streets) | 1.0 | College Avenue then Alcatraz Avenue |
| San Pablo Ave (Emeryville and West Oakland) | Claremont Ave and Tunnel Rd toward the hills | 1.0 | Alcatraz Avenue then Claremont Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Ashby Ave from the west (Emeryville and I-80) | 1.0 | none near the study area |
| West Oakland to the southwest (Adeline St, Market St) | Claremont Ave and Tunnel Rd toward the hills | 1.0 | Claremont Avenue |
| other pairs | | 6.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 20 veh/h; SR-24 17 veh/h; SR-24 then Claremont Avenue 5 veh/h; SR-24 then Claremont Avenue then College Avenue 4 veh/h; College Avenue then Alcatraz Avenue 3 veh/h; Claremont Avenue 2 veh/h.

### Hillegass Avenue SB

Observed (PM): 178 cars entered at the top (76 turned in from Alcatraz Ave west, 98 from the east, 4 came straight from the north), 79 drove the whole street, and 68% of the block's trips (109 veh/h) went to a freeway. ASSUMPTION: freeway-bound cars that did not join mid-street are 87 veh/h (109 x 178 / (178 + 44)), half of the 174 turn-ins; low = the whole-street share of the turn-ins (0.45), high = the freeway-bound share without the mid-street correction (0.63).

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Telegraph Ave, Alcatraz Ave west and West Berkeley traffic turning off Alcatraz Ave onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (76 turn-ins x 0.50) | 38 (34 to 48) | 26 | below |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (98 turn-ins x 0.50) | 49 (44 to 62) | 33 | below |
| Intents listed, together | | 87 (78 to 110) | 59 | |
| Other through cars (no intent listed) | | | 16 | |

Model through cars by origin and destination group (largest 12 of 10 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 26.0 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 16.0 | Claremont Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 12.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 8.0 | Claremont Avenue then SR-24 |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 8.0 | College Avenue then Claremont Avenue then SR-24 |
| Ashby Ave from the west (Emeryville and I-80) | Berkeley hills to the northeast (Evergreen Ln, Gravatt Dr) | 1.0 | SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 1.0 | Claremont Avenue |
| Claremont Ave and Tunnel Rd toward the hills | West Oakland to the southwest (Adeline St, Market St) | 1.0 | Claremont Avenue |
| Shattuck Ave from the north (Berkeley) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 1.0 | College Avenue |
| Emeryville and West Oakland streets (55th to 67th Streets) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 1.0 | Alcatraz Avenue then Claremont Avenue |

By the arterial these cars would otherwise use: Telegraph Avenue 38 veh/h; Claremont Avenue then SR-24 24 veh/h; College Avenue then Claremont Avenue then SR-24 8 veh/h; Claremont Avenue 2 veh/h; Alcatraz Avenue then Claremont Avenue 1 veh/h; College Avenue 1 veh/h.

### Colby Street SB

Observed (PM): 139 cars entered at the top (76 from Alcatraz Ave west, 50 from the east, 13 from the north), 39 drove the whole street, 45% of the block's trips (72 veh/h) went to a freeway and 22% came by way of Telegraph Ave. ASSUMPTION: freeway-bound cars that did not join mid-street are 46 veh/h (72 x 139 / (139 + 79)), 0.365 of the 126 turn-ins; low = the whole-street share (0.31), high = the unadjusted freeway share (0.57). The Telegraph Ave cars are the 22% x 160 = 35 of the 76 west turn-ins.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Southbound Telegraph Ave traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (35 Telegraph Ave cars x 0.365) | 13 (11 to 20) | 12 | within |
| Alcatraz Ave west, Ashby Ave and West Berkeley traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (41 other west turn-ins x 0.365) | 15 (13 to 23) | 5 | below |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (50 east turn-ins x 0.365) | 18 (15 to 29) | 21 | within |
| Intents listed, together | | 46 (39 to 72) | 38 | |
| Other through cars (no intent listed) | | | 41 | |

Model through cars by origin and destination group (largest 12 of 22 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 24.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 11.0 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 11.0 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 6.0 | Claremont Avenue then SR-24 |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 4.0 | College Avenue then Claremont Avenue then SR-24 |
| Berkeley hills to the northeast (Evergreen Ln, Gravatt Dr) | West Oakland to the southwest (Adeline St, Market St) | 3.0 | Claremont Avenue |
| Ashby Ave from the west (Emeryville and I-80) | Berkeley hills to the northeast (Evergreen Ln, Gravatt Dr) | 2.0 | SR-24 |
| Ashby Ave from the west (Emeryville and I-80) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 2.0 | SR-24 |
| Telegraph Ave from the north (Berkeley) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 2.0 | Telegraph Avenue |
| Emeryville and West Oakland streets (55th to 67th Streets) | Claremont Ave and Tunnel Rd toward the hills | 2.0 | Alcatraz Avenue then Claremont Avenue |
| Alcatraz Ave from the west (Emeryville side) | SR-13 Warren Freeway (via SR-24 east) | 1.0 | SR-24 |
| Ashby Ave from the west (Emeryville and I-80) | SR-13 Warren Freeway (via SR-24 east) | 1.0 | SR-24 |
| other pairs | | 10.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 48 veh/h; Claremont Avenue 7 veh/h; Claremont Avenue then SR-24 6 veh/h; SR-24 6 veh/h; College Avenue then Claremont Avenue then SR-24 4 veh/h; Alcatraz Avenue then Claremont Avenue 2 veh/h.

### Study area, all residential and service streets

Model: 409 through cars per hour.

Model through cars by origin and destination group (largest 12 of 58 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 58.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 47.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 45.0 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 33.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 23.0 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 20.0 | Claremont Avenue then SR-24 |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 19.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 16.0 | SR-24 |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Ashby Ave from the west (Emeryville and I-80) | 12.0 | none near the study area |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 10.0 | College Avenue then Claremont Avenue then SR-24 |
| Emeryville and West Oakland streets (55th to 67th Streets) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 10.0 | Claremont Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Claremont Ave and Tunnel Rd toward the hills | 9.0 | Telegraph Avenue then Alcatraz Avenue then Claremont Avenue |
| other pairs | | 107.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 258 veh/h; SR-24 28 veh/h; Claremont Avenue 24 veh/h; Claremont Avenue then SR-24 20 veh/h; none near the study area 16 veh/h; Alcatraz Avenue then Claremont Avenue 11 veh/h.

By origin group: Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 120; SR-24 eastbound off-ramps (arriving from Oakland and I-980) 90; South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 39; Telegraph Ave from the north (Berkeley) 39; Claremont Ave and Tunnel Rd toward the hills 25; Telegraph Ave to the south (downtown Oakland) 19; Emeryville and West Oakland streets (55th to 67th Streets) 19; College Ave from the north (Berkeley) 17; West Oakland to the southwest (Adeline St, Market St) 12; San Pablo Ave (Emeryville and West Oakland) 8.

By destination group: SR-24 westbound on-ramps (toward Oakland and I-980) 119; South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 78; Telegraph Ave from the north (Berkeley) 63; Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 51; Claremont Ave and Tunnel Rd toward the hills 37; Ashby Ave from the west (Emeryville and I-80) 13; College Ave from the north (Berkeley) 12; West Oakland to the southwest (Adeline St, Market St) 7; Alcatraz Ave from the west (Emeryville side) 6; San Pablo Ave (Emeryville and West Oakland) 6.


## Through cars by intent (cut-through intent view)

A through car is tallied once, under the first intent that fits it (the on-ramp on its planned route, the off-ramp it has driven, or the origin and destination groups of its trip), at the moment the through count counts it. Cars an hour over the run, the same window as the through-car figure (414 an hour).

| Intent | Basis | Cars an hour | Share |
| --- | --- | --- | --- |
| on-2853241697 | observed | 121 | 29% |
| Other on-ramps | assumed | 7 | 2% |
| off-52990846 | observed | 90 | 22% |
| Other off-ramps | assumed | 9 | 2% |
| Downtown, south and west Oakland traffic using side streets to reach Berkeley and Telegraph Ave north | assumed | 43 | 10% |
| Berkeley and Telegraph Ave north traffic using side streets to reach downtown, south and west Oakland | assumed | 71 | 17% |
| Oakland cross-town traffic (West Oakland, Broadway, Piedmont, Emeryville) using side streets near Claremont Ave and Telegraph Ave | assumed | 19 | 5% |
| Other (no intent listed) |  | 54 | 13% |

Intents listed cover 87% of through cars.


## Select-link shares: modeled vs observed (design D5: headline = freeway shares, tolerance +/-10 pp)

- Hillegass Avenue NB: 4 links (path Claremont Avenue -> Alcatraz Avenue (434 m)), 137 trips (125 completed)
- Colby Street NB: 8 links (path Claremont Avenue -> Alcatraz Avenue (680 m)), 190 trips (175 completed)
- Hillegass Avenue SB: 4 links (path Alcatraz Avenue -> Claremont Avenue (433 m)), 140 trips (131 completed)
- Colby Street SB: 8 links (path Alcatraz Avenue -> Claremont Avenue (680 m)), 157 trips (144 completed)

| Block | Side | Via | Observed | Modeled | Diff (pp) | n trips | Headline |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue NB | from | freeway | 47% | 54% | +7 | 137 | within |
| Hillegass Avenue NB | to | Benvenue Avenue | 21% (PM 33%) | 1% | -20 | 137 |  |
| Hillegass Avenue NB | to | College Avenue | 6% | 7% | +1 | 137 |  |
| Hillegass Avenue NB | to | Alcatraz Avenue WB | 27% | 33% | +6 | 137 |  |
| Colby Street NB | from | freeway | 47% | 36% | -11 | 190 | OUTSIDE |
| Colby Street NB | to | Alcatraz Avenue WB | 48% | 51% | +3 | 190 |  |
| Colby Street NB | to | Telegraph Avenue | 25% | 34% | +9 | 190 |  |
| Colby Street NB | to | College Avenue | 3% | 6% | +3 | 190 |  |
| Hillegass Avenue SB | from | Alcatraz Avenue WB | 46% | 24% | -22 | 140 |  |
| Hillegass Avenue SB | from | Benvenue Avenue | 26% | 2% | -24 | 140 |  |
| Hillegass Avenue SB | from | College Avenue | 16% | 10% | -6 | 140 |  |
| Hillegass Avenue SB | to | freeway | 57% (PM 68%) | 56% | -1 | 140 | within |
| Colby Street SB | from | Alcatraz Avenue EB | 43% | 19% | -24 | 157 |  |
| Colby Street SB | from | Alcatraz Avenue WB | 46% | 15% | -31 | 157 |  |
| Colby Street SB | from | Telegraph Avenue | 22% | 18% | -4 | 157 |  |
| Colby Street SB | to | freeway | 45% | 41% | -4 | 157 | within |
| Colby Street SB | to | Forest Street | 34% | 15% | -19 | 157 |  |

Headline shares within tolerance: 3 of 4. Observed column uses the PM-peak share where one is given and the period is pm_peak. 'Via' shares are the fraction of select-link trips using that street before (from) or after (to) the block; freeway = origin / destination gate with a motorway-class link attached.

## Claremont ramps: streets used before the on-ramp / after the off-ramp

Observed shares are for traffic from/to the north only. 'Modeled' is over all trips on the ramps and any visit to the street (an upper bound for streets that serve both sides). 'Modeled, side' counts only trips whose surface end lies on the side of the ramp stated in the targets file (`freewayRamp.side`), and for a street with a qualifier ("north of X") only its links on that side of X.

| Direction | Via | Observed | Modeled | n ramp trips | Modeled, side | n side trips |
| --- | --- | --- | --- | --- | --- | --- |
| onto freeway | College Avenue | 16% | 16% | 480 | 18% | 421 |
| onto freeway | Hillegass Avenue | 12% | 16% | 480 | 18% | 421 |
| onto freeway | Martin Street | 10% | 19% | 480 | 19% | 421 |
| onto freeway | Colby Street | 8% | 10% | 480 | 11% | 421 |
| onto freeway | Telegraph Avenue north of Alcatraz Avenue | 8% | 14% | 480 | 9% | 421 |
| onto freeway | Benvenue Avenue | 5% | 4% | 480 | 5% | 421 |
| from freeway | College Avenue | 10% | 10% | 487 | 10% | 481 |
| from freeway | Martin Street | 10% | 11% | 487 | 11% | 481 |
| from freeway | Colby Street | 8% | 10% | 487 | 10% | 481 |
| from freeway | Hillegass Avenue | 5% | 9% | 487 | 9% | 481 |
| from freeway | Benvenue Avenue | 3% | 3% | 487 | 3% | 481 |

## Top 15 links by delay

| Link | Street | Class | Lanes | Len (m) | End node control | Delay (veh-h) | Stopped (veh-h) | Mean stopped veh | Flow (veh/h) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 4143 | Adeline Street | Secondary | 3 | 185 | signal | 9.33 | 6.84 | 6.8 | 542 |
| 1122 | Alcatraz Avenue | Tertiary | 1 | 299 | signal | 5.50 | 3.82 | 3.8 | 349 |
| 1051 | Adeline Street | Secondary | 4 | 50 | signal | 5.41 | 4.57 | 4.6 | 643 |
| 1037 | Sacramento Street | Tertiary | 3 | 40 | signal | 5.13 | 4.36 | 4.4 | 892 |
| 1111 | Market Street | Tertiary | 3 | 31 | signal | 4.67 | 4.17 | 4.2 | 367 |
| 1108 | Market Street | Secondary | 4 | 36 | signal | 4.46 | 3.73 | 3.7 | 672 |
| 769 | Martin Luther King Junior Way | Secondary | 3 | 112 | signal | 3.65 | 2.43 | 2.4 | 960 |
| 498 | Sacramento Street | Tertiary | 3 | 48 | signal | 3.64 | 2.98 | 3.0 | 485 |
| 1662 | 52nd Street | Secondary | 4 | 53 | signal | 3.51 | 2.49 | 2.5 | 917 |
| 2005 | Shattuck Avenue | Tertiary | 1 | 92 | signal | 3.49 | 2.48 | 2.5 | 540 |
| 1630 | Telegraph Avenue | Secondary | 3 | 36 | signal | 3.44 | 2.97 | 3.0 | 427 |
| 1025 | Martin Luther King Junior Way | Secondary | 3 | 79 | signal | 3.41 | 2.71 | 2.7 | 442 |
| 460 | Sacramento Street | Tertiary | 2 | 104 | two_way_stop | 3.08 | 2.40 | 2.4 | 492 |
| 1666 | 52nd Street | Secondary | 4 | 39 | signal | 2.95 | 2.63 | 2.6 | 371 |
| 1036 | Sacramento Street | Tertiary | 3 | 43 | signal | 2.93 | 2.30 | 2.3 | 708 |

## Top 15 nodes by blocked time

Blocked time = lane-head seconds waiting at the stop line without permission (signal red, conflict, stop sign or no downstream space).

| Node | Streets | Control | Gate | Blocked (lane-h) | of which no downstream space | Signal plan at end (cycle: greens) |
| --- | --- | --- | --- | --- | --- | --- |
| 680 | 52nd Street / Shattuck Avenue | signal |  | 4.11 | 0.03 | 110 s: 30/28/38 |
| 446 | Market Street / Stanford Avenue | signal |  | 3.97 | 0.12 | 75 s: 50/15 |
| 447 | Adeline Street / Alcatraz Avenue | signal |  | 3.92 | 0.04 | 75 s: 16/49 |
| 185 | Alcatraz Avenue / Sacramento Street | signal |  | 2.87 | 0.03 | 75 s: 35/30 |
| 30 | 57th Street / Adeline Street / Market Street | signal |  | 2.73 | 0.02 | 75 s: 20/25/15 |
| 479 | Adeline Street / Martin Luther King Junior Way / Stanford Avenue | signal |  | 2.63 | 0.02 | 75 s: 15/50 |
| 1080 | 62nd Street / Claremont Avenue / College Avenue | signal |  | 2.53 | 0.02 | 75 s: 17/28/15 |
| 37 | San Pablo Avenue / Stanford Avenue | signal |  | 2.52 | 0.01 | 75 s: 24/41 |
| 944 | Ashby Avenue / Shattuck Avenue | signal |  | 2.31 | 0.01 | 75 s: 29/36 |
| 1069 | Claremont Avenue / Colby Street / Forest Street | signal |  | 2.24 | 0.00 | 147 s: 103/10/19 |
| 501 | Alcatraz Avenue / Shattuck Avenue | signal |  | 2.15 | 0.05 | 75 s: 25/40 |
| 242 | Ashby Avenue / Martin Luther King Junior Way | signal |  | 2.13 | 0.00 | 75 s: 35/30 |
| 331 | 52nd Street / Martin Luther King Junior Way | signal |  | 2.13 | 0.01 | 75 s: 38/27 |
| 851 | Alcatraz Avenue / Telegraph Avenue | signal |  | 2.11 | 0.02 | 75 s: 38/27 |
| 1406 | Ashby Avenue / Claremont Avenue | signal |  | 2.02 | 0.02 | 75 s: 50/15 |

Phases of the five most blocked signals (green s: approach links with their lanes, link ids in brackets):

- node 680: 30 s: 52nd Street 4L [1662]; 28 s: 52nd Street 4L [1666], 52nd Street 4L [1662]; 38 s: Shattuck Avenue 2L [1653], Shattuck Avenue 2L [1705]
- node 446: 50 s: Stanford Avenue 1L [941], Stanford Avenue 3L [1055]; 15 s: Market Street 4L [1108], Market Street 3L [1111]
- node 447: 16 s: Adeline Street 4L [1049], Adeline Street 4L [1051]; 49 s: Alcatraz Avenue 2L [1048], Alcatraz Avenue 2L [1133]
- node 185: 35 s: Alcatraz Avenue 1L [363], Alcatraz Avenue 1L [1162]; 30 s: Sacramento Street 3L [1036], Sacramento Street 3L [1037]
- node 30: 20 s: Adeline Street 1L [747], Adeline Street 1L [1030]; 25 s: Market Street 2L [755], Market Street 2L [1113]; 15 s: 57th Street 1L [44], 57th Street 1L [1151]

## Junction recovery

Policy `physical`. Node entries by cars and cyclists in the run: 519602 (settle interval 0). An admission is an entry the ordinary rule would have refused; head-seconds count the time a waiting head vehicle had the reason invoked, and the part of it in which it still could not enter. Courtesy and the yield fallback change priority only; under `physical` the conflict bypass never admits.

| Reason | Admissions per hour | Per 1,000 entries | Head-s invoked | Head-s blocked |
| --- | --- | --- | --- | --- |
| courtesy | 52.0 | 0.100 | 142 | 124 |
| yield fallback | 10.0 | 0.019 | 2 | 0 |
| conflict bypass | 0.0 | 0.000 | 2 | 2 |

Vehicles removed while held in a node by a full exit: 0 (0.0 per hour, included in the gridlock removals).

| Node | Streets | Control | Courtesy | Yield fallback | Conflict bypass | Held removals |
| --- | --- | --- | --- | --- | --- | --- |
| 479 | Adeline Street / Martin Luther King Junior Way / Stanford Avenue | signal | 6 | 0 | 0 | 0 |
| 1069 | Claremont Avenue / Colby Street / Forest Street | signal | 6 | 0 | 0 | 0 |
| 338 | 55th Street / Shattuck Avenue | signal | 5 | 0 | 0 | 0 |
| 165 | Alcatraz Avenue / Baker Street | two_way_stop | 3 | 1 | 0 | 0 |
| 342 | 56th Street / Shattuck Avenue | two_way_stop | 2 | 2 | 0 | 0 |
| 430 | Alcatraz Avenue / King Street | two_way_stop | 2 | 2 | 0 | 0 |
| 457 | Alcatraz Avenue / California Street | two_way_stop | 3 | 1 | 0 | 0 |
| 1080 | 62nd Street / Claremont Avenue / College Avenue | signal | 4 | 0 | 0 | 0 |
| 1220 | Ashby Avenue / College Avenue | signal | 3 | 0 | 0 | 0 |
| 460 | Alcatraz Avenue / Ellis Street | two_way_stop | 1 | 1 | 0 | 0 |

## Entry backlog by origin node at end of run (top 10)

| Node | Streets | Trips waiting | Offered veh/h (before scale) |
| --- | --- | --- | --- |
| 918 | Dana Street | 1 | 39 |

## Flow on key streets (veh/h per direction, study-area links of 40 m or more)

| Street | Direction of travel | Links | Median flow | Max flow |
| --- | --- | --- | --- | --- |
| Telegraph | N | 12 | 545 | 557 |
| Telegraph | S | 10 | 406 | 418 |
| College | N | 3 | 286 | 286 |
| College | S | 3 | 438 | 439 |
| Claremont | N | 6 | 305 | 458 |
| Claremont | S | 7 | 253 | 476 |
| Alcatraz | E | 6 | 343 | 354 |
| Alcatraz | W | 6 | 263 | 298 |
| Hillegass | N | 4 | 80 | 90 |
| Hillegass | S | 4 | 97 | 103 |
| Colby | N | 7 | 101 | 115 |
| Colby | S | 7 | 96 | 115 |
| Martin | E | 2 | 120 | 120 |
| Martin | W | 2 | 64 | 64 |

## Largest demand origins (offered, before scale)

| Node | Streets | Veh/h |
| --- | --- | --- |
| 602 | Grove Shafter Freeway | 2564 |
| 265 | Ashby Avenue | 781 |
| 943 | Telegraph Avenue / Ward Street | 777 |
| 1672 | Warren Freeway | 719 |
| 183 | San Pablo Avenue | 706 |
| 974 | Broadway | 435 |
| 763 | Telegraph Avenue | 355 |
| 184 | Alcatraz Avenue | 349 |
| 275 | Market Street | 295 |
| 104 | San Pablo Avenue | 291 |
