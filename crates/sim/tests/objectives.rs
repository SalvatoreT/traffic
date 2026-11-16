//! Objectives: which option each goal picks, how tags and near-duplicates combine, and the light weights.

use traffic_sim::explore::objectives::{closes_nothing, eligible, final_score, Objective, DETOUR_REDUCTION_FLOOR, DETOUR_WEIGHT_PTS_PER_S, FEWEST_MAX_CHANGES};
use traffic_sim::explore::report::{objective_winner, select_by_objectives, Final};
use traffic_sim::explore::Params;

fn fin(set: &[u16], red: f64, closes: bool, detour: f64) -> Final {
    Final {
        set: set.to_vec(),
        base_vph: 100.0,
        scen_vph: 100.0 - red,
        reduction_pct: red,
        harm: 0.0,
        score: red,
        closes,
        detour_s: detour,
        places: set.iter().map(|c| format!("p{c}")).collect(),
        ..Final::default()
    }
}

fn params() -> Params {
    Params::new("t")
}

/// A closure package that removes the most, a larger package without closures, and a small weak one.
fn finals() -> Vec<Final> {
    vec![Final { harm: 40.0, ..fin(&[0], 30.0, true, 8.0) }, fin(&[1, 2, 3], 28.0, false, 0.0), fin(&[4], 12.0, false, 0.0), fin(&[5, 6], 20.0, true, 1.0)]
}

fn ids(p: &traffic_sim::explore::report::Pick) -> Vec<&'static str> {
    p.objectives.iter().map(|o| o.id()).collect()
}

#[test]
fn each_objective_has_its_own_rule_and_eligibility() {
    assert_eq!(Objective::from_id("no-closures"), Some(Objective::NoClosures));
    assert!(Objective::from_id("nope").is_none());
    let f = finals();
    assert!(eligible(Objective::MostRemoved, &f[0]) && eligible(Objective::LeastDetour, &f[0]));
    assert!(!eligible(Objective::NoClosures, &f[0]) && eligible(Objective::NoClosures, &f[1]));
    assert!(eligible(Objective::FewestChanges, &f[3]) && !eligible(Objective::FewestChanges, &f[1]));
    assert_eq!(FEWEST_MAX_CHANGES, 2);
}

#[test]
fn closure_free_means_only_the_measures_that_close_nothing() {
    use traffic_sim::explore::cands::Cand;
    use traffic_sim::model::Intervention;
    let cand = |kind: &'static str| Cand { iv: Intervention::default(), kind, label: String::new(), key: kind.into(), block: None, nodes: vec![], places: vec![], loc_score: 0.0 };
    for k in ["slow_street", "one_way", "control", "traffic_circle", "speed_hump", "turn_ban"] {
        assert!(closes_nothing(&cand(k)), "{k}");
    }
    for k in ["modal_filter", "node_filter", "diagonal_diverter", "signal_timing"] {
        assert!(!closes_nothing(&cand(k)), "{k}");
    }
}

#[test]
fn winners_by_objective_and_tags_on_one_option() {
    let f = finals();
    let p = params();
    let all: Vec<usize> = (0..f.len()).collect();
    assert_eq!(objective_winner(&f, &p, Objective::MostRemoved, &all), Some(0));
    let free: Vec<usize> = all.iter().copied().filter(|&i| eligible(Objective::NoClosures, &f[i])).collect();
    assert_eq!(objective_winner(&f, &p, Objective::NoClosures, &free), Some(1));
    let few: Vec<usize> = all.iter().copied().filter(|&i| eligible(Objective::FewestChanges, &f[i])).collect();
    assert_eq!(objective_winner(&f, &p, Objective::FewestChanges, &few), Some(0));

    let (picks, notes, _) = select_by_objectives(&f, &p, 6);
    let by = |i: usize| picks.iter().find(|pk| pk.idx == i).map(ids);
    assert_eq!(by(0), Some(vec!["most-removed", "fewest-changes"]), "a package that wins two objectives is listed once with both tags");
    assert_eq!(by(1), Some(vec!["no-closures", "least-detour"]));
    assert!(picks.iter().filter(|pk| pk.idx == 0).count() == 1);
    assert!(notes[0].starts_with("chosen as option") && notes[0].contains("most cut-through removed and fewest changes"), "{}", notes[0]);
    // The list stays one list, most through cars removed first.
    let removed: Vec<f64> = picks.iter().map(|pk| f[pk.idx].reduction_pct).collect();
    assert!(removed.windows(2).all(|w| w[0] >= w[1]), "{removed:?}");
}

#[test]
fn the_package_without_closures_is_found_though_a_closing_one_dominates_it() {
    let f = finals();
    let (picks, notes, _) = select_by_objectives(&f, &params(), 6);
    assert!(picks.iter().any(|pk| pk.idx == 1), "{notes:?}");
}

#[test]
fn detour_weight_is_light_and_never_lifts_a_weak_package() {
    let p = params();
    let f = finals();
    // 8 s of detour costs 4 points: the 28-point package overtakes the 30-point one.
    assert!((final_score(Objective::LeastDetour, &p, &f[0]) - (30.0 - DETOUR_WEIGHT_PTS_PER_S * 8.0)).abs() < 1e-9);
    let keep: Vec<usize> = (0..f.len()).collect();
    assert_eq!(objective_winner(&f, &p, Objective::LeastDetour, &keep), Some(1));
    // A package below half the best reduction cannot win even with no detour at all (and a negative detour is no bonus).
    let mut weak = finals();
    weak.push(fin(&[7], 14.0, false, -50.0));
    assert!(14.0 < DETOUR_REDUCTION_FLOOR * 30.0);
    let keep: Vec<usize> = (0..weak.len()).collect();
    assert_ne!(objective_winner(&weak, &p, Objective::LeastDetour, &keep), Some(4));
    // Half and double weight move the winner only among packages with similar reductions.
    for w in [DETOUR_WEIGHT_PTS_PER_S / 2.0, DETOUR_WEIGHT_PTS_PER_S * 2.0] {
        let q = Params { detour_weight: w, ..params() };
        let win = objective_winner(&f, &q, Objective::LeastDetour, &(0..f.len()).collect::<Vec<_>>()).unwrap();
        assert!(f[win].reduction_pct >= DETOUR_REDUCTION_FLOOR * 30.0);
    }
}

#[test]
fn packages_at_the_same_places_fold_into_the_option_and_the_list_fills_with_the_next_best() {
    let mut f = finals();
    f.push(Final { places: f[0].places.clone(), harm: 40.0, ..fin(&[8], 25.0, true, 2.0) });
    let (picks, _, folds) = select_by_objectives(&f, &params(), 6);
    assert!(picks.iter().all(|pk| pk.idx != 4), "the variant at the same place is not a second option");
    assert!(folds.iter().any(|x| x.from == 4 && x.into == 0));
    // With room to spare, the next best by through cars removed joins the winners.
    assert!(picks.iter().any(|pk| pk.idx == 2 && pk.objectives.is_empty()));
}
