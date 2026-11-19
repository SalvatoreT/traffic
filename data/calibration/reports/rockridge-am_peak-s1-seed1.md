# Calibration report: rockridge am_peak scale 1 seed 1 (60 min)

Offered demand 23204 veh/h x scale 1 = 23204 veh/h. Run took 25.1 s wall clock. Flow tables use the window after a 10 min warm-up; select-link and health figures cover the whole run from an empty network.

## Stability (design D4)

| Criterion | Threshold | Value | Result |
| --- | --- | --- | --- |
| Gridlock removals | 0 | 0 | pass |
| Backlog / spawned | < 2% | 0.2% (50 of 23393) | pass |
| Arterial mean speed (run) | > 4 m/s | 8.91 m/s (last 15 min 8.76) | pass |

Overall: **STABLE**. Mean trip delay 134 s, mean trip time 385 s, completed 23515, unroutable 0.

| t (min) | vehicles in network | backlog | completed | removals | arterial speed in interval (m/s) |
| --- | --- | --- | --- | --- | --- |
| 5 | 2674 | 7 | 1995 | 0 | 9.20 |
| 10 | 2480 | 5 | 4109 | 0 | 9.12 |
| 15 | 2526 | 6 | 6040 | 0 | 8.75 |
| 20 | 2469 | 2 | 7996 | 0 | 8.66 |
| 25 | 2498 | 3 | 9900 | 0 | 9.02 |
| 30 | 2548 | 2 | 11853 | 0 | 9.29 |
| 35 | 2535 | 4 | 13792 | 0 | 9.20 |
| 40 | 2546 | 9 | 15762 | 0 | 8.66 |
| 45 | 2692 | 9 | 17644 | 0 | 8.78 |
| 50 | 2659 | 37 | 19547 | 0 | 8.67 |
| 55 | 2710 | 41 | 21450 | 0 | 8.83 |
| 60 | 2611 | 50 | 23515 | 0 | 8.77 |
## Wandering (completed car trips)

Detour ratio = distance driven (link and movement lengths) over the shortest network distance from the trip's origin to its destination. Detour against the free-flow route uses the time-shortest route with no congestion and no noise, which is what a purposeful driver without live information would follow (it differs from the shortest distance when a faster, longer road exists). A switch is a change of the remaining route while en route. Loops: the same link twice or the same node three or more times. Reversals: a link followed by its reverse within 200 m. 'Study-area vehicle-miles' are miles driven on links inside the study area; the last column is the share of them driven by trips with a detour ratio above 1.3. Guided drivers re-evaluate their route every epoch; the others keep their departure route unless it is blocked.

| Trips | n | Switches per trip | With a switch | Mean detour | Median detour | Detour > 1.3 | Detour > 2 | Mean detour vs free-flow route | Vs free-flow route > 1.3 | Loops | Reversals | Study veh-miles | Of them by detour > 1.3 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| all trips | 21576 | 0.01 | 1.5% | 1.084 | 1.051 | 3.9% | 0.0% | 1.026 | 1.8% | 0.0% | 0.3% | 2152 | 8.8% |
| gate to gate | 6607 | 0.03 | 2.6% | 1.092 | 1.066 | 3.6% | 0.0% | 1.028 | 2.1% | 0.0% | 0.3% | 548 | 8.3% |
| with a local end | 14969 | 0.01 | 1.0% | 1.081 | 1.047 | 4.0% | 0.0% | 1.026 | 1.8% | 0.0% | 0.4% | 1604 | 9.0% |
| guided drivers | 9966 | 0.03 | 2.9% | 1.083 | 1.051 | 3.7% | 0.0% | 1.024 | 1.5% | 0.0% | 0.3% | 1009 | 6.7% |
| other drivers | 11610 | 0.00 | 0.2% | 1.085 | 1.051 | 4.1% | 0.0% | 1.028 | 2.1% | 0.0% | 0.4% | 1142 | 10.6% |

## Reported patterns (diagnostics; configured in the targets file under `patterns`)

(a) Trips between the surface gates on the north side of the ramps and the freeway mainline gates, and the local-street (residential and service links in the study area) vehicle-miles they drive. Share = of all completed trips' local-street vehicle-miles (341 miles). No observed counterpart exists for this quantity (the targets file has only the select-link shares above).

| Trips | n trips | Local-street veh-miles | Share of all local-street veh-miles |
| --- | --- | --- | --- |
| surface gates to the freeway | 893 | 18.9 | 6% |
| freeway to the surface gates | 1058 | 20.4 | 6% |

