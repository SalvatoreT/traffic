//! Finite-space search benchmark, bypass supplement and supplementary search moves (change improve-proposal-search-coverage), on small
//! synthetic networks. Street names and ids are arbitrary; nothing here depends on a real study area.

use std::collections::{BTreeMap, HashMap};
use std::sync::Arc;
use traffic_sim::explore::bench::{self, Case, CandSpec, RunSpec, SearchCfg};
use traffic_sim::explore::cands::{self, adopt, Cand, Hotspots};
use traffic_sim::explore::profile::Profile;
use traffic_sim::explore::search::*;
use traffic_sim::explore::supplement::{self, Move};
use traffic_sim::explore::{bypass, Params, Study};
use traffic_sim::model::*;

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
    fn two_way(&mut self, a: u32, b: u32, name: &str, class: RoadClass, limit: f64, in_study: bool) -> u32 {
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
        id
    }
    fn network(self) -> Network {
        Network { version: 1, id: "t".into(), name: "t".into(), nodes: self.nodes, links: self.links, turn_bans: Vec::new() }
    }
}

fn study(net: Network, flows: &[(u32, u32, f64)]) -> Study {
    let demand = Demand {
        version: 1,
        area: "t".into(),
        intents: Vec::new(),
        ramps: Vec::new(),
        periods: vec![Period { id: "p".into(), label: "p".into(), flows: flows.iter().map(|&(o, d, v)| Flow { origin: o, destination: d, veh_per_hour: v, mode: FlowMode::Car, via: None, intent: None }).collect() }],
    };
    Study::from_parts("t", net, demand, (-122.25, 37.84), "h".into(), "h".into(), "uncalibrated".into())
}

/// An arterial between two gates with two parallel local rat runs. Returns the study and the first link of each rat run's middle block.
fn ratruns() -> (Study, u32, u32, u32) {
    let mut b = B::default();
    let gw = b.node(-500.0, 0.0, Control::Uncontrolled, true);
    let a = b.node(-250.0, 0.0, Control::Uncontrolled, false);
    let bb = b.node(250.0, 0.0, Control::Uncontrolled, false);
    let ge = b.node(500.0, 0.0, Control::Uncontrolled, true);
    let c = b.node(-120.0, -100.0, Control::TwoWayStop, false);
    let d = b.node(120.0, -100.0, Control::TwoWayStop, false);
    let e = b.node(-120.0, 130.0, Control::TwoWayStop, false);
    let f = b.node(120.0, 130.0, Control::TwoWayStop, false);
    b.two_way(gw, a, "Main Street", RoadClass::Secondary, 6.0, false);
    b.two_way(a, bb, "Main Street", RoadClass::Secondary, 6.0, true);
    b.two_way(bb, ge, "Main Street", RoadClass::Secondary, 6.0, false);
    let a_c = b.two_way(a, c, "Cedar Street", RoadClass::Residential, 11.2, true);
    let c_d = b.two_way(c, d, "Birch Street", RoadClass::Residential, 11.2, true);
    b.two_way(d, bb, "Fir Street", RoadClass::Residential, 11.2, true);
    b.two_way(a, e, "Alder Street", RoadClass::Residential, 11.2, true);
    let e_f = b.two_way(e, f, "Hazel Street", RoadClass::Residential, 11.2, true);
    b.two_way(f, bb, "Pine Street", RoadClass::Residential, 11.2, true);
    (study(b.network(), &[(gw, ge, 650.0), (ge, gw, 650.0)]), c_d, e_f, a_c)
}

fn iv(ty: &str) -> Intervention {
    Intervention { ty: ty.into(), ..Default::default() }
}

