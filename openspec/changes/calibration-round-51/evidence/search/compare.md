# Round 51 staged proposal search: options and comparison with search-c5

Baseline through cars per hour (confirmation seeds 101-110): round 51 candidate pm_peak 806.9, am_peak 414, midday 386.8; mean 535.9; published search-c5 pm_peak 709.2, am_peak 429.1, midday 386.8; mean 508.4.

## Round 51 candidate (this search)

| Option | Goal | Changes | Overall veh/h (baseline -> scenario) | Overall change veh/h, 95% CI, sd | PM change [CI] (per-seed range) | AM change [CI] (per-seed range) | Midday change [CI] (per-seed range) | Largest through rise (block, veh/h) | Resident detour s/trip |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| p1 | (none) | MF at 63rd St & Colby St; MF at 63rd St & Hillegass Ave; MF at Colby St & McAuley St; DD at 62nd St & Hillegass Ave; MF at Ayala Ave & Martin St; MF on Forest St at Ayala Ave | 535.9 -> 135.7 (-74.7%) | -400.2 [-409.0, -391.4], sd 12.26 | -583.1 [-605.6, -560.6] (-628..-528), -72.3% | -324.3 [-339.9, -308.7] (-358..-286), -78.3% | -293.2 [-308.1, -278.3] (-319..-255), -75.8% | 60th St between Claremont Ave / Hillegass Ave and Colby St: +41 | 18.2 |
| p2 | most-removed | MF at 63rd St & Colby St; MF on North St at Colby St; DD at 63rd St & Hillegass Ave; OW southbound on Colby St between Claremont Ave / Forest St and McAuley St (toward Claremont Ave and Forest St); MF at Ayala Ave & Martin St; MF on Forest St at Ayala Ave | 535.9 -> 182 (-66%) | -353.9 [-361.2, -346.6], sd 10.22 | -484.1 [-504.0, -464.2] (-555..-456), -60% | -300.2 [-314.1, -286.3] (-325..-269), -72.5% | -277.4 [-291.3, -263.5] (-308..-239), -71.7% | 60th St between Colby St and Howell St: +30.2 | 13.4 |
| p3 | (none) | MF at 63rd St & Colby St; MF at 63rd St & Hillegass Ave; DD at 62nd St & Hillegass Ave; MF at Ayala Ave & Martin St; OW westbound on Forest St between Claremont Ave / Colby St and Ayala Ave (toward Ayala Ave) | 535.9 -> 219.4 (-59.1%) | -316.5 [-327.5, -305.5], sd 15.39 | -435.8 [-465.9, -405.7] (-520..-388), -54% | -257.4 [-271.3, -243.5] (-284..-214), -62.2% | -256.2 [-266.7, -245.7] (-279..-235), -66.2% | Dana St between 63rd St and North St: +42.3 | 11 |
| p4 | least-detour | MF at 63rd St & Colby St; MF on 63rd St at Hillegass Ave; MF at 62nd St & Hillegass Ave; DD at Canning St & McAuley St; All-way stop at 60th St & Howell St; All-way stop at 58th St & Hermann St & +1 | 535.9 -> 276.5 (-48.4%) | -259.4 [-269.3, -249.5], sd 13.85 | -346.0 [-372.2, -319.8] (-385..-285), -42.9% | -214.6 [-228.6, -200.6] (-234..-170), -51.8% | -217.5 [-230.3, -204.7] (-243..-193), -56.2% | North St between Colby St and Dana St: +39.3 | 3 |
| p5 | no-closures | OW southbound on Colby St between 63rd St and North St (toward 63rd St); OW southbound on Hillegass Ave between Alcatraz Ave and 63rd St (toward 63rd St); OW westbound on Martin St between Claremont Ave and Ayala Ave (toward Ayala Ave); OW westbound on Forest St between Claremont Ave / Colby St and Ayala Ave (toward Ayala Ave); SS on Colby St (15 mph, Alcatraz Ave to Claremont Ave / Forest St); OW westbound on 62nd St between Claremont Ave / College Ave / +1 and Hillegass Ave (toward Hillegass Ave) | 535.9 -> 324.1 (-39.5%) | -211.8 [-224.1, -199.6], sd 17.09 | -295.3 [-329.8, -260.8] (-353..-207), -36.6% | -157.9 [-166.3, -149.5] (-176..-139), -38.1% | -182.3 [-193.5, -171.1] (-210..-163), -47.1% | Dana St between 63rd St and North St: +12.2 | 5.8 |
| p6 | fewest-changes | MF at 63rd St & Colby St; DD at 63rd St & Hillegass Ave | 535.9 -> 343.6 (-35.9%) | -192.3 [-203.6, -181.0], sd 15.81 | -243.2 [-274.7, -211.7] (-289..-142), -30.1% | -165.0 [-171.9, -158.0] (-177..-148), -39.9% | -168.6 [-182.1, -155.1] (-200..-134), -43.6% | North St between Colby St and Dana St: +35.4 | 3.1 |
| earlier-62nd-diverters | reference | DD at 62nd St & Hillegass Ave; DD at 62nd St & Colby St | 535.9 -> 472.7 (-11.8%) | -63.2 [-75.3, -51.1], sd 16.92 | -70.4 [-102.4, -38.4] (-140..-18), -8.7% | -64.0 [-76.9, -51.1] (-92..-39), -15.5% | -55.2 [-64.6, -45.8] (-73..-37), -14.3% | 62nd St between Claremont Ave / College Ave / +1 and Hillegass Ave: +50 | 4.6 |
| colby-hillegass-slow-streets | reference | SS on Colby St (15 mph, Alcatraz Ave to Claremont Ave / Forest St); SS on Hillegass Ave (15 mph, 60th St / Claremont Ave to Alcatraz Ave) | 535.9 -> 442.8 (-17.4%) | -93.1 [-107.0, -79.1], sd 19.49 | -120.8 [-155.9, -85.7] (-198..-17), -15% | -81.2 [-100.8, -61.6] (-127..-40), -19.6% | -77.2 [-86.3, -68.0] (-98..-56), -20% | Martin St between Claremont Ave and Ayala Ave: +11.1 | 1.8 |

