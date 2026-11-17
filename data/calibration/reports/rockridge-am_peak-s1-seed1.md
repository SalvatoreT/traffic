# Calibration report: rockridge am_peak scale 1 seed 1 (60 min)

Offered demand 23590 veh/h x scale 1 = 23590 veh/h. Run took 31.6 s wall clock. Flow tables use the window after a 10 min warm-up; select-link and health figures cover the whole run from an empty network.

## Stability (design D4)

| Criterion | Threshold | Value | Result |
| --- | --- | --- | --- |
| Gridlock removals | 0 | 0 | pass |
| Backlog / spawned | < 2% | 0.2% (53 of 23693) | pass |
| Arterial mean speed (run) | > 4 m/s | 8.87 m/s (last 15 min 8.67) | pass |

Overall: **STABLE**. Mean trip delay 131 s, mean trip time 380 s, completed 23706, unroutable 0.

| t (min) | vehicles in network | backlog | completed | removals | arterial speed in interval (m/s) |
| --- | --- | --- | --- | --- | --- |
| 5 | 2709 | 17 | 2025 | 0 | 8.98 |
| 10 | 2560 | 6 | 4055 | 0 | 8.71 |
| 15 | 2605 | 7 | 5998 | 0 | 8.68 |
| 20 | 2417 | 6 | 8097 | 0 | 9.22 |
| 25 | 2396 | 28 | 10090 | 0 | 9.29 |
| 30 | 2447 | 35 | 12041 | 0 | 9.06 |
| 35 | 2567 | 22 | 13932 | 0 | 8.88 |
| 40 | 2637 | 18 | 15866 | 0 | 8.62 |
| 45 | 2550 | 29 | 17953 | 0 | 9.01 |
| 50 | 2638 | 27 | 19828 | 0 | 8.76 |
| 55 | 2608 | 38 | 21787 | 0 | 8.83 |
| 60 | 2709 | 53 | 23706 | 0 | 8.43 |
## Wandering (completed car trips)

Detour ratio = distance driven (link and movement lengths) over the shortest network distance from the trip's origin to its destination. Detour against the free-flow route uses the time-shortest route with no congestion and no noise, which is what a purposeful driver without live information would follow (it differs from the shortest distance when a faster, longer road exists). A switch is a change of the remaining route while en route. Loops: the same link twice or the same node three or more times. Reversals: a link followed by its reverse within 200 m. 'Study-area vehicle-miles' are miles driven on links inside the study area; the last column is the share of them driven by trips with a detour ratio above 1.3. Guided drivers re-evaluate their route every epoch; the others keep their departure route unless it is blocked.

| Trips | n | Switches per trip | With a switch | Mean detour | Median detour | Detour > 1.3 | Detour > 2 | Mean detour vs free-flow route | Vs free-flow route > 1.3 | Loops | Reversals | Study veh-miles | Of them by detour > 1.3 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| all trips | 21765 | 0.01 | 1.4% | 1.081 | 1.048 | 3.4% | 0.0% | 1.023 | 1.5% | 0.0% | 0.2% | 2154 | 6.8% |
| gate to gate | 6478 | 0.02 | 2.3% | 1.087 | 1.059 | 3.4% | 0.0% | 1.025 | 1.9% | 0.0% | 0.2% | 628 | 5.3% |
| with a local end | 15287 | 0.01 | 1.0% | 1.078 | 1.046 | 3.4% | 0.0% | 1.022 | 1.3% | 0.0% | 0.2% | 1526 | 7.4% |
| guided drivers | 10088 | 0.03 | 2.9% | 1.081 | 1.049 | 3.5% | 0.0% | 1.023 | 1.5% | 0.0% | 0.2% | 996 | 6.5% |
| other drivers | 11677 | 0.00 | 0.1% | 1.080 | 1.047 | 3.3% | 0.0% | 1.023 | 1.4% | 0.0% | 0.2% | 1158 | 7.0% |

## Reported patterns (diagnostics; configured in the targets file under `patterns`)

(a) Trips between the surface gates on the north side of the ramps and the freeway mainline gates, and the local-street (residential and service links in the study area) vehicle-miles they drive. Share = of all completed trips' local-street vehicle-miles (326 miles). No observed counterpart exists for this quantity (the targets file has only the select-link shares above).

| Trips | n trips | Local-street veh-miles | Share of all local-street veh-miles |
| --- | --- | --- | --- |
| surface gates to the freeway | 892 | 19.4 | 6% |
| freeway to the surface gates | 982 | 22.3 | 7% |

