# rockridge-pm_peak-s1 over 10 seeds (1, 2, 3, 4, 5, 6, 7, 8, 9, 10)

Seeds are the fixed list above, none chosen; each run is 60 minutes from the same start. Interval = 95% interval of the mean (Student t, n - 1 degrees of freedom). Run-to-run noise only: demand is fixed, so day-to-day variation is not in these intervals.

## Stability rule (design decision D16)

| Check | Rule | Result | Pass |
| --- | --- | --- | --- |
| Cars cleared from gridlock near the study area (judged zone) | mean per hour below 1.00 | 0.00 (min 0.00, max 0.00) | yes |
| Entry backlog | below 2.0% in at least 90% of seeds | 10 of 10 seeds | yes |
| Runaway growth | no seed adds more than 2.0 points of backlog in the second half | none | yes |
| Arterial speed | mean above 4.0 m/s | 8.09 m/s | yes |

**Verdict: stable.** Old rule (zero removals, backlog under 2%, speed above 4 m/s, every seed): 0 of 10 seeds pass.

## Metrics over seeds

| Group | Metric | Unit | Mean | SD | Min | Max | 95% interval |
| --- | --- | --- | --- | --- | --- | --- | --- |
| health | gridlock removals | vehicles | 5.20 | 1.69 | 2.00 | 8.00 | 3.99 to 6.41 |
| health | gridlock removals per hour | veh/h | 5.20 | 1.69 | 2.00 | 8.00 | 3.99 to 6.41 |
| health | entry backlog | % of spawned | 0.24 | 0.14 | 0.05 | 0.54 | 0.14 to 0.34 |
| health | backlog growth in the second half of the run | points of spawned | 0.17 | 0.11 | 0.03 | 0.42 | 0.09 to 0.25 |
| health | completed trips | trips | 26948.60 | 184.20 | 26687.00 | 27245.00 | 26816.84 to 27080.36 |
| health | arterial mean speed | m/s | 8.09 | 0.10 | 7.95 | 8.21 | 8.02 to 8.16 |
| health | arterial mean speed, last 15 min | m/s | 7.75 | 0.26 | 7.38 | 8.30 | 7.56 to 7.94 |
| junction recovery | courtesy admissions per hour | veh/h | 277.40 | 27.96 | 247.00 | 331.00 | 257.40 to 297.40 |
| junction recovery | yield fallback admissions per hour | veh/h | 163.10 | 16.47 | 131.00 | 189.00 | 151.32 to 174.88 |
| junction recovery | conflict bypass admissions per hour | veh/h | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| junction recovery | vehicles removed while held in a node, per hour | veh/h | 0.20 | 0.42 | 0.00 | 1.00 | -0.10 to 0.50 |
| gridlock by place | cars cleared from gridlock per hour, judged (near the study area, and far ones whose chain reaches it) | veh/h | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| gridlock by place | cars cleared from gridlock per hour, near the study area | veh/h | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| gridlock by place | cars cleared from gridlock per hour, farther out | veh/h | 5.20 | 1.69 | 2.00 | 8.00 | 3.99 to 6.41 |
| gridlock by place | cars cleared from gridlock per hour, farther out with a chain into the judged zone | veh/h | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| gridlock by place | trips waiting at origins in the judged zone at the end | trips | 1.20 | 1.48 | 0.00 | 4.00 | 0.14 to 2.26 |
| cut-through | local vehicle-miles, surface gates to the freeway | veh-miles | 34.72 | 3.48 | 28.55 | 40.21 | 32.23 to 37.21 |
| cut-through | share of local vehicle-miles, surface gates to the freeway | % | 7.4 | 0.7 | 6.3 | 8.5 | 6.9 to 8.0 |
| cut-through | local vehicle-miles, freeway to the surface gates | veh-miles | 36.29 | 2.86 | 32.96 | 41.56 | 34.24 to 38.34 |
| cut-through | share of local vehicle-miles, freeway to the surface gates | % | 7.8 | 0.5 | 7.1 | 8.6 | 7.4 to 8.1 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue N | trips | 51.50 | 6.49 | 41.00 | 62.00 | 46.86 to 56.14 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue N | trips | 1535.00 | 32.59 | 1478.00 | 1582.00 | 1511.69 to 1558.31 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue S | trips | 78.00 | 6.45 | 68.00 | 86.00 | 73.39 to 82.61 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue S | trips | 1447.00 | 32.68 | 1391.00 | 1502.00 | 1423.62 to 1470.38 |
| headline share | Hillegass Avenue NB from freeway | % | 51.4 | 3.4 | 46.4 | 56.2 | 48.9 to 53.8 |
| share | Hillegass Avenue NB to Benvenue Avenue | % | 4.2 | 1.7 | 1.3 | 7.0 | 3.0 to 5.4 |
| share | Hillegass Avenue NB to College Avenue | % | 11.0 | 2.6 | 6.9 | 15.5 | 9.1 to 12.9 |
| share | Hillegass Avenue NB to Alcatraz Avenue WB | % | 30.2 | 2.3 | 26.6 | 33.9 | 28.6 to 31.8 |
| headline share | Colby Street NB from freeway | % | 48.8 | 2.8 | 45.2 | 52.7 | 46.8 to 50.8 |
| share | Colby Street NB to Alcatraz Avenue WB | % | 53.2 | 1.9 | 50.0 | 55.6 | 51.8 to 54.6 |
| share | Colby Street NB to Telegraph Avenue | % | 45.5 | 3.0 | 42.6 | 51.0 | 43.4 to 47.6 |
| share | Colby Street NB to College Avenue | % | 5.2 | 1.5 | 1.5 | 6.5 | 4.1 to 6.3 |
| share | Hillegass Avenue SB from Alcatraz Avenue WB | % | 37.2 | 4.5 | 32.2 | 46.5 | 34.0 to 40.4 |
| share | Hillegass Avenue SB from Benvenue Avenue | % | 8.7 | 3.3 | 4.9 | 15.9 | 6.3 to 11.0 |
| share | Hillegass Avenue SB from College Avenue | % | 22.5 | 2.7 | 18.2 | 25.5 | 20.5 to 24.5 |
| headline share | Hillegass Avenue SB to freeway | % | 66.0 | 4.8 | 59.8 | 74.5 | 62.6 to 69.5 |
| share | Colby Street SB from Alcatraz Avenue EB | % | 22.7 | 2.4 | 19.7 | 26.9 | 21.0 to 24.4 |
| share | Colby Street SB from Alcatraz Avenue WB | % | 16.3 | 3.1 | 10.3 | 20.5 | 14.1 to 18.5 |
| share | Colby Street SB from Telegraph Avenue | % | 21.0 | 3.3 | 17.1 | 28.1 | 18.7 to 23.4 |
| headline share | Colby Street SB to freeway | % | 38.4 | 5.1 | 30.7 | 45.9 | 34.8 to 42.0 |
| share | Colby Street SB to Forest Street | % | 22.2 | 4.6 | 14.9 | 30.9 | 18.9 to 25.5 |
| ramp share | onto freeway via College Avenue | % | 13.9 | 2.1 | 11.2 | 18.3 | 12.5 to 15.4 |
| ramp share | onto freeway via Hillegass Avenue | % | 16.9 | 1.7 | 14.8 | 20.9 | 15.7 to 18.1 |
| ramp share | onto freeway via Martin Street | % | 13.0 | 1.8 | 9.4 | 15.3 | 11.8 to 14.3 |
| ramp share | onto freeway via Colby Street | % | 14.2 | 1.7 | 11.2 | 16.4 | 13.0 to 15.5 |
| ramp share | onto freeway via Telegraph Avenue north of Alcatraz Avenue | % | 13.6 | 1.1 | 11.1 | 14.9 | 12.8 to 14.4 |
| ramp share | onto freeway via Benvenue Avenue | % | 4.8 | 0.9 | 3.7 | 6.7 | 4.1 to 5.5 |
| ramp share | from freeway via College Avenue | % | 9.2 | 1.1 | 7.6 | 10.5 | 8.5 to 10.0 |
| ramp share | from freeway via Martin Street | % | 12.6 | 1.6 | 10.6 | 15.7 | 11.4 to 13.8 |
| ramp share | from freeway via Colby Street | % | 14.0 | 1.2 | 11.9 | 15.5 | 13.1 to 14.8 |
| ramp share | from freeway via Hillegass Avenue | % | 9.3 | 0.7 | 8.6 | 10.9 | 8.8 to 9.8 |
| ramp share | from freeway via Benvenue Avenue | % | 3.4 | 0.4 | 2.8 | 4.1 | 3.1 to 3.7 |
| corridor flow | Telegraph N median link flow | veh/h | 1238.52 | 47.36 | 1167.60 | 1303.20 | 1204.64 to 1272.40 |
| corridor flow | Telegraph S median link flow | veh/h | 986.40 | 63.56 | 901.20 | 1094.40 | 940.93 to 1031.87 |
| corridor flow | College N median link flow | veh/h | 342.48 | 27.13 | 292.80 | 384.00 | 323.07 to 361.89 |
| corridor flow | College S median link flow | veh/h | 602.88 | 38.76 | 537.60 | 674.40 | 575.16 to 630.60 |
| corridor flow | Claremont N median link flow | veh/h | 477.84 | 53.27 | 397.20 | 543.60 | 439.73 to 515.95 |
| corridor flow | Claremont S median link flow | veh/h | 303.84 | 31.66 | 270.00 | 369.60 | 281.20 to 326.48 |
| corridor flow | Alcatraz E median link flow | veh/h | 489.36 | 31.59 | 450.00 | 544.80 | 466.77 to 511.95 |
| corridor flow | Alcatraz W median link flow | veh/h | 324.36 | 23.97 | 272.40 | 357.60 | 307.21 to 341.51 |
| corridor flow | Hillegass N median link flow | veh/h | 126.12 | 12.01 | 104.40 | 139.20 | 117.53 to 134.71 |
| corridor flow | Hillegass S median link flow | veh/h | 128.28 | 11.82 | 111.60 | 145.20 | 119.83 to 136.73 |
| corridor flow | Colby N median link flow | veh/h | 145.32 | 12.40 | 116.40 | 163.20 | 136.45 to 154.19 |
| corridor flow | Colby S median link flow | veh/h | 138.48 | 10.57 | 118.80 | 156.00 | 130.92 to 146.04 |
| corridor flow | Martin E median link flow | veh/h | 126.72 | 9.04 | 111.60 | 141.60 | 120.26 to 133.18 |
| corridor flow | Martin W median link flow | veh/h | 139.56 | 16.30 | 117.60 | 174.00 | 127.90 to 151.22 |

