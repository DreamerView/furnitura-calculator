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
function node(tag,text,cls){const n=document.createElement(tag);if(text)n.textContent=tr(text);if(cls)n.className=cls;return n;}
function input(label,type='text'){const wrap=node('label'),caption=node('span',label),field=document.createElement('input');field.type=type;wrap.append(caption,field);return {wrap,field};}
function create({width,height,container,getCatalog,getKit,onChange=()=>{}}){
 const box=node('section',null,'frame-dimensions'),toggle=input('Размер по раме','checkbox'),body=node('div',null,'frame-dimensions-body'),select=document.createElement('select'),profileLabel=node('label','Профиль рамы / створки'),w=input('Ширина рамы, мм','number'),h=input('Высота рамы, мм','number'),note=node('small','Одна створка в раме, без импоста, порога и доборов.'),status=node('output'),source=node('a','Источник');
 toggle.wrap.className='frame-mode-toggle';toggle.wrap.prepend(toggle.field);profileLabel.append(select);select.setAttribute('aria-label',tr('Профиль рамы / створки'));w.field.min=h.field.min='1';w.field.step=h.field.step='0.1';source.target='_blank';source.rel='noopener noreferrer';body.append(profileLabel,w.wrap,h.wrap,note,status,source);box.append(toggle.wrap,body);container.append(box);body.hidden=true;
 let signature='',previous=null;
 function profiles(){return getCatalog()?.frameProfiles||[];}
 function sync(){const rows=profiles(),key=JSON.stringify(rows);if(key===signature)return;signature=key;const chosen=select.value;select.replaceChildren(new Option(tr('Выберите профиль'),''));for(const p of rows){const o=new Option(p.name+(p.enabled?'':' · '+tr('Нет подтверждённого вычета')),p.id);o.disabled=!p.enabled;select.append(o);}select.value=rows.some(p=>p.id===chosen&&p.enabled)?chosen:'';}
 function read(){if(!toggle.field.checked)return {width:Number(width.value),height:Number(height.value),frameDimensions:null};sync();return convert(profiles().find(p=>p.id===select.value),w.field.value,h.field.value,getKit());}
 function refresh(){sync();body.hidden=!toggle.field.checked;width.readOnly=height.readOnly=toggle.field.checked;if(!toggle.field.checked)return;const result=read(),p=profiles().find(p=>p.id===select.value);width.value=result.error?'':result.width;height.value=result.error?'':result.height;status.textContent=result.error?tr(result.error):tr(`ШСФ: ${w.field.value} − ${p.widthDeduction} = ${result.width} · ВСФ: ${h.field.value} − ${p.heightDeduction} = ${result.height} мм`);status.classList.toggle('error',!!result.error);note.title=p?.note||'';source.hidden=!/^https?:\/\//i.test(p?.source||'');if(!source.hidden)source.href=p.source;}
 function update(){refresh();for(const target of [width,height])target.dispatchEvent(new Event('input',{bubbles:true}));onChange();}
 toggle.field.onchange=()=>{if(toggle.field.checked){previous=[width.value,height.value];w.field.value=width.value;h.field.value=height.value;}else if(previous){[width.value,height.value]=previous;previous=null;}update();};select.onchange=update;w.field.oninput=h.field.oninput=update;
 return {read,refresh,box};
}
function edit({getCatalog,onSave}){
 const dialog=node('dialog',null,'frame-profiles-dialog'),head=node('div',null,'bom-photo-header'),title=node('h2','Размеры по раме'),close=node('button','Закрыть'),intro=node('p','Вычеты из наружных размеров рамы в ШСФ/ВСФ. Только одностворчатая конструкция без импоста, порога и доборов.'),list=node('div',null,'frame-profile-list'),footer=node('div',null,'frame-profile-footer'),add=node('button','Добавить профиль'),save=node('button','Сохранить'),error=node('p',null,'error');save.className='primary';head.append(title,close);footer.append(add,save);dialog.append(head,intro,list,error,footer);document.body.append(dialog);close.onclick=()=>dialog.close();dialog.onclose=()=>dialog.remove();
 const rows=JSON.parse(JSON.stringify(getCatalog()?.frameProfiles||[]));
 function render(){list.replaceChildren();rows.forEach((r,index)=>{const card=node('div',null,'frame-profile-row'),name=input('Профиль рамы / створки'),dw=input('Вычет ШСФ, мм','number'),dh=input('Вычет ВСФ, мм','number'),url=input('Источник'),note=input('Примечание'),enabled=input('Использовать в калькуляторе','checkbox'),remove=node('button','Удалить');
 for(const [field,key]of [[name,'name'],[dw,'widthDeduction'],[dh,'heightDeduction'],[url,'source'],[note,'note']]){field.field.value=r[key]??'';field.field.oninput=()=>{r[key]=field.field.type==='number'?(field.field.value===''?null:Number(field.field.value)):field.field.value.trim();};}
 dw.field.min=dh.field.min='0';dw.field.max=dh.field.max='1000';dw.field.step=dh.field.step='0.1';name.wrap.className='frame-profile-name';url.wrap.className=note.wrap.className='frame-profile-wide';enabled.field.checked=r.enabled;enabled.field.onchange=()=>r.enabled=enabled.field.checked;remove.onclick=()=>{rows.splice(index,1);render();};const details=node('details',null,'frame-profile-wide'),summary=node('summary','Источник и примечание');details.append(summary,url.wrap,note.wrap);card.append(name.wrap,dw.wrap,dh.wrap,enabled.wrap,remove,details);list.append(card);});}
 add.onclick=()=>{rows.push({id:'custom-'+Date.now()+'-'+Math.random().toString(36).slice(2,7),name:'',widthDeduction:null,heightDeduction:null,enabled:false,source:'',note:''});render();list.lastElementChild.querySelector('input').focus();};
 save.onclick=async()=>{if(rows.some(r=>!r.name||r.name.length>300||r.source&&!/^https?:\/\//i.test(r.source)||['widthDeduction','heightDeduction'].some(k=>r[k]===null?r.enabled:!Number.isFinite(r[k])||r[k]<0||r[k]>1000))){error.textContent=tr('Проверьте название, источник и вычеты. Для включённого профиля нужны оба вычета.');return;}save.disabled=true;try{if(await onSave(rows)!==false)dialog.close();else error.textContent=tr('Не удалось сохранить изменения.');}catch(e){error.textContent=e.message;}finally{save.disabled=false;}};render();dialog.showModal();
}
root.FuturussFrameDimensions={convert,supported,create,edit,errors};
})(globalThis);
