<?php
declare(strict_types=1);
final class AdvertisingMedia {
 const TYPES=['image/png'=>'png','image/jpeg'=>'jpg','image/webp'=>'webp','video/mp4'=>'mp4','video/webm'=>'webm'];
 public static function id(string $src): ?string {return preg_match('~^api/index\.php\?action=advertising_media&id=([a-f0-9]{48})$~D',$src,$m)?$m[1]:null;}
 public static function files(array $catalog,string $dir): array {$out=[];foreach($catalog['advertisingMedia']??[] as $item){$id=self::id((string)($item['src']??''));if($id)foreach(self::TYPES as $ext){$path=$dir.'/'.$id.'.'.$ext;if(is_file($path))$out[]=$path;}}return array_unique($out);}
 public static function normalize(array &$cat,array $previous,string $dir): array {
  if(!array_key_exists('advertisingMedia',$cat))return [];
  if(!is_array($cat['advertisingMedia'])||count($cat['advertisingMedia'])>20)throw new InvalidArgumentException('Реклама: не более 20 файлов.');
  $allowed=[];foreach($previous['advertisingMedia']??[] as $item)$allowed[(string)($item['src']??'')]=$item;
  $created=[];$out=[];
  try{foreach($cat['advertisingMedia'] as $item){
   if(!is_array($item)||!is_string($item['src']??null))throw new InvalidArgumentException('Некорректный рекламный файл.');
   $src=$item['src'];$name=substr((string)($item['name']??''),0,240);
   if(self::id($src)){if(!isset($allowed[$src])||!self::files(['advertisingMedia'=>[$allowed[$src]]],$dir))throw new InvalidArgumentException('Рекламный файл не найден.');$out[]=array_merge($allowed[$src],['name'=>$name]);continue;}
   if(!preg_match('~^data:(image/(?:png|jpeg|webp)|video/(?:mp4|webm));base64,([A-Za-z0-9+/=]+)$~D',$src,$m))throw new InvalidArgumentException('Реклама: PNG, JPG, WEBP, MP4 или WEBM.');
   $mime=$m[1];$video=str_starts_with($mime,'video/');$limit=($video?20:4)*1024*1024;if(strlen($m[2])>ceil($limit/3)*4)throw new InvalidArgumentException('Рекламный файл превышает допустимый размер.');$bytes=base64_decode($m[2],true);
   if($bytes===false||strlen($bytes)===0||strlen($bytes)>$limit)throw new InvalidArgumentException('Рекламный файл превышает допустимый размер.');
   if(!$video){$info=@getimagesizefromstring($bytes);if(!$info||($info['mime']??'')!==$mime)throw new InvalidArgumentException('Некорректное рекламное изображение.');}
   elseif(($mime==='video/mp4'&&substr($bytes,4,4)!=='ftyp')||($mime==='video/webm'&&substr($bytes,0,4)!=="\x1a\x45\xdf\xa3"))throw new InvalidArgumentException('Некорректное рекламное видео.');
   if(!is_dir($dir)&&!mkdir($dir,0755,true)&&!is_dir($dir))throw new RuntimeException('Не удалось создать папку рекламы.');
   $id=bin2hex(random_bytes(24));$file=$dir.'/'.$id.'.'.self::TYPES[$mime];if(file_put_contents($file,$bytes,LOCK_EX)!==strlen($bytes)){@unlink($file);throw new RuntimeException('Не удалось сохранить рекламный файл.');}$created[]=$file;
   $out[]=['type'=>$video?'video':'image','mime'=>$mime,'src'=>'api/index.php?action=advertising_media&id='.$id,'name'=>$name];
  }}catch(Throwable $e){foreach($created as $file)@unlink($file);throw $e;}
  $cat['advertisingMedia']=$out;return $created;
 }
}

