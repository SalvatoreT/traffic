# Calibration report: rockridge midday scale 1 seed 1 (60 min)

Offered demand 16175 veh/h x scale 1 = 16175 veh/h. Run took 21.8 s wall clock. Flow tables use the window after a 10 min warm-up; select-link and health figures cover the whole run from an empty network.

## Stability (design D4)

| Criterion | Threshold | Value | Result |
| --- | --- | --- | --- |
| Gridlock removals | 0 | 0 | pass |
| Backlog / spawned | < 2% | 0.0% (1 of 16326) | pass |
| Arterial mean speed (run) | > 4 m/s | 10.11 m/s (last 15 min 10.09) | pass |

Overall: **STABLE**. Mean trip delay 93 s, mean trip time 345 s, completed 16533, unroutable 0.

| t (min) | vehicles in network | backlog | completed | removals | arterial speed in interval (m/s) |
| --- | --- | --- | --- | --- | --- |
| 5 | 1634 | 0 | 1547 | 0 | 9.93 |
| 10 | 1598 | 2 | 2917 | 0 | 9.77 |
| 15 | 1625 | 0 | 4255 | 0 | 9.90 |
| 20 | 1562 | 0 | 5662 | 0 | 10.24 |
| 25 | 1590 | 1 | 7008 | 0 | 10.45 |
| 30 | 1607 | 6 | 8345 | 0 | 9.83 |
| 35 | 1610 | 0 | 9728 | 0 | 10.35 |
| 40 | 1579 | 0 | 11126 | 0 | 10.25 |
| 45 | 1622 | 0 | 12493 | 0 | 10.37 |
| 50 | 1589 | 1 | 13856 | 0 | 10.13 |
| 55 | 1566 | 1 | 15198 | 0 | 10.09 |
| 60 | 1608 | 1 | 16533 | 0 | 10.06 |
## Wandering (completed car trips)

Detour ratio = distance driven (link and movement lengths) over the shortest network distance from the trip's origin to its destination. Detour against the free-flow route uses the time-shortest route with no congestion and no noise, which is what a purposeful driver without live information would follow (it differs from the shortest distance when a faster, longer road exists). A switch is a change of the remaining route while en route. Loops: the same link twice or the same node three or more times. Reversals: a link followed by its reverse within 200 m. 'Study-area vehicle-miles' are miles driven on links inside the study area; the last column is the share of them driven by trips with a detour ratio above 1.3. Guided drivers re-evaluate their route every epoch; the others keep their departure route unless it is blocked.

| Trips | n | Switches per trip | With a switch | Mean detour | Median detour | Detour > 1.3 | Detour > 2 | Mean detour vs free-flow route | Vs free-flow route > 1.3 | Loops | Reversals | Study veh-miles | Of them by detour > 1.3 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| all trips | 15253 | 0.00 | 0.1% | 1.084 | 1.050 | 3.7% | 0.0% | 1.022 | 1.3% | 0.0% | 0.3% | 1491 | 5.2% |
| gate to gate | 5347 | 0.00 | 0.1% | 1.086 | 1.050 | 2.6% | 0.0% | 1.022 | 0.9% | 0.0% | 0.2% | 324 | 8.4% |
| with a local end | 9906 | 0.00 | 0.0% | 1.084 | 1.050 | 4.2% | 0.0% | 1.022 | 1.5% | 0.0% | 0.3% | 1167 | 4.3% |
| guided drivers | 6957 | 0.00 | 0.1% | 1.085 | 1.050 | 3.8% | 0.0% | 1.021 | 1.2% | 0.0% | 0.4% | 684 | 5.0% |
| other drivers | 8296 | 0.00 | 0.0% | 1.084 | 1.050 | 3.6% | 0.0% | 1.022 | 1.4% | 0.0% | 0.2% | 807 | 5.4% |

## Reported patterns (diagnostics; configured in the targets file under `patterns`)

(a) Trips between the surface gates on the north side of the ramps and the freeway mainline gates, and the local-street (residential and service links in the study area) vehicle-miles they drive. Share = of all completed trips' local-street vehicle-miles (250 miles). No observed counterpart exists for this quantity (the targets file has only the select-link shares above).

| Trips | n trips | Local-street veh-miles | Share of all local-street veh-miles |
| --- | --- | --- | --- |
| surface gates to the freeway | 1099 | 27.0 | 11% |
| freeway to the surface gates | 720 | 18.9 | 8% |

