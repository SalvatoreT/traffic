# Calibration report: rockridge pm_peak scale 1 seed 1 (60 min)

Offered demand 27612 veh/h x scale 1 = 27612 veh/h. Run took 32.1 s wall clock. Flow tables use the window after a 10 min warm-up; select-link and health figures cover the whole run from an empty network.

## Stability (design D4)

| Criterion | Threshold | Value | Result |
| --- | --- | --- | --- |
| Gridlock removals | 0 | 7 | FAIL |
| Backlog / spawned | < 2% | 0.5% (134 of 27490) | pass |
| Arterial mean speed (run) | > 4 m/s | 7.73 m/s (last 15 min 7.24) | pass |

Overall: **NOT STABLE**. Mean trip delay 188 s, mean trip time 437 s, completed 26884, unroutable 0.

| t (min) | vehicles in network | backlog | completed | removals | arterial speed in interval (m/s) |
| --- | --- | --- | --- | --- | --- |
| 5 | 3291 | 8 | 2224 | 0 | 8.55 |
| 10 | 3246 | 7 | 4538 | 0 | 8.29 |
| 15 | 3263 | 19 | 6784 | 0 | 7.76 |
| 20 | 3331 | 13 | 9021 | 1 | 7.89 |
| 25 | 3432 | 21 | 11231 | 2 | 8.13 |
| 30 | 3449 | 51 | 13517 | 2 | 8.02 |
| 35 | 3497 | 39 | 15780 | 3 | 7.59 |
| 40 | 3610 | 47 | 17949 | 3 | 7.49 |
| 45 | 3650 | 54 | 20141 | 5 | 7.53 |
| 50 | 3783 | 74 | 22385 | 6 | 7.59 |
| 55 | 3809 | 93 | 24605 | 7 | 6.98 |
| 60 | 3723 | 134 | 26884 | 7 | 7.16 |
## Wandering (completed car trips)

Detour ratio = distance driven (link and movement lengths) over the shortest network distance from the trip's origin to its destination. Detour against the free-flow route uses the time-shortest route with no congestion and no noise, which is what a purposeful driver without live information would follow (it differs from the shortest distance when a faster, longer road exists). A switch is a change of the remaining route while en route. Loops: the same link twice or the same node three or more times. Reversals: a link followed by its reverse within 200 m. 'Study-area vehicle-miles' are miles driven on links inside the study area; the last column is the share of them driven by trips with a detour ratio above 1.3. Guided drivers re-evaluate their route every epoch; the others keep their departure route unless it is blocked.

| Trips | n | Switches per trip | With a switch | Mean detour | Median detour | Detour > 1.3 | Detour > 2 | Mean detour vs free-flow route | Vs free-flow route > 1.3 | Loops | Reversals | Study veh-miles | Of them by detour > 1.3 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| all trips | 24638 | 0.05 | 4.1% | 1.099 | 1.058 | 6.7% | 0.1% | 1.039 | 3.5% | 0.0% | 0.4% | 2533 | 9.4% |
| gate to gate | 8444 | 0.09 | 7.7% | 1.102 | 1.068 | 6.4% | 0.1% | 1.041 | 3.4% | 0.0% | 0.3% | 719 | 10.2% |
| with a local end | 16194 | 0.03 | 2.3% | 1.097 | 1.054 | 6.9% | 0.1% | 1.038 | 3.5% | 0.0% | 0.4% | 1814 | 9.1% |
| guided drivers | 11425 | 0.10 | 8.3% | 1.102 | 1.060 | 7.4% | 0.1% | 1.042 | 3.8% | 0.0% | 0.3% | 1174 | 9.7% |
| other drivers | 13213 | 0.01 | 0.5% | 1.096 | 1.057 | 6.1% | 0.1% | 1.037 | 3.2% | 0.0% | 0.4% | 1358 | 9.2% |

## Reported patterns (diagnostics; configured in the targets file under `patterns`)

(a) Trips between the surface gates on the north side of the ramps and the freeway mainline gates, and the local-street (residential and service links in the study area) vehicle-miles they drive. Share = of all completed trips' local-street vehicle-miles (465 miles). No observed counterpart exists for this quantity (the targets file has only the select-link shares above).

| Trips | n trips | Local-street veh-miles | Share of all local-street veh-miles |
| --- | --- | --- | --- |
| surface gates to the freeway | 1005 | 27.3 | 6% |
| freeway to the surface gates | 1284 | 33.9 | 7% |

(b) Corridor trips: completed trips from beyond one end of the corridor's study-area extent (the bypass street and its arterial together) to beyond the other end, within a lateral limit of the corridor, by direction. 'Bypass' = at least N blocks (links) on the bypass street; 'arterial' = fewer bypass blocks and at least N on the arterial; 'other' = neither (another street, the freeway or a short use); blocks are counted on the corridor's study-area links. No observed counterpart exists for these shares. The related observed values are in the select-link table above: northbound Hillegass Ave traffic rarely ends on College Ave (6%), 21 to 33% jogs to Benvenue Ave, and southbound freeway-bound drivers on College Ave commonly arrive via Ashby Ave and Benvenue Ave and jog to Hillegass Ave.

