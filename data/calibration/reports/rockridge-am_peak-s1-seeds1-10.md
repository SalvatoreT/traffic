# rockridge-am_peak-s1 over 10 seeds (1, 2, 3, 4, 5, 6, 7, 8, 9, 10)

Seeds are the fixed list above, none chosen; each run is 60 minutes from the same start. Interval = 95% interval of the mean (Student t, n - 1 degrees of freedom). Run-to-run noise only: demand is fixed, so day-to-day variation is not in these intervals.

## Stability rule (design decision D16)

| Check | Rule | Result | Pass |
| --- | --- | --- | --- |
| Cars cleared from gridlock near the study area (judged zone) | mean per hour below 1.00 | 0.00 (min 0.00, max 0.00) | yes |
| Entry backlog | below 2.0% in at least 90% of seeds | 10 of 10 seeds | yes |
| Runaway growth | no seed adds more than 2.0 points of backlog in the second half | none | yes |
| Arterial speed | mean above 4.0 m/s | 9.32 m/s | yes |

**Verdict: stable.** Old rule (zero removals, backlog under 2%, speed above 4 m/s, every seed): 6 of 10 seeds pass.

## Metrics over seeds

| Group | Metric | Unit | Mean | SD | Min | Max | 95% interval |
| --- | --- | --- | --- | --- | --- | --- | --- |
| health | gridlock removals | vehicles | 0.60 | 0.97 | 0.00 | 3.00 | -0.09 to 1.29 |
| health | gridlock removals per hour | veh/h | 0.60 | 0.97 | 0.00 | 3.00 | -0.09 to 1.29 |
| health | entry backlog | % of spawned | 0.03 | 0.04 | 0.00 | 0.15 | 0.00 to 0.06 |
| health | backlog growth in the second half of the run | points of spawned | -0.00 | 0.09 | -0.22 | 0.13 | -0.07 to 0.06 |
| health | completed trips | trips | 22597.00 | 140.95 | 22349.00 | 22790.00 | 22496.18 to 22697.82 |
| health | arterial mean speed | m/s | 9.32 | 0.11 | 9.15 | 9.49 | 9.24 to 9.40 |
| health | arterial mean speed, last 15 min | m/s | 9.32 | 0.14 | 9.18 | 9.54 | 9.22 to 9.42 |
| junction recovery | courtesy admissions per hour | veh/h | 133.70 | 11.10 | 113.00 | 151.00 | 125.76 to 141.64 |
| junction recovery | yield fallback admissions per hour | veh/h | 32.30 | 9.35 | 20.00 | 50.00 | 25.61 to 38.99 |
| junction recovery | conflict bypass admissions per hour | veh/h | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| junction recovery | vehicles removed while held in a node, per hour | veh/h | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| gridlock by place | cars cleared from gridlock per hour, judged (near the study area, and far ones whose chain reaches it) | veh/h | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| gridlock by place | cars cleared from gridlock per hour, near the study area | veh/h | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| gridlock by place | cars cleared from gridlock per hour, farther out | veh/h | 0.60 | 0.97 | 0.00 | 3.00 | -0.09 to 1.29 |
| gridlock by place | cars cleared from gridlock per hour, farther out with a chain into the judged zone | veh/h | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| gridlock by place | trips waiting at origins in the judged zone at the end | trips | 0.60 | 0.97 | 0.00 | 3.00 | -0.09 to 1.29 |
| cut-through | local vehicle-miles, surface gates to the freeway | veh-miles | 20.71 | 3.41 | 14.86 | 25.40 | 18.27 to 23.15 |
| cut-through | share of local vehicle-miles, surface gates to the freeway | % | 5.9 | 0.9 | 4.4 | 7.2 | 5.3 to 6.5 |
| cut-through | local vehicle-miles, freeway to the surface gates | veh-miles | 21.52 | 2.96 | 17.67 | 26.65 | 19.41 to 23.64 |
| cut-through | share of local vehicle-miles, freeway to the surface gates | % | 6.2 | 1.0 | 4.9 | 7.6 | 5.5 to 6.9 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue N | trips | 34.40 | 5.38 | 27.00 | 43.00 | 30.55 to 38.25 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue N | trips | 1011.20 | 21.52 | 966.00 | 1042.00 | 995.80 to 1026.60 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue S | trips | 27.50 | 4.97 | 18.00 | 35.00 | 23.94 to 31.06 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue S | trips | 1273.10 | 33.68 | 1223.00 | 1341.00 | 1249.01 to 1297.19 |
| headline share | Hillegass Avenue NB from freeway | % | 50.9 | 2.4 | 46.6 | 54.8 | 49.2 to 52.6 |
| share | Hillegass Avenue NB to Benvenue Avenue | % | 8.5 | 1.7 | 5.4 | 10.9 | 7.3 to 9.7 |
| share | Hillegass Avenue NB to College Avenue | % | 12.3 | 3.3 | 6.6 | 16.1 | 10.0 to 14.7 |
| share | Hillegass Avenue NB to Alcatraz Avenue WB | % | 32.7 | 4.0 | 25.3 | 38.5 | 29.9 to 35.6 |
| headline share | Colby Street NB from freeway | % | 42.7 | 1.3 | 40.5 | 44.6 | 41.8 to 43.6 |
| share | Colby Street NB to Alcatraz Avenue WB | % | 46.6 | 5.8 | 37.0 | 59.1 | 42.5 to 50.7 |
| share | Colby Street NB to Telegraph Avenue | % | 40.0 | 4.7 | 31.5 | 45.6 | 36.6 to 43.4 |
| share | Colby Street NB to College Avenue | % | 2.6 | 1.1 | 1.0 | 4.0 | 1.8 to 3.5 |
| share | Hillegass Avenue SB from Alcatraz Avenue WB | % | 16.3 | 4.4 | 6.9 | 22.1 | 13.2 to 19.5 |
| share | Hillegass Avenue SB from Benvenue Avenue | % | 1.7 | 0.9 | 0.0 | 2.8 | 1.0 to 2.4 |
| share | Hillegass Avenue SB from College Avenue | % | 11.5 | 3.7 | 5.2 | 17.8 | 8.8 to 14.1 |
| headline share | Hillegass Avenue SB to freeway | % | 60.0 | 4.4 | 51.7 | 66.9 | 56.9 to 63.2 |
| share | Colby Street SB from Alcatraz Avenue EB | % | 21.4 | 3.0 | 17.4 | 25.9 | 19.3 to 23.6 |
| share | Colby Street SB from Alcatraz Avenue WB | % | 7.0 | 2.1 | 3.5 | 9.8 | 5.5 to 8.5 |
| share | Colby Street SB from Telegraph Avenue | % | 19.1 | 4.0 | 10.2 | 24.6 | 16.3 to 21.9 |
| headline share | Colby Street SB to freeway | % | 46.8 | 4.7 | 39.8 | 54.2 | 43.4 to 50.1 |
| share | Colby Street SB to Forest Street | % | 16.7 | 4.4 | 11.2 | 26.2 | 13.5 to 19.8 |
| ramp share | onto freeway via College Avenue | % | 15.6 | 1.3 | 13.3 | 17.8 | 14.7 to 16.6 |
| ramp share | onto freeway via Hillegass Avenue | % | 13.2 | 1.8 | 10.0 | 15.9 | 11.9 to 14.4 |
| ramp share | onto freeway via Martin Street | % | 13.1 | 1.6 | 10.3 | 15.9 | 11.9 to 14.2 |
| ramp share | onto freeway via Colby Street | % | 14.3 | 1.7 | 11.5 | 17.4 | 13.2 to 15.5 |
| ramp share | onto freeway via Telegraph Avenue north of Alcatraz Avenue | % | 8.0 | 1.3 | 6.1 | 9.9 | 7.1 to 8.9 |
| ramp share | onto freeway via Benvenue Avenue | % | 3.8 | 0.9 | 2.9 | 5.6 | 3.2 to 4.5 |
| ramp share | from freeway via College Avenue | % | 9.6 | 1.2 | 7.7 | 12.1 | 8.7 to 10.5 |
| ramp share | from freeway via Martin Street | % | 11.1 | 0.9 | 9.5 | 12.2 | 10.5 to 11.7 |
| ramp share | from freeway via Colby Street | % | 10.0 | 1.3 | 8.2 | 12.2 | 9.1 to 10.9 |
| ramp share | from freeway via Hillegass Avenue | % | 8.3 | 0.7 | 7.1 | 9.1 | 7.8 to 8.8 |
| ramp share | from freeway via Benvenue Avenue | % | 2.4 | 0.4 | 1.8 | 3.1 | 2.1 to 2.7 |
| corridor flow | Telegraph N median link flow | veh/h | 850.08 | 26.94 | 816.00 | 904.80 | 830.81 to 869.35 |
| corridor flow | Telegraph S median link flow | veh/h | 898.68 | 60.45 | 780.00 | 988.80 | 855.44 to 941.92 |
| corridor flow | College N median link flow | veh/h | 278.88 | 21.11 | 255.60 | 314.40 | 263.78 to 293.98 |
| corridor flow | College S median link flow | veh/h | 429.84 | 25.20 | 379.20 | 458.40 | 411.81 to 447.87 |
| corridor flow | Claremont N median link flow | veh/h | 287.64 | 18.58 | 260.40 | 314.40 | 274.35 to 300.93 |
| corridor flow | Claremont S median link flow | veh/h | 406.20 | 28.39 | 361.20 | 451.20 | 385.89 to 426.51 |
| corridor flow | Alcatraz E median link flow | veh/h | 459.60 | 27.28 | 420.00 | 489.60 | 440.08 to 479.12 |
| corridor flow | Alcatraz W median link flow | veh/h | 382.68 | 22.18 | 346.80 | 420.00 | 366.81 to 398.55 |
| corridor flow | Hillegass N median link flow | veh/h | 94.20 | 9.35 | 80.40 | 112.80 | 87.51 to 100.89 |
| corridor flow | Hillegass S median link flow | veh/h | 78.72 | 10.88 | 63.60 | 98.40 | 70.93 to 86.51 |
| corridor flow | Colby N median link flow | veh/h | 108.72 | 6.45 | 100.80 | 123.60 | 104.10 to 113.34 |
| corridor flow | Colby S median link flow | veh/h | 125.88 | 14.75 | 102.00 | 141.60 | 115.33 to 136.43 |
| corridor flow | Martin E median link flow | veh/h | 101.16 | 11.69 | 85.20 | 128.40 | 92.80 to 109.52 |
| corridor flow | Martin W median link flow | veh/h | 98.76 | 6.45 | 91.20 | 106.80 | 94.15 to 103.37 |

