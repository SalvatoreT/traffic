# Calibration report: rockridge pm_peak scale 1 seed 1 (60 min)

Offered demand 27519 veh/h x scale 1 = 27519 veh/h. Run took 34.2 s wall clock. Flow tables use the window after a 10 min warm-up; select-link and health figures cover the whole run from an empty network.

## Stability (design D4)

| Criterion | Threshold | Value | Result |
| --- | --- | --- | --- |
| Gridlock removals | 0 | 8 | FAIL |
| Backlog / spawned | < 2% | 0.4% (101 of 27588) | pass |
| Arterial mean speed (run) | > 4 m/s | 7.96 m/s (last 15 min 7.69) | pass |

Overall: **NOT STABLE**. Mean trip delay 181 s, mean trip time 433 s, completed 27041, unroutable 0.

| t (min) | vehicles in network | backlog | completed | removals | arterial speed in interval (m/s) |
| --- | --- | --- | --- | --- | --- |
| 5 | 3111 | 8 | 2338 | 1 | 8.85 |
| 10 | 3100 | 17 | 4665 | 1 | 8.47 |
| 15 | 3231 | 20 | 6821 | 1 | 8.13 |
| 20 | 3316 | 23 | 9111 | 1 | 8.24 |
| 25 | 3276 | 37 | 11391 | 1 | 8.08 |
| 30 | 3509 | 33 | 13526 | 1 | 7.76 |
| 35 | 3512 | 43 | 15820 | 1 | 7.91 |
| 40 | 3498 | 55 | 18086 | 1 | 7.67 |
| 45 | 3573 | 50 | 20235 | 2 | 7.55 |
| 50 | 3541 | 111 | 22484 | 6 | 7.52 |
| 55 | 3651 | 119 | 24688 | 8 | 7.88 |
| 60 | 3651 | 101 | 27041 | 8 | 7.66 |
## Wandering (completed car trips)

Detour ratio = distance driven (link and movement lengths) over the shortest network distance from the trip's origin to its destination. Detour against the free-flow route uses the time-shortest route with no congestion and no noise, which is what a purposeful driver without live information would follow (it differs from the shortest distance when a faster, longer road exists). A switch is a change of the remaining route while en route. Loops: the same link twice or the same node three or more times. Reversals: a link followed by its reverse within 200 m. 'Study-area vehicle-miles' are miles driven on links inside the study area; the last column is the share of them driven by trips with a detour ratio above 1.3. Guided drivers re-evaluate their route every epoch; the others keep their departure route unless it is blocked.

| Trips | n | Switches per trip | With a switch | Mean detour | Median detour | Detour > 1.3 | Detour > 2 | Mean detour vs free-flow route | Vs free-flow route > 1.3 | Loops | Reversals | Study veh-miles | Of them by detour > 1.3 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| all trips | 24833 | 0.04 | 3.4% | 1.098 | 1.059 | 6.6% | 0.0% | 1.036 | 3.2% | 0.0% | 0.3% | 2482 | 9.7% |
| gate to gate | 8656 | 0.07 | 6.3% | 1.101 | 1.070 | 5.8% | 0.0% | 1.034 | 2.5% | 0.0% | 0.2% | 671 | 10.9% |
| with a local end | 16177 | 0.02 | 1.9% | 1.097 | 1.053 | 7.0% | 0.1% | 1.037 | 3.6% | 0.0% | 0.4% | 1811 | 9.2% |
| guided drivers | 11456 | 0.08 | 6.9% | 1.100 | 1.060 | 6.8% | 0.1% | 1.037 | 3.3% | 0.0% | 0.3% | 1129 | 10.7% |
| other drivers | 13377 | 0.01 | 0.5% | 1.097 | 1.058 | 6.4% | 0.0% | 1.036 | 3.0% | 0.0% | 0.3% | 1353 | 8.8% |

## Reported patterns (diagnostics; configured in the targets file under `patterns`)

(a) Trips between the surface gates on the north side of the ramps and the freeway mainline gates, and the local-street (residential and service links in the study area) vehicle-miles they drive. Share = of all completed trips' local-street vehicle-miles (455 miles). No observed counterpart exists for this quantity (the targets file has only the select-link shares above).

| Trips | n trips | Local-street veh-miles | Share of all local-street veh-miles |
| --- | --- | --- | --- |
| surface gates to the freeway | 1019 | 36.6 | 8% |
| freeway to the surface gates | 1126 | 33.0 | 7% |

(b) Corridor trips: completed trips from beyond one end of the corridor's study-area extent (the bypass street and its arterial together) to beyond the other end, within a lateral limit of the corridor, by direction. 'Bypass' = at least N blocks (links) on the bypass street; 'arterial' = fewer bypass blocks and at least N on the arterial; 'other' = neither (another street, the freeway or a short use); blocks are counted on the corridor's study-area links. No observed counterpart exists for these shares. The related observed values are in the select-link table above: northbound Hillegass Ave traffic rarely ends on College Ave (6%), 21 to 33% jogs to Benvenue Ave, and southbound freeway-bound drivers on College Ave commonly arrive via Ashby Ave and Benvenue Ave and jog to Hillegass Ave.

