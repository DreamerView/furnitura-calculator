<?php
require __DIR__.'/../api/src/AdvertisingMedia.php';
function check($value,$message){if(!$value)throw new Exception($message);}
$dir=sys_get_temp_dir().'/futuruss-ad-test-'.bin2hex(random_bytes(6));
$png='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aF9sAAAAASUVORK5CYII=';
$video='data:video/mp4;base64,'.base64_encode("\x00\x00\x00\x18ftypisom\x00\x00\x00\x00isommp42");
try{
 $cat=['advertisingMedia'=>[['type'=>'image','src'=>$png,'name'=>'photo.png'],['type'=>'video','src'=>$video,'name'=>'video.mp4']]];$created=AdvertisingMedia::normalize($cat,[],$dir);check(count($created)===2,'two files saved');check($cat['advertisingMedia'][1]['type']==='video','video type');check(count(AdvertisingMedia::files($cat,$dir))===2,'references resolve');
 $again=$cat;check(AdvertisingMedia::normalize($again,$cat,$dir)===[],'stored files reused');check($again===$cat,'metadata preserved');
 $bad=['advertisingMedia'=>[['src'=>$png],['src'=>'https://external.example/video.mp4']]];try{AdvertisingMedia::normalize($bad,[],$dir);throw new Exception('invalid external source accepted');}catch(InvalidArgumentException $e){}check(count(glob($dir.'/*'))===2,'failed batch rolls back');
 $forged=['advertisingMedia'=>[['src'=>'api/index.php?action=advertising_media&id='.str_repeat('a',48)]]];try{AdvertisingMedia::normalize($forged,$cat,$dir);throw new Exception('forged reference accepted');}catch(InvalidArgumentException $e){}
 $overflow=['advertisingMedia'=>array_fill(0,21,['src'=>$png])];try{AdvertisingMedia::normalize($overflow,[],$dir);throw new Exception('count limit missing');}catch(InvalidArgumentException $e){}
 $removed=['advertisingMedia'=>[$cat['advertisingMedia'][0]]];check(count(array_diff(AdvertisingMedia::files($cat,$dir),AdvertisingMedia::files($removed,$dir)))===1,'obsolete file identified');
 check(AdvertisingMedia::id('../../video.mp4')===null,'path traversal rejected');echo "Advertising media: 7 checks passed\n";
}finally{foreach(glob($dir.'/*')?:[] as $file)unlink($file);if(is_dir($dir))rmdir($dir);}
