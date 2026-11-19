# Usage: python3 openspec/changes/calibration-round-47/apply-candidate.py caldecott-pair-sum [config-path]
# Reads candidates/<name>.json and inserts it as countFit.linkGroups in data/demand/rockridge.config.json (or the path given).
import json
import pathlib
import sys

here = pathlib.Path(__file__).parent
name = sys.argv[1]
entry = json.loads((here / 'candidates' / f'{name}.json').read_text())
p = pathlib.Path(sys.argv[2] if len(sys.argv) > 2 else 'data/demand/rockridge.config.json')
s = p.read_text()
head = '  "countFit": {\n    "enabled": true,\n'
assert s.count(head) == 1 and '"linkGroups"' not in s, 'config already has a linkGroups entry, or has no countFit block'
block = '    "linkGroups": ' + json.dumps(entry, ensure_ascii=False, indent=2).replace('\n', '\n    ') + ',\n'
out = s.replace(head, head + block)
json.loads(out)
p.write_text(out)
print('applied', name)
