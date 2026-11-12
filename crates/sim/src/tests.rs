//! Spec-scenario tests on small synthetic networks.

use crate::model::*;
use crate::params::*;
use crate::route::NO_NOISE;
use crate::sim::Simulation;
use std::collections::HashMap;

// ---------------------------------------------------------------- builders

#[derive(Default)]
struct B {
    nodes: Vec<Node>,
    links: Vec<Link>,
}

impl B {
    fn node(&mut self, x: f64, y: f64, control: Control, gate: bool) -> u32 {
        let id = self.nodes.len() as u32;
        self.nodes.push(Node { id, osm_id: id as i64, x, y, control, gate, in_study_area: true, marked_crossing: false, signal_timing: Vec::new() });
        id
    }

    fn link(&mut self, a: u32, b: u32, class: RoadClass, lanes: u32, limit: f64, stop: bool) -> u32 {
        let id = self.links.len() as u32;
        let (pa, pb) = (&self.nodes[a as usize], &self.nodes[b as usize]);
        let len = ((pb.x - pa.x).powi(2) + (pb.y - pa.y).powi(2)).sqrt();
        self.links.push(Link {
            id,
            osm_way_id: id as i64,
            from: a,
            to: b,
            reverse: None,
            name: format!("l{id}"),
            class,
            lanes,
            speed_limit: limit,
            length: len,
            geometry: vec![[pa.x, pa.y], [pb.x, pb.y]],
            stop_at_end: stop,
            humps: vec![],
            in_study_area: true,
            bike_lane: false,
            bike_route: false,
            sidewalk: None,
            crossings: vec![],
            left_lanes: 0,
            from_bearing: None,
            to_bearing: None,
        });
        id
    }

    /// Two-way street; returns (a->b, b->a).
    fn two_way(&mut self, a: u32, b: u32, class: RoadClass, lanes: u32, limit: f64) -> (u32, u32) {
        let f = self.link(a, b, class, lanes, limit, false);
        let r = self.link(b, a, class, lanes, limit, false);
        self.links[f as usize].reverse = Some(r);
        self.links[r as usize].reverse = Some(f);
        (f, r)
    }

    fn net(self) -> Network {
        Network { version: 1, id: "t".into(), name: "t".into(), nodes: self.nodes, links: self.links, turn_bans: Vec::new() }
    }
}

fn demand(flows: &[(u32, u32, f64)]) -> Demand {
    Demand {
        version: 1,
        area: "t".into(),
        periods: vec![Period {
            id: "p".into(),
            label: "p".into(),
            flows: flows.iter().map(|&(o, d, v)| Flow { origin: o, destination: d, veh_per_hour: v, mode: FlowMode::Car }).collect(),
        }],
    }
}

fn cfg(seed: u64, scale: f64) -> Config {
    Config { seed, period: "p".into(), demand_scale: scale, ..Default::default() }
}

#[allow(dead_code)]
struct Cross {
    c: u32,
    w: u32,
    e: u32,
    s: u32,
    n: u32,
    w_in: u32,
    w_out: u32,
    e_in: u32,
    e_out: u32,
    s_in: u32,
    s_out: u32,
    n_in: u32,
    n_out: u32,
}

/// Four-way intersection, 200 m legs. W/E secondary (major), S/N residential (minor).
fn cross4(ctrl: Control, minor_class: RoadClass, minor_stop: bool) -> (Network, Cross) {
    let mut b = B::default();
    let c = b.node(0.0, 0.0, ctrl, false);
    let w = b.node(-200.0, 0.0, Control::Uncontrolled, true);
    let e = b.node(200.0, 0.0, Control::Uncontrolled, true);
    let s = b.node(0.0, -200.0, Control::Uncontrolled, true);
    let n = b.node(0.0, 200.0, Control::Uncontrolled, true);
    let (w_in, w_out) = b.two_way(w, c, RoadClass::Secondary, 1, 11.2);
    let (e_in, e_out) = b.two_way(e, c, RoadClass::Secondary, 1, 11.2);
    let (s_in, s_out) = b.two_way(s, c, minor_class, 1, 11.2);
    let (n_in, n_out) = b.two_way(n, c, minor_class, 1, 11.2);
    // two_way(leg, c) returns (leg->c, c->leg)
    if minor_stop {
        b.links[s_in as usize].stop_at_end = true;
        b.links[n_in as usize].stop_at_end = true;
    }
    (b.net(), Cross { c, w, e, s, n, w_in, w_out, e_in, e_out, s_in, s_out, n_in, n_out })
}

struct Corr {
    a: [u32; 4],
    l: [u32; 4],
    art: Vec<(u32, u32)>,   // arterial links (fwd, rev)
    loc: Vec<(u32, u32)>,   // local row links
    conn: Vec<(u32, u32)>,  // connectors
}

/// Arterial row (y=0, gates at both ends) with a parallel residential row (y=120) and connectors.
fn corridor(art_limit: f64, art_ctrl: Control) -> (Network, Corr) {
    let mut b = B::default();
    let mut a = [0u32; 4];
    let mut l = [0u32; 4];
    for i in 0..4 {
        let gate = i == 0 || i == 3;
        let ctrl = if i == 1 || i == 2 { art_ctrl } else { Control::Uncontrolled };
        a[i] = b.node(250.0 * i as f64, 0.0, ctrl, gate);
    }
    for i in 0..4 {
        l[i] = b.node(250.0 * i as f64, 120.0, Control::Uncontrolled, false);
    }
    let mut art = vec![];
    let mut loc = vec![];
    let mut conn = vec![];
    for i in 0..3 {
        art.push(b.two_way(a[i], a[i + 1], RoadClass::Secondary, 1, art_limit));
        loc.push(b.two_way(l[i], l[i + 1], RoadClass::Residential, 1, 11.2));
    }
    for i in 0..4 {
        conn.push(b.two_way(a[i], l[i], RoadClass::Residential, 1, 11.2));
    }
    (b.net(), Corr { a, l, art, loc, conn })
}

fn step_n(sim: &mut Simulation, secs: f64) {
    let n = (secs / DT) as usize;
    for _ in 0..n {
        sim.step(DT);
    }
}

/// Step with per-step callback; also checks invariants.
fn run(sim: &mut Simulation, secs: f64, mut f: impl FnMut(&Simulation)) {
    let n = (secs / DT) as usize;
    for _ in 0..n {
        sim.step(DT);
        sim.check_invariants().unwrap();
        f(sim);
    }
}

/// Same as `cfg` but starting from an empty network: tests of one mechanism that need a known initial state, and the golden values.
fn cfg_empty(seed: u64, scale: f64) -> Config {
    Config { initial_load: false, ..cfg(seed, scale) }
}

fn empty_sim(net: Network) -> Simulation {
    Simulation::from_parts(net, demand(&[]), cfg_empty(1, 1.0)).unwrap()
}

// ---------------------------------------------------------------- turn restrictions

#[test]
fn osm_turn_ban_blocks_the_movement_and_respects_the_period() {
    use crate::eff::Eff;
    use crate::topo::Topo;
    let (mut net, x) = cross4(Control::Uncontrolled, RoadClass::Secondary, false);
    let allowed = |net: &Network| {
        let topo = Topo::new(net);
        let eff = Eff::derive(&topo, net, &[]);
        let i = topo.mvs.iter().position(|m| m.a == x.w_in && m.b == x.n_out).unwrap();
        eff.mv_ok[i]
    };
    assert!(allowed(&net));
    net.turn_bans.push(TurnBan { from: x.w_in, to: x.n_out, periods: vec![] });
    assert!(!allowed(&net));
    // Drivers detour through a dead-end U-turn at the east gate, so the trip takes longer; a ban for another period changes nothing.
    let d = demand(&[(x.w, x.n, 300.0)]);
    let mean_time = |net: Network| {
        let mut s = Simulation::from_parts(net, d.clone(), cfg(1, 1.0)).unwrap();
        step_n(&mut s, 600.0);
        let m = s.metrics();
        assert!(m.completed_trips > 20);
        m.mean_trip_time
    };
    let banned = mean_time(net.clone());
    net.turn_bans = vec![TurnBan { from: x.w_in, to: x.n_out, periods: vec!["other".into()] }];
    let other = mean_time(net.clone());
    net.turn_bans = vec![TurnBan { from: x.w_in, to: x.n_out, periods: vec!["p".into()] }];
    let same = mean_time(net);
    assert!(banned > other + 20.0, "{banned} vs {other}");
    assert!((same - banned).abs() < 1e-6);
}

// ---------------------------------------------------------------- car-following

fn line_net(limit: f64, len: f64) -> (Network, u32, u32) {
    let mut b = B::default();
    let n0 = b.node(0.0, 0.0, Control::Uncontrolled, true);
    let n1 = b.node(len, 0.0, Control::Uncontrolled, false);
    let n2 = b.node(2.0 * len, 0.0, Control::Uncontrolled, true);
    let (f, _) = b.two_way(n0, n1, RoadClass::Residential, 1, limit);
    b.two_way(n1, n2, RoadClass::Residential, 1, limit);
    (b.net(), f, n2)
}

#[test]
fn approaching_a_stopped_leader() {
    let (net, l0, dest) = line_net(13.4, 400.0);
    let mut sim = empty_sim(net);
    let lead = sim.test_place(l0, 0, 250.0, 0.0, dest, true);
    let foll = sim.test_place(l0, 0, 20.0, 12.0, dest, false);
    sim.test_set_drv(foll, 1.0);
    let mut prev_v = 12.0f32;
    let mut min_acc = 0.0f32;
    let mut min_gap = f32::MAX;
    run(&mut sim, 60.0, |s| {
        let (_, lp, _, _) = s.test_veh(lead);
        let (_, fp, fv, _) = s.test_veh(foll);
        let gap = lp - 4.5 - fp; // leader length is 4.5 for placed vehicles
        min_gap = min_gap.min(gap);
        min_acc = min_acc.min((fv - prev_v) / DT as f32);
        prev_v = fv;
    });
    let (_, _, fv, _) = sim.test_veh(foll);
    assert!(fv < 0.05, "follower should be stopped, v={fv}");
    assert!(min_gap > 0.5, "positive gap, min={min_gap}");
    assert!(min_acc > -4.5, "smooth deceleration, min acc={min_acc}");
}

