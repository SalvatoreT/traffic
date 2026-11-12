## ADDED Requirements

### Requirement: Transient highlight from lists
The UI SHALL light a street block or intersection on the map while the pointer is over, or keyboard focus is on, its row in the search results or the Streets table, and SHALL stop when the pointer or focus leaves. The highlight SHALL NOT change the selection or move the map, and SHALL use a distinct line style and width as well as color.

#### Scenario: Hovering a result
- **WHEN** a user moves the pointer over a search result
- **THEN** that block or intersection is outlined on the map and the selection is unchanged
- **AND WHEN** the pointer leaves
- **THEN** the outline is removed

#### Scenario: Focusing a table row
- **WHEN** keyboard focus moves to a row in the Streets table
- **THEN** that block is outlined on the map until focus moves away

### Requirement: Persistent search results
The search result list SHALL stay visible after the input loses focus while the query is not empty and there are results. It SHALL close when the query is cleared, Escape is pressed or a result is chosen, and SHALL reopen when the query changes.

#### Scenario: Moving the pointer to a result
- **WHEN** a user types a query and then clicks elsewhere or moves to the list
- **THEN** the results remain listed and can be hovered or chosen