## Intent map: through cars by where they come from and where they are going

Through = neither trip end is in the study area. Groups are the approach groups of the area config (data/areas); a node that is not a gate takes the group of the nearest surface gate (ASSUMPTION). The arterial is the one a trip would use on the shortest free-flow path with the study area's residential and service streets closed, where that path runs on a boundary street near the study area.

Model figures are the mean of 10 seed(s), per hour of the run. Basis: OBSERVED = read from the resident volunteer count of Feb 25, 2025 or its headline shares; ASSUMPTION = inferred from those numbers or chosen.

### Colby Street NB

Observed: block volume 174 veh/h, whole-street cars 102, so through cars 102 to 145 veh/h. Model: 150 through cars per hour.

Observed (PM): 182 cars entered at the south end, 102 drove the whole street, 164 left it at Alcatraz Ave (131 left, 32 right, 1 straight), and 47% of the block's trips came from a freeway (the headline share). ASSUMPTION: freeway-origin cars that do not end along the street are 65 veh/h (the 82 freeway-origin trips on the block, 47% of 174, times the 182 / (182 + 47) of its cars that entered at the south end rather than joining on the way), spread over the 164 exits in proportion (0.40); the other through cars come from the Telegraph Ave and south-side approaches that feed the street's south end. Ranges: low = 131 (32) x 0.47 x 0.62 (the whole-street share of exits), high = 131 (32) x 0.47.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | OBSERVED turn count x ASSUMPTION share (131 left turns x 0.40) | 52 (38 to 62) | 65 | above |
| Telegraph Ave and south-side traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | ASSUMPTION: the through left-turners (131 x 0.62 = 81) that are not off-ramp traffic | 29 (19 to 43) | 23 | within |
| SR-24 off-ramp traffic using Colby St to reach College Ave and Berkeley (right at Alcatraz Ave) | OBSERVED turn count x ASSUMPTION share (32 right turns x 0.40) | 13 (9 to 15) | 12 | within |
| Telegraph Ave and south-side traffic using Colby St to reach College Ave and Berkeley | ASSUMPTION: the through right-turners (32 x 0.62 = 20) that are not off-ramp traffic | 7 (5 to 11) | 44 | above |
| Intents listed, together | | 101 (71 to 131) | 142 | |
| Other through cars (no intent listed) | | | 7 | |

