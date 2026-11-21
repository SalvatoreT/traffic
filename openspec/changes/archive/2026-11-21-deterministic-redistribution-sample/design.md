## Finding

The generator keeps one path per street label per seed result (`displacement` returns one sample per label), and the accumulator kept the first one to arrive. Two `--jobs 8` runs on one binary agreed, but `--jobs 1` drew a different path for 6 of 24 routes.

## Decision

Per-seed results hold one sample per label, so trips cannot be counted per path. The tool merges in seed order instead: for each label the stored path is the one from the lowest seed that produced it. Results are collected per seed and merged once after the pool finishes (`tools/lib/redistribution-samples.ts`). Sums of counts are integer additions and stay order independent.

The stored path remains a representative sample, not the most common path. Choosing the most used path would need the displacement accounting to return every path with its trip count, which is a larger change.

## Published data

The published files under `public/data/redistribution/` keep their current samples until the next `data:redistribution` run. Figures are unaffected either way.
