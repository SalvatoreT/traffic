//! Tests of the proposal search on small synthetic networks, plus the scenario-link encoder against fixtures produced by the
//! TypeScript encoder (`tools/gen-proposal-link-fixtures.ts`).

use serde_json::Value;
use traffic_sim::explore::cands::{generate, Hotspots};
use traffic_sim::explore::naming::{describe, NameIndex};
use traffic_sim::explore::report::{explore, Outcome};
use traffic_sim::explore::search::Eval;
use traffic_sim::explore::{check_access, Params, Study};
use traffic_sim::model::*;

// ---------------------------------------------------------------- encoder and names

fn fixture() -> Value {
    serde_json::from_str(&std::fs::read_to_string(concat!(env!("CARGO_MANIFEST_DIR"), "/tests/fixtures/links.json")).unwrap()).unwrap()
}

fn fixture_net(f: &Value) -> (Network, (f64, f64)) {
    let net: Network = serde_json::from_value(f["network"].clone()).unwrap();
    let o = (f["network"]["origin"]["lon"].as_f64().unwrap(), f["network"]["origin"]["lat"].as_f64().unwrap());
    (net, o)
}

#[test]
fn links_match_the_typescript_encoder() {
    let f = fixture();
    let (net, origin) = fixture_net(&f);
    let cases = f["cases"].as_array().unwrap();
    assert!(cases.len() >= 10);
    for c in cases {
        let ivs: Vec<Intervention> = serde_json::from_value(c["interventions"].clone()).unwrap();
        let period = c["period"].as_str();
        let got = traffic_sim::explore::link::encode_scenario(&net, origin, &ivs, "fixture", period);
        assert_eq!(got, c["link"].as_str().unwrap(), "case {}", c["name"]);
    }
}

#[test]
fn labels_match_the_app() {
    let f = fixture();
    let (net, origin) = fixture_net(&f);
    let study = Study::from_parts("fixture", net.clone(), Demand { version: 1, area: "fixture".into(), intents: vec![], periods: vec![] }, origin, "h".into(), "h".into(), "uncalibrated".into());
    let idx = NameIndex::new(&net);
    for b in f["blockLabels"].as_array().unwrap() {
        let key = b["key"].as_u64().unwrap() as u32;
        assert_eq!(idx.block_label(key), b["label"].as_str().unwrap());
    }
    for (i, n) in f["nodeNames"].as_array().unwrap().iter().enumerate() {
        assert_eq!(idx.node_label(i as u32), n.as_str().unwrap());
    }
    for c in f["cases"].as_array().unwrap() {
        let ivs: Vec<Intervention> = serde_json::from_value(c["interventions"].clone()).unwrap();
        for (iv, want) in ivs.iter().zip(c["labels"].as_array().unwrap()) {
            assert_eq!(describe(&net, &study.topo, &idx, iv), want.as_str().unwrap(), "case {}", c["name"]);
        }
    }
}

// ---------------------------------------------------------------- synthetic networks

#[derive(Default)]
struct B {
    nodes: Vec<Node>,
    links: Vec<Link>,
}

impl B {
    fn node(&mut self, x: f64, y: f64, control: Control, gate: bool) -> u32 {
        let id = self.nodes.len() as u32;
        self.nodes.push(Node { id, osm_id: id as i64, x, y, control, gate, in_study_area: !gate, marked_crossing: false, signal_timing: Vec::new() });
        id
    }
    fn two_way(&mut self, a: u32, b: u32, name: &str, class: RoadClass, limit: f64, in_study: bool) {
        let (pa, pb) = (self.nodes[a as usize].clone(), self.nodes[b as usize].clone());
        let len = (pb.x - pa.x).hypot(pb.y - pa.y);
        let id = self.links.len() as u32;
        for (k, (f, t, g)) in [(a, b, [[pa.x, pa.y], [pb.x, pb.y]]), (b, a, [[pb.x, pb.y], [pa.x, pa.y]])].into_iter().enumerate() {
            self.links.push(Link {
                id: id + k as u32,
                osm_way_id: (id / 2) as i64,
                from: f,
                to: t,
                reverse: Some(id + 1 - k as u32),
                name: name.into(),
                class,
                lanes: 1,
                speed_limit: limit,
                length: len,
                geometry: g.to_vec(),
                stop_at_end: false,
                humps: vec![],
                in_study_area: in_study,
                bike_lane: false,
                bike_route: false,
                sidewalk: None,
                crossings: vec![],
                left_lanes: 0,
                from_bearing: None,
                to_bearing: None,
            });
        }
    }
}

struct Net {
    study_net: Network,
    /// (name of block, link id of the a->b direction)
    c_d: u32,
    e_f: u32,
    c_s: u32,
}

/// An arterial W-A-B-E (slow) with a parallel local rat run A-C-D-B; `second` adds a second one A-E-F-B; a dead-end stub C-S hangs off C.
fn ratrun(second: bool, stub: bool) -> Net {
    let mut b = B::default();
    let gw = b.node(-500.0, 0.0, Control::Uncontrolled, true);
    let a = b.node(-250.0, 0.0, Control::Uncontrolled, false);
    let bb = b.node(250.0, 0.0, Control::Uncontrolled, false);
    let ge = b.node(500.0, 0.0, Control::Uncontrolled, true);
    let c = b.node(-120.0, -100.0, Control::TwoWayStop, false);
    let d = b.node(120.0, -100.0, Control::TwoWayStop, false);
    b.two_way(gw, a, "Main Street", RoadClass::Secondary, 6.0, false);
    b.two_way(a, bb, "Main Street", RoadClass::Secondary, 6.0, true);
    b.two_way(bb, ge, "Main Street", RoadClass::Secondary, 6.0, false);
    b.two_way(a, c, "Cedar Street", RoadClass::Residential, 11.2, true);
    let c_d = b.links.len() as u32;
    b.two_way(c, d, "Birch Street", RoadClass::Residential, 11.2, true);
    b.two_way(d, bb, "Fir Street", RoadClass::Residential, 11.2, true);
    let mut e_f = 0;
    if second {
        let e = b.node(-120.0, 130.0, Control::TwoWayStop, false);
        let f = b.node(120.0, 130.0, Control::TwoWayStop, false);
        b.two_way(a, e, "Alder Street", RoadClass::Residential, 11.2, true);
        e_f = b.links.len() as u32;
        b.two_way(e, f, "Hazel Street", RoadClass::Residential, 11.2, true);
        b.two_way(f, bb, "Pine Street", RoadClass::Residential, 11.2, true);
    }
    let mut c_s = 0;
    if stub {
        let s = b.node(-120.0, -260.0, Control::Uncontrolled, false);
        c_s = b.links.len() as u32;
        b.two_way(c, s, "Maple Court", RoadClass::Residential, 11.2, true);
    }
    Net { study_net: Network { version: 1, id: "t".into(), name: "t".into(), nodes: b.nodes, links: b.links, turn_bans: Vec::new() }, c_d, e_f, c_s }
}

