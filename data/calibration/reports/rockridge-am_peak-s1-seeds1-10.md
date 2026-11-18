# rockridge-am_peak-s1 over 10 seeds (1, 2, 3, 4, 5, 6, 7, 8, 9, 10)

Seeds are the fixed list above, none chosen; each run is 60 minutes from the same start. Interval = 95% interval of the mean (Student t, n - 1 degrees of freedom). Run-to-run noise only: demand is fixed, so day-to-day variation is not in these intervals.

## Stability rule (design decision D16)

| Check | Rule | Result | Pass |
| --- | --- | --- | --- |
| Cars cleared from gridlock near the study area (judged zone) | mean per hour below 1.00 | 0.00 (min 0.00, max 0.00) | yes |
| Entry backlog | below 2.0% in at least 90% of seeds | 10 of 10 seeds | yes |
| Runaway growth | no seed adds more than 2.0 points of backlog in the second half | none | yes |
| Arterial speed | mean above 4.0 m/s | 8.95 m/s | yes |

**Verdict: stable.** Old rule (zero removals, backlog under 2%, speed above 4 m/s, every seed): 7 of 10 seeds pass.

## Metrics over seeds

| Group | Metric | Unit | Mean | SD | Min | Max | 95% interval |
| --- | --- | --- | --- | --- | --- | --- | --- |
| health | gridlock removals | vehicles | 0.40 | 0.70 | 0.00 | 2.00 | -0.10 to 0.90 |
| health | gridlock removals per hour | veh/h | 0.40 | 0.70 | 0.00 | 2.00 | -0.10 to 0.90 |
| health | entry backlog | % of spawned | 0.13 | 0.15 | 0.01 | 0.50 | 0.02 to 0.24 |
| health | backlog growth in the second half of the run | points of spawned | 0.08 | 0.13 | -0.03 | 0.38 | -0.01 to 0.17 |
| health | completed trips | trips | 23721.80 | 149.61 | 23496.00 | 23993.00 | 23614.78 to 23828.82 |
| health | arterial mean speed | m/s | 8.95 | 0.09 | 8.79 | 9.10 | 8.88 to 9.02 |
| health | arterial mean speed, last 15 min | m/s | 8.99 | 0.12 | 8.86 | 9.16 | 8.91 to 9.07 |
| junction recovery | courtesy admissions per hour | veh/h | 133.90 | 18.29 | 106.00 | 160.00 | 120.82 to 146.98 |
| junction recovery | yield fallback admissions per hour | veh/h | 56.20 | 11.42 | 37.00 | 80.00 | 48.03 to 64.37 |
| junction recovery | conflict bypass admissions per hour | veh/h | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| junction recovery | vehicles removed while held in a node, per hour | veh/h | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| gridlock by place | cars cleared from gridlock per hour, judged (near the study area, and far ones whose chain reaches it) | veh/h | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| gridlock by place | cars cleared from gridlock per hour, near the study area | veh/h | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| gridlock by place | cars cleared from gridlock per hour, farther out | veh/h | 0.40 | 0.70 | 0.00 | 2.00 | -0.10 to 0.90 |
| gridlock by place | cars cleared from gridlock per hour, farther out with a chain into the judged zone | veh/h | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| gridlock by place | trips waiting at origins in the judged zone at the end | trips | 0.30 | 0.67 | 0.00 | 2.00 | -0.18 to 0.78 |
| cut-through | local vehicle-miles, surface gates to the freeway | veh-miles | 19.29 | 2.20 | 15.98 | 23.13 | 17.72 to 20.86 |
| cut-through | share of local vehicle-miles, surface gates to the freeway | % | 5.8 | 0.5 | 5.1 | 6.5 | 5.4 to 6.2 |
| cut-through | local vehicle-miles, freeway to the surface gates | veh-miles | 21.77 | 1.53 | 19.29 | 23.74 | 20.68 to 22.86 |
| cut-through | share of local vehicle-miles, freeway to the surface gates | % | 6.5 | 0.4 | 6.0 | 7.1 | 6.3 to 6.8 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue N | trips | 36.40 | 4.48 | 29.00 | 43.00 | 33.20 to 39.60 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue N | trips | 1143.00 | 44.51 | 1070.00 | 1219.00 | 1111.16 to 1174.84 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue S | trips | 16.90 | 3.31 | 12.00 | 21.00 | 14.53 to 19.27 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue S | trips | 1203.80 | 22.72 | 1172.00 | 1231.00 | 1187.55 to 1220.05 |
| headline share | Hillegass Avenue NB from freeway | % | 53.0 | 5.1 | 48.1 | 63.1 | 49.4 to 56.6 |
| share | Hillegass Avenue NB to Benvenue Avenue | % | 10.9 | 3.5 | 7.7 | 19.5 | 8.3 to 13.4 |
| share | Hillegass Avenue NB to College Avenue | % | 12.9 | 2.0 | 9.5 | 16.7 | 11.5 to 14.3 |
| share | Hillegass Avenue NB to Alcatraz Avenue WB | % | 39.4 | 5.3 | 28.7 | 45.4 | 35.5 to 43.2 |
| headline share | Colby Street NB from freeway | % | 44.6 | 3.0 | 41.5 | 50.8 | 42.4 to 46.8 |
| share | Colby Street NB to Alcatraz Avenue WB | % | 42.7 | 3.3 | 38.5 | 48.2 | 40.4 to 45.1 |
| share | Colby Street NB to Telegraph Avenue | % | 45.0 | 3.5 | 38.7 | 50.3 | 42.5 to 47.5 |
| share | Colby Street NB to College Avenue | % | 2.4 | 1.1 | 1.4 | 4.5 | 1.6 to 3.2 |
| share | Hillegass Avenue SB from Alcatraz Avenue WB | % | 18.2 | 3.5 | 10.6 | 23.3 | 15.7 to 20.8 |
| share | Hillegass Avenue SB from Benvenue Avenue | % | 3.2 | 1.3 | 1.5 | 5.2 | 2.3 to 4.1 |
| share | Hillegass Avenue SB from College Avenue | % | 9.4 | 2.3 | 5.3 | 12.4 | 7.7 to 11.0 |
| headline share | Hillegass Avenue SB to freeway | % | 45.6 | 3.0 | 40.2 | 49.6 | 43.4 to 47.8 |
| share | Colby Street SB from Alcatraz Avenue EB | % | 19.4 | 3.0 | 14.7 | 23.8 | 17.2 to 21.5 |
| share | Colby Street SB from Alcatraz Avenue WB | % | 13.1 | 2.5 | 8.9 | 16.8 | 11.3 to 14.9 |
| share | Colby Street SB from Telegraph Avenue | % | 17.4 | 2.0 | 13.1 | 20.9 | 16.0 to 18.9 |
| headline share | Colby Street SB to freeway | % | 36.1 | 3.7 | 29.0 | 40.0 | 33.5 to 38.7 |
| share | Colby Street SB to Forest Street | % | 24.8 | 3.5 | 19.3 | 30.1 | 22.3 to 27.4 |
| ramp share | onto freeway via College Avenue | % | 23.9 | 3.2 | 18.0 | 29.6 | 21.6 to 26.1 |
| ramp share | onto freeway via Hillegass Avenue | % | 13.4 | 1.7 | 10.9 | 15.8 | 12.2 to 14.6 |
| ramp share | onto freeway via Martin Street | % | 15.0 | 2.3 | 11.3 | 18.5 | 13.4 to 16.6 |
| ramp share | onto freeway via Colby Street | % | 13.1 | 1.9 | 9.9 | 15.4 | 11.8 to 14.4 |
| ramp share | onto freeway via Telegraph Avenue north of Alcatraz Avenue | % | 10.8 | 2.2 | 8.3 | 14.8 | 9.3 to 12.4 |
| ramp share | onto freeway via Benvenue Avenue | % | 5.8 | 1.3 | 3.9 | 8.5 | 4.8 to 6.7 |
| ramp share | from freeway via College Avenue | % | 10.1 | 0.8 | 8.8 | 11.5 | 9.5 to 10.6 |
| ramp share | from freeway via Martin Street | % | 10.3 | 1.1 | 8.6 | 11.8 | 9.5 to 11.1 |
| ramp share | from freeway via Colby Street | % | 11.0 | 1.2 | 9.6 | 13.3 | 10.1 to 11.8 |
| ramp share | from freeway via Hillegass Avenue | % | 7.3 | 0.5 | 6.8 | 8.2 | 6.9 to 7.6 |
| ramp share | from freeway via Benvenue Avenue | % | 2.2 | 0.5 | 1.1 | 3.0 | 1.8 to 2.6 |
| corridor flow | Telegraph N median link flow | veh/h | 953.04 | 63.57 | 878.40 | 1066.80 | 907.57 to 998.51 |
| corridor flow | Telegraph S median link flow | veh/h | 959.64 | 40.84 | 904.80 | 1038.00 | 930.42 to 988.86 |
| corridor flow | College N median link flow | veh/h | 316.20 | 14.66 | 290.40 | 342.00 | 305.72 to 326.68 |
| corridor flow | College S median link flow | veh/h | 482.16 | 20.79 | 450.00 | 510.00 | 467.29 to 497.03 |
| corridor flow | Claremont N median link flow | veh/h | 481.20 | 37.07 | 403.20 | 549.60 | 454.68 to 507.72 |
| corridor flow | Claremont S median link flow | veh/h | 477.96 | 17.74 | 441.60 | 501.60 | 465.27 to 490.65 |
| corridor flow | Alcatraz E median link flow | veh/h | 403.92 | 24.54 | 363.60 | 438.00 | 386.37 to 421.47 |
| corridor flow | Alcatraz W median link flow | veh/h | 344.28 | 24.35 | 322.80 | 392.40 | 326.86 to 361.70 |
| corridor flow | Hillegass N median link flow | veh/h | 77.76 | 7.33 | 62.40 | 86.40 | 72.52 to 83.00 |
| corridor flow | Hillegass S median link flow | veh/h | 58.20 | 6.23 | 49.20 | 69.60 | 53.74 to 62.66 |
| corridor flow | Colby N median link flow | veh/h | 116.64 | 14.51 | 99.60 | 141.60 | 106.26 to 127.02 |
| corridor flow | Colby S median link flow | veh/h | 135.84 | 17.78 | 106.80 | 166.80 | 123.12 to 148.56 |
| corridor flow | Martin E median link flow | veh/h | 103.92 | 12.59 | 84.00 | 121.20 | 94.92 to 112.92 |
| corridor flow | Martin W median link flow | veh/h | 123.72 | 11.02 | 103.20 | 138.00 | 115.84 to 131.60 |

