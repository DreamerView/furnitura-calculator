<?php
require __DIR__.'/../api/src/StulpDetails.php';
function check($condition){if(!$condition)throw new RuntimeException('Stulp details assertion failed');}
$root=dirname(__DIR__);$seed=json_decode(file_get_contents($root.'/storage/default-catalog.json'),true);$previous=json_decode(file_get_contents($root.'/storage/stulp-details-previous.json'),true);
$cat=$seed;unset($cat['stulpDetailsVersion']);foreach($cat['kits'] as &$k)foreach($previous as $old)if($k['id']===$old['id'])$k=$old;unset($k);
$cat['articles']['PS.800']['price']=37;$cat['articles']['PS.800']['photos']=['local-photo'];
$s=['catalog'=>$cat,'users'=>[['id'=>9]],'orders'=>[['id'=>6]],'priceBooks'=>[['name'=>'A']]];
$before=$s;$tmp=$root.'/storage/test-stulp-details-'.bin2hex(random_bytes(4));mkdir($tmp);copy($root.'/storage/default-catalog.json',$tmp.'/default-catalog.json');copy($root.'/storage/stulp-details-previous.json',$tmp.'/stulp-details-previous.json');
try{
 check(StulpDetails::upgrade($s,$tmp));check($s['users']===$before['users']&&$s['orders']===$before['orders']&&$s['priceBooks']===$before['priceBooks']);check($s['catalog']['articles']['PS.800']['price']===37&&$s['catalog']['articles']['PS.800']['photos']===['local-photo']);
 check(count(array_filter($s['catalog']['kits'],fn($k)=>!empty($k['stulpDetailsVersion'])))===8);$once=$s;check(!StulpDetails::upgrade($s,$tmp)&&$s===$once);
 $custom=$before;foreach($custom['catalog']['kits'] as &$k)if($k['id']==='catalog-pvc-7-14'){$k['common']=[['art'=>'XU','qty'=>3,'role'=>'manual']];$saved=$k;}unset($k);
 check(StulpDetails::upgrade($custom,$tmp));check(count(array_filter($custom['catalog']['kits'],fn($k)=>$k['id']==='catalog-pvc-7-14-catalog-v2'))===1);foreach($custom['catalog']['kits'] as $k)if($k['id']==='catalog-pvc-7-14')check($k===$saved);
 $kit=array_values(array_filter($seed['kits'],fn($k)=>!empty($k['heightRecipes'])))[0];StulpDetails::validate($kit,fn($items)=>check(is_array($items)&&count($items)>0));$kit['heightRecipes']['bad']=['items'=>[]];try{StulpDetails::validate($kit,fn()=>null);throw new RuntimeException('Invalid row accepted');}catch(InvalidArgumentException $e){}
 echo "Stulp migration: templates, custom preservation, prices, photos, users, orders, validation and idempotence passed.\n";
}finally{unlink($tmp.'/default-catalog.json');unlink($tmp.'/stulp-details-previous.json');rmdir($tmp);}