fn study_of(net: Network) -> Study {
    let (gw, ge) = (0u32, 3u32);
    let demand = Demand {
        version: 1,
        area: "t".into(),
        intents: Vec::new(),
        periods: vec![Period {
            id: "p".into(),
            label: "p".into(),
            flows: vec![
                Flow { origin: gw, destination: ge, veh_per_hour: 650.0, mode: FlowMode::Car, via: None, intent: None },
                Flow { origin: ge, destination: gw, veh_per_hour: 650.0, mode: FlowMode::Car, via: None, intent: None },
            ],
        }],
    };
    Study::from_parts("t", net, demand, (-122.25, 37.84), "h".into(), "h".into(), "uncalibrated".into())
}

fn params(jobs: usize) -> Params {
    let mut p = Params::new("t");
    p.periods = vec!["p".into()];
    p.seeds = vec![1, 2];
    p.beam = 3;
    p.depth = 3;
    p.candidates = 12;
    p.screen_minutes = 8.0;
    p.minutes = 12.0;
    p.jobs = jobs;
    p.finalists = 8;
    p
}

fn label_of(o: &Outcome, e: &Eval) -> String {
    e.set.iter().map(|&i| o.cands[i as usize].label.clone()).collect::<Vec<_>>().join("; ")
}

fn best(o: &Outcome) -> &Eval {
    o.state.evals.iter().filter(|e| e.valid()).max_by(|a, b| a.score.partial_cmp(&b.score).unwrap().then(b.set.len().cmp(&a.set.len()))).unwrap()
}

#[test]
fn one_filter_removes_a_rat_run_without_harm() {
    let n = ratrun(false, false);
    let study = study_of(n.study_net);
    let o = explore(&study, &params(4));
    let base = o.base.full[0].ct_vph;
    assert!(base > 5.0, "the rat run carries cut-through in the baseline: {base}");
    let b = best(&o);
    eprintln!("best: {} reduction {:.1}% harm {:.1}", label_of(&o, b), b.reduction_pct, b.harm);
    assert!(b.reduction_pct > 60.0, "{}", label_of(&o, b));
    assert_eq!(b.harm, 0.0);
    assert_eq!(b.set.len(), 1, "a single intervention is enough: {}", label_of(&o, b));
    assert!(o.cands[b.set[0] as usize].kind == "modal_filter" || o.cands[b.set[0] as usize].kind == "one_way", "{}", label_of(&o, b));
    assert!(!o.picks.is_empty());
    let f = &o.finals[o.picks[0].idx];
    assert!(f.reduction_pct > 60.0 && f.harm == 0.0);
    let proposals = o.json["proposals"].as_array().unwrap();
    assert!(!proposals.is_empty());
    assert!(proposals[0]["link"].as_str().unwrap().starts_with("#v1;a=t;p=p;s="));

    // Through cars are a subset of all cars on every block, and the file reports both measures under their own names.
    for (t, a) in o.base.full[0].block_through.iter().zip(&o.base.full[0].block_flow) {
        assert!(*t <= *a + 1e-3, "through {t} exceeds all traffic {a}");
    }
    assert!(o.base.full[0].block_through.iter().sum::<f64>() > 0.0);
    let p0 = &proposals[0];
    assert!(p0["harm"]["through"]["worstBlock"].is_string() && p0["harm"]["through"]["blocksAboveNoise"].is_u64());
    assert!(p0["harm"].get("worstIncreaseVehPerHour").is_none());
    let per = &p0["byPeriod"]["p"];
    assert!(per["cutThrough"]["baselineVehPerHour"].as_f64().unwrap() > 5.0);
    let all = &per["allTraffic"];
    for k in ["baselineVehPerHour", "scenarioVehPerHour", "throughIncreaseVehPerHour"] {
        assert!(all[k].is_number(), "{k}");
    }
    assert!(all["worstBlock"].is_string() && all["blocksAboveNoise"].is_u64());
    assert!(f.by_period[0].block_through_inc <= f.by_period[0].block_scen - f.by_period[0].block_base + 1.0);
    assert!(p0["summary"].as_str().unwrap().contains("through cars an hour"));
}

#[test]
fn through_harm_picks_the_block_past_its_noise_band() {
    use traffic_sim::explore::report::through_harm;
    // Block 1 gains 40 (band 10), block 2 gains 15 (band 2 x 6 = 12): only block 1 and block 2 pass, block 1 is the worst.
    let h = through_harm(&[2.0, 40.0, 15.0, -30.0], &[1.0, 1.0, 6.0, 1.0]);
    assert_eq!((h.worst, h.blocks_above), (1, 2));
    assert_eq!(h.increase, 40.0);
    // Nothing beyond noise: the block with the largest raw increase is named and the count is zero.
    let n = through_harm(&[3.0, 9.0, -4.0], &[0.0, 0.0, 0.0]);
    assert_eq!((n.worst, n.blocks_above, n.increase), (1, 0, 9.0));
}

