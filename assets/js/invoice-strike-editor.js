/* Per-calculation edits only; the source catalogue and other calculations are never written. */
(function(root){
'use strict';
const tr=s=>root.FuturussI18n?.translate(s)||s;
root.openStrikeReplacement=function(posId,index){
 const pos=orderPositions.find(p=>p.id===posId),row=pos?.rows[index],db=root.getInvoiceCatalog?.();
 if(!row||!db)return;
 document.getElementById('strikeReplacementDialog')?.remove();
 const original=row.art,role=row.strikeRole||root.MatrixCore.strikeRole(original);
 const recommended=root.MatrixCore.strikeAlternatives(db,pos,original,role);
 const dialog=document.createElement('dialog');dialog.id='strikeReplacementDialog';dialog.className='spa-modal auth-modal';
 dialog.setAttribute('aria-labelledby','strikeReplacementTitle');
 const head=document.createElement('div');head.className='dialoghead spa-modal-head';const title=document.createElement('h2');title.id='strikeReplacementTitle';title.textContent=tr('Заменить ответную планку');head.append(title);
 const body=document.createElement('div');body.className='spa-modal-body';
 const current=document.createElement('p');current.textContent=pos.label+' · '+original+' · '+row.name;
 const hint=document.createElement('p');hint.textContent=tr('Изменится только эта строка текущего расчёта. Количество сохранится.');
 const label=document.createElement('label');label.textContent=tr('Рекомендованные варианты');
 const select=document.createElement('select');select.add(new Option(tr('Выберите артикул'),''));for(const r of recommended)select.add(new Option(r.art+' · '+db.articles[r.art].name,r.art));label.append(select);
 const manual=document.createElement('label');manual.textContent=tr('Другой артикул из доступного каталога');const input=document.createElement('input');input.value=original;input.setAttribute('list','invoiceStrikeArticles');manual.append(input);
 const list=document.createElement('datalist');list.id='invoiceStrikeArticles';for(const [art,a] of Object.entries(db.articles))if(a.available!==false&&DATA.master[art])list.append(new Option(a.name,art));
 const preview=document.createElement('p');preview.setAttribute('aria-live','polite');const error=document.createElement('p');error.setAttribute('role','alert');
 const foot=document.createElement('div');foot.className='editbottom spa-modal-foot';const cancel=document.createElement('button');cancel.type='button';cancel.className='spa-btn';cancel.textContent=tr('Отмена');cancel.onclick=()=>dialog.close();
 const apply=document.createElement('button');apply.type='button';apply.className='spa-btn primary';apply.textContent=tr('Применить');
 function refresh(){const art=input.value.trim(),a=db.articles[art],priced=DATA.master[art];const valid=!!a&&a.available!==false&&!!priced&&Number.isFinite(priced.price)&&priced.price>=0;apply.disabled=!valid||art===original;error.textContent=valid?'':tr('Артикул недоступен или цена не задана.');preview.textContent=valid?a.name+(root.FUTURUSS_SPA?.state?.catalog?.canViewPrices===false?'':' · '+tr('Сумма')+': '+(row.qty*priced.price).toFixed(2)):'';}
 select.onchange=()=>{if(select.value)input.value=select.value;refresh();};input.oninput=refresh;
 apply.onclick=()=>{refresh();if(apply.disabled)return;const art=input.value.trim();
  if(!recommended.some(r=>r.art===art)&&!confirm(tr('Совместимость этого артикула не подтверждена. Применить ручную замену?')))return;
  if(!orderPositions.includes(pos)||pos.rows[index]!==row||row.art!==original){dialog.close();return;}
  const a=DATA.master[art];Object.assign(row,{art,name:a.name||db.articles[art].name,price:a.price,isDefaultPrice:false,strikeRole:role,manualStrike:true,replacedFrom:original});
  // A frame strike replacement does not alter the sash connections or their PLS count.
  dialog.close();renderOrder();
 };
 const pressureHint=document.createElement('p');pressureHint.className='hint';pressureHint.textContent=tr('В одной серии планок для одного профиля: 35 — сильнее прижим, 40 — средний, 45 — слабее. Проверяйте уплотнение и совместимость.');foot.append(cancel,apply);body.append(current,hint,pressureHint,label,manual,list,preview,error);dialog.append(head,body,foot);document.body.append(dialog);
 const selected=document.querySelector('[data-position-id="'+posId+'"][data-row-index="'+index+'"]');selected?.classList.add('strike-editing');
 dialog.addEventListener('close',()=>{selected?.classList.remove('strike-editing');dialog.remove();},{once:true});refresh();dialog.showModal();select.focus();
};
})(globalThis);
