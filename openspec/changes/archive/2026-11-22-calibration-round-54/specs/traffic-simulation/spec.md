## ADDED Requirements

### Requirement: The router can charge control delay once
`Config::single_control_charge` SHALL select whether the router charges the expected control delay of a junction once. The default SHALL be `params::SINGLE_CONTROL_CHARGE`, which is false in the published model until a calibration round adopts the option.

#### Scenario: Default
- **WHEN** a run sets no value for `single_control_charge`
- **THEN** it uses `params::SINGLE_CONTROL_CHARGE`

### Requirement: With the option off the router is unchanged
With `single_control_charge` off, link and movement costs SHALL be those of the requirements "The router's control delays are measured in simulation and kept in one file" and "Route costs by turning movement", and simulator output SHALL be bit-identical to the build before the option existed.

#### Scenario: Option off
- **WHEN** `single_control_charge` is absent or false
- **THEN** the PM peak hour on the published network and demand gives the same output, byte for byte, as the build before the option existed

### Requirement: With the option on, the control delay is a floor under the link's cost
With `single_control_charge` on, the cost of a link SHALL be the larger of its free-flow time plus the control delay of the movements at its end, and its measured time. Experienced travel time is the cost of a route in the references the router cites [Wardrop1952], [Sheffi1985], [Peeta2001].

#### Scenario: Unmeasured link
- **WHEN** no vehicle has left a link that ends at a signal
- **THEN** its link cost is its free-flow time plus the signal's control delay and its movement costs are the static costs less that delay, so a route through it costs what the static prior gave

#### Scenario: Lightly loaded link
- **WHEN** the measured time of a link that ends at a signal is below its free-flow time plus the signal's control delay
- **THEN** its link cost stays at free flow plus the control delay

#### Scenario: Congested link
- **WHEN** the measured time of a link that ends at a signal exceeds its free-flow time plus the signal's control delay
- **THEN** its link cost is the measured time and a route through the link and a movement of that signal costs the control delay less than with the option off

### Requirement: With the option on, the movement cost drops the control delay
With `single_control_charge` on, the cost of a movement SHALL be its static cost less the control delay, plus the excess of the movement's measured time over the link's measured time. The control delay of a link SHALL be that of its end node's control and the approach (signal, all-way stop, minor approach at a two-way stop, traffic circle) as read from `crates/sim/data/node-delays.json`, and 0 at an uncontrolled node.

#### Scenario: Uncontrolled node
- **WHEN** a link ends at an uncontrolled node
- **THEN** its control delay is 0 and its costs are the same with the option on or off

### Requirement: Placement and free-flow routing keep the static costs
With `single_control_charge` on, initial placement of agents along their routes (`initial_times`) and the free-flow routing used for metrics SHALL keep the static costs, which hold the control delay in the movement cost.

#### Scenario: Initial placement
- **WHEN** agents are placed along their routes at the start of a run
- **THEN** the expected control delay in front of each stop line is the static movement delay, with the option on or off

## MODIFIED Requirements

### Requirement: The router's control delays are measured in simulation and kept in one file
The control delay the router adds per movement at the end of a link (signal, all-way stop, minor approach at a two-way stop, traffic circle) SHALL be read from `crates/sim/data/node-delays.json` by the simulator and by the demand fit's static assignment. `tools/node-delays.ts` SHALL write that file from simulator runs: the flow-weighted median link delay of each control type less that of links that end at no control, with the table of groups beside the previous values. With `single_control_charge` off (the published model), the simulator SHALL add the constant to every movement cost whether or not the link has been measured, so a measured link time that already holds the queue, signal and stop wait is charged the constant again. With the option on, the constant SHALL be charged once, as the floor of the link cost.

#### Scenario: One place
- **WHEN** the file changes
- **THEN** the simulator's route costs and the assignment's route costs both use the new constants

#### Scenario: Measured link with the option off
- **WHEN** a link that ends at a signal has a measured time above its free-flow time and `single_control_charge` is off
- **THEN** a route through it is charged the measured time and the signal's constant

### Requirement: Route costs by turning movement
The simulator SHALL measure the time on a link separately for each movement at its end and SHALL add to a movement's cost the difference between the time of the vehicles that made that movement and the time of the link as a whole. The cost of a link and movement together SHALL be the larger of the link's free-flow time and its measured time, plus the movement's static cost, plus that difference. The static cost holds the turn penalty, the crossing time at the turn speed and, with `single_control_charge` off (the published model), the control delay of the node; with the option on it does not hold the control delay, which is the floor of the link cost instead. Free-flow routing for metrics SHALL not use the measured times.

#### Scenario: Left-turn queue beside free through lanes
- **WHEN** left-turners on a link wait 70 s and through vehicles 15 s
- **THEN** a route that goes straight on is charged about 15 s on that link and a route that turns left about 70 s

#### Scenario: The movement's measured excess is the same with the option on
- **WHEN** the vehicles that made a movement took 20 s longer than the link as a whole
- **THEN** the movement's cost is its static cost (less the control delay with the option on) plus 20 s weighted as the link, with the option off or on
