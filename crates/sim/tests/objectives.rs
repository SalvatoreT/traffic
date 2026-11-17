//! Objectives: which option each goal picks, how tags and near-duplicates combine, the detour rule and the displacement rule.

use traffic_sim::explore::objectives::{closes_nothing, eligible, screen_value, Objective, DETOUR_REDUCTION_FLOOR, DETOUR_TIE_S, FEWEST_MAX_CHANGES};
use traffic_sim::explore::paired::Paired;
use traffic_sim::explore::report::{detour_lower, displaces, objective_winner, select_by_objectives, Final, PeriodRes};
use traffic_sim::explore::search::{detour_floor_pct, Eval};
use traffic_sim::explore::{Params, NOISE_FLOOR_VEH_H};

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

/// One period whose worst block rises by `rise` cars an hour, with a paired interval of half width `half` when given.
fn period(rise: f64, half: Option<f64>) -> PeriodRes {
    PeriodRes {
        base_through: 100.0,
        scen_through: 50.0,
        cut_pct: -50.0,
        effect: Paired::none(),
        worst: 0,
        block_base: 100.0,
        block_scen: 100.0 + rise,
        block_through_inc: rise,
        block_effect: Paired { n: 10, mean: rise, sd: 1.0, half },
        penalty_block: None,
        penalty: 0.0,
        blocks_above: 0,
    }
}

fn with_rise(f: Final, rise: f64, half: Option<f64>) -> Final {
    Final { by_period: vec![period(rise / 2.0, half), period(rise, half)], ..f }
}

fn seeds_detour(f: Final, d: [f64; 10]) -> Final {
    Final { detour_s: d.iter().sum::<f64>() / 10.0, detour_seeds: d.to_vec(), pairs: traffic_sim::explore::paired::CtPairs { seeds: (1..=10).collect(), base: vec![], scen: vec![] }, ..f }
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
    assert_eq!(Objective::LeastDetour.label(), "least detour for residents");
    assert!(!Objective::LeastDetour.rule().contains("weight"), "{}", Objective::LeastDetour.rule());
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
    assert_eq!(objective_winner(&f, Objective::MostRemoved, &all), Some(0));
    let free: Vec<usize> = all.iter().copied().filter(|&i| eligible(Objective::NoClosures, &f[i])).collect();
    assert_eq!(objective_winner(&f, Objective::NoClosures, &free), Some(1));
    let few: Vec<usize> = all.iter().copied().filter(|&i| eligible(Objective::FewestChanges, &f[i])).collect();
    assert_eq!(objective_winner(&f, Objective::FewestChanges, &few), Some(0));

    let (picks, notes, _, _) = select_by_objectives(&f, &p, 6);
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
    let (picks, notes, _, _) = select_by_objectives(&f, &params(), 6);
    assert!(picks.iter().any(|pk| pk.idx == 1), "{notes:?}");
}

#[test]
fn least_detour_is_the_smallest_detour_among_packages_that_still_remove_half() {
    let f = finals();
    let keep: Vec<usize> = (0..f.len()).collect();
    // Best is 30, so the floor is 15: the 12-point package is out even with no detour; of the rest, 28 points at 0 s beats 20 at 1 s and 30 at 8 s.
    assert_eq!(DETOUR_REDUCTION_FLOOR, 0.5);
    assert_eq!(objective_winner(&f, Objective::LeastDetour, &keep), Some(1));
    // Below the floor a package never wins, however small its detour, and a negative detour is only a smaller detour.
    let mut weak = finals();
    weak.push(fin(&[7], 14.0, false, -50.0));
    let keep: Vec<usize> = (0..weak.len()).collect();
    assert_eq!(objective_winner(&weak, Objective::LeastDetour, &keep), Some(1));
    weak.push(fin(&[8], 16.0, false, -50.0));
    let keep: Vec<usize> = (0..weak.len()).collect();
    assert_eq!(objective_winner(&weak, Objective::LeastDetour, &keep), Some(5), "above the floor, the lowest detour wins on its own");
}

#[test]
fn a_detour_difference_the_paired_comparison_cannot_resolve_goes_to_the_larger_reduction() {
    // Without seeds the means must differ by more than the tie threshold.
    let a = fin(&[1], 40.0, false, 2.0);
    let b = fin(&[2, 3], 60.0, false, 2.0 + DETOUR_TIE_S);
    assert!(!detour_lower(&a, &b), "a difference of exactly the threshold is a tie");
    let keep = vec![0, 1];
    assert_eq!(objective_winner(&[a.clone(), b.clone()], Objective::LeastDetour, &keep), Some(1));
    let c = fin(&[2, 3], 60.0, false, 2.0 + DETOUR_TIE_S + 0.1);
    assert!(detour_lower(&a, &c));
    assert_eq!(objective_winner(&[a, c], Objective::LeastDetour, &keep), Some(0));
}