## Intent map: through cars by where they come from and where they are going

Through = neither trip end is in the study area. Groups are the approach groups of the area config (data/areas); a node that is not a gate takes the group of the nearest surface gate (ASSUMPTION). The arterial is the one a trip would use on the shortest free-flow path with the study area's residential and service streets closed, where that path runs on a boundary street near the study area.

Model figures are the mean of 10 seed(s), per hour of the run. Basis: OBSERVED = read from the resident volunteer count of Feb 25, 2025 or its headline shares; ASSUMPTION = inferred from those numbers or chosen.

### Colby Street NB

Observed (PM): 182 cars entered at the south end, 102 drove the whole street, 164 left it at Alcatraz Ave (131 left, 32 right, 1 straight), and 47% of the block's trips came from a freeway (the headline share). ASSUMPTION: freeway-origin cars that do not end along the street are 65 veh/h (the 82 freeway-origin trips on the block, 47% of 174, times the 182 / (182 + 47) of its cars that entered at the south end rather than joining on the way), spread over the 164 exits in proportion (0.40); the other through cars come from the Telegraph Ave and south-side approaches that feed the street's south end. Ranges: low = 131 (32) x 0.47 x 0.62 (the whole-street share of exits), high = 131 (32) x 0.47.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | OBSERVED turn count x ASSUMPTION share (131 left turns x 0.40) | 52 (38 to 62) | 36 | below |
| Telegraph Ave and south-side traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | ASSUMPTION: the through left-turners (131 x 0.62 = 81) that are not off-ramp traffic | 29 (19 to 43) | 22 | within |
| SR-24 off-ramp traffic using Colby St to reach College Ave and Berkeley (right at Alcatraz Ave) | OBSERVED turn count x ASSUMPTION share (32 right turns x 0.40) | 13 (9 to 15) | 4 | below |
| Telegraph Ave and south-side traffic using Colby St to reach College Ave and Berkeley | ASSUMPTION: the through right-turners (32 x 0.62 = 20) that are not off-ramp traffic | 7 (5 to 11) | 28 | above |
| Intents listed, together | | 101 (71 to 131) | 89 | |
| Other through cars (no intent listed) | | | 2 | |

