# rockridge-pm_peak-s1 over 10 seeds (1, 2, 3, 4, 5, 6, 7, 8, 9, 10)

Seeds are the fixed list above, none chosen; each run is 60 minutes from the same start. Interval = 95% interval of the mean (Student t, n - 1 degrees of freedom). Run-to-run noise only: demand is fixed, so day-to-day variation is not in these intervals.

## Stability rule (design decision D16)

| Check | Rule | Result | Pass |
| --- | --- | --- | --- |
| Removals | mean per hour below 1.00 | 0.80 (min 0.00, max 2.00) | yes |
| Entry backlog | below 2.0% in at least 90% of seeds | 10 of 10 seeds | yes |
| Runaway growth | no seed adds more than 2.0 points of backlog in the second half | none | yes |
| Arterial speed | mean above 4.0 m/s | 8.30 m/s | yes |

**Verdict: stable.** Old rule (zero removals, backlog under 2%, speed above 4 m/s, every seed): 3 of 10 seeds pass.

## Metrics over seeds

| Group | Metric | Unit | Mean | SD | Min | Max | 95% interval |
| --- | --- | --- | --- | --- | --- | --- | --- |
| health | gridlock removals | vehicles | 0.80 | 0.63 | 0.00 | 2.00 | 0.35 to 1.25 |
| health | gridlock removals per hour | veh/h | 0.80 | 0.63 | 0.00 | 2.00 | 0.35 to 1.25 |
| health | entry backlog | % of spawned | 0.71 | 0.32 | 0.19 | 1.09 | 0.49 to 0.94 |
| health | backlog growth in the second half of the run | points of spawned | 0.43 | 0.22 | 0.09 | 0.80 | 0.27 to 0.58 |
| health | completed trips | trips | 25837.00 | 116.47 | 25639.00 | 25991.00 | 25753.69 to 25920.31 |
| health | arterial mean speed | m/s | 8.30 | 0.12 | 8.13 | 8.52 | 8.21 to 8.39 |
| health | arterial mean speed, last 15 min | m/s | 7.96 | 0.24 | 7.61 | 8.27 | 7.78 to 8.13 |
| junction recovery | courtesy admissions per hour | veh/h | 296.40 | 34.73 | 245.00 | 344.00 | 271.56 to 321.24 |
| junction recovery | yield fallback admissions per hour | veh/h | 122.20 | 12.91 | 107.00 | 150.00 | 112.97 to 131.43 |
| junction recovery | conflict bypass admissions per hour | veh/h | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| junction recovery | vehicles removed while held in a node, per hour | veh/h | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| cut-through | local vehicle-miles, surface gates to the freeway | veh-miles | 41.25 | 6.67 | 30.72 | 52.25 | 36.48 to 46.02 |
| cut-through | share of local vehicle-miles, surface gates to the freeway | % | 8.5 | 1.3 | 6.8 | 10.9 | 7.6 to 9.4 |
| cut-through | local vehicle-miles, freeway to the surface gates | veh-miles | 34.00 | 3.55 | 28.95 | 39.28 | 31.47 to 36.54 |
| cut-through | share of local vehicle-miles, freeway to the surface gates | % | 7.0 | 0.8 | 6.1 | 8.7 | 6.4 to 7.6 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue N | trips | 44.30 | 5.91 | 32.00 | 52.00 | 40.07 to 48.53 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue N | trips | 1548.10 | 26.11 | 1492.00 | 1590.00 | 1529.42 to 1566.78 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue S | trips | 75.90 | 9.60 | 58.00 | 91.00 | 69.04 to 82.76 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue S | trips | 1390.70 | 22.03 | 1353.00 | 1420.00 | 1374.95 to 1406.45 |
| headline share | Hillegass Avenue NB from freeway | % | 53.2 | 2.5 | 50.5 | 57.1 | 51.4 to 55.0 |
| share | Hillegass Avenue NB to Benvenue Avenue | % | 3.6 | 1.0 | 1.9 | 4.7 | 2.9 to 4.3 |
| share | Hillegass Avenue NB to College Avenue | % | 16.2 | 1.9 | 13.7 | 19.0 | 14.8 to 17.6 |
| share | Hillegass Avenue NB to Alcatraz Avenue WB | % | 28.1 | 3.0 | 24.7 | 32.3 | 26.0 to 30.2 |
| headline share | Colby Street NB from freeway | % | 50.9 | 3.4 | 44.5 | 55.6 | 48.5 to 53.4 |
| share | Colby Street NB to Alcatraz Avenue WB | % | 46.2 | 2.8 | 41.7 | 50.5 | 44.2 to 48.2 |
| share | Colby Street NB to Telegraph Avenue | % | 34.3 | 3.5 | 29.2 | 39.0 | 31.8 to 36.9 |
| share | Colby Street NB to College Avenue | % | 6.6 | 1.3 | 4.8 | 8.6 | 5.7 to 7.5 |
| share | Hillegass Avenue SB from Alcatraz Avenue WB | % | 31.7 | 2.8 | 26.7 | 35.6 | 29.7 to 33.7 |
| share | Hillegass Avenue SB from Benvenue Avenue | % | 8.2 | 2.1 | 4.7 | 10.6 | 6.7 to 9.7 |
| share | Hillegass Avenue SB from College Avenue | % | 19.1 | 2.5 | 15.6 | 23.7 | 17.3 to 20.9 |
| headline share | Hillegass Avenue SB to freeway | % | 56.8 | 5.5 | 45.9 | 62.3 | 52.9 to 60.8 |
| share | Colby Street SB from Alcatraz Avenue EB | % | 25.2 | 3.1 | 20.2 | 29.9 | 23.0 to 27.4 |
| share | Colby Street SB from Alcatraz Avenue WB | % | 13.2 | 1.9 | 10.1 | 15.6 | 11.8 to 14.6 |
| share | Colby Street SB from Telegraph Avenue | % | 20.5 | 3.1 | 15.1 | 23.7 | 18.3 to 22.7 |
| headline share | Colby Street SB to freeway | % | 38.0 | 3.9 | 31.2 | 42.5 | 35.2 to 40.8 |
| share | Colby Street SB to Forest Street | % | 22.5 | 4.5 | 15.5 | 31.5 | 19.2 to 25.7 |
| ramp share | onto freeway via College Avenue | % | 14.6 | 1.0 | 13.2 | 16.4 | 13.8 to 15.3 |
| ramp share | onto freeway via Hillegass Avenue | % | 15.2 | 1.2 | 12.4 | 17.0 | 14.3 to 16.1 |
| ramp share | onto freeway via Martin Street | % | 13.3 | 1.7 | 10.3 | 16.8 | 12.0 to 14.5 |
| ramp share | onto freeway via Colby Street | % | 10.7 | 2.0 | 8.6 | 14.8 | 9.3 to 12.1 |
| ramp share | onto freeway via Telegraph Avenue north of Alcatraz Avenue | % | 12.4 | 1.7 | 9.8 | 14.7 | 11.2 to 13.6 |
| ramp share | onto freeway via Benvenue Avenue | % | 5.0 | 0.6 | 4.1 | 6.1 | 4.5 to 5.4 |
| ramp share | from freeway via College Avenue | % | 9.6 | 1.2 | 8.0 | 11.3 | 8.7 to 10.4 |
| ramp share | from freeway via Martin Street | % | 11.9 | 1.1 | 10.3 | 13.7 | 11.1 to 12.6 |
| ramp share | from freeway via Colby Street | % | 12.8 | 1.6 | 10.6 | 15.5 | 11.7 to 14.0 |
| ramp share | from freeway via Hillegass Avenue | % | 8.1 | 1.0 | 6.9 | 10.3 | 7.4 to 8.9 |
| ramp share | from freeway via Benvenue Avenue | % | 2.5 | 0.8 | 1.3 | 3.7 | 1.9 to 3.1 |
| corridor flow | Telegraph N median link flow | veh/h | 1049.28 | 39.08 | 1006.80 | 1138.80 | 1021.32 to 1077.24 |
| corridor flow | Telegraph S median link flow | veh/h | 1138.20 | 63.58 | 1076.40 | 1261.20 | 1092.72 to 1183.68 |
| corridor flow | College N median link flow | veh/h | 418.68 | 26.37 | 368.40 | 465.60 | 399.82 to 437.54 |
| corridor flow | College S median link flow | veh/h | 542.40 | 92.69 | 320.40 | 655.20 | 476.09 to 608.71 |
| corridor flow | Claremont N median link flow | veh/h | 505.68 | 32.47 | 468.00 | 572.40 | 482.46 to 528.90 |
| corridor flow | Claremont S median link flow | veh/h | 356.40 | 35.53 | 315.60 | 423.60 | 330.99 to 381.81 |
| corridor flow | Alcatraz E median link flow | veh/h | 509.16 | 34.83 | 436.80 | 564.00 | 484.25 to 534.07 |
| corridor flow | Alcatraz W median link flow | veh/h | 344.88 | 22.44 | 304.80 | 372.00 | 328.83 to 360.93 |
| corridor flow | Hillegass N median link flow | veh/h | 124.80 | 8.89 | 104.40 | 134.40 | 118.44 to 131.16 |
| corridor flow | Hillegass S median link flow | veh/h | 137.76 | 25.45 | 102.00 | 192.00 | 119.55 to 155.97 |
| corridor flow | Colby N median link flow | veh/h | 170.16 | 8.61 | 158.40 | 187.20 | 164.00 to 176.32 |
| corridor flow | Colby S median link flow | veh/h | 159.00 | 21.58 | 126.00 | 188.40 | 143.56 to 174.44 |
| corridor flow | Martin E median link flow | veh/h | 131.28 | 19.36 | 97.20 | 157.20 | 117.43 to 145.13 |
| corridor flow | Martin W median link flow | veh/h | 143.40 | 18.74 | 112.80 | 181.20 | 130.00 to 156.80 |

