## Why

The pilot-limits search on the final model published a best option of six changes that cut through cars by 76%. A package that an earlier round of the same search had published under the same limits, six modal filters, cuts them by 92% on the same model, with no block gaining through cars beyond noise. The search did not find it again, and the published option lists have changed a lot between rounds for modest model changes. The project lead relies on these lists, so an unstable search undermines them.

The cause is in the beam. All six filters are candidates, the package passes the access check and the pilot's limits, and the whole package screens at +93 against the best the search found, +66. But it is a package of filters that work together: its single filters screen at or below +4, and 40 of its 62 smaller subsets carry an all-traffic penalty above 80 cars an hour against 25 for the whole. The beam ranked partial packages by the full penalty, so every path to it was ranked below paths that cut less and displaced less.

## What Changes

- Each area gets a seeds file, `data/proposals/<area>.seeds.json`: scenario links of packages worth rechecking. Every search appends the options it publishes (deduplicated, capped, the oldest weakest dropped); people can add packages by hand with a note.
- Every search decodes the seeds on the current network, drops the ones the profile forbids or that no longer decode (and says so), and rechecks all the rest in full beside its own finalists, outside the screening budget. They compete for the published options on equal terms.
- Each seed and each package one intervention smaller than it is screened, and the best of them (taken in turns from each seed's family) start a beam of their own.
- The beam ranks partial packages with a harm weight that grows from zero for one intervention to the full weight at the search depth, and a line stops when adding an intervention no longer improves that ranking.
- The published list is a short ladder from the lightest option to the best, and when a new package is within the run-to-run noise on through cars of one an earlier search published, with no more harm or interventions, the earlier one is kept.
- The report and the proposals file say where each option came from (this search, a seed from an earlier run, or added by hand). `computed.knownPackages` says how many seeds were loaded, rechecked and dropped, and why.
- `explore --check LINK` scores given packages by the search's own code paths (profile, candidate list, access check, screening, full recheck); `--check-subsets` and `--check-singles` show how a beam could reach them. `--add-seed`, `--seed-proposals` and `--seed-labels` fill the seeds file.

## Impact

- Specs: proposals (known packages, seed-started beam, phased ranking, stable options, provenance).
- Code: `crates/sim/src/explore/{seeds,check,search,report,mod}.rs`, `crates/sim/src/bin/explore.rs`, `crates/sim/tests/explore.rs`.
- Data: `data/proposals/rockridge.seeds.json` (new), `data/proposals/rockridge.md`, `public/data/rockridge.proposals.json` (new fields `origin`, `computed.knownPackages`; readers that ignore unknown fields are unaffected).
- Run time: each seed adds one full recheck (nine one-hour runs here), so the seeds file is capped at 30.
