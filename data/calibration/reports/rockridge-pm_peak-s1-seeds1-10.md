# rockridge-pm_peak-s1 over 10 seeds (1, 2, 3, 4, 5, 6, 7, 8, 9, 10)

Seeds are the fixed list above, none chosen; each run is 60 minutes from the same start. Interval = 95% interval of the mean (Student t, n - 1 degrees of freedom). Run-to-run noise only: demand is fixed, so day-to-day variation is not in these intervals.

## Stability rule (design decision D16)

| Check | Rule | Result | Pass |
| --- | --- | --- | --- |
| Removals | mean per hour below 1.00 | 1.20 (min 0.00, max 3.00) | NO |
| Entry backlog | below 2.0% in at least 90% of seeds | 10 of 10 seeds | yes |
| Runaway growth | no seed adds more than 2.0 points of backlog in the second half | none | yes |
| Arterial speed | mean above 4.0 m/s | 8.12 m/s | yes |

**Verdict: not stable.** Old rule (zero removals, backlog under 2%, speed above 4 m/s, every seed): 3 of 10 seeds pass.

## Metrics over seeds

| Group | Metric | Unit | Mean | SD | Min | Max | 95% interval |
| --- | --- | --- | --- | --- | --- | --- | --- |
| health | gridlock removals | vehicles | 1.20 | 1.03 | 0.00 | 3.00 | 0.46 to 1.94 |
| health | gridlock removals per hour | veh/h | 1.20 | 1.03 | 0.00 | 3.00 | 0.46 to 1.94 |
| health | entry backlog | % of spawned | 0.67 | 0.30 | 0.11 | 1.08 | 0.46 to 0.89 |
| health | backlog growth in the second half of the run | points of spawned | 0.39 | 0.19 | 0.06 | 0.65 | 0.25 to 0.53 |
| health | completed trips | trips | 25788.30 | 172.79 | 25557.00 | 26040.00 | 25664.70 to 25911.90 |
| health | arterial mean speed | m/s | 8.12 | 0.18 | 7.83 | 8.44 | 7.99 to 8.24 |
| health | arterial mean speed, last 15 min | m/s | 7.88 | 0.27 | 7.29 | 8.21 | 7.69 to 8.07 |
| junction recovery | courtesy admissions per hour | veh/h | 326.20 | 45.59 | 258.00 | 398.00 | 293.59 to 358.81 |
| junction recovery | yield fallback admissions per hour | veh/h | 137.20 | 19.44 | 103.00 | 171.00 | 123.30 to 151.10 |
| junction recovery | conflict bypass admissions per hour | veh/h | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| junction recovery | vehicles removed while held in a node, per hour | veh/h | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| cut-through | local vehicle-miles, surface gates to the freeway | veh-miles | 43.46 | 4.35 | 32.87 | 48.79 | 40.35 to 46.58 |
| cut-through | share of local vehicle-miles, surface gates to the freeway | % | 8.2 | 0.7 | 7.0 | 9.5 | 7.7 to 8.7 |
| cut-through | local vehicle-miles, freeway to the surface gates | veh-miles | 33.75 | 3.28 | 28.97 | 38.66 | 31.41 to 36.10 |
| cut-through | share of local vehicle-miles, freeway to the surface gates | % | 6.4 | 0.9 | 5.4 | 8.3 | 5.8 to 7.0 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue N | trips | 41.90 | 3.98 | 36.00 | 49.00 | 39.05 to 44.75 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue N | trips | 1534.50 | 23.58 | 1490.00 | 1579.00 | 1517.64 to 1551.36 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue S | trips | 83.10 | 12.44 | 66.00 | 105.00 | 74.20 to 92.00 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue S | trips | 1375.40 | 24.11 | 1329.00 | 1406.00 | 1358.16 to 1392.64 |
| headline share | Hillegass Avenue NB from freeway | % | 52.9 | 3.0 | 48.4 | 59.7 | 50.7 to 55.0 |
| share | Hillegass Avenue NB to Benvenue Avenue | % | 3.8 | 1.5 | 1.8 | 6.1 | 2.8 to 4.9 |
| share | Hillegass Avenue NB to College Avenue | % | 16.4 | 1.7 | 13.5 | 18.2 | 15.2 to 17.6 |
| share | Hillegass Avenue NB to Alcatraz Avenue WB | % | 27.7 | 2.1 | 24.9 | 30.9 | 26.2 to 29.2 |
| headline share | Colby Street NB from freeway | % | 50.7 | 3.2 | 45.4 | 55.0 | 48.4 to 53.0 |
| share | Colby Street NB to Alcatraz Avenue WB | % | 46.8 | 3.9 | 41.6 | 53.9 | 44.0 to 49.6 |
| share | Colby Street NB to Telegraph Avenue | % | 36.3 | 3.6 | 29.3 | 40.7 | 33.7 to 38.8 |
| share | Colby Street NB to College Avenue | % | 6.6 | 1.9 | 4.7 | 9.6 | 5.2 to 7.9 |
| share | Hillegass Avenue SB from Alcatraz Avenue WB | % | 31.2 | 3.8 | 24.6 | 35.6 | 28.6 to 33.9 |
| share | Hillegass Avenue SB from Benvenue Avenue | % | 9.7 | 1.3 | 7.3 | 11.9 | 8.7 to 10.6 |
| share | Hillegass Avenue SB from College Avenue | % | 19.2 | 3.5 | 14.6 | 27.9 | 16.7 to 21.7 |
| headline share | Hillegass Avenue SB to freeway | % | 52.8 | 4.9 | 43.8 | 58.9 | 49.3 to 56.3 |
| share | Colby Street SB from Alcatraz Avenue EB | % | 26.1 | 2.9 | 20.8 | 31.2 | 24.0 to 28.2 |
| share | Colby Street SB from Alcatraz Avenue WB | % | 13.7 | 1.4 | 11.7 | 16.1 | 12.6 to 14.7 |
| share | Colby Street SB from Telegraph Avenue | % | 22.9 | 2.8 | 18.3 | 25.8 | 20.9 to 24.9 |
| headline share | Colby Street SB to freeway | % | 34.1 | 2.8 | 29.4 | 39.0 | 32.1 to 36.1 |
| share | Colby Street SB to Forest Street | % | 27.5 | 3.7 | 19.7 | 31.2 | 24.9 to 30.2 |
| ramp share | onto freeway via College Avenue | % | 14.4 | 0.8 | 13.2 | 15.7 | 13.8 to 15.0 |
| ramp share | onto freeway via Hillegass Avenue | % | 15.4 | 1.4 | 12.7 | 17.4 | 14.4 to 16.4 |
| ramp share | onto freeway via Martin Street | % | 13.6 | 1.5 | 11.4 | 15.7 | 12.5 to 14.6 |
| ramp share | onto freeway via Colby Street | % | 10.6 | 1.6 | 8.8 | 13.0 | 9.4 to 11.7 |
| ramp share | onto freeway via Telegraph Avenue north of Alcatraz Avenue | % | 11.8 | 1.0 | 10.7 | 13.8 | 11.2 to 12.5 |
| ramp share | onto freeway via Benvenue Avenue | % | 5.0 | 0.8 | 3.9 | 6.8 | 4.4 to 5.6 |
| ramp share | from freeway via College Avenue | % | 9.9 | 1.3 | 8.0 | 11.3 | 8.9 to 10.8 |
| ramp share | from freeway via Martin Street | % | 11.9 | 1.2 | 10.1 | 13.8 | 11.0 to 12.8 |
| ramp share | from freeway via Colby Street | % | 12.9 | 1.6 | 11.0 | 15.6 | 11.8 to 14.1 |
| ramp share | from freeway via Hillegass Avenue | % | 8.4 | 1.2 | 6.9 | 10.7 | 7.6 to 9.2 |
| ramp share | from freeway via Benvenue Avenue | % | 2.6 | 0.6 | 1.5 | 3.8 | 2.1 to 3.1 |
| corridor flow | Telegraph N median link flow | veh/h | 1017.12 | 60.02 | 931.20 | 1118.40 | 974.19 to 1060.05 |
| corridor flow | Telegraph S median link flow | veh/h | 973.80 | 40.49 | 902.40 | 1038.00 | 944.84 to 1002.76 |
| corridor flow | College N median link flow | veh/h | 403.92 | 30.43 | 362.40 | 448.80 | 382.15 to 425.69 |
| corridor flow | College S median link flow | veh/h | 539.64 | 91.38 | 351.60 | 662.40 | 474.27 to 605.01 |
| corridor flow | Claremont N median link flow | veh/h | 501.48 | 49.08 | 445.20 | 601.20 | 466.38 to 536.58 |
| corridor flow | Claremont S median link flow | veh/h | 387.72 | 29.28 | 349.20 | 432.00 | 366.77 to 408.67 |
| corridor flow | Alcatraz E median link flow | veh/h | 489.84 | 35.38 | 426.00 | 537.60 | 464.53 to 515.15 |
| corridor flow | Alcatraz W median link flow | veh/h | 338.40 | 19.24 | 302.40 | 378.00 | 324.64 to 352.16 |
| corridor flow | Hillegass N median link flow | veh/h | 124.56 | 7.13 | 116.40 | 136.80 | 119.46 to 129.66 |
| corridor flow | Hillegass S median link flow | veh/h | 158.52 | 26.64 | 111.60 | 205.20 | 139.46 to 177.58 |
| corridor flow | Colby N median link flow | veh/h | 168.12 | 9.09 | 153.60 | 178.80 | 161.61 to 174.63 |
| corridor flow | Colby S median link flow | veh/h | 187.32 | 20.42 | 153.60 | 220.80 | 172.72 to 201.92 |
| corridor flow | Martin E median link flow | veh/h | 148.08 | 25.56 | 98.40 | 180.00 | 129.79 to 166.37 |
| corridor flow | Martin W median link flow | veh/h | 158.52 | 46.38 | 104.40 | 266.40 | 125.35 to 191.69 |

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

