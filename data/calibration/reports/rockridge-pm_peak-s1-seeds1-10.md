# rockridge-pm_peak-s1 over 10 seeds (1, 2, 3, 4, 5, 6, 7, 8, 9, 10)

Seeds are the fixed list above, none chosen; each run is 60 minutes from the same start. Interval = 95% interval of the mean (Student t, n - 1 degrees of freedom). Run-to-run noise only: demand is fixed, so day-to-day variation is not in these intervals.

## Stability rule (design decision D16)

| Check | Rule | Result | Pass |
| --- | --- | --- | --- |
| Cars cleared from gridlock near the study area (judged zone) | mean per hour below 1.00 | 0.10 (min 0.00, max 1.00) | yes |
| Entry backlog | below 2.0% in at least 90% of seeds | 10 of 10 seeds | yes |
| Runaway growth | no seed adds more than 2.0 points of backlog in the second half | none | yes |
| Arterial speed | mean above 4.0 m/s | 8.27 m/s | yes |

**Verdict: stable.** Old rule (zero removals, backlog under 2%, speed above 4 m/s, every seed): 1 of 10 seeds pass.

## Metrics over seeds

| Group | Metric | Unit | Mean | SD | Min | Max | 95% interval |
| --- | --- | --- | --- | --- | --- | --- | --- |
| health | gridlock removals | vehicles | 2.00 | 1.33 | 0.00 | 5.00 | 1.05 to 2.95 |
| health | gridlock removals per hour | veh/h | 2.00 | 1.33 | 0.00 | 5.00 | 1.05 to 2.95 |
| health | entry backlog | % of spawned | 0.70 | 0.25 | 0.33 | 1.08 | 0.52 to 0.88 |
| health | backlog growth in the second half of the run | points of spawned | 0.41 | 0.17 | 0.18 | 0.68 | 0.29 to 0.53 |
| health | completed trips | trips | 25839.50 | 196.31 | 25482.00 | 26047.00 | 25699.08 to 25979.92 |
| health | arterial mean speed | m/s | 8.27 | 0.16 | 8.02 | 8.55 | 8.16 to 8.39 |
| health | arterial mean speed, last 15 min | m/s | 8.03 | 0.28 | 7.52 | 8.45 | 7.83 to 8.23 |
| junction recovery | courtesy admissions per hour | veh/h | 278.50 | 24.16 | 247.00 | 314.00 | 261.22 to 295.78 |
| junction recovery | yield fallback admissions per hour | veh/h | 121.00 | 18.31 | 96.00 | 151.00 | 107.90 to 134.10 |
| junction recovery | conflict bypass admissions per hour | veh/h | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| junction recovery | vehicles removed while held in a node, per hour | veh/h | 0.10 | 0.32 | 0.00 | 1.00 | -0.13 to 0.33 |
| gridlock by place | cars cleared from gridlock per hour, judged (near the study area, and far ones whose chain reaches it) | veh/h | 0.10 | 0.32 | 0.00 | 1.00 | -0.13 to 0.33 |
| gridlock by place | cars cleared from gridlock per hour, near the study area | veh/h | 0.10 | 0.32 | 0.00 | 1.00 | -0.13 to 0.33 |
| gridlock by place | cars cleared from gridlock per hour, farther out | veh/h | 1.90 | 1.10 | 0.00 | 4.00 | 1.11 to 2.69 |
| gridlock by place | cars cleared from gridlock per hour, farther out with a chain into the judged zone | veh/h | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| gridlock by place | trips waiting at origins in the judged zone at the end | trips | 0.90 | 1.29 | 0.00 | 4.00 | -0.02 to 1.82 |
| cut-through | local vehicle-miles, surface gates to the freeway | veh-miles | 41.69 | 6.38 | 29.56 | 52.35 | 37.13 to 46.25 |
| cut-through | share of local vehicle-miles, surface gates to the freeway | % | 8.6 | 1.3 | 6.4 | 10.4 | 7.7 to 9.5 |
| cut-through | local vehicle-miles, freeway to the surface gates | veh-miles | 34.40 | 3.29 | 29.90 | 39.04 | 32.05 to 36.76 |
| cut-through | share of local vehicle-miles, freeway to the surface gates | % | 7.1 | 0.7 | 6.2 | 8.0 | 6.6 to 7.6 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue N | trips | 44.00 | 4.06 | 40.00 | 51.00 | 41.10 to 46.90 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue N | trips | 1522.60 | 26.10 | 1478.00 | 1554.00 | 1503.93 to 1541.27 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue S | trips | 74.50 | 11.00 | 57.00 | 90.00 | 66.63 to 82.37 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue S | trips | 1342.80 | 26.62 | 1311.00 | 1386.00 | 1323.76 to 1361.84 |
| headline share | Hillegass Avenue NB from freeway | % | 52.9 | 3.6 | 46.4 | 57.8 | 50.3 to 55.5 |
| share | Hillegass Avenue NB to Benvenue Avenue | % | 3.0 | 1.0 | 0.9 | 4.3 | 2.3 to 3.7 |
| share | Hillegass Avenue NB to College Avenue | % | 16.1 | 2.6 | 12.3 | 21.2 | 14.3 to 17.9 |
| share | Hillegass Avenue NB to Alcatraz Avenue WB | % | 27.6 | 2.8 | 23.3 | 31.5 | 25.6 to 29.6 |
| headline share | Colby Street NB from freeway | % | 50.7 | 3.1 | 45.5 | 54.7 | 48.5 to 53.0 |
| share | Colby Street NB to Alcatraz Avenue WB | % | 45.8 | 4.2 | 38.8 | 52.0 | 42.8 to 48.8 |
| share | Colby Street NB to Telegraph Avenue | % | 34.1 | 3.0 | 29.1 | 38.7 | 31.9 to 36.2 |
| share | Colby Street NB to College Avenue | % | 6.4 | 2.2 | 4.0 | 10.1 | 4.8 to 7.9 |
| share | Hillegass Avenue SB from Alcatraz Avenue WB | % | 32.3 | 2.7 | 26.3 | 34.9 | 30.3 to 34.2 |
| share | Hillegass Avenue SB from Benvenue Avenue | % | 8.2 | 2.0 | 5.5 | 11.4 | 6.7 to 9.6 |
| share | Hillegass Avenue SB from College Avenue | % | 20.0 | 3.4 | 16.5 | 26.1 | 17.6 to 22.5 |
| headline share | Hillegass Avenue SB to freeway | % | 59.2 | 3.0 | 53.2 | 61.8 | 57.1 to 61.4 |
| share | Colby Street SB from Alcatraz Avenue EB | % | 24.8 | 2.1 | 21.4 | 27.6 | 23.3 to 26.4 |
| share | Colby Street SB from Alcatraz Avenue WB | % | 12.3 | 1.9 | 9.9 | 15.6 | 11.0 to 13.7 |
| share | Colby Street SB from Telegraph Avenue | % | 22.3 | 2.9 | 17.4 | 25.6 | 20.2 to 24.3 |
| headline share | Colby Street SB to freeway | % | 38.5 | 4.0 | 33.0 | 45.5 | 35.7 to 41.4 |
| share | Colby Street SB to Forest Street | % | 23.4 | 3.7 | 15.9 | 29.8 | 20.7 to 26.1 |
| ramp share | onto freeway via College Avenue | % | 14.5 | 1.2 | 12.0 | 16.0 | 13.6 to 15.3 |
| ramp share | onto freeway via Hillegass Avenue | % | 15.4 | 1.3 | 12.6 | 16.7 | 14.4 to 16.4 |
| ramp share | onto freeway via Martin Street | % | 13.5 | 1.6 | 10.9 | 16.5 | 12.4 to 14.7 |
| ramp share | onto freeway via Colby Street | % | 10.9 | 1.6 | 8.7 | 13.1 | 9.7 to 12.0 |
| ramp share | onto freeway via Telegraph Avenue north of Alcatraz Avenue | % | 12.2 | 1.5 | 10.7 | 15.2 | 11.2 to 13.3 |
| ramp share | onto freeway via Benvenue Avenue | % | 5.3 | 0.7 | 3.9 | 6.3 | 4.7 to 5.8 |
| ramp share | from freeway via College Avenue | % | 9.5 | 1.2 | 7.3 | 11.5 | 8.6 to 10.3 |
| ramp share | from freeway via Martin Street | % | 11.9 | 0.8 | 9.8 | 12.6 | 11.4 to 12.5 |
| ramp share | from freeway via Colby Street | % | 13.1 | 1.5 | 11.1 | 15.6 | 12.0 to 14.1 |
| ramp share | from freeway via Hillegass Avenue | % | 8.2 | 1.0 | 7.1 | 10.4 | 7.5 to 8.9 |
| ramp share | from freeway via Benvenue Avenue | % | 2.4 | 0.5 | 1.4 | 3.2 | 2.0 to 2.7 |
| corridor flow | Telegraph N median link flow | veh/h | 1045.92 | 36.81 | 975.60 | 1092.00 | 1019.59 to 1072.25 |
| corridor flow | Telegraph S median link flow | veh/h | 1166.76 | 53.72 | 1039.20 | 1215.60 | 1128.34 to 1205.18 |
| corridor flow | College N median link flow | veh/h | 411.24 | 28.91 | 373.20 | 459.60 | 390.56 to 431.92 |
| corridor flow | College S median link flow | veh/h | 512.88 | 48.28 | 456.00 | 594.00 | 478.34 to 547.42 |
| corridor flow | Claremont N median link flow | veh/h | 483.48 | 31.22 | 432.00 | 520.80 | 461.15 to 505.81 |
| corridor flow | Claremont S median link flow | veh/h | 345.00 | 36.77 | 290.40 | 399.60 | 318.69 to 371.31 |
| corridor flow | Alcatraz E median link flow | veh/h | 494.88 | 28.12 | 453.60 | 544.80 | 474.77 to 514.99 |
| corridor flow | Alcatraz W median link flow | veh/h | 344.52 | 14.24 | 320.40 | 367.20 | 334.34 to 354.70 |
| corridor flow | Hillegass N median link flow | veh/h | 125.28 | 11.81 | 111.60 | 150.00 | 116.83 to 133.73 |
| corridor flow | Hillegass S median link flow | veh/h | 133.92 | 19.53 | 94.80 | 162.00 | 119.95 to 147.89 |
| corridor flow | Colby N median link flow | veh/h | 169.68 | 8.51 | 151.20 | 180.00 | 163.59 to 175.77 |
| corridor flow | Colby S median link flow | veh/h | 155.16 | 21.01 | 115.20 | 182.40 | 140.13 to 170.19 |
| corridor flow | Martin E median link flow | veh/h | 126.48 | 14.59 | 102.00 | 147.60 | 116.04 to 136.92 |
| corridor flow | Martin W median link flow | veh/h | 145.92 | 20.06 | 110.40 | 184.80 | 131.57 to 160.27 |

