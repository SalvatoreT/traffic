# rockridge-am_peak-s1 over 10 seeds (1, 2, 3, 4, 5, 6, 7, 8, 9, 10)

Seeds are the fixed list above, none chosen; each run is 60 minutes from the same start. Interval = 95% interval of the mean (Student t, n - 1 degrees of freedom). Run-to-run noise only: demand is fixed, so day-to-day variation is not in these intervals.

## Stability rule (design decision D16)

| Check | Rule | Result | Pass |
| --- | --- | --- | --- |
| Removals | mean per hour below 1.00 | 0.00 (min 0.00, max 0.00) | yes |
| Entry backlog | below 2.0% in at least 90% of seeds | 10 of 10 seeds | yes |
| Runaway growth | no seed adds more than 2.0 points of backlog in the second half | none | yes |
| Arterial speed | mean above 4.0 m/s | 9.69 m/s | yes |

**Verdict: stable.** Old rule (zero removals, backlog under 2%, speed above 4 m/s, every seed): 10 of 10 seeds pass.

## Metrics over seeds

| Group | Metric | Unit | Mean | SD | Min | Max | 95% interval |
| --- | --- | --- | --- | --- | --- | --- | --- |
| health | gridlock removals | vehicles | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| health | gridlock removals per hour | veh/h | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| health | entry backlog | % of spawned | 0.01 | 0.01 | 0.00 | 0.03 | 0.00 to 0.02 |
| health | backlog growth in the second half of the run | points of spawned | -0.00 | 0.01 | -0.02 | 0.02 | -0.01 to 0.01 |
| health | completed trips | trips | 21545.90 | 125.71 | 21353.00 | 21741.00 | 21455.98 to 21635.82 |
| health | arterial mean speed | m/s | 9.69 | 0.06 | 9.60 | 9.78 | 9.65 to 9.73 |
| health | arterial mean speed, last 15 min | m/s | 9.75 | 0.13 | 9.48 | 9.86 | 9.66 to 9.84 |
| cut-through | local vehicle-miles, surface gates to the freeway | veh-miles | 23.29 | 3.16 | 20.13 | 30.32 | 21.03 to 25.56 |
| cut-through | share of local vehicle-miles, surface gates to the freeway | % | 6.9 | 0.9 | 5.7 | 8.8 | 6.3 to 7.6 |
| cut-through | local vehicle-miles, freeway to the surface gates | veh-miles | 18.51 | 2.99 | 13.77 | 23.96 | 16.37 to 20.65 |
| cut-through | share of local vehicle-miles, freeway to the surface gates | % | 5.5 | 0.9 | 4.3 | 7.0 | 4.9 to 6.1 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue N | trips | 34.40 | 6.74 | 22.00 | 43.00 | 29.58 to 39.22 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue N | trips | 865.00 | 20.35 | 830.00 | 905.00 | 850.45 to 879.55 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue S | trips | 32.70 | 6.22 | 22.00 | 42.00 | 28.25 to 37.15 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue S | trips | 1063.20 | 33.73 | 1020.00 | 1115.00 | 1039.07 to 1087.33 |
| headline share | Hillegass Avenue NB from freeway | % | 49.5 | 4.5 | 44.6 | 57.4 | 46.2 to 52.7 |
| share | Hillegass Avenue NB to Benvenue Avenue | % | 8.4 | 2.3 | 4.9 | 11.2 | 6.7 to 10.1 |
| share | Hillegass Avenue NB to College Avenue | % | 15.4 | 3.1 | 11.6 | 20.1 | 13.2 to 17.5 |
| share | Hillegass Avenue NB to Alcatraz Avenue WB | % | 34.8 | 3.7 | 30.1 | 40.8 | 32.1 to 37.5 |
| headline share | Colby Street NB from freeway | % | 43.6 | 2.6 | 39.3 | 47.2 | 41.7 to 45.5 |
| share | Colby Street NB to Alcatraz Avenue WB | % | 53.9 | 2.2 | 50.2 | 57.5 | 52.3 to 55.5 |
| share | Colby Street NB to Telegraph Avenue | % | 35.2 | 3.3 | 30.1 | 39.8 | 32.9 to 37.6 |
| share | Colby Street NB to College Avenue | % | 3.7 | 1.1 | 2.0 | 5.9 | 2.9 to 4.5 |
| share | Hillegass Avenue SB from Alcatraz Avenue WB | % | 22.1 | 4.2 | 15.4 | 28.3 | 19.1 to 25.2 |
| share | Hillegass Avenue SB from Benvenue Avenue | % | 1.6 | 0.7 | 0.8 | 2.6 | 1.1 to 2.2 |
| share | Hillegass Avenue SB from College Avenue | % | 11.1 | 3.3 | 6.0 | 16.2 | 8.8 to 13.4 |
| headline share | Hillegass Avenue SB to freeway | % | 65.2 | 4.9 | 56.9 | 75.2 | 61.7 to 68.7 |
| share | Colby Street SB from Alcatraz Avenue EB | % | 24.1 | 3.9 | 17.2 | 30.3 | 21.3 to 26.9 |
| share | Colby Street SB from Alcatraz Avenue WB | % | 8.0 | 1.6 | 6.1 | 11.8 | 6.9 to 9.1 |
| share | Colby Street SB from Telegraph Avenue | % | 19.9 | 3.4 | 14.4 | 25.6 | 17.5 to 22.3 |
| headline share | Colby Street SB to freeway | % | 50.1 | 2.2 | 45.9 | 52.3 | 48.4 to 51.7 |
| share | Colby Street SB to Forest Street | % | 10.4 | 1.8 | 7.4 | 12.5 | 9.1 to 11.6 |
| ramp share | onto freeway via College Avenue | % | 13.3 | 1.4 | 10.7 | 15.4 | 12.3 to 14.3 |
| ramp share | onto freeway via Hillegass Avenue | % | 13.4 | 1.5 | 10.6 | 15.1 | 12.3 to 14.5 |
| ramp share | onto freeway via Martin Street | % | 15.2 | 1.9 | 10.6 | 17.4 | 13.8 to 16.5 |
| ramp share | onto freeway via Colby Street | % | 14.6 | 1.9 | 11.3 | 17.5 | 13.2 to 16.0 |
| ramp share | onto freeway via Telegraph Avenue north of Alcatraz Avenue | % | 9.3 | 1.3 | 7.4 | 11.8 | 8.4 to 10.2 |
| ramp share | onto freeway via Benvenue Avenue | % | 4.5 | 0.8 | 3.1 | 5.5 | 3.9 to 5.0 |
| ramp share | from freeway via College Avenue | % | 10.3 | 1.1 | 8.8 | 12.0 | 9.5 to 11.1 |
| ramp share | from freeway via Martin Street | % | 11.1 | 0.8 | 9.6 | 12.4 | 10.5 to 11.7 |
| ramp share | from freeway via Colby Street | % | 12.5 | 1.3 | 10.4 | 14.4 | 11.5 to 13.4 |
| ramp share | from freeway via Hillegass Avenue | % | 6.7 | 1.3 | 4.5 | 8.7 | 5.8 to 7.6 |
| ramp share | from freeway via Benvenue Avenue | % | 2.5 | 0.7 | 1.6 | 3.8 | 1.9 to 3.0 |
| corridor flow | Telegraph N median link flow | veh/h | 733.32 | 42.67 | 661.20 | 796.80 | 702.80 to 763.84 |
| corridor flow | Telegraph S median link flow | veh/h | 632.88 | 45.97 | 562.80 | 697.20 | 599.99 to 665.77 |
| corridor flow | College N median link flow | veh/h | 161.04 | 22.32 | 130.80 | 194.40 | 145.07 to 177.01 |
| corridor flow | College S median link flow | veh/h | 323.16 | 22.05 | 286.80 | 352.80 | 307.38 to 338.94 |
| corridor flow | Claremont N median link flow | veh/h | 345.24 | 30.22 | 303.60 | 387.60 | 323.62 to 366.86 |
| corridor flow | Claremont S median link flow | veh/h | 381.24 | 25.53 | 333.60 | 409.20 | 362.98 to 399.50 |
| corridor flow | Alcatraz E median link flow | veh/h | 350.28 | 21.27 | 314.40 | 386.40 | 335.07 to 365.49 |
| corridor flow | Alcatraz W median link flow | veh/h | 378.72 | 34.09 | 319.20 | 424.80 | 354.34 to 403.10 |
| corridor flow | Hillegass N median link flow | veh/h | 84.84 | 11.44 | 66.00 | 100.80 | 76.66 to 93.02 |
| corridor flow | Hillegass S median link flow | veh/h | 69.24 | 6.20 | 61.20 | 79.20 | 64.81 to 73.67 |
| corridor flow | Colby N median link flow | veh/h | 108.72 | 10.40 | 96.00 | 128.40 | 101.28 to 116.16 |
| corridor flow | Colby S median link flow | veh/h | 118.44 | 18.56 | 84.00 | 142.80 | 105.17 to 131.71 |
| corridor flow | Martin E median link flow | veh/h | 106.68 | 11.32 | 80.40 | 123.60 | 98.58 to 114.78 |
| corridor flow | Martin W median link flow | veh/h | 109.44 | 10.80 | 91.20 | 129.60 | 101.71 to 117.17 |

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
| Other through cars (no intent listed) | | | 2 | |

