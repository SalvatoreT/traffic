# Calibration report: rockridge pm_peak scale 1 seed 1 (60 min)

Offered demand 25343 veh/h x scale 1 = 25343 veh/h. Run took 24.6 s wall clock. Flow tables use the window after a 10 min warm-up; select-link and health figures cover the whole run from an empty network.

## Stability (design D4)

| Criterion | Threshold | Value | Result |
| --- | --- | --- | --- |
| Gridlock removals | 0 | 0 | pass |
| Backlog / spawned | < 2% | 0.1% (14 of 25259) | pass |
| Arterial mean speed (run) | > 4 m/s | 9.19 m/s (last 15 min 9.18) | pass |

Overall: **STABLE**. Mean trip delay 143 s, mean trip time 432 s, completed 24144, unroutable 0.

| t (min) | vehicles in network | backlog | completed | removals | arterial speed in interval (m/s) |
| --- | --- | --- | --- | --- | --- |
| 5 | 2897 | 9 | 2100 | 0 | 9.40 |
| 10 | 3083 | 2 | 4090 | 0 | 9.27 |
| 15 | 3118 | 1 | 6128 | 0 | 9.21 |
| 20 | 3152 | 5 | 8190 | 0 | 9.30 |
| 25 | 3267 | 6 | 10209 | 0 | 9.28 |
| 30 | 3328 | 10 | 12259 | 0 | 9.36 |
| 35 | 3474 | 9 | 14251 | 0 | 9.26 |
| 40 | 3578 | 5 | 16255 | 0 | 8.82 |
| 45 | 3639 | 13 | 18213 | 0 | 8.89 |
| 50 | 3809 | 9 | 20173 | 0 | 9.45 |
| 55 | 3955 | 13 | 22166 | 0 | 9.04 |
| 60 | 4065 | 14 | 24144 | 0 | 9.04 |
## Wandering (completed car trips)

Detour ratio = distance driven (link and movement lengths) over the shortest network distance from the trip's origin to its destination. Detour against the free-flow route uses the time-shortest route with no congestion and no noise, which is what a purposeful driver without live information would follow (it differs from the shortest distance when a faster, longer road exists). A switch is a change of the remaining route while en route. Loops: the same link twice or the same node three or more times. Reversals: a link followed by its reverse within 200 m. 'Study-area vehicle-miles' are miles driven on links inside the study area; the last column is the share of them driven by trips with a detour ratio above 1.3. Guided drivers re-evaluate their route every epoch; the others keep their departure route unless it is blocked.

| Trips | n | Switches per trip | With a switch | Mean detour | Median detour | Detour > 1.3 | Detour > 2 | Mean detour vs free-flow route | Vs free-flow route > 1.3 | Loops | Reversals | Study veh-miles | Of them by detour > 1.3 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| all trips | 22068 | 0.01 | 0.9% | 1.091 | 1.055 | 5.2% | 0.1% | 1.030 | 2.2% | 0.0% | 5.2% | 2288 | 7.9% |
| gate to gate | 7972 | 0.01 | 1.4% | 1.090 | 1.057 | 4.1% | 0.1% | 1.027 | 2.3% | 0.0% | 7.6% | 525 | 9.9% |
| with a local end | 14096 | 0.01 | 0.6% | 1.092 | 1.054 | 5.8% | 0.1% | 1.032 | 2.1% | 0.0% | 3.9% | 1763 | 7.3% |
| guided drivers | 10085 | 0.02 | 1.8% | 1.092 | 1.055 | 5.3% | 0.0% | 1.030 | 2.2% | 0.0% | 5.2% | 1041 | 7.2% |
| other drivers | 11983 | 0.00 | 0.1% | 1.091 | 1.055 | 5.1% | 0.1% | 1.031 | 2.2% | 0.0% | 5.2% | 1247 | 8.4% |

## Reported patterns (diagnostics; configured in the targets file under `patterns`)

