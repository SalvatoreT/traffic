# rockridge-pm_peak-s1 over 10 seeds (1, 2, 3, 4, 5, 6, 7, 8, 9, 10)

Seeds are the fixed list above, none chosen; each run is 60 minutes from the same start. Interval = 95% interval of the mean (Student t, n - 1 degrees of freedom). Run-to-run noise only: demand is fixed, so day-to-day variation is not in these intervals.

## Stability rule (design decision D16)

| Check | Rule | Result | Pass |
| --- | --- | --- | --- |
| Removals | mean per hour below 1.00 | 4.50 (min 0.00, max 10.00) | NO |
| Entry backlog | below 2.0% in at least 90% of seeds | 10 of 10 seeds | yes |
| Runaway growth | no seed adds more than 2.0 points of backlog in the second half | none | yes |
| Arterial speed | mean above 4.0 m/s | 7.96 m/s | yes |

**Verdict: not stable.** Old rule (zero removals, backlog under 2%, speed above 4 m/s, every seed): 1 of 10 seeds pass.

## Metrics over seeds

| Group | Metric | Unit | Mean | SD | Min | Max | 95% interval |
| --- | --- | --- | --- | --- | --- | --- | --- |
| health | gridlock removals | vehicles | 4.50 | 3.14 | 0.00 | 10.00 | 2.26 to 6.74 |
| health | gridlock removals per hour | veh/h | 4.50 | 3.14 | 0.00 | 10.00 | 2.26 to 6.74 |
| health | entry backlog | % of spawned | 0.17 | 0.13 | 0.02 | 0.47 | 0.08 to 0.27 |
| health | backlog growth in the second half of the run | points of spawned | 0.09 | 0.09 | -0.01 | 0.28 | 0.03 to 0.15 |
| health | completed trips | trips | 24637.50 | 212.72 | 24148.00 | 24895.00 | 24485.34 to 24789.66 |
| health | arterial mean speed | m/s | 7.96 | 0.10 | 7.83 | 8.11 | 7.88 to 8.03 |
| health | arterial mean speed, last 15 min | m/s | 7.81 | 0.19 | 7.56 | 8.13 | 7.67 to 7.94 |
| junction recovery | courtesy admissions per hour | veh/h | 416.90 | 31.53 | 370.00 | 466.00 | 394.35 to 439.45 |
| junction recovery | yield fallback admissions per hour | veh/h | 195.30 | 16.82 | 170.00 | 221.00 | 183.27 to 207.33 |
| junction recovery | conflict bypass admissions per hour | veh/h | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| junction recovery | vehicles removed while held in a node, per hour | veh/h | 0.30 | 0.67 | 0.00 | 2.00 | -0.18 to 0.78 |
| cut-through | local vehicle-miles, surface gates to the freeway | veh-miles | 39.49 | 5.32 | 32.23 | 49.86 | 35.68 to 43.30 |
| cut-through | share of local vehicle-miles, surface gates to the freeway | % | 6.7 | 0.9 | 5.4 | 8.6 | 6.1 to 7.4 |
| cut-through | local vehicle-miles, freeway to the surface gates | veh-miles | 34.35 | 4.23 | 27.91 | 39.75 | 31.33 to 37.38 |
| cut-through | share of local vehicle-miles, freeway to the surface gates | % | 5.8 | 0.7 | 4.7 | 6.8 | 5.3 to 6.4 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue N | trips | 51.00 | 4.08 | 44.00 | 56.00 | 48.08 to 53.92 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue N | trips | 1310.10 | 37.85 | 1225.00 | 1361.00 | 1283.02 to 1337.18 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue S | trips | 96.10 | 10.38 | 78.00 | 114.00 | 88.68 to 103.52 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue S | trips | 1509.50 | 57.86 | 1391.00 | 1571.00 | 1468.11 to 1550.89 |
| headline share | Hillegass Avenue NB from freeway | % | 52.9 | 3.9 | 47.2 | 60.1 | 50.1 to 55.6 |
| share | Hillegass Avenue NB to Benvenue Avenue | % | 3.9 | 1.3 | 2.0 | 6.8 | 3.0 to 4.8 |
| share | Hillegass Avenue NB to College Avenue | % | 17.8 | 3.2 | 13.8 | 23.3 | 15.5 to 20.0 |
| share | Hillegass Avenue NB to Alcatraz Avenue WB | % | 21.8 | 3.8 | 15.4 | 26.8 | 19.1 to 24.5 |
| headline share | Colby Street NB from freeway | % | 37.6 | 3.0 | 33.2 | 41.5 | 35.5 to 39.8 |
| share | Colby Street NB to Alcatraz Avenue WB | % | 47.7 | 2.0 | 44.2 | 50.4 | 46.2 to 49.1 |
| share | Colby Street NB to Telegraph Avenue | % | 45.6 | 2.6 | 41.5 | 48.7 | 43.8 to 47.4 |
| share | Colby Street NB to College Avenue | % | 5.5 | 1.6 | 2.7 | 7.4 | 4.4 to 6.7 |
| share | Hillegass Avenue SB from Alcatraz Avenue WB | % | 24.7 | 3.8 | 16.8 | 29.2 | 22.0 to 27.4 |
| share | Hillegass Avenue SB from Benvenue Avenue | % | 4.5 | 1.1 | 2.8 | 5.9 | 3.7 to 5.3 |
| share | Hillegass Avenue SB from College Avenue | % | 14.5 | 2.4 | 9.8 | 18.0 | 12.8 to 16.2 |
| headline share | Hillegass Avenue SB to freeway | % | 46.1 | 3.8 | 40.9 | 52.2 | 43.4 to 48.8 |
| share | Colby Street SB from Alcatraz Avenue EB | % | 27.8 | 3.1 | 21.3 | 32.3 | 25.6 to 30.0 |
| share | Colby Street SB from Alcatraz Avenue WB | % | 16.4 | 2.0 | 14.0 | 19.9 | 14.9 to 17.8 |
| share | Colby Street SB from Telegraph Avenue | % | 32.9 | 2.9 | 28.0 | 36.0 | 30.9 to 35.0 |
| headline share | Colby Street SB to freeway | % | 31.6 | 4.7 | 23.2 | 38.4 | 28.2 to 35.0 |
| share | Colby Street SB to Forest Street | % | 25.1 | 5.1 | 14.8 | 32.5 | 21.5 to 28.8 |
| ramp share | onto freeway via College Avenue | % | 13.4 | 1.7 | 10.5 | 15.6 | 12.1 to 14.6 |
| ramp share | onto freeway via Hillegass Avenue | % | 15.9 | 1.4 | 14.0 | 17.8 | 14.9 to 16.9 |
| ramp share | onto freeway via Martin Street | % | 12.1 | 1.3 | 10.1 | 14.2 | 11.2 to 13.1 |
| ramp share | onto freeway via Colby Street | % | 11.9 | 1.7 | 9.3 | 14.9 | 10.7 to 13.2 |
| ramp share | onto freeway via Telegraph Avenue north of Alcatraz Avenue | % | 14.4 | 1.6 | 12.1 | 17.3 | 13.3 to 15.6 |
| ramp share | onto freeway via Benvenue Avenue | % | 2.0 | 0.5 | 1.0 | 2.8 | 1.7 to 2.4 |
| ramp share | from freeway via College Avenue | % | 10.6 | 1.3 | 8.2 | 12.2 | 9.6 to 11.5 |
| ramp share | from freeway via Martin Street | % | 12.9 | 1.2 | 10.7 | 14.4 | 12.1 to 13.8 |
| ramp share | from freeway via Colby Street | % | 12.8 | 1.3 | 10.7 | 14.3 | 11.9 to 13.7 |
| ramp share | from freeway via Hillegass Avenue | % | 8.3 | 1.2 | 6.6 | 10.5 | 7.5 to 9.2 |
| ramp share | from freeway via Benvenue Avenue | % | 3.1 | 1.0 | 2.0 | 5.6 | 2.3 to 3.8 |
| corridor flow | Telegraph N median link flow | veh/h | 955.56 | 49.41 | 882.00 | 1034.40 | 920.22 to 990.90 |
| corridor flow | Telegraph S median link flow | veh/h | 943.80 | 69.58 | 858.00 | 1075.20 | 894.03 to 993.57 |
| corridor flow | College N median link flow | veh/h | 423.48 | 37.90 | 375.60 | 507.60 | 396.37 to 450.59 |
| corridor flow | College S median link flow | veh/h | 638.04 | 67.54 | 499.20 | 709.20 | 589.72 to 686.36 |
| corridor flow | Claremont N median link flow | veh/h | 506.40 | 41.28 | 458.40 | 556.80 | 476.88 to 535.92 |
| corridor flow | Claremont S median link flow | veh/h | 404.16 | 40.85 | 330.00 | 476.40 | 374.94 to 433.38 |
| corridor flow | Alcatraz E median link flow | veh/h | 475.80 | 27.08 | 432.00 | 512.40 | 456.43 to 495.17 |
| corridor flow | Alcatraz W median link flow | veh/h | 358.08 | 29.70 | 327.60 | 406.80 | 336.83 to 379.33 |
| corridor flow | Hillegass N median link flow | veh/h | 133.56 | 14.87 | 104.40 | 152.40 | 122.92 to 144.20 |
| corridor flow | Hillegass S median link flow | veh/h | 208.68 | 26.38 | 171.60 | 249.60 | 189.81 to 227.55 |
| corridor flow | Colby N median link flow | veh/h | 167.40 | 15.05 | 142.80 | 190.80 | 156.63 to 178.17 |
| corridor flow | Colby S median link flow | veh/h | 201.12 | 24.29 | 165.60 | 235.20 | 183.74 to 218.50 |
| corridor flow | Martin E median link flow | veh/h | 167.28 | 22.24 | 123.60 | 194.40 | 151.37 to 183.19 |
| corridor flow | Martin W median link flow | veh/h | 182.04 | 31.36 | 124.80 | 225.60 | 159.61 to 204.47 |

