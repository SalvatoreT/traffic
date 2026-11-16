# rockridge-midday-s1 over 10 seeds (1, 2, 3, 4, 5, 6, 7, 8, 9, 10)

Seeds are the fixed list above, none chosen; each run is 60 minutes from the same start. Interval = 95% interval of the mean (Student t, n - 1 degrees of freedom). Run-to-run noise only: demand is fixed, so day-to-day variation is not in these intervals.

## Stability rule (design decision D16)

| Check | Rule | Result | Pass |
| --- | --- | --- | --- |
| Removals | mean per hour below 1.00 | 0.00 (min 0.00, max 0.00) | yes |
| Entry backlog | below 2.0% in at least 90% of seeds | 10 of 10 seeds | yes |
| Runaway growth | no seed adds more than 2.0 points of backlog in the second half | none | yes |
| Arterial speed | mean above 4.0 m/s | 10.11 m/s | yes |

**Verdict: stable.** Old rule (zero removals, backlog under 2%, speed above 4 m/s, every seed): 10 of 10 seeds pass.

## Metrics over seeds

| Group | Metric | Unit | Mean | SD | Min | Max | 95% interval |
| --- | --- | --- | --- | --- | --- | --- | --- |
| health | gridlock removals | vehicles | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| health | gridlock removals per hour | veh/h | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| health | entry backlog | % of spawned | 0.01 | 0.01 | 0.00 | 0.02 | 0.00 to 0.01 |
| health | backlog growth in the second half of the run | points of spawned | 0.00 | 0.01 | -0.01 | 0.02 | -0.00 to 0.01 |
| health | completed trips | trips | 16708.80 | 161.58 | 16530.00 | 16997.00 | 16593.22 to 16824.38 |
| health | arterial mean speed | m/s | 10.11 | 0.04 | 10.04 | 10.19 | 10.08 to 10.14 |
| health | arterial mean speed, last 15 min | m/s | 10.12 | 0.09 | 9.99 | 10.29 | 10.05 to 10.18 |
| junction recovery | courtesy admissions per hour | veh/h | 41.20 | 4.73 | 34.00 | 47.00 | 37.81 to 44.59 |
| junction recovery | yield fallback admissions per hour | veh/h | 5.80 | 2.70 | 2.00 | 11.00 | 3.87 to 7.73 |
| junction recovery | conflict bypass admissions per hour | veh/h | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| junction recovery | vehicles removed while held in a node, per hour | veh/h | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| cut-through | local vehicle-miles, surface gates to the freeway | veh-miles | 26.10 | 4.43 | 20.77 | 32.56 | 22.93 to 29.26 |
| cut-through | share of local vehicle-miles, surface gates to the freeway | % | 10.0 | 1.5 | 8.4 | 12.4 | 9.0 to 11.1 |
| cut-through | local vehicle-miles, freeway to the surface gates | veh-miles | 24.14 | 3.08 | 19.76 | 29.35 | 21.93 to 26.34 |
| cut-through | share of local vehicle-miles, freeway to the surface gates | % | 9.3 | 1.0 | 8.1 | 10.8 | 8.6 to 10.0 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue N | trips | 27.00 | 4.69 | 20.00 | 34.00 | 23.64 to 30.36 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue N | trips | 890.50 | 18.70 | 860.00 | 913.00 | 877.13 to 903.87 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue S | trips | 40.10 | 6.44 | 33.00 | 56.00 | 35.50 to 44.70 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue S | trips | 964.20 | 29.33 | 925.00 | 998.00 | 943.22 to 985.18 |
| headline share | Hillegass Avenue NB from freeway | % | 53.4 | 4.6 | 45.8 | 59.3 | 50.1 to 56.7 |
| share | Hillegass Avenue NB to Benvenue Avenue | % | 3.4 | 1.7 | 1.2 | 7.3 | 2.2 to 4.7 |
| share | Hillegass Avenue NB to College Avenue | % | 16.9 | 1.9 | 15.0 | 21.3 | 15.5 to 18.3 |
| share | Hillegass Avenue NB to Alcatraz Avenue WB | % | 29.6 | 3.6 | 22.6 | 36.0 | 27.0 to 32.2 |
| headline share | Colby Street NB from freeway | % | 37.6 | 3.1 | 31.8 | 43.0 | 35.4 to 39.8 |
| share | Colby Street NB to Alcatraz Avenue WB | % | 48.1 | 2.7 | 43.0 | 50.3 | 46.1 to 50.0 |
| share | Colby Street NB to Telegraph Avenue | % | 35.4 | 3.1 | 31.5 | 40.8 | 33.2 to 37.6 |
| share | Colby Street NB to College Avenue | % | 7.7 | 2.1 | 5.4 | 11.7 | 6.3 to 9.2 |
| share | Hillegass Avenue SB from Alcatraz Avenue WB | % | 31.5 | 5.0 | 22.0 | 38.5 | 28.0 to 35.1 |
| share | Hillegass Avenue SB from Benvenue Avenue | % | 5.5 | 1.9 | 3.6 | 9.2 | 4.1 to 6.8 |
| share | Hillegass Avenue SB from College Avenue | % | 16.8 | 4.9 | 8.0 | 23.9 | 13.3 to 20.3 |
| headline share | Hillegass Avenue SB to freeway | % | 62.9 | 4.6 | 57.8 | 71.9 | 59.6 to 66.2 |
| share | Colby Street SB from Alcatraz Avenue EB | % | 20.9 | 3.1 | 17.7 | 26.9 | 18.7 to 23.2 |
| share | Colby Street SB from Alcatraz Avenue WB | % | 21.7 | 2.2 | 18.7 | 24.8 | 20.1 to 23.3 |
| share | Colby Street SB from Telegraph Avenue | % | 18.1 | 3.0 | 15.2 | 23.9 | 16.0 to 20.3 |
| headline share | Colby Street SB to freeway | % | 45.6 | 3.9 | 40.4 | 51.8 | 42.8 to 48.3 |
| share | Colby Street SB to Forest Street | % | 15.6 | 3.7 | 10.5 | 24.1 | 12.9 to 18.3 |
| ramp share | onto freeway via College Avenue | % | 12.4 | 0.8 | 10.7 | 13.6 | 11.8 to 13.0 |
| ramp share | onto freeway via Hillegass Avenue | % | 14.3 | 1.5 | 12.8 | 18.2 | 13.2 to 15.3 |
| ramp share | onto freeway via Martin Street | % | 12.4 | 1.7 | 8.8 | 14.3 | 11.2 to 13.6 |
| ramp share | onto freeway via Colby Street | % | 12.7 | 2.5 | 9.6 | 16.1 | 10.9 to 14.5 |
| ramp share | onto freeway via Telegraph Avenue north of Alcatraz Avenue | % | 9.2 | 1.0 | 8.3 | 11.3 | 8.5 to 9.9 |
| ramp share | onto freeway via Benvenue Avenue | % | 5.2 | 0.8 | 3.6 | 6.1 | 4.6 to 5.7 |
| ramp share | from freeway via College Avenue | % | 9.8 | 1.3 | 7.8 | 11.7 | 8.8 to 10.8 |
| ramp share | from freeway via Martin Street | % | 11.4 | 2.0 | 8.4 | 13.9 | 9.9 to 12.8 |
| ramp share | from freeway via Colby Street | % | 11.5 | 1.3 | 9.8 | 13.2 | 10.6 to 12.5 |
| ramp share | from freeway via Hillegass Avenue | % | 8.6 | 1.2 | 7.0 | 10.9 | 7.8 to 9.4 |
| ramp share | from freeway via Benvenue Avenue | % | 2.7 | 0.6 | 1.3 | 3.3 | 2.2 to 3.1 |
| corridor flow | Telegraph N median link flow | veh/h | 616.92 | 29.48 | 580.80 | 661.20 | 595.83 to 638.01 |
| corridor flow | Telegraph S median link flow | veh/h | 634.32 | 11.03 | 618.00 | 654.00 | 626.43 to 642.21 |
| corridor flow | College N median link flow | veh/h | 214.32 | 25.81 | 187.20 | 259.20 | 195.86 to 232.78 |
| corridor flow | College S median link flow | veh/h | 334.92 | 24.91 | 294.00 | 379.20 | 317.10 to 352.74 |
| corridor flow | Claremont N median link flow | veh/h | 260.28 | 28.14 | 219.60 | 304.80 | 240.15 to 280.41 |
| corridor flow | Claremont S median link flow | veh/h | 168.84 | 29.56 | 116.40 | 202.80 | 147.70 to 189.98 |
| corridor flow | Alcatraz E median link flow | veh/h | 382.08 | 14.47 | 356.40 | 405.60 | 371.73 to 392.43 |
| corridor flow | Alcatraz W median link flow | veh/h | 235.68 | 16.00 | 217.20 | 265.20 | 224.23 to 247.13 |
| corridor flow | Hillegass N median link flow | veh/h | 78.48 | 10.84 | 66.00 | 100.80 | 70.73 to 86.23 |
| corridor flow | Hillegass S median link flow | veh/h | 73.20 | 7.27 | 63.60 | 86.40 | 68.00 to 78.40 |
| corridor flow | Colby N median link flow | veh/h | 99.12 | 8.28 | 87.60 | 111.60 | 93.20 to 105.04 |
| corridor flow | Colby S median link flow | veh/h | 71.76 | 12.39 | 51.60 | 93.60 | 62.90 to 80.62 |
| corridor flow | Martin E median link flow | veh/h | 74.52 | 6.31 | 62.40 | 82.80 | 70.01 to 79.03 |
| corridor flow | Martin W median link flow | veh/h | 70.20 | 8.77 | 55.20 | 79.20 | 63.93 to 76.47 |

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
| Other through cars (no intent listed) | | | 3 | |

