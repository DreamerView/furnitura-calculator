<?php
declare(strict_types=1);
final class DornmassCatalog {
 public static function upgrade(array &$state,string $storage):bool {
  if(!is_array($state['catalog']??null)||!empty($state['catalog']['dornmass75Version']))return false;
  $next=$state;$cat=&$next['catalog'];
  foreach($cat['articles'] as &$record)if(($record['dornmass']??null)==7&&preg_match('/дорнмасс\s*7[,.]5/ui',$record['name']??''))$record['dornmass']=7.5;
  unset($record);
  $seed=json_decode((string)file_get_contents($storage.'/default-catalog.json'),true,512,JSON_THROW_ON_ERROR);
  foreach(['1200-1','1600-2','2000-2','2400-4'] as $size){$art='XPO.'.$size.'.D7';if(!isset($cat['articles'][$art]))$cat['articles'][$art]=$seed['articles'][$art];}
  $cat['dornmass75Version']=1;$next['catalogUpdatedAt']=date(DATE_ATOM);
  if(is_file($storage.'/state.json')&&!copy($storage.'/state.json',$storage.'/state-before-dornmass75-'.date('Ymd-His').'.json'))throw new RuntimeException('Catalogue backup failed');
  $state=$next;return true;
 }
}
