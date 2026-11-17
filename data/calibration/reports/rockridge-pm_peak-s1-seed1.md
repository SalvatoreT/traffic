# Calibration report: rockridge pm_peak scale 1 seed 1 (60 min)

Offered demand 26349 veh/h x scale 1 = 26349 veh/h. Run took 35.6 s wall clock. Flow tables use the window after a 10 min warm-up; select-link and health figures cover the whole run from an empty network.

## Stability (design D4)

| Criterion | Threshold | Value | Result |
| --- | --- | --- | --- |
| Gridlock removals | 0 | 2 | FAIL |
| Backlog / spawned | < 2% | 0.9% (232 of 26298) | pass |
| Arterial mean speed (run) | > 4 m/s | 8.02 m/s (last 15 min 7.52) | pass |

Overall: **NOT STABLE**. Mean trip delay 176 s, mean trip time 429 s, completed 25963, unroutable 0.

| t (min) | vehicles in network | backlog | completed | removals | arterial speed in interval (m/s) |
| --- | --- | --- | --- | --- | --- |
| 5 | 3027 | 4 | 2216 | 0 | 8.57 |
| 10 | 3052 | 12 | 4382 | 0 | 8.39 |
| 15 | 3104 | 22 | 6584 | 0 | 8.36 |
| 20 | 3062 | 10 | 8828 | 0 | 8.42 |
| 25 | 3102 | 29 | 11002 | 0 | 8.34 |
| 30 | 3301 | 54 | 13040 | 0 | 8.04 |
| 35 | 3178 | 96 | 15299 | 0 | 7.92 |
| 40 | 3235 | 117 | 17428 | 0 | 7.94 |
| 45 | 3263 | 149 | 19550 | 0 | 7.87 |
| 50 | 3400 | 162 | 21617 | 0 | 7.44 |
| 55 | 3529 | 200 | 23741 | 1 | 7.58 |
| 60 | 3425 | 232 | 25963 | 2 | 7.56 |
## Wandering (completed car trips)

Detour ratio = distance driven (link and movement lengths) over the shortest network distance from the trip's origin to its destination. Detour against the free-flow route uses the time-shortest route with no congestion and no noise, which is what a purposeful driver without live information would follow (it differs from the shortest distance when a faster, longer road exists). A switch is a change of the remaining route while en route. Loops: the same link twice or the same node three or more times. Reversals: a link followed by its reverse within 200 m. 'Study-area vehicle-miles' are miles driven on links inside the study area; the last column is the share of them driven by trips with a detour ratio above 1.3. Guided drivers re-evaluate their route every epoch; the others keep their departure route unless it is blocked.

| Trips | n | Switches per trip | With a switch | Mean detour | Median detour | Detour > 1.3 | Detour > 2 | Mean detour vs free-flow route | Vs free-flow route > 1.3 | Loops | Reversals | Study veh-miles | Of them by detour > 1.3 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| all trips | 23760 | 0.04 | 3.5% | 1.093 | 1.056 | 5.3% | 0.1% | 1.035 | 3.0% | 0.0% | 0.3% | 2505 | 8.3% |
| gate to gate | 8514 | 0.06 | 5.5% | 1.097 | 1.070 | 5.0% | 0.0% | 1.037 | 2.9% | 0.0% | 0.4% | 588 | 14.4% |
| with a local end | 15246 | 0.02 | 2.3% | 1.091 | 1.050 | 5.5% | 0.1% | 1.034 | 3.0% | 0.0% | 0.3% | 1916 | 6.4% |
| guided drivers | 11013 | 0.08 | 7.2% | 1.095 | 1.058 | 5.6% | 0.1% | 1.038 | 3.1% | 0.0% | 0.3% | 1180 | 8.6% |
| other drivers | 12747 | 0.00 | 0.3% | 1.090 | 1.054 | 5.0% | 0.1% | 1.033 | 2.8% | 0.0% | 0.4% | 1325 | 8.0% |

## Reported patterns (diagnostics; configured in the targets file under `patterns`)

(a) Trips between the surface gates on the north side of the ramps and the freeway mainline gates, and the local-street (residential and service links in the study area) vehicle-miles they drive. Share = of all completed trips' local-street vehicle-miles (489 miles). No observed counterpart exists for this quantity (the targets file has only the select-link shares above).

| Trips | n trips | Local-street veh-miles | Share of all local-street veh-miles |
| --- | --- | --- | --- |
| surface gates to the freeway | 1677 | 43.3 | 9% |
| freeway to the surface gates | 1349 | 30.2 | 6% |

