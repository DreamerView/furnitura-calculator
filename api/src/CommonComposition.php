<?php
declare(strict_types=1);
/** Shared items are already present in each full BOM: deriving common must never add quantities. */
final class CommonComposition {
 public static function shared(array $kit):array {
  if(empty($kit['cells'])||empty($kit['rows'])||empty($kit['columns']))return [];
  foreach($kit['rows'] as $row)foreach($kit['columns'] as $col)if(!isset($kit['cells'][$row['id'].'|'.$col['id']]))return [];
  $shared=null;$records=[];
  foreach($kit['cells'] as $cell)foreach(!empty($cell['sizeRecipes'])?$cell['sizeRecipes']:[$cell] as $recipe){
   $counts=[];
   foreach($recipe['items']??[] as $item){
    if(empty($item['art'])||in_array($item['role']??'', ['drive','scissors'],true)||!is_int($item['qty']??null)||$item['qty']<1)continue;
    $meta=$item;unset($meta['qty']);ksort($meta);$key=json_encode($meta,JSON_UNESCAPED_UNICODE|JSON_THROW_ON_ERROR);
    $counts[$key]=($counts[$key]??0)+$item['qty'];$records[$key]=$item;
   }
   if($shared===null)$shared=$counts;else foreach($shared as $key=>$qty){if(!isset($counts[$key]))unset($shared[$key]);else $shared[$key]=min($qty,$counts[$key]);}
  }
  $result=[];foreach($shared??[] as $key=>$qty){$item=$records[$key];$item['qty']=$qty;$result[]=$item;}return $result;
 }
 public static function upgrade(array &$state,string $storage):bool {
  if(!is_array($state['catalog']??null)||!empty($state['catalog']['commonCompositionVersion']))return false;
  $seed=json_decode((string)file_get_contents($storage.'/default-catalog.json'),true,512,JSON_THROW_ON_ERROR);
  $prior=json_decode((string)file_get_contents($storage.'/tilt-first-8-previous.json'),true,512,JSON_THROW_ON_ERROR);
  $target=null;foreach($seed['kits'] as $kit)if($kit['id']==='catalog-pvc-7-25')$target=$kit;
  if(!$target)throw new RuntimeException('Missing Tilt First 8 migration template');
  $next=$state;$cat=&$next['catalog'];$custom=false;$found=false;
  foreach($cat['kits'] as &$kit){
   if($kit['id']!==$target['id'])continue;$found=true;
   if($kit==$prior||$kit==$target)$kit=$target;else $custom=true;
  }unset($kit);
  // Keep edited recipes intact; offer the new catalogue recipe separately.
  if($custom){$target['id']='prepared-tilt-first-8';if(!in_array($target['id'],array_column($cat['kits'],'id'),true))$cat['kits'][]=$target;}
  if($found)foreach($seed['articles'] as $art=>$record)if(!isset($cat['articles'][$art]))$cat['articles'][$art]=$record;
  if(isset($cat['articles']['NO.600.TF']))$cat['articles']['NO.600.TF']['variants']=array_values(array_unique(array_merge($cat['articles']['NO.600.TF']['variants']??[],['roller11','roller8'])));
  foreach($cat['kits'] as &$kit)if(empty($kit['common']))$kit['common']=self::shared($kit);unset($kit);
  $cat['commonCompositionVersion']=1;$next['catalogUpdatedAt']=date(DATE_ATOM);
  if(is_file($storage.'/state.json')&&!copy($storage.'/state.json',$storage.'/state-before-common-composition-'.date('Ymd-His').'.json'))throw new RuntimeException('Backup failed');
  $state=$next;return true;
 }
}
