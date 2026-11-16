# Calibration report: rockridge am_peak scale 1 seed 1 (60 min)

Offered demand 22424 veh/h x scale 1 = 22424 veh/h. Run took 25.0 s wall clock. Flow tables use the window after a 10 min warm-up; select-link and health figures cover the whole run from an empty network.

## Stability (design D4)

| Criterion | Threshold | Value | Result |
| --- | --- | --- | --- |
| Gridlock removals | 0 | 0 | pass |
| Backlog / spawned | < 2% | 0.0% (3 of 22516) | pass |
| Arterial mean speed (run) | > 4 m/s | 9.15 m/s (last 15 min 9.33) | pass |

Overall: **STABLE**. Mean trip delay 124 s, mean trip time 371 s, completed 22767, unroutable 0.

| t (min) | vehicles in network | backlog | completed | removals | arterial speed in interval (m/s) |
| --- | --- | --- | --- | --- | --- |
| 5 | 2452 | 0 | 1980 | 0 | 9.16 |
| 10 | 2454 | 2 | 3880 | 0 | 9.10 |
| 15 | 2418 | 2 | 5767 | 0 | 8.82 |
| 20 | 2382 | 5 | 7713 | 0 | 8.95 |
| 25 | 2311 | 11 | 9612 | 0 | 9.22 |
| 30 | 2403 | 5 | 11436 | 0 | 9.11 |
| 35 | 2444 | 3 | 13331 | 0 | 9.13 |
| 40 | 2405 | 2 | 15237 | 0 | 9.18 |
| 45 | 2335 | 0 | 17150 | 0 | 9.17 |
| 50 | 2294 | 6 | 18996 | 0 | 9.36 |
| 55 | 2421 | 4 | 20830 | 0 | 9.09 |
| 60 | 2292 | 3 | 22767 | 0 | 9.54 |
## Wandering (completed car trips)

Detour ratio = distance driven (link and movement lengths) over the shortest network distance from the trip's origin to its destination. Detour against the free-flow route uses the time-shortest route with no congestion and no noise, which is what a purposeful driver without live information would follow (it differs from the shortest distance when a faster, longer road exists). A switch is a change of the remaining route while en route. Loops: the same link twice or the same node three or more times. Reversals: a link followed by its reverse within 200 m. 'Study-area vehicle-miles' are miles driven on links inside the study area; the last column is the share of them driven by trips with a detour ratio above 1.3. Guided drivers re-evaluate their route every epoch; the others keep their departure route unless it is blocked.

| Trips | n | Switches per trip | With a switch | Mean detour | Median detour | Detour > 1.3 | Detour > 2 | Mean detour vs free-flow route | Vs free-flow route > 1.3 | Loops | Reversals | Study veh-miles | Of them by detour > 1.3 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| all trips | 21018 | 0.01 | 1.0% | 1.085 | 1.049 | 4.5% | 0.0% | 1.020 | 1.6% | 0.0% | 0.2% | 2079 | 7.0% |
| gate to gate | 7200 | 0.02 | 1.9% | 1.086 | 1.058 | 3.0% | 0.0% | 1.017 | 1.3% | 0.0% | 0.1% | 450 | 7.1% |
| with a local end | 13818 | 0.00 | 0.5% | 1.085 | 1.047 | 5.3% | 0.0% | 1.021 | 1.7% | 0.0% | 0.3% | 1629 | 6.9% |
| guided drivers | 9651 | 0.02 | 2.0% | 1.085 | 1.048 | 4.5% | 0.0% | 1.020 | 1.6% | 0.0% | 0.1% | 935 | 7.6% |
| other drivers | 11367 | 0.00 | 0.1% | 1.086 | 1.050 | 4.5% | 0.0% | 1.019 | 1.6% | 0.0% | 0.3% | 1145 | 6.4% |

## Reported patterns (diagnostics; configured in the targets file under `patterns`)

