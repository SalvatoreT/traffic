## ADDED Requirements

### Requirement: Check modes only print
`explore --check-singles` and `--check-subsets` SHALL enter check mode without `--check`. `--check-singles` SHALL score every candidate alone over the given periods, seeds and screening length, print one row each (type, label, link, through cars before and after, largest all-car rise and its block, score) and say which periods, seeds and run length it ran. Any check flag SHALL refuse `--out` and `--report` and SHALL NOT write the proposals or report files.

#### Scenario: Singles alone
- **WHEN** `explore --check-singles` runs with no `--check`
- **THEN** it prints the singles table and exits without a search and without writing a file

#### Scenario: Output paths refused
- **WHEN** a check flag is given with `--out`
- **THEN** it exits with a usage error and writes nothing
