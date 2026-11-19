## Why

On the PM peak the simulation carries two to five times the counted flow on the diagonal Telegraph Ave, McAuley St or 60th St, Ayala Ave or Howell St, Forest St, Claremont Ave, while the demand fit's own final assignment puts close to the counted flow there. The router diagnosis found that the diagonal is the simulator's own cheapest path for trips between Berkeley and Telegraph Ave and the SR-24 westbound on-ramps, and that the fit's static assignment sends the same pairs elsewhere. The fit and the simulator disagree about which trips use which station, so a fit that meets a count does not mean the simulation does.

Rounds 39 to 42 added a way to close that gap: a station takes each origin-destination pair's share of trips from seed runs of the simulator instead of from the fit's static route shares. Round 42 applied it to sixteen hand-picked blocks. Recent PM fitted stations rose from 76 to 84 of 92, and recent PM held-out stations fell from 13 to 11 of 24 on twenty seeds. A rising fitted score with a falling held-out score is what a fit that has learned the counted stations looks like, so the held-out score is the figure to watch. The shipped build no longer uses those files. They carry no evidence of matching inputs, so the build reports "Using static membership" for both views, and nothing simulated enters the published demand.

This round fits every eligible station by rule instead of a hand-picked sixteen, and iterates, because the pairs a simulator sends to a station change once the demand is refit.

## What changes

- A config entry `countFit.throughTargets.simulatedMembership`, absent by default, that makes every fitted station the report binary exports take simulated membership from a file of its view. The existing evidence check stays in force.
- `tools/membership-loop.ts`: builds both views, runs seeds with `calibrate --select-od` (one process per seed), pools the passes with equal weight into the two membership files, applies a stop rule against seed noise, and checks the fit report after every build. A dry-run mode prints the station choice and the steps without running anything.
- Leak guards for the cross-validation view, written into the driver and tested.
- Two candidate fragments (a prior of 5 trips, and 20 as an optional sensitivity) and a runbook for the laptop.
- No simulator, network or split change.

## Impact

Tools only. The simulator fingerprint stays d45a275dd7be0713cec6a64394b7d8a9 and the network stays 53c823f20d9165ed. With the entry absent the shipped demand stays 9cdebdabf05c4460 and the training demand 2f9ae152b9bbf78e. With the entry present the demand config's hash changes, so the provenance in the demand files changes too. If the candidate is adopted, the membership files (large, kept under `target/`) go to R2, and the published proposals, results and redistribution files need a new search. If it fails the keep rule, nothing published changes.
