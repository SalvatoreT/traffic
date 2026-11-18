# Calibration report: rockridge am_peak scale 1 seed 1 (60 min)

Offered demand 23614 veh/h x scale 1 = 23614 veh/h. Run took 25.0 s wall clock. Flow tables use the window after a 10 min warm-up; select-link and health figures cover the whole run from an empty network.

## Stability (design D4)

| Criterion | Threshold | Value | Result |
| --- | --- | --- | --- |
| Gridlock removals | 0 | 0 | pass |
| Backlog / spawned | < 2% | 0.0% (11 of 23813) | pass |
| Arterial mean speed (run) | > 4 m/s | 8.87 m/s (last 15 min 8.87) | pass |

Overall: **STABLE**. Mean trip delay 133 s, mean trip time 382 s, completed 23993, unroutable 0.

| t (min) | vehicles in network | backlog | completed | removals | arterial speed in interval (m/s) |
| --- | --- | --- | --- | --- | --- |
| 5 | 2599 | 10 | 2126 | 0 | 9.11 |
| 10 | 2577 | 10 | 4168 | 0 | 9.06 |
| 15 | 2589 | 11 | 6134 | 0 | 8.61 |
| 20 | 2612 | 3 | 8121 | 0 | 8.67 |
| 25 | 2625 | 8 | 10086 | 0 | 9.17 |
| 30 | 2616 | 12 | 12143 | 0 | 8.94 |
| 35 | 2506 | 24 | 14138 | 0 | 8.92 |
| 40 | 2583 | 36 | 16020 | 0 | 8.58 |
| 45 | 2543 | 44 | 18010 | 0 | 8.84 |
| 50 | 2587 | 39 | 20016 | 0 | 9.03 |
| 55 | 2595 | 6 | 22007 | 0 | 8.92 |
| 60 | 2566 | 11 | 23993 | 0 | 8.65 |
## Wandering (completed car trips)

Detour ratio = distance driven (link and movement lengths) over the shortest network distance from the trip's origin to its destination. Detour against the free-flow route uses the time-shortest route with no congestion and no noise, which is what a purposeful driver without live information would follow (it differs from the shortest distance when a faster, longer road exists). A switch is a change of the remaining route while en route. Loops: the same link twice or the same node three or more times. Reversals: a link followed by its reverse within 200 m. 'Study-area vehicle-miles' are miles driven on links inside the study area; the last column is the share of them driven by trips with a detour ratio above 1.3. Guided drivers re-evaluate their route every epoch; the others keep their departure route unless it is blocked.

| Trips | n | Switches per trip | With a switch | Mean detour | Median detour | Detour > 1.3 | Detour > 2 | Mean detour vs free-flow route | Vs free-flow route > 1.3 | Loops | Reversals | Study veh-miles | Of them by detour > 1.3 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| all trips | 22050 | 0.01 | 1.3% | 1.084 | 1.050 | 3.9% | 0.0% | 1.025 | 1.9% | 0.0% | 0.3% | 2209 | 7.0% |
| gate to gate | 6429 | 0.03 | 2.5% | 1.088 | 1.060 | 3.2% | 0.0% | 1.026 | 1.9% | 0.0% | 0.2% | 578 | 6.5% |
| with a local end | 15621 | 0.01 | 0.8% | 1.082 | 1.049 | 4.1% | 0.0% | 1.025 | 1.9% | 0.0% | 0.3% | 1630 | 7.2% |
| guided drivers | 10146 | 0.03 | 2.7% | 1.085 | 1.050 | 4.1% | 0.0% | 1.026 | 2.0% | 0.0% | 0.3% | 1018 | 7.4% |
| other drivers | 11904 | 0.00 | 0.1% | 1.083 | 1.050 | 3.7% | 0.0% | 1.025 | 1.8% | 0.0% | 0.3% | 1191 | 6.7% |

## Reported patterns (diagnostics; configured in the targets file under `patterns`)

(a) Trips between the surface gates on the north side of the ramps and the freeway mainline gates, and the local-street (residential and service links in the study area) vehicle-miles they drive. Share = of all completed trips' local-street vehicle-miles (323 miles). No observed counterpart exists for this quantity (the targets file has only the select-link shares above).

| Trips | n trips | Local-street veh-miles | Share of all local-street veh-miles |
| --- | --- | --- | --- |
| surface gates to the freeway | 842 | 18.4 | 6% |
| freeway to the surface gates | 1068 | 22.5 | 7% |

