# rockridge-pm_peak-s1 over 10 seeds (1, 2, 3, 4, 5, 6, 7, 8, 9, 10)

Seeds are the fixed list above, none chosen; each run is 60 minutes from the same start. Interval = 95% interval of the mean (Student t, n - 1 degrees of freedom). Run-to-run noise only: demand is fixed, so day-to-day variation is not in these intervals.

## Stability rule (design decision D16)

| Check | Rule | Result | Pass |
| --- | --- | --- | --- |
| Removals | mean per hour below 1.00 | 0.40 (min 0.00, max 1.00) | yes |
| Entry backlog | below 2.0% in at least 90% of seeds | 10 of 10 seeds | yes |
| Runaway growth | no seed adds more than 2.0 points of backlog in the second half | none | yes |
| Arterial speed | mean above 4.0 m/s | 9.33 m/s | yes |

**Verdict: stable.** Old rule (zero removals, backlog under 2%, speed above 4 m/s, every seed): 6 of 10 seeds pass.

## Metrics over seeds

| Group | Metric | Unit | Mean | SD | Min | Max | 95% interval |
| --- | --- | --- | --- | --- | --- | --- | --- |
| health | gridlock removals | vehicles | 0.40 | 0.52 | 0.00 | 1.00 | 0.03 to 0.77 |
| health | gridlock removals per hour | veh/h | 0.40 | 0.52 | 0.00 | 1.00 | 0.03 to 0.77 |
| health | entry backlog | % of spawned | 0.04 | 0.02 | 0.01 | 0.08 | 0.02 to 0.06 |
| health | backlog growth in the second half of the run | points of spawned | 0.00 | 0.03 | -0.03 | 0.05 | -0.02 to 0.02 |
| health | completed trips | trips | 24540.40 | 247.78 | 24144.00 | 24978.00 | 24363.16 to 24717.64 |
| health | arterial mean speed | m/s | 9.33 | 0.07 | 9.19 | 9.44 | 9.28 to 9.38 |
| health | arterial mean speed, last 15 min | m/s | 9.31 | 0.16 | 9.12 | 9.56 | 9.19 to 9.42 |
| cut-through | local vehicle-miles, surface gates to the freeway | veh-miles | 40.53 | 4.67 | 33.26 | 49.46 | 37.19 to 43.86 |
| cut-through | share of local vehicle-miles, surface gates to the freeway | % | 9.1 | 0.8 | 7.9 | 10.2 | 8.5 to 9.6 |
| cut-through | local vehicle-miles, freeway to the surface gates | veh-miles | 30.18 | 3.91 | 25.44 | 38.69 | 27.38 to 32.98 |
| cut-through | share of local vehicle-miles, freeway to the surface gates | % | 6.8 | 0.9 | 5.4 | 8.5 | 6.1 to 7.5 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue N | trips | 36.40 | 3.89 | 31.00 | 43.00 | 33.62 to 39.18 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue N | trips | 1518.10 | 45.80 | 1443.00 | 1578.00 | 1485.34 to 1550.86 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue S | trips | 72.50 | 9.98 | 56.00 | 95.00 | 65.36 to 79.64 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue S | trips | 1448.50 | 30.12 | 1403.00 | 1495.00 | 1426.95 to 1470.05 |
| headline share | Hillegass Avenue NB from freeway | % | 46.8 | 3.2 | 42.2 | 51.0 | 44.5 to 49.0 |
| share | Hillegass Avenue NB to Benvenue Avenue | % | 4.1 | 2.0 | 1.3 | 7.1 | 2.7 to 5.5 |
| share | Hillegass Avenue NB to College Avenue | % | 16.4 | 3.1 | 12.4 | 23.6 | 14.2 to 18.6 |
| share | Hillegass Avenue NB to Alcatraz Avenue WB | % | 29.3 | 3.3 | 25.1 | 36.2 | 26.9 to 31.6 |
| headline share | Colby Street NB from freeway | % | 37.0 | 2.1 | 33.1 | 40.4 | 35.5 to 38.5 |
| share | Colby Street NB to Alcatraz Avenue WB | % | 56.2 | 3.4 | 52.5 | 63.7 | 53.8 to 58.6 |
| share | Colby Street NB to Telegraph Avenue | % | 34.0 | 3.1 | 30.4 | 39.7 | 31.8 to 36.3 |
| share | Colby Street NB to College Avenue | % | 7.0 | 1.8 | 4.0 | 10.1 | 5.7 to 8.2 |
| share | Hillegass Avenue SB from Alcatraz Avenue WB | % | 30.1 | 4.5 | 22.0 | 37.5 | 26.9 to 33.3 |
| share | Hillegass Avenue SB from Benvenue Avenue | % | 4.1 | 1.2 | 2.6 | 6.0 | 3.2 to 4.9 |
| share | Hillegass Avenue SB from College Avenue | % | 16.4 | 2.9 | 12.0 | 20.8 | 14.3 to 18.4 |
| headline share | Hillegass Avenue SB to freeway | % | 61.7 | 3.1 | 54.8 | 67.0 | 59.5 to 63.9 |
| share | Colby Street SB from Alcatraz Avenue EB | % | 24.3 | 3.9 | 18.2 | 29.7 | 21.5 to 27.1 |
| share | Colby Street SB from Alcatraz Avenue WB | % | 15.3 | 2.7 | 9.9 | 19.3 | 13.4 to 17.3 |
| share | Colby Street SB from Telegraph Avenue | % | 20.9 | 3.8 | 13.6 | 26.8 | 18.2 to 23.6 |
| headline share | Colby Street SB to freeway | % | 42.6 | 2.4 | 39.3 | 46.1 | 40.9 to 44.2 |
| share | Colby Street SB to Forest Street | % | 17.6 | 2.5 | 11.8 | 20.3 | 15.8 to 19.3 |
| ramp share | onto freeway via College Avenue | % | 16.1 | 0.9 | 15.0 | 17.7 | 15.4 to 16.8 |
| ramp share | onto freeway via Hillegass Avenue | % | 15.9 | 1.3 | 14.0 | 18.2 | 15.0 to 16.8 |
| ramp share | onto freeway via Martin Street | % | 12.9 | 1.1 | 11.1 | 14.4 | 12.1 to 13.7 |
| ramp share | onto freeway via Colby Street | % | 12.0 | 1.2 | 9.9 | 13.6 | 11.1 to 12.8 |
| ramp share | onto freeway via Telegraph Avenue north of Alcatraz Avenue | % | 12.5 | 1.1 | 10.3 | 14.0 | 11.7 to 13.3 |
| ramp share | onto freeway via Benvenue Avenue | % | 3.8 | 0.9 | 2.1 | 4.9 | 3.2 to 4.4 |
| ramp share | from freeway via College Avenue | % | 9.2 | 1.0 | 7.9 | 10.8 | 8.5 to 9.9 |
| ramp share | from freeway via Martin Street | % | 14.1 | 2.2 | 11.5 | 17.6 | 12.6 to 15.7 |
| ramp share | from freeway via Colby Street | % | 10.3 | 0.8 | 9.2 | 12.0 | 9.7 to 10.9 |
| ramp share | from freeway via Hillegass Avenue | % | 6.2 | 1.4 | 4.3 | 8.8 | 5.2 to 7.2 |
| ramp share | from freeway via Benvenue Avenue | % | 3.0 | 0.8 | 1.7 | 4.0 | 2.4 to 3.6 |
| corridor flow | Telegraph N median link flow | veh/h | 1103.64 | 47.03 | 1036.80 | 1190.40 | 1070.00 to 1137.28 |
| corridor flow | Telegraph S median link flow | veh/h | 788.88 | 54.29 | 696.00 | 871.20 | 750.04 to 827.72 |
| corridor flow | College N median link flow | veh/h | 387.24 | 26.33 | 351.60 | 426.00 | 368.41 to 406.07 |
| corridor flow | College S median link flow | veh/h | 672.72 | 22.57 | 637.20 | 708.00 | 656.58 to 688.86 |
| corridor flow | Claremont N median link flow | veh/h | 376.80 | 35.00 | 343.20 | 430.80 | 351.76 to 401.84 |
| corridor flow | Claremont S median link flow | veh/h | 294.36 | 36.04 | 242.40 | 345.60 | 268.58 to 320.14 |
| corridor flow | Alcatraz E median link flow | veh/h | 553.80 | 36.87 | 482.40 | 603.60 | 527.42 to 580.18 |
| corridor flow | Alcatraz W median link flow | veh/h | 347.40 | 19.19 | 309.60 | 374.40 | 333.67 to 361.13 |
| corridor flow | Hillegass N median link flow | veh/h | 112.56 | 7.11 | 97.20 | 121.20 | 107.48 to 117.64 |
| corridor flow | Hillegass S median link flow | veh/h | 141.72 | 15.32 | 123.60 | 175.20 | 130.76 to 152.68 |
| corridor flow | Colby N median link flow | veh/h | 154.20 | 15.71 | 129.60 | 183.60 | 142.96 to 165.44 |
| corridor flow | Colby S median link flow | veh/h | 149.76 | 16.59 | 128.40 | 188.40 | 137.90 to 161.62 |
| corridor flow | Martin E median link flow | veh/h | 123.72 | 11.70 | 106.80 | 144.00 | 115.35 to 132.09 |
| corridor flow | Martin W median link flow | veh/h | 135.36 | 18.79 | 111.60 | 163.20 | 121.92 to 148.80 |

