const assert=require('node:assert/strict'),M=require('../assets/legacy/matrix-core'),seed=require('../storage/default-catalog.json');
const db=structuredClone(seed),k=db.kits.find(k=>k.id==='pvc-turn-mushroom');
assert.deepEqual(k.common,db.kits.find(k=>k.id==='pvc-turn-8').common);
for(const a of Object.values(db.articles))a.price=10;
let n=0;
for(const row of k.rows)for(const height of [row.from,row.to])for(const side of ['L','R'])for(const [profile,strike] of [['KBE 09','ZUP.K9/40'],['KBE 13','ZUP.K/40'],['REHAU','ZUP.R/40'],['VEKA 13 / VHS','ZUP.V/40'],['Gealan/Ivaper','ZUP.G/40'],['Deceuninck/Thyssen','ZUP.K/40']]){
 const p={width:700,height,side,count:2,dornmass:15,optionSeries:profile==='KBE 09'?'9':'13',strikeProfile:profile,options:{handleEnabled:false,plsEnabled:false}};
 const result=M.calculate(db,k,p);assert.deepEqual(result.errors,[]);const drive=row.drives[0];assert(result.items.some(x=>x.art===drive&&x.qty===2));assert(result.items.some(x=>x.art===strike&&x.qty===Number(drive.match(/-(\d)\.V$/)[1])*2));assert(!result.items.some(x=>/^ZK/.test(x.art)));n++;
}
const missing=structuredClone(seed);missing.articles["PP.250-2.V"].price=null;const r=M.calculate(missing,k,{width:700,height:300,side:'R',count:1,dornmass:15,optionSeries:'13',options:{handleEnabled:false,plsEnabled:false}});assert(r.errors.length);assert.equal(r.total,null);
console.log('Mushroom turn:',n,'drive/strike boundary combinations; preserved hinges; missing prices blocked.');
