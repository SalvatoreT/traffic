#[path = "../fingerprint.rs"]
#[allow(dead_code)]
mod fingerprint;

use std::fs;
use std::path::{Path, PathBuf};

#[test]
fn fingerprint_is_32_hex_characters() {
    let f = traffic_sim::FINGERPRINT;
    assert_eq!(f.len(), 32);
    assert!(f.chars().all(|c| c.is_ascii_hexdigit()));
}

fn write(root: &Path, rel: &str, text: &str) {
    let p = root.join(rel);
    fs::create_dir_all(p.parent().unwrap()).unwrap();
    fs::write(p, text).unwrap();
}

const LOCK: &str = "version = 4\n\n[[package]]\nname = \"serde\"\nversion = \"1.0.1\"\nchecksum = \"aaa\"\ndependencies = [\n \"serde_core\",\n]\n\n[[package]]\nname = \"serde_core\"\nversion = \"1.0.1\"\nchecksum = \"bbb\"\n\n[[package]]\nname = \"wasm-bindgen\"\nversion = \"0.2.1\"\nchecksum = \"ccc\"\n\n[[package]]\nname = \"traffic-sim\"\nversion = \"0.1.0\"\ndependencies = [\n \"serde\",\n \"wasm-bindgen\",\n]\n";

fn fixture(name: &str) -> PathBuf {
    let root = std::env::temp_dir().join(format!("sim-fingerprint-{}-{name}", std::process::id()));
    let _ = fs::remove_dir_all(&root);
    write(&root, "Cargo.toml", "[package]\nname = \"x\"\n\n[dependencies]\nserde = \"1\"\nwasm-bindgen = { version = \"0.2\", optional = true }\n");
    write(&root, "Cargo.lock", LOCK);
    write(&root, "src/lib.rs", "pub mod sim;\n");
    write(&root, "src/sim.rs", "fn a() {}\n");
    write(&root, "src/sim/initial.rs", "fn b() {}\n");
    write(&root, "data/delays.json", "{\"signal\":1}\n");
    root
}

#[test]
fn only_what_can_change_a_run_changes_the_fingerprint() {
    let root = fixture("a");
    let base = fingerprint::compute(&root).0;
    assert_eq!(base, fingerprint::compute(&root).0, "deterministic");
    // Left out: the proposal search, bins, tests, WASM glue, tools, stray and hidden data files, build files, unrelated lock entries.
    for (rel, text) in [
        ("src/explore/search.rs", "x"),
        ("src/bin/validate.rs", "x"),
        ("src/tests/a.rs", "x"),
        ("src/tests.rs", "x"),
        ("src/wasm.rs", "x"),
        ("src/validate.rs", "x"),
        ("src/wander.rs", "x"),
        ("data/.DS_Store", "x"),
        ("data/notes.txt", "x"),
        ("data/sub/other.json", "x"),
        ("build.rs", "x"),
        ("fingerprint.rs", "x"),
        ("tests/fingerprint.rs", "x"),
    ] {
        write(&root, rel, text);
        assert_eq!(fingerprint::compute(&root).0, base, "{rel} must not change the fingerprint");
    }
    let lock = LOCK.replace("1.0.1\"\nchecksum = \"aaa", "1.0.1\"\nchecksum = \"aaa").replace("0.2.1\"\nchecksum = \"ccc", "0.2.9\"\nchecksum = \"zzz");
    write(&root, "Cargo.lock", &lock);
    assert_eq!(fingerprint::compute(&root).0, base, "an optional (WASM-only) dependency is not hashed");
    // Line endings do not count.
    write(&root, "src/sim.rs", "fn a() {}\r\n");
    assert_eq!(fingerprint::compute(&root).0, base);
    // Counted: simulator sources, compiled-in data, used dependencies.
    for (rel, text) in [("src/sim.rs", "fn a() { 1; }\n"), ("src/sim/initial.rs", "fn c() {}\n"), ("src/new.rs", "fn n() {}\n"), ("data/delays.json", "{\"signal\":2}\n"), ("Cargo.lock", &LOCK.replace("\"bbb\"", "\"bbc\""))] {
        let root = fixture("b");
        let before = fingerprint::compute(&root).0;
        write(&root, rel, text);
        assert_ne!(fingerprint::compute(&root).0, before, "{rel} must change the fingerprint");
        let _ = fs::remove_dir_all(&root);
    }
    let _ = fs::remove_dir_all(&root);
}

#[test]
fn the_fingerprint_does_not_depend_on_where_the_crate_lives() {
    let (a, b) = (fixture("c1"), fixture("c2"));
    assert_eq!(fingerprint::compute(&a).0, fingerprint::compute(&b).0);
    let _ = fs::remove_dir_all(&a);
    let _ = fs::remove_dir_all(&b);
}
