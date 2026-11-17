# rockridge-am_peak-s1 over 10 seeds (1, 2, 3, 4, 5, 6, 7, 8, 9, 10)

Seeds are the fixed list above, none chosen; each run is 60 minutes from the same start. Interval = 95% interval of the mean (Student t, n - 1 degrees of freedom). Run-to-run noise only: demand is fixed, so day-to-day variation is not in these intervals.

## Stability rule (design decision D16)

| Check | Rule | Result | Pass |
| --- | --- | --- | --- |
| Cars cleared from gridlock near the study area (judged zone) | mean per hour below 1.00 | 0.00 (min 0.00, max 0.00) | yes |
| Entry backlog | below 2.0% in at least 90% of seeds | 10 of 10 seeds | yes |
| Runaway growth | no seed adds more than 2.0 points of backlog in the second half | none | yes |
| Arterial speed | mean above 4.0 m/s | 9.36 m/s | yes |

**Verdict: stable.** Old rule (zero removals, backlog under 2%, speed above 4 m/s, every seed): 8 of 10 seeds pass.

## Metrics over seeds

| Group | Metric | Unit | Mean | SD | Min | Max | 95% interval |
| --- | --- | --- | --- | --- | --- | --- | --- |
| health | gridlock removals | vehicles | 0.30 | 0.67 | 0.00 | 2.00 | -0.18 to 0.78 |
| health | gridlock removals per hour | veh/h | 0.30 | 0.67 | 0.00 | 2.00 | -0.18 to 0.78 |
| health | entry backlog | % of spawned | 0.03 | 0.05 | 0.00 | 0.16 | -0.01 to 0.06 |
| health | backlog growth in the second half of the run | points of spawned | 0.02 | 0.05 | -0.02 | 0.15 | -0.02 to 0.05 |
| health | completed trips | trips | 22627.60 | 142.66 | 22444.00 | 22875.00 | 22525.56 to 22729.64 |
| health | arterial mean speed | m/s | 9.36 | 0.12 | 9.12 | 9.51 | 9.28 to 9.45 |
| health | arterial mean speed, last 15 min | m/s | 9.38 | 0.17 | 9.12 | 9.64 | 9.25 to 9.50 |
| junction recovery | courtesy admissions per hour | veh/h | 125.10 | 13.40 | 107.00 | 150.00 | 115.52 to 134.68 |
| junction recovery | yield fallback admissions per hour | veh/h | 34.50 | 10.96 | 18.00 | 49.00 | 26.66 to 42.34 |
| junction recovery | conflict bypass admissions per hour | veh/h | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| junction recovery | vehicles removed while held in a node, per hour | veh/h | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| gridlock by place | cars cleared from gridlock per hour, judged (near the study area, and far ones whose chain reaches it) | veh/h | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| gridlock by place | cars cleared from gridlock per hour, near the study area | veh/h | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| gridlock by place | cars cleared from gridlock per hour, farther out | veh/h | 0.30 | 0.67 | 0.00 | 2.00 | -0.18 to 0.78 |
| gridlock by place | cars cleared from gridlock per hour, farther out with a chain into the judged zone | veh/h | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| gridlock by place | trips waiting at origins in the judged zone at the end | trips | 0.40 | 0.52 | 0.00 | 1.00 | 0.03 to 0.77 |
| cut-through | local vehicle-miles, surface gates to the freeway | veh-miles | 20.44 | 3.31 | 16.10 | 26.54 | 18.07 to 22.81 |
| cut-through | share of local vehicle-miles, surface gates to the freeway | % | 5.8 | 0.8 | 4.8 | 7.3 | 5.3 to 6.4 |
| cut-through | local vehicle-miles, freeway to the surface gates | veh-miles | 21.67 | 3.02 | 17.99 | 27.35 | 19.51 to 23.83 |
| cut-through | share of local vehicle-miles, freeway to the surface gates | % | 6.2 | 0.9 | 5.0 | 7.5 | 5.6 to 6.8 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue N | trips | 34.60 | 4.67 | 25.00 | 41.00 | 31.26 to 37.94 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue N | trips | 1016.80 | 21.64 | 978.00 | 1053.00 | 1001.32 to 1032.28 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue S | trips | 28.20 | 7.36 | 17.00 | 38.00 | 22.93 to 33.47 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue S | trips | 1275.70 | 33.45 | 1214.00 | 1337.00 | 1251.77 to 1299.63 |
| headline share | Hillegass Avenue NB from freeway | % | 50.8 | 3.2 | 46.2 | 57.8 | 48.5 to 53.1 |
| share | Hillegass Avenue NB to Benvenue Avenue | % | 8.1 | 1.5 | 6.7 | 11.5 | 7.0 to 9.1 |
| share | Hillegass Avenue NB to College Avenue | % | 12.3 | 3.0 | 7.7 | 17.6 | 10.1 to 14.4 |
| share | Hillegass Avenue NB to Alcatraz Avenue WB | % | 32.3 | 3.2 | 26.0 | 36.8 | 30.0 to 34.6 |
| headline share | Colby Street NB from freeway | % | 43.9 | 2.5 | 40.6 | 48.1 | 42.0 to 45.7 |
| share | Colby Street NB to Alcatraz Avenue WB | % | 46.7 | 5.3 | 36.4 | 57.7 | 42.9 to 50.4 |
| share | Colby Street NB to Telegraph Avenue | % | 40.2 | 4.6 | 34.8 | 49.7 | 36.9 to 43.5 |
| share | Colby Street NB to College Avenue | % | 2.8 | 1.5 | 0.5 | 5.1 | 1.7 to 3.9 |
| share | Hillegass Avenue SB from Alcatraz Avenue WB | % | 16.3 | 3.8 | 8.7 | 22.0 | 13.6 to 19.1 |
| share | Hillegass Avenue SB from Benvenue Avenue | % | 1.8 | 1.0 | 0.0 | 3.6 | 1.1 to 2.5 |
| share | Hillegass Avenue SB from College Avenue | % | 11.6 | 3.3 | 6.8 | 16.2 | 9.3 to 14.0 |
| headline share | Hillegass Avenue SB to freeway | % | 59.6 | 2.9 | 56.4 | 64.7 | 57.5 to 61.6 |
| share | Colby Street SB from Alcatraz Avenue EB | % | 21.0 | 2.2 | 16.2 | 23.8 | 19.4 to 22.6 |
| share | Colby Street SB from Alcatraz Avenue WB | % | 7.6 | 1.5 | 5.4 | 9.2 | 6.5 to 8.6 |
| share | Colby Street SB from Telegraph Avenue | % | 18.4 | 3.1 | 11.9 | 22.0 | 16.1 to 20.6 |
| headline share | Colby Street SB to freeway | % | 47.3 | 5.0 | 41.0 | 55.0 | 43.8 to 50.9 |
| share | Colby Street SB to Forest Street | % | 15.9 | 3.5 | 11.5 | 23.0 | 13.4 to 18.4 |
| ramp share | onto freeway via College Avenue | % | 15.4 | 1.2 | 13.2 | 16.8 | 14.5 to 16.2 |
| ramp share | onto freeway via Hillegass Avenue | % | 13.0 | 1.8 | 9.5 | 15.9 | 11.8 to 14.3 |
| ramp share | onto freeway via Martin Street | % | 13.1 | 0.8 | 11.3 | 14.3 | 12.5 to 13.7 |
| ramp share | onto freeway via Colby Street | % | 14.6 | 1.4 | 11.9 | 17.1 | 13.6 to 15.6 |
| ramp share | onto freeway via Telegraph Avenue north of Alcatraz Avenue | % | 8.0 | 0.9 | 6.5 | 9.2 | 7.3 to 8.6 |
| ramp share | onto freeway via Benvenue Avenue | % | 4.1 | 0.8 | 3.2 | 5.6 | 3.5 to 4.6 |
| ramp share | from freeway via College Avenue | % | 9.5 | 1.5 | 8.0 | 13.0 | 8.4 to 10.5 |
| ramp share | from freeway via Martin Street | % | 11.3 | 0.7 | 9.8 | 12.2 | 10.8 to 11.8 |
| ramp share | from freeway via Colby Street | % | 9.9 | 1.2 | 8.5 | 11.8 | 9.1 to 10.8 |
| ramp share | from freeway via Hillegass Avenue | % | 8.4 | 0.8 | 7.2 | 9.4 | 7.8 to 9.0 |
| ramp share | from freeway via Benvenue Avenue | % | 2.4 | 0.5 | 1.6 | 3.3 | 2.0 to 2.7 |
| corridor flow | Telegraph N median link flow | veh/h | 859.92 | 33.27 | 782.40 | 898.80 | 836.12 to 883.72 |
| corridor flow | Telegraph S median link flow | veh/h | 886.32 | 44.59 | 807.60 | 940.80 | 854.43 to 918.21 |
| corridor flow | College N median link flow | veh/h | 268.08 | 24.57 | 237.60 | 298.80 | 250.51 to 285.65 |
| corridor flow | College S median link flow | veh/h | 423.96 | 28.02 | 362.40 | 458.40 | 403.92 to 444.00 |
| corridor flow | Claremont N median link flow | veh/h | 285.72 | 15.01 | 268.80 | 307.20 | 274.98 to 296.46 |
| corridor flow | Claremont S median link flow | veh/h | 400.32 | 30.55 | 336.00 | 448.80 | 378.47 to 422.17 |
| corridor flow | Alcatraz E median link flow | veh/h | 457.20 | 31.53 | 412.80 | 536.40 | 434.65 to 479.75 |
| corridor flow | Alcatraz W median link flow | veh/h | 374.40 | 14.61 | 344.40 | 391.20 | 363.95 to 384.85 |
| corridor flow | Hillegass N median link flow | veh/h | 95.04 | 12.83 | 75.60 | 117.60 | 85.86 to 104.22 |
| corridor flow | Hillegass S median link flow | veh/h | 77.40 | 11.00 | 64.80 | 102.00 | 69.53 to 85.27 |
| corridor flow | Colby N median link flow | veh/h | 107.28 | 8.88 | 94.80 | 126.00 | 100.93 to 113.63 |
| corridor flow | Colby S median link flow | veh/h | 129.48 | 12.41 | 115.20 | 152.40 | 120.60 to 138.36 |
| corridor flow | Martin E median link flow | veh/h | 100.92 | 10.36 | 81.60 | 115.20 | 93.51 to 108.33 |
| corridor flow | Martin W median link flow | veh/h | 96.36 | 8.24 | 80.40 | 104.40 | 90.47 to 102.25 |