(b) Corridor trips: completed trips from beyond one end of the corridor's study-area extent (the bypass street and its arterial together) to beyond the other end, within a lateral limit of the corridor, by direction. 'Bypass' = at least N blocks (links) on the bypass street; 'arterial' = fewer bypass blocks and at least N on the arterial; 'other' = neither (another street, the freeway or a short use); blocks are counted on the corridor's study-area links. No observed counterpart exists for these shares. The related observed values are in the select-link table above: northbound Hillegass Ave traffic rarely ends on College Ave (6%), 21 to 33% jogs to Benvenue Ave, and southbound freeway-bound drivers on College Ave commonly arrive via Ashby Ave and Benvenue Ave and jog to Hillegass Ave.

| Bypass | Arterial | N | Direction | Corridor trips | Bypass | Arterial | Other | Mean bypass blocks |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue | College Avenue | 3 | N | 1546 | 3% | 17% | 80% | 0.1 |
| Hillegass Avenue | College Avenue | 3 | S | 1386 | 6% | 26% | 69% | 0.2 |

## Per-mode results

Offered: 26349 car veh/h; 626 bicycle flows (764/h); 2000 pedestrian flows (1731/h). Bicycle and pedestrian volumes are assumptions, not counts.

| Mode | In network | Completed | Mean time (s) | Other |
| --- | --- | --- | --- | --- |
| Car | 3425 | 25963 | 429 | |
| Bicycle | 49 | 794 | 269 | |
| Pedestrian | 225 | 1654 | 415 | mean crossing delay 7.8 s |

Vulnerable road users (surrogate indicators): pedestrian conflicts 294, bicycle conflicts 1198, close passes 664, pedestrian injury severity mean 0.042 (AIS4+, 10839 supported of 10839 encounters), cyclist injury severity mean 0.069 (MAIS3+F, 3984 supported of 8431 encounters) (separate endpoints, never summed), mean vehicle speed at pedestrian encounters 2.22 m/s.


## Through cars on the counted blocks (a car is through when neither trip end is in the study area)

Observed through range = from the cars that drove the whole street (volunteer count, a lower bound) to the block volume less the cars whose trip ends along the street (an upper bound). Observed freeway-end trips = observed block volume times the observed freeway share of the street (the headline share of the targets file); these include freeway trips that end inside the study area, so they are not an expected through count. Modeled through = select-link trips with no end in the study area, per hour. Modeled freeway = select-link trips from or to a freeway node, per hour.

| Block | Observed volume (veh/h) | Observed freeway share | Observed freeway-end trips (veh/h) | Observed through range (veh/h) | Modeled through (veh/h) | In range | Modeled freeway trips (veh/h) |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue NB | 110 | 47.0% | 52 | 48 to 95 | 92 | yes | 134 |
| Colby Street NB | 174 | 47.0% | 82 | 102 to 145 | 150 | above | 158 |
| Hillegass Avenue SB | 160 | 68.0% | 109 | 79 to 120 | 137 | above | 114 |
| Colby Street SB | 160 | 45.0% | 72 | 39 to 117 | 113 | yes | 122 |

Fitted: Colby Street NB, Colby Street SB, Hillegass Avenue NB, Hillegass Avenue SB are targets of the demand fit (`countFit.throughTargets`, calibration round 39), so these rows are no longer an independent check. The checks that stay independent are the held-out count stations, the headline freeway shares, stability and the arterial travel times.

## Intent map: through cars by where they come from and where they are going

Through = neither trip end is in the study area. Groups are the approach groups of the area config (data/areas); a node that is not a gate takes the group of the nearest surface gate (ASSUMPTION). The arterial is the one a trip would use on the shortest free-flow path with the study area's residential and service streets closed, where that path runs on a boundary street near the study area.

Model figures are the mean of 1 seed(s), per hour of the run. Basis: OBSERVED = read from the resident volunteer count of Feb 25, 2025 or its headline shares; ASSUMPTION = inferred from those numbers or chosen.

### Colby Street NB

Observed: block volume 174 veh/h, whole-street cars 102, so through cars 102 to 145 veh/h. Model: 150 through cars per hour.

Observed (PM): 182 cars entered at the south end, 102 drove the whole street, 164 left it at Alcatraz Ave (131 left, 32 right, 1 straight), and 47% of the block's trips came from a freeway (the headline share). ASSUMPTION: freeway-origin cars that do not end along the street are 65 veh/h (the 82 freeway-origin trips on the block, 47% of 174, times the 182 / (182 + 47) of its cars that entered at the south end rather than joining on the way), spread over the 164 exits in proportion (0.40); the other through cars come from the Telegraph Ave and south-side approaches that feed the street's south end. Ranges: low = 131 (32) x 0.47 x 0.62 (the whole-street share of exits), high = 131 (32) x 0.47.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | OBSERVED turn count x ASSUMPTION share (131 left turns x 0.40) | 52 (38 to 62) | 50 | within |
| Telegraph Ave and south-side traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | ASSUMPTION: the through left-turners (131 x 0.62 = 81) that are not off-ramp traffic | 29 (19 to 43) | 36 | within |
| SR-24 off-ramp traffic using Colby St to reach College Ave and Berkeley (right at Alcatraz Ave) | OBSERVED turn count x ASSUMPTION share (32 right turns x 0.40) | 13 (9 to 15) | 12 | within |
| Telegraph Ave and south-side traffic using Colby St to reach College Ave and Berkeley | ASSUMPTION: the through right-turners (32 x 0.62 = 20) that are not off-ramp traffic | 7 (5 to 11) | 45 | above |
| Intents listed, together | | 101 (71 to 131) | 143 | |
| Other through cars (no intent listed) | | | 7 | |

