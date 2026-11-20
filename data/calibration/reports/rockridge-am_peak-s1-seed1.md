# Calibration report: rockridge am_peak scale 1 seed 1 (60 min)

Offered demand 21511 veh/h x scale 1 = 21511 veh/h. Run took 22.2 s wall clock. Flow tables use the window after a 10 min warm-up; select-link and health figures cover the whole run from an empty network.

## Stability (design D4)

| Criterion | Threshold | Value | Result |
| --- | --- | --- | --- |
| Gridlock removals | 0 | 0 | pass |
| Backlog / spawned | < 2% | 0.3% (72 of 21551) | pass |
| Arterial mean speed (run) | > 4 m/s | 8.76 m/s (last 15 min 8.60) | pass |

Overall: **STABLE**. Mean trip delay 142 s, mean trip time 401 s, completed 21710, unroutable 0.

| t (min) | vehicles in network | backlog | completed | removals | arterial speed in interval (m/s) |
| --- | --- | --- | --- | --- | --- |
| 5 | 2469 | 10 | 1849 | 0 | 8.81 |
| 10 | 2438 | 9 | 3697 | 0 | 8.88 |
| 15 | 2455 | 13 | 5498 | 0 | 8.95 |
| 20 | 2496 | 11 | 7360 | 0 | 8.77 |
| 25 | 2374 | 7 | 9244 | 0 | 8.93 |
| 30 | 2393 | 23 | 11010 | 0 | 8.78 |
| 35 | 2457 | 21 | 12769 | 0 | 8.97 |
| 40 | 2365 | 42 | 14593 | 0 | 8.79 |
| 45 | 2500 | 42 | 16300 | 0 | 8.42 |
| 50 | 2546 | 47 | 18064 | 0 | 8.53 |
| 55 | 2577 | 60 | 19817 | 0 | 8.64 |
| 60 | 2405 | 72 | 21710 | 0 | 8.62 |
## Wandering (completed car trips)

Detour ratio = distance driven (link and movement lengths) over the shortest network distance from the trip's origin to its destination. Detour against the free-flow route uses the time-shortest route with no congestion and no noise, which is what a purposeful driver without live information would follow (it differs from the shortest distance when a faster, longer road exists). A switch is a change of the remaining route while en route. Loops: the same link twice or the same node three or more times. Reversals: a link followed by its reverse within 200 m. 'Study-area vehicle-miles' are miles driven on links inside the study area; the last column is the share of them driven by trips with a detour ratio above 1.3. Guided drivers re-evaluate their route every epoch; the others keep their departure route unless it is blocked.

| Trips | n | Switches per trip | With a switch | Mean detour | Median detour | Detour > 1.3 | Detour > 2 | Mean detour vs free-flow route | Vs free-flow route > 1.3 | Loops | Reversals | Study veh-miles | Of them by detour > 1.3 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| all trips | 19890 | 0.02 | 1.6% | 1.088 | 1.054 | 4.2% | 0.0% | 1.027 | 2.0% | 0.0% | 0.2% | 2116 | 6.8% |
| gate to gate | 6919 | 0.03 | 3.1% | 1.097 | 1.067 | 4.3% | 0.0% | 1.034 | 2.4% | 0.0% | 0.2% | 641 | 7.3% |
| with a local end | 12971 | 0.01 | 0.9% | 1.083 | 1.050 | 4.1% | 0.0% | 1.024 | 1.7% | 0.0% | 0.3% | 1474 | 6.6% |
| guided drivers | 9196 | 0.04 | 3.5% | 1.088 | 1.055 | 4.1% | 0.0% | 1.026 | 1.9% | 0.0% | 0.2% | 985 | 6.6% |
| other drivers | 10694 | 0.00 | 0.0% | 1.088 | 1.054 | 4.2% | 0.0% | 1.028 | 2.0% | 0.0% | 0.3% | 1131 | 7.0% |

## Reported patterns (diagnostics; configured in the targets file under `patterns`)

(a) Trips between the surface gates on the north side of the ramps and the freeway mainline gates, and the local-street (residential and service links in the study area) vehicle-miles they drive. Share = of all completed trips' local-street vehicle-miles (317 miles). No observed counterpart exists for this quantity (the targets file has only the select-link shares above).

| Trips | n trips | Local-street veh-miles | Share of all local-street veh-miles |
| --- | --- | --- | --- |
| surface gates to the freeway | 1112 | 17.0 | 5% |
| freeway to the surface gates | 1445 | 21.3 | 7% |