#[test]
fn a_filter_that_shifts_traffic_next_door_loses_to_a_two_filter_package() {
    let n = ratrun(true, false);
    let (c_d, e_f) = (n.c_d, n.e_f);
    let study = study_of(n.study_net);
    let mut p = params(4);
    p.candidates = 12;
    let o = explore(&study, &p);
    let cand_of = |link: u32| o.cands.iter().position(|c| c.kind == "modal_filter" && c.iv.link.map_or(false, |l| study.idx.block_of_link[l as usize] == study.idx.block_of_link[link as usize])).expect("filter candidate") as u16;
    let (f1, f2) = (cand_of(c_d), cand_of(e_f));
    let single = |c: u16| &o.state.evals[o.state.cache[&vec![c]]];
    let (s1, s2) = (single(f1), single(f2));
    eprintln!("single filters: R1 -{:.1}% harm {:.0}; R2 -{:.1}% harm {:.0}", s1.reduction_pct, s1.harm, s2.reduction_pct, s2.harm);
    // One of the two routes carries the traffic; closing it pushes the traffic onto the other, and the harm shows it.
    let worst_single = if s1.harm > s2.harm { s1 } else { s2 };
    assert!(worst_single.harm > 50.0, "diverted traffic is harm: {}", worst_single.harm);
    let mut pair = vec![f1, f2];
    pair.sort_unstable();
    let pe = &o.state.evals[*o.state.cache.get(&pair).expect("the two-filter package was evaluated")];
    assert!(pe.valid());
    assert!(pe.reduction_pct > 60.0 && pe.harm < 1.0, "pair: -{:.1}% harm {:.0}", pe.reduction_pct, pe.harm);
    assert!(pe.score > worst_single.score + 5.0);
    let b = best(&o);
    assert_eq!(b.set.len(), 2, "best: {}", label_of(&o, b));
    assert!(o.picks.iter().any(|pk| o.finals[pk.idx].set.len() == 2));
}

#[test]
fn stranding_a_dead_end_is_rejected() {
    let n = ratrun(false, true);
    let c_s = n.c_s;
    let c_d = n.c_d;
    let study = study_of(n.study_net);
    let filter = |l: u32| vec![Intervention { ty: "modal_filter".into(), link: Some(l), ..Default::default() }];
    let err = check_access(&study, &filter(c_s)).unwrap_err();
    assert!(err.contains("strands"), "{err}");
    assert!(check_access(&study, &filter(c_d)).is_ok());
    // A one-way on the stub block leaves its end reachable but unable to leave... in this network the stub is a dead end, so it strands.
    let ow = vec![Intervention { ty: "one_way".into(), link: Some(c_s), ..Default::default() }];
    assert!(check_access(&study, &ow).is_err());
    // A node filter at the stub's mouth strands it as well.
    let c_node = study.net.links[c_s as usize].from;
    let nf = vec![Intervention { ty: "modal_filter".into(), node: Some(c_node), ..Default::default() }];
    assert!(check_access(&study, &nf).is_err());
    // The search never returns such a package.
    let o = explore(&study, &params(4));
    for e in o.state.evals.iter().filter(|e| e.valid()) {
        let ivs: Vec<Intervention> = e.set.iter().map(|&i| o.cands[i as usize].iv.clone()).collect();
        assert!(check_access(&study, &ivs).is_ok(), "{}", label_of(&o, e));
    }
    for f in &o.finals {
        assert!(f.reject.is_none() || f.reject.as_ref().unwrap().len() > 0);
    }
}

#[test]
fn candidates_never_add_a_signal() {
    // A grid of local streets with all the control types, plus a signalized and a stop-controlled crossing.
    let mut b = B::default();
    let mut ids = Vec::new();
    for j in 0..4 {
        for i in 0..4 {
            let edge = i == 0 || j == 0 || i == 3 || j == 3;
            let ctl = if i == 1 && j == 1 { Control::Signal } else if edge { Control::Uncontrolled } else { Control::TwoWayStop };
            ids.push(b.node(i as f64 * 120.0, j as f64 * 120.0, ctl, edge));
        }
    }
    for j in 0..4 {
        for i in 0..4 {
            let n = ids[j * 4 + i];
            if i + 1 < 4 {
                b.two_way(n, ids[j * 4 + i + 1], &format!("H{j}"), RoadClass::Residential, 11.2, true);
            }
            if j + 1 < 4 {
                b.two_way(n, ids[(j + 1) * 4 + i], &format!("V{i}"), RoadClass::Residential, 11.2, true);
            }
        }
    }
    let net = Network { version: 1, id: "t".into(), name: "t".into(), nodes: b.nodes, links: b.links, turn_bans: Vec::new() };
    let study = study_of(net);
    // Pretend every block and node carries cut-through.
    let hot = Hotspots { block_ct: vec![10.0; study.idx.blocks.len()], node_ct: vec![10.0; study.net.nodes.len()], mv_ct: Default::default() };
    let cands = generate(&study, &hot, 200);
    let kinds: std::collections::BTreeSet<&str> = cands.iter().map(|c| c.kind).collect();
    for k in ["modal_filter", "node_filter", "diagonal_diverter", "one_way", "speed_hump", "traffic_circle", "speed_limit", "control", "signal_timing"] {
        assert!(kinds.contains(k), "missing {k}: {kinds:?}");
    }
    for c in &cands {
        assert!(!(c.iv.ty == "control" && c.iv.control == Some(Control::Signal)), "{}", c.label);
        assert!(c.iv.ty != "traffic_circle" || c.iv.node.is_some());
    }
    // Keys are unique: equivalent candidates were merged.
    let keys: std::collections::HashSet<&String> = cands.iter().map(|c| &c.key).collect();
    assert_eq!(keys.len(), cands.len());
    // Every four-leg local intersection offers two distinct diverter orientations.
    let node = cands.iter().find(|c| c.kind == "diagonal_diverter").unwrap().iv.node.unwrap();
    assert_eq!(cands.iter().filter(|c| c.kind == "diagonal_diverter" && c.iv.node == Some(node)).count(), 2);
}

