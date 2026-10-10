(async function(){
'use strict';
const APP_VERSION=document.querySelector('meta[name="futuruss-version"]')?.content||'2026.10.10.27';
const versioned=src=>src+(src.includes('?')?'&':'?')+'v='+encodeURIComponent(APP_VERSION);
const loadScript=src=>new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=versioned(src);s.async=false;s.onload=resolve;s.onerror=()=>reject(new Error('Не удалось загрузить '+src));document.body.appendChild(s);});
const api=async action=>{const r=await fetch('api/index.php?action='+encodeURIComponent(action),{credentials:'same-origin',cache:'no-store',headers:{Accept:'application/json'}});const data=await r.json().catch(()=>({}));if(!r.ok&&r.status!==428)throw new Error(data.error||'Ошибка API');return data;};
function fail(error){console.error(error);const loader=document.getElementById('appPreloader');if(loader){loader.querySelector('.preloader-spinner')?.remove();const title=loader.querySelector('.preloader-title');const text=loader.querySelector('.preloader-text');const tr=v=>globalThis.FuturussI18n?.translate?.(v)||v;if(title)title.textContent=tr('Не удалось открыть FUTURUSS');if(text)text.textContent=tr(error.message||String(error));}}
try{
  let appSettings={theme:'default'};
  try{appSettings=await api('app_settings');}catch(e){console.warn(e);}
  const allowedThemes=['default','soft','easy','glossy','material'];
  document.documentElement.dataset.interfaceTheme=allowedThemes.includes(appSettings.theme)?appSettings.theme:'default';
  globalThis.FUTURUSS_APP_SETTINGS=appSettings;
  await (globalThis.FuturussStore?.ready||Promise.resolve());
  try{globalThis.FUTURUSS_LANGUAGE=(await globalThis.FuturussStore?.getItem?.('futuruss.language'))||'ru';}catch{globalThis.FUTURUSS_LANGUAGE='ru';}
  await loadScript('assets/js/i18n.js');
  await Promise.all(['upt-imported-matrix-kits-v2','app-profile-list','app-current-profile','futuruss-master-overrides','futuruss-schemes-overrides','futuruss-rules-overrides','futuruss.interface.theme.v1'].map(key=>globalThis.FuturussStore?.removeItem?.(key)));
  let auth={authenticated:false,role:'public',nodeId:null,canViewPrices:false,setupRequired:false};
  let catalog={available:false,data:null,canViewPrices:false,updatedAt:null};
  try{auth=await api('auth_status');}catch(e){console.warn(e);}
  if(!auth.setupRequired){try{catalog=await api('catalog');}catch(e){console.warn(e);}}
  globalThis.FUTURUSS_AUTH=auth;
  globalThis.FUTURUSS_CATALOG_AVAILABLE=!!catalog.available;
  globalThis.FUTURUSS_CAN_VIEW_PRICES=!!catalog.canViewPrices;
  globalThis.FUTURUSS_SEED=catalog.available&&catalog.data?catalog.data:null;
  document.body.classList.toggle('price-hidden',!catalog.canViewPrices);
  document.body.classList.toggle('catalog-empty',!catalog.available);
  await loadScript('assets/js/hardware-colors.js');
  await loadScript('assets/js/calculation-technology.js');
  await loadScript('assets/js/cam-selector.js');
  const legacy=['assets/legacy/app-core.js','assets/legacy/matrix-core.js','assets/legacy/matrix-adapter.js','assets/legacy/ui-enhancements.js','assets/legacy/theme-ui.js'];
  for(const src of legacy)await loadScript(src);
  await loadScript('assets/js/calculator-options.js');
  await loadScript('assets/js/invoice-ui.js');
  
  await loadScript('assets/js/wholesale.js');
  await loadScript('assets/js/price-categories.js');
  await loadScript('assets/js/spa.js');
  await (globalThis.FUTURUSS_SPA_READY||Promise.resolve());
  globalThis.FuturussI18n?.start?.();
  await globalThis.FuturussI18n?.setLanguage?.(globalThis.FUTURUSS_LANGUAGE||'ru');
  await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
  document.documentElement.classList.remove('app-booting');
  const loader=document.getElementById('appPreloader');if(loader){loader.classList.add('is-hidden');setTimeout(()=>loader.remove(),240);}
}catch(error){fail(error);}
})();
