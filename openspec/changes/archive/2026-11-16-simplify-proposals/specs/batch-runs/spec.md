## MODIFIED Requirements

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
