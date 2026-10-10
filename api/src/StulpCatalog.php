<?php
declare(strict_types=1);
final class StulpCatalog {
 public static function upgrade(array &$state,string $storage):bool {
  if(!is_array($state['catalog']??null)||!empty($state['catalog']['stulpCatalogVersion']))return false;
  $seed=json_decode((string)file_get_contents($storage.'/default-catalog.json'),true);$next=$state;$cat=&$next['catalog'];
  foreach($seed['kits'] as $kit){if(!in_array($kit['catalogScheme']??'',['7.12','7.13','7.14','7.21','7.30','7.31','7.32','7.48'],true)||empty($kit['catalogPrepared']))continue;
   foreach($kit['catalogParts'] as $art){if(!isset($seed['articles'][$art]))throw new RuntimeException('Missing catalogue article');if(!isset($cat['articles'][$art]))$cat['articles'][$art]=$seed['articles'][$art];}
   $found=false;foreach($cat['kits'] as &$old){if($old['id']!==$kit['id'])continue;$found=true;
    // Upgrade only untouched empty drafts. Customised recipes must never be overwritten.
    if(!empty($old['catalogDraft'])&&empty($old['rows'])&&empty($old['columns'])&&empty($old['common'])&&empty($old['cells']))$old=$kit;
   }unset($old);if(!$found)$cat['kits'][]=$kit;
   foreach($seed['catalogSchemes'] as $source)if($source['kitId']===$kit['id']){foreach($cat['catalogSchemes'] as &$record)if($record['kitId']===$kit['id'])$record=$source;unset($record);}
  }
  $cat['stulpCatalogVersion']=1;$next['catalogUpdatedAt']=date(DATE_ATOM);
  if(is_file($storage.'/state.json')&&!copy($storage.'/state.json',$storage.'/state-before-stulp-catalog-'.date('Ymd-His').'.json'))throw new RuntimeException('Catalogue backup failed');
  $state=$next;return true;
 }
}
