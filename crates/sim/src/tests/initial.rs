//! Initial loading: agents already en route at time zero, the settle interval, and the results counting from zero.

use super::*;

/// Mean over seeds of the number of placed agents against rate x free-flow route time x `INITIAL_CONGESTION` on an uncontrolled line.
#[test]
fn the_placed_count_matches_rate_times_trip_time() {
    let (net, _f, dest) = line_net(13.4, 400.0);
    let rate = 600.0;
    let lambda = rate / 3600.0 * (800.0 / 13.4) * INITIAL_CONGESTION;
    let seeds = 60;
    let mut total = 0u64;
    for seed in 1..=seeds {
        let mut s = Simulation::from_parts(net.clone(), demand(&[(0, dest, rate)]), Config { initial_load: false, ..cfg(seed, 1.0) }).unwrap();
        s.test_prepopulate();
        let m = s.metrics();
        assert_eq!(m.initial_agents as usize, s.test_kind(0).len());
        total += m.initial_agents;
    }
    let expect = lambda * seeds as f64;
    assert!((total as f64 - expect).abs() < 4.0 * expect.sqrt(), "placed {total}, expected {expect:.0} (Poisson noise {:.0})", expect.sqrt());
}

/// Dense signalized corridor: nobody beyond a stop line, in a node, or closer to the leader than the leader's length plus the standstill gap.
#[test]
fn placement_keeps_gaps_and_stays_before_stop_lines() {
    let (net, c) = corridor(11.2, Control::Signal);
    let d = demand(&[(c.a[0], c.a[3], 1100.0), (c.a[3], c.a[0], 1000.0), (c.l[1], c.a[3], 300.0), (c.a[0], c.l[3], 300.0)]);
    for seed in 1..=4 {
        let mut s = Simulation::from_parts(net.clone(), d.clone(), Config { initial_load: false, ..cfg(seed, 1.0) }).unwrap();
        s.test_prepopulate();
        s.check_invariants().unwrap();
        let mut n = 0;
        for l in 0..net.links.len() as u32 {
            let stop = s.test_topo_stop(l);
            let veh = s.test_lane_vehicles(l);
            n += veh.len();
            for &(_, pos, v) in veh.iter() {
                assert!(pos <= stop + 1e-3 && pos >= s.test_topo().emerge_pos[l as usize] - 1e-3, "link {l}: position {pos} outside [emerge, stop {stop}]");
                assert!(v >= 0.0 && v <= 20.0);
            }
            // Vehicles of one lane come out in queue order, front first: consecutive positions are at least a car length plus s0 apart.
            let lanes = s.test_lanes_of(l);
            for w in veh.windows(2).zip(lanes.windows(2)) {
                if w.1[0].1 == w.1[1].1 {
                    assert!(w.0[0].1 - w.0[1].1 >= 4.4 + 1.5, "link {l}: front-to-front {} m", w.0[0].1 - w.0[1].1);
                }
            }
        }
        assert!(n > 50, "a loaded network: {n}");
    }
}

/// A link closed to them: nobody is placed on it, from construction on, including after `reset` carried the scenario.
#[test]
fn nobody_is_placed_on_a_closed_link() {
    let (net, c) = corridor(6.0, Control::Uncontrolled);
    let d = demand(&[(c.a[0], c.a[3], 500.0), (c.a[3], c.a[0], 400.0), (c.l[1], c.a[3], 200.0), (c.l[2], c.l[0], 200.0)]);
    let (f, r) = c.loc[1];
    let ivs: Vec<Intervention> = serde_json::from_str(&format!("[{{\"type\":\"modal_filter\",\"link\":{f}}}]")).unwrap();
    // Without the scenario the local row carries cars at time zero.
    let base = Simulation::from_parts(net.clone(), d.clone(), cfg(3, 1.0)).unwrap();
    assert!(!base.test_lane_vehicles(f).is_empty() || !base.test_lane_vehicles(r).is_empty());
    let mut with = Simulation::from_parts(net.clone(), d.clone(), Config { interventions: ivs, ..cfg(3, 1.0) }).unwrap();
    assert!(with.test_lane_vehicles(f).is_empty() && with.test_lane_vehicles(r).is_empty());
    run(&mut with, 300.0, |s| assert!(s.test_lane_vehicles(f).is_empty() && s.test_lane_vehicles(r).is_empty()));
    // Scenario set on a live run, then reset: the new initial state already respects it.
    let mut sim = Simulation::from_parts(net, d, cfg(3, 1.0)).unwrap();
    sim.set_interventions(&iv(&format!("[{{\"type\":\"modal_filter\",\"link\":{f}}}]"))).unwrap();
    sim.reset();
    assert!(sim.test_lane_vehicles(f).is_empty() && sim.test_lane_vehicles(r).is_empty());
}

