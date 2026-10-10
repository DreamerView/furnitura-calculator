<?php
declare(strict_types=1);
final class FrameProfiles {
 public static function withDefaults(array $catalog): array {
  $revision=2026101107;
  $defaults=json_decode(file_get_contents(dirname(__DIR__,2).'/assets/data/frame-profiles.json'),true,512,JSON_THROW_ON_ERROR);
  if(!array_key_exists('frameProfiles',$catalog))$catalog['frameProfiles']=$defaults;
  elseif(is_array($catalog['frameProfiles'])&&$catalog['frameProfiles']!==[]&&($catalog['frameProfilesRevision']??0)<$revision){
   // Append only this release's new records. Never overwrite custom deductions or restore older deletions.
   $known=array_column($catalog['frameProfiles'],'id');
   foreach($defaults as $row)if(($row['introducedRevision']??0)>($catalog['frameProfilesRevision']??0)&&($row['introducedRevision']??0)>0&&!in_array($row['id'],$known,true))$catalog['frameProfiles'][]=$row;
  }
  $catalog['frameProfilesRevision']=$revision;
  return $catalog;
 }
 public static function validate($rows): void {
  if(!is_array($rows)||!array_is_list($rows)||count($rows)>500)throw new InvalidArgumentException('Invalid frame profile catalogue');
  $ids=[];
  foreach($rows as $r){
   if(!is_array($r)||!is_string($r['id']??null)||!preg_match('/^[a-zA-Z0-9_-]{1,100}$/',$r['id'])||isset($ids[$r['id']])||!is_string($r['name']??null)||!trim($r['name'])||strlen($r['name'])>1000||!is_bool($r['enabled']??null))throw new InvalidArgumentException('Invalid frame profile');
   $ids[$r['id']]=true;
   foreach(['widthDeduction','heightDeduction'] as $key){$v=$r[$key]??null;if($v===null&&!$r['enabled'])continue;if(!is_int($v)&&!is_float($v)||!is_finite((float)$v)||$v<0||$v>1000)throw new InvalidArgumentException('Invalid frame deduction');}
   foreach(['source','note'] as $key)if(!is_string($r[$key]??null)||strlen($r[$key])>5000)throw new InvalidArgumentException('Invalid frame source');
   if($r['source']!==''&&!preg_match('~^https?://~i',$r['source']))throw new InvalidArgumentException('Invalid frame source URL');
  }
 }
}
