const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const M=require('../assets/legacy/matrix-core'),db=require('../storage/default-catalog.json');
for(const a of Object.values(db.articles))if(a.price==null)a.price=10; // Synthetic prices; real price books are not modified.
function calc(id,p={}){const k=db.kits.find(k=>k.id===id),params={width:700,height:1200,side:'R',count:2,dornmass:15,optionSeries:'13',options:{plsEnabled:false,handleEnabled:false},...p};let r=M.calculate(db,k,params);if(r.needsChoice)r=M.calculate(db,k,params,r.choices[0]);return r;}
let checks=0;
for(const id of ['pvc-turn-11','pvc-turn-8','pvc-turn-mushroom'])for(const side of ['L','R'])for(const series of ['9','13'])for(const color of ['white','brown','anthracite','black']){
 const sf=calc(id,{side,optionSeries:series,coverColor:color,hingeType:'rebated'});assert.deepEqual(sf.errors,[]);assert(sf.items.some(i=>i.art==='SF.'+series+'.'+side&&i.qty===2));assert(!sf.items.some(i=>i.art==='SN'||i.art.startsWith('N.SN.')));assert(sf.items.some(i=>i.art==='PK'));assert.equal(sf.total,sf.items.reduce((a,i)=>a+i.qty*i.price,0));
 for(const profile of ['K','V','R']){
 const hidden=calc(id,{side,optionSeries:series,coverColor:color,hiddenProfile:profile,hingeType:'hidden'});assert.deepEqual(hidden.errors,[]);assert(hidden.items.some(i=>i.art==='SPK-'+(series==='9'?'09':'13')+'.'+side&&i.qty===2));assert(hidden.items.some(i=>i.art==='SNP-'+(series==='9'?'09':'13')+'.'+side));assert(hidden.items.some(i=>i.art==='P.SP'+(profile==='V'?'K':profile)+'-'+side&&i.qty===4));assert(!hidden.items.some(i=>/^((?:PK|RV|RN|SN)(?:\.|$)|SV\.|N\.R|N\.S[VN]|X?NO\.|X?SNO\.|X?PNB\.)/.test(i.art)));assert.equal(hidden.total,hidden.items.reduce((a,i)=>a+i.qty*i.price,0));checks++;
 }
}
for(const width of [449,1201])assert(calc('pvc-turn-11',{width,hingeType:'hidden',hiddenProfile:'K'}).errors.length);
assert(calc('pvc-stulp-bolts-11',{hingeType:'hidden',hiddenProfile:'K'}).errors.length);assert(calc('roller11',{hingeType:'rebated'}).errors.length);
const black=calc('pvc-turn-11',{hingeType:'hidden',hiddenProfile:'K',hardwareFinish:'black',coverColor:'black'});assert.deepEqual(black.errors,[]);assert(black.items.some(i=>i.art==='SPK-13R.BLACK'));assert(!black.items.some(i=>i.art==='SPK-13.R'));
vm.runInThisContext(fs.readFileSync('assets/js/cam-selector.js','utf8'));const C=FuturussCamSelector,turn=db.kits.find(k=>k.id==='pvc-turn-11');assert.equal(C.target(db.kits,turn,'roller8').id,'pvc-turn-8');assert.equal(C.target(db.kits,turn,'mushroom').id,'pvc-turn-mushroom');assert.equal(C.target(db.kits,turn,'roller11').id,turn.id);assert.equal(C.label(db.kits[0]),'Поворотно-откидная');assert.equal(C.label(turn),'Поворотное открывание');
const custom={...turn,id:'my-kit',profile:'custom'};assert.equal(C.target(db.kits,custom,'roller8'),null);
console.log('Turn hinge combinations:',checks,'; side, axis, covers, black mapping, exclusions, totals and cam selection passed.');

assert.deepEqual(calc('pvc-turn-11',{hingeType:'hidden',hiddenProfile:'G',strikeProfile:'Gealan/Ivaper'}).errors,[]);
assert(calc('pvc-turn-11',{hingeType:'hidden',hiddenProfile:'K',strikeProfile:'REHAU'}).errors.length);
assert(calc('pvc-turn-11',{hingeType:'hidden',hiddenProfile:'K',strikeProfile:'Deceuninck/Thyssen'}).errors.length);
