const assert=require('node:assert/strict');
const fs=require('fs');
require('../assets/js/frame-dimensions.js');
const F=globalThis.FuturussFrameDimensions,rows=JSON.parse(fs.readFileSync('assets/data/frame-profiles.json','utf8')),kit={id:'roller11',family:'pvc',openingType:'tilt-turn'};
const r=F.convert(rows[0],900,1500,kit);
assert.equal(r.width,800);assert.equal(r.height,1400);assert.equal(r.frameDimensions.width,900);
assert.equal(F.convert(rows[1],900,1500,kit).width,788);
assert.equal(F.convert(rows[2],900,1500,kit).height,1392);
assert.ok(F.convert(rows[5],900,1500,kit).error);
for(const size of [0,100,-1,NaN,Infinity])assert.ok(F.convert(rows[0],size,1500,kit).error);
for(const bad of [{...kit,family:'aluminum'},{...kit,openingType:'door'},{...kit,openingType:'stulp-drive'},{...kit,id:'stulp-active',openingType:'tilt-turn'},null])assert.ok(F.convert(rows[0],900,1500,bad).error);
const custom={...rows[0],widthDeduction:110.5,heightDeduction:120};assert.equal(F.convert(custom,900,1500,kit).width,789.5);
assert.notEqual(r.frameDimensions.profile,rows[0]);
assert.equal(F.convert({...rows[0],widthDeduction:null},900,1500,kit).error,F.errors.profile);
const file=fs.readFileSync('configurator.html','utf8');for(const match of file.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g))new Function(match[1]);
console.log('PASS frame conversion, invalid dimensions, unsupported systems, snapshot and constructor syntax');

const grouped=F.groupProfiles(rows),flat=F.flattenGroups(grouped);
assert.equal(grouped.filter(g=>g.enabled).length,6);
assert.equal(grouped.find(g=>g.widthDeduction===110).profiles.length,10);
assert.deepEqual([...flat].sort((a,b)=>a.id.localeCompare(b.id)),[...rows].sort((a,b)=>a.id.localeCompare(b.id)));
const rule=grouped.find(g=>g.widthDeduction===110);rule.widthDeduction=111;rule.heightDeduction=113;
const edited=F.flattenGroups(grouped);for(const p of rule.profiles){const result=edited.find(r=>r.id===p.id);assert.equal(result.widthDeduction,111);assert.equal(result.heightDeduction,113);assert.equal(result.source,p.source);assert.equal(result.note,p.note);}
assert.equal(rows.find(r=>r.id==='kbe-engine-907').widthDeduction,110);
const separate=F.groupProfiles([{...rows[0],heightDeduction:101},{...rows[0],id:'off',enabled:false},rows[0]]);assert.equal(separate.length,3);
assert.equal(F.groupProfiles([]).length,0);
for(const p of rows.filter(p=>p.enabled)){const c=F.convert(p,900,1500,kit);assert.equal(c.width,900-p.widthDeduction);assert.equal(c.height,1500-p.heightDeduction);}
console.log('PASS grouped rule roundtrip, bulk edits, stable profile IDs and sources, frame calculations');

const annotated=F.groupProfiles(rows);annotated[0].groupNote='One group note';annotated[0].groupSource='';const annotatedRows=F.flattenGroups(annotated);assert.ok(annotatedRows.filter(p=>annotated[0].profiles.some(r=>r.id===p.id)).every(p=>p.groupNote==='One group note'&&p.groupSource===''));assert.equal(F.groupProfiles(annotatedRows)[0].groupNote,'One group note');
assert.equal(F.convert(rows.find(p=>p.id==='melke-lite60-3442'),900,1500,kit).width,798);assert.equal(F.convert(rows.find(p=>p.id==='grain-lider-552'),900,1500,kit).height,1390);
