//! Junction recovery: physical exclusion whatever the wait, vehicles held at a node exit, node-transit invariants and the recovery counters.

use super::*;
use crate::topo::Topo;

const REC_BYPASS: u8 = 4;

#[test]
fn movement_lookup_identifies_only_adjacent_directed_links() {
    let (net, _) = cross4(Control::TwoWayStop, RoadClass::Residential, true);
    let topo = Topo::new(&net);
    for a in &net.links {
        for b in &net.links {
            let movement = topo.mvs.iter().position(|m| m.a == a.id && m.b == b.id);
            assert_eq!(topo.find_mv(a.id, b.id), movement.map(|i| i as u32));
        }
        assert!(topo.find_mv(a.id, u32::MAX).is_none());
    }
}

fn place_at_line(sim: &mut Simulation, link: u32, dest: u32) -> u32 {
    let stop = sim.test_topo_stop(link);
    sim.test_place(link, 0, stop - 0.1, 0.0, dest, false)
}

/// Fraction of movement `a`'s path where movement `b` crosses it, and the share of `a`'s path a 4.5 m vehicle covers.
fn point_on(t: &Topo, b: u32, a: u32) -> (f32, f32) {
    (t.conflict_pos(b, a, false), 4.5 / t.mvs[a as usize].len.max(4.0))
}

#[test]
fn an_active_conflict_blocks_entry_beyond_every_wait_threshold() {
    for policy in [JunctionRecovery::Physical, JunctionRecovery::NoBehavioral, JunctionRecovery::Historical] {
        let (net, x) = cross4(Control::TwoWayStop, RoadClass::Residential, true);
        let mut sim = empty_sim(net);
        sim.test_set_recovery(policy);
        let a = place_at_line(&mut sim, x.w_in, x.e);
        let mva = sim.test_force_transit(a, 10.0, 10.0);
        let b = place_at_line(&mut sim, x.n_in, x.s);
        sim.test_hold_head(b, 2.0 * CONFLICT_FALLBACK_S);
        let (go, space, rec) = sim.test_permission(b);
        assert!(!space && rec & REC_BYPASS != 0);
        if policy == JunctionRecovery::Historical {
            // The old engine let the waiting car in while the crossing car still covered the point.
            assert!(go);
            assert!(sim.test_begin_crossing(b));
            assert_eq!(sim.metrics().junction_recovery.conflict_bypass.admissions, 1);
            continue;
        }
        assert!(!go, "{policy:?}");
        assert!(!sim.test_begin_crossing(b), "{policy:?}");
        // Only the crossing car's progress changes: once its tail has passed the point, the waiting car may go and both cross together.
        let mvb = {
            let t = sim.test_topo();
            t.find_mv(x.n_in, x.s_out).unwrap()
        };
        let (pos, tail) = point_on(sim.test_topo(), mvb, mva);
        assert!(pos >= 0.0 && pos + tail < 0.9, "{pos} {tail}");
        sim.test_set_transit_left(a, 10.0 * (1.0 - (pos + tail + 0.1)));
        let (go, _, rec) = sim.test_permission(b);
        assert!(go && rec == 0, "{policy:?} {rec}");
        assert!(sim.test_begin_crossing(b));
        assert!(sim.test_in_transit(a) && sim.test_in_transit(b));
        sim.check_invariants().unwrap();
        run(&mut sim, 10.0, |_| {});
        let r = sim.metrics().junction_recovery;
        assert_eq!(r.conflict_bypass.admissions, 0);
        assert_eq!(r.crossings, 1, "the forced crossing is not an admission");
    }
}

/// Two approaches at the centre of a four-way intersection whose crossing point lies within one car length of the end of the first
/// movement's path: (approach a, exit a, approach b, exit b).
fn late_crossing(sim: &Simulation, x: &Cross) -> (u32, u32, u32, u32) {
    let t = sim.test_topo();
    let ins = [x.w_in, x.e_in, x.s_in, x.n_in];
    for ma in t.mvs.iter().enumerate().filter(|(_, m)| ins.contains(&m.a)) {
        for mb in t.mvs.iter().enumerate().filter(|(_, m)| ins.contains(&m.a) && m.a != ma.1.a && m.b != ma.1.b) {
            let (pos, tail) = point_on(t, mb.0 as u32, ma.0 as u32);
            if t.conflicts(mb.0 as u32, ma.0 as u32, false) && pos >= 0.0 && pos + tail > 1.0 && t.mvs[ma.0].kind != crate::topo::K_UTURN && t.mvs[mb.0].kind != crate::topo::K_UTURN {
                return (ma.1.a, ma.1.b, mb.1.a, mb.1.b);
            }
        }
    }
    panic!("no crossing near the end of a path");
}