(b) Corridor trips: completed trips from beyond one end of the corridor's study-area extent (the bypass street and its arterial together) to beyond the other end, within a lateral limit of the corridor, by direction. 'Bypass' = at least N blocks (links) on the bypass street; 'arterial' = fewer bypass blocks and at least N on the arterial; 'other' = neither (another street, the freeway or a short use); blocks are counted on the corridor's study-area links. No observed counterpart exists for these shares. The related observed values are in the select-link table above: northbound Hillegass Ave traffic rarely ends on College Ave (6%), 21 to 33% jogs to Benvenue Ave, and southbound freeway-bound drivers on College Ave commonly arrive via Ashby Ave and Benvenue Ave and jog to Hillegass Ave.

| Bypass | Arterial | N | Direction | Corridor trips | Bypass | Arterial | Other | Mean bypass blocks |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue | College Avenue | 3 | N | 1179 | 3% | 14% | 83% | 0.1 |
| Hillegass Avenue | College Avenue | 3 | S | 1210 | 2% | 19% | 78% | 0.1 |

## Per-mode results

Offered: 23590 car veh/h; 497 bicycle flows (702/h); 2000 pedestrian flows (2228/h). Bicycle and pedestrian volumes are assumptions, not counts.

| Mode | In network | Completed | Mean time (s) | Other |
| --- | --- | --- | --- | --- |
| Car | 2709 | 23706 | 380 | |
| Bicycle | 44 | 737 | 246 | |
| Pedestrian | 287 | 2163 | 464 | mean crossing delay 7.5 s |

Vulnerable road users (surrogate indicators): pedestrian conflicts 394, bicycle conflicts 945, close passes 649, pedestrian injury severity mean 0.047 (AIS4+, 12872 supported of 12872 encounters), cyclist injury severity mean 0.062 (MAIS3+F, 3239 supported of 6199 encounters) (separate endpoints, never summed), mean vehicle speed at pedestrian encounters 2.46 m/s.


## Volunteer whole-street counts

Each car counts once when it passes the last stop line after driving the full directed corridor in order. The measurement window is 50.0 minutes. The last two columns describe trips that visited any corridor link during the full run.

| Corridor | Counted whole street (veh/h) | Modeled whole street (veh/h) | Used in fit | Through trips on any link (veh/h) | Freeway trips on any link (veh/h) |
| --- | --- | --- | --- | --- | --- |
| Hillegass Avenue NB | 34 | 48 | yes | 73 | 71 |
| Colby Street NB | 33 | 55 | yes | 96 | 81 |
| Hillegass Avenue SB | 36 | 29 | yes | 59 | 65 |
| Colby Street SB | 46 | 20 | yes | 65 | 88 |

## Intent map: through cars by where they come from and where they are going

Through = neither trip end is in the study area. Groups are the approach groups of the area config (data/areas); a node that is not a gate takes the group of the nearest surface gate (ASSUMPTION). The arterial is the one a trip would use on the shortest free-flow path with the study area's residential and service streets closed, where that path runs on a boundary street near the study area.

Model figures are the mean of 1 seed(s), per hour of the run. Basis: OBSERVED = read from the resident volunteer count of Feb 25, 2025 or its headline shares; ASSUMPTION = inferred from those numbers or chosen.

### Colby Street NB

Observed (PM): 182 cars entered at the south end, 102 drove the whole street, 164 left it at Alcatraz Ave (131 left, 32 right, 1 straight), and 47% of the block's trips came from a freeway (the headline share). ASSUMPTION: freeway-origin cars that do not end along the street are 65 veh/h (the 82 freeway-origin trips on the block, 47% of 174, times the 182 / (182 + 47) of its cars that entered at the south end rather than joining on the way), spread over the 164 exits in proportion (0.40); the other through cars come from the Telegraph Ave and south-side approaches that feed the street's south end. Ranges: low = 131 (32) x 0.47 x 0.62 (the whole-street share of exits), high = 131 (32) x 0.47.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | OBSERVED turn count x ASSUMPTION share (131 left turns x 0.40) | 52 (38 to 62) | 40 | within |
| Telegraph Ave and south-side traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | ASSUMPTION: the through left-turners (131 x 0.62 = 81) that are not off-ramp traffic | 29 (19 to 43) | 30 | within |
| SR-24 off-ramp traffic using Colby St to reach College Ave and Berkeley (right at Alcatraz Ave) | OBSERVED turn count x ASSUMPTION share (32 right turns x 0.40) | 13 (9 to 15) | 4 | below |
| Telegraph Ave and south-side traffic using Colby St to reach College Ave and Berkeley | ASSUMPTION: the through right-turners (32 x 0.62 = 20) that are not off-ramp traffic | 7 (5 to 11) | 21 | above |
| Intents listed, together | | 101 (71 to 131) | 95 | |
| Other through cars (no intent listed) | | | 1 | |