fn small_case(c_d: u32, e_f: u32, a_c: u32) -> Case {
    let spec = |id: &str, iv: Intervention| CandSpec { id: id.into(), iv, origin: None };
    Case {
        schema: bench::CASE_SCHEMA.into(),
        id: "synthetic".into(),
        area: "t".into(),
        selection: "test".into(),
        inputs: BTreeMap::new(),
        period: "p".into(),
        depth: 3,
        baseline_seeds: vec![1, 2, 3],
        screen: vec![RunSpec { minutes: 8.0, seeds: vec![1] }, RunSpec { minutes: 8.0, seeds: vec![1, 2, 3] }],
        full: RunSpec { minutes: 12.0, seeds: vec![1, 2, 3] },
        search: SearchCfg { beam: 2, expand: 4, finalists: 6, harm_weight: 0.1 },
        confirm: Some(RunSpec { minutes: 12.0, seeds: vec![11, 12] }),
        candidates: vec![
            spec("f1", Intervention { link: Some(c_d), ..iv("modal_filter") }),
            spec("f2", Intervention { link: Some(e_f), ..iv("modal_filter") }),
            spec("ow", Intervention { link: Some(c_d), ..iv("one_way") }),
            spec("slow", Intervention { link: Some(a_c), ..iv("slow_street") }),
        ],
        known: vec![vec!["f1".into(), "slow".into()]],
        coverage: BTreeMap::from([("filters".to_string(), vec!["f1".to_string(), "f2".to_string()])]),
    }
}

fn tmp(name: &str) -> std::path::PathBuf {
    let d = std::env::temp_dir().join(format!("search-bench-{}-{name}", std::process::id()));
    let _ = std::fs::remove_dir_all(&d);
    std::fs::create_dir_all(&d).unwrap();
    d
}

#[test]
fn enumeration_counts_and_conflicts() {
    let (s, c_d, e_f, a_c) = ratruns();
    let case = small_case(c_d, e_f, a_c);
    let cs = bench::case_cands(&s, &case).unwrap();
    let (ok, bad) = bench::enumerate(&cs, 3);
    assert_eq!(ok.len() + bad.len(), 4 + 6 + 4, "all nonempty subsets of four up to three");
    assert!(bad.iter().all(|(set, (a, b))| set.contains(a) && set.contains(b)));
    assert!(bad.iter().any(|(set, _)| set == &vec![0, 2]), "a filter and a one-way on the same block conflict");
    assert!(ok.windows(2).all(|w| w[0].len() < w[1].len() || (w[0].len() == w[1].len() && w[0] < w[1])), "size then lexicographic order");
}

#[test]
fn equivalent_candidates_are_one() {
    let (s, c_d, e_f, a_c) = ratruns();
    let mut case = small_case(c_d, e_f, a_c);
    case.candidates.push(CandSpec { id: "f1-reverse".into(), iv: Intervention { link: Some(c_d + 1), ..iv("modal_filter") }, origin: None });
    let e = bench::case_cands(&s, &case).err().unwrap();
    assert!(e.contains("duplicates"), "{e}");
}

