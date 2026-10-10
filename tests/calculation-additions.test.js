const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const M=require('../assets/legacy/matrix-core'),db=require('../storage/default-catalog.json');
function calculate(id,overrides={}){const kit=db.kits.find(k=>k.id===id);const p={width:700,height:1500,count:2,side:'R',dornmass:15,optionSeries:'13',options:{microvent:false,lifter:false,plsEnabled:false,bprEnabled:false,handleEnabled:false},...overrides};let r=M.calculate(db,kit,p);if(r.needsChoice)r=M.calculate(db,kit,p,r.choices[0]);return r;}
function valid(r){assert.deepEqual(r.errors,[]);assert.equal(r.total,r.items.reduce((s,i)=>s+i.qty*i.price,0));return r;}
for(const variant of ['roller11','roller8','mushroom'])for(const side of ['R','L'])for(const axis of ['9','13'])for(const profile of ['K','V','R']){
 const prefix=profile==='K'?(axis==='9'?'K9':'K'):profile;const r=valid(calculate(variant,{hingeType:'hidden',side,optionSeries:axis,hiddenProfile:profile,hiddenStrike:'ZUO.'+prefix+'/45',coverColor:'black'}));
 assert(r.items.some(i=>i.art==='SNP-'+(axis==='9'?'09':'13')+'.'+side&&i.qty===2));
 assert(r.items.some(i=>i.art==='N.SP-'+side+'.BLACK'));
 assert(r.items.some(i=>i.art==='P.SP'+(profile==='V'?'K':profile)+'-'+side&&i.qty===4));
 assert(!r.items.some(i=>/^(RV(?:\.|$)|RN(?:\.|$)|SN(?:\.|$)|SV\.\d|N\.(RV|RN|SN|SV))/.test(i.art)));
}
for(const [width,art] of [[450,'SNO.600'],[600,'SNO.600'],[601,'XSNO.800-1'],[800,'XSNO.800-1'],[801,'XSNO.1000-1'],[1000,'XSNO.1000-1'],[1001,'XSNO.1200-1'],[1200,'XSNO.1200-1']]){const r=valid(calculate('roller11',{width,hingeType:'hidden',hiddenProfile:'K',hiddenStrike:'ZUO.K/45'}));assert(r.items.some(i=>i.art===art));}
for(const overrides of [{width:449},{width:1201},{hiddenStrike:'ZUO.V/45'},{hiddenStrike:''},{hiddenProfile:'unknown'}])assert(calculate('roller11',{hingeType:'hidden',hiddenProfile:'K',hiddenStrike:'ZUO.K/45',...overrides}).errors.length);
assert(!M.hiddenStrikeFits('ZUO.K9/45','K','13'));assert(!M.hiddenStrikeFits('ZUO.K/45','K','9'));assert(!M.hiddenStrikeFits('ZUO.R/45','V','13'));
for(const axis of ['9','13']){const r=valid(calculate('roller11',{optionSeries:axis}));assert(r.items.some(i=>i.art===(axis==='9'?'SV.09':'SV.13')));}
for(const [height,drive,handleHeight] of [[600,'XPOK.600-1',300],[800,'XPOK.600-1',300],[801,'XPOK.800-1',400],[1000,'XPOK.800-1',400],[1001,'XPOK.1000-1',500],[1200,'XPOK.1000-1',500],[1201,'XPOK.1200-2',600],[1400,'XPOK.1200-2',600],[1401,'XPOK.1400-2',700],[1600,'XPOK.1400-2',700],[1601,'XPOK.1600-2',700],[1800,'XPOK.1600-2',700],[1801,'XPOK.1800-2',1000],[2000,'XPOK.1800-2',1000],[2001,'XPOK.2000-3',1000],[2200,'XPOK.2000-3',1000]]){
 const r=valid(calculate('roller11',{height,handle:'offset',handleHeightMode:'manual',handleHeight}));assert.equal(r.technology.drive,drive);assert.equal(r.technology.handleHeight,handleHeight);assert(r.items.some(i=>i.art===drive));
}
for(const overrides of [{handleHeight:650},{handleHeight:0},{handleHeight:null},{handleHeight:1600},{height:599},{height:2201},{dornmass:25}]){const r=calculate('roller11',{handle:'offset',handleHeightMode:'manual',handleHeight:700,...overrides});assert(r.errors.length);assert.equal(r.items.length,0);assert(!M.technologyText(r.technology).includes('NaN'));}
for(const series of ['11','8']){
 const turn=db.kits.find(k=>k.id==='pvc-turn-'+series);for(const row of turn.rows)for(const height of [row.from,row.to]){const r=valid(calculate(turn.id,{height}));assert(r.items.some(i=>i.art===row.drives[0]));assert(!r.items.some(i=>/^(X?NO|X?SNO)\./.test(i.art)));}
 const r=valid(calculate('pvc-stulp-bolts-'+series,{optionSeries:'9'}));assert(r.items.some(i=>i.art==='DSP'&&i.qty===4));assert(r.items.some(i=>i.art==='ZUSP.09'));assert(!r.items.some(i=>/^(X?PP|X?PO|X?NO)\./.test(i.art)));
 assert(calculate(turn.id,{options:{microvent:true}}).errors.length);assert(calculate('pvc-stulp-bolts-'+series,{options:{handleEnabled:true}}).errors.length);
}
const html=fs.readFileSync('configurator.html','utf8'),embedded=html.match(/<script>(\(function\(root\)\{[\s\S]*?)<\/script>/)[1],context={};vm.runInNewContext(embedded,context);assert.equal(context.MatrixCore.calculate.toString(),M.calculate.toString());assert.equal(context.MatrixCore.handleTechnology.toString(),M.handleTechnology.toString());
vm.runInThisContext(fs.readFileSync('assets/js/i18n.js','utf8'));
const newUi=fs.readFileSync('assets/js/calculation-technology.js','utf8');for(const text of newUi.match(/>[А-Яа-яЁё][^<>]*</g)||[])for(const lang of ['en','tr'])assert(!/[А-Яа-яЁё]/.test(globalThis.FuturussI18n.translate(text.slice(1,-1),lang)));
assert(fs.readFileSync('assets/legacy/matrix-adapter.js','utf8').includes('if(imported?.pricingApplied&&unavailable.length)'));
console.log('Calculation additions: hidden hinge families/sides/axes/profiles, width and height boundaries, four kits, incompatible options, exact shared core and translations passed.');
