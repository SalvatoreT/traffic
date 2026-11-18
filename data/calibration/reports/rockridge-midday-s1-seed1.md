# Calibration report: rockridge midday scale 1 seed 1 (60 min)

Offered demand 16409 veh/h x scale 1 = 16409 veh/h. Run took 17.2 s wall clock. Flow tables use the window after a 10 min warm-up; select-link and health figures cover the whole run from an empty network.

## Stability (design D4)

| Criterion | Threshold | Value | Result |
| --- | --- | --- | --- |
| Gridlock removals | 0 | 0 | pass |
| Backlog / spawned | < 2% | 0.0% (0 of 16474) | pass |
| Arterial mean speed (run) | > 4 m/s | 10.07 m/s (last 15 min 10.08) | pass |

Overall: **STABLE**. Mean trip delay 94 s, mean trip time 346 s, completed 16650, unroutable 0.

| t (min) | vehicles in network | backlog | completed | removals | arterial speed in interval (m/s) |
| --- | --- | --- | --- | --- | --- |
| 5 | 1695 | 1 | 1505 | 0 | 9.90 |
| 10 | 1495 | 1 | 2967 | 0 | 10.00 |
| 15 | 1564 | 0 | 4236 | 0 | 10.11 |
| 20 | 1558 | 0 | 5614 | 0 | 10.10 |
| 25 | 1612 | 0 | 6948 | 0 | 10.19 |
| 30 | 1641 | 0 | 8326 | 0 | 9.91 |
| 35 | 1606 | 3 | 9718 | 0 | 10.25 |
| 40 | 1693 | 2 | 11090 | 0 | 10.02 |
| 45 | 1613 | 1 | 12556 | 0 | 10.21 |
| 50 | 1615 | 2 | 13940 | 0 | 10.22 |
| 55 | 1613 | 1 | 15326 | 0 | 9.95 |
| 60 | 1630 | 0 | 16650 | 0 | 10.06 |
## Wandering (completed car trips)

Detour ratio = distance driven (link and movement lengths) over the shortest network distance from the trip's origin to its destination. Detour against the free-flow route uses the time-shortest route with no congestion and no noise, which is what a purposeful driver without live information would follow (it differs from the shortest distance when a faster, longer road exists). A switch is a change of the remaining route while en route. Loops: the same link twice or the same node three or more times. Reversals: a link followed by its reverse within 200 m. 'Study-area vehicle-miles' are miles driven on links inside the study area; the last column is the share of them driven by trips with a detour ratio above 1.3. Guided drivers re-evaluate their route every epoch; the others keep their departure route unless it is blocked.

| Trips | n | Switches per trip | With a switch | Mean detour | Median detour | Detour > 1.3 | Detour > 2 | Mean detour vs free-flow route | Vs free-flow route > 1.3 | Loops | Reversals | Study veh-miles | Of them by detour > 1.3 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| all trips | 15359 | 0.00 | 0.1% | 1.085 | 1.051 | 3.7% | 0.0% | 1.020 | 1.2% | 0.0% | 0.2% | 1541 | 5.1% |
| gate to gate | 5539 | 0.00 | 0.2% | 1.087 | 1.056 | 2.5% | 0.0% | 1.021 | 1.0% | 0.0% | 0.1% | 337 | 7.9% |
| with a local end | 9820 | 0.00 | 0.1% | 1.083 | 1.049 | 4.3% | 0.0% | 1.019 | 1.3% | 0.0% | 0.2% | 1204 | 4.3% |
| guided drivers | 6945 | 0.00 | 0.2% | 1.084 | 1.050 | 3.7% | 0.0% | 1.020 | 1.2% | 0.0% | 0.2% | 700 | 5.0% |
| other drivers | 8414 | 0.00 | 0.0% | 1.085 | 1.052 | 3.7% | 0.0% | 1.020 | 1.2% | 0.0% | 0.2% | 841 | 5.2% |

## Reported patterns (diagnostics; configured in the targets file under `patterns`)

(a) Trips between the surface gates on the north side of the ramps and the freeway mainline gates, and the local-street (residential and service links in the study area) vehicle-miles they drive. Share = of all completed trips' local-street vehicle-miles (260 miles). No observed counterpart exists for this quantity (the targets file has only the select-link shares above).

| Trips | n trips | Local-street veh-miles | Share of all local-street veh-miles |
| --- | --- | --- | --- |
| surface gates to the freeway | 1049 | 24.9 | 10% |
| freeway to the surface gates | 748 | 24.6 | 9% |

