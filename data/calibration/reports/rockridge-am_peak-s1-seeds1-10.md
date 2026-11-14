# rockridge-am_peak-s1 over 10 seeds (1, 2, 3, 4, 5, 6, 7, 8, 9, 10)

Seeds are the fixed list above, none chosen; each run is 60 minutes from the same start. Interval = 95% interval of the mean (Student t, n - 1 degrees of freedom). Run-to-run noise only: demand is fixed, so day-to-day variation is not in these intervals.

## Stability rule (design decision D16)

| Check | Rule | Result | Pass |
| --- | --- | --- | --- |
| Removals | mean per hour below 1.00 | 0.00 (min 0.00, max 0.00) | yes |
| Entry backlog | below 2.0% in at least 90% of seeds | 10 of 10 seeds | yes |
| Runaway growth | no seed adds more than 2.0 points of backlog in the second half | none | yes |
| Arterial speed | mean above 4.0 m/s | 9.68 m/s | yes |

**Verdict: stable.** Old rule (zero removals, backlog under 2%, speed above 4 m/s, every seed): 10 of 10 seeds pass.

## Metrics over seeds

| Group | Metric | Unit | Mean | SD | Min | Max | 95% interval |
| --- | --- | --- | --- | --- | --- | --- | --- |
| health | gridlock removals | vehicles | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| health | gridlock removals per hour | veh/h | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| health | entry backlog | % of spawned | 0.01 | 0.01 | 0.00 | 0.03 | 0.00 to 0.02 |
| health | backlog growth in the second half of the run | points of spawned | -0.00 | 0.01 | -0.02 | 0.02 | -0.01 to 0.01 |
| health | completed trips | trips | 21542.00 | 138.24 | 21270.00 | 21717.00 | 21443.12 to 21640.88 |
| health | arterial mean speed | m/s | 9.68 | 0.07 | 9.58 | 9.78 | 9.63 to 9.73 |
| health | arterial mean speed, last 15 min | m/s | 9.70 | 0.11 | 9.54 | 9.87 | 9.62 to 9.78 |
| cut-through | local vehicle-miles, surface gates to the freeway | veh-miles | 24.30 | 3.30 | 19.12 | 30.07 | 21.94 to 26.66 |
| cut-through | share of local vehicle-miles, surface gates to the freeway | % | 7.2 | 1.0 | 5.4 | 8.7 | 6.5 to 7.9 |
| cut-through | local vehicle-miles, freeway to the surface gates | veh-miles | 18.58 | 3.30 | 13.93 | 24.81 | 16.22 to 20.94 |
| cut-through | share of local vehicle-miles, freeway to the surface gates | % | 5.5 | 1.0 | 4.4 | 7.2 | 4.8 to 6.2 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue N | trips | 35.40 | 7.57 | 22.00 | 45.00 | 29.98 to 40.82 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue N | trips | 865.90 | 25.19 | 827.00 | 920.00 | 847.88 to 883.92 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue S | trips | 33.60 | 6.60 | 19.00 | 42.00 | 28.88 to 38.32 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue S | trips | 1067.00 | 38.57 | 1020.00 | 1116.00 | 1039.41 to 1094.59 |
| headline share | Hillegass Avenue NB from freeway | % | 48.5 | 4.5 | 42.6 | 56.4 | 45.3 to 51.7 |
| share | Hillegass Avenue NB to Benvenue Avenue | % | 7.9 | 2.1 | 5.0 | 11.0 | 6.4 to 9.5 |
| share | Hillegass Avenue NB to College Avenue | % | 14.7 | 2.8 | 11.5 | 20.0 | 12.7 to 16.7 |
| share | Hillegass Avenue NB to Alcatraz Avenue WB | % | 36.2 | 2.7 | 32.2 | 39.7 | 34.3 to 38.1 |
| headline share | Colby Street NB from freeway | % | 44.0 | 2.1 | 39.5 | 47.0 | 42.5 to 45.5 |
| share | Colby Street NB to Alcatraz Avenue WB | % | 54.0 | 2.5 | 51.2 | 57.6 | 52.2 to 55.8 |
| share | Colby Street NB to Telegraph Avenue | % | 35.6 | 3.5 | 30.4 | 41.5 | 33.1 to 38.1 |
| share | Colby Street NB to College Avenue | % | 3.7 | 1.3 | 2.4 | 6.6 | 2.8 to 4.6 |
| share | Hillegass Avenue SB from Alcatraz Avenue WB | % | 22.4 | 4.7 | 14.2 | 27.7 | 19.1 to 25.8 |
| share | Hillegass Avenue SB from Benvenue Avenue | % | 1.1 | 0.6 | 0.8 | 2.8 | 0.7 to 1.5 |
| share | Hillegass Avenue SB from College Avenue | % | 11.0 | 3.8 | 5.3 | 17.2 | 8.3 to 13.8 |
| headline share | Hillegass Avenue SB to freeway | % | 66.8 | 4.5 | 57.9 | 75.2 | 63.6 to 70.0 |
| share | Colby Street SB from Alcatraz Avenue EB | % | 25.5 | 3.7 | 17.9 | 30.3 | 22.8 to 28.2 |
| share | Colby Street SB from Alcatraz Avenue WB | % | 8.2 | 2.1 | 5.5 | 12.4 | 6.7 to 9.7 |
| share | Colby Street SB from Telegraph Avenue | % | 19.8 | 2.2 | 14.9 | 22.0 | 18.2 to 21.4 |
| headline share | Colby Street SB to freeway | % | 50.9 | 2.4 | 46.3 | 53.8 | 49.2 to 52.7 |
| share | Colby Street SB to Forest Street | % | 9.8 | 2.3 | 7.4 | 14.9 | 8.1 to 11.4 |
| ramp share | onto freeway via College Avenue | % | 13.5 | 1.3 | 10.7 | 14.9 | 12.6 to 14.4 |
| ramp share | onto freeway via Hillegass Avenue | % | 13.4 | 1.7 | 10.3 | 16.0 | 12.2 to 14.5 |
| ramp share | onto freeway via Martin Street | % | 14.7 | 2.2 | 10.4 | 18.0 | 13.1 to 16.2 |
| ramp share | onto freeway via Colby Street | % | 14.8 | 2.2 | 11.9 | 18.4 | 13.3 to 16.4 |
| ramp share | onto freeway via Telegraph Avenue north of Alcatraz Avenue | % | 9.2 | 1.0 | 7.7 | 10.7 | 8.5 to 9.9 |
| ramp share | onto freeway via Benvenue Avenue | % | 4.5 | 0.8 | 3.1 | 5.5 | 3.9 to 5.0 |
| ramp share | from freeway via College Avenue | % | 9.9 | 1.1 | 8.4 | 11.6 | 9.1 to 10.7 |
| ramp share | from freeway via Martin Street | % | 11.2 | 1.1 | 9.2 | 12.7 | 10.5 to 12.0 |
| ramp share | from freeway via Colby Street | % | 12.3 | 1.1 | 10.8 | 14.1 | 11.5 to 13.1 |
| ramp share | from freeway via Hillegass Avenue | % | 6.4 | 1.2 | 3.9 | 7.8 | 5.5 to 7.2 |
| ramp share | from freeway via Benvenue Avenue | % | 2.3 | 0.6 | 1.6 | 3.3 | 1.9 to 2.7 |
| corridor flow | Telegraph N median link flow | veh/h | 716.40 | 35.97 | 634.80 | 753.60 | 690.67 to 742.13 |
| corridor flow | Telegraph S median link flow | veh/h | 627.96 | 51.39 | 558.00 | 722.40 | 591.20 to 664.72 |
| corridor flow | College N median link flow | veh/h | 167.28 | 23.90 | 135.60 | 207.60 | 150.18 to 184.38 |
| corridor flow | College S median link flow | veh/h | 324.36 | 24.28 | 278.40 | 351.60 | 306.99 to 341.73 |
| corridor flow | Claremont N median link flow | veh/h | 348.72 | 24.98 | 312.00 | 397.20 | 330.85 to 366.59 |
| corridor flow | Claremont S median link flow | veh/h | 376.08 | 22.32 | 321.60 | 400.80 | 360.12 to 392.04 |
| corridor flow | Alcatraz E median link flow | veh/h | 366.96 | 43.20 | 298.80 | 434.40 | 336.06 to 397.86 |
| corridor flow | Alcatraz W median link flow | veh/h | 381.48 | 40.47 | 334.80 | 452.40 | 352.53 to 410.43 |
| corridor flow | Hillegass N median link flow | veh/h | 83.64 | 13.11 | 57.60 | 102.00 | 74.26 to 93.02 |
| corridor flow | Hillegass S median link flow | veh/h | 68.64 | 7.73 | 57.60 | 79.20 | 63.11 to 74.17 |
| corridor flow | Colby N median link flow | veh/h | 109.92 | 10.56 | 97.20 | 127.20 | 102.37 to 117.47 |
| corridor flow | Colby S median link flow | veh/h | 120.00 | 12.12 | 102.00 | 142.80 | 111.33 to 128.67 |
| corridor flow | Martin E median link flow | veh/h | 102.84 | 14.24 | 74.40 | 121.20 | 92.65 to 113.03 |
| corridor flow | Martin W median link flow | veh/h | 112.56 | 10.34 | 97.20 | 127.20 | 105.17 to 119.95 |

