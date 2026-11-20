# rockridge-am_peak-s1 over 10 seeds (1, 2, 3, 4, 5, 6, 7, 8, 9, 10)

Seeds are the fixed list above, none chosen; each run is 60 minutes from the same start. Interval = 95% interval of the mean (Student t, n - 1 degrees of freedom). Run-to-run noise only: demand is fixed, so day-to-day variation is not in these intervals.

## Stability rule (design decision D16)

| Check | Rule | Result | Pass |
| --- | --- | --- | --- |
| Cars cleared from gridlock near the study area (judged zone) | mean per hour below 1.00 | 0.00 (min 0.00, max 0.00) | yes |
| Entry backlog | below 2.0% in at least 90% of seeds | 10 of 10 seeds | yes |
| Runaway growth | no seed adds more than 2.0 points of backlog in the second half | none | yes |
| Arterial speed | mean above 4.0 m/s | 8.78 m/s | yes |

**Verdict: stable.** Old rule (zero removals, backlog under 2%, speed above 4 m/s, every seed): 7 of 10 seeds pass.

## Metrics over seeds

| Group | Metric | Unit | Mean | SD | Min | Max | 95% interval |
| --- | --- | --- | --- | --- | --- | --- | --- |
| health | gridlock removals | vehicles | 0.40 | 0.70 | 0.00 | 2.00 | -0.10 to 0.90 |
| health | gridlock removals per hour | veh/h | 0.40 | 0.70 | 0.00 | 2.00 | -0.10 to 0.90 |
| health | entry backlog | % of spawned | 0.29 | 0.22 | 0.00 | 0.64 | 0.13 to 0.44 |
| health | backlog growth in the second half of the run | points of spawned | 0.17 | 0.16 | -0.02 | 0.45 | 0.06 to 0.29 |
| health | completed trips | trips | 21556.40 | 140.79 | 21312.00 | 21747.00 | 21455.69 to 21657.11 |
| health | arterial mean speed | m/s | 8.78 | 0.06 | 8.72 | 8.92 | 8.74 to 8.82 |
| health | arterial mean speed, last 15 min | m/s | 8.65 | 0.10 | 8.54 | 8.82 | 8.58 to 8.72 |
| junction recovery | courtesy admissions per hour | veh/h | 126.80 | 12.97 | 104.00 | 145.00 | 117.52 to 136.08 |
| junction recovery | yield fallback admissions per hour | veh/h | 59.90 | 8.96 | 44.00 | 76.00 | 53.49 to 66.31 |
| junction recovery | conflict bypass admissions per hour | veh/h | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| junction recovery | vehicles removed while held in a node, per hour | veh/h | 0.10 | 0.32 | 0.00 | 1.00 | -0.13 to 0.33 |
| gridlock by place | cars cleared from gridlock per hour, judged (near the study area, and far ones whose chain reaches it) | veh/h | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| gridlock by place | cars cleared from gridlock per hour, near the study area | veh/h | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| gridlock by place | cars cleared from gridlock per hour, farther out | veh/h | 0.40 | 0.70 | 0.00 | 2.00 | -0.10 to 0.90 |
| gridlock by place | cars cleared from gridlock per hour, farther out with a chain into the judged zone | veh/h | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| gridlock by place | trips waiting at origins in the judged zone at the end | trips | 0.60 | 0.97 | 0.00 | 3.00 | -0.09 to 1.29 |
| cut-through | local vehicle-miles, surface gates to the freeway | veh-miles | 19.96 | 3.11 | 16.55 | 26.13 | 17.73 to 22.18 |
| cut-through | share of local vehicle-miles, surface gates to the freeway | % | 6.6 | 1.0 | 5.4 | 8.4 | 5.9 to 7.3 |
| cut-through | local vehicle-miles, freeway to the surface gates | veh-miles | 21.10 | 2.70 | 15.69 | 25.09 | 19.17 to 23.02 |
| cut-through | share of local vehicle-miles, freeway to the surface gates | % | 7.0 | 0.9 | 5.0 | 8.1 | 6.3 to 7.6 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue N | trips | 31.40 | 4.01 | 25.00 | 38.00 | 28.53 to 34.27 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue N | trips | 882.50 | 37.57 | 839.00 | 965.00 | 855.63 to 909.37 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue S | trips | 30.40 | 2.63 | 27.00 | 36.00 | 28.52 to 32.28 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue S | trips | 961.40 | 35.79 | 897.00 | 1004.00 | 935.80 to 987.00 |
| headline share | Hillegass Avenue NB from freeway | % | 51.7 | 4.1 | 48.1 | 59.7 | 48.8 to 54.6 |
| share | Hillegass Avenue NB to Benvenue Avenue | % | 10.4 | 2.4 | 7.2 | 13.7 | 8.6 to 12.1 |
| share | Hillegass Avenue NB to College Avenue | % | 15.6 | 3.1 | 11.6 | 21.1 | 13.4 to 17.9 |
| share | Hillegass Avenue NB to Alcatraz Avenue WB | % | 36.4 | 3.8 | 29.3 | 40.5 | 33.6 to 39.1 |
| headline share | Colby Street NB from freeway | % | 51.2 | 4.0 | 45.5 | 57.4 | 48.3 to 54.1 |
| share | Colby Street NB to Alcatraz Avenue WB | % | 45.8 | 4.0 | 38.9 | 52.5 | 43.0 to 48.6 |
| share | Colby Street NB to Telegraph Avenue | % | 39.5 | 3.8 | 34.2 | 44.6 | 36.8 to 42.2 |
| share | Colby Street NB to College Avenue | % | 3.1 | 1.4 | 1.1 | 4.9 | 2.0 to 4.1 |
| share | Hillegass Avenue SB from Alcatraz Avenue WB | % | 21.9 | 2.7 | 18.3 | 27.8 | 20.0 to 23.9 |
| share | Hillegass Avenue SB from Benvenue Avenue | % | 3.5 | 1.3 | 1.7 | 5.1 | 2.6 to 4.4 |
| share | Hillegass Avenue SB from College Avenue | % | 10.2 | 2.0 | 5.5 | 12.4 | 8.7 to 11.6 |
| headline share | Hillegass Avenue SB to freeway | % | 56.3 | 5.1 | 50.0 | 65.8 | 52.7 to 59.9 |
| share | Colby Street SB from Alcatraz Avenue EB | % | 18.8 | 2.6 | 14.9 | 23.7 | 17.0 to 20.6 |
| share | Colby Street SB from Alcatraz Avenue WB | % | 16.1 | 3.8 | 8.8 | 22.5 | 13.4 to 18.8 |
| share | Colby Street SB from Telegraph Avenue | % | 14.3 | 3.2 | 8.9 | 20.5 | 12.1 to 16.6 |
| headline share | Colby Street SB to freeway | % | 38.5 | 2.8 | 35.0 | 42.9 | 36.5 to 40.5 |
| share | Colby Street SB to Forest Street | % | 22.8 | 4.3 | 16.4 | 29.6 | 19.7 to 25.8 |
| ramp share | onto freeway via College Avenue | % | 21.2 | 1.7 | 19.1 | 24.3 | 20.0 to 22.4 |
| ramp share | onto freeway via Hillegass Avenue | % | 17.3 | 1.4 | 15.5 | 19.9 | 16.3 to 18.4 |
| ramp share | onto freeway via Martin Street | % | 14.1 | 1.7 | 11.3 | 17.0 | 12.9 to 15.4 |
| ramp share | onto freeway via Colby Street | % | 14.6 | 1.6 | 12.4 | 17.9 | 13.5 to 15.7 |
| ramp share | onto freeway via Telegraph Avenue north of Alcatraz Avenue | % | 9.8 | 1.2 | 7.5 | 11.8 | 8.9 to 10.7 |
| ramp share | onto freeway via Benvenue Avenue | % | 7.0 | 1.3 | 4.3 | 8.9 | 6.1 to 7.9 |
| ramp share | from freeway via College Avenue | % | 9.4 | 1.0 | 7.7 | 10.9 | 8.7 to 10.1 |
| ramp share | from freeway via Martin Street | % | 12.6 | 1.0 | 10.6 | 13.6 | 11.9 to 13.3 |
| ramp share | from freeway via Colby Street | % | 11.8 | 1.5 | 10.1 | 14.3 | 10.7 to 12.9 |
| ramp share | from freeway via Hillegass Avenue | % | 8.2 | 1.1 | 6.3 | 10.1 | 7.4 to 8.9 |
| ramp share | from freeway via Benvenue Avenue | % | 2.5 | 0.5 | 1.7 | 3.2 | 2.2 to 2.9 |
| corridor flow | Telegraph N median link flow | veh/h | 804.36 | 40.56 | 752.40 | 864.00 | 775.34 to 833.38 |
| corridor flow | Telegraph S median link flow | veh/h | 876.60 | 41.60 | 799.20 | 933.60 | 846.84 to 906.36 |
| corridor flow | College N median link flow | veh/h | 209.88 | 18.03 | 169.20 | 240.00 | 196.99 to 222.77 |
| corridor flow | College S median link flow | veh/h | 369.12 | 30.00 | 345.60 | 446.40 | 347.66 to 390.58 |
| corridor flow | Claremont N median link flow | veh/h | 419.28 | 25.85 | 361.20 | 446.40 | 400.79 to 437.77 |
| corridor flow | Claremont S median link flow | veh/h | 422.16 | 17.51 | 399.60 | 453.60 | 409.64 to 434.68 |
| corridor flow | Alcatraz E median link flow | veh/h | 435.00 | 26.92 | 378.00 | 477.60 | 415.74 to 454.26 |
| corridor flow | Alcatraz W median link flow | veh/h | 411.36 | 16.99 | 382.80 | 433.20 | 399.21 to 423.51 |
| corridor flow | Hillegass N median link flow | veh/h | 73.08 | 7.01 | 61.20 | 84.00 | 68.07 to 78.09 |
| corridor flow | Hillegass S median link flow | veh/h | 75.36 | 7.15 | 62.40 | 86.40 | 70.24 to 80.48 |
| corridor flow | Colby N median link flow | veh/h | 100.68 | 10.41 | 84.00 | 116.40 | 93.24 to 108.12 |
| corridor flow | Colby S median link flow | veh/h | 127.32 | 15.43 | 104.40 | 151.20 | 116.28 to 138.36 |
| corridor flow | Martin E median link flow | veh/h | 92.88 | 8.06 | 74.40 | 103.20 | 87.11 to 98.65 |
| corridor flow | Martin W median link flow | veh/h | 119.40 | 7.53 | 104.40 | 126.00 | 114.01 to 124.79 |

