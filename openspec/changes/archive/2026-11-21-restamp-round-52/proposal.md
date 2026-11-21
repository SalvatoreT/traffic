## Why

Commit `1e6b825` (archived change `accelerate-simulator-step`) changed the simulator fingerprint from `d45a275dd7be0713cec6a64394b7d8a9` to `6b886c8f52ee07397773ddd0ebbcb447`. Its own equivalence evidence covered PM-hour runs (native seeds 1 to 5, WASM seeds 1 to 3) and fixtures. The deployed app ran the new WASM while everything published on 2026-11-20 carried the old fingerprint. The site marked proposals out of date, showed the Assumptions cards without maps or counts, and ignored stored results and redistribution, so it simulated live. A local `npm run data` would have dropped to static membership without a word: `sameMembershipEvidence` compares the simulator fingerprint, and the only trace was one line in the fit report.

## What changes

- The round 52 set is regenerated on the new simulator, compared with the published set, and published only because every figure came out the same (design D1 to D3).
- A demand build that finds a simulated-membership file whose evidence does not match now stops and names the fields (design D4). A missing file still builds on static membership.
- `data/README.md` gets the ordered rerun procedure for a fingerprint change; the record gets an entry.

## Impact

Published files: 22 of 69 byte-identical, 44 differ only in stamps, 3 differ in content without changing a figure (design, "The three content differences"). Code: `tools/build-demand.ts`, `tools/lib/through-membership.ts`. Spec: `demand-model`. No simulator, demand, config or proposal change.
