# Calibration report: rockridge am_peak scale 1 seed 1 (60 min)

Offered demand 22424 veh/h x scale 1 = 22424 veh/h. Run took 23.4 s wall clock. Flow tables use the window after a 10 min warm-up; select-link and health figures cover the whole run from an empty network.

## Stability (design D4)

| Criterion | Threshold | Value | Result |
| --- | --- | --- | --- |
| Gridlock removals | 0 | 0 | pass |
| Backlog / spawned | < 2% | 0.0% (4 of 22516) | pass |
| Arterial mean speed (run) | > 4 m/s | 9.25 m/s (last 15 min 9.31) | pass |

Overall: **STABLE**. Mean trip delay 120 s, mean trip time 367 s, completed 22811, unroutable 0.

| t (min) | vehicles in network | backlog | completed | removals | arterial speed in interval (m/s) |
| --- | --- | --- | --- | --- | --- |
| 5 | 2407 | 0 | 2008 | 0 | 9.31 |
| 10 | 2385 | 0 | 3934 | 0 | 9.18 |
| 15 | 2363 | 2 | 5805 | 0 | 9.07 |
| 20 | 2381 | 3 | 7699 | 0 | 9.12 |
| 25 | 2267 | 2 | 9648 | 0 | 9.32 |
| 30 | 2360 | 1 | 11466 | 0 | 9.37 |
| 35 | 2375 | 3 | 13383 | 0 | 9.51 |
| 40 | 2364 | 4 | 15259 | 0 | 9.19 |
| 45 | 2361 | 0 | 17107 | 0 | 9.06 |
| 50 | 2368 | 2 | 18909 | 0 | 8.98 |
| 55 | 2343 | 3 | 20892 | 0 | 9.22 |
| 60 | 2230 | 4 | 22811 | 0 | 9.74 |
## Wandering (completed car trips)

Detour ratio = distance driven (link and movement lengths) over the shortest network distance from the trip's origin to its destination. Detour against the free-flow route uses the time-shortest route with no congestion and no noise, which is what a purposeful driver without live information would follow (it differs from the shortest distance when a faster, longer road exists). A switch is a change of the remaining route while en route. Loops: the same link twice or the same node three or more times. Reversals: a link followed by its reverse within 200 m. 'Study-area vehicle-miles' are miles driven on links inside the study area; the last column is the share of them driven by trips with a detour ratio above 1.3. Guided drivers re-evaluate their route every epoch; the others keep their departure route unless it is blocked.

| Trips | n | Switches per trip | With a switch | Mean detour | Median detour | Detour > 1.3 | Detour > 2 | Mean detour vs free-flow route | Vs free-flow route > 1.3 | Loops | Reversals | Study veh-miles | Of them by detour > 1.3 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| all trips | 21078 | 0.01 | 1.2% | 1.084 | 1.048 | 4.5% | 0.0% | 1.019 | 1.5% | 0.0% | 0.2% | 2094 | 6.9% |
| gate to gate | 7223 | 0.02 | 2.3% | 1.088 | 1.060 | 3.3% | 0.0% | 1.019 | 1.5% | 0.0% | 0.2% | 457 | 8.0% |
| with a local end | 13855 | 0.01 | 0.6% | 1.082 | 1.045 | 5.1% | 0.0% | 1.019 | 1.5% | 0.0% | 0.2% | 1637 | 6.6% |
| guided drivers | 9687 | 0.02 | 2.5% | 1.085 | 1.048 | 4.6% | 0.0% | 1.019 | 1.6% | 0.0% | 0.1% | 955 | 7.8% |
| other drivers | 11391 | 0.00 | 0.1% | 1.084 | 1.048 | 4.3% | 0.0% | 1.018 | 1.4% | 0.0% | 0.2% | 1139 | 6.1% |

## Reported patterns (diagnostics; configured in the targets file under `patterns`)

