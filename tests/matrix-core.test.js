const assert=require('assert');
const MatrixCore=require('../assets/legacy/matrix-core.js');
let n=0;const ok=(v,m)=>{assert.ok(v,m);console.log(`ok ${++n} - ${m}`)};
const db={schemaVersion:2,format:'futuruss-matrix',articles:{A:{name:'Drive',price:100},B:{name:'Scissors',price:50}},kits:[{id:'k1',name:'Test',variant:'roller11',family:'pvc',profile:'KBE 13',side:'R',handle:'center',columns:[{id:'w1',from:300,to:1000}],rows:[{id:'h1',from:500,to:2000,drives:['A']}],common:[{art:'B',qty:1,role:'scissors'}],cells:{'h1|w1':{items:[{art:'A',qty:1,role:'drive'},{art:'B',qty:1,role:'scissors'}],reviewed:true}},options:{}}]};
const errors=MatrixCore.validate(db);ok(Array.isArray(errors)&&errors.length===0,'Imported matrix validates');
const res=MatrixCore.calculate(db,db.kits[0],{width:700,height:1200,dornmass:15,side:'R',count:2,options:{}},null);ok(res.errors.length===0,'Calculation returns no errors');ok(res.items.some(x=>x.art==='A'&&x.qty===2),'Drive quantity multiplied by sash count');ok(res.total===300,'Total is calculated from imported prices');
console.log(`PASS ${n} checks`);