| Bypass | Arterial | N | Direction | Corridor trips | Bypass | Arterial | Other | Mean bypass blocks |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue | College Avenue | 3 | N | 1576 | 3% | 14% | 83% | 0.1 |
| Hillegass Avenue | College Avenue | 3 | S | 1427 | 6% | 21% | 73% | 0.2 |

## Per-mode results

Offered: 27519 car veh/h; 626 bicycle flows (764/h); 2000 pedestrian flows (2907/h). Bicycle and pedestrian volumes are assumptions, not counts.

| Mode | In network | Completed | Mean time (s) | Other |
| --- | --- | --- | --- | --- |
| Car | 3651 | 27041 | 433 | |
| Bicycle | 64 | 778 | 258 | |
| Pedestrian | 327 | 2857 | 422 | mean crossing delay 8.2 s |

Pedestrian crosswalks at node 851: 124 completed in minutes 10.0 to 60.0, 148.8 per hour against 150.5 observed.

Vulnerable road users (surrogate indicators): pedestrian conflicts 478, bicycle conflicts 1247, close passes 672, pedestrian injury severity mean 0.043 (AIS4+, 17325 supported of 17325 encounters), cyclist injury severity mean 0.066 (MAIS3+F, 4052 supported of 8585 encounters) (separate endpoints, never summed), mean vehicle speed at pedestrian encounters 2.31 m/s.


## Volunteer whole-street counts

Each car counts once when it passes the last stop line after driving the full directed corridor in order. The measurement window is 50.0 minutes. The last two columns describe trips that visited any corridor link during the full run.

| Corridor | Counted whole street (veh/h) | Modeled whole street (veh/h) | Used in fit | Through trips on any link (veh/h) | Freeway trips on any link (veh/h) |
| --- | --- | --- | --- | --- | --- |
| Hillegass Avenue NB | 48 | 49 | yes | 80 | 131 |
| Colby Street NB | 102 | 82 | yes | 147 | 124 |
| Hillegass Avenue SB | 79 | 84 | yes | 134 | 116 |
| Colby Street SB | 39 | 54 | yes | 153 | 121 |

## Intent map: through cars by where they come from and where they are going

Through = neither trip end is in the study area. Groups are the approach groups of the area config (data/areas); a node that is not a gate takes the group of the nearest surface gate (ASSUMPTION). The arterial is the one a trip would use on the shortest free-flow path with the study area's residential and service streets closed, where that path runs on a boundary street near the study area.

Model figures are the mean of 1 seed(s), per hour of the run. Basis: OBSERVED = read from the resident volunteer count of Feb 25, 2025 or its headline shares; ASSUMPTION = inferred from those numbers or chosen.

### Colby Street NB

Observed: block volume 174 veh/h, whole-street cars 102, so through cars 102 to 145 veh/h. Model: 147 through cars per hour.

Observed (PM): 182 cars entered at the south end, 102 drove the whole street, 164 left it at Alcatraz Ave (131 left, 32 right, 1 straight), and 47% of the block's trips came from a freeway (the headline share). ASSUMPTION: freeway-origin cars that do not end along the street are 65 veh/h (the 82 freeway-origin trips on the block, 47% of 174, times the 182 / (182 + 47) of its cars that entered at the south end rather than joining on the way), spread over the 164 exits in proportion (0.40); the other through cars come from the Telegraph Ave and south-side approaches that feed the street's south end. Ranges: low = 131 (32) x 0.47 x 0.62 (the whole-street share of exits), high = 131 (32) x 0.47.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | OBSERVED turn count x ASSUMPTION share (131 left turns x 0.40) | 52 (38 to 62) | 62 | within |
| Telegraph Ave and south-side traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | ASSUMPTION: the through left-turners (131 x 0.62 = 81) that are not off-ramp traffic | 29 (19 to 43) | 27 | within |
| SR-24 off-ramp traffic using Colby St to reach College Ave and Berkeley (right at Alcatraz Ave) | OBSERVED turn count x ASSUMPTION share (32 right turns x 0.40) | 13 (9 to 15) | 14 | within |
| Telegraph Ave and south-side traffic using Colby St to reach College Ave and Berkeley | ASSUMPTION: the through right-turners (32 x 0.62 = 20) that are not off-ramp traffic | 7 (5 to 11) | 38 | above |
| Intents listed, together | | 101 (71 to 131) | 141 | |
| Other through cars (no intent listed) | | | 6 | |

