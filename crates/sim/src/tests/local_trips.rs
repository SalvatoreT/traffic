//! Local trip accounting: distinct endpoints, the free-flow reference over the driven path, causal clocks and terminal motion.

use super::*;
use crate::sim::TripTiming;

/// The audit's fixture: a directed line of `segments` 1,000 m residential links at 10 m/s with one car flow of 10 veh/h from one end
/// to the other, local or gate ends, seed 1, no initial loading, one hour.
fn line(segments: usize, gate: bool) -> Network {
    let mut b = B::default();
    for i in 0..=segments {
        let end = i == 0 || i == segments;
        b.node(1000.0 * i as f64, 0.0, Control::Uncontrolled, gate && end);
        b.nodes[i].in_study_area = true;
    }
    for i in 0..segments {
        b.link(i as u32, i as u32 + 1, RoadClass::Residential, 1, 10.0, false);
    }
    b.net()
}

fn line_run(segments: usize, gate: bool, rate: f64, cfg_f: impl Fn(Config) -> Config) -> Simulation {
    let mut sim = Simulation::from_parts(line(segments, gate), demand(&[(0, segments as u32, rate)]), cfg_f(Config { record_trips: true, ..cfg_empty(1, 1.0) })).unwrap();
    run(&mut sim, 3600.0, |_| {});
    sim
}

/// Length (m) of the path a trip drove: its parts of the entry and exit links between their junctions and the node paths between.
fn path_len(sim: &Simulation, t: &TripTiming, segments: usize) -> f32 {
    let topo = sim.test_topo();
    let first = t.entry_link as usize;
    let last = t.exit_link as usize;
    if first == last {
        return t.exit_pos - t.entry_pos;
    }
    let mut len = topo.stop_pos[first] - t.entry_pos + t.exit_pos - topo.emerge_pos[last];
    for l in first..last {
        len += topo.mvs[topo.find_mv(l as u32, l as u32 + 1).unwrap() as usize].len;
        if l > first {
            len += topo.stop_pos[l] - topo.emerge_pos[l];
        }
    }
    let _ = segments;
    len
}

#[test]
fn the_audit_fixtures_drive_their_distance_and_have_small_positive_delay() {
    for gate in [false, true] {
        for segments in [1, 2] {
            let sim = line_run(segments, gate, 10.0, |c| c);
            let m = sim.metrics();
            let tt = sim.trip_timings();
            assert_eq!(tt.len() as u64, m.completed_trips);
            assert!(m.completed_trips >= 10 && m.veh_km > 0.0, "gate {gate} segments {segments}: {} trips, {} veh-km", m.completed_trips, m.veh_km);
            assert!(m.mean_trip_time > 0.0);
            for t in tt {
                assert!(t.t_arr <= t.t_ins && t.t_ins <= t.t_done, "{t:?}");
                if !gate {
                    assert!(t.exit_pos > t.entry_pos || t.exit_link != t.entry_link, "{t:?}");
                }
                // Distance: the last step stops at the exit point; a crossing starts up to 0.3 m before the stop line.
                let want = path_len(&sim, t, segments);
                let slack = 0.3 * (t.exit_link - t.entry_link) as f32 + 0.05;
                assert!(t.dist_m <= want + 0.05 && t.dist_m >= want - slack, "gate {gate} segments {segments}: drove {} of {want}", t.dist_m);
                // Unobstructed: a gate start enters at its desired speed, so only the clock's step remains [Treiber2015]. A local start pulls
                // out from a standstill and the IDM's free-road term [Treiber2000] approaches the desired speed slowly: the time lost is below
                // v0 / a, at most 14 / 1.1 = 12.7 s for these drivers.
                // Later trips can catch up with a slower car ahead, so the upper bound applies to the first one, which drives alone. The
                // lower bound is two steps: completion is stamped at the start of its step, and a node crossing starts up to 0.3 m early.
                let delay = (t.t_done - t.t_arr) as f32 - t.ff_s;
                let hi = if gate { 1.0 } else { 12.7 };
                assert!(delay > -2.0 * DT as f32, "gate {gate} segments {segments}: delay {delay} ({t:?})");
                if t.uid == tt.iter().map(|x| x.uid).min().unwrap() {
                    assert!(delay < hi, "gate {gate} segments {segments}: delay {delay} ({t:?})");
                }
            }
            let km: f32 = tt.iter().map(|t| t.dist_m).sum::<f32>() / 1000.0;
            assert!((m.veh_km as f32 - km).abs() < 0.05 * km.max(1.0), "network veh-km {} against trips {km}", m.veh_km);
        }
    }
}

