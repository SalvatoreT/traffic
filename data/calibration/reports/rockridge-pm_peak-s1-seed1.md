# Calibration report: rockridge pm_peak scale 1 seed 1 (60 min)

Offered demand 24760 veh/h x scale 1 = 24760 veh/h. Run took 30.3 s wall clock. Flow tables use the window after a 10 min warm-up; select-link and health figures cover the whole run from an empty network.

## Stability (design D4)

| Criterion | Threshold | Value | Result |
| --- | --- | --- | --- |
| Gridlock removals | 0 | 7 | FAIL |
| Backlog / spawned | < 2% | 0.9% (219 of 24704) | pass |
| Arterial mean speed (run) | > 4 m/s | 7.39 m/s (last 15 min 7.02) | pass |

Overall: **NOT STABLE**. Mean trip delay 221 s, mean trip time 482 s, completed 23855, unroutable 0.

| t (min) | vehicles in network | backlog | completed | removals | arterial speed in interval (m/s) |
| --- | --- | --- | --- | --- | --- |
| 5 | 2928 | 6 | 2029 | 0 | 8.23 |
| 10 | 2993 | 38 | 3966 | 0 | 7.84 |
| 15 | 3123 | 40 | 5868 | 1 | 7.81 |
| 20 | 3216 | 95 | 7804 | 2 | 7.47 |
| 25 | 3328 | 126 | 9815 | 3 | 7.49 |
| 30 | 3388 | 158 | 11824 | 4 | 7.50 |
| 35 | 3439 | 157 | 13838 | 4 | 7.07 |
| 40 | 3544 | 208 | 15764 | 5 | 7.11 |
| 45 | 3483 | 232 | 17883 | 6 | 7.40 |
| 50 | 3579 | 268 | 19845 | 6 | 7.26 |
| 55 | 3637 | 233 | 21864 | 6 | 6.94 |
| 60 | 3722 | 219 | 23855 | 7 | 6.86 |
## Wandering (completed car trips)

Detour ratio = distance driven (link and movement lengths) over the shortest network distance from the trip's origin to its destination. Detour against the free-flow route uses the time-shortest route with no congestion and no noise, which is what a purposeful driver without live information would follow (it differs from the shortest distance when a faster, longer road exists). A switch is a change of the remaining route while en route. Loops: the same link twice or the same node three or more times. Reversals: a link followed by its reverse within 200 m. 'Study-area vehicle-miles' are miles driven on links inside the study area; the last column is the share of them driven by trips with a detour ratio above 1.3. Guided drivers re-evaluate their route every epoch; the others keep their departure route unless it is blocked.

| Trips | n | Switches per trip | With a switch | Mean detour | Median detour | Detour > 1.3 | Detour > 2 | Mean detour vs free-flow route | Vs free-flow route > 1.3 | Loops | Reversals | Study veh-miles | Of them by detour > 1.3 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| all trips | 21771 | 0.05 | 4.8% | 1.106 | 1.067 | 7.1% | 0.1% | 1.048 | 4.2% | 0.0% | 0.3% | 2227 | 14.2% |
| gate to gate | 8399 | 0.08 | 7.7% | 1.115 | 1.085 | 6.4% | 0.2% | 1.055 | 4.4% | 0.0% | 0.2% | 741 | 20.4% |
| with a local end | 13372 | 0.03 | 3.0% | 1.100 | 1.055 | 7.6% | 0.1% | 1.043 | 4.1% | 0.0% | 0.4% | 1486 | 11.1% |
| guided drivers | 10025 | 0.10 | 9.9% | 1.108 | 1.068 | 7.5% | 0.1% | 1.050 | 4.6% | 0.0% | 0.4% | 1038 | 14.5% |
| other drivers | 11746 | 0.01 | 0.6% | 1.104 | 1.067 | 6.8% | 0.1% | 1.046 | 4.0% | 0.0% | 0.3% | 1189 | 13.9% |

## Reported patterns (diagnostics; configured in the targets file under `patterns`)

(a) Trips between the surface gates on the north side of the ramps and the freeway mainline gates, and the local-street (residential and service links in the study area) vehicle-miles they drive. Share = of all completed trips' local-street vehicle-miles (440 miles). No observed counterpart exists for this quantity (the targets file has only the select-link shares above).

| Trips | n trips | Local-street veh-miles | Share of all local-street veh-miles |
| --- | --- | --- | --- |
| surface gates to the freeway | 1395 | 38.8 | 9% |
| freeway to the surface gates | 1623 | 36.8 | 8% |

(b) Corridor trips: completed trips from beyond one end of the corridor's study-area extent (the bypass street and its arterial together) to beyond the other end, within a lateral limit of the corridor, by direction. 'Bypass' = at least N blocks (links) on the bypass street; 'arterial' = fewer bypass blocks and at least N on the arterial; 'other' = neither (another street, the freeway or a short use); blocks are counted on the corridor's study-area links. No observed counterpart exists for these shares. The related observed values are in the select-link table above: northbound Hillegass Ave traffic rarely ends on College Ave (6%), 21 to 33% jogs to Benvenue Ave, and southbound freeway-bound drivers on College Ave commonly arrive via Ashby Ave and Benvenue Ave and jog to Hillegass Ave.

