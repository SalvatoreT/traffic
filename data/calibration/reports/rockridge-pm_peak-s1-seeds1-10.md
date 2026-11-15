# rockridge-pm_peak-s1 over 10 seeds (1, 2, 3, 4, 5, 6, 7, 8, 9, 10)

Seeds are the fixed list above, none chosen; each run is 60 minutes from the same start. Interval = 95% interval of the mean (Student t, n - 1 degrees of freedom). Run-to-run noise only: demand is fixed, so day-to-day variation is not in these intervals.

## Stability rule (design decision D16)

| Check | Rule | Result | Pass |
| --- | --- | --- | --- |
| Removals | mean per hour below 1.00 | 0.00 (min 0.00, max 0.00) | yes |
| Entry backlog | below 2.0% in at least 90% of seeds | 10 of 10 seeds | yes |
| Runaway growth | no seed adds more than 2.0 points of backlog in the second half | none | yes |
| Arterial speed | mean above 4.0 m/s | 9.37 m/s | yes |

**Verdict: stable.** Old rule (zero removals, backlog under 2%, speed above 4 m/s, every seed): 10 of 10 seeds pass.

## Metrics over seeds

| Group | Metric | Unit | Mean | SD | Min | Max | 95% interval |
| --- | --- | --- | --- | --- | --- | --- | --- |
| health | gridlock removals | vehicles | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| health | gridlock removals per hour | veh/h | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| health | entry backlog | % of spawned | 0.03 | 0.01 | 0.01 | 0.05 | 0.02 to 0.04 |
| health | backlog growth in the second half of the run | points of spawned | 0.01 | 0.02 | -0.02 | 0.04 | -0.01 to 0.02 |
| health | completed trips | trips | 24484.70 | 169.57 | 24297.00 | 24730.00 | 24363.40 to 24606.00 |
| health | arterial mean speed | m/s | 9.37 | 0.06 | 9.31 | 9.46 | 9.33 to 9.41 |
| health | arterial mean speed, last 15 min | m/s | 9.41 | 0.08 | 9.30 | 9.52 | 9.35 to 9.47 |
| cut-through | local vehicle-miles, surface gates to the freeway | veh-miles | 37.73 | 4.92 | 29.89 | 46.86 | 34.21 to 41.24 |
| cut-through | share of local vehicle-miles, surface gates to the freeway | % | 8.8 | 1.1 | 7.0 | 10.8 | 8.0 to 9.6 |
| cut-through | local vehicle-miles, freeway to the surface gates | veh-miles | 35.50 | 3.32 | 31.49 | 41.52 | 33.13 to 37.88 |
| cut-through | share of local vehicle-miles, freeway to the surface gates | % | 8.3 | 0.7 | 7.3 | 9.5 | 7.8 to 8.8 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue N | trips | 39.50 | 4.33 | 33.00 | 45.00 | 36.40 to 42.60 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue N | trips | 1497.70 | 39.46 | 1442.00 | 1561.00 | 1469.47 to 1525.93 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue S | trips | 71.20 | 10.87 | 55.00 | 87.00 | 63.42 to 78.98 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue S | trips | 1465.30 | 32.77 | 1417.00 | 1522.00 | 1441.86 to 1488.74 |
| headline share | Hillegass Avenue NB from freeway | % | 54.6 | 3.5 | 47.9 | 57.9 | 52.1 to 57.1 |
| share | Hillegass Avenue NB to Benvenue Avenue | % | 4.0 | 1.2 | 1.9 | 6.1 | 3.1 to 4.8 |
| share | Hillegass Avenue NB to College Avenue | % | 14.6 | 3.1 | 10.2 | 20.6 | 12.4 to 16.9 |
| share | Hillegass Avenue NB to Alcatraz Avenue WB | % | 28.5 | 1.4 | 26.6 | 31.1 | 27.4 to 29.5 |
| headline share | Colby Street NB from freeway | % | 42.7 | 2.4 | 38.7 | 46.2 | 40.9 to 44.4 |
| share | Colby Street NB to Alcatraz Avenue WB | % | 53.8 | 2.9 | 50.2 | 58.0 | 51.7 to 55.8 |
| share | Colby Street NB to Telegraph Avenue | % | 35.3 | 3.0 | 30.6 | 39.4 | 33.1 to 37.4 |
| share | Colby Street NB to College Avenue | % | 6.5 | 0.9 | 5.2 | 8.0 | 5.9 to 7.1 |
| share | Hillegass Avenue SB from Alcatraz Avenue WB | % | 30.3 | 5.9 | 20.1 | 37.6 | 26.1 to 34.5 |
| share | Hillegass Avenue SB from Benvenue Avenue | % | 4.0 | 1.9 | 1.0 | 7.1 | 2.7 to 5.4 |
| share | Hillegass Avenue SB from College Avenue | % | 16.4 | 4.3 | 7.5 | 20.9 | 13.3 to 19.5 |
| headline share | Hillegass Avenue SB to freeway | % | 63.2 | 3.5 | 56.9 | 68.5 | 60.7 to 65.7 |
| share | Colby Street SB from Alcatraz Avenue EB | % | 23.3 | 1.9 | 20.2 | 27.0 | 22.0 to 24.7 |
| share | Colby Street SB from Alcatraz Avenue WB | % | 15.6 | 1.8 | 12.7 | 18.1 | 14.3 to 16.9 |
| share | Colby Street SB from Telegraph Avenue | % | 19.5 | 2.6 | 15.1 | 23.0 | 17.7 to 21.4 |
| headline share | Colby Street SB to freeway | % | 40.8 | 3.2 | 35.9 | 46.9 | 38.5 to 43.1 |
| share | Colby Street SB to Forest Street | % | 18.6 | 2.6 | 13.1 | 20.6 | 16.7 to 20.5 |
| ramp share | onto freeway via College Avenue | % | 15.3 | 1.5 | 13.3 | 17.4 | 14.2 to 16.4 |
| ramp share | onto freeway via Hillegass Avenue | % | 14.7 | 1.6 | 12.4 | 17.7 | 13.5 to 15.9 |
| ramp share | onto freeway via Martin Street | % | 12.5 | 1.1 | 10.4 | 14.3 | 11.7 to 13.3 |
| ramp share | onto freeway via Colby Street | % | 10.6 | 0.5 | 9.9 | 11.4 | 10.3 to 11.0 |
| ramp share | onto freeway via Telegraph Avenue north of Alcatraz Avenue | % | 12.2 | 1.7 | 9.6 | 14.8 | 11.0 to 13.4 |
| ramp share | onto freeway via Benvenue Avenue | % | 4.5 | 0.7 | 3.0 | 5.4 | 4.0 to 5.0 |
| ramp share | from freeway via College Avenue | % | 9.3 | 0.7 | 8.1 | 10.4 | 8.8 to 9.8 |
| ramp share | from freeway via Martin Street | % | 12.0 | 1.2 | 9.7 | 13.7 | 11.1 to 12.9 |
| ramp share | from freeway via Colby Street | % | 13.3 | 1.4 | 11.4 | 16.3 | 12.2 to 14.3 |
| ramp share | from freeway via Hillegass Avenue | % | 7.4 | 0.8 | 6.3 | 8.9 | 6.8 to 8.0 |
| ramp share | from freeway via Benvenue Avenue | % | 2.8 | 0.7 | 2.0 | 3.9 | 2.3 to 3.3 |
| corridor flow | Telegraph N median link flow | veh/h | 1128.48 | 50.30 | 1040.40 | 1214.40 | 1092.50 to 1164.46 |
| corridor flow | Telegraph S median link flow | veh/h | 808.80 | 51.08 | 732.00 | 886.80 | 772.26 to 845.34 |
| corridor flow | College N median link flow | veh/h | 383.64 | 30.64 | 332.40 | 427.20 | 361.72 to 405.56 |
| corridor flow | College S median link flow | veh/h | 666.48 | 19.80 | 628.80 | 688.80 | 652.32 to 680.64 |
| corridor flow | Claremont N median link flow | veh/h | 421.20 | 37.71 | 364.80 | 487.20 | 394.23 to 448.17 |
| corridor flow | Claremont S median link flow | veh/h | 317.16 | 22.17 | 289.20 | 348.00 | 301.30 to 333.02 |
| corridor flow | Alcatraz E median link flow | veh/h | 581.76 | 27.03 | 536.40 | 628.80 | 562.43 to 601.09 |
| corridor flow | Alcatraz W median link flow | veh/h | 356.40 | 22.13 | 327.60 | 384.00 | 340.57 to 372.23 |
| corridor flow | Hillegass N median link flow | veh/h | 121.44 | 9.79 | 105.60 | 135.60 | 114.43 to 128.45 |
| corridor flow | Hillegass S median link flow | veh/h | 130.56 | 11.33 | 112.80 | 153.60 | 122.46 to 138.66 |
| corridor flow | Colby N median link flow | veh/h | 164.04 | 9.33 | 153.60 | 181.20 | 157.37 to 170.71 |
| corridor flow | Colby S median link flow | veh/h | 144.24 | 10.69 | 124.80 | 159.60 | 136.60 to 151.88 |
| corridor flow | Martin E median link flow | veh/h | 124.08 | 10.42 | 108.00 | 148.80 | 116.63 to 131.53 |
| corridor flow | Martin W median link flow | veh/h | 113.76 | 10.52 | 97.20 | 130.80 | 106.24 to 121.28 |