(a) Trips between the surface gates on the north side of the ramps and the freeway mainline gates, and the local-street (residential and service links in the study area) vehicle-miles they drive. Share = of all completed trips' local-street vehicle-miles (448 miles). No observed counterpart exists for this quantity (the targets file has only the select-link shares above).

| Trips | n trips | Local-street veh-miles | Share of all local-street veh-miles |
| --- | --- | --- | --- |
| surface gates to the freeway | 1811 | 40.4 | 9% |
| freeway to the surface gates | 883 | 28.6 | 6% |

(b) Corridor trips: completed trips from beyond one end of the corridor's study-area extent (the bypass street and its arterial together) to beyond the other end, within a lateral limit of the corridor, by direction. 'Bypass' = at least N blocks (links) on the bypass street; 'arterial' = fewer bypass blocks and at least N on the arterial; 'other' = neither (another street, the freeway or a short use); blocks are counted on the corridor's study-area links. No observed counterpart exists for these shares. The related observed values are in the select-link table above: northbound Hillegass Ave traffic rarely ends on College Ave (6%), 21 to 33% jogs to Benvenue Ave, and southbound freeway-bound drivers on College Ave commonly arrive via Ashby Ave and Benvenue Ave and jog to Hillegass Ave.

| Bypass | Arterial | N | Direction | Corridor trips | Bypass | Arterial | Other | Mean bypass blocks |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue | College Avenue | 3 | N | 1526 | 2% | 17% | 81% | 0.1 |
| Hillegass Avenue | College Avenue | 3 | S | 1438 | 5% | 25% | 70% | 0.2 |

## Per-mode results

Offered: 25343 car veh/h; 626 bicycle flows (764/h); 2000 pedestrian flows (1731/h). Bicycle and pedestrian volumes are assumptions, not counts.

| Mode | In network | Completed | Mean time (s) | Other |
| --- | --- | --- | --- | --- |
| Car | 4065 | 24144 | 432 | |
| Bicycle | 64 | 778 | 267 | |
| Pedestrian | 224 | 1616 | 446 | mean crossing delay 8.5 s |

Vulnerable road users (surrogate indicators): pedestrian conflicts 296, bicycle conflicts 533, close passes 507, pedestrian injury-risk index 0.049, bicycle injury-risk index 0.065 (proxy), mean vehicle speed at pedestrian encounters 2.50 m/s.


## Through cars on the counted blocks (a car is through when neither trip end is in the study area)

Observed through range = from the cars that drove the whole street (volunteer count, a lower bound) to the block volume less the cars whose trip ends along the street (an upper bound). Observed freeway-end trips = observed block volume times the observed freeway share of the street (the headline share of the targets file); these include freeway trips that end inside the study area, so they are not an expected through count. Modeled through = select-link trips with no end in the study area, per hour. Modeled freeway = select-link trips from or to a freeway node, per hour.

| Block | Observed volume (veh/h) | Observed freeway share | Observed freeway-end trips (veh/h) | Observed through range (veh/h) | Modeled through (veh/h) | In range | Modeled freeway trips (veh/h) |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue NB | 110 | 47.0% | 52 | 48 to 95 | 74 | yes | 114 |
| Colby Street NB | 174 | 47.0% | 82 | 102 to 145 | 130 | yes | 104 |
| Hillegass Avenue SB | 160 | 68.0% | 109 | 79 to 120 | 116 | yes | 128 |
| Colby Street SB | 160 | 45.0% | 72 | 39 to 117 | 127 | above | 127 |

## Intent map: through cars by where they come from and where they are going

Through = neither trip end is in the study area. Groups are the approach groups of the area config (data/areas); a node that is not a gate takes the group of the nearest surface gate (ASSUMPTION). The arterial is the one a trip would use on the shortest free-flow path with the study area's residential and service streets closed, where that path runs on a boundary street near the study area.

Model figures are the mean of 1 seed(s), per hour of the run. Basis: OBSERVED = read from the resident volunteer count of Feb 25, 2025 or its headline shares; ASSUMPTION = inferred from those numbers or chosen.

### Colby Street NB

Observed: block volume 174 veh/h, whole-street cars 102, so through cars 102 to 145 veh/h. Model: 130 through cars per hour.

