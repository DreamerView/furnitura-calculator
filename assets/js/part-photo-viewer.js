/* Read-only article photos; the composition editor stays open underneath. */
(function(root){
'use strict';
let dialog;
function sources(record){return (Array.isArray(record?.photos)?record.photos:[]).map(p=>typeof p==='string'?p:p?.src||p?.url||'').filter(src=>{try{const u=new URL(src,document.baseURI);return ['http:','https:'].includes(u.protocol)||/^data:image\/(png|jpeg|webp|gif);base64,/i.test(src);}catch{return false;}});}
function show(art,record={}){
 if(!dialog){dialog=document.createElement('dialog');dialog.className='bom-photo-dialog';dialog.setAttribute('aria-labelledby','bomPhotoTitle');document.body.append(dialog);}
 dialog.replaceChildren();const head=document.createElement('div');head.className='bom-photo-header';const title=document.createElement('h2');title.id='bomPhotoTitle';title.textContent=art+' · '+(record.name||'');const close=document.createElement('button');close.type='button';close.textContent='×';close.setAttribute('aria-label','Закрыть фото');close.onclick=()=>dialog.close();head.append(title,close);dialog.append(head);
 const photos=sources(record),body=document.createElement('div');body.className='bom-photo-content';dialog.append(body);
 if(!photos.length){const empty=document.createElement('p');empty.textContent='Фото детали не добавлено';body.append(empty);}else{
  const image=document.createElement('img');image.alt=record.name||art;const error=document.createElement('p');error.textContent='Не удалось загрузить фото';error.hidden=true;image.onerror=()=>{image.hidden=true;error.hidden=false;};body.append(image,error);
  const thumbs=document.createElement('div');thumbs.className='bom-photo-thumbs';dialog.append(thumbs);
  function select(index){image.hidden=false;error.hidden=true;image.src=photos[index];for(const [i,button] of [...thumbs.children].entries())button.setAttribute('aria-pressed',String(i===index));}
  photos.forEach((src,index)=>{const button=document.createElement('button');button.type='button';button.textContent=String(index+1);button.title=art+' · '+(index+1);button.onclick=()=>select(index);thumbs.append(button);});select(0);if(photos.length===1)thumbs.hidden=true;
 }
 if(!dialog.open)dialog.showModal();
}
root.FuturussPartPhotos={show,sources};
})(globalThis);
