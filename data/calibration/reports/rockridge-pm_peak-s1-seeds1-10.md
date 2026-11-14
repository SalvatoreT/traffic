# rockridge-pm_peak-s1 over 10 seeds (1, 2, 3, 4, 5, 6, 7, 8, 9, 10)

Seeds are the fixed list above, none chosen; each run is 60 minutes from the same start. Interval = 95% interval of the mean (Student t, n - 1 degrees of freedom). Run-to-run noise only: demand is fixed, so day-to-day variation is not in these intervals.

## Stability rule (design decision D16)

| Check | Rule | Result | Pass |
| --- | --- | --- | --- |
| Removals | mean per hour below 1.00 | 0.40 (min 0.00, max 2.00) | yes |
| Entry backlog | below 2.0% in at least 90% of seeds | 10 of 10 seeds | yes |
| Runaway growth | no seed adds more than 2.0 points of backlog in the second half | none | yes |
| Arterial speed | mean above 4.0 m/s | 9.31 m/s | yes |

**Verdict: stable.** Old rule (zero removals, backlog under 2%, speed above 4 m/s, every seed): 8 of 10 seeds pass.

## Metrics over seeds

| Group | Metric | Unit | Mean | SD | Min | Max | 95% interval |
| --- | --- | --- | --- | --- | --- | --- | --- |
| health | gridlock removals | vehicles | 0.40 | 0.84 | 0.00 | 2.00 | -0.20 to 1.00 |
| health | gridlock removals per hour | veh/h | 0.40 | 0.84 | 0.00 | 2.00 | -0.20 to 1.00 |
| health | entry backlog | % of spawned | 0.04 | 0.02 | 0.01 | 0.09 | 0.03 to 0.06 |
| health | backlog growth in the second half of the run | points of spawned | 0.01 | 0.03 | -0.01 | 0.08 | -0.01 to 0.03 |
| health | completed trips | trips | 24558.50 | 223.53 | 24099.00 | 24849.00 | 24398.61 to 24718.39 |
| health | arterial mean speed | m/s | 9.31 | 0.05 | 9.23 | 9.37 | 9.27 to 9.34 |
| health | arterial mean speed, last 15 min | m/s | 9.29 | 0.13 | 9.09 | 9.49 | 9.19 to 9.38 |
| cut-through | local vehicle-miles, surface gates to the freeway | veh-miles | 38.54 | 4.64 | 32.63 | 48.04 | 35.22 to 41.86 |
| cut-through | share of local vehicle-miles, surface gates to the freeway | % | 8.8 | 0.8 | 7.6 | 9.7 | 8.2 to 9.3 |
| cut-through | local vehicle-miles, freeway to the surface gates | veh-miles | 30.57 | 4.06 | 26.17 | 40.32 | 27.67 to 33.47 |
| cut-through | share of local vehicle-miles, freeway to the surface gates | % | 7.0 | 1.0 | 5.7 | 9.0 | 6.3 to 7.7 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue N | trips | 37.90 | 5.84 | 27.00 | 48.00 | 33.72 to 42.08 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue N | trips | 1524.00 | 45.90 | 1459.00 | 1577.00 | 1491.17 to 1556.83 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue S | trips | 72.60 | 10.74 | 55.00 | 91.00 | 64.92 to 80.28 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue S | trips | 1448.50 | 29.76 | 1409.00 | 1503.00 | 1427.21 to 1469.79 |
| headline share | Hillegass Avenue NB from freeway | % | 47.8 | 3.1 | 44.7 | 55.3 | 45.6 to 50.0 |
| share | Hillegass Avenue NB to Benvenue Avenue | % | 3.6 | 1.8 | 1.1 | 7.0 | 2.3 to 4.9 |
| share | Hillegass Avenue NB to College Avenue | % | 15.9 | 4.3 | 12.0 | 26.1 | 12.8 to 18.9 |
| share | Hillegass Avenue NB to Alcatraz Avenue WB | % | 28.8 | 2.3 | 25.7 | 33.2 | 27.1 to 30.5 |
| headline share | Colby Street NB from freeway | % | 37.7 | 2.8 | 33.7 | 42.3 | 35.7 to 39.6 |
| share | Colby Street NB to Alcatraz Avenue WB | % | 54.9 | 3.3 | 50.5 | 60.8 | 52.6 to 57.2 |
| share | Colby Street NB to Telegraph Avenue | % | 32.7 | 3.1 | 26.5 | 36.1 | 30.4 to 34.9 |
| share | Colby Street NB to College Avenue | % | 7.1 | 1.9 | 3.8 | 9.4 | 5.8 to 8.4 |
| share | Hillegass Avenue SB from Alcatraz Avenue WB | % | 29.6 | 4.7 | 20.9 | 36.0 | 26.2 to 32.9 |
| share | Hillegass Avenue SB from Benvenue Avenue | % | 4.0 | 1.5 | 2.0 | 6.4 | 2.9 to 5.1 |
| share | Hillegass Avenue SB from College Avenue | % | 15.3 | 2.7 | 10.1 | 19.2 | 13.4 to 17.3 |
| headline share | Hillegass Avenue SB to freeway | % | 61.0 | 2.8 | 55.0 | 64.5 | 59.0 to 63.0 |
| share | Colby Street SB from Alcatraz Avenue EB | % | 22.8 | 2.9 | 18.9 | 27.8 | 20.7 to 24.9 |
| share | Colby Street SB from Alcatraz Avenue WB | % | 15.0 | 1.6 | 12.1 | 17.5 | 13.8 to 16.2 |
| share | Colby Street SB from Telegraph Avenue | % | 20.8 | 3.3 | 15.5 | 24.6 | 18.4 to 23.1 |
| headline share | Colby Street SB to freeway | % | 40.5 | 2.4 | 36.1 | 42.7 | 38.8 to 42.2 |
| share | Colby Street SB to Forest Street | % | 17.8 | 1.9 | 13.7 | 19.7 | 16.5 to 19.2 |
| ramp share | onto freeway via College Avenue | % | 16.1 | 0.8 | 15.1 | 17.4 | 15.5 to 16.7 |
| ramp share | onto freeway via Hillegass Avenue | % | 15.7 | 1.3 | 13.5 | 18.1 | 14.7 to 16.6 |
| ramp share | onto freeway via Martin Street | % | 12.8 | 1.7 | 10.4 | 15.8 | 11.6 to 14.0 |
| ramp share | onto freeway via Colby Street | % | 11.8 | 1.3 | 9.2 | 13.3 | 10.9 to 12.7 |
| ramp share | onto freeway via Telegraph Avenue north of Alcatraz Avenue | % | 12.6 | 1.3 | 11.0 | 14.7 | 11.7 to 13.5 |
| ramp share | onto freeway via Benvenue Avenue | % | 3.7 | 0.8 | 2.6 | 4.8 | 3.2 to 4.3 |
| ramp share | from freeway via College Avenue | % | 9.6 | 1.3 | 8.0 | 11.7 | 8.6 to 10.5 |
| ramp share | from freeway via Martin Street | % | 12.5 | 2.2 | 10.2 | 15.6 | 11.0 to 14.1 |
| ramp share | from freeway via Colby Street | % | 10.8 | 0.8 | 9.2 | 12.2 | 10.2 to 11.4 |
| ramp share | from freeway via Hillegass Avenue | % | 6.6 | 1.4 | 4.3 | 8.9 | 5.6 to 7.6 |
| ramp share | from freeway via Benvenue Avenue | % | 3.1 | 0.8 | 2.0 | 4.5 | 2.5 to 3.7 |
| corridor flow | Telegraph N median link flow | veh/h | 1126.68 | 54.68 | 1040.40 | 1234.80 | 1087.56 to 1165.80 |
| corridor flow | Telegraph S median link flow | veh/h | 780.60 | 61.25 | 640.80 | 842.40 | 736.79 to 824.41 |
| corridor flow | College N median link flow | veh/h | 388.08 | 25.21 | 352.80 | 416.40 | 370.05 to 406.11 |
| corridor flow | College S median link flow | veh/h | 671.76 | 26.23 | 633.60 | 716.40 | 653.00 to 690.52 |
| corridor flow | Claremont N median link flow | veh/h | 391.80 | 27.37 | 339.60 | 428.40 | 372.22 to 411.38 |
| corridor flow | Claremont S median link flow | veh/h | 307.80 | 39.95 | 260.40 | 382.80 | 279.22 to 336.38 |
| corridor flow | Alcatraz E median link flow | veh/h | 544.56 | 51.28 | 428.40 | 615.60 | 507.88 to 581.24 |
| corridor flow | Alcatraz W median link flow | veh/h | 341.04 | 16.64 | 308.40 | 363.60 | 329.13 to 352.95 |
| corridor flow | Hillegass N median link flow | veh/h | 113.88 | 10.16 | 94.80 | 130.80 | 106.61 to 121.15 |
| corridor flow | Hillegass S median link flow | veh/h | 141.12 | 12.46 | 124.80 | 160.80 | 132.21 to 150.03 |
| corridor flow | Colby N median link flow | veh/h | 153.24 | 14.28 | 130.80 | 171.60 | 143.03 to 163.45 |
| corridor flow | Colby S median link flow | veh/h | 148.68 | 14.00 | 134.40 | 180.00 | 138.67 to 158.69 |
| corridor flow | Martin E median link flow | veh/h | 125.04 | 20.59 | 94.80 | 160.80 | 110.31 to 139.77 |
| corridor flow | Martin W median link flow | veh/h | 119.16 | 16.34 | 102.00 | 147.60 | 107.47 to 130.85 |

