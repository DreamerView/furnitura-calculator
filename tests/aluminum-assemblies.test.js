const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const M=require('../assets/legacy/matrix-core'),db=require('../storage/default-catalog.json');require('../assets/js/cam-selector');const C=globalThis.FuturussCamSelector;
const kits=db.kits.filter(k=>k.family==='aluminum');assert.equal(kits.length,18);assert.deepEqual(M.validate(db),[]);
for(const group of new Set(kits.map(k=>k.assemblyGroup))){
 const members=kits.filter(k=>k.assemblyGroup===group);assert.deepEqual(members.map(k=>k.assemblyLevel),['standard','basic','high']);
 for(const k of members){assert.equal(C.target(kits,k,'roller8'),null);for(const level of Object.keys(C.levels))assert.equal(C.assemblyTarget(kits,k,level).assemblyGroup,group);assert.equal(C.target(kits,k,'mushroom').assemblyLevel,'high');}
 assert.equal(C.target(kits,members[2],'roller11').assemblyLevel,'standard');assert.equal(C.visible(members[1],members[0]),false);
}
let checks=0;
for(const k of kits)for(const width of [600,700,1000])for(const side of ['R','L'])for(const profile of ['14','10']){
 const params={width,height:1100,count:2,side,aluminumProfile:profile,dornmass:k.dornmass,options:{}};
 const choices=M.candidates(k,width,1100);assert(choices.length,k.id);
 for(const choice of choices){const r=M.calculate(db,k,params,choice);assert.deepEqual(r.errors,[],k.id);assert.equal(r.total,r.items.reduce((s,i)=>s+i.qty*i.price,0));
  if(k.assemblyLevel==='basic'&&k.assemblyGroup!=='stulp'){assert(!choice.drive.endsWith('.V'));assert(r.items.some(i=>i.art==='U2'));}
  if(k.aluminumScissorLever){assert(r.items.some(i=>i.art.startsWith((profile==='10'?'AL02':'AL')+'.RSNO.')));assert(!r.items.some(i=>/\.SPK-/.test(i.art)));}
  if(k.assemblyGroup==='stulp')assert(!r.items.some(i=>i.art.startsWith('AL.PSO.')));
  assert(!r.items.some(i=>profile==='10'&&/^AL\.(?:SNP|SPK|RSNO|Z\.|ZVP|FO)/.test(i.art)));checks++;
 }
}
for(const k of kits.filter(k=>k.assemblyGroup==='fanlight'))for(const [width,height]of [[529,700],[1401,700],[700,349],[700,1201]])assert(M.calculate(db,k,{width,height,count:1}).errors.length);
// A saved/manual cell is never reconstructed when a catalogue assembly is selected.
const custom=structuredClone(kits[0]);custom.cells['h3|w1']={items:[{art:'RN',qty:7,role:'manual'}],reviewed:false};assert.deepEqual(M.cell(db,custom,custom.rows[3],custom.columns[1]).items,custom.cells['h3|w1'].items);
const html=fs.readFileSync('configurator.html','utf8'),ctx={};vm.runInNewContext(html.match(/<script>(\(function\(root\)\{[\s\S]*?)<\/script>/)[1],ctx);assert.equal(ctx.MatrixCore.cell.toString(),M.cell.toString());
vm.runInThisContext(fs.readFileSync('assets/js/i18n.js','utf8'));for(const text of [...Object.values(C.levels),'Вариант сборки'])for(const lang of ['en','tr'])assert(!/[А-Яа-яЁё]/.test(FuturussI18n.translate(text,lang)));
console.log('ALU: 18 assembly templates, exact cam transitions, profile/side mapping, totals, manual cells, translations;',checks,'calculations passed.');
