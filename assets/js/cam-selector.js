/* Image-only cam controls; kit IDs, custom variants and stored BOMs are untouched. */
(function(root){
'use strict';
const types=['roller11','roller8','mushroom'];
const names={roller11:'Роликовая цапфа 11 мм',roller8:'Роликовая цапфа 8 мм',mushroom:'Грибовидная цапфа'};
const openings={turn:'Поворотная',fanlight:'Фрамужная','tilt-turn':'Поворотно-откидная','stulp-bolts':'Штульповая — шпингалеты','stulp-drive':'Штульповая — привод',door:'Дверная система',sliding:'Раздвижная / портальная','tilt-first':'Откидно-поворотная'};
const opening=k=>k?.openingType||'tilt-turn';
function label(k){
 if(k.family==='aluminum')return k.assemblyLabel||k.name;
 if(k.id===k.variant&&types.includes(k.variant))return openings['tilt-turn'];
 return String(k.name).replace(/\s*[·—–-]?\s*(?:с\s+)?(?:роликовой\s+)?цапф(?:ой|а)\s*(?:11|8)\s*мм/gi,'').replace(/\s*[·—–-]?\s*(?:с\s+)?грибовидн(?:ой|ая)\s+цапф(?:ой|а)/gi,'').trim()||openings[opening(k)]||k.name;
}
function matches(k,current,type){return (k.family||'pvc')===(current.family||'pvc')&&opening(k)===opening(current)&&k.variant===type&&(k.handle||'center')===(current.handle||'center')&&((k.dornmass||15)===(current.dornmass||15)||(k.dornmassChoices||[]).includes(current.dornmass||15))&&(k.profile||'')===(current.profile||'');}
function target(kits,kit,type){if(kit?.family==='aluminum'){if(type==='roller8')return null;if(kit.variant===type)return kit;if(!kit.assemblyGroup)return null;const level=type==='mushroom'?'high':'standard';return assemblyTarget(kits,kit,level);}if(kit?.variant===type)return kit;if(kit?.openingType==='door')return kits.find(k=>k.openingType==='door'&&k.variant===type&&k.id.endsWith('-latch')===kit.id.endsWith('-latch'))||null;const candidates=kits.filter(k=>(!k.catalogDraft||k.catalogPrepared)&&matches(k,kit,type));const same=candidates.filter(k=>label(k)===label(kit));const ready=candidates.filter(k=>!k.catalogDraft);return same.length===1?same[0]:ready.length===1?ready[0]:null;}
const levels={standard:'Стандартная сборка',basic:'Базовая взломостойкость',high:'Повышенная взломостойкость'};
function assemblyTarget(kits,kit,level){if(!kit?.assemblyGroup)return null;return kits.find(k=>k.family==='aluminum'&&k.assemblyGroup===kit.assemblyGroup&&k.assemblyLevel===level&&(!k.catalogDraft||k.catalogPrepared))||null;}
function visible(k,current){return k.family!=='aluminum'||!k.assemblyLevel||k.assemblyLevel===(current?.assemblyLevel||'standard');}
const optionSections=new Set([2,3,4,5,7,8,10,17,18,19,20,21,23,24,28,34,35,37,38,39,40,42,44,45,46,47,48,53,54]);
function calculatorVisible(k,current){const section=String(k.id).match(/^catalog-pvc-7-(\d+)$/);return visible(k,current)&&!(section&&optionSections.has(Number(section[1])))&&k.assemblyGroup!=='tilt-d25'&&!(k.openingType==='door'&&k.id.endsWith('-latch'));}
function calculatorLabel(kit){return kit.openingType==='door'?'Дверная система':label(kit);}
function calculatorKit(kits,kit,dornmass,settings={}){
 if(kit?.family!=='aluminum'&&kit?.openingType==='door'&&settings.doorBolt===false)return kits.find(k=>k.openingType==='door'&&k.variant===kit.variant&&k.id.endsWith('-latch'))||kit;
 if(kit?.family!=='aluminum'&&opening(kit)==='tilt-turn'&&kit.variant==='roller11'&&['motor','mgn'].includes(settings.specialMode))return kits.find(k=>k.id==='catalog-pvc-7-'+(settings.specialMode==='motor'?'53':'54'))||kit;if(kit?.family==='aluminum'&&kit.assemblyGroup==='tilt'&&Number(dornmass)===25)return kits.find(k=>k.assemblyGroup==='tilt-d25'&&k.assemblyLevel===kit.assemblyLevel)||kit;return kit;}
function create(container,getContext,onSelect){
 const box=document.createElement('span');box.className='cam-selectors';box.setAttribute('role','group');box.setAttribute('aria-label','Тип цапфы');
 for(const type of types){const b=document.createElement('button');b.type='button';b.dataset.cam=type;b.className='cam-selector';const img=document.createElement('span');img.className='cam-photo';img.setAttribute('aria-hidden','true');b.append(img);b.onclick=()=>{const {kits,kit}=getContext();const next=kit&&target(kits,kit,type);if(next)onSelect(next);};box.append(b);}
 container.append(box);
 const assembly=document.createElement('label');assembly.className='alu-assembly-select';assembly.hidden=true;const select=document.createElement('select');select.setAttribute('aria-label','Вариант сборки');assembly.append(select);container.after(assembly);
 select.onchange=()=>{const {kits,kit}=getContext();const next=assemblyTarget(kits,kit,select.value);if(next)onSelect(next);};
 function refresh(){const {kits,kit}=getContext();box.hidden=!kit;assembly.hidden=kit?.family!=='aluminum'||!kit?.assemblyGroup;select.replaceChildren();
 for(const [level,name]of Object.entries(levels)){const o=document.createElement('option');o.value=level;o.textContent=root.FuturussI18n?.translate?.(name)||name;o.disabled=!assemblyTarget(kits,kit,level);select.append(o);}select.value=kit?.assemblyLevel||'standard';for(const b of box.children){const type=b.dataset.cam,available=kit&&target(kits,kit,type);b.disabled=!available;b.setAttribute('aria-pressed',String(kit?.variant===type));const title=names[type]+(available?'':' — Для этого открывания нет комплектации');b.title=root.FuturussI18n?.translate?.(title)||title;b.setAttribute('aria-label',b.title);}}
 return {refresh};
}
function configureDornmass(select,kit){
 const values=kit?.family==='aluminum'&&kit.assemblyGroup==='tilt'?[15,25]:kit?.dornmassChoices||((kit?.family||'pvc')==='pvc'&&['tilt-turn'].includes(opening(kit))?[7.5,15,25]:[15,25]),current=String(kit?.dornmass||15);select.replaceChildren();
 for(const value of values){const option=document.createElement('option');option.value=String(value);const label=String(value).replace('.',',')+' мм';option.textContent=root.FuturussI18n?.translate?.(label)||label;select.appendChild(option);}
 select.value=values.map(String).includes(current)?current:String(values[0]);
 select.dataset.confirmedDornmass=select.value;
 if(!select.dataset.dornmassGuard){select.dataset.dornmassGuard='1';select.addEventListener('change',event=>{
  const next=select.value,previous=select.dataset.confirmedDornmass||'15';
  const tr=text=>root.FuturussI18n?.translate?.(text)||text;
  if(next!==previous&&next!=='15'){
   select.value=previous;event.stopImmediatePropagation();
   const dialog=document.createElement('dialog');dialog.className='dornmass-confirm';dialog.setAttribute('aria-label',tr('Дорнмасс'));
   const text=document.createElement('p');text.textContent=tr('Обычно используется дорнмасс 15 мм. Подтвердите выбранный размер:')+' '+next.replace('.',',')+' '+tr('мм');
   const actions=document.createElement('div'),cancel=document.createElement('button'),accept=document.createElement('button');cancel.type=accept.type='button';cancel.textContent=tr('Отмена');accept.textContent=tr('Подтвердить');accept.className='accent';actions.append(cancel,accept);dialog.append(text,actions);
   cancel.onclick=()=>dialog.close();accept.onclick=()=>{dialog.close();if(!select.isConnected)return;select.value=next;select.dataset.confirmedDornmass=next;select.dispatchEvent(new Event('change',{bubbles:true}));};
   dialog.addEventListener('close',()=>{dialog.remove();select.focus();});document.body.append(dialog);dialog.showModal();cancel.focus();return;
  }
  select.dataset.confirmedDornmass=next;
 },true);}

}
root.FuturussCamSelector={calculatorLabel,calculatorVisible,calculatorKit,assemblyTarget,visible,levels,configureDornmass,types,openings,opening,label,matches,target,create};
})(globalThis);
