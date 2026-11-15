# rockridge-midday-s1 over 10 seeds (1, 2, 3, 4, 5, 6, 7, 8, 9, 10)

Seeds are the fixed list above, none chosen; each run is 60 minutes from the same start. Interval = 95% interval of the mean (Student t, n - 1 degrees of freedom). Run-to-run noise only: demand is fixed, so day-to-day variation is not in these intervals.

## Stability rule (design decision D16)

| Check | Rule | Result | Pass |
| --- | --- | --- | --- |
| Removals | mean per hour below 1.00 | 0.00 (min 0.00, max 0.00) | yes |
| Entry backlog | below 2.0% in at least 90% of seeds | 10 of 10 seeds | yes |
| Runaway growth | no seed adds more than 2.0 points of backlog in the second half | none | yes |
| Arterial speed | mean above 4.0 m/s | 9.62 m/s | yes |

**Verdict: stable.** Old rule (zero removals, backlog under 2%, speed above 4 m/s, every seed): 10 of 10 seeds pass.

## Metrics over seeds

| Group | Metric | Unit | Mean | SD | Min | Max | 95% interval |
| --- | --- | --- | --- | --- | --- | --- | --- |
| health | gridlock removals | vehicles | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| health | gridlock removals per hour | veh/h | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| health | entry backlog | % of spawned | 0.00 | 0.00 | 0.00 | 0.01 | -0.00 to 0.01 |
| health | backlog growth in the second half of the run | points of spawned | -0.00 | 0.01 | -0.01 | 0.01 | -0.01 to 0.00 |
| health | completed trips | trips | 16121.10 | 167.52 | 15828.00 | 16336.00 | 16001.27 to 16240.93 |
| health | arterial mean speed | m/s | 9.62 | 0.07 | 9.49 | 9.71 | 9.57 to 9.67 |
| health | arterial mean speed, last 15 min | m/s | 9.67 | 0.11 | 9.54 | 9.88 | 9.59 to 9.75 |
| junction recovery | courtesy admissions per hour | veh/h | 50.70 | 7.73 | 38.00 | 62.00 | 45.17 to 56.23 |
| junction recovery | yield fallback admissions per hour | veh/h | 13.30 | 4.11 | 7.00 | 22.00 | 10.36 to 16.24 |
| junction recovery | conflict bypass admissions per hour | veh/h | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| junction recovery | vehicles removed while held in a node, per hour | veh/h | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| cut-through | local vehicle-miles, surface gates to the freeway | veh-miles | 22.20 | 3.53 | 17.48 | 29.59 | 19.68 to 24.73 |
| cut-through | share of local vehicle-miles, surface gates to the freeway | % | 8.2 | 1.1 | 6.6 | 10.2 | 7.4 to 9.0 |
| cut-through | local vehicle-miles, freeway to the surface gates | veh-miles | 21.25 | 3.14 | 17.61 | 28.41 | 19.00 to 23.49 |
| cut-through | share of local vehicle-miles, freeway to the surface gates | % | 7.8 | 1.0 | 6.6 | 10.0 | 7.1 to 8.6 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue N | trips | 32.30 | 8.58 | 20.00 | 46.00 | 26.16 to 38.44 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue N | trips | 889.70 | 37.64 | 807.00 | 952.00 | 862.77 to 916.63 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue S | trips | 39.60 | 4.45 | 31.00 | 44.00 | 36.42 to 42.78 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue S | trips | 937.40 | 34.90 | 902.00 | 1002.00 | 912.43 to 962.37 |
| headline share | Hillegass Avenue NB from freeway | % | 52.2 | 4.1 | 46.3 | 57.8 | 49.3 to 55.2 |
| share | Hillegass Avenue NB to Benvenue Avenue | % | 2.6 | 1.2 | 1.4 | 5.0 | 1.8 to 3.5 |
| share | Hillegass Avenue NB to College Avenue | % | 14.7 | 3.5 | 6.8 | 17.7 | 12.3 to 17.2 |
| share | Hillegass Avenue NB to Alcatraz Avenue WB | % | 26.2 | 3.5 | 21.6 | 32.4 | 23.7 to 28.7 |
| headline share | Colby Street NB from freeway | % | 36.0 | 2.0 | 32.4 | 39.5 | 34.5 to 37.4 |
| share | Colby Street NB to Alcatraz Avenue WB | % | 51.3 | 3.0 | 47.0 | 55.5 | 49.2 to 53.4 |
| share | Colby Street NB to Telegraph Avenue | % | 37.3 | 4.6 | 27.9 | 45.6 | 34.0 to 40.6 |
| share | Colby Street NB to College Avenue | % | 6.1 | 1.8 | 4.1 | 8.8 | 4.8 to 7.4 |
| share | Hillegass Avenue SB from Alcatraz Avenue WB | % | 27.8 | 3.0 | 22.1 | 32.3 | 25.7 to 30.0 |
| share | Hillegass Avenue SB from Benvenue Avenue | % | 3.0 | 1.3 | 0.8 | 5.5 | 2.1 to 4.0 |
| share | Hillegass Avenue SB from College Avenue | % | 12.7 | 3.1 | 8.4 | 17.7 | 10.5 to 14.9 |
| headline share | Hillegass Avenue SB to freeway | % | 54.3 | 3.8 | 47.0 | 59.8 | 51.6 to 57.0 |
| share | Colby Street SB from Alcatraz Avenue EB | % | 19.7 | 2.9 | 14.7 | 24.2 | 17.6 to 21.8 |
| share | Colby Street SB from Alcatraz Avenue WB | % | 17.6 | 2.9 | 13.7 | 24.1 | 15.6 to 19.7 |
| share | Colby Street SB from Telegraph Avenue | % | 19.6 | 4.0 | 14.7 | 27.0 | 16.8 to 22.5 |
| headline share | Colby Street SB to freeway | % | 43.4 | 3.9 | 37.2 | 51.2 | 40.6 to 46.2 |
| share | Colby Street SB to Forest Street | % | 13.5 | 4.1 | 7.7 | 21.2 | 10.6 to 16.5 |
| ramp share | onto freeway via College Avenue | % | 17.5 | 2.4 | 14.4 | 20.7 | 15.8 to 19.2 |
| ramp share | onto freeway via Hillegass Avenue | % | 15.3 | 1.9 | 12.8 | 18.2 | 14.0 to 16.7 |
| ramp share | onto freeway via Martin Street | % | 16.2 | 1.6 | 14.2 | 18.4 | 15.1 to 17.4 |
| ramp share | onto freeway via Colby Street | % | 12.6 | 2.0 | 10.0 | 16.6 | 11.2 to 14.0 |
| ramp share | onto freeway via Telegraph Avenue north of Alcatraz Avenue | % | 9.0 | 0.9 | 7.9 | 10.8 | 8.4 to 9.7 |
| ramp share | onto freeway via Benvenue Avenue | % | 4.5 | 1.1 | 2.5 | 6.5 | 3.7 to 5.2 |
| ramp share | from freeway via College Avenue | % | 10.8 | 2.0 | 8.1 | 14.2 | 9.4 to 12.2 |
| ramp share | from freeway via Martin Street | % | 11.1 | 1.5 | 8.4 | 13.0 | 10.1 to 12.2 |
| ramp share | from freeway via Colby Street | % | 10.9 | 1.3 | 9.1 | 13.7 | 10.0 to 11.8 |
| ramp share | from freeway via Hillegass Avenue | % | 7.8 | 1.6 | 5.5 | 10.1 | 6.6 to 8.9 |
| ramp share | from freeway via Benvenue Avenue | % | 2.7 | 1.4 | 1.3 | 5.2 | 1.7 to 3.7 |
| corridor flow | Telegraph N median link flow | veh/h | 567.96 | 21.65 | 538.80 | 604.80 | 552.47 to 583.45 |
| corridor flow | Telegraph S median link flow | veh/h | 468.36 | 32.34 | 411.60 | 512.40 | 445.23 to 491.49 |
| corridor flow | College N median link flow | veh/h | 249.24 | 22.82 | 207.60 | 274.80 | 232.92 to 265.56 |
| corridor flow | College S median link flow | veh/h | 429.12 | 28.98 | 382.80 | 486.00 | 408.39 to 449.85 |
| corridor flow | Claremont N median link flow | veh/h | 303.24 | 16.15 | 279.60 | 332.40 | 291.69 to 314.79 |
| corridor flow | Claremont S median link flow | veh/h | 221.76 | 19.65 | 182.40 | 246.00 | 207.70 to 235.82 |
| corridor flow | Alcatraz E median link flow | veh/h | 369.36 | 19.00 | 338.40 | 411.60 | 355.77 to 382.95 |
| corridor flow | Alcatraz W median link flow | veh/h | 235.44 | 17.67 | 216.00 | 264.00 | 222.80 to 248.08 |
| corridor flow | Hillegass N median link flow | veh/h | 80.16 | 9.05 | 66.00 | 92.40 | 73.69 to 86.63 |
| corridor flow | Hillegass S median link flow | veh/h | 85.68 | 10.26 | 66.00 | 98.40 | 78.34 to 93.02 |
| corridor flow | Colby N median link flow | veh/h | 92.28 | 12.16 | 73.20 | 112.80 | 83.58 to 100.98 |
| corridor flow | Colby S median link flow | veh/h | 84.00 | 12.81 | 58.80 | 103.20 | 74.84 to 93.16 |
| corridor flow | Martin E median link flow | veh/h | 101.52 | 9.77 | 86.40 | 121.20 | 94.53 to 108.51 |
| corridor flow | Martin W median link flow | veh/h | 65.04 | 8.04 | 50.40 | 75.60 | 59.29 to 70.79 |

