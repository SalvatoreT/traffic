# rockridge-pm_peak-s1 over 10 seeds (1, 2, 3, 4, 5, 6, 7, 8, 9, 10)

Seeds are the fixed list above, none chosen; each run is 60 minutes from the same start. Interval = 95% interval of the mean (Student t, n - 1 degrees of freedom). Run-to-run noise only: demand is fixed, so day-to-day variation is not in these intervals.

## Stability rule (design decision D16)

| Check | Rule | Result | Pass |
| --- | --- | --- | --- |
| Removals | mean per hour below 1.00 | 0.10 (min 0.00, max 1.00) | yes |
| Entry backlog | below 2.0% in at least 90% of seeds | 10 of 10 seeds | yes |
| Runaway growth | no seed adds more than 2.0 points of backlog in the second half | none | yes |
| Arterial speed | mean above 4.0 m/s | 9.41 m/s | yes |

**Verdict: stable.** Old rule (zero removals, backlog under 2%, speed above 4 m/s, every seed): 9 of 10 seeds pass.

## Metrics over seeds

| Group | Metric | Unit | Mean | SD | Min | Max | 95% interval |
| --- | --- | --- | --- | --- | --- | --- | --- |
| health | gridlock removals | vehicles | 0.10 | 0.32 | 0.00 | 1.00 | -0.13 to 0.33 |
| health | gridlock removals per hour | veh/h | 0.10 | 0.32 | 0.00 | 1.00 | -0.13 to 0.33 |
| health | entry backlog | % of spawned | 0.03 | 0.02 | 0.01 | 0.06 | 0.02 to 0.04 |
| health | backlog growth in the second half of the run | points of spawned | 0.01 | 0.03 | -0.06 | 0.04 | -0.01 to 0.03 |
| health | completed trips | trips | 24468.10 | 162.53 | 24197.00 | 24694.00 | 24351.84 to 24584.36 |
| health | arterial mean speed | m/s | 9.41 | 0.08 | 9.31 | 9.53 | 9.35 to 9.46 |
| health | arterial mean speed, last 15 min | m/s | 9.39 | 0.13 | 9.17 | 9.54 | 9.29 to 9.48 |
| cut-through | local vehicle-miles, surface gates to the freeway | veh-miles | 39.06 | 3.87 | 31.97 | 44.29 | 36.30 to 41.83 |
| cut-through | share of local vehicle-miles, surface gates to the freeway | % | 8.7 | 0.7 | 7.6 | 9.4 | 8.2 to 9.2 |
| cut-through | local vehicle-miles, freeway to the surface gates | veh-miles | 31.27 | 3.67 | 26.33 | 39.22 | 28.64 to 33.89 |
| cut-through | share of local vehicle-miles, freeway to the surface gates | % | 7.0 | 0.8 | 5.9 | 8.8 | 6.4 to 7.6 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue N | trips | 35.40 | 5.13 | 28.00 | 42.00 | 31.73 to 39.07 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue N | trips | 1459.90 | 42.61 | 1408.00 | 1524.00 | 1429.42 to 1490.38 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue S | trips | 74.40 | 9.71 | 60.00 | 98.00 | 67.46 to 81.34 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue S | trips | 1449.20 | 36.01 | 1401.00 | 1511.00 | 1423.44 to 1474.96 |
| headline share | Hillegass Avenue NB from freeway | % | 50.1 | 2.3 | 45.5 | 52.7 | 48.4 to 51.8 |
| share | Hillegass Avenue NB to Benvenue Avenue | % | 3.8 | 1.5 | 1.1 | 5.8 | 2.7 to 4.8 |
| share | Hillegass Avenue NB to College Avenue | % | 14.9 | 3.6 | 11.0 | 23.2 | 12.3 to 17.5 |
| share | Hillegass Avenue NB to Alcatraz Avenue WB | % | 28.4 | 2.4 | 23.8 | 31.8 | 26.7 to 30.1 |
| headline share | Colby Street NB from freeway | % | 37.7 | 3.1 | 31.6 | 41.9 | 35.5 to 39.9 |
| share | Colby Street NB to Alcatraz Avenue WB | % | 54.3 | 3.8 | 47.5 | 61.8 | 51.6 to 57.1 |
| share | Colby Street NB to Telegraph Avenue | % | 32.1 | 2.8 | 27.4 | 35.6 | 30.1 to 34.1 |
| share | Colby Street NB to College Avenue | % | 6.3 | 2.1 | 3.8 | 9.5 | 4.9 to 7.8 |
| share | Hillegass Avenue SB from Alcatraz Avenue WB | % | 29.9 | 4.4 | 22.4 | 37.0 | 26.7 to 33.1 |
| share | Hillegass Avenue SB from Benvenue Avenue | % | 4.3 | 1.4 | 2.1 | 5.7 | 3.3 to 5.3 |
| share | Hillegass Avenue SB from College Avenue | % | 14.9 | 2.8 | 9.7 | 19.0 | 12.9 to 16.9 |
| headline share | Hillegass Avenue SB to freeway | % | 64.6 | 3.3 | 56.6 | 68.5 | 62.2 to 66.9 |
| share | Colby Street SB from Alcatraz Avenue EB | % | 21.9 | 2.8 | 16.7 | 25.8 | 19.9 to 23.9 |
| share | Colby Street SB from Alcatraz Avenue WB | % | 14.8 | 2.3 | 11.5 | 18.2 | 13.2 to 16.5 |
| share | Colby Street SB from Telegraph Avenue | % | 18.7 | 2.4 | 16.1 | 24.0 | 17.1 to 20.4 |
| headline share | Colby Street SB to freeway | % | 41.9 | 3.5 | 36.0 | 46.5 | 39.4 to 44.4 |
| share | Colby Street SB to Forest Street | % | 19.8 | 3.1 | 15.7 | 24.8 | 17.5 to 22.0 |
| ramp share | onto freeway via College Avenue | % | 14.9 | 1.3 | 12.9 | 16.8 | 14.0 to 15.8 |
| ramp share | onto freeway via Hillegass Avenue | % | 14.9 | 1.0 | 13.8 | 16.8 | 14.2 to 15.7 |
| ramp share | onto freeway via Martin Street | % | 12.0 | 1.8 | 9.7 | 14.2 | 10.8 to 13.3 |
| ramp share | onto freeway via Colby Street | % | 10.3 | 0.7 | 9.4 | 11.8 | 9.8 to 10.8 |
| ramp share | onto freeway via Telegraph Avenue north of Alcatraz Avenue | % | 11.2 | 1.0 | 9.3 | 12.8 | 10.5 to 12.0 |
| ramp share | onto freeway via Benvenue Avenue | % | 4.1 | 0.9 | 2.8 | 5.6 | 3.4 to 4.7 |
| ramp share | from freeway via College Avenue | % | 8.9 | 0.9 | 7.6 | 10.5 | 8.3 to 9.6 |
| ramp share | from freeway via Martin Street | % | 13.1 | 2.0 | 10.0 | 16.4 | 11.7 to 14.5 |
| ramp share | from freeway via Colby Street | % | 10.0 | 1.0 | 8.5 | 12.0 | 9.2 to 10.7 |
| ramp share | from freeway via Hillegass Avenue | % | 6.3 | 1.1 | 4.3 | 8.0 | 5.5 to 7.2 |
| ramp share | from freeway via Benvenue Avenue | % | 3.0 | 0.7 | 2.0 | 3.9 | 2.4 to 3.5 |
| corridor flow | Telegraph N median link flow | veh/h | 1141.44 | 45.33 | 1069.20 | 1218.00 | 1109.02 to 1173.86 |
| corridor flow | Telegraph S median link flow | veh/h | 804.60 | 43.29 | 721.20 | 853.20 | 773.63 to 835.57 |
| corridor flow | College N median link flow | veh/h | 366.84 | 20.78 | 326.40 | 393.60 | 351.98 to 381.70 |
| corridor flow | College S median link flow | veh/h | 687.48 | 26.45 | 660.00 | 747.60 | 668.56 to 706.40 |
| corridor flow | Claremont N median link flow | veh/h | 395.64 | 15.44 | 379.20 | 420.00 | 384.60 to 406.68 |
| corridor flow | Claremont S median link flow | veh/h | 323.76 | 30.39 | 285.60 | 398.40 | 302.02 to 345.50 |
| corridor flow | Alcatraz E median link flow | veh/h | 609.36 | 35.98 | 552.00 | 655.20 | 583.62 to 635.10 |
| corridor flow | Alcatraz W median link flow | veh/h | 346.92 | 20.45 | 320.40 | 376.80 | 332.29 to 361.55 |
| corridor flow | Hillegass N median link flow | veh/h | 108.60 | 10.08 | 86.40 | 123.60 | 101.39 to 115.81 |
| corridor flow | Hillegass S median link flow | veh/h | 141.24 | 11.50 | 123.60 | 160.80 | 133.02 to 149.46 |
| corridor flow | Colby N median link flow | veh/h | 154.32 | 14.60 | 132.00 | 182.40 | 143.88 to 164.76 |
| corridor flow | Colby S median link flow | veh/h | 148.80 | 11.04 | 133.20 | 164.40 | 140.90 to 156.70 |
| corridor flow | Martin E median link flow | veh/h | 122.16 | 17.09 | 98.40 | 150.00 | 109.93 to 134.39 |
| corridor flow | Martin W median link flow | veh/h | 126.96 | 16.85 | 108.00 | 156.00 | 114.91 to 139.01 |

