const assert=require('node:assert/strict'),fs=require('node:fs'),M=require('../assets/legacy/matrix-core'),db=require('../storage/default-catalog.json'),k=db.kits.find(k=>k.sizeRecipeMode);
// Independent expectations from the catalogue insert/strike selection tables.
const profiles={
 'KBE 09':{insert:'VTF.9',strike:'ZUP.K9/40',perimeter:'ZK9.40',hinge:'SV.09',series:'9'},
 'KBE 13':{insert:'VTF.13',strike:'ZUP.K/40',perimeter:'ZK.40',hinge:'SV.13',series:'13'},
 REHAU:{insert:'VTF.R',strike:'ZUP.R/40',perimeter:'ZK.40',hinge:'SV.13',series:'13'},
 'VEKA 13 / VHS':{insert:'VTF.V',strike:'ZUP.V/40',perimeter:'ZK.40',hinge:'SV.13',series:'13'},
 'Gealan/Ivaper':{insert:'VTF.G',strike:'ZUP.G/40',perimeter:'ZQ.45',hinge:'SV.13',series:'13'},
 'Deceuninck/Thyssen':{insert:'VTF.D',strike:'ZUP.K/40',perimeter:'ZD.45',hinge:'SV.13',series:'13'}
};
let count=0;
for(const c of Object.values(k.cells))for(const r of c.sizeRecipes)for(const width of [r.width.from,r.width.to])for(const height of [r.height.from,r.height.to])for(const side of ['L','R']){
 const p={width,height,side,count:1,hingeType:'standard'},original=M.calculate(db,k,{...p,strikeProfile:'REHAU'});assert.deepEqual(original.errors,[]);
 for(const [profile,e] of Object.entries(profiles)){
  const next=M.calculate(db,k,{...p,strikeProfile:profile,optionSeries:e.series});
  assert.deepEqual(next.errors,[],JSON.stringify({profile,width,height,side}));assert.equal(next.total,original.total);
  const replace={'VTF.R':e.insert,'ZUP.R/40':e.strike,'ZK.40':e.perimeter,'SV.13':e.hinge};
  assert.deepEqual(next.items.map(i=>[i.art,i.qty]),original.items.map(i=>[replace[i.art]||i.art,i.qty]));
  assert(!next.items.some(i=>i.art.startsWith('ZTF.')));count++;
 }
}
for(const [profile,e] of Object.entries(profiles)){
 const p={width:550,height:1200,side:'R',count:1,strikeProfile:profile};
 const next=M.calculate(db,k,p);assert.deepEqual(next.errors,[]);assert.equal(next.total,200);assert(next.items.some(i=>i.art===e.insert));assert(next.items.some(i=>i.art===e.hinge));assert.equal(p.optionSeries,undefined,'Do not mutate caller parameters');
 assert(M.calculate(db,k,{...p,optionSeries:e.series==='9'?'13':'9'}).errors.length,'Reject mismatched groove');
 for(const unavailable of [false,true]){const broken=structuredClone(db);if(unavailable)broken.articles[e.insert].available=false;else delete broken.articles[e.insert];assert(M.calculate(broken,broken.kits.find(k=>k.sizeRecipeMode),p).errors.length);}
 assert.deepEqual(M.strikeAlternatives(db,{strikeProfile:profile},e.insert).map(a=>a.art),[e.insert],'Insert editor must not suggest a ZTF strike');
 const options=M.calculate(db,k,{...p,options:{microvent:true,lifter:true,plsEnabled:true}});assert.deepEqual(options.errors,[]);assert(options.items.some(i=>i.art==='XZMV.'+e.series));assert(options.items.some(i=>i.art==='ZM'+e.series+'.Z'));assert(!options.items.some(i=>i.art==='PLS'));assert.equal(options.plateCalculation.rule,'unverified');
 if(profile==='Gealan/Ivaper'||profile==='Deceuninck/Thyssen')assert(next.warnings.some(w=>w.includes(e.perimeter)),'Warn about missing suffix 40');
 if(profile==='Deceuninck/Thyssen')assert(next.warnings.some(w=>w.includes('APD')),'Do not invent adapter quantities');
 const manual=M.calculate(db,k,{...p,strikeOverrides:{perimeter:'ZK.35'}});assert.deepEqual(manual.errors,[]);assert(manual.items.some(i=>i.art==='ZK.35'));assert(manual.warnings.some(w=>w.includes('Ручная замена')));
}
const adapter=fs.readFileSync('assets/legacy/matrix-adapter.js','utf8');assert(adapter.includes('!alu&&!kit.sizeRecipeMode&&kit.profile'));assert(adapter.includes('groove:kit.sizeRecipeMode?params.strikeProfile'));
assert(fs.readFileSync('configurator.html','utf8').includes(fs.readFileSync('assets/legacy/matrix-core.js','utf8')));
console.log('Tilt First: '+count+' profile/boundary/handing calculations passed; six profiles, groove inference, optional parts, manual overrides, missing articles and insert editor checked.');
