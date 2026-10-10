// Saved prices must survive render and same-account catalog refresh, but never a permission/account change.
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const source=fs.readFileSync('assets/legacy/app-core.js','utf8'),ui=fs.readFileSync('assets/legacy/ui-enhancements.js','utf8');
const nodes={},node=()=>({value:'',innerHTML:'',textContent:'',style:{},dataset:{},children:[],classList:{add(){},remove(){},toggle(){}},appendChild(n){this.children.push(n)},focus(){},before(){}});
const c={document:{getElementById:id=>nodes[id]??=(id==='pricingInvoiceWarning'?null:node()),createElement:node,body:node()},orderPositions:[],DATA:{master:{RN:{name:'Hinge',price:10}}},FUTURUSS_SPA:{state:{auth:{role:'dealer',nodeId:1},catalog:{canViewPrices:true,data:{pricingApplied:true}}}},esc:String,inlineJsArg:JSON.stringify,groupRowsForDisplay:a=>a,isHingeKitArt:()=>false,isDriveArt:()=>false,renderLayoutSection:()=>'',posAddArtSelected:{},setMsg(){},clone:x=>JSON.parse(JSON.stringify(x)),normalizeEstimate:x=>x,restoreForm(){},renderEstimates(){},saveDraftNow(){},restoringEstimate:false};
c.$=id=>c.document.getElementById(id);vm.createContext(c);
vm.runInContext(source.slice(source.indexOf('function addFreePosition'),source.indexOf('// ---- Excel export/import')),c);
vm.runInContext(source.slice(source.indexOf('globalThis.FuturussLegacyApp =')),c);
for(const name of ['applyEstimate','repriceEstimate']){const start=ui.indexOf(' function '+name+'('),end=ui.indexOf('\n',start);vm.runInContext(ui.slice(start,end),c);}
const record={name:'Saved',positions:[{id:1,label:'Test',rows:[{art:'RN',name:'Hinge',qty:2,price:7}],width:900,height:1500}],form:{}};
c.applyEstimate(record);let row=c.orderPositions[0].rows[0];assert.equal(row.price,7);assert.equal(nodes['inv-grand-total'].textContent,'14.00');c.renderOrder();assert.equal(row.price,7);
c.FuturussLegacyApp.syncOrderPrices(true);assert.equal(row.price,7);
c.repriceEstimate();assert.equal(row.price,10);assert(!row.priceFrozen);assert.equal(record.positions[0].rows[0].price,7);
c.applyEstimate(record);c.FUTURUSS_SPA.state.catalog.canViewPrices=false;c.FuturussLegacyApp.syncOrderPrices(false);assert.equal(c.orderPositions[0].rows[0].price,0);
c.FUTURUSS_SPA.state.catalog.canViewPrices=true;c.applyEstimate(record);c.FUTURUSS_SPA.state.auth.nodeId=2;c.FuturussLegacyApp.syncOrderPrices(true);assert.equal(c.orderPositions[0].rows[0].price,10);
assert(!ui.slice(ui.indexOf(' function loadEstimate('),ui.indexOf(' function renameEstimate(')).includes('.close('));
console.log('Saved-price open, render, explicit reprice, account/permission isolation and modal retention passed.');
