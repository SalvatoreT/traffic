## 1. Data
- [x] 1.1 `tools/build-assumptions.ts` and `tools/lib/assumptions-data.ts`: config joined to the fit report, with tests
- [x] 1.2 `baseline-intents.json` in `tools/precompute-results.ts`, `--baselines-only`, generated for the current inputs
- [x] 1.3 Clean wording at the source (builder provenance, config notes, data docs); no "owner"
## 2. UI
- [x] 2.1 Assumptions tab before Sources; Sources pointer; "About these reasons" link
- [x] 2.2 Assumed movement flows table, stacked on phones
- [x] 2.3 Reason cards with static maps (`buildBaseMap`, `buildIntentMap`, `IntentMap`)
- [x] 2.4 Five tabs fit on a phone; Worker passes 304 through
## 3. Verification
- [x] 3.1 Unit tests, typecheck
- [x] 3.2 Playwright at 1280 px, Pixel 7 and iPhone 13, light and dark; text search for "owner"