#[test]
fn free_road_reaches_desired_speed() {
    let (net, l0, dest) = line_net(13.4, 1500.0);
    let mut sim = empty_sim(net);
    let v = sim.test_place(l0, 0, 10.0, 0.0, dest, false);
    sim.test_set_drv(v, 1.1);
    let mut vmax = 0.0f32;
    run(&mut sim, 100.0, |s| {
        vmax = vmax.max(s.test_veh(v).2);
    });
    let (_, pos, speed, _) = sim.test_veh(v);
    assert!(pos < 1400.0);
    assert!(vmax <= 13.4 * 1.1 + 0.01, "bounded by limit x compliance: {vmax}");
    assert!(speed > 0.97 * 13.4 * 1.1, "approaches desired speed: {speed}");
}

// ---------------------------------------------------------------- intersections

/// Two conflicting movements are never in the node at the same time at their shared conflict point: a merge onto one exit lane is
/// exclusive, and a crossing pair may overlap in the node only when neither vehicle is on the conflict point (front to tail) together.
fn assert_no_conflicting_transit(sim: &Simulation, node: usize) {
    let tr = sim.test_transit_progress(node);
    let topo = sim.test_topo();
    for i in 0..tr.len() {
        for j in 0..tr.len() {
            if i == j {
                continue;
            }
            let mi = topo.find_mv(tr[i].1, tr[i].2).unwrap();
            let mj = topo.find_mv(tr[j].1, tr[j].2).unwrap();
            if !topo.conflicts(mi, mj, false) {
                continue;
            }
            let pos_i = topo.conflict_pos(mj, mi, false);
            let pos_j = topo.conflict_pos(mi, mj, false);
            assert!(pos_i >= 0.0 && pos_j >= 0.0, "merging movements in node at once: {:?} {:?}", tr[i], tr[j]);
            let on = |t: &(u32, u32, u32, f32, f32), pos: f32, m: u32| t.3 >= pos && t.3 <= pos + t.4 / topo.mvs[m as usize].len.max(4.0);
            assert!(!(on(&tr[i], pos_i, mi) && on(&tr[j], pos_j, mj)), "two vehicles on one conflict point: {:?} {:?}", tr[i], tr[j]);
        }
    }
}

#[test]
fn red_signal_stops_then_proceeds() {
    let (net, x) = cross4(Control::Signal, RoadClass::Secondary, false);
    let mut sim = empty_sim(net);
    // Wait for the W approach to turn red.
    let mut guard = 0;
    while sim.signals()[x.w_in as usize] != 3 {
        sim.step(DT);
        guard += 1;
        assert!(guard < 2000, "signal never red");
    }
    let sigs = sim.signals();
    assert!(sigs[x.w_in as usize] == 3 && sigs[x.s_in as usize] != 0, "signals exported");
    let v = sim.test_place(x.w_in, 0, 80.0, 10.0, x.e, false);
    let stop_pos = sim.test_topo_stop(x.w_in);
    let mut stopped_at_line = false;
    let mut crossed_at: Option<f64> = None;
    let mut red_while_stopped = true;
    run(&mut sim, 140.0, |s| {
        let (l, pos, vel, alive) = s.test_veh(v);
        if alive && l == x.w_in && vel < 0.05 && pos > stop_pos - 3.0 {
            stopped_at_line = true;
            red_while_stopped &= s.signals()[x.w_in as usize] != 1 || crossed_at.is_some();
        }
        if crossed_at.is_none() && (!alive || l != x.w_in) {
            crossed_at = Some(s.time());
        }
    });
    assert!(stopped_at_line, "vehicle stops at the stop line on red");
    assert!(crossed_at.is_some(), "vehicle proceeds after green");
    assert_eq!(sim.test_stats().0, 0, "no entries on red");
}

#[test]
fn stop_sign_stops_then_enters_on_gap() {
    let (net, x) = cross4(Control::TwoWayStop, RoadClass::Residential, true);
    let d = demand(&[
        (x.w, x.e, 500.0),
        (x.e, x.w, 500.0),
        (x.s, x.n, 200.0),
        (x.n, x.s, 150.0),
    ]);
    let mut sim = Simulation::from_parts(net, d, cfg(3, 1.0)).unwrap();
    let node = x.c as usize;
    let stop_pos = sim.test_topo_stop(x.s_in);
    let mut stopped: HashMap<u32, bool> = HashMap::new();
    let mut seen: HashMap<u32, bool> = HashMap::new();
    let mut minor_crossings = 0;
    run(&mut sim, 900.0, |s| {
        for (uid, pos, v) in s.test_lane_vehicles(x.s_in).into_iter().chain(s.test_lane_vehicles(x.n_in)) {
            if v < QUEUE_V && pos > stop_pos - 60.0 {
                // A driver who slowed to queue speed behind another has met the stop rule: queued vehicles roll up to the line.
                stopped.insert(uid, true);
            }
        }
        assert_no_conflicting_transit(s, node);
        for (uid, a, _b) in s.test_transit(node) {
            if (a == x.s_in || a == x.n_in) && !seen.contains_key(&uid) {
                seen.insert(uid, true);
                minor_crossings += 1;
                assert!(stopped.get(&uid).copied().unwrap_or(false), "minor vehicle {uid} crossed without stopping");
            }
        }
    });
    assert!(minor_crossings > 20, "minor street traffic gets through ({minor_crossings})");
    let m = sim.metrics();
    assert!(m.completed_trips > 100);
}

#[test]
fn all_way_stop_is_fifo_one_at_a_time() {
    let (net, x) = cross4(Control::AllWayStop, RoadClass::Secondary, false);
    let mut sim = empty_sim(net);
    // Arrive at staggered distances so the stopping order is S, W, E, N.
    let s = sim.test_place(x.s_in, 0, 194.0 - 20.0 - 0.0, 8.0, x.n, false);
    let w = sim.test_place(x.w_in, 0, 194.0 - 45.0, 8.0, x.e, false);
    let e = sim.test_place(x.e_in, 0, 194.0 - 75.0, 8.0, x.w, false);
    let n = sim.test_place(x.n_in, 0, 194.0 - 105.0, 8.0, x.s, false);
    let ids = [s, w, e, n];
    let uids: Vec<u32> = ids.iter().map(|&i| sim.test_veh_uid(i)).collect();
    let mut stop_time: HashMap<u32, f64> = HashMap::new();
    let mut cross_time: HashMap<u32, f64> = HashMap::new();
    let node = x.c as usize;
    run(&mut sim, 90.0, |sm| {
        for l in [x.s_in, x.w_in, x.e_in, x.n_in] {
            let sp = sm.test_topo_stop(l);
            for (uid, pos, v) in sm.test_lane_vehicles(l) {
                if v < 0.2 && pos > sp - 5.0 {
                    stop_time.entry(uid).or_insert(sm.time());
                }
            }
        }
        assert_no_conflicting_transit(sm, node);
        for (uid, _, _) in sm.test_transit(node) {
            cross_time.entry(uid).or_insert(sm.time());
        }
    });
    assert_eq!(cross_time.len(), 4, "all vehicles cross");
    // Every conflicting pair crosses in stop order.
    let conflicts = [(0usize, 1usize), (0, 2), (0, 3), (1, 3), (2, 3), (1, 2)];
    let _ = conflicts;
    // S->N conflicts with W->E and E->W; N->S too; W->E vs E->W do not conflict.
    for (i, j) in [(0, 1), (0, 2), (3, 1), (3, 2), (0, 3)] {
        let (a, b) = (uids[i], uids[j]);
        let order_stop = stop_time[&a] < stop_time[&b];
        let order_cross = cross_time[&a] <= cross_time[&b];
        if (stop_time[&a] - stop_time[&b]).abs() > 0.3 {
            assert_eq!(order_stop, order_cross, "FIFO between {i} and {j}");
        }
    }
}

#[test]
fn uncontrolled_symmetric_conflict_resolves() {
    let mut b = B::default();
    let c = b.node(0.0, 0.0, Control::Uncontrolled, false);
    let w = b.node(-200.0, 0.0, Control::Uncontrolled, true);
    let e = b.node(200.0, 0.0, Control::Uncontrolled, true);
    let s = b.node(0.0, -200.0, Control::Uncontrolled, true);
    let n = b.node(0.0, 200.0, Control::Uncontrolled, true);
    let (wi, _) = b.two_way(w, c, RoadClass::Residential, 1, 11.2);
    let (ei, _) = b.two_way(e, c, RoadClass::Residential, 1, 11.2);
    let (si, _) = b.two_way(s, c, RoadClass::Residential, 1, 11.2);
    let (ni, _) = b.two_way(n, c, RoadClass::Residential, 1, 11.2);
    let mut sim = empty_sim(b.net());
    let ids = [
        sim.test_place(wi, 0, 160.0, 8.0, e, false),
        sim.test_place(ei, 0, 160.0, 8.0, w, false),
        sim.test_place(si, 0, 160.0, 8.0, n, false),
        sim.test_place(ni, 0, 160.0, 8.0, s, false),
    ];
    run(&mut sim, 120.0, |sm| assert_no_conflicting_transit(sm, c as usize));
    for id in ids {
        assert!(!sim.test_veh(id).3 || sim.test_veh(id).0 != wi, "all four eventually pass (bounded-wait fallback)");
    }
    assert_eq!(sim.metrics().vehicles_in_network, 0);
}

#[test]
fn no_entry_when_downstream_is_full() {
    let (net, x) = cross4(Control::Uncontrolled, RoadClass::Secondary, false);
    let mut sim = empty_sim(net);
    // Fill link C->E with frozen vehicles from its end back to its start.
    let mut p = 194.0;
    while p > 10.0 {
        sim.test_place(x.e_out, 0, p, 0.0, x.e, true);
        p -= 7.5;
    }
    // e_out is C->E per two_way(e, c) = (e->c, c->e)
    let v = sim.test_place(x.w_in, 0, 100.0, 10.0, x.e, false);
    let mut entered = false;
    run(&mut sim, 60.0, |s| {
        if !s.test_transit(x.c as usize).is_empty() {
            entered = true;
        }
    });
    let (l, pos, vel, alive) = sim.test_veh(v);
    assert!(!entered, "must not enter the node without downstream space");
    assert!(alive && l == x.w_in && vel < 0.1 && pos > 150.0, "waits at the stop line");
}