| Bypass | Arterial | N | Direction | Corridor trips | Bypass | Arterial | Other | Mean bypass blocks |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue | College Avenue | 3 | N | 1441 | 3% | 12% | 85% | 0.2 |
| Hillegass Avenue | College Avenue | 3 | S | 1350 | 5% | 22% | 73% | 0.2 |

## Per-mode results

Offered: 27612 car veh/h; 626 bicycle flows (764/h); 2000 pedestrian flows (2907/h). Bicycle and pedestrian volumes are assumptions, not counts.

| Mode | In network | Completed | Mean time (s) | Other |
| --- | --- | --- | --- | --- |
| Car | 3723 | 26884 | 437 | |
| Bicycle | 64 | 784 | 266 | |
| Pedestrian | 341 | 2843 | 425 | mean crossing delay 7.8 s |

Pedestrian crosswalks at node 851: 106 completed in minutes 10.0 to 60.0, 127.2 per hour against 150.5 observed.

Vulnerable road users (surrogate indicators): pedestrian conflicts 480, bicycle conflicts 1363, close passes 716, pedestrian injury severity mean 0.044 (AIS4+, 17251 supported of 17251 encounters), cyclist injury severity mean 0.067 (MAIS3+F, 4593 supported of 8745 encounters) (separate endpoints, never summed), mean vehicle speed at pedestrian encounters 2.35 m/s.


## Volunteer whole-street counts

Each car counts once when it passes the last stop line after driving the full directed corridor in order. The measurement window is 50.0 minutes. The last two columns describe trips that visited any corridor link during the full run.

| Corridor | Counted whole street (veh/h) | Modeled whole street (veh/h) | Used in fit | Through trips on any link (veh/h) | Freeway trips on any link (veh/h) |
| --- | --- | --- | --- | --- | --- |
| Hillegass Avenue NB | 48 | 59 | yes | 96 | 137 |
| Colby Street NB | 102 | 66 | yes | 119 | 112 |
| Hillegass Avenue SB | 79 | 82 | yes | 121 | 122 |
| Colby Street SB | 39 | 37 | yes | 117 | 103 |

## Intent map: through cars by where they come from and where they are going

Through = neither trip end is in the study area. Groups are the approach groups of the area config (data/areas); a node that is not a gate takes the group of the nearest surface gate (ASSUMPTION). The arterial is the one a trip would use on the shortest free-flow path with the study area's residential and service streets closed, where that path runs on a boundary street near the study area.

Model figures are the mean of 1 seed(s), per hour of the run. Basis: OBSERVED = read from the resident volunteer count of Feb 25, 2025 or its headline shares; ASSUMPTION = inferred from those numbers or chosen.

### Colby Street NB

Observed: block volume 174 veh/h, whole-street cars 102, so through cars 102 to 145 veh/h. Model: 119 through cars per hour.

Observed (PM): 182 cars entered at the south end, 102 drove the whole street, 164 left it at Alcatraz Ave (131 left, 32 right, 1 straight), and 47% of the block's trips came from a freeway (the headline share). ASSUMPTION: freeway-origin cars that do not end along the street are 65 veh/h (the 82 freeway-origin trips on the block, 47% of 174, times the 182 / (182 + 47) of its cars that entered at the south end rather than joining on the way), spread over the 164 exits in proportion (0.40); the other through cars come from the Telegraph Ave and south-side approaches that feed the street's south end. Ranges: low = 131 (32) x 0.47 x 0.62 (the whole-street share of exits), high = 131 (32) x 0.47.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | OBSERVED turn count x ASSUMPTION share (131 left turns x 0.40) | 52 (38 to 62) | 57 | within |
| Telegraph Ave and south-side traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | ASSUMPTION: the through left-turners (131 x 0.62 = 81) that are not off-ramp traffic | 29 (19 to 43) | 31 | within |
| SR-24 off-ramp traffic using Colby St to reach College Ave and Berkeley (right at Alcatraz Ave) | OBSERVED turn count x ASSUMPTION share (32 right turns x 0.40) | 13 (9 to 15) | 8 | below |
| Telegraph Ave and south-side traffic using Colby St to reach College Ave and Berkeley | ASSUMPTION: the through right-turners (32 x 0.62 = 20) that are not off-ramp traffic | 7 (5 to 11) | 19 | above |
| Intents listed, together | | 101 (71 to 131) | 115 | |
| Other through cars (no intent listed) | | | 4 | |

