## 1. Picture

- [x] 1.1 Landscape layout in `buildShareSvg`: columns, map-first column search, QR corner, band, height cap, shortened changes
- [x] 1.2 Tests: no box overlap, text column share, minimum text size, height cap, shortening, QR placement and corner search
- [x] 1.3 `DownloadImage` draws and saves on press; remove the lazy `ProposalPicture` component

## 2. Card map

- [x] 2.1 `ProposalMap`: measured blocks, interventions drawn in place, hover, focus and tap readout, table and list under it, legend, attribution
- [x] 2.2 `proposal-map.ts` readouts and tests
- [x] 2.3 Card order and styles

## 3. Redirect data

- [x] 3.1 `stored-redistribution.ts`: form, reader, freshness check, summary lines, tests
- [x] 3.2 `npm run data:redistribution` generator
- [x] 3.3 Worker serves `redistribution/<area>/<file>.json`
- [x] 3.4 Docs: AGENTS.md command list, data/README.md
- [ ] 3.5 Run the generator for the six published packages, report time and sizes

## 4. Verify

- [ ] 4.1 Screenshots, desktop and phones, light and dark, hover states and the downloaded JPEG
- [ ] 4.2 Tests, typecheck, validate, archive, merge, push