// ---------------------------------------------------------------- routing

#[test]
fn route_adapts_to_arterial_congestion() {
    let (net, c) = corridor(11.2, Control::Uncontrolled);
    let mut sim = Simulation::from_parts(net, demand(&[]), cfg(1, 1.0)).unwrap();
    let local: Vec<u32> = c.loc.iter().flat_map(|&(f, r)| [f, r]).collect();
    let base = sim.test_route_for(c.a[0], c.a[3], NO_NOISE).unwrap();
    assert!(base.iter().all(|l| !local.contains(l)), "free-flow route stays on the arterial");
    for &(f, r) in &c.art {
        sim.test_set_ema(f as usize, 400.0);
        sim.test_set_ema(r as usize, 400.0);
    }
    let alt = sim.test_route_for(c.a[0], c.a[3], NO_NOISE).unwrap();
    assert!(alt.iter().any(|l| local.contains(l)), "congested arterial pushes drivers to the local street");
}

#[test]
fn congestion_emerges_and_drivers_divert() {
    // Arterial intersections are all-way stops: capacity-limited, so measured travel times rise.
    let (net, c) = corridor(11.2, Control::AllWayStop);
    let d = demand(&[(c.a[0], c.a[3], 1100.0), (c.a[3], c.a[0], 1100.0)]);
    let mut sim = Simulation::from_parts(net, d, cfg(5, 1.0)).unwrap();
    step_n(&mut sim, 120.0);
    let early = sim.metrics().cut_through.veh_km;
    run(&mut sim, 1500.0, |_| {});
    let late = sim.metrics().cut_through.veh_km;
    assert!(late > early + 0.05, "later drivers choose the local street (early {early}, late {late})");
}

// ---------------------------------------------------------------- determinism and metrics

fn busy_corridor_with(seed: u64, initial_load: bool) -> Simulation {
    let (net, c) = corridor(6.0, Control::Uncontrolled);
    let d = demand(&[(c.a[0], c.a[3], 500.0), (c.a[3], c.a[0], 400.0), (c.l[1], c.a[3], 200.0)]);
    Simulation::from_parts(net, d, Config { initial_load, ..cfg(seed, 1.0) }).unwrap()
}

/// Empty start: the golden values below date from before initial loading.
fn busy_corridor(seed: u64) -> Simulation {
    busy_corridor_with(seed, false)
}

#[test]
fn repeat_run_is_identical() {
    let mut a = busy_corridor_with(7, true);
    let mut b = busy_corridor_with(7, true);
    let mut c = busy_corridor_with(8, true);
    step_n(&mut a, 3600.0);
    step_n(&mut b, 3600.0);
    step_n(&mut c, 3600.0);
    assert_eq!(a.metrics_json(), b.metrics_json());
    assert_ne!(a.metrics_json(), c.metrics_json());
    assert_eq!(a.vehicles(), b.vehicles());
    // Reset reproduces the run.
    let first = a.metrics_json();
    a.reset();
    step_n(&mut a, 3600.0);
    assert_eq!(first, a.metrics_json());
}

#[test]
fn cut_through_on_local_street() {
    let mut sim = busy_corridor(2);
    run(&mut sim, 900.0, |_| {});
    let m = sim.metrics();
    assert!(m.cut_through.veh_km > 0.1, "through trips use the residential row: {}", m.cut_through.veh_km);
    assert!(m.cut_through.share_of_local_veh_km > 0.0 && m.cut_through.share_of_local_veh_km <= 1.0);
    let stats = sim.link_stats();
    let (net, c) = corridor(6.0, Control::Uncontrolled);
    let _ = net;
    let ct: f32 = c.loc.iter().flat_map(|&(f, r)| [f, r]).map(|l| stats[l as usize * 4 + 2]).sum();
    assert!(ct > 0.0, "per-link cut-through flow reported");
    // Local-origin trips alone are not cut-through.
    let (net, c) = corridor(6.0, Control::Uncontrolled);
    let mut s2 = Simulation::from_parts(net, demand(&[(c.l[1], c.a[3], 300.0)]), cfg(1, 1.0)).unwrap();
    step_n(&mut s2, 600.0);
    assert_eq!(s2.metrics().cut_through.veh_km, 0.0);
}

#[test]
fn step_size_does_not_change_the_run() {
    let mut a = busy_corridor(2);
    let mut b = busy_corridor(2);
    for _ in 0..(1200 * 4) {
        a.step(0.25);
    }
    for _ in 0..80 {
        b.step(15.0);
    }
    assert_eq!(a.time(), b.time());
    assert_eq!(a.metrics_json(), b.metrics_json());
    assert_eq!(a.run_link_stats(), b.run_link_stats());
}

#[test]
fn run_link_stats_average_the_whole_run() {
    let mut sim = busy_corridor(2);
    let (net, c) = corridor(6.0, Control::Uncontrolled);
    let _ = net;
    let rate = |sim: &Simulation| -> f32 { c.loc.iter().flat_map(|&(f, r)| [f, r]).map(|l| sim.run_link_stats()[l as usize * 4 + 2]).sum() };
    let mut seen = Vec::new();
    for _ in 0..6 {
        run(&mut sim, 300.0, |_| {});
        seen.push(rate(&sim));
    }
    assert!(seen.iter().all(|&r| r > 0.0), "cut-through counted in every window: {seen:?}");
    // A cumulative average cannot swing the way a 5 min window does: later values stay near the previous one.
    for w in seen.windows(2).skip(1) {
        assert!((w[1] - w[0]).abs() <= 0.5 * w[0], "run-so-far rate moves steadily: {seen:?}");
    }
}

fn single_street(limit: f64) -> (Network, u32, u32) {
    let mut b = B::default();
    let n0 = b.node(0.0, 0.0, Control::Uncontrolled, true);
    let n1 = b.node(1000.0, 0.0, Control::Uncontrolled, true);
    let (f, _) = b.two_way(n0, n1, RoadClass::Residential, 1, limit);
    (b.net(), n0, n1.max(f))
}

#[test]
fn speeding_on_local_street_raises_share_above_25() {
    let run_with = |limit: f64| {
        let (net, n0, n1) = single_street(limit);
        let mut sim = Simulation::from_parts(net, demand(&[(n0, n1, 200.0)]), cfg(1, 1.0)).unwrap();
        step_n(&mut sim, 600.0);
        sim.metrics()
    };
    let fast = run_with(15.0);
    let slow = run_with(6.0);
    assert!(fast.safety.share_above_25mph > 0.4, "{}", fast.safety.share_above_25mph);
    assert!(fast.safety.share_above_20mph >= fast.safety.share_above_25mph);
    assert_eq!(slow.safety.share_above_25mph, 0.0);
    assert_eq!(slow.safety.share_above_20mph, 0.0);
    assert!(fast.safety.local_p85_speed > slow.safety.local_p85_speed);
    assert!(fast.safety.local_mean_speed > slow.safety.local_mean_speed);
}

#[test]
fn ttc_conflict_counted_once_per_episode() {
    let (net, l0, dest) = line_net(13.4, 400.0);
    let mut sim = empty_sim(net);
    sim.test_place(l0, 0, 100.0, 0.0, dest, true);
    let f = sim.test_place(l0, 0, 85.0, 12.0, dest, false);
    sim.test_set_drv(f, 1.0);
    run(&mut sim, 30.0, |_| {});
    assert_eq!(sim.metrics().safety.ttc_conflicts, 1);
    assert!(sim.test_veh(f).2 < 0.1);
}

#[test]
fn network_metrics_report() {
    let mut sim = busy_corridor(4);
    run(&mut sim, 1200.0, |_| {});
    let json = sim.metrics_json();
    for key in [
        "\"time\"", "\"vehiclesInNetwork\"", "\"spawned\"", "\"completedTrips\"", "\"backlog\"", "\"unroutableTrips\"",
        "\"meanTripTime\"", "\"meanTripDelay\"", "\"vehKm\"", "\"cutThrough\"", "\"shareOfLocalVehKm\"", "\"safety\"",
        "\"localMeanSpeed\"", "\"localP85Speed\"", "\"shareAbove20mph\"", "\"shareAbove25mph\"", "\"ttcConflicts\"",
        "\"arterialMeanSpeed\"",
    ] {
        assert!(json.contains(key), "missing {key}");
    }
    let m = sim.metrics();
    assert!(m.completed_trips > 50 && m.spawned >= m.completed_trips);
    assert!(m.mean_trip_time > 60.0 && m.mean_trip_delay > -5.0 && m.mean_trip_delay < m.mean_trip_time);
    assert!(m.veh_km > 5.0 && m.arterial_mean_speed > 0.0);
    assert!((m.time - 1200.0).abs() < 1e-6);
    let ls = sim.link_stats();
    assert_eq!(ls.len(), sim.n_links() * 4);
    assert!(ls.iter().step_by(4).any(|&f| f > 0.0), "link flows reported");
    assert_eq!(sim.vehicles().len(), sim.n_vehicles() * 6);
}

// ---------------------------------------------------------------- interventions

fn iv(json: &str) -> String {
    json.to_string()
}

#[test]
fn modal_filter_link_closes_and_reroutes_then_removal_restores() {
    let (net, c) = corridor(6.0, Control::Uncontrolled);
    let d = demand(&[(c.a[0], c.a[3], 500.0), (c.a[3], c.a[0], 400.0)]);
    let mut sim = Simulation::from_parts(net, d, cfg(9, 1.0)).unwrap();
    run(&mut sim, 300.0, |_| {});
    let (f, r) = c.loc[1];
    let filtered = iv(&format!("[{{\"type\":\"modal_filter\",\"link\":{f}}}]"));
    sim.set_interventions(&filtered).unwrap();
    run(&mut sim, 60.0, |_| {}); // vehicles already on the link may finish it
    let mut done = 0u64;
    run(&mut sim, 600.0, |s| {
        assert!(s.test_lane_vehicles(f).is_empty() && s.test_lane_vehicles(r).is_empty(), "no vehicle on filtered link");
        done = s.metrics().completed_trips;
    });
    assert!(done > 50, "affected trips re-route and complete ({done})");
    let before = sim.metrics().cut_through.veh_km;
    // Remove the intervention: behavior returns.
    sim.set_interventions("[]").unwrap();
    let mut used = false;
    run(&mut sim, 600.0, |s| {
        used |= !s.test_lane_vehicles(f).is_empty() || !s.test_lane_vehicles(r).is_empty();
    });
    assert!(used, "link is used again once the filter is removed");
    assert!(sim.metrics().cut_through.veh_km > before);
}

