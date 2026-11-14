# rockridge-am_peak-s1 over 10 seeds (1, 2, 3, 4, 5, 6, 7, 8, 9, 10)

Seeds are the fixed list above, none chosen; each run is 60 minutes from the same start. Interval = 95% interval of the mean (Student t, n - 1 degrees of freedom). Run-to-run noise only: demand is fixed, so day-to-day variation is not in these intervals.

## Stability rule (design decision D16)

| Check | Rule | Result | Pass |
| --- | --- | --- | --- |
| Removals | mean per hour below 1.00 | 0.00 (min 0.00, max 0.00) | yes |
| Entry backlog | below 2.0% in at least 90% of seeds | 10 of 10 seeds | yes |
| Runaway growth | no seed adds more than 2.0 points of backlog in the second half | none | yes |
| Arterial speed | mean above 4.0 m/s | 9.73 m/s | yes |

**Verdict: stable.** Old rule (zero removals, backlog under 2%, speed above 4 m/s, every seed): 10 of 10 seeds pass.

## Metrics over seeds

| Group | Metric | Unit | Mean | SD | Min | Max | 95% interval |
| --- | --- | --- | --- | --- | --- | --- | --- |
| health | gridlock removals | vehicles | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| health | gridlock removals per hour | veh/h | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| health | entry backlog | % of spawned | 0.01 | 0.01 | 0.00 | 0.03 | 0.01 to 0.02 |
| health | backlog growth in the second half of the run | points of spawned | -0.00 | 0.01 | -0.01 | 0.01 | -0.01 to 0.01 |
| health | completed trips | trips | 21581.70 | 131.29 | 21352.00 | 21717.00 | 21487.79 to 21675.61 |
| health | arterial mean speed | m/s | 9.73 | 0.07 | 9.58 | 9.81 | 9.68 to 9.78 |
| health | arterial mean speed, last 15 min | m/s | 9.74 | 0.09 | 9.64 | 9.92 | 9.68 to 9.81 |
| cut-through | local vehicle-miles, surface gates to the freeway | veh-miles | 23.80 | 2.20 | 20.89 | 27.73 | 22.23 to 25.37 |
| cut-through | share of local vehicle-miles, surface gates to the freeway | % | 6.9 | 0.4 | 6.4 | 7.8 | 6.6 to 7.3 |
| cut-through | local vehicle-miles, freeway to the surface gates | veh-miles | 18.18 | 2.02 | 15.12 | 20.81 | 16.74 to 19.63 |
| cut-through | share of local vehicle-miles, freeway to the surface gates | % | 5.3 | 0.6 | 4.5 | 6.2 | 4.9 to 5.7 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue N | trips | 36.20 | 4.83 | 30.00 | 46.00 | 32.75 to 39.65 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue N | trips | 891.60 | 29.13 | 832.00 | 921.00 | 870.76 to 912.44 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue S | trips | 30.80 | 4.02 | 26.00 | 40.00 | 27.92 to 33.68 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue S | trips | 1115.40 | 37.84 | 1059.00 | 1163.00 | 1088.33 to 1142.47 |
| headline share | Hillegass Avenue NB from freeway | % | 50.4 | 5.4 | 42.4 | 59.4 | 46.5 to 54.3 |
| share | Hillegass Avenue NB to Benvenue Avenue | % | 8.3 | 2.9 | 2.9 | 12.4 | 6.2 to 10.4 |
| share | Hillegass Avenue NB to College Avenue | % | 16.2 | 3.7 | 12.4 | 21.6 | 13.5 to 18.9 |
| share | Hillegass Avenue NB to Alcatraz Avenue WB | % | 36.6 | 3.0 | 33.1 | 43.0 | 34.5 to 38.8 |
| headline share | Colby Street NB from freeway | % | 43.6 | 3.0 | 37.6 | 46.5 | 41.5 to 45.7 |
| share | Colby Street NB to Alcatraz Avenue WB | % | 54.4 | 3.2 | 48.8 | 58.4 | 52.1 to 56.7 |
| share | Colby Street NB to Telegraph Avenue | % | 34.1 | 4.7 | 27.1 | 43.4 | 30.7 to 37.5 |
| share | Colby Street NB to College Avenue | % | 3.2 | 1.3 | 1.6 | 5.2 | 2.3 to 4.2 |
| share | Hillegass Avenue SB from Alcatraz Avenue WB | % | 23.3 | 4.6 | 14.4 | 29.2 | 19.9 to 26.6 |
| share | Hillegass Avenue SB from Benvenue Avenue | % | 2.2 | 1.8 | 0.0 | 4.9 | 0.9 to 3.4 |
| share | Hillegass Avenue SB from College Avenue | % | 12.5 | 3.0 | 6.4 | 16.7 | 10.3 to 14.6 |
| headline share | Hillegass Avenue SB to freeway | % | 69.8 | 3.0 | 64.8 | 74.2 | 67.6 to 71.9 |
| share | Colby Street SB from Alcatraz Avenue EB | % | 25.5 | 2.7 | 21.4 | 30.3 | 23.6 to 27.4 |
| share | Colby Street SB from Alcatraz Avenue WB | % | 7.2 | 2.0 | 3.4 | 9.3 | 5.8 to 8.6 |
| share | Colby Street SB from Telegraph Avenue | % | 17.6 | 2.4 | 13.5 | 21.4 | 15.9 to 19.4 |
| headline share | Colby Street SB to freeway | % | 53.4 | 2.9 | 48.7 | 56.9 | 51.3 to 55.4 |
| share | Colby Street SB to Forest Street | % | 8.3 | 1.7 | 6.3 | 11.5 | 7.1 to 9.6 |
| ramp share | onto freeway via College Avenue | % | 13.5 | 1.7 | 9.9 | 15.5 | 12.3 to 14.7 |
| ramp share | onto freeway via Hillegass Avenue | % | 13.2 | 1.0 | 11.3 | 14.5 | 12.4 to 13.9 |
| ramp share | onto freeway via Martin Street | % | 13.8 | 1.7 | 11.0 | 16.6 | 12.6 to 15.0 |
| ramp share | onto freeway via Colby Street | % | 13.5 | 1.6 | 11.4 | 16.7 | 12.3 to 14.6 |
| ramp share | onto freeway via Telegraph Avenue north of Alcatraz Avenue | % | 8.1 | 0.9 | 6.7 | 9.5 | 7.5 to 8.7 |
| ramp share | onto freeway via Benvenue Avenue | % | 4.5 | 0.7 | 3.5 | 5.4 | 4.0 to 5.1 |
| ramp share | from freeway via College Avenue | % | 10.4 | 1.2 | 8.8 | 12.2 | 9.6 to 11.3 |
| ramp share | from freeway via Martin Street | % | 10.5 | 1.5 | 8.0 | 12.9 | 9.4 to 11.6 |
| ramp share | from freeway via Colby Street | % | 11.7 | 1.4 | 9.7 | 14.5 | 10.7 to 12.6 |
| ramp share | from freeway via Hillegass Avenue | % | 6.7 | 0.8 | 5.3 | 8.1 | 6.1 to 7.3 |
| ramp share | from freeway via Benvenue Avenue | % | 2.5 | 0.6 | 1.8 | 3.4 | 2.1 to 2.9 |
| corridor flow | Telegraph N median link flow | veh/h | 753.60 | 39.44 | 704.40 | 806.40 | 725.39 to 781.81 |
| corridor flow | Telegraph S median link flow | veh/h | 708.36 | 79.44 | 642.00 | 913.20 | 651.53 to 765.19 |
| corridor flow | College N median link flow | veh/h | 181.08 | 16.41 | 153.60 | 200.40 | 169.34 to 192.82 |
| corridor flow | College S median link flow | veh/h | 326.76 | 23.55 | 276.00 | 358.80 | 309.91 to 343.61 |
| corridor flow | Claremont N median link flow | veh/h | 375.96 | 26.20 | 332.40 | 404.40 | 357.22 to 394.70 |
| corridor flow | Claremont S median link flow | veh/h | 413.40 | 27.02 | 358.80 | 439.20 | 394.07 to 432.73 |
| corridor flow | Alcatraz E median link flow | veh/h | 342.24 | 31.63 | 301.20 | 406.80 | 319.62 to 364.86 |
| corridor flow | Alcatraz W median link flow | veh/h | 409.32 | 24.00 | 367.20 | 436.80 | 392.16 to 426.48 |
| corridor flow | Hillegass N median link flow | veh/h | 82.80 | 10.20 | 69.60 | 102.00 | 75.51 to 90.09 |
| corridor flow | Hillegass S median link flow | veh/h | 72.60 | 7.23 | 60.00 | 81.60 | 67.43 to 77.77 |
| corridor flow | Colby N median link flow | veh/h | 109.92 | 11.62 | 85.20 | 132.00 | 101.61 to 118.23 |
| corridor flow | Colby S median link flow | veh/h | 118.68 | 13.10 | 94.80 | 135.60 | 109.31 to 128.05 |
| corridor flow | Martin E median link flow | veh/h | 104.40 | 8.22 | 93.60 | 120.00 | 98.52 to 110.28 |
| corridor flow | Martin W median link flow | veh/h | 111.96 | 13.19 | 96.00 | 136.80 | 102.52 to 121.40 |

