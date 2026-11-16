# rockridge-am_peak-s1 over 10 seeds (1, 2, 3, 4, 5, 6, 7, 8, 9, 10)

Seeds are the fixed list above, none chosen; each run is 60 minutes from the same start. Interval = 95% interval of the mean (Student t, n - 1 degrees of freedom). Run-to-run noise only: demand is fixed, so day-to-day variation is not in these intervals.

## Stability rule (design decision D16)

| Check | Rule | Result | Pass |
| --- | --- | --- | --- |
| Removals | mean per hour below 1.00 | 0.00 (min 0.00, max 0.00) | yes |
| Entry backlog | below 2.0% in at least 90% of seeds | 10 of 10 seeds | yes |
| Runaway growth | no seed adds more than 2.0 points of backlog in the second half | none | yes |
| Arterial speed | mean above 4.0 m/s | 9.45 m/s | yes |

**Verdict: stable.** Old rule (zero removals, backlog under 2%, speed above 4 m/s, every seed): 10 of 10 seeds pass.

## Metrics over seeds

| Group | Metric | Unit | Mean | SD | Min | Max | 95% interval |
| --- | --- | --- | --- | --- | --- | --- | --- |
| health | gridlock removals | vehicles | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| health | gridlock removals per hour | veh/h | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| health | entry backlog | % of spawned | 0.01 | 0.01 | 0.00 | 0.04 | 0.00 to 0.02 |
| health | backlog growth in the second half of the run | points of spawned | 0.01 | 0.01 | -0.01 | 0.03 | -0.00 to 0.02 |
| health | completed trips | trips | 22662.60 | 161.30 | 22429.00 | 22966.00 | 22547.22 to 22777.98 |
| health | arterial mean speed | m/s | 9.45 | 0.11 | 9.25 | 9.57 | 9.38 to 9.53 |
| health | arterial mean speed, last 15 min | m/s | 9.49 | 0.14 | 9.27 | 9.68 | 9.39 to 9.59 |
| junction recovery | courtesy admissions per hour | veh/h | 120.00 | 11.34 | 100.00 | 142.00 | 111.89 to 128.11 |
| junction recovery | yield fallback admissions per hour | veh/h | 33.10 | 10.40 | 20.00 | 50.00 | 25.66 to 40.54 |
| junction recovery | conflict bypass admissions per hour | veh/h | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| junction recovery | vehicles removed while held in a node, per hour | veh/h | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| cut-through | local vehicle-miles, surface gates to the freeway | veh-miles | 21.18 | 3.87 | 16.56 | 29.61 | 18.40 to 23.95 |
| cut-through | share of local vehicle-miles, surface gates to the freeway | % | 6.1 | 1.0 | 4.9 | 8.1 | 5.4 to 6.8 |
| cut-through | local vehicle-miles, freeway to the surface gates | veh-miles | 21.53 | 3.26 | 17.37 | 27.14 | 19.20 to 23.86 |
| cut-through | share of local vehicle-miles, freeway to the surface gates | % | 6.2 | 0.9 | 4.9 | 7.4 | 5.5 to 6.9 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue N | trips | 33.90 | 4.07 | 26.00 | 39.00 | 30.99 to 36.81 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue N | trips | 1016.20 | 19.91 | 980.00 | 1047.00 | 1001.96 to 1030.44 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue S | trips | 27.90 | 6.21 | 18.00 | 36.00 | 23.46 to 32.34 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue S | trips | 1276.40 | 35.65 | 1227.00 | 1352.00 | 1250.90 to 1301.90 |
| headline share | Hillegass Avenue NB from freeway | % | 50.5 | 2.6 | 46.8 | 55.3 | 48.6 to 52.4 |
| share | Hillegass Avenue NB to Benvenue Avenue | % | 7.5 | 1.6 | 5.6 | 9.9 | 6.4 to 8.7 |
| share | Hillegass Avenue NB to College Avenue | % | 12.3 | 3.9 | 7.8 | 19.2 | 9.6 to 15.1 |
| share | Hillegass Avenue NB to Alcatraz Avenue WB | % | 33.0 | 3.7 | 26.9 | 38.3 | 30.4 to 35.6 |
| headline share | Colby Street NB from freeway | % | 43.3 | 2.0 | 39.7 | 46.2 | 41.9 to 44.7 |
| share | Colby Street NB to Alcatraz Avenue WB | % | 46.4 | 5.4 | 36.4 | 57.6 | 42.6 to 50.2 |
| share | Colby Street NB to Telegraph Avenue | % | 38.8 | 4.2 | 30.6 | 44.5 | 35.8 to 41.8 |
| share | Colby Street NB to College Avenue | % | 3.2 | 1.3 | 1.6 | 5.3 | 2.3 to 4.1 |
| share | Hillegass Avenue SB from Alcatraz Avenue WB | % | 16.4 | 3.9 | 8.9 | 21.1 | 13.7 to 19.2 |
| share | Hillegass Avenue SB from Benvenue Avenue | % | 1.6 | 1.3 | 0.0 | 5.0 | 0.7 to 2.6 |
| share | Hillegass Avenue SB from College Avenue | % | 11.4 | 3.6 | 4.5 | 16.2 | 8.8 to 14.0 |
| headline share | Hillegass Avenue SB to freeway | % | 59.0 | 3.9 | 54.7 | 66.9 | 56.2 to 61.8 |
| share | Colby Street SB from Alcatraz Avenue EB | % | 21.3 | 2.0 | 17.8 | 24.6 | 19.9 to 22.7 |
| share | Colby Street SB from Alcatraz Avenue WB | % | 6.9 | 1.7 | 4.3 | 8.6 | 5.7 to 8.1 |
| share | Colby Street SB from Telegraph Avenue | % | 18.6 | 3.5 | 10.0 | 21.3 | 16.1 to 21.1 |
| headline share | Colby Street SB to freeway | % | 47.4 | 4.6 | 39.7 | 52.6 | 44.1 to 50.6 |
| share | Colby Street SB to Forest Street | % | 16.9 | 3.5 | 12.2 | 23.7 | 14.3 to 19.4 |
| ramp share | onto freeway via College Avenue | % | 15.9 | 1.3 | 14.3 | 17.8 | 15.0 to 16.9 |
| ramp share | onto freeway via Hillegass Avenue | % | 13.2 | 1.8 | 10.4 | 17.0 | 11.9 to 14.4 |
| ramp share | onto freeway via Martin Street | % | 13.2 | 1.7 | 10.5 | 15.5 | 11.9 to 14.4 |
| ramp share | onto freeway via Colby Street | % | 14.1 | 1.5 | 11.2 | 16.4 | 13.0 to 15.1 |
| ramp share | onto freeway via Telegraph Avenue north of Alcatraz Avenue | % | 8.4 | 1.2 | 6.3 | 10.2 | 7.6 to 9.2 |
| ramp share | onto freeway via Benvenue Avenue | % | 3.7 | 0.7 | 3.1 | 5.4 | 3.2 to 4.2 |
| ramp share | from freeway via College Avenue | % | 9.6 | 1.4 | 8.0 | 12.6 | 8.6 to 10.7 |
| ramp share | from freeway via Martin Street | % | 11.2 | 0.7 | 9.5 | 12.2 | 10.6 to 11.7 |
| ramp share | from freeway via Colby Street | % | 9.9 | 1.1 | 8.3 | 11.5 | 9.1 to 10.7 |
| ramp share | from freeway via Hillegass Avenue | % | 8.1 | 0.5 | 7.4 | 9.0 | 7.7 to 8.5 |
| ramp share | from freeway via Benvenue Avenue | % | 2.3 | 0.5 | 1.6 | 3.0 | 2.0 to 2.6 |
| corridor flow | Telegraph N median link flow | veh/h | 809.52 | 27.22 | 772.80 | 852.00 | 790.05 to 828.99 |
| corridor flow | Telegraph S median link flow | veh/h | 897.72 | 53.67 | 801.60 | 980.40 | 859.33 to 936.11 |
| corridor flow | College N median link flow | veh/h | 258.96 | 25.35 | 207.60 | 300.00 | 240.82 to 277.10 |
| corridor flow | College S median link flow | veh/h | 414.72 | 23.89 | 373.20 | 441.60 | 397.63 to 431.81 |
| corridor flow | Claremont N median link flow | veh/h | 291.84 | 10.92 | 276.00 | 310.80 | 284.03 to 299.65 |
| corridor flow | Claremont S median link flow | veh/h | 410.16 | 32.71 | 348.00 | 464.40 | 386.76 to 433.56 |
| corridor flow | Alcatraz E median link flow | veh/h | 444.12 | 27.11 | 400.80 | 481.20 | 424.73 to 463.51 |
| corridor flow | Alcatraz W median link flow | veh/h | 370.80 | 20.82 | 344.40 | 409.20 | 355.91 to 385.69 |
| corridor flow | Hillegass N median link flow | veh/h | 93.60 | 10.51 | 75.60 | 111.60 | 86.08 to 101.12 |
| corridor flow | Hillegass S median link flow | veh/h | 79.08 | 12.84 | 58.80 | 106.80 | 69.89 to 88.27 |
| corridor flow | Colby N median link flow | veh/h | 106.92 | 9.77 | 94.80 | 126.00 | 99.93 to 113.91 |
| corridor flow | Colby S median link flow | veh/h | 123.36 | 7.92 | 109.20 | 134.40 | 117.70 to 129.02 |
| corridor flow | Martin E median link flow | veh/h | 101.40 | 14.86 | 72.00 | 126.00 | 90.77 to 112.03 |
| corridor flow | Martin W median link flow | veh/h | 97.20 | 5.88 | 87.60 | 104.40 | 92.99 to 101.41 |