Model through cars by origin and destination group (largest 12 of 13 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 40.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 20.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 14.0 | Claremont Avenue then College Avenue |
| Telegraph Ave to the south (downtown Oakland) | Telegraph Ave from the north (Berkeley) | 6.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Ashby Ave from the west (Emeryville and I-80) | 4.0 | none near the study area |
| West Oakland to the southwest (Adeline St, Market St) | Telegraph Ave from the north (Berkeley) | 3.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Emeryville and West Oakland streets (55th to 67th Streets) | 2.0 | none near the study area |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 2.0 | SR-24 |
| Oakland hills to the east (Broadway Terrace, Mountain Blvd, Moraga Ave) | Emeryville and West Oakland streets (55th to 67th Streets) | 1.0 | SR-24 then Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Alcatraz Ave from the west (Emeryville side) | 1.0 | College Avenue then Alcatraz Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Claremont Ave and Tunnel Rd toward the hills | 1.0 | SR-24 |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 1.0 | Telegraph Avenue |
| other pairs | | 1.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 70 veh/h; Claremont Avenue then College Avenue 14 veh/h; none near the study area 6 veh/h; SR-24 3 veh/h; College Avenue then Alcatraz Avenue 1 veh/h; SR-24 then Claremont Avenue then College Avenue 1 veh/h.

### Hillegass Avenue NB

Observed (PM): 94 cars entered at the south end, 48 drove the whole street, 109 left it at Alcatraz Ave (43 west, 54 east, 12 straight), and 47% of the block's trips came from a freeway. ASSUMPTION: freeway-origin through cars are 40 veh/h (52 freeway-origin trips times 94 / (94 + 29)), spread over the exits in proportion (0.37); the through share of exits is 48 / 109 = 0.44.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Hillegass Ave to reach Alcatraz Ave west and Telegraph Ave north | OBSERVED turn count x ASSUMPTION share (43 left turns x 0.37) | 16 (9 to 20) | 17 | within |
| SR-24 off-ramp traffic using Hillegass Ave to reach College Ave and Berkeley | OBSERVED turn count x ASSUMPTION share (54 right turns x 0.37) | 20 (11 to 25) | 32 | above |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach Alcatraz Ave west | ASSUMPTION: through exits (43 x 0.44) that are not off-ramp traffic | 3 (0 to 10) | 3 | within |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach College Ave and Berkeley | ASSUMPTION: through exits (54 x 0.44) that are not off-ramp traffic | 4 (0 to 13) | 19 | above |
| Intents listed, together | | 43 (20 to 68) | 71 | |
| Other through cars (no intent listed) | | | 2 | |

Model through cars by origin and destination group (largest 12 of 14 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 17.0 | SR-24 |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 13.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 12.0 | Telegraph Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 6.0 | Claremont Avenue then Alcatraz Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | College Ave from the north (Berkeley) | 5.0 | SR-24 then Claremont Avenue then College Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 4.0 | SR-24 then Claremont Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Telegraph Ave from the north (Berkeley) | 3.0 | none near the study area |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 2.0 | Claremont Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Claremont Ave and Tunnel Rd toward the hills | 2.0 | Alcatraz Avenue then Claremont Avenue |
| SR-13 Warren Freeway (via SR-24 east) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 2.0 | Claremont Avenue then Alcatraz Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Shattuck Ave from the north (Berkeley) | 2.0 | SR-24 then Telegraph Avenue then Alcatraz Avenue |
| Telegraph Ave to the south (downtown Oakland) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 2.0 | Telegraph Avenue |
| other pairs | | 3.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 30 veh/h; SR-24 17 veh/h; Claremont Avenue then Alcatraz Avenue 8 veh/h; SR-24 then Claremont Avenue then College Avenue 5 veh/h; SR-24 then Claremont Avenue 4 veh/h; none near the study area 3 veh/h.

### Hillegass Avenue SB

Observed (PM): 178 cars entered at the top (76 turned in from Alcatraz Ave west, 98 from the east, 4 came straight from the north), 79 drove the whole street, and 68% of the block's trips (109 veh/h) went to a freeway. ASSUMPTION: freeway-bound cars that did not join mid-street are 87 veh/h (109 x 178 / (178 + 44)), half of the 174 turn-ins; low = the whole-street share of the turn-ins (0.45), high = the freeway-bound share without the mid-street correction (0.63).

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Telegraph Ave, Alcatraz Ave west and West Berkeley traffic turning off Alcatraz Ave onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (76 turn-ins x 0.50) | 38 (34 to 48) | 14 | below |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (98 turn-ins x 0.50) | 49 (44 to 62) | 19 | below |
| Intents listed, together | | 87 (78 to 110) | 33 | |
| Other through cars (no intent listed) | | | 26 | |

Model through cars by origin and destination group (largest 12 of 14 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 17.0 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 14.0 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 9.0 | Claremont Avenue then SR-24 |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 5.0 | College Avenue then Claremont Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 4.0 | Claremont Avenue then SR-24 |
| West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 2.0 | College Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Claremont Ave and Tunnel Rd toward the hills | 1.0 | Alcatraz Avenue then Claremont Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-13 Warren Freeway (via SR-24 east) | 1.0 | Alcatraz Avenue then College Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Telegraph Ave to the south (downtown Oakland) | 1.0 | Telegraph Avenue |
| West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) | College Ave from the north (Berkeley) | 1.0 | Alcatraz Avenue then College Avenue |
| Claremont Ave and Tunnel Rd toward the hills | San Pablo Ave (Emeryville and West Oakland) | 1.0 | Claremont Avenue then Alcatraz Avenue |
| Claremont Ave and Tunnel Rd toward the hills | Emeryville and West Oakland streets (55th to 67th Streets) | 1.0 | Claremont Avenue then Alcatraz Avenue |
| other pairs | | 2.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 33 veh/h; Claremont Avenue then SR-24 13 veh/h; College Avenue then Claremont Avenue then SR-24 5 veh/h; Alcatraz Avenue then Claremont Avenue 2 veh/h; Alcatraz Avenue then College Avenue 2 veh/h; Claremont Avenue then Alcatraz Avenue 2 veh/h.

### Colby Street SB

Observed (PM): 139 cars entered at the top (76 from Alcatraz Ave west, 50 from the east, 13 from the north), 39 drove the whole street, 45% of the block's trips (72 veh/h) went to a freeway and 22% came by way of Telegraph Ave. ASSUMPTION: freeway-bound cars that did not join mid-street are 46 veh/h (72 x 139 / (139 + 79)), 0.365 of the 126 turn-ins; low = the whole-street share (0.31), high = the unadjusted freeway share (0.57). The Telegraph Ave cars are the 22% x 160 = 35 of the 76 west turn-ins.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Southbound Telegraph Ave traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (35 Telegraph Ave cars x 0.365) | 13 (11 to 20) | 11 | within |
| Alcatraz Ave west, Ashby Ave and West Berkeley traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (41 other west turn-ins x 0.365) | 15 (13 to 23) | 22 | within |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (50 east turn-ins x 0.365) | 18 (15 to 29) | 7 | below |
| Intents listed, together | | 46 (39 to 72) | 40 | |
| Other through cars (no intent listed) | | | 25 | |

Model through cars by origin and destination group (largest 12 of 22 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Shattuck Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 9.0 | none near the study area |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 9.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 8.0 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 6.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 5.0 | Alcatraz Avenue then College Avenue then Claremont Avenue then SR-24 |
| Alcatraz Ave from the west (Emeryville side) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 4.0 | SR-24 |
| Ashby Ave from the west (Emeryville and I-80) | SR-13 Warren Freeway (via SR-24 east) | 4.0 | SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | West Oakland to the southwest (Adeline St, Market St) | 3.0 | Claremont Avenue |
| Alcatraz Ave from the west (Emeryville side) | SR-13 Warren Freeway (via SR-24 east) | 2.0 | SR-24 |
| Ashby Ave from the west (Emeryville and I-80) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 2.0 | SR-24 |
| Telegraph Ave from the north (Berkeley) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 2.0 | none near the study area |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Claremont Ave and Tunnel Rd toward the hills | 1.0 | Alcatraz Avenue then Claremont Avenue |
| other pairs | | 10.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 25 veh/h; none near the study area 14 veh/h; SR-24 12 veh/h; Alcatraz Avenue then College Avenue then Claremont Avenue then SR-24 5 veh/h; Claremont Avenue 3 veh/h; Alcatraz Avenue then Claremont Avenue 2 veh/h.

### Study area, all residential and service streets

Model: 433 through cars per hour.

Model through cars by origin and destination group (largest 12 of 55 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 59.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 47.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 32.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 31.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 31.0 | Claremont Avenue then College Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 25.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | San Pablo Ave (Emeryville and West Oakland) | 19.0 | Claremont Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 17.0 | SR-24 |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 12.0 | Telegraph Avenue |
| Shattuck Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 10.0 | none near the study area |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Emeryville and West Oakland streets (55th to 67th Streets) | 9.0 | SR-24 |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 9.0 | Claremont Avenue then SR-24 |
| other pairs | | 132.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 239 veh/h; SR-24 47 veh/h; Claremont Avenue 32 veh/h; Claremont Avenue then College Avenue 31 veh/h; none near the study area 28 veh/h; Alcatraz Avenue then Claremont Avenue 14 veh/h.

By origin group: South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 122; Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 85; SR-24 eastbound off-ramps (arriving from Oakland and I-980) 84; Telegraph Ave from the north (Berkeley) 36; Telegraph Ave to the south (downtown Oakland) 18; Claremont Ave and Tunnel Rd toward the hills 13; West Oakland to the southwest (Adeline St, Market St) 13; SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) 11; Shattuck Ave from the north (Berkeley) 10; Alcatraz Ave from the west (Emeryville side) 7.

By destination group: Telegraph Ave from the north (Berkeley) 91; SR-24 westbound on-ramps (toward Oakland and I-980) 88; Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 82; South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 44; Claremont Ave and Tunnel Rd toward the hills 38; San Pablo Ave (Emeryville and West Oakland) 22; Emeryville and West Oakland streets (55th to 67th Streets) 17; College Ave from the north (Berkeley) 11; SR-24 eastbound on-ramps (toward the Caldecott Tunnel) 8; SR-13 Warren Freeway (via SR-24 east) 7.


## Through cars by intent (cut-through intent view)

A through car is tallied once, under the first intent that fits it (the on-ramp on its planned route, the off-ramp it has driven, or the origin and destination groups of its trip), at the moment the through count counts it. Cars an hour over the run, the same window as the through-car figure (436 an hour).

| Intent | Basis | Cars an hour | Share |
| --- | --- | --- | --- |
| on-2853241697 | observed | 89 | 20% |
| Other on-ramps | assumed | 16 | 4% |
| off-52990846 | observed | 84 | 19% |
| Other off-ramps | assumed | 13 | 3% |
| Downtown, south and west Oakland traffic using side streets to reach Berkeley and Telegraph Ave north | assumed | 107 | 25% |
| Berkeley and Telegraph Ave north traffic using side streets to reach downtown, south and west Oakland | assumed | 51 | 12% |
| Oakland cross-town traffic (West Oakland, Broadway, Piedmont, Emeryville) using side streets near Claremont Ave and Telegraph Ave | assumed | 42 | 10% |
| Other (no intent listed) |  | 34 | 8% |

Intents listed cover 92% of through cars.


## Select-link shares: modeled vs observed (design D5: headline = freeway shares, tolerance +/-10 pp)

- Hillegass Avenue NB: 4 links (path Claremont Avenue -> Alcatraz Avenue (434 m)), 147 trips (134 completed)
- Colby Street NB: 8 links (path Claremont Avenue -> Alcatraz Avenue (680 m)), 183 trips (164 completed)
- Hillegass Avenue SB: 4 links (path Alcatraz Avenue -> Claremont Avenue (433 m)), 125 trips (114 completed)
- Colby Street SB: 8 links (path Alcatraz Avenue -> Claremont Avenue (680 m)), 205 trips (194 completed)

| Block | Side | Via | Observed | Modeled | Diff (pp) | n trips | Headline |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue NB | from | freeway | 47% | 48% | +1 | 147 | within |
| Hillegass Avenue NB | to | Benvenue Avenue | 21% (PM 33%) | 7% | -14 | 147 |  |
| Hillegass Avenue NB | to | College Avenue | 6% | 20% | +14 | 147 |  |
| Hillegass Avenue NB | to | Alcatraz Avenue WB | 27% | 28% | +1 | 147 |  |
| Colby Street NB | from | freeway | 47% | 44% | -3 | 183 | within |
| Colby Street NB | to | Alcatraz Avenue WB | 48% | 52% | +4 | 183 |  |
| Colby Street NB | to | Telegraph Avenue | 25% | 42% | +17 | 183 |  |
| Colby Street NB | to | College Avenue | 3% | 1% | -2 | 183 |  |
| Hillegass Avenue SB | from | Alcatraz Avenue WB | 46% | 28% | -18 | 125 |  |
| Hillegass Avenue SB | from | Benvenue Avenue | 26% | 4% | -22 | 125 |  |
| Hillegass Avenue SB | from | College Avenue | 16% | 14% | -2 | 125 |  |
| Hillegass Avenue SB | to | freeway | 57% (PM 68%) | 52% | -5 | 125 | within |
| Colby Street SB | from | Alcatraz Avenue EB | 43% | 24% | -19 | 205 |  |
| Colby Street SB | from | Alcatraz Avenue WB | 46% | 9% | -37 | 205 |  |
| Colby Street SB | from | Telegraph Avenue | 22% | 19% | -3 | 205 |  |
| Colby Street SB | to | freeway | 45% | 42% | -3 | 205 | within |
| Colby Street SB | to | Forest Street | 34% | 27% | -7 | 205 |  |

Headline shares within tolerance: 4 of 4. Observed column uses the PM-peak share where one is given and the period is pm_peak. 'Via' shares are the fraction of select-link trips using that street before (from) or after (to) the block; freeway = origin / destination gate with a motorway-class link attached.

## Claremont ramps: streets used before the on-ramp / after the off-ramp

Observed shares are for traffic from/to the north only. 'Modeled' is over all trips on the ramps and any visit to the street (an upper bound for streets that serve both sides). 'Modeled, side' counts only trips whose surface end lies on the side of the ramp stated in the targets file (`freewayRamp.side`), and for a street with a qualifier ("north of X") only its links on that side of X.

| Direction | Via | Observed | Modeled | n ramp trips | Modeled, side | n side trips |
| --- | --- | --- | --- | --- | --- | --- |
| onto freeway | College Avenue | 16% | 17% | 617 | 20% | 523 |
| onto freeway | Hillegass Avenue | 12% | 12% | 617 | 14% | 523 |
| onto freeway | Martin Street | 10% | 12% | 617 | 13% | 523 |
| onto freeway | Colby Street | 8% | 12% | 617 | 14% | 523 |
| onto freeway | Telegraph Avenue north of Alcatraz Avenue | 8% | 10% | 617 | 8% | 523 |
| onto freeway | Benvenue Avenue | 5% | 6% | 617 | 7% | 523 |
| from freeway | College Avenue | 10% | 11% | 636 | 12% | 619 |
| from freeway | Martin Street | 10% | 10% | 636 | 10% | 619 |
| from freeway | Colby Street | 8% | 11% | 636 | 11% | 619 |
| from freeway | Hillegass Avenue | 5% | 8% | 636 | 8% | 619 |
| from freeway | Benvenue Avenue | 3% | 3% | 636 | 3% | 619 |

## Top 15 links by delay

| Link | Street | Class | Lanes | Len (m) | End node control | Delay (veh-h) | Stopped (veh-h) | Mean stopped veh | Flow (veh/h) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 4175 | (unnamed) | Motorway | 2 | 142 | uncontrolled | 8.64 | 1.64 | 1.6 | 1538 |
| 3434 | Claremont Avenue | Secondary | 1 | 93 | all_way_stop | 8.24 | 5.16 | 5.2 | 450 |
| 3395 | Ashby Avenue | Primary | 1 | 129 | signal | 8.19 | 6.35 | 6.3 | 515 |
| 1049 | Adeline Street | Secondary | 4 | 43 | signal | 7.30 | 6.05 | 6.1 | 1224 |
| 1051 | Adeline Street | Secondary | 4 | 50 | signal | 7.20 | 6.17 | 6.2 | 1054 |
| 4329 | Claremont Avenue | Secondary | 2 | 113 | signal | 6.50 | 5.26 | 5.3 | 366 |
| 460 | Sacramento Street | Tertiary | 2 | 104 | two_way_stop | 6.31 | 5.25 | 5.2 | 467 |
| 4398 | Ashby Avenue | Primary | 2 | 96 | uncontrolled | 6.25 | 4.54 | 4.5 | 750 |
| 1108 | Market Street | Secondary | 4 | 36 | signal | 5.97 | 4.77 | 4.8 | 1156 |
| 2303 | Telegraph Avenue | Secondary | 2 | 104 | signal | 5.57 | 4.30 | 4.3 | 934 |
| 1666 | 52nd Street | Secondary | 4 | 39 | signal | 5.55 | 4.80 | 4.8 | 676 |
| 3387 | Bridge Road | Residential | 1 | 145 | two_way_stop | 5.49 | 4.31 | 4.3 | 178 |
| 3001 | College Avenue | Tertiary | 1 | 107 | signal | 5.34 | 3.99 | 4.0 | 577 |
| 1662 | 52nd Street | Secondary | 4 | 53 | signal | 5.12 | 3.57 | 3.6 | 1165 |
| 3363 | Tunnel Road | Primary | 1 | 152 | two_way_stop | 5.05 | 2.86 | 2.9 | 816 |

## Top 15 nodes by blocked time

Blocked time = lane-head seconds waiting at the stop line without permission (signal red, conflict, stop sign or no downstream space).

| Node | Streets | Control | Gate | Blocked (lane-h) | of which no downstream space | Signal plan at end (cycle: greens) |
| --- | --- | --- | --- | --- | --- | --- |
| 447 | Adeline Street / Alcatraz Avenue | signal |  | 5.31 | 0.12 | 75 s: 26/39 |
| 446 | Market Street / Stanford Avenue | signal |  | 4.85 | 0.21 | 75 s: 30/35 |
| 680 | 52nd Street / Shattuck Avenue | signal |  | 4.50 | 0.07 | 90 s: 18/19/37 |
| 1406 | Ashby Avenue / Claremont Avenue | signal |  | 4.22 | 0.29 | 75 s: 30/15/15 |
| 30 | 57th Street / Adeline Street / Market Street | signal |  | 3.15 | 0.03 | 75 s: 30/15/15 |
| 332 | 55th Street / Martin Luther King Junior Way | signal |  | 3.06 | 0.03 | 75 s: 37/28 |
| 37 | San Pablo Avenue / Stanford Avenue | signal |  | 3.00 | 0.01 | 75 s: 22/43 |
| 479 | Adeline Street / Martin Luther King Junior Way / Stanford Avenue | signal |  | 2.99 | 0.03 | 75 s: 48/17 |
| 185 | Alcatraz Avenue / Sacramento Street | signal |  | 2.92 | 0.07 | 75 s: 34/31 |
| 242 | Ashby Avenue / Martin Luther King Junior Way | signal |  | 2.89 | 0.01 | 75 s: 40/25 |
| 944 | Ashby Avenue / Shattuck Avenue | signal |  | 2.76 | 0.02 | 75 s: 43/22 |
| 1080 | 62nd Street / Claremont Avenue / College Avenue | signal |  | 2.73 | 0.02 | 75 s: 21/24/15 |
| 1220 | Ashby Avenue / College Avenue | signal |  | 2.67 | 0.08 | 120 s: 39/71 |
| 851 | Alcatraz Avenue / Telegraph Avenue | signal |  | 2.65 | 0.06 | 75 s: 42/23 |
| 501 | Alcatraz Avenue / Shattuck Avenue | signal |  | 2.64 | 0.06 | 75 s: 39/26 |

Phases of the five most blocked signals (green s: approach links with their lanes, link ids in brackets):

- node 447: 26 s: Adeline Street 4L [1049], Adeline Street 4L [1051]; 39 s: Alcatraz Avenue 2L [1048], Alcatraz Avenue 2L [1133]
- node 446: 30 s: Stanford Avenue 3L [941], Stanford Avenue 3L [1055]; 35 s: Market Street 4L [1108], Market Street 3L [1111]
- node 680: 18 s: 52nd Street 4L [1662]; 19 s: 52nd Street 4L [1666], 52nd Street 4L [1662]; 37 s: Shattuck Avenue 2L [1653], Shattuck Avenue 2L [1705]
- node 1406: 30 s: Ashby Avenue 1L [3395], Ashby Avenue 2L [3426]; 15 s: Claremont Avenue 2L [4329]; 15 s: Claremont Avenue 3L [3447]
- node 30: 30 s: Adeline Street 1L [747], Adeline Street 1L [1030]; 15 s: Market Street 2L [755], Market Street 2L [1113]; 15 s: 57th Street 1L [44], 57th Street 1L [1151]

## Cars cleared from gridlock near and far (judged zone)

Judged zone: the study area, its bounding streets and the junctions on them, plus nodes within 200 m of it along the network (111 nodes, 329 links). A far clearing counts against the stability rule when its blocking chain (vehicles held at least 60 s by a full exit, at the 5 s snapshot before it) reaches a link in the zone.

| Buffer (m) | Near | Far | Far, chain reaches the zone | Judged |
| --- | --- | --- | --- | --- |
| 100.0 | 0 | 0 | 0 | 0 |
| 200.0 | 0 | 0 | 0 | 0 |
| 400.0 | 0 | 0 | 0 | 0 |

Entry backlog at the end of the run: 1 trips waiting at origins in the zone, of 53 in all.

| Bounding street | Links | Longest standing queue on one link (m) | Link (length m) | At (min) | Share of samples with a link full |
| --- | --- | --- | --- | --- | --- |
| Telegraph Avenue | 28 | 65.0 | 1979 (81.0) | 29.0 | 0.002 |
| Alcatraz Avenue | 14 | 72.0 | 4238 (84.0) | 52.3 | 0.002 |
| College Avenue | 6 | 59.0 | 2805 (102.0) | 16.6 | 0.0 |
| Claremont Avenue | 13 | 59.0 | 2776 (161.0) | 23.0 | 0.0 |
| CA 24 | 3 | 29.0 | 1945 (188.0) | 18.9 | 0.0 |

## Junction recovery

Policy `physical`. Node entries by cars and cyclists in the run: 736425 (settle interval 0). An admission is an entry the ordinary rule would have refused; head-seconds count the time a waiting head vehicle had the reason invoked, and the part of it in which it still could not enter. Courtesy and the yield fallback change priority only; under `physical` the conflict bypass never admits.

| Reason | Admissions per hour | Per 1,000 entries | Head-s invoked | Head-s blocked |
| --- | --- | --- | --- | --- |
| courtesy | 196.0 | 0.266 | 574 | 510 |
| yield fallback | 63.0 | 0.086 | 18 | 0 |
| conflict bypass | 0.0 | 0.000 | 0 | 0 |

Vehicles removed while held in a node by a full exit: 0 (0.0 per hour, included in the gridlock removals).

| Node | Streets | Control | Courtesy | Yield fallback | Conflict bypass | Held removals |
| --- | --- | --- | --- | --- | --- | --- |
| 1429 | Claremont Avenue / Claremont Boulevard | two_way_stop | 26 | 1 | 0 | 0 |
| 1220 | Ashby Avenue / College Avenue | signal | 13 | 0 | 0 | 0 |
| 1152 | Ashby Avenue / Ashby Place / Elmwood Avenue | two_way_stop | 5 | 6 | 0 | 0 |
| 501 | Alcatraz Avenue / Shattuck Avenue | signal | 9 | 0 | 0 | 0 |
| 395 | 65th Street / Shattuck Avenue | two_way_stop | 3 | 5 | 0 | 0 |
| 271 | 46th Street / Market Street | two_way_stop | 6 | 1 | 0 | 0 |
| 342 | 56th Street / Shattuck Avenue | two_way_stop | 3 | 4 | 0 | 0 |
| 851 | Alcatraz Avenue / Telegraph Avenue | signal | 7 | 0 | 0 | 0 |
| 30 | 57th Street / Adeline Street / Market Street | signal | 6 | 0 | 0 | 0 |
| 165 | Alcatraz Avenue / Baker Street | two_way_stop | 4 | 2 | 0 | 0 |

## Entry backlog by origin node at end of run (top 10)

| Node | Streets | Trips waiting | Offered veh/h (before scale) |
| --- | --- | --- | --- |
| 1756 | Claremont Avenue | 39 | 484 |
| 1408 | Avalon Avenue / Claremont Avenue | 6 | 6 |
| 1430 | Claremont Avenue / Russell Street | 2 | 17 |
| 56 | Gaskill Street / Stanford Avenue | 1 | 10 |
| 1093 | College Avenue / Harwood Avenue | 1 | 230 |
| 1232 | Ashby Avenue / Claremont Crescent | 1 | 3 |
| 1312 | Broadway / Brookside Avenue | 1 | 29 |
| 1385 | Oak Ridge Road / Tunnel Road | 1 | 24 |
| 1672 | Warren Freeway | 1 | 779 |

## Flow on key streets (veh/h per direction, study-area links of 40 m or more)

| Street | Direction of travel | Links | Median flow | Max flow |
| --- | --- | --- | --- | --- |
| Telegraph | N | 12 | 964 | 1002 |
| Telegraph | S | 10 | 920 | 971 |
| College | N | 3 | 298 | 305 |
| College | S | 3 | 364 | 365 |
| Claremont | N | 6 | 418 | 746 |
| Claremont | S | 7 | 424 | 780 |
| Alcatraz | E | 6 | 412 | 434 |
| Alcatraz | W | 6 | 438 | 446 |
| Hillegass | N | 4 | 94 | 94 |
| Hillegass | S | 4 | 78 | 79 |
| Colby | N | 7 | 98 | 112 |
| Colby | S | 7 | 96 | 138 |
| Martin | E | 2 | 119 | 119 |
| Martin | W | 2 | 108 | 108 |

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
