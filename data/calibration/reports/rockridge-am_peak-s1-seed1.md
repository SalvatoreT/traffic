# Calibration report: rockridge am_peak scale 1 seed 1 (60 min)

Offered demand 22424 veh/h x scale 1 = 22424 veh/h. Run took 64.4 s wall clock. Flow tables use the window after a 10 min warm-up; select-link and health figures cover the whole run from an empty network.

## Stability (design D4)

| Criterion | Threshold | Value | Result |
| --- | --- | --- | --- |
| Gridlock removals | 0 | 1 | FAIL |
| Backlog / spawned | < 2% | 0.0% (4 of 22518) | pass |
| Arterial mean speed (run) | > 4 m/s | 9.12 m/s (last 15 min 9.18) | pass |

Overall: **NOT STABLE**. Mean trip delay 125 s, mean trip time 372 s, completed 22688, unroutable 0.

| t (min) | vehicles in network | backlog | completed | removals | arterial speed in interval (m/s) |
| --- | --- | --- | --- | --- | --- |
| 5 | 2443 | 4 | 1969 | 1 | 9.04 |
| 10 | 2441 | 0 | 3879 | 1 | 8.98 |
| 15 | 2426 | 2 | 5743 | 1 | 8.94 |
| 20 | 2426 | 8 | 7650 | 1 | 8.88 |
| 25 | 2346 | 2 | 9570 | 1 | 9.15 |
| 30 | 2406 | 1 | 11421 | 1 | 9.19 |
| 35 | 2375 | 2 | 13385 | 1 | 9.31 |
| 40 | 2380 | 1 | 15247 | 1 | 9.44 |
| 45 | 2383 | 1 | 17085 | 1 | 9.00 |
| 50 | 2325 | 3 | 18952 | 1 | 9.09 |
| 55 | 2432 | 3 | 20804 | 1 | 8.96 |
| 60 | 2354 | 4 | 22688 | 1 | 9.49 |
## Wandering (completed car trips)

Detour ratio = distance driven (link and movement lengths) over the shortest network distance from the trip's origin to its destination. Detour against the free-flow route uses the time-shortest route with no congestion and no noise, which is what a purposeful driver without live information would follow (it differs from the shortest distance when a faster, longer road exists). A switch is a change of the remaining route while en route. Loops: the same link twice or the same node three or more times. Reversals: a link followed by its reverse within 200 m. 'Study-area vehicle-miles' are miles driven on links inside the study area; the last column is the share of them driven by trips with a detour ratio above 1.3. Guided drivers re-evaluate their route every epoch; the others keep their departure route unless it is blocked.

| Trips | n | Switches per trip | With a switch | Mean detour | Median detour | Detour > 1.3 | Detour > 2 | Mean detour vs free-flow route | Vs free-flow route > 1.3 | Loops | Reversals | Study veh-miles | Of them by detour > 1.3 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| all trips | 20952 | 0.01 | 1.4% | 1.088 | 1.052 | 4.7% | 0.0% | 1.022 | 1.7% | 0.0% | 0.2% | 2121 | 7.9% |
| gate to gate | 7155 | 0.03 | 2.6% | 1.092 | 1.067 | 3.5% | 0.0% | 1.022 | 1.7% | 0.0% | 0.1% | 456 | 9.3% |
| with a local end | 13797 | 0.01 | 0.9% | 1.086 | 1.048 | 5.3% | 0.0% | 1.022 | 1.7% | 0.0% | 0.2% | 1665 | 7.5% |
| guided drivers | 9643 | 0.03 | 3.1% | 1.089 | 1.053 | 4.8% | 0.0% | 1.023 | 1.7% | 0.0% | 0.1% | 969 | 8.4% |
| other drivers | 11309 | 0.00 | 0.0% | 1.087 | 1.051 | 4.7% | 0.0% | 1.021 | 1.7% | 0.0% | 0.2% | 1152 | 7.5% |

## Reported patterns (diagnostics; configured in the targets file under `patterns`)

(a) Trips between the surface gates on the north side of the ramps and the freeway mainline gates, and the local-street (residential and service links in the study area) vehicle-miles they drive. Share = of all completed trips' local-street vehicle-miles (365 miles). No observed counterpart exists for this quantity (the targets file has only the select-link shares above).

| Trips | n trips | Local-street veh-miles | Share of all local-street veh-miles |
| --- | --- | --- | --- |
| surface gates to the freeway | 988 | 26.5 | 7% |
| freeway to the surface gates | 1226 | 27.4 | 8% |