## Intent map: through cars by where they come from and where they are going

Through = neither trip end is in the study area. Groups are the approach groups of the area config (data/areas); a node that is not a gate takes the group of the nearest surface gate (ASSUMPTION). The arterial is the one a trip would use on the shortest free-flow path with the study area's residential and service streets closed, where that path runs on a boundary street near the study area.

Model figures are the mean of 10 seed(s), per hour of the run. Basis: OBSERVED = read from the resident volunteer count of Feb 25, 2025 or its headline shares; ASSUMPTION = inferred from those numbers or chosen.

### Colby Street NB

Observed (PM): 182 cars entered at the south end, 102 drove the whole street, 164 left it at Alcatraz Ave (131 left, 32 right, 1 straight), and 47% of the block's trips came from a freeway (the headline share). ASSUMPTION: freeway-origin cars that do not end along the street are 65 veh/h (the 82 freeway-origin trips on the block, 47% of 174, times the 182 / (182 + 47) of its cars that entered at the south end rather than joining on the way), spread over the 164 exits in proportion (0.40); the other through cars come from the Telegraph Ave and south-side approaches that feed the street's south end. Ranges: low = 131 (32) x 0.47 x 0.62 (the whole-street share of exits), high = 131 (32) x 0.47.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | OBSERVED turn count x ASSUMPTION share (131 left turns x 0.40) | 52 (38 to 62) | 30 | below |
| Telegraph Ave and south-side traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | ASSUMPTION: the through left-turners (131 x 0.62 = 81) that are not off-ramp traffic | 29 (19 to 43) | 41 | within |
| SR-24 off-ramp traffic using Colby St to reach College Ave and Berkeley (right at Alcatraz Ave) | OBSERVED turn count x ASSUMPTION share (32 right turns x 0.40) | 13 (9 to 15) | 4 | below |
| Telegraph Ave and south-side traffic using Colby St to reach College Ave and Berkeley | ASSUMPTION: the through right-turners (32 x 0.62 = 20) that are not off-ramp traffic | 7 (5 to 11) | 2 | below |
| Intents listed, together | | 101 (71 to 131) | 77 | |
| Other through cars (no intent listed) | | | 2 | |

