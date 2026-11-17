# rockridge-pm_peak-s1 over 10 seeds (1, 2, 3, 4, 5, 6, 7, 8, 9, 10)

Seeds are the fixed list above, none chosen; each run is 60 minutes from the same start. Interval = 95% interval of the mean (Student t, n - 1 degrees of freedom). Run-to-run noise only: demand is fixed, so day-to-day variation is not in these intervals.

## Stability rule (design decision D16)

| Check | Rule | Result | Pass |
| --- | --- | --- | --- |
| Cars cleared from gridlock near the study area (judged zone) | mean per hour below 1.00 | 0.00 (min 0.00, max 0.00) | yes |
| Entry backlog | below 2.0% in at least 90% of seeds | 10 of 10 seeds | yes |
| Runaway growth | no seed adds more than 2.0 points of backlog in the second half | none | yes |
| Arterial speed | mean above 4.0 m/s | 8.26 m/s | yes |

**Verdict: stable.** Old rule (zero removals, backlog under 2%, speed above 4 m/s, every seed): 4 of 10 seeds pass.

## Metrics over seeds

| Group | Metric | Unit | Mean | SD | Min | Max | 95% interval |
| --- | --- | --- | --- | --- | --- | --- | --- |
| health | gridlock removals | vehicles | 1.20 | 1.32 | 0.00 | 4.00 | 0.26 to 2.14 |
| health | gridlock removals per hour | veh/h | 1.20 | 1.32 | 0.00 | 4.00 | 0.26 to 2.14 |
| health | entry backlog | % of spawned | 0.63 | 0.28 | 0.17 | 1.01 | 0.43 to 0.82 |
| health | backlog growth in the second half of the run | points of spawned | 0.34 | 0.19 | -0.06 | 0.60 | 0.20 to 0.48 |
| health | completed trips | trips | 25798.90 | 143.80 | 25515.00 | 26012.00 | 25696.04 to 25901.76 |
| health | arterial mean speed | m/s | 8.26 | 0.15 | 8.06 | 8.50 | 8.16 to 8.36 |
| health | arterial mean speed, last 15 min | m/s | 8.06 | 0.27 | 7.65 | 8.60 | 7.87 to 8.25 |
| junction recovery | courtesy admissions per hour | veh/h | 316.40 | 27.73 | 282.00 | 362.00 | 296.57 to 336.23 |
| junction recovery | yield fallback admissions per hour | veh/h | 130.20 | 24.10 | 94.00 | 174.00 | 112.96 to 147.44 |
| junction recovery | conflict bypass admissions per hour | veh/h | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| junction recovery | vehicles removed while held in a node, per hour | veh/h | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| gridlock by place | cars cleared from gridlock per hour, judged (near the study area, and far ones whose chain reaches it) | veh/h | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| gridlock by place | cars cleared from gridlock per hour, near the study area | veh/h | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| gridlock by place | cars cleared from gridlock per hour, farther out | veh/h | 1.20 | 1.32 | 0.00 | 4.00 | 0.26 to 2.14 |
| gridlock by place | cars cleared from gridlock per hour, farther out with a chain into the judged zone | veh/h | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| gridlock by place | trips waiting at origins in the judged zone at the end | trips | 0.60 | 1.07 | 0.00 | 3.00 | -0.17 to 1.37 |
| cut-through | local vehicle-miles, surface gates to the freeway | veh-miles | 38.33 | 4.53 | 31.01 | 46.30 | 35.09 to 41.57 |
| cut-through | share of local vehicle-miles, surface gates to the freeway | % | 8.5 | 0.9 | 7.2 | 9.6 | 7.9 to 9.1 |
| cut-through | local vehicle-miles, freeway to the surface gates | veh-miles | 34.29 | 3.73 | 29.61 | 39.72 | 31.63 to 36.96 |
| cut-through | share of local vehicle-miles, freeway to the surface gates | % | 7.6 | 0.9 | 6.3 | 9.3 | 7.0 to 8.3 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue N | trips | 42.90 | 3.67 | 37.00 | 47.00 | 40.28 to 45.52 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue N | trips | 1502.90 | 17.16 | 1471.00 | 1524.00 | 1490.62 to 1515.18 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue S | trips | 73.70 | 10.09 | 57.00 | 87.00 | 66.48 to 80.92 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue S | trips | 1283.40 | 18.56 | 1261.00 | 1322.00 | 1270.12 to 1296.68 |
| headline share | Hillegass Avenue NB from freeway | % | 52.3 | 4.2 | 43.8 | 59.9 | 49.3 to 55.3 |
| share | Hillegass Avenue NB to Benvenue Avenue | % | 4.2 | 1.1 | 2.4 | 6.0 | 3.4 to 5.0 |
| share | Hillegass Avenue NB to College Avenue | % | 15.4 | 2.3 | 11.2 | 18.6 | 13.7 to 17.0 |
| share | Hillegass Avenue NB to Alcatraz Avenue WB | % | 28.5 | 3.3 | 23.3 | 32.9 | 26.1 to 30.9 |
| headline share | Colby Street NB from freeway | % | 49.6 | 3.9 | 43.0 | 54.1 | 46.8 to 52.4 |
| share | Colby Street NB to Alcatraz Avenue WB | % | 47.9 | 3.4 | 40.9 | 53.3 | 45.5 to 50.3 |
| share | Colby Street NB to Telegraph Avenue | % | 37.4 | 4.4 | 30.1 | 42.1 | 34.2 to 40.6 |
| share | Colby Street NB to College Avenue | % | 5.8 | 1.8 | 3.4 | 8.9 | 4.6 to 7.1 |
| share | Hillegass Avenue SB from Alcatraz Avenue WB | % | 38.3 | 3.3 | 31.6 | 44.0 | 35.9 to 40.6 |
| share | Hillegass Avenue SB from Benvenue Avenue | % | 10.2 | 3.3 | 6.4 | 15.7 | 7.9 to 12.6 |
| share | Hillegass Avenue SB from College Avenue | % | 21.3 | 3.0 | 15.3 | 25.9 | 19.1 to 23.4 |
| headline share | Hillegass Avenue SB to freeway | % | 61.4 | 5.5 | 52.4 | 68.6 | 57.5 to 65.3 |
| share | Colby Street SB from Alcatraz Avenue EB | % | 21.1 | 3.0 | 14.7 | 23.9 | 19.0 to 23.2 |
| share | Colby Street SB from Alcatraz Avenue WB | % | 17.3 | 2.2 | 14.3 | 20.6 | 15.7 to 18.8 |
| share | Colby Street SB from Telegraph Avenue | % | 20.3 | 2.1 | 16.5 | 23.2 | 18.8 to 21.8 |
| headline share | Colby Street SB to freeway | % | 41.4 | 2.8 | 37.1 | 46.1 | 39.4 to 43.5 |
| share | Colby Street SB to Forest Street | % | 22.0 | 2.6 | 18.6 | 25.3 | 20.1 to 23.8 |
| ramp share | onto freeway via College Avenue | % | 14.5 | 1.6 | 12.2 | 16.6 | 13.4 to 15.6 |
| ramp share | onto freeway via Hillegass Avenue | % | 14.6 | 1.3 | 12.2 | 16.3 | 13.7 to 15.5 |
| ramp share | onto freeway via Martin Street | % | 12.0 | 1.1 | 10.5 | 13.6 | 11.3 to 12.8 |
| ramp share | onto freeway via Colby Street | % | 12.8 | 1.3 | 11.1 | 15.2 | 11.8 to 13.7 |
| ramp share | onto freeway via Telegraph Avenue north of Alcatraz Avenue | % | 11.1 | 1.1 | 8.8 | 13.0 | 10.3 to 11.9 |
| ramp share | onto freeway via Benvenue Avenue | % | 4.7 | 1.0 | 3.2 | 6.6 | 4.0 to 5.4 |
| ramp share | from freeway via College Avenue | % | 9.3 | 1.0 | 7.4 | 10.7 | 8.6 to 10.0 |
| ramp share | from freeway via Martin Street | % | 12.3 | 1.2 | 10.2 | 14.0 | 11.5 to 13.1 |
| ramp share | from freeway via Colby Street | % | 13.1 | 1.4 | 11.3 | 15.5 | 12.1 to 14.1 |
| ramp share | from freeway via Hillegass Avenue | % | 8.5 | 1.2 | 7.3 | 10.6 | 7.7 to 9.4 |
| ramp share | from freeway via Benvenue Avenue | % | 2.5 | 0.6 | 1.4 | 3.2 | 2.1 to 2.9 |
| corridor flow | Telegraph N median link flow | veh/h | 1019.76 | 59.40 | 888.00 | 1096.80 | 977.27 to 1062.25 |
| corridor flow | Telegraph S median link flow | veh/h | 1089.12 | 67.07 | 993.60 | 1208.40 | 1041.14 to 1137.10 |
| corridor flow | College N median link flow | veh/h | 420.60 | 35.52 | 370.80 | 506.40 | 395.19 to 446.01 |
| corridor flow | College S median link flow | veh/h | 542.40 | 59.86 | 451.20 | 661.20 | 499.58 to 585.22 |
| corridor flow | Claremont N median link flow | veh/h | 468.48 | 35.24 | 428.40 | 529.20 | 443.27 to 493.69 |
| corridor flow | Claremont S median link flow | veh/h | 329.28 | 31.33 | 288.00 | 381.60 | 306.87 to 351.69 |
| corridor flow | Alcatraz E median link flow | veh/h | 477.24 | 49.24 | 399.60 | 554.40 | 442.02 to 512.46 |
| corridor flow | Alcatraz W median link flow | veh/h | 344.52 | 16.07 | 315.60 | 372.00 | 333.02 to 356.02 |
| corridor flow | Hillegass N median link flow | veh/h | 121.68 | 8.36 | 106.80 | 133.20 | 115.70 to 127.66 |
| corridor flow | Hillegass S median link flow | veh/h | 129.72 | 16.49 | 114.00 | 166.80 | 117.93 to 141.51 |
| corridor flow | Colby N median link flow | veh/h | 169.80 | 9.33 | 153.60 | 180.00 | 163.12 to 176.48 |
| corridor flow | Colby S median link flow | veh/h | 169.56 | 13.27 | 150.00 | 187.20 | 160.07 to 179.05 |
| corridor flow | Martin E median link flow | veh/h | 118.56 | 16.33 | 104.40 | 146.40 | 106.88 to 130.24 |
| corridor flow | Martin W median link flow | veh/h | 161.64 | 35.42 | 121.20 | 220.80 | 136.31 to 186.97 |

