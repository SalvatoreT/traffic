# rockridge-am_peak-s1 over 10 seeds (1, 2, 3, 4, 5, 6, 7, 8, 9, 10)

Seeds are the fixed list above, none chosen; each run is 60 minutes from the same start. Interval = 95% interval of the mean (Student t, n - 1 degrees of freedom). Run-to-run noise only: demand is fixed, so day-to-day variation is not in these intervals.

## Stability rule (design decision D16)

| Check | Rule | Result | Pass |
| --- | --- | --- | --- |
| Removals | mean per hour below 1.00 | 0.00 (min 0.00, max 0.00) | yes |
| Entry backlog | below 2.0% in at least 90% of seeds | 10 of 10 seeds | yes |
| Runaway growth | no seed adds more than 2.0 points of backlog in the second half | none | yes |
| Arterial speed | mean above 4.0 m/s | 9.71 m/s | yes |

**Verdict: stable.** Old rule (zero removals, backlog under 2%, speed above 4 m/s, every seed): 10 of 10 seeds pass.

## Metrics over seeds

| Group | Metric | Unit | Mean | SD | Min | Max | 95% interval |
| --- | --- | --- | --- | --- | --- | --- | --- |
| health | gridlock removals | vehicles | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| health | gridlock removals per hour | veh/h | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| health | entry backlog | % of spawned | 0.01 | 0.00 | 0.00 | 0.01 | 0.00 to 0.01 |
| health | backlog growth in the second half of the run | points of spawned | -0.00 | 0.01 | -0.01 | 0.01 | -0.01 to 0.01 |
| health | completed trips | trips | 21542.60 | 137.73 | 21293.00 | 21744.00 | 21444.08 to 21641.12 |
| health | arterial mean speed | m/s | 9.71 | 0.06 | 9.62 | 9.79 | 9.67 to 9.76 |
| health | arterial mean speed, last 15 min | m/s | 9.68 | 0.15 | 9.46 | 9.85 | 9.57 to 9.78 |
| cut-through | local vehicle-miles, surface gates to the freeway | veh-miles | 23.27 | 2.04 | 20.55 | 26.87 | 21.81 to 24.73 |
| cut-through | share of local vehicle-miles, surface gates to the freeway | % | 7.2 | 0.6 | 6.1 | 8.0 | 6.7 to 7.6 |
| cut-through | local vehicle-miles, freeway to the surface gates | veh-miles | 20.39 | 2.77 | 16.46 | 25.40 | 18.41 to 22.37 |
| cut-through | share of local vehicle-miles, freeway to the surface gates | % | 6.3 | 0.8 | 5.3 | 7.7 | 5.7 to 6.9 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue N | trips | 35.70 | 4.50 | 28.00 | 45.00 | 32.48 to 38.92 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue N | trips | 909.80 | 23.27 | 871.00 | 942.00 | 893.15 to 926.45 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue S | trips | 32.30 | 4.57 | 26.00 | 38.00 | 29.03 to 35.57 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue S | trips | 1111.40 | 44.39 | 1034.00 | 1174.00 | 1079.65 to 1143.15 |
| headline share | Hillegass Avenue NB from freeway | % | 50.5 | 3.5 | 46.5 | 55.8 | 48.1 to 53.0 |
| share | Hillegass Avenue NB to Benvenue Avenue | % | 8.0 | 1.1 | 5.9 | 9.4 | 7.1 to 8.8 |
| share | Hillegass Avenue NB to College Avenue | % | 15.0 | 2.3 | 12.1 | 19.2 | 13.4 to 16.6 |
| share | Hillegass Avenue NB to Alcatraz Avenue WB | % | 35.8 | 4.5 | 26.5 | 40.7 | 32.6 to 39.0 |
| headline share | Colby Street NB from freeway | % | 44.3 | 3.8 | 37.2 | 49.8 | 41.6 to 47.0 |
| share | Colby Street NB to Alcatraz Avenue WB | % | 53.9 | 3.2 | 48.6 | 59.6 | 51.6 to 56.1 |
| share | Colby Street NB to Telegraph Avenue | % | 37.0 | 3.9 | 30.3 | 42.2 | 34.2 to 39.8 |
| share | Colby Street NB to College Avenue | % | 3.8 | 1.2 | 1.3 | 5.3 | 2.9 to 4.6 |
| share | Hillegass Avenue SB from Alcatraz Avenue WB | % | 26.9 | 3.9 | 21.3 | 33.7 | 24.1 to 29.7 |
| share | Hillegass Avenue SB from Benvenue Avenue | % | 2.6 | 1.0 | 1.7 | 4.5 | 1.9 to 3.4 |
| share | Hillegass Avenue SB from College Avenue | % | 13.3 | 3.8 | 8.6 | 20.5 | 10.6 to 16.0 |
| headline share | Hillegass Avenue SB to freeway | % | 67.6 | 5.1 | 61.1 | 75.5 | 63.9 to 71.3 |
| share | Colby Street SB from Alcatraz Avenue EB | % | 23.7 | 2.5 | 18.5 | 26.9 | 21.9 to 25.5 |
| share | Colby Street SB from Alcatraz Avenue WB | % | 8.5 | 2.0 | 4.9 | 10.5 | 7.1 to 9.9 |
| share | Colby Street SB from Telegraph Avenue | % | 17.1 | 1.6 | 14.3 | 20.2 | 15.9 to 18.2 |
| headline share | Colby Street SB to freeway | % | 51.5 | 3.1 | 45.9 | 56.3 | 49.3 to 53.7 |
| share | Colby Street SB to Forest Street | % | 10.9 | 2.5 | 7.7 | 15.5 | 9.1 to 12.7 |
| ramp share | onto freeway via College Avenue | % | 14.4 | 1.5 | 11.7 | 16.0 | 13.4 to 15.5 |
| ramp share | onto freeway via Hillegass Avenue | % | 12.7 | 1.3 | 11.3 | 14.8 | 11.8 to 13.6 |
| ramp share | onto freeway via Martin Street | % | 13.9 | 1.3 | 11.5 | 15.9 | 13.0 to 14.9 |
| ramp share | onto freeway via Colby Street | % | 14.6 | 1.2 | 12.1 | 16.4 | 13.8 to 15.5 |
| ramp share | onto freeway via Telegraph Avenue north of Alcatraz Avenue | % | 8.9 | 1.1 | 6.8 | 10.9 | 8.1 to 9.7 |
| ramp share | onto freeway via Benvenue Avenue | % | 4.3 | 0.9 | 2.8 | 5.6 | 3.7 to 4.9 |
| ramp share | from freeway via College Avenue | % | 10.9 | 1.0 | 9.2 | 12.9 | 10.2 to 11.6 |
| ramp share | from freeway via Martin Street | % | 9.9 | 1.0 | 8.6 | 11.7 | 9.2 to 10.6 |
| ramp share | from freeway via Colby Street | % | 12.2 | 1.8 | 10.3 | 15.2 | 10.9 to 13.4 |
| ramp share | from freeway via Hillegass Avenue | % | 6.7 | 0.7 | 6.0 | 8.4 | 6.2 to 7.3 |
| ramp share | from freeway via Benvenue Avenue | % | 2.9 | 0.7 | 1.4 | 3.7 | 2.5 to 3.4 |
| corridor flow | Telegraph N median link flow | veh/h | 671.28 | 34.22 | 634.80 | 734.40 | 646.80 to 695.76 |
| corridor flow | Telegraph S median link flow | veh/h | 683.16 | 30.39 | 622.80 | 724.80 | 661.42 to 704.90 |
| corridor flow | College N median link flow | veh/h | 187.08 | 17.43 | 162.00 | 220.80 | 174.61 to 199.55 |
| corridor flow | College S median link flow | veh/h | 338.16 | 23.12 | 294.00 | 368.40 | 321.63 to 354.69 |
| corridor flow | Claremont N median link flow | veh/h | 390.12 | 15.52 | 362.40 | 411.60 | 379.02 to 401.22 |
| corridor flow | Claremont S median link flow | veh/h | 400.92 | 27.88 | 362.40 | 438.00 | 380.98 to 420.86 |
| corridor flow | Alcatraz E median link flow | veh/h | 344.16 | 38.39 | 262.80 | 404.40 | 316.70 to 371.62 |
| corridor flow | Alcatraz W median link flow | veh/h | 417.36 | 29.82 | 370.80 | 465.60 | 396.03 to 438.69 |
| corridor flow | Hillegass N median link flow | veh/h | 93.72 | 8.25 | 85.20 | 109.20 | 87.82 to 99.62 |
| corridor flow | Hillegass S median link flow | veh/h | 69.00 | 7.29 | 54.00 | 78.00 | 63.78 to 74.22 |
| corridor flow | Colby N median link flow | veh/h | 103.80 | 5.83 | 96.00 | 111.60 | 99.63 to 107.97 |
| corridor flow | Colby S median link flow | veh/h | 117.96 | 10.04 | 99.60 | 133.20 | 110.78 to 125.14 |
| corridor flow | Martin E median link flow | veh/h | 94.68 | 7.79 | 80.40 | 108.00 | 89.11 to 100.25 |
| corridor flow | Martin W median link flow | veh/h | 99.36 | 8.52 | 91.20 | 117.60 | 93.27 to 105.45 |

