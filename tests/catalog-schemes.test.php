<?php
require __DIR__.'/../api/src/CatalogSchemes.php';
function verify($v,$m){if(!$v)throw new RuntimeException($m);}
$storage=dirname(__DIR__).'/storage';$seed=json_decode(file_get_contents($storage.'/default-catalog.json'),true);
$original=$seed;$original['kits']=array_values(array_filter($seed['kits'],static fn($k)=>!str_starts_with($k['id'],'catalog-pvc-')&&!str_starts_with($k['id'],'pvc-fanlight-')));unset($original['catalogSchemes'],$original['catalogSchemesVersion']);
// No state.json is written: isolated fixture directory supplies only the seed.
$tmp=$storage.'/test-catalog-schemes-'.bin2hex(random_bytes(4));mkdir($tmp);copy($storage.'/default-catalog.json',$tmp.'/default-catalog.json');
try {
 $s=['catalog'=>$original,'users'=>[['id'=>42]],'nodes'=>[['id'=>7]],'quotes'=>[['total'=>456]]];$old=$s;
 verify(CatalogSchemes::upgrade($s,$tmp),'migration');verify(count($s['catalog']['kits'])===count($seed['kits']),'kit count');
 foreach($old['catalog']['kits'] as $i=>$k)verify($s['catalog']['kits'][$i]===$k,'existing recipe changed');
 verify($s['catalog']['articles']===$old['catalog']['articles'],'prices changed');
 foreach(['users','nodes','quotes'] as $key)verify($s[$key]===$old[$key],'business data changed');
 $once=$s;verify(!CatalogSchemes::upgrade($s,$tmp)&&$s===$once,'idempotence');
 $missing=$old;unset($missing['catalog']['articles']['FO2']);verify(CatalogSchemes::upgrade($missing,$tmp),'missing part migration');verify($missing['catalog']['articles']['FO2']['price']===null,'invented price');
 echo "Catalogue migration: preservation, idempotence and missing price passed.\n";
} finally {unlink($tmp.'/default-catalog.json');rmdir($tmp);}