Model through cars by origin and destination group (largest 12 of 19 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 62.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 34.0 | Telegraph Avenue |
| Telegraph Ave to the south (downtown Oakland) | Telegraph Ave from the north (Berkeley) | 10.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Ashby Ave from the west (Emeryville and I-80) | 9.0 | none near the study area |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | College Ave from the north (Berkeley) | 7.0 | SR-24 then Claremont Avenue then College Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Telegraph Ave from the north (Berkeley) | 4.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 4.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 3.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 3.0 | SR-24 |
| College Ave from the north (Berkeley) | Shattuck Ave from the north (Berkeley) | 2.0 | College Avenue |
| Ashby Ave from the west (Emeryville and I-80) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 1.0 | Alcatraz Avenue then College Avenue |
| San Pablo Ave (Emeryville and West Oakland) | Claremont Ave and Tunnel Rd toward the hills | 1.0 | Alcatraz Avenue then Claremont Avenue |
| other pairs | | 7.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 120 veh/h; none near the study area 9 veh/h; SR-24 then Claremont Avenue then College Avenue 7 veh/h; Alcatraz Avenue then Claremont Avenue 3 veh/h; College Avenue 3 veh/h; SR-24 3 veh/h.

### Hillegass Avenue NB

Observed: block volume 110 veh/h, whole-street cars 48, so through cars 48 to 95 veh/h. Model: 80 through cars per hour.

Observed (PM): 94 cars entered at the south end, 48 drove the whole street, 109 left it at Alcatraz Ave (43 west, 54 east, 12 straight), and 47% of the block's trips came from a freeway. ASSUMPTION: freeway-origin through cars are 40 veh/h (52 freeway-origin trips times 94 / (94 + 29)), spread over the exits in proportion (0.37); the through share of exits is 48 / 109 = 0.44.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Hillegass Ave to reach Alcatraz Ave west and Telegraph Ave north | OBSERVED turn count x ASSUMPTION share (43 left turns x 0.37) | 16 (9 to 20) | 23 | above |
| SR-24 off-ramp traffic using Hillegass Ave to reach College Ave and Berkeley | OBSERVED turn count x ASSUMPTION share (54 right turns x 0.37) | 20 (11 to 25) | 26 | above |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach Alcatraz Ave west | ASSUMPTION: through exits (43 x 0.44) that are not off-ramp traffic | 3 (0 to 10) | 3 | within |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach College Ave and Berkeley | ASSUMPTION: through exits (54 x 0.44) that are not off-ramp traffic | 4 (0 to 13) | 24 | above |
| Intents listed, together | | 43 (20 to 68) | 76 | |
| Other through cars (no intent listed) | | | 4 | |

Model through cars by origin and destination group (largest 12 of 17 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 20.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 19.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 16.0 | SR-24 |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | College Ave from the north (Berkeley) | 6.0 | SR-24 then Claremont Avenue then College Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 4.0 | SR-24 then Claremont Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 2.0 | College Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Telegraph Ave from the north (Berkeley) | 2.0 | none near the study area |
| Telegraph Ave to the south (downtown Oakland) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 2.0 | Telegraph Avenue |
| College Ave from the north (Berkeley) | Shattuck Ave from the north (Berkeley) | 1.0 | College Avenue |
| Oakland hills to the east (Broadway Terrace, Mountain Blvd, Moraga Ave) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 1.0 | Claremont Avenue then Alcatraz Avenue |
| San Pablo Ave (Emeryville and West Oakland) | Claremont Ave and Tunnel Rd toward the hills | 1.0 | Alcatraz Avenue then Claremont Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) | 1.0 | SR-24 then Telegraph Avenue |
| other pairs | | 5.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 42 veh/h; SR-24 16 veh/h; SR-24 then Claremont Avenue then College Avenue 6 veh/h; SR-24 then Claremont Avenue 4 veh/h; College Avenue 3 veh/h; Alcatraz Avenue then Claremont Avenue 2 veh/h.

### Hillegass Avenue SB

Observed: block volume 160 veh/h, whole-street cars 79, so through cars 79 to 120 veh/h. Model: 134 through cars per hour.

Observed (PM): 178 cars entered at the top (76 turned in from Alcatraz Ave west, 98 from the east, 4 came straight from the north), 79 drove the whole street, and 68% of the block's trips (109 veh/h) went to a freeway. ASSUMPTION: freeway-bound cars that did not join mid-street are 87 veh/h (109 x 178 / (178 + 44)), half of the 174 turn-ins; low = the whole-street share of the turn-ins (0.45), high = the freeway-bound share without the mid-street correction (0.63).

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Telegraph Ave, Alcatraz Ave west and West Berkeley traffic turning off Alcatraz Ave onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (76 turn-ins x 0.50) | 38 (34 to 48) | 31 | below |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (98 turn-ins x 0.50) | 49 (44 to 62) | 59 | within |
| Intents listed, together | | 87 (78 to 110) | 90 | |
| Other through cars (no intent listed) | | | 44 | |

Model through cars by origin and destination group (largest 12 of 19 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 31.0 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 30.0 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 19.0 | Claremont Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 14.0 | Telegraph Avenue |
| College Ave from the north (Berkeley) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 6.0 | College Avenue |
| San Pablo Ave (Emeryville and West Oakland) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 6.0 | Alcatraz Avenue then College Avenue |
| Ashby Ave from the west (Emeryville and I-80) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 5.0 | Alcatraz Avenue then College Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Berkeley hills to the northeast (Evergreen Ln, Gravatt Dr) | 5.0 | Alcatraz Avenue then Claremont Avenue |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 5.0 | College Avenue then Claremont Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 3.0 | Claremont Avenue |
| Telegraph Ave from the north (Berkeley) | Berkeley hills to the northeast (Evergreen Ln, Gravatt Dr) | 2.0 | Claremont Avenue |
| Alcatraz Ave from the west (Emeryville side) | Berkeley hills to the northeast (Evergreen Ln, Gravatt Dr) | 1.0 | Alcatraz Avenue then Claremont Avenue |
| other pairs | | 7.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 77 veh/h; Claremont Avenue then SR-24 20 veh/h; Alcatraz Avenue then College Avenue 11 veh/h; Alcatraz Avenue then Claremont Avenue 8 veh/h; College Avenue 6 veh/h; Claremont Avenue 5 veh/h.

### Colby Street SB

Observed: block volume 160 veh/h, whole-street cars 39, so through cars 39 to 117 veh/h. Model: 153 through cars per hour.

Observed (PM): 139 cars entered at the top (76 from Alcatraz Ave west, 50 from the east, 13 from the north), 39 drove the whole street, 45% of the block's trips (72 veh/h) went to a freeway and 22% came by way of Telegraph Ave. ASSUMPTION: freeway-bound cars that did not join mid-street are 46 veh/h (72 x 139 / (139 + 79)), 0.365 of the 126 turn-ins; low = the whole-street share (0.31), high = the unadjusted freeway share (0.57). The Telegraph Ave cars are the 22% x 160 = 35 of the 76 west turn-ins.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Southbound Telegraph Ave traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (35 Telegraph Ave cars x 0.365) | 13 (11 to 20) | 14 | within |
| Alcatraz Ave west, Ashby Ave and West Berkeley traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (41 other west turn-ins x 0.365) | 15 (13 to 23) | 26 | above |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (50 east turn-ins x 0.365) | 18 (15 to 29) | 47 | above |
| Intents listed, together | | 46 (39 to 72) | 87 | |
| Other through cars (no intent listed) | | | 66 | |

Model through cars by origin and destination group (largest 12 of 30 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 27.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 25.0 | Telegraph Avenue |
| San Pablo Ave (Emeryville and West Oakland) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 12.0 | Alcatraz Avenue then College Avenue |
| Shattuck Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 12.0 | none near the study area |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 12.0 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 10.0 | Claremont Avenue then SR-24 |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 9.0 | College Avenue then Claremont Avenue then SR-24 |
| Ashby Ave from the west (Emeryville and I-80) | SR-13 Warren Freeway (via SR-24 east) | 5.0 | SR-24 |
| Alcatraz Ave from the west (Emeryville side) | SR-13 Warren Freeway (via SR-24 east) | 4.0 | SR-24 |
| College Ave from the north (Berkeley) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 4.0 | College Avenue |
| Ashby Ave from the west (Emeryville and I-80) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 3.0 | Alcatraz Avenue then College Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | West Oakland to the southwest (Adeline St, Market St) | 3.0 | Telegraph Avenue |
| other pairs | | 27.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 70 veh/h; none near the study area 20 veh/h; Alcatraz Avenue then College Avenue 16 veh/h; Alcatraz Avenue then Claremont Avenue 11 veh/h; SR-24 11 veh/h; Claremont Avenue then SR-24 10 veh/h.

### Study area, all residential and service streets

Model: 727 through cars per hour.

Model through cars by origin and destination group (largest 12 of 66 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 120.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 79.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 71.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 64.0 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 40.0 | Telegraph Avenue |
| Emeryville and West Oakland streets (55th to 67th Streets) | Claremont Ave and Tunnel Rd toward the hills | 26.0 | Alcatraz Avenue then Claremont Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 25.0 | Claremont Avenue then SR-24 |
| San Pablo Ave (Emeryville and West Oakland) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 20.0 | Alcatraz Avenue then College Avenue |
| Shattuck Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 20.0 | none near the study area |
| West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) | SR-24 westbound on-ramps (toward Oakland and I-980) | 19.0 | none near the study area |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 17.0 | SR-24 |
| Emeryville and West Oakland streets (55th to 67th Streets) | SR-24 westbound on-ramps (toward Oakland and I-980) | 17.0 | none near the study area |
| other pairs | | 209.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 445 veh/h; none near the study area 73 veh/h; Alcatraz Avenue then Claremont Avenue 54 veh/h; Alcatraz Avenue then College Avenue 30 veh/h; SR-24 29 veh/h; Claremont Avenue then SR-24 26 veh/h.

By origin group: Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 160; South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 153; SR-24 eastbound off-ramps (arriving from Oakland and I-980) 120; Telegraph Ave from the north (Berkeley) 52; Emeryville and West Oakland streets (55th to 67th Streets) 47; San Pablo Ave (Emeryville and West Oakland) 31; College Ave from the north (Berkeley) 30; Claremont Ave and Tunnel Rd toward the hills 26; West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) 21; Shattuck Ave from the north (Berkeley) 20.

By destination group: SR-24 westbound on-ramps (toward Oakland and I-980) 215; Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 171; Telegraph Ave from the north (Berkeley) 96; South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 92; Claremont Ave and Tunnel Rd toward the hills 56; Berkeley hills to the northeast (Evergreen Ln, Gravatt Dr) 18; Telegraph Ave to the south (downtown Oakland) 18; College Ave from the north (Berkeley) 16; Ashby Ave from the west (Emeryville and I-80) 9; SR-13 Warren Freeway (via SR-24 east) 9.


## Through cars by intent (cut-through intent view)

A through car is tallied once, under the first intent that fits it (the on-ramp on its planned route, the off-ramp it has driven, or the origin and destination groups of its trip), at the moment the through count counts it. Cars an hour over the run, the same window as the through-car figure (730 an hour).

| Intent | Basis | Cars an hour | Share |
| --- | --- | --- | --- |
| on-2853241697 | observed | 215 | 29% |
| Other on-ramps | assumed | 17 | 2% |
| off-52990846 | observed | 120 | 16% |
| Other off-ramps | assumed | 5 | 1% |
| Downtown, south and west Oakland traffic using side streets to reach Berkeley and Telegraph Ave north | assumed | 155 | 21% |
| Berkeley and Telegraph Ave north traffic using side streets to reach downtown, south and west Oakland | assumed | 91 | 12% |
| Oakland cross-town traffic (West Oakland, Broadway, Piedmont, Emeryville) using side streets near Claremont Ave and Telegraph Ave | assumed | 30 | 4% |
| Other (no intent listed) |  | 97 | 13% |

Intents listed cover 87% of through cars.


## Select-link shares: modeled vs observed (design D5: headline = freeway shares, tolerance +/-10 pp)

- Hillegass Avenue NB: 4 links (path Claremont Avenue -> Alcatraz Avenue (434 m)), 233 trips (215 completed)
- Colby Street NB: 8 links (path Claremont Avenue -> Alcatraz Avenue (680 m)), 253 trips (232 completed)
- Hillegass Avenue SB: 4 links (path Alcatraz Avenue -> Claremont Avenue (433 m)), 185 trips (170 completed)
- Colby Street SB: 8 links (path Alcatraz Avenue -> Claremont Avenue (680 m)), 288 trips (266 completed)

| Block | Side | Via | Observed | Modeled | Diff (pp) | n trips | Headline |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue NB | from | freeway | 47% | 56% | +9 | 233 | within |
| Hillegass Avenue NB | to | Benvenue Avenue | 21% (PM 33%) | 1% | -32 | 233 |  |
| Hillegass Avenue NB | to | College Avenue | 6% | 7% | +1 | 233 |  |
| Hillegass Avenue NB | to | Alcatraz Avenue WB | 27% | 27% | -0 | 233 |  |
| Colby Street NB | from | freeway | 47% | 49% | +2 | 253 | within |
| Colby Street NB | to | Alcatraz Avenue WB | 48% | 55% | +7 | 253 |  |
| Colby Street NB | to | Telegraph Avenue | 25% | 50% | +25 | 253 |  |
| Colby Street NB | to | College Avenue | 3% | 5% | +2 | 253 |  |
| Hillegass Avenue SB | from | Alcatraz Avenue WB | 46% | 40% | -6 | 185 |  |
| Hillegass Avenue SB | from | Benvenue Avenue | 26% | 10% | -16 | 185 |  |
| Hillegass Avenue SB | from | College Avenue | 16% | 24% | +8 | 185 |  |
| Hillegass Avenue SB | to | freeway | 57% (PM 68%) | 63% | -5 | 185 | within |
| Colby Street SB | from | Alcatraz Avenue EB | 43% | 21% | -22 | 288 |  |
| Colby Street SB | from | Alcatraz Avenue WB | 46% | 17% | -29 | 288 |  |
| Colby Street SB | from | Telegraph Avenue | 22% | 21% | -1 | 288 |  |
| Colby Street SB | to | freeway | 45% | 42% | -3 | 288 | within |
| Colby Street SB | to | Forest Street | 34% | 23% | -11 | 288 |  |

Headline shares within tolerance: 4 of 4. Observed column uses the PM-peak share where one is given and the period is pm_peak. 'Via' shares are the fraction of select-link trips using that street before (from) or after (to) the block; freeway = origin / destination gate with a motorway-class link attached.

## Claremont ramps: streets used before the on-ramp / after the off-ramp

Observed shares are for traffic from/to the north only. 'Modeled' is over all trips on the ramps and any visit to the street (an upper bound for streets that serve both sides). 'Modeled, side' counts only trips whose surface end lies on the side of the ramp stated in the targets file (`freewayRamp.side`), and for a street with a qualifier ("north of X") only its links on that side of X.

| Direction | Via | Observed | Modeled | n ramp trips | Modeled, side | n side trips |
| --- | --- | --- | --- | --- | --- | --- |
| onto freeway | College Avenue | 16% | 13% | 764 | 14% | 684 |
| onto freeway | Hillegass Avenue | 12% | 15% | 764 | 17% | 684 |
| onto freeway | Martin Street | 10% | 12% | 764 | 13% | 684 |
| onto freeway | Colby Street | 8% | 15% | 764 | 16% | 684 |
| onto freeway | Telegraph Avenue north of Alcatraz Avenue | 8% | 19% | 764 | 15% | 684 |
| onto freeway | Benvenue Avenue | 5% | 4% | 764 | 5% | 684 |
| from freeway | College Avenue | 10% | 9% | 737 | 9% | 713 |
| from freeway | Martin Street | 10% | 13% | 737 | 13% | 713 |
| from freeway | Colby Street | 8% | 14% | 737 | 14% | 713 |
| from freeway | Hillegass Avenue | 5% | 8% | 737 | 9% | 713 |
| from freeway | Benvenue Avenue | 3% | 3% | 737 | 3% | 713 |

## Top 15 links by delay

| Link | Street | Class | Lanes | Len (m) | End node control | Delay (veh-h) | Stopped (veh-h) | Mean stopped veh | Flow (veh/h) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 4175 | (unnamed) | Motorway | 2 | 142 | uncontrolled | 23.09 | 4.11 | 4.1 | 1519 |
| 1051 | Adeline Street | Secondary | 4 | 50 | signal | 10.61 | 9.03 | 9.0 | 1360 |
| 1089 | Market Street | Tertiary | 2 | 111 | two_way_stop | 10.03 | 6.85 | 6.9 | 1080 |
| 4167 | (unnamed) | Motorway | 3 | 75 | uncontrolled | 9.35 | 2.89 | 2.9 | 2542 |
| 1050 | Adeline Street | Secondary | 3 | 132 | uncontrolled | 9.09 | 6.15 | 6.2 | 1378 |
| 460 | Sacramento Street | Tertiary | 2 | 104 | two_way_stop | 9.02 | 7.47 | 7.5 | 492 |
| 834 | Martin Luther King Junior Way | Secondary | 4 | 49 | signal | 8.32 | 6.37 | 6.4 | 1114 |
| 1162 | Alcatraz Avenue | Tertiary | 1 | 172 | signal | 7.82 | 5.87 | 5.9 | 516 |
| 4397 | Ashby Avenue | Primary | 2 | 96 | signal | 7.52 | 5.86 | 5.9 | 438 |
| 265 | 59th Street | Residential | 1 | 150 | two_way_stop | 7.50 | 6.45 | 6.4 | 125 |
| 1049 | Adeline Street | Secondary | 4 | 43 | signal | 7.35 | 5.79 | 5.8 | 1531 |
| 1025 | Martin Luther King Junior Way | Secondary | 3 | 79 | signal | 7.25 | 5.78 | 5.8 | 793 |
| 248 | 60th Street | Residential | 1 | 318 | two_way_stop | 7.22 | 5.00 | 5.0 | 184 |
| 1126 | Market Street | Tertiary | 2 | 113 | two_way_stop | 7.12 | 4.75 | 4.8 | 1100 |
| 2037 | Alcatraz Avenue | Tertiary | 1 | 202 | uncontrolled | 7.03 | 5.83 | 5.8 | 240 |

## Top 15 nodes by blocked time

Blocked time = lane-head seconds waiting at the stop line without permission (signal red, conflict, stop sign or no downstream space).

| Node | Streets | Control | Gate | Blocked (lane-h) | of which no downstream space | Signal plan at end (cycle: greens) |
| --- | --- | --- | --- | --- | --- | --- |
| 447 | Adeline Street / Alcatraz Avenue | signal |  | 5.35 | 0.21 | 75 s: 36/29 |
| 446 | Market Street / Stanford Avenue | signal |  | 5.23 | 0.27 | 75 s: 44/21 |
| 680 | 52nd Street / Shattuck Avenue | signal |  | 5.00 | 0.05 | 110 s: 30/28/38 |
| 331 | 52nd Street / Martin Luther King Junior Way | signal |  | 4.41 | 0.04 | 75 s: 32/33 |
| 1080 | 62nd Street / Claremont Avenue / College Avenue | signal |  | 4.14 | 0.10 | 75 s: 19/26/15 |
| 1406 | Ashby Avenue / Claremont Avenue | signal |  | 3.91 | 0.22 | 75 s: 30/15/15 |
| 479 | Adeline Street / Martin Luther King Junior Way / Stanford Avenue | signal |  | 3.72 | 0.15 | 75 s: 34/31 |
| 332 | 55th Street / Martin Luther King Junior Way | signal |  | 3.67 | 0.04 | 75 s: 27/38 |
| 37 | San Pablo Avenue / Stanford Avenue | signal |  | 3.66 | 0.03 | 75 s: 31/34 |
| 185 | Alcatraz Avenue / Sacramento Street | signal |  | 3.36 | 0.09 | 75 s: 37/28 |
| 713 | 51st Street / Telegraph Avenue | signal |  | 3.24 | 0.02 | 75 s: 33/32 |
| 1069 | Claremont Avenue / Colby Street / Forest Street | signal |  | 3.23 | 0.02 | 79 s: 27/4/33 |
| 944 | Ashby Avenue / Shattuck Avenue | signal |  | 3.15 | 0.04 | 75 s: 50/15 |
| 30 | 57th Street / Adeline Street / Market Street | signal |  | 3.02 | 0.08 | 75 s: 15/27/18 |
| 242 | Ashby Avenue / Martin Luther King Junior Way | signal |  | 3.00 | 0.00 | 75 s: 31/34 |

Phases of the five most blocked signals (green s: approach links with their lanes, link ids in brackets):

- node 447: 36 s: Adeline Street 4L [1049], Adeline Street 4L [1051]; 29 s: Alcatraz Avenue 2L [1048], Alcatraz Avenue 2L [1133]
- node 446: 44 s: Stanford Avenue 3L [941], Stanford Avenue 3L [1055]; 21 s: Market Street 4L [1108], Market Street 3L [1111]
- node 680: 30 s: 52nd Street 4L [1662]; 28 s: 52nd Street 4L [1666], 52nd Street 4L [1662]; 38 s: Shattuck Avenue 2L [1653], Shattuck Avenue 2L [1705]
- node 331: 32 s: Martin Luther King Junior Way 4L [704], Martin Luther King Junior Way 4L [761]; 33 s: 52nd Street 2L [758], 52nd Street 1L [760]
- node 1080: 19 s: Claremont Avenue 2L [2756], Claremont Avenue 2L [2798]; 26 s: College Avenue 2L [2761], College Avenue 2L [2819]; 15 s: 62nd Street 1L [2622]

## Gridlock removals by link (top 10)

| Link | Street | End node | Control | Removals | First at (min) |
| --- | --- | --- | --- | --- | --- |
| 1097 | 60th Street | 60th Street / Genoa Street | uncontrolled | 2 | 46.4 |
| 1051 | Adeline Street | Adeline Street / Alcatraz Avenue | signal | 1 | 4.6 |
| 251 | 60th Street | 60th Street / San Pablo Avenue | two_way_stop | 1 | 42.6 |
| 909 | 59th Street | 59th Street / Genoa Street | uncontrolled | 1 | 46.9 |
| 1159 | Genoa Street | 60th Street / Genoa Street | uncontrolled | 1 | 47.5 |
| 1018 | 60th Street | 60th Street / Adeline Street | uncontrolled | 1 | 47.5 |
| 1020 | Martin Luther King Junior Way | 60th Street / Martin Luther King Junior Way | uncontrolled | 1 | 51.3 |

## Cars cleared from gridlock near and far (judged zone)

Judged zone: the study area, its bounding streets and the junctions on them, plus nodes within 200 m of it along the network (111 nodes, 329 links). A far clearing counts against the stability rule when its blocking chain (vehicles held at least 60 s by a full exit, at the 5 s snapshot before it) reaches a link in the zone.

| Buffer (m) | Near | Far | Far, chain reaches the zone | Judged |
| --- | --- | --- | --- | --- |
| 100.0 | 0 | 8 | 0 | 0 |
| 200.0 | 0 | 8 | 0 | 0 |
| 400.0 | 0 | 8 | 0 | 0 |

| Far node | Streets | Distance from the study area (m) | Cleared | Chain reaches the zone |
| --- | --- | --- | --- | --- |
| 450 | 60th Street / Genoa Street | 1218.0 | 3 | 0 |
| 69 | 60th Street / San Pablo Avenue | 2140.0 | 1 | 0 |
| 414 | 60th Street / Martin Luther King Junior Way | 1046.0 | 1 | 0 |
| 421 | 59th Street / Genoa Street | 1121.0 | 1 | 0 |
| 447 | Adeline Street / Alcatraz Avenue | 972.0 | 1 | 0 |
| 474 | 60th Street / Adeline Street | 1240.0 | 1 | 0 |

Entry backlog at the end of the run: 0 trips waiting at origins in the zone, of 101 in all.

| Bounding street | Links | Longest standing queue on one link (m) | Link (length m) | At (min) | Share of samples with a link full |
| --- | --- | --- | --- | --- | --- |
| Telegraph Avenue | 28 | 78.0 | 1604 (94.0) | 58.3 | 0.003 |
| Alcatraz Avenue | 14 | 59.0 | 4238 (84.0) | 18.7 | 0.0 |
| College Avenue | 6 | 72.0 | 2805 (102.0) | 36.6 | 0.04 |
| Claremont Avenue | 13 | 59.0 | 2776 (161.0) | 12.4 | 0.0 |
| CA 24 | 3 | 42.0 | 1945 (188.0) | 14.0 | 0.0 |

## Junction recovery

Policy `physical`. Node entries by cars and cyclists in the run: 852489 (settle interval 0). An admission is an entry the ordinary rule would have refused; head-seconds count the time a waiting head vehicle had the reason invoked, and the part of it in which it still could not enter. Courtesy and the yield fallback change priority only; under `physical` the conflict bypass never admits.

| Reason | Admissions per hour | Per 1,000 entries | Head-s invoked | Head-s blocked |
| --- | --- | --- | --- | --- |
| courtesy | 286.0 | 0.335 | 1966 | 1876 |
| yield fallback | 178.0 | 0.209 | 53 | 0 |
| conflict bypass | 0.0 | 0.000 | 179 | 179 |

Vehicles removed while held in a node by a full exit: 1 (1.0 per hour, included in the gridlock removals).

| Node | Streets | Control | Courtesy | Yield fallback | Conflict bypass | Held removals |
| --- | --- | --- | --- | --- | --- | --- |
| 147 | 59th Street / Grace Avenue / Los Angeles Street | two_way_stop | 18 | 11 | 0 | 0 |
| 141 | 63rd Street / Lowell Street / Market Street | two_way_stop | 14 | 7 | 0 | 0 |
| 165 | Alcatraz Avenue / Baker Street | two_way_stop | 9 | 10 | 0 | 0 |
| 457 | Alcatraz Avenue / California Street | two_way_stop | 3 | 12 | 0 | 0 |
| 727 | 52nd Street | uncontrolled | 14 | 1 | 0 | 0 |
| 464 | 61st Street / Market Street | two_way_stop | 1 | 12 | 0 | 0 |
| 766 | 57th Street / Shattuck Avenue | two_way_stop | 7 | 6 | 0 | 0 |
| 125 | Alcatraz Avenue / Idaho Street | two_way_stop | 5 | 6 | 0 | 0 |
| 767 | 58th Street / Shattuck Avenue | two_way_stop | 8 | 3 | 0 | 0 |
| 129 | 61st Street / Idaho Street | two_way_stop | 7 | 2 | 0 | 0 |

## Entry backlog by origin node at end of run (top 10)

| Node | Streets | Trips waiting | Offered veh/h (before scale) |
| --- | --- | --- | --- |
| 602 | Grove Shafter Freeway | 88 | 4041 |
| 301 | 47th Street / Martin Luther King Junior Way | 4 | 255 |
| 324 | 51st Street / Martin Luther King Junior Way | 3 | 545 |
| 426 | 62nd Street / Dover Street | 3 | 18 |
| 69 | 60th Street / San Pablo Avenue | 1 | 24 |
| 127 | 59th Street / Idaho Street | 1 | 11 |
| 449 | Adeline Street / Fairview Street | 1 | 42 |

## Flow on key streets (veh/h per direction, study-area links of 40 m or more)

| Street | Direction of travel | Links | Median flow | Max flow |
| --- | --- | --- | --- | --- |
| Telegraph | N | 12 | 1292 | 1348 |
| Telegraph | S | 10 | 959 | 1021 |
| College | N | 3 | 367 | 367 |
| College | S | 3 | 538 | 541 |
| Claremont | N | 6 | 544 | 745 |
| Claremont | S | 7 | 330 | 845 |
| Alcatraz | E | 6 | 450 | 491 |
| Alcatraz | W | 6 | 323 | 329 |
| Hillegass | N | 4 | 104 | 154 |
| Hillegass | S | 4 | 139 | 145 |
| Colby | N | 7 | 138 | 166 |
| Colby | S | 7 | 145 | 191 |
| Martin | E | 2 | 126 | 126 |
| Martin | W | 2 | 145 | 145 |

## Largest demand origins (offered, before scale)

| Node | Streets | Veh/h |
| --- | --- | --- |
| 602 | Grove Shafter Freeway | 4041 |
| 943 | Telegraph Avenue / Ward Street | 1137 |
| 265 | Ashby Avenue | 1134 |
| 974 | Broadway | 1086 |
| 183 | San Pablo Avenue | 1024 |
| 1719 | Grove Shafter Freeway | 957 |
| 763 | Telegraph Avenue | 749 |
| 1672 | Warren Freeway | 684 |
| 324 | 51st Street / Martin Luther King Junior Way | 545 |
| 104 | San Pablo Avenue | 490 |
