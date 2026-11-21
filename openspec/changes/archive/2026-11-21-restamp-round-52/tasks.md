## 1. Rerun on the new simulator (laptop, 2026-11-21)

- [x] 1.1 Release build, WASM build, native and WASM runs identical
- [x] 1.2 Membership loop and `npm run data`; demands byte-identical, membership files differ only in `evidence.simulator`
- [x] 1.3 `validate`, `assess --publish --noise`
- [x] 1.4 Proposal search with round 52's flags and seeding
- [x] 1.5 Redistribution, results, assumptions, text pages, preview cards
- [x] 1.6 Compare all 69 published files; stop on the three content differences and report

## 2. Publish (cloud, 2026-11-21)

- [x] 2.1 Verify checksums, run the TypeScript tests, `data:push`, read back the live proposals file

## 3. Guard and documentation

- [x] 3.1 Demand build stops on a membership file with mismatched evidence
- [x] 3.2 Unit test for the mismatching fields and the message
- [x] 3.3 `data/README.md` section "When the simulator fingerprint changes", pointers in `data/calibration/README.md` and `docs/data-files.md`
- [x] 3.4 Record entry in `data/calibration/rockridge.record.md`
- [x] 3.5 `npx vitest run tools/ worker/ src/lib`, `npx tsc --noEmit -p .`, `openspec validate`