(b) Corridor trips: completed trips from beyond one end of the corridor's study-area extent (the bypass street and its arterial together) to beyond the other end, within a lateral limit of the corridor, by direction. 'Bypass' = at least N blocks (links) on the bypass street; 'arterial' = fewer bypass blocks and at least N on the arterial; 'other' = neither (another street, the freeway or a short use); blocks are counted on the corridor's study-area links. No observed counterpart exists for these shares. The related observed values are in the select-link table above: northbound Hillegass Ave traffic rarely ends on College Ave (6%), 21 to 33% jogs to Benvenue Ave, and southbound freeway-bound drivers on College Ave commonly arrive via Ashby Ave and Benvenue Ave and jog to Hillegass Ave.

| Bypass | Arterial | N | Direction | Corridor trips | Bypass | Arterial | Other | Mean bypass blocks |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue | College Avenue | 3 | N | 813 | 3% | 13% | 84% | 0.1 |
| Hillegass Avenue | College Avenue | 3 | S | 972 | 5% | 22% | 73% | 0.2 |

## Per-mode results

Offered: 16175 car veh/h; 105 bicycle flows (386/h); 2000 pedestrian flows (2644/h). Bicycle and pedestrian volumes are assumptions, not counts.

| Mode | In network | Completed | Mean time (s) | Other |
| --- | --- | --- | --- | --- |
| Car | 1608 | 16533 | 345 | |
| Bicycle | 16 | 406 | 162 | |
| Pedestrian | 326 | 2584 | 447 | mean crossing delay 7.0 s |

Vulnerable road users (surrogate indicators): pedestrian conflicts 379, bicycle conflicts 219, close passes 130, pedestrian injury severity mean 0.052 (AIS4+, 11214 supported of 11214 encounters), cyclist injury severity mean 0.065 (MAIS3+F, 796 supported of 1496 encounters) (separate endpoints, never summed), mean vehicle speed at pedestrian encounters 2.61 m/s.


## Volunteer whole-street counts

Each car counts once when it passes the last stop line after driving the full directed corridor in order. The measurement window is 50.0 minutes. The last two columns describe trips that visited any corridor link during the full run.

| Corridor | Counted whole street (veh/h) | Modeled whole street (veh/h) | Used in fit | Through trips on any link (veh/h) | Freeway trips on any link (veh/h) |
| --- | --- | --- | --- | --- | --- |
| Hillegass Avenue NB | n/a | 26 | n/a | 64 | 62 |
| Colby Street NB | n/a | 29 | n/a | 68 | 70 |
| Hillegass Avenue SB | n/a | 41 | n/a | 87 | 72 |
| Colby Street SB | n/a | 23 | n/a | 78 | 71 |

## Intent map: through cars by where they come from and where they are going

Through = neither trip end is in the study area. Groups are the approach groups of the area config (data/areas); a node that is not a gate takes the group of the nearest surface gate (ASSUMPTION). The arterial is the one a trip would use on the shortest free-flow path with the study area's residential and service streets closed, where that path runs on a boundary street near the study area.

Model figures are the mean of 1 seed(s), per hour of the run. Basis: OBSERVED = read from the resident volunteer count of Feb 25, 2025 or its headline shares; ASSUMPTION = inferred from those numbers or chosen.

### Colby Street NB

Observed (PM): 182 cars entered at the south end, 102 drove the whole street, 164 left it at Alcatraz Ave (131 left, 32 right, 1 straight), and 47% of the block's trips came from a freeway (the headline share). ASSUMPTION: freeway-origin cars that do not end along the street are 65 veh/h (the 82 freeway-origin trips on the block, 47% of 174, times the 182 / (182 + 47) of its cars that entered at the south end rather than joining on the way), spread over the 164 exits in proportion (0.40); the other through cars come from the Telegraph Ave and south-side approaches that feed the street's south end. Ranges: low = 131 (32) x 0.47 x 0.62 (the whole-street share of exits), high = 131 (32) x 0.47.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | OBSERVED turn count x ASSUMPTION share (131 left turns x 0.40) | 52 (38 to 62) | 30 | below |
| Telegraph Ave and south-side traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | ASSUMPTION: the through left-turners (131 x 0.62 = 81) that are not off-ramp traffic | 29 (19 to 43) | 26 | within |
| SR-24 off-ramp traffic using Colby St to reach College Ave and Berkeley (right at Alcatraz Ave) | OBSERVED turn count x ASSUMPTION share (32 right turns x 0.40) | 13 (9 to 15) | 3 | below |
| Telegraph Ave and south-side traffic using Colby St to reach College Ave and Berkeley | ASSUMPTION: the through right-turners (32 x 0.62 = 20) that are not off-ramp traffic | 7 (5 to 11) | 7 | within |
| Intents listed, together | | 101 (71 to 131) | 66 | |
| Other through cars (no intent listed) | | | 2 | |

