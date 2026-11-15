# rockridge-midday-s1 over 10 seeds (1, 2, 3, 4, 5, 6, 7, 8, 9, 10)

Seeds are the fixed list above, none chosen; each run is 60 minutes from the same start. Interval = 95% interval of the mean (Student t, n - 1 degrees of freedom). Run-to-run noise only: demand is fixed, so day-to-day variation is not in these intervals.

## Stability rule (design decision D16)

| Check | Rule | Result | Pass |
| --- | --- | --- | --- |
| Removals | mean per hour below 1.00 | 0.00 (min 0.00, max 0.00) | yes |
| Entry backlog | below 2.0% in at least 90% of seeds | 10 of 10 seeds | yes |
| Runaway growth | no seed adds more than 2.0 points of backlog in the second half | none | yes |
| Arterial speed | mean above 4.0 m/s | 9.81 m/s | yes |

**Verdict: stable.** Old rule (zero removals, backlog under 2%, speed above 4 m/s, every seed): 10 of 10 seeds pass.

## Metrics over seeds

| Group | Metric | Unit | Mean | SD | Min | Max | 95% interval |
| --- | --- | --- | --- | --- | --- | --- | --- |
| health | gridlock removals | vehicles | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| health | gridlock removals per hour | veh/h | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| health | entry backlog | % of spawned | 0.01 | 0.00 | 0.00 | 0.01 | 0.00 to 0.01 |
| health | backlog growth in the second half of the run | points of spawned | -0.00 | 0.01 | -0.02 | 0.01 | -0.01 to 0.00 |
| health | completed trips | trips | 16144.30 | 169.22 | 15839.00 | 16339.00 | 16023.25 to 16265.35 |
| health | arterial mean speed | m/s | 9.81 | 0.05 | 9.76 | 9.89 | 9.78 to 9.85 |
| health | arterial mean speed, last 15 min | m/s | 9.86 | 0.08 | 9.73 | 9.96 | 9.80 to 9.92 |
| junction recovery | courtesy admissions per hour | veh/h | 39.50 | 8.93 | 30.00 | 59.00 | 33.11 to 45.89 |
| junction recovery | yield fallback admissions per hour | veh/h | 7.80 | 2.86 | 3.00 | 13.00 | 5.75 to 9.85 |
| junction recovery | conflict bypass admissions per hour | veh/h | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| junction recovery | vehicles removed while held in a node, per hour | veh/h | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| cut-through | local vehicle-miles, surface gates to the freeway | veh-miles | 22.09 | 3.01 | 17.00 | 28.01 | 19.93 to 24.24 |
| cut-through | share of local vehicle-miles, surface gates to the freeway | % | 8.2 | 0.8 | 6.7 | 9.5 | 7.6 to 8.8 |
| cut-through | local vehicle-miles, freeway to the surface gates | veh-miles | 21.47 | 3.01 | 18.57 | 28.22 | 19.31 to 23.62 |
| cut-through | share of local vehicle-miles, freeway to the surface gates | % | 8.0 | 1.0 | 6.9 | 10.1 | 7.3 to 8.7 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue N | trips | 32.40 | 7.82 | 22.00 | 43.00 | 26.81 to 37.99 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue N | trips | 890.70 | 39.20 | 801.00 | 954.00 | 862.66 to 918.74 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue S | trips | 41.00 | 2.54 | 37.00 | 44.00 | 39.18 to 42.82 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue S | trips | 935.30 | 35.72 | 888.00 | 1001.00 | 909.75 to 960.85 |
| headline share | Hillegass Avenue NB from freeway | % | 51.6 | 4.6 | 46.3 | 59.4 | 48.4 to 54.9 |
| share | Hillegass Avenue NB to Benvenue Avenue | % | 2.6 | 1.5 | 0.8 | 5.8 | 1.5 to 3.7 |
| share | Hillegass Avenue NB to College Avenue | % | 13.8 | 3.5 | 6.2 | 18.3 | 11.3 to 16.2 |
| share | Hillegass Avenue NB to Alcatraz Avenue WB | % | 26.5 | 3.1 | 22.6 | 32.4 | 24.3 to 28.7 |
| headline share | Colby Street NB from freeway | % | 36.0 | 2.2 | 32.4 | 38.5 | 34.4 to 37.5 |
| share | Colby Street NB to Alcatraz Avenue WB | % | 52.2 | 3.7 | 45.6 | 58.2 | 49.5 to 54.8 |
| share | Colby Street NB to Telegraph Avenue | % | 37.6 | 5.3 | 26.9 | 46.0 | 33.8 to 41.4 |
| share | Colby Street NB to College Avenue | % | 6.2 | 1.2 | 4.6 | 7.7 | 5.4 to 7.1 |
| share | Hillegass Avenue SB from Alcatraz Avenue WB | % | 28.2 | 4.0 | 21.1 | 34.1 | 25.3 to 31.1 |
| share | Hillegass Avenue SB from Benvenue Avenue | % | 3.0 | 1.0 | 1.6 | 5.0 | 2.4 to 3.7 |
| share | Hillegass Avenue SB from College Avenue | % | 13.0 | 3.3 | 8.3 | 18.9 | 10.7 to 15.4 |
| headline share | Hillegass Avenue SB to freeway | % | 55.0 | 4.7 | 47.8 | 61.9 | 51.7 to 58.4 |
| share | Colby Street SB from Alcatraz Avenue EB | % | 20.5 | 2.7 | 16.2 | 24.7 | 18.6 to 22.4 |
| share | Colby Street SB from Alcatraz Avenue WB | % | 17.0 | 2.8 | 11.3 | 21.7 | 14.9 to 19.0 |
| share | Colby Street SB from Telegraph Avenue | % | 19.8 | 3.2 | 14.5 | 23.8 | 17.5 to 22.1 |
| headline share | Colby Street SB to freeway | % | 42.6 | 4.7 | 34.5 | 50.3 | 39.3 to 46.0 |
| share | Colby Street SB to Forest Street | % | 15.6 | 3.7 | 11.6 | 21.9 | 12.9 to 18.2 |
| ramp share | onto freeway via College Avenue | % | 17.2 | 2.0 | 13.5 | 19.7 | 15.8 to 18.7 |
| ramp share | onto freeway via Hillegass Avenue | % | 15.8 | 1.9 | 13.3 | 18.8 | 14.4 to 17.1 |
| ramp share | onto freeway via Martin Street | % | 15.4 | 1.9 | 12.9 | 18.8 | 14.1 to 16.8 |
| ramp share | onto freeway via Colby Street | % | 12.2 | 2.1 | 8.7 | 15.3 | 10.7 to 13.6 |
| ramp share | onto freeway via Telegraph Avenue north of Alcatraz Avenue | % | 9.2 | 0.9 | 8.0 | 10.7 | 8.6 to 9.8 |
| ramp share | onto freeway via Benvenue Avenue | % | 4.5 | 1.1 | 2.5 | 6.6 | 3.8 to 5.3 |
| ramp share | from freeway via College Avenue | % | 10.4 | 1.7 | 8.5 | 13.2 | 9.2 to 11.6 |
| ramp share | from freeway via Martin Street | % | 11.5 | 1.9 | 9.4 | 14.7 | 10.1 to 12.8 |
| ramp share | from freeway via Colby Street | % | 11.0 | 1.2 | 8.8 | 13.7 | 10.2 to 11.9 |
| ramp share | from freeway via Hillegass Avenue | % | 7.7 | 1.7 | 5.4 | 10.1 | 6.5 to 8.9 |
| ramp share | from freeway via Benvenue Avenue | % | 2.7 | 1.4 | 1.3 | 5.2 | 1.6 to 3.7 |
| corridor flow | Telegraph N median link flow | veh/h | 552.60 | 33.79 | 492.00 | 606.00 | 528.43 to 576.77 |
| corridor flow | Telegraph S median link flow | veh/h | 413.52 | 33.93 | 364.80 | 471.60 | 389.25 to 437.79 |
| corridor flow | College N median link flow | veh/h | 244.32 | 26.38 | 202.80 | 286.80 | 225.45 to 263.19 |
| corridor flow | College S median link flow | veh/h | 433.44 | 28.20 | 402.00 | 494.40 | 413.27 to 453.61 |
| corridor flow | Claremont N median link flow | veh/h | 308.64 | 17.90 | 282.00 | 331.20 | 295.84 to 321.44 |
| corridor flow | Claremont S median link flow | veh/h | 223.08 | 25.16 | 188.40 | 250.80 | 205.08 to 241.08 |
| corridor flow | Alcatraz E median link flow | veh/h | 373.20 | 24.44 | 337.20 | 418.80 | 355.72 to 390.68 |
| corridor flow | Alcatraz W median link flow | veh/h | 235.20 | 12.81 | 224.40 | 261.60 | 226.04 to 244.36 |
| corridor flow | Hillegass N median link flow | veh/h | 80.76 | 10.45 | 68.40 | 94.80 | 73.29 to 88.23 |
| corridor flow | Hillegass S median link flow | veh/h | 85.44 | 10.60 | 67.20 | 98.40 | 77.86 to 93.02 |
| corridor flow | Colby N median link flow | veh/h | 93.48 | 9.54 | 82.80 | 111.60 | 86.66 to 100.30 |
| corridor flow | Colby S median link flow | veh/h | 79.68 | 10.23 | 55.20 | 94.80 | 72.36 to 87.00 |
| corridor flow | Martin E median link flow | veh/h | 99.96 | 17.92 | 74.40 | 126.00 | 87.14 to 112.78 |
| corridor flow | Martin W median link flow | veh/h | 63.60 | 11.89 | 50.40 | 82.80 | 55.09 to 72.11 |