Model through cars by origin and destination group (largest 12 of 35 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 20.1 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) | 10.2 | Claremont Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Emeryville and West Oakland streets (55th to 67th Streets) | 7.8 | Claremont Avenue |
| Telegraph Ave to the south (downtown Oakland) | Telegraph Ave from the north (Berkeley) | 6.6 | Telegraph Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Telegraph Ave from the north (Berkeley) | 5.9 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 5.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Alcatraz Ave from the west (Emeryville side) | 4.0 | Claremont Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Ashby Ave from the west (Emeryville and I-80) | 3.6 | SR-24 then Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Ashby Ave from the west (Emeryville and I-80) | 3.4 | Claremont Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Telegraph Ave from the north (Berkeley) | 3.3 | none near the study area |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 3.2 | College Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Shattuck Ave from the north (Berkeley) | 1.9 | SR-24 then Telegraph Avenue then Alcatraz Avenue |
| other pairs | | 8.6 | |

By the arterial these cars would otherwise use: Telegraph Avenue 40 veh/h; Claremont Avenue 28 veh/h; SR-24 then Telegraph Avenue 5 veh/h; none near the study area 4 veh/h; College Avenue 3 veh/h; SR-24 then Telegraph Avenue then Alcatraz Avenue 2 veh/h.

### Hillegass Avenue NB

