//! Diagonal diverter: permitted movements, routing, exemptions, invalid orientation, real network.

use super::*;
use crate::diverter::{node_legs, permitted_movements};
use crate::topo::Topo;

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

fn dd(node: u32, bearing: f64) -> String {
    format!("[{{\"type\":\"diagonal_diverter\",\"node\":{node},\"bearing\":{bearing}}}]")
}

fn legs_net(bearings: &[f64], one_way_in: &[usize]) -> (Network, u32, Vec<(Option<u32>, Option<u32>)>) {
    let mut b = B::default();
    let c = b.node(0.0, 0.0, Control::Uncontrolled, false);
    let mut pairs = Vec::new();
    for (i, br) in bearings.iter().enumerate() {
        let r = br.to_radians();
        let n = b.node(200.0 * r.sin(), 200.0 * r.cos(), Control::Uncontrolled, true);
        if one_way_in.contains(&i) {
            let l = b.link(n, c, RoadClass::Residential, 1, 11.2, false);
            pairs.push((Some(l), None));
        } else {
            let (inn, out) = b.two_way(n, c, RoadClass::Residential, 1, 11.2);
            pairs.push((Some(inn), Some(out)));
        }
    }
    (b.net(), c, pairs)
}

#[test]
fn plain_four_way_permits_exactly_four_turns_and_no_through() {
    let (net, c) = cross4(Control::Uncontrolled, RoadClass::Residential, false);
    let topo = Topo::new(&net);
    for (bearing, pairs) in [
        (45.0, [(c.e_in, c.s_out), (c.s_in, c.e_out), (c.n_in, c.w_out), (c.w_in, c.n_out)]),
        (135.0, [(c.n_in, c.e_out), (c.e_in, c.n_out), (c.s_in, c.w_out), (c.w_in, c.s_out)]),
    ] {
        let mut want = pairs.to_vec();
        want.sort_unstable();
        let got = permitted_movements(&topo, &net, c.c, bearing).unwrap();
        assert_eq!(got, want, "bearing {bearing}");
        for (a, b) in [(c.w_in, c.e_out), (c.e_in, c.w_out), (c.s_in, c.n_out), (c.n_in, c.s_out)] {
            assert!(!got.contains(&(a, b)), "straight through is blocked");
        }
        // Access: every leg can be entered and left.
        for out in [c.w_out, c.e_out, c.s_out, c.n_out] {
            assert!(got.iter().any(|m| m.1 == out), "leg reachable");
        }
        for inn in [c.w_in, c.e_in, c.s_in, c.n_in] {
            assert!(got.iter().any(|m| m.0 == inn), "leg can leave");
        }
    }
    assert_eq!(node_legs(&topo, &net, c.c).len(), 4);
}

#[test]
fn routes_and_cars_cannot_go_straight_through_either_street() {
    let (net, c) = cross4(Control::Uncontrolled, RoadClass::Residential, false);
    let flows = [(c.w, c.e, 300.0, FlowMode::Car), (c.s, c.n, 300.0, FlowMode::Car), (c.w, c.n, 300.0, FlowMode::Car), (c.s, c.e, 300.0, FlowMode::Car)];
    let mut sim = Simulation::from_parts(net, flows_m(&flows), cfg(3, 1.0)).unwrap();
    sim.set_interventions(&dd(c.c, 45.0)).unwrap();
    assert!(sim.test_route_for(c.w, c.e, crate::route::NO_NOISE).is_none());
    assert!(sim.test_route_for(c.e, c.w, crate::route::NO_NOISE).is_none());
    assert!(sim.test_route_for(c.s, c.n, crate::route::NO_NOISE).is_none());
    assert!(sim.test_route_for(c.n, c.s, crate::route::NO_NOISE).is_none());
    assert!(sim.test_route_for(c.w, c.n, crate::route::NO_NOISE).is_some());
    assert!(sim.test_route_for(c.s, c.e, crate::route::NO_NOISE).is_some());
    assert_eq!(sim.metrics().invalid_interventions, 0);
    run(&mut sim, 600.0, |s| {
        for l in [c.w_out, c.e_out, c.s_out, c.n_out] {
            let _ = s.test_lane_vehicles(l);
        }
    });
    let m = sim.metrics();
    assert!(m.completed_trips > 10, "turns still complete ({})", m.completed_trips);
    // Removal restores through movement.
    sim.set_interventions("[]").unwrap();
    assert!(sim.test_route_for(c.w, c.e, crate::route::NO_NOISE).is_some());
}