## Intent map: through cars by where they come from and where they are going

Through = neither trip end is in the study area. Groups are the approach groups of the area config (data/areas); a node that is not a gate takes the group of the nearest surface gate (ASSUMPTION). The arterial is the one a trip would use on the shortest free-flow path with the study area's residential and service streets closed, where that path runs on a boundary street near the study area.

Model figures are the mean of 10 seed(s), per hour of the run. Basis: OBSERVED = read from the resident volunteer count of Feb 25, 2025 or its headline shares; ASSUMPTION = inferred from those numbers or chosen.

### Colby Street NB

Observed (PM): 182 cars entered at the south end, 102 drove the whole street, 164 left it at Alcatraz Ave (131 left, 32 right, 1 straight), and 47% of the block's trips came from a freeway (the headline share). ASSUMPTION: freeway-origin cars that do not end along the street are 65 veh/h (the 82 freeway-origin trips on the block, 47% of 174, times the 182 / (182 + 47) of its cars that entered at the south end rather than joining on the way), spread over the 164 exits in proportion (0.40); the other through cars come from the Telegraph Ave and south-side approaches that feed the street's south end. Ranges: low = 131 (32) x 0.47 x 0.62 (the whole-street share of exits), high = 131 (32) x 0.47.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | OBSERVED turn count x ASSUMPTION share (131 left turns x 0.40) | 52 (38 to 62) | 38 | within |
| Telegraph Ave and south-side traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | ASSUMPTION: the through left-turners (131 x 0.62 = 81) that are not off-ramp traffic | 29 (19 to 43) | 17 | below |
| SR-24 off-ramp traffic using Colby St to reach College Ave and Berkeley (right at Alcatraz Ave) | OBSERVED turn count x ASSUMPTION share (32 right turns x 0.40) | 13 (9 to 15) | 4 | below |
| Telegraph Ave and south-side traffic using Colby St to reach College Ave and Berkeley | ASSUMPTION: the through right-turners (32 x 0.62 = 20) that are not off-ramp traffic | 7 (5 to 11) | 7 | within |
| Intents listed, together | | 101 (71 to 131) | 66 | |
| Other through cars (no intent listed) | | | 3 | |

