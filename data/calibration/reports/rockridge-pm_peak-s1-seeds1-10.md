# rockridge-pm_peak-s1 over 10 seeds (1, 2, 3, 4, 5, 6, 7, 8, 9, 10)

Seeds are the fixed list above, none chosen; each run is 60 minutes from the same start. Interval = 95% interval of the mean (Student t, n - 1 degrees of freedom). Run-to-run noise only: demand is fixed, so day-to-day variation is not in these intervals.

## Stability rule (design decision D16)

| Check | Rule | Result | Pass |
| --- | --- | --- | --- |
| Removals | mean per hour below 1.00 | 0.00 (min 0.00, max 0.00) | yes |
| Entry backlog | below 2.0% in at least 90% of seeds | 10 of 10 seeds | yes |
| Runaway growth | no seed adds more than 2.0 points of backlog in the second half | none | yes |
| Arterial speed | mean above 4.0 m/s | 9.33 m/s | yes |

**Verdict: stable.** Old rule (zero removals, backlog under 2%, speed above 4 m/s, every seed): 10 of 10 seeds pass.

## Metrics over seeds

| Group | Metric | Unit | Mean | SD | Min | Max | 95% interval |
| --- | --- | --- | --- | --- | --- | --- | --- |
| health | gridlock removals | vehicles | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| health | gridlock removals per hour | veh/h | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| health | entry backlog | % of spawned | 0.03 | 0.01 | 0.01 | 0.05 | 0.02 to 0.04 |
| health | backlog growth in the second half of the run | points of spawned | 0.00 | 0.02 | -0.03 | 0.03 | -0.01 to 0.02 |
| health | completed trips | trips | 24421.50 | 268.70 | 23965.00 | 24765.00 | 24229.29 to 24613.71 |
| health | arterial mean speed | m/s | 9.33 | 0.08 | 9.22 | 9.45 | 9.27 to 9.38 |
| health | arterial mean speed, last 15 min | m/s | 9.33 | 0.08 | 9.21 | 9.44 | 9.27 to 9.38 |
| cut-through | local vehicle-miles, surface gates to the freeway | veh-miles | 31.42 | 2.92 | 27.57 | 35.66 | 29.33 to 33.51 |
| cut-through | share of local vehicle-miles, surface gates to the freeway | % | 7.4 | 0.8 | 6.5 | 8.6 | 6.9 to 8.0 |
| cut-through | local vehicle-miles, freeway to the surface gates | veh-miles | 35.57 | 4.26 | 29.19 | 40.09 | 32.52 to 38.61 |
| cut-through | share of local vehicle-miles, freeway to the surface gates | % | 8.4 | 0.9 | 7.1 | 9.5 | 7.7 to 9.1 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue N | trips | 35.70 | 5.21 | 28.00 | 44.00 | 31.97 to 39.43 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue N | trips | 1330.10 | 29.13 | 1265.00 | 1362.00 | 1309.26 to 1350.94 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue S | trips | 68.50 | 8.05 | 57.00 | 83.00 | 62.75 to 74.25 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue S | trips | 1532.20 | 52.99 | 1411.00 | 1582.00 | 1494.29 to 1570.11 |
| headline share | Hillegass Avenue NB from freeway | % | 53.9 | 3.6 | 47.4 | 59.4 | 51.3 to 56.4 |
| share | Hillegass Avenue NB to Benvenue Avenue | % | 3.8 | 1.2 | 1.8 | 5.5 | 2.9 to 4.7 |
| share | Hillegass Avenue NB to College Avenue | % | 17.0 | 1.6 | 14.1 | 18.8 | 15.9 to 18.1 |
| share | Hillegass Avenue NB to Alcatraz Avenue WB | % | 24.5 | 3.4 | 19.8 | 29.9 | 22.0 to 26.9 |
| headline share | Colby Street NB from freeway | % | 41.9 | 3.3 | 36.8 | 47.4 | 39.6 to 44.3 |
| share | Colby Street NB to Alcatraz Avenue WB | % | 50.9 | 2.8 | 46.2 | 54.9 | 48.9 to 52.9 |
| share | Colby Street NB to Telegraph Avenue | % | 39.4 | 2.8 | 37.3 | 47.0 | 37.4 to 41.4 |
| share | Colby Street NB to College Avenue | % | 6.2 | 1.1 | 4.8 | 7.7 | 5.4 to 7.0 |
| share | Hillegass Avenue SB from Alcatraz Avenue WB | % | 30.5 | 4.9 | 23.3 | 39.0 | 26.9 to 34.0 |
| share | Hillegass Avenue SB from Benvenue Avenue | % | 3.9 | 1.8 | 1.5 | 7.3 | 2.6 to 5.2 |
| share | Hillegass Avenue SB from College Avenue | % | 17.0 | 3.8 | 11.4 | 24.3 | 14.3 to 19.7 |
| headline share | Hillegass Avenue SB to freeway | % | 65.1 | 3.7 | 58.0 | 70.1 | 62.5 to 67.8 |
| share | Colby Street SB from Alcatraz Avenue EB | % | 22.9 | 1.7 | 19.8 | 25.5 | 21.7 to 24.1 |
| share | Colby Street SB from Alcatraz Avenue WB | % | 16.0 | 2.3 | 11.5 | 18.9 | 14.4 to 17.7 |
| share | Colby Street SB from Telegraph Avenue | % | 18.6 | 2.8 | 15.1 | 22.4 | 16.6 to 20.6 |
| headline share | Colby Street SB to freeway | % | 43.2 | 3.2 | 38.7 | 47.8 | 40.9 to 45.5 |
| share | Colby Street SB to Forest Street | % | 16.1 | 3.1 | 12.3 | 21.5 | 13.8 to 18.3 |
| ramp share | onto freeway via College Avenue | % | 16.7 | 1.8 | 14.4 | 19.4 | 15.4 to 18.0 |
| ramp share | onto freeway via Hillegass Avenue | % | 15.1 | 1.4 | 12.7 | 16.9 | 14.1 to 16.1 |
| ramp share | onto freeway via Martin Street | % | 12.3 | 1.5 | 10.7 | 15.1 | 11.3 to 13.4 |
| ramp share | onto freeway via Colby Street | % | 12.2 | 1.3 | 9.9 | 13.4 | 11.3 to 13.1 |
| ramp share | onto freeway via Telegraph Avenue north of Alcatraz Avenue | % | 10.1 | 1.2 | 8.4 | 11.7 | 9.3 to 11.0 |
| ramp share | onto freeway via Benvenue Avenue | % | 2.2 | 0.7 | 1.1 | 3.2 | 1.7 to 2.7 |
| ramp share | from freeway via College Avenue | % | 10.2 | 0.9 | 8.6 | 11.3 | 9.5 to 10.8 |
| ramp share | from freeway via Martin Street | % | 10.9 | 1.1 | 9.1 | 12.3 | 10.1 to 11.7 |
| ramp share | from freeway via Colby Street | % | 13.9 | 1.4 | 11.2 | 15.4 | 12.9 to 14.8 |
| ramp share | from freeway via Hillegass Avenue | % | 6.9 | 1.3 | 5.7 | 9.9 | 6.0 to 7.8 |
| ramp share | from freeway via Benvenue Avenue | % | 2.9 | 1.1 | 1.9 | 5.7 | 2.1 to 3.7 |
| corridor flow | Telegraph N median link flow | veh/h | 1110.36 | 41.59 | 1052.40 | 1184.40 | 1080.61 to 1140.11 |
| corridor flow | Telegraph S median link flow | veh/h | 798.24 | 76.03 | 675.60 | 915.60 | 743.85 to 852.63 |
| corridor flow | College N median link flow | veh/h | 358.08 | 22.85 | 325.20 | 400.80 | 341.73 to 374.43 |
| corridor flow | College S median link flow | veh/h | 890.28 | 31.45 | 834.00 | 928.80 | 867.79 to 912.77 |
| corridor flow | Claremont N median link flow | veh/h | 430.68 | 35.00 | 381.60 | 483.60 | 405.65 to 455.71 |
| corridor flow | Claremont S median link flow | veh/h | 304.44 | 28.18 | 274.80 | 366.00 | 284.28 to 324.60 |
| corridor flow | Alcatraz E median link flow | veh/h | 544.80 | 26.46 | 499.20 | 582.00 | 525.87 to 563.73 |
| corridor flow | Alcatraz W median link flow | veh/h | 365.28 | 16.54 | 346.80 | 396.00 | 353.45 to 377.11 |
| corridor flow | Hillegass N median link flow | veh/h | 111.00 | 10.23 | 96.00 | 128.40 | 103.68 to 118.32 |
| corridor flow | Hillegass S median link flow | veh/h | 127.80 | 5.78 | 120.00 | 138.00 | 123.67 to 131.93 |
| corridor flow | Colby N median link flow | veh/h | 163.32 | 16.30 | 126.00 | 187.20 | 151.66 to 174.98 |
| corridor flow | Colby S median link flow | veh/h | 152.28 | 12.14 | 140.40 | 171.60 | 143.60 to 160.96 |
| corridor flow | Martin E median link flow | veh/h | 116.52 | 14.52 | 91.20 | 140.40 | 106.14 to 126.90 |
| corridor flow | Martin W median link flow | veh/h | 110.04 | 13.27 | 87.60 | 133.20 | 100.55 to 119.53 |