Model through cars by origin and destination group (largest 12 of 33 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 18.7 | Telegraph Avenue |
| Telegraph Ave to the south (downtown Oakland) | Telegraph Ave from the north (Berkeley) | 8.8 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) | 8.2 | Claremont Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Emeryville and West Oakland streets (55th to 67th Streets) | 6.6 | Claremont Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Telegraph Ave from the north (Berkeley) | 4.9 | Telegraph Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Telegraph Ave from the north (Berkeley) | 4.6 | none near the study area |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 3.8 | Telegraph Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Ashby Ave from the west (Emeryville and I-80) | 3.4 | SR-24 then Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Alcatraz Ave from the west (Emeryville side) | 3.2 | Claremont Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 3.1 | College Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Ashby Ave from the west (Emeryville and I-80) | 3.0 | Claremont Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | San Pablo Ave (Emeryville and West Oakland) | 2.7 | Claremont Avenue |
| other pairs | | 8.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 38 veh/h; Claremont Avenue 24 veh/h; none near the study area 5 veh/h; SR-24 then Telegraph Avenue 4 veh/h; College Avenue 3 veh/h; SR-24 then Telegraph Avenue then Alcatraz Avenue 3 veh/h.

### Hillegass Avenue NB

Observed (PM): 94 cars entered at the south end, 48 drove the whole street, 109 left it at Alcatraz Ave (43 west, 54 east, 12 straight), and 47% of the block's trips came from a freeway. ASSUMPTION: freeway-origin through cars are 40 veh/h (52 freeway-origin trips times 94 / (94 + 29)), spread over the exits in proportion (0.37); the through share of exits is 48 / 109 = 0.44.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Hillegass Ave to reach Alcatraz Ave west and Telegraph Ave north | OBSERVED turn count x ASSUMPTION share (43 left turns x 0.37) | 16 (9 to 20) | 15 | within |
| SR-24 off-ramp traffic using Hillegass Ave to reach College Ave and Berkeley | OBSERVED turn count x ASSUMPTION share (54 right turns x 0.37) | 20 (11 to 25) | 26 | above |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach Alcatraz Ave west | ASSUMPTION: through exits (43 x 0.44) that are not off-ramp traffic | 3 (0 to 10) | 10 | within |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach College Ave and Berkeley | ASSUMPTION: through exits (54 x 0.44) that are not off-ramp traffic | 4 (0 to 13) | 4 | within |
| Intents listed, together | | 43 (20 to 68) | 56 | |
| Other through cars (no intent listed) | | | 2 | |

