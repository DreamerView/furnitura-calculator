<?php
declare(strict_types=1);
require __DIR__.'/../api/src/CatalogPhotos.php';

$png='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR4nGP4z8DwHwAFAAH/iZk9HQAAAABJRU5ErkJggg==';
$pngUpdated='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR4nGNgYPj/HwADAgH/5ncLrgAAAABJRU5ErkJggg==';
$storage=sys_get_temp_dir().'/futuruss-photo-test-'.bin2hex(random_bytes(5));
$catalog=['articles'=>['ART-1'=>['name'=>'Part','photos'=>[]]]];
$result=CatalogPhotos::mutate($catalog,['article'=>'ART-1','operation'=>'add','photo'=>['name'=>'folder/one.png','src'=>$png]],$storage);
$stored=$result['photos'][0]['src']??'';$file=$result['createdFiles'][0]??'';
if(empty($result['added'])||count($result['photos'])!==1||$result['photos'][0]['name']!=='one.png'||!is_file($file)||str_contains($stored,'base64,'))throw new RuntimeException('A valid photo was not saved as a server file and URL.');
$duplicate=CatalogPhotos::mutate($catalog,['article'=>'ART-1','operation'=>'add','photo'=>['name'=>'ONE.PNG','src'=>$png]],$storage);
if(!empty($duplicate['added'])||!empty($duplicate['createdFiles'])||count($catalog['articles']['ART-1']['photos'])!==1)throw new RuntimeException('Duplicate photo names must not create another server file.');
$updated=CatalogPhotos::mutate($catalog,['article'=>'ART-1','operation'=>'add','photo'=>['name'=>'one.png','src'=>$pngUpdated]],$storage);
$updatedPhoto=$updated['photos'][0]??[];$updatedFile=$updated['createdFiles'][0]??'';
if(empty($updated['updated'])||!empty($updated['added'])||count($updated['photos'])!==1||($updatedPhoto['src']??'')===$stored||($updatedPhoto['sha256']??'')===($result['photos'][0]['sha256']??'')||!is_file($updatedFile)||($updated['removedFiles'][0]??null)!==$file)throw new RuntimeException('A changed image with the same filename must replace the existing server photo.');
@unlink($file);
if(is_file($file))throw new RuntimeException('Replaced server photo file was not cleaned up.');
$removed=CatalogPhotos::mutate($catalog,['article'=>'ART-1','operation'=>'remove','src'=>$updatedPhoto['src']],$storage);
if(empty($removed['removed'])||$removed['photos']!==[]||($removed['removedFiles'][0]??null)!==$updatedFile)throw new RuntimeException('A shared photo was not removed from the catalog.');
@unlink($updatedFile);
if(is_file($updatedFile))throw new RuntimeException('Removed server photo file was not cleaned up.');
$failed=false;
try{CatalogPhotos::mutate($catalog,['article'=>'MISSING','operation'=>'add','photo'=>['name'=>'x.png','src'=>$png]],$storage);}catch(InvalidArgumentException){$failed=true;}
if(!$failed)throw new RuntimeException('Unknown articles must be rejected.');
$failed=false;
try{CatalogPhotos::mutate($catalog,['article'=>'ART-1','operation'=>'add','photo'=>['name'=>'bad.png','src'=>'data:image/png;base64,not-an-image']],$storage);}catch(InvalidArgumentException){$failed=true;}
if(!$failed)throw new RuntimeException('Invalid image payloads must be rejected.');
$limited=['articles'=>['ART-2'=>['name'=>'Part','photos'=>[]]]];$created=[];
for($i=1;$i<=5;$i++){$item=CatalogPhotos::mutate($limited,['article'=>'ART-2','operation'=>'add','photo'=>['name'=>'photo-'.$i.'.png','src'=>$png]],$storage);$created=array_merge($created,$item['createdFiles']??[]);}
$failed=false;
try{CatalogPhotos::mutate($limited,['article'=>'ART-2','operation'=>'add','photo'=>['name'=>'photo-6.png','src'=>$png]],$storage);}catch(InvalidArgumentException){$failed=true;}
if(!$failed||count($limited['articles']['ART-2']['photos'])!==5)throw new RuntimeException('The five-photo limit must be enforced.');
$legacy=['articles'=>['ART-3'=>['name'=>'Old photo','photos'=>[['name'=>'old.png','src'=>$png]]]]];
$migrated=CatalogPhotos::migrateEmbedded($legacy,$storage);$migratedPhoto=$legacy['articles']['ART-3']['photos'][0]??[];
if(count($migrated)!==1||!is_file($migrated[0])||!str_contains((string)($migratedPhoto['src']??''),'action=product_photo'))throw new RuntimeException('Previously server-saved data URIs must migrate to server files.');
$created[]=$migrated[0];foreach(array_unique($created) as $path)if(is_file($path))@unlink($path);@rmdir($storage);
echo "PASS: server photo files, URL storage, validation, deduplication, removal, migration and limits.\n";