Model through cars by origin and destination group (largest 12 of 35 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 64.7 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 36.9 | Telegraph Avenue |
| Telegraph Ave to the south (downtown Oakland) | Telegraph Ave from the north (Berkeley) | 8.4 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Ashby Ave from the west (Emeryville and I-80) | 6.6 | none near the study area |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | College Ave from the north (Berkeley) | 5.0 | SR-24 then Claremont Avenue then College Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 4.4 | SR-24 then Claremont Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Telegraph Ave from the north (Berkeley) | 4.2 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 2.8 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 2.0 | SR-24 |
| San Pablo Ave (Emeryville and West Oakland) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 1.8 | Alcatraz Avenue then College Avenue |
| Emeryville and West Oakland streets (55th to 67th Streets) | Claremont Ave and Tunnel Rd toward the hills | 1.6 | Alcatraz Avenue then Claremont Avenue |
| San Pablo Ave (Emeryville and West Oakland) | Claremont Ave and Tunnel Rd toward the hills | 1.1 | Alcatraz Avenue then Claremont Avenue |
| other pairs | | 10.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 120 veh/h; none near the study area 7 veh/h; SR-24 then Claremont Avenue then College Avenue 5 veh/h; SR-24 then Claremont Avenue 4 veh/h; Claremont Avenue 3 veh/h; Alcatraz Avenue then Claremont Avenue 3 veh/h.

### Hillegass Avenue NB

Observed: block volume 110 veh/h, whole-street cars 48, so through cars 48 to 95 veh/h. Model: 109 through cars per hour.

Observed (PM): 94 cars entered at the south end, 48 drove the whole street, 109 left it at Alcatraz Ave (43 west, 54 east, 12 straight), and 47% of the block's trips came from a freeway. ASSUMPTION: freeway-origin through cars are 40 veh/h (52 freeway-origin trips times 94 / (94 + 29)), spread over the exits in proportion (0.37); the through share of exits is 48 / 109 = 0.44.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Hillegass Ave to reach Alcatraz Ave west and Telegraph Ave north | OBSERVED turn count x ASSUMPTION share (43 left turns x 0.37) | 16 (9 to 20) | 27 | above |
| SR-24 off-ramp traffic using Hillegass Ave to reach College Ave and Berkeley | OBSERVED turn count x ASSUMPTION share (54 right turns x 0.37) | 20 (11 to 25) | 33 | above |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach Alcatraz Ave west | ASSUMPTION: through exits (43 x 0.44) that are not off-ramp traffic | 3 (0 to 10) | 7 | within |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach College Ave and Berkeley | ASSUMPTION: through exits (54 x 0.44) that are not off-ramp traffic | 4 (0 to 13) | 33 | above |
| Intents listed, together | | 43 (20 to 68) | 100 | |
| Other through cars (no intent listed) | | | 9 | |

Model through cars by origin and destination group (largest 12 of 44 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 23.8 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 21.1 | SR-24 |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 20.1 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | College Ave from the north (Berkeley) | 7.4 | SR-24 then Claremont Avenue then College Avenue |
| College Ave from the north (Berkeley) | Shattuck Ave from the north (Berkeley) | 4.3 | College Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 4.3 | SR-24 then Claremont Avenue |
| Telegraph Ave to the south (downtown Oakland) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 2.6 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Shattuck Ave from the north (Berkeley) | 2.1 | College Avenue |
| West Oakland to the southwest (Adeline St, Market St) | College Ave from the north (Berkeley) | 2.1 | Telegraph Avenue then Alcatraz Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Ashby Ave from the west (Emeryville and I-80) | 1.7 | SR-24 then Telegraph Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Telegraph Ave from the north (Berkeley) | 1.7 | none near the study area |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Alcatraz Ave from the west (Emeryville side) | 1.5 | SR-24 then Telegraph Avenue |
| other pairs | | 16.4 | |

By the arterial these cars would otherwise use: Telegraph Avenue 51 veh/h; SR-24 22 veh/h; SR-24 then Claremont Avenue then College Avenue 7 veh/h; College Avenue 6 veh/h; SR-24 then Claremont Avenue 4 veh/h; SR-24 then Telegraph Avenue 4 veh/h.

### Hillegass Avenue SB

Observed: block volume 160 veh/h, whole-street cars 79, so through cars 79 to 120 veh/h. Model: 127 through cars per hour.

Observed (PM): 178 cars entered at the top (76 turned in from Alcatraz Ave west, 98 from the east, 4 came straight from the north), 79 drove the whole street, and 68% of the block's trips (109 veh/h) went to a freeway. ASSUMPTION: freeway-bound cars that did not join mid-street are 87 veh/h (109 x 178 / (178 + 44)), half of the 174 turn-ins; low = the whole-street share of the turn-ins (0.45), high = the freeway-bound share without the mid-street correction (0.63).

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Telegraph Ave, Alcatraz Ave west and West Berkeley traffic turning off Alcatraz Ave onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (76 turn-ins x 0.50) | 38 (34 to 48) | 41 | within |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (98 turn-ins x 0.50) | 49 (44 to 62) | 52 | within |
| Intents listed, together | | 87 (78 to 110) | 93 | |
| Other through cars (no intent listed) | | | 35 | |

Model through cars by origin and destination group (largest 12 of 40 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 40.1 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 25.2 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 16.0 | Claremont Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 12.2 | Telegraph Avenue |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 7.5 | College Avenue then Claremont Avenue then SR-24 |
| Ashby Ave from the west (Emeryville and I-80) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 5.4 | Alcatraz Avenue then College Avenue |
| San Pablo Ave (Emeryville and West Oakland) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 5.2 | Alcatraz Avenue then College Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Berkeley hills to the northeast (Evergreen Ln, Gravatt Dr) | 2.9 | Alcatraz Avenue then Claremont Avenue |
| College Ave from the north (Berkeley) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 2.2 | College Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 1.9 | Claremont Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Telegraph Ave to the south (downtown Oakland) | 1.8 | Telegraph Avenue |
| Berkeley hills to the northeast (Evergreen Ln, Gravatt Dr) | SR-24 westbound on-ramps (toward Oakland and I-980) | 1.3 | Claremont Avenue then SR-24 |
| other pairs | | 5.8 | |

By the arterial these cars would otherwise use: Telegraph Avenue 80 veh/h; Claremont Avenue then SR-24 17 veh/h; Alcatraz Avenue then College Avenue 11 veh/h; College Avenue then Claremont Avenue then SR-24 8 veh/h; Alcatraz Avenue then Claremont Avenue 5 veh/h; Claremont Avenue 3 veh/h.

### Colby Street SB

Observed: block volume 160 veh/h, whole-street cars 39, so through cars 39 to 117 veh/h. Model: 135 through cars per hour.

Observed (PM): 139 cars entered at the top (76 from Alcatraz Ave west, 50 from the east, 13 from the north), 39 drove the whole street, 45% of the block's trips (72 veh/h) went to a freeway and 22% came by way of Telegraph Ave. ASSUMPTION: freeway-bound cars that did not join mid-street are 46 veh/h (72 x 139 / (139 + 79)), 0.365 of the 126 turn-ins; low = the whole-street share (0.31), high = the unadjusted freeway share (0.57). The Telegraph Ave cars are the 22% x 160 = 35 of the 76 west turn-ins.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Southbound Telegraph Ave traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (35 Telegraph Ave cars x 0.365) | 13 (11 to 20) | 16 | within |
| Alcatraz Ave west, Ashby Ave and West Berkeley traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (41 other west turn-ins x 0.365) | 15 (13 to 23) | 20 | within |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (50 east turn-ins x 0.365) | 18 (15 to 29) | 39 | above |
| Intents listed, together | | 46 (39 to 72) | 75 | |
| Other through cars (no intent listed) | | | 60 | |

Model through cars by origin and destination group (largest 12 of 51 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 24.8 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 20.5 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 14.0 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 11.0 | Claremont Avenue then SR-24 |
| Shattuck Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 8.6 | none near the study area |
| San Pablo Ave (Emeryville and West Oakland) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 8.1 | Alcatraz Avenue then College Avenue |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 6.5 | College Avenue then Claremont Avenue then SR-24 |
| Ashby Ave from the west (Emeryville and I-80) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 5.6 | Alcatraz Avenue then College Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Telegraph Ave to the south (downtown Oakland) | 4.7 | Telegraph Avenue |
| Emeryville and West Oakland streets (55th to 67th Streets) | SR-24 westbound on-ramps (toward Oakland and I-980) | 2.9 | none near the study area |
| Telegraph Ave from the north (Berkeley) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 2.8 | Telegraph Avenue |
| Ashby Ave from the west (Emeryville and I-80) | SR-13 Warren Freeway (via SR-24 east) | 2.7 | SR-24 |
| other pairs | | 22.9 | |

By the arterial these cars would otherwise use: Telegraph Avenue 70 veh/h; none near the study area 16 veh/h; Alcatraz Avenue then College Avenue 14 veh/h; Claremont Avenue then SR-24 11 veh/h; SR-24 8 veh/h; Alcatraz Avenue then Claremont Avenue 6 veh/h.

### Study area, all residential and service streets

Model: 769 through cars per hour.

Model through cars by origin and destination group (largest 12 of 102 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 123.4 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 80.3 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 77.4 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 76.3 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 50.5 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 24.6 | Claremont Avenue then SR-24 |
| Emeryville and West Oakland streets (55th to 67th Streets) | SR-24 westbound on-ramps (toward Oakland and I-980) | 24.5 | none near the study area |
| San Pablo Ave (Emeryville and West Oakland) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 22.5 | Alcatraz Avenue then College Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 21.4 | SR-24 |
| Shattuck Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 20.4 | none near the study area |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 17.8 | Telegraph Avenue |
| Emeryville and West Oakland streets (55th to 67th Streets) | Claremont Ave and Tunnel Rd toward the hills | 15.3 | Alcatraz Avenue then Claremont Avenue |
| other pairs | | 214.6 | |

By the arterial these cars would otherwise use: Telegraph Avenue 492 veh/h; none near the study area 77 veh/h; Alcatraz Avenue then College Avenue 36 veh/h; Alcatraz Avenue then Claremont Avenue 31 veh/h; SR-24 30 veh/h; Claremont Avenue then SR-24 26 veh/h.

By origin group: Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 177; South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 158; SR-24 eastbound off-ramps (arriving from Oakland and I-980) 133; Telegraph Ave from the north (Berkeley) 67; Emeryville and West Oakland streets (55th to 67th Streets) 43; San Pablo Ave (Emeryville and West Oakland) 30; Claremont Ave and Tunnel Rd toward the hills 26; College Ave from the north (Berkeley) 26; Telegraph Ave to the south (downtown Oakland) 21; Shattuck Ave from the north (Berkeley) 21.

By destination group: SR-24 westbound on-ramps (toward Oakland and I-980) 232; Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 187; Telegraph Ave from the north (Berkeley) 101; South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 99; Claremont Ave and Tunnel Rd toward the hills 48; Telegraph Ave to the south (downtown Oakland) 24; College Ave from the north (Berkeley) 19; Shattuck Ave from the north (Berkeley) 9; Berkeley hills to the northeast (Evergreen Ln, Gravatt Dr) 9; Ashby Ave from the west (Emeryville and I-80) 8.


Per-seed detail: `rockridge-pm_peak-s1-seed1.md` (seed 1 in full).
