<?php
declare(strict_types=1);
final class StulpNodes {
 public static function upgrade(array &$state,string $storage):bool {
  if(!is_array($state['catalog']??null)||!empty($state['catalog']['stulpNodesVersion']))return false;
  $seed=json_decode(file_get_contents($storage.'/default-catalog.json'),true,512,JSON_THROW_ON_ERROR);
  $previous=array_column(json_decode(file_get_contents($storage.'/stulp-nodes-previous.json'),true,512,JSON_THROW_ON_ERROR),null,'id');
  $next=$state;$cat=&$next['catalog'];
  foreach($seed['kits'] as $template){if(empty($template['stulpNodesVersion']))continue;$updated=false;
   foreach($cat['kits'] as &$kit){if(!in_array($kit['id'],[$template['id'],$template['id'].'-catalog-v2',$template['id'].'-ranges-v1'],true))continue;
    $compare=$kit;$compare['id']=$template['id'];if($compare==($previous[$template['id']]??null)||$compare==$template){$id=$kit['id'];$kit=$template;$kit['id']=$id;$updated=true;}
   }unset($kit);
   if(!$updated){if(in_array($template['id'],array_column($cat['kits'],'id'),true))$template['id'].='-nodes-v1';if(!in_array($template['id'],array_column($cat['kits'],'id'),true))$cat['kits'][]=$template;}
   foreach($template['catalogParts']??[] as $art)if(!isset($cat['articles'][$art])&&isset($seed['articles'][$art]))$cat['articles'][$art]=$seed['articles'][$art];
  }
  $cat['stulpNodesVersion']=1;$next['catalogUpdatedAt']=date(DATE_ATOM);
  if(is_file($storage.'/state.json')&&!copy($storage.'/state.json',$storage.'/state-before-stulp-nodes-'.date('Ymd-His').'.json'))throw new RuntimeException('Catalogue backup failed');
  $state=$next;return true;
 }
}
