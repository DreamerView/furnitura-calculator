<?php
declare(strict_types=1);
/** Upgrade stock ALU recipes only. Preserve customised recipes and all price books. */
final class AluminumAssemblies {
 public static function upgrade(array &$state,string $storage):bool {
  if(!is_array($state['catalog']??null)||!empty($state['catalog']['aluminumAssembliesVersion']))return false;
  $seed=json_decode((string)file_get_contents($storage.'/default-catalog.json'),true,512,JSON_THROW_ON_ERROR);
  $prior=json_decode((string)file_get_contents($storage.'/aluminum-assemblies-previous.json'),true,512,JSON_THROW_ON_ERROR);
  $next=$state;$cat=&$next['catalog'];$index=array_flip(array_column($cat['kits'],'id'));$needed=[];
  foreach($seed['kits'] as $kit){
   if(($kit['family']??'')!=='aluminum'||empty($kit['aluminumAssemblyVersion']))continue;
   $id=$kit['id'];
   if(!isset($index[$id]))$cat['kits'][]=$kit;
   elseif($cat['kits'][$index[$id]]===$kit||$cat['kits'][$index[$id]]==($prior['kits'][$id]??null))$cat['kits'][$index[$id]]=$kit;
   else {
    $kit['id']='catalog-update-'.$id;
    if(!in_array($kit['id'],array_column($cat['kits'],'id'),true))$cat['kits'][]=$kit;
   }
   foreach($kit['rows'] as $row)foreach($row['drives'] as $art)$needed[$art]=true;
   foreach($kit['common'] as $item)$needed[$item['art']]=true;
   foreach($kit['cells'] as $cell)foreach($cell['items'] as $item)$needed[$item['art']]=true;
  }
  // Include profile/handed/scissors counterparts used dynamically by the calculator.
  foreach($seed['articles'] as $art=>$record)if(isset($needed[$art])||preg_match('/^(?:AL(?:02)?\.|X?SNO\.|XPNB\.S\.|PNF\.S\.)/',$art)){
   if(!isset($cat['articles'][$art]))$cat['articles'][$art]=$record;
  }
  $cat['aluminumAssembliesVersion']=1;$next['catalogUpdatedAt']=date(DATE_ATOM);
  if(is_file($storage.'/state.json')&&!copy($storage.'/state.json',$storage.'/state-before-aluminum-assemblies-'.date('Ymd-His').'.json'))throw new RuntimeException('Catalogue backup failed');
  $state=$next;return true;
 }
}
