<?php
require __DIR__.'/../api/src/DornmassCatalog.php';
function checkD($v){if(!$v)throw new RuntimeException('Dornmass migration failed');}
$root=dirname(__DIR__);$tmp=$root.'/storage/test-dornmass-'.bin2hex(random_bytes(4));mkdir($tmp);
try{
 copy($root.'/storage/default-catalog.json',$tmp.'/default-catalog.json');
 $s=['catalog'=>['articles'=>['PO.740.D7'=>['name'=>'Привод дорнмасс 7,5','dornmass'=>7,'price'=>123],'XPO.1200-1.D7'=>['name'=>'Custom','price'=>456]],'kits'=>[['id'=>'manual','common'=>[['art'=>'A','qty'=>3]]]]],'users'=>[['id'=>123]],'priceBooks'=>[1,2]];
 $old=$s;file_put_contents($tmp.'/state.json',json_encode($s));checkD(DornmassCatalog::upgrade($s,$tmp));
 checkD($s['catalog']['articles']['PO.740.D7']['dornmass']===7.5);checkD($s['catalog']['articles']['PO.740.D7']['price']===123);checkD($s['catalog']['articles']['XPO.1200-1.D7']['price']===456);
 checkD($s['catalog']['kits']===$old['catalog']['kits']&&$s['users']===$old['users']&&$s['priceBooks']===$old['priceBooks']);checkD(count(glob($tmp.'/state-before-dornmass75-*.json'))===1);checkD(!DornmassCatalog::upgrade($s,$tmp));echo "Dornmass migration: backups, prices, users, manual kits and repeatability passed.\n";
}finally{foreach(glob($tmp.'/*') as $f)unlink($f);rmdir($tmp);}