#[test]
fn local_ends_differ_by_role_and_a_one_link_trip_drives_downstream() {
    let sim = line_run(1, false, 10.0, |c| c);
    let mut same = 0;
    for uid in 0..200 {
        let (o, d, one) = sim.test_ends(uid, 0);
        let (o, d, (a, e)) = (o.unwrap(), d.unwrap(), one.unwrap());
        same += (o == d) as u32;
        assert!(a <= e && a == o.min(d) && e == o.max(d));
    }
    assert!(same == 0);
}

#[test]
fn the_free_flow_reference_counts_only_the_driven_part_and_its_humps() {
    let mut net = line(1, false);
    net.links[0].humps = vec![200.0, 800.0];
    let sim = Simulation::from_parts(net, demand(&[]), cfg_empty(1, 1.0)).unwrap();
    let full = sim.test_ff_part(0, 1.0, 0.0, 1000.0);
    let (e, s) = (sim.test_topo().emerge_pos[0], sim.test_topo().stop_pos[0]);
    assert!((full - ((s - e) / 10.0 + 2.0 * HUMP_FF_PENALTY)).abs() < 1e-3);
    // A trip between 300 m and 700 m passes neither hump.
    assert!((sim.test_ff_part(0, 1.0, 300.0, 700.0) - 40.0).abs() < 1e-3);
    // From 100 m to 500 m it passes the first; at a desired speed 1.25 times the limit the driving part shrinks.
    assert!((sim.test_ff_part(0, 1.25, 100.0, 500.0) - (400.0 / 12.5 + HUMP_FF_PENALTY)).abs() < 1e-3);
}