## Intent map: through cars by where they come from and where they are going

Through = neither trip end is in the study area. Groups are the approach groups of the area config (data/areas); a node that is not a gate takes the group of the nearest surface gate (ASSUMPTION). The arterial is the one a trip would use on the shortest free-flow path with the study area's residential and service streets closed, where that path runs on a boundary street near the study area.

Model figures are the mean of 10 seed(s), per hour of the run. Basis: OBSERVED = read from the resident volunteer count of Feb 25, 2025 or its headline shares; ASSUMPTION = inferred from those numbers or chosen.

### Colby Street NB

Observed: block volume 174 veh/h, whole-street cars 102, so through cars 102 to 145 veh/h. Model: 150 through cars per hour.

Observed (PM): 182 cars entered at the south end, 102 drove the whole street, 164 left it at Alcatraz Ave (131 left, 32 right, 1 straight), and 47% of the block's trips came from a freeway (the headline share). ASSUMPTION: freeway-origin cars that do not end along the street are 65 veh/h (the 82 freeway-origin trips on the block, 47% of 174, times the 182 / (182 + 47) of its cars that entered at the south end rather than joining on the way), spread over the 164 exits in proportion (0.40); the other through cars come from the Telegraph Ave and south-side approaches that feed the street's south end. Ranges: low = 131 (32) x 0.47 x 0.62 (the whole-street share of exits), high = 131 (32) x 0.47.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | OBSERVED turn count x ASSUMPTION share (131 left turns x 0.40) | 52 (38 to 62) | 64 | above |
| Telegraph Ave and south-side traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | ASSUMPTION: the through left-turners (131 x 0.62 = 81) that are not off-ramp traffic | 29 (19 to 43) | 32 | within |
| SR-24 off-ramp traffic using Colby St to reach College Ave and Berkeley (right at Alcatraz Ave) | OBSERVED turn count x ASSUMPTION share (32 right turns x 0.40) | 13 (9 to 15) | 12 | within |
| Telegraph Ave and south-side traffic using Colby St to reach College Ave and Berkeley | ASSUMPTION: the through right-turners (32 x 0.62 = 20) that are not off-ramp traffic | 7 (5 to 11) | 38 | above |
| Intents listed, together | | 101 (71 to 131) | 147 | |
| Other through cars (no intent listed) | | | 3 | |

