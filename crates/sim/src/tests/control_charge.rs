//! Router option `single_control_charge`: the control delay of a junction is charged once, as a floor under the link's measured time.

use super::*;

/// O(0,0) - M1(200,100) - D(400,0) and O - M2(200,-100) - D, equal lengths; M1 is a signal, M2 is uncontrolled.
struct Fork {
    o: u32,
    d: u32,
    o_m1: u32,
    m1_d: u32,
    o_m2: u32,
    m2_d: u32,
}

fn fork() -> (Network, Fork) {
    let mut b = B::default();
    let o = b.node(0.0, 0.0, Control::Uncontrolled, true);
    let m1 = b.node(200.0, 100.0, Control::Signal, false);
    let m2 = b.node(200.0, -100.0, Control::Uncontrolled, false);
    let d = b.node(400.0, 0.0, Control::Uncontrolled, true);
    let (o_m1, _) = b.two_way(o, m1, RoadClass::Secondary, 1, 11.2);
    let (m1_d, _) = b.two_way(m1, d, RoadClass::Secondary, 1, 11.2);
    let (o_m2, _) = b.two_way(o, m2, RoadClass::Secondary, 1, 11.2);
    let (m2_d, _) = b.two_way(m2, d, RoadClass::Secondary, 1, 11.2);
    (b.net(), Fork { o, d, o_m1, m1_d, o_m2, m2_d })
}

fn sim(on: bool) -> (Simulation, Fork) {
    let (net, f) = fork();
    let c = Config { single_control_charge: Some(on), ..cfg(3, 0.0) };
    (Simulation::from_parts(net, demand(&[(f.o, f.d, 1.0)]), c).unwrap(), f)
}

/// Link cost and movement cost of o_m1 to m1_d, summed: what a route through the signal pays on the first link and its turn.
fn charged(sim: &Simulation, f: &Fork) -> f32 {
    let (lc, mc, _, _) = sim.test_costs(f.o_m1, f.m1_d);
    lc + mc
}

#[test]
fn control_constant_belongs_to_the_approach_of_a_controlled_node() {
    let (sim, f) = sim(true);
    let (_, _, st, ctrl) = sim.test_costs(f.o_m1, f.m1_d);
    assert_eq!(ctrl, node_delays().signal);
    assert!(st >= ctrl, "the static movement cost holds the constant");
    assert_eq!(sim.test_costs(f.o_m2, f.m2_d).3, 0.0, "an uncontrolled node charges none");
}

#[test]
fn unmeasured_link_costs_the_same_in_both_modes() {
    let (off, f) = sim(false);
    let (on, _) = sim(true);
    let ff = off.test_ff(f.o_m1);
    let (lc, mc, st, _) = off.test_costs(f.o_m1, f.m1_d);
    assert_eq!((lc, mc), (ff, st));
    let (lc, mc, st, ctrl) = on.test_costs(f.o_m1, f.m1_d);
    assert_eq!(lc, ff + ctrl, "the constant is the floor of the link");
    assert_eq!(mc, st - ctrl, "and leaves the movement");
    assert!((charged(&on, &f) - charged(&off, &f)).abs() < 1e-3);
}

#[test]
fn lightly_loaded_link_keeps_the_constant_as_a_floor() {
    let (mut off, f) = sim(false);
    let (mut on, _) = sim(true);
    let ff = off.test_ff(f.o_m1);
    let ctrl = node_delays().signal;
    for s in [&mut off, &mut on] {
        s.test_set_ema(f.o_m1 as usize, ff + 4.0);
        s.apply_mv_times();
    }
    let st = on.test_costs(f.o_m1, f.m1_d).2;
    assert_eq!(off.test_costs(f.o_m1, f.m1_d).0, ff + 4.0, "off: the measurement alone");
    assert_eq!(on.test_costs(f.o_m1, f.m1_d).0, ff + ctrl, "on: a measurement under the constant does not lower the cost");
    assert!((charged(&on, &f) - (ff + st)).abs() < 1e-3);
}

#[test]
fn congested_link_is_charged_its_measured_time_once() {
    let (mut off, f) = sim(false);
    let (mut on, _) = sim(true);
    let ff = off.test_ff(f.o_m1);
    let ctrl = node_delays().signal;
    for s in [&mut off, &mut on] {
        s.test_set_ema(f.o_m1 as usize, ff + 40.0);
        s.apply_mv_times();
    }
    let (lc_on, _, st, _) = on.test_costs(f.o_m1, f.m1_d);
    assert_eq!(lc_on, ff + 40.0, "the measurement exceeds free flow plus the constant");
    assert!((charged(&off, &f) - charged(&on, &f) - ctrl).abs() < 1e-3, "off charges the constant a second time");
    assert!((charged(&on, &f) - (ff + 40.0 + st - ctrl)).abs() < 1e-3);
}

#[test]
fn movement_excess_over_the_link_is_unchanged() {
    let (mut off, f) = sim(false);
    let (mut on, _) = sim(true);
    let ff = off.test_ff(f.o_m1);
    for s in [&mut off, &mut on] {
        s.test_set_ema(f.o_m1 as usize, ff + 30.0);
        s.test_set_mv_ema(f.o_m1, f.m1_d, ff + 50.0);
        s.apply_mv_times();
    }
    let (_, mc_off, st, ctrl) = off.test_costs(f.o_m1, f.m1_d);
    let mc_on = on.test_costs(f.o_m1, f.m1_d).1;
    assert!((mc_off - (st + 20.0)).abs() < 1e-3);
    assert!((mc_on - (st - ctrl + 20.0)).abs() < 1e-3);
}

#[test]
fn router_takes_the_route_that_measures_faster_only_when_control_is_charged_once() {
    // Both first links are measured. The signal route's measurement (38 s) already holds its signal wait; the other route measures 40 s (its left turn adds 4 s, the signal route's right turn 1 s).
    let (mut off, f) = sim(false);
    let (mut on, _) = sim(true);
    for s in [&mut off, &mut on] {
        s.test_set_ema(f.o_m1 as usize, 38.0);
        s.test_set_ema(f.o_m2 as usize, 40.0);
        s.apply_mv_times();
    }
    assert_eq!(off.test_route_for(f.o, f.d, NO_NOISE).unwrap(), vec![f.o_m2, f.m2_d], "off: 38 s plus the 10 s constant against 40 s");
    assert_eq!(on.test_route_for(f.o, f.d, NO_NOISE).unwrap(), vec![f.o_m1, f.m1_d], "on: 38 s against 40 s");
}

#[test]
fn unused_movement_drifts_toward_the_measured_link_time_not_the_floor() {
    // With the option on the link cost carries the control delay as a floor, but the movement's measured time is compared with the link's measured time.
    let (mut off, f) = sim(false);
    let (mut on, _) = sim(true);
    let ff = off.test_ff(f.o_m1);
    for s in [&mut off, &mut on] {
        s.test_set_ema(f.o_m1 as usize, ff + 5.0);
        s.test_set_mv_ema(f.o_m1, f.m1_d, ff + 5.0);
        s.test_update_costs();
    }
    let (_, mc_off, st, ctrl) = off.test_costs(f.o_m1, f.m1_d);
    let mc_on = on.test_costs(f.o_m1, f.m1_d).1;
    // The empty link's measured time and the movement's both move toward free flow, the movement by 0.7 x 5 + 0.3 x 3.5 = 4.55 s over ff against the link's 3.5 s.
    assert!((mc_on - (st - ctrl + 1.05)).abs() < 1e-2, "on: {mc_on}");
    assert!((mc_off - (st + 1.05)).abs() < 1e-2, "off: {mc_off}");
}