Displacement rule: dropped 0 option(s).
Option comparisons (each option against the next): p1 vs p2 +46.3 [40.0, 52.6] better; p2 vs p3 +37.4 [29.3, 45.6] better; p3 vs p4 +57.1 [47.0, 67.2] better; p4 vs p5 +47.5 [41.3, 53.8] better; p5 vs p6 +19.6 [2.9, 36.2] better.

## Published search-c5

| Option | Goal | Changes | Overall veh/h (baseline -> scenario) | Overall change veh/h, 95% CI, sd | PM change [CI] (per-seed range) | AM change [CI] (per-seed range) | Midday change [CI] (per-seed range) | Largest through rise (block, veh/h) | Resident detour s/trip |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| p1 | (none) | MF at 63rd St & Hillegass Ave; MF at 63rd St & Colby St; MF at Colby St & McAuley St; DD at 62nd St & Hillegass Ave; MF at Ayala Ave & Martin St; MF on Forest St at Ayala Ave | 508.4 -> 117.3 (-76.9%) | -391.0 [-405.4, -376.7], sd 20.06 | -536.7 [-561.2, -512.2] (-594..-470), -75.7% | -343.2 [-367.2, -319.2] (-392..-293), -80% | -293.2 [-308.1, -278.3] (-319..-255), -75.8% | Dana St between 63rd St and North St: +42.5 | 16 |
| p2 | most-removed | DD at 63rd St & Hillegass Ave; MF at 63rd St & Colby St; MF at Ayala Ave & Martin St; MF at Ayala Ave & Forest St; SS on Colby St (15 mph, Alcatraz Ave to Claremont Ave / Forest St) | 508.4 -> 173.3 (-65.9%) | -335.1 [-347.8, -322.4], sd 17.71 | -438.2 [-463.1, -413.2] (-485..-382), -61.8% | -299.5 [-322.4, -276.6] (-347..-252), -69.8% | -267.6 [-280.7, -254.5] (-299..-241), -69.2% | 60th St between Colby St and Howell St: +25.4 | 10.7 |
| p3 | (none) | MF at 63rd St & Hillegass Ave; MF at 63rd St & Colby St; DD at 62nd St & Hillegass Ave; MF at Ayala Ave & Martin St; OW westbound on Forest St between Claremont Ave / Colby St and Ayala Ave (toward Ayala Ave) | 508.4 -> 195.8 (-61.5%) | -312.5 [-329.1, -295.9], sd 23.21 | -415.0 [-450.3, -379.7] (-487..-341), -58.5% | -266.4 [-287.9, -244.9] (-307..-211), -62.1% | -256.2 [-266.7, -245.7] (-279..-235), -66.2% | Dana St between 63rd St and North St: +43.7 | 12 |
| p4 | no-closures | OW southbound on Hillegass Ave between Alcatraz Ave and 63rd St (toward 63rd St); OW southbound on Colby St between 63rd St and North St (toward 63rd St); OW westbound on Martin St between Claremont Ave and Ayala Ave (toward Ayala Ave); OW westbound on Forest St between Claremont Ave / Colby St and Ayala Ave (toward Ayala Ave); SS on Colby St (15 mph, Alcatraz Ave to Claremont Ave / Forest St); OW westbound on 62nd St between Claremont Ave / College Ave / +1 and Hillegass Ave (toward Hillegass Ave) | 508.4 -> 293.6 (-42.2%) | -214.7 [-225.5, -203.9], sd 15.08 | -286.3 [-305.7, -266.9] (-328..-252), -40.4% | -175.6 [-191.8, -159.4] (-205..-138), -40.9% | -182.3 [-193.5, -171.1] (-210..-163), -47.1% | Dana St between 63rd St and North St: +12.7 | 5.1 |
| p5 | least-detour | DD at 63rd St & Hillegass Ave; MF at 63rd St & Colby St; SS on Colby St (15 mph, Alcatraz Ave to Claremont Ave / Forest St) | 508.4 -> 297 (-41.6%) | -211.4 [-223.4, -199.4], sd 16.77 | -255.8 [-272.6, -239.0] (-288..-231), -36.1% | -186.7 [-209.4, -163.9] (-245..-134), -43.5% | -191.7 [-203.2, -180.1] (-211..-165), -49.6% | Martin St between Claremont Ave and Ayala Ave: +40 | 3.4 |
| p6 | fewest-changes | MF at 63rd St & Hillegass Ave; MF at 63rd St & Colby St | 508.4 -> 347.6 (-31.6%) | -160.8 [-171.3, -150.3], sd 14.66 | -190.7 [-214.7, -166.7] (-255..-141), -26.9% | -146.0 [-164.3, -127.7] (-183..-93), -34% | -145.7 [-157.5, -133.9] (-168..-110), -37.7% | 62nd St between Claremont Ave / College Ave / +1 and Hillegass Ave: +25.8 | 2.2 |
| earlier-62nd-diverters | reference | DD at 62nd St & Hillegass Ave; DD at 62nd St & Colby St | 508.4 -> 450.8 (-11.3%) | -57.5 [-71.5, -43.6], sd 19.53 | -43.0 [-80.6, -5.4] (-135..46), -6.1% | -74.4 [-90.9, -57.9] (-109..-34), -17.3% | -55.2 [-64.6, -45.8] (-73..-37), -14.3% | 62nd St between Claremont Ave / College Ave / +1 and Hillegass Ave: +52.2 | 4.8 |
| colby-hillegass-slow-streets | reference | SS on Colby St (15 mph, Alcatraz Ave to Claremont Ave / Forest St); SS on Hillegass Ave (15 mph, 60th St / Claremont Ave to Alcatraz Ave) | 508.4 -> 424 (-16.6%) | -84.4 [-93.5, -75.3], sd 12.66 | -84.1 [-108.9, -59.3] (-146..-38), -11.9% | -91.9 [-105.2, -78.6] (-127..-68), -21.4% | -77.2 [-86.3, -68.0] (-98..-56), -20% | Martin St between Claremont Ave and Ayala Ave: +11.7 | 1 |

