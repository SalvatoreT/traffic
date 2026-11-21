# Calibration report: rockridge midday scale 1 seed 1 (60 min)

Offered demand 16221 veh/h x scale 1 = 16221 veh/h. Run took 7.2 s wall clock. Flow tables use the window after a 10 min warm-up; select-link and health figures cover the whole run from an empty network.

## Stability (design D4)

| Criterion | Threshold | Value | Result |
| --- | --- | --- | --- |
| Gridlock removals | 0 | 0 | pass |
| Backlog / spawned | < 2% | 0.0% (2 of 16518) | pass |
| Arterial mean speed (run) | > 4 m/s | 10.09 m/s (last 15 min 10.23) | pass |

Overall: **STABLE**. Mean trip delay 94 s, mean trip time 346 s, completed 16595, unroutable 0.

| t (min) | vehicles in network | backlog | completed | removals | arterial speed in interval (m/s) |
| --- | --- | --- | --- | --- | --- |
| 5 | 1655 | 1 | 1453 | 0 | 10.07 |
| 10 | 1627 | 0 | 2863 | 0 | 9.97 |
| 15 | 1572 | 1 | 4258 | 0 | 10.08 |
| 20 | 1611 | 1 | 5614 | 0 | 10.08 |
| 25 | 1679 | 1 | 6932 | 0 | 10.00 |
| 30 | 1582 | 1 | 8366 | 0 | 10.07 |
| 35 | 1616 | 0 | 9726 | 0 | 9.99 |
| 40 | 1643 | 0 | 11101 | 0 | 10.12 |
| 45 | 1607 | 1 | 12461 | 0 | 10.05 |
| 50 | 1587 | 2 | 13895 | 0 | 10.42 |
| 55 | 1615 | 1 | 15230 | 0 | 10.25 |
| 60 | 1653 | 2 | 16595 | 0 | 10.01 |
## Wandering (completed car trips)

Detour ratio = distance driven (link and movement lengths) over the shortest network distance from the trip's origin to its destination. Detour against the free-flow route uses the time-shortest route with no congestion and no noise, which is what a purposeful driver without live information would follow (it differs from the shortest distance when a faster, longer road exists). A switch is a change of the remaining route while en route. Loops: the same link twice or the same node three or more times. Reversals: a link followed by its reverse within 200 m. 'Study-area vehicle-miles' are miles driven on links inside the study area; the last column is the share of them driven by trips with a detour ratio above 1.3. Guided drivers re-evaluate their route every epoch; the others keep their departure route unless it is blocked.

| Trips | n | Switches per trip | With a switch | Mean detour | Median detour | Detour > 1.3 | Detour > 2 | Mean detour vs free-flow route | Vs free-flow route > 1.3 | Loops | Reversals | Study veh-miles | Of them by detour > 1.3 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| all trips | 15350 | 0.00 | 0.0% | 1.082 | 1.050 | 3.2% | 0.0% | 1.020 | 1.0% | 0.0% | 0.2% | 1535 | 3.9% |
| gate to gate | 5365 | 0.00 | 0.1% | 1.084 | 1.049 | 2.4% | 0.0% | 1.019 | 0.7% | 0.0% | 0.1% | 293 | 5.4% |
| with a local end | 9985 | 0.00 | 0.0% | 1.080 | 1.050 | 3.6% | 0.0% | 1.020 | 1.2% | 0.0% | 0.2% | 1243 | 3.5% |
| guided drivers | 7025 | 0.00 | 0.1% | 1.080 | 1.048 | 3.1% | 0.0% | 1.019 | 1.0% | 0.0% | 0.2% | 692 | 4.3% |
| other drivers | 8325 | 0.00 | 0.0% | 1.083 | 1.051 | 3.2% | 0.0% | 1.020 | 1.1% | 0.0% | 0.2% | 844 | 3.6% |

## Reported patterns (diagnostics; configured in the targets file under `patterns`)

(a) Trips between the surface gates on the north side of the ramps and the freeway mainline gates, and the local-street (residential and service links in the study area) vehicle-miles they drive. Share = of all completed trips' local-street vehicle-miles (267 miles). No observed counterpart exists for this quantity (the targets file has only the select-link shares above).

| Trips | n trips | Local-street veh-miles | Share of all local-street veh-miles |
| --- | --- | --- | --- |
| surface gates to the freeway | 1040 | 18.6 | 7% |
| freeway to the surface gates | 717 | 16.7 | 6% |