(a) Trips between the surface gates on the north side of the ramps and the freeway mainline gates, and the local-street (residential and service links in the study area) vehicle-miles they drive. Share = of all completed trips' local-street vehicle-miles (364 miles). No observed counterpart exists for this quantity (the targets file has only the select-link shares above).

| Trips | n trips | Local-street veh-miles | Share of all local-street veh-miles |
| --- | --- | --- | --- |
| surface gates to the freeway | 995 | 29.6 | 8% |
| freeway to the surface gates | 1250 | 27.1 | 7% |

(b) Corridor trips: completed trips from beyond one end of the corridor's study-area extent (the bypass street and its arterial together) to beyond the other end, within a lateral limit of the corridor, by direction. 'Bypass' = at least N blocks (links) on the bypass street; 'arterial' = fewer bypass blocks and at least N on the arterial; 'other' = neither (another street, the freeway or a short use); blocks are counted on the corridor's study-area links. No observed counterpart exists for these shares. The related observed values are in the select-link table above: northbound Hillegass Ave traffic rarely ends on College Ave (6%), 21 to 33% jogs to Benvenue Ave, and southbound freeway-bound drivers on College Ave commonly arrive via Ashby Ave and Benvenue Ave and jog to Hillegass Ave.

| Bypass | Arterial | N | Direction | Corridor trips | Bypass | Arterial | Other | Mean bypass blocks |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue | College Avenue | 3 | N | 1018 | 4% | 18% | 78% | 0.2 |
| Hillegass Avenue | College Avenue | 3 | S | 1298 | 3% | 23% | 74% | 0.2 |

## Per-mode results

Offered: 22424 car veh/h; 497 bicycle flows (702/h); 2000 pedestrian flows (1340/h). Bicycle and pedestrian volumes are assumptions, not counts.

| Mode | In network | Completed | Mean time (s) | Other |
| --- | --- | --- | --- | --- |
| Car | 2230 | 22811 | 367 | |
| Bicycle | 52 | 718 | 245 | |
| Pedestrian | 176 | 1223 | 460 | mean crossing delay 7.0 s |

Vulnerable road users (surrogate indicators): pedestrian conflicts 175, bicycle conflicts 790, close passes 691, pedestrian injury severity mean 0.043 (AIS4+, 7319 supported of 7319 encounters), cyclist injury severity mean 0.063 (MAIS3+F, 2867 supported of 5379 encounters) (separate endpoints, never summed), mean vehicle speed at pedestrian encounters 2.29 m/s.


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
| Telegraph Ave and south-side traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | ASSUMPTION: the through left-turners (131 x 0.62 = 81) that are not off-ramp traffic | 29 (19 to 43) | 31 | within |
| SR-24 off-ramp traffic using Colby St to reach College Ave and Berkeley (right at Alcatraz Ave) | OBSERVED turn count x ASSUMPTION share (32 right turns x 0.40) | 13 (9 to 15) | 4 | below |
| Telegraph Ave and south-side traffic using Colby St to reach College Ave and Berkeley | ASSUMPTION: the through right-turners (32 x 0.62 = 20) that are not off-ramp traffic | 7 (5 to 11) | 21 | above |
| Intents listed, together | | 101 (71 to 131) | 102 | |
| Other through cars (no intent listed) | | | 2 | |

Model through cars by origin and destination group (largest 12 of 11 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 46.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 21.0 | Telegraph Avenue |
| Telegraph Ave to the south (downtown Oakland) | Telegraph Ave from the north (Berkeley) | 18.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Emeryville and West Oakland streets (55th to 67th Streets) | 6.0 | Claremont Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Ashby Ave from the west (Emeryville and I-80) | 5.0 | Claremont Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 2.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 2.0 | SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | College Ave from the north (Berkeley) | 1.0 | Telegraph Avenue then Alcatraz Avenue then College Avenue |
| San Pablo Ave (Emeryville and West Oakland) | College Ave from the north (Berkeley) | 1.0 | none near the study area |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) | 1.0 | SR-24 then Telegraph Avenue then Alcatraz Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Telegraph Ave from the north (Berkeley) | 1.0 | Telegraph Avenue |

