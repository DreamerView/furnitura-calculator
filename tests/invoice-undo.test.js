const assert=require('node:assert/strict');require('../assets/js/invoice-undo.js');
const h=globalThis.FuturussInvoiceUndo.createHistory(),rows=[{id:1,qty:1}];
assert.equal(h.canUndo(rows),false);rows.push({id:2});h.record(rows,[2]);rows.push({id:3});h.record(rows,[3]);rows[0].qty=9;
assert.ok(h.undo(rows));assert.deepEqual(rows,[{id:1,qty:9},{id:2}]);assert.ok(h.undo(rows));assert.equal(h.undo(rows),false);
rows.push({id:4});h.record(rows,[4]);assert.equal(h.canUndo([...rows]),false);assert.equal(h.undo(rows),false);
rows.push({id:5});h.record(rows,[5]);rows.pop();assert.equal(h.canUndo(rows),false);
console.log('PASS undo additions, successive undo, edit preservation, switched estimates and removed positions');