(b) Corridor trips: completed trips from beyond one end of the corridor's study-area extent (the bypass street and its arterial together) to beyond the other end, within a lateral limit of the corridor, by direction. 'Bypass' = at least N blocks (links) on the bypass street; 'arterial' = fewer bypass blocks and at least N on the arterial; 'other' = neither (another street, the freeway or a short use); blocks are counted on the corridor's study-area links. No observed counterpart exists for these shares. The related observed values are in the select-link table above: northbound Hillegass Ave traffic rarely ends on College Ave (6%), 21 to 33% jogs to Benvenue Ave, and southbound freeway-bound drivers on College Ave commonly arrive via Ashby Ave and Benvenue Ave and jog to Hillegass Ave.

| Bypass | Arterial | N | Direction | Corridor trips | Bypass | Arterial | Other | Mean bypass blocks |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue | College Avenue | 3 | N | 838 | 3% | 11% | 86% | 0.1 |
| Hillegass Avenue | College Avenue | 3 | S | 937 | 3% | 26% | 70% | 0.2 |

## Per-mode results

Offered: 16221 car veh/h; 105 bicycle flows (386/h); 2000 pedestrian flows (2644/h). Bicycle and pedestrian volumes are assumptions, not counts.

| Mode | In network | Completed | Mean time (s) | Other |
| --- | --- | --- | --- | --- |
| Car | 1653 | 16595 | 346 | |
| Bicycle | 10 | 399 | 168 | |
| Pedestrian | 320 | 2628 | 441 | mean crossing delay 7.1 s |

Vulnerable road users (surrogate indicators): pedestrian conflicts 406, bicycle conflicts 247, close passes 147, pedestrian injury severity mean 0.050 (AIS4+, 11826 supported of 11826 encounters), cyclist injury severity mean 0.066 (MAIS3+F, 894 supported of 1579 encounters) (separate endpoints, never summed), mean vehicle speed at pedestrian encounters 2.59 m/s.


## Volunteer whole-street counts

Each car counts once when it passes the last stop line after driving the full directed corridor in order. The measurement window is 50.0 minutes. The last two columns describe trips that visited any corridor link during the full run.

| Corridor | Counted whole street (veh/h) | Modeled whole street (veh/h) | Used in fit | Through trips on any link (veh/h) | Freeway trips on any link (veh/h) |
| --- | --- | --- | --- | --- | --- |
| Hillegass Avenue NB | n/a | 35 | n/a | 69 | 57 |
| Colby Street NB | n/a | 41 | n/a | 79 | 86 |
| Hillegass Avenue SB | n/a | 24 | n/a | 68 | 58 |
| Colby Street SB | n/a | 22 | n/a | 67 | 61 |

## Intent map: through cars by where they come from and where they are going

Through = neither trip end is in the study area. Groups are the approach groups of the area config (data/areas); a node that is not a gate takes the group of the nearest surface gate (ASSUMPTION). The arterial is the one a trip would use on the shortest free-flow path with the study area's residential and service streets closed, where that path runs on a boundary street near the study area.

Model figures are the mean of 1 seed(s), per hour of the run. Basis: OBSERVED = read from the resident volunteer count of Feb 25, 2025 or its headline shares; ASSUMPTION = inferred from those numbers or chosen.

### Colby Street NB

Observed (PM): 182 cars entered at the south end, 102 drove the whole street, 164 left it at Alcatraz Ave (131 left, 32 right, 1 straight), and 47% of the block's trips came from a freeway (the headline share). ASSUMPTION: freeway-origin cars that do not end along the street are 65 veh/h (the 82 freeway-origin trips on the block, 47% of 174, times the 182 / (182 + 47) of its cars that entered at the south end rather than joining on the way), spread over the 164 exits in proportion (0.40); the other through cars come from the Telegraph Ave and south-side approaches that feed the street's south end. Ranges: low = 131 (32) x 0.47 x 0.62 (the whole-street share of exits), high = 131 (32) x 0.47.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | OBSERVED turn count x ASSUMPTION share (131 left turns x 0.40) | 52 (38 to 62) | 39 | within |
| Telegraph Ave and south-side traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | ASSUMPTION: the through left-turners (131 x 0.62 = 81) that are not off-ramp traffic | 29 (19 to 43) | 20 | within |
| SR-24 off-ramp traffic using Colby St to reach College Ave and Berkeley (right at Alcatraz Ave) | OBSERVED turn count x ASSUMPTION share (32 right turns x 0.40) | 13 (9 to 15) | 3 | below |
| Telegraph Ave and south-side traffic using Colby St to reach College Ave and Berkeley | ASSUMPTION: the through right-turners (32 x 0.62 = 20) that are not off-ramp traffic | 7 (5 to 11) | 16 | above |
| Intents listed, together | | 101 (71 to 131) | 78 | |
| Other through cars (no intent listed) | | | 1 | |