#[test]
fn a_vehicle_held_at_its_exit_still_covers_the_end_of_its_path() {
    for policy in [JunctionRecovery::Physical, JunctionRecovery::Historical] {
        let (net, x) = cross4(Control::Uncontrolled, RoadClass::Secondary, false);
        let to = |l: u32| net.links[l as usize].to;
        let mut sim = empty_sim(net.clone());
        sim.test_set_recovery(policy);
        let (a_in, a_out, b_in, b_out) = late_crossing(&sim, &x);
        // A standing car fills the start of the first car's exit.
        let emerge = sim.test_topo().emerge_pos[a_out as usize];
        sim.test_place(a_out, 0, emerge + 4.5 + 0.2, 0.0, to(a_out), true);
        let a = place_at_line(&mut sim, a_in, to(a_out));
        sim.test_force_transit(a, 3.0, -5.0);
        let b = place_at_line(&mut sim, b_in, to(b_out));
        let (go, _, _) = sim.test_permission(b);
        if policy == JunctionRecovery::Historical {
            // Its planned crossing time is over, so the old engine treats it as gone, lets the second car in and the two meet.
            assert!(go);
            assert!(sim.test_begin_crossing(b));
            let mut met = false;
            for _ in 0..40 {
                sim.step(DT);
                met |= sim.check_invariants().is_err();
            }
            assert!(met);
        } else {
            assert!(!go);
            run(&mut sim, 20.0, |s| assert!(s.test_in_transit(a)));
        }
    }
}

#[test]
fn the_invariant_checker_reports_malformed_node_bookkeeping() {
    let (net, x) = cross4(Control::Uncontrolled, RoadClass::Secondary, false);
    let mut sim = empty_sim(net);
    let a = place_at_line(&mut sim, x.w_in, x.e);
    let b = place_at_line(&mut sim, x.s_in, x.n);
    sim.check_invariants().unwrap();
    let mva = sim.test_topo().find_mv(x.w_in, x.e_out).unwrap();
    let mvb = sim.test_topo().find_mv(x.s_in, x.n_out).unwrap();
    let c = x.c as usize;

    // In a lane and in a node at once.
    sim.test_push_transit(c, a, mva, x.e_out);
    let e = sim.check_invariants().unwrap_err();
    assert!(e.contains(&format!("vehicle {a}")), "{e}");

    // A crossing that names another approach's movement.
    let mut sim2 = empty_sim(cross4(Control::Uncontrolled, RoadClass::Secondary, false).0);
    let a2 = place_at_line(&mut sim2, x.w_in, x.e);
    sim2.test_force_transit(a2, 3.0, 3.0);
    sim2.check_invariants().unwrap();
    sim2.test_push_transit(c, a2, mvb, x.n_out);
    let e = sim2.check_invariants().unwrap_err();
    assert!(e.contains("records link"), "{e}");

    // The same crossing recorded twice.
    let mut sim3 = empty_sim(cross4(Control::Uncontrolled, RoadClass::Secondary, false).0);
    let a3 = place_at_line(&mut sim3, x.w_in, x.e);
    sim3.test_force_transit(a3, 3.0, 3.0);
    sim3.test_push_transit(c, a3, mva, x.e_out);
    let e = sim3.check_invariants().unwrap_err();
    assert!(e.contains("2 lanes or nodes"), "{e}");

    // A crossing record for a vehicle whose flag says it is on a link.
    sim3 = empty_sim(cross4(Control::Uncontrolled, RoadClass::Secondary, false).0);
    let a3 = place_at_line(&mut sim3, x.w_in, x.e);
    sim3.test_force_transit(a3, 3.0, 3.0);
    sim3.test_set_in_transit_flag(a3, false);
    assert!(sim3.check_invariants().unwrap_err().contains("not crossing"));
    let _ = b;
}

#[test]
fn repeated_evaluation_of_a_blocked_head_counts_time_not_admissions() {
    let (net, x) = cross4(Control::TwoWayStop, RoadClass::Residential, true);
    let mut sim = empty_sim(net);
    let a = place_at_line(&mut sim, x.w_in, x.e);
    sim.test_force_transit(a, 1000.0, 1000.0);
    let b = place_at_line(&mut sim, x.s_in, x.n);
    sim.test_hold_head(b, CONFLICT_FALLBACK_S + 1.0);
    run(&mut sim, 20.0, |_| {});
    let r = sim.metrics().junction_recovery;
    assert_eq!(r.policy, "physical");
    assert!((r.conflict_bypass.invoked_s - 20.0).abs() < 0.5 && (r.conflict_bypass.blocked_s - r.conflict_bypass.invoked_s).abs() < 1e-9, "{r:?}");
    assert_eq!(r.conflict_bypass.admissions + r.courtesy.admissions + r.yield_fallback.admissions, 0);
    assert_eq!(r.crossings, 0);
    sim.test_set_transit_left(a, 0.1);
    run(&mut sim, 20.0, |_| {});
    let r = sim.metrics().junction_recovery;
    assert!(!sim.test_in_transit(b) && r.crossings == 1, "{r:?}");
    assert_eq!(r.conflict_bypass.admissions + r.courtesy.admissions + r.yield_fallback.admissions, 0);
}

