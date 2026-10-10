const fs=require('fs'),vm=require('vm'),assert=require('assert'),path=require('path');
const root=path.resolve(__dirname,'..');
const html=fs.readFileSync(path.join(root,'configurator.html'),'utf8');
const api=fs.readFileSync(path.join(root,'api/index.php'),'utf8');
const spa=fs.readFileSync(path.join(root,'assets/js/spa.js'),'utf8');
const catalog=JSON.parse(fs.readFileSync(path.join(root,'storage/default-catalog.json'),'utf8'));
const M=require(path.join(root,'assets/legacy/matrix-core.js'));
assert.deepStrictEqual(Array.from(M.validate(catalog)),[],'server fallback catalog satisfies matrix v2');
assert(!html.includes('FUTURUSS_SEED'),'HTML does not bundle the private catalog');
assert(html.includes("callApi('catalog_editor')"),'HTML loads catalog from server API');
assert(html.includes("callApi('catalog_save',{catalog:library})"),'HTML saves edits through server API');
assert(!html.includes('adImageButton')&&!html.includes('removeAdImage')&&!html.includes('id=\"adImageFile\"'),'advertising controls have been removed from standalone HTML');
assert(spa.includes("const AdvertisingView=")&&spa.includes("api('catalog_save','POST',{catalog:next})"),'Vue advertising controls save through the central API');
assert(html.includes('function returnToManagement()')&&html.includes("window.location.assign('index.php#/users')"),'standalone HTML returns to Management directly');
assert(html.includes('signalCatalogUpdate()')&&!html.includes('window.parent.FUTURUSS_SPA'),'successful standalone saves notify other tabs without a parent frame');
assert(spa.includes('broadcastCatalogUpdate()')&&spa.includes('receiveCatalogSignal'),'calculator tabs refresh when another tab saves');
assert(html.includes('localStorage.getItem(storage)')&&!html.includes('localStorage.setItem(storage'),'old browser data is only read for one-time migration');
assert.match(api,/if\(\$action==='catalog_save'\)\{\s*requireAuth\(\$a,\['central'\]\);requireCsrf\(\);/,'server save requires Central authorization and CSRF');
assert.match(api,/\$s\['catalog'\]=\$cat;\$s\['catalogUpdatedAt'\]=date\(DATE_ATOM\);/,'server stores catalog in shared application state');
assert(api.includes('CatalogPhotos::migrateEmbedded($cat,$photoStorage)'),'legacy embedded photo bytes migrate to server files before catalog persistence');
assert(!api.includes('catalog_import'),'obsolete manual JSON import API is removed');
for(const [i,m] of [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)].entries()){
  const source=m[1].trim();if(source)new vm.Script(source,{filename:`configurator-inline-${i}.js`});
}
assert(spa.includes('globalThis.refreshInvoiceAdvertising?.()'),'catalog refresh updates calculator advertising');
console.log('HTML configurator, API persistence, advertising, access guard and return-flow checks passed.');
