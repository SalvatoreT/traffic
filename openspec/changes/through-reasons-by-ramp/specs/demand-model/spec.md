## ADDED Requirements

### Requirement: The demand lists the freeway ramps and the reasons that name them
The builder SHALL derive the freeway ramps from the network in one place and write them into the demand file with an id, a kind, the surface node, the links and a plain label. The area config's `throughIntents` SHALL list the reasons in ordered sections, a reason MAY name a ramp or `other`, and the build SHALL stop on an unknown ramp or section. Flows SHALL carry an intent only for reasons that name no ramp.

#### Scenario: Chained ramp links
- **WHEN** an off-ramp is two freeway-class links joined at a node that touches no surface street
- **THEN** it is one ramp with both links

#### Scenario: Unknown ramp
- **WHEN** a reason names a ramp the network does not have
- **THEN** the build stops with a message naming the reason

### Requirement: A ramp is a chain of freeway-class links at a surface street
An on-ramp SHALL be a chain of freeway-class links entered from a surface street and an off-ramp one that ends at a surface street. Chained links SHALL be one ramp, and a chain between two surface streets SHALL NOT be a ramp.

#### Scenario: Connector between surface streets
- **WHEN** a freeway-class link runs from one surface street to another
- **THEN** no ramp is derived from it

### Requirement: Flows from a mainline gate that make an assumed movement make the ramp first
When the ramp choice is enabled, a flow from a freeway mainline gate that already carries an assumed movement SHALL be divided over the ramps its assignment uses like any other off-ramp flow, with the ramp as its first movement and its assumed movement as `via.then`.

#### Scenario: Assumed flow from a mainline gate
- **WHEN** an assumed flow from a mainline gate uses one off-ramp in its assignment
- **THEN** its `via` is the ramp movement and its `via.then` is the assumed turn
