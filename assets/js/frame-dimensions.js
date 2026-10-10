/* Outside frame dimensions are an input mode, not a hardware groove or installation depth. */
(function(root){
'use strict';
const tr=s=>root.FuturussI18n?.translate?.(s)||s;
const errors={profile:'Выберите профиль с заполненными вычетами.',size:'Размер рамы должен быть больше вычета.',scope:'Размер по раме доступен для одностворчатого окна ПВХ без импоста, порога и доборов. Для этой комплектации введите ШСФ/ВСФ.'};
function supported(kit){return !!kit&&kit.family!=='aluminum'&&['turn','tilt-turn','tilt-first','fanlight'].includes(kit.openingType||'tilt-turn')&&!/stulp|sliding|door/i.test(kit.id||'');}
function convert(profile,width,height,kit){
 if(!supported(kit))return {error:errors.scope};
 if(!profile?.enabled||!['widthDeduction','heightDeduction'].every(k=>typeof profile[k]==='number'&&Number.isFinite(profile[k])&&profile[k]>=0&&profile[k]<=1000))return {error:errors.profile};
 const w=Number(width),h=Number(height),outW=Math.round((w-profile.widthDeduction)*100)/100,outH=Math.round((h-profile.heightDeduction)*100)/100;
 if(!Number.isFinite(w)||!Number.isFinite(h)||outW<=0||outH<=0)return {error:errors.size};
 return {width:outW,height:outH,frameDimensions:{width:w,height:h,profile:{...profile},scope:'single-sash-frame'}};
}
// Groups are a view over stable profile records: existing calculations retain their IDs and snapshots.
function groupProfiles(rows){
 const map=new Map();for(const row of rows){const key=JSON.stringify([row.widthDeduction??null,row.heightDeduction??null,!!row.enabled]);if(!map.has(key))map.set(key,{widthDeduction:row.widthDeduction??null,heightDeduction:row.heightDeduction??null,enabled:!!row.enabled,profiles:[],...('groupNote' in row?{groupNote:row.groupNote}:{}),...('groupSource' in row?{groupSource:row.groupSource}:{})});map.get(key).profiles.push({...row});}
 return [...map.values()].sort((a,b)=>(a.widthDeduction??Infinity)-(b.widthDeduction??Infinity)||(a.heightDeduction??Infinity)-(b.heightDeduction??Infinity)||Number(b.enabled)-Number(a.enabled));
}
function flattenGroups(groups){return groups.flatMap(g=>g.profiles.map(p=>({...p,widthDeduction:g.widthDeduction,heightDeduction:g.heightDeduction,enabled:g.enabled,...('groupNote' in g?{groupNote:g.groupNote}:{}),...('groupSource' in g?{groupSource:g.groupSource}:{})})));}
function groupLabel(g){return g.widthDeduction===null||g.heightDeduction===null?tr('Нет подтверждённого вычета'):tr('Вычет Ш / В, мм')+': '+g.widthDeduction+' / '+g.heightDeduction+(g.enabled?'':' · '+tr('Отключено'));}
function node(tag,text,cls){const n=document.createElement(tag);if(text)n.textContent=tr(text);if(cls)n.className=cls;return n;}
function input(label,type='text'){const wrap=node('label'),caption=node('span',label),field=document.createElement('input');field.type=type;wrap.append(caption,field);return {wrap,field};}
function create({width,height,container,getCatalog,getKit,onChange=()=>{}}){
 const box=node('section',null,'frame-dimensions'),toggle=input('Размер по раме','checkbox'),body=node('div',null,'frame-dimensions-body'),select=document.createElement('select'),profileLabel=node('label','Профиль рамы / створки'),w=input('Ширина рамы, мм','number'),h=input('Высота рамы, мм','number'),note=node('small','Одна створка в раме, без импоста, порога и доборов.'),status=node('output'),source=node('a','Источник');
 toggle.wrap.className='frame-mode-toggle';toggle.wrap.prepend(toggle.field);profileLabel.append(select);select.setAttribute('aria-label',tr('Профиль рамы / створки'));w.field.min=h.field.min='1';w.field.step=h.field.step='0.1';source.target='_blank';source.rel='noopener noreferrer';body.append(profileLabel,w.wrap,h.wrap,note,status,source);box.append(toggle.wrap,body);container.append(box);body.hidden=true;
 let signature='',previous=null;
 function profiles(){return getCatalog()?.frameProfiles||[];}
 function sync(){const rows=profiles(),key=JSON.stringify(rows);if(key===signature)return;signature=key;const chosen=select.value;select.replaceChildren(new Option(tr('Выберите профиль'),''));for(const g of groupProfiles(rows)){const opt=document.createElement('optgroup');opt.label=groupLabel(g);for(const p of g.profiles){const o=new Option(p.name,p.id);o.disabled=!p.enabled;opt.append(o);}select.append(opt);}select.value=rows.some(p=>p.id===chosen&&p.enabled)?chosen:'';}
 function read(){if(!toggle.field.checked)return {width:Number(width.value),height:Number(height.value),frameDimensions:null};sync();return convert(profiles().find(p=>p.id===select.value),w.field.value,h.field.value,getKit());}
 function refresh(){sync();body.hidden=!toggle.field.checked;width.readOnly=height.readOnly=toggle.field.checked;if(!toggle.field.checked)return;const result=read(),p=profiles().find(p=>p.id===select.value);width.value=result.error?'':result.width;height.value=result.error?'':result.height;status.textContent=result.error?tr(result.error):tr(`ШСФ: ${w.field.value} − ${p.widthDeduction} = ${result.width} · ВСФ: ${h.field.value} − ${p.heightDeduction} = ${result.height} мм`);status.classList.toggle('error',!!result.error);note.title=p?.groupNote??p?.note??'';const url=p?.groupSource??p?.source??'';source.hidden=!/^https?:\/\//i.test(url);if(!source.hidden)source.href=url;}
 function update(){refresh();for(const target of [width,height])target.dispatchEvent(new Event('input',{bubbles:true}));onChange();}
 toggle.field.onchange=()=>{if(toggle.field.checked){previous=[width.value,height.value];w.field.value=width.value;h.field.value=height.value;}else if(previous){[width.value,height.value]=previous;previous=null;}update();};select.onchange=update;w.field.oninput=h.field.oninput=update;
 return {read,refresh,box};
}
function edit({getCatalog,onSave}){
 const dialog=node('dialog',null,'frame-profiles-dialog'),head=node('div',null,'bom-photo-header'),title=node('h2','Размеры по раме'),close=node('button','Закрыть'),intro=node('p','Одинаковые вычеты — одна группа. Изменение вычетов применяется ко всем профилям группы.'),scope=node('small','Одна створка в раме, без импоста, порога и доборов.'),list=node('div',null,'frame-profile-list'),footer=node('div',null,'frame-profile-footer'),add=node('button','Добавить правило'),save=node('button','Сохранить'),error=node('p',null,'error');save.className='primary';head.append(title,close);footer.append(add,save);dialog.append(head,intro,scope,list,error,footer);document.body.append(dialog);close.onclick=()=>dialog.close();dialog.onclose=()=>dialog.remove();
 const groups=groupProfiles(getCatalog()?.frameProfiles||[]);
 const blank=()=>({id:'custom-'+Date.now()+'-'+Math.random().toString(36).slice(2,8),name:'',source:'',note:''});
 function refreshLabels(){for(const select of list.querySelectorAll('.frame-rule-member select'))groups.forEach((g,i)=>select.options[i].textContent=groupLabel(g));}
 function render(){list.replaceChildren();groups.forEach((g,index)=>{
  const card=node('section',null,'frame-rule'),bar=node('div',null,'frame-rule-header'),dw=input('Вычет ШСФ, мм','number'),dh=input('Вычет ВСФ, мм','number'),enabled=input('Использовать в калькуляторе','checkbox'),remove=node('button','Удалить правило');
  for(const [f,k] of [[dw,'widthDeduction'],[dh,'heightDeduction']]){f.field.value=g[k]??'';f.field.min='0';f.field.max='1000';f.field.step='0.1';f.field.oninput=()=>{g[k]=f.field.value===''?null:Number(f.field.value);refreshLabels();};}
  enabled.field.checked=g.enabled;enabled.field.onchange=()=>{g.enabled=enabled.field.checked;refreshLabels();};remove.onclick=()=>{groups.splice(index,1);render();};bar.append(dw.wrap,dh.wrap,enabled.wrap,remove);
  const names=node('ul',null,'frame-rule-profiles'),details=node('details',null,'frame-rule-editor'),summary=node('summary','Редактировать профили'),addProfile=node('button','Добавить профиль');
  for(const p of g.profiles)names.append(node('li',p.name||'Новый профиль'));
  const groupNote=input('Примечание к группе (необязательно)'),groupSource=input('Источник группы (необязательно)');
  for(const [f,k] of [[groupNote,'groupNote'],[groupSource,'groupSource']]){f.field.value=g[k]||'';f.field.oninput=()=>g[k]=f.field.value.trim();}
  details.append(summary,groupNote.wrap,groupSource.wrap);
  g.profiles.forEach((p,pi)=>{
   const row=node('div',null,'frame-rule-member'),name=input('Профиль рамы / створки'),del=node('button','Удалить'),move=node('label','Правило вычета'),select=document.createElement('select');
   for(const [f,k]of [[name,'name']]){f.field.value=p[k]||'';f.field.oninput=()=>{p[k]=f.field.value.trim();if(k==='name')names.children[pi].textContent=p.name||tr('Новый профиль');};}
   groups.forEach((other,oi)=>select.append(new Option(groupLabel(other),String(oi))));select.value=String(index);select.onchange=()=>{const target=groups[Number(select.value)];if(target!==g){g.profiles.splice(pi,1);target.profiles.push(p);render();}};move.append(select);del.onclick=()=>{g.profiles.splice(pi,1);render();};name.wrap.className='frame-member-name';row.append(name.wrap,move,del);details.append(row);
  });
  addProfile.onclick=()=>{g.profiles.push(blank());render();const d=list.children[index].querySelector('details');d.open=true;d.querySelectorAll('.frame-member-name input')[g.profiles.length-1].focus();};details.append(addProfile);if(g.widthDeduction===null||g.heightDeduction===null)card.append(node('p','Нет подтверждённого вычета','frame-rule-pending'));card.append(bar,names,details);list.append(card);
 });}
 add.onclick=()=>{groups.push({widthDeduction:null,heightDeduction:null,enabled:false,profiles:[blank()]});render();list.lastElementChild.querySelector('details').open=true;list.lastElementChild.querySelector('input').focus();};
 save.onclick=async()=>{const rows=flattenGroups(groups);if(rows.length>500||rows.some(r=>!r.name||r.name.length>300||r.source&&!/^https?:\/\//i.test(r.source)||r.groupSource&&!/^https?:\/\//i.test(r.groupSource)||['groupNote','groupSource'].some(k=>(r[k]||'').length>1500)||['widthDeduction','heightDeduction'].some(k=>r[k]===null?r.enabled:!Number.isFinite(r[k])||r[k]<0||r[k]>1000))){error.textContent=tr('Проверьте название, источник и вычеты. Для включённого профиля нужны оба вычета.');return;}save.disabled=true;try{if(await onSave(rows)!==false)dialog.close();else error.textContent=tr('Не удалось сохранить изменения.');}catch(e){error.textContent=e.message;}finally{save.disabled=false;}};render();dialog.showModal();
}
root.FuturussFrameDimensions={convert,supported,create,edit,errors,groupProfiles,flattenGroups};
})(globalThis);
