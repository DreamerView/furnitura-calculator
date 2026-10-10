const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const M=require('../assets/legacy/matrix-core'),db=require('../storage/default-catalog.json');
let count=0;
const run=(k,p)=>M.calculate(db,k,p,M.candidates(k,p.width,p.height)[0]);
for(const variant of ['roller11','roller8','mushroom'])for(const mode of ['short','long'])for(const row of M.chainRules[mode])for(const height of [row[0],row[1]])for(const side of ['R','L'])for(const profile of Object.keys(M.strikeDefaults.profiles)){
 const k=db.kits.find(k=>k.id===variant),p={width:900,height,count:2,side,dornmass:15,rearChain:mode,rearCam:'same',lowerNode:'security',strikeProfile:profile,optionSeries:profile==='KBE 09'?'9':'13'};
 const plan=M.chainPlan(db,k,p);assert.deepEqual(plan.errors.filter(e=>!e.startsWith('Подтвердите')),[],variant+mode+height);
 if(plan.reviewReasons.length){assert(run(k,p).errors.length);p.chainReviewed=plan.reviewKey;}
 const r=run(k,p);assert.deepEqual(r.errors,[],variant+mode+height);assert.equal(r.total,r.items.reduce((n,i)=>n+i.qty*i.price,0));
 const strikeRole=variant==='mushroom'?'security':'perimeter',expected=plan.items.filter(i=>i.role==='chain'&&i.camCount).reduce((n,i)=>n+i.camCount,0)*2;
 assert.equal(r.items.filter(i=>i.strikeRole===strikeRole).reduce((n,i)=>n+i.qty,0),expected);
 assert.equal(r.items.filter(i=>i.strikeRole==='tiltSecurity').reduce((n,i)=>n+i.qty,0),2);
 assert(!r.items.some(i=>i.art==='XUSP'));assert.deepEqual(plan.rear.at(-1),plan.items.filter(i=>i.chainZone==='rear'&&i.role==='chain').at(-1).art);count++;
}
const k=db.kits.find(k=>k.id==='roller11'),p={width:900,height:1500,count:1,side:'R',dornmass:15,strikeProfile:'KBE 13',optionSeries:'13',rearChain:'long',rearCam:'same',lowerNode:'bolt'};
let r=run(k,p);assert.deepEqual(r.errors,[]);assert(r.items.some(i=>i.art==='XUSP'));assert(r.items.some(i=>i.art==='XZSP.13.R'));assert(!r.items.some(i=>i.art==='XU.2'));
for(const height of [2001,2050,2100])assert(M.chainPlan(db,k,{...p,rearChain:'short',height}).errors.some(e=>e.includes('диапазона')));
for(const height of [599,2401])assert(M.chainPlan(db,k,{...p,height}).errors.length);
const mixed={...p,rearCam:'mushroom',lowerNode:'security'};let plan=M.chainPlan(db,k,mixed);assert(plan.reviewReasons.length);assert(run(k,mixed).errors.length);mixed.chainReviewed=plan.reviewKey;r=run(k,mixed);assert.deepEqual(r.errors,[]);assert(r.items.some(i=>i.art==='ZUP.K/40'));assert(r.items.some(i=>i.art==='ZK.40'));
assert(run(k,{...mixed,height:1501}).errors.length,'review cannot leak to another dimension');assert(run(k,{...mixed,chainReviewed:''}).errors.length,'unchecked confirmation stays unchecked');
assert(M.chainPlan(db,k,{...p,hingeType:'hidden'}).errors.length);
const copy=structuredClone(db),custom=copy.kits.find(x=>x.id===k.id);custom.common.push({art:'XUF.400-1',qty:1});assert(M.calculate(copy,custom,p,M.candidates(custom,p.width,p.height)[0]).errors.some(e=>e.includes('привязки')));
copy.articles['XPNB.400-1'].available=false;assert(M.chainPlan(copy,custom,p).errors.some(e=>e.includes('недоступна')));
const source=fs.readFileSync('assets/legacy/app-core.js','utf8'),ctx={confirm:()=>true,setMsg:()=>{}};vm.runInNewContext(source.slice(source.indexOf('function applyNodeDependencies'),source.indexOf('function removeRow')),ctx);
r=run(k,{...p,lowerNode:'security'});const pos={rows:r.items};let next=structuredClone(pos.rows).filter(i=>i.art!=='XU.2');ctx.applyNodeDependencies(pos,next,'XU.2');assert.equal(next.find(i=>i.art==='ZK.40').qty,r.items.find(i=>i.art==='ZK.40').qty-1);assert(!next.some(i=>i.art==='ZUO.K/40'));
const old=JSON.stringify(pos);ctx.confirm=()=>false;next=structuredClone(pos.rows).filter(i=>i.art!=='XPNB.400-1');ctx.applyNodeDependencies(pos,next,'XPNB.400-1');assert.equal(next.find(i=>i.art==='ZK.40').qty,r.items.find(i=>i.art==='ZK.40').qty);assert.equal(JSON.stringify(pos),old);
// Reproduce disabled-but-restored options that prevented the door invoice from loading.
const adapter=fs.readFileSync('assets/legacy/matrix-adapter.js','utf8'),assignment=adapter.match(/params.options=Object.fromEntries\([^\r\n]+/)[0];
const controls={microvent:{checked:true,disabled:true},lifter:{checked:true,disabled:true},bprEnabled:{checked:true,disabled:true},handleEnabled:{checked:true,disabled:true}};
const c={params:{},alu:false,el:id=>controls[id]||{checked:false,disabled:false}};vm.runInNewContext(assignment,c);assert(!Object.values(c.params.options).some(Boolean));
for(const door of db.kits.filter(k=>k.doorNoCut)){const result=M.calculate(db,door,{width:750,height:1800,count:1,dornmass:25,options:c.params.options});assert.deepEqual(result.errors,[]);}
// New shared UI strings are included explicitly; general coverage does not scan all assets/js.
vm.runInThisContext(fs.readFileSync('assets/js/i18n.js','utf8'));const ui=fs.readFileSync('assets/js/calculation-technology.js','utf8');
for(const lang of ['en','tr'])for(const s of ui.split(/<[^>]*>/).filter(s=>/^[А-Яа-яЁё⅔][^<>]*$/.test(s)))assert(!/[А-Яа-яЁё]/.test(globalThis.FuturussI18n.translate(s,lang)),s);
console.log(count+' chain boundary/profile/handing calculations; review invalidation, mixed cams, unavailable parts, dependencies and six door regressions passed.');