Model through cars by origin and destination group (largest 12 of 20 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 57.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 12.0 | College Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Telegraph Ave from the north (Berkeley) | 8.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Ashby Ave from the west (Emeryville and I-80) | 7.0 | none near the study area |
| Telegraph Ave to the south (downtown Oakland) | Telegraph Ave from the north (Berkeley) | 6.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 4.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) | 3.0 | Claremont Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 3.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | College Ave from the north (Berkeley) | 3.0 | SR-24 then Claremont Avenue then College Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Shattuck Ave from the north (Berkeley) | 2.0 | Claremont Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave to the south (downtown Oakland) | 2.0 | Claremont Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Berkeley hills to the northeast (Evergreen Ln, Gravatt Dr) | 2.0 | Claremont Avenue |
| other pairs | | 10.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 81 veh/h; Claremont Avenue 12 veh/h; College Avenue 12 veh/h; none near the study area 7 veh/h; SR-24 then Claremont Avenue then College Avenue 3 veh/h; SR-24 2 veh/h.

### Hillegass Avenue NB

Observed: block volume 110 veh/h, whole-street cars 48, so through cars 48 to 95 veh/h. Model: 96 through cars per hour.

Observed (PM): 94 cars entered at the south end, 48 drove the whole street, 109 left it at Alcatraz Ave (43 west, 54 east, 12 straight), and 47% of the block's trips came from a freeway. ASSUMPTION: freeway-origin through cars are 40 veh/h (52 freeway-origin trips times 94 / (94 + 29)), spread over the exits in proportion (0.37); the through share of exits is 48 / 109 = 0.44.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Hillegass Ave to reach Alcatraz Ave west and Telegraph Ave north | OBSERVED turn count x ASSUMPTION share (43 left turns x 0.37) | 16 (9 to 20) | 32 | above |
| SR-24 off-ramp traffic using Hillegass Ave to reach College Ave and Berkeley | OBSERVED turn count x ASSUMPTION share (54 right turns x 0.37) | 20 (11 to 25) | 41 | above |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach Alcatraz Ave west | ASSUMPTION: through exits (43 x 0.44) that are not off-ramp traffic | 3 (0 to 10) | 6 | within |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach College Ave and Berkeley | ASSUMPTION: through exits (54 x 0.44) that are not off-ramp traffic | 4 (0 to 13) | 11 | within |
| Intents listed, together | | 43 (20 to 68) | 90 | |
| Other through cars (no intent listed) | | | 6 | |