## Intent map: through cars by where they come from and where they are going

Through = neither trip end is in the study area. Groups are the approach groups of the area config (data/areas); a node that is not a gate takes the group of the nearest surface gate (ASSUMPTION). The arterial is the one a trip would use on the shortest free-flow path with the study area's residential and service streets closed, where that path runs on a boundary street near the study area.

Model figures are the mean of 10 seed(s), per hour of the run. Basis: OBSERVED = read from the resident volunteer count of Feb 25, 2025 or its headline shares; ASSUMPTION = inferred from those numbers or chosen.

### Colby Street NB

Observed: block volume 174 veh/h, whole-street cars 102, so through cars 102 to 145 veh/h. Model: 159 through cars per hour.

Observed (PM): 182 cars entered at the south end, 102 drove the whole street, 164 left it at Alcatraz Ave (131 left, 32 right, 1 straight), and 47% of the block's trips came from a freeway (the headline share). ASSUMPTION: freeway-origin cars that do not end along the street are 65 veh/h (the 82 freeway-origin trips on the block, 47% of 174, times the 182 / (182 + 47) of its cars that entered at the south end rather than joining on the way), spread over the 164 exits in proportion (0.40); the other through cars come from the Telegraph Ave and south-side approaches that feed the street's south end. Ranges: low = 131 (32) x 0.47 x 0.62 (the whole-street share of exits), high = 131 (32) x 0.47.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | OBSERVED turn count x ASSUMPTION share (131 left turns x 0.40) | 52 (38 to 62) | 62 | within |
| Telegraph Ave and south-side traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | ASSUMPTION: the through left-turners (131 x 0.62 = 81) that are not off-ramp traffic | 29 (19 to 43) | 51 | above |
| SR-24 off-ramp traffic using Colby St to reach College Ave and Berkeley (right at Alcatraz Ave) | OBSERVED turn count x ASSUMPTION share (32 right turns x 0.40) | 13 (9 to 15) | 9 | within |
| Telegraph Ave and south-side traffic using Colby St to reach College Ave and Berkeley | ASSUMPTION: the through right-turners (32 x 0.62 = 20) that are not off-ramp traffic | 7 (5 to 11) | 33 | above |
| Intents listed, together | | 101 (71 to 131) | 155 | |
| Other through cars (no intent listed) | | | 4 | |

