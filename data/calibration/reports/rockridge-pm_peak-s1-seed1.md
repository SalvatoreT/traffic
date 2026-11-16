# Calibration report: rockridge pm_peak scale 1 seed 1 (60 min)

Offered demand 26352 veh/h x scale 1 = 26352 veh/h. Run took 29.0 s wall clock. Flow tables use the window after a 10 min warm-up; select-link and health figures cover the whole run from an empty network.

## Stability (design D4)

| Criterion | Threshold | Value | Result |
| --- | --- | --- | --- |
| Gridlock removals | 0 | 0 | pass |
| Backlog / spawned | < 2% | 1.0% (265 of 26289) | pass |
| Arterial mean speed (run) | > 4 m/s | 8.19 m/s (last 15 min 7.64) | pass |

Overall: **STABLE**. Mean trip delay 170 s, mean trip time 423 s, completed 25947, unroutable 0.

| t (min) | vehicles in network | backlog | completed | removals | arterial speed in interval (m/s) |
| --- | --- | --- | --- | --- | --- |
| 5 | 2980 | 2 | 2255 | 0 | 8.70 |
| 10 | 3055 | 5 | 4376 | 0 | 8.65 |
| 15 | 3092 | 2 | 6604 | 0 | 8.65 |
| 20 | 3018 | 3 | 8846 | 0 | 8.62 |
| 25 | 3074 | 12 | 11057 | 0 | 8.53 |
| 30 | 3240 | 56 | 13061 | 0 | 8.04 |
| 35 | 3191 | 99 | 15281 | 0 | 8.05 |
| 40 | 3184 | 112 | 17475 | 0 | 8.19 |
| 45 | 3160 | 160 | 19610 | 0 | 8.10 |
| 50 | 3290 | 177 | 21696 | 0 | 7.68 |
| 55 | 3375 | 234 | 23813 | 0 | 7.49 |
| 60 | 3412 | 265 | 25947 | 0 | 7.74 |
## Wandering (completed car trips)

Detour ratio = distance driven (link and movement lengths) over the shortest network distance from the trip's origin to its destination. Detour against the free-flow route uses the time-shortest route with no congestion and no noise, which is what a purposeful driver without live information would follow (it differs from the shortest distance when a faster, longer road exists). A switch is a change of the remaining route while en route. Loops: the same link twice or the same node three or more times. Reversals: a link followed by its reverse within 200 m. 'Study-area vehicle-miles' are miles driven on links inside the study area; the last column is the share of them driven by trips with a detour ratio above 1.3. Guided drivers re-evaluate their route every epoch; the others keep their departure route unless it is blocked.

| Trips | n | Switches per trip | With a switch | Mean detour | Median detour | Detour > 1.3 | Detour > 2 | Mean detour vs free-flow route | Vs free-flow route > 1.3 | Loops | Reversals | Study veh-miles | Of them by detour > 1.3 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| all trips | 23765 | 0.03 | 3.1% | 1.090 | 1.053 | 4.9% | 0.1% | 1.032 | 2.6% | 0.0% | 0.3% | 2540 | 7.2% |
| gate to gate | 8436 | 0.06 | 5.3% | 1.095 | 1.067 | 4.8% | 0.0% | 1.035 | 2.7% | 0.0% | 0.3% | 574 | 11.2% |
| with a local end | 15329 | 0.02 | 1.8% | 1.087 | 1.049 | 4.9% | 0.1% | 1.031 | 2.5% | 0.0% | 0.3% | 1965 | 6.0% |
| guided drivers | 11006 | 0.07 | 6.3% | 1.092 | 1.053 | 5.1% | 0.0% | 1.034 | 2.7% | 0.0% | 0.3% | 1189 | 7.6% |
| other drivers | 12759 | 0.00 | 0.3% | 1.089 | 1.052 | 4.7% | 0.1% | 1.031 | 2.5% | 0.0% | 0.3% | 1351 | 6.8% |

## Reported patterns (diagnostics; configured in the targets file under `patterns`)

(a) Trips between the surface gates on the north side of the ramps and the freeway mainline gates, and the local-street (residential and service links in the study area) vehicle-miles they drive. Share = of all completed trips' local-street vehicle-miles (478 miles). No observed counterpart exists for this quantity (the targets file has only the select-link shares above).

| Trips | n trips | Local-street veh-miles | Share of all local-street veh-miles |
| --- | --- | --- | --- |
| surface gates to the freeway | 1641 | 39.9 | 8% |
| freeway to the surface gates | 1332 | 29.0 | 6% |