Model through cars by origin and destination group (largest 12 of 34 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 37.6 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Ashby Ave from the west (Emeryville and I-80) | 5.6 | none near the study area |
| Telegraph Ave to the south (downtown Oakland) | Telegraph Ave from the north (Berkeley) | 5.4 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 4.1 | Telegraph Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Telegraph Ave from the north (Berkeley) | 2.5 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 2.5 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 2.3 | Claremont Avenue then College Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | College Ave from the north (Berkeley) | 1.6 | SR-24 then Claremont Avenue then College Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) | 1.2 | none near the study area |
| College Ave from the north (Berkeley) | Alcatraz Ave from the west (Emeryville side) | 0.7 | College Avenue then Alcatraz Avenue |
| Telegraph Ave to the south (downtown Oakland) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 0.6 | Telegraph Avenue |
| San Pablo Ave (Emeryville and West Oakland) | Claremont Ave and Tunnel Rd toward the hills | 0.5 | Alcatraz Avenue then Claremont Avenue |
| other pairs | | 5.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 54 veh/h; none near the study area 7 veh/h; Claremont Avenue then College Avenue 2 veh/h; Claremont Avenue 2 veh/h; SR-24 then Claremont Avenue then College Avenue 2 veh/h; College Avenue then Alcatraz Avenue 1 veh/h.

### Hillegass Avenue NB

