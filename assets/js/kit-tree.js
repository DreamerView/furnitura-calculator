/* Constructor navigation only: never modifies catalogue or BOM data. */
(function(root){
'use strict';
function groups(kits){const result=[];for(const family of ['pvc','aluminum']){const branches=new Map();for(const kit of kits){if((kit.family==='aluminum'?'aluminum':'pvc')!==family)continue;const kind=kit.openingType||'tilt-turn';if(!branches.has(kind))branches.set(kind,[]);branches.get(kind).push(kit);}result.push({family,branches:[...branches].map(([kind,kits])=>({kind,kits}))});}return result;}
function create({main,families,variants,onSelect}){
 const make=(tag,cls,text)=>{const n=document.createElement(tag);n.className=cls;if(text)n.textContent=text;return n;};
 const shell=make('div','kit-workspace'),aside=make('aside','kit-browser'),right=make('div','kit-workspace-main');shell.id='kitWorkspace';
 families.before(shell);shell.append(aside,right);right.append(families,variants,main);variants.classList.add('kit-legacy-navigation');families.append(variants.querySelector('#copyKit'));variants.hidden=true;
 const heading=make('h2','','Дерево комплектаций'),search=make('input','kit-tree-search'),tree=make('nav','kit-tree');search.type='search';search.placeholder='Поиск комплектации';search.setAttribute('aria-label','Поиск комплектации');tree.setAttribute('aria-label','Дерево комплектаций');aside.append(heading,search,tree);
 let kits=[],active='',lastActive='',query='';const expanded=new Set(['root']);
 function draw(){const scroll=tree.scrollTop;tree.replaceChildren();const current=kits.find(k=>k.id===active),changed=lastActive!==active;if(changed&&current){const f=current.family==='aluminum'?'aluminum':'pvc';expanded.add('root');expanded.add(f);expanded.add(f+'/'+(current.openingType||'tilt-turn'));}lastActive=active;
  function folder(parent,key,label){const d=make('details','kit-folder'),s=make('summary','',label);d.open=!!query||expanded.has(key);d.append(s);parent.append(d);d.addEventListener('toggle',()=>{if(!query){if(d.open)expanded.add(key);else expanded.delete(key);}});return d;}
  const top=folder(tree,'root','FUTURUSS');let visible=0;
  for(const group of groups(kits)){const matching=group.branches.map(b=>({...b,kits:b.kits.filter(k=>(k.name+' '+k.id+' '+(root.MatrixCore?.variants[k.variant]||'')).toLocaleLowerCase().includes(query))})).filter(b=>b.kits.length);if(!matching.length)continue;
   const f=folder(top,group.family,group.family==='pvc'?'ПВХ':'Алюминий');
   for(const branch of matching){const g=folder(f,group.family+'/'+branch.kind,root.FuturussCamSelector?.openings[branch.kind]||({stulp:'Штульповая',arched:'Арочная',trapezoid:'Трапециевидная'}[branch.kind])||'Другие комплектации');
    for(const k of branch.kits){visible++;const b=make('button','kit-tree-item'+(k.id===active?' active':''));b.type='button';b.dataset.kitId=k.id;b.title=k.name;b.append(make('span','',k.name));if(k.catalogDraft)b.append(make('small','kit-tree-draft','Требует проверки'));if(k.id===active)b.setAttribute('aria-current','page');b.onclick=()=>onSelect(k.id);g.append(b);}
   }
  }
  if(!visible)tree.append(make('p','kit-tree-empty','Ничего не найдено'));
  tree.scrollTop=scroll;if(changed)tree.querySelector('[aria-current]')?.scrollIntoView({block:'nearest'});
 }
 search.addEventListener('input',()=>{query=search.value.trim().toLocaleLowerCase();draw();});
 return {render(list,id){kits=list;active=id;draw();}};
}
root.FuturussKitTree={groups,create};
})(globalThis);