## Intent map: through cars by where they come from and where they are going

Through = neither trip end is in the study area. Groups are the approach groups of the area config (data/areas); a node that is not a gate takes the group of the nearest surface gate (ASSUMPTION). The arterial is the one a trip would use on the shortest free-flow path with the study area's residential and service streets closed, where that path runs on a boundary street near the study area.

Model figures are the mean of 10 seed(s), per hour of the run. Basis: OBSERVED = read from the resident volunteer count of Feb 25, 2025 or its headline shares; ASSUMPTION = inferred from those numbers or chosen.

### Colby Street NB

Observed (PM): 182 cars entered at the south end, 102 drove the whole street, 164 left it at Alcatraz Ave (131 left, 32 right, 1 straight), and 47% of the block's trips came from a freeway (the headline share). ASSUMPTION: freeway-origin cars that do not end along the street are 65 veh/h (the 82 freeway-origin trips on the block, 47% of 174, times the 182 / (182 + 47) of its cars that entered at the south end rather than joining on the way), spread over the 164 exits in proportion (0.40); the other through cars come from the Telegraph Ave and south-side approaches that feed the street's south end. Ranges: low = 131 (32) x 0.47 x 0.62 (the whole-street share of exits), high = 131 (32) x 0.47.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | OBSERVED turn count x ASSUMPTION share (131 left turns x 0.40) | 52 (38 to 62) | 31 | below |
| Telegraph Ave and south-side traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | ASSUMPTION: the through left-turners (131 x 0.62 = 81) that are not off-ramp traffic | 29 (19 to 43) | 43 | within |
| SR-24 off-ramp traffic using Colby St to reach College Ave and Berkeley (right at Alcatraz Ave) | OBSERVED turn count x ASSUMPTION share (32 right turns x 0.40) | 13 (9 to 15) | 5 | below |
| Telegraph Ave and south-side traffic using Colby St to reach College Ave and Berkeley | ASSUMPTION: the through right-turners (32 x 0.62 = 20) that are not off-ramp traffic | 7 (5 to 11) | 2 | below |
| Intents listed, together | | 101 (71 to 131) | 82 | |
| Other through cars (no intent listed) | | | 3 | |

