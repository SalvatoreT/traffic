# Round 51 membership files

These are the two membership files the round 51 candidate config reads. With them, the cloud session can rebuild demand `5d6be8a70618e905` and cross-validation demand `7164fa2ab08f612a`. Each file is compressed with `gzip -9 -n` and split with `split -b 190000`, so every part stays under the repository's 200 KB limit. Lasting storage is the R2 bucket. These parts live on the dev branch only.

| File | Raw bytes | gzip bytes | Parts | sha256 |
| --- | --- | --- | --- | --- |
| `rockridge.membership.json` | 2,467,569 | 596,221 | 4 | `74a88c864d406903a43c4f04edda6b9fad5babcde44aa3958ac78bff1863ed36` |
| `rockridge.membership-training.json` | 2,148,075 | 534,158 | 3 | `7d0fdb063236304d9f20a4ba9dc36409e7a57410042e2fcfbad8fe7a399425ce` |

To reassemble each file and put it at the path the candidate config expects, run this from the repository root:

```bash
D=openspec/changes/calibration-round-51/evidence/membership; mkdir -p target/membership
for n in rockridge.membership rockridge.membership-training; do cat $D/$n.json.gz.part-* | gunzip > target/membership/$n.json; done
shasum -a 256 target/membership/rockridge.membership*.json
```

`SHA256SUMS` lists every part, both `.gz` files and both raw files. Check the raw files against it once they are reassembled.
