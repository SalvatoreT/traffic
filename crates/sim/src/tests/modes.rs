//! Tests for bicycles, pedestrians and the safety metrics (change multimodal-agents).

use super::*;
use crate::sim::injury_risk;

fn flows_m(flows: &[(u32, u32, f64, FlowMode)]) -> Demand {
    Demand {
        version: 1,
        area: "t".into(),
        periods: vec![Period {
            id: "p".into(),
            label: "p".into(),
            flows: flows.iter().map(|&(o, d, v, m)| Flow { origin: o, destination: d, veh_per_hour: v, mode: m }).collect(),
        }],
    }
}

pub(super) fn sim_with(net: Network, flows: &[(u32, u32, f64, FlowMode)], c: Config) -> Simulation {
    Simulation::from_parts(net, flows_m(flows), c).unwrap()
}

/// n0 - n1 - n2 straight street, `lanes` lanes each way. Links: 0 = n0->n1, 1 = n1->n0, 2 = n1->n2, 3 = n2->n1.
pub(super) fn street_net_for_initial() -> Network {
    street(300.0, 1, 11.2)
}

fn street(len: f64, lanes: u32, limit: f64) -> Network {
    let mut b = B::default();
    let n0 = b.node(0.0, 0.0, Control::Uncontrolled, true);
    let n1 = b.node(len, 0.0, Control::Uncontrolled, false);
    let n2 = b.node(2.0 * len, 0.0, Control::Uncontrolled, true);
    b.two_way(n0, n1, RoadClass::Residential, lanes, limit);
    b.two_way(n1, n2, RoadClass::Residential, lanes, limit);
    b.net()
}

// ------------------------------------------------------------------------------------------------ plumbing

#[test]
fn older_files_load_and_new_fields_parse() {
    let net_json = r#"{"nodes":[{"id":0,"x":0,"y":0,"control":"uncontrolled","gate":true},{"id":1,"x":100,"y":0,"control":"uncontrolled","gate":true,"markedCrossing":true}],
        "links":[{"id":0,"from":0,"to":1,"class":"residential","lanes":1,"speedLimit":10,"length":100,"geometry":[[0,0],[100,0]],"bikeLane":true,"crossings":[50.0]},
                 {"id":1,"from":1,"to":0,"class":"motorway","lanes":1,"speedLimit":10,"length":100,"geometry":[[100,0],[0,0]]}]}"#;
    let dem_json = r#"{"periods":[{"id":"p","flows":[{"origin":0,"destination":1,"vehPerHour":100},{"origin":0,"destination":1,"vehPerHour":50,"mode":"pedestrian"},{"origin":0,"destination":1,"vehPerHour":20,"mode":"bicycle"}]}]}"#;
    let sim = Simulation::new(net_json, dem_json, r#"{"period":"p"}"#).expect("three-argument constructor still works");
    assert_eq!(sim.n_links(), 2);
    let d: Demand = serde_json::from_str(dem_json).unwrap();
    assert_eq!(d.periods[0].flows[0].mode, FlowMode::Car, "no mode means car");
    assert_eq!(d.periods[0].flows[1].mode, FlowMode::Pedestrian);
    let n: Network = serde_json::from_str(net_json).unwrap();
    assert!(n.links[0].has_sidewalk() && !n.links[1].has_sidewalk(), "sidewalk defaults to true except on motorways");
    assert!(n.links[0].bike_lane && !n.links[1].bike_lane && n.nodes[1].marked_crossing);
}

#[test]
fn metrics_carry_the_per_mode_and_vulnerable_sections() {
    let (net, f, dest) = line_net(11.2, 300.0);
    let mut sim = empty_sim(net);
    sim.test_place(f, 0, 50.0, 5.0, dest, false);
    run(&mut sim, 10.0, |_| {});
    let v: serde_json::Value = serde_json::from_str(&sim.metrics_json()).unwrap();
    for k in ["car", "bicycle", "pedestrian"] {
        assert!(v["modes"][k]["inNetwork"].is_number(), "modes.{k}.inNetwork");
    }
    assert!(v["modes"]["car"]["completedTrips"].is_number() && v["modes"]["car"]["meanTripTime"].is_number());
    assert!(v["modes"].get("bus").is_none() && v.get("busRunsBlocked").is_none(), "buses are not simulated");
    assert!(v["modes"]["bicycle"]["completedTrips"].is_number() && v["modes"]["pedestrian"]["meanCrossingDelay"].is_number());
    for k in ["pedConflicts", "bikeConflicts", "closePasses", "pedInjuryRiskIndex", "bikeInjuryRiskIndex", "meanVehicleSpeedAtPedEncounter"] {
        assert!(v["vulnerable"][k].is_number(), "vulnerable.{k}");
    }
    assert_eq!(v["modes"]["car"]["inNetwork"], 1);
    assert_eq!(sim.vehicles()[4], 0.0, "kind 0 for a car");
}

#[test]
fn injury_risk_follows_tefft_points() {
    let mph = |m: f32| m / 2.236_936;
    for (v, r) in [(17.1, 0.10), (24.9, 0.25), (33.0, 0.50), (40.8, 0.75), (48.1, 0.90)] {
        assert!((injury_risk(mph(v)) - r).abs() < 1e-3, "{v} mph");
    }
    assert_eq!(injury_risk(0.0), 0.0);
    assert!(injury_risk(mph(8.0)) < 0.10 && injury_risk(mph(8.0)) > 0.0);
    assert!(injury_risk(mph(100.0)) <= 1.0);
    let mut last = 0.0;
    for i in 1..80 {
        let r = injury_risk(i as f32 * 0.5);
        assert!(r >= last);
        last = r;
    }
}

