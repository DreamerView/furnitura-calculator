const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const source=fs.readFileSync('assets/legacy/app-core.js','utf8');
const elements={},node=()=>({value:'',innerHTML:'',textContent:'',style:{},dataset:{},children:[],classList:{add(){},remove(){},toggle(){}},appendChild(n){this.children.push(n)},focus(){},before(){}});
const ctx={document:{getElementById:id=>elements[id]??=(id==='pricingInvoiceWarning'?null:node()),createElement:node,body:node()},orderPositions:[],posCounter:0,DATA:{master:{RN:{name:'Hinge',price:10}}},FUTURUSS_SPA:{state:{catalog:{canViewPrices:true,data:{pricingApplied:true}}}},esc:String,inlineJsArg:JSON.stringify,groupRowsForDisplay:a=>a,isHingeKitArt:()=>false,isDriveArt:()=>false,renderLayoutSection:()=>'',posAddArtSelected:{},setMsg(){}};
vm.createContext(ctx);vm.runInContext(source.slice(source.indexOf('function addFreePosition'),source.indexOf('// ---- Excel export/import')),ctx);
vm.runInContext(source.slice(source.indexOf('function addManualRow'),source.indexOf('// ---- База артикулов:')),ctx);
ctx.addFreePosition();const pos=ctx.orderPositions[0];assert(pos.freeInvoice);assert.equal(pos.width,'');assert.equal(pos.rows.length,0);
ctx.posAddArtSelected[pos.id]='RN';elements['add-qty-'+pos.id]={value:'3'};ctx.addManualRow(pos.id);ctx.updateFreeRowPrice(pos.id,0,'12,50');assert.equal(pos.rows[0].price,12.5);ctx.renderOrder();assert.equal(pos.rows[0].price,12.5);assert.equal(elements['inv-grand-total'].textContent,'37.50');
let html=elements['positions-container'].children.at(-1).innerHTML;assert(html.includes('free-price-input'));assert(!html.includes('ШСФ'));assert(!html.includes('Точки прижима'));
ctx.updateFreeRowPrice(pos.id,0,'-2');assert.equal(pos.rows[0].price,12.5);
ctx.orderPositions.push({id:2,label:'Calculated',rows:[{art:'RN',name:'Hinge',qty:2,price:10}],width:900,height:1500});ctx.renderOrder();const combined=Object.values(ctx.invoiceCombinedRows(ctx.orderPositions));assert.equal(combined.length,2);assert.equal(combined.reduce((a,r)=>a+r.qty*r.price,0),57.5);assert.equal(elements['inv-grand-total'].textContent,'57.50');
ctx.updateFreeRowPrice(2,0,99);assert.equal(ctx.orderPositions[1].rows[0].price,10);
ctx.FUTURUSS_SPA.state.catalog.canViewPrices=false;ctx.updateFreeRowPrice(pos.id,0,99);assert.equal(pos.rows[0].price,12.5);ctx.renderOrder();assert.equal(pos.rows[0].price,0);assert.equal(pos.rows[0].manualPrice,undefined);assert(!elements['positions-container'].children.at(-2).innerHTML.includes('free-price-input'));
console.log('Free invoice: dimensionless creation, item selection, custom price persistence, totals, mixed-price grouping and permission checks passed.');

vm.runInContext(source.slice(source.indexOf("globalThis.FuturussLegacyApp =")),ctx);
ctx.FUTURUSS_SPA.state.catalog.canViewPrices=true;ctx.updateFreeRowPrice(pos.id,0,15);ctx.FuturussLegacyApp.syncOrderPrices(true);assert.equal(pos.rows[0].price,15);
ctx.FUTURUSS_SPA.state.auth={role:"dealer",nodeId:123};ctx.FuturussLegacyApp.syncOrderPrices(true);assert.equal(pos.rows[0].price,10);assert.equal(pos.rows[0].manualPrice,undefined);
console.log("Price survives same-user reload sync and resets on account change.");
const previewPath=process.env.FUTURUSS_PRINT_PREVIEW;
ctx.updatePositionComment(pos.id,'Первая строка\nВторая строка');assert.equal(pos.comment,'Первая строка\nВторая строка');
let printed=elements['positions-container'].children.at(-2).innerHTML;assert(printed.includes('invoice-print-comment'));assert(printed.includes('Первая строка\nВторая строка'));assert(printed.includes('<span class="invoice-print-only">3</span>'));
ctx.updateFreeRowPrice(pos.id,0,15);printed=elements['positions-container'].children.at(-2).innerHTML;assert(printed.includes('<span class="invoice-print-only">15.00</span>'));
if(previewPath){
 const php=fs.readFileSync('index.php','utf8');let css=[...php.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map(m=>m[1]).join('\n');
 for(const m of php.matchAll(/<link[^>]*href="([^"?]+\.css)[^"]*"/g))css+='\n'+fs.readFileSync(m[1],'utf8');
 css=css.replace(/@media screen/g,'@media not all').replace(/@media print/g,'@media all');
 pos.label='Свободная заявка';pos.rows[0].name='Петля рамы нижняя';ctx.orderPositions[1].label='Позиция с длинными названиями';ctx.orderPositions[1].scheme='Поворотно-откидная · профиль KBE 13';ctx.orderPositions[1].rows=Array.from({length:48},(_,i)=>({art:'XPNB.600-2.V.TEST-'+i,name:'Привод-ножницы с удлинителем и подтверждённой ответной планкой для профильной системы',qty:2,price:10}));for(const x of ctx.orderPositions[1].rows)ctx.DATA.master[x.art]={name:x.name,price:10};ctx.renderOrder();
 const positions=elements['positions-container'].children.slice(-2).map(x=>'<div class="'+x.className+'">'+x.innerHTML+'</div>').join('');
 const head='<thead><tr><th>№</th><th>Артикул</th><th>Наименование</th><th>Кол-во</th><th>Цена</th><th>Сумма</th></tr></thead>';
 fs.writeFileSync(previewPath,'<!doctype html><meta charset="utf-8"><style>'+css+'</style><style>html{width:186mm!important;margin:auto!important}body{margin:0!important}</style><body class="workdesk-app print-positions"><div class="wrap"><div id="combined-card"><div class="invoice-print-only invoice-print-heading"><strong>FUTURUSS</strong></div><h2>Общая накладная</h2><div class="table-wrap"><table>'+head+'<tbody>'+elements['combined-tbody'].children.slice(-49).map(x=>x.innerHTML?'<tr>'+x.innerHTML+'</tr>':'').join('')+'</tbody></table></div></div><div id="results"><div id="invoice-card"><div id="positions-container">'+positions+'</div></div></div></div></body>');
}
console.log('Print values and multiline position comments passed.');
