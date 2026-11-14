## Context

The owner asked: "With each of the proposals, can you also include the picture of what it looks like at the end of the simulation?" Decisions made in conversation: the picture shows the change in cut-through (through cars an hour per block, scenario minus today; blue where it drops, orange where it rises, the same diverging scale and meaning as the app's "Change in cut-through" map layer), with the proposal's interventions drawn, for the PM peak, and labeled as the PM peak.

## Decisions

D1. No image files. The proposals file carries the numbers and the card draws them. Images would have to be rendered for light and dark, for phone and desktop, and would not be searchable or readable by a screen reader.

D2. What is stored. Per package, search and reference alike, `picture: { period, links, base, scen }`: link ids with their through cars an hour today and with the package, integers, links with zero in both columns left out. The counts are the per-link cut-through counters (the ones behind the map's cut-through layer) over the same window, seeds and run length as the block figures on the card, so a block's picture value is the sum of its links' values and equals what the card counts. Size: about 140 links with traffic on the Rockridge network, so a few hundred bytes of numbers per package. `data/proposals/*.md` carries none of it.

D3. Period. The PM peak when it was searched, otherwise the first searched period. The cards' figures average all searched periods, so a picture for one period cannot match them exactly. The card says so once (periods averaged, picture is the PM peak) and, when the block it names is not the picture's biggest gain, says that too and outlines both blocks instead of hiding the mismatch.

D4. Per block, not per direction. The map layer colors each directed link. The card's figures are per block, both directions summed, so the picture sums a block's two directions and draws one line per block on the map's soft dead band (7.5 cars an hour) and top (100). The scale and colors are the map's own; its sizing assumptions keep the citation and ASSUMPTION label they have in `src/lib/ramps.ts` and `src/lib/change.ts`.

D5. Annotate without a search. `explore --annotate` reads the file at `--out`, requires every group's network and demand hashes to equal the current inputs (it stops and names the group otherwise), simulates the baseline once per period, seed and length and each package once per seed, and writes `picture` into each package. Simulations are deterministic for a seed and select-link recording does not change a run (tested), so the arrays equal the ones a search writes; a test asserts that. The run length was not recorded in earlier files, so the search now writes `computed.minutes`, and `--annotate` uses it, else `--minutes` (default 60, the length the searches used).

D6. Drawing. Inline SVG built from the same pieces as the map: `blocked.ts` for filter legs, bar placement and bar size (`barPx`), `mapexport.ts` for the badge fills and codes, `ramps.ts` for the diverging colors and line widths. Streets come from the network's own geometry (muted), with the study area outline dashed. Colors that depend on the theme use the app's resolved mode, so the picture matches the map; page chrome uses the theme tokens. No animation.

D7. Accessibility. The SVG has `role="img"` and an `aria-label` that states the area's change for the period and the biggest drop and gain by block name. The legend is text with numbers, so color is not the only signal; the block the card names is outlined and labeled with its number.

D8. Old files. A proposal without `picture`, or with arrays of different lengths or non-numbers, shows no picture and keeps the earlier card layout.

## Alternatives

Rendering PNGs at search time was rejected for D1. Storing per-block instead of per-link values was rejected because the draw needs link geometry anyway and per-link values keep the file valid if block grouping changes.