(b) Corridor trips: completed trips from beyond one end of the corridor's study-area extent (the bypass street and its arterial together) to beyond the other end, within a lateral limit of the corridor, by direction. 'Bypass' = at least N blocks (links) on the bypass street; 'arterial' = fewer bypass blocks and at least N on the arterial; 'other' = neither (another street, the freeway or a short use); blocks are counted on the corridor's study-area links. No observed counterpart exists for these shares. The related observed values are in the select-link table above: northbound Hillegass Ave traffic rarely ends on College Ave (6%), 21 to 33% jogs to Benvenue Ave, and southbound freeway-bound drivers on College Ave commonly arrive via Ashby Ave and Benvenue Ave and jog to Hillegass Ave.

| Bypass | Arterial | N | Direction | Corridor trips | Bypass | Arterial | Other | Mean bypass blocks |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue | College Avenue | 3 | N | 1016 | 4% | 16% | 81% | 0.2 |
| Hillegass Avenue | College Avenue | 3 | S | 1293 | 3% | 23% | 75% | 0.2 |

## Per-mode results

Offered: 22424 car veh/h; 497 bicycle flows (702/h); 2000 pedestrian flows (1340/h). Bicycle and pedestrian volumes are assumptions, not counts.

| Mode | In network | Completed | Mean time (s) | Other |
| --- | --- | --- | --- | --- |
| Car | 2354 | 22688 | 372 | |
| Bicycle | 50 | 720 | 245 | |
| Pedestrian | 176 | 1222 | 460 | mean crossing delay 7.0 s |

Vulnerable road users (surrogate indicators): pedestrian conflicts 203, bicycle conflicts 780, close passes 682, pedestrian injury severity mean 0.045 (AIS4+, 7281 supported of 7281 encounters), cyclist injury severity mean 0.064 (MAIS3+F, 2807 supported of 5282 encounters) (separate endpoints, never summed), mean vehicle speed at pedestrian encounters 2.38 m/s.


## Through cars on the counted blocks (a car is through when neither trip end is in the study area)

Observed through range = from the cars that drove the whole street (volunteer count, a lower bound) to the block volume less the cars whose trip ends along the street (an upper bound). Observed freeway-end trips = observed block volume times the observed freeway share of the street (the headline share of the targets file); these include freeway trips that end inside the study area, so they are not an expected through count. Modeled through = select-link trips with no end in the study area, per hour. Modeled freeway = select-link trips from or to a freeway node, per hour.

| Block | Observed volume (veh/h) | Observed freeway share | Observed freeway-end trips (veh/h) | Observed through range (veh/h) | Modeled through (veh/h) | In range | Modeled freeway trips (veh/h) |
| --- | --- | --- | --- | --- | --- | --- | --- |

## Intent map: through cars by where they come from and where they are going

Through = neither trip end is in the study area. Groups are the approach groups of the area config (data/areas); a node that is not a gate takes the group of the nearest surface gate (ASSUMPTION). The arterial is the one a trip would use on the shortest free-flow path with the study area's residential and service streets closed, where that path runs on a boundary street near the study area.

Model figures are the mean of 1 seed(s), per hour of the run. Basis: OBSERVED = read from the resident volunteer count of Feb 25, 2025 or its headline shares; ASSUMPTION = inferred from those numbers or chosen.

### Colby Street NB

Observed (PM): 182 cars entered at the south end, 102 drove the whole street, 164 left it at Alcatraz Ave (131 left, 32 right, 1 straight), and 47% of the block's trips came from a freeway (the headline share). ASSUMPTION: freeway-origin cars that do not end along the street are 65 veh/h (the 82 freeway-origin trips on the block, 47% of 174, times the 182 / (182 + 47) of its cars that entered at the south end rather than joining on the way), spread over the 164 exits in proportion (0.40); the other through cars come from the Telegraph Ave and south-side approaches that feed the street's south end. Ranges: low = 131 (32) x 0.47 x 0.62 (the whole-street share of exits), high = 131 (32) x 0.47.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | OBSERVED turn count x ASSUMPTION share (131 left turns x 0.40) | 52 (38 to 62) | 46 | within |
| Telegraph Ave and south-side traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | ASSUMPTION: the through left-turners (131 x 0.62 = 81) that are not off-ramp traffic | 29 (19 to 43) | 32 | within |
| SR-24 off-ramp traffic using Colby St to reach College Ave and Berkeley (right at Alcatraz Ave) | OBSERVED turn count x ASSUMPTION share (32 right turns x 0.40) | 13 (9 to 15) | 3 | below |
| Telegraph Ave and south-side traffic using Colby St to reach College Ave and Berkeley | ASSUMPTION: the through right-turners (32 x 0.62 = 20) that are not off-ramp traffic | 7 (5 to 11) | 17 | above |
| Intents listed, together | | 101 (71 to 131) | 98 | |
| Other through cars (no intent listed) | | | 1 | |

