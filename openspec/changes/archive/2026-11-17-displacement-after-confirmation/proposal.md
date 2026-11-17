## Why

The search applies the displacement rule on the recheck figures from the search seeds (1-3). The published options are then rerun on fresh seeds (101-110), and the cards show those figures. The two sets of figures disagree on which options are unnecessary.

In the 2026-11-17 file, option p3 has no goal tag. It survived the rule on search-seed figures. On the confirmation figures, p2 removes at least as many through cars (47.8% against 46.2%, not resolved on the paired comparison), and its largest all-car rise on one block is +57 (interval 51 to 63) against +112 (101 to 123) for p3. A reader sees a card that the rule, applied to the numbers on the cards, would have dropped.

The drop notes also quote search-seed figures (73.5%, +91) that differ from the card figures (72%, +81) and do not say which seeds they come from.

## What changes

- A second pass of the same rule runs on the confirmed figures, after confirmation and before anything is written. Goal winners are never dropped. It drops the worst displaced option, judges the rest again, and does not refill the list with unconfirmed finalists. A dropped option is removed from the published list and recorded in `computed.displacement.dropped` with its confirmation figures.
- Every dropped record carries `basis` (`search` or `confirmation`) and `seeds`, and its `reason` text ends with "figures from the search seeds 1-3" or "figures from the confirmation seeds 101-110".
- `explore --reapply-displacement FILE [--report FILE]` applies the same pass to a finished proposals file and its report without a search. It drops the options, renumbers the ids (`p1`..`pN`), recomputes `optionComparisons`, labels earlier drop records as search-seed figures, and edits the report to match.
- The methodology text says that the rule is judged again on the fresh figures.

## Impact

- Specs: `proposals`.
- Code: `crates/sim/src/explore/{report,confirmed,mod}.rs`, `crates/sim/src/bin/explore.rs`, `src/lib/{proposals,methodology}.ts`, `data/proposals/README.md`.
- The simulator is not changed and its fingerprint stays f0df1aabc323bca5893215e1df1afbff. `REPORT_METHOD` is not bumped: no figure for a package changes, only which packages are published, and a bump would mark the file in use as out of date.
- `computed.estimation.selection.shortlist` keeps the packages that were confirmed, so it can list a package that is no longer published; the drop record names it.
- The seeds file is not changed by the reapply command. A fresh search records only the options it still publishes.