Model through cars by origin and destination group (largest 12 of 37 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 20.3 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) | 9.4 | Claremont Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Emeryville and West Oakland streets (55th to 67th Streets) | 7.7 | Claremont Avenue |
| Telegraph Ave to the south (downtown Oakland) | Telegraph Ave from the north (Berkeley) | 6.7 | Telegraph Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Telegraph Ave from the north (Berkeley) | 6.3 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 5.3 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Alcatraz Ave from the west (Emeryville side) | 4.2 | Claremont Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Ashby Ave from the west (Emeryville and I-80) | 3.8 | Claremont Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Ashby Ave from the west (Emeryville and I-80) | 3.6 | SR-24 then Telegraph Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Telegraph Ave from the north (Berkeley) | 3.3 | none near the study area |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 3.1 | College Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Shattuck Ave from the north (Berkeley) | 1.9 | SR-24 then Telegraph Avenue then Alcatraz Avenue |
| other pairs | | 8.9 | |

By the arterial these cars would otherwise use: Telegraph Avenue 39 veh/h; Claremont Avenue 28 veh/h; SR-24 then Telegraph Avenue 5 veh/h; College Avenue 4 veh/h; none near the study area 4 veh/h; SR-24 then Telegraph Avenue then Alcatraz Avenue 2 veh/h.

### Hillegass Avenue NB