#[test]
fn paired_seeds_resolve_a_steady_gap_and_not_a_noisy_one() {
    let base = [3.0, -3.0, 2.0, -2.0, 4.0, -4.0, 1.0, -1.0, 0.5, -0.5];
    let low = seeds_detour(fin(&[1], 40.0, false, 0.0), base);
    // Steady: every seed is 1 s higher, so the paired difference has no spread and the interval is above zero.
    let steady = seeds_detour(fin(&[2, 3], 60.0, false, 0.0), base.map(|x| x + 1.0));
    assert!(detour_lower(&low, &steady));
    // Noisy: the same mean gap, but the per-seed differences swing from -4 to 6.
    let swing = [6.0, -4.0, 5.0, -3.0, 6.0, -4.0, 5.0, -3.0, 4.0, -3.0];
    let noisy = seeds_detour(fin(&[2, 3], 60.0, false, 0.0), std::array::from_fn(|i| base[i] + swing[i]));
    assert!(noisy.detour_s > low.detour_s);
    assert!(!detour_lower(&low, &noisy));
    let keep = vec![0, 1];
    assert_eq!(objective_winner(&[low.clone(), steady], Objective::LeastDetour, &keep), Some(0), "resolved: the lower detour wins");
    assert_eq!(objective_winner(&[low, noisy], Objective::LeastDetour, &keep), Some(1), "unresolved: the larger reduction wins");
}

#[test]
fn ties_in_detour_and_reduction_go_to_fewer_changes() {
    let a = fin(&[1, 2, 3], 40.0, false, 1.0);
    let b = fin(&[4], 40.0, false, 1.0);
    assert_eq!(objective_winner(&[a, b], Objective::LeastDetour, &[0, 1]), Some(1));
}

#[test]
fn the_beam_ranks_packages_above_the_floor_by_detour_and_the_rest_by_reduction() {
    let ev = |red: f64, detour: f64| Eval { set: vec![0], reject: None, reduction_pct: red, harm: 0.0, worst: 0, inc: Vec::new(), score: red, detour_s: detour };
    let evals = vec![ev(40.0, 9.0), ev(22.0, 0.0), ev(25.0, 3.0), ev(10.0, -30.0), ev(5.0, 1.0)];
    let floor = detour_floor_pct(&evals);
    assert!((floor - 20.0).abs() < 1e-9, "half of the best valid reduction: {floor}");
    let v = |e: &Eval| screen_value(Objective::LeastDetour, e.score, e, floor);
    // Above the floor: lower detour ranks first, whatever the reduction.
    assert!(v(&evals[1]) > v(&evals[2]) && v(&evals[2]) > v(&evals[0]));
    // Below the floor: by reduction, and always behind a package above the floor.
    assert!(v(&evals[3]) > v(&evals[4]));
    assert!(v(&evals[0]) > v(&evals[3]));
    // The other objectives ignore detour.
    assert_eq!(screen_value(Objective::MostRemoved, 12.5, &evals[1], floor), 12.5);
    // An invalid evaluation does not set the floor.
    let bad = vec![ev(40.0, 9.0), ev(22.0, 0.0), Eval { reject: Some("x".into()), ..ev(90.0, 0.0) }];
    assert!((detour_floor_pct(&bad) - 20.0).abs() < 1e-9);
}

/// The published list of the 2026-11-17 search, in the figures that matter here: p2 is the untagged option that removes as many through
/// cars as p3 and piles 208 cars an hour onto one block, against p3's 56.
fn displacement_finals() -> Vec<Final> {
    // The ranking penalty (`harm`) rises with the reduction, so no package dominates another in the filters before the goals pick.
    let harm = |f: Final, h: f64| Final { harm: h, ..f };
    vec![
        harm(with_rise(fin(&[0, 1, 2, 3, 4, 5], 73.0, true, 9.5), 77.0, Some(14.0)), 77.0),
        harm(with_rise(fin(&[6, 7, 8, 9], 48.9, true, 8.3), 208.0, Some(21.0)), 208.0),
        harm(with_rise(fin(&[10, 11, 12, 13, 14, 15], 48.5, false, 4.4), 56.5, Some(8.4)), 56.0),
        harm(with_rise(fin(&[16, 17, 18, 19], 45.8, true, 0.2), 56.7, Some(26.0)), 57.0),
        harm(with_rise(fin(&[20, 21], 31.2, true, 0.6), 56.4, Some(5.8)), 60.0),
        harm(with_rise(fin(&[22, 23], 27.9, true, 1.0), 66.5, Some(12.0)), 50.0),
    ]
}

