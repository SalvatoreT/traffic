# rockridge-pm_peak-s1 over 10 seeds (1, 2, 3, 4, 5, 6, 7, 8, 9, 10)

Seeds are the fixed list above, none chosen; each run is 60 minutes from the same start. Interval = 95% interval of the mean (Student t, n - 1 degrees of freedom). Run-to-run noise only: demand is fixed, so day-to-day variation is not in these intervals.

## Stability rule (design decision D16)

| Check | Rule | Result | Pass |
| --- | --- | --- | --- |
| Removals | mean per hour below 1.00 | 1.60 (min 0.00, max 3.00) | NO |
| Entry backlog | below 2.0% in at least 90% of seeds | 10 of 10 seeds | yes |
| Runaway growth | no seed adds more than 2.0 points of backlog in the second half | none | yes |
| Arterial speed | mean above 4.0 m/s | 8.08 m/s | yes |

**Verdict: not stable.** Old rule (zero removals, backlog under 2%, speed above 4 m/s, every seed): 2 of 10 seeds pass.

## Metrics over seeds

| Group | Metric | Unit | Mean | SD | Min | Max | 95% interval |
| --- | --- | --- | --- | --- | --- | --- | --- |
| health | gridlock removals | vehicles | 1.60 | 1.17 | 0.00 | 3.00 | 0.76 to 2.44 |
| health | gridlock removals per hour | veh/h | 1.60 | 1.17 | 0.00 | 3.00 | 0.76 to 2.44 |
| health | entry backlog | % of spawned | 0.22 | 0.18 | 0.06 | 0.56 | 0.09 to 0.35 |
| health | backlog growth in the second half of the run | points of spawned | 0.13 | 0.12 | 0.01 | 0.37 | 0.05 to 0.21 |
| health | completed trips | trips | 24919.40 | 177.30 | 24564.00 | 25124.00 | 24792.57 to 25046.23 |
| health | arterial mean speed | m/s | 8.08 | 0.07 | 7.96 | 8.20 | 8.02 to 8.13 |
| health | arterial mean speed, last 15 min | m/s | 7.92 | 0.17 | 7.74 | 8.23 | 7.79 to 8.04 |
| junction recovery | courtesy admissions per hour | veh/h | 356.70 | 40.49 | 289.00 | 450.00 | 327.74 to 385.66 |
| junction recovery | yield fallback admissions per hour | veh/h | 162.20 | 16.46 | 136.00 | 189.00 | 150.43 to 173.97 |
| junction recovery | conflict bypass admissions per hour | veh/h | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| junction recovery | vehicles removed while held in a node, per hour | veh/h | 0.10 | 0.32 | 0.00 | 1.00 | -0.13 to 0.33 |
| cut-through | local vehicle-miles, surface gates to the freeway | veh-miles | 35.24 | 3.10 | 30.48 | 39.29 | 33.02 to 37.46 |
| cut-through | share of local vehicle-miles, surface gates to the freeway | % | 6.2 | 0.5 | 5.2 | 7.0 | 5.8 to 6.6 |
| cut-through | local vehicle-miles, freeway to the surface gates | veh-miles | 34.03 | 4.34 | 27.03 | 38.55 | 30.92 to 37.14 |
| cut-through | share of local vehicle-miles, freeway to the surface gates | % | 6.0 | 0.9 | 4.6 | 7.2 | 5.4 to 6.6 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue N | trips | 46.90 | 8.52 | 33.00 | 63.00 | 40.81 to 52.99 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue N | trips | 1310.20 | 34.88 | 1232.00 | 1359.00 | 1285.25 to 1335.15 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue S | trips | 95.60 | 11.62 | 79.00 | 111.00 | 87.29 to 103.91 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue S | trips | 1508.90 | 65.92 | 1348.00 | 1566.00 | 1461.74 to 1556.06 |
| headline share | Hillegass Avenue NB from freeway | % | 52.4 | 2.2 | 49.0 | 55.8 | 50.8 to 54.0 |
| share | Hillegass Avenue NB to Benvenue Avenue | % | 4.0 | 1.1 | 2.9 | 6.8 | 3.2 to 4.8 |
| share | Hillegass Avenue NB to College Avenue | % | 17.7 | 2.3 | 14.2 | 22.2 | 16.1 to 19.4 |
| share | Hillegass Avenue NB to Alcatraz Avenue WB | % | 21.8 | 3.3 | 16.1 | 25.5 | 19.4 to 24.2 |
| headline share | Colby Street NB from freeway | % | 38.4 | 3.5 | 31.5 | 42.7 | 35.9 to 40.9 |
| share | Colby Street NB to Alcatraz Avenue WB | % | 48.4 | 3.9 | 41.5 | 53.4 | 45.7 to 51.2 |
| share | Colby Street NB to Telegraph Avenue | % | 43.8 | 2.8 | 40.3 | 48.8 | 41.8 to 45.9 |
| share | Colby Street NB to College Avenue | % | 5.9 | 1.9 | 3.1 | 8.6 | 4.5 to 7.2 |
| share | Hillegass Avenue SB from Alcatraz Avenue WB | % | 24.6 | 3.4 | 19.5 | 28.4 | 22.2 to 27.1 |
| share | Hillegass Avenue SB from Benvenue Avenue | % | 4.3 | 1.4 | 2.2 | 7.3 | 3.2 to 5.3 |
| share | Hillegass Avenue SB from College Avenue | % | 15.0 | 1.7 | 12.1 | 17.5 | 13.7 to 16.2 |
| headline share | Hillegass Avenue SB to freeway | % | 46.1 | 3.3 | 40.3 | 50.6 | 43.7 to 48.4 |
| share | Colby Street SB from Alcatraz Avenue EB | % | 26.3 | 2.1 | 23.0 | 29.5 | 24.8 to 27.8 |
| share | Colby Street SB from Alcatraz Avenue WB | % | 17.1 | 2.5 | 12.9 | 20.5 | 15.3 to 18.9 |
| share | Colby Street SB from Telegraph Avenue | % | 29.8 | 2.9 | 26.0 | 33.5 | 27.7 to 31.9 |
| headline share | Colby Street SB to freeway | % | 30.3 | 4.1 | 21.9 | 36.8 | 27.4 to 33.2 |
| share | Colby Street SB to Forest Street | % | 23.0 | 2.8 | 18.4 | 27.5 | 21.1 to 25.0 |
| ramp share | onto freeway via College Avenue | % | 13.8 | 1.7 | 10.5 | 16.0 | 12.5 to 15.0 |
| ramp share | onto freeway via Hillegass Avenue | % | 16.3 | 1.6 | 13.9 | 17.8 | 15.1 to 17.4 |
| ramp share | onto freeway via Martin Street | % | 13.3 | 2.2 | 10.1 | 16.5 | 11.7 to 14.9 |
| ramp share | onto freeway via Colby Street | % | 11.7 | 1.5 | 9.5 | 13.4 | 10.6 to 12.7 |
| ramp share | onto freeway via Telegraph Avenue north of Alcatraz Avenue | % | 12.6 | 1.3 | 10.7 | 14.2 | 11.6 to 13.5 |
| ramp share | onto freeway via Benvenue Avenue | % | 2.2 | 0.5 | 1.4 | 2.9 | 1.9 to 2.6 |
| ramp share | from freeway via College Avenue | % | 10.3 | 1.2 | 8.4 | 12.0 | 9.5 to 11.2 |
| ramp share | from freeway via Martin Street | % | 12.0 | 1.2 | 9.8 | 14.3 | 11.1 to 12.9 |
| ramp share | from freeway via Colby Street | % | 12.7 | 1.2 | 10.0 | 14.1 | 11.9 to 13.6 |
| ramp share | from freeway via Hillegass Avenue | % | 8.4 | 1.2 | 6.8 | 10.5 | 7.5 to 9.3 |
| ramp share | from freeway via Benvenue Avenue | % | 2.9 | 1.0 | 1.9 | 5.3 | 2.2 to 3.6 |
| corridor flow | Telegraph N median link flow | veh/h | 970.92 | 38.87 | 912.00 | 1046.40 | 943.12 to 998.72 |
| corridor flow | Telegraph S median link flow | veh/h | 860.52 | 97.89 | 676.80 | 1014.00 | 790.50 to 930.54 |
| corridor flow | College N median link flow | veh/h | 399.84 | 33.82 | 357.60 | 452.40 | 375.65 to 424.03 |
| corridor flow | College S median link flow | veh/h | 602.52 | 75.50 | 511.20 | 702.00 | 548.52 to 656.52 |
| corridor flow | Claremont N median link flow | veh/h | 497.40 | 52.25 | 428.40 | 606.00 | 460.02 to 534.78 |
| corridor flow | Claremont S median link flow | veh/h | 379.92 | 30.76 | 330.00 | 436.80 | 357.92 to 401.92 |
| corridor flow | Alcatraz E median link flow | veh/h | 500.52 | 22.81 | 458.40 | 532.80 | 484.21 to 516.83 |
| corridor flow | Alcatraz W median link flow | veh/h | 361.56 | 29.69 | 321.60 | 399.60 | 340.32 to 382.80 |
| corridor flow | Hillegass N median link flow | veh/h | 127.68 | 16.39 | 103.20 | 152.40 | 115.96 to 139.40 |
| corridor flow | Hillegass S median link flow | veh/h | 206.76 | 30.21 | 153.60 | 265.20 | 185.15 to 228.37 |
| corridor flow | Colby N median link flow | veh/h | 167.76 | 10.02 | 145.20 | 180.00 | 160.59 to 174.93 |
| corridor flow | Colby S median link flow | veh/h | 204.96 | 26.17 | 165.60 | 256.80 | 186.24 to 223.68 |
| corridor flow | Martin E median link flow | veh/h | 178.44 | 26.53 | 142.80 | 211.20 | 159.46 to 197.42 |
| corridor flow | Martin W median link flow | veh/h | 152.64 | 40.21 | 97.20 | 210.00 | 123.88 to 181.40 |