#[test]
fn results_do_not_depend_on_the_number_of_jobs() {
    let n = ratrun(true, false);
    let study = study_of(n.study_net);
    let mut p = params(1);
    p.seeds = vec![1];
    p.depth = 2;
    let a = explore(&study, &p);
    p.jobs = 4;
    let b = explore(&study, &p);
    let strip = |o: &Outcome| {
        let mut j = o.json.clone();
        j["computed"]["date"] = Value::Null;
        j
    };
    assert_eq!(strip(&a), strip(&b));
    assert_eq!(a.state.evals.len(), b.state.evals.len());
    for (x, y) in a.state.evals.iter().zip(&b.state.evals) {
        assert_eq!(x.set, y.set);
        assert_eq!(x.score.to_bits(), y.score.to_bits());
    }
}

#[test]
fn recording_select_links_does_not_change_the_run() {
    let n = ratrun(true, false);
    let study = study_of(n.study_net);
    let sel = traffic_sim::explore::search::nominated_links(&study);
    let a = traffic_sim::explore::run(&study, &[], "p", 3, 8.0, &[]);
    let b = traffic_sim::explore::run(&study, &[], "p", 3, 8.0, &sel);
    assert_eq!(a.ct_vph.to_bits(), b.ct_vph.to_bits());
    assert_eq!(a.flow, b.flow);
    assert!(!b.records.is_empty());
}

#[test]
fn options_are_spread_and_drop_changes_within_noise() {
    use traffic_sim::explore::report::{select_options, Final};
    let mk = |n: usize, red: f64, harm: f64| Final {
        set: (0..n as u16).collect(),
        reject: None,
        base_vph: 100.0,
        scen_vph: 100.0 - red,
        reduction_pct: red,
        harm,
        worst: 0,
        blocks_above: 0,
        through: traffic_sim::explore::report::ThroughHarm { worst: 0, increase: 0.0, blocks_above: 0 },
        by_period: vec![],
        bounding: vec![],
        inside_pct: 0.0,
        ped_pct: 0.0,
        bike_pct: 0.0,
        score: red - 0.1 * harm,
    };
    let finals = vec![mk(1, 20.0, 0.0), mk(2, 20.5, 0.0), mk(2, 45.0, 20.0), mk(3, 60.0, 30.0), mk(4, 62.0, 90.0), mk(1, 5.0, 60.0), mk(5, 80.0, 40.0), mk(3, 3.0, 0.0)];
    let (picks, notes) = select_options(&finals, 4, 1.5);
    let chosen: Vec<usize> = picks.iter().map(|p| p.idx).collect();
    assert!(chosen.contains(&0), "best single stays: {chosen:?}");
    assert!(chosen.contains(&6), "best overall (score 76) stays: {chosen:?}");
    assert!(!chosen.contains(&1), "within noise of a simpler option");
    assert!(notes[1].contains("within noise of simpler"), "{}", notes[1]);
    assert!(notes[5].contains("dominated"), "{}", notes[5]);
    assert_eq!(chosen.len(), 4);
    let sizes: Vec<usize> = picks.iter().map(|p| finals[p.idx].set.len()).collect();
    assert!(sizes.windows(2).all(|w| w[0] <= w[1]));
}

// ---------------------------------------------------------------- reference resolver

/// A four-way crossing of two named residential streets inside a ring of gates, plus a staggered pair of T-junctions.
fn crossing() -> Study {
    let mut b = B::default();
    let c = b.node(0.0, 0.0, Control::TwoWayStop, false);
    let n = b.node(0.0, 150.0, Control::Uncontrolled, true);
    let s = b.node(0.0, -150.0, Control::Uncontrolled, true);
    let e = b.node(150.0, 0.0, Control::Uncontrolled, true);
    let w = b.node(-150.0, 0.0, Control::Uncontrolled, true);
    b.two_way(c, n, "Oak Street", RoadClass::Residential, 11.2, true);
    b.two_way(c, s, "Oak Street", RoadClass::Residential, 11.2, true);
    b.two_way(c, e, "Elm Street", RoadClass::Residential, 11.2, true);
    b.two_way(c, w, "Elm Street", RoadClass::Residential, 11.2, true);
    // Staggered: Pine meets Oak's north end at two nodes.
    let p1 = b.node(300.0, 100.0, Control::TwoWayStop, false);
    let p2 = b.node(300.0, 130.0, Control::TwoWayStop, false);
    b.two_way(p1, p2, "Cedar Street", RoadClass::Residential, 11.2, true);
    b.two_way(p1, e, "Pine Street", RoadClass::Residential, 11.2, true);
    b.two_way(p2, n, "Pine Street", RoadClass::Residential, 11.2, true);
    let net = Network { version: 1, id: "t".into(), name: "t".into(), nodes: b.nodes, links: b.links, turn_bans: Vec::new() };
    study_of(net)
}

