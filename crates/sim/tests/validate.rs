//! The validation suite as a regression test: every case passes except the documented deviations.
//! The deviations are explained in `data/calibration/validation.md` and the calibration record.

use traffic_sim::validate::run_all;

/// Cases that do not meet their expected range yet, from `data/calibration/validation.deviations.json` (the same file the validate binary and the assessment read).
/// A case that starts passing must be removed from it. The exemption keeps the regression test usable; it does not make the case a pass.
fn known_deviations() -> Vec<String> {
    let path = std::path::Path::new(env!("CARGO_MANIFEST_DIR")).join("../../data/calibration/validation.deviations.json");
    let v: serde_json::Value = serde_json::from_str(&std::fs::read_to_string(path).expect("validation.deviations.json")).expect("json");
    v["deviations"].as_array().expect("deviations").iter().map(|d| d["id"].as_str().expect("id").to_string()).collect()
}

#[test]
fn validation_suite_has_no_new_failures() {
    let cases = run_all();
    let known = known_deviations();
    let bad: Vec<String> = cases
        .iter()
        .filter(|c| !c.pass() && !known.contains(&c.id))
        .map(|c| format!("{}: {} = {:.3} outside [{:.3}, {:.3}]", c.id, c.name, c.sim, c.lo, c.hi))
        .collect();
    assert!(bad.is_empty(), "new failures:\n{}", bad.join("\n"));
    let fixed: Vec<&str> = cases.iter().filter(|c| c.pass() && known.contains(&c.id)).map(|c| c.id.as_str()).collect();
    assert!(fixed.is_empty(), "now passing, remove from validation.deviations.json: {fixed:?}");
}

#[test]
fn suite_is_deterministic() {
    let a = run_all();
    let b = run_all();
    for (x, y) in a.iter().zip(&b) {
        assert_eq!(x.sim.to_bits(), y.sim.to_bits(), "{}", x.id);
    }
}