(b) Corridor trips: completed trips from beyond one end of the corridor's study-area extent (the bypass street and its arterial together) to beyond the other end, within a lateral limit of the corridor, by direction. 'Bypass' = at least N blocks (links) on the bypass street; 'arterial' = fewer bypass blocks and at least N on the arterial; 'other' = neither (another street, the freeway or a short use); blocks are counted on the corridor's study-area links. No observed counterpart exists for these shares. The related observed values are in the select-link table above: northbound Hillegass Ave traffic rarely ends on College Ave (6%), 21 to 33% jogs to Benvenue Ave, and southbound freeway-bound drivers on College Ave commonly arrive via Ashby Ave and Benvenue Ave and jog to Hillegass Ave.

| Bypass | Arterial | N | Direction | Corridor trips | Bypass | Arterial | Other | Mean bypass blocks |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue | College Avenue | 3 | N | 1121 | 3% | 12% | 84% | 0.1 |
| Hillegass Avenue | College Avenue | 3 | S | 1181 | 1% | 24% | 75% | 0.1 |

## Per-mode results

Offered: 23614 car veh/h; 497 bicycle flows (702/h); 2000 pedestrian flows (2228/h). Bicycle and pedestrian volumes are assumptions, not counts.

| Mode | In network | Completed | Mean time (s) | Other |
| --- | --- | --- | --- | --- |
| Car | 2566 | 23993 | 382 | |
| Bicycle | 40 | 726 | 255 | |
| Pedestrian | 299 | 2153 | 461 | mean crossing delay 7.1 s |

Vulnerable road users (surrogate indicators): pedestrian conflicts 352, bicycle conflicts 998, close passes 636, pedestrian injury severity mean 0.046 (AIS4+, 12706 supported of 12706 encounters), cyclist injury severity mean 0.063 (MAIS3+F, 3451 supported of 6273 encounters) (separate endpoints, never summed), mean vehicle speed at pedestrian encounters 2.45 m/s.


## Volunteer whole-street counts

Each car counts once when it passes the last stop line after driving the full directed corridor in order. The measurement window is 50.0 minutes. The last two columns describe trips that visited any corridor link during the full run.

| Corridor | Counted whole street (veh/h) | Modeled whole street (veh/h) | Used in fit | Through trips on any link (veh/h) | Freeway trips on any link (veh/h) |
| --- | --- | --- | --- | --- | --- |
| Hillegass Avenue NB | 34 | 44 | yes | 48 | 81 |
| Colby Street NB | 33 | 64 | yes | 82 | 104 |
| Hillegass Avenue SB | 36 | 12 | yes | 43 | 56 |
| Colby Street SB | 46 | 26 | yes | 69 | 88 |

## Intent map: through cars by where they come from and where they are going

Through = neither trip end is in the study area. Groups are the approach groups of the area config (data/areas); a node that is not a gate takes the group of the nearest surface gate (ASSUMPTION). The arterial is the one a trip would use on the shortest free-flow path with the study area's residential and service streets closed, where that path runs on a boundary street near the study area.

Model figures are the mean of 1 seed(s), per hour of the run. Basis: OBSERVED = read from the resident volunteer count of Feb 25, 2025 or its headline shares; ASSUMPTION = inferred from those numbers or chosen.

### Colby Street NB

Observed (PM): 182 cars entered at the south end, 102 drove the whole street, 164 left it at Alcatraz Ave (131 left, 32 right, 1 straight), and 47% of the block's trips came from a freeway (the headline share). ASSUMPTION: freeway-origin cars that do not end along the street are 65 veh/h (the 82 freeway-origin trips on the block, 47% of 174, times the 182 / (182 + 47) of its cars that entered at the south end rather than joining on the way), spread over the 164 exits in proportion (0.40); the other through cars come from the Telegraph Ave and south-side approaches that feed the street's south end. Ranges: low = 131 (32) x 0.47 x 0.62 (the whole-street share of exits), high = 131 (32) x 0.47.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | OBSERVED turn count x ASSUMPTION share (131 left turns x 0.40) | 52 (38 to 62) | 43 | within |
| Telegraph Ave and south-side traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | ASSUMPTION: the through left-turners (131 x 0.62 = 81) that are not off-ramp traffic | 29 (19 to 43) | 21 | within |
| SR-24 off-ramp traffic using Colby St to reach College Ave and Berkeley (right at Alcatraz Ave) | OBSERVED turn count x ASSUMPTION share (32 right turns x 0.40) | 13 (9 to 15) | 4 | below |
| Telegraph Ave and south-side traffic using Colby St to reach College Ave and Berkeley | ASSUMPTION: the through right-turners (32 x 0.62 = 20) that are not off-ramp traffic | 7 (5 to 11) | 11 | within |
| Intents listed, together | | 101 (71 to 131) | 79 | |
| Other through cars (no intent listed) | | | 3 | |

