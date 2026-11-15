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

## Implementation, 2026-11-15

### Confirmation

Both findings reproduce with the probe in this design on the published network (SHA-256 `5fe8241a…`), using the engine after `repair-local-trip-measurement-integrity`. With 100 vehicles/hour on every link, node 1069 (Colby St / Claremont Ave) ran 79 s for no request, 100 s and 150 s, and node 680 ran 110 s for all three. Node 679 (the MLK Way ramp signal) ran 52 s against a declared 50 s in PM and midday, and 47 s against 45 s in AM. A 40 s request was also ignored at all three. A second silent change came up: `Eff::derive` clamped any requested cycle to 30 to 180 s, so a request of 240 s, which the CLI accepts, ran at 180 s.

### The ramp worksheet (task 1.3)

The Synchro worksheet in [CHRCO-EIR2014] Appendix C ("SB SR-24 On-Ramp & MLK Way & NB SR-24 Off-Ramp", Existing PM and Existing AM) lists, for both phases, an actuated green G equal to the effective green g (PM: 13.0 s for the northbound stream in phase 2, 29.0 s for the southbound on-ramp stream in phase 6; AM: 8.0 s and 29.0 s), a total lost time of 4.0 s per lane group, and a clearance time of 4.0 s per phase. It gives the cycle as 50.0 s (AM 45.0 s) with a sum of lost time of 8.0 s. Following the convention the worksheet uses [FHWA-STM2008], effective green is the displayed green plus the clearance less the lost time, here G + 4 − 4 = G. The cycle is the sum of displayed greens and clearance intervals: 29 + 13 + 2 × 4 = 50 s and 29 + 8 + 2 × 4 = 45 s. The observation's greens are displayed greens, which is what the simulator's phase green means. The mismatch is the clearance: the source has 4.0 s, the simulator's global `YELLOW + ALL_RED` is 5.0 s. The worksheet does not split the 4.0 s into yellow and all-red.

### What changed

1. Explicit cycle precedence. A `signal_timing` intervention sets the executed cycle at a node with an observed timing. The observed phase structure stays (own phases and shared approaches, from `own_phases`); the observed greens are released and the requested cycle is split by flow ratio [Webster1958]. The cycle stays through adaptation and the observation returns when the intervention is removed (test `an_explicit_cycle_overrides_the_observed_one_and_keeps_its_phases`). `Metrics::retimedSignals` lists the observed signals a scenario retimes, and the CLI report says so in its notes.

2. One duration budget for every plan. `plan_with_observation` returns a `SignalIssue` instead of a plan whose greens and clearance intervals do not add up to its cycle, whether the cycle is observed or requested. The issue names the node, period, cycle, required duration and observation source. An observed timing whose fixed greens leave room the other phases cannot fill, or overrun it, is rejected the same way. A requested cycle outside 30 to 180 s is rejected instead of clamped. Unpinned Webster plans pick a cycle at least as long as their phases need. The shortest green a phase can be given, 5 s (`GREEN_FLOOR_S`), was the floor the allocators already used and stays an assumption.

3. Diagnostics reach every caller. `Simulation::new` returns the issue as an error, and `set_interventions` refuses the scenario and keeps the previous one. WASM callers get it as the thrown error message. `npm run simulate` exits with code 3 when the data cannot run and code 2 when the scenario cannot. The app's worker drops both runs when the engine refuses a scenario, so no result is shown for it, and the error appears in the app's alert.

4. Observation-specific clearance. `SignalTiming` has an optional `clearanceS`, used for every phase of that plan in allocation and validation; yellow stays `YELLOW` and the rest of the interval is all-red. Values outside 3.5 to 15 s are rejected. The six MLK Way ramp observations in `data/areas/rockridge.json` now carry `clearanceSeconds: 4` with the worksheet reading in their source, and `tools/lib/signal-obs.ts` copies it into the network, refusing to merge approaches of one timing that disagree on it. The global clearance constant is unchanged.

### Data needed before Rockridge runs

The published network was generated before `clearanceS` existed, so this engine refuses it: node 679's plans need 52 s and 47 s. The network must be regenerated from the updated area config (`npm run data`) before results are produced or published. For the tests and measurements here, the local `public/data/rockridge.network.json` was patched with `clearanceS: 4` on node 679's three timings and nothing else, which is what the import produces from the committed config apart from the longer source text. Its SHA-256 changed from `5fe8241a6ba1e3068db2a84bed6cf523f4bcd4057f0234d1cc0e2527aa7d2352` to `730c28deef079d62aa34cbf3df1c4b0089e53fbe786f1c2605effe528bd56033`.

### Effect on Rockridge runs

Native one-hour runs as in the other two changes, before = the engine after `repair-local-trip-measurement-integrity` on the unpatched network (node 679 at 52 and 47 s), after = this change on the patched network. Mean over seeds; "Colby retimed" asks for a 100 s cycle at node 1069, which the old engine ignored, so its before column is the baseline.

| Period | Scenario | Seeds | Through cars/h | Removed | Mean delay, s | Hillegass N/S, Colby N/S |
|---|---|---|---|---|---|---|
| PM | baseline | 1-3 | 1234 → 1205 (± 189) | 12.3 → 10.7 | 224.9 → 224.7 | 77/227, 140/175 → 75/228, 134/181 |
| PM | three filters | 1-3 | 689 → 680 (± 82) | 14.3 → 11.0 | 232.6 → 231.2 | 20/6, 86/78 → 14/5, 94/77 |
| PM | Colby retimed to 100 s | 1-3 | 1234 → 1195 (± 131) | 12.3 → 9.7 | 224.9 → 222.8 | 77/227, 140/175 → 74/213, 131/212 |
| AM | baseline | 1-2 | 567 → 582 | 4.0 → 2.5 | 171.5 → 170.5 | 72/84, 70/83 → 68/84, 74/88 |
| Midday | baseline | 1-2 | 422 → 423 | 0.5 → 0 | 109.4 → 110.6 | 48/75, 69/62 → 44/75, 70/60 |

The 2 s shorter ramp cycle moves the baselines by less than their seed spread. The retiming at Colby St now takes effect: against this engine's baseline, the busiest southbound block of Colby St gains 31 through cars an hour on average (+38, +57 and -2 by seed) and the busiest northbound block loses 3.

### Checks (tasks 3.1, 3.2)

`tests::signals` covers precedence, adaptation and removal; own and shared phase structures; the 50 s two-phase plan with and without the 4 s clearance; an observed cycle longer than its fixed phases; infeasible and out-of-range requests at construction and in `set_interventions`; and generic plans. `tools/signal-obs.test.ts` covers the clearance field. Native and WASM agree on the patched data. All three observed Rockridge signals now run their declared cycles in every period (node 679: 50, 45 and 50 s), and requests of 40, 100 and 150 s run as asked at all three.
