## Why

Two decisions of the project lead, 2026-11-16, change which options the search publishes.

The weighted rule for the detour goal (through-car reduction minus half a point per second of resident detour) picked a package that adds 9.5 seconds to a resident trip. The project lead's choice was "Lowest detour that still removes half".

The list is the goal winners plus the best remaining by through cars removed. On the 2026-11-17 search an untagged option that removes 269 through cars an hour and adds 208 cars an hour to one block sat beside a tagged option that removes the same number (a difference the paired seeds do not resolve) with a largest rise of 56. The project lead dropped the untagged one by hand and asked for a rule.

The proposal cards can show all cars on a street only for the one block per period whose all-car figures the file records. The search can write all-car figures for every measured block.

## What changes

- Least detour for residents: among packages that remove at least half of the best package's through-car reduction, the one with the smallest residents' detour in seconds per trip. A difference in detour the paired comparison cannot resolve goes to the larger reduction, then to fewer changes. The 50% floor stays an assumption. The weight, its sensitivity table in the report and `computed.objectives.detourWeightPointsPerSecond` are removed, and so is `--detour-weight`.
- The beam for this goal ranks a partial package by detour once its reduction passes half of the best reduction screened so far, and by reduction below that.
- The tag reads "least detour for residents" again, on the site too.
- Displacement: an option that wins no goal is not published when another published option removes at least as many through cars or cannot be told from it on the paired comparison, and its largest all-car rise on one block is smaller by more than the noise of the two rises. Goal winners are never dropped. Every drop is recorded in `computed.displacement` and in the report with its reason.
- `pictureAll {links, base, scen}` beside `picture`: all cars per link on the measured side-street blocks, same period, same seeds. The card's street panel, hover tip and "Streets that change" table show all cars beside through cars when it is present, and keep the "not in the file" wording when it is absent. `explore --annotate` writes it too.

## Impact

- Specs: `proposals`, `simulator-ui`, `agent-access`.
- Code: `crates/sim/src/explore/{objectives,search,report,annotate,mod}.rs`, `crates/sim/src/bin/explore.rs`, `src/lib/{proposals,proposal-map}.ts`, `src/components/{ProposalMap,Proposals}.tsx`, `data/proposals/README.md`.
- The simulator is not changed and its fingerprint stays the same. The reporting method (`REPORT_METHOD`) is not bumped: no figure for a given package changes, only which packages are published, and a bump would mark the file now in use as out of date before the next full search replaces it. The next full search writes the new fields; the published file keeps working without them.
