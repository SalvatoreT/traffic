# Usage: python3 openspec/changes/calibration-round-45/apply-candidate.py forest-25
# Reads candidates/<name>.json and inserts its entries at the top of signalObservations in data/areas/rockridge.json.
import json
import pathlib
import sys

here = pathlib.Path(__file__).parent
name = sys.argv[1]
entries = json.loads((here / 'candidates' / f'{name}.json').read_text())
p = pathlib.Path('data/areas/rockridge.json')
s = p.read_text()
head = '  "signalObservations": [\n'
assert s.count(head) == 1 and 'candidate forest-' not in s, 'config already has a candidate, or has no signalObservations'
block = ''.join('    ' + json.dumps(e, ensure_ascii=False) + ',\n' for e in entries)
json.loads(s.replace(head, head + block))
p.write_text(s.replace(head, head + block))
print('applied', name)
