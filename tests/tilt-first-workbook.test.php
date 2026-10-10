<?php
require __DIR__.'/../api/src/TiltFirstWorkbook.php';
function requireTF($v){if(!$v)throw new RuntimeException('Workbook assertion failed');}
$root=dirname(__DIR__);$seed=json_decode(file_get_contents($root.'/storage/default-catalog.json'),true);$prior=json_decode(file_get_contents($root.'/storage/tilt-first-workbook-previous.json'),true);
$tmp=$root.'/storage/test-tf-workbook-'.bin2hex(random_bytes(4));mkdir($tmp);foreach(['default-catalog.json','tilt-first-workbook-previous.json'] as $f)copy($root.'/storage/'.$f,$tmp.'/'.$f);
$cat=$seed;unset($cat['tiltFirstWorkbookVersion']);foreach($cat['kits'] as &$k)if($k['id']===$prior['id'])$k=$prior;unset($k);$cat['articles']['XU']['price']=77;
$s=['catalog'=>$cat,'users'=>[['id'=>1]],'priceBooks'=>[['name'=>'A','prices'=>['XU'=>55]]]];$before=$s;requireTF(TiltFirstWorkbook::upgrade($s,$tmp));requireTF($s['users']===$before['users']&&$s['priceBooks']===$before['priceBooks']);requireTF($s['catalog']['articles']['XU']['price']===10);$once=$s;requireTF(!TiltFirstWorkbook::upgrade($s,$tmp)&&$s===$once);
$custom=$before;foreach($custom['catalog']['kits'] as &$k)if($k['id']===$prior['id']){$k['note']='manual recipe';$saved=$k;}unset($k);TiltFirstWorkbook::upgrade($custom,$tmp);foreach($custom['catalog']['kits'] as $k)if($k['id']===$prior['id'])requireTF($k===$saved);requireTF(in_array('workbook-tilt-first-11',array_column($custom['catalog']['kits'],'id')));
$kit=current(array_filter($seed['kits'],fn($k)=>!empty($k['sizeRecipeMode'])));$validate=function($items,$label)use($seed){requireTF(is_array($items));foreach($items as $i)requireTF(isset($seed['articles'][$i['art']])&&is_int($i['qty'])&&$i['qty']>0);};
foreach($kit['cells'] as $key=>$cell)TiltFirstWorkbook::validateCell($cell,$kit,$key,$validate);
foreach($kit['cells'] as $key=>$cell)if(count($cell['sizeRecipes'])){ $cell['sizeRecipes'][]=$cell['sizeRecipes'][0];$caught=false;try{TiltFirstWorkbook::validateCell($cell,$kit,$key,$validate);}catch(InvalidArgumentException $e){$caught=true;}requireTF($caught);break;}
echo "Workbook migration: idempotence, custom recipes and commercial data preserved; API rejects overlapping ranges.\n";

foreach(['default-catalog.json','tilt-first-workbook-previous.json'] as $f)unlink($tmp.'/'.$f);rmdir($tmp);
