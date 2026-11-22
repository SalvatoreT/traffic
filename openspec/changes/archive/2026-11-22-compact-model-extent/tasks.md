## 1. Extent as data

- [x] 1.1 `extent` (polygon, `bufferM`, `include`) and `preview` in the area config type; importer crops to the extent and cuts ways at the polygon edge
- [x] 1.2 Importer lists preview areas last and copies the flag; the app's default skips preview areas
- [x] 1.3 Verify the `rockridge` network, basemap and `areas.json` entry are byte-identical after the change
- [x] 1.4 Tests (`tools/extent.test.ts`): no extent unchanged, polygon cut gates on the edge, buffer, includes, compact config equals `rockridge` apart from id, name, extent, preview and calibration note

## 2. Compact area

- [x] 2.1 `data/areas/rockridge-compact.json`: same study area and settings as `rockridge`, extent polygon chosen by the rule in design.md, `preview: true`, its own calibration note and caveat
- [x] 2.2 `data/demand/rockridge-compact.config.json` and `data/calibration/rockridge-compact.targets.json` (copies with the outputs renamed)
- [x] 2.3 Census blocks outside the extent left out of the demand build
- [x] 2.4 Freeze the compact split (`--freeze-split` on the compact config); the `rockridge` split file unchanged
- [x] 2.5 Build the compact demand (shipped and training views); record peak memory and run time; verify `rockridge` shipped and training demand byte-identical

## 3. Evaluation (same rules as the current model, no tuning)

- [x] 3.1 Validation suite unaffected (no engine change; fingerprint unchanged)
- [x] 3.2 PM seeds 1-10 on both models (the current model's rerun matches its published summary)
- [x] 3.3 PM seeds 11-20, AM and midday seeds 1-10
- [x] 3.4 Assessment to its own output set (`--suffix compact`)
- [x] 3.5 Delay-feedback loop under the unchanged acceptance rule
- [x] 3.6 Three published proposals on both models (`explore --check`, PM, AM, midday, seeds 1-3)

## 4. Report

- [x] 4.1 `data/calibration/rockridge.extent-comparison.md`
- [x] 4.2 Tests pass (`cargo test -p traffic-sim`, `npm test`), native and WASM parity, merge, push
- [x] 4.3 Archive once the project lead decides (not before): decided 2026-11-22, drop (design D9)

## 5. Second round: cordon prior from the parent model (project lead, 2026-11-16)

- [x] 5.1 Record the decision in design.md (D8)
- [x] 5.2 `extent.parent`; `tools/lib/cordon.ts`, `tools/cordon-prior.ts` (parent's flows assigned on its own fit settings, routes cut at the extent); prior step and per-gate provenance report in `tools/build-demand.ts`; tests
- [x] 5.3 Build the compact demand on the prior (shipped and training views), the count fit unchanged on top, split unchanged
- [x] 5.4 Measure PM seeds 1-10 and 11-20 against the as-built compact model; west side and assumed movements examined; sensitivity without count scaling
- [x] 5.5 Stop condition met (southbound through cars far above the current model's; fitted evidence worse): prior not kept, compact back on its as-built demand byte for byte; the rest of the evaluation not run
- [x] 5.6 `rockridge` verified byte-identical again; comparison document updated
