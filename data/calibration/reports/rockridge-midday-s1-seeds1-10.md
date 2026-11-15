# rockridge-midday-s1 over 10 seeds (1, 2, 3, 4, 5, 6, 7, 8, 9, 10)

Seeds are the fixed list above, none chosen; each run is 60 minutes from the same start. Interval = 95% interval of the mean (Student t, n - 1 degrees of freedom). Run-to-run noise only: demand is fixed, so day-to-day variation is not in these intervals.

## Stability rule (design decision D16)

| Check | Rule | Result | Pass |
| --- | --- | --- | --- |
| Removals | mean per hour below 1.00 | 0.00 (min 0.00, max 0.00) | yes |
| Entry backlog | below 2.0% in at least 90% of seeds | 10 of 10 seeds | yes |
| Runaway growth | no seed adds more than 2.0 points of backlog in the second half | none | yes |
| Arterial speed | mean above 4.0 m/s | 10.03 m/s | yes |

**Verdict: stable.** Old rule (zero removals, backlog under 2%, speed above 4 m/s, every seed): 10 of 10 seeds pass.

## Metrics over seeds

| Group | Metric | Unit | Mean | SD | Min | Max | 95% interval |
| --- | --- | --- | --- | --- | --- | --- | --- |
| health | gridlock removals | vehicles | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| health | gridlock removals per hour | veh/h | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| health | entry backlog | % of spawned | 0.00 | 0.01 | 0.00 | 0.02 | -0.00 to 0.01 |
| health | backlog growth in the second half of the run | points of spawned | -0.00 | 0.01 | -0.02 | 0.01 | -0.01 to 0.00 |
| health | completed trips | trips | 16095.80 | 169.33 | 15786.00 | 16337.00 | 15974.68 to 16216.92 |
| health | arterial mean speed | m/s | 10.03 | 0.04 | 9.97 | 10.11 | 10.00 to 10.06 |
| health | arterial mean speed, last 15 min | m/s | 10.09 | 0.05 | 10.01 | 10.18 | 10.05 to 10.12 |
| cut-through | local vehicle-miles, surface gates to the freeway | veh-miles | 22.63 | 3.26 | 17.63 | 27.49 | 20.30 to 24.96 |
| cut-through | share of local vehicle-miles, surface gates to the freeway | % | 9.0 | 1.0 | 7.4 | 10.3 | 8.2 to 9.7 |
| cut-through | local vehicle-miles, freeway to the surface gates | veh-miles | 23.08 | 3.66 | 18.51 | 30.93 | 20.46 to 25.70 |
| cut-through | share of local vehicle-miles, freeway to the surface gates | % | 9.2 | 1.3 | 7.4 | 11.6 | 8.3 to 10.1 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue N | trips | 26.80 | 6.86 | 15.00 | 34.00 | 21.89 to 31.71 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue N | trips | 889.50 | 36.23 | 806.00 | 947.00 | 863.59 to 915.41 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue S | trips | 39.80 | 2.20 | 37.00 | 43.00 | 38.23 to 41.37 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue S | trips | 937.30 | 34.74 | 896.00 | 1001.00 | 912.45 to 962.15 |
| headline share | Hillegass Avenue NB from freeway | % | 51.1 | 5.2 | 44.5 | 60.2 | 47.4 to 54.8 |
| share | Hillegass Avenue NB to Benvenue Avenue | % | 2.5 | 1.9 | 0.0 | 5.7 | 1.2 to 3.8 |
| share | Hillegass Avenue NB to College Avenue | % | 14.7 | 2.6 | 8.3 | 16.9 | 12.8 to 16.5 |
| share | Hillegass Avenue NB to Alcatraz Avenue WB | % | 28.0 | 3.1 | 25.0 | 34.5 | 25.9 to 30.2 |
| headline share | Colby Street NB from freeway | % | 39.1 | 3.1 | 34.4 | 43.7 | 36.8 to 41.3 |
| share | Colby Street NB to Alcatraz Avenue WB | % | 52.0 | 3.5 | 46.0 | 58.7 | 49.4 to 54.5 |
| share | Colby Street NB to Telegraph Avenue | % | 35.9 | 4.5 | 25.7 | 42.0 | 32.7 to 39.0 |
| share | Colby Street NB to College Avenue | % | 6.4 | 1.5 | 4.1 | 9.2 | 5.4 to 7.5 |
| share | Hillegass Avenue SB from Alcatraz Avenue WB | % | 28.8 | 3.3 | 22.3 | 33.3 | 26.4 to 31.1 |
| share | Hillegass Avenue SB from Benvenue Avenue | % | 3.3 | 1.4 | 1.9 | 6.1 | 2.3 to 4.3 |
| share | Hillegass Avenue SB from College Avenue | % | 13.5 | 3.7 | 8.6 | 19.2 | 10.8 to 16.2 |
| headline share | Hillegass Avenue SB to freeway | % | 56.0 | 4.8 | 48.9 | 63.7 | 52.5 to 59.5 |
| share | Colby Street SB from Alcatraz Avenue EB | % | 20.8 | 3.1 | 15.3 | 26.0 | 18.6 to 23.1 |
| share | Colby Street SB from Alcatraz Avenue WB | % | 18.3 | 3.0 | 13.4 | 21.9 | 16.2 to 20.5 |
| share | Colby Street SB from Telegraph Avenue | % | 16.5 | 3.6 | 9.0 | 21.2 | 13.9 to 19.0 |
| headline share | Colby Street SB to freeway | % | 48.2 | 3.8 | 40.5 | 53.5 | 45.5 to 50.9 |
| share | Colby Street SB to Forest Street | % | 14.0 | 3.9 | 9.2 | 19.8 | 11.2 to 16.8 |
| ramp share | onto freeway via College Avenue | % | 17.0 | 2.0 | 13.9 | 20.1 | 15.6 to 18.4 |
| ramp share | onto freeway via Hillegass Avenue | % | 16.0 | 2.0 | 13.4 | 19.1 | 14.5 to 17.4 |
| ramp share | onto freeway via Martin Street | % | 14.5 | 1.2 | 13.3 | 16.5 | 13.6 to 15.4 |
| ramp share | onto freeway via Colby Street | % | 13.2 | 1.9 | 10.0 | 15.6 | 11.8 to 14.5 |
| ramp share | onto freeway via Telegraph Avenue north of Alcatraz Avenue | % | 9.1 | 0.8 | 8.2 | 10.4 | 8.5 to 9.6 |
| ramp share | onto freeway via Benvenue Avenue | % | 4.7 | 1.0 | 3.1 | 6.7 | 3.9 to 5.4 |
| ramp share | from freeway via College Avenue | % | 10.3 | 1.9 | 7.8 | 13.2 | 8.9 to 11.7 |
| ramp share | from freeway via Martin Street | % | 11.4 | 1.6 | 9.4 | 14.2 | 10.3 to 12.5 |
| ramp share | from freeway via Colby Street | % | 12.5 | 1.4 | 10.3 | 14.9 | 11.6 to 13.5 |
| ramp share | from freeway via Hillegass Avenue | % | 6.7 | 1.8 | 4.4 | 9.6 | 5.4 to 8.0 |
| ramp share | from freeway via Benvenue Avenue | % | 2.6 | 1.2 | 1.3 | 4.7 | 1.7 to 3.4 |
| corridor flow | Telegraph N median link flow | veh/h | 615.36 | 38.78 | 565.20 | 674.40 | 587.62 to 643.10 |
| corridor flow | Telegraph S median link flow | veh/h | 413.40 | 27.08 | 369.60 | 452.40 | 394.03 to 432.77 |
| corridor flow | College N median link flow | veh/h | 229.68 | 24.92 | 192.00 | 256.80 | 211.86 to 247.50 |
| corridor flow | College S median link flow | veh/h | 409.56 | 27.83 | 368.40 | 463.20 | 389.65 to 429.47 |
| corridor flow | Claremont N median link flow | veh/h | 284.52 | 28.71 | 249.60 | 343.20 | 263.98 to 305.06 |
| corridor flow | Claremont S median link flow | veh/h | 201.24 | 20.50 | 171.60 | 240.00 | 186.58 to 215.90 |
| corridor flow | Alcatraz E median link flow | veh/h | 397.20 | 28.57 | 356.40 | 463.20 | 376.76 to 417.64 |
| corridor flow | Alcatraz W median link flow | veh/h | 257.04 | 18.65 | 224.40 | 284.40 | 243.70 to 270.38 |
| corridor flow | Hillegass N median link flow | veh/h | 73.56 | 11.27 | 55.20 | 88.80 | 65.50 to 81.62 |
| corridor flow | Hillegass S median link flow | veh/h | 83.28 | 8.62 | 69.60 | 93.60 | 77.11 to 89.45 |
| corridor flow | Colby N median link flow | veh/h | 98.64 | 9.97 | 82.80 | 114.00 | 91.51 to 105.77 |
| corridor flow | Colby S median link flow | veh/h | 75.12 | 10.19 | 55.20 | 90.00 | 67.83 to 82.41 |
| corridor flow | Martin E median link flow | veh/h | 78.96 | 9.53 | 68.40 | 94.80 | 72.14 to 85.78 |
| corridor flow | Martin W median link flow | veh/h | 66.60 | 11.75 | 51.60 | 87.60 | 58.20 to 75.00 |

