const assert=require('node:assert/strict'),fs=require('fs'),vm=require('vm'),M=require('../assets/legacy/matrix-core'),db=structuredClone(require('../storage/default-catalog.json'));
for(const a of Object.values(db.articles))a.price=10;
const kit=db.kits.find(k=>k.id==='roller11');
const params={width:500,height:1200,count:3,side:'R',dornmass:15,strikeProfile:'KBE 13',options:{plsEnabled:true}};
function calc(k=kit,p=params){return M.calculate(db,k,p,M.candidates(k,p.width,p.height)[0]);}
let r=calc();assert.equal(r.plateCalculation.rule,'unverified');assert(r.warnings.some(w=>w.startsWith('PLS:')));
const verified=structuredClone(kit);verified.plateConnections=[{id:'upper-drive',from:'XU',to:'drive',cut:'single',verified:true},{id:'upper-scissors',from:'XU',to:'scissors',cut:'single',verified:true}];
r=calc(verified);assert.deepEqual(r.errors,[]);assert.equal(r.plateCalculation.rule,'verified-joints-v2');assert.equal(r.items.find(i=>i.art==='PLS').qty,6);assert.equal(M.plateTotal(r.items,0,r.plateCalculation.connections),6);
verified.plateConnections[1].cut='double';r=calc(verified);assert.equal(r.items.find(i=>i.art==='PLS').qty,3);
verified.plateConnections.push({...verified.plateConnections[0],id:'accidental-duplicate'});r=calc(verified);assert.equal(r.items.find(i=>i.art==='PLS').qty,3);
verified.plateConnections[0].from='NOT-IN-ASSEMBLY';assert.equal(calc(verified).plateCalculation.rule,'unverified');
for(const a of Object.keys(db.articles))assert.equal(M.plateUnits(db.articles[a],a),0);
const source=fs.readFileSync('assets/legacy/app-core.js','utf8'),ctx={MatrixCore:M,confirm:()=>true,setMsg:()=>{}};
vm.runInNewContext(source.slice(source.indexOf('function applyPlateDependencies'),source.indexOf('function removeRow')),ctx);
const joints=[{id:'a-b',from:'A',to:'B',cut:'single',verified:true,count:2}],pos={plateCalculation:{rule:'verified-joints-v2',connections:joints},plateManualAdjustment:0,rows:[{art:'A',qty:2},{art:'B',qty:2},{art:'PLS',qty:2,price:10}]};
let next=structuredClone(pos.rows);next[0].qty=1;ctx.applyPlateDependencies(pos,next,'A');assert.equal(next[2].qty,1);
ctx.confirm=()=>false;next=structuredClone(pos.rows);next[0].qty=1;ctx.applyPlateDependencies(pos,next,'A');assert.equal(next[2].qty,2);assert.equal(pos.plateManualAdjustment,1);
next=structuredClone(pos.rows);next[2].qty=5;ctx.applyPlateDependencies(pos,next,'PLS');assert.equal(pos.plateManualAdjustment,3);
const legacy=structuredClone(pos);legacy.plateCalculation.rule='one-per-sash-element-v1';next=structuredClone(legacy.rows);next[0].qty=0;ctx.applyPlateDependencies(legacy,next,'A');assert.equal(next[2].qty,2);
console.log('PLS verified joints: single/double cutting, duplicate joints, missing endpoints, quantity changes, manual overrides, legacy preservation passed.');

assert.equal(M.plateTotal([{art:"A",qty:1},{art:"B",qty:1}],0,[{id:"R:a",scope:0,from:"A",to:"B",cut:"single",verified:true,count:1},{id:"L:a",scope:1,from:"A",to:"B",cut:"single",verified:true,count:1}]),1);
