<?php
declare(strict_types=1);
final class StulpDetails {
 public static function validate(array $kit,callable $items):void {
  if(!array_key_exists('heightRecipes',$kit))return;
  if(!is_array($kit['heightRecipes']))throw new InvalidArgumentException('Invalid height recipes');
  foreach($kit['heightRecipes'] as $id=>$recipe){
   if(!in_array($id,array_column($kit['rows'],'id'),true)||!is_array($recipe))throw new InvalidArgumentException('Invalid height recipe row');
   $items($recipe['items']??null,$kit['name']);
  }
 }
 public static function upgrade(array &$state,string $storage):bool {
  if(!is_array($state['catalog']??null)||!empty($state['catalog']['stulpDetailsVersion']))return false;
  $seed=json_decode((string)file_get_contents($storage.'/default-catalog.json'),true,512,JSON_THROW_ON_ERROR);
  $previous=json_decode((string)file_get_contents($storage.'/stulp-details-previous.json'),true,512,JSON_THROW_ON_ERROR);
  $previous=array_column($previous,null,'id');$next=$state;$cat=&$next['catalog'];
  foreach($seed['kits'] as $template){
   if(empty($template['stulpDetailsVersion']))continue;
   $found=false;$custom=false;
   foreach($cat['kits'] as &$old){if($old['id']!==$template['id'])continue;$found=true;
    if($old==($previous[$template['id']]??null)||$old==$template)$old=$template;else $custom=true;
   }unset($old);
   if($custom){$template['id'].='-catalog-v2';}
   if((!$found||$custom)&&!in_array($template['id'],array_column($cat['kits'],'id'),true))$cat['kits'][]=$template;
   foreach($template['catalogParts'] as $art)if(!isset($cat['articles'][$art]))$cat['articles'][$art]=$seed['articles'][$art];
   foreach($seed['catalogSchemes'] as $scheme)if(($scheme['section']??'')===$template['catalogScheme']){
    $scheme['kitId']=$template['id'];$updated=false;
    foreach($cat['catalogSchemes'] as &$oldScheme)if($oldScheme['kitId']===$scheme['kitId']){$oldScheme=$scheme;$updated=true;}unset($oldScheme);
    if(!$updated)$cat['catalogSchemes'][]=$scheme;
   }
  }
  // Update proven compatibility metadata, preserving prices, photos and all account data.
  foreach(['PS.800','PS.1200','PS.1600','PS.2000','PS.2400','ZMS.L','ZMS.R','XZ.SP','Z.SP','ZV.SP','XZ.ST','Z.ST','ZV.ST'] as $art){
   if(!isset($cat['articles'][$art]))$cat['articles'][$art]=$seed['articles'][$art];
   else foreach(['variants','section','group','source','packQty'] as $field)if(isset($seed['articles'][$art][$field]))$cat['articles'][$art][$field]=$seed['articles'][$art][$field];
  }
  $cat['stulpCompatibility']=$seed['stulpCompatibility'];$cat['stulpDetailsVersion']=1;$next['catalogUpdatedAt']=date(DATE_ATOM);
  if(is_file($storage.'/state.json')&&!copy($storage.'/state.json',$storage.'/state-before-stulp-details-'.date('Ymd-His').'.json'))throw new RuntimeException('Catalogue backup failed');
  $state=$next;return true;
 }
}