Model through cars by origin and destination group (largest 12 of 14 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 30.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 7.0 | Claremont Avenue then College Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Ashby Ave from the west (Emeryville and I-80) | 6.0 | none near the study area |
| West Oakland to the southwest (Adeline St, Market St) | Telegraph Ave from the north (Berkeley) | 6.0 | Telegraph Avenue |
| Telegraph Ave to the south (downtown Oakland) | Telegraph Ave from the north (Berkeley) | 6.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 4.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 2.0 | SR-24 then Claremont Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | College Ave from the north (Berkeley) | 1.0 | College Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave to the south (downtown Oakland) | 1.0 | Claremont Avenue then Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Emeryville and West Oakland streets (55th to 67th Streets) | 1.0 | College Avenue then Alcatraz Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Claremont Ave and Tunnel Rd toward the hills | 1.0 | Claremont Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | College Ave from the north (Berkeley) | 1.0 | SR-24 then Claremont Avenue then College Avenue |
| other pairs | | 2.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 47 veh/h; Claremont Avenue then College Avenue 7 veh/h; none near the study area 6 veh/h; SR-24 then Claremont Avenue 2 veh/h; Alcatraz Avenue then College Avenue 1 veh/h; Claremont Avenue 1 veh/h.

### Hillegass Avenue NB

Observed (PM): 94 cars entered at the south end, 48 drove the whole street, 109 left it at Alcatraz Ave (43 west, 54 east, 12 straight), and 47% of the block's trips came from a freeway. ASSUMPTION: freeway-origin through cars are 40 veh/h (52 freeway-origin trips times 94 / (94 + 29)), spread over the exits in proportion (0.37); the through share of exits is 48 / 109 = 0.44.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Hillegass Ave to reach Alcatraz Ave west and Telegraph Ave north | OBSERVED turn count x ASSUMPTION share (43 left turns x 0.37) | 16 (9 to 20) | 17 | within |
| SR-24 off-ramp traffic using Hillegass Ave to reach College Ave and Berkeley | OBSERVED turn count x ASSUMPTION share (54 right turns x 0.37) | 20 (11 to 25) | 21 | within |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach Alcatraz Ave west | ASSUMPTION: through exits (43 x 0.44) that are not off-ramp traffic | 3 (0 to 10) | 6 | within |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach College Ave and Berkeley | ASSUMPTION: through exits (54 x 0.44) that are not off-ramp traffic | 4 (0 to 13) | 11 | within |
| Intents listed, together | | 43 (20 to 68) | 55 | |
| Other through cars (no intent listed) | | | 9 | |

Model through cars by origin and destination group (largest 12 of 22 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 12.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 11.0 | SR-24 |
| Telegraph Ave to the south (downtown Oakland) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 6.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | College Ave from the north (Berkeley) | 4.0 | SR-24 then Claremont Avenue then College Avenue |
| College Ave from the north (Berkeley) | Alcatraz Ave from the west (Emeryville side) | 3.0 | College Avenue then Alcatraz Avenue |
| SR-13 Warren Freeway (via SR-24 east) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 3.0 | Claremont Avenue then Alcatraz Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 3.0 | Claremont Avenue then Alcatraz Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 3.0 | SR-24 then Claremont Avenue then College Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 2.0 | Claremont Avenue then College Avenue then Alcatraz Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 2.0 | Claremont Avenue then College Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 2.0 | Claremont Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Ashby Ave from the west (Emeryville and I-80) | 2.0 | SR-24 then Telegraph Avenue |
| other pairs | | 11.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 20 veh/h; SR-24 12 veh/h; SR-24 then Claremont Avenue then College Avenue 7 veh/h; Claremont Avenue then Alcatraz Avenue 6 veh/h; College Avenue then Alcatraz Avenue 5 veh/h; none near the study area 4 veh/h.

### Hillegass Avenue SB

Observed (PM): 178 cars entered at the top (76 turned in from Alcatraz Ave west, 98 from the east, 4 came straight from the north), 79 drove the whole street, and 68% of the block's trips (109 veh/h) went to a freeway. ASSUMPTION: freeway-bound cars that did not join mid-street are 87 veh/h (109 x 178 / (178 + 44)), half of the 174 turn-ins; low = the whole-street share of the turn-ins (0.45), high = the freeway-bound share without the mid-street correction (0.63).

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Telegraph Ave, Alcatraz Ave west and West Berkeley traffic turning off Alcatraz Ave onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (76 turn-ins x 0.50) | 38 (34 to 48) | 30 | below |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (98 turn-ins x 0.50) | 49 (44 to 62) | 37 | below |
| Intents listed, together | | 87 (78 to 110) | 67 | |
| Other through cars (no intent listed) | | | 20 | |

Model through cars by origin and destination group (largest 12 of 15 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 29.0 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 14.0 | Claremont Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 12.0 | Claremont Avenue then SR-24 |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 11.0 | College Avenue then Claremont Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 6.0 | Telegraph Avenue |
| Shattuck Ave from the north (Berkeley) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 3.0 | College Avenue |
| Telegraph Ave from the north (Berkeley) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 3.0 | College Avenue |
| San Pablo Ave (Emeryville and West Oakland) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 2.0 | Alcatraz Avenue then College Avenue |
| Alcatraz Ave from the west (Emeryville side) | SR-13 Warren Freeway (via SR-24 east) | 1.0 | SR-24 |
| Ashby Ave from the west (Emeryville and I-80) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 1.0 | Alcatraz Avenue then College Avenue |
| West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 1.0 | College Avenue |
| West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) | Berkeley hills to the northeast (Evergreen Ln, Gravatt Dr) | 1.0 | Claremont Avenue |
| other pairs | | 3.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 35 veh/h; Claremont Avenue then SR-24 26 veh/h; College Avenue then Claremont Avenue then SR-24 11 veh/h; College Avenue 7 veh/h; Alcatraz Avenue then College Avenue 4 veh/h; Claremont Avenue 1 veh/h.

### Colby Street SB

Observed (PM): 139 cars entered at the top (76 from Alcatraz Ave west, 50 from the east, 13 from the north), 39 drove the whole street, 45% of the block's trips (72 veh/h) went to a freeway and 22% came by way of Telegraph Ave. ASSUMPTION: freeway-bound cars that did not join mid-street are 46 veh/h (72 x 139 / (139 + 79)), 0.365 of the 126 turn-ins; low = the whole-street share (0.31), high = the unadjusted freeway share (0.57). The Telegraph Ave cars are the 22% x 160 = 35 of the 76 west turn-ins.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Southbound Telegraph Ave traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (35 Telegraph Ave cars x 0.365) | 13 (11 to 20) | 15 | within |
| Alcatraz Ave west, Ashby Ave and West Berkeley traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (41 other west turn-ins x 0.365) | 15 (13 to 23) | 9 | below |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (50 east turn-ins x 0.365) | 18 (15 to 29) | 28 | within |
| Intents listed, together | | 46 (39 to 72) | 52 | |
| Other through cars (no intent listed) | | | 26 | |

Model through cars by origin and destination group (largest 12 of 19 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 14.0 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 11.0 | Claremont Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 10.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 10.0 | Claremont Avenue then SR-24 |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 7.0 | College Avenue then Claremont Avenue then SR-24 |
| San Pablo Ave (Emeryville and West Oakland) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 4.0 | Alcatraz Avenue then College Avenue |
| Ashby Ave from the west (Emeryville and I-80) | SR-13 Warren Freeway (via SR-24 east) | 3.0 | SR-24 |
| San Pablo Ave (Emeryville and West Oakland) | College Ave from the north (Berkeley) | 3.0 | Alcatraz Avenue then College Avenue |
| Shattuck Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 3.0 | none near the study area |
| Alcatraz Ave from the west (Emeryville side) | SR-13 Warren Freeway (via SR-24 east) | 2.0 | SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 2.0 | Alcatraz Avenue then College Avenue |
| West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) | Berkeley hills to the northeast (Evergreen Ln, Gravatt Dr) | 2.0 | Claremont Avenue |
| other pairs | | 7.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 25 veh/h; Claremont Avenue then SR-24 21 veh/h; Alcatraz Avenue then College Avenue 10 veh/h; College Avenue then Claremont Avenue then SR-24 7 veh/h; SR-24 6 veh/h; none near the study area 4 veh/h.

### Study area, all residential and service streets

Model: 364 through cars per hour.

Model through cars by origin and destination group (largest 12 of 54 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 36.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 35.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 35.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 23.0 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 22.0 | Claremont Avenue then SR-24 |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 14.0 | College Avenue then Claremont Avenue then SR-24 |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 14.0 | Claremont Avenue then College Avenue |
| San Pablo Ave (Emeryville and West Oakland) | College Ave from the north (Berkeley) | 12.0 | Claremont Avenue then College Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 12.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 11.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 11.0 | SR-24 |
| West Oakland to the southwest (Adeline St, Market St) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 10.0 | Claremont Avenue |
| other pairs | | 129.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 178 veh/h; Claremont Avenue then College Avenue 28 veh/h; Claremont Avenue 27 veh/h; Claremont Avenue then SR-24 22 veh/h; SR-24 22 veh/h; Alcatraz Avenue then College Avenue 14 veh/h.

By origin group: SR-24 eastbound off-ramps (arriving from Oakland and I-980) 63; Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 61; South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 56; Telegraph Ave from the north (Berkeley) 42; West Oakland to the southwest (Adeline St, Market St) 24; San Pablo Ave (Emeryville and West Oakland) 23; Claremont Ave and Tunnel Rd toward the hills 22; College Ave from the north (Berkeley) 20; Telegraph Ave to the south (downtown Oakland) 16; SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) 10.

By destination group: SR-24 westbound on-ramps (toward Oakland and I-980) 113; Telegraph Ave from the north (Berkeley) 64; Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 56; South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 47; College Ave from the north (Berkeley) 20; Claremont Ave and Tunnel Rd toward the hills 15; San Pablo Ave (Emeryville and West Oakland) 10; Ashby Ave from the west (Emeryville and I-80) 8; Telegraph Ave to the south (downtown Oakland) 7; SR-13 Warren Freeway (via SR-24 east) 6.


## Through cars by intent (cut-through intent view)

A through car is tallied once, under the first intent that fits it (the on-ramp on its planned route, the off-ramp it has driven, or the origin and destination groups of its trip), at the moment the through count counts it. Cars an hour over the run, the same window as the through-car figure (365 an hour).

| Intent | Basis | Cars an hour | Share |
| --- | --- | --- | --- |
| on-2853241697 | observed | 112 | 31% |
| Other on-ramps | assumed | 8 | 2% |
| off-52990846 | observed | 63 | 17% |
| Other off-ramps | assumed | 13 | 4% |
| Downtown, south and west Oakland traffic using side streets to reach Berkeley and Telegraph Ave north | assumed | 53 | 15% |
| Berkeley and Telegraph Ave north traffic using side streets to reach downtown, south and west Oakland | assumed | 26 | 7% |
| Oakland cross-town traffic (West Oakland, Broadway, Piedmont, Emeryville) using side streets near Claremont Ave and Telegraph Ave | assumed | 41 | 11% |
| Other (no intent listed) |  | 49 | 13% |

Intents listed cover 87% of through cars.


## Select-link shares: modeled vs observed (design D5: headline = freeway shares, tolerance +/-10 pp)

- Hillegass Avenue NB: 4 links (path Claremont Avenue -> Alcatraz Avenue (434 m)), 143 trips (139 completed)
- Colby Street NB: 8 links (path Claremont Avenue -> Alcatraz Avenue (680 m)), 159 trips (150 completed)
- Hillegass Avenue SB: 4 links (path Alcatraz Avenue -> Claremont Avenue (433 m)), 108 trips (101 completed)
- Colby Street SB: 8 links (path Alcatraz Avenue -> Claremont Avenue (680 m)), 145 trips (138 completed)

| Block | Side | Via | Observed | Modeled | Diff (pp) | n trips | Headline |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue NB | from | freeway | 47% | 43% | -4 | 143 | within |
| Hillegass Avenue NB | to | Benvenue Avenue | 21% (PM 33%) | 4% | -17 | 143 |  |
| Hillegass Avenue NB | to | College Avenue | 6% | 10% | +4 | 143 |  |
| Hillegass Avenue NB | to | Alcatraz Avenue WB | 27% | 35% | +8 | 143 |  |
| Colby Street NB | from | freeway | 47% | 44% | -3 | 159 | within |
| Colby Street NB | to | Alcatraz Avenue WB | 48% | 51% | +3 | 159 |  |
| Colby Street NB | to | Telegraph Avenue | 25% | 37% | +12 | 159 |  |
| Colby Street NB | to | College Avenue | 3% | 4% | +1 | 159 |  |
| Hillegass Avenue SB | from | Alcatraz Avenue WB | 46% | 41% | -5 | 108 |  |
| Hillegass Avenue SB | from | Benvenue Avenue | 26% | 10% | -16 | 108 |  |
| Hillegass Avenue SB | from | College Avenue | 16% | 29% | +13 | 108 |  |
| Hillegass Avenue SB | to | freeway | 57% (PM 68%) | 67% | +10 | 108 | within |
| Colby Street SB | from | Alcatraz Avenue EB | 43% | 23% | -20 | 145 |  |
| Colby Street SB | from | Alcatraz Avenue WB | 46% | 23% | -23 | 145 |  |
| Colby Street SB | from | Telegraph Avenue | 22% | 16% | -6 | 145 |  |
| Colby Street SB | to | freeway | 45% | 46% | +1 | 145 | within |
| Colby Street SB | to | Forest Street | 34% | 17% | -17 | 145 |  |

Headline shares within tolerance: 4 of 4. Observed column uses the PM-peak share where one is given and the period is pm_peak. 'Via' shares are the fraction of select-link trips using that street before (from) or after (to) the block; freeway = origin / destination gate with a motorway-class link attached.

## Claremont ramps: streets used before the on-ramp / after the off-ramp

Observed shares are for traffic from/to the north only. 'Modeled' is over all trips on the ramps and any visit to the street (an upper bound for streets that serve both sides). 'Modeled, side' counts only trips whose surface end lies on the side of the ramp stated in the targets file (`freewayRamp.side`), and for a street with a qualifier ("north of X") only its links on that side of X.

| Direction | Via | Observed | Modeled | n ramp trips | Modeled, side | n side trips |
| --- | --- | --- | --- | --- | --- | --- |
| onto freeway | College Avenue | 16% | 16% | 471 | 20% | 378 |
| onto freeway | Hillegass Avenue | 12% | 14% | 471 | 18% | 378 |
| onto freeway | Martin Street | 10% | 15% | 471 | 19% | 378 |
| onto freeway | Colby Street | 8% | 12% | 471 | 15% | 378 |
| onto freeway | Telegraph Avenue north of Alcatraz Avenue | 8% | 12% | 471 | 12% | 378 |
| onto freeway | Benvenue Avenue | 5% | 5% | 471 | 6% | 378 |
| from freeway | College Avenue | 10% | 8% | 483 | 8% | 472 |
| from freeway | Martin Street | 10% | 11% | 483 | 12% | 472 |
| from freeway | Colby Street | 8% | 8% | 483 | 8% | 472 |
| from freeway | Hillegass Avenue | 5% | 8% | 483 | 8% | 472 |
| from freeway | Benvenue Avenue | 3% | 3% | 483 | 3% | 472 |

## Top 15 links by delay

| Link | Street | Class | Lanes | Len (m) | End node control | Delay (veh-h) | Stopped (veh-h) | Mean stopped veh | Flow (veh/h) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1049 | Adeline Street | Secondary | 4 | 43 | signal | 4.73 | 4.05 | 4.1 | 624 |
| 498 | Sacramento Street | Tertiary | 3 | 48 | signal | 3.69 | 2.86 | 2.9 | 703 |
| 3395 | Ashby Avenue | Primary | 1 | 129 | signal | 3.48 | 2.54 | 2.5 | 518 |
| 2776 | Claremont Avenue | Secondary | 2 | 161 | signal | 3.34 | 2.89 | 2.9 | 370 |
| 1666 | 52nd Street | Secondary | 4 | 39 | signal | 3.19 | 2.86 | 2.9 | 385 |
| 2008 | Shattuck Avenue | Tertiary | 1 | 93 | signal | 2.78 | 1.92 | 1.9 | 446 |
| 2039 | Telegraph Avenue | Secondary | 3 | 50 | signal | 2.77 | 2.02 | 2.0 | 570 |
| 1037 | Sacramento Street | Tertiary | 3 | 40 | signal | 2.72 | 1.92 | 1.9 | 1112 |
| 1662 | 52nd Street | Secondary | 4 | 53 | signal | 2.72 | 1.93 | 1.9 | 761 |
| 1763 | 51st Street | Secondary | 4 | 58 | signal | 2.67 | 2.15 | 2.1 | 490 |
| 1108 | Market Street | Secondary | 4 | 36 | signal | 2.64 | 1.93 | 1.9 | 997 |
| 3463 | Tunnel Road | Primary | 2 | 52 | signal | 2.62 | 2.16 | 2.2 | 700 |
| 755 | Market Street | Tertiary | 2 | 77 | signal | 2.60 | 2.21 | 2.2 | 280 |
| 761 | Martin Luther King Junior Way | Secondary | 4 | 32 | signal | 2.59 | 2.01 | 2.0 | 1198 |
| 3447 | Claremont Avenue | Secondary | 3 | 43 | signal | 2.51 | 1.82 | 1.8 | 534 |

## Top 15 nodes by blocked time

Blocked time = lane-head seconds waiting at the stop line without permission (signal red, conflict, stop sign or no downstream space).

| Node | Streets | Control | Gate | Blocked (lane-h) | of which no downstream space | Signal plan at end (cycle: greens) |
| --- | --- | --- | --- | --- | --- | --- |
| 680 | 52nd Street / Shattuck Avenue | signal |  | 4.03 | 0.02 | 110 s: 30/28/38 |
| 447 | Adeline Street / Alcatraz Avenue | signal |  | 3.89 | 0.03 | 75 s: 20/45 |
| 446 | Market Street / Stanford Avenue | signal |  | 3.50 | 0.06 | 75 s: 26/39 |
| 1406 | Ashby Avenue / Claremont Avenue | signal |  | 3.02 | 0.07 | 75 s: 30/15/15 |
| 331 | 52nd Street / Martin Luther King Junior Way | signal |  | 2.81 | 0.02 | 75 s: 45/20 |
| 1069 | Claremont Avenue / Colby Street / Forest Street | signal |  | 2.72 | 0.00 | 147 s: 63/10/59 |
| 30 | 57th Street / Adeline Street / Market Street | signal |  | 2.71 | 0.02 | 75 s: 19/25/16 |
| 185 | Alcatraz Avenue / Sacramento Street | signal |  | 2.59 | 0.04 | 75 s: 33/32 |
| 1080 | 62nd Street / Claremont Avenue / College Avenue | signal |  | 2.47 | 0.04 | 75 s: 15/30/15 |
| 851 | Alcatraz Avenue / Telegraph Avenue | signal |  | 2.34 | 0.03 | 75 s: 39/26 |
| 37 | San Pablo Avenue / Stanford Avenue | signal |  | 2.30 | 0.01 | 75 s: 27/38 |
| 944 | Ashby Avenue / Shattuck Avenue | signal |  | 2.14 | 0.01 | 75 s: 41/24 |
| 947 | Ashby Avenue / Telegraph Avenue | signal |  | 2.12 | 0.00 | 75 s: 29/36 |
| 242 | Ashby Avenue / Martin Luther King Junior Way | signal |  | 2.11 | 0.00 | 75 s: 31/34 |
| 713 | 51st Street / Telegraph Avenue | signal |  | 2.06 | 0.01 | 75 s: 40/25 |

Phases of the five most blocked signals (green s: approach links with their lanes, link ids in brackets):

- node 680: 30 s: 52nd Street 4L [1662]; 28 s: 52nd Street 4L [1666], 52nd Street 4L [1662]; 38 s: Shattuck Avenue 2L [1653], Shattuck Avenue 2L [1705]
- node 447: 20 s: Adeline Street 4L [1049], Adeline Street 4L [1051]; 45 s: Alcatraz Avenue 2L [1048], Alcatraz Avenue 2L [1133]
- node 446: 26 s: Stanford Avenue 3L [941], Stanford Avenue 3L [1055]; 39 s: Market Street 4L [1108], Market Street 3L [1111]
- node 1406: 30 s: Ashby Avenue 1L [3395], Ashby Avenue 2L [3426]; 15 s: Claremont Avenue 2L [4329]; 15 s: Claremont Avenue 3L [3447]
- node 331: 45 s: Martin Luther King Junior Way 4L [704], Martin Luther King Junior Way 4L [761]; 20 s: 52nd Street 2L [758], 52nd Street 1L [760]

## Cars cleared from gridlock near and far (judged zone)

Judged zone: the study area, its bounding streets and the junctions on them, plus nodes within 200 m of it along the network (111 nodes, 329 links). A far clearing counts against the stability rule when its blocking chain (vehicles held at least 60 s by a full exit, at the 5 s snapshot before it) reaches a link in the zone.

| Buffer (m) | Near | Far | Far, chain reaches the zone | Judged |
| --- | --- | --- | --- | --- |
| 100.0 | 0 | 0 | 0 | 0 |
| 200.0 | 0 | 0 | 0 | 0 |
| 400.0 | 0 | 0 | 0 | 0 |

Entry backlog at the end of the run: 0 trips waiting at origins in the zone, of 1 in all.

| Bounding street | Links | Longest standing queue on one link (m) | Link (length m) | At (min) | Share of samples with a link full |
| --- | --- | --- | --- | --- | --- |
| Telegraph Avenue | 28 | 42.0 | 1604 (94.0) | 59.5 | 0.0 |
| Alcatraz Avenue | 14 | 52.0 | 4238 (84.0) | 34.8 | 0.0 |
| College Avenue | 6 | 52.0 | 2805 (102.0) | 55.4 | 0.0 |
| Claremont Avenue | 13 | 42.0 | 2776 (161.0) | 18.3 | 0.0 |
| CA 24 | 3 | 36.0 | 1945 (188.0) | 25.3 | 0.0 |

## Junction recovery

Policy `physical`. Node entries by cars and cyclists in the run: 511460 (settle interval 0). An admission is an entry the ordinary rule would have refused; head-seconds count the time a waiting head vehicle had the reason invoked, and the part of it in which it still could not enter. Courtesy and the yield fallback change priority only; under `physical` the conflict bypass never admits.

| Reason | Admissions per hour | Per 1,000 entries | Head-s invoked | Head-s blocked |
| --- | --- | --- | --- | --- |
| courtesy | 58.0 | 0.113 | 114 | 96 |
| yield fallback | 3.0 | 0.006 | 1 | 0 |
| conflict bypass | 0.0 | 0.000 | 0 | 0 |

Vehicles removed while held in a node by a full exit: 0 (0.0 per hour, included in the gridlock removals).

| Node | Streets | Control | Courtesy | Yield fallback | Conflict bypass | Held removals |
| --- | --- | --- | --- | --- | --- | --- |
| 1220 | Ashby Avenue / College Avenue | signal | 8 | 0 | 0 | 0 |
| 1069 | Claremont Avenue / Colby Street / Forest Street | signal | 6 | 0 | 0 | 0 |
| 1429 | Claremont Avenue / Claremont Boulevard | two_way_stop | 6 | 0 | 0 | 0 |
| 30 | 57th Street / Adeline Street / Market Street | signal | 4 | 0 | 0 | 0 |
| 1032 | 51st Street / Broadway / Pleasant Valley Avenue | signal | 4 | 0 | 0 | 0 |
| 1080 | 62nd Street / Claremont Avenue / College Avenue | signal | 4 | 0 | 0 | 0 |
| 680 | 52nd Street / Shattuck Avenue | signal | 3 | 0 | 0 | 0 |
| 727 | 52nd Street | uncontrolled | 3 | 0 | 0 | 0 |
| 165 | Alcatraz Avenue / Baker Street | two_way_stop | 2 | 0 | 0 | 0 |
| 331 | 52nd Street / Martin Luther King Junior Way | signal | 2 | 0 | 0 | 0 |

## Entry backlog by origin node at end of run (top 10)

| Node | Streets | Trips waiting | Offered veh/h (before scale) |
| --- | --- | --- | --- |
| 323 | 52nd Street / West Street | 1 | 14 |

## Flow on key streets (veh/h per direction, study-area links of 40 m or more)

| Street | Direction of travel | Links | Median flow | Max flow |
| --- | --- | --- | --- | --- |
| Telegraph | N | 12 | 656 | 716 |
| Telegraph | S | 10 | 595 | 644 |
| College | N | 3 | 196 | 196 |
| College | S | 3 | 522 | 523 |
| Claremont | N | 6 | 274 | 440 |
| Claremont | S | 7 | 170 | 454 |
| Alcatraz | E | 6 | 354 | 373 |
| Alcatraz | W | 6 | 242 | 290 |
| Hillegass | N | 4 | 71 | 95 |
| Hillegass | S | 4 | 82 | 92 |
| Colby | N | 7 | 80 | 85 |
| Colby | S | 7 | 79 | 98 |
| Martin | E | 2 | 84 | 84 |
| Martin | W | 2 | 67 | 67 |

## Largest demand origins (offered, before scale)

| Node | Streets | Veh/h |
| --- | --- | --- |
| 602 | Grove Shafter Freeway | 2564 |
| 265 | Ashby Avenue | 781 |
| 943 | Telegraph Avenue / Ward Street | 688 |
| 1672 | Warren Freeway | 682 |
| 183 | San Pablo Avenue | 553 |
| 763 | Telegraph Avenue | 479 |
| 577 | Martin Luther King Junior Way | 323 |
| 1719 | Grove Shafter Freeway | 284 |
| 974 | Broadway | 280 |
| 1756 | Claremont Avenue | 275 |