Model through cars by origin and destination group (largest 12 of 19 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 28.0 | SR-24 |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 25.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 6.0 | SR-24 then Claremont Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | College Ave from the north (Berkeley) | 6.0 | SR-24 then Claremont Avenue then College Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Ashby Ave from the west (Emeryville and I-80) | 5.0 | SR-24 then Telegraph Avenue |
| Telegraph Ave to the south (downtown Oakland) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 5.0 | Telegraph Avenue |
| College Ave from the north (Berkeley) | Shattuck Ave from the north (Berkeley) | 4.0 | College Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 3.0 | College Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 3.0 | Claremont Avenue then College Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Ashby Ave from the west (Emeryville and I-80) | 2.0 | Claremont Avenue |
| College Ave from the north (Berkeley) | Alcatraz Ave from the west (Emeryville side) | 1.0 | College Avenue then Alcatraz Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | College Ave from the north (Berkeley) | 1.0 | College Avenue |
| other pairs | | 7.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 32 veh/h; SR-24 29 veh/h; College Avenue 8 veh/h; SR-24 then Claremont Avenue 7 veh/h; SR-24 then Claremont Avenue then College Avenue 6 veh/h; SR-24 then Telegraph Avenue 5 veh/h.

### Hillegass Avenue SB

Observed: block volume 160 veh/h, whole-street cars 79, so through cars 79 to 120 veh/h. Model: 121 through cars per hour.

Observed (PM): 178 cars entered at the top (76 turned in from Alcatraz Ave west, 98 from the east, 4 came straight from the north), 79 drove the whole street, and 68% of the block's trips (109 veh/h) went to a freeway. ASSUMPTION: freeway-bound cars that did not join mid-street are 87 veh/h (109 x 178 / (178 + 44)), half of the 174 turn-ins; low = the whole-street share of the turn-ins (0.45), high = the freeway-bound share without the mid-street correction (0.63).

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Telegraph Ave, Alcatraz Ave west and West Berkeley traffic turning off Alcatraz Ave onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (76 turn-ins x 0.50) | 38 (34 to 48) | 42 | within |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (98 turn-ins x 0.50) | 49 (44 to 62) | 43 | below |
| Intents listed, together | | 87 (78 to 110) | 85 | |
| Other through cars (no intent listed) | | | 36 | |

Model through cars by origin and destination group (largest 12 of 15 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 42.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 21.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 19.0 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 14.0 | Claremont Avenue then SR-24 |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 6.0 | College Avenue then Claremont Avenue then SR-24 |
| West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) | College Ave from the north (Berkeley) | 4.0 | College Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | West Oakland to the southwest (Adeline St, Market St) | 3.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Telegraph Ave to the south (downtown Oakland) | 3.0 | Telegraph Avenue |
| Shattuck Ave from the north (Berkeley) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 2.0 | College Avenue |
| Telegraph Ave from the north (Berkeley) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 2.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-13 Warren Freeway (via SR-24 east) | 1.0 | none near the study area |
| College Ave from the north (Berkeley) | Alcatraz Ave from the west (Emeryville side) | 1.0 | College Avenue then Alcatraz Avenue |
| other pairs | | 3.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 90 veh/h; Claremont Avenue then SR-24 15 veh/h; College Avenue 6 veh/h; College Avenue then Claremont Avenue then SR-24 6 veh/h; none near the study area 3 veh/h; College Avenue then Alcatraz Avenue 1 veh/h.

### Colby Street SB

Observed: block volume 160 veh/h, whole-street cars 39, so through cars 39 to 117 veh/h. Model: 117 through cars per hour.

Observed (PM): 139 cars entered at the top (76 from Alcatraz Ave west, 50 from the east, 13 from the north), 39 drove the whole street, 45% of the block's trips (72 veh/h) went to a freeway and 22% came by way of Telegraph Ave. ASSUMPTION: freeway-bound cars that did not join mid-street are 46 veh/h (72 x 139 / (139 + 79)), 0.365 of the 126 turn-ins; low = the whole-street share (0.31), high = the unadjusted freeway share (0.57). The Telegraph Ave cars are the 22% x 160 = 35 of the 76 west turn-ins.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Southbound Telegraph Ave traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (35 Telegraph Ave cars x 0.365) | 13 (11 to 20) | 25 | above |
| Alcatraz Ave west, Ashby Ave and West Berkeley traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (41 other west turn-ins x 0.365) | 15 (13 to 23) | 16 | within |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (50 east turn-ins x 0.365) | 18 (15 to 29) | 18 | within |
| Intents listed, together | | 46 (39 to 72) | 59 | |
| Other through cars (no intent listed) | | | 58 | |

Model through cars by origin and destination group (largest 12 of 24 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 28.0 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 20.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 10.0 | Claremont Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Telegraph Ave to the south (downtown Oakland) | 8.0 | Telegraph Avenue |
| West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) | College Ave from the north (Berkeley) | 6.0 | College Avenue |
| Telegraph Ave from the north (Berkeley) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 6.0 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 5.0 | none near the study area |
| West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) | SR-24 westbound on-ramps (toward Oakland and I-980) | 4.0 | none near the study area |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 4.0 | Claremont Avenue then SR-24 |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 4.0 | College Avenue then Claremont Avenue then SR-24 |
| Shattuck Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 4.0 | none near the study area |
| Alcatraz Ave from the west (Emeryville side) | SR-13 Warren Freeway (via SR-24 east) | 3.0 | SR-24 |
| other pairs | | 15.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 64 veh/h; none near the study area 17 veh/h; Claremont Avenue then SR-24 14 veh/h; SR-24 8 veh/h; College Avenue 7 veh/h; College Avenue then Claremont Avenue then SR-24 4 veh/h.

### Study area, all residential and service streets

Model: 777 through cars per hour.

Model through cars by origin and destination group (largest 12 of 66 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 99.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 71.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 60.0 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 54.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 43.0 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 33.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 30.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 28.0 | SR-24 |
| San Pablo Ave (Emeryville and West Oakland) | Claremont Ave and Tunnel Rd toward the hills | 27.0 | Claremont Avenue |
| West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) | SR-24 westbound on-ramps (toward Oakland and I-980) | 25.0 | none near the study area |
| Emeryville and West Oakland streets (55th to 67th Streets) | SR-24 westbound on-ramps (toward Oakland and I-980) | 25.0 | none near the study area |
| Shattuck Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 23.0 | none near the study area |
| other pairs | | 259.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 450 veh/h; none near the study area 102 veh/h; Claremont Avenue 84 veh/h; SR-24 38 veh/h; Claremont Avenue then College Avenue 23 veh/h; College Avenue 18 veh/h.

By origin group: Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 186; SR-24 eastbound off-ramps (arriving from Oakland and I-980) 141; South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 118; Telegraph Ave from the north (Berkeley) 99; West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) 36; San Pablo Ave (Emeryville and West Oakland) 33; Emeryville and West Oakland streets (55th to 67th Streets) 32; Shattuck Ave from the north (Berkeley) 29; West Oakland to the southwest (Adeline St, Market St) 26; Telegraph Ave to the south (downtown Oakland) 25.

