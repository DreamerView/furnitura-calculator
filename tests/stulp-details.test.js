const assert=require('node:assert/strict'),M=require('../assets/legacy/matrix-core'),db=require('../storage/default-catalog.json');
const ranges=[[690,800],[801,1200],[1201,1600],[1601,2000],[2001,2400]];
let checked=0;
for(const k of db.kits.filter(k=>k.stulpDetailsVersion)){
 for(const [i,r] of k.rows.entries()){
  assert.deepEqual([r.from,r.to],ranges[i]);const recipe=k.heightRecipes[r.id];assert(recipe&&!recipe.reviewed);assert.equal(recipe.items.filter(x=>x.role==='drive').length,1);assert.equal(recipe.items[0].art,r.drives[0]);
  for(const it of recipe.items)assert(db.articles[it.art]);
  for(const h of [r.from,r.to]){const rows=k.rows.filter(x=>M.fits(h,x));assert.equal(rows.length,1);assert.equal(rows[0].id,r.id);checked++;}
 }
 const changed=structuredClone(k),old=structuredClone(changed.common);M.replaceCommon(changed,old);M.replaceCommon(changed,old);assert.deepEqual(changed.heightRecipes,k.heightRecipes);
 for(const cell of Object.values(changed.cells))for(const common of old)assert(cell.items.some(i=>i.art===common.art&&i.qty===common.qty));
 assert(M.calculate(db,k,{width:700,height:1200,count:1}).errors.length);
 assert.equal(k.stulpStrike,db.stulpCompatibility.strikes[k.variant][k.stulpControl==='lever'?'drive':'groove']);
 if(k.stulpMotion==='turn')assert(!Object.values(k.heightRecipes).some(r=>r.items.some(i=>i.role==='scissors')));
}
assert.deepEqual(db.articles['PS.800'].height,{min:690,max:890});
for(const r of db.stulpCompatibility.rows){assert(db.articles[r.passive]);for(const v of ['roller11','roller8','mushroom']){assert(db.articles[r.active[v]]);assert(db.articles[r.passive].variants.includes(v));}}
const bad=structuredClone(db);bad.kits.find(k=>k.heightRecipes).heightRecipes.invalid={items:[]};assert(M.validate(bad).length);
assert.deepEqual(M.validate(db),[]);
console.log(checked+' stulp height boundaries, paired drives, shared edits, safety guards and cam compatibility passed.');