## Intent map: through cars by where they come from and where they are going

Through = neither trip end is in the study area. Groups are the approach groups of the area config (data/areas); a node that is not a gate takes the group of the nearest surface gate (ASSUMPTION). The arterial is the one a trip would use on the shortest free-flow path with the study area's residential and service streets closed, where that path runs on a boundary street near the study area.

Model figures are the mean of 10 seed(s), per hour of the run. Basis: OBSERVED = read from the resident volunteer count of Feb 25, 2025 or its headline shares; ASSUMPTION = inferred from those numbers or chosen.

### Colby Street NB

Observed: block volume 174 veh/h, whole-street cars 102, so through cars 102 to 145 veh/h. Model: 154 through cars per hour.

Observed (PM): 182 cars entered at the south end, 102 drove the whole street, 164 left it at Alcatraz Ave (131 left, 32 right, 1 straight), and 47% of the block's trips came from a freeway (the headline share). ASSUMPTION: freeway-origin cars that do not end along the street are 65 veh/h (the 82 freeway-origin trips on the block, 47% of 174, times the 182 / (182 + 47) of its cars that entered at the south end rather than joining on the way), spread over the 164 exits in proportion (0.40); the other through cars come from the Telegraph Ave and south-side approaches that feed the street's south end. Ranges: low = 131 (32) x 0.47 x 0.62 (the whole-street share of exits), high = 131 (32) x 0.47.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | OBSERVED turn count x ASSUMPTION share (131 left turns x 0.40) | 52 (38 to 62) | 63 | above |
| Telegraph Ave and south-side traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | ASSUMPTION: the through left-turners (131 x 0.62 = 81) that are not off-ramp traffic | 29 (19 to 43) | 50 | above |
| SR-24 off-ramp traffic using Colby St to reach College Ave and Berkeley (right at Alcatraz Ave) | OBSERVED turn count x ASSUMPTION share (32 right turns x 0.40) | 13 (9 to 15) | 8 | below |
| Telegraph Ave and south-side traffic using Colby St to reach College Ave and Berkeley | ASSUMPTION: the through right-turners (32 x 0.62 = 20) that are not off-ramp traffic | 7 (5 to 11) | 29 | above |
| Intents listed, together | | 101 (71 to 131) | 150 | |
| Other through cars (no intent listed) | | | 4 | |