#[test]
fn references_resolve_by_street_names() {
    use traffic_sim::explore::refs::{resolve, RefCfg};
    let study = crossing();
    let cfg = |v: Value| -> RefCfg { serde_json::from_value(serde_json::json!({"id": "x", "title": "t", "interventions": v})).unwrap() };
    let ok = resolve(
        &study,
        &cfg(serde_json::json!([
            { "type": "diagonal_diverter", "at": ["oak street", "Elm Street"], "connect": [["Oak Street", "south"], ["Elm Street", "west"]] },
            { "type": "modal_filter", "on": "Oak Street", "between": ["Elm Street", "the-gate"] },
        ])),
    );
    // The second item has no such block: a clear error naming the package and the entry.
    let err = ok.unwrap_err();
    assert!(err.contains("reference x intervention 2") && err.contains("no block of Oak Street"), "{err}");

    let ivs = resolve(
        &study,
        &cfg(serde_json::json!([
            { "type": "diagonal_diverter", "at": ["Oak Street", "Elm Street"], "connect": [["Oak Street", "south"], ["Elm Street", "west"]] },
            { "type": "diagonal_diverter", "at": ["Oak Street", "Elm Street"], "connect": [["Oak Street", "north"], ["Elm Street", "west"]] },
            { "type": "speed_limit", "on": "Elm Street", "between": ["Oak Street", "Elm Street"], "mph": 15 },
        ])),
    );
    // Elm Street has no block between Oak and Elm (the far end is a gate): error from the third entry only.
    assert!(ivs.unwrap_err().contains("intervention 3"));

    let ivs = resolve(
        &study,
        &cfg(serde_json::json!([
            { "type": "diagonal_diverter", "at": ["Oak Street", "Elm Street"], "connect": [["Oak Street", "south"], ["Elm Street", "west"]] },
            { "type": "diagonal_diverter", "at": ["Oak Street", "Elm Street"], "connect": [["Oak Street", "north"], ["Elm Street", "west"]] },
        ])),
    )
    .unwrap();
    let node = ivs[0].node.unwrap();
    // South with west stay connected: a driver going north turns left (west), and one coming from the north turns right... check with the simulator's helper.
    let (s_in, w_out) = (study.net.links.iter().find(|l| l.to == node && l.from == 2).unwrap().id, study.net.links.iter().find(|l| l.from == node && l.to == 4).unwrap().id);
    let ok0 = traffic_sim::diverter::permitted_movements(&study.topo, &study.net, node, ivs[0].bearing.unwrap()).unwrap();
    assert!(ok0.contains(&(s_in, w_out)));
    let n_in = study.net.links.iter().find(|l| l.to == node && l.from == 1).unwrap().id;
    let ok1 = traffic_sim::diverter::permitted_movements(&study.topo, &study.net, node, ivs[1].bearing.unwrap()).unwrap();
    assert!(ok1.contains(&(n_in, w_out)) && !ok1.contains(&(s_in, w_out)));
    assert_ne!(ivs[0].bearing, ivs[1].bearing);
}

#[test]
fn references_report_missing_and_ambiguous_places() {
    use traffic_sim::explore::refs::{find_node, resolve_one};
    let study = crossing();
    let err = find_node(&study, &["Oak Street".into(), "Birch Street".into()]).unwrap_err();
    assert!(err.contains("no node inside the study area"), "{err}");
    let err = find_node(&study, &["Pine Street".into(), "Cedar Street".into()]).unwrap_err();
    assert!(err.contains("2 nodes"), "{err}");
    // Offset legs are not a four-leg node: the diverter is refused.
    let v = serde_json::json!({ "type": "diagonal_diverter", "at": ["Cedar Street", "Pine Street"], "connect": [["Pine Street", "east"], ["Cedar Street", "south"]] });
    assert!(resolve_one(&study, &v).is_err());
    let v = serde_json::json!({ "type": "diagonal_diverter", "at": ["Oak Street", "Elm Street"], "connect": [["Oak Street", "south"], ["Oak Street", "north"]] });
    assert!(resolve_one(&study, &v).is_err());
    let v = serde_json::json!({ "type": "diagonal_diverter", "at": ["Oak Street", "Elm Street"], "connect": [["Oak Street", "south"], ["Maple Street", "west"]] });
    assert!(resolve_one(&study, &v).unwrap_err().contains("no Maple Street leg"));
}


#[test]
fn rockridge_reference_package_resolves_with_staggered_diverters() {
    use traffic_sim::explore::refs::{load, resolve};
    let root = std::path::Path::new(env!("CARGO_MANIFEST_DIR")).join("../..");
    let Ok(study) = Study::load(&root, "rockridge") else {
        eprintln!("skipped: generated rockridge data missing");
        return;
    };
    let Ok(refs) = load(&root.join("data/proposals/rockridge.references.json")) else {
        eprintln!("skipped: reference package missing");
        return;
    };
    let pkg = refs.iter().find(|r| r.id == "earlier-62nd-diverters").expect("package");
    let ivs = resolve(&study, pkg).unwrap_or_else(|e| panic!("{e}"));
    assert_eq!(ivs.len(), 2);
    for iv in &ivs {
        assert_eq!(iv.ty, "diagonal_diverter");
        let node = iv.node.unwrap();
        let ok = traffic_sim::diverter::permitted_movements(&study.topo, &study.net, node, iv.bearing.unwrap()).expect("valid orientation");
        assert_eq!(ok.len(), 4, "two L pairs, two directed movements each");
        let label = describe(&study.net, &study.topo, &study.idx, iv);
        assert!(label.contains("62nd Street (west)") || label.contains("62nd Street (southwest)"), "{label}");
    }
}

fn grid_with_boundary() -> Study {
    let mut b = B::default();
    let mut ids = Vec::new();
    for j in 0..4 {
        for i in 0..4 {
            let edge = i == 0 || j == 0 || i == 3 || j == 3;
            ids.push(b.node(i as f64 * 120.0, j as f64 * 120.0, if edge { Control::Uncontrolled } else { Control::TwoWayStop }, edge && i != 0 && j != 0));
        }
    }
    for j in 0..4 {
        for i in 0..4 {
            let n = ids[j * 4 + i];
            if i + 1 < 4 {
                let (name, class) = if j == 0 { ("Main Street".to_string(), RoadClass::Secondary) } else { (format!("H{j}"), RoadClass::Residential) };
                b.two_way(n, ids[j * 4 + i + 1], &name, class, 11.2, true);
            }
            if j + 1 < 4 {
                b.two_way(n, ids[(j + 1) * 4 + i], &format!("V{i}"), RoadClass::Residential, 11.2, true);
            }
        }
    }
    study_of(Network { version: 1, id: "t".into(), name: "t".into(), nodes: b.nodes, links: b.links, turn_bans: Vec::new() })
}