## Intent map: through cars by where they come from and where they are going

Through = neither trip end is in the study area. Groups are the approach groups of the area config (data/areas); a node that is not a gate takes the group of the nearest surface gate (ASSUMPTION). The arterial is the one a trip would use on the shortest free-flow path with the study area's residential and service streets closed, where that path runs on a boundary street near the study area.

Model figures are the mean of 10 seed(s), per hour of the run. Basis: OBSERVED = read from the resident volunteer count of Feb 25, 2025 or its headline shares; ASSUMPTION = inferred from those numbers or chosen.

### Colby Street NB

Observed (PM): 182 cars entered at the south end, 102 drove the whole street, 164 left it at Alcatraz Ave (131 left, 32 right, 1 straight), and 47% of the block's trips came from a freeway (the headline share). ASSUMPTION: freeway-origin cars that do not end along the street are 65 veh/h (the 82 freeway-origin trips on the block, 47% of 174, times the 182 / (182 + 47) of its cars that entered at the south end rather than joining on the way), spread over the 164 exits in proportion (0.40); the other through cars come from the Telegraph Ave and south-side approaches that feed the street's south end. Ranges: low = 131 (32) x 0.47 x 0.62 (the whole-street share of exits), high = 131 (32) x 0.47.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | OBSERVED turn count x ASSUMPTION share (131 left turns x 0.40) | 52 (38 to 62) | 36 | below |
| Telegraph Ave and south-side traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | ASSUMPTION: the through left-turners (131 x 0.62 = 81) that are not off-ramp traffic | 29 (19 to 43) | 21 | within |
| SR-24 off-ramp traffic using Colby St to reach College Ave and Berkeley (right at Alcatraz Ave) | OBSERVED turn count x ASSUMPTION share (32 right turns x 0.40) | 13 (9 to 15) | 3 | below |
| Telegraph Ave and south-side traffic using Colby St to reach College Ave and Berkeley | ASSUMPTION: the through right-turners (32 x 0.62 = 20) that are not off-ramp traffic | 7 (5 to 11) | 27 | above |
| Intents listed, together | | 101 (71 to 131) | 87 | |
| Other through cars (no intent listed) | | | 2 | |

