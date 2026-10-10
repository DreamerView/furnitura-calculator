<?php
declare(strict_types=1);
final class MushroomTurn {
 public static function upgrade(array &$state,string $storage):bool {
  if(!is_array($state['catalog']??null)||!empty($state['catalog']['mushroomTurnVersion']))return false;
  $seed=json_decode((string)file_get_contents($storage.'/default-catalog.json'),true);
  $kit=null;foreach($seed['kits'] as $k)if($k['id']==='pvc-turn-mushroom')$kit=$k;
  if(!$kit)throw new RuntimeException('Mushroom turn recipe unavailable');
  $updated=$state;$cat=&$updated['catalog'];
  if(!in_array($kit['id'],array_column($cat['kits'],'id'),true)){
   foreach(array_merge($kit['common'],...array_map(static fn($c)=>$c['items']??[],array_values($kit['cells']))) as $item){$art=$item['art'];if(!isset($cat['articles'][$art])){if(!isset($seed['articles'][$art]))throw new RuntimeException('Recipe article unavailable');$cat['articles'][$art]=$seed['articles'][$art];$cat['articles'][$art]['price']=null;}}
   $cat['kits'][]=$kit;
  }
  $cat['mushroomTurnVersion']=1;$updated['catalogUpdatedAt']=date(DATE_ATOM);
  if(is_file($storage.'/state.json')&&!copy($storage.'/state.json',$storage.'/state-before-mushroom-turn-'.date('Ymd-His').'.json'))throw new RuntimeException('Catalogue backup failed');
  $state=$updated;return true;
 }
}