## Intent map: through cars by where they come from and where they are going

Through = neither trip end is in the study area. Groups are the approach groups of the area config (data/areas); a node that is not a gate takes the group of the nearest surface gate (ASSUMPTION). The arterial is the one a trip would use on the shortest free-flow path with the study area's residential and service streets closed, where that path runs on a boundary street near the study area.

Model figures are the mean of 10 seed(s), per hour of the run. Basis: OBSERVED = read from the resident volunteer count of Feb 25, 2025 or its headline shares; ASSUMPTION = inferred from those numbers or chosen.

### Colby Street NB

Observed: block volume 174 veh/h, whole-street cars 102, so through cars 102 to 145 veh/h. Model: 148 through cars per hour.

Observed (PM): 182 cars entered at the south end, 102 drove the whole street, 164 left it at Alcatraz Ave (131 left, 32 right, 1 straight), and 47% of the block's trips came from a freeway (the headline share). ASSUMPTION: freeway-origin cars that do not end along the street are 65 veh/h (the 82 freeway-origin trips on the block, 47% of 174, times the 182 / (182 + 47) of its cars that entered at the south end rather than joining on the way), spread over the 164 exits in proportion (0.40); the other through cars come from the Telegraph Ave and south-side approaches that feed the street's south end. Ranges: low = 131 (32) x 0.47 x 0.62 (the whole-street share of exits), high = 131 (32) x 0.47.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | OBSERVED turn count x ASSUMPTION share (131 left turns x 0.40) | 52 (38 to 62) | 64 | above |
| Telegraph Ave and south-side traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | ASSUMPTION: the through left-turners (131 x 0.62 = 81) that are not off-ramp traffic | 29 (19 to 43) | 30 | within |
| SR-24 off-ramp traffic using Colby St to reach College Ave and Berkeley (right at Alcatraz Ave) | OBSERVED turn count x ASSUMPTION share (32 right turns x 0.40) | 13 (9 to 15) | 12 | within |
| Telegraph Ave and south-side traffic using Colby St to reach College Ave and Berkeley | ASSUMPTION: the through right-turners (32 x 0.62 = 20) that are not off-ramp traffic | 7 (5 to 11) | 37 | above |
| Intents listed, together | | 101 (71 to 131) | 144 | |
| Other through cars (no intent listed) | | | 4 | |

