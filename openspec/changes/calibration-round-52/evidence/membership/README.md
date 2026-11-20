# Round 52 membership files

These are the two membership files that the round 52 candidate config (`2405ff02c92b2837`) reads. With them, the candidate's demand (`2d16d8f8eb0950ca`) and cross-validation demand (`1c3b1666f24156f1`) can be rebuilt without rerunning the loop. Each file was compressed with `gzip -9 -n` and split with `split -b 190000`, which keeps every part under the repository's 200 KB limit. The parts live only on the dev branch. If the candidate is adopted, the lasting copy belongs in the R2 bucket.

| File | Raw bytes | gzip bytes | Parts | sha256 |
| --- | --- | --- | --- | --- |
| `rockridge.membership.json` | 2,521,319 | 609,141 | 4 | `3d639670c1feb38f2e80aa1b8d027ecb4c09786864a6e8826e626e64eaba9659` |
| `rockridge.membership-training.json` | 2,114,506 | 524,721 | 3 | `c1cd4ce96fb28791b80ea29a4150b7467f051e5d8a4009ed72a162c9dd8ebf8b` |

To reassemble both files at the path the candidate config expects, run this from the repository root:

```bash
D=openspec/changes/calibration-round-52/evidence/membership; mkdir -p target/membership
for n in rockridge.membership rockridge.membership-training; do cat $D/$n.json.gz.part-* | gunzip > target/membership/$n.json; done
shasum -a 256 target/membership/rockridge.membership*.json
```

`SHA256SUMS` lists every part, both `.gz` files and both raw files. Once the files are reassembled, check the raw ones against it.
