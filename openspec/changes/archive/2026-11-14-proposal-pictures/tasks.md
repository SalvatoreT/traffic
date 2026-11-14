## 1. Data
- [x] 1.1 Per-link through cars in `PeriodStat`; `Picture` in `Final` and in the file; `computed.minutes`
- [x] 1.2 `explore --annotate` (module `annotate`), hash check, same arrays as the search
- [x] 1.3 Rust tests for both paths and for the refusal

## 2. UI
- [x] 2.1 Parse and validate `picture`; drop a malformed one
- [x] 2.2 Picture model (blocks, bars, diverters, arrows, badges, street names, pins) and its words
- [x] 2.3 Card component and layout; light and dark; phone
- [x] 2.4 Unit tests

## 3. Verify and ship
- [x] 3.1 `npm test`, `npx tsc --noEmit -p .`
- [x] 3.2 Browser check: desktop and phone, light and dark
- [x] 3.3 Update `data/proposals/README.md`, archive the change, commit and push