(b) Corridor trips: completed trips from beyond one end of the corridor's study-area extent (the bypass street and its arterial together) to beyond the other end, within a lateral limit of the corridor, by direction. 'Bypass' = at least N blocks (links) on the bypass street; 'arterial' = fewer bypass blocks and at least N on the arterial; 'other' = neither (another street, the freeway or a short use); blocks are counted on the corridor's study-area links. No observed counterpart exists for these shares. The related observed values are in the select-link table above: northbound Hillegass Ave traffic rarely ends on College Ave (6%), 21 to 33% jogs to Benvenue Ave, and southbound freeway-bound drivers on College Ave commonly arrive via Ashby Ave and Benvenue Ave and jog to Hillegass Ave.

| Bypass | Arterial | N | Direction | Corridor trips | Bypass | Arterial | Other | Mean bypass blocks |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue | College Avenue | 3 | N | 828 | 2% | 13% | 85% | 0.1 |
| Hillegass Avenue | College Avenue | 3 | S | 939 | 3% | 21% | 76% | 0.1 |

## Per-mode results

Offered: 16409 car veh/h; 105 bicycle flows (386/h); 2000 pedestrian flows (2644/h). Bicycle and pedestrian volumes are assumptions, not counts.

| Mode | In network | Completed | Mean time (s) | Other |
| --- | --- | --- | --- | --- |
| Car | 1630 | 16650 | 346 | |
| Bicycle | 15 | 394 | 163 | |
| Pedestrian | 328 | 2613 | 433 | mean crossing delay 7.0 s |

Vulnerable road users (surrogate indicators): pedestrian conflicts 389, bicycle conflicts 222, close passes 131, pedestrian injury severity mean 0.053 (AIS4+, 11155 supported of 11155 encounters), cyclist injury severity mean 0.070 (MAIS3+F, 754 supported of 1449 encounters) (separate endpoints, never summed), mean vehicle speed at pedestrian encounters 2.70 m/s.


## Volunteer whole-street counts

Each car counts once when it passes the last stop line after driving the full directed corridor in order. The measurement window is 50.0 minutes. The last two columns describe trips that visited any corridor link during the full run.

| Corridor | Counted whole street (veh/h) | Modeled whole street (veh/h) | Used in fit | Through trips on any link (veh/h) | Freeway trips on any link (veh/h) |
| --- | --- | --- | --- | --- | --- |
| Hillegass Avenue NB | n/a | 18 | n/a | 46 | 67 |
| Colby Street NB | n/a | 34 | n/a | 85 | 92 |
| Hillegass Avenue SB | n/a | 20 | n/a | 61 | 61 |
| Colby Street SB | n/a | 35 | n/a | 88 | 78 |

## Intent map: through cars by where they come from and where they are going

Through = neither trip end is in the study area. Groups are the approach groups of the area config (data/areas); a node that is not a gate takes the group of the nearest surface gate (ASSUMPTION). The arterial is the one a trip would use on the shortest free-flow path with the study area's residential and service streets closed, where that path runs on a boundary street near the study area.

Model figures are the mean of 1 seed(s), per hour of the run. Basis: OBSERVED = read from the resident volunteer count of Feb 25, 2025 or its headline shares; ASSUMPTION = inferred from those numbers or chosen.

### Colby Street NB

Observed (PM): 182 cars entered at the south end, 102 drove the whole street, 164 left it at Alcatraz Ave (131 left, 32 right, 1 straight), and 47% of the block's trips came from a freeway (the headline share). ASSUMPTION: freeway-origin cars that do not end along the street are 65 veh/h (the 82 freeway-origin trips on the block, 47% of 174, times the 182 / (182 + 47) of its cars that entered at the south end rather than joining on the way), spread over the 164 exits in proportion (0.40); the other through cars come from the Telegraph Ave and south-side approaches that feed the street's south end. Ranges: low = 131 (32) x 0.47 x 0.62 (the whole-street share of exits), high = 131 (32) x 0.47.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | OBSERVED turn count x ASSUMPTION share (131 left turns x 0.40) | 52 (38 to 62) | 45 | within |
| Telegraph Ave and south-side traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | ASSUMPTION: the through left-turners (131 x 0.62 = 81) that are not off-ramp traffic | 29 (19 to 43) | 23 | within |
| SR-24 off-ramp traffic using Colby St to reach College Ave and Berkeley (right at Alcatraz Ave) | OBSERVED turn count x ASSUMPTION share (32 right turns x 0.40) | 13 (9 to 15) | 5 | below |
| Telegraph Ave and south-side traffic using Colby St to reach College Ave and Berkeley | ASSUMPTION: the through right-turners (32 x 0.62 = 20) that are not off-ramp traffic | 7 (5 to 11) | 7 | within |
| Intents listed, together | | 101 (71 to 131) | 80 | |
| Other through cars (no intent listed) | | | 5 | |

