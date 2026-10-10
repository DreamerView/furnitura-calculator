<?php
declare(strict_types=1);
final class FrameProfiles {
 public static function withDefaults(array $catalog): array {
  if(!array_key_exists('frameProfiles',$catalog))$catalog['frameProfiles']=json_decode(file_get_contents(dirname(__DIR__,2).'/assets/data/frame-profiles.json'),true,512,JSON_THROW_ON_ERROR);
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
