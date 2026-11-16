//! Slow Street: the whole-street 15 mph item (`explore::street`): the run of a street, the scenario link, the engine's expansion, the
//! candidate list, places and conflicts, and the check-only `explore` modes. Real-network checks skip when the generated data is absent.

use std::path::PathBuf;
use traffic_sim::explore::cands::{conflicts, generate_with, same_intervention, Hotspots};
use traffic_sim::explore::decode::decode_scenario;
use traffic_sim::explore::link::encode_scenario;
use traffic_sim::explore::profile::Profile;
use traffic_sim::explore::search::{period_stat, places_of, Baseline, Ctx};
use traffic_sim::explore::street::{expand, label, slow_street_mps, street_run, TYPE};
use traffic_sim::explore::{Params, Study};
use traffic_sim::model::*;

#[derive(Default)]
struct B {
    nodes: Vec<Node>,
    links: Vec<Link>,
}

impl B {
    fn node(&mut self, x: f64, y: f64, gate: bool) -> u32 {
        let id = self.nodes.len() as u32;
        self.nodes.push(Node { id, osm_id: id as i64, x, y, control: Control::Uncontrolled, gate, in_study_area: !gate, marked_crossing: false, signal_timing: Vec::new() });
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
}

const ORIGIN: (f64, f64) = (-122.25, 37.84);

struct Fx {
    net: Network,
    elm: [u32; 3],
    other_elm: u32,
    oak: u32,
}

/// Elm Street in three blocks (the third already below 15 mph) from a gate to Pine Street, with Oak Street crossing at the first
/// intersection, a separate stretch of Elm Street elsewhere, and a bounding street.
fn fixture() -> Fx {
    let mut b = B::default();
    let n: Vec<u32> = [(0.0, 0.0, true), (100.0, 0.0, false), (200.0, 0.0, false), (300.0, 0.0, false), (400.0, 0.0, false), (100.0, 100.0, false), (0.0, 300.0, false), (100.0, 300.0, false), (300.0, 100.0, false)]
        .iter()
        .map(|&(x, y, g)| b.node(x, y, g))
        .collect();
    let e0 = b.two_way(n[0], n[1], "Elm Street", RoadClass::Residential, 11.18, true);
    let e1 = b.two_way(n[1], n[2], "Elm Street", RoadClass::Residential, 11.18, true);
    let e2 = b.two_way(n[2], n[3], "Elm Street", RoadClass::Residential, 6.0, true);
    let oak = b.two_way(n[1], n[5], "Oak Street", RoadClass::Residential, 11.18, true);
    b.two_way(n[3], n[4], "Pine Street", RoadClass::Tertiary, 11.18, true);
    b.two_way(n[3], n[8], "Pine Street", RoadClass::Residential, 11.18, true);
    let other = b.two_way(n[6], n[7], "Elm Street", RoadClass::Residential, 11.18, true);
    Fx { net: Network { version: 1, id: "t".into(), name: "t".into(), nodes: b.nodes, links: b.links, turn_bans: Vec::new() }, elm: [e0, e1, e2], other_elm: other, oak }
}

fn study(net: Network) -> Study {
    let demand = Demand { version: 1, area: "t".into(), intents: vec![], ramps: vec![], periods: vec![] };
    Study::from_parts("t", net, demand, ORIGIN, "h".into(), "h".into(), "uncalibrated".into())
}

fn slow(link: u32) -> Intervention {
    Intervention { ty: TYPE.into(), link: Some(link), ..Default::default() }
}

#[test]
fn run_is_the_connected_stretch_whichever_block_is_chosen() {
    let fx = fixture();
    let a = street_run(&fx.net, fx.elm[0]).unwrap();
    let b = street_run(&fx.net, fx.elm[2] + 1).unwrap();
    assert_eq!(a, b);
    assert_eq!(a.blocks.len(), 3);
    assert_eq!(a.canonical, fx.elm[0]);
    assert!(a.split, "the separate stretch of the same name is reported");
    let other = street_run(&fx.net, fx.other_elm).unwrap();
    assert_eq!(other.blocks.len(), 1);
    assert!(other.split);
    assert!(street_run(&fx.net, fx.oak).unwrap().blocks.len() == 1 && !street_run(&fx.net, fx.oak).unwrap().split);
}

#[test]
fn label_names_the_street_the_ends_and_a_gap() {
    let fx = fixture();
    let run = street_run(&fx.net, fx.elm[1]).unwrap();
    assert_eq!(label(&run), "Slow Street on Elm Street (15 mph, Pine Street to the study-area edge; this connected stretch only, the street has another stretch in the study area)");
    let oak = street_run(&fx.net, fx.oak).unwrap();
    assert_eq!(label(&oak), "Slow Street on Oak Street (15 mph, a dead end to Elm Street)");
}

#[test]
fn expansion_limits_each_faster_block_and_never_raises_a_slower_one() {
    let fx = fixture();
    let out = expand(&fx.net, &[slow(fx.elm[1]), Intervention { ty: "modal_filter".into(), link: Some(fx.oak), ..Default::default() }]);
    let limits: Vec<(u32, f64)> = out.iter().filter(|i| i.ty == "speed_limit").map(|i| (i.link.unwrap(), i.speed.unwrap())).collect();
    assert_eq!(limits, vec![(fx.elm[0], slow_street_mps()), (fx.elm[1], slow_street_mps())]);
    assert_eq!(out.iter().filter(|i| i.ty == "modal_filter").count(), 1);
    assert_eq!(expand(&fx.net, &[]).len(), 0);
}

#[test]
fn link_round_trips_and_is_the_same_from_any_block() {
    let fx = fixture();
    let s = study(fx.net.clone());
    let from_first = encode_scenario(&s.net, ORIGIN, &[slow(fx.elm[0])], "t", None);
    let from_last = encode_scenario(&s.net, ORIGIN, &[slow(fx.elm[2])], "t", None);
    assert_eq!(from_first, from_last);
    assert!(from_first.contains("s=ss,"));
    let back = decode_scenario(&s.net, &s.topo, ORIGIN, &from_first).unwrap();
    assert_eq!(back.len(), 1);
    assert_eq!(back[0].ty, TYPE);
    assert_eq!(back[0].link, Some(fx.elm[0]));
}

#[test]
fn old_per_block_links_still_decode() {
    let fx = fixture();
    let s = study(fx.net.clone());
    let one = Intervention { ty: "speed_limit".into(), link: Some(fx.elm[0]), speed: Some(6.71), ..Default::default() };
    let link = encode_scenario(&s.net, ORIGIN, &[one], "t", None);
    assert!(link.contains("s=sl,"));
    let back = decode_scenario(&s.net, &s.topo, ORIGIN, &link).unwrap();
    assert_eq!((back[0].ty.as_str(), back[0].speed), ("speed_limit", Some(6.71)));
}

fn hot(s: &Study) -> Hotspots {
    Hotspots { block_ct: vec![1.0; s.idx.blocks.len()], node_ct: vec![0.0; s.net.nodes.len()], mv_ct: Default::default() }
}

#[test]
fn candidates_offer_slow_streets_and_no_per_block_limits() {
    let fx = fixture();
    let s = study(fx.net.clone());
    let cands = generate_with(&s, &hot(&s), 40, &Profile::unconstrained());
    assert!(cands.iter().all(|c| c.kind != "speed_limit"));
    let slow: Vec<_> = cands.iter().filter(|c| c.kind == "slow_street").collect();
    let names: Vec<&str> = slow.iter().map(|c| c.places[0].as_str()).collect();
    assert_eq!(slow.len(), 3, "{names:?}");
    assert_eq!(names.iter().filter(|n| **n == "Elm Street").count(), 2, "each separate stretch is its own candidate");
    assert!(names.contains(&"Oak Street"));
    assert!(!names.contains(&"Pine Street"), "a street with a non-local block is not offered");
    let elm = slow.iter().find(|c| c.iv.link == Some(fx.elm[0])).unwrap();
    assert!(elm.label.starts_with("Slow Street on Elm Street (15 mph, "));
}

#[test]
fn slow_street_combines_with_a_filter_on_its_street_and_dedupes_with_block_limits() {
    let fx = fixture();
    let s = study(fx.net.clone());
    let mut cands = generate_with(&s, &hot(&s), 40, &Profile::unconstrained());
    let ss = cands.iter().position(|c| c.kind == "slow_street" && c.iv.link == Some(fx.elm[0])).unwrap();
    let mf = cands.iter().position(|c| c.kind == "modal_filter" && c.block.is_some() && c.places[0] == "Elm Street").unwrap();
    assert!(!conflicts(&cands[ss], &cands[mf]), "a filter on a Slow Street is a package");
    let oak = cands.iter().position(|c| c.kind == "slow_street" && c.places[0] == "Oak Street").unwrap();
    assert!(!conflicts(&cands[ss], &cands[oak]));
    let one = Intervention { ty: "speed_limit".into(), link: Some(fx.elm[1]), speed: Some(6.71), ..Default::default() };
    let sl = traffic_sim::explore::cands::adopt(&s, &mut cands, &one) as usize;
    assert!(conflicts(&cands[ss], &cands[sl]), "a Slow Street and a per-block limit on its street are the same thing");
    assert!(!same_intervention(&s, &cands[ss].iv, &cands[sl].iv));

    let base = Baseline { full: vec![], screen_runs: vec![], screen: period_stat(&s, &[]), hot: hot(&s) };
    let p = Params::new("t");
    let ctx = Ctx { study: &s, p: &p, cands: &cands, base: &base };
    assert_eq!(places_of(&ctx, &[ss as u16, mf as u16]).len(), 2);
    assert_eq!(places_of(&ctx, &[ss as u16])[0], places_of(&ctx, &[sl as u16])[0], "one place for the street");
}

fn data(name: &str) -> PathBuf {
    PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("../../public/data").join(name)
}

#[test]
fn real_network_runs_cover_the_whole_street() {
    if !data("rockridge.network.json").exists() || !data("rockridge.demand.json").exists() {
        eprintln!("skip: generated data missing");
        return;
    }
    let s = Study::load(&PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("../.."), "rockridge").unwrap();
    for name in ["Colby Street", "Hillegass Avenue"] {
        let any = s.net.links.iter().find(|l| l.name.trim() == name && l.in_study_area).unwrap().id;
        let run = street_run(&s.net, any).unwrap();
        let in_study: usize = s.net.links.iter().filter(|l| l.name.trim() == name && l.in_study_area).count();
        let ids: Vec<u32> = run.blocks.iter().flatten().copied().collect();
        assert!(ids.len() >= 6 && ids.len() <= in_study, "{name}: {} links in the run of {in_study}", ids.len());
        assert!(ids.iter().all(|&l| s.net.links[l as usize].name.trim() == name && s.net.links[l as usize].in_study_area));
        let link = encode_scenario(&s.net, s.origin, &[slow(ids[ids.len() / 2])], "rockridge", None);
        let back = decode_scenario(&s.net, &s.topo, s.origin, &link).unwrap();
        assert_eq!((back[0].ty.as_str(), back[0].link), (TYPE, Some(run.canonical)), "{name}");
        let out = expand(&s.net, &back);
        assert_eq!(out.len(), run.blocks.len(), "{name}: every block was faster than 15 mph");
        assert!(label(&run).starts_with(&format!("Slow Street on {name} (15 mph, ")), "{}", label(&run));
    }
    let cands = generate_with(&s, &hot(&s), 60, &Profile::unconstrained());
    assert!(cands.iter().all(|c| c.kind != "speed_limit"));
}

/// The check modes only print: `--check-singles` alone does not start a search, and combined with --out it is refused.
#[test]
fn check_singles_is_check_only() {
    let bin = env!("CARGO_BIN_EXE_explore");
    let scratch = std::env::temp_dir().join(format!("slow-street-check-{}", std::process::id()));
    std::fs::create_dir_all(&scratch).unwrap();
    let out = scratch.join("never.json");
    let refused = std::process::Command::new(bin).args(["--area", "rockridge"]).arg("--check-singles").arg("--out").arg(&out).output().unwrap();
    if !data("rockridge.network.json").exists() || !data("rockridge.demand.json").exists() {
        eprintln!("skip: generated data missing");
        return;
    }
    assert_eq!(refused.status.code(), Some(2));
    assert!(String::from_utf8_lossy(&refused.stderr).contains("write no proposals or report"));
    assert!(!out.exists());
    let proposals = data("rockridge.proposals.json");
    let before = std::fs::metadata(&proposals).and_then(|m| m.modified()).ok();
    let ran = std::process::Command::new(bin)
        .args(["--area", "rockridge", "--check-singles", "--periods", "pm_peak", "--seeds", "1", "--candidates", "3", "--screen-minutes", "2", "--minutes", "2", "--jobs", "2"])
        .output()
        .unwrap();
    let text = String::from_utf8_lossy(&ran.stdout);
    assert!(ran.status.success(), "{}", String::from_utf8_lossy(&ran.stderr));
    assert!(text.contains("singles scored on period(s) pm_peak, seed(s) 1, 2 min"), "{text}");
    assert!(text.contains("slow_street | Slow Street on "), "{text}");
    assert!(text.contains("through ") && text.contains(" -> ") && text.contains("largest all-car rise"));
    assert!(!text.contains("speed_limit |"));
    assert_eq!(before, std::fs::metadata(&proposals).and_then(|m| m.modified()).ok(), "the proposals file was not touched");
}
