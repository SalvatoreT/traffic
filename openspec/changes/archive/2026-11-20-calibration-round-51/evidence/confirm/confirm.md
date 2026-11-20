# Round 51 fresh-seed confirmation (seeds 11-20)

Rule (lead, 2026-11-19, before the run): on seeds 11-20 the candidate is no worse than the baseline on every keep-rule line computed on the same seeds. A confirmation on independent seeds, not a replacement for the keep rule.

- Baseline, seeds 1-10: seeds 1, 2, 3, 4, 5, 6, 7, 8, 9, 10; network 53c823f20d91, shipped demand 9cdebdabf05c (built as shipped), cross-validation demand 2f9ae152b9bb (built as training), targets 9d1d593d3d35, stations c9db41c930ac, validation split be72380b485e.
- Candidate, seeds 1-10: seeds 1, 2, 3, 4, 5, 6, 7, 8, 9, 10; network 53c823f20d91, shipped demand 5d6be8a70618 (built as shipped), cross-validation demand 7164fa2ab08f (built as training), targets 9d1d593d3d35, stations c9db41c930ac, validation split be72380b485e.
- Baseline, seeds 11-20: seeds 11, 12, 13, 14, 15, 16, 17, 18, 19, 20; network 53c823f20d91, shipped demand 9cdebdabf05c (built as shipped), cross-validation demand 2f9ae152b9bb (built as training), targets 9d1d593d3d35, stations c9db41c930ac, validation split be72380b485e.
- Candidate, seeds 11-20: seeds 11, 12, 13, 14, 15, 16, 17, 18, 19, 20; network 53c823f20d91, shipped demand 5d6be8a70618 (built as shipped), cross-validation demand 7164fa2ab08f (built as training), targets 9d1d593d3d35, stations c9db41c930ac, validation split be72380b485e.

| Line | Keep-rule line | Baseline, seeds 1-10 | Candidate, seeds 1-10 | Baseline, seeds 11-20 | Candidate, seeds 11-20 | Seeds 11-20: candidate no worse? |
| --- | --- | --- | --- | --- | --- | --- |
| PM fitted | 74 | 74 of 92 | 82 of 92 | 75 of 92 | 82 of 92 | yes |
| PM held out | 14 | 14 of 24 | 14 of 24 | 13 of 24 | 14 of 24 | yes |
| AM fitted | 70 | 70 of 77 | 74 of 77 | 71 of 77 | 74 of 77 | yes |
| AM held out | 14 | 14 of 19 | 15 of 19 | 13 of 19 | 16 of 19 | yes |
| D5 headline shares, PM (within 10 points) | 4 of 4 | 4 of 4 (MAE 4.6) | 4 of 4 (MAE 4.1) | 4 of 4 (MAE 5.2) | 4 of 4 (MAE 3.9) | yes |
| Whole-street traversals (GEH < 5) | 8 of 8 | 8 of 8 | 8 of 8 | 8 of 8 | 7 of 8 | NO |
| D16, am_peak | holds | holds | holds | holds | holds | yes |
| D16, midday | holds | holds | holds | holds | holds | yes |
| D16, pm_peak | holds | holds | holds | holds | holds | yes |

Confirmation: DOES NOT HOLD (Whole-street traversals (GEH < 5)). Candidate D16 on seeds 11-20 in every period: holds.

## Watched lines

