const assert=require('node:assert/strict');
const C=require('../assets/js/hardware-colors');
for(const [suffix,color] of [['B','white'],['K','brown'],['A','anthracite'],['BLACK','black']]){
 assert.equal(C.articleColor('N.RV.'+suffix,{name:'Накладка петли'}),color);
 assert.equal(C.articleColor('RP'+(suffix==='B'?'':'.'+suffix),{handleColor:color}),color);
}
assert.equal(C.articleColor('XU',{name:'Угловая передача'}),'');
assert.equal(C.articleColor('RN.BLACK',{name:'Петля'}),'');
assert.equal(C.articleColor('N.RV.B',{name:'Накладка белая'}),'white');
assert.equal(C.articleColor('UNKNOWN',{name:'Деталь'}),'');
assert.equal(C.cellClass('N.RV.K',null),'');
const classes=new Set(),el={classList:{add:x=>classes.add(x),remove:x=>classes.delete(x),toggle:(x,on)=>on?classes.add(x):classes.delete(x)}};
C.paint(el,'black');C.paint(el,'white');assert.deepEqual([...classes].sort(),['hardware-color','hardware-color--white']);
C.paint(el,'invalid');assert.equal(classes.size,0);
console.log('Hardware colours: all four options, actual-article colours, unknowns and switching passed');
