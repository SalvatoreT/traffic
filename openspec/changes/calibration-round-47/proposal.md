## Why

The audit of the missed count locations found one Caltrans on-ramp row at Caldecott Lane (WB ON FR CALDECOTT LANE, 1,350 ADT in 2024) that the demand build splits 50/50 over two network ramps, nodes 1695 and 1711, as two stations of 61 veh/h each in the PM peak. A turn ban sends the flow to one of them, so the split target cannot be met: in the audit's seed-1 run the station on node 1711 carries 151 against 61 (GEH 8.7) while the one on node 1695 carries 103 (GEH 4.6). The row is one observation. The honest target is its total over both ramps, 122 veh/h in the PM peak, and the fit should be free to place that flow on either ramp.

Round 46 left this out because it needs a new station family in the fit, not a config entry (its design D9).

## What changes

- A config entry `countFit.linkGroups`: a list of groups, each naming stations that carry one source row. The build replaces the members of a group by one station whose links are the members' links and whose target is the sum of the member targets. The fit and the scoring read it as one count over the sum of the flows on those links. The code reads no street names; the group is data.
- The merge runs after the frozen split is applied. It stops the build if the members sit on different sides of the split, if only some are in the view, or if they do not share a source observation. The split file is not changed and `data:split` is not run.
- One candidate fragment, `caldecott-pair-sum`, applied to the demand config by a script on the laptop.
- `station-table.ts` reads per-station ten-seed scores off a kept assessment set, because the published assessment lists only the 12 largest misses and the keep rule needs the two members' baseline results.
- A runbook for the user's laptop session: gate on the baseline hashes, baseline ten-seed set, build the candidate, a three-seed screen, then the ten-seed assessment if it passes.
- No simulator, scoring-code or network change.

## Impact

Tools and data only. The simulator fingerprint stays d45a275dd7be0713cec6a64394b7d8a9 and the network stays 53c823f20d9165ed. With no `linkGroups` entry every output is byte-identical to the baseline (shipped demand 9cdebdabf05c4460, training demand 2f9ae152b9bbf78e). With the candidate, the stations file has one station fewer in the PM fitted count of recent stations (92 becomes 91); the other three counts keep their denominators (24, 77, 19). If the candidate is adopted, the published proposals, results and redistribution files were computed on the old demand and need a new search. If it fails, nothing published changes.