(b) Corridor trips: completed trips from beyond one end of the corridor's study-area extent (the bypass street and its arterial together) to beyond the other end, within a lateral limit of the corridor, by direction. 'Bypass' = at least N blocks (links) on the bypass street; 'arterial' = fewer bypass blocks and at least N on the arterial; 'other' = neither (another street, the freeway or a short use); blocks are counted on the corridor's study-area links. No observed counterpart exists for these shares. The related observed values are in the select-link table above: northbound Hillegass Ave traffic rarely ends on College Ave (6%), 21 to 33% jogs to Benvenue Ave, and southbound freeway-bound drivers on College Ave commonly arrive via Ashby Ave and Benvenue Ave and jog to Hillegass Ave.

| Bypass | Arterial | N | Direction | Corridor trips | Bypass | Arterial | Other | Mean bypass blocks |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue | College Avenue | 3 | N | 965 | 4% | 9% | 87% | 0.2 |
| Hillegass Avenue | College Avenue | 3 | S | 977 | 3% | 15% | 82% | 0.2 |

## Per-mode results

Offered: 21511 car veh/h; 497 bicycle flows (702/h); 2000 pedestrian flows (2228/h). Bicycle and pedestrian volumes are assumptions, not counts.

| Mode | In network | Completed | Mean time (s) | Other |
| --- | --- | --- | --- | --- |
| Car | 2405 | 21710 | 401 | |
| Bicycle | 49 | 716 | 248 | |
| Pedestrian | 332 | 2102 | 453 | mean crossing delay 6.8 s |

Vulnerable road users (surrogate indicators): pedestrian conflicts 356, bicycle conflicts 795, close passes 626, pedestrian injury severity mean 0.046 (AIS4+, 11961 supported of 11961 encounters), cyclist injury severity mean 0.063 (MAIS3+F, 2785 supported of 5242 encounters) (separate endpoints, never summed), mean vehicle speed at pedestrian encounters 2.43 m/s.


## Volunteer whole-street counts

Each car counts once when it passes the last stop line after driving the full directed corridor in order. The measurement window is 50.0 minutes. The last two columns describe trips that visited any corridor link during the full run.

| Corridor | Counted whole street (veh/h) | Modeled whole street (veh/h) | Used in fit | Through trips on any link (veh/h) | Freeway trips on any link (veh/h) |
| --- | --- | --- | --- | --- | --- |
| Hillegass Avenue NB | 34 | 44 | yes | 72 | 77 |
| Colby Street NB | 33 | 46 | yes | 75 | 79 |
| Hillegass Avenue SB | 36 | 31 | yes | 55 | 64 |
| Colby Street SB | 46 | 28 | yes | 72 | 65 |

## Intent map: through cars by where they come from and where they are going

Through = neither trip end is in the study area. Groups are the approach groups of the area config (data/areas); a node that is not a gate takes the group of the nearest surface gate (ASSUMPTION). The arterial is the one a trip would use on the shortest free-flow path with the study area's residential and service streets closed, where that path runs on a boundary street near the study area.

Model figures are the mean of 1 seed(s), per hour of the run. Basis: OBSERVED = read from the resident volunteer count of Feb 25, 2025 or its headline shares; ASSUMPTION = inferred from those numbers or chosen.

### Colby Street NB

Observed (PM): 182 cars entered at the south end, 102 drove the whole street, 164 left it at Alcatraz Ave (131 left, 32 right, 1 straight), and 47% of the block's trips came from a freeway (the headline share). ASSUMPTION: freeway-origin cars that do not end along the street are 65 veh/h (the 82 freeway-origin trips on the block, 47% of 174, times the 182 / (182 + 47) of its cars that entered at the south end rather than joining on the way), spread over the 164 exits in proportion (0.40); the other through cars come from the Telegraph Ave and south-side approaches that feed the street's south end. Ranges: low = 131 (32) x 0.47 x 0.62 (the whole-street share of exits), high = 131 (32) x 0.47.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | OBSERVED turn count x ASSUMPTION share (131 left turns x 0.40) | 52 (38 to 62) | 32 | below |
| Telegraph Ave and south-side traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | ASSUMPTION: the through left-turners (131 x 0.62 = 81) that are not off-ramp traffic | 29 (19 to 43) | 21 | within |
| SR-24 off-ramp traffic using Colby St to reach College Ave and Berkeley (right at Alcatraz Ave) | OBSERVED turn count x ASSUMPTION share (32 right turns x 0.40) | 13 (9 to 15) | 5 | below |
| Telegraph Ave and south-side traffic using Colby St to reach College Ave and Berkeley | ASSUMPTION: the through right-turners (32 x 0.62 = 20) that are not off-ramp traffic | 7 (5 to 11) | 13 | above |
| Intents listed, together | | 101 (71 to 131) | 71 | |
| Other through cars (no intent listed) | | | 4 | |

