# Calibration report: rockridge pm_peak scale 1 seed 1 (60 min)

Offered demand 25349 veh/h x scale 1 = 25349 veh/h. Run took 62.2 s wall clock. Flow tables use the window after a 10 min warm-up; select-link and health figures cover the whole run from an empty network.

## Stability (design D4)

| Criterion | Threshold | Value | Result |
| --- | --- | --- | --- |
| Gridlock removals | 0 | 0 | pass |
| Backlog / spawned | < 2% | 0.2% (61 of 25581) | pass |
| Arterial mean speed (run) | > 4 m/s | 8.11 m/s (last 15 min 7.86) | pass |

Overall: **STABLE**. Mean trip delay 175 s, mean trip time 432 s, completed 25124, unroutable 0.

| t (min) | vehicles in network | backlog | completed | removals | arterial speed in interval (m/s) |
| --- | --- | --- | --- | --- | --- |
| 5 | 3019 | 20 | 2087 | 0 | 8.53 |
| 10 | 3012 | 25 | 4191 | 0 | 8.10 |
| 15 | 3050 | 11 | 6278 | 0 | 8.24 |
| 20 | 3133 | 5 | 8380 | 0 | 8.15 |
| 25 | 3114 | 15 | 10512 | 0 | 8.39 |
| 30 | 3154 | 24 | 12645 | 0 | 8.47 |
| 35 | 3168 | 17 | 14766 | 0 | 8.06 |
| 40 | 3145 | 16 | 16828 | 0 | 7.94 |
| 45 | 3207 | 32 | 18866 | 0 | 7.92 |
| 50 | 3284 | 33 | 20881 | 0 | 8.06 |
| 55 | 3368 | 27 | 23037 | 0 | 7.88 |
| 60 | 3479 | 61 | 25124 | 0 | 7.65 |
## Wandering (completed car trips)

Detour ratio = distance driven (link and movement lengths) over the shortest network distance from the trip's origin to its destination. Detour against the free-flow route uses the time-shortest route with no congestion and no noise, which is what a purposeful driver without live information would follow (it differs from the shortest distance when a faster, longer road exists). A switch is a change of the remaining route while en route. Loops: the same link twice or the same node three or more times. Reversals: a link followed by its reverse within 200 m. 'Study-area vehicle-miles' are miles driven on links inside the study area; the last column is the share of them driven by trips with a detour ratio above 1.3. Guided drivers re-evaluate their route every epoch; the others keep their departure route unless it is blocked.

| Trips | n | Switches per trip | With a switch | Mean detour | Median detour | Detour > 1.3 | Detour > 2 | Mean detour vs free-flow route | Vs free-flow route > 1.3 | Loops | Reversals | Study veh-miles | Of them by detour > 1.3 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| all trips | 22919 | 0.03 | 2.9% | 1.097 | 1.062 | 5.7% | 0.0% | 1.034 | 2.4% | 0.0% | 5.5% | 2448 | 11.7% |
| gate to gate | 8365 | 0.05 | 4.9% | 1.101 | 1.075 | 4.9% | 0.0% | 1.034 | 2.1% | 0.0% | 8.3% | 521 | 13.7% |
| with a local end | 14554 | 0.02 | 1.7% | 1.095 | 1.056 | 6.2% | 0.0% | 1.033 | 2.6% | 0.0% | 4.0% | 1927 | 11.2% |
| guided drivers | 10503 | 0.06 | 6.0% | 1.098 | 1.062 | 5.7% | 0.0% | 1.034 | 2.4% | 0.0% | 5.6% | 1140 | 11.3% |
| other drivers | 12416 | 0.00 | 0.2% | 1.097 | 1.062 | 5.7% | 0.0% | 1.034 | 2.5% | 0.0% | 5.5% | 1309 | 12.0% |

## Reported patterns (diagnostics; configured in the targets file under `patterns`)

(a) Trips between the surface gates on the north side of the ramps and the freeway mainline gates, and the local-street (residential and service links in the study area) vehicle-miles they drive. Share = of all completed trips' local-street vehicle-miles (560 miles). No observed counterpart exists for this quantity (the targets file has only the select-link shares above).

| Trips | n trips | Local-street veh-miles | Share of all local-street veh-miles |
| --- | --- | --- | --- |
| surface gates to the freeway | 1636 | 32.8 | 6% |
| freeway to the surface gates | 1134 | 36.9 | 7% |

