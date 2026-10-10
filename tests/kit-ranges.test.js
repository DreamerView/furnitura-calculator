const assert=require('node:assert/strict'),M=require('../assets/legacy/matrix-core'),seed=require('../storage/default-catalog.json');
const d=structuredClone(seed);for(const a of Object.values(d.articles))a.price=10;let count=0;
for(const k of d.kits.filter(k=>!k.catalogDraft))for(const row of k.rows)for(const col of k.columns)for(const [width,height] of [[col.from,row.from],[col.to,row.to]])for(const side of ['L','R'])for(const profile of k.family==='aluminum'?['ALU']:Object.keys(M.strikeDefaults.profiles)){
 const p={width,height,count:1,side,dornmass:k.dornmass||15,optionSeries:profile==='KBE 09'?'9':'13',...(profile==='ALU'?{}:{strikeProfile:profile}),hingeType:'standard'};
 for(const choice of M.candidates(k,width,height).filter(c=>c.rowId===row.id&&c.colId===col.id)){count++;assert.deepEqual(M.calculate(d,k,p,choice).errors,[],JSON.stringify({kit:k.id,...p,choice}));}
}
const k=d.kits.find(k=>k.id==='mushroom');
for(const profile of Object.keys(M.strikeDefaults.profiles))for(const side of ['L','R'])for(const choice of M.candidates(k,450,1100)){
 const p={width:450,height:1100,count:1,side,dornmass:15,optionSeries:profile==='KBE 09'?'9':'13',strikeProfile:profile};const result=M.calculate(d,k,p,choice);assert.deepEqual(result.errors,[]);assert(result.items.some(i=>i.art==='NO.600'));
}
for(const width of [399,1401])assert.equal(M.candidates(k,width,1100).length,0);
assert(M.calculate(d,k,{width:399,height:1100,count:1}).errors.some(e=>e.includes('399'))===false); // Limits, not fabricated matching dimensions.
assert(M.calculate(d,k,{width:399,height:1100,count:1}).errors.some(e=>e.includes('400–599')));
console.log('All '+d.kits.length+' kits: '+count+' profile/side/range-boundary calculations passed; 450x1100 regression and unsupported widths passed.');
