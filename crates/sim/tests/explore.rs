//! Tests of the proposal search on small synthetic networks, plus the scenario-link encoder against fixtures produced by the
//! TypeScript encoder (`tools/gen-proposal-link-fixtures.ts`).

use serde_json::Value;
use traffic_sim::explore::cands::{generate, Hotspots};
use traffic_sim::explore::naming::{describe, NameIndex};
use traffic_sim::explore::paired::{option_gain, CtPairs, Paired, Status};
use traffic_sim::explore::report::{beats, explore, reduces, Final, Origin, Outcome};
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
    let study = Study::from_parts("fixture", net.clone(), Demand { version: 1, area: "fixture".into(), intents: vec![], ramps: vec![], periods: vec![] }, origin, "h".into(), "h".into(), "uncalibrated".into());
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
                no_pocket: false,
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
    study_with(net, 650.0)
}

fn study_with(net: Network, vph: f64) -> Study {
    let (gw, ge) = (0u32, 3u32);
    let demand = Demand {
        version: 1,
        area: "t".into(),
        intents: Vec::new(),
        ramps: Vec::new(),
        periods: vec![Period {
            id: "p".into(),
            label: "p".into(),
            flows: vec![
                Flow { origin: gw, destination: ge, veh_per_hour: vph, mode: FlowMode::Car, via: None, intent: None },
                Flow { origin: ge, destination: gw, veh_per_hour: vph, mode: FlowMode::Car, via: None, intent: None },
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

/// A final comparison with only means behind it (no seed pairs): the evidence is insufficient, so the practical floor alone screens it.
fn fixture_final(n: usize, red: f64, harm: f64, prior: bool) -> Final {
    Final {
        set: (0..n as u16).collect(),
        base_vph: 100.0,
        scen_vph: 100.0 - red,
        reduction_pct: red,
        harm,
        score: red - 0.1 * harm,
        origin: if prior { Origin { kind: "seed", added: "2026-11-01".into(), note: String::new() } } else { Origin::search() },
        prior,
        ..Final::default()
    }
}

/// A final comparison with one period and one scenario value per seed (seeds 1, 2, ...), against a baseline of 100 through cars an hour on every seed.
fn paired_final(n: usize, scen: &[f64], harm: f64, prior: bool) -> Final {
    let seeds: Vec<u64> = (1..=scen.len() as u64).collect();
    let mean = scen.iter().sum::<f64>() / scen.len() as f64;
    let mut f = fixture_final(n, 100.0 - mean, harm, prior);
    f.scen_vph = mean;
    f.pairs = CtPairs::new(&seeds, vec![vec![100.0; scen.len()]], vec![scen.to_vec()]).unwrap();
    f.effect = f.pairs.effect();
    f
}

/// Ten values with the given mean whose spread is `amp`, alternating around it. `phase` flips the alternation.
fn wobble(mean: f64, amp: f64, phase: bool) -> Vec<f64> {
    (0..10).map(|i| mean + if (i % 2 == 0) == phase { amp } else { -amp }).collect()
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
    let t = &p0["harm"]["through"];
    assert!(t["largestIncrease"]["block"].is_string() && t["blocksAboveBand"].is_u64() && t["blocksResolvedIncrease"].is_u64());
    assert!(t["largestIncrease"]["increaseVehPerHour"].is_number() && t["adjustedPenalty"]["penaltyVehPerHour"].is_number());
    assert!(t.get("worstBlock").is_none() && p0["harm"].get("worstIncreaseVehPerHour").is_none(), "the old single worst-block field is gone");
    let per = &p0["byPeriod"]["p"];
    assert!(per["cutThrough"]["baselineVehPerHour"].as_f64().unwrap() > 5.0);
    let all = &per["allTraffic"];
    for k in ["baselineVehPerHour", "scenarioVehPerHour", "increaseVehPerHour", "throughIncreaseVehPerHour"] {
        assert!(all["largestIncrease"][k].is_number(), "{k}");
    }
    assert!(all["largestIncrease"]["block"].is_string() && all["blocksAboveBand"].is_u64() && all["adjustedPenalty"]["penaltyVehPerHour"].is_number());
    assert!(f.by_period[0].block_through_inc <= f.by_period[0].block_scen - f.by_period[0].block_base + 1.0);
    assert!(p0["summary"].as_str().unwrap().contains("through cars an hour"));
    // The detour goal has no weight, and the displacement rule records what it dropped.
    let obj = &o.json["computed"]["objectives"];
    assert!(obj.get("detourWeightPointsPerSecond").is_none() && obj["detourReductionFloor"] == 0.5);
    assert!(o.json["computed"]["displacement"]["dropped"].is_array() && o.json["computed"]["displacement"]["floorVehPerHour"].is_number());
    assert!(!o.markdown.contains("detour weight") && o.markdown.contains("## Residents' detour"));
}

fn picture_arrays(pr: &Value) -> (Vec<i64>, Vec<i64>, Vec<i64>) {
    let get = |k: &str| pr["picture"][k].as_array().unwrap().iter().map(|v| v.as_i64().unwrap()).collect::<Vec<_>>();
    (get("links"), get("base"), get("scen"))
}

#[test]
fn proposals_carry_a_picture_and_annotate_reproduces_it() {
    use traffic_sim::explore::annotate::annotate;
    let n = ratrun(false, false);
    let study = study_of(n.study_net);
    let p = params(2);
    let o = explore(&study, &p);
    let proposals = o.json["proposals"].as_array().unwrap();
    assert!(!proposals.is_empty());
    assert_eq!(o.json["computed"]["minutes"], 12.0);
    for pr in proposals {
        let pic = &pr["picture"];
        assert_eq!(pic["period"], "p", "the first period when the PM peak was not searched");
        let (links, base, scen) = picture_arrays(pr);
        assert!(!links.is_empty() && links.len() == base.len() && links.len() == scen.len());
        assert!(links.windows(2).all(|w| w[0] < w[1]), "links in id order, each once");
        assert!(base.iter().zip(&scen).all(|(b, s)| *b != 0 || *s != 0), "zeros are omitted");
    }
    let (_, base, scen) = picture_arrays(&proposals[0]);
    assert!(base.iter().sum::<i64>() > scen.iter().sum::<i64>(), "the rat run's filter takes through cars off its links");
    // All cars come beside through cars: same period, ascending links on the measured blocks only, and no link carries fewer cars than through cars.
    let measured = traffic_sim::explore::report::measured_links(&study);
    for pr in proposals {
        let all = &pr["pictureAll"];
        assert_eq!(all["period"], pr["picture"]["period"]);
        let get = |v: &Value, k: &str| v[k].as_array().unwrap().iter().map(|x| x.as_i64().unwrap()).collect::<Vec<_>>();
        let (links, base, scen) = (get(all, "links"), get(all, "base"), get(all, "scen"));
        assert!(!links.is_empty() && links.len() == base.len() && links.len() == scen.len());
        assert!(links.windows(2).all(|w| w[0] < w[1]) && links.iter().all(|&l| measured[l as usize]), "ascending, measured blocks only");
        assert!(base.iter().zip(&scen).all(|(b, s)| *b != 0 || *s != 0), "zeros are omitted");
        let (tl, tb, ts) = picture_arrays(pr);
        for (k, &l) in tl.iter().enumerate().filter(|(_, l)| measured[**l as usize]) {
            let at = links.iter().position(|&x| x == l).expect("a link with through cars carries cars");
            assert!(base[at] >= tb[k] - 1 && scen[at] >= ts[k] - 1, "link {l}: all cars {} {} against through {} {}", base[at], scen[at], tb[k], ts[k]);
        }
    }
    // The file is annotated by a second path with no search: same numbers, whatever `--jobs`.
    let mut file = serde_json::json!({"version": 5, "area": "t", "groups": [o.json.clone()]});
    for pr in file["groups"][0]["proposals"].as_array_mut().unwrap() {
        pr.as_object_mut().unwrap().remove("picture");
        pr.as_object_mut().unwrap().remove("pictureAll");
    }
    let s = annotate(&study, &mut file, 1).unwrap();
    assert_eq!((s.groups, s.packages), (1, proposals.len()));
    assert_eq!(file["groups"][0]["proposals"], o.json["proposals"], "annotate gives the search's own arrays");
    annotate(&study, &mut file, 2).unwrap();
    assert_eq!(file["groups"][0]["proposals"], o.json["proposals"]);
    assert_eq!(file["groups"][0]["computed"], o.json["computed"], "provenance and figures are left as they were");
}

#[test]
fn number_arrays_print_on_one_line_and_read_back_the_same() {
    let v = serde_json::json!({"a": [1, 2, 3], "b": ["x", "y"], "c": {"d": [1.5, -2], "e": []}, "f": [[1, 2], [3]]});
    let t = traffic_sim::explore::util::pretty_json(&v);
    assert!(t.contains("\"a\": [1, 2, 3],"), "{t}");
    assert!(t.contains("\"d\": [1.5, -2]"), "{t}");
    assert!(t.contains("\"b\": [\n"), "{t}");
    assert_eq!(serde_json::from_str::<serde_json::Value>(&t).unwrap(), v);
}

/// A group that annotate must refuse: nothing in the file changes, and the message names the group.
fn assert_refused(study: &Study, group: Value, needle: &str) {
    use traffic_sim::explore::annotate::annotate;
    let mut file = serde_json::json!({"version": 5, "area": "t", "groups": [group]});
    let before = file.clone();
    let e = annotate(study, &mut file, 1).unwrap_err();
    assert!(e.contains("group g") && e.contains(needle), "{e}");
    assert_eq!(file, before);
}

#[test]
fn annotate_refuses_groups_that_do_not_match_this_engine_and_data() {
    let n = ratrun(false, false);
    let study = study_of(n.study_net);
    let o = explore(&study, &params(2));
    let mut g = o.json.clone();
    g["id"] = "g".into();
    // Other data.
    let mut other = g.clone();
    other["computed"]["networkHash"] = "other".into();
    assert_refused(&study, other, "network");
    // The audit's R1: network and demand are unchanged but the engine is not. The old file accepted this and drew new pictures beside old figures.
    let mut code = g.clone();
    code["computed"]["simulator"] = "old-engine".into();
    assert_refused(&study, code, "simulator");
    // The estimator changed.
    let mut method = g.clone();
    method["computed"]["reportMethod"] = "paired-t-0".into();
    assert_refused(&study, method, "reporting method");
    // Older groups lack provenance and are not given the current engine's.
    for key in ["simulator", "reportMethod", "settings", "minutes"] {
        let mut legacy = g.clone();
        legacy["computed"].as_object_mut().unwrap().remove(key);
        assert_refused(&study, legacy, key);
    }
    // The numbers and the pictures carry one fingerprint: what the search writes is the current engine's.
    assert_eq!(o.json["computed"]["simulator"], traffic_sim::FINGERPRINT);
    assert_eq!(o.json["computed"]["reportMethod"], traffic_sim::explore::paired::REPORT_METHOD);
    assert!(o.json["computed"]["settings"]["beam"].is_u64() && o.json["computed"]["sourceRevision"].is_string());
}

#[test]
fn a_file_with_one_bad_group_is_left_whole() {
    use traffic_sim::explore::annotate::annotate;
    let n = ratrun(false, false);
    let study = study_of(n.study_net);
    let o = explore(&study, &params(2));
    let mut bad = o.json.clone();
    bad["id"] = "g".into();
    bad["computed"]["simulator"] = "old-engine".into();
    let mut file = serde_json::json!({"version": 5, "area": "t", "groups": [o.json.clone(), bad]});
    for g in file["groups"].as_array_mut().unwrap() {
        for pr in g["proposals"].as_array_mut().unwrap() {
            pr.as_object_mut().unwrap().remove("picture");
        }
    }
    let before = file.clone();
    assert!(annotate(&study, &mut file, 1).is_err());
    assert_eq!(file, before, "no group gains a picture when another is refused");
}

#[test]
fn through_harm_reports_the_raw_maximum_and_the_penalty_block_apart() {
    use traffic_sim::explore::report::through_harm;
    // Block 1 gains 40 (band 10), block 2 gains 15 (band 2 x 6 = 12): blocks 1 and 2 pass their bands; block 1 is both the raw maximum and the penalty block.
    let h = through_harm(&[2.0, 40.0, 15.0, -30.0], &[1.0, 1.0, 6.0, 1.0]);
    assert_eq!((h.worst, h.blocks_above, h.penalty_block), (1, 2, Some(1)));
    assert_eq!((h.increase, h.penalty), (40.0, 30.0));
    // Nothing beyond noise: the raw maximum is still named, there is no penalty block and the count is zero.
    let n = through_harm(&[3.0, 9.0, -4.0], &[0.0, 0.0, 0.0]);
    assert_eq!((n.worst, n.blocks_above, n.increase, n.penalty_block, n.penalty), (1, 0, 9.0, None, 0.0));
}

/// The audit's R2: block A gains 100 cars an hour with a band of 80, block B gains 50 with a band of 10. B has the larger gain past
/// its band, A has the larger raw gain. The old report named B and gave its 50 as "the block that gains the most".
#[test]
fn the_largest_raw_increase_is_not_the_penalty_block() {
    use traffic_sim::explore::report::through_harm;
    use traffic_sim::explore::search::harm_calc;
    let (inc, sigma) = ([100.0, 50.0], [40.0, 0.0]);
    let h = harm_calc(&inc, &sigma);
    assert_eq!((h.worst, h.worst_adj, h.n_above, h.adj_block), (1, 40.0, 2, Some(1)));
    assert_eq!((h.raw_worst, h.raw_increase), (0, 100.0));
    let t = through_harm(&inc, &sigma);
    assert_eq!((t.worst, t.increase), (0, 100.0), "the named maximum is the raw maximum");
    assert_eq!((t.penalty_block, t.penalty), (Some(1), 40.0));
}

#[test]
fn equal_raw_increases_go_to_the_lowest_block() {
    use traffic_sim::explore::report::through_harm;
    let t = through_harm(&[7.0, 12.0, 12.0, 3.0], &[0.0; 4]);
    assert_eq!((t.worst, t.increase), (1, 12.0));
    let t = through_harm(&[12.0, 12.0], &[0.0, 0.0]);
    assert_eq!(t.worst, 0);
}

#[test]
fn a_filter_that_shifts_traffic_next_door_loses_to_a_two_filter_package() {
    let n = ratrun(true, false);
    let (c_d, e_f) = (n.c_d, n.e_f);
    // 600 veh/h each way: at 650, once vehicles held at a node exit stopped queuing inside the node (expose-junction-fallback-validity),
    // closing one route sent its traffic back to Main Street within the 12 minutes instead of onto the other route.
    let study = study_with(n.study_net, 600.0);
    let mut p = params(4);
    p.candidates = 12;
    let o = explore(&study, &p);
    let cand_of = |link: u32| o.cands.iter().position(|c| c.kind == "modal_filter" && c.iv.link.map_or(false, |l| study.idx.block_of_link[l as usize] == study.idx.block_of_link[link as usize])).expect("filter candidate") as u16;
    let (f1, f2) = (cand_of(c_d), cand_of(e_f));
    let single = |c: u16| &o.state.evals[o.state.cache[&vec![c]]];
    let (s1, s2) = (single(f1), single(f2));
    eprintln!("single filters: R1 -{:.1}% harm {:.0}; R2 -{:.1}% harm {:.0}", s1.reduction_pct, s1.harm, s2.reduction_pct, s2.harm);
    // The two routes share the traffic (the loaded start routes on measured costs); closing one pushes its share onto the other, and the harm shows it.
    let worst_single = if s1.harm > s2.harm { s1 } else { s2 };
    assert!(worst_single.harm > 10.0, "diverted traffic is harm: {}", worst_single.harm);
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
    for k in ["modal_filter", "node_filter", "diagonal_diverter", "one_way", "speed_hump", "traffic_circle", "slow_street", "control", "signal_timing"] {
        assert!(kinds.contains(k), "missing {k}: {kinds:?}");
    }
    assert!(!kinds.contains("speed_limit"), "per-block speed limits are not generated");
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
    use traffic_sim::explore::report::select_options;
    let mk = |n: usize, red: f64, harm: f64| fixture_final(n, red, harm, false);
    let finals = vec![mk(1, 20.0, 0.0), mk(2, 20.5, 0.0), mk(2, 45.0, 20.0), mk(3, 60.0, 30.0), mk(4, 62.0, 90.0), mk(1, 5.0, 60.0), mk(5, 80.0, 40.0), mk(3, 3.0, 0.0)];
    let (picks, notes) = select_options(&finals, 4);
    let chosen: Vec<usize> = picks.iter().map(|p| p.idx).collect();
    assert!(chosen.contains(&0), "best single stays: {chosen:?}");
    assert!(chosen.contains(&6), "best overall (score 76) stays: {chosen:?}");
    assert!(!chosen.contains(&1), "no better than a simpler option");
    assert!(notes[1].contains("does not beat simpler"), "{}", notes[1]);
    assert!(notes[5].contains("dominated"), "{}", notes[5]);
    assert_eq!(chosen.len(), 4);
    let cuts: Vec<f64> = picks.iter().map(|p| finals[p.idx].reduction_pct).collect();
    assert!(cuts.windows(2).all(|w| w[0] >= w[1]), "listed by through cars removed, largest first: {cuts:?}");
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

#[test]
fn rockridge_slow_streets_reference_resolves() {
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
    let pkg = refs.iter().find(|r| r.id == "colby-hillegass-slow-streets").expect("package");
    let ivs = resolve(&study, pkg).unwrap_or_else(|e| panic!("{e}"));
    assert_eq!(ivs.len(), 2);
    let names: Vec<String> = ivs.iter().map(|iv| { assert_eq!(iv.ty, "slow_street"); study.net.links[iv.link.unwrap() as usize].name.clone() }).collect();
    assert_eq!(names, ["Colby Street", "Hillegass Avenue"]);
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
    assert_eq!(m["version"], 5);
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
    assert!(labels.contains(&"Modal filter on Elm Street at Oak Street"), "{labels:?}");
    assert!(labels.contains(&"Modal filter on Oak Street at Elm Street"), "{labels:?}");
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
    use traffic_sim::explore::report::select_options;
    let mk = |n: usize, red: f64, harm: f64| fixture_final(n, red, harm, false);
    // The three-intervention package has less harm than the single one, so it is not dominated, but it cuts through cars less.
    let finals = vec![mk(1, 49.0, 80.0), mk(3, 40.0, 0.0), mk(5, 90.0, 60.0), mk(4, 70.0, 10.0), mk(6, 80.0, 20.0)];
    let (picks, notes) = select_options(&finals, 5);
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
    let study = Study::from_parts("fixture", net.clone(), Demand { version: 1, area: "fixture".into(), intents: Vec::new(), ramps: Vec::new(), periods: vec![] }, origin, "h".into(), "h".into(), "uncalibrated".into());
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

/// Every candidate, written as a link and read back, gives the same effective network (humps included, whichever way the block's first link runs).
#[test]
fn every_candidate_round_trips_to_the_same_effective_network() {
    use traffic_sim::eff::Eff;
    use traffic_sim::explore::decode::decode_scenario;
    for west_first in [false, true] {
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
        if west_first {
            b.two_way(d, c, "Birch Street", RoadClass::Residential, 11.2, true);
        } else {
            b.two_way(c, d, "Birch Street", RoadClass::Residential, 11.2, true);
        }
        b.two_way(d, bb, "Fir Street", RoadClass::Residential, 11.2, true);
        let study = study_of(Network { version: 1, id: "t".into(), name: "t".into(), nodes: b.nodes, links: b.links, turn_bans: Vec::new() });
        let cands = generate(&study, &hot_everywhere(&study), 1000);
        assert!(cands.iter().any(|c| c.kind == "speed_hump"), "a hump is offered");
        for c in &cands {
            let link = study.encode(std::slice::from_ref(&c.iv), Some("p"));
            let back = decode_scenario(&study.net, &study.topo, study.origin, &link).unwrap();
            let (x, y) = (Eff::derive(&study.topo, &study.net, std::slice::from_ref(&c.iv)), Eff::derive(&study.topo, &study.net, &back));
            let same = x.closed == y.closed && x.mv_ok == y.mv_ok && x.limit == y.limit && x.humps == y.humps && x.ctrl == y.ctrl && x.cycle_override == y.cycle_override && x.invalid_ivs == y.invalid_ivs;
            assert!(same, "{} ({}) changes after the link round trip (west_first {west_first})", c.label, c.kind);
        }
    }
}

/// The search's run is the app's run: a loaded start, the same settle interval and counters, every figure over the run from t = 0.
#[test]
fn the_search_run_equals_a_direct_run_as_the_app_does_it() {
    use traffic_sim::explore::run;
    use traffic_sim::{Config, Simulation};
    let n = ratrun(true, false);
    let c_d = n.c_d;
    let study = study_of(n.study_net);
    let iv = Intervention { ty: "modal_filter".into(), link: Some(c_d), ..Default::default() };
    for ivs in [Vec::new(), vec![iv]] {
        let minutes = 10.0;
        let got = run(&study, &ivs, "p", 7, minutes, &[]);
        let cfg = Config { seed: 7, period: "p".into(), interventions: ivs.clone(), ..Default::default() };
        let mut sim = Simulation::from_parts(study.net.clone(), study.demand.clone(), cfg).unwrap();
        let mut t = 0.0;
        while t < minutes * 60.0 - 1e-9 {
            sim.step(5.0);
            t += 5.0;
        }
        let m = sim.metrics();
        assert!(m.initial_agents > 0);
        assert_eq!(got.ct_vph, m.cut_through.vehicles_per_hour);
        assert_eq!((got.spawned, got.completed, got.veh_km), (m.spawned, m.completed_trips, m.veh_km));
        let (exits, ct) = (sim.diagnostics().link_exits.to_vec(), sim.cut_through_exits());
        let hours = minutes / 60.0;
        for l in 0..exits.len() {
            assert_eq!(got.flow[l], (exits[l] as f64 / hours) as f32, "flow on link {l}");
            assert_eq!(got.through[l], (ct[l] as f64 / hours) as f32, "through cars on link {l}");
        }
    }
}

/// A package from a stricter group is rechecked even when the screening budget is spent, and it is not dropped as within noise of a simpler one.
#[test]
fn a_stricter_groups_package_is_always_rechecked_and_never_dropped_as_noise() {
    let n = ratrun(true, false);
    let (c_d, e_f) = (n.c_d, n.e_f);
    let study = study_of(n.study_net);
    let pair = vec![
        traffic_sim::model::Intervention { ty: "modal_filter".into(), link: Some(c_d), ..Default::default() },
        traffic_sim::model::Intervention { ty: "modal_filter".into(), link: Some(e_f), ..Default::default() },
    ];
    let mut p = params(2);
    p.candidates = 12;
    p.budget_evals = Some(1);
    p.warm_start = vec![pair];
    let o = explore(&study, &p);
    assert!(o.state.exhausted, "the budget ran out");
    let f = o.finals.iter().find(|f| f.set.len() == 2 && f.forced).expect("the stricter group's package is rechecked");
    assert!(f.reject.is_none() && f.reduction_pct > 60.0, "{}", f.reduction_pct);
    // Dropping as no better than a simpler package is not applied to it.
    let (_, notes) = traffic_sim::explore::report::select_options(&o.finals, 6);
    let i = o.finals.iter().position(|g| g.forced).unwrap();
    assert!(!notes[i].contains("does not beat simpler"), "{}", notes[i]);
}

/// A reference package that strands a block is still reported, with the access problem flagged on it.
#[test]
fn a_reference_that_strands_a_block_is_flagged_not_dropped() {
    use traffic_sim::explore::refs::RefCfg;
    let n = ratrun(false, true);
    let study = study_of(n.study_net);
    let mut p = params(2);
    p.references = vec![
        serde_json::from_value::<RefCfg>(serde_json::json!({"id": "stub", "title": "Close the court", "interventions": [{ "type": "modal_filter", "on": "Maple Court", "between": ["Birch Street", "Maple Court"] }]})).unwrap(),
        serde_json::from_value::<RefCfg>(serde_json::json!({"id": "birch", "title": "Close Birch", "interventions": [{ "type": "modal_filter", "on": "Birch Street", "between": ["Cedar Street", "Fir Street"] }]})).unwrap(),
    ];
    let o = explore(&study, &p);
    assert_eq!(o.ref_finals.len(), 2);
    assert!(o.ref_finals[0].access.as_deref().map_or(false, |w| w.contains("strands")), "{:?}", o.ref_finals[0].access);
    assert!(o.ref_finals[1].access.is_none());
    let props = o.json["proposals"].as_array().unwrap();
    let stub = props.iter().find(|x| x["id"] == "stub").expect("the reference is published");
    assert!(stub["accessProblem"].as_str().is_some());
    assert!(props.iter().find(|x| x["id"] == "birch").unwrap().get("accessProblem").is_none());
}

// ---------------------------------------------------------------- known packages (seeds)

fn filter_on(link: u32) -> Intervention {
    Intervention { ty: "modal_filter".into(), link: Some(link), ..Default::default() }
}

fn seed_entry(study: &Study, ivs: &[Intervention], source: &str, last_published: &str, score: f64) -> traffic_sim::explore::seeds::Entry {
    traffic_sim::explore::seeds::Entry {
        link: study.encode(ivs, Some("p")),
        source: source.into(),
        note: if source == "hand" { "added for the test".into() } else { String::new() },
        added: "2026-11-01".into(),
        last_published: last_published.into(),
        group: "g".into(),
        size: ivs.len(),
        change_pct: None,
        score: Some(score),
    }
}

fn with_known(study: &Study, p: &mut Params, entries: Vec<traffic_sim::explore::seeds::Entry>) {
    let file = traffic_sim::explore::seeds::SeedFile { version: 1, area: "t".into(), cap: 30, seeds: entries };
    let (known, dropped) = traffic_sim::explore::seeds::prepare(study, &file);
    p.known = known;
    p.known_dropped = dropped;
}

#[test]
fn seeds_are_keyed_by_their_items_not_their_order_or_period() {
    use traffic_sim::explore::seeds::key;
    assert_eq!(key("#v1;a=t;p=p;s=mf,aaaaaaaaaa~mn,bbbbbbbbbb"), key("#v1;a=t;s=mn,bbbbbbbbbb~mf,aaaaaaaaaa"));
    assert_ne!(key("#v1;a=t;s=mf,aaaaaaaaaa"), key("#v1;a=t;s=mf,aaaaaaaaab"));
    assert_eq!(key("#v1;a=t"), "");
}

#[test]
fn a_seed_that_no_longer_decodes_or_is_forbidden_or_repeated_is_dropped_with_its_reason() {
    use traffic_sim::explore::cands::generate_with;
    use traffic_sim::explore::profile::Profile;
    let study = grid_with_boundary();
    let hot = hot_everywhere(&study);
    let open = generate_with(&study, &hot, 200, &Profile::unconstrained());
    let boundary = open.iter().find(|c| c.kind == "modal_filter" && c.nodes.iter().any(|&n| study.boundary_node[n as usize])).expect("a filter by the boundary");
    let inside = open.iter().find(|c| c.kind == "node_filter" && c.nodes.iter().all(|&n| !study.boundary_node[n as usize]) && c.iv.legs.is_none()).expect("an inside filter");
    let other = open.iter().find(|c| c.kind == "node_filter" && c.nodes.iter().all(|&n| !study.boundary_node[n as usize]) && c.iv.legs.is_none() && c.nodes != inside.nodes).expect("a second inside filter");
    let mut p = params(2);
    p.profile = Profile { id: "charter".into(), title: "c".into(), note: String::new(), exclude_types: Vec::new(), exclude_boundary: true };
    let good = vec![inside.iv.clone(), other.iv.clone()];
    let reversed = vec![other.iv.clone(), inside.iv.clone()];
    let mut stale = seed_entry(&study, &good, "search", "2026-11-02", 5.0);
    stale.link = "#v1;a=t;p=p;s=mf,zzzzzzzzzz".into();
    with_known(
        &study,
        &mut p,
        vec![
            seed_entry(&study, &good, "search", "2026-11-02", 5.0),
            seed_entry(&study, &reversed, "search", "2026-11-03", 6.0),
            seed_entry(&study, &[inside.iv.clone(), boundary.iv.clone()], "search", "2026-11-02", 7.0),
            stale,
        ],
    );
    assert_eq!(p.known_dropped.len(), 1);
    assert!(p.known_dropped[0].reason.contains("no longer decodes"), "{}", p.known_dropped[0].reason);
    let mut cands = generate_with(&study, &hot, 200, &p.profile);
    let pkgs: Vec<Vec<Intervention>> = p.known.iter().map(|k| k.ivs.clone()).collect();
    let got = traffic_sim::explore::report::adopt_packages(&study, &p, &mut cands, &pkgs, "known package");
    assert_eq!(got.len(), 3);
    assert!(got[0].is_ok() && got[1].is_ok(), "the same package written in either order is accepted by the adopter");
    assert_eq!(got[0], got[1], "and both give the same candidate set, so the run keeps one");
    assert!(got[2].as_ref().unwrap_err().contains("not allowed"), "{:?}", got[2]);
}

#[test]
fn the_seeds_file_dedupes_and_keeps_to_its_cap_dropping_the_oldest_weakest() {
    use traffic_sim::explore::seeds::{add, enforce_cap, record, SeedFile};
    let study = ratrun_study();
    let mk = |i: u32, source: &str, published: &str, score: f64| {
        let mut e = seed_entry(&study, &[filter_on(i)], source, published, score);
        e.link = format!("#v1;a=t;s=mf,9q9p3cx{i:03}");
        e
    };
    let mut f = SeedFile { version: 1, area: "t".into(), cap: 4, seeds: Vec::new() };
    assert!(add(&mut f, mk(1, "search", "2026-11-01", 30.0)));
    assert!(!add(&mut f, mk(1, "search", "2026-11-01", 99.0)), "the same package is not added twice");
    for (i, (src, date, score)) in [("hand", "", 0.0), ("search", "2026-11-01", 10.0), ("search", "2026-11-03", 50.0)].into_iter().enumerate() {
        add(&mut f, mk(i as u32 + 2, src, date, score));
    }
    assert_eq!(f.seeds.len(), 4);
    // A run today publishes a new package and re-publishes an old one with new figures: the file is over its cap by one.
    let again = mk(1, "search", "2026-11-15", 77.0);
    record(&mut f, vec![mk(9, "search", "2026-11-15", 1.0), again], "2026-11-15");
    assert_eq!(f.seeds.len(), 4, "cut to the cap");
    let links: Vec<&str> = f.seeds.iter().map(|e| e.link.as_str()).collect();
    assert!(links.contains(&"#v1;a=t;s=mf,9q9p3cx002"), "a hand-added package is never dropped: {links:?}");
    assert!(links.contains(&"#v1;a=t;s=mf,9q9p3cx009") && links.contains(&"#v1;a=t;s=mf,9q9p3cx001"), "packages published today stay: {links:?}");
    assert!(!links.contains(&"#v1;a=t;s=mf,9q9p3cx003"), "of the rest, the oldest and weakest goes: {links:?}");
    let e = f.seeds.iter().find(|e| e.link.ends_with("001")).unwrap();
    assert_eq!((e.added.as_str(), e.score), ("2026-11-01", Some(77.0)), "a re-published package keeps its first date and takes the new figures");
    enforce_cap(&mut f, "2026-11-15");
    assert_eq!(f.seeds.len(), 4);
}

fn ratrun_study() -> Study {
    study_of(ratrun(true, false).study_net)
}

#[test]
fn sub_packages_remove_one_intervention_each() {
    use traffic_sim::explore::search::Family;
    use traffic_sim::explore::seeds::sub_packages;
    let subs = sub_packages(&[3, 1, 2]);
    assert_eq!(subs.len(), 3);
    for s in &subs {
        assert_eq!(s.len(), 2);
        assert!(s.windows(2).all(|w| w[0] < w[1]));
    }
    assert!(subs.contains(&vec![1, 2]) && subs.contains(&vec![1, 3]) && subs.contains(&vec![2, 3]));
    assert!(sub_packages(&[5]).is_empty());
    let f = Family::new(&[3, 1, 3, 2]);
    assert_eq!(f.set, vec![1, 2, 3]);
    assert_eq!(f.subs.len(), 3);
}

/// A known package of three interventions on a network with two rat runs: it and each package one smaller are screened, whatever the
/// candidate cap, and the best of them starts a beam of its own.
#[test]
fn a_known_package_and_its_sub_packages_are_screened_and_start_a_beam() {
    let n = ratrun(true, false);
    let (c_d, e_f) = (n.c_d, n.e_f);
    let study = study_of(n.study_net);
    let slow = Intervention { ty: "speed_limit".into(), link: Some(c_d + 2), speed: Some(6.7), ..Default::default() };
    let triple = vec![filter_on(c_d), filter_on(e_f), slow];
    let mut p = params(2);
    p.candidates = 1;
    p.depth = 3;
    with_known(&study, &mut p, vec![seed_entry(&study, &triple, "search", "2026-11-10", 50.0)]);
    assert_eq!(p.known.len(), 1);
    let o = explore(&study, &p);
    assert!(o.state.evals.iter().all(|e| e.set.len() <= p.depth), "no package is grown past the search depth");
    let cache = &o.state.cache;
    let ids: Vec<u16> = triple.iter().map(|iv| traffic_sim::explore::cands::adopt(&study, &mut o.cands.clone(), iv)).collect();
    let mut all = ids.clone();
    all.sort_unstable();
    assert!(cache.contains_key(&all), "the known package itself is screened");
    for k in 0..3 {
        let mut sub: Vec<u16> = ids.iter().enumerate().filter(|(i, _)| *i != k).map(|(_, &c)| c).collect();
        sub.sort_unstable();
        assert!(cache.contains_key(&sub), "sub-package without intervention {k} is screened");
    }
    assert!(o.state.log.iter().any(|l| l.starts_with("known packages:") && l.contains("starting point")), "{:?}", o.state.log);
}

/// Known packages are rechecked in full even when the screening budget is spent, they compete on equal terms (they are not exempt from
/// being dropped as within noise of a simpler option), and the output says where each option came from and what became of the seeds file.
#[test]
fn known_packages_are_rechecked_eligible_and_reported_with_their_origin() {
    let n = ratrun(true, false);
    let (c_d, e_f) = (n.c_d, n.e_f);
    let study = study_of(n.study_net);
    let pair = vec![filter_on(c_d), filter_on(e_f)];
    let mut p = params(2);
    p.candidates = 12;
    p.budget_evals = Some(1);
    let mut stale = seed_entry(&study, &pair, "search", "2026-11-10", 50.0);
    stale.link = "#v1;a=t;p=p;s=mf,zzzzzzzzzz".into();
    with_known(&study, &mut p, vec![seed_entry(&study, &pair, "hand", "", 0.0), stale]);
    let o = explore(&study, &p);
    assert!(o.state.exhausted);
    let f = o.finals.iter().find(|f| f.set.len() == 2 && f.origin.kind == "hand").expect("the known package is rechecked though the budget is spent");
    assert!(f.reject.is_none() && f.reduction_pct > 60.0 && !f.forced, "{}", f.reduction_pct);
    assert_eq!(f.origin.note, "added for the test");
    assert_eq!((o.known.loaded, o.known.rechecked, o.known.dropped.len()), (2, 1, 1));
    let props = o.json["proposals"].as_array().unwrap();
    assert!(props.iter().all(|x| x["origin"]["kind"].is_string()));
    let kc = &o.json["computed"]["knownPackages"];
    assert_eq!((kc["loaded"].as_u64(), kc["rechecked"].as_u64(), kc["dropped"].as_u64()), (Some(2), Some(1), Some(1)));
    assert_eq!(kc["droppedBy"][0]["reason"], "no longer decodes on this network");
    assert_eq!(kc["droppedPackages"][0]["link"], "#v1;a=t;p=p;s=mf,zzzzzzzzzz");
    assert!(o.markdown.contains("## Known packages") && o.markdown.contains("Dropped:"));
    // Published options become seeds for the next run, and the rechecked known package can be among them.
    assert_eq!(o.published.len(), o.picks.len());
    assert!(o.published.iter().all(|e| e.source == "search" && e.link.starts_with("#v1;a=t;p=p;s=")));
    let picked = o.picks.iter().find(|pk| o.finals[pk.idx].origin.kind == "hand");
    if let Some(pk) = picked {
        let j = o.json["proposals"].as_array().unwrap().iter().find(|x| x["origin"]["kind"] == "hand").unwrap();
        assert_eq!(j["origin"]["added"], "2026-11-01");
        assert!(pk.why.len() > 0);
    }
}

#[test]
fn an_option_published_before_is_kept_over_a_new_one_it_is_not_beaten_by() {
    use traffic_sim::explore::report::select_options;
    let mk = |n: usize, red: f64, harm: f64, prior: bool| fixture_final(n, red, harm, prior);
    // With no seed pairs only the 1-point practical floor screens: a new package 0.5 point ahead of the published one does not beat it.
    let finals = vec![mk(4, 70.0, 10.0, true), mk(4, 70.5, 10.0, false), mk(1, 30.0, 0.0, false), mk(2, 50.0, 5.0, false)];
    let (picks, notes) = select_options(&finals, 4);
    let chosen: Vec<usize> = picks.iter().map(|p| p.idx).collect();
    assert!(chosen.contains(&0) && !chosen.contains(&1), "{chosen:?}");
    assert!(notes[1].contains("which an earlier search published"), "{}", notes[1]);
    // A new package that wins by more than the floor replaces it.
    let finals = vec![mk(4, 70.0, 10.0, true), mk(4, 80.0, 10.0, false), mk(1, 30.0, 0.0, false)];
    let (picks, notes) = select_options(&finals, 4);
    let chosen: Vec<usize> = picks.iter().map(|p| p.idx).collect();
    assert!(chosen.contains(&1) && !chosen.contains(&0), "{chosen:?}");
    assert!(notes[0].contains("dominated"), "{}", notes[0]);
    // A new package with much less harm is not dropped for a published one that has more.
    let finals = vec![mk(4, 70.0, 90.0, true), mk(4, 72.0, 5.0, false), mk(1, 30.0, 0.0, false)];
    let (picks, _) = select_options(&finals, 4);
    assert!(picks.iter().any(|p| p.idx == 1));
    // The lightest option is always listed, even when no single intervention is.
    let finals = vec![mk(2, 40.0, 0.0, false), mk(5, 90.0, 10.0, false)];
    let (picks, _) = select_options(&finals, 4);
    let light = picks.iter().find(|p| p.idx == 0).expect("the lightest option is listed");
    assert!(light.why.contains("lightest"), "{}", light.why);
}

/// Task 2.6: stability is decided by the paired comparison on the same seeds, not by a band from the baseline's spread.
#[test]
fn retention_uses_the_paired_difference_between_options() {
    use traffic_sim::explore::report::select_options;
    // Both new packages are 2 points ahead of the published one on average. One leads on every seed; the other's lead flips sign.
    let published = paired_final(4, &wobble(30.0, 10.0, true), 10.0, true);
    let steady: Vec<f64> = wobble(30.0, 10.0, true).iter().map(|x| x - 2.0).collect();
    let flips = wobble(28.0, 10.0, false);
    let (a, b) = (paired_final(4, &steady, 10.0, false), paired_final(4, &flips, 10.0, false));
    assert!((a.reduction_pct - b.reduction_pct).abs() < 1e-9, "the same 2-point mean lead");
    assert!(beats(&a, &published), "a lead on every seed is resolved");
    assert!(!beats(&b, &published), "the same mean lead with the sign flipping is unresolved");
    let light = paired_final(1, &wobble(80.0, 1.0, true), 0.0, false);
    let (picks, notes) = select_options(&[published.clone(), a.clone(), light.clone()], 4);
    let chosen: Vec<usize> = picks.iter().map(|p| p.idx).collect();
    assert!(chosen.contains(&1) && !chosen.contains(&0), "the steady lead replaces the published option: {chosen:?} {notes:?}");
    let (picks, notes) = select_options(&[published, b, light], 4);
    let chosen: Vec<usize> = picks.iter().map(|p| p.idx).collect();
    assert!(chosen.contains(&0) && !chosen.contains(&1), "the unresolved lead leaves the published option: {chosen:?}");
    assert!(notes[1].contains("which an earlier search published"), "{}", notes[1]);
}

/// Candidates offered without limits include every candidate offered under them, with the seeds on the list too, and the group without
/// limits never ends up worse than the stricter one.
#[test]
fn the_unconstrained_search_offers_everything_charter_does_and_is_never_worse() {
    use traffic_sim::explore::profile::Profile;
    let study = grid_with_boundary();
    let charter = Profile { id: "charter".into(), title: "c".into(), note: String::new(), exclude_types: vec!["speed_hump".into()], exclude_boundary: true };
    let mut p = params(2);
    p.candidates = 6;
    p.depth = 2;
    p.beam = 2;
    p.profile = charter;
    let strict = explore(&study, &p);
    let sc = strict.finals.iter().filter(|f| f.reject.is_none()).map(|f| f.reduction_pct).fold(f64::NEG_INFINITY, f64::max);
    // The strict run's published options become the loose run's seeds.
    let entries: Vec<_> = strict.picks.iter().map(|pk| seed_entry(&study, &strict.finals[pk.idx].set.iter().map(|&c| strict.cands[c as usize].iv.clone()).collect::<Vec<_>>(), "search", "2026-11-15", strict.finals[pk.idx].score)).collect();
    let mut q = params(2);
    q.candidates = 6;
    q.depth = 2;
    q.beam = 2;
    with_known(&study, &mut q, entries);
    let loose = explore(&study, &q);
    let keys: std::collections::HashSet<&str> = loose.cands.iter().map(|c| c.key.as_str()).collect();
    for c in strict.cands.iter().filter(|c| !c.key.starts_with("seed:")) {
        assert!(keys.contains(c.key.as_str()), "{} is offered under the limits but not without them", c.label);
    }
    let lc = loose.finals.iter().filter(|f| f.reject.is_none()).map(|f| f.reduction_pct).fold(f64::NEG_INFINITY, f64::max);
    assert!(lc >= sc - 1e-9, "without limits {lc} is worse than with them {sc}");
}

#[test]
fn partial_packages_are_ranked_with_the_harm_weight_phased_in() {
    use traffic_sim::explore::search::{rank_value, rank_weight, Eval};
    let mut p = params(1);
    p.depth = 6;
    p.harm_weight = 0.1;
    assert_eq!(rank_weight(&p, 1), 0.0);
    assert!((rank_weight(&p, 6) - 0.1).abs() < 1e-12 && (rank_weight(&p, 9) - 0.1).abs() < 1e-12);
    assert!(rank_weight(&p, 2) > 0.0 && rank_weight(&p, 3) > rank_weight(&p, 2) && rank_weight(&p, 5) < 0.1);
    let mk = |n: usize, red: f64, harm: f64| Eval { set: (0..n as u16).collect(), reject: None, reduction_pct: red, harm, worst: 0, inc: Vec::new(), score: red - 0.1 * harm, detour_s: Some(0.0) };
    // A filter that cuts through cars the most but displaces them ranks above a mild measure while it stands alone, and below it once the package is whole.
    let (bold, mild) = (|n| mk(n, 14.0, 94.0), |n| mk(n, 9.5, 2.0));
    assert!(rank_value(&p, &bold(1)) > rank_value(&p, &mild(1)));
    assert!(rank_value(&p, &bold(6)) < rank_value(&p, &mild(6)));
    assert!(bold(1).score < mild(1).score, "the published score always uses the full weight");
}

#[test]
fn the_beam_takes_one_variant_per_place() {
    use traffic_sim::explore::search::{distinct_places, places_of, Ctx};
    let study = ratrun_study();
    let mut p = params(2);
    p.candidates = 12;
    p.depth = 2;
    let o = explore(&study, &p);
    let ctx = Ctx { study: &study, p: &p, cands: &o.cands, base: &o.base };
    let singles: Vec<usize> = (0..o.state.evals.len()).filter(|&i| o.state.evals[i].set.len() == 1 && o.state.evals[i].valid()).collect();
    let places: Vec<_> = singles.iter().map(|&i| places_of(&ctx, &o.state.evals[i].set)).collect();
    assert!(places.iter().enumerate().any(|(i, a)| places[..i].contains(a)), "the block offers a filter, one-ways and a limit at one place");
    let kept = distinct_places(&ctx, &o.state, &singles, 100);
    let kept_places: Vec<_> = kept.iter().map(|&i| places_of(&ctx, &o.state.evals[i].set)).collect();
    for (i, a) in kept_places.iter().enumerate() {
        assert!(!kept_places[..i].contains(a), "one package per set of places");
    }
    assert!(kept.len() < singles.len());
    assert_eq!(kept[0], singles[0], "the best-ranked variant is the one kept");
    assert_eq!(distinct_places(&ctx, &o.state, &singles, 2).len(), 2, "the width still applies");
}

/// `--depth` is the most interventions a package may have: a known package with more is dropped with that reason, and the search never builds one.
#[test]
fn a_known_package_larger_than_the_search_depth_is_dropped() {
    let n = ratrun(true, false);
    let (c_d, e_f) = (n.c_d, n.e_f);
    let study = study_of(n.study_net);
    let slow = Intervention { ty: "speed_limit".into(), link: Some(c_d + 2), speed: Some(6.7), ..Default::default() };
    let triple = vec![filter_on(c_d), filter_on(e_f), slow];
    let mut p = params(2);
    p.depth = 2;
    with_known(&study, &mut p, vec![seed_entry(&study, &triple, "search", "2026-11-10", 50.0), seed_entry(&study, &triple[..2], "search", "2026-11-10", 40.0)]);
    let o = explore(&study, &p);
    assert_eq!((o.known.loaded, o.known.rechecked, o.known.dropped.len()), (2, 1, 1));
    assert!(o.known.dropped[0].reason.contains("more than the search depth of 2"), "{}", o.known.dropped[0].reason);
    assert!(o.state.evals.iter().all(|e| e.set.len() <= 2));
    assert!(o.finals.iter().all(|f| f.set.len() <= 2));
}

// ---------------------------------------------------------------- paired uncertainty (audit finding R3)

/// Baseline flows [100, 100, 100, ...] against scenario flows with the same mean but different spread. The baseline spread is zero in both,
/// so the old band classified both increases the same way.
#[test]
fn equal_means_with_different_paired_spread_get_different_summaries() {
    use traffic_sim::explore::search::harm_calc;
    assert_eq!(harm_calc(&[20.0], &[0.0]).n_above, 1, "the old rule saw only the baseline spread: both are 'above the band'");
    let steady = vec![20.0; 10];
    let wide = wobble(20.0, 40.0, true);
    let (a, b) = (Paired::of(&steady), Paired::of(&wide));
    assert!((a.mean - b.mean).abs() < 1e-9);
    assert_eq!(a.status(), Status::Positive);
    assert_eq!(b.status(), Status::Unresolved);
    assert!(b.half.unwrap() > 10.0 && a.half.unwrap() < 1e-9);
}

#[test]
fn period_aggregation_pairs_by_seed_and_cancels_what_cancels() {
    // Two periods whose scenario effect swings oppositely from seed to seed. Per period the effect is unresolved; the equal-weight mean of
    // the periods within each seed (the published headline) is constant, and its interval says so.
    let seeds: Vec<u64> = (1..=10).collect();
    let swing: Vec<f64> = (0..10).map(|i| if i % 2 == 0 { 15.0 } else { -15.0 }).collect();
    let base = vec![vec![100.0; 10], vec![100.0; 10]];
    let scen = vec![swing.iter().map(|d| 90.0 + d).collect(), swing.iter().map(|d| 90.0 - d).collect()];
    let c = CtPairs::new(&seeds, base, scen).unwrap();
    assert_eq!(c.period_effect(0).status(), Status::Unresolved);
    assert_eq!(c.period_effect(1).status(), Status::Unresolved);
    let e = c.effect();
    assert_eq!(e.status(), Status::Negative);
    assert!((e.mean + 10.0).abs() < 1e-9 && e.sd < 1e-9);
}

#[test]
fn one_seed_or_missing_pairs_give_insufficient_evidence_not_zero_variance() {
    let seeds = [1u64, 2, 3];
    assert!(CtPairs::new(&seeds, vec![vec![100.0, 100.0, 100.0]], vec![vec![90.0, 90.0]]).is_err(), "a scenario run is missing");
    assert!(CtPairs::new(&seeds, vec![vec![100.0, 100.0]], vec![vec![90.0, 90.0, 90.0]]).is_err(), "a baseline run is missing");
    let one = CtPairs::new(&[1], vec![vec![100.0]], vec![vec![60.0]]).unwrap();
    let e = one.effect();
    assert_eq!((e.n, e.half, e.status()), (1, None, Status::Insufficient));
    let few = CtPairs::new(&seeds, vec![vec![100.0; 3]], vec![vec![60.0, 61.0, 59.0]]).unwrap().effect();
    assert_eq!(few.status(), Status::Insufficient, "an interval exists but three seeds make no statement");
    // Options paired on other seeds are not comparable.
    let a = CtPairs::new(&[1, 2], vec![vec![100.0; 2]], vec![vec![60.0; 2]]).unwrap();
    let b = CtPairs::new(&[3, 4], vec![vec![100.0; 2]], vec![vec![60.0; 2]]).unwrap();
    assert!(option_gain(&a, &b).is_none());
    // With too few pairs only the floor screens a reduction, and the package is still reported.
    let f = fixture_final(1, 5.0, 0.0, false);
    assert!(reduces(&f));
    assert!(!reduces(&fixture_final(1, 0.5, 0.0, false)));
}

#[test]
fn an_unresolved_reduction_is_not_an_established_one() {
    // A mean cut of 10% that swings between a 40% cut and a 20% rise across ten seeds.
    let scen: Vec<f64> = (0..10).map(|i| if i % 2 == 0 { 60.0 } else { 120.0 }).collect();
    let f = paired_final(1, &scen, 0.0, false);
    assert!((f.reduction_pct - 10.0).abs() < 1e-9);
    assert_eq!(f.effect.status(), Status::Unresolved);
    assert!(!reduces(&f));
    let (picks, notes) = traffic_sim::explore::report::select_options(&[f], 3);
    assert!(picks.is_empty() && notes[0].contains("not an established reduction"), "{notes:?}");
}

#[test]
fn the_search_estimates_come_from_paired_runs_and_say_so() {
    let n = ratrun(false, false);
    let study = study_of(n.study_net);
    let mut p = params(2);
    p.seeds = (1..=10).collect();
    p.minutes = 6.0;
    p.screen_minutes = 4.0;
    p.candidates = 6;
    p.depth = 1;
    p.beam = 2;
    let o = explore(&study, &p);
    assert!(!o.picks.is_empty());
    let pr = &o.json["proposals"][0];
    let e = &pr["cutThrough"]["effect"];
    assert_eq!(e["n"], 10);
    assert_eq!(e["status"], "decrease", "{e}");
    assert!(e["interval"][1].as_f64().unwrap() < 0.0);
    assert_eq!(pr["evidence"]["role"], "selection");
    assert_eq!(pr["evidence"]["seeds"].as_array().unwrap().len(), 10);
    assert_eq!(o.json["computed"]["estimation"]["selection"]["estimates"], "exploratory");
    assert_eq!(o.json["computed"]["estimation"]["minPairs"], 10);
    assert!(o.json["computed"]["estimation"]["scope"].as_str().unwrap().contains("calibration"));
    let f = &o.shown[0];
    assert_eq!(f.effect, f.pairs.effect());
    assert_eq!(f.pairs.seeds, p.seeds);
    // The raw maximum's before and after values are those of the block it names.
    let t = &f.through;
    assert!((t.scen - t.base - t.increase).abs() < 1e-6, "{} {} {}", t.base, t.scen, t.increase);
    assert!((t.effect.mean - t.increase).abs() < 1e-6);
}

#[test]
fn a_frozen_shortlist_on_unused_seeds_is_a_confirmation() {
    let n = ratrun(false, false);
    let study = study_of(n.study_net);
    let mut p = params(2);
    p.seeds = vec![1, 2];
    p.confirm_seeds = (101..=110).collect();
    p.minutes = 6.0;
    p.screen_minutes = 4.0;
    p.candidates = 6;
    p.depth = 1;
    p.beam = 2;
    let o = explore(&study, &p);
    assert!(!o.picks.is_empty());
    let c = &o.json["computed"];
    assert_eq!(c["seeds"], serde_json::json!((101..=110).collect::<Vec<u64>>()));
    let sel = &c["estimation"]["selection"];
    assert_eq!(sel["estimates"], "confirmation");
    assert_eq!(sel["discoverySeeds"], serde_json::json!([1, 2]));
    assert_eq!(sel["confirmationSeeds"].as_array().unwrap().len(), 10);
    assert_eq!(sel["shortlist"].as_array().unwrap().len(), o.picks.len());
    let pr = &o.json["proposals"][0];
    assert_eq!(pr["evidence"]["role"], "confirmation");
    assert_eq!(pr["cutThrough"]["effect"]["n"], 10);
    assert!(o.shown.iter().all(|f| f.pairs.seeds.iter().all(|s| *s > 100)));
    let detour = &pr["residentsDetour"];
    assert_eq!(detour["coverage"]["baselineRequests"], 0);
    assert_eq!(detour["coverage"]["supportedPairs"], 0);
    assert_eq!(detour["cutoffMinutes"], 6.0);
    assert!(detour["secondsPerTrip"].is_null() && detour["effect"].is_null());
    assert!(!pr["objectives"].as_array().unwrap().iter().any(|obj| obj == "least-detour"));
}


// ---------------------------------------------------------------- similar options, variants and the order of the list

mod similar_options {
    use super::*;
    use traffic_sim::explore::similar::{dedupe, differences, order_options, similar, Why};

    fn with(set: &[u16], places: &[&str], red: f64, change: &[f64]) -> Final {
        let mut f = fixture_final(set.len(), red, 0.0, false);
        f.set = set.to_vec();
        f.places = places.iter().map(|s| s.to_string()).collect();
        f.block_change = change.to_vec();
        f
    }

    #[test]
    fn packages_at_the_same_places_are_similar_and_the_one_that_wins_the_paired_comparison_is_kept() {
        let a = with(&[0, 1], &["b1", "n2"], 40.0, &[-10.0, 0.0, 5.0]);
        let b = with(&[0, 2], &["b1", "n2"], 52.0, &[-30.0, 4.0, 0.0]);
        assert_eq!(similar(&a, &b), Some(Why::Places));
        let (kept, folds) = dedupe(&[a, b], &[0, 1]);
        assert_eq!(kept, vec![1]);
        assert_eq!((folds[0].from, folds[0].into), (0, 1));
    }

    #[test]
    fn one_change_apart_and_not_different_on_through_cars_is_similar_and_fewer_changes_win() {
        let small = with(&[0, 1], &["b1", "b2"], 40.0, &[-10.0, 0.0]);
        let big = with(&[0, 1, 2], &["b1", "b2", "b3"], 40.4, &[0.0, -40.0]);
        assert_eq!(similar(&small, &big), Some(Why::OneChange));
        let (kept, folds) = dedupe(&[small.clone(), big.clone()], &[1, 0]);
        assert_eq!(kept, vec![0]);
        assert_eq!(folds[0].why, Why::OneChange);
        // A package that cuts clearly more is a different option, not a variant.
        let better = with(&[0, 1, 2], &["b1", "b2", "b3"], 60.0, &[0.0, -40.0]);
        assert_eq!(similar(&small, &better), None);
        // Two changes apart is not one change.
        let far = with(&[0, 3, 4], &["b1", "b4", "b5"], 40.2, &[0.0, -40.0]);
        assert_eq!(similar(&small, &far), None);
    }

    #[test]
    fn nearly_identical_pictures_are_similar_and_different_ones_are_not() {
        let a = with(&[0, 1], &["b1", "b2"], 40.0, &[-20.0, -10.0, 4.0, 0.0]);
        let b = with(&[2, 3], &["b3", "b4"], 40.2, &[-20.0, -10.5, 4.0, 0.0]);
        match similar(&a, &b) {
            Some(Why::Picture(d)) => assert!(d < 0.1, "{d}"),
            other => panic!("{other:?}"),
        }
        let c = with(&[2, 3], &["b3", "b4"], 40.2, &[0.0, -10.0, -20.0, 4.0]);
        assert_eq!(similar(&a, &c), None);
        let (none, other) = (with(&[5, 6], &["b5", "b6"], 40.0, &[]), with(&[7, 8], &["b7", "b8"], 40.0, &[]));
        assert_eq!(similar(&none, &other), None);
    }

    #[test]
    fn ties_keep_fewer_changes_then_the_smaller_rise_then_the_published_one_then_the_earlier() {
        let mut a = with(&[0, 1], &["b1", "b2"], 40.0, &[-10.0, 0.0]);
        let mut b = with(&[2, 3], &["b1", "b2"], 40.0, &[-10.0, 0.0]);
        let (kept, _) = dedupe(&[a.clone(), b.clone()], &[0, 1]);
        assert_eq!(kept, vec![0], "the earlier finalist");
        b.prior = true;
        let (kept, _) = dedupe(&[a.clone(), b.clone()], &[0, 1]);
        assert_eq!(kept, vec![1], "the one an earlier search published");
        let mut pr = traffic_sim::explore::report::PeriodRes {
            base_through: 0.0, scen_through: 0.0, cut_pct: 0.0, effect: Paired::none(), worst: 0, block_base: 100.0, block_scen: 130.0, block_through_inc: 0.0,
            block_effect: Paired::none(), penalty_block: None, penalty: 0.0, blocks_above: 0,
        };
        a.by_period = vec![pr.clone()];
        pr.block_scen = 110.0;
        b.by_period = vec![pr];
        let (kept, _) = dedupe(&[a.clone(), b.clone()], &[0, 1]);
        assert_eq!(kept, vec![1], "the smaller largest all-car rise comes before publication history");
        let single = with(&[7], &["b1", "b2"], 40.0, &[-10.0, 0.0]);
        let (kept, _) = dedupe(&[a, single], &[0, 1]);
        assert_eq!(kept, vec![1], "fewer changes come first");
    }

    #[test]
    fn the_list_is_ordered_by_through_cars_removed_then_fewer_changes_then_the_smaller_rise() {
        let mut v = vec![with(&[0, 1, 2], &[], 30.0, &[]), with(&[0], &[], 20.0, &[]), with(&[0, 1], &[], 30.0, &[]), with(&[0, 1], &[], 50.0, &[])];
        v.sort_by(order_options);
        let got: Vec<(usize, f64)> = v.iter().map(|f| (f.set.len(), f.reduction_pct)).collect();
        assert_eq!(got, vec![(2, 50.0), (2, 30.0), (3, 30.0), (1, 20.0)]);
        use traffic_sim::explore::report::select_options;
        let finals = vec![fixture_final(1, 20.0, 0.0, false), fixture_final(4, 70.0, 30.0, false), fixture_final(2, 45.0, 10.0, false)];
        let (picks, notes) = select_options(&finals, 5);
        assert_eq!(picks.iter().map(|p| p.idx).collect::<Vec<_>>(), vec![1, 2, 0]);
        assert!(notes[1].starts_with("chosen as option 1"), "{}", notes[1]);
    }

    #[test]
    fn folded_packages_become_variant_lines_on_the_kept_option() {
        use traffic_sim::explore::report::{select_with_folds, similar_out};
        let n = ratrun(false, false);
        let study = study_of(n.study_net);
        let p = params(1);
        let base = traffic_sim::explore::search::run_baseline(&study, &p);
        let cands = traffic_sim::explore::search::make_cands(&study, &base, &p);
        let ctx = traffic_sim::explore::search::Ctx { study: &study, p: &p, cands: &cands, base: &base };
        assert!(cands.len() >= 3);
        // Two packages with the same candidate set minus one: a dropped change, and an added one.
        let (a, b) = (vec![0u16, 1], vec![0u16]);
        assert_eq!(differences(&ctx, &a, &b), vec![format!("Drop: {}", cands[1].label)]);
        assert_eq!(differences(&ctx, &b, &a), vec![format!("Add: {}", cands[1].label)]);
        // A candidate at the same place as another is a swap.
        let twin = (0..cands.len() as u16).find(|&c| c != 0 && traffic_sim::explore::search::places_of(&ctx, &[c]) == traffic_sim::explore::search::places_of(&ctx, &[0]));
        if let Some(t) = twin {
            assert_eq!(differences(&ctx, &[0], &[t]), vec![format!("Use {} instead of {}", cands[t as usize].label, cands[0].label)]);
        }
        // Through the selection: the folded package comes out as a variant of the kept one with its link and figures.
        let mut kept = fixture_final(1, 40.5, 10.0, false);
        kept.set = vec![0, 1];
        kept.places = vec!["x".into()];
        let mut dup = fixture_final(1, 40.0, 0.0, false);
        dup.set = vec![0, 2];
        dup.places = vec!["x".into()];
        let finals = vec![kept, dup];
        let (picks, _, folds) = select_with_folds(&finals, 4);
        assert_eq!(picks.len(), 1);
        let out = similar_out(&ctx, &finals, &picks, &folds);
        assert_eq!(out.variants[0].len(), 1);
        let v = &out.variants[0][0];
        assert_eq!(v.differs, vec![format!("Use {} instead of {}", cands[2].label, cands[1].label)]);
        assert!(v.link.starts_with("#v1;"), "{}", v.link);
        assert_eq!(out.folded[0]["intoPublished"], true);
    }
}

#[test]
fn access_and_turn_candidates_follow_the_searched_periods() {
    let mut b = B::default();
    for (x, y, gate) in [(0., 0., true), (100., 0., false), (300., 0., false), (150., 150., false)] {
        b.node(x, y, Control::Uncontrolled, gate);
    }
    // A gate feeds a direct block and a bypass; the bypass is banned only at peak.
    for (n, (a, z)) in [(0, 1), (1, 2), (1, 3), (3, 2), (2, 0)].into_iter().enumerate() {
        let cls = if n == 0 { RoadClass::Secondary } else { RoadClass::Residential };
        b.two_way(a, z, &format!("Street {n}"), cls, 10., true);
        b.links.pop();
        b.links.last_mut().unwrap().reverse = None;
    }
    let net = Network { version: 1, id: "p".into(), name: "p".into(), nodes: b.nodes, links: b.links, turn_bans: vec![TurnBan { from: 0, to: 2, periods: vec!["pm".into()] }] };
    let periods = ["midday", "pm"].into_iter().map(|id| Period { id: id.into(), label: id.into(), flows: vec![] }).collect();
    let d = Demand { version: 1, area: "p".into(), intents: vec![], ramps: vec![], periods };
    let study = Study::from_parts("p", net, d, (0., 0.), String::new(), String::new(), String::new());
    let iv = vec![Intervention { ty: "modal_filter".into(), link: Some(1), ..Default::default() }];
    use traffic_sim::explore::{check_access_for, cands::generate_for, profile::Profile};
    assert!(check_access_for(&study, &iv, ["midday"]).is_ok());
    assert!(check_access_for(&study, &iv, ["midday", "pm"]).unwrap_err().contains("pm: strands"));
    let mut h = hot_everywhere(&study);
    h.mv_ct.insert((0, 2), 100.0);
    let has_turn = |periods: &[&str]| generate_for(&study, &h, 10, &Profile::unconstrained(), periods.iter().copied()).iter().any(|c| c.iv.ty == "turn_ban" && c.iv.from_link == Some(0) && c.iv.to_link == Some(2));
    assert!(!has_turn(&["pm"]));
    assert!(has_turn(&["midday"]));
    assert!(has_turn(&["pm", "midday"]));
}
