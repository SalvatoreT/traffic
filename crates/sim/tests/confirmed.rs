//! The displacement rule on confirmed figures: the pass the search runs after confirmation and its application to a finished proposals file.

use serde_json::{json, Value};
use traffic_sim::explore::confirmed::{patch_report, reapply};
use traffic_sim::explore::paired::CtPairs;
use traffic_sim::explore::report::{displace_listed, Figures, BASIS_CONFIRMATION};

const SEEDS: [u64; 10] = [101, 102, 103, 104, 105, 106, 107, 108, 109, 110];

/// Through cars an hour per seed for one period: the baseline is 100 and the scenario leaves `left` with a little seed spread.
fn pairs(left: f64) -> CtPairs {
    let spread = |k: usize| (k as f64 % 3.0 - 1.0) * 2.0;
    CtPairs::new(&SEEDS, vec![vec![100.0; 10]], vec![(0..10).map(|k| left + spread(k)).collect()]).unwrap()
}

fn fig(removed: f64, rise: f64, half: f64, p: &CtPairs) -> Figures<'_> {
    Figures { reduction_pct: removed, rise, rise_half: Some(half), pairs: p }
}

#[test]
fn an_untagged_option_that_survives_on_search_figures_is_dropped_on_confirmed_ones() {
    // Options as in the Rockridge file: p2 (no closures) and p3 (no tag) are not resolved from each other on through cars.
    let (p1, p2, p3, p4) = (pairs(27.5), pairs(52.2), pairs(53.8), pairs(55.8));
    // Search seeds: p3's rise is only a little above p2's, inside the noise of the two rises.
    let search = [fig(72.5, 81.0, 10.0, &p1), fig(47.8, 70.0, 12.0, &p2), fig(46.2, 85.0, 12.0, &p3), fig(44.2, 73.0, 20.0, &p4)];
    let protected = [true, true, false, true];
    assert!(displace_listed(&search, &protected, "search", &[1, 2, 3]).is_empty());
    // Confirmation seeds: p2's largest rise is +57 (51 to 63) and p3's +112 (101 to 123).
    let confirmed = [fig(72.5, 81.0, 10.0, &p1), fig(47.8, 57.0, 6.0, &p2), fig(46.2, 112.0, 11.0, &p3), fig(44.2, 73.0, 23.0, &p4)];
    let dropped = displace_listed(&confirmed, &protected, BASIS_CONFIRMATION, &SEEDS);
    assert_eq!(dropped.len(), 1, "{dropped:?}");
    let d = &dropped[0];
    assert_eq!((d.from, d.by), (2, 1), "p3 is displaced by p2, the displacing option with the smallest rise");
    assert_eq!(d.removal, "at least as many");
    assert_eq!((d.basis, d.seeds.as_slice()), (BASIS_CONFIRMATION, SEEDS.as_slice()));
    assert!(d.phrase().ends_with("figures from the confirmation seeds 101-110"), "{}", d.phrase());
}

#[test]
fn a_goal_winner_is_never_dropped_whatever_its_rise() {
    let (a, b) = (pairs(50.0), pairs(50.0));
    let figs = [fig(50.0, 300.0, 5.0, &a), fig(50.0, 40.0, 5.0, &b)];
    assert!(displace_listed(&figs, &[true, true], BASIS_CONFIRMATION, &SEEDS).is_empty());
    let dropped = displace_listed(&figs, &[false, true], BASIS_CONFIRMATION, &SEEDS);
    assert_eq!(dropped.len(), 1);
    assert_eq!((dropped[0].from, dropped[0].by), (0, 1));
    // The same option stays when it is the winner and the other is not.
    assert!(displace_listed(&figs, &[true, false], BASIS_CONFIRMATION, &SEEDS).is_empty());
}

#[test]
fn the_worst_option_goes_first_and_the_rest_are_judged_again() {
    let (a, b, c) = (pairs(50.0), pairs(50.0), pairs(50.0));
    // Both untagged options are displaced by the winner; the one with the larger rise goes first, and the other is then judged on its own.
    let figs = [fig(50.0, 40.0, 5.0, &a), fig(50.0, 200.0, 5.0, &b), fig(50.0, 120.0, 5.0, &c)];
    let dropped = displace_listed(&figs, &[true, false, false], BASIS_CONFIRMATION, &SEEDS);
    assert_eq!(dropped.iter().map(|d| d.from).collect::<Vec<_>>(), vec![1, 2]);
    // An option that removes clearly more through cars is not displaced.
    let (hi, lo) = (pairs(20.0), pairs(60.0));
    let figs = [fig(80.0, 150.0, 5.0, &hi), fig(40.0, 40.0, 5.0, &lo)];
    assert!(displace_listed(&figs, &[false, true], BASIS_CONFIRMATION, &SEEDS).is_empty());
}

fn option(id: &str, objectives: &[&str], removed: f64, rise: f64, half: f64, left: f64) -> Value {
    let mut p = json!({
        "id": id, "kind": "search", "title": format!("title of {id}"), "link": format!("#v1;{id}"),
        "cutThrough": {"changePct": -removed},
        "byPeriod": {"pm_peak": {"allTraffic": {"largestIncrease": {"increaseVehPerHour": rise, "effect": {"interval": [rise - half, rise + half]}}}}},
        "evidence": {"role": "confirmation", "seeds": SEEDS, "baselineVehPerHour": {"pm_peak": vec![100.0; 10]}, "scenarioVehPerHour": {"pm_peak": pairs(left).scen[0]}},
    });
    if !objectives.is_empty() {
        p["objectives"] = json!(objectives);
    }
    p
}