Model through cars by origin and destination group (largest 12 of 32 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 64.2 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 30.6 | Telegraph Avenue |
| Telegraph Ave to the south (downtown Oakland) | Telegraph Ave from the north (Berkeley) | 6.6 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 6.2 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Ashby Ave from the west (Emeryville and I-80) | 5.6 | none near the study area |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Shattuck Ave from the north (Berkeley) | 5.6 | Claremont Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 4.6 | Telegraph Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Telegraph Ave from the north (Berkeley) | 4.3 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Emeryville and West Oakland streets (55th to 67th Streets) | 3.8 | Claremont Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | College Ave from the north (Berkeley) | 3.8 | SR-24 then Claremont Avenue then College Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 2.1 | SR-24 |
| Telegraph Ave to the south (downtown Oakland) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 1.9 | Telegraph Avenue |
| other pairs | | 8.8 | |

By the arterial these cars would otherwise use: Telegraph Avenue 119 veh/h; Claremont Avenue 11 veh/h; none near the study area 6 veh/h; SR-24 then Claremont Avenue then College Avenue 4 veh/h; Alcatraz Avenue then Claremont Avenue 3 veh/h; SR-24 2 veh/h.

### Hillegass Avenue NB

Observed: block volume 110 veh/h, whole-street cars 48, so through cars 48 to 95 veh/h. Model: 94 through cars per hour.

Observed (PM): 94 cars entered at the south end, 48 drove the whole street, 109 left it at Alcatraz Ave (43 west, 54 east, 12 straight), and 47% of the block's trips came from a freeway. ASSUMPTION: freeway-origin through cars are 40 veh/h (52 freeway-origin trips times 94 / (94 + 29)), spread over the exits in proportion (0.37); the through share of exits is 48 / 109 = 0.44.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Hillegass Ave to reach Alcatraz Ave west and Telegraph Ave north | OBSERVED turn count x ASSUMPTION share (43 left turns x 0.37) | 16 (9 to 20) | 25 | above |
| SR-24 off-ramp traffic using Hillegass Ave to reach College Ave and Berkeley | OBSERVED turn count x ASSUMPTION share (54 right turns x 0.37) | 20 (11 to 25) | 31 | above |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach Alcatraz Ave west | ASSUMPTION: through exits (43 x 0.44) that are not off-ramp traffic | 3 (0 to 10) | 6 | within |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach College Ave and Berkeley | ASSUMPTION: through exits (54 x 0.44) that are not off-ramp traffic | 4 (0 to 13) | 26 | above |
| Intents listed, together | | 43 (20 to 68) | 88 | |
| Other through cars (no intent listed) | | | 6 | |

Model through cars by origin and destination group (largest 12 of 41 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 18.9 | SR-24 |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 17.9 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 15.2 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | College Ave from the north (Berkeley) | 6.3 | SR-24 then Claremont Avenue then College Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 4.3 | SR-24 then Claremont Avenue |
| Telegraph Ave to the south (downtown Oakland) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 4.0 | Telegraph Avenue |
| SR-13 Warren Freeway (via SR-24 east) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 3.8 | Claremont Avenue then Alcatraz Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Ashby Ave from the west (Emeryville and I-80) | 1.8 | SR-24 then Telegraph Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Telegraph Ave from the north (Berkeley) | 1.7 | none near the study area |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | College Ave from the north (Berkeley) | 1.5 | Claremont Avenue then College Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | San Pablo Ave (Emeryville and West Oakland) | 1.5 | SR-24 |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 1.3 | Telegraph Avenue |
| other pairs | | 15.7 | |

By the arterial these cars would otherwise use: Telegraph Avenue 41 veh/h; SR-24 20 veh/h; Claremont Avenue 7 veh/h; SR-24 then Claremont Avenue then College Avenue 6 veh/h; Claremont Avenue then Alcatraz Avenue 5 veh/h; SR-24 then Claremont Avenue 4 veh/h.

### Hillegass Avenue SB

Observed: block volume 160 veh/h, whole-street cars 79, so through cars 79 to 120 veh/h. Model: 125 through cars per hour.

Observed (PM): 178 cars entered at the top (76 turned in from Alcatraz Ave west, 98 from the east, 4 came straight from the north), 79 drove the whole street, and 68% of the block's trips (109 veh/h) went to a freeway. ASSUMPTION: freeway-bound cars that did not join mid-street are 87 veh/h (109 x 178 / (178 + 44)), half of the 174 turn-ins; low = the whole-street share of the turn-ins (0.45), high = the freeway-bound share without the mid-street correction (0.63).

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Telegraph Ave, Alcatraz Ave west and West Berkeley traffic turning off Alcatraz Ave onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (76 turn-ins x 0.50) | 38 (34 to 48) | 41 | within |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (98 turn-ins x 0.50) | 49 (44 to 62) | 56 | within |
| Intents listed, together | | 87 (78 to 110) | 97 | |
| Other through cars (no intent listed) | | | 29 | |

Model through cars by origin and destination group (largest 12 of 32 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 39.6 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 26.8 | Telegraph Avenue |
| Ashby Ave from the west (Emeryville and I-80) | College Ave from the north (Berkeley) | 17.0 | Alcatraz Avenue then College Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 16.4 | Claremont Avenue then SR-24 |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 10.7 | College Avenue then Claremont Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 3.6 | Telegraph Avenue |
| Ashby Ave from the west (Emeryville and I-80) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 1.6 | Alcatraz Avenue then Claremont Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 1.1 | Claremont Avenue |
| Berkeley hills to the northeast (Evergreen Ln, Gravatt Dr) | SR-24 westbound on-ramps (toward Oakland and I-980) | 1.1 | SR-24 |
| Ashby Ave from the west (Emeryville and I-80) | Berkeley hills to the northeast (Evergreen Ln, Gravatt Dr) | 1.0 | none near the study area |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 1.0 | Claremont Avenue |
| Telegraph Ave from the north (Berkeley) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 0.8 | Telegraph Avenue |
| other pairs | | 4.7 | |

By the arterial these cars would otherwise use: Telegraph Avenue 72 veh/h; Alcatraz Avenue then College Avenue 17 veh/h; Claremont Avenue then SR-24 16 veh/h; College Avenue then Claremont Avenue then SR-24 11 veh/h; Alcatraz Avenue then Claremont Avenue 3 veh/h; Claremont Avenue 2 veh/h.

### Colby Street SB

Observed: block volume 160 veh/h, whole-street cars 39, so through cars 39 to 117 veh/h. Model: 116 through cars per hour.

Observed (PM): 139 cars entered at the top (76 from Alcatraz Ave west, 50 from the east, 13 from the north), 39 drove the whole street, 45% of the block's trips (72 veh/h) went to a freeway and 22% came by way of Telegraph Ave. ASSUMPTION: freeway-bound cars that did not join mid-street are 46 veh/h (72 x 139 / (139 + 79)), 0.365 of the 126 turn-ins; low = the whole-street share (0.31), high = the unadjusted freeway share (0.57). The Telegraph Ave cars are the 22% x 160 = 35 of the 76 west turn-ins.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Southbound Telegraph Ave traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (35 Telegraph Ave cars x 0.365) | 13 (11 to 20) | 14 | within |
| Alcatraz Ave west, Ashby Ave and West Berkeley traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (41 other west turn-ins x 0.365) | 15 (13 to 23) | 18 | within |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (50 east turn-ins x 0.365) | 18 (15 to 29) | 37 | above |
| Intents listed, together | | 46 (39 to 72) | 69 | |
| Other through cars (no intent listed) | | | 47 | |

Model through cars by origin and destination group (largest 12 of 48 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Ashby Ave from the west (Emeryville and I-80) | College Ave from the north (Berkeley) | 19.8 | Alcatraz Avenue then College Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 19.6 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 12.6 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 10.7 | Claremont Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 9.3 | Telegraph Avenue |
| Shattuck Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 7.2 | none near the study area |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 5.9 | College Avenue then Claremont Avenue then SR-24 |
| Ashby Ave from the west (Emeryville and I-80) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 3.4 | SR-24 |
| Telegraph Ave from the north (Berkeley) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 2.4 | Telegraph Avenue |
| Alcatraz Ave from the west (Emeryville side) | SR-13 Warren Freeway (via SR-24 east) | 2.1 | SR-24 |
| Ashby Ave from the west (Emeryville and I-80) | SR-13 Warren Freeway (via SR-24 east) | 1.9 | SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Telegraph Ave to the south (downtown Oakland) | 1.9 | Telegraph Avenue |
| other pairs | | 18.9 | |

By the arterial these cars would otherwise use: Telegraph Avenue 46 veh/h; Alcatraz Avenue then College Avenue 20 veh/h; none near the study area 13 veh/h; Claremont Avenue then SR-24 11 veh/h; SR-24 9 veh/h; College Avenue then Claremont Avenue then SR-24 6 veh/h.

### Study area, all residential and service streets

Model: 759 through cars per hour.

Model through cars by origin and destination group (largest 12 of 92 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 88.9 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 78.1 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 75.2 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 48.3 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 45.9 | Telegraph Avenue |
| Ashby Ave from the west (Emeryville and I-80) | College Ave from the north (Berkeley) | 44.2 | Alcatraz Avenue then College Avenue |
| West Oakland to the southwest (Adeline St, Market St) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 30.3 | Telegraph Avenue then Claremont Avenue |
| West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) | SR-24 westbound on-ramps (toward Oakland and I-980) | 25.0 | none near the study area |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 24.2 | Claremont Avenue then SR-24 |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Emeryville and West Oakland streets (55th to 67th Streets) | 22.2 | Claremont Avenue |
| Emeryville and West Oakland streets (55th to 67th Streets) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 19.3 | none near the study area |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 19.1 | SR-24 |
| other pairs | | 238.4 | |

By the arterial these cars would otherwise use: Telegraph Avenue 423 veh/h; none near the study area 71 veh/h; Claremont Avenue 68 veh/h; Alcatraz Avenue then College Avenue 44 veh/h; SR-24 31 veh/h; Telegraph Avenue then Claremont Avenue 30 veh/h.

By origin group: South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 157; Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 135; SR-24 eastbound off-ramps (arriving from Oakland and I-980) 123; Telegraph Ave from the north (Berkeley) 65; Ashby Ave from the west (Emeryville and I-80) 58; West Oakland to the southwest (Adeline St, Market St) 47; Emeryville and West Oakland streets (55th to 67th Streets) 34; Telegraph Ave to the south (downtown Oakland) 30; West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) 28; Claremont Ave and Tunnel Rd toward the hills 25.

By destination group: SR-24 westbound on-ramps (toward Oakland and I-980) 216; Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 139; South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 114; Telegraph Ave from the north (Berkeley) 102; College Ave from the north (Berkeley) 60; Claremont Ave and Tunnel Rd toward the hills 42; Emeryville and West Oakland streets (55th to 67th Streets) 22; Shattuck Ave from the north (Berkeley) 19; Berkeley hills to the northeast (Evergreen Ln, Gravatt Dr) 10; SR-24 eastbound on-ramps (toward the Caldecott Tunnel) 8.


Per-seed detail: `rockridge-pm_peak-s1-seed1.md` (seed 1 in full).