#[test]
fn table_evaluation_is_the_screening_evaluation_and_replay_is_the_live_search() {
    let (s, c_d, e_f, a_c) = ratruns();
    let case = small_case(c_d, e_f, a_c);
    let dir = tmp("table");
    let out = dir.join("r.json");
    let res = bench::build_table(&s, &dir, &case, "sha", &out, 3, None).unwrap().expect("complete");
    let again: bench::Results = serde_json::from_slice(&std::fs::read(&out).unwrap()).unwrap();
    assert_eq!(serde_json::to_value(&again.packages).unwrap(), serde_json::to_value(&res.packages).unwrap());
    assert!(bench::verify(&res, &s, &dir, &case, "sha").is_empty());
    // Resume: a second call reads the partial file and runs nothing.
    let res2 = bench::build_table(&s, &dir, &case, "sha", &out, 2, Some(0)).unwrap().expect("complete from the checkpoint");
    assert_eq!(serde_json::to_value(&res2.packages).unwrap(), serde_json::to_value(&res.packages).unwrap());

    // The live screening evaluation on the same baseline.
    let cs = bench::case_cands(&s, &case).unwrap();
    let mut p = case.params(3);
    p.seeds = vec![1, 2, 3];
    p.screen_minutes = 8.0;
    p.minutes = 12.0;
    let base = run_baseline(&s, &p);
    let ctx = Ctx { study: &s, p: &p, cands: &cs, base: &base };
    let table = bench::screen_table(&res, &case, &case.screen[0]);
    for (set, (e, charged)) in &table.rows {
        if !charged {
            assert!(traffic_sim::explore::check_access(&s, &ctx.ivs(set)).is_err());
            continue;
        }
        let live = eval_screen(&ctx, set);
        assert_eq!(live.reject, e.reject, "{set:?}");
        assert_eq!(live.reduction_pct.to_bits(), e.reduction_pct.to_bits(), "{set:?}");
        assert_eq!(live.harm.to_bits(), e.harm.to_bits(), "{set:?}");
        assert_eq!(live.score.to_bits(), e.score.to_bits(), "{set:?}");
        assert_eq!(live.detour_s.map(f64::to_bits), e.detour_s.map(f64::to_bits), "{set:?}");
        assert_eq!(live.inc, e.inc, "{set:?}");
        assert_eq!(live.worst, e.worst, "{set:?}");
    }

    // The live search and its replay on the table ask for the same packages in the same order and are charged the same.
    let mut live = SearchState::new();
    bench::production_beam(&ctx, &mut live, &[]);
    let shared = Arc::new(table);
    let mut replay = SearchState::replay(shared.clone());
    bench::production_beam(&ctx, &mut replay, &[]);
    assert_eq!(live.evals.iter().map(|e| &e.set).collect::<Vec<_>>(), replay.evals.iter().map(|e| &e.set).collect::<Vec<_>>());
    assert_eq!(live.used, replay.used);
    // Replays are isolated: a second one on the same table starts from nothing and does the same.
    let mut again = SearchState::replay(shared.clone());
    bench::production_beam(&ctx, &mut again, &[]);
    assert_eq!(again.used, replay.used);
    assert!(again.evals.len() < shared.rows.len() || shared.rows.len() == again.evals.len(), "a replay sees only what it asks for");

    // Analysis, decision and confirmation run end to end and are deterministic.
    let a1 = bench::analyze(&s, &case, &res);
    let a2 = bench::analyze(&s, &case, &res);
    assert_eq!(a1, a2);
    let runs = a1["runs"].as_array().unwrap();
    assert_eq!(runs.iter().filter(|r| r["setting"] == "8m-x1").count(), 2 * bench::methods().len(), "every method, cold and known");
    assert_eq!(runs.iter().filter(|r| r["setting"] == "8m-x3").count(), 2, "the unchanged beam on the other setting");
    let beam = runs.iter().find(|r| r["method"] == "beam" && r["mode"] == "cold" && r["setting"] == "8m-x1").unwrap();
    for r in runs.iter().filter(|r| r["setting"] == "8m-x1" && r["mode"] == "cold") {
        let m = r["method"].as_str().unwrap();
        let (c, b) = (r["charged"].as_u64().unwrap(), beam["charged"].as_u64().unwrap());
        if m.ends_with("@equal") && m != "wide@equal" {
            assert!(c <= b, "{m}: an equal-budget run costs no more than the beam ({c} > {b})");
        }
        if m.ends_with("@extra") {
            assert!(c <= b + bench::allowance(b as usize) as u64, "{m}");
        }
    }
    assert_eq!(a1["coverageGroups"][0]["group"], "filters");
    let mut other = a1.clone();
    other["case"] = serde_json::json!("held-out");
    let d = bench::decide(&[a1.clone(), other], "synthetic", &HashMap::new());
    assert_eq!(d["heldOut"], serde_json::json!(["held-out"]));
    assert!(d["search"]["challengers"].as_array().unwrap().len() == 4);
    let conf = dir.join("c.json");
    bench::confirm(&s, &case, &res, &conf, 3).unwrap();
    let shortlist = std::fs::read(dir.join("c.shortlist.json")).unwrap();
    bench::confirm(&s, &case, &res, &conf, 3).unwrap();
    assert_eq!(std::fs::read(dir.join("c.shortlist.json")).unwrap(), shortlist, "the frozen shortlist is not rewritten");
    let c: serde_json::Value = serde_json::from_slice(&std::fs::read(&conf).unwrap()).unwrap();
    assert!(c["packages"].as_array().unwrap().len() >= 2, "baseline and at least one package");
    let mut bad = case.clone();
    bad.confirm = Some(RunSpec { minutes: 12.0, seeds: vec![2, 11] });
    assert!(bench::confirm(&s, &bad, &res, &dir.join("x.json"), 1).is_err(), "confirmation seeds may not overlap the search's");
    let _ = std::fs::remove_dir_all(&dir);
}

