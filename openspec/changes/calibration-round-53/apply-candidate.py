# Usage: python3 openspec/changes/calibration-round-53/apply-candidate.py [end-along] [config-path]
# Reads candidates/<name>.json and edits the committed demand config (the published round 52 model, which already has countFit.gatePriorTotals and
# countFit.throughTargets.simulatedMembership with throughTargets, shares and routeWeightPerBlock): adds countFit.endAlong, the sub-switch simulatedMembership.endAlong and a sentence in the entry's _note.
# Absent, the build is byte-identical to the baseline. The config file's hash is part of the membership evidence, so apply it once, before the loop, and do not edit the config afterwards.
# Prints the new config hash (first 16 hex digits of the SHA-256); the committed config starts at 2405ff02c92b2837.
import hashlib
import json
import pathlib
import sys

here = pathlib.Path(__file__).parent
name = sys.argv[1] if len(sys.argv) > 1 else 'end-along'
cand = json.loads((here / 'candidates' / f'{name}.json').read_text())
p = pathlib.Path(sys.argv[2] if len(sys.argv) > 2 else 'data/demand/rockridge.config.json')
s = p.read_text()
assert '"endAlong"' not in s, 'config already has an endAlong entry'
assert '"simulatedMembership"' in s and s.count('"routeWeightPerBlock": true\n      },') == 1, 'config is not the round 52 model (simulatedMembership with routeWeightPerBlock)'


def block(key, entry, pad):
    return pad + f'"{key}": ' + json.dumps(entry, ensure_ascii=False, indent=2).replace('\n', '\n' + pad) + ',\n'


anchor = '    "throughTargets": {\n'
assert s.count(anchor) == 1, 'config has no throughTargets block'
out = s.replace(anchor, block('endAlong', cand['endAlong'], '    ') + anchor)
sw = '        "routeWeightPerBlock": true\n      },'
out = out.replace(sw, '        "routeWeightPerBlock": true,\n        "endAlong": true\n      },')
tail = 'one station per block it spans (ASSUMPTION, no reference).",'
assert out.count(tail) == 1, 'the simulatedMembership note has changed'
suffix = cand['simulatedMembership']['noteSuffix']
assert '"' not in suffix and '\\' not in suffix
out = out.replace(tail, tail[:-2] + suffix + '",')
parsed = json.loads(out)
assert parsed['countFit']['throughTargets']['simulatedMembership']['endAlong'] is True
assert parsed['countFit']['endAlong']['weight'] == cand['endAlong']['weight']
p.write_text(out)
print('applied', name, 'config hash', hashlib.sha256(out.encode()).hexdigest()[:16])