By the arterial these cars would otherwise use: Telegraph Avenue 88 veh/h; Claremont Avenue 11 veh/h; SR-24 2 veh/h; SR-24 then Telegraph Avenue then Alcatraz Avenue 1 veh/h; Telegraph Avenue then Alcatraz Avenue then College Avenue 1 veh/h; none near the study area 1 veh/h.

### Hillegass Avenue NB

Observed (PM): 94 cars entered at the south end, 48 drove the whole street, 109 left it at Alcatraz Ave (43 west, 54 east, 12 straight), and 47% of the block's trips came from a freeway. ASSUMPTION: freeway-origin through cars are 40 veh/h (52 freeway-origin trips times 94 / (94 + 29)), spread over the exits in proportion (0.37); the through share of exits is 48 / 109 = 0.44.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Hillegass Ave to reach Alcatraz Ave west and Telegraph Ave north | OBSERVED turn count x ASSUMPTION share (43 left turns x 0.37) | 16 (9 to 20) | 23 | above |
| SR-24 off-ramp traffic using Hillegass Ave to reach College Ave and Berkeley | OBSERVED turn count x ASSUMPTION share (54 right turns x 0.37) | 20 (11 to 25) | 25 | within |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach Alcatraz Ave west | ASSUMPTION: through exits (43 x 0.44) that are not off-ramp traffic | 3 (0 to 10) | 1 | within |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach College Ave and Berkeley | ASSUMPTION: through exits (54 x 0.44) that are not off-ramp traffic | 4 (0 to 13) | 19 | above |
| Intents listed, together | | 43 (20 to 68) | 68 | |
| Other through cars (no intent listed) | | | 2 | |

