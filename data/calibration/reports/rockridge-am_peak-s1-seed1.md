# Calibration report: rockridge am_peak scale 1 seed 1 (60 min)

Offered demand 21948 veh/h x scale 1 = 21948 veh/h. Run took 23.8 s wall clock. Flow tables use the window after a 10 min warm-up; select-link and health figures cover the whole run from an empty network.

## Stability (design D4)

| Criterion | Threshold | Value | Result |
| --- | --- | --- | --- |
| Gridlock removals | 0 | 0 | pass |
| Backlog / spawned | < 2% | 0.0% (1 of 22115) | pass |
| Arterial mean speed (run) | > 4 m/s | 9.62 m/s (last 15 min 9.46) | pass |

Overall: **STABLE**. Mean trip delay 112 s, mean trip time 401 s, completed 21744, unroutable 0.

| t (min) | vehicles in network | backlog | completed | removals | arterial speed in interval (m/s) |
| --- | --- | --- | --- | --- | --- |
| 5 | 2585 | 4 | 1873 | 0 | 9.82 |
| 10 | 2578 | 3 | 3706 | 0 | 9.57 |
| 15 | 2474 | 1 | 5630 | 0 | 9.66 |
| 20 | 2453 | 0 | 7417 | 0 | 9.93 |
| 25 | 2569 | 2 | 9157 | 0 | 9.88 |
| 30 | 2607 | 3 | 10962 | 0 | 9.58 |
| 35 | 2634 | 2 | 12755 | 0 | 9.45 |
| 40 | 2645 | 2 | 14481 | 0 | 9.60 |
| 45 | 2805 | 3 | 16216 | 0 | 9.71 |
| 50 | 2955 | 2 | 17960 | 0 | 9.68 |
| 55 | 2991 | 1 | 19848 | 0 | 9.30 |
| 60 | 2915 | 1 | 21744 | 0 | 9.38 |
## Wandering (completed car trips)

Detour ratio = distance driven (link and movement lengths) over the shortest network distance from the trip's origin to its destination. Detour against the free-flow route uses the time-shortest route with no congestion and no noise, which is what a purposeful driver without live information would follow (it differs from the shortest distance when a faster, longer road exists). A switch is a change of the remaining route while en route. Loops: the same link twice or the same node three or more times. Reversals: a link followed by its reverse within 200 m. 'Study-area vehicle-miles' are miles driven on links inside the study area; the last column is the share of them driven by trips with a detour ratio above 1.3. Guided drivers re-evaluate their route every epoch; the others keep their departure route unless it is blocked.

| Trips | n | Switches per trip | With a switch | Mean detour | Median detour | Detour > 1.3 | Detour > 2 | Mean detour vs free-flow route | Vs free-flow route > 1.3 | Loops | Reversals | Study veh-miles | Of them by detour > 1.3 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| all trips | 19951 | 0.01 | 0.6% | 1.085 | 1.051 | 3.7% | 0.0% | 1.021 | 1.0% | 0.0% | 5.0% | 1843 | 6.5% |
| gate to gate | 7573 | 0.01 | 0.7% | 1.087 | 1.062 | 2.0% | 0.0% | 1.019 | 0.6% | 0.0% | 7.4% | 388 | 6.8% |
| with a local end | 12378 | 0.01 | 0.5% | 1.084 | 1.047 | 4.8% | 0.0% | 1.023 | 1.3% | 0.0% | 3.6% | 1454 | 6.5% |
| guided drivers | 9304 | 0.01 | 1.2% | 1.086 | 1.053 | 3.6% | 0.0% | 1.022 | 1.0% | 0.0% | 5.2% | 858 | 5.9% |
| other drivers | 10647 | 0.00 | 0.0% | 1.085 | 1.050 | 3.8% | 0.0% | 1.021 | 1.0% | 0.0% | 4.9% | 985 | 7.1% |

## Reported patterns (diagnostics; configured in the targets file under `patterns`)