## Intent map: through cars by where they come from and where they are going

Through = neither trip end is in the study area. Groups are the approach groups of the area config (data/areas); a node that is not a gate takes the group of the nearest surface gate (ASSUMPTION). The arterial is the one a trip would use on the shortest free-flow path with the study area's residential and service streets closed, where that path runs on a boundary street near the study area.

Model figures are the mean of 10 seed(s), per hour of the run. Basis: OBSERVED = read from the resident volunteer count of Feb 25, 2025 or its headline shares; ASSUMPTION = inferred from those numbers or chosen.

### Colby Street NB

Observed: block volume 174 veh/h, whole-street cars 102, so through cars 102 to 145 veh/h. Model: 147 through cars per hour.

Observed (PM): 182 cars entered at the south end, 102 drove the whole street, 164 left it at Alcatraz Ave (131 left, 32 right, 1 straight), and 47% of the block's trips came from a freeway (the headline share). ASSUMPTION: freeway-origin cars that do not end along the street are 65 veh/h (the 82 freeway-origin trips on the block, 47% of 174, times the 182 / (182 + 47) of its cars that entered at the south end rather than joining on the way), spread over the 164 exits in proportion (0.40); the other through cars come from the Telegraph Ave and south-side approaches that feed the street's south end. Ranges: low = 131 (32) x 0.47 x 0.62 (the whole-street share of exits), high = 131 (32) x 0.47.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | OBSERVED turn count x ASSUMPTION share (131 left turns x 0.40) | 52 (38 to 62) | 64 | above |
| Telegraph Ave and south-side traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | ASSUMPTION: the through left-turners (131 x 0.62 = 81) that are not off-ramp traffic | 29 (19 to 43) | 32 | within |
| SR-24 off-ramp traffic using Colby St to reach College Ave and Berkeley (right at Alcatraz Ave) | OBSERVED turn count x ASSUMPTION share (32 right turns x 0.40) | 13 (9 to 15) | 13 | within |
| Telegraph Ave and south-side traffic using Colby St to reach College Ave and Berkeley | ASSUMPTION: the through right-turners (32 x 0.62 = 20) that are not off-ramp traffic | 7 (5 to 11) | 35 | above |
| Intents listed, together | | 101 (71 to 131) | 143 | |
| Other through cars (no intent listed) | | | 4 | |