## Intent map: through cars by where they come from and where they are going

Through = neither trip end is in the study area. Groups are the approach groups of the area config (data/areas); a node that is not a gate takes the group of the nearest surface gate (ASSUMPTION). The arterial is the one a trip would use on the shortest free-flow path with the study area's residential and service streets closed, where that path runs on a boundary street near the study area.

Model figures are the mean of 10 seed(s), per hour of the run. Basis: OBSERVED = read from the resident volunteer count of Feb 25, 2025 or its headline shares; ASSUMPTION = inferred from those numbers or chosen.

### Colby Street NB

Observed (PM): 182 cars entered at the south end, 102 drove the whole street, 164 left it at Alcatraz Ave (131 left, 32 right, 1 straight), and 47% of the block's trips came from a freeway (the headline share). ASSUMPTION: freeway-origin cars that do not end along the street are 65 veh/h (the 82 freeway-origin trips on the block, 47% of 174, times the 182 / (182 + 47) of its cars that entered at the south end rather than joining on the way), spread over the 164 exits in proportion (0.40); the other through cars come from the Telegraph Ave and south-side approaches that feed the street's south end. Ranges: low = 131 (32) x 0.47 x 0.62 (the whole-street share of exits), high = 131 (32) x 0.47.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | OBSERVED turn count x ASSUMPTION share (131 left turns x 0.40) | 52 (38 to 62) | 37 | below |
| Telegraph Ave and south-side traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | ASSUMPTION: the through left-turners (131 x 0.62 = 81) that are not off-ramp traffic | 29 (19 to 43) | 19 | within |
| SR-24 off-ramp traffic using Colby St to reach College Ave and Berkeley (right at Alcatraz Ave) | OBSERVED turn count x ASSUMPTION share (32 right turns x 0.40) | 13 (9 to 15) | 4 | below |
| Telegraph Ave and south-side traffic using Colby St to reach College Ave and Berkeley | ASSUMPTION: the through right-turners (32 x 0.62 = 20) that are not off-ramp traffic | 7 (5 to 11) | 8 | within |
| Intents listed, together | | 101 (71 to 131) | 68 | |
| Other through cars (no intent listed) | | | 4 | |

