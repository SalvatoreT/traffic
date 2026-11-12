//! Route commitment: indifference band, no backtracking, blocked routes, wandering metrics.

use super::*;
use crate::sim::TripRecord;

/// O(0,0) - M1(200,100) - D(400,0) and O - M2(200,-100) - D, equal lengths, plus a short direct link A: O - A(100,0) - D.
struct Diamond {
    o: u32,
    d: u32,
    o_m1: u32,
    m1_d: u32,
    o_m2: u32,
    m2_d: u32,
}

fn diamond() -> (Network, Diamond) {
    let mut b = B::default();
    let o = b.node(0.0, 0.0, Control::Uncontrolled, true);
    let m1 = b.node(200.0, 100.0, Control::Uncontrolled, false);
    let m2 = b.node(200.0, -100.0, Control::Uncontrolled, false);
    let d = b.node(400.0, 0.0, Control::Uncontrolled, true);
    let (o_m1, _) = b.two_way(o, m1, RoadClass::Secondary, 1, 11.2);
    let (m1_d, _) = b.two_way(m1, d, RoadClass::Secondary, 1, 11.2);
    let (o_m2, _) = b.two_way(o, m2, RoadClass::Secondary, 1, 11.2);
    let (m2_d, _) = b.two_way(m2, d, RoadClass::Secondary, 1, 11.2);
    (b.net(), Diamond { o, d, o_m1, m1_d, o_m2, m2_d })
}

fn setup() -> (Simulation, Diamond) {
    let (net, dm) = diamond();
    let sim = Simulation::from_parts(net, demand(&[(dm.o, dm.d, 1.0)]), cfg(3, 0.0)).unwrap();
    (sim, dm)
}

#[test]
fn near_equal_routes_do_not_flip() {
    let (mut sim, dm) = setup();
    let id = sim.test_place(dm.o_m1, 0, 50.0, 5.0, dm.d, true);
    sim.test_set_guided(id, true);
    sim.test_set_trail(id, &[dm.o_m1]);
    let before = sim.test_route_of(id);
    assert_eq!(before.last().copied(), Some(dm.m1_d));
    // The other route becomes 10 s cheaper: under the 30 s floor and the band.
    sim.test_set_ema(dm.m1_d as usize, 30.0);
    sim.test_advance_clock(300.0);
    for _ in 0..5 {
        sim.test_consider(id);
        sim.test_advance_clock(200.0);
    }
    assert_eq!(sim.test_route_of(id), before, "a small gain does not move the driver");
    assert_eq!(sim.test_switches(id), 0);
}

#[test]
fn no_backtracking_unless_blocked() {
    // S - F, F - M1, F - M2, M1 - M2, M1 - D, M2 - D. The driver is on F-M1 and has already been at M2 (as if it had turned around there).
    let mut b = B::default();
    let s = b.node(-200.0, 0.0, Control::Uncontrolled, true);
    let f = b.node(0.0, 0.0, Control::Uncontrolled, false);
    let m1 = b.node(200.0, 100.0, Control::Uncontrolled, false);
    let m2 = b.node(200.0, -100.0, Control::Uncontrolled, false);
    let d = b.node(400.0, 0.0, Control::Uncontrolled, true);
    let (s_f, _) = b.two_way(s, f, RoadClass::Secondary, 1, 11.2);
    let (f_m1, _) = b.two_way(f, m1, RoadClass::Secondary, 1, 11.2);
    let (f_m2, _) = b.two_way(f, m2, RoadClass::Secondary, 1, 11.2);
    let (m1_m2, _) = b.two_way(m1, m2, RoadClass::Secondary, 1, 11.2);
    let (m1_d, _) = b.two_way(m1, d, RoadClass::Secondary, 1, 11.2);
    let (m2_d, _) = b.two_way(m2, d, RoadClass::Secondary, 1, 11.2);
    let mut sim = Simulation::from_parts(b.net(), demand(&[(s, d, 1.0)]), cfg(5, 0.0)).unwrap();
    let id = sim.test_place(f_m1, 0, 50.0, 5.0, d, true);
    sim.test_set_guided(id, true);
    sim.test_set_trail(id, &[s_f, f_m2, f_m1]);
    let before = sim.test_route_of(id);
    assert_eq!(before, vec![m1_d]);
    sim.test_set_ema(m1_d as usize, 600.0);
    sim.test_advance_clock(300.0);
    sim.test_consider(id);
    assert_eq!(sim.test_route_of(id), before, "the better route returns to a node already visited, so it is not eligible");
    assert_eq!(sim.test_switches(id), 0);
    sim.set_interventions(&iv(&format!("[{{\"type\":\"modal_filter\",\"link\":{m1_d}}}]"))).unwrap();
    assert_eq!(sim.test_route_of(id), vec![m1_m2, m2_d], "a blocked route may backtrack");
}

