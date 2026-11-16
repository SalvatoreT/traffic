# Calibration report: rockridge midday scale 1 seed 1 (60 min)

Offered demand 16569 veh/h x scale 1 = 16569 veh/h. Run took 18.4 s wall clock. Flow tables use the window after a 10 min warm-up; select-link and health figures cover the whole run from an empty network.

## Stability (design D4)

| Criterion | Threshold | Value | Result |
| --- | --- | --- | --- |
| Gridlock removals | 0 | 0 | pass |
| Backlog / spawned | < 2% | 0.0% (3 of 16726) | pass |
| Arterial mean speed (run) | > 4 m/s | 10.10 m/s (last 15 min 9.99) | pass |

Overall: **STABLE**. Mean trip delay 92 s, mean trip time 341 s, completed 16997, unroutable 0.

| t (min) | vehicles in network | backlog | completed | removals | arterial speed in interval (m/s) |
| --- | --- | --- | --- | --- | --- |
| 5 | 1739 | 2 | 1539 | 0 | 10.32 |
| 10 | 1612 | 0 | 3042 | 0 | 9.96 |
| 15 | 1599 | 1 | 4436 | 0 | 9.88 |
| 20 | 1620 | 0 | 5818 | 0 | 10.21 |
| 25 | 1526 | 2 | 7237 | 0 | 10.42 |
| 30 | 1611 | 0 | 8579 | 0 | 10.14 |
| 35 | 1610 | 1 | 9970 | 0 | 10.24 |
| 40 | 1617 | 3 | 11345 | 0 | 9.99 |
| 45 | 1653 | 3 | 12759 | 0 | 10.12 |
| 50 | 1692 | 3 | 14143 | 0 | 9.70 |
| 55 | 1615 | 1 | 15589 | 0 | 10.05 |
| 60 | 1552 | 3 | 16997 | 0 | 10.23 |
## Wandering (completed car trips)

Detour ratio = distance driven (link and movement lengths) over the shortest network distance from the trip's origin to its destination. Detour against the free-flow route uses the time-shortest route with no congestion and no noise, which is what a purposeful driver without live information would follow (it differs from the shortest distance when a faster, longer road exists). A switch is a change of the remaining route while en route. Loops: the same link twice or the same node three or more times. Reversals: a link followed by its reverse within 200 m. 'Study-area vehicle-miles' are miles driven on links inside the study area; the last column is the share of them driven by trips with a detour ratio above 1.3. Guided drivers re-evaluate their route every epoch; the others keep their departure route unless it is blocked.

| Trips | n | Switches per trip | With a switch | Mean detour | Median detour | Detour > 1.3 | Detour > 2 | Mean detour vs free-flow route | Vs free-flow route > 1.3 | Loops | Reversals | Study veh-miles | Of them by detour > 1.3 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| all trips | 15719 | 0.00 | 0.2% | 1.077 | 1.044 | 2.9% | 0.0% | 1.019 | 0.9% | 0.0% | 0.1% | 1477 | 5.1% |
| gate to gate | 5578 | 0.00 | 0.3% | 1.078 | 1.046 | 1.8% | 0.0% | 1.014 | 0.6% | 0.0% | 0.1% | 352 | 4.9% |
| with a local end | 10141 | 0.00 | 0.1% | 1.077 | 1.043 | 3.5% | 0.0% | 1.021 | 1.1% | 0.0% | 0.1% | 1124 | 5.2% |
| guided drivers | 7234 | 0.00 | 0.3% | 1.077 | 1.044 | 2.6% | 0.0% | 1.019 | 0.9% | 0.0% | 0.2% | 666 | 4.5% |
| other drivers | 8485 | 0.00 | 0.0% | 1.078 | 1.044 | 3.1% | 0.0% | 1.019 | 1.0% | 0.0% | 0.1% | 811 | 5.7% |

## Reported patterns (diagnostics; configured in the targets file under `patterns`)

(a) Trips between the surface gates on the north side of the ramps and the freeway mainline gates, and the local-street (residential and service links in the study area) vehicle-miles they drive. Share = of all completed trips' local-street vehicle-miles (258 miles). No observed counterpart exists for this quantity (the targets file has only the select-link shares above).