(b) Corridor trips: completed trips from beyond one end of the corridor's study-area extent (the bypass street and its arterial together) to beyond the other end, within a lateral limit of the corridor, by direction. 'Bypass' = at least N blocks (links) on the bypass street; 'arterial' = fewer bypass blocks and at least N on the arterial; 'other' = neither (another street, the freeway or a short use); blocks are counted on the corridor's study-area links. No observed counterpart exists for these shares. The related observed values are in the select-link table above: northbound Hillegass Ave traffic rarely ends on College Ave (6%), 21 to 33% jogs to Benvenue Ave, and southbound freeway-bound drivers on College Ave commonly arrive via Ashby Ave and Benvenue Ave and jog to Hillegass Ave.

| Bypass | Arterial | N | Direction | Corridor trips | Bypass | Arterial | Other | Mean bypass blocks |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue | College Avenue | 3 | N | 1343 | 3% | 20% | 77% | 0.1 |
| Hillegass Avenue | College Avenue | 3 | S | 1536 | 6% | 18% | 76% | 0.3 |

## Per-mode results

Offered: 25349 car veh/h; 626 bicycle flows (764/h); 2000 pedestrian flows (1731/h). Bicycle and pedestrian volumes are assumptions, not counts.

| Mode | In network | Completed | Mean time (s) | Other |
| --- | --- | --- | --- | --- |
| Car | 3479 | 25124 | 432 | |
| Bicycle | 59 | 793 | 266 | |
| Pedestrian | 196 | 1671 | 433 | mean crossing delay 8.0 s |

Vulnerable road users (surrogate indicators): pedestrian conflicts 270, bicycle conflicts 1185, close passes 691, pedestrian injury severity mean 0.042 (AIS4+, 10714 supported of 10714 encounters), cyclist injury severity mean 0.067 (MAIS3+F, 4089 supported of 8154 encounters) (separate endpoints, never summed), mean vehicle speed at pedestrian encounters 2.24 m/s.


## Through cars on the counted blocks (a car is through when neither trip end is in the study area)

Observed through range = from the cars that drove the whole street (volunteer count, a lower bound) to the block volume less the cars whose trip ends along the street (an upper bound). Observed freeway-end trips = observed block volume times the observed freeway share of the street (the headline share of the targets file); these include freeway trips that end inside the study area, so they are not an expected through count. Modeled through = select-link trips with no end in the study area, per hour. Modeled freeway = select-link trips from or to a freeway node, per hour.

| Block | Observed volume (veh/h) | Observed freeway share | Observed freeway-end trips (veh/h) | Observed through range (veh/h) | Modeled through (veh/h) | In range | Modeled freeway trips (veh/h) |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue NB | 110 | 47.0% | 52 | 48 to 95 | 81 | yes | 136 |
| Colby Street NB | 174 | 47.0% | 82 | 102 to 145 | 158 | above | 136 |
| Hillegass Avenue SB | 160 | 68.0% | 109 | 79 to 120 | 205 | above | 150 |
| Colby Street SB | 160 | 45.0% | 72 | 39 to 117 | 198 | above | 94 |

## Intent map: through cars by where they come from and where they are going

Through = neither trip end is in the study area. Groups are the approach groups of the area config (data/areas); a node that is not a gate takes the group of the nearest surface gate (ASSUMPTION). The arterial is the one a trip would use on the shortest free-flow path with the study area's residential and service streets closed, where that path runs on a boundary street near the study area.

Model figures are the mean of 1 seed(s), per hour of the run. Basis: OBSERVED = read from the resident volunteer count of Feb 25, 2025 or its headline shares; ASSUMPTION = inferred from those numbers or chosen.

### Colby Street NB

Observed: block volume 174 veh/h, whole-street cars 102, so through cars 102 to 145 veh/h. Model: 158 through cars per hour.

Observed (PM): 182 cars entered at the south end, 102 drove the whole street, 164 left it at Alcatraz Ave (131 left, 32 right, 1 straight), and 47% of the block's trips came from a freeway (the headline share). ASSUMPTION: freeway-origin cars that do not end along the street are 65 veh/h (the 82 freeway-origin trips on the block, 47% of 174, times the 182 / (182 + 47) of its cars that entered at the south end rather than joining on the way), spread over the 164 exits in proportion (0.40); the other through cars come from the Telegraph Ave and south-side approaches that feed the street's south end. Ranges: low = 131 (32) x 0.47 x 0.62 (the whole-street share of exits), high = 131 (32) x 0.47.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | OBSERVED turn count x ASSUMPTION share (131 left turns x 0.40) | 52 (38 to 62) | 64 | above |
| Telegraph Ave and south-side traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | ASSUMPTION: the through left-turners (131 x 0.62 = 81) that are not off-ramp traffic | 29 (19 to 43) | 45 | above |
| SR-24 off-ramp traffic using Colby St to reach College Ave and Berkeley (right at Alcatraz Ave) | OBSERVED turn count x ASSUMPTION share (32 right turns x 0.40) | 13 (9 to 15) | 13 | within |
| Telegraph Ave and south-side traffic using Colby St to reach College Ave and Berkeley | ASSUMPTION: the through right-turners (32 x 0.62 = 20) that are not off-ramp traffic | 7 (5 to 11) | 34 | above |
| Intents listed, together | | 101 (71 to 131) | 156 | |
| Other through cars (no intent listed) | | | 2 | |