## Intent map: through cars by where they come from and where they are going

Through = neither trip end is in the study area. Groups are the approach groups of the area config (data/areas); a node that is not a gate takes the group of the nearest surface gate (ASSUMPTION). The arterial is the one a trip would use on the shortest free-flow path with the study area's residential and service streets closed, where that path runs on a boundary street near the study area.

Model figures are the mean of 10 seed(s), per hour of the run. Basis: OBSERVED = read from the resident volunteer count of Feb 25, 2025 or its headline shares; ASSUMPTION = inferred from those numbers or chosen.

### Colby Street NB

Observed (PM): 182 cars entered at the south end, 102 drove the whole street, 164 left it at Alcatraz Ave (131 left, 32 right, 1 straight), and 47% of the block's trips came from a freeway (the headline share). ASSUMPTION: freeway-origin cars that do not end along the street are 65 veh/h (the 82 freeway-origin trips on the block, 47% of 174, times the 182 / (182 + 47) of its cars that entered at the south end rather than joining on the way), spread over the 164 exits in proportion (0.40); the other through cars come from the Telegraph Ave and south-side approaches that feed the street's south end. Ranges: low = 131 (32) x 0.47 x 0.62 (the whole-street share of exits), high = 131 (32) x 0.47.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | OBSERVED turn count x ASSUMPTION share (131 left turns x 0.40) | 52 (38 to 62) | 39 | within |
| Telegraph Ave and south-side traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | ASSUMPTION: the through left-turners (131 x 0.62 = 81) that are not off-ramp traffic | 29 (19 to 43) | 18 | below |
| SR-24 off-ramp traffic using Colby St to reach College Ave and Berkeley (right at Alcatraz Ave) | OBSERVED turn count x ASSUMPTION share (32 right turns x 0.40) | 13 (9 to 15) | 10 | within |
| Telegraph Ave and south-side traffic using Colby St to reach College Ave and Berkeley | ASSUMPTION: the through right-turners (32 x 0.62 = 20) that are not off-ramp traffic | 7 (5 to 11) | 6 | within |
| Intents listed, together | | 101 (71 to 131) | 73 | |
| Other through cars (no intent listed) | | | 2 | |