#[test]
fn a_constrained_profile_drops_types_and_boundary_places() {
    use traffic_sim::explore::cands::generate_with;
    use traffic_sim::explore::profile::Profile;
    let study = grid_with_boundary();
    let boundary: Vec<usize> = (0..study.net.nodes.len()).filter(|&n| study.boundary_node[n]).collect();
    assert_eq!(boundary.len(), 4, "the four nodes of the secondary street");
    let main = study.net.links.iter().position(|l| l.name == "Main Street").unwrap();
    let mv = [((main as u32), study.net.links.iter().position(|l| l.name == "V1").unwrap() as u32)];
    let mut mv_ct = std::collections::BTreeMap::new();
    for k in mv {
        mv_ct.insert(k, 10.0);
    }
    let hot = Hotspots { block_ct: vec![10.0; study.idx.blocks.len()], node_ct: vec![10.0; study.net.nodes.len()], mv_ct };
    let open = generate_with(&study, &hot, 200, &Profile::unconstrained());
    assert!(open.iter().any(|c| c.kind == "speed_hump") && open.iter().any(|c| c.kind == "traffic_circle"));
    assert!(open.iter().any(|c| c.nodes.iter().any(|&n| study.boundary_node[n as usize])), "the unconstrained set reaches the boundary");
    let charter = Profile { id: "charter".into(), title: "c".into(), note: String::new(), exclude_types: vec!["speed_hump".into(), "traffic_circle".into()], exclude_boundary: true };
    let cands = generate_with(&study, &hot, 200, &charter);
    assert!(!cands.is_empty());
    for c in &cands {
        assert!(c.iv.ty != "speed_hump" && c.iv.ty != "traffic_circle", "{}", c.label);
        assert!(c.nodes.iter().all(|&n| !study.boundary_node[n as usize]), "{}", c.label);
        for l in [c.iv.link, c.iv.from_link, c.iv.to_link].into_iter().flatten() {
            assert!(!study.is_boundary[l as usize], "{}", c.label);
        }
        if let Some(n) = c.iv.node {
            assert!(!study.boundary_node[n as usize], "{}", c.label);
        }
    }
    assert!(!cands.iter().any(|c| c.kind == "turn_ban"), "the only turn ban offered comes off the bounding street");
}

#[test]
fn harm_is_measured_on_inside_streets_only() {
    let study = grid_with_boundary();
    for &b in &study.harm_blocks {
        assert!(study.idx.blocks[b].links.iter().all(|&l| !study.is_boundary[l as usize]));
    }
}

#[test]
fn profile_results_merge_into_one_file_and_one_report() {
    use serde_json::json;
    use traffic_sim::explore::profile::*;
    let un = Profile::unconstrained();
    let ord = vec!["charter".to_string(), UNCONSTRAINED.to_string()];
    let old = json!({"version": 1, "area": "t", "computed": {"date": "d"}, "baseline": {}, "proposals": [{"id": "p1"}]});
    let charter = json!({"id": "charter", "title": "c", "note": "", "computed": {}, "baseline": {}, "proposals": [{"id": "p1"}, {"id": "p2"}]});
    let m = merge_file(Some(&old), "t", charter.clone(), &ord, &un);
    assert_eq!(m["version"], 4);
    let ids: Vec<&str> = m["groups"].as_array().unwrap().iter().map(|g| g["id"].as_str().unwrap()).collect();
    assert_eq!(ids, ["charter", "unconstrained"]);
    assert_eq!(m["groups"][1]["proposals"][0]["id"], "p1");
    let again = json!({"id": "charter", "title": "c", "note": "", "computed": {}, "baseline": {}, "proposals": []});
    let m2 = merge_file(Some(&m), "t", again, &ord, &un);
    assert_eq!(m2["groups"].as_array().unwrap().len(), 2);
    assert_eq!(m2["groups"][0]["proposals"].as_array().unwrap().len(), 0);
    assert_eq!(m2["groups"][1]["proposals"][0]["id"], "p1");

    let old_md = "# Proposals report: t\n\nGenerated.\n\n## Baseline\n\nx\n";
    let ch = Profile { id: "charter".into(), title: "C".into(), ..Profile::unconstrained() };
    let md = merge_report(Some(old_md), "t", &report_section("# Proposals report: t\n\nGen.\n\n## Baseline\n\ny\n", &ch), "charter", &ord, &un);
    assert!(md.find("(charter)").unwrap() < md.find("(unconstrained)").unwrap());
    assert!(md.contains("### Baseline\n\nx") && md.contains("### Baseline\n\ny"));
    let md2 = merge_report(Some(&md), "t", &report_section("# T\n\nGen2.\n\n## Baseline\n\nz\n", &ch), "charter", &ord, &un);
    assert!(md2.contains("Gen2.") && !md2.contains("\ny\n") && md2.contains("### Baseline\n\nx"));
}

// ---------------------------------------------------------------- per-street filters

fn hot_everywhere(study: &Study) -> Hotspots {
    Hotspots { block_ct: vec![10.0; study.idx.blocks.len()], node_ct: vec![10.0; study.net.nodes.len()], mv_ct: Default::default() }
}

#[test]
fn a_crossing_offers_a_filter_on_each_street_besides_the_whole_junction() {
    use traffic_sim::explore::cands::{conflicts, generate_with};
    use traffic_sim::explore::profile::Profile;
    let study = crossing();
    let cands = generate_with(&study, &hot_everywhere(&study), 200, &Profile::unconstrained());
    let at_c: Vec<_> = cands.iter().filter(|c| c.kind == "node_filter" && c.nodes == vec![0]).collect();
    let labels: Vec<&str> = at_c.iter().map(|c| c.label.as_str()).collect();
    assert_eq!(at_c.len(), 3, "{labels:?}");
    assert!(labels.contains(&"Modal filter at Elm Street & Oak Street"), "{labels:?}");
    assert!(labels.contains(&"Modal filter on Elm Street at Elm Street & Oak Street"), "{labels:?}");
    assert!(labels.contains(&"Modal filter on Oak Street at Elm Street & Oak Street"), "{labels:?}");
    let oak = at_c.iter().find(|c| c.label.contains("on Oak Street")).unwrap();
    let legs = oak.iv.legs.clone().unwrap();
    assert_eq!(legs.len(), 4, "both legs of the street, both directions");
    assert!(legs.iter().all(|&l| study.idx.link_name[l as usize] == "Oak Street"));
    assert_eq!(oak.places, vec!["Oak Street".to_string()]);
    for a in &at_c {
        for b in &at_c {
            assert!(conflicts(a, b) || a.key != b.key, "two filters at one junction never share a package");
        }
    }
    // A package of the street filter closes only its legs.
    assert_eq!(oak.kind, "node_filter");
}