| Bypass | Arterial | N | Direction | Corridor trips | Bypass | Arterial | Other | Mean bypass blocks |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue | College Avenue | 3 | N | 1380 | 3% | 11% | 86% | 0.2 |
| Hillegass Avenue | College Avenue | 3 | S | 928 | 7% | 18% | 75% | 0.3 |

## Per-mode results

Offered: 24760 car veh/h; 626 bicycle flows (764/h); 2000 pedestrian flows (2907/h). Bicycle and pedestrian volumes are assumptions, not counts.

| Mode | In network | Completed | Mean time (s) | Other |
| --- | --- | --- | --- | --- |
| Car | 3722 | 23855 | 482 | |
| Bicycle | 60 | 784 | 266 | |
| Pedestrian | 333 | 2851 | 424 | mean crossing delay 7.8 s |

Pedestrian crosswalks at node 851: 118 completed in minutes 10.0 to 60.0, 141.6 per hour against 150.5 observed.

Vulnerable road users (surrogate indicators): pedestrian conflicts 424, bicycle conflicts 1069, close passes 496, pedestrian injury severity mean 0.042 (AIS4+, 16722 supported of 16722 encounters), cyclist injury severity mean 0.066 (MAIS3+F, 3682 supported of 6918 encounters) (separate endpoints, never summed), mean vehicle speed at pedestrian encounters 2.23 m/s.


## Volunteer whole-street counts

Each car counts once when it passes the last stop line after driving the full directed corridor in order. The measurement window is 50.0 minutes. The last two columns describe trips that visited any corridor link during the full run.

| Corridor | Counted whole street (veh/h) | Modeled whole street (veh/h) | Used in fit | Through trips on any link (veh/h) | Freeway trips on any link (veh/h) |
| --- | --- | --- | --- | --- | --- |
| Hillegass Avenue NB | 48 | 65 | yes | 105 | 109 |
| Colby Street NB | 102 | 89 | yes | 165 | 125 |
| Hillegass Avenue SB | 79 | 77 | yes | 138 | 106 |
| Colby Street SB | 39 | 74 | yes | 185 | 90 |

## Intent map: through cars by where they come from and where they are going

Through = neither trip end is in the study area. Groups are the approach groups of the area config (data/areas); a node that is not a gate takes the group of the nearest surface gate (ASSUMPTION). The arterial is the one a trip would use on the shortest free-flow path with the study area's residential and service streets closed, where that path runs on a boundary street near the study area.

Model figures are the mean of 1 seed(s), per hour of the run. Basis: OBSERVED = read from the resident volunteer count of Feb 25, 2025 or its headline shares; ASSUMPTION = inferred from those numbers or chosen.

### Colby Street NB

Observed: block volume 174 veh/h, whole-street cars 102, so through cars 102 to 145 veh/h. Model: 165 through cars per hour.

Observed (PM): 182 cars entered at the south end, 102 drove the whole street, 164 left it at Alcatraz Ave (131 left, 32 right, 1 straight), and 47% of the block's trips came from a freeway (the headline share). ASSUMPTION: freeway-origin cars that do not end along the street are 65 veh/h (the 82 freeway-origin trips on the block, 47% of 174, times the 182 / (182 + 47) of its cars that entered at the south end rather than joining on the way), spread over the 164 exits in proportion (0.40); the other through cars come from the Telegraph Ave and south-side approaches that feed the street's south end. Ranges: low = 131 (32) x 0.47 x 0.62 (the whole-street share of exits), high = 131 (32) x 0.47.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | OBSERVED turn count x ASSUMPTION share (131 left turns x 0.40) | 52 (38 to 62) | 69 | above |
| Telegraph Ave and south-side traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | ASSUMPTION: the through left-turners (131 x 0.62 = 81) that are not off-ramp traffic | 29 (19 to 43) | 51 | above |
| SR-24 off-ramp traffic using Colby St to reach College Ave and Berkeley (right at Alcatraz Ave) | OBSERVED turn count x ASSUMPTION share (32 right turns x 0.40) | 13 (9 to 15) | 9 | within |
| Telegraph Ave and south-side traffic using Colby St to reach College Ave and Berkeley | ASSUMPTION: the through right-turners (32 x 0.62 = 20) that are not off-ramp traffic | 7 (5 to 11) | 27 | above |
| Intents listed, together | | 101 (71 to 131) | 156 | |
| Other through cars (no intent listed) | | | 9 | |