Observed (PM): 94 cars entered at the south end, 48 drove the whole street, 109 left it at Alcatraz Ave (43 west, 54 east, 12 straight), and 47% of the block's trips came from a freeway. ASSUMPTION: freeway-origin through cars are 40 veh/h (52 freeway-origin trips times 94 / (94 + 29)), spread over the exits in proportion (0.37); the through share of exits is 48 / 109 = 0.44.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Hillegass Ave to reach Alcatraz Ave west and Telegraph Ave north | OBSERVED turn count x ASSUMPTION share (43 left turns x 0.37) | 16 (9 to 20) | 15 | within |
| SR-24 off-ramp traffic using Hillegass Ave to reach College Ave and Berkeley | OBSERVED turn count x ASSUMPTION share (54 right turns x 0.37) | 20 (11 to 25) | 24 | within |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach Alcatraz Ave west | ASSUMPTION: through exits (43 x 0.44) that are not off-ramp traffic | 3 (0 to 10) | 10 | within |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach College Ave and Berkeley | ASSUMPTION: through exits (54 x 0.44) that are not off-ramp traffic | 4 (0 to 13) | 6 | within |
| Intents listed, together | | 43 (20 to 68) | 54 | |
| Other through cars (no intent listed) | | | 2 | |

Model through cars by origin and destination group (largest 12 of 41 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 12.4 | SR-24 |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 8.8 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 5.9 | SR-24 then Claremont Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | College Ave from the north (Berkeley) | 4.8 | SR-24 then Claremont Avenue then College Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Emeryville and West Oakland streets (55th to 67th Streets) | 3.3 | College Avenue then Alcatraz Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) | 2.2 | Claremont Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Telegraph Ave from the north (Berkeley) | 2.1 | none near the study area |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Ashby Ave from the west (Emeryville and I-80) | 1.6 | SR-24 then Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 1.1 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 1.1 | College Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 1.1 | Telegraph Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Claremont Ave and Tunnel Rd toward the hills | 1.0 | Claremont Avenue |
| other pairs | | 10.8 | |

By the arterial these cars would otherwise use: SR-24 14 veh/h; Telegraph Avenue 12 veh/h; Claremont Avenue 7 veh/h; SR-24 then Claremont Avenue 6 veh/h; SR-24 then Claremont Avenue then College Avenue 5 veh/h; College Avenue then Alcatraz Avenue 4 veh/h.

### Hillegass Avenue SB

Observed (PM): 178 cars entered at the top (76 turned in from Alcatraz Ave west, 98 from the east, 4 came straight from the north), 79 drove the whole street, and 68% of the block's trips (109 veh/h) went to a freeway. ASSUMPTION: freeway-bound cars that did not join mid-street are 87 veh/h (109 x 178 / (178 + 44)), half of the 174 turn-ins; low = the whole-street share of the turn-ins (0.45), high = the freeway-bound share without the mid-street correction (0.63).

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Telegraph Ave, Alcatraz Ave west and West Berkeley traffic turning off Alcatraz Ave onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (76 turn-ins x 0.50) | 38 (34 to 48) | 15 | below |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (98 turn-ins x 0.50) | 49 (44 to 62) | 20 | below |
| Intents listed, together | | 87 (78 to 110) | 35 | |
| Other through cars (no intent listed) | | | 17 | |