#[test]
fn a_replay_never_sees_rows_it_did_not_ask_for() {
    let (s, c_d, e_f, a_c) = ratruns();
    let case = small_case(c_d, e_f, a_c);
    let cs = bench::case_cands(&s, &case).unwrap();
    let nb = s.harm_blocks.len();
    let ev = |set: Vec<u16>, red: f64| Eval { set, reject: None, reduction_pct: red, harm: 0.0, worst: 0, inc: vec![0.0; nb], score: red, detour_s: Some(0.0) };
    let mut rows = HashMap::new();
    for (set, _) in bench::enumerate(&cs, 3).0.iter().map(|s| (s.clone(), ())) {
        let red = if set == vec![1, 3] { 99.0 } else { set.len() as f64 };
        rows.insert(set.clone(), (ev(set, red), true));
    }
    let table = Arc::new(ScreenTable { rows });
    let p = Params { beam: 1, expand: 1, depth: 2, ..case.params(1) };
    let base = bench::empty_baseline(&s);
    let ctx = Ctx { study: &s, p: &p, cands: &cs, base: &base };
    let mut st = SearchState::replay(table.clone());
    beam_search_in(&ctx, &[], &BeamLimit::main(&p), &mut st);
    assert!(st.cache.len() <= table.rows.len());
    for e in &st.evals {
        assert!(table.rows.contains_key(&e.set));
    }
    let best_seen = st.evals.iter().map(|e| e.score).fold(f64::NEG_INFINITY, f64::max);
    if !st.cache.contains_key(&vec![1, 3]) {
        assert!(best_seen < 99.0, "an unrequested row cannot raise the search's best");
    }
}

#[test]
fn ties_go_to_fewer_changes_then_the_smaller_set() {
    let (s, c_d, e_f, a_c) = ratruns();
    let cs = bench::case_cands(&s, &small_case(c_d, e_f, a_c)).unwrap();
    let ev = |set: Vec<u16>, score: f64| Eval { set, reject: None, reduction_pct: score, harm: 0.0, worst: 0, inc: vec![], score, detour_s: Some(0.0) };
    let pool = [ev(vec![0, 1], 10.0), ev(vec![1], 10.0), ev(vec![0], 10.0)];
    let refs: Vec<&Eval> = pool.iter().collect();
    let b = bench::objective_best(&cs, &refs, traffic_sim::explore::objectives::Objective::MostRemoved, 0.0).unwrap();
    assert_eq!(b.set, vec![0]);
    assert!((bench::spearman(&[1.0, 2.0, 3.0], &[10.0, 20.0, 30.0]) - 1.0).abs() < 1e-12);
    assert!((bench::spearman(&[1.0, 2.0, 3.0], &[3.0, 2.0, 1.0]) + 1.0).abs() < 1e-12);
}

// ---------------------------------------------------------------- pruning fixtures on hand-made screening tables

/// A plain grid of local streets inside two gates, used only for candidate identities (no simulation).
fn grid() -> Study {
    let mut b = B::default();
    let gw = b.node(-800.0, 0.0, Control::Uncontrolled, true);
    let ge = b.node(800.0, 0.0, Control::Uncontrolled, true);
    let mut n = Vec::new();
    for j in 0..3 {
        for i in 0..4 {
            n.push(b.node(-300.0 + 200.0 * i as f64, 200.0 * j as f64, Control::Uncontrolled, false));
        }
    }
    let at = |i: usize, j: usize| n[j * 4 + i];
    b.two_way(gw, at(0, 0), "Gate Road", RoadClass::Secondary, 11.2, false);
    b.two_way(at(3, 0), ge, "Gate Road", RoadClass::Secondary, 11.2, false);
    for j in 0..3 {
        for i in 0..3 {
            b.two_way(at(i, j), at(i + 1, j), &format!("Row {j}"), RoadClass::Residential, 11.2, true);
        }
    }
    for i in 0..4 {
        for j in 0..2 {
            b.two_way(at(i, j), at(i, j + 1), &format!("Column {i}"), RoadClass::Residential, 11.2, true);
        }
    }
    study(b.network(), &[])
}