Model through cars by origin and destination group (largest 12 of 37 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 37.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Ashby Ave from the west (Emeryville and I-80) | 5.7 | none near the study area |
| Telegraph Ave to the south (downtown Oakland) | Telegraph Ave from the north (Berkeley) | 5.7 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 4.6 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 3.2 | Claremont Avenue then College Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 2.7 | Telegraph Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Telegraph Ave from the north (Berkeley) | 2.4 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | College Ave from the north (Berkeley) | 1.5 | SR-24 then Claremont Avenue then College Avenue |
| College Ave from the north (Berkeley) | Alcatraz Ave from the west (Emeryville side) | 1.0 | College Avenue then Alcatraz Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) | 1.0 | none near the study area |
| West Oakland to the southwest (Adeline St, Market St) | Claremont Ave and Tunnel Rd toward the hills | 0.8 | Claremont Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 0.5 | Telegraph Avenue |
| other pairs | | 5.5 | |

By the arterial these cars would otherwise use: Telegraph Avenue 54 veh/h; none near the study area 7 veh/h; Claremont Avenue then College Avenue 3 veh/h; Claremont Avenue 2 veh/h; College Avenue then Alcatraz Avenue 2 veh/h; SR-24 then Claremont Avenue then College Avenue 2 veh/h.

### Hillegass Avenue NB