Model through cars by origin and destination group (largest 12 of 28 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 64.1 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 32.7 | Telegraph Avenue |
| Telegraph Ave to the south (downtown Oakland) | Telegraph Ave from the north (Berkeley) | 7.8 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 6.6 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 6.1 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Ashby Ave from the west (Emeryville and I-80) | 6.0 | none near the study area |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Shattuck Ave from the north (Berkeley) | 6.0 | Claremont Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Telegraph Ave from the north (Berkeley) | 4.1 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | College Ave from the north (Berkeley) | 3.9 | SR-24 then Claremont Avenue then College Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 2.4 | SR-24 |
| Telegraph Ave to the south (downtown Oakland) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 2.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Emeryville and West Oakland streets (55th to 67th Streets) | 1.8 | Claremont Avenue |
| other pairs | | 6.3 | |

By the arterial these cars would otherwise use: Telegraph Avenue 124 veh/h; Claremont Avenue 9 veh/h; none near the study area 6 veh/h; SR-24 then Claremont Avenue then College Avenue 4 veh/h; SR-24 2 veh/h; Alcatraz Avenue then Claremont Avenue 2 veh/h.

### Hillegass Avenue NB

Observed: block volume 110 veh/h, whole-street cars 48, so through cars 48 to 95 veh/h. Model: 92 through cars per hour.

Observed (PM): 94 cars entered at the south end, 48 drove the whole street, 109 left it at Alcatraz Ave (43 west, 54 east, 12 straight), and 47% of the block's trips came from a freeway. ASSUMPTION: freeway-origin through cars are 40 veh/h (52 freeway-origin trips times 94 / (94 + 29)), spread over the exits in proportion (0.37); the through share of exits is 48 / 109 = 0.44.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Hillegass Ave to reach Alcatraz Ave west and Telegraph Ave north | OBSERVED turn count x ASSUMPTION share (43 left turns x 0.37) | 16 (9 to 20) | 25 | above |
| SR-24 off-ramp traffic using Hillegass Ave to reach College Ave and Berkeley | OBSERVED turn count x ASSUMPTION share (54 right turns x 0.37) | 20 (11 to 25) | 31 | above |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach Alcatraz Ave west | ASSUMPTION: through exits (43 x 0.44) that are not off-ramp traffic | 3 (0 to 10) | 6 | within |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach College Ave and Berkeley | ASSUMPTION: through exits (54 x 0.44) that are not off-ramp traffic | 4 (0 to 13) | 26 | above |
| Intents listed, together | | 43 (20 to 68) | 88 | |
| Other through cars (no intent listed) | | | 4 | |

Model through cars by origin and destination group (largest 12 of 39 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 19.1 | SR-24 |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 18.1 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 14.5 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | College Ave from the north (Berkeley) | 6.5 | SR-24 then Claremont Avenue then College Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 4.6 | SR-24 then Claremont Avenue |
| Telegraph Ave to the south (downtown Oakland) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 4.5 | Telegraph Avenue |
| SR-13 Warren Freeway (via SR-24 east) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 3.3 | Claremont Avenue then Alcatraz Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Ashby Ave from the west (Emeryville and I-80) | 1.8 | SR-24 then Telegraph Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Telegraph Ave from the north (Berkeley) | 1.7 | none near the study area |
| West Oakland to the southwest (Adeline St, Market St) | Claremont Ave and Tunnel Rd toward the hills | 1.6 | Claremont Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 1.5 | Telegraph Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | San Pablo Ave (Emeryville and West Oakland) | 1.5 | SR-24 |
| other pairs | | 13.8 | |

By the arterial these cars would otherwise use: Telegraph Avenue 42 veh/h; SR-24 21 veh/h; SR-24 then Claremont Avenue then College Avenue 6 veh/h; Claremont Avenue 6 veh/h; SR-24 then Claremont Avenue 5 veh/h; Claremont Avenue then Alcatraz Avenue 4 veh/h.

### Hillegass Avenue SB

Observed: block volume 160 veh/h, whole-street cars 79, so through cars 79 to 120 veh/h. Model: 116 through cars per hour.

Observed (PM): 178 cars entered at the top (76 turned in from Alcatraz Ave west, 98 from the east, 4 came straight from the north), 79 drove the whole street, and 68% of the block's trips (109 veh/h) went to a freeway. ASSUMPTION: freeway-bound cars that did not join mid-street are 87 veh/h (109 x 178 / (178 + 44)), half of the 174 turn-ins; low = the whole-street share of the turn-ins (0.45), high = the freeway-bound share without the mid-street correction (0.63).

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Telegraph Ave, Alcatraz Ave west and West Berkeley traffic turning off Alcatraz Ave onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (76 turn-ins x 0.50) | 38 (34 to 48) | 40 | within |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (98 turn-ins x 0.50) | 49 (44 to 62) | 55 | within |
| Intents listed, together | | 87 (78 to 110) | 95 | |
| Other through cars (no intent listed) | | | 21 | |

Model through cars by origin and destination group (largest 12 of 35 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 39.4 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 25.6 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 16.7 | Claremont Avenue then SR-24 |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 10.5 | College Avenue then Claremont Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 5.5 | Telegraph Avenue |
| Ashby Ave from the west (Emeryville and I-80) | College Ave from the north (Berkeley) | 4.7 | Alcatraz Avenue then College Avenue |
| College Ave from the north (Berkeley) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 4.4 | College Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 1.2 | Claremont Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 1.1 | Claremont Avenue |
| Berkeley hills to the northeast (Evergreen Ln, Gravatt Dr) | SR-24 westbound on-ramps (toward Oakland and I-980) | 1.0 | SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Telegraph Ave to the south (downtown Oakland) | 0.7 | Telegraph Avenue |
| San Pablo Ave (Emeryville and West Oakland) | Claremont Ave and Tunnel Rd toward the hills | 0.6 | Alcatraz Avenue then Claremont Avenue |
| other pairs | | 4.7 | |

By the arterial these cars would otherwise use: Telegraph Avenue 72 veh/h; Claremont Avenue then SR-24 17 veh/h; College Avenue then Claremont Avenue then SR-24 10 veh/h; Alcatraz Avenue then College Avenue 5 veh/h; College Avenue 4 veh/h; Claremont Avenue 2 veh/h.

### Colby Street SB

Observed: block volume 160 veh/h, whole-street cars 39, so through cars 39 to 117 veh/h. Model: 122 through cars per hour.

Observed (PM): 139 cars entered at the top (76 from Alcatraz Ave west, 50 from the east, 13 from the north), 39 drove the whole street, 45% of the block's trips (72 veh/h) went to a freeway and 22% came by way of Telegraph Ave. ASSUMPTION: freeway-bound cars that did not join mid-street are 46 veh/h (72 x 139 / (139 + 79)), 0.365 of the 126 turn-ins; low = the whole-street share (0.31), high = the unadjusted freeway share (0.57). The Telegraph Ave cars are the 22% x 160 = 35 of the 76 west turn-ins.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Southbound Telegraph Ave traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (35 Telegraph Ave cars x 0.365) | 13 (11 to 20) | 17 | within |
| Alcatraz Ave west, Ashby Ave and West Berkeley traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (41 other west turn-ins x 0.365) | 15 (13 to 23) | 18 | within |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (50 east turn-ins x 0.365) | 18 (15 to 29) | 48 | above |
| Intents listed, together | | 46 (39 to 72) | 83 | |
| Other through cars (no intent listed) | | | 39 | |

Model through cars by origin and destination group (largest 12 of 54 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 30.0 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 14.9 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 11.6 | Claremont Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 11.0 | Telegraph Avenue |
| Shattuck Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 8.0 | none near the study area |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 6.2 | College Avenue then Claremont Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Telegraph Ave to the south (downtown Oakland) | 5.6 | Telegraph Avenue |
| Ashby Ave from the west (Emeryville and I-80) | College Ave from the north (Berkeley) | 4.9 | Alcatraz Avenue then College Avenue |
| Ashby Ave from the west (Emeryville and I-80) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 3.1 | SR-24 |
| Emeryville and West Oakland streets (55th to 67th Streets) | Claremont Ave and Tunnel Rd toward the hills | 2.3 | Alcatraz Avenue then Claremont Avenue |
| College Ave from the north (Berkeley) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 2.2 | College Avenue |
| Alcatraz Ave from the west (Emeryville side) | SR-13 Warren Freeway (via SR-24 east) | 2.1 | SR-24 |
| other pairs | | 20.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 64 veh/h; none near the study area 12 veh/h; Claremont Avenue then SR-24 12 veh/h; SR-24 9 veh/h; College Avenue then Claremont Avenue then SR-24 6 veh/h; Alcatraz Avenue then Claremont Avenue 6 veh/h.

### Study area, all residential and service streets

Model: 704 through cars per hour.

Model through cars by origin and destination group (largest 12 of 105 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 97.3 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 86.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 75.3 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 48.3 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 41.7 | Telegraph Avenue |
| Telegraph Ave to the south (downtown Oakland) | SR-24 westbound on-ramps (toward Oakland and I-980) | 27.2 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 24.6 | Claremont Avenue then SR-24 |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 20.3 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 19.3 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 19.2 | SR-24 |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Shattuck Ave from the north (Berkeley) | 18.4 | Claremont Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Emeryville and West Oakland streets (55th to 67th Streets) | 15.3 | Claremont Avenue |
| other pairs | | 211.2 | |

By the arterial these cars would otherwise use: Telegraph Avenue 472 veh/h; Claremont Avenue 51 veh/h; none near the study area 44 veh/h; SR-24 31 veh/h; Alcatraz Avenue then Claremont Avenue 26 veh/h; Claremont Avenue then SR-24 25 veh/h.

By origin group: South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 166; Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 145; SR-24 eastbound off-ramps (arriving from Oakland and I-980) 126; Telegraph Ave from the north (Berkeley) 58; Telegraph Ave to the south (downtown Oakland) 52; Claremont Ave and Tunnel Rd toward the hills 28; College Ave from the north (Berkeley) 22; Ashby Ave from the west (Emeryville and I-80) 22; Emeryville and West Oakland streets (55th to 67th Streets) 20; West Oakland to the southwest (Adeline St, Market St) 13.

By destination group: SR-24 westbound on-ramps (toward Oakland and I-980) 230; Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 143; Telegraph Ave from the north (Berkeley) 113; South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 60; Claremont Ave and Tunnel Rd toward the hills 47; College Ave from the north (Berkeley) 26; Shattuck Ave from the north (Berkeley) 19; Telegraph Ave to the south (downtown Oakland) 16; Emeryville and West Oakland streets (55th to 67th Streets) 16; Ashby Ave from the west (Emeryville and I-80) 8.


Per-seed detail: `rockridge-pm_peak-s1-seed1.md` (seed 1 in full).
