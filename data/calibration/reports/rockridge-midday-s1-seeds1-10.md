# rockridge-midday-s1 over 10 seeds (1, 2, 3, 4, 5, 6, 7, 8, 9, 10)

Seeds are the fixed list above, none chosen; each run is 60 minutes from the same start. Interval = 95% interval of the mean (Student t, n - 1 degrees of freedom). Run-to-run noise only: demand is fixed, so day-to-day variation is not in these intervals.

## Stability rule (design decision D16)

| Check | Rule | Result | Pass |
| --- | --- | --- | --- |
| Removals | mean per hour below 1.00 | 0.00 (min 0.00, max 0.00) | yes |
| Entry backlog | below 2.0% in at least 90% of seeds | 10 of 10 seeds | yes |
| Runaway growth | no seed adds more than 2.0 points of backlog in the second half | none | yes |
| Arterial speed | mean above 4.0 m/s | 9.95 m/s | yes |

**Verdict: stable.** Old rule (zero removals, backlog under 2%, speed above 4 m/s, every seed): 10 of 10 seeds pass.

## Metrics over seeds

| Group | Metric | Unit | Mean | SD | Min | Max | 95% interval |
| --- | --- | --- | --- | --- | --- | --- | --- |
| health | gridlock removals | vehicles | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| health | gridlock removals per hour | veh/h | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| health | entry backlog | % of spawned | 0.01 | 0.01 | 0.00 | 0.02 | 0.00 to 0.01 |
| health | backlog growth in the second half of the run | points of spawned | 0.00 | 0.01 | -0.01 | 0.01 | -0.00 to 0.01 |
| health | completed trips | trips | 16694.40 | 167.45 | 16530.00 | 16987.00 | 16574.62 to 16814.18 |
| health | arterial mean speed | m/s | 9.95 | 0.03 | 9.89 | 10.00 | 9.93 to 9.98 |
| health | arterial mean speed, last 15 min | m/s | 9.99 | 0.08 | 9.88 | 10.14 | 9.93 to 10.05 |
| junction recovery | courtesy admissions per hour | veh/h | 46.50 | 8.61 | 31.00 | 60.00 | 40.34 to 52.66 |
| junction recovery | yield fallback admissions per hour | veh/h | 8.10 | 3.07 | 5.00 | 15.00 | 5.90 to 10.30 |
| junction recovery | conflict bypass admissions per hour | veh/h | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| junction recovery | vehicles removed while held in a node, per hour | veh/h | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| cut-through | local vehicle-miles, surface gates to the freeway | veh-miles | 26.27 | 4.19 | 20.07 | 33.23 | 23.28 to 29.27 |
| cut-through | share of local vehicle-miles, surface gates to the freeway | % | 9.5 | 1.4 | 7.8 | 12.2 | 8.5 to 10.5 |
| cut-through | local vehicle-miles, freeway to the surface gates | veh-miles | 23.78 | 3.10 | 19.64 | 28.48 | 21.57 to 26.00 |
| cut-through | share of local vehicle-miles, freeway to the surface gates | % | 8.6 | 1.0 | 7.6 | 10.1 | 7.9 to 9.4 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue N | trips | 27.90 | 4.43 | 21.00 | 34.00 | 24.73 to 31.07 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue N | trips | 886.90 | 19.12 | 850.00 | 907.00 | 873.23 to 900.57 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue S | trips | 41.00 | 7.53 | 32.00 | 58.00 | 35.62 to 46.38 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue S | trips | 956.80 | 29.44 | 913.00 | 993.00 | 935.74 to 977.86 |
| headline share | Hillegass Avenue NB from freeway | % | 53.4 | 4.1 | 47.6 | 59.6 | 50.4 to 56.3 |
| share | Hillegass Avenue NB to Benvenue Avenue | % | 3.4 | 1.6 | 1.2 | 5.8 | 2.2 to 4.5 |
| share | Hillegass Avenue NB to College Avenue | % | 17.0 | 1.7 | 14.4 | 20.0 | 15.8 to 18.2 |
| share | Hillegass Avenue NB to Alcatraz Avenue WB | % | 29.5 | 4.1 | 23.1 | 35.9 | 26.6 to 32.5 |
| headline share | Colby Street NB from freeway | % | 37.3 | 3.0 | 32.8 | 41.5 | 35.2 to 39.4 |
| share | Colby Street NB to Alcatraz Avenue WB | % | 48.2 | 3.0 | 43.1 | 52.4 | 46.1 to 50.4 |
| share | Colby Street NB to Telegraph Avenue | % | 35.0 | 3.2 | 30.4 | 41.1 | 32.8 to 37.3 |
| share | Colby Street NB to College Avenue | % | 7.4 | 2.1 | 4.7 | 11.6 | 5.9 to 8.9 |
| share | Hillegass Avenue SB from Alcatraz Avenue WB | % | 30.4 | 5.3 | 21.6 | 39.0 | 26.6 to 34.2 |
| share | Hillegass Avenue SB from Benvenue Avenue | % | 5.3 | 2.6 | 0.9 | 9.0 | 3.5 to 7.2 |
| share | Hillegass Avenue SB from College Avenue | % | 16.0 | 4.3 | 7.8 | 21.4 | 12.9 to 19.0 |
| headline share | Hillegass Avenue SB to freeway | % | 60.7 | 3.9 | 52.8 | 66.2 | 57.9 to 63.5 |
| share | Colby Street SB from Alcatraz Avenue EB | % | 20.6 | 3.0 | 16.0 | 26.1 | 18.4 to 22.7 |
| share | Colby Street SB from Alcatraz Avenue WB | % | 21.5 | 3.1 | 17.4 | 25.5 | 19.3 to 23.7 |
| share | Colby Street SB from Telegraph Avenue | % | 19.2 | 2.5 | 14.6 | 22.5 | 17.4 to 21.0 |
| headline share | Colby Street SB to freeway | % | 43.7 | 3.9 | 40.1 | 51.6 | 40.9 to 46.5 |
| share | Colby Street SB to Forest Street | % | 15.0 | 4.0 | 7.5 | 19.3 | 12.1 to 17.9 |
| ramp share | onto freeway via College Avenue | % | 12.2 | 0.8 | 10.3 | 13.0 | 11.6 to 12.8 |
| ramp share | onto freeway via Hillegass Avenue | % | 14.4 | 1.4 | 12.6 | 17.8 | 13.4 to 15.4 |
| ramp share | onto freeway via Martin Street | % | 13.2 | 2.0 | 10.5 | 17.5 | 11.8 to 14.6 |
| ramp share | onto freeway via Colby Street | % | 13.3 | 2.7 | 10.0 | 18.8 | 11.3 to 15.2 |
| ramp share | onto freeway via Telegraph Avenue north of Alcatraz Avenue | % | 8.9 | 1.2 | 7.3 | 10.8 | 8.1 to 9.8 |
| ramp share | onto freeway via Benvenue Avenue | % | 5.2 | 1.0 | 3.4 | 6.7 | 4.4 to 5.9 |
| ramp share | from freeway via College Avenue | % | 9.8 | 1.2 | 8.1 | 11.5 | 9.0 to 10.7 |
| ramp share | from freeway via Martin Street | % | 11.2 | 1.7 | 8.2 | 13.5 | 10.0 to 12.4 |
| ramp share | from freeway via Colby Street | % | 11.4 | 1.5 | 9.2 | 13.7 | 10.3 to 12.4 |
| ramp share | from freeway via Hillegass Avenue | % | 8.7 | 1.2 | 6.6 | 10.6 | 7.8 to 9.5 |
| ramp share | from freeway via Benvenue Avenue | % | 2.7 | 0.7 | 1.5 | 3.7 | 2.3 to 3.2 |
| corridor flow | Telegraph N median link flow | veh/h | 538.08 | 27.58 | 489.60 | 578.40 | 518.35 to 557.81 |
| corridor flow | Telegraph S median link flow | veh/h | 509.04 | 17.90 | 483.60 | 541.20 | 496.23 to 521.85 |
| corridor flow | College N median link flow | veh/h | 224.16 | 23.76 | 207.60 | 278.40 | 207.16 to 241.16 |
| corridor flow | College S median link flow | veh/h | 357.60 | 19.00 | 334.80 | 394.80 | 344.01 to 371.19 |
| corridor flow | Claremont N median link flow | veh/h | 272.64 | 20.64 | 241.20 | 309.60 | 257.87 to 287.41 |
| corridor flow | Claremont S median link flow | veh/h | 175.80 | 34.03 | 124.80 | 220.80 | 151.46 to 200.14 |
| corridor flow | Alcatraz E median link flow | veh/h | 383.40 | 16.71 | 356.40 | 408.00 | 371.45 to 395.35 |
| corridor flow | Alcatraz W median link flow | veh/h | 234.48 | 17.73 | 208.80 | 264.00 | 221.80 to 247.16 |
| corridor flow | Hillegass N median link flow | veh/h | 80.04 | 9.09 | 69.60 | 94.80 | 73.54 to 86.54 |
| corridor flow | Hillegass S median link flow | veh/h | 76.44 | 8.37 | 63.60 | 94.80 | 70.45 to 82.43 |
| corridor flow | Colby N median link flow | veh/h | 100.08 | 9.83 | 86.40 | 121.20 | 93.05 to 107.11 |
| corridor flow | Colby S median link flow | veh/h | 83.64 | 11.72 | 69.60 | 105.60 | 75.26 to 92.02 |
| corridor flow | Martin E median link flow | veh/h | 103.08 | 12.98 | 90.00 | 127.20 | 93.80 to 112.36 |
| corridor flow | Martin W median link flow | veh/h | 75.72 | 7.89 | 60.00 | 87.60 | 70.08 to 81.36 |