## Intent map: through cars by where they come from and where they are going

Through = neither trip end is in the study area. Groups are the approach groups of the area config (data/areas); a node that is not a gate takes the group of the nearest surface gate (ASSUMPTION). The arterial is the one a trip would use on the shortest free-flow path with the study area's residential and service streets closed, where that path runs on a boundary street near the study area.

Model figures are the mean of 10 seed(s), per hour of the run. Basis: OBSERVED = read from the resident volunteer count of Feb 25, 2025 or its headline shares; ASSUMPTION = inferred from those numbers or chosen.

### Colby Street NB

Observed (PM): 182 cars entered at the south end, 102 drove the whole street, 164 left it at Alcatraz Ave (131 left, 32 right, 1 straight), and 47% of the block's trips came from a freeway (the headline share). ASSUMPTION: freeway-origin cars that do not end along the street are 65 veh/h (the 82 freeway-origin trips on the block, 47% of 174, times the 182 / (182 + 47) of its cars that entered at the south end rather than joining on the way), spread over the 164 exits in proportion (0.40); the other through cars come from the Telegraph Ave and south-side approaches that feed the street's south end. Ranges: low = 131 (32) x 0.47 x 0.62 (the whole-street share of exits), high = 131 (32) x 0.47.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | OBSERVED turn count x ASSUMPTION share (131 left turns x 0.40) | 52 (38 to 62) | 39 | within |
| Telegraph Ave and south-side traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | ASSUMPTION: the through left-turners (131 x 0.62 = 81) that are not off-ramp traffic | 29 (19 to 43) | 30 | within |
| SR-24 off-ramp traffic using Colby St to reach College Ave and Berkeley (right at Alcatraz Ave) | OBSERVED turn count x ASSUMPTION share (32 right turns x 0.40) | 13 (9 to 15) | 6 | below |
| Telegraph Ave and south-side traffic using Colby St to reach College Ave and Berkeley | ASSUMPTION: the through right-turners (32 x 0.62 = 20) that are not off-ramp traffic | 7 (5 to 11) | 19 | above |
| Intents listed, together | | 101 (71 to 131) | 93 | |
| Other through cars (no intent listed) | | | 1 | |

