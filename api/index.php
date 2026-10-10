<?php
declare(strict_types=1);
header('Content-Type: application/json; charset=utf-8');
session_name('FUTURUSSSID');session_set_cookie_params(['httponly'=>true,'samesite'=>'Strict','secure'=>!empty($_SERVER['HTTPS'])]);session_start();
require __DIR__.'/src/TurnClampsCatalog.php';require __DIR__.'/src/DornmassCatalog.php';require __DIR__.'/src/AluminumAssemblies.php';require __DIR__.'/src/CatalogExpansion.php';require __DIR__.'/src/CommonComposition.php';require __DIR__.'/src/TiltFirstWorkbook.php';require __DIR__.'/src/TiltFirstCatalog.php';require __DIR__.'/src/StulpCatalog.php';require __DIR__.'/src/StulpDetails.php';require __DIR__.'/src/StulpRanges.php';require __DIR__.'/src/StulpNodes.php';require __DIR__.'/src/StulpPresentation.php';require __DIR__.'/src/SlidingCatalog.php';require __DIR__.'/src/MushroomTurn.php';require __DIR__.'/src/CatalogSchemes.php';require __DIR__.'/src/KitRanges.php';require __DIR__.'/src/StrikeSelection.php';require __DIR__.'/src/Store.php';require __DIR__.'/src/Access.php';require __DIR__.'/src/CatalogPhotos.php';require __DIR__.'/src/AdvertisingMedia.php';require __DIR__.'/src/Pricing.php';require __DIR__.'/src/PriceCategories.php';require __DIR__.'/src/Wholesale.php';
$store=new FuturussStore(dirname(__DIR__).'/storage/state.json');$svc=new AccessService($store);
function input(): array { $raw=file_get_contents('php://input');$d=json_decode($raw?:'{}',true);return is_array($d)?$d:[]; }
function out(array $d,int $code=200): never { http_response_code($code);echo json_encode($d,JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES);exit; }
function requireAuth(array $a,array $roles=[]): void { if(empty($a['authenticated']))throw new RuntimeException('Требуется авторизация.');if($roles&&!in_array($a['role'],$roles,true))throw new RuntimeException('Недостаточно прав.'); }
function csrf(): string { if(empty($_SESSION['csrf']))$_SESSION['csrf']=bin2hex(random_bytes(24));return $_SESSION['csrf']; }
function requireCsrf(): void { $got=$_SERVER['HTTP_X_CSRF_TOKEN']??'';if(!hash_equals((string)($_SESSION['csrf']??''),(string)$got))throw new RuntimeException('CSRF token invalid.'); }
try{
 // Serialize state mutations across users, including category assignment and catalog edits.
 $stateLock=fopen(dirname(__DIR__).'/storage/state-api.lock','c');if(!$stateLock||!flock($stateLock,LOCK_EX))throw new RuntimeException('Storage unavailable');
 $action=$_GET['action']??'health';$s=$svc->load();if(StrikeSelection::upgrade($s,dirname(__DIR__).'/storage'))$svc->save($s);if(KitRanges::upgrade($s,dirname(__DIR__).'/storage'))$svc->save($s);if(CatalogSchemes::upgrade($s,dirname(__DIR__).'/storage'))$svc->save($s);if(MushroomTurn::upgrade($s,dirname(__DIR__).'/storage'))$svc->save($s);if(SlidingCatalog::upgrade($s,dirname(__DIR__).'/storage'))$svc->save($s);if(StulpCatalog::upgrade($s,dirname(__DIR__).'/storage'))$svc->save($s);if(TiltFirstCatalog::upgrade($s,dirname(__DIR__).'/storage'))$svc->save($s);if(TiltFirstWorkbook::upgrade($s,dirname(__DIR__).'/storage'))$svc->save($s);if(CommonComposition::upgrade($s,dirname(__DIR__).'/storage'))$svc->save($s);if(CatalogExpansion::upgrade($s,dirname(__DIR__).'/storage'))$svc->save($s);if(AluminumAssemblies::upgrade($s,dirname(__DIR__).'/storage'))$svc->save($s);if(DornmassCatalog::upgrade($s,dirname(__DIR__).'/storage'))$svc->save($s);if(TurnClampsCatalog::upgrade($s,dirname(__DIR__).'/storage'))$svc->save($s);if(StulpDetails::upgrade($s,dirname(__DIR__).'/storage'))$svc->save($s);if(StulpRanges::upgrade($s,dirname(__DIR__).'/storage'))$svc->save($s);if(StulpNodes::upgrade($s,dirname(__DIR__).'/storage'))$svc->save($s);if(StulpPresentation::upgrade($s,dirname(__DIR__).'/storage'))$svc->save($s);$a=$svc->current($s);$setupRequired=$svc->setupRequired($s);
 if($action==='advertising_media'){
  $id=(string)($_GET['id']??'');if(!preg_match('/^[a-f0-9]{48}$/D',$id))out(['error'=>'Файл не найден.'],404);
  foreach(AdvertisingMedia::TYPES as $mime=>$ext){$file=dirname(__DIR__).'/storage/advertising-media/'.$id.'.'.$ext;if(!is_file($file))continue;header_remove('Content-Type');header('Content-Type: '.$mime);header('Content-Length: '.filesize($file));header('Cache-Control: public, max-age=31536000, immutable');header('X-Content-Type-Options: nosniff');readfile($file);exit;}out(['error'=>'Файл не найден.'],404);
 }
 if($action==='product_photo'){
  $id=(string)($_GET['id']??'');if(!preg_match('/^[a-f0-9]{48}$/i',$id))out(['error'=>'Фото не найдено.'],404);$id=strtolower($id);
  $photoDirectory=dirname(__DIR__).'/storage/product-photos';$types=['jpg'=>'image/jpeg','png'=>'image/png','webp'=>'image/webp'];
  foreach($types as $extension=>$mime){$file=$photoDirectory.'/'.$id.'.'.$extension;if(!is_file($file))continue;header_remove('Content-Type');header('Content-Type: '.$mime);header('Content-Length: '.(string)filesize($file));header('Cache-Control: public, max-age=31536000, immutable');header('X-Content-Type-Options: nosniff');readfile($file);exit;}
  out(['error'=>'Фото не найдено.'],404);
 }
 if($setupRequired&&!in_array($action,['health','auth_status','setup_admin','login_available','app_settings'],true))out(['error'=>'Сначала создайте администратора Istina / Central.','setupRequired'=>true],428);
 if($action==='health')out(['ok'=>true,'version'=>trim((string)file_get_contents(dirname(__DIR__).'/VERSION'))]);
 if($action==='app_settings'){out(['ok'=>true,'theme'=>(string)($s['settings']['theme']??'default')]);}
 if($action==='app_settings_update'){requireAuth($a,['central']);requireCsrf();$p=input();$theme=(string)($p['theme']??'default');$allowed=['default','soft','easy','glossy','material'];if(!in_array($theme,$allowed,true))throw new InvalidArgumentException('Неизвестный стиль интерфейса.');$s=$svc->load();$s['settings']['theme']=$theme;$svc->save($s);out(['ok'=>true,'theme'=>$theme]);}
 if($action==='auth_status')out(array_merge(['ok'=>true,'setupRequired'=>$svc->setupRequired($s),'csrf'=>$a['authenticated']?csrf():null],$a));
 if($action==='login_available'){ $login=(string)($_GET['login']??'');$exclude=(int)($_GET['exclude_node_id']??0);out(['ok'=>true]+$svc->loginAvailableForNode($login,$exclude?:null)); }
 if($action==='setup_admin'){if($_SERVER['REQUEST_METHOD']!=='POST')out(['error'=>'POST required'],405);$u=$svc->createCentral(input());$_SESSION['user_id']=$u['id'];$_SESSION['role']='central';$_SESSION['node_id']=null;out(['ok'=>true,'user'=>$u,'csrf'=>csrf()]);}
 if($action==='login'){if($_SERVER['REQUEST_METHOD']!=='POST')out(['error'=>'POST required'],405);$p=input();$r=$svc->loginPassword(trim((string)($p['login']??'')),(string)($p['password']??''));out(array_merge(['ok'=>true,'csrf'=>csrf()],$r));}
 if($action==='client_invite'){if($_SERVER['REQUEST_METHOD']!=='POST')out(['error'=>'POST required'],405);$p=input();out(['ok'=>true]+$svc->clientInvite((string)($p['key']??'')));}
 if($action==='client_register'){if($_SERVER['REQUEST_METHOD']!=='POST')out(['error'=>'POST required'],405);$r=$svc->registerClient(input());out(array_merge(['ok'=>true,'csrf'=>csrf()],$r));}
 if($action==='login_key'){if($_SERVER['REQUEST_METHOD']!=='POST')out(['error'=>'POST required'],405);$p=input();$invite=$svc->clientInvite((string)($p['key']??''));out(['ok'=>true,'requiresRegistration'=>true]+$invite);}
 if($action==='logout'){if($_SERVER['REQUEST_METHOD']!=='POST')out(['error'=>'POST required'],405);if(!empty($a['authenticated']))requireCsrf();$_SESSION=[];if(ini_get('session.use_cookies')){$params=session_get_cookie_params();setcookie(session_name(),'',time()-42000,$params['path'],$params['domain'],$params['secure'],$params['httponly']);}session_destroy();out(['ok'=>true]);}
  if($action==='catalog'){$catalog=$s['catalog']??null;if(!$catalog)out(['ok'=>true,'available'=>false,'data'=>null,'canViewPrices'=>false,'updatedAt'=>null]);$can=!empty($a['canViewPrices']);$copy=Pricing::catalog($s,$svc,!empty($a['authenticated'])&&!empty($a['nodeId'])?(int)$a['nodeId']:null);$copy=Wholesale::withPackNorms($copy,dirname(__DIR__).'/storage/wholesale.json');if(!$can&&isset($copy['articles'])&&is_array($copy['articles']))foreach($copy['articles'] as &$article){if(is_array($article))$article['price']=0;}unset($article);out(['ok'=>true,'available'=>true,'data'=>$copy,'canViewPrices'=>$can,'updatedAt'=>$s['catalogUpdatedAt']??null]);}
 if(in_array($action,['wholesale','wholesale_save','wholesale_send','wholesale_status','wholesale_message','wholesale_favorite','wholesale_logistics'],true)){
  $dealer=Wholesale::authorize($a,$s,$svc);$p=[];
  if($action!=='wholesale'){if($_SERVER['REQUEST_METHOD']!=='POST')out(['error'=>'POST required'],405);requireCsrf();$p=input();}
  $s['catalog']=PriceCategories::source($s,$svc,$dealer);
  $result=Wholesale::transact(dirname(__DIR__).'/storage/wholesale.json',static function(array &$data)use($action,$s,$dealer,$p){return $action==='wholesale'?Wholesale::view($data,$s,$dealer):Wholesale::mutate($data,$s,$dealer,$action,$p);});$result=Wholesale::redactPrices($result,!empty($a['canViewPrices']));out($result);
 }
 if(in_array($action,['price_categories','price_categories_save','price_category_assign','price_category_change'],true)){
  PriceCategories::owner($a);
  if($action!=='price_categories'){if($_SERVER['REQUEST_METHOD']!=='POST')out(['error'=>'POST required'],405);requireCsrf();$p=input();
   if($action==='price_category_change')$result=PriceCategories::change($s,$svc,$a,$p);elseif($action==='price_categories_save')$result=PriceCategories::save($s,$svc,$a,$p);else{PriceCategories::assign($s,$svc,$a,$p);$result=['ok'=>true];}$svc->save($s);out($result);
  }out(PriceCategories::editor($s,$svc,$a));
 }
 if($action==='pricing_editor'||$action==='pricing_save'){
  requireAuth($a,['dealer']);if(empty($a['canViewPrices']))throw new RuntimeException('Недостаточно прав.');
  $nodeId=(int)$a['nodeId'];
  if($action==='pricing_save'){if($_SERVER['REQUEST_METHOD']!=='POST')out(['error'=>'POST required'],405);requireCsrf();$p=input();$s=$svc->load();Pricing::save($s,$svc,$nodeId,$p);$svc->save($s);}
  out(['ok'=>true]+Pricing::editor($s,$svc,$nodeId));
 }
 if($action==='catalog_editor'){
  requireAuth($a,['central']);$catalog=$s['catalog']??null;$isSeed=false;
  if(!$catalog){$seedPath=dirname(__DIR__).'/storage/default-catalog.json';$raw=@file_get_contents($seedPath);$catalog=json_decode((string)$raw,true);if(!is_array($catalog))throw new RuntimeException('Не удалось загрузить исходный каталог.');$isSeed=true;}
  out(['ok'=>true,'available'=>true,'data'=>Wholesale::withPackNorms($catalog,dirname(__DIR__).'/storage/wholesale.json'),'isSeed'=>$isSeed,'updatedAt'=>$s['catalogUpdatedAt']??null]);
 }
 if($action==='catalog_save'){
  requireAuth($a,['central']);requireCsrf();$p=input();$cat=$p['catalog']??null;
  if(!is_array($cat)||($cat['schemaVersion']??null)!==2||($cat['format']??null)!=='futuruss-matrix'||!is_array($cat['articles']??null)||!is_array($cat['kits']??null)||!count($cat['kits']))throw new InvalidArgumentException('Ожидается актуальный контракт futuruss-matrix v2: schemaVersion, format, articles и kits.');
  foreach($cat['articles'] as $article=>$record)if(!is_string($article)||$article===''||!is_array($record)||!is_string($record['name']??null)||(($record['price']??null)!==null&&(!is_numeric($record['price'])||$record['price']<0)))throw new InvalidArgumentException('Некорректная карточка артикула: '.(string)$article);
  $validateItems=static function($items,string $label)use($cat):void{if(!is_array($items))throw new InvalidArgumentException($label.': неверный список деталей.');foreach($items as $item){if(!is_array($item)||!is_string($item['art']??null)||!is_int($item['qty']??null)||$item['qty']<1||!is_string($item['role']??null))throw new InvalidArgumentException($label.': некорректная строка состава.');if($item['art']!==''&&!array_key_exists($item['art'],$cat['articles']))throw new InvalidArgumentException($label.': отсутствует артикул '.$item['art'].'.');}};
  $kitIds=[];foreach($cat['kits'] as $kit){if(!is_array($kit)||!is_string($kit['id']??null)||$kit['id']===''||isset($kitIds[$kit['id']])||!is_string($kit['variant']??null)||$kit['variant']===''||!is_string($kit['name']??null)||!is_array($kit['rows']??null)||!is_array($kit['columns']??null)||!is_array($kit['common']??null)||!is_array($kit['cells']??null))throw new InvalidArgumentException('Некорректная комплектация: нужны уникальные id, variant, name, rows, columns, common и cells.');$kitIds[$kit['id']]=true;$validateItems($kit['common'],$kit['name']);StulpDetails::validate($kit,$validateItems);
   foreach(['rows','columns'] as $axis){$rangeIds=[];foreach($kit[$axis] as $range){if(!is_array($range)||!is_string($range['id']??null)||$range['id']===''||isset($rangeIds[$range['id']])||!is_int($range['from']??null)||!is_int($range['to']??null)||$range['from']<1||$range['to']<$range['from'])throw new InvalidArgumentException($kit['name'].': некорректный диапазон размеров.');$rangeIds[$range['id']]=true;if($axis==='rows'){if(!is_array($range['drives']??null))throw new InvalidArgumentException($kit['name'].': неверный список приводов.');foreach($range['drives'] as $drive)if(!is_string($drive)||($drive!==''&&!array_key_exists($drive,$cat['articles'])))throw new InvalidArgumentException($kit['name'].': артикул привода отсутствует в базе.');}}}
   foreach($kit['cells'] as $cellKey=>$cell){if(!is_array($cell))throw new InvalidArgumentException($kit['name'].': некорректный состав ячейки.');$validateItems($cell['items']??null,$kit['name']);TiltFirstWorkbook::validateCell($cell,$kit,(string)$cellKey,$validateItems);}
  }
  $ads=$cat['advertisingImages']??($cat['advertisingImage']??[]);if(!is_array($ads))$ads=[$ads];foreach($ads as $image)if(!is_string($image)||!preg_match('~^data:image/(?:png|jpeg|webp);base64,~i',$image))throw new InvalidArgumentException('Рекламные изображения должны быть data URI PNG, JPEG или WebP.');
  $photoStorage=dirname(__DIR__).'/storage/product-photos';$s=$svc->load();$previousCatalog=is_array($s['catalog']??null)?$s['catalog']:[];CatalogPhotos::useServerPhotos($cat,$previousCatalog);$createdPhotoFiles=CatalogPhotos::migrateEmbedded($cat,$photoStorage);
  $adStorage=dirname(__DIR__).'/storage/advertising-media';try{$createdAdFiles=AdvertisingMedia::normalize($cat,$previousCatalog,$adStorage);}catch(Throwable $adError){foreach($createdPhotoFiles as $file)if(is_file($file))@unlink($file);throw $adError;}$obsoleteAdFiles=array_diff(AdvertisingMedia::files($previousCatalog,$adStorage),AdvertisingMedia::files($cat,$adStorage));
  $obsoletePhotoFiles=CatalogPhotos::obsoleteFiles($previousCatalog,$cat,$photoStorage);$s['catalog']=$cat;$s['catalogUpdatedAt']=date(DATE_ATOM);
  try{$svc->save($s);}catch(Throwable $saveError){foreach(array_merge($createdPhotoFiles,$createdAdFiles) as $file)if(is_file($file))@unlink($file);throw $saveError;}
  foreach(array_merge($obsoletePhotoFiles,$obsoleteAdFiles) as $file)if(is_file($file))@unlink($file);
  out(['ok'=>true,'articles'=>count($cat['articles']),'kits'=>count($cat['kits']),'updatedAt'=>$s['catalogUpdatedAt'],'advertisingMedia'=>$cat['advertisingMedia']??[]]);
 }
 if($action==='catalog_photo_mutate'){
  requireAuth($a,['central']);requireCsrf();$p=input();$s=$svc->load();$catalog=$s['catalog']??null;
  if(!$catalog){$raw=@file_get_contents(dirname(__DIR__).'/storage/default-catalog.json');$catalog=json_decode((string)$raw,true);if(!is_array($catalog))throw new RuntimeException('Не удалось загрузить исходный каталог.');}
  if(!is_array($catalog['articles']??null))throw new RuntimeException('В общем каталоге нет базы артикулов.');
  $photoStorage=dirname(__DIR__).'/storage/product-photos';$result=CatalogPhotos::mutate($catalog,$p,$photoStorage);$createdPhotoFiles=$result['createdFiles']??[];$removedPhotoFiles=$result['removedFiles']??[];unset($result['createdFiles'],$result['removedFiles']);
  $article=(string)($p['article']??'');$result['photos']=$catalog['articles'][$article]['photos']??($result['photos']??[]);$s['catalog']=$catalog;$s['catalogUpdatedAt']=date(DATE_ATOM);
  try{$svc->save($s);}catch(Throwable $saveError){foreach(array_merge($createdPhotoFiles,$createdAdFiles) as $file)if(is_file($file))@unlink($file);throw $saveError;}
  foreach($removedPhotoFiles as $file)if(is_file($file))@unlink($file);
  out(['ok'=>true]+$result+['updatedAt'=>$s['catalogUpdatedAt']]);
 }
 if($action==='hierarchy'){requireAuth($a,['central','dealer']);$nodes=$svc->hierarchy($a);foreach($nodes as &$node)if(empty($node['redacted']))$node['priceCategory']=$s['priceAssignments'][(string)$node['id']]??null;unset($node);out(['ok'=>true,'nodes'=>$nodes,'actor'=>$a,'priceCategories'=>!empty($a['canViewPrices'])?PriceCategories::book($s,$a['role']==='central'?'central':(string)$a['nodeId'])['categories']:[]]);}
 if($action==='node_create'){requireAuth($a,['central','dealer']);requireCsrf();$r=$svc->createNode($a,input());out(['ok'=>true]+$r);}
 if($action==='node_update'){requireAuth($a,['central','dealer']);requireCsrf();$p=input();out(['ok'=>true,'node'=>$svc->updateNode($a,(int)($p['id']??0),$p)]);}
 if($action==='node_delete'){requireAuth($a,['central','dealer']);requireCsrf();$p=input();out(['ok'=>true,'deleted'=>$svc->deleteNode($a,(int)($p['id']??0))]);}
 if($action==='secret_rotate'){requireAuth($a,['dealer']);requireCsrf();$p=input();out(['ok'=>true,'secretKey'=>$svc->rotateSecret($a,(int)($p['id']??0))]);}
 out(['error'=>'Unknown action'],404);
}catch(InvalidArgumentException $e){out(['error'=>$e->getMessage()],422);}catch(RuntimeException $e){$msg=$e->getMessage();$code=(str_starts_with($msg,'Не удалось создать серверную папку фото.')||str_starts_with($msg,'Не удалось записать фото на сервер.'))?500:(str_contains($msg,'авторизац')?401:(str_contains($msg,'прав')||str_contains($msg,'Central')||str_contains($msg,'ветки')?403:400));out(['error'=>$msg],$code);}catch(Throwable $e){out(['error'=>'Internal server error'],500);}
