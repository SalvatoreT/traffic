//! A counted movement cut by a filter keeps its intent through a local dogleg (lead decision of 2026-11-15).

use super::*;

/// Three north-south streets (West St, Mid St, East Blvd) and four east-west ones (Low Rd, First St, Second St, Top Ave), 150 m blocks.
/// The origin gate is east of Low Rd and East Blvd; the destination gate is west of Top Ave. Returns the network, the node grid, the
/// origin and destination, and links by name.
fn dogleg_net() -> (Network, [[u32; 4]; 3], u32, u32, HashMap<&'static str, u32>) {
    dogleg_net_v(15.0)
}

fn dogleg_net_v(east_v: f64) -> (Network, [[u32; 4]; 3], u32, u32, HashMap<&'static str, u32>) {
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
            let (f, r) = b.two_way(g[i][j], g[i][j + 1], class, 1, if i == 2 { east_v } else { 11.2 });
            b.links[f as usize].name = cols[i].into();
            b.links[r as usize].name = cols[i].into();
            if i == 1 {
                l.insert(["mid0n", "mid1n", "mid2n"][j], f);
            }
            if i == 0 {
                l.insert(["west0n", "west1n", "west2n"][j], f);
            }
            if i == 2 && j == 2 {
                l.insert("east2n", f);
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
            if j == 3 && i == 1 {
                l.insert("top1w", r);
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
    // westbound beyond the closure. From the end of Mid St's first block to Top Ave westbound the drivers route on their own perceived
    // costs: the dogleg takes about 50 s and the way round by First St east and East Blvd about 70 s, so the probit share of the longer way
    // is Phi(-20 / sqrt(2 x 120)) = 0.10 at a dispersion of 2 s [Sheffi1985] eq. 11.20 (measured 12 of 85). ASSUMPTION of the band: at least
    // 75% take the dogleg; every trip stays on Mid St to First St, avoids Mid St beyond it and leaves by Top Ave westbound.
    let cut = trails(&format!(r#"[{{"type":"modal_filter","node":{}}}]"#, g[1][2]));
    assert!(cut.len() > 20, "{}", cut.len());
    let dogleg = cut.iter().filter(|t| has(t, l["mid0n"], l["first_w"]) && t.contains(&l["west1n"]) && t.contains(&l["west2n"])).count();
    assert!(dogleg as f64 >= 0.75 * cut.len() as f64, "{dogleg} of {}", cut.len());
    for t in &cut {
        assert!(t.contains(&l["mid0n"]) && t.contains(&l["top_out"]), "{t:?}");
        assert!(!t.contains(&l["mid1n"]) && !t.contains(&l["mid2n"]));
    }
}

/// Trails of the O-W trips whose counted turn (north on Mid St, left onto Top Ave) has a configured alternative (north on East Blvd,
/// left onto Top Ave), with Mid St filtered at Second St so the counted turn is cut.
fn cut_trails(east_v: f64) -> (Vec<Vec<u32>>, HashMap<&'static str, u32>) {
    let (net, g, o, w, l) = dogleg_net_v(east_v);
    let mut dem = demand(&[(o, w, 240.0)]);
    dem.periods[0].flows[0].via = Some(Via { from: l["mid2n"], to: l["top0w"], max_detour: Some(1.3), alternatives: vec![ViaMove { from: l["east2n"], to: l["top1w"] }], then: None });
    let ivs = format!(r#"[{{"type":"modal_filter","node":{}}}]"#, g[1][2]);
    let cfg = Config { record_trips: true, interventions: serde_json::from_str(&ivs).unwrap(), ..cfg_empty(1, 1.0) };
    let mut s = Simulation::from_parts(net, dem, cfg).unwrap();
    step_n(&mut s, 1200.0);
    (s.trip_records().iter().filter(|t| t.origin == o && t.dest == w).map(|t| t.trail.clone()).collect(), l)
}

/// Lead decision of 2026-11-15: a cut counted turn's alternatives and its local bypass compete on cost; neither kind comes first.
#[test]
fn a_cut_turn_takes_the_cheaper_of_its_alternative_and_the_bypass() {
    // East Blvd fast (15 m/s): the alternative is the cheaper way onto Top Ave and the trips take it.
    let (t, l) = cut_trails(15.0);
    let alt = t.iter().filter(|t| has(t, l["east2n"], l["top1w"])).count();
    assert!(t.len() > 20 && alt * 10 >= t.len() * 9, "{alt} of {} took the alternative", t.len());
    // East Blvd at 6 m/s: the alternative costs about 1.23 times the dogleg at free flow, inside the 1.3 tolerance, so before this
    // decision every trip took it (checked with the alternatives ranked first); now the cheaper bypass by First St and West St wins.
    let (t, l) = cut_trails(6.0);
    let bypass = t.iter().filter(|t| has(t, l["mid0n"], l["first_w"]) && t.contains(&l["top_out"])).count();
    assert!(t.len() > 20 && bypass * 10 >= t.len() * 9, "{bypass} of {} took the bypass", t.len());
}