#[test]
fn cyclists_pass_straight_through() {
    let (net, c) = cross4(Control::Uncontrolled, RoadClass::Residential, false);
    let ivs: Vec<Intervention> = serde_json::from_str(&dd(c.c, 45.0)).unwrap();
    let mut sim = Simulation::from_parts(net, flows_m(&[(c.w, c.e, 200.0, FlowMode::Bicycle), (c.w, c.e, 200.0, FlowMode::Car)]), Config { interventions: ivs, ..cfg(4, 1.0) }).unwrap();
    run(&mut sim, 600.0, |_| {});
    let m = sim.metrics();
    assert!(m.modes.bicycle.completed_trips > 5, "cyclists cross: {}", m.modes.bicycle.completed_trips);
    assert_eq!(m.modes.car.completed_trips, 0, "cars cannot");
}

#[test]
fn one_way_leg_only_permits_the_movements_that_exist() {
    // North leg is one-way toward the node.
    let (net, c, pairs) = legs_net(&[0.0, 90.0, 180.0, 270.0], &[0]);
    let topo = Topo::new(&net);
    let got = permitted_movements(&topo, &net, c, 45.0).unwrap();
    let n_in = pairs[0].0.unwrap();
    let w_out = pairs[3].1.unwrap();
    let w_in = pairs[3].0.unwrap();
    assert!(got.contains(&(n_in, w_out)));
    assert!(!got.iter().any(|m| m.1 == pairs[0].0.unwrap()));
    assert!(got.iter().all(|m| m.0 != w_in || m.1 != n_in));
    assert_eq!(got.len(), 3, "{got:?}");
    assert_eq!(node_legs(&topo, &net, c).len(), 4, "one-way leg counts once");
}

#[test]
fn invalid_orientation_is_rejected_and_reported() {
    let (net, c) = cross4(Control::Uncontrolled, RoadClass::Residential, false);
    let topo = Topo::new(&net);
    assert!(permitted_movements(&topo, &net, c.c, 0.0).is_err(), "barrier along a street");
    assert!(permitted_movements(&topo, &net, c.c, f64::NAN).is_err());
    // Three legs on one side.
    let (net2, c2, _) = legs_net(&[0.0, 20.0, 40.0, 200.0], &[]);
    let topo2 = Topo::new(&net2);
    assert!(permitted_movements(&topo2, &net2, c2, 100.0).is_err(), "3 and 1");
    // Three-leg node.
    let (net3, c3, _) = legs_net(&[0.0, 120.0, 240.0], &[]);
    let topo3 = Topo::new(&net3);
    assert!(permitted_movements(&topo3, &net3, c3, 60.0).is_err());
    // The simulation skips and reports it; routes are unchanged.
    let mut sim = Simulation::from_parts(net, flows_m(&[]), cfg(1, 1.0)).unwrap();
    sim.set_interventions(&dd(c.c, 0.0)).unwrap();
    assert_eq!(sim.metrics().invalid_interventions, 1);
    assert!(sim.test_route_for(c.w, c.e, crate::route::NO_NOISE).is_some());
    sim.set_interventions(&dd(c.c, 45.0)).unwrap();
    assert_eq!(sim.metrics().invalid_interventions, 0);
    sim.set_interventions(&dd(9999, 45.0)).unwrap();
    assert_eq!(sim.metrics().invalid_interventions, 1);
}

