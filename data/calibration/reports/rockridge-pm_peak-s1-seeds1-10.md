# rockridge-pm_peak-s1 over 10 seeds (1, 2, 3, 4, 5, 6, 7, 8, 9, 10)

Seeds are the fixed list above, none chosen; each run is 60 minutes from the same start. Interval = 95% interval of the mean (Student t, n - 1 degrees of freedom). Run-to-run noise only: demand is fixed, so day-to-day variation is not in these intervals.

## Stability rule (design decision D16)

| Check | Rule | Result | Pass |
| --- | --- | --- | --- |
| Removals | mean per hour below 1.00 | 0.10 (min 0.00, max 1.00) | yes |
| Entry backlog | below 2.0% in at least 90% of seeds | 10 of 10 seeds | yes |
| Runaway growth | no seed adds more than 2.0 points of backlog in the second half | none | yes |
| Arterial speed | mean above 4.0 m/s | 9.32 m/s | yes |

**Verdict: stable.** Old rule (zero removals, backlog under 2%, speed above 4 m/s, every seed): 9 of 10 seeds pass.

## Metrics over seeds

| Group | Metric | Unit | Mean | SD | Min | Max | 95% interval |
| --- | --- | --- | --- | --- | --- | --- | --- |
| health | gridlock removals | vehicles | 0.10 | 0.32 | 0.00 | 1.00 | -0.13 to 0.33 |
| health | gridlock removals per hour | veh/h | 0.10 | 0.32 | 0.00 | 1.00 | -0.13 to 0.33 |
| health | entry backlog | % of spawned | 0.03 | 0.01 | 0.01 | 0.05 | 0.02 to 0.04 |
| health | backlog growth in the second half of the run | points of spawned | 0.00 | 0.01 | -0.01 | 0.02 | -0.00 to 0.01 |
| health | completed trips | trips | 24373.40 | 283.29 | 23908.00 | 24791.00 | 24170.76 to 24576.04 |
| health | arterial mean speed | m/s | 9.32 | 0.08 | 9.20 | 9.45 | 9.26 to 9.38 |
| health | arterial mean speed, last 15 min | m/s | 9.31 | 0.12 | 9.14 | 9.50 | 9.23 to 9.40 |
| cut-through | local vehicle-miles, surface gates to the freeway | veh-miles | 31.44 | 2.93 | 27.37 | 36.30 | 29.35 to 33.53 |
| cut-through | share of local vehicle-miles, surface gates to the freeway | % | 7.5 | 0.8 | 6.6 | 8.8 | 6.9 to 8.0 |
| cut-through | local vehicle-miles, freeway to the surface gates | veh-miles | 33.55 | 4.22 | 28.14 | 39.90 | 30.54 to 36.57 |
| cut-through | share of local vehicle-miles, freeway to the surface gates | % | 8.0 | 1.0 | 6.8 | 9.2 | 7.3 to 8.7 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue N | trips | 41.50 | 5.46 | 35.00 | 48.00 | 37.59 to 45.41 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue N | trips | 1325.70 | 34.07 | 1260.00 | 1372.00 | 1301.33 to 1350.07 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue S | trips | 69.20 | 6.94 | 57.00 | 81.00 | 64.24 to 74.16 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue S | trips | 1534.10 | 54.32 | 1416.00 | 1592.00 | 1495.24 to 1572.96 |
| headline share | Hillegass Avenue NB from freeway | % | 55.5 | 2.8 | 51.8 | 59.6 | 53.5 to 57.5 |
| share | Hillegass Avenue NB to Benvenue Avenue | % | 3.6 | 1.1 | 2.3 | 5.8 | 2.8 to 4.5 |
| share | Hillegass Avenue NB to College Avenue | % | 18.3 | 2.1 | 16.0 | 21.7 | 16.8 to 19.7 |
| share | Hillegass Avenue NB to Alcatraz Avenue WB | % | 23.4 | 3.4 | 17.2 | 29.0 | 20.9 to 25.8 |
| headline share | Colby Street NB from freeway | % | 39.8 | 3.7 | 32.4 | 45.0 | 37.1 to 42.5 |
| share | Colby Street NB to Alcatraz Avenue WB | % | 51.8 | 3.7 | 45.7 | 57.1 | 49.2 to 54.4 |
| share | Colby Street NB to Telegraph Avenue | % | 40.3 | 2.9 | 37.0 | 47.4 | 38.2 to 42.4 |
| share | Colby Street NB to College Avenue | % | 5.5 | 1.2 | 3.9 | 8.1 | 4.6 to 6.4 |
| share | Hillegass Avenue SB from Alcatraz Avenue WB | % | 29.9 | 4.4 | 22.1 | 36.2 | 26.7 to 33.0 |
| share | Hillegass Avenue SB from Benvenue Avenue | % | 4.1 | 1.7 | 1.7 | 6.4 | 2.9 to 5.3 |
| share | Hillegass Avenue SB from College Avenue | % | 16.8 | 3.5 | 12.0 | 22.6 | 14.3 to 19.3 |
| headline share | Hillegass Avenue SB to freeway | % | 63.9 | 3.4 | 57.1 | 68.4 | 61.4 to 66.3 |
| share | Colby Street SB from Alcatraz Avenue EB | % | 24.3 | 2.3 | 19.4 | 27.1 | 22.7 to 25.9 |
| share | Colby Street SB from Alcatraz Avenue WB | % | 15.5 | 2.1 | 12.0 | 18.3 | 14.0 to 17.0 |
| share | Colby Street SB from Telegraph Avenue | % | 19.0 | 2.9 | 14.4 | 24.4 | 17.0 to 21.1 |
| headline share | Colby Street SB to freeway | % | 44.0 | 3.5 | 37.0 | 49.8 | 41.5 to 46.5 |
| share | Colby Street SB to Forest Street | % | 16.6 | 3.2 | 13.4 | 24.5 | 14.3 to 18.9 |
| ramp share | onto freeway via College Avenue | % | 16.7 | 1.5 | 14.7 | 19.3 | 15.6 to 17.7 |
| ramp share | onto freeway via Hillegass Avenue | % | 15.3 | 1.2 | 13.0 | 16.8 | 14.4 to 16.1 |
| ramp share | onto freeway via Martin Street | % | 12.1 | 1.5 | 10.1 | 15.3 | 11.1 to 13.2 |
| ramp share | onto freeway via Colby Street | % | 12.0 | 1.4 | 9.3 | 13.5 | 11.0 to 13.0 |
| ramp share | onto freeway via Telegraph Avenue north of Alcatraz Avenue | % | 10.2 | 1.0 | 8.6 | 11.4 | 9.5 to 10.9 |
| ramp share | onto freeway via Benvenue Avenue | % | 2.2 | 0.5 | 1.2 | 2.8 | 1.8 to 2.5 |
| ramp share | from freeway via College Avenue | % | 10.2 | 1.2 | 8.1 | 11.5 | 9.4 to 11.1 |
| ramp share | from freeway via Martin Street | % | 10.9 | 0.9 | 9.6 | 12.2 | 10.3 to 11.6 |
| ramp share | from freeway via Colby Street | % | 12.4 | 1.2 | 9.9 | 14.0 | 11.6 to 13.3 |
| ramp share | from freeway via Hillegass Avenue | % | 7.9 | 1.1 | 6.9 | 10.3 | 7.1 to 8.7 |
| ramp share | from freeway via Benvenue Avenue | % | 3.0 | 1.1 | 1.9 | 5.9 | 2.1 to 3.8 |
| corridor flow | Telegraph N median link flow | veh/h | 1097.04 | 34.09 | 1051.20 | 1154.40 | 1072.66 to 1121.42 |
| corridor flow | Telegraph S median link flow | veh/h | 818.16 | 52.93 | 740.40 | 901.20 | 780.30 to 856.02 |
| corridor flow | College N median link flow | veh/h | 359.52 | 24.63 | 330.00 | 415.20 | 341.90 to 377.14 |
| corridor flow | College S median link flow | veh/h | 886.92 | 40.70 | 799.20 | 944.40 | 857.81 to 916.03 |
| corridor flow | Claremont N median link flow | veh/h | 431.88 | 24.12 | 387.60 | 471.60 | 414.63 to 449.13 |
| corridor flow | Claremont S median link flow | veh/h | 312.24 | 21.89 | 282.00 | 351.60 | 296.59 to 327.89 |
| corridor flow | Alcatraz E median link flow | veh/h | 541.68 | 26.49 | 500.40 | 579.60 | 522.73 to 560.63 |
| corridor flow | Alcatraz W median link flow | veh/h | 359.16 | 16.79 | 331.20 | 392.40 | 347.15 to 371.17 |
| corridor flow | Hillegass N median link flow | veh/h | 116.88 | 11.19 | 103.20 | 140.40 | 108.88 to 124.88 |
| corridor flow | Hillegass S median link flow | veh/h | 130.32 | 8.02 | 120.00 | 144.00 | 124.58 to 136.06 |
| corridor flow | Colby N median link flow | veh/h | 156.36 | 13.73 | 129.60 | 178.80 | 146.54 to 166.18 |
| corridor flow | Colby S median link flow | veh/h | 140.04 | 10.07 | 124.80 | 154.80 | 132.84 to 147.24 |
| corridor flow | Martin E median link flow | veh/h | 112.80 | 12.71 | 92.40 | 139.20 | 103.71 to 121.89 |
| corridor flow | Martin W median link flow | veh/h | 111.00 | 14.48 | 91.20 | 141.60 | 100.64 to 121.36 |

