## Context

The user requested an adversarial review on 2026-11-15 and asked for observations and fix proposals on `main` for a later agent. This change remains open with implementation tasks unchecked. The review uses source commit `415df88` and the downloaded network SHA-256 `5fe8241a6ba1e3068db2a84bed6cf523f4bcd4057f0234d1cc0e2527aa7d2352`. Node IDs below identify that data version only; implementation tests must also identify the junctions by their fixture geometry or streets.

## Confirmed observations

### SIG-1: Observations override a requested intervention

Priority: high. Confidence: confirmed by execution.

`crates/sim/src/eff.rs:183` stores `signal_timing.cycle` in `cycle_override`. `plan_with_observation` at line 607 takes that override as `pin`, but uses it only when there is no matching observation or no observed approach matches. When an observation matches, line 624 selects `obs.cycle_s` regardless of `pin`.

The existing tests at `crates/sim/src/tests.rs:954` check observed timing and a rebuild with an empty scenario. The pinned-cycle test at line 1608 has no observation. Neither covers their interaction.

A public-API probe built the published network's `Topo`, derived `Eff` with a signal timing intervention, set `period` to `pm_peak`, and called `plan_signals` with 100 vehicles/hour on each link. It produced:

| Node | Requested cycle | Stored override | Actual cycle |
| --- | --- | --- | --- |
| 1069, Colby Street / Claremont Avenue | none | none | 79 s |
| 1069 | 100 s | 100 s | 79 s |
| 1069 | 150 s | 150 s | 79 s |
| 680, 52nd Street / Shattuck Avenue | 100 s | 100 s | 110 s |
| 680 | 150 s | 150 s | 110 s |

This reproduces without traffic simulation or randomness. The fixed flow is a test input, not an observed flow or proposed model parameter. The error means an intervention can appear in a scenario while doing nothing. It does not establish the size or direction of any traffic effect after repair.

### SIG-2: Declared and executed observed cycles can disagree

Priority: high. Confidence: confirmed by execution.

The same probe found node 679, the MLK Way ramp signal, has an observed PM cycle of 50 seconds and two fixed greens of 29 and 13 seconds. The implementation adds the global yellow and all-red assumptions, 3.5 and 1.5 seconds per phase (`params.rs:9`), so the generated plan totals 52 seconds. Its phases are `(start=0, green=29)` and `(start=34, green=13)`. `plan_with_observation` returns that total at `eff.rs:649`, silently replacing the declared cycle. The observation's source describes 8 seconds of lost time; the code adds 10 seconds of clearance. Lost time, effective green, and displayed green must be reconciled against the source before choosing a correction [CHRCO-EIR2014; FHWA-STM2008]. This review has not reverified the source worksheet.

The allocation at `eff.rs:627` can also enlarge the residual budget to a minimum for free phases without checking whether it still fits the cycle. The generic `webster` allocator does the same at line 582. The fix must enforce one duration-budget invariant in both paths.

## Reproduction

With the published data downloaded, put the following program in a temporary Cargo package with `traffic-sim = { path = "/absolute/path/to/traffic/crates/sim" }` and `serde_json = "1"`. Run it from the repository root with `cargo run --manifest-path /path/to/temporary/Cargo.toml`. It reads the network and prints plans; it changes no repository files.

```rust
use traffic_sim::{Network, eff::Eff, topo::Topo};
fn main() {
    let net: Network = serde_json::from_str(
        &std::fs::read_to_string("public/data/rockridge.network.json").unwrap()
    ).unwrap();
    let topo = Topo::new(&net);
    for n in [679, 680, 1069] {
        for cycle in [None, Some(100.0), Some(150.0)] {
            let ivs = cycle.map(|c| serde_json::from_value(serde_json::json!([
                {"type":"signal_timing", "node":n, "cycle":c}
            ])).unwrap()).unwrap_or(Vec::new());
            let mut eff = Eff::derive(&topo, &net, &ivs);
            eff.period = "pm_peak".into();
            eff.plan_signals(&topo, &net, &vec![100.0; net.links.len()]);
            let p = eff.sig[n].as_ref().unwrap();
            println!("node={n} requested={cycle:?} actual={} phases={:?}",
                p.cycle, p.phases);
        }
    }
}
```

The review ran this probe against the data hash above. Future downloaded data may differ; preserve small synthetic regression fixtures that exercise the same conditions.

## Decisions

1. Explicit intervention wins. Keep the observed phase topology, including own phases and shared approaches, but release observed green-duration pins when the user specifies a cycle. Allocate that cycle's greens using the existing flow-based Webster logic [Webster1958]. This is a scenario contract, not a claim that the proposed timing matches a field controller. Holding absolute observed greens while changing only the total cycle was rejected because it can make the request infeasible and defeats the existing promise that splits adapt to measured flows. Silently preferring the observation was rejected because it ignores the requested experiment.
2. Reject inconsistent timing budgets. Validate finite positive durations, clearance allowances, and minimum greens before constructing a plan. An observed cycle or explicit request that cannot fit must return a diagnostic naming the node, period, requested duration, required budget, and observation source where present. Do not silently extend the cycle or shorten a reported observation. Automatic scaling of observed greens was rejected because it would change measured inputs without disclosing the change. A separately selected, clearly labeled unobserved fallback can be a later feature.
3. Preserve the evidence. Inspect the original ramp timing worksheet and distinguish effective green, displayed green, lost time, and clearance [CHRCO-EIR2014; FHWA-STM2008]. If the simulator needs observation-specific clearance fields, add them with provenance and validation. Do not lower a global clearance constant merely to make this one observation add up. No new timing value is selected by this proposal.
4. Make the same contract hold during adaptation and reset. A successful explicit cycle remains fixed through adaptations [Webster1958]; removing it restores the applicable validated observation. A controller's non-signal mode must not use a stale signal plan. Tests must include own/shared phases because the phase groups determine the required budget [FHWA-STM2008].

## Validation and impact review

Use synthetic fixtures for precedence and invalid duration budgets, and a Rockridge integration check for the three observed junctions. Inspect phase plans immediately and after adaptation. Rebuild WASM and compare native/WASM outputs on the same inputs. Rerun baseline calibration for affected periods before interpreting any changed intervention result. If downstream calibration reports or published results change, record the old/new simulator and data hashes and regenerate them through the normal data workflow; do not tune demand until the signal contracts pass.

## Risks and limits

Rejecting invalid observations will initially stop runs that currently accept them, including the known ramp fixture. Reconcile those data in the same implementation change. The repair can alter queues and route choices outside the study area, so its effect on the Rockridge study area needs measurement. Phase topology and green allocation remain model assumptions where field timing is incomplete.
