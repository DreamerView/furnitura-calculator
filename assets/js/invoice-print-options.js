/* Print preferences never modify invoice prices or screen columns. */
(function(root){
'use strict';
const scope=document.getElementById('invoicePrintScope'),prices=document.getElementById('invoicePrintPrices');
if(!scope||!prices)return;
let spans=[];
function apply(){
 const value=['summary','positions','both'].includes(scope.value)?scope.value:'summary';
 document.body.classList.toggle('print-positions',value!=='summary');
 document.body.classList.toggle('print-positions-only',value==='positions');
 document.body.classList.toggle('print-without-prices',prices.value==='without');
}
function restore(){for(const [cell,count]of spans)cell.colSpan=count;spans=[];}
function prepare(){
 restore();apply();
 if(prices.value==='without'||document.body.classList.contains('price-hidden'))for(const cell of document.querySelectorAll('#positions-container .invoice-side-heading>td:first-child')){spans.push([cell,cell.colSpan]);cell.colSpan=5;}
}
scope.addEventListener('change',apply);prices.addEventListener('change',apply);
root.addEventListener('beforeprint',prepare);root.addEventListener('afterprint',restore);apply();
})(globalThis);