#[test]
fn bike_injury_risk_follows_lubbe_points() {
    use crate::sim::injury_risk_bike;
    let mph = |m: f32| m / 2.236_936;
    for (v, r) in LUBBE_BIKE_MAIS3 {
        assert!((injury_risk_bike(mph(v)) - r).abs() < 1e-3, "{v} mph");
    }
    assert_eq!(injury_risk_bike(0.0), 0.0);
    assert!(injury_risk_bike(mph(100.0)) <= 1.0);
    assert!(injury_risk_bike(mph(30.0)) < injury_risk(mph(30.0)), "cyclists are less vulnerable than pedestrians at 30 mph");
}

// ------------------------------------------------------------------------------------------------ bicycles

fn bike_street(lanes: u32, bike_lane: bool) -> Network {
    let mut net = street(600.0, lanes, 11.2);
    for l in net.links.iter_mut() {
        l.bike_lane = bike_lane;
    }
    net
}

#[test]
fn cyclists_ride_at_their_own_speeds_and_arrive() {
    let (n0, n2) = (0u32, 2u32);
    let mut sim = sim_with(bike_street(1, false), &[(n0, n2, 120.0, FlowMode::Bicycle)], cfg(2, 1.0));
    let mut speeds: Vec<f32> = Vec::new();
    run(&mut sim, 1500.0, |s| {
        for b in s.test_kind(2) {
            if b.2 > 100.0 && b.2 < 400.0 {
                speeds.push(b.3);
            }
        }
    });
    let m = sim.metrics();
    assert!(m.modes.bicycle.completed_trips > 10, "{}", m.modes.bicycle.completed_trips);
    let mean = speeds.iter().sum::<f32>() / speeds.len() as f32;
    assert!(mean > 3.0 && mean < 6.5, "cyclist cruising speed {mean}");
    assert!(speeds.iter().cloned().fold(0.0, f32::max) <= BIKE_V_MAX as f32 + 0.2);
    assert!(m.modes.bicycle.mean_trip_time > 1200.0 / 6.5 && m.modes.bicycle.mean_trip_time < 1200.0 / 3.0, "{}", m.modes.bicycle.mean_trip_time);
    // Motor-vehicle aggregates do not count cyclists.
    assert_eq!(m.spawned, 0);
    assert_eq!(m.completed_trips, 0);
    assert_eq!(m.vehicles_in_network, 0);
    assert_eq!(sim.link_stats().iter().step_by(4).sum::<f32>(), 0.0, "link flows are motor vehicles only");
    assert!(sim.vehicles().chunks(6).all(|c| c[4] == 2.0));
}

/// Cyclist at 100 m on the single-lane street; a car approaches from behind.
fn shared_street_setup(oncoming_x: Option<f32>, lanes: u32, limit: f64) -> (Simulation, u32, u32) {
    let mut sim = empty_sim(street(600.0, lanes, limit));
    sim.test_place_bike(0, 100.0, 4.5, 2);
    let bike_uid = sim.test_kind(2)[0].0;
    if let Some(x0) = oncoming_x {
        // A line of stationary oncoming vehicles on the reverse link, 30 m apart from this link-0 coordinate on.
        let mut x = x0;
        while x < 560.0 {
            sim.test_place(1, 0, 600.0 - x, 0.0, 0, true);
            x += 30.0;
        }
    }
    let car = sim.test_place(0, 0, 60.0, 4.5, 2, false);
    sim.test_set_drv(car, 1.0);
    (sim, car, bike_uid)
}

#[test]
fn car_follows_a_cyclist_until_oncoming_traffic_allows_a_pass() {
    // Oncoming vehicle 35 m beyond the car's decision point: blocked.
    let (mut sim, car, _) = shared_street_setup(Some(96.0), 1, 11.2);
    let mut min_gap_ok = true;
    run(&mut sim, 14.0, |s| {
        let c = s.test_veh(car);
        let b = s.test_kind(2)[0];
        if c.1 > b.2 {
            min_gap_ok = false;
        }
    });
    let v_end = sim.test_veh(car).2;
    assert!(v_end < 5.5, "car held to the cyclist's speed: {v_end}");
    assert!(min_gap_ok, "no overtaking while the opposing lane is occupied");
    assert_eq!(sim.metrics().vulnerable.close_passes, 0);
    // Without oncoming traffic the car passes.
    let (mut sim, car, _) = shared_street_setup(None, 1, 11.2);
    let mut passed = false;
    run(&mut sim, 20.0, |s| {
        if let Some(b) = s.test_kind(2).first() {
            let c = s.test_veh(car);
            if c.0 == b.1 && c.1 > b.2 + 2.0 {
                passed = true;
            }
        }
    });
    assert!(passed, "car overtakes when the opposing lane is clear");
    assert!(sim.metrics().vulnerable.bike_injury_risk_index > 0.0, "the pass is an encounter");
}

