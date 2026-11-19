## Why

The trip estimate assigns trips to routes with flat control delays per control type: 10 s at a signal, 8 s at an all-way stop, 14 s on a minor stop approach (`crates/sim/data/node-delays.json`), plus the BPR volume-delay factor. In the PM peak the simulator measures 15 to 50 s per car on the arterial signal approaches. The fit therefore believes the arterials are faster than the simulator does, and the simulator then routes two to seven times more cars through the grid than the fit's final assignment planned on the fitted stations. PM Forest St eastbound: counted 66, the fit's static final 75, simulated 201. 60th St eastbound at Telegraph Ave: 27, 25, 74. Howell St southbound: 17, 33, 84. The held-out misses that fail the rule (McAuley St eastbound between Howell and Canning 12 counted against 161 simulated, 60th St eastbound 23 against 130, Ayala Ave northbound 60 against 155) lie on the same diagonal: Telegraph Ave, McAuley or 60th St, Ayala Ave or Howell St, Forest St, Claremont Ave.

## What changes

- The static assignment may read a measured control delay per approach link and period, from a generated file with provenance (network hash, demand hash, simulator fingerprint, seeds, view). Where an approach has too few cars, or there is no file, it keeps the constant of its control type.
- A tool writes that file from the kept seed reports of baseline runs.
- The demand build refuses, and says so in the fit report, a file whose network, view, area or simulator does not match.
- Round 44 measures the delays twice on a fixed schedule and refits, for the shipped demand and for the cross-validation (training view) demand, and adopts the result only under the keep rule of design D3.

## Impact

Demand fitting (`tools/lib/assign.ts`, `tools/lib/demand-fit.ts`, `tools/build-demand.ts`, new `tools/control-delays.ts`). No simulator change, no new fit parameter. If the round is rejected, the published demand stays as it is.