Model through cars by origin and destination group (largest 12 of 16 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 39.0 | Telegraph Avenue |
| Telegraph Ave to the south (downtown Oakland) | Telegraph Ave from the north (Berkeley) | 12.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 9.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Ashby Ave from the west (Emeryville and I-80) | 4.0 | none near the study area |
| West Oakland to the southwest (Adeline St, Market St) | Telegraph Ave from the north (Berkeley) | 3.0 | Telegraph Avenue |
| West Oakland to the southwest (Adeline St, Market St) | College Ave from the north (Berkeley) | 2.0 | Claremont Avenue then College Avenue |
| College Ave from the north (Berkeley) | Emeryville and West Oakland streets (55th to 67th Streets) | 1.0 | College Avenue then Alcatraz Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley hills to the northeast (Evergreen Ln, Gravatt Dr) | 1.0 | none near the study area |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Emeryville and West Oakland streets (55th to 67th Streets) | 1.0 | College Avenue then Alcatraz Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Claremont Ave and Tunnel Rd toward the hills | 1.0 | Claremont Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 1.0 | SR-24 then Claremont Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 1.0 | SR-24 |
| other pairs | | 4.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 65 veh/h; none near the study area 5 veh/h; Claremont Avenue 2 veh/h; Claremont Avenue then College Avenue 2 veh/h; College Avenue then Alcatraz Avenue 2 veh/h; SR-24 1 veh/h.

### Hillegass Avenue NB

Observed (PM): 94 cars entered at the south end, 48 drove the whole street, 109 left it at Alcatraz Ave (43 west, 54 east, 12 straight), and 47% of the block's trips came from a freeway. ASSUMPTION: freeway-origin through cars are 40 veh/h (52 freeway-origin trips times 94 / (94 + 29)), spread over the exits in proportion (0.37); the through share of exits is 48 / 109 = 0.44.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Hillegass Ave to reach Alcatraz Ave west and Telegraph Ave north | OBSERVED turn count x ASSUMPTION share (43 left turns x 0.37) | 16 (9 to 20) | 14 | within |
| SR-24 off-ramp traffic using Hillegass Ave to reach College Ave and Berkeley | OBSERVED turn count x ASSUMPTION share (54 right turns x 0.37) | 20 (11 to 25) | 18 | within |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach Alcatraz Ave west | ASSUMPTION: through exits (43 x 0.44) that are not off-ramp traffic | 3 (0 to 10) | 9 | within |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach College Ave and Berkeley | ASSUMPTION: through exits (54 x 0.44) that are not off-ramp traffic | 4 (0 to 13) | 24 | above |
| Intents listed, together | | 43 (20 to 68) | 65 | |
| Other through cars (no intent listed) | | | 4 | |

Model through cars by origin and destination group (largest 12 of 20 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 17.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 11.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 9.0 | SR-24 |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 4.0 | Claremont Avenue then Alcatraz Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Shattuck Ave from the north (Berkeley) | 3.0 | College Avenue |
| SR-13 Warren Freeway (via SR-24 east) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 3.0 | Claremont Avenue then Alcatraz Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Ashby Ave from the west (Emeryville and I-80) | 3.0 | SR-24 then Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 3.0 | SR-24 then Claremont Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Claremont Ave and Tunnel Rd toward the hills | 2.0 | Claremont Avenue |
| West Oakland to the southwest (Adeline St, Market St) | College Ave from the north (Berkeley) | 2.0 | Claremont Avenue then College Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Telegraph Ave from the north (Berkeley) | 2.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | College Ave from the north (Berkeley) | 2.0 | SR-24 then Claremont Avenue then College Avenue |
| other pairs | | 8.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 32 veh/h; SR-24 9 veh/h; Claremont Avenue then Alcatraz Avenue 7 veh/h; Claremont Avenue 4 veh/h; College Avenue 4 veh/h; SR-24 then Claremont Avenue 3 veh/h.

### Hillegass Avenue SB

Observed (PM): 178 cars entered at the top (76 turned in from Alcatraz Ave west, 98 from the east, 4 came straight from the north), 79 drove the whole street, and 68% of the block's trips (109 veh/h) went to a freeway. ASSUMPTION: freeway-bound cars that did not join mid-street are 87 veh/h (109 x 178 / (178 + 44)), half of the 174 turn-ins; low = the whole-street share of the turn-ins (0.45), high = the freeway-bound share without the mid-street correction (0.63).

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Telegraph Ave, Alcatraz Ave west and West Berkeley traffic turning off Alcatraz Ave onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (76 turn-ins x 0.50) | 38 (34 to 48) | 18 | below |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (98 turn-ins x 0.50) | 49 (44 to 62) | 33 | below |
| Intents listed, together | | 87 (78 to 110) | 51 | |
| Other through cars (no intent listed) | | | 17 | |

Model through cars by origin and destination group (largest 12 of 13 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 19.0 | Claremont Avenue then SR-24 |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 18.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 9.0 | Claremont Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 5.0 | Telegraph Avenue |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 5.0 | College Avenue then Claremont Avenue then SR-24 |
| Ashby Ave from the west (Emeryville and I-80) | College Ave from the north (Berkeley) | 4.0 | Alcatraz Avenue then College Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | College Ave from the north (Berkeley) | 2.0 | Alcatraz Avenue then College Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 1.0 | Alcatraz Avenue then College Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | West Oakland to the southwest (Adeline St, Market St) | 1.0 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 1.0 | Claremont Avenue |
| Telegraph Ave from the north (Berkeley) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 1.0 | College Avenue |
| Emeryville and West Oakland streets (55th to 67th Streets) | Claremont Ave and Tunnel Rd toward the hills | 1.0 | Alcatraz Avenue then Claremont Avenue |
| other pairs | | 1.0 | |

By the arterial these cars would otherwise use: Claremont Avenue then SR-24 28 veh/h; Telegraph Avenue 24 veh/h; Alcatraz Avenue then College Avenue 7 veh/h; College Avenue then Claremont Avenue then SR-24 5 veh/h; Alcatraz Avenue then Claremont Avenue 1 veh/h; Claremont Avenue 1 veh/h.

### Colby Street SB

Observed (PM): 139 cars entered at the top (76 from Alcatraz Ave west, 50 from the east, 13 from the north), 39 drove the whole street, 45% of the block's trips (72 veh/h) went to a freeway and 22% came by way of Telegraph Ave. ASSUMPTION: freeway-bound cars that did not join mid-street are 46 veh/h (72 x 139 / (139 + 79)), 0.365 of the 126 turn-ins; low = the whole-street share (0.31), high = the unadjusted freeway share (0.57). The Telegraph Ave cars are the 22% x 160 = 35 of the 76 west turn-ins.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Southbound Telegraph Ave traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (35 Telegraph Ave cars x 0.365) | 13 (11 to 20) | 11 | within |
| Alcatraz Ave west, Ashby Ave and West Berkeley traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (41 other west turn-ins x 0.365) | 15 (13 to 23) | 6 | below |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (50 east turn-ins x 0.365) | 18 (15 to 29) | 22 | within |
| Intents listed, together | | 46 (39 to 72) | 39 | |
| Other through cars (no intent listed) | | | 28 | |

Model through cars by origin and destination group (largest 12 of 19 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 13.0 | Claremont Avenue then SR-24 |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 11.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 8.0 | College Avenue then Claremont Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 6.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Telegraph Ave to the south (downtown Oakland) | 5.0 | Telegraph Avenue |
| West Oakland to the southwest (Adeline St, Market St) | College Ave from the north (Berkeley) | 5.0 | Claremont Avenue then College Avenue |
| Alcatraz Ave from the west (Emeryville side) | SR-13 Warren Freeway (via SR-24 east) | 3.0 | SR-24 |
| Ashby Ave from the west (Emeryville and I-80) | College Ave from the north (Berkeley) | 2.0 | Alcatraz Avenue then College Avenue |
| Claremont Ave and Tunnel Rd toward the hills | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 2.0 | Claremont Avenue then Alcatraz Avenue then Telegraph Avenue |
| College Ave from the north (Berkeley) | Telegraph Ave to the south (downtown Oakland) | 2.0 | Telegraph Avenue |
| Shattuck Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 2.0 | none near the study area |
| Ashby Ave from the west (Emeryville and I-80) | SR-13 Warren Freeway (via SR-24 east) | 1.0 | SR-24 |
| other pairs | | 7.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 25 veh/h; Claremont Avenue then SR-24 13 veh/h; College Avenue then Claremont Avenue then SR-24 9 veh/h; Claremont Avenue then College Avenue 5 veh/h; Alcatraz Avenue then College Avenue 4 veh/h; SR-24 4 veh/h.

### Study area, all residential and service streets

Model: 390 through cars per hour.

Model through cars by origin and destination group (largest 12 of 51 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 72.0 | Claremont Avenue then Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 44.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 35.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 27.0 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 26.0 | Claremont Avenue then SR-24 |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 26.0 | Telegraph Avenue |
| West Oakland to the southwest (Adeline St, Market St) | College Ave from the north (Berkeley) | 22.0 | Claremont Avenue then College Avenue |
| Telegraph Ave to the south (downtown Oakland) | Telegraph Ave from the north (Berkeley) | 12.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 9.0 | SR-24 |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 8.0 | Telegraph Avenue |
| Ashby Ave from the west (Emeryville and I-80) | College Ave from the north (Berkeley) | 6.0 | Alcatraz Avenue then College Avenue |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 6.0 | College Avenue then Claremont Avenue then SR-24 |
| other pairs | | 97.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 176 veh/h; Claremont Avenue then Telegraph Avenue 78 veh/h; Claremont Avenue then SR-24 26 veh/h; Claremont Avenue then College Avenue 22 veh/h; SR-24 15 veh/h; Alcatraz Avenue then College Avenue 11 veh/h.

By origin group: South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 95; Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 74; SR-24 eastbound off-ramps (arriving from Oakland and I-980) 64; West Oakland to the southwest (Adeline St, Market St) 31; Claremont Ave and Tunnel Rd toward the hills 30; Telegraph Ave from the north (Berkeley) 30; Telegraph Ave to the south (downtown Oakland) 25; College Ave from the north (Berkeley) 9; SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) 8; Ashby Ave from the west (Emeryville and I-80) 7.

By destination group: Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 102; SR-24 westbound on-ramps (toward Oakland and I-980) 97; Telegraph Ave from the north (Berkeley) 61; College Ave from the north (Berkeley) 37; South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 31; Claremont Ave and Tunnel Rd toward the hills 21; Telegraph Ave to the south (downtown Oakland) 14; Ashby Ave from the west (Emeryville and I-80) 7; Emeryville and West Oakland streets (55th to 67th Streets) 5; SR-13 Warren Freeway (via SR-24 east) 4.


## Through cars by intent (cut-through intent view)

A through car is tallied once, under the first intent that fits it (the on-ramp on its planned route, the off-ramp it has driven, or the origin and destination groups of its trip), at the moment the through count counts it. Cars an hour over the run, the same window as the through-car figure (393 an hour).

| Intent | Basis | Cars an hour | Share |
| --- | --- | --- | --- |
| on-2853241697 | observed | 96 | 24% |
| Other on-ramps | assumed | 4 | 1% |
| off-52990846 | observed | 64 | 16% |
| Other off-ramps | assumed | 12 | 3% |
| Downtown, south and west Oakland traffic using side streets to reach Berkeley and Telegraph Ave north | assumed | 124 | 32% |
| Berkeley and Telegraph Ave north traffic using side streets to reach downtown, south and west Oakland | assumed | 39 | 10% |
| Oakland cross-town traffic (West Oakland, Broadway, Piedmont, Emeryville) using side streets near Claremont Ave and Telegraph Ave | assumed | 28 | 7% |
| Other (no intent listed) |  | 26 | 7% |

Intents listed cover 93% of through cars.


## Select-link shares: modeled vs observed (design D5: headline = freeway shares, tolerance +/-10 pp)

- Hillegass Avenue NB: 4 links (path Claremont Avenue -> Alcatraz Avenue (434 m)), 123 trips (111 completed)
- Colby Street NB: 8 links (path Claremont Avenue -> Alcatraz Avenue (680 m)), 188 trips (178 completed)
- Hillegass Avenue SB: 4 links (path Alcatraz Avenue -> Claremont Avenue (433 m)), 121 trips (113 completed)
- Colby Street SB: 8 links (path Alcatraz Avenue -> Claremont Avenue (680 m)), 152 trips (141 completed)

| Block | Side | Via | Observed | Modeled | Diff (pp) | n trips | Headline |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue NB | from | freeway | 47% | 46% | -1 | 123 | within |
| Hillegass Avenue NB | to | Benvenue Avenue | 21% (PM 33%) | 3% | -18 | 123 |  |
| Hillegass Avenue NB | to | College Avenue | 6% | 11% | +5 | 123 |  |
| Hillegass Avenue NB | to | Alcatraz Avenue WB | 27% | 41% | +14 | 123 |  |
| Colby Street NB | from | freeway | 47% | 46% | -1 | 188 | within |
| Colby Street NB | to | Alcatraz Avenue WB | 48% | 47% | -1 | 188 |  |
| Colby Street NB | to | Telegraph Avenue | 25% | 35% | +10 | 188 |  |
| Colby Street NB | to | College Avenue | 3% | 4% | +1 | 188 |  |
| Hillegass Avenue SB | from | Alcatraz Avenue WB | 46% | 42% | -4 | 121 |  |
| Hillegass Avenue SB | from | Benvenue Avenue | 26% | 4% | -22 | 121 |  |
| Hillegass Avenue SB | from | College Avenue | 16% | 22% | +6 | 121 |  |
| Hillegass Avenue SB | to | freeway | 57% (PM 68%) | 47% | -10 | 121 | within |
| Colby Street SB | from | Alcatraz Avenue EB | 43% | 14% | -29 | 152 |  |
| Colby Street SB | from | Alcatraz Avenue WB | 46% | 20% | -26 | 152 |  |
| Colby Street SB | from | Telegraph Avenue | 22% | 11% | -11 | 152 |  |
| Colby Street SB | to | freeway | 45% | 39% | -6 | 152 | within |
| Colby Street SB | to | Forest Street | 34% | 18% | -16 | 152 |  |

Headline shares within tolerance: 4 of 4. Observed column uses the PM-peak share where one is given and the period is pm_peak. 'Via' shares are the fraction of select-link trips using that street before (from) or after (to) the block; freeway = origin / destination gate with a motorway-class link attached.

## Claremont ramps: streets used before the on-ramp / after the off-ramp

Observed shares are for traffic from/to the north only. 'Modeled' is over all trips on the ramps and any visit to the street (an upper bound for streets that serve both sides). 'Modeled, side' counts only trips whose surface end lies on the side of the ramp stated in the targets file (`freewayRamp.side`), and for a street with a qualifier ("north of X") only its links on that side of X.

| Direction | Via | Observed | Modeled | n ramp trips | Modeled, side | n side trips |
| --- | --- | --- | --- | --- | --- | --- |
| onto freeway | College Avenue | 16% | 17% | 426 | 19% | 376 |
| onto freeway | Hillegass Avenue | 12% | 14% | 426 | 16% | 376 |
| onto freeway | Martin Street | 10% | 13% | 426 | 14% | 376 |
| onto freeway | Colby Street | 8% | 12% | 426 | 13% | 376 |
| onto freeway | Telegraph Avenue north of Alcatraz Avenue | 8% | 11% | 426 | 10% | 376 |
| onto freeway | Benvenue Avenue | 5% | 5% | 426 | 6% | 376 |
| from freeway | College Avenue | 10% | 5% | 485 | 6% | 471 |
| from freeway | Martin Street | 10% | 14% | 485 | 15% | 471 |
| from freeway | Colby Street | 8% | 9% | 485 | 9% | 471 |
| from freeway | Hillegass Avenue | 5% | 7% | 485 | 7% | 471 |
| from freeway | Benvenue Avenue | 3% | 1% | 485 | 1% | 471 |

## Top 15 links by delay

| Link | Street | Class | Lanes | Len (m) | End node control | Delay (veh-h) | Stopped (veh-h) | Mean stopped veh | Flow (veh/h) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1049 | Adeline Street | Secondary | 4 | 43 | signal | 4.52 | 3.85 | 3.8 | 648 |
| 3395 | Ashby Avenue | Primary | 1 | 129 | signal | 4.12 | 3.08 | 3.1 | 535 |
| 498 | Sacramento Street | Tertiary | 3 | 48 | signal | 3.54 | 2.73 | 2.7 | 619 |
| 3447 | Claremont Avenue | Secondary | 3 | 43 | signal | 3.21 | 2.45 | 2.4 | 553 |
| 1666 | 52nd Street | Secondary | 4 | 39 | signal | 2.99 | 2.66 | 2.7 | 392 |
| 1662 | 52nd Street | Secondary | 4 | 53 | signal | 2.87 | 2.04 | 2.0 | 802 |
| 1763 | 51st Street | Secondary | 4 | 58 | signal | 2.84 | 2.27 | 2.3 | 551 |
| 2039 | Telegraph Avenue | Secondary | 3 | 50 | signal | 2.82 | 2.12 | 2.1 | 556 |
| 755 | Market Street | Tertiary | 2 | 77 | signal | 2.81 | 2.41 | 2.4 | 292 |
| 3426 | Ashby Avenue | Primary | 2 | 37 | signal | 2.81 | 2.38 | 2.4 | 349 |
| 2776 | Claremont Avenue | Secondary | 2 | 161 | signal | 2.74 | 2.36 | 2.4 | 344 |
| 761 | Martin Luther King Junior Way | Secondary | 4 | 32 | signal | 2.73 | 2.18 | 2.2 | 1145 |
| 1037 | Sacramento Street | Tertiary | 3 | 40 | signal | 2.70 | 1.93 | 1.9 | 1091 |
| 1055 | Stanford Avenue | Secondary | 3 | 68 | signal | 2.68 | 2.21 | 2.2 | 533 |
| 1604 | Telegraph Avenue | Secondary | 2 | 94 | signal | 2.68 | 2.11 | 2.1 | 409 |

## Top 15 nodes by blocked time

Blocked time = lane-head seconds waiting at the stop line without permission (signal red, conflict, stop sign or no downstream space).

| Node | Streets | Control | Gate | Blocked (lane-h) | of which no downstream space | Signal plan at end (cycle: greens) |
| --- | --- | --- | --- | --- | --- | --- |
| 680 | 52nd Street / Shattuck Avenue | signal |  | 4.14 | 0.02 | 110 s: 30/28/38 |
| 447 | Adeline Street / Alcatraz Avenue | signal |  | 3.89 | 0.03 | 75 s: 21/44 |
| 446 | Market Street / Stanford Avenue | signal |  | 3.43 | 0.06 | 75 s: 30/35 |
| 1406 | Ashby Avenue / Claremont Avenue | signal |  | 3.34 | 0.07 | 75 s: 30/15/15 |
| 30 | 57th Street / Adeline Street / Market Street | signal |  | 2.81 | 0.03 | 75 s: 15/24/21 |
| 1069 | Claremont Avenue / Colby Street / Forest Street | signal |  | 2.76 | 0.00 | 147 s: 65/10/57 |
| 331 | 52nd Street / Martin Luther King Junior Way | signal |  | 2.73 | 0.02 | 75 s: 39/26 |
| 1080 | 62nd Street / Claremont Avenue / College Avenue | signal |  | 2.50 | 0.05 | 75 s: 15/30/15 |
| 185 | Alcatraz Avenue / Sacramento Street | signal |  | 2.50 | 0.02 | 75 s: 28/37 |
| 37 | San Pablo Avenue / Stanford Avenue | signal |  | 2.44 | 0.01 | 75 s: 20/45 |
| 851 | Alcatraz Avenue / Telegraph Avenue | signal |  | 2.40 | 0.02 | 75 s: 37/28 |
| 242 | Ashby Avenue / Martin Luther King Junior Way | signal |  | 2.15 | 0.00 | 75 s: 36/29 |
| 944 | Ashby Avenue / Shattuck Avenue | signal |  | 2.08 | 0.02 | 75 s: 43/22 |
| 713 | 51st Street / Telegraph Avenue | signal |  | 2.07 | 0.01 | 75 s: 34/31 |
| 501 | Alcatraz Avenue / Shattuck Avenue | signal |  | 1.98 | 0.03 | 75 s: 18/47 |

Phases of the five most blocked signals (green s: approach links with their lanes, link ids in brackets):

- node 680: 30 s: 52nd Street 4L [1662]; 28 s: 52nd Street 4L [1666], 52nd Street 4L [1662]; 38 s: Shattuck Avenue 2L [1653], Shattuck Avenue 2L [1705]
- node 447: 21 s: Adeline Street 4L [1049], Adeline Street 4L [1051]; 44 s: Alcatraz Avenue 2L [1048], Alcatraz Avenue 2L [1133]
- node 446: 30 s: Stanford Avenue 3L [941], Stanford Avenue 3L [1055]; 35 s: Market Street 4L [1108], Market Street 3L [1111]
- node 1406: 30 s: Ashby Avenue 1L [3395], Ashby Avenue 2L [3426]; 15 s: Claremont Avenue 2L [4329]; 15 s: Claremont Avenue 3L [3447]
- node 30: 15 s: Adeline Street 1L [747], Adeline Street 1L [1030]; 24 s: Market Street 2L [755], Market Street 2L [1113]; 21 s: 57th Street 1L [44], 57th Street 1L [1151]

## Cars cleared from gridlock near and far (judged zone)

Judged zone: the study area, its bounding streets and the junctions on them, plus nodes within 200 m of it along the network (111 nodes, 329 links). A far clearing counts against the stability rule when its blocking chain (vehicles held at least 60 s by a full exit, at the 5 s snapshot before it) reaches a link in the zone.

| Buffer (m) | Near | Far | Far, chain reaches the zone | Judged |
| --- | --- | --- | --- | --- |
| 100.0 | 0 | 0 | 0 | 0 |
| 200.0 | 0 | 0 | 0 | 0 |
| 400.0 | 0 | 0 | 0 | 0 |

Entry backlog at the end of the run: 0 trips waiting at origins in the zone, of 2 in all.

| Bounding street | Links | Longest standing queue on one link (m) | Link (length m) | At (min) | Share of samples with a link full |
| --- | --- | --- | --- | --- | --- |
| Telegraph Avenue | 28 | 55.0 | 1604 (94.0) | 35.8 | 0.0 |
| Alcatraz Avenue | 14 | 39.0 | 4238 (84.0) | 13.5 | 0.0 |
| College Avenue | 6 | 39.0 | 2805 (102.0) | 21.7 | 0.0 |
| Claremont Avenue | 13 | 59.0 | 2776 (161.0) | 35.4 | 0.0 |
| CA 24 | 3 | 23.0 | 1945 (188.0) | 12.8 | 0.0 |

## Junction recovery

Policy `physical`. Node entries by cars and cyclists in the run: 517402 (settle interval 0). An admission is an entry the ordinary rule would have refused; head-seconds count the time a waiting head vehicle had the reason invoked, and the part of it in which it still could not enter. Courtesy and the yield fallback change priority only; under `physical` the conflict bypass never admits.

| Reason | Admissions per hour | Per 1,000 entries | Head-s invoked | Head-s blocked |
| --- | --- | --- | --- | --- |
| courtesy | 16.0 | 0.031 | 124 | 118 |
| yield fallback | 8.0 | 0.015 | 2 | 0 |
| conflict bypass | 0.0 | 0.000 | 0 | 0 |

Vehicles removed while held in a node by a full exit: 0 (0.0 per hour, included in the gridlock removals).

| Node | Streets | Control | Courtesy | Yield fallback | Conflict bypass | Held removals |
| --- | --- | --- | --- | --- | --- | --- |
| 165 | Alcatraz Avenue / Baker Street | two_way_stop | 3 | 2 | 0 | 0 |
| 1429 | Claremont Avenue / Claremont Boulevard | two_way_stop | 5 | 0 | 0 | 0 |
| 141 | 63rd Street / Lowell Street / Market Street | two_way_stop | 1 | 1 | 0 | 0 |
| 168 | 62nd Street / Market Street | two_way_stop | 0 | 2 | 0 | 0 |
| 395 | 65th Street / Shattuck Avenue | two_way_stop | 1 | 1 | 0 | 0 |
| 342 | 56th Street / Shattuck Avenue | two_way_stop | 0 | 1 | 0 | 0 |
| 528 | Shattuck Avenue / Woolsey Street | two_way_stop | 1 | 0 | 0 | 0 |
| 652 | 45th Street / Telegraph Avenue | uncontrolled | 1 | 0 | 0 | 0 |
| 727 | 52nd Street | uncontrolled | 1 | 0 | 0 | 0 |
| 766 | 57th Street / Shattuck Avenue | two_way_stop | 0 | 1 | 0 | 0 |

## Entry backlog by origin node at end of run (top 10)

| Node | Streets | Trips waiting | Offered veh/h (before scale) |
| --- | --- | --- | --- |
| 6 | Adeline Street / Aileen Street | 1 | 6 |
| 602 | Grove Shafter Freeway | 1 | 2537 |

## Flow on key streets (veh/h per direction, study-area links of 40 m or more)

| Street | Direction of travel | Links | Median flow | Max flow |
| --- | --- | --- | --- | --- |
| Telegraph | N | 12 | 637 | 698 |
| Telegraph | S | 10 | 650 | 676 |
| College | N | 3 | 184 | 185 |
| College | S | 3 | 481 | 481 |
| Claremont | N | 6 | 281 | 460 |
| Claremont | S | 7 | 170 | 454 |
| Alcatraz | E | 6 | 349 | 362 |
| Alcatraz | W | 6 | 251 | 283 |
| Hillegass | N | 4 | 66 | 74 |
| Hillegass | S | 4 | 56 | 76 |
| Colby | N | 7 | 83 | 106 |
| Colby | S | 7 | 78 | 102 |
| Martin | E | 2 | 78 | 78 |
| Martin | W | 2 | 134 | 134 |

## Largest demand origins (offered, before scale)

| Node | Streets | Veh/h |
| --- | --- | --- |
| 602 | Grove Shafter Freeway | 2537 |
| 943 | Telegraph Avenue / Ward Street | 811 |
| 265 | Ashby Avenue | 781 |
| 1672 | Warren Freeway | 733 |
| 183 | San Pablo Avenue | 542 |
| 763 | Telegraph Avenue | 474 |
| 577 | Martin Luther King Junior Way | 294 |
| 1719 | Grove Shafter Freeway | 286 |
| 276 | Martin Luther King Junior Way | 280 |
| 974 | Broadway | 273 |