## Intent map: through cars by where they come from and where they are going

Through = neither trip end is in the study area. Groups are the approach groups of the area config (data/areas); a node that is not a gate takes the group of the nearest surface gate (ASSUMPTION). The arterial is the one a trip would use on the shortest free-flow path with the study area's residential and service streets closed, where that path runs on a boundary street near the study area.

Model figures are the mean of 10 seed(s), per hour of the run. Basis: OBSERVED = read from the resident volunteer count of Feb 25, 2025 or its headline shares; ASSUMPTION = inferred from those numbers or chosen.

### Colby Street NB

Observed: block volume 174 veh/h, whole-street cars 102, so through cars 102 to 145 veh/h. Model: 139 through cars per hour.

Observed (PM): 182 cars entered at the south end, 102 drove the whole street, 164 left it at Alcatraz Ave (131 left, 32 right, 1 straight), and 47% of the block's trips came from a freeway (the headline share). ASSUMPTION: freeway-origin cars that do not end along the street are 65 veh/h (the 82 freeway-origin trips on the block, 47% of 174, times the 182 / (182 + 47) of its cars that entered at the south end rather than joining on the way), spread over the 164 exits in proportion (0.40); the other through cars come from the Telegraph Ave and south-side approaches that feed the street's south end. Ranges: low = 131 (32) x 0.47 x 0.62 (the whole-street share of exits), high = 131 (32) x 0.47.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | OBSERVED turn count x ASSUMPTION share (131 left turns x 0.40) | 52 (38 to 62) | 54 | within |
| Telegraph Ave and south-side traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | ASSUMPTION: the through left-turners (131 x 0.62 = 81) that are not off-ramp traffic | 29 (19 to 43) | 48 | above |
| SR-24 off-ramp traffic using Colby St to reach College Ave and Berkeley (right at Alcatraz Ave) | OBSERVED turn count x ASSUMPTION share (32 right turns x 0.40) | 13 (9 to 15) | 15 | within |
| Telegraph Ave and south-side traffic using Colby St to reach College Ave and Berkeley | ASSUMPTION: the through right-turners (32 x 0.62 = 20) that are not off-ramp traffic | 7 (5 to 11) | 21 | above |
| Intents listed, together | | 101 (71 to 131) | 137 | |
| Other through cars (no intent listed) | | | 2 | |