(a) Trips between the surface gates on the north side of the ramps and the freeway mainline gates, and the local-street (residential and service links in the study area) vehicle-miles they drive. Share = of all completed trips' local-street vehicle-miles (369 miles). No observed counterpart exists for this quantity (the targets file has only the select-link shares above).

| Trips | n trips | Local-street veh-miles | Share of all local-street veh-miles |
| --- | --- | --- | --- |
| surface gates to the freeway | 993 | 25.6 | 7% |
| freeway to the surface gates | 1241 | 27.2 | 7% |

(b) Corridor trips: completed trips from beyond one end of the corridor's study-area extent (the bypass street and its arterial together) to beyond the other end, within a lateral limit of the corridor, by direction. 'Bypass' = at least N blocks (links) on the bypass street; 'arterial' = fewer bypass blocks and at least N on the arterial; 'other' = neither (another street, the freeway or a short use); blocks are counted on the corridor's study-area links. No observed counterpart exists for these shares. The related observed values are in the select-link table above: northbound Hillegass Ave traffic rarely ends on College Ave (6%), 21 to 33% jogs to Benvenue Ave, and southbound freeway-bound drivers on College Ave commonly arrive via Ashby Ave and Benvenue Ave and jog to Hillegass Ave.

| Bypass | Arterial | N | Direction | Corridor trips | Bypass | Arterial | Other | Mean bypass blocks |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue | College Avenue | 3 | N | 1009 | 4% | 18% | 78% | 0.2 |
| Hillegass Avenue | College Avenue | 3 | S | 1289 | 3% | 26% | 72% | 0.2 |

## Per-mode results

Offered: 22424 car veh/h; 497 bicycle flows (702/h); 2000 pedestrian flows (1340/h). Bicycle and pedestrian volumes are assumptions, not counts.

| Mode | In network | Completed | Mean time (s) | Other |
| --- | --- | --- | --- | --- |
| Car | 2292 | 22767 | 371 | |
| Bicycle | 50 | 720 | 245 | |
| Pedestrian | 176 | 1222 | 461 | mean crossing delay 7.1 s |

Vulnerable road users (surrogate indicators): pedestrian conflicts 208, bicycle conflicts 784, close passes 645, pedestrian injury severity mean 0.044 (AIS4+, 7504 supported of 7504 encounters), cyclist injury severity mean 0.062 (MAIS3+F, 2882 supported of 5367 encounters) (separate endpoints, never summed), mean vehicle speed at pedestrian encounters 2.32 m/s.


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
| SR-24 off-ramp traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | OBSERVED turn count x ASSUMPTION share (131 left turns x 0.40) | 52 (38 to 62) | 48 | within |
| Telegraph Ave and south-side traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | ASSUMPTION: the through left-turners (131 x 0.62 = 81) that are not off-ramp traffic | 29 (19 to 43) | 31 | within |
| SR-24 off-ramp traffic using Colby St to reach College Ave and Berkeley (right at Alcatraz Ave) | OBSERVED turn count x ASSUMPTION share (32 right turns x 0.40) | 13 (9 to 15) | 4 | below |
| Telegraph Ave and south-side traffic using Colby St to reach College Ave and Berkeley | ASSUMPTION: the through right-turners (32 x 0.62 = 20) that are not off-ramp traffic | 7 (5 to 11) | 26 | above |
| Intents listed, together | | 101 (71 to 131) | 109 | |
| Other through cars (no intent listed) | | | 1 | |

Model through cars by origin and destination group (largest 12 of 12 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 48.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 25.0 | Telegraph Avenue |
| Telegraph Ave to the south (downtown Oakland) | Telegraph Ave from the north (Berkeley) | 18.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Ashby Ave from the west (Emeryville and I-80) | 6.0 | Claremont Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Emeryville and West Oakland streets (55th to 67th Streets) | 4.0 | Claremont Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 2.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 2.0 | SR-24 |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Alcatraz Ave from the west (Emeryville side) | 1.0 | College Avenue then Alcatraz Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) | 1.0 | SR-24 then Telegraph Avenue then Alcatraz Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Telegraph Ave from the north (Berkeley) | 1.0 | Telegraph Avenue |
| Telegraph Ave to the south (downtown Oakland) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 1.0 | Telegraph Avenue |
| Emeryville and West Oakland streets (55th to 67th Streets) | Claremont Ave and Tunnel Rd toward the hills | 1.0 | Alcatraz Avenue then Claremont Avenue |