#[test]
fn a_courtesy_entry_is_attributed_once() {
    let (net, x) = cross4(Control::TwoWayStop, RoadClass::Residential, true);
    let mut sim = empty_sim(net);
    sim.test_place(x.w_in, 0, 191.0, 0.0, x.e, true);
    let car = sim.test_place(x.s_in, 0, 186.0, 2.0, x.n, false);
    run(&mut sim, (YIELD_COURTESY_S - 5.0) as f64, |_| {});
    assert_eq!(sim.metrics().junction_recovery.courtesy.admissions, 0);
    run(&mut sim, 30.0, |_| {});
    assert!(sim.test_veh(car).0 != x.s_in || !sim.test_veh(car).3);
    let r = sim.metrics().junction_recovery;
    assert_eq!((r.courtesy.admissions, r.yield_fallback.admissions, r.conflict_bypass.admissions), (1, 0, 0), "{r:?}");
    assert!(r.courtesy.invoked_s >= DT && r.courtesy.invoked_s < 10.0, "{r:?}");
    let ev = sim.recovery_events();
    assert_eq!(ev.len(), 1);
    assert_eq!((ev[0].node, ev[0].from_link, ev[0].to_link, ev[0].reason), (x.c, x.s_in, x.n_out, "courtesy"));
    assert!(ev[0].wait_s >= YIELD_COURTESY_S);
}

/// A car crossing at 10 m/s finds 6 m before a standing car at the start of its exit: room to enter, not to brake from speed.
fn held_at_exit(policy: JunctionRecovery, gap: f32) -> (Simulation, u32, u32) {
    let (net, l0, dest) = line_net(11.0, 300.0);
    let mut sim = empty_sim(net);
    sim.test_set_recovery(policy);
    let exit = 2;
    let emerge = sim.test_topo().emerge_pos[exit];
    sim.test_place(exit as u32, 0, emerge + 4.5 + gap, 0.0, dest, true);
    let a = sim.test_place(l0, 0, sim.test_topo_stop(l0) - 0.1, 10.0, dest, false);
    sim.test_force_transit(a, 2.0, 0.1);
    (sim, a, exit as u32)
}

#[test]
fn a_held_vehicle_enters_as_soon_as_it_fits() {
    let (mut sim, a, _) = held_at_exit(JunctionRecovery::Physical, 6.0);
    run(&mut sim, 0.5, |_| {});
    assert!(!sim.test_in_transit(a) && sim.test_veh(a).3);
    // No faster than lets it stop behind the standing car at 4 m/s^2.
    assert!(sim.test_veh(a).2 <= (8.0f32 * 5.5).sqrt() + 0.01, "{}", sim.test_veh(a).2);
    // The old engine kept the planned exit speed, needed its braking room, and never entered behind the standing car.
    let (mut sim, a, _) = held_at_exit(JunctionRecovery::Historical, 6.0);
    run(&mut sim, 300.0, |_| {});
    assert!(sim.test_in_transit(a));
}

#[test]
fn a_lane_with_a_vehicle_held_at_its_entry_has_no_room() {
    for (policy, room) in [(JunctionRecovery::Physical, false), (JunctionRecovery::Historical, true)] {
        let (mut sim, a, exit) = held_at_exit(policy, 6.0);
        sim.test_set_transit_left(a, -0.1);
        assert_eq!(sim.test_lane_room(exit, 0) > 4.0, room, "{policy:?}");
    }
}

#[test]
fn a_vehicle_held_in_the_node_too_long_is_removed_and_counted() {
    let (mut sim, a, _) = held_at_exit(JunctionRecovery::Physical, 0.2);
    run(&mut sim, (GRIDLOCK_REMOVE_S + 5.0) as f64, |_| {});
    let m = sim.metrics();
    assert!(!sim.test_veh(a).3);
    assert_eq!((m.gridlock_removed, m.junction_recovery.held_removals), (1, 1));
    assert_eq!(sim.recovery_events().last().unwrap().reason, "heldRemoval");
    let (mut sim, a, _) = held_at_exit(JunctionRecovery::Historical, 0.2);
    run(&mut sim, (GRIDLOCK_REMOVE_S + 5.0) as f64, |_| {});
    assert!(sim.test_in_transit(a) && sim.metrics().gridlock_removed == 0);
}