## Intent map: through cars by where they come from and where they are going

Through = neither trip end is in the study area. Groups are the approach groups of the area config (data/areas); a node that is not a gate takes the group of the nearest surface gate (ASSUMPTION). The arterial is the one a trip would use on the shortest free-flow path with the study area's residential and service streets closed, where that path runs on a boundary street near the study area.

Model figures are the mean of 10 seed(s), per hour of the run. Basis: OBSERVED = read from the resident volunteer count of Feb 25, 2025 or its headline shares; ASSUMPTION = inferred from those numbers or chosen.

### Colby Street NB

Observed: block volume 174 veh/h, whole-street cars 102, so through cars 102 to 145 veh/h. Model: 146 through cars per hour.

Observed (PM): 182 cars entered at the south end, 102 drove the whole street, 164 left it at Alcatraz Ave (131 left, 32 right, 1 straight), and 47% of the block's trips came from a freeway (the headline share). ASSUMPTION: freeway-origin cars that do not end along the street are 65 veh/h (the 82 freeway-origin trips on the block, 47% of 174, times the 182 / (182 + 47) of its cars that entered at the south end rather than joining on the way), spread over the 164 exits in proportion (0.40); the other through cars come from the Telegraph Ave and south-side approaches that feed the street's south end. Ranges: low = 131 (32) x 0.47 x 0.62 (the whole-street share of exits), high = 131 (32) x 0.47.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | OBSERVED turn count x ASSUMPTION share (131 left turns x 0.40) | 52 (38 to 62) | 54 | within |
| Telegraph Ave and south-side traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | ASSUMPTION: the through left-turners (131 x 0.62 = 81) that are not off-ramp traffic | 29 (19 to 43) | 48 | above |
| SR-24 off-ramp traffic using Colby St to reach College Ave and Berkeley (right at Alcatraz Ave) | OBSERVED turn count x ASSUMPTION share (32 right turns x 0.40) | 13 (9 to 15) | 17 | above |
| Telegraph Ave and south-side traffic using Colby St to reach College Ave and Berkeley | ASSUMPTION: the through right-turners (32 x 0.62 = 20) that are not off-ramp traffic | 7 (5 to 11) | 25 | above |
| Intents listed, together | | 101 (71 to 131) | 144 | |
| Other through cars (no intent listed) | | | 1 | |

