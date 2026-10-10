const assert=require('node:assert/strict'),M=require('../assets/legacy/matrix-core'),db=require('../storage/default-catalog.json');
let count=0;
for(const cam of ['11','8','mushroom'])for(const width of [450,650,700,900,1000,1001,1200])for(const height of [800,1200,1500,2000])for(const dornmass of [7.5,15,25])for(const side of ['R','L']){
 const base=db.kits.find(k=>k.id==='pvc-turn-'+cam),k=M.turnAssemblyKit(db.kits,base,'improved');
 assert.equal(M.turnAssemblyKit(db.kits,k,'improved'),k,'idempotent derivation');
 const p={width,height,dornmass,side,count:1,turnAssembly:'improved',strikeProfile:'KBE 13',optionSeries:'13',options:{}};
 const choices=M.candidates(k,width,height,db,dornmass).filter(c=>M.dornAlternative(db,c.drive,dornmass));
 if(!choices.length){const r=M.calculate(db,base,p);assert(r.errors.includes('Для выбранного дорнмасса нет подходящего привода в базе номенклатуры.'));continue;}
 const r=M.calculate(db,base,p,choices[0]);assert.deepEqual(r.errors,[],JSON.stringify(p));
 assert(!r.items.some(i=>/^(X?NO|X?PNB|PNF)\./.test(i.art)),'no scissors');
 assert.equal(r.items.find(i=>i.art===({11:'XU',8:'U1',mushroom:'U2'}[cam])).qty,2);
 assert(r.items.some(i=>/^X?PO/.test(i.art)&&M.articleDornmass(i.art,db.articles[i.art])===dornmass));
 const pressure=M.pressureSummary(r.items);assert(pressure.complete);assert(pressure.points>0);
 assert(r.items.filter(i=>['perimeter','security'].includes(M.strikeRole(i.art))).reduce((n,i)=>n+i.qty,0)>=pressure.points,'strikes for each cam');
 assert.equal(base.common.some(i=>i.art==='XU'),false,'base not mutated');count++;
}
for(const id of ['roller11','roller8','mushroom'])for(const width of [450,600,650,651,900])for(const hingeType of ['reinforced130','reinforcedLower']){
 const k=db.kits.find(k=>k.id===id),p={width,height:1200,count:1,side:'R',hingeType,options:{}};
 const r=M.calculate(db,k,p,M.candidates(k,width,1200)[0]);assert.deepEqual(r.errors,[]);assert(r.items.some(i=>i.art==='RN.U'));
}
console.log('Enhanced turn: '+count+' cam/width/height/dornmass/side combinations; narrow reinforced hinges passed.');