(b) Corridor trips: completed trips from beyond one end of the corridor's study-area extent (the bypass street and its arterial together) to beyond the other end, within a lateral limit of the corridor, by direction. 'Bypass' = at least N blocks (links) on the bypass street; 'arterial' = fewer bypass blocks and at least N on the arterial; 'other' = neither (another street, the freeway or a short use); blocks are counted on the corridor's study-area links. No observed counterpart exists for these shares. The related observed values are in the select-link table above: northbound Hillegass Ave traffic rarely ends on College Ave (6%), 21 to 33% jogs to Benvenue Ave, and southbound freeway-bound drivers on College Ave commonly arrive via Ashby Ave and Benvenue Ave and jog to Hillegass Ave.

| Bypass | Arterial | N | Direction | Corridor trips | Bypass | Arterial | Other | Mean bypass blocks |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue | College Avenue | 3 | N | 1061 | 3% | 15% | 82% | 0.1 |
| Hillegass Avenue | College Avenue | 3 | S | 1129 | 2% | 21% | 77% | 0.1 |

## Per-mode results

Offered: 23204 car veh/h; 497 bicycle flows (702/h); 2000 pedestrian flows (2228/h). Bicycle and pedestrian volumes are assumptions, not counts.

| Mode | In network | Completed | Mean time (s) | Other |
| --- | --- | --- | --- | --- |
| Car | 2611 | 23515 | 385 | |
| Bicycle | 54 | 731 | 251 | |
| Pedestrian | 284 | 2146 | 466 | mean crossing delay 7.2 s |

Vulnerable road users (surrogate indicators): pedestrian conflicts 336, bicycle conflicts 943, close passes 659, pedestrian injury severity mean 0.047 (AIS4+, 12375 supported of 12375 encounters), cyclist injury severity mean 0.064 (MAIS3+F, 3181 supported of 5850 encounters) (separate endpoints, never summed), mean vehicle speed at pedestrian encounters 2.46 m/s.


## Volunteer whole-street counts

Each car counts once when it passes the last stop line after driving the full directed corridor in order. The measurement window is 50.0 minutes. The last two columns describe trips that visited any corridor link during the full run.

| Corridor | Counted whole street (veh/h) | Modeled whole street (veh/h) | Used in fit | Through trips on any link (veh/h) | Freeway trips on any link (veh/h) |
| --- | --- | --- | --- | --- | --- |
| Hillegass Avenue NB | 34 | 31 | yes | 77 | 73 |
| Colby Street NB | 33 | 46 | yes | 81 | 73 |
| Hillegass Avenue SB | 36 | 19 | yes | 59 | 72 |
| Colby Street SB | 46 | 32 | yes | 89 | 91 |

## Intent map: through cars by where they come from and where they are going

Through = neither trip end is in the study area. Groups are the approach groups of the area config (data/areas); a node that is not a gate takes the group of the nearest surface gate (ASSUMPTION). The arterial is the one a trip would use on the shortest free-flow path with the study area's residential and service streets closed, where that path runs on a boundary street near the study area.

Model figures are the mean of 1 seed(s), per hour of the run. Basis: OBSERVED = read from the resident volunteer count of Feb 25, 2025 or its headline shares; ASSUMPTION = inferred from those numbers or chosen.

### Colby Street NB

Observed (PM): 182 cars entered at the south end, 102 drove the whole street, 164 left it at Alcatraz Ave (131 left, 32 right, 1 straight), and 47% of the block's trips came from a freeway (the headline share). ASSUMPTION: freeway-origin cars that do not end along the street are 65 veh/h (the 82 freeway-origin trips on the block, 47% of 174, times the 182 / (182 + 47) of its cars that entered at the south end rather than joining on the way), spread over the 164 exits in proportion (0.40); the other through cars come from the Telegraph Ave and south-side approaches that feed the street's south end. Ranges: low = 131 (32) x 0.47 x 0.62 (the whole-street share of exits), high = 131 (32) x 0.47.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | OBSERVED turn count x ASSUMPTION share (131 left turns x 0.40) | 52 (38 to 62) | 34 | below |
| Telegraph Ave and south-side traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | ASSUMPTION: the through left-turners (131 x 0.62 = 81) that are not off-ramp traffic | 29 (19 to 43) | 26 | within |
| SR-24 off-ramp traffic using Colby St to reach College Ave and Berkeley (right at Alcatraz Ave) | OBSERVED turn count x ASSUMPTION share (32 right turns x 0.40) | 13 (9 to 15) | 5 | below |
| Telegraph Ave and south-side traffic using Colby St to reach College Ave and Berkeley | ASSUMPTION: the through right-turners (32 x 0.62 = 20) that are not off-ramp traffic | 7 (5 to 11) | 15 | above |
| Intents listed, together | | 101 (71 to 131) | 80 | |
| Other through cars (no intent listed) | | | 1 | |