Model through cars by origin and destination group (largest 12 of 11 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 46.0 | Telegraph Avenue |
| Telegraph Ave to the south (downtown Oakland) | Telegraph Ave from the north (Berkeley) | 18.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 17.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Emeryville and West Oakland streets (55th to 67th Streets) | 6.0 | Claremont Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Ashby Ave from the west (Emeryville and I-80) | 4.0 | Claremont Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) | 2.0 | SR-24 then Telegraph Avenue then Alcatraz Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 2.0 | SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Emeryville and West Oakland streets (55th to 67th Streets) | 1.0 | Claremont Avenue then Alcatraz Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 1.0 | Telegraph Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Telegraph Ave from the north (Berkeley) | 1.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 1.0 | Telegraph Avenue |

By the arterial these cars would otherwise use: Telegraph Avenue 84 veh/h; Claremont Avenue 10 veh/h; SR-24 2 veh/h; SR-24 then Telegraph Avenue then Alcatraz Avenue 2 veh/h; Claremont Avenue then Alcatraz Avenue 1 veh/h.

### Hillegass Avenue NB

Observed (PM): 94 cars entered at the south end, 48 drove the whole street, 109 left it at Alcatraz Ave (43 west, 54 east, 12 straight), and 47% of the block's trips came from a freeway. ASSUMPTION: freeway-origin through cars are 40 veh/h (52 freeway-origin trips times 94 / (94 + 29)), spread over the exits in proportion (0.37); the through share of exits is 48 / 109 = 0.44.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Hillegass Ave to reach Alcatraz Ave west and Telegraph Ave north | OBSERVED turn count x ASSUMPTION share (43 left turns x 0.37) | 16 (9 to 20) | 21 | above |
| SR-24 off-ramp traffic using Hillegass Ave to reach College Ave and Berkeley | OBSERVED turn count x ASSUMPTION share (54 right turns x 0.37) | 20 (11 to 25) | 25 | within |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach Alcatraz Ave west | ASSUMPTION: through exits (43 x 0.44) that are not off-ramp traffic | 3 (0 to 10) | 3 | within |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach College Ave and Berkeley | ASSUMPTION: through exits (54 x 0.44) that are not off-ramp traffic | 4 (0 to 13) | 20 | above |
| Intents listed, together | | 43 (20 to 68) | 69 | |
| Other through cars (no intent listed) | | | 4 | |