#[test]
fn an_untagged_option_is_dropped_when_another_removes_as_many_with_a_clearly_smaller_rise() {
    let f = displacement_finals();
    let (picks, notes, _, dropped) = select_by_objectives(&f, &params(), 6);
    let listed: Vec<usize> = picks.iter().map(|pk| pk.idx).collect();
    assert!(!listed.contains(&1), "the 208-car option is not published: {listed:?}");
    assert_eq!(dropped.len(), 1, "{dropped:?}");
    let d = &dropped[0];
    assert_eq!((d.from, d.by), (1, 2));
    assert_eq!(d.removal, "not distinguishable");
    assert_eq!(d.noise_basis, "paired intervals");
    assert!(d.rise - d.by_rise > d.noise, "{d:?}");
    assert!(notes[1].starts_with("not published: finalist 3") && notes[1].contains("208") && notes[1].contains("56"), "{}", notes[1]);
    // The detour tag goes to the 46% package at 0.2 s: it is above half of 73 (36.5) and the lowest detour there.
    let tagged = |o: &str| picks.iter().find(|pk| pk.objectives.iter().any(|x| x.id() == o)).map(|pk| pk.idx);
    assert_eq!(tagged("least-detour"), Some(3));
    assert_eq!(tagged("most-removed"), Some(0));
    assert_eq!(tagged("no-closures"), Some(2));
    assert_eq!(tagged("fewest-changes"), Some(4));
}

#[test]
fn the_rise_must_be_smaller_by_more_than_its_noise() {
    let mut f = displacement_finals();
    // Rises of 100 and 56 with half widths 40 and 30 combine to 50: the gap of 44 is inside the noise, so nothing is displaced.
    f[1] = with_rise(f[1].clone(), 100.0, Some(40.0));
    f[2] = with_rise(f[2].clone(), 56.0, Some(30.0));
    assert!(displaces(&f, 1, 2).is_none());
    // The same gap of 44 against narrow intervals is displaced.
    f[1] = with_rise(f[1].clone(), 100.0, Some(5.0));
    f[2] = with_rise(f[2].clone(), 56.0, Some(5.0));
    assert!(displaces(&f, 1, 2).is_some());
    // Without an interval the floor applies.
    f[1] = with_rise(f[1].clone(), 56.0 + NOISE_FLOOR_VEH_H + 1.0, None);
    f[2] = with_rise(f[2].clone(), 56.0, None);
    let d = displaces(&f, 1, 2).expect("a gap past the floor");
    assert_eq!((d.noise_basis, d.noise), ("floor", NOISE_FLOOR_VEH_H));
    f[1] = with_rise(f[1].clone(), 56.0 + NOISE_FLOOR_VEH_H - 1.0, None);
    assert!(displaces(&f, 1, 2).is_none());
}

#[test]
fn an_option_that_removes_clearly_more_is_not_displaced_and_goal_winners_never_are() {
    let mut f = displacement_finals();
    // p2 removes 15 points more than p3 on the paired comparison (no seeds here, so the floor on the means decides): not displaced by p3.
    f[1].reduction_pct = 63.5;
    assert!(displaces(&f, 1, 2).is_none());
    // Make p2 the goal winner for no-closures by taking the closure off it and p3: it stays whatever its rise.
    f[1].reduction_pct = 48.9;
    f[1].closes = false;
    f[2].closes = true;
    let (picks, _, _, dropped) = select_by_objectives(&f, &params(), 6);
    assert!(picks.iter().any(|pk| pk.idx == 1 && pk.objectives.iter().any(|o| o.id() == "no-closures")), "{dropped:?}");
    assert!(dropped.iter().all(|d| d.from != 1));
}

#[test]
fn a_dropped_option_leaves_room_for_the_next_best() {
    let mut f = displacement_finals();
    f.push(with_rise(fin(&[30, 31, 32], 35.0, true, 2.0), 60.0, Some(5.0)));
    let (picks, _, _, dropped) = select_by_objectives(&f, &params(), 6);
    assert_eq!(dropped.len(), 1, "{dropped:?}");
    assert!(picks.iter().any(|pk| pk.idx == 6), "the next best joins the list");
    assert_eq!(picks.len(), 6);
}

#[test]
fn packages_at_the_same_places_fold_into_the_option_and_the_list_fills_with_the_next_best() {
    let mut f = finals();
    f.push(Final { places: f[0].places.clone(), harm: 40.0, ..fin(&[8], 25.0, true, 2.0) });
    let (picks, _, folds, _) = select_by_objectives(&f, &params(), 6);
    assert!(picks.iter().all(|pk| pk.idx != 4), "the variant at the same place is not a second option");
    assert!(folds.iter().any(|x| x.from == 4 && x.into == 0));
    // With room to spare, the next best by through cars removed joins the winners.
    assert!(picks.iter().any(|pk| pk.idx == 2 && pk.objectives.is_empty()));
}
