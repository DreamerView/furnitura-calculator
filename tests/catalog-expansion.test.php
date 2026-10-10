<?php
require __DIR__.'/../api/src/CatalogExpansion.php';
function ceAssert($value,$message='Catalogue expansion assertion failed'){if(!$value)throw new RuntimeException($message);}
$root=dirname(__DIR__);$seed=json_decode(file_get_contents($root.'/storage/default-catalog.json'),true);$prior=json_decode(file_get_contents($root.'/storage/catalog-expansion-previous.json'),true);$tmp=$root.'/storage/test-expansion-'.bin2hex(random_bytes(4));mkdir($tmp);
try {
 foreach(['default-catalog.json','catalog-expansion-previous.json'] as $f)copy($root.'/storage/'.$f,$tmp.'/'.$f);
 $cat=$seed;unset($cat['catalogExpansionVersion']);$cat['kits']=array_values(array_filter($cat['kits'],fn($k)=>!str_starts_with($k['id'],'pvc-door-')&&$k['id']!=='pvc-fanlight-mushroom'));
 foreach($cat['kits'] as &$k)if(isset($prior['kits'][$k['id']]))$k=$prior['kits'][$k['id']];unset($k);
 foreach($prior['articles'] as $art=>$fields)foreach($fields as $key=>$value){if($value===null)unset($cat['articles'][$art][$key]);else $cat['articles'][$art][$key]=$value;}
 $cat['articles']['PDR.16.D25']['price']=333;$cat['articles']['PDR.16.D25']['packQty']=88;$cat['articles']['PDR.16.D25']['unitWeightKg']=0.9;
 $s=['catalog'=>$cat,'users'=>[['id'=>42]],'priceBooks'=>[['A'=>['RV'=>555]]]];$before=$s;file_put_contents($tmp.'/state.json',json_encode($s));
 ceAssert(CatalogExpansion::upgrade($s,$tmp));ceAssert(count(glob($tmp.'/state-before-catalog-expansion-*.json'))===1);
 ceAssert($s['users']===$before['users']&&$s['priceBooks']===$before['priceBooks']);$a=$s['catalog']['articles']['PDR.16.D25'];ceAssert($a['price']===333&&$a['packQty']===88&&$a['unitWeightKg']===0.9);ceAssert($a['height']['min']===1600);
 ceAssert(count($s['catalog']['kits'])===count($seed['kits']));foreach($s['catalog']['kits'] as $k)ceAssert(empty($k['catalogDraft'])||!empty($k['catalogPrepared']));
 $once=$s;ceAssert(!CatalogExpansion::upgrade($s,$tmp)&&$s===$once);
 $custom=$before;foreach($custom['catalog']['kits'] as &$k)if($k['id']==='catalog-pvc-7-36'){$k['note']='Customer composition';$saved=$k;}unset($k);$custom['catalog']['articles']['PDR.16.D25']['height']=['min'=>1700,'max'=>1800];
 CatalogExpansion::upgrade($custom,$tmp);foreach($custom['catalog']['kits'] as $k)if($k['id']==='catalog-pvc-7-36')ceAssert($k===$saved);
 ceAssert(in_array('catalog-update-catalog-pvc-7-36',array_column($custom['catalog']['kits'],'id'),true));ceAssert($custom['catalog']['articles']['PDR.16.D25']['height']['min']===1700);
 echo "Catalogue expansion migration: backups, idempotence, custom BOMs, prices, logistics and account data preserved.\n";
} finally {foreach(glob($tmp.'/*') as $f)unlink($f);rmdir($tmp);}
