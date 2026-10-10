const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const src=fs.readFileSync('assets/js/calculation-technology.js','utf8');
const html=src.match(/<select data-tech="chain">(.*?)<\/select>/)[1];assert.equal((html.match(/<option /g)||[]).length,2);assert(!html.includes('catalog'));
const controls={chain:{value:'long',disabled:false},node:{value:'bolt',disabled:false},review:{checked:false},height:{value:''},hidden:{checked:false}};
const c={el:id=>controls[id]||{value:''},strikeValues:()=>({}),nodeTouched:false,loadedNode:'catalog',getContext:()=>({kit:{}}),reviewKey:''};vm.createContext(c);vm.runInContext(src.slice(src.indexOf('function read(){'),src.indexOf(' function refresh(){')),c);
assert.equal(c.read().rearChain,'long');assert.equal(c.read().lowerNode,'bolt');controls.chain.value='short';assert.equal(c.read().rearChain,'short');controls.chain.disabled=true;assert.equal(c.read().rearChain,'catalog');assert.equal(c.read().lowerNode,'catalog');controls.node.disabled=true;assert.equal(c.read().lowerNode,'catalog');
console.log('Two chain choices, enabled selection and disabled-system fallback passed.');