Model through cars by origin and destination group (largest 12 of 25 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 39.2 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 15.9 | Claremont Avenue then College Avenue then Alcatraz Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 15.4 | Telegraph Avenue |
| Telegraph Ave to the south (downtown Oakland) | Telegraph Ave from the north (Berkeley) | 5.9 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Ashby Ave from the west (Emeryville and I-80) | 4.6 | Claremont Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Telegraph Ave from the north (Berkeley) | 2.6 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 2.4 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 1.9 | SR-24 |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | College Ave from the north (Berkeley) | 1.3 | SR-24 then Claremont Avenue then College Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Claremont Ave and Tunnel Rd toward the hills | 1.0 | Claremont Avenue |
| Telegraph Ave to the south (downtown Oakland) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 0.8 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) | 0.7 | Claremont Avenue |
| other pairs | | 2.8 | |

By the arterial these cars would otherwise use: Telegraph Avenue 67 veh/h; Claremont Avenue then College Avenue then Alcatraz Avenue 16 veh/h; Claremont Avenue 6 veh/h; SR-24 2 veh/h; SR-24 then Claremont Avenue then College Avenue 1 veh/h; Alcatraz Avenue then Claremont Avenue 1 veh/h.

### Hillegass Avenue NB

Observed (PM): 94 cars entered at the south end, 48 drove the whole street, 109 left it at Alcatraz Ave (43 west, 54 east, 12 straight), and 47% of the block's trips came from a freeway. ASSUMPTION: freeway-origin through cars are 40 veh/h (52 freeway-origin trips times 94 / (94 + 29)), spread over the exits in proportion (0.37); the through share of exits is 48 / 109 = 0.44.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Hillegass Ave to reach Alcatraz Ave west and Telegraph Ave north | OBSERVED turn count x ASSUMPTION share (43 left turns x 0.37) | 16 (9 to 20) | 18 | within |
| SR-24 off-ramp traffic using Hillegass Ave to reach College Ave and Berkeley | OBSERVED turn count x ASSUMPTION share (54 right turns x 0.37) | 20 (11 to 25) | 22 | within |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach Alcatraz Ave west | ASSUMPTION: through exits (43 x 0.44) that are not off-ramp traffic | 3 (0 to 10) | 5 | within |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach College Ave and Berkeley | ASSUMPTION: through exits (54 x 0.44) that are not off-ramp traffic | 4 (0 to 13) | 8 | within |
| Intents listed, together | | 43 (20 to 68) | 54 | |
| Other through cars (no intent listed) | | | 3 | |