Model through cars by origin and destination group (largest 12 of 45 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 13.6 | SR-24 |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 8.3 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 7.9 | SR-24 then Claremont Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | College Ave from the north (Berkeley) | 4.7 | SR-24 then Claremont Avenue then College Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Emeryville and West Oakland streets (55th to 67th Streets) | 2.9 | College Avenue then Alcatraz Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) | 2.3 | Claremont Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | San Pablo Ave (Emeryville and West Oakland) | 1.9 | SR-24 |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 1.5 | College Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Ashby Ave from the west (Emeryville and I-80) | 1.5 | SR-24 then Telegraph Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Telegraph Ave from the north (Berkeley) | 1.4 | none near the study area |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Ashby Ave from the west (Emeryville and I-80) | 1.1 | Claremont Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Alcatraz Ave from the west (Emeryville side) | 1.0 | SR-24 then Telegraph Avenue |
| other pairs | | 9.4 | |

By the arterial these cars would otherwise use: SR-24 16 veh/h; Telegraph Avenue 11 veh/h; SR-24 then Claremont Avenue 8 veh/h; Claremont Avenue 6 veh/h; SR-24 then Claremont Avenue then College Avenue 5 veh/h; College Avenue then Alcatraz Avenue 3 veh/h.

### Hillegass Avenue SB

Observed (PM): 178 cars entered at the top (76 turned in from Alcatraz Ave west, 98 from the east, 4 came straight from the north), 79 drove the whole street, and 68% of the block's trips (109 veh/h) went to a freeway. ASSUMPTION: freeway-bound cars that did not join mid-street are 87 veh/h (109 x 178 / (178 + 44)), half of the 174 turn-ins; low = the whole-street share of the turn-ins (0.45), high = the freeway-bound share without the mid-street correction (0.63).

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Telegraph Ave, Alcatraz Ave west and West Berkeley traffic turning off Alcatraz Ave onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (76 turn-ins x 0.50) | 38 (34 to 48) | 14 | below |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (98 turn-ins x 0.50) | 49 (44 to 62) | 21 | below |
| Intents listed, together | | 87 (78 to 110) | 35 | |
| Other through cars (no intent listed) | | | 18 | |

