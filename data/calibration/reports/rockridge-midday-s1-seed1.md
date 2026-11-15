# Calibration report: rockridge midday scale 1 seed 1 (60 min)

Offered demand 15758 veh/h x scale 1 = 15758 veh/h. Run took 18.4 s wall clock. Flow tables use the window after a 10 min warm-up; select-link and health figures cover the whole run from an empty network.

## Stability (design D4)

| Criterion | Threshold | Value | Result |
| --- | --- | --- | --- |
| Gridlock removals | 0 | 0 | pass |
| Backlog / spawned | < 2% | 0.0% (2 of 16017) | pass |
| Arterial mean speed (run) | > 4 m/s | 10.12 m/s (last 15 min 10.09) | pass |

Overall: **STABLE**. Mean trip delay 67 s, mean trip time 359 s, completed 16195, unroutable 0.

| t (min) | vehicles in network | backlog | completed | removals | arterial speed in interval (m/s) |
| --- | --- | --- | --- | --- | --- |
| 5 | 1639 | 3 | 1477 | 0 | 10.08 |
| 10 | 1622 | 0 | 2842 | 0 | 10.06 |
| 15 | 1613 | 1 | 4173 | 0 | 10.12 |
| 20 | 1661 | 0 | 5494 | 0 | 10.29 |
| 25 | 1656 | 2 | 6835 | 0 | 10.05 |
| 30 | 1665 | 1 | 8188 | 0 | 10.30 |
| 35 | 1604 | 0 | 9555 | 0 | 10.13 |
| 40 | 1668 | 1 | 10877 | 0 | 10.11 |
| 45 | 1659 | 0 | 12222 | 0 | 10.08 |
| 50 | 1621 | 2 | 13571 | 0 | 10.06 |
| 55 | 1629 | 1 | 14937 | 0 | 10.12 |
| 60 | 1633 | 2 | 16195 | 0 | 10.09 |
## Wandering (completed car trips)

Detour ratio = distance driven (link and movement lengths) over the shortest network distance from the trip's origin to its destination. Detour against the free-flow route uses the time-shortest route with no congestion and no noise, which is what a purposeful driver without live information would follow (it differs from the shortest distance when a faster, longer road exists). A switch is a change of the remaining route while en route. Loops: the same link twice or the same node three or more times. Reversals: a link followed by its reverse within 200 m. 'Study-area vehicle-miles' are miles driven on links inside the study area; the last column is the share of them driven by trips with a detour ratio above 1.3. Guided drivers re-evaluate their route every epoch; the others keep their departure route unless it is blocked.

| Trips | n | Switches per trip | With a switch | Mean detour | Median detour | Detour > 1.3 | Detour > 2 | Mean detour vs free-flow route | Vs free-flow route > 1.3 | Loops | Reversals | Study veh-miles | Of them by detour > 1.3 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| all trips | 14928 | 0.00 | 0.1% | 1.087 | 1.054 | 3.8% | 0.0% | 1.023 | 1.0% | 0.0% | 5.0% | 1426 | 7.2% |
| gate to gate | 5710 | 0.00 | 0.0% | 1.087 | 1.064 | 2.0% | 0.0% | 1.021 | 0.3% | 0.0% | 6.9% | 364 | 6.3% |
| with a local end | 9218 | 0.00 | 0.1% | 1.087 | 1.050 | 4.9% | 0.0% | 1.025 | 1.4% | 0.0% | 3.9% | 1062 | 7.5% |
| guided drivers | 6905 | 0.00 | 0.1% | 1.087 | 1.054 | 3.8% | 0.0% | 1.023 | 0.9% | 0.0% | 4.9% | 640 | 7.5% |
| other drivers | 8023 | 0.00 | 0.0% | 1.087 | 1.054 | 3.9% | 0.0% | 1.023 | 1.1% | 0.0% | 5.1% | 787 | 6.9% |

## Reported patterns (diagnostics; configured in the targets file under `patterns`)

(a) Trips between the surface gates on the north side of the ramps and the freeway mainline gates, and the local-street (residential and service links in the study area) vehicle-miles they drive. Share = of all completed trips' local-street vehicle-miles (250 miles). No observed counterpart exists for this quantity (the targets file has only the select-link shares above).

| Trips | n trips | Local-street veh-miles | Share of all local-street veh-miles |
| --- | --- | --- | --- |
| surface gates to the freeway | 1092 | 27.1 | 11% |
| freeway to the surface gates | 720 | 30.4 | 12% |