## Intent map: through cars by where they come from and where they are going

Through = neither trip end is in the study area. Groups are the approach groups of the area config (data/areas); a node that is not a gate takes the group of the nearest surface gate (ASSUMPTION). The arterial is the one a trip would use on the shortest free-flow path with the study area's residential and service streets closed, where that path runs on a boundary street near the study area.

Model figures are the mean of 10 seed(s), per hour of the run. Basis: OBSERVED = read from the resident volunteer count of Feb 25, 2025 or its headline shares; ASSUMPTION = inferred from those numbers or chosen.

### Colby Street NB

Observed (PM): 182 cars entered at the south end, 102 drove the whole street, 164 left it at Alcatraz Ave (131 left, 32 right, 1 straight), and 47% of the block's trips came from a freeway (the headline share). ASSUMPTION: freeway-origin cars that do not end along the street are 65 veh/h (the 82 freeway-origin trips on the block, 47% of 174, times the 182 / (182 + 47) of its cars that entered at the south end rather than joining on the way), spread over the 164 exits in proportion (0.40); the other through cars come from the Telegraph Ave and south-side approaches that feed the street's south end. Ranges: low = 131 (32) x 0.47 x 0.62 (the whole-street share of exits), high = 131 (32) x 0.47.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | OBSERVED turn count x ASSUMPTION share (131 left turns x 0.40) | 52 (38 to 62) | 33 | below |
| Telegraph Ave and south-side traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | ASSUMPTION: the through left-turners (131 x 0.62 = 81) that are not off-ramp traffic | 29 (19 to 43) | 40 | within |
| SR-24 off-ramp traffic using Colby St to reach College Ave and Berkeley (right at Alcatraz Ave) | OBSERVED turn count x ASSUMPTION share (32 right turns x 0.40) | 13 (9 to 15) | 2 | below |
| Telegraph Ave and south-side traffic using Colby St to reach College Ave and Berkeley | ASSUMPTION: the through right-turners (32 x 0.62 = 20) that are not off-ramp traffic | 7 (5 to 11) | 2 | below |
| Intents listed, together | | 101 (71 to 131) | 77 | |
| Other through cars (no intent listed) | | | 2 | |

