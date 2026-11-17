# Calibration report: rockridge am_peak scale 1 seed 1 (60 min)

Offered demand 22419 veh/h x scale 1 = 22419 veh/h. Run took 28.9 s wall clock. Flow tables use the window after a 10 min warm-up; select-link and health figures cover the whole run from an empty network.

## Stability (design D4)

| Criterion | Threshold | Value | Result |
| --- | --- | --- | --- |
| Gridlock removals | 0 | 0 | pass |
| Backlog / spawned | < 2% | 0.0% (5 of 22517) | pass |
| Arterial mean speed (run) | > 4 m/s | 9.15 m/s (last 15 min 9.19) | pass |

Overall: **STABLE**. Mean trip delay 125 s, mean trip time 372 s, completed 22731, unroutable 0.

| t (min) | vehicles in network | backlog | completed | removals | arterial speed in interval (m/s) |
| --- | --- | --- | --- | --- | --- |
| 5 | 2458 | 2 | 1974 | 0 | 9.01 |
| 10 | 2455 | 0 | 3882 | 0 | 8.85 |
| 15 | 2446 | 2 | 5741 | 0 | 9.02 |
| 20 | 2424 | 2 | 7675 | 0 | 9.08 |
| 25 | 2285 | 3 | 9643 | 0 | 9.24 |
| 30 | 2387 | 4 | 11455 | 0 | 9.14 |
| 35 | 2394 | 2 | 13380 | 0 | 9.43 |
| 40 | 2394 | 0 | 15255 | 0 | 9.46 |
| 45 | 2382 | 0 | 17103 | 0 | 9.05 |
| 50 | 2342 | 0 | 18957 | 0 | 8.99 |
| 55 | 2392 | 2 | 20856 | 0 | 9.00 |
| 60 | 2330 | 5 | 22731 | 0 | 9.58 |
## Wandering (completed car trips)

Detour ratio = distance driven (link and movement lengths) over the shortest network distance from the trip's origin to its destination. Detour against the free-flow route uses the time-shortest route with no congestion and no noise, which is what a purposeful driver without live information would follow (it differs from the shortest distance when a faster, longer road exists). A switch is a change of the remaining route while en route. Loops: the same link twice or the same node three or more times. Reversals: a link followed by its reverse within 200 m. 'Study-area vehicle-miles' are miles driven on links inside the study area; the last column is the share of them driven by trips with a detour ratio above 1.3. Guided drivers re-evaluate their route every epoch; the others keep their departure route unless it is blocked.

| Trips | n | Switches per trip | With a switch | Mean detour | Median detour | Detour > 1.3 | Detour > 2 | Mean detour vs free-flow route | Vs free-flow route > 1.3 | Loops | Reversals | Study veh-miles | Of them by detour > 1.3 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| all trips | 20979 | 0.02 | 1.8% | 1.088 | 1.051 | 4.7% | 0.0% | 1.022 | 1.7% | 0.0% | 0.2% | 2136 | 7.7% |
| gate to gate | 7167 | 0.03 | 3.1% | 1.091 | 1.066 | 3.4% | 0.0% | 1.022 | 1.7% | 0.0% | 0.1% | 468 | 8.6% |
| with a local end | 13812 | 0.01 | 1.1% | 1.086 | 1.047 | 5.4% | 0.0% | 1.022 | 1.7% | 0.0% | 0.2% | 1668 | 7.5% |
| guided drivers | 9637 | 0.04 | 3.8% | 1.088 | 1.052 | 4.7% | 0.0% | 1.022 | 1.8% | 0.0% | 0.2% | 966 | 7.9% |
| other drivers | 11342 | 0.00 | 0.1% | 1.087 | 1.051 | 4.7% | 0.0% | 1.021 | 1.7% | 0.0% | 0.2% | 1170 | 7.6% |

## Reported patterns (diagnostics; configured in the targets file under `patterns`)

(a) Trips between the surface gates on the north side of the ramps and the freeway mainline gates, and the local-street (residential and service links in the study area) vehicle-miles they drive. Share = of all completed trips' local-street vehicle-miles (351 miles). No observed counterpart exists for this quantity (the targets file has only the select-link shares above).

| Trips | n trips | Local-street veh-miles | Share of all local-street veh-miles |
| --- | --- | --- | --- |
| surface gates to the freeway | 984 | 25.1 | 7% |
| freeway to the surface gates | 1237 | 26.6 | 8% |