Observed (PM): 94 cars entered at the south end, 48 drove the whole street, 109 left it at Alcatraz Ave (43 west, 54 east, 12 straight), and 47% of the block's trips came from a freeway. ASSUMPTION: freeway-origin through cars are 40 veh/h (52 freeway-origin trips times 94 / (94 + 29)), spread over the exits in proportion (0.37); the through share of exits is 48 / 109 = 0.44.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Hillegass Ave to reach Alcatraz Ave west and Telegraph Ave north | OBSERVED turn count x ASSUMPTION share (43 left turns x 0.37) | 16 (9 to 20) | 11 | within |
| SR-24 off-ramp traffic using Hillegass Ave to reach College Ave and Berkeley | OBSERVED turn count x ASSUMPTION share (54 right turns x 0.37) | 20 (11 to 25) | 23 | within |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach Alcatraz Ave west | ASSUMPTION: through exits (43 x 0.44) that are not off-ramp traffic | 3 (0 to 10) | 4 | within |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach College Ave and Berkeley | ASSUMPTION: through exits (54 x 0.44) that are not off-ramp traffic | 4 (0 to 13) | 13 | within |
| Intents listed, together | | 43 (20 to 68) | 51 | |
| Other through cars (no intent listed) | | | 5 | |

Model through cars by origin and destination group (largest 12 of 41 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 13.8 | SR-24 |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 7.7 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 7.2 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | College Ave from the north (Berkeley) | 4.6 | SR-24 then Claremont Avenue then College Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 3.6 | SR-24 then Claremont Avenue |
| Telegraph Ave to the south (downtown Oakland) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 2.2 | Telegraph Avenue |
| College Ave from the north (Berkeley) | Alcatraz Ave from the west (Emeryville side) | 1.9 | College Avenue then Alcatraz Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Ashby Ave from the west (Emeryville and I-80) | 1.9 | SR-24 then Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 1.4 | College Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Telegraph Ave from the north (Berkeley) | 1.3 | none near the study area |
| Telegraph Ave to the south (downtown Oakland) | Claremont Ave and Tunnel Rd toward the hills | 1.1 | Claremont Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | San Pablo Ave (Emeryville and West Oakland) | 0.7 | SR-24 |
| other pairs | | 7.7 | |

By the arterial these cars would otherwise use: Telegraph Avenue 18 veh/h; SR-24 15 veh/h; SR-24 then Claremont Avenue then College Avenue 5 veh/h; Claremont Avenue 4 veh/h; SR-24 then Claremont Avenue 4 veh/h; College Avenue then Alcatraz Avenue 3 veh/h.

### Hillegass Avenue SB

Observed (PM): 178 cars entered at the top (76 turned in from Alcatraz Ave west, 98 from the east, 4 came straight from the north), 79 drove the whole street, and 68% of the block's trips (109 veh/h) went to a freeway. ASSUMPTION: freeway-bound cars that did not join mid-street are 87 veh/h (109 x 178 / (178 + 44)), half of the 174 turn-ins; low = the whole-street share of the turn-ins (0.45), high = the freeway-bound share without the mid-street correction (0.63).

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Telegraph Ave, Alcatraz Ave west and West Berkeley traffic turning off Alcatraz Ave onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (76 turn-ins x 0.50) | 38 (34 to 48) | 25 | below |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (98 turn-ins x 0.50) | 49 (44 to 62) | 32 | below |
| Intents listed, together | | 87 (78 to 110) | 58 | |
| Other through cars (no intent listed) | | | 15 | |

Model through cars by origin and destination group (largest 12 of 24 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 25.0 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 13.8 | Claremont Avenue then SR-24 |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 8.9 | College Avenue then Claremont Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 8.5 | Claremont Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 8.1 | Telegraph Avenue |
| Shattuck Ave from the north (Berkeley) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 1.9 | College Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 1.3 | Claremont Avenue |
| Telegraph Ave from the north (Berkeley) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 0.9 | Telegraph Avenue |
| Emeryville and West Oakland streets (55th to 67th Streets) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 0.6 | Alcatraz Avenue then College Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Berkeley hills to the northeast (Evergreen Ln, Gravatt Dr) | 0.5 | Alcatraz Avenue then Claremont Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Telegraph Ave to the south (downtown Oakland) | 0.5 | Claremont Avenue |
| Ashby Ave from the west (Emeryville and I-80) | Berkeley hills to the northeast (Evergreen Ln, Gravatt Dr) | 0.4 | SR-24 |
| other pairs | | 1.9 | |

By the arterial these cars would otherwise use: Telegraph Avenue 34 veh/h; Claremont Avenue then SR-24 22 veh/h; College Avenue then Claremont Avenue then SR-24 9 veh/h; Claremont Avenue 3 veh/h; College Avenue 2 veh/h; Alcatraz Avenue then Claremont Avenue 1 veh/h.

### Colby Street SB

Observed (PM): 139 cars entered at the top (76 from Alcatraz Ave west, 50 from the east, 13 from the north), 39 drove the whole street, 45% of the block's trips (72 veh/h) went to a freeway and 22% came by way of Telegraph Ave. ASSUMPTION: freeway-bound cars that did not join mid-street are 46 veh/h (72 x 139 / (139 + 79)), 0.365 of the 126 turn-ins; low = the whole-street share (0.31), high = the unadjusted freeway share (0.57). The Telegraph Ave cars are the 22% x 160 = 35 of the 76 west turn-ins.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Southbound Telegraph Ave traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (35 Telegraph Ave cars x 0.365) | 13 (11 to 20) | 11 | within |
| Alcatraz Ave west, Ashby Ave and West Berkeley traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (41 other west turn-ins x 0.365) | 15 (13 to 23) | 8 | below |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (50 east turn-ins x 0.365) | 18 (15 to 29) | 26 | within |
| Intents listed, together | | 46 (39 to 72) | 44 | |
| Other through cars (no intent listed) | | | 38 | |

Model through cars by origin and destination group (largest 12 of 48 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 19.5 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 12.8 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 10.3 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 8.0 | Claremont Avenue then SR-24 |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 3.8 | College Avenue then Claremont Avenue then SR-24 |
| Shattuck Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 2.9 | none near the study area |
| Ashby Ave from the west (Emeryville and I-80) | SR-13 Warren Freeway (via SR-24 east) | 2.6 | SR-24 |
| Telegraph Ave from the north (Berkeley) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 2.4 | Telegraph Avenue |
| Emeryville and West Oakland streets (55th to 67th Streets) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 1.9 | Claremont Avenue |
| Berkeley hills to the northeast (Evergreen Ln, Gravatt Dr) | West Oakland to the southwest (Adeline St, Market St) | 1.6 | Claremont Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Telegraph Ave to the south (downtown Oakland) | 1.3 | Claremont Avenue |
| Ashby Ave from the west (Emeryville and I-80) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 1.2 | SR-24 |
| other pairs | | 13.7 | |

By the arterial these cars would otherwise use: Telegraph Avenue 45 veh/h; Claremont Avenue 8 veh/h; Claremont Avenue then SR-24 8 veh/h; SR-24 5 veh/h; none near the study area 5 veh/h; College Avenue then Claremont Avenue then SR-24 4 veh/h.

### Study area, all residential and service streets

Model: 392 through cars per hour.

Model through cars by origin and destination group (largest 12 of 108 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 50.8 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 47.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 44.0 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 31.0 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 19.2 | Claremont Avenue then SR-24 |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 18.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 16.7 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 14.0 | SR-24 |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 10.8 | College Avenue then Claremont Avenue then SR-24 |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 10.1 | Claremont Avenue then College Avenue |
| Emeryville and West Oakland streets (55th to 67th Streets) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 8.2 | Claremont Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Ashby Ave from the west (Emeryville and I-80) | 8.0 | none near the study area |
| other pairs | | 114.4 | |

By the arterial these cars would otherwise use: Telegraph Avenue 237 veh/h; Claremont Avenue 28 veh/h; SR-24 24 veh/h; Claremont Avenue then SR-24 19 veh/h; none near the study area 17 veh/h; Claremont Avenue then College Avenue 14 veh/h.

By origin group: Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 113; SR-24 eastbound off-ramps (arriving from Oakland and I-980) 81; South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 44; Telegraph Ave from the north (Berkeley) 39; Claremont Ave and Tunnel Rd toward the hills 22; Telegraph Ave to the south (downtown Oakland) 18; College Ave from the north (Berkeley) 16; Emeryville and West Oakland streets (55th to 67th Streets) 15; West Oakland to the southwest (Adeline St, Market St) 11; Shattuck Ave from the north (Berkeley) 10.

By destination group: SR-24 westbound on-ramps (toward Oakland and I-980) 118; South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 71; Telegraph Ave from the north (Berkeley) 65; Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 47; Claremont Ave and Tunnel Rd toward the hills 29; College Ave from the north (Berkeley) 12; Ashby Ave from the west (Emeryville and I-80) 11; West Oakland to the southwest (Adeline St, Market St) 6; San Pablo Ave (Emeryville and West Oakland) 6; Berkeley hills to the northeast (Evergreen Ln, Gravatt Dr) 5.


Per-seed detail: `rockridge-midday-s1-seed1.md` (seed 1 in full).
