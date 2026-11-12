## ADDED Requirements

### Requirement: Roundabout rings collapse to one node
The importer SHALL represent a roundabout or traffic circle mapped as a ring of ways as a single `traffic_circle` node.

#### Scenario: Ring in the extract
- **WHEN** OSM maps a traffic circle as a closed ring with four arms
- **THEN** the network has one traffic-circle node with four approaches

### Requirement: Gate direction flags
The importer SHALL record for each gate whether trips can enter and whether they can leave through it.

#### Scenario: One-way exit
- **WHEN** a gate lies on a one-way street leaving the model
- **THEN** it is flagged as exit-only

### Requirement: Junction joining
The importer SHALL join graph nodes that form one real intersection into a single node at their centroid when they lie within `junctionJoinRadius` (default 20 m), or within `signalJoinRadius` (default 40 m) for a cluster of two or more signals, are connected by short non-freeway links, and share a street name or are both signals.

#### Scenario: Offset signalized crossing
- **WHEN** two signal-tagged nodes 10 m apart on one street carry the north and south legs of one crossing
- **THEN** the network has one signal node with four approaches and no link between the former nodes

#### Scenario: Offset signals on a wide junction
- **WHEN** two signal nodes 33 m apart are joined by two-way links and carry the two halves of one junction
- **THEN** the network has one signal node

#### Scenario: Signals at the extract edge
- **WHEN** a signal pair lies within the former 60 m edge margin but neither node is a gate
- **THEN** it is joined like any other pair

#### Scenario: One-way chain of signals
- **WHEN** two signals are joined only by a one-way link
- **THEN** they stay separate nodes

#### Scenario: Distinct intersections on a longer block
- **WHEN** two intersections are more than the join radius apart
- **THEN** they stay separate nodes

#### Scenario: Control and approaches of a joined node
- **WHEN** a cluster is joined
- **THEN** the node is a signal if any member is a signal and an all-way stop only if every remaining approach has a stop, the internal links are dropped, and the remaining approaches keep their stop flags, humps and gates

#### Scenario: No new movements
- **WHEN** the members of a cluster are not strongly connected by their internal links, or the cluster contains a freeway link, a gate or a traffic circle
- **THEN** those members are not joined

### Requirement: Turn restrictions
The importer SHALL turn OSM `restriction` relations with one `via` node into banned motor-vehicle movements in the network (`turnBans`: link into the junction, link out of it), and the simulator SHALL not route cars through them. A time-conditional restriction SHALL apply only in the demand periods whose hours it overlaps, as given by `periodWindows` in the area config.

#### Scenario: No left turn
- **WHEN** an OSM relation bans the left turn from one way onto another at a junction
- **THEN** the network has a ban from the link of the first way into the junction to the link of the second way out of it

#### Scenario: Peak-hour ban
- **WHEN** a relation carries `restriction:conditional=no_left_turn @ (Mo-Fr 16:00-18:00)`
- **THEN** the ban applies in the `pm_peak` period and not in `am_peak` or `midday`

#### Scenario: Only a straight movement
- **WHEN** a relation says `only_straight_on`
- **THEN** every other movement from that link at the junction is banned except the U-turn

#### Scenario: Unsupported relation
- **WHEN** a relation has a `via` way, several `via` members or exempts motor cars
- **THEN** it is skipped and counted

### Requirement: Marked left-turn lanes
The importer SHALL record, for the end of each link, the number of lanes that OSM `turn:lanes` marks as left-turn only, and the simulator SHALL build the left-turn pocket from one of those lanes instead of adding a lane.

#### Scenario: Tagged left lane
- **WHEN** a signalized approach has `lanes=3` and `turn:lanes=left|through|through;right`
- **THEN** the link has three lanes in total, one of them the left pocket

### Requirement: Study area from boundary streets
The importer SHALL derive the study-area polygon from an ordered list of boundary streets, following each street's way geometry between the crossings with its neighbors in the list, and SHALL treat links lying on a boundary street as inside the study area, except motorway-class links.

#### Scenario: Freeway edge
- **WHEN** a boundary street is a dual-carriageway freeway
- **THEN** the polygon edge follows the carriageway nearest the area and no vertex lies beyond it

### Requirement: Gates sit mid-block
The importer SHALL warn about every gate that lies within `gateSignalWarnM` (default 60 m) of a signalized junction, so that the model-area edges can be chosen where corridors leave the model mid-block, and the Rockridge model area SHALL have at most 3% of its gates on that list.

#### Scenario: Gate next to a signal
- **WHEN** a gate lies 22 m from a signalized junction
- **THEN** the importer prints the gate, its street and the distance, and the network statistics list it

#### Scenario: Edge through a junction
- **WHEN** the model-area edge would cut a signalized junction or leave a gate inside one
- **THEN** the area configuration moves the edge, and the area README gives the candidate edges that were compared


### Requirement: Freeway-edge stubs are one gate
Mainline gates of one freeway direction that lie within `freewayGateMergeM` (default 80 m) of each other, with similar bearings and only freeway-class links, SHALL be merged into one gate at their centroid, and parallel stub links between the same two nodes SHALL become one link with the lanes added. The importer SHALL list each merge.

#### Scenario: A carriageway cut into two stubs
- **WHEN** one freeway carriageway forks just inside the model edge and both branches leave through the edge 26 m apart
- **THEN** the network has one exit gate with both branches ending in it, and an on-ramp onto either branch reaches it

### Requirement: Every ramp reaches the mainline
The importer SHALL check that every on-ramp reaches a mainline exit gate and every off-ramp is reachable from a mainline entry gate over freeway-class links, and SHALL warn and list each ramp that fails. A freeway-class link between two surface nodes is a connector and not a ramp.

#### Scenario: Rockridge
- **WHEN** the Rockridge network is imported
- **THEN** the list of violating ramps is empty
