/* A private draft: invoice totals and autosave change only on Save. */
(function(root){
 'use strict';
 const tr=text=>root.FuturussI18n?.translate(text)||text;
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
 if(typeof module==='object'&&module.exports)module.exports={prepare};
 if(typeof document==='undefined')return;
 let dialog,draft,tbody,total,error,search,hits;
 const el=(tag,text,cls)=>{const n=document.createElement(tag);if(text)n.textContent=tr(text);if(cls)n.className=cls;return n;};
 function button(text,fn,cls){const b=el('button',text,cls);b.type='button';b.onclick=fn;return b;}
 function message(text){error.textContent=text?tr(text):'';}
 function updateTotal(){total.textContent=canPrice()?tr('Сумма')+': '+draft.rows.reduce((s,r)=>s+(Number(r.qty)||0)*(Number(r.price)||0),0).toFixed(2):tr('Цены скрыты');}
 function drawRows(){
  tbody.replaceChildren();
  draft.rows.forEach((row,i)=>{
   const line=el('tr');line.append(el('td',row.art),el('td',row.name));
   const pack=Number(DATA.master[row.art]?.packQty);line.append(el('td',pack>0?String(pack):'—'));
   function inputCell(key,label){const cell=el('td'),input=el('input');input.type='number';input.min=key==='qty'?'0.001':'0';input.step='any';input.value=row[key];input.setAttribute('aria-label',tr(label)+' '+row.art);input.oninput=()=>{row[key]=input.value===''?NaN:Number(input.value);if(key==='price'){row.manualPrice=true;row.manualPriceOwner=freePriceOwner();}amount.textContent=canPrice()?((Number(row.qty)||0)*(Number(row.price)||0)).toFixed(2):'—';updateTotal();};cell.append(input);line.append(cell);}
   inputCell('qty','Количество');if(canPrice())inputCell('price','Цена');else line.append(el('td','—'));
   const amount=el('td',canPrice()?(row.qty*row.price).toFixed(2):'—');line.append(amount);
   const actions=el('td');actions.append(button('Удалить',()=>{draft.rows.splice(i,1);drawRows();},'small'));line.append(actions);tbody.append(line);
  });
  updateTotal();
 }
 function find(){
  hits.replaceChildren();const q=search.value.trim().toLocaleLowerCase();if(!q){hits.hidden=true;return;}
  const matches=Object.entries(DATA.master).filter(([art,a])=>art.toLocaleLowerCase().includes(q)||String(a.name).toLocaleLowerCase().includes(q)).sort(([a],[b])=>(b.toLocaleLowerCase()===q)-(a.toLocaleLowerCase()===q));
  hits.hidden=false;if(!matches.length){hits.append(el('p','Ничего не найдено'));return;}
  for(const [art,a] of matches.slice(0,60)){
   const b=button('',()=>{draft.rows.push({art,name:a.name,qty:1,price:canPrice()?Number(a.price)||0:0});message('');drawRows();search.focus();},'free-modal-match');
   b.append(el('b',art),el('span',a.name));hits.append(b);
  }
 }
 root.openFreeInvoiceEditor=function(){
  if(dialog?.open)return;
  draft={label:document.getElementById('poslabel')?.value.trim()||'',comment:'',rows:[]};
  dialog=el('dialog',null,'free-invoice-modal');dialog.setAttribute('aria-label',tr('Свободная заявка'));
  const head=el('div',null,'free-modal-head');head.append(el('h2','Свободная заявка'));const close=button('Закрыть',()=>dialog.close(),'small');head.append(close);
  const body=el('div',null,'free-modal-body');const name=el('input');name.placeholder=tr('Название позиции');name.setAttribute('aria-label',tr('Название позиции'));name.value=draft.label;name.oninput=()=>{draft.label=name.value;};body.append(name);
  search=el('input');search.type='search';search.placeholder=tr('Поиск по артикулу или названию');search.setAttribute('aria-label',search.placeholder);search.oninput=find;body.append(search);
  hits=el('div',null,'free-modal-hits');hits.hidden=true;body.append(hits);
  const wrap=el('div',null,'free-modal-table-wrap'),table=el('table'),thead=el('thead'),hr=el('tr');for(const title of ['Артикул','Наименование','Шт./кор.','Количество','Цена','Сумма',''])hr.append(el('th',title));thead.append(hr);tbody=el('tbody');table.append(thead,tbody);wrap.append(table);body.append(wrap);
  const comment=el('textarea');comment.placeholder=tr('Комментарий к позиции');comment.setAttribute('aria-label',comment.placeholder);comment.rows=2;comment.oninput=()=>{draft.comment=comment.value;};body.append(comment);
  error=el('p',null,'free-modal-error');error.setAttribute('role','alert');body.append(error);
  const foot=el('div',null,'free-modal-foot');total=el('strong');const save=button('Сохранить',()=>{try{const ready=prepare(draft,DATA.master,canPrice(),freePriceOwner());const pos=addFreePosition(ready);dialog.close();requestAnimationFrame(()=>document.getElementById('add-art-search-'+pos.id)?.closest('.pos-block')?.scrollIntoView({block:'start',behavior:'smooth'}));}catch(e){message(e.message);}},'accent');foot.append(total,button('Отмена',()=>dialog.close()),save);
  dialog.append(head,body,foot);document.body.append(dialog);dialog.addEventListener('close',()=>{dialog.remove();draft=null;});drawRows();dialog.showModal();search.focus();
 };
})(globalThis);
