/* Catalogue references are alternatives, never automatically accumulated as a BOM. */
(function(root){
'use strict';
const t=s=>root.FuturussI18n?.translate?.(s)||s;
function node(tag,text,cls){const n=document.createElement(tag);if(text)n.textContent=t(text);if(cls)n.className=cls;return n;}
function create({getLibrary,select,onChange,button,reference}){
 const dialog=node('dialog',null,'picker-dialog'),head=node('div',null,'dialoghead'),title=node('h2','Комплектации каталога'),close=node('button','Закрыть');head.append(title,close);dialog.append(head);
 const bar=node('div',null,'searchbar'),search=node('input'),type=node('select');search.placeholder=t('Поиск схемы или артикула');search.setAttribute('aria-label',t('Поиск схемы или артикула'));
 for(const [value,label]of [['','Все цапфы'],['roller11','Цапфа 11 мм'],['roller8','Цапфа 8 мм'],['mushroom','Грибовидная цапфа']]){const o=node('option',label);o.value=value;type.append(o);}bar.append(search,type);dialog.append(bar);
 const status=node('p',null,'warn');status.textContent=t('Перечни содержат альтернативы. Они не являются готовыми накладными.');dialog.append(status);
 const scroll=node('div',null,'pickscroll'),table=node('table',null,'picktable'),tbody=node('tbody');table.append(tbody);scroll.append(table);dialog.append(scroll);document.body.append(dialog);
 close.onclick=()=>dialog.close();
 function renderList(){
  tbody.replaceChildren();const db=getLibrary(),q=search.value.trim().toLocaleLowerCase();
  for(const s of db?.catalogSchemes||[]){if(type.value&&s.variant!==type.value)continue;if(q&&!(s.section+' '+s.title+' '+s.articles.join(' ')).toLocaleLowerCase().includes(q))continue;
   const k=db.kits.find(k=>k.id===s.kitId),tr=node('tr'),code=node('td',s.section),name=node('td'),state=node('td',k?.catalogPrepared?'Требует проверки узлов':k?.catalogDraft?'Требует настройки':'Есть расчётный вариант'),action=node('td'),open=node('button','Открыть');
   name.append(node('b',s.title),node('div',(root.MatrixCore?.variants?.[s.variant]||s.variant)+' · '+s.pages.join('–')));open.disabled=!k;open.onclick=()=>{select(k.id);dialog.close();};action.append(open);tr.append(code,name,state,action);tbody.append(tr);
  }
 }
 search.oninput=renderList;type.onchange=renderList;button.onclick=()=>{search.value='';renderList();dialog.showModal();search.focus();};
 function refresh(k){
  const db=getLibrary(),source=(db?.catalogSchemes||[]).find(s=>s.kitId===k.id);reference.replaceChildren();reference.hidden=!source;if(!source)return;
  reference.append(node('h3',source.section+' · '+source.title));
  const a=node('a','Схема в каталоге');a.href='https://futuruss.ru/docs/futuruss-catalog-pvc-2026-07.pdf#page='+source.pdfPage;a.target='_blank';a.rel='noopener noreferrer';reference.append(a);
  if(!k.catalogDraft){reference.append(node('p','Реализован один вариант схемы. Другие варианты требуют отдельной настройки.','hint'));return;}
  reference.append(node('p','Схема каталога ещё не настроена для автоматического расчёта.','warn'),node('p',k.note,'hint'));
  if(k.catalogPrepared){
   reference.append(node('h3','Узлы для проверки'));const list=node('ul');for(const text of k.verificationRequired||[])list.append(node('li',text));reference.append(list);
   for(const group of k.catalogGroups||[]){const block=node('details'),heading=node('summary',group.title),table=node('table',null,'picktable');block.append(heading,table);for(const art of group.articles){const a=db.articles[art];if(!a)continue;const row=node('tr');row.append(node('td',art),node('td',a.name));table.append(row);}reference.append(block);}
   return;
  }
  const details=node('details'),summary=node('summary','Доступные артикулы схемы — альтернативы'),parts=node('table',null,'picktable');details.append(summary,parts);
  for(const art of source.articles){const record=db.articles[art];if(!record)continue;const row=node('tr');row.append(node('td',art),node('td',record.name),node('td',record.group||''));parts.append(row);}
  reference.append(details);
 }
 return {refresh};
}
root.FuturussCatalogSchemes={create};
})(globalThis);