#[test]
fn passing_is_free_when_the_link_has_two_lanes() {
    // Same oncoming blockage as the single-lane case, but a second lane in the car's direction.
    let (mut sim, car, _) = shared_street_setup(Some(96.0), 2, 11.2);
    let (mut passed, mut max_v) = (false, 0.0f32);
    run(&mut sim, 15.0, |s| {
        let c = s.test_veh(car);
        max_v = max_v.max(c.2);
        if let Some(b) = s.test_kind(2).first() {
            passed |= c.0 == b.1 && c.1 > b.2 + 2.0;
        }
    });
    assert!(passed, "the car passes in the adjacent lane");
    assert!(max_v > 9.0, "without slowing to the cyclist's speed: {max_v}");
}

#[test]
fn bike_lane_links_keep_cyclists_and_cars_apart() {
    let mut sim = empty_sim(bike_street(1, true));
    sim.test_place_bike(0, 100.0, 4.5, 2);
    sim.test_place(1, 0, 600.0 - 96.0, 0.0, 0, true);
    let car = sim.test_place(0, 0, 60.0, 4.5, 2, false);
    sim.test_set_drv(car, 1.0);
    let mut max_v = 0.0f32;
    run(&mut sim, 12.0, |s| max_v = max_v.max(s.test_veh(car).2));
    assert!(max_v > 9.0, "the car is not slowed by a cyclist in the bike lane: {max_v}");
    assert_eq!(sim.metrics().vulnerable.close_passes, 0);
    assert_eq!(sim.metrics().vulnerable.bike_injury_risk_index, 0.0, "no pass encounters on a separated lane");
}

#[test]
fn fast_passes_are_close_passes_and_slower_streets_have_fewer() {
    let run_with = |limit: f64| {
        let mut sim = empty_sim(street(600.0, 1, limit));
        for k in (0..6).rev() {
            sim.test_place_bike(0, 100.0 + 40.0 * k as f32, 4.5, 2);
            let c = sim.test_place(0, 0, 20.0 + 40.0 * k as f32, 4.0, 2, false);
            sim.test_set_drv(c, 1.0);
        }
        run(&mut sim, 25.0, |_| {});
        sim.metrics().vulnerable
    };
    let fast = run_with(17.0);
    let slow = run_with(6.0);
    assert!(fast.close_passes >= 1, "{}", fast.close_passes);
    assert!(fast.bike_injury_risk_index > slow.bike_injury_risk_index);
    assert!(fast.close_passes >= slow.close_passes);
    assert_eq!(slow.close_passes, 0);
}

#[test]
fn one_way_single_lane_passing_depends_on_lane_width() {
    let run_with = |width: f64| {
        let mut net = street(600.0, 1, 11.2);
        // Make link 0 one-way by dropping its reverse link from the network.
        net.links.truncate(1);
        net.links[0].reverse = None;
        let mut c = cfg(1, 1.0);
        c.lane_width_m = Some(width);
        let mut sim = Simulation::from_parts(net, demand(&[]), c).unwrap();
        sim.test_place_bike(0, 100.0, 4.5, 1);
        let car = sim.test_place(0, 0, 60.0, 4.5, 1, false);
        sim.test_set_drv(car, 1.0);
        let mut passed = false;
        let mut max_v = 0.0f32;
        for _ in 0..(15.0 / DT) as usize {
            sim.step(DT);
            let (c, b) = (sim.test_veh(car), sim.test_kind(2));
            max_v = max_v.max(c.2);
            if let Some(b) = b.first() {
                passed |= c.0 == b.1 && c.1 > b.2;
            }
        }
        (passed, max_v, sim.metrics().vulnerable.close_passes)
    };
    let (narrow_pass, _, narrow_close) = run_with(2.8);
    assert!(!narrow_pass && narrow_close == 0, "too narrow to pass");
    let (tight_pass, _, tight_close) = run_with(3.3);
    assert!(tight_pass && tight_close == 1, "passes with little lateral room count as close passes");
    let (wide_pass, _, wide_close) = run_with(4.6);
    assert!(wide_pass && wide_close <= 1);
}

