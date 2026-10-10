<?php
declare(strict_types=1);
final class KitRanges {
 public static function upgrade(array &$state,string $storage):bool {
  if(!is_array($state['catalog']??null)||!empty($state['catalog']['narrowMushroomRangeVersion']))return false;
  $cat=&$state['catalog'];$a=$cat['articles']['NO.600']??null;
  if(!$a||($a['width']['min']??999)>400||($a['width']['max']??0)<600)return false;
  $changed=false;
  foreach($cat['kits'] as &$k){
   if(($k['id']??'')!=='mushroom'||($k['variant']??'')!=='mushroom'||($k['family']??'pvc')==='aluminum')continue;
   $columns=$k['columns']??[];if(!$columns||min(array_column($columns,'from'))!==600)continue;
   if(is_file($storage.'/state.json')&&!copy($storage.'/state.json',$storage.'/state-before-ranges-'.date('Ymd-His').'.json'))throw new RuntimeException('Range migration backup failed');
   array_unshift($k['columns'],['id'=>'w-narrow-400-599','from'=>400,'to'=>599]);
   $k['note']=str_replace('ножницы 600–1400 мм.','ножницы 400–1400 мм; до 600 мм — универсальные NO.600.',$k['note']??'');$changed=true;
  }unset($k);
  if($changed){$cat['narrowMushroomRangeVersion']=1;$state['catalogUpdatedAt']=date(DATE_ATOM);}return $changed;
 }
}
