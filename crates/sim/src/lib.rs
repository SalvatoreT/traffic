//! Traffic simulation core. See `docs/references.md` for citation keys used in comments.

pub mod eff;
pub mod model;
pub mod params;
pub mod rng;
pub mod route;
pub mod sim;
pub mod topo;

pub use model::{Config, Demand, Metrics, Network};
pub use sim::Simulation;

#[cfg(feature = "wasm")]
mod wasm;

#[cfg(test)]
mod tests;