By destination group: SR-24 westbound on-ramps (toward Oakland and I-980) 220; South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 144; Telegraph Ave from the north (Berkeley) 109; Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 87; Claremont Ave and Tunnel Rd toward the hills 78; Telegraph Ave to the south (downtown Oakland) 31; Shattuck Ave from the north (Berkeley) 27; College Ave from the north (Berkeley) 24; Ashby Ave from the west (Emeryville and I-80) 13; Berkeley hills to the northeast (Evergreen Ln, Gravatt Dr) 11.


## Through cars by intent (cut-through intent view)

A through car is tallied once, under the first intent that fits it (the on-ramp on its planned route, the off-ramp it has driven, or the origin and destination groups of its trip), at the moment the through count counts it. Cars an hour over the run, the same window as the through-car figure (782 an hour).

| Intent | Basis | Cars an hour | Share |
| --- | --- | --- | --- |
| on-2853241697 | observed | 219 | 28% |
| Other on-ramps | assumed | 14 | 2% |
| off-52990846 | observed | 144 | 18% |
| Other off-ramps | assumed | 10 | 1% |
| Downtown, south and west Oakland traffic using side streets to reach Berkeley and Telegraph Ave north | assumed | 123 | 16% |
| Berkeley and Telegraph Ave north traffic using side streets to reach downtown, south and west Oakland | assumed | 160 | 20% |
| Oakland cross-town traffic (West Oakland, Broadway, Piedmont, Emeryville) using side streets near Claremont Ave and Telegraph Ave | assumed | 42 | 5% |
| Other (no intent listed) |  | 70 | 9% |

Intents listed cover 91% of through cars.


## Select-link shares: modeled vs observed (design D5: headline = freeway shares, tolerance +/-10 pp)

- Hillegass Avenue NB: 4 links (path Claremont Avenue -> Alcatraz Avenue (434 m)), 271 trips (245 completed)
- Colby Street NB: 8 links (path Claremont Avenue -> Alcatraz Avenue (680 m)), 228 trips (197 completed)
- Hillegass Avenue SB: 4 links (path Alcatraz Avenue -> Claremont Avenue (433 m)), 201 trips (185 completed)
- Colby Street SB: 8 links (path Alcatraz Avenue -> Claremont Avenue (680 m)), 249 trips (233 completed)

| Block | Side | Via | Observed | Modeled | Diff (pp) | n trips | Headline |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue NB | from | freeway | 47% | 51% | +4 | 271 | within |
| Hillegass Avenue NB | to | Benvenue Avenue | 21% (PM 33%) | 1% | -32 | 271 |  |
| Hillegass Avenue NB | to | College Avenue | 6% | 24% | +18 | 271 |  |
| Hillegass Avenue NB | to | Alcatraz Avenue WB | 27% | 24% | -3 | 271 |  |
| Colby Street NB | from | freeway | 47% | 49% | +2 | 228 | within |
| Colby Street NB | to | Alcatraz Avenue WB | 48% | 57% | +9 | 228 |  |
| Colby Street NB | to | Telegraph Avenue | 25% | 43% | +18 | 228 |  |
| Colby Street NB | to | College Avenue | 3% | 7% | +4 | 228 |  |
| Hillegass Avenue SB | from | Alcatraz Avenue WB | 46% | 27% | -19 | 201 |  |
| Hillegass Avenue SB | from | Benvenue Avenue | 26% | 4% | -22 | 201 |  |
| Hillegass Avenue SB | from | College Avenue | 16% | 17% | +1 | 201 |  |
| Hillegass Avenue SB | to | freeway | 57% (PM 68%) | 59% | -9 | 201 | within |
| Colby Street SB | from | Alcatraz Avenue EB | 43% | 22% | -21 | 249 |  |
| Colby Street SB | from | Alcatraz Avenue WB | 46% | 15% | -31 | 249 |  |
| Colby Street SB | from | Telegraph Avenue | 22% | 27% | +5 | 249 |  |
| Colby Street SB | to | freeway | 45% | 38% | -7 | 249 | within |
| Colby Street SB | to | Forest Street | 34% | 24% | -10 | 249 |  |

Headline shares within tolerance: 4 of 4. Observed column uses the PM-peak share where one is given and the period is pm_peak. 'Via' shares are the fraction of select-link trips using that street before (from) or after (to) the block; freeway = origin / destination gate with a motorway-class link attached.

## Claremont ramps: streets used before the on-ramp / after the off-ramp

Observed shares are for traffic from/to the north only. 'Modeled' is over all trips on the ramps and any visit to the street (an upper bound for streets that serve both sides). 'Modeled, side' counts only trips whose surface end lies on the side of the ramp stated in the targets file (`freewayRamp.side`), and for a street with a qualifier ("north of X") only its links on that side of X.

