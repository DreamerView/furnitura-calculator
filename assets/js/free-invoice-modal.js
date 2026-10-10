/* A private draft: invoice totals and autosave change only on Save. */
(function(root){
 'use strict';
 const tr=text=>root.FuturussI18n?.translate(text)||text;

 const categories={drives:'Приводы',scissors:'Ножницы и приводы ножниц',extensions:'Удлинители',corners:'Угловые передачи',strikes:'Ответные планки и зацепы',hinges:'Петли и прижимы',covers:'Накладки',handles:'Ручки',connections:'Соединения и крепёж',extra:'Дополнительные элементы'};
 const clean=s=>String(s??'').normalize('NFKC').toLocaleLowerCase().replace(/ё/g,'\u0435').replace(/[\u200b-\u200d\ufeff]/g,'').replace(/[^\p{L}\p{N}]+/gu,' ').trim();
 const articleKey=s=>clean(s).replace(/[авсекмнорстух]/g,c=>({'\u0430':'a','\u0432':'b','\u0441':'c','\u0435':'e','\u043a':'k','\u043c':'m','\u043d':'h','\u043e':'o','\u0440':'p','\u0442':'t','\u0443':'y','\u0445':'x'})[c]||c).replace(/\s/g,'');
 const stem=s=>s.replace(/^(ножниц|привод|поворот|откид|грибовид|цапф|удлинител|зацеп|планк|петл|накладк|соединител|углов|передач|прижим|ручк|периметрал|шпингалет).*/,'$1');
 function category(art,record={}){
  const n=clean(record.name||record.group||'');
  if(/накладк|декоративн.*колпач|крышк/.test(n)||/^N\./i.test(art))return 'covers';
  if(/^ручк/.test(n))return 'handles';
  if(/зацеп|ответн.*(?:планк|част|элемент)/.test(n))return 'strikes';
  if(/углов.*передач/.test(n))return 'corners';
  if(/удлинител/.test(n))return 'extensions';
  if(/ножниц/.test(n))return 'scissors';
  if(/петл|прижим|кронштейн/.test(n))return 'hinges';
  if(/привод|шпингалет|замок/.test(n))return 'drives';
  if(/пластин|соединител|фиксатор|клипс|винт|шуруп|штифт/.test(n))return 'connections';
  return 'extra';
 }
 function camType(art,record={}){
  const n=clean(record.name),a=String(art).toUpperCase();
  if(/грибовид/.test(n))return 'mushroom';
  if(/(?:цапф[а-я]*|ролик[а-я]*)\s*(?:диаметр\s*)?11\b/.test(n)||/11\s*мм.*цапф/.test(n))return 'roller11';
  if(/(?:цапф[а-я]*|ролик[а-я]*)\s*(?:диаметр\s*)?8\b/.test(n)||/8\s*мм.*цапф/.test(n))return 'roller8';
  if(/^(?:X?PO(?:M|K|Z)?|PP|X?NO|X?PNB|PNF|X?UF|X?UK|X?U)\./.test(a)&&/(?:^|\.)V(?:\.|$)/.test(a))return 'mushroom';
  // Only unambiguous catalogue families; shared parts remain unclassified.
  if(/^(?:XPO|XPOM|XPOK|XPOZ|XNO|XPNB|XUF|XUK)\./.test(a))return 'roller11';
  if(/^(?:PO(?:M|K|Z)?|NO|PNB|PNF|UF|UK)\.\d+-[1-4]/.test(a))return 'roller8';
  return '';
 }
 function searchItems(master,query='',groupId='',cam='',translate=x=>x){
  const q=clean(query),terms=q.split(/\s+/).filter(Boolean).map(stem),exact=articleKey(query);
  return Object.entries(master).filter(([art,a])=>{
   if(groupId&&category(art,a)!==groupId||cam&&camType(art,a)!==(cam==='unspecified'?'':cam))return false;
   const key=articleKey(art),words=clean((a.name||'')+' '+translate(a.name||'')+' '+art).split(' ').map(stem);
   if(/^[a-z]{1,8}\d/.test(exact))return key.includes(exact);
   return !terms.length||key.includes(exact)||terms.every(t=>words.some(w=>w.includes(t))||key.includes(articleKey(t)));
  }).sort(([aa,a],[bb,b])=>Number(articleKey(bb)===exact)-Number(articleKey(aa)===exact)||String(a.name).localeCompare(String(b.name),'ru')||aa.localeCompare(bb));
 }

 const canPrice=()=>root.FUTURUSS_SPA?.state?.catalog?.canViewPrices??root.FUTURUSS_CAN_VIEW_PRICES??false;
 function prepare(draft,master,prices,owner){
  if(!draft.rows.length)throw Error('Добавьте хотя бы один товар.');
  return {...draft,rows:draft.rows.map(row=>{
   const record=master[row.art];if(!record)throw Error('Товар больше недоступен. Выберите другую позицию.');
   if(!Number.isFinite(row.qty)||row.qty<=0)throw Error('Укажите количество больше нуля.');
   const manual=prices&&row.manualPrice&&row.manualPriceOwner===owner;
   const price=prices?(manual?row.price:Number(record.price)||0):0;
   if(!Number.isFinite(price)||price<0)throw Error('Укажите неотрицательную цену.');
   return {art:row.art,name:record.name,qty:row.qty,price,isDefaultPrice:false,...(manual?{manualPrice:true,manualPriceOwner:owner}:{})};
  })};
 }
 if(typeof module==='object'&&module.exports)module.exports={prepare,clean,articleKey,category,camType,searchItems};
 if(typeof document==='undefined')return;
 let dialog,draft,tbody,total,error,search,hits,group,cam,resultStatus,limit=60;
 const el=(tag,text,cls)=>{const n=document.createElement(tag);if(text)n.textContent=tr(text);if(cls)n.className=cls;return n;};
 function button(text,fn,cls){const b=el('button',text,cls);b.type='button';b.onclick=fn;return b;}
 function photoButton(art){const b=button('',()=>root.FuturussPartPhotos.show(art,DATA.master[art]||{}),'free-photo-button');b.innerHTML='<span class="ui-icon i-eye" aria-hidden="true"></span>';b.title=tr('Открыть фото детали');b.setAttribute('aria-label',tr('Открыть фото детали')+' '+art);return b;}
 function message(text){error.textContent=text?tr(text):'';}
 function updateTotal(){total.textContent=canPrice()?tr('Сумма')+': '+draft.rows.reduce((s,r)=>s+(Number(r.qty)||0)*(Number(r.price)||0),0).toFixed(2):tr('Цены скрыты');}
 function drawRows(){
  tbody.replaceChildren();
  draft.rows.forEach((row,i)=>{
   const line=el('tr');line.append(el('td',row.art),el('td',row.name));
   const pack=Number(DATA.master[row.art]?.packQty);
   function inputCell(key,label){const cell=el('td'),input=el('input');input.type='number';input.min=key==='qty'?'0.001':'0';input.step='any';input.value=row[key];input.setAttribute('aria-label',tr(label)+' '+row.art);input.oninput=()=>{row[key]=input.value===''?NaN:Number(input.value);if(key==='price'){row.manualPrice=true;row.manualPriceOwner=freePriceOwner();}amount.textContent=canPrice()?((Number(row.qty)||0)*(Number(row.price)||0)).toFixed(2):'—';updateTotal();};cell.append(input);line.append(cell);}
   inputCell('qty','Количество');if(canPrice())inputCell('price','Цена продажи');else line.append(el('td','—'));
   const amount=el('td',canPrice()?(row.qty*row.price).toFixed(2):'—');line.append(amount,el('td',pack>0?String(pack):'—','invoice-pack-cell'));
   const actions=el('td');actions.append(photoButton(row.art),button('Удалить',()=>{draft.rows.splice(i,1);drawRows();},'small'));line.append(actions);tbody.append(line);
  });
  updateTotal();
 }
 function find(){
  hits.replaceChildren();const matches=searchItems(DATA.master,search.value,group.value,cam.value,tr);
  resultStatus.textContent=tr('Найдено товаров')+': '+matches.length;
  hits.hidden=false;if(!matches.length){hits.append(el('p','Ничего не найдено'));if(group.value||cam.value)hits.append(button('Сбросить фильтры',()=>{group.value=cam.value='';limit=60;find();},'small'));return;}
  for(const [art,a] of matches.slice(0,limit)){
   const row=el('div',null,'free-modal-result'),b=button('',()=>{draft.rows.push({art,name:a.name,qty:1,price:canPrice()?Number(a.price)||0:0});message('');drawRows();search.focus();},'free-modal-match');
   b.append(el('span',art,'free-match-article'),el('span',a.name));row.append(b,photoButton(art));hits.append(row);
  }
  if(matches.length>limit)hits.append(button('Показать ещё',()=>{limit+=60;find();},'small'));
 }
 root.openFreeInvoiceEditor=function(){
  if(dialog?.open)return;
  draft={label:document.getElementById('poslabel')?.value.trim()||'',comment:'',rows:[]};
  dialog=el('dialog',null,'free-invoice-modal');dialog.setAttribute('aria-label',tr('Свободная заявка'));
  const head=el('div',null,'free-modal-head');head.append(el('h2','Свободная заявка'));const close=button('Закрыть',()=>dialog.close(),'small');head.append(close);
  const body=el('div',null,'free-modal-body');const name=el('input');name.placeholder=tr('Название позиции');name.setAttribute('aria-label',tr('Название позиции'));name.value=draft.label;name.oninput=()=>{draft.label=name.value;};
  search=el('input');search.type='search';search.placeholder=tr('Поиск по артикулу или названию');search.setAttribute('aria-label',search.placeholder);search.oninput=()=>{limit=60;find();};const searchLabel=el('label','Найти товар','free-search-label');searchLabel.append(search);body.append(searchLabel);
  const filters=el('div',null,'free-modal-filters');group=el('select');group.setAttribute('aria-label',tr('Группа товаров'));const all=el('option','Все группы');all.value='';group.append(all);
  const present=new Set(Object.entries(DATA.master).map(([art,a])=>category(art,a)));for(const [id,title] of Object.entries(categories))if(present.has(id)){const option=el('option',title);option.value=id;group.append(option);}
  cam=el('select');cam.setAttribute('aria-label',tr('Тип цапфы'));for(const [id,title] of [['','Все типы цапф'],['roller11','Роликовая цапфа 11 мм'],['roller8','Роликовая цапфа 8 мм'],['mushroom','Грибовидная цапфа'],['unspecified','Без цапфы / тип не указан']]){const option=el('option',title);option.value=id;cam.append(option);}
  cam.title=tr('Фильтр по обозначению цапфы в каталоге. Совместимость деталей проверяется при подборе комплекта.');
  group.onchange=cam.onchange=()=>{limit=60;find();};filters.append(group,cam,button('Сбросить фильтры',()=>{group.value=cam.value='';limit=60;find();},'small'));body.append(filters);
  resultStatus=el('small',null,'free-search-status');resultStatus.setAttribute('role','status');body.append(resultStatus);hits=el('div',null,'free-modal-hits');body.append(hits);
  const nameLabel=el('label','Название заявки (необязательно)','free-name-label');name.placeholder=tr('Например: дополнительные товары');nameLabel.append(name);body.append(nameLabel);
  const wrap=el('div',null,'free-modal-table-wrap'),table=el('table'),thead=el('thead'),hr=el('tr');for(const title of ['Артикул','Наименование','Количество','Цена продажи','Сумма','Шт./кор.',''])hr.append(el('th',title));thead.append(hr);tbody=el('tbody');table.append(thead,tbody);wrap.append(table);body.append(wrap);
  const comment=el('textarea');comment.placeholder=tr('Комментарий к позиции');comment.setAttribute('aria-label',comment.placeholder);comment.rows=2;comment.oninput=()=>{draft.comment=comment.value;};body.append(comment);
  error=el('p',null,'free-modal-error');error.setAttribute('role','alert');body.append(error);
  const foot=el('div',null,'free-modal-foot');total=el('strong');const save=button('Сохранить',()=>{try{const ready=prepare(draft,DATA.master,canPrice(),freePriceOwner());const pos=addFreePosition(ready);dialog.close();requestAnimationFrame(()=>document.getElementById('add-art-search-'+pos.id)?.closest('.pos-block')?.scrollIntoView({block:'start',behavior:'smooth'}));}catch(e){message(e.message);}},'accent');foot.append(total,button('Отмена',()=>dialog.close()),save);
  dialog.append(head,body,foot);document.body.append(dialog);dialog.addEventListener('close',()=>{dialog.remove();draft=null;});drawRows();limit=60;find();dialog.showModal();search.focus();
 };
})(globalThis);
