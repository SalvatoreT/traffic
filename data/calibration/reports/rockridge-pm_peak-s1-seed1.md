# Calibration report: rockridge pm_peak scale 1 seed 1 (60 min)

Offered demand 27244 veh/h x scale 1 = 27244 veh/h. Run took 30.9 s wall clock. Flow tables use the window after a 10 min warm-up; select-link and health figures cover the whole run from an empty network.

## Stability (design D4)

| Criterion | Threshold | Value | Result |
| --- | --- | --- | --- |
| Gridlock removals | 0 | 0 | pass |
| Backlog / spawned | < 2% | 0.3% (81 of 27101) | pass |
| Arterial mean speed (run) | > 4 m/s | 8.29 m/s (last 15 min 8.28) | pass |

Overall: **STABLE**. Mean trip delay 164 s, mean trip time 413 s, completed 27051, unroutable 0.

| t (min) | vehicles in network | backlog | completed | removals | arterial speed in interval (m/s) |
| --- | --- | --- | --- | --- | --- |
| 5 | 3067 | 15 | 2336 | 0 | 8.71 |
| 10 | 3014 | 16 | 4591 | 0 | 8.35 |
| 15 | 3189 | 8 | 6754 | 0 | 8.26 |
| 20 | 3209 | 27 | 9000 | 0 | 8.09 |
| 25 | 3242 | 37 | 11298 | 0 | 8.51 |
| 30 | 3246 | 36 | 13568 | 0 | 8.50 |
| 35 | 3129 | 51 | 15914 | 0 | 8.21 |
| 40 | 3163 | 75 | 18105 | 0 | 8.02 |
| 45 | 3048 | 71 | 20340 | 0 | 8.06 |
| 50 | 3221 | 68 | 22478 | 0 | 8.43 |
| 55 | 3207 | 78 | 24744 | 0 | 8.26 |
| 60 | 3174 | 81 | 27051 | 0 | 8.14 |
## Wandering (completed car trips)

Detour ratio = distance driven (link and movement lengths) over the shortest network distance from the trip's origin to its destination. Detour against the free-flow route uses the time-shortest route with no congestion and no noise, which is what a purposeful driver without live information would follow (it differs from the shortest distance when a faster, longer road exists). A switch is a change of the remaining route while en route. Loops: the same link twice or the same node three or more times. Reversals: a link followed by its reverse within 200 m. 'Study-area vehicle-miles' are miles driven on links inside the study area; the last column is the share of them driven by trips with a detour ratio above 1.3. Guided drivers re-evaluate their route every epoch; the others keep their departure route unless it is blocked.

| Trips | n | Switches per trip | With a switch | Mean detour | Median detour | Detour > 1.3 | Detour > 2 | Mean detour vs free-flow route | Vs free-flow route > 1.3 | Loops | Reversals | Study veh-miles | Of them by detour > 1.3 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| all trips | 24812 | 0.03 | 2.4% | 1.095 | 1.058 | 5.7% | 0.0% | 1.033 | 2.8% | 0.0% | 0.4% | 2539 | 9.2% |
| gate to gate | 8636 | 0.04 | 4.0% | 1.095 | 1.064 | 4.9% | 0.0% | 1.029 | 2.4% | 0.0% | 0.2% | 658 | 13.6% |
| with a local end | 16176 | 0.02 | 1.6% | 1.094 | 1.054 | 6.1% | 0.1% | 1.035 | 3.0% | 0.0% | 0.6% | 1881 | 7.6% |
| guided drivers | 11362 | 0.05 | 5.1% | 1.095 | 1.056 | 5.9% | 0.1% | 1.033 | 2.8% | 0.0% | 0.4% | 1119 | 9.7% |
| other drivers | 13450 | 0.00 | 0.2% | 1.095 | 1.058 | 5.5% | 0.0% | 1.032 | 2.8% | 0.0% | 0.4% | 1420 | 8.7% |

## Reported patterns (diagnostics; configured in the targets file under `patterns`)

(a) Trips between the surface gates on the north side of the ramps and the freeway mainline gates, and the local-street (residential and service links in the study area) vehicle-miles they drive. Share = of all completed trips' local-street vehicle-miles (452 miles). No observed counterpart exists for this quantity (the targets file has only the select-link shares above).

| Trips | n trips | Local-street veh-miles | Share of all local-street veh-miles |
| --- | --- | --- | --- |
| surface gates to the freeway | 997 | 29.8 | 7% |
| freeway to the surface gates | 1159 | 36.6 | 8% |

