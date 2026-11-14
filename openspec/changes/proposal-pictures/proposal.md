## Why

A proposal card says how many through cars a package removes and which block gains the most, but not where. The owner asked: "With each of the proposals, can you also include the picture of what it looks like at the end of the simulation?" A picture of the change on every street shows at a glance where traffic leaves and where it lands, and lets a resident check the block the card names.

## What Changes

- Each proposal in the proposals file carries the through cars an hour on every link that has any, for the PM peak, today and with the package, averaged over the search's seeds.
- `explore --annotate` adds those arrays to an existing proposals file by re-simulating only the published packages for that one period. The normal search writes them too.
- Each card draws the arrays as an inline SVG: change in through cars an hour on each block, on the app's blue-to-orange cut-through change scale, with the package's filters, diverters, one-way arrows and badges drawn on the streets.
- The picture is labeled as the PM peak, says once per card that the figures above it average the searched periods, and says so plainly when the block the card names is not the biggest gain in the PM peak.
- A card whose proposal has no picture data shows no picture.

## Impact

- Specs: `proposals` (file carries per-link through cars; annotate mode), `simulator-ui` (Proposals tab picture).
- Code: `crates/sim/src/explore/{annotate,report,search,mod}.rs`, `crates/sim/src/bin/explore.rs`, `src/lib/{picture,proposals,mapexport}.ts`, `src/components/{ProposalPicture,Proposals}.tsx`, `src/styles.css`.
- Data: `public/data/<area>.proposals.json` grows by a few kilobytes per package. It is served from R2; `data/proposals/*.md` carries no arrays.
