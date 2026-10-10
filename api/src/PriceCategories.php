<?php
declare(strict_types=1);
final class PriceCategories {
 public static function owner(array $actor): string {
  if(empty($actor['authenticated']))throw new RuntimeException('Требуется авторизация.');
  if(!in_array($actor['role'],['central','dealer'],true)||empty($actor['canViewPrices']))throw new RuntimeException('Недостаточно прав.');
  return $actor['role']==='central'?'central':(string)$actor['nodeId'];
 }
 public static function book(array $s,string $owner): array {
  if(isset($s['priceBooks'][$owner]))return $s['priceBooks'][$owner];
  $prices=[];foreach($s['nodes']??[] as $n)if((string)$n['id']===$owner)foreach($n['pricing']['articles']??[] as $art=>$rule)if(isset($rule['price']))foreach(['A','B','C','D','E'] as $c)$prices[$art][$c]=$rule['price'];
  return ['categories'=>['A','B','C','D','E'],'prices'=>$prices,'revision'=>0];
 }
 /** Incoming supplier prices only. A dealer's own outgoing prices never change its purchases. */
 public static function source(array $s,AccessService $access,?int $id): ?array {
  $cat=$s['catalog']??null;if(!is_array($cat))return null;
  foreach($cat['articles'] as &$r)$r['available']=$r['available']??true;unset($r);
  $owner='central';$parent=null;
  foreach($id?array_reverse($access->ancestors($s,$id)):[] as $node){
   $book=self::book($s,$owner);$assigned=$s['priceAssignments'][(string)$node['id']]??null;
   foreach($cat['articles'] as $art=>&$r){
    $legacy=$parent['pricing']['articles'][$art]??[];
    $r['available']=$r['available']&&($legacy['enabled']??true);
    $price=$assigned!==null?($book['prices'][$art][$assigned]??null):($legacy['price']??null);
    if($price!==null)$r['price']=$price;
    if(!$r['available'])$r['price']=0;
   }unset($r);
   $parent=$node;$owner=(string)$node['id'];
  }
  if($id)$cat['pricingApplied']=true;return $cat;
 }
 public static function editor(array $s,AccessService $access,array $actor): array {
  $owner=self::owner($actor);$book=self::book($s,$owner);$source=self::source($s,$access,$owner==='central'?null:(int)$owner);$rows=[];
  foreach($source['articles']??[] as $art=>$r)$rows[]=['art'=>(string)$art,'name'=>$r['name'],'group'=>$r['group']??'','sourcePrice'=>$r['price']??null,'sourceAvailable'=>$r['available']??true,'prices'=>$book['prices'][$art]??[]];
  return ['ok'=>true,'categories'=>$book['categories'],'revision'=>$book['revision'],'sourceRevision'=>hash('sha256',json_encode($source)),'rows'=>$rows];
 }
 public static function save(array &$s,AccessService $access,array $actor,array $p): array {
  $owner=self::owner($actor);$e=self::editor($s,$access,$actor);
  if(($p['revision']??null)!==$e['revision']||($p['sourceRevision']??null)!==$e['sourceRevision'])throw new InvalidArgumentException('PL_STALE');
  $cats=$p['categories']??null;$prices=$p['prices']??null;
  if(!is_array($cats)||!array_is_list($cats)||count($cats)<1||count($cats)>12||!is_array($prices))throw new InvalidArgumentException('PL_INPUT');
  foreach($cats as $c)if(!is_string($c)||!preg_match('/^[A-Za-z0-9А-Яа-яЁё _-]{1,24}$/uD',$c))throw new InvalidArgumentException('PL_INPUT');
  if(count(array_unique($cats))!==count($cats))throw new InvalidArgumentException('PL_INPUT');
  foreach($s['nodes'] as $node){$parent=$node['parent_id']===null?'central':(string)$node['parent_id'];if($parent===$owner&&isset($s['priceAssignments'][(string)$node['id']])&&!in_array($s['priceAssignments'][(string)$node['id']],$cats,true))throw new InvalidArgumentException('PL_ASSIGNED');}
  $clean=[];
  foreach($prices as $art=>$values){if(!isset($s['catalog']['articles'][$art])||!is_array($values))throw new InvalidArgumentException('PL_INPUT');foreach($values as $c=>$price){if(!in_array((string)$c,$cats,true)||($price!==null&&(!is_int($price)&&!is_float($price)||!is_finite((float)$price)||$price<0||$price>1000000000)))throw new InvalidArgumentException('PL_INPUT');if($price!==null)$clean[$art][$c]=round($price,2);}}
  $s['priceBooks'][$owner]=['categories'=>$cats,'prices'=>$clean,'revision'=>$e['revision']+1,'updatedAt'=>gmdate('c')];return self::editor($s,$access,$actor);
 }
 public static function change(array &$s,AccessService $access,array $actor,array $p): array {
  $owner=self::owner($actor);$e=self::editor($s,$access,$actor);
  if(($p['revision']??null)!==$e['revision']||($p['sourceRevision']??null)!==$e['sourceRevision'])throw new InvalidArgumentException('PL_STALE');
  $book=self::book($s,$owner);$old=$p['category']??null;$mode=$p['mode']??null;
  if(!is_string($old)||!in_array($old,$book['categories'],true)||!in_array($mode,['rename','delete'],true))throw new InvalidArgumentException('PL_INPUT');
  $next=$p['replacement']??null;
  if($mode==='rename'){
   if(!is_string($next)||!preg_match('/^[A-Za-z0-9А-Яа-яЁё _-]{1,24}$/uD',$next)||trim($next)!==$next||in_array($next,$book['categories'],true))throw new InvalidArgumentException('PL_INPUT');
   $book['categories']=array_map(fn($c)=>$c===$old?$next:$c,$book['categories']);
  }else{
   if(count($book['categories'])<2||!array_key_exists('replacement',$p)||($next!==null&&($next===$old||!in_array($next,$book['categories'],true))))throw new InvalidArgumentException('PL_INPUT');
   $book['categories']=array_values(array_filter($book['categories'],fn($c)=>$c!==$old));
  }
  foreach($book['prices'] as &$prices){if($mode==='rename'&&array_key_exists($old,$prices))$prices[$next]=$prices[$old];unset($prices[$old]);}unset($prices);
  foreach($s['nodes'] as $node){$parent=$node['parent_id']===null?'central':(string)$node['parent_id'];$id=(string)$node['id'];if($parent===$owner&&($s['priceAssignments'][$id]??null)===$old){if($next===null)unset($s['priceAssignments'][$id]);else $s['priceAssignments'][$id]=$next;}}
  $book['revision']=$e['revision']+1;$book['updatedAt']=gmdate('c');$s['priceBooks'][$owner]=$book;
  return self::editor($s,$access,$actor);
 }
 public static function assign(array &$s,AccessService $access,array $actor,array $p): void {
  $owner=self::owner($actor);$id=$p['id']??null;$node=is_int($id)?$access->nodeById($s,$id):null;
  if(!$node||($owner==='central'?($node['type']!=='dealer'||$node['parent_id']!==null):(int)$node['parent_id']!==(int)$owner))throw new RuntimeException('Недостаточно прав.');
  $old=$s['priceAssignments'][(string)$id]??null;if(($p['previous']??null)!==$old)throw new InvalidArgumentException('PL_STALE');
  $category=$p['category']??null;if($category!==null&&!in_array($category,self::book($s,$owner)['categories'],true))throw new InvalidArgumentException('PL_INPUT');
  if($category===null)unset($s['priceAssignments'][(string)$id]);else $s['priceAssignments'][(string)$id]=$category;
 }
}