## Intent map: through cars by where they come from and where they are going

Through = neither trip end is in the study area. Groups are the approach groups of the area config (data/areas); a node that is not a gate takes the group of the nearest surface gate (ASSUMPTION). The arterial is the one a trip would use on the shortest free-flow path with the study area's residential and service streets closed, where that path runs on a boundary street near the study area.

Model figures are the mean of 10 seed(s), per hour of the run. Basis: OBSERVED = read from the resident volunteer count of Feb 25, 2025 or its headline shares; ASSUMPTION = inferred from those numbers or chosen.

### Colby Street NB

Observed (PM): 182 cars entered at the south end, 102 drove the whole street, 164 left it at Alcatraz Ave (131 left, 32 right, 1 straight), and 47% of the block's trips came from a freeway (the headline share). ASSUMPTION: freeway-origin cars that do not end along the street are 65 veh/h (the 82 freeway-origin trips on the block, 47% of 174, times the 182 / (182 + 47) of its cars that entered at the south end rather than joining on the way), spread over the 164 exits in proportion (0.40); the other through cars come from the Telegraph Ave and south-side approaches that feed the street's south end. Ranges: low = 131 (32) x 0.47 x 0.62 (the whole-street share of exits), high = 131 (32) x 0.47.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | OBSERVED turn count x ASSUMPTION share (131 left turns x 0.40) | 52 (38 to 62) | 41 | within |
| Telegraph Ave and south-side traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | ASSUMPTION: the through left-turners (131 x 0.62 = 81) that are not off-ramp traffic | 29 (19 to 43) | 15 | below |
| SR-24 off-ramp traffic using Colby St to reach College Ave and Berkeley (right at Alcatraz Ave) | OBSERVED turn count x ASSUMPTION share (32 right turns x 0.40) | 13 (9 to 15) | 7 | below |
| Telegraph Ave and south-side traffic using Colby St to reach College Ave and Berkeley | ASSUMPTION: the through right-turners (32 x 0.62 = 20) that are not off-ramp traffic | 7 (5 to 11) | 9 | within |
| Intents listed, together | | 101 (71 to 131) | 71 | |
| Other through cars (no intent listed) | | | 4 | |

