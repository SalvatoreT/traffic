## Decisions

### D1. Least detour: lowest detour above a floor

Project lead, 2026-11-16, choosing among the options offered: "Lowest detour that still removes half".

The candidates are the packages of the objective's pool (after the filters of the main choice) whose reduction is at least `DETOUR_REDUCTION_FLOOR` (0.5) of the best reduction in that pool. ASSUMPTION: the share, carried over from the weighted rule.

The winner is the candidate with the smallest mean detour. A candidate whose detour the paired comparison cannot tell from that one's competes with it, and the largest reduction wins, then fewer changes, then the earlier finalist. "Cannot tell" means:

- With at least ten shared seeds (`MIN_PAIRS`), the Student t interval of the per-seed difference in detour includes zero [NIST-Handbook, 1.3.6.7.2], the same test every other comparison in the report uses. The per-seed detours are kept on each final comparison (`detour_seeds`) for this.
- With fewer shared seeds, the mean detours differ by at most `DETOUR_TIE_S` (1 s per trip). ASSUMPTION: no published value; about the half width of the interval on a package's detour in the 2026-11-17 file. Only fixtures and short smoke runs reach this case, because every published figure uses ten seeds.

Rejected: keeping a weight and halving it. A weight lets a large reduction buy any detour. A floor and a detour ranking say what the project lead asked for.

### D2. The beam for the detour goal

Screening runs use one seed, so the detour in a beam is noisy. The beam ranks a screened package by detour (lowest first) when its reduction is at least half of the best valid reduction screened so far, and by the usual ranking value (reduction less the ranking-weighted harm) below that. Every package above the floor ranks ahead of every package below it, so a low-detour partial package that clears the floor survives and a small one that does not clear it cannot crowd it out. The floor moves as better packages are found, and a line continues while the next level improves this value at the new floor. ASSUMPTION: the same share as D1, applied to screening results. The finalists of this goal use the same value, and the rechecked packages decide the winner by D1.

### D3. Displacement dominance for untagged options

Project lead, 2026-11-16: an untagged option that removed 269 through cars an hour and added 208 cars an hour to one block was dropped when a tagged option removed the same number with a largest rise of 56.

Option `b` displaces untagged option `a` when both hold:

1. `b` removes at least as many through cars as `a`, or `a` does not beat `b` on the paired comparison (`beats`).
2. The largest all-car rise on one block over the periods is smaller for `b` than for `a` by more than the noise of the two rises. The rise of a package is the largest per-period increase of all cars on the period's worst block; its noise is the half width of that block's paired interval. The noise of a pair is the two half widths combined in quadrature, as for a difference of independent estimates. When either rise has no interval the noise is `NOISE_FLOOR_VEH_H` (10 cars an hour, the existing noise floor). ASSUMPTION: the floor, and treating the two rises as independent: they are measured on blocks that may differ, so no pairing exists.

Only options that are not goal winners can be dropped. The list is filled in score order. The displaced option with the largest rise is dropped first, the list is filled again from the next best, and this repeats until no listed untagged option is displaced by another listed option. A dropped option's displacer is chosen as the one with the smallest rise. Each drop records the displacing option, both removals, both rises, the noise used and where it came from (`paired intervals` or `floor`). The records are in `computed.displacement.dropped` and in the report's "Dropped for displacement" section, next to the similarity folds. Variants folded into a dropped option are not published.

### D4. All cars per link

The search already keeps all-car flow per link in each run (`RunOut.flow`). `PeriodStat` now carries its mean over seeds, and a final comparison writes `pictureAll` from the same period, seeds and run length as `picture`. Only the links of the side-street blocks the search measures (`harm_blocks`) are written, because the card measures those and nothing else. That keeps the cost near the through-car picture; the measured growth of the file is in `tasks.md`. `explore --annotate` writes it from the same runs as `picture`.

The reader shows, in the street panel and the hover tip, all cars today and with the proposal beside the through cars, with the split into through cars and local trips. The "Streets that change" table gains an all-cars column. When `pictureAll` is absent or malformed, the panel keeps today's wording that all cars are not in the file, and the through-car map is untouched.

## Not changed

The engine, so the simulator fingerprint is the same. The reporting method string is not bumped (see the proposal). The published file version stays 5; every new field is optional.