#[test]
fn a_t_junction_offers_only_the_side_street_alone() {
    use traffic_sim::explore::cands::street_filters;
    let mut b = B::default();
    let c = b.node(0.0, 0.0, Control::TwoWayStop, false);
    let w = b.node(-150.0, 0.0, Control::Uncontrolled, true);
    let e = b.node(150.0, 0.0, Control::Uncontrolled, true);
    let s = b.node(0.0, -150.0, Control::Uncontrolled, true);
    b.two_way(c, w, "Elm Street", RoadClass::Residential, 11.2, true);
    b.two_way(c, e, "Elm Street", RoadClass::Residential, 11.2, true);
    b.two_way(c, s, "Oak Street", RoadClass::Residential, 11.2, true);
    let study = study_of(Network { version: 1, id: "t".into(), name: "t".into(), nodes: b.nodes, links: b.links, turn_bans: Vec::new() });
    let f = street_filters(&study, c);
    assert_eq!(f.iter().map(|(n, _)| n.as_str()).collect::<Vec<_>>(), vec!["Oak Street"], "closing Elm Street would leave one leg: the whole junction");
    assert_eq!(f[0].1.len(), 2);
}

#[test]
fn per_street_filters_obey_the_profile_limits() {
    use traffic_sim::explore::cands::generate_with;
    use traffic_sim::explore::profile::Profile;
    let study = grid_with_boundary();
    let hot = hot_everywhere(&study);
    let open = generate_with(&study, &hot, 200, &Profile::unconstrained());
    assert!(open.iter().any(|c| c.iv.legs.is_some()), "the grid offers per-street filters");
    let charter = Profile { id: "charter".into(), title: "c".into(), note: String::new(), exclude_types: vec!["speed_hump".into(), "traffic_circle".into()], exclude_boundary: true };
    let cands = generate_with(&study, &hot, 200, &charter);
    let legged: Vec<_> = cands.iter().filter(|c| c.iv.legs.is_some()).collect();
    assert!(!legged.is_empty());
    for c in legged {
        let n = c.iv.node.unwrap();
        assert!(!study.boundary_node[n as usize], "{}", c.label);
        assert!(c.iv.legs.as_ref().unwrap().iter().all(|&l| !study.is_boundary[l as usize]), "{}", c.label);
    }
    let no_filters = Profile { id: "x".into(), title: "x".into(), note: String::new(), exclude_types: vec!["modal_filter".into()], exclude_boundary: false };
    assert!(generate_with(&study, &hot, 200, &no_filters).iter().all(|c| c.iv.ty != "modal_filter"), "excluding modal filters drops the per-street kind too");
}