Model through cars by origin and destination group (largest 12 of 29 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 33.1 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Emeryville and West Oakland streets (55th to 67th Streets) | 10.1 | Claremont Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) | 8.6 | Claremont Avenue |
| Telegraph Ave to the south (downtown Oakland) | Telegraph Ave from the north (Berkeley) | 7.7 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Ashby Ave from the west (Emeryville and I-80) | 4.4 | Claremont Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 3.8 | College Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | San Pablo Ave (Emeryville and West Oakland) | 3.3 | Claremont Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Telegraph Ave from the north (Berkeley) | 1.5 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 1.3 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 1.1 | College Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Alcatraz Ave from the west (Emeryville side) | 0.8 | Claremont Avenue |
| San Pablo Ave (Emeryville and West Oakland) | Claremont Ave and Tunnel Rd toward the hills | 0.5 | Alcatraz Avenue then Claremont Avenue |
| other pairs | | 2.5 | |

By the arterial these cars would otherwise use: Telegraph Avenue 44 veh/h; Claremont Avenue 28 veh/h; College Avenue 5 veh/h; Telegraph Avenue then Alcatraz Avenue then Claremont Avenue 1 veh/h; Alcatraz Avenue then Claremont Avenue 1 veh/h; SR-24 0 veh/h.

### Hillegass Avenue NB

Observed (PM): 94 cars entered at the south end, 48 drove the whole street, 109 left it at Alcatraz Ave (43 west, 54 east, 12 straight), and 47% of the block's trips came from a freeway. ASSUMPTION: freeway-origin through cars are 40 veh/h (52 freeway-origin trips times 94 / (94 + 29)), spread over the exits in proportion (0.37); the through share of exits is 48 / 109 = 0.44.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Hillegass Ave to reach Alcatraz Ave west and Telegraph Ave north | OBSERVED turn count x ASSUMPTION share (43 left turns x 0.37) | 16 (9 to 20) | 16 | within |
| SR-24 off-ramp traffic using Hillegass Ave to reach College Ave and Berkeley | OBSERVED turn count x ASSUMPTION share (54 right turns x 0.37) | 20 (11 to 25) | 24 | within |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach Alcatraz Ave west | ASSUMPTION: through exits (43 x 0.44) that are not off-ramp traffic | 3 (0 to 10) | 8 | within |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach College Ave and Berkeley | ASSUMPTION: through exits (54 x 0.44) that are not off-ramp traffic | 4 (0 to 13) | 6 | within |
| Intents listed, together | | 43 (20 to 68) | 54 | |
| Other through cars (no intent listed) | | | 2 | |