Displacement rule: dropped 0 option(s).
Option comparisons (each option against the next): p1 vs p2 +55.9 [49.9, 62.0] better; p2 vs p3 +22.6 [13.6, 31.5] better; p3 vs p4 +97.8 [88.0, 107.6] better; p4 vs p5 +3.3 [-4.8, 11.5] unresolved; p5 vs p6 +50.6 [44.2, 57.0] better.

## Largest all-car rise on one block, by period (displacement view)

| Set | Option | PM | AM | Midday | Through-car blocks with a resolved rise |
| --- | --- | --- | --- | --- | --- |
| round 51 | p1 | +200.7 60th St between Claremont Ave / Hillegass Ave and Colby St (16 above band) | +116.1 60th St between Claremont Ave / Hillegass Ave and Colby St (16 above band) | +78 60th St between Claremont Ave / Hillegass Ave and Colby St (17 above band) | 15 |
| round 51 | p2 | +113.9 60th St between Claremont Ave / Hillegass Ave and Colby St (13 above band) | +52.9 60th St between Claremont Ave / Hillegass Ave and Colby St (14 above band) | +58 60th St between Claremont Ave / Hillegass Ave and Colby St (11 above band) | 11 |
| round 51 | p3 | +78.2 61st St between Colby St and Canning St (19 above band) | +62.5 63rd St between Dana St and Canning St (19 above band) | +52 Dana St between 63rd St and North St (18 above band) | 18 |
| round 51 | p4 | +70.9 61st St between Colby St and Canning St (14 above band) | +53 63rd St between Dana St and Canning St (15 above band) | +47.7 North St between Colby St and Dana St (13 above band) | 26 |
| round 51 | p5 | +62 McAuley St between Colby St and Ayala Ave (8 above band) | +28.6 McAuley St between Colby St and Ayala Ave (7 above band) | +21.5 Dana St between 63rd St and North St (3 above band) | 8 |
| round 51 | p6 | +71.7 North St between Colby St and Dana St (19 above band) | +50.3 63rd St between Dana St and Canning St (14 above band) | +43.7 North St between Colby St and Dana St (11 above band) | 36 |
| round 51 | earlier-62nd-diverters | +105.8 62nd St between Claremont Ave / College Ave / +1 and Hillegass Ave (11 above band) | +105.4 62nd St between Hillegass Ave and Colby St (6 above band) | +58.7 62nd St between Hillegass Ave and Colby St (7 above band) | 32 |
| round 51 | colby-hillegass-slow-streets | +21.9 62nd St between Claremont Ave / College Ave / +1 and Hillegass Ave (0 above band) | +16.9 Martin St between Claremont Ave and Ayala Ave (0 above band) | +9.7 63rd St between College Ave and Hillegass Ave (0 above band) | 16 |
| search-c5 | p1 | +207.5 60th St between Claremont Ave / Hillegass Ave and Colby St (15 above band) | +124.9 60th St between Claremont Ave / Hillegass Ave and Colby St (18 above band) | +78 60th St between Claremont Ave / Hillegass Ave and Colby St (17 above band) | 15 |
| search-c5 | p2 | +107.1 McAuley St between Colby St and Ayala Ave (14 above band) | +77.7 McAuley St between Colby St and Ayala Ave (13 above band) | +49.8 McAuley St between Ayala Ave and Howell St (13 above band) | 15 |
| search-c5 | p3 | +79.2 61st St between Colby St and Canning St (17 above band) | +65.5 63rd St between Dana St and Canning St (20 above band) | +52 Dana St between 63rd St and North St (18 above band) | 17 |
| search-c5 | p4 | +31.8 Dana St between 63rd St and North St (6 above band) | +38.3 McAuley St between Colby St and Ayala Ave (6 above band) | +21.5 Dana St between 63rd St and North St (3 above band) | 8 |
| search-c5 | p5 | +68.4 Martin St between Claremont Ave and Ayala Ave (20 above band) | +44.2 Martin St between Claremont Ave and Ayala Ave (21 above band) | +37.2 Martin St between Claremont Ave and Ayala Ave (13 above band) | 27 |
| search-c5 | p6 | +49.3 Martin St between Claremont Ave and Ayala Ave (16 above band) | +48.3 63rd St between Dana St and Canning St (17 above band) | +25.4 Dana St between 63rd St and North St (5 above band) | 33 |
| search-c5 | earlier-62nd-diverters | +91.6 62nd St between Hillegass Ave and Colby St (10 above band) | +92.7 62nd St between Hillegass Ave and Colby St (6 above band) | +58.7 62nd St between Hillegass Ave and Colby St (7 above band) | 32 |
| search-c5 | colby-hillegass-slow-streets | +27.7 Martin St between Claremont Ave and Ayala Ave (0 above band) | +17.2 Howell St between Ayala Ave and 59th St (3 above band) | +9.7 63rd St between College Ave and Hillegass Ave (0 above band) | 22 |

