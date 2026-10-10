(()=>{'use strict';
 const words={ru:['Загружается изображение. Ожидайте…','Загружаются рекламные файлы. Ожидайте…'],en:['Uploading image. Please wait…','Uploading advertising files. Please wait…'],tr:['Görsel yükleniyor. Lütfen bekleyin…','Reklam dosyaları yükleniyor. Lütfen bekleyin…']};
 const lang=()=>{try{return globalThis.FuturussI18n?.state?.language||globalThis.FuturussI18n?.language||window.opener?.FuturussI18n?.language||globalThis.FuturussStore?.getItem('futuruss.language')||'ru';}catch{return 'ru';}};
 let loader=null,depth=0,kind='image';
 function label(){if(loader)loader.querySelector('p').textContent=(words[lang()]||words.ru)[kind==='image'?0:1];}
 globalThis.FuturussUploadUI={begin(type='image'){kind=type;depth++;if(!loader){loader=document.createElement('dialog');loader.id='globalUploadPreloader';loader.setAttribute('data-i18n-ignore','');loader.setAttribute('aria-label','Upload');loader.innerHTML='<div class="upload-preloader-content" role="status" aria-live="polite"><span class="upload-preloader-spinner" aria-hidden="true"></span><p></p></div>';loader.addEventListener('cancel',e=>e.preventDefault());document.body.append(loader);document.body.setAttribute('aria-busy','true');loader.showModal();}label();let done=false;return()=>{if(done)return;done=true;if(--depth===0){loader?.close();loader?.remove();loader=null;document.body.removeAttribute('aria-busy');}};},paint:()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)))};
 window.addEventListener('futuruss:language',label);
 // All advertising surfaces share one slide and one playback clock.
 // Shared local media URLs allow accurate seeking on endpoints without byte-range support.
 const videoSources=new Map();
 function videoSource(src){if(!videoSources.has(src))videoSources.set(src,fetch(src,{credentials:'same-origin'}).then(r=>{if(!r.ok)throw Error('Video unavailable');return r.blob();}).then(blob=>URL.createObjectURL(blob)).catch(()=>src));return videoSources.get(src);}
 const players=new Map(),copy={ru:['Реклама','Закрыть','Предыдущая реклама','Следующая реклама','Открыть рекламу','Время показа'],en:['Advertisement','Close','Previous advertisement','Next advertisement','Open advertisement','Playback progress'],tr:['Reklam','Kapat','Önceki reklam','Sonraki reklam','Reklamı aç','Oynatma ilerlemesi']};
 const text=()=>copy[lang()]||copy.ru;
 let items=[],key='',index=0,elapsed=0,duration=10,master=null,viewer=null,viewerHost=null,progress=null,timeLabel=null,counter=null,origin=null,frame=0,last=performance.now(),playing=false,failed=false;
 function active(host){return !document.hidden&&host.isConnected&&!host.hidden&&host.getClientRects().length>0;}
 function play(video){video?.play().catch(()=>{});}
 function stop(state){const node=state.node;if(node?.tagName==='VIDEO'){if(node===master){master=[...players.values()].find(s=>s!==state&&s.node?.tagName==='VIDEO'&&s.host.isConnected)?.node||null;if(master){try{master.currentTime=elapsed;}catch{}}}node.pause();node.removeAttribute('src');node.load();}state.container.remove();}
 function synchronize(){if(!master||failed)return;for(const state of players.values()){const video=state.node;if(video?.tagName!=='VIDEO'||video===master||video.readyState<1)continue;const diff=master.currentTime-video.currentTime;if(!video.seeking&&Math.abs(diff)>.4&&performance.now()-(video.syncSeekAt||0)>1000){video.syncSeekAt=performance.now();try{video.currentTime=master.currentTime;}catch{}}if(!video.seeking)video.playbackRate=Math.abs(diff)<.05?1:1+Math.max(-.08,Math.min(.08,diff*.1));if(active(state.host)&&video.paused&&!video.ended&&video.readyState>=2)play(video);}}
 function render(state){
  const old=state.node;if(old?.tagName==='VIDEO'){old.pause();old.removeAttribute('src');old.load();}
  state.container.replaceChildren();state.container.dataset.slide=String(index);if(!items.length)return;
  const item=items[index],node=document.createElement(item.type==='video'?'video':'img');state.node=node;node.className='advertising-carousel-media';
  if(item.type==='video'){
   node.muted=true;node.defaultMuted=true;node.autoplay=true;node.playsInline=true;node.controls=false;node.preload='auto';node.setAttribute('muted','');node.setAttribute('playsinline','');if(!master)master=node;
   node.addEventListener('loadedmetadata',()=>{if(node===master){if(Number.isFinite(node.duration)&&node.duration>0)duration=node.duration;}else if(master){try{node.currentTime=master.currentTime;}catch{}}if(active(state.host))play(node);paint();});
   node.addEventListener('timeupdate',()=>{if(node===master){synchronize();paint();}});
   node.addEventListener('ended',()=>{if(node===master)advance(1);});node.addEventListener('error',()=>{if(node===master){failed=true;duration=10;elapsed=0;}});
  }else node.alt=item.name||text()[0];
  state.container.append(node);if(node.tagName==='VIDEO'){videoSource(item.src).then(src=>{if(state.node===node&&node.isConnected){node.src=src;if(active(state.host))play(node);}});}else node.src=item.src;
 }
 function orderedPlayers(){return [...players.values()].sort((a,b)=>Number(!a.host.closest('#constructorAdPreview'))-Number(!b.host.closest('#constructorAdPreview')));}
 function resetVideo(){if(master){master.pause();master.removeAttribute('src');master.load();master=null;}}
 function advance(delta){if(!items.length)return;index=(index+delta+items.length)%items.length;elapsed=0;duration=10;failed=false;resetVideo();for(const state of orderedPlayers())render(state);paint();}
 function attach(host){if(players.has(host))return;const container=document.createElement('div');container.className='advertising-carousel';host.append(container);const state={host,container,node:null};players.set(host,state);render(state);}
 function paint(){if(!viewer)return;if(master&&!failed){elapsed=master.currentTime||0;if(Number.isFinite(master.duration)&&master.duration>0)duration=master.duration;}const value=Math.min(1,Math.max(0,elapsed/(duration||10)));progress.value=value;const unit={ru:'с',en:'s',tr:'sn'}[lang()]||'s',time=Math.floor(elapsed)+' / '+Math.ceil(duration)+' '+unit,title=text()[0]+' · '+(index+1)+' / '+items.length;if(timeLabel.textContent!==time)timeLabel.textContent=time;if(counter.textContent!==title)counter.textContent=title;if(progress.getAttribute('aria-label')!==text()[5])progress.setAttribute('aria-label',text()[5]);}
 function tick(now){
  const delta=Math.max(0,(now-last)/1000);last=now;
  const visible=[...players.values()].filter(state=>active(state.host));const running=visible.length>0;
  if(running!==playing){playing=running;for(const state of players.values())if(state.node?.tagName==='VIDEO'){if(running&&active(state.host))play(state.node);else state.node.pause();}}
  if(running&&items.length){
   if(items[index].type==='video'&&!failed){
    if(master){if(master.paused&&!master.ended&&master.readyState>=2)play(master);elapsed=master.currentTime||0;if(Number.isFinite(master.duration)&&master.duration>0)duration=master.duration;
     synchronize();
    }
   }else{elapsed+=delta;if(elapsed>=duration)advance(1);}
  }
  paint();frame=requestAnimationFrame(tick);
 }
 function icon(name,label,handler){const button=document.createElement('button');button.type='button';button.className='preview-viewer-button';button.setAttribute('aria-label',label);button.innerHTML='<span class="ui-icon i-'+name+'" aria-hidden="true"></span>';button.onclick=handler;return button;}
 function cleanup(dialog,host,focus){const state=players.get(host);if(state){stop(state);players.delete(host);}dialog.remove();if(viewer===dialog){viewer=null;viewerHost=null;progress=null;focus?.isConnected&&focus.focus({preventScroll:true});}update();}
 function dismiss(){if(!viewer)return;const dialog=viewer,host=viewerHost,focus=origin;dialog.close();cleanup(dialog,host,focus);}
 function open(host){
  if(viewer&&!viewer.open)cleanup(viewer,viewerHost,origin);if(viewer||!items.length)return;origin=host;viewer=document.createElement('dialog');viewer.className='preview-image-viewer advertising-viewer';viewer.setAttribute('aria-label',text()[0]);viewer.setAttribute('data-i18n-ignore','');
  const head=document.createElement('div');head.className='preview-viewer-head';counter=document.createElement('span');head.append(counter,icon('xmark',text()[1],dismiss));
  const body=document.createElement('div');body.className='advertising-viewer-body';viewerHost=document.createElement('div');viewerHost.className='advertising-viewer-stage';body.append(icon('chevron-left',text()[2],()=>advance(-1)),viewerHost,icon('chevron-right',text()[3],()=>advance(1)));body.querySelectorAll('button').forEach(b=>b.hidden=items.length<2);
  const foot=document.createElement('div');foot.className='advertising-viewer-foot';progress=document.createElement('progress');progress.max=1;progress.value=0;timeLabel=document.createElement('span');foot.append(progress,timeLabel);viewer.append(head,body,foot);document.body.append(viewer);viewer.showModal();attach(viewerHost);paint();
  if(master){synchronize();paint();}
  viewer.addEventListener('keydown',event=>{if(event.key==='ArrowLeft'||event.key==='ArrowRight'){event.preventDefault();advance(event.key==='ArrowLeft'?-1:1);}});
  const dialog=viewer,stage=viewerHost,focus=origin;dialog.addEventListener('close',()=>cleanup(dialog,stage,focus));
 }
 function update(){
  const nextItems=globalThis.getMatrixAdvertisingMedia?.()||[],nextKey=JSON.stringify(nextItems);const changed=key!==nextKey;
  if(changed){for(const [src,pending] of videoSources)if(!nextItems.some(item=>item.type==='video'&&item.src===src)){videoSources.delete(src);pending.then(url=>{if(url.startsWith('blob:'))URL.revokeObjectURL(url);});}items=nextItems;key=nextKey;index=0;elapsed=0;duration=10;failed=false;resetVideo();}
  for(const [host,state] of players)if(!host.isConnected){stop(state);players.delete(host);}
  if(!items.length){if(viewer?.open)viewer.close();for(const [host,state] of players){host.classList.remove('has-advertising-media');stop(state);players.delete(host);}return;}
  for(const host of [document.querySelector('#constructorAdPreview .glass-preview-photo'),document.getElementById('invoiceAdvertising')]){
   if(!host)continue;if(!host.classList.contains('has-advertising-media'))host.classList.add('has-advertising-media');
   if(!host.hasAttribute('data-advertising-viewer')){host.dataset.advertisingViewer='true';host.tabIndex=0;host.setAttribute('role','button');}
   if(host.getAttribute('aria-label')!==text()[4])host.setAttribute('aria-label',text()[4]);attach(host);
  }
  if(changed){resetVideo();for(const state of orderedPlayers())render(state);}
  if(viewer){for(const [iconName,word] of [['xmark',1],['chevron-left',2],['chevron-right',3]]){const b=viewer.querySelector('.i-'+iconName)?.parentElement;if(b&&b.getAttribute('aria-label')!==text()[word])b.setAttribute('aria-label',text()[word]);if(b&&word>1&&b.hidden!==(items.length<2))b.hidden=items.length<2;}viewer.setAttribute('aria-label',text()[0]);}
 }
 const target=event=>event.target.closest('[data-advertising-viewer]');
 document.addEventListener('click',event=>{const host=target(event);if(host)open(host);});
 document.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){const host=target(event);if(host){event.preventDefault();open(host);}}});
 new MutationObserver(update).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['hidden']});document.addEventListener('visibilitychange',()=>{last=performance.now();update();});window.addEventListener('futuruss:language',update);
 window.addEventListener('pagehide',()=>{cancelAnimationFrame(frame);master?.pause();});
 window.addEventListener('pageshow',()=>{cancelAnimationFrame(frame);playing=false;last=performance.now();frame=requestAnimationFrame(tick);});
 update();frame=requestAnimationFrame(tick);
})();