Model through cars by origin and destination group (largest 12 of 19 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 16.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 15.0 | SR-24 |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 11.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | College Ave from the north (Berkeley) | 5.0 | SR-24 then Claremont Avenue then College Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 4.0 | SR-24 then Claremont Avenue |
| Telegraph Ave to the south (downtown Oakland) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 4.0 | Telegraph Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Alcatraz Ave from the west (Emeryville side) | 2.0 | SR-24 then Telegraph Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Shattuck Ave from the north (Berkeley) | 2.0 | SR-24 then Telegraph Avenue then Alcatraz Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | San Pablo Ave (Emeryville and West Oakland) | 1.0 | College Avenue then Alcatraz Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | College Ave from the north (Berkeley) | 1.0 | College Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Claremont Ave and Tunnel Rd toward the hills | 1.0 | Claremont Avenue |
| SR-13 Warren Freeway (via SR-24 east) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 1.0 | Claremont Avenue then Alcatraz Avenue |
| other pairs | | 7.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 33 veh/h; SR-24 16 veh/h; SR-24 then Claremont Avenue then College Avenue 5 veh/h; SR-24 then Claremont Avenue 4 veh/h; SR-24 then Telegraph Avenue 3 veh/h; Claremont Avenue 2 veh/h.

### Hillegass Avenue SB

Observed (PM): 178 cars entered at the top (76 turned in from Alcatraz Ave west, 98 from the east, 4 came straight from the north), 79 drove the whole street, and 68% of the block's trips (109 veh/h) went to a freeway. ASSUMPTION: freeway-bound cars that did not join mid-street are 87 veh/h (109 x 178 / (178 + 44)), half of the 174 turn-ins; low = the whole-street share of the turn-ins (0.45), high = the freeway-bound share without the mid-street correction (0.63).

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Telegraph Ave, Alcatraz Ave west and West Berkeley traffic turning off Alcatraz Ave onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (76 turn-ins x 0.50) | 38 (34 to 48) | 13 | below |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (98 turn-ins x 0.50) | 49 (44 to 62) | 27 | below |
| Intents listed, together | | 87 (78 to 110) | 40 | |
| Other through cars (no intent listed) | | | 38 | |

Model through cars by origin and destination group (largest 12 of 10 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 26.0 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 13.0 | Claremont Avenue then SR-24 |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 13.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 8.0 | Claremont Avenue then SR-24 |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 6.0 | College Avenue then Claremont Avenue then SR-24 |
| Telegraph Ave from the north (Berkeley) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 6.0 | College Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Telegraph Ave to the south (downtown Oakland) | 3.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | West Oakland to the southwest (Adeline St, Market St) | 1.0 | Telegraph Avenue |
| San Pablo Ave (Emeryville and West Oakland) | Claremont Ave and Tunnel Rd toward the hills | 1.0 | Alcatraz Avenue then Claremont Avenue |
| Telegraph Ave from the north (Berkeley) | College Ave from the north (Berkeley) | 1.0 | College Avenue |

By the arterial these cars would otherwise use: Telegraph Avenue 43 veh/h; Claremont Avenue then SR-24 21 veh/h; College Avenue 7 veh/h; College Avenue then Claremont Avenue then SR-24 6 veh/h; Alcatraz Avenue then Claremont Avenue 1 veh/h.

### Colby Street SB

Observed (PM): 139 cars entered at the top (76 from Alcatraz Ave west, 50 from the east, 13 from the north), 39 drove the whole street, 45% of the block's trips (72 veh/h) went to a freeway and 22% came by way of Telegraph Ave. ASSUMPTION: freeway-bound cars that did not join mid-street are 46 veh/h (72 x 139 / (139 + 79)), 0.365 of the 126 turn-ins; low = the whole-street share (0.31), high = the unadjusted freeway share (0.57). The Telegraph Ave cars are the 22% x 160 = 35 of the 76 west turn-ins.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Southbound Telegraph Ave traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (35 Telegraph Ave cars x 0.365) | 13 (11 to 20) | 18 | within |
| Alcatraz Ave west, Ashby Ave and West Berkeley traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (41 other west turn-ins x 0.365) | 15 (13 to 23) | 19 | within |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (50 east turn-ins x 0.365) | 18 (15 to 29) | 13 | below |
| Intents listed, together | | 46 (39 to 72) | 50 | |
| Other through cars (no intent listed) | | | 47 | |

Model through cars by origin and destination group (largest 12 of 24 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 29.0 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 17.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 7.0 | Telegraph Avenue |
| Shattuck Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 7.0 | none near the study area |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | West Oakland to the southwest (Adeline St, Market St) | 5.0 | Telegraph Avenue |
| Alcatraz Ave from the west (Emeryville side) | SR-13 Warren Freeway (via SR-24 east) | 4.0 | SR-24 |
| Alcatraz Ave from the west (Emeryville side) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 3.0 | SR-24 |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 3.0 | College Avenue then Claremont Avenue then SR-24 |
| Ashby Ave from the west (Emeryville and I-80) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 2.0 | Claremont Avenue |
| Ashby Ave from the west (Emeryville and I-80) | SR-13 Warren Freeway (via SR-24 east) | 2.0 | SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Telegraph Ave to the south (downtown Oakland) | 2.0 | Claremont Avenue |
| West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) | SR-24 westbound on-ramps (toward Oakland and I-980) | 2.0 | none near the study area |
| other pairs | | 14.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 59 veh/h; none near the study area 12 veh/h; SR-24 10 veh/h; Claremont Avenue 5 veh/h; Claremont Avenue then SR-24 3 veh/h; College Avenue then Claremont Avenue then SR-24 3 veh/h.

### Study area, all residential and service streets

Model: 516 through cars per hour.

Model through cars by origin and destination group (largest 12 of 61 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 67.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 58.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 56.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 50.0 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 29.0 | Telegraph Avenue |
| West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) | SR-24 westbound on-ramps (toward Oakland and I-980) | 18.0 | none near the study area |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Emeryville and West Oakland streets (55th to 67th Streets) | 18.0 | Claremont Avenue |
| Telegraph Ave to the south (downtown Oakland) | Telegraph Ave from the north (Berkeley) | 18.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 15.0 | SR-24 |
| Telegraph Ave from the north (Berkeley) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 14.0 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 13.0 | Claremont Avenue then SR-24 |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Ashby Ave from the west (Emeryville and I-80) | 13.0 | Claremont Avenue |
| other pairs | | 147.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 333 veh/h; Claremont Avenue 51 veh/h; none near the study area 37 veh/h; SR-24 26 veh/h; Claremont Avenue then SR-24 14 veh/h; Telegraph Avenue then Claremont Avenue 12 veh/h.

By origin group: Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 133; South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 107; SR-24 eastbound off-ramps (arriving from Oakland and I-980) 88; Telegraph Ave from the north (Berkeley) 47; Telegraph Ave to the south (downtown Oakland) 40; West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) 19; Claremont Ave and Tunnel Rd toward the hills 13; Shattuck Ave from the north (Berkeley) 12; West Oakland to the southwest (Adeline St, Market St) 11; Ashby Ave from the west (Emeryville and I-80) 9.

By destination group: SR-24 westbound on-ramps (toward Oakland and I-980) 133; South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 108; Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 81; Telegraph Ave from the north (Berkeley) 80; Claremont Ave and Tunnel Rd toward the hills 23; Emeryville and West Oakland streets (55th to 67th Streets) 18; College Ave from the north (Berkeley) 15; Ashby Ave from the west (Emeryville and I-80) 14; Shattuck Ave from the north (Berkeley) 10; Telegraph Ave to the south (downtown Oakland) 10.


## Through cars by intent (cut-through intent view)

A through car is tallied once, under the first intent that fits it (the on-ramp on its planned route, the off-ramp it has driven, or the origin and destination groups of its trip), at the moment the through count counts it. Cars an hour over the run, the same window as the through-car figure (520 an hour).

| Intent | Basis | Cars an hour | Share |
| --- | --- | --- | --- |
| on-2853241697 | observed | 133 | 26% |
| Other on-ramps | assumed | 11 | 2% |
| off-52990846 | observed | 89 | 17% |
| Other off-ramps | assumed | 9 | 2% |
| Downtown, south and west Oakland traffic using side streets to reach Berkeley and Telegraph Ave north | assumed | 104 | 20% |
| Berkeley and Telegraph Ave north traffic using side streets to reach downtown, south and west Oakland | assumed | 100 | 19% |
| Oakland cross-town traffic (West Oakland, Broadway, Piedmont, Emeryville) using side streets near Claremont Ave and Telegraph Ave | assumed | 49 | 9% |
| Other (no intent listed) |  | 25 | 5% |

Intents listed cover 95% of through cars.


## Select-link shares: modeled vs observed (design D5: headline = freeway shares, tolerance +/-10 pp)

- Hillegass Avenue NB: 4 links (path Claremont Avenue -> Alcatraz Avenue (434 m)), 141 trips (135 completed)
- Colby Street NB: 8 links (path Claremont Avenue -> Alcatraz Avenue (680 m)), 191 trips (179 completed)
- Hillegass Avenue SB: 4 links (path Alcatraz Avenue -> Claremont Avenue (433 m)), 130 trips (126 completed)
- Colby Street SB: 8 links (path Alcatraz Avenue -> Claremont Avenue (680 m)), 224 trips (215 completed)

| Block | Side | Via | Observed | Modeled | Diff (pp) | n trips | Headline |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue NB | from | freeway | 47% | 55% | +8 | 141 | within |
| Hillegass Avenue NB | to | Benvenue Avenue | 21% (PM 33%) | 6% | -15 | 141 |  |
| Hillegass Avenue NB | to | College Avenue | 6% | 12% | +6 | 141 |  |
| Hillegass Avenue NB | to | Alcatraz Avenue WB | 27% | 38% | +11 | 141 |  |
| Colby Street NB | from | freeway | 47% | 46% | -1 | 191 | within |
| Colby Street NB | to | Alcatraz Avenue WB | 48% | 58% | +10 | 191 |  |
| Colby Street NB | to | Telegraph Avenue | 25% | 42% | +17 | 191 |  |
| Colby Street NB | to | College Avenue | 3% | 2% | -1 | 191 |  |
| Hillegass Avenue SB | from | Alcatraz Avenue WB | 46% | 20% | -26 | 130 |  |
| Hillegass Avenue SB | from | Benvenue Avenue | 26% | 2% | -24 | 130 |  |
| Hillegass Avenue SB | from | College Avenue | 16% | 16% | +0 | 130 |  |
| Hillegass Avenue SB | to | freeway | 57% (PM 68%) | 58% | +1 | 130 | within |
| Colby Street SB | from | Alcatraz Avenue EB | 43% | 25% | -18 | 224 |  |
| Colby Street SB | from | Alcatraz Avenue WB | 46% | 7% | -39 | 224 |  |
| Colby Street SB | from | Telegraph Avenue | 22% | 19% | -3 | 224 |  |
| Colby Street SB | to | freeway | 45% | 50% | +5 | 224 | within |
| Colby Street SB | to | Forest Street | 34% | 18% | -16 | 224 |  |

Headline shares within tolerance: 4 of 4. Observed column uses the PM-peak share where one is given and the period is pm_peak. 'Via' shares are the fraction of select-link trips using that street before (from) or after (to) the block; freeway = origin / destination gate with a motorway-class link attached.

## Claremont ramps: streets used before the on-ramp / after the off-ramp

Observed shares are for traffic from/to the north only. 'Modeled' is over all trips on the ramps and any visit to the street (an upper bound for streets that serve both sides). 'Modeled, side' counts only trips whose surface end lies on the side of the ramp stated in the targets file (`freewayRamp.side`), and for a street with a qualifier ("north of X") only its links on that side of X.

| Direction | Via | Observed | Modeled | n ramp trips | Modeled, side | n side trips |
| --- | --- | --- | --- | --- | --- | --- |
| onto freeway | College Avenue | 16% | 13% | 673 | 14% | 608 |
| onto freeway | Hillegass Avenue | 12% | 13% | 673 | 14% | 608 |
| onto freeway | Martin Street | 10% | 15% | 673 | 15% | 608 |
| onto freeway | Colby Street | 8% | 13% | 673 | 14% | 608 |
| onto freeway | Telegraph Avenue north of Alcatraz Avenue | 8% | 13% | 673 | 10% | 608 |
| onto freeway | Benvenue Avenue | 5% | 3% | 673 | 4% | 608 |
| from freeway | College Avenue | 10% | 10% | 653 | 11% | 617 |
| from freeway | Martin Street | 10% | 11% | 653 | 12% | 617 |
| from freeway | Colby Street | 8% | 10% | 653 | 11% | 617 |
| from freeway | Hillegass Avenue | 5% | 8% | 653 | 9% | 617 |
| from freeway | Benvenue Avenue | 3% | 2% | 653 | 2% | 617 |

## Top 15 links by delay

| Link | Street | Class | Lanes | Len (m) | End node control | Delay (veh-h) | Stopped (veh-h) | Mean stopped veh | Flow (veh/h) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 4175 | (unnamed) | Motorway | 2 | 142 | uncontrolled | 19.63 | 3.36 | 3.4 | 1531 |
| 460 | Sacramento Street | Tertiary | 2 | 104 | two_way_stop | 8.06 | 6.77 | 6.8 | 407 |
| 834 | Martin Luther King Junior Way | Secondary | 4 | 49 | signal | 8.04 | 6.00 | 6.0 | 1232 |
| 1049 | Adeline Street | Secondary | 4 | 43 | signal | 6.28 | 5.26 | 5.3 | 973 |
| 764 | Martin Luther King Junior Way | Secondary | 4 | 48 | signal | 6.18 | 5.08 | 5.1 | 1390 |
| 1666 | 52nd Street | Secondary | 4 | 39 | signal | 6.03 | 5.24 | 5.2 | 686 |
| 1051 | Adeline Street | Secondary | 4 | 50 | signal | 5.99 | 5.20 | 5.2 | 844 |
| 1108 | Market Street | Secondary | 4 | 36 | signal | 5.00 | 3.92 | 3.9 | 1094 |
| 115 | San Pablo Avenue | Primary | 3 | 54 | signal | 4.84 | 3.91 | 3.9 | 654 |
| 1662 | 52nd Street | Secondary | 4 | 53 | signal | 4.81 | 3.45 | 3.5 | 1073 |
| 3363 | Tunnel Road | Primary | 1 | 152 | two_way_stop | 4.58 | 2.37 | 2.4 | 1064 |
| 1122 | Alcatraz Avenue | Tertiary | 1 | 299 | signal | 4.57 | 3.02 | 3.0 | 409 |
| 755 | Market Street | Tertiary | 2 | 77 | signal | 4.40 | 3.65 | 3.6 | 503 |
| 3001 | College Avenue | Tertiary | 1 | 107 | signal | 4.22 | 3.52 | 3.5 | 241 |
| 1037 | Sacramento Street | Tertiary | 3 | 40 | signal | 4.20 | 3.19 | 3.2 | 1194 |

## Top 15 nodes by blocked time

Blocked time = lane-head seconds waiting at the stop line without permission (signal red, conflict, stop sign or no downstream space).

| Node | Streets | Control | Gate | Blocked (lane-h) | of which no downstream space | Signal plan at end (cycle: greens) |
| --- | --- | --- | --- | --- | --- | --- |
| 447 | Adeline Street / Alcatraz Avenue | signal |  | 4.99 | 0.06 | 75 s: 25/40 |
| 680 | 52nd Street / Shattuck Avenue | signal |  | 4.58 | 0.04 | 90 s: 18/19/37 |
| 446 | Market Street / Stanford Avenue | signal |  | 4.38 | 0.17 | 75 s: 31/34 |
| 332 | 55th Street / Martin Luther King Junior Way | signal |  | 3.62 | 0.05 | 75 s: 34/31 |
| 37 | San Pablo Avenue / Stanford Avenue | signal |  | 3.06 | 0.02 | 75 s: 24/41 |
| 30 | 57th Street / Adeline Street / Market Street | signal |  | 3.04 | 0.03 | 75 s: 23/19/17 |
| 185 | Alcatraz Avenue / Sacramento Street | signal |  | 2.95 | 0.05 | 75 s: 32/33 |
| 242 | Ashby Avenue / Martin Luther King Junior Way | signal |  | 2.85 | 0.01 | 75 s: 43/22 |
| 1406 | Ashby Avenue / Claremont Avenue | signal |  | 2.69 | 0.13 | 75 s: 50/15 |
| 331 | 52nd Street / Martin Luther King Junior Way | signal |  | 2.66 | 0.03 | 75 s: 46/19 |
| 479 | Adeline Street / Martin Luther King Junior Way / Stanford Avenue | signal |  | 2.66 | 0.01 | 75 s: 50/15 |
| 851 | Alcatraz Avenue / Telegraph Avenue | signal |  | 2.59 | 0.03 | 75 s: 44/21 |
| 713 | 51st Street / Telegraph Avenue | signal |  | 2.53 | 0.02 | 75 s: 37/28 |
| 613 | 52nd Street / Claremont Avenue / Telegraph Avenue | signal |  | 2.51 | 0.13 | 75 s: 33/32 |
| 944 | Ashby Avenue / Shattuck Avenue | signal |  | 2.32 | 0.02 | 75 s: 49/16 |

Phases of the five most blocked signals (green s: approach links with their lanes, link ids in brackets):

- node 447: 25 s: Adeline Street 4L [1049], Adeline Street 4L [1051]; 40 s: Alcatraz Avenue 2L [1048], Alcatraz Avenue 2L [1133]
- node 680: 18 s: 52nd Street 4L [1662]; 19 s: 52nd Street 4L [1666], 52nd Street 4L [1662]; 37 s: Shattuck Avenue 2L [1653], Shattuck Avenue 2L [1705]
- node 446: 31 s: Stanford Avenue 3L [941], Stanford Avenue 3L [1055]; 34 s: Market Street 4L [1108], Market Street 3L [1111]
- node 332: 34 s: Martin Luther King Junior Way 4L [764], Martin Luther King Junior Way 4L [834]; 31 s: 55th Street 1L [712], 55th Street 1L [715]
- node 37: 24 s: San Pablo Avenue 3L [114], San Pablo Avenue 3L [115]; 41 s: Stanford Avenue 3L [108], Stanford Avenue 2L [4109]

## Junction recovery

Policy `physical`. Node entries by cars and cyclists in the run: 699474 (settle interval 0). An admission is an entry the ordinary rule would have refused; head-seconds count the time a waiting head vehicle had the reason invoked, and the part of it in which it still could not enter. Courtesy and the yield fallback change priority only; under `physical` the conflict bypass never admits.

| Reason | Admissions per hour | Per 1,000 entries | Head-s invoked | Head-s blocked |
| --- | --- | --- | --- | --- |
| courtesy | 142.0 | 0.203 | 463 | 417 |
| yield fallback | 39.0 | 0.056 | 10 | 0 |
| conflict bypass | 0.0 | 0.000 | 16 | 16 |

Vehicles removed while held in a node by a full exit: 0 (0.0 per hour, included in the gridlock removals).

| Node | Streets | Control | Courtesy | Yield fallback | Conflict bypass | Held removals |
| --- | --- | --- | --- | --- | --- | --- |
| 1220 | Ashby Avenue / College Avenue | signal | 17 | 0 | 0 | 0 |
| 242 | Ashby Avenue / Martin Luther King Junior Way | signal | 12 | 0 | 0 | 0 |
| 141 | 63rd Street / Lowell Street / Market Street | two_way_stop | 5 | 6 | 0 | 0 |
| 492 | Aileen Street / Shattuck Avenue | two_way_stop | 5 | 4 | 0 | 0 |
| 1429 | Claremont Avenue / Claremont Boulevard | two_way_stop | 9 | 0 | 0 | 0 |
| 30 | 57th Street / Adeline Street / Market Street | signal | 7 | 0 | 0 | 0 |
| 517 | Prince Street / Shattuck Avenue | two_way_stop | 5 | 2 | 0 | 0 |
| 528 | Shattuck Avenue / Woolsey Street | two_way_stop | 4 | 3 | 0 | 0 |
| 395 | 65th Street / Shattuck Avenue | two_way_stop | 3 | 3 | 0 | 0 |
| 766 | 57th Street / Shattuck Avenue | two_way_stop | 3 | 3 | 0 | 0 |

## Entry backlog by origin node at end of run (top 10)

| Node | Streets | Trips waiting | Offered veh/h (before scale) |
| --- | --- | --- | --- |
| 265 | Ashby Avenue | 4 | 1243 |

## Flow on key streets (veh/h per direction, study-area links of 40 m or more)

| Street | Direction of travel | Links | Median flow | Max flow |
| --- | --- | --- | --- | --- |
| Telegraph | N | 12 | 775 | 814 |
| Telegraph | S | 10 | 958 | 995 |
| College | N | 3 | 300 | 304 |
| College | S | 3 | 414 | 416 |
| Claremont | N | 6 | 281 | 583 |
| Claremont | S | 7 | 401 | 828 |
| Alcatraz | E | 6 | 426 | 430 |
| Alcatraz | W | 6 | 409 | 455 |
| Hillegass | N | 4 | 76 | 85 |
| Hillegass | S | 4 | 80 | 82 |
| Colby | N | 7 | 107 | 116 |
| Colby | S | 7 | 131 | 166 |
| Martin | E | 2 | 126 | 126 |
| Martin | W | 2 | 98 | 98 |

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