Model through cars by origin and destination group (largest 12 of 12 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 43.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 13.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 8.0 | Telegraph Avenue |
| Telegraph Ave to the south (downtown Oakland) | Telegraph Ave from the north (Berkeley) | 5.0 | Telegraph Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Telegraph Ave from the north (Berkeley) | 3.0 | Telegraph Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Claremont Ave and Tunnel Rd toward the hills | 2.0 | Claremont Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 2.0 | Telegraph Avenue |
| Emeryville and West Oakland streets (55th to 67th Streets) | Claremont Ave and Tunnel Rd toward the hills | 2.0 | Alcatraz Avenue then Claremont Avenue |
| West Oakland to the southwest (Adeline St, Market St) | College Ave from the north (Berkeley) | 1.0 | none near the study area |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 1.0 | SR-24 |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | College Ave from the north (Berkeley) | 1.0 | SR-24 then Claremont Avenue then College Avenue |
| Emeryville and West Oakland streets (55th to 67th Streets) | Berkeley hills to the northeast (Evergreen Ln, Gravatt Dr) | 1.0 | Alcatraz Avenue then Claremont Avenue |

By the arterial these cars would otherwise use: Telegraph Avenue 74 veh/h; Alcatraz Avenue then Claremont Avenue 3 veh/h; Claremont Avenue 2 veh/h; SR-24 1 veh/h; SR-24 then Claremont Avenue then College Avenue 1 veh/h; none near the study area 1 veh/h.

### Hillegass Avenue NB

Observed (PM): 94 cars entered at the south end, 48 drove the whole street, 109 left it at Alcatraz Ave (43 west, 54 east, 12 straight), and 47% of the block's trips came from a freeway. ASSUMPTION: freeway-origin through cars are 40 veh/h (52 freeway-origin trips times 94 / (94 + 29)), spread over the exits in proportion (0.37); the through share of exits is 48 / 109 = 0.44.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Hillegass Ave to reach Alcatraz Ave west and Telegraph Ave north | OBSERVED turn count x ASSUMPTION share (43 left turns x 0.37) | 16 (9 to 20) | 13 | within |
| SR-24 off-ramp traffic using Hillegass Ave to reach College Ave and Berkeley | OBSERVED turn count x ASSUMPTION share (54 right turns x 0.37) | 20 (11 to 25) | 26 | above |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach Alcatraz Ave west | ASSUMPTION: through exits (43 x 0.44) that are not off-ramp traffic | 3 (0 to 10) | 1 | within |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach College Ave and Berkeley | ASSUMPTION: through exits (54 x 0.44) that are not off-ramp traffic | 4 (0 to 13) | 6 | within |
| Intents listed, together | | 43 (20 to 68) | 46 | |
| Other through cars (no intent listed) | | | 2 | |

Model through cars by origin and destination group (largest 12 of 13 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 14.0 | SR-24 |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | College Ave from the north (Berkeley) | 6.0 | SR-24 then Claremont Avenue then College Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 6.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 5.0 | SR-24 then Claremont Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Alcatraz Ave from the west (Emeryville side) | 4.0 | SR-24 then Telegraph Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Ashby Ave from the west (Emeryville and I-80) | 3.0 | SR-24 then Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 2.0 | Telegraph Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Claremont Ave and Tunnel Rd toward the hills | 2.0 | Claremont Avenue |
| West Oakland to the southwest (Adeline St, Market St) | College Ave from the north (Berkeley) | 2.0 | Telegraph Avenue |
| San Pablo Ave (Emeryville and West Oakland) | Claremont Ave and Tunnel Rd toward the hills | 1.0 | Alcatraz Avenue then Claremont Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 1.0 | Claremont Avenue |
| SR-13 Warren Freeway (via SR-24 east) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 1.0 | Claremont Avenue then Alcatraz Avenue |
| other pairs | | 1.0 | |

By the arterial these cars would otherwise use: SR-24 14 veh/h; Telegraph Avenue 10 veh/h; SR-24 then Telegraph Avenue 7 veh/h; SR-24 then Claremont Avenue then College Avenue 6 veh/h; SR-24 then Claremont Avenue 5 veh/h; Claremont Avenue 3 veh/h.

### Hillegass Avenue SB

Observed (PM): 178 cars entered at the top (76 turned in from Alcatraz Ave west, 98 from the east, 4 came straight from the north), 79 drove the whole street, and 68% of the block's trips (109 veh/h) went to a freeway. ASSUMPTION: freeway-bound cars that did not join mid-street are 87 veh/h (109 x 178 / (178 + 44)), half of the 174 turn-ins; low = the whole-street share of the turn-ins (0.45), high = the freeway-bound share without the mid-street correction (0.63).

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Telegraph Ave, Alcatraz Ave west and West Berkeley traffic turning off Alcatraz Ave onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (76 turn-ins x 0.50) | 38 (34 to 48) | 13 | below |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (98 turn-ins x 0.50) | 49 (44 to 62) | 11 | below |
| Intents listed, together | | 87 (78 to 110) | 24 | |
| Other through cars (no intent listed) | | | 19 | |

Model through cars by origin and destination group (largest 12 of 13 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 13.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Oakland hills to the east (Broadway Terrace, Mountain Blvd, Moraga Ave) | 4.0 | Alcatraz Avenue then College Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 4.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 4.0 | Claremont Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Telegraph Ave to the south (downtown Oakland) | 4.0 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 4.0 | Claremont Avenue then SR-24 |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 3.0 | College Avenue then Claremont Avenue then SR-24 |
| Emeryville and West Oakland streets (55th to 67th Streets) | Berkeley hills to the northeast (Evergreen Ln, Gravatt Dr) | 2.0 | Alcatraz Avenue then Claremont Avenue |
| Alcatraz Ave from the west (Emeryville side) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 1.0 | Alcatraz Avenue then Claremont Avenue |
| Ashby Ave from the west (Emeryville and I-80) | College Ave from the north (Berkeley) | 1.0 | Alcatraz Avenue then College Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 1.0 | Alcatraz Avenue then College Avenue |
| San Pablo Ave (Emeryville and West Oakland) | College Ave from the north (Berkeley) | 1.0 | Alcatraz Avenue then College Avenue |
| other pairs | | 1.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 21 veh/h; Claremont Avenue then SR-24 8 veh/h; Alcatraz Avenue then College Avenue 7 veh/h; Alcatraz Avenue then Claremont Avenue 4 veh/h; College Avenue then Claremont Avenue then SR-24 3 veh/h.

### Colby Street SB

Observed (PM): 139 cars entered at the top (76 from Alcatraz Ave west, 50 from the east, 13 from the north), 39 drove the whole street, 45% of the block's trips (72 veh/h) went to a freeway and 22% came by way of Telegraph Ave. ASSUMPTION: freeway-bound cars that did not join mid-street are 46 veh/h (72 x 139 / (139 + 79)), 0.365 of the 126 turn-ins; low = the whole-street share (0.31), high = the unadjusted freeway share (0.57). The Telegraph Ave cars are the 22% x 160 = 35 of the 76 west turn-ins.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Southbound Telegraph Ave traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (35 Telegraph Ave cars x 0.365) | 13 (11 to 20) | 14 | within |
| Alcatraz Ave west, Ashby Ave and West Berkeley traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (41 other west turn-ins x 0.365) | 15 (13 to 23) | 18 | within |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (50 east turn-ins x 0.365) | 18 (15 to 29) | 7 | below |
| Intents listed, together | | 46 (39 to 72) | 39 | |
| Other through cars (no intent listed) | | | 30 | |

Model through cars by origin and destination group (largest 12 of 20 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 12.0 | Telegraph Avenue |
| Shattuck Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 9.0 | none near the study area |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 7.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 7.0 | Claremont Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Telegraph Ave to the south (downtown Oakland) | 6.0 | Telegraph Avenue |
| Berkeley hills to the northeast (Evergreen Ln, Gravatt Dr) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 4.0 | Claremont Avenue then Alcatraz Avenue then Telegraph Avenue |
| Alcatraz Ave from the west (Emeryville side) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 3.0 | SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | San Pablo Ave (Emeryville and West Oakland) | 3.0 | College Avenue then Alcatraz Avenue |
| Telegraph Ave from the north (Berkeley) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 3.0 | Telegraph Avenue |
| Ashby Ave from the west (Emeryville and I-80) | SR-13 Warren Freeway (via SR-24 east) | 2.0 | SR-24 |
| Ashby Ave from the west (Emeryville and I-80) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 2.0 | SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | West Oakland to the southwest (Adeline St, Market St) | 2.0 | Alcatraz Avenue then Telegraph Avenue |
| other pairs | | 9.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 28 veh/h; none near the study area 13 veh/h; SR-24 8 veh/h; Claremont Avenue then SR-24 7 veh/h; Claremont Avenue then Alcatraz Avenue then Telegraph Avenue 5 veh/h; College Avenue then Alcatraz Avenue 3 veh/h.

### Study area, all residential and service streets

Model: 394 through cars per hour.

Model through cars by origin and destination group (largest 12 of 58 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 49.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 33.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 30.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 27.0 | Claremont Avenue then College Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 25.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Ashby Ave from the west (Emeryville and I-80) | 24.0 | Claremont Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 16.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 14.0 | SR-24 |
| Shattuck Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 12.0 | none near the study area |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 11.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Telegraph Ave to the south (downtown Oakland) | 10.0 | Telegraph Avenue |
| Berkeley hills to the northeast (Evergreen Ln, Gravatt Dr) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 8.0 | Claremont Avenue then Alcatraz Avenue then Telegraph Avenue |
| other pairs | | 135.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 200 veh/h; Claremont Avenue 44 veh/h; none near the study area 29 veh/h; Claremont Avenue then College Avenue 28 veh/h; SR-24 22 veh/h; Alcatraz Avenue then Claremont Avenue 17 veh/h.

By origin group: South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 97; SR-24 eastbound off-ramps (arriving from Oakland and I-980) 80; Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 73; Telegraph Ave from the north (Berkeley) 34; Emeryville and West Oakland streets (55th to 67th Streets) 14; Shattuck Ave from the north (Berkeley) 13; West Oakland to the southwest (Adeline St, Market St) 11; Telegraph Ave to the south (downtown Oakland) 11; Berkeley hills to the northeast (Evergreen Ln, Gravatt Dr) 10; Claremont Ave and Tunnel Rd toward the hills 9.

By destination group: SR-24 westbound on-ramps (toward Oakland and I-980) 92; Telegraph Ave from the north (Berkeley) 85; Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 59; Claremont Ave and Tunnel Rd toward the hills 30; Ashby Ave from the west (Emeryville and I-80) 27; South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 24; Telegraph Ave to the south (downtown Oakland) 13; College Ave from the north (Berkeley) 12; Emeryville and West Oakland streets (55th to 67th Streets) 10; West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) 7.


## Through cars by intent (cut-through intent view)

A through car is tallied once, under the first intent that fits it (the on-ramp on its planned route, the off-ramp it has driven, or the origin and destination groups of its trip), at the moment the through count counts it. Cars an hour over the run, the same window as the through-car figure (396 an hour).

| Intent | Basis | Cars an hour | Share |
| --- | --- | --- | --- |
| on-2853241697 | observed | 93 | 23% |
| Other on-ramps | assumed | 10 | 3% |
| off-52990846 | observed | 80 | 20% |
| Other off-ramps | assumed | 10 | 3% |
| Downtown, south and west Oakland traffic using side streets to reach Berkeley and Telegraph Ave north | assumed | 78 | 20% |
| Berkeley and Telegraph Ave north traffic using side streets to reach downtown, south and west Oakland | assumed | 36 | 9% |
| Oakland cross-town traffic (West Oakland, Broadway, Piedmont, Emeryville) using side streets near Claremont Ave and Telegraph Ave | assumed | 39 | 10% |
| Other (no intent listed) |  | 50 | 13% |

Intents listed cover 87% of through cars.


## Select-link shares: modeled vs observed (design D5: headline = freeway shares, tolerance +/-10 pp)

- Hillegass Avenue NB: 4 links (path Claremont Avenue -> Alcatraz Avenue (434 m)), 136 trips (125 completed)
- Colby Street NB: 8 links (path Claremont Avenue -> Alcatraz Avenue (680 m)), 189 trips (179 completed)
- Hillegass Avenue SB: 4 links (path Alcatraz Avenue -> Claremont Avenue (433 m)), 132 trips (123 completed)
- Colby Street SB: 8 links (path Alcatraz Avenue -> Claremont Avenue (680 m)), 227 trips (202 completed)

| Block | Side | Via | Observed | Modeled | Diff (pp) | n trips | Headline |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue NB | from | freeway | 47% | 60% | +13 | 136 | OUTSIDE |
| Hillegass Avenue NB | to | Benvenue Avenue | 21% (PM 33%) | 9% | -12 | 136 |  |
| Hillegass Avenue NB | to | College Avenue | 6% | 12% | +6 | 136 |  |
| Hillegass Avenue NB | to | Alcatraz Avenue WB | 27% | 29% | +2 | 136 |  |
| Colby Street NB | from | freeway | 47% | 51% | +4 | 189 | within |
| Colby Street NB | to | Alcatraz Avenue WB | 48% | 42% | -6 | 189 |  |
| Colby Street NB | to | Telegraph Avenue | 25% | 44% | +19 | 189 |  |
| Colby Street NB | to | College Avenue | 3% | 2% | -1 | 189 |  |
| Hillegass Avenue SB | from | Alcatraz Avenue WB | 46% | 11% | -35 | 132 |  |
| Hillegass Avenue SB | from | Benvenue Avenue | 26% | 3% | -23 | 132 |  |
| Hillegass Avenue SB | from | College Avenue | 16% | 5% | -11 | 132 |  |
| Hillegass Avenue SB | to | freeway | 57% (PM 68%) | 42% | -15 | 132 | OUTSIDE |
| Colby Street SB | from | Alcatraz Avenue EB | 43% | 17% | -26 | 227 |  |
| Colby Street SB | from | Alcatraz Avenue WB | 46% | 11% | -35 | 227 |  |
| Colby Street SB | from | Telegraph Avenue | 22% | 18% | -4 | 227 |  |
| Colby Street SB | to | freeway | 45% | 39% | -6 | 227 | within |
| Colby Street SB | to | Forest Street | 34% | 24% | -10 | 227 |  |

Headline shares within tolerance: 2 of 4. Observed column uses the PM-peak share where one is given and the period is pm_peak. 'Via' shares are the fraction of select-link trips using that street before (from) or after (to) the block; freeway = origin / destination gate with a motorway-class link attached.

## Claremont ramps: streets used before the on-ramp / after the off-ramp

Observed shares are for traffic from/to the north only. 'Modeled' is over all trips on the ramps and any visit to the street (an upper bound for streets that serve both sides). 'Modeled, side' counts only trips whose surface end lies on the side of the ramp stated in the targets file (`freewayRamp.side`), and for a street with a qualifier ("north of X") only its links on that side of X.

| Direction | Via | Observed | Modeled | n ramp trips | Modeled, side | n side trips |
| --- | --- | --- | --- | --- | --- | --- |
| onto freeway | College Avenue | 16% | 18% | 640 | 21% | 532 |
| onto freeway | Hillegass Avenue | 12% | 9% | 640 | 11% | 532 |
| onto freeway | Martin Street | 10% | 13% | 640 | 15% | 532 |
| onto freeway | Colby Street | 8% | 13% | 640 | 15% | 532 |
| onto freeway | Telegraph Avenue north of Alcatraz Avenue | 8% | 12% | 640 | 9% | 532 |
| onto freeway | Benvenue Avenue | 5% | 4% | 640 | 5% | 532 |
| from freeway | College Avenue | 10% | 10% | 614 | 10% | 599 |
| from freeway | Martin Street | 10% | 9% | 614 | 9% | 599 |
| from freeway | Colby Street | 8% | 10% | 614 | 10% | 599 |
| from freeway | Hillegass Avenue | 5% | 7% | 614 | 8% | 599 |
| from freeway | Benvenue Avenue | 3% | 2% | 614 | 2% | 599 |

## Top 15 links by delay

| Link | Street | Class | Lanes | Len (m) | End node control | Delay (veh-h) | Stopped (veh-h) | Mean stopped veh | Flow (veh/h) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 4175 | (unnamed) | Motorway | 2 | 142 | uncontrolled | 10.91 | 2.00 | 2.0 | 1512 |
| 3395 | Ashby Avenue | Primary | 1 | 129 | signal | 7.61 | 6.01 | 6.0 | 592 |
| 1049 | Adeline Street | Secondary | 4 | 43 | signal | 7.13 | 5.89 | 5.9 | 1253 |
| 4329 | Claremont Avenue | Secondary | 2 | 113 | signal | 6.93 | 5.84 | 5.8 | 455 |
| 460 | Sacramento Street | Tertiary | 2 | 104 | two_way_stop | 6.88 | 5.78 | 5.8 | 392 |
| 3434 | Claremont Avenue | Secondary | 1 | 93 | all_way_stop | 6.59 | 3.68 | 3.7 | 498 |
| 1051 | Adeline Street | Secondary | 4 | 50 | signal | 6.54 | 5.64 | 5.6 | 1052 |
| 834 | Martin Luther King Junior Way | Secondary | 4 | 49 | signal | 6.03 | 4.46 | 4.5 | 1232 |
| 4398 | Ashby Avenue | Primary | 2 | 96 | uncontrolled | 6.03 | 4.13 | 4.1 | 769 |
| 1879 | 58th Street | Residential | 1 | 221 | two_way_stop | 5.87 | 4.90 | 4.9 | 84 |
| 1666 | 52nd Street | Secondary | 4 | 39 | signal | 5.65 | 4.95 | 5.0 | 655 |
| 1108 | Market Street | Secondary | 4 | 36 | signal | 5.50 | 4.61 | 4.6 | 1116 |
| 2037 | Alcatraz Avenue | Tertiary | 1 | 202 | uncontrolled | 5.47 | 3.60 | 3.6 | 596 |
| 1122 | Alcatraz Avenue | Tertiary | 1 | 299 | signal | 5.45 | 3.99 | 4.0 | 427 |
| 3001 | College Avenue | Tertiary | 1 | 107 | signal | 5.44 | 4.38 | 4.4 | 378 |

## Top 15 nodes by blocked time

Blocked time = lane-head seconds waiting at the stop line without permission (signal red, conflict, stop sign or no downstream space).

| Node | Streets | Control | Gate | Blocked (lane-h) | of which no downstream space | Signal plan at end (cycle: greens) |
| --- | --- | --- | --- | --- | --- | --- |
| 447 | Adeline Street / Alcatraz Avenue | signal |  | 5.25 | 0.06 | 75 s: 30/35 |
| 446 | Market Street / Stanford Avenue | signal |  | 4.85 | 0.19 | 75 s: 32/33 |
| 680 | 52nd Street / Shattuck Avenue | signal |  | 4.78 | 0.06 | 90 s: 18/19/37 |
| 1406 | Ashby Avenue / Claremont Avenue | signal |  | 4.47 | 0.30 | 95 s: 44/21/15 |
| 30 | 57th Street / Adeline Street / Market Street | signal |  | 3.36 | 0.03 | 75 s: 24/21/15 |
| 332 | 55th Street / Martin Luther King Junior Way | signal |  | 3.33 | 0.03 | 75 s: 36/29 |
| 242 | Ashby Avenue / Martin Luther King Junior Way | signal |  | 3.10 | 0.00 | 75 s: 45/20 |
| 331 | 52nd Street / Martin Luther King Junior Way | signal |  | 3.06 | 0.04 | 75 s: 50/15 |
| 37 | San Pablo Avenue / Stanford Avenue | signal |  | 2.98 | 0.01 | 75 s: 20/45 |
| 479 | Adeline Street / Martin Luther King Junior Way / Stanford Avenue | signal |  | 2.98 | 0.03 | 75 s: 44/21 |
| 185 | Alcatraz Avenue / Sacramento Street | signal |  | 2.90 | 0.03 | 75 s: 29/36 |
| 851 | Alcatraz Avenue / Telegraph Avenue | signal |  | 2.85 | 0.04 | 75 s: 46/19 |
| 947 | Ashby Avenue / Telegraph Avenue | signal |  | 2.77 | 0.00 | 75 s: 24/41 |
| 944 | Ashby Avenue / Shattuck Avenue | signal |  | 2.75 | 0.02 | 75 s: 45/20 |
| 1220 | Ashby Avenue / College Avenue | signal |  | 2.71 | 0.05 | 75 s: 35/30 |

Phases of the five most blocked signals (green s: approach links with their lanes, link ids in brackets):

- node 447: 30 s: Adeline Street 4L [1049], Adeline Street 4L [1051]; 35 s: Alcatraz Avenue 2L [1048], Alcatraz Avenue 2L [1133]
- node 446: 32 s: Stanford Avenue 3L [941], Stanford Avenue 3L [1055]; 33 s: Market Street 4L [1108], Market Street 3L [1111]
- node 680: 18 s: 52nd Street 4L [1662]; 19 s: 52nd Street 4L [1666], 52nd Street 4L [1662]; 37 s: Shattuck Avenue 2L [1653], Shattuck Avenue 2L [1705]
- node 1406: 44 s: Ashby Avenue 1L [3395], Ashby Avenue 2L [3426]; 21 s: Claremont Avenue 2L [4329]; 15 s: Claremont Avenue 3L [3447]
- node 30: 24 s: Adeline Street 1L [747], Adeline Street 1L [1030]; 21 s: Market Street 2L [755], Market Street 2L [1113]; 15 s: 57th Street 1L [44], 57th Street 1L [1151]

## Cars cleared from gridlock near and far (judged zone)

Judged zone: the study area, its bounding streets and the junctions on them, plus nodes within 200 m of it along the network (111 nodes, 329 links). A far clearing counts against the stability rule when its blocking chain (vehicles held at least 60 s by a full exit, at the 5 s snapshot before it) reaches a link in the zone.

| Buffer (m) | Near | Far | Far, chain reaches the zone | Judged |
| --- | --- | --- | --- | --- |
| 100.0 | 0 | 0 | 0 | 0 |
| 200.0 | 0 | 0 | 0 | 0 |
| 400.0 | 0 | 0 | 0 | 0 |

Entry backlog at the end of the run: 0 trips waiting at origins in the zone, of 11 in all.

| Bounding street | Links | Longest standing queue on one link (m) | Link (length m) | At (min) | Share of samples with a link full |
| --- | --- | --- | --- | --- | --- |
| Telegraph Avenue | 28 | 65.0 | 1604 (94.0) | 55.9 | 0.0 |
| Alcatraz Avenue | 14 | 65.0 | 4238 (84.0) | 21.1 | 0.0 |
| College Avenue | 6 | 59.0 | 2805 (102.0) | 22.9 | 0.0 |
| Claremont Avenue | 13 | 52.0 | 2776 (161.0) | 51.9 | 0.0 |
| CA 24 | 3 | 46.0 | 1945 (188.0) | 10.3 | 0.0 |

## Junction recovery

Policy `physical`. Node entries by cars and cyclists in the run: 736497 (settle interval 0). An admission is an entry the ordinary rule would have refused; head-seconds count the time a waiting head vehicle had the reason invoked, and the part of it in which it still could not enter. Courtesy and the yield fallback change priority only; under `physical` the conflict bypass never admits.

| Reason | Admissions per hour | Per 1,000 entries | Head-s invoked | Head-s blocked |
| --- | --- | --- | --- | --- |
| courtesy | 133.0 | 0.181 | 602 | 557 |
| yield fallback | 45.0 | 0.061 | 13 | 0 |
| conflict bypass | 0.0 | 0.000 | 5 | 5 |

Vehicles removed while held in a node by a full exit: 0 (0.0 per hour, included in the gridlock removals).

| Node | Streets | Control | Courtesy | Yield fallback | Conflict bypass | Held removals |
| --- | --- | --- | --- | --- | --- | --- |
| 1429 | Claremont Avenue / Claremont Boulevard | two_way_stop | 24 | 1 | 0 | 0 |
| 1405 | Claremont Boulevard / Russell Street | two_way_stop | 13 | 0 | 0 | 0 |
| 147 | 59th Street / Grace Avenue / Los Angeles Street | two_way_stop | 6 | 4 | 0 | 0 |
| 395 | 65th Street / Shattuck Avenue | two_way_stop | 6 | 4 | 0 | 0 |
| 924 | Ashby Avenue / Regent Street | two_way_stop | 7 | 0 | 0 | 0 |
| 141 | 63rd Street / Lowell Street / Market Street | two_way_stop | 3 | 3 | 0 | 0 |
| 165 | Alcatraz Avenue / Baker Street | two_way_stop | 3 | 3 | 0 | 0 |
| 528 | Shattuck Avenue / Woolsey Street | two_way_stop | 4 | 2 | 0 | 0 |
| 1399 | Bridge Road / Tunnel Road | two_way_stop | 5 | 1 | 0 | 0 |
| 168 | 62nd Street / Market Street | two_way_stop | 0 | 5 | 0 | 0 |

## Entry backlog by origin node at end of run (top 10)

| Node | Streets | Trips waiting | Offered veh/h (before scale) |
| --- | --- | --- | --- |
| 1408 | Avalon Avenue / Claremont Avenue | 5 | 11 |
| 131 | 61st Street / San Pablo Avenue | 1 | 46 |
| 271 | 46th Street / Market Street | 1 | 7 |
| 273 | 44th Street / Market Street | 1 | 17 |
| 1134 | Claremont Avenue / Claremont Crescent | 1 | 10 |
| 1210 | Hillegass Avenue / Woolsey Street | 1 | 56 |
| 1756 | Claremont Avenue | 1 | 463 |

## Flow on key streets (veh/h per direction, study-area links of 40 m or more)

| Street | Direction of travel | Links | Median flow | Max flow |
| --- | --- | --- | --- | --- |
| Telegraph | N | 12 | 954 | 994 |
| Telegraph | S | 10 | 919 | 982 |
| College | N | 3 | 318 | 318 |
| College | S | 3 | 487 | 492 |
| Claremont | N | 6 | 496 | 778 |
| Claremont | S | 7 | 482 | 812 |
| Alcatraz | E | 6 | 392 | 437 |
| Alcatraz | W | 6 | 376 | 390 |
| Hillegass | N | 4 | 79 | 88 |
| Hillegass | S | 4 | 56 | 73 |
| Colby | N | 7 | 109 | 132 |
| Colby | S | 7 | 139 | 155 |
| Martin | E | 2 | 106 | 106 |
| Martin | W | 2 | 116 | 116 |

## Largest demand origins (offered, before scale)

| Node | Streets | Veh/h |
| --- | --- | --- |
| 602 | Grove Shafter Freeway | 3657 |
| 265 | Ashby Avenue | 1242 |
| 943 | Telegraph Avenue / Ward Street | 1152 |
| 1672 | Warren Freeway | 836 |
| 183 | San Pablo Avenue | 788 |
| 763 | Telegraph Avenue | 622 |
| 971 | Pleasant Valley Avenue | 610 |
| 1756 | Claremont Avenue | 463 |
| 275 | Market Street | 426 |
| 1719 | Grove Shafter Freeway | 421 |