## Intent map: through cars by where they come from and where they are going

Through = neither trip end is in the study area. Groups are the approach groups of the area config (data/areas); a node that is not a gate takes the group of the nearest surface gate (ASSUMPTION). The arterial is the one a trip would use on the shortest free-flow path with the study area's residential and service streets closed, where that path runs on a boundary street near the study area.

Model figures are the mean of 10 seed(s), per hour of the run. Basis: OBSERVED = read from the resident volunteer count of Feb 25, 2025 or its headline shares; ASSUMPTION = inferred from those numbers or chosen.

### Colby Street NB

Observed: block volume 174 veh/h, whole-street cars 102, so through cars 102 to 145 veh/h. Model: 138 through cars per hour.

Observed (PM): 182 cars entered at the south end, 102 drove the whole street, 164 left it at Alcatraz Ave (131 left, 32 right, 1 straight), and 47% of the block's trips came from a freeway (the headline share). ASSUMPTION: freeway-origin cars that do not end along the street are 65 veh/h (the 82 freeway-origin trips on the block, 47% of 174, times the 182 / (182 + 47) of its cars that entered at the south end rather than joining on the way), spread over the 164 exits in proportion (0.40); the other through cars come from the Telegraph Ave and south-side approaches that feed the street's south end. Ranges: low = 131 (32) x 0.47 x 0.62 (the whole-street share of exits), high = 131 (32) x 0.47.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | OBSERVED turn count x ASSUMPTION share (131 left turns x 0.40) | 52 (38 to 62) | 59 | within |
| Telegraph Ave and south-side traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | ASSUMPTION: the through left-turners (131 x 0.62 = 81) that are not off-ramp traffic | 29 (19 to 43) | 44 | above |
| SR-24 off-ramp traffic using Colby St to reach College Ave and Berkeley (right at Alcatraz Ave) | OBSERVED turn count x ASSUMPTION share (32 right turns x 0.40) | 13 (9 to 15) | 18 | above |
| Telegraph Ave and south-side traffic using Colby St to reach College Ave and Berkeley | ASSUMPTION: the through right-turners (32 x 0.62 = 20) that are not off-ramp traffic | 7 (5 to 11) | 16 | above |
| Intents listed, together | | 101 (71 to 131) | 137 | |
| Other through cars (no intent listed) | | | 1 | |

