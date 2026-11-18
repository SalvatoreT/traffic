# Phase B tables (benchmark job sb1)

Every figure is read from `colby-north-pm.analysis.json`, `colby-north-am.analysis.json` and `second-cluster-pm.analysis.json` in this directory, which `search_bench analyze` wrote on the machine that ran the tables. They rest on source revision `f6c573d3b2f0`, simulator fingerprint `f0df1aabc323bca5893215e1df1afbff` and the frozen inputs of each case (network `6a8285d5`, demand `bef51b68`, areas `386731eb`). They are not results for the current simulator or demand. The tables are a direct reading of the `runs` and `fidelity` arrays.

Columns:

- Charged runs: simulations the search was charged, 20 minutes on seed 1 each. The number in parentheses is the part spent on the known packages' sub-packages.
- Screen gap: best screening score over all valid packages in the case minus the best screening score the search found, in score points. Score is the through-car reduction in percent minus 0.1 times the adjusted harm.
- Visited ND, Finalist ND, Oracle ND: exact nondominated packages (reduction, adjusted harm, number of changes) the search visited, the number among the forwarded finalists, and the number in the exhaustive table.
- Full-hour gap: best full-hour score (60 minutes, seeds 1 to 3) over all packages minus the best in the forwarded shortlist, in score points.
- Objective bests: how many of the four objectives had their full-hour best package inside the shortlist.
- Reduction %: reduction in through cars per hour, percent of the baseline's through cars per hour, for the shortlist's best-scoring package.
- Adj. harm: the largest all-car increase on a street block after subtracting the baseline noise band, cars per hour.
- Max raw block increase: the largest all-car increase on any block before that adjustment, cars per hour.
- Detour s: mean paired change in resident inside-trip time, seconds, completed trips only (the method of the sb1 source revision).
- Access / run rejects: packages rejected by the access check and by the run's rejection rules.
- Sim. minutes: simulated minutes charged.

The @equal rows stop the beam at B minus the allowance, so the total stays at or below the beam's charged runs B. The @extra rows run the full beam and add the allowance, and are labeled as extra budget. `wide@equal` is the beam with width 7 and 16 extension singles, capped at the charged runs of `beam + all@extra`; it ended below the cap when its search finished. The shortlist's best-scoring package is shown, not every shortlisted package.

### colby-north-pm (Development)

**cold**, screening 20 min on seed 1

| Method | Charged runs (known) | Screen gap | Visited ND | Finalist ND | Oracle ND | Full-hour gap | Objective bests | Reduction % | Adj. harm | Max raw block increase | Detour s | Access / run rejects | Sim. minutes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| beam | 75 (0) | 0.00 | 7 | 7 | 9 | 9.56 | 1/4 | 32.6 | 68.5 | 91.7 | 2.40 | 0 / 0 | 1500 |
| beam + delete@equal | 56 (0) | 0.00 | 4 | 4 | 9 | 9.56 | 0/4 | 32.6 | 68.5 | 91.7 | 2.40 | 0 / 0 | 1120 |
| beam + swap@equal | 75 (0) | 0.00 | 4 | 4 | 9 | 9.28 | 0/4 | 29.7 | 36.6 | 46.7 | -0.22 | 1 / 0 | 1500 |
| beam + coordinated@equal | 75 (0) | 0.00 | 4 | 4 | 9 | 9.56 | 0/4 | 32.6 | 68.5 | 91.7 | 2.40 | 1 / 0 | 1500 |
| beam + all@equal | 75 (0) | 0.00 | 4 | 4 | 9 | 9.28 | 0/4 | 29.7 | 36.6 | 46.7 | -0.22 | 1 / 0 | 1500 |
| wide@equal | 84 (0) | 0.00 | 7 | 7 | 9 | 9.56 | 1/4 | 32.6 | 68.5 | 91.7 | 2.40 | 0 / 0 | 1680 |
| beam + delete@extra (extra budget) | 77 (0) | 0.00 | 8 | 8 | 9 | 9.56 | 1/4 | 32.6 | 68.5 | 91.7 | 2.40 | 0 / 0 | 1540 |
| beam + swap@extra (extra budget) | 94 (0) | 0.00 | 7 | 7 | 9 | 9.56 | 1/4 | 32.6 | 68.5 | 91.7 | 2.40 | 1 / 0 | 1880 |
| beam + coordinated@extra (extra budget) | 94 (0) | 0.00 | 7 | 7 | 9 | 9.56 | 1/4 | 32.6 | 68.5 | 91.7 | 2.40 | 1 / 0 | 1880 |
| beam + all@extra (extra budget) | 94 (0) | 0.00 | 8 | 8 | 9 | 9.56 | 1/4 | 32.6 | 68.5 | 91.7 | 2.40 | 1 / 0 | 1880 |

