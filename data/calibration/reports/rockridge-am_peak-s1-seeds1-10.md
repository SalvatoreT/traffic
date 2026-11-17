# rockridge-am_peak-s1 over 10 seeds (1, 2, 3, 4, 5, 6, 7, 8, 9, 10)

Seeds are the fixed list above, none chosen; each run is 60 minutes from the same start. Interval = 95% interval of the mean (Student t, n - 1 degrees of freedom). Run-to-run noise only: demand is fixed, so day-to-day variation is not in these intervals.

## Stability rule (design decision D16)

| Check | Rule | Result | Pass |
| --- | --- | --- | --- |
| Cars cleared from gridlock near the study area (judged zone) | mean per hour below 1.00 | 0.00 (min 0.00, max 0.00) | yes |
| Entry backlog | below 2.0% in at least 90% of seeds | 10 of 10 seeds | yes |
| Runaway growth | no seed adds more than 2.0 points of backlog in the second half | none | yes |
| Arterial speed | mean above 4.0 m/s | 9.32 m/s | yes |

**Verdict: stable.** Old rule (zero removals, backlog under 2%, speed above 4 m/s, every seed): 9 of 10 seeds pass.

## Metrics over seeds

| Group | Metric | Unit | Mean | SD | Min | Max | 95% interval |
| --- | --- | --- | --- | --- | --- | --- | --- |
| health | gridlock removals | vehicles | 0.10 | 0.32 | 0.00 | 1.00 | -0.13 to 0.33 |
| health | gridlock removals per hour | veh/h | 0.10 | 0.32 | 0.00 | 1.00 | -0.13 to 0.33 |
| health | entry backlog | % of spawned | 0.03 | 0.03 | 0.00 | 0.09 | 0.01 to 0.06 |
| health | backlog growth in the second half of the run | points of spawned | 0.01 | 0.02 | -0.01 | 0.08 | -0.01 to 0.03 |
| health | completed trips | trips | 22639.90 | 129.45 | 22462.00 | 22825.00 | 22547.31 to 22732.49 |
| health | arterial mean speed | m/s | 9.32 | 0.13 | 9.13 | 9.53 | 9.22 to 9.41 |
| health | arterial mean speed, last 15 min | m/s | 9.39 | 0.15 | 9.14 | 9.68 | 9.28 to 9.49 |
| junction recovery | courtesy admissions per hour | veh/h | 125.80 | 12.85 | 104.00 | 149.00 | 116.61 to 134.99 |
| junction recovery | yield fallback admissions per hour | veh/h | 32.50 | 10.69 | 15.00 | 51.00 | 24.85 to 40.15 |
| junction recovery | conflict bypass admissions per hour | veh/h | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| junction recovery | vehicles removed while held in a node, per hour | veh/h | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| gridlock by place | cars cleared from gridlock per hour, judged (near the study area, and far ones whose chain reaches it) | veh/h | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| gridlock by place | cars cleared from gridlock per hour, near the study area | veh/h | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| gridlock by place | cars cleared from gridlock per hour, farther out | veh/h | 0.10 | 0.32 | 0.00 | 1.00 | -0.13 to 0.33 |
| gridlock by place | cars cleared from gridlock per hour, farther out with a chain into the judged zone | veh/h | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| gridlock by place | trips waiting at origins in the judged zone at the end | trips | 0.40 | 0.70 | 0.00 | 2.00 | -0.10 to 0.90 |
| cut-through | local vehicle-miles, surface gates to the freeway | veh-miles | 20.80 | 3.93 | 14.54 | 28.24 | 17.99 to 23.61 |
| cut-through | share of local vehicle-miles, surface gates to the freeway | % | 5.9 | 0.9 | 4.4 | 7.6 | 5.3 to 6.6 |
| cut-through | local vehicle-miles, freeway to the surface gates | veh-miles | 21.55 | 3.39 | 16.79 | 27.48 | 19.12 to 23.97 |
| cut-through | share of local vehicle-miles, freeway to the surface gates | % | 6.2 | 1.0 | 4.9 | 7.4 | 5.5 to 6.9 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue N | trips | 35.30 | 5.58 | 26.00 | 43.00 | 31.31 to 39.29 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue N | trips | 1008.10 | 20.59 | 968.00 | 1041.00 | 993.37 to 1022.83 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue S | trips | 27.70 | 7.38 | 17.00 | 41.00 | 22.42 to 32.98 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue S | trips | 1279.40 | 34.80 | 1223.00 | 1350.00 | 1254.50 to 1304.30 |
| headline share | Hillegass Avenue NB from freeway | % | 50.7 | 2.1 | 45.8 | 52.8 | 49.2 to 52.2 |
| share | Hillegass Avenue NB to Benvenue Avenue | % | 8.1 | 1.7 | 6.0 | 10.8 | 6.9 to 9.4 |
| share | Hillegass Avenue NB to College Avenue | % | 12.3 | 3.6 | 7.2 | 18.3 | 9.8 to 14.9 |
| share | Hillegass Avenue NB to Alcatraz Avenue WB | % | 32.9 | 4.0 | 27.1 | 39.3 | 30.1 to 35.7 |
| headline share | Colby Street NB from freeway | % | 43.1 | 1.8 | 39.8 | 46.4 | 41.9 to 44.4 |
| share | Colby Street NB to Alcatraz Avenue WB | % | 46.5 | 5.2 | 36.7 | 57.3 | 42.7 to 50.2 |
| share | Colby Street NB to Telegraph Avenue | % | 39.4 | 4.8 | 32.2 | 46.0 | 35.9 to 42.8 |
| share | Colby Street NB to College Avenue | % | 2.7 | 1.3 | 0.0 | 4.5 | 1.8 to 3.7 |
| share | Hillegass Avenue SB from Alcatraz Avenue WB | % | 16.3 | 3.7 | 8.5 | 22.6 | 13.6 to 18.9 |
| share | Hillegass Avenue SB from Benvenue Avenue | % | 1.7 | 0.9 | 0.0 | 3.2 | 1.1 to 2.3 |
| share | Hillegass Avenue SB from College Avenue | % | 11.4 | 3.6 | 5.7 | 17.7 | 8.8 to 13.9 |
| headline share | Hillegass Avenue SB to freeway | % | 59.3 | 3.1 | 54.7 | 64.5 | 57.2 to 61.5 |
| share | Colby Street SB from Alcatraz Avenue EB | % | 21.0 | 2.0 | 17.2 | 22.9 | 19.6 to 22.4 |
| share | Colby Street SB from Alcatraz Avenue WB | % | 6.5 | 1.3 | 4.3 | 8.2 | 5.6 to 7.4 |
| share | Colby Street SB from Telegraph Avenue | % | 18.9 | 4.0 | 9.6 | 24.8 | 16.0 to 21.7 |
| headline share | Colby Street SB to freeway | % | 47.2 | 3.9 | 42.1 | 52.6 | 44.4 to 50.1 |
| share | Colby Street SB to Forest Street | % | 15.8 | 2.9 | 10.8 | 19.7 | 13.8 to 17.9 |
| ramp share | onto freeway via College Avenue | % | 15.9 | 1.1 | 14.6 | 17.9 | 15.1 to 16.6 |
| ramp share | onto freeway via Hillegass Avenue | % | 13.0 | 1.7 | 9.5 | 16.2 | 11.8 to 14.2 |
| ramp share | onto freeway via Martin Street | % | 13.0 | 1.7 | 9.7 | 15.4 | 11.8 to 14.2 |
| ramp share | onto freeway via Colby Street | % | 14.8 | 1.3 | 12.8 | 16.9 | 13.9 to 15.8 |
| ramp share | onto freeway via Telegraph Avenue north of Alcatraz Avenue | % | 8.2 | 1.2 | 6.5 | 10.0 | 7.4 to 9.0 |
| ramp share | onto freeway via Benvenue Avenue | % | 3.8 | 0.8 | 2.7 | 5.6 | 3.2 to 4.3 |
| ramp share | from freeway via College Avenue | % | 9.4 | 1.6 | 7.7 | 13.0 | 8.2 to 10.5 |
| ramp share | from freeway via Martin Street | % | 11.1 | 0.9 | 9.9 | 12.3 | 10.5 to 11.8 |
| ramp share | from freeway via Colby Street | % | 10.0 | 1.3 | 8.2 | 12.3 | 9.1 to 10.9 |
| ramp share | from freeway via Hillegass Avenue | % | 8.5 | 0.8 | 7.0 | 9.5 | 7.9 to 9.0 |
| ramp share | from freeway via Benvenue Avenue | % | 2.4 | 0.5 | 1.6 | 3.3 | 2.0 to 2.7 |
| corridor flow | Telegraph N median link flow | veh/h | 865.32 | 47.02 | 798.00 | 962.40 | 831.69 to 898.95 |
| corridor flow | Telegraph S median link flow | veh/h | 903.00 | 42.71 | 853.20 | 978.00 | 872.45 to 933.55 |
| corridor flow | College N median link flow | veh/h | 275.16 | 23.75 | 252.00 | 338.40 | 258.17 to 292.15 |
| corridor flow | College S median link flow | veh/h | 434.52 | 35.18 | 372.00 | 480.00 | 409.36 to 459.68 |
| corridor flow | Claremont N median link flow | veh/h | 285.12 | 8.34 | 276.00 | 303.60 | 279.16 to 291.08 |
| corridor flow | Claremont S median link flow | veh/h | 402.48 | 29.07 | 374.40 | 465.60 | 381.69 to 423.27 |
| corridor flow | Alcatraz E median link flow | veh/h | 462.12 | 37.73 | 409.20 | 523.20 | 435.13 to 489.11 |
| corridor flow | Alcatraz W median link flow | veh/h | 385.56 | 20.06 | 364.80 | 429.60 | 371.21 to 399.91 |
| corridor flow | Hillegass N median link flow | veh/h | 95.40 | 7.84 | 82.80 | 108.00 | 89.79 to 101.01 |
| corridor flow | Hillegass S median link flow | veh/h | 76.80 | 13.12 | 58.80 | 104.40 | 67.41 to 86.19 |
| corridor flow | Colby N median link flow | veh/h | 108.72 | 8.04 | 98.40 | 126.00 | 102.97 to 114.47 |
| corridor flow | Colby S median link flow | veh/h | 127.80 | 14.63 | 105.60 | 148.80 | 117.33 to 138.27 |
| corridor flow | Martin E median link flow | veh/h | 99.84 | 11.10 | 76.80 | 120.00 | 91.90 to 107.78 |
| corridor flow | Martin W median link flow | veh/h | 97.68 | 10.14 | 78.00 | 111.60 | 90.43 to 104.93 |