Model through cars by origin and destination group (largest 12 of 23 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 15.0 | SR-24 |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 14.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 11.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 5.0 | SR-24 then Claremont Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | College Ave from the north (Berkeley) | 4.0 | SR-24 then Claremont Avenue then College Avenue |
| Telegraph Ave to the south (downtown Oakland) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 3.0 | Telegraph Avenue |
| SR-13 Warren Freeway (via SR-24 east) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 2.0 | Claremont Avenue then Alcatraz Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Alcatraz Ave from the west (Emeryville side) | 2.0 | SR-24 then Telegraph Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Shattuck Ave from the north (Berkeley) | 2.0 | SR-24 then Telegraph Avenue then Alcatraz Avenue |
| Telegraph Ave to the south (downtown Oakland) | College Ave from the north (Berkeley) | 2.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | San Pablo Ave (Emeryville and West Oakland) | 1.0 | College Avenue then Alcatraz Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Alcatraz Ave from the west (Emeryville side) | 1.0 | College Avenue then Alcatraz Avenue |
| other pairs | | 11.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 31 veh/h; SR-24 16 veh/h; SR-24 then Claremont Avenue 5 veh/h; SR-24 then Claremont Avenue then College Avenue 4 veh/h; Claremont Avenue 3 veh/h; Claremont Avenue then Alcatraz Avenue 3 veh/h.

### Hillegass Avenue SB

Observed (PM): 178 cars entered at the top (76 turned in from Alcatraz Ave west, 98 from the east, 4 came straight from the north), 79 drove the whole street, and 68% of the block's trips (109 veh/h) went to a freeway. ASSUMPTION: freeway-bound cars that did not join mid-street are 87 veh/h (109 x 178 / (178 + 44)), half of the 174 turn-ins; low = the whole-street share of the turn-ins (0.45), high = the freeway-bound share without the mid-street correction (0.63).

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Telegraph Ave, Alcatraz Ave west and West Berkeley traffic turning off Alcatraz Ave onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (76 turn-ins x 0.50) | 38 (34 to 48) | 14 | below |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (98 turn-ins x 0.50) | 49 (44 to 62) | 30 | below |
| Intents listed, together | | 87 (78 to 110) | 44 | |
| Other through cars (no intent listed) | | | 41 | |

Model through cars by origin and destination group (largest 12 of 12 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 26.0 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 13.0 | Claremont Avenue then SR-24 |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 13.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 11.0 | Claremont Avenue then SR-24 |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 6.0 | College Avenue then Claremont Avenue then SR-24 |
| Telegraph Ave from the north (Berkeley) | College Ave from the north (Berkeley) | 5.0 | College Avenue |
| Telegraph Ave from the north (Berkeley) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 5.0 | College Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Telegraph Ave to the south (downtown Oakland) | 2.0 | Telegraph Avenue |
| Ashby Ave from the west (Emeryville and I-80) | Claremont Ave and Tunnel Rd toward the hills | 1.0 | none near the study area |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Emeryville and West Oakland streets (55th to 67th Streets) | 1.0 | Claremont Avenue then Alcatraz Avenue |
| San Pablo Ave (Emeryville and West Oakland) | Claremont Ave and Tunnel Rd toward the hills | 1.0 | Alcatraz Avenue then Claremont Avenue |
| Shattuck Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 1.0 | none near the study area |

By the arterial these cars would otherwise use: Telegraph Avenue 41 veh/h; Claremont Avenue then SR-24 24 veh/h; College Avenue 10 veh/h; College Avenue then Claremont Avenue then SR-24 6 veh/h; none near the study area 2 veh/h; Alcatraz Avenue then Claremont Avenue 1 veh/h.

### Colby Street SB

Observed (PM): 139 cars entered at the top (76 from Alcatraz Ave west, 50 from the east, 13 from the north), 39 drove the whole street, 45% of the block's trips (72 veh/h) went to a freeway and 22% came by way of Telegraph Ave. ASSUMPTION: freeway-bound cars that did not join mid-street are 46 veh/h (72 x 139 / (139 + 79)), 0.365 of the 126 turn-ins; low = the whole-street share (0.31), high = the unadjusted freeway share (0.57). The Telegraph Ave cars are the 22% x 160 = 35 of the 76 west turn-ins.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Southbound Telegraph Ave traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (35 Telegraph Ave cars x 0.365) | 13 (11 to 20) | 16 | within |
| Alcatraz Ave west, Ashby Ave and West Berkeley traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (41 other west turn-ins x 0.365) | 15 (13 to 23) | 17 | within |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (50 east turn-ins x 0.365) | 18 (15 to 29) | 15 | within |
| Intents listed, together | | 46 (39 to 72) | 48 | |
| Other through cars (no intent listed) | | | 51 | |

Model through cars by origin and destination group (largest 12 of 23 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 31.0 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 15.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 9.0 | Telegraph Avenue |
| Shattuck Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 7.0 | none near the study area |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | West Oakland to the southwest (Adeline St, Market St) | 5.0 | Telegraph Avenue |
| Alcatraz Ave from the west (Emeryville side) | SR-13 Warren Freeway (via SR-24 east) | 4.0 | SR-24 |
| Alcatraz Ave from the west (Emeryville side) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 3.0 | SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 3.0 | Alcatraz Avenue then Telegraph Avenue |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 3.0 | College Avenue then Claremont Avenue then SR-24 |
| Ashby Ave from the west (Emeryville and I-80) | SR-13 Warren Freeway (via SR-24 east) | 2.0 | SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Telegraph Ave to the south (downtown Oakland) | 2.0 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 2.0 | Claremont Avenue then SR-24 |
| other pairs | | 13.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 64 veh/h; SR-24 10 veh/h; none near the study area 10 veh/h; Alcatraz Avenue then Telegraph Avenue 3 veh/h; Claremont Avenue 3 veh/h; Claremont Avenue then SR-24 3 veh/h.

### Study area, all residential and service streets

Model: 518 through cars per hour.

Model through cars by origin and destination group (largest 12 of 66 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 67.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 57.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 56.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 50.0 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 29.0 | Telegraph Avenue |
| Telegraph Ave to the south (downtown Oakland) | Telegraph Ave from the north (Berkeley) | 18.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Emeryville and West Oakland streets (55th to 67th Streets) | 16.0 | Claremont Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 15.0 | SR-24 |
| Telegraph Ave from the north (Berkeley) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 15.0 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 13.0 | Claremont Avenue then SR-24 |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Ashby Ave from the west (Emeryville and I-80) | 13.0 | Claremont Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 13.0 | Telegraph Avenue |
| other pairs | | 156.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 340 veh/h; Claremont Avenue 50 veh/h; SR-24 26 veh/h; none near the study area 22 veh/h; Claremont Avenue then SR-24 14 veh/h; Alcatraz Avenue then College Avenue 9 veh/h.

By origin group: Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 139; South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 108; SR-24 eastbound off-ramps (arriving from Oakland and I-980) 89; Telegraph Ave from the north (Berkeley) 52; Telegraph Ave to the south (downtown Oakland) 40; Claremont Ave and Tunnel Rd toward the hills 13; Shattuck Ave from the north (Berkeley) 12; West Oakland to the southwest (Adeline St, Market St) 12; Emeryville and West Oakland streets (55th to 67th Streets) 9; Alcatraz Ave from the west (Emeryville side) 8.

By destination group: SR-24 westbound on-ramps (toward Oakland and I-980) 114; South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 113; Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 85; Telegraph Ave from the north (Berkeley) 83; Claremont Ave and Tunnel Rd toward the hills 25; College Ave from the north (Berkeley) 19; Emeryville and West Oakland streets (55th to 67th Streets) 19; Ashby Ave from the west (Emeryville and I-80) 14; Shattuck Ave from the north (Berkeley) 10; Telegraph Ave to the south (downtown Oakland) 8.


## Through cars by intent (cut-through intent view)

A through car is tallied once, under the first intent that fits it (the on-ramp on its planned route, the off-ramp it has driven, or the origin and destination groups of its trip), at the moment the through count counts it. Cars an hour over the run, the same window as the through-car figure (521 an hour).

| Intent | Basis | Cars an hour | Share |
| --- | --- | --- | --- |
| on-2853241697 | observed | 114 | 22% |
| Other on-ramps | assumed | 12 | 2% |
| off-52990846 | observed | 90 | 17% |
| Other off-ramps | assumed | 10 | 2% |
| Downtown, south and west Oakland traffic using side streets to reach Berkeley and Telegraph Ave north | assumed | 105 | 20% |
| Berkeley and Telegraph Ave north traffic using side streets to reach downtown, south and west Oakland | assumed | 97 | 19% |
| Oakland cross-town traffic (West Oakland, Broadway, Piedmont, Emeryville) using side streets near Claremont Ave and Telegraph Ave | assumed | 52 | 10% |
| Other (no intent listed) |  | 41 | 8% |

Intents listed cover 92% of through cars.


## Select-link shares: modeled vs observed (design D5: headline = freeway shares, tolerance +/-10 pp)

- Hillegass Avenue NB: 4 links (path Claremont Avenue -> Alcatraz Avenue (434 m)), 144 trips (136 completed)
- Colby Street NB: 8 links (path Claremont Avenue -> Alcatraz Avenue (680 m)), 189 trips (174 completed)
- Hillegass Avenue SB: 4 links (path Alcatraz Avenue -> Claremont Avenue (433 m)), 131 trips (127 completed)
- Colby Street SB: 8 links (path Alcatraz Avenue -> Claremont Avenue (680 m)), 240 trips (229 completed)

| Block | Side | Via | Observed | Modeled | Diff (pp) | n trips | Headline |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue NB | from | freeway | 47% | 53% | +6 | 144 | within |
| Hillegass Avenue NB | to | Benvenue Avenue | 21% (PM 33%) | 7% | -14 | 144 |  |
| Hillegass Avenue NB | to | College Avenue | 6% | 12% | +6 | 144 |  |
| Hillegass Avenue NB | to | Alcatraz Avenue WB | 27% | 37% | +10 | 144 |  |
| Colby Street NB | from | freeway | 47% | 48% | +1 | 189 | within |
| Colby Street NB | to | Alcatraz Avenue WB | 48% | 58% | +10 | 189 |  |
| Colby Street NB | to | Telegraph Avenue | 25% | 43% | +18 | 189 |  |
| Colby Street NB | to | College Avenue | 3% | 1% | -2 | 189 |  |
| Hillegass Avenue SB | from | Alcatraz Avenue WB | 46% | 21% | -25 | 131 |  |
| Hillegass Avenue SB | from | Benvenue Avenue | 26% | 2% | -24 | 131 |  |
| Hillegass Avenue SB | from | College Avenue | 16% | 16% | +0 | 131 |  |
| Hillegass Avenue SB | to | freeway | 57% (PM 68%) | 57% | +0 | 131 | within |
| Colby Street SB | from | Alcatraz Avenue EB | 43% | 21% | -22 | 240 |  |
| Colby Street SB | from | Alcatraz Avenue WB | 46% | 7% | -39 | 240 |  |
| Colby Street SB | from | Telegraph Avenue | 22% | 18% | -5 | 240 |  |
| Colby Street SB | to | freeway | 45% | 48% | +2 | 240 | within |
| Colby Street SB | to | Forest Street | 34% | 15% | -19 | 240 |  |

Headline shares within tolerance: 4 of 4. Observed column uses the PM-peak share where one is given and the period is pm_peak. 'Via' shares are the fraction of select-link trips using that street before (from) or after (to) the block; freeway = origin / destination gate with a motorway-class link attached.

## Claremont ramps: streets used before the on-ramp / after the off-ramp

Observed shares are for traffic from/to the north only. 'Modeled' is over all trips on the ramps and any visit to the street (an upper bound for streets that serve both sides). 'Modeled, side' counts only trips whose surface end lies on the side of the ramp stated in the targets file (`freewayRamp.side`), and for a street with a qualifier ("north of X") only its links on that side of X.

| Direction | Via | Observed | Modeled | n ramp trips | Modeled, side | n side trips |
| --- | --- | --- | --- | --- | --- | --- |
| onto freeway | College Avenue | 16% | 13% | 640 | 14% | 583 |
| onto freeway | Hillegass Avenue | 12% | 14% | 640 | 15% | 583 |
| onto freeway | Martin Street | 10% | 13% | 640 | 14% | 583 |
| onto freeway | Colby Street | 8% | 13% | 640 | 15% | 583 |
| onto freeway | Telegraph Avenue north of Alcatraz Avenue | 8% | 11% | 640 | 9% | 583 |
| onto freeway | Benvenue Avenue | 5% | 4% | 640 | 4% | 583 |
| from freeway | College Avenue | 10% | 10% | 652 | 10% | 616 |
| from freeway | Martin Street | 10% | 12% | 652 | 12% | 616 |
| from freeway | Colby Street | 8% | 10% | 652 | 11% | 616 |
| from freeway | Hillegass Avenue | 5% | 8% | 652 | 8% | 616 |
| from freeway | Benvenue Avenue | 3% | 2% | 652 | 2% | 616 |

## Top 15 links by delay

| Link | Street | Class | Lanes | Len (m) | End node control | Delay (veh-h) | Stopped (veh-h) | Mean stopped veh | Flow (veh/h) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 4175 | (unnamed) | Motorway | 2 | 142 | uncontrolled | 19.27 | 3.44 | 3.4 | 1525 |
| 460 | Sacramento Street | Tertiary | 2 | 104 | two_way_stop | 7.74 | 6.49 | 6.5 | 407 |
| 4398 | Ashby Avenue | Primary | 2 | 96 | uncontrolled | 7.37 | 5.12 | 5.1 | 691 |
| 834 | Martin Luther King Junior Way | Secondary | 4 | 49 | signal | 6.93 | 5.04 | 5.0 | 1428 |
| 1049 | Adeline Street | Secondary | 4 | 43 | signal | 6.73 | 5.65 | 5.6 | 1055 |
| 3395 | Ashby Avenue | Primary | 1 | 129 | signal | 6.59 | 5.25 | 5.2 | 527 |
| 1666 | 52nd Street | Secondary | 4 | 39 | signal | 6.01 | 5.18 | 5.2 | 743 |
| 1051 | Adeline Street | Secondary | 4 | 50 | signal | 5.67 | 4.92 | 4.9 | 876 |
| 1108 | Market Street | Secondary | 4 | 36 | signal | 5.66 | 4.54 | 4.5 | 1132 |
| 3001 | College Avenue | Tertiary | 1 | 107 | signal | 5.31 | 4.27 | 4.3 | 323 |
| 764 | Martin Luther King Junior Way | Secondary | 4 | 48 | signal | 5.26 | 4.21 | 4.2 | 1433 |
| 115 | San Pablo Avenue | Primary | 3 | 54 | signal | 5.02 | 4.00 | 4.0 | 715 |
| 1662 | 52nd Street | Secondary | 4 | 53 | signal | 4.76 | 3.42 | 3.4 | 1061 |
| 1630 | Telegraph Avenue | Secondary | 3 | 36 | signal | 4.75 | 4.03 | 4.0 | 812 |
| 755 | Market Street | Tertiary | 2 | 77 | signal | 4.72 | 3.91 | 3.9 | 451 |

## Top 15 nodes by blocked time

Blocked time = lane-head seconds waiting at the stop line without permission (signal red, conflict, stop sign or no downstream space).

| Node | Streets | Control | Gate | Blocked (lane-h) | of which no downstream space | Signal plan at end (cycle: greens) |
| --- | --- | --- | --- | --- | --- | --- |
| 447 | Adeline Street / Alcatraz Avenue | signal |  | 4.93 | 0.08 | 75 s: 28/37 |
| 680 | 52nd Street / Shattuck Avenue | signal |  | 4.53 | 0.04 | 90 s: 18/19/37 |
| 446 | Market Street / Stanford Avenue | signal |  | 4.43 | 0.18 | 75 s: 34/31 |
| 1406 | Ashby Avenue / Claremont Avenue | signal |  | 3.28 | 0.26 | 75 s: 30/15/15 |
| 332 | 55th Street / Martin Luther King Junior Way | signal |  | 3.25 | 0.05 | 75 s: 40/25 |
| 30 | 57th Street / Adeline Street / Market Street | signal |  | 3.11 | 0.02 | 75 s: 27/18/15 |
| 479 | Adeline Street / Martin Luther King Junior Way / Stanford Avenue | signal |  | 3.05 | 0.02 | 75 s: 45/20 |
| 37 | San Pablo Avenue / Stanford Avenue | signal |  | 3.03 | 0.03 | 75 s: 24/41 |
| 242 | Ashby Avenue / Martin Luther King Junior Way | signal |  | 2.94 | 0.01 | 75 s: 41/24 |
| 185 | Alcatraz Avenue / Sacramento Street | signal |  | 2.79 | 0.05 | 75 s: 30/35 |
| 851 | Alcatraz Avenue / Telegraph Avenue | signal |  | 2.63 | 0.04 | 75 s: 46/19 |
| 613 | 52nd Street / Claremont Avenue / Telegraph Avenue | signal |  | 2.63 | 0.04 | 75 s: 42/23 |
| 331 | 52nd Street / Martin Luther King Junior Way | signal |  | 2.55 | 0.02 | 75 s: 46/19 |
| 713 | 51st Street / Telegraph Avenue | signal |  | 2.55 | 0.02 | 75 s: 43/22 |
| 944 | Ashby Avenue / Shattuck Avenue | signal |  | 2.34 | 0.01 | 75 s: 37/28 |

Phases of the five most blocked signals (green s: approach links with their lanes, link ids in brackets):

- node 447: 28 s: Adeline Street 4L [1049], Adeline Street 4L [1051]; 37 s: Alcatraz Avenue 2L [1048], Alcatraz Avenue 2L [1133]
- node 680: 18 s: 52nd Street 4L [1662]; 19 s: 52nd Street 4L [1666], 52nd Street 4L [1662]; 37 s: Shattuck Avenue 2L [1653], Shattuck Avenue 2L [1705]
- node 446: 34 s: Stanford Avenue 3L [941], Stanford Avenue 3L [1055]; 31 s: Market Street 4L [1108], Market Street 3L [1111]
- node 1406: 30 s: Ashby Avenue 1L [3395], Ashby Avenue 2L [3426]; 15 s: Claremont Avenue 2L [4329]; 15 s: Claremont Avenue 3L [3447]
- node 332: 40 s: Martin Luther King Junior Way 4L [764], Martin Luther King Junior Way 4L [834]; 25 s: 55th Street 1L [712], 55th Street 1L [715]

## Gridlock removals by link (top 10)

| Link | Street | End node | Control | Removals | First at (min) |
| --- | --- | --- | --- | --- | --- |
| 4329 | Claremont Avenue | Ashby Avenue / Claremont Avenue | signal | 1 | 2.2 |

## Cars cleared from gridlock near and far (judged zone)

Judged zone: the study area, its bounding streets and the junctions on them, plus nodes within 200 m of it along the network (111 nodes, 329 links). A far clearing counts against the stability rule when its blocking chain (vehicles held at least 60 s by a full exit, at the 5 s snapshot before it) reaches a link in the zone.

| Buffer (m) | Near | Far | Far, chain reaches the zone | Judged |
| --- | --- | --- | --- | --- |
| 100.0 | 0 | 1 | 0 | 0 |
| 200.0 | 0 | 1 | 0 | 0 |
| 400.0 | 0 | 1 | 0 | 0 |

| Far node | Streets | Distance from the study area (m) | Cleared | Chain reaches the zone |
| --- | --- | --- | --- | --- |
| 1406 | Ashby Avenue / Claremont Avenue | 1020.0 | 1 | 0 |

Entry backlog at the end of the run: 0 trips waiting at origins in the zone, of 4 in all.

| Bounding street | Links | Longest standing queue on one link (m) | Link (length m) | At (min) | Share of samples with a link full |
| --- | --- | --- | --- | --- | --- |
| Telegraph Avenue | 28 | 62.0 | 1979 (81.0) | 30.2 | 0.0 |
| Alcatraz Avenue | 14 | 59.0 | 4188 (143.0) | 13.6 | 0.017 |
| College Avenue | 6 | 59.0 | 2805 (102.0) | 36.6 | 0.0 |
| Claremont Avenue | 13 | 49.0 | 2776 (161.0) | 54.6 | 0.0 |
| CA 24 | 3 | 36.0 | 1945 (188.0) | 13.9 | 0.0 |

## Junction recovery

Policy `physical`. Node entries by cars and cyclists in the run: 699079 (settle interval 0). An admission is an entry the ordinary rule would have refused; head-seconds count the time a waiting head vehicle had the reason invoked, and the part of it in which it still could not enter. Courtesy and the yield fallback change priority only; under `physical` the conflict bypass never admits.

| Reason | Admissions per hour | Per 1,000 entries | Head-s invoked | Head-s blocked |
| --- | --- | --- | --- | --- |
| courtesy | 131.0 | 0.187 | 391 | 348 |
| yield fallback | 48.0 | 0.069 | 13 | 0 |
| conflict bypass | 0.0 | 0.000 | 4 | 4 |

Vehicles removed while held in a node by a full exit: 0 (0.0 per hour, included in the gridlock removals).

| Node | Streets | Control | Courtesy | Yield fallback | Conflict bypass | Held removals |
| --- | --- | --- | --- | --- | --- | --- |
| 1429 | Claremont Avenue / Claremont Boulevard | two_way_stop | 19 | 1 | 0 | 0 |
| 1425 | Ashby Avenue | uncontrolled | 9 | 1 | 0 | 0 |
| 147 | 59th Street / Grace Avenue / Los Angeles Street | two_way_stop | 6 | 2 | 0 | 0 |
| 165 | Alcatraz Avenue / Baker Street | two_way_stop | 4 | 4 | 0 | 0 |
| 1152 | Ashby Avenue / Ashby Place / Elmwood Avenue | two_way_stop | 2 | 5 | 0 | 0 |
| 1220 | Ashby Avenue / College Avenue | signal | 7 | 0 | 0 | 0 |
| 30 | 57th Street / Adeline Street / Market Street | signal | 5 | 1 | 0 | 0 |
| 168 | 62nd Street / Market Street | two_way_stop | 1 | 5 | 0 | 0 |
| 501 | Alcatraz Avenue / Shattuck Avenue | signal | 6 | 0 | 0 | 0 |
| 766 | 57th Street / Shattuck Avenue | two_way_stop | 2 | 4 | 0 | 0 |

## Entry backlog by origin node at end of run (top 10)

| Node | Streets | Trips waiting | Offered veh/h (before scale) |
| --- | --- | --- | --- |
| 265 | Ashby Avenue | 3 | 1243 |
| 395 | 65th Street / Shattuck Avenue | 1 | 7 |

## Flow on key streets (veh/h per direction, study-area links of 40 m or more)

| Street | Direction of travel | Links | Median flow | Max flow |
| --- | --- | --- | --- | --- |
| Telegraph | N | 12 | 876 | 923 |
| Telegraph | S | 10 | 916 | 956 |
| College | N | 3 | 298 | 298 |
| College | S | 3 | 421 | 422 |
| Claremont | N | 6 | 269 | 572 |
| Claremont | S | 7 | 412 | 818 |
| Alcatraz | E | 6 | 462 | 474 |
| Alcatraz | W | 6 | 391 | 432 |
| Hillegass | N | 4 | 76 | 89 |
| Hillegass | S | 4 | 78 | 82 |
| Colby | N | 7 | 106 | 115 |
| Colby | S | 7 | 140 | 180 |
| Martin | E | 2 | 108 | 108 |
| Martin | W | 2 | 103 | 103 |

## Largest demand origins (offered, before scale)

| Node | Streets | Veh/h |
| --- | --- | --- |
| 602 | Grove Shafter Freeway | 3679 |
| 265 | Ashby Avenue | 1243 |
| 943 | Telegraph Avenue / Ward Street | 1048 |
| 183 | San Pablo Avenue | 1022 |
| 1672 | Warren Freeway | 771 |
| 1719 | Grove Shafter Freeway | 626 |
| 763 | Telegraph Avenue | 497 |
| 971 | Pleasant Valley Avenue | 487 |
| 1756 | Claremont Avenue | 459 |
| 275 | Market Street | 435 |