struct Fixture {
    study: Study,
    cands: Vec<Cand>,
}

fn fixture(ivs: &[Intervention]) -> Fixture {
    let study = grid();
    let mut cands = Vec::new();
    for iv in ivs {
        adopt(&study, &mut cands, iv);
    }
    assert_eq!(cands.len(), ivs.len());
    Fixture { study, cands }
}

fn table_of(f: &Fixture, depth: usize, red: impl Fn(&[u16]) -> f64) -> Arc<ScreenTable> {
    let nb = f.study.harm_blocks.len();
    let mut rows = HashMap::new();
    for set in bench::enumerate(&f.cands, depth).0 {
        let r = red(&set);
        rows.insert(set.clone(), (Eval { set, reject: None, reduction_pct: r, harm: 0.0, worst: 0, inc: vec![0.0; nb], score: r, detour_s: Some(0.0) }, true));
    }
    Arc::new(ScreenTable { rows })
}

fn params(depth: usize, beam: usize, expand: usize) -> Params {
    let mut p = Params::new("t");
    p.periods = vec!["p".into()];
    p.depth = depth;
    p.beam = beam;
    p.expand = expand;
    p.finalists = 4;
    p.jobs = 1;
    p
}

fn node_iv(ty: &str, n: u32) -> Intervention {
    Intervention { node: Some(n), ..iv(ty) }
}

#[test]
fn weak_singles_that_work_together_are_reached_only_by_the_supplement() {
    // Candidates: a strong filter, and two filters that each make things worse alone but remove most through traffic together.
    let f = fixture(&[node_iv("modal_filter", 3), node_iv("modal_filter", 5), node_iv("modal_filter", 10)]);
    let table = table_of(&f, 2, |s| match s {
        [0] => 20.0,
        [1] | [2] => -3.0,
        [1, 2] => 60.0,
        _ => 15.0,
    });
    let p = params(2, 1, 4);
    let base = bench::empty_baseline(&f.study);
    let ctx = Ctx { study: &f.study, p: &p, cands: &f.cands, base: &base };
    let mut st = SearchState::replay(table.clone());
    bench::production_beam(&ctx, &mut st, &[]);
    assert!(!st.cache.contains_key(&vec![1, 2]), "the beam never pairs two singles that worsen through traffic");
    let trace = st.trace.clone().unwrap();
    assert!(trace.iter().any(|e| e["event"] == "singles" && e["nonPositive"].as_array().map_or(false, |v| v.len() == 2)), "the pruning is recorded");
    let used = st.used;
    let rec = supplement::run(&ctx, &mut st, &[Move::Coordinated], 2, &[((1, 2), 0.0)], &[]);
    assert!(st.cache.contains_key(&vec![1, 2]), "{rec}");
    assert!(st.used <= used + 2);
    let best = st.evals.iter().filter(|e| e.valid()).max_by(|a, b| a.score.total_cmp(&b.score)).unwrap();
    assert_eq!(best.set, vec![1, 2]);
}

#[test]
fn a_junction_variant_that_loses_alone_returns_inside_another_package() {
    // Two designs at one junction (a whole-junction filter and a diverter) and a separate change elsewhere.
    let f = fixture(&[node_iv("modal_filter", 7), Intervention { bearing: Some(45.0), ..node_iv("diagonal_diverter", 7) }, node_iv("modal_filter", 12)]);
    assert!(cands::conflicts(&f.cands[0], &f.cands[1]), "designs at one junction conflict");
    let table = table_of(&f, 2, |s| match s {
        [0] => 20.0,
        [1] => 15.0,
        [2] => 10.0,
        [0, 2] => 25.0,
        [1, 2] => 45.0,
        _ => 0.0,
    });
    let p = params(2, 2, 4);
    let base = bench::empty_baseline(&f.study);
    let ctx = Ctx { study: &f.study, p: &p, cands: &f.cands, base: &base };
    let mut st = SearchState::replay(table.clone());
    bench::production_beam(&ctx, &mut st, &[]);
    assert!(!st.cache.contains_key(&vec![1, 2]), "the losing design is never extended");
    let trace = st.trace.clone().unwrap();
    assert!(trace.iter().any(|e| e["event"] == "select" && e["samePlace"].as_array().map_or(false, |v| v.iter().any(|x| x["set"] == serde_json::json!([1])))), "the same-place drop is recorded");
    supplement::run(&ctx, &mut st, &[Move::Swap], 3, &[], &[]);
    assert!(st.cache.contains_key(&vec![1, 2]));
    assert!(st.evals.iter().all(|e| !(e.set.contains(&0) && e.set.contains(&1))), "never both designs at one junction");
}

