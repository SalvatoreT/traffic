## Why

The picture on each Proposals card was a tall portrait of 800 by 2,500 pixels: the area name, title, every change, the figures, then the map far down. The project lead first asked for it to be wider, with some of the text beside the image. On 2026-11-16 they went further: the picture should not be on the page at all. It should come from the Download image button. The page should show a live map instead, where moving over a street gives its name and how its through cars change, and moving over a modal filter shows where the cars that used it go.

## What Changes

- The picture becomes a landscape image (1,200 by about 870 layout pixels, saved at 1.5 times) made only when Download image is pressed. Name, title, changes and figures sit in a left column of about 40% of the width, the map in the right column with the QR code in a corner that has no streets, and the legend, status, attribution and site in a band underneath. The height is capped; past the cap the change lines are shortened to their first clause, then cut to "and N more". The JPEG keeps its 450 KB cap and filename.
- Each card shows an interactive inline-SVG map for the picture's period instead of an image: measured side streets colored on the Change in cut-through scale, everything else faint context, the proposal's changes drawn in place. Hover, keyboard focus and tap on a street give its name, the block and the through cars today and with the proposal. Hover, focus and tap on a change give where the cars that used it go.
- A table "Streets that change" and a list "Where filtered traffic goes" sit beside the map so every hover fact is reachable without a mouse; the map highlights the focused row.
- New stored form, `public/data/redistribution/<area>/<group>.<proposal>.json`, written by `npm run data:redistribution` from traced runs of today's traffic and the package on the proposal's confirmation seeds. The card reads it when it is current and otherwise says the redirect data is not available and offers the existing Where traffic goes view.
- Card order: title, through-car figures, map, largest all-car rise, changes, variants, buttons (Open on the map, Copy link, Where traffic goes, Download image), More detail.
- The worker serves `/data/redistribution/<area>/<file>.json`.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `simulator-ui`: the card's picture requirement becomes a live map and a download-only picture.
- `proposals`: the stored redirect data.

## Impact

`src/lib/shareimage.ts`, `src/lib/picture.ts`, `src/lib/proposal-map.ts`, `src/lib/stored-redistribution.ts`, `src/lib/redistribution.ts` (route samples), `src/components/{ProposalMap,DownloadImage,Proposals}.tsx` (the lazy-drawn `ProposalPicture` component is removed), `src/styles.css`, `tools/precompute-redistribution.ts`, `worker/paths.ts`, `package.json`, `AGENTS.md`, `data/README.md`. Link-preview cards (`tools/lib/previews.ts`, `og-card.ts`) do not use the share image and are unchanged.

## Out of scope

All-car figures for every block. The proposals file records all cars only for the block with the largest rise per period. Showing them for every block needs the search to write a second per-link array (`pictureAll`: `links`, `base`, `scen` for all cars, same seeds and period as `picture`). Until then the hover says through cars and says that all cars are not in the file.