## Intent map: through cars by where they come from and where they are going

Through = neither trip end is in the study area. Groups are the approach groups of the area config (data/areas); a node that is not a gate takes the group of the nearest surface gate (ASSUMPTION). The arterial is the one a trip would use on the shortest free-flow path with the study area's residential and service streets closed, where that path runs on a boundary street near the study area.

Model figures are the mean of 10 seed(s), per hour of the run. Basis: OBSERVED = read from the resident volunteer count of Feb 25, 2025 or its headline shares; ASSUMPTION = inferred from those numbers or chosen.

### Colby Street NB

Observed: block volume 174 veh/h, whole-street cars 102, so through cars 102 to 145 veh/h. Model: 140 through cars per hour.

Observed (PM): 182 cars entered at the south end, 102 drove the whole street, 164 left it at Alcatraz Ave (131 left, 32 right, 1 straight), and 47% of the block's trips came from a freeway (the headline share). ASSUMPTION: freeway-origin cars that do not end along the street are 65 veh/h (the 82 freeway-origin trips on the block, 47% of 174, times the 182 / (182 + 47) of its cars that entered at the south end rather than joining on the way), spread over the 164 exits in proportion (0.40); the other through cars come from the Telegraph Ave and south-side approaches that feed the street's south end. Ranges: low = 131 (32) x 0.47 x 0.62 (the whole-street share of exits), high = 131 (32) x 0.47.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | OBSERVED turn count x ASSUMPTION share (131 left turns x 0.40) | 52 (38 to 62) | 61 | within |
| Telegraph Ave and south-side traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | ASSUMPTION: the through left-turners (131 x 0.62 = 81) that are not off-ramp traffic | 29 (19 to 43) | 51 | above |
| SR-24 off-ramp traffic using Colby St to reach College Ave and Berkeley (right at Alcatraz Ave) | OBSERVED turn count x ASSUMPTION share (32 right turns x 0.40) | 13 (9 to 15) | 9 | within |
| Telegraph Ave and south-side traffic using Colby St to reach College Ave and Berkeley | ASSUMPTION: the through right-turners (32 x 0.62 = 20) that are not off-ramp traffic | 7 (5 to 11) | 17 | above |
| Intents listed, together | | 101 (71 to 131) | 138 | |
| Other through cars (no intent listed) | | | 2 | |