Model through cars by origin and destination group (largest 12 of 21 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 69.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 22.0 | Telegraph Avenue |
| Telegraph Ave to the south (downtown Oakland) | Telegraph Ave from the north (Berkeley) | 17.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 14.0 | Claremont Avenue then College Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Ashby Ave from the west (Emeryville and I-80) | 7.0 | none near the study area |
| College Ave from the north (Berkeley) | Alcatraz Ave from the west (Emeryville side) | 6.0 | College Avenue then Alcatraz Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Shattuck Ave from the north (Berkeley) | 6.0 | Claremont Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Telegraph Ave from the north (Berkeley) | 5.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | College Ave from the north (Berkeley) | 4.0 | SR-24 then Claremont Avenue then College Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 3.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 2.0 | SR-24 |
| College Ave from the north (Berkeley) | Shattuck Ave from the north (Berkeley) | 1.0 | College Avenue |
| other pairs | | 9.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 117 veh/h; Claremont Avenue then College Avenue 14 veh/h; Claremont Avenue 11 veh/h; none near the study area 7 veh/h; College Avenue then Alcatraz Avenue 6 veh/h; SR-24 then Claremont Avenue then College Avenue 4 veh/h.

### Hillegass Avenue NB

Observed: block volume 110 veh/h, whole-street cars 48, so through cars 48 to 95 veh/h. Model: 105 through cars per hour.

Observed (PM): 94 cars entered at the south end, 48 drove the whole street, 109 left it at Alcatraz Ave (43 west, 54 east, 12 straight), and 47% of the block's trips came from a freeway. ASSUMPTION: freeway-origin through cars are 40 veh/h (52 freeway-origin trips times 94 / (94 + 29)), spread over the exits in proportion (0.37); the through share of exits is 48 / 109 = 0.44.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Hillegass Ave to reach Alcatraz Ave west and Telegraph Ave north | OBSERVED turn count x ASSUMPTION share (43 left turns x 0.37) | 16 (9 to 20) | 31 | above |
| SR-24 off-ramp traffic using Hillegass Ave to reach College Ave and Berkeley | OBSERVED turn count x ASSUMPTION share (54 right turns x 0.37) | 20 (11 to 25) | 32 | above |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach Alcatraz Ave west | ASSUMPTION: through exits (43 x 0.44) that are not off-ramp traffic | 3 (0 to 10) | 10 | within |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach College Ave and Berkeley | ASSUMPTION: through exits (54 x 0.44) that are not off-ramp traffic | 4 (0 to 13) | 16 | above |
| Intents listed, together | | 43 (20 to 68) | 89 | |
| Other through cars (no intent listed) | | | 16 | |

Model through cars by origin and destination group (largest 12 of 21 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 23.0 | SR-24 |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 23.0 | Telegraph Avenue |
| Telegraph Ave to the south (downtown Oakland) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 8.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 6.0 | Claremont Avenue then College Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Telegraph Ave from the north (Berkeley) | 6.0 | none near the study area |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | College Ave from the north (Berkeley) | 6.0 | SR-24 then Claremont Avenue then College Avenue |
| College Ave from the north (Berkeley) | Alcatraz Ave from the west (Emeryville side) | 5.0 | College Avenue then Alcatraz Avenue |
| College Ave from the north (Berkeley) | Shattuck Ave from the north (Berkeley) | 5.0 | College Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 5.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 3.0 | SR-24 then Claremont Avenue |
| Emeryville and West Oakland streets (55th to 67th Streets) | Claremont Ave and Tunnel Rd toward the hills | 3.0 | Alcatraz Avenue then Claremont Avenue |
| College Ave from the north (Berkeley) | West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) | 2.0 | College Avenue then Alcatraz Avenue |
| other pairs | | 10.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 39 veh/h; SR-24 23 veh/h; College Avenue then Alcatraz Avenue 7 veh/h; none near the study area 7 veh/h; Claremont Avenue then College Avenue 6 veh/h; SR-24 then Claremont Avenue then College Avenue 6 veh/h.

### Hillegass Avenue SB

Observed: block volume 160 veh/h, whole-street cars 79, so through cars 79 to 120 veh/h. Model: 138 through cars per hour.

Observed (PM): 178 cars entered at the top (76 turned in from Alcatraz Ave west, 98 from the east, 4 came straight from the north), 79 drove the whole street, and 68% of the block's trips (109 veh/h) went to a freeway. ASSUMPTION: freeway-bound cars that did not join mid-street are 87 veh/h (109 x 178 / (178 + 44)), half of the 174 turn-ins; low = the whole-street share of the turn-ins (0.45), high = the freeway-bound share without the mid-street correction (0.63).

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Telegraph Ave, Alcatraz Ave west and West Berkeley traffic turning off Alcatraz Ave onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (76 turn-ins x 0.50) | 38 (34 to 48) | 37 | within |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (98 turn-ins x 0.50) | 49 (44 to 62) | 38 | below |
| Intents listed, together | | 87 (78 to 110) | 75 | |
| Other through cars (no intent listed) | | | 63 | |

Model through cars by origin and destination group (largest 12 of 24 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 36.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 19.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 15.0 | College Avenue then Claremont Avenue then SR-24 |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 11.0 | Claremont Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Telegraph Ave to the south (downtown Oakland) | 8.0 | Telegraph Avenue |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 7.0 | College Avenue then Claremont Avenue then SR-24 |
| Alcatraz Ave from the west (Emeryville side) | Claremont Ave and Tunnel Rd toward the hills | 5.0 | Alcatraz Avenue then Claremont Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Oakland hills to the east (Broadway Terrace, Mountain Blvd, Moraga Ave) | 5.0 | none near the study area |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 5.0 | none near the study area |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | West Oakland to the southwest (Adeline St, Market St) | 4.0 | Telegraph Avenue |
| San Pablo Ave (Emeryville and West Oakland) | Claremont Ave and Tunnel Rd toward the hills | 3.0 | Alcatraz Avenue then Claremont Avenue |
| Emeryville and West Oakland streets (55th to 67th Streets) | Claremont Ave and Tunnel Rd toward the hills | 3.0 | Alcatraz Avenue then Claremont Avenue |
| other pairs | | 17.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 67 veh/h; College Avenue then Claremont Avenue then SR-24 22 veh/h; none near the study area 17 veh/h; Alcatraz Avenue then Claremont Avenue 13 veh/h; Claremont Avenue then SR-24 11 veh/h; College Avenue then Alcatraz Avenue 3 veh/h.

### Colby Street SB

Observed: block volume 160 veh/h, whole-street cars 39, so through cars 39 to 117 veh/h. Model: 185 through cars per hour.

Observed (PM): 139 cars entered at the top (76 from Alcatraz Ave west, 50 from the east, 13 from the north), 39 drove the whole street, 45% of the block's trips (72 veh/h) went to a freeway and 22% came by way of Telegraph Ave. ASSUMPTION: freeway-bound cars that did not join mid-street are 46 veh/h (72 x 139 / (139 + 79)), 0.365 of the 126 turn-ins; low = the whole-street share (0.31), high = the unadjusted freeway share (0.57). The Telegraph Ave cars are the 22% x 160 = 35 of the 76 west turn-ins.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Southbound Telegraph Ave traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (35 Telegraph Ave cars x 0.365) | 13 (11 to 20) | 20 | within |
| Alcatraz Ave west, Ashby Ave and West Berkeley traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (41 other west turn-ins x 0.365) | 15 (13 to 23) | 23 | within |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (50 east turn-ins x 0.365) | 18 (15 to 29) | 27 | within |
| Intents listed, together | | 46 (39 to 72) | 70 | |
| Other through cars (no intent listed) | | | 115 | |

Model through cars by origin and destination group (largest 12 of 39 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 20.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Telegraph Ave to the south (downtown Oakland) | 19.0 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 17.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 14.0 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | Telegraph Ave to the south (downtown Oakland) | 12.0 | Telegraph Avenue |
| Shattuck Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 10.0 | none near the study area |
| Alcatraz Ave from the west (Emeryville side) | Claremont Ave and Tunnel Rd toward the hills | 9.0 | Alcatraz Avenue then Claremont Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | West Oakland to the southwest (Adeline St, Market St) | 9.0 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 9.0 | Claremont Avenue then SR-24 |
| Emeryville and West Oakland streets (55th to 67th Streets) | Claremont Ave and Tunnel Rd toward the hills | 9.0 | Alcatraz Avenue then Claremont Avenue |
| Ashby Ave from the west (Emeryville and I-80) | SR-13 Warren Freeway (via SR-24 east) | 5.0 | SR-24 |
| Ashby Ave from the west (Emeryville and I-80) | Berkeley hills to the northeast (Evergreen Ln, Gravatt Dr) | 4.0 | none near the study area |
| other pairs | | 48.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 91 veh/h; none near the study area 35 veh/h; Alcatraz Avenue then Claremont Avenue 23 veh/h; SR-24 12 veh/h; Claremont Avenue then SR-24 9 veh/h; College Avenue then Alcatraz Avenue 8 veh/h.

### Study area, all residential and service streets

Model: 887 through cars per hour.

Model through cars by origin and destination group (largest 12 of 79 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 82.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 81.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 71.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 48.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Telegraph Ave to the south (downtown Oakland) | 47.0 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 46.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 39.0 | Claremont Avenue then College Avenue |
| Telegraph Ave from the north (Berkeley) | Telegraph Ave to the south (downtown Oakland) | 37.0 | Telegraph Avenue |
| College Ave from the north (Berkeley) | Alcatraz Ave from the west (Emeryville side) | 27.0 | College Avenue then Alcatraz Avenue |
| Emeryville and West Oakland streets (55th to 67th Streets) | Claremont Ave and Tunnel Rd toward the hills | 25.0 | Alcatraz Avenue then Claremont Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 23.0 | SR-24 |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 19.0 | Claremont Avenue then SR-24 |
| other pairs | | 342.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 502 veh/h; none near the study area 117 veh/h; Alcatraz Avenue then Claremont Avenue 56 veh/h; Claremont Avenue then College Avenue 39 veh/h; Claremont Avenue 37 veh/h; College Avenue then Alcatraz Avenue 35 veh/h.

By origin group: Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 204; South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 157; SR-24 eastbound off-ramps (arriving from Oakland and I-980) 129; Telegraph Ave from the north (Berkeley) 98; College Ave from the north (Berkeley) 53; Telegraph Ave to the south (downtown Oakland) 47; Emeryville and West Oakland streets (55th to 67th Streets) 36; Ashby Ave from the west (Emeryville and I-80) 31; West Oakland to the southwest (Adeline St, Market St) 28; Shattuck Ave from the north (Berkeley) 23.

By destination group: SR-24 westbound on-ramps (toward Oakland and I-980) 191; Telegraph Ave from the north (Berkeley) 149; Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 116; Telegraph Ave to the south (downtown Oakland) 97; Claremont Ave and Tunnel Rd toward the hills 93; South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 85; Alcatraz Ave from the west (Emeryville side) 27; Shattuck Ave from the north (Berkeley) 26; Berkeley hills to the northeast (Evergreen Ln, Gravatt Dr) 23; West Oakland to the southwest (Adeline St, Market St) 20.


## Through cars by intent (cut-through intent view)

A through car is tallied once, under the first intent that fits it (the on-ramp on its planned route, the off-ramp it has driven, or the origin and destination groups of its trip), at the moment the through count counts it. Cars an hour over the run, the same window as the through-car figure (890 an hour).

| Intent | Basis | Cars an hour | Share |
| --- | --- | --- | --- |
| on-2853241697 | observed | 192 | 22% |
| Other on-ramps | assumed | 18 | 2% |
| off-52990846 | observed | 129 | 14% |
| Other off-ramps | assumed | 8 | 1% |
| Downtown, south and west Oakland traffic using side streets to reach Berkeley and Telegraph Ave north | assumed | 182 | 20% |
| Berkeley and Telegraph Ave north traffic using side streets to reach downtown, south and west Oakland | assumed | 165 | 19% |
| Oakland cross-town traffic (West Oakland, Broadway, Piedmont, Emeryville) using side streets near Claremont Ave and Telegraph Ave | assumed | 38 | 4% |
| Other (no intent listed) |  | 158 | 18% |

Intents listed cover 82% of through cars.


## Select-link shares: modeled vs observed (design D5: headline = freeway shares, tolerance +/-10 pp)

- Hillegass Avenue NB: 4 links (path Claremont Avenue -> Alcatraz Avenue (434 m)), 204 trips (186 completed)
- Colby Street NB: 8 links (path Claremont Avenue -> Alcatraz Avenue (680 m)), 265 trips (242 completed)
- Hillegass Avenue SB: 4 links (path Alcatraz Avenue -> Claremont Avenue (433 m)), 213 trips (185 completed)
- Colby Street SB: 8 links (path Alcatraz Avenue -> Claremont Avenue (680 m)), 249 trips (222 completed)

| Block | Side | Via | Observed | Modeled | Diff (pp) | n trips | Headline |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue NB | from | freeway | 47% | 53% | +6 | 204 | within |
| Hillegass Avenue NB | to | Benvenue Avenue | 21% (PM 33%) | 3% | -30 | 204 |  |
| Hillegass Avenue NB | to | College Avenue | 6% | 17% | +11 | 204 |  |
| Hillegass Avenue NB | to | Alcatraz Avenue WB | 27% | 33% | +6 | 204 |  |
| Colby Street NB | from | freeway | 47% | 47% | +0 | 265 | within |
| Colby Street NB | to | Alcatraz Avenue WB | 48% | 58% | +10 | 265 |  |
| Colby Street NB | to | Telegraph Avenue | 25% | 60% | +35 | 265 |  |
| Colby Street NB | to | College Avenue | 3% | 6% | +3 | 265 |  |
| Hillegass Avenue SB | from | Alcatraz Avenue WB | 46% | 30% | -16 | 213 |  |
| Hillegass Avenue SB | from | Benvenue Avenue | 26% | 13% | -13 | 213 |  |
| Hillegass Avenue SB | from | College Avenue | 16% | 15% | -1 | 213 |  |
| Hillegass Avenue SB | to | freeway | 57% (PM 68%) | 49% | -19 | 213 | OUTSIDE |
| Colby Street SB | from | Alcatraz Avenue EB | 43% | 35% | -8 | 249 |  |
| Colby Street SB | from | Alcatraz Avenue WB | 46% | 19% | -27 | 249 |  |
| Colby Street SB | from | Telegraph Avenue | 22% | 35% | +13 | 249 |  |
| Colby Street SB | to | freeway | 45% | 36% | -9 | 249 | within |
| Colby Street SB | to | Forest Street | 34% | 9% | -25 | 249 |  |

Headline shares within tolerance: 3 of 4. Observed column uses the PM-peak share where one is given and the period is pm_peak. 'Via' shares are the fraction of select-link trips using that street before (from) or after (to) the block; freeway = origin / destination gate with a motorway-class link attached.

## Claremont ramps: streets used before the on-ramp / after the off-ramp

Observed shares are for traffic from/to the north only. 'Modeled' is over all trips on the ramps and any visit to the street (an upper bound for streets that serve both sides). 'Modeled, side' counts only trips whose surface end lies on the side of the ramp stated in the targets file (`freewayRamp.side`), and for a street with a qualifier ("north of X") only its links on that side of X.

| Direction | Via | Observed | Modeled | n ramp trips | Modeled, side | n side trips |
| --- | --- | --- | --- | --- | --- | --- |
| onto freeway | College Avenue | 16% | 13% | 682 | 14% | 578 |
| onto freeway | Hillegass Avenue | 12% | 15% | 682 | 18% | 578 |
| onto freeway | Martin Street | 10% | 15% | 682 | 17% | 578 |
| onto freeway | Colby Street | 8% | 12% | 682 | 14% | 578 |
| onto freeway | Telegraph Avenue north of Alcatraz Avenue | 8% | 19% | 682 | 17% | 578 |
| onto freeway | Benvenue Avenue | 5% | 4% | 682 | 5% | 578 |
| from freeway | College Avenue | 10% | 10% | 735 | 10% | 700 |
| from freeway | Martin Street | 10% | 11% | 735 | 12% | 700 |
| from freeway | Colby Street | 8% | 13% | 735 | 14% | 700 |
| from freeway | Hillegass Avenue | 5% | 9% | 735 | 10% | 700 |
| from freeway | Benvenue Avenue | 3% | 2% | 735 | 3% | 700 |

## Top 15 links by delay

| Link | Street | Class | Lanes | Len (m) | End node control | Delay (veh-h) | Stopped (veh-h) | Mean stopped veh | Flow (veh/h) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 4175 | (unnamed) | Motorway | 2 | 142 | uncontrolled | 24.58 | 4.42 | 4.4 | 1524 |
| 4255 | The Uplands | Tertiary | 1 | 514 | two_way_stop | 11.48 | 6.85 | 6.8 | 256 |
| 3395 | Ashby Avenue | Primary | 1 | 129 | signal | 11.08 | 9.41 | 9.4 | 379 |
| 999 | Sacramento Street | Tertiary | 2 | 102 | two_way_stop | 10.98 | 9.02 | 9.0 | 642 |
| 4167 | (unnamed) | Motorway | 3 | 75 | uncontrolled | 10.85 | 3.33 | 3.3 | 2548 |
| 1089 | Market Street | Tertiary | 2 | 111 | two_way_stop | 10.68 | 8.17 | 8.2 | 870 |
| 4329 | Claremont Avenue | Secondary | 2 | 113 | signal | 10.65 | 8.76 | 8.8 | 589 |
| 1051 | Adeline Street | Secondary | 4 | 50 | signal | 9.98 | 8.53 | 8.5 | 1073 |
| 2998 | College Avenue | Tertiary | 1 | 161 | signal | 9.65 | 8.10 | 8.1 | 362 |
| 3370 | The Uplands | Tertiary | 1 | 311 | uncontrolled | 9.16 | 6.13 | 6.1 | 270 |
| 4398 | Ashby Avenue | Primary | 2 | 96 | uncontrolled | 8.94 | 6.93 | 6.9 | 624 |
| 1049 | Adeline Street | Secondary | 4 | 43 | signal | 8.57 | 7.09 | 7.1 | 1457 |
| 3434 | Claremont Avenue | Secondary | 1 | 93 | all_way_stop | 8.56 | 6.10 | 6.1 | 350 |
| 711 | 55th Street | Tertiary | 1 | 238 | signal | 8.56 | 6.66 | 6.7 | 479 |
| 460 | Sacramento Street | Tertiary | 2 | 104 | two_way_stop | 8.30 | 6.93 | 6.9 | 439 |

## Top 15 nodes by blocked time

Blocked time = lane-head seconds waiting at the stop line without permission (signal red, conflict, stop sign or no downstream space).

| Node | Streets | Control | Gate | Blocked (lane-h) | of which no downstream space | Signal plan at end (cycle: greens) |
| --- | --- | --- | --- | --- | --- | --- |
| 447 | Adeline Street / Alcatraz Avenue | signal |  | 5.71 | 0.18 | 75 s: 27/38 |
| 680 | 52nd Street / Shattuck Avenue | signal |  | 5.48 | 0.07 | 110 s: 30/28/38 |
| 1406 | Ashby Avenue / Claremont Avenue | signal |  | 4.79 | 0.33 | 75 s: 23/22/15 |
| 446 | Market Street / Stanford Avenue | signal |  | 4.58 | 0.32 | 75 s: 26/39 |
| 331 | 52nd Street / Martin Luther King Junior Way | signal |  | 4.33 | 0.05 | 75 s: 36/29 |
| 1080 | 62nd Street / Claremont Avenue / College Avenue | signal |  | 3.99 | 0.08 | 75 s: 19/20/21 |
| 479 | Adeline Street / Martin Luther King Junior Way / Stanford Avenue | signal |  | 3.87 | 0.11 | 75 s: 48/17 |
| 30 | 57th Street / Adeline Street / Market Street | signal |  | 3.83 | 0.04 | 75 s: 22/23/15 |
| 185 | Alcatraz Avenue / Sacramento Street | signal |  | 3.70 | 0.09 | 75 s: 50/15 |
| 851 | Alcatraz Avenue / Telegraph Avenue | signal |  | 3.56 | 0.12 | 75 s: 43/22 |
| 37 | San Pablo Avenue / Stanford Avenue | signal |  | 3.45 | 0.01 | 75 s: 29/36 |
| 713 | 51st Street / Telegraph Avenue | signal |  | 3.20 | 0.02 | 75 s: 28/37 |
| 332 | 55th Street / Martin Luther King Junior Way | signal |  | 2.98 | 0.08 | 75 s: 46/19 |
| 1220 | Ashby Avenue / College Avenue | signal |  | 2.88 | 0.29 | 75 s: 34/31 |
| 237 | Ashby Avenue / Sacramento Street | signal |  | 2.77 | 0.01 | 75 s: 49/16 |

Phases of the five most blocked signals (green s: approach links with their lanes, link ids in brackets):

- node 447: 27 s: Adeline Street 4L [1049], Adeline Street 4L [1051]; 38 s: Alcatraz Avenue 2L [1048], Alcatraz Avenue 2L [1133]
- node 680: 30 s: 52nd Street 4L [1662]; 28 s: 52nd Street 4L [1666], 52nd Street 4L [1662]; 38 s: Shattuck Avenue 2L [1653], Shattuck Avenue 2L [1705]
- node 1406: 23 s: Ashby Avenue 1L [3395], Ashby Avenue 2L [3426]; 22 s: Claremont Avenue 2L [4329]; 15 s: Claremont Avenue 3L [3447]
- node 446: 26 s: Stanford Avenue 3L [941], Stanford Avenue 3L [1055]; 39 s: Market Street 4L [1108], Market Street 3L [1111]
- node 331: 36 s: Martin Luther King Junior Way 4L [704], Martin Luther King Junior Way 4L [761]; 29 s: 52nd Street 2L [758], 52nd Street 1L [760]

## Gridlock removals by link (top 10)

| Link | Street | End node | Control | Removals | First at (min) |
| --- | --- | --- | --- | --- | --- |
| 1025 | Martin Luther King Junior Way | Adeline Street / Martin Luther King Junior Way / Stanford Avenue | signal | 2 | 13.9 |
| 3435 | Claremont Boulevard | Claremont Avenue / Claremont Boulevard | two_way_stop | 2 | 18.7 |
| 2921 | Russell Street | Russell Street | uncontrolled | 1 | 20.5 |
| 1051 | Adeline Street | Adeline Street / Alcatraz Avenue | signal | 1 | 42.0 |
| 3039 | Ashby Avenue | Ashby Avenue / College Avenue | signal | 1 | 56.2 |

## Cars cleared from gridlock near and far (judged zone)

Judged zone: the study area, its bounding streets and the junctions on them, plus nodes within 200 m of it along the network (111 nodes, 329 links). A far clearing counts against the stability rule when its blocking chain (vehicles held at least 60 s by a full exit, at the 5 s snapshot before it) reaches a link in the zone.

| Buffer (m) | Near | Far | Far, chain reaches the zone | Judged |
| --- | --- | --- | --- | --- |
| 100.0 | 0 | 7 | 0 | 0 |
| 200.0 | 0 | 7 | 0 | 0 |
| 400.0 | 0 | 7 | 0 | 0 |

| Far node | Streets | Distance from the study area (m) | Cleared | Chain reaches the zone |
| --- | --- | --- | --- | --- |
| 479 | Adeline Street / Martin Luther King Junior Way / Stanford Avenue | 1106.0 | 2 | 0 |
| 1429 | Claremont Avenue / Claremont Boulevard | 1063.0 | 2 | 0 |
| 447 | Adeline Street / Alcatraz Avenue | 972.0 | 1 | 0 |
| 1199 | Russell Street | 1157.0 | 1 | 0 |
| 1220 | Ashby Avenue / College Avenue | 645.0 | 1 | 0 |

Entry backlog at the end of the run: 0 trips waiting at origins in the zone, of 219 in all.

| Bounding street | Links | Longest standing queue on one link (m) | Link (length m) | At (min) | Share of samples with a link full |
| --- | --- | --- | --- | --- | --- |
| Telegraph Avenue | 28 | 91.0 | 2030 (101.0) | 17.4 | 0.193 |
| Alcatraz Avenue | 14 | 91.0 | 2766 (106.0) | 49.9 | 0.098 |
| College Avenue | 6 | 91.0 | 2805 (102.0) | 40.2 | 0.11 |
| Claremont Avenue | 13 | 49.0 | 2776 (161.0) | 53.3 | 0.0 |
| CA 24 | 3 | 65.0 | 1945 (188.0) | 42.6 | 0.0 |

## Junction recovery

Policy `physical`. Node entries by cars and cyclists in the run: 787055 (settle interval 0). An admission is an entry the ordinary rule would have refused; head-seconds count the time a waiting head vehicle had the reason invoked, and the part of it in which it still could not enter. Courtesy and the yield fallback change priority only; under `physical` the conflict bypass never admits.

| Reason | Admissions per hour | Per 1,000 entries | Head-s invoked | Head-s blocked |
| --- | --- | --- | --- | --- |
| courtesy | 336.0 | 0.427 | 1546 | 1439 |
| yield fallback | 212.0 | 0.269 | 66 | 0 |
| conflict bypass | 0.0 | 0.000 | 287 | 287 |

Vehicles removed while held in a node by a full exit: 0 (0.0 per hour, included in the gridlock removals).

| Node | Streets | Control | Courtesy | Yield fallback | Conflict bypass | Held removals |
| --- | --- | --- | --- | --- | --- | --- |
| 1429 | Claremont Avenue / Claremont Boulevard | two_way_stop | 26 | 4 | 0 | 0 |
| 457 | Alcatraz Avenue / California Street | two_way_stop | 12 | 13 | 0 | 0 |
| 165 | Alcatraz Avenue / Baker Street | two_way_stop | 10 | 14 | 0 | 0 |
| 430 | Alcatraz Avenue / King Street | two_way_stop | 3 | 17 | 0 | 0 |
| 1216 | College Avenue / Woolsey Street | two_way_stop | 10 | 8 | 0 | 0 |
| 766 | 57th Street / Shattuck Avenue | two_way_stop | 6 | 9 | 0 | 0 |
| 141 | 63rd Street / Lowell Street / Market Street | two_way_stop | 8 | 6 | 0 | 0 |
| 1405 | Claremont Boulevard / Russell Street | two_way_stop | 12 | 2 | 0 | 0 |
| 187 | Harmon Street / Sacramento Street | two_way_stop | 9 | 4 | 0 | 0 |
| 464 | 61st Street / Market Street | two_way_stop | 3 | 10 | 0 | 0 |

## Entry backlog by origin node at end of run (top 10)

| Node | Streets | Trips waiting | Offered veh/h (before scale) |
| --- | --- | --- | --- |
| 602 | Grove Shafter Freeway | 159 | 3942 |
| 1756 | Claremont Avenue | 40 | 412 |
| 449 | Adeline Street / Fairview Street | 7 | 62 |
| 535 | Martin Luther King Junior Way / Prince Street | 3 | 56 |
| 343 | 56th Street / Dover Street | 2 | 5 |
| 232 | Prince Street / Sacramento Street | 1 | 6 |
| 238 | Ashby Avenue / California Street | 1 | 8 |
| 301 | 47th Street / Martin Luther King Junior Way | 1 | 275 |
| 428 | 63rd Street / Shattuck Avenue | 1 | 1 |
| 437 | Adeline Street / Genoa Street | 1 | 30 |

## Flow on key streets (veh/h per direction, study-area links of 40 m or more)

| Street | Direction of travel | Links | Median flow | Max flow |
| --- | --- | --- | --- | --- |
| Telegraph | N | 12 | 980 | 1008 |
| Telegraph | S | 10 | 853 | 1050 |
| College | N | 3 | 349 | 350 |
| College | S | 3 | 593 | 598 |
| Claremont | N | 6 | 514 | 826 |
| Claremont | S | 7 | 420 | 869 |
| Alcatraz | E | 6 | 565 | 610 |
| Alcatraz | W | 6 | 246 | 332 |
| Hillegass | N | 4 | 127 | 132 |
| Hillegass | S | 4 | 154 | 166 |
| Colby | N | 7 | 145 | 170 |
| Colby | S | 7 | 151 | 168 |
| Martin | E | 2 | 162 | 162 |
| Martin | W | 2 | 163 | 163 |

## Largest demand origins (offered, before scale)

| Node | Streets | Veh/h |
| --- | --- | --- |
| 602 | Grove Shafter Freeway | 3942 |
| 943 | Telegraph Avenue / Ward Street | 1156 |
| 265 | Ashby Avenue | 1144 |
| 183 | San Pablo Avenue | 1020 |
| 1719 | Grove Shafter Freeway | 947 |
| 974 | Broadway | 835 |
| 763 | Telegraph Avenue | 797 |
| 1672 | Warren Freeway | 659 |
| 324 | 51st Street / Martin Luther King Junior Way | 525 |
| 1756 | Claremont Avenue | 412 |
