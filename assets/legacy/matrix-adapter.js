/* Load exact version-2 table kits into the original UPT invoice application. */
(function(){
  'use strict';
  const PREFIX='matrix-import::';
  globalThis.getInvoiceCatalog=()=>imported;
  let imported=null,choiceKey='',options=[],grooveTouched=false,activeFamily='pvc',activeCam='roller11';
  const el=id=>document.getElementById(id),num=id=>{const s=el(id).value;return s.trim()===''?null:Number(s);};
  const kitFamily=kit=>kit?.family==='aluminum'?'aluminum':'pvc';
  function paintCoverSelect(){const select=el('coverColor');globalThis.FuturussHardwareColors?.paint(select,select?.value||'white');}
  const handleColorButtons={white:'handleColorWhite',black:'handleColorBlack',brown:'handleColorBrown',anthracite:'handleColorAnthracite'};
  const retiredAluminumKits=new Set(['alu-tilt-d25-security','alu-tilt-d25-high']);
  function paintHandleColors(){const selected=el('handleColor').value||'white';globalThis.FuturussHardwareColors?.paint(el('handleArticle'),selected);for(const [color,id] of Object.entries(handleColorButtons))el(id).setAttribute?.('aria-pressed',String(color===selected));}
  function chooseGroove(kit){const select=el('grooveType');if(!select||kitFamily(kit)==='aluminum')return;if(kit?.sizeRecipeMode&&Object.prototype.hasOwnProperty.call(MatrixCore.tiltFirstWorkbookProfiles,select.value))return;const wanted=kit?.strikeProfile||kit?.profile||(!grooveTouched?'13':'');if(!wanted)return;const choices=Array.from(select.options||select.children||[]),needle=String(wanted).toLowerCase();const match=choices.find(option=>String(option.value||'').toLowerCase()===needle||String(option.textContent||'').toLowerCase().includes(needle));if(match)select.value=match.value;}
  function toggleHingeChoice(){const pvc=currentProfileId==='futuruss'&&kitFamily(selectedKit())==='pvc',wide=pvc&&!['turn','fanlight','door'].includes(selectedKit()?.openingType)&&num('width')>650;el('hingeTypeWrap').hidden=!wide;if(!wide)el('hingeType').value='standard';}
  function selectedKit(){const value=el('scheme').value;if(value.startsWith(PREFIX))return FuturussCamSelector.calculatorKit(imported?.kits||[],imported?.kits.find(k=>k.id===value.slice(PREFIX.length)),num('dornmass'),{doorBolt:document.querySelector('[data-tech=doorBolt]')?.checked!==false,specialMode:document.querySelector('[data-tech=specialMode]')?.value||'none'});if(currentProfileId!=='futuruss'&&value&&(DATA.schemes?.[value]||DATA.rules?.[value]))return {id:'profile::'+value,name:globalThis.SCHEME_TITLES?.[value]||value,variant:'roller11',family:'pvc',profile:'',side:'R',handle:'center',common:[],options:{}};return null;}
  globalThis.getMatrixFamily=()=>activeFamily;
  globalThis.getMatrixAdvertisingMedia=()=>{if(Array.isArray(imported?.advertisingMedia))return imported.advertisingMedia;const old=imported?.advertisingImages||[imported?.advertisingImage];return(Array.isArray(old)?old:[old]).filter(Boolean).map(src=>({type:'image',src,name:''}));};
  globalThis.getMatrixAdvertisingImage=()=>{if(Array.isArray(imported?.advertisingMedia))return imported.advertisingMedia.find(m=>m.type==='image')?.src||'';const images=imported?.advertisingImages;return (Array.isArray(images)?images[0]:images)||imported?.advertisingImage||'';};
  globalThis.getPhotos=art=>{const info=DATA?.master?.[art];if(!info)return [];if(!Array.isArray(info.photos))info.photos=info.photo?[info.photo]:[];delete info.photo;return info.photos;};
  function info(message,error=false){const box=el('matrixImportMessage');box.textContent=message;box.style.color=error?'#a33425':'#526f7e';}
  function normalizeCentralSeed(seed){if(!seed)return null;return Array.isArray(seed.kits)?MatrixCore.copy(seed):MatrixCore.initial(seed);}
  function bundledLibrary(){try{return typeof FUTURUSS_SEED!=='undefined'?normalizeCentralSeed(FUTURUSS_SEED):null;}catch{return null;}}
  function upgradeLibrary(data){
    const bundled=bundledLibrary();if(!bundled)return data;
    data.articles={...MatrixCore.copy(bundled.articles),...(data.articles||{})};
    data.kits=(data.kits||[]).filter(kit=>!retiredAluminumKits.has(kit.id));
    const ids=new Set(data.kits.map(kit=>kit.id));
    for(const kit of bundled.kits)if(!ids.has(kit.id))data.kits.push(MatrixCore.copy(kit));
    data.nomenclatureVersion=bundled.nomenclatureVersion;
    return data;
  }
  function syncMaster(data){
    if(!data||currentProfileId!=='futuruss'||typeof DATA==='undefined')return 0;
    const existing=DATA.master||{},photoSources=value=>(Array.isArray(value)?value:[]).map(photo=>typeof photo==='string'?photo:photo?.src).filter(Boolean);
    DATA.master={};DATA.groups={};DATA.group_order=[];
    let count=0;
    for(const [art,record] of Object.entries(data.articles)){
      if(record.available===false)continue;
      const previous=existing[art]||{},group=record.group||previous.group||'Из конструктора',photos=[...new Set(photoSources(record.photos))];
      DATA.master[art]={...previous,name:record.name||previous.name||art,packQty:record.packQty??null,price:Number.isFinite(record.price)?record.price:0,section:record.section||previous.section||'',group,subgroups:Array.isArray(record.subgroups)?record.subgroups.slice():Array.isArray(previous.subgroups)?previous.subgroups.slice():[],photos};delete DATA.master[art].photo;
      DATA.groups[art]=group;if(!DATA.group_order.includes(group))DATA.group_order.push(group);count++;
    }
    if(typeof renderMasterGroups==='function')renderMasterGroups();
    return count;
  }
  const technologyControls=FuturussTechnologyUI.create({container:el('futuruss-extra-options'),preferences:true,onChange:()=>{refreshChoices();camControl?.refresh();},getContext:()=>({db:imported,kit:currentProfileId==='futuruss'?imported?.kits.find(k=>PREFIX+k.id===el('scheme').value):null,params:{width:num('width'),height:num('height'),dornmass:num('dornmass')||15,hingeType:el('hingeType').value||'standard',handle:el('offsetHandle').checked?'offset':'center',strikeProfile:el('grooveType').value||'KBE 13',optionSeries:grooveSeries(el('grooveType').value||'13')}})});
  const camControl=globalThis.FuturussCamSelector?.create(el('matrixFamilyTabs'),()=>({kits:imported?.kits||[],kit:selectedKit()}),kit=>{const d=el('dornmass').value,doorBolt=document.querySelector('[data-tech=doorBolt]')?.checked;activeCam=kit.variant;let base=kit.assemblyGroup==='tilt-d25'?imported.kits.find(k=>k.assemblyGroup==='tilt'&&k.assemblyLevel===kit.assemblyLevel)||kit:kit;if(base.openingType==='door'&&base.id.endsWith('-latch'))base=imported.kits.find(k=>k.openingType==='door'&&k.variant===base.variant&&!k.id.endsWith('-latch'))||base;populate(PREFIX+base.id);if(Array.from(el('dornmass').options).some(o=>o.value===d))el('dornmass').value=d;if(base.openingType==='door'&&typeof doorBolt==='boolean')document.querySelector('[data-tech=doorBolt]').checked=doorBolt;el('dornmass').dataset.confirmedDornmass=el('dornmass').value;camControl.refresh();technologyControls.refresh();refreshChoices();});
  function populate(preferred){
    document.body?.classList?.toggle('matrix-generic-profile',currentProfileId!=='futuruss');
    const previous=typeof preferred==='string'?preferred:el('scheme').value;el('scheme').replaceChildren();
    if(imported&&currentProfileId==='futuruss'){
      const previousKit=imported.kits.find(k=>PREFIX+k.id===previous);if(previousKit&&globalThis.FuturussCamSelector?.types.includes(previousKit.variant))activeCam=previousKit.variant;
      const visible=imported.kits.filter(kit=>(!kit.catalogDraft||kit.catalogPrepared)&&kitFamily(kit)===activeFamily&&(!globalThis.FuturussCamSelector||FuturussCamSelector.calculatorVisible(kit,previousKit))&&(activeFamily!=='pvc'||!globalThis.FuturussCamSelector||!FuturussCamSelector.types.includes(kit.variant)||kit.variant===activeCam));
      if(!visible.length){info('В этой базе нет комплектаций '+(activeFamily==='aluminum'?'ALU':'для ПВХ')+'. Откройте настройку калькулятора и добавьте комплектацию.',true);reflect();return;}
      for(const kit of visible){const opt=document.createElement('option');opt.value=PREFIX+kit.id;opt.textContent=(globalThis.FuturussCamSelector?.calculatorLabel(kit)||kit.name)+(kit.catalogDraft?' · '+(globalThis.FuturussI18n?.translate?.('Состав неполный')||'Состав неполный'):'');el('scheme').appendChild(opt);}
      el('scheme').value=visible.some(k=>PREFIX+k.id===previous)?previous:PREFIX+visible[0].id;
      if(activeFamily==='pvc'&&globalThis.FuturussCamSelector)for(const [kind,name]of Object.entries(FuturussCamSelector.openings)){if(visible.some(k=>FuturussCamSelector.opening(k)===kind))continue;const opt=document.createElement('option');opt.disabled=true;opt.value='unavailable::'+kind;opt.textContent=name+' — Нет комплектации';el('scheme').appendChild(opt);}
    }else if(currentProfileId!=='futuruss'){
      const keys=[...new Set([...Object.keys(DATA.schemes||{}),...Object.keys(DATA.rules||{})])];
      for(const key of keys){const opt=document.createElement('option');opt.value=key;opt.textContent=globalThis.SCHEME_TITLES?.[key]||key;el('scheme').appendChild(opt);}
      el('scheme').value=keys.includes(previous)?previous:keys[0]||'';
      if(!keys.length)info('У этого бренда пока нет комплектаций. Загрузите или создайте состав бренда в настройках.',true);
    }else{
      el('scheme').value='';
    }
    const familyTabs=el('matrixFamilyTabs');if(familyTabs)familyTabs.hidden=!(imported&&currentProfileId==='futuruss');
    for(const [name,id] of [['pvc','matrixFamilyPvc'],['aluminum','matrixFamilyAluminum']]){const button=el(id);if(!button)continue;const available=!!imported?.kits.some(k=>kitFamily(k)===name);button.disabled=!available;button.className='matrix-family'+(name===activeFamily?' active':'');button.setAttribute?.('aria-pressed',String(name===activeFamily));}
    reflect();
  }
  function reflect(){
    const kit=selectedKit(),generic=currentProfileId!=='futuruss',alu=!generic&&kitFamily(kit)==='aluminum';el('matrixImportedDetails').hidden=!kit;
    const matchers={microvent:/^XZMV\./,lifter:/^MBU$/,plsEnabled:/^PLS$/,bprEnabled:/^BPR$/,aluLifter:/^(?:MBU|AL(?:02)?\.ZM9)$/,aluPlate:/^PLS$/,aluTravelLimiter:/^OZ1?$/,aluSupport:/^(?:RSP|AL(?:02)?\.OR-)/,aluLimiter:/^AL(?:02)?\.OUS$/,aluFixingPlate:/^PLD$/,aluClip:/^KF$/,aluDriveEnd:/^OP$/,aluSecurityPlate:/^PLV$/};
    for(const id of Object.keys(matchers)){const control=el(id);if(control){control.disabled=!kit||(alu&&!/^alu/.test(id))||(!alu&&/^alu/.test(id));control.checked=kit?.options?.[id]??kit?.common.some(i=>matchers[id].test(i.art))??false;}}
    el('aluminumControls').hidden=!kit||!alu;el('aluminumOptions').hidden=!kit||!alu;el('aluminumProfile').disabled=!kit||!alu;el('aluminumProfile').value=String(kit?.aluminumProfile||'14');
    const turn=kit?.openingType==='turn';el('aluTravelLimiterWrap').hidden=!alu||!turn;el('aluDriveEndWrap').hidden=!alu||!turn;el('aluSecurityPlateWrap').hidden=!alu||kit?.variant!=='mushroom';
    el('groove-block').hidden=!!kit&&alu;const coverWrap=el('coverColor').closest?.('label')||el('coverColor').parentElement;if(coverWrap)coverWrap.hidden=!!kit&&alu;const bprWrap=el('bprEnabled').closest?.('label')||el('bprEnabled').parentElement;if(bprWrap)bprWrap.hidden=!!kit&&alu;
    el('offsetHandle').disabled=!kit;el('offsetHandle').checked=kit?.handle==='offset';
    for(const id of ['offsetHandle','microvent','lifter','plsEnabled','bprEnabled']){const control=el(id),wrapper=control?.closest?.('label')||control?.parentElement;if(wrapper)wrapper.hidden=!kit||alu||generic;if(control){control.disabled=!kit||alu||generic;if((alu||generic)&&control.type==='checkbox')control.checked=false;}}
    el('handlePos').value=el('offsetHandle').checked?'offset':'center';
    el('dornmass').disabled=!kit||generic;FuturussCamSelector.configureDornmass(el('dornmass'),imported?.kits.find(k=>PREFIX+k.id===el('scheme').value)||kit);el('coverColor').disabled=!kit||alu||generic;el('coverColor').value=alu?'white':el('coverColor').dataset.chosenColor||kit?.coverColor||'white';el('handleColor').value=kit?.handleColor||'white';paintCoverSelect();paintHandleColors();renderHandleChoices(generic?null:kit);chooseGroove(kit);toggleHingeChoice();
    const summary=el('matrixImportedSummary');
    if(kit&&summary){summary.textContent=generic?kit.name+' · расчёт по данным выбранного бренда через новый движок MatrixCore.':kit.name+' · '+(MatrixCore.variants[kit.variant]||kit.variant)+' · '+(kit.side==='L'?'левая':'правая')+' · '+((kit.sizeRecipeMode?el('grooveType').value:kit.profile)||'профиль не указан')+'. Правое и левое открывание подбираются по парным артикулам из файла. Дополнительные позиции — по флажкам ниже.';}
    const simple=kit&&kitFamily(kit)==='pvc'&&['turn','fanlight','door','stulp-bolts','stulp-drive'].includes(kit.openingType);
    if(simple)for(const id of ['offsetHandle','microvent','lifter','bprEnabled']){el(id).disabled=true;el(id).checked=false;}
    if(['stulp-bolts','door'].includes(kit?.openingType)){el('handleEnabled').disabled=true;el('handleEnabled').checked=false;el('handleArticleWrap').hidden=true;el('handleColorWrap').hidden=true;}
    technologyControls.load(imported?.kits.find(k=>PREFIX+k.id===el('scheme').value)||kit);camControl?.refresh();refreshChoices();
  }
  function availableHandles(){return imported?MatrixCore.handleBases(imported):[];}
  function renderHandleChoices(kit){
    const select=el('handleArticle'),enabled=el('handleEnabled'),previous=select.value,handles=availableHandles();select.replaceChildren();
    for(const [art,a] of handles){const option=document.createElement('option');option.value=art;option.textContent=a.name;select.appendChild(option);}
    const preferred=MatrixCore.handleBaseArt(kit?.handleArticle||previous,imported?.articles?.[kit?.handleArticle||previous]||{}),fallback=handles.some(([art])=>art==='RP')?'RP':handles[0]?.[0]||'';select.value=handles.some(([art])=>art===preferred)?preferred:fallback;enabled.disabled=!kit;enabled.checked=kit?.options?.handleEnabled??false;select.disabled=!kit;el('handleArticleWrap').hidden=!enabled.checked;el('handleColorWrap').hidden=!enabled.checked;
  }
  const preliminaryBox=document.createElement('section');preliminaryBox.className='hint';preliminaryBox.id='matrixPreliminary';preliminaryBox.hidden=true;preliminaryBox.setAttribute('aria-live','polite');el('scheme').insertAdjacentElement('afterend',preliminaryBox);
  const preliminaryText='Состав неполный. Предварительный подбор; добавление в накладную запрещено.';
  function previewPrepared(){
    const kit=selectedKit();preliminaryBox.replaceChildren();preliminaryBox.hidden=!(currentProfileId==='futuruss'&&kit?.catalogDraft&&kit?.catalogPrepared);if(preliminaryBox.hidden)return;
    const tr=s=>globalThis.FuturussI18n?.translate?.(s)||s;
    const title=document.createElement('strong');title.textContent=tr(preliminaryText);preliminaryBox.append(title);
    const note=document.createElement('p');note.textContent=tr('Показаны основные узлы одной створки из шаблона. Сторона, цвет и остальные опции ещё не применены.');preliminaryBox.append(note);
    const selected=el('matrixDriveChoice').value,choices=selected!==''&&options[Number(selected)]?[options[Number(selected)]]:options;
    if(!choices.length){const p=document.createElement('p');p.textContent=tr('Для этих размеров нет диапазона.');preliminaryBox.append(p);}
    for(const choice of choices){const cell=kit.cells[choice.rowId+'|'+choice.colId];if(!cell)continue;const details=document.createElement('details'),summary=document.createElement('summary'),list=document.createElement('ul');summary.textContent=choice.drive;details.append(summary,list);
      for(const item of cell.items){const li=document.createElement('li');li.textContent=item.art+' — '+(imported.articles[item.art]?.name||item.art)+' × '+item.qty;list.append(li);}preliminaryBox.append(details);}
    if(!kit.columns.length){for(const group of kit.catalogGroups||[]){const details=document.createElement('details'),summary=document.createElement('summary'),list=document.createElement('ul');summary.textContent=group.title;details.append(summary,list);for(const art of group.articles){const li=document.createElement('li');li.textContent=art+' — '+(imported.articles[art]?.name||art);list.append(li);}preliminaryBox.append(details);}}
    const p=document.createElement('p');p.textContent=tr('Полный состав и узлы для проверки доступны в конструкторе.');preliminaryBox.append(p);
  }
  function refreshChoices(){
    const kit=selectedKit(),width=num('width'),height=num('height'),dornmass=num('dornmass')||15;
    const fingerprint=JSON.stringify([kit?.id,width,height,dornmass]);if(fingerprint!==choiceKey){choiceKey=fingerprint;el('matrixDriveChoice').value='';}
    const previous=el('matrixDriveChoice').value;if(currentProfileId!=='futuruss'){options=[];el('matrixDriveChoice').replaceChildren();el('matrixDriveChoiceWrap').hidden=true;previewPrepared();return;}
    options=kit?MatrixCore.candidates(kit,width,height).filter(c=>!c.drive||MatrixCore.dornAlternative(imported,c.drive,dornmass)):[];
    const select=el('matrixDriveChoice');select.replaceChildren();
    const first=document.createElement('option');first.value='';first.textContent='Выберите привод для этих размеров';select.appendChild(first);
    options.forEach((c,i)=>{const row=kit.rows.find(r=>r.id===c.rowId),col=kit.columns.find(w=>w.id===c.colId),art=MatrixCore.dornAlternative(imported,c.drive,dornmass)||c.drive;const opt=document.createElement('option');opt.value=String(i);opt.textContent=(art||'Привод не выбран')+' · дорнмасс '+dornmass+' мм · ВСФ '+row.from+'–'+row.to+' · ШСФ '+col.from+'–'+col.to;select.appendChild(opt);});
    if(previous!==''&&options[Number(previous)])select.value=previous;
    el('matrixDriveChoiceWrap').hidden=options.length<2;previewPrepared();
  }
  function profileResult(schemeKey,params,side,count){
    const resolved=globalThis.resolveItems?.(schemeKey,{width:params.width,height:params.height,handle:params.handle,groove:el('grooveType').value||''});
    if(!resolved)return {errors:['Не удалось прочитать комплектацию выбранного бренда.'],warnings:[],items:[]};
    if(resolved.error==='ambiguous')return {errors:['Для этих размеров подходят несколько диапазонов. Исправьте пересекающиеся границы в настройках комплектации.'],warnings:[],items:[]};
    if(resolved.error)return {errors:[resolved.error==='empty'?'В комплектации нет диапазонов, общего состава или правил.':'Для этих размеров в комплектации нет подходящего диапазона.'],warnings:resolved.warnings||[],items:[]};
    const source=[...(resolved.items||[]),...((resolved.sideItems||{})[side]||[])],articles={};
    for(const [art,record] of Object.entries(DATA.master||{}))articles[art]={name:record?.name||art,price:Number.isFinite(record?.price)?record.price:(globalThis.DEFAULT_PRICE||1),group:record?.group||DATA.groups?.[art]||'Позиции бренда'};
    for(const [art] of source)if(!articles[art])articles[art]={name:art,price:globalThis.DEFAULT_PRICE||1,group:'Позиции бренда'};
    const row={id:'profile-row',from:params.height,to:params.height,drives:[]},col={id:'profile-col',from:params.width,to:params.width},cellKey=row.id+'|'+col.id,kit={id:'profile-kit',name:globalThis.SCHEME_TITLES?.[schemeKey]||schemeKey,variant:'roller11',family:'pvc',calculationMode:'generic',profile:'',side,handle:'center',rows:[row],columns:[col],common:[],cells:{}};
    kit.cells[cellKey]={items:source.map(([art,qty])=>MatrixCore.rowItem(art,Number(qty)||1)),reviewed:true,note:''};
    const data={schemaVersion:2,format:'futuruss-matrix',nomenclatureVersion:'profile-adapter',articles,kits:[kit]},result=MatrixCore.calculate(data,kit,{width:params.width,height:params.height,count,side,dornmass:15,hingeType:'standard'},null);
    result.warnings=[...new Set([...(result.warnings||[]),...(resolved.warnings||[]),...result.items.filter(item=>!DATA.master?.[item.art]).map(item=>item.art+': использована резервная цена.')])];
    result.profileBlock=resolved.block;return result;
  }
  function addImported(){
    const kit=selectedKit();if(!kit){setMsg('Загрузите файл конструктора и выберите загруженную комплектацию.','err');return;}
    if(kit.catalogDraft){previewPrepared();setMsg(preliminaryText,'warn');return;}
    const right=num('qtyRight'),left=num('qtyLeft');
    if(!Number.isInteger(right)||!Number.isInteger(left)||right<0||left<0||right+left<1){setMsg('Укажите целое неотрицательное количество правых и левых створок. Нужна хотя бы одна створка.','err');return;}
    const generic=currentProfileId!=='futuruss',handle=!generic&&el('offsetHandle').checked?'offset':'center';el('handlePos').value=handle;
    if(generic){
      const params={width:num('width'),height:num('height'),handle},schemeKey=el('scheme').value;
      if(!Number.isFinite(params.width)||!Number.isFinite(params.height)||params.width<1||params.height<1){setMsg('Укажите ширину и высоту створки.','err');return;}
      const results=[['R',right],['L',left]].filter(([,count])=>count>0).map(([side,count])=>profileResult(schemeKey,params,side,count)),errors=[...new Set(results.flatMap(result=>result.errors||[]))],warnings=[...new Set(results.flatMap(result=>result.warnings||[]))];
      if(errors.length){setMsg(errors.join(' '),'err');return;}
      const merged=new Map();for(const result of results)for(const item of result.items){const previous=merged.get(item.art);if(previous)previous.qty+=item.qty;else merged.set(item.art,{...item,isDefaultPrice:!DATA.master?.[item.art]});}
      const block=results.find(result=>result.profileBlock)?.profileBlock;posCounter++;orderPositions.push({id:posCounter,currency:'KZT',label:el('poslabel').value||'Расчёт '+(orderPositions.length+1),scheme:kit.name,family:'pvc',profileId:currentProfileId,width:params.width,height:params.height,sashQty:right+left,qtyRight:right,qtyLeft:left,groove:el('grooveType').value||'',handle,rows:[...merged.values()],blockRange:block?'ШСФ '+block.w+', ВСФ '+block.h:'По правилам комплектации'});
      el('poslabel').value='';renderOrder();setMsg('Позиция добавлена новым расчётным движком MatrixCore.'+(warnings.length?' '+warnings.join(' '):''),warnings.length?'warn':'ok');return;
    }
    const alu=kitFamily(kit)==='aluminum',groove=alu?(kit.profile||'AL V.01 · паз 16 мм'):el('grooveType').value;
    if(!alu&&!kit.sizeRecipeMode&&kit.profile&&groove&&kit.profile.trim().toLowerCase()!==groove.trim().toLowerCase()){setMsg('В файле указан профиль «'+kit.profile+'», а в форме «'+groove+'». Выберите соответствующую комплектацию или профиль; зацепы не подменяются автоматически.','err');return;}
    refreshChoices();const value=el('matrixDriveChoice').value,selection=value===''?null:options[Number(value)];
    const params={width:num('width'),height:num('height'),dornmass:num('dornmass')||15,hingeType:!alu&&num('width')>650?el('hingeType').value:'standard',handle,handleArticle:el('handleArticle').value,handleColor:el('handleColor').value||'white',coverColor:alu?'white':el('coverColor').value,aluminumProfile:el('aluminumProfile').value||'14',count:right+left};
    Object.assign(params,technologyControls.read());
    const data=MatrixCore.copy(imported);
    params.options=Object.fromEntries(['microvent','lifter','plsEnabled','bprEnabled','handleEnabled','aluLifter','aluPlate','aluTravelLimiter','aluSupport','aluLimiter','aluFixingPlate','aluClip','aluDriveEnd','aluSecurityPlate'].map(id=>[id,!el(id).disabled&&(alu?!['microvent','lifter','plsEnabled','bprEnabled'].includes(id)&&el(id).checked:!/^alu/.test(id)&&el(id).checked)]));
    params.optionSeries=alu?'13':groove?grooveSeries(groove):(kit.optionSeries||'9');
    const results=[['R',right],['L',left]].filter(([,count])=>count>0).map(([side,count])=>MatrixCore.calculate(data,data.kits.find(k=>k.id===kit.id),{...params,side,count},selection));
    const result={...results[0],errors:[...new Set(results.flatMap(r=>r.errors))],warnings:[...new Set(results.flatMap(r=>r.warnings))]};
    result.items=MatrixCore.mergeCalculatedItems(results.flatMap(r=>r.items));
    const unavailable=result.items.filter(item=>!DATA.master[item.art]);
    if(imported?.pricingApplied&&unavailable.length){setMsg((globalThis.FuturussPricingText?.('unavailable')||'Товары недоступны у поставщика: ')+unavailable.map(item=>item.art).join(', '),'err');return;}
    if(result.errors.length){setMsg(result.errors.join(' '),'err');return;}
    if(result.needsChoice){setMsg('Для этой высоты подходит несколько приводов. Выберите нужный в поле «Вариант привода» под количеством правых и левых створок.','warn');el('matrixDriveChoice').focus();return;}
    const row=kit.rows.find(r=>r.id===result.chosen.rowId),col=kit.columns.find(c=>c.id===result.chosen.colId);
    posCounter++;
    orderPositions.push({id:posCounter,currency:imported?.priceCurrency||'KZT',label:el('poslabel').value||'Расчёт '+(orderPositions.length+1),scheme:kit.name,family:kitFamily(kit),width:params.width,height:params.height,dornmass:params.dornmass,aluminumProfile:params.aluminumProfile,sashQty:right+left,qtyRight:right,qtyLeft:left,groove:kit.sizeRecipeMode?params.strikeProfile:(kit.profile||groove),handle,hingeType:params.hingeType,handleColor:params.handleColor,coverColor:params.coverColor,hiddenProfile:params.hiddenProfile,hiddenStrike:params.hiddenStrike,strikeProfile:params.strikeProfile,strikeSuffix:params.strikeSuffix,strikeOverrides:params.strikeOverrides,lowerNode:params.lowerNode,rearChain:params.rearChain,rearCam:params.rearCam,chainReviewed:params.chainReviewed,chainCalculation:result.chainCalculation||null,handleHeightMode:params.handleHeightMode,handleHeight:result.technology?.handleHeight??null,handleTechnology:result.technology||null,
      plateCalculation:result.plateCalculation?{...result.plateCalculation,connections:results.flatMap((r,index)=>(r.plateCalculation?.connections||[]).map(c=>({...c,scope:index,id:index+':'+c.id}))),quantity:results.reduce((n,r)=>n+(r.plateCalculation?.quantity||0),0)}:null,plateManualAdjustment:0,rows:result.items.map(i=>({...i,isDefaultPrice:false})),blockRange:'Из конструктора: ШСФ '+col.from+'–'+col.to+', ВСФ '+row.from+'–'+row.to+(result.technology?' · '+MatrixCore.technologyText(result.technology):'')});
    el('poslabel').value='';renderOrder();
    setMsg('Позиция добавлена из загруженной комплектации.'+(result.warnings.length?' '+result.warnings.join(' '):''),result.warnings.length?'warn':'ok');
  }
  for(const id of ['width','height','dornmass','grooveType','offsetHandle','hingeType'])el(id).addEventListener(id==='width'||id==='height'?'input':'change',()=>technologyControls.refresh());
  populateSchemeSelect=populate;addPosition=addImported;
  el('matrixFamilyPvc').addEventListener('click',()=>{activeFamily='pvc',activeCam='roller11';choiceKey='';populate();});el('matrixFamilyAluminum').addEventListener('click',()=>{activeFamily='aluminum';choiceKey='';populate();});
  el('scheme').addEventListener('change',reflect);
  el('handleEnabled').addEventListener('change',()=>{const hidden=!el('handleEnabled').checked;el('handleArticleWrap').hidden=hidden;el('handleColorWrap').hidden=hidden;});
  for(const [color,id] of Object.entries(handleColorButtons))el(id).addEventListener('click',()=>{el('handleColor').value=color;paintHandleColors();});
  el('offsetHandle').addEventListener('change',()=>{el('handlePos').value=el('offsetHandle').checked?'offset':'center';});
  el('matrixDriveChoice').addEventListener('change',previewPrepared);
  el('coverColor').addEventListener('change',()=>{el('coverColor').dataset.chosenColor=el('coverColor').value;paintCoverSelect();});el('dornmass').addEventListener('change',refreshChoices);el('aluminumProfile').addEventListener('change',refreshChoices);el('grooveType').addEventListener('change',()=>{grooveTouched=true;});
  el('width').addEventListener('input',()=>{refreshChoices();toggleHingeChoice();});el('height').addEventListener('input',refreshChoices);
  function applyCentralCatalog(seed){
    try{
      imported=seed?normalizeCentralSeed(seed):null;choiceKey='';
      if(imported){
        if(!imported.pricingApplied)upgradeLibrary(imported);MatrixCore.ensureHandleColors(imported);const articleCount=syncMaster(imported);
        activeFamily=imported.kits?.some(k=>kitFamily(k)==='pvc')?'pvc':(imported.kits?.length?kitFamily(imported.kits[0]):'pvc');
        info('Подключено из Central: '+(imported.kits?.length||0)+' комплектаций и '+articleCount+' артикулов.');
      }else{
        if(typeof DATA!=='undefined'){DATA.master={};DATA.groups={};DATA.group_order=[];}
        info('Данные ещё не загружены. Дождитесь импорта Istina / Central.',true);
      }
      populate();reflect();globalThis.refreshInvoiceAdvertising?.();
      return true;
    }catch(error){imported=null;info('Данные Central недоступны: '+error.message,true);populate();return false;}
  }
  globalThis.FuturussMatrixAdapter={applyCatalog:applyCentralCatalog};
  applyCentralCatalog(typeof FUTURUSS_SEED!=='undefined'?FUTURUSS_SEED:null);
  populate();
  switchSubtab('style');
})();