## Intent map: through cars by where they come from and where they are going

Through = neither trip end is in the study area. Groups are the approach groups of the area config (data/areas); a node that is not a gate takes the group of the nearest surface gate (ASSUMPTION). The arterial is the one a trip would use on the shortest free-flow path with the study area's residential and service streets closed, where that path runs on a boundary street near the study area.

Model figures are the mean of 10 seed(s), per hour of the run. Basis: OBSERVED = read from the resident volunteer count of Feb 25, 2025 or its headline shares; ASSUMPTION = inferred from those numbers or chosen.

### Colby Street NB

Observed: block volume 174 veh/h, whole-street cars 102, so through cars 102 to 145 veh/h. Model: 149 through cars per hour.

Observed (PM): 182 cars entered at the south end, 102 drove the whole street, 164 left it at Alcatraz Ave (131 left, 32 right, 1 straight), and 47% of the block's trips came from a freeway (the headline share). ASSUMPTION: freeway-origin cars that do not end along the street are 65 veh/h (the 82 freeway-origin trips on the block, 47% of 174, times the 182 / (182 + 47) of its cars that entered at the south end rather than joining on the way), spread over the 164 exits in proportion (0.40); the other through cars come from the Telegraph Ave and south-side approaches that feed the street's south end. Ranges: low = 131 (32) x 0.47 x 0.62 (the whole-street share of exits), high = 131 (32) x 0.47.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | OBSERVED turn count x ASSUMPTION share (131 left turns x 0.40) | 52 (38 to 62) | 54 | within |
| Telegraph Ave and south-side traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | ASSUMPTION: the through left-turners (131 x 0.62 = 81) that are not off-ramp traffic | 29 (19 to 43) | 51 | above |
| SR-24 off-ramp traffic using Colby St to reach College Ave and Berkeley (right at Alcatraz Ave) | OBSERVED turn count x ASSUMPTION share (32 right turns x 0.40) | 13 (9 to 15) | 18 | above |
| Telegraph Ave and south-side traffic using Colby St to reach College Ave and Berkeley | ASSUMPTION: the through right-turners (32 x 0.62 = 20) that are not off-ramp traffic | 7 (5 to 11) | 24 | above |
| Intents listed, together | | 101 (71 to 131) | 147 | |
| Other through cars (no intent listed) | | | 2 | |