By the arterial these cars would otherwise use: Telegraph Avenue 95 veh/h; Claremont Avenue 10 veh/h; SR-24 2 veh/h; Alcatraz Avenue then Claremont Avenue 1 veh/h; College Avenue then Alcatraz Avenue 1 veh/h; SR-24 then Telegraph Avenue then Alcatraz Avenue 1 veh/h.

### Hillegass Avenue NB

Observed (PM): 94 cars entered at the south end, 48 drove the whole street, 109 left it at Alcatraz Ave (43 west, 54 east, 12 straight), and 47% of the block's trips came from a freeway. ASSUMPTION: freeway-origin through cars are 40 veh/h (52 freeway-origin trips times 94 / (94 + 29)), spread over the exits in proportion (0.37); the through share of exits is 48 / 109 = 0.44.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Hillegass Ave to reach Alcatraz Ave west and Telegraph Ave north | OBSERVED turn count x ASSUMPTION share (43 left turns x 0.37) | 16 (9 to 20) | 21 | above |
| SR-24 off-ramp traffic using Hillegass Ave to reach College Ave and Berkeley | OBSERVED turn count x ASSUMPTION share (54 right turns x 0.37) | 20 (11 to 25) | 27 | above |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach Alcatraz Ave west | ASSUMPTION: through exits (43 x 0.44) that are not off-ramp traffic | 3 (0 to 10) | 4 | within |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach College Ave and Berkeley | ASSUMPTION: through exits (54 x 0.44) that are not off-ramp traffic | 4 (0 to 13) | 22 | above |
| Intents listed, together | | 43 (20 to 68) | 74 | |
| Other through cars (no intent listed) | | | 2 | |