Model through cars by origin and destination group (largest 12 of 40 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 34.8 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 16.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Ashby Ave from the west (Emeryville and I-80) | 11.6 | none near the study area |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 9.8 | Telegraph Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Telegraph Ave from the north (Berkeley) | 8.5 | Telegraph Avenue |
| Telegraph Ave to the south (downtown Oakland) | Telegraph Ave from the north (Berkeley) | 7.9 | Telegraph Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Telegraph Ave from the north (Berkeley) | 6.9 | none near the study area |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Emeryville and West Oakland streets (55th to 67th Streets) | 6.1 | Claremont Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 5.8 | Claremont Avenue then College Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Shattuck Ave from the north (Berkeley) | 5.4 | Claremont Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 4.8 | SR-24 |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Ashby Ave from the west (Emeryville and I-80) | 4.6 | SR-24 then Telegraph Avenue |
| other pairs | | 23.4 | |

By the arterial these cars would otherwise use: Telegraph Avenue 80 veh/h; none near the study area 21 veh/h; Claremont Avenue 17 veh/h; SR-24 then Telegraph Avenue 8 veh/h; Claremont Avenue then College Avenue 6 veh/h; SR-24 5 veh/h.

### Hillegass Avenue NB

Observed: block volume 110 veh/h, whole-street cars 48, so through cars 48 to 95 veh/h. Model: 74 through cars per hour.

Observed (PM): 94 cars entered at the south end, 48 drove the whole street, 109 left it at Alcatraz Ave (43 west, 54 east, 12 straight), and 47% of the block's trips came from a freeway. ASSUMPTION: freeway-origin through cars are 40 veh/h (52 freeway-origin trips times 94 / (94 + 29)), spread over the exits in proportion (0.37); the through share of exits is 48 / 109 = 0.44.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Hillegass Ave to reach Alcatraz Ave west and Telegraph Ave north | OBSERVED turn count x ASSUMPTION share (43 left turns x 0.37) | 16 (9 to 20) | 16 | within |
| SR-24 off-ramp traffic using Hillegass Ave to reach College Ave and Berkeley | OBSERVED turn count x ASSUMPTION share (54 right turns x 0.37) | 20 (11 to 25) | 21 | within |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach Alcatraz Ave west | ASSUMPTION: through exits (43 x 0.44) that are not off-ramp traffic | 3 (0 to 10) | 9 | within |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach College Ave and Berkeley | ASSUMPTION: through exits (54 x 0.44) that are not off-ramp traffic | 4 (0 to 13) | 24 | above |
| Intents listed, together | | 43 (20 to 68) | 70 | |
| Other through cars (no intent listed) | | | 4 | |

Model through cars by origin and destination group (largest 12 of 48 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 14.6 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 10.4 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 10.3 | SR-24 |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 6.2 | SR-24 then Claremont Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | College Ave from the north (Berkeley) | 4.7 | SR-24 then Claremont Avenue then College Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Ashby Ave from the west (Emeryville and I-80) | 3.4 | College Avenue then Alcatraz Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Telegraph Ave from the north (Berkeley) | 2.6 | none near the study area |
| Telegraph Ave to the south (downtown Oakland) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 2.2 | Telegraph Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Claremont Ave and Tunnel Rd toward the hills | 2.1 | Alcatraz Avenue then Claremont Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | San Pablo Ave (Emeryville and West Oakland) | 1.3 | SR-24 |
| Telegraph Ave to the south (downtown Oakland) | Claremont Ave and Tunnel Rd toward the hills | 1.3 | Claremont Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Claremont Ave and Tunnel Rd toward the hills | 1.2 | Claremont Avenue |
| other pairs | | 13.9 | |

By the arterial these cars would otherwise use: Telegraph Avenue 31 veh/h; SR-24 12 veh/h; SR-24 then Claremont Avenue 6 veh/h; Claremont Avenue 5 veh/h; SR-24 then Claremont Avenue then College Avenue 5 veh/h; College Avenue then Alcatraz Avenue 4 veh/h.

### Hillegass Avenue SB

Observed: block volume 160 veh/h, whole-street cars 79, so through cars 79 to 120 veh/h. Model: 111 through cars per hour.

Observed (PM): 178 cars entered at the top (76 turned in from Alcatraz Ave west, 98 from the east, 4 came straight from the north), 79 drove the whole street, and 68% of the block's trips (109 veh/h) went to a freeway. ASSUMPTION: freeway-bound cars that did not join mid-street are 87 veh/h (109 x 178 / (178 + 44)), half of the 174 turn-ins; low = the whole-street share of the turn-ins (0.45), high = the freeway-bound share without the mid-street correction (0.63).

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Telegraph Ave, Alcatraz Ave west and West Berkeley traffic turning off Alcatraz Ave onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (76 turn-ins x 0.50) | 38 (34 to 48) | 40 | within |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (98 turn-ins x 0.50) | 49 (44 to 62) | 52 | within |
| Intents listed, together | | 87 (78 to 110) | 91 | |
| Other through cars (no intent listed) | | | 20 | |

Model through cars by origin and destination group (largest 12 of 27 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 39.3 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 24.5 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 15.9 | Claremont Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 8.8 | Telegraph Avenue |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 8.6 | College Avenue then Claremont Avenue then SR-24 |
| Ashby Ave from the west (Emeryville and I-80) | College Ave from the north (Berkeley) | 4.7 | Alcatraz Avenue then College Avenue |
| West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 1.9 | College Avenue |
| Berkeley hills to the northeast (Evergreen Ln, Gravatt Dr) | SR-24 westbound on-ramps (toward Oakland and I-980) | 1.3 | Claremont Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 1.2 | Claremont Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Telegraph Ave to the south (downtown Oakland) | 0.7 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 0.7 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 0.5 | Alcatraz Avenue then College Avenue |
| other pairs | | 2.8 | |

By the arterial these cars would otherwise use: Telegraph Avenue 75 veh/h; Claremont Avenue then SR-24 17 veh/h; College Avenue then Claremont Avenue then SR-24 9 veh/h; Alcatraz Avenue then College Avenue 5 veh/h; College Avenue 2 veh/h; Claremont Avenue 2 veh/h.

### Colby Street SB

Observed: block volume 160 veh/h, whole-street cars 39, so through cars 39 to 117 veh/h. Model: 103 through cars per hour.

Observed (PM): 139 cars entered at the top (76 from Alcatraz Ave west, 50 from the east, 13 from the north), 39 drove the whole street, 45% of the block's trips (72 veh/h) went to a freeway and 22% came by way of Telegraph Ave. ASSUMPTION: freeway-bound cars that did not join mid-street are 46 veh/h (72 x 139 / (139 + 79)), 0.365 of the 126 turn-ins; low = the whole-street share (0.31), high = the unadjusted freeway share (0.57). The Telegraph Ave cars are the 22% x 160 = 35 of the 76 west turn-ins.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Southbound Telegraph Ave traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (35 Telegraph Ave cars x 0.365) | 13 (11 to 20) | 20 | within |
| Alcatraz Ave west, Ashby Ave and West Berkeley traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (41 other west turn-ins x 0.365) | 15 (13 to 23) | 14 | within |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (50 east turn-ins x 0.365) | 18 (15 to 29) | 38 | above |
| Intents listed, together | | 46 (39 to 72) | 72 | |
| Other through cars (no intent listed) | | | 31 | |

Model through cars by origin and destination group (largest 12 of 45 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 24.5 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 17.9 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 16.0 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 9.0 | Claremont Avenue then SR-24 |
| Shattuck Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 7.5 | none near the study area |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 4.3 | College Avenue then Claremont Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Telegraph Ave to the south (downtown Oakland) | 2.1 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 2.0 | Telegraph Avenue |
| Ashby Ave from the west (Emeryville and I-80) | College Ave from the north (Berkeley) | 1.9 | Alcatraz Avenue then College Avenue |
| Alcatraz Ave from the west (Emeryville side) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 1.7 | SR-24 |
| Ashby Ave from the west (Emeryville and I-80) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 1.7 | SR-24 |
| Telegraph Ave from the north (Berkeley) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 1.7 | none near the study area |
| other pairs | | 12.6 | |

By the arterial these cars would otherwise use: Telegraph Avenue 63 veh/h; none near the study area 11 veh/h; Claremont Avenue then SR-24 9 veh/h; SR-24 7 veh/h; College Avenue then Claremont Avenue then SR-24 4 veh/h; Claremont Avenue 3 veh/h.

### Study area, all residential and service streets

Model: 655 through cars per hour.

Model through cars by origin and destination group (largest 12 of 114 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 73.3 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 64.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 52.2 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 48.2 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 40.7 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 38.4 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Emeryville and West Oakland streets (55th to 67th Streets) | 32.7 | Claremont Avenue |
| West Oakland to the southwest (Adeline St, Market St) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 29.1 | Telegraph Avenue then Claremont Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 23.4 | Claremont Avenue then SR-24 |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Ashby Ave from the west (Emeryville and I-80) | 18.8 | College Avenue then Alcatraz Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 16.3 | Claremont Avenue then College Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Shattuck Ave from the north (Berkeley) | 16.2 | Claremont Avenue |
| other pairs | | 201.3 | |

By the arterial these cars would otherwise use: Telegraph Avenue 368 veh/h; Claremont Avenue 69 veh/h; none near the study area 33 veh/h; Telegraph Avenue then Claremont Avenue 29 veh/h; SR-24 25 veh/h; Claremont Avenue then SR-24 25 veh/h.

By origin group: South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 132; SR-24 eastbound off-ramps (arriving from Oakland and I-980) 123; Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 121; Telegraph Ave from the north (Berkeley) 76; West Oakland to the southwest (Adeline St, Market St) 54; Claremont Ave and Tunnel Rd toward the hills 27; Telegraph Ave to the south (downtown Oakland) 27; SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) 26; Ashby Ave from the west (Emeryville and I-80) 20; College Ave from the north (Berkeley) 14.

By destination group: SR-24 westbound on-ramps (toward Oakland and I-980) 194; Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 103; South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 93; Telegraph Ave from the north (Berkeley) 92; Claremont Ave and Tunnel Rd toward the hills 38; Emeryville and West Oakland streets (55th to 67th Streets) 35; Ashby Ave from the west (Emeryville and I-80) 26; Shattuck Ave from the north (Berkeley) 21; College Ave from the north (Berkeley) 17; West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) 7.


Per-seed detail: `rockridge-pm_peak-s1-seed1.md` (seed 1 in full).
