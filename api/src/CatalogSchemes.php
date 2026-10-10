<?php
declare(strict_types=1);
final class CatalogSchemes {
 public static function upgrade(array &$state,string $storage):bool {
  if(!is_array($state['catalog']??null)||!empty($state['catalog']['catalogSchemesVersion']))return false;
  $seed=json_decode((string)file_get_contents($storage.'/default-catalog.json'),true);
  if(!is_array($seed['catalogSchemes']??null))throw new RuntimeException('Catalogue schemes unavailable');
  $updated=$state; $cat=&$updated['catalog'];$ids=array_fill_keys(array_column($cat['kits'],'id'),true);
  foreach($seed['kits'] as $k){if(!str_starts_with($k['id'],'catalog-pvc-')&&!str_starts_with($k['id'],'pvc-fanlight-'))continue;if(isset($ids[$k['id']]))continue;
   foreach(array_merge($k['common'],...array_map(static fn($c)=>$c['items']??[],array_values($k['cells']))) as $item){$art=$item['art'];if(!isset($cat['articles'][$art])&&isset($seed['articles'][$art])){$cat['articles'][$art]=$seed['articles'][$art];$cat['articles'][$art]['price']=null;}}
   $cat['kits'][]=$k;
  }
  $cat['catalogSchemes']=$seed['catalogSchemes'];$cat['catalogSchemesVersion']=1;$updated['catalogUpdatedAt']=date(DATE_ATOM);
  if(is_file($storage.'/state.json')&&!copy($storage.'/state.json',$storage.'/state-before-catalog-schemes-'.date('Ymd-His').'.json'))throw new RuntimeException('Catalogue backup failed');
  $state=$updated;return true;
 }
}
