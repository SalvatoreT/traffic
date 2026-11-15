//! Legal bypass witnesses on the effective movement graph (change explain-traffic-redistribution, tasks 1.3, 2.1).

use super::*;
use crate::redistribution::{analyze, path_is_legal, Graphs};

/// 3 x 3 grid of residential two-way streets, 150 m blocks; `g[i][j]` is the node at column i, row j, and `h[i][j]` / `v[i][j]` the
/// (eastbound, westbound) and (northbound, southbound) links leaving it.
struct Grid {
    g: [[u32; 3]; 3],
    h: [[(u32, u32); 3]; 2],
    v: [[(u32, u32); 2]; 3],
}

fn grid() -> (Network, Grid) {
    let mut b = B::default();
    let mut g = [[0u32; 3]; 3];
    for i in 0..3 {
        for j in 0..3 {
            g[i][j] = b.node(150.0 * i as f64, 150.0 * j as f64, Control::Uncontrolled, i != 1 || j != 1);
        }
    }
    let mut h = [[(0, 0); 3]; 2];
    let mut v = [[(0, 0); 2]; 3];
    for j in 0..3 {
        for i in 0..2 {
            h[i][j] = b.two_way(g[i][j], g[i + 1][j], RoadClass::Residential, 1, 11.2);
        }
    }
    for i in 0..3 {
        for j in 0..2 {
            v[i][j] = b.two_way(g[i][j], g[i][j + 1], RoadClass::Residential, 1, 11.2);
        }
    }
    (b.net(), Grid { g, h, v })
}

fn ivs(json: &str) -> Vec<Intervention> {
    serde_json::from_str(json).unwrap()
}

fn witness_for<'a>(out: &'a serde_json::Value, a: u32, b: u32) -> &'a serde_json::Value {
    out["witnesses"].as_array().unwrap().iter().find(|w| w["movement"][0] == a && w["movement"][1] == b).expect("witness of the movement")
}

fn links(p: &serde_json::Value) -> Vec<u32> {
    p["links"].as_array().unwrap().iter().map(|x| x.as_u64().unwrap() as u32).collect()
}

#[test]
fn a_node_filter_has_a_legal_one_block_dogleg() {
    let (net, x) = grid();
    let scen = ivs(&format!(r#"[{{"type":"modal_filter","node":{}}}]"#, x.g[1][1]));
    let out = analyze(&net, "p", "car", &[], &scen);
    // Every movement through the center that was legal is closed; a straight-through west-to-east one has a witness.
    assert!(out["closed"].as_array().unwrap().len() >= 8);
    let w = witness_for(&out, x.h[0][1].0, x.h[1][1].0);
    assert_eq!(w["status"], "found");
    assert_eq!(w["exhaustive"], true);
    let g = Graphs::new(&net, "p", &[], &scen);
    for p in w["paths"].as_array().unwrap() {
        let l = links(p);
        assert!(path_is_legal(&g, "car", &l), "{l:?}");
        assert!(!l.windows(2).any(|w| w == [x.h[0][1].0, x.h[1][1].0]));
        assert!(p["costS"].as_f64().unwrap() > p["baselineCostS"].as_f64().unwrap());
    }
    // The cheapest witness leaves the west street one junction early and rejoins east of the center.
    let best = links(&w["paths"][0]);
    assert!(best.len() >= 4, "{best:?}");
    assert!(w["listed"].as_u64().unwrap() <= w["cap"].as_u64().unwrap());
    assert_ne!(out["graph"]["baseline"], out["graph"]["scenario"]);
}

#[test]
fn the_engine_and_the_witness_graph_agree_on_every_movement() {
    let (net, x) = grid();
    let scen = format!(r#"[{{"type":"modal_filter","node":{},"legs":[{}]}},{{"type":"turn_ban","fromLink":{},"toLink":{}}}]"#, x.g[1][1], x.h[0][1].0, x.v[1][0].0, x.h[1][1].0);
    let g = Graphs::new(&net, "p", &[], &ivs(&scen));
    let sim = Simulation::from_parts(net.clone(), demand(&[]), Config { interventions: ivs(&scen), ..cfg_empty(1, 1.0) }).unwrap();
    assert_eq!(g.scen.mv_ok, sim.test_eff().mv_ok);
    assert_eq!(g.scen.closed, sim.test_eff().closed);
}

#[test]
fn a_partial_leg_filter_closes_only_its_legs() {
    let (net, x) = grid();
    let west_in = x.h[0][1].0;
    let scen = ivs(&format!(r#"[{{"type":"modal_filter","node":{},"legs":[{}]}}]"#, x.g[1][1], west_in));
    let out = analyze(&net, "p", "car", &[], &scen);
    let closed: Vec<(u64, u64)> = out["closed"].as_array().unwrap().iter().map(|m| (m[0].as_u64().unwrap(), m[1].as_u64().unwrap())).collect();
    assert!(!closed.is_empty());
    let west_out = x.h[0][1].1;
    for (a, b) in &closed {
        assert!(*a as u32 == west_in || *b as u32 == west_out, "{a}->{b} does not use the closed leg");
    }
    // South to north through the center stays open, so it is neither closed nor given a witness.
    assert!(!closed.contains(&(x.v[1][0].0 as u64, x.v[1][1].0 as u64)));
    // The broader selector lists every movement legal before at the node, the open ones included.
    assert!(out["crossings"].as_array().unwrap().len() > closed.len());
}

#[test]
fn a_turn_ban_of_another_period_does_not_block_a_witness() {
    let (mut net, x) = grid();
    // The dogleg's first turn (north on the west street, then east on the top street) is banned in the "am" period only.
    net.turn_bans.push(TurnBan { from: x.v[0][1].0, to: x.h[0][2].0, periods: vec!["am".into()] });
    let scen = ivs(&format!(r#"[{{"type":"modal_filter","node":{}}}]"#, x.g[1][1]));
    let uses_turn = |out: &serde_json::Value| {
        witness_for(out, x.h[0][1].0, x.h[1][1].0)["paths"].as_array().unwrap().iter().any(|p| links(p).windows(2).any(|w| w == [x.v[0][1].0, x.h[0][2].0]))
    };
    let pm = analyze(&net, "pm", "car", &[], &scen);
    let am = analyze(&net, "am", "car", &[], &scen);
    assert!(uses_turn(&pm));
    assert!(!uses_turn(&am));
    let g = Graphs::new(&net, "am", &[], &scen);
    for p in witness_for(&am, x.h[0][1].0, x.h[1][1].0)["paths"].as_array().unwrap() {
        assert!(path_is_legal(&g, "car", &links(p)));
    }
}

#[test]
fn a_cut_off_street_is_reported_disconnected_after_an_exhaustive_search() {
    // A line A - B - C: closing B leaves no way from A to C.
    let mut b = B::default();
    let a = b.node(0.0, 0.0, Control::Uncontrolled, true);
    let m = b.node(150.0, 0.0, Control::Uncontrolled, false);
    let c = b.node(300.0, 0.0, Control::Uncontrolled, true);
    let (ab, _) = b.two_way(a, m, RoadClass::Residential, 1, 11.2);
    let (bc, _) = b.two_way(m, c, RoadClass::Residential, 1, 11.2);
    let net = b.net();
    let out = analyze(&net, "p", "car", &[], &ivs(&format!(r#"[{{"type":"modal_filter","node":{m}}}]"#)));
    let w = witness_for(&out, ab, bc);
    assert_eq!(w["status"], "disconnected");
    assert_eq!(w["exhaustive"], true);
    assert!(w["paths"].as_array().unwrap().is_empty());
}