Model through cars by origin and destination group (largest 12 of 31 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 58.7 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 11.5 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Ashby Ave from the west (Emeryville and I-80) | 10.2 | none near the study area |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Emeryville and West Oakland streets (55th to 67th Streets) | 9.1 | Claremont Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 8.0 | SR-24 |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 7.7 | Telegraph Avenue |
| Telegraph Ave to the south (downtown Oakland) | Telegraph Ave from the north (Berkeley) | 6.9 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Shattuck Ave from the north (Berkeley) | 5.9 | Claremont Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 5.1 | Claremont Avenue then College Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Telegraph Ave from the north (Berkeley) | 3.4 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) | 3.3 | none near the study area |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | College Ave from the north (Berkeley) | 2.7 | SR-24 then Claremont Avenue then College Avenue |
| other pairs | | 5.6 | |

By the arterial these cars would otherwise use: Telegraph Avenue 90 veh/h; Claremont Avenue 16 veh/h; none near the study area 14 veh/h; SR-24 8 veh/h; Claremont Avenue then College Avenue 5 veh/h; SR-24 then Claremont Avenue then College Avenue 3 veh/h.

### Hillegass Avenue NB

Observed: block volume 110 veh/h, whole-street cars 48, so through cars 48 to 95 veh/h. Model: 73 through cars per hour.