(a) Trips between the surface gates on the north side of the ramps and the freeway mainline gates, and the local-street (residential and service links in the study area) vehicle-miles they drive. Share = of all completed trips' local-street vehicle-miles (324 miles). No observed counterpart exists for this quantity (the targets file has only the select-link shares above).

| Trips | n trips | Local-street veh-miles | Share of all local-street veh-miles |
| --- | --- | --- | --- |
| surface gates to the freeway | 1277 | 24.0 | 7% |
| freeway to the surface gates | 1048 | 18.8 | 6% |

(b) Corridor trips: completed trips from beyond one end of the corridor's study-area extent (the bypass street and its arterial together) to beyond the other end, within a lateral limit of the corridor, by direction. 'Bypass' = at least N blocks (links) on the bypass street; 'arterial' = fewer bypass blocks and at least N on the arterial; 'other' = neither (another street, the freeway or a short use); blocks are counted on the corridor's study-area links. No observed counterpart exists for these shares. The related observed values are in the select-link table above: northbound Hillegass Ave traffic rarely ends on College Ave (6%), 21 to 33% jogs to Benvenue Ave, and southbound freeway-bound drivers on College Ave commonly arrive via Ashby Ave and Benvenue Ave and jog to Hillegass Ave.

| Bypass | Arterial | N | Direction | Corridor trips | Bypass | Arterial | Other | Mean bypass blocks |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue | College Avenue | 3 | N | 890 | 3% | 12% | 85% | 0.1 |
| Hillegass Avenue | College Avenue | 3 | S | 1174 | 2% | 21% | 76% | 0.1 |

## Per-mode results

Offered: 21948 car veh/h; 497 bicycle flows (702/h); 2000 pedestrian flows (1340/h). Bicycle and pedestrian volumes are assumptions, not counts.

| Mode | In network | Completed | Mean time (s) | Other |
| --- | --- | --- | --- | --- |
| Car | 2915 | 21744 | 401 | |
| Bicycle | 47 | 704 | 255 | |
| Pedestrian | 166 | 1235 | 460 | mean crossing delay 7.7 s |

Vulnerable road users (surrogate indicators): pedestrian conflicts 257, bicycle conflicts 386, close passes 641, pedestrian injury-risk index 0.053, bicycle injury-risk index 0.073 (proxy), mean vehicle speed at pedestrian encounters 2.68 m/s.


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
| SR-24 off-ramp traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | OBSERVED turn count x ASSUMPTION share (131 left turns x 0.40) | 52 (38 to 62) | 30 | below |
| Telegraph Ave and south-side traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | ASSUMPTION: the through left-turners (131 x 0.62 = 81) that are not off-ramp traffic | 29 (19 to 43) | 40 | within |
| SR-24 off-ramp traffic using Colby St to reach College Ave and Berkeley (right at Alcatraz Ave) | OBSERVED turn count x ASSUMPTION share (32 right turns x 0.40) | 13 (9 to 15) | 2 | below |
| Telegraph Ave and south-side traffic using Colby St to reach College Ave and Berkeley | ASSUMPTION: the through right-turners (32 x 0.62 = 20) that are not off-ramp traffic | 7 (5 to 11) | 3 | below |
| Intents listed, together | | 101 (71 to 131) | 75 | |
| Other through cars (no intent listed) | | | 0 | |

Model through cars by origin and destination group (largest 12 of 12 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 30.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Emeryville and West Oakland streets (55th to 67th Streets) | 11.0 | Claremont Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) | 10.0 | Claremont Avenue |
| Telegraph Ave to the south (downtown Oakland) | Telegraph Ave from the north (Berkeley) | 6.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 5.0 | College Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | San Pablo Ave (Emeryville and West Oakland) | 3.0 | Claremont Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Telegraph Ave from the north (Berkeley) | 3.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Ashby Ave from the west (Emeryville and I-80) | 2.0 | none near the study area |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 2.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 1.0 | Telegraph Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Claremont Ave and Tunnel Rd toward the hills | 1.0 | Claremont Avenue |
| Telegraph Ave to the south (downtown Oakland) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 1.0 | Telegraph Avenue |

