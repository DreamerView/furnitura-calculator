const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const src=fs.readFileSync('assets/legacy/ui-enhancements.js','utf8'),context={module:{exports:{}},TextEncoder,Uint8Array,DataView,Date};vm.runInNewContext(src.slice(src.indexOf('(function(root){')),context);const api=context.module.exports;
const old={rows:[{art:'XU',name:'XU',qty:2,price:10}]},rub={...old,currency:'RUB'};
assert.equal(api.exchange([old],'old').currency,'KZT');assert.equal(api.exchange([rub],'new').currency,'RUB');assert.equal(api.exchange([rub],'new').total,20);
assert.throws(()=>api.exchange([old,rub],'mixed'),/смешивать/);assert.throws(()=>api.workbook([old,rub],'mixed'),/смешивать/);
const xlsx=Buffer.from(api.workbook([rub],'new'));assert(xlsx.includes(Buffer.from('RUB')));assert(!xlsx.includes(Buffer.from('KZT')));
console.log('Invoice currency: RUB snapshots, legacy KZT preserved, mixed invoices blocked, XLSX metadata passed.');