Observed (PM): 94 cars entered at the south end, 48 drove the whole street, 109 left it at Alcatraz Ave (43 west, 54 east, 12 straight), and 47% of the block's trips came from a freeway. ASSUMPTION: freeway-origin through cars are 40 veh/h (52 freeway-origin trips times 94 / (94 + 29)), spread over the exits in proportion (0.37); the through share of exits is 48 / 109 = 0.44.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Hillegass Ave to reach Alcatraz Ave west and Telegraph Ave north | OBSERVED turn count x ASSUMPTION share (43 left turns x 0.37) | 16 (9 to 20) | 19 | within |
| SR-24 off-ramp traffic using Hillegass Ave to reach College Ave and Berkeley | OBSERVED turn count x ASSUMPTION share (54 right turns x 0.37) | 20 (11 to 25) | 26 | above |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach Alcatraz Ave west | ASSUMPTION: through exits (43 x 0.44) that are not off-ramp traffic | 3 (0 to 10) | 9 | within |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach College Ave and Berkeley | ASSUMPTION: through exits (54 x 0.44) that are not off-ramp traffic | 4 (0 to 13) | 16 | above |
| Intents listed, together | | 43 (20 to 68) | 70 | |
| Other through cars (no intent listed) | | | 3 | |

Model through cars by origin and destination group (largest 12 of 40 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 14.4 | SR-24 |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 11.6 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 10.5 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | College Ave from the north (Berkeley) | 6.6 | SR-24 then Claremont Avenue then College Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 4.7 | SR-24 then Claremont Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Ashby Ave from the west (Emeryville and I-80) | 2.6 | College Avenue then Alcatraz Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Telegraph Ave from the north (Berkeley) | 2.5 | none near the study area |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Ashby Ave from the west (Emeryville and I-80) | 2.2 | SR-24 then Telegraph Avenue |
| Telegraph Ave to the south (downtown Oakland) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 2.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Emeryville and West Oakland streets (55th to 67th Streets) | 1.8 | Claremont Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) | 1.6 | none near the study area |
| SR-13 Warren Freeway (via SR-24 east) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 1.2 | Claremont Avenue then Alcatraz Avenue |
| other pairs | | 11.3 | |

By the arterial these cars would otherwise use: Telegraph Avenue 26 veh/h; SR-24 16 veh/h; SR-24 then Claremont Avenue then College Avenue 7 veh/h; Claremont Avenue 6 veh/h; SR-24 then Claremont Avenue 5 veh/h; none near the study area 4 veh/h.

### Hillegass Avenue SB

Observed: block volume 160 veh/h, whole-street cars 79, so through cars 79 to 120 veh/h. Model: 104 through cars per hour.

Observed (PM): 178 cars entered at the top (76 turned in from Alcatraz Ave west, 98 from the east, 4 came straight from the north), 79 drove the whole street, and 68% of the block's trips (109 veh/h) went to a freeway. ASSUMPTION: freeway-bound cars that did not join mid-street are 87 veh/h (109 x 178 / (178 + 44)), half of the 174 turn-ins; low = the whole-street share of the turn-ins (0.45), high = the freeway-bound share without the mid-street correction (0.63).

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Telegraph Ave, Alcatraz Ave west and West Berkeley traffic turning off Alcatraz Ave onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (76 turn-ins x 0.50) | 38 (34 to 48) | 37 | within |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (98 turn-ins x 0.50) | 49 (44 to 62) | 50 | within |
| Intents listed, together | | 87 (78 to 110) | 86 | |
| Other through cars (no intent listed) | | | 18 | |