Model through cars by origin and destination group (largest 12 of 31 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 61.4 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 17.8 | Claremont Avenue then College Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 12.1 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Emeryville and West Oakland streets (55th to 67th Streets) | 11.6 | Claremont Avenue |
| Telegraph Ave to the south (downtown Oakland) | Telegraph Ave from the north (Berkeley) | 7.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Ashby Ave from the west (Emeryville and I-80) | 6.8 | none near the study area |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 5.6 | SR-24 then Claremont Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Telegraph Ave from the north (Berkeley) | 4.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Shattuck Ave from the north (Berkeley) | 3.9 | Claremont Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | College Ave from the north (Berkeley) | 2.9 | SR-24 then Claremont Avenue then College Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Claremont Ave and Tunnel Rd toward the hills | 1.9 | Claremont Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Claremont Ave and Tunnel Rd toward the hills | 0.9 | Claremont Avenue |
| other pairs | | 4.6 | |

By the arterial these cars would otherwise use: Telegraph Avenue 86 veh/h; Claremont Avenue 19 veh/h; Claremont Avenue then College Avenue 18 veh/h; none near the study area 7 veh/h; SR-24 then Claremont Avenue 6 veh/h; SR-24 then Claremont Avenue then College Avenue 3 veh/h.

### Hillegass Avenue NB

Observed: block volume 110 veh/h, whole-street cars 48, so through cars 48 to 95 veh/h. Model: 73 through cars per hour.

Observed (PM): 94 cars entered at the south end, 48 drove the whole street, 109 left it at Alcatraz Ave (43 west, 54 east, 12 straight), and 47% of the block's trips came from a freeway. ASSUMPTION: freeway-origin through cars are 40 veh/h (52 freeway-origin trips times 94 / (94 + 29)), spread over the exits in proportion (0.37); the through share of exits is 48 / 109 = 0.44.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Hillegass Ave to reach Alcatraz Ave west and Telegraph Ave north | OBSERVED turn count x ASSUMPTION share (43 left turns x 0.37) | 16 (9 to 20) | 16 | within |
| SR-24 off-ramp traffic using Hillegass Ave to reach College Ave and Berkeley | OBSERVED turn count x ASSUMPTION share (54 right turns x 0.37) | 20 (11 to 25) | 33 | above |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach Alcatraz Ave west | ASSUMPTION: through exits (43 x 0.44) that are not off-ramp traffic | 3 (0 to 10) | 6 | within |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach College Ave and Berkeley | ASSUMPTION: through exits (54 x 0.44) that are not off-ramp traffic | 4 (0 to 13) | 14 | above |
| Intents listed, together | | 43 (20 to 68) | 68 | |
| Other through cars (no intent listed) | | | 5 | |

Model through cars by origin and destination group (largest 12 of 37 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 20.7 | SR-24 |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 9.3 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 6.4 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | College Ave from the north (Berkeley) | 6.3 | SR-24 then Claremont Avenue then College Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 5.9 | SR-24 then Claremont Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Claremont Ave and Tunnel Rd toward the hills | 2.3 | Claremont Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Telegraph Ave from the north (Berkeley) | 2.0 | none near the study area |
| SR-13 Warren Freeway (via SR-24 east) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 1.7 | Claremont Avenue then Alcatraz Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Alcatraz Ave from the west (Emeryville side) | 1.7 | SR-24 then Telegraph Avenue |
| Telegraph Ave to the south (downtown Oakland) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 1.7 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 1.5 | Claremont Avenue then College Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Ashby Ave from the west (Emeryville and I-80) | 1.5 | SR-24 then Telegraph Avenue |
| other pairs | | 12.3 | |

By the arterial these cars would otherwise use: SR-24 22 veh/h; Telegraph Avenue 20 veh/h; SR-24 then Claremont Avenue then College Avenue 6 veh/h; Claremont Avenue 6 veh/h; SR-24 then Claremont Avenue 6 veh/h; SR-24 then Telegraph Avenue 3 veh/h.

### Hillegass Avenue SB

Observed: block volume 160 veh/h, whole-street cars 79, so through cars 79 to 120 veh/h. Model: 111 through cars per hour.

Observed (PM): 178 cars entered at the top (76 turned in from Alcatraz Ave west, 98 from the east, 4 came straight from the north), 79 drove the whole street, and 68% of the block's trips (109 veh/h) went to a freeway. ASSUMPTION: freeway-bound cars that did not join mid-street are 87 veh/h (109 x 178 / (178 + 44)), half of the 174 turn-ins; low = the whole-street share of the turn-ins (0.45), high = the freeway-bound share without the mid-street correction (0.63).

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Telegraph Ave, Alcatraz Ave west and West Berkeley traffic turning off Alcatraz Ave onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (76 turn-ins x 0.50) | 38 (34 to 48) | 39 | within |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (98 turn-ins x 0.50) | 49 (44 to 62) | 50 | within |
| Intents listed, together | | 87 (78 to 110) | 90 | |
| Other through cars (no intent listed) | | | 21 | |

Model through cars by origin and destination group (largest 12 of 30 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 38.9 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 23.7 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 14.9 | Claremont Avenue then SR-24 |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 8.3 | College Avenue then Claremont Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 6.8 | Telegraph Avenue |
| Ashby Ave from the west (Emeryville and I-80) | College Ave from the north (Berkeley) | 5.8 | Alcatraz Avenue then College Avenue |
| West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 2.6 | College Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 1.8 | Claremont Avenue |
| Berkeley hills to the northeast (Evergreen Ln, Gravatt Dr) | SR-24 westbound on-ramps (toward Oakland and I-980) | 1.5 | SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 1.0 | Alcatraz Avenue then College Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Telegraph Ave to the south (downtown Oakland) | 1.0 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 0.9 | College Avenue |
| other pairs | | 3.6 | |

By the arterial these cars would otherwise use: Telegraph Avenue 71 veh/h; Claremont Avenue then SR-24 15 veh/h; College Avenue then Claremont Avenue then SR-24 8 veh/h; Alcatraz Avenue then College Avenue 7 veh/h; College Avenue 4 veh/h; Claremont Avenue 2 veh/h.

### Colby Street SB

Observed: block volume 160 veh/h, whole-street cars 39, so through cars 39 to 117 veh/h. Model: 105 through cars per hour.

Observed (PM): 139 cars entered at the top (76 from Alcatraz Ave west, 50 from the east, 13 from the north), 39 drove the whole street, 45% of the block's trips (72 veh/h) went to a freeway and 22% came by way of Telegraph Ave. ASSUMPTION: freeway-bound cars that did not join mid-street are 46 veh/h (72 x 139 / (139 + 79)), 0.365 of the 126 turn-ins; low = the whole-street share (0.31), high = the unadjusted freeway share (0.57). The Telegraph Ave cars are the 22% x 160 = 35 of the 76 west turn-ins.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Southbound Telegraph Ave traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (35 Telegraph Ave cars x 0.365) | 13 (11 to 20) | 18 | within |
| Alcatraz Ave west, Ashby Ave and West Berkeley traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (41 other west turn-ins x 0.365) | 15 (13 to 23) | 15 | within |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (50 east turn-ins x 0.365) | 18 (15 to 29) | 39 | above |
| Intents listed, together | | 46 (39 to 72) | 71 | |
| Other through cars (no intent listed) | | | 34 | |

Model through cars by origin and destination group (largest 12 of 50 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 23.9 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 15.8 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 14.9 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 9.9 | Claremont Avenue then SR-24 |
| Shattuck Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 8.0 | none near the study area |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 4.7 | College Avenue then Claremont Avenue then SR-24 |
| Ashby Ave from the west (Emeryville and I-80) | College Ave from the north (Berkeley) | 3.9 | Alcatraz Avenue then College Avenue |
| Ashby Ave from the west (Emeryville and I-80) | SR-13 Warren Freeway (via SR-24 east) | 2.9 | SR-24 |
| Ashby Ave from the west (Emeryville and I-80) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 2.2 | SR-24 |
| Telegraph Ave from the north (Berkeley) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 2.2 | Telegraph Avenue |
| West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 1.9 | College Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 1.9 | none near the study area |
| other pairs | | 12.9 | |

By the arterial these cars would otherwise use: Telegraph Avenue 60 veh/h; none near the study area 12 veh/h; Claremont Avenue then SR-24 10 veh/h; SR-24 7 veh/h; College Avenue then Claremont Avenue then SR-24 5 veh/h; Alcatraz Avenue then College Avenue 5 veh/h.

### Study area, all residential and service streets

Model: 633 through cars per hour.

Model through cars by origin and destination group (largest 12 of 110 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 71.1 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 71.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 51.2 | Claremont Avenue then College Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 49.2 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Emeryville and West Oakland streets (55th to 67th Streets) | 40.5 | Claremont Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 36.6 | Telegraph Avenue |
| West Oakland to the southwest (Adeline St, Market St) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 33.2 | Telegraph Avenue then Claremont Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 25.7 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 22.5 | Claremont Avenue then SR-24 |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 20.8 | SR-24 |
| Emeryville and West Oakland streets (55th to 67th Streets) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 20.0 | none near the study area |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 15.4 | SR-24 then Claremont Avenue |
| other pairs | | 175.7 | |

By the arterial these cars would otherwise use: Telegraph Avenue 301 veh/h; Claremont Avenue 70 veh/h; Claremont Avenue then College Avenue 51 veh/h; none near the study area 45 veh/h; SR-24 34 veh/h; Telegraph Avenue then Claremont Avenue 33 veh/h.

By origin group: South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 141; Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 123; SR-24 eastbound off-ramps (arriving from Oakland and I-980) 117; Telegraph Ave from the north (Berkeley) 62; West Oakland to the southwest (Adeline St, Market St) 47; Telegraph Ave to the south (downtown Oakland) 25; Claremont Ave and Tunnel Rd toward the hills 25; Emeryville and West Oakland streets (55th to 67th Streets) 21; Ashby Ave from the west (Emeryville and I-80) 19; College Ave from the north (Berkeley) 14.

By destination group: SR-24 westbound on-ramps (toward Oakland and I-980) 177; Telegraph Ave from the north (Berkeley) 136; South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 102; Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 58; Emeryville and West Oakland streets (55th to 67th Streets) 42; Claremont Ave and Tunnel Rd toward the hills 38; College Ave from the north (Berkeley) 23; Shattuck Ave from the north (Berkeley) 12; Ashby Ave from the west (Emeryville and I-80) 10; San Pablo Ave (Emeryville and West Oakland) 7.


Per-seed detail: `rockridge-pm_peak-s1-seed1.md` (seed 1 in full).