#[test]
fn modal_filters_block_cars_but_cyclists_still_travel_through() {
    let mut sim = sim_with(
        street(300.0, 1, 11.2),
        &[(0, 2, 200.0, FlowMode::Car), (0, 2, 100.0, FlowMode::Bicycle)],
        cfg(1, 1.0),
    );
    sim.set_interventions(&iv(r#"[{"type":"modal_filter","link":2}]"#)).unwrap();
    step_n(&mut sim, 1200.0);
    let m = sim.metrics();
    assert_eq!(m.completed_trips, 0, "no car gets through");
    assert!(m.modes.bicycle.completed_trips > 5, "cyclists do: {}", m.modes.bicycle.completed_trips);
    let mut s2 = sim_with(street(300.0, 1, 11.2), &[(0, 2, 100.0, FlowMode::Bicycle)], cfg(1, 1.0));
    s2.set_interventions(&iv(r#"[{"type":"modal_filter","node":1}]"#)).unwrap();
    step_n(&mut s2, 900.0);
    assert!(s2.metrics().modes.bicycle.completed_trips > 3, "also through a node filter");
}

#[test]
fn cyclists_obey_one_way_streets() {
    // Two parallel streets; the shorter one is made one-way against the trip.
    let mut b = B::default();
    let a = b.node(0.0, 0.0, Control::Uncontrolled, true);
    let c = b.node(400.0, 0.0, Control::Uncontrolled, true);
    let m = b.node(200.0, 150.0, Control::Uncontrolled, false);
    let (short_f, short_r) = b.two_way(a, c, RoadClass::Residential, 1, 11.2);
    b.two_way(a, m, RoadClass::Residential, 1, 11.2);
    b.two_way(m, c, RoadClass::Residential, 1, 11.2);
    let net = b.net();
    // one_way on the link c->a closes its reverse (a->c): the direct street is no longer available to a trip a->c.
    let ivs: Vec<Intervention> = serde_json::from_str(&iv(&format!(r#"[{{"type":"one_way","link":{short_r}}}]"#))).unwrap();
    let mut sim = sim_with(net, &[(a, c, 100.0, FlowMode::Bicycle)], Config { interventions: ivs, ..cfg(1, 1.0) });
    let mut on_short = false;
    run(&mut sim, 900.0, |s| {
        on_short |= s.test_kind(2).iter().any(|b| b.1 == short_f);
    });
    assert!(!on_short, "cyclists do not ride the closed direction");
    assert!(sim.metrics().modes.bicycle.completed_trips > 5, "they take the other street");
}

#[test]
fn cyclists_prefer_bike_lanes_and_avoid_motorways() {
    // Two equal streets, one with a bike lane.
    let mut b = B::default();
    let a = b.node(0.0, 0.0, Control::Uncontrolled, true);
    let c = b.node(400.0, 0.0, Control::Uncontrolled, true);
    let m = b.node(200.0, 60.0, Control::Uncontrolled, false);
    let (plain_f, _) = b.two_way(a, c, RoadClass::Secondary, 1, 11.2);
    let (lane_f, _) = b.two_way(a, m, RoadClass::Residential, 1, 11.2);
    b.two_way(m, c, RoadClass::Residential, 1, 11.2);
    b.links[lane_f as usize].bike_lane = true;
    let mut sim = sim_with(b.net(), &[(a, c, 100.0, FlowMode::Bicycle)], cfg(1, 1.0));
    let (mut lane_used, mut plain_used) = (false, false);
    run(&mut sim, 600.0, |s| {
        for b in s.test_kind(2) {
            lane_used |= b.1 == lane_f;
            plain_used |= b.1 == plain_f;
        }
    });
    assert!(lane_used && !plain_used, "cyclists choose the bike-lane route over a busier road");
    // A motorway-only connection is unusable for cyclists.
    let mut b = B::default();
    let a = b.node(0.0, 0.0, Control::Uncontrolled, true);
    let c = b.node(300.0, 0.0, Control::Uncontrolled, true);
    b.two_way(a, c, RoadClass::Motorway, 2, 25.0);
    let mut sim = sim_with(b.net(), &[(a, c, 100.0, FlowMode::Bicycle)], cfg(1, 1.0));
    step_n(&mut sim, 300.0);
    assert_eq!(sim.metrics().modes.bicycle.in_network + sim.metrics().modes.bicycle.completed_trips, 0);
}

#[test]
fn cyclists_obey_signals_and_all_way_stops() {
    let trip = |ctrl: Control| {
        let (net, c) = cross4(ctrl, RoadClass::Residential, false);
        let mut sim = sim_with(net, &[(c.w, c.e, 90.0, FlowMode::Bicycle)], cfg(3, 1.0));
        let mut red_min_speed = f32::MAX;
        run(&mut sim, 1500.0, |s| {
            for b in s.test_kind(2) {
                if b.1 == c.w_in && b.2 > 186.0 {
                    red_min_speed = red_min_speed.min(b.3);
                }
            }
        });
        (sim.metrics().modes.bicycle.mean_trip_time, red_min_speed)
    };
    let (free, _) = trip(Control::Uncontrolled);
    let (signal, stopped) = trip(Control::Signal);
    let (awsc, _) = trip(Control::AllWayStop);
    assert!(signal > free + 5.0, "red signals delay cyclists: {signal} vs {free}");
    assert!(stopped < 0.3, "some cyclists stand at the stop line: {stopped}");
    assert!(awsc > free + 2.0, "all-way stops delay cyclists: {awsc} vs {free}");
}

#[test]
fn cyclists_and_cars_conflict_at_nodes_and_encounters_are_scored() {
    let (net, c) = cross4(Control::Uncontrolled, RoadClass::Residential, false);
    let flows = [
        (c.w, c.e, 500.0, FlowMode::Car),
        (c.e, c.w, 400.0, FlowMode::Car),
        (c.s, c.n, 300.0, FlowMode::Car),
        (c.s, c.n, 120.0, FlowMode::Bicycle),
        (c.n, c.s, 120.0, FlowMode::Bicycle),
        (c.w, c.e, 100.0, FlowMode::Bicycle),
    ];
    let mut sim = sim_with(net, &flows, cfg(4, 1.0));
    run(&mut sim, 1800.0, |_| {});
    let m = sim.metrics();
    assert!(m.modes.bicycle.completed_trips > 20);
    assert!(m.vulnerable.bike_injury_risk_index > 0.0, "encounters at the node are scored");
    assert!(m.vulnerable.bike_injury_risk_index < 1.0);
}

#[test]
fn traffic_circle_and_stop_changes_apply_to_cyclists() {
    let run_with = |ivs: &str| {
        let (net, c) = cross4(Control::Uncontrolled, RoadClass::Residential, false);
        let mut sim = sim_with(net, &[(c.w, c.e, 90.0, FlowMode::Bicycle)], cfg(3, 1.0));
        sim.set_interventions(&iv(ivs)).unwrap();
        step_n(&mut sim, 1500.0);
        sim.metrics().modes.bicycle.mean_trip_time
    };
    let base = run_with("[]");
    let stop = run_with(r#"[{"type":"control","node":0,"control":"all_way_stop"}]"#);
    assert!(stop > base + 2.0, "{stop} vs {base}");
}

// ------------------------------------------------------------------------------------------------ pedestrians

/// Signalized or other four-way node; every leg has sidewalks.
fn ped_cross(ctrl: Control, marked: bool) -> (Network, Cross) {
    let (mut net, c) = cross4(ctrl, RoadClass::Residential, false);
    net.nodes[c.c as usize].marked_crossing = marked;
    (net, c)
}

#[test]
fn pedestrians_walk_sidewalks_at_a_sampled_speed() {
    let mut sim = sim_with(street(300.0, 1, 11.2), &[(0, 2, 150.0, FlowMode::Pedestrian)], cfg(1, 1.0));
    run(&mut sim, 1500.0, |_| {});
    let m = sim.metrics();
    assert!(m.modes.pedestrian.completed_trips > 20, "{}", m.modes.pedestrian.completed_trips);
    // 600 m at 0.7-1.9 m/s with mean 1.3 m/s: about 460 s, and no crossing on a straight street.
    let t = m.modes.pedestrian.mean_trip_time;
    assert!(t > 600.0 / 1.9 && t < 600.0 / 0.9, "{t}");
    assert_eq!(m.modes.pedestrian.mean_crossing_delay, 0.0);
    assert_eq!(m.spawned, 0);
    assert_eq!(m.vehicles_in_network, 0);
    let v = sim.vehicles();
    assert!(v.chunks(6).all(|c| c[4] == 3.0), "pedestrians are kind 3");
    assert_eq!(v.len(), sim.n_vehicles() * 6);
}

#[test]
fn links_without_sidewalks_cannot_be_walked() {
    let mut net = street(300.0, 1, 11.2);
    for l in net.links.iter_mut() {
        l.sidewalk = Some(false);
    }
    let mut sim = sim_with(net, &[(0, 2, 150.0, FlowMode::Pedestrian)], cfg(1, 1.0));
    step_n(&mut sim, 600.0);
    let m = sim.metrics();
    assert_eq!(m.modes.pedestrian.completed_trips + m.modes.pedestrian.in_network, 0);
}

#[test]
fn pedestrians_render_beside_the_road() {
    let mut sim = empty_sim(street(300.0, 1, 11.2));
    sim.test_enable_peds();
    sim.test_spawn_ped(0, 2, 1.3);
    step_n(&mut sim, 20.0);
    let v = sim.vehicles();
    assert_eq!(v.len(), 6);
    let (x, y, kind) = (v[0], v[1], v[4]);
    assert_eq!(kind, 3.0);
    assert!(x > 10.0, "walked along");
    assert!(y.abs() > 3.0 && y.abs() < 12.0, "offset to the side of the carriageway: {y}");
}

#[test]
fn pedestrian_at_a_signal_crosses_with_the_phase_parallel_to_the_walk() {
    // W -> E along the south side crosses the minor street (S leg) at the signal.
    let (net, c) = ped_cross(Control::Signal, true);
    let mut sim = sim_with(net, &[(c.w, c.e, 200.0, FlowMode::Pedestrian), (c.w, c.e, 400.0, FlowMode::Car), (c.s, c.n, 200.0, FlowMode::Car)], cfg(2, 1.0));
    let mut starts = 0;
    let mut last = 0u32;
    let mut bad = 0;
    run(&mut sim, 1800.0, |s| {
        let now: u32 = s.test_xws().iter().filter(|x| x.0 == c.c).map(|x| x.2).sum();
        if now > last {
            starts += 1;
            let sig = s.signals();
            // The walked street (W-E) has green, the crossed street (S-N) does not.
            if sig[c.w_in as usize] != 1 || sig[c.s_in as usize] == 1 {
                bad += 1;
            }
        }
        last = now;
    });
    let m = sim.metrics();
    assert!(starts > 10, "pedestrians crossed: {starts}");
    assert_eq!(bad, 0, "crossings start only in the phase parallel to the walk");
    assert!(m.modes.pedestrian.mean_crossing_delay > 1.0, "they wait for the phase: {}", m.modes.pedestrian.mean_crossing_delay);
    assert!(m.modes.pedestrian.completed_trips > 20);
}

/// Street with one marked crossing at 200 m; xw index of the crossing.
fn mid_block() -> (Simulation, u32) {
    let mut net = street(400.0, 1, 11.2);
    net.links[0].crossings = vec![200.0];
    let mut c = cfg(1, 1.0);
    c.ped_yield_marked = Some(1.0);
    let mut sim = Simulation::from_parts(net, demand(&[]), c).unwrap();
    sim.test_enable_peds();
    let xw = sim.test_mid_xws()[0].1;
    (sim, xw)
}

#[test]
fn mid_block_crossings_are_listed_for_both_directions() {
    let (sim, xw) = mid_block();
    let mids = sim.test_mid_xws();
    assert_eq!(mids.len(), 2);
    assert!(mids.iter().all(|m| m.1 == xw));
    let (a, b) = (mids.iter().find(|m| m.0 == 0).unwrap(), mids.iter().find(|m| m.0 == 1).unwrap());
    assert!((a.2 - 200.0).abs() < 1.0 && (b.2 - 200.0).abs() < 1.0);
    let w = sim.test_xws().iter().find(|x| x.1 == xw as usize).unwrap().4;
    assert!((w - 2.0 * 3.3).abs() < 1e-3, "width is lanes x 3.3 m: {w}");
}

#[test]
fn driver_yields_at_a_marked_crossing_until_the_pedestrian_has_cleared() {
    let (mut sim, xw) = mid_block();
    sim.test_spawn_ped_mid(xw, 1.3);
    // Wait until the pedestrian stands at the crossing, then a car approaches it at 10 m/s.
    while sim.test_xws().iter().find(|x| x.1 == xw as usize).unwrap().3 == 0 {
        sim.step(DT);
    }
    let car = sim.test_place(0, 0, 160.0, 10.0, 2, false);
    sim.test_set_drv(car, 1.0);
    let (mut min_v_near, mut passed_during, mut crossing_seen) = (f32::MAX, false, false);
    let mut crossed_at = None;
    let mut cleared_at = None;
    let mut car_past_at = None;
    for _ in 0..(120.0 / DT) as usize {
        sim.step(DT);
        sim.check_invariants().unwrap();
        let st = sim.test_xws().into_iter().find(|x| x.1 == xw as usize).unwrap();
        let crossing = st.2 > 0;
        if crossing && crossed_at.is_none() {
            crossed_at = Some(sim.time());
        }
        if !crossing && crossed_at.is_some() && cleared_at.is_none() {
            cleared_at = Some(sim.time());
        }
        crossing_seen |= crossing;
        let c = sim.test_veh(car);
        if c.3 && c.0 == 0 && c.1 > 185.0 && c.1 < 198.0 {
            min_v_near = min_v_near.min(c.2);
        }
        let past = !c.3 || c.0 != 0 || c.1 > 200.0;
        if past && car_past_at.is_none() {
            car_past_at = Some(sim.time());
            if crossing {
                passed_during = true;
            }
        }
    }
    assert!(crossing_seen, "the pedestrian crossed");
    assert!(!passed_during, "the driver did not drive through the occupied crosswalk");
    assert!(min_v_near < 0.5, "the driver stopped short of the crosswalk: {min_v_near}");
    assert!(car_past_at.unwrap() >= cleared_at.unwrap() - 0.3, "the car moves on only after the pedestrian cleared");
    assert_eq!(sim.metrics().vulnerable.ped_conflicts, 0);
}

#[test]
fn without_yielding_the_pedestrian_waits_for_a_gap() {
    let mut net = street(400.0, 1, 11.2);
    net.links[0].crossings = vec![200.0];
    let mut c = cfg(1, 1.0);
    c.ped_yield_marked = Some(0.0);
    let mut sim = Simulation::from_parts(net, demand(&[]), c).unwrap();
    sim.test_enable_peds();
    let xw = sim.test_mid_xws()[0].1;
    sim.test_spawn_ped_mid(xw, 1.3);
    step_n(&mut sim, 140.0);
    // A platoon of three cars passes while the pedestrian waits.
    let cars: Vec<u32> = (0..3).map(|k| {
        let id = sim.test_place(0, 0, 60.0 - 30.0 * k as f32, 10.0, 2, false);
        sim.test_set_drv(id, 1.0);
        id
    }).collect();
    let mut min_cross_start = None;
    let mut last_car_pass = 0.0f64;
    let mut crossing_prev = false;
    for _ in 0..(90.0 / DT) as usize {
        sim.step(DT);
        for &id in &cars {
            let c = sim.test_veh(id);
            if c.3 && c.0 == 0 && c.1 < 202.0 {
                last_car_pass = sim.time();
            }
        }
        let crossing = sim.test_xws().iter().find(|x| x.1 == xw as usize).unwrap().2 > 0;
        if crossing && !crossing_prev && min_cross_start.is_none() {
            min_cross_start = Some(sim.time());
        }
        crossing_prev = crossing;
    }
    let started = min_cross_start.expect("pedestrian eventually crosses");
    assert!(started >= last_car_pass - 0.5, "pedestrian waited for the platoon: started {started}, last car before the crosswalk {last_car_pass}");
    let m = sim.metrics();
    assert!(m.modes.pedestrian.mean_crossing_delay > 4.0, "waited for the platoon: {}", m.modes.pedestrian.mean_crossing_delay);
}

#[test]
fn yielding_lowers_pedestrian_waits_and_vehicle_speeds_at_encounters() {
    let run_with = |p: f64, limit: Option<f64>| {
        let (net, c) = ped_cross(Control::Uncontrolled, true);
        let flows = [
            (c.s, c.n, 700.0, FlowMode::Car),
            (c.n, c.s, 600.0, FlowMode::Car),
            (c.w, c.e, 150.0, FlowMode::Pedestrian),
            (c.e, c.w, 150.0, FlowMode::Pedestrian),
        ];
        let mut cf = cfg(6, 1.0);
        cf.ped_yield_marked = Some(p);
        let mut sim = sim_with(net, &flows, cf);
        if let Some(l) = limit {
            let ivs: Vec<String> = [c.s_in, c.n_in].iter().map(|&k| format!(r#"{{"type":"speed_limit","link":{k},"speed":{l}}}"#)).collect();
            sim.set_interventions(&iv(&format!("[{}]", ivs.join(",")))).unwrap();
        }
        run(&mut sim, 2400.0, |_| {});
        sim.metrics()
    };
    let never = run_with(0.0, None);
    let always = run_with(1.0, None);
    assert!(never.modes.pedestrian.completed_trips > 20 && always.modes.pedestrian.completed_trips > 20);
    assert!(always.modes.pedestrian.mean_crossing_delay < never.modes.pedestrian.mean_crossing_delay, "{} vs {}", always.modes.pedestrian.mean_crossing_delay, never.modes.pedestrian.mean_crossing_delay);
    assert!(always.vulnerable.mean_vehicle_speed_at_ped_encounter <= never.vulnerable.mean_vehicle_speed_at_ped_encounter + 0.5);
    // Slower traffic past the crossing lowers the injury-risk index.
    let slow = run_with(0.0, Some(5.0));
    assert!(never.vulnerable.mean_vehicle_speed_at_ped_encounter > 0.0);
    assert!(slow.vulnerable.ped_injury_risk_index < never.vulnerable.ped_injury_risk_index, "{} vs {}", slow.vulnerable.ped_injury_risk_index, never.vulnerable.ped_injury_risk_index);
}

#[test]
fn signal_change_applies_to_pedestrian_crossings_and_filters_do_not_stop_walkers() {
    let run_with = |ivs: &str| {
        let (net, c) = ped_cross(Control::Uncontrolled, false);
        let flows = [(c.w, c.e, 200.0, FlowMode::Pedestrian), (c.s, c.n, 100.0, FlowMode::Car), (c.w, c.e, 100.0, FlowMode::Car)];
        let mut cf = cfg(2, 1.0);
        cf.ped_yield_unmarked = Some(1.0);
        let mut sim = sim_with(net, &flows, cf);
        sim.set_interventions(&iv(ivs)).unwrap();
        step_n(&mut sim, 1800.0);
        sim.metrics()
    };
    let open = run_with("[]");
    let signal = run_with(r#"[{"type":"control","node":0,"control":"signal"}]"#);
    assert!(signal.modes.pedestrian.mean_crossing_delay > open.modes.pedestrian.mean_crossing_delay + 2.0, "{} vs {}", signal.modes.pedestrian.mean_crossing_delay, open.modes.pedestrian.mean_crossing_delay);
    let filtered = run_with(r#"[{"type":"modal_filter","node":0}]"#);
    assert!(filtered.modes.pedestrian.completed_trips > 20, "pedestrians pass modal filters");
    assert_eq!(filtered.completed_trips, 0);
}

#[test]
fn a_two_leg_node_has_a_crosswalk_only_when_marked() {
    // Sidewalks on link 0 (n0 -> n1) and link 3 (n2 -> n1) only: a walk from n0 to n2 has to cross the street at n1.
    let run_with = |marked: bool| {
        let mut net = street(150.0, 1, 11.2);
        net.links[1].sidewalk = Some(false);
        net.links[2].sidewalk = Some(false);
        net.nodes[1].marked_crossing = marked;
        let mut sim = sim_with(net, &[(0, 2, 150.0, FlowMode::Pedestrian)], cfg(1, 1.0));
        step_n(&mut sim, 900.0);
        sim.metrics().modes.pedestrian
    };
    let (plain, marked) = (run_with(false), run_with(true));
    assert_eq!(plain.completed_trips + plain.in_network, 0, "a point along a street is not an intersection: no unmarked crosswalk [CVC275]");
    assert!(marked.completed_trips > 10, "{}", marked.completed_trips);
}

#[test]
fn a_yield_to_a_pedestrian_who_cannot_step_off_lapses() {
    // n0 - n1 - n2 with a marked crossing at n1 and sidewalks that make the walk from n0 to n2 cross there. A car from n0 is held
    // inside n1 because the lane beyond has no room, so the pedestrian cannot step off; a driver from n2 who yields to the
    // pedestrian would stand for good, and with it everything behind.
    let mut net = street(150.0, 1, 11.2);
    net.links[1].sidewalk = Some(false);
    net.links[2].sidewalk = Some(false);
    net.nodes[1].marked_crossing = true;
    let mut c = cfg_empty(1, 1.0);
    c.ped_yield_marked = Some(1.0);
    let mut sim = sim_with(net, &[(0, 2, 60.0, FlowMode::Pedestrian)], c);
    while sim.test_xws().iter().all(|x| x.3 == 0) {
        sim.step(DT);
    }
    // Too close to stop for the pedestrian, the first car enters the node; then the lane beyond fills up to the node.
    let held = sim.test_place(0, 0, 143.0, 8.0, 2, false);
    while sim.test_transit(1).is_empty() {
        sim.step(DT);
    }
    sim.test_place(2, 0, 11.0, 0.0, 2, true);
    let yielding = sim.test_place(3, 0, 100.0, 8.0, 0, false);
    let (mut in_node, mut stood, mut left_at) = (false, 0.0f64, None);
    for _ in 0..(120.0 / DT) as usize {
        sim.step(DT);
        in_node = !sim.test_transit(1).is_empty();
        let y = sim.test_veh(yielding);
        if y.3 && y.0 == 3 && y.2 < 0.2 {
            stood += DT;
        } else if (!y.3 || y.0 != 3) && left_at.is_none() {
            left_at = Some(sim.time());
        }
    }
    let _ = held;
    assert!(in_node, "the first car is still held inside the node");
    assert!(sim.test_xws().iter().any(|x| x.3 > 0), "the pedestrian is still waiting");
    assert!(stood > 40.0, "the driver yielded first: stood {stood} s");
    assert!(left_at.is_some(), "and went on after the bounded wait");
}

// ------------------------------------------------------------------------------------------------ all modes

fn all_modes_sim(seed: u64) -> Simulation {
    let (net, c) = ped_cross(Control::Signal, true);
    let flows = [
        (c.w, c.e, 450.0, FlowMode::Car),
        (c.e, c.w, 400.0, FlowMode::Car),
        (c.s, c.n, 150.0, FlowMode::Car),
        (c.w, c.e, 90.0, FlowMode::Bicycle),
        (c.n, c.s, 90.0, FlowMode::Bicycle),
        (c.w, c.e, 120.0, FlowMode::Pedestrian),
        (c.s, c.n, 120.0, FlowMode::Pedestrian),
    ];
    sim_with(net, &flows, cfg(seed, 1.0))
}

#[test]
fn all_modes_run_deterministically_and_keep_lanes_consistent() {
    let mut a = all_modes_sim(11);
    let mut b = all_modes_sim(11);
    let mut c = all_modes_sim(12);
    run(&mut a, 1500.0, |_| {});
    step_n(&mut b, 1500.0);
    step_n(&mut c, 1500.0);
    assert_eq!(a.metrics_json(), b.metrics_json());
    assert_eq!(a.vehicles(), b.vehicles());
    assert_ne!(a.metrics_json(), c.metrics_json());
    let m = a.metrics();
    assert!(m.modes.car.completed_trips > 50 && m.modes.bicycle.completed_trips > 5 && m.modes.pedestrian.completed_trips > 5, "{:?}", m.modes);
    // Existing fields are motor vehicles: cars.
    assert_eq!(m.completed_trips, m.modes.car.completed_trips);
    assert_eq!(m.vehicles_in_network, m.modes.car.in_network);
    let kinds: std::collections::BTreeSet<u32> = a.vehicles().chunks(6).map(|c| c[4] as u32).collect();
    assert!(kinds.contains(&0) && kinds.contains(&3), "{kinds:?}");
    // Reset reproduces the run.
    let first = a.metrics_json();
    a.reset();
    step_n(&mut a, 1500.0);
    assert_eq!(first, a.metrics_json());
}

#[test]
fn json_constructor_runs_all_modes() {
    let (net, c) = ped_cross(Control::Signal, true);
    let nj = serde_json::to_string(&net).unwrap();
    let dj = serde_json::to_string(&flows_m(&[(c.w, c.e, 100.0, FlowMode::Car), (c.w, c.e, 60.0, FlowMode::Pedestrian)])).unwrap();
    let mut sim = Simulation::new(&nj, &dj, r#"{"period":"p"}"#).unwrap();
    step_n(&mut sim, 900.0);
    assert!(sim.metrics().modes.pedestrian.completed_trips >= 2);
}

#[test]
#[ignore]
fn perf_all_modes_grid() {
    let mut b = B::default();
    let n = 14;
    let mut ids = vec![vec![0u32; n]; n];
    for i in 0..n {
        for j in 0..n {
            let gate = i == 0 || j == 0 || i == n - 1 || j == n - 1;
            let c = if gate { Control::Uncontrolled } else if (i + j) % 3 == 0 { Control::Signal } else { Control::AllWayStop };
            ids[i][j] = b.node(i as f64 * 120.0, j as f64 * 120.0, c, gate);
        }
    }
    for i in 0..n {
        for j in 0..n {
            let cls = if i % 4 == 0 || j % 4 == 0 { RoadClass::Secondary } else { RoadClass::Residential };
            let lanes = if cls == RoadClass::Secondary { 2 } else { 1 };
            if i + 1 < n {
                b.two_way(ids[i][j], ids[i + 1][j], cls, lanes, 11.2);
            }
            if j + 1 < n {
                b.two_way(ids[i][j], ids[i][j + 1], cls, lanes, 11.2);
            }
        }
    }
    let gates: Vec<u32> = b.nodes.iter().filter(|n| n.gate).map(|n| n.id).collect();
    let mut flows = vec![];
    for (k, &o) in gates.iter().enumerate() {
        for m in 0..6 {
            let d = gates[(k * 5 + 11 + m * 13) % gates.len()];
            if o != d {
                flows.push((o, d, 130.0, FlowMode::Car));
                flows.push((o, d, 25.0, FlowMode::Pedestrian));
                flows.push((o, d, 12.0, FlowMode::Bicycle));
            }
        }
    }
    let mut sim = sim_with(b.net(), &flows, cfg(1, 1.0));
    step_n(&mut sim, 900.0);
    let t0 = std::time::Instant::now();
    step_n(&mut sim, 300.0);
    let wall = t0.elapsed().as_secs_f64();
    let m = sim.metrics();
    println!("cars={} bikes={} peds={} speedup={:.1}x wall={:.2}s", m.modes.car.in_network, m.modes.bicycle.in_network, m.modes.pedestrian.in_network, 300.0 / wall, wall);
}

#[test]
fn humps_do_not_slow_cyclists() {
    let bike_time = |ivs: &str| {
        let mut s = sim_with(street(300.0, 1, 11.2), &[(0, 2, 100.0, FlowMode::Bicycle)], cfg(1, 1.0));
        s.set_interventions(&iv(ivs)).unwrap();
        step_n(&mut s, 1200.0);
        s.metrics().modes.bicycle.mean_trip_time
    };
    let base = bike_time("[]");
    let hump = bike_time(r#"[{"type":"speed_hump","link":0,"position":150.0},{"type":"speed_hump","link":2,"position":150.0}]"#);
    assert!((hump - base).abs() < 1.0, "cyclists ignore humps: {hump} vs {base}");
}
