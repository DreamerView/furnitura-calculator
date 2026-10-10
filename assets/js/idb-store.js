(function(root){
  'use strict';
  const DB_NAME='futuruss-local';
  const DB_VERSION=1;
  const STORE='kv';
  const cache=new Map();
  let db=null;
  let readyResolve;
  const ready=new Promise(r=>readyResolve=r);
  function open(){
    if(!('indexedDB' in root)){ readyResolve(); return; }
    const req=indexedDB.open(DB_NAME,DB_VERSION);
    req.onupgradeneeded=()=>{const d=req.result;if(!d.objectStoreNames.contains(STORE))d.createObjectStore(STORE);};
    req.onerror=()=>readyResolve();
    req.onsuccess=()=>{
      db=req.result;
      try{
        const tx=db.transaction(STORE,'readonly'),os=tx.objectStore(STORE),cursor=os.openCursor();
        cursor.onsuccess=e=>{const c=e.target.result;if(c){cache.set(String(c.key),c.value);c.continue();}};
        tx.oncomplete=()=>readyResolve(); tx.onerror=()=>readyResolve();
      }catch{readyResolve();}
    };
  }
  function persist(method,key,value){
    if(!db)return;
    try{const tx=db.transaction(STORE,'readwrite'),os=tx.objectStore(STORE);method==='put'?os.put(value,key):os.delete(key);}catch{}
  }
  root.FuturussStore={
    ready,
    getItem(key){const v=cache.get(String(key));return v==null?null:String(v);},
    setItem(key,value){key=String(key);value=String(value);cache.set(key,value);persist('put',key,value);},
    removeItem(key){key=String(key);cache.delete(key);persist('delete',key);},
    clear(){cache.clear();if(db)try{db.transaction(STORE,'readwrite').objectStore(STORE).clear();}catch{}},
    _cache:cache
  };
  open();
})(globalThis);
