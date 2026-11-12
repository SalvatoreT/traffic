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
    let study = Study::from_parts("fixture", net.clone(), Demand { version: 1, area: "fixture".into(), periods: vec![] }, origin, "h".into(), "h".into(), "uncalibrated".into());
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
        self.nodes.push(Node { id, osm_id: id as i64, x, y, control, gate, in_study_area: !gate, marked_crossing: false });
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
        periods: vec![Period {
            id: "p".into(),
            label: "p".into(),
            flows: vec![
                Flow { origin: gw, destination: ge, veh_per_hour: 650.0, mode: FlowMode::Car },
                Flow { origin: ge, destination: gw, veh_per_hour: 650.0, mode: FlowMode::Car },
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
    let base = o.base.full[0].ct_mi;
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
    assert_eq!(a.ct_km.to_bits(), b.ct_km.to_bits());
    assert_eq!(a.flow, b.flow);
    assert!(!b.records.is_empty());
}

#[test]
fn options_are_spread_and_drop_changes_within_noise() {
    use traffic_sim::explore::report::{select_options, Final};
    let mk = |n: usize, red: f64, harm: f64| Final {
        set: (0..n as u16).collect(),
        reject: None,
        base_mi: 100.0,
        scen_mi: 100.0 - red,
        reduction_pct: red,
        harm,
        worst: 0,
        blocks_above: 0,
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
