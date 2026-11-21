## ADDED Requirements

### Requirement: The demand build stops on stale simulated membership
When the demand config has a `countFit.throughTargets.simulatedMembership` entry and the membership file it names for the build's view exists, the build SHALL use the file only if its network and all of its evidence fields (view, network, split, config, count file, stations, targets, simulator fingerprint, station count version) equal the build's. Otherwise the build SHALL exit with a non-zero status and a message that names each differing field and says to rerun the membership loop or move the file away. A missing file SHALL still build on static route shares, which the loop's first pass relies on.

#### Scenario: File recorded on another simulator
- **WHEN** the file's `evidence.simulator` differs from the fingerprint of the current simulator
- **THEN** the build exits non-zero and the message names `simulator` with both values

#### Scenario: No file
- **WHEN** the file does not exist
- **THEN** the build uses static route shares and says so in the fit report

### Requirement: A fingerprint change regenerates the published set before it is pushed
After the simulator fingerprint changes, the published study-area set SHALL be regenerated on the new simulator, in the order of `data/README.md`, and compared file by file with the published set before `data:push`. When the model is unchanged, the new set SHALL be published only if every number is identical and the differences are the stamped fingerprint, revision and dates. Any other difference SHALL stop the publish until the project lead has accepted it and the record names it.

#### Scenario: Only stamps differ
- **WHEN** the regenerated files differ from the published ones only in fingerprint, revision and dates
- **THEN** the set is pushed and the record lists how many files were identical and how many differed in stamps

#### Scenario: A figure differs
- **WHEN** any count, per-hour figure, share or option differs
- **THEN** the set is not pushed and the difference is reported
