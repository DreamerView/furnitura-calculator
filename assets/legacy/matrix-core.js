(function(root){
  'use strict';
  const copy=x=>JSON.parse(JSON.stringify(x));
  const variants={roller11:'Цапфа 11 мм',roller8:'Цапфа 8 мм',mushroom:'Грибовидная цапфа'};
  const has=(o,k)=>Object.prototype.hasOwnProperty.call(o,k);
  const uid=()=> 'k'+Date.now().toString(36)+Math.random().toString(36).slice(2,7);
  const span=(from,to,id)=>({id,from,to});
  const key=(row,col)=>row.id+'|'+col.id;
  const fits=(n,r)=>Number.isFinite(n)&&n>=r.from&&n<=r.to;
  const handleColors={white:{suffix:'',name:'белая'},black:{suffix:'.BLACK',name:'чёрная'},brown:{suffix:'.K',name:'коричневая'},anthracite:{suffix:'.A',name:'антрацит'}};
  function isWindowHandle(art,a={}){return !!a&&(/^ручки$/i.test(String(a.group||''))||/^ручки$/i.test(String(a.section||''))||!!a.handleBase||!!a.handleColor);}
  function handleBaseArt(art,a={}){return a.handleBase||String(art).replace(/(?:\.BLACK|\.K|\.A)$/,'');}
  function handleBases(db){return Object.entries(db?.articles||{}).filter(([art,a])=>isWindowHandle(art,a)&&handleBaseArt(art,a)===art);}
  function handleArticleForColor(db,art,color='white'){
    const record=db?.articles?.[art]||{},base=handleBaseArt(art,record),config=handleColors[color];
    if(!config)return '';
    const target=base+config.suffix;return has(db.articles,target)?target:'';
  }
  function ensureHandleColors(db){
    if(!db?.articles)return db;
    for(const [art,record] of Object.entries(db.articles))if(isWindowHandle(art,record)){
      const base=handleBaseArt(art,record);record.handleBase=base;
      if(!record.handleColor)record.handleColor=art.endsWith('.BLACK')?'black':art.endsWith('.K')?'brown':art.endsWith('.A')?'anthracite':'white';
    }
    for(const [base,record] of handleBases(db))for(const [color,config] of Object.entries(handleColors)){
      const art=base+config.suffix;if(has(db.articles,art))continue;
      db.articles[art]={...copy(record),name:record.name+' — '+config.name,price:Number.isFinite(record.price)?record.price:1,handleBase:base,handleColor:color,source:(record.source||'Пользовательская оконная ручка')+' · цветовой артикул создан программой'};
    }
    return db;
  }
  function normalize(ranges){
    const out=copy(ranges).sort((a,b)=>a.from-b.from||a.to-b.to);
    for(let i=1;i<out.length;i++)if(out[i].from===out[i-1].to && out[i].to>out[i-1].to)out[i].from++;
    return out;
  }
  function rowItem(art,qty=1,role='manual'){return {art,qty,role};}
  function initial(seed){
    const articles=copy(seed.articles);
    ensureHandleColors({articles});
    const kits=Object.keys(variants).map(v=>{
      const common=['RV','RN','SV.10','SN','N.RV.B','N.SV.B','N.SN.B','N.RN2.B','N.RN1.B'].map(a=>rowItem(a));
      if(v==='mushroom')common.unshift(rowItem('U2'));
      if(v==='roller11')common.push(...['XU','XUSP','XZSP.9.R','XPNB.600-2'].map(a=>rowItem(a)),rowItem('ZK.45',2));
      const heights=v==='mushroom'
        ?[[490,790,['POK.790']],[530,740,['PO.740']],[620,800,['POM.800-1.V']],[800,1200,['POM.1200-1.V']],[1050,1450,['POM.1450-2.V']],[1200,1600,['POM.1600-2.V']],[1600,2000,['POM.2000-2.V']],[2000,2400,['POM.2400-4.V']]]
        :[[530,740,['PO.740']],[620,800,['800-1']],[801,1200,['1200-1']],[900,1300,['1300-1']],[1050,1450,['1450-1','1450-2']],[1201,1600,['1600-2']],[1601,2000,['2000-2']],[2001,2400,['2400-4']]];
      return {id:v,variant:v,name:v==='roller11'?'ПО открывание с цапфой 11 мм':v==='roller8'?'ПО открывание с цапфой 8 мм':'ПО открывание с грибовидной цапфой',
        note:v==='roller11'?'Общий список взят из вашего примера. Ножницы меняются по ширине, ПО привод — по высоте. Привод ножниц и остальные позиции редактируются в составе.':v==='mushroom'?'Комплектация сверена с каталогом, раздел 7.41 (печатные страницы 126–127): грибовидная цапфа, диапазоны приводов 490–2400 мм и ножницы 400–1400 мм; до 600 мм — универсальные NO.600. Профильные зацепы, приводы ножниц и удлинители добавляются в ячейке по профилю и размеру.':'Петлевая группа скопирована как начальная заготовка. Угловые передачи, низ и ответные планки заполните под выбранную обвязку.',
        columns:(v==='mushroom'?[[400,599],[600,800],[801,1000],[1001,1200],[1201,1400]]:[[400,600],[601,800],[801,1000],[1001,1200],[1201,1400]]).map(([a,b],i)=>span(a,b,'w'+i)),
        rows:heights.map(([a,b,arts],i)=>({...span(a,b,'h'+i),drives:v==='mushroom'?arts:arts.map(x=>x==='PO.740'?x:(v==='roller8'?'POM.':'XPO.')+x)})),
        common,cells:{},profile:'',side:'R',handle:'center',handleColor:'white',coverColor:'white'};
    });
    const extraKits=Array.isArray(seed.extraKits)?copy(seed.extraKits):[];
    return {schemaVersion:2,format:'futuruss-matrix',nomenclatureVersion:seed.nomenclatureVersion||'',articles,kits:[...kits,...extraKits]};
  }
  function scissors(db,kit,col){
    if(['turn','fanlight','door','stulp','stulp-bolts','stulp-drive'].includes(kit.openingType))return '';
    if(kit.family==='aluminum'){
      const preferred=col.to<=600?'SNO.600':(kit.variant==='mushroom'?'SNO.':'XSNO.')+col.to+'-1'+(kit.variant==='mushroom'?'.V':'');
      if(has(db.articles,preferred))return preferred;
    }
    const prefix=kit.variant==='roller11'?'XNO.':'NO.',suffix=kit.variant==='mushroom'?'.V':'';
    const preferred=col.to<=600?'NO.600':prefix+col.to+'-1'+suffix;
    const candidate=(a,art='')=>a.width&&a.width.min<=col.from&&a.width.max>=col.to&&(!a.variants?.length||a.variants.includes(kit.variant)||art==='NO.600')&&/ножницы/i.test(a.name);
    if(has(db.articles,preferred)&&candidate(db.articles[preferred],preferred))return preferred;
    const found=Object.entries(db.articles).filter(([art,a])=>candidate(a,art));
    return found.length===1?found[0][0]:'';
  }
  function sizeRecipe(stored,width,height){
    const matches=(stored?.sizeRecipes||[]).filter(r=>fits(width,r.width)&&fits(height,r.height));
    return matches.length===1?matches[0]:null;
  }
  function replaceCommon(kit,items){
    // Full cell recipes already contain their common parts. Replace only that share,
    // keeping size-dependent extras, manual rows and automatic parts intact.
    const previous=kit.common||[];
    const signature=it=>JSON.stringify(Object.fromEntries(Object.entries(it).filter(([k])=>k!=='qty'&&k!=='editPrice').sort(([a],[b])=>a.localeCompare(b))));
    for(const saved of Object.values(kit.cells||{}).flatMap(c=>c.sizeRecipes?.length?[c,...c.sizeRecipes]:[c])){
      for(const old of previous){let remaining=old.qty;for(const it of saved.items){if(signature(it)===signature(old)){const take=Math.min(it.qty,remaining);it.qty-=take;remaining-=take;}}}
      saved.items=saved.items.filter(i=>i.qty>0);saved.items.push(...copy(items));saved.reviewed=false;
    }
    kit.common=copy(items);
  }
  function cell(db,kit,row,col,params){
    const stored=kit.cells[key(row,col)];
    if(params&&kit.sizeRecipeMode){const recipe=sizeRecipe(stored,params.width,params.height);return recipe?copy(recipe):{items:[],reviewed:false,sizeUnavailable:true};}
    if(stored)return copy(stored);
    const items=[...(row.drives[0]?[rowItem(row.drives[0],1,'drive')]:[]),...copy(kit.common)],sc= scissors(db,kit,col);if(sc)items.push(rowItem(sc,1,'scissors'));
    return {items,reviewed:false,driveChosen:row.drives.length===1,note:''};
  }
  function candidates(kit,width,height){
    const out=[];for(const row of kit.rows)for(const col of kit.columns)if(fits(width,col)&&fits(height,row)){
      const base=kit.cells[key(row,col)],stored=kit.sizeRecipeMode?sizeRecipe(base,width,height):base;if(kit.sizeRecipeMode&&!stored)continue;const manual=stored?.items.find(i=>i.role==='drive')?.art;
      const drives=stored&&manual?[manual]:(row.drives.length?row.drives:['']);
      for(const drive of drives)out.push({rowId:row.id,colId:col.id,drive});
    }return out;
  }
  function dornAlternative(db,art,dornmass=15){
    if(!art||!db?.articles?.[art])return '';
    const wanted=Number(dornmass)||15,record=db.articles[art],current=Number(record.dornmass||((art.match(/\.D(\d+)(?=\.|$)/)||[])[1])||15);
    if(current===wanted)return art;
    const base=art.replace(/\.D\d+(?=\.|$)/,'');
    const found=Object.entries(db.articles).find(([candidate,a])=>candidate.replace(/\.D\d+(?=\.|$)/,'')===base&&Number(a.dornmass||((candidate.match(/\.D(\d+)(?=\.|$)/)||[])[1])||15)===wanted);
    if(found)return found[0];
    const size=(art.match(/\d{3,4}(?:-\d+)?/)||[])[0],variants=record.variants||[],mushroom=/\.V(?:\.|$)/.test(art);
    const compatible=Object.entries(db.articles).find(([candidate,a])=>size&&(candidate.match(/\d{3,4}(?:-\d+)?/)||[])[0]===size&&Number(a.dornmass||((candidate.match(/\.D(\d+)(?=\.|$)/)||[])[1])||15)===wanted&&/\.V(?:\.|$)/.test(candidate)===mushroom&&a.section===record.section&&a.handlePosition===record.handlePosition&&(!variants.length||a.variants?.some(v=>variants.includes(v))));
    return compatible?.[0]||'';
  }
  function validate(db){
    const errors=[];
    if(!db||db.schemaVersion!==2||db.format!=='futuruss-matrix'||!Array.isArray(db.kits)||!db.kits.length||!db.articles||typeof db.articles!=='object')return ['Файл не является библиотекой табличных комплектаций.'];
    const ads=db.advertisingImages??db.advertisingImage;
    if(ads!=null){const list=Array.isArray(ads)?ads:[ads];if(list.some(src=>typeof src!=='string'||!/^data:image\/(?:png|jpeg|webp);base64,/i.test(src)))errors.push('Рекламное изображение имеет неверный формат.');}
    const ids=new Set();
    function items(list,title){if(!Array.isArray(list)){errors.push(title+': нет списка деталей');return;}for(const i of list){if(!i||typeof i.art!=='string'||!Number.isInteger(i.qty)||i.qty<=0)errors.push(title+': некорректная строка');else if(i.art&&!has(db.articles,i.art))errors.push(title+': неизвестный артикул '+i.art);if(i?.compatibilityApproved!=null&&typeof i.compatibilityApproved!=='boolean')errors.push(title+': неверное подтверждение совместимости');}}
    for(const [id,a] of Object.entries(db.articles))if(!id||!a||typeof a.name!=='string'||(a.price!=null&&(!Number.isFinite(a.price)||a.price<0)))errors.push('Неверная карточка артикула '+id);
    for(const k of db.kits){
      // variant is an extensible contract field: new product families may add values
      // without requiring a calculator release. Keep the known names for UI labels.
      if(!k||typeof k.variant!=='string'||!k.variant||!k.id||ids.has(k.id)||typeof k.name!=='string'){errors.push('Неверная комплектация');continue;}ids.add(k.id);
      if(k.side!=null&&!['R','L'].includes(k.side))errors.push(k.name+': неверная сторона открывания');
      if(k.handle!=null&&!['center','offset'].includes(k.handle))errors.push(k.name+': неверное положение ручки');
      if(k.handleColor!=null&&!has(handleColors,k.handleColor))errors.push(k.name+': неверный цвет ручки');
      if(k.coverColor!=null&&!['white','brown','anthracite','black'].includes(k.coverColor))errors.push(k.name+': неверный цвет накладок');
      if(k.family==='aluminum'&&k.aluminumProfile!=null&&!['14','10'].includes(String(k.aluminumProfile)))errors.push(k.name+': неверный профиль ALU');
      if(k.handleArticle!=null&&(!k.handleArticle||!has(db.articles,k.handleArticle)))errors.push(k.name+': выбранная ручка отсутствует в базе');
      if(k.optionSeries!=null&&!['9','13'].includes(String(k.optionSeries)))errors.push(k.name+': неверная серия паза');
      if(k.options!=null&&(typeof k.options!=='object'||Object.values(k.options).some(v=>typeof v!=='boolean')))errors.push(k.name+': неверные дополнительные опции');
      for(const f of ['rows','columns']){
        if(!Array.isArray(k[f])||(!k[f].length&&!k.catalogDraft)){errors.push(k.name+': отсутствуют диапазоны');continue;}
        const rs=new Set();for(const r of k[f]){if(!r||!r.id||rs.has(r.id)||!Number.isInteger(r.from)||!Number.isInteger(r.to)||r.from<1||r.from>r.to)errors.push(k.name+': неверный диапазон');else rs.add(r.id);if(f==='rows'&&(!Array.isArray(r?.drives)||r.drives.some(a=>typeof a!=='string'||(a&&!has(db.articles,a)))))errors.push(k.name+': неверный список приводов');}
      }
      items(k.common,k.name);
      if(!k.cells||typeof k.cells!=='object'){errors.push(k.name+': нет ячеек');continue;}
      for(const [cellKey,c] of Object.entries(k.cells)){
        items(c?.items,k.name);
        if(c?.sizeRecipes!=null){
          if(!Array.isArray(c.sizeRecipes)){errors.push(k.name+': неверные размерные составы');continue;}
          const [rid,cid]=cellKey.split('|'),row=k.rows.find(r=>r.id===rid),col=k.columns.find(r=>r.id===cid);
          for(const [index,r] of c.sizeRecipes.entries()){
            items(r?.items,k.name);
            for(const [axis,outer] of [['width',col],['height',row]]){const v=r?.[axis];if(!outer||!v||!Number.isInteger(v.from)||!Number.isInteger(v.to)||v.from<outer.from||v.to>outer.to||v.from>v.to)errors.push(k.name+': неверные размерные составы');}
            if(r?.width&&r?.height&&c.sizeRecipes.slice(0,index).some(p=>p?.width&&p?.height&&p.width.from<=r.width.to&&r.width.from<=p.width.to&&p.height.from<=r.height.to&&r.height.from<=p.height.to))errors.push(k.name+': пересекаются размерные составы');
          }
        }
      }
    }
    return [...new Set(errors)];
  }

  const strikeDefaults={"defaultSuffix":"40","source":"Таблица 10.4 подбора ответных планок — изображение пользователя; обозначения приведены к артикулам существующей базы.","profiles":{"KBE 09":{"series":"9","perimeter":{"35":"ZK9.35","40":"ZK9.40","45":"ZK9.45","50":"ZK9.50"},"security":{"35":"ZUP.K9/35","40":"ZUP.K9/40","45":"ZUP.K9/45"},"tiltSecurity":{"35":"ZUO.K9/35","40":"ZUO.K9/40","45":"ZUO.K9/45"},"tiltFirst":"VTF.9","microvent":"XZMV.9","step":"ZPP","lifterPlastic":"ZM9.P","lifterZinc":"ZM9.Z","tiltBolt":"XZSP.9","hiddenClamp":"PS.R9","adapter":null},"KBE 13":{"series":"13","perimeter":{"35":"ZK.35","40":"ZK.40","45":"ZK.45","50":"ZK.50"},"security":{"35":"ZUP.K/35","40":"ZUP.K/40","45":"ZUP.K/45"},"tiltSecurity":{"35":"ZUO.K/35","40":"ZUO.K/40","45":"ZUO.K/45"},"tiltFirst":"ZTF.K13/30","microvent":"XZMV.13","step":"ZPP","lifterPlastic":"ZM13.P","lifterZinc":"ZM13.Z","tiltBolt":"XZSP.13","hiddenClamp":"PS.R13","adapter":null},"REHAU":{"series":"13","perimeter":{"35":"ZK.35","40":"ZK.40","45":"ZK.45","50":"ZK.50"},"security":{"35":"ZUP.R/35","40":"ZUP.R/40","45":"ZUP.R/45"},"tiltSecurity":{"35":"ZUO.R/35","40":"ZUO.R/40","45":"ZUO.R/45"},"tiltFirst":"ZTF.K13/30","microvent":"XZMV.13","step":"ZPP","lifterPlastic":"ZM13.P","lifterZinc":"ZM13.Z","tiltBolt":"XZSP.13","hiddenClamp":"PS.R13","adapter":null},"VEKA 13 / VHS":{"series":"13","perimeter":{"35":"ZK.35","40":"ZK.40","45":"ZK.45","50":"ZK.50"},"security":{"35":"ZUP.V/35","40":"ZUP.V/40","45":"ZUP.V/45"},"tiltSecurity":{"35":"ZUO.V/35","40":"ZUO.V/40","45":"ZUO.V/45"},"tiltFirst":"ZTF.K13/30","microvent":"XZMV.13","step":"ZPP","lifterPlastic":"ZM13.P","lifterZinc":"ZM13.Z","tiltBolt":"XZSP.13","hiddenClamp":"PS.R13","adapter":null},"Gealan/Ivaper":{"series":"13","perimeter":{"35":"ZQ.35","45":"ZQ.45"},"security":{"35":"ZUP.G/35","40":"ZUP.G/40","45":"ZUP.G/45"},"tiltSecurity":{"35":"ZUO.G/35","40":"ZUO.G/40","45":"ZUO.G/45"},"tiltFirst":"ZTF.K13/30","microvent":"XZMV.13","step":"ZPP","lifterPlastic":"ZM13.P","lifterZinc":"ZM13.Z","tiltBolt":"XZSP.13","hiddenClamp":"PS.R13","adapter":null},"Deceuninck/Thyssen":{"series":"13","perimeter":{"35":"ZD.35","45":"ZD.45"},"security":{"35":"ZUP.K/35","40":"ZUP.K/40","45":"ZUP.K/45"},"tiltSecurity":{"35":"ZUO.D/35","40":"ZUO.D/40","45":"ZUO.D/45"},"tiltFirst":"VTF.D","microvent":"XZMV.13","step":"ZPP","lifterPlastic":"ZM13.P","lifterZinc":"ZM13.Z","tiltBolt":"XZSP.13","hiddenClamp":"PS.R13","adapter":"APD"}}};
  // PLS belongs to a verified joint, never to a name-based count of sash parts.
  function plateUnits(){return 0;}
  function plateTotal(rows,adjustment=0,connections=[]){
    const amounts=new Map();for(const r of rows)amounts.set(r.art,(amounts.get(r.art)||0)+Number(r.qty||0));
    const seen=new Set(),pairs=new Set(),groups=new Map();let total=0;
    for(const c of connections){
      if(!c.id||seen.has(c.id)||c.cut!=='single'||!c.verified)continue;seen.add(c.id);
      const pair=[c.from,c.to].sort().join('|'),instance=(c.scope??'')+'|'+pair;
      if(pairs.has(instance))continue;pairs.add(instance);
      const group=groups.get(pair);if(group)group.count+=Number(c.count)||0;else groups.set(pair,{...c,count:Number(c.count)||0});
    }
    for(const c of groups.values()){
      const available=Math.min((amounts.get(c.from)||0)/(c.fromQty||1),(amounts.get(c.to)||0)/(c.toQty||1));
      total+=Math.max(0,Math.min(c.count,available))*(Number(c.plates)||1);
    }
    return Math.max(0,total+adjustment);
  }
  function resolvePlateConnections(items,connections,count=1){
    const resolve=ref=>items.find(i=>i.role===ref)?.art||ref;
    return connections.map(c=>({...c,from:resolve(c.from),to:resolve(c.to),count:(Number(c.count)||1)*count}));
  }
  function strikeAlternatives(db,position,art,originalRole){
    const role=originalRole||strikeRole(art);if(!role)return [];
    const profile=position.strikeProfile||position.groove,side=position.qtyLeft>0&&!position.qtyRight?'L':position.qtyRight>0&&!position.qtyLeft?'R':/\.L$/.test(art)?'L':'R';
    const result=[];
    for(const suffix of ['35','40','45','50']){
      const plan=strikePlan(db,{family:position.family||'pvc',sizeRecipeMode:/^VTF\./.test(art)},{strikeProfile:profile,strikeSuffix:suffix,side});
      const choice=plan?.roles[role];if(!choice||choice.fallback||!db.articles[choice.art]||db.articles[choice.art].available===false)continue;
      if(!result.some(x=>x.art===choice.art))result.push({art:choice.art,suffix});
    }
    return result;
  }

  // FUTURUSS 2026-07: p.196 (8.6.4), pp.277/279 (10.3).
  // Inclusive bounds: overlapping 1700/2300 belong to the preceding row.
  // No interpolation across the missing 2001–2100 short-chain catalogue row.
  const chainRules={
    long:[
      [700,1000,400,1,[],[402]], [1001,1300,600,2,[],[151,602]],
      [1301,1450,800,2,[],[151,802]], [1451,1700,400,1,[600],[402,1001]],
      [1701,1900,600,2,[600],[151,602,1201]], [1901,2100,800,2,[600],[151,802,1401]],
      [2101,2300,600,2,[600,400],[151,602,1201,1600]], [2301,2400,600,2,[600,600],[151,602,1201,1800]]
    ],
    short:[
      [600,800,[],0,[152]], [801,1200,[],400,[152,552]], [1201,1400,[],600,[152,752]],
      [1401,1600,[400],400,[152,550,951]], [1601,1800,[400],600,[152,550,1151]],
      [1801,2000,[600],600,[152,750,1351]], [2101,2400,[600,600],600,[152,750,1349,1751]]
    ],
    bottomBolt:[[600,1000,400,1],[1001,1300,600,1],[1301,1400,800,2]],
    bottomCorner:[[700,1000,[],400],[1001,1300,[],600],[1301,1400,[400],400]]
  };
  function chainSupported(k){return !!k&&!k.catalogDraft&&k.family!=='aluminum'&&k.calculationMode!=='generic'&&['roller11','roller8','mushroom'].includes(k.variant)&&(!k.openingType||k.openingType==='tilt-turn');}
  function inferredLowerNode(k){if(['bolt','security'].includes(k?.lowerNode))return k.lowerNode;return k?.common?.some(i=>i.art==='XUSP')?'bolt':'security';}
  function chainReviewKey(k,p){return JSON.stringify([k.id,k.variant,p.width,p.height,p.rearChain,p.rearCam,p.lowerNode,p.strikeProfile,p.optionSeries,p.dornmass||k.dornmass||15,p.handleHeightMode||'catalog',p.handleHeight??null,p.hingeType||k.hingeType||'standard',p.handle||k.handle||'center']);}
  function chainArticle(type,kind,size,cams=1){
    if(kind==='drive')return (type==='roller11'?'XPNB.':'PNB.')+size+'-'+cams+(type==='mushroom'?'.V':'');
    if(kind==='short')return {roller11:'XPNB.S.200-1',roller8:'PNF.200-1',mushroom:'PNF.V.200-1'}[type];
    if(kind==='longExtension')return (type==='roller11'?'XU.':'UB.')+size+'-1'+(type==='mushroom'?'.V':'');
    if(kind==='connector')return (type==='roller11'?'XUF.':'UF.')+size+'-1'+(type==='mushroom'?'.V':'');
    return type==='roller11'?(size===400?'U.400-1VR':'XUK.600-1'):'U.'+size+'-1'+(type==='mushroom'?'.V':'');
  }
  function chainPlan(db,k,p={}){
    const mode=p.rearChain||k.rearChain||'catalog';if(mode==='catalog')return null;
    const q={...k,...p,rearChain:mode,rearCam:p.rearCam||k.rearCam||'same',lowerNode:p.lowerNode&&p.lowerNode!=='catalog'?p.lowerNode:inferredLowerNode(k)};
    const plan={version:1,mode,lowerNode:q.lowerNode,rearCam:q.rearCam==='mushroom'?'mushroom':k.variant,items:[],rear:[],bottom:[],errors:[],warnings:[],reviewReasons:[],source:'FUTURUSS 2026-07: 196–209, 276–279, 286–287',targetFromTop:Math.round(p.height*2/3),strikeCoordinates:[]};
    if(!chainSupported(k)||!['short','long'].includes(mode)||!['same','mushroom'].includes(q.rearCam)||!['bolt','security'].includes(q.lowerNode)||(p.hingeType||k.hingeType||'standard')==='hidden'){
      plan.errors.push('Автоподбор задней цепочки для этой комплектации не подтверждён.');return plan;
    }
    const add=(zone,type,kind,size,cams=1)=>{const art=chainArticle(type,kind,size,cams);const item={art,qty:1,role:'chain',chainZone:zone,chainCam:type,camCount:cams};plan.items.push(item);plan[zone].push(art);return item;};
    const rearType=plan.rearCam,row=chainRules[mode].find(r=>p.height>=r[0]&&p.height<=r[1]);
    if(!row)plan.errors.push('Для высоты нет подтверждённого диапазона задней цепочки.');
    else if(mode==='long'){
      add('rear',rearType,'drive',row[2],row[3]);for(const n of row[4])add('rear',rearType,'longExtension',n);
      if(rearType==='roller11')plan.strikeCoordinates=row[5].slice();
    }else{
      add('rear',rearType,'short',200);for(const n of row[2])add('rear',rearType,'connector',n);if(row[3])add('rear',rearType,'terminal',row[3]);
      if(rearType==='roller11')plan.strikeCoordinates=row[4].slice();
      else plan.reviewReasons.push('Сверьте цепочку 200 по монтажной схеме: в таблице каталога есть расхождения артикулов.');
    }
    if(rearType!==k.variant)plan.reviewReasons.push('Смешанная задняя цепочка: проверьте соединение с ножницами и профильные взломостойкие планки.');
    const bottom=chainRules[q.lowerNode==='bolt'?'bottomBolt':'bottomCorner'].find(r=>p.width>=r[0]&&p.width<=r[1]);
    if(bottom){
      if(q.lowerNode==='bolt')add('bottom',k.variant,'drive',bottom[2],bottom[3]);
      else {for(const n of bottom[2])add('bottom',k.variant,'connector',n);add('bottom',k.variant,'terminal',bottom[3]);}
    }else if(p.width>=370&&p.width<700&&q.lowerNode==='security')plan.warnings.push('Для нижней горизонтали менее 700 мм удлинитель автоматически не добавлен; проверьте точки прижима.');
    else plan.errors.push('Для ширины нет подтверждённого диапазона нижней цепочки.');
    if(q.lowerNode==='security'&&k.variant!=='roller11')plan.reviewReasons.push('Нижняя цепочка для цапфы 8 мм или грибовидной требует сверки соединений и каталожных обозначений.');
    if(q.lowerNode==='bolt'&&k.variant!=='roller11')plan.reviewReasons.push('Соединение нижнего шпингалета с выбранной цапфой требует проверки.');
    const lower=q.lowerNode==='bolt'?'XUSP':{roller11:'XU.2',roller8:'U1.2',mushroom:'U2.2'}[k.variant];
    plan.items.push({art:lower,qty:1,role:'chain',chainZone:'lower',chainCam:k.variant,camCount:q.lowerNode==='bolt'?0:1});
    const strikes=strikePlan(db,k,q);
    if(!strikes)plan.errors.push('Выберите профиль ответных планок.');else{
      plan.errors.push(...strikes.errors);
      for(const parent of plan.items.slice()){
        const role=parent.chainCam==='mushroom'?'security':'perimeter';
        if(parent.camCount)plan.items.push({art:strikes.roles[role]?.art,qty:parent.camCount,role:'chainStrike',chainZone:parent.chainZone,chainCam:parent.chainCam,dependency:{parent:parent.art,ratio:parent.camCount},...(strikes.roles[role]?.manual?{manualStrike:true,compatibilityApproved:true}:{})});
      }
      const role=q.lowerNode==='bolt'?'tiltBolt':'tiltSecurity';
      plan.items.push({art:strikes.roles[role]?.art,qty:1,role:'chainStrike',chainZone:'lower',chainCam:k.variant,dependency:{parent:lower,ratio:1}});
    }
    for(const i of plan.items)if(!i.art||!db.articles[i.art]||db.articles[i.art].available===false)plan.errors.push('Деталь цепочки недоступна: '+(i.art||'—'));
    if(plan.strikeCoordinates.length){
      plan.lastStrikeFromTop=Math.max(...plan.strikeCoordinates);
      if(plan.lastStrikeFromTop<plan.targetFromTop)plan.warnings.push('Нижняя точка прижима выше ориентира ⅔ высоты. Проверьте дополнительный прижим.');
      plan.warnings.push('Координаты ответных планок даны по раме из монтажной таблицы; положение цапфы по фальцу проверьте отдельно.');
    }else plan.warnings.push('Положение нижней цапфы и ориентир ⅔ высоты требуют проверки по монтажной схеме.');
    plan.reviewKey=chainReviewKey(k,q);
    plan.reviewed=(p.chainReviewed??k.chainReviewed)===plan.reviewKey;
    if(plan.reviewReasons.length&&!plan.reviewed)plan.errors.push('Подтвердите проверку схемы соединений или выберите другую цепочку.');
    // Only the explicitly selected, reviewed chain can cross the main cam family.
    if(plan.reviewed)for(const i of plan.items)if(i.chainCam!==k.variant||i.art==='XUSP')i.compatibilityApproved=true;
    return plan;
  }
  function applyChain(items,plan,errors){
    const old=copy(items),remove=new Set(),subtract={perimeter:0,security:0};
    // Untagged extension rows can belong to the handle side. Never guess ownership.
    const extension=/^(?:X?UF|UB|XUK)\.|^XU\.(?:400|600)-1$|^U\.(?:400|600)-1/;
    if(old.some(i=>extension.test(i.art)&&!i.chainZone)){errors.push('В составе есть удлинители без привязки к стороне. Уточните состав в конструкторе перед автоподбором.');return items;}
    for(const [index,i] of old.entries()){
      if(i.chainZone){remove.add(index);continue;}
      if(/^(?:XPNB|PNB|PNF)\./.test(i.art)||['XUSP','XU.2','U1.2','U2.2'].includes(i.art)){
        remove.add(index);const role=/\.V(?:\.|$)/.test(i.art)||i.art==='U2.2'?'security':'perimeter';
        subtract[role]+=i.qty*(i.art==='XUSP'?0:['XU.2','U1.2','U2.2'].includes(i.art)?1:Number(i.art.match(/-(\d)(?:\.|$)/)?.[1]||1));
      }
      if(['tiltBolt','tiltSecurity'].includes(strikeRole(i.art)))remove.add(index);
    }
    for(const [index,i] of old.entries())if(!remove.has(index)){
      const role=strikeRole(i.art);if(!subtract[role])continue;const n=Math.min(i.qty,subtract[role]);i.qty-=n;subtract[role]-=n;if(i.qty===0)remove.add(index);
    }
    if(Object.values(subtract).some(n=>n>0))plan.warnings.push('В исходной комплектации не хватало ответных планок заднего узла; новый узел рассчитан отдельно.');
    return [...old.filter((_,n)=>!remove.has(n)),...copy(plan.items)];
  }

  function lowerNodeSupported(kit){return kit.family!=='aluminum'&&kit.calculationMode!=='generic'&&kit.variant==='roller11'&&!['turn','fanlight','door','stulp','stulp-drive','stulp-bolts','tilt-first'].includes(kit.openingType);}

  function strikeRole(art){
    if(/^Z(?:K9|K|Q|D)\.\d+$/.test(art))return 'perimeter';
    if(/^ZUP\./.test(art))return 'security';
    if(/^ZUO\.(?:K9|K|R|V|G|D)\//.test(art))return 'tiltSecurity';
    if(/^(?:VTF\.|ZTF\.K13\/30)/.test(art))return 'tiltFirst';
    if(/^(?:XZMV|ZMV)\./.test(art))return 'microvent';
    if(art==='ZPP')return 'step';
    if(/^ZM(?:9|13)\.P$/.test(art))return 'lifterPlastic';
    if(/^ZM(?:9|13)\.Z$/.test(art))return 'lifterZinc';
    if(/^XZSP\.(?:9|13)\.[LR]$/.test(art))return 'tiltBolt';
    if(/^PS\.R(?:9|13)$/.test(art))return 'hiddenClamp';
    return null;
  }
  // FUTURUSS catalogue: profile-specific Tilt First inserts (not ZTF strikes).
  const tiltFirstWorkbookProfiles={'KBE 09':'VTF.9','KBE 13':'VTF.13',REHAU:'VTF.R','VEKA 13 / VHS':'VTF.V','Gealan/Ivaper':'VTF.G','Deceuninck/Thyssen':'VTF.D'};
  function strikePlan(db,kit,params={}){
    const table=db.strikeSelection||strikeDefaults,profile=params.strikeProfile||kit.strikeProfile;
    if(!profile||kit.family==='aluminum'||kit.calculationMode==='generic')return null;
    const entry=table.profiles?.[profile],suffix=String(params.strikeSuffix||kit.strikeSuffix||table.defaultSuffix||'40'),overrides=params.strikeOverrides||kit.strikeOverrides||{},warnings=[],errors=[],roles={};
    if(!entry)return {roles,warnings,errors:['Неизвестная профильная система ответных планок.']};
    if(params.optionSeries&&String(params.optionSeries)!==entry.series)errors.push('Профиль ответных планок не соответствует выбранному пазу.');
    for(const role of Object.keys(entry).filter(k=>!['series','adapter'].includes(k))){
      const value=entry[role];let art=typeof value==='object'?value[suffix]:value,fallback=false;
      if(!art&&typeof value==='object'){art=value['45']||Object.values(value)[0];fallback=true;}
      if(role==='tiltFirst'&&kit.sizeRecipeMode)art=tiltFirstWorkbookProfiles[profile];
      if(role==='tiltFirst'&&art==='ZTF.K13/30')art+='.'+(params.side||kit.side||'R');
      if(role==='tiltBolt')art+='.'+(params.side||kit.side||'R');
      if(role==='microvent'&&kit.variant==='roller8')art='ZMV.'+entry.series;
      roles[role]={art:overrides[role]||art,recommended:art,manual:!!overrides[role],fallback:!overrides[role]&&fallback};
    }
    return {profile,suffix,roles,adapter:entry.adapter,errors,warnings};
  }

  function hiddenStrikeFits(art,profile,series){
    const prefix=profile==='K'?(String(series)==='9'?'K9':String(series)==='13'?'K':''):profile==='V'?'V':profile==='R'?'R':'';
    return !!prefix&&new RegExp('^ZUO\\.'+prefix+'/(25|30|35|40|45)$').test(art);
  }
  function handleTechnology(db,kit,params={}){
    if((params.handle||kit.handle)!=='offset')return null;
    const mode=params.handleHeightMode||kit.handleHeightMode||'catalog',height=Number(params.height),requested=Number(params.handleHeight??kit.handleHeight??0);
    const plan={ok:false,mode,height,handleHeight:mode==='manual'&&Number.isFinite(requested)&&requested>0?requested:null,drive:'',extensions:[],chain:[],message:'Для этой высоты ручки нужна проверенная схема соединений и подрезки.'};
    if(!['catalog','manual'].includes(mode)||!Number.isInteger(height)||height<1||(mode==='manual'&&(!Number.isInteger(requested)||requested<=0||requested>=height)))return plan;
    if(kit.family==='aluminum'||kit.calculationMode==='generic'||['turn','fanlight','door','stulp-bolts','stulp-drive'].includes(kit.openingType)||kit.variant!=='roller11'||Number(params.dornmass||kit.dornmass||15)!==15)return plan;
    const row=[[600,800,'XPOK.600-1',300],[801,1000,'XPOK.800-1',400],[1001,1200,'XPOK.1000-1',500],[1201,1400,'XPOK.1200-2',600],[1401,1600,'XPOK.1400-2',700],[1601,1800,'XPOK.1600-2',700],[1801,2000,'XPOK.1800-2',1000],[2001,2200,'XPOK.2000-3',1000]].find(r=>height>=r[0]&&height<=r[1]);
    if(!row)return plan;
    plan.catalogHeight=row[3];plan.suggestedDrive=row[2];
    if(mode==='manual'&&requested!==row[3])return plan;
    if(!db.articles[row[2]])return plan;
    Object.assign(plan,{ok:true,handleHeight:row[3],drive:row[2],chain:['Нижняя угловая передача',row[2],'Верхняя угловая передача'],message:'Прямое соединение по каталогу. Удлинитель со стороны ручки не требуется. Остальную обвязку проверить по размеру.'});
    return plan;
  }
  function technologyText(plan){return plan?[plan.drive,plan.handleHeight==null?'':'Высота ручки: '+plan.handleHeight+' мм',plan.chain.join(' → '),plan.message].filter(Boolean).join(' · '):'';}

  function calculate(db,kit,params={},selection){
    if(kit.catalogDraft)return {errors:['Схема каталога ещё не настроена для автоматического расчёта.'],warnings:[],items:[],choices:[],total:null};
    const errors=validate(db),warnings=[];
    if(kit.sizeRecipeMode){
      const profile=params.strikeProfile||kit.strikeProfile,entry=(db.strikeSelection||strikeDefaults).profiles?.[profile];
      // Infer the groove only when omitted; explicit mismatches remain errors.
      if(params.optionSeries==null&&entry)params={...params,optionSeries:entry.series};
      if(!has(tiltFirstWorkbookProfiles,profile)||!entry)
        return {errors:['Для этой комплектации выберите профиль из каталога и стандартные петли.'],warnings,items:[],choices:[],total:null};
      if((params.hingeType||kit.hingeType||'standard')!=='standard')
        return {errors:["Для выбранной петлевой группы Tilt First полный состав ещё не подтверждён. Выберите стандартные петли или настройте отдельную комплектацию в конструкторе."],warnings,items:[],choices:[],total:null};
    }
    if(errors.length)return {errors,warnings,items:[],choices:[]};
    if(!kit||!db.kits.some(k=>k.id===kit.id)){errors.push('Комплектация не найдена в загруженном файле.');return {errors,warnings,items:[],choices:[]};}
    if(!Number.isInteger(params.width)||!Number.isInteger(params.height)||params.width<1||params.height<1)errors.push('Ширина и высота должны быть целыми положительными числами.');
    if(!Number.isInteger(params.count)||params.count<1)errors.push('Количество створок должно быть целым и больше нуля.');
    const dornmass=Number(params.dornmass||(kit.openingType==='door'?kit.dornmass:15)||15);
    if(!Number.isInteger(dornmass)||dornmass<1)errors.push('Выберите дорнмасс.');
    const technology=handleTechnology(db,kit,params);
    if(technology&&!technology.ok)return {errors:[...errors,technology.message],warnings,items:[],choices:[],technology};
    const pvcTurn=kit.family!=='aluminum'&&['turn','fanlight','door','stulp-bolts','stulp-drive'].includes(kit.openingType);
    if(kit.openingType==='fanlight'&&(params.hingeType||kit.hingeType||'standard')!=='standard')errors.push('Для фрамужной комплектации доступна только заданная петлевая группа.');
    if(kit.openingType==='door'&&((params.hingeType||kit.hingeType||'standard')!=='standard'||!kit.dornmassChoices?.includes(dornmass)))errors.push('Для этой дверной комплектации выберите стандартные петли и дорнмасс 25 или 35 мм.');
    if(pvcTurn&&kit.note)warnings.push(kit.note);
    const dimensionChoices=candidates(kit,params.width,params.height),choices=dimensionChoices.filter(c=>!c.drive||dornAlternative(db,c.drive,dornmass));
    let chosen=selection&&choices.find(c=>c.rowId===selection.rowId&&c.colId===selection.colId&&c.drive===selection.drive);
    if(!chosen&&choices.length===1)chosen=choices[0];
    if(!dimensionChoices.length){errors.push('Для этих размеров нет диапазона.');errors.push('Допустимая ширина: '+kit.columns.map(c=>c.from+'–'+c.to).join(', ')+' мм.');errors.push('Допустимая высота: '+kit.rows.map(r=>r.from+'–'+r.to).join(', ')+' мм.');}
    else if(!choices.length)errors.push('Для выбранного дорнмасса нет подходящего привода в базе номенклатуры.');
    if(!chosen)return {errors,warnings,items:[],choices,needsChoice:choices.length>1};
    const row=kit.rows.find(r=>r.id===chosen.rowId),col=kit.columns.find(c=>c.id===chosen.colId),bom=cell(db,kit,row,col,params);
    if(!bom.reviewed)warnings.push('Состав ячейки ещё не отмечен как проверенный.');
    if(!kit.profile&&kit.calculationMode!=='generic')warnings.push('В комплектации не указан профиль / паз.');
    let items=copy(bom.items);
    const recipePlates=items.filter(i=>i.art==='PLS').map(i=>({...i}));
    const side=params.side||kit.side||'R',opts=params.options||kit.options,seriesEnabled=params.optionSeries!=null||kit.optionSeries!=null,series=String(params.optionSeries||kit.optionSeries||'13');
    if(!['R','L'].includes(side))errors.push('Выберите правое или левое открывание.');
    if(opts){
      if(pvcTurn&&(opts.microvent||opts.lifter||opts.bprEnabled))errors.push('Эти опции доступны только для поворотно-откидного открывания.');
      if(kit.openingType==='door'&&opts.handleEnabled)errors.push('Для дверной системы гарнитур и цилиндр подбираются отдельно.');
      if(kit.openingType==='stulp-bolts'&&opts.handleEnabled)errors.push('Пассивная штульповая створка со шпингалетами не имеет ручки.');
      const handleArticles=Object.entries(db.articles).filter(([art,a])=>isWindowHandle(art,a)).map(([art])=>art);
      const groups={microvent:['XZMV.9','XZMV.13','ZMV.9','ZMV.13'],lifter:['MBU','ZM9.Z','ZM13.Z','ZM9.P','ZM13.P'],plsEnabled:['PLS'],bprEnabled:['BPR'],handleEnabled:handleArticles};
      const aluminumProfile=String(params.aluminumProfile||kit.aluminumProfile||'14'),aluPrefix=aluminumProfile==='10'?'AL02':'AL';
      Object.assign(groups,{aluLifter:['MBU','AL.ZM9','AL02.ZM9'],aluPlate:['PLS'],aluTravelLimiter:['OZ','OZ1'],aluSupport:['RSP','AL.OR-09R','AL.OR-09L','AL02.OR-09R','AL02.OR-09L'],aluLimiter:['AL.OUS','AL02.OUS'],aluFixingPlate:['PLD'],aluClip:['KF'],aluDriveEnd:['OP'],aluSecurityPlate:['PLV']});
      const alu=kit.family==='aluminum',additions={microvent:[(kit.variant==='roller8'?'ZMV.':'XZMV.')+series],lifter:['MBU','ZM'+series+'.Z'],plsEnabled:['PLS'],bprEnabled:['BPR'],aluLifter:alu?['MBU',aluPrefix+'.ZM9']:[],aluPlate:alu?['PLS']:[],aluTravelLimiter:alu?['OZ']:[],aluSupport:alu?['RSP',aluPrefix+'.OR-09R']:[],aluLimiter:alu?[aluPrefix+'.OUS']:[],aluFixingPlate:alu?['PLD']:[],aluClip:alu?['KF']:[],aluDriveEnd:alu?['OP']:[],aluSecurityPlate:alu?['PLV']:[]};
      const pvcOnly=new Set(['microvent','lifter','plsEnabled','bprEnabled']);
      for(const flag of Object.keys(groups))if(typeof opts[flag]==='boolean'&&!((alu&&pvcOnly.has(flag))||(!alu&&flag.startsWith('alu')))){
        const present=items.filter(i=>groups[flag].includes(i.art));
        items=items.filter(i=>!groups[flag].includes(i.art));
        if(flag==='handleEnabled'&&opts[flag]){
          const selected=params.handleArticle||kit.handleArticle||(has(db.articles,'RP')?'RP':handleBases(db)[0]?.[0]),color=params.handleColor||kit.handleColor||'white',colored=handleArticleForColor(db,selected,color);
          if(!selected||!colored)errors.push('Выберите модель и цвет ручки из базы артикулов.');else items.push(rowItem(colored,1,'handle'));
        }else if(opts[flag])items.push(...(['aluSupport','aluLifter'].includes(flag)?additions[flag].map(a=>rowItem(a)):(present.length?present:additions[flag].map(a=>rowItem(a)))));
      }
    }
    for(const it of items){
      let target='';
      if(seriesEnabled&&kit.family!=='aluminum'&&/^SV\.(09|10|13|14)$/.test(it.art))target=series==='9'?'SV.09':'SV.13';
      if(kit.openingType==='fanlight'&&/^FPR\.(9|13)$/.test(it.art))target=series==='9'?'FPR.9':'FPR.13';
      if(pvcTurn&&/^ZUSP\.(09|13)$/.test(it.art))target=series==='9'?'ZUSP.09':'ZUSP.13';
      if(seriesEnabled&&series==='9'&&/^ZK\.\d+$/.test(it.art))target=it.art.replace(/^ZK\./,'ZK9.');
      if(seriesEnabled&&series==='13'&&/^ZK9\.\d+$/.test(it.art))target=it.art.replace(/^ZK9\./,'ZK.');
      if(seriesEnabled&&series==='9'&&/^(?:XZMV|ZMV)\.13$/.test(it.art))target=it.art.replace(/\.13$/,'.9');
      if(seriesEnabled&&series==='13'&&/^(?:XZMV|ZMV)\.9$/.test(it.art))target=it.art.replace(/\.9$/,'.13');
      if(seriesEnabled&&series==='9'&&/^ZM13\.[ZP]$/.test(it.art))target=it.art.replace(/^ZM13\./,'ZM9.');
      if(seriesEnabled&&series==='13'&&/^ZM9\.[ZP]$/.test(it.art))target=it.art.replace(/^ZM9\./,'ZM13.');
      if(target){if(has(db.articles,target))it.art=target;else errors.push(it.art+': в базе нет совместимой детали для выбранного паза.');}
    }
    const hingeType=params.hingeType||kit.hingeType||'standard';
    if(!['standard','reinforced130','hidden','rebated'].includes(hingeType))errors.push('Выберите вариант петель.');

    const turnOnly=kit.family!=='aluminum'&&kit.openingType==='turn';
    if(hingeType==='rebated'&&!turnOnly)errors.push('Фальцевая петля доступна только для поворотной створки.');
    if(turnOnly&&hingeType==='rebated'){
      if(!['9','13'].includes(series))errors.push('Для выбранного паза петлевая группа не настроена.');
      else {items=items.filter(i=>!/^SN(?:\.|$)|^N\.SN\.|^SF\.|^N\.3DS\./.test(i.art));items.push(rowItem('SF.'+series+'.'+side),rowItem('N.3DS.'+side+'.B'));}
    }
    if(turnOnly&&hingeType==='hidden'){
      const axis=series==='9'?'09':'13',profile=params.hiddenProfile||kit.hiddenProfile;
      const selectedProfile=params.strikeProfile||kit.strikeProfile,expectedProfile={'KBE 09':'K','KBE 13':'K','REHAU':'R','VEKA 13 / VHS':'V','Gealan/Ivaper':'G'}[selectedProfile];
      if(selectedProfile&&(!expectedProfile||profile!==expectedProfile))errors.push('Подкладка скрытой петли не подтверждена для выбранного профиля.');
      if(!['9','13'].includes(series)||!['K','V','R','G'].includes(profile)||params.width<450||params.width>1200)errors.push('Для выбранной системы и размеров скрытая петлевая группа не настроена.');
      else {
        items=items.filter(i=>!(/^(?:RV|RN|SN|PK)(?:\.|$)|^SV\.\d|^N\.(?:RV|SV|SN|RN)|^SF\.|^N\.3DS\.|^SPK-|^SNP-|^P\.SP|^N\.SP-/.test(i.art)));
        const suffix={white:'',brown:'.K',anthracite:'.A',black:'.BLACK'}[params.coverColor||kit.coverColor||'white']||'';
        items.push(rowItem('SPK-'+axis+'.'+side),rowItem('SNP-'+axis+'.'+side),rowItem('P.SP'+(profile==='V'?'K':profile)+'-'+side,2),rowItem('N.SP-'+side+suffix));
        // Exposed clamps are not hinges; do not silently keep them in a concealed assembly.
        const clamps=items.filter(i=>/^(?:PN\.[RS]|PS\.(?:S|R9|R13))$/.test(i.art));
        if(clamps.length)errors.push('Прижимы поворотной створки требуют проверки для скрытых петель.');
        warnings.push('Поворотные скрытые петли: SPK + SNP. Проверьте нагрузку и прижимы по монтажной схеме.');
      }
    }
    if(hingeType==='hidden'&&!turnOnly){
      const profile=params.hiddenProfile||kit.hiddenProfile,axis=series==='9'?'09':'13';
      if(kit.family==='aluminum'||pvcTurn||!['roller11','roller8','mushroom'].includes(kit.variant)||!['9','13'].includes(series)||!['K','V','R'].includes(profile)||params.width<450||params.width>1200||(kit.variant==='mushroom'&&params.width<=600)){
        errors.push('Для выбранной системы и размеров скрытая петлевая группа не настроена.');
      }else{
        const size=params.width<=600?600:params.width<=800?800:params.width<=1000?1000:1200;
        const sc=size===600?'SNO.600':(kit.variant==='roller11'?'XSNO.':'SNO.')+size+'-1'+(kit.variant==='mushroom'?'.V':'');
        const managed=art=>/^(?:RV|RN|SN)(?:\.|$)|^SV\.\d|^N\.(?:RV|SV|SN|RN)|^(?:X?NO|X?SNO)\.|^(?:XPNB|PNB|PNF)\.|^RSNO\.|^SNP-|^P\.SP|^N\.SP-/.test(art);
        items=items.filter(i=>i.role!=='scissors'&&!managed(i.art));
        const suffix={white:'',brown:'.K',anthracite:'.A',black:'.BLACK'}[params.coverColor||kit.coverColor||'white']||'';
        items.push(rowItem(sc,1,'scissors'),rowItem('RSNO.'+(params.width<=800?313:413)+'-'+axis+'.'+side),rowItem('SNP-'+axis+'.'+side),rowItem('P.SP'+(profile==='V'?'K':profile)+'-'+side,2),rowItem('N.SP-'+side+suffix));
        if(params.height>=700)items.push(rowItem({roller11:'XPNB.S.200-1',roller8:'PNF.S.200-1',mushroom:'PNF.S.V.200-1'}[kit.variant]));
        items=items.filter(i=>!/^(?:X?USP|X?ZSP)\b/.test(i.art));
        const lower={roller11:'XU.2',roller8:'U1.2',mushroom:'U2.2'}[kit.variant],strike=params.hiddenStrike||kit.hiddenStrike;
        if(!strike||!hiddenStrikeFits(strike,profile,series)||!has(db.articles,strike))errors.push('Выберите совместимый откидной зацеп для профиля и паза.');
        else{items=items.filter(i=>!/^ZUO\./.test(i.art));if(!items.some(i=>i.art===lower))items.push(rowItem(lower));items.push(rowItem(strike));}
        warnings.push('Проверьте точки запирания, нагрузку и профильные ответные планки по каталогу.');
        if(params.height>900||params.height<700)warnings.push('Привод и удлинители ножниц требуют проверки по монтажной схеме.');
      }
    }
    if(hingeType==='reinforced130'){
      if(params.width<=650)errors.push('Усиленные петли 130 кг доступны при ширине створки больше 650 мм.');
      else for(const it of items){
        const target={RV:'RV.U',RN:'RN.U',SN:'SN.U'}[it.art];
        if(target){if(has(db.articles,target))it.art=target;else errors.push('В базе нет усиленной петли '+target+'.');}
      }
    }
    const coverEnabled=params.coverColor!=null||kit.coverColor!=null,coverColor=params.coverColor||kit.coverColor||'white';
    if(!['white','brown','anthracite','black'].includes(coverColor))errors.push('Выберите цвет накладок.');
    // Меняем сторону только у сегментов артикула .R/.L или 09R/09L. Более общая
    // замена букв R/L опасна: они встречаются в несвязанных обозначениях деталей.
    for(const it of items){
      const article=db.articles[it.art];if(!coverEnabled||/^N\.SP-/.test(it.art)||!/накладк/i.test(article?.name||''))continue;
      const base=it.art.replace(/\.(?:B|K|A|BLACK)\.?$/,'');
      if(base===it.art)continue;
      const suffix={white:'B',brown:'K',anthracite:'A',black:'BLACK'}[coverColor],target=base+'.'+suffix;
      if(has(db.articles,target))it.art=target;else errors.push(it.art+': в базе нет накладки выбранного цвета.');
    }
    if(kit.family==='aluminum'){
      const aluminumProfile=String(params.aluminumProfile||kit.aluminumProfile||'14');
      if(!['14','10'].includes(aluminumProfile))errors.push('Выберите профиль ALU 14 или ALU 10.');
      else for(const it of items){
        const target=aluminumProfile==='10'?it.art.replace(/^AL\./,'AL02.'):it.art.replace(/^AL02\./,'AL.');
        if(target!==it.art&&has(db.articles,target))it.art=target;
      }
    }
    for(const it of items){
      const dotted=it.art.match(/\.([RL])(?=\.|$)/),numbered=it.art.match(/(\d{2})([RL])(?=\.|$)/),current=dotted?.[1]||numbered?.[2];
      if(current&&current!==side){const target=dotted?it.art.replace(/\.[RL](?=\.|$)/,'.'+side):it.art.replace(/(\d{2})[RL](?=\.|$)/,'$1'+side),isHanded=/прав|лев/i.test(db.articles[it.art]?.name||'');if(has(db.articles,target))it.art=target;else if(isHanded)errors.push(it.art+': в файле нет парной детали '+target+' для выбранного открывания.');}
    }
    const lowerNode=params.lowerNode||kit.lowerNode||'catalog';
    const chain=chainPlan(db,kit,params);
    if(chain){errors.push(...chain.errors);warnings.push(...chain.reviewReasons,...chain.warnings);if(!chain.errors.length)items=applyChain(items,chain,errors);}
    if(!chain&&lowerNode!=='catalog'){
      if(!['bolt','security'].includes(lowerNode)||!lowerNodeSupported(kit)||hingeType==='hidden')errors.push('Для этой комплектации смена нижнего узла не подтверждена.');
      else {
        const from=lowerNode==='security'?'XUSP':'XU.2',to=lowerNode==='security'?'XU.2':'XUSP';
        const existing=items.filter(i=>i.art===from||i.art===to);
        const frame=items.filter(i=>['tiltBolt','tiltSecurity'].includes(strikeRole(i.art)));
        // An arbitrary hand-edited BOM is not enough to reconstruct an absent lower node.
        if(existing.length!==1||existing[0].qty!==1||!items.some(i=>/^XPNB\./.test(i.art))||frame.length!==1||frame[0].qty!==1)errors.push('Состав нижнего узла требует проверки в конструкторе.');
        else {
          existing[0].art=to;
          const plan=strikePlan(db,kit,params),role=lowerNode==='security'?'tiltSecurity':'tiltBolt';
          const chosen=plan?.roles[role]?.art;
          if(!chosen)errors.push('Выберите профиль ответных планок.');
          else {frame[0].art=chosen;frame[0].dependency={parent:to,ratio:1};}
        }
      }
    }
    const strikeSelection=strikePlan(db,kit,params);
    if(strikeSelection){
      errors.push(...strikeSelection.errors);
      for(const it of items){
        const role=strikeRole(it.art),choice=strikeSelection.roles[role];if(!choice)continue;

        // Explicit hidden-system selection has priority unless a manual role override was entered.
        if(hingeType==='hidden'&&role==='tiltSecurity'&&!choice.manual)continue;
        const target=choice.art;
        if(!target||!has(db.articles,target)||db.articles[target].available===false){errors.push('Ответная планка отсутствует или недоступна: '+(target||role));continue;}
        it.art=target;
        if(choice.manual){it.compatibilityApproved=true;it.manualStrike=true;warnings.push('Ручная замена ответной планки: '+target);}
        else if(choice.fallback)warnings.push('Окончание артикула недоступно для профиля; предложен вариант: '+target);
      }
      if(strikeSelection.adapter&&items.some(i=>strikeRole(i.art))&&!items.some(i=>i.art===strikeSelection.adapter))warnings.push('Для профиля предусмотрен адаптер APD. Количество адаптеров проверьте по монтажной схеме.');
    }
    if(kit.family!=='aluminum'&&hingeType!=='hidden'){
      for(const [parent,role] of [['XUSP','tiltBolt'],['XU.2','tiltSecurity']]){
        const source=items.filter(i=>i.art===parent),targets=items.filter(i=>strikeRole(i.art)===role);
        if(source.length===1&&source[0].qty===1&&targets.length===1&&targets[0].qty===1)targets[0].dependency={parent,ratio:1};
      }
    }
    const generic=kit.calculationMode==='generic';
    let drive=items.find(i=>i.role==='drive');
    if(!drive&&!generic){drive=rowItem(chosen.drive||'',1,'drive');items.unshift(drive);}
    if(chosen.drive&&(selection||!drive.art||!kit.cells[key(row,col)]))drive.art=chosen.drive;
    if(drive?.art){const target=dornAlternative(db,drive.art,dornmass);if(target)drive.art=target;else errors.push(drive.art+': в базе нет варианта с дорнмассом '+dornmass+' мм.');}
    if(technology?.ok){if(drive)drive.art=technology.drive;if(items.some(i=>/^(?:XU\.400-1U|UF\.400-1U|X?UF\.)/.test(i.art)))errors.push('Удлинитель в ячейке конфликтует с прямым соединением привода.');warnings.push(technologyText(technology));}
    if(!generic&&!items.some(i=>i.role==='drive'&&i.art))errors.push('Не выбран поворотно-откидной привод.');
    if(!generic&&!pvcTurn&&(kit.family!=='aluminum'||(kit.openingType!=='turn'&&kit.openingType!=='stulp'))&&!items.some(i=>i.role==='scissors'&&i.art))errors.push('Не выбраны ножницы.');
    if((params.hardwareFinish||kit.hardwareFinish)==='black'){
      const unchanged=[];let replaced=0;
      for(const it of items){if(it.manualStrike)continue;const a=db.articles[it.art],target=a?.blackVariant;if(target&&db.articles[target]){it.art=target;replaced++;}else if(a?.finish!=='black'&&!it.art.includes('.BLACK'))unchanged.push(it.art);}
      if(!replaced&&!items.some(it=>it.art.includes('.BLACK')))errors.push('Для выбранного состава чёрные исполнения не подтверждены каталогом.');
      if(unchanged.length)warnings.push('Стандартное исполнение без подтверждённой чёрной замены: '+[...new Set(unchanged)].join(', '));
    }
    if((params.hardwareFinish||kit.hardwareFinish)==='black')for(const it of items)if(it.chainZone&&it.dependency){const target=db.articles[it.dependency.parent]?.blackVariant;if(target&&items.some(i=>i.art===target))it.dependency.parent=target;}
    const autoPlates=kit.family==='aluminum'?opts?.aluPlate===true:opts?.plsEnabled===true;
    let plateCalculation;
    if(autoPlates){
      const source=bom.plateConnections||kit.plateConnections;
      const verified=Array.isArray(source)&&source.length>0&&source.every(c=>c.verified===true&&c.id&&c.from&&c.to&&c.from!==c.to&&['single','double'].includes(c.cut)&&items.some(i=>i.art===c.from||i.role===c.from)&&items.some(i=>i.art===c.to||i.role===c.to));
      if(verified){
        const connections=resolvePlateConnections(items,source,params.count);
        items=items.filter(i=>i.art!=='PLS');
        const quantity=plateTotal(items.map(i=>({...i,qty:i.qty*params.count})),0,connections);
        if(quantity>0)items.push(rowItem('PLS',quantity/params.count,'plate'));
        plateCalculation={rule:'verified-joints-v2',connections,quantity};
      }else{
        // Preserve actual recipe rows, never the option group's synthetic one-plate fallback.
        items=items.filter(i=>i.art!=='PLS');items.push(...recipePlates);
        warnings.push('PLS: схема соединений не проверена. Сохранено количество из комплектации; проверьте его вручную.');
        plateCalculation={rule:'unverified',quantity:items.filter(i=>i.art==='PLS').reduce((n,i)=>n+i.qty*params.count,0)};
      }
    }
    const totals=new Map();
    for(const it of items){
      const a=db.articles[it.art];
      if(!it.art||!a){errors.push(it.art?'В файле нет артикула '+it.art+'. Добавьте его в базу конструктора с ценой.':'В составе есть незаполненная деталь.');continue;}
      if(a.variants?.length&&!a.variants.includes(kit.variant)&&it.art!=='NO.600'&&!it.compatibilityApproved)errors.push(it.art+': не соответствует виду цапфы.');
      for(const axis of ['width','height']){const value=kit.driveAxis==='width'&&it.role==='drive'?(axis==='height'?params.width:params.height):params[axis];if(a[axis]&&(value<a[axis].min||value>a[axis].max))errors.push(it.art+': размер вне каталожного диапазона.');}
      if(a.price==null)errors.push(it.art+': не задана цена.');
      const old=totals.get(it.art);if(old){old.qty+=it.qty*params.count;if(it.chainZone&&it.dependency){old.dependencies??=[];if(!old.dependencies.some(d=>d.parent===it.dependency.parent&&d.ratio===it.dependency.ratio))old.dependencies.push({...it.dependency});}}else totals.set(it.art,{art:it.art,name:a.name,price:a.price,qty:it.qty*params.count,...(it.dependency?(it.chainZone?{dependencies:[{...it.dependency}]}:{dependency:it.dependency}):{}),...(it.chainZone?{chainZone:it.chainZone}:{}),...(strikeRole(it.art)?{strikeRole:strikeRole(it.art)}:{})});
    }
    const result=[...totals.values()];return {errors:[...new Set(errors)],warnings,items:result,choices,chosen,technology,...(chain?{chainCalculation:chain}:{}),...(plateCalculation?{plateCalculation}:{}),total:errors.length?null:result.reduce((s,i)=>s+i.price*i.qty,0)};
  }
  function importOld(old){
    if(old.schemaVersion===2)return copy(old);
    if(old.schemaVersion!==1||!old.articles||!Array.isArray(old.kits))throw Error('Неизвестный формат файла');
    const out={schemaVersion:2,format:'futuruss-matrix',articles:copy(old.articles),kits:[]};
    for(const k of old.kits){
      const wg=k.groups.find(g=>g.rows?.some(r=>r.when?.width)&&/ножниц/i.test(g.name)),hg=k.groups.find(g=>/поворотно-откидной привод/i.test(g.name));
      if(!wg||!hg)continue;
      const rr=r=>({from:r.min+(r.includeMin===false?1:0),to:r.max-(r.includeMax===false?1:0)});
      const columns=normalize(wg.rows.filter(r=>r.enabled!==false&&r.when.width).map((r,i)=>({...rr(r.when.width),id:'w'+i}))),rows=normalize(hg.rows.filter(r=>r.enabled!==false&&r.when.height).map((r,i)=>({...rr(r.when.height),id:'h'+i,drives:r.items.map(x=>x.art)})));
      if(!columns.length||!rows.length)continue;
      const common=k.groups.flatMap(g=>g.rows.filter(r=>r.enabled!==false&&Object.keys(r.when).length===0).flatMap(r=>r.items.map(i=>rowItem(i.art,i.qty))));
      const converted={id:k.id,variant:k.variant,name:k.name,profile:'',side:'R',handle:k.handle||'center',handleColor:'white',coverColor:'white',note:'Импорт из прежнего конструктора. Условия стороны, паза и размерных дополнительных блоков проверьте в составе ячеек.',columns,rows,common,cells:{}};
      converted.legacy=copy(k);out.kits.push(converted);
    }
    if(!out.kits.length)throw Error('В файле нет размерных таблиц. Исходные данные не изменены.');return out;
  }
  root.MatrixCore={chainRules,chainSupported,inferredLowerNode,chainReviewKey,chainPlan,replaceCommon,tiltFirstWorkbookProfiles,plateUnits,plateTotal,resolvePlateConnections,strikeAlternatives,lowerNodeSupported,strikeDefaults,strikeRole,strikePlan,hiddenStrikeFits,handleTechnology,technologyText,variants,handleColors,copy,uid,key,fits,normalize,initial,cell,candidates,dornAlternative,validate,calculate,importOld,rowItem,isWindowHandle,handleBaseArt,handleBases,handleArticleForColor,ensureHandleColors};
  if(typeof module!=='undefined')module.exports=root.MatrixCore;
})(typeof globalThis!=='undefined'?globalThis:this);
