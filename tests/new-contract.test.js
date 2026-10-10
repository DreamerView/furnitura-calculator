const fs=require('fs'),vm=require('vm'),assert=require('assert');
const context={};vm.runInNewContext(fs.readFileSync(__dirname+'/../assets/legacy/matrix-core.js','utf8'),context);
const image='data:image/png;base64,AAAA';
const db={schemaVersion:2,format:'futuruss-matrix',nomenclatureVersion:'2026-VHS-TT-2',articles:{'A.1':{name:'Тестовая деталь',price:1}},advertisingImages:[image,image],kits:[{id:'vhs-test',variant:'vhsEuro',family:'vhs',name:'Тестовая VHS-комплектация',rows:[{id:'h1',from:500,to:900,drives:['A.1']}],columns:[{id:'w1',from:400,to:1000}],common:[],cells:{'h1|w1':{items:[{art:'A.1',qty:1}],reviewed:true}}}]};
assert.deepStrictEqual(Array.from(context.MatrixCore.validate(db)),[]);
db.kits[0].variant='';assert(Array.from(context.MatrixCore.validate(db)).includes('Неверная комплектация'));
db.kits[0].variant='vhsEuro';db.advertisingImages=['not-an-image'];assert(Array.from(context.MatrixCore.validate(db)).includes('Рекламное изображение имеет неверный формат.'));
console.log('New futuruss-matrix v2 contract passed.');