(b) Corridor trips: completed trips from beyond one end of the corridor's study-area extent (the bypass street and its arterial together) to beyond the other end, within a lateral limit of the corridor, by direction. 'Bypass' = at least N blocks (links) on the bypass street; 'arterial' = fewer bypass blocks and at least N on the arterial; 'other' = neither (another street, the freeway or a short use); blocks are counted on the corridor's study-area links. No observed counterpart exists for these shares. The related observed values are in the select-link table above: northbound Hillegass Ave traffic rarely ends on College Ave (6%), 21 to 33% jogs to Benvenue Ave, and southbound freeway-bound drivers on College Ave commonly arrive via Ashby Ave and Benvenue Ave and jog to Hillegass Ave.

| Bypass | Arterial | N | Direction | Corridor trips | Bypass | Arterial | Other | Mean bypass blocks |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue | College Avenue | 3 | N | 954 | 3% | 13% | 84% | 0.1 |
| Hillegass Avenue | College Avenue | 3 | S | 1008 | 4% | 21% | 76% | 0.2 |

## Per-mode results

Offered: 15758 car veh/h; 105 bicycle flows (386/h); 2000 pedestrian flows (1582/h). Bicycle and pedestrian volumes are assumptions, not counts.

| Mode | In network | Completed | Mean time (s) | Other |
| --- | --- | --- | --- | --- |
| Car | 1633 | 16195 | 359 | |
| Bicycle | 17 | 370 | 164 | |
| Pedestrian | 191 | 1501 | 445 | mean crossing delay 7.1 s |

Vulnerable road users (surrogate indicators): pedestrian conflicts 241, bicycle conflicts 126, close passes 169, pedestrian injury-risk index 0.046, bicycle injury-risk index 0.072 (proxy), mean vehicle speed at pedestrian encounters 2.44 m/s.


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
| SR-24 off-ramp traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | OBSERVED turn count x ASSUMPTION share (131 left turns x 0.40) | 52 (38 to 62) | 48 | within |
| Telegraph Ave and south-side traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | ASSUMPTION: the through left-turners (131 x 0.62 = 81) that are not off-ramp traffic | 29 (19 to 43) | 22 | within |
| SR-24 off-ramp traffic using Colby St to reach College Ave and Berkeley (right at Alcatraz Ave) | OBSERVED turn count x ASSUMPTION share (32 right turns x 0.40) | 13 (9 to 15) | 15 | within |
| Telegraph Ave and south-side traffic using Colby St to reach College Ave and Berkeley | ASSUMPTION: the through right-turners (32 x 0.62 = 20) that are not off-ramp traffic | 7 (5 to 11) | 8 | within |
| Intents listed, together | | 101 (71 to 131) | 93 | |
| Other through cars (no intent listed) | | | 5 | |

Model through cars by origin and destination group (largest 12 of 17 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 48.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 8.0 | SR-24 |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 6.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Ashby Ave from the west (Emeryville and I-80) | 5.0 | none near the study area |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 5.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Alcatraz Ave from the west (Emeryville side) | 4.0 | Claremont Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) | 4.0 | Claremont Avenue then College Avenue then Alcatraz Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Emeryville and West Oakland streets (55th to 67th Streets) | 4.0 | none near the study area |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Shattuck Ave from the north (Berkeley) | 3.0 | Claremont Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Claremont Ave and Tunnel Rd toward the hills | 3.0 | Claremont Avenue |
| Telegraph Ave to the south (downtown Oakland) | Telegraph Ave from the north (Berkeley) | 2.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 1.0 | Telegraph Avenue |
| other pairs | | 5.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 62 veh/h; Claremont Avenue 10 veh/h; none near the study area 9 veh/h; SR-24 8 veh/h; Claremont Avenue then College Avenue then Alcatraz Avenue 4 veh/h; College Avenue then Alcatraz Avenue 2 veh/h.

### Hillegass Avenue NB

