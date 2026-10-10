<?php
declare(strict_types=1);
final class StrikeSelection {
 public static function upgrade(array &$state, string $storage): bool {
  if (!is_array($state['catalog']??null) || ($state['catalog']['strikeSelectionVersion']??0)>=1) return false;
  if(!isset($state['catalog']['articles']['ZK.40'])&&!isset($state['catalog']['articles']['ZK.45']))return false;
  if(is_file($storage.'/state.json')&&!copy($storage.'/state.json',$storage.'/state-before-strikes-'.date('Ymd-His').'.json'))throw new RuntimeException('Reference migration backup failed');
  $config=json_decode((string)file_get_contents($storage.'/strike-selection.json'),true,512,JSON_THROW_ON_ERROR);
  $seed=json_decode((string)file_get_contents($storage.'/default-catalog.json'),true,512,JSON_THROW_ON_ERROR);
  $catalog=&$state['catalog'];$catalog['strikeSelection']??=$config;
  $articles=[];
  foreach($config['profiles'] as $entry)foreach($entry as $role=>$value){
   if($role==='series'||$value===null)continue;
   foreach(is_array($value)?$value:[$value] as $art){
    if($role==='tiltBolt'||($role==='tiltFirst'&&$art==='ZTF.K13/30')){$articles[]=$art.'.L';$articles[]=$art.'.R';}
    else $articles[]=$art;
   }
  }
  foreach(array_unique($articles) as $art)if(!isset($catalog['articles'][$art])&&isset($seed['articles'][$art])){$catalog['articles'][$art]=$seed['articles'][$art];$catalog['articles'][$art]['price']=null;}
  $catalog['strikeSelectionVersion']=1;$state['catalogUpdatedAt']=date(DATE_ATOM);return true;
 }
}
