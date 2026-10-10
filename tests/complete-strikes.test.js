const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const M=require('../assets/legacy/matrix-core'),db=require('../storage/default-catalog.json'),kit=db.kits.find(k=>k.id==='roller11');
const run=p=>M.calculate(db,kit,p,M.candidates(kit,p.width,p.height)[0]);
let cases=0;
for(const profile of Object.keys(M.strikeDefaults.profiles))for(const side of ['R','L'])for(const count of [1,3]){
 const p={width:900,height:1500,count,side,dornmass:15,strikeProfile:profile,optionSeries:profile==='KBE 09'?'9':'13'},r=run(p);
 assert.deepEqual(r.errors,[]);assert.equal(r.pressureCalculation.points,7*count);assert(r.pressureCalculation.complete);
 const strike=r.items.find(i=>i.strikeRole==='perimeter');assert.equal(strike.qty,7*count);assert.equal(r.items.filter(i=>i.strikeRole==='tiltBolt')[0].qty,count);
 assert.deepEqual(strike.dependencies.map(d=>[d.parent,d.ratio]),[['XPO.1600-2',2],['XU',1],['XUSP',1],['XPNB.600-2',2],['XNO.1000-1',1]]);
 assert.equal(r.total,r.items.reduce((n,i)=>n+i.price*i.qty,0));cases++;
}
// Every zero-cam stay must stay zero. The two-cam lower corner is one tilt + one perimeter point.
for(const a of ['NO.600','NO.700','NO.800','NO.600.TF','PO.740','US.200'])assert.equal(M.camSpec(a).points,0);
assert.equal(M.camSpec('XPO.2400-4.BLACK').points,4);assert.equal(M.camSpec('U2.2').points,2);
assert.equal(M.camSpec('PP.2000-4.V').role,'security');assert.equal(M.camSpec('XU.R').step,true);
assert.equal(M.camSpec('CUSTOM.2400-4'),null);assert.equal(M.pressureSummary([{art:'CUSTOM.2400-4',name:'Привод новый',qty:1}]).complete,false);
const p={width:900,height:1500,count:1,side:'R',dornmass:15,strikeProfile:'KBE 13',optionSeries:'13'};
let r=run(p),errors=[],warnings=[];
// Repeat reconciliation cannot double any quantities; excess remains explicit.
const original=r.items.map(i=>({...i}));let twice=M.completeStrikes(db,kit,p,structuredClone(original),M.strikePlan(db,kit,p),errors,warnings);
assert.deepEqual(twice.map(i=>[i.art,i.qty]),original.map(i=>[i.art,i.qty]));assert.deepEqual(errors,[]);
let manual=structuredClone(original);manual.find(i=>i.strikeRole==='perimeter').qty=12;twice=M.completeStrikes(db,kit,p,manual,M.strikePlan(db,kit,p),[],warnings);assert.equal(twice.find(i=>i.strikeRole==='perimeter').qty,12);
// Missing and unavailable strikes do not silently create purchasable items.
const missing=structuredClone(db);delete missing.articles['ZK.40'];assert(M.calculate(missing,missing.kits[0],p,M.candidates(kit,900,1500)[0]).errors.some(e=>e.includes('ZK.40')));
const left=run({...p,side:'L',count:2}),combined=M.mergeCalculatedItems([...r.items,...left.items]);assert.equal(combined.find(i=>i.art==='ZK.40').qty,21);assert.equal(combined.find(i=>i.art==='ZK.40').dependencies.length,5);assert.equal(M.pressureSummary(combined).points,21);
// Deleting a drive offers exactly its two strikes, rather than the rear chain's strikes.
const source=fs.readFileSync('assets/legacy/app-core.js','utf8'),context={confirm:()=>true,setMsg:()=>{}};vm.runInNewContext(source.slice(source.indexOf('function applyNodeDependencies'),source.indexOf('function removeRow')),context);
let pos={rows:r.items},next=structuredClone(r.items).filter(i=>i.art!=='XPO.1600-2');context.applyNodeDependencies(pos,next,'XPO.1600-2');assert.equal(next.find(i=>i.art==='ZK.40').qty,5);assert.equal(M.pressureSummary(next).points,5);
context.confirm=()=>false;next=structuredClone(r.items).filter(i=>i.art!=='XPO.1600-2');context.applyNodeDependencies(pos,next,'XPO.1600-2');assert.equal(next.find(i=>i.art==='ZK.40').qty,7);
// One extension article can occupy two zones and both survive merging and handed aggregation.
const zones=M.mergeCalculatedItems([{art:'XUF.400-1',qty:1,placements:[{zone:'rear',qty:1}]},{art:'XUF.400-1',qty:2,placements:[{zone:'bottom',qty:2}]}]);assert.equal(zones[0].qty,3);assert.equal(zones[0].placements.length,2);
assert.equal(M.extensionZone({art:'XU.400-1U'}),'front');assert.equal(M.extensionZone({art:'XU.600-1'}),'rear');assert.equal(M.extensionZone({art:'XUF.400-1'}),'unknown');
// Labels are escaped and limited to per-position invoices; group order uses actual article families.
const ctx={globalThis:{MatrixCore:M},esc:s=>String(s).replaceAll('<','&lt;'),DATA:{groups:{},master:{}}};vm.runInNewContext(source.slice(source.indexOf('function positionEngineeringNote'),source.indexOf('function renderOrder')),ctx);
assert(ctx.positionEngineeringNote(zones[0]).includes('со стороны петель'));assert(ctx.positionEngineeringNote(zones[0]).includes('снизу'));assert(!ctx.positionEngineeringNote({art:'RN'}));
assert(ctx.positionPressureNote({rows:next,family:'pvc'}).includes(': 5'));
assert(!source.slice(source.indexOf('const combinedTbody'),source.indexOf('const combinedTbody')+1800).includes('positionEngineeringNote'));
console.log(cases+' full-BOM/profile/side/count calculations; zero cams, special corners, idempotence, manual surplus, availability, dependencies, mixed placements and live pressure counts passed.');
