const assert=require('node:assert/strict');
const fs=require('node:fs'),M=require('../assets/legacy/matrix-core');
const seed=require('../storage/default-catalog.json');const db=structuredClone(seed);for(const a of Object.values(db.articles))a.price=10;
assert.deepEqual(M.validate(db),[]);assert.equal(db.catalogSchemes.length,54);assert.equal(new Set(db.catalogSchemes.map(x=>x.section)).size,54);
for(const source of db.catalogSchemes){assert(db.kits.some(k=>k.id===source.kitId));assert(source.articles.length>0);for(const art of source.articles)assert(db.articles[art]);}
for(const k of db.kits.filter(k=>k.catalogDraft)){const r=M.calculate(db,k,{width:700,height:1000,count:1});assert.equal(r.total,null);assert.equal(r.items.length,0);assert(r.errors.length);assert.equal(k.common.length,0);}
let checks=0;
for(const variant of ['11','8']){
 const k=db.kits.find(k=>k.id==='pvc-fanlight-'+variant);
 for(const w of [250,400,401,600,601,800,801,1000,1001,1200])for(const h of [350,750,1200])for(const side of ['L','R'])for(const series of ['9','13']){
  const p={width:w,height:h,side,count:2,optionSeries:series,strikeProfile:series==='9'?'KBE 09':'KBE 13',dornmass:15,coverColor:'white',options:{handleEnabled:false,microvent:false,lifter:false,bprEnabled:false,plsEnabled:false}};
  const result=M.calculate(db,k,p);assert.deepEqual(result.errors,[],JSON.stringify(p));
  const drive=result.items.find(x=>/^(XPP|PP)\./.test(x.art));assert(drive&&drive.qty===2);assert(w>=db.articles[drive.art].height.min&&w<=db.articles[drive.art].height.max);
  for(const art of ['RV','FO2','N.RV.B','N.SV.B','FPR.'+series])assert(result.items.some(x=>x.art===art&&x.qty===4));
  assert.equal(result.total,result.items.reduce((s,x)=>s+x.qty*x.price,0));assert(!result.items.some(x=>/^(SN|RN|X?NO\.|X?SNO\.)/.test(x.art)));checks++;
 }
 for(const dims of [[249,750],[1201,750],[600,349],[600,1201]])assert(M.calculate(db,k,{width:dims[0],height:dims[1],count:1}).errors.length);
 assert(M.calculate(db,k,{width:600,height:750,count:1,hingeType:'hidden'}).errors.length);
 assert(M.calculate(db,k,{width:600,height:750,count:1,options:{microvent:true}}).errors.length);
}
const adapter=fs.readFileSync('assets/legacy/matrix-adapter.js','utf8');assert(adapter.includes('(!kit.catalogDraft||kit.catalogPrepared)&&kitFamily(kit)'));
const html=fs.readFileSync('configurator.html','utf8');assert(html.includes('FuturussCatalogSchemes.create'));assert(html.indexOf('assets/js/catalog-schemes.js')<html.indexOf('FuturussCatalogSchemes.create'));
assert.equal((html.match(/const catalogSchemesUI=/g)||[]).length,1);
console.log('54 scheme references, 45 blocked drafts, '+checks+' fanlight calculations, dimensions, axes and integration passed.');
