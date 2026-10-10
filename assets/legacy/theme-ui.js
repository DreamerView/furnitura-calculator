(function(){
'use strict';
// FUTURUSS has one production interface. Apply it before any enhancement runs.
const oldDialog=document.getElementById('interfaceDesignDialog');if(oldDialog)oldDialog.remove();
document.querySelectorAll('.interface-design-open').forEach(node=>node.remove());
const host=document.getElementById('futuruss-extra-options');
if(host&&!host.querySelector('.useful-options-grid')){const grid=document.createElement('div');grid.className='useful-options-grid';host.prepend(grid);for(const [id,title,wide] of [['offsetHandle','Смещённая ручка',true],['microvent','Микровентиляция',false],['lifter','Приподниматель',false],['plsEnabled','Пластины PLS',false],['handleEnabled','Ручка',false],['bprEnabled','Блокиратор поворота · BPR',true]]){const input=document.getElementById(id),label=input?.closest('label');if(!label)continue;label.title=label.textContent.trim();for(const node of [...label.childNodes])if(node!==input)node.remove();const span=document.createElement('span');span.textContent=title;label.append(span);label.classList.add('useful-option');if(wide)label.classList.add('option-wide');grid.append(label);}for(const row of host.querySelectorAll('.row2'))if(!row.children.length)row.remove();}
})();

// Keep the original buttons and handlers, including the asynchronously mounted ERP bridge.
(function(){
 const card=document.getElementById('combined-card');if(!card)return;
 const row=card.querySelector('.btn-row');if(!row)return;
 row.classList.add('document-action-toolbar');row.setAttribute('role','group');row.setAttribute('aria-label','Действия с накладной');
 const print=row.querySelector('[onclick*="print"]'),excel=row.querySelector('[onclick*="exportToExcel"]');
 if(print){print.textContent='Печать / PDF';print.title='Печать накладной или сохранение в PDF';}
 if(excel){excel.textContent='Excel';excel.title='Экспорт накладной в Excel';}
 function arrange(){
  const oneC=document.getElementById('exportInvoice1C'),erp=document.getElementById('erpTransferButton'),panel=document.getElementById('erpTransferPanel');
  if(oneC&&oneC.parentElement!==row){oneC.textContent='В 1С';oneC.title='Выгрузить накладную для 1С';row.append(oneC);}
  if(erp&&erp.parentElement!==row){erp.textContent='В ERP';erp.title='Передать состав накладной в ERP';row.append(erp);}
  if(panel&&panel.parentElement===row)row.after(panel);
 }
 arrange();new MutationObserver(arrange).observe(card,{childList:true,subtree:true});
})();

(function(){
 const row=document.querySelector('.document-action-toolbar'),panel=document.querySelector('.estimate-save-panel');
 const name=document.getElementById('poslabel');
 if(name){name.placeholder='Введите название просчёта';name.setAttribute('aria-label','Название просчёта');document.querySelector('label[for="poslabel"]')?.classList.add('estimate-name-label-hidden');}
 if(!row||!panel||document.getElementById('estimateSaveDialog'))return;
 const dialog=document.createElement('dialog');dialog.id='estimateSaveDialog';dialog.className='estimate-save-dialog';dialog.setAttribute('aria-labelledby','estimateSaveTitle');
 const heading=document.createElement('h2');heading.id='estimateSaveTitle';heading.textContent='Сохранение просчёта';
 const close=document.createElement('button');close.type='button';close.className='estimate-dialog-close';close.textContent='Готово';close.onclick=()=>dialog.close();
 const status=document.createElement('p');status.className='estimate-dialog-status';status.setAttribute('role','status');
 panel.classList.add('open');dialog.append(heading,panel,status,close);document.body.append(dialog);
 const button=document.createElement('button');button.type='button';button.className='estimate-dialog-open';button.textContent='Сохранить';button.title='Сохранить, открыть или выгрузить просчёт';
 button.onclick=()=>{const input=document.getElementById('estimateName');if(input&&!input.value.trim()&&name?.value.trim())input.value=name.value.trim();status.textContent='';dialog.showModal();input?.focus();};row.append(button);
 const msg=document.getElementById('msg');if(msg)new MutationObserver(()=>{if(dialog.open)status.textContent=msg.textContent;}).observe(msg,{childList:true,subtree:true,characterData:true});
})();