#[test]
fn modal_filter_node_bans_all_movements() {
    let (net, c) = corridor(6.0, Control::Uncontrolled);
    let d = demand(&[(c.a[0], c.a[3], 500.0), (c.a[3], c.a[0], 400.0)]);
    let mut sim = Simulation::from_parts(net, d, cfg(9, 1.0)).unwrap();
    sim.set_interventions(&iv(&format!("[{{\"type\":\"modal_filter\",\"node\":{}}}]", c.l[1]))).unwrap();
    run(&mut sim, 900.0, |s| {
        assert!(s.test_transit(c.l[1] as usize).is_empty(), "no through movement at a filtered node");
    });
    assert!(sim.metrics().completed_trips > 50);
}

#[test]
fn speed_hump_slows_locally_and_adds_travel_time() {
    let travel = |hump: bool| {
        let (net, l0, dest) = line_net(11.2, 400.0);
        let mut sim = empty_sim(net);
        if hump {
            sim.set_interventions(&format!("[{{\"type\":\"speed_hump\",\"link\":{l0},\"position\":200}}]")).unwrap();
        }
        let v = sim.test_place(l0, 0, 10.0, 11.0, dest, false);
        sim.test_set_drv(v, 1.0);
        let mut near_min = f32::MAX;
        let mut far_max = 0.0f32;
        let mut t_done = None;
        for _ in 0..(120.0 / DT) as usize {
            sim.step(DT);
            let (_, pos, vel, _) = sim.test_veh(v);
            if (pos - 200.0).abs() < 1.5 {
                near_min = near_min.min(vel);
            }
            if pos < 100.0 {
                far_max = far_max.max(vel);
            }
            if pos > 380.0 && t_done.is_none() {
                t_done = Some(sim.time());
            }
        }
        (near_min, far_max, t_done.unwrap())
    };
    let (n0, _f0, t0) = travel(false);
    let (n1, f1, t1) = travel(true);
    assert!(n0 > 9.0);
    assert!(n1 <= HUMP_V + 0.8, "slows to crossing speed at the hump ({n1})");
    assert!(f1 > 9.0, "unaffected far from the hump");
    assert!(t1 > t0 + 3.0, "link travel time increases ({t0} -> {t1})");
}

#[test]
fn baseline_humps_from_network_are_honoured() {
    let (mut net, l0, dest) = line_net(11.2, 400.0);
    net.links[l0 as usize].humps = vec![200.0];
    let mut sim = empty_sim(net);
    let v = sim.test_place(l0, 0, 10.0, 11.0, dest, false);
    sim.test_set_drv(v, 1.0);
    let mut near_min = f32::MAX;
    run(&mut sim, 60.0, |s| {
        let (_, pos, vel, _) = s.test_veh(v);
        if (pos - 200.0).abs() < 1.5 {
            near_min = near_min.min(vel);
        }
    });
    assert!(near_min <= HUMP_V + 0.8);
}

#[test]
fn speed_limit_change_applies_to_both_directions() {
    let (net, l0, dest) = line_net(13.4, 800.0);
    let mut sim = empty_sim(net);
    sim.set_interventions(&format!("[{{\"type\":\"speed_limit\",\"link\":{l0},\"speed\":6.0}}]")).unwrap();
    let rev = sim.test_topo_reverse(l0);
    assert_eq!(sim.test_eff().limit[l0 as usize], 6.0);
    assert_eq!(sim.test_eff().limit[rev as usize], 6.0);
    let v = sim.test_place(l0, 0, 10.0, 0.0, dest, false);
    sim.test_set_drv(v, 1.0);
    let mut vmax = 0.0f32;
    run(&mut sim, 60.0, |s| vmax = vmax.max(s.test_veh(v).2));
    assert!(vmax <= 6.0 + 0.01 && vmax > 5.5, "desired speed follows the new limit ({vmax})");
}

#[test]
fn traffic_circle_replaces_control_and_caps_speed() {
    let (net, x) = cross4(Control::Uncontrolled, RoadClass::Secondary, false);
    let d = demand(&[(x.w, x.e, 400.0), (x.s, x.n, 300.0), (x.e, x.s, 200.0)]);
    let mut sim = Simulation::from_parts(net, d, cfg(2, 1.0)).unwrap();
    sim.set_interventions(&format!("[{{\"type\":\"traffic_circle\",\"node\":{}}}]", x.c)).unwrap();
    assert_eq!(sim.test_eff().ctrl[x.c as usize], Control::TrafficCircle);
    let mut vmax = 0.0f32;
    let mut crossed = 0;
    run(&mut sim, 600.0, |s| {
        for v in s.test_transit_speeds(x.c as usize) {
            vmax = vmax.max(v);
        }
        crossed += s.test_transit(x.c as usize).len();
    });
    assert!(crossed > 0 && sim.metrics().completed_trips > 50);
    assert!(vmax <= V_CIRCLE + 0.01, "negotiation speed cap: {vmax}");
}

#[test]
fn observed_signal_timing_sets_cycle_and_green_of_the_approach() {
    let (mut net, x) = cross4(Control::Signal, RoadClass::Residential, false);
    net.nodes[x.c as usize].signal_timing = vec![SignalTiming { periods: vec!["p".into()], cycle_s: 79.0, greens: vec![ApproachGreen { links: vec![x.s_in], green_s: 4.0 }], source: "test".into() }];
    let d = demand(&[(x.w, x.e, 700.0), (x.e, x.w, 700.0), (x.s, x.n, 150.0), (x.n, x.s, 150.0)]);
    let mut sim = Simulation::from_parts(net.clone(), d, cfg(2, 1.0)).unwrap();
    {
        let p = sim.test_eff().sig[x.c as usize].as_ref().expect("signal plan");
        let ns = p.links.iter().position(|g| g.contains(&x.s_in)).unwrap();
        assert!((p.phases[ns].1 - 4.0).abs() < 0.01, "observed green: {:?}", p.phases);
        assert!((p.cycle - 79.0).abs() < 0.01, "observed cycle {}", p.cycle);
        assert!((p.phases[1 - ns].1 - 65.0).abs() < 0.01, "the other phase takes the rest: {:?}", p.phases);
    }
    // A run in another period uses the Webster plan.
    let d2 = demand(&[(x.w, x.e, 700.0)]);
    let mut c2 = cfg(2, 1.0);
    c2.period = "q".into();
    let mut d2 = d2;
    d2.periods[0].id = "q".into();
    let sim2 = Simulation::from_parts(net, d2, c2).unwrap();
    let p2 = sim2.test_eff().sig[x.c as usize].as_ref().unwrap();
    assert!(p2.cycle >= CYCLE_MIN && (p2.cycle - 79.0).abs() > 0.01);
    sim.set_interventions("[]").unwrap();
    let p3 = sim.test_eff().sig[x.c as usize].as_ref().unwrap();
    assert!((p3.cycle - 79.0).abs() < 0.01, "the observation survives a rebuild");
}

#[test]
fn stop_to_signal_runs_webster_plan() {
    let (net, x) = cross4(Control::TwoWayStop, RoadClass::Residential, true);
    let d = demand(&[(x.w, x.e, 700.0), (x.e, x.w, 700.0), (x.s, x.n, 150.0), (x.n, x.s, 150.0)]);
    let mut sim = Simulation::from_parts(net, d, cfg(2, 1.0)).unwrap();
    assert!(sim.test_eff().sig[x.c as usize].is_none());
    sim.set_interventions(&format!("[{{\"type\":\"control\",\"node\":{},\"control\":\"signal\"}}]", x.c)).unwrap();
    {
        let p = sim.test_eff().sig[x.c as usize].as_ref().expect("signal plan");
        assert!(p.cycle >= CYCLE_MIN && p.cycle <= CYCLE_MAX, "Webster cycle {}", p.cycle);
        assert_eq!(p.phases.len(), 2);
        // The heavily loaded E-W axis gets the longer green.
        let ew = p.links.iter().position(|g| g.contains(&x.w_in)).unwrap();
        let ns = 1 - ew;
        assert!(p.phases[ew].1 > p.phases[ns].1, "{:?}", p.phases);
    }
    let mut seen = [false; 4];
    run(&mut sim, 400.0, |s| {
        let sg = s.signals();
        seen[sg[x.w_in as usize] as usize] = true;
    });
    assert!(seen[1] && seen[2] && seen[3], "green, yellow and red all appear: {seen:?}");
    assert_eq!(sim.test_stats().0, 0);
    // signal_timing sets the cycle and re-derives splits.
    sim.set_interventions(&format!(
        "[{{\"type\":\"control\",\"node\":{c},\"control\":\"signal\"}},{{\"type\":\"signal_timing\",\"node\":{c},\"cycle\":120}}]",
        c = x.c
    ))
    .unwrap();
    let p = sim.test_eff().sig[x.c as usize].as_ref().unwrap();
    assert!((p.cycle - 120.0).abs() < 0.01);
    let total: f32 = p.phases.iter().map(|ph| ph.1 + YELLOW + ALL_RED).sum();
    assert!((total - 120.0).abs() < 0.01);
}