Observed (PM): 182 cars entered at the south end, 102 drove the whole street, 164 left it at Alcatraz Ave (131 left, 32 right, 1 straight), and 47% of the block's trips came from a freeway (the headline share). ASSUMPTION: freeway-origin cars that do not end along the street are 65 veh/h (the 82 freeway-origin trips on the block, 47% of 174, times the 182 / (182 + 47) of its cars that entered at the south end rather than joining on the way), spread over the 164 exits in proportion (0.40); the other through cars come from the Telegraph Ave and south-side approaches that feed the street's south end. Ranges: low = 131 (32) x 0.47 x 0.62 (the whole-street share of exits), high = 131 (32) x 0.47.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | OBSERVED turn count x ASSUMPTION share (131 left turns x 0.40) | 52 (38 to 62) | 44 | within |
| Telegraph Ave and south-side traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | ASSUMPTION: the through left-turners (131 x 0.62 = 81) that are not off-ramp traffic | 29 (19 to 43) | 48 | above |
| SR-24 off-ramp traffic using Colby St to reach College Ave and Berkeley (right at Alcatraz Ave) | OBSERVED turn count x ASSUMPTION share (32 right turns x 0.40) | 13 (9 to 15) | 19 | above |
| Telegraph Ave and south-side traffic using Colby St to reach College Ave and Berkeley | ASSUMPTION: the through right-turners (32 x 0.62 = 20) that are not off-ramp traffic | 7 (5 to 11) | 19 | above |
| Intents listed, together | | 101 (71 to 131) | 130 | |
| Other through cars (no intent listed) | | | 0 | |

