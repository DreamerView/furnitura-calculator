<?php
declare(strict_types=1);
final class CatalogExpansion {
 public static function upgrade(array &$state,string $storage):bool {
  if(!is_array($state['catalog']??null)||!empty($state['catalog']['catalogExpansionVersion']))return false;
  $seed=json_decode((string)file_get_contents($storage.'/default-catalog.json'),true,512,JSON_THROW_ON_ERROR);
  $prior=json_decode((string)file_get_contents($storage.'/catalog-expansion-previous.json'),true,512,JSON_THROW_ON_ERROR);
  $next=$state;$cat=&$next['catalog'];$index=array_flip(array_column($cat['kits'],'id'));
  foreach($seed['kits'] as $kit){
   $id=$kit['id'];if(!isset($prior['kits'][$id])&&!str_starts_with($id,'pvc-door-')&&$id!=='pvc-fanlight-mushroom')continue;
   if(!isset($index[$id])){$cat['kits'][]=$kit;continue;}
   $old=$cat['kits'][$index[$id]];
   if($old==$kit||$old==($prior['kits'][$id]??null))$cat['kits'][$index[$id]]=$kit;
   elseif(empty($kit['catalogDraft'])){$kit['id']='catalog-update-'.$id;if(!in_array($kit['id'],array_column($cat['kits'],'id'),true))$cat['kits'][]=$kit;}
  }
  foreach($prior['articles'] as $art=>$fields){
   if(!isset($cat['articles'][$art])){$cat['articles'][$art]=$seed['articles'][$art];continue;}
   foreach($fields as $key=>$old)if(($cat['articles'][$art][$key]??null)===$old&&array_key_exists($key,$seed['articles'][$art]))$cat['articles'][$art][$key]=$seed['articles'][$art][$key];
  }
  foreach($seed['catalogSchemes'] as $scheme){$found=false;foreach($cat['catalogSchemes'] as &$existing)if($existing['section']===$scheme['section']){$existing['articles']=array_values(array_unique(array_merge($existing['articles'],$scheme['articles'])));$found=true;}unset($existing);if(!$found)$cat['catalogSchemes'][]=$scheme;}
  $needed=[];foreach($cat['kits'] as $kit){foreach($kit['catalogParts']??[] as $art)$needed[$art]=true;foreach($kit['common']??[] as $item)$needed[$item['art']]=true;foreach($kit['cells']??[] as $cell){foreach($cell['items']??[] as $item)$needed[$item['art']]=true;foreach($cell['sizeRecipes']??[] as $recipe)foreach($recipe['items'] as $item)$needed[$item['art']]=true;}}
  foreach($needed as $art=>$_)if(!isset($cat['articles'][$art])&&isset($seed['articles'][$art]))$cat['articles'][$art]=$seed['articles'][$art];
  $cat['catalogExpansionVersion']=1;$next['catalogUpdatedAt']=date(DATE_ATOM);
  if(is_file($storage.'/state.json')&&!copy($storage.'/state.json',$storage.'/state-before-catalog-expansion-'.date('Ymd-His').'.json'))throw new RuntimeException('Backup failed');
  $state=$next;return true;
 }
}