(b) Corridor trips: completed trips from beyond one end of the corridor's study-area extent (the bypass street and its arterial together) to beyond the other end, within a lateral limit of the corridor, by direction. 'Bypass' = at least N blocks (links) on the bypass street; 'arterial' = fewer bypass blocks and at least N on the arterial; 'other' = neither (another street, the freeway or a short use); blocks are counted on the corridor's study-area links. No observed counterpart exists for these shares. The related observed values are in the select-link table above: northbound Hillegass Ave traffic rarely ends on College Ave (6%), 21 to 33% jogs to Benvenue Ave, and southbound freeway-bound drivers on College Ave commonly arrive via Ashby Ave and Benvenue Ave and jog to Hillegass Ave.

| Bypass | Arterial | N | Direction | Corridor trips | Bypass | Arterial | Other | Mean bypass blocks |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue | College Avenue | 3 | N | 1014 | 4% | 16% | 80% | 0.2 |
| Hillegass Avenue | College Avenue | 3 | S | 1291 | 3% | 23% | 75% | 0.1 |

## Per-mode results

Offered: 22419 car veh/h; 497 bicycle flows (702/h); 2000 pedestrian flows (1340/h). Bicycle and pedestrian volumes are assumptions, not counts.

| Mode | In network | Completed | Mean time (s) | Other |
| --- | --- | --- | --- | --- |
| Car | 2330 | 22731 | 372 | |
| Bicycle | 49 | 722 | 245 | |
| Pedestrian | 177 | 1221 | 460 | mean crossing delay 7.1 s |

Vulnerable road users (surrogate indicators): pedestrian conflicts 217, bicycle conflicts 800, close passes 638, pedestrian injury severity mean 0.045 (AIS4+, 7363 supported of 7363 encounters), cyclist injury severity mean 0.064 (MAIS3+F, 2930 supported of 5420 encounters) (separate endpoints, never summed), mean vehicle speed at pedestrian encounters 2.38 m/s.


## Through cars on the counted blocks (a car is through when neither trip end is in the study area)

Observed through range = from the cars that drove the whole street (volunteer count, a lower bound) to the block volume less the cars whose trip ends along the street (an upper bound). Observed freeway-end trips = observed block volume times the observed freeway share of the street (the headline share of the targets file); these include freeway trips that end inside the study area, so they are not an expected through count. Modeled through = select-link trips with no end in the study area, per hour. Modeled freeway = select-link trips from or to a freeway node, per hour.

| Block | Observed volume (veh/h) | Observed freeway share | Observed freeway-end trips (veh/h) | Observed through range (veh/h) | Modeled through (veh/h) | In range | Modeled freeway trips (veh/h) |
| --- | --- | --- | --- | --- | --- | --- | --- |

Fitted: Colby Street NB, Colby Street SB, Hillegass Avenue NB, Hillegass Avenue SB are targets of the demand fit (`countFit.throughTargets`, calibration round 39), so these rows are no longer an independent check. The checks that stay independent are the held-out count stations, the headline freeway shares, stability and the arterial travel times.

## Intent map: through cars by where they come from and where they are going

Through = neither trip end is in the study area. Groups are the approach groups of the area config (data/areas); a node that is not a gate takes the group of the nearest surface gate (ASSUMPTION). The arterial is the one a trip would use on the shortest free-flow path with the study area's residential and service streets closed, where that path runs on a boundary street near the study area.

Model figures are the mean of 1 seed(s), per hour of the run. Basis: OBSERVED = read from the resident volunteer count of Feb 25, 2025 or its headline shares; ASSUMPTION = inferred from those numbers or chosen.

### Colby Street NB

Observed (PM): 182 cars entered at the south end, 102 drove the whole street, 164 left it at Alcatraz Ave (131 left, 32 right, 1 straight), and 47% of the block's trips came from a freeway (the headline share). ASSUMPTION: freeway-origin cars that do not end along the street are 65 veh/h (the 82 freeway-origin trips on the block, 47% of 174, times the 182 / (182 + 47) of its cars that entered at the south end rather than joining on the way), spread over the 164 exits in proportion (0.40); the other through cars come from the Telegraph Ave and south-side approaches that feed the street's south end. Ranges: low = 131 (32) x 0.47 x 0.62 (the whole-street share of exits), high = 131 (32) x 0.47.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | OBSERVED turn count x ASSUMPTION share (131 left turns x 0.40) | 52 (38 to 62) | 46 | within |
| Telegraph Ave and south-side traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | ASSUMPTION: the through left-turners (131 x 0.62 = 81) that are not off-ramp traffic | 29 (19 to 43) | 33 | within |
| SR-24 off-ramp traffic using Colby St to reach College Ave and Berkeley (right at Alcatraz Ave) | OBSERVED turn count x ASSUMPTION share (32 right turns x 0.40) | 13 (9 to 15) | 4 | below |
| Telegraph Ave and south-side traffic using Colby St to reach College Ave and Berkeley | ASSUMPTION: the through right-turners (32 x 0.62 = 20) that are not off-ramp traffic | 7 (5 to 11) | 23 | above |
| Intents listed, together | | 101 (71 to 131) | 106 | |
| Other through cars (no intent listed) | | | 1 | |

