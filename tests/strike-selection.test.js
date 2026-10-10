const assert=require('node:assert/strict'),M=require('../assets/legacy/matrix-core'),seed=require('../storage/default-catalog.json');
const db=structuredClone(seed);for(const a of Object.values(db.articles))a.price=10;
const kit=db.kits.find(k=>k.id==='roller11');
function calc(profile,overrides={}){return M.calculate(db,kit,{width:500,height:1200,count:2,side:'L',dornmass:15,optionSeries:profile==='KBE 09'?'9':'13',strikeProfile:profile,...overrides},M.candidates(kit,500,1200)[0]);}
for(const [profile,target] of [['KBE 09','ZK9.40'],['KBE 13','ZK.40'],['REHAU','ZK.40'],['VEKA 13 / VHS','ZK.40'],['Gealan/Ivaper','ZQ.45'],['Deceuninck/Thyssen','ZD.45']]){const r=calc(profile);assert.deepEqual(r.errors,[]);assert(r.items.some(i=>i.art===target),profile);assert(r.items.some(i=>i.art===('XZSP.'+(profile==='KBE 09'?'9':'13')+'.L')));}
const before=calc('KBE 13'),manual=calc('KBE 13',{strikeOverrides:{perimeter:'ZK.35'}});assert.deepEqual(manual.errors,[]);assert.equal(manual.items.find(i=>i.art==='ZK.35').qty,before.items.find(i=>i.art==='ZK.40').qty);assert(manual.warnings.some(w=>w.includes('ZK.35')));
assert(calc('KBE 13',{strikeOverrides:{perimeter:'NO-SUCH-ARTICLE'}}).errors.length);
db.articles['ZK.35'].available=false;assert(calc('KBE 13',{strikeOverrides:{perimeter:'ZK.35'}}).errors.length);
assert(calc('KBE 09',{optionSeries:'13'}).errors.length);
assert.equal(M.strikePlan(db,kit,{strikeProfile:'REHAU'}).roles.security.art,'ZUP.R/40');
assert.equal(M.strikePlan(db,kit,{strikeProfile:'VEKA 13 / VHS'}).roles.tiltSecurity.art,'ZUO.V/40');
assert.equal(M.strikePlan(db,kit,{strikeProfile:'KBE 13',side:'L'}).roles.tiltFirst.art,'ZTF.K13/30.L');
assert.equal(M.strikePlan(db,{...kit,family:'aluminum'},{strikeProfile:'KBE 13'}),null);
console.log('Strike selection: six profiles, suffixes, side, count, manual override, availability and groove checks passed.');
