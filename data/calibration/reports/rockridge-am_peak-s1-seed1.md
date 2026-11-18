# Calibration report: rockridge am_peak scale 1 seed 1 (60 min)

Offered demand 23590 veh/h x scale 1 = 23590 veh/h. Run took 26.5 s wall clock. Flow tables use the window after a 10 min warm-up; select-link and health figures cover the whole run from an empty network.

## Stability (design D4)

| Criterion | Threshold | Value | Result |
| --- | --- | --- | --- |
| Gridlock removals | 0 | 0 | pass |
| Backlog / spawned | < 2% | 0.1% (15 of 23732) | pass |
| Arterial mean speed (run) | > 4 m/s | 8.86 m/s (last 15 min 8.72) | pass |

Overall: **STABLE**. Mean trip delay 131 s, mean trip time 379 s, completed 23746, unroutable 0.

| t (min) | vehicles in network | backlog | completed | removals | arterial speed in interval (m/s) |
| --- | --- | --- | --- | --- | --- |
| 5 | 2681 | 14 | 2046 | 0 | 9.03 |
| 10 | 2571 | 5 | 4035 | 0 | 8.61 |
| 15 | 2604 | 9 | 5987 | 0 | 8.61 |
| 20 | 2513 | 2 | 7995 | 0 | 9.07 |
| 25 | 2509 | 12 | 9983 | 0 | 9.35 |
| 30 | 2496 | 12 | 12005 | 0 | 9.13 |
| 35 | 2549 | 5 | 13957 | 0 | 8.85 |
| 40 | 2620 | 16 | 15875 | 0 | 8.71 |
| 45 | 2602 | 11 | 17909 | 0 | 8.83 |
| 50 | 2617 | 8 | 19858 | 0 | 8.85 |
| 55 | 2499 | 17 | 21907 | 0 | 8.93 |
| 60 | 2697 | 15 | 23746 | 0 | 8.37 |
## Wandering (completed car trips)

Detour ratio = distance driven (link and movement lengths) over the shortest network distance from the trip's origin to its destination. Detour against the free-flow route uses the time-shortest route with no congestion and no noise, which is what a purposeful driver without live information would follow (it differs from the shortest distance when a faster, longer road exists). A switch is a change of the remaining route while en route. Loops: the same link twice or the same node three or more times. Reversals: a link followed by its reverse within 200 m. 'Study-area vehicle-miles' are miles driven on links inside the study area; the last column is the share of them driven by trips with a detour ratio above 1.3. Guided drivers re-evaluate their route every epoch; the others keep their departure route unless it is blocked.

| Trips | n | Switches per trip | With a switch | Mean detour | Median detour | Detour > 1.3 | Detour > 2 | Mean detour vs free-flow route | Vs free-flow route > 1.3 | Loops | Reversals | Study veh-miles | Of them by detour > 1.3 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| all trips | 21815 | 0.01 | 0.9% | 1.080 | 1.047 | 3.4% | 0.0% | 1.022 | 1.5% | 0.0% | 0.2% | 2174 | 7.1% |
| gate to gate | 6531 | 0.02 | 1.7% | 1.086 | 1.055 | 3.3% | 0.0% | 1.024 | 1.8% | 0.0% | 0.2% | 626 | 5.1% |
| with a local end | 15284 | 0.01 | 0.6% | 1.077 | 1.044 | 3.5% | 0.0% | 1.022 | 1.4% | 0.0% | 0.2% | 1548 | 8.0% |
| guided drivers | 10119 | 0.02 | 1.9% | 1.080 | 1.047 | 3.4% | 0.0% | 1.022 | 1.5% | 0.0% | 0.3% | 1010 | 7.1% |
| other drivers | 11696 | 0.00 | 0.1% | 1.080 | 1.046 | 3.4% | 0.0% | 1.022 | 1.5% | 0.0% | 0.2% | 1164 | 7.2% |

## Reported patterns (diagnostics; configured in the targets file under `patterns`)

(a) Trips between the surface gates on the north side of the ramps and the freeway mainline gates, and the local-street (residential and service links in the study area) vehicle-miles they drive. Share = of all completed trips' local-street vehicle-miles (337 miles). No observed counterpart exists for this quantity (the targets file has only the select-link shares above).

| Trips | n trips | Local-street veh-miles | Share of all local-street veh-miles |
| --- | --- | --- | --- |
| surface gates to the freeway | 908 | 21.0 | 6% |
| freeway to the surface gates | 984 | 22.0 | 7% |