#[test]
fn one_way_closes_reverse_direction() {
    let (net, c) = corridor(6.0, Control::Uncontrolled);
    let d = demand(&[(c.a[0], c.a[3], 400.0), (c.a[3], c.a[0], 400.0)]);
    let (f, r) = c.loc[1];
    let ivs: Vec<Intervention> = serde_json::from_str(&iv(&format!("[{{\"type\":\"one_way\",\"link\":{f}}}]"))).unwrap();
    let mut sim = Simulation::from_parts(net, d, Config { interventions: ivs, ..cfg(9, 1.0) }).unwrap();
    assert!(sim.test_eff().closed[r as usize] && !sim.test_eff().closed[f as usize]);
    run(&mut sim, 900.0, |s| {
        assert!(s.test_lane_vehicles(r).is_empty());
    });
    let mut used = false;
    let mut s2 = sim;
    run(&mut s2, 300.0, |s| used |= !s.test_lane_vehicles(f).is_empty());
    assert!(used || s2.metrics().completed_trips > 0);
}

#[test]
fn turn_ban_is_respected_by_routes_and_vehicles() {
    let (net, c) = corridor(6.0, Control::Uncontrolled);
    let mut sim = Simulation::from_parts(net, demand(&[(c.a[0], c.a[3], 500.0)]), cfg(1, 1.0)).unwrap();
    // The preferred (slow arterial) route is avoided via the local row: ban the turn from connector into the local row.
    let base = sim.test_route_for(c.a[0], c.a[3], NO_NOISE).unwrap();
    let (conn_down, _) = c.conn[0]; // a0 -> l0
    let (loc_fwd, _) = c.loc[0]; // l0 -> l1
    let uses = |r: &[u32]| r.windows(2).any(|w| w[0] == conn_down && w[1] == loc_fwd);
    assert!(uses(&base), "baseline uses the turn");
    sim.set_interventions(&format!("[{{\"type\":\"turn_ban\",\"fromLink\":{conn_down},\"toLink\":{loc_fwd}}}]")).unwrap();
    let r = sim.test_route_for(c.a[0], c.a[3], NO_NOISE).unwrap();
    assert!(!uses(&r), "no route uses the banned turn");
    run(&mut sim, 600.0, |s| {
        for (_, a, b) in s.test_transit(c.l[0] as usize) {
            assert!(!(a == conn_down && b == loc_fwd));
        }
    });
    assert!(sim.metrics().completed_trips > 20);
}

#[test]
fn unroutable_trips_are_dropped_and_counted() {
    let (net, c) = corridor(6.0, Control::Uncontrolled);
    let mut sim = Simulation::from_parts(net, demand(&[(c.a[0], c.a[3], 500.0)]), cfg(1, 1.0)).unwrap();
    step_n(&mut sim, 120.0);
    assert_eq!(sim.metrics().unroutable_trips, 0);
    // Seal the destination side: filter both gate connectors at the far end and the arterial end.
    let (f, _) = c.art[2];
    let (g, _) = c.conn[3];
    sim.set_interventions(&format!(
        "[{{\"type\":\"modal_filter\",\"link\":{f}}},{{\"type\":\"modal_filter\",\"link\":{g}}}]"
    ))
    .unwrap();
    step_n(&mut sim, 300.0);
    let m = sim.metrics();
    assert!(m.unroutable_trips > 10, "{}", m.unroutable_trips);
    // Interventions JSON round trip with removal restores routing.
    sim.set_interventions("[]").unwrap();
    let before = sim.metrics().unroutable_trips;
    step_n(&mut sim, 300.0);
    assert_eq!(sim.metrics().unroutable_trips, before);
}

#[test]
fn origin_backlog_is_reported_when_entry_is_blocked() {
    let (net, x) = cross4(Control::Uncontrolled, RoadClass::Secondary, false);
    let mut sim = Simulation::from_parts(net, demand(&[(x.w, x.e, 600.0)]), cfg(1, 1.0)).unwrap();
    let mut p = 190.0;
    while p > 6.0 {
        sim.test_place(x.w_in, 0, p, 0.0, x.e, true);
        p -= 7.5;
    }
    step_n(&mut sim, 120.0);
    let m = sim.metrics();
    assert!(m.backlog > 10, "backlog {}", m.backlog);
}

#[test]
fn gridlock_breaker_unjams_and_counts() {
    let (net, x) = cross4(Control::Uncontrolled, RoadClass::Secondary, false);
    let mut sim = empty_sim(net);
    let mut p = 194.0;
    while p > 10.0 {
        sim.test_place(x.e_out, 0, p, 0.0, x.e, true);
        p -= 7.5;
    }
    sim.test_place(x.w_in, 0, 150.0, 5.0, x.e, false);
    step_n(&mut sim, GRIDLOCK_REMOVE_S as f64 + 60.0);
    assert_eq!(sim.metrics().gridlock_removed, 1);
}

// ---------------------------------------------------------------- invariants on a mixed grid

#[test]
fn grid_with_mixed_controls_has_no_overlaps() {
    let mut b = B::default();
    let ctrls = [Control::Signal, Control::AllWayStop, Control::TwoWayStop, Control::Uncontrolled, Control::TrafficCircle];
    let n = 5;
    let mut ids = vec![vec![0u32; n]; n];
    for i in 0..n {
        for j in 0..n {
            let gate = i == 0 || j == 0 || i == n - 1 || j == n - 1;
            let c = if gate { Control::Uncontrolled } else { ctrls[(i * n + j) % ctrls.len()] };
            ids[i][j] = b.node(i as f64 * 150.0, j as f64 * 150.0, c, gate);
        }
    }
    for i in 0..n {
        for j in 0..n {
            let cls = if j == 2 || i == 2 { RoadClass::Secondary } else { RoadClass::Residential };
            if i + 1 < n {
                b.two_way(ids[i][j], ids[i + 1][j], cls, if j == 2 { 2 } else { 1 }, 11.2);
            }
            if j + 1 < n {
                b.two_way(ids[i][j], ids[i][j + 1], cls, 1, 11.2);
            }
        }
    }
    for l in b.links.iter_mut() {
        l.stop_at_end = l.class == RoadClass::Residential;
    }
    let gates: Vec<u32> = b.nodes.iter().filter(|n| n.gate).map(|n| n.id).collect();
    let mut flows = vec![];
    for (k, &o) in gates.iter().enumerate() {
        let d = gates[(k * 7 + 5) % gates.len()];
        if o != d {
            flows.push((o, d, 150.0));
        }
    }
    let mut sim = Simulation::from_parts(b.net(), demand(&flows), cfg(11, 1.0)).unwrap();
    run(&mut sim, 1200.0, |_| {});
    let m = sim.metrics();
    assert!(m.completed_trips > 100, "{}", m.completed_trips);
    assert_eq!(m.gridlock_removed, 0, "no gridlock removals at moderate demand");
    assert_eq!(sim.test_stats().0, 0);
    assert_eq!(sim.test_stats().1, 0, "IDM never needed the hard overlap clamp");
}

#[test]
#[ignore]
fn perf_3000_vehicles() {
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
                flows.push((o, d, 130.0));
            }
        }
    }
    let mut sim = Simulation::from_parts(b.net(), demand(&flows), cfg(1, 1.0)).unwrap();
    step_n(&mut sim, 900.0);
    let t0 = std::time::Instant::now();
    let sim_secs = 300.0;
    step_n(&mut sim, sim_secs);
    let wall = t0.elapsed().as_secs_f64();
    let m = sim.metrics();
    println!(
        "vehicles={} speedup={:.1}x completed={} wall={:.2}s",
        m.vehicles_in_network,
        sim_secs / wall,
        m.completed_trips,
        wall
    );
}


// ---------------------------------------------------------------- select link

/// W - c - E straight street "Main", with a side street "Side" from S and a motorway-class stub at the W end.
fn select_net() -> (Network, u32, u32, u32, u32, u32) {
    let mut b = B::default();
    let w = b.node(-300.0, 0.0, Control::Uncontrolled, true);
    let c = b.node(0.0, 0.0, Control::Uncontrolled, false);
    let e = b.node(300.0, 0.0, Control::Uncontrolled, true);
    let s = b.node(0.0, -300.0, Control::Uncontrolled, true);
    let (we, ew) = b.two_way(w, c, RoadClass::Secondary, 1, 11.2);
    let (ce, ec) = b.two_way(c, e, RoadClass::Secondary, 1, 11.2);
    let (sc, cs) = b.two_way(s, c, RoadClass::Residential, 1, 11.2);
    for l in [we, ew, ce, ec] {
        b.links[l as usize].name = "Main".into();
    }
    for l in [sc, cs] {
        b.links[l as usize].name = "Side".into();
    }
    b.links[we as usize].class = RoadClass::Motorway; // west gate is a freeway gate
    b.links[ew as usize].class = RoadClass::Motorway;
    let _ = (ew, ec, cs);
    (b.net(), w, e, s, ce, sc)
}

#[test]
fn select_link_disabled_records_nothing() {
    let (net, w, e, _s, _ce, _sc) = select_net();
    let mut sim = Simulation::from_parts(net, demand(&[(w, e, 300.0)]), cfg(1, 1.0)).unwrap();
    sim.step(120.0);
    assert!(sim.select_link_records().is_empty());
}

#[test]
fn select_link_records_origin_destination_and_streets() {
    let (net, w, e, s, ce, _sc) = select_net();
    let mut c = cfg(3, 1.0);
    c.select_links = vec![ce]; // Main, c -> e
    // w->e passes ce; s->e passes ce after Side; s->w never touches ce.
    let mut sim = Simulation::from_parts(net, demand(&[(w, e, 300.0), (s, e, 300.0), (s, w, 300.0)]), c).unwrap();
    sim.step(300.0);
    let recs = sim.select_link_records();
    assert!(recs.len() > 20);
    assert!(recs.iter().all(|r| r.dest == e && r.hits.iter().any(|h| h.0 == ce)));
    let from_w: Vec<_> = recs.iter().filter(|r| r.origin == w && r.completed).collect();
    let from_s: Vec<_> = recs.iter().filter(|r| r.origin == s && r.completed).collect();
    assert!(!from_w.is_empty() && !from_s.is_empty());
    for r in &from_w {
        assert!(r.origin_freeway && !r.dest_freeway);
        let names: Vec<&str> = r.streets.iter().map(|x| x.name.as_str()).collect();
        assert_eq!(names, ["Main"]);
        assert_eq!(r.streets[0].dir, 'E');
        assert_eq!(r.hits[0].1, 0);
    }
    for r in &from_s {
        assert!(!r.origin_freeway);
        let names: Vec<&str> = r.streets.iter().map(|x| x.name.as_str()).collect();
        assert_eq!(names, ["Side", "Main"]);
        assert_eq!(r.streets[0].dir, 'N');
        // street visited before the nominated link: Side only
        assert_eq!(r.hits[0].1, 1);
    }
}

