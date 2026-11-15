//! Provenance for report files: which simulator source, which revision and which input files a report came from. Used by the `calibrate` and `validate`
//! binaries (included with `#[path]`, so the library and its WASM build do not carry it). Assessments compare these manifests before they combine runs.

#![allow(dead_code)]

use crate::sha256::sha256_hex;
use serde_json::{json, Value};
use std::path::Path;
use std::process::Command;

pub const SCHEMA: u32 = 1;

/// SHA-256 of a file's bytes, or null when it cannot be read.
pub fn file_hash(path: &Path) -> Value {
    match std::fs::read(path) {
        Ok(b) => json!(sha256_hex(&b)),
        Err(_) => Value::Null,
    }
}

fn git(root: &Path, args: &[&str]) -> Option<String> {
    let o = Command::new("git").args(args).current_dir(root).output().ok()?;
    if !o.status.success() {
        return None;
    }
    Some(String::from_utf8_lossy(&o.stdout).trim().to_string())
}

/// The simulator that produced a report. `fingerprint` is `traffic_sim::FINGERPRINT`, fixed when the library is built (see `fingerprint.rs`): a hash of what can change a run, so it names the code the binary contains even when the working tree has moved on. `revision` and `dirty` describe the checkout at run time.
pub fn simulator(root: &Path) -> Value {
    let dirty = git(root, &["status", "--porcelain", "--", "crates", "Cargo.toml", "Cargo.lock"]).map(|s| !s.is_empty());
    json!({
        "fingerprint": traffic_sim::FINGERPRINT,
        "version": env!("CARGO_PKG_VERSION"),
        "revision": git(root, &["rev-parse", "HEAD"]),
        "dirty": dirty,
    })
}

/// A named input: its path under the repository root and content hash (null hash when the file is absent).
pub fn input(root: &Path, rel: &str) -> Value {
    json!({"path": rel, "sha256": file_hash(&root.join(rel))})
}

pub fn input_at(root: &Path, p: &Path) -> Value {
    let rel = p.strip_prefix(root).map(|r| r.to_string_lossy().to_string()).unwrap_or_else(|_| p.to_string_lossy().to_string());
    json!({"path": rel, "sha256": file_hash(p)})
}