Model through cars by origin and destination group (largest 12 of 27 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 36.5 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 25.8 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 13.7 | Claremont Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 7.5 | Telegraph Avenue |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 7.5 | College Avenue then Claremont Avenue then SR-24 |
| Ashby Ave from the west (Emeryville and I-80) | College Ave from the north (Berkeley) | 2.8 | Alcatraz Avenue then College Avenue |
| West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 1.5 | College Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 1.4 | Alcatraz Avenue then College Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Oakland hills to the east (Broadway Terrace, Mountain Blvd, Moraga Ave) | 1.3 | Alcatraz Avenue then College Avenue |
| Berkeley hills to the northeast (Evergreen Ln, Gravatt Dr) | SR-24 westbound on-ramps (toward Oakland and I-980) | 1.3 | Claremont Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 1.2 | Claremont Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Telegraph Ave to the south (downtown Oakland) | 0.5 | Telegraph Avenue |
| other pairs | | 3.4 | |

By the arterial these cars would otherwise use: Telegraph Avenue 71 veh/h; Claremont Avenue then SR-24 15 veh/h; College Avenue then Claremont Avenue then SR-24 8 veh/h; Alcatraz Avenue then College Avenue 5 veh/h; Claremont Avenue 2 veh/h; College Avenue 2 veh/h.

### Colby Street SB

Observed: block volume 160 veh/h, whole-street cars 39, so through cars 39 to 117 veh/h. Model: 100 through cars per hour.

Observed (PM): 139 cars entered at the top (76 from Alcatraz Ave west, 50 from the east, 13 from the north), 39 drove the whole street, 45% of the block's trips (72 veh/h) went to a freeway and 22% came by way of Telegraph Ave. ASSUMPTION: freeway-bound cars that did not join mid-street are 46 veh/h (72 x 139 / (139 + 79)), 0.365 of the 126 turn-ins; low = the whole-street share (0.31), high = the unadjusted freeway share (0.57). The Telegraph Ave cars are the 22% x 160 = 35 of the 76 west turn-ins.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Southbound Telegraph Ave traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (35 Telegraph Ave cars x 0.365) | 13 (11 to 20) | 18 | within |
| Alcatraz Ave west, Ashby Ave and West Berkeley traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (41 other west turn-ins x 0.365) | 15 (13 to 23) | 14 | within |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (50 east turn-ins x 0.365) | 18 (15 to 29) | 38 | above |
| Intents listed, together | | 46 (39 to 72) | 71 | |
| Other through cars (no intent listed) | | | 29 | |

Model through cars by origin and destination group (largest 12 of 45 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 25.0 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 17.1 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 13.7 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 8.2 | Claremont Avenue then SR-24 |
| Shattuck Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 7.0 | none near the study area |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 4.6 | College Avenue then Claremont Avenue then SR-24 |
| Ashby Ave from the west (Emeryville and I-80) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 3.5 | SR-24 |
| Telegraph Ave from the north (Berkeley) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 2.0 | Telegraph Avenue |
| West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 1.7 | College Avenue |
| Ashby Ave from the west (Emeryville and I-80) | SR-13 Warren Freeway (via SR-24 east) | 1.6 | SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Telegraph Ave to the south (downtown Oakland) | 1.6 | Telegraph Avenue |
| Ashby Ave from the west (Emeryville and I-80) | College Ave from the north (Berkeley) | 1.5 | Alcatraz Avenue then College Avenue |
| other pairs | | 12.9 | |

By the arterial these cars would otherwise use: Telegraph Avenue 61 veh/h; none near the study area 9 veh/h; Claremont Avenue then SR-24 8 veh/h; SR-24 8 veh/h; College Avenue then Claremont Avenue then SR-24 5 veh/h; Alcatraz Avenue then College Avenue 3 veh/h.

### Study area, all residential and service streets

Model: 618 through cars per hour.

Model through cars by origin and destination group (largest 12 of 108 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 79.7 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 70.9 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 62.9 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 38.9 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Emeryville and West Oakland streets (55th to 67th Streets) | 34.7 | Claremont Avenue |
| West Oakland to the southwest (Adeline St, Market St) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 28.9 | Telegraph Avenue then Claremont Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 28.5 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 25.9 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 22.2 | SR-24 |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 20.6 | Claremont Avenue then SR-24 |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Ashby Ave from the west (Emeryville and I-80) | 15.9 | College Avenue then Alcatraz Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Shattuck Ave from the north (Berkeley) | 15.5 | Claremont Avenue |
| other pairs | | 173.5 | |

By the arterial these cars would otherwise use: Telegraph Avenue 348 veh/h; Claremont Avenue 70 veh/h; SR-24 34 veh/h; Telegraph Avenue then Claremont Avenue 29 veh/h; none near the study area 25 veh/h; Claremont Avenue then SR-24 22 veh/h.

By origin group: SR-24 eastbound off-ramps (arriving from Oakland and I-980) 131; Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 128; South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 121; Telegraph Ave from the north (Berkeley) 74; West Oakland to the southwest (Adeline St, Market St) 46; Claremont Ave and Tunnel Rd toward the hills 25; Telegraph Ave to the south (downtown Oakland) 22; Ashby Ave from the west (Emeryville and I-80) 20; College Ave from the north (Berkeley) 14; Shattuck Ave from the north (Berkeley) 9.

By destination group: SR-24 westbound on-ramps (toward Oakland and I-980) 195; Telegraph Ave from the north (Berkeley) 101; South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 86; Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 69; Claremont Ave and Tunnel Rd toward the hills 41; Emeryville and West Oakland streets (55th to 67th Streets) 36; Ashby Ave from the west (Emeryville and I-80) 20; College Ave from the north (Berkeley) 17; Shattuck Ave from the north (Berkeley) 16; West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) 8.


Per-seed detail: `rockridge-pm_peak-s1-seed1.md` (seed 1 in full).