(b) Corridor trips: completed trips from beyond one end of the corridor's study-area extent (the bypass street and its arterial together) to beyond the other end, within a lateral limit of the corridor, by direction. 'Bypass' = at least N blocks (links) on the bypass street; 'arterial' = fewer bypass blocks and at least N on the arterial; 'other' = neither (another street, the freeway or a short use); blocks are counted on the corridor's study-area links. No observed counterpart exists for these shares. The related observed values are in the select-link table above: northbound Hillegass Ave traffic rarely ends on College Ave (6%), 21 to 33% jogs to Benvenue Ave, and southbound freeway-bound drivers on College Ave commonly arrive via Ashby Ave and Benvenue Ave and jog to Hillegass Ave.

| Bypass | Arterial | N | Direction | Corridor trips | Bypass | Arterial | Other | Mean bypass blocks |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue | College Avenue | 3 | N | 1547 | 2% | 10% | 87% | 0.1 |
| Hillegass Avenue | College Avenue | 3 | S | 1361 | 3% | 16% | 81% | 0.1 |

## Per-mode results

Offered: 27244 car veh/h; 626 bicycle flows (764/h); 2000 pedestrian flows (2907/h). Bicycle and pedestrian volumes are assumptions, not counts.

| Mode | In network | Completed | Mean time (s) | Other |
| --- | --- | --- | --- | --- |
| Car | 3174 | 27051 | 413 | |
| Bicycle | 54 | 787 | 272 | |
| Pedestrian | 347 | 2867 | 422 | mean crossing delay 7.8 s |

Pedestrian crosswalks at node 851: 130 completed in minutes 10.0 to 60.0, 156.0 per hour against 150.5 observed.

Vulnerable road users (surrogate indicators): pedestrian conflicts 475, bicycle conflicts 1103, close passes 604, pedestrian injury severity mean 0.042 (AIS4+, 17383 supported of 17383 encounters), cyclist injury severity mean 0.070 (MAIS3+F, 3800 supported of 7617 encounters) (separate endpoints, never summed), mean vehicle speed at pedestrian encounters 2.25 m/s.


## Volunteer whole-street counts

Each car counts once when it passes the last stop line after driving the full directed corridor in order. The measurement window is 50.0 minutes. The last two columns describe trips that visited any corridor link during the full run.

| Corridor | Counted whole street (veh/h) | Modeled whole street (veh/h) | Used in fit | Through trips on any link (veh/h) | Freeway trips on any link (veh/h) |
| --- | --- | --- | --- | --- | --- |
| Hillegass Avenue NB | 48 | 37 | yes | 81 | 107 |
| Colby Street NB | 102 | 101 | yes | 141 | 141 |
| Hillegass Avenue SB | 79 | 47 | yes | 104 | 76 |
| Colby Street SB | 39 | 56 | yes | 134 | 113 |

## Intent map: through cars by where they come from and where they are going

Through = neither trip end is in the study area. Groups are the approach groups of the area config (data/areas); a node that is not a gate takes the group of the nearest surface gate (ASSUMPTION). The arterial is the one a trip would use on the shortest free-flow path with the study area's residential and service streets closed, where that path runs on a boundary street near the study area.

Model figures are the mean of 1 seed(s), per hour of the run. Basis: OBSERVED = read from the resident volunteer count of Feb 25, 2025 or its headline shares; ASSUMPTION = inferred from those numbers or chosen.

### Colby Street NB

Observed: block volume 174 veh/h, whole-street cars 102, so through cars 102 to 145 veh/h. Model: 141 through cars per hour.

Observed (PM): 182 cars entered at the south end, 102 drove the whole street, 164 left it at Alcatraz Ave (131 left, 32 right, 1 straight), and 47% of the block's trips came from a freeway (the headline share). ASSUMPTION: freeway-origin cars that do not end along the street are 65 veh/h (the 82 freeway-origin trips on the block, 47% of 174, times the 182 / (182 + 47) of its cars that entered at the south end rather than joining on the way), spread over the 164 exits in proportion (0.40); the other through cars come from the Telegraph Ave and south-side approaches that feed the street's south end. Ranges: low = 131 (32) x 0.47 x 0.62 (the whole-street share of exits), high = 131 (32) x 0.47.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | OBSERVED turn count x ASSUMPTION share (131 left turns x 0.40) | 52 (38 to 62) | 70 | above |
| Telegraph Ave and south-side traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | ASSUMPTION: the through left-turners (131 x 0.62 = 81) that are not off-ramp traffic | 29 (19 to 43) | 33 | within |
| SR-24 off-ramp traffic using Colby St to reach College Ave and Berkeley (right at Alcatraz Ave) | OBSERVED turn count x ASSUMPTION share (32 right turns x 0.40) | 13 (9 to 15) | 15 | within |
| Telegraph Ave and south-side traffic using Colby St to reach College Ave and Berkeley | ASSUMPTION: the through right-turners (32 x 0.62 = 20) that are not off-ramp traffic | 7 (5 to 11) | 19 | above |
| Intents listed, together | | 101 (71 to 131) | 137 | |
| Other through cars (no intent listed) | | | 4 | |