**known**, screening 20 min on seed 1

| Method | Charged runs (known) | Screen gap | Visited ND | Finalist ND | Oracle ND | Full-hour gap | Objective bests | Reduction % | Adj. harm | Max raw block increase | Detour s | Access / run rejects | Sim. minutes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| beam | 88 (3) | 0.00 | 7 | 7 | 9 | 9.56 | 1/4 | 32.6 | 68.5 | 91.7 | 2.40 | 1 / 0 | 1760 |
| beam + delete@equal | 66 (3) | 0.00 | 4 | 4 | 9 | 9.56 | 0/4 | 32.6 | 68.5 | 91.7 | 2.40 | 1 / 0 | 1320 |
| beam + swap@equal | 88 (3) | 0.00 | 5 | 5 | 9 | 9.56 | 0/4 | 32.6 | 68.5 | 91.7 | 2.40 | 1 / 0 | 1760 |
| beam + coordinated@equal | 88 (3) | 0.00 | 5 | 5 | 9 | 9.56 | 0/4 | 32.6 | 68.5 | 91.7 | 2.40 | 1 / 0 | 1760 |
| beam + all@equal | 88 (3) | 0.00 | 4 | 4 | 9 | 9.56 | 0/4 | 32.6 | 68.5 | 91.7 | 2.40 | 1 / 0 | 1760 |
| wide@equal | 101 (3) | 0.00 | 7 | 7 | 9 | 9.56 | 1/4 | 32.6 | 68.5 | 91.7 | 2.40 | 1 / 0 | 2020 |
| beam + delete@extra (extra budget) | 90 (3) | 0.00 | 8 | 8 | 9 | 9.56 | 1/4 | 32.6 | 68.5 | 91.7 | 2.40 | 1 / 0 | 1800 |
| beam + swap@extra (extra budget) | 110 (3) | 0.00 | 8 | 8 | 9 | 9.56 | 1/4 | 32.6 | 68.5 | 91.7 | 2.40 | 1 / 0 | 2200 |
| beam + coordinated@extra (extra budget) | 110 (3) | 0.00 | 8 | 8 | 9 | 9.56 | 1/4 | 32.6 | 68.5 | 91.7 | 2.40 | 1 / 0 | 2200 |
| beam + all@extra (extra budget) | 110 (3) | 0.00 | 8 | 8 | 9 | 9.56 | 1/4 | 32.6 | 68.5 | 91.7 | 2.40 | 1 / 0 | 2200 |

Screening settings (cold beam):

| Setting | Charged | Sim. minutes | Screen gap | Full-hour gap | Objective bests | Spearman | Top-5 / top-10 overlap | Rank of screen winner | Packages |
|---|---|---|---|---|---|---|---|---|---|
| 20m-x1 | 75 | 1500 | 0.00 | 9.56 | 1/4 | 0.785 | 1 / 5 | 12 | 239 |
| 20m-x3 | 84 | 5040 | 0.61 | 3.89 | 2/4 | 0.828 | 1 / 6 | 43 | 239 |
| 30m-x1 | 77 | 2310 | 0.00 | 0.00 | 2/4 | 0.832 | 1 / 5 | 12 | 239 |
| 60m-x1 | 66 | 3960 | 2.08 | 0.00 | 2/4 | 0.893 | 3 / 5 | 5 | 239 |

### colby-north-am (Held out (period))

**cold**, screening 20 min on seed 1