(function(){
 const pvc=document.getElementById('futuruss-extra-options'),alu=document.getElementById('aluminumOptions');
 if(!pvc||!alu)return;
 const section=pvc.closest('.design-section');
 // The calculation name belongs to both families, outside the PVC-only controls.
 const name=pvc.querySelector('.estimate-position-name');if(name)section.append(name);
 const hint=[...pvc.children].find(n=>n.classList.contains('hint'));if(hint)section.append(hint);
 pvc.before(alu);
 alu.querySelectorAll('label').forEach(label=>{label.classList.add('alu-option-tile');if(label.textContent.trim().length>27)label.classList.add('option-wide');});
 function sync(){const showAlu=!alu.hidden;if(pvc.hidden!==showAlu)pvc.hidden=showAlu;section.dataset.optionFamily=showAlu?'aluminum':'pvc';}
 new MutationObserver(sync).observe(alu,{attributes:true,attributeFilter:['hidden']});sync();
})();

(function(){
 const preview=document.getElementById('designPreview');if(!preview)return;
 const panel=document.createElement('section');panel.id='constructorAdPreview';panel.className='glass-preview-panel';
 panel.innerHTML='<h3>Реклама</h3><div class="glass-preview-photo"><span>Рекламное фото появится после загрузки комплектации с изображением из конструктора.</span><img alt="Реклама из конструктора" hidden></div>';
 preview.append(panel);
 const img=panel.querySelector('img'),empty=panel.querySelector('span');
 function refreshAd(){const src=typeof getMatrixAdvertisingImage==='function'?getMatrixAdvertisingImage():'';if(src){if(img.getAttribute('src')!==src)img.src=src;img.hidden=false;empty.hidden=true;}else{img.removeAttribute('src');img.hidden=true;empty.hidden=false;}}
 img.onerror=()=>{img.hidden=true;empty.hidden=false;empty.textContent='Не удалось загрузить рекламное изображение.';};
 const old=globalThis.refreshInvoiceAdvertising;if(typeof old==='function')globalThis.refreshInvoiceAdvertising=function(...args){const result=old.apply(this,args);refreshAd();return result;};
 // Imports and profile switches update the existing configuration controls.
 document.getElementById('scheme')?.addEventListener('change',refreshAd);
 const source=document.getElementById('invoiceAdvertising');if(source)new MutationObserver(refreshAd).observe(source,{attributes:true,childList:true,subtree:true});
 refreshAd();
 const tbody=document.getElementById('combined-tbody'),head=document.querySelector('#combined-card .invoice-head');
 if(tbody&&head){const info=document.createElement('div');info.innerHTML='<b>Товарных позиций:</b> <span id="invoiceArticleCount">0</span>';head.prepend(info);const count=document.getElementById('inv-count');if(count?.previousElementSibling)count.previousElementSibling.textContent='Конструкций:';const update=()=>{document.getElementById('invoiceArticleCount').textContent=String(tbody.querySelectorAll('tr.row-item').length);};new MutationObserver(update).observe(tbody,{childList:true});update();}
})();

(function(){
 const body=document.querySelector('.settings-dialog-body'),design=body?.querySelector('.interface-design-open'),upload=document.getElementById('matrixImportButton');
 if(body&&design&&upload){const toolbar=document.createElement('div');toolbar.className='settings-quick-actions';body.prepend(toolbar);design.textContent='◈  Дизайн интерфейса';upload.textContent='↥  Из конструктора';upload.title='Загрузить комплектации из конструктора';upload.setAttribute('aria-label','Загрузить комплектации из конструктора');toolbar.append(design,upload);const box=body.querySelector('.design-upload');box?.querySelector('h2')?.remove();}
 const base=document.getElementById('subtab-articlebase');
 if(base&&!document.getElementById('articleBaseDetails')){const details=document.createElement('details');details.id='articleBaseDetails';const summary=document.createElement('summary');summary.textContent='База артикулов';details.append(summary);base.before(details);details.append(base);details.addEventListener('toggle',()=>{if(details.open&&typeof renderMasterGroups==='function')renderMasterGroups();});}
 const left=document.querySelector('.input-card'),right=document.getElementById('designPreview');
 if(left&&right){const sync=()=>{const height=Math.round(left.getBoundingClientRect().height);if(height>0)right.style.setProperty('--calculator-height',height+'px');};new ResizeObserver(sync).observe(left);sync();}
})();

(function(){
 const host=document.getElementById('positions-container');if(!host)return;
 function polish(){host.querySelectorAll('input[id^="add-art-search-"]').forEach(input=>{input.placeholder='Артикул или название детали';input.setAttribute('aria-label','Найти деталь по артикулу или названию');});}
 new MutationObserver(polish).observe(host,{childList:true});polish();
})();
