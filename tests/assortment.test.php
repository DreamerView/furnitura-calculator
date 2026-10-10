<?php
require __DIR__.'/price-categories.test.php';
function assortment(&$s,$a,$actor,$enabled){$e=PriceCategories::editor($s,$a,$actor);return PriceCategories::save($s,$a,$actor,['categories'=>$e['categories'],'prices'=>PriceCategories::book($s,PriceCategories::owner($actor))['prices'],'enabled'=>$enabled,'revision'=>$e['revision'],'sourceRevision'=>$e['sourceRevision']]);}
assortment($s,$a,$central,['X'=>false]);
foreach([1,2,3,4] as $id)check(!Pricing::catalog($s,$a,$id)['articles']['X']['available'],'central exclusion '.$id);
assortment($s,$a,$dealer,['X'=>true]);check(!Pricing::catalog($s,$a,3)['articles']['X']['available'],'cannot override parent');
assortment($s,$a,$central,['X'=>true]);foreach([1,2,3,4] as $id)check(Pricing::catalog($s,$a,$id)['articles']['X']['available'],'central reenable '.$id);
assortment($s,$a,$dealer,['X'=>false]);foreach([2,3] as $id)check(!Pricing::catalog($s,$a,$id)['articles']['X']['available'],'dealer descendants');
foreach([1,4] as $id)check(Pricing::catalog($s,$a,$id)['articles']['X']['available'],'own purchase and other branch unchanged');
assortment($s,$a,$dealer,['X'=>true]);check(Pricing::catalog($s,$a,3)['articles']['X']['available'],'dealer reenable');
reject(function()use(&$s,$a,$dealer){assortment($s,$a,$dealer,['X'=>'false']);});reject(function()use(&$s,$a,$dealer){assortment($s,$a,$dealer,['UNKNOWN'=>true]);});
$s['nodes'][0]['pricing']['articles']['X']['enabled']=false;unset($s['priceBooks']['1']['enabled']['X']);
check(PriceCategories::editor($s,$a,$dealer)['rows'][0]['enabled']===false,'legacy exclusion in editor');
assortment($s,$a,$dealer,[]);check(!Pricing::catalog($s,$a,3)['articles']['X']['available'],'legacy preserved on save');
assortment($s,$a,$dealer,['X'=>true]);check(Pricing::catalog($s,$a,3)['articles']['X']['available'],'explicit reenable beats legacy');
echo "Assortment propagation, own purchases, branch isolation, validation and legacy migration passed.\n";
