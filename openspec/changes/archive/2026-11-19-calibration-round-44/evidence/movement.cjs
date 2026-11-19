// Runbook step D movement snippet, as written, plus the training-view demand totals.
const f=(p)=>JSON.parse(require('fs').readFileSync(p));
for (const [a,b,l] of [['target/r44/delays.p0.json','data/demand/rockridge.control-delays.json','shipped'],['target/r44/delays.p0.training.json','data/demand/rockridge.control-delays.training.json','training']]) {
  const A=f(a),B=f(b);
  for (const p of Object.keys(A.delayS)) { let n=0,s=0; for (const k of Object.keys(A.delayS[p])) if (k in B.delayS[p]) { n++; s+=(A.delayS[p][k]-B.delayS[p][k])**2; }
    console.log(l,p,'common approaches',n,'of',Object.keys(A.delayS[p]).length,Object.keys(B.delayS[p]).length,'RMS change s',Math.sqrt(s/n).toFixed(2)); } }
const tot=(p)=>Object.fromEntries(f(p).periods.map(q=>[q.id,q.flows.filter(x=>!x.mode).reduce((a,x)=>a+x.vehPerHour,0).toFixed(0)]));
for (const [n,p] of [['base','target/r44/demand.base.json'],['p0','target/r44/demand.p0.json'],['p1','public/data/rockridge.demand.json']]) console.log(n,'car veh/h offered',JSON.stringify(tot(p)));
for (const [n,p] of [['base cv','target/r44/demand.base.cv.json'],['p0 cv','target/r44/demand.p0.cv.json'],['p1 cv','target/validation/rockridge.demand.json']]) console.log(n,'car veh/h offered',JSON.stringify(tot(p)));