(b) Corridor trips: completed trips from beyond one end of the corridor's study-area extent (the bypass street and its arterial together) to beyond the other end, within a lateral limit of the corridor, by direction. 'Bypass' = at least N blocks (links) on the bypass street; 'arterial' = fewer bypass blocks and at least N on the arterial; 'other' = neither (another street, the freeway or a short use); blocks are counted on the corridor's study-area links. No observed counterpart exists for these shares. The related observed values are in the select-link table above: northbound Hillegass Ave traffic rarely ends on College Ave (6%), 21 to 33% jogs to Benvenue Ave, and southbound freeway-bound drivers on College Ave commonly arrive via Ashby Ave and Benvenue Ave and jog to Hillegass Ave.

| Bypass | Arterial | N | Direction | Corridor trips | Bypass | Arterial | Other | Mean bypass blocks |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue | College Avenue | 3 | N | 1190 | 3% | 12% | 85% | 0.1 |
| Hillegass Avenue | College Avenue | 3 | S | 1217 | 3% | 21% | 76% | 0.1 |

## Per-mode results

Offered: 23590 car veh/h; 497 bicycle flows (702/h); 2000 pedestrian flows (2228/h). Bicycle and pedestrian volumes are assumptions, not counts.

| Mode | In network | Completed | Mean time (s) | Other |
| --- | --- | --- | --- | --- |
| Car | 2697 | 23746 | 379 | |
| Bicycle | 45 | 736 | 248 | |
| Pedestrian | 286 | 2165 | 465 | mean crossing delay 7.5 s |

Vulnerable road users (surrogate indicators): pedestrian conflicts 367, bicycle conflicts 969, close passes 703, pedestrian injury severity mean 0.046 (AIS4+, 12794 supported of 12794 encounters), cyclist injury severity mean 0.062 (MAIS3+F, 3367 supported of 6354 encounters) (separate endpoints, never summed), mean vehicle speed at pedestrian encounters 2.42 m/s.


## Volunteer whole-street counts

Each car counts once when it passes the last stop line after driving the full directed corridor in order. The measurement window is 50.0 minutes. The last two columns describe trips that visited any corridor link during the full run.

| Corridor | Counted whole street (veh/h) | Modeled whole street (veh/h) | Used in fit | Through trips on any link (veh/h) | Freeway trips on any link (veh/h) |
| --- | --- | --- | --- | --- | --- |
| Hillegass Avenue NB | 34 | 48 | yes | 82 | 77 |
| Colby Street NB | 33 | 58 | yes | 94 | 79 |
| Hillegass Avenue SB | 36 | 35 | yes | 66 | 66 |
| Colby Street SB | 46 | 20 | yes | 66 | 85 |

## Intent map: through cars by where they come from and where they are going

Through = neither trip end is in the study area. Groups are the approach groups of the area config (data/areas); a node that is not a gate takes the group of the nearest surface gate (ASSUMPTION). The arterial is the one a trip would use on the shortest free-flow path with the study area's residential and service streets closed, where that path runs on a boundary street near the study area.

Model figures are the mean of 1 seed(s), per hour of the run. Basis: OBSERVED = read from the resident volunteer count of Feb 25, 2025 or its headline shares; ASSUMPTION = inferred from those numbers or chosen.

### Colby Street NB

Observed (PM): 182 cars entered at the south end, 102 drove the whole street, 164 left it at Alcatraz Ave (131 left, 32 right, 1 straight), and 47% of the block's trips came from a freeway (the headline share). ASSUMPTION: freeway-origin cars that do not end along the street are 65 veh/h (the 82 freeway-origin trips on the block, 47% of 174, times the 182 / (182 + 47) of its cars that entered at the south end rather than joining on the way), spread over the 164 exits in proportion (0.40); the other through cars come from the Telegraph Ave and south-side approaches that feed the street's south end. Ranges: low = 131 (32) x 0.47 x 0.62 (the whole-street share of exits), high = 131 (32) x 0.47.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | OBSERVED turn count x ASSUMPTION share (131 left turns x 0.40) | 52 (38 to 62) | 40 | within |
| Telegraph Ave and south-side traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | ASSUMPTION: the through left-turners (131 x 0.62 = 81) that are not off-ramp traffic | 29 (19 to 43) | 26 | within |
| SR-24 off-ramp traffic using Colby St to reach College Ave and Berkeley (right at Alcatraz Ave) | OBSERVED turn count x ASSUMPTION share (32 right turns x 0.40) | 13 (9 to 15) | 5 | below |
| Telegraph Ave and south-side traffic using Colby St to reach College Ave and Berkeley | ASSUMPTION: the through right-turners (32 x 0.62 = 20) that are not off-ramp traffic | 7 (5 to 11) | 19 | above |
| Intents listed, together | | 101 (71 to 131) | 90 | |
| Other through cars (no intent listed) | | | 4 | |

