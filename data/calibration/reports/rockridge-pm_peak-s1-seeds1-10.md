# rockridge-pm_peak-s1 over 10 seeds (1, 2, 3, 4, 5, 6, 7, 8, 9, 10)

Seeds are the fixed list above, none chosen; each run is 60 minutes from the same start. Interval = 95% interval of the mean (Student t, n - 1 degrees of freedom). Run-to-run noise only: demand is fixed, so day-to-day variation is not in these intervals.

## Stability rule (design decision D16)

| Check | Rule | Result | Pass |
| --- | --- | --- | --- |
| Cars cleared from gridlock near the study area (judged zone) | mean per hour below 1.00 | 0.10 (min 0.00, max 1.00) | yes |
| Entry backlog | below 2.0% in at least 90% of seeds | 10 of 10 seeds | yes |
| Runaway growth | no seed adds more than 2.0 points of backlog in the second half | none | yes |
| Arterial speed | mean above 4.0 m/s | 8.16 m/s | yes |

**Verdict: stable.** Old rule (zero removals, backlog under 2%, speed above 4 m/s, every seed): 0 of 10 seeds pass.

## Metrics over seeds

| Group | Metric | Unit | Mean | SD | Min | Max | 95% interval |
| --- | --- | --- | --- | --- | --- | --- | --- |
| health | gridlock removals | vehicles | 3.40 | 2.32 | 1.00 | 7.00 | 1.74 to 5.06 |
| health | gridlock removals per hour | veh/h | 3.40 | 2.32 | 1.00 | 7.00 | 1.74 to 5.06 |
| health | entry backlog | % of spawned | 0.27 | 0.24 | 0.02 | 0.73 | 0.10 to 0.45 |
| health | backlog growth in the second half of the run | points of spawned | 0.18 | 0.21 | -0.05 | 0.65 | 0.03 to 0.33 |
| health | completed trips | trips | 26991.70 | 221.63 | 26582.00 | 27355.00 | 26833.17 to 27150.23 |
| health | arterial mean speed | m/s | 8.16 | 0.10 | 8.00 | 8.25 | 8.09 to 8.23 |
| health | arterial mean speed, last 15 min | m/s | 7.90 | 0.21 | 7.58 | 8.22 | 7.75 to 8.05 |
| junction recovery | courtesy admissions per hour | veh/h | 352.50 | 40.26 | 294.00 | 436.00 | 323.70 to 381.30 |
| junction recovery | yield fallback admissions per hour | veh/h | 159.70 | 15.80 | 142.00 | 196.00 | 148.39 to 171.01 |
| junction recovery | conflict bypass admissions per hour | veh/h | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| junction recovery | vehicles removed while held in a node, per hour | veh/h | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| gridlock by place | cars cleared from gridlock per hour, judged (near the study area, and far ones whose chain reaches it) | veh/h | 0.10 | 0.32 | 0.00 | 1.00 | -0.13 to 0.33 |
| gridlock by place | cars cleared from gridlock per hour, near the study area | veh/h | 0.10 | 0.32 | 0.00 | 1.00 | -0.13 to 0.33 |
| gridlock by place | cars cleared from gridlock per hour, farther out | veh/h | 3.30 | 2.45 | 0.00 | 7.00 | 1.55 to 5.05 |
| gridlock by place | cars cleared from gridlock per hour, farther out with a chain into the judged zone | veh/h | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| gridlock by place | trips waiting at origins in the judged zone at the end | trips | 1.80 | 2.86 | 0.00 | 9.00 | -0.25 to 3.85 |
| cut-through | local vehicle-miles, surface gates to the freeway | veh-miles | 37.34 | 3.57 | 31.66 | 43.85 | 34.78 to 39.89 |
| cut-through | share of local vehicle-miles, surface gates to the freeway | % | 8.0 | 0.8 | 6.8 | 9.4 | 7.5 to 8.6 |
| cut-through | local vehicle-miles, freeway to the surface gates | veh-miles | 36.18 | 2.59 | 33.66 | 41.10 | 34.33 to 38.04 |
| cut-through | share of local vehicle-miles, freeway to the surface gates | % | 7.8 | 0.5 | 6.9 | 8.6 | 7.4 to 8.1 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue N | trips | 49.30 | 6.72 | 39.00 | 62.00 | 44.50 to 54.10 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue N | trips | 1539.20 | 32.40 | 1496.00 | 1584.00 | 1516.02 to 1562.38 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue S | trips | 74.60 | 8.45 | 59.00 | 88.00 | 68.56 to 80.64 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue S | trips | 1456.50 | 30.35 | 1407.00 | 1494.00 | 1434.79 to 1478.21 |
| headline share | Hillegass Avenue NB from freeway | % | 52.2 | 2.7 | 48.6 | 56.1 | 50.3 to 54.1 |
| share | Hillegass Avenue NB to Benvenue Avenue | % | 3.4 | 1.4 | 1.7 | 6.0 | 2.4 to 4.4 |
| share | Hillegass Avenue NB to College Avenue | % | 13.2 | 3.0 | 9.2 | 20.4 | 11.1 to 15.4 |
| share | Hillegass Avenue NB to Alcatraz Avenue WB | % | 28.5 | 2.0 | 26.6 | 32.3 | 27.1 to 30.0 |
| headline share | Colby Street NB from freeway | % | 49.2 | 3.5 | 44.9 | 55.2 | 46.7 to 51.7 |
| share | Colby Street NB to Alcatraz Avenue WB | % | 53.2 | 1.9 | 49.6 | 55.4 | 51.9 to 54.6 |
| share | Colby Street NB to Telegraph Avenue | % | 43.8 | 3.6 | 37.7 | 51.6 | 41.2 to 46.4 |
| share | Colby Street NB to College Avenue | % | 5.6 | 1.1 | 3.6 | 7.1 | 4.8 to 6.4 |
| share | Hillegass Avenue SB from Alcatraz Avenue WB | % | 37.8 | 4.5 | 33.1 | 48.1 | 34.6 to 41.0 |
| share | Hillegass Avenue SB from Benvenue Avenue | % | 8.4 | 2.6 | 4.6 | 13.3 | 6.5 to 10.3 |
| share | Hillegass Avenue SB from College Avenue | % | 21.5 | 4.2 | 14.8 | 28.8 | 18.5 to 24.5 |
| headline share | Hillegass Avenue SB to freeway | % | 67.5 | 4.3 | 60.7 | 75.0 | 64.4 to 70.6 |
| share | Colby Street SB from Alcatraz Avenue EB | % | 24.2 | 2.3 | 21.2 | 27.1 | 22.6 to 25.9 |
| share | Colby Street SB from Alcatraz Avenue WB | % | 16.8 | 1.9 | 13.2 | 20.1 | 15.5 to 18.2 |
| share | Colby Street SB from Telegraph Avenue | % | 23.6 | 2.4 | 20.6 | 28.4 | 21.8 to 25.3 |
| headline share | Colby Street SB to freeway | % | 42.5 | 3.7 | 38.3 | 47.9 | 39.9 to 45.2 |
| share | Colby Street SB to Forest Street | % | 21.0 | 3.3 | 17.0 | 27.7 | 18.6 to 23.4 |
| ramp share | onto freeway via College Avenue | % | 13.2 | 2.1 | 9.9 | 16.2 | 11.7 to 14.7 |
| ramp share | onto freeway via Hillegass Avenue | % | 16.0 | 1.3 | 14.4 | 18.6 | 15.0 to 16.9 |
| ramp share | onto freeway via Martin Street | % | 12.3 | 1.3 | 10.3 | 14.4 | 11.4 to 13.2 |
| ramp share | onto freeway via Colby Street | % | 15.2 | 0.9 | 13.3 | 16.8 | 14.5 to 15.9 |
| ramp share | onto freeway via Telegraph Avenue north of Alcatraz Avenue | % | 15.0 | 1.3 | 12.9 | 17.5 | 14.1 to 15.9 |
| ramp share | onto freeway via Benvenue Avenue | % | 4.6 | 0.7 | 3.7 | 5.8 | 4.1 to 5.0 |
| ramp share | from freeway via College Avenue | % | 10.1 | 1.3 | 8.1 | 11.9 | 9.2 to 11.0 |
| ramp share | from freeway via Martin Street | % | 12.8 | 1.6 | 10.9 | 15.1 | 11.6 to 13.9 |
| ramp share | from freeway via Colby Street | % | 13.9 | 1.3 | 12.1 | 16.2 | 13.0 to 14.9 |
| ramp share | from freeway via Hillegass Avenue | % | 8.8 | 0.4 | 8.2 | 9.5 | 8.5 to 9.1 |
| ramp share | from freeway via Benvenue Avenue | % | 3.4 | 0.4 | 2.6 | 3.9 | 3.1 to 3.6 |
| corridor flow | Telegraph N median link flow | veh/h | 1125.00 | 46.75 | 1070.40 | 1226.40 | 1091.56 to 1158.44 |
| corridor flow | Telegraph S median link flow | veh/h | 1110.12 | 71.69 | 1022.40 | 1262.40 | 1058.84 to 1161.40 |
| corridor flow | College N median link flow | veh/h | 388.08 | 21.56 | 348.00 | 422.40 | 372.65 to 403.51 |
| corridor flow | College S median link flow | veh/h | 587.04 | 35.53 | 531.60 | 645.60 | 561.63 to 612.45 |
| corridor flow | Claremont N median link flow | veh/h | 487.68 | 42.81 | 424.80 | 541.20 | 457.06 to 518.30 |
| corridor flow | Claremont S median link flow | veh/h | 277.20 | 32.23 | 214.80 | 325.20 | 254.15 to 300.25 |
| corridor flow | Alcatraz E median link flow | veh/h | 480.00 | 27.23 | 435.60 | 514.80 | 460.52 to 499.48 |
| corridor flow | Alcatraz W median link flow | veh/h | 385.44 | 31.34 | 336.00 | 433.20 | 363.02 to 407.86 |
| corridor flow | Hillegass N median link flow | veh/h | 117.48 | 10.64 | 100.80 | 132.00 | 109.87 to 125.09 |
| corridor flow | Hillegass S median link flow | veh/h | 126.36 | 11.31 | 106.80 | 142.80 | 118.27 to 134.45 |
| corridor flow | Colby N median link flow | veh/h | 145.68 | 13.40 | 130.80 | 166.80 | 136.09 to 155.27 |
| corridor flow | Colby S median link flow | veh/h | 140.76 | 13.45 | 122.40 | 170.40 | 131.14 to 150.38 |
| corridor flow | Martin E median link flow | veh/h | 106.68 | 15.74 | 81.60 | 128.40 | 95.42 to 117.94 |
| corridor flow | Martin W median link flow | veh/h | 141.60 | 25.64 | 106.80 | 199.20 | 123.26 to 159.94 |