Observed (PM): 94 cars entered at the south end, 48 drove the whole street, 109 left it at Alcatraz Ave (43 west, 54 east, 12 straight), and 47% of the block's trips came from a freeway. ASSUMPTION: freeway-origin through cars are 40 veh/h (52 freeway-origin trips times 94 / (94 + 29)), spread over the exits in proportion (0.37); the through share of exits is 48 / 109 = 0.44.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Hillegass Ave to reach Alcatraz Ave west and Telegraph Ave north | OBSERVED turn count x ASSUMPTION share (43 left turns x 0.37) | 16 (9 to 20) | 16 | within |
| SR-24 off-ramp traffic using Hillegass Ave to reach College Ave and Berkeley | OBSERVED turn count x ASSUMPTION share (54 right turns x 0.37) | 20 (11 to 25) | 25 | within |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach Alcatraz Ave west | ASSUMPTION: through exits (43 x 0.44) that are not off-ramp traffic | 3 (0 to 10) | 2 | within |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach College Ave and Berkeley | ASSUMPTION: through exits (54 x 0.44) that are not off-ramp traffic | 4 (0 to 13) | 6 | within |
| Intents listed, together | | 43 (20 to 68) | 49 | |
| Other through cars (no intent listed) | | | 7 | |

Model through cars by origin and destination group (largest 12 of 13 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 13.0 | SR-24 |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 11.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 10.0 | Telegraph Avenue |
| SR-13 Warren Freeway (via SR-24 east) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 5.0 | Claremont Avenue then Alcatraz Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Telegraph Ave from the north (Berkeley) | 4.0 | none near the study area |
| College Ave from the north (Berkeley) | San Pablo Ave (Emeryville and West Oakland) | 2.0 | College Avenue then Alcatraz Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 2.0 | Telegraph Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Claremont Ave and Tunnel Rd toward the hills | 2.0 | Claremont Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | College Ave from the north (Berkeley) | 2.0 | SR-24 then Claremont Avenue then College Avenue |
| Telegraph Ave to the south (downtown Oakland) | Claremont Ave and Tunnel Rd toward the hills | 2.0 | Claremont Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Alcatraz Ave from the west (Emeryville side) | 1.0 | none near the study area |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Emeryville and West Oakland streets (55th to 67th Streets) | 1.0 | none near the study area |
| other pairs | | 1.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 23 veh/h; SR-24 14 veh/h; none near the study area 6 veh/h; Claremont Avenue then Alcatraz Avenue 5 veh/h; Claremont Avenue 4 veh/h; College Avenue then Alcatraz Avenue 2 veh/h.

### Hillegass Avenue SB

Observed (PM): 178 cars entered at the top (76 turned in from Alcatraz Ave west, 98 from the east, 4 came straight from the north), 79 drove the whole street, and 68% of the block's trips (109 veh/h) went to a freeway. ASSUMPTION: freeway-bound cars that did not join mid-street are 87 veh/h (109 x 178 / (178 + 44)), half of the 174 turn-ins; low = the whole-street share of the turn-ins (0.45), high = the freeway-bound share without the mid-street correction (0.63).

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Telegraph Ave, Alcatraz Ave west and West Berkeley traffic turning off Alcatraz Ave onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (76 turn-ins x 0.50) | 38 (34 to 48) | 23 | below |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (98 turn-ins x 0.50) | 49 (44 to 62) | 27 | below |
| Intents listed, together | | 87 (78 to 110) | 50 | |
| Other through cars (no intent listed) | | | 10 | |

Model through cars by origin and destination group (largest 12 of 10 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 23.0 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 12.0 | Claremont Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 9.0 | Claremont Avenue then SR-24 |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 6.0 | College Avenue then Claremont Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 5.0 | Telegraph Avenue |
| Alcatraz Ave from the west (Emeryville side) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 1.0 | Alcatraz Avenue then College Avenue |
| Alcatraz Ave from the west (Emeryville side) | Berkeley hills to the northeast (Evergreen Ln, Gravatt Dr) | 1.0 | SR-24 |
| Ashby Ave from the west (Emeryville and I-80) | College Ave from the north (Berkeley) | 1.0 | Alcatraz Avenue then College Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 1.0 | Alcatraz Avenue then Claremont Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Telegraph Ave to the south (downtown Oakland) | 1.0 | Claremont Avenue |

By the arterial these cars would otherwise use: Telegraph Avenue 28 veh/h; Claremont Avenue then SR-24 21 veh/h; College Avenue then Claremont Avenue then SR-24 6 veh/h; Alcatraz Avenue then College Avenue 2 veh/h; Alcatraz Avenue then Claremont Avenue 1 veh/h; Claremont Avenue 1 veh/h.

### Colby Street SB

Observed (PM): 139 cars entered at the top (76 from Alcatraz Ave west, 50 from the east, 13 from the north), 39 drove the whole street, 45% of the block's trips (72 veh/h) went to a freeway and 22% came by way of Telegraph Ave. ASSUMPTION: freeway-bound cars that did not join mid-street are 46 veh/h (72 x 139 / (139 + 79)), 0.365 of the 126 turn-ins; low = the whole-street share (0.31), high = the unadjusted freeway share (0.57). The Telegraph Ave cars are the 22% x 160 = 35 of the 76 west turn-ins.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Southbound Telegraph Ave traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (35 Telegraph Ave cars x 0.365) | 13 (11 to 20) | 18 | within |
| Alcatraz Ave west, Ashby Ave and West Berkeley traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (41 other west turn-ins x 0.365) | 15 (13 to 23) | 6 | below |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (50 east turn-ins x 0.365) | 18 (15 to 29) | 35 | above |
| Intents listed, together | | 46 (39 to 72) | 59 | |
| Other through cars (no intent listed) | | | 26 | |

Model through cars by origin and destination group (largest 12 of 19 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 18.0 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 16.0 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 11.0 | Claremont Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 9.0 | Telegraph Avenue |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 6.0 | College Avenue then Claremont Avenue then SR-24 |
| Alcatraz Ave from the west (Emeryville side) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 4.0 | Alcatraz Avenue then College Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Telegraph Ave to the south (downtown Oakland) | 4.0 | Claremont Avenue |
| Shattuck Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 3.0 | none near the study area |
| Ashby Ave from the west (Emeryville and I-80) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 2.0 | SR-24 |
| Telegraph Ave from the north (Berkeley) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 2.0 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 2.0 | none near the study area |
| Alcatraz Ave from the west (Emeryville side) | Berkeley hills to the northeast (Evergreen Ln, Gravatt Dr) | 1.0 | SR-24 |
| other pairs | | 7.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 45 veh/h; Claremont Avenue then SR-24 11 veh/h; College Avenue then Claremont Avenue then SR-24 6 veh/h; Alcatraz Avenue then College Avenue 5 veh/h; Claremont Avenue 5 veh/h; none near the study area 5 veh/h.

### Study area, all residential and service streets

Model: 372 through cars per hour.

Model through cars by origin and destination group (largest 12 of 50 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 58.0 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 35.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 34.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 26.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 21.0 | SR-24 |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 20.0 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 18.0 | Claremont Avenue then SR-24 |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 17.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) | 16.0 | Claremont Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Alcatraz Ave from the west (Emeryville side) | 12.0 | Claremont Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Claremont Ave and Tunnel Rd toward the hills | 9.0 | Claremont Avenue |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 8.0 | College Avenue then Claremont Avenue then SR-24 |
| other pairs | | 98.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 199 veh/h; Claremont Avenue 54 veh/h; SR-24 30 veh/h; none near the study area 26 veh/h; Claremont Avenue then SR-24 18 veh/h; Alcatraz Avenue then College Avenue 9 veh/h.

By origin group: SR-24 eastbound off-ramps (arriving from Oakland and I-980) 102; South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 73; Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 68; Telegraph Ave from the north (Berkeley) 39; Claremont Ave and Tunnel Rd toward the hills 20; College Ave from the north (Berkeley) 13; Alcatraz Ave from the west (Emeryville side) 9; West Oakland to the southwest (Adeline St, Market St) 9; SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) 7; San Pablo Ave (Emeryville and West Oakland) 6.

By destination group: SR-24 westbound on-ramps (toward Oakland and I-980) 98; Telegraph Ave from the north (Berkeley) 65; Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 52; Claremont Ave and Tunnel Rd toward the hills 39; South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 33; West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) 17; Alcatraz Ave from the west (Emeryville side) 13; Telegraph Ave to the south (downtown Oakland) 11; Ashby Ave from the west (Emeryville and I-80) 9; Emeryville and West Oakland streets (55th to 67th Streets) 8.


## Through cars by intent (cut-through intent view)

A through car is tallied once, under the first intent whose origin and destination groups hold its trip ends, at the moment the through count counts it. Cars an hour over the run, the same window as the through-car figure (372 an hour).

| Intent | Basis | Cars an hour | Share |
| --- | --- | --- | --- |
| Berkeley and College Ave traffic using Hillegass Ave, Colby St and nearby side streets to reach the SR-24 on-ramps | observed | 45 | 12% |
| Southbound Telegraph Ave and west-side traffic turning off Alcatraz Ave onto Colby St or Hillegass Ave to reach the SR-24 on-ramps | observed | 39 | 10% |
| SR-24 off-ramp traffic using Colby St, Hillegass Ave and nearby side streets to reach Berkeley and Telegraph Ave north | observed | 91 | 24% |
| SR-24 off-ramp traffic using side streets to reach Alcatraz Ave west, Ashby Ave and Claremont Ave toward the hills | assumed | 22 | 6% |
| Downtown, south and west Oakland traffic using side streets to reach Berkeley and Telegraph Ave north | assumed | 43 | 12% |
| Berkeley and Telegraph Ave north traffic using side streets to reach downtown, south and west Oakland | assumed | 38 | 10% |
| Oakland cross-town traffic (West Oakland, Broadway, Piedmont, Emeryville) using side streets near Claremont Ave and Telegraph Ave | assumed | 44 | 12% |
| Claremont Ave, hills and south Oakland traffic using side streets to reach the SR-24 on-ramps | assumed | 18 | 5% |
| Other (no intent listed) |  | 32 | 9% |

Intents listed cover 91% of through cars.


## Select-link shares: modeled vs observed (design D5: headline = freeway shares, tolerance +/-10 pp)

- Hillegass Avenue NB: 4 links (path Claremont Avenue -> Alcatraz Avenue (434 m)), 136 trips (129 completed)
- Colby Street NB: 8 links (path Claremont Avenue -> Alcatraz Avenue (680 m)), 180 trips (167 completed)
- Hillegass Avenue SB: 4 links (path Alcatraz Avenue -> Claremont Avenue (433 m)), 108 trips (100 completed)
- Colby Street SB: 8 links (path Alcatraz Avenue -> Claremont Avenue (680 m)), 172 trips (162 completed)

| Block | Side | Via | Observed | Modeled | Diff (pp) | n trips | Headline |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue NB | from | freeway | 47% | 65% | +18 | 136 | OUTSIDE |
| Hillegass Avenue NB | to | Benvenue Avenue | 21% (PM 33%) | 6% | -15 | 136 |  |
| Hillegass Avenue NB | to | College Avenue | 6% | 14% | +8 | 136 |  |
| Hillegass Avenue NB | to | Alcatraz Avenue WB | 27% | 26% | -1 | 136 |  |
| Colby Street NB | from | freeway | 47% | 47% | -0 | 180 | within |
| Colby Street NB | to | Alcatraz Avenue WB | 48% | 59% | +11 | 180 |  |
| Colby Street NB | to | Telegraph Avenue | 25% | 44% | +19 | 180 |  |
| Colby Street NB | to | College Avenue | 3% | 5% | +2 | 180 |  |
| Hillegass Avenue SB | from | Alcatraz Avenue WB | 46% | 28% | -18 | 108 |  |
| Hillegass Avenue SB | from | Benvenue Avenue | 26% | 2% | -24 | 108 |  |
| Hillegass Avenue SB | from | College Avenue | 16% | 14% | -2 | 108 |  |
| Hillegass Avenue SB | to | freeway | 57% (PM 68%) | 60% | +3 | 108 | within |
| Colby Street SB | from | Alcatraz Avenue EB | 43% | 19% | -24 | 172 |  |
| Colby Street SB | from | Alcatraz Avenue WB | 46% | 27% | -19 | 172 |  |
| Colby Street SB | from | Telegraph Avenue | 22% | 22% | +0 | 172 |  |
| Colby Street SB | to | freeway | 45% | 50% | +5 | 172 | within |
| Colby Street SB | to | Forest Street | 34% | 11% | -23 | 172 |  |

Headline shares within tolerance: 3 of 4. Observed column uses the PM-peak share where one is given and the period is pm_peak. 'Via' shares are the fraction of select-link trips using that street before (from) or after (to) the block; freeway = origin / destination gate with a motorway-class link attached.

## Claremont ramps: streets used before the on-ramp / after the off-ramp

Observed shares are for traffic from/to the north only. 'Modeled' is over all trips on the ramps and any visit to the street (an upper bound for streets that serve both sides). 'Modeled, side' counts only trips whose surface end lies on the side of the ramp stated in the targets file (`freewayRamp.side`), and for a street with a qualifier ("north of X") only its links on that side of X.

| Direction | Via | Observed | Modeled | n ramp trips | Modeled, side | n side trips |
| --- | --- | --- | --- | --- | --- | --- |
| onto freeway | College Avenue | 16% | 16% | 488 | 18% | 422 |
| onto freeway | Hillegass Avenue | 12% | 12% | 488 | 14% | 422 |
| onto freeway | Martin Street | 10% | 13% | 488 | 14% | 422 |
| onto freeway | Colby Street | 8% | 14% | 488 | 16% | 422 |
| onto freeway | Telegraph Avenue north of Alcatraz Avenue | 8% | 11% | 488 | 11% | 422 |
| onto freeway | Benvenue Avenue | 5% | 5% | 488 | 6% | 422 |
| from freeway | College Avenue | 10% | 8% | 525 | 8% | 509 |
| from freeway | Martin Street | 10% | 10% | 525 | 10% | 509 |
| from freeway | Colby Street | 8% | 14% | 525 | 14% | 509 |
| from freeway | Hillegass Avenue | 5% | 8% | 525 | 8% | 509 |
| from freeway | Benvenue Avenue | 3% | 2% | 525 | 2% | 509 |

## Top 15 links by delay

| Link | Street | Class | Lanes | Len (m) | End node control | Delay (veh-h) | Stopped (veh-h) | Mean stopped veh | Flow (veh/h) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1122 | Alcatraz Avenue | Tertiary | 1 | 299 | signal | 4.79 | 3.38 | 3.4 | 376 |
| 4143 | Adeline Street | Secondary | 3 | 185 | signal | 4.31 | 2.60 | 2.6 | 644 |
| 1051 | Adeline Street | Secondary | 4 | 50 | signal | 3.62 | 3.04 | 3.0 | 558 |
| 1108 | Market Street | Secondary | 4 | 36 | signal | 3.24 | 2.90 | 2.9 | 635 |
| 1662 | 52nd Street | Secondary | 4 | 53 | signal | 3.09 | 2.16 | 2.2 | 844 |
| 1037 | Sacramento Street | Tertiary | 3 | 40 | signal | 3.09 | 2.30 | 2.3 | 882 |
| 769 | Martin Luther King Junior Way | Secondary | 3 | 112 | signal | 3.08 | 1.97 | 2.0 | 941 |
| 2005 | Shattuck Avenue | Tertiary | 1 | 92 | signal | 2.85 | 2.02 | 2.0 | 571 |
| 1763 | 51st Street | Secondary | 4 | 58 | signal | 2.68 | 2.24 | 2.2 | 468 |
| 1036 | Sacramento Street | Tertiary | 3 | 43 | signal | 2.62 | 2.17 | 2.2 | 701 |
| 108 | Stanford Avenue | Secondary | 3 | 61 | signal | 2.60 | 1.41 | 1.4 | 916 |
| 535 | Ashby Avenue | Primary | 2 | 210 | signal | 2.43 | 1.27 | 1.3 | 761 |
| 115 | San Pablo Avenue | Primary | 3 | 54 | signal | 2.31 | 1.86 | 1.9 | 448 |
| 114 | San Pablo Avenue | Primary | 3 | 46 | signal | 2.31 | 1.66 | 1.7 | 500 |
| 755 | Market Street | Tertiary | 2 | 77 | signal | 2.29 | 1.88 | 1.9 | 331 |

## Top 15 nodes by blocked time

Blocked time = lane-head seconds waiting at the stop line without permission (signal red, conflict, stop sign or no downstream space).

| Node | Streets | Control | Gate | Blocked (lane-h) | of which no downstream space | Signal plan at end (cycle: greens) |
| --- | --- | --- | --- | --- | --- | --- |
| 446 | Market Street / Stanford Avenue | signal |  | 4.08 | 0.02 | 75 s: 49/16 |
| 680 | 52nd Street / Shattuck Avenue | signal |  | 3.82 | 0.01 | 110 s: 30/28/38 |
| 447 | Adeline Street / Alcatraz Avenue | signal |  | 3.58 | 0.01 | 75 s: 15/50 |
| 185 | Alcatraz Avenue / Sacramento Street | signal |  | 2.89 | 0.02 | 75 s: 40/25 |
| 30 | 57th Street / Adeline Street / Market Street | signal |  | 2.82 | 0.00 | 75 s: 29/16/15 |
| 37 | San Pablo Avenue / Stanford Avenue | signal |  | 2.53 | 0.00 | 75 s: 25/40 |
| 851 | Alcatraz Avenue / Telegraph Avenue | signal |  | 2.42 | 0.01 | 75 s: 43/22 |
| 713 | 51st Street / Telegraph Avenue | signal |  | 2.42 | 0.00 | 75 s: 41/24 |
| 1069 | Claremont Avenue / Colby Street / Forest Street | signal |  | 2.30 | 0.00 | 147 s: 64/10/58 |
| 501 | Alcatraz Avenue / Shattuck Avenue | signal |  | 2.22 | 0.01 | 75 s: 27/38 |
| 1080 | 62nd Street / Claremont Avenue / College Avenue | signal |  | 2.17 | 0.00 | 75 s: 15/30/15 |
| 479 | Adeline Street / Martin Luther King Junior Way / Stanford Avenue | signal |  | 2.09 | 0.00 | 75 s: 15/50 |
| 944 | Ashby Avenue / Shattuck Avenue | signal |  | 2.09 | 0.00 | 75 s: 26/39 |
| 1406 | Ashby Avenue / Claremont Avenue | signal |  | 1.94 | 0.03 | 75 s: 50/15 |
| 702 | Aileen Street / Telegraph Avenue | signal |  | 1.78 | 0.00 | 75 s: 29/36 |

Phases of the five most blocked signals (green s: approach links with their lanes, link ids in brackets):

- node 446: 49 s: Stanford Avenue 1L [941], Stanford Avenue 3L [1055]; 16 s: Market Street 4L [1108], Market Street 3L [1111]
- node 680: 30 s: 52nd Street 4L [1662]; 28 s: 52nd Street 4L [1666], 52nd Street 4L [1662]; 38 s: Shattuck Avenue 2L [1653], Shattuck Avenue 2L [1705]
- node 447: 15 s: Adeline Street 4L [1049], Adeline Street 4L [1051]; 50 s: Alcatraz Avenue 2L [1048], Alcatraz Avenue 2L [1133]
- node 185: 40 s: Alcatraz Avenue 1L [363], Alcatraz Avenue 1L [1162]; 25 s: Sacramento Street 3L [1036], Sacramento Street 3L [1037]
- node 30: 29 s: Adeline Street 1L [747], Adeline Street 1L [1030]; 16 s: Market Street 2L [755], Market Street 2L [1113]; 15 s: 57th Street 1L [44], 57th Street 1L [1151]

## Entry backlog by origin node at end of run (top 10)

| Node | Streets | Trips waiting | Offered veh/h (before scale) |
| --- | --- | --- | --- |
| 869 | 65th Street / Dana Street | 1 | 73 |
| 1181 | Hillegass Avenue / Woolsey Street | 1 | 10 |

## Flow on key streets (veh/h per direction, study-area links of 40 m or more)

| Street | Direction of travel | Links | Median flow | Max flow |
| --- | --- | --- | --- | --- |
| Telegraph | N | 12 | 581 | 614 |
| Telegraph | S | 10 | 570 | 577 |
| College | N | 3 | 214 | 216 |
| College | S | 3 | 385 | 388 |
| Claremont | N | 6 | 238 | 390 |
| Claremont | S | 7 | 186 | 440 |
| Alcatraz | E | 6 | 391 | 403 |
| Alcatraz | W | 6 | 240 | 310 |
| Hillegass | N | 4 | 80 | 86 |
| Hillegass | S | 4 | 62 | 79 |
| Colby | N | 7 | 106 | 121 |
| Colby | S | 7 | 85 | 119 |
| Martin | E | 2 | 74 | 74 |
| Martin | W | 2 | 78 | 78 |

## Largest demand origins (offered, before scale)

| Node | Streets | Veh/h |
| --- | --- | --- |
| 602 | Grove Shafter Freeway | 2536 |
| 943 | Telegraph Avenue / Ward Street | 791 |
| 1672 | Warren Freeway | 781 |
| 265 | Ashby Avenue | 781 |
| 183 | San Pablo Avenue | 607 |
| 974 | Broadway | 455 |
| 184 | Alcatraz Avenue | 375 |
| 763 | Telegraph Avenue | 367 |
| 275 | Market Street | 326 |
| 104 | San Pablo Avenue | 273 |