| Trips | n trips | Local-street veh-miles | Share of all local-street veh-miles |
| --- | --- | --- | --- |
| surface gates to the freeway | 700 | 22.8 | 9% |
| freeway to the surface gates | 829 | 21.5 | 8% |

(b) Corridor trips: completed trips from beyond one end of the corridor's study-area extent (the bypass street and its arterial together) to beyond the other end, within a lateral limit of the corridor, by direction. 'Bypass' = at least N blocks (links) on the bypass street; 'arterial' = fewer bypass blocks and at least N on the arterial; 'other' = neither (another street, the freeway or a short use); blocks are counted on the corridor's study-area links. No observed counterpart exists for these shares. The related observed values are in the select-link table above: northbound Hillegass Ave traffic rarely ends on College Ave (6%), 21 to 33% jogs to Benvenue Ave, and southbound freeway-bound drivers on College Ave commonly arrive via Ashby Ave and Benvenue Ave and jog to Hillegass Ave.

| Bypass | Arterial | N | Direction | Corridor trips | Bypass | Arterial | Other | Mean bypass blocks |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue | College Avenue | 3 | N | 909 | 3% | 19% | 78% | 0.1 |
| Hillegass Avenue | College Avenue | 3 | S | 925 | 4% | 17% | 79% | 0.2 |

## Per-mode results

Offered: 16569 car veh/h; 105 bicycle flows (386/h); 2000 pedestrian flows (1582/h). Bicycle and pedestrian volumes are assumptions, not counts.

| Mode | In network | Completed | Mean time (s) | Other |
| --- | --- | --- | --- | --- |
| Car | 1552 | 16997 | 341 | |
| Bicycle | 14 | 388 | 168 | |
| Pedestrian | 213 | 1468 | 452 | mean crossing delay 6.8 s |

Vulnerable road users (surrogate indicators): pedestrian conflicts 230, bicycle conflicts 298, close passes 177, pedestrian injury severity mean 0.050 (AIS4+, 7512 supported of 7512 encounters), cyclist injury severity mean 0.069 (MAIS3+F, 964 supported of 1706 encounters) (separate endpoints, never summed), mean vehicle speed at pedestrian encounters 2.56 m/s.


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
| SR-24 off-ramp traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | OBSERVED turn count x ASSUMPTION share (131 left turns x 0.40) | 52 (38 to 62) | 43 | within |
| Telegraph Ave and south-side traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | ASSUMPTION: the through left-turners (131 x 0.62 = 81) that are not off-ramp traffic | 29 (19 to 43) | 18 | below |
| SR-24 off-ramp traffic using Colby St to reach College Ave and Berkeley (right at Alcatraz Ave) | OBSERVED turn count x ASSUMPTION share (32 right turns x 0.40) | 13 (9 to 15) | 7 | below |
| Telegraph Ave and south-side traffic using Colby St to reach College Ave and Berkeley | ASSUMPTION: the through right-turners (32 x 0.62 = 20) that are not off-ramp traffic | 7 (5 to 11) | 6 | within |
| Intents listed, together | | 101 (71 to 131) | 74 | |
| Other through cars (no intent listed) | | | 5 | |