#[test]
fn a_reference_can_name_one_street_of_a_junction() {
    use traffic_sim::explore::refs::resolve_one;
    let study = crossing();
    let v: Value = serde_json::from_str(r#"{"type":"modal_filter","at":["Oak Street","Elm Street"],"street":"Oak Street"}"#).unwrap();
    let iv = resolve_one(&study, &v).unwrap();
    assert_eq!(iv.node, Some(0));
    assert_eq!(iv.legs.as_ref().map(|l| l.len()), Some(4));
    let bad: Value = serde_json::from_str(r#"{"type":"modal_filter","at":["Oak Street","Elm Street"],"street":"Pine Street"}"#).unwrap();
    assert!(resolve_one(&study, &bad).is_err());
}

// ---------------------------------------------------------------- warm start and consistent options

#[test]
fn listed_options_beat_every_smaller_listed_option_on_through_cars() {
    use traffic_sim::explore::report::{select_options, Final, ThroughHarm};
    let mk = |n: usize, red: f64, harm: f64| Final {
        set: (0..n as u16).collect(),
        reject: None,
        base_vph: 100.0,
        scen_vph: 100.0 - red,
        reduction_pct: red,
        harm,
        worst: 0,
        blocks_above: 0,
        through: ThroughHarm { worst: 0, increase: 0.0, blocks_above: 0 },
        by_period: vec![],
        bounding: vec![],
        inside_pct: 0.0,
        ped_pct: 0.0,
        bike_pct: 0.0,
        score: red - 0.1 * harm,
    };
    // The three-intervention package has less harm than the single one, so it is not dominated, but it cuts through cars less.
    let finals = vec![mk(1, 49.0, 80.0), mk(3, 40.0, 0.0), mk(5, 90.0, 60.0), mk(4, 70.0, 10.0), mk(6, 80.0, 20.0)];
    let (picks, notes) = select_options(&finals, 5, 1.0);
    let listed: Vec<usize> = picks.iter().map(|p| p.idx).collect();
    assert!(!listed.contains(&1), "{listed:?}");
    assert!(notes[1].contains("not listed"), "{}", notes[1]);
    assert!(!listed.contains(&4), "a larger package that cuts less than a smaller listed one is left out: {listed:?}");
    for a in &picks {
        for b in &picks {
            let (x, y) = (&finals[a.idx], &finals[b.idx]);
            if x.set.len() < y.set.len() {
                assert!(y.reduction_pct > x.reduction_pct, "{} interventions cut {}%, {} cut {}%", x.set.len(), x.reduction_pct, y.set.len(), y.reduction_pct);
            }
        }
    }
    assert!(listed.contains(&2) && listed.contains(&0));
}

#[test]
fn decoding_a_link_restores_the_interventions_that_wrote_it() {
    let f = fixture();
    let (net, origin) = fixture_net(&f);
    let study = Study::from_parts("fixture", net.clone(), Demand { version: 1, area: "fixture".into(), intents: Vec::new(), periods: vec![] }, origin, "h".into(), "h".into(), "uncalibrated".into());
    for c in f["cases"].as_array().unwrap() {
        // Like the app, the decoder cannot place a one-way mark on the bend of a street that turns by more than 45 degrees there.
        if c["name"] == "one-way both directions" {
            continue;
        }
        let link = c["link"].as_str().unwrap();
        let ivs = traffic_sim::explore::decode::decode_scenario(&net, &study.topo, origin, link).unwrap();
        let period = c["period"].as_str();
        assert_eq!(study.encode(&ivs, period), link.replace("a=fixture", &format!("a={}", study.area)), "case {}", c["name"]);
    }
    assert!(traffic_sim::explore::decode::decode_scenario(&net, &study.topo, origin, "#v1;a=fixture;s=mf,zzzzzzzzzz").is_err());
    assert!(traffic_sim::explore::decode::decode_scenario(&net, &study.topo, origin, "#v1;a=fixture;s=tc,s00000000h").is_err(), "no intersection there");
}

#[test]
fn a_looser_profile_keeps_every_location_a_stricter_one_gets() {
    use traffic_sim::explore::cands::generate_with;
    use traffic_sim::explore::profile::Profile;
    let study = grid_with_boundary();
    // The bounding street's nodes rank first, so a plain top-n cut would fill with them.
    let mut node_ct = vec![1.0; study.net.nodes.len()];
    for (n, ct) in node_ct.iter_mut().enumerate() {
        if study.boundary_node[n] {
            *ct = 100.0;
        }
    }
    let hot = Hotspots { block_ct: vec![1.0; study.idx.blocks.len()], node_ct, mv_ct: Default::default() };
    let charter = Profile { id: "charter".into(), title: "c".into(), note: String::new(), exclude_types: Vec::new(), exclude_boundary: true };
    for n in [2, 4, 6] {
        let strict = generate_with(&study, &hot, n, &charter);
        let loose = generate_with(&study, &hot, n, &Profile::unconstrained());
        let keys: std::collections::HashSet<&str> = loose.iter().map(|c| c.key.as_str()).collect();
        assert!(!strict.is_empty());
        for c in &strict {
            assert!(keys.contains(c.key.as_str()), "n = {n}: {} is offered under the limits but not without them", c.label);
        }
    }
}

#[test]
fn a_package_that_breaks_the_profile_is_not_used_as_a_warm_start() {
    use traffic_sim::explore::cands::generate_with;
    use traffic_sim::explore::profile::Profile;
    use traffic_sim::explore::report::adopt_warm_start;
    let study = grid_with_boundary();
    let hot = hot_everywhere(&study);
    let open = generate_with(&study, &hot, 200, &Profile::unconstrained());
    let boundary = open.iter().find(|c| c.kind == "modal_filter" && c.nodes.iter().any(|&n| study.boundary_node[n as usize])).expect("a filter by the boundary");
    let inside = open.iter().find(|c| c.kind == "node_filter" && c.nodes.iter().all(|&n| !study.boundary_node[n as usize]) && c.iv.legs.is_none()).expect("an inside filter");
    let hump = open.iter().find(|c| c.kind == "speed_hump").expect("a hump");
    let mut p = params(1);
    p.profile = Profile { id: "charter".into(), title: "c".into(), note: String::new(), exclude_types: vec!["speed_hump".into()], exclude_boundary: true };
    p.warm_start = vec![vec![inside.iv.clone()], vec![inside.iv.clone(), boundary.iv.clone()], vec![inside.iv.clone(), hump.iv.clone()]];
    let mut cands = generate_with(&study, &hot, 200, &p.profile);
    let n_before = cands.len();
    let sets = adopt_warm_start(&study, &p, &mut cands);
    assert_eq!(sets.len(), 1, "only the package that fits the limits is kept");
    assert_eq!(cands.len(), n_before, "its intervention is already a candidate, so nothing is added");
    assert_eq!(cands[sets[0][0] as usize].label, inside.label);
}

#[test]
fn a_warm_start_package_outside_the_candidate_cap_is_screened_and_rechecked() {
    let n = ratrun(true, false);
    let (c_d, e_f) = (n.c_d, n.e_f);
    let study = study_of(n.study_net);
    let pair = vec![
        traffic_sim::model::Intervention { ty: "modal_filter".into(), link: Some(c_d), ..Default::default() },
        traffic_sim::model::Intervention { ty: "modal_filter".into(), link: Some(e_f), ..Default::default() },
    ];
    let mut p = params(2);
    p.candidates = 1;
    let plain = explore(&study, &p);
    p.warm_start = vec![pair];
    let warm = explore(&study, &p);
    let sets: Vec<Vec<String>> = warm
        .finals
        .iter()
        .map(|f| {
            let mut v: Vec<String> = f.set.iter().map(|&i| warm.cands[i as usize].label.clone()).collect();
            v.sort();
            v
        })
        .collect();
    assert!(sets.iter().any(|s| s.len() == 2 && s.iter().all(|l| l.starts_with("Modal filter on"))), "the warm package reaches the recheck: {sets:?}");
    let top = |o: &Outcome| o.finals.iter().filter(|f| f.reject.is_none()).map(|f| f.reduction_pct).fold(f64::NEG_INFINITY, f64::max);
    assert!(top(&warm) >= top(&plain) - 1e-9, "warm {} plain {}", top(&warm), top(&plain));
    assert!(top(&warm) > 60.0, "the pair removes the rat runs: {}", top(&warm));
}

#[test]
fn warm_packages_come_from_matching_groups_only() {
    use serde_json::json;
    let study = crossing();
    let one = traffic_sim::model::Intervention { ty: "traffic_circle".into(), node: Some(0), ..Default::default() };
    let link = study.encode(&[one], None);
    let grp = |id: &str, net: &str, kind: &str| json!({"id": id, "computed": {"networkHash": net, "demandHash": study.demand_hash}, "proposals": [{"id": "p1", "kind": kind, "link": link}]});
    let file = json!({"version": 4, "groups": [grp("charter", &study.net_hash, "search"), grp("old", "other", "search"), grp("ref", &study.net_hash, "reference"), grp("unconstrained", &study.net_hash, "search")]});
    let got = traffic_sim::explore::profile::warm_packages(Some(&file), &study, "unconstrained");
    assert_eq!(got.len(), 1, "the other group with the same hashes, search proposals only");
    assert_eq!(got[0][0].ty, "traffic_circle");
    assert!(traffic_sim::explore::profile::warm_packages(None, &study, "x").is_empty());
}
