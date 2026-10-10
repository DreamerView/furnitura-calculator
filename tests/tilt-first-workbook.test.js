const assert=require('node:assert/strict'),fs=require('node:fs');
const M=require('../assets/legacy/matrix-core'),db=require('../storage/default-catalog.json'),source=require('./fixtures/tilt-first-workbook.json'),k=db.kits.find(k=>k.id==='catalog-pvc-7-6');
assert.deepEqual(M.validate(db),[]);assert.equal(k.rows.length,9);assert.equal(k.columns.length,5);assert.equal(k.catalogDraft,false);
assert.equal(db.priceCurrency,'RUB');assert(Object.values(db.articles).every(a=>a.price===10));
for(const row of k.rows){const art=row.drives[0];assert.equal(row.to,db.articles[art].height.max);assert.equal(row.from,art==='POK.790'?490:db.articles[art].height.min);}
let cases=0;for(const cell of Object.values(k.cells))for(const rule of cell.sizeRecipes){
 const original=source.find(r=>r.sourceCell===rule.sourceCell);assert(original);assert.deepEqual(rule.items,original.items,'Exact quantities/articles from Excel '+rule.sourceCell);
 for(const width of [rule.width.from,rule.width.to])for(const height of [rule.height.from,rule.height.to])for(const side of ['L','R']){
  const p={width,height,side,count:2,options:{handleEnabled:false,microvent:false,lifter:false,bprEnabled:false,plsEnabled:false}},result=M.calculate(db,k,p);assert.deepEqual(result.errors,[],JSON.stringify(p));assert(!result.needsChoice);assert.equal(result.items.find(i=>i.art===rule.items.find(i=>i.role==='drive').art).qty,2);assert.equal(result.items.find(i=>i.art===rule.items.find(i=>i.role==='scissors').art).qty,2);assert.equal(result.total,result.items.reduce((s,i)=>s+i.qty*10,0));assert(result.items.some(i=>i.art==='VTF.R'));assert(!result.items.some(i=>i.art==='PLS'||i.art==='BTF')&&result.items.some(i=>i.art==='XBTF'&&i.qty===2));cases++;
 }
}
assert.equal(Object.values(k.cells).reduce((n,c)=>n+c.sizeRecipes.length,0),96);
// Actual drive bands must not silently extrapolate an unconfirmed BOM.
for(const [width,height] of [[399,1100],[1401,1100],[500,489],[500,2401]]){const r=M.calculate(db,k,{width,height,count:1});assert(r.errors.length);assert.equal(r.items.length,0);}
for(const p of [{strikeProfile:'Unknown'},{optionSeries:'9'},{hingeType:'hidden'}])assert(M.calculate(db,k,{width:500,height:1100,count:1,...p}).errors.length);
assert.equal(M.lowerNodeSupported(k),false);
const damaged=structuredClone(db),dk=damaged.kits.find(k=>k.sizeRecipeMode),dc=Object.values(dk.cells).find(c=>c.sizeRecipes.length);dc.sizeRecipes.push(structuredClone(dc.sizeRecipes[0]));assert(M.validate(damaged).some(e=>e.includes('пересекаются')));
const missing=structuredClone(db),mk=missing.kits.find(k=>k.sizeRecipeMode);const choice=M.candidates(mk,500,1100)[0];delete mk.cells[choice.rowId+'|'+choice.colId];assert.equal(M.candidates(mk,500,1100).length,0);
// Size changes really switch auxiliary parts while retaining the same primary drive.
const resultA=M.calculate(db,k,{width:1050,height:1800,count:1}),resultB=M.calculate(db,k,{width:1150,height:1800,count:1});assert.deepEqual(resultA.errors,[]);assert.deepEqual(resultB.errors,[]);assert.notDeepEqual(resultA.items,resultB.items);
const core=fs.readFileSync('assets/legacy/matrix-core.js','utf8'),html=fs.readFileSync('configurator.html','utf8');assert(html.includes(core));assert(html.includes('draft.container.sizeRecipes'));assert(html.includes('editedItems'));
console.log('Tilt First workbook: 96 exact source BOMs, '+cases+' edge/handing calculations, no extrapolation, profile/hinge guards, subrange editing passed.');
