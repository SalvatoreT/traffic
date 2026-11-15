//! What `SIM_FINGERPRINT` hashes (shared by `build.rs` and `tests/fingerprint.rs`). Only inputs that can change what a run computes:
//! the `.rs` sources of the simulator's own module tree, the data files compiled into it, and the `Cargo.lock` entries of the
//! dependencies it uses. The bins, the proposal search, the validation and wandering tools, the tests and the WASM glue are left
//! out, and so are build files and everything the target or the machine decides. The value depends only on names and contents (line
//! endings normalized; comments and whitespace are hashed as they are).

use std::collections::{BTreeMap, BTreeSet};
use std::fs;
use std::path::{Path, PathBuf};

/// Directories and files of `src/` that do not affect a run.
const SKIP_DIRS: [&str; 3] = ["bin", "explore", "tests"];
const SKIP_FILES: [&str; 4] = ["tests.rs", "wasm.rs", "validate.rs", "wander.rs"];

fn sources(dir: &Path, root: &Path, top: bool, out: &mut Vec<(String, PathBuf)>) {
    let Ok(entries) = fs::read_dir(dir) else { return };
    for e in entries.flatten() {
        let path = e.path();
        let name = e.file_name().to_string_lossy().to_string();
        if path.is_dir() {
            if !(top && SKIP_DIRS.contains(&name.as_str())) {
                sources(&path, root, false, out);
            }
        } else if name.ends_with(".rs") && !(top && SKIP_FILES.contains(&name.as_str())) {
            out.push((path.strip_prefix(root).unwrap().to_string_lossy().replace('\\', "/"), path));
        }
    }
}

/// `data/*.json` directly in the crate's data directory: no dotfiles, no other extensions, no subfolders.
fn data_files(root: &Path, out: &mut Vec<(String, PathBuf)>) {
    let Ok(entries) = fs::read_dir(root.join("data")) else { return };
    for e in entries.flatten() {
        let name = e.file_name().to_string_lossy().to_string();
        if e.path().is_file() && !name.starts_with('.') && name.ends_with(".json") {
            out.push((format!("data/{name}"), e.path()));
        }
    }
}

/// Names under `[dependencies]` of the manifest that are not optional.
fn used_dependencies(manifest: &str) -> BTreeSet<String> {
    let (mut inside, mut out) = (false, BTreeSet::new());
    for line in manifest.lines() {
        let l = line.trim();
        if l.starts_with('[') {
            inside = l == "[dependencies]";
        } else if inside && !l.starts_with('#') && !l.contains("optional = true") {
            if let Some((name, _)) = l.split_once('=') {
                out.insert(name.trim().to_string());
            }
        }
    }
    out
}

/// `name version checksum` lines of the lock file for the used dependencies and everything they pull in.
fn lock_entries(lock: &str, used: &BTreeSet<String>) -> Vec<String> {
    struct Pkg {
        version: String,
        checksum: String,
        deps: Vec<String>,
    }
    let mut pkgs: BTreeMap<String, Vec<Pkg>> = BTreeMap::new();
    let (mut name, mut cur): (Option<String>, Option<Pkg>) = (None, None);
    let mut in_deps = false;
    let mut flush = |name: &mut Option<String>, cur: &mut Option<Pkg>| {
        if let (Some(n), Some(p)) = (name.take(), cur.take()) {
            pkgs.entry(n).or_default().push(p);
        }
    };
    let quoted = |s: &str| s.split('"').nth(1).unwrap_or("").to_string();
    for line in lock.lines() {
        let l = line.trim();
        if l == "[[package]]" {
            flush(&mut name, &mut cur);
            cur = Some(Pkg { version: String::new(), checksum: String::new(), deps: Vec::new() });
            in_deps = false;
        } else if let Some(p) = cur.as_mut() {
            if l.starts_with("name = ") {
                name = Some(quoted(l));
            } else if l.starts_with("version = ") {
                p.version = quoted(l);
            } else if l.starts_with("checksum = ") {
                p.checksum = quoted(l);
            } else if l.starts_with("dependencies = [") {
                in_deps = !l.ends_with(']') || l.ends_with("[");
            } else if in_deps && l == "]" {
                in_deps = false;
            } else if in_deps {
                p.deps.push(quoted(l).split(' ').next().unwrap_or("").to_string());
            }
        }
    }
    flush(&mut name, &mut cur);
    let (mut seen, mut stack): (BTreeSet<String>, Vec<String>) = (BTreeSet::new(), used.iter().cloned().collect());
    while let Some(n) = stack.pop() {
        if seen.insert(n.clone()) {
            for p in pkgs.get(&n).into_iter().flatten() {
                stack.extend(p.deps.iter().cloned());
            }
        }
    }
    let mut out = Vec::new();
    for n in &seen {
        for p in pkgs.get(n).into_iter().flatten() {
            out.push(format!("{n} {} {}", p.version, p.checksum));
        }
    }
    out
}

fn fnv(h: &mut u64, bytes: &[u8]) {
    for b in bytes {
        *h ^= *b as u64;
        *h = h.wrapping_mul(0x0000_0100_0000_01b3);
    }
}

/// The fingerprint of the crate in `root` and the files it was made from (for `rerun-if-changed`).
pub fn compute(root: &Path) -> (String, Vec<PathBuf>) {
    let mut files: Vec<(String, PathBuf)> = Vec::new();
    sources(&root.join("src"), root, true, &mut files);
    data_files(root, &mut files);
    files.sort_by(|a, b| a.0.cmp(&b.0));
    let used = used_dependencies(&fs::read_to_string(root.join("Cargo.toml")).unwrap_or_default());
    let lock_path = [root.join("Cargo.lock"), root.join("../../Cargo.lock")].into_iter().find(|p| p.is_file());
    let lock = lock_path.as_ref().map(|p| fs::read_to_string(p).unwrap_or_default()).unwrap_or_default();
    let deps = lock_entries(&lock, &used);

    let (mut a, mut b) = (0xcbf2_9ce4_8422_2325u64, 0x9ae1_6a3b_2f90_404fu64);
    let mut feed = |label: &str, bytes: &[u8]| {
        for h in [&mut a, &mut b] {
            fnv(h, label.as_bytes());
            fnv(h, &[0]);
            fnv(h, bytes);
            fnv(h, &[0]);
        }
    };
    for (rel, path) in &files {
        let text: Vec<u8> = fs::read(path).unwrap_or_default().into_iter().filter(|c| *c != b'\r').collect();
        feed(rel, &text);
    }
    for d in &deps {
        feed("dep", d.as_bytes());
    }
    let mut watched: Vec<PathBuf> = files.into_iter().map(|f| f.1).collect();
    watched.extend(lock_path);
    (format!("{a:016x}{b:016x}"), watched)
}