(b) Corridor trips: completed trips from beyond one end of the corridor's study-area extent (the bypass street and its arterial together) to beyond the other end, within a lateral limit of the corridor, by direction. 'Bypass' = at least N blocks (links) on the bypass street; 'arterial' = fewer bypass blocks and at least N on the arterial; 'other' = neither (another street, the freeway or a short use); blocks are counted on the corridor's study-area links. No observed counterpart exists for these shares. The related observed values are in the select-link table above: northbound Hillegass Ave traffic rarely ends on College Ave (6%), 21 to 33% jogs to Benvenue Ave, and southbound freeway-bound drivers on College Ave commonly arrive via Ashby Ave and Benvenue Ave and jog to Hillegass Ave.

| Bypass | Arterial | N | Direction | Corridor trips | Bypass | Arterial | Other | Mean bypass blocks |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue | College Avenue | 3 | N | 1590 | 3% | 18% | 79% | 0.1 |
| Hillegass Avenue | College Avenue | 3 | S | 1405 | 5% | 25% | 70% | 0.2 |

## Per-mode results

Offered: 26352 car veh/h; 626 bicycle flows (764/h); 2000 pedestrian flows (1731/h). Bicycle and pedestrian volumes are assumptions, not counts.

| Mode | In network | Completed | Mean time (s) | Other |
| --- | --- | --- | --- | --- |
| Car | 3412 | 25947 | 423 | |
| Bicycle | 50 | 793 | 269 | |
| Pedestrian | 223 | 1655 | 416 | mean crossing delay 8.0 s |

Vulnerable road users (surrogate indicators): pedestrian conflicts 290, bicycle conflicts 1189, close passes 666, pedestrian injury severity mean 0.041 (AIS4+, 10855 supported of 10855 encounters), cyclist injury severity mean 0.067 (MAIS3+F, 3899 supported of 8319 encounters) (separate endpoints, never summed), mean vehicle speed at pedestrian encounters 2.17 m/s.


## Through cars on the counted blocks (a car is through when neither trip end is in the study area)

Observed through range = from the cars that drove the whole street (volunteer count, a lower bound) to the block volume less the cars whose trip ends along the street (an upper bound). Observed freeway-end trips = observed block volume times the observed freeway share of the street (the headline share of the targets file); these include freeway trips that end inside the study area, so they are not an expected through count. Modeled through = select-link trips with no end in the study area, per hour. Modeled freeway = select-link trips from or to a freeway node, per hour.

| Block | Observed volume (veh/h) | Observed freeway share | Observed freeway-end trips (veh/h) | Observed through range (veh/h) | Modeled through (veh/h) | In range | Modeled freeway trips (veh/h) |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue NB | 110 | 47.0% | 52 | 48 to 95 | 82 | yes | 117 |
| Colby Street NB | 174 | 47.0% | 82 | 102 to 145 | 130 | yes | 157 |
| Hillegass Avenue SB | 160 | 68.0% | 109 | 79 to 120 | 139 | above | 119 |
| Colby Street SB | 160 | 45.0% | 72 | 39 to 117 | 115 | yes | 119 |

## Intent map: through cars by where they come from and where they are going

Through = neither trip end is in the study area. Groups are the approach groups of the area config (data/areas); a node that is not a gate takes the group of the nearest surface gate (ASSUMPTION). The arterial is the one a trip would use on the shortest free-flow path with the study area's residential and service streets closed, where that path runs on a boundary street near the study area.

Model figures are the mean of 1 seed(s), per hour of the run. Basis: OBSERVED = read from the resident volunteer count of Feb 25, 2025 or its headline shares; ASSUMPTION = inferred from those numbers or chosen.

### Colby Street NB

Observed: block volume 174 veh/h, whole-street cars 102, so through cars 102 to 145 veh/h. Model: 130 through cars per hour.

Observed (PM): 182 cars entered at the south end, 102 drove the whole street, 164 left it at Alcatraz Ave (131 left, 32 right, 1 straight), and 47% of the block's trips came from a freeway (the headline share). ASSUMPTION: freeway-origin cars that do not end along the street are 65 veh/h (the 82 freeway-origin trips on the block, 47% of 174, times the 182 / (182 + 47) of its cars that entered at the south end rather than joining on the way), spread over the 164 exits in proportion (0.40); the other through cars come from the Telegraph Ave and south-side approaches that feed the street's south end. Ranges: low = 131 (32) x 0.47 x 0.62 (the whole-street share of exits), high = 131 (32) x 0.47.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | OBSERVED turn count x ASSUMPTION share (131 left turns x 0.40) | 52 (38 to 62) | 51 | within |
| Telegraph Ave and south-side traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | ASSUMPTION: the through left-turners (131 x 0.62 = 81) that are not off-ramp traffic | 29 (19 to 43) | 34 | within |
| SR-24 off-ramp traffic using Colby St to reach College Ave and Berkeley (right at Alcatraz Ave) | OBSERVED turn count x ASSUMPTION share (32 right turns x 0.40) | 13 (9 to 15) | 11 | within |
| Telegraph Ave and south-side traffic using Colby St to reach College Ave and Berkeley | ASSUMPTION: the through right-turners (32 x 0.62 = 20) that are not off-ramp traffic | 7 (5 to 11) | 31 | above |
| Intents listed, together | | 101 (71 to 131) | 127 | |
| Other through cars (no intent listed) | | | 3 | |

