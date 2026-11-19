## Why

A diagnosis of the excess through traffic on the Telegraph Ave, McAuley St / 60th St, Ayala Ave / Howell St, Forest St, Claremont Ave diagonal tied it to the SR-24 westbound on-ramp at Claremont Ave and Hudson St. In the PM peak the cross-validation run puts about 898 veh/h on that ramp against 598 counted (2010 environmental-review study). The first idea for this round was to fit that ramp. It is already fitted: in the shipped demand the counted hour of 598 is a station with the ramp weight, and the turning movements that feed the ramp are stations too. The 898 comes from the training view. There the frozen split withholds the counted leg, so the ramp falls back to its Caltrans ADT times an assumed peak-hour factor K of 0.09, which is 9,800 x 0.09 = 882 veh/h.

K = 0.09 is an assumption with no local source. The ramps that have both a counted PM hour and a Caltrans ADT show a lower ratio: 0.057 to 0.088 (Clifton St off-ramp 0.057, Claremont Ave on-ramp 0.061, 52nd St off and on 0.072 and 0.077, MLK Jr Way off 0.088). Every ADT x K ramp target, and the freeway gate volumes the demand starts from, uses the assumed value.

## What changes

- A config rule `countFit.rampK` (method `counted-ramps`, `fallback`, `minRamps`) that estimates K as the sum of counted peak hours over the sum of ADTs of the counted ramps, in each view only from the counted ramp legs that view may see. A view with fewer than `minRamps` usable ramps keeps the assumed K and says so in the fit report. The rule is off by default, so the shipped build does not change until a candidate is adopted.
- Two candidate fragments, `ramp-k-counted` (`minRamps` 3) and `ramp-k-counted-min2` (`minRamps` 2), applied to the demand config by a script on the laptop. They differ only in the training view, which sees two counted ramps.
- The fit report records the estimate, the ramps used with their count and ADT years, and the ramps skipped.
- A runbook for the user's laptop session: gate on the baseline hashes, build each candidate, a three-seed screen, and the ten-seed assessment for the candidates that pass the screen.
- No simulator or network change.

## Impact

Tools and data only. The simulator fingerprint stays d45a275dd7be0713cec6a64394b7d8a9 and the network stays 53c823f20d9165ed. A candidate changes the ADT x K target of every ramp that has no counted hour, the freeway gate volumes, and therefore the fitted demand in both views. Station sets and the frozen split are unchanged, but some scored stations get a different target, and the keep rule judges them separately. If a candidate is adopted, the published proposals, results and redistribution files were computed on the old demand and need a new search. If every candidate fails, nothing published changes.
