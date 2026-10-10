<?php
declare(strict_types=1);
final class TurnClampsCatalog {
 public static function upgrade(array &$state,string $storage):bool {
  if(!is_array($state['catalog']??null)||!empty($state['catalog']['turnClampsVersion']))return false;
  $next=$state;$seed=json_decode((string)file_get_contents($storage.'/default-catalog.json'),true,512,JSON_THROW_ON_ERROR);
  foreach(['N1.PN.S.B','N1.PN.S.K','N1.PN.S.A','N1.PN.S.BLACK','N1.PN.R.B','N1.PN.R.K','N1.PN.R.A','N1.PN.R.BLACK','PS1.S','PS1.R13K','PS1.R13R','PS1.R13D'] as $art)if(!isset($next['catalog']['articles'][$art]))$next['catalog']['articles'][$art]=$seed['articles'][$art];
  $next['catalog']['turnClampsVersion']=1;$next['catalogUpdatedAt']=date(DATE_ATOM);
  if(is_file($storage.'/state.json')&&!copy($storage.'/state.json',$storage.'/state-before-turn-clamps-'.date('Ymd-His').'.json'))throw new RuntimeException('Catalogue backup failed');
  $state=$next;return true;
 }
}
