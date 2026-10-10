const assert=require('node:assert/strict'),M=require('../assets/legacy/matrix-core'),db=require('../storage/default-catalog.json');
assert.deepEqual(M.validate(db),[]);let cells=0;
for(const section of ['7.26','7.51','7.52']){
 const k=db.kits.find(k=>k.catalogScheme===section);assert(k.catalogDraft&&k.catalogPrepared&&k.componentRangesOnly);assert(k.verificationRequired.length===4);assert(k.catalogGroups.length>5);
 for(const [key,c]of Object.entries(k.cells)){cells++;assert(!c.reviewed);assert(c.items.length>=2);for(const item of c.items)assert(db.articles[item.art]);assert.equal(c.items.filter(x=>x.role==='drive').length,1);}
 for(const col of k.columns)for(const width of [col.from,col.to])for(const row of k.rows){const p={width,height:row.from,count:1};const result=M.calculate(db,k,p);assert(result.errors.length);assert.equal(result.total,null);assert.deepEqual(result.items,[]);}
 for(const group of k.catalogGroups)for(const art of group.articles)assert(db.articles[art]);
}
const a=db.kits.find(k=>k.catalogScheme==='7.51');assert.deepEqual(a.columns.map(x=>[x.from,x.to]),[[700,900],[901,1150],[1151,1360]]);assert.equal(a.catalogLimits.maxCarriageLoadKg,160);
assert.equal(Object.keys(db.articles).filter(x=>x.startsWith('9417-00-')||x.startsWith('9617/18-160')).length,32);
console.log('Sliding catalogue:',cells,'editable cells, article references, component ranges and blocked unfinished invoices passed.');
