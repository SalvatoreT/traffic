# rockridge-pm_peak-s1 over 10 seeds (1, 2, 3, 4, 5, 6, 7, 8, 9, 10)

Seeds are the fixed list above, none chosen; each run is 60 minutes from the same start. Interval = 95% interval of the mean (Student t, n - 1 degrees of freedom). Run-to-run noise only: demand is fixed, so day-to-day variation is not in these intervals.

## Stability rule (design decision D16)

| Check | Rule | Result | Pass |
| --- | --- | --- | --- |
| Cars cleared from gridlock near the study area (judged zone) | mean per hour below 1.00 | 0.00 (min 0.00, max 0.00) | yes |
| Entry backlog | below 2.0% in at least 90% of seeds | 10 of 10 seeds | yes |
| Runaway growth | no seed adds more than 2.0 points of backlog in the second half | none | yes |
| Arterial speed | mean above 4.0 m/s | 8.25 m/s | yes |

**Verdict: stable.** Old rule (zero removals, backlog under 2%, speed above 4 m/s, every seed): 2 of 10 seeds pass.

## Metrics over seeds

| Group | Metric | Unit | Mean | SD | Min | Max | 95% interval |
| --- | --- | --- | --- | --- | --- | --- | --- |
| health | gridlock removals | vehicles | 1.10 | 0.88 | 0.00 | 3.00 | 0.47 to 1.73 |
| health | gridlock removals per hour | veh/h | 1.10 | 0.88 | 0.00 | 3.00 | 0.47 to 1.73 |
| health | entry backlog | % of spawned | 0.20 | 0.13 | 0.03 | 0.47 | 0.11 to 0.30 |
| health | backlog growth in the second half of the run | points of spawned | 0.11 | 0.08 | -0.01 | 0.25 | 0.05 to 0.17 |
| health | completed trips | trips | 26915.90 | 177.14 | 26734.00 | 27230.00 | 26789.19 to 27042.61 |
| health | arterial mean speed | m/s | 8.25 | 0.17 | 7.91 | 8.49 | 8.13 to 8.37 |
| health | arterial mean speed, last 15 min | m/s | 8.09 | 0.27 | 7.67 | 8.55 | 7.90 to 8.28 |
| junction recovery | courtesy admissions per hour | veh/h | 223.70 | 36.23 | 179.00 | 279.00 | 197.78 to 249.62 |
| junction recovery | yield fallback admissions per hour | veh/h | 125.90 | 18.88 | 93.00 | 158.00 | 112.39 to 139.41 |
| junction recovery | conflict bypass admissions per hour | veh/h | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| junction recovery | vehicles removed while held in a node, per hour | veh/h | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| gridlock by place | cars cleared from gridlock per hour, judged (near the study area, and far ones whose chain reaches it) | veh/h | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| gridlock by place | cars cleared from gridlock per hour, near the study area | veh/h | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| gridlock by place | cars cleared from gridlock per hour, farther out | veh/h | 1.10 | 0.88 | 0.00 | 3.00 | 0.47 to 1.73 |
| gridlock by place | cars cleared from gridlock per hour, farther out with a chain into the judged zone | veh/h | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| gridlock by place | trips waiting at origins in the judged zone at the end | trips | 1.70 | 0.67 | 0.00 | 2.00 | 1.22 to 2.18 |
| cut-through | local vehicle-miles, surface gates to the freeway | veh-miles | 36.54 | 4.08 | 29.82 | 41.90 | 33.62 to 39.46 |
| cut-through | share of local vehicle-miles, surface gates to the freeway | % | 7.9 | 0.9 | 6.6 | 9.1 | 7.3 to 8.5 |
| cut-through | local vehicle-miles, freeway to the surface gates | veh-miles | 37.29 | 4.10 | 30.71 | 43.26 | 34.36 to 40.22 |
| cut-through | share of local vehicle-miles, freeway to the surface gates | % | 8.1 | 0.7 | 6.8 | 9.1 | 7.6 to 8.6 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue N | trips | 34.50 | 6.59 | 19.00 | 44.00 | 29.79 to 39.21 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue N | trips | 1512.60 | 37.95 | 1469.00 | 1571.00 | 1485.46 to 1539.74 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue S | trips | 53.00 | 11.88 | 38.00 | 74.00 | 44.50 to 61.50 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue S | trips | 1420.10 | 50.55 | 1352.00 | 1502.00 | 1383.94 to 1456.26 |
| headline share | Hillegass Avenue NB from freeway | % | 51.2 | 3.2 | 46.7 | 57.8 | 48.9 to 53.5 |
| share | Hillegass Avenue NB to Benvenue Avenue | % | 1.8 | 1.2 | 0.5 | 4.4 | 1.0 to 2.7 |
| share | Hillegass Avenue NB to College Avenue | % | 8.8 | 1.1 | 7.5 | 11.1 | 8.0 to 9.5 |
| share | Hillegass Avenue NB to Alcatraz Avenue WB | % | 28.5 | 2.8 | 25.3 | 33.2 | 26.4 to 30.5 |
| headline share | Colby Street NB from freeway | % | 45.0 | 3.4 | 40.9 | 52.2 | 42.6 to 47.5 |
| share | Colby Street NB to Alcatraz Avenue WB | % | 49.2 | 3.2 | 43.3 | 53.1 | 46.9 to 51.5 |
| share | Colby Street NB to Telegraph Avenue | % | 43.3 | 3.2 | 37.8 | 46.9 | 41.0 to 45.6 |
| share | Colby Street NB to College Avenue | % | 6.5 | 0.7 | 5.6 | 7.7 | 6.0 to 7.1 |
| share | Hillegass Avenue SB from Alcatraz Avenue WB | % | 32.2 | 5.3 | 23.1 | 39.5 | 28.4 to 36.0 |
| share | Hillegass Avenue SB from Benvenue Avenue | % | 6.4 | 1.2 | 3.8 | 7.9 | 5.5 to 7.2 |
| share | Hillegass Avenue SB from College Avenue | % | 17.0 | 3.5 | 11.5 | 22.6 | 14.5 to 19.5 |
| headline share | Hillegass Avenue SB to freeway | % | 51.3 | 4.3 | 43.7 | 57.4 | 48.2 to 54.3 |
| share | Colby Street SB from Alcatraz Avenue EB | % | 22.5 | 3.1 | 17.6 | 27.2 | 20.3 to 24.7 |
| share | Colby Street SB from Alcatraz Avenue WB | % | 19.1 | 2.6 | 16.3 | 22.7 | 17.2 to 21.0 |
| share | Colby Street SB from Telegraph Avenue | % | 23.3 | 3.0 | 16.1 | 26.5 | 21.1 to 25.5 |
| headline share | Colby Street SB to freeway | % | 42.9 | 3.1 | 36.1 | 46.3 | 40.6 to 45.1 |
| share | Colby Street SB to Forest Street | % | 20.2 | 5.7 | 8.9 | 27.0 | 16.1 to 24.2 |
| ramp share | onto freeway via College Avenue | % | 16.8 | 1.7 | 14.5 | 19.3 | 15.6 to 18.0 |
| ramp share | onto freeway via Hillegass Avenue | % | 14.0 | 1.7 | 12.2 | 18.4 | 12.7 to 15.2 |
| ramp share | onto freeway via Martin Street | % | 13.6 | 2.5 | 7.8 | 16.6 | 11.8 to 15.4 |
| ramp share | onto freeway via Colby Street | % | 13.6 | 1.3 | 11.4 | 15.3 | 12.6 to 14.5 |
| ramp share | onto freeway via Telegraph Avenue north of Alcatraz Avenue | % | 13.2 | 1.2 | 11.4 | 15.7 | 12.4 to 14.1 |
| ramp share | onto freeway via Benvenue Avenue | % | 4.7 | 0.9 | 3.8 | 6.8 | 4.0 to 5.3 |
| ramp share | from freeway via College Avenue | % | 10.0 | 1.0 | 8.7 | 12.3 | 9.3 to 10.7 |
| ramp share | from freeway via Martin Street | % | 13.7 | 1.1 | 12.2 | 15.9 | 12.9 to 14.5 |
| ramp share | from freeway via Colby Street | % | 13.9 | 1.4 | 11.8 | 16.7 | 12.9 to 14.9 |
| ramp share | from freeway via Hillegass Avenue | % | 8.5 | 1.3 | 6.1 | 10.5 | 7.6 to 9.4 |
| ramp share | from freeway via Benvenue Avenue | % | 3.3 | 0.8 | 1.8 | 4.5 | 2.8 to 3.9 |
| corridor flow | Telegraph N median link flow | veh/h | 1273.56 | 80.26 | 1156.80 | 1404.00 | 1216.15 to 1330.97 |
| corridor flow | Telegraph S median link flow | veh/h | 999.96 | 39.29 | 952.80 | 1078.80 | 971.86 to 1028.06 |
| corridor flow | College N median link flow | veh/h | 320.40 | 26.00 | 272.40 | 367.20 | 301.80 to 339.00 |
| corridor flow | College S median link flow | veh/h | 645.00 | 37.00 | 597.60 | 694.80 | 618.54 to 671.46 |
| corridor flow | Claremont N median link flow | veh/h | 456.72 | 22.91 | 415.20 | 482.40 | 440.33 to 473.11 |
| corridor flow | Claremont S median link flow | veh/h | 262.32 | 24.89 | 226.80 | 308.40 | 244.52 to 280.12 |
| corridor flow | Alcatraz E median link flow | veh/h | 514.92 | 38.27 | 456.00 | 568.80 | 487.55 to 542.29 |
| corridor flow | Alcatraz W median link flow | veh/h | 352.44 | 24.26 | 310.80 | 390.00 | 335.09 to 369.79 |
| corridor flow | Hillegass N median link flow | veh/h | 99.84 | 9.70 | 78.00 | 110.40 | 92.90 to 106.78 |
| corridor flow | Hillegass S median link flow | veh/h | 109.56 | 13.27 | 94.80 | 138.00 | 100.07 to 119.05 |
| corridor flow | Colby N median link flow | veh/h | 166.44 | 10.67 | 152.40 | 184.80 | 158.80 to 174.08 |
| corridor flow | Colby S median link flow | veh/h | 133.80 | 13.46 | 115.20 | 153.60 | 124.17 to 143.43 |
| corridor flow | Martin E median link flow | veh/h | 123.96 | 27.94 | 66.00 | 162.00 | 103.97 to 143.95 |
| corridor flow | Martin W median link flow | veh/h | 147.84 | 9.05 | 129.60 | 159.60 | 141.37 to 154.31 |