| Line | Baseline, seeds 1-10 | Candidate, seeds 1-10 | Baseline, seeds 11-20 | Candidate, seeds 11-20 |
| --- | --- | --- | --- | --- |
| PM Colby Street SB whole street | 57 (se 4) vs 39, GEH 2.5 | 75 (se 3.4) vs 39, GEH 4.8 | 58 (se 3.5) vs 39, GEH 2.8 | 78 (se 4.4) vs 39, GEH 5 |
| pm_peak Hillegass Ave SB to freeway, share % (target) | 58.1 [55.6 to 60.5] vs 68, -9.9 points | 58.9 [54.7 to 63.2] vs 68, -9.1 points | 58.5 [55.7 to 61.3] vs 68, -9.5 points | 58.1 [55.5 to 60.6] vs 68, -9.9 points |
| am_peak Hillegass Ave SB to freeway, share % (target) | 57.5 [53.7 to 61.3] vs 57, +0.5 points | 52.4 [47.2 to 57.5] vs 57, -4.6 points | 58.7 [55.5 to 61.9] vs 57, +1.7 points | 55.1 [51.1 to 59] vs 57, -1.9 points |
| pm_peak backlog under 2% (seeds), mean, max | 10 of 10, 0.28%, 0.49% | 10 of 10, 1.11%, 1.51% | 10 of 10, 0.25%, 0.75% | 10 of 10, 0.99%, 1.47% |
| am_peak backlog under 2% (seeds), mean, max | 10 of 10, 0.11%, 0.34% | 10 of 10, 0.32%, 0.88% | 10 of 10, 0.18%, 0.37% | 10 of 10, 0.39%, 0.81% |
| midday backlog under 2% (seeds), mean, max | 10 of 10, 0.01%, 0.03% | 10 of 10, 0.01%, 0.03% | 10 of 10, 0.01%, 0.02% | 10 of 10, 0.01%, 0.02% |
| pm_peak gridlock clearances near the area per hour, mean (max) | 0 (0) | 0.3 (2) | 0 (0) | 0.1 (1) |
| am_peak gridlock clearances near the area per hour, mean (max) | 0 (0) | 0 (0) | 0 (0) | 0.1 (1) |
| midday gridlock clearances near the area per hour, mean (max) | 0 (0) | 0 (0) | 0 (0) | 0 (0) |

## Whole-street traversals

| Period | Street | Baseline, seeds 1-10 | Candidate, seeds 1-10 | Baseline, seeds 11-20 | Candidate, seeds 11-20 |
| --- | --- | --- | --- | --- | --- |
| am_peak | Hillegass Avenue NB (observed 34) | 42 (se 2.6), GEH 1.2 | 39 (se 1.2), GEH 0.9 | 41 (se 2.4), GEH 1.2 | 43 (se 2.5), GEH 1.4 |
| am_peak | Colby Street NB (observed 33) | 46 (se 2.1), GEH 2.1 | 48 (se 2.2), GEH 2.4 | 51 (se 1.8), GEH 2.7 | 50 (se 1.6), GEH 2.6 |
| am_peak | Hillegass Avenue SB (observed 36) | 36 (se 2.5), GEH 0.1 | 36 (se 2), GEH 0.1 | 33 (se 1.7), GEH 0.4 | 35 (se 1.6), GEH 0.2 |
| am_peak | Colby Street SB (observed 46) | 26 (se 1.9), GEH 3.3 | 33 (se 2), GEH 2 | 27 (se 1.7), GEH 3.1 | 30 (se 2.4), GEH 2.5 |
| pm_peak | Hillegass Avenue NB (observed 48) | 53 (se 2.7), GEH 0.8 | 54 (se 1.7), GEH 0.8 | 51 (se 2.4), GEH 0.4 | 60 (se 2.8), GEH 1.6 |
| pm_peak | Colby Street NB (observed 102) | 73 (se 3.7), GEH 3.1 | 83 (se 3.3), GEH 1.9 | 81 (se 2.8), GEH 2.2 | 83 (se 2.7), GEH 2 |
| pm_peak | Hillegass Avenue SB (observed 79) | 91 (se 4.4), GEH 1.3 | 82 (se 3.7), GEH 0.4 | 79 (se 2.8), GEH 0 | 83 (se 2.1), GEH 0.4 |
| pm_peak | Colby Street SB (observed 39) | 57 (se 4), GEH 2.5 | 75 (se 3.4), GEH 4.8 | 58 (se 3.5), GEH 2.8 | 78 (se 4.4), GEH 5 |