| Method | Charged runs (known) | Screen gap | Visited ND | Finalist ND | Oracle ND | Full-hour gap | Objective bests | Reduction % | Adj. harm | Max raw block increase | Detour s | Access / run rejects | Sim. minutes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| beam | 78 (0) | 0.00 | 7 | 7 | 8 | 0.00 | 3/4 | 45.8 | 10.7 | 23.3 | 1.70 | 0 / 0 | 1560 |
| beam + delete@equal | 60 (0) | 0.00 | 7 | 7 | 8 | 0.00 | 2/4 | 45.8 | 10.7 | 23.3 | 1.70 | 0 / 0 | 1200 |
| beam + swap@equal | 78 (0) | 0.00 | 7 | 7 | 8 | 0.00 | 2/4 | 45.8 | 10.7 | 23.3 | 1.70 | 1 / 0 | 1560 |
| beam + coordinated@equal | 78 (0) | 0.00 | 7 | 7 | 8 | 0.00 | 2/4 | 45.8 | 10.7 | 23.3 | 1.70 | 1 / 0 | 1560 |
| beam + all@equal | 78 (0) | 0.00 | 7 | 7 | 8 | 0.00 | 2/4 | 45.8 | 10.7 | 23.3 | 1.70 | 1 / 0 | 1560 |
| wide@equal | 94 (0) | 0.00 | 7 | 7 | 8 | 0.00 | 3/4 | 45.8 | 10.7 | 23.3 | 1.70 | 0 / 0 | 1880 |
| beam + delete@extra (extra budget) | 81 (0) | 0.00 | 7 | 7 | 8 | 0.00 | 3/4 | 45.8 | 10.7 | 23.3 | 1.70 | 0 / 0 | 1620 |
| beam + swap@extra (extra budget) | 98 (0) | 0.00 | 7 | 7 | 8 | 0.00 | 3/4 | 45.8 | 10.7 | 23.3 | 1.70 | 1 / 0 | 1960 |
| beam + coordinated@extra (extra budget) | 98 (0) | 0.00 | 7 | 7 | 8 | 0.00 | 3/4 | 45.8 | 10.7 | 23.3 | 1.70 | 1 / 0 | 1960 |
| beam + all@extra (extra budget) | 98 (0) | 0.00 | 7 | 7 | 8 | 0.00 | 3/4 | 45.8 | 10.7 | 23.3 | 1.70 | 1 / 0 | 1960 |

**known**, screening 20 min on seed 1

| Method | Charged runs (known) | Screen gap | Visited ND | Finalist ND | Oracle ND | Full-hour gap | Objective bests | Reduction % | Adj. harm | Max raw block increase | Detour s | Access / run rejects | Sim. minutes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| beam | 83 (3) | 0.00 | 7 | 7 | 8 | 0.00 | 3/4 | 45.8 | 10.7 | 23.3 | 1.70 | 1 / 0 | 1660 |
| beam + delete@equal | 63 (3) | 0.00 | 6 | 6 | 8 | 2.66 | 1/4 | 45.1 | 30.3 | 41.3 | 2.74 | 1 / 0 | 1260 |
| beam + swap@equal | 83 (3) | 0.00 | 7 | 7 | 8 | 0.00 | 2/4 | 45.8 | 10.7 | 23.3 | 1.70 | 1 / 0 | 1660 |
| beam + coordinated@equal | 83 (3) | 0.00 | 7 | 7 | 8 | 0.00 | 2/4 | 45.8 | 10.7 | 23.3 | 1.70 | 1 / 0 | 1660 |
| beam + all@equal | 83 (3) | 0.00 | 7 | 7 | 8 | 0.00 | 2/4 | 45.8 | 10.7 | 23.3 | 1.70 | 1 / 0 | 1660 |
| wide@equal | 99 (3) | 0.00 | 7 | 7 | 8 | 0.00 | 3/4 | 45.8 | 10.7 | 23.3 | 1.70 | 1 / 0 | 1980 |
| beam + delete@extra (extra budget) | 86 (3) | 0.00 | 7 | 7 | 8 | 0.00 | 3/4 | 45.8 | 10.7 | 23.3 | 1.70 | 1 / 0 | 1720 |
| beam + swap@extra (extra budget) | 104 (3) | 0.00 | 7 | 7 | 8 | 0.00 | 3/4 | 45.8 | 10.7 | 23.3 | 1.70 | 1 / 0 | 2080 |
| beam + coordinated@extra (extra budget) | 104 (3) | 0.00 | 7 | 7 | 8 | 0.00 | 3/4 | 45.8 | 10.7 | 23.3 | 1.70 | 1 / 0 | 2080 |
| beam + all@extra (extra budget) | 104 (3) | 0.00 | 7 | 7 | 8 | 0.00 | 3/4 | 45.8 | 10.7 | 23.3 | 1.70 | 1 / 0 | 2080 |

