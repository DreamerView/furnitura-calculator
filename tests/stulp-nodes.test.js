const assert=require('node:assert/strict'),fs=require('node:fs'),M=require('../assets/legacy/matrix-core'),db=require('../storage/default-catalog.json');
const bands=[[700,1000,400,1,[]],[1001,1300,600,2,[]],[1301,1450,800,2,[]],[1451,1700,400,1,[600]],[1701,1900,600,2,[600]],[1901,2100,800,2,[600]],[2101,2300,600,2,[400,600]],[2301,2400,600,2,[600,600]]];let checks=0;
for(const k of db.kits.filter(k=>k.stulpNodesVersion)){
 const suffix=k.variant==='mushroom'?'.V':'',drive=k.variant==='roller11'?'XPNB.':'PNB.',ext=k.variant==='roller11'?'XU.':'UB.';
 for(const row of k.rows)for(const col of k.columns)for(let h=row.from;h<=row.to;h++){
  const c=M.cell(db,k,row,col,{width:col.from,height:h});assert(!c.sizeUnavailable);assert.equal(c.items.filter(i=>i.role==='scissors').length,1);assert.equal(c.items.find(i=>i.role==='scissors').art,col.scissorArticle);
  const actual=c.items.filter(i=>i.chainZone==='rear').map(i=>[i.art,i.qty]).sort();const band=bands.find(b=>h>=b[0]&&h<=b[1]);let expected=[];
  if(band){expected.push([drive+band[2]+'-'+band[3]+suffix,1]);for(const length of new Set(band[4]))expected.push([ext+length+'-1'+suffix,band[4].filter(x=>x===length).length]);}assert.deepEqual(actual,expected.sort());for(const item of c.items)assert(db.articles[item.art],item.art);checks++;
 }
 assert(k.assemblyAdditions.includes('PLS'));assert(k.catalogDraft,'Unverified assembly must remain guarded');
 for(const art of k.assemblyAdditions)assert(db.articles[art]);
 const copy=M.copy(k),items=M.copy(k.common);M.replaceCommon(copy,items);const once=JSON.stringify(copy);M.replaceCommon(copy,items);assert.equal(JSON.stringify(copy),once);
}
const mushroom=db.kits.find(k=>k.id==='pvc-stulp-po-mushroom');assert.equal(mushroom.columns[0].from,600);assert.equal(mushroom.columns.at(-1).to,1400);assert.equal(M.candidates(mushroom,599,1000).length,0);
const old=JSON.parse(require('node:child_process').execFileSync('git',['show','HEAD:storage/default-catalog.json'],{encoding:'utf8',maxBuffer:50*1024*1024}));assert.deepEqual(db.kits.find(k=>k.catalogScheme==='7.48'),old.kits.find(k=>k.catalogScheme==='7.48'));
assert.deepEqual(M.validate(db),[]);const html=fs.readFileSync('configurator.html','utf8'),core=fs.readFileSync('assets/legacy/matrix-core.js','utf8').trim();assert(html.includes(core));
console.log(checks+' daily height/width combinations: scissors, rear drives, extensions, boundaries, guarded drafts and unchanged turn scheme passed.');