#[test]
fn the_initial_state_is_deterministic_and_reset_reproduces_it() {
    let make = |seed| {
        let (net, c) = corridor(11.2, Control::Signal);
        let d = demand(&[(c.a[0], c.a[3], 700.0), (c.a[3], c.a[0], 600.0), (c.l[1], c.a[3], 200.0)]);
        Simulation::from_parts(net, d, cfg(seed, 1.0)).unwrap()
    };
    let (mut a, b, c) = (make(5), make(5), make(6));
    assert_eq!(a.vehicles(), b.vehicles());
    assert_eq!(a.metrics_json(), b.metrics_json());
    assert_ne!(a.vehicles(), c.vehicles());
    let first = a.vehicles();
    run(&mut a, 120.0, |_| {});
    a.reset();
    assert_eq!(a.time(), 0.0);
    assert_eq!(first, a.vehicles());
}

#[test]
fn the_clock_and_every_result_start_at_zero() {
    let (net, c) = corridor(11.2, Control::Signal);
    let d = demand(&[(c.a[0], c.a[3], 900.0), (c.a[3], c.a[0], 800.0), (c.l[1], c.a[3], 200.0)]);
    let mut cf = cfg(2, 1.0);
    cf.select_links = vec![c.art[1].0];
    cf.record_trips = true;
    let s = Simulation::from_parts(net, d, cf).unwrap();
    let m = s.metrics();
    assert_eq!(s.time(), 0.0);
    assert!(m.initial_agents > 10 && m.vehicles_in_network > 10, "traffic on the streets at 0:00: {} placed, {} in network", m.initial_agents, m.vehicles_in_network);
    // The backlog at the gates is state, not a result: it carries over from the settle interval.
    assert_eq!((m.spawned, m.completed_trips, m.gridlock_removed, m.unroutable_trips), (0, 0, 0, 0));
    assert_eq!((m.veh_km, m.cut_through.veh_km, m.mean_trip_time, m.mean_trip_delay, m.arterial_mean_speed), (0.0, 0.0, 0.0, 0.0, 0.0));
    assert_eq!((m.safety.ttc_conflicts, m.safety.local_mean_speed), (0, 0.0));
    let d = s.diagnostics();
    assert!(d.link_exits.iter().all(|&x| x == 0) && d.link_stopped_s.iter().all(|&x| x == 0.0) && d.link_delay_s.iter().all(|&x| x == 0.0));
    assert!(s.link_stats().chunks(4).all(|c| c[0] == 0.0 && c[2] == 0.0));
    assert!(s.trip_records().is_empty() && s.debug_gridlock().is_empty());
    assert!(s.select_link_records().iter().all(|r| !r.completed));
    // Switched off: an empty network.
    let (net, c) = corridor(11.2, Control::Signal);
    let off = Simulation::from_parts(net, demand(&[(c.a[0], c.a[3], 900.0)]), Config { initial_load: false, ..cfg(2, 1.0) }).unwrap();
    assert_eq!((off.n_vehicles(), off.metrics().initial_agents, off.time()), (0, 0, 0.0));
}

/// Trips placed at time zero are partial: they count as completed trips and flow, never in the means.
#[test]
fn placed_trips_are_left_out_of_the_trip_time_statistics() {
    let (net, _f, dest) = line_net(13.4, 400.0);
    let mut s = Simulation::from_parts(net, demand(&[(0, dest, 600.0)]), cfg(4, 1.0)).unwrap();
    let placed = s.metrics().initial_agents;
    assert!(placed >= 5, "{placed}");
    // Free-flow trip time is 59.7 s: a partial trip placed mid-route finishes sooner, so a mean at or above it holds only full trips.
    run(&mut s, 50.0, |_| {});
    let m = s.metrics();
    assert!(m.completed_trips >= placed / 2, "placed trips completing count as flow: {} of {placed}", m.completed_trips);
    run(&mut s, 400.0, |_| {});
    let m = s.metrics();
    assert!(m.completed_trips as f64 > 60.0);
    assert!(m.mean_trip_time >= 59.0, "mean trip time {} s includes a partial trip", m.mean_trip_time);
    assert!(m.modes.car.mean_trip_time >= 59.0);
    assert!(m.mean_trip_delay > -1.0 && m.mean_trip_delay < 15.0, "delay {}", m.mean_trip_delay);
}

#[test]
fn cyclists_and_pedestrians_are_placed_too() {
    let net = super::modes::street_net_for_initial();
    let flows = [(0, 2, 40.0, FlowMode::Car), (0, 2, 600.0, FlowMode::Bicycle), (0, 2, 600.0, FlowMode::Pedestrian)];
    let s = super::modes::sim_with(net, &flows, cfg(3, 1.0));
    let m = s.metrics();
    assert!(m.modes.bicycle.in_network > 5 && m.modes.pedestrian.in_network > 20, "{:?}", m.modes);
    assert!(m.initial_agents >= m.modes.bicycle.in_network + m.modes.pedestrian.in_network);
    assert_eq!((m.modes.bicycle.completed_trips, m.modes.pedestrian.completed_trips, m.modes.pedestrian.mean_crossing_delay), (0, 0, 0.0));
    let kinds: std::collections::BTreeSet<u32> = s.vehicles().chunks(6).map(|c| c[4] as u32).collect();
    assert!(kinds.contains(&2) && kinds.contains(&3), "{kinds:?}");
    s.check_invariants().unwrap();
}