Model through cars by origin and destination group (largest 12 of 16 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 32.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 14.0 | Claremont Avenue then College Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 12.0 | Claremont Avenue then Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Ashby Ave from the west (Emeryville and I-80) | 6.0 | none near the study area |
| West Oakland to the southwest (Adeline St, Market St) | Telegraph Ave from the north (Berkeley) | 3.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 3.0 | SR-24 then Claremont Avenue |
| Telegraph Ave to the south (downtown Oakland) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 2.0 | Telegraph Avenue |
| San Pablo Ave (Emeryville and West Oakland) | Claremont Ave and Tunnel Rd toward the hills | 1.0 | Alcatraz Avenue then Claremont Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Alcatraz Ave from the west (Emeryville side) | 1.0 | Claremont Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | San Pablo Ave (Emeryville and West Oakland) | 1.0 | Claremont Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Berkeley hills to the northeast (Evergreen Ln, Gravatt Dr) | 1.0 | Claremont Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Ashby Ave from the west (Emeryville and I-80) | 1.0 | SR-24 then Telegraph Avenue |
| other pairs | | 4.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 38 veh/h; Claremont Avenue then College Avenue 14 veh/h; Claremont Avenue then Telegraph Avenue 12 veh/h; none near the study area 7 veh/h; Claremont Avenue 3 veh/h; SR-24 then Claremont Avenue 3 veh/h.

### Hillegass Avenue NB

Observed (PM): 94 cars entered at the south end, 48 drove the whole street, 109 left it at Alcatraz Ave (43 west, 54 east, 12 straight), and 47% of the block's trips came from a freeway. ASSUMPTION: freeway-origin through cars are 40 veh/h (52 freeway-origin trips times 94 / (94 + 29)), spread over the exits in proportion (0.37); the through share of exits is 48 / 109 = 0.44.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Hillegass Ave to reach Alcatraz Ave west and Telegraph Ave north | OBSERVED turn count x ASSUMPTION share (43 left turns x 0.37) | 16 (9 to 20) | 19 | within |
| SR-24 off-ramp traffic using Hillegass Ave to reach College Ave and Berkeley | OBSERVED turn count x ASSUMPTION share (54 right turns x 0.37) | 20 (11 to 25) | 23 | within |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach Alcatraz Ave west | ASSUMPTION: through exits (43 x 0.44) that are not off-ramp traffic | 3 (0 to 10) | 12 | above |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach College Ave and Berkeley | ASSUMPTION: through exits (54 x 0.44) that are not off-ramp traffic | 4 (0 to 13) | 19 | above |
| Intents listed, together | | 43 (20 to 68) | 73 | |
| Other through cars (no intent listed) | | | 4 | |

Model through cars by origin and destination group (largest 12 of 19 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 12.0 | SR-24 |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 9.0 | Claremont Avenue then Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 9.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | College Ave from the north (Berkeley) | 7.0 | SR-24 then Claremont Avenue then College Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Ashby Ave from the west (Emeryville and I-80) | 5.0 | SR-24 then Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Ashby Ave from the west (Emeryville and I-80) | 4.0 | none near the study area |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 4.0 | Claremont Avenue then College Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Claremont Ave and Tunnel Rd toward the hills | 4.0 | Claremont Avenue |
| SR-13 Warren Freeway (via SR-24 east) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 4.0 | Claremont Avenue then Alcatraz Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 4.0 | SR-24 then Claremont Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Shattuck Ave from the north (Berkeley) | 3.0 | Claremont Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Telegraph Ave from the north (Berkeley) | 3.0 | none near the study area |
| other pairs | | 9.0 | |

By the arterial these cars would otherwise use: SR-24 13 veh/h; Telegraph Avenue 12 veh/h; Claremont Avenue 9 veh/h; Claremont Avenue then Telegraph Avenue 9 veh/h; none near the study area 8 veh/h; SR-24 then Claremont Avenue then College Avenue 7 veh/h.

### Hillegass Avenue SB

Observed (PM): 178 cars entered at the top (76 turned in from Alcatraz Ave west, 98 from the east, 4 came straight from the north), 79 drove the whole street, and 68% of the block's trips (109 veh/h) went to a freeway. ASSUMPTION: freeway-bound cars that did not join mid-street are 87 veh/h (109 x 178 / (178 + 44)), half of the 174 turn-ins; low = the whole-street share of the turn-ins (0.45), high = the freeway-bound share without the mid-street correction (0.63).

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Telegraph Ave, Alcatraz Ave west and West Berkeley traffic turning off Alcatraz Ave onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (76 turn-ins x 0.50) | 38 (34 to 48) | 10 | below |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (98 turn-ins x 0.50) | 49 (44 to 62) | 20 | below |
| Intents listed, together | | 87 (78 to 110) | 30 | |
| Other through cars (no intent listed) | | | 29 | |

Model through cars by origin and destination group (largest 12 of 14 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 19.0 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 10.0 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 8.0 | Claremont Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 7.0 | Claremont Avenue then SR-24 |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 5.0 | College Avenue then Claremont Avenue then SR-24 |
| Ashby Ave from the west (Emeryville and I-80) | Berkeley hills to the northeast (Evergreen Ln, Gravatt Dr) | 2.0 | none near the study area |
| Ashby Ave from the west (Emeryville and I-80) | College Ave from the north (Berkeley) | 1.0 | Alcatraz Avenue then College Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Claremont Ave and Tunnel Rd toward the hills | 1.0 | Alcatraz Avenue then Claremont Avenue |
| West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) | College Ave from the north (Berkeley) | 1.0 | Alcatraz Avenue then College Avenue |
| West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) | Berkeley hills to the northeast (Evergreen Ln, Gravatt Dr) | 1.0 | none near the study area |
| San Pablo Ave (Emeryville and West Oakland) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 1.0 | Alcatraz Avenue then College Avenue |
| San Pablo Ave (Emeryville and West Oakland) | Claremont Ave and Tunnel Rd toward the hills | 1.0 | Alcatraz Avenue then Claremont Avenue |
| other pairs | | 2.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 30 veh/h; Claremont Avenue then SR-24 15 veh/h; College Avenue then Claremont Avenue then SR-24 5 veh/h; Alcatraz Avenue then Claremont Avenue 3 veh/h; Alcatraz Avenue then College Avenue 3 veh/h; none near the study area 3 veh/h.

### Colby Street SB

Observed (PM): 139 cars entered at the top (76 from Alcatraz Ave west, 50 from the east, 13 from the north), 39 drove the whole street, 45% of the block's trips (72 veh/h) went to a freeway and 22% came by way of Telegraph Ave. ASSUMPTION: freeway-bound cars that did not join mid-street are 46 veh/h (72 x 139 / (139 + 79)), 0.365 of the 126 turn-ins; low = the whole-street share (0.31), high = the unadjusted freeway share (0.57). The Telegraph Ave cars are the 22% x 160 = 35 of the 76 west turn-ins.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Southbound Telegraph Ave traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (35 Telegraph Ave cars x 0.365) | 13 (11 to 20) | 17 | within |
| Alcatraz Ave west, Ashby Ave and West Berkeley traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (41 other west turn-ins x 0.365) | 15 (13 to 23) | 20 | within |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (50 east turn-ins x 0.365) | 18 (15 to 29) | 8 | below |
| Intents listed, together | | 46 (39 to 72) | 45 | |
| Other through cars (no intent listed) | | | 44 | |

Model through cars by origin and destination group (largest 12 of 22 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 24.0 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 15.0 | Telegraph Avenue |
| Shattuck Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 11.0 | none near the study area |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 6.0 | none near the study area |
| Telegraph Ave from the north (Berkeley) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 6.0 | Telegraph Avenue |
| Ashby Ave from the west (Emeryville and I-80) | SR-13 Warren Freeway (via SR-24 east) | 3.0 | SR-24 |
| Alcatraz Ave from the west (Emeryville side) | SR-13 Warren Freeway (via SR-24 east) | 2.0 | SR-24 |
| Ashby Ave from the west (Emeryville and I-80) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 2.0 | SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 2.0 | College Avenue then Alcatraz Avenue then Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | San Pablo Ave (Emeryville and West Oakland) | 2.0 | none near the study area |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | West Oakland to the southwest (Adeline St, Market St) | 2.0 | Claremont Avenue |
| Claremont Ave and Tunnel Rd toward the hills | Emeryville and West Oakland streets (55th to 67th Streets) | 2.0 | Claremont Avenue |
| other pairs | | 12.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 45 veh/h; none near the study area 23 veh/h; SR-24 8 veh/h; Claremont Avenue 6 veh/h; College Avenue then Alcatraz Avenue then Telegraph Avenue 2 veh/h; Alcatraz Avenue then Claremont Avenue 1 veh/h.

### Study area, all residential and service streets

Model: 449 through cars per hour.

Model through cars by origin and destination group (largest 12 of 61 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 60.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 39.0 | Claremont Avenue then Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 37.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 35.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 30.0 | Claremont Avenue then College Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Ashby Ave from the west (Emeryville and I-80) | 29.0 | Claremont Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 24.0 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 21.0 | Telegraph Avenue |
| Shattuck Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 16.0 | none near the study area |
| Telegraph Ave to the south (downtown Oakland) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 13.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 12.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 12.0 | SR-24 |
| other pairs | | 121.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 210 veh/h; Claremont Avenue 54 veh/h; Claremont Avenue then Telegraph Avenue 39 veh/h; none near the study area 31 veh/h; Claremont Avenue then College Avenue 30 veh/h; SR-24 24 veh/h.

By origin group: South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 113; Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 106; SR-24 eastbound off-ramps (arriving from Oakland and I-980) 68; Telegraph Ave from the north (Berkeley) 49; Telegraph Ave to the south (downtown Oakland) 17; Shattuck Ave from the north (Berkeley) 16; Claremont Ave and Tunnel Rd toward the hills 14; San Pablo Ave (Emeryville and West Oakland) 12; West Oakland to the southwest (Adeline St, Market St) 10; SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) 10.

By destination group: SR-24 westbound on-ramps (toward Oakland and I-980) 93; South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 81; Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 74; Telegraph Ave from the north (Berkeley) 74; Ashby Ave from the west (Emeryville and I-80) 34; Claremont Ave and Tunnel Rd toward the hills 30; Emeryville and West Oakland streets (55th to 67th Streets) 11; College Ave from the north (Berkeley) 10; San Pablo Ave (Emeryville and West Oakland) 8; Berkeley hills to the northeast (Evergreen Ln, Gravatt Dr) 6.


## Through cars by intent (cut-through intent view)

A through car is tallied once, under the first intent that fits it (the on-ramp on its planned route, the off-ramp it has driven, or the origin and destination groups of its trip), at the moment the through count counts it. Cars an hour over the run, the same window as the through-car figure (452 an hour).

| Intent | Basis | Cars an hour | Share |
| --- | --- | --- | --- |
| on-2853241697 | observed | 96 | 21% |
| Other on-ramps | assumed | 14 | 3% |
| off-52990846 | observed | 68 | 15% |
| Other off-ramps | assumed | 14 | 3% |
| Downtown, south and west Oakland traffic using side streets to reach Berkeley and Telegraph Ave north | assumed | 91 | 20% |
| Berkeley and Telegraph Ave north traffic using side streets to reach downtown, south and west Oakland | assumed | 85 | 19% |
| Oakland cross-town traffic (West Oakland, Broadway, Piedmont, Emeryville) using side streets near Claremont Ave and Telegraph Ave | assumed | 46 | 10% |
| Other (no intent listed) |  | 38 | 8% |

Intents listed cover 92% of through cars.


## Select-link shares: modeled vs observed (design D5: headline = freeway shares, tolerance +/-10 pp)

- Hillegass Avenue NB: 4 links (path Claremont Avenue -> Alcatraz Avenue (434 m)), 150 trips (141 completed)
- Colby Street NB: 8 links (path Claremont Avenue -> Alcatraz Avenue (680 m)), 154 trips (147 completed)
- Hillegass Avenue SB: 4 links (path Alcatraz Avenue -> Claremont Avenue (433 m)), 129 trips (118 completed)
- Colby Street SB: 8 links (path Alcatraz Avenue -> Claremont Avenue (680 m)), 250 trips (222 completed)

| Block | Side | Via | Observed | Modeled | Diff (pp) | n trips | Headline |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue NB | from | freeway | 47% | 49% | +2 | 150 | within |
| Hillegass Avenue NB | to | Benvenue Avenue | 21% (PM 33%) | 9% | -12 | 150 |  |
| Hillegass Avenue NB | to | College Avenue | 6% | 11% | +5 | 150 |  |
| Hillegass Avenue NB | to | Alcatraz Avenue WB | 27% | 35% | +8 | 150 |  |
| Colby Street NB | from | freeway | 47% | 47% | +0 | 154 | within |
| Colby Street NB | to | Alcatraz Avenue WB | 48% | 45% | -3 | 154 |  |
| Colby Street NB | to | Telegraph Avenue | 25% | 45% | +20 | 154 |  |
| Colby Street NB | to | College Avenue | 3% | 2% | -1 | 154 |  |
| Hillegass Avenue SB | from | Alcatraz Avenue WB | 46% | 16% | -30 | 129 |  |
| Hillegass Avenue SB | from | Benvenue Avenue | 26% | 2% | -24 | 129 |  |
| Hillegass Avenue SB | from | College Avenue | 16% | 8% | -8 | 129 |  |
| Hillegass Avenue SB | to | freeway | 57% (PM 68%) | 56% | -1 | 129 | within |
| Colby Street SB | from | Alcatraz Avenue EB | 43% | 20% | -23 | 250 |  |
| Colby Street SB | from | Alcatraz Avenue WB | 46% | 15% | -31 | 250 |  |
| Colby Street SB | from | Telegraph Avenue | 22% | 22% | +0 | 250 |  |
| Colby Street SB | to | freeway | 45% | 35% | -10 | 250 | OUTSIDE |
| Colby Street SB | to | Forest Street | 34% | 23% | -11 | 250 |  |

Headline shares within tolerance: 3 of 4. Observed column uses the PM-peak share where one is given and the period is pm_peak. 'Via' shares are the fraction of select-link trips using that street before (from) or after (to) the block; freeway = origin / destination gate with a motorway-class link attached.

## Claremont ramps: streets used before the on-ramp / after the off-ramp

Observed shares are for traffic from/to the north only. 'Modeled' is over all trips on the ramps and any visit to the street (an upper bound for streets that serve both sides). 'Modeled, side' counts only trips whose surface end lies on the side of the ramp stated in the targets file (`freewayRamp.side`), and for a street with a qualifier ("north of X") only its links on that side of X.

| Direction | Via | Observed | Modeled | n ramp trips | Modeled, side | n side trips |
| --- | --- | --- | --- | --- | --- | --- |
| onto freeway | College Avenue | 16% | 17% | 614 | 18% | 525 |
| onto freeway | Hillegass Avenue | 12% | 14% | 614 | 16% | 525 |
| onto freeway | Martin Street | 10% | 11% | 614 | 12% | 525 |
| onto freeway | Colby Street | 8% | 12% | 614 | 14% | 525 |
| onto freeway | Telegraph Avenue north of Alcatraz Avenue | 8% | 10% | 614 | 8% | 525 |
| onto freeway | Benvenue Avenue | 5% | 6% | 614 | 6% | 525 |
| from freeway | College Avenue | 10% | 11% | 611 | 12% | 589 |
| from freeway | Martin Street | 10% | 11% | 611 | 11% | 589 |
| from freeway | Colby Street | 8% | 9% | 611 | 10% | 589 |
| from freeway | Hillegass Avenue | 5% | 8% | 611 | 8% | 589 |
| from freeway | Benvenue Avenue | 3% | 2% | 611 | 2% | 589 |

## Top 15 links by delay

| Link | Street | Class | Lanes | Len (m) | End node control | Delay (veh-h) | Stopped (veh-h) | Mean stopped veh | Flow (veh/h) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 4175 | (unnamed) | Motorway | 2 | 142 | uncontrolled | 11.39 | 2.06 | 2.1 | 1508 |
| 1879 | 58th Street | Residential | 1 | 221 | two_way_stop | 9.95 | 8.69 | 8.7 | 78 |
| 3395 | Ashby Avenue | Primary | 1 | 129 | signal | 8.74 | 7.44 | 7.4 | 293 |
| 3387 | Bridge Road | Residential | 1 | 145 | two_way_stop | 8.36 | 7.61 | 7.6 | 104 |
| 4398 | Ashby Avenue | Primary | 2 | 96 | uncontrolled | 8.22 | 6.18 | 6.2 | 709 |
| 1049 | Adeline Street | Secondary | 4 | 43 | signal | 7.27 | 6.12 | 6.1 | 1135 |
| 1666 | 52nd Street | Secondary | 4 | 39 | signal | 6.98 | 6.11 | 6.1 | 841 |
| 3457 | The Uplands | Tertiary | 1 | 151 | two_way_stop | 6.46 | 3.88 | 3.9 | 359 |
| 834 | Martin Luther King Junior Way | Secondary | 4 | 49 | signal | 6.32 | 4.63 | 4.6 | 1297 |
| 2037 | Alcatraz Avenue | Tertiary | 1 | 202 | uncontrolled | 6.11 | 4.55 | 4.6 | 412 |
| 764 | Martin Luther King Junior Way | Secondary | 4 | 48 | signal | 5.81 | 4.68 | 4.7 | 1291 |
| 1051 | Adeline Street | Secondary | 4 | 50 | signal | 5.75 | 5.03 | 5.0 | 836 |
| 1108 | Market Street | Secondary | 4 | 36 | signal | 5.64 | 4.26 | 4.3 | 1349 |
| 460 | Sacramento Street | Tertiary | 2 | 104 | two_way_stop | 5.59 | 4.70 | 4.7 | 467 |
| 1662 | 52nd Street | Secondary | 4 | 53 | signal | 5.54 | 4.03 | 4.0 | 1116 |

## Top 15 nodes by blocked time

Blocked time = lane-head seconds waiting at the stop line without permission (signal red, conflict, stop sign or no downstream space).

| Node | Streets | Control | Gate | Blocked (lane-h) | of which no downstream space | Signal plan at end (cycle: greens) |
| --- | --- | --- | --- | --- | --- | --- |
| 447 | Adeline Street / Alcatraz Avenue | signal |  | 5.24 | 0.07 | 75 s: 30/35 |
| 680 | 52nd Street / Shattuck Avenue | signal |  | 5.00 | 0.07 | 90 s: 18/19/37 |
| 446 | Market Street / Stanford Avenue | signal |  | 4.71 | 0.22 | 75 s: 29/36 |
| 1406 | Ashby Avenue / Claremont Avenue | signal |  | 4.24 | 0.24 | 75 s: 17/22/22 |
| 30 | 57th Street / Adeline Street / Market Street | signal |  | 3.62 | 0.03 | 75 s: 21/24/15 |
| 332 | 55th Street / Martin Luther King Junior Way | signal |  | 3.43 | 0.04 | 75 s: 35/30 |
| 331 | 52nd Street / Martin Luther King Junior Way | signal |  | 3.27 | 0.03 | 75 s: 44/21 |
| 501 | Alcatraz Avenue / Shattuck Avenue | signal |  | 2.99 | 0.07 | 80 s: 31/39 |
| 242 | Ashby Avenue / Martin Luther King Junior Way | signal |  | 2.99 | 0.00 | 75 s: 46/19 |
| 185 | Alcatraz Avenue / Sacramento Street | signal |  | 2.95 | 0.03 | 75 s: 30/35 |
| 479 | Adeline Street / Martin Luther King Junior Way / Stanford Avenue | signal |  | 2.83 | 0.02 | 75 s: 50/15 |
| 944 | Ashby Avenue / Shattuck Avenue | signal |  | 2.82 | 0.03 | 75 s: 48/17 |
| 851 | Alcatraz Avenue / Telegraph Avenue | signal |  | 2.81 | 0.04 | 75 s: 46/19 |
| 1080 | 62nd Street / Claremont Avenue / College Avenue | signal |  | 2.74 | 0.01 | 75 s: 18/27/15 |
| 37 | San Pablo Avenue / Stanford Avenue | signal |  | 2.58 | 0.01 | 75 s: 20/45 |

Phases of the five most blocked signals (green s: approach links with their lanes, link ids in brackets):

- node 447: 30 s: Adeline Street 4L [1049], Adeline Street 4L [1051]; 35 s: Alcatraz Avenue 2L [1048], Alcatraz Avenue 2L [1133]
- node 680: 18 s: 52nd Street 4L [1662]; 19 s: 52nd Street 4L [1666], 52nd Street 4L [1662]; 37 s: Shattuck Avenue 2L [1653], Shattuck Avenue 2L [1705]
- node 446: 29 s: Stanford Avenue 3L [941], Stanford Avenue 3L [1055]; 36 s: Market Street 4L [1108], Market Street 3L [1111]
- node 1406: 17 s: Ashby Avenue 1L [3395], Ashby Avenue 2L [3426]; 22 s: Claremont Avenue 2L [4329]; 22 s: Claremont Avenue 3L [3447]
- node 30: 21 s: Adeline Street 1L [747], Adeline Street 1L [1030]; 24 s: Market Street 2L [755], Market Street 2L [1113]; 15 s: 57th Street 1L [44], 57th Street 1L [1151]

## Cars cleared from gridlock near and far (judged zone)

Judged zone: the study area, its bounding streets and the junctions on them, plus nodes within 200 m of it along the network (111 nodes, 329 links). A far clearing counts against the stability rule when its blocking chain (vehicles held at least 60 s by a full exit, at the 5 s snapshot before it) reaches a link in the zone.

| Buffer (m) | Near | Far | Far, chain reaches the zone | Judged |
| --- | --- | --- | --- | --- |
| 100.0 | 0 | 0 | 0 | 0 |
| 200.0 | 0 | 0 | 0 | 0 |
| 400.0 | 0 | 0 | 0 | 0 |

Entry backlog at the end of the run: 2 trips waiting at origins in the zone, of 50 in all.

| Bounding street | Links | Longest standing queue on one link (m) | Link (length m) | At (min) | Share of samples with a link full |
| --- | --- | --- | --- | --- | --- |
| Telegraph Avenue | 28 | 72.0 | 1979 (81.0) | 51.4 | 0.003 |
| Alcatraz Avenue | 14 | 72.0 | 4238 (84.0) | 24.9 | 0.027 |
| College Avenue | 6 | 65.0 | 2805 (102.0) | 34.2 | 0.0 |
| Claremont Avenue | 13 | 52.0 | 2776 (161.0) | 55.9 | 0.0 |
| CA 24 | 3 | 33.0 | 1945 (188.0) | 26.4 | 0.0 |

## Junction recovery

Policy `physical`. Node entries by cars and cyclists in the run: 730101 (settle interval 0). An admission is an entry the ordinary rule would have refused; head-seconds count the time a waiting head vehicle had the reason invoked, and the part of it in which it still could not enter. Courtesy and the yield fallback change priority only; under `physical` the conflict bypass never admits.

| Reason | Admissions per hour | Per 1,000 entries | Head-s invoked | Head-s blocked |
| --- | --- | --- | --- | --- |
| courtesy | 150.0 | 0.205 | 606 | 560 |
| yield fallback | 66.0 | 0.090 | 18 | 0 |
| conflict bypass | 0.0 | 0.000 | 20 | 20 |

Vehicles removed while held in a node by a full exit: 0 (0.0 per hour, included in the gridlock removals).

| Node | Streets | Control | Courtesy | Yield fallback | Conflict bypass | Held removals |
| --- | --- | --- | --- | --- | --- | --- |
| 1429 | Claremont Avenue / Claremont Boulevard | two_way_stop | 22 | 1 | 0 | 0 |
| 395 | 65th Street / Shattuck Avenue | two_way_stop | 11 | 2 | 0 | 0 |
| 1405 | Claremont Boulevard / Russell Street | two_way_stop | 13 | 0 | 0 | 0 |
| 1425 | Ashby Avenue | uncontrolled | 9 | 1 | 0 | 0 |
| 796 | 63rd Street / Telegraph Avenue | two_way_stop | 7 | 2 | 0 | 0 |
| 1152 | Ashby Avenue / Ashby Place / Elmwood Avenue | two_way_stop | 6 | 3 | 0 | 0 |
| 1399 | Bridge Road / Tunnel Road | two_way_stop | 4 | 5 | 0 | 0 |
| 528 | Shattuck Avenue / Woolsey Street | two_way_stop | 5 | 2 | 0 | 0 |
| 492 | Aileen Street / Shattuck Avenue | two_way_stop | 2 | 4 | 0 | 0 |
| 766 | 57th Street / Shattuck Avenue | two_way_stop | 2 | 4 | 0 | 0 |

## Entry backlog by origin node at end of run (top 10)

| Node | Streets | Trips waiting | Offered veh/h (before scale) |
| --- | --- | --- | --- |
| 1756 | Claremont Avenue | 37 | 487 |
| 1372 | Domingo Avenue / Russell Street | 3 | 47 |
| 500 | Alcatraz Avenue / Dover Street | 2 | 33 |
| 602 | Grove Shafter Freeway | 2 | 3656 |
| 695 | 51st Street / Shafter Avenue | 1 | 25 |
| 859 | 65th Street / Telegraph Avenue | 1 | 117 |
| 943 | Telegraph Avenue / Ward Street | 1 | 970 |
| 1120 | Forest Street / Miles Avenue | 1 | 96 |
| 1373 | Ashby Avenue / Domingo Avenue / Tunnel Road | 1 | 11 |
| 1385 | Oak Ridge Road / Tunnel Road | 1 | 17 |

## Flow on key streets (veh/h per direction, study-area links of 40 m or more)

| Street | Direction of travel | Links | Median flow | Max flow |
| --- | --- | --- | --- | --- |
| Telegraph | N | 12 | 996 | 1039 |
| Telegraph | S | 10 | 858 | 997 |
| College | N | 3 | 302 | 306 |
| College | S | 3 | 480 | 482 |
| Claremont | N | 6 | 466 | 727 |
| Claremont | S | 7 | 478 | 787 |
| Alcatraz | E | 6 | 362 | 419 |
| Alcatraz | W | 6 | 300 | 323 |
| Hillegass | N | 4 | 80 | 92 |
| Hillegass | S | 4 | 73 | 78 |
| Colby | N | 7 | 90 | 102 |
| Colby | S | 7 | 143 | 167 |
| Martin | E | 2 | 92 | 92 |
| Martin | W | 2 | 104 | 104 |

## Largest demand origins (offered, before scale)

| Node | Streets | Veh/h |
| --- | --- | --- |
| 602 | Grove Shafter Freeway | 3656 |
| 265 | Ashby Avenue | 1242 |
| 943 | Telegraph Avenue / Ward Street | 970 |
| 183 | San Pablo Avenue | 824 |
| 1672 | Warren Freeway | 821 |
| 763 | Telegraph Avenue | 624 |
| 971 | Pleasant Valley Avenue | 553 |
| 1756 | Claremont Avenue | 487 |
| 275 | Market Street | 460 |
| 974 | Broadway | 405 |