Model through cars by origin and destination group (largest 12 of 11 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 46.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 23.0 | Telegraph Avenue |
| Telegraph Ave to the south (downtown Oakland) | Telegraph Ave from the north (Berkeley) | 18.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Emeryville and West Oakland streets (55th to 67th Streets) | 7.0 | Claremont Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Ashby Ave from the west (Emeryville and I-80) | 5.0 | Claremont Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 2.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 2.0 | SR-24 |
| San Pablo Ave (Emeryville and West Oakland) | College Ave from the north (Berkeley) | 1.0 | none near the study area |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) | 1.0 | SR-24 then Telegraph Avenue then Alcatraz Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 1.0 | Telegraph Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Telegraph Ave from the north (Berkeley) | 1.0 | Telegraph Avenue |

By the arterial these cars would otherwise use: Telegraph Avenue 91 veh/h; Claremont Avenue 12 veh/h; SR-24 2 veh/h; SR-24 then Telegraph Avenue then Alcatraz Avenue 1 veh/h; none near the study area 1 veh/h.

### Hillegass Avenue NB

Observed (PM): 94 cars entered at the south end, 48 drove the whole street, 109 left it at Alcatraz Ave (43 west, 54 east, 12 straight), and 47% of the block's trips came from a freeway. ASSUMPTION: freeway-origin through cars are 40 veh/h (52 freeway-origin trips times 94 / (94 + 29)), spread over the exits in proportion (0.37); the through share of exits is 48 / 109 = 0.44.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Hillegass Ave to reach Alcatraz Ave west and Telegraph Ave north | OBSERVED turn count x ASSUMPTION share (43 left turns x 0.37) | 16 (9 to 20) | 22 | above |
| SR-24 off-ramp traffic using Hillegass Ave to reach College Ave and Berkeley | OBSERVED turn count x ASSUMPTION share (54 right turns x 0.37) | 20 (11 to 25) | 26 | above |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach Alcatraz Ave west | ASSUMPTION: through exits (43 x 0.44) that are not off-ramp traffic | 3 (0 to 10) | 3 | within |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach College Ave and Berkeley | ASSUMPTION: through exits (54 x 0.44) that are not off-ramp traffic | 4 (0 to 13) | 23 | above |
| Intents listed, together | | 43 (20 to 68) | 74 | |
| Other through cars (no intent listed) | | | 2 | |

