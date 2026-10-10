<?php
declare(strict_types=1);
final class StulpPresentation {
 public static function upgrade(array &$state,string $storage):bool {
  if(!is_array($state['catalog']??null)||!empty($state['catalog']['stulpPresentationVersion']))return false;
  $seed=json_decode(file_get_contents($storage.'/default-catalog.json'),true,512,JSON_THROW_ON_ERROR);
  $previous=array_column(json_decode(file_get_contents($storage.'/stulp-details-previous.json'),true,512,JSON_THROW_ON_ERROR),null,'id');
  $next=$state;$cat=&$next['catalog'];$templates=array_column($seed['kits'],null,'id');
  foreach($cat['kits'] as &$kit){
   $id=$kit['id'];if(!in_array($id,['catalog-pvc-7-12','catalog-pvc-7-30'],true))continue;
   // Ignore reference-list metadata only; never hide a manually changed assembly.
   $compare=$kit;$old=$previous[$id]??[];foreach(['catalogParts','catalogGroups'] as $field){unset($compare[$field],$old[$field]);}
   if($compare==$old)foreach($cat['kits'] as $candidate)if(str_starts_with($candidate['id'],$id.'-')&&!empty($candidate['stulpNodesVersion'])){$kit['navigationSupersededBy']=$candidate['id'];break;}
   if(!empty($kit['common']))continue;
   $common=$templates[$id]['common']??[];if(!$common)continue;
   foreach($common as $item)if(!isset($cat['articles'][$item['art']]))$cat['articles'][$item['art']]=$seed['articles'][$item['art']];
   $kit['common']=$common;
   $fill=static function(array &$recipe)use($common):void{
    foreach($common as $item){$qty=0;foreach($recipe['items']??[] as $existing)if($existing['art']===$item['art']&&($existing['role']??'manual')===($item['role']??'manual'))$qty+=$existing['qty'];if($qty<$item['qty']){$item['qty']-=$qty;$recipe['items'][]=$item;}}
   };
   foreach($kit['cells'] as &$cell){$fill($cell);if(isset($cell['sizeRecipes']))foreach($cell['sizeRecipes'] as &$recipe)$fill($recipe);unset($recipe);}unset($cell);
   if(isset($kit['heightRecipes']))foreach($kit['heightRecipes'] as &$recipe)$fill($recipe);unset($recipe);
  }unset($kit);
  $cat['stulpPresentationVersion']=1;$next['catalogUpdatedAt']=date(DATE_ATOM);
  if(is_file($storage.'/state.json')&&!copy($storage.'/state.json',$storage.'/state-before-stulp-presentation-'.date('Ymd-His').'.json'))throw new RuntimeException('Catalogue backup failed');
  $state=$next;return true;
 }
}
