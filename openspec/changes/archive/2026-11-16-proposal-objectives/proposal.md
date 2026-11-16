## Why

The published list ranks packages by through cars removed, so a light measure rarely appears beside a strong filter. The project lead's answer to how lighter measures should get a fair showing: "You can have different proposals that optimize for different things." On how strongly closures should count against cut-through removed: "Light."

## What changes

- The list stays one list, sorted by through cars removed, largest first. The search now picks options for four named objectives, and each option says which objectives it is the best for:
  - most cut-through removed (today's rule);
  - no street closures (Slow Streets, one-ways, all-way stops, traffic circles, speed humps, turn bans; no filters or diverters);
  - least detour for residents (a light weight on the added trip time of trips that start or end inside the study area);
  - fewest changes (at most two, so a simple first step is always on the list).
- Each objective grows its own beam over the shared screening cache and the same candidate list. Finalists are pooled, rechecked, folded with the existing similarity rules and confirmed on the unused seeds as before. A package that wins several objectives is listed once with all its tags. The list holds up to six options: each objective's winner and the best remaining by through cars removed.
- Every option reports residents' detour: seconds per resident trip with its interval, and vehicle-minutes an hour, beside through cars before and after and the largest all-car rise.
- The proposals file stays version 5 and gains optional fields (`objectives` and `residentsDetour` on an option, `computed.objectives` on a group). The app reads older files as options with no tags and no detour line.
- Cards show a tag row under the title ("Best for: ..."). The text pages and preview text carry it. The Methodology page's "How proposals are made" says options are chosen for different goals and tagged.
- `explore` gains `--objectives` and `--detour-weight`; `--options` defaults to 6.

## Impact

- Specs: `proposals`, `simulator-ui`, `agent-access`.
- Code: `crates/sim/src/explore/{objectives.rs (new), search.rs, report.rs, mod.rs}`, `src/lib/proposals.ts`, `methodology.ts`, `src/components/Proposals.tsx`, `tools/lib/{llms-docs,previews}.ts`, `data/proposals/README.md`.
- The simulator is not changed: the existing metrics already time the trips with an end inside the study area (`inside_trip_stats`). The simulator fingerprint does not change, and nothing stored or published goes out of date by this change. The next full search writes the new fields.
