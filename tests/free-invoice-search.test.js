const assert=require('node:assert/strict');
const {searchItems,category,camType}=require('../assets/js/free-invoice-modal');
const master={
 'XPO.1200-1':{name:'Привод поворотно-откидной 800–1200',group:'Detailed drive group'},
 'POM.1200-1':{name:'Привод поворотно-откидной с приподнимателем 800-1200'},
 'PP.400-2.V':{name:'Привод поворотный с грибовидной цапфой'},
 'XPNB.600-2':{name:'Привод ножниц 600-2'},
 'ZK.40':{name:'Зацеп периметральный для уплотнения 4 мм'},
 'ZD.40':{name:'Зацеп периметральный для другого профиля'},
 'N.RV.B':{name:'Накладка петли рамы верхней, белая'},
 'XU.400-1':{name:'Удлинитель привода с рубкой'},
 'PN.S':{name:'Прижим накладной'},
 'BZ':{name:'Защёлка балконная'}
};
const arts=(q,g='',c='')=>searchItems(master,q,g,c).map(([a])=>a);
assert.deepEqual(arts('  ОТКИДНОЙ   привод 1200 ').sort(),['POM.1200-1','XPO.1200-1']);
assert.deepEqual(arts('ХРО 1200 1'),['XPO.1200-1']);
assert.equal(arts('XPO.1200-1')[0],'XPO.1200-1');
assert.deepEqual(arts('петля накладка белая'),['N.RV.B']);
assert.deepEqual(arts('защелка'),['BZ']);
assert.equal(arts('зацеп периметральный','strikes').length,2);
assert.equal(category('XPNB.600-2',master['XPNB.600-2']),'scissors');
assert.equal(category('XU.400-1',master['XU.400-1']),'extensions');
assert.deepEqual(arts('','drives','mushroom'),['PP.400-2.V']);
assert.deepEqual(arts('','drives','roller11'),['XPO.1200-1']);
assert.deepEqual(arts('','drives','roller8'),['POM.1200-1']);
assert.equal(camType('custom',{name:'Ножницы с цапфами 8 мм'}),'roller8');
assert.equal(camType('shared',{name:'Зацеп откидной'}),'');
assert.deepEqual(arts('привод','covers'),[]);
assert.deepEqual(arts('несуществующий товар'),[]);
assert.equal(searchItems({},'привод').length,0);
assert.equal(searchItems(master,'locking drive','','',name=>name.startsWith('Привод поворотно')?'locking drive':name).length,2);
console.log('PASS word order, declensions, spacing, Cyrillic articles, exact ranking, compact groups, cam filters and translated names');

assert.equal(searchItems({...master,'XPO.1600-2':{name:'Привод 1200-1600'}},'ХРО 1200 1').some(([art])=>art==='XPO.1600-2'),false);