Screening settings (cold beam):

| Setting | Charged | Sim. minutes | Screen gap | Full-hour gap | Objective bests | Spearman | Top-5 / top-10 overlap | Rank of screen winner | Packages |
|---|---|---|---|---|---|---|---|---|---|
| 20m-x1 | 78 | 1560 | 0.00 | 0.00 | 3/4 | 0.925 | 5 / 8 | 3 | 239 |
| 20m-x3 | 71 | 4260 | 0.00 | 2.66 | 1/4 | 0.975 | 3 / 7 | 3 | 239 |
| 30m-x1 | 92 | 2760 | 0.00 | 0.00 | 3/4 | 0.949 | 4 / 7 | 2 | 239 |
| 60m-x1 | 88 | 5280 | 0.00 | 0.00 | 3/4 | 0.951 | 3 / 8 | 1 | 239 |

### second-cluster-pm (Held out (candidate set))

**cold**, screening 20 min on seed 1

| Method | Charged runs (known) | Screen gap | Visited ND | Finalist ND | Oracle ND | Full-hour gap | Objective bests | Reduction % | Adj. harm | Max raw block increase | Detour s | Access / run rejects | Sim. minutes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| beam | 79 (0) | 0.00 | 7 | 7 | 15 | 0.00 | 2/4 | 26.9 | 45.7 | 92.0 | 13.04 | 0 / 0 | 1580 |
| beam + delete@equal | 61 (0) | 1.92 | 6 | 6 | 15 | 0.00 | 2/4 | 26.9 | 45.7 | 92.0 | 13.04 | 0 / 0 | 1220 |
| beam + swap@equal | 79 (0) | 1.92 | 6 | 4 | 15 | 0.00 | 2/4 | 26.9 | 45.7 | 92.0 | 13.04 | 0 / 0 | 1580 |
| beam + coordinated@equal | 79 (0) | 1.32 | 7 | 7 | 15 | 0.00 | 2/4 | 26.9 | 45.7 | 92.0 | 13.04 | 0 / 0 | 1580 |
| beam + all@equal | 79 (0) | 1.92 | 7 | 6 | 15 | 0.00 | 2/4 | 26.9 | 45.7 | 92.0 | 13.04 | 0 / 0 | 1580 |
| wide@equal | 89 (0) | 0.00 | 10 | 10 | 15 | 0.00 | 2/4 | 26.9 | 45.7 | 92.0 | 13.04 | 0 / 0 | 1780 |
| beam + delete@extra (extra budget) | 80 (0) | 0.00 | 8 | 8 | 15 | 0.00 | 2/4 | 26.9 | 45.7 | 92.0 | 13.04 | 0 / 0 | 1600 |
| beam + swap@extra (extra budget) | 99 (0) | 0.00 | 9 | 9 | 15 | 0.00 | 2/4 | 26.9 | 45.7 | 92.0 | 13.04 | 0 / 0 | 1980 |
| beam + coordinated@extra (extra budget) | 99 (0) | 0.00 | 8 | 8 | 15 | 0.00 | 2/4 | 26.9 | 45.7 | 92.0 | 13.04 | 0 / 0 | 1980 |
| beam + all@extra (extra budget) | 99 (0) | 0.00 | 10 | 10 | 15 | 0.00 | 2/4 | 26.9 | 45.7 | 92.0 | 13.04 | 0 / 0 | 1980 |

No known-package run: the case has no known packages in the seeds file.

Screening settings (cold beam):

| Setting | Charged | Sim. minutes | Screen gap | Full-hour gap | Objective bests | Spearman | Top-5 / top-10 overlap | Rank of screen winner | Packages |
|---|---|---|---|---|---|---|---|---|---|
| 20m-x1 | 79 | 1580 | 0.00 | 0.00 | 2/4 | 0.715 | 0 / 5 | 17 | 254 |
| 20m-x3 | 72 | 4320 | 0.00 | 0.00 | 2/4 | 0.882 | 2 / 5 | 14 | 254 |
| 30m-x1 | 80 | 2400 | 0.00 | 0.00 | 2/4 | 0.748 | 1 / 4 | 14 | 254 |
| 60m-x1 | 71 | 4260 | 0.00 | 0.11 | 0/4 | 0.816 | 2 / 5 | 2 | 254 |
