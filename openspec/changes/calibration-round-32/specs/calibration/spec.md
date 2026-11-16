## ADDED Requirements

### Requirement: Lane-change validation cases
The validation suite SHALL include case l1, a saturated two-lane signal approach with 20% left turns, a pocket that overflows every cycle and 500 veh/h per opposing lane, judged against the b9 range [Brilon1999], and case l2, a two-lane link 600 m long whose left lane is blocked by a standing vehicle with 1,200 veh/h offered, where the flow past the obstruction SHALL be 0.9 to 1.1 of the offered flow. Each note SHALL give the value without lane changes along a link.

#### Scenario: Effect of lane changes
- **WHEN** the suite runs l2
- **THEN** its note gives the vehicles left standing behind the obstruction with and without lane changes

### Requirement: Calibration diagnostics for capacity deficits
`calibrate` SHALL accept `--node-report <file>` and write, for one seed, every link's exits, standing vehicle-seconds and the share of 5 s samples near jam density after the warm-up, every signal's mean cycle, greens and phase links over the run, and the gridlock removals with their links. It SHALL accept `--no-lane-changes` and `--coord-max-m <m>` and record both in the run manifest. None of them changes a run.

#### Scenario: A/B of lane changes
- **WHEN** a contributor runs `calibrate --seeds 1-10 --no-lane-changes`
- **THEN** every seed runs without lane changes along a link and the manifest says so
