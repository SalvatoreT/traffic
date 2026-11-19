# Turn-ban packages on seeds 101 to 110

The search-c5 seeds file held two hand-added turn-ban packages. The search rechecked the 4-ban package on discovery seeds 1 to 3 only. It dropped the 8-ban package before screening because 8 interventions is more than its depth of 6. This run measures both on the confirmation seeds, 101 to 110, in all three periods at 60 minutes. It uses the search's own recheck code (`explore --check`) on network 53c823f20d9165ed, demand 9cdebdabf05c4460 and simulator d45a275dd7be0713cec6a64394b7d8a9. The run started 2026-11-18 7:17:11 PM PST and took 364 s on 12 jobs. The command is in `tb-check-command.txt` and the full output in `tb-check.txt`.

Option p6 of search-c5 (filters at 63rd St & Hillegass Ave and 63rd St & Colby St) ran as a control. Its figures here match its published confirmation exactly: 508.4 to 347.6 through cars an hour, interval -171 to -150, detour +2.2 s, and the same worst blocks.

Through cars an hour are the mean of the three periods and ten seeds. The change interval is the 95% paired interval over the ten seeds. The detour is the added resident elapsed time per request through the 60-minute cutoff. The all-car rise is the largest one-block increase in all traffic, in its worst period. The check prints rounded seed means without an interval, so these rises can be off by 1 car an hour (the control's published figure is +49.3).

| Package | Through cars an hour | Change (95% interval) | Detour | Largest through-car rise on one block | Largest all-car rise on one block |
| --- | --- | --- | --- | --- | --- |
| 4 bans onto Hillegass Ave | 508.4 to 479.4 | -29.0 (-41 to -17), -5.7% | +1.8 s | +53 (+49 to +57), Colby St between North St and Alcatraz Ave | +133, PM, Colby St between McAuley St and 60th St (287 to 420) |
| 8 bans onto Hillegass Ave and Colby St | 508.4 to 444.5 | -63.9 (-73 to -55), -12.6% | +2.7 s | +42 (+38 to +46), Dana St between North St and Alcatraz Ave | +100, PM, 60th St between Claremont Ave / Hillegass Ave and Colby St (40 to 140) |
| Control: search-c5 p6 | 508.4 to 347.6 | -160.8 (-171 to -150), -31.6% | +2.2 s | +26 (+23 to +29), 62nd St between Claremont Ave / College Ave and Hillegass Ave | +49, PM, Martin St between Claremont Ave and Ayala Ave (248 to 298) |

By period, through cars an hour:

| Package | PM peak | AM peak | Midday |
| --- | --- | --- | --- |
| 4 bans | 709 to 668 | 429 to 402 | 387 to 368 |
| 8 bans | 709 to 633 | 429 to 370 | 387 to 330 |

The 4-ban package's largest all-car rise is on Colby St between McAuley St and 60th St in every period: 287 to 420 (PM), 234 to 292 (AM), 194 to 262 (midday). The 8-ban package's is on 60th St between Claremont Ave / Hillegass Ave and Colby St in the PM (40 to 140) and AM (23 to 66) peaks, and on Dana St between North St and Alcatraz Ave at midday (18 to 58).

Search scores, with the same harm weight of 0.1: 4 bans -3.9 (ranking penalty 96 on Colby St between McAuley St and 60th St), 8 bans +3.9 (penalty 87 on 60th St between Claremont Ave / Hillegass Ave and Colby St), control +28.1. Neither package was rejected for unroutable trips.