## Intent map: through cars by where they come from and where they are going

Through = neither trip end is in the study area. Groups are the approach groups of the area config (data/areas); a node that is not a gate takes the group of the nearest surface gate (ASSUMPTION). The arterial is the one a trip would use on the shortest free-flow path with the study area's residential and service streets closed, where that path runs on a boundary street near the study area.

Model figures are the mean of 10 seed(s), per hour of the run. Basis: OBSERVED = read from the resident volunteer count of Feb 25, 2025 or its headline shares; ASSUMPTION = inferred from those numbers or chosen.

### Colby Street NB

Observed (PM): 182 cars entered at the south end, 102 drove the whole street, 164 left it at Alcatraz Ave (131 left, 32 right, 1 straight), and 47% of the block's trips came from a freeway (the headline share). ASSUMPTION: freeway-origin cars that do not end along the street are 65 veh/h (the 82 freeway-origin trips on the block, 47% of 174, times the 182 / (182 + 47) of its cars that entered at the south end rather than joining on the way), spread over the 164 exits in proportion (0.40); the other through cars come from the Telegraph Ave and south-side approaches that feed the street's south end. Ranges: low = 131 (32) x 0.47 x 0.62 (the whole-street share of exits), high = 131 (32) x 0.47.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | OBSERVED turn count x ASSUMPTION share (131 left turns x 0.40) | 52 (38 to 62) | 38 | within |
| Telegraph Ave and south-side traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | ASSUMPTION: the through left-turners (131 x 0.62 = 81) that are not off-ramp traffic | 29 (19 to 43) | 19 | within |
| SR-24 off-ramp traffic using Colby St to reach College Ave and Berkeley (right at Alcatraz Ave) | OBSERVED turn count x ASSUMPTION share (32 right turns x 0.40) | 13 (9 to 15) | 5 | below |
| Telegraph Ave and south-side traffic using Colby St to reach College Ave and Berkeley | ASSUMPTION: the through right-turners (32 x 0.62 = 20) that are not off-ramp traffic | 7 (5 to 11) | 15 | above |
| Intents listed, together | | 101 (71 to 131) | 77 | |
| Other through cars (no intent listed) | | | 3 | |

