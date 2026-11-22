# Bit identity with the option off

Method of `openspec/changes/archive/2026-11-20-accelerate-simulator-step/` (design.md, "Reproducing the comparison"): the driver `bench/rockridge_hour.rs` calls `Simulation::new` on the published network (53c823f20d9165ed) and demand (2d16d8f8eb0950ca) with `{"seed":N,"period":"pm_peak","demandScale":1,"initialLoad":true}`, advances 3,600 s in 5 s steps and writes metrics, run link statistics, intent links, vehicles, cut-through exits, resident time, node waits, stops, delays, stop-line and link-start passages, link exits, trace requests and trace events as one JSON file. Native release build. The reference is the build of `origin/derived-targets-not-judged` (e644ed9); the other is this branch with `params::SINGLE_CONTROL_CHARGE` false (fingerprint `54d3481e9681cd76489a3ff7611a6ebc`). The output files are 721,828 bytes (seed 1).

| Seed | Build | Config | SHA-256 of the output |
| --- | --- | --- | --- |
| 1 | e644ed9 | default | `c1f58215af6ce19d1e57066e240ef173739943cd6d58bcc20deeda5eca295e07` |
| 1 | this branch | default | `c1f58215af6ce19d1e57066e240ef173739943cd6d58bcc20deeda5eca295e07` |
| 1 | this branch | `"singleControlCharge":false` | `c1f58215af6ce19d1e57066e240ef173739943cd6d58bcc20deeda5eca295e07` |
| 2 | e644ed9 | default | `7cde99a47415e1a7439c0f8ab0a015327ddce6753c65e5d8fe79a1c09d321ca4` |
| 2 | this branch | default | `7cde99a47415e1a7439c0f8ab0a015327ddce6753c65e5d8fe79a1c09d321ca4` |
| 1 | this branch | `"singleControlCharge":true` | `bcb038abb261fe6bfdbb50ce274f37baa19919bb3944784d11eb0d12810a8d08` |
| 2 | this branch | `"singleControlCharge":true` | `114b8bc8ad77dc6f7be09715eba2770f4cd3e34155307ca6c20b2b27626a0593` |

The prefixes `c1f58215af6c` and `7cde99a47415` are the ones that change records for the same seeds, so the reference build also matches the earlier published comparison. With the option on the output differs. The `singleControlCharge:false` row was measured one commit earlier than the others (before the drift change of design D1); the default rows were repeated on the final code.

Fingerprints: option off by default `54d3481e9681cd76489a3ff7611a6ebc`; with the default flipped (`scripts/adopt.zsh`) `a4015e1a1343bec96e3f58995b2d6017`; the build before this change `6b886c8f52ee07397773ddd0ebbcb447`. The `calibrate` report adds a key only when the option is on, so its reports with the option off are unchanged.

Replay (from the repository root, with the two published files in `$data_dir`):

```sh
cp openspec/changes/calibration-round-54/bench/rockridge_hour.rs crates/sim/src/bin/rockridge_hour.rs
cargo build --release -p traffic-sim --bin rockridge_hour
printf '{"seed":1,"period":"pm_peak","demandScale":1,"initialLoad":true}\n' > /tmp/config-1.json
target/release/rockridge_hour "$data_dir" /tmp/config-1.json 3600 /tmp/native-1.json
sha256sum /tmp/native-1.json
rm crates/sim/src/bin/rockridge_hour.rs
```

Remove the copied driver before computing a fingerprint: the fingerprint hashes every `.rs` file under `crates/sim`.
