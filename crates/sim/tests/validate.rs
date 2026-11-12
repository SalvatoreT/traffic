//! The validation suite as a regression test: every case passes except the documented deviations.
//! The deviations are explained in `data/calibration/validation.md` and the calibration record.

use traffic_sim::validate::run_all;

/// Cases that do not meet their expected range yet. A case that starts passing must be removed from this list.
const KNOWN_DEVIATIONS: &[&str] = &["a3", "b9", "c2", "e2", "e3", "e6", "e9", "f2", "f3", "j6", "j8", "j9", "j12"];

#[test]
fn validation_suite_has_no_new_failures() {
    let cases = run_all();
    let bad: Vec<String> = cases
        .iter()
        .filter(|c| !c.pass() && !KNOWN_DEVIATIONS.contains(&c.id.as_str()))
        .map(|c| format!("{}: {} = {:.3} outside [{:.3}, {:.3}]", c.id, c.name, c.sim, c.lo, c.hi))
        .collect();
    assert!(bad.is_empty(), "new failures:\n{}", bad.join("\n"));
    let fixed: Vec<&str> = cases.iter().filter(|c| c.pass() && KNOWN_DEVIATIONS.contains(&c.id.as_str())).map(|c| c.id.as_str()).collect();
    assert!(fixed.is_empty(), "now passing, remove from KNOWN_DEVIATIONS: {fixed:?}");
}

#[test]
fn suite_is_deterministic() {
    let a = run_all();
    let b = run_all();
    for (x, y) in a.iter().zip(&b) {
        assert_eq!(x.sim.to_bits(), y.sim.to_bits(), "{}", x.id);
    }
}
