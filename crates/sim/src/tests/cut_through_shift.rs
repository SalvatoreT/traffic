//! Closing one cut-through moves its through cars to the nearby alternative (user expectation of 2026-11-15, change
//! explain-traffic-redistribution). Expected shares come from the free-flow cost model: perceived cost = time x class weight
//! (`LOCAL_COST_FACTOR` 1.25 on residential links) plus turn costs, perceived by each driver with a probit error of variance
//! `ROUTE_DISPERSION_S` x cost [Sheffi1985] eq. 11.12.

use super::*;

/// Link exits per hour on each link after a loaded hour.
fn flows(net: &Network, dem: &Demand, ivs: &str, seed: u64) -> Vec<f32> {
    let cfg = Config { interventions: serde_json::from_str(ivs).unwrap(), ..cfg(seed, 1.0) };
    let mut s = Simulation::from_parts(net.clone(), dem.clone(), cfg).unwrap();
    step_n(&mut s, 3600.0);
    let st = s.run_link_stats();
    (0..s.n_links()).map(|l| st[l * 4]).collect()
}

/// Low Ave (south) and High Ave (north) are arterials 300 m apart; A St (x = 200) and B St (x = 400) are parallel one-block residential
/// cut-throughs with a stop sign at each end; East Blvd (x = 600) is a slow arterial (`EAST_V`). Trips run from the west end of Low Ave to the
/// east end of High Ave. Free-flow perceived cost: via A or B, 800 m of arterial at 13.4 m/s plus 300 m residential x 1.25 at 11.2 m/s
/// = 93 s plus the expected stop and left-turn delays; via East Blvd, 800 m at 13.4 m/s plus 300 m at 4 m/s = 135 s. At 6.3 m/s (107 s)
/// the stop delays already make the arterial competitive and the shares below do not hold: the expectation depends on the cost gap.
/// Returns the network, (A northbound, B northbound, East Blvd
/// northbound), the origin, the destination and the Low Ave link that enters A's junction.
fn parallel() -> (Network, [u32; 3], u32, u32, u32) {
    let mut b = B::default();
    let o = b.node(0.0, 0.0, Control::Uncontrolled, true);
    let lo: Vec<u32> = [200.0, 400.0, 600.0].iter().map(|&x| b.node(x, 0.0, Control::TwoWayStop, false)).collect();
    let hi: Vec<u32> = [200.0, 400.0, 600.0].iter().map(|&x| b.node(x, 300.0, Control::TwoWayStop, false)).collect();
    let d = b.node(800.0, 300.0, Control::Uncontrolled, true);
    let w = b.node(0.0, 300.0, Control::Uncontrolled, true);
    let art = |b: &mut B, x: u32, y: u32, v: f64, name: &str| {
        let (f, r) = b.two_way(x, y, RoadClass::Secondary, 1, v);
        b.links[f as usize].name = name.into();
        b.links[r as usize].name = name.into();
        f
    };
    let into_a = art(&mut b, o, lo[0], 13.4, "Low Ave");
    art(&mut b, lo[0], lo[1], 13.4, "Low Ave");
    art(&mut b, lo[1], lo[2], 13.4, "Low Ave");
    art(&mut b, w, hi[0], 13.4, "High Ave");
    art(&mut b, hi[0], hi[1], 13.4, "High Ave");
    art(&mut b, hi[1], hi[2], 13.4, "High Ave");
    art(&mut b, hi[2], d, 13.4, "High Ave");
    let east = art(&mut b, lo[2], hi[2], EAST_V, "East Blvd");
    let mut side = |b: &mut B, i: usize, name: &str| {
        let (f, r) = b.two_way(lo[i], hi[i], RoadClass::Residential, 1, 11.2);
        b.links[f as usize].name = name.into();
        b.links[r as usize].name = name.into();
        b.links[f as usize].stop_at_end = true;
        b.links[r as usize].stop_at_end = true;
        f
    };
    let a = side(&mut b, 0, "A St");
    let bb = side(&mut b, 1, "B St");
    (b.net(), [a, bb, east], o, d, into_a)
}

const EAST_V: f64 = 4.0;