Model through cars by origin and destination group (largest 12 of 31 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 36.1 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 25.5 | College Avenue then Alcatraz Avenue |
| Telegraph Ave to the south (downtown Oakland) | Telegraph Ave from the north (Berkeley) | 10.9 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 3.1 | College Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Emeryville and West Oakland streets (55th to 67th Streets) | 2.7 | Claremont Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Ashby Ave from the west (Emeryville and I-80) | 1.8 | Claremont Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 1.8 | Telegraph Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Telegraph Ave from the north (Berkeley) | 1.5 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 1.3 | SR-24 |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Shattuck Ave from the north (Berkeley) | 1.1 | Claremont Avenue |
| Telegraph Ave to the south (downtown Oakland) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 0.9 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | College Ave from the north (Berkeley) | 0.6 | Telegraph Avenue |
| other pairs | | 3.6 | |

By the arterial these cars would otherwise use: Telegraph Avenue 53 veh/h; College Avenue then Alcatraz Avenue 26 veh/h; Claremont Avenue 6 veh/h; College Avenue 3 veh/h; SR-24 2 veh/h; Alcatraz Avenue then Claremont Avenue 1 veh/h.

### Hillegass Avenue NB

Observed (PM): 94 cars entered at the south end, 48 drove the whole street, 109 left it at Alcatraz Ave (43 west, 54 east, 12 straight), and 47% of the block's trips came from a freeway. ASSUMPTION: freeway-origin through cars are 40 veh/h (52 freeway-origin trips times 94 / (94 + 29)), spread over the exits in proportion (0.37); the through share of exits is 48 / 109 = 0.44.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Hillegass Ave to reach Alcatraz Ave west and Telegraph Ave north | OBSERVED turn count x ASSUMPTION share (43 left turns x 0.37) | 16 (9 to 20) | 20 | within |
| SR-24 off-ramp traffic using Hillegass Ave to reach College Ave and Berkeley | OBSERVED turn count x ASSUMPTION share (54 right turns x 0.37) | 20 (11 to 25) | 23 | within |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach Alcatraz Ave west | ASSUMPTION: through exits (43 x 0.44) that are not off-ramp traffic | 3 (0 to 10) | 4 | within |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach College Ave and Berkeley | ASSUMPTION: through exits (54 x 0.44) that are not off-ramp traffic | 4 (0 to 13) | 19 | above |
| Intents listed, together | | 43 (20 to 68) | 66 | |
| Other through cars (no intent listed) | | | 2 | |

Model through cars by origin and destination group (largest 12 of 38 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 12.9 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 12.6 | SR-24 |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 11.1 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 5.4 | SR-24 then Claremont Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | College Ave from the north (Berkeley) | 4.8 | SR-24 then Claremont Avenue then College Avenue |
| Telegraph Ave to the south (downtown Oakland) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 3.8 | Telegraph Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Ashby Ave from the west (Emeryville and I-80) | 2.1 | SR-24 then Telegraph Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | San Pablo Ave (Emeryville and West Oakland) | 1.6 | SR-24 |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Telegraph Ave from the north (Berkeley) | 1.4 | none near the study area |
| West Oakland to the southwest (Adeline St, Market St) | Telegraph Ave from the north (Berkeley) | 1.1 | Telegraph Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Shattuck Ave from the north (Berkeley) | 1.1 | SR-24 then Telegraph Avenue then Alcatraz Avenue |
| Telegraph Ave to the south (downtown Oakland) | College Ave from the north (Berkeley) | 1.0 | Telegraph Avenue |
| other pairs | | 9.3 | |

By the arterial these cars would otherwise use: Telegraph Avenue 31 veh/h; SR-24 14 veh/h; SR-24 then Claremont Avenue 5 veh/h; SR-24 then Claremont Avenue then College Avenue 5 veh/h; Claremont Avenue 4 veh/h; SR-24 then Telegraph Avenue 3 veh/h.

### Hillegass Avenue SB

Observed (PM): 178 cars entered at the top (76 turned in from Alcatraz Ave west, 98 from the east, 4 came straight from the north), 79 drove the whole street, and 68% of the block's trips (109 veh/h) went to a freeway. ASSUMPTION: freeway-bound cars that did not join mid-street are 87 veh/h (109 x 178 / (178 + 44)), half of the 174 turn-ins; low = the whole-street share of the turn-ins (0.45), high = the freeway-bound share without the mid-street correction (0.63).

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Telegraph Ave, Alcatraz Ave west and West Berkeley traffic turning off Alcatraz Ave onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (76 turn-ins x 0.50) | 38 (34 to 48) | 15 | below |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (98 turn-ins x 0.50) | 49 (44 to 62) | 20 | below |
| Intents listed, together | | 87 (78 to 110) | 34 | |
| Other through cars (no intent listed) | | | 34 | |

Model through cars by origin and destination group (largest 12 of 25 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 24.4 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 14.2 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 10.4 | Claremont Avenue then SR-24 |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 4.7 | College Avenue then Claremont Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 4.4 | Claremont Avenue then SR-24 |
| Telegraph Ave from the north (Berkeley) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 2.5 | College Avenue |
| Telegraph Ave from the north (Berkeley) | College Ave from the north (Berkeley) | 2.2 | College Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Telegraph Ave to the south (downtown Oakland) | 1.7 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | West Oakland to the southwest (Adeline St, Market St) | 1.4 | Telegraph Avenue |
| Shattuck Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 0.4 | none near the study area |
| College Ave from the north (Berkeley) | Telegraph Ave to the south (downtown Oakland) | 0.3 | Alcatraz Avenue then Telegraph Avenue |
| San Pablo Ave (Emeryville and West Oakland) | Claremont Ave and Tunnel Rd toward the hills | 0.3 | Alcatraz Avenue then Claremont Avenue |
| other pairs | | 1.7 | |

By the arterial these cars would otherwise use: Telegraph Avenue 42 veh/h; Claremont Avenue then SR-24 15 veh/h; College Avenue 5 veh/h; College Avenue then Claremont Avenue then SR-24 5 veh/h; none near the study area 1 veh/h; Alcatraz Avenue then Claremont Avenue 0 veh/h.

### Colby Street SB

Observed (PM): 139 cars entered at the top (76 from Alcatraz Ave west, 50 from the east, 13 from the north), 39 drove the whole street, 45% of the block's trips (72 veh/h) went to a freeway and 22% came by way of Telegraph Ave. ASSUMPTION: freeway-bound cars that did not join mid-street are 46 veh/h (72 x 139 / (139 + 79)), 0.365 of the 126 turn-ins; low = the whole-street share (0.31), high = the unadjusted freeway share (0.57). The Telegraph Ave cars are the 22% x 160 = 35 of the 76 west turn-ins.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Southbound Telegraph Ave traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (35 Telegraph Ave cars x 0.365) | 13 (11 to 20) | 16 | within |
| Alcatraz Ave west, Ashby Ave and West Berkeley traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (41 other west turn-ins x 0.365) | 15 (13 to 23) | 18 | within |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (50 east turn-ins x 0.365) | 18 (15 to 29) | 9 | below |
| Intents listed, together | | 46 (39 to 72) | 43 | |
| Other through cars (no intent listed) | | | 47 | |

Model through cars by origin and destination group (largest 12 of 43 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 30.3 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 13.9 | Telegraph Avenue |
| Shattuck Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 7.3 | none near the study area |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 6.6 | Telegraph Avenue |
| Ashby Ave from the west (Emeryville and I-80) | SR-13 Warren Freeway (via SR-24 east) | 3.7 | SR-24 |
| Telegraph Ave from the north (Berkeley) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 3.2 | Telegraph Avenue |
| Ashby Ave from the west (Emeryville and I-80) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 2.9 | SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Telegraph Ave to the south (downtown Oakland) | 2.7 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 2.6 | none near the study area |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | West Oakland to the southwest (Adeline St, Market St) | 2.2 | Telegraph Avenue |
| Alcatraz Ave from the west (Emeryville side) | SR-13 Warren Freeway (via SR-24 east) | 2.1 | SR-24 |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 1.7 | College Avenue then Claremont Avenue then SR-24 |
| other pairs | | 11.1 | |

By the arterial these cars would otherwise use: Telegraph Avenue 61 veh/h; none near the study area 12 veh/h; SR-24 10 veh/h; College Avenue then Claremont Avenue then SR-24 2 veh/h; Alcatraz Avenue then Telegraph Avenue 1 veh/h; Claremont Avenue then SR-24 1 veh/h.

### Study area, all residential and service streets

Model: 462 through cars per hour.

Model through cars by origin and destination group (largest 12 of 90 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 73.3 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 59.9 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 45.7 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 33.4 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 27.4 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 16.1 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 13.3 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 12.7 | SR-24 |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Emeryville and West Oakland streets (55th to 67th Streets) | 11.4 | Claremont Avenue |
| Telegraph Ave to the south (downtown Oakland) | Telegraph Ave from the north (Berkeley) | 11.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Ashby Ave from the west (Emeryville and I-80) | 10.8 | Claremont Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 10.5 | Claremont Avenue then SR-24 |
| other pairs | | 136.8 | |

By the arterial these cars would otherwise use: Telegraph Avenue 319 veh/h; Claremont Avenue 40 veh/h; SR-24 24 veh/h; none near the study area 22 veh/h; Claremont Avenue then SR-24 11 veh/h; Alcatraz Avenue then College Avenue 6 veh/h.

By origin group: Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 122; South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 101; SR-24 eastbound off-ramps (arriving from Oakland and I-980) 77; Telegraph Ave from the north (Berkeley) 49; Telegraph Ave to the south (downtown Oakland) 33; Claremont Ave and Tunnel Rd toward the hills 12; West Oakland to the southwest (Adeline St, Market St) 12; Shattuck Ave from the north (Berkeley) 10; Ashby Ave from the west (Emeryville and I-80) 9; College Ave from the north (Berkeley) 7.

By destination group: South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 112; SR-24 westbound on-ramps (toward Oakland and I-980) 93; Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 87; Telegraph Ave from the north (Berkeley) 68; Claremont Ave and Tunnel Rd toward the hills 19; College Ave from the north (Berkeley) 16; Ashby Ave from the west (Emeryville and I-80) 13; Emeryville and West Oakland streets (55th to 67th Streets) 13; Telegraph Ave to the south (downtown Oakland) 9; Shattuck Ave from the north (Berkeley) 8.


Per-seed detail: `rockridge-am_peak-s1-seed1.md` (seed 1 in full).
