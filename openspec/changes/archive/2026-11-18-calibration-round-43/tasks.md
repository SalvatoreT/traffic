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
- [x] 3.4 Area note and caveat: closed by design D13. The assessment is worse (D10), so the note keeps the published figures; the caveat gets one sentence on the discrepancy and `public/data/areas.json` is regenerated

## 4. Refit decision (2026-11-18)

- [x] 4.1 Record the project lead's decision and the keep rule in design.md (D11) before any run
- [x] 4.2 Membership iteration on the corrected network: not run, by design D12 and the decision of D13
- [x] 4.3 Move rounds thirty to thirty-three of the record to `rockridge.record-archive-3.md`

## 5. Revert (design D13)

- [x] 5.1 Remove the two data entries from both area configs; keep the mechanism and its tests
- [x] 5.2 Restore the assessment, reports, fit reports and validation record to the published ones
- [x] 5.3 `npm run data` reproduces the published network, demand and cross-validation demand
- [x] 5.4 Caveat sentence, `public/data/areas.json`, record