Model through cars by origin and destination group (largest 12 of 27 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 36.3 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 24.7 | College Avenue then Alcatraz Avenue |
| Telegraph Ave to the south (downtown Oakland) | Telegraph Ave from the north (Berkeley) | 10.8 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 2.9 | Claremont Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Emeryville and West Oakland streets (55th to 67th Streets) | 2.2 | Claremont Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Ashby Ave from the west (Emeryville and I-80) | 1.7 | Claremont Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 1.7 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Shattuck Ave from the north (Berkeley) | 1.3 | Claremont Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Telegraph Ave from the north (Berkeley) | 1.3 | Telegraph Avenue |
| Telegraph Ave to the south (downtown Oakland) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 1.2 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 1.1 | SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | College Ave from the north (Berkeley) | 0.5 | Telegraph Avenue |
| other pairs | | 3.1 | |

By the arterial these cars would otherwise use: Telegraph Avenue 52 veh/h; College Avenue then Alcatraz Avenue 25 veh/h; Claremont Avenue 8 veh/h; SR-24 1 veh/h; Alcatraz Avenue then Claremont Avenue 0 veh/h; SR-24 then Telegraph Avenue then Alcatraz Avenue 0 veh/h.

### Hillegass Avenue NB

Observed (PM): 94 cars entered at the south end, 48 drove the whole street, 109 left it at Alcatraz Ave (43 west, 54 east, 12 straight), and 47% of the block's trips came from a freeway. ASSUMPTION: freeway-origin through cars are 40 veh/h (52 freeway-origin trips times 94 / (94 + 29)), spread over the exits in proportion (0.37); the through share of exits is 48 / 109 = 0.44.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Hillegass Ave to reach Alcatraz Ave west and Telegraph Ave north | OBSERVED turn count x ASSUMPTION share (43 left turns x 0.37) | 16 (9 to 20) | 20 | within |
| SR-24 off-ramp traffic using Hillegass Ave to reach College Ave and Berkeley | OBSERVED turn count x ASSUMPTION share (54 right turns x 0.37) | 20 (11 to 25) | 24 | within |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach Alcatraz Ave west | ASSUMPTION: through exits (43 x 0.44) that are not off-ramp traffic | 3 (0 to 10) | 5 | within |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach College Ave and Berkeley | ASSUMPTION: through exits (54 x 0.44) that are not off-ramp traffic | 4 (0 to 13) | 19 | above |
| Intents listed, together | | 43 (20 to 68) | 67 | |
| Other through cars (no intent listed) | | | 2 | |

Model through cars by origin and destination group (largest 12 of 38 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 12.6 | SR-24 |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 12.6 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 11.3 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 5.6 | SR-24 then Claremont Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | College Ave from the north (Berkeley) | 5.0 | SR-24 then Claremont Avenue then College Avenue |
| Telegraph Ave to the south (downtown Oakland) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 4.0 | Telegraph Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Ashby Ave from the west (Emeryville and I-80) | 2.1 | SR-24 then Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 1.6 | Claremont Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | San Pablo Ave (Emeryville and West Oakland) | 1.6 | SR-24 |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Telegraph Ave from the north (Berkeley) | 1.4 | none near the study area |
| West Oakland to the southwest (Adeline St, Market St) | Telegraph Ave from the north (Berkeley) | 1.1 | Telegraph Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Shattuck Ave from the north (Berkeley) | 1.1 | SR-24 then Telegraph Avenue then Alcatraz Avenue |
| other pairs | | 9.8 | |

By the arterial these cars would otherwise use: Telegraph Avenue 31 veh/h; SR-24 14 veh/h; SR-24 then Claremont Avenue 6 veh/h; SR-24 then Claremont Avenue then College Avenue 5 veh/h; Claremont Avenue 4 veh/h; SR-24 then Telegraph Avenue 3 veh/h.

### Hillegass Avenue SB

Observed (PM): 178 cars entered at the top (76 turned in from Alcatraz Ave west, 98 from the east, 4 came straight from the north), 79 drove the whole street, and 68% of the block's trips (109 veh/h) went to a freeway. ASSUMPTION: freeway-bound cars that did not join mid-street are 87 veh/h (109 x 178 / (178 + 44)), half of the 174 turn-ins; low = the whole-street share of the turn-ins (0.45), high = the freeway-bound share without the mid-street correction (0.63).

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Telegraph Ave, Alcatraz Ave west and West Berkeley traffic turning off Alcatraz Ave onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (76 turn-ins x 0.50) | 38 (34 to 48) | 15 | below |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (98 turn-ins x 0.50) | 49 (44 to 62) | 20 | below |
| Intents listed, together | | 87 (78 to 110) | 35 | |
| Other through cars (no intent listed) | | | 35 | |

Model through cars by origin and destination group (largest 12 of 25 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 24.1 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 14.2 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 10.2 | Claremont Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 5.1 | Claremont Avenue then SR-24 |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 4.8 | College Avenue then Claremont Avenue then SR-24 |
| Telegraph Ave from the north (Berkeley) | College Ave from the north (Berkeley) | 2.7 | College Avenue |
| Telegraph Ave from the north (Berkeley) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 2.3 | College Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Telegraph Ave to the south (downtown Oakland) | 2.1 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | West Oakland to the southwest (Adeline St, Market St) | 1.4 | Telegraph Avenue |
| Shattuck Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 0.4 | none near the study area |
| College Ave from the north (Berkeley) | Telegraph Ave to the south (downtown Oakland) | 0.3 | Alcatraz Avenue then Telegraph Avenue |
| Emeryville and West Oakland streets (55th to 67th Streets) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 0.3 | Alcatraz Avenue then College Avenue |
| other pairs | | 1.7 | |

By the arterial these cars would otherwise use: Telegraph Avenue 42 veh/h; Claremont Avenue then SR-24 15 veh/h; College Avenue 5 veh/h; College Avenue then Claremont Avenue then SR-24 5 veh/h; none near the study area 1 veh/h; Alcatraz Avenue then College Avenue 0 veh/h.

### Colby Street SB

Observed (PM): 139 cars entered at the top (76 from Alcatraz Ave west, 50 from the east, 13 from the north), 39 drove the whole street, 45% of the block's trips (72 veh/h) went to a freeway and 22% came by way of Telegraph Ave. ASSUMPTION: freeway-bound cars that did not join mid-street are 46 veh/h (72 x 139 / (139 + 79)), 0.365 of the 126 turn-ins; low = the whole-street share (0.31), high = the unadjusted freeway share (0.57). The Telegraph Ave cars are the 22% x 160 = 35 of the 76 west turn-ins.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Southbound Telegraph Ave traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (35 Telegraph Ave cars x 0.365) | 13 (11 to 20) | 16 | within |
| Alcatraz Ave west, Ashby Ave and West Berkeley traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (41 other west turn-ins x 0.365) | 15 (13 to 23) | 17 | within |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (50 east turn-ins x 0.365) | 18 (15 to 29) | 9 | below |
| Intents listed, together | | 46 (39 to 72) | 42 | |
| Other through cars (no intent listed) | | | 48 | |

Model through cars by origin and destination group (largest 12 of 45 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 29.0 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 13.7 | Telegraph Avenue |
| Shattuck Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 7.0 | none near the study area |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 6.7 | Telegraph Avenue |
| Ashby Ave from the west (Emeryville and I-80) | SR-13 Warren Freeway (via SR-24 east) | 3.7 | SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Telegraph Ave to the south (downtown Oakland) | 3.3 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 3.2 | Telegraph Avenue |
| Ashby Ave from the west (Emeryville and I-80) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 2.9 | SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | West Oakland to the southwest (Adeline St, Market St) | 2.6 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 2.6 | none near the study area |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 2.2 | Telegraph Avenue |
| Alcatraz Ave from the west (Emeryville side) | SR-13 Warren Freeway (via SR-24 east) | 2.1 | SR-24 |
| other pairs | | 11.1 | |

By the arterial these cars would otherwise use: Telegraph Avenue 61 veh/h; none near the study area 11 veh/h; SR-24 10 veh/h; College Avenue then Claremont Avenue then SR-24 2 veh/h; Alcatraz Avenue then College Avenue 1 veh/h; Alcatraz Avenue then Telegraph Avenue 1 veh/h.

### Study area, all residential and service streets

Model: 466 through cars per hour.

Model through cars by origin and destination group (largest 12 of 94 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 72.1 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 59.0 | College Avenue then Alcatraz Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 46.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 33.1 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 27.5 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 14.8 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 13.2 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 12.7 | SR-24 |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Emeryville and West Oakland streets (55th to 67th Streets) | 11.2 | Claremont Avenue |
| Telegraph Ave to the south (downtown Oakland) | Telegraph Ave from the north (Berkeley) | 10.9 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 10.3 | Claremont Avenue then SR-24 |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Ashby Ave from the west (Emeryville and I-80) | 10.0 | Claremont Avenue |
| other pairs | | 144.9 | |

By the arterial these cars would otherwise use: Telegraph Avenue 259 veh/h; College Avenue then Alcatraz Avenue 61 veh/h; Claremont Avenue 41 veh/h; SR-24 24 veh/h; none near the study area 19 veh/h; Claremont Avenue then SR-24 10 veh/h.

By origin group: Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 124; South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 101; SR-24 eastbound off-ramps (arriving from Oakland and I-980) 78; Telegraph Ave from the north (Berkeley) 49; Telegraph Ave to the south (downtown Oakland) 34; Claremont Ave and Tunnel Rd toward the hills 12; West Oakland to the southwest (Adeline St, Market St) 11; Shattuck Ave from the north (Berkeley) 10; Ashby Ave from the west (Emeryville and I-80) 9; Emeryville and West Oakland streets (55th to 67th Streets) 8.

By destination group: South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 111; SR-24 westbound on-ramps (toward Oakland and I-980) 92; Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 88; Telegraph Ave from the north (Berkeley) 69; Claremont Ave and Tunnel Rd toward the hills 19; College Ave from the north (Berkeley) 17; Emeryville and West Oakland streets (55th to 67th Streets) 13; Ashby Ave from the west (Emeryville and I-80) 12; Telegraph Ave to the south (downtown Oakland) 10; Shattuck Ave from the north (Berkeley) 9.


Per-seed detail: `rockridge-am_peak-s1-seed1.md` (seed 1 in full).
