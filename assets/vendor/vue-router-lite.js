/* FUTURUSS local SPA router. Browser-only Vue 3 router with RouterLink/RouterView semantics. */
(function(global){
  'use strict';
  const Vue=global.Vue;
  if(!Vue) throw new Error('Vue must be loaded before FUTURUSS router');
  const {h,computed,shallowRef,inject}=Vue;
  const ROUTER_KEY=Symbol('futuruss-router');
  const ROUTE_KEY=Symbol('futuruss-route');
  const normalize=value=>{
    let path=typeof value==='string'?value:(value&&value.path)||'/calculator';
    if(!path.startsWith('/')) path='/'+path;
    path=path.replace(/\/+/g,'/');
    return path||'/calculator';
  };
  const hashPath=()=>normalize((location.hash||'').replace(/^#/,''));
  const createWebHashHistory=()=>({type:'hash'});
  function createRouter(options){
    const routes=Array.isArray(options?.routes)?options.routes:[];
    const routeMap=new Map(routes.map(r=>[normalize(r.path),r]));
    const fallback=routes.find(r=>r.path==='/:pathMatch(.*)*')||routes[0]||{path:'/calculator',component:{template:'<div></div>'}};
    const resolve=to=>{
      const path=normalize(to);
      const record=routeMap.get(path)||fallback;
      return {path,fullPath:path,name:record.name||null,meta:record.meta||{},matched:[record],record};
    };
    const currentRoute=shallowRef(resolve(hashPath()));
    const guards=[]; const after=[]; let started=false; let navigating=false; let readyResolve; const readyPromise=new Promise(r=>readyResolve=r);
    async function runGuards(to,from){
      for(const guard of guards){
        const result=await guard(to,from);
        if(result===false) return false;
        if(typeof result==='string'||(result&&typeof result==='object'&&result.path)) return normalize(result);
      }
      return true;
    }
    async function commit(path,replace=false){
      const target=resolve(path),from=currentRoute.value;
      const same=target.path===from.path;
      const allowed=await runGuards(target,from);
      if(allowed===false) return from;
      if(typeof allowed==='string'&&allowed!==target.path) return commit(allowed,true);
      const hash='#'+target.path;
      if(same){if(!location.hash)history.replaceState(null,'',location.pathname+location.search+hash);currentRoute.value=target;for(const fn of after)try{fn(target,from);}catch(e){console.error(e);}return target;}
      navigating=true;
      if(replace) history.replaceState(null,'',location.pathname+location.search+hash);
      else location.hash=target.path;
      currentRoute.value=target;
      queueMicrotask(()=>{navigating=false;});
      for(const fn of after) try{fn(target,from);}catch(e){console.error(e);}
      return target;
    }
    async function sync(){
      const target=resolve(hashPath()),from=currentRoute.value;
      const allowed=await runGuards(target,from);
      if(allowed===false){return commit(from.path,true);}
      if(typeof allowed==='string'&&allowed!==target.path){return commit(allowed,true);}
      currentRoute.value=target;
      for(const fn of after) try{fn(target,from);}catch(e){console.error(e);}
    }
    const router={
      currentRoute,
      options:{routes},
      resolve,
      push:to=>commit(normalize(to),false),
      replace:to=>commit(normalize(to),true),
      beforeEach(fn){guards.push(fn);return()=>{const i=guards.indexOf(fn);if(i>=0)guards.splice(i,1);};},
      afterEach(fn){after.push(fn);return()=>{const i=after.indexOf(fn);if(i>=0)after.splice(i,1);};},
      isReady:()=>readyPromise,
      install(app){
        app.provide(ROUTER_KEY,router);app.provide(ROUTE_KEY,currentRoute);
        app.component('RouterLink',RouterLink);app.component('RouterView',RouterView);
        app.config.globalProperties.$router=router;
        Object.defineProperty(app.config.globalProperties,'$route',{get:()=>currentRoute.value});
        if(!started){started=true;window.addEventListener('hashchange',()=>{if(!navigating)sync();});const initial=!location.hash?commit('/calculator',true):sync();Promise.resolve(initial).finally(()=>readyResolve?.());}
      }
    };
    return router;
  }
  const RouterLink={
    name:'RouterLink',
    props:{to:{type:[String,Object],required:true},replace:Boolean,activeClass:String,exactActiveClass:String},
    setup(props,{slots,attrs}){
      const router=inject(ROUTER_KEY),route=inject(ROUTE_KEY);
      const path=computed(()=>normalize(props.to));
      const active=computed(()=>route.value.path===path.value);
      const navigate=e=>{if(e&&((e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)||e.button>0))return;e?.preventDefault();return (props.replace?router.replace:router.push)(path.value);};
      return()=>h('a',{...attrs,href:'#'+path.value,onClick:navigate,class:[attrs.class,active.value?(props.exactActiveClass||props.activeClass||'router-link-active'):null]},slots.default?slots.default({isActive:active.value,navigate,href:'#'+path.value}):path.value);
    }
  };
  const RouterView={
    name:'RouterView',
    setup(){const route=inject(ROUTE_KEY);return()=>{const C=route.value.record?.component;return C?h(C,{key:route.value.path}):null;};}
  };
  global.VueRouter={createRouter,createWebHashHistory,RouterLink,RouterView,useRouter:()=>inject(ROUTER_KEY),useRoute:()=>inject(ROUTE_KEY)};
})(window);