#[test]
fn deleting_a_change_from_a_finalist() {
    // The beam reaches the triple only through a repair move; the pair inside it that leaves out the strong single is never asked for.
    let f = fixture(&[node_iv("modal_filter", 3), node_iv("modal_filter", 5), node_iv("modal_filter", 10)]);
    let hb = (0..f.study.harm_blocks.len()).find(|&h| {
        let b = &f.study.idx.blocks[f.study.harm_blocks[h]];
        b.a == 5 || b.b == 5
    })
    .unwrap();
    let nb = f.study.harm_blocks.len();
    let mut rows = HashMap::new();
    for set in bench::enumerate(&f.cands, 3).0 {
        let r = match set.as_slice() {
            [0] => 10.0,
            [1] => -1.0,
            [2] => 8.0,
            [0, 2] => 12.0,
            [0, 1, 2] => 30.0,
            [1, 2] => 29.0,
            _ => 5.0,
        };
        let mut inc = vec![0.0f32; nb];
        if set == vec![0, 2] {
            inc[hb] = 50.0;
        }
        rows.insert(set.clone(), (Eval { set, reject: None, reduction_pct: r, harm: 0.0, worst: 0, inc, score: r, detour_s: Some(0.0) }, true));
    }
    let table = Arc::new(ScreenTable { rows });
    let p = params(3, 1, 2);
    let base = bench::empty_baseline(&f.study);
    let ctx = Ctx { study: &f.study, p: &p, cands: &f.cands, base: &base };
    let mut st = SearchState::replay(table.clone());
    bench::production_beam(&ctx, &mut st, &[]);
    assert!(st.cache.contains_key(&vec![0, 1, 2]), "the repair move reaches the triple");
    assert!(!st.cache.contains_key(&vec![1, 2]));
    assert!(st.trace.as_ref().unwrap().iter().any(|e| e["event"] == "repair"), "the repair move is recorded");
    let rec = supplement::run(&ctx, &mut st, &[Move::Delete], 4, &[], &[]);
    assert!(st.cache.contains_key(&vec![1, 2]), "{rec}");
    assert_eq!(rec["stop"], "queues empty");
    // With known packages the sub-packages are screened by the beam itself, and charged as the mandatory recheck work.
    let mut known = SearchState::replay(table);
    bench::production_beam(&ctx, &mut known, &[vec![0, 1, 2]]);
    assert!(known.cache.contains_key(&vec![1, 2]));
}

// ---------------------------------------------------------------- quiet legal bypass

/// Two parallel local streets between the same cross streets: `busy` carries the through traffic, `quiet` is the legal way around a
/// closure on it. `offset` dummy nodes shift every id, and the names are given, so nothing can depend on either.
fn ladder(busy: &str, quiet: &str, offset: usize) -> (Study, Vec<u32>, Vec<u32>) {
    let mut b = B::default();
    for k in 0..offset {
        b.node(5000.0 + k as f64, 5000.0, Control::Uncontrolled, true);
    }
    let gw = b.node(-900.0, 0.0, Control::Uncontrolled, true);
    let ge = b.node(900.0, 0.0, Control::Uncontrolled, true);
    let lo: Vec<u32> = (0..4).map(|i| b.node(-300.0 + 200.0 * i as f64, 0.0, Control::Uncontrolled, false)).collect();
    let hi: Vec<u32> = (0..4).map(|i| b.node(-300.0 + 200.0 * i as f64, 150.0, Control::Uncontrolled, false)).collect();
    b.two_way(gw, lo[0], "West Road", RoadClass::Secondary, 11.2, false);
    b.two_way(lo[3], ge, "East Road", RoadClass::Secondary, 11.2, false);
    let mut busy_links = Vec::new();
    let mut quiet_links = Vec::new();
    for i in 0..3 {
        busy_links.push(b.two_way(lo[i], lo[i + 1], busy, RoadClass::Residential, 11.2, true));
        quiet_links.push(b.two_way(hi[i], hi[i + 1], quiet, RoadClass::Residential, 11.2, true));
    }
    for i in 0..4 {
        b.two_way(lo[i], hi[i], &format!("Cross {i}"), RoadClass::Residential, 11.2, true);
    }
    (study(b.network(), &[(gw, ge, 400.0)]), busy_links, quiet_links)
}

