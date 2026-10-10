const assert=require('node:assert/strict');const fs=require('fs');const vm=require('vm');
require('../assets/legacy/matrix-core.js');require('../assets/js/invoice-sides.js');
const S=globalThis.FuturussInvoiceSides;
const rows=[{art:'NO.1000-1',name:'Ножницы',qty:2,price:10},{art:'U.400-1',name:'Удлинитель',qty:6,price:10,placements:[{zone:'rear',qty:2},{zone:'bottom',qty:4}]},{art:'RV',name:'Петля',qty:2,price:10},{art:'XU',name:'Угловая передача',qty:2,price:10},{art:'XUSP',name:'Шпингалет откидной',chainZone:'lower',qty:2,price:10},{art:'XU.400-1',name:'Удлинитель',chainZone:'rear',qty:1,price:10},{art:'XPO.1600-2',name:'Привод',qty:2,price:10}];
const before=JSON.stringify(rows),out=S.entries(rows);
assert.deepEqual([...new Set(out.map(x=>x.zone))],['front','rear','upper','bottom']);
assert.equal(S.side(rows[4]),'front');assert.equal(S.side(rows[5]),'rear');
assert.equal(S.side({art:'PNF.V.200-1',chainZone:'bottom'}),'bottom');
assert.equal(S.side({art:'ZK.40',dependencies:[{parent:'NO.1000-1',ratio:1}]},rows),'upper');
assert.equal(out.reduce((s,x)=>s+x.row.qty*x.row.price,0),rows.reduce((s,r)=>s+r.qty*r.price,0));assert.equal(JSON.stringify(rows),before);
let changed=S.changeZone(rows[1],'bottom',3);assert.equal(changed.qty,5);assert.deepEqual(changed.placements,[{zone:'rear',qty:2},{zone:'bottom',qty:3}]);
changed=S.changeZone(rows[1],'bottom',0);assert.equal(changed.qty,2);assert.equal(S.entries([changed])[0].zone,'rear');assert.equal(S.parts({...rows[1],qty:99}),null);
// Execute real edit handlers with dependency hooks and render stubbed.
const source=fs.readFileSync('assets/legacy/app-core.js','utf8');const edit=source.slice(source.indexOf('function removeRow('),source.indexOf('function clearOrder('));
const pos={id:1,rows:JSON.parse(JSON.stringify(rows))};const context={orderPositions:[pos],FuturussInvoiceSides:S,applyNodeDependencies(){},applyPlateDependencies(){},renderOrder(){}};context.globalThis=context;vm.createContext(context);vm.runInContext(edit,context);
context.updateRowQty(1,1,3,'bottom');assert.equal(pos.rows[1].qty,5);context.removeRow(1,1,'bottom');assert.equal(pos.rows[1].qty,2);assert.equal(pos.rows.length,rows.length);context.updateRowQty(1,1,4);assert.equal(pos.rows[1].placements[0].qty,4);
console.log('PASS: four sides, corner/tilt overrides, split quantities, unchanged totals and actual editing/deletion handlers');