Model through cars by origin and destination group (largest 12 of 17 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 45.0 | Telegraph Avenue |
| Telegraph Ave to the south (downtown Oakland) | Telegraph Ave from the north (Berkeley) | 7.0 | Telegraph Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Telegraph Ave from the north (Berkeley) | 5.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 4.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) | 3.0 | none near the study area |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 3.0 | Telegraph Avenue |
| College Ave from the north (Berkeley) | Emeryville and West Oakland streets (55th to 67th Streets) | 2.0 | College Avenue then Alcatraz Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Ashby Ave from the west (Emeryville and I-80) | 2.0 | none near the study area |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave to the south (downtown Oakland) | 2.0 | Claremont Avenue then Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Emeryville and West Oakland streets (55th to 67th Streets) | 2.0 | College Avenue then Alcatraz Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Claremont Ave and Tunnel Rd toward the hills | 2.0 | Claremont Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 2.0 | SR-24 then Claremont Avenue |
| other pairs | | 6.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 64 veh/h; none near the study area 5 veh/h; Claremont Avenue 4 veh/h; College Avenue then Alcatraz Avenue 4 veh/h; Claremont Avenue then Telegraph Avenue 2 veh/h; SR-24 2 veh/h.

### Hillegass Avenue NB

Observed (PM): 94 cars entered at the south end, 48 drove the whole street, 109 left it at Alcatraz Ave (43 west, 54 east, 12 straight), and 47% of the block's trips came from a freeway. ASSUMPTION: freeway-origin through cars are 40 veh/h (52 freeway-origin trips times 94 / (94 + 29)), spread over the exits in proportion (0.37); the through share of exits is 48 / 109 = 0.44.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Hillegass Ave to reach Alcatraz Ave west and Telegraph Ave north | OBSERVED turn count x ASSUMPTION share (43 left turns x 0.37) | 16 (9 to 20) | 15 | within |
| SR-24 off-ramp traffic using Hillegass Ave to reach College Ave and Berkeley | OBSERVED turn count x ASSUMPTION share (54 right turns x 0.37) | 20 (11 to 25) | 16 | within |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach Alcatraz Ave west | ASSUMPTION: through exits (43 x 0.44) that are not off-ramp traffic | 3 (0 to 10) | 4 | within |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach College Ave and Berkeley | ASSUMPTION: through exits (54 x 0.44) that are not off-ramp traffic | 4 (0 to 13) | 4 | within |
| Intents listed, together | | 43 (20 to 68) | 39 | |
| Other through cars (no intent listed) | | | 7 | |

Model through cars by origin and destination group (largest 12 of 13 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 15.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 8.0 | SR-24 |
| College Ave from the north (Berkeley) | Emeryville and West Oakland streets (55th to 67th Streets) | 4.0 | College Avenue then Alcatraz Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 3.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 3.0 | SR-24 then Claremont Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | College Ave from the north (Berkeley) | 3.0 | SR-24 then Claremont Avenue then College Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 2.0 | College Avenue |
| SR-13 Warren Freeway (via SR-24 east) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 2.0 | Claremont Avenue then Alcatraz Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 2.0 | Claremont Avenue then Alcatraz Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 1.0 | Alcatraz Avenue then College Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) | 1.0 | Claremont Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Claremont Ave and Tunnel Rd toward the hills | 1.0 | none near the study area |
| other pairs | | 1.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 18 veh/h; SR-24 8 veh/h; Claremont Avenue then Alcatraz Avenue 4 veh/h; College Avenue then Alcatraz Avenue 4 veh/h; SR-24 then Claremont Avenue 3 veh/h; SR-24 then Claremont Avenue then College Avenue 3 veh/h.

### Hillegass Avenue SB