Model through cars by origin and destination group (largest 12 of 38 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 62.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 27.9 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 18.9 | Claremont Avenue then College Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Emeryville and West Oakland streets (55th to 67th Streets) | 9.2 | Claremont Avenue |
| Telegraph Ave to the south (downtown Oakland) | Telegraph Ave from the north (Berkeley) | 7.8 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Ashby Ave from the west (Emeryville and I-80) | 6.7 | none near the study area |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 6.1 | Telegraph Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Telegraph Ave from the north (Berkeley) | 4.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Shattuck Ave from the north (Berkeley) | 3.7 | Claremont Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | College Ave from the north (Berkeley) | 2.9 | SR-24 then Claremont Avenue then College Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Claremont Ave and Tunnel Rd toward the hills | 1.5 | Claremont Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | San Pablo Ave (Emeryville and West Oakland) | 1.3 | College Avenue then Alcatraz Avenue |
| other pairs | | 6.8 | |

By the arterial these cars would otherwise use: Telegraph Avenue 110 veh/h; Claremont Avenue then College Avenue 19 veh/h; Claremont Avenue 16 veh/h; none near the study area 7 veh/h; SR-24 then Claremont Avenue then College Avenue 3 veh/h; College Avenue then Alcatraz Avenue 2 veh/h.

### Hillegass Avenue NB

Observed: block volume 110 veh/h, whole-street cars 48, so through cars 48 to 95 veh/h. Model: 91 through cars per hour.

Observed (PM): 94 cars entered at the south end, 48 drove the whole street, 109 left it at Alcatraz Ave (43 west, 54 east, 12 straight), and 47% of the block's trips came from a freeway. ASSUMPTION: freeway-origin through cars are 40 veh/h (52 freeway-origin trips times 94 / (94 + 29)), spread over the exits in proportion (0.37); the through share of exits is 48 / 109 = 0.44.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Hillegass Ave to reach Alcatraz Ave west and Telegraph Ave north | OBSERVED turn count x ASSUMPTION share (43 left turns x 0.37) | 16 (9 to 20) | 17 | within |
| SR-24 off-ramp traffic using Hillegass Ave to reach College Ave and Berkeley | OBSERVED turn count x ASSUMPTION share (54 right turns x 0.37) | 20 (11 to 25) | 34 | above |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach Alcatraz Ave west | ASSUMPTION: through exits (43 x 0.44) that are not off-ramp traffic | 3 (0 to 10) | 6 | within |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach College Ave and Berkeley | ASSUMPTION: through exits (54 x 0.44) that are not off-ramp traffic | 4 (0 to 13) | 28 | above |
| Intents listed, together | | 43 (20 to 68) | 85 | |
| Other through cars (no intent listed) | | | 6 | |

Model through cars by origin and destination group (largest 12 of 44 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 21.0 | SR-24 |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 13.9 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 10.3 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 6.7 | SR-24 then Claremont Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | College Ave from the north (Berkeley) | 6.2 | SR-24 then Claremont Avenue then College Avenue |
| Telegraph Ave to the south (downtown Oakland) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 5.8 | Telegraph Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Claremont Ave and Tunnel Rd toward the hills | 3.4 | Claremont Avenue |
| SR-13 Warren Freeway (via SR-24 east) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 2.1 | Claremont Avenue then Alcatraz Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Telegraph Ave from the north (Berkeley) | 2.0 | none near the study area |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 1.9 | Claremont Avenue then College Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | San Pablo Ave (Emeryville and West Oakland) | 1.8 | College Avenue then Alcatraz Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Alcatraz Ave from the west (Emeryville side) | 1.6 | SR-24 then Telegraph Avenue |
| other pairs | | 14.4 | |

By the arterial these cars would otherwise use: Telegraph Avenue 34 veh/h; SR-24 23 veh/h; Claremont Avenue 8 veh/h; SR-24 then Claremont Avenue 7 veh/h; SR-24 then Claremont Avenue then College Avenue 6 veh/h; SR-24 then Telegraph Avenue 3 veh/h.

### Hillegass Avenue SB

Observed: block volume 160 veh/h, whole-street cars 79, so through cars 79 to 120 veh/h. Model: 192 through cars per hour.

Observed (PM): 178 cars entered at the top (76 turned in from Alcatraz Ave west, 98 from the east, 4 came straight from the north), 79 drove the whole street, and 68% of the block's trips (109 veh/h) went to a freeway. ASSUMPTION: freeway-bound cars that did not join mid-street are 87 veh/h (109 x 178 / (178 + 44)), half of the 174 turn-ins; low = the whole-street share of the turn-ins (0.45), high = the freeway-bound share without the mid-street correction (0.63).

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Telegraph Ave, Alcatraz Ave west and West Berkeley traffic turning off Alcatraz Ave onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (76 turn-ins x 0.50) | 38 (34 to 48) | 41 | within |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (98 turn-ins x 0.50) | 49 (44 to 62) | 58 | within |
| Intents listed, together | | 87 (78 to 110) | 98 | |
| Other through cars (no intent listed) | | | 93 | |

Model through cars by origin and destination group (largest 12 of 44 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 39.7 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 33.8 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 26.4 | Telegraph Avenue |
| Ashby Ave from the west (Emeryville and I-80) | College Ave from the north (Berkeley) | 24.7 | Alcatraz Avenue then College Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 16.2 | Claremont Avenue then SR-24 |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 11.8 | College Avenue then Claremont Avenue then SR-24 |
| Telegraph Ave from the north (Berkeley) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 7.5 | College Avenue |
| West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 7.1 | College Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Telegraph Ave to the south (downtown Oakland) | 4.6 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 2.5 | Alcatraz Avenue then College Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | West Oakland to the southwest (Adeline St, Market St) | 1.9 | Telegraph Avenue |
| College Ave from the north (Berkeley) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 1.8 | College Avenue |
| other pairs | | 13.6 | |

By the arterial these cars would otherwise use: Telegraph Avenue 108 veh/h; Alcatraz Avenue then College Avenue 27 veh/h; College Avenue 16 veh/h; Claremont Avenue then SR-24 16 veh/h; College Avenue then Claremont Avenue then SR-24 12 veh/h; Claremont Avenue 4 veh/h.

### Colby Street SB

Observed: block volume 160 veh/h, whole-street cars 39, so through cars 39 to 117 veh/h. Model: 210 through cars per hour.

Observed (PM): 139 cars entered at the top (76 from Alcatraz Ave west, 50 from the east, 13 from the north), 39 drove the whole street, 45% of the block's trips (72 veh/h) went to a freeway and 22% came by way of Telegraph Ave. ASSUMPTION: freeway-bound cars that did not join mid-street are 46 veh/h (72 x 139 / (139 + 79)), 0.365 of the 126 turn-ins; low = the whole-street share (0.31), high = the unadjusted freeway share (0.57). The Telegraph Ave cars are the 22% x 160 = 35 of the 76 west turn-ins.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Southbound Telegraph Ave traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (35 Telegraph Ave cars x 0.365) | 13 (11 to 20) | 14 | within |
| Alcatraz Ave west, Ashby Ave and West Berkeley traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (41 other west turn-ins x 0.365) | 15 (13 to 23) | 23 | within |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (50 east turn-ins x 0.365) | 18 (15 to 29) | 41 | above |
| Intents listed, together | | 46 (39 to 72) | 79 | |
| Other through cars (no intent listed) | | | 131 | |

Model through cars by origin and destination group (largest 12 of 57 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 66.7 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 26.1 | Telegraph Avenue |
| Ashby Ave from the west (Emeryville and I-80) | College Ave from the north (Berkeley) | 17.4 | Alcatraz Avenue then College Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 12.4 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 11.8 | Telegraph Avenue |
| Shattuck Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 9.8 | none near the study area |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Telegraph Ave to the south (downtown Oakland) | 8.2 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 8.2 | Claremont Avenue then SR-24 |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 6.3 | College Avenue then Claremont Avenue then SR-24 |
| West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) | SR-24 westbound on-ramps (toward Oakland and I-980) | 4.8 | none near the study area |
| West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 4.7 | College Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | West Oakland to the southwest (Adeline St, Market St) | 3.9 | Telegraph Avenue |
| other pairs | | 29.5 | |

By the arterial these cars would otherwise use: Telegraph Avenue 131 veh/h; none near the study area 22 veh/h; Alcatraz Avenue then College Avenue 21 veh/h; Claremont Avenue then SR-24 8 veh/h; SR-24 8 veh/h; College Avenue then Claremont Avenue then SR-24 6 veh/h.

### Study area, all residential and service streets

Model: 1078 through cars per hour.

Model through cars by origin and destination group (largest 12 of 137 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 182.8 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 91.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 90.8 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 73.5 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 57.8 | Claremont Avenue then College Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 49.2 | Telegraph Avenue |
| Ashby Ave from the west (Emeryville and I-80) | College Ave from the north (Berkeley) | 42.9 | Alcatraz Avenue then College Avenue |
| Telegraph Ave from the north (Berkeley) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 39.5 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Emeryville and West Oakland streets (55th to 67th Streets) | 36.1 | Claremont Avenue |
| Telegraph Ave to the south (downtown Oakland) | SR-24 westbound on-ramps (toward Oakland and I-980) | 34.7 | Telegraph Avenue |
| West Oakland to the southwest (Adeline St, Market St) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 33.9 | Telegraph Avenue then Claremont Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 23.5 | Claremont Avenue then SR-24 |
| other pairs | | 322.2 | |

By the arterial these cars would otherwise use: Telegraph Avenue 643 veh/h; none near the study area 81 veh/h; Claremont Avenue 73 veh/h; Claremont Avenue then College Avenue 58 veh/h; Alcatraz Avenue then College Avenue 49 veh/h; SR-24 36 veh/h.

By origin group: Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 317; South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 211; SR-24 eastbound off-ramps (arriving from Oakland and I-980) 126; Telegraph Ave from the north (Berkeley) 95; Telegraph Ave to the south (downtown Oakland) 59; Ashby Ave from the west (Emeryville and I-80) 58; West Oakland to the southwest (Adeline St, Market St) 49; Claremont Ave and Tunnel Rd toward the hills 29; West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) 27; Emeryville and West Oakland streets (55th to 67th Streets) 26.

By destination group: South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 284; SR-24 westbound on-ramps (toward Oakland and I-980) 254; Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 151; Telegraph Ave from the north (Berkeley) 151; College Ave from the north (Berkeley) 56; Claremont Ave and Tunnel Rd toward the hills 47; Emeryville and West Oakland streets (55th to 67th Streets) 40; Telegraph Ave to the south (downtown Oakland) 20; San Pablo Ave (Emeryville and West Oakland) 15; Shattuck Ave from the north (Berkeley) 14.


Per-seed detail: `rockridge-pm_peak-s1-seed1.md` (seed 1 in full).
