const assert=require('node:assert/strict'),fs=require('node:fs');
const M=require('../assets/legacy/matrix-core'),d=require('../storage/default-catalog.json');require('../assets/js/cam-selector');const C=globalThis.FuturussCamSelector;
assert.deepEqual(M.validate(d),[]);let calculations=0;
const profiles={'KBE 09':{series:'9',strike:'ZUP.K9/40'},'KBE 13':{series:'13',strike:'ZUP.K/40'},REHAU:{series:'13',strike:'ZUP.R/40'},'VEKA 13 / VHS':{series:'13',strike:'ZUP.V/40'},'Gealan/Ivaper':{series:'13',strike:'ZUP.G/40'},'Deceuninck/Thyssen':{series:'13',strike:'ZUP.K/40'}};
const f=d.kits.find(k=>k.id==='pvc-fanlight-mushroom');assert.equal(f.driveAxis,'width');
for(const col of f.columns)for(const width of [col.from,col.to])for(const height of [350,1200])for(const side of ['R','L'])for(const [profile,e] of Object.entries(profiles)){
 const r=M.calculate(d,f,{width,height,side,count:2,dornmass:15,optionSeries:e.series,strikeProfile:profile,options:{handleEnabled:false}});assert.deepEqual(r.errors,[]);
 const drive=r.items.find(i=>/^PP\./.test(i.art));assert(drive.art.endsWith('.V'));const a=d.articles[drive.art];assert(width>=a.height.min&&width<=a.height.max);assert.equal(r.items.find(i=>i.art===e.strike).qty,Number(drive.art.match(/-(\d)\.V$/)[1])*2);
 assert.equal(r.items.find(i=>i.art==='FO2').qty,4);assert.equal(r.items.find(i=>i.art==='FPR.'+e.series).qty,4);calculations++;
}
for(const p of [{width:249,height:700},{width:1201,height:700},{width:700,height:349},{width:700,height:1201}])assert(M.calculate(d,f,{...p,count:1}).errors.length);
const doors=d.kits.filter(k=>k.doorNoCut);assert.equal(doors.length,6);
for(const k of doors)for(const row of k.rows)for(const height of [row.from,row.to])for(const dornmass of [25,35])for(const side of ['L','R'])for(const [strikeProfile,e] of Object.entries(profiles)){
 const r=M.calculate(d,k,{width:750,height,count:2,side,dornmass,strikeProfile,optionSeries:e.series});assert.deepEqual(r.errors,[],k.id+JSON.stringify({height,dornmass,side}));
 const drive=r.items.find(i=>/^(X?PDR?)\./.test(i.art));assert(drive.art.includes('.D'+dornmass));assert.equal(drive.qty,2);assert.equal(r.items.find(i=>i.art===(k.doorLockMode==='bolt'?'ODRZ':'ODZ')).qty,2);assert(!r.items.some(i=>/^X?NO\.|^RP$/.test(i.art)));
 const strikes=r.items.filter(i=>M.strikeRole(i.art)===(k.variant==='mushroom'?'security':'perimeter'));assert.equal(strikes.reduce((n,i)=>n+i.qty,0),8);assert.equal(r.total,r.items.reduce((n,i)=>n+i.qty*i.price,0));calculations++;
}
for(const k of doors){for(const height of [1599,2201])assert(M.calculate(d,k,{width:750,height,count:1,dornmass:25}).errors.length);assert(M.calculate(d,k,{width:750,height:1800,count:1,dornmass:15}).errors.length);assert(M.calculate(d,k,{width:750,height:1800,count:1,dornmass:25,options:{handleEnabled:true}}).errors.length);for(const type of C.types){assert(C.target(d.kits,{...k,dornmass:35},type));const target=C.target(d.kits,k,type);assert(target&&target.doorLockMode===k.doorLockMode);}}
for(const k of d.kits.filter(k=>k.catalogDraft)){assert(k.catalogPrepared);assert(k.catalogGroups.length);assert(k.catalogGroups.every(g=>g.articles.every(a=>d.articles[a])));const r=M.calculate(d,k,{width:700,height:1100,count:1});assert.equal(r.total,null);assert.deepEqual(r.items,[]);}
for(const id of ['pvc-fanlight-11','pvc-fanlight-8'])assert.equal(C.target(d.kits,d.kits.find(k=>k.id===id),'mushroom').id,f.id);
assert(fs.readFileSync('configurator.html','utf8').includes(fs.readFileSync('assets/legacy/matrix-core.js','utf8')));
console.log('Catalogue expansion: '+calculations+' fanlight/door boundary/profile/handing calculations; locks, cam quantities, backsets, selector compatibility and incomplete BOM guards passed.');
