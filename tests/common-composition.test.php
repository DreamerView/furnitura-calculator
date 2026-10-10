<?php
require __DIR__.'/../api/src/CommonComposition.php';
function ccAssert($v,$message='Common composition assertion failed'){if(!$v)throw new RuntimeException($message);}
$root=dirname(__DIR__);$seed=json_decode(file_get_contents($root.'/storage/default-catalog.json'),true);$prior=json_decode(file_get_contents($root.'/storage/tilt-first-8-previous.json'),true);
$tmp=$root.'/storage/test-common-'.bin2hex(random_bytes(4));mkdir($tmp);
try {
 foreach(['default-catalog.json','tilt-first-8-previous.json'] as $f)copy($root.'/storage/'.$f,$tmp.'/'.$f);
 $cat=$seed;unset($cat['commonCompositionVersion']);foreach($cat['kits'] as &$k){if($k['id']===$prior['id'])$k=$prior;if($k['id']==='catalog-pvc-7-6'){$k['common']=[];$oldCells=$k['cells'];}}unset($k);
 $cat['articles']['NO.600.TF']['variants']=['roller11'];$cat['articles']['XU']['price']=77;
 $s=['catalog'=>$cat,'users'=>[['id'=>123]],'priceBooks'=>[['name'=>'A','prices'=>['XU'=>55]]]];$before=$s;
 file_put_contents($tmp.'/state.json',json_encode($s));ccAssert(CommonComposition::upgrade($s,$tmp));ccAssert(count(glob($tmp.'/state-before-common-composition-*.json'))===1);
 ccAssert($s['users']===$before['users']&&$s['priceBooks']===$before['priceBooks']);ccAssert($s['catalog']['articles']['XU']['price']===77);
 foreach($s['catalog']['kits'] as $k){if($k['id']==='catalog-pvc-7-6')ccAssert(count($k['common'])===13&&$k['cells']===$oldCells);if($k['id']===$prior['id'])ccAssert(!$k['catalogDraft']&&count($k['common'])===13);}
 $once=$s;ccAssert(!CommonComposition::upgrade($s,$tmp)&&$s===$once);
 $custom=$before;foreach($custom['catalog']['kits'] as &$k)if($k['id']===$prior['id']){$k['note']='manual';$saved=$k;}unset($k);
 CommonComposition::upgrade($custom,$tmp);foreach($custom['catalog']['kits'] as $k)if($k['id']===$prior['id'])ccAssert($k===$saved);ccAssert(in_array('prepared-tilt-first-8',array_column($custom['catalog']['kits'],'id')));
 $kit=['rows'=>[['id'=>'r']], 'columns'=>[['id'=>'a'],['id'=>'b']], 'cells'=>['r|a'=>['items'=>[['art'=>'A','qty'=>4,'role'=>'manual'],['art'=>'D','qty'=>1,'role'=>'drive']]],'r|b'=>['items'=>[['art'=>'A','qty'=>2,'role'=>'manual']]]]];
 ccAssert(CommonComposition::shared($kit)===[['art'=>'A','qty'=>2,'role'=>'manual']]);unset($kit['cells']['r|b']);ccAssert(CommonComposition::shared($kit)===[]);
 foreach($seed['kits'] as $k)if(in_array($k['id'],['catalog-pvc-7-6','catalog-pvc-7-25','catalog-pvc-7-51','catalog-pvc-7-52']))ccAssert(CommonComposition::shared($k)===$k['common'],'Seed/shared mismatch '.$k['id']);
 echo "Common migration: backup, idempotence, custom recipes/prices preserved, shared minimum quantities and incomplete grid passed.\n";
} finally {foreach(glob($tmp.'/*') as $f)unlink($f);rmdir($tmp);}