| Direction | Via | Observed | Modeled | n ramp trips | Modeled, side | n side trips |
| --- | --- | --- | --- | --- | --- | --- |
| onto freeway | College Avenue | 16% | 13% | 761 | 14% | 692 |
| onto freeway | Hillegass Avenue | 12% | 15% | 761 | 17% | 692 |
| onto freeway | Martin Street | 10% | 12% | 761 | 13% | 692 |
| onto freeway | Colby Street | 8% | 12% | 761 | 13% | 692 |
| onto freeway | Telegraph Avenue north of Alcatraz Avenue | 8% | 20% | 761 | 13% | 692 |
| onto freeway | Benvenue Avenue | 5% | 4% | 761 | 4% | 692 |
| from freeway | College Avenue | 10% | 10% | 693 | 10% | 670 |
| from freeway | Martin Street | 10% | 15% | 693 | 15% | 670 |
| from freeway | Colby Street | 8% | 12% | 693 | 12% | 670 |
| from freeway | Hillegass Avenue | 5% | 11% | 693 | 12% | 670 |
| from freeway | Benvenue Avenue | 3% | 2% | 693 | 3% | 670 |

## Top 15 links by delay

| Link | Street | Class | Lanes | Len (m) | End node control | Delay (veh-h) | Stopped (veh-h) | Mean stopped veh | Flow (veh/h) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 4175 | (unnamed) | Motorway | 2 | 142 | uncontrolled | 21.00 | 3.89 | 3.9 | 1528 |
| 4397 | Ashby Avenue | Primary | 2 | 96 | signal | 11.90 | 9.33 | 9.3 | 534 |
| 1089 | Market Street | Tertiary | 2 | 111 | two_way_stop | 11.46 | 8.76 | 8.8 | 835 |
| 1050 | Adeline Street | Secondary | 3 | 132 | uncontrolled | 11.02 | 8.23 | 8.2 | 1316 |
| 1051 | Adeline Street | Secondary | 4 | 50 | signal | 10.97 | 9.43 | 9.4 | 1297 |
| 3370 | The Uplands | Tertiary | 1 | 311 | uncontrolled | 10.92 | 8.55 | 8.6 | 173 |
| 1025 | Martin Luther King Junior Way | Secondary | 3 | 79 | signal | 10.27 | 8.65 | 8.7 | 719 |
| 711 | 55th Street | Tertiary | 1 | 238 | signal | 9.91 | 7.62 | 7.6 | 493 |
| 1162 | Alcatraz Avenue | Tertiary | 1 | 172 | signal | 9.32 | 6.81 | 6.8 | 600 |
| 834 | Martin Luther King Junior Way | Secondary | 4 | 49 | signal | 9.03 | 6.70 | 6.7 | 1282 |
| 1126 | Market Street | Tertiary | 2 | 113 | two_way_stop | 8.88 | 6.80 | 6.8 | 838 |
| 4167 | (unnamed) | Motorway | 3 | 75 | uncontrolled | 8.79 | 2.62 | 2.6 | 2627 |
| 3395 | Ashby Avenue | Primary | 1 | 129 | signal | 8.45 | 6.63 | 6.6 | 538 |
| 222 | 61st Street | Residential | 1 | 163 | uncontrolled | 8.05 | 5.31 | 5.3 | 505 |
| 248 | 60th Street | Residential | 1 | 318 | two_way_stop | 7.89 | 6.78 | 6.8 | 108 |

## Top 15 nodes by blocked time

Blocked time = lane-head seconds waiting at the stop line without permission (signal red, conflict, stop sign or no downstream space).

| Node | Streets | Control | Gate | Blocked (lane-h) | of which no downstream space | Signal plan at end (cycle: greens) |
| --- | --- | --- | --- | --- | --- | --- |
| 447 | Adeline Street / Alcatraz Avenue | signal |  | 5.32 | 0.24 | 75 s: 35/30 |
| 680 | 52nd Street / Shattuck Avenue | signal |  | 5.14 | 0.07 | 110 s: 30/28/38 |
| 446 | Market Street / Stanford Avenue | signal |  | 5.12 | 0.35 | 75 s: 29/36 |
| 331 | 52nd Street / Martin Luther King Junior Way | signal |  | 4.84 | 0.04 | 75 s: 33/32 |
| 1080 | 62nd Street / Claremont Avenue / College Avenue | signal |  | 4.01 | 0.10 | 75 s: 20/25/15 |
| 479 | Adeline Street / Martin Luther King Junior Way / Stanford Avenue | signal |  | 3.85 | 0.19 | 75 s: 33/32 |
| 30 | 57th Street / Adeline Street / Market Street | signal |  | 3.81 | 0.07 | 75 s: 15/25/20 |
| 1406 | Ashby Avenue / Claremont Avenue | signal |  | 3.72 | 0.19 | 75 s: 30/15/15 |
| 185 | Alcatraz Avenue / Sacramento Street | signal |  | 3.59 | 0.09 | 75 s: 40/25 |
| 332 | 55th Street / Martin Luther King Junior Way | signal |  | 3.30 | 0.08 | 75 s: 28/37 |
| 37 | San Pablo Avenue / Stanford Avenue | signal |  | 3.30 | 0.03 | 75 s: 24/41 |
| 851 | Alcatraz Avenue / Telegraph Avenue | signal |  | 3.23 | 0.05 | 75 s: 46/19 |
| 1069 | Claremont Avenue / Colby Street / Forest Street | signal |  | 3.15 | 0.04 | 79 s: 24/4/36 |
| 242 | Ashby Avenue / Martin Luther King Junior Way | signal |  | 3.13 | 0.00 | 75 s: 38/27 |
| 944 | Ashby Avenue / Shattuck Avenue | signal |  | 3.04 | 0.03 | 75 s: 44/21 |

