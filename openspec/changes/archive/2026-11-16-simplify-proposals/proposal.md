## Why

The Proposals tab shows two lists, one under the 2025 neighborhood pilot's limits and one without them, with a heading and a note for each. The project lead decided on 2026-11-15 that those limits are not a criterion, that the options should be sorted by how much through traffic they remove, and that near-duplicates should not both be published. The cards also grew heavy as evidence fields were added.

## What Changes

- Drop the pilot-limits profile as a published group. The proposals are one list, searched without limits. The profile mechanism stays in the search code for experiments, and nothing published depends on it.
- Order the published options by through cars removed an hour, largest first. Ties go to fewer changes, then the smaller largest all-car rise. The writer applies the order and the reader enforces it, so older files are shown sorted too.
- Fold near-duplicate packages into one option. The folded packages become variants of the kept option, listed on its card as plain lines with their through-car figures and a link that opens them on the map.
- Simplify the card: through cars an hour before and after first, then the largest rise in all cars on any one block, then the changes and the variants. Everything else moves under More detail.
- The default `explore` run is one search on seeds 1 to 3 followed by confirmation on seeds 101 to 110. The sharded-run guide describes one search shard.
- The reader still reads versions 2 to 5. A file with several groups shows all its options as one sorted list, with a package listed by two groups shown once.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `proposals`: one list, similarity rule, variants, ordering, default run.
- `simulator-ui`: the Proposals tab and the card.
- `batch-runs`: the sharded search is one shard.

## Impact

`crates/sim/src/explore/{report,similar,profile}.rs`, `crates/sim/src/bin/explore.rs`, `src/lib/proposals.ts`, `src/components/Proposals.tsx`, `tools/lib/llms-docs.ts`, `tools/lib/shard-explore.ts`, `data/proposals/README.md`, `docs/sharded-runs.md`. The reporting-method version moves from `paired-t-1` to `paired-t-2` because the selection rules changed, so files written before this change read as out of date until they are computed again.

## Out of scope

No search is run here, and no generated data is rebuilt or published. Variants are not drawn in the card's picture, the exported JPEG or the preview cards, and they get no share path or stored result. The pilot-limits report section in `data/proposals/rockridge.md` goes away when the report is next generated.
