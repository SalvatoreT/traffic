// File listing for the R2 sync: no symlinks followed or listed, no temporary files.
import { existsSync, lstatSync, readdirSync } from "node:fs";
import { join } from "node:path";

export function walk(dir: string): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    const st = lstatSync(p);
    // A link could point outside the tree, and a *.tmp file is still being written.
    if (st.isSymbolicLink() || name.endsWith(".tmp")) return [];
    return st.isDirectory() ? walk(p) : [p];
  });
}
