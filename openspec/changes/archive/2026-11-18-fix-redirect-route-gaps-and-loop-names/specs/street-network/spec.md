## ADDED Requirements

### Requirement: Block names at a node where no other street meets
A block's name SHALL call an end "a dead end" only when the street ends there. When no other street meets an end and the same street goes on, the end SHALL be named by the cross streets reached by following that street, without passing the block's own ends. The app and the proposal search SHALL name blocks identically.

#### Scenario: A loop around a park
- **WHEN** a street has two parallel arcs between two junctions where no other street meets, and cross streets at the far side of each
- **THEN** no block of the street is named with "a dead end", and each is named by the cross streets beyond the loop

#### Scenario: A real dead end
- **WHEN** a street ends at a node with no other link
- **THEN** that end is named "a dead end"