Model through cars by origin and destination group (largest 12 of 15 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 32.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 12.0 | Claremont Avenue then Telegraph Avenue |
| Telegraph Ave to the south (downtown Oakland) | Telegraph Ave from the north (Berkeley) | 8.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Ashby Ave from the west (Emeryville and I-80) | 4.0 | Claremont Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 3.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Emeryville and West Oakland streets (55th to 67th Streets) | 3.0 | Claremont Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Telegraph Ave from the north (Berkeley) | 3.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 2.0 | SR-24 then Claremont Avenue then College Avenue then Alcatraz Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | College Ave from the north (Berkeley) | 2.0 | SR-24 then Claremont Avenue then College Avenue |
| College Ave from the north (Berkeley) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 1.0 | College Avenue then Alcatraz Avenue |
| San Pablo Ave (Emeryville and West Oakland) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 1.0 | Alcatraz Avenue then College Avenue |
| San Pablo Ave (Emeryville and West Oakland) | College Ave from the north (Berkeley) | 1.0 | Alcatraz Avenue then College Avenue |
| other pairs | | 3.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 46 veh/h; Claremont Avenue then Telegraph Avenue 12 veh/h; Claremont Avenue 8 veh/h; Alcatraz Avenue then College Avenue 3 veh/h; SR-24 then Claremont Avenue then College Avenue 2 veh/h; SR-24 then Claremont Avenue then College Avenue then Alcatraz Avenue 2 veh/h.

### Hillegass Avenue NB

Observed (PM): 94 cars entered at the south end, 48 drove the whole street, 109 left it at Alcatraz Ave (43 west, 54 east, 12 straight), and 47% of the block's trips came from a freeway. ASSUMPTION: freeway-origin through cars are 40 veh/h (52 freeway-origin trips times 94 / (94 + 29)), spread over the exits in proportion (0.37); the through share of exits is 48 / 109 = 0.44.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Hillegass Ave to reach Alcatraz Ave west and Telegraph Ave north | OBSERVED turn count x ASSUMPTION share (43 left turns x 0.37) | 16 (9 to 20) | 20 | within |
| SR-24 off-ramp traffic using Hillegass Ave to reach College Ave and Berkeley | OBSERVED turn count x ASSUMPTION share (54 right turns x 0.37) | 20 (11 to 25) | 32 | above |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach Alcatraz Ave west | ASSUMPTION: through exits (43 x 0.44) that are not off-ramp traffic | 3 (0 to 10) | 6 | within |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach College Ave and Berkeley | ASSUMPTION: through exits (54 x 0.44) that are not off-ramp traffic | 4 (0 to 13) | 9 | within |
| Intents listed, together | | 43 (20 to 68) | 67 | |
| Other through cars (no intent listed) | | | 5 | |

Model through cars by origin and destination group (largest 12 of 23 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 18.0 | SR-24 |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 15.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 9.0 | SR-24 then Claremont Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | College Ave from the north (Berkeley) | 5.0 | SR-24 then Claremont Avenue then College Avenue |
| College Ave from the north (Berkeley) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 3.0 | College Avenue then Alcatraz Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 2.0 | Claremont Avenue then Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Emeryville and West Oakland streets (55th to 67th Streets) | 2.0 | Claremont Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | San Pablo Ave (Emeryville and West Oakland) | 2.0 | SR-24 |
| Telegraph Ave to the south (downtown Oakland) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 2.0 | Claremont Avenue then College Avenue |
| Claremont Ave and Tunnel Rd toward the hills | San Pablo Ave (Emeryville and West Oakland) | 1.0 | Claremont Avenue then Alcatraz Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Alcatraz Ave from the west (Emeryville side) | 1.0 | none near the study area |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Ashby Ave from the west (Emeryville and I-80) | 1.0 | none near the study area |
| other pairs | | 11.0 | |

By the arterial these cars would otherwise use: SR-24 20 veh/h; Telegraph Avenue 18 veh/h; SR-24 then Claremont Avenue 9 veh/h; Claremont Avenue 6 veh/h; SR-24 then Claremont Avenue then College Avenue 5 veh/h; Claremont Avenue then College Avenue 3 veh/h.

### Hillegass Avenue SB

Observed (PM): 178 cars entered at the top (76 turned in from Alcatraz Ave west, 98 from the east, 4 came straight from the north), 79 drove the whole street, and 68% of the block's trips (109 veh/h) went to a freeway. ASSUMPTION: freeway-bound cars that did not join mid-street are 87 veh/h (109 x 178 / (178 + 44)), half of the 174 turn-ins; low = the whole-street share of the turn-ins (0.45), high = the freeway-bound share without the mid-street correction (0.63).

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Telegraph Ave, Alcatraz Ave west and West Berkeley traffic turning off Alcatraz Ave onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (76 turn-ins x 0.50) | 38 (34 to 48) | 10 | below |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (98 turn-ins x 0.50) | 49 (44 to 62) | 27 | below |
| Intents listed, together | | 87 (78 to 110) | 37 | |
| Other through cars (no intent listed) | | | 18 | |

Model through cars by origin and destination group (largest 12 of 7 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 17.0 | Alcatraz Avenue then College Avenue then Claremont Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 12.0 | Claremont Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 8.0 | Claremont Avenue then SR-24 |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 8.0 | Telegraph Avenue |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 7.0 | College Avenue then Claremont Avenue then SR-24 |
| Shattuck Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 2.0 | none near the study area |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Emeryville and West Oakland streets (55th to 67th Streets) | 1.0 | Claremont Avenue then Alcatraz Avenue |

By the arterial these cars would otherwise use: Claremont Avenue then SR-24 20 veh/h; Alcatraz Avenue then College Avenue then Claremont Avenue 17 veh/h; Telegraph Avenue 8 veh/h; College Avenue then Claremont Avenue then SR-24 7 veh/h; none near the study area 2 veh/h; Claremont Avenue then Alcatraz Avenue 1 veh/h.

### Colby Street SB

Observed (PM): 139 cars entered at the top (76 from Alcatraz Ave west, 50 from the east, 13 from the north), 39 drove the whole street, 45% of the block's trips (72 veh/h) went to a freeway and 22% came by way of Telegraph Ave. ASSUMPTION: freeway-bound cars that did not join mid-street are 46 veh/h (72 x 139 / (139 + 79)), 0.365 of the 126 turn-ins; low = the whole-street share (0.31), high = the unadjusted freeway share (0.57). The Telegraph Ave cars are the 22% x 160 = 35 of the 76 west turn-ins.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Southbound Telegraph Ave traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (35 Telegraph Ave cars x 0.365) | 13 (11 to 20) | 7 | below |
| Alcatraz Ave west, Ashby Ave and West Berkeley traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (41 other west turn-ins x 0.365) | 15 (13 to 23) | 16 | within |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (50 east turn-ins x 0.365) | 18 (15 to 29) | 8 | below |
| Intents listed, together | | 46 (39 to 72) | 31 | |
| Other through cars (no intent listed) | | | 41 | |

Model through cars by origin and destination group (largest 12 of 22 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 20.0 | Alcatraz Avenue then College Avenue then Claremont Avenue |
| Shattuck Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 9.0 | none near the study area |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 7.0 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 7.0 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 6.0 | Telegraph Avenue |
| Ashby Ave from the west (Emeryville and I-80) | SR-13 Warren Freeway (via SR-24 east) | 3.0 | SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | San Pablo Ave (Emeryville and West Oakland) | 2.0 | Claremont Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Emeryville and West Oakland streets (55th to 67th Streets) | 2.0 | Claremont Avenue then Alcatraz Avenue |
| Claremont Ave and Tunnel Rd toward the hills | Emeryville and West Oakland streets (55th to 67th Streets) | 2.0 | Claremont Avenue then Alcatraz Avenue |
| Berkeley hills to the northeast (Evergreen Ln, Gravatt Dr) | Emeryville and West Oakland streets (55th to 67th Streets) | 2.0 | SR-24 |
| Alcatraz Ave from the west (Emeryville side) | SR-13 Warren Freeway (via SR-24 east) | 1.0 | SR-24 |
| Alcatraz Ave from the west (Emeryville side) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 1.0 | SR-24 |
| other pairs | | 10.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 22 veh/h; Alcatraz Avenue then College Avenue then Claremont Avenue 20 veh/h; none near the study area 12 veh/h; SR-24 8 veh/h; Claremont Avenue then Alcatraz Avenue 5 veh/h; Claremont Avenue 3 veh/h.

### Study area, all residential and service streets

Model: 399 through cars per hour.

Model through cars by origin and destination group (largest 12 of 57 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 54.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 42.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 35.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 35.0 | Claremont Avenue then Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Ashby Ave from the west (Emeryville and I-80) | 19.0 | Claremont Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 18.0 | SR-24 |
| Telegraph Ave from the north (Berkeley) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 17.0 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 16.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 14.0 | SR-24 then Claremont Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 12.0 | Claremont Avenue then SR-24 |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Emeryville and West Oakland streets (55th to 67th Streets) | 11.0 | Claremont Avenue |
| Shattuck Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 9.0 | none near the study area |
| other pairs | | 117.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 194 veh/h; Claremont Avenue 52 veh/h; Claremont Avenue then Telegraph Avenue 35 veh/h; SR-24 29 veh/h; SR-24 then Claremont Avenue 14 veh/h; none near the study area 14 veh/h.

By origin group: Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 100; SR-24 eastbound off-ramps (arriving from Oakland and I-980) 80; South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 77; Telegraph Ave from the north (Berkeley) 34; Telegraph Ave to the south (downtown Oakland) 26; Claremont Ave and Tunnel Rd toward the hills 18; College Ave from the north (Berkeley) 12; West Oakland to the southwest (Adeline St, Market St) 10; Shattuck Ave from the north (Berkeley) 9; San Pablo Ave (Emeryville and West Oakland) 7.

By destination group: SR-24 westbound on-ramps (toward Oakland and I-980) 85; South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 74; Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 67; Telegraph Ave from the north (Berkeley) 58; Claremont Ave and Tunnel Rd toward the hills 31; Ashby Ave from the west (Emeryville and I-80) 20; Emeryville and West Oakland streets (55th to 67th Streets) 19; San Pablo Ave (Emeryville and West Oakland) 12; College Ave from the north (Berkeley) 11; Alcatraz Ave from the west (Emeryville side) 6.


## Through cars by intent (cut-through intent view)

A through car is tallied once, under the first intent that fits it (the on-ramp on its planned route, the off-ramp it has driven, or the origin and destination groups of its trip), at the moment the through count counts it. Cars an hour over the run, the same window as the through-car figure (399 an hour).

| Intent | Basis | Cars an hour | Share |
| --- | --- | --- | --- |
| on-2853241697 | observed | 84 | 21% |
| Other on-ramps | assumed | 7 | 2% |
| off-52990846 | observed | 80 | 20% |
| Other off-ramps | assumed | 6 | 2% |
| Downtown, south and west Oakland traffic using side streets to reach Berkeley and Telegraph Ave north | assumed | 66 | 17% |
| Berkeley and Telegraph Ave north traffic using side streets to reach downtown, south and west Oakland | assumed | 74 | 19% |
| Oakland cross-town traffic (West Oakland, Broadway, Piedmont, Emeryville) using side streets near Claremont Ave and Telegraph Ave | assumed | 45 | 11% |
| Other (no intent listed) |  | 37 | 9% |

Intents listed cover 91% of through cars.


## Select-link shares: modeled vs observed (design D5: headline = freeway shares, tolerance +/-10 pp)

- Hillegass Avenue NB: 4 links (path Claremont Avenue -> Alcatraz Avenue (434 m)), 129 trips (119 completed)
- Colby Street NB: 8 links (path Claremont Avenue -> Alcatraz Avenue (680 m)), 162 trips (156 completed)
- Hillegass Avenue SB: 4 links (path Alcatraz Avenue -> Claremont Avenue (433 m)), 121 trips (115 completed)
- Colby Street SB: 8 links (path Alcatraz Avenue -> Claremont Avenue (680 m)), 182 trips (171 completed)

| Block | Side | Via | Observed | Modeled | Diff (pp) | n trips | Headline |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue NB | from | freeway | 47% | 60% | +13 | 129 | OUTSIDE |
| Hillegass Avenue NB | to | Benvenue Avenue | 21% (PM 33%) | 9% | -12 | 129 |  |
| Hillegass Avenue NB | to | College Avenue | 6% | 16% | +10 | 129 |  |
| Hillegass Avenue NB | to | Alcatraz Avenue WB | 27% | 33% | +6 | 129 |  |
| Colby Street NB | from | freeway | 47% | 49% | +2 | 162 | within |
| Colby Street NB | to | Alcatraz Avenue WB | 48% | 39% | -9 | 162 |  |
| Colby Street NB | to | Telegraph Avenue | 25% | 41% | +16 | 162 |  |
| Colby Street NB | to | College Avenue | 3% | 4% | +1 | 162 |  |
| Hillegass Avenue SB | from | Alcatraz Avenue WB | 46% | 22% | -24 | 121 |  |
| Hillegass Avenue SB | from | Benvenue Avenue | 26% | 5% | -21 | 121 |  |
| Hillegass Avenue SB | from | College Avenue | 16% | 10% | -6 | 121 |  |
| Hillegass Avenue SB | to | freeway | 57% (PM 68%) | 53% | -4 | 121 | within |
| Colby Street SB | from | Alcatraz Avenue EB | 43% | 16% | -27 | 182 |  |
| Colby Street SB | from | Alcatraz Avenue WB | 46% | 20% | -26 | 182 |  |
| Colby Street SB | from | Telegraph Avenue | 22% | 15% | -7 | 182 |  |
| Colby Street SB | to | freeway | 45% | 35% | -10 | 182 | within |
| Colby Street SB | to | Forest Street | 34% | 29% | -5 | 182 |  |

Headline shares within tolerance: 3 of 4. Observed column uses the PM-peak share where one is given and the period is pm_peak. 'Via' shares are the fraction of select-link trips using that street before (from) or after (to) the block; freeway = origin / destination gate with a motorway-class link attached.

## Claremont ramps: streets used before the on-ramp / after the off-ramp

Observed shares are for traffic from/to the north only. 'Modeled' is over all trips on the ramps and any visit to the street (an upper bound for streets that serve both sides). 'Modeled, side' counts only trips whose surface end lies on the side of the ramp stated in the targets file (`freewayRamp.side`), and for a street with a qualifier ("north of X") only its links on that side of X.

| Direction | Via | Observed | Modeled | n ramp trips | Modeled, side | n side trips |
| --- | --- | --- | --- | --- | --- | --- |
| onto freeway | College Avenue | 16% | 16% | 607 | 20% | 469 |
| onto freeway | Hillegass Avenue | 12% | 13% | 607 | 17% | 469 |
| onto freeway | Martin Street | 10% | 11% | 607 | 14% | 469 |
| onto freeway | Colby Street | 8% | 10% | 607 | 12% | 469 |
| onto freeway | Telegraph Avenue north of Alcatraz Avenue | 8% | 8% | 607 | 7% | 469 |
| onto freeway | Benvenue Avenue | 5% | 6% | 607 | 8% | 469 |
| from freeway | College Avenue | 10% | 10% | 669 | 11% | 645 |
| from freeway | Martin Street | 10% | 12% | 669 | 13% | 645 |
| from freeway | Colby Street | 8% | 10% | 669 | 10% | 645 |
| from freeway | Hillegass Avenue | 5% | 10% | 669 | 10% | 645 |
| from freeway | Benvenue Avenue | 3% | 2% | 669 | 2% | 645 |

## Top 15 links by delay

| Link | Street | Class | Lanes | Len (m) | End node control | Delay (veh-h) | Stopped (veh-h) | Mean stopped veh | Flow (veh/h) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 4175 | (unnamed) | Motorway | 2 | 142 | uncontrolled | 15.64 | 2.81 | 2.8 | 1526 |
| 3395 | Ashby Avenue | Primary | 1 | 129 | signal | 8.06 | 6.55 | 6.5 | 404 |
| 3434 | Claremont Avenue | Secondary | 1 | 93 | all_way_stop | 7.62 | 5.07 | 5.1 | 406 |
| 1666 | 52nd Street | Secondary | 4 | 39 | signal | 7.47 | 6.61 | 6.6 | 803 |
| 2037 | Alcatraz Avenue | Tertiary | 1 | 202 | uncontrolled | 7.06 | 5.01 | 5.0 | 566 |
| 460 | Sacramento Street | Tertiary | 2 | 104 | two_way_stop | 6.90 | 5.77 | 5.8 | 426 |
| 2998 | College Avenue | Tertiary | 1 | 161 | signal | 6.82 | 5.67 | 5.7 | 362 |
| 834 | Martin Luther King Junior Way | Secondary | 4 | 49 | signal | 6.72 | 4.93 | 4.9 | 1276 |
| 1049 | Adeline Street | Secondary | 4 | 43 | signal | 6.29 | 5.36 | 5.4 | 884 |
| 755 | Market Street | Tertiary | 2 | 77 | signal | 5.68 | 4.62 | 4.6 | 612 |
| 1662 | 52nd Street | Secondary | 4 | 53 | signal | 5.60 | 4.10 | 4.1 | 1157 |
| 1051 | Adeline Street | Secondary | 4 | 50 | signal | 5.55 | 4.91 | 4.9 | 708 |
| 3344 | Domingo Avenue | Residential | 1 | 110 | signal | 5.33 | 4.07 | 4.1 | 356 |
| 4398 | Ashby Avenue | Primary | 2 | 96 | uncontrolled | 5.13 | 3.66 | 3.7 | 778 |
| 3432 | Claremont Avenue | Secondary | 1 | 82 | two_way_stop | 5.09 | 4.68 | 4.7 | 72 |

## Top 15 nodes by blocked time

Blocked time = lane-head seconds waiting at the stop line without permission (signal red, conflict, stop sign or no downstream space).

| Node | Streets | Control | Gate | Blocked (lane-h) | of which no downstream space | Signal plan at end (cycle: greens) |
| --- | --- | --- | --- | --- | --- | --- |
| 447 | Adeline Street / Alcatraz Avenue | signal |  | 5.24 | 0.09 | 75 s: 23/42 |
| 680 | 52nd Street / Shattuck Avenue | signal |  | 5.13 | 0.10 | 90 s: 18/19/37 |
| 446 | Market Street / Stanford Avenue | signal |  | 4.10 | 0.15 | 75 s: 25/40 |
| 1406 | Ashby Avenue / Claremont Avenue | signal |  | 3.98 | 0.23 | 75 s: 23/21/17 |
| 331 | 52nd Street / Martin Luther King Junior Way | signal |  | 3.85 | 0.03 | 75 s: 37/28 |
| 30 | 57th Street / Adeline Street / Market Street | signal |  | 3.63 | 0.03 | 75 s: 15/22/23 |
| 332 | 55th Street / Martin Luther King Junior Way | signal |  | 3.43 | 0.05 | 75 s: 30/35 |
| 242 | Ashby Avenue / Martin Luther King Junior Way | signal |  | 2.99 | 0.00 | 75 s: 40/25 |
| 851 | Alcatraz Avenue / Telegraph Avenue | signal |  | 2.88 | 0.06 | 75 s: 41/24 |
| 713 | 51st Street / Telegraph Avenue | signal |  | 2.83 | 0.02 | 75 s: 31/34 |
| 1220 | Ashby Avenue / College Avenue | signal |  | 2.77 | 0.08 | 75 s: 41/24 |
| 501 | Alcatraz Avenue / Shattuck Avenue | signal |  | 2.75 | 0.06 | 75 s: 38/27 |
| 944 | Ashby Avenue / Shattuck Avenue | signal |  | 2.65 | 0.03 | 75 s: 40/25 |
| 37 | San Pablo Avenue / Stanford Avenue | signal |  | 2.63 | 0.01 | 75 s: 22/43 |
| 479 | Adeline Street / Martin Luther King Junior Way / Stanford Avenue | signal |  | 2.59 | 0.02 | 75 s: 50/15 |

Phases of the five most blocked signals (green s: approach links with their lanes, link ids in brackets):

- node 447: 23 s: Adeline Street 4L [1049], Adeline Street 4L [1051]; 42 s: Alcatraz Avenue 2L [1048], Alcatraz Avenue 2L [1133]
- node 680: 18 s: 52nd Street 4L [1662]; 19 s: 52nd Street 4L [1666], 52nd Street 4L [1662]; 37 s: Shattuck Avenue 2L [1653], Shattuck Avenue 2L [1705]
- node 446: 25 s: Stanford Avenue 3L [941], Stanford Avenue 3L [1055]; 40 s: Market Street 4L [1108], Market Street 3L [1111]
- node 1406: 23 s: Ashby Avenue 1L [3395], Ashby Avenue 2L [3426]; 21 s: Claremont Avenue 2L [4329]; 17 s: Claremont Avenue 3L [3447]
- node 331: 37 s: Martin Luther King Junior Way 4L [704], Martin Luther King Junior Way 4L [761]; 28 s: 52nd Street 2L [758], 52nd Street 1L [760]

## Cars cleared from gridlock near and far (judged zone)

Judged zone: the study area, its bounding streets and the junctions on them, plus nodes within 200 m of it along the network (111 nodes, 329 links). A far clearing counts against the stability rule when its blocking chain (vehicles held at least 60 s by a full exit, at the 5 s snapshot before it) reaches a link in the zone.

| Buffer (m) | Near | Far | Far, chain reaches the zone | Judged |
| --- | --- | --- | --- | --- |
| 100.0 | 0 | 0 | 0 | 0 |
| 200.0 | 0 | 0 | 0 | 0 |
| 400.0 | 0 | 0 | 0 | 0 |

Entry backlog at the end of the run: 0 trips waiting at origins in the zone, of 72 in all.

| Bounding street | Links | Longest standing queue on one link (m) | Link (length m) | At (min) | Share of samples with a link full |
| --- | --- | --- | --- | --- | --- |
| Telegraph Avenue | 28 | 62.0 | 1604 (94.0) | 43.3 | 0.0 |
| Alcatraz Avenue | 14 | 85.0 | 4188 (143.0) | 24.8 | 0.0 |
| College Avenue | 6 | 59.0 | 2805 (102.0) | 32.9 | 0.0 |
| Claremont Avenue | 13 | 46.0 | 2776 (161.0) | 53.3 | 0.0 |
| CA 24 | 3 | 33.0 | 1945 (188.0) | 16.5 | 0.0 |

## Junction recovery

Policy `physical`. Node entries by cars and cyclists in the run: 701056 (settle interval 0). An admission is an entry the ordinary rule would have refused; head-seconds count the time a waiting head vehicle had the reason invoked, and the part of it in which it still could not enter. Courtesy and the yield fallback change priority only; under `physical` the conflict bypass never admits.

| Reason | Admissions per hour | Per 1,000 entries | Head-s invoked | Head-s blocked |
| --- | --- | --- | --- | --- |
| courtesy | 135.0 | 0.193 | 614 | 570 |
| yield fallback | 51.0 | 0.073 | 14 | 0 |
| conflict bypass | 0.0 | 0.000 | 12 | 12 |

Vehicles removed while held in a node by a full exit: 0 (0.0 per hour, included in the gridlock removals).

| Node | Streets | Control | Courtesy | Yield fallback | Conflict bypass | Held removals |
| --- | --- | --- | --- | --- | --- | --- |
| 1429 | Claremont Avenue / Claremont Boulevard | two_way_stop | 36 | 2 | 0 | 0 |
| 147 | 59th Street / Grace Avenue / Los Angeles Street | two_way_stop | 6 | 1 | 0 | 0 |
| 766 | 57th Street / Shattuck Avenue | two_way_stop | 1 | 6 | 0 | 0 |
| 1405 | Claremont Boulevard / Russell Street | two_way_stop | 7 | 0 | 0 | 0 |
| 342 | 56th Street / Shattuck Avenue | two_way_stop | 2 | 4 | 0 | 0 |
| 727 | 52nd Street | uncontrolled | 6 | 0 | 0 | 0 |
| 1216 | College Avenue / Woolsey Street | two_way_stop | 5 | 1 | 0 | 0 |
| 171 | Acton Street / Ashby Avenue | two_way_stop | 5 | 0 | 0 | 0 |
| 430 | Alcatraz Avenue / King Street | two_way_stop | 1 | 4 | 0 | 0 |
| 457 | Alcatraz Avenue / California Street | two_way_stop | 3 | 2 | 0 | 0 |

## Entry backlog by origin node at end of run (top 10)

| Node | Streets | Trips waiting | Offered veh/h (before scale) |
| --- | --- | --- | --- |
| 1756 | Claremont Avenue | 63 | 487 |
| 1385 | Oak Ridge Road / Tunnel Road | 4 | 17 |
| 1430 | Claremont Avenue / Russell Street | 2 | 17 |
| 309 | 56th Street / Martin Luther King Junior Way | 1 | 23 |
| 602 | Grove Shafter Freeway | 1 | 3657 |
| 695 | 51st Street / Shafter Avenue | 1 | 25 |

## Flow on key streets (veh/h per direction, study-area links of 40 m or more)

| Street | Direction of travel | Links | Median flow | Max flow |
| --- | --- | --- | --- | --- |
| Telegraph | N | 12 | 844 | 872 |
| Telegraph | S | 10 | 858 | 940 |
| College | N | 3 | 222 | 222 |
| College | S | 3 | 382 | 385 |
| Claremont | N | 6 | 446 | 778 |
| Claremont | S | 7 | 448 | 710 |
| Alcatraz | E | 6 | 478 | 502 |
| Alcatraz | W | 6 | 425 | 464 |
| Hillegass | N | 4 | 84 | 85 |
| Hillegass | S | 4 | 80 | 82 |
| Colby | N | 7 | 106 | 116 |
| Colby | S | 7 | 104 | 131 |
| Martin | E | 2 | 89 | 89 |
| Martin | W | 2 | 125 | 125 |

## Largest demand origins (offered, before scale)

| Node | Streets | Veh/h |
| --- | --- | --- |
| 602 | Grove Shafter Freeway | 3657 |
| 265 | Ashby Avenue | 1215 |
| 943 | Telegraph Avenue / Ward Street | 925 |
| 183 | San Pablo Avenue | 823 |
| 1672 | Warren Freeway | 821 |
| 763 | Telegraph Avenue | 684 |
| 971 | Pleasant Valley Avenue | 553 |
| 1756 | Claremont Avenue | 487 |
| 275 | Market Street | 460 |
| 974 | Broadway | 405 |