## Intent map: through cars by where they come from and where they are going

Through = neither trip end is in the study area. Groups are the approach groups of the area config (data/areas); a node that is not a gate takes the group of the nearest surface gate (ASSUMPTION). The arterial is the one a trip would use on the shortest free-flow path with the study area's residential and service streets closed, where that path runs on a boundary street near the study area.

Model figures are the mean of 10 seed(s), per hour of the run. Basis: OBSERVED = read from the resident volunteer count of Feb 25, 2025 or its headline shares; ASSUMPTION = inferred from those numbers or chosen.

### Colby Street NB

Observed: block volume 174 veh/h, whole-street cars 102, so through cars 102 to 145 veh/h. Model: 140 through cars per hour.

Observed (PM): 182 cars entered at the south end, 102 drove the whole street, 164 left it at Alcatraz Ave (131 left, 32 right, 1 straight), and 47% of the block's trips came from a freeway (the headline share). ASSUMPTION: freeway-origin cars that do not end along the street are 65 veh/h (the 82 freeway-origin trips on the block, 47% of 174, times the 182 / (182 + 47) of its cars that entered at the south end rather than joining on the way), spread over the 164 exits in proportion (0.40); the other through cars come from the Telegraph Ave and south-side approaches that feed the street's south end. Ranges: low = 131 (32) x 0.47 x 0.62 (the whole-street share of exits), high = 131 (32) x 0.47.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | OBSERVED turn count x ASSUMPTION share (131 left turns x 0.40) | 52 (38 to 62) | 67 | above |
| Telegraph Ave and south-side traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | ASSUMPTION: the through left-turners (131 x 0.62 = 81) that are not off-ramp traffic | 29 (19 to 43) | 34 | within |
| SR-24 off-ramp traffic using Colby St to reach College Ave and Berkeley (right at Alcatraz Ave) | OBSERVED turn count x ASSUMPTION share (32 right turns x 0.40) | 13 (9 to 15) | 12 | within |
| Telegraph Ave and south-side traffic using Colby St to reach College Ave and Berkeley | ASSUMPTION: the through right-turners (32 x 0.62 = 20) that are not off-ramp traffic | 7 (5 to 11) | 22 | above |
| Intents listed, together | | 101 (71 to 131) | 135 | |
| Other through cars (no intent listed) | | | 4 | |

