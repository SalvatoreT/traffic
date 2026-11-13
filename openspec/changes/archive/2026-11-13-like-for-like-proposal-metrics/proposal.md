## Why

A proposal card showed "−21% cut-through, 128 → 101 through vehicles an hour" next to "+37 veh/h on Colby Street, worst side effect, 14 blocks gain traffic". The two numbers look alike but count different things. The first is unique through vehicles using any side street, averaged over three periods. The second is the rise in all traffic, local trips included, on one block in the single worst period. People read the second as cut-through piling onto their street.

## What Changes

- The card shows two like-for-like figures: through cars an hour across all side streets, and through cars an hour on the one side-street block that gains the most, both averaged over the same periods. Each has a plain definition under it.
- All-traffic changes move to the card's details, in their own table, one row per period, with the through and local split of the block's gain when the data gives it.
- The details' per-period table headers put cars an hour first and the percentage second.
- Explore records per-block through-car flow from the per-link cut-through counters and publishes `harm.through` and per-period `allTraffic`. Proposals file version 4; older groups read as out of date.
- Other metric labels (Results, Streets table, map legend and export caption, proposals README and report) name what is counted, where and when.
- The search ranking is unchanged and still penalizes all-traffic increases; the Proposals intro and the README now say so.

## Capabilities

### Modified Capabilities

- `proposals`: the published side effect is measured in through cars; per-period all-traffic changes are published beside it.
- `simulator-ui`: the Proposals tab figures and details, and metric labels elsewhere.

## Impact

`crates/sim/src/explore/`, `crates/sim/src/sim.rs` (one accessor), `src/lib/proposals.ts`, `src/components/Proposals.tsx`, `src/lib/metrics.ts`, `src/lib/format.ts`, `src/lib/legend.ts`, `src/lib/change.ts` (legend label only), `src/components/StreetsTable.tsx`, `src/components/Toolbar.tsx`, `data/proposals/README.md`, tests.