Model through cars by origin and destination group (largest 12 of 17 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 51.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 28.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Ashby Ave from the west (Emeryville and I-80) | 10.0 | none near the study area |
| Telegraph Ave to the south (downtown Oakland) | Telegraph Ave from the north (Berkeley) | 9.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Shattuck Ave from the north (Berkeley) | 7.0 | Claremont Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 6.0 | SR-24 then Claremont Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 4.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | College Ave from the north (Berkeley) | 4.0 | SR-24 then Claremont Avenue then College Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Emeryville and West Oakland streets (55th to 67th Streets) | 2.0 | Claremont Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Telegraph Ave from the north (Berkeley) | 2.0 | Telegraph Avenue |
| Ashby Ave from the west (Emeryville and I-80) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 1.0 | Alcatraz Avenue then Claremont Avenue |
| Ashby Ave from the west (Emeryville and I-80) | College Ave from the north (Berkeley) | 1.0 | Alcatraz Avenue then College Avenue |
| other pairs | | 5.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 96 veh/h; Claremont Avenue 10 veh/h; none near the study area 10 veh/h; SR-24 then Claremont Avenue 6 veh/h; SR-24 then Claremont Avenue then College Avenue 4 veh/h; Alcatraz Avenue then Claremont Avenue 1 veh/h.

### Hillegass Avenue NB

Observed: block volume 110 veh/h, whole-street cars 48, so through cars 48 to 95 veh/h. Model: 82 through cars per hour.

Observed (PM): 94 cars entered at the south end, 48 drove the whole street, 109 left it at Alcatraz Ave (43 west, 54 east, 12 straight), and 47% of the block's trips came from a freeway. ASSUMPTION: freeway-origin through cars are 40 veh/h (52 freeway-origin trips times 94 / (94 + 29)), spread over the exits in proportion (0.37); the through share of exits is 48 / 109 = 0.44.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Hillegass Ave to reach Alcatraz Ave west and Telegraph Ave north | OBSERVED turn count x ASSUMPTION share (43 left turns x 0.37) | 16 (9 to 20) | 21 | above |
| SR-24 off-ramp traffic using Hillegass Ave to reach College Ave and Berkeley | OBSERVED turn count x ASSUMPTION share (54 right turns x 0.37) | 20 (11 to 25) | 26 | above |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach Alcatraz Ave west | ASSUMPTION: through exits (43 x 0.44) that are not off-ramp traffic | 3 (0 to 10) | 5 | within |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach College Ave and Berkeley | ASSUMPTION: through exits (54 x 0.44) that are not off-ramp traffic | 4 (0 to 13) | 27 | above |
| Intents listed, together | | 43 (20 to 68) | 79 | |
| Other through cars (no intent listed) | | | 3 | |

Model through cars by origin and destination group (largest 12 of 18 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 17.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 15.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 14.0 | SR-24 |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | College Ave from the north (Berkeley) | 8.0 | SR-24 then Claremont Avenue then College Avenue |
| Telegraph Ave to the south (downtown Oakland) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 6.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 4.0 | SR-24 then Claremont Avenue |
| SR-13 Warren Freeway (via SR-24 east) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 3.0 | Claremont Avenue then Alcatraz Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Claremont Ave and Tunnel Rd toward the hills | 2.0 | Claremont Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 2.0 | Telegraph Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Ashby Ave from the west (Emeryville and I-80) | 2.0 | SR-24 then Telegraph Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | San Pablo Ave (Emeryville and West Oakland) | 2.0 | SR-24 |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Ashby Ave from the west (Emeryville and I-80) | 1.0 | none near the study area |
| other pairs | | 6.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 41 veh/h; SR-24 16 veh/h; SR-24 then Claremont Avenue then College Avenue 8 veh/h; Claremont Avenue 4 veh/h; SR-24 then Claremont Avenue 4 veh/h; Claremont Avenue then Alcatraz Avenue 3 veh/h.

### Hillegass Avenue SB

Observed: block volume 160 veh/h, whole-street cars 79, so through cars 79 to 120 veh/h. Model: 139 through cars per hour.

Observed (PM): 178 cars entered at the top (76 turned in from Alcatraz Ave west, 98 from the east, 4 came straight from the north), 79 drove the whole street, and 68% of the block's trips (109 veh/h) went to a freeway. ASSUMPTION: freeway-bound cars that did not join mid-street are 87 veh/h (109 x 178 / (178 + 44)), half of the 174 turn-ins; low = the whole-street share of the turn-ins (0.45), high = the freeway-bound share without the mid-street correction (0.63).

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Telegraph Ave, Alcatraz Ave west and West Berkeley traffic turning off Alcatraz Ave onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (76 turn-ins x 0.50) | 38 (34 to 48) | 46 | within |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (98 turn-ins x 0.50) | 49 (44 to 62) | 56 | within |
| Intents listed, together | | 87 (78 to 110) | 102 | |
| Other through cars (no intent listed) | | | 37 | |

Model through cars by origin and destination group (largest 12 of 12 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 46.0 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 21.0 | Claremont Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 20.0 | Telegraph Avenue |
| Ashby Ave from the west (Emeryville and I-80) | College Ave from the north (Berkeley) | 17.0 | Alcatraz Avenue then College Avenue |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 11.0 | College Avenue then Claremont Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 6.0 | Telegraph Avenue |
| West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 6.0 | College Avenue |
| Ashby Ave from the west (Emeryville and I-80) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 3.0 | Alcatraz Avenue then Claremont Avenue |
| Ashby Ave from the west (Emeryville and I-80) | Berkeley hills to the northeast (Evergreen Ln, Gravatt Dr) | 3.0 | none near the study area |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 2.0 | Claremont Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Telegraph Ave to the south (downtown Oakland) | 2.0 | Telegraph Avenue |
| Berkeley hills to the northeast (Evergreen Ln, Gravatt Dr) | SR-24 westbound on-ramps (toward Oakland and I-980) | 2.0 | SR-24 |

By the arterial these cars would otherwise use: Telegraph Avenue 74 veh/h; Claremont Avenue then SR-24 21 veh/h; Alcatraz Avenue then College Avenue 17 veh/h; College Avenue then Claremont Avenue then SR-24 11 veh/h; College Avenue 6 veh/h; Alcatraz Avenue then Claremont Avenue 3 veh/h.

### Colby Street SB

Observed: block volume 160 veh/h, whole-street cars 39, so through cars 39 to 117 veh/h. Model: 115 through cars per hour.

Observed (PM): 139 cars entered at the top (76 from Alcatraz Ave west, 50 from the east, 13 from the north), 39 drove the whole street, 45% of the block's trips (72 veh/h) went to a freeway and 22% came by way of Telegraph Ave. ASSUMPTION: freeway-bound cars that did not join mid-street are 46 veh/h (72 x 139 / (139 + 79)), 0.365 of the 126 turn-ins; low = the whole-street share (0.31), high = the unadjusted freeway share (0.57). The Telegraph Ave cars are the 22% x 160 = 35 of the 76 west turn-ins.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Southbound Telegraph Ave traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (35 Telegraph Ave cars x 0.365) | 13 (11 to 20) | 10 | below |
| Alcatraz Ave west, Ashby Ave and West Berkeley traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (41 other west turn-ins x 0.365) | 15 (13 to 23) | 13 | within |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (50 east turn-ins x 0.365) | 18 (15 to 29) | 40 | above |
| Intents listed, together | | 46 (39 to 72) | 63 | |
| Other through cars (no intent listed) | | | 52 | |

Model through cars by origin and destination group (largest 12 of 22 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 22.0 | Telegraph Avenue |
| Ashby Ave from the west (Emeryville and I-80) | College Ave from the north (Berkeley) | 14.0 | Alcatraz Avenue then College Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 13.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Telegraph Ave to the south (downtown Oakland) | 12.0 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 10.0 | Claremont Avenue then SR-24 |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 10.0 | Telegraph Avenue |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 6.0 | College Avenue then Claremont Avenue then SR-24 |
| Ashby Ave from the west (Emeryville and I-80) | SR-13 Warren Freeway (via SR-24 east) | 5.0 | SR-24 |
| Shattuck Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 4.0 | none near the study area |
| Alcatraz Ave from the west (Emeryville side) | SR-13 Warren Freeway (via SR-24 east) | 3.0 | SR-24 |
| Ashby Ave from the west (Emeryville and I-80) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 3.0 | Alcatraz Avenue then Claremont Avenue |
| Ashby Ave from the west (Emeryville and I-80) | Berkeley hills to the northeast (Evergreen Ln, Gravatt Dr) | 2.0 | none near the study area |
| other pairs | | 11.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 58 veh/h; Alcatraz Avenue then College Avenue 15 veh/h; Claremont Avenue then SR-24 10 veh/h; SR-24 10 veh/h; College Avenue then Claremont Avenue then SR-24 6 veh/h; none near the study area 6 veh/h.

### Study area, all residential and service streets

Model: 812 through cars per hour.

Model through cars by origin and destination group (largest 12 of 61 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 94.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 83.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 68.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 60.0 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 53.0 | Telegraph Avenue |
| Ashby Ave from the west (Emeryville and I-80) | College Ave from the north (Berkeley) | 33.0 | Alcatraz Avenue then College Avenue |
| West Oakland to the southwest (Adeline St, Market St) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 33.0 | Telegraph Avenue then Claremont Avenue |
| West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) | SR-24 westbound on-ramps (toward Oakland and I-980) | 28.0 | none near the study area |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 28.0 | Claremont Avenue then SR-24 |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Emeryville and West Oakland streets (55th to 67th Streets) | 26.0 | Claremont Avenue |
| Telegraph Ave from the north (Berkeley) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 25.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Telegraph Ave to the south (downtown Oakland) | 20.0 | Telegraph Avenue |
| other pairs | | 261.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 475 veh/h; Claremont Avenue 76 veh/h; none near the study area 73 veh/h; Alcatraz Avenue then College Avenue 35 veh/h; Telegraph Avenue then Claremont Avenue 33 veh/h; Claremont Avenue then SR-24 28 veh/h.

By origin group: Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 181; South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 176; SR-24 eastbound off-ramps (arriving from Oakland and I-980) 101; Telegraph Ave from the north (Berkeley) 79; Ashby Ave from the west (Emeryville and I-80) 55; West Oakland to the southwest (Adeline St, Market St) 47; West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) 37; Telegraph Ave to the south (downtown Oakland) 34; Claremont Ave and Tunnel Rd toward the hills 28; Emeryville and West Oakland streets (55th to 67th Streets) 28.

By destination group: SR-24 westbound on-ramps (toward Oakland and I-980) 220; South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 159; Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 158; Telegraph Ave from the north (Berkeley) 91; College Ave from the north (Berkeley) 47; Emeryville and West Oakland streets (55th to 67th Streets) 27; Claremont Ave and Tunnel Rd toward the hills 25; Telegraph Ave to the south (downtown Oakland) 22; Shattuck Ave from the north (Berkeley) 17; Ashby Ave from the west (Emeryville and I-80) 12.


## Through cars by intent (cut-through intent view)

A through car is tallied once, under the first intent that fits it (the on-ramp on its planned route, the off-ramp it has driven, or the origin and destination groups of its trip), at the moment the through count counts it. Cars an hour over the run, the same window as the through-car figure (812 an hour).

| Intent | Basis | Cars an hour | Share |
| --- | --- | --- | --- |
| on-2853241697 | observed | 222 | 27% |
| Other on-ramps | assumed | 13 | 2% |
| off-52990846 | observed | 102 | 13% |
| Other off-ramps | assumed | 10 | 1% |
| Downtown, south and west Oakland traffic using side streets to reach Berkeley and Telegraph Ave north | assumed | 163 | 20% |
| Berkeley and Telegraph Ave north traffic using side streets to reach downtown, south and west Oakland | assumed | 126 | 16% |
| Oakland cross-town traffic (West Oakland, Broadway, Piedmont, Emeryville) using side streets near Claremont Ave and Telegraph Ave | assumed | 77 | 9% |
| Other (no intent listed) |  | 99 | 12% |

Intents listed cover 88% of through cars.


## Select-link shares: modeled vs observed (design D5: headline = freeway shares, tolerance +/-10 pp)

- Hillegass Avenue NB: 4 links (path Claremont Avenue -> Alcatraz Avenue (434 m)), 223 trips (203 completed)
- Colby Street NB: 8 links (path Claremont Avenue -> Alcatraz Avenue (680 m)), 302 trips (277 completed)
- Hillegass Avenue SB: 4 links (path Alcatraz Avenue -> Claremont Avenue (433 m)), 192 trips (178 completed)
- Colby Street SB: 8 links (path Alcatraz Avenue -> Claremont Avenue (680 m)), 284 trips (254 completed)

| Block | Side | Via | Observed | Modeled | Diff (pp) | n trips | Headline |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue NB | from | freeway | 47% | 52% | +5 | 223 | within |
| Hillegass Avenue NB | to | Benvenue Avenue | 21% (PM 33%) | 2% | -31 | 223 |  |
| Hillegass Avenue NB | to | College Avenue | 6% | 15% | +9 | 223 |  |
| Hillegass Avenue NB | to | Alcatraz Avenue WB | 27% | 25% | -2 | 223 |  |
| Colby Street NB | from | freeway | 47% | 50% | +3 | 302 | within |
| Colby Street NB | to | Alcatraz Avenue WB | 48% | 42% | -6 | 302 |  |
| Colby Street NB | to | Telegraph Avenue | 25% | 30% | +5 | 302 |  |
| Colby Street NB | to | College Avenue | 3% | 8% | +5 | 302 |  |
| Hillegass Avenue SB | from | Alcatraz Avenue WB | 46% | 31% | -15 | 192 |  |
| Hillegass Avenue SB | from | Benvenue Avenue | 26% | 5% | -21 | 192 |  |
| Hillegass Avenue SB | from | College Avenue | 16% | 17% | +1 | 192 |  |
| Hillegass Avenue SB | to | freeway | 57% (PM 68%) | 60% | -8 | 192 | within |
| Colby Street SB | from | Alcatraz Avenue EB | 43% | 20% | -23 | 284 |  |
| Colby Street SB | from | Alcatraz Avenue WB | 46% | 14% | -32 | 284 |  |
| Colby Street SB | from | Telegraph Avenue | 22% | 15% | -7 | 284 |  |
| Colby Street SB | to | freeway | 45% | 40% | -5 | 284 | within |
| Colby Street SB | to | Forest Street | 34% | 26% | -8 | 284 |  |

Headline shares within tolerance: 4 of 4. Observed column uses the PM-peak share where one is given and the period is pm_peak. 'Via' shares are the fraction of select-link trips using that street before (from) or after (to) the block; freeway = origin / destination gate with a motorway-class link attached.

## Claremont ramps: streets used before the on-ramp / after the off-ramp

Observed shares are for traffic from/to the north only. 'Modeled' is over all trips on the ramps and any visit to the street (an upper bound for streets that serve both sides). 'Modeled, side' counts only trips whose surface end lies on the side of the ramp stated in the targets file (`freewayRamp.side`), and for a street with a qualifier ("north of X") only its links on that side of X.

| Direction | Via | Observed | Modeled | n ramp trips | Modeled, side | n side trips |
| --- | --- | --- | --- | --- | --- | --- |
| onto freeway | College Avenue | 16% | 14% | 868 | 16% | 737 |
| onto freeway | Hillegass Avenue | 12% | 13% | 868 | 16% | 737 |
| onto freeway | Martin Street | 10% | 13% | 868 | 15% | 737 |
| onto freeway | Colby Street | 8% | 8% | 868 | 9% | 737 |
| onto freeway | Telegraph Avenue north of Alcatraz Avenue | 8% | 16% | 868 | 12% | 737 |
| onto freeway | Benvenue Avenue | 5% | 5% | 868 | 6% | 737 |
| from freeway | College Avenue | 10% | 10% | 775 | 11% | 739 |
| from freeway | Martin Street | 10% | 10% | 775 | 10% | 739 |
| from freeway | Colby Street | 8% | 10% | 775 | 11% | 739 |
| from freeway | Hillegass Avenue | 5% | 7% | 775 | 7% | 739 |
| from freeway | Benvenue Avenue | 3% | 2% | 775 | 2% | 739 |

## Top 15 links by delay

| Link | Street | Class | Lanes | Len (m) | End node control | Delay (veh-h) | Stopped (veh-h) | Mean stopped veh | Flow (veh/h) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 4175 | (unnamed) | Motorway | 2 | 142 | uncontrolled | 20.98 | 3.88 | 3.9 | 1510 |
| 4397 | Ashby Avenue | Primary | 2 | 96 | signal | 14.23 | 10.61 | 10.6 | 671 |
| 1089 | Market Street | Tertiary | 2 | 111 | two_way_stop | 11.83 | 8.21 | 8.2 | 998 |
| 460 | Sacramento Street | Tertiary | 2 | 104 | two_way_stop | 11.45 | 9.78 | 9.8 | 406 |
| 3434 | Claremont Avenue | Secondary | 1 | 93 | all_way_stop | 8.72 | 5.61 | 5.6 | 430 |
| 1051 | Adeline Street | Secondary | 4 | 50 | signal | 8.49 | 7.06 | 7.1 | 1332 |
| 4167 | (unnamed) | Motorway | 3 | 75 | uncontrolled | 8.41 | 2.57 | 2.6 | 2405 |
| 1126 | Market Street | Tertiary | 2 | 113 | two_way_stop | 8.29 | 5.80 | 5.8 | 972 |
| 834 | Martin Luther King Junior Way | Secondary | 4 | 49 | signal | 7.76 | 5.39 | 5.4 | 1405 |
| 3395 | Ashby Avenue | Primary | 1 | 129 | signal | 7.55 | 4.77 | 4.8 | 709 |
| 459 | Sacramento Street | Tertiary | 2 | 101 | two_way_stop | 7.42 | 6.29 | 6.3 | 418 |
| 2921 | Russell Street | Residential | 1 | 260 | uncontrolled | 7.20 | 6.60 | 6.6 | 101 |
| 4143 | Adeline Street | Secondary | 3 | 185 | signal | 7.04 | 4.05 | 4.0 | 1303 |
| 3370 | The Uplands | Tertiary | 1 | 311 | uncontrolled | 7.00 | 5.09 | 5.1 | 235 |
| 1049 | Adeline Street | Secondary | 4 | 43 | signal | 6.80 | 5.72 | 5.7 | 1078 |

## Top 15 nodes by blocked time

Blocked time = lane-head seconds waiting at the stop line without permission (signal red, conflict, stop sign or no downstream space).

| Node | Streets | Control | Gate | Blocked (lane-h) | of which no downstream space | Signal plan at end (cycle: greens) |
| --- | --- | --- | --- | --- | --- | --- |
| 447 | Adeline Street / Alcatraz Avenue | signal |  | 4.86 | 0.16 | 75 s: 31/34 |
| 446 | Market Street / Stanford Avenue | signal |  | 4.64 | 0.31 | 75 s: 37/28 |
| 680 | 52nd Street / Shattuck Avenue | signal |  | 4.55 | 0.03 | 110 s: 30/28/38 |
| 331 | 52nd Street / Martin Luther King Junior Way | signal |  | 4.05 | 0.03 | 75 s: 33/32 |
| 1080 | 62nd Street / Claremont Avenue / College Avenue | signal |  | 3.88 | 0.10 | 75 s: 18/27/15 |
| 479 | Adeline Street / Martin Luther King Junior Way / Stanford Avenue | signal |  | 3.45 | 0.04 | 75 s: 37/28 |
| 185 | Alcatraz Avenue / Sacramento Street | signal |  | 3.35 | 0.12 | 75 s: 29/36 |
| 37 | San Pablo Avenue / Stanford Avenue | signal |  | 3.27 | 0.04 | 75 s: 30/35 |
| 332 | 55th Street / Martin Luther King Junior Way | signal |  | 3.24 | 0.06 | 75 s: 35/30 |
| 30 | 57th Street / Adeline Street / Market Street | signal |  | 3.12 | 0.03 | 75 s: 19/26/15 |
| 242 | Ashby Avenue / Martin Luther King Junior Way | signal |  | 3.10 | 0.00 | 75 s: 36/29 |
| 1069 | Claremont Avenue / Colby Street / Forest Street | signal |  | 3.06 | 0.02 | 79 s: 24/4/36 |
| 1406 | Ashby Avenue / Claremont Avenue | signal |  | 2.99 | 0.27 | 75 s: 50/15 |
| 851 | Alcatraz Avenue / Telegraph Avenue | signal |  | 2.99 | 0.05 | 75 s: 48/17 |
| 713 | 51st Street / Telegraph Avenue | signal |  | 2.93 | 0.02 | 75 s: 42/23 |

Phases of the five most blocked signals (green s: approach links with their lanes, link ids in brackets):

- node 447: 31 s: Adeline Street 4L [1049], Adeline Street 4L [1051]; 34 s: Alcatraz Avenue 2L [1048], Alcatraz Avenue 2L [1133]
- node 446: 37 s: Stanford Avenue 3L [941], Stanford Avenue 3L [1055]; 28 s: Market Street 4L [1108], Market Street 3L [1111]
- node 680: 30 s: 52nd Street 4L [1662]; 28 s: 52nd Street 4L [1666], 52nd Street 4L [1662]; 38 s: Shattuck Avenue 2L [1653], Shattuck Avenue 2L [1705]
- node 331: 33 s: Martin Luther King Junior Way 4L [704], Martin Luther King Junior Way 4L [761]; 32 s: 52nd Street 2L [758], 52nd Street 1L [760]
- node 1080: 18 s: Claremont Avenue 2L [2756], Claremont Avenue 2L [2798]; 27 s: College Avenue 2L [2761], College Avenue 2L [2819]; 15 s: 62nd Street 1L [2622]

## Junction recovery

Policy `physical`. Node entries by cars and cyclists in the run: 813778 (settle interval 0). An admission is an entry the ordinary rule would have refused; head-seconds count the time a waiting head vehicle had the reason invoked, and the part of it in which it still could not enter. Courtesy and the yield fallback change priority only; under `physical` the conflict bypass never admits.

| Reason | Admissions per hour | Per 1,000 entries | Head-s invoked | Head-s blocked |
| --- | --- | --- | --- | --- |
| courtesy | 312.0 | 0.383 | 1253 | 1153 |
| yield fallback | 111.0 | 0.136 | 32 | 0 |
| conflict bypass | 0.0 | 0.000 | 59 | 59 |

Vehicles removed while held in a node by a full exit: 0 (0.0 per hour, included in the gridlock removals).

| Node | Streets | Control | Courtesy | Yield fallback | Conflict bypass | Held removals |
| --- | --- | --- | --- | --- | --- | --- |
| 1429 | Claremont Avenue / Claremont Boulevard | two_way_stop | 39 | 0 | 0 | 0 |
| 141 | 63rd Street / Lowell Street / Market Street | two_way_stop | 13 | 7 | 0 | 0 |
| 147 | 59th Street / Grace Avenue / Los Angeles Street | two_way_stop | 15 | 5 | 0 | 0 |
| 168 | 62nd Street / Market Street | two_way_stop | 8 | 10 | 0 | 0 |
| 165 | Alcatraz Avenue / Baker Street | two_way_stop | 10 | 6 | 0 | 0 |
| 464 | 61st Street / Market Street | two_way_stop | 3 | 9 | 0 | 0 |
| 1232 | Ashby Avenue / Claremont Crescent | uncontrolled | 10 | 0 | 0 | 0 |
| 1405 | Claremont Boulevard / Russell Street | two_way_stop | 8 | 2 | 0 | 0 |
| 30 | 57th Street / Adeline Street / Market Street | signal | 9 | 0 | 0 | 0 |
| 341 | 55th Street / Market Street | signal | 8 | 0 | 0 | 0 |

## Entry backlog by origin node at end of run (top 10)

| Node | Streets | Trips waiting | Offered veh/h (before scale) |
| --- | --- | --- | --- |
| 602 | Grove Shafter Freeway | 203 | 4121 |
| 1756 | Claremont Avenue | 49 | 503 |
| 1408 | Avalon Avenue / Claremont Avenue | 7 | 11 |
| 13 | 55th Street / San Pablo Avenue | 1 | 37 |
| 701 | 56th Street / Telegraph Avenue | 1 | 16 |
| 1080 | 62nd Street / Claremont Avenue / College Avenue | 1 | 179 |
| 1128 | Alcatraz Avenue / Benvenue Avenue | 1 | 5 |
| 1230 | Avalon Avenue / Claremont Boulevard | 1 | 16 |
| 1430 | Claremont Avenue / Russell Street | 1 | 17 |

## Flow on key streets (veh/h per direction, study-area links of 40 m or more)

| Street | Direction of travel | Links | Median flow | Max flow |
| --- | --- | --- | --- | --- |
| Telegraph | N | 12 | 1139 | 1176 |
| Telegraph | S | 10 | 1076 | 1121 |
| College | N | 3 | 432 | 432 |
| College | S | 3 | 599 | 600 |
| Claremont | N | 6 | 524 | 708 |
| Claremont | S | 7 | 382 | 827 |
| Alcatraz | E | 6 | 564 | 577 |
| Alcatraz | W | 6 | 366 | 373 |
| Hillegass | N | 4 | 128 | 137 |
| Hillegass | S | 4 | 134 | 146 |
| Colby | N | 7 | 166 | 200 |
| Colby | S | 7 | 149 | 190 |
| Martin | E | 2 | 157 | 157 |
| Martin | W | 2 | 142 | 142 |

## Largest demand origins (offered, before scale)

| Node | Streets | Veh/h |
| --- | --- | --- |
| 602 | Grove Shafter Freeway | 4121 |
| 265 | Ashby Avenue | 1134 |
| 1719 | Grove Shafter Freeway | 994 |
| 183 | San Pablo Avenue | 988 |
| 974 | Broadway | 806 |
| 1672 | Warren Freeway | 768 |
| 943 | Telegraph Avenue / Ward Street | 710 |
| 763 | Telegraph Avenue | 695 |
| 577 | Martin Luther King Junior Way | 528 |
| 1756 | Claremont Avenue | 503 |