## Intent map: through cars by where they come from and where they are going

Through = neither trip end is in the study area. Groups are the approach groups of the area config (data/areas); a node that is not a gate takes the group of the nearest surface gate (ASSUMPTION). The arterial is the one a trip would use on the shortest free-flow path with the study area's residential and service streets closed, where that path runs on a boundary street near the study area.

Model figures are the mean of 10 seed(s), per hour of the run. Basis: OBSERVED = read from the resident volunteer count of Feb 25, 2025 or its headline shares; ASSUMPTION = inferred from those numbers or chosen.

### Colby Street NB

Observed (PM): 182 cars entered at the south end, 102 drove the whole street, 164 left it at Alcatraz Ave (131 left, 32 right, 1 straight), and 47% of the block's trips came from a freeway (the headline share). ASSUMPTION: freeway-origin cars that do not end along the street are 65 veh/h (the 82 freeway-origin trips on the block, 47% of 174, times the 182 / (182 + 47) of its cars that entered at the south end rather than joining on the way), spread over the 164 exits in proportion (0.40); the other through cars come from the Telegraph Ave and south-side approaches that feed the street's south end. Ranges: low = 131 (32) x 0.47 x 0.62 (the whole-street share of exits), high = 131 (32) x 0.47.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | OBSERVED turn count x ASSUMPTION share (131 left turns x 0.40) | 52 (38 to 62) | 36 | below |
| Telegraph Ave and south-side traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | ASSUMPTION: the through left-turners (131 x 0.62 = 81) that are not off-ramp traffic | 29 (19 to 43) | 20 | within |
| SR-24 off-ramp traffic using Colby St to reach College Ave and Berkeley (right at Alcatraz Ave) | OBSERVED turn count x ASSUMPTION share (32 right turns x 0.40) | 13 (9 to 15) | 3 | below |
| Telegraph Ave and south-side traffic using Colby St to reach College Ave and Berkeley | ASSUMPTION: the through right-turners (32 x 0.62 = 20) that are not off-ramp traffic | 7 (5 to 11) | 28 | above |
| Intents listed, together | | 101 (71 to 131) | 87 | |
| Other through cars (no intent listed) | | | 2 | |

