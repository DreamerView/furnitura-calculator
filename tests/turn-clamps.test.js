const assert=require('node:assert/strict'),db=require('../storage/default-catalog.json'),M=require('../assets/legacy/matrix-core');require('../assets/js/cam-selector');const C=globalThis.FuturussCamSelector;
let checks=0;
for(const id of ['pvc-turn-11','pvc-turn-8','pvc-turn-mushroom','catalog-pvc-7-16','catalog-pvc-7-36','pvc-door-mushroom-bolt'])for(const type of ['exposed','regular'])for(const n of [1,2,3,4]){
 const k=db.kits.find(k=>k.id===id),p={width:700,height:1700,count:3,side:'R',dornmass:k.openingType==='door'?25:15,optionSeries:'13',strikeProfile:'KBE 13',rearClampType:type,rearClampQty:n,coverColor:'black',options:{}};
 const choice=M.candidates(k,p.width,p.height)[0],r=M.calculate(db,k,p,choice);assert.deepEqual(r.errors,[],id);const art=type==='regular'?'PS.S':'PN.S';assert.equal(r.items.find(i=>i.art===art).qty,n*3);assert.equal(r.items.filter(i=>i.art===art).length,1);
 if(type==='exposed')assert.equal(r.items.find(i=>i.art==='N1.PN.S.BLACK').qty,n*3);checks++;
}
const turn=db.kits.find(k=>k.id==='pvc-turn-11');
for(const [profile,hiddenProfile,suffix]of [['KBE 13','K','K'],['VEKA 13 / VHS','V','K'],['REHAU','R','R'],['Gealan/Ivaper','G','D']]){
 const p={width:700,height:1100,count:1,side:'L',dornmass:15,hingeType:'hidden',hiddenProfile,strikeProfile:profile,optionSeries:'13',rearClampType:'concealed',rearClampQty:2,options:{}};
 const r=M.calculate(db,turn,p,M.candidates(turn,700,1100)[0]);assert.deepEqual(r.errors,[]);assert.equal(r.items.find(i=>i.art==='PS1.R13'+suffix).qty,2);checks++;
}
let errors=[];assert.equal(M.applyRearClamps(db,turn,{rearClampType:'regular',rearClampQty:2,optionSeries:'9'},[{art:'PS.S',qty:9}],errors).find(i=>i.art==='PS.S').qty,2);assert.deepEqual(errors,[]);
errors=[];M.applyRearClamps(db,db.kits[0],{rearClampType:'regular',rearClampQty:2},[],errors);assert(errors.length);
for(const variant of C.types){const bolt=db.kits.find(k=>k.openingType==='door'&&k.variant===variant&&!k.id.endsWith('-latch')),latch=C.calculatorKit(db.kits,bolt,25,{doorBolt:false});assert(latch.id.endsWith('-latch'));assert(!C.calculatorVisible(latch,latch));assert.equal(C.calculatorLabel(bolt),'Дверная система');}
for(const id of ['catalog-pvc-7-53','catalog-pvc-7-54'])assert(!C.calculatorVisible(db.kits.find(k=>k.id===id)));
for(const mode of ['motor','mgn']){const k=C.calculatorKit(db.kits,db.kits[0],15,{specialMode:mode});assert(k.catalogDraft);assert(M.calculate(db,k,{specialMode:mode}).errors.length);}
assert.equal(M.pressureSummary([{art:'PS1.S',qty:2}]).points,2);
console.log('Turn clamps:',checks,'calculations; counts per sash, colours, profiles, hidden hinges, no duplicates, door options and draft guards passed.');

for(const series of ['9','13'])for(const [color,suffix] of Object.entries({white:'B',brown:'K',anthracite:'A',black:'BLACK'}))for(const type of ['exposed','fanlight']){
 const errors=[],r=M.applyRearClamps(db,turn,{rearClampType:type,rearClampQty:2,optionSeries:series,coverColor:color},[{art:'RV',qty:1},{art:'RN',qty:1}],errors);
 assert.deepEqual(errors,[]);assert(r.some(i=>i.art===(type==='fanlight'?'N.SV.':'N1.PN.S.')+suffix&&i.qty===2));
 if(type==='fanlight'){assert(r.some(i=>i.art==='FPR.'+series&&i.qty===2));assert.equal(r.filter(i=>i.art==='RV').reduce((n,i)=>n+i.qty,0),3);assert.equal(M.pressureSummary(r).points,2);const again=M.applyRearClamps(db,turn,{rearClampType:type,rearClampQty:3,optionSeries:series,coverColor:color},r,[]);assert.equal(again.filter(i=>i.art==='RV').reduce((n,i)=>n+i.qty,0),4);}
}