fn hot_on(s: &Study, links: &[u32]) -> Hotspots {
    let mut h = Hotspots { block_ct: vec![0.0; s.idx.blocks.len()], node_ct: vec![0.0; s.net.nodes.len()], mv_ct: BTreeMap::new() };
    h.block_ct[s.idx.block_of_link[links[1] as usize]] = 100.0;
    h
}

fn quiet_bypass(busy: &str, quiet: &str, offset: usize) -> (usize, Vec<String>) {
    let (s, busy_links, quiet_links) = ladder(busy, quiet, offset);
    let gen = cands::generate_with(&s, &hot_on(&s, &busy_links), 1, &Profile::unconstrained());
    let filter = gen.iter().position(|c| c.kind == "modal_filter").expect("a filter on the busy block");
    assert!(gen.iter().all(|c| c.places.iter().all(|p| p != quiet)), "the quiet street gets nothing from the hotspot ranking");
    let sup = bypass::supplement(&s, "p", &gen, &Profile::unconstrained(), 20);
    let quiet_block = s.idx.block_of_link[quiet_links[1] as usize];
    let on_quiet: Vec<&bypass::Supplement> = sup.added.iter().filter(|x| x.cand.block == Some(quiet_block)).collect();
    assert!(!on_quiet.is_empty(), "a closure on the quiet bypass is added");
    for x in &sup.added {
        assert!(bypass::CLOSURE_KINDS.contains(&x.cand.kind), "only closure kinds: {}", x.cand.kind);
        assert!(x.bypass.cost_s - x.bypass.base_cost_s <= bypass::BYPASS_DETOUR_S);
        assert!(!x.bypass.links.is_empty());
    }
    assert!(on_quiet.iter().any(|x| x.from == filter && x.bypass.links.iter().any(|&l| s.idx.block_of_link[l as usize] == quiet_block)), "the evidence is the bypass through the quiet block");
    assert!(sup.added.iter().all(|x| x.cand.kind != "slow_street"), "the Slow Street threshold is kept");
    let mut all = gen.clone();
    all.extend(sup.added.iter().map(|x| x.cand.clone()));
    let pairs = bypass::coordinated_pairs(&s, "p", &all);
    let q = all.iter().position(|c| c.block == Some(quiet_block) && c.kind == "modal_filter").unwrap() as u16;
    assert!(pairs.iter().any(|((a, b), _)| (*a as usize == filter && *b == q) || (*b as usize == filter && *a == q)), "the filter and its bypass closure form a coordinated pair");
    let mut kinds: Vec<String> = sup.added.iter().map(|x| format!("{}:{}", x.cand.kind, x.cand.block.is_some())).collect();
    kinds.sort();
    (sup.added.len(), kinds)
}

#[test]
fn a_quiet_legal_bypass_gets_supplementary_closures() {
    let a = quiet_bypass("Lark Street", "Wren Street", 0);
    let b = quiet_bypass("Second Avenue", "Third Avenue", 7);
    assert_eq!(a, b, "the same structure gives the same supplement whatever the names and ids");
}

#[test]
fn the_supplement_names_no_street_or_area() {
    for src in [include_str!("../src/explore/bypass.rs"), include_str!("../src/explore/supplement.rs"), include_str!("../src/explore/bench.rs")] {
        let low = src.to_lowercase();
        for name in ["rockridge", "colby", "dana", "hillegass", "telegraph", "claremont", "alcatraz"] {
            assert!(!low.contains(name), "{name} in the supplement code");
        }
    }
}
