/* History stores additions only; switching estimates clears it. */
(function(root){
'use strict';
function createHistory(){let owner=null,ids=[];function sync(rows){if(owner!==rows){owner=rows;ids=[];}ids=ids.filter(id=>rows.some(p=>p.id===id));}
return {record(rows,newIds){sync(rows);ids.push(...newIds);ids=ids.slice(-50);},canUndo(rows){sync(rows);return ids.length>0;},undo(rows){sync(rows);const id=ids.pop(),index=rows.findIndex(p=>p.id===id);if(index<0)return false;rows.splice(index,1);return true;}};}
root.FuturussInvoiceUndo={createHistory};
if(typeof document==='undefined')return;
const save=document.querySelector('.estimate-dialog-open');if(!save)return;
const history=createHistory(),button=document.createElement('button');button.type='button';button.className='ghost invoice-undo';button.textContent='Отменить последнее добавление';save.after(button);
function refresh(){button.disabled=!history.canUndo(orderPositions);}
function wrap(fn){return function(...args){const rows=orderPositions,before=new Set(rows.map(p=>p.id));const result=fn.apply(this,args);if(rows===orderPositions)history.record(rows,rows.filter(p=>!before.has(p.id)).map(p=>p.id));refresh();return result;};}
addPosition=wrap(addPosition);addFreePosition=wrap(addFreePosition);
const originalRender=renderOrder;renderOrder=function(...args){const result=originalRender.apply(this,args);refresh();return result;};
button.onclick=()=>{if(history.undo(orderPositions))renderOrder();refresh();};refresh();
})(globalThis);