## Intent map: through cars by where they come from and where they are going

Through = neither trip end is in the study area. Groups are the approach groups of the area config (data/areas); a node that is not a gate takes the group of the nearest surface gate (ASSUMPTION). The arterial is the one a trip would use on the shortest free-flow path with the study area's residential and service streets closed, where that path runs on a boundary street near the study area.

Model figures are the mean of 10 seed(s), per hour of the run. Basis: OBSERVED = read from the resident volunteer count of Feb 25, 2025 or its headline shares; ASSUMPTION = inferred from those numbers or chosen.

### Colby Street NB

Observed: block volume 174 veh/h, whole-street cars 102, so through cars 102 to 145 veh/h. Model: 148 through cars per hour.

Observed (PM): 182 cars entered at the south end, 102 drove the whole street, 164 left it at Alcatraz Ave (131 left, 32 right, 1 straight), and 47% of the block's trips came from a freeway (the headline share). ASSUMPTION: freeway-origin cars that do not end along the street are 65 veh/h (the 82 freeway-origin trips on the block, 47% of 174, times the 182 / (182 + 47) of its cars that entered at the south end rather than joining on the way), spread over the 164 exits in proportion (0.40); the other through cars come from the Telegraph Ave and south-side approaches that feed the street's south end. Ranges: low = 131 (32) x 0.47 x 0.62 (the whole-street share of exits), high = 131 (32) x 0.47.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | OBSERVED turn count x ASSUMPTION share (131 left turns x 0.40) | 52 (38 to 62) | 66 | above |
| Telegraph Ave and south-side traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | ASSUMPTION: the through left-turners (131 x 0.62 = 81) that are not off-ramp traffic | 29 (19 to 43) | 24 | within |
| SR-24 off-ramp traffic using Colby St to reach College Ave and Berkeley (right at Alcatraz Ave) | OBSERVED turn count x ASSUMPTION share (32 right turns x 0.40) | 13 (9 to 15) | 11 | within |
| Telegraph Ave and south-side traffic using Colby St to reach College Ave and Berkeley | ASSUMPTION: the through right-turners (32 x 0.62 = 20) that are not off-ramp traffic | 7 (5 to 11) | 42 | above |
| Intents listed, together | | 101 (71 to 131) | 142 | |
| Other through cars (no intent listed) | | | 6 | |

