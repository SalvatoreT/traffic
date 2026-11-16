## Context

The project lead's decisions of 2026-11-15, in their words:

- "You can simplify the proposals and don't need to give credence to the 2025 criteria."
- "Sort decreasing by cut through impact."
- "You can dedupe relatively similar proposals."
- Later the same day: list the folded packages on the kept proposal as "Variants", tweaks you can make, each one plain line with its through-car before and after and a link that opens it on the map. Keep them out of the picture, the exported image and the preview card.

## Decisions

### D1. One list, no limits profile

The proposals file holds one list, searched without limits. `data/proposals/rockridge.profiles.json` is deleted. The search binary still accepts `--profile` and `--profiles FILE`, because removing the mechanism touches candidate generation, warm starts, the seeds file's `group` field and several tests for no gain. A run without `--profile` replaces the proposals file and the report instead of joining other groups. The group keeps the id `unconstrained`, so share paths already handed out for it (`/p/unconstrained-<hash>`) keep working. Its title is "Proposals" and its note is empty; the app shows neither.

Seeds recorded from the pilot-limits group stay valid. They are known packages and compete on equal terms.

Alternative: delete the profile code. Rejected: it is unused but harmless, and experiments with limits remain possible.

The pilot-limits share paths (`/p/charter-<hash>`) stop resolving once a file without that group is published. The app already answers a missing slug with a notice on the Proposals tab.

### D2. Order

Options are ordered by through cars removed an hour (published baseline minus scenario, to one decimal), largest first. Ties go to fewer changes, then to the smaller largest all-car rise on any block in any period, then to file order. The writer sorts after confirmation, so the order follows the figures the file publishes. The reader applies the same comparison (`compareOptions` in `src/lib/proposals.ts`, `order_options` in `explore/similar.rs`), so older files come out sorted. Cards and text pages number the options in that order. `optionComparisons` now compares each option with the next one in the list.

The old Pareto rule stays: a larger package is listed only if it cuts through cars more than every smaller listed package. It no longer drives the order.

### D3. Similarity and folding

All thresholds are assumptions.

Two rechecked packages are similar when any of these holds:

1. They act at the same set of places (`places_of`) and differ only in the variant at a place: the leg a filter sits on, a filter or a diverter at one junction.
2. One differs from the other by at most one change (one added, dropped or swapped) and neither beats the other under `beats()`: the paired per-seed interval of the gain lies above zero and the gap is at least 1% of the baseline. With fewer than 10 pairs only the 1% floor applies.
3. Their through-car changes on the side-street blocks are nearly the same. The measure is `sum |a - b| / (sum |a| + sum |b|)` over the blocks, using each block's change averaged over periods and seeds. It is 0 for equal pictures, 1 for opposite ones, and about 0.1 when one picture is the other scaled by 1.22. The limit is 0.10 (`PICTURE_DISTANCE_MAX`). Correlation was considered and rejected: it ignores size, so a package that does half as much on the same blocks would count as identical.

Among similar packages one is kept. Candidates are taken in the published order. The one with the larger reduction is kept if it wins the paired comparison. Otherwise the one with fewer changes wins, then the smaller largest all-car rise, then the one an earlier search published, then the earlier finalist. A package that is similar to several kept ones replaces them only if it would win against each; otherwise it folds into the first one that wins against it. Folds are followed to the final survivor.

Folding runs after the existing filters (reduction established, stability, dominance, "does not beat a simpler finalist", the Pareto rule) and before options are picked. The best overall option and the spread options are chosen from the survivors.

"The lightest option is always listed": the rule is kept but applies to the survivors. If the lightest finalist folded into a heavier one that clearly beats it, the lightest survivor is listed instead. Dropping the rule outright was not needed, because folding happens first and the rule never reintroduces a folded package.

### D4. Variants

A folded package becomes a variant of the option it folded into, if that option is published. The option's JSON gains `variants: [{ link, differs, why, origin, cutThrough }]`. `differs` is one line per difference against the kept package: "Use X instead of Y" when the two changes act at the same place, otherwise "Drop: X" or "Add: X". `cutThrough` holds before, after and percent change in through cars an hour with the `seeds` and `role` of the runs behind it. Those are the search's own runs, not the option's confirmation runs, and the card says which seeds they are.

Variants are not proposals. They have no share path, no stored result and no picture, and the previews and the text pages' stored-result links skip them. They open on the map by scenario link and run live. The text pages list them under the option. `computed.similarity` records the rule, the limit and every fold with its reason, including folds into packages that were not published, and the report has a "Similar packages" section. The file stays version 5; `variants` and `computed.similarity` are optional, and the reader drops a variant it cannot read.

### D5. The card

A card leads with through cars an hour, before to after, then what the figure is: the study area's side streets, the periods, the mean of how many runs, and the interval. Next is the largest rise in all cars on any one block, with its through and local split. Then the changes, then the variants (up to three visible, the rest under a disclosure), then the buttons. The summary in words, the evidence note, the comparison with the next option, the through-route count, the through-car block figure, the per-period tables, the bounding streets and the inside-the-area figures go under More detail. Evidence status, provenance and the paired intervals stay on the page, and "Where traffic goes" stays beside "Open on the map".

The group headings, group notes and the explanatory paragraph about the pilot limits are gone. A file with several groups shows one status block per distinct provenance.

### D6. Default search

The explore binary defaults to `--seeds 1-3` and `--confirm-seeds 101-110`; `--no-confirm` turns confirmation off. Selection uses the three search seeds, where the paired rule has too few pairs and the 1% floor applies. The published figures come from the ten confirmation seeds. The shard tool treats a run without `--profile` as the whole list and replaces the file and the report.

### D7. Reporting method

`REPORT_METHOD` moves to `paired-t-2` in Rust and TypeScript, because the README says it is bumped when the selection rules change and they did. The figures and their pairing are unchanged. The v5 fixture carries the new value.

## Risks

Folding can hide a package that a reader would have preferred. The report lists every fold, and the kept option's card lists the folded ones, so nothing disappears silently. The 0.10 distance limit is a judgment and should be revisited with real search output.