Model through cars by origin and destination group (largest 12 of 37 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 62.5 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 23.6 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 18.8 | Claremont Avenue then College Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Emeryville and West Oakland streets (55th to 67th Streets) | 9.5 | Claremont Avenue |
| Telegraph Ave to the south (downtown Oakland) | Telegraph Ave from the north (Berkeley) | 7.1 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Ashby Ave from the west (Emeryville and I-80) | 6.9 | none near the study area |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 5.4 | SR-24 then Claremont Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Shattuck Ave from the north (Berkeley) | 4.1 | Claremont Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Telegraph Ave from the north (Berkeley) | 3.6 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | College Ave from the north (Berkeley) | 2.8 | SR-24 then Claremont Avenue then College Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Claremont Ave and Tunnel Rd toward the hills | 1.6 | Claremont Avenue |
| San Pablo Ave (Emeryville and West Oakland) | Claremont Ave and Tunnel Rd toward the hills | 1.5 | Alcatraz Avenue then Claremont Avenue |
| other pairs | | 6.3 | |

By the arterial these cars would otherwise use: Telegraph Avenue 99 veh/h; Claremont Avenue then College Avenue 19 veh/h; Claremont Avenue 17 veh/h; none near the study area 7 veh/h; SR-24 then Claremont Avenue 5 veh/h; SR-24 then Claremont Avenue then College Avenue 3 veh/h.

### Hillegass Avenue NB

Observed: block volume 110 veh/h, whole-street cars 48, so through cars 48 to 95 veh/h. Model: 87 through cars per hour.

Observed (PM): 94 cars entered at the south end, 48 drove the whole street, 109 left it at Alcatraz Ave (43 west, 54 east, 12 straight), and 47% of the block's trips came from a freeway. ASSUMPTION: freeway-origin through cars are 40 veh/h (52 freeway-origin trips times 94 / (94 + 29)), spread over the exits in proportion (0.37); the through share of exits is 48 / 109 = 0.44.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Hillegass Ave to reach Alcatraz Ave west and Telegraph Ave north | OBSERVED turn count x ASSUMPTION share (43 left turns x 0.37) | 16 (9 to 20) | 16 | within |
| SR-24 off-ramp traffic using Hillegass Ave to reach College Ave and Berkeley | OBSERVED turn count x ASSUMPTION share (54 right turns x 0.37) | 20 (11 to 25) | 35 | above |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach Alcatraz Ave west | ASSUMPTION: through exits (43 x 0.44) that are not off-ramp traffic | 3 (0 to 10) | 6 | within |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach College Ave and Berkeley | ASSUMPTION: through exits (54 x 0.44) that are not off-ramp traffic | 4 (0 to 13) | 24 | above |
| Intents listed, together | | 43 (20 to 68) | 80 | |
| Other through cars (no intent listed) | | | 7 | |

Model through cars by origin and destination group (largest 12 of 41 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 21.2 | SR-24 |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 11.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 9.9 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 6.7 | SR-24 then Claremont Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | College Ave from the north (Berkeley) | 6.2 | SR-24 then Claremont Avenue then College Avenue |
| Telegraph Ave to the south (downtown Oakland) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 4.3 | Telegraph Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Claremont Ave and Tunnel Rd toward the hills | 3.1 | Claremont Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | San Pablo Ave (Emeryville and West Oakland) | 2.6 | College Avenue then Alcatraz Avenue |
| SR-13 Warren Freeway (via SR-24 east) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 1.9 | Claremont Avenue then Alcatraz Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Telegraph Ave from the north (Berkeley) | 1.8 | none near the study area |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 1.7 | Claremont Avenue then College Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Alcatraz Ave from the west (Emeryville side) | 1.7 | SR-24 then Telegraph Avenue |
| other pairs | | 15.1 | |

By the arterial these cars would otherwise use: Telegraph Avenue 29 veh/h; SR-24 22 veh/h; SR-24 then Claremont Avenue 7 veh/h; Claremont Avenue 7 veh/h; SR-24 then Claremont Avenue then College Avenue 6 veh/h; College Avenue then Alcatraz Avenue 4 veh/h.

### Hillegass Avenue SB

Observed: block volume 160 veh/h, whole-street cars 79, so through cars 79 to 120 veh/h. Model: 193 through cars per hour.

Observed (PM): 178 cars entered at the top (76 turned in from Alcatraz Ave west, 98 from the east, 4 came straight from the north), 79 drove the whole street, and 68% of the block's trips (109 veh/h) went to a freeway. ASSUMPTION: freeway-bound cars that did not join mid-street are 87 veh/h (109 x 178 / (178 + 44)), half of the 174 turn-ins; low = the whole-street share of the turn-ins (0.45), high = the freeway-bound share without the mid-street correction (0.63).

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Telegraph Ave, Alcatraz Ave west and West Berkeley traffic turning off Alcatraz Ave onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (76 turn-ins x 0.50) | 38 (34 to 48) | 41 | within |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (98 turn-ins x 0.50) | 49 (44 to 62) | 59 | within |
| Intents listed, together | | 87 (78 to 110) | 100 | |
| Other through cars (no intent listed) | | | 93 | |

Model through cars by origin and destination group (largest 12 of 39 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 39.7 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 32.4 | Telegraph Avenue |
| Ashby Ave from the west (Emeryville and I-80) | College Ave from the north (Berkeley) | 27.1 | Alcatraz Avenue then College Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 26.2 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 16.2 | Claremont Avenue then SR-24 |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 13.0 | College Avenue then Claremont Avenue then SR-24 |
| Telegraph Ave from the north (Berkeley) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 8.6 | College Avenue |
| West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 7.3 | College Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Telegraph Ave to the south (downtown Oakland) | 4.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 2.3 | Alcatraz Avenue then College Avenue |
| College Ave from the north (Berkeley) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 2.2 | College Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 1.8 | Claremont Avenue |
| other pairs | | 12.1 | |

By the arterial these cars would otherwise use: Telegraph Avenue 104 veh/h; Alcatraz Avenue then College Avenue 29 veh/h; College Avenue 18 veh/h; Claremont Avenue then SR-24 16 veh/h; College Avenue then Claremont Avenue then SR-24 13 veh/h; Claremont Avenue 3 veh/h.

### Colby Street SB

Observed: block volume 160 veh/h, whole-street cars 39, so through cars 39 to 117 veh/h. Model: 213 through cars per hour.

Observed (PM): 139 cars entered at the top (76 from Alcatraz Ave west, 50 from the east, 13 from the north), 39 drove the whole street, 45% of the block's trips (72 veh/h) went to a freeway and 22% came by way of Telegraph Ave. ASSUMPTION: freeway-bound cars that did not join mid-street are 46 veh/h (72 x 139 / (139 + 79)), 0.365 of the 126 turn-ins; low = the whole-street share (0.31), high = the unadjusted freeway share (0.57). The Telegraph Ave cars are the 22% x 160 = 35 of the 76 west turn-ins.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Southbound Telegraph Ave traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (35 Telegraph Ave cars x 0.365) | 13 (11 to 20) | 15 | within |
| Alcatraz Ave west, Ashby Ave and West Berkeley traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (41 other west turn-ins x 0.365) | 15 (13 to 23) | 17 | within |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (50 east turn-ins x 0.365) | 18 (15 to 29) | 42 | above |
| Intents listed, together | | 46 (39 to 72) | 74 | |
| Other through cars (no intent listed) | | | 139 | |

Model through cars by origin and destination group (largest 12 of 55 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 70.2 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 25.5 | Telegraph Avenue |
| Ashby Ave from the west (Emeryville and I-80) | College Ave from the north (Berkeley) | 21.0 | Alcatraz Avenue then College Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 13.0 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 12.4 | Telegraph Avenue |
| Shattuck Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 8.8 | none near the study area |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 8.7 | Claremont Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Telegraph Ave to the south (downtown Oakland) | 7.7 | Telegraph Avenue |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 7.2 | College Avenue then Claremont Avenue then SR-24 |
| West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 5.2 | College Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | West Oakland to the southwest (Adeline St, Market St) | 4.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 3.5 | Alcatraz Avenue then College Avenue |
| other pairs | | 26.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 134 veh/h; Alcatraz Avenue then College Avenue 24 veh/h; none near the study area 17 veh/h; Claremont Avenue then SR-24 9 veh/h; College Avenue then Claremont Avenue then SR-24 7 veh/h; SR-24 7 veh/h.

### Study area, all residential and service streets

Model: 1033 through cars per hour.

Model through cars by origin and destination group (largest 12 of 131 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 174.4 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 88.1 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 73.7 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 67.2 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 56.7 | Claremont Avenue then College Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 49.4 | Telegraph Avenue |
| Ashby Ave from the west (Emeryville and I-80) | College Ave from the north (Berkeley) | 49.1 | Alcatraz Avenue then College Avenue |
| Telegraph Ave from the north (Berkeley) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 41.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Emeryville and West Oakland streets (55th to 67th Streets) | 36.6 | Claremont Avenue |
| West Oakland to the southwest (Adeline St, Market St) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 36.4 | Telegraph Avenue then Claremont Avenue |
| Telegraph Ave to the south (downtown Oakland) | SR-24 westbound on-ramps (toward Oakland and I-980) | 36.2 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 23.5 | Claremont Avenue then SR-24 |
| other pairs | | 301.2 | |

By the arterial these cars would otherwise use: Telegraph Avenue 602 veh/h; Claremont Avenue 73 veh/h; none near the study area 67 veh/h; Claremont Avenue then College Avenue 57 veh/h; Alcatraz Avenue then College Avenue 55 veh/h; Telegraph Avenue then Claremont Avenue 36 veh/h.

By origin group: Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 304; South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 184; SR-24 eastbound off-ramps (arriving from Oakland and I-980) 124; Telegraph Ave from the north (Berkeley) 97; Ashby Ave from the west (Emeryville and I-80) 62; Telegraph Ave to the south (downtown Oakland) 56; West Oakland to the southwest (Adeline St, Market St) 51; Claremont Ave and Tunnel Rd toward the hills 29; Emeryville and West Oakland streets (55th to 67th Streets) 27; College Ave from the north (Berkeley) 26.

By destination group: South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 279; SR-24 westbound on-ramps (toward Oakland and I-980) 240; Telegraph Ave from the north (Berkeley) 146; Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 124; College Ave from the north (Berkeley) 62; Claremont Ave and Tunnel Rd toward the hills 51; Emeryville and West Oakland streets (55th to 67th Streets) 39; Telegraph Ave to the south (downtown Oakland) 21; San Pablo Ave (Emeryville and West Oakland) 12; Shattuck Ave from the north (Berkeley) 12.


Per-seed detail: `rockridge-pm_peak-s1-seed1.md` (seed 1 in full).