Model through cars by origin and destination group (largest 12 of 33 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 39.2 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Ashby Ave from the west (Emeryville and I-80) | 5.5 | none near the study area |
| Telegraph Ave to the south (downtown Oakland) | Telegraph Ave from the north (Berkeley) | 5.4 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 4.4 | SR-24 |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 3.7 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 3.2 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 3.2 | Claremont Avenue then College Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Telegraph Ave from the north (Berkeley) | 2.6 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | College Ave from the north (Berkeley) | 1.7 | SR-24 then Claremont Avenue then College Avenue |
| College Ave from the north (Berkeley) | Alcatraz Ave from the west (Emeryville side) | 0.8 | College Avenue then Alcatraz Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) | 0.8 | none near the study area |
| West Oakland to the southwest (Adeline St, Market St) | College Ave from the north (Berkeley) | 0.6 | Telegraph Avenue |
| other pairs | | 4.7 | |

By the arterial these cars would otherwise use: Telegraph Avenue 55 veh/h; none near the study area 6 veh/h; SR-24 4 veh/h; Claremont Avenue then College Avenue 3 veh/h; Claremont Avenue 2 veh/h; SR-24 then Claremont Avenue then College Avenue 2 veh/h.

### Hillegass Avenue NB

Observed (PM): 94 cars entered at the south end, 48 drove the whole street, 109 left it at Alcatraz Ave (43 west, 54 east, 12 straight), and 47% of the block's trips came from a freeway. ASSUMPTION: freeway-origin through cars are 40 veh/h (52 freeway-origin trips times 94 / (94 + 29)), spread over the exits in proportion (0.37); the through share of exits is 48 / 109 = 0.44.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Hillegass Ave to reach Alcatraz Ave west and Telegraph Ave north | OBSERVED turn count x ASSUMPTION share (43 left turns x 0.37) | 16 (9 to 20) | 11 | within |
| SR-24 off-ramp traffic using Hillegass Ave to reach College Ave and Berkeley | OBSERVED turn count x ASSUMPTION share (54 right turns x 0.37) | 20 (11 to 25) | 18 | within |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach Alcatraz Ave west | ASSUMPTION: through exits (43 x 0.44) that are not off-ramp traffic | 3 (0 to 10) | 4 | within |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach College Ave and Berkeley | ASSUMPTION: through exits (54 x 0.44) that are not off-ramp traffic | 4 (0 to 13) | 11 | within |
| Intents listed, together | | 43 (20 to 68) | 44 | |
| Other through cars (no intent listed) | | | 4 | |

