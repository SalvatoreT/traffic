import { mkdirSync, mkdtempSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { writeFileAtomic } from './lib/atomic';
import { walk } from './lib/walk';

describe('R2 sync file listing', () => {
  it('skips symlinks and temporary files and lists the rest', () => {
    const d = mkdtempSync(join(tmpdir(), 'walk-')), out = mkdtempSync(join(tmpdir(), 'outside-'));
    try {
      mkdirSync(join(d, 'sub'));
      writeFileSync(join(d, 'a.json'), '{}'); writeFileSync(join(d, 'sub', 'b.json'), '{}'); writeFileSync(join(d, 'c.json.123.tmp'), '{');
      writeFileSync(join(out, 'secret.json'), '{}');
      symlinkSync(join(out, 'secret.json'), join(d, 'link.json')); symlinkSync(out, join(d, 'linkdir'));
      expect(walk(d).map((p) => p.slice(d.length + 1)).sort()).toEqual(['a.json', 'sub/b.json']);
    } finally { rmSync(d, { recursive: true, force: true }); rmSync(out, { recursive: true, force: true }); }
  });
  it('writes a file by rename and leaves no temporary file', () => {
    const d = mkdtempSync(join(tmpdir(), 'atomic-'));
    try { writeFileAtomic(join(d, 'x.json'), '{"a":1}'); expect(walk(d).map((p) => p.slice(d.length + 1))).toEqual(['x.json']); } finally { rmSync(d, { recursive: true, force: true }); }
  });
});
