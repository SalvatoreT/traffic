//! Ban sets (change `turn-ban-set-candidates`): generation from a network alone, counting as one intervention, the access drop, dedup, labels,
//! the scenario link and the real study-area network (skipped when its files are not on disk).

use traffic_sim::explore::bansets::{self, Turn};
use traffic_sim::explore::cands::{adopt, conflicts, generate_for, generate_search, same_intervention, Hotspots};
use traffic_sim::explore::decode::decode_scenario;
use traffic_sim::explore::profile::Profile;
use traffic_sim::explore::report::adopt_packages;
use traffic_sim::explore::{check_access, street, Params, Study};
use traffic_sim::model::*;

#[derive(Default)]
struct B {
    nodes: Vec<Node>,
    links: Vec<Link>,
}

impl B {
    fn node(&mut self, x: f64, y: f64, gate: bool, in_study: bool) -> u32 {
        let id = self.nodes.len() as u32;
        self.nodes.push(Node { id, osm_id: id as i64, x, y, control: Control::Uncontrolled, gate, in_study_area: in_study, marked_crossing: false, signal_timing: Vec::new() });
        id
    }
    fn two_way(&mut self, a: u32, b: u32, name: &str, class: RoadClass, in_study: bool) {
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
                speed_limit: 11.0,
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

/// Main Street (secondary) runs west to east through A, B and C, with gates outside. Ash, Oak and Elm Streets leave it northward at A, B and C
/// and are joined at their ends by Top Street, so each can be reached through the others. Six entry turns: a left and a right onto each.
fn mini(turn_bans: Vec<TurnBan>) -> Network {
    let mut b = B::default();
    let gw = b.node(-400.0, 0.0, true, false);
    let a = b.node(-200.0, 0.0, false, true);
    let bb = b.node(0.0, 0.0, false, true);
    let c = b.node(200.0, 0.0, false, true);
    let ge = b.node(400.0, 0.0, true, false);
    let a1 = b.node(-200.0, 100.0, false, true);
    let o1 = b.node(0.0, 100.0, false, true);
    let e1 = b.node(200.0, 100.0, false, true);
    b.two_way(gw, a, "Main Street", RoadClass::Secondary, false);
    b.two_way(a, bb, "Main Street", RoadClass::Secondary, true);
    b.two_way(bb, c, "Main Street", RoadClass::Secondary, true);
    b.two_way(c, ge, "Main Street", RoadClass::Secondary, false);
    b.two_way(a, a1, "Ash Street", RoadClass::Residential, true);
    b.two_way(bb, o1, "Oak Street", RoadClass::Residential, true);
    b.two_way(c, e1, "Elm Street", RoadClass::Residential, true);
    b.two_way(a1, o1, "Top Street", RoadClass::Residential, true);
    b.two_way(o1, e1, "Top Street", RoadClass::Residential, true);
    Network { version: 1, id: "t".into(), name: "t".into(), nodes: b.nodes, links: b.links, turn_bans }
}

fn study_of(net: Network) -> Study {
    let demand = Demand {
        version: 1,
        area: "t".into(),
        intents: Vec::new(),
        ramps: Vec::new(),
        periods: vec![Period { id: "p".into(), label: "p".into(), flows: vec![Flow { origin: 0, destination: 4, veh_per_hour: 100.0, mode: FlowMode::Car, via: None, intent: None }] }],
    };
    Study::from_parts("t", net, demand, (-122.25, 37.84), "h".into(), "h".into(), "uncalibrated".into())
}

fn ids(g: &bansets::Generated) -> Vec<(String, usize)> {
    g.sets.iter().map(|s| (s.id.clone(), s.moves.len())).collect()
}

#[test]
fn entry_movements_are_found_and_classified() {
    let s = study_of(mini(vec![]));
    let a = bansets::analyze(&s, &["p"]);
    assert_eq!(a.bounding, vec!["Main Street".to_string()]);
    assert_eq!(a.movements.len(), 6);
    assert_eq!(a.movements.iter().filter(|m| m.turn == Turn::Left).count(), 3);
    assert_eq!(a.movements.iter().filter(|m| m.turn == Turn::Right).count(), 3);
    assert!(a.movements.iter().all(|m| m.usable() && m.bounding.as_deref() == Some("Main Street")));
    assert!(a.movements.iter().all(|m| s.is_local[m.to as usize] && !s.is_local[m.from as usize]));
}

#[test]
fn sets_are_generated_dropped_and_merged() {
    let s = study_of(mini(vec![]));
    let g = bansets::generate(&s, &["p"]);
    assert_eq!(g.entry_movements, 6);
    let got = ids(&g);
    assert_eq!(got.iter().map(|x| x.0.as_str()).collect::<Vec<_>>()[..3], ["left-turns", "right-turns", "all-turns-access"]);
    assert_eq!(got.iter().find(|x| x.0 == "left-turns").unwrap().1, 3);
    // every turn would strand Ash Street's end, so the access variant leaves Ash Street's two turns open
    assert_eq!(got.iter().find(|x| x.0 == "all-turns-access").unwrap().1, 4);
    let access = g.sets.iter().find(|s| s.id == "all-turns-access").unwrap();
    assert!(access.note.contains("Ash Street"), "{}", access.note);
    // one set for each interior street: its left and right turn, both ends
    assert_eq!(got.iter().filter(|x| x.0.starts_with("onto-") && x.1 == 2).count(), 3);
    // a street's left turn alone is a single ban, not a set
    assert!(got.iter().all(|x| x.1 >= 2 && !x.0.ends_with("-left")));
    let why = |id: &str| g.dropped.iter().find(|d| d.id == id).map(|d| d.reason.clone());
    assert!(why("all-turns").unwrap().starts_with("access check"), "{:?}", why("all-turns"));
    assert_eq!(why("from-main-street-left").as_deref(), Some("same bans as left-turns"));
    // the turns from the only bounding street are all the entry turns: stranded the same way, never a second set
    assert!(why("from-main-street").is_some());
    assert!(!got.iter().any(|x| x.0 == "from-main-street"));
}

#[test]
fn a_ban_set_is_one_intervention_with_every_ban_in_its_link() {
    let s = study_of(mini(vec![]));
    let g = bansets::generate(&s, &["p"]);
    let left = g.sets.iter().find(|x| x.id == "left-turns").unwrap();
    let iv = bansets::set_iv(&left.moves);
    assert_eq!(bansets::ban_count(std::slice::from_ref(&iv)), 3);
    // the engine sees turn bans only
    let expanded = street::expand(&s.net, std::slice::from_ref(&iv));
    assert_eq!(expanded.len(), 3);
    assert!(expanded.iter().all(|e| e.ty == "turn_ban"));
    // the link lists each ban and decodes to them; a link that holds a whole set reads as the set
    let filter = Intervention { ty: "modal_filter".into(), link: Some(14), ..Default::default() };
    let link = s.encode(&[iv.clone(), filter.clone()], Some("p"));
    assert_eq!(link.matches("tb,").count(), 3, "{link}");
    let back = decode_scenario(&s.net, &s.topo, s.origin, &link).unwrap();
    assert_eq!(back.iter().filter(|b| b.ty == "turn_ban").count(), 3);
    let folded = bansets::collapse(&g.sets, back);
    assert_eq!(folded.len(), 2, "{folded:?}");
    assert_eq!(bansets::ban_count(&folded), 3);
    let set_back = folded.iter().find(|f| f.ty == bansets::TYPE).unwrap();
    assert_eq!(bansets::pairs(set_back), bansets::pairs(&iv));
    // part of a set stays single bans
    let part = decode_scenario(&s.net, &s.topo, s.origin, &s.encode(&bansets::flatten(&[iv.clone()])[..2], None)).unwrap();
    assert_eq!(bansets::collapse(&g.sets, part).iter().filter(|x| x.ty == "turn_ban").count(), 2);
    // access of the set itself
    assert!(check_access(&s, &[iv]).is_ok());
}

#[test]
fn the_search_gets_sets_only_behind_the_flag_and_counts_each_as_one() {
    let s = study_of(mini(vec![]));
    let hot = Hotspots { block_ct: vec![0.0; s.idx.blocks.len()], node_ct: vec![0.0; s.net.nodes.len()], mv_ct: Default::default() };
    let mut p = Params::new("t");
    p.periods = vec!["p".into()];
    p.depth = 2;
    let plain = generate_search(&s, &hot, &p);
    let generated = generate_for(&s, &hot, p.candidates, &p.profile, ["p"]);
    assert_eq!(plain.iter().map(|c| (c.key.clone(), c.label.clone())).collect::<Vec<_>>(), generated.iter().map(|c| (c.key.clone(), c.label.clone())).collect::<Vec<_>>(), "without the flag the candidates are the generator's");
    assert!(plain.iter().all(|c| c.kind != "ban_set"));
    p.ban_sets = true;
    let with = generate_search(&s, &hot, &p);
    assert_eq!(with.len(), plain.len() + bansets::generate(&s, &["p"]).sets.len());
    assert_eq!(with[..plain.len()].iter().map(|c| c.key.clone()).collect::<Vec<_>>(), plain.iter().map(|c| c.key.clone()).collect::<Vec<_>>(), "single candidates keep their indices");
    let left = with.iter().find(|c| c.key == "bs:left-turns").unwrap();
    assert_eq!(left.label, "No left turns from the bounding streets onto side streets (3 turns)");
    // a package of the left-turn set and a filter has two interventions and fits a depth of 2; its three bans as singles would not
    let filter = Intervention { ty: "modal_filter".into(), link: Some(14), ..Default::default() };
    let set = bansets::set_iv(&bansets::pairs(&left.iv));
    let folded = adopt_packages(&s, &p, &mut with.clone(), &[vec![set.clone(), filter.clone()]], "test");
    assert!(folded[0].is_ok(), "{:?}", folded[0]);
    let singles = bansets::flatten(&[set.clone(), filter.clone()]).into_owned();
    assert_eq!(singles.len(), 4);
    assert!(adopt_packages(&s, &p, &mut with.clone(), &[singles], "test")[0].is_err(), "four singles exceed the depth");
    // adopting the set again finds the generated candidate, not a new one
    let mut c2 = with.clone();
    let i = adopt(&s, &mut c2, &set);
    assert_eq!(c2.len(), with.len());
    assert_eq!(with[i as usize].key, "bs:left-turns");
    assert!(same_intervention(&s, &with[i as usize].iv, &set));
}

#[test]
fn sets_conflict_when_they_share_a_ban_and_not_otherwise() {
    let s = study_of(mini(vec![]));
    let hot = Hotspots { block_ct: vec![0.0; s.idx.blocks.len()], node_ct: vec![0.0; s.net.nodes.len()], mv_ct: Default::default() };
    let mut p = Params::new("t");
    p.periods = vec!["p".into()];
    p.ban_sets = true;
    let c = generate_search(&s, &hot, &p);
    let by = |k: &str| c.iter().find(|x| x.key == k).unwrap();
    assert!(conflicts(by("bs:left-turns"), by("bs:all-turns-access")), "all-turns-access holds the left turns");
    assert!(!conflicts(by("bs:left-turns"), by("bs:right-turns")));
    let one = by("bs:left-turns").iv.clone();
    let (a, b) = bansets::pairs(&one)[0];
    let single = traffic_sim::explore::cands::Cand { iv: Intervention { ty: "turn_ban".into(), from_link: Some(a), to_link: Some(b), ..Default::default() }, kind: "turn_ban", label: String::new(), key: format!("tb:{a}-{b}"), block: None, nodes: vec![], places: vec![], loc_score: 0.0 };
    assert!(conflicts(by("bs:left-turns"), &single));
    assert!(!conflicts(by("bs:right-turns"), &single));
}

#[test]
fn a_profile_that_excludes_turn_bans_leaves_no_sets() {
    let s = study_of(mini(vec![]));
    let hot = Hotspots { block_ct: vec![0.0; s.idx.blocks.len()], node_ct: vec![0.0; s.net.nodes.len()], mv_ct: Default::default() };
    let mut p = Params::new("t");
    p.periods = vec!["p".into()];
    p.ban_sets = true;
    p.profile = Profile { id: "x".into(), title: "x".into(), note: String::new(), exclude_types: vec!["turn_ban".into()], exclude_boundary: false };
    assert!(generate_search(&s, &hot, &p).iter().all(|c| c.kind != "ban_set"));
}

#[test]
fn a_movement_banned_in_the_base_network_is_left_out() {
    let probe = study_of(mini(vec![]));
    let m = bansets::analyze(&probe, &["p"]).movements.into_iter().find(|m| m.turn == Turn::Left && m.onto == "Oak Street").unwrap();
    let s = study_of(mini(vec![TurnBan { from: m.from, to: m.to, periods: vec![] }]));
    let a = bansets::analyze(&s, &["p"]);
    assert_eq!(a.movements.len(), 6);
    assert_eq!(a.movements.iter().filter(|x| x.usable()).count(), 5);
    let g = bansets::generate(&s, &["p"]);
    assert_eq!(g.usable, 5);
    assert_eq!(g.sets.iter().find(|x| x.id == "left-turns").unwrap().moves.len(), 2);
    assert!(g.sets.iter().all(|x| !x.moves.contains(&(m.from, m.to))));
}

#[test]
fn counts_on_the_study_area_network() {
    let root = std::path::Path::new(env!("CARGO_MANIFEST_DIR")).join("../..");
    if !root.join("public/data/rockridge.network.json").exists() || !root.join("public/data/rockridge.demand.json").exists() {
        eprintln!("skipped: no study-area files under public/data");
        return;
    }
    let s = Study::load(&root, "rockridge").unwrap();
    let periods: Vec<&str> = s.demand.periods.iter().map(|p| p.id.as_str()).collect();
    let a = bansets::analyze(&s, &periods);
    assert_eq!(a.movements.len(), 53, "entry movements, as tools/turn-ban-sets.ts");
    assert_eq!(a.movements.iter().filter(|m| m.usable() && m.turn == Turn::Left).count(), 21);
    assert_eq!(a.movements.iter().filter(|m| m.usable() && m.turn == Turn::Right).count(), 22);
    let g = bansets::generate(&s, &periods);
    let n = |id: &str| g.sets.iter().find(|x| x.id == id).map(|x| x.moves.len());
    assert_eq!(n("left-turns"), Some(21));
    assert_eq!(n("right-turns"), Some(22));
    assert_eq!(n("all-turns-access"), Some(41));
    assert_eq!(n("through-streets"), Some(19));
    assert_eq!(n("from-alcatraz-avenue"), Some(6));
    assert_eq!(n("from-claremont-avenue"), Some(12));
    assert_eq!(n("from-college-avenue"), Some(4));
    let d = |id: &str| g.dropped.iter().find(|x| x.id == id).map(|x| (x.bans, x.reason.starts_with("access check")));
    assert_eq!(d("from-telegraph-avenue"), Some((20, true)));
    assert_eq!(d("all-turns"), Some((43, true)));
}
