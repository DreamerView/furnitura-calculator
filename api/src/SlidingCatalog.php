<?php
declare(strict_types=1);
final class SlidingCatalog {
 public static function upgrade(array &$state,string $storage):bool {
  if(!is_array($state['catalog']??null)||!empty($state['catalog']['slidingCatalogVersion']))return false;
  $seed=json_decode((string)file_get_contents($storage.'/default-catalog.json'),true);$next=$state;$cat=&$next['catalog'];
  foreach($seed['kits'] as $kit){if(!in_array($kit['catalogScheme']??'',['7.26','7.51','7.52'],true)||empty($kit['catalogPrepared']))continue;
   foreach($kit['catalogParts'] as $art){if(!isset($seed['articles'][$art]))throw new RuntimeException('Missing catalogue article');if(!isset($cat['articles'][$art]))$cat['articles'][$art]=$seed['articles'][$art];}
   $found=false;foreach($cat['kits'] as &$old){if($old['id']!==$kit['id'])continue;$found=true;
    // Upgrade only untouched empty drafts. Customised recipes must never be overwritten.
    if(!empty($old['catalogDraft'])&&empty($old['rows'])&&empty($old['columns'])&&empty($old['common'])&&empty($old['cells']))$old=$kit;
   }unset($old);if(!$found)$cat['kits'][]=$kit;
   foreach($seed['catalogSchemes'] as $source)if($source['kitId']===$kit['id']){foreach($cat['catalogSchemes'] as &$record)if($record['kitId']===$kit['id'])$record=$source;unset($record);}
  }
  $cat['slidingCatalogVersion']=1;$next['catalogUpdatedAt']=date(DATE_ATOM);
  if(is_file($storage.'/state.json')&&!copy($storage.'/state.json',$storage.'/state-before-sliding-catalog-'.date('Ymd-His').'.json'))throw new RuntimeException('Catalogue backup failed');
  $state=$next;return true;
 }
}