Model through cars by origin and destination group (largest 12 of 20 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 70.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 12.0 | Claremont Avenue then College Avenue |
| Telegraph Ave to the south (downtown Oakland) | Telegraph Ave from the north (Berkeley) | 11.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 7.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 7.0 | SR-24 then Claremont Avenue |
| Telegraph Ave to the south (downtown Oakland) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 6.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Ashby Ave from the west (Emeryville and I-80) | 5.0 | none near the study area |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 5.0 | SR-24 |
| West Oakland to the southwest (Adeline St, Market St) | Telegraph Ave from the north (Berkeley) | 4.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | College Ave from the north (Berkeley) | 3.0 | SR-24 then Claremont Avenue then College Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 2.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Claremont Ave and Tunnel Rd toward the hills | 1.0 | Telegraph Avenue then Alcatraz Avenue then Claremont Avenue |
| other pairs | | 8.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 101 veh/h; Claremont Avenue then College Avenue 12 veh/h; SR-24 then Claremont Avenue 7 veh/h; none near the study area 7 veh/h; SR-24 5 veh/h; Claremont Avenue 3 veh/h.

### Hillegass Avenue NB

Observed: block volume 110 veh/h, whole-street cars 48, so through cars 48 to 95 veh/h. Model: 81 through cars per hour.

Observed (PM): 94 cars entered at the south end, 48 drove the whole street, 109 left it at Alcatraz Ave (43 west, 54 east, 12 straight), and 47% of the block's trips came from a freeway. ASSUMPTION: freeway-origin through cars are 40 veh/h (52 freeway-origin trips times 94 / (94 + 29)), spread over the exits in proportion (0.37); the through share of exits is 48 / 109 = 0.44.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Hillegass Ave to reach Alcatraz Ave west and Telegraph Ave north | OBSERVED turn count x ASSUMPTION share (43 left turns x 0.37) | 16 (9 to 20) | 18 | within |
| SR-24 off-ramp traffic using Hillegass Ave to reach College Ave and Berkeley | OBSERVED turn count x ASSUMPTION share (54 right turns x 0.37) | 20 (11 to 25) | 36 | above |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach Alcatraz Ave west | ASSUMPTION: through exits (43 x 0.44) that are not off-ramp traffic | 3 (0 to 10) | 5 | within |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach College Ave and Berkeley | ASSUMPTION: through exits (54 x 0.44) that are not off-ramp traffic | 4 (0 to 13) | 11 | within |
| Intents listed, together | | 43 (20 to 68) | 70 | |
| Other through cars (no intent listed) | | | 11 | |

Model through cars by origin and destination group (largest 12 of 23 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 21.0 | SR-24 |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 12.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 6.0 | SR-24 then Claremont Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | College Ave from the north (Berkeley) | 6.0 | SR-24 then Claremont Avenue then College Avenue |
| Telegraph Ave to the south (downtown Oakland) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 5.0 | Telegraph Avenue |
| College Ave from the north (Berkeley) | Alcatraz Ave from the west (Emeryville side) | 4.0 | College Avenue then Alcatraz Avenue |
| College Ave from the north (Berkeley) | West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) | 3.0 | College Avenue then Alcatraz Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 3.0 | Claremont Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 3.0 | Claremont Avenue then Alcatraz Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Claremont Ave and Tunnel Rd toward the hills | 2.0 | Telegraph Avenue then Alcatraz Avenue then Claremont Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 2.0 | Claremont Avenue then College Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Emeryville and West Oakland streets (55th to 67th Streets) | 2.0 | College Avenue then Alcatraz Avenue then Telegraph Avenue |
| other pairs | | 12.0 | |

By the arterial these cars would otherwise use: SR-24 22 veh/h; Telegraph Avenue 20 veh/h; College Avenue then Alcatraz Avenue 7 veh/h; SR-24 then Claremont Avenue 6 veh/h; SR-24 then Claremont Avenue then College Avenue 6 veh/h; Claremont Avenue then Alcatraz Avenue 4 veh/h.

### Hillegass Avenue SB

Observed: block volume 160 veh/h, whole-street cars 79, so through cars 79 to 120 veh/h. Model: 104 through cars per hour.

Observed (PM): 178 cars entered at the top (76 turned in from Alcatraz Ave west, 98 from the east, 4 came straight from the north), 79 drove the whole street, and 68% of the block's trips (109 veh/h) went to a freeway. ASSUMPTION: freeway-bound cars that did not join mid-street are 87 veh/h (109 x 178 / (178 + 44)), half of the 174 turn-ins; low = the whole-street share of the turn-ins (0.45), high = the freeway-bound share without the mid-street correction (0.63).

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Telegraph Ave, Alcatraz Ave west and West Berkeley traffic turning off Alcatraz Ave onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (76 turn-ins x 0.50) | 38 (34 to 48) | 35 | within |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (98 turn-ins x 0.50) | 49 (44 to 62) | 35 | below |
| Intents listed, together | | 87 (78 to 110) | 70 | |
| Other through cars (no intent listed) | | | 34 | |

Model through cars by origin and destination group (largest 12 of 17 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 35.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 14.0 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 13.0 | Claremont Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 8.0 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | College Ave from the north (Berkeley) | 7.0 | College Avenue |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 6.0 | College Avenue then Claremont Avenue then SR-24 |
| Shattuck Ave from the north (Berkeley) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 5.0 | Claremont Avenue |
| Emeryville and West Oakland streets (55th to 67th Streets) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 5.0 | Alcatraz Avenue then College Avenue |
| Ashby Ave from the west (Emeryville and I-80) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 2.0 | Alcatraz Avenue then College Avenue |
| Berkeley hills to the northeast (Evergreen Ln, Gravatt Dr) | SR-24 westbound on-ramps (toward Oakland and I-980) | 2.0 | SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Claremont Ave and Tunnel Rd toward the hills | 1.0 | Telegraph Avenue then Alcatraz Avenue then Claremont Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | College Ave from the north (Berkeley) | 1.0 | Telegraph Avenue then Alcatraz Avenue then College Avenue |
| other pairs | | 5.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 59 veh/h; Claremont Avenue then SR-24 13 veh/h; Alcatraz Avenue then College Avenue 7 veh/h; Claremont Avenue 7 veh/h; College Avenue 7 veh/h; College Avenue then Claremont Avenue then SR-24 6 veh/h.

### Colby Street SB

Observed: block volume 160 veh/h, whole-street cars 39, so through cars 39 to 117 veh/h. Model: 134 through cars per hour.

Observed (PM): 139 cars entered at the top (76 from Alcatraz Ave west, 50 from the east, 13 from the north), 39 drove the whole street, 45% of the block's trips (72 veh/h) went to a freeway and 22% came by way of Telegraph Ave. ASSUMPTION: freeway-bound cars that did not join mid-street are 46 veh/h (72 x 139 / (139 + 79)), 0.365 of the 126 turn-ins; low = the whole-street share (0.31), high = the unadjusted freeway share (0.57). The Telegraph Ave cars are the 22% x 160 = 35 of the 76 west turn-ins.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Southbound Telegraph Ave traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (35 Telegraph Ave cars x 0.365) | 13 (11 to 20) | 19 | within |
| Alcatraz Ave west, Ashby Ave and West Berkeley traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (41 other west turn-ins x 0.365) | 15 (13 to 23) | 30 | above |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (50 east turn-ins x 0.365) | 18 (15 to 29) | 29 | within |
| Intents listed, together | | 46 (39 to 72) | 78 | |
| Other through cars (no intent listed) | | | 56 | |

Model through cars by origin and destination group (largest 12 of 27 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 25.0 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 17.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 16.0 | Telegraph Avenue |
| Shattuck Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 14.0 | none near the study area |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 7.0 | College Avenue then Claremont Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Telegraph Ave to the south (downtown Oakland) | 6.0 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 6.0 | Claremont Avenue then SR-24 |
| Telegraph Ave from the north (Berkeley) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 5.0 | Telegraph Avenue |
| Ashby Ave from the west (Emeryville and I-80) | SR-13 Warren Freeway (via SR-24 east) | 4.0 | SR-24 |
| Ashby Ave from the west (Emeryville and I-80) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 4.0 | SR-24 |
| Emeryville and West Oakland streets (55th to 67th Streets) | SR-24 westbound on-ramps (toward Oakland and I-980) | 4.0 | none near the study area |
| San Pablo Ave (Emeryville and West Oakland) | Claremont Ave and Tunnel Rd toward the hills | 3.0 | Alcatraz Avenue then Claremont Avenue |
| other pairs | | 23.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 70 veh/h; none near the study area 25 veh/h; SR-24 10 veh/h; College Avenue then Claremont Avenue then SR-24 7 veh/h; Claremont Avenue then SR-24 6 veh/h; Claremont Avenue 5 veh/h.

### Study area, all residential and service streets

Model: 694 through cars per hour.

Model through cars by origin and destination group (largest 12 of 69 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 76.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 64.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 59.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 49.0 | Claremont Avenue then College Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 44.0 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 42.0 | Telegraph Avenue |
| Emeryville and West Oakland streets (55th to 67th Streets) | SR-24 westbound on-ramps (toward Oakland and I-980) | 29.0 | none near the study area |
| Shattuck Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 22.0 | none near the study area |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 22.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 21.0 | SR-24 |
| Telegraph Ave from the north (Berkeley) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 19.0 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 17.0 | Claremont Avenue then SR-24 |
| other pairs | | 230.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 371 veh/h; none near the study area 73 veh/h; Claremont Avenue then College Avenue 51 veh/h; Claremont Avenue 46 veh/h; SR-24 35 veh/h; Alcatraz Avenue then Claremont Avenue 24 veh/h.

By origin group: Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 141; SR-24 eastbound off-ramps (arriving from Oakland and I-980) 129; South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 115; Telegraph Ave from the north (Berkeley) 75; Emeryville and West Oakland streets (55th to 67th Streets) 63; Shattuck Ave from the north (Berkeley) 33; Telegraph Ave to the south (downtown Oakland) 29; College Ave from the north (Berkeley) 24; Claremont Ave and Tunnel Rd toward the hills 19; San Pablo Ave (Emeryville and West Oakland) 17.

By destination group: SR-24 westbound on-ramps (toward Oakland and I-980) 198; Telegraph Ave from the north (Berkeley) 143; Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 113; South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 95; Claremont Ave and Tunnel Rd toward the hills 56; College Ave from the north (Berkeley) 26; Ashby Ave from the west (Emeryville and I-80) 13; Alcatraz Ave from the west (Emeryville side) 10; Telegraph Ave to the south (downtown Oakland) 9; SR-24 eastbound on-ramps (toward the Caldecott Tunnel) 7.


## Through cars by intent (cut-through intent view)

A through car is tallied once, under the first intent that fits it (the on-ramp on its planned route, the off-ramp it has driven, or the origin and destination groups of its trip), at the moment the through count counts it. Cars an hour over the run, the same window as the through-car figure (693 an hour).

| Intent | Basis | Cars an hour | Share |
| --- | --- | --- | --- |
| on-2853241697 | observed | 198 | 29% |
| Other on-ramps | assumed | 12 | 2% |
| off-52990846 | observed | 129 | 19% |
| Other off-ramps | assumed | 10 | 1% |
| Downtown, south and west Oakland traffic using side streets to reach Berkeley and Telegraph Ave north | assumed | 134 | 19% |
| Berkeley and Telegraph Ave north traffic using side streets to reach downtown, south and west Oakland | assumed | 87 | 13% |
| Oakland cross-town traffic (West Oakland, Broadway, Piedmont, Emeryville) using side streets near Claremont Ave and Telegraph Ave | assumed | 19 | 3% |
| Other (no intent listed) |  | 104 | 15% |

Intents listed cover 85% of through cars.


## Select-link shares: modeled vs observed (design D5: headline = freeway shares, tolerance +/-10 pp)

- Hillegass Avenue NB: 4 links (path Claremont Avenue -> Alcatraz Avenue (434 m)), 229 trips (210 completed)
- Colby Street NB: 8 links (path Claremont Avenue -> Alcatraz Avenue (680 m)), 292 trips (264 completed)
- Hillegass Avenue SB: 4 links (path Alcatraz Avenue -> Claremont Avenue (433 m)), 174 trips (154 completed)
- Colby Street SB: 8 links (path Alcatraz Avenue -> Claremont Avenue (680 m)), 233 trips (217 completed)

| Block | Side | Via | Observed | Modeled | Diff (pp) | n trips | Headline |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue NB | from | freeway | 47% | 47% | -0 | 229 | within |
| Hillegass Avenue NB | to | Benvenue Avenue | 21% (PM 33%) | 3% | -30 | 229 |  |
| Hillegass Avenue NB | to | College Avenue | 6% | 9% | +3 | 229 |  |
| Hillegass Avenue NB | to | Alcatraz Avenue WB | 27% | 29% | +2 | 229 |  |
| Colby Street NB | from | freeway | 47% | 46% | -1 | 292 | within |
| Colby Street NB | to | Alcatraz Avenue WB | 48% | 53% | +5 | 292 |  |
| Colby Street NB | to | Telegraph Avenue | 25% | 46% | +21 | 292 |  |
| Colby Street NB | to | College Avenue | 3% | 7% | +4 | 292 |  |
| Hillegass Avenue SB | from | Alcatraz Avenue WB | 46% | 26% | -20 | 174 |  |
| Hillegass Avenue SB | from | Benvenue Avenue | 26% | 6% | -20 | 174 |  |
| Hillegass Avenue SB | from | College Avenue | 16% | 13% | -3 | 174 |  |
| Hillegass Avenue SB | to | freeway | 57% (PM 68%) | 44% | -24 | 174 | OUTSIDE |
| Colby Street SB | from | Alcatraz Avenue EB | 43% | 25% | -18 | 233 |  |
| Colby Street SB | from | Alcatraz Avenue WB | 46% | 16% | -30 | 233 |  |
| Colby Street SB | from | Telegraph Avenue | 22% | 23% | +1 | 233 |  |
| Colby Street SB | to | freeway | 45% | 45% | +0 | 233 | within |
| Colby Street SB | to | Forest Street | 34% | 18% | -16 | 233 |  |

Headline shares within tolerance: 3 of 4. Observed column uses the PM-peak share where one is given and the period is pm_peak. 'Via' shares are the fraction of select-link trips using that street before (from) or after (to) the block; freeway = origin / destination gate with a motorway-class link attached.

## Claremont ramps: streets used before the on-ramp / after the off-ramp

Observed shares are for traffic from/to the north only. 'Modeled' is over all trips on the ramps and any visit to the street (an upper bound for streets that serve both sides). 'Modeled, side' counts only trips whose surface end lies on the side of the ramp stated in the targets file (`freewayRamp.side`), and for a street with a qualifier ("north of X") only its links on that side of X.

| Direction | Via | Observed | Modeled | n ramp trips | Modeled, side | n side trips |
| --- | --- | --- | --- | --- | --- | --- |
| onto freeway | College Avenue | 16% | 14% | 788 | 15% | 694 |
| onto freeway | Hillegass Avenue | 12% | 11% | 788 | 13% | 694 |
| onto freeway | Martin Street | 10% | 12% | 788 | 13% | 694 |
| onto freeway | Colby Street | 8% | 12% | 788 | 14% | 694 |
| onto freeway | Telegraph Avenue north of Alcatraz Avenue | 8% | 15% | 788 | 11% | 694 |
| onto freeway | Benvenue Avenue | 5% | 4% | 788 | 5% | 694 |
| from freeway | College Avenue | 10% | 9% | 743 | 9% | 719 |
| from freeway | Martin Street | 10% | 13% | 743 | 14% | 719 |
| from freeway | Colby Street | 8% | 14% | 743 | 15% | 719 |
| from freeway | Hillegass Avenue | 5% | 8% | 743 | 9% | 719 |
| from freeway | Benvenue Avenue | 3% | 4% | 743 | 4% | 719 |

## Top 15 links by delay

| Link | Street | Class | Lanes | Len (m) | End node control | Delay (veh-h) | Stopped (veh-h) | Mean stopped veh | Flow (veh/h) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 4175 | (unnamed) | Motorway | 2 | 142 | uncontrolled | 23.62 | 4.28 | 4.3 | 1532 |
| 460 | Sacramento Street | Tertiary | 2 | 104 | two_way_stop | 10.66 | 9.05 | 9.1 | 384 |
| 4167 | (unnamed) | Motorway | 3 | 75 | uncontrolled | 9.23 | 2.88 | 2.9 | 2630 |
| 4397 | Ashby Avenue | Primary | 2 | 96 | signal | 8.71 | 6.87 | 6.9 | 486 |
| 1051 | Adeline Street | Secondary | 4 | 50 | signal | 8.32 | 7.11 | 7.1 | 1247 |
| 3457 | The Uplands | Tertiary | 1 | 151 | two_way_stop | 8.08 | 5.24 | 5.2 | 340 |
| 1049 | Adeline Street | Secondary | 4 | 43 | signal | 7.59 | 6.13 | 6.1 | 1434 |
| 1108 | Market Street | Secondary | 4 | 36 | signal | 7.43 | 6.26 | 6.3 | 1100 |
| 711 | 55th Street | Tertiary | 1 | 238 | signal | 7.35 | 5.66 | 5.7 | 310 |
| 1607 | Telegraph Avenue | Secondary | 2 | 94 | signal | 7.35 | 4.46 | 4.5 | 1312 |
| 3395 | Ashby Avenue | Primary | 1 | 129 | signal | 7.24 | 5.78 | 5.8 | 485 |
| 1604 | Telegraph Avenue | Secondary | 2 | 94 | signal | 7.01 | 5.43 | 5.4 | 805 |
| 1666 | 52nd Street | Secondary | 4 | 39 | signal | 6.91 | 6.16 | 6.2 | 721 |
| 1025 | Martin Luther King Junior Way | Secondary | 3 | 79 | signal | 6.77 | 5.37 | 5.4 | 985 |
| 704 | Martin Luther King Junior Way | Secondary | 4 | 68 | signal | 6.71 | 5.17 | 5.2 | 1519 |

## Top 15 nodes by blocked time

Blocked time = lane-head seconds waiting at the stop line without permission (signal red, conflict, stop sign or no downstream space).

| Node | Streets | Control | Gate | Blocked (lane-h) | of which no downstream space | Signal plan at end (cycle: greens) |
| --- | --- | --- | --- | --- | --- | --- |
| 447 | Adeline Street / Alcatraz Avenue | signal |  | 5.52 | 0.12 | 75 s: 28/37 |
| 446 | Market Street / Stanford Avenue | signal |  | 5.49 | 0.29 | 75 s: 36/29 |
| 680 | 52nd Street / Shattuck Avenue | signal |  | 5.05 | 0.09 | 110 s: 30/28/38 |
| 331 | 52nd Street / Martin Luther King Junior Way | signal |  | 4.38 | 0.02 | 75 s: 34/31 |
| 1080 | 62nd Street / Claremont Avenue / College Avenue | signal |  | 3.91 | 0.08 | 75 s: 16/29/15 |
| 479 | Adeline Street / Martin Luther King Junior Way / Stanford Avenue | signal |  | 3.85 | 0.03 | 75 s: 47/18 |
| 1406 | Ashby Avenue / Claremont Avenue | signal |  | 3.74 | 0.13 | 75 s: 28/17/15 |
| 37 | San Pablo Avenue / Stanford Avenue | signal |  | 3.50 | 0.02 | 75 s: 21/44 |
| 185 | Alcatraz Avenue / Sacramento Street | signal |  | 3.31 | 0.07 | 75 s: 26/39 |
| 851 | Alcatraz Avenue / Telegraph Avenue | signal |  | 3.30 | 0.05 | 75 s: 46/19 |
| 713 | 51st Street / Telegraph Avenue | signal |  | 3.21 | 0.03 | 75 s: 38/27 |
| 30 | 57th Street / Adeline Street / Market Street | signal |  | 3.19 | 0.02 | 80 s: 24/15/25 |
| 944 | Ashby Avenue / Shattuck Avenue | signal |  | 3.14 | 0.03 | 75 s: 49/16 |
| 332 | 55th Street / Martin Luther King Junior Way | signal |  | 3.02 | 0.06 | 75 s: 32/33 |
| 242 | Ashby Avenue / Martin Luther King Junior Way | signal |  | 2.97 | 0.00 | 75 s: 34/31 |

Phases of the five most blocked signals (green s: approach links with their lanes, link ids in brackets):

- node 447: 28 s: Adeline Street 4L [1049], Adeline Street 4L [1051]; 37 s: Alcatraz Avenue 2L [1048], Alcatraz Avenue 2L [1133]
- node 446: 36 s: Stanford Avenue 3L [941], Stanford Avenue 3L [1055]; 29 s: Market Street 4L [1108], Market Street 3L [1111]
- node 680: 30 s: 52nd Street 4L [1662]; 28 s: 52nd Street 4L [1666], 52nd Street 4L [1662]; 38 s: Shattuck Avenue 2L [1653], Shattuck Avenue 2L [1705]
- node 331: 34 s: Martin Luther King Junior Way 4L [704], Martin Luther King Junior Way 4L [761]; 31 s: 52nd Street 2L [758], 52nd Street 1L [760]
- node 1080: 16 s: Claremont Avenue 2L [2756], Claremont Avenue 2L [2798]; 29 s: College Avenue 2L [2761], College Avenue 2L [2819]; 15 s: 62nd Street 1L [2622]

## Cars cleared from gridlock near and far (judged zone)

Judged zone: the study area, its bounding streets and the junctions on them, plus nodes within 200 m of it along the network (111 nodes, 329 links). A far clearing counts against the stability rule when its blocking chain (vehicles held at least 60 s by a full exit, at the 5 s snapshot before it) reaches a link in the zone.

| Buffer (m) | Near | Far | Far, chain reaches the zone | Judged |
| --- | --- | --- | --- | --- |
| 100.0 | 0 | 0 | 0 | 0 |
| 200.0 | 0 | 0 | 0 | 0 |
| 400.0 | 0 | 0 | 0 | 0 |

Entry backlog at the end of the run: 2 trips waiting at origins in the zone, of 81 in all.

| Bounding street | Links | Longest standing queue on one link (m) | Link (length m) | At (min) | Share of samples with a link full |
| --- | --- | --- | --- | --- | --- |
| Telegraph Avenue | 28 | 75.0 | 1604 (94.0) | 14.6 | 0.0 |
| Alcatraz Avenue | 14 | 91.0 | 4238 (84.0) | 31.0 | 0.008 |
| College Avenue | 6 | 72.0 | 2805 (102.0) | 30.4 | 0.018 |
| Claremont Avenue | 13 | 52.0 | 2776 (161.0) | 54.6 | 0.0 |
| CA 24 | 3 | 49.0 | 1945 (188.0) | 48.9 | 0.0 |

## Junction recovery

Policy `physical`. Node entries by cars and cyclists in the run: 840608 (settle interval 0). An admission is an entry the ordinary rule would have refused; head-seconds count the time a waiting head vehicle had the reason invoked, and the part of it in which it still could not enter. Courtesy and the yield fallback change priority only; under `physical` the conflict bypass never admits.

| Reason | Admissions per hour | Per 1,000 entries | Head-s invoked | Head-s blocked |
| --- | --- | --- | --- | --- |
| courtesy | 194.0 | 0.231 | 1295 | 1234 |
| yield fallback | 130.0 | 0.155 | 41 | 0 |
| conflict bypass | 0.0 | 0.000 | 23 | 23 |

Vehicles removed while held in a node by a full exit: 0 (0.0 per hour, included in the gridlock removals).

| Node | Streets | Control | Courtesy | Yield fallback | Conflict bypass | Held removals |
| --- | --- | --- | --- | --- | --- | --- |
| 342 | 56th Street / Shattuck Avenue | two_way_stop | 7 | 10 | 0 | 0 |
| 141 | 63rd Street / Lowell Street / Market Street | two_way_stop | 10 | 5 | 0 | 0 |
| 165 | Alcatraz Avenue / Baker Street | two_way_stop | 7 | 8 | 0 | 0 |
| 147 | 59th Street / Grace Avenue / Los Angeles Street | two_way_stop | 10 | 4 | 0 | 0 |
| 767 | 58th Street / Shattuck Avenue | two_way_stop | 7 | 7 | 0 | 0 |
| 492 | Aileen Street / Shattuck Avenue | two_way_stop | 6 | 6 | 0 | 0 |
| 766 | 57th Street / Shattuck Avenue | two_way_stop | 4 | 7 | 0 | 0 |
| 1152 | Ashby Avenue / Ashby Place / Elmwood Avenue | two_way_stop | 5 | 5 | 0 | 0 |
| 1429 | Claremont Avenue / Claremont Boulevard | two_way_stop | 10 | 0 | 0 | 0 |
| 796 | 63rd Street / Telegraph Avenue | two_way_stop | 3 | 6 | 0 | 0 |

## Entry backlog by origin node at end of run (top 10)

| Node | Streets | Trips waiting | Offered veh/h (before scale) |
| --- | --- | --- | --- |
| 602 | Grove Shafter Freeway | 72 | 3991 |
| 858 | 66th Street / Telegraph Avenue | 3 | 75 |
| 324 | 51st Street / Martin Luther King Junior Way | 1 | 509 |
| 460 | Alcatraz Avenue / Ellis Street | 1 | 24 |
| 667 | Forest Street / Locksley Avenue | 1 | 206 |
| 825 | 57th Street / Ayala Avenue | 1 | 17 |
| 1128 | Alcatraz Avenue / Benvenue Avenue | 1 | 32 |
| 1212 | Ashby Avenue / Benvenue Avenue | 1 | 22 |

## Flow on key streets (veh/h per direction, study-area links of 40 m or more)

| Street | Direction of travel | Links | Median flow | Max flow |
| --- | --- | --- | --- | --- |
| Telegraph | N | 12 | 1396 | 1424 |
| Telegraph | S | 10 | 953 | 1031 |
| College | N | 3 | 316 | 317 |
| College | S | 3 | 620 | 624 |
| Claremont | N | 6 | 482 | 752 |
| Claremont | S | 7 | 239 | 830 |
| Alcatraz | E | 6 | 524 | 587 |
| Alcatraz | W | 6 | 370 | 397 |
| Hillegass | N | 4 | 97 | 136 |
| Hillegass | S | 4 | 101 | 112 |
| Colby | N | 7 | 173 | 190 |
| Colby | S | 7 | 131 | 190 |
| Martin | E | 2 | 106 | 106 |
| Martin | W | 2 | 160 | 160 |

## Largest demand origins (offered, before scale)

| Node | Streets | Veh/h |
| --- | --- | --- |
| 602 | Grove Shafter Freeway | 3991 |
| 943 | Telegraph Avenue / Ward Street | 1226 |
| 265 | Ashby Avenue | 1134 |
| 974 | Broadway | 1124 |
| 1719 | Grove Shafter Freeway | 1026 |
| 183 | San Pablo Avenue | 933 |
| 763 | Telegraph Avenue | 742 |
| 1672 | Warren Freeway | 617 |
| 324 | 51st Street / Martin Luther King Junior Way | 509 |
| 104 | San Pablo Avenue | 422 |