#[test]
fn better_route_beyond_band_switches_once_then_holds() {
    // Fork after a shared approach: S - F, F - M1 - D, F - M2 - D.
    let mut b = B::default();
    let s = b.node(-200.0, 0.0, Control::Uncontrolled, true);
    let f = b.node(0.0, 0.0, Control::Uncontrolled, false);
    let m1 = b.node(200.0, 100.0, Control::Uncontrolled, false);
    let m2 = b.node(200.0, -100.0, Control::Uncontrolled, false);
    let d = b.node(400.0, 0.0, Control::Uncontrolled, true);
    let (s_f, _) = b.two_way(s, f, RoadClass::Secondary, 1, 11.2);
    let (f_m1, _) = b.two_way(f, m1, RoadClass::Secondary, 1, 11.2);
    let (m1_d, _) = b.two_way(m1, d, RoadClass::Secondary, 1, 11.2);
    let (f_m2, _) = b.two_way(f, m2, RoadClass::Secondary, 1, 11.2);
    let (m2_d, _) = b.two_way(m2, d, RoadClass::Secondary, 1, 11.2);
    let mut sim = Simulation::from_parts(b.net(), demand(&[(s, d, 1.0)]), cfg(5, 0.0)).unwrap();
    let id = sim.test_place(s_f, 0, 50.0, 5.0, d, true);
    sim.test_set_guided(id, true);
    sim.test_set_trail(id, &[s_f]);
    let first = sim.test_route_of(id);
    let via_m1 = first.contains(&f_m1);
    let (slow_link, fast_first) = if via_m1 { (m1_d, f_m2) } else { (m2_d, f_m1) };
    // Within the band: near-equal routes, no change.
    sim.test_advance_clock(300.0);
    sim.test_set_ema(slow_link as usize, 24.0);
    sim.test_consider(id);
    assert_eq!(sim.test_switches(id), 0);
    // Far beyond the band: one switch, then the minimum gap and the cap hold the new route.
    sim.test_set_ema(slow_link as usize, 400.0);
    sim.test_consider(id);
    assert_eq!(sim.test_switches(id), 1);
    assert!(sim.test_route_of(id).contains(&fast_first));
    let now = sim.test_route_of(id);
    let other = if via_m1 { m1_d } else { m2_d };
    sim.test_set_ema(other as usize, 1.0);
    let _ = (f_m2, m2_d);
    sim.test_consider(id);
    assert_eq!(sim.test_route_of(id), now, "no second switch inside the minimum gap");
    assert_eq!(sim.test_switches(id), 1);
}

#[test]
fn blocked_route_forces_reroute_for_both_classes() {
    for guided in [true, false] {
        let mut b = B::default();
        let s = b.node(-200.0, 0.0, Control::Uncontrolled, true);
        let f = b.node(0.0, 0.0, Control::Uncontrolled, false);
        let m1 = b.node(200.0, 100.0, Control::Uncontrolled, false);
        let m2 = b.node(200.0, -100.0, Control::Uncontrolled, false);
        let d = b.node(400.0, 0.0, Control::Uncontrolled, true);
        let (s_f, _) = b.two_way(s, f, RoadClass::Secondary, 1, 11.2);
        let (f_m1, _) = b.two_way(f, m1, RoadClass::Secondary, 1, 11.2);
        let (m1_d, _) = b.two_way(m1, d, RoadClass::Secondary, 1, 11.2);
        let (f_m2, _) = b.two_way(f, m2, RoadClass::Secondary, 1, 11.2);
        let (m2_d, _) = b.two_way(m2, d, RoadClass::Secondary, 1, 11.2);
        let mut sim = Simulation::from_parts(b.net(), demand(&[(s, d, 1.0)]), cfg(5, 0.0)).unwrap();
        let id = sim.test_place(s_f, 0, 50.0, 5.0, d, true);
        sim.test_set_guided(id, guided);
        sim.test_set_trail(id, &[s_f]);
        let first_link = sim.test_route_of(id)[0];
        let (blocked, other_first) = if first_link == f_m1 { (m1_d, f_m2) } else { (m2_d, f_m1) };
        sim.set_interventions(&iv(&format!("[{{\"type\":\"modal_filter\",\"link\":{blocked}}}]"))).unwrap();
        let r = sim.test_route_of(id);
        assert!(!r.contains(&blocked), "guided={guided}: route avoids the closed link");
        assert!(r.contains(&other_first), "guided={guided}: route uses the other branch");
    }
}

#[test]
fn unaffected_drivers_keep_their_route_when_an_intervention_changes_elsewhere() {
    let (mut sim, dm) = setup();
    let id = sim.test_place(dm.o_m1, 0, 50.0, 5.0, dm.d, true);
    sim.test_set_guided(id, false);
    let before = sim.test_route_of(id);
    sim.test_set_ema(dm.o_m2 as usize, 1.0);
    sim.set_interventions(&iv(&format!("[{{\"type\":\"modal_filter\",\"link\":{}}}]", dm.m2_d))).unwrap();
    assert_eq!(sim.test_route_of(id), before);
    assert_eq!(sim.test_switches(id), 0);
}

#[test]
fn detour_loop_and_reversal_metrics_on_a_toy_network() {
    let (mut sim, dm) = setup();
    let _ = &mut sim;
    let rec = |trail: Vec<u32>, origin: u32, dest: u32| TripRecord { uid: 1, origin, dest, trail, switches: 0, guided: false };
    // Direct route: detour 1, no loop, no reversal.
    let direct = rec(vec![dm.o_m1, dm.m1_d], dm.o, dm.d);
    // Out along O-M1 and back to O, then around the other branch: reversal, a repeated node, and a long detour.
    let back = sim.test_metrics(&[rec(vec![dm.o_m1, dm.m1_d], dm.o, dm.d)])[0].clone();
    let m = sim.test_metrics(&[direct.clone()]);
    assert!((m[0].detour - 1.0).abs() < 0.02, "detour {}", m[0].detour);
    assert!(!m[0].looped() && !m[0].reversal);
    let _ = back;
    // The reverse links are the next ids of each two-way pair.
    let (o_m1, m1_o) = (dm.o_m1, dm.o_m1 + 1);
    let (o_m2, m2_d) = (dm.o_m2, dm.m2_d);
    let wander = rec(vec![o_m1, m1_o, o_m2, m2_d], dm.o, dm.d);
    let m = sim.test_metrics(&[wander]);
    assert!(m[0].detour > 1.3, "detour {}", m[0].detour);
    assert!(m[0].reversal, "link followed by its reverse within 200 m");
    assert!(m[0].node_max_visits >= 2, "origin node visited twice");
}