Model through cars by origin and destination group (largest 12 of 27 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 36.2 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 25.8 | College Avenue then Alcatraz Avenue |
| Telegraph Ave to the south (downtown Oakland) | Telegraph Ave from the north (Berkeley) | 10.8 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 2.4 | Claremont Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Emeryville and West Oakland streets (55th to 67th Streets) | 2.2 | Claremont Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Ashby Ave from the west (Emeryville and I-80) | 1.4 | Claremont Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Shattuck Ave from the north (Berkeley) | 1.4 | Claremont Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Telegraph Ave from the north (Berkeley) | 1.4 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 1.3 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 1.1 | SR-24 |
| Telegraph Ave to the south (downtown Oakland) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 0.8 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | College Ave from the north (Berkeley) | 0.6 | Telegraph Avenue |
| other pairs | | 3.1 | |

By the arterial these cars would otherwise use: Telegraph Avenue 52 veh/h; College Avenue then Alcatraz Avenue 26 veh/h; Claremont Avenue 8 veh/h; SR-24 1 veh/h; SR-24 then Telegraph Avenue then Alcatraz Avenue 0 veh/h; Alcatraz Avenue then Claremont Avenue 0 veh/h.

### Hillegass Avenue NB

Observed (PM): 94 cars entered at the south end, 48 drove the whole street, 109 left it at Alcatraz Ave (43 west, 54 east, 12 straight), and 47% of the block's trips came from a freeway. ASSUMPTION: freeway-origin through cars are 40 veh/h (52 freeway-origin trips times 94 / (94 + 29)), spread over the exits in proportion (0.37); the through share of exits is 48 / 109 = 0.44.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Hillegass Ave to reach Alcatraz Ave west and Telegraph Ave north | OBSERVED turn count x ASSUMPTION share (43 left turns x 0.37) | 16 (9 to 20) | 20 | within |
| SR-24 off-ramp traffic using Hillegass Ave to reach College Ave and Berkeley | OBSERVED turn count x ASSUMPTION share (54 right turns x 0.37) | 20 (11 to 25) | 23 | within |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach Alcatraz Ave west | ASSUMPTION: through exits (43 x 0.44) that are not off-ramp traffic | 3 (0 to 10) | 5 | within |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach College Ave and Berkeley | ASSUMPTION: through exits (54 x 0.44) that are not off-ramp traffic | 4 (0 to 13) | 19 | above |
| Intents listed, together | | 43 (20 to 68) | 66 | |
| Other through cars (no intent listed) | | | 2 | |

Model through cars by origin and destination group (largest 12 of 40 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 12.8 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 12.7 | SR-24 |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 12.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 4.9 | SR-24 then Claremont Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | College Ave from the north (Berkeley) | 4.8 | SR-24 then Claremont Avenue then College Avenue |
| Telegraph Ave to the south (downtown Oakland) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 3.4 | Telegraph Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Ashby Ave from the west (Emeryville and I-80) | 2.1 | SR-24 then Telegraph Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | San Pablo Ave (Emeryville and West Oakland) | 1.6 | SR-24 |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Telegraph Ave from the north (Berkeley) | 1.4 | none near the study area |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 1.1 | Claremont Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Telegraph Ave from the north (Berkeley) | 1.1 | Telegraph Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Shattuck Ave from the north (Berkeley) | 1.1 | SR-24 then Telegraph Avenue then Alcatraz Avenue |
| other pairs | | 9.9 | |

By the arterial these cars would otherwise use: Telegraph Avenue 32 veh/h; SR-24 14 veh/h; SR-24 then Claremont Avenue 5 veh/h; SR-24 then Claremont Avenue then College Avenue 5 veh/h; Claremont Avenue 4 veh/h; SR-24 then Telegraph Avenue 3 veh/h.

### Hillegass Avenue SB

Observed (PM): 178 cars entered at the top (76 turned in from Alcatraz Ave west, 98 from the east, 4 came straight from the north), 79 drove the whole street, and 68% of the block's trips (109 veh/h) went to a freeway. ASSUMPTION: freeway-bound cars that did not join mid-street are 87 veh/h (109 x 178 / (178 + 44)), half of the 174 turn-ins; low = the whole-street share of the turn-ins (0.45), high = the freeway-bound share without the mid-street correction (0.63).

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Telegraph Ave, Alcatraz Ave west and West Berkeley traffic turning off Alcatraz Ave onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (76 turn-ins x 0.50) | 38 (34 to 48) | 15 | below |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (98 turn-ins x 0.50) | 49 (44 to 62) | 20 | below |
| Intents listed, together | | 87 (78 to 110) | 35 | |
| Other through cars (no intent listed) | | | 36 | |

Model through cars by origin and destination group (largest 12 of 20 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 25.6 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 14.0 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 10.7 | Claremont Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 4.9 | Claremont Avenue then SR-24 |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 4.9 | College Avenue then Claremont Avenue then SR-24 |
| Telegraph Ave from the north (Berkeley) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 3.1 | College Avenue |
| Telegraph Ave from the north (Berkeley) | College Ave from the north (Berkeley) | 2.5 | College Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Telegraph Ave to the south (downtown Oakland) | 1.7 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | West Oakland to the southwest (Adeline St, Market St) | 1.6 | Telegraph Avenue |
| Shattuck Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 0.5 | none near the study area |
| College Ave from the north (Berkeley) | Telegraph Ave to the south (downtown Oakland) | 0.3 | Alcatraz Avenue then Telegraph Avenue |
| San Pablo Ave (Emeryville and West Oakland) | Claremont Ave and Tunnel Rd toward the hills | 0.3 | Alcatraz Avenue then Claremont Avenue |
| other pairs | | 1.4 | |

By the arterial these cars would otherwise use: Telegraph Avenue 43 veh/h; Claremont Avenue then SR-24 16 veh/h; College Avenue 6 veh/h; College Avenue then Claremont Avenue then SR-24 5 veh/h; none near the study area 1 veh/h; Alcatraz Avenue then College Avenue 0 veh/h.

### Colby Street SB

Observed (PM): 139 cars entered at the top (76 from Alcatraz Ave west, 50 from the east, 13 from the north), 39 drove the whole street, 45% of the block's trips (72 veh/h) went to a freeway and 22% came by way of Telegraph Ave. ASSUMPTION: freeway-bound cars that did not join mid-street are 46 veh/h (72 x 139 / (139 + 79)), 0.365 of the 126 turn-ins; low = the whole-street share (0.31), high = the unadjusted freeway share (0.57). The Telegraph Ave cars are the 22% x 160 = 35 of the 76 west turn-ins.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Southbound Telegraph Ave traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (35 Telegraph Ave cars x 0.365) | 13 (11 to 20) | 16 | within |
| Alcatraz Ave west, Ashby Ave and West Berkeley traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (41 other west turn-ins x 0.365) | 15 (13 to 23) | 18 | within |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (50 east turn-ins x 0.365) | 18 (15 to 29) | 8 | below |
| Intents listed, together | | 46 (39 to 72) | 42 | |
| Other through cars (no intent listed) | | | 44 | |

Model through cars by origin and destination group (largest 12 of 39 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 29.7 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 13.8 | Telegraph Avenue |
| Shattuck Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 7.1 | none near the study area |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 5.7 | Telegraph Avenue |
| Ashby Ave from the west (Emeryville and I-80) | SR-13 Warren Freeway (via SR-24 east) | 3.7 | SR-24 |
| Ashby Ave from the west (Emeryville and I-80) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 2.9 | SR-24 |
| Telegraph Ave from the north (Berkeley) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 2.7 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 2.6 | none near the study area |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Telegraph Ave to the south (downtown Oakland) | 2.5 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | West Oakland to the southwest (Adeline St, Market St) | 2.3 | Telegraph Avenue |
| Alcatraz Ave from the west (Emeryville side) | SR-13 Warren Freeway (via SR-24 east) | 2.1 | SR-24 |
| College Ave from the north (Berkeley) | Telegraph Ave to the south (downtown Oakland) | 1.5 | Alcatraz Avenue then Telegraph Avenue |
| other pairs | | 9.7 | |

By the arterial these cars would otherwise use: Telegraph Avenue 58 veh/h; none near the study area 11 veh/h; SR-24 10 veh/h; Alcatraz Avenue then Telegraph Avenue 2 veh/h; College Avenue then Claremont Avenue then SR-24 1 veh/h; Claremont Avenue then SR-24 1 veh/h.

### Study area, all residential and service streets

Model: 462 through cars per hour.

Model through cars by origin and destination group (largest 12 of 86 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 73.7 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 60.5 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 45.6 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 33.1 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 27.2 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 15.7 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 12.8 | SR-24 |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 12.4 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Emeryville and West Oakland streets (55th to 67th Streets) | 10.9 | Claremont Avenue |
| Telegraph Ave to the south (downtown Oakland) | Telegraph Ave from the north (Berkeley) | 10.9 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 10.8 | Claremont Avenue then SR-24 |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Ashby Ave from the west (Emeryville and I-80) | 10.0 | Claremont Avenue |
| other pairs | | 138.6 | |

By the arterial these cars would otherwise use: Telegraph Avenue 318 veh/h; Claremont Avenue 39 veh/h; SR-24 24 veh/h; none near the study area 22 veh/h; Claremont Avenue then SR-24 11 veh/h; Alcatraz Avenue then College Avenue 9 veh/h.

By origin group: Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 122; South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 100; SR-24 eastbound off-ramps (arriving from Oakland and I-980) 76; Telegraph Ave from the north (Berkeley) 49; Telegraph Ave to the south (downtown Oakland) 33; Claremont Ave and Tunnel Rd toward the hills 12; West Oakland to the southwest (Adeline St, Market St) 12; Shattuck Ave from the north (Berkeley) 10; Ashby Ave from the west (Emeryville and I-80) 9; College Ave from the north (Berkeley) 7.

By destination group: South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 114; SR-24 westbound on-ramps (toward Oakland and I-980) 96; Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 84; Telegraph Ave from the north (Berkeley) 67; Claremont Ave and Tunnel Rd toward the hills 18; College Ave from the north (Berkeley) 17; Ashby Ave from the west (Emeryville and I-80) 12; Emeryville and West Oakland streets (55th to 67th Streets) 12; Telegraph Ave to the south (downtown Oakland) 9; Shattuck Ave from the north (Berkeley) 8.


Per-seed detail: `rockridge-am_peak-s1-seed1.md` (seed 1 in full).