Phases of the five most blocked signals (green s: approach links with their lanes, link ids in brackets):

- node 447: 35 s: Adeline Street 4L [1049], Adeline Street 4L [1051]; 30 s: Alcatraz Avenue 2L [1048], Alcatraz Avenue 2L [1133]
- node 680: 30 s: 52nd Street 4L [1662]; 28 s: 52nd Street 4L [1666], 52nd Street 4L [1662]; 38 s: Shattuck Avenue 2L [1653], Shattuck Avenue 2L [1705]
- node 446: 29 s: Stanford Avenue 3L [941], Stanford Avenue 3L [1055]; 36 s: Market Street 4L [1108], Market Street 3L [1111]
- node 331: 33 s: Martin Luther King Junior Way 4L [704], Martin Luther King Junior Way 4L [761]; 32 s: 52nd Street 2L [758], 52nd Street 1L [760]
- node 1080: 20 s: Claremont Avenue 2L [2756], Claremont Avenue 2L [2798]; 25 s: College Avenue 2L [2761], College Avenue 2L [2819]; 15 s: 62nd Street 1L [2622]

## Gridlock removals by link (top 10)

| Link | Street | End node | Control | Removals | First at (min) |
| --- | --- | --- | --- | --- | --- |
| 2921 | Russell Street | Russell Street | uncontrolled | 1 | 18.2 |
| 1051 | Adeline Street | Adeline Street / Alcatraz Avenue | signal | 1 | 22.0 |
| 1025 | Martin Luther King Junior Way | Adeline Street / Martin Luther King Junior Way / Stanford Avenue | signal | 1 | 31.2 |
| 314 | 61st Street | 61st Street / Lowell Street | two_way_stop | 1 | 43.0 |
| 1157 | Genoa Street | 59th Street / Genoa Street | uncontrolled | 1 | 43.3 |
| 1097 | 60th Street | 60th Street / Genoa Street | uncontrolled | 1 | 46.5 |
| 284 | 59th Street | 59th Street / San Pablo Avenue | uncontrolled | 1 | 53.5 |

## Cars cleared from gridlock near and far (judged zone)

Judged zone: the study area, its bounding streets and the junctions on them, plus nodes within 200 m of it along the network (111 nodes, 329 links). A far clearing counts against the stability rule when its blocking chain (vehicles held at least 60 s by a full exit, at the 5 s snapshot before it) reaches a link in the zone.

| Buffer (m) | Near | Far | Far, chain reaches the zone | Judged |
| --- | --- | --- | --- | --- |
| 100.0 | 0 | 7 | 0 | 0 |
| 200.0 | 0 | 7 | 0 | 0 |
| 400.0 | 0 | 7 | 0 | 0 |

| Far node | Streets | Distance from the study area (m) | Cleared | Chain reaches the zone |
| --- | --- | --- | --- | --- |
| 156 | 59th Street / San Pablo Avenue | 2191.0 | 1 | 0 |
| 167 | 61st Street / Lowell Street | 1633.0 | 1 | 0 |
| 421 | 59th Street / Genoa Street | 1121.0 | 1 | 0 |
| 447 | Adeline Street / Alcatraz Avenue | 972.0 | 1 | 0 |
| 450 | 60th Street / Genoa Street | 1218.0 | 1 | 0 |
| 479 | Adeline Street / Martin Luther King Junior Way / Stanford Avenue | 1106.0 | 1 | 0 |
| 1199 | Russell Street | 1157.0 | 1 | 0 |

Entry backlog at the end of the run: 3 trips waiting at origins in the zone, of 134 in all.

| Bounding street | Links | Longest standing queue on one link (m) | Link (length m) | At (min) | Share of samples with a link full |
| --- | --- | --- | --- | --- | --- |
| Telegraph Avenue | 28 | 78.0 | 1604 (94.0) | 53.3 | 0.058 |
| Alcatraz Avenue | 14 | 59.0 | 4238 (84.0) | 37.3 | 0.002 |
| College Avenue | 6 | 59.0 | 2805 (102.0) | 19.2 | 0.037 |
| Claremont Avenue | 13 | 55.0 | 2756 (198.0) | 44.2 | 0.0 |
| CA 24 | 3 | 55.0 | 1945 (188.0) | 20.0 | 0.0 |