fn file() -> Value {
    json!({"version": 5, "area": "t", "groups": [{
        "id": "unconstrained",
        "computed": {
            "periods": ["pm_peak"], "seeds": SEEDS,
            "estimation": {"selection": {"estimates": "confirmation", "discoverySeeds": [1, 2, 3], "confirmationSeeds": SEEDS, "shortlist": ["#v1;p1", "#v1;p2", "#v1;p3", "#v1;p4"]}},
            "displacement": {"floorVehPerHour": 10, "rule": "r", "dropped": [{"from": "#v1;old", "by": "#v1;p1", "reason": "removes 70.0% of through cars against 40.0% (at least as many), and its largest all-car rise on one block is 50 cars an hour against 90, a difference of more than 10 (floor)"}]},
            "similarity": {"folded": [{"from": "#v1;x", "into": "#v1;p3", "intoPublished": true}]},
        },
        "optionComparisons": [],
        "proposals": [
            option("p1", &["most-removed"], 72.5, 81.0, 10.0, 27.5),
            option("p2", &["no-closures"], 47.8, 57.0, 6.0, 52.2),
            option("p3", &[], 46.2, 112.0, 11.0, 53.8),
            option("p4", &["least-detour"], 44.2, 73.0, 23.0, 55.8),
            {"id": "ref", "kind": "reference", "link": "#v1;ref"},
        ],
    }]})
}

#[test]
fn reapplying_the_rule_drops_renumbers_and_records_the_confirmation_figures() {
    let mut f = file();
    let ch = reapply(&mut f).unwrap();
    assert_eq!(ch[0].dropped, vec!["p3"]);
    assert_eq!(ch[0].renamed, vec![("p4".to_string(), "p3".to_string())]);
    let g = &f["groups"][0];
    let ids: Vec<&str> = g["proposals"].as_array().unwrap().iter().map(|p| p["id"].as_str().unwrap()).collect();
    assert_eq!(ids, ["p1", "p2", "p3", "ref"]);
    assert_eq!(g["proposals"][2]["link"], "#v1;p4");
    let cmp = g["optionComparisons"].as_array().unwrap();
    assert_eq!(cmp.len(), 2);
    assert_eq!((cmp[1]["option"].as_str(), cmp[1]["against"].as_str()), (Some("p2"), Some("p3")));
    let recs = g["computed"]["displacement"]["dropped"].as_array().unwrap();
    assert_eq!(recs.len(), 2);
    assert_eq!((recs[0]["basis"].as_str(), recs[0]["seeds"].clone()), (Some("search"), json!([1, 2, 3])));
    assert!(recs[0]["reason"].as_str().unwrap().ends_with("figures from the search seeds 1-3"));
    assert_eq!((recs[1]["from"].as_str(), recs[1]["by"].as_str(), recs[1]["basis"].as_str()), (Some("#v1;p3"), Some("#v1;p2"), Some("confirmation")));
    assert!(recs[1]["reason"].as_str().unwrap().ends_with("figures from the confirmation seeds 101-110"));
    assert_eq!(g["computed"]["similarity"]["folded"][0]["intoPublished"], false);
    assert_eq!(g["computed"]["estimation"]["selection"]["shortlist"].as_array().unwrap().len(), 4, "the frozen shortlist is not rewritten");
    // A second pass finds nothing to change.
    let again = reapply(&mut f).unwrap();
    assert!(!again[0].changed());
}

#[test]
fn the_report_follows_the_file() {
    let mut f = file();
    let ch = reapply(&mut f).unwrap();
    let md = "# Proposals report: t\n\n<!-- profile:unconstrained -->\n## Proposals (unconstrained)\n\n### Finalists, rechecked at full length\n\n| # | A | Note |\n| --- | --- | --- |\n| 1 | x | chosen as option 1: a |\n| 2 | y | chosen as option 3: b |\n| 3 | z | chosen as option 4: c |\n\n### Chosen options\n\n1. One.\n2. Two.\n3. Three.\n4. Four.\n- Option 1 old than option 2, paired on the same seeds.\n- Option 2 old than option 3, paired on the same seeds.\n- Option 3 old than option 4, paired on the same seeds.\n\n#### All traffic on side-street blocks, by period (through and local trips together)\n\n| Option | Period |\n| --- | --- |\n| 1 | pm_peak |\n| 3 | pm_peak |\n| 4 | pm_peak |\n\n### Dropped for displacement\n\nold intro\n\n- `#v1;old` dropped for `#v1;p1`: old reason.\n";
    let out = patch_report(md, &ch);
    assert!(out.contains("| 2 | y | not published after confirmation, displaced by \"title of p2\": removes 47.8%"), "{out}");
    assert!(out.contains("| 3 | z | chosen as option 3: c |"));
    assert!(out.contains("1. One.\n2. Two.\n3. Four.\n- Option 1 "));
    assert!(!out.contains("Three."));
    assert_eq!(out.matches("\n- Option ").count(), 2);
    assert!(out.contains("| 1 | pm_peak |\n| 3 | pm_peak |\n\n") && !out.contains("| 4 | pm_peak |"));
    assert!(out.contains("figures from the search seeds 1-3.") && out.contains("figures from the confirmation seeds 101-110."));
    assert!(!out.contains("old intro") && !out.contains("old reason"));
    assert!(out.ends_with('\n'));
}
