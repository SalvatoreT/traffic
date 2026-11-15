// Write-then-rename for the files the data pipeline produces, so a reader (the R2 sync, a second process) never sees a partial file. Temporary files end in `.tmp`, which the sync skips.
import { renameSync, writeFileSync } from 'node:fs';

export function writeFileAtomic(path: string, data: string | Uint8Array): void {
  const tmp = `${path}.${process.pid}.tmp`;
  writeFileSync(tmp, data);
  renameSync(tmp, path);
}
