#!/bin/sh
# Builds crates/sim to WASM. Bootstraps Rust and wasm-pack when missing (e.g. Cloudflare Workers Builds).
set -e
export PATH="$HOME/.cargo/bin:$PATH"
if ! command -v cargo >/dev/null 2>&1; then
  curl -sSf https://sh.rustup.rs | sh -s -- -y --profile minimal
fi
rustup target add wasm32-unknown-unknown >/dev/null 2>&1 || true
if ! command -v wasm-pack >/dev/null 2>&1; then
  curl -sSf https://rustwasm.github.io/wasm-pack/installer/init.sh | sh || cargo install wasm-pack --locked
fi
wasm-pack build crates/sim --target web --out-dir ../../src/sim/pkg --release --no-pack -- --features wasm