By the arterial these cars would otherwise use: Telegraph Avenue 43 veh/h; Claremont Avenue 25 veh/h; College Avenue 5 veh/h; none near the study area 2 veh/h.

### Hillegass Avenue NB

Observed (PM): 94 cars entered at the south end, 48 drove the whole street, 109 left it at Alcatraz Ave (43 west, 54 east, 12 straight), and 47% of the block's trips came from a freeway. ASSUMPTION: freeway-origin through cars are 40 veh/h (52 freeway-origin trips times 94 / (94 + 29)), spread over the exits in proportion (0.37); the through share of exits is 48 / 109 = 0.44.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Hillegass Ave to reach Alcatraz Ave west and Telegraph Ave north | OBSERVED turn count x ASSUMPTION share (43 left turns x 0.37) | 16 (9 to 20) | 13 | within |
| SR-24 off-ramp traffic using Hillegass Ave to reach College Ave and Berkeley | OBSERVED turn count x ASSUMPTION share (54 right turns x 0.37) | 20 (11 to 25) | 22 | within |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach Alcatraz Ave west | ASSUMPTION: through exits (43 x 0.44) that are not off-ramp traffic | 3 (0 to 10) | 5 | within |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach College Ave and Berkeley | ASSUMPTION: through exits (54 x 0.44) that are not off-ramp traffic | 4 (0 to 13) | 4 | within |
| Intents listed, together | | 43 (20 to 68) | 44 | |
| Other through cars (no intent listed) | | | 2 | |

Model through cars by origin and destination group (largest 12 of 14 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 10.0 | SR-24 |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 8.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 7.0 | SR-24 then Claremont Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | College Ave from the north (Berkeley) | 5.0 | SR-24 then Claremont Avenue then College Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) | 3.0 | none near the study area |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Emeryville and West Oakland streets (55th to 67th Streets) | 2.0 | College Avenue then Alcatraz Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Claremont Ave and Tunnel Rd toward the hills | 2.0 | Claremont Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Ashby Ave from the west (Emeryville and I-80) | 2.0 | SR-24 then Telegraph Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Shattuck Ave from the north (Berkeley) | 2.0 | SR-24 then Telegraph Avenue then Alcatraz Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Emeryville and West Oakland streets (55th to 67th Streets) | 1.0 | College Avenue then Alcatraz Avenue |
| Claremont Ave and Tunnel Rd toward the hills | Emeryville and West Oakland streets (55th to 67th Streets) | 1.0 | Claremont Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 1.0 | Telegraph Avenue |
| other pairs | | 2.0 | |

By the arterial these cars would otherwise use: SR-24 10 veh/h; Telegraph Avenue 9 veh/h; SR-24 then Claremont Avenue 7 veh/h; SR-24 then Claremont Avenue then College Avenue 5 veh/h; Claremont Avenue 4 veh/h; none near the study area 4 veh/h.

### Hillegass Avenue SB

Observed (PM): 178 cars entered at the top (76 turned in from Alcatraz Ave west, 98 from the east, 4 came straight from the north), 79 drove the whole street, and 68% of the block's trips (109 veh/h) went to a freeway. ASSUMPTION: freeway-bound cars that did not join mid-street are 87 veh/h (109 x 178 / (178 + 44)), half of the 174 turn-ins; low = the whole-street share of the turn-ins (0.45), high = the freeway-bound share without the mid-street correction (0.63).

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Telegraph Ave, Alcatraz Ave west and West Berkeley traffic turning off Alcatraz Ave onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (76 turn-ins x 0.50) | 38 (34 to 48) | 8 | below |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (98 turn-ins x 0.50) | 49 (44 to 62) | 25 | below |
| Intents listed, together | | 87 (78 to 110) | 33 | |
| Other through cars (no intent listed) | | | 20 | |