Model through cars by origin and destination group (largest 12 of 40 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 34.9 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 12.3 | Telegraph Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Telegraph Ave from the north (Berkeley) | 8.6 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Emeryville and West Oakland streets (55th to 67th Streets) | 8.5 | Claremont Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Ashby Ave from the west (Emeryville and I-80) | 8.2 | none near the study area |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 7.9 | Telegraph Avenue |
| Telegraph Ave to the south (downtown Oakland) | Telegraph Ave from the north (Berkeley) | 7.9 | Telegraph Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Telegraph Ave from the north (Berkeley) | 6.9 | none near the study area |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Shattuck Ave from the north (Berkeley) | 5.6 | Claremont Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 5.6 | Claremont Avenue then College Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 4.8 | SR-24 |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Ashby Ave from the west (Emeryville and I-80) | 4.5 | SR-24 then Telegraph Avenue |
| other pairs | | 23.5 | |

By the arterial these cars would otherwise use: Telegraph Avenue 74 veh/h; none near the study area 19 veh/h; Claremont Avenue 17 veh/h; SR-24 then Telegraph Avenue 8 veh/h; Claremont Avenue then College Avenue 6 veh/h; SR-24 5 veh/h.

### Hillegass Avenue NB

Observed: block volume 110 veh/h, whole-street cars 48, so through cars 48 to 95 veh/h. Model: 66 through cars per hour.

Observed (PM): 94 cars entered at the south end, 48 drove the whole street, 109 left it at Alcatraz Ave (43 west, 54 east, 12 straight), and 47% of the block's trips came from a freeway. ASSUMPTION: freeway-origin through cars are 40 veh/h (52 freeway-origin trips times 94 / (94 + 29)), spread over the exits in proportion (0.37); the through share of exits is 48 / 109 = 0.44.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Hillegass Ave to reach Alcatraz Ave west and Telegraph Ave north | OBSERVED turn count x ASSUMPTION share (43 left turns x 0.37) | 16 (9 to 20) | 18 | within |
| SR-24 off-ramp traffic using Hillegass Ave to reach College Ave and Berkeley | OBSERVED turn count x ASSUMPTION share (54 right turns x 0.37) | 20 (11 to 25) | 21 | within |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach Alcatraz Ave west | ASSUMPTION: through exits (43 x 0.44) that are not off-ramp traffic | 3 (0 to 10) | 7 | within |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach College Ave and Berkeley | ASSUMPTION: through exits (54 x 0.44) that are not off-ramp traffic | 4 (0 to 13) | 19 | above |
| Intents listed, together | | 43 (20 to 68) | 64 | |
| Other through cars (no intent listed) | | | 2 | |

Model through cars by origin and destination group (largest 12 of 40 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 11.2 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 11.1 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 10.4 | SR-24 |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 5.5 | SR-24 then Claremont Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | College Ave from the north (Berkeley) | 4.8 | SR-24 then Claremont Avenue then College Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Telegraph Ave from the north (Berkeley) | 2.7 | none near the study area |
| West Oakland to the southwest (Adeline St, Market St) | Claremont Ave and Tunnel Rd toward the hills | 1.9 | Claremont Avenue |
| Telegraph Ave to the south (downtown Oakland) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 1.9 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Ashby Ave from the west (Emeryville and I-80) | 1.5 | College Avenue then Alcatraz Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Shattuck Ave from the north (Berkeley) | 1.4 | Claremont Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Claremont Ave and Tunnel Rd toward the hills | 1.3 | Claremont Avenue |
| SR-13 Warren Freeway (via SR-24 east) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 1.3 | Claremont Avenue then Alcatraz Avenue |
| other pairs | | 11.4 | |

By the arterial these cars would otherwise use: Telegraph Avenue 28 veh/h; SR-24 12 veh/h; Claremont Avenue 7 veh/h; SR-24 then Claremont Avenue 6 veh/h; SR-24 then Claremont Avenue then College Avenue 5 veh/h; none near the study area 4 veh/h.

### Hillegass Avenue SB

Observed: block volume 160 veh/h, whole-street cars 79, so through cars 79 to 120 veh/h. Model: 110 through cars per hour.

Observed (PM): 178 cars entered at the top (76 turned in from Alcatraz Ave west, 98 from the east, 4 came straight from the north), 79 drove the whole street, and 68% of the block's trips (109 veh/h) went to a freeway. ASSUMPTION: freeway-bound cars that did not join mid-street are 87 veh/h (109 x 178 / (178 + 44)), half of the 174 turn-ins; low = the whole-street share of the turn-ins (0.45), high = the freeway-bound share without the mid-street correction (0.63).

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Telegraph Ave, Alcatraz Ave west and West Berkeley traffic turning off Alcatraz Ave onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (76 turn-ins x 0.50) | 38 (34 to 48) | 39 | within |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (98 turn-ins x 0.50) | 49 (44 to 62) | 52 | within |
| Intents listed, together | | 87 (78 to 110) | 92 | |
| Other through cars (no intent listed) | | | 18 | |

Model through cars by origin and destination group (largest 12 of 26 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 38.8 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 25.2 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 16.0 | Claremont Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 8.6 | Telegraph Avenue |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 8.6 | College Avenue then Claremont Avenue then SR-24 |
| West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 2.2 | College Avenue |
| Ashby Ave from the west (Emeryville and I-80) | College Ave from the north (Berkeley) | 2.0 | Alcatraz Avenue then College Avenue |
| Berkeley hills to the northeast (Evergreen Ln, Gravatt Dr) | SR-24 westbound on-ramps (toward Oakland and I-980) | 1.3 | Claremont Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 1.2 | Claremont Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Oakland hills to the east (Broadway Terrace, Mountain Blvd, Moraga Ave) | 1.1 | Alcatraz Avenue then College Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 0.7 | Alcatraz Avenue then College Avenue |
| College Ave from the north (Berkeley) | Telegraph Ave to the south (downtown Oakland) | 0.7 | Telegraph Avenue |
| other pairs | | 3.3 | |

By the arterial these cars would otherwise use: Telegraph Avenue 74 veh/h; Claremont Avenue then SR-24 17 veh/h; College Avenue then Claremont Avenue then SR-24 9 veh/h; Alcatraz Avenue then College Avenue 4 veh/h; College Avenue 2 veh/h; Claremont Avenue 2 veh/h.

### Colby Street SB

Observed: block volume 160 veh/h, whole-street cars 39, so through cars 39 to 117 veh/h. Model: 97 through cars per hour.

Observed (PM): 139 cars entered at the top (76 from Alcatraz Ave west, 50 from the east, 13 from the north), 39 drove the whole street, 45% of the block's trips (72 veh/h) went to a freeway and 22% came by way of Telegraph Ave. ASSUMPTION: freeway-bound cars that did not join mid-street are 46 veh/h (72 x 139 / (139 + 79)), 0.365 of the 126 turn-ins; low = the whole-street share (0.31), high = the unadjusted freeway share (0.57). The Telegraph Ave cars are the 22% x 160 = 35 of the 76 west turn-ins.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Southbound Telegraph Ave traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (35 Telegraph Ave cars x 0.365) | 13 (11 to 20) | 19 | within |
| Alcatraz Ave west, Ashby Ave and West Berkeley traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (41 other west turn-ins x 0.365) | 15 (13 to 23) | 15 | within |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (50 east turn-ins x 0.365) | 18 (15 to 29) | 37 | above |
| Intents listed, together | | 46 (39 to 72) | 71 | |
| Other through cars (no intent listed) | | | 27 | |

Model through cars by origin and destination group (largest 12 of 40 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 23.0 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 17.4 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 13.4 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 9.7 | Claremont Avenue then SR-24 |
| Shattuck Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 7.6 | none near the study area |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 3.9 | College Avenue then Claremont Avenue then SR-24 |
| Ashby Ave from the west (Emeryville and I-80) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 2.1 | SR-24 |
| Alcatraz Ave from the west (Emeryville side) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 1.9 | SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Telegraph Ave to the south (downtown Oakland) | 1.7 | Telegraph Avenue |
| Alcatraz Ave from the west (Emeryville side) | SR-13 Warren Freeway (via SR-24 east) | 1.6 | SR-24 |
| Ashby Ave from the west (Emeryville and I-80) | SR-13 Warren Freeway (via SR-24 east) | 1.6 | SR-24 |
| Telegraph Ave from the north (Berkeley) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 1.6 | Telegraph Avenue |
| other pairs | | 11.8 | |

By the arterial these cars would otherwise use: Telegraph Avenue 58 veh/h; Claremont Avenue then SR-24 10 veh/h; none near the study area 10 veh/h; SR-24 7 veh/h; College Avenue then Claremont Avenue then SR-24 4 veh/h; Claremont Avenue 3 veh/h.

### Study area, all residential and service streets

Model: 632 through cars per hour.

Model through cars by origin and destination group (largest 12 of 109 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 77.0 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 65.8 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 50.5 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 44.4 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 34.7 | Telegraph Avenue |
| West Oakland to the southwest (Adeline St, Market St) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 33.8 | Telegraph Avenue then Claremont Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Emeryville and West Oakland streets (55th to 67th Streets) | 33.6 | Claremont Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 29.9 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 23.7 | Claremont Avenue then SR-24 |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Shattuck Ave from the north (Berkeley) | 16.7 | Claremont Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 15.8 | Claremont Avenue then College Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 15.1 | SR-24 |
| other pairs | | 191.5 | |

By the arterial these cars would otherwise use: Telegraph Avenue 353 veh/h; Claremont Avenue 70 veh/h; none near the study area 40 veh/h; Telegraph Avenue then Claremont Avenue 34 veh/h; SR-24 26 veh/h; Claremont Avenue then SR-24 25 veh/h.

By origin group: Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 122; South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 118; SR-24 eastbound off-ramps (arriving from Oakland and I-980) 117; Telegraph Ave from the north (Berkeley) 76; West Oakland to the southwest (Adeline St, Market St) 62; Claremont Ave and Tunnel Rd toward the hills 27; SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) 25; Telegraph Ave to the south (downtown Oakland) 25; Ashby Ave from the west (Emeryville and I-80) 16; College Ave from the north (Berkeley) 14.

By destination group: SR-24 westbound on-ramps (toward Oakland and I-980) 199; Telegraph Ave from the north (Berkeley) 94; Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 90; South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 84; Claremont Ave and Tunnel Rd toward the hills 36; Emeryville and West Oakland streets (55th to 67th Streets) 35; Shattuck Ave from the north (Berkeley) 21; Ashby Ave from the west (Emeryville and I-80) 17; College Ave from the north (Berkeley) 15; West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) 8.


Per-seed detail: `rockridge-pm_peak-s1-seed1.md` (seed 1 in full).
