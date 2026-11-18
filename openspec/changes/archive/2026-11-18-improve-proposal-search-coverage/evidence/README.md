# Evidence and reproduction

The benchmark used source revision `f8197de0d6fc9d5bf02098c260cb73f4456d38fa`, simulator fingerprint `f0df1aabc323bca5893215e1df1afbff` and the original full `rockridge` network. These files preserve the findings independently of the chat. They do not contain a replacement optimizer or an implementation of this OpenSpec change.

[manifest.json](manifest.json) records the SHA256 of each original artifact and each committed representation. Seven small JSON artifacts and the reproducer sources are byte-identical copies. `confirmation-results.json` contains the complete original parsed JSON with whitespace compacted. `screen-results.projection.json` preserves all 240 numeric evaluation records, block increases, beam/stage histories, metadata and screening baseline except its link arrays. Its `projection` field enumerates every omission and addition. It is not the original screening file and must not be passed off under that file's hash.

The screening projection includes `repairBlockEndpoints`, extracted from the first link of each harm block in the frozen network. These endpoints support examination of the local repair decisions without storing the network. They are not a routable network and cannot replace simulation inputs. The archived `path-analysis.py` still requires the original network and a complete screening output; no adapter for running it directly against this projection is provided.

| Artifact | Use |
| --- | --- |
| `candidates.json` | Frozen geographic selection, exact candidate definitions and experimental protocol |
| `description.json` | Canonical decoded interventions and effective settings |
| `frozen-inputs.json` | Original input, runner-source and binary hashes |
| `screen-results.projection.json` | All 240 screening evaluations and visited histories, with explicit omissions |
| `analysis-summary.json` | Independent enumeration, scoring, frontier and coverage checks |
| `search-path-analysis.json` | Exact visited-sequence replay and posthoc edit-neighborhood counts |
| `confirmation-selection.json` | Frozen shortlist, tie rule and confirmation schedule |
| `confirmation-results.protocol.json` | Confirmation identity and interpretation contract |
| `confirmation-results.json` | Complete aggregate confirmation output, including per-seed block flows and metrics |
| `reproduction/` | Unmodified experiment runners and analysis scripts |

The original full network/demand, raw per-run checkpoint files, baseline cache, pre-exhaustive beam snapshot, binaries and HTML report are not committed. The original session independently verified 30 confirmation runs and 5,906 scalar comparisons against those checkpoints. The verification record is in `manifest.json`; reproducing that entire check requires the omitted raw checkpoints or new runs. None of this evidence was sent to the data upload endpoint.

## Verify the committed evidence

Run this from this directory. It checks every stored artifact against the handoff manifest without simulation or network access:

```sh
python - <<'PY'
import hashlib, json
from pathlib import Path
manifest = json.loads(Path('manifest.json').read_text())
for artifact in manifest['artifacts']:
    content = Path(artifact['file']).read_bytes()
    assert hashlib.sha256(content).hexdigest() == artifact['storedSha256'], artifact['file']
print('All committed evidence hashes match.')
PY
```

## Repeat the simulation experiment

Use an isolated scratch directory and a detached checkout of the recorded source revision. Do not switch an active working checkout underneath another agent's work. Both archived `Cargo.toml` files depend on `/workspace/traffic/crates/sim`, and both Rust runners execute `git -C /workspace/traffic rev-parse HEAD`. The screening runner checks that revision against the manifest; confirmation records it in the run identity. Either reproduce that layout in an isolated environment or adapt both Cargo paths and both runners' Git lookups in copied files to the same detached checkout. Record the path-only edits and their new source hashes. A Cargo-only path edit would check or report the wrong checkout. Independently verify the source and inputs before running the experiment.

Copy the contents of `reproduction/`, `candidates.json` and `frozen-inputs.json` to the scratch directory. Supply these exact original inputs under its `public/data/` directory:

| Input | SHA256 |
| --- | --- |
| `rockridge.network.json` | `6a8285d5076f9ddc9042b3a4554998e61b5427fdb8fbbbbaaa8572cd7b18f4b0` |
| `rockridge.demand.json` | `bef51b684a8c079ce5e133e089df0659b422ca2ec77bd6b8f5784e38bf1bd93c` |
| `areas.json` | `386731eb104a1ac7a35475d2e5952bcd2b98f6a29991a87b3f68334308477abd` |

The public data download may now contain a newer model or network extent. Check the hashes before accepting downloaded files; if they differ and the original inputs are unavailable, exact simulation reproduction is blocked. Do not substitute current files while retaining the original experiment identity. A new-input benchmark needs its own manifest and results.

Before building in the scratch directory, verify the input and candidate bytes:

```sh
python - <<'PY'
import hashlib, json
from pathlib import Path
frozen = json.loads(Path('frozen-inputs.json').read_text())
for name in ['candidates.json', 'public/data/rockridge.network.json',
             'public/data/rockridge.demand.json', 'public/data/areas.json']:
    actual = hashlib.sha256(Path(name).read_bytes()).hexdigest()
    assert actual == frozen['files'][name], f'Frozen input mismatch: {name}'
print('Frozen input hashes match.')
PY
```

With the recorded source checkout and Rust toolchain available:

```sh
CARGO_TARGET_DIR=target cargo build --release --locked --manifest-path harness/Cargo.toml
cargo build --release --locked --manifest-path confirmation/Cargo.toml
target/release/search-benchmark --mode screen --root . --manifest candidates.json --out screen-results.json --jobs 4
```

Capture the beam snapshot while the screening runner is in its exhaustive phase, before it finishes, using a second process in the scratch directory:

```sh
python analyze.py --capture-beam --input screen-results.json --snapshot beam-score-snapshot.json
```

The runner saves its complete beam history before it begins exhaustive filling. The original experiment captured and verified that history at the time; copying the final history afterward cannot recreate the original snapshot's timing evidence. Do not overwrite the committed originals or reuse old output caches for a different configuration.

After screening completes, run the analysis and freeze the confirmation selection before examining confirmation results:

```sh
python analyze.py --input screen-results.json --snapshot beam-score-snapshot.json --output analysis-summary.json --selection confirmation-selection.json
python path-analysis.py
confirmation/target/release/search-confirmation --root . --manifest candidates.json --sets confirmation-selection.json --out confirmation-results.json --jobs 4
```

These commands are documented for reproduction; landing this handoff did not rerun simulations. The archived scripts preserve their original fixed seeds and selection rule. Compare parsed metrics and memberships when reproducing: output file hashes can differ because they include elapsed times or recorded paths. Compiled binary hashes also depend on the build environment. Record any mismatch instead of replacing the original hashes with new values.

For testing a modified search, create a new protocol and use unused confirmation seeds. The recorded 201–210 results have already informed the proposed fixes and cannot provide untouched confirmation of them.