Model through cars by origin and destination group (largest 12 of 21 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 15.0 | SR-24 |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 15.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 14.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 6.0 | SR-24 then Claremont Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | College Ave from the north (Berkeley) | 4.0 | SR-24 then Claremont Avenue then College Avenue |
| Telegraph Ave to the south (downtown Oakland) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 4.0 | Telegraph Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Alcatraz Ave from the west (Emeryville side) | 2.0 | SR-24 then Telegraph Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Shattuck Ave from the north (Berkeley) | 2.0 | SR-24 then Telegraph Avenue then Alcatraz Avenue |
| Telegraph Ave to the south (downtown Oakland) | College Ave from the north (Berkeley) | 2.0 | Telegraph Avenue |
| Berkeley hills to the northeast (Evergreen Ln, Gravatt Dr) | Emeryville and West Oakland streets (55th to 67th Streets) | 1.0 | SR-24 |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Alcatraz Ave from the west (Emeryville side) | 1.0 | College Avenue then Alcatraz Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | College Ave from the north (Berkeley) | 1.0 | College Avenue |
| other pairs | | 9.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 37 veh/h; SR-24 17 veh/h; SR-24 then Claremont Avenue 6 veh/h; SR-24 then Claremont Avenue then College Avenue 4 veh/h; SR-24 then Telegraph Avenue 3 veh/h; Claremont Avenue 2 veh/h.

### Hillegass Avenue SB

Observed (PM): 178 cars entered at the top (76 turned in from Alcatraz Ave west, 98 from the east, 4 came straight from the north), 79 drove the whole street, and 68% of the block's trips (109 veh/h) went to a freeway. ASSUMPTION: freeway-bound cars that did not join mid-street are 87 veh/h (109 x 178 / (178 + 44)), half of the 174 turn-ins; low = the whole-street share of the turn-ins (0.45), high = the freeway-bound share without the mid-street correction (0.63).

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Telegraph Ave, Alcatraz Ave west and West Berkeley traffic turning off Alcatraz Ave onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (76 turn-ins x 0.50) | 38 (34 to 48) | 15 | below |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (98 turn-ins x 0.50) | 49 (44 to 62) | 25 | below |
| Intents listed, together | | 87 (78 to 110) | 40 | |
| Other through cars (no intent listed) | | | 36 | |

Model through cars by origin and destination group (largest 12 of 12 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 21.0 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 15.0 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 13.0 | Claremont Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 6.0 | Claremont Avenue then SR-24 |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 6.0 | College Avenue then Claremont Avenue then SR-24 |
| Telegraph Ave from the north (Berkeley) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 5.0 | College Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Telegraph Ave to the south (downtown Oakland) | 3.0 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | College Ave from the north (Berkeley) | 3.0 | College Avenue |
| Ashby Ave from the west (Emeryville and I-80) | Claremont Ave and Tunnel Rd toward the hills | 1.0 | none near the study area |
| Ashby Ave from the west (Emeryville and I-80) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 1.0 | Claremont Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | West Oakland to the southwest (Adeline St, Market St) | 1.0 | Telegraph Avenue |
| San Pablo Ave (Emeryville and West Oakland) | Claremont Ave and Tunnel Rd toward the hills | 1.0 | Alcatraz Avenue then Claremont Avenue |

By the arterial these cars would otherwise use: Telegraph Avenue 40 veh/h; Claremont Avenue then SR-24 19 veh/h; College Avenue 8 veh/h; College Avenue then Claremont Avenue then SR-24 6 veh/h; Alcatraz Avenue then Claremont Avenue 1 veh/h; Claremont Avenue 1 veh/h.

### Colby Street SB

Observed (PM): 139 cars entered at the top (76 from Alcatraz Ave west, 50 from the east, 13 from the north), 39 drove the whole street, 45% of the block's trips (72 veh/h) went to a freeway and 22% came by way of Telegraph Ave. ASSUMPTION: freeway-bound cars that did not join mid-street are 46 veh/h (72 x 139 / (139 + 79)), 0.365 of the 126 turn-ins; low = the whole-street share (0.31), high = the unadjusted freeway share (0.57). The Telegraph Ave cars are the 22% x 160 = 35 of the 76 west turn-ins.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Southbound Telegraph Ave traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (35 Telegraph Ave cars x 0.365) | 13 (11 to 20) | 17 | within |
| Alcatraz Ave west, Ashby Ave and West Berkeley traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (41 other west turn-ins x 0.365) | 15 (13 to 23) | 19 | within |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (50 east turn-ins x 0.365) | 18 (15 to 29) | 12 | below |
| Intents listed, together | | 46 (39 to 72) | 48 | |
| Other through cars (no intent listed) | | | 46 | |

Model through cars by origin and destination group (largest 12 of 24 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 24.0 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 16.0 | Telegraph Avenue |
| Shattuck Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 8.0 | none near the study area |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 6.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | West Oakland to the southwest (Adeline St, Market St) | 5.0 | Telegraph Avenue |
| Alcatraz Ave from the west (Emeryville side) | SR-13 Warren Freeway (via SR-24 east) | 4.0 | SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Telegraph Ave to the south (downtown Oakland) | 4.0 | Telegraph Avenue |
| Alcatraz Ave from the west (Emeryville side) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 3.0 | SR-24 |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 3.0 | College Avenue then Claremont Avenue then SR-24 |
| Telegraph Ave from the north (Berkeley) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 3.0 | Telegraph Avenue |
| Ashby Ave from the west (Emeryville and I-80) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 2.0 | Claremont Avenue |
| Ashby Ave from the west (Emeryville and I-80) | SR-13 Warren Freeway (via SR-24 east) | 2.0 | SR-24 |
| other pairs | | 14.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 58 veh/h; none near the study area 12 veh/h; SR-24 10 veh/h; Claremont Avenue 3 veh/h; Claremont Avenue then SR-24 3 veh/h; College Avenue then Claremont Avenue then SR-24 3 veh/h.

### Study area, all residential and service streets

Model: 499 through cars per hour.

Model through cars by origin and destination group (largest 12 of 60 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 62.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 57.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 56.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 43.0 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 29.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Emeryville and West Oakland streets (55th to 67th Streets) | 19.0 | Claremont Avenue |
| Telegraph Ave to the south (downtown Oakland) | Telegraph Ave from the north (Berkeley) | 18.0 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 16.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 15.0 | SR-24 |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Ashby Ave from the west (Emeryville and I-80) | 14.0 | Claremont Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 14.0 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 13.0 | Claremont Avenue then SR-24 |
| other pairs | | 143.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 324 veh/h; Claremont Avenue 54 veh/h; SR-24 28 veh/h; none near the study area 25 veh/h; Claremont Avenue then SR-24 14 veh/h; Telegraph Avenue then Claremont Avenue 12 veh/h.

By origin group: Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 117; South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 115; SR-24 eastbound off-ramps (arriving from Oakland and I-980) 89; Telegraph Ave from the north (Berkeley) 50; Telegraph Ave to the south (downtown Oakland) 39; Claremont Ave and Tunnel Rd toward the hills 13; Shattuck Ave from the north (Berkeley) 13; West Oakland to the southwest (Adeline St, Market St) 11; Ashby Ave from the west (Emeryville and I-80) 10; College Ave from the north (Berkeley) 8.

By destination group: SR-24 westbound on-ramps (toward Oakland and I-980) 110; South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 100; Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 88; Telegraph Ave from the north (Berkeley) 80; Claremont Ave and Tunnel Rd toward the hills 23; Emeryville and West Oakland streets (55th to 67th Streets) 21; Ashby Ave from the west (Emeryville and I-80) 15; College Ave from the north (Berkeley) 15; Shattuck Ave from the north (Berkeley) 11; Telegraph Ave to the south (downtown Oakland) 10.


## Through cars by intent (cut-through intent view)

A through car is tallied once, under the first intent that fits it (the on-ramp on its planned route, the off-ramp it has driven, or the origin and destination groups of its trip), at the moment the through count counts it. Cars an hour over the run, the same window as the through-car figure (501 an hour).

| Intent | Basis | Cars an hour | Share |
| --- | --- | --- | --- |
| on-2853241697 | observed | 109 | 22% |
| Other on-ramps | assumed | 11 | 2% |
| off-52990846 | observed | 90 | 18% |
| Other off-ramps | assumed | 9 | 2% |
| Downtown, south and west Oakland traffic using side streets to reach Berkeley and Telegraph Ave north | assumed | 110 | 22% |
| Berkeley and Telegraph Ave north traffic using side streets to reach downtown, south and west Oakland | assumed | 93 | 19% |
| Oakland cross-town traffic (West Oakland, Broadway, Piedmont, Emeryville) using side streets near Claremont Ave and Telegraph Ave | assumed | 52 | 10% |
| Other (no intent listed) |  | 27 | 5% |

Intents listed cover 95% of through cars.


## Select-link shares: modeled vs observed (design D5: headline = freeway shares, tolerance +/-10 pp)

- Hillegass Avenue NB: 4 links (path Claremont Avenue -> Alcatraz Avenue (434 m)), 148 trips (141 completed)
- Colby Street NB: 8 links (path Claremont Avenue -> Alcatraz Avenue (680 m)), 193 trips (180 completed)
- Hillegass Avenue SB: 4 links (path Alcatraz Avenue -> Claremont Avenue (433 m)), 122 trips (115 completed)
- Colby Street SB: 8 links (path Alcatraz Avenue -> Claremont Avenue (680 m)), 224 trips (201 completed)

| Block | Side | Via | Observed | Modeled | Diff (pp) | n trips | Headline |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue NB | from | freeway | 47% | 53% | +6 | 148 | within |
| Hillegass Avenue NB | to | Benvenue Avenue | 21% (PM 33%) | 8% | -13 | 148 |  |
| Hillegass Avenue NB | to | College Avenue | 6% | 11% | +5 | 148 |  |
| Hillegass Avenue NB | to | Alcatraz Avenue WB | 27% | 39% | +12 | 148 |  |
| Colby Street NB | from | freeway | 47% | 45% | -2 | 193 | within |
| Colby Street NB | to | Alcatraz Avenue WB | 48% | 59% | +11 | 193 |  |
| Colby Street NB | to | Telegraph Avenue | 25% | 45% | +20 | 193 |  |
| Colby Street NB | to | College Avenue | 3% | 1% | -2 | 193 |  |
| Hillegass Avenue SB | from | Alcatraz Avenue WB | 46% | 20% | -26 | 122 |  |
| Hillegass Avenue SB | from | Benvenue Avenue | 26% | 1% | -25 | 122 |  |
| Hillegass Avenue SB | from | College Avenue | 16% | 16% | -0 | 122 |  |
| Hillegass Avenue SB | to | freeway | 57% (PM 68%) | 61% | +4 | 122 | within |
| Colby Street SB | from | Alcatraz Avenue EB | 43% | 26% | -17 | 224 |  |
| Colby Street SB | from | Alcatraz Avenue WB | 46% | 7% | -39 | 224 |  |
| Colby Street SB | from | Telegraph Avenue | 22% | 18% | -4 | 224 |  |
| Colby Street SB | to | freeway | 45% | 48% | +3 | 224 | within |
| Colby Street SB | to | Forest Street | 34% | 17% | -17 | 224 |  |

Headline shares within tolerance: 4 of 4. Observed column uses the PM-peak share where one is given and the period is pm_peak. 'Via' shares are the fraction of select-link trips using that street before (from) or after (to) the block; freeway = origin / destination gate with a motorway-class link attached.

## Claremont ramps: streets used before the on-ramp / after the off-ramp

Observed shares are for traffic from/to the north only. 'Modeled' is over all trips on the ramps and any visit to the street (an upper bound for streets that serve both sides). 'Modeled, side' counts only trips whose surface end lies on the side of the ramp stated in the targets file (`freewayRamp.side`), and for a street with a qualifier ("north of X") only its links on that side of X.

| Direction | Via | Observed | Modeled | n ramp trips | Modeled, side | n side trips |
| --- | --- | --- | --- | --- | --- | --- |
| onto freeway | College Avenue | 16% | 14% | 657 | 15% | 591 |
| onto freeway | Hillegass Avenue | 12% | 13% | 657 | 15% | 591 |
| onto freeway | Martin Street | 10% | 13% | 657 | 14% | 591 |
| onto freeway | Colby Street | 8% | 12% | 657 | 14% | 591 |
| onto freeway | Telegraph Avenue north of Alcatraz Avenue | 8% | 11% | 657 | 9% | 591 |
| onto freeway | Benvenue Avenue | 5% | 3% | 657 | 4% | 591 |
| from freeway | College Avenue | 10% | 10% | 652 | 10% | 616 |
| from freeway | Martin Street | 10% | 11% | 652 | 12% | 616 |
| from freeway | Colby Street | 8% | 10% | 652 | 11% | 616 |
| from freeway | Hillegass Avenue | 5% | 9% | 652 | 9% | 616 |
| from freeway | Benvenue Avenue | 3% | 2% | 652 | 2% | 616 |

## Top 15 links by delay

| Link | Street | Class | Lanes | Len (m) | End node control | Delay (veh-h) | Stopped (veh-h) | Mean stopped veh | Flow (veh/h) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 4175 | (unnamed) | Motorway | 2 | 142 | uncontrolled | 17.65 | 3.00 | 3.0 | 1547 |
| 460 | Sacramento Street | Tertiary | 2 | 104 | two_way_stop | 7.87 | 6.68 | 6.7 | 410 |
| 834 | Martin Luther King Junior Way | Secondary | 4 | 49 | signal | 7.14 | 5.25 | 5.3 | 1412 |
| 1049 | Adeline Street | Secondary | 4 | 43 | signal | 6.65 | 5.59 | 5.6 | 1054 |
| 3395 | Ashby Avenue | Primary | 1 | 129 | signal | 6.45 | 5.15 | 5.2 | 541 |
| 764 | Martin Luther King Junior Way | Secondary | 4 | 48 | signal | 5.98 | 4.80 | 4.8 | 1391 |
| 1051 | Adeline Street | Secondary | 4 | 50 | signal | 5.70 | 4.92 | 4.9 | 875 |
| 115 | San Pablo Avenue | Primary | 3 | 54 | signal | 5.59 | 4.46 | 4.5 | 778 |
| 4398 | Ashby Avenue | Primary | 2 | 96 | uncontrolled | 5.54 | 3.81 | 3.8 | 732 |
| 3001 | College Avenue | Tertiary | 1 | 107 | signal | 5.46 | 4.52 | 4.5 | 276 |
| 1666 | 52nd Street | Secondary | 4 | 39 | signal | 5.25 | 4.62 | 4.6 | 592 |
| 1108 | Market Street | Secondary | 4 | 36 | signal | 5.04 | 4.03 | 4.0 | 1175 |
| 755 | Market Street | Tertiary | 2 | 77 | signal | 4.88 | 4.21 | 4.2 | 365 |
| 3463 | Tunnel Road | Primary | 2 | 52 | signal | 4.72 | 3.95 | 4.0 | 785 |
| 1662 | 52nd Street | Secondary | 4 | 53 | signal | 4.70 | 3.41 | 3.4 | 1025 |

## Top 15 nodes by blocked time

Blocked time = lane-head seconds waiting at the stop line without permission (signal red, conflict, stop sign or no downstream space).

| Node | Streets | Control | Gate | Blocked (lane-h) | of which no downstream space | Signal plan at end (cycle: greens) |
| --- | --- | --- | --- | --- | --- | --- |
| 447 | Adeline Street / Alcatraz Avenue | signal |  | 4.92 | 0.11 | 75 s: 29/36 |
| 680 | 52nd Street / Shattuck Avenue | signal |  | 4.60 | 0.04 | 90 s: 18/19/37 |
| 446 | Market Street / Stanford Avenue | signal |  | 4.49 | 0.17 | 75 s: 33/32 |
| 332 | 55th Street / Martin Luther King Junior Way | signal |  | 3.45 | 0.04 | 75 s: 34/31 |
| 1406 | Ashby Avenue / Claremont Avenue | signal |  | 3.39 | 0.33 | 75 s: 30/15/15 |
| 30 | 57th Street / Adeline Street / Market Street | signal |  | 3.16 | 0.02 | 75 s: 25/15/20 |
| 37 | San Pablo Avenue / Stanford Avenue | signal |  | 3.11 | 0.02 | 75 s: 27/38 |
| 242 | Ashby Avenue / Martin Luther King Junior Way | signal |  | 2.93 | 0.00 | 75 s: 42/23 |
| 479 | Adeline Street / Martin Luther King Junior Way / Stanford Avenue | signal |  | 2.87 | 0.03 | 75 s: 46/19 |
| 613 | 52nd Street / Claremont Avenue / Telegraph Avenue | signal |  | 2.82 | 0.05 | 75 s: 43/22 |
| 185 | Alcatraz Avenue / Sacramento Street | signal |  | 2.72 | 0.06 | 75 s: 29/36 |
| 851 | Alcatraz Avenue / Telegraph Avenue | signal |  | 2.69 | 0.06 | 75 s: 45/20 |
| 713 | 51st Street / Telegraph Avenue | signal |  | 2.61 | 0.02 | 75 s: 44/21 |
| 944 | Ashby Avenue / Shattuck Avenue | signal |  | 2.41 | 0.02 | 75 s: 37/28 |
| 1069 | Claremont Avenue / Colby Street / Forest Street | signal |  | 2.32 | 0.02 | 79 s: 32/4/28 |

Phases of the five most blocked signals (green s: approach links with their lanes, link ids in brackets):

- node 447: 29 s: Adeline Street 4L [1049], Adeline Street 4L [1051]; 36 s: Alcatraz Avenue 2L [1048], Alcatraz Avenue 2L [1133]
- node 680: 18 s: 52nd Street 4L [1662]; 19 s: 52nd Street 4L [1666], 52nd Street 4L [1662]; 37 s: Shattuck Avenue 2L [1653], Shattuck Avenue 2L [1705]
- node 446: 33 s: Stanford Avenue 3L [941], Stanford Avenue 3L [1055]; 32 s: Market Street 4L [1108], Market Street 3L [1111]
- node 332: 34 s: Martin Luther King Junior Way 4L [764], Martin Luther King Junior Way 4L [834]; 31 s: 55th Street 1L [712], 55th Street 1L [715]
- node 1406: 30 s: Ashby Avenue 1L [3395], Ashby Avenue 2L [3426]; 15 s: Claremont Avenue 2L [4329]; 15 s: Claremont Avenue 3L [3447]

## Cars cleared from gridlock near and far (judged zone)

Judged zone: the study area, its bounding streets and the junctions on them, plus nodes within 200 m of it along the network (111 nodes, 329 links). A far clearing counts against the stability rule when its blocking chain (vehicles held at least 60 s by a full exit, at the 5 s snapshot before it) reaches a link in the zone.

| Buffer (m) | Near | Far | Far, chain reaches the zone | Judged |
| --- | --- | --- | --- | --- |
| 100.0 | 0 | 0 | 0 | 0 |
| 200.0 | 0 | 0 | 0 | 0 |
| 400.0 | 0 | 0 | 0 | 0 |

Entry backlog at the end of the run: 0 trips waiting at origins in the zone, of 5 in all.

| Bounding street | Links | Longest standing queue on one link (m) | Link (length m) | At (min) | Share of samples with a link full |
| --- | --- | --- | --- | --- | --- |
| Telegraph Avenue | 28 | 62.0 | 1979 (81.0) | 30.2 | 0.0 |
| Alcatraz Avenue | 14 | 52.0 | 4238 (84.0) | 33.6 | 0.007 |
| College Avenue | 6 | 78.0 | 2805 (102.0) | 12.9 | 0.0 |
| Claremont Avenue | 13 | 42.0 | 2776 (161.0) | 21.7 | 0.0 |
| CA 24 | 3 | 42.0 | 1945 (188.0) | 40.3 | 0.0 |

## Junction recovery

Policy `physical`. Node entries by cars and cyclists in the run: 698123 (settle interval 0). An admission is an entry the ordinary rule would have refused; head-seconds count the time a waiting head vehicle had the reason invoked, and the part of it in which it still could not enter. Courtesy and the yield fallback change priority only; under `physical` the conflict bypass never admits.

| Reason | Admissions per hour | Per 1,000 entries | Head-s invoked | Head-s blocked |
| --- | --- | --- | --- | --- |
| courtesy | 142.0 | 0.203 | 537 | 495 |
| yield fallback | 37.0 | 0.053 | 10 | 0 |
| conflict bypass | 0.0 | 0.000 | 10 | 10 |

Vehicles removed while held in a node by a full exit: 0 (0.0 per hour, included in the gridlock removals).

| Node | Streets | Control | Courtesy | Yield fallback | Conflict bypass | Held removals |
| --- | --- | --- | --- | --- | --- | --- |
| 1429 | Claremont Avenue / Claremont Boulevard | two_way_stop | 13 | 1 | 0 | 0 |
| 1152 | Ashby Avenue / Ashby Place / Elmwood Avenue | two_way_stop | 6 | 6 | 0 | 0 |
| 1399 | Bridge Road / Tunnel Road | two_way_stop | 8 | 3 | 0 | 0 |
| 30 | 57th Street / Adeline Street / Market Street | signal | 6 | 1 | 0 | 0 |
| 464 | 61st Street / Market Street | two_way_stop | 5 | 2 | 0 | 0 |
| 141 | 63rd Street / Lowell Street / Market Street | two_way_stop | 4 | 2 | 0 | 0 |
| 242 | Ashby Avenue / Martin Luther King Junior Way | signal | 6 | 0 | 0 | 0 |
| 1220 | Ashby Avenue / College Avenue | signal | 6 | 0 | 0 | 0 |
| 165 | Alcatraz Avenue / Baker Street | two_way_stop | 3 | 2 | 0 | 0 |
| 1391 | The Uplands / Tunnel Road | uncontrolled | 5 | 0 | 0 | 0 |

## Entry backlog by origin node at end of run (top 10)

| Node | Streets | Trips waiting | Offered veh/h (before scale) |
| --- | --- | --- | --- |
| 265 | Ashby Avenue | 5 | 1243 |

## Flow on key streets (veh/h per direction, study-area links of 40 m or more)

| Street | Direction of travel | Links | Median flow | Max flow |
| --- | --- | --- | --- | --- |
| Telegraph | N | 12 | 850 | 916 |
| Telegraph | S | 10 | 974 | 996 |
| College | N | 3 | 312 | 313 |
| College | S | 3 | 431 | 433 |
| Claremont | N | 6 | 260 | 580 |
| Claremont | S | 7 | 433 | 829 |
| Alcatraz | E | 6 | 481 | 485 |
| Alcatraz | W | 6 | 420 | 458 |
| Hillegass | N | 4 | 85 | 90 |
| Hillegass | S | 4 | 78 | 78 |
| Colby | N | 7 | 109 | 120 |
| Colby | S | 7 | 127 | 163 |
| Martin | E | 2 | 107 | 107 |
| Martin | W | 2 | 104 | 104 |

## Largest demand origins (offered, before scale)

| Node | Streets | Veh/h |
| --- | --- | --- |
| 602 | Grove Shafter Freeway | 3679 |
| 265 | Ashby Avenue | 1243 |
| 943 | Telegraph Avenue / Ward Street | 1048 |
| 183 | San Pablo Avenue | 1022 |
| 1672 | Warren Freeway | 770 |
| 1719 | Grove Shafter Freeway | 626 |
| 763 | Telegraph Avenue | 497 |
| 971 | Pleasant Valley Avenue | 487 |
| 1756 | Claremont Avenue | 459 |
| 275 | Market Street | 435 |