Model through cars by origin and destination group (largest 12 of 12 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 40.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 19.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 12.0 | Claremont Avenue |
| Telegraph Ave to the south (downtown Oakland) | Telegraph Ave from the north (Berkeley) | 6.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Ashby Ave from the west (Emeryville and I-80) | 4.0 | none near the study area |
| San Pablo Ave (Emeryville and West Oakland) | Claremont Ave and Tunnel Rd toward the hills | 3.0 | Alcatraz Avenue then Claremont Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Telegraph Ave from the north (Berkeley) | 3.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 2.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 2.0 | SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Emeryville and West Oakland streets (55th to 67th Streets) | 1.0 | SR-24 |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Alcatraz Ave from the west (Emeryville side) | 1.0 | College Avenue then Alcatraz Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | College Ave from the north (Berkeley) | 1.0 | SR-24 then Claremont Avenue then College Avenue |

By the arterial these cars would otherwise use: Telegraph Avenue 70 veh/h; Claremont Avenue 12 veh/h; none near the study area 4 veh/h; Alcatraz Avenue then Claremont Avenue 3 veh/h; SR-24 3 veh/h; College Avenue then Alcatraz Avenue 1 veh/h.

### Hillegass Avenue NB

Observed (PM): 94 cars entered at the south end, 48 drove the whole street, 109 left it at Alcatraz Ave (43 west, 54 east, 12 straight), and 47% of the block's trips came from a freeway. ASSUMPTION: freeway-origin through cars are 40 veh/h (52 freeway-origin trips times 94 / (94 + 29)), spread over the exits in proportion (0.37); the through share of exits is 48 / 109 = 0.44.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Hillegass Ave to reach Alcatraz Ave west and Telegraph Ave north | OBSERVED turn count x ASSUMPTION share (43 left turns x 0.37) | 16 (9 to 20) | 17 | within |
| SR-24 off-ramp traffic using Hillegass Ave to reach College Ave and Berkeley | OBSERVED turn count x ASSUMPTION share (54 right turns x 0.37) | 20 (11 to 25) | 34 | above |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach Alcatraz Ave west | ASSUMPTION: through exits (43 x 0.44) that are not off-ramp traffic | 3 (0 to 10) | 4 | within |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach College Ave and Berkeley | ASSUMPTION: through exits (54 x 0.44) that are not off-ramp traffic | 4 (0 to 13) | 21 | above |
| Intents listed, together | | 43 (20 to 68) | 76 | |
| Other through cars (no intent listed) | | | 6 | |

Model through cars by origin and destination group (largest 12 of 14 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 17.0 | SR-24 |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 12.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 11.0 | Telegraph Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 9.0 | Claremont Avenue then Alcatraz Avenue |
| SR-13 Warren Freeway (via SR-24 east) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 6.0 | Claremont Avenue then Alcatraz Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Claremont Ave and Tunnel Rd toward the hills | 4.0 | Telegraph Avenue then Alcatraz Avenue then Claremont Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 4.0 | SR-24 then Claremont Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | College Ave from the north (Berkeley) | 4.0 | SR-24 then Claremont Avenue then College Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 3.0 | Claremont Avenue then College Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Telegraph Ave from the north (Berkeley) | 3.0 | none near the study area |
| Telegraph Ave to the south (downtown Oakland) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 3.0 | Telegraph Avenue |
| Telegraph Ave to the south (downtown Oakland) | College Ave from the north (Berkeley) | 3.0 | Telegraph Avenue |
| other pairs | | 3.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 30 veh/h; SR-24 17 veh/h; Claremont Avenue then Alcatraz Avenue 15 veh/h; SR-24 then Claremont Avenue 4 veh/h; SR-24 then Claremont Avenue then College Avenue 4 veh/h; Telegraph Avenue then Alcatraz Avenue then Claremont Avenue 4 veh/h.

### Hillegass Avenue SB

Observed (PM): 178 cars entered at the top (76 turned in from Alcatraz Ave west, 98 from the east, 4 came straight from the north), 79 drove the whole street, and 68% of the block's trips (109 veh/h) went to a freeway. ASSUMPTION: freeway-bound cars that did not join mid-street are 87 veh/h (109 x 178 / (178 + 44)), half of the 174 turn-ins; low = the whole-street share of the turn-ins (0.45), high = the freeway-bound share without the mid-street correction (0.63).

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Telegraph Ave, Alcatraz Ave west and West Berkeley traffic turning off Alcatraz Ave onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (76 turn-ins x 0.50) | 38 (34 to 48) | 14 | below |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (98 turn-ins x 0.50) | 49 (44 to 62) | 20 | below |
| Intents listed, together | | 87 (78 to 110) | 34 | |
| Other through cars (no intent listed) | | | 32 | |

Model through cars by origin and destination group (largest 12 of 15 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 21.0 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 14.0 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 10.0 | Claremont Avenue then SR-24 |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 5.0 | College Avenue then Claremont Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 3.0 | Claremont Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Claremont Ave and Tunnel Rd toward the hills | 2.0 | Alcatraz Avenue then Claremont Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Telegraph Ave to the south (downtown Oakland) | 2.0 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 2.0 | Telegraph Avenue |
| Alcatraz Ave from the west (Emeryville side) | Berkeley hills to the northeast (Evergreen Ln, Gravatt Dr) | 1.0 | Alcatraz Avenue then Claremont Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-13 Warren Freeway (via SR-24 east) | 1.0 | Alcatraz Avenue then College Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 1.0 | Alcatraz Avenue then College Avenue |
| West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) | College Ave from the north (Berkeley) | 1.0 | Alcatraz Avenue then College Avenue |
| other pairs | | 3.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 39 veh/h; Claremont Avenue then SR-24 13 veh/h; College Avenue then Claremont Avenue then SR-24 5 veh/h; Alcatraz Avenue then Claremont Avenue 4 veh/h; Alcatraz Avenue then College Avenue 3 veh/h; College Avenue 1 veh/h.

### Colby Street SB

Observed (PM): 139 cars entered at the top (76 from Alcatraz Ave west, 50 from the east, 13 from the north), 39 drove the whole street, 45% of the block's trips (72 veh/h) went to a freeway and 22% came by way of Telegraph Ave. ASSUMPTION: freeway-bound cars that did not join mid-street are 46 veh/h (72 x 139 / (139 + 79)), 0.365 of the 126 turn-ins; low = the whole-street share (0.31), high = the unadjusted freeway share (0.57). The Telegraph Ave cars are the 22% x 160 = 35 of the 76 west turn-ins.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Southbound Telegraph Ave traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (35 Telegraph Ave cars x 0.365) | 13 (11 to 20) | 10 | below |
| Alcatraz Ave west, Ashby Ave and West Berkeley traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (41 other west turn-ins x 0.365) | 15 (13 to 23) | 21 | within |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (50 east turn-ins x 0.365) | 18 (15 to 29) | 9 | below |
| Intents listed, together | | 46 (39 to 72) | 40 | |
| Other through cars (no intent listed) | | | 26 | |

Model through cars by origin and destination group (largest 12 of 25 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Shattuck Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 8.0 | none near the study area |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 8.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 6.0 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 6.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 5.0 | Alcatraz Avenue then College Avenue then Claremont Avenue then SR-24 |
| Alcatraz Ave from the west (Emeryville side) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 4.0 | SR-24 |
| Ashby Ave from the west (Emeryville and I-80) | SR-13 Warren Freeway (via SR-24 east) | 4.0 | SR-24 |
| Alcatraz Ave from the west (Emeryville side) | SR-13 Warren Freeway (via SR-24 east) | 2.0 | SR-24 |
| Ashby Ave from the west (Emeryville and I-80) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 2.0 | SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | West Oakland to the southwest (Adeline St, Market St) | 2.0 | Claremont Avenue |
| West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 2.0 | College Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 2.0 | Claremont Avenue then SR-24 |
| other pairs | | 15.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 22 veh/h; SR-24 12 veh/h; none near the study area 12 veh/h; Alcatraz Avenue then College Avenue then Claremont Avenue then SR-24 5 veh/h; Claremont Avenue then Alcatraz Avenue 3 veh/h; Alcatraz Avenue then Claremont Avenue 2 veh/h.

### Study area, all residential and service streets

Model: 454 through cars per hour.

Model through cars by origin and destination group (largest 12 of 56 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 47.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 44.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 39.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 32.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 32.0 | Claremont Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 25.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | San Pablo Ave (Emeryville and West Oakland) | 21.0 | Claremont Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 17.0 | SR-24 |
| Telegraph Ave from the north (Berkeley) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 16.0 | Telegraph Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Claremont Ave and Tunnel Rd toward the hills | 14.0 | SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Emeryville and West Oakland streets (55th to 67th Streets) | 12.0 | SR-24 |
| Shattuck Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 11.0 | none near the study area |
| other pairs | | 144.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 241 veh/h; Claremont Avenue 60 veh/h; SR-24 55 veh/h; none near the study area 29 veh/h; Claremont Avenue then Alcatraz Avenue 19 veh/h; Alcatraz Avenue then Claremont Avenue 13 veh/h.

By origin group: South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 106; Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 97; SR-24 eastbound off-ramps (arriving from Oakland and I-980) 81; Telegraph Ave from the north (Berkeley) 43; Telegraph Ave to the south (downtown Oakland) 19; West Oakland to the southwest (Adeline St, Market St) 18; Claremont Ave and Tunnel Rd toward the hills 15; SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) 15; Shattuck Ave from the north (Berkeley) 11; College Ave from the north (Berkeley) 10.

By destination group: SR-24 westbound on-ramps (toward Oakland and I-980) 92; Telegraph Ave from the north (Berkeley) 92; Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 75; South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 59; Claremont Ave and Tunnel Rd toward the hills 41; San Pablo Ave (Emeryville and West Oakland) 25; Emeryville and West Oakland streets (55th to 67th Streets) 16; College Ave from the north (Berkeley) 10; SR-24 eastbound on-ramps (toward the Caldecott Tunnel) 9; SR-13 Warren Freeway (via SR-24 east) 8.


## Through cars by intent (cut-through intent view)

A through car is tallied once, under the first intent that fits it (the on-ramp on its planned route, the off-ramp it has driven, or the origin and destination groups of its trip), at the moment the through count counts it. Cars an hour over the run, the same window as the through-car figure (458 an hour).

| Intent | Basis | Cars an hour | Share |
| --- | --- | --- | --- |
| on-2853241697 | observed | 93 | 20% |
| Other on-ramps | assumed | 18 | 4% |
| off-52990846 | observed | 81 | 18% |
| Other off-ramps | assumed | 20 | 4% |
| Downtown, south and west Oakland traffic using side streets to reach Berkeley and Telegraph Ave north | assumed | 97 | 21% |
| Berkeley and Telegraph Ave north traffic using side streets to reach downtown, south and west Oakland | assumed | 68 | 15% |
| Oakland cross-town traffic (West Oakland, Broadway, Piedmont, Emeryville) using side streets near Claremont Ave and Telegraph Ave | assumed | 44 | 10% |
| Other (no intent listed) |  | 37 | 8% |

Intents listed cover 92% of through cars.


## Select-link shares: modeled vs observed (design D5: headline = freeway shares, tolerance +/-10 pp)

- Hillegass Avenue NB: 4 links (path Claremont Avenue -> Alcatraz Avenue (434 m)), 155 trips (145 completed)
- Colby Street NB: 8 links (path Claremont Avenue -> Alcatraz Avenue (680 m)), 178 trips (156 completed)
- Hillegass Avenue SB: 4 links (path Alcatraz Avenue -> Claremont Avenue (433 m)), 133 trips (123 completed)
- Colby Street SB: 8 links (path Alcatraz Avenue -> Claremont Avenue (680 m)), 207 trips (195 completed)

| Block | Side | Via | Observed | Modeled | Diff (pp) | n trips | Headline |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue NB | from | freeway | 47% | 50% | +3 | 155 | within |
| Hillegass Avenue NB | to | Benvenue Avenue | 21% (PM 33%) | 12% | -9 | 155 |  |
| Hillegass Avenue NB | to | College Avenue | 6% | 15% | +9 | 155 |  |
| Hillegass Avenue NB | to | Alcatraz Avenue WB | 27% | 26% | -1 | 155 |  |
| Colby Street NB | from | freeway | 47% | 44% | -3 | 178 | within |
| Colby Street NB | to | Alcatraz Avenue WB | 48% | 51% | +3 | 178 |  |
| Colby Street NB | to | Telegraph Avenue | 25% | 45% | +20 | 178 |  |
| Colby Street NB | to | College Avenue | 3% | 3% | -0 | 178 |  |
| Hillegass Avenue SB | from | Alcatraz Avenue WB | 46% | 25% | -21 | 133 |  |
| Hillegass Avenue SB | from | Benvenue Avenue | 26% | 3% | -23 | 133 |  |
| Hillegass Avenue SB | from | College Avenue | 16% | 14% | -2 | 133 |  |
| Hillegass Avenue SB | to | freeway | 57% (PM 68%) | 50% | -7 | 133 | within |
| Colby Street SB | from | Alcatraz Avenue EB | 43% | 24% | -19 | 207 |  |
| Colby Street SB | from | Alcatraz Avenue WB | 46% | 10% | -36 | 207 |  |
| Colby Street SB | from | Telegraph Avenue | 22% | 17% | -5 | 207 |  |
| Colby Street SB | to | freeway | 45% | 41% | -4 | 207 | within |
| Colby Street SB | to | Forest Street | 34% | 22% | -12 | 207 |  |

Headline shares within tolerance: 4 of 4. Observed column uses the PM-peak share where one is given and the period is pm_peak. 'Via' shares are the fraction of select-link trips using that street before (from) or after (to) the block; freeway = origin / destination gate with a motorway-class link attached.

## Claremont ramps: streets used before the on-ramp / after the off-ramp

Observed shares are for traffic from/to the north only. 'Modeled' is over all trips on the ramps and any visit to the street (an upper bound for streets that serve both sides). 'Modeled, side' counts only trips whose surface end lies on the side of the ramp stated in the targets file (`freewayRamp.side`), and for a street with a qualifier ("north of X") only its links on that side of X.

| Direction | Via | Observed | Modeled | n ramp trips | Modeled, side | n side trips |
| --- | --- | --- | --- | --- | --- | --- |
| onto freeway | College Avenue | 16% | 18% | 605 | 21% | 531 |
| onto freeway | Hillegass Avenue | 12% | 12% | 605 | 14% | 531 |
| onto freeway | Martin Street | 10% | 16% | 605 | 17% | 531 |
| onto freeway | Colby Street | 8% | 12% | 605 | 14% | 531 |
| onto freeway | Telegraph Avenue north of Alcatraz Avenue | 8% | 11% | 605 | 8% | 531 |
| onto freeway | Benvenue Avenue | 5% | 6% | 605 | 7% | 531 |
| from freeway | College Avenue | 10% | 10% | 636 | 11% | 619 |
| from freeway | Martin Street | 10% | 9% | 636 | 10% | 619 |
| from freeway | Colby Street | 8% | 10% | 636 | 11% | 619 |
| from freeway | Hillegass Avenue | 5% | 8% | 636 | 9% | 619 |
| from freeway | Benvenue Avenue | 3% | 3% | 636 | 3% | 619 |

## Top 15 links by delay

| Link | Street | Class | Lanes | Len (m) | End node control | Delay (veh-h) | Stopped (veh-h) | Mean stopped veh | Flow (veh/h) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 4175 | (unnamed) | Motorway | 2 | 142 | uncontrolled | 10.47 | 2.05 | 2.1 | 1522 |
| 3387 | Bridge Road | Residential | 1 | 145 | two_way_stop | 8.40 | 7.31 | 7.3 | 131 |
| 2037 | Alcatraz Avenue | Tertiary | 1 | 202 | uncontrolled | 7.51 | 5.52 | 5.5 | 466 |
| 1051 | Adeline Street | Secondary | 4 | 50 | signal | 7.31 | 6.28 | 6.3 | 1108 |
| 1049 | Adeline Street | Secondary | 4 | 43 | signal | 6.95 | 5.73 | 5.7 | 1279 |
| 3395 | Ashby Avenue | Primary | 1 | 129 | signal | 6.80 | 5.58 | 5.6 | 493 |
| 4329 | Claremont Avenue | Secondary | 2 | 113 | signal | 6.53 | 5.12 | 5.1 | 497 |
| 460 | Sacramento Street | Tertiary | 2 | 104 | two_way_stop | 6.48 | 5.39 | 5.4 | 436 |
| 1108 | Market Street | Secondary | 4 | 36 | signal | 6.14 | 4.79 | 4.8 | 1206 |
| 2921 | Russell Street | Residential | 1 | 260 | uncontrolled | 5.99 | 4.85 | 4.9 | 139 |
| 1879 | 58th Street | Residential | 1 | 221 | two_way_stop | 5.98 | 5.17 | 5.2 | 92 |
| 4398 | Ashby Avenue | Primary | 2 | 96 | uncontrolled | 5.86 | 4.08 | 4.1 | 762 |
| 3434 | Claremont Avenue | Secondary | 1 | 93 | all_way_stop | 5.80 | 2.96 | 3.0 | 527 |
| 1666 | 52nd Street | Secondary | 4 | 39 | signal | 5.62 | 4.92 | 4.9 | 686 |
| 3457 | The Uplands | Tertiary | 1 | 151 | two_way_stop | 5.56 | 3.29 | 3.3 | 422 |

## Top 15 nodes by blocked time

Blocked time = lane-head seconds waiting at the stop line without permission (signal red, conflict, stop sign or no downstream space).

| Node | Streets | Control | Gate | Blocked (lane-h) | of which no downstream space | Signal plan at end (cycle: greens) |
| --- | --- | --- | --- | --- | --- | --- |
| 447 | Adeline Street / Alcatraz Avenue | signal |  | 5.37 | 0.09 | 75 s: 29/36 |
| 446 | Market Street / Stanford Avenue | signal |  | 4.83 | 0.19 | 75 s: 31/34 |
| 680 | 52nd Street / Shattuck Avenue | signal |  | 4.68 | 0.04 | 90 s: 18/19/37 |
| 1406 | Ashby Avenue / Claremont Avenue | signal |  | 4.19 | 0.30 | 80 s: 35/15/15 |
| 479 | Adeline Street / Martin Luther King Junior Way / Stanford Avenue | signal |  | 3.06 | 0.02 | 75 s: 49/16 |
| 30 | 57th Street / Adeline Street / Market Street | signal |  | 3.00 | 0.03 | 75 s: 21/24/15 |
| 332 | 55th Street / Martin Luther King Junior Way | signal |  | 2.97 | 0.03 | 75 s: 36/29 |
| 37 | San Pablo Avenue / Stanford Avenue | signal |  | 2.95 | 0.01 | 75 s: 21/44 |
| 185 | Alcatraz Avenue / Sacramento Street | signal |  | 2.88 | 0.04 | 75 s: 32/33 |
| 242 | Ashby Avenue / Martin Luther King Junior Way | signal |  | 2.82 | 0.00 | 75 s: 40/25 |
| 501 | Alcatraz Avenue / Shattuck Avenue | signal |  | 2.76 | 0.05 | 75 s: 43/22 |
| 851 | Alcatraz Avenue / Telegraph Avenue | signal |  | 2.72 | 0.04 | 75 s: 45/20 |
| 1080 | 62nd Street / Claremont Avenue / College Avenue | signal |  | 2.71 | 0.02 | 75 s: 20/25/15 |
| 944 | Ashby Avenue / Shattuck Avenue | signal |  | 2.67 | 0.03 | 75 s: 42/23 |
| 1220 | Ashby Avenue / College Avenue | signal |  | 2.65 | 0.06 | 75 s: 34/31 |

Phases of the five most blocked signals (green s: approach links with their lanes, link ids in brackets):

- node 447: 29 s: Adeline Street 4L [1049], Adeline Street 4L [1051]; 36 s: Alcatraz Avenue 2L [1048], Alcatraz Avenue 2L [1133]
- node 446: 31 s: Stanford Avenue 3L [941], Stanford Avenue 3L [1055]; 34 s: Market Street 4L [1108], Market Street 3L [1111]
- node 680: 18 s: 52nd Street 4L [1662]; 19 s: 52nd Street 4L [1666], 52nd Street 4L [1662]; 37 s: Shattuck Avenue 2L [1653], Shattuck Avenue 2L [1705]
- node 1406: 35 s: Ashby Avenue 1L [3395], Ashby Avenue 2L [3426]; 15 s: Claremont Avenue 2L [4329]; 15 s: Claremont Avenue 3L [3447]
- node 479: 49 s: Martin Luther King Junior Way 3L [1025], Adeline Street 3L [4143]; 16 s: Stanford Avenue 3L [4139]

## Cars cleared from gridlock near and far (judged zone)

Judged zone: the study area, its bounding streets and the junctions on them, plus nodes within 200 m of it along the network (111 nodes, 329 links). A far clearing counts against the stability rule when its blocking chain (vehicles held at least 60 s by a full exit, at the 5 s snapshot before it) reaches a link in the zone.

| Buffer (m) | Near | Far | Far, chain reaches the zone | Judged |
| --- | --- | --- | --- | --- |
| 100.0 | 0 | 0 | 0 | 0 |
| 200.0 | 0 | 0 | 0 | 0 |
| 400.0 | 0 | 0 | 0 | 0 |

Entry backlog at the end of the run: 1 trips waiting at origins in the zone, of 15 in all.

| Bounding street | Links | Longest standing queue on one link (m) | Link (length m) | At (min) | Share of samples with a link full |
| --- | --- | --- | --- | --- | --- |
| Telegraph Avenue | 28 | 59.0 | 1604 (94.0) | 45.9 | 0.0 |
| Alcatraz Avenue | 14 | 72.0 | 4238 (84.0) | 39.8 | 0.017 |
| College Avenue | 6 | 78.0 | 2805 (102.0) | 51.6 | 0.0 |
| Claremont Avenue | 13 | 52.0 | 2776 (161.0) | 22.9 | 0.0 |
| CA 24 | 3 | 36.0 | 1945 (188.0) | 46.2 | 0.0 |

## Junction recovery

Policy `physical`. Node entries by cars and cyclists in the run: 736700 (settle interval 0). An admission is an entry the ordinary rule would have refused; head-seconds count the time a waiting head vehicle had the reason invoked, and the part of it in which it still could not enter. Courtesy and the yield fallback change priority only; under `physical` the conflict bypass never admits.

| Reason | Admissions per hour | Per 1,000 entries | Head-s invoked | Head-s blocked |
| --- | --- | --- | --- | --- |
| courtesy | 116.0 | 0.157 | 527 | 490 |
| yield fallback | 48.0 | 0.065 | 14 | 0 |
| conflict bypass | 0.0 | 0.000 | 5 | 5 |

Vehicles removed while held in a node by a full exit: 0 (0.0 per hour, included in the gridlock removals).

| Node | Streets | Control | Courtesy | Yield fallback | Conflict bypass | Held removals |
| --- | --- | --- | --- | --- | --- | --- |
| 1429 | Claremont Avenue / Claremont Boulevard | two_way_stop | 16 | 1 | 0 | 0 |
| 395 | 65th Street / Shattuck Avenue | two_way_stop | 7 | 3 | 0 | 0 |
| 141 | 63rd Street / Lowell Street / Market Street | two_way_stop | 6 | 3 | 0 | 0 |
| 342 | 56th Street / Shattuck Avenue | two_way_stop | 5 | 2 | 0 | 0 |
| 492 | Aileen Street / Shattuck Avenue | two_way_stop | 2 | 5 | 0 | 0 |
| 1439 | Alvarado Road / Tunnel Road | two_way_stop | 6 | 1 | 0 | 0 |
| 727 | 52nd Street | uncontrolled | 5 | 1 | 0 | 0 |
| 1399 | Bridge Road / Tunnel Road | two_way_stop | 3 | 3 | 0 | 0 |
| 147 | 59th Street / Grace Avenue / Los Angeles Street | two_way_stop | 5 | 0 | 0 | 0 |
| 171 | Acton Street / Ashby Avenue | two_way_stop | 3 | 1 | 0 | 0 |

## Entry backlog by origin node at end of run (top 10)

| Node | Streets | Trips waiting | Offered veh/h (before scale) |
| --- | --- | --- | --- |
| 1383 | Alvarado Road / Bridge Road | 10 | 46 |
| 395 | 65th Street / Shattuck Avenue | 1 | 2 |
| 1093 | College Avenue / Harwood Avenue | 1 | 230 |
| 1232 | Ashby Avenue / Claremont Crescent | 1 | 3 |
| 1385 | Oak Ridge Road / Tunnel Road | 1 | 24 |
| 1672 | Warren Freeway | 1 | 779 |

## Flow on key streets (veh/h per direction, study-area links of 40 m or more)

| Street | Direction of travel | Links | Median flow | Max flow |
| --- | --- | --- | --- | --- |
| Telegraph | N | 12 | 991 | 1028 |
| Telegraph | S | 10 | 894 | 996 |
| College | N | 3 | 280 | 280 |
| College | S | 3 | 430 | 432 |
| Claremont | N | 6 | 419 | 757 |
| Claremont | S | 7 | 464 | 827 |
| Alcatraz | E | 6 | 390 | 422 |
| Alcatraz | W | 6 | 355 | 360 |
| Hillegass | N | 4 | 94 | 103 |
| Hillegass | S | 4 | 85 | 91 |
| Colby | N | 7 | 96 | 106 |
| Colby | S | 7 | 97 | 136 |
| Martin | E | 2 | 150 | 150 |
| Martin | W | 2 | 107 | 107 |

## Largest demand origins (offered, before scale)

| Node | Streets | Veh/h |
| --- | --- | --- |
| 602 | Grove Shafter Freeway | 3614 |
| 265 | Ashby Avenue | 1242 |
| 943 | Telegraph Avenue / Ward Street | 1052 |
| 183 | San Pablo Avenue | 815 |
| 1672 | Warren Freeway | 779 |
| 971 | Pleasant Valley Avenue | 635 |
| 763 | Telegraph Avenue | 628 |
| 974 | Broadway | 515 |
| 1756 | Claremont Avenue | 484 |
| 1719 | Grove Shafter Freeway | 411 |