Model through cars by origin and destination group (largest 12 of 42 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 12.7 | SR-24 |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 9.2 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 5.7 | SR-24 then Claremont Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | College Ave from the north (Berkeley) | 5.3 | SR-24 then Claremont Avenue then College Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Emeryville and West Oakland streets (55th to 67th Streets) | 2.6 | College Avenue then Alcatraz Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Telegraph Ave from the north (Berkeley) | 2.0 | none near the study area |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) | 1.9 | Claremont Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 1.7 | Telegraph Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Ashby Ave from the west (Emeryville and I-80) | 1.5 | SR-24 then Telegraph Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Alcatraz Ave from the west (Emeryville side) | 1.2 | SR-24 then Telegraph Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | San Pablo Ave (Emeryville and West Oakland) | 1.2 | SR-24 |
| West Oakland to the southwest (Adeline St, Market St) | Claremont Ave and Tunnel Rd toward the hills | 1.1 | Claremont Avenue |
| other pairs | | 10.4 | |

By the arterial these cars would otherwise use: SR-24 14 veh/h; Telegraph Avenue 12 veh/h; Claremont Avenue 6 veh/h; SR-24 then Claremont Avenue 6 veh/h; SR-24 then Claremont Avenue then College Avenue 5 veh/h; College Avenue then Alcatraz Avenue 3 veh/h.

### Hillegass Avenue SB

Observed (PM): 178 cars entered at the top (76 turned in from Alcatraz Ave west, 98 from the east, 4 came straight from the north), 79 drove the whole street, and 68% of the block's trips (109 veh/h) went to a freeway. ASSUMPTION: freeway-bound cars that did not join mid-street are 87 veh/h (109 x 178 / (178 + 44)), half of the 174 turn-ins; low = the whole-street share of the turn-ins (0.45), high = the freeway-bound share without the mid-street correction (0.63).

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Telegraph Ave, Alcatraz Ave west and West Berkeley traffic turning off Alcatraz Ave onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (76 turn-ins x 0.50) | 38 (34 to 48) | 15 | below |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (98 turn-ins x 0.50) | 49 (44 to 62) | 22 | below |
| Intents listed, together | | 87 (78 to 110) | 36 | |
| Other through cars (no intent listed) | | | 16 | |

