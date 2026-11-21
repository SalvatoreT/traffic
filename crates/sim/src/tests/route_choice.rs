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

/// A way out of a blocked link that skips the assumed movement drops it, so later re-plans do not steer the car back to it.
#[test]
fn replanning_around_a_blocked_link_drops_a_skipped_via() {
    let (net, c) = corridor(20.0, Control::Uncontrolled);
    let (entry, skipped) = (c.art[0].0, c.art[1].0);
    let mut sim = Simulation::from_parts(net, demand(&[(c.a[0], c.a[3], 10.0)]), cfg_empty(1, 1.0)).unwrap();
    let car = sim.test_place(entry, 0, 100.0, 5.0, c.a[3], false);
    assert_eq!(sim.test_route_of(car).first(), Some(&skipped));
    sim.test_set_via(car, Some((entry, skipped)));
    sim.test_replan_around_blocked(car);
    let route = sim.test_route_of(car);
    assert_ne!(route.first(), Some(&skipped), "the car left the blocked link: {route:?}");
    assert_eq!(sim.test_via_of(car), None, "the movement it no longer makes is dropped");
    // A way out that keeps the movement leaves it in place.
    let car2 = sim.test_place(entry, 0, 60.0, 5.0, c.a[3], false);
    sim.test_set_via(car2, Some((entry, c.conn[1].0)));
    sim.test_replan_around_blocked(car2);
    assert_eq!(sim.test_route_of(car2).first(), Some(&c.conn[1].0));
    assert_eq!(sim.test_via_of(car2), Some((entry, c.conn[1].0)));
}

/// A way out that passes a junction the car has already driven through only circles, so the car keeps its route and waits.
#[test]
fn replanning_around_a_blocked_link_does_not_revisit_driven_junctions() {
    let (net, c) = corridor(20.0, Control::Uncontrolled);
    let mut sim = Simulation::from_parts(net, demand(&[(c.a[0], c.a[3], 10.0)]), cfg_empty(1, 1.0)).unwrap();
    let car = sim.test_place(c.art[0].0, 0, 100.0, 5.0, c.a[3], false);
    let before = sim.test_route_of(car);
    // The local row runs through l2; a car that drove through l2 earlier must not be sent there.
    sim.test_set_trail(car, &[c.loc[1].0]);
    sim.test_replan_around_blocked(car);
    assert_eq!(sim.test_route_of(car), before);
    sim.test_set_trail(car, &[]);
    sim.test_replan_around_blocked(car);
    assert_ne!(sim.test_route_of(car), before);
}

#[test]
fn perceived_cost_route_choice_has_no_junction_count_bias() {
    let mut cases = Vec::new();
    crate::validate::route_choice_cases(&mut cases);
    for c in &cases {
        eprintln!("{} {:.3} [{:.3}, {:.3}] {}", c.id, c.sim, c.lo, c.hi, c.note);
    }
    for c in &cases {
        assert!(c.pass(), "{} {} = {:.3} outside {:.3} to {:.3}: {}", c.id, c.name, c.sim, c.lo, c.hi, c.note);
    }
}

#[test]
fn a_driver_keeps_its_perception_for_the_trip() {
    let (mut sim, dm) = setup();
    for seed in [7u32, 11, 4242] {
        assert_eq!(sim.departure_route(dm.o, dm.d, seed), sim.departure_route(dm.o, dm.d, seed));
    }
}

#[test]
fn perceived_and_mean_routes_agree_on_a_fast_turn_off_a_congested_approach() {
    use crate::eff::Eff;
    use crate::route::{first_link, From, Goal, Perceived, Router};
    use crate::topo::Topo;
    let mut b = B::default();
    let s = b.node(0., 0., Control::Uncontrolled, true);
    let a = b.node(100., 0., Control::Uncontrolled, false);
    let d = b.node(150., 0., Control::Uncontrolled, true);
    b.link(s, a, RoadClass::Secondary, 1, 10., false);
    b.link(a, d, RoadClass::Secondary, 1, 10., false);
    b.link(s, d, RoadClass::Secondary, 1, 10., false);
    let net = b.net();
    let topo = Topo::new(&net);
    let mut eff = Eff::derive(&topo, &net, &[]);
    let mv = topo.find_mv(0, 1).unwrap() as usize;
    let cost = [100., 10., 60.];
    // Cost constructed by sim::apply_mv_times: weighted turn-specific approach time minus mean, plus movement cost.
    eff.route_w = vec![1.; 3];
    eff.mv_cost[mv] = 5. + 20. - 100.;
    let mut router = Router::new(3);
    router.ensure(d, &topo, &eff, &cost);
    let deterministic = first_link(router.table(d), &topo, &eff, s).unwrap();
    let mut out = Vec::new();
    let mut forward = Perceived::default();
    let t = forward.search(&topo, eff.car_modal(), &cost, 1e-9, 42, From::Node(s), Goal::Dest(d), &|_| true, &mut out).unwrap();
    assert!((t - 35.0).abs() < 0.001);
    assert_eq!(deterministic, 0);
    assert_eq!(out, [0, 1]);
    out.clear();
    let en_route = forward.search(&topo, eff.car_modal(), &cost, 1e-9, 42, From::Link(0), Goal::Dest(d), &|_| true, &mut out).unwrap();
    assert_eq!(out, [1]);
    assert!((en_route - t).abs() < 0.001);

    // Standalone queries may use new costs on their next goal.
    let changed = [250.0, 10.0, 60.0];
    router.ensure_link(1, &topo, &eff, &changed);
    assert_eq!(router.link_tables[&1][0], 185.0);
    out.clear();
    forward.search(&topo, eff.car_modal(), &changed, 0.0, 42, From::Node(s), Goal::Dest(d), &|_| true, &mut out).unwrap();
    assert_eq!(out, [2]);
}

#[test]
fn equal_cost_routes_keep_the_first_settled_predecessor_at_short_and_long_travel_times() {
    use crate::eff::Eff;
    use crate::route::{From, Goal, Perceived, NO_NOISE};
    use crate::topo::Topo;
    let mut b = B::default();
    let origin = b.node(0., 0., Control::Uncontrolled, true);
    let left = b.node(100., 20., Control::Uncontrolled, false);
    let right = b.node(100., -20., Control::Uncontrolled, false);
    let merge = b.node(200., 0., Control::Uncontrolled, false);
    let end = b.node(300., 0., Control::Uncontrolled, true);
    for (from, to) in [(origin, left), (origin, right), (left, merge), (right, merge), (merge, end)] {
        b.link(from, to, RoadClass::Residential, 1, 10., false);
    }
    let net = b.net();
    let topo = Topo::new(&net);
    let mut eff = Eff::derive(&topo, &net, &[]);
    eff.route_w.fill(1.0);
    eff.mv_cost.fill(0.0);
    let mut search = Perceived::default();
    for seconds in [0.0, 1.0, 5_000.0] {
        let cost = [seconds; 5];
        let mut path = Vec::new();
        let time = search.search(&topo, eff.car_modal(), &cost, 2.0, NO_NOISE, From::Node(origin), Goal::Link(4), &|_| true, &mut path);
        assert_eq!(path, [0, 2, 4]);
        assert_eq!(time, Some(3.0 * seconds));
    }
}
