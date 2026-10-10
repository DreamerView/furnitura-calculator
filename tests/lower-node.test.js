const assert=require('node:assert/strict'),fs=require('fs'),vm=require('vm'),M=require('../assets/legacy/matrix-core'),db=structuredClone(require('../storage/default-catalog.json'));
for(const a of Object.values(db.articles))a.price=10;
const kit=db.kits.find(k=>k.id==='roller11');
let checks=0;
for(const profile of Object.keys(M.strikeDefaults.profiles))for(const side of ['R','L'])for(const count of [1,3]){
 const p={width:500,height:1200,count,side,dornmass:15,strikeProfile:profile,optionSeries:profile==='KBE 09'?'9':'13',lowerNode:'security'};
 const c=M.candidates(kit,p.width,p.height)[0],r=M.calculate(db,kit,p,c);assert.deepEqual(r.errors,[]);assert(r.items.some(i=>i.art==='XU.2'&&i.qty===count));assert(!r.items.some(i=>i.art==='XUSP'||M.strikeRole(i.art)==='tiltBolt'));
 const strike=r.items.find(i=>M.strikeRole(i.art)==='tiltSecurity');assert.equal(strike.qty,count);assert.equal(strike.dependency.parent,'XU.2');
 const bolt=M.calculate(db,kit,{...p,lowerNode:'bolt'},c);assert.deepEqual(bolt.errors,[]);assert(bolt.items.some(i=>i.art==='XUSP'));assert(bolt.items.some(i=>i.art==='XZSP.'+(profile==='KBE 09'?'9':'13')+'.'+side));
 checks++;
}
const variants=M.strikeAlternatives(db,{groove:'KBE 13'},'ZK.40');assert.deepEqual(variants.map(v=>v.art),['ZK.35','ZK.40','ZK.45','ZK.50']);
assert.deepEqual(M.strikeAlternatives(db,{groove:'KBE 09'},'XZSP.9.L').map(v=>v.art),['XZSP.9.L']);
db.articles['ZK.35'].available=false;assert(!M.strikeAlternatives(db,{groove:'KBE 13'},'ZK.40').some(v=>v.art==='ZK.35'));
assert(!M.lowerNodeSupported(db.kits.find(k=>k.id==='roller8')));
const src=fs.readFileSync('assets/legacy/app-core.js','utf8'),ctx={confirm:()=>true,setMsg:()=>{}};vm.runInNewContext(src.slice(src.indexOf('function applyNodeDependencies'),src.indexOf('function removeRow')),ctx);
const pos={rows:[{art:'XUSP',qty:3},{art:'XZSP.13.R',qty:3,dependency:{parent:'XUSP',ratio:1}}]};let next=structuredClone(pos.rows);next[0].qty=2;ctx.applyNodeDependencies(pos,next,'XUSP');assert.equal(next[1].qty,2);
ctx.confirm=()=>false;next=structuredClone(pos.rows);next[0].qty=2;ctx.applyNodeDependencies(pos,next,'XUSP');assert.equal(next[1].qty,3);
console.log(checks+' lower-node profile/side/quantity cases; strike alternatives, unavailable articles and dependency confirmation passed.');