Model through cars by origin and destination group (largest 12 of 39 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 9.4 | SR-24 |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 7.3 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 7.2 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | College Ave from the north (Berkeley) | 4.1 | SR-24 then Claremont Avenue then College Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 3.6 | SR-24 then Claremont Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Ashby Ave from the west (Emeryville and I-80) | 2.0 | SR-24 then Telegraph Avenue |
| Telegraph Ave to the south (downtown Oakland) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 1.7 | Telegraph Avenue |
| College Ave from the north (Berkeley) | Alcatraz Ave from the west (Emeryville side) | 1.6 | College Avenue then Alcatraz Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Telegraph Ave from the north (Berkeley) | 1.4 | none near the study area |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 1.2 | College Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | San Pablo Ave (Emeryville and West Oakland) | 0.7 | SR-24 |
| Telegraph Ave to the south (downtown Oakland) | Claremont Ave and Tunnel Rd toward the hills | 0.7 | Claremont Avenue |
| other pairs | | 7.1 | |

By the arterial these cars would otherwise use: Telegraph Avenue 17 veh/h; SR-24 10 veh/h; SR-24 then Claremont Avenue then College Avenue 4 veh/h; SR-24 then Claremont Avenue 4 veh/h; Claremont Avenue 3 veh/h; College Avenue then Alcatraz Avenue 2 veh/h.

### Hillegass Avenue SB

Observed (PM): 178 cars entered at the top (76 turned in from Alcatraz Ave west, 98 from the east, 4 came straight from the north), 79 drove the whole street, and 68% of the block's trips (109 veh/h) went to a freeway. ASSUMPTION: freeway-bound cars that did not join mid-street are 87 veh/h (109 x 178 / (178 + 44)), half of the 174 turn-ins; low = the whole-street share of the turn-ins (0.45), high = the freeway-bound share without the mid-street correction (0.63).

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Telegraph Ave, Alcatraz Ave west and West Berkeley traffic turning off Alcatraz Ave onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (76 turn-ins x 0.50) | 38 (34 to 48) | 25 | below |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (98 turn-ins x 0.50) | 49 (44 to 62) | 33 | below |
| Intents listed, together | | 87 (78 to 110) | 58 | |
| Other through cars (no intent listed) | | | 14 | |

Model through cars by origin and destination group (largest 12 of 23 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 24.8 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 14.1 | Claremont Avenue then SR-24 |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 9.0 | College Avenue then Claremont Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 8.5 | Claremont Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 6.3 | Telegraph Avenue |
| Shattuck Ave from the north (Berkeley) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 2.5 | College Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 1.3 | Claremont Avenue |
| Emeryville and West Oakland streets (55th to 67th Streets) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 0.7 | Alcatraz Avenue then College Avenue |
| Emeryville and West Oakland streets (55th to 67th Streets) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 0.7 | Claremont Avenue |
| Ashby Ave from the west (Emeryville and I-80) | Berkeley hills to the northeast (Evergreen Ln, Gravatt Dr) | 0.6 | SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Berkeley hills to the northeast (Evergreen Ln, Gravatt Dr) | 0.6 | Alcatraz Avenue then Claremont Avenue |
| Telegraph Ave from the north (Berkeley) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 0.6 | Telegraph Avenue |
| other pairs | | 2.5 | |

By the arterial these cars would otherwise use: Telegraph Avenue 32 veh/h; Claremont Avenue then SR-24 23 veh/h; College Avenue then Claremont Avenue then SR-24 9 veh/h; Claremont Avenue 3 veh/h; College Avenue 3 veh/h; Alcatraz Avenue then Claremont Avenue 1 veh/h.

### Colby Street SB

Observed (PM): 139 cars entered at the top (76 from Alcatraz Ave west, 50 from the east, 13 from the north), 39 drove the whole street, 45% of the block's trips (72 veh/h) went to a freeway and 22% came by way of Telegraph Ave. ASSUMPTION: freeway-bound cars that did not join mid-street are 46 veh/h (72 x 139 / (139 + 79)), 0.365 of the 126 turn-ins; low = the whole-street share (0.31), high = the unadjusted freeway share (0.57). The Telegraph Ave cars are the 22% x 160 = 35 of the 76 west turn-ins.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Southbound Telegraph Ave traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (35 Telegraph Ave cars x 0.365) | 13 (11 to 20) | 11 | within |
| Alcatraz Ave west, Ashby Ave and West Berkeley traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (41 other west turn-ins x 0.365) | 15 (13 to 23) | 8 | below |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (50 east turn-ins x 0.365) | 18 (15 to 29) | 25 | within |
| Intents listed, together | | 46 (39 to 72) | 45 | |
| Other through cars (no intent listed) | | | 24 | |

Model through cars by origin and destination group (largest 12 of 38 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 12.1 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 11.2 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 10.6 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 8.4 | Claremont Avenue then SR-24 |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 4.2 | College Avenue then Claremont Avenue then SR-24 |
| Shattuck Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 2.8 | none near the study area |
| Ashby Ave from the west (Emeryville and I-80) | SR-13 Warren Freeway (via SR-24 east) | 2.6 | SR-24 |
| Emeryville and West Oakland streets (55th to 67th Streets) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 1.5 | Claremont Avenue |
| Ashby Ave from the west (Emeryville and I-80) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 1.4 | SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Telegraph Ave to the south (downtown Oakland) | 1.1 | Claremont Avenue |
| Telegraph Ave from the north (Berkeley) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 1.1 | Telegraph Avenue |
| Shattuck Ave from the north (Berkeley) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 0.9 | College Avenue |
| other pairs | | 10.5 | |

By the arterial these cars would otherwise use: Telegraph Avenue 35 veh/h; Claremont Avenue then SR-24 8 veh/h; Claremont Avenue 6 veh/h; SR-24 6 veh/h; College Avenue then Claremont Avenue then SR-24 4 veh/h; none near the study area 4 veh/h.

### Study area, all residential and service streets

Model: 340 through cars per hour.

Model through cars by origin and destination group (largest 12 of 105 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 46.6 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 37.1 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 31.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 29.6 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 19.3 | Claremont Avenue then SR-24 |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 16.3 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 14.7 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 14.1 | SR-24 |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 12.1 | Claremont Avenue then College Avenue |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 10.7 | College Avenue then Claremont Avenue then SR-24 |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Ashby Ave from the west (Emeryville and I-80) | 8.7 | none near the study area |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | College Ave from the north (Berkeley) | 5.7 | SR-24 then Claremont Avenue then College Avenue |
| other pairs | | 94.5 | |

By the arterial these cars would otherwise use: Telegraph Avenue 196 veh/h; Claremont Avenue 24 veh/h; SR-24 24 veh/h; Claremont Avenue then SR-24 19 veh/h; none near the study area 17 veh/h; Claremont Avenue then College Avenue 15 veh/h.

By origin group: SR-24 eastbound off-ramps (arriving from Oakland and I-980) 83; Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 80; South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 42; Telegraph Ave from the north (Berkeley) 35; Claremont Ave and Tunnel Rd toward the hills 22; College Ave from the north (Berkeley) 15; Telegraph Ave to the south (downtown Oakland) 14; Emeryville and West Oakland streets (55th to 67th Streets) 10; West Oakland to the southwest (Adeline St, Market St) 10; Shattuck Ave from the north (Berkeley) 9.

By destination group: SR-24 westbound on-ramps (toward Oakland and I-980) 105; Telegraph Ave from the north (Berkeley) 69; Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 42; South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 41; Claremont Ave and Tunnel Rd toward the hills 28; Ashby Ave from the west (Emeryville and I-80) 12; College Ave from the north (Berkeley) 10; Berkeley hills to the northeast (Evergreen Ln, Gravatt Dr) 5; San Pablo Ave (Emeryville and West Oakland) 5; SR-24 eastbound on-ramps (toward the Caldecott Tunnel) 4.


Per-seed detail: `rockridge-midday-s1-seed1.md` (seed 1 in full).