Model through cars by origin and destination group (largest 12 of 29 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 40.8 | Telegraph Avenue |
| Telegraph Ave to the south (downtown Oakland) | Telegraph Ave from the north (Berkeley) | 6.3 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Ashby Ave from the west (Emeryville and I-80) | 5.7 | none near the study area |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 5.1 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 3.6 | SR-24 then Claremont Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | College Ave from the north (Berkeley) | 1.9 | SR-24 then Claremont Avenue then College Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 1.7 | SR-24 |
| West Oakland to the southwest (Adeline St, Market St) | Telegraph Ave from the north (Berkeley) | 1.4 | Telegraph Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Claremont Ave and Tunnel Rd toward the hills | 1.1 | Claremont Avenue |
| San Pablo Ave (Emeryville and West Oakland) | College Ave from the north (Berkeley) | 0.7 | Claremont Avenue then College Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Alcatraz Ave from the west (Emeryville side) | 0.7 | College Avenue then Alcatraz Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 0.7 | Telegraph Avenue |
| other pairs | | 5.4 | |

By the arterial these cars would otherwise use: Telegraph Avenue 55 veh/h; none near the study area 6 veh/h; SR-24 then Claremont Avenue 4 veh/h; Claremont Avenue 4 veh/h; SR-24 then Claremont Avenue then College Avenue 2 veh/h; SR-24 2 veh/h.

### Hillegass Avenue NB

Observed (PM): 94 cars entered at the south end, 48 drove the whole street, 109 left it at Alcatraz Ave (43 west, 54 east, 12 straight), and 47% of the block's trips came from a freeway. ASSUMPTION: freeway-origin through cars are 40 veh/h (52 freeway-origin trips times 94 / (94 + 29)), spread over the exits in proportion (0.37); the through share of exits is 48 / 109 = 0.44.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Hillegass Ave to reach Alcatraz Ave west and Telegraph Ave north | OBSERVED turn count x ASSUMPTION share (43 left turns x 0.37) | 16 (9 to 20) | 15 | within |
| SR-24 off-ramp traffic using Hillegass Ave to reach College Ave and Berkeley | OBSERVED turn count x ASSUMPTION share (54 right turns x 0.37) | 20 (11 to 25) | 24 | within |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach Alcatraz Ave west | ASSUMPTION: through exits (43 x 0.44) that are not off-ramp traffic | 3 (0 to 10) | 5 | within |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach College Ave and Berkeley | ASSUMPTION: through exits (54 x 0.44) that are not off-ramp traffic | 4 (0 to 13) | 6 | within |
| Intents listed, together | | 43 (20 to 68) | 51 | |
| Other through cars (no intent listed) | | | 4 | |

Model through cars by origin and destination group (largest 12 of 38 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 12.8 | SR-24 |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 12.6 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | College Ave from the north (Berkeley) | 4.7 | SR-24 then Claremont Avenue then College Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 4.4 | SR-24 then Claremont Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 2.2 | Telegraph Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 2.2 | Claremont Avenue then Alcatraz Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Alcatraz Ave from the west (Emeryville side) | 2.1 | College Avenue then Alcatraz Avenue |
| College Ave from the north (Berkeley) | Alcatraz Ave from the west (Emeryville side) | 1.8 | College Avenue then Alcatraz Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | San Pablo Ave (Emeryville and West Oakland) | 1.2 | SR-24 |
| Telegraph Ave to the south (downtown Oakland) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 1.1 | Telegraph Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Ashby Ave from the west (Emeryville and I-80) | 1.0 | SR-24 then Telegraph Avenue |
| Telegraph Ave to the south (downtown Oakland) | Claremont Ave and Tunnel Rd toward the hills | 0.8 | Claremont Avenue |
| other pairs | | 8.1 | |

By the arterial these cars would otherwise use: Telegraph Avenue 17 veh/h; SR-24 14 veh/h; SR-24 then Claremont Avenue then College Avenue 5 veh/h; College Avenue then Alcatraz Avenue 5 veh/h; SR-24 then Claremont Avenue 4 veh/h; Claremont Avenue then Alcatraz Avenue 2 veh/h.

### Hillegass Avenue SB

Observed (PM): 178 cars entered at the top (76 turned in from Alcatraz Ave west, 98 from the east, 4 came straight from the north), 79 drove the whole street, and 68% of the block's trips (109 veh/h) went to a freeway. ASSUMPTION: freeway-bound cars that did not join mid-street are 87 veh/h (109 x 178 / (178 + 44)), half of the 174 turn-ins; low = the whole-street share of the turn-ins (0.45), high = the freeway-bound share without the mid-street correction (0.63).

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Telegraph Ave, Alcatraz Ave west and West Berkeley traffic turning off Alcatraz Ave onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (76 turn-ins x 0.50) | 38 (34 to 48) | 25 | below |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (98 turn-ins x 0.50) | 49 (44 to 62) | 33 | below |
| Intents listed, together | | 87 (78 to 110) | 58 | |
| Other through cars (no intent listed) | | | 10 | |

Model through cars by origin and destination group (largest 12 of 22 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 25.0 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 15.7 | Claremont Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 9.8 | Claremont Avenue then SR-24 |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 7.1 | College Avenue then Claremont Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 2.1 | Telegraph Avenue |
| Emeryville and West Oakland streets (55th to 67th Streets) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 2.1 | Claremont Avenue |
| Emeryville and West Oakland streets (55th to 67th Streets) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 1.5 | Alcatraz Avenue then Claremont Avenue |
| Emeryville and West Oakland streets (55th to 67th Streets) | College Ave from the north (Berkeley) | 0.9 | Claremont Avenue then College Avenue |
| West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 0.6 | Claremont Avenue |
| San Pablo Ave (Emeryville and West Oakland) | College Ave from the north (Berkeley) | 0.6 | Claremont Avenue then College Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 0.5 | Claremont Avenue |
| Shattuck Ave from the north (Berkeley) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 0.5 | College Avenue |
| other pairs | | 1.7 | |

By the arterial these cars would otherwise use: Telegraph Avenue 27 veh/h; Claremont Avenue then SR-24 26 veh/h; College Avenue then Claremont Avenue then SR-24 7 veh/h; Claremont Avenue 4 veh/h; Alcatraz Avenue then Claremont Avenue 2 veh/h; Claremont Avenue then College Avenue 2 veh/h.

### Colby Street SB

Observed (PM): 139 cars entered at the top (76 from Alcatraz Ave west, 50 from the east, 13 from the north), 39 drove the whole street, 45% of the block's trips (72 veh/h) went to a freeway and 22% came by way of Telegraph Ave. ASSUMPTION: freeway-bound cars that did not join mid-street are 46 veh/h (72 x 139 / (139 + 79)), 0.365 of the 126 turn-ins; low = the whole-street share (0.31), high = the unadjusted freeway share (0.57). The Telegraph Ave cars are the 22% x 160 = 35 of the 76 west turn-ins.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Southbound Telegraph Ave traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (35 Telegraph Ave cars x 0.365) | 13 (11 to 20) | 12 | within |
| Alcatraz Ave west, Ashby Ave and West Berkeley traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (41 other west turn-ins x 0.365) | 15 (13 to 23) | 9 | below |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (50 east turn-ins x 0.365) | 18 (15 to 29) | 28 | within |
| Intents listed, together | | 46 (39 to 72) | 49 | |
| Other through cars (no intent listed) | | | 27 | |

Model through cars by origin and destination group (largest 12 of 41 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 12.3 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 11.1 | Claremont Avenue then SR-24 |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 10.7 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 8.1 | Telegraph Avenue |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 4.6 | College Avenue then Claremont Avenue then SR-24 |
| Shattuck Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 4.2 | none near the study area |
| Emeryville and West Oakland streets (55th to 67th Streets) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 3.2 | Claremont Avenue |
| Emeryville and West Oakland streets (55th to 67th Streets) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 3.0 | Alcatraz Avenue then Claremont Avenue |
| Ashby Ave from the west (Emeryville and I-80) | SR-13 Warren Freeway (via SR-24 east) | 1.8 | SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Claremont Ave and Tunnel Rd toward the hills | 1.7 | Telegraph Avenue then Alcatraz Avenue then Claremont Avenue |
| Claremont Ave and Tunnel Rd toward the hills | Telegraph Ave to the south (downtown Oakland) | 1.4 | Claremont Avenue |
| San Pablo Ave (Emeryville and West Oakland) | College Ave from the north (Berkeley) | 1.4 | Claremont Avenue then College Avenue |
| other pairs | | 13.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 32 veh/h; Claremont Avenue then SR-24 11 veh/h; Claremont Avenue 6 veh/h; none near the study area 6 veh/h; Alcatraz Avenue then Claremont Avenue 5 veh/h; SR-24 5 veh/h.

### Study area, all residential and service streets

Model: 361 through cars per hour.

Model through cars by origin and destination group (largest 12 of 82 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 49.1 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 36.6 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 29.8 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 21.5 | Claremont Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 21.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 17.6 | Telegraph Avenue |
| Emeryville and West Oakland streets (55th to 67th Streets) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 16.5 | Claremont Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 14.4 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 13.6 | SR-24 |
| San Pablo Ave (Emeryville and West Oakland) | Claremont Ave and Tunnel Rd toward the hills | 10.4 | Alcatraz Avenue then Claremont Avenue |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 9.8 | College Avenue then Claremont Avenue then SR-24 |
| San Pablo Ave (Emeryville and West Oakland) | College Ave from the north (Berkeley) | 9.4 | Claremont Avenue then College Avenue |
| other pairs | | 111.4 | |

By the arterial these cars would otherwise use: Telegraph Avenue 190 veh/h; Alcatraz Avenue then Claremont Avenue 27 veh/h; Claremont Avenue 27 veh/h; Claremont Avenue then SR-24 22 veh/h; SR-24 20 veh/h; none near the study area 16 veh/h.

By origin group: SR-24 eastbound off-ramps (arriving from Oakland and I-980) 87; Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 68; South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 35; Telegraph Ave from the north (Berkeley) 34; Emeryville and West Oakland streets (55th to 67th Streets) 26; San Pablo Ave (Emeryville and West Oakland) 25; Claremont Ave and Tunnel Rd toward the hills 24; Telegraph Ave to the south (downtown Oakland) 16; West Oakland to the southwest (Adeline St, Market St) 14; College Ave from the north (Berkeley) 13.

By destination group: SR-24 westbound on-ramps (toward Oakland and I-980) 106; Telegraph Ave from the north (Berkeley) 62; Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 51; South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 43; Claremont Ave and Tunnel Rd toward the hills 39; College Ave from the north (Berkeley) 22; Ashby Ave from the west (Emeryville and I-80) 10; Alcatraz Ave from the west (Emeryville side) 6; Telegraph Ave to the south (downtown Oakland) 5; Berkeley hills to the northeast (Evergreen Ln, Gravatt Dr) 4.


Per-seed detail: `rockridge-midday-s1-seed1.md` (seed 1 in full).