Observed (PM): 178 cars entered at the top (76 turned in from Alcatraz Ave west, 98 from the east, 4 came straight from the north), 79 drove the whole street, and 68% of the block's trips (109 veh/h) went to a freeway. ASSUMPTION: freeway-bound cars that did not join mid-street are 87 veh/h (109 x 178 / (178 + 44)), half of the 174 turn-ins; low = the whole-street share of the turn-ins (0.45), high = the freeway-bound share without the mid-street correction (0.63).

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Telegraph Ave, Alcatraz Ave west and West Berkeley traffic turning off Alcatraz Ave onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (76 turn-ins x 0.50) | 38 (34 to 48) | 21 | below |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (98 turn-ins x 0.50) | 49 (44 to 62) | 29 | below |
| Intents listed, together | | 87 (78 to 110) | 50 | |
| Other through cars (no intent listed) | | | 11 | |

Model through cars by origin and destination group (largest 12 of 9 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 21.0 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 14.0 | Claremont Avenue then SR-24 |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 8.0 | College Avenue then Claremont Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 7.0 | Claremont Avenue then SR-24 |
| Alcatraz Ave from the west (Emeryville side) | College Ave from the north (Berkeley) | 4.0 | Alcatraz Avenue then College Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 3.0 | College Avenue |
| Ashby Ave from the west (Emeryville and I-80) | College Ave from the north (Berkeley) | 2.0 | Alcatraz Avenue then College Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | College Ave from the north (Berkeley) | 1.0 | Alcatraz Avenue then College Avenue |
| Telegraph Ave from the north (Berkeley) | College Ave from the north (Berkeley) | 1.0 | College Avenue |

By the arterial these cars would otherwise use: Claremont Avenue then SR-24 21 veh/h; Telegraph Avenue 21 veh/h; College Avenue then Claremont Avenue then SR-24 8 veh/h; Alcatraz Avenue then College Avenue 7 veh/h; College Avenue 4 veh/h.

### Colby Street SB

Observed (PM): 139 cars entered at the top (76 from Alcatraz Ave west, 50 from the east, 13 from the north), 39 drove the whole street, 45% of the block's trips (72 veh/h) went to a freeway and 22% came by way of Telegraph Ave. ASSUMPTION: freeway-bound cars that did not join mid-street are 46 veh/h (72 x 139 / (139 + 79)), 0.365 of the 126 turn-ins; low = the whole-street share (0.31), high = the unadjusted freeway share (0.57). The Telegraph Ave cars are the 22% x 160 = 35 of the 76 west turn-ins.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Southbound Telegraph Ave traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (35 Telegraph Ave cars x 0.365) | 13 (11 to 20) | 17 | within |
| Alcatraz Ave west, Ashby Ave and West Berkeley traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (41 other west turn-ins x 0.365) | 15 (13 to 23) | 6 | below |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (50 east turn-ins x 0.365) | 18 (15 to 29) | 39 | above |
| Intents listed, together | | 46 (39 to 72) | 62 | |
| Other through cars (no intent listed) | | | 26 | |

Model through cars by origin and destination group (largest 12 of 21 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 16.0 | Telegraph Avenue |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 14.0 | College Avenue then Claremont Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 13.0 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 12.0 | Claremont Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 8.0 | Alcatraz Avenue then Claremont Avenue |
| Alcatraz Ave from the west (Emeryville side) | College Ave from the north (Berkeley) | 3.0 | Alcatraz Avenue then College Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 3.0 | Telegraph Avenue |
| Shattuck Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 3.0 | none near the study area |
| Ashby Ave from the west (Emeryville and I-80) | College Ave from the north (Berkeley) | 2.0 | Alcatraz Avenue then College Avenue |
| Ashby Ave from the west (Emeryville and I-80) | SR-13 Warren Freeway (via SR-24 east) | 2.0 | SR-24 |
| Telegraph Ave from the north (Berkeley) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 2.0 | Telegraph Avenue |
| Alcatraz Ave from the west (Emeryville side) | SR-13 Warren Freeway (via SR-24 east) | 1.0 | SR-24 |
| other pairs | | 9.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 34 veh/h; College Avenue then Claremont Avenue then SR-24 14 veh/h; Claremont Avenue then SR-24 12 veh/h; Alcatraz Avenue then Claremont Avenue 8 veh/h; Alcatraz Avenue then College Avenue 5 veh/h; Claremont Avenue 4 veh/h.

### Study area, all residential and service streets

Model: 417 through cars per hour.

Model through cars by origin and destination group (largest 12 of 55 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 55.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 43.0 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 29.0 | Telegraph Avenue |
| San Pablo Ave (Emeryville and West Oakland) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 22.0 | Claremont Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave to the south (downtown Oakland) | 22.0 | Claremont Avenue then Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 21.0 | Claremont Avenue then SR-24 |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 20.0 | Telegraph Avenue |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 18.0 | College Avenue then Claremont Avenue then SR-24 |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) | 18.0 | Claremont Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 14.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 12.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 11.0 | College Avenue |
| other pairs | | 132.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 195 veh/h; Claremont Avenue 52 veh/h; Claremont Avenue then Telegraph Avenue 22 veh/h; Claremont Avenue then SR-24 21 veh/h; SR-24 19 veh/h; College Avenue then Claremont Avenue then SR-24 18 veh/h.

By origin group: South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 84; SR-24 eastbound off-ramps (arriving from Oakland and I-980) 76; Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 69; Telegraph Ave from the north (Berkeley) 38; San Pablo Ave (Emeryville and West Oakland) 34; College Ave from the north (Berkeley) 27; Claremont Ave and Tunnel Rd toward the hills 22; Telegraph Ave to the south (downtown Oakland) 17; West Oakland to the southwest (Adeline St, Market St) 15; Alcatraz Ave from the west (Emeryville side) 9.

By destination group: SR-24 westbound on-ramps (toward Oakland and I-980) 118; Telegraph Ave from the north (Berkeley) 79; South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 51; Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 49; College Ave from the north (Berkeley) 30; Telegraph Ave to the south (downtown Oakland) 25; Claremont Ave and Tunnel Rd toward the hills 23; West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) 18; Emeryville and West Oakland streets (55th to 67th Streets) 9; Shattuck Ave from the north (Berkeley) 3.


## Through cars by intent (cut-through intent view)

A through car is tallied once, under the first intent that fits it (the on-ramp on its planned route, the off-ramp it has driven, or the origin and destination groups of its trip), at the moment the through count counts it. Cars an hour over the run, the same window as the through-car figure (417 an hour).

| Intent | Basis | Cars an hour | Share |
| --- | --- | --- | --- |
| on-2853241697 | observed | 118 | 28% |
| Other on-ramps | assumed | 4 | 1% |
| off-52990846 | observed | 76 | 18% |
| Other off-ramps | assumed | 5 | 1% |
| Downtown, south and west Oakland traffic using side streets to reach Berkeley and Telegraph Ave north | assumed | 70 | 17% |
| Berkeley and Telegraph Ave north traffic using side streets to reach downtown, south and west Oakland | assumed | 21 | 5% |
| Oakland cross-town traffic (West Oakland, Broadway, Piedmont, Emeryville) using side streets near Claremont Ave and Telegraph Ave | assumed | 46 | 11% |
| Other (no intent listed) |  | 77 | 18% |

Intents listed cover 82% of through cars.


## Select-link shares: modeled vs observed (design D5: headline = freeway shares, tolerance +/-10 pp)

- Hillegass Avenue NB: 4 links (path Claremont Avenue -> Alcatraz Avenue (434 m)), 128 trips (124 completed)
- Colby Street NB: 8 links (path Claremont Avenue -> Alcatraz Avenue (680 m)), 180 trips (174 completed)
- Hillegass Avenue SB: 4 links (path Alcatraz Avenue -> Claremont Avenue (433 m)), 120 trips (112 completed)
- Colby Street SB: 8 links (path Alcatraz Avenue -> Claremont Avenue (680 m)), 168 trips (162 completed)

| Block | Side | Via | Observed | Modeled | Diff (pp) | n trips | Headline |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue NB | from | freeway | 47% | 52% | +5 | 128 | within |
| Hillegass Avenue NB | to | Benvenue Avenue | 21% (PM 33%) | 4% | -17 | 128 |  |
| Hillegass Avenue NB | to | College Avenue | 6% | 9% | +3 | 128 |  |
| Hillegass Avenue NB | to | Alcatraz Avenue WB | 27% | 31% | +4 | 128 |  |
| Colby Street NB | from | freeway | 47% | 51% | +4 | 180 | within |
| Colby Street NB | to | Alcatraz Avenue WB | 48% | 54% | +6 | 180 |  |
| Colby Street NB | to | Telegraph Avenue | 25% | 44% | +19 | 180 |  |
| Colby Street NB | to | College Avenue | 3% | 2% | -1 | 180 |  |
| Hillegass Avenue SB | from | Alcatraz Avenue WB | 46% | 31% | -15 | 120 |  |
| Hillegass Avenue SB | from | Benvenue Avenue | 26% | 3% | -23 | 120 |  |
| Hillegass Avenue SB | from | College Avenue | 16% | 14% | -2 | 120 |  |
| Hillegass Avenue SB | to | freeway | 57% (PM 68%) | 51% | -6 | 120 | within |
| Colby Street SB | from | Alcatraz Avenue EB | 43% | 27% | -16 | 168 |  |
| Colby Street SB | from | Alcatraz Avenue WB | 46% | 26% | -20 | 168 |  |
| Colby Street SB | from | Telegraph Avenue | 22% | 23% | +1 | 168 |  |
| Colby Street SB | to | freeway | 45% | 46% | +1 | 168 | within |
| Colby Street SB | to | Forest Street | 34% | 11% | -23 | 168 |  |

Headline shares within tolerance: 4 of 4. Observed column uses the PM-peak share where one is given and the period is pm_peak. 'Via' shares are the fraction of select-link trips using that street before (from) or after (to) the block; freeway = origin / destination gate with a motorway-class link attached.

## Claremont ramps: streets used before the on-ramp / after the off-ramp

Observed shares are for traffic from/to the north only. 'Modeled' is over all trips on the ramps and any visit to the street (an upper bound for streets that serve both sides). 'Modeled, side' counts only trips whose surface end lies on the side of the ramp stated in the targets file (`freewayRamp.side`), and for a street with a qualifier ("north of X") only its links on that side of X.

| Direction | Via | Observed | Modeled | n ramp trips | Modeled, side | n side trips |
| --- | --- | --- | --- | --- | --- | --- |
| onto freeway | College Avenue | 16% | 16% | 470 | 18% | 385 |
| onto freeway | Hillegass Avenue | 12% | 13% | 470 | 16% | 385 |
| onto freeway | Martin Street | 10% | 15% | 470 | 17% | 385 |
| onto freeway | Colby Street | 8% | 15% | 470 | 19% | 385 |
| onto freeway | Telegraph Avenue north of Alcatraz Avenue | 8% | 13% | 470 | 13% | 385 |
| onto freeway | Benvenue Avenue | 5% | 4% | 470 | 5% | 385 |
| from freeway | College Avenue | 10% | 9% | 502 | 9% | 485 |
| from freeway | Martin Street | 10% | 12% | 502 | 13% | 485 |
| from freeway | Colby Street | 8% | 12% | 502 | 12% | 485 |
| from freeway | Hillegass Avenue | 5% | 8% | 502 | 8% | 485 |
| from freeway | Benvenue Avenue | 3% | 4% | 502 | 4% | 485 |

## Top 15 links by delay

| Link | Street | Class | Lanes | Len (m) | End node control | Delay (veh-h) | Stopped (veh-h) | Mean stopped veh | Flow (veh/h) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1049 | Adeline Street | Secondary | 4 | 43 | signal | 4.82 | 4.14 | 4.1 | 628 |
| 3395 | Ashby Avenue | Primary | 1 | 129 | signal | 4.75 | 3.50 | 3.5 | 572 |
| 498 | Sacramento Street | Tertiary | 3 | 48 | signal | 3.62 | 2.80 | 2.8 | 673 |
| 1037 | Sacramento Street | Tertiary | 3 | 40 | signal | 3.45 | 2.51 | 2.5 | 1241 |
| 2776 | Claremont Avenue | Secondary | 2 | 161 | signal | 3.10 | 2.72 | 2.7 | 307 |
| 1051 | Adeline Street | Secondary | 4 | 50 | signal | 2.93 | 2.58 | 2.6 | 415 |
| 1666 | 52nd Street | Secondary | 4 | 39 | signal | 2.93 | 2.63 | 2.6 | 349 |
| 761 | Martin Luther King Junior Way | Secondary | 4 | 32 | signal | 2.91 | 2.35 | 2.4 | 1188 |
| 114 | San Pablo Avenue | Primary | 3 | 46 | signal | 2.91 | 2.19 | 2.2 | 481 |
| 1763 | 51st Street | Secondary | 4 | 58 | signal | 2.89 | 2.35 | 2.4 | 460 |
| 2039 | Telegraph Avenue | Secondary | 3 | 50 | signal | 2.86 | 2.07 | 2.1 | 630 |
| 2008 | Shattuck Avenue | Tertiary | 1 | 93 | signal | 2.84 | 1.94 | 1.9 | 488 |
| 1108 | Market Street | Secondary | 4 | 36 | signal | 2.84 | 2.07 | 2.1 | 1015 |
| 1662 | 52nd Street | Secondary | 4 | 53 | signal | 2.81 | 1.97 | 2.0 | 791 |
| 3447 | Claremont Avenue | Secondary | 3 | 43 | signal | 2.76 | 2.06 | 2.1 | 518 |

## Top 15 nodes by blocked time

Blocked time = lane-head seconds waiting at the stop line without permission (signal red, conflict, stop sign or no downstream space).

| Node | Streets | Control | Gate | Blocked (lane-h) | of which no downstream space | Signal plan at end (cycle: greens) |
| --- | --- | --- | --- | --- | --- | --- |
| 447 | Adeline Street / Alcatraz Avenue | signal |  | 4.10 | 0.03 | 75 s: 20/45 |
| 680 | 52nd Street / Shattuck Avenue | signal |  | 3.92 | 0.02 | 110 s: 30/28/38 |
| 446 | Market Street / Stanford Avenue | signal |  | 3.46 | 0.06 | 75 s: 32/33 |
| 1406 | Ashby Avenue / Claremont Avenue | signal |  | 3.24 | 0.07 | 75 s: 30/15/15 |
| 331 | 52nd Street / Martin Luther King Junior Way | signal |  | 3.01 | 0.02 | 75 s: 38/27 |
| 30 | 57th Street / Adeline Street / Market Street | signal |  | 2.83 | 0.03 | 75 s: 21/24/16 |
| 1069 | Claremont Avenue / Colby Street / Forest Street | signal |  | 2.72 | 0.00 | 147 s: 61/10/61 |
| 185 | Alcatraz Avenue / Sacramento Street | signal |  | 2.72 | 0.04 | 75 s: 30/35 |
| 851 | Alcatraz Avenue / Telegraph Avenue | signal |  | 2.71 | 0.03 | 75 s: 44/21 |
| 1080 | 62nd Street / Claremont Avenue / College Avenue | signal |  | 2.53 | 0.03 | 75 s: 16/29/15 |
| 37 | San Pablo Avenue / Stanford Avenue | signal |  | 2.51 | 0.01 | 75 s: 26/39 |
| 713 | 51st Street / Telegraph Avenue | signal |  | 2.16 | 0.01 | 75 s: 45/20 |
| 944 | Ashby Avenue / Shattuck Avenue | signal |  | 2.15 | 0.01 | 75 s: 42/23 |
| 501 | Alcatraz Avenue / Shattuck Avenue | signal |  | 2.13 | 0.04 | 75 s: 22/43 |
| 242 | Ashby Avenue / Martin Luther King Junior Way | signal |  | 2.11 | 0.00 | 75 s: 31/34 |

Phases of the five most blocked signals (green s: approach links with their lanes, link ids in brackets):

- node 447: 20 s: Adeline Street 4L [1049], Adeline Street 4L [1051]; 45 s: Alcatraz Avenue 2L [1048], Alcatraz Avenue 2L [1133]
- node 680: 30 s: 52nd Street 4L [1662]; 28 s: 52nd Street 4L [1666], 52nd Street 4L [1662]; 38 s: Shattuck Avenue 2L [1653], Shattuck Avenue 2L [1705]
- node 446: 32 s: Stanford Avenue 3L [941], Stanford Avenue 3L [1055]; 33 s: Market Street 4L [1108], Market Street 3L [1111]
- node 1406: 30 s: Ashby Avenue 1L [3395], Ashby Avenue 2L [3426]; 15 s: Claremont Avenue 2L [4329]; 15 s: Claremont Avenue 3L [3447]
- node 331: 38 s: Martin Luther King Junior Way 4L [704], Martin Luther King Junior Way 4L [761]; 27 s: 52nd Street 2L [758], 52nd Street 1L [760]

## Cars cleared from gridlock near and far (judged zone)

Judged zone: the study area, its bounding streets and the junctions on them, plus nodes within 200 m of it along the network (111 nodes, 329 links). A far clearing counts against the stability rule when its blocking chain (vehicles held at least 60 s by a full exit, at the 5 s snapshot before it) reaches a link in the zone.

| Buffer (m) | Near | Far | Far, chain reaches the zone | Judged |
| --- | --- | --- | --- | --- |
| 100.0 | 0 | 0 | 0 | 0 |
| 200.0 | 0 | 0 | 0 | 0 |
| 400.0 | 0 | 0 | 0 | 0 |

Entry backlog at the end of the run: 0 trips waiting at origins in the zone, of 0 in all.

| Bounding street | Links | Longest standing queue on one link (m) | Link (length m) | At (min) | Share of samples with a link full |
| --- | --- | --- | --- | --- | --- |
| Telegraph Avenue | 28 | 59.0 | 1604 (94.0) | 45.8 | 0.0 |
| Alcatraz Avenue | 14 | 52.0 | 4238 (84.0) | 22.3 | 0.0 |
| College Avenue | 6 | 59.0 | 2805 (102.0) | 44.1 | 0.0 |
| Claremont Avenue | 13 | 46.0 | 2776 (161.0) | 40.3 | 0.0 |
| CA 24 | 3 | 29.0 | 1945 (188.0) | 46.3 | 0.0 |

## Junction recovery

Policy `physical`. Node entries by cars and cyclists in the run: 520599 (settle interval 0). An admission is an entry the ordinary rule would have refused; head-seconds count the time a waiting head vehicle had the reason invoked, and the part of it in which it still could not enter. Courtesy and the yield fallback change priority only; under `physical` the conflict bypass never admits.

| Reason | Admissions per hour | Per 1,000 entries | Head-s invoked | Head-s blocked |
| --- | --- | --- | --- | --- |
| courtesy | 20.0 | 0.038 | 50 | 44 |
| yield fallback | 11.0 | 0.021 | 3 | 0 |
| conflict bypass | 0.0 | 0.000 | 0 | 0 |

Vehicles removed while held in a node by a full exit: 0 (0.0 per hour, included in the gridlock removals).

| Node | Streets | Control | Courtesy | Yield fallback | Conflict bypass | Held removals |
| --- | --- | --- | --- | --- | --- | --- |
| 1429 | Claremont Avenue / Claremont Boulevard | two_way_stop | 7 | 0 | 0 | 0 |
| 168 | 62nd Street / Market Street | two_way_stop | 0 | 5 | 0 | 0 |
| 727 | 52nd Street | uncontrolled | 4 | 0 | 0 | 0 |
| 848 | 66th Street / Shattuck Avenue | two_way_stop | 2 | 2 | 0 | 0 |
| 141 | 63rd Street / Lowell Street / Market Street | two_way_stop | 0 | 2 | 0 | 0 |
| 165 | Alcatraz Avenue / Baker Street | two_way_stop | 2 | 0 | 0 | 0 |
| 342 | 56th Street / Shattuck Avenue | two_way_stop | 1 | 1 | 0 | 0 |
| 125 | Alcatraz Avenue / Idaho Street | two_way_stop | 1 | 0 | 0 | 0 |
| 290 | 44th Street / West Street | two_way_stop | 1 | 0 | 0 | 0 |
| 395 | 65th Street / Shattuck Avenue | two_way_stop | 1 | 0 | 0 | 0 |

## Flow on key streets (veh/h per direction, study-area links of 40 m or more)

| Street | Direction of travel | Links | Median flow | Max flow |
| --- | --- | --- | --- | --- |
| Telegraph | N | 12 | 698 | 779 |
| Telegraph | S | 10 | 642 | 676 |
| College | N | 3 | 209 | 209 |
| College | S | 3 | 371 | 373 |
| Claremont | N | 6 | 269 | 396 |
| Claremont | S | 7 | 150 | 444 |
| Alcatraz | E | 6 | 367 | 418 |
| Alcatraz | W | 6 | 223 | 280 |
| Hillegass | N | 4 | 60 | 74 |
| Hillegass | S | 4 | 60 | 78 |
| Colby | N | 7 | 89 | 98 |
| Colby | S | 7 | 102 | 116 |
| Martin | E | 2 | 77 | 77 |
| Martin | W | 2 | 91 | 91 |

## Largest demand origins (offered, before scale)

| Node | Streets | Veh/h |
| --- | --- | --- |
| 602 | Grove Shafter Freeway | 2531 |
| 943 | Telegraph Avenue / Ward Street | 812 |
| 265 | Ashby Avenue | 781 |
| 1672 | Warren Freeway | 697 |
| 183 | San Pablo Avenue | 624 |
| 763 | Telegraph Avenue | 477 |
| 104 | San Pablo Avenue | 321 |
| 974 | Broadway | 314 |
| 577 | Martin Luther King Junior Way | 304 |
| 1719 | Grove Shafter Freeway | 287 |
