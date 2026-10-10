const assert=require('node:assert/strict'),fs=require('node:fs');
const M=require('../assets/legacy/matrix-core'),db=require('../storage/default-catalog.json'),source=require('./fixtures/tilt-first-workbook.json');
const eight=db.kits.find(k=>k.id==='catalog-pvc-7-25'),eleven=db.kits.find(k=>k.id==='catalog-pvc-7-6');
const mapped=a=>({'XU':'U1','XUU':'UU','XU.400-1U':'UF.400-1.U','XU.400-1':'UB.400-1','XU.600-1':'UB.600-1'}[a]||a.replace(/^XPO\./,'POM.').replace(/^XPNB\./,'PNB.').replace(/^XNO\./,'NO.'));
const totals=items=>{const out={};for(const i of items)out[i.art]=(out[i.art]||0)+i.qty;return out;};
assert.deepEqual(M.validate(db),[]);assert.equal(eight.common.length,13);assert.equal(eleven.common.length,13);
for(const row of eight.rows){const h=db.articles[row.drives[0]].height;assert(row.from>=h.min&&row.to<=h.max);}
let cases=0;
for(const c of Object.values(eight.cells))for(const rule of c.sizeRecipes){
 const original=source.find(r=>r.sourceCell===rule.sourceCell);
 assert.deepEqual(rule.items,original.items.map(i=>({...i,art:mapped(i.art)})),'Only catalogue article substitutions, unchanged quantities');
 assert.equal(rule.reviewed,false,'Derived recipe needs technology review');
 const drive=db.articles[rule.items.find(i=>i.role==='drive').art];assert(rule.height.from>=drive.height.min&&rule.height.to<=drive.height.max);
 for(const width of [rule.width.from,rule.width.to])for(const height of [rule.height.from,rule.height.to])for(const side of ['L','R'])for(const profile of Object.keys(M.tiltFirstWorkbookProfiles)){
  const result=M.calculate(db,eight,{width,height,side,strikeProfile:profile,count:1});assert.deepEqual(result.errors,[]);
  assert(!result.items.some(i=>/^X(?:PO|NO|PNB)\./.test(i.art)));assert(result.items.some(i=>i.art===M.tiltFirstWorkbookProfiles[profile]));cases++;
 }
}
for(const k of [eight,eleven]){
 for(const width of [599,600,601,800,801]){const r=M.calculate(db,k,{width,height:1200,count:1});assert.deepEqual(r.errors,[]);const sc=r.items.find(i=>/^(X?NO)\./.test(i.art));assert.equal(sc.art,width<=600?'NO.600.TF':(k===eight?'NO.':'XNO.')+(width<=800?'800-1.TF':'1000-1.TF'));}
 const clone=structuredClone(k),before=Object.values(clone.cells).flatMap(c=>[c,...c.sizeRecipes]).map(c=>totals(c.items));
 M.replaceCommon(clone,clone.common);M.replaceCommon(clone,clone.common);
 assert.deepEqual(Object.values(clone.cells).flatMap(c=>[c,...c.sizeRecipes]).map(c=>totals(c.items)),before,'Repeated common save must not duplicate quantities');
 const item=clone.common.find(i=>i.art==='ZK.45'),saved=Object.values(clone.cells)[0];saved.items.push({art:'ZK.45',qty:3,role:'manual',compatibilityApproved:true});
 const counts=totals(saved.items);const changed=structuredClone(clone.common);changed.find(i=>i.art===item.art).qty++;
 M.replaceCommon(clone,changed);assert.equal(totals(saved.items)['ZK.45'],counts['ZK.45']+1);assert(saved.items.some(i=>i.art==='ZK.45'&&i.compatibilityApproved&&i.qty===3));
 const without=clone.common.filter(i=>i.art!=='ZK.45');M.replaceCommon(clone,without);assert.equal(totals(saved.items)['ZK.45'],counts['ZK.45']-item.qty);
}
assert(db.kits.filter(k=>!k.catalogDraft).every(k=>k.common.length>0),'Every enabled kit has a common composition');
assert(fs.readFileSync('configurator.html','utf8').includes(fs.readFileSync('assets/legacy/matrix-core.js','utf8')));
console.log('Common composition: '+cases+' roller8 boundary/profile/handing calculations; catalogue mapping, 600 mm scissors, repeated saves and manual extras passed.');
