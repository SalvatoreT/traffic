//! What a proposals group records about how it was made, and whether it may be reused (design D1 of `proposal-evidence-integrity`).
//! `src/lib/proposals.ts` (`evidenceStatus`) applies the same rule for the app, the text pages and the pictures.

use super::paired::REPORT_METHOD;
use serde_json::Value;
use std::path::Path;
use std::process::Command;

/// Provenance a group must record for its figures to be checked at all. A group that lacks any is unverified, not stale.
pub const REQUIRED: [&str; 6] = ["networkHash", "demandHash", "simulator", "reportMethod", "settings", "minutes"];

#[derive(Debug, PartialEq)]
pub enum Evidence {
    /// Every input and the method match.
    Current,
    /// Recorded inputs or method differ from the current ones: the figures describe other runs.
    Stale(Vec<String>),
    /// Required provenance is missing, so nothing can be compared.
    Unverified(Vec<String>),
}

/// Whether a group's figures were made from these inputs and this method. Missing provenance is checked first: without it a mismatch
/// cannot be told from an old file, and the current engine's fingerprint is never assumed for it.
pub fn check(computed: &Value, net_hash: &str, demand_hash: &str, simulator: &str) -> Evidence {
    let missing: Vec<String> = REQUIRED.iter().filter(|k| computed.get(**k).is_none_or(|v| v.is_null())).map(|k| k.to_string()).collect();
    if !missing.is_empty() {
        return Evidence::Unverified(missing);
    }
    let mut stale = Vec::new();
    let differs = |k: &str, want: &str| computed[k].as_str() != Some(want);
    if differs("networkHash", net_hash) {
        stale.push(format!("network {} (current {})", computed["networkHash"], net_hash));
    }
    if differs("demandHash", demand_hash) {
        stale.push(format!("demand {} (current {})", computed["demandHash"], demand_hash));
    }
    if differs("simulator", simulator) {
        stale.push(format!("simulator {} (current {})", computed["simulator"], simulator));
    }
    if differs("reportMethod", REPORT_METHOD) {
        stale.push(format!("reporting method {} (current {})", computed["reportMethod"], REPORT_METHOD));
    }
    if stale.is_empty() {
        Evidence::Current
    } else {
        Evidence::Stale(stale)
    }
}

/// The git revision `root` is at, with `-dirty` when the working tree has uncommitted changes; `unknown` when it cannot be read.
pub fn source_revision(root: &Path) -> String {
    let git = |args: &[&str]| Command::new("git").arg("-C").arg(root).args(args).output().ok().filter(|o| o.status.success()).map(|o| String::from_utf8_lossy(&o.stdout).trim().to_string());
    match git(&["rev-parse", "--short=12", "HEAD"]) {
        Some(rev) if !rev.is_empty() => match git(&["status", "--porcelain", "--untracked-files=no"]) {
            Some(s) if !s.is_empty() => format!("{rev}-dirty"),
            _ => rev,
        },
        _ => "unknown".into(),
    }
}
