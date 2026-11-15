//! Computes `SIM_FINGERPRINT`: a hash of what can change a run, so a stored result can be tied to the code that made it.
//! See `fingerprint.rs` for what is and is not hashed.

use std::path::PathBuf;

#[path = "fingerprint.rs"]
mod fingerprint;

fn main() {
    let root = PathBuf::from(std::env::var("CARGO_MANIFEST_DIR").unwrap());
    let (value, watched) = fingerprint::compute(&root);
    for p in watched {
        println!("cargo:rerun-if-changed={}", p.display());
    }
    println!("cargo:rerun-if-changed={}", root.join("src").display());
    println!("cargo:rerun-if-changed={}", root.join("data").display());
    println!("cargo:rerun-if-changed={}", root.join("fingerprint.rs").display());
    println!("cargo:rustc-env=SIM_FINGERPRINT={value}");
}