#[test]
fn bearing_wraps_and_curved_legs_classify_by_departure() {
    let (net, c) = cross4(Control::Uncontrolled, RoadClass::Residential, false);
    let topo = Topo::new(&net);
    assert_eq!(permitted_movements(&topo, &net, c.c, 45.0).unwrap(), permitted_movements(&topo, &net, c.c, 225.0).unwrap());
    // A west leg that leaves the node heading north-west before bending far to the south-west still counts as west-ish.
    let mut net2 = net.clone();
    for l in net2.links.iter_mut() {
        if l.from == c.w && l.to == c.c {
            l.geometry = vec![[-200.0, -150.0], [-60.0, -10.0], [0.0, 0.0]];
        }
        if l.from == c.c && l.to == c.w {
            l.geometry = vec![[0.0, 0.0], [-60.0, -10.0], [-200.0, -150.0]];
        }
    }
    let topo2 = Topo::new(&net2);
    let legs = node_legs(&topo2, &net2, c.c);
    let w = legs.iter().find(|l| l.ins.contains(&c.w_in)).unwrap();
    assert!((w.bearing - 260.0).abs() < 5.0, "{}", w.bearing);
}

#[test]
fn diverter_runs_are_deterministic() {
    let run_once = || {
        let (net, c) = cross4(Control::AllWayStop, RoadClass::Residential, false);
        let flows = [(c.w, c.e, 300.0, FlowMode::Car), (c.s, c.n, 300.0, FlowMode::Car), (c.w, c.n, 200.0, FlowMode::Bicycle)];
        let mut sim = Simulation::from_parts(net, flows_m(&flows), cfg(11, 1.0)).unwrap();
        sim.set_interventions(&dd(c.c, 135.0)).unwrap();
        step_n(&mut sim, 300.0);
        sim.metrics_json()
    };
    assert_eq!(run_once(), run_once());
}

fn load_rockridge() -> Option<Network> {
    let p = std::path::Path::new(env!("CARGO_MANIFEST_DIR")).join("../../public/data/rockridge.network.json");
    let s = std::fs::read_to_string(p).ok()?;
    serde_json::from_str(&s).ok()
}

#[test]
fn hillegass_and_62nd_gives_two_l_pairs_for_each_diagonal() {
    let Some(net) = load_rockridge() else {
        eprintln!("skipped: public/data/rockridge.network.json missing");
        return;
    };
    let node = (0..net.nodes.len() as u32)
        .find(|&n| {
            let names: std::collections::HashSet<&str> =
                net.links.iter().filter(|l| l.to == n || l.from == n).map(|l| l.name.as_str()).collect();
            names.contains("Hillegass Avenue") && names.contains("62nd Street")
        })
        .expect("Hillegass Avenue & 62nd Street node");
    let topo = Topo::new(&net);
    let legs = node_legs(&topo, &net, node);
    assert_eq!(legs.len(), 4, "{legs:?}");
    // Bisectors between adjacent legs.
    let mut b: Vec<f64> = legs.iter().map(|l| l.bearing).collect();
    b.sort_by(|x, y| x.partial_cmp(y).unwrap());
    let mut cands: Vec<f64> = (0..4)
        .map(|i| {
            let (a, c) = (b[i], b[(i + 1) % 4]);
            let d = (c - a).rem_euclid(360.0);
            (a + d / 2.0).rem_euclid(180.0)
        })
        .collect();
    cands.sort_by(|x, y| x.partial_cmp(y).unwrap());
    let mut pairings = std::collections::BTreeSet::new();
    for bearing in cands {
        let got = permitted_movements(&topo, &net, node, bearing).unwrap_or_else(|e| panic!("bearing {bearing}: {e}"));
        let leg_of = |l: u32| legs.iter().position(|g| g.ins.contains(&l) || g.outs.contains(&l)).unwrap();
        let mut pairs = std::collections::BTreeSet::new();
        for &(a, o) in &got {
            let (x, y) = (leg_of(a), leg_of(o));
            assert_ne!(x, y);
            pairs.insert((x.min(y), x.max(y)));
        }
        assert_eq!(pairs.len(), 2, "two L pairs at {bearing}");
        let (p, q) = (pairs.iter().next().unwrap(), pairs.iter().nth(1).unwrap());
        assert!(p.0 != q.0 && p.0 != q.1 && p.1 != q.0 && p.1 != q.1, "disjoint pairs");
        assert_eq!(got.len(), 4, "four directed movements at {bearing}");
        pairings.insert(pairs.into_iter().collect::<Vec<_>>());
    }
    assert_eq!(pairings.len(), 2, "the two diagonals give two different pairings");
}
