<?php
declare(strict_types=1);
require __DIR__.'/../api/src/Store.php';require __DIR__.'/../api/src/Access.php';require __DIR__.'/../api/src/Pricing.php';require __DIR__.'/../api/src/PriceCategories.php';require __DIR__.'/../api/src/Wholesale.php';
$a=new AccessService(new FuturussStore(__DIR__.'/unused.json'));
$s=['catalog'=>['articles'=>['X'=>['name'=>'X','price'=>100,'packQty'=>20],'Y'=>['name'=>'Y','price'=>null]],'kits'=>[]],'nodes'=>[['id'=>1,'name'=>'Dealer','type'=>'dealer','parent_id'=>null],['id'=>2,'type'=>'dealer','parent_id'=>1],['id'=>3,'type'=>'client','parent_id'=>2],['id'=>4,'type'=>'dealer','parent_id'=>null]]];
$central=['authenticated'=>true,'role'=>'central','canViewPrices'=>true];$dealer=['authenticated'=>true,'role'=>'dealer','nodeId'=>1,'canViewPrices'=>true];$sub=[...$dealer,'nodeId'=>2];
function check($v,$m){if(!$v)throw new Exception($m);}
function reject($f){try{$f();}catch(InvalidArgumentException|RuntimeException $e){return;}throw new Exception('Expected refusal');}
function saveBook(&$s,$a,$actor,$price){$e=PriceCategories::editor($s,$a,$actor);PriceCategories::save($s,$a,$actor,['categories'=>$e['categories'],'prices'=>['X'=>['A'=>$price]],'revision'=>$e['revision'],'sourceRevision'=>$e['sourceRevision']]);}
saveBook($s,$a,$central,120);PriceCategories::assign($s,$a,$central,['id'=>1,'category'=>'A']);
saveBook($s,$a,$dealer,150);PriceCategories::assign($s,$a,$dealer,['id'=>2,'category'=>'A']);
saveBook($s,$a,$sub,180);PriceCategories::assign($s,$a,$sub,['id'=>3,'category'=>'A']);
foreach([1=>120,2=>150,3=>180,4=>100] as $id=>$price)check(Pricing::catalog($s,$a,$id)['articles']['X']['price']==$price,'incoming chain '.$id);
check(PriceCategories::editor($s,$a,$dealer)['rows'][0]['sourcePrice']==120,'purchase distinct from sale');
check($s['catalog']['articles']['X']['price']===100,'base unchanged');
reject(function()use(&$s,$a,$dealer){PriceCategories::assign($s,$a,$dealer,['id'=>4,'category'=>'A']);});
reject(function()use(&$s,$a,$central){PriceCategories::assign($s,$a,$central,['id'=>3,'category'=>'A']);});
reject(fn()=>PriceCategories::editor($s,$a,[...$dealer,'canViewPrices'=>false]));
reject(fn()=>PriceCategories::editor($s,$a,[...$dealer,'role'=>'client']));
$e=PriceCategories::editor($s,$a,$dealer);$p=['categories'=>$e['categories'],'prices'=>['X'=>['A'=>-1]],'revision'=>$e['revision'],'sourceRevision'=>$e['sourceRevision']];reject(function()use(&$s,$a,$dealer,$p){PriceCategories::save($s,$a,$dealer,$p);});
saveBook($s,$a,$central,121);$p['prices']['X']['A']=160;reject(function()use(&$s,$a,$dealer,$p){PriceCategories::save($s,$a,$dealer,$p);});
$state=$s;$state['catalog']=PriceCategories::source($s,$a,1);$data=Wholesale::defaults();$v=Wholesale::view($data,$state,1);
$r=Wholesale::mutate($data,$state,1,'wholesale_save',['clientKey'=>'price-test-0000000001','catalogRevision'=>$v['catalogRevision'],'lines'=>[['art'=>'X','qty'=>37,'price'=>1]]])['request'];
check($r['lines'][0]['price']==121&&$r['totals']['amount']==4477,'server prices and total');check($r['lines'][0]['packQty']===20,'pack unchanged');check($r['totals']['knownWeightKg']==1.85,'50 grams');
$hidden=Wholesale::redactPrices(['request'=>$r],false);check($hidden['request']['lines'][0]['price']===null&&$hidden['request']['totals']['amount']===null,'hidden prices');
$state['catalog']['articles']['X']['price']=125;reject(function()use(&$data,$state){Wholesale::mutate($data,$state,1,'wholesale_send',['id'=>1,'revision'=>1]);});check($data['requests'][0]['totals']['amount']==4477,'snapshot unchanged');
echo "Category inheritance, isolation, stale edits, server prices, nonmultiples, 50g and snapshot tests passed.\n";
