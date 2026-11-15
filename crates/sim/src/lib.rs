//! Traffic simulation core. See `docs/references.md` for citation keys used in comments.

pub mod diverter;
pub mod eff;
pub mod explore;
pub mod model;
pub mod params;
pub mod redistribution;
pub mod rng;
pub mod route;
pub mod sim;
pub mod topo;
pub mod validate;
pub mod wander;

pub use model::{Config, Demand, Metrics, Network};
pub use sim::Simulation;

/// Hash of the simulator's sources, made by `build.rs`. Stored results record it so a viewer can tell they came from this code.
pub const FINGERPRINT: &str = env!("SIM_FINGERPRINT");

#[cfg(feature = "wasm")]
mod wasm;

#[cfg(test)]
mod tests;