Model through cars by origin and destination group (largest 12 of 34 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 67.1 | Telegraph Avenue |
| Telegraph Ave to the south (downtown Oakland) | Telegraph Ave from the north (Berkeley) | 10.3 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 9.4 | Claremont Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 9.4 | Claremont Avenue then College Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Ashby Ave from the west (Emeryville and I-80) | 7.0 | none near the study area |
| Telegraph Ave to the south (downtown Oakland) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 6.2 | Telegraph Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Telegraph Ave from the north (Berkeley) | 5.9 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 5.3 | SR-24 then Claremont Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 4.1 | SR-24 |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | College Ave from the north (Berkeley) | 2.8 | SR-24 then Claremont Avenue then College Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Claremont Ave and Tunnel Rd toward the hills | 2.5 | Claremont Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 1.3 | Telegraph Avenue |
| other pairs | | 8.3 | |

By the arterial these cars would otherwise use: Telegraph Avenue 92 veh/h; Claremont Avenue 14 veh/h; Claremont Avenue then College Avenue 9 veh/h; none near the study area 8 veh/h; SR-24 then Claremont Avenue 5 veh/h; SR-24 4 veh/h.

### Hillegass Avenue NB

Observed: block volume 110 veh/h, whole-street cars 48, so through cars 48 to 95 veh/h. Model: 84 through cars per hour.

Observed (PM): 94 cars entered at the south end, 48 drove the whole street, 109 left it at Alcatraz Ave (43 west, 54 east, 12 straight), and 47% of the block's trips came from a freeway. ASSUMPTION: freeway-origin through cars are 40 veh/h (52 freeway-origin trips times 94 / (94 + 29)), spread over the exits in proportion (0.37); the through share of exits is 48 / 109 = 0.44.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Hillegass Ave to reach Alcatraz Ave west and Telegraph Ave north | OBSERVED turn count x ASSUMPTION share (43 left turns x 0.37) | 16 (9 to 20) | 22 | above |
| SR-24 off-ramp traffic using Hillegass Ave to reach College Ave and Berkeley | OBSERVED turn count x ASSUMPTION share (54 right turns x 0.37) | 20 (11 to 25) | 34 | above |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach Alcatraz Ave west | ASSUMPTION: through exits (43 x 0.44) that are not off-ramp traffic | 3 (0 to 10) | 8 | within |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach College Ave and Berkeley | ASSUMPTION: through exits (54 x 0.44) that are not off-ramp traffic | 4 (0 to 13) | 14 | above |
| Intents listed, together | | 43 (20 to 68) | 78 | |
| Other through cars (no intent listed) | | | 7 | |

Model through cars by origin and destination group (largest 12 of 42 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 22.3 | SR-24 |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 14.8 | Telegraph Avenue |
| Telegraph Ave to the south (downtown Oakland) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 6.4 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | College Ave from the north (Berkeley) | 5.3 | SR-24 then Claremont Avenue then College Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 4.5 | SR-24 then Claremont Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 3.7 | Claremont Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 3.4 | Telegraph Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Telegraph Ave from the north (Berkeley) | 2.7 | none near the study area |
| College Ave from the north (Berkeley) | Alcatraz Ave from the west (Emeryville side) | 2.5 | College Avenue then Alcatraz Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Ashby Ave from the west (Emeryville and I-80) | 1.7 | SR-24 then Telegraph Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 1.7 | Claremont Avenue then Alcatraz Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Claremont Ave and Tunnel Rd toward the hills | 1.6 | Claremont Avenue |
| other pairs | | 13.8 | |

By the arterial these cars would otherwise use: Telegraph Avenue 27 veh/h; SR-24 23 veh/h; Claremont Avenue 8 veh/h; SR-24 then Claremont Avenue then College Avenue 5 veh/h; SR-24 then Claremont Avenue 4 veh/h; College Avenue then Alcatraz Avenue 4 veh/h.

### Hillegass Avenue SB

Observed: block volume 160 veh/h, whole-street cars 79, so through cars 79 to 120 veh/h. Model: 122 through cars per hour.

Observed (PM): 178 cars entered at the top (76 turned in from Alcatraz Ave west, 98 from the east, 4 came straight from the north), 79 drove the whole street, and 68% of the block's trips (109 veh/h) went to a freeway. ASSUMPTION: freeway-bound cars that did not join mid-street are 87 veh/h (109 x 178 / (178 + 44)), half of the 174 turn-ins; low = the whole-street share of the turn-ins (0.45), high = the freeway-bound share without the mid-street correction (0.63).

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Telegraph Ave, Alcatraz Ave west and West Berkeley traffic turning off Alcatraz Ave onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (76 turn-ins x 0.50) | 38 (34 to 48) | 40 | within |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (98 turn-ins x 0.50) | 49 (44 to 62) | 51 | within |
| Intents listed, together | | 87 (78 to 110) | 91 | |
| Other through cars (no intent listed) | | | 31 | |

Model through cars by origin and destination group (largest 12 of 32 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 39.4 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 21.6 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 17.9 | Claremont Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 11.3 | Telegraph Avenue |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 8.7 | College Avenue then Claremont Avenue then SR-24 |
| Telegraph Ave from the north (Berkeley) | College Ave from the north (Berkeley) | 4.6 | College Avenue |
| Shattuck Ave from the north (Berkeley) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 4.3 | Claremont Avenue |
| West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 1.9 | Claremont Avenue |
| Telegraph Ave from the north (Berkeley) | Berkeley hills to the northeast (Evergreen Ln, Gravatt Dr) | 1.5 | Claremont Avenue |
| Ashby Ave from the west (Emeryville and I-80) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 1.4 | Alcatraz Avenue then College Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 1.4 | Claremont Avenue |
| Berkeley hills to the northeast (Evergreen Ln, Gravatt Dr) | SR-24 westbound on-ramps (toward Oakland and I-980) | 1.4 | SR-24 |
| other pairs | | 6.8 | |

By the arterial these cars would otherwise use: Telegraph Avenue 74 veh/h; Claremont Avenue then SR-24 18 veh/h; Claremont Avenue 9 veh/h; College Avenue then Claremont Avenue then SR-24 9 veh/h; College Avenue 5 veh/h; Alcatraz Avenue then College Avenue 3 veh/h.

### Colby Street SB

Observed: block volume 160 veh/h, whole-street cars 39, so through cars 39 to 117 veh/h. Model: 140 through cars per hour.

Observed (PM): 139 cars entered at the top (76 from Alcatraz Ave west, 50 from the east, 13 from the north), 39 drove the whole street, 45% of the block's trips (72 veh/h) went to a freeway and 22% came by way of Telegraph Ave. ASSUMPTION: freeway-bound cars that did not join mid-street are 46 veh/h (72 x 139 / (139 + 79)), 0.365 of the 126 turn-ins; low = the whole-street share (0.31), high = the unadjusted freeway share (0.57). The Telegraph Ave cars are the 22% x 160 = 35 of the 76 west turn-ins.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Southbound Telegraph Ave traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (35 Telegraph Ave cars x 0.365) | 13 (11 to 20) | 18 | within |
| Alcatraz Ave west, Ashby Ave and West Berkeley traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (41 other west turn-ins x 0.365) | 15 (13 to 23) | 23 | within |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (50 east turn-ins x 0.365) | 18 (15 to 29) | 36 | above |
| Intents listed, together | | 46 (39 to 72) | 77 | |
| Other through cars (no intent listed) | | | 63 | |

Model through cars by origin and destination group (largest 12 of 51 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 30.3 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 18.5 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 16.2 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 10.2 | Claremont Avenue then SR-24 |
| Shattuck Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 9.4 | none near the study area |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 6.8 | College Avenue then Claremont Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Telegraph Ave to the south (downtown Oakland) | 5.8 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | College Ave from the north (Berkeley) | 4.2 | College Avenue |
| Telegraph Ave from the north (Berkeley) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 3.5 | Telegraph Avenue |
| Emeryville and West Oakland streets (55th to 67th Streets) | SR-24 westbound on-ramps (toward Oakland and I-980) | 3.5 | none near the study area |
| Ashby Ave from the west (Emeryville and I-80) | SR-13 Warren Freeway (via SR-24 east) | 3.0 | SR-24 |
| West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) | SR-24 westbound on-ramps (toward Oakland and I-980) | 2.4 | none near the study area |
| other pairs | | 26.2 | |

By the arterial these cars would otherwise use: Telegraph Avenue 75 veh/h; none near the study area 18 veh/h; Claremont Avenue then SR-24 10 veh/h; SR-24 8 veh/h; College Avenue then Claremont Avenue then SR-24 7 veh/h; Claremont Avenue 6 veh/h.

### Study area, all residential and service streets

Model: 732 through cars per hour.

Model through cars by origin and destination group (largest 12 of 99 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 76.7 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 74.2 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 67.8 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 49.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 45.7 | Claremont Avenue then College Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 37.4 | Telegraph Avenue |
| Emeryville and West Oakland streets (55th to 67th Streets) | SR-24 westbound on-ramps (toward Oakland and I-980) | 28.5 | none near the study area |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 24.8 | Claremont Avenue then SR-24 |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 22.3 | SR-24 |
| Shattuck Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 21.6 | none near the study area |
| Telegraph Ave from the north (Berkeley) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 20.8 | Telegraph Avenue |
| West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) | SR-24 westbound on-ramps (toward Oakland and I-980) | 20.0 | none near the study area |
| other pairs | | 242.9 | |

By the arterial these cars would otherwise use: Telegraph Avenue 393 veh/h; none near the study area 80 veh/h; Claremont Avenue 67 veh/h; Claremont Avenue then College Avenue 47 veh/h; SR-24 32 veh/h; Claremont Avenue then SR-24 25 veh/h.

By origin group: Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 166; SR-24 eastbound off-ramps (arriving from Oakland and I-980) 126; South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 108; Telegraph Ave from the north (Berkeley) 84; Emeryville and West Oakland streets (55th to 67th Streets) 60; Telegraph Ave to the south (downtown Oakland) 31; Shattuck Ave from the north (Berkeley) 30; Claremont Ave and Tunnel Rd toward the hills 26; West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) 25; College Ave from the north (Berkeley) 22.

By destination group: SR-24 westbound on-ramps (toward Oakland and I-980) 237; Telegraph Ave from the north (Berkeley) 143; South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 110; Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 104; Claremont Ave and Tunnel Rd toward the hills 50; College Ave from the north (Berkeley) 24; Ashby Ave from the west (Emeryville and I-80) 17; Telegraph Ave to the south (downtown Oakland) 8; Alcatraz Ave from the west (Emeryville side) 8; SR-24 eastbound on-ramps (toward the Caldecott Tunnel) 7.


Per-seed detail: `rockridge-pm_peak-s1-seed1.md` (seed 1 in full).