## Intent map: through cars by where they come from and where they are going

Through = neither trip end is in the study area. Groups are the approach groups of the area config (data/areas); a node that is not a gate takes the group of the nearest surface gate (ASSUMPTION). The arterial is the one a trip would use on the shortest free-flow path with the study area's residential and service streets closed, where that path runs on a boundary street near the study area.

Model figures are the mean of 10 seed(s), per hour of the run. Basis: OBSERVED = read from the resident volunteer count of Feb 25, 2025 or its headline shares; ASSUMPTION = inferred from those numbers or chosen.

### Colby Street NB

Observed: block volume 174 veh/h, whole-street cars 102, so through cars 102 to 145 veh/h. Model: 151 through cars per hour.

Observed (PM): 182 cars entered at the south end, 102 drove the whole street, 164 left it at Alcatraz Ave (131 left, 32 right, 1 straight), and 47% of the block's trips came from a freeway (the headline share). ASSUMPTION: freeway-origin cars that do not end along the street are 65 veh/h (the 82 freeway-origin trips on the block, 47% of 174, times the 182 / (182 + 47) of its cars that entered at the south end rather than joining on the way), spread over the 164 exits in proportion (0.40); the other through cars come from the Telegraph Ave and south-side approaches that feed the street's south end. Ranges: low = 131 (32) x 0.47 x 0.62 (the whole-street share of exits), high = 131 (32) x 0.47.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | OBSERVED turn count x ASSUMPTION share (131 left turns x 0.40) | 52 (38 to 62) | 64 | above |
| Telegraph Ave and south-side traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | ASSUMPTION: the through left-turners (131 x 0.62 = 81) that are not off-ramp traffic | 29 (19 to 43) | 51 | above |
| SR-24 off-ramp traffic using Colby St to reach College Ave and Berkeley (right at Alcatraz Ave) | OBSERVED turn count x ASSUMPTION share (32 right turns x 0.40) | 13 (9 to 15) | 17 | above |
| Telegraph Ave and south-side traffic using Colby St to reach College Ave and Berkeley | ASSUMPTION: the through right-turners (32 x 0.62 = 20) that are not off-ramp traffic | 7 (5 to 11) | 16 | above |
| Intents listed, together | | 101 (71 to 131) | 148 | |
| Other through cars (no intent listed) | | | 2 | |

