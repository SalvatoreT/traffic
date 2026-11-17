# rockridge-midday-s1 over 10 seeds (1, 2, 3, 4, 5, 6, 7, 8, 9, 10)

Seeds are the fixed list above, none chosen; each run is 60 minutes from the same start. Interval = 95% interval of the mean (Student t, n - 1 degrees of freedom). Run-to-run noise only: demand is fixed, so day-to-day variation is not in these intervals.

## Stability rule (design decision D16)

| Check | Rule | Result | Pass |
| --- | --- | --- | --- |
| Cars cleared from gridlock near the study area (judged zone) | mean per hour below 1.00 | 0.00 (min 0.00, max 0.00) | yes |
| Entry backlog | below 2.0% in at least 90% of seeds | 10 of 10 seeds | yes |
| Runaway growth | no seed adds more than 2.0 points of backlog in the second half | none | yes |
| Arterial speed | mean above 4.0 m/s | 10.07 m/s | yes |

**Verdict: stable.** Old rule (zero removals, backlog under 2%, speed above 4 m/s, every seed): 10 of 10 seeds pass.

## Metrics over seeds

| Group | Metric | Unit | Mean | SD | Min | Max | 95% interval |
| --- | --- | --- | --- | --- | --- | --- | --- |
| health | gridlock removals | vehicles | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| health | gridlock removals per hour | veh/h | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| health | entry backlog | % of spawned | 0.00 | 0.01 | 0.00 | 0.02 | 0.00 to 0.01 |
| health | backlog growth in the second half of the run | points of spawned | 0.00 | 0.01 | -0.01 | 0.02 | -0.00 to 0.01 |
| health | completed trips | trips | 16705.10 | 166.01 | 16528.00 | 16988.00 | 16586.35 to 16823.85 |
| health | arterial mean speed | m/s | 10.07 | 0.05 | 9.98 | 10.13 | 10.03 to 10.10 |
| health | arterial mean speed, last 15 min | m/s | 10.08 | 0.10 | 9.96 | 10.25 | 10.01 to 10.15 |
| junction recovery | courtesy admissions per hour | veh/h | 46.50 | 8.37 | 39.00 | 68.00 | 40.51 to 52.49 |
| junction recovery | yield fallback admissions per hour | veh/h | 5.70 | 1.83 | 3.00 | 9.00 | 4.39 to 7.01 |
| junction recovery | conflict bypass admissions per hour | veh/h | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| junction recovery | vehicles removed while held in a node, per hour | veh/h | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| gridlock by place | cars cleared from gridlock per hour, judged (near the study area, and far ones whose chain reaches it) | veh/h | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| gridlock by place | cars cleared from gridlock per hour, near the study area | veh/h | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| gridlock by place | cars cleared from gridlock per hour, farther out | veh/h | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| gridlock by place | cars cleared from gridlock per hour, farther out with a chain into the judged zone | veh/h | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| gridlock by place | trips waiting at origins in the judged zone at the end | trips | 0.10 | 0.32 | 0.00 | 1.00 | -0.13 to 0.33 |
| cut-through | local vehicle-miles, surface gates to the freeway | veh-miles | 26.37 | 4.21 | 21.77 | 33.09 | 23.35 to 29.38 |
| cut-through | share of local vehicle-miles, surface gates to the freeway | % | 10.2 | 1.4 | 8.9 | 12.6 | 9.2 to 11.2 |
| cut-through | local vehicle-miles, freeway to the surface gates | veh-miles | 23.99 | 3.34 | 19.01 | 29.51 | 21.60 to 26.38 |
| cut-through | share of local vehicle-miles, freeway to the surface gates | % | 9.3 | 1.2 | 8.0 | 11.1 | 8.4 to 10.1 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue N | trips | 26.30 | 4.37 | 20.00 | 33.00 | 23.17 to 29.43 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue N | trips | 890.50 | 19.44 | 858.00 | 912.00 | 876.59 to 904.41 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue S | trips | 40.50 | 5.78 | 34.00 | 55.00 | 36.37 to 44.63 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue S | trips | 963.70 | 28.92 | 919.00 | 1000.00 | 943.01 to 984.39 |
| headline share | Hillegass Avenue NB from freeway | % | 52.6 | 4.6 | 44.9 | 59.9 | 49.3 to 55.9 |
| share | Hillegass Avenue NB to Benvenue Avenue | % | 3.3 | 1.3 | 1.9 | 5.5 | 2.4 to 4.2 |
| share | Hillegass Avenue NB to College Avenue | % | 15.6 | 1.8 | 12.8 | 18.4 | 14.3 to 16.9 |
| share | Hillegass Avenue NB to Alcatraz Avenue WB | % | 30.6 | 3.6 | 24.8 | 36.1 | 28.0 to 33.1 |
| headline share | Colby Street NB from freeway | % | 37.2 | 3.0 | 32.0 | 42.0 | 35.0 to 39.3 |
| share | Colby Street NB to Alcatraz Avenue WB | % | 47.9 | 2.8 | 43.4 | 50.3 | 45.9 to 49.9 |
| share | Colby Street NB to Telegraph Avenue | % | 34.8 | 2.2 | 30.9 | 38.8 | 33.2 to 36.4 |
| share | Colby Street NB to College Avenue | % | 7.2 | 2.0 | 4.5 | 11.1 | 5.8 to 8.6 |
| share | Hillegass Avenue SB from Alcatraz Avenue WB | % | 31.6 | 5.6 | 22.2 | 42.4 | 27.6 to 35.6 |
| share | Hillegass Avenue SB from Benvenue Avenue | % | 5.3 | 2.6 | 1.8 | 11.1 | 3.5 to 7.2 |
| share | Hillegass Avenue SB from College Avenue | % | 16.7 | 4.3 | 9.1 | 21.2 | 13.6 to 19.8 |
| headline share | Hillegass Avenue SB to freeway | % | 62.8 | 4.2 | 57.7 | 70.8 | 59.8 to 65.7 |
| share | Colby Street SB from Alcatraz Avenue EB | % | 21.5 | 3.3 | 17.9 | 28.2 | 19.2 to 23.9 |
| share | Colby Street SB from Alcatraz Avenue WB | % | 22.5 | 1.7 | 20.4 | 24.8 | 21.2 to 23.7 |
| share | Colby Street SB from Telegraph Avenue | % | 18.9 | 2.7 | 15.7 | 25.0 | 16.9 to 20.8 |
| headline share | Colby Street SB to freeway | % | 45.5 | 3.6 | 40.7 | 50.9 | 42.9 to 48.1 |
| share | Colby Street SB to Forest Street | % | 14.3 | 4.3 | 9.1 | 24.1 | 11.3 to 17.4 |
| ramp share | onto freeway via College Avenue | % | 12.3 | 0.8 | 10.7 | 13.6 | 11.7 to 12.8 |
| ramp share | onto freeway via Hillegass Avenue | % | 14.4 | 1.5 | 12.7 | 18.2 | 13.3 to 15.4 |
| ramp share | onto freeway via Martin Street | % | 13.3 | 2.1 | 8.9 | 15.8 | 11.8 to 14.8 |
| ramp share | onto freeway via Colby Street | % | 12.6 | 1.6 | 10.1 | 15.2 | 11.5 to 13.8 |
| ramp share | onto freeway via Telegraph Avenue north of Alcatraz Avenue | % | 9.3 | 0.9 | 8.4 | 11.5 | 8.6 to 9.9 |
| ramp share | onto freeway via Benvenue Avenue | % | 5.1 | 1.0 | 3.2 | 6.1 | 4.4 to 5.8 |
| ramp share | from freeway via College Avenue | % | 9.6 | 1.2 | 7.8 | 11.5 | 8.8 to 10.5 |
| ramp share | from freeway via Martin Street | % | 11.3 | 1.8 | 8.0 | 14.2 | 10.0 to 12.6 |
| ramp share | from freeway via Colby Street | % | 11.6 | 1.3 | 9.6 | 13.2 | 10.7 to 12.5 |
| ramp share | from freeway via Hillegass Avenue | % | 8.4 | 0.9 | 6.8 | 10.0 | 7.7 to 9.0 |
| ramp share | from freeway via Benvenue Avenue | % | 2.7 | 0.6 | 1.5 | 3.3 | 2.3 to 3.1 |
| corridor flow | Telegraph N median link flow | veh/h | 625.56 | 37.27 | 568.80 | 678.00 | 598.90 to 652.22 |
| corridor flow | Telegraph S median link flow | veh/h | 652.44 | 23.34 | 609.60 | 681.60 | 635.74 to 669.14 |
| corridor flow | College N median link flow | veh/h | 218.64 | 31.46 | 184.80 | 283.20 | 196.13 to 241.15 |
| corridor flow | College S median link flow | veh/h | 340.20 | 27.36 | 306.00 | 388.80 | 320.63 to 359.77 |
| corridor flow | Claremont N median link flow | veh/h | 259.56 | 27.25 | 219.60 | 303.60 | 240.07 to 279.05 |
| corridor flow | Claremont S median link flow | veh/h | 165.48 | 21.48 | 130.80 | 198.00 | 150.11 to 180.85 |
| corridor flow | Alcatraz E median link flow | veh/h | 384.12 | 19.83 | 346.80 | 414.00 | 369.93 to 398.31 |
| corridor flow | Alcatraz W median link flow | veh/h | 238.44 | 15.60 | 214.80 | 264.00 | 227.28 to 249.60 |
| corridor flow | Hillegass N median link flow | veh/h | 77.76 | 12.10 | 61.20 | 99.60 | 69.10 to 86.42 |
| corridor flow | Hillegass S median link flow | veh/h | 72.84 | 7.18 | 61.20 | 84.00 | 67.70 to 77.98 |
| corridor flow | Colby N median link flow | veh/h | 99.24 | 8.87 | 84.00 | 115.20 | 92.89 to 105.59 |
| corridor flow | Colby S median link flow | veh/h | 72.00 | 9.78 | 57.60 | 86.40 | 65.00 to 79.00 |
| corridor flow | Martin E median link flow | veh/h | 78.48 | 10.75 | 56.40 | 90.00 | 70.79 to 86.17 |
| corridor flow | Martin W median link flow | veh/h | 68.88 | 8.47 | 56.40 | 78.00 | 62.82 to 74.94 |