Model through cars by origin and destination group (largest 12 of 21 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 15.0 | SR-24 |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 14.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 12.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 6.0 | SR-24 then Claremont Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | College Ave from the north (Berkeley) | 5.0 | SR-24 then Claremont Avenue then College Avenue |
| Telegraph Ave to the south (downtown Oakland) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 5.0 | Telegraph Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Alcatraz Ave from the west (Emeryville side) | 2.0 | SR-24 then Telegraph Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Shattuck Ave from the north (Berkeley) | 2.0 | SR-24 then Telegraph Avenue then Alcatraz Avenue |
| Telegraph Ave to the south (downtown Oakland) | Claremont Ave and Tunnel Rd toward the hills | 2.0 | Claremont Avenue |
| Telegraph Ave to the south (downtown Oakland) | Telegraph Ave from the north (Berkeley) | 2.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | San Pablo Ave (Emeryville and West Oakland) | 1.0 | College Avenue then Alcatraz Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | College Ave from the north (Berkeley) | 1.0 | College Avenue |
| other pairs | | 9.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 36 veh/h; SR-24 16 veh/h; SR-24 then Claremont Avenue 6 veh/h; SR-24 then Claremont Avenue then College Avenue 5 veh/h; Claremont Avenue 3 veh/h; SR-24 then Telegraph Avenue 3 veh/h.

### Hillegass Avenue SB

Observed (PM): 178 cars entered at the top (76 turned in from Alcatraz Ave west, 98 from the east, 4 came straight from the north), 79 drove the whole street, and 68% of the block's trips (109 veh/h) went to a freeway. ASSUMPTION: freeway-bound cars that did not join mid-street are 87 veh/h (109 x 178 / (178 + 44)), half of the 174 turn-ins; low = the whole-street share of the turn-ins (0.45), high = the freeway-bound share without the mid-street correction (0.63).

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Telegraph Ave, Alcatraz Ave west and West Berkeley traffic turning off Alcatraz Ave onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (76 turn-ins x 0.50) | 38 (34 to 48) | 13 | below |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (98 turn-ins x 0.50) | 49 (44 to 62) | 27 | below |
| Intents listed, together | | 87 (78 to 110) | 40 | |
| Other through cars (no intent listed) | | | 46 | |

Model through cars by origin and destination group (largest 12 of 13 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 29.0 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 13.0 | Claremont Avenue then SR-24 |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 13.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 8.0 | Claremont Avenue then SR-24 |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 6.0 | College Avenue then Claremont Avenue then SR-24 |
| Telegraph Ave from the north (Berkeley) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 6.0 | College Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Telegraph Ave to the south (downtown Oakland) | 4.0 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | College Ave from the north (Berkeley) | 2.0 | College Avenue |
| Ashby Ave from the west (Emeryville and I-80) | Claremont Ave and Tunnel Rd toward the hills | 1.0 | none near the study area |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | West Oakland to the southwest (Adeline St, Market St) | 1.0 | Telegraph Avenue |
| San Pablo Ave (Emeryville and West Oakland) | Claremont Ave and Tunnel Rd toward the hills | 1.0 | Alcatraz Avenue then Claremont Avenue |
| Shattuck Ave from the north (Berkeley) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 1.0 | none near the study area |
| other pairs | | 1.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 47 veh/h; Claremont Avenue then SR-24 21 veh/h; College Avenue 8 veh/h; College Avenue then Claremont Avenue then SR-24 6 veh/h; none near the study area 2 veh/h; Alcatraz Avenue then Claremont Avenue 1 veh/h.

### Colby Street SB

Observed (PM): 139 cars entered at the top (76 from Alcatraz Ave west, 50 from the east, 13 from the north), 39 drove the whole street, 45% of the block's trips (72 veh/h) went to a freeway and 22% came by way of Telegraph Ave. ASSUMPTION: freeway-bound cars that did not join mid-street are 46 veh/h (72 x 139 / (139 + 79)), 0.365 of the 126 turn-ins; low = the whole-street share (0.31), high = the unadjusted freeway share (0.57). The Telegraph Ave cars are the 22% x 160 = 35 of the 76 west turn-ins.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Southbound Telegraph Ave traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (35 Telegraph Ave cars x 0.365) | 13 (11 to 20) | 16 | within |
| Alcatraz Ave west, Ashby Ave and West Berkeley traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (41 other west turn-ins x 0.365) | 15 (13 to 23) | 18 | within |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (50 east turn-ins x 0.365) | 18 (15 to 29) | 11 | below |
| Intents listed, together | | 46 (39 to 72) | 45 | |
| Other through cars (no intent listed) | | | 55 | |

Model through cars by origin and destination group (largest 12 of 25 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 33.0 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 15.0 | Telegraph Avenue |
| Shattuck Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 7.0 | none near the study area |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 6.0 | Telegraph Avenue |
| Alcatraz Ave from the west (Emeryville side) | SR-13 Warren Freeway (via SR-24 east) | 4.0 | SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | West Oakland to the southwest (Adeline St, Market St) | 4.0 | Telegraph Avenue |
| Alcatraz Ave from the west (Emeryville side) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 3.0 | SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 3.0 | Alcatraz Avenue then Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 3.0 | Telegraph Avenue |
| Ashby Ave from the west (Emeryville and I-80) | SR-13 Warren Freeway (via SR-24 east) | 2.0 | SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Telegraph Ave to the south (downtown Oakland) | 2.0 | Claremont Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 2.0 | Claremont Avenue then SR-24 |
| other pairs | | 16.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 62 veh/h; none near the study area 11 veh/h; SR-24 10 veh/h; Claremont Avenue 5 veh/h; Alcatraz Avenue then Telegraph Avenue 3 veh/h; Claremont Avenue then SR-24 3 veh/h.

### Study area, all residential and service streets

Model: 547 through cars per hour.

Model through cars by origin and destination group (largest 12 of 62 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 81.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 73.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 58.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 45.0 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 28.0 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 23.0 | Telegraph Avenue |
| Telegraph Ave to the south (downtown Oakland) | Telegraph Ave from the north (Berkeley) | 18.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Ashby Ave from the west (Emeryville and I-80) | 15.0 | Claremont Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Emeryville and West Oakland streets (55th to 67th Streets) | 15.0 | Claremont Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 15.0 | SR-24 |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 13.0 | Claremont Avenue then SR-24 |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 12.0 | Telegraph Avenue |
| other pairs | | 151.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 377 veh/h; Claremont Avenue 51 veh/h; SR-24 26 veh/h; none near the study area 24 veh/h; Claremont Avenue then SR-24 14 veh/h; Alcatraz Avenue then Claremont Avenue 8 veh/h.

By origin group: Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 143; South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 122; SR-24 eastbound off-ramps (arriving from Oakland and I-980) 90; Telegraph Ave from the north (Berkeley) 56; Telegraph Ave to the south (downtown Oakland) 43; Claremont Ave and Tunnel Rd toward the hills 13; West Oakland to the southwest (Adeline St, Market St) 13; Shattuck Ave from the north (Berkeley) 12; Ashby Ave from the west (Emeryville and I-80) 10; Emeryville and West Oakland streets (55th to 67th Streets) 9.

By destination group: South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 133; SR-24 westbound on-ramps (toward Oakland and I-980) 110; Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 99; Telegraph Ave from the north (Berkeley) 80; Claremont Ave and Tunnel Rd toward the hills 31; Emeryville and West Oakland streets (55th to 67th Streets) 17; Ashby Ave from the west (Emeryville and I-80) 16; College Ave from the north (Berkeley) 14; Shattuck Ave from the north (Berkeley) 12; Telegraph Ave to the south (downtown Oakland) 10.


## Through cars by intent (cut-through intent view)

A through car is tallied once, under the first intent that fits it (the on-ramp on its planned route, the off-ramp it has driven, or the origin and destination groups of its trip), at the moment the through count counts it. Cars an hour over the run, the same window as the through-car figure (551 an hour).

| Intent | Basis | Cars an hour | Share |
| --- | --- | --- | --- |
| on-2853241697 | observed | 111 | 20% |
| Other on-ramps | assumed | 12 | 2% |
| off-52990846 | observed | 90 | 16% |
| Other off-ramps | assumed | 9 | 2% |
| Downtown, south and west Oakland traffic using side streets to reach Berkeley and Telegraph Ave north | assumed | 119 | 22% |
| Berkeley and Telegraph Ave north traffic using side streets to reach downtown, south and west Oakland | assumed | 124 | 23% |
| Oakland cross-town traffic (West Oakland, Broadway, Piedmont, Emeryville) using side streets near Claremont Ave and Telegraph Ave | assumed | 54 | 10% |
| Other (no intent listed) |  | 32 | 6% |

Intents listed cover 94% of through cars.


## Select-link shares: modeled vs observed (design D5: headline = freeway shares, tolerance +/-10 pp)

- Hillegass Avenue NB: 4 links (path Claremont Avenue -> Alcatraz Avenue (434 m)), 148 trips (141 completed)
- Colby Street NB: 8 links (path Claremont Avenue -> Alcatraz Avenue (680 m)), 197 trips (182 completed)
- Hillegass Avenue SB: 4 links (path Alcatraz Avenue -> Claremont Avenue (433 m)), 138 trips (133 completed)
- Colby Street SB: 8 links (path Alcatraz Avenue -> Claremont Avenue (680 m)), 233 trips (220 completed)

| Block | Side | Via | Observed | Modeled | Diff (pp) | n trips | Headline |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue NB | from | freeway | 47% | 55% | +8 | 148 | within |
| Hillegass Avenue NB | to | Benvenue Avenue | 21% (PM 33%) | 7% | -14 | 148 |  |
| Hillegass Avenue NB | to | College Avenue | 6% | 15% | +9 | 148 |  |
| Hillegass Avenue NB | to | Alcatraz Avenue WB | 27% | 37% | +10 | 148 |  |
| Colby Street NB | from | freeway | 47% | 46% | -1 | 197 | within |
| Colby Street NB | to | Alcatraz Avenue WB | 48% | 58% | +10 | 197 |  |
| Colby Street NB | to | Telegraph Avenue | 25% | 45% | +20 | 197 |  |
| Colby Street NB | to | College Avenue | 3% | 2% | -1 | 197 |  |
| Hillegass Avenue SB | from | Alcatraz Avenue WB | 46% | 19% | -27 | 138 |  |
| Hillegass Avenue SB | from | Benvenue Avenue | 26% | 1% | -25 | 138 |  |
| Hillegass Avenue SB | from | College Avenue | 16% | 14% | -2 | 138 |  |
| Hillegass Avenue SB | to | freeway | 57% (PM 68%) | 54% | -3 | 138 | within |
| Colby Street SB | from | Alcatraz Avenue EB | 43% | 26% | -17 | 233 |  |
| Colby Street SB | from | Alcatraz Avenue WB | 46% | 6% | -40 | 233 |  |
| Colby Street SB | from | Telegraph Avenue | 22% | 21% | -1 | 233 |  |
| Colby Street SB | to | freeway | 45% | 45% | +0 | 233 | within |
| Colby Street SB | to | Forest Street | 34% | 16% | -18 | 233 |  |

Headline shares within tolerance: 4 of 4. Observed column uses the PM-peak share where one is given and the period is pm_peak. 'Via' shares are the fraction of select-link trips using that street before (from) or after (to) the block; freeway = origin / destination gate with a motorway-class link attached.

## Claremont ramps: streets used before the on-ramp / after the off-ramp

Observed shares are for traffic from/to the north only. 'Modeled' is over all trips on the ramps and any visit to the street (an upper bound for streets that serve both sides). 'Modeled, side' counts only trips whose surface end lies on the side of the ramp stated in the targets file (`freewayRamp.side`), and for a street with a qualifier ("north of X") only its links on that side of X.

| Direction | Via | Observed | Modeled | n ramp trips | Modeled, side | n side trips |
| --- | --- | --- | --- | --- | --- | --- |
| onto freeway | College Avenue | 16% | 14% | 667 | 16% | 589 |
| onto freeway | Hillegass Avenue | 12% | 13% | 667 | 15% | 589 |
| onto freeway | Martin Street | 10% | 13% | 667 | 14% | 589 |
| onto freeway | Colby Street | 8% | 12% | 667 | 14% | 589 |
| onto freeway | Telegraph Avenue north of Alcatraz Avenue | 8% | 10% | 667 | 8% | 589 |
| onto freeway | Benvenue Avenue | 5% | 4% | 667 | 4% | 589 |
| from freeway | College Avenue | 10% | 10% | 653 | 11% | 617 |
| from freeway | Martin Street | 10% | 11% | 653 | 12% | 617 |
| from freeway | Colby Street | 8% | 10% | 653 | 11% | 617 |
| from freeway | Hillegass Avenue | 5% | 8% | 653 | 9% | 617 |
| from freeway | Benvenue Avenue | 3% | 2% | 653 | 2% | 617 |

## Top 15 links by delay

| Link | Street | Class | Lanes | Len (m) | End node control | Delay (veh-h) | Stopped (veh-h) | Mean stopped veh | Flow (veh/h) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 4175 | (unnamed) | Motorway | 2 | 142 | uncontrolled | 19.89 | 3.54 | 3.5 | 1538 |
| 834 | Martin Luther King Junior Way | Secondary | 4 | 49 | signal | 7.72 | 5.54 | 5.5 | 1391 |
| 1049 | Adeline Street | Secondary | 4 | 43 | signal | 6.44 | 5.46 | 5.5 | 986 |
| 460 | Sacramento Street | Tertiary | 2 | 104 | two_way_stop | 6.10 | 5.05 | 5.1 | 462 |
| 1108 | Market Street | Secondary | 4 | 36 | signal | 6.07 | 4.92 | 4.9 | 1174 |
| 1666 | 52nd Street | Secondary | 4 | 39 | signal | 5.74 | 4.97 | 5.0 | 707 |
| 3363 | Tunnel Road | Primary | 1 | 152 | two_way_stop | 5.55 | 3.14 | 3.1 | 1021 |
| 1122 | Alcatraz Avenue | Tertiary | 1 | 299 | signal | 5.48 | 3.61 | 3.6 | 388 |
| 769 | Martin Luther King Junior Way | Secondary | 3 | 112 | signal | 5.42 | 3.42 | 3.4 | 1393 |
| 115 | San Pablo Avenue | Primary | 3 | 54 | signal | 5.27 | 4.19 | 4.2 | 755 |
| 755 | Market Street | Tertiary | 2 | 77 | signal | 4.98 | 4.20 | 4.2 | 538 |
| 1051 | Adeline Street | Secondary | 4 | 50 | signal | 4.93 | 4.28 | 4.3 | 744 |
| 1662 | 52nd Street | Secondary | 4 | 53 | signal | 4.41 | 3.15 | 3.2 | 1033 |
| 1630 | Telegraph Avenue | Secondary | 3 | 36 | signal | 4.40 | 3.60 | 3.6 | 701 |
| 498 | Sacramento Street | Tertiary | 3 | 48 | signal | 4.31 | 3.62 | 3.6 | 445 |

## Top 15 nodes by blocked time

Blocked time = lane-head seconds waiting at the stop line without permission (signal red, conflict, stop sign or no downstream space).

| Node | Streets | Control | Gate | Blocked (lane-h) | of which no downstream space | Signal plan at end (cycle: greens) |
| --- | --- | --- | --- | --- | --- | --- |
| 447 | Adeline Street / Alcatraz Avenue | signal |  | 4.60 | 0.07 | 75 s: 26/39 |
| 446 | Market Street / Stanford Avenue | signal |  | 4.48 | 0.16 | 75 s: 32/33 |
| 680 | 52nd Street / Shattuck Avenue | signal |  | 4.40 | 0.05 | 90 s: 18/19/37 |
| 37 | San Pablo Avenue / Stanford Avenue | signal |  | 3.11 | 0.02 | 75 s: 28/37 |
| 30 | 57th Street / Adeline Street / Market Street | signal |  | 3.07 | 0.03 | 75 s: 22/23/15 |
| 332 | 55th Street / Martin Luther King Junior Way | signal |  | 2.90 | 0.04 | 75 s: 33/32 |
| 242 | Ashby Avenue / Martin Luther King Junior Way | signal |  | 2.87 | 0.01 | 75 s: 43/22 |
| 185 | Alcatraz Avenue / Sacramento Street | signal |  | 2.77 | 0.04 | 75 s: 29/36 |
| 613 | 52nd Street / Claremont Avenue / Telegraph Avenue | signal |  | 2.66 | 0.06 | 75 s: 44/21 |
| 1406 | Ashby Avenue / Claremont Avenue | signal |  | 2.61 | 0.16 | 75 s: 50/15 |
| 851 | Alcatraz Avenue / Telegraph Avenue | signal |  | 2.52 | 0.04 | 75 s: 43/22 |
| 713 | 51st Street / Telegraph Avenue | signal |  | 2.51 | 0.01 | 75 s: 31/34 |
| 479 | Adeline Street / Martin Luther King Junior Way / Stanford Avenue | signal |  | 2.31 | 0.01 | 75 s: 49/16 |
| 944 | Ashby Avenue / Shattuck Avenue | signal |  | 2.31 | 0.01 | 75 s: 41/24 |
| 331 | 52nd Street / Martin Luther King Junior Way | signal |  | 2.27 | 0.02 | 75 s: 49/16 |

Phases of the five most blocked signals (green s: approach links with their lanes, link ids in brackets):

- node 447: 26 s: Adeline Street 4L [1049], Adeline Street 4L [1051]; 39 s: Alcatraz Avenue 2L [1048], Alcatraz Avenue 2L [1133]
- node 446: 32 s: Stanford Avenue 3L [941], Stanford Avenue 3L [1055]; 33 s: Market Street 4L [1108], Market Street 3L [1111]
- node 680: 18 s: 52nd Street 4L [1662]; 19 s: 52nd Street 4L [1666], 52nd Street 4L [1662]; 37 s: Shattuck Avenue 2L [1653], Shattuck Avenue 2L [1705]
- node 37: 28 s: San Pablo Avenue 3L [114], San Pablo Avenue 3L [115]; 37 s: Stanford Avenue 3L [108], Stanford Avenue 2L [4109]
- node 30: 22 s: Adeline Street 1L [747], Adeline Street 1L [1030]; 23 s: Market Street 2L [755], Market Street 2L [1113]; 15 s: 57th Street 1L [44], 57th Street 1L [1151]

## Junction recovery

Policy `physical`. Node entries by cars and cyclists in the run: 697989 (settle interval 0). An admission is an entry the ordinary rule would have refused; head-seconds count the time a waiting head vehicle had the reason invoked, and the part of it in which it still could not enter. Courtesy and the yield fallback change priority only; under `physical` the conflict bypass never admits.

| Reason | Admissions per hour | Per 1,000 entries | Head-s invoked | Head-s blocked |
| --- | --- | --- | --- | --- |
| courtesy | 150.0 | 0.215 | 446 | 403 |
| yield fallback | 40.0 | 0.057 | 11 | 0 |
| conflict bypass | 0.0 | 0.000 | 0 | 0 |

Vehicles removed while held in a node by a full exit: 0 (0.0 per hour, included in the gridlock removals).

| Node | Streets | Control | Courtesy | Yield fallback | Conflict bypass | Held removals |
| --- | --- | --- | --- | --- | --- | --- |
| 141 | 63rd Street / Lowell Street / Market Street | two_way_stop | 11 | 4 | 0 | 0 |
| 1220 | Ashby Avenue / College Avenue | signal | 14 | 0 | 0 | 0 |
| 30 | 57th Street / Adeline Street / Market Street | signal | 10 | 0 | 0 | 0 |
| 1429 | Claremont Avenue / Claremont Boulevard | two_way_stop | 10 | 0 | 0 | 0 |
| 492 | Aileen Street / Shattuck Avenue | two_way_stop | 4 | 5 | 0 | 0 |
| 147 | 59th Street / Grace Avenue / Los Angeles Street | two_way_stop | 8 | 0 | 0 | 0 |
| 242 | Ashby Avenue / Martin Luther King Junior Way | signal | 7 | 0 | 0 | 0 |
| 1152 | Ashby Avenue / Ashby Place / Elmwood Avenue | two_way_stop | 5 | 2 | 0 | 0 |
| 680 | 52nd Street / Shattuck Avenue | signal | 5 | 0 | 0 | 0 |
| 766 | 57th Street / Shattuck Avenue | two_way_stop | 5 | 0 | 0 | 0 |

## Entry backlog by origin node at end of run (top 10)

| Node | Streets | Trips waiting | Offered veh/h (before scale) |
| --- | --- | --- | --- |
| 265 | Ashby Avenue | 3 | 1243 |

## Flow on key streets (veh/h per direction, study-area links of 40 m or more)

| Street | Direction of travel | Links | Median flow | Max flow |
| --- | --- | --- | --- | --- |
| Telegraph | N | 12 | 799 | 844 |
| Telegraph | S | 10 | 899 | 934 |
| College | N | 3 | 284 | 284 |
| College | S | 3 | 467 | 467 |
| Claremont | N | 6 | 307 | 614 |
| Claremont | S | 7 | 432 | 827 |
| Alcatraz | E | 6 | 488 | 492 |
| Alcatraz | W | 6 | 379 | 437 |
| Hillegass | N | 4 | 90 | 90 |
| Hillegass | S | 4 | 82 | 88 |
| Colby | N | 7 | 110 | 120 |
| Colby | S | 7 | 134 | 172 |
| Martin | E | 2 | 118 | 118 |
| Martin | W | 2 | 110 | 110 |

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