Model through cars by origin and destination group (largest 12 of 30 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 40.6 | Telegraph Avenue |
| Telegraph Ave to the south (downtown Oakland) | Telegraph Ave from the north (Berkeley) | 6.3 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Ashby Ave from the west (Emeryville and I-80) | 5.5 | none near the study area |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 5.1 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 3.9 | SR-24 then Claremont Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 1.6 | SR-24 |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | College Ave from the north (Berkeley) | 1.5 | SR-24 then Claremont Avenue then College Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Telegraph Ave from the north (Berkeley) | 1.4 | Telegraph Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Claremont Ave and Tunnel Rd toward the hills | 1.3 | Alcatraz Avenue then Claremont Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Alcatraz Ave from the west (Emeryville side) | 1.0 | College Avenue then Alcatraz Avenue |
| San Pablo Ave (Emeryville and West Oakland) | Claremont Ave and Tunnel Rd toward the hills | 0.8 | Alcatraz Avenue then Claremont Avenue |
| San Pablo Ave (Emeryville and West Oakland) | College Ave from the north (Berkeley) | 0.7 | Claremont Avenue then College Avenue |
| other pairs | | 5.3 | |

By the arterial these cars would otherwise use: Telegraph Avenue 55 veh/h; none near the study area 6 veh/h; SR-24 then Claremont Avenue 4 veh/h; Alcatraz Avenue then Claremont Avenue 2 veh/h; College Avenue then Alcatraz Avenue 2 veh/h; SR-24 2 veh/h.

### Hillegass Avenue NB

Observed (PM): 94 cars entered at the south end, 48 drove the whole street, 109 left it at Alcatraz Ave (43 west, 54 east, 12 straight), and 47% of the block's trips came from a freeway. ASSUMPTION: freeway-origin through cars are 40 veh/h (52 freeway-origin trips times 94 / (94 + 29)), spread over the exits in proportion (0.37); the through share of exits is 48 / 109 = 0.44.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Hillegass Ave to reach Alcatraz Ave west and Telegraph Ave north | OBSERVED turn count x ASSUMPTION share (43 left turns x 0.37) | 16 (9 to 20) | 16 | within |
| SR-24 off-ramp traffic using Hillegass Ave to reach College Ave and Berkeley | OBSERVED turn count x ASSUMPTION share (54 right turns x 0.37) | 20 (11 to 25) | 25 | within |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach Alcatraz Ave west | ASSUMPTION: through exits (43 x 0.44) that are not off-ramp traffic | 3 (0 to 10) | 5 | within |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach College Ave and Berkeley | ASSUMPTION: through exits (54 x 0.44) that are not off-ramp traffic | 4 (0 to 13) | 7 | within |
| Intents listed, together | | 43 (20 to 68) | 52 | |
| Other through cars (no intent listed) | | | 4 | |

Model through cars by origin and destination group (largest 12 of 41 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 13.0 | SR-24 |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 12.8 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | College Ave from the north (Berkeley) | 4.9 | SR-24 then Claremont Avenue then College Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 4.3 | SR-24 then Claremont Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 2.5 | Telegraph Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 2.1 | Claremont Avenue then Alcatraz Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Alcatraz Ave from the west (Emeryville side) | 2.0 | College Avenue then Alcatraz Avenue |
| College Ave from the north (Berkeley) | Alcatraz Ave from the west (Emeryville side) | 1.5 | College Avenue then Alcatraz Avenue |
| Telegraph Ave to the south (downtown Oakland) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 1.4 | Telegraph Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | San Pablo Ave (Emeryville and West Oakland) | 1.2 | SR-24 |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Ashby Ave from the west (Emeryville and I-80) | 1.0 | SR-24 then Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Ashby Ave from the west (Emeryville and I-80) | 0.8 | none near the study area |
| other pairs | | 8.8 | |

By the arterial these cars would otherwise use: Telegraph Avenue 18 veh/h; SR-24 14 veh/h; SR-24 then Claremont Avenue then College Avenue 5 veh/h; SR-24 then Claremont Avenue 4 veh/h; College Avenue then Alcatraz Avenue 4 veh/h; Claremont Avenue 2 veh/h.

### Hillegass Avenue SB

Observed (PM): 178 cars entered at the top (76 turned in from Alcatraz Ave west, 98 from the east, 4 came straight from the north), 79 drove the whole street, and 68% of the block's trips (109 veh/h) went to a freeway. ASSUMPTION: freeway-bound cars that did not join mid-street are 87 veh/h (109 x 178 / (178 + 44)), half of the 174 turn-ins; low = the whole-street share of the turn-ins (0.45), high = the freeway-bound share without the mid-street correction (0.63).

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Telegraph Ave, Alcatraz Ave west and West Berkeley traffic turning off Alcatraz Ave onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (76 turn-ins x 0.50) | 38 (34 to 48) | 25 | below |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (98 turn-ins x 0.50) | 49 (44 to 62) | 33 | below |
| Intents listed, together | | 87 (78 to 110) | 58 | |
| Other through cars (no intent listed) | | | 13 | |

Model through cars by origin and destination group (largest 12 of 25 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 25.0 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 15.7 | Claremont Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 9.8 | Claremont Avenue then SR-24 |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 6.9 | College Avenue then Claremont Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 3.5 | Telegraph Avenue |
| Emeryville and West Oakland streets (55th to 67th Streets) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 2.1 | Alcatraz Avenue then Claremont Avenue |
| Emeryville and West Oakland streets (55th to 67th Streets) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 1.9 | Claremont Avenue |
| Emeryville and West Oakland streets (55th to 67th Streets) | College Ave from the north (Berkeley) | 0.8 | Claremont Avenue then College Avenue |
| Shattuck Ave from the north (Berkeley) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 0.7 | College Avenue |
| West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 0.6 | Claremont Avenue |
| West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) | College Ave from the north (Berkeley) | 0.6 | College Avenue |
| San Pablo Ave (Emeryville and West Oakland) | College Ave from the north (Berkeley) | 0.6 | Claremont Avenue then College Avenue |
| other pairs | | 2.7 | |

By the arterial these cars would otherwise use: Telegraph Avenue 28 veh/h; Claremont Avenue then SR-24 26 veh/h; College Avenue then Claremont Avenue then SR-24 7 veh/h; Claremont Avenue 4 veh/h; Alcatraz Avenue then Claremont Avenue 3 veh/h; Claremont Avenue then College Avenue 1 veh/h.

### Colby Street SB

Observed (PM): 139 cars entered at the top (76 from Alcatraz Ave west, 50 from the east, 13 from the north), 39 drove the whole street, 45% of the block's trips (72 veh/h) went to a freeway and 22% came by way of Telegraph Ave. ASSUMPTION: freeway-bound cars that did not join mid-street are 46 veh/h (72 x 139 / (139 + 79)), 0.365 of the 126 turn-ins; low = the whole-street share (0.31), high = the unadjusted freeway share (0.57). The Telegraph Ave cars are the 22% x 160 = 35 of the 76 west turn-ins.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Southbound Telegraph Ave traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (35 Telegraph Ave cars x 0.365) | 13 (11 to 20) | 12 | within |
| Alcatraz Ave west, Ashby Ave and West Berkeley traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (41 other west turn-ins x 0.365) | 15 (13 to 23) | 9 | below |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (50 east turn-ins x 0.365) | 18 (15 to 29) | 30 | above |
| Intents listed, together | | 46 (39 to 72) | 51 | |
| Other through cars (no intent listed) | | | 37 | |

Model through cars by origin and destination group (largest 12 of 42 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 15.6 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 13.5 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 11.4 | Claremont Avenue then SR-24 |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 10.7 | Telegraph Avenue |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 4.7 | College Avenue then Claremont Avenue then SR-24 |
| Shattuck Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 4.2 | none near the study area |
| Emeryville and West Oakland streets (55th to 67th Streets) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 3.1 | Alcatraz Avenue then Claremont Avenue |
| Emeryville and West Oakland streets (55th to 67th Streets) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 3.1 | Claremont Avenue |
| Claremont Ave and Tunnel Rd toward the hills | Telegraph Ave to the south (downtown Oakland) | 2.0 | Claremont Avenue |
| Ashby Ave from the west (Emeryville and I-80) | SR-13 Warren Freeway (via SR-24 east) | 1.8 | SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Telegraph Ave to the south (downtown Oakland) | 1.4 | College Avenue then Alcatraz Avenue then Telegraph Avenue |
| San Pablo Ave (Emeryville and West Oakland) | Claremont Ave and Tunnel Rd toward the hills | 1.4 | Alcatraz Avenue then Claremont Avenue |
| other pairs | | 14.9 | |

By the arterial these cars would otherwise use: Telegraph Avenue 41 veh/h; Claremont Avenue then SR-24 11 veh/h; Claremont Avenue 8 veh/h; Alcatraz Avenue then Claremont Avenue 6 veh/h; none near the study area 6 veh/h; SR-24 5 veh/h.

### Study area, all residential and service streets

Model: 404 through cars per hour.

Model through cars by origin and destination group (largest 12 of 83 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 52.5 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 49.2 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 36.5 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 29.6 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 21.4 | Claremont Avenue then SR-24 |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 19.1 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 18.0 | Telegraph Avenue |
| Emeryville and West Oakland streets (55th to 67th Streets) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 15.9 | Claremont Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 13.5 | SR-24 |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 9.6 | College Avenue then Claremont Avenue then SR-24 |
| San Pablo Ave (Emeryville and West Oakland) | Claremont Ave and Tunnel Rd toward the hills | 9.4 | Alcatraz Avenue then Claremont Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Ashby Ave from the west (Emeryville and I-80) | 8.5 | none near the study area |
| other pairs | | 120.6 | |

By the arterial these cars would otherwise use: Telegraph Avenue 235 veh/h; Claremont Avenue 30 veh/h; Alcatraz Avenue then Claremont Avenue 25 veh/h; Claremont Avenue then SR-24 21 veh/h; SR-24 21 veh/h; none near the study area 17 veh/h.

By origin group: Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 100; SR-24 eastbound off-ramps (arriving from Oakland and I-980) 88; South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 40; Telegraph Ave from the north (Berkeley) 37; Emeryville and West Oakland streets (55th to 67th Streets) 26; Claremont Ave and Tunnel Rd toward the hills 25; San Pablo Ave (Emeryville and West Oakland) 22; Telegraph Ave to the south (downtown Oakland) 17; West Oakland to the southwest (Adeline St, Market St) 15; College Ave from the north (Berkeley) 12.

By destination group: SR-24 westbound on-ramps (toward Oakland and I-980) 106; South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 79; Telegraph Ave from the north (Berkeley) 62; Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 58; Claremont Ave and Tunnel Rd toward the hills 37; College Ave from the north (Berkeley) 20; Ashby Ave from the west (Emeryville and I-80) 10; Telegraph Ave to the south (downtown Oakland) 7; Alcatraz Ave from the west (Emeryville side) 6; Berkeley hills to the northeast (Evergreen Ln, Gravatt Dr) 5.


Per-seed detail: `rockridge-midday-s1-seed1.md` (seed 1 in full).