Model through cars by origin and destination group (largest 12 of 31 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 63.7 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 29.0 | Telegraph Avenue |
| Telegraph Ave to the south (downtown Oakland) | Telegraph Ave from the north (Berkeley) | 6.8 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 5.8 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Ashby Ave from the west (Emeryville and I-80) | 5.7 | none near the study area |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Emeryville and West Oakland streets (55th to 67th Streets) | 5.4 | Claremont Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 5.3 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Shattuck Ave from the north (Berkeley) | 4.8 | Claremont Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Telegraph Ave from the north (Berkeley) | 4.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | College Ave from the north (Berkeley) | 3.9 | SR-24 then Claremont Avenue then College Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 2.7 | SR-24 |
| Telegraph Ave to the south (downtown Oakland) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 1.8 | Telegraph Avenue |
| other pairs | | 7.9 | |

By the arterial these cars would otherwise use: Telegraph Avenue 118 veh/h; Claremont Avenue 12 veh/h; none near the study area 6 veh/h; SR-24 then Claremont Avenue then College Avenue 4 veh/h; SR-24 3 veh/h; Alcatraz Avenue then Claremont Avenue 1 veh/h.

### Hillegass Avenue NB

Observed: block volume 110 veh/h, whole-street cars 48, so through cars 48 to 95 veh/h. Model: 96 through cars per hour.

Observed (PM): 94 cars entered at the south end, 48 drove the whole street, 109 left it at Alcatraz Ave (43 west, 54 east, 12 straight), and 47% of the block's trips came from a freeway. ASSUMPTION: freeway-origin through cars are 40 veh/h (52 freeway-origin trips times 94 / (94 + 29)), spread over the exits in proportion (0.37); the through share of exits is 48 / 109 = 0.44.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Hillegass Ave to reach Alcatraz Ave west and Telegraph Ave north | OBSERVED turn count x ASSUMPTION share (43 left turns x 0.37) | 16 (9 to 20) | 25 | above |
| SR-24 off-ramp traffic using Hillegass Ave to reach College Ave and Berkeley | OBSERVED turn count x ASSUMPTION share (54 right turns x 0.37) | 20 (11 to 25) | 32 | above |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach Alcatraz Ave west | ASSUMPTION: through exits (43 x 0.44) that are not off-ramp traffic | 3 (0 to 10) | 5 | within |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach College Ave and Berkeley | ASSUMPTION: through exits (54 x 0.44) that are not off-ramp traffic | 4 (0 to 13) | 27 | above |
| Intents listed, together | | 43 (20 to 68) | 89 | |
| Other through cars (no intent listed) | | | 6 | |

Model through cars by origin and destination group (largest 12 of 43 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 19.0 | SR-24 |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 18.2 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 15.3 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | College Ave from the north (Berkeley) | 6.4 | SR-24 then Claremont Avenue then College Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 4.7 | SR-24 then Claremont Avenue |
| Telegraph Ave to the south (downtown Oakland) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 4.7 | Telegraph Avenue |
| SR-13 Warren Freeway (via SR-24 east) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 3.9 | Claremont Avenue then Alcatraz Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 2.0 | Claremont Avenue then Alcatraz Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Ashby Ave from the west (Emeryville and I-80) | 1.8 | SR-24 then Telegraph Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Telegraph Ave from the north (Berkeley) | 1.7 | none near the study area |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | College Ave from the north (Berkeley) | 1.6 | Claremont Avenue then College Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | San Pablo Ave (Emeryville and West Oakland) | 1.5 | SR-24 |
| other pairs | | 14.9 | |

By the arterial these cars would otherwise use: Telegraph Avenue 42 veh/h; SR-24 20 veh/h; SR-24 then Claremont Avenue then College Avenue 6 veh/h; Claremont Avenue then Alcatraz Avenue 6 veh/h; Claremont Avenue 6 veh/h; SR-24 then Claremont Avenue 5 veh/h.

### Hillegass Avenue SB

Observed: block volume 160 veh/h, whole-street cars 79, so through cars 79 to 120 veh/h. Model: 155 through cars per hour.

Observed (PM): 178 cars entered at the top (76 turned in from Alcatraz Ave west, 98 from the east, 4 came straight from the north), 79 drove the whole street, and 68% of the block's trips (109 veh/h) went to a freeway. ASSUMPTION: freeway-bound cars that did not join mid-street are 87 veh/h (109 x 178 / (178 + 44)), half of the 174 turn-ins; low = the whole-street share of the turn-ins (0.45), high = the freeway-bound share without the mid-street correction (0.63).

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Telegraph Ave, Alcatraz Ave west and West Berkeley traffic turning off Alcatraz Ave onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (76 turn-ins x 0.50) | 38 (34 to 48) | 41 | within |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (98 turn-ins x 0.50) | 49 (44 to 62) | 57 | within |
| Intents listed, together | | 87 (78 to 110) | 99 | |
| Other through cars (no intent listed) | | | 57 | |

Model through cars by origin and destination group (largest 12 of 35 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 40.1 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 27.6 | Telegraph Avenue |
| Ashby Ave from the west (Emeryville and I-80) | College Ave from the north (Berkeley) | 18.6 | Alcatraz Avenue then College Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 17.0 | Claremont Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 12.3 | Telegraph Avenue |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 10.6 | College Avenue then Claremont Avenue then SR-24 |
| West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 6.2 | College Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Telegraph Ave to the south (downtown Oakland) | 3.8 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 3.5 | College Avenue |
| College Ave from the north (Berkeley) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 3.4 | College Avenue |
| Ashby Ave from the west (Emeryville and I-80) | Berkeley hills to the northeast (Evergreen Ln, Gravatt Dr) | 3.0 | none near the study area |
| Ashby Ave from the west (Emeryville and I-80) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 1.6 | Alcatraz Avenue then Claremont Avenue |
| other pairs | | 7.4 | |

By the arterial these cars would otherwise use: Telegraph Avenue 84 veh/h; Alcatraz Avenue then College Avenue 19 veh/h; Claremont Avenue then SR-24 17 veh/h; College Avenue 13 veh/h; College Avenue then Claremont Avenue then SR-24 11 veh/h; none near the study area 4 veh/h.

### Colby Street SB

Observed: block volume 160 veh/h, whole-street cars 39, so through cars 39 to 117 veh/h. Model: 160 through cars per hour.

Observed (PM): 139 cars entered at the top (76 from Alcatraz Ave west, 50 from the east, 13 from the north), 39 drove the whole street, 45% of the block's trips (72 veh/h) went to a freeway and 22% came by way of Telegraph Ave. ASSUMPTION: freeway-bound cars that did not join mid-street are 46 veh/h (72 x 139 / (139 + 79)), 0.365 of the 126 turn-ins; low = the whole-street share (0.31), high = the unadjusted freeway share (0.57). The Telegraph Ave cars are the 22% x 160 = 35 of the 76 west turn-ins.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Southbound Telegraph Ave traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (35 Telegraph Ave cars x 0.365) | 13 (11 to 20) | 14 | within |
| Alcatraz Ave west, Ashby Ave and West Berkeley traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (41 other west turn-ins x 0.365) | 15 (13 to 23) | 19 | within |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (50 east turn-ins x 0.365) | 18 (15 to 29) | 36 | above |
| Intents listed, together | | 46 (39 to 72) | 69 | |
| Other through cars (no intent listed) | | | 90 | |

Model through cars by origin and destination group (largest 12 of 52 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 27.8 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 20.5 | Telegraph Avenue |
| Ashby Ave from the west (Emeryville and I-80) | College Ave from the north (Berkeley) | 19.9 | Alcatraz Avenue then College Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 12.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Telegraph Ave to the south (downtown Oakland) | 11.7 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 9.6 | Claremont Avenue then SR-24 |
| Shattuck Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 7.3 | none near the study area |
| Telegraph Ave from the north (Berkeley) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 6.4 | Telegraph Avenue |
| West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 5.8 | College Avenue |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 5.5 | College Avenue then Claremont Avenue then SR-24 |
| Ashby Ave from the west (Emeryville and I-80) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 3.1 | SR-24 |
| Ashby Ave from the west (Emeryville and I-80) | Berkeley hills to the northeast (Evergreen Ln, Gravatt Dr) | 2.9 | none near the study area |
| other pairs | | 27.1 | |

By the arterial these cars would otherwise use: Telegraph Avenue 79 veh/h; Alcatraz Avenue then College Avenue 20 veh/h; none near the study area 17 veh/h; Claremont Avenue then SR-24 10 veh/h; SR-24 9 veh/h; College Avenue 7 veh/h.

### Study area, all residential and service streets

Model: 928 through cars per hour.

Model through cars by origin and destination group (largest 12 of 98 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 122.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 92.3 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 80.7 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 74.5 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 49.0 | Telegraph Avenue |
| Ashby Ave from the west (Emeryville and I-80) | College Ave from the north (Berkeley) | 43.4 | Alcatraz Avenue then College Avenue |
| Telegraph Ave from the north (Berkeley) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 41.3 | Telegraph Avenue |
| West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) | SR-24 westbound on-ramps (toward Oakland and I-980) | 31.0 | none near the study area |
| West Oakland to the southwest (Adeline St, Market St) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 30.3 | Telegraph Avenue then Claremont Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 24.5 | Claremont Avenue then SR-24 |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Emeryville and West Oakland streets (55th to 67th Streets) | 23.8 | Claremont Avenue |
| Emeryville and West Oakland streets (55th to 67th Streets) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 20.7 | none near the study area |
| other pairs | | 294.6 | |

By the arterial these cars would otherwise use: Telegraph Avenue 561 veh/h; none near the study area 85 veh/h; Claremont Avenue 72 veh/h; Alcatraz Avenue then College Avenue 43 veh/h; SR-24 30 veh/h; Telegraph Avenue then Claremont Avenue 30 veh/h.

By origin group: Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 233; South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 167; SR-24 eastbound off-ramps (arriving from Oakland and I-980) 123; Telegraph Ave from the north (Berkeley) 92; Ashby Ave from the west (Emeryville and I-80) 62; West Oakland to the southwest (Adeline St, Market St) 44; West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) 43; Telegraph Ave to the south (downtown Oakland) 35; Emeryville and West Oakland streets (55th to 67th Streets) 34; Claremont Ave and Tunnel Rd toward the hills 26.

By destination group: SR-24 westbound on-ramps (toward Oakland and I-980) 229; South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 222; Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 159; Telegraph Ave from the north (Berkeley) 108; College Ave from the north (Berkeley) 58; Claremont Ave and Tunnel Rd toward the hills 39; Telegraph Ave to the south (downtown Oakland) 24; Emeryville and West Oakland streets (55th to 67th Streets) 24; Shattuck Ave from the north (Berkeley) 18; Berkeley hills to the northeast (Evergreen Ln, Gravatt Dr) 15.


Per-seed detail: `rockridge-pm_peak-s1-seed1.md` (seed 1 in full).