Model through cars by origin and destination group (largest 12 of 41 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 34.7 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 15.5 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Ashby Ave from the west (Emeryville and I-80) | 11.4 | none near the study area |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 11.1 | Telegraph Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Telegraph Ave from the north (Berkeley) | 9.6 | Telegraph Avenue |
| Telegraph Ave to the south (downtown Oakland) | Telegraph Ave from the north (Berkeley) | 7.9 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Emeryville and West Oakland streets (55th to 67th Streets) | 7.4 | Claremont Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Telegraph Ave from the north (Berkeley) | 6.9 | none near the study area |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Shattuck Ave from the north (Berkeley) | 6.2 | Claremont Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 5.9 | Claremont Avenue then College Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Ashby Ave from the west (Emeryville and I-80) | 4.7 | SR-24 then Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 4.7 | SR-24 |
| other pairs | | 22.6 | |

By the arterial these cars would otherwise use: Telegraph Avenue 82 veh/h; none near the study area 21 veh/h; Claremont Avenue 19 veh/h; SR-24 then Telegraph Avenue 8 veh/h; Claremont Avenue then College Avenue 6 veh/h; SR-24 5 veh/h.

### Hillegass Avenue NB

Observed: block volume 110 veh/h, whole-street cars 48, so through cars 48 to 95 veh/h. Model: 72 through cars per hour.

Observed (PM): 94 cars entered at the south end, 48 drove the whole street, 109 left it at Alcatraz Ave (43 west, 54 east, 12 straight), and 47% of the block's trips came from a freeway. ASSUMPTION: freeway-origin through cars are 40 veh/h (52 freeway-origin trips times 94 / (94 + 29)), spread over the exits in proportion (0.37); the through share of exits is 48 / 109 = 0.44.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Hillegass Ave to reach Alcatraz Ave west and Telegraph Ave north | OBSERVED turn count x ASSUMPTION share (43 left turns x 0.37) | 16 (9 to 20) | 17 | within |
| SR-24 off-ramp traffic using Hillegass Ave to reach College Ave and Berkeley | OBSERVED turn count x ASSUMPTION share (54 right turns x 0.37) | 20 (11 to 25) | 21 | within |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach Alcatraz Ave west | ASSUMPTION: through exits (43 x 0.44) that are not off-ramp traffic | 3 (0 to 10) | 8 | within |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach College Ave and Berkeley | ASSUMPTION: through exits (54 x 0.44) that are not off-ramp traffic | 4 (0 to 13) | 23 | above |
| Intents listed, together | | 43 (20 to 68) | 69 | |
| Other through cars (no intent listed) | | | 3 | |

Model through cars by origin and destination group (largest 12 of 44 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 14.3 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 10.4 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 10.1 | SR-24 |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 6.0 | SR-24 then Claremont Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | College Ave from the north (Berkeley) | 4.7 | SR-24 then Claremont Avenue then College Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Ashby Ave from the west (Emeryville and I-80) | 3.4 | College Avenue then Alcatraz Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Telegraph Ave from the north (Berkeley) | 2.7 | none near the study area |
| West Oakland to the southwest (Adeline St, Market St) | Claremont Ave and Tunnel Rd toward the hills | 2.4 | Claremont Avenue |
| Telegraph Ave to the south (downtown Oakland) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 1.8 | Telegraph Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | San Pablo Ave (Emeryville and West Oakland) | 1.3 | SR-24 |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Shattuck Ave from the north (Berkeley) | 1.2 | Claremont Avenue |
| SR-13 Warren Freeway (via SR-24 east) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 1.2 | Claremont Avenue then Alcatraz Avenue |
| other pairs | | 12.9 | |

By the arterial these cars would otherwise use: Telegraph Avenue 30 veh/h; SR-24 12 veh/h; Claremont Avenue 8 veh/h; SR-24 then Claremont Avenue 6 veh/h; SR-24 then Claremont Avenue then College Avenue 5 veh/h; College Avenue then Alcatraz Avenue 4 veh/h.

### Hillegass Avenue SB

Observed: block volume 160 veh/h, whole-street cars 79, so through cars 79 to 120 veh/h. Model: 111 through cars per hour.

Observed (PM): 178 cars entered at the top (76 turned in from Alcatraz Ave west, 98 from the east, 4 came straight from the north), 79 drove the whole street, and 68% of the block's trips (109 veh/h) went to a freeway. ASSUMPTION: freeway-bound cars that did not join mid-street are 87 veh/h (109 x 178 / (178 + 44)), half of the 174 turn-ins; low = the whole-street share of the turn-ins (0.45), high = the freeway-bound share without the mid-street correction (0.63).

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Telegraph Ave, Alcatraz Ave west and West Berkeley traffic turning off Alcatraz Ave onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (76 turn-ins x 0.50) | 38 (34 to 48) | 39 | within |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (98 turn-ins x 0.50) | 49 (44 to 62) | 53 | within |
| Intents listed, together | | 87 (78 to 110) | 92 | |
| Other through cars (no intent listed) | | | 18 | |

Model through cars by origin and destination group (largest 12 of 28 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 39.1 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 25.1 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 16.4 | Claremont Avenue then SR-24 |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 8.9 | College Avenue then Claremont Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 7.9 | Telegraph Avenue |
| Ashby Ave from the west (Emeryville and I-80) | College Ave from the north (Berkeley) | 3.9 | Alcatraz Avenue then College Avenue |
| West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 2.1 | College Avenue |
| Berkeley hills to the northeast (Evergreen Ln, Gravatt Dr) | SR-24 westbound on-ramps (toward Oakland and I-980) | 1.3 | Claremont Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 1.2 | Claremont Avenue |
| College Ave from the north (Berkeley) | Telegraph Ave to the south (downtown Oakland) | 0.8 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 0.7 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 0.6 | Alcatraz Avenue then College Avenue |
| other pairs | | 2.7 | |

By the arterial these cars would otherwise use: Telegraph Avenue 74 veh/h; Claremont Avenue then SR-24 18 veh/h; College Avenue then Claremont Avenue then SR-24 9 veh/h; Alcatraz Avenue then College Avenue 4 veh/h; College Avenue 2 veh/h; Claremont Avenue 2 veh/h.

### Colby Street SB

Observed: block volume 160 veh/h, whole-street cars 39, so through cars 39 to 117 veh/h. Model: 109 through cars per hour.

Observed (PM): 139 cars entered at the top (76 from Alcatraz Ave west, 50 from the east, 13 from the north), 39 drove the whole street, 45% of the block's trips (72 veh/h) went to a freeway and 22% came by way of Telegraph Ave. ASSUMPTION: freeway-bound cars that did not join mid-street are 46 veh/h (72 x 139 / (139 + 79)), 0.365 of the 126 turn-ins; low = the whole-street share (0.31), high = the unadjusted freeway share (0.57). The Telegraph Ave cars are the 22% x 160 = 35 of the 76 west turn-ins.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Southbound Telegraph Ave traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (35 Telegraph Ave cars x 0.365) | 13 (11 to 20) | 24 | above |
| Alcatraz Ave west, Ashby Ave and West Berkeley traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (41 other west turn-ins x 0.365) | 15 (13 to 23) | 16 | within |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (50 east turn-ins x 0.365) | 18 (15 to 29) | 39 | above |
| Intents listed, together | | 46 (39 to 72) | 79 | |
| Other through cars (no intent listed) | | | 30 | |

Model through cars by origin and destination group (largest 12 of 43 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 24.8 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 19.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 15.5 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 9.5 | Claremont Avenue then SR-24 |
| Shattuck Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 7.5 | none near the study area |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 4.5 | College Avenue then Claremont Avenue then SR-24 |
| Telegraph Ave from the north (Berkeley) | SR-13 Warren Freeway (via SR-24 east) | 2.6 | none near the study area |
| Ashby Ave from the west (Emeryville and I-80) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 2.4 | SR-24 |
| Ashby Ave from the west (Emeryville and I-80) | College Ave from the north (Berkeley) | 2.3 | Alcatraz Avenue then College Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Telegraph Ave to the south (downtown Oakland) | 2.3 | Telegraph Avenue |
| Alcatraz Ave from the west (Emeryville side) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 2.2 | SR-24 |
| Telegraph Ave from the north (Berkeley) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 2.1 | none near the study area |
| other pairs | | 14.1 | |

By the arterial these cars would otherwise use: Telegraph Avenue 64 veh/h; none near the study area 13 veh/h; Claremont Avenue then SR-24 10 veh/h; SR-24 8 veh/h; College Avenue then Claremont Avenue then SR-24 4 veh/h; Claremont Avenue 3 veh/h.

### Study area, all residential and service streets

Model: 675 through cars per hour.

Model through cars by origin and destination group (largest 12 of 112 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 74.3 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 67.4 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 63.9 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 48.7 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 40.9 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 38.6 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Emeryville and West Oakland streets (55th to 67th Streets) | 32.7 | Claremont Avenue |
| West Oakland to the southwest (Adeline St, Market St) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 29.3 | Telegraph Avenue then Claremont Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 24.1 | Claremont Avenue then SR-24 |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Ashby Ave from the west (Emeryville and I-80) | 19.1 | College Avenue then Alcatraz Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Shattuck Ave from the north (Berkeley) | 16.1 | Claremont Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 16.0 | Claremont Avenue then College Avenue |
| other pairs | | 203.4 | |

By the arterial these cars would otherwise use: Telegraph Avenue 386 veh/h; Claremont Avenue 69 veh/h; none near the study area 35 veh/h; Telegraph Avenue then Claremont Avenue 29 veh/h; SR-24 26 veh/h; Claremont Avenue then SR-24 25 veh/h.

By origin group: SR-24 eastbound off-ramps (arriving from Oakland and I-980) 138; South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 131; Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 122; Telegraph Ave from the north (Berkeley) 78; West Oakland to the southwest (Adeline St, Market St) 56; Claremont Ave and Tunnel Rd toward the hills 27; Telegraph Ave to the south (downtown Oakland) 26; SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) 26; Ashby Ave from the west (Emeryville and I-80) 19; College Ave from the north (Berkeley) 14.

By destination group: SR-24 westbound on-ramps (toward Oakland and I-980) 194; Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 121; Telegraph Ave from the north (Berkeley) 93; South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 92; Claremont Ave and Tunnel Rd toward the hills 37; Emeryville and West Oakland streets (55th to 67th Streets) 34; Ashby Ave from the west (Emeryville and I-80) 26; Shattuck Ave from the north (Berkeley) 21; College Ave from the north (Berkeley) 16; SR-24 eastbound on-ramps (toward the Caldecott Tunnel) 8.


Per-seed detail: `rockridge-pm_peak-s1-seed1.md` (seed 1 in full).