Model through cars by origin and destination group (largest 12 of 27 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 13.3 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 10.8 | Claremont Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 8.1 | Telegraph Avenue |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 5.9 | College Avenue then Claremont Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 4.3 | Claremont Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | West Oakland to the southwest (Adeline St, Market St) | 3.0 | Alcatraz Avenue then Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Telegraph Ave to the south (downtown Oakland) | 2.7 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Berkeley hills to the northeast (Evergreen Ln, Gravatt Dr) | 1.0 | Alcatraz Avenue then Claremont Avenue |
| College Ave from the north (Berkeley) | Telegraph Ave to the south (downtown Oakland) | 0.7 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-13 Warren Freeway (via SR-24 east) | 0.4 | Alcatraz Avenue then College Avenue |
| Telegraph Ave from the north (Berkeley) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 0.4 | College Avenue |
| Alcatraz Ave from the west (Emeryville side) | Berkeley hills to the northeast (Evergreen Ln, Gravatt Dr) | 0.3 | Alcatraz Avenue then Claremont Avenue |
| other pairs | | 2.1 | |

By the arterial these cars would otherwise use: Telegraph Avenue 25 veh/h; Claremont Avenue then SR-24 15 veh/h; College Avenue then Claremont Avenue then SR-24 6 veh/h; Alcatraz Avenue then Telegraph Avenue 3 veh/h; Alcatraz Avenue then Claremont Avenue 1 veh/h; Alcatraz Avenue then College Avenue 1 veh/h.

### Colby Street SB

Observed (PM): 139 cars entered at the top (76 from Alcatraz Ave west, 50 from the east, 13 from the north), 39 drove the whole street, 45% of the block's trips (72 veh/h) went to a freeway and 22% came by way of Telegraph Ave. ASSUMPTION: freeway-bound cars that did not join mid-street are 46 veh/h (72 x 139 / (139 + 79)), 0.365 of the 126 turn-ins; low = the whole-street share (0.31), high = the unadjusted freeway share (0.57). The Telegraph Ave cars are the 22% x 160 = 35 of the 76 west turn-ins.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Southbound Telegraph Ave traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (35 Telegraph Ave cars x 0.365) | 13 (11 to 20) | 18 | within |
| Alcatraz Ave west, Ashby Ave and West Berkeley traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (41 other west turn-ins x 0.365) | 15 (13 to 23) | 16 | within |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (50 east turn-ins x 0.365) | 18 (15 to 29) | 17 | within |
| Intents listed, together | | 46 (39 to 72) | 51 | |
| Other through cars (no intent listed) | | | 27 | |

Model through cars by origin and destination group (largest 12 of 42 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 16.5 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 15.3 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 11.2 | Alcatraz Avenue then College Avenue then Claremont Avenue |
| Shattuck Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 7.9 | none near the study area |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Telegraph Ave to the south (downtown Oakland) | 4.1 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | West Oakland to the southwest (Adeline St, Market St) | 2.9 | Alcatraz Avenue then Telegraph Avenue |
| Ashby Ave from the west (Emeryville and I-80) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 2.5 | SR-24 |
| Ashby Ave from the west (Emeryville and I-80) | SR-13 Warren Freeway (via SR-24 east) | 2.2 | SR-24 |
| Alcatraz Ave from the west (Emeryville side) | SR-13 Warren Freeway (via SR-24 east) | 2.1 | SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 2.1 | Telegraph Avenue then Alcatraz Avenue then Claremont Avenue |
| Alcatraz Ave from the west (Emeryville side) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 1.5 | SR-24 |
| Telegraph Ave from the north (Berkeley) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 1.5 | none near the study area |
| other pairs | | 9.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 37 veh/h; Alcatraz Avenue then College Avenue then Claremont Avenue 12 veh/h; none near the study area 10 veh/h; SR-24 8 veh/h; Alcatraz Avenue then Telegraph Avenue 3 veh/h; Telegraph Avenue then Alcatraz Avenue then Claremont Avenue 2 veh/h.

### Study area, all residential and service streets

Model: 437 through cars per hour.

Model through cars by origin and destination group (largest 12 of 100 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 36.1 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 35.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) | 29.6 | Claremont Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 28.8 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 26.4 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 22.4 | Alcatraz Avenue then College Avenue then Claremont Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Emeryville and West Oakland streets (55th to 67th Streets) | 20.5 | Claremont Avenue |
| Telegraph Ave to the south (downtown Oakland) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 18.2 | Telegraph Avenue then Alcatraz Avenue then College Avenue |
| Telegraph Ave to the south (downtown Oakland) | SR-24 westbound on-ramps (toward Oakland and I-980) | 17.3 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave to the south (downtown Oakland) | 16.9 | Claremont Avenue then Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 13.7 | SR-24 |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | San Pablo Ave (Emeryville and West Oakland) | 11.4 | Claremont Avenue |
| other pairs | | 160.8 | |

By the arterial these cars would otherwise use: Telegraph Avenue 176 veh/h; Claremont Avenue 82 veh/h; SR-24 28 veh/h; Alcatraz Avenue then College Avenue then Claremont Avenue 26 veh/h; Telegraph Avenue then Alcatraz Avenue then College Avenue 18 veh/h; none near the study area 18 veh/h.

By origin group: South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 110; Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 84; SR-24 eastbound off-ramps (arriving from Oakland and I-980) 74; Telegraph Ave to the south (downtown Oakland) 47; Telegraph Ave from the north (Berkeley) 41; SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) 18; Claremont Ave and Tunnel Rd toward the hills 15; West Oakland to the southwest (Adeline St, Market St) 9; College Ave from the north (Berkeley) 9; Shattuck Ave from the north (Berkeley) 8.

By destination group: SR-24 westbound on-ramps (toward Oakland and I-980) 113; Telegraph Ave from the north (Berkeley) 58; South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 48; Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 40; West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) 31; Telegraph Ave to the south (downtown Oakland) 25; Emeryville and West Oakland streets (55th to 67th Streets) 24; Claremont Ave and Tunnel Rd toward the hills 21; San Pablo Ave (Emeryville and West Oakland) 17; Ashby Ave from the west (Emeryville and I-80) 15.


Per-seed detail: `rockridge-am_peak-s1-seed1.md` (seed 1 in full).
