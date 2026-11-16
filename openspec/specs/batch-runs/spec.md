# batch-runs Specification

## Purpose
Split heavy simulation batches (seed runs for the assessment, proposal searches) across separate machines through the data bucket, and merge the results only when every shard ran the same simulator on the same inputs.

## Requirements

### Requirement: Shared inputs for a job
The project SHALL provide a command that uploads the input files a batch needs and that are not in git, under a job prefix, with a manifest of their SHA-256 hashes, the SHA-256 of the git-tracked inputs, the simulator fingerprint of the lead's build and its git revision. A job's inputs SHALL NOT be replaced once uploaded unless the lead asks for it.

#### Scenario: Child pulls the inputs
- **WHEN** a child session runs the pull command for a job on a fresh clone with a matching build
- **THEN** the files are written to their repository paths and every hash and the build's fingerprint match the manifest

#### Scenario: Different simulator
- **WHEN** the child's build has a different fingerprint than the manifest
- **THEN** the command fails and names both fingerprints

#### Scenario: Different input
- **WHEN** a downloaded file or a git-tracked input has a different hash than the manifest
- **THEN** the command fails and names the file

### Requirement: Sharded seed runs
The project SHALL provide a command that runs the calibrate seed runs of one slice (periods, seeds, one view: shipped or cross-validation demand) with the arguments the assessment uses, checks the reports against the job's inputs and fingerprint, and uploads them under the job prefix with an index.

#### Scenario: Slice run
- **WHEN** a child runs a slice
- **THEN** its reports are checked, uploaded and listed in the shard's index

### Requirement: Merging seed runs for the assessment
A second command SHALL download every shard into one directory that the assessment's `--reuse` option accepts, and SHALL succeed only when every period, seed and view is present exactly once and every report carries the job's fingerprint and input hashes.

#### Scenario: Complete merge
- **WHEN** the shards together hold each requested period, seed and view once
- **THEN** the shipped runs are in the directory and the cross-validation runs in the directory with the suffix `-cv`

#### Scenario: Missing or repeated run
- **WHEN** a run is absent, appears in two shards, or is outside the request
- **THEN** the command fails and lists them

#### Scenario: Mismatched shard
- **WHEN** a report was made by another simulator, other inputs or other run settings
- **THEN** the command fails with a message naming the shard, the run and what differs, and writes nothing

### Requirement: Sharded proposal search
The project SHALL provide a command that runs one `explore` search on a shard-local proposals file and uploads that file, the report and the seeds file, and a command that merges the shards' groups into the area's proposals file and the known packages into its seeds file. The proposals are one search, so the guide SHALL describe one search shard whose run searches on seeds 1 to 3 and confirms on seeds 101 to 110. A merge of runs made without `--profile` SHALL replace the proposals file and the report with the produced list. A merge of runs made with profiles SHALL replace or add the produced groups and keep the others. The merge SHALL refuse a group id produced by two shards and any difference in network hash, demand hash, simulator fingerprint or reporting-method version between the shards' groups or from the job's inputs.

#### Scenario: One search
- **WHEN** one shard ran without `--profile` on a file that holds older groups
- **THEN** the merged proposals file holds only the produced list, and the report holds only its section

#### Scenario: Two profiles
- **WHEN** two shards each ran one profile
- **THEN** the proposals file holds both groups in the profiles file's order, with version and area unchanged, and groups of other profiles already in the file are kept

#### Scenario: Same group twice
- **WHEN** two shards produced a group with the same id
- **THEN** the merge fails before it writes anything

#### Scenario: Different provenance
- **WHEN** one shard's group records another simulator fingerprint, network hash, demand hash or reporting-method version
- **THEN** the merge fails and names the shard and the field
