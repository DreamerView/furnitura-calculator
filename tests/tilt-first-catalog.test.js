const assert=require('node:assert/strict'),M=require('../assets/legacy/matrix-core'),db=require('../storage/default-catalog.json');
assert.deepEqual(M.validate(db),[]);
let count=0;
for(const n of [19,25,39,43,46]){
 const k=db.kits.find(k=>k.catalogScheme==='7.'+n);assert(k.catalogDraft&&k.catalogPrepared&&k.componentRangesOnly);assert(k.verificationRequired.length>=4);
 for(const art of k.catalogParts)assert(db.articles[art],art);
 for(const col of k.columns)for(const row of k.rows){const cell=k.cells[row.id+'|'+col.id];count++;assert(!cell.reviewed);assert.equal(cell.items.length,2);for(const i of cell.items)assert(db.articles[i.art]);for(const width of [col.from,col.to]){const result=M.calculate(db,k,{width,height:row.from,count:1});assert.equal(result.total,null);assert.deepEqual(result.items,[]);}}
 if([19,39,46].includes(n)){const levers=k.catalogGroups.find(g=>g.articles.some(a=>a.startsWith('RSNO.'))).articles;assert.equal(levers.length,8);assert(levers.every(a=>a.endsWith('.TF')));}
 if(n===6)assert(Object.values(k.cells).every(c=>c.items[1].art.endsWith('.TF')));
 if(n===43)assert(Object.values(k.cells).every(c=>c.items[1].art.endsWith('.V')));
 for(let i=1;i<k.rows.length;i++)assert(k.rows[i].from>k.rows[i-1].to);
}
console.log('Tilt First: six schemes, '+count+' partial cells, correct scissors/lever families, ranges and invoice blocking passed.');
