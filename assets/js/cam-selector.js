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
function target(kits,kit,type){if(kit?.family==='aluminum'){if(type==='roller8')return null;if(kit.variant===type)return kit;if(!kit.assemblyGroup)return null;const level=type==='mushroom'?'high':'standard';return assemblyTarget(kits,kit,level);}if(kit?.variant===type)return kit;const candidates=kits.filter(k=>(!k.catalogDraft||k.catalogPrepared)&&matches(k,kit,type));const same=candidates.filter(k=>label(k)===label(kit));const ready=candidates.filter(k=>!k.catalogDraft);return same.length===1?same[0]:ready.length===1?ready[0]:null;}
const levels={standard:'Стандартная сборка',basic:'Базовая взломостойкость',high:'Повышенная взломостойкость'};
function assemblyTarget(kits,kit,level){if(!kit?.assemblyGroup)return null;return kits.find(k=>k.family==='aluminum'&&k.assemblyGroup===kit.assemblyGroup&&k.assemblyLevel===level&&(!k.catalogDraft||k.catalogPrepared))||null;}
function visible(k,current){return k.family!=='aluminum'||!k.assemblyLevel||k.assemblyLevel===(current?.assemblyLevel||'standard');}
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
 const values=kit?.dornmassChoices||[15,25],current=String(kit?.dornmass||15);select.replaceChildren();
 for(const value of values){const option=document.createElement('option');option.value=String(value);const label=value+' мм';option.textContent=root.FuturussI18n?.translate?.(label)||label;select.appendChild(option);}
 select.value=values.map(String).includes(current)?current:String(values[0]);
}
root.FuturussCamSelector={assemblyTarget,visible,levels,configureDornmass,types,openings,opening,label,matches,target,create};
})(globalThis);