Model through cars by origin and destination group (largest 12 of 17 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 50.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 43.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Ashby Ave from the west (Emeryville and I-80) | 10.0 | none near the study area |
| Telegraph Ave to the south (downtown Oakland) | Telegraph Ave from the north (Berkeley) | 10.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Shattuck Ave from the north (Berkeley) | 8.0 | Claremont Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 6.0 | SR-24 then Claremont Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | College Ave from the north (Berkeley) | 5.0 | SR-24 then Claremont Avenue then College Avenue |
| Ashby Ave from the west (Emeryville and I-80) | College Ave from the north (Berkeley) | 4.0 | Alcatraz Avenue then College Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 4.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Emeryville and West Oakland streets (55th to 67th Streets) | 2.0 | Claremont Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Telegraph Ave from the north (Berkeley) | 2.0 | Telegraph Avenue |
| Ashby Ave from the west (Emeryville and I-80) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 1.0 | Alcatraz Avenue then Claremont Avenue |
| other pairs | | 5.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 110 veh/h; Claremont Avenue 11 veh/h; none near the study area 10 veh/h; SR-24 then Claremont Avenue 6 veh/h; SR-24 then Claremont Avenue then College Avenue 5 veh/h; Alcatraz Avenue then College Avenue 4 veh/h.

### Hillegass Avenue NB

Observed: block volume 110 veh/h, whole-street cars 48, so through cars 48 to 95 veh/h. Model: 92 through cars per hour.

Observed (PM): 94 cars entered at the south end, 48 drove the whole street, 109 left it at Alcatraz Ave (43 west, 54 east, 12 straight), and 47% of the block's trips came from a freeway. ASSUMPTION: freeway-origin through cars are 40 veh/h (52 freeway-origin trips times 94 / (94 + 29)), spread over the exits in proportion (0.37); the through share of exits is 48 / 109 = 0.44.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Hillegass Ave to reach Alcatraz Ave west and Telegraph Ave north | OBSERVED turn count x ASSUMPTION share (43 left turns x 0.37) | 16 (9 to 20) | 22 | above |
| SR-24 off-ramp traffic using Hillegass Ave to reach College Ave and Berkeley | OBSERVED turn count x ASSUMPTION share (54 right turns x 0.37) | 20 (11 to 25) | 32 | above |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach Alcatraz Ave west | ASSUMPTION: through exits (43 x 0.44) that are not off-ramp traffic | 3 (0 to 10) | 4 | within |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach College Ave and Berkeley | ASSUMPTION: through exits (54 x 0.44) that are not off-ramp traffic | 4 (0 to 13) | 25 | above |
| Intents listed, together | | 43 (20 to 68) | 83 | |
| Other through cars (no intent listed) | | | 9 | |

Model through cars by origin and destination group (largest 12 of 23 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 17.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 17.0 | SR-24 |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 16.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | College Ave from the north (Berkeley) | 9.0 | SR-24 then Claremont Avenue then College Avenue |
| SR-13 Warren Freeway (via SR-24 east) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 6.0 | Claremont Avenue then Alcatraz Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 5.0 | SR-24 then Claremont Avenue |
| Telegraph Ave to the south (downtown Oakland) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 3.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Claremont Ave and Tunnel Rd toward the hills | 2.0 | Claremont Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Ashby Ave from the west (Emeryville and I-80) | 2.0 | SR-24 then Telegraph Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | San Pablo Ave (Emeryville and West Oakland) | 2.0 | SR-24 |
| Ashby Ave from the west (Emeryville and I-80) | College Ave from the north (Berkeley) | 1.0 | Alcatraz Avenue then College Avenue |
| San Pablo Ave (Emeryville and West Oakland) | Claremont Ave and Tunnel Rd toward the hills | 1.0 | Alcatraz Avenue then Claremont Avenue |
| other pairs | | 11.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 38 veh/h; SR-24 19 veh/h; SR-24 then Claremont Avenue then College Avenue 9 veh/h; Claremont Avenue then Alcatraz Avenue 7 veh/h; SR-24 then Claremont Avenue 5 veh/h; Claremont Avenue 4 veh/h.

### Hillegass Avenue SB

Observed: block volume 160 veh/h, whole-street cars 79, so through cars 79 to 120 veh/h. Model: 137 through cars per hour.

Observed (PM): 178 cars entered at the top (76 turned in from Alcatraz Ave west, 98 from the east, 4 came straight from the north), 79 drove the whole street, and 68% of the block's trips (109 veh/h) went to a freeway. ASSUMPTION: freeway-bound cars that did not join mid-street are 87 veh/h (109 x 178 / (178 + 44)), half of the 174 turn-ins; low = the whole-street share of the turn-ins (0.45), high = the freeway-bound share without the mid-street correction (0.63).

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Telegraph Ave, Alcatraz Ave west and West Berkeley traffic turning off Alcatraz Ave onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (76 turn-ins x 0.50) | 38 (34 to 48) | 47 | within |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (98 turn-ins x 0.50) | 49 (44 to 62) | 55 | within |
| Intents listed, together | | 87 (78 to 110) | 102 | |
| Other through cars (no intent listed) | | | 35 | |

Model through cars by origin and destination group (largest 12 of 16 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 46.0 | Telegraph Avenue |
| Ashby Ave from the west (Emeryville and I-80) | College Ave from the north (Berkeley) | 23.0 | Alcatraz Avenue then College Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 21.0 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 20.0 | Claremont Avenue then SR-24 |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 10.0 | College Avenue then Claremont Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 3.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 2.0 | Claremont Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 2.0 | Claremont Avenue |
| Berkeley hills to the northeast (Evergreen Ln, Gravatt Dr) | SR-24 westbound on-ramps (toward Oakland and I-980) | 2.0 | SR-24 |
| Telegraph Ave from the north (Berkeley) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 2.0 | Telegraph Avenue |
| Alcatraz Ave from the west (Emeryville side) | Claremont Ave and Tunnel Rd toward the hills | 1.0 | Alcatraz Avenue then Claremont Avenue |
| Ashby Ave from the west (Emeryville and I-80) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 1.0 | Alcatraz Avenue then Claremont Avenue |
| other pairs | | 4.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 73 veh/h; Alcatraz Avenue then College Avenue 23 veh/h; Claremont Avenue then SR-24 20 veh/h; College Avenue then Claremont Avenue then SR-24 10 veh/h; Claremont Avenue 4 veh/h; Alcatraz Avenue then Claremont Avenue 3 veh/h.

### Colby Street SB

Observed: block volume 160 veh/h, whole-street cars 39, so through cars 39 to 117 veh/h. Model: 113 through cars per hour.

Observed (PM): 139 cars entered at the top (76 from Alcatraz Ave west, 50 from the east, 13 from the north), 39 drove the whole street, 45% of the block's trips (72 veh/h) went to a freeway and 22% came by way of Telegraph Ave. ASSUMPTION: freeway-bound cars that did not join mid-street are 46 veh/h (72 x 139 / (139 + 79)), 0.365 of the 126 turn-ins; low = the whole-street share (0.31), high = the unadjusted freeway share (0.57). The Telegraph Ave cars are the 22% x 160 = 35 of the 76 west turn-ins.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Southbound Telegraph Ave traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (35 Telegraph Ave cars x 0.365) | 13 (11 to 20) | 11 | within |
| Alcatraz Ave west, Ashby Ave and West Berkeley traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (41 other west turn-ins x 0.365) | 15 (13 to 23) | 15 | within |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (50 east turn-ins x 0.365) | 18 (15 to 29) | 42 | above |
| Intents listed, together | | 46 (39 to 72) | 68 | |
| Other through cars (no intent listed) | | | 45 | |

Model through cars by origin and destination group (largest 12 of 22 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 21.0 | Telegraph Avenue |
| Ashby Ave from the west (Emeryville and I-80) | College Ave from the north (Berkeley) | 17.0 | Alcatraz Avenue then College Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 13.0 | Claremont Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 11.0 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 11.0 | Telegraph Avenue |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 8.0 | College Avenue then Claremont Avenue then SR-24 |
| Ashby Ave from the west (Emeryville and I-80) | SR-13 Warren Freeway (via SR-24 east) | 5.0 | SR-24 |
| Shattuck Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 4.0 | none near the study area |
| Alcatraz Ave from the west (Emeryville side) | SR-13 Warren Freeway (via SR-24 east) | 3.0 | SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Telegraph Ave to the south (downtown Oakland) | 3.0 | Telegraph Avenue |
| Ashby Ave from the west (Emeryville and I-80) | Berkeley hills to the northeast (Evergreen Ln, Gravatt Dr) | 2.0 | none near the study area |
| West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) | SR-24 westbound on-ramps (toward Oakland and I-980) | 2.0 | none near the study area |
| other pairs | | 13.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 48 veh/h; Alcatraz Avenue then College Avenue 17 veh/h; Claremont Avenue then SR-24 13 veh/h; none near the study area 10 veh/h; SR-24 9 veh/h; College Avenue then Claremont Avenue then SR-24 8 veh/h.

### Study area, all residential and service streets

Model: 801 through cars per hour.

Model through cars by origin and destination group (largest 12 of 60 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 114.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 65.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 63.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 60.0 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 53.0 | Telegraph Avenue |
| Ashby Ave from the west (Emeryville and I-80) | College Ave from the north (Berkeley) | 50.0 | Alcatraz Avenue then College Avenue |
| West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) | SR-24 westbound on-ramps (toward Oakland and I-980) | 33.0 | none near the study area |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 29.0 | Claremont Avenue then SR-24 |
| Telegraph Ave from the north (Berkeley) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 28.0 | Telegraph Avenue |
| West Oakland to the southwest (Adeline St, Market St) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 27.0 | Telegraph Avenue then Claremont Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Shattuck Ave from the north (Berkeley) | 20.0 | Claremont Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 17.0 | SR-24 |
| other pairs | | 242.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 437 veh/h; none near the study area 77 veh/h; Claremont Avenue 67 veh/h; Alcatraz Avenue then College Avenue 50 veh/h; SR-24 30 veh/h; Claremont Avenue then SR-24 29 veh/h.

By origin group: South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 185; Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 144; SR-24 eastbound off-ramps (arriving from Oakland and I-980) 104; Telegraph Ave from the north (Berkeley) 84; Ashby Ave from the west (Emeryville and I-80) 65; West Oakland to the southwest (Adeline St, Market St) 40; West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) 33; Emeryville and West Oakland streets (55th to 67th Streets) 33; Claremont Ave and Tunnel Rd toward the hills 29; Telegraph Ave to the south (downtown Oakland) 27.

By destination group: SR-24 westbound on-ramps (toward Oakland and I-980) 218; Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 159; South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 139; Telegraph Ave from the north (Berkeley) 89; College Ave from the north (Berkeley) 68; Claremont Ave and Tunnel Rd toward the hills 43; Shattuck Ave from the north (Berkeley) 20; Emeryville and West Oakland streets (55th to 67th Streets) 16; Ashby Ave from the west (Emeryville and I-80) 12; Telegraph Ave to the south (downtown Oakland) 9.


## Through cars by intent (cut-through intent view)

A through car is tallied once, under the first intent that fits it (the on-ramp on its planned route, the off-ramp it has driven, or the origin and destination groups of its trip), at the moment the through count counts it. Cars an hour over the run, the same window as the through-car figure (803 an hour).

| Intent | Basis | Cars an hour | Share |
| --- | --- | --- | --- |
| on-2853241697 | observed | 220 | 27% |
| Other on-ramps | assumed | 13 | 2% |
| off-52990846 | observed | 104 | 13% |
| Other off-ramps | assumed | 13 | 2% |
| Downtown, south and west Oakland traffic using side streets to reach Berkeley and Telegraph Ave north | assumed | 181 | 23% |
| Berkeley and Telegraph Ave north traffic using side streets to reach downtown, south and west Oakland | assumed | 101 | 13% |
| Oakland cross-town traffic (West Oakland, Broadway, Piedmont, Emeryville) using side streets near Claremont Ave and Telegraph Ave | assumed | 62 | 8% |
| Other (no intent listed) |  | 109 | 14% |

Intents listed cover 86% of through cars.


## Select-link shares: modeled vs observed (design D5: headline = freeway shares, tolerance +/-10 pp)

- Hillegass Avenue NB: 4 links (path Claremont Avenue -> Alcatraz Avenue (434 m)), 245 trips (227 completed)
- Colby Street NB: 8 links (path Claremont Avenue -> Alcatraz Avenue (680 m)), 322 trips (298 completed)
- Hillegass Avenue SB: 4 links (path Alcatraz Avenue -> Claremont Avenue (433 m)), 182 trips (169 completed)
- Colby Street SB: 8 links (path Alcatraz Avenue -> Claremont Avenue (680 m)), 299 trips (265 completed)

| Block | Side | Via | Observed | Modeled | Diff (pp) | n trips | Headline |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue NB | from | freeway | 47% | 55% | +8 | 245 | within |
| Hillegass Avenue NB | to | Benvenue Avenue | 21% (PM 33%) | 2% | -31 | 245 |  |
| Hillegass Avenue NB | to | College Avenue | 6% | 16% | +10 | 245 |  |
| Hillegass Avenue NB | to | Alcatraz Avenue WB | 27% | 23% | -4 | 245 |  |
| Colby Street NB | from | freeway | 47% | 48% | +1 | 322 | within |
| Colby Street NB | to | Alcatraz Avenue WB | 48% | 39% | -9 | 322 |  |
| Colby Street NB | to | Telegraph Avenue | 25% | 33% | +8 | 322 |  |
| Colby Street NB | to | College Avenue | 3% | 9% | +6 | 322 |  |
| Hillegass Avenue SB | from | Alcatraz Avenue WB | 46% | 31% | -15 | 182 |  |
| Hillegass Avenue SB | from | Benvenue Avenue | 26% | 5% | -21 | 182 |  |
| Hillegass Avenue SB | from | College Avenue | 16% | 16% | +0 | 182 |  |
| Hillegass Avenue SB | to | freeway | 57% (PM 68%) | 62% | -6 | 182 | within |
| Colby Street SB | from | Alcatraz Avenue EB | 43% | 21% | -22 | 299 |  |
| Colby Street SB | from | Alcatraz Avenue WB | 46% | 13% | -33 | 299 |  |
| Colby Street SB | from | Telegraph Avenue | 22% | 19% | -3 | 299 |  |
| Colby Street SB | to | freeway | 45% | 38% | -7 | 299 | within |
| Colby Street SB | to | Forest Street | 34% | 26% | -8 | 299 |  |

Headline shares within tolerance: 4 of 4. Observed column uses the PM-peak share where one is given and the period is pm_peak. 'Via' shares are the fraction of select-link trips using that street before (from) or after (to) the block; freeway = origin / destination gate with a motorway-class link attached.

## Claremont ramps: streets used before the on-ramp / after the off-ramp

Observed shares are for traffic from/to the north only. 'Modeled' is over all trips on the ramps and any visit to the street (an upper bound for streets that serve both sides). 'Modeled, side' counts only trips whose surface end lies on the side of the ramp stated in the targets file (`freewayRamp.side`), and for a street with a qualifier ("north of X") only its links on that side of X.

| Direction | Via | Observed | Modeled | n ramp trips | Modeled, side | n side trips |
| --- | --- | --- | --- | --- | --- | --- |
| onto freeway | College Avenue | 16% | 14% | 870 | 16% | 733 |
| onto freeway | Hillegass Avenue | 12% | 13% | 870 | 16% | 733 |
| onto freeway | Martin Street | 10% | 11% | 870 | 13% | 733 |
| onto freeway | Colby Street | 8% | 8% | 870 | 10% | 733 |
| onto freeway | Telegraph Avenue north of Alcatraz Avenue | 8% | 16% | 870 | 13% | 733 |
| onto freeway | Benvenue Avenue | 5% | 5% | 870 | 6% | 733 |
| from freeway | College Avenue | 10% | 10% | 769 | 11% | 732 |
| from freeway | Martin Street | 10% | 9% | 769 | 10% | 732 |
| from freeway | Colby Street | 8% | 11% | 769 | 11% | 732 |
| from freeway | Hillegass Avenue | 5% | 8% | 769 | 8% | 732 |
| from freeway | Benvenue Avenue | 3% | 2% | 769 | 2% | 732 |

## Top 15 links by delay

| Link | Street | Class | Lanes | Len (m) | End node control | Delay (veh-h) | Stopped (veh-h) | Mean stopped veh | Flow (veh/h) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 4175 | (unnamed) | Motorway | 2 | 142 | uncontrolled | 23.31 | 4.08 | 4.1 | 1519 |
| 4143 | Adeline Street | Secondary | 3 | 185 | signal | 13.94 | 9.38 | 9.4 | 1116 |
| 4397 | Ashby Avenue | Primary | 2 | 96 | signal | 13.40 | 10.72 | 10.7 | 434 |
| 1089 | Market Street | Tertiary | 2 | 111 | two_way_stop | 12.87 | 9.77 | 9.8 | 779 |
| 3370 | The Uplands | Tertiary | 1 | 311 | uncontrolled | 12.45 | 9.40 | 9.4 | 283 |
| 1126 | Market Street | Tertiary | 2 | 113 | two_way_stop | 9.88 | 7.47 | 7.5 | 768 |
| 4167 | (unnamed) | Motorway | 3 | 75 | uncontrolled | 9.23 | 2.63 | 2.6 | 2407 |
| 460 | Sacramento Street | Tertiary | 2 | 104 | two_way_stop | 8.87 | 7.23 | 7.2 | 412 |
| 1051 | Adeline Street | Secondary | 4 | 50 | signal | 8.85 | 7.32 | 7.3 | 1422 |
| 3395 | Ashby Avenue | Primary | 1 | 129 | signal | 8.82 | 7.08 | 7.1 | 504 |
| 2921 | Russell Street | Residential | 1 | 260 | uncontrolled | 8.22 | 6.82 | 6.8 | 164 |
| 3434 | Claremont Avenue | Secondary | 1 | 93 | all_way_stop | 7.36 | 4.13 | 4.1 | 474 |
| 4329 | Claremont Avenue | Secondary | 2 | 113 | signal | 7.26 | 6.23 | 6.2 | 391 |
| 1037 | Sacramento Street | Tertiary | 3 | 40 | signal | 7.09 | 5.99 | 6.0 | 923 |
| 1049 | Adeline Street | Secondary | 4 | 43 | signal | 7.07 | 5.90 | 5.9 | 1060 |

## Top 15 nodes by blocked time

Blocked time = lane-head seconds waiting at the stop line without permission (signal red, conflict, stop sign or no downstream space).

| Node | Streets | Control | Gate | Blocked (lane-h) | of which no downstream space | Signal plan at end (cycle: greens) |
| --- | --- | --- | --- | --- | --- | --- |
| 447 | Adeline Street / Alcatraz Avenue | signal |  | 4.96 | 0.26 | 75 s: 30/35 |
| 680 | 52nd Street / Shattuck Avenue | signal |  | 4.72 | 0.03 | 110 s: 30/28/38 |
| 446 | Market Street / Stanford Avenue | signal |  | 4.29 | 0.28 | 75 s: 35/30 |
| 1406 | Ashby Avenue / Claremont Avenue | signal |  | 4.24 | 0.27 | 75 s: 30/15/15 |
| 331 | 52nd Street / Martin Luther King Junior Way | signal |  | 4.17 | 0.03 | 75 s: 29/36 |
| 1080 | 62nd Street / Claremont Avenue / College Avenue | signal |  | 3.92 | 0.11 | 75 s: 17/28/15 |
| 185 | Alcatraz Avenue / Sacramento Street | signal |  | 3.58 | 0.09 | 75 s: 45/20 |
| 479 | Adeline Street / Martin Luther King Junior Way / Stanford Avenue | signal |  | 3.48 | 0.05 | 75 s: 33/32 |
| 37 | San Pablo Avenue / Stanford Avenue | signal |  | 3.35 | 0.05 | 75 s: 31/34 |
| 30 | 57th Street / Adeline Street / Market Street | signal |  | 3.28 | 0.05 | 75 s: 30/15/15 |
| 1069 | Claremont Avenue / Colby Street / Forest Street | signal |  | 3.01 | 0.03 | 79 s: 25/4/35 |
| 242 | Ashby Avenue / Martin Luther King Junior Way | signal |  | 3.00 | 0.01 | 75 s: 40/25 |
| 713 | 51st Street / Telegraph Avenue | signal |  | 2.95 | 0.01 | 75 s: 41/24 |
| 851 | Alcatraz Avenue / Telegraph Avenue | signal |  | 2.91 | 0.04 | 75 s: 48/17 |
| 17 | 45th Street / San Pablo Avenue | signal |  | 2.89 | 0.02 | 75 s: 21/44 |

Phases of the five most blocked signals (green s: approach links with their lanes, link ids in brackets):

- node 447: 30 s: Adeline Street 4L [1049], Adeline Street 4L [1051]; 35 s: Alcatraz Avenue 2L [1048], Alcatraz Avenue 2L [1133]
- node 680: 30 s: 52nd Street 4L [1662]; 28 s: 52nd Street 4L [1666], 52nd Street 4L [1662]; 38 s: Shattuck Avenue 2L [1653], Shattuck Avenue 2L [1705]
- node 446: 35 s: Stanford Avenue 3L [941], Stanford Avenue 3L [1055]; 30 s: Market Street 4L [1108], Market Street 3L [1111]
- node 1406: 30 s: Ashby Avenue 1L [3395], Ashby Avenue 2L [3426]; 15 s: Claremont Avenue 2L [4329]; 15 s: Claremont Avenue 3L [3447]
- node 331: 29 s: Martin Luther King Junior Way 4L [704], Martin Luther King Junior Way 4L [761]; 36 s: 52nd Street 2L [758], 52nd Street 1L [760]

## Gridlock removals by link (top 10)

| Link | Street | End node | Control | Removals | First at (min) |
| --- | --- | --- | --- | --- | --- |
| 1066 | Lowell Street | Lowell Street | uncontrolled | 1 | 50.9 |
| 909 | 59th Street | 59th Street / Genoa Street | uncontrolled | 1 | 56.9 |

## Cars cleared from gridlock near and far (judged zone)

Judged zone: the study area, its bounding streets and the junctions on them, plus nodes within 200 m of it along the network (111 nodes, 329 links). A far clearing counts against the stability rule when its blocking chain (vehicles held at least 60 s by a full exit, at the 5 s snapshot before it) reaches a link in the zone.

| Buffer (m) | Near | Far | Far, chain reaches the zone | Judged |
| --- | --- | --- | --- | --- |
| 100.0 | 0 | 2 | 0 | 0 |
| 200.0 | 0 | 2 | 0 | 0 |
| 400.0 | 0 | 2 | 0 | 0 |

| Far node | Streets | Distance from the study area (m) | Cleared | Chain reaches the zone |
| --- | --- | --- | --- | --- |
| 407 | Lowell Street | 1678.0 | 1 | 0 |
| 421 | 59th Street / Genoa Street | 1121.0 | 1 | 0 |

Entry backlog at the end of the run: 1 trips waiting at origins in the zone, of 232 in all.

| Bounding street | Links | Longest standing queue on one link (m) | Link (length m) | At (min) | Share of samples with a link full |
| --- | --- | --- | --- | --- | --- |
| Telegraph Avenue | 28 | 91.0 | 2030 (101.0) | 37.5 | 0.083 |
| Alcatraz Avenue | 14 | 85.0 | 4238 (84.0) | 38.4 | 0.015 |
| College Avenue | 6 | 78.0 | 2805 (102.0) | 34.2 | 0.042 |
| Claremont Avenue | 13 | 55.0 | 2776 (161.0) | 28.3 | 0.0 |
| CA 24 | 3 | 36.0 | 1945 (188.0) | 11.5 | 0.0 |

## Junction recovery

Policy `physical`. Node entries by cars and cyclists in the run: 813331 (settle interval 0). An admission is an entry the ordinary rule would have refused; head-seconds count the time a waiting head vehicle had the reason invoked, and the part of it in which it still could not enter. Courtesy and the yield fallback change priority only; under `physical` the conflict bypass never admits.

| Reason | Admissions per hour | Per 1,000 entries | Head-s invoked | Head-s blocked |
| --- | --- | --- | --- | --- |
| courtesy | 306.0 | 0.376 | 1235 | 1140 |
| yield fallback | 138.0 | 0.170 | 38 | 0 |
| conflict bypass | 0.0 | 0.000 | 117 | 117 |

Vehicles removed while held in a node by a full exit: 0 (0.0 per hour, included in the gridlock removals).

| Node | Streets | Control | Courtesy | Yield fallback | Conflict bypass | Held removals |
| --- | --- | --- | --- | --- | --- | --- |
| 141 | 63rd Street / Lowell Street / Market Street | two_way_stop | 13 | 8 | 0 | 0 |
| 147 | 59th Street / Grace Avenue / Los Angeles Street | two_way_stop | 16 | 3 | 0 | 0 |
| 1429 | Claremont Avenue / Claremont Boulevard | two_way_stop | 19 | 0 | 0 | 0 |
| 165 | Alcatraz Avenue / Baker Street | two_way_stop | 9 | 6 | 0 | 0 |
| 1435 | Roanoke Road / The Uplands | two_way_stop | 14 | 0 | 0 | 0 |
| 464 | 61st Street / Market Street | two_way_stop | 3 | 10 | 0 | 0 |
| 168 | 62nd Street / Market Street | two_way_stop | 3 | 9 | 0 | 0 |
| 30 | 57th Street / Adeline Street / Market Street | signal | 11 | 0 | 0 | 0 |
| 1080 | 62nd Street / Claremont Avenue / College Avenue | signal | 11 | 0 | 0 | 0 |
| 125 | Alcatraz Avenue / Idaho Street | two_way_stop | 4 | 6 | 0 | 0 |

## Entry backlog by origin node at end of run (top 10)

| Node | Streets | Trips waiting | Offered veh/h (before scale) |
| --- | --- | --- | --- |
| 602 | Grove Shafter Freeway | 201 | 4114 |
| 1756 | Claremont Avenue | 19 | 504 |
| 654 | 53rd Street / Shattuck Avenue | 4 | 19 |
| 339 | 55th Street / Dover Street | 2 | 34 |
| 1408 | Avalon Avenue / Claremont Avenue | 2 | 11 |
| 13 | 55th Street / San Pablo Avenue | 1 | 37 |
| 437 | Adeline Street / Genoa Street | 1 | 32 |
| 811 | 58th Street / Vicente Street | 1 | 46 |
| 1230 | Avalon Avenue / Claremont Boulevard | 1 | 16 |

## Flow on key streets (veh/h per direction, study-area links of 40 m or more)

| Street | Direction of travel | Links | Median flow | Max flow |
| --- | --- | --- | --- | --- |
| Telegraph | N | 12 | 1050 | 1094 |
| Telegraph | S | 10 | 1213 | 1230 |
| College | N | 3 | 414 | 414 |
| College | S | 3 | 594 | 594 |
| Claremont | N | 6 | 521 | 727 |
| Claremont | S | 7 | 358 | 824 |
| Alcatraz | E | 6 | 497 | 518 |
| Alcatraz | W | 6 | 340 | 358 |
| Hillegass | N | 4 | 138 | 142 |
| Hillegass | S | 4 | 142 | 146 |
| Colby | N | 7 | 176 | 227 |
| Colby | S | 7 | 155 | 202 |
| Martin | E | 2 | 122 | 122 |
| Martin | W | 2 | 145 | 145 |

## Largest demand origins (offered, before scale)

| Node | Streets | Veh/h |
| --- | --- | --- |
| 602 | Grove Shafter Freeway | 4114 |
| 265 | Ashby Avenue | 1134 |
| 1719 | Grove Shafter Freeway | 989 |
| 183 | San Pablo Avenue | 988 |
| 974 | Broadway | 801 |
| 1672 | Warren Freeway | 777 |
| 943 | Telegraph Avenue / Ward Street | 722 |
| 763 | Telegraph Avenue | 695 |
| 1756 | Claremont Avenue | 504 |
| 577 | Martin Luther King Junior Way | 497 |