Model through cars by origin and destination group (largest 12 of 21 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 28.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 11.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 10.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Ashby Ave from the west (Emeryville and I-80) | 9.0 | none near the study area |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Shattuck Ave from the north (Berkeley) | 9.0 | Claremont Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Emeryville and West Oakland streets (55th to 67th Streets) | 9.0 | Claremont Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Ashby Ave from the west (Emeryville and I-80) | 9.0 | SR-24 then Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 8.0 | Claremont Avenue then College Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 7.0 | SR-24 |
| West Oakland to the southwest (Adeline St, Market St) | Telegraph Ave from the north (Berkeley) | 6.0 | Telegraph Avenue |
| Telegraph Ave to the south (downtown Oakland) | Telegraph Ave from the north (Berkeley) | 6.0 | Telegraph Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Telegraph Ave from the north (Berkeley) | 5.0 | none near the study area |
| other pairs | | 13.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 63 veh/h; Claremont Avenue 24 veh/h; none near the study area 14 veh/h; SR-24 then Telegraph Avenue 9 veh/h; Claremont Avenue then College Avenue 8 veh/h; SR-24 7 veh/h.

### Hillegass Avenue NB

Observed: block volume 110 veh/h, whole-street cars 48, so through cars 48 to 95 veh/h. Model: 74 through cars per hour.

Observed (PM): 94 cars entered at the south end, 48 drove the whole street, 109 left it at Alcatraz Ave (43 west, 54 east, 12 straight), and 47% of the block's trips came from a freeway. ASSUMPTION: freeway-origin through cars are 40 veh/h (52 freeway-origin trips times 94 / (94 + 29)), spread over the exits in proportion (0.37); the through share of exits is 48 / 109 = 0.44.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Hillegass Ave to reach Alcatraz Ave west and Telegraph Ave north | OBSERVED turn count x ASSUMPTION share (43 left turns x 0.37) | 16 (9 to 20) | 22 | above |
| SR-24 off-ramp traffic using Hillegass Ave to reach College Ave and Berkeley | OBSERVED turn count x ASSUMPTION share (54 right turns x 0.37) | 20 (11 to 25) | 24 | within |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach Alcatraz Ave west | ASSUMPTION: through exits (43 x 0.44) that are not off-ramp traffic | 3 (0 to 10) | 5 | within |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach College Ave and Berkeley | ASSUMPTION: through exits (54 x 0.44) that are not off-ramp traffic | 4 (0 to 13) | 21 | above |
| Intents listed, together | | 43 (20 to 68) | 72 | |
| Other through cars (no intent listed) | | | 2 | |

Model through cars by origin and destination group (largest 12 of 20 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 14.0 | SR-24 |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 12.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 11.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 5.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | College Ave from the north (Berkeley) | 5.0 | SR-24 then Claremont Avenue then College Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Ashby Ave from the west (Emeryville and I-80) | 3.0 | College Avenue then Alcatraz Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | San Pablo Ave (Emeryville and West Oakland) | 3.0 | SR-24 |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Shattuck Ave from the north (Berkeley) | 3.0 | SR-24 then Telegraph Avenue then Alcatraz Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Telegraph Ave from the north (Berkeley) | 3.0 | none near the study area |
| West Oakland to the southwest (Adeline St, Market St) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 2.0 | Telegraph Avenue |
| West Oakland to the southwest (Adeline St, Market St) | College Ave from the north (Berkeley) | 2.0 | Telegraph Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Berkeley hills to the northeast (Evergreen Ln, Gravatt Dr) | 2.0 | Telegraph Avenue then SR-24 |
| other pairs | | 9.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 33 veh/h; SR-24 17 veh/h; College Avenue then Alcatraz Avenue 5 veh/h; SR-24 then Claremont Avenue then College Avenue 5 veh/h; Claremont Avenue 4 veh/h; SR-24 then Telegraph Avenue then Alcatraz Avenue 3 veh/h.

### Hillegass Avenue SB

Observed: block volume 160 veh/h, whole-street cars 79, so through cars 79 to 120 veh/h. Model: 116 through cars per hour.

Observed (PM): 178 cars entered at the top (76 turned in from Alcatraz Ave west, 98 from the east, 4 came straight from the north), 79 drove the whole street, and 68% of the block's trips (109 veh/h) went to a freeway. ASSUMPTION: freeway-bound cars that did not join mid-street are 87 veh/h (109 x 178 / (178 + 44)), half of the 174 turn-ins; low = the whole-street share of the turn-ins (0.45), high = the freeway-bound share without the mid-street correction (0.63).

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Telegraph Ave, Alcatraz Ave west and West Berkeley traffic turning off Alcatraz Ave onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (76 turn-ins x 0.50) | 38 (34 to 48) | 43 | within |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (98 turn-ins x 0.50) | 49 (44 to 62) | 58 | within |
| Intents listed, together | | 87 (78 to 110) | 101 | |
| Other through cars (no intent listed) | | | 15 | |

Model through cars by origin and destination group (largest 12 of 11 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 43.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 26.0 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 14.0 | Claremont Avenue then SR-24 |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 14.0 | College Avenue then Claremont Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 8.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 3.0 | Alcatraz Avenue then College Avenue |
| Ashby Ave from the west (Emeryville and I-80) | College Ave from the north (Berkeley) | 2.0 | Alcatraz Avenue then College Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 2.0 | Claremont Avenue |
| Berkeley hills to the northeast (Evergreen Ln, Gravatt Dr) | SR-24 westbound on-ramps (toward Oakland and I-980) | 2.0 | Claremont Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Telegraph Ave to the south (downtown Oakland) | 1.0 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 1.0 | Telegraph Avenue |

By the arterial these cars would otherwise use: Telegraph Avenue 79 veh/h; Claremont Avenue then SR-24 16 veh/h; College Avenue then Claremont Avenue then SR-24 14 veh/h; Alcatraz Avenue then College Avenue 5 veh/h; Claremont Avenue 2 veh/h.

### Colby Street SB

Observed: block volume 160 veh/h, whole-street cars 39, so through cars 39 to 117 veh/h. Model: 127 through cars per hour.

Observed (PM): 139 cars entered at the top (76 from Alcatraz Ave west, 50 from the east, 13 from the north), 39 drove the whole street, 45% of the block's trips (72 veh/h) went to a freeway and 22% came by way of Telegraph Ave. ASSUMPTION: freeway-bound cars that did not join mid-street are 46 veh/h (72 x 139 / (139 + 79)), 0.365 of the 126 turn-ins; low = the whole-street share (0.31), high = the unadjusted freeway share (0.57). The Telegraph Ave cars are the 22% x 160 = 35 of the 76 west turn-ins.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Southbound Telegraph Ave traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (35 Telegraph Ave cars x 0.365) | 13 (11 to 20) | 20 | within |
| Alcatraz Ave west, Ashby Ave and West Berkeley traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (41 other west turn-ins x 0.365) | 15 (13 to 23) | 16 | within |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (50 east turn-ins x 0.365) | 18 (15 to 29) | 55 | above |
| Intents listed, together | | 46 (39 to 72) | 91 | |
| Other through cars (no intent listed) | | | 36 | |

Model through cars by origin and destination group (largest 12 of 21 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 38.0 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 19.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 17.0 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 11.0 | Claremont Avenue then SR-24 |
| Shattuck Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 7.0 | none near the study area |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 6.0 | College Avenue then Claremont Avenue then SR-24 |
| Telegraph Ave from the north (Berkeley) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 5.0 | Telegraph Avenue |
| Alcatraz Ave from the west (Emeryville side) | SR-13 Warren Freeway (via SR-24 east) | 4.0 | SR-24 |
| Ashby Ave from the west (Emeryville and I-80) | College Ave from the north (Berkeley) | 4.0 | Alcatraz Avenue then College Avenue |
| Alcatraz Ave from the west (Emeryville side) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 2.0 | SR-24 |
| Ashby Ave from the west (Emeryville and I-80) | SR-13 Warren Freeway (via SR-24 east) | 2.0 | SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 2.0 | Alcatraz Avenue then College Avenue |
| other pairs | | 10.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 81 veh/h; Claremont Avenue then SR-24 11 veh/h; SR-24 9 veh/h; none near the study area 9 veh/h; Alcatraz Avenue then College Avenue 6 veh/h; College Avenue then Claremont Avenue then SR-24 6 veh/h.

### Study area, all residential and service streets

Model: 682 through cars per hour.

Model through cars by origin and destination group (largest 12 of 63 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 90.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 68.0 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 63.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 46.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 45.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Emeryville and West Oakland streets (55th to 67th Streets) | 35.0 | Claremont Avenue |
| West Oakland to the southwest (Adeline St, Market St) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 31.0 | Telegraph Avenue then Claremont Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 28.0 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 21.0 | Claremont Avenue then SR-24 |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 21.0 | SR-24 |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 18.0 | College Avenue then Claremont Avenue then SR-24 |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Ashby Ave from the west (Emeryville and I-80) | 16.0 | College Avenue then Alcatraz Avenue |
| other pairs | | 200.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 395 veh/h; Claremont Avenue 64 veh/h; SR-24 34 veh/h; Telegraph Avenue then Claremont Avenue 31 veh/h; Claremont Avenue then SR-24 23 veh/h; none near the study area 23 veh/h.

By origin group: Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 150; SR-24 eastbound off-ramps (arriving from Oakland and I-980) 143; South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 115; Telegraph Ave from the north (Berkeley) 79; West Oakland to the southwest (Adeline St, Market St) 58; SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) 26; Telegraph Ave to the south (downtown Oakland) 24; Claremont Ave and Tunnel Rd toward the hills 23; College Ave from the north (Berkeley) 20; Ashby Ave from the west (Emeryville and I-80) 11.

By destination group: SR-24 westbound on-ramps (toward Oakland and I-980) 212; Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 111; South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 96; Telegraph Ave from the north (Berkeley) 82; Claremont Ave and Tunnel Rd toward the hills 48; Emeryville and West Oakland streets (55th to 67th Streets) 36; Ashby Ave from the west (Emeryville and I-80) 26; Shattuck Ave from the north (Berkeley) 20; College Ave from the north (Berkeley) 18; SR-13 Warren Freeway (via SR-24 east) 7.


## Select-link shares: modeled vs observed (design D5: headline = freeway shares, tolerance +/-10 pp)

- Hillegass Avenue NB: 4 links (path Claremont Avenue -> Alcatraz Avenue (434 m)), 223 trips (190 completed)
- Colby Street NB: 8 links (path Claremont Avenue -> Alcatraz Avenue (680 m)), 296 trips (257 completed)
- Hillegass Avenue SB: 4 links (path Alcatraz Avenue -> Claremont Avenue (433 m)), 191 trips (162 completed)
- Colby Street SB: 8 links (path Alcatraz Avenue -> Claremont Avenue (680 m)), 295 trips (266 completed)

| Block | Side | Via | Observed | Modeled | Diff (pp) | n trips | Headline |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue NB | from | freeway | 47% | 49% | +2 | 223 | within |
| Hillegass Avenue NB | to | Benvenue Avenue | 21% (PM 33%) | 7% | -26 | 223 |  |
| Hillegass Avenue NB | to | College Avenue | 6% | 16% | +10 | 223 |  |
| Hillegass Avenue NB | to | Alcatraz Avenue WB | 27% | 30% | +3 | 223 |  |
| Colby Street NB | from | freeway | 47% | 33% | -14 | 296 | OUTSIDE |
| Colby Street NB | to | Alcatraz Avenue WB | 48% | 53% | +5 | 296 |  |
| Colby Street NB | to | Telegraph Avenue | 25% | 30% | +5 | 296 |  |
| Colby Street NB | to | College Avenue | 3% | 8% | +5 | 296 |  |
| Hillegass Avenue SB | from | Alcatraz Avenue WB | 46% | 33% | -13 | 191 |  |
| Hillegass Avenue SB | from | Benvenue Avenue | 26% | 5% | -21 | 191 |  |
| Hillegass Avenue SB | from | College Avenue | 16% | 19% | +3 | 191 |  |
| Hillegass Avenue SB | to | freeway | 57% (PM 68%) | 67% | -1 | 191 | within |
| Colby Street SB | from | Alcatraz Avenue EB | 43% | 20% | -23 | 295 |  |
| Colby Street SB | from | Alcatraz Avenue WB | 46% | 19% | -27 | 295 |  |
| Colby Street SB | from | Telegraph Avenue | 22% | 20% | -2 | 295 |  |
| Colby Street SB | to | freeway | 45% | 43% | -2 | 295 | within |
| Colby Street SB | to | Forest Street | 34% | 20% | -14 | 295 |  |

Headline shares within tolerance: 3 of 4. Observed column uses the PM-peak share where one is given and the period is pm_peak. 'Via' shares are the fraction of select-link trips using that street before (from) or after (to) the block; freeway = origin / destination gate with a motorway-class link attached.

## Claremont ramps: streets used before the on-ramp / after the off-ramp

Observed shares are for traffic from/to the north only. 'Modeled' is over all trips on the ramps and any visit to the street (an upper bound for streets that serve both sides). 'Modeled, side' counts only trips whose surface end lies on the side of the ramp stated in the targets file (`freewayRamp.side`), and for a street with a qualifier ("north of X") only its links on that side of X.

| Direction | Via | Observed | Modeled | n ramp trips | Modeled, side | n side trips |
| --- | --- | --- | --- | --- | --- | --- |
| onto freeway | College Avenue | 16% | 15% | 807 | 16% | 712 |
| onto freeway | Hillegass Avenue | 12% | 14% | 807 | 16% | 712 |
| onto freeway | Martin Street | 10% | 12% | 807 | 12% | 712 |
| onto freeway | Colby Street | 8% | 12% | 807 | 14% | 712 |
| onto freeway | Telegraph Avenue north of Alcatraz Avenue | 8% | 15% | 807 | 13% | 712 |
| onto freeway | Benvenue Avenue | 5% | 4% | 807 | 4% | 712 |
| from freeway | College Avenue | 10% | 8% | 941 | 10% | 721 |
| from freeway | Martin Street | 10% | 11% | 941 | 15% | 721 |
| from freeway | Colby Street | 8% | 7% | 941 | 9% | 721 |
| from freeway | Hillegass Avenue | 5% | 6% | 941 | 8% | 721 |
| from freeway | Benvenue Avenue | 3% | 3% | 941 | 4% | 721 |

## Top 15 links by delay

| Link | Street | Class | Lanes | Len (m) | End node control | Delay (veh-h) | Stopped (veh-h) | Mean stopped veh | Flow (veh/h) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 4143 | Adeline Street | Secondary | 3 | 185 | signal | 13.11 | 8.09 | 8.1 | 986 |
| 4175 | (unnamed) | Motorway | 2 | 142 | uncontrolled | 9.16 | 0.62 | 0.6 | 1609 |
| 1662 | 52nd Street | Secondary | 4 | 53 | signal | 7.73 | 6.40 | 6.4 | 913 |
| 1122 | Alcatraz Avenue | Tertiary | 1 | 299 | signal | 7.52 | 5.07 | 5.1 | 352 |
| 3395 | Ashby Avenue | Primary | 1 | 129 | signal | 6.92 | 4.48 | 4.5 | 880 |
| 3434 | Claremont Avenue | Secondary | 1 | 93 | all_way_stop | 6.46 | 4.03 | 4.0 | 401 |
| 4382 | Warren Freeway | Motorway | 2 | 744 | uncontrolled | 6.36 | 1.15 | 1.2 | 1109 |
| 1051 | Adeline Street | Secondary | 4 | 50 | signal | 6.26 | 5.32 | 5.3 | 805 |
| 4329 | Claremont Avenue | Secondary | 2 | 113 | signal | 6.10 | 5.15 | 5.1 | 239 |
| 3344 | Domingo Avenue | Residential | 1 | 110 | signal | 5.80 | 4.55 | 4.6 | 361 |
| 1025 | Martin Luther King Junior Way | Secondary | 3 | 79 | signal | 5.72 | 4.60 | 4.6 | 529 |
| 4397 | Ashby Avenue | Primary | 2 | 96 | signal | 5.18 | 3.41 | 3.4 | 803 |
| 498 | Sacramento Street | Tertiary | 3 | 48 | signal | 5.16 | 4.22 | 4.2 | 770 |
| 3431 | Claremont Avenue | Secondary | 1 | 82 | all_way_stop | 5.15 | 3.51 | 3.5 | 298 |
| 2005 | Shattuck Avenue | Tertiary | 1 | 92 | signal | 4.86 | 3.82 | 3.8 | 434 |

## Top 15 nodes by blocked time

Blocked time = lane-head seconds waiting at the stop line without permission (signal red, conflict, stop sign or no downstream space).

| Node | Streets | Control | Gate | Blocked (lane-h) | of which no downstream space | Signal plan at end (cycle: greens) |
| --- | --- | --- | --- | --- | --- | --- |
| 680 | 52nd Street / Shattuck Avenue | signal |  | 5.88 | 0.04 | 110 s: 34/28/34 |
| 446 | Market Street / Stanford Avenue | signal |  | 5.61 | 0.13 | 75 s: 45/20 |
| 447 | Adeline Street / Alcatraz Avenue | signal |  | 4.81 | 0.03 | 75 s: 22/43 |
| 185 | Alcatraz Avenue / Sacramento Street | signal |  | 3.52 | 0.03 | 75 s: 38/27 |
| 37 | San Pablo Avenue / Stanford Avenue | signal |  | 3.28 | 0.00 | 75 s: 26/39 |
| 1406 | Ashby Avenue / Claremont Avenue | signal |  | 3.15 | 0.26 | 75 s: 50/15 |
| 1080 | 62nd Street / Claremont Avenue / College Avenue | signal |  | 3.13 | 0.04 | 75 s: 15/30/15 |
| 30 | 57th Street / Adeline Street / Market Street | signal |  | 2.99 | 0.02 | 75 s: 15/30/15 |
| 851 | Alcatraz Avenue / Telegraph Avenue | signal |  | 2.95 | 0.03 | 75 s: 42/23 |
| 237 | Ashby Avenue / Sacramento Street | signal |  | 2.88 | 0.00 | 75 s: 44/21 |
| 479 | Adeline Street / Martin Luther King Junior Way / Stanford Avenue | signal |  | 2.82 | 0.01 | 75 s: 27/38 |
| 944 | Ashby Avenue / Shattuck Avenue | signal |  | 2.80 | 0.00 | 75 s: 42/23 |
| 947 | Ashby Avenue / Telegraph Avenue | signal |  | 2.68 | 0.00 | 75 s: 26/39 |
| 332 | 55th Street / Martin Luther King Junior Way | signal |  | 2.59 | 0.00 | 75 s: 36/29 |
| 1373 | Ashby Avenue / Domingo Avenue / Tunnel Road | signal |  | 2.57 | 0.07 | 75 s: 39/26 |

Phases of the five most blocked signals (green s: approach links with their lanes, link ids in brackets):

- node 680: 34 s: 52nd Street 4L [1662]; 28 s: 52nd Street 4L [1666]; 34 s: Shattuck Avenue 2L [1653], Shattuck Avenue 2L [1705]
- node 446: 45 s: Stanford Avenue 1L [941], Stanford Avenue 3L [1055]; 20 s: Market Street 4L [1108], Market Street 3L [1111]
- node 447: 22 s: Adeline Street 4L [1049], Adeline Street 4L [1051]; 43 s: Alcatraz Avenue 2L [1048], Alcatraz Avenue 2L [1133]
- node 185: 38 s: Alcatraz Avenue 1L [363], Alcatraz Avenue 1L [1162]; 27 s: Sacramento Street 3L [1036], Sacramento Street 3L [1037]
- node 37: 26 s: San Pablo Avenue 3L [114], San Pablo Avenue 3L [115]; 39 s: Stanford Avenue 3L [108], Stanford Avenue 2L [4109]

## Entry backlog by origin node at end of run (top 10)

| Node | Streets | Trips waiting | Offered veh/h (before scale) |
| --- | --- | --- | --- |
| 1408 | Avalon Avenue / Claremont Avenue | 8 | 17 |
| 632 | Claremont Avenue / Clarke Street | 2 | 6 |
| 1232 | Ashby Avenue / Claremont Crescent | 2 | 31 |
| 1025 | College Avenue / Hudson Street / Manila Avenue | 1 | 34 |
| 1089 | 63rd Street / College Avenue | 1 | 57 |

## Flow on key streets (veh/h per direction, study-area links of 40 m or more)

| Street | Direction of travel | Links | Median flow | Max flow |
| --- | --- | --- | --- | --- |
| Telegraph | N | 12 | 1190 | 1218 |
| Telegraph | S | 10 | 785 | 852 |
| College | N | 3 | 413 | 413 |
| College | S | 3 | 692 | 694 |
| Claremont | N | 6 | 346 | 544 |
| Claremont | S | 7 | 259 | 733 |
| Alcatraz | E | 6 | 541 | 557 |
| Alcatraz | W | 6 | 372 | 456 |
| Hillegass | N | 4 | 110 | 154 |
| Hillegass | S | 4 | 157 | 160 |
| Colby | N | 7 | 143 | 193 |
| Colby | S | 7 | 155 | 179 |
| Martin | E | 2 | 124 | 124 |
| Martin | W | 2 | 138 | 138 |

## Largest demand origins (offered, before scale)

| Node | Streets | Veh/h |
| --- | --- | --- |
| 602 | Grove Shafter Freeway | 4099 |
| 1672 | Warren Freeway | 1262 |
| 265 | Ashby Avenue | 1134 |
| 183 | San Pablo Avenue | 1119 |
| 943 | Telegraph Avenue / Ward Street | 998 |
| 974 | Broadway | 799 |
| 763 | Telegraph Avenue | 723 |
| 184 | Alcatraz Avenue | 515 |
| 1756 | Claremont Avenue | 471 |
| 276 | Martin Luther King Junior Way | 439 |