Observed (PM): 94 cars entered at the south end, 48 drove the whole street, 109 left it at Alcatraz Ave (43 west, 54 east, 12 straight), and 47% of the block's trips came from a freeway. ASSUMPTION: freeway-origin through cars are 40 veh/h (52 freeway-origin trips times 94 / (94 + 29)), spread over the exits in proportion (0.37); the through share of exits is 48 / 109 = 0.44.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Hillegass Ave to reach Alcatraz Ave west and Telegraph Ave north | OBSERVED turn count x ASSUMPTION share (43 left turns x 0.37) | 16 (9 to 20) | 11 | within |
| SR-24 off-ramp traffic using Hillegass Ave to reach College Ave and Berkeley | OBSERVED turn count x ASSUMPTION share (54 right turns x 0.37) | 20 (11 to 25) | 22 | within |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach Alcatraz Ave west | ASSUMPTION: through exits (43 x 0.44) that are not off-ramp traffic | 3 (0 to 10) | 4 | within |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach College Ave and Berkeley | ASSUMPTION: through exits (54 x 0.44) that are not off-ramp traffic | 4 (0 to 13) | 14 | above |
| Intents listed, together | | 43 (20 to 68) | 52 | |
| Other through cars (no intent listed) | | | 5 | |

Model through cars by origin and destination group (largest 12 of 43 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 13.7 | SR-24 |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 8.2 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 7.6 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | College Ave from the north (Berkeley) | 4.2 | SR-24 then Claremont Avenue then College Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 3.5 | SR-24 then Claremont Avenue |
| Telegraph Ave to the south (downtown Oakland) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 2.7 | Telegraph Avenue |
| College Ave from the north (Berkeley) | Alcatraz Ave from the west (Emeryville side) | 1.8 | College Avenue then Alcatraz Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Ashby Ave from the west (Emeryville and I-80) | 1.8 | SR-24 then Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 1.4 | College Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Telegraph Ave from the north (Berkeley) | 1.3 | none near the study area |
| Telegraph Ave to the south (downtown Oakland) | Claremont Ave and Tunnel Rd toward the hills | 1.0 | Claremont Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Emeryville and West Oakland streets (55th to 67th Streets) | 0.7 | Claremont Avenue then Alcatraz Avenue |
| other pairs | | 8.4 | |

By the arterial these cars would otherwise use: Telegraph Avenue 20 veh/h; SR-24 14 veh/h; SR-24 then Claremont Avenue then College Avenue 4 veh/h; SR-24 then Claremont Avenue 4 veh/h; College Avenue then Alcatraz Avenue 3 veh/h; Claremont Avenue 3 veh/h.

### Hillegass Avenue SB

Observed (PM): 178 cars entered at the top (76 turned in from Alcatraz Ave west, 98 from the east, 4 came straight from the north), 79 drove the whole street, and 68% of the block's trips (109 veh/h) went to a freeway. ASSUMPTION: freeway-bound cars that did not join mid-street are 87 veh/h (109 x 178 / (178 + 44)), half of the 174 turn-ins; low = the whole-street share of the turn-ins (0.45), high = the freeway-bound share without the mid-street correction (0.63).

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Telegraph Ave, Alcatraz Ave west and West Berkeley traffic turning off Alcatraz Ave onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (76 turn-ins x 0.50) | 38 (34 to 48) | 25 | below |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (98 turn-ins x 0.50) | 49 (44 to 62) | 33 | below |
| Intents listed, together | | 87 (78 to 110) | 57 | |
| Other through cars (no intent listed) | | | 16 | |

Model through cars by origin and destination group (largest 12 of 29 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 24.8 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 13.8 | Claremont Avenue then SR-24 |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 9.1 | College Avenue then Claremont Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 8.5 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 8.3 | Claremont Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 1.4 | Claremont Avenue |
| Shattuck Ave from the north (Berkeley) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 1.4 | College Avenue |
| Emeryville and West Oakland streets (55th to 67th Streets) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 0.9 | Alcatraz Avenue then College Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Berkeley hills to the northeast (Evergreen Ln, Gravatt Dr) | 0.7 | Alcatraz Avenue then Claremont Avenue |
| Telegraph Ave from the north (Berkeley) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 0.7 | Telegraph Avenue |
| Emeryville and West Oakland streets (55th to 67th Streets) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 0.6 | Claremont Avenue |
| Ashby Ave from the west (Emeryville and I-80) | Berkeley hills to the northeast (Evergreen Ln, Gravatt Dr) | 0.4 | SR-24 |
| other pairs | | 2.8 | |

By the arterial these cars would otherwise use: Telegraph Avenue 34 veh/h; Claremont Avenue then SR-24 22 veh/h; College Avenue then Claremont Avenue then SR-24 9 veh/h; Claremont Avenue 3 veh/h; College Avenue 2 veh/h; Alcatraz Avenue then College Avenue 1 veh/h.

### Colby Street SB

Observed (PM): 139 cars entered at the top (76 from Alcatraz Ave west, 50 from the east, 13 from the north), 39 drove the whole street, 45% of the block's trips (72 veh/h) went to a freeway and 22% came by way of Telegraph Ave. ASSUMPTION: freeway-bound cars that did not join mid-street are 46 veh/h (72 x 139 / (139 + 79)), 0.365 of the 126 turn-ins; low = the whole-street share (0.31), high = the unadjusted freeway share (0.57). The Telegraph Ave cars are the 22% x 160 = 35 of the 76 west turn-ins.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Southbound Telegraph Ave traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (35 Telegraph Ave cars x 0.365) | 13 (11 to 20) | 11 | within |
| Alcatraz Ave west, Ashby Ave and West Berkeley traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (41 other west turn-ins x 0.365) | 15 (13 to 23) | 8 | below |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (50 east turn-ins x 0.365) | 18 (15 to 29) | 24 | within |
| Intents listed, together | | 46 (39 to 72) | 42 | |
| Other through cars (no intent listed) | | | 36 | |

Model through cars by origin and destination group (largest 12 of 43 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 19.9 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 11.4 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 10.2 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 7.5 | Claremont Avenue then SR-24 |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 4.0 | College Avenue then Claremont Avenue then SR-24 |
| Shattuck Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 2.8 | none near the study area |
| Ashby Ave from the west (Emeryville and I-80) | SR-13 Warren Freeway (via SR-24 east) | 2.6 | SR-24 |
| Emeryville and West Oakland streets (55th to 67th Streets) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 2.3 | Claremont Avenue |
| Telegraph Ave from the north (Berkeley) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 1.6 | Telegraph Avenue |
| Ashby Ave from the west (Emeryville and I-80) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 1.4 | SR-24 |
| Berkeley hills to the northeast (Evergreen Ln, Gravatt Dr) | West Oakland to the southwest (Adeline St, Market St) | 1.4 | Claremont Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | West Oakland to the southwest (Adeline St, Market St) | 1.1 | none near the study area |
| other pairs | | 12.3 | |

By the arterial these cars would otherwise use: Telegraph Avenue 43 veh/h; Claremont Avenue then SR-24 8 veh/h; Claremont Avenue 7 veh/h; SR-24 6 veh/h; none near the study area 5 veh/h; College Avenue then Claremont Avenue then SR-24 4 veh/h.

### Study area, all residential and service streets

Model: 385 through cars per hour.

Model through cars by origin and destination group (largest 12 of 107 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 54.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 45.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 42.8 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 30.9 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 19.0 | Claremont Avenue then SR-24 |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 17.1 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 16.6 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 13.9 | SR-24 |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 10.8 | College Avenue then Claremont Avenue then SR-24 |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 9.6 | Claremont Avenue then College Avenue |
| Emeryville and West Oakland streets (55th to 67th Streets) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 9.4 | Claremont Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Ashby Ave from the west (Emeryville and I-80) | 7.5 | none near the study area |
| other pairs | | 108.8 | |

By the arterial these cars would otherwise use: Telegraph Avenue 233 veh/h; Claremont Avenue 29 veh/h; SR-24 24 veh/h; Claremont Avenue then SR-24 19 veh/h; none near the study area 18 veh/h; Claremont Avenue then College Avenue 13 veh/h.

By origin group: Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 112; SR-24 eastbound off-ramps (arriving from Oakland and I-980) 82; South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 42; Telegraph Ave from the north (Berkeley) 38; Claremont Ave and Tunnel Rd toward the hills 22; Telegraph Ave to the south (downtown Oakland) 18; College Ave from the north (Berkeley) 16; Emeryville and West Oakland streets (55th to 67th Streets) 15; West Oakland to the southwest (Adeline St, Market St) 9; Shattuck Ave from the north (Berkeley) 8.

By destination group: SR-24 westbound on-ramps (toward Oakland and I-980) 112; South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 74; Telegraph Ave from the north (Berkeley) 65; Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 47; Claremont Ave and Tunnel Rd toward the hills 29; Ashby Ave from the west (Emeryville and I-80) 11; College Ave from the north (Berkeley) 10; West Oakland to the southwest (Adeline St, Market St) 6; Berkeley hills to the northeast (Evergreen Ln, Gravatt Dr) 5; San Pablo Ave (Emeryville and West Oakland) 5.


Per-seed detail: `rockridge-midday-s1-seed1.md` (seed 1 in full).