Model through cars by origin and destination group (largest 12 of 33 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 11.9 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 11.7 | SR-24 |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | College Ave from the north (Berkeley) | 4.2 | SR-24 then Claremont Avenue then College Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 4.1 | SR-24 then Claremont Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 3.9 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 3.3 | Telegraph Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 2.1 | Claremont Avenue then Alcatraz Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Ashby Ave from the west (Emeryville and I-80) | 2.0 | SR-24 then Telegraph Avenue |
| SR-13 Warren Freeway (via SR-24 east) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 1.9 | Claremont Avenue then Alcatraz Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Claremont Ave and Tunnel Rd toward the hills | 1.6 | Claremont Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Telegraph Ave from the north (Berkeley) | 1.6 | none near the study area |
| West Oakland to the southwest (Adeline St, Market St) | Telegraph Ave from the north (Berkeley) | 1.1 | Telegraph Avenue |
| other pairs | | 7.4 | |

By the arterial these cars would otherwise use: Telegraph Avenue 23 veh/h; SR-24 13 veh/h; SR-24 then Claremont Avenue then College Avenue 4 veh/h; Claremont Avenue then Alcatraz Avenue 4 veh/h; SR-24 then Claremont Avenue 4 veh/h; SR-24 then Telegraph Avenue 3 veh/h.

### Hillegass Avenue SB

Observed (PM): 178 cars entered at the top (76 turned in from Alcatraz Ave west, 98 from the east, 4 came straight from the north), 79 drove the whole street, and 68% of the block's trips (109 veh/h) went to a freeway. ASSUMPTION: freeway-bound cars that did not join mid-street are 87 veh/h (109 x 178 / (178 + 44)), half of the 174 turn-ins; low = the whole-street share of the turn-ins (0.45), high = the freeway-bound share without the mid-street correction (0.63).

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Telegraph Ave, Alcatraz Ave west and West Berkeley traffic turning off Alcatraz Ave onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (76 turn-ins x 0.50) | 38 (34 to 48) | 12 | below |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (98 turn-ins x 0.50) | 49 (44 to 62) | 19 | below |
| Intents listed, together | | 87 (78 to 110) | 32 | |
| Other through cars (no intent listed) | | | 14 | |

Model through cars by origin and destination group (largest 12 of 32 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 12.0 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 10.9 | Claremont Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 4.3 | Claremont Avenue then SR-24 |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 4.1 | College Avenue then Claremont Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Oakland hills to the east (Broadway Terrace, Mountain Blvd, Moraga Ave) | 1.8 | Alcatraz Avenue then College Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 1.8 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 1.7 | Alcatraz Avenue then College Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Telegraph Ave to the south (downtown Oakland) | 1.6 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | West Oakland to the southwest (Adeline St, Market St) | 1.3 | Alcatraz Avenue then Telegraph Avenue |
| San Pablo Ave (Emeryville and West Oakland) | College Ave from the north (Berkeley) | 0.9 | Alcatraz Avenue then College Avenue |
| Ashby Ave from the west (Emeryville and I-80) | Berkeley hills to the northeast (Evergreen Ln, Gravatt Dr) | 0.5 | none near the study area |
| Shattuck Ave from the north (Berkeley) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 0.5 | College Avenue |
| other pairs | | 4.1 | |

By the arterial these cars would otherwise use: Telegraph Avenue 16 veh/h; Claremont Avenue then SR-24 15 veh/h; Alcatraz Avenue then College Avenue 5 veh/h; College Avenue then Claremont Avenue then SR-24 4 veh/h; Alcatraz Avenue then Claremont Avenue 2 veh/h; Alcatraz Avenue then Telegraph Avenue 1 veh/h.

### Colby Street SB

Observed (PM): 139 cars entered at the top (76 from Alcatraz Ave west, 50 from the east, 13 from the north), 39 drove the whole street, 45% of the block's trips (72 veh/h) went to a freeway and 22% came by way of Telegraph Ave. ASSUMPTION: freeway-bound cars that did not join mid-street are 46 veh/h (72 x 139 / (139 + 79)), 0.365 of the 126 turn-ins; low = the whole-street share (0.31), high = the unadjusted freeway share (0.57). The Telegraph Ave cars are the 22% x 160 = 35 of the 76 west turn-ins.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Southbound Telegraph Ave traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (35 Telegraph Ave cars x 0.365) | 13 (11 to 20) | 14 | within |
| Alcatraz Ave west, Ashby Ave and West Berkeley traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (41 other west turn-ins x 0.365) | 15 (13 to 23) | 18 | within |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (50 east turn-ins x 0.365) | 18 (15 to 29) | 8 | below |
| Intents listed, together | | 46 (39 to 72) | 40 | |
| Other through cars (no intent listed) | | | 33 | |

Model through cars by origin and destination group (largest 12 of 50 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 11.7 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Telegraph Ave to the south (downtown Oakland) | 7.3 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 6.6 | Telegraph Avenue |
| Shattuck Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 6.4 | none near the study area |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 4.6 | Telegraph Avenue |
| Ashby Ave from the west (Emeryville and I-80) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 3.5 | SR-24 |
| Ashby Ave from the west (Emeryville and I-80) | SR-13 Warren Freeway (via SR-24 east) | 2.9 | SR-24 |
| Telegraph Ave from the north (Berkeley) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 2.7 | none near the study area |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | West Oakland to the southwest (Adeline St, Market St) | 2.6 | Alcatraz Avenue then Telegraph Avenue |
| Berkeley hills to the northeast (Evergreen Ln, Gravatt Dr) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 1.9 | Claremont Avenue then Alcatraz Avenue then Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 1.9 | Telegraph Avenue |
| Alcatraz Ave from the west (Emeryville side) | SR-13 Warren Freeway (via SR-24 east) | 1.8 | SR-24 |
| other pairs | | 19.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 33 veh/h; none near the study area 11 veh/h; SR-24 10 veh/h; Claremont Avenue then Alcatraz Avenue then Telegraph Avenue 4 veh/h; Alcatraz Avenue then Claremont Avenue 3 veh/h; Alcatraz Avenue then Telegraph Avenue 3 veh/h.

### Study area, all residential and service streets

Model: 435 through cars per hour.

Model through cars by origin and destination group (largest 12 of 94 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 49.4 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 40.9 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 36.5 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 34.3 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Ashby Ave from the west (Emeryville and I-80) | 32.0 | Claremont Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 23.5 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 15.4 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 14.2 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 11.9 | SR-24 |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 11.1 | Claremont Avenue then SR-24 |
| Shattuck Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 10.2 | none near the study area |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Telegraph Ave to the south (downtown Oakland) | 9.2 | Telegraph Avenue |
| other pairs | | 146.6 | |

By the arterial these cars would otherwise use: Telegraph Avenue 250 veh/h; Claremont Avenue 47 veh/h; none near the study area 31 veh/h; SR-24 22 veh/h; Alcatraz Avenue then Claremont Avenue 13 veh/h; Claremont Avenue then SR-24 11 veh/h.

By origin group: South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 123; SR-24 eastbound off-ramps (arriving from Oakland and I-980) 81; Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 73; Telegraph Ave from the north (Berkeley) 34; Telegraph Ave to the south (downtown Oakland) 15; Claremont Ave and Tunnel Rd toward the hills 15; West Oakland to the southwest (Adeline St, Market St) 13; Emeryville and West Oakland streets (55th to 67th Streets) 12; Shattuck Ave from the north (Berkeley) 12; San Pablo Ave (Emeryville and West Oakland) 10.

By destination group: SR-24 westbound on-ramps (toward Oakland and I-980) 101; Telegraph Ave from the north (Berkeley) 97; Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 72; Ashby Ave from the west (Emeryville and I-80) 34; Claremont Ave and Tunnel Rd toward the hills 30; South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 28; Telegraph Ave to the south (downtown Oakland) 17; College Ave from the north (Berkeley) 10; SR-24 eastbound on-ramps (toward the Caldecott Tunnel) 8; Emeryville and West Oakland streets (55th to 67th Streets) 7.


Per-seed detail: `rockridge-am_peak-s1-seed1.md` (seed 1 in full).