Observed (PM): 94 cars entered at the south end, 48 drove the whole street, 109 left it at Alcatraz Ave (43 west, 54 east, 12 straight), and 47% of the block's trips came from a freeway. ASSUMPTION: freeway-origin through cars are 40 veh/h (52 freeway-origin trips times 94 / (94 + 29)), spread over the exits in proportion (0.37); the through share of exits is 48 / 109 = 0.44.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Hillegass Ave to reach Alcatraz Ave west and Telegraph Ave north | OBSERVED turn count x ASSUMPTION share (43 left turns x 0.37) | 16 (9 to 20) | 14 | within |
| SR-24 off-ramp traffic using Hillegass Ave to reach College Ave and Berkeley | OBSERVED turn count x ASSUMPTION share (54 right turns x 0.37) | 20 (11 to 25) | 24 | within |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach Alcatraz Ave west | ASSUMPTION: through exits (43 x 0.44) that are not off-ramp traffic | 3 (0 to 10) | 10 | within |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach College Ave and Berkeley | ASSUMPTION: through exits (54 x 0.44) that are not off-ramp traffic | 4 (0 to 13) | 6 | within |
| Intents listed, together | | 43 (20 to 68) | 54 | |
| Other through cars (no intent listed) | | | 2 | |

Model through cars by origin and destination group (largest 12 of 40 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 13.0 | SR-24 |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 8.6 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 6.0 | SR-24 then Claremont Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | College Ave from the north (Berkeley) | 4.8 | SR-24 then Claremont Avenue then College Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Emeryville and West Oakland streets (55th to 67th Streets) | 4.0 | College Avenue then Alcatraz Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Telegraph Ave from the north (Berkeley) | 2.2 | none near the study area |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) | 2.1 | Claremont Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Ashby Ave from the west (Emeryville and I-80) | 1.5 | SR-24 then Telegraph Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 1.1 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 1.0 | Telegraph Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Claremont Ave and Tunnel Rd toward the hills | 1.0 | Claremont Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Shattuck Ave from the north (Berkeley) | 1.0 | SR-24 then Telegraph Avenue then Alcatraz Avenue |
| other pairs | | 9.9 | |

