## ADDED Requirements

### Requirement: A node filter closes every leg
A modal filter at an intersection SHALL close every car movement through the node, so cars cannot pass between any two of its legs. At a junction that the model merged from several nearby crossings, the filter SHALL cover the whole merged junction.

#### Scenario: Merged junction
- **WHEN** a node filter is placed where a street crosses another at two offset points a few meters apart that the model merged into one node
- **THEN** cars cannot pass along either street through the merged node