Model through cars by origin and destination group (largest 12 of 19 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 64.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 27.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 17.0 | Claremont Avenue then College Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Emeryville and West Oakland streets (55th to 67th Streets) | 9.0 | Claremont Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 9.0 | Telegraph Avenue |
| Telegraph Ave to the south (downtown Oakland) | Telegraph Ave from the north (Berkeley) | 6.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Ashby Ave from the west (Emeryville and I-80) | 5.0 | none near the study area |
| West Oakland to the southwest (Adeline St, Market St) | Telegraph Ave from the north (Berkeley) | 4.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Shattuck Ave from the north (Berkeley) | 3.0 | Claremont Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Claremont Ave and Tunnel Rd toward the hills | 3.0 | Claremont Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | College Ave from the north (Berkeley) | 3.0 | SR-24 then Claremont Avenue then College Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 1.0 | Alcatraz Avenue then College Avenue |
| other pairs | | 7.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 111 veh/h; Claremont Avenue 17 veh/h; Claremont Avenue then College Avenue 17 veh/h; none near the study area 6 veh/h; SR-24 then Claremont Avenue then College Avenue 3 veh/h; Alcatraz Avenue then College Avenue 1 veh/h.

### Hillegass Avenue NB

Observed: block volume 110 veh/h, whole-street cars 48, so through cars 48 to 95 veh/h. Model: 81 through cars per hour.

Observed (PM): 94 cars entered at the south end, 48 drove the whole street, 109 left it at Alcatraz Ave (43 west, 54 east, 12 straight), and 47% of the block's trips came from a freeway. ASSUMPTION: freeway-origin through cars are 40 veh/h (52 freeway-origin trips times 94 / (94 + 29)), spread over the exits in proportion (0.37); the through share of exits is 48 / 109 = 0.44.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Hillegass Ave to reach Alcatraz Ave west and Telegraph Ave north | OBSERVED turn count x ASSUMPTION share (43 left turns x 0.37) | 16 (9 to 20) | 18 | within |
| SR-24 off-ramp traffic using Hillegass Ave to reach College Ave and Berkeley | OBSERVED turn count x ASSUMPTION share (54 right turns x 0.37) | 20 (11 to 25) | 35 | above |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach Alcatraz Ave west | ASSUMPTION: through exits (43 x 0.44) that are not off-ramp traffic | 3 (0 to 10) | 6 | within |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach College Ave and Berkeley | ASSUMPTION: through exits (54 x 0.44) that are not off-ramp traffic | 4 (0 to 13) | 18 | above |
| Intents listed, together | | 43 (20 to 68) | 77 | |
| Other through cars (no intent listed) | | | 4 | |

Model through cars by origin and destination group (largest 12 of 23 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 22.0 | SR-24 |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 9.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | College Ave from the north (Berkeley) | 8.0 | SR-24 then Claremont Avenue then College Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 6.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 5.0 | SR-24 then Claremont Avenue |
| Telegraph Ave to the south (downtown Oakland) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 5.0 | Telegraph Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Claremont Ave and Tunnel Rd toward the hills | 4.0 | Claremont Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Ashby Ave from the west (Emeryville and I-80) | 4.0 | SR-24 then Telegraph Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Telegraph Ave from the north (Berkeley) | 2.0 | Telegraph Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Alcatraz Ave from the west (Emeryville side) | 2.0 | SR-24 then Telegraph Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | San Pablo Ave (Emeryville and West Oakland) | 2.0 | SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | San Pablo Ave (Emeryville and West Oakland) | 1.0 | College Avenue then Alcatraz Avenue |
| other pairs | | 11.0 | |

By the arterial these cars would otherwise use: SR-24 25 veh/h; Telegraph Avenue 23 veh/h; SR-24 then Claremont Avenue then College Avenue 8 veh/h; SR-24 then Telegraph Avenue 6 veh/h; Claremont Avenue 5 veh/h; SR-24 then Claremont Avenue 5 veh/h.

### Hillegass Avenue SB

Observed: block volume 160 veh/h, whole-street cars 79, so through cars 79 to 120 veh/h. Model: 205 through cars per hour.

Observed (PM): 178 cars entered at the top (76 turned in from Alcatraz Ave west, 98 from the east, 4 came straight from the north), 79 drove the whole street, and 68% of the block's trips (109 veh/h) went to a freeway. ASSUMPTION: freeway-bound cars that did not join mid-street are 87 veh/h (109 x 178 / (178 + 44)), half of the 174 turn-ins; low = the whole-street share of the turn-ins (0.45), high = the freeway-bound share without the mid-street correction (0.63).

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Telegraph Ave, Alcatraz Ave west and West Berkeley traffic turning off Alcatraz Ave onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (76 turn-ins x 0.50) | 38 (34 to 48) | 40 | within |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (98 turn-ins x 0.50) | 49 (44 to 62) | 64 | above |
| Intents listed, together | | 87 (78 to 110) | 104 | |
| Other through cars (no intent listed) | | | 101 | |

Model through cars by origin and destination group (largest 12 of 20 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 40.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 37.0 | Telegraph Avenue |
| Ashby Ave from the west (Emeryville and I-80) | College Ave from the north (Berkeley) | 30.0 | Alcatraz Avenue then College Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 29.0 | Telegraph Avenue |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 21.0 | College Avenue then Claremont Avenue then SR-24 |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 12.0 | Claremont Avenue then SR-24 |
| Telegraph Ave from the north (Berkeley) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 10.0 | College Avenue |
| West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 7.0 | College Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 4.0 | Alcatraz Avenue then College Avenue |
| Ashby Ave from the west (Emeryville and I-80) | Berkeley hills to the northeast (Evergreen Ln, Gravatt Dr) | 3.0 | none near the study area |
| Ashby Ave from the west (Emeryville and I-80) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 2.0 | Alcatraz Avenue then Claremont Avenue |
| College Ave from the north (Berkeley) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 2.0 | College Avenue |
| other pairs | | 8.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 108 veh/h; Alcatraz Avenue then College Avenue 34 veh/h; College Avenue then Claremont Avenue then SR-24 21 veh/h; College Avenue 19 veh/h; Claremont Avenue then SR-24 12 veh/h; none near the study area 4 veh/h.

### Colby Street SB

Observed: block volume 160 veh/h, whole-street cars 39, so through cars 39 to 117 veh/h. Model: 198 through cars per hour.

Observed (PM): 139 cars entered at the top (76 from Alcatraz Ave west, 50 from the east, 13 from the north), 39 drove the whole street, 45% of the block's trips (72 veh/h) went to a freeway and 22% came by way of Telegraph Ave. ASSUMPTION: freeway-bound cars that did not join mid-street are 46 veh/h (72 x 139 / (139 + 79)), 0.365 of the 126 turn-ins; low = the whole-street share (0.31), high = the unadjusted freeway share (0.57). The Telegraph Ave cars are the 22% x 160 = 35 of the 76 west turn-ins.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Southbound Telegraph Ave traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (35 Telegraph Ave cars x 0.365) | 13 (11 to 20) | 11 | within |
| Alcatraz Ave west, Ashby Ave and West Berkeley traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (41 other west turn-ins x 0.365) | 15 (13 to 23) | 13 | within |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (50 east turn-ins x 0.365) | 18 (15 to 29) | 30 | above |
| Intents listed, together | | 46 (39 to 72) | 54 | |
| Other through cars (no intent listed) | | | 144 | |

Model through cars by origin and destination group (largest 12 of 25 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 70.0 | Telegraph Avenue |
| Ashby Ave from the west (Emeryville and I-80) | College Ave from the north (Berkeley) | 29.0 | Alcatraz Avenue then College Avenue |
| Telegraph Ave from the north (Berkeley) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 17.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 15.0 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 11.0 | Claremont Avenue then SR-24 |
| West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 8.0 | College Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 8.0 | Telegraph Avenue |
| Shattuck Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 6.0 | none near the study area |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | West Oakland to the southwest (Adeline St, Market St) | 5.0 | Telegraph Avenue |
| Ashby Ave from the west (Emeryville and I-80) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 4.0 | SR-24 |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 4.0 | College Avenue then Claremont Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Telegraph Ave to the south (downtown Oakland) | 3.0 | Telegraph Avenue |
| other pairs | | 18.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 119 veh/h; Alcatraz Avenue then College Avenue 30 veh/h; none near the study area 15 veh/h; Claremont Avenue then SR-24 11 veh/h; College Avenue 8 veh/h; SR-24 6 veh/h.

### Study area, all residential and service streets

Model: 974 through cars per hour.

Model through cars by origin and destination group (largest 12 of 78 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 159.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 88.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 72.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 57.0 | Telegraph Avenue |
| Ashby Ave from the west (Emeryville and I-80) | College Ave from the north (Berkeley) | 56.0 | Alcatraz Avenue then College Avenue |
| Telegraph Ave from the north (Berkeley) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 47.0 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 47.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 38.0 | Claremont Avenue then College Avenue |
| Telegraph Ave to the south (downtown Oakland) | SR-24 westbound on-ramps (toward Oakland and I-980) | 38.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Emeryville and West Oakland streets (55th to 67th Streets) | 36.0 | Claremont Avenue |
| West Oakland to the southwest (Adeline St, Market St) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 33.0 | Telegraph Avenue then Claremont Avenue |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 24.0 | College Avenue then Claremont Avenue then SR-24 |
| other pairs | | 279.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 564 veh/h; Claremont Avenue 68 veh/h; Alcatraz Avenue then College Avenue 63 veh/h; none near the study area 56 veh/h; Claremont Avenue then College Avenue 38 veh/h; SR-24 37 veh/h.

By origin group: Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 273; South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 152; SR-24 eastbound off-ramps (arriving from Oakland and I-980) 127; Telegraph Ave from the north (Berkeley) 100; Ashby Ave from the west (Emeryville and I-80) 70; Telegraph Ave to the south (downtown Oakland) 57; West Oakland to the southwest (Adeline St, Market St) 49; Emeryville and West Oakland streets (55th to 67th Streets) 32; College Ave from the north (Berkeley) 28; Claremont Ave and Tunnel Rd toward the hills 23.

By destination group: South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 267; SR-24 westbound on-ramps (toward Oakland and I-980) 233; Telegraph Ave from the north (Berkeley) 122; Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 114; College Ave from the north (Berkeley) 71; Claremont Ave and Tunnel Rd toward the hills 52; Emeryville and West Oakland streets (55th to 67th Streets) 39; San Pablo Ave (Emeryville and West Oakland) 13; Shattuck Ave from the north (Berkeley) 13; Ashby Ave from the west (Emeryville and I-80) 11.


## Through cars by intent (cut-through intent view)

A through car is tallied once, under the first intent that fits it (the on-ramp on its planned route, the off-ramp it has driven, or the origin and destination groups of its trip), at the moment the through count counts it. Cars an hour over the run, the same window as the through-car figure (989 an hour).

| Intent | Basis | Cars an hour | Share |
| --- | --- | --- | --- |
| on-2853241697 | observed | 237 | 24% |
| Other on-ramps | assumed | 14 | 1% |
| off-52990846 | observed | 131 | 13% |
| Other off-ramps | assumed | 16 | 2% |
| Downtown, south and west Oakland traffic using side streets to reach Berkeley and Telegraph Ave north | assumed | 133 | 13% |
| Berkeley and Telegraph Ave north traffic using side streets to reach downtown, south and west Oakland | assumed | 228 | 23% |
| Oakland cross-town traffic (West Oakland, Broadway, Piedmont, Emeryville) using side streets near Claremont Ave and Telegraph Ave | assumed | 85 | 9% |
| Other (no intent listed) |  | 145 | 15% |

Intents listed cover 85% of through cars.


## Select-link shares: modeled vs observed (design D5: headline = freeway shares, tolerance +/-10 pp)

- Hillegass Avenue NB: 4 links (path Claremont Avenue -> Alcatraz Avenue (434 m)), 236 trips (209 completed)
- Colby Street NB: 8 links (path Claremont Avenue -> Alcatraz Avenue (680 m)), 320 trips (290 completed)
- Hillegass Avenue SB: 4 links (path Alcatraz Avenue -> Claremont Avenue (433 m)), 315 trips (290 completed)
- Colby Street SB: 8 links (path Alcatraz Avenue -> Claremont Avenue (680 m)), 357 trips (331 completed)

| Block | Side | Via | Observed | Modeled | Diff (pp) | n trips | Headline |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue NB | from | freeway | 47% | 52% | +5 | 236 | within |
| Hillegass Avenue NB | to | Benvenue Avenue | 21% (PM 33%) | 4% | -29 | 236 |  |
| Hillegass Avenue NB | to | College Avenue | 6% | 16% | +10 | 236 |  |
| Hillegass Avenue NB | to | Alcatraz Avenue WB | 27% | 25% | -2 | 236 |  |
| Colby Street NB | from | freeway | 47% | 40% | -7 | 320 | within |
| Colby Street NB | to | Alcatraz Avenue WB | 48% | 43% | -5 | 320 |  |
| Colby Street NB | to | Telegraph Avenue | 25% | 40% | +15 | 320 |  |
| Colby Street NB | to | College Avenue | 3% | 4% | +1 | 320 |  |
| Hillegass Avenue SB | from | Alcatraz Avenue WB | 46% | 26% | -20 | 315 |  |
| Hillegass Avenue SB | from | Benvenue Avenue | 26% | 5% | -21 | 315 |  |
| Hillegass Avenue SB | from | College Avenue | 16% | 17% | +1 | 315 |  |
| Hillegass Avenue SB | to | freeway | 57% (PM 68%) | 47% | -21 | 315 | OUTSIDE |
| Colby Street SB | from | Alcatraz Avenue EB | 43% | 26% | -17 | 357 |  |
| Colby Street SB | from | Alcatraz Avenue WB | 46% | 14% | -32 | 357 |  |
| Colby Street SB | from | Telegraph Avenue | 22% | 26% | +4 | 357 |  |
| Colby Street SB | to | freeway | 45% | 26% | -19 | 357 | OUTSIDE |
| Colby Street SB | to | Forest Street | 34% | 27% | -7 | 357 |  |

Headline shares within tolerance: 2 of 4. Observed column uses the PM-peak share where one is given and the period is pm_peak. 'Via' shares are the fraction of select-link trips using that street before (from) or after (to) the block; freeway = origin / destination gate with a motorway-class link attached.

## Claremont ramps: streets used before the on-ramp / after the off-ramp

Observed shares are for traffic from/to the north only. 'Modeled' is over all trips on the ramps and any visit to the street (an upper bound for streets that serve both sides). 'Modeled, side' counts only trips whose surface end lies on the side of the ramp stated in the targets file (`freewayRamp.side`), and for a street with a qualifier ("north of X") only its links on that side of X.

| Direction | Via | Observed | Modeled | n ramp trips | Modeled, side | n side trips |
| --- | --- | --- | --- | --- | --- | --- |
| onto freeway | College Avenue | 16% | 14% | 860 | 15% | 757 |
| onto freeway | Hillegass Avenue | 12% | 14% | 860 | 16% | 757 |
| onto freeway | Martin Street | 10% | 15% | 860 | 13% | 757 |
| onto freeway | Colby Street | 8% | 9% | 860 | 10% | 757 |
| onto freeway | Telegraph Avenue north of Alcatraz Avenue | 8% | 17% | 860 | 11% | 757 |
| onto freeway | Benvenue Avenue | 5% | 2% | 860 | 3% | 757 |
| from freeway | College Avenue | 10% | 9% | 774 | 9% | 741 |
| from freeway | Martin Street | 10% | 11% | 774 | 12% | 741 |
| from freeway | Colby Street | 8% | 13% | 774 | 14% | 741 |
| from freeway | Hillegass Avenue | 5% | 7% | 774 | 7% | 741 |
| from freeway | Benvenue Avenue | 3% | 2% | 774 | 2% | 741 |

## Top 15 links by delay

| Link | Street | Class | Lanes | Len (m) | End node control | Delay (veh-h) | Stopped (veh-h) | Mean stopped veh | Flow (veh/h) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 4175 | (unnamed) | Motorway | 2 | 142 | uncontrolled | 21.92 | 3.92 | 3.9 | 1519 |
| 4143 | Adeline Street | Secondary | 3 | 185 | signal | 18.00 | 13.18 | 13.2 | 890 |
| 4397 | Ashby Avenue | Primary | 2 | 96 | signal | 13.41 | 10.70 | 10.7 | 472 |
| 2921 | Russell Street | Residential | 1 | 260 | uncontrolled | 10.47 | 8.66 | 8.7 | 174 |
| 1122 | Alcatraz Avenue | Tertiary | 1 | 299 | signal | 10.04 | 7.23 | 7.2 | 382 |
| 460 | Sacramento Street | Tertiary | 2 | 104 | two_way_stop | 9.23 | 7.78 | 7.8 | 346 |
| 1089 | Market Street | Tertiary | 2 | 111 | two_way_stop | 8.58 | 6.21 | 6.2 | 848 |
| 1025 | Martin Luther King Junior Way | Secondary | 3 | 79 | signal | 8.48 | 6.06 | 6.1 | 1384 |
| 4382 | Warren Freeway | Motorway | 2 | 744 | uncontrolled | 8.35 | 2.86 | 2.9 | 1015 |
| 769 | Martin Luther King Junior Way | Secondary | 3 | 112 | signal | 7.78 | 5.07 | 5.1 | 1577 |
| 1051 | Adeline Street | Secondary | 4 | 50 | signal | 7.45 | 6.12 | 6.1 | 1738 |
| 3370 | The Uplands | Tertiary | 1 | 311 | uncontrolled | 6.64 | 5.05 | 5.1 | 186 |
| 4167 | (unnamed) | Motorway | 3 | 75 | uncontrolled | 6.46 | 1.69 | 1.7 | 2614 |
| 2819 | College Avenue | Tertiary | 2 | 50 | signal | 6.43 | 5.36 | 5.4 | 643 |
| 4160 | (unnamed) | Motorway | 2 | 513 | uncontrolled | 6.37 | 3.00 | 3.0 | 1080 |

## Top 15 nodes by blocked time

Blocked time = lane-head seconds waiting at the stop line without permission (signal red, conflict, stop sign or no downstream space).

| Node | Streets | Control | Gate | Blocked (lane-h) | of which no downstream space | Signal plan at end (cycle: greens) |
| --- | --- | --- | --- | --- | --- | --- |
| 680 | 52nd Street / Shattuck Avenue | signal |  | 4.84 | 0.07 | 110 s: 30/28/38 |
| 1080 | 62nd Street / Claremont Avenue / College Avenue | signal |  | 4.75 | 0.17 | 75 s: 17/26/17 |
| 446 | Market Street / Stanford Avenue | signal |  | 4.65 | 0.19 | 75 s: 48/17 |
| 447 | Adeline Street / Alcatraz Avenue | signal |  | 4.60 | 0.29 | 75 s: 39/26 |
| 479 | Adeline Street / Martin Luther King Junior Way / Stanford Avenue | signal |  | 3.48 | 0.04 | 75 s: 38/27 |
| 30 | 57th Street / Adeline Street / Market Street | signal |  | 3.33 | 0.04 | 75 s: 17/28/15 |
| 37 | San Pablo Avenue / Stanford Avenue | signal |  | 3.26 | 0.05 | 75 s: 27/38 |
| 331 | 52nd Street / Martin Luther King Junior Way | signal |  | 3.21 | 0.02 | 75 s: 32/33 |
| 1069 | Claremont Avenue / Colby Street / Forest Street | signal |  | 3.03 | 0.03 | 79 s: 24/4/36 |
| 1406 | Ashby Avenue / Claremont Avenue | signal |  | 3.01 | 0.25 | 75 s: 47/18 |
| 185 | Alcatraz Avenue / Sacramento Street | signal |  | 2.99 | 0.09 | 75 s: 28/37 |
| 17 | 45th Street / San Pablo Avenue | signal |  | 2.95 | 0.03 | 75 s: 23/42 |
| 613 | 52nd Street / Claremont Avenue / Telegraph Avenue | signal |  | 2.90 | 0.10 | 75 s: 46/19 |
| 242 | Ashby Avenue / Martin Luther King Junior Way | signal |  | 2.84 | 0.00 | 75 s: 37/28 |
| 713 | 51st Street / Telegraph Avenue | signal |  | 2.80 | 0.02 | 75 s: 32/33 |

Phases of the five most blocked signals (green s: approach links with their lanes, link ids in brackets):

- node 680: 30 s: 52nd Street 4L [1662]; 28 s: 52nd Street 4L [1666], 52nd Street 4L [1662]; 38 s: Shattuck Avenue 2L [1653], Shattuck Avenue 2L [1705]
- node 1080: 17 s: Claremont Avenue 2L [2756], Claremont Avenue 2L [2798]; 26 s: College Avenue 2L [2761], College Avenue 2L [2819]; 17 s: 62nd Street 1L [2622]
- node 446: 48 s: Stanford Avenue 3L [941], Stanford Avenue 3L [1055]; 17 s: Market Street 4L [1108], Market Street 3L [1111]
- node 447: 39 s: Adeline Street 4L [1049], Adeline Street 4L [1051]; 26 s: Alcatraz Avenue 2L [1048], Alcatraz Avenue 2L [1133]
- node 479: 38 s: Martin Luther King Junior Way 3L [1025], Adeline Street 3L [4143]; 27 s: Stanford Avenue 3L [4139]

## Junction recovery

Policy `physical`. Node entries by cars and cyclists in the run: 806926 (settle interval 0). An admission is an entry the ordinary rule would have refused; head-seconds count the time a waiting head vehicle had the reason invoked, and the part of it in which it still could not enter. Courtesy and the yield fallback change priority only; under `physical` the conflict bypass never admits.

| Reason | Admissions per hour | Per 1,000 entries | Head-s invoked | Head-s blocked |
| --- | --- | --- | --- | --- |
| courtesy | 341.0 | 0.423 | 1440 | 1335 |
| yield fallback | 158.0 | 0.196 | 44 | 0 |
| conflict bypass | 0.0 | 0.000 | 32 | 32 |

Vehicles removed while held in a node by a full exit: 0 (0.0 per hour, included in the gridlock removals).

| Node | Streets | Control | Courtesy | Yield fallback | Conflict bypass | Held removals |
| --- | --- | --- | --- | --- | --- | --- |
| 141 | 63rd Street / Lowell Street / Market Street | two_way_stop | 20 | 6 | 0 | 0 |
| 165 | Alcatraz Avenue / Baker Street | two_way_stop | 14 | 6 | 0 | 0 |
| 342 | 56th Street / Shattuck Avenue | two_way_stop | 7 | 11 | 0 | 0 |
| 1080 | 62nd Street / Claremont Avenue / College Avenue | signal | 17 | 0 | 0 | 0 |
| 1429 | Claremont Avenue / Claremont Boulevard | two_way_stop | 14 | 2 | 0 | 0 |
| 457 | Alcatraz Avenue / California Street | two_way_stop | 10 | 5 | 0 | 0 |
| 460 | Alcatraz Avenue / Ellis Street | two_way_stop | 5 | 7 | 0 | 0 |
| 767 | 58th Street / Shattuck Avenue | two_way_stop | 8 | 4 | 0 | 0 |
| 430 | Alcatraz Avenue / King Street | two_way_stop | 4 | 7 | 0 | 0 |
| 766 | 57th Street / Shattuck Avenue | two_way_stop | 6 | 5 | 0 | 0 |

## Entry backlog by origin node at end of run (top 10)

| Node | Streets | Trips waiting | Offered veh/h (before scale) |
| --- | --- | --- | --- |
| 602 | Grove Shafter Freeway | 49 | 4113 |
| 654 | 53rd Street / Shattuck Avenue | 4 | 19 |
| 265 | Ashby Avenue | 2 | 1134 |
| 1089 | 63rd Street / College Avenue | 2 | 342 |
| 702 | Aileen Street / Telegraph Avenue | 1 | 15 |
| 924 | Ashby Avenue / Regent Street | 1 | 40 |
| 1080 | 62nd Street / Claremont Avenue / College Avenue | 1 | 150 |
| 1090 | 63rd Street / Hillegass Avenue | 1 | 19 |

## Flow on key streets (veh/h per direction, study-area links of 40 m or more)

| Street | Direction of travel | Links | Median flow | Max flow |
| --- | --- | --- | --- | --- |
| Telegraph | N | 12 | 973 | 1080 |
| Telegraph | S | 10 | 1014 | 1078 |
| College | N | 3 | 427 | 427 |
| College | S | 3 | 642 | 643 |
| Claremont | N | 6 | 479 | 715 |
| Claremont | S | 7 | 437 | 922 |
| Alcatraz | E | 6 | 485 | 526 |
| Alcatraz | W | 6 | 371 | 379 |
| Hillegass | N | 4 | 137 | 140 |
| Hillegass | S | 4 | 218 | 254 |
| Colby | N | 7 | 167 | 226 |
| Colby | S | 7 | 166 | 229 |
| Martin | E | 2 | 198 | 198 |
| Martin | W | 2 | 122 | 122 |

## Largest demand origins (offered, before scale)

| Node | Streets | Veh/h |
| --- | --- | --- |
| 602 | Grove Shafter Freeway | 4113 |
| 1672 | Warren Freeway | 1289 |
| 265 | Ashby Avenue | 1134 |
| 183 | San Pablo Avenue | 968 |
| 943 | Telegraph Avenue / Ward Street | 940 |
| 974 | Broadway | 806 |
| 763 | Telegraph Avenue | 636 |
| 104 | San Pablo Avenue | 536 |
| 276 | Martin Luther King Junior Way | 515 |
| 184 | Alcatraz Avenue | 452 |
