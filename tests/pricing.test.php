<?php
declare(strict_types=1);
require __DIR__.'/../api/src/Store.php';require __DIR__.'/../api/src/Access.php';require __DIR__.'/../api/src/Pricing.php';
$path=sys_get_temp_dir().'/futuruss-pricing-'.bin2hex(random_bytes(5)).'.json';$svc=new AccessService(new FuturussStore($path));$checks=0;
function ok($value,$label){global $checks;if(!$value)throw new RuntimeException($label);echo 'ok '.++$checks.' - '.$label."\n";}
function rejected(callable $fn){try{$fn();return false;}catch(InvalidArgumentException|RuntimeException $e){return true;}}
$s=$svc->load();$s['catalog']=['format'=>'futuruss-matrix','schemaVersion'=>2,'articles'=>['A'=>['name'=>'A','price'=>100],'B'=>['name'=>'B','price'=>50]],'kits'=>[]];
$s['nodes']=[['id'=>1,'type'=>'dealer','parent_id'=>null,'name'=>'Dealer'],['id'=>2,'type'=>'dealer','parent_id'=>1,'name'=>'Subdealer'],['id'=>3,'type'=>'client','parent_id'=>2,'name'=>'Client'],['id'=>4,'type'=>'dealer','parent_id'=>null,'name'=>'Other']];
function payload($s,$svc,$id,$articles){$e=Pricing::editor($s,$svc,$id);return ['revision'=>$e['revision'],'sourceRevision'=>$e['sourceRevision'],'catalogRevision'=>$e['catalogRevision'],'articles'=>$articles];}
$original=$s['catalog'];$p=payload($s,$svc,1,['A'=>['enabled'=>true,'price'=>150],'B'=>['enabled'=>false,'price'=>null]]);Pricing::save($s,$svc,1,$p);
ok($s['catalog']===$original,'Central catalog remains unchanged');
ok(Pricing::editor($s,$svc,1)['rows'][0]['sourcePrice']===100,'Dealer sees Central source price');
ok(Pricing::editor($s,$svc,2)['rows'][0]['sourcePrice']===150,'Subdealer sees dealer price');
ok(Pricing::catalog($s,$svc,3)['articles']['A']['price']===150,'Client inherits parent chain');
ok(Pricing::catalog($s,$svc,4)['articles']['A']['price']===100,'Separate branches remain isolated');
Pricing::save($s,$svc,2,payload($s,$svc,2,['A'=>['enabled'=>true,'price'=>200],'B'=>['enabled'=>true,'price'=>99]]));
$c=Pricing::catalog($s,$svc,3);ok($c['articles']['A']['price']===200,'Subdealer override reaches its client');ok(!$c['articles']['B']['available']&&$c['articles']['B']['price']===0,'Child cannot reenable upstream excluded product or see its price');
Pricing::save($s,$svc,2,payload($s,$svc,2,['A'=>['enabled'=>true,'price'=>null]]));ok(Pricing::catalog($s,$svc,3)['articles']['A']['price']===150,'Empty override restores dynamic inheritance');
$stale=payload($s,$svc,2,[]);Pricing::save($s,$svc,1,payload($s,$svc,1,['A'=>['enabled'=>true,'price'=>0]]));ok(rejected(function()use(&$s,$svc,$stale){Pricing::save($s,$svc,2,$stale);}),'Changed supplier rejects stale editor');
ok(Pricing::catalog($s,$svc,3)['articles']['A']['price']===0,'Zero is a valid explicit price');
ok(rejected(fn()=>Pricing::editor($s,$svc,3)),'Client has no policy editor');
foreach([-1,INF,'123'] as $invalid){$p=payload($s,$svc,1,['A'=>['enabled'=>true,'price'=>$invalid]]);ok(rejected(function()use(&$s,$svc,$p){Pricing::save($s,$svc,1,$p);}),'Invalid price rejected');}
$p=payload($s,$svc,1,['FAKE'=>['enabled'=>true,'price'=>1]]);ok(rejected(function()use(&$s,$svc,$p){Pricing::save($s,$svc,1,$p);}),'Unknown article rejected');
$svc->save($s);ok(Pricing::catalog($svc->load(),$svc,3)['articles']['A']['price']===0,'Policies persist after reload');ok(!isset($svc->safeNode($s['nodes'][0],false)['pricing']),'Auth and hierarchy never expose policy internals');unlink($path);