## Intent map: through cars by where they come from and where they are going

Through = neither trip end is in the study area. Groups are the approach groups of the area config (data/areas); a node that is not a gate takes the group of the nearest surface gate (ASSUMPTION). The arterial is the one a trip would use on the shortest free-flow path with the study area's residential and service streets closed, where that path runs on a boundary street near the study area.

Model figures are the mean of 10 seed(s), per hour of the run. Basis: OBSERVED = read from the resident volunteer count of Feb 25, 2025 or its headline shares; ASSUMPTION = inferred from those numbers or chosen.

### Colby Street NB

Observed (PM): 182 cars entered at the south end, 102 drove the whole street, 164 left it at Alcatraz Ave (131 left, 32 right, 1 straight), and 47% of the block's trips came from a freeway (the headline share). ASSUMPTION: freeway-origin cars that do not end along the street are 65 veh/h (the 82 freeway-origin trips on the block, 47% of 174, times the 182 / (182 + 47) of its cars that entered at the south end rather than joining on the way), spread over the 164 exits in proportion (0.40); the other through cars come from the Telegraph Ave and south-side approaches that feed the street's south end. Ranges: low = 131 (32) x 0.47 x 0.62 (the whole-street share of exits), high = 131 (32) x 0.47.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | OBSERVED turn count x ASSUMPTION share (131 left turns x 0.40) | 52 (38 to 62) | 41 | within |
| Telegraph Ave and south-side traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | ASSUMPTION: the through left-turners (131 x 0.62 = 81) that are not off-ramp traffic | 29 (19 to 43) | 15 | below |
| SR-24 off-ramp traffic using Colby St to reach College Ave and Berkeley (right at Alcatraz Ave) | OBSERVED turn count x ASSUMPTION share (32 right turns x 0.40) | 13 (9 to 15) | 7 | below |
| Telegraph Ave and south-side traffic using Colby St to reach College Ave and Berkeley | ASSUMPTION: the through right-turners (32 x 0.62 = 20) that are not off-ramp traffic | 7 (5 to 11) | 9 | within |
| Intents listed, together | | 101 (71 to 131) | 72 | |
| Other through cars (no intent listed) | | | 5 | |