## By goal

| Goal | Round 51 | search-c5 | Same changes? |
| --- | --- | --- | --- |
| most-removed | p2: -353.9 veh/h, 13.4 s/trip | p2: -335.1 veh/h, 10.7 s/trip | no |
| no-closures | p5: -211.8 veh/h, 5.8 s/trip | p4: -214.7 veh/h, 5.1 s/trip | yes |
| least-detour | p4: -259.4 veh/h, 3 s/trip | p5: -211.4 veh/h, 3.4 s/trip | no |
| fewest-changes | p6: -192.3 veh/h, 3.1 s/trip | p6: -160.8 veh/h, 2.2 s/trip | no |

## Where each option went (exact intervention sets)

| search-c5 option | Goal | In the round 51 set |
| --- | --- | --- |
| p1 | (none) | option p1 |
| p2 | most-removed | variant of p2 (same-picture); folded (same-picture) |
| p3 | (none) | option p3 |
| p4 | no-closures | option p5 |
| p5 | least-detour | not published (see the finalist table in report.md) |
| p6 | fewest-changes | variant of p6 (same-places); folded (same-places) |
| earlier-62nd-diverters | reference | option earlier-62nd-diverters |
| colby-hillegass-slow-streets | reference | option colby-hillegass-slow-streets |

| Round 51 option | Goal | Source | In the search-c5 set |
| --- | --- | --- | --- |
| p1 | (none) | seed 2026-11-18 | option p1 |
| p2 | most-removed | search | not published (see the finalist table in report.md) |
| p3 | (none) | seed 2026-11-18 | option p3 |
| p4 | least-detour | seed 2026-11-18 | not published (see the finalist table in report.md) |
| p5 | no-closures | seed 2026-11-17 | option p4 |
| p6 | fewest-changes | search | not published (see the finalist table in report.md) |
| earlier-62nd-diverters | reference | search | option earlier-62nd-diverters |
| colby-hillegass-slow-streets | reference | search | option colby-hillegass-slow-streets |

Tokens: mn modal filter, dd diagonal diverter, ow one-way, ss Slow Street, ct traffic circle, tb turn ban; geohash, then heading(s).
