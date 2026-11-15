//! A counted movement cut by a filter keeps its intent through a local dogleg (lead decision of 2026-11-15).

use super::*;

/// Three north-south streets (West St, Mid St, East Blvd) and four east-west ones (Low Rd, First St, Second St, Top Ave), 150 m blocks.
/// The origin gate is east of Low Rd and East Blvd; the destination gate is west of Top Ave. Returns the network, the node grid, the
/// origin and destination, and links by name.
fn dogleg_net() -> (Network, [[u32; 4]; 3], u32, u32, HashMap<&'static str, u32>) {
    let mut b = B::default();
    let mut g = [[0u32; 4]; 3];
    for i in 0..3 {
        for j in 0..4 {
            g[i][j] = b.node(150.0 * i as f64, 150.0 * j as f64, Control::Uncontrolled, false);
        }
    }
    let o = b.node(450.0, 0.0, Control::Uncontrolled, true);
    let w = b.node(-150.0, 450.0, Control::Uncontrolled, true);
    let mut l = HashMap::new();
    let cols = ["West St", "Mid St", "East Blvd"];
    let rows = ["Low Rd", "First St", "Second St", "Top Ave"];
    for i in 0..3 {
        let class = if i == 2 { RoadClass::Secondary } else { RoadClass::Residential };
        for j in 0..3 {
            let (f, r) = b.two_way(g[i][j], g[i][j + 1], class, 1, if i == 2 { 15.0 } else { 11.2 });
            b.links[f as usize].name = cols[i].into();
            b.links[r as usize].name = cols[i].into();
            if i == 1 {
                l.insert(["mid0n", "mid1n", "mid2n"][j], f);
            }
            if i == 0 {
                l.insert(["west0n", "west1n", "west2n"][j], f);
            }
        }
    }
    for j in 0..4 {
        for i in 0..2 {
            let (f, r) = b.two_way(g[i][j], g[i + 1][j], RoadClass::Residential, 1, 11.2);
            b.links[f as usize].name = rows[j].into();
            b.links[r as usize].name = rows[j].into();
            if j == 1 && i == 0 {
                l.insert("first_w", r);
            }
            if j == 3 && i == 0 {
                l.insert("top0w", r);
            }
        }
    }
    let (oi, _) = b.two_way(o, g[2][0], RoadClass::Secondary, 1, 15.0);
    b.links[oi as usize].name = "Ramp".into();
    let (_, wo) = b.two_way(w, g[0][3], RoadClass::Residential, 1, 11.2);
    b.links[wo as usize].name = "Top Ave".into();
    l.insert("top_out", wo);
    (b.net(), g, o, w, l)
}

fn via_demand(o: u32, w: u32, a: u32, b: u32) -> Demand {
    let mut d = demand(&[(o, w, 240.0)]);
    d.periods[0].flows[0].via = Some(Via { from: a, to: b, max_detour: Some(1.3), alternatives: Vec::new(), then: None });
    d
}

/// Trails of the completed O-W trips.
fn trails(ivs: &str) -> Vec<Vec<u32>> {
    let (net, _, o, w, l) = dogleg_net();
    let dem = via_demand(o, w, l["mid2n"], l["top0w"]);
    let cfg = Config { record_trips: true, interventions: serde_json::from_str(ivs).unwrap(), ..cfg_empty(1, 1.0) };
    let mut s = Simulation::from_parts(net, dem, cfg).unwrap();
    step_n(&mut s, 1200.0);
    s.trip_records().iter().filter(|t| t.origin == o && t.dest == w).map(|t| t.trail.clone()).collect()
}

fn has(t: &[u32], a: u32, b: u32) -> bool {
    t.windows(2).any(|w| w == [a, b])
}

#[test]
fn a_cut_counted_turn_takes_the_one_block_dogleg() {
    let (_, g, _, _, l) = dogleg_net();
    // Without the filter the trips make the counted turn: north on Mid St, left onto Top Ave.
    let open = trails("[]");
    assert!(open.len() > 20, "{}", open.len());
    assert!(open.iter().all(|t| has(t, l["mid2n"], l["top0w"])), "{open:?}");
    // With Mid St filtered at Second St they still drive Mid St north, turn onto First St, take West St north and rejoin Top Ave
    // westbound beyond the closure.
    let cut = trails(&format!(r#"[{{"type":"modal_filter","node":{}}}]"#, g[1][2]));
    assert!(cut.len() > 20, "{}", cut.len());
    for t in &cut {
        assert!(has(t, l["mid0n"], l["first_w"]), "{t:?}");
        assert!(t.contains(&l["west1n"]) && t.contains(&l["west2n"]) && t.contains(&l["top_out"]), "{t:?}");
        assert!(!t.contains(&l["mid1n"]) && !t.contains(&l["mid2n"]));
    }
}