Model through cars by origin and destination group (largest 12 of 30 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 38.2 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 10.6 | Telegraph Avenue |
| Telegraph Ave to the south (downtown Oakland) | Telegraph Ave from the north (Berkeley) | 6.4 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Ashby Ave from the west (Emeryville and I-80) | 5.3 | Claremont Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Telegraph Ave from the north (Berkeley) | 4.6 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 3.0 | Telegraph Avenue |
| Telegraph Ave to the south (downtown Oakland) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 2.4 | Telegraph Avenue |
| College Ave from the north (Berkeley) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 1.1 | College Avenue then Alcatraz Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 1.1 | Telegraph Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Claremont Ave and Tunnel Rd toward the hills | 1.0 | Claremont Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | College Ave from the north (Berkeley) | 1.0 | SR-24 then Claremont Avenue then College Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Alcatraz Ave from the west (Emeryville side) | 0.9 | Claremont Avenue |
| other pairs | | 4.7 | |

By the arterial these cars would otherwise use: Telegraph Avenue 67 veh/h; Claremont Avenue 8 veh/h; College Avenue then Alcatraz Avenue 1 veh/h; SR-24 then Claremont Avenue then College Avenue 1 veh/h; Alcatraz Avenue then College Avenue 1 veh/h; Alcatraz Avenue then Claremont Avenue 1 veh/h.

### Hillegass Avenue NB

Observed (PM): 94 cars entered at the south end, 48 drove the whole street, 109 left it at Alcatraz Ave (43 west, 54 east, 12 straight), and 47% of the block's trips came from a freeway. ASSUMPTION: freeway-origin through cars are 40 veh/h (52 freeway-origin trips times 94 / (94 + 29)), spread over the exits in proportion (0.37); the through share of exits is 48 / 109 = 0.44.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Hillegass Ave to reach Alcatraz Ave west and Telegraph Ave north | OBSERVED turn count x ASSUMPTION share (43 left turns x 0.37) | 16 (9 to 20) | 19 | within |
| SR-24 off-ramp traffic using Hillegass Ave to reach College Ave and Berkeley | OBSERVED turn count x ASSUMPTION share (54 right turns x 0.37) | 20 (11 to 25) | 22 | within |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach Alcatraz Ave west | ASSUMPTION: through exits (43 x 0.44) that are not off-ramp traffic | 3 (0 to 10) | 5 | within |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach College Ave and Berkeley | ASSUMPTION: through exits (54 x 0.44) that are not off-ramp traffic | 4 (0 to 13) | 14 | within |
| Intents listed, together | | 43 (20 to 68) | 60 | |
| Other through cars (no intent listed) | | | 3 | |

Model through cars by origin and destination group (largest 12 of 38 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 13.7 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 11.3 | SR-24 |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 6.1 | SR-24 then Claremont Avenue |
| Telegraph Ave to the south (downtown Oakland) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 5.4 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | College Ave from the north (Berkeley) | 4.9 | SR-24 then Claremont Avenue then College Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 3.2 | Telegraph Avenue |
| College Ave from the north (Berkeley) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 1.5 | College Avenue then Alcatraz Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Telegraph Ave from the north (Berkeley) | 1.5 | none near the study area |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 1.4 | Telegraph Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Claremont Ave and Tunnel Rd toward the hills | 1.3 | Claremont Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Telegraph Ave from the north (Berkeley) | 1.1 | Telegraph Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Alcatraz Ave from the west (Emeryville side) | 1.1 | SR-24 then Telegraph Avenue |
| other pairs | | 10.2 | |

By the arterial these cars would otherwise use: Telegraph Avenue 27 veh/h; SR-24 12 veh/h; SR-24 then Claremont Avenue 6 veh/h; SR-24 then Claremont Avenue then College Avenue 5 veh/h; Claremont Avenue 4 veh/h; SR-24 then Telegraph Avenue 2 veh/h.

### Hillegass Avenue SB

Observed (PM): 178 cars entered at the top (76 turned in from Alcatraz Ave west, 98 from the east, 4 came straight from the north), 79 drove the whole street, and 68% of the block's trips (109 veh/h) went to a freeway. ASSUMPTION: freeway-bound cars that did not join mid-street are 87 veh/h (109 x 178 / (178 + 44)), half of the 174 turn-ins; low = the whole-street share of the turn-ins (0.45), high = the freeway-bound share without the mid-street correction (0.63).

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Telegraph Ave, Alcatraz Ave west and West Berkeley traffic turning off Alcatraz Ave onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (76 turn-ins x 0.50) | 38 (34 to 48) | 13 | below |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (98 turn-ins x 0.50) | 49 (44 to 62) | 26 | below |
| Intents listed, together | | 87 (78 to 110) | 38 | |
| Other through cars (no intent listed) | | | 18 | |

Model through cars by origin and destination group (largest 12 of 23 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 15.2 | Alcatraz Avenue then College Avenue then Claremont Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 12.8 | Claremont Avenue then SR-24 |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 11.5 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 8.0 | Claremont Avenue then SR-24 |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 5.1 | College Avenue then Claremont Avenue then SR-24 |
| Shattuck Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 0.9 | none near the study area |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Claremont Ave and Tunnel Rd toward the hills | 0.6 | Alcatraz Avenue then Claremont Avenue |
| Ashby Ave from the west (Emeryville and I-80) | Berkeley hills to the northeast (Evergreen Ln, Gravatt Dr) | 0.4 | none near the study area |
| Telegraph Ave from the north (Berkeley) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 0.4 | Telegraph Avenue |
| San Pablo Ave (Emeryville and West Oakland) | Claremont Ave and Tunnel Rd toward the hills | 0.3 | Alcatraz Avenue then Claremont Avenue |
| Emeryville and West Oakland streets (55th to 67th Streets) | Claremont Ave and Tunnel Rd toward the hills | 0.2 | Telegraph Avenue then Alcatraz Avenue then Claremont Avenue |
| Alcatraz Ave from the west (Emeryville side) | Claremont Ave and Tunnel Rd toward the hills | 0.1 | SR-24 |
| other pairs | | 1.1 | |

By the arterial these cars would otherwise use: Claremont Avenue then SR-24 21 veh/h; Alcatraz Avenue then College Avenue then Claremont Avenue 15 veh/h; Telegraph Avenue 12 veh/h; College Avenue then Claremont Avenue then SR-24 5 veh/h; none near the study area 2 veh/h; Alcatraz Avenue then Claremont Avenue 1 veh/h.

### Colby Street SB

Observed (PM): 139 cars entered at the top (76 from Alcatraz Ave west, 50 from the east, 13 from the north), 39 drove the whole street, 45% of the block's trips (72 veh/h) went to a freeway and 22% came by way of Telegraph Ave. ASSUMPTION: freeway-bound cars that did not join mid-street are 46 veh/h (72 x 139 / (139 + 79)), 0.365 of the 126 turn-ins; low = the whole-street share (0.31), high = the unadjusted freeway share (0.57). The Telegraph Ave cars are the 22% x 160 = 35 of the 76 west turn-ins.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Southbound Telegraph Ave traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (35 Telegraph Ave cars x 0.365) | 13 (11 to 20) | 12 | within |
| Alcatraz Ave west, Ashby Ave and West Berkeley traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (41 other west turn-ins x 0.365) | 15 (13 to 23) | 19 | within |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (50 east turn-ins x 0.365) | 18 (15 to 29) | 11 | below |
| Intents listed, together | | 46 (39 to 72) | 41 | |
| Other through cars (no intent listed) | | | 31 | |

Model through cars by origin and destination group (largest 12 of 52 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 15.7 | Alcatraz Avenue then College Avenue then Claremont Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 10.4 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 9.2 | Telegraph Avenue |
| Shattuck Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 8.1 | none near the study area |
| Ashby Ave from the west (Emeryville and I-80) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 3.8 | SR-24 |
| Ashby Ave from the west (Emeryville and I-80) | SR-13 Warren Freeway (via SR-24 east) | 3.1 | SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | San Pablo Ave (Emeryville and West Oakland) | 2.2 | Alcatraz Avenue |
| Telegraph Ave from the north (Berkeley) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 2.2 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 1.5 | none near the study area |
| Alcatraz Ave from the west (Emeryville side) | SR-13 Warren Freeway (via SR-24 east) | 1.4 | SR-24 |
| Alcatraz Ave from the west (Emeryville side) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 1.4 | SR-24 |
| Claremont Ave and Tunnel Rd toward the hills | San Pablo Ave (Emeryville and West Oakland) | 1.3 | Claremont Avenue then Alcatraz Avenue |
| other pairs | | 12.3 | |

By the arterial these cars would otherwise use: Telegraph Avenue 23 veh/h; Alcatraz Avenue then College Avenue then Claremont Avenue 16 veh/h; none near the study area 12 veh/h; SR-24 11 veh/h; Claremont Avenue then Alcatraz Avenue 4 veh/h; Alcatraz Avenue then Claremont Avenue 2 veh/h.

### Study area, all residential and service streets

Model: 394 through cars per hour.

Model through cars by origin and destination group (largest 12 of 94 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 47.1 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 39.7 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 38.2 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 34.3 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Ashby Ave from the west (Emeryville and I-80) | 25.7 | Claremont Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 22.6 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 15.3 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 12.8 | Claremont Avenue then SR-24 |
| Telegraph Ave to the south (downtown Oakland) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 11.5 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 11.4 | SR-24 |
| Telegraph Ave from the north (Berkeley) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 9.3 | Telegraph Avenue |
| Shattuck Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 8.5 | none near the study area |
| other pairs | | 117.5 | |

By the arterial these cars would otherwise use: Telegraph Avenue 242 veh/h; Claremont Avenue 50 veh/h; SR-24 25 veh/h; none near the study area 20 veh/h; Claremont Avenue then SR-24 13 veh/h; Alcatraz Avenue then Claremont Avenue 12 veh/h.

By origin group: Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 86; SR-24 eastbound off-ramps (arriving from Oakland and I-980) 79; South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 78; Telegraph Ave from the north (Berkeley) 34; Telegraph Ave to the south (downtown Oakland) 26; Claremont Ave and Tunnel Rd toward the hills 18; West Oakland to the southwest (Adeline St, Market St) 12; Emeryville and West Oakland streets (55th to 67th Streets) 9; College Ave from the north (Berkeley) 9; Ashby Ave from the west (Emeryville and I-80) 9.

By destination group: SR-24 westbound on-ramps (toward Oakland and I-980) 99; Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 68; Telegraph Ave from the north (Berkeley) 65; South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 52; Ashby Ave from the west (Emeryville and I-80) 27; Claremont Ave and Tunnel Rd toward the hills 26; San Pablo Ave (Emeryville and West Oakland) 10; College Ave from the north (Berkeley) 9; Emeryville and West Oakland streets (55th to 67th Streets) 9; SR-24 eastbound on-ramps (toward the Caldecott Tunnel) 8.


Per-seed detail: `rockridge-am_peak-s1-seed1.md` (seed 1 in full).