Model through cars by origin and destination group (largest 12 of 26 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 15.2 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 10.3 | Claremont Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 9.1 | Alcatraz Avenue then College Avenue then Claremont Avenue |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 5.3 | College Avenue then Claremont Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 3.6 | Claremont Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Telegraph Ave to the south (downtown Oakland) | 2.5 | Telegraph Avenue |
| College Ave from the north (Berkeley) | Telegraph Ave to the south (downtown Oakland) | 1.2 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 1.0 | College Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | West Oakland to the southwest (Adeline St, Market St) | 0.8 | Alcatraz Avenue then Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Berkeley hills to the northeast (Evergreen Ln, Gravatt Dr) | 0.6 | Alcatraz Avenue then Claremont Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Emeryville and West Oakland streets (55th to 67th Streets) | 0.4 | College Avenue then Alcatraz Avenue |
| Alcatraz Ave from the west (Emeryville side) | Berkeley hills to the northeast (Evergreen Ln, Gravatt Dr) | 0.2 | Alcatraz Avenue then Claremont Avenue |
| other pairs | | 1.9 | |

By the arterial these cars would otherwise use: Telegraph Avenue 19 veh/h; Claremont Avenue then SR-24 14 veh/h; Alcatraz Avenue then College Avenue then Claremont Avenue 9 veh/h; College Avenue then Claremont Avenue then SR-24 5 veh/h; Alcatraz Avenue then Claremont Avenue 1 veh/h; College Avenue 1 veh/h.

### Colby Street SB

Observed (PM): 139 cars entered at the top (76 from Alcatraz Ave west, 50 from the east, 13 from the north), 39 drove the whole street, 45% of the block's trips (72 veh/h) went to a freeway and 22% came by way of Telegraph Ave. ASSUMPTION: freeway-bound cars that did not join mid-street are 46 veh/h (72 x 139 / (139 + 79)), 0.365 of the 126 turn-ins; low = the whole-street share (0.31), high = the unadjusted freeway share (0.57). The Telegraph Ave cars are the 22% x 160 = 35 of the 76 west turn-ins.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Southbound Telegraph Ave traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (35 Telegraph Ave cars x 0.365) | 13 (11 to 20) | 20 | within |
| Alcatraz Ave west, Ashby Ave and West Berkeley traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (41 other west turn-ins x 0.365) | 15 (13 to 23) | 15 | within |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (50 east turn-ins x 0.365) | 18 (15 to 29) | 17 | within |
| Intents listed, together | | 46 (39 to 72) | 52 | |
| Other through cars (no intent listed) | | | 30 | |

Model through cars by origin and destination group (largest 12 of 43 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 16.4 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 15.1 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 13.0 | Alcatraz Avenue then College Avenue then Claremont Avenue |
| Shattuck Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 6.1 | none near the study area |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Telegraph Ave to the south (downtown Oakland) | 4.7 | Telegraph Avenue |
| Ashby Ave from the west (Emeryville and I-80) | SR-13 Warren Freeway (via SR-24 east) | 3.5 | SR-24 |
| Ashby Ave from the west (Emeryville and I-80) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 2.6 | SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | West Oakland to the southwest (Adeline St, Market St) | 2.4 | Alcatraz Avenue then Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 2.1 | Telegraph Avenue then Alcatraz Avenue then Claremont Avenue |
| Telegraph Ave from the north (Berkeley) | SR-13 Warren Freeway (via SR-24 east) | 2.1 | none near the study area |
| Alcatraz Ave from the west (Emeryville side) | SR-13 Warren Freeway (via SR-24 east) | 1.6 | SR-24 |
| Telegraph Ave from the north (Berkeley) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 1.6 | none near the study area |
| other pairs | | 10.5 | |

By the arterial these cars would otherwise use: Telegraph Avenue 38 veh/h; Alcatraz Avenue then College Avenue then Claremont Avenue 14 veh/h; none near the study area 10 veh/h; SR-24 9 veh/h; Alcatraz Avenue then Telegraph Avenue 2 veh/h; Telegraph Avenue then Alcatraz Avenue then Claremont Avenue 2 veh/h.

### Study area, all residential and service streets

Model: 454 through cars per hour.

Model through cars by origin and destination group (largest 12 of 107 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 37.7 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 32.8 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) | 32.8 | Claremont Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 31.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 30.4 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 25.6 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Emeryville and West Oakland streets (55th to 67th Streets) | 21.6 | Claremont Avenue |
| Telegraph Ave to the south (downtown Oakland) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 20.3 | Telegraph Avenue then Claremont Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave to the south (downtown Oakland) | 19.8 | Claremont Avenue then Telegraph Avenue |
| Telegraph Ave to the south (downtown Oakland) | SR-24 westbound on-ramps (toward Oakland and I-980) | 17.9 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 12.4 | SR-24 |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 10.3 | Claremont Avenue then SR-24 |
| other pairs | | 161.4 | |

By the arterial these cars would otherwise use: Telegraph Avenue 212 veh/h; Claremont Avenue 87 veh/h; SR-24 26 veh/h; Telegraph Avenue then Claremont Avenue 20 veh/h; Claremont Avenue then Telegraph Avenue 20 veh/h; none near the study area 19 veh/h.

By origin group: South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 117; Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 80; SR-24 eastbound off-ramps (arriving from Oakland and I-980) 79; Telegraph Ave to the south (downtown Oakland) 47; Telegraph Ave from the north (Berkeley) 44; SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) 17; Claremont Ave and Tunnel Rd toward the hills 14; West Oakland to the southwest (Adeline St, Market St) 11; College Ave from the north (Berkeley) 10; Emeryville and West Oakland streets (55th to 67th Streets) 7.

By destination group: SR-24 westbound on-ramps (toward Oakland and I-980) 111; Telegraph Ave from the north (Berkeley) 58; South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 54; Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 44; West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) 34; Telegraph Ave to the south (downtown Oakland) 30; Emeryville and West Oakland streets (55th to 67th Streets) 25; Claremont Ave and Tunnel Rd toward the hills 22; Ashby Ave from the west (Emeryville and I-80) 16; San Pablo Ave (Emeryville and West Oakland) 11.


Per-seed detail: `rockridge-am_peak-s1-seed1.md` (seed 1 in full).
