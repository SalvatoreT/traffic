//! Computes `SIM_FINGERPRINT`: a hash of the simulator's own sources, so a stored result can be tied to the code that made it.
//! The bins, the proposal search and the tests do not change what a run computes and are left out. The value depends only on file
//! names and contents (line endings normalized), so every machine gets the same one for the same sources.

use std::fs;
use std::path::{Path, PathBuf};

const SKIP_IN_SRC: [&str; 4] = ["bin", "explore", "tests", "tests.rs"];

fn collect(dir: &Path, root: &Path, skip_top: bool, out: &mut Vec<(String, PathBuf)>) {
    let Ok(entries) = fs::read_dir(dir) else { return };
    for e in entries.flatten() {
        let path = e.path();
        let rel = path.strip_prefix(root).unwrap().to_string_lossy().replace('\\', "/");
        let name = e.file_name().to_string_lossy().to_string();
        if skip_top && SKIP_IN_SRC.contains(&name.as_str()) {
            continue;
        }
        if path.is_dir() {
            collect(&path, root, false, out);
        } else if rel.starts_with("src/") && !rel.ends_with(".rs") {
            continue;
        } else {
            out.push((rel, path));
        }
    }
}

fn fnv(h: &mut u64, bytes: &[u8]) {
    for b in bytes {
        *h ^= *b as u64;
        *h = h.wrapping_mul(0x0000_0100_0000_01b3);
    }
}

fn main() {
    let root = PathBuf::from(std::env::var("CARGO_MANIFEST_DIR").unwrap());
    let mut files: Vec<(String, PathBuf)> = Vec::new();
    collect(&root.join("src"), &root, true, &mut files);
    collect(&root.join("data"), &root, false, &mut files);
    files.push(("Cargo.toml".into(), root.join("Cargo.toml")));
    files.push(("build.rs".into(), root.join("build.rs")));
    files.sort_by(|a, b| a.0.cmp(&b.0));

    let (mut a, mut b) = (0xcbf2_9ce4_8422_2325u64, 0x9ae1_6a3b_2f90_404fu64);
    for (rel, path) in &files {
        let text: Vec<u8> = fs::read(path).unwrap_or_default().into_iter().filter(|c| *c != b'\r').collect();
        for h in [&mut a, &mut b] {
            fnv(h, rel.as_bytes());
            fnv(h, &[0]);
            fnv(h, &text);
            fnv(h, &[0]);
        }
        println!("cargo:rerun-if-changed={}", path.display());
    }
    println!("cargo:rerun-if-changed={}", root.join("src").display());
    println!("cargo:rerun-if-changed={}", root.join("data").display());
    println!("cargo:rustc-env=SIM_FINGERPRINT={a:016x}{b:016x}");
}