Model through cars by origin and destination group (largest 12 of 34 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 64.2 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 28.1 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 6.4 | Telegraph Avenue |
| Telegraph Ave to the south (downtown Oakland) | Telegraph Ave from the north (Berkeley) | 6.4 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 6.1 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Ashby Ave from the west (Emeryville and I-80) | 5.7 | none near the study area |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Shattuck Ave from the north (Berkeley) | 4.9 | Claremont Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Emeryville and West Oakland streets (55th to 67th Streets) | 4.4 | Claremont Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Telegraph Ave from the north (Berkeley) | 4.2 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | College Ave from the north (Berkeley) | 3.8 | SR-24 then Claremont Avenue then College Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 2.2 | SR-24 |
| Telegraph Ave to the south (downtown Oakland) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 2.0 | Telegraph Avenue |
| other pairs | | 9.1 | |

By the arterial these cars would otherwise use: Telegraph Avenue 119 veh/h; Claremont Avenue 11 veh/h; none near the study area 6 veh/h; SR-24 then Claremont Avenue then College Avenue 4 veh/h; SR-24 2 veh/h; Alcatraz Avenue then Claremont Avenue 2 veh/h.

### Hillegass Avenue NB

Observed: block volume 110 veh/h, whole-street cars 48, so through cars 48 to 95 veh/h. Model: 94 through cars per hour.

Observed (PM): 94 cars entered at the south end, 48 drove the whole street, 109 left it at Alcatraz Ave (43 west, 54 east, 12 straight), and 47% of the block's trips came from a freeway. ASSUMPTION: freeway-origin through cars are 40 veh/h (52 freeway-origin trips times 94 / (94 + 29)), spread over the exits in proportion (0.37); the through share of exits is 48 / 109 = 0.44.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Hillegass Ave to reach Alcatraz Ave west and Telegraph Ave north | OBSERVED turn count x ASSUMPTION share (43 left turns x 0.37) | 16 (9 to 20) | 24 | above |
| SR-24 off-ramp traffic using Hillegass Ave to reach College Ave and Berkeley | OBSERVED turn count x ASSUMPTION share (54 right turns x 0.37) | 20 (11 to 25) | 32 | above |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach Alcatraz Ave west | ASSUMPTION: through exits (43 x 0.44) that are not off-ramp traffic | 3 (0 to 10) | 5 | within |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach College Ave and Berkeley | ASSUMPTION: through exits (54 x 0.44) that are not off-ramp traffic | 4 (0 to 13) | 26 | above |
| Intents listed, together | | 43 (20 to 68) | 88 | |
| Other through cars (no intent listed) | | | 7 | |

Model through cars by origin and destination group (largest 12 of 40 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 18.9 | SR-24 |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 17.6 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 16.3 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | College Ave from the north (Berkeley) | 6.2 | SR-24 then Claremont Avenue then College Avenue |
| SR-13 Warren Freeway (via SR-24 east) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 4.6 | Claremont Avenue then Alcatraz Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 4.4 | SR-24 then Claremont Avenue |
| Telegraph Ave to the south (downtown Oakland) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 3.5 | Telegraph Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 2.4 | Claremont Avenue then Alcatraz Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Ashby Ave from the west (Emeryville and I-80) | 1.8 | SR-24 then Telegraph Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Telegraph Ave from the north (Berkeley) | 1.7 | none near the study area |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | San Pablo Ave (Emeryville and West Oakland) | 1.5 | SR-24 |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | College Ave from the north (Berkeley) | 1.4 | Claremont Avenue then College Avenue |
| other pairs | | 14.2 | |

By the arterial these cars would otherwise use: Telegraph Avenue 42 veh/h; SR-24 20 veh/h; Claremont Avenue then Alcatraz Avenue 7 veh/h; SR-24 then Claremont Avenue then College Avenue 6 veh/h; Claremont Avenue 5 veh/h; SR-24 then Claremont Avenue 4 veh/h.

### Hillegass Avenue SB

Observed: block volume 160 veh/h, whole-street cars 79, so through cars 79 to 120 veh/h. Model: 137 through cars per hour.

Observed (PM): 178 cars entered at the top (76 turned in from Alcatraz Ave west, 98 from the east, 4 came straight from the north), 79 drove the whole street, and 68% of the block's trips (109 veh/h) went to a freeway. ASSUMPTION: freeway-bound cars that did not join mid-street are 87 veh/h (109 x 178 / (178 + 44)), half of the 174 turn-ins; low = the whole-street share of the turn-ins (0.45), high = the freeway-bound share without the mid-street correction (0.63).

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Telegraph Ave, Alcatraz Ave west and West Berkeley traffic turning off Alcatraz Ave onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (76 turn-ins x 0.50) | 38 (34 to 48) | 41 | within |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (98 turn-ins x 0.50) | 49 (44 to 62) | 56 | within |
| Intents listed, together | | 87 (78 to 110) | 96 | |
| Other through cars (no intent listed) | | | 40 | |

Model through cars by origin and destination group (largest 12 of 30 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 39.6 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 26.3 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 16.6 | Claremont Avenue then SR-24 |
| Ashby Ave from the west (Emeryville and I-80) | College Ave from the north (Berkeley) | 15.6 | Alcatraz Avenue then College Avenue |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 10.9 | College Avenue then Claremont Avenue then SR-24 |
| West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 6.2 | College Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 6.0 | Telegraph Avenue |
| Ashby Ave from the west (Emeryville and I-80) | Berkeley hills to the northeast (Evergreen Ln, Gravatt Dr) | 3.0 | none near the study area |
| College Ave from the north (Berkeley) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 2.1 | College Avenue |
| Ashby Ave from the west (Emeryville and I-80) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 1.6 | Alcatraz Avenue then Claremont Avenue |
| Telegraph Ave from the north (Berkeley) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 1.4 | College Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Telegraph Ave to the south (downtown Oakland) | 1.2 | Telegraph Avenue |
| other pairs | | 6.4 | |

By the arterial these cars would otherwise use: Telegraph Avenue 73 veh/h; Claremont Avenue then SR-24 17 veh/h; Alcatraz Avenue then College Avenue 16 veh/h; College Avenue then Claremont Avenue then SR-24 11 veh/h; College Avenue 10 veh/h; none near the study area 4 veh/h.

### Colby Street SB

Observed: block volume 160 veh/h, whole-street cars 39, so through cars 39 to 117 veh/h. Model: 128 through cars per hour.

Observed (PM): 139 cars entered at the top (76 from Alcatraz Ave west, 50 from the east, 13 from the north), 39 drove the whole street, 45% of the block's trips (72 veh/h) went to a freeway and 22% came by way of Telegraph Ave. ASSUMPTION: freeway-bound cars that did not join mid-street are 46 veh/h (72 x 139 / (139 + 79)), 0.365 of the 126 turn-ins; low = the whole-street share (0.31), high = the unadjusted freeway share (0.57). The Telegraph Ave cars are the 22% x 160 = 35 of the 76 west turn-ins.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Southbound Telegraph Ave traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (35 Telegraph Ave cars x 0.365) | 13 (11 to 20) | 14 | within |
| Alcatraz Ave west, Ashby Ave and West Berkeley traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (41 other west turn-ins x 0.365) | 15 (13 to 23) | 18 | within |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (50 east turn-ins x 0.365) | 18 (15 to 29) | 36 | above |
| Intents listed, together | | 46 (39 to 72) | 68 | |
| Other through cars (no intent listed) | | | 59 | |

Model through cars by origin and destination group (largest 12 of 46 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 20.5 | Telegraph Avenue |
| Ashby Ave from the west (Emeryville and I-80) | College Ave from the north (Berkeley) | 17.5 | Alcatraz Avenue then College Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 13.2 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 12.5 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 9.7 | Claremont Avenue then SR-24 |
| Shattuck Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 7.4 | none near the study area |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Telegraph Ave to the south (downtown Oakland) | 5.7 | Telegraph Avenue |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 5.4 | College Avenue then Claremont Avenue then SR-24 |
| West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 4.2 | College Avenue |
| Ashby Ave from the west (Emeryville and I-80) | Berkeley hills to the northeast (Evergreen Ln, Gravatt Dr) | 3.9 | none near the study area |
| Ashby Ave from the west (Emeryville and I-80) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 3.3 | SR-24 |
| Telegraph Ave from the north (Berkeley) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 2.2 | Telegraph Avenue |
| other pairs | | 22.3 | |

By the arterial these cars would otherwise use: Telegraph Avenue 55 veh/h; Alcatraz Avenue then College Avenue 18 veh/h; none near the study area 16 veh/h; Claremont Avenue then SR-24 10 veh/h; SR-24 9 veh/h; College Avenue then Claremont Avenue then SR-24 5 veh/h.

### Study area, all residential and service streets

Model: 793 through cars per hour.

Model through cars by origin and destination group (largest 12 of 94 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 85.7 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 77.8 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 75.3 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 55.6 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 48.4 | Telegraph Avenue |
| Ashby Ave from the west (Emeryville and I-80) | College Ave from the north (Berkeley) | 38.8 | Alcatraz Avenue then College Avenue |
| West Oakland to the southwest (Adeline St, Market St) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 30.5 | Telegraph Avenue then Claremont Avenue |
| West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) | SR-24 westbound on-ramps (toward Oakland and I-980) | 25.0 | none near the study area |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 23.9 | Claremont Avenue then SR-24 |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Emeryville and West Oakland streets (55th to 67th Streets) | 23.7 | Claremont Avenue |
| Emeryville and West Oakland streets (55th to 67th Streets) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 19.5 | none near the study area |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 19.1 | SR-24 |
| other pairs | | 269.7 | |

By the arterial these cars would otherwise use: Telegraph Avenue 442 veh/h; none near the study area 78 veh/h; Claremont Avenue 71 veh/h; Alcatraz Avenue then College Avenue 39 veh/h; SR-24 31 veh/h; Telegraph Avenue then Claremont Avenue 30 veh/h.

By origin group: South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 157; Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 152; SR-24 eastbound off-ramps (arriving from Oakland and I-980) 123; Telegraph Ave from the north (Berkeley) 69; Ashby Ave from the west (Emeryville and I-80) 59; West Oakland to the southwest (Adeline St, Market St) 46; West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) 35; Emeryville and West Oakland streets (55th to 67th Streets) 33; Telegraph Ave to the south (downtown Oakland) 29; Claremont Ave and Tunnel Rd toward the hills 25.

By destination group: SR-24 westbound on-ramps (toward Oakland and I-980) 216; Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 150; South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 130; Telegraph Ave from the north (Berkeley) 105; College Ave from the north (Berkeley) 53; Claremont Ave and Tunnel Rd toward the hills 40; Emeryville and West Oakland streets (55th to 67th Streets) 24; Shattuck Ave from the north (Berkeley) 18; Berkeley hills to the northeast (Evergreen Ln, Gravatt Dr) 16; Telegraph Ave to the south (downtown Oakland) 12.


Per-seed detail: `rockridge-pm_peak-s1-seed1.md` (seed 1 in full).