Model through cars by origin and destination group (largest 12 of 31 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 63.9 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 17.6 | Claremont Avenue then College Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 11.5 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Emeryville and West Oakland streets (55th to 67th Streets) | 11.5 | Claremont Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 7.6 | SR-24 |
| Telegraph Ave to the south (downtown Oakland) | Telegraph Ave from the north (Berkeley) | 7.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 6.7 | SR-24 then Claremont Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Ashby Ave from the west (Emeryville and I-80) | 6.6 | none near the study area |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Shattuck Ave from the north (Berkeley) | 4.3 | Claremont Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Telegraph Ave from the north (Berkeley) | 3.9 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | College Ave from the north (Berkeley) | 2.7 | SR-24 then Claremont Avenue then College Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Claremont Ave and Tunnel Rd toward the hills | 1.6 | Claremont Avenue |
| other pairs | | 5.7 | |

By the arterial these cars would otherwise use: Telegraph Avenue 87 veh/h; Claremont Avenue 20 veh/h; Claremont Avenue then College Avenue 18 veh/h; SR-24 8 veh/h; none near the study area 7 veh/h; SR-24 then Claremont Avenue 7 veh/h.

### Hillegass Avenue NB

Observed: block volume 110 veh/h, whole-street cars 48, so through cars 48 to 95 veh/h. Model: 70 through cars per hour.

Observed (PM): 94 cars entered at the south end, 48 drove the whole street, 109 left it at Alcatraz Ave (43 west, 54 east, 12 straight), and 47% of the block's trips came from a freeway. ASSUMPTION: freeway-origin through cars are 40 veh/h (52 freeway-origin trips times 94 / (94 + 29)), spread over the exits in proportion (0.37); the through share of exits is 48 / 109 = 0.44.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Hillegass Ave to reach Alcatraz Ave west and Telegraph Ave north | OBSERVED turn count x ASSUMPTION share (43 left turns x 0.37) | 16 (9 to 20) | 17 | within |
| SR-24 off-ramp traffic using Hillegass Ave to reach College Ave and Berkeley | OBSERVED turn count x ASSUMPTION share (54 right turns x 0.37) | 20 (11 to 25) | 26 | above |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach Alcatraz Ave west | ASSUMPTION: through exits (43 x 0.44) that are not off-ramp traffic | 3 (0 to 10) | 6 | within |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach College Ave and Berkeley | ASSUMPTION: through exits (54 x 0.44) that are not off-ramp traffic | 4 (0 to 13) | 15 | above |
| Intents listed, together | | 43 (20 to 68) | 64 | |
| Other through cars (no intent listed) | | | 5 | |

Model through cars by origin and destination group (largest 12 of 38 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 13.9 | SR-24 |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 9.3 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 6.6 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | College Ave from the north (Berkeley) | 6.1 | SR-24 then Claremont Avenue then College Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 5.6 | SR-24 then Claremont Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Claremont Ave and Tunnel Rd toward the hills | 3.0 | Claremont Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Telegraph Ave from the north (Berkeley) | 2.2 | none near the study area |
| SR-13 Warren Freeway (via SR-24 east) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 2.1 | Claremont Avenue then Alcatraz Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | San Pablo Ave (Emeryville and West Oakland) | 1.7 | College Avenue then Alcatraz Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 1.7 | Claremont Avenue then College Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Alcatraz Ave from the west (Emeryville side) | 1.7 | SR-24 then Telegraph Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | San Pablo Ave (Emeryville and West Oakland) | 1.7 | SR-24 |
| other pairs | | 14.1 | |

By the arterial these cars would otherwise use: Telegraph Avenue 20 veh/h; SR-24 16 veh/h; Claremont Avenue 8 veh/h; SR-24 then Claremont Avenue then College Avenue 6 veh/h; SR-24 then Claremont Avenue 6 veh/h; SR-24 then Telegraph Avenue 3 veh/h.

### Hillegass Avenue SB

Observed: block volume 160 veh/h, whole-street cars 79, so through cars 79 to 120 veh/h. Model: 109 through cars per hour.

Observed (PM): 178 cars entered at the top (76 turned in from Alcatraz Ave west, 98 from the east, 4 came straight from the north), 79 drove the whole street, and 68% of the block's trips (109 veh/h) went to a freeway. ASSUMPTION: freeway-bound cars that did not join mid-street are 87 veh/h (109 x 178 / (178 + 44)), half of the 174 turn-ins; low = the whole-street share of the turn-ins (0.45), high = the freeway-bound share without the mid-street correction (0.63).

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Telegraph Ave, Alcatraz Ave west and West Berkeley traffic turning off Alcatraz Ave onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (76 turn-ins x 0.50) | 38 (34 to 48) | 39 | within |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (98 turn-ins x 0.50) | 49 (44 to 62) | 50 | within |
| Intents listed, together | | 87 (78 to 110) | 89 | |
| Other through cars (no intent listed) | | | 19 | |

Model through cars by origin and destination group (largest 12 of 29 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 39.1 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 23.2 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 15.1 | Claremont Avenue then SR-24 |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 8.3 | College Avenue then Claremont Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 6.4 | Telegraph Avenue |
| Ashby Ave from the west (Emeryville and I-80) | College Ave from the north (Berkeley) | 5.4 | Alcatraz Avenue then College Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 1.9 | Claremont Avenue |
| West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 1.9 | College Avenue |
| Berkeley hills to the northeast (Evergreen Ln, Gravatt Dr) | SR-24 westbound on-ramps (toward Oakland and I-980) | 1.5 | SR-24 |
| Telegraph Ave from the north (Berkeley) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 1.0 | College Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 0.7 | Alcatraz Avenue then College Avenue |
| Ashby Ave from the west (Emeryville and I-80) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 0.6 | Alcatraz Avenue then Claremont Avenue |
| other pairs | | 3.5 | |

By the arterial these cars would otherwise use: Telegraph Avenue 70 veh/h; Claremont Avenue then SR-24 15 veh/h; College Avenue then Claremont Avenue then SR-24 8 veh/h; Alcatraz Avenue then College Avenue 6 veh/h; College Avenue 3 veh/h; Claremont Avenue 2 veh/h.

### Colby Street SB

Observed: block volume 160 veh/h, whole-street cars 39, so through cars 39 to 117 veh/h. Model: 110 through cars per hour.

Observed (PM): 139 cars entered at the top (76 from Alcatraz Ave west, 50 from the east, 13 from the north), 39 drove the whole street, 45% of the block's trips (72 veh/h) went to a freeway and 22% came by way of Telegraph Ave. ASSUMPTION: freeway-bound cars that did not join mid-street are 46 veh/h (72 x 139 / (139 + 79)), 0.365 of the 126 turn-ins; low = the whole-street share (0.31), high = the unadjusted freeway share (0.57). The Telegraph Ave cars are the 22% x 160 = 35 of the 76 west turn-ins.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Southbound Telegraph Ave traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (35 Telegraph Ave cars x 0.365) | 13 (11 to 20) | 17 | within |
| Alcatraz Ave west, Ashby Ave and West Berkeley traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (41 other west turn-ins x 0.365) | 15 (13 to 23) | 15 | within |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (50 east turn-ins x 0.365) | 18 (15 to 29) | 41 | above |
| Intents listed, together | | 46 (39 to 72) | 73 | |
| Other through cars (no intent listed) | | | 37 | |

Model through cars by origin and destination group (largest 12 of 53 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 25.5 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 17.1 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 15.5 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 10.1 | Claremont Avenue then SR-24 |
| Shattuck Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 8.2 | none near the study area |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 4.8 | College Avenue then Claremont Avenue then SR-24 |
| Ashby Ave from the west (Emeryville and I-80) | College Ave from the north (Berkeley) | 3.9 | Alcatraz Avenue then College Avenue |
| Telegraph Ave from the north (Berkeley) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 2.9 | Telegraph Avenue |
| Ashby Ave from the west (Emeryville and I-80) | SR-13 Warren Freeway (via SR-24 east) | 2.7 | SR-24 |
| Ashby Ave from the west (Emeryville and I-80) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 2.5 | SR-24 |
| Telegraph Ave from the north (Berkeley) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 1.9 | none near the study area |
| West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 1.6 | College Avenue |
| other pairs | | 13.7 | |

By the arterial these cars would otherwise use: Telegraph Avenue 64 veh/h; none near the study area 13 veh/h; Claremont Avenue then SR-24 10 veh/h; SR-24 7 veh/h; Alcatraz Avenue then College Avenue 5 veh/h; College Avenue then Claremont Avenue then SR-24 5 veh/h.

### Study area, all residential and service streets

Model: 639 through cars per hour.

Model through cars by origin and destination group (largest 12 of 112 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 73.6 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 70.4 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 52.0 | Claremont Avenue then College Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 49.4 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Emeryville and West Oakland streets (55th to 67th Streets) | 40.2 | Claremont Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 37.8 | Telegraph Avenue |
| West Oakland to the southwest (Adeline St, Market St) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 32.6 | Telegraph Avenue then Claremont Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 23.7 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 22.9 | Claremont Avenue then SR-24 |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 21.3 | SR-24 |
| Emeryville and West Oakland streets (55th to 67th Streets) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 20.2 | none near the study area |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 15.8 | Telegraph Avenue |
| other pairs | | 178.8 | |

By the arterial these cars would otherwise use: Telegraph Avenue 318 veh/h; Claremont Avenue 73 veh/h; Claremont Avenue then College Avenue 52 veh/h; none near the study area 45 veh/h; SR-24 34 veh/h; Telegraph Avenue then Claremont Avenue 33 veh/h.

By origin group: South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 140; Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 123; SR-24 eastbound off-ramps (arriving from Oakland and I-980) 120; Telegraph Ave from the north (Berkeley) 62; West Oakland to the southwest (Adeline St, Market St) 47; Claremont Ave and Tunnel Rd toward the hills 26; Telegraph Ave to the south (downtown Oakland) 26; Emeryville and West Oakland streets (55th to 67th Streets) 22; Ashby Ave from the west (Emeryville and I-80) 18; College Ave from the north (Berkeley) 14.

By destination group: SR-24 westbound on-ramps (toward Oakland and I-980) 178; Telegraph Ave from the north (Berkeley) 140; South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 103; Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 55; Emeryville and West Oakland streets (55th to 67th Streets) 42; Claremont Ave and Tunnel Rd toward the hills 40; College Ave from the north (Berkeley) 21; Shattuck Ave from the north (Berkeley) 13; Ashby Ave from the west (Emeryville and I-80) 10; San Pablo Ave (Emeryville and West Oakland) 7.


Per-seed detail: `rockridge-pm_peak-s1-seed1.md` (seed 1 in full).
