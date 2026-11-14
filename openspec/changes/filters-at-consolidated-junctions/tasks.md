## 1. Simulator
- [x] 1.1 `legs` on the modal filter intervention; leg-level closure in `Eff::derive`; invalid legs skipped
- [x] 1.2 Tests: no legs, one street closed, other street open, invalid legs, via fallback, removal restores baseline
## 2. Scenario links
- [x] 2.1 `mn` closed-leg bearings in `hash.ts` and `explore/link.rs`; old links unchanged
- [x] 2.2 Tests: round trip, re-indexed network, old-link fixture, shared TS/Rust fixture
## 3. App
- [x] 3.1 `streetFilters`, `filterChoices`, closed-leg text and description in `blocked.ts`, `describe.ts`
- [x] 3.2 Intersection menu choices, marks and export show only closed legs; through-route check honors legs
- [ ] 3.3 Browser check at 1280 px and phone width
## 4. Proposal search
- [x] 4.1 Per-street candidates, naming, reference `street`; tests incl. pilot profile
## 5. Measure
- [ ] 5.1 Owner scenario, whole junction against per-street variants
## 6. Check
- [ ] 6.1 `npm test`, `tsc`
