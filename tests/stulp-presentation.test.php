<?php
require __DIR__.'/../api/src/StulpPresentation.php';
function check($condition){if(!$condition)throw new RuntimeException('Stulp presentation regression');}
$root=dirname(__DIR__);$seed=json_decode(file_get_contents($root.'/storage/default-catalog.json'),true);$old=json_decode(file_get_contents($root.'/storage/stulp-details-previous.json'),true);$a=array_values(array_filter($old,fn($k)=>$k['id']==='catalog-pvc-7-12'))[0];$b=array_values(array_filter($seed['kits'],fn($k)=>$k['id']===$a['id']))[0];$b['id'].='-catalog-v2';$a['catalogGroups']=[];
$s=['catalog'=>['articles'=>$seed['articles'],'kits'=>[$a,$b]],'users'=>[['id'=>1]],'orders'=>[['id'=>3]]];$s['catalog']['articles']['RV']['price']=77;
$dir=$root.'/storage/test-stulp-presentation-'.bin2hex(random_bytes(4));mkdir($dir);foreach(['default-catalog.json','stulp-details-previous.json'] as $file)copy($root.'/storage/'.$file,$dir.'/'.$file);
try{
 check(StulpPresentation::upgrade($s,$dir));$updated=$s['catalog']['kits'][0];check(count($updated['common'])===11);check($updated['navigationSupersededBy']===$b['id']);foreach($updated['cells'] as $cell){foreach($updated['common'] as $item)check(count(array_filter($cell['items'],fn($i)=>$i['art']===$item['art']))===1);check(count(array_filter($cell['items'],fn($i)=>$i['role']==='drive'))===1);}check($s['catalog']['articles']['RV']['price']===77);check($s['users']===[['id'=>1]]&&$s['orders']===[['id'=>3]]);$once=$s;check(!StulpPresentation::upgrade($s,$dir)&&$once===$s);
 $a['note']='user edit';$custom=['catalog'=>['articles'=>$seed['articles'],'kits'=>[$a,$b]]];StulpPresentation::upgrade($custom,$dir);check(!isset($custom['catalog']['kits'][0]['navigationSupersededBy']));check($custom['catalog']['kits'][0]['note']==='user edit');
 echo "Stulp presentation: common BOM, no duplicates, custom preservation, archive navigation and idempotence passed.\n";
}finally{foreach(['default-catalog.json','stulp-details-previous.json'] as $file)unlink($dir.'/'.$file);rmdir($dir);}