## Intent map: through cars by where they come from and where they are going

Through = neither trip end is in the study area. Groups are the approach groups of the area config (data/areas); a node that is not a gate takes the group of the nearest surface gate (ASSUMPTION). The arterial is the one a trip would use on the shortest free-flow path with the study area's residential and service streets closed, where that path runs on a boundary street near the study area.

Model figures are the mean of 10 seed(s), per hour of the run. Basis: OBSERVED = read from the resident volunteer count of Feb 25, 2025 or its headline shares; ASSUMPTION = inferred from those numbers or chosen.

### Colby Street NB

Observed (PM): 182 cars entered at the south end, 102 drove the whole street, 164 left it at Alcatraz Ave (131 left, 32 right, 1 straight), and 47% of the block's trips came from a freeway (the headline share). ASSUMPTION: freeway-origin cars that do not end along the street are 65 veh/h (the 82 freeway-origin trips on the block, 47% of 174, times the 182 / (182 + 47) of its cars that entered at the south end rather than joining on the way), spread over the 164 exits in proportion (0.40); the other through cars come from the Telegraph Ave and south-side approaches that feed the street's south end. Ranges: low = 131 (32) x 0.47 x 0.62 (the whole-street share of exits), high = 131 (32) x 0.47.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | OBSERVED turn count x ASSUMPTION share (131 left turns x 0.40) | 52 (38 to 62) | 36 | below |
| Telegraph Ave and south-side traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | ASSUMPTION: the through left-turners (131 x 0.62 = 81) that are not off-ramp traffic | 29 (19 to 43) | 20 | within |
| SR-24 off-ramp traffic using Colby St to reach College Ave and Berkeley (right at Alcatraz Ave) | OBSERVED turn count x ASSUMPTION share (32 right turns x 0.40) | 13 (9 to 15) | 4 | below |
| Telegraph Ave and south-side traffic using Colby St to reach College Ave and Berkeley | ASSUMPTION: the through right-turners (32 x 0.62 = 20) that are not off-ramp traffic | 7 (5 to 11) | 28 | above |
| Intents listed, together | | 101 (71 to 131) | 88 | |
| Other through cars (no intent listed) | | | 2 | |