#[test]
fn select_link_in_flight_trips_include_planned_streets() {
    let (net, w, e, _s, ce, _sc) = select_net();
    let mut c = cfg_empty(5, 1.0);
    c.select_links = vec![0]; // first link w -> c
    let mut sim = Simulation::from_parts(net, demand(&[(w, e, 600.0)]), c).unwrap();
    sim.step(20.0);
    let recs = sim.select_link_records();
    assert!(!recs.is_empty());
    let _ = ce;
    let r = recs.iter().find(|r| !r.completed).expect("a trip still in the network");
    assert_eq!(r.streets.len(), 1);
    assert_eq!(r.streets[0].name, "Main");
}

// ---------------------------------------------------------------- capacity realism

/// Four-way signalized intersection; the W/E secondary legs have `lanes` lanes, S/N are residential.
fn sig_cross(lanes: u32) -> (Network, Cross) {
    let mut b = B::default();
    let c = b.node(0.0, 0.0, Control::Signal, false);
    let w = b.node(-300.0, 0.0, Control::Uncontrolled, true);
    let e = b.node(300.0, 0.0, Control::Uncontrolled, true);
    let s = b.node(0.0, -300.0, Control::Uncontrolled, true);
    let n = b.node(0.0, 300.0, Control::Uncontrolled, true);
    let (w_in, w_out) = b.two_way(w, c, RoadClass::Secondary, lanes, 11.2);
    let (e_in, e_out) = b.two_way(e, c, RoadClass::Secondary, lanes, 11.2);
    let (s_in, s_out) = b.two_way(s, c, RoadClass::Residential, 1, 11.2);
    let (n_in, n_out) = b.two_way(n, c, RoadClass::Residential, 1, 11.2);
    (b.net(), Cross { c, w, e, s, n, w_in, w_out, e_in, e_out, s_in, s_out, n_in, n_out })
}

#[test]
fn lane_choice_follows_the_movement_on_multilane_links() {
    // Uncontrolled node (no pocket): W->N is a left turn, W->S a right turn, on a 2-lane approach.
    let mut b = B::default();
    let c = b.node(0.0, 0.0, Control::Uncontrolled, false);
    let w = b.node(-300.0, 0.0, Control::Uncontrolled, true);
    let n = b.node(0.0, 300.0, Control::Uncontrolled, true);
    let s = b.node(0.0, -300.0, Control::Uncontrolled, true);
    let e = b.node(300.0, 0.0, Control::Uncontrolled, true);
    let (w_in, _) = b.two_way(w, c, RoadClass::Secondary, 2, 11.2);
    b.two_way(n, c, RoadClass::Secondary, 1, 11.2);
    b.two_way(s, c, RoadClass::Secondary, 1, 11.2);
    b.two_way(e, c, RoadClass::Secondary, 1, 11.2);
    let d = demand(&[(w, n, 120.0), (w, s, 120.0)]);
    let mut sim = Simulation::from_parts(b.net(), d, cfg(3, 1.0)).unwrap();
    let mut left_lanes = std::collections::HashSet::new();
    let mut right_lanes = std::collections::HashSet::new();
    for _ in 0..(300.0 / DT) as usize {
        sim.step(DT);
        for (uid, lane) in sim.test_lanes_of(w_in) {
            let dest = sim.test_dest_of_uid(uid);
            if dest == Some(n) {
                left_lanes.insert(lane);
            } else if dest == Some(s) {
                right_lanes.insert(lane);
            }
        }
    }
    assert_eq!(left_lanes, [0usize].into_iter().collect(), "left-turners use the inner lane");
    assert_eq!(right_lanes, [1usize].into_iter().collect(), "right-turners use the outer lane");
}

#[test]
fn left_pocket_exists_on_signalized_arterial_approaches_only() {
    let (net, x) = sig_cross(1);
    let sim = empty_sim(net);
    let t = sim.test_topo();
    assert!(t.pocket[x.w_in as usize] && t.pocket[x.e_in as usize], "secondary approach to a signal has a pocket");
    assert!(!t.pocket[x.s_in as usize], "residential approach has none");
    assert_eq!(t.nlanes(x.w_in as usize), 2);
}

#[test]
fn waiting_left_turner_in_the_pocket_does_not_block_through_traffic() {
    let (net, x) = sig_cross(1);
    let mut sim = empty_sim(net);
    // A frozen left-turner at the stop line of the pocket lane (index 1); a through vehicle behind it in lane 0.
    let stop = sim.test_topo_stop(x.w_in);
    sim.test_place(x.w_in, 1, stop - 0.5, 0.0, x.n, true);
    let thru = sim.test_place(x.w_in, 0, stop - 40.0, 8.0, x.e, false);
    run(&mut sim, 200.0, |_| {});
    assert!(!sim.test_veh(thru).3, "through vehicle completed its trip past the waiting left-turner");
}

#[test]
fn permissive_lefts_clear_against_heavy_opposing_flow() {
    let (net, x) = sig_cross(1);
    let d = demand(&[(x.w, x.n, 120.0), (x.e, x.w, 900.0), (x.s, x.n, 60.0)]);
    let mut sim = Simulation::from_parts(net, d, cfg(5, 1.0)).unwrap();
    step_n(&mut sim, 900.0);
    let recs = sim.metrics();
    assert!(recs.completed_trips > 150, "completed {}", recs.completed_trips);
    assert!(recs.backlog < 10, "backlog {}", recs.backlog);
    assert_eq!(recs.gridlock_removed, 0);
}

#[test]
fn uncontrolled_minor_class_yields_to_major() {
    let (net, x) = cross4(Control::Uncontrolled, RoadClass::Residential, false);
    let mut sim = empty_sim(net);
    let major = sim.test_place(x.w_in, 0, 150.0, 11.0, x.e, false);
    sim.test_place(x.s_in, 0, 150.0, 9.0, x.n, false);
    let mut min_v = f32::MAX;
    run(&mut sim, 40.0, |sm| {
        let (l, _, v, alive) = sm.test_veh(major);
        if alive && l == x.w_in {
            min_v = min_v.min(v);
        }
    });
    assert!(min_v > 6.0, "major-street vehicle slowed to {min_v} m/s for a minor-class vehicle");
}

#[test]
fn residential_perceived_cost_factor_moves_route_to_arterial() {
    let route_with = |factor: f64| {
        let (net, c) = corridor(5.0, Control::Uncontrolled);
        let conf = Config { local_cost_factor: Some(factor), ..cfg(1, 1.0) };
        let mut sim = Simulation::from_parts(net, demand(&[]), conf).unwrap();
        let r = sim.test_route_for(c.a[0], c.a[3], NO_NOISE).unwrap();
        r.iter().any(|l| c.art.iter().any(|&(f, rv)| *l == f || *l == rv))
    };
    assert!(!route_with(1.0), "slow arterial: the parallel local street is faster");
    assert!(route_with(2.5), "a high perceived-cost factor keeps drivers on the arterial");
}

#[test]
fn saturated_two_lane_approach_discharges_near_saturation_flow() {
    let (net, x) = sig_cross(2);
    let d = demand(&[(x.w, x.e, 4000.0)]);
    let mut sim = Simulation::from_parts(net, d, cfg(1, 1.0)).unwrap();
    step_n(&mut sim, 300.0);
    let c0 = sim.metrics().completed_trips;
    step_n(&mut sim, 1200.0);
    let c1 = sim.metrics().completed_trips;
    let rate = (c1 - c0) as f64 / 1200.0 * 3600.0;
    // 65 s of green in a 90 s cycle on 2 lanes: at most 2 x 2,000 (top of the observed 1,500 to 2,000 range [FHWA-SIG2004]) x 65/90 plus the yellow.
    assert!(rate > 1900.0 && rate < 3000.0, "discharge {rate} veh/h");
}

// ---------------------------------------------------------------- signal phasing and adaptation