Model through cars by origin and destination group (largest 12 of 28 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 14.5 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 11.5 | Claremont Avenue then SR-24 |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 6.7 | College Avenue then Claremont Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 6.4 | Alcatraz Avenue then College Avenue then Claremont Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 3.3 | Claremont Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Telegraph Ave to the south (downtown Oakland) | 2.9 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | West Oakland to the southwest (Adeline St, Market St) | 2.4 | Alcatraz Avenue then Telegraph Avenue |
| College Ave from the north (Berkeley) | Telegraph Ave to the south (downtown Oakland) | 1.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Berkeley hills to the northeast (Evergreen Ln, Gravatt Dr) | 0.4 | Alcatraz Avenue then Claremont Avenue |
| Telegraph Ave from the north (Berkeley) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 0.4 | Telegraph Avenue |
| Alcatraz Ave from the west (Emeryville side) | Berkeley hills to the northeast (Evergreen Ln, Gravatt Dr) | 0.3 | Alcatraz Avenue then Claremont Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 0.3 | Telegraph Avenue then Alcatraz Avenue then Claremont Avenue |
| other pairs | | 2.1 | |

By the arterial these cars would otherwise use: Telegraph Avenue 19 veh/h; Claremont Avenue then SR-24 15 veh/h; College Avenue then Claremont Avenue then SR-24 7 veh/h; Alcatraz Avenue then College Avenue then Claremont Avenue 6 veh/h; Alcatraz Avenue then Telegraph Avenue 2 veh/h; Alcatraz Avenue then Claremont Avenue 1 veh/h.

### Colby Street SB

Observed (PM): 139 cars entered at the top (76 from Alcatraz Ave west, 50 from the east, 13 from the north), 39 drove the whole street, 45% of the block's trips (72 veh/h) went to a freeway and 22% came by way of Telegraph Ave. ASSUMPTION: freeway-bound cars that did not join mid-street are 46 veh/h (72 x 139 / (139 + 79)), 0.365 of the 126 turn-ins; low = the whole-street share (0.31), high = the unadjusted freeway share (0.57). The Telegraph Ave cars are the 22% x 160 = 35 of the 76 west turn-ins.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Southbound Telegraph Ave traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (35 Telegraph Ave cars x 0.365) | 13 (11 to 20) | 20 | within |
| Alcatraz Ave west, Ashby Ave and West Berkeley traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (41 other west turn-ins x 0.365) | 15 (13 to 23) | 13 | within |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (50 east turn-ins x 0.365) | 18 (15 to 29) | 14 | below |
| Intents listed, together | | 46 (39 to 72) | 47 | |
| Other through cars (no intent listed) | | | 32 | |

Model through cars by origin and destination group (largest 12 of 43 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 18.2 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 12.6 | Alcatraz Avenue then College Avenue then Claremont Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 11.5 | Telegraph Avenue |
| Shattuck Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 6.0 | none near the study area |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Telegraph Ave to the south (downtown Oakland) | 5.6 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | West Oakland to the southwest (Adeline St, Market St) | 3.7 | Alcatraz Avenue then Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 2.6 | Telegraph Avenue then Alcatraz Avenue then Claremont Avenue |
| Ashby Ave from the west (Emeryville and I-80) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 2.4 | SR-24 |
| Telegraph Ave from the north (Berkeley) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 2.1 | none near the study area |
| Ashby Ave from the west (Emeryville and I-80) | SR-13 Warren Freeway (via SR-24 east) | 1.9 | SR-24 |
| Alcatraz Ave from the west (Emeryville side) | SR-13 Warren Freeway (via SR-24 east) | 1.3 | SR-24 |
| College Ave from the north (Berkeley) | Telegraph Ave to the south (downtown Oakland) | 1.2 | Telegraph Avenue |
| other pairs | | 10.2 | |

By the arterial these cars would otherwise use: Telegraph Avenue 37 veh/h; Alcatraz Avenue then College Avenue then Claremont Avenue 13 veh/h; none near the study area 9 veh/h; SR-24 7 veh/h; Alcatraz Avenue then Telegraph Avenue 4 veh/h; Telegraph Avenue then Alcatraz Avenue then Claremont Avenue 3 veh/h.

### Study area, all residential and service streets

Model: 425 through cars per hour.

Model through cars by origin and destination group (largest 12 of 99 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 44.2 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 38.1 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 27.9 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) | 27.6 | Claremont Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Emeryville and West Oakland streets (55th to 67th Streets) | 23.8 | Claremont Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 22.4 | Telegraph Avenue |
| Telegraph Ave to the south (downtown Oakland) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 19.8 | Telegraph Avenue then Claremont Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave to the south (downtown Oakland) | 17.6 | Claremont Avenue then Telegraph Avenue |
| Telegraph Ave to the south (downtown Oakland) | SR-24 westbound on-ramps (toward Oakland and I-980) | 14.3 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | San Pablo Ave (Emeryville and West Oakland) | 13.3 | Claremont Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 12.9 | SR-24 |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 11.5 | Claremont Avenue then SR-24 |
| other pairs | | 151.2 | |

By the arterial these cars would otherwise use: Telegraph Avenue 190 veh/h; Claremont Avenue 82 veh/h; SR-24 25 veh/h; Telegraph Avenue then Claremont Avenue 20 veh/h; Claremont Avenue then Telegraph Avenue 18 veh/h; none near the study area 13 veh/h.

By origin group: South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 111; Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 78; SR-24 eastbound off-ramps (arriving from Oakland and I-980) 74; Telegraph Ave to the south (downtown Oakland) 44; Telegraph Ave from the north (Berkeley) 43; Claremont Ave and Tunnel Rd toward the hills 16; College Ave from the north (Berkeley) 10; Emeryville and West Oakland streets (55th to 67th Streets) 10; SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) 8; West Oakland to the southwest (Adeline St, Market St) 6.

By destination group: SR-24 westbound on-ramps (toward Oakland and I-980) 105; Telegraph Ave from the north (Berkeley) 64; South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 52; Telegraph Ave to the south (downtown Oakland) 29; West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) 29; Emeryville and West Oakland streets (55th to 67th Streets) 27; Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 26; Claremont Ave and Tunnel Rd toward the hills 24; San Pablo Ave (Emeryville and West Oakland) 17; Ashby Ave from the west (Emeryville and I-80) 13.


Per-seed detail: `rockridge-am_peak-s1-seed1.md` (seed 1 in full).
