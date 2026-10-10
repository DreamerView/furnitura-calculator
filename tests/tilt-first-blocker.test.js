const assert=require('node:assert/strict'),M=require('../assets/legacy/matrix-core'),db=require('../storage/default-catalog.json');
for(const id of ['catalog-pvc-7-6','catalog-pvc-7-25'])for(const count of [1,3])for(const enabled of [undefined,true,false]){
 const k=db.kits.find(k=>k.id===id),p={width:550,height:1200,count,side:'R',strikeProfile:'KBE 13',tiltFirstBlocker:enabled};
 const r=M.calculate(db,k,p);assert.deepEqual(r.errors,[]);const blockers=r.items.filter(i=>['BTF','XBTF'].includes(i.art));
 assert.equal(blockers.length,enabled===false?0:1);if(blockers.length){assert.equal(blockers[0].qty,count);assert.equal(blockers[0].art,k.variant==='roller11'?'XBTF':'BTF');}
}
for(const variant of ['roller11','roller8','mushroom'])for(const width of [450,550,599,600,601])for(const rearChain of ['short','long'])for(const side of ['L','R']){
 const k=db.kits.find(k=>k.id===variant),p={width,height:1200,count:1,side,lowerNode:'bolt',rearChain,strikeProfile:'KBE 13',optionSeries:'13',options:{}};
 const r=M.calculate(db,k,p,M.candidates(k,width,1200)[0]);assert.deepEqual(r.errors,[]);assert(r.items.some(i=>i.art==='XUSP'));assert(r.items.some(i=>i.art==='XZSP.13.'+side));
 const bottom=M.chainPlan(db,k,p).bottom;assert.equal(bottom.length,width<600?0:1);
}
console.log('Tilt First default/disabled blocker and narrow sash 550 mm regression: passed.');