/// Five-leg junction: Main (W-E), Diag (SW-NE, `skew` degrees off Main, two-way) and Cross (a single leg from the north).
fn skewed5(skew_deg: f64, named: bool) -> (Network, u32, Vec<(u32, &'static str)>) {
    let mut b = B::default();
    let c = b.node(0.0, 0.0, Control::Signal, false);
    let a = skew_deg.to_radians();
    let legs: [(f64, f64, &'static str); 5] =
        [(-200.0, 0.0, "Main"), (200.0, 0.0, "Main"), (200.0 * a.cos(), 200.0 * a.sin(), "Diag"), (-200.0 * a.cos(), -200.0 * a.sin(), "Diag"), (0.0, 200.0, "Cross")];
    let mut ins = Vec::new();
    for (x, y, name) in legs {
        let g = b.node(x, y, Control::Uncontrolled, true);
        let (l_in, l_out) = b.two_way(g, c, RoadClass::Secondary, 1, 11.2);
        if named {
            b.links[l_in as usize].name = name.into();
            b.links[l_out as usize].name = name.into();
        } else {
            b.links[l_in as usize].name = String::new();
            b.links[l_out as usize].name = String::new();
        }
        ins.push((l_in, name));
    }
    (b.net(), c, ins)
}

fn phase_of(p: &crate::eff::SigPlan, l: u32) -> usize {
    p.links.iter().position(|g| g.contains(&l)).expect("link in a phase")
}

#[test]
fn skewed_junction_phases_follow_street_names() {
    let (net, c, ins) = skewed5(35.0, true);
    let sim = Simulation::from_parts(net, demand(&[(1, 2, 300.0)]), cfg(1, 1.0)).unwrap();
    let p = sim.test_eff().sig[c as usize].as_ref().expect("plan");
    assert_eq!(p.phases.len(), 3, "three streets, three phases: {:?}", p.links);
    let ph: Vec<usize> = ins.iter().map(|&(l, _)| phase_of(p, l)).collect();
    assert_eq!(ph[0], ph[1], "both Main approaches together");
    assert_eq!(ph[2], ph[3], "both Diag approaches together");
    assert!(ph[0] != ph[2] && ph[0] != ph[4] && ph[2] != ph[4], "{ph:?}");
}

/// Merged five-leg junction (two carriageways of one avenue, two legs of a bending street, one diagonal street):
/// approaches share a phase only when their axes are within `PHASE_AXIS_DEG`, so crossing approaches never show green together.
#[test]
fn merged_five_leg_junction_never_gives_crossing_approaches_green_together() {
    let mut b = B::default();
    let c = b.node(0.0, 0.0, Control::Signal, false);
    // (bearing of the leg from the node, name)
    let legs: [(f64, &str); 5] = [(57.5, "Avenue"), (237.5, "Avenue"), (201.0, "Bend"), (270.0, "Bend"), (217.6, "Diagonal")];
    let mut ins = Vec::new();
    for (deg, name) in legs {
        let a = deg.to_radians();
        let g = b.node(200.0 * a.cos(), 200.0 * a.sin(), Control::Uncontrolled, true);
        let (l_in, l_out) = b.two_way(g, c, RoadClass::Secondary, 1, 11.2);
        b.links[l_in as usize].name = name.into();
        b.links[l_out as usize].name = name.into();
        ins.push(l_in);
    }
    let net = b.net();
    let mut sim = Simulation::from_parts(net, demand(&[(1, 2, 300.0)]), cfg(1, 1.0)).unwrap();
    let p = sim.test_eff().sig[c as usize].as_ref().expect("plan");
    assert!(!p.always_green && p.phases.len() >= 3, "{:?}", p.links);
    let head: Vec<f64> = ins.iter().map(|&l| sim.approach_heading(l)).collect();
    let axial = |a: f64, b: f64| {
        let d = (a - b).rem_euclid(std::f64::consts::PI);
        (if d > std::f64::consts::FRAC_PI_2 { std::f64::consts::PI - d } else { d }).to_degrees()
    };
    for (pi, g) in p.links.iter().enumerate() {
        for &x in g {
            for &y in g {
                let (i, j) = (ins.iter().position(|&l| l == x).unwrap(), ins.iter().position(|&l| l == y).unwrap());
                assert!(axial(head[i], head[j]) < PHASE_AXIS_DEG, "phase {pi} mixes crossing approaches: {:?}", p.links);
            }
        }
    }
    assert_eq!(phase_of(p, ins[0]), phase_of(p, ins[1]), "both Avenue carriageways together");
    let groups = p.links.clone();
    run(&mut sim, 600.0, |s| {
        let st = s.signals();
        for g1 in 0..groups.len() {
            for g2 in 0..g1 {
                let green = |g: &Vec<u32>| g.iter().any(|&l| st[l as usize] == 1);
                assert!(!(green(&groups[g1]) && green(&groups[g2])), "phases {g1} and {g2} green together at t={}", s.time());
            }
        }
    });
}

#[test]
fn unnamed_approaches_fall_back_to_bearing() {
    // 35 degrees off the main axis is a separate axis; 20 degrees is the same axis.
    let (net, c, _) = skewed5(35.0, false);
    let sim = Simulation::from_parts(net, demand(&[(1, 2, 300.0)]), cfg(1, 1.0)).unwrap();
    assert_eq!(sim.test_eff().sig[c as usize].as_ref().unwrap().phases.len(), 3);
    let (net, c, _) = skewed5(20.0, false);
    let sim = Simulation::from_parts(net, demand(&[(1, 2, 300.0)]), cfg(1, 1.0)).unwrap();
    assert_eq!(sim.test_eff().sig[c as usize].as_ref().unwrap().phases.len(), 2);
}

#[test]
fn adaptive_splits_follow_a_four_to_one_demand_imbalance() {
    let (net, x) = cross4(Control::Signal, RoadClass::Secondary, false);
    let d = demand(&[(x.w, x.e, 800.0), (x.e, x.w, 800.0), (x.s, x.n, 200.0), (x.n, x.s, 200.0)]);
    let mut sim = Simulation::from_parts(net, d, cfg(3, 1.0)).unwrap();
    step_n(&mut sim, 1200.0);
    let p = sim.test_eff().sig[x.c as usize].as_ref().unwrap();
    assert!(p.cycle >= CYCLE_MIN && p.cycle <= CYCLE_MAX, "cycle {}", p.cycle);
    let ew = phase_of(p, x.w_in);
    let ns = 1 - ew;
    assert!(p.phases[ew].1 > 2.5 * p.phases[ns].1, "heavy street gets a clearly longer green: {:?}", p.phases);
}

#[test]
fn adaptation_moves_green_to_the_street_that_now_carries_the_flow() {
    let (net, x) = cross4(Control::Signal, RoadClass::Secondary, false);
    let nl = net.links.len();
    let d = demand(&[(x.w, x.e, 800.0), (x.e, x.w, 800.0), (x.s, x.n, 200.0), (x.n, x.s, 200.0)]);
    let mut sim = Simulation::from_parts(net, d, cfg(3, 1.0)).unwrap();
    let ew = phase_of(sim.test_eff().sig[x.c as usize].as_ref().unwrap(), x.w_in);
    let mut flow = vec![0.0f32; nl];
    flow[x.s_in as usize] = 900.0;
    flow[x.n_in as usize] = 900.0;
    flow[x.w_in as usize] = 100.0;
    flow[x.e_in as usize] = 100.0;
    sim.test_adapt_with(&flow);
    step_n(&mut sim, 200.0); // the new plan starts at the end of the current cycle
    let p = sim.test_eff().sig[x.c as usize].as_ref().unwrap();
    assert!(p.phases[1 - ew].1 > 2.5 * p.phases[ew].1, "{:?}", p.phases);
    // No phase is cut short: yellow and all-red always follow a green.
    let mut prev = 0u8;
    let mut sim2 = sim;
    run(&mut sim2, 300.0, |s| {
        let st = s.signals()[x.w_in as usize];
        assert!(!(prev == 1 && st == 3), "green must be followed by yellow");
        prev = st;
    });
}

#[test]
fn pinned_cycle_survives_adaptation() {
    let (net, x) = cross4(Control::Signal, RoadClass::Secondary, false);
    let d = demand(&[(x.w, x.e, 800.0), (x.e, x.w, 800.0), (x.s, x.n, 200.0), (x.n, x.s, 200.0)]);
    let mut sim = Simulation::from_parts(net, d, cfg(3, 1.0)).unwrap();
    sim.set_interventions(&format!("[{{\"type\":\"signal_timing\",\"node\":{},\"cycle\":100}}]", x.c)).unwrap();
    step_n(&mut sim, 1500.0);
    let p = sim.test_eff().sig[x.c as usize].as_ref().unwrap();
    assert!((p.cycle - 100.0).abs() < 0.01, "cycle {}", p.cycle);
    let total: f32 = p.phases.iter().map(|ph| ph.1 + YELLOW + ALL_RED).sum();
    assert!((total - 100.0).abs() < 0.01);
}

#[test]
fn vehicles_queued_on_a_motorway_stub_wait_instead_of_being_removed() {
    let build = || {
        let mut b = B::default();
        let g = b.node(0.0, 0.0, Control::Uncontrolled, true);
        let d = b.node(150.0, 0.0, Control::Uncontrolled, false);
        let e = b.node(350.0, 0.0, Control::Uncontrolled, true);
        let stub = b.link(g, d, RoadClass::Motorway, 3, 29.0, false);
        let ramp = b.link(d, e, RoadClass::Motorway, 1, 15.6, false);
        (b.net(), stub, ramp, e)
    };
    let jam = |sim: &mut Simulation, stub: u32, ramp: u32, e: u32| {
        let mut p = 194.0;
        while p > 10.0 {
            sim.test_place(ramp, 0, p, 0.0, e, true);
            p -= 7.5;
        }
        sim.test_place(stub, 0, 100.0, 5.0, e, false)
    };
    let (net, stub, ramp, e) = build();
    let mut sim = empty_sim(net);
    let v = jam(&mut sim, stub, ramp, e);
    step_n(&mut sim, GRIDLOCK_REMOVE_S as f64 + 60.0);
    assert_eq!(sim.metrics().gridlock_removed, 0);
    assert!(sim.test_veh(v).3, "the queued vehicle is still in the network");
    let (net, stub, ramp, e) = build();
    let mut cfg = cfg(1, 1.0);
    cfg.motorway_gridlock_removal = true;
    let mut sim = Simulation::from_parts(net, demand(&[]), cfg).unwrap();
    jam(&mut sim, stub, ramp, e);
    step_n(&mut sim, GRIDLOCK_REMOVE_S as f64 + 60.0);
    assert_eq!(sim.metrics().gridlock_removed, 1);
}


// ---------------------------------------------------------------- validation-suite fixes

#[test]
fn turning_head_vehicle_keeps_speed_until_it_must_brake_for_the_turn() {
    // The kinematic turn-speed backstop used to hold any head vehicle with a turn ahead at the turn speed for the whole link.
    let (net, x) = cross4(Control::Uncontrolled, RoadClass::Secondary, false);
    let mut sim = empty_sim(net);
    let id = sim.test_place(x.w_in, 0, 5.0, 8.0, x.n, false);
    let mut v_mid = 0.0;
    run(&mut sim, 20.0, |s| {
        let (_, pos, v, alive) = s.test_veh(id);
        if alive && pos > 90.0 && pos < 100.0 {
            v_mid = v;
        }
    });
    assert!(v_mid > V_LEFT + 2.0, "speed {v_mid} m/s 100 m before a left turn (turn speed {V_LEFT})");
}

#[test]
fn free_link_accepts_close_to_its_car_following_capacity() {
    // Entry at a fixed 4 m/s capped every gate near 1,500 veh/h; the insertion speed now follows the leader's gap.
    let (flow, inserted) = crate::validate::link_flow(15.65, 1, RoadClass::Secondary, 1);
    let (cap, _) = crate::sim::equilibrium_capacity(15.65, 200, 1);
    assert!(flow > 0.85 * cap && inserted >= flow - 1.0, "flow {flow}, inserted {inserted}, equilibrium capacity {cap}");
}

#[test]
fn improved_idm_discharges_a_standing_queue_in_the_observed_saturation_range() {
    let (h, _l1, s, bursts) = crate::validate::sat_flow(1, 11.176);
    assert!(bursts >= 5.0);
    assert!(h > 1.8 && h < 2.4 && s > 1500.0 && s < 2000.0, "headway {h} s, saturation flow {s} veh/h/lane");
}

#[test]
fn queued_minor_street_vehicles_depart_at_the_follow_up_headway() {
    // Each queued driver used to stop again at the line (dwell plus a crawl): 6.5 s per vehicle against the HCM follow-up of 3.3 s.
    let flow = crate::validate::twsc(0, 1.0, 1);
    assert!(flow > 800.0, "minor right-turn discharge with no major flow {flow} veh/h");
}

#[test]
fn permissive_left_capacity_follows_the_gap_acceptance_formula() {
    // Opposing 500 veh/h: Harders capacity with tc 4.1 s and tf 2.2 s is about 1,070 per green hour; a crossing conflict no longer
    // holds the entering vehicle for the whole crossing.
    let (net, x) = crate::validate::cross(Control::Signal, RoadClass::Secondary, 1, RoadClass::Secondary, 1, false);
    let fl = [(x.w, x.n, 4000.0, FlowMode::Car), (x.s, x.n, 4000.0, FlowMode::Car), (x.n, x.s, 4000.0, FlowMode::Car), (x.e, x.w, 500.0, FlowMode::Car)];
    let mut r = crate::validate::Run::new(net, crate::validate::demand_m(&fl), cfg(1, 1.0));
    r.advance(1500.0);
    let rate = r.rate(&[x.w_in], 300.0, 1500.0);
    assert!(rate > 350.0, "left-turn discharge {rate} veh/h");
}

// ---------------------------------------------------------------- car-only regression (multimodal-agents)

fn golden_signal_cross() -> Simulation {
    let (net, c) = cross4(Control::Signal, RoadClass::Residential, false);
    let d = demand(&[(c.w, c.e, 400.0), (c.e, c.w, 350.0), (c.s, c.n, 150.0), (c.n, c.s, 120.0), (c.w, c.s, 80.0), (c.s, c.w, 60.0)]);
    Simulation::from_parts(net, d, cfg_empty(3, 1.0)).unwrap()
}

/// Metrics JSON with the multimodal sections removed, so it compares with the pre-multimodal output.
fn legacy_metrics(sim: &Simulation) -> String {
    let mut v: serde_json::Value = serde_json::from_str(&sim.metrics_json()).unwrap();
    let o = v.as_object_mut().unwrap();
    o.remove("modes");
    o.remove("vulnerable");
    o.remove("initialAgents");
    o.remove("initialSkipped");
    serde_json::to_string(&v).unwrap()
}

#[test]
fn car_only_metrics_match_pre_multimodal_golden() {
    let mut a = busy_corridor(7);
    step_n(&mut a, 1800.0);
    assert_eq!(legacy_metrics(&a), GOLDEN_CORRIDOR);
    let mut b = golden_signal_cross();
    step_n(&mut b, 1800.0);
    assert_eq!(legacy_metrics(&b), GOLDEN_CROSS);
}
const GOLDEN_CORRIDOR: &str = r#"{"arterialMeanSpeed":5.760706174508465,"backlog":0,"completedTrips":526,"cutThrough":{"shareOfLocalVehKm":0.7881007592928926,"vehKm":217.1792367334366},"gridlockRemoved":0,"meanTripDelay":2.533018145631116,"meanTripTime":103.9518968024608,"safety":{"localMeanSpeed":9.707236835622696,"localP85Speed":11.633705738054609,"shareAbove20mph":0.7119069644509053,"shareAbove25mph":0.2279635258358663,"ttcConflicts":3},"spawned":558,"time":1800.0,"unroutableTrips":0,"vehKm":438.9261624879838,"vehiclesInNetwork":32}"#;
// Updated when right turn on red was added (ASSUMPTION, validation cases b10 and b11): the w->s flow turns right on red, so mean delay falls from 13.4 to 13.1 s.
const GOLDEN_CROSS: &str = r#"{"arterialMeanSpeed":8.436836013936235,"backlog":0,"completedTrips":551,"cutThrough":{"shareOfLocalVehKm":1.0,"vehKm":64.3283925333023},"gridlockRemoved":0,"meanTripDelay":13.054209055272334,"meanTripTime":50.45862896291319,"safety":{"localMeanSpeed":6.385964968918798,"localP85Speed":11.4,"shareAbove20mph":0.4679799284578696,"shareAbove25mph":0.16921701112877582,"ttcConflicts":10},"spawned":572,"time":1800.0,"unroutableTrips":0,"vehKm":216.17522833824157,"vehiclesInNetwork":21}"#;

mod modes;
mod initial;
mod diverter;
mod route_choice;

/// Removing any intervention restores the baseline effective state and signal output, including after a reset that carried the old list.
#[test]
fn removing_each_intervention_restores_baseline() {
    let (net, x) = cross4(Control::TwoWayStop, RoadClass::Residential, true);
    let (net_sig, _) = cross4(Control::Signal, RoadClass::Residential, true);
    let d = || demand(&[(x.w, x.e, 400.0), (x.s, x.n, 200.0), (x.e, x.w, 300.0)]);
    let c = x.c;
    let cases: Vec<(&str, bool, String)> = vec![
        ("signal", false, format!("[{{\"type\":\"control\",\"node\":{c},\"control\":\"signal\"}}]")),
        ("circle", false, format!("[{{\"type\":\"traffic_circle\",\"node\":{c}}}]")),
        ("cycle", true, format!("[{{\"type\":\"signal_timing\",\"node\":{c},\"cycle\":150}}]")),
        ("limit", false, format!("[{{\"type\":\"speed_limit\",\"link\":{},\"speed\":5.0}}]", x.w_in)),
        ("hump", false, format!("[{{\"type\":\"speed_hump\",\"link\":{},\"position\":100}}]", x.w_in)),
        ("oneway", false, format!("[{{\"type\":\"one_way\",\"link\":{}}}]", x.w_in)),
        ("turnban", false, format!("[{{\"type\":\"turn_ban\",\"fromLink\":{},\"toLink\":{}}}]", x.w_in, x.n_out)),
        ("filter", false, format!("[{{\"type\":\"modal_filter\",\"link\":{}}}]", x.s_in)),
        ("diverter", false, format!("[{{\"type\":\"diagonal_diverter\",\"node\":{c},\"bearing\":45}}]")),
    ];
    for (name, signalized, json) in cases {
        for via_reset in [false, true] {
            let base_net = if signalized { net_sig.clone() } else { net.clone() };
            let mut base = Simulation::from_parts(base_net.clone(), d(), cfg(3, 1.0)).unwrap();
            let mut sim = Simulation::from_parts(base_net, d(), cfg(3, 1.0)).unwrap();
            sim.set_interventions(&json).unwrap();
            step_n(&mut sim, 60.0);
            if via_reset {
                sim.reset();
            }
            sim.set_interventions("[]").unwrap();
            step_n(&mut sim, 30.0);
            step_n(&mut base, 0.0);
            let (e, b) = (sim.test_eff(), base.test_eff());
            assert_eq!(e.ctrl, b.ctrl, "{name} ctrl");
            assert_eq!(e.closed, b.closed, "{name} closed");
            assert_eq!(e.limit, b.limit, "{name} limit");
            assert_eq!(e.humps, b.humps, "{name} humps");
            assert_eq!(e.node_filter, b.node_filter, "{name} node_filter");
            assert_eq!(e.mv_ok, b.mv_ok, "{name} mv_ok");
            assert_eq!(e.mv_banned, b.mv_banned, "{name} mv_banned");
            assert_eq!(e.oneway_closed, b.oneway_closed, "{name} oneway_closed");
            assert_eq!(e.cycle_override, b.cycle_override, "{name} cycle_override");
            assert_eq!(e.sig.iter().map(|s| s.is_some()).collect::<Vec<_>>(), b.sig.iter().map(|s| s.is_some()).collect::<Vec<_>>(), "{name} sig");
            if !signalized {
                assert!(sim.signals().iter().all(|&s| s == 0), "{name}: stale signal state {:?}", sim.signals());
            } else {
                let cyc = |s: &Simulation| s.test_eff().sig[x.c as usize].as_ref().unwrap().cycle;
                assert_eq!(cyc(&sim), cyc(&base), "{name} cycle");
            }
        }
    }
}

#[test]
fn merge_onto_a_multilane_exit_passes_more_than_onto_a_single_lane() {
    // Two single-lane approaches merge at an uncontrolled node onto one exit link. On a single-lane exit every crossing blocks the
    // other until the vehicle has left the node; on a multilane exit the two streams use different lanes and only keep a time gap.
    fn completed(exit_lanes: u32) -> u64 {
        let mut b = B::default();
        let c = b.node(0.0, 0.0, Control::Uncontrolled, false);
        let w = b.node(-300.0, 0.0, Control::Uncontrolled, true);
        let s = b.node(0.0, -300.0, Control::Uncontrolled, true);
        let e = b.node(300.0, 0.0, Control::Uncontrolled, true);
        b.link(w, c, RoadClass::Secondary, 1, 13.4, false);
        b.link(s, c, RoadClass::Secondary, 1, 13.4, false);
        b.link(c, e, RoadClass::Secondary, exit_lanes, 13.4, false);
        let d = demand(&[(w, e, 1400.0), (s, e, 1400.0)]);
        let mut sim = Simulation::from_parts(b.net(), d, cfg(5, 1.0)).unwrap();
        for _ in 0..(600.0 / DT) as usize {
            sim.step(DT);
        }
        sim.metrics().completed_trips
    }
    let (one, two) = (completed(1), completed(2));
    assert!(two as f64 > 1.2 * one as f64, "multilane exit {two} against single lane {one}");
}

#[test]
fn right_turn_on_red_raises_discharge_unless_the_cross_street_is_saturated() {
    let (off, _) = crate::validate::rtor_cap(100.0, true, 1);
    let (on, _) = crate::validate::rtor_cap(100.0, false, 1);
    assert!(on > off * 1.08, "light cross traffic: {on} against {off} veh/h");
}
