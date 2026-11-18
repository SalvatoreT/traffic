## Redirect routes

Cause, found by tracing p1 seed 101 with the shipped simulator: all 31,634 scenario requests have connected raw paths, so the trace is sound. `localPart` dropped every link with both ends farther than 400 m from the closure centers, so 374 trips had a local list with a gap, for example Alcatraz Avenue, then College Avenue, with the link between them removed. The drawn line then jumped between the two kept links.

Decision: keep every link from the first to the last link near the closure instead of splitting the route into segments. The list stays one connected path, the street key names every street driven, and the route table and the file format do not change. The longest local list in the check was 20 links, so the added stretches are short. The map still cuts a line wherever links are not adjacent, as a guard for files written before the fix, and the generator fails on any route that is disconnected or whose street list misses a street.

Route keys change for trips that left the radius, so the stored method moves to `displacement-2` and the generator and the app treat older files as stale.

## Block names

Cause: `endText` returned "a dead end" for any end node with no other street name, whatever its links. At the Colby Park loop (nodes 841 and 842, two 61st Street arcs of 106 m and 64 m) and at many nodes where one street continues as another way or past an unnamed driveway, the street goes on.

Decision: when no other street meets an end and it is not a study-area edge, follow links of the same street from that node, never through the block's own two end nodes, to the first nodes where another named street meets, and name the end by those streets (sorted, joined as before). A walk that reaches a node with a single two-way link has found a dead end; one that reaches only a gate names the study-area edge; a walk that finds nothing else is "a loop". No names or ids are hard-coded, and the OSM data carries no junction tag for this loop. The Rust twin in `crates/sim/src/explore/naming.rs` has the same rule, and the shared link fixture now contains a looped street so both languages are checked against the same labels. The two arcs of one loop get the same name; the map tells them apart.

Block names that change in the Rockridge network (688 of 2,537 blocks, 16 of them still name a real dead end at their other end): `block-name-changes.tsv`.