Model through cars by origin and destination group (largest 12 of 30 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 36.2 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 25.9 | College Avenue then Alcatraz Avenue |
| Telegraph Ave to the south (downtown Oakland) | Telegraph Ave from the north (Berkeley) | 10.7 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 2.6 | Claremont Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Emeryville and West Oakland streets (55th to 67th Streets) | 2.3 | Claremont Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Ashby Ave from the west (Emeryville and I-80) | 1.9 | Claremont Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 1.8 | Telegraph Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Telegraph Ave from the north (Berkeley) | 1.6 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 1.3 | SR-24 |
| Telegraph Ave to the south (downtown Oakland) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 1.1 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Shattuck Ave from the north (Berkeley) | 0.7 | Claremont Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | College Ave from the north (Berkeley) | 0.5 | Telegraph Avenue |
| other pairs | | 3.5 | |

By the arterial these cars would otherwise use: Telegraph Avenue 53 veh/h; College Avenue then Alcatraz Avenue 26 veh/h; Claremont Avenue 8 veh/h; SR-24 2 veh/h; Alcatraz Avenue then Claremont Avenue 1 veh/h; SR-24 then Telegraph Avenue then Alcatraz Avenue 0 veh/h.

### Hillegass Avenue NB

Observed (PM): 94 cars entered at the south end, 48 drove the whole street, 109 left it at Alcatraz Ave (43 west, 54 east, 12 straight), and 47% of the block's trips came from a freeway. ASSUMPTION: freeway-origin through cars are 40 veh/h (52 freeway-origin trips times 94 / (94 + 29)), spread over the exits in proportion (0.37); the through share of exits is 48 / 109 = 0.44.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Hillegass Ave to reach Alcatraz Ave west and Telegraph Ave north | OBSERVED turn count x ASSUMPTION share (43 left turns x 0.37) | 16 (9 to 20) | 20 | within |
| SR-24 off-ramp traffic using Hillegass Ave to reach College Ave and Berkeley | OBSERVED turn count x ASSUMPTION share (54 right turns x 0.37) | 20 (11 to 25) | 23 | within |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach Alcatraz Ave west | ASSUMPTION: through exits (43 x 0.44) that are not off-ramp traffic | 3 (0 to 10) | 5 | within |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach College Ave and Berkeley | ASSUMPTION: through exits (54 x 0.44) that are not off-ramp traffic | 4 (0 to 13) | 20 | above |
| Intents listed, together | | 43 (20 to 68) | 67 | |
| Other through cars (no intent listed) | | | 2 | |

Model through cars by origin and destination group (largest 12 of 36 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 12.7 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 12.5 | SR-24 |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 12.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 5.2 | SR-24 then Claremont Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | College Ave from the north (Berkeley) | 4.8 | SR-24 then Claremont Avenue then College Avenue |
| Telegraph Ave to the south (downtown Oakland) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 3.9 | Telegraph Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Ashby Ave from the west (Emeryville and I-80) | 2.1 | SR-24 then Telegraph Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | San Pablo Ave (Emeryville and West Oakland) | 1.6 | SR-24 |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Telegraph Ave from the north (Berkeley) | 1.4 | none near the study area |
| Telegraph Ave to the south (downtown Oakland) | College Ave from the north (Berkeley) | 1.4 | Telegraph Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Telegraph Ave from the north (Berkeley) | 1.2 | Telegraph Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Shattuck Ave from the north (Berkeley) | 1.1 | SR-24 then Telegraph Avenue then Alcatraz Avenue |
| other pairs | | 9.1 | |

By the arterial these cars would otherwise use: Telegraph Avenue 32 veh/h; SR-24 14 veh/h; SR-24 then Claremont Avenue 5 veh/h; SR-24 then Claremont Avenue then College Avenue 5 veh/h; Claremont Avenue 4 veh/h; SR-24 then Telegraph Avenue 3 veh/h.

### Hillegass Avenue SB

Observed (PM): 178 cars entered at the top (76 turned in from Alcatraz Ave west, 98 from the east, 4 came straight from the north), 79 drove the whole street, and 68% of the block's trips (109 veh/h) went to a freeway. ASSUMPTION: freeway-bound cars that did not join mid-street are 87 veh/h (109 x 178 / (178 + 44)), half of the 174 turn-ins; low = the whole-street share of the turn-ins (0.45), high = the freeway-bound share without the mid-street correction (0.63).

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Telegraph Ave, Alcatraz Ave west and West Berkeley traffic turning off Alcatraz Ave onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (76 turn-ins x 0.50) | 38 (34 to 48) | 15 | below |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (98 turn-ins x 0.50) | 49 (44 to 62) | 20 | below |
| Intents listed, together | | 87 (78 to 110) | 35 | |
| Other through cars (no intent listed) | | | 34 | |

Model through cars by origin and destination group (largest 12 of 26 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 24.0 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 14.4 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 10.5 | Claremont Avenue then SR-24 |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 4.9 | College Avenue then Claremont Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 4.8 | Claremont Avenue then SR-24 |
| Telegraph Ave from the north (Berkeley) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 2.5 | College Avenue |
| Telegraph Ave from the north (Berkeley) | College Ave from the north (Berkeley) | 2.3 | College Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Telegraph Ave to the south (downtown Oakland) | 1.9 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | West Oakland to the southwest (Adeline St, Market St) | 1.2 | Telegraph Avenue |
| Shattuck Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 0.4 | none near the study area |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | San Pablo Ave (Emeryville and West Oakland) | 0.2 | College Avenue then Alcatraz Avenue |
| College Ave from the north (Berkeley) | Telegraph Ave to the south (downtown Oakland) | 0.2 | Alcatraz Avenue then Telegraph Avenue |
| other pairs | | 1.8 | |

By the arterial these cars would otherwise use: Telegraph Avenue 42 veh/h; Claremont Avenue then SR-24 15 veh/h; College Avenue then Claremont Avenue then SR-24 5 veh/h; College Avenue 5 veh/h; none near the study area 1 veh/h; Alcatraz Avenue then Claremont Avenue 0 veh/h.

### Colby Street SB

Observed (PM): 139 cars entered at the top (76 from Alcatraz Ave west, 50 from the east, 13 from the north), 39 drove the whole street, 45% of the block's trips (72 veh/h) went to a freeway and 22% came by way of Telegraph Ave. ASSUMPTION: freeway-bound cars that did not join mid-street are 46 veh/h (72 x 139 / (139 + 79)), 0.365 of the 126 turn-ins; low = the whole-street share (0.31), high = the unadjusted freeway share (0.57). The Telegraph Ave cars are the 22% x 160 = 35 of the 76 west turn-ins.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Southbound Telegraph Ave traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (35 Telegraph Ave cars x 0.365) | 13 (11 to 20) | 16 | within |
| Alcatraz Ave west, Ashby Ave and West Berkeley traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (41 other west turn-ins x 0.365) | 15 (13 to 23) | 18 | within |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (50 east turn-ins x 0.365) | 18 (15 to 29) | 10 | below |
| Intents listed, together | | 46 (39 to 72) | 44 | |
| Other through cars (no intent listed) | | | 46 | |

Model through cars by origin and destination group (largest 12 of 47 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 28.7 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 13.9 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 7.6 | Telegraph Avenue |
| Shattuck Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 7.0 | none near the study area |
| Ashby Ave from the west (Emeryville and I-80) | SR-13 Warren Freeway (via SR-24 east) | 3.7 | SR-24 |
| Telegraph Ave from the north (Berkeley) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 3.2 | Telegraph Avenue |
| Ashby Ave from the west (Emeryville and I-80) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 2.9 | SR-24 |
| Telegraph Ave from the north (Berkeley) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 2.6 | none near the study area |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | West Oakland to the southwest (Adeline St, Market St) | 2.5 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Telegraph Ave to the south (downtown Oakland) | 2.4 | Telegraph Avenue |
| Alcatraz Ave from the west (Emeryville side) | SR-13 Warren Freeway (via SR-24 east) | 2.1 | SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 1.6 | Telegraph Avenue |
| other pairs | | 11.4 | |

By the arterial these cars would otherwise use: Telegraph Avenue 60 veh/h; none near the study area 12 veh/h; SR-24 10 veh/h; College Avenue then Claremont Avenue then SR-24 2 veh/h; Alcatraz Avenue then Telegraph Avenue 1 veh/h; College Avenue 1 veh/h.

### Study area, all residential and service streets

Model: 462 through cars per hour.

Model through cars by origin and destination group (largest 12 of 94 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 70.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 60.9 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 46.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 33.6 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 27.2 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 14.3 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 13.5 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 12.6 | SR-24 |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Emeryville and West Oakland streets (55th to 67th Streets) | 11.4 | Claremont Avenue |
| Telegraph Ave to the south (downtown Oakland) | Telegraph Ave from the north (Berkeley) | 10.9 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 10.6 | Claremont Avenue then SR-24 |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Ashby Ave from the west (Emeryville and I-80) | 10.6 | Claremont Avenue |
| other pairs | | 140.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 314 veh/h; Claremont Avenue 40 veh/h; SR-24 24 veh/h; none near the study area 22 veh/h; Claremont Avenue then SR-24 11 veh/h; Alcatraz Avenue then College Avenue 9 veh/h.

By origin group: Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 119; South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 102; SR-24 eastbound off-ramps (arriving from Oakland and I-980) 78; Telegraph Ave from the north (Berkeley) 48; Telegraph Ave to the south (downtown Oakland) 34; Claremont Ave and Tunnel Rd toward the hills 12; West Oakland to the southwest (Adeline St, Market St) 11; Shattuck Ave from the north (Berkeley) 10; Ashby Ave from the west (Emeryville and I-80) 9; Emeryville and West Oakland streets (55th to 67th Streets) 8.

By destination group: South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 108; SR-24 westbound on-ramps (toward Oakland and I-980) 94; Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 89; Telegraph Ave from the north (Berkeley) 68; Claremont Ave and Tunnel Rd toward the hills 18; College Ave from the north (Berkeley) 17; Emeryville and West Oakland streets (55th to 67th Streets) 13; Ashby Ave from the west (Emeryville and I-80) 13; Telegraph Ave to the south (downtown Oakland) 9; Shattuck Ave from the north (Berkeley) 8.


Per-seed detail: `rockridge-am_peak-s1-seed1.md` (seed 1 in full).
