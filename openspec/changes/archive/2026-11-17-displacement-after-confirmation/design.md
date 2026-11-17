## Context

`select_by_objectives` applies `displaces` to the finalists' search-seed rechecks. Confirmation then reruns the chosen options on seeds 101-110, and the published figures, the order of the options and the paired comparisons between neighbors all come from that rerun. The rule never sees them.

## Decisions

**D1. One function on the figures the rule reads.** `Figures` holds through cars removed, the largest all-car rise with the half width of its interval, and the per-seed through-car runs. `displaces_figures` and `beats_figures` are the rule and the paired test, unchanged; `displaces` and `beats` call them for a finalist. `displace_listed` is the pass: it drops the worst displaced option (the largest rise among the options some listed option displaces, taken against the displacing option with the smallest rise), judges the rest again, and stops when nothing is displaced. The search-time loop picks the worst the same way.

**D2. Goal winners are protected, the list is not refilled.** The tags are fixed by search-seed figures and the confirmation only measures them. Refilling from finalists that were not confirmed would publish options on figures the cards cannot show. The published list can therefore end up shorter than `--options`.

**D3. The pass runs on the shown list.** It runs after the published order is set from the confirmation figures. Ids come from position, so the options that stay are numbered `p1`..`pN` by the existing code, and `optionComparisons` is built from the options that stay. When no confirmation seeds are used, the published figures are the search figures and the search-time rule has already run on them, so the pass is skipped.

**D4. Records say where their figures come from.** `Displaced` carries `basis` and `seeds`. The phrase ends with "figures from the search seeds 1-3" or "figures from the confirmation seeds 101-110", so the report, the notes and the JSON all say it.

**D5. Reapplying to a finished file reads the figures back from it.** The stored values are rounded to a tenth of a car an hour. The command reads the largest rise and its interval from each option's `byPeriod`, and the per-seed through cars from `evidence`, which are the inputs the pass needs. Rounding can move a comparison by a rounding step; the neighbor comparisons that do not change reproduce the stored ones. Only groups whose estimates are confirmation figures are judged. The command renumbers the ids, rebuilds `optionComparisons` for the options that stay, appends the new records, labels earlier records without a `basis` as search-seed figures with the group's discovery seeds, marks `intoPublished` false for folds into a dropped option, and leaves everything else as it was, including the shortlist. A second run changes nothing.

**D6. The report is edited by its structure.** The command removes the dropped option's entry from "Chosen options" and from the all-traffic table, renumbers the rest, rewrites the comparison lines, updates the "chosen as option N" notes in the finalists table (the dropped option's note says why it is not published), and replaces the "Dropped for displacement" section. It edits each profile's section separately.