fn shift(via: bool) -> (f32, f32, f32, f32) {
    let (net, [a, b, east], o, d, into_a) = parallel();
    let mut dem = demand(&[(o, d, 300.0)]);
    if via {
        dem.periods[0].flows[0].via = Some(Via { from: into_a, to: a, max_detour: Some(1.3), alternatives: Vec::new(), then: None });
    }
    let (mut base, mut cut) = ((0.0, 0.0, 0.0), (0.0, 0.0, 0.0));
    for seed in 1..=3 {
        let f0 = flows(&net, &dem, "[]", seed);
        let f1 = flows(&net, &dem, &format!(r#"[{{"type":"modal_filter","link":{a}}}]"#), seed);
        base = (base.0 + f0[a as usize], base.1 + f0[b as usize], base.2 + f0[east as usize]);
        cut = (cut.0 + f1[a as usize], cut.1 + f1[b as usize], cut.2 + f1[east as usize]);
    }
    // Share of A's cars that reappear on B, and on the arterial.
    ((cut.1 - base.1) / base.0, (cut.2 - base.2) / base.0, base.0 / 3.0, cut.0 / 3.0)
}

#[test]
fn closing_one_of_two_parallel_cut_throughs_moves_its_cars_to_the_other() {
    // B is about 30% cheaper than the arterial at free flow (Phi gives 96% on B at a dispersion of 2 s), but with A closed its stop-controlled
    // junctions load up: on measured costs B is about 18 s cheaper on a 135 s trip, and the probit share of the arterial is then
    // Phi(-18 / sqrt(2 x 287)) = 0.23 [Sheffi1985] eq. 11.20 (0.30 at a dispersion of 4 s). Measured 75% on B over seeds 1 to 3 (97% under
    // the +-8% per-node rule before round 31). ASSUMPTION of the test band: at least 60% on B, at most 40% to the arterial.
    let (to_b, to_east, a_before, a_after) = shift(false);
    assert!(a_before > 100.0, "A carries {a_before} cars an hour today");
    assert_eq!(a_after, 0.0);
    assert!((0.6..=1.2).contains(&to_b), "share of A's cars on B: {to_b:.2} (to the arterial {to_east:.2})");
    assert!(to_east < 0.4, "{to_east:.2}");
}

#[test]
fn assumed_movement_trips_on_the_closed_cut_through_also_take_the_other() {
    // Every trip must make the counted turn into A today. A's link closure cuts it and leaves no way back onto A St, so the trips fall
    // back to their plain route, which is mostly B (measured 79%; 99% under the per-node rule before round 31): the band is the one of the
    // test above, for the same cost gap.
    let (to_b, to_east, a_before, a_after) = shift(true);
    assert!(a_before > 250.0, "all 300 cars an hour turn into A today: {a_before}");
    assert_eq!(a_after, 0.0);
    assert!((0.6..=1.2).contains(&to_b), "share on B: {to_b:.2} (arterial {to_east:.2})");
}

/// Mid St runs north from a south gate through four junctions to a north gate; West St is parallel 150 m west, joined by First St and
/// Top Ave; East Blvd, 150 m east, is a slow arterial (6.3 m/s) joined by the same rows. A whole-junction filter on Mid St at Second St
/// leaves two ways round: the one-block dogleg by First St, West St and Top Ave (300 m more residential, about 33 s more at free flow)
/// and the arterial (300 m at 6.3 m/s on East Blvd instead of Mid St, plus the same two cross blocks, about 47 s more).
#[test]
fn a_one_block_dogleg_takes_the_closed_street_s_cars() {
    let mut b = B::default();
    let s = b.node(150.0, -150.0, Control::Uncontrolled, true);
    let n = b.node(150.0, 600.0, Control::Uncontrolled, true);
    let mut g = [[0u32; 4]; 3];
    for i in 0..3 {
        for j in 0..4 {
            g[i][j] = b.node(150.0 * i as f64, 150.0 * j as f64, Control::Uncontrolled, false);
        }
    }
    let named = |b: &mut B, x: u32, y: u32, class: RoadClass, v: f64, name: &str| {
        let (f, r) = b.two_way(x, y, class, 1, v);
        b.links[f as usize].name = name.into();
        b.links[r as usize].name = name.into();
        f
    };
    named(&mut b, s, g[1][0], RoadClass::Residential, 11.2, "Mid St");
    named(&mut b, g[1][3], n, RoadClass::Residential, 11.2, "Mid St");
    let mut west = Vec::new();
    for j in 0..3 {
        named(&mut b, g[1][j], g[1][j + 1], RoadClass::Residential, 11.2, "Mid St");
        west.push(named(&mut b, g[0][j], g[0][j + 1], RoadClass::Residential, 11.2, "West St"));
        named(&mut b, g[2][j], g[2][j + 1], RoadClass::Secondary, 6.3, "East Blvd");
    }
    for (j, name) in ["Low Rd", "First St", "Second St", "Top Ave"].iter().enumerate() {
        named(&mut b, g[0][j], g[1][j], RoadClass::Residential, 11.2, name);
        named(&mut b, g[1][j], g[2][j], RoadClass::Residential, 11.2, name);
    }
    let net = b.net();
    let dem = demand(&[(s, n, 200.0)]);
    let (mut before, mut after) = (0.0, 0.0);
    for seed in 1..=3 {
        before += flows(&net, &dem, "[]", seed)[west[1] as usize];
        after += flows(&net, &dem, &format!(r#"[{{"type":"modal_filter","node":{}}}]"#, g[1][2]), seed)[west[1] as usize];
    }
    // ASSUMPTION of the band: the dogleg is 14 s cheaper than the arterial, beyond the noise for most drivers: at least 75% of the 200
    // cars an hour use West St between First St and Second St.
    let share = (after - before) / 3.0 / 200.0;
    assert!(share >= 0.75, "dogleg share {share:.2}");
}