#[test]
fn endpoints_repeat_after_a_reset_and_in_a_paired_scenario() {
    let ends = |sim: &Simulation| -> std::collections::BTreeMap<u32, (u32, f32, u32, f32)> {
        sim.trip_timings().iter().map(|t| (t.uid, (t.entry_link, t.entry_pos, t.exit_link, t.exit_pos))).collect()
    };
    let mut a = line_run(2, false, 60.0, |c| c);
    let base = ends(&a);
    a.reset();
    run(&mut a, 3600.0, |_| {});
    assert_eq!(ends(&a), base);
    // A lower speed limit on the second link changes the trips' times, not where they start and end.
    let iv: Vec<Intervention> = serde_json::from_str(r#"[{"type":"speed_limit","link":1,"speed":6.0}]"#).unwrap();
    let b = line_run(2, false, 60.0, |c| Config { interventions: iv.clone(), ..c });
    let other = ends(&b);
    let shared: Vec<_> = base.keys().filter(|k| other.contains_key(k)).collect();
    assert!(shared.len() > 30);
    for k in shared {
        assert_eq!(base[k], other[k], "trip {k}");
    }
}

#[test]
fn queued_entries_keep_their_requested_arrival() {
    let sim = line_run(1, false, 2400.0, |c| c);
    let tt = sim.trip_timings();
    assert!(tt.iter().all(|t| t.t_arr <= t.t_ins && t.t_ins <= t.t_done));
    let waited = tt.iter().filter(|t| t.t_ins - t.t_arr > 1.0).count();
    assert!(waited > 10, "{waited} trips waited to pull out");
    let m = sim.metrics();
    let mean: f64 = tt.iter().map(|t| t.t_done - t.t_arr).sum::<f64>() / tt.len() as f64;
    assert!((m.mean_trip_time - mean).abs() < 1e-6, "the trip time counts the wait to enter");
}

#[test]
fn bicycle_trips_have_positive_times() {
    let net = line(1, true);
    let mut d = demand(&[(0, 1, 60.0)]);
    d.periods[0].flows[0].mode = FlowMode::Bicycle;
    let mut sim = Simulation::from_parts(net, d, cfg_empty(1, 1.0)).unwrap();
    run(&mut sim, 1800.0, |_| {});
    let m = sim.metrics();
    assert!(m.modes.bicycle.completed_trips > 10 && m.modes.bicycle.mean_trip_time > 100.0, "{:?}", m.modes.bicycle);
}


#[test]
fn curb_addresses_stay_fixed_when_a_speed_change_reroutes_a_fork() {
    use std::collections::BTreeMap;
    let mut b = B::default();
    let o = b.node(0.0, 0.0, Control::Uncontrolled, false);
    let a = b.node(250.0, 60.0, Control::Uncontrolled, false);
    let b1 = b.node(250.0, -60.0, Control::Uncontrolled, false);
    let d = b.node(500.0, 0.0, Control::Uncontrolled, false);
    b.link(o, a, RoadClass::Residential, 1, 16.0, false);
    b.link(a, d, RoadClass::Residential, 1, 16.0, false);
    b.link(o, b1, RoadClass::Residential, 1, 10.0, false);
    b.link(b1, d, RoadClass::Residential, 1, 10.0, false);
    let net = b.net();
    let inputs = demand(&[(o, d, 40.0)]);
    let baseline = Config {
        record_trips: true,
        route_dispersion: Some(0.0),
        ..cfg_empty(1, 1.0)
    };
    let scenario = Config {
        interventions: serde_json::from_str(r#"[{"type":"speed_limit","link":0,"speed":3.0}]"#).unwrap(),
        ..baseline.clone()
    };
    let run = |cfg| {
        let mut sim = Simulation::from_parts(net.clone(), inputs.clone(), cfg).unwrap();
        sim.step(3600.0);
        sim.trip_timings()
            .iter()
            .map(|t| (t.uid, (t.entry_link, t.entry_pos, t.exit_link, t.exit_pos)))
            .collect::<BTreeMap<_, _>>()
    };
    let left = run(baseline);
    let right = run(scenario);
    let common: Vec<_> = left.keys().filter(|k| right.contains_key(k)).collect();

    assert!(common.len() > 20);
    for uid in common {
        assert_eq!(left[uid], right[uid]);
    }
}

#[test]
fn resident_elapsed_time_follows_the_same_requests_through_cutoff() {
    let cfg = Config {
        initial_load: true,
        trace: true,
        ..cfg_empty(1, 1.0)
    };
    let build = |ivs| Simulation::from_parts(line(4, false), demand(&[(0, 4, 60.0)]), Config { interventions: ivs, ..cfg.clone() }).unwrap();
    let mut base = build(vec![]);
    let mut slow = build(serde_json::from_str(r#"[{"type":"speed_limit","link":2,"speed":1.0}]"#).unwrap());
    let horizon = 480.0;
    for sim in [&mut base, &mut slow] {
        sim.step(horizon);
        let trace = sim.trace_requests();
        let rs: Vec<_> = trace.chunks_exact(14).filter(|r| r[2] == 0.0 && r[6] >= 0.0).collect();
        let time = sim.resident_time();
        assert!(!rs.is_empty() && rs.len() < trace.len() / 14);
        assert_eq!(time.requested, rs.len() as u64);
        assert_eq!(time.completed, rs.iter().filter(|r| r[10] == 2.0).count() as u64);
        let elapsed: f64 = rs.iter().map(|r| (if r[10] == 2.0 { r[9] } else { horizon }) - r[6]).sum();
        assert!((time.seconds - elapsed).abs() < 1e-7);
    }
    let (b, s) = (base.resident_time(), slow.resident_time());
    assert!(b.completed > 0);
    assert_eq!(s.completed, 0);
    assert!(s.mean().unwrap() > 0.0 && b.paired_delta(&s).unwrap() > 0.0);
    assert_eq!(b.paired_delta(&crate::sim::ResidentTime { signature: !s.signature, ..s }), None);
    assert_eq!(crate::sim::ResidentTime::default().mean(), None);
}

#[test]
fn a_reversed_destination_uses_the_same_address_and_a_closed_block_is_unroutable() {
    use std::collections::BTreeMap;
    let mut b = B::default();
    let s = b.node(0., 0., Control::Uncontrolled, true);
    let a = b.node(200., 0., Control::Uncontrolled, false);
    let d = b.node(400., 0., Control::Uncontrolled, false);
    let side = b.node(300., 200., Control::Uncontrolled, false);
    b.link(s, a, RoadClass::Residential, 1, 12., false);
    let (last, reverse) = b.two_way(a, d, RoadClass::Residential, 1, 12.);
    b.link(s, side, RoadClass::Residential, 1, 6., false);
    b.link(side, d, RoadClass::Residential, 1, 6., false);
    let net = b.net();
    let measure = |ivs: String| {
        let mut cf = cfg_empty(3, 1.);
        cf.route_dispersion = Some(0.);
        cf.record_trips = true;
        cf.interventions = serde_json::from_str(&ivs).unwrap();
        let mut sim = Simulation::from_parts(net.clone(), demand(&[(s, d, 80.)]), cf).unwrap();
        sim.step(1800.);
        (
            sim.trip_timings().iter().map(|t| (t.uid, (t.exit_link, t.exit_pos))).collect::<BTreeMap<_, _>>(),
            sim.metrics().unroutable_trips,
        )
    };
    let (before, _) = measure("[]".into());
    let (after, _) = measure(format!(r#"[{{"type":"one_way","link":{reverse}}}]"#));
    assert!(after.len() > 20);
    for (uid, (l, p)) in after {
        if let Some(&(old, q)) = before.get(&uid) {
            assert_eq!((old, l), (last, reverse));
            assert!((q + p - 200.).abs() < 1e-3);
        }
    }
    let (inaccessible, unroutable) = measure(format!(r#"[{{"type":"modal_filter","link":{last}}}]"#));
    assert!(inaccessible.is_empty() && unroutable > 20);
}

#[test]
fn an_upstream_destination_on_a_new_one_way_requires_a_legal_loop() {
    let mut b = B::default();
    let a = b.node(0.0, 0.0, Control::Uncontrolled, false);
    let d = b.node(200.0, 0.0, Control::Uncontrolled, false);
    let c = b.node(100.0, 200.0, Control::Uncontrolled, false);
    let (_, reverse) = b.two_way(a, d, RoadClass::Residential, 1, 12.0);
    let ac = b.link(a, c, RoadClass::Residential, 1, 9.0, false);
    let cd = b.link(c, d, RoadClass::Residential, 1, 9.0, false);
    let iv = format!(r#"[{{"type":"one_way","link":{reverse}}}]"#);
    let mut config = cfg_empty(1, 1.0);
    config.record_trips = true;
    config.interventions = serde_json::from_str(&iv).unwrap();
    let mut sim = Simulation::from_parts(b.net(), demand(&[(a, d, 50.0)]), config).unwrap();
    sim.step(1800.0);
    assert!(sim.trip_records().len() > 10);
    assert!(sim.trip_records().iter().all(|trip| trip.trail == vec![reverse, ac, cd, reverse]));
    assert!(sim.trip_timings().iter().all(|trip| trip.exit_pos < trip.entry_pos && trip.dist_m > 450.0));
}

#[test]
fn whole_street_counts_require_both_ends_and_each_intervening_link() {
    use crate::sim::LinkDetector;
    let mut sim = Simulation::from_parts(line(4, false), demand(&[(0, 4, 100.)]), cfg_empty(1, 1.)).unwrap();
    let from_curb = sim.observe_corridor(&[0, 1, 2], 0.).unwrap();
    let to_curb = sim.observe_corridor(&[1, 2, 3], 0.).unwrap();
    let interior = sim.observe_corridor(&[1, 2], 0.).unwrap();
    let last_block = sim.observe_corridor(&[2], 0.).unwrap();
    let after_warmup = sim.observe_corridor(&[1, 2], 900.).unwrap();
    assert!(sim.observe_corridor(&[1, 3], 0.).is_err());
    for l in 0..4 {
        for d in [LinkDetector::Start, LinkDetector::Stop, LinkDetector::BlockUse] {
            sim.observe_link_detector(l, d);
        }
    }
    sim.step(1800.);
    let trips = sim.corridor_trips(interior)[&(0, 4)];
    assert!(trips > 10);
    assert!(sim.corridor_trips(from_curb).is_empty() && sim.corridor_trips(to_curb).is_empty());
    assert_eq!(sim.corridor_trips(last_block)[&(0, 4)], trips);
    assert!((1..trips).contains(&sim.corridor_trips(after_warmup)[&(0, 4)]));
    let diagnostics = sim.diagnostics();
    for l in 0..4 {
        for (end, count) in [(LinkDetector::Start, diagnostics.link_start_passages[l]), (LinkDetector::Stop, diagnostics.stop_line_passages[l]), (LinkDetector::BlockUse, diagnostics.link_exits[l])] {
            assert_eq!(sim.link_detector_trips(l as u32, end).get(&(0, 4)).copied().unwrap_or(0), count);
        }
    }
    sim.reset();
    assert!(sim.corridor_trips(interior).is_empty());
    sim.step(1800.);
    assert_eq!(sim.corridor_trips(interior)[&(0, 4)], trips);
}

#[test]
fn corridor_observers_credit_trips_at_the_final_line_even_if_still_in_network() {
    let mut sim = Simulation::from_parts(line(4, true), demand(&[(0, 4, 100.)]), cfg_empty(1, 1.)).unwrap();
    let first_two = sim.observe_corridor(&[0, 1], 0.).unwrap();
    let full = sim.observe_corridor(&[0, 1, 2, 3], 0.).unwrap();
    for _ in 0..100 {
        sim.step(10.);
        if !sim.corridor_trips(first_two).is_empty() { break; }
    }
    assert!(sim.corridor_trips(first_two)[&(0, 4)] > 0 && sim.metrics().completed_trips == 0);
    sim.step(1200.);
    assert_eq!(sim.corridor_trips(full)[&(0, 4)] as u64, sim.metrics().completed_trips);
}

#[test]
fn leaving_and_rejoining_a_corridor_misses_the_whole_street_detector() {
    // Two parallel blocks share their endpoints. Every trip uses the faster original block.
    let mut net = line(3, true);
    let mut parallel = net.links[1].clone();
    parallel.id = 3;
    parallel.length *= 2.;
    parallel.speed_limit *= 0.2;
    net.links.push(parallel);
    let mut sim = Simulation::from_parts(net, demand(&[(0, 3, 100.)]), Config { route_dispersion: Some(0.), ..cfg_empty(1, 1.) }).unwrap();
    let driven = sim.observe_corridor(&[0, 1, 2], 0.).unwrap();
    let skipped = sim.observe_corridor(&[0, 3, 2], 0.).unwrap();
    use crate::sim::PathObservation::{Movement, SplitJunction};
    let turn = sim.observe_path(Movement(1, 2), 0.).unwrap();
    let missed_turn = sim.observe_path(Movement(3, 2), 0.).unwrap();
    let split = sim.observe_path(SplitJunction(vec![0, 1, 2]), 0.).unwrap();
    let missed_split = sim.observe_path(SplitJunction(vec![0, 3, 2]), 0.).unwrap();
    sim.step(1800.);
    assert!(sim.corridor_trips(driven)[&(0, 3)] > 10);
    assert!(sim.corridor_trips(skipped).is_empty());
    assert!(sim.corridor_trips(missed_turn).is_empty());
    assert!(sim.corridor_trips(missed_split).is_empty());
    assert_eq!(sim.corridor_trips(turn), sim.corridor_trips(split));
    assert!(sim.corridor_trips(turn)[&(0, 3)] >= sim.corridor_trips(driven)[&(0, 3)]);
}
