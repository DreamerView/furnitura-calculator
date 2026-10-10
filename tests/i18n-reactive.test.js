const fs=require('fs'),path=require('path'),vm=require('vm');
const root=path.resolve(__dirname,'..');let n=0;
const ok=(c,m)=>{if(!c){console.error('FAIL:',m);process.exit(1)}console.log(`ok ${++n} - ${m}`)};
const i18nSrc=fs.readFileSync(path.join(root,'assets/js/i18n.js'),'utf8');
const spa=fs.readFileSync(path.join(root,'assets/js/spa.js'),'utf8');
const boot=fs.readFileSync(path.join(root,'assets/js/bootstrap.js'),'utf8');
ok(i18nSrc.includes('const textSource=new WeakMap()')&&i18nSrc.includes('const textRendered=new WeakMap()'),'text nodes preserve canonical source and rendered value');
ok(i18nSrc.includes('const attrSource=new WeakMap()')&&i18nSrc.includes('const attrRendered=new WeakMap()'),'translated attributes preserve canonical source and rendered value');
ok(i18nSrc.includes('localeState.language=lang'),'locale state is updated reactively');
const rescanPos=i18nSrc.indexOf('rescanBurst();',i18nSrc.indexOf('async function setLanguage'));
const persistPos=i18nSrc.indexOf("FuturussStore?.setItem?.('futuruss.language'",i18nSrc.indexOf('async function setLanguage'));
ok(rescanPos>0&&persistPos>rescanPos,'visible language changes before IndexedDB persistence');
ok(spa.includes("FuturussI18n?.state?.language")&&spa.includes('this.language=value')&&spa.includes("@click=\"choose('ru')\""),'language selector reads reactive i18n state directly');
ok(!spa.includes('location.reload()'),'language switching does not reload the SPA');
ok(boot.includes("FuturussI18n?.setLanguage?.(globalThis.FUTURUSS_LANGUAGE||'ru')"),'boot restores saved language without page reload');

// Load translator without a browser; DOM-dependent functions are defined but not executed.
globalThis.FUTURUSS_LANGUAGE='ru';
vm.runInThisContext(i18nSrc,{filename:'i18n.js'});
const runtimeFiles=[
  'index.php','assets/js/bootstrap.js','assets/js/spa.js','assets/js/frame-dimensions.js','assets/js/option-help.js','assets/js/invoice-undo.js',
  ...fs.readdirSync(path.join(root,'assets/legacy')).filter(x=>x.endsWith('.js')).map(x=>'assets/legacy/'+x),
  ...fs.readdirSync(path.join(root,'api')).filter(x=>x.endsWith('.php')).map(x=>'api/'+x)
];
const literalRe=/(?:'([^'\\]*(?:\\.[^'\\]*)*)'|"([^"\\]*(?:\\.[^"\\]*)*)"|`([^`\\]*(?:\\.[^`\\]*)*)`)/gs;
const strings=new Set();
for(const rel of runtimeFiles){
  const src=fs.readFileSync(path.join(root,rel),'utf8'); let m;
  while((m=literalRe.exec(src))){const value=m[1]??m[2]??m[3]??'';if(/[А-Яа-яЁё]/.test(value))strings.add(value);}
}
for(const target of ['en','tr']){
  const leftovers=[];
  for(const source of strings){
    if(source==='Русский')continue; // native language name must remain native inside the selector.
    const translated=globalThis.FuturussI18n.translate(source,target);
    if(/[А-Яа-яЁё]/.test(translated))leftovers.push({source,translated});
  }
  ok(leftovers.length===0,`${target.toUpperCase()} runtime coverage has no untranslated Cyrillic strings`);
}

// Cover literal HTML text and translated attributes that are not inside JS strings.
const indexHtml=fs.readFileSync(path.join(root,'index.php'),'utf8')
  .replace(/<!--[\s\S]*?-->/g,'')
  .replace(/<script[\s\S]*?<\/script>/gi,'')
  .replace(/<style[\s\S]*?<\/style>/gi,'');
const htmlTexts=indexHtml.split(/<[^>]+>/).map(x=>x.replace(/&nbsp;/g,' ').replace(/\s+/g,' ').trim()).filter(x=>/[А-Яа-яЁё]/.test(x));
const attrTexts=[]; for(const m of indexHtml.matchAll(/(?:placeholder|title|aria-label|alt|content)=(["'])(.*?)\1/gs)){if(/[А-Яа-яЁё]/.test(m[2]))attrTexts.push(m[2]);}
for(const target of ['en','tr']){
  const leftovers=[...htmlTexts,...attrTexts].filter(source=>/[А-Яа-яЁё]/.test(globalThis.FuturussI18n.translate(source,target)));
  ok(leftovers.length===0,`${target.toUpperCase()} static HTML text/attribute coverage is complete`);
}
for(const sample of [
  'Пользователи · 3',
  'Данные ещё не загружены',
  'Цены скрыты. Для просмотра цен требуется разрешение вашей ветки.',
  'Секретный ключ — приглашение. Для доступа создайте логин и пароль Client.',
  'Сначала создайте схему в «Комплектации».'
]){
  ok(!/[А-Яа-яЁё]/.test(globalThis.FuturussI18n.translate(sample,'en')),`EN translates: ${sample}`);
  ok(!/[А-Яа-яЁё]/.test(globalThis.FuturussI18n.translate(sample,'tr')),`TR translates: ${sample}`);
}
console.log(`PASS ${n} checks`);