By the arterial these cars would otherwise use: SR-24 14 veh/h; Telegraph Avenue 12 veh/h; Claremont Avenue 6 veh/h; SR-24 then Claremont Avenue 6 veh/h; SR-24 then Claremont Avenue then College Avenue 5 veh/h; College Avenue then Alcatraz Avenue 4 veh/h.

### Hillegass Avenue SB

Observed (PM): 178 cars entered at the top (76 turned in from Alcatraz Ave west, 98 from the east, 4 came straight from the north), 79 drove the whole street, and 68% of the block's trips (109 veh/h) went to a freeway. ASSUMPTION: freeway-bound cars that did not join mid-street are 87 veh/h (109 x 178 / (178 + 44)), half of the 174 turn-ins; low = the whole-street share of the turn-ins (0.45), high = the freeway-bound share without the mid-street correction (0.63).

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Telegraph Ave, Alcatraz Ave west and West Berkeley traffic turning off Alcatraz Ave onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (76 turn-ins x 0.50) | 38 (34 to 48) | 15 | below |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (98 turn-ins x 0.50) | 49 (44 to 62) | 20 | below |
| Intents listed, together | | 87 (78 to 110) | 35 | |
| Other through cars (no intent listed) | | | 18 | |

Model through cars by origin and destination group (largest 12 of 25 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 14.9 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 10.3 | Claremont Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 9.1 | Alcatraz Avenue then College Avenue then Claremont Avenue |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 5.3 | College Avenue then Claremont Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 3.9 | Claremont Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Telegraph Ave to the south (downtown Oakland) | 2.7 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | West Oakland to the southwest (Adeline St, Market St) | 1.7 | Alcatraz Avenue then Telegraph Avenue |
| College Ave from the north (Berkeley) | Telegraph Ave to the south (downtown Oakland) | 1.2 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Berkeley hills to the northeast (Evergreen Ln, Gravatt Dr) | 0.7 | Alcatraz Avenue then Claremont Avenue |
| Telegraph Ave from the north (Berkeley) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 0.7 | College Avenue |
| Alcatraz Ave from the west (Emeryville side) | Berkeley hills to the northeast (Evergreen Ln, Gravatt Dr) | 0.3 | Alcatraz Avenue then Claremont Avenue |
| College Ave from the north (Berkeley) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 0.3 | College Avenue then Claremont Avenue |
| other pairs | | 1.6 | |

By the arterial these cars would otherwise use: Telegraph Avenue 19 veh/h; Claremont Avenue then SR-24 14 veh/h; Alcatraz Avenue then College Avenue then Claremont Avenue 9 veh/h; College Avenue then Claremont Avenue then SR-24 5 veh/h; Alcatraz Avenue then Telegraph Avenue 2 veh/h; Alcatraz Avenue then Claremont Avenue 2 veh/h.

### Colby Street SB

Observed (PM): 139 cars entered at the top (76 from Alcatraz Ave west, 50 from the east, 13 from the north), 39 drove the whole street, 45% of the block's trips (72 veh/h) went to a freeway and 22% came by way of Telegraph Ave. ASSUMPTION: freeway-bound cars that did not join mid-street are 46 veh/h (72 x 139 / (139 + 79)), 0.365 of the 126 turn-ins; low = the whole-street share (0.31), high = the unadjusted freeway share (0.57). The Telegraph Ave cars are the 22% x 160 = 35 of the 76 west turn-ins.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Southbound Telegraph Ave traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (35 Telegraph Ave cars x 0.365) | 13 (11 to 20) | 18 | within |
| Alcatraz Ave west, Ashby Ave and West Berkeley traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (41 other west turn-ins x 0.365) | 15 (13 to 23) | 14 | within |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (50 east turn-ins x 0.365) | 18 (15 to 29) | 17 | within |
| Intents listed, together | | 46 (39 to 72) | 48 | |
| Other through cars (no intent listed) | | | 32 | |

Model through cars by origin and destination group (largest 12 of 42 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 16.4 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 15.1 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 12.9 | Alcatraz Avenue then College Avenue then Claremont Avenue |
| Shattuck Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 6.2 | none near the study area |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Telegraph Ave to the south (downtown Oakland) | 5.7 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | West Oakland to the southwest (Adeline St, Market St) | 2.8 | Alcatraz Avenue then Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 2.7 | Telegraph Avenue then Alcatraz Avenue then Claremont Avenue |
| Ashby Ave from the west (Emeryville and I-80) | SR-13 Warren Freeway (via SR-24 east) | 2.6 | SR-24 |
| Ashby Ave from the west (Emeryville and I-80) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 2.0 | SR-24 |
| College Ave from the north (Berkeley) | Telegraph Ave to the south (downtown Oakland) | 1.7 | Telegraph Avenue |
| Alcatraz Ave from the west (Emeryville side) | SR-13 Warren Freeway (via SR-24 east) | 1.5 | SR-24 |
| Telegraph Ave from the north (Berkeley) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 1.4 | none near the study area |
| other pairs | | 9.4 | |

By the arterial these cars would otherwise use: Telegraph Avenue 40 veh/h; Alcatraz Avenue then College Avenue then Claremont Avenue 14 veh/h; none near the study area 8 veh/h; SR-24 7 veh/h; Alcatraz Avenue then Telegraph Avenue 3 veh/h; Telegraph Avenue then Alcatraz Avenue then Claremont Avenue 3 veh/h.

### Study area, all residential and service streets

Model: 451 through cars per hour.

Model through cars by origin and destination group (largest 12 of 107 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 37.9 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) | 33.8 | Claremont Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 33.7 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 30.3 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 27.6 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 23.9 | Alcatraz Avenue then College Avenue then Claremont Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Emeryville and West Oakland streets (55th to 67th Streets) | 21.9 | Claremont Avenue |
| Telegraph Ave to the south (downtown Oakland) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 20.1 | Telegraph Avenue then Claremont Avenue |
| Telegraph Ave to the south (downtown Oakland) | SR-24 westbound on-ramps (toward Oakland and I-980) | 19.8 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave to the south (downtown Oakland) | 19.7 | Claremont Avenue then Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 13.1 | SR-24 |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 10.3 | Claremont Avenue then SR-24 |
| other pairs | | 158.5 | |

By the arterial these cars would otherwise use: Telegraph Avenue 186 veh/h; Claremont Avenue 85 veh/h; Alcatraz Avenue then College Avenue then Claremont Avenue 29 veh/h; SR-24 25 veh/h; Telegraph Avenue then Claremont Avenue 20 veh/h; Claremont Avenue then Telegraph Avenue 20 veh/h.

By origin group: South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 116; Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 81; SR-24 eastbound off-ramps (arriving from Oakland and I-980) 77; Telegraph Ave to the south (downtown Oakland) 50; Telegraph Ave from the north (Berkeley) 42; SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) 18; Claremont Ave and Tunnel Rd toward the hills 14; West Oakland to the southwest (Adeline St, Market St) 10; College Ave from the north (Berkeley) 10; Emeryville and West Oakland streets (55th to 67th Streets) 8.

By destination group: SR-24 westbound on-ramps (toward Oakland and I-980) 114; Telegraph Ave from the north (Berkeley) 57; South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 52; Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 42; West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) 35; Telegraph Ave to the south (downtown Oakland) 30; Emeryville and West Oakland streets (55th to 67th Streets) 25; Claremont Ave and Tunnel Rd toward the hills 23; Ashby Ave from the west (Emeryville and I-80) 15; Alcatraz Ave from the west (Emeryville side) 11.


Per-seed detail: `rockridge-am_peak-s1-seed1.md` (seed 1 in full).
