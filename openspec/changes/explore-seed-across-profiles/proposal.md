## Why

In the last full run the unconstrained search topped out at -49% through cars while the pilot (`charter`) profile reached -90%, and one unconstrained option with more interventions scored worse than one with fewer. A search with fewer limits has every package of the limited one available, so it should never do worse.

## What Changes

- A profile that does not keep off the boundary also keeps the top locations that are not on it, so busy boundary locations cannot crowd the interior ones out of the candidate cap (40 locations).
- The search can start from packages another group of the proposals file already holds, when the file was computed on the same network and demand: those the current profile allows are screened first, extended in a beam of their own and always rechecked. Their interventions join the candidate list when the cap left them out.
- `--profile` takes a comma list or `all`; later profiles in one invocation start from the earlier ones.
- Chosen options are Pareto-consistent: a larger package is listed only if it cuts through cars by more than every smaller package listed.
- The search stops a line of descent on its own, so a strong large package no longer stops the small ones from being extended.

## Impact

- `crates/sim/src/explore/{cands,search,report,profile,decode,mod,link}.rs`, `crates/sim/src/bin/explore.rs`, `crates/sim/tests/explore.rs`
- The proposals file format is unchanged. Rerunning `explore` regenerates the groups.