Model through cars by origin and destination group (largest 12 of 31 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 40.8 | Telegraph Avenue |
| Telegraph Ave to the south (downtown Oakland) | Telegraph Ave from the north (Berkeley) | 6.3 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Ashby Ave from the west (Emeryville and I-80) | 5.6 | none near the study area |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 4.8 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 3.9 | SR-24 then Claremont Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | College Ave from the north (Berkeley) | 1.8 | SR-24 then Claremont Avenue then College Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Claremont Ave and Tunnel Rd toward the hills | 1.5 | Alcatraz Avenue then Claremont Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 1.5 | SR-24 |
| West Oakland to the southwest (Adeline St, Market St) | Telegraph Ave from the north (Berkeley) | 1.4 | Telegraph Avenue |
| San Pablo Ave (Emeryville and West Oakland) | Claremont Ave and Tunnel Rd toward the hills | 1.1 | Alcatraz Avenue then Claremont Avenue |
| San Pablo Ave (Emeryville and West Oakland) | College Ave from the north (Berkeley) | 1.1 | Claremont Avenue then College Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Alcatraz Ave from the west (Emeryville side) | 0.8 | College Avenue then Alcatraz Avenue |
| other pairs | | 5.7 | |

By the arterial these cars would otherwise use: Telegraph Avenue 54 veh/h; none near the study area 6 veh/h; SR-24 then Claremont Avenue 4 veh/h; Alcatraz Avenue then Claremont Avenue 3 veh/h; Claremont Avenue 2 veh/h; SR-24 then Claremont Avenue then College Avenue 2 veh/h.

### Hillegass Avenue NB

Observed (PM): 94 cars entered at the south end, 48 drove the whole street, 109 left it at Alcatraz Ave (43 west, 54 east, 12 straight), and 47% of the block's trips came from a freeway. ASSUMPTION: freeway-origin through cars are 40 veh/h (52 freeway-origin trips times 94 / (94 + 29)), spread over the exits in proportion (0.37); the through share of exits is 48 / 109 = 0.44.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Hillegass Ave to reach Alcatraz Ave west and Telegraph Ave north | OBSERVED turn count x ASSUMPTION share (43 left turns x 0.37) | 16 (9 to 20) | 15 | within |
| SR-24 off-ramp traffic using Hillegass Ave to reach College Ave and Berkeley | OBSERVED turn count x ASSUMPTION share (54 right turns x 0.37) | 20 (11 to 25) | 24 | within |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach Alcatraz Ave west | ASSUMPTION: through exits (43 x 0.44) that are not off-ramp traffic | 3 (0 to 10) | 5 | within |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach College Ave and Berkeley | ASSUMPTION: through exits (54 x 0.44) that are not off-ramp traffic | 4 (0 to 13) | 6 | within |
| Intents listed, together | | 43 (20 to 68) | 50 | |
| Other through cars (no intent listed) | | | 4 | |

Model through cars by origin and destination group (largest 12 of 39 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 12.9 | SR-24 |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 12.5 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | College Ave from the north (Berkeley) | 4.5 | SR-24 then Claremont Avenue then College Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 4.0 | SR-24 then Claremont Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 2.3 | Claremont Avenue then Alcatraz Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Alcatraz Ave from the west (Emeryville side) | 2.2 | College Avenue then Alcatraz Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 2.2 | Telegraph Avenue |
| College Ave from the north (Berkeley) | Alcatraz Ave from the west (Emeryville side) | 1.8 | College Avenue then Alcatraz Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | San Pablo Ave (Emeryville and West Oakland) | 1.2 | SR-24 |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Ashby Ave from the west (Emeryville and I-80) | 1.0 | SR-24 then Telegraph Avenue |
| Telegraph Ave to the south (downtown Oakland) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 1.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 0.7 | College Avenue |
| other pairs | | 8.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 17 veh/h; SR-24 14 veh/h; College Avenue then Alcatraz Avenue 5 veh/h; SR-24 then Claremont Avenue then College Avenue 4 veh/h; SR-24 then Claremont Avenue 4 veh/h; Claremont Avenue then Alcatraz Avenue 3 veh/h.

### Hillegass Avenue SB

Observed (PM): 178 cars entered at the top (76 turned in from Alcatraz Ave west, 98 from the east, 4 came straight from the north), 79 drove the whole street, and 68% of the block's trips (109 veh/h) went to a freeway. ASSUMPTION: freeway-bound cars that did not join mid-street are 87 veh/h (109 x 178 / (178 + 44)), half of the 174 turn-ins; low = the whole-street share of the turn-ins (0.45), high = the freeway-bound share without the mid-street correction (0.63).

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Telegraph Ave, Alcatraz Ave west and West Berkeley traffic turning off Alcatraz Ave onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (76 turn-ins x 0.50) | 38 (34 to 48) | 25 | below |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (98 turn-ins x 0.50) | 49 (44 to 62) | 33 | below |
| Intents listed, together | | 87 (78 to 110) | 58 | |
| Other through cars (no intent listed) | | | 11 | |

Model through cars by origin and destination group (largest 12 of 24 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 24.9 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 15.9 | Claremont Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 10.1 | Claremont Avenue then SR-24 |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 6.9 | College Avenue then Claremont Avenue then SR-24 |
| Emeryville and West Oakland streets (55th to 67th Streets) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 2.5 | Claremont Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 2.0 | Telegraph Avenue |
| Emeryville and West Oakland streets (55th to 67th Streets) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 1.9 | Alcatraz Avenue then Claremont Avenue |
| Emeryville and West Oakland streets (55th to 67th Streets) | College Ave from the north (Berkeley) | 0.9 | Claremont Avenue then College Avenue |
| Shattuck Ave from the north (Berkeley) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 0.7 | College Avenue |
| West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 0.6 | Claremont Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 0.5 | Claremont Avenue |
| San Pablo Ave (Emeryville and West Oakland) | College Ave from the north (Berkeley) | 0.5 | Claremont Avenue then College Avenue |
| other pairs | | 2.1 | |

By the arterial these cars would otherwise use: Telegraph Avenue 27 veh/h; Claremont Avenue then SR-24 26 veh/h; College Avenue then Claremont Avenue then SR-24 7 veh/h; Claremont Avenue 4 veh/h; Alcatraz Avenue then Claremont Avenue 2 veh/h; Claremont Avenue then College Avenue 1 veh/h.

### Colby Street SB

Observed (PM): 139 cars entered at the top (76 from Alcatraz Ave west, 50 from the east, 13 from the north), 39 drove the whole street, 45% of the block's trips (72 veh/h) went to a freeway and 22% came by way of Telegraph Ave. ASSUMPTION: freeway-bound cars that did not join mid-street are 46 veh/h (72 x 139 / (139 + 79)), 0.365 of the 126 turn-ins; low = the whole-street share (0.31), high = the unadjusted freeway share (0.57). The Telegraph Ave cars are the 22% x 160 = 35 of the 76 west turn-ins.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Southbound Telegraph Ave traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (35 Telegraph Ave cars x 0.365) | 13 (11 to 20) | 12 | within |
| Alcatraz Ave west, Ashby Ave and West Berkeley traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (41 other west turn-ins x 0.365) | 15 (13 to 23) | 9 | below |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (50 east turn-ins x 0.365) | 18 (15 to 29) | 28 | within |
| Intents listed, together | | 46 (39 to 72) | 49 | |
| Other through cars (no intent listed) | | | 28 | |

Model through cars by origin and destination group (largest 12 of 42 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 12.8 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 10.9 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 10.6 | Claremont Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 9.6 | Telegraph Avenue |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 4.6 | College Avenue then Claremont Avenue then SR-24 |
| Shattuck Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 4.2 | none near the study area |
| Emeryville and West Oakland streets (55th to 67th Streets) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 3.0 | Claremont Avenue |
| Emeryville and West Oakland streets (55th to 67th Streets) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 2.9 | Alcatraz Avenue then Claremont Avenue |
| Ashby Ave from the west (Emeryville and I-80) | SR-13 Warren Freeway (via SR-24 east) | 1.8 | SR-24 |
| Claremont Ave and Tunnel Rd toward the hills | Telegraph Ave to the south (downtown Oakland) | 1.7 | Claremont Avenue |
| San Pablo Ave (Emeryville and West Oakland) | College Ave from the north (Berkeley) | 1.4 | Claremont Avenue then College Avenue |
| San Pablo Ave (Emeryville and West Oakland) | Claremont Ave and Tunnel Rd toward the hills | 1.3 | Alcatraz Avenue then Claremont Avenue |
| other pairs | | 12.9 | |

By the arterial these cars would otherwise use: Telegraph Avenue 34 veh/h; Claremont Avenue then SR-24 11 veh/h; Claremont Avenue 7 veh/h; none near the study area 5 veh/h; Alcatraz Avenue then Claremont Avenue 5 veh/h; SR-24 5 veh/h.

### Study area, all residential and service streets

Model: 358 through cars per hour.

Model through cars by origin and destination group (largest 12 of 82 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 49.1 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 36.4 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 29.8 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 21.7 | Claremont Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 20.8 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 17.4 | Telegraph Avenue |
| Emeryville and West Oakland streets (55th to 67th Streets) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 16.1 | Claremont Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 14.2 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 13.6 | SR-24 |
| San Pablo Ave (Emeryville and West Oakland) | Claremont Ave and Tunnel Rd toward the hills | 10.8 | Alcatraz Avenue then Claremont Avenue |
| San Pablo Ave (Emeryville and West Oakland) | College Ave from the north (Berkeley) | 9.7 | Claremont Avenue then College Avenue |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 9.6 | College Avenue then Claremont Avenue then SR-24 |
| other pairs | | 109.1 | |

By the arterial these cars would otherwise use: Telegraph Avenue 192 veh/h; Claremont Avenue 29 veh/h; Alcatraz Avenue then Claremont Avenue 27 veh/h; Claremont Avenue then SR-24 22 veh/h; SR-24 20 veh/h; none near the study area 16 veh/h.

By origin group: SR-24 eastbound off-ramps (arriving from Oakland and I-980) 87; Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 66; South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 34; Telegraph Ave from the north (Berkeley) 33; Emeryville and West Oakland streets (55th to 67th Streets) 26; Claremont Ave and Tunnel Rd toward the hills 25; San Pablo Ave (Emeryville and West Oakland) 25; Telegraph Ave to the south (downtown Oakland) 16; West Oakland to the southwest (Adeline St, Market St) 13; College Ave from the north (Berkeley) 12.

By destination group: SR-24 westbound on-ramps (toward Oakland and I-980) 105; Telegraph Ave from the north (Berkeley) 62; Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 50; South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 42; Claremont Ave and Tunnel Rd toward the hills 38; College Ave from the north (Berkeley) 22; Ashby Ave from the west (Emeryville and I-80) 9; Alcatraz Ave from the west (Emeryville side) 7; Telegraph Ave to the south (downtown Oakland) 5; Berkeley hills to the northeast (Evergreen Ln, Gravatt Dr) 5.


Per-seed detail: `rockridge-midday-s1-seed1.md` (seed 1 in full).
