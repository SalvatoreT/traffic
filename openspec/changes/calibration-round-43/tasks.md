## 1. Stop control

- [x] 1.1 `stopExemptions` in the area config type and the importer, reported when not applied; synthetic tests
- [x] 1.2 Hillegass Ave / 61st St as an all-way stop (tag override) and the eastbound 62nd St approach at Canning St exempted, each with its source
- [x] 1.3 Regenerate the network; check that only the two nodes' control and their approaches' `stopAtEnd` changed (test on the real extract)

## 2. Demand

- [x] 2.1 `npm run data` on the new network with the frozen split; record the demand and cross-validation demand hashes

## 3. Evaluation and record

- [x] 3.1 `npm run wasm`, `npm test`, validation suite (67 of 74, fingerprint d45a275dd7be0713cec6a64394b7d8a9)
- [x] 3.2 `npm run assess -- --publish --noise`, seeds 1 to 10
- [x] 3.3 Before and after table; round 43 in the record
- [ ] 3.4 Area note and caveat with the new figures and `public/data/areas.json`, only if the assessment is no worse (design D6). Not done: the assessment is worse (design D10), so the note and caveat stay as they were