Model through cars by origin and destination group (largest 12 of 39 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 65.7 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 35.5 | Telegraph Avenue |
| Telegraph Ave to the south (downtown Oakland) | Telegraph Ave from the north (Berkeley) | 8.8 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Ashby Ave from the west (Emeryville and I-80) | 6.8 | none near the study area |
| West Oakland to the southwest (Adeline St, Market St) | Telegraph Ave from the north (Berkeley) | 4.5 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 4.4 | SR-24 then Claremont Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | College Ave from the north (Berkeley) | 4.0 | SR-24 then Claremont Avenue then College Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 2.8 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 2.1 | SR-24 |
| Emeryville and West Oakland streets (55th to 67th Streets) | Claremont Ave and Tunnel Rd toward the hills | 1.5 | Alcatraz Avenue then Claremont Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Claremont Ave and Tunnel Rd toward the hills | 1.3 | Claremont Avenue |
| San Pablo Ave (Emeryville and West Oakland) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 1.1 | Alcatraz Avenue then College Avenue |
| other pairs | | 9.1 | |

By the arterial these cars would otherwise use: Telegraph Avenue 120 veh/h; none near the study area 8 veh/h; SR-24 then Claremont Avenue 4 veh/h; SR-24 then Claremont Avenue then College Avenue 4 veh/h; Claremont Avenue 4 veh/h; Alcatraz Avenue then Claremont Avenue 3 veh/h.

### Hillegass Avenue NB

Observed: block volume 110 veh/h, whole-street cars 48, so through cars 48 to 95 veh/h. Model: 99 through cars per hour.

Observed (PM): 94 cars entered at the south end, 48 drove the whole street, 109 left it at Alcatraz Ave (43 west, 54 east, 12 straight), and 47% of the block's trips came from a freeway. ASSUMPTION: freeway-origin through cars are 40 veh/h (52 freeway-origin trips times 94 / (94 + 29)), spread over the exits in proportion (0.37); the through share of exits is 48 / 109 = 0.44.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Hillegass Ave to reach Alcatraz Ave west and Telegraph Ave north | OBSERVED turn count x ASSUMPTION share (43 left turns x 0.37) | 16 (9 to 20) | 24 | above |
| SR-24 off-ramp traffic using Hillegass Ave to reach College Ave and Berkeley | OBSERVED turn count x ASSUMPTION share (54 right turns x 0.37) | 20 (11 to 25) | 32 | above |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach Alcatraz Ave west | ASSUMPTION: through exits (43 x 0.44) that are not off-ramp traffic | 3 (0 to 10) | 6 | within |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach College Ave and Berkeley | ASSUMPTION: through exits (54 x 0.44) that are not off-ramp traffic | 4 (0 to 13) | 31 | above |
| Intents listed, together | | 43 (20 to 68) | 93 | |
| Other through cars (no intent listed) | | | 6 | |

Model through cars by origin and destination group (largest 12 of 43 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 21.8 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 21.0 | SR-24 |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 17.4 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | College Ave from the north (Berkeley) | 6.8 | SR-24 then Claremont Avenue then College Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 4.3 | SR-24 then Claremont Avenue |
| College Ave from the north (Berkeley) | Shattuck Ave from the north (Berkeley) | 2.9 | College Avenue |
| Telegraph Ave to the south (downtown Oakland) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 2.1 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Shattuck Ave from the north (Berkeley) | 1.9 | College Avenue |
| West Oakland to the southwest (Adeline St, Market St) | College Ave from the north (Berkeley) | 1.9 | Telegraph Avenue then Alcatraz Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Ashby Ave from the west (Emeryville and I-80) | 1.7 | SR-24 then Telegraph Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Telegraph Ave from the north (Berkeley) | 1.7 | none near the study area |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Alcatraz Ave from the west (Emeryville side) | 1.5 | SR-24 then Telegraph Avenue |
| other pairs | | 14.3 | |

By the arterial these cars would otherwise use: Telegraph Avenue 43 veh/h; SR-24 22 veh/h; SR-24 then Claremont Avenue then College Avenue 7 veh/h; College Avenue 6 veh/h; SR-24 then Claremont Avenue 4 veh/h; SR-24 then Telegraph Avenue 4 veh/h.

### Hillegass Avenue SB

Observed: block volume 160 veh/h, whole-street cars 79, so through cars 79 to 120 veh/h. Model: 123 through cars per hour.

Observed (PM): 178 cars entered at the top (76 turned in from Alcatraz Ave west, 98 from the east, 4 came straight from the north), 79 drove the whole street, and 68% of the block's trips (109 veh/h) went to a freeway. ASSUMPTION: freeway-bound cars that did not join mid-street are 87 veh/h (109 x 178 / (178 + 44)), half of the 174 turn-ins; low = the whole-street share of the turn-ins (0.45), high = the freeway-bound share without the mid-street correction (0.63).

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Telegraph Ave, Alcatraz Ave west and West Berkeley traffic turning off Alcatraz Ave onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (76 turn-ins x 0.50) | 38 (34 to 48) | 41 | within |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (98 turn-ins x 0.50) | 49 (44 to 62) | 51 | within |
| Intents listed, together | | 87 (78 to 110) | 92 | |
| Other through cars (no intent listed) | | | 30 | |

Model through cars by origin and destination group (largest 12 of 33 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 40.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 24.4 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 15.8 | Claremont Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 9.7 | Telegraph Avenue |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 8.0 | College Avenue then Claremont Avenue then SR-24 |
| Ashby Ave from the west (Emeryville and I-80) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 5.2 | Alcatraz Avenue then College Avenue |
| San Pablo Ave (Emeryville and West Oakland) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 4.9 | Alcatraz Avenue then College Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Berkeley hills to the northeast (Evergreen Ln, Gravatt Dr) | 3.0 | Alcatraz Avenue then Claremont Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 1.9 | Claremont Avenue |
| College Ave from the north (Berkeley) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 1.9 | College Avenue |
| Berkeley hills to the northeast (Evergreen Ln, Gravatt Dr) | SR-24 westbound on-ramps (toward Oakland and I-980) | 1.3 | Claremont Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Telegraph Ave to the south (downtown Oakland) | 1.2 | Telegraph Avenue |
| other pairs | | 5.3 | |

By the arterial these cars would otherwise use: Telegraph Avenue 76 veh/h; Claremont Avenue then SR-24 17 veh/h; Alcatraz Avenue then College Avenue 10 veh/h; College Avenue then Claremont Avenue then SR-24 8 veh/h; Alcatraz Avenue then Claremont Avenue 5 veh/h; Claremont Avenue 3 veh/h.

### Colby Street SB

Observed: block volume 160 veh/h, whole-street cars 39, so through cars 39 to 117 veh/h. Model: 140 through cars per hour.

Observed (PM): 139 cars entered at the top (76 from Alcatraz Ave west, 50 from the east, 13 from the north), 39 drove the whole street, 45% of the block's trips (72 veh/h) went to a freeway and 22% came by way of Telegraph Ave. ASSUMPTION: freeway-bound cars that did not join mid-street are 46 veh/h (72 x 139 / (139 + 79)), 0.365 of the 126 turn-ins; low = the whole-street share (0.31), high = the unadjusted freeway share (0.57). The Telegraph Ave cars are the 22% x 160 = 35 of the 76 west turn-ins.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Southbound Telegraph Ave traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (35 Telegraph Ave cars x 0.365) | 13 (11 to 20) | 18 | within |
| Alcatraz Ave west, Ashby Ave and West Berkeley traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (41 other west turn-ins x 0.365) | 15 (13 to 23) | 26 | above |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (50 east turn-ins x 0.365) | 18 (15 to 29) | 43 | above |
| Intents listed, together | | 46 (39 to 72) | 87 | |
| Other through cars (no intent listed) | | | 53 | |

Model through cars by origin and destination group (largest 12 of 46 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 23.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 22.3 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 15.8 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 11.4 | Claremont Avenue then SR-24 |
| Shattuck Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 9.2 | none near the study area |
| San Pablo Ave (Emeryville and West Oakland) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 8.0 | Alcatraz Avenue then College Avenue |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 7.6 | College Avenue then Claremont Avenue then SR-24 |
| Ashby Ave from the west (Emeryville and I-80) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 5.6 | Alcatraz Avenue then College Avenue |
| West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) | SR-24 westbound on-ramps (toward Oakland and I-980) | 4.9 | none near the study area |
| Emeryville and West Oakland streets (55th to 67th Streets) | SR-24 westbound on-ramps (toward Oakland and I-980) | 3.9 | none near the study area |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Telegraph Ave to the south (downtown Oakland) | 2.7 | Telegraph Avenue |
| Ashby Ave from the west (Emeryville and I-80) | SR-13 Warren Freeway (via SR-24 east) | 2.6 | SR-24 |
| other pairs | | 22.7 | |

By the arterial these cars would otherwise use: Telegraph Avenue 67 veh/h; none near the study area 21 veh/h; Alcatraz Avenue then College Avenue 14 veh/h; Claremont Avenue then SR-24 11 veh/h; SR-24 8 veh/h; College Avenue then Claremont Avenue then SR-24 8 veh/h.

### Study area, all residential and service streets

Model: 764 through cars per hour.

Model through cars by origin and destination group (largest 12 of 101 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 123.4 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 81.9 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 76.1 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 50.4 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 50.2 | Telegraph Avenue |
| West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) | SR-24 westbound on-ramps (toward Oakland and I-980) | 35.4 | none near the study area |
| Emeryville and West Oakland streets (55th to 67th Streets) | SR-24 westbound on-ramps (toward Oakland and I-980) | 31.5 | none near the study area |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 24.7 | Claremont Avenue then SR-24 |
| Shattuck Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 24.1 | none near the study area |
| San Pablo Ave (Emeryville and West Oakland) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 21.8 | Alcatraz Avenue then College Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 21.2 | SR-24 |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 17.6 | Telegraph Avenue |
| other pairs | | 206.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 454 veh/h; none near the study area 110 veh/h; Alcatraz Avenue then College Avenue 34 veh/h; Alcatraz Avenue then Claremont Avenue 33 veh/h; SR-24 31 veh/h; Claremont Avenue 27 veh/h.

By origin group: South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 162; Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 147; SR-24 eastbound off-ramps (arriving from Oakland and I-980) 130; Telegraph Ave from the north (Berkeley) 61; Emeryville and West Oakland streets (55th to 67th Streets) 51; West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) 37; San Pablo Ave (Emeryville and West Oakland) 31; Claremont Ave and Tunnel Rd toward the hills 27; Shattuck Ave from the north (Berkeley) 24; College Ave from the north (Berkeley) 24.

By destination group: SR-24 westbound on-ramps (toward Oakland and I-980) 268; Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 183; Telegraph Ave from the north (Berkeley) 102; South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 67; Claremont Ave and Tunnel Rd toward the hills 51; Telegraph Ave to the south (downtown Oakland) 19; College Ave from the north (Berkeley) 17; Berkeley hills to the northeast (Evergreen Ln, Gravatt Dr) 11; Ashby Ave from the west (Emeryville and I-80) 9; SR-24 eastbound on-ramps (toward the Caldecott Tunnel) 8.


Per-seed detail: `rockridge-pm_peak-s1-seed1.md` (seed 1 in full).
