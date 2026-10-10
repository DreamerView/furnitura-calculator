<?php
declare(strict_types=1);
final class TiltFirstWorkbook {
 public static function validateCell(array $cell,array $kit,string $key,callable $items):void {
  if(!array_key_exists('sizeRecipes',$cell))return;
  if(!is_array($cell['sizeRecipes'])||!array_is_list($cell['sizeRecipes']))throw new InvalidArgumentException('Invalid size recipes');
  [$rid,$cid]=array_pad(explode('|',$key),2,'');$rows=array_column($kit['rows'],null,'id');$cols=array_column($kit['columns'],null,'id');
  foreach($cell['sizeRecipes'] as $index=>$r){
   if(!is_array($r))throw new InvalidArgumentException('Invalid size recipe');$items($r['items']??null,$kit['name']);
   foreach(['width'=>$cols[$cid]??null,'height'=>$rows[$rid]??null] as $axis=>$outer){$v=$r[$axis]??null;if(!$outer||!is_array($v)||!is_int($v['from']??null)||!is_int($v['to']??null)||$v['from']<$outer['from']||$v['to']>$outer['to']||$v['from']>$v['to'])throw new InvalidArgumentException('Invalid size recipe range');}
   foreach(array_slice($cell['sizeRecipes'],0,$index) as $p)if($p['width']['from']<=$r['width']['to']&&$r['width']['from']<=$p['width']['to']&&$p['height']['from']<=$r['height']['to']&&$r['height']['from']<=$p['height']['to'])throw new InvalidArgumentException('Overlapping size recipes');
  }
 }
 public static function upgrade(array &$state,string $storage):bool {
  if(!is_array($state['catalog']??null)||!empty($state['catalog']['tiltFirstWorkbookVersion']))return false;
  $seed=json_decode((string)file_get_contents($storage.'/default-catalog.json'),true);$prior=json_decode((string)file_get_contents($storage.'/tilt-first-workbook-previous.json'),true);$target=null;
  foreach($seed['kits'] as $kit)if($kit['id']==='catalog-pvc-7-6')$target=$kit;
  if(!$target||!$prior)throw new RuntimeException('Missing workbook migration template');
  $next=$state;$cat=&$next['catalog'];$found=false;$custom=false;
  foreach($cat['kits'] as &$old){if($old['id']!==$target['id'])continue;$found=true;
   if($old==$target||$old==$prior||(!empty($old['catalogDraft'])&&empty($old['rows'])&&empty($old['columns'])&&empty($old['common'])&&empty($old['cells'])))$old=$target;
   else $custom=true;
  }unset($old);
  if(!$found)$cat['kits'][]=$target;
  if($custom){$target['id']='workbook-tilt-first-11';if(!in_array($target['id'],array_column($cat['kits'],'id'),true))$cat['kits'][]=$target;}
  foreach($seed['articles'] as $art=>$record)if(!isset($cat['articles'][$art]))$cat['articles'][$art]=$record;
  // User requested provisional base prices; downstream negotiated price books stay intact.
  foreach($cat['articles'] as &$record)$record['price']=10;unset($record);
  $cat['priceCurrency']='RUB';$cat['tiltFirstWorkbookVersion']=1;$next['catalogUpdatedAt']=date(DATE_ATOM);
  if(is_file($storage.'/state.json')&&!copy($storage.'/state.json',$storage.'/state-before-tilt-first-workbook-'.date('Ymd-His').'.json'))throw new RuntimeException('Backup failed');
  $state=$next;return true;
 }
}