Model through cars by origin and destination group (largest 12 of 13 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 12.0 | Claremont Avenue then SR-24 |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 11.0 | College Avenue then Claremont Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 9.0 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 8.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Telegraph Ave to the south (downtown Oakland) | 3.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 2.0 | Telegraph Avenue then Alcatraz Avenue then Claremont Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | West Oakland to the southwest (Adeline St, Market St) | 2.0 | Alcatraz Avenue then Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Claremont Ave and Tunnel Rd toward the hills | 1.0 | Alcatraz Avenue then Claremont Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-13 Warren Freeway (via SR-24 east) | 1.0 | Alcatraz Avenue then College Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 1.0 | Claremont Avenue then SR-24 |
| West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 1.0 | Alcatraz Avenue then College Avenue |
| College Ave from the north (Berkeley) | Telegraph Ave to the south (downtown Oakland) | 1.0 | Telegraph Avenue |
| other pairs | | 1.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 21 veh/h; Claremont Avenue then SR-24 13 veh/h; College Avenue then Claremont Avenue then SR-24 11 veh/h; Alcatraz Avenue then College Avenue 2 veh/h; Alcatraz Avenue then Telegraph Avenue 2 veh/h; Telegraph Avenue then Alcatraz Avenue then Claremont Avenue 2 veh/h.

### Colby Street SB

Observed (PM): 139 cars entered at the top (76 from Alcatraz Ave west, 50 from the east, 13 from the north), 39 drove the whole street, 45% of the block's trips (72 veh/h) went to a freeway and 22% came by way of Telegraph Ave. ASSUMPTION: freeway-bound cars that did not join mid-street are 46 veh/h (72 x 139 / (139 + 79)), 0.365 of the 126 turn-ins; low = the whole-street share (0.31), high = the unadjusted freeway share (0.57). The Telegraph Ave cars are the 22% x 160 = 35 of the 76 west turn-ins.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Southbound Telegraph Ave traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (35 Telegraph Ave cars x 0.365) | 13 (11 to 20) | 23 | above |
| Alcatraz Ave west, Ashby Ave and West Berkeley traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (41 other west turn-ins x 0.365) | 15 (13 to 23) | 13 | within |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (50 east turn-ins x 0.365) | 18 (15 to 29) | 13 | below |
| Intents listed, together | | 46 (39 to 72) | 49 | |
| Other through cars (no intent listed) | | | 34 | |

Model through cars by origin and destination group (largest 12 of 19 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 21.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 12.0 | Alcatraz Avenue then College Avenue then Claremont Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 10.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Telegraph Ave to the south (downtown Oakland) | 6.0 | Telegraph Avenue |
| Ashby Ave from the west (Emeryville and I-80) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 5.0 | SR-24 |
| Shattuck Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 5.0 | none near the study area |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 4.0 | Telegraph Avenue then Alcatraz Avenue then Claremont Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | West Oakland to the southwest (Adeline St, Market St) | 3.0 | Alcatraz Avenue then Telegraph Avenue |
| Ashby Ave from the west (Emeryville and I-80) | SR-13 Warren Freeway (via SR-24 east) | 2.0 | SR-24 |
| College Ave from the north (Berkeley) | Telegraph Ave to the south (downtown Oakland) | 2.0 | Telegraph Avenue |
| Berkeley hills to the northeast (Evergreen Ln, Gravatt Dr) | West Oakland to the southwest (Adeline St, Market St) | 2.0 | Claremont Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 2.0 | none near the study area |
| other pairs | | 9.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 39 veh/h; Alcatraz Avenue then College Avenue then Claremont Avenue 14 veh/h; SR-24 8 veh/h; none near the study area 7 veh/h; Telegraph Avenue then Alcatraz Avenue then Claremont Avenue 4 veh/h; Alcatraz Avenue then College Avenue 3 veh/h.

### Study area, all residential and service streets

Model: 420 through cars per hour.

Model through cars by origin and destination group (largest 12 of 53 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 40.0 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 35.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) | 34.0 | Claremont Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Emeryville and West Oakland streets (55th to 67th Streets) | 29.0 | Claremont Avenue |
| Telegraph Ave to the south (downtown Oakland) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 27.0 | Telegraph Avenue then Claremont Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 21.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave to the south (downtown Oakland) | 20.0 | Claremont Avenue then Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 19.0 | Telegraph Avenue |
| Telegraph Ave to the south (downtown Oakland) | SR-24 westbound on-ramps (toward Oakland and I-980) | 17.0 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 12.0 | Claremont Avenue then SR-24 |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 12.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 11.0 | Telegraph Avenue then Alcatraz Avenue then Claremont Avenue |
| other pairs | | 143.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 172 veh/h; Claremont Avenue 93 veh/h; Telegraph Avenue then Claremont Avenue 27 veh/h; Claremont Avenue then Telegraph Avenue 20 veh/h; SR-24 18 veh/h; Claremont Avenue then SR-24 12 veh/h.

By origin group: South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 118; Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 71; SR-24 eastbound off-ramps (arriving from Oakland and I-980) 67; Telegraph Ave to the south (downtown Oakland) 53; Telegraph Ave from the north (Berkeley) 37; Claremont Ave and Tunnel Rd toward the hills 16; College Ave from the north (Berkeley) 15; Emeryville and West Oakland streets (55th to 67th Streets) 11; Ashby Ave from the west (Emeryville and I-80) 7; West Oakland to the southwest (Adeline St, Market St) 7.

By destination group: SR-24 westbound on-ramps (toward Oakland and I-980) 99; Telegraph Ave from the north (Berkeley) 59; South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 57; West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) 35; Emeryville and West Oakland streets (55th to 67th Streets) 32; Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 31; Telegraph Ave to the south (downtown Oakland) 31; Claremont Ave and Tunnel Rd toward the hills 16; Ashby Ave from the west (Emeryville and I-80) 14; San Pablo Ave (Emeryville and West Oakland) 9.


## Through cars by intent (cut-through intent view)

A through car is tallied once, under the first intent whose origin and destination groups hold its trip ends, at the moment the through count counts it. Cars an hour over the run, the same window as the through-car figure (422 an hour).

| Intent | Basis | Cars an hour | Share |
| --- | --- | --- | --- |
| Berkeley and College Ave traffic using Hillegass Ave, Colby St and nearby side streets to reach the SR-24 on-ramps | observed | 36 | 9% |
| Southbound Telegraph Ave and west-side traffic turning off Alcatraz Ave onto Colby St or Hillegass Ave to reach the SR-24 on-ramps | observed | 45 | 11% |
| SR-24 off-ramp traffic using Colby St, Hillegass Ave and nearby side streets to reach Berkeley and Telegraph Ave north | observed | 60 | 14% |
| SR-24 off-ramp traffic using side streets to reach Alcatraz Ave west, Ashby Ave and Claremont Ave toward the hills | assumed | 13 | 3% |
| Downtown, south and west Oakland traffic using side streets to reach Berkeley and Telegraph Ave north | assumed | 59 | 14% |
| Berkeley and Telegraph Ave north traffic using side streets to reach downtown, south and west Oakland | assumed | 38 | 9% |
| Oakland cross-town traffic (West Oakland, Broadway, Piedmont, Emeryville) using side streets near Claremont Ave and Telegraph Ave | assumed | 104 | 25% |
| Claremont Ave, hills and south Oakland traffic using side streets to reach the SR-24 on-ramps | assumed | 29 | 7% |
| Other (no intent listed) |  | 38 | 9% |

Intents listed cover 91% of through cars.


## Select-link shares: modeled vs observed (design D5: headline = freeway shares, tolerance +/-10 pp)

- Hillegass Avenue NB: 4 links (path Claremont Avenue -> Alcatraz Avenue (434 m)), 165 trips (151 completed)
- Colby Street NB: 8 links (path Claremont Avenue -> Alcatraz Avenue (680 m)), 218 trips (203 completed)
- Hillegass Avenue SB: 4 links (path Alcatraz Avenue -> Claremont Avenue (433 m)), 108 trips (101 completed)
- Colby Street SB: 8 links (path Alcatraz Avenue -> Claremont Avenue (680 m)), 234 trips (215 completed)

| Block | Side | Via | Observed | Modeled | Diff (pp) | n trips | Headline |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue NB | from | freeway | 47% | 50% | +3 | 165 | within |
| Hillegass Avenue NB | to | Benvenue Avenue | 21% (PM 33%) | 8% | -13 | 165 |  |
| Hillegass Avenue NB | to | College Avenue | 6% | 12% | +6 | 165 |  |
| Hillegass Avenue NB | to | Alcatraz Avenue WB | 27% | 34% | +7 | 165 |  |
| Colby Street NB | from | freeway | 47% | 49% | +2 | 218 | within |
| Colby Street NB | to | Alcatraz Avenue WB | 48% | 49% | +1 | 218 |  |
| Colby Street NB | to | Telegraph Avenue | 25% | 31% | +6 | 218 |  |
| Colby Street NB | to | College Avenue | 3% | 4% | +1 | 218 |  |
| Hillegass Avenue SB | from | Alcatraz Avenue WB | 46% | 31% | -15 | 108 |  |
| Hillegass Avenue SB | from | Benvenue Avenue | 26% | 2% | -24 | 108 |  |
| Hillegass Avenue SB | from | College Avenue | 16% | 15% | -1 | 108 |  |
| Hillegass Avenue SB | to | freeway | 57% (PM 68%) | 62% | +5 | 108 | within |
| Colby Street SB | from | Alcatraz Avenue EB | 43% | 24% | -19 | 234 |  |
| Colby Street SB | from | Alcatraz Avenue WB | 46% | 9% | -37 | 234 |  |
| Colby Street SB | from | Telegraph Avenue | 22% | 17% | -5 | 234 |  |
| Colby Street SB | to | freeway | 45% | 51% | +6 | 234 | within |
| Colby Street SB | to | Forest Street | 34% | 13% | -21 | 234 |  |

Headline shares within tolerance: 4 of 4. Observed column uses the PM-peak share where one is given and the period is pm_peak. 'Via' shares are the fraction of select-link trips using that street before (from) or after (to) the block; freeway = origin / destination gate with a motorway-class link attached.

## Claremont ramps: streets used before the on-ramp / after the off-ramp

Observed shares are for traffic from/to the north only. 'Modeled' is over all trips on the ramps and any visit to the street (an upper bound for streets that serve both sides). 'Modeled, side' counts only trips whose surface end lies on the side of the ramp stated in the targets file (`freewayRamp.side`), and for a street with a qualifier ("north of X") only its links on that side of X.

| Direction | Via | Observed | Modeled | n ramp trips | Modeled, side | n side trips |
| --- | --- | --- | --- | --- | --- | --- |
| onto freeway | College Avenue | 16% | 15% | 648 | 16% | 599 |
| onto freeway | Hillegass Avenue | 12% | 11% | 648 | 12% | 599 |
| onto freeway | Martin Street | 10% | 14% | 648 | 14% | 599 |
| onto freeway | Colby Street | 8% | 12% | 648 | 14% | 599 |
| onto freeway | Telegraph Avenue north of Alcatraz Avenue | 8% | 9% | 648 | 8% | 599 |
| onto freeway | Benvenue Avenue | 5% | 3% | 648 | 3% | 599 |
| from freeway | College Avenue | 10% | 11% | 682 | 11% | 654 |
| from freeway | Martin Street | 10% | 8% | 682 | 9% | 654 |
| from freeway | Colby Street | 8% | 12% | 682 | 13% | 654 |
| from freeway | Hillegass Avenue | 5% | 6% | 682 | 6% | 654 |
| from freeway | Benvenue Avenue | 3% | 3% | 682 | 3% | 654 |

## Top 15 links by delay

| Link | Street | Class | Lanes | Len (m) | End node control | Delay (veh-h) | Stopped (veh-h) | Mean stopped veh | Flow (veh/h) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 4143 | Adeline Street | Secondary | 3 | 185 | signal | 22.41 | 15.33 | 15.3 | 850 |
| 1025 | Martin Luther King Junior Way | Secondary | 3 | 79 | signal | 9.17 | 7.64 | 7.6 | 818 |
| 1122 | Alcatraz Avenue | Tertiary | 1 | 299 | signal | 6.87 | 5.01 | 5.0 | 230 |
| 1051 | Adeline Street | Secondary | 4 | 50 | signal | 5.81 | 4.73 | 4.7 | 1105 |
| 769 | Martin Luther King Junior Way | Secondary | 3 | 112 | signal | 5.54 | 3.37 | 3.4 | 1391 |
| 1662 | 52nd Street | Secondary | 4 | 53 | signal | 5.23 | 3.87 | 3.9 | 1016 |
| 115 | San Pablo Avenue | Primary | 3 | 54 | signal | 5.10 | 4.04 | 4.0 | 822 |
| 1666 | 52nd Street | Secondary | 4 | 39 | signal | 4.71 | 4.10 | 4.1 | 917 |
| 108 | Stanford Avenue | Secondary | 3 | 61 | signal | 4.60 | 2.77 | 2.8 | 1454 |
| 1049 | Adeline Street | Secondary | 4 | 43 | signal | 4.46 | 3.51 | 3.5 | 881 |
| 2005 | Shattuck Avenue | Tertiary | 1 | 92 | signal | 4.36 | 3.16 | 3.2 | 475 |
| 4192 | Ashby Avenue | Primary | 2 | 99 | signal | 4.16 | 3.27 | 3.3 | 281 |
| 2248 | Telegraph Avenue | Secondary | 2 | 104 | signal | 4.08 | 2.14 | 2.1 | 1610 |
| 1111 | Market Street | Tertiary | 3 | 31 | signal | 4.05 | 3.46 | 3.5 | 880 |
| 2303 | Telegraph Avenue | Secondary | 2 | 104 | signal | 4.01 | 2.52 | 2.5 | 1272 |

## Top 15 nodes by blocked time

Blocked time = lane-head seconds waiting at the stop line without permission (signal red, conflict, stop sign or no downstream space).

| Node | Streets | Control | Gate | Blocked (lane-h) | of which no downstream space | Signal plan at end (cycle: greens) |
| --- | --- | --- | --- | --- | --- | --- |
| 446 | Market Street / Stanford Avenue | signal |  | 5.30 | 0.07 | 85 s: 56/19 |
| 680 | 52nd Street / Shattuck Avenue | signal |  | 5.17 | 0.09 | 90 s: 18/19/37 |
| 447 | Adeline Street / Alcatraz Avenue | signal |  | 4.39 | 0.13 | 75 s: 27/38 |
| 479 | Adeline Street / Martin Luther King Junior Way / Stanford Avenue | signal |  | 3.46 | 0.01 | 75 s: 24/41 |
| 30 | 57th Street / Adeline Street / Market Street | signal |  | 3.35 | 0.01 | 75 s: 15/30/15 |
| 185 | Alcatraz Avenue / Sacramento Street | signal |  | 3.22 | 0.04 | 75 s: 31/34 |
| 37 | San Pablo Avenue / Stanford Avenue | signal |  | 3.13 | 0.00 | 75 s: 27/38 |
| 944 | Ashby Avenue / Shattuck Avenue | signal |  | 2.85 | 0.00 | 75 s: 43/22 |
| 1406 | Ashby Avenue / Claremont Avenue | signal |  | 2.77 | 0.07 | 75 s: 50/15 |
| 851 | Alcatraz Avenue / Telegraph Avenue | signal |  | 2.70 | 0.04 | 75 s: 41/24 |
| 947 | Ashby Avenue / Telegraph Avenue | signal |  | 2.66 | 0.00 | 75 s: 20/45 |
| 501 | Alcatraz Avenue / Shattuck Avenue | signal |  | 2.52 | 0.05 | 75 s: 32/33 |
| 237 | Ashby Avenue / Sacramento Street | signal |  | 2.33 | 0.00 | 75 s: 47/18 |
| 242 | Ashby Avenue / Martin Luther King Junior Way | signal |  | 2.28 | 0.00 | 75 s: 34/31 |
| 1080 | 62nd Street / Claremont Avenue / College Avenue | signal |  | 2.27 | 0.00 | 75 s: 17/28/15 |

Phases of the five most blocked signals (green s: approach links with their lanes, link ids in brackets):

- node 446: 56 s: Stanford Avenue 1L [941], Stanford Avenue 3L [1055]; 19 s: Market Street 4L [1108], Market Street 3L [1111]
- node 680: 18 s: 52nd Street 4L [1662]; 19 s: 52nd Street 4L [1666], 52nd Street 4L [1662]; 37 s: Shattuck Avenue 2L [1653], Shattuck Avenue 2L [1705]
- node 447: 27 s: Adeline Street 4L [1049], Adeline Street 4L [1051]; 38 s: Alcatraz Avenue 2L [1048], Alcatraz Avenue 2L [1133]
- node 479: 24 s: Martin Luther King Junior Way 3L [1025], Adeline Street 3L [4143]; 41 s: Stanford Avenue 1L [4139]
- node 30: 15 s: Adeline Street 1L [747], Adeline Street 1L [1030]; 30 s: Market Street 2L [755], Market Street 2L [1113]; 15 s: 57th Street 1L [44], 57th Street 1L [1151]

## Entry backlog by origin node at end of run (top 10)

| Node | Streets | Trips waiting | Offered veh/h (before scale) |
| --- | --- | --- | --- |
| 442 | 63rd Street / Martin Luther King Junior Way | 1 | 3 |

## Flow on key streets (veh/h per direction, study-area links of 40 m or more)

| Street | Direction of travel | Links | Median flow | Max flow |
| --- | --- | --- | --- | --- |
| Telegraph | N | 12 | 709 | 750 |
| Telegraph | S | 10 | 718 | 732 |
| College | N | 3 | 192 | 192 |
| College | S | 3 | 368 | 370 |
| Claremont | N | 6 | 389 | 673 |
| Claremont | S | 7 | 415 | 732 |
| Alcatraz | E | 6 | 263 | 311 |
| Alcatraz | W | 6 | 401 | 515 |
| Hillegass | N | 4 | 90 | 110 |
| Hillegass | S | 4 | 65 | 66 |
| Colby | N | 7 | 104 | 131 |
| Colby | S | 7 | 112 | 127 |
| Martin | E | 2 | 96 | 96 |
| Martin | W | 2 | 103 | 103 |

## Largest demand origins (offered, before scale)

| Node | Streets | Veh/h |
| --- | --- | --- |
| 602 | Grove Shafter Freeway | 3717 |
| 943 | Telegraph Avenue / Ward Street | 1772 |
| 265 | Ashby Avenue | 1242 |
| 1672 | Warren Freeway | 1140 |
| 183 | San Pablo Avenue | 1005 |
| 763 | Telegraph Avenue | 501 |
| 275 | Market Street | 475 |
| 184 | Alcatraz Avenue | 401 |
| 1756 | Claremont Avenue | 352 |
| 971 | Pleasant Valley Avenue | 336 |