Model through cars by origin and destination group (largest 12 of 15 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 43.0 | Telegraph Avenue |
| Telegraph Ave to the south (downtown Oakland) | Telegraph Ave from the north (Berkeley) | 7.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Ashby Ave from the west (Emeryville and I-80) | 5.0 | none near the study area |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 5.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 5.0 | SR-24 then Claremont Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Telegraph Ave from the north (Berkeley) | 3.0 | Telegraph Avenue |
| San Pablo Ave (Emeryville and West Oakland) | College Ave from the north (Berkeley) | 2.0 | Claremont Avenue then College Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Alcatraz Ave from the west (Emeryville side) | 2.0 | College Avenue then Alcatraz Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Claremont Ave and Tunnel Rd toward the hills | 1.0 | Telegraph Avenue then Alcatraz Avenue then Claremont Avenue |
| College Ave from the north (Berkeley) | Alcatraz Ave from the west (Emeryville side) | 1.0 | College Avenue then Alcatraz Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 1.0 | Telegraph Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 1.0 | Telegraph Avenue |
| other pairs | | 3.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 60 veh/h; SR-24 then Claremont Avenue 5 veh/h; none near the study area 5 veh/h; College Avenue then Alcatraz Avenue 3 veh/h; Claremont Avenue then College Avenue 2 veh/h; Claremont Avenue 1 veh/h.

### Hillegass Avenue NB

Observed (PM): 94 cars entered at the south end, 48 drove the whole street, 109 left it at Alcatraz Ave (43 west, 54 east, 12 straight), and 47% of the block's trips came from a freeway. ASSUMPTION: freeway-origin through cars are 40 veh/h (52 freeway-origin trips times 94 / (94 + 29)), spread over the exits in proportion (0.37); the through share of exits is 48 / 109 = 0.44.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Hillegass Ave to reach Alcatraz Ave west and Telegraph Ave north | OBSERVED turn count x ASSUMPTION share (43 left turns x 0.37) | 16 (9 to 20) | 18 | within |
| SR-24 off-ramp traffic using Hillegass Ave to reach College Ave and Berkeley | OBSERVED turn count x ASSUMPTION share (54 right turns x 0.37) | 20 (11 to 25) | 18 | within |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach Alcatraz Ave west | ASSUMPTION: through exits (43 x 0.44) that are not off-ramp traffic | 3 (0 to 10) | 6 | within |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach College Ave and Berkeley | ASSUMPTION: through exits (54 x 0.44) that are not off-ramp traffic | 4 (0 to 13) | 6 | within |
| Intents listed, together | | 43 (20 to 68) | 48 | |
| Other through cars (no intent listed) | | | 6 | |

Model through cars by origin and destination group (largest 12 of 22 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 14.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 9.0 | SR-24 |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | College Ave from the north (Berkeley) | 6.0 | SR-24 then Claremont Avenue then College Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Emeryville and West Oakland streets (55th to 67th Streets) | 2.0 | College Avenue then Alcatraz Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 2.0 | College Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Emeryville and West Oakland streets (55th to 67th Streets) | 2.0 | Claremont Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Ashby Ave from the west (Emeryville and I-80) | 2.0 | SR-24 then Telegraph Avenue |
| Telegraph Ave to the south (downtown Oakland) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 2.0 | Telegraph Avenue |
| Telegraph Ave to the south (downtown Oakland) | Claremont Ave and Tunnel Rd toward the hills | 2.0 | Claremont Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Claremont Ave and Tunnel Rd toward the hills | 1.0 | Telegraph Avenue then Alcatraz Avenue then Claremont Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | San Pablo Ave (Emeryville and West Oakland) | 1.0 | College Avenue then Alcatraz Avenue |
| College Ave from the north (Berkeley) | Alcatraz Ave from the west (Emeryville side) | 1.0 | College Avenue then Alcatraz Avenue |
| other pairs | | 10.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 19 veh/h; SR-24 11 veh/h; SR-24 then Claremont Avenue then College Avenue 6 veh/h; College Avenue then Alcatraz Avenue 5 veh/h; Claremont Avenue 4 veh/h; College Avenue 2 veh/h.

### Hillegass Avenue SB

Observed (PM): 178 cars entered at the top (76 turned in from Alcatraz Ave west, 98 from the east, 4 came straight from the north), 79 drove the whole street, and 68% of the block's trips (109 veh/h) went to a freeway. ASSUMPTION: freeway-bound cars that did not join mid-street are 87 veh/h (109 x 178 / (178 + 44)), half of the 174 turn-ins; low = the whole-street share of the turn-ins (0.45), high = the freeway-bound share without the mid-street correction (0.63).

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Telegraph Ave, Alcatraz Ave west and West Berkeley traffic turning off Alcatraz Ave onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (76 turn-ins x 0.50) | 38 (34 to 48) | 23 | below |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (98 turn-ins x 0.50) | 49 (44 to 62) | 28 | below |
| Intents listed, together | | 87 (78 to 110) | 51 | |
| Other through cars (no intent listed) | | | 11 | |

Model through cars by origin and destination group (largest 12 of 12 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 22.0 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 15.0 | Claremont Avenue then SR-24 |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 7.0 | College Avenue then Claremont Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 6.0 | Claremont Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 3.0 | Telegraph Avenue |
| West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 2.0 | Claremont Avenue |
| West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) | College Ave from the north (Berkeley) | 2.0 | College Avenue |
| Ashby Ave from the west (Emeryville and I-80) | SR-13 Warren Freeway (via SR-24 east) | 1.0 | SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Berkeley hills to the northeast (Evergreen Ln, Gravatt Dr) | 1.0 | Alcatraz Avenue then Claremont Avenue |
| Shattuck Ave from the north (Berkeley) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 1.0 | College Avenue |
| Emeryville and West Oakland streets (55th to 67th Streets) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 1.0 | Alcatraz Avenue then Claremont Avenue |
| Emeryville and West Oakland streets (55th to 67th Streets) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 1.0 | Claremont Avenue |

By the arterial these cars would otherwise use: Telegraph Avenue 25 veh/h; Claremont Avenue then SR-24 21 veh/h; College Avenue then Claremont Avenue then SR-24 7 veh/h; Claremont Avenue 3 veh/h; College Avenue 3 veh/h; Alcatraz Avenue then Claremont Avenue 2 veh/h.

### Colby Street SB

Observed (PM): 139 cars entered at the top (76 from Alcatraz Ave west, 50 from the east, 13 from the north), 39 drove the whole street, 45% of the block's trips (72 veh/h) went to a freeway and 22% came by way of Telegraph Ave. ASSUMPTION: freeway-bound cars that did not join mid-street are 46 veh/h (72 x 139 / (139 + 79)), 0.365 of the 126 turn-ins; low = the whole-street share (0.31), high = the unadjusted freeway share (0.57). The Telegraph Ave cars are the 22% x 160 = 35 of the 76 west turn-ins.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Southbound Telegraph Ave traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (35 Telegraph Ave cars x 0.365) | 13 (11 to 20) | 7 | below |
| Alcatraz Ave west, Ashby Ave and West Berkeley traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (41 other west turn-ins x 0.365) | 15 (13 to 23) | 9 | below |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (50 east turn-ins x 0.365) | 18 (15 to 29) | 21 | within |
| Intents listed, together | | 46 (39 to 72) | 37 | |
| Other through cars (no intent listed) | | | 21 | |

Model through cars by origin and destination group (largest 12 of 18 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 10.0 | Claremont Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 7.0 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 7.0 | Telegraph Avenue |
| Emeryville and West Oakland streets (55th to 67th Streets) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 5.0 | Claremont Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 4.0 | Telegraph Avenue |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 4.0 | College Avenue then Claremont Avenue then SR-24 |
| Shattuck Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 4.0 | none near the study area |
| Emeryville and West Oakland streets (55th to 67th Streets) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 4.0 | Alcatraz Avenue then Claremont Avenue |
| Ashby Ave from the west (Emeryville and I-80) | SR-13 Warren Freeway (via SR-24 east) | 2.0 | SR-24 |
| Ashby Ave from the west (Emeryville and I-80) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 2.0 | SR-24 |
| San Pablo Ave (Emeryville and West Oakland) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 2.0 | Claremont Avenue |
| Alcatraz Ave from the west (Emeryville side) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 1.0 | SR-24 |
| other pairs | | 6.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 18 veh/h; Claremont Avenue then SR-24 10 veh/h; Claremont Avenue 8 veh/h; Alcatraz Avenue then Claremont Avenue 5 veh/h; SR-24 5 veh/h; College Avenue then Claremont Avenue then SR-24 4 veh/h.

### Study area, all residential and service streets

Model: 349 through cars per hour.

Model through cars by origin and destination group (largest 12 of 54 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 51.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 31.0 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 26.0 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 20.0 | Claremont Avenue then SR-24 |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 20.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 17.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 16.0 | Telegraph Avenue |
| San Pablo Ave (Emeryville and West Oakland) | Claremont Ave and Tunnel Rd toward the hills | 14.0 | Alcatraz Avenue then Claremont Avenue |
| Emeryville and West Oakland streets (55th to 67th Streets) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 14.0 | Claremont Avenue |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 10.0 | College Avenue then Claremont Avenue then SR-24 |
| West Oakland to the southwest (Adeline St, Market St) | Claremont Ave and Tunnel Rd toward the hills | 9.0 | Alcatraz Avenue then Claremont Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 9.0 | SR-24 |
| other pairs | | 112.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 187 veh/h; Alcatraz Avenue then Claremont Avenue 32 veh/h; Claremont Avenue 26 veh/h; Claremont Avenue then SR-24 20 veh/h; SR-24 16 veh/h; none near the study area 13 veh/h.

By origin group: SR-24 eastbound off-ramps (arriving from Oakland and I-980) 88; Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 61; South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 33; Telegraph Ave from the north (Berkeley) 30; San Pablo Ave (Emeryville and West Oakland) 25; Claremont Ave and Tunnel Rd toward the hills 23; Emeryville and West Oakland streets (55th to 67th Streets) 23; Telegraph Ave to the south (downtown Oakland) 17; West Oakland to the southwest (Adeline St, Market St) 16; College Ave from the north (Berkeley) 12.

By destination group: SR-24 westbound on-ramps (toward Oakland and I-980) 95; Telegraph Ave from the north (Berkeley) 68; Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 57; Claremont Ave and Tunnel Rd toward the hills 39; South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 37; College Ave from the north (Berkeley) 17; Ashby Ave from the west (Emeryville and I-80) 9; Berkeley hills to the northeast (Evergreen Ln, Gravatt Dr) 5; Alcatraz Ave from the west (Emeryville side) 4; Telegraph Ave to the south (downtown Oakland) 4.


## Through cars by intent (cut-through intent view)

A through car is tallied once, under the first intent that fits it (the on-ramp on its planned route, the off-ramp it has driven, or the origin and destination groups of its trip), at the moment the through count counts it. Cars an hour over the run, the same window as the through-car figure (354 an hour).

| Intent | Basis | Cars an hour | Share |
| --- | --- | --- | --- |
| on-2853241697 | observed | 96 | 27% |
| Other on-ramps | assumed | 6 | 2% |
| off-52990846 | observed | 88 | 25% |
| Other off-ramps | assumed | 5 | 1% |
| Downtown, south and west Oakland traffic using side streets to reach Berkeley and Telegraph Ave north | assumed | 40 | 11% |
| Berkeley and Telegraph Ave north traffic using side streets to reach downtown, south and west Oakland | assumed | 24 | 7% |
| Oakland cross-town traffic (West Oakland, Broadway, Piedmont, Emeryville) using side streets near Claremont Ave and Telegraph Ave | assumed | 24 | 7% |
| Other (no intent listed) |  | 71 | 20% |

Intents listed cover 80% of through cars.


## Select-link shares: modeled vs observed (design D5: headline = freeway shares, tolerance +/-10 pp)

- Hillegass Avenue NB: 4 links (path Claremont Avenue -> Alcatraz Avenue (434 m)), 143 trips (134 completed)
- Colby Street NB: 8 links (path Claremont Avenue -> Alcatraz Avenue (680 m)), 191 trips (174 completed)
- Hillegass Avenue SB: 4 links (path Alcatraz Avenue -> Claremont Avenue (433 m)), 110 trips (108 completed)
- Colby Street SB: 8 links (path Alcatraz Avenue -> Claremont Avenue (680 m)), 130 trips (126 completed)

| Block | Side | Via | Observed | Modeled | Diff (pp) | n trips | Headline |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue NB | from | freeway | 47% | 52% | +5 | 143 | within |
| Hillegass Avenue NB | to | Benvenue Avenue | 21% (PM 33%) | 4% | -17 | 143 |  |
| Hillegass Avenue NB | to | College Avenue | 6% | 15% | +9 | 143 |  |
| Hillegass Avenue NB | to | Alcatraz Avenue WB | 27% | 31% | +4 | 143 |  |
| Colby Street NB | from | freeway | 47% | 39% | -8 | 191 | within |
| Colby Street NB | to | Alcatraz Avenue WB | 48% | 50% | +2 | 191 |  |
| Colby Street NB | to | Telegraph Avenue | 25% | 41% | +16 | 191 |  |
| Colby Street NB | to | College Avenue | 3% | 7% | +4 | 191 |  |
| Hillegass Avenue SB | from | Alcatraz Avenue WB | 46% | 26% | -20 | 110 |  |
| Hillegass Avenue SB | from | Benvenue Avenue | 26% | 4% | -22 | 110 |  |
| Hillegass Avenue SB | from | College Avenue | 16% | 18% | +2 | 110 |  |
| Hillegass Avenue SB | to | freeway | 57% (PM 68%) | 58% | +1 | 110 | within |
| Colby Street SB | from | Alcatraz Avenue EB | 43% | 19% | -24 | 130 |  |
| Colby Street SB | from | Alcatraz Avenue WB | 46% | 21% | -25 | 130 |  |
| Colby Street SB | from | Telegraph Avenue | 22% | 16% | -6 | 130 |  |
| Colby Street SB | to | freeway | 45% | 43% | -2 | 130 | within |
| Colby Street SB | to | Forest Street | 34% | 14% | -20 | 130 |  |

Headline shares within tolerance: 4 of 4. Observed column uses the PM-peak share where one is given and the period is pm_peak. 'Via' shares are the fraction of select-link trips using that street before (from) or after (to) the block; freeway = origin / destination gate with a motorway-class link attached.

## Claremont ramps: streets used before the on-ramp / after the off-ramp

Observed shares are for traffic from/to the north only. 'Modeled' is over all trips on the ramps and any visit to the street (an upper bound for streets that serve both sides). 'Modeled, side' counts only trips whose surface end lies on the side of the ramp stated in the targets file (`freewayRamp.side`), and for a street with a qualifier ("north of X") only its links on that side of X.

| Direction | Via | Observed | Modeled | n ramp trips | Modeled, side | n side trips |
| --- | --- | --- | --- | --- | --- | --- |
| onto freeway | College Avenue | 16% | 11% | 511 | 12% | 468 |
| onto freeway | Hillegass Avenue | 12% | 12% | 511 | 13% | 468 |
| onto freeway | Martin Street | 10% | 12% | 511 | 13% | 468 |
| onto freeway | Colby Street | 8% | 10% | 511 | 11% | 468 |
| onto freeway | Telegraph Avenue north of Alcatraz Avenue | 8% | 10% | 511 | 8% | 468 |
| onto freeway | Benvenue Avenue | 5% | 3% | 511 | 4% | 468 |
| from freeway | College Avenue | 10% | 10% | 531 | 10% | 516 |
| from freeway | Martin Street | 10% | 12% | 531 | 12% | 516 |
| from freeway | Colby Street | 8% | 11% | 531 | 11% | 516 |
| from freeway | Hillegass Avenue | 5% | 8% | 531 | 9% | 516 |
| from freeway | Benvenue Avenue | 3% | 3% | 531 | 3% | 516 |

## Top 15 links by delay

| Link | Street | Class | Lanes | Len (m) | End node control | Delay (veh-h) | Stopped (veh-h) | Mean stopped veh | Flow (veh/h) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1049 | Adeline Street | Secondary | 4 | 43 | signal | 4.50 | 3.82 | 3.8 | 650 |
| 498 | Sacramento Street | Tertiary | 3 | 48 | signal | 3.62 | 2.86 | 2.9 | 592 |
| 1037 | Sacramento Street | Tertiary | 3 | 40 | signal | 3.28 | 2.41 | 2.4 | 1097 |
| 1666 | 52nd Street | Secondary | 4 | 39 | signal | 3.20 | 2.86 | 2.9 | 380 |
| 1051 | Adeline Street | Secondary | 4 | 50 | signal | 3.10 | 2.68 | 2.7 | 560 |
| 941 | Stanford Avenue | Secondary | 3 | 59 | signal | 2.87 | 2.22 | 2.2 | 594 |
| 1055 | Stanford Avenue | Secondary | 3 | 68 | signal | 2.77 | 2.32 | 2.3 | 448 |
| 2776 | Claremont Avenue | Secondary | 2 | 161 | signal | 2.75 | 2.30 | 2.3 | 334 |
| 114 | San Pablo Avenue | Primary | 3 | 46 | signal | 2.67 | 1.96 | 2.0 | 439 |
| 115 | San Pablo Avenue | Primary | 3 | 54 | signal | 2.65 | 2.19 | 2.2 | 403 |
| 1763 | 51st Street | Secondary | 4 | 58 | signal | 2.62 | 2.11 | 2.1 | 469 |
| 755 | Market Street | Tertiary | 2 | 77 | signal | 2.59 | 2.16 | 2.2 | 320 |
| 306 | Baker Street | Residential | 1 | 101 | two_way_stop | 2.54 | 1.94 | 1.9 | 198 |
| 1108 | Market Street | Secondary | 4 | 36 | signal | 2.48 | 1.90 | 1.9 | 962 |
| 834 | Martin Luther King Junior Way | Secondary | 4 | 49 | signal | 2.48 | 1.64 | 1.6 | 872 |

## Top 15 nodes by blocked time

Blocked time = lane-head seconds waiting at the stop line without permission (signal red, conflict, stop sign or no downstream space).

| Node | Streets | Control | Gate | Blocked (lane-h) | of which no downstream space | Signal plan at end (cycle: greens) |
| --- | --- | --- | --- | --- | --- | --- |
| 447 | Adeline Street / Alcatraz Avenue | signal |  | 4.34 | 0.05 | 75 s: 21/44 |
| 680 | 52nd Street / Shattuck Avenue | signal |  | 3.99 | 0.01 | 110 s: 30/28/38 |
| 446 | Market Street / Stanford Avenue | signal |  | 3.86 | 0.12 | 75 s: 25/40 |
| 30 | 57th Street / Adeline Street / Market Street | signal |  | 2.74 | 0.03 | 75 s: 20/25/15 |
| 37 | San Pablo Avenue / Stanford Avenue | signal |  | 2.66 | 0.01 | 75 s: 22/43 |
| 331 | 52nd Street / Martin Luther King Junior Way | signal |  | 2.59 | 0.01 | 75 s: 45/20 |
| 1080 | 62nd Street / Claremont Avenue / College Avenue | signal |  | 2.54 | 0.03 | 75 s: 17/28/15 |
| 185 | Alcatraz Avenue / Sacramento Street | signal |  | 2.53 | 0.04 | 75 s: 35/30 |
| 1069 | Claremont Avenue / Colby Street / Forest Street | signal |  | 2.45 | 0.00 | 147 s: 64/10/58 |
| 242 | Ashby Avenue / Martin Luther King Junior Way | signal |  | 2.37 | 0.00 | 75 s: 40/25 |
| 944 | Ashby Avenue / Shattuck Avenue | signal |  | 2.33 | 0.01 | 75 s: 40/25 |
| 947 | Ashby Avenue / Telegraph Avenue | signal |  | 2.16 | 0.00 | 75 s: 25/40 |
| 851 | Alcatraz Avenue / Telegraph Avenue | signal |  | 2.07 | 0.02 | 75 s: 43/22 |
| 1406 | Ashby Avenue / Claremont Avenue | signal |  | 2.05 | 0.03 | 75 s: 50/15 |
| 501 | Alcatraz Avenue / Shattuck Avenue | signal |  | 2.01 | 0.05 | 75 s: 30/35 |

Phases of the five most blocked signals (green s: approach links with their lanes, link ids in brackets):

- node 447: 21 s: Adeline Street 4L [1049], Adeline Street 4L [1051]; 44 s: Alcatraz Avenue 2L [1048], Alcatraz Avenue 2L [1133]
- node 680: 30 s: 52nd Street 4L [1662]; 28 s: 52nd Street 4L [1666], 52nd Street 4L [1662]; 38 s: Shattuck Avenue 2L [1653], Shattuck Avenue 2L [1705]
- node 446: 25 s: Stanford Avenue 3L [941], Stanford Avenue 3L [1055]; 40 s: Market Street 4L [1108], Market Street 3L [1111]
- node 30: 20 s: Adeline Street 1L [747], Adeline Street 1L [1030]; 25 s: Market Street 2L [755], Market Street 2L [1113]; 15 s: 57th Street 1L [44], 57th Street 1L [1151]
- node 37: 22 s: San Pablo Avenue 3L [114], San Pablo Avenue 3L [115]; 43 s: Stanford Avenue 3L [108], Stanford Avenue 2L [4109]

## Junction recovery

Policy `physical`. Node entries by cars and cyclists in the run: 523136 (settle interval 0). An admission is an entry the ordinary rule would have refused; head-seconds count the time a waiting head vehicle had the reason invoked, and the part of it in which it still could not enter. Courtesy and the yield fallback change priority only; under `physical` the conflict bypass never admits.

| Reason | Admissions per hour | Per 1,000 entries | Head-s invoked | Head-s blocked |
| --- | --- | --- | --- | --- |
| courtesy | 37.0 | 0.071 | 45 | 34 |
| yield fallback | 5.0 | 0.010 | 2 | 0 |
| conflict bypass | 0.0 | 0.000 | 0 | 0 |

Vehicles removed while held in a node by a full exit: 0 (0.0 per hour, included in the gridlock removals).

| Node | Streets | Control | Courtesy | Yield fallback | Conflict bypass | Held removals |
| --- | --- | --- | --- | --- | --- | --- |
| 1069 | Claremont Avenue / Colby Street / Forest Street | signal | 7 | 0 | 0 | 0 |
| 165 | Alcatraz Avenue / Baker Street | two_way_stop | 2 | 2 | 0 | 0 |
| 680 | 52nd Street / Shattuck Avenue | signal | 4 | 0 | 0 | 0 |
| 30 | 57th Street / Adeline Street / Market Street | signal | 3 | 0 | 0 | 0 |
| 1429 | Claremont Avenue / Claremont Boulevard | two_way_stop | 3 | 0 | 0 | 0 |
| 141 | 63rd Street / Lowell Street / Market Street | two_way_stop | 0 | 2 | 0 | 0 |
| 711 | 49th Street / Clarke Street | uncontrolled | 2 | 0 | 0 | 0 |
| 858 | 66th Street / Telegraph Avenue | signal | 2 | 0 | 0 | 0 |
| 924 | Ashby Avenue / Regent Street | two_way_stop | 2 | 0 | 0 | 0 |
| 1077 | Auburn Avenue / Claremont Avenue / Mystic Street | signal | 2 | 0 | 0 | 0 |

## Entry backlog by origin node at end of run (top 10)

| Node | Streets | Trips waiting | Offered veh/h (before scale) |
| --- | --- | --- | --- |
| 536 | Martin Luther King Junior Way / Woolsey Street | 1 | 20 |
| 1080 | 62nd Street / Claremont Avenue / College Avenue | 1 | 157 |
| 1717 | Tunnel Road | 1 | 192 |

## Flow on key streets (veh/h per direction, study-area links of 40 m or more)

| Street | Direction of travel | Links | Median flow | Max flow |
| --- | --- | --- | --- | --- |
| Telegraph | N | 12 | 582 | 625 |
| Telegraph | S | 10 | 618 | 630 |
| College | N | 3 | 259 | 262 |
| College | S | 3 | 348 | 349 |
| Claremont | N | 6 | 257 | 401 |
| Claremont | S | 7 | 180 | 443 |
| Alcatraz | E | 6 | 378 | 389 |
| Alcatraz | W | 6 | 251 | 301 |
| Hillegass | N | 4 | 77 | 80 |
| Hillegass | S | 4 | 74 | 76 |
| Colby | N | 7 | 101 | 120 |
| Colby | S | 7 | 52 | 70 |
| Martin | E | 2 | 80 | 80 |
| Martin | W | 2 | 76 | 76 |

## Largest demand origins (offered, before scale)

| Node | Streets | Veh/h |
| --- | --- | --- |
| 602 | Grove Shafter Freeway | 2580 |
| 943 | Telegraph Avenue / Ward Street | 806 |
| 265 | Ashby Avenue | 781 |
| 183 | San Pablo Avenue | 601 |
| 1672 | Warren Freeway | 553 |
| 1719 | Grove Shafter Freeway | 467 |
| 974 | Broadway | 438 |
| 763 | Telegraph Avenue | 356 |
| 104 | San Pablo Avenue | 341 |
| 1398 | Claremont Boulevard | 280 |
