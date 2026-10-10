const assert=require('node:assert/strict');
const db=require('../storage/default-catalog.json'),M=require('../assets/legacy/matrix-core');require('../assets/js/cam-selector');const C=globalThis.FuturussCamSelector;
for(const k of db.kits){if(/скрытые петли|нижний шпингалет|нижняя угловая|смещённая ручка|дорнмасс 7,5|дорнмасс 25|привод ножниц 200/i.test(k.name))assert(!C.calculatorVisible(k,k),k.name);}
for(const id of ['roller11','roller8','mushroom']){
 const k=db.kits.find(k=>k.id===id);assert(C.calculatorVisible(k,k));
 for(const height of [600,1000,1500,2100]){
  const p={width:700,height,count:1,dornmass:7.5,side:'R',options:{}};
  const candidates=M.candidates(k,700,height).filter(c=>M.dornAlternative(db,c.drive,7.5));assert(candidates.length,id+' '+height);
  for(const c of candidates){const r=M.calculate(db,k,p,c);assert.deepEqual(r.errors,[]);assert(r.items.some(i=>M.articleDornmass(i.art,db.articles[i.art])===7.5));}
 }
}
for(const level of ['standard','basic','high']){
 const base=db.kits.find(k=>k.assemblyGroup==='tilt'&&k.assemblyLevel===level),d25=C.calculatorKit(db.kits,base,25);
 assert.equal(d25.assemblyGroup,'tilt-d25');assert.equal(d25.assemblyLevel,level);assert.equal(C.calculatorKit(db.kits,base,15),base);assert(!C.calculatorVisible(d25,d25));
}
assert.equal(M.dornAlternative(db,'XPO.1600-2',7),'');
const old={name:'Привод дорнмасс 7,5',dornmass:7};assert.equal(M.articleDornmass('PO.D7',old),7.5);
console.log('Calculator: option duplicates hidden, ALU D25 routed by level, 7.5 mm calculations for all three cam families passed.');