## Junction recovery

Policy `physical`. Node entries by cars and cyclists in the run: 845071 (settle interval 0). An admission is an entry the ordinary rule would have refused; head-seconds count the time a waiting head vehicle had the reason invoked, and the part of it in which it still could not enter. Courtesy and the yield fallback change priority only; under `physical` the conflict bypass never admits.

| Reason | Admissions per hour | Per 1,000 entries | Head-s invoked | Head-s blocked |
| --- | --- | --- | --- | --- |
| courtesy | 310.0 | 0.367 | 1374 | 1276 |
| yield fallback | 171.0 | 0.202 | 51 | 0 |
| conflict bypass | 0.0 | 0.000 | 315 | 315 |

Vehicles removed while held in a node by a full exit: 0 (0.0 per hour, included in the gridlock removals).

| Node | Streets | Control | Courtesy | Yield fallback | Conflict bypass | Held removals |
| --- | --- | --- | --- | --- | --- | --- |
| 165 | Alcatraz Avenue / Baker Street | two_way_stop | 11 | 12 | 0 | 0 |
| 141 | 63rd Street / Lowell Street / Market Street | two_way_stop | 12 | 9 | 0 | 0 |
| 147 | 59th Street / Grace Avenue / Los Angeles Street | two_way_stop | 14 | 3 | 0 | 0 |
| 119 | Alcatraz Avenue / Herzog Street | two_way_stop | 9 | 4 | 0 | 0 |
| 430 | Alcatraz Avenue / King Street | two_way_stop | 3 | 10 | 0 | 0 |
| 1216 | College Avenue / Woolsey Street | two_way_stop | 9 | 4 | 0 | 0 |
| 437 | Adeline Street / Genoa Street | two_way_stop | 9 | 3 | 0 | 0 |
| 766 | 57th Street / Shattuck Avenue | two_way_stop | 5 | 7 | 0 | 0 |
| 422 | 59th Street / Adeline Street | uncontrolled | 11 | 0 | 0 | 0 |
| 457 | Alcatraz Avenue / California Street | two_way_stop | 3 | 8 | 0 | 0 |

## Entry backlog by origin node at end of run (top 10)

| Node | Streets | Trips waiting | Offered veh/h (before scale) |
| --- | --- | --- | --- |
| 183 | San Pablo Avenue | 62 | 1023 |
| 602 | Grove Shafter Freeway | 58 | 3945 |
| 301 | 47th Street / Martin Luther King Junior Way | 3 | 279 |
| 127 | 59th Street / Idaho Street | 2 | 11 |
| 442 | 63rd Street / Martin Luther King Junior Way | 2 | 66 |
| 458 | 63rd Street / California Street | 2 | 13 |
| 631 | Clarke Street / Redondo Avenue | 1 | 36 |
| 782 | Alcatraz Avenue / Irwin Court | 1 | 37 |
| 807 | 58th Street / Racine Street / Telegraph Avenue | 1 | 8 |
| 1089 | 63rd Street / College Avenue | 1 | 140 |

## Flow on key streets (veh/h per direction, study-area links of 40 m or more)

| Street | Direction of travel | Links | Median flow | Max flow |
| --- | --- | --- | --- | --- |
| Telegraph | N | 12 | 1354 | 1386 |
| Telegraph | S | 10 | 1026 | 1067 |
| College | N | 3 | 319 | 320 |
| College | S | 3 | 630 | 632 |
| Claremont | N | 6 | 488 | 714 |
| Claremont | S | 7 | 317 | 906 |
| Alcatraz | E | 6 | 502 | 558 |
| Alcatraz | W | 6 | 310 | 362 |
| Hillegass | N | 4 | 130 | 152 |
| Hillegass | S | 4 | 131 | 146 |
| Colby | N | 7 | 126 | 138 |
| Colby | S | 7 | 131 | 157 |
| Martin | E | 2 | 138 | 138 |
| Martin | W | 2 | 166 | 166 |

## Largest demand origins (offered, before scale)

| Node | Streets | Veh/h |
| --- | --- | --- |
| 602 | Grove Shafter Freeway | 3945 |
| 943 | Telegraph Avenue / Ward Street | 1194 |
| 265 | Ashby Avenue | 1134 |
| 183 | San Pablo Avenue | 1023 |
| 1719 | Grove Shafter Freeway | 947 |
| 974 | Broadway | 924 |
| 763 | Telegraph Avenue | 747 |
| 1672 | Warren Freeway | 660 |
| 324 | 51st Street / Martin Luther King Junior Way | 526 |
| 104 | San Pablo Avenue | 525 |
