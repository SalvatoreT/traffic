## Finding

The simulator fingerprint covers the sources that can change a run. Every published artifact records it: the membership evidence, `validation.json`, the calibration reports, the proposals file, stored results, redistribution and the Assumptions data. When commit `1e6b825` changed it, none of those matched the WASM in the deployed app. The app treats a stamp mismatch as "out of date" and simulates live instead of reading stored files.

## Rule

Set by the project lead on 2026-11-21 before the run: the same model is republished only if every number comes out identical. Anything that differs other than the stamped fingerprint, revision and dates means stop and report.

## What was rerun

On the laptop, in this order, on simulator `6b886c8f52ee07397773ddd0ebbcb447` (evidence in `evidence/`):

1. Release build, WASM build; native and WASM runs identical.
2. Membership loop, then `npm run data`.
3. `validate`, then `assess --publish --noise` on seeds 1 to 10.
4. Proposal search with round 52's flags and seeding.
5. Redistribution, results, assumptions, text pages and preview cards.

## Results

- Membership loop: the intermediate demands are byte-identical to round 52's. The two membership files differ only in `evidence.simulator` (shipped `56e688e7e5749d23`, was `3d639670c1feb38f`; training `cf32e3e0d9e6f23e`, was `c1cd4ce96fb28791`).
- `npm run data`: network `53c823f20d9165ed`, demand `2d16d8f8eb0950ca`, cross-validation demand `1c3b1666f24156f1`, all unchanged.
- `validate`: 67 of 74 cases pass.
- Assessment: identical apart from stamps; the noise file `4d6850cccc2f43e8` is byte-identical.
- Search: same options and figures. The proposals file is `c5cbe25f39e61414` (was `197a99cdafc026f8`); only `computed.date`, `computed.simulator` and `computed.sourceRevision` differ. The seeds file stays as committed (`e464cc90ca3e1472`) because the rerun's copy differed only in dates.
- Of the 69 published files, 22 are byte-identical, 44 differ only in stamps and 3 differ in content.

Wall-clock times on the faster simulator, with round 52's in parentheses: membership loop 3,777 s (3,992; mostly demand builds, which did not change), `npm run data` 1,017 s, `validate` 18 s, assessment 70 s (148), search 2,736 s (5,606), redistribution 266 s (567), results 66 s (140).

## The three content differences

- `redistribution/rockridge/unconstrained.p1.json` and `unconstrained.p3.json`: the drawn path of 9 sample routes. Counts, per-hour figures, shares and labels are identical. The tool kept the sample of whichever seed finished first, and the faster simulator changed the finishing order. Fixed afterwards in `aef1f46` (change `deterministic-redistribution-sample`), so later runs give the same paths in any order.
- `areas.json`: gains `"noise": "/data/rockridge.noise.json"`. `tools/import-osm.ts` writes it when the noise file exists at the time of `npm run data`; the published copy was built before the noise file was in place. No app code reads the field.

The laptop stopped on these three, as the rule required. The project lead accepted them (option A in `evidence/README.md`) because no figure differs.

## Left as is

`data/demand/rockridge.control-delays*.json` (round 44) still carry the old fingerprint. The config has no `controlDelays` entry, so the build never reads them. If an entry is added, the files must be measured again first.

## Decisions

### D1: A fingerprint change is handled by a full rerun with an identity check, not by editing stamps

Rewriting the fingerprint in the published files would be quick, and it would claim a result nobody had produced. The membership evidence, validation, reports, proposals and stored results each depend on the simulator's behavior, and their stamps say "computed by this build". The rerun makes that claim true. It is also the full-scale equivalence test of the simulator change, which had only been checked on PM-hour runs and fixtures: the whole membership loop, the ten-seed assessment and the proposal search came out the same.

### D2: Identity is the acceptance test

When the model has not changed, any difference other than stamps is a finding. The rule was set before the run so that a difference could not be explained away afterwards.

### D3: Accepted differences are named

The three differences above were accepted because no figure changed and the cause is known. The record names them.

### D4: The demand build stops on mismatched evidence

`sameMembershipEvidence` compares the simulator fingerprint, so after a change the build quietly used static membership and wrote one line in the fit report. With a `simulatedMembership` entry and an existing file whose evidence does not match, the build now exits non-zero and names the fields (`membershipEvidenceMismatches`, `staleMembershipMessage` in `tools/lib/through-membership.ts`). A missing file keeps the old behavior, because pass 0 of the membership loop builds without one. The loop's later passes build with files whose evidence matches by construction, so it needed no opt-out flag. To build on static membership on purpose, move the file away.
