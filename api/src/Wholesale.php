<?php
declare(strict_types=1);

/** Wholesale orders are separate from calculation, catalog prices and client invoices. */
final class Wholesale {
    public static function authorize(array $actor,array $state,AccessService $access): ?int {
        if(empty($actor['authenticated']))throw new RuntimeException('Требуется авторизация.');
        if(($actor['role']??'')==='central')return null;
        $id=(int)($actor['nodeId']??0);$node=$access->nodeById($state,$id);
        if(($actor['role']??'')!=='dealer'||!$node||$node['parent_id']!==null||!$access->effectiveActive($state,$id))throw new RuntimeException('Недостаточно прав.');
        return $id;
    }
    public static function defaults(): array {return ['nextId'=>1,'requests'=>[],'favorites'=>[],'logistics'=>[],'logisticsRevision'=>0];}
    public static function transact(string $path,callable $fn): array {
        $lock=fopen($path.'.lock','c');if(!$lock||!flock($lock,LOCK_EX))throw new RuntimeException('WS_STORAGE');
        $tmp=null;
        try{
            $raw=is_file($path)?file_get_contents($path):null;
            $data=$raw===null?self::defaults():json_decode($raw,true,512,JSON_THROW_ON_ERROR);
            if(!is_array($data))throw new RuntimeException('WS_STORAGE');
            $before=$data;$result=$fn($data);
            if($data!==$before){$tmp=$path.'.'.bin2hex(random_bytes(6)).'.tmp';$json=json_encode($data,JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES|JSON_THROW_ON_ERROR);if(file_put_contents($tmp,$json)===false||!rename($tmp,$path))throw new RuntimeException('WS_STORAGE');$tmp=null;}
            return $result;
        }finally{if($tmp&&is_file($tmp))unlink($tmp);flock($lock,LOCK_UN);fclose($lock);}
    }
    public static function products(array $state,array $data,?int $dealer): array {
        $favorites=$data['favorites'][(string)$dealer]??[];$used=[];
        foreach($data['requests'] as $r)if($dealer!==null&&(int)$r['dealerId']===$dealer&&!in_array($r['status'],['draft','cancelled','rejected'],true))foreach($r['lines'] as $l)$used[$l['art']]=($used[$l['art']]??0)+$l['qty'];
        $rows=[];
        foreach(($state['catalog']['articles']??[]) as $art=>$a){if(($a['available']??true)===false)continue;$meta=$data['logistics'][$art]??[];
            $rows[]=['art'=>(string)$art,'name'=>$a['name'],'group'=>$a['group']??'','packQty'=>$meta['packQty']??$a['packQty']??null,'price'=>$a['price']??null,'section'=>$a['section']??'','variants'=>$a['variants']??[],'unitWeightKg'=>array_key_exists('unitWeightKg',$meta)?$meta['unitWeightKg']:0.05,'source'=>$meta['source']??$a['logisticsSource']??'','favorite'=>in_array((string)$art,$favorites,true),'usedQty'=>$used[$art]??0,'isNew'=>!isset($used[$art])&&!in_array((string)$art,$favorites,true)];
        }
        usort($rows,static fn($a,$b)=>($b['favorite']<=>$a['favorite'])?:($b['usedQty']<=>$a['usedQty'])?:strcmp($a['art'],$b['art']));return $rows;
    }
    public static function revision(array $rows): string {usort($rows,fn($a,$b)=>strcmp($a['art'],$b['art']));return hash('sha256',json_encode(array_map(fn($r)=>[$r['art'],$r['packQty'],$r['unitWeightKg'],$r['price']??null],$rows)));}
    public static function view(array $data,array $state,?int $dealer): array {
        $requests=[];foreach($data['requests'] as $r)if($dealer===null?($r['status']!=='draft'):(int)$r['dealerId']===$dealer)$requests[]=$r;
        usort($requests,fn($a,$b)=>$b['id']<=>$a['id']);$rows=self::products($state,$data,$dealer);
        return ['ok'=>true,'products'=>$rows,'requests'=>$requests,'logisticsRevision'=>$data['logisticsRevision'],'catalogRevision'=>self::revision($rows)];
    }
    public static function lines(mixed $input,array $rows): array {
        if(!is_array($input)||!$input||count($input)>2000)throw new InvalidArgumentException('WS_EMPTY');$map=array_column($rows,null,'art');$seen=[];$out=[];
        foreach($input as $line){if(!is_array($line))throw new InvalidArgumentException('WS_INPUT');$art=$line['art']??null;$packs=$line['packs']??null;
            if(!is_string($art)||!isset($map[$art])||isset($seen[$art]))throw new InvalidArgumentException('WS_ARTICLE');$seen[$art]=true;$r=$map[$art];
            $qty=$line['qty']??(is_int($packs)?$packs*$r['packQty']:null);
            if(!is_int($qty)||$qty<1||$qty>1000000000)throw new InvalidArgumentException('WS_MULTIPLE');
            $packs=$r['packQty']?$qty/$r['packQty']:null;
            $weight=$r['unitWeightKg'];$out[]=['art'=>$art,'name'=>$r['name'],'section'=>$r['section']??'','group'=>$r['group']??'','packs'=>$packs,'packQty'=>$r['packQty'],'qty'=>$qty,'unitWeightKg'=>$weight,'weightKg'=>$weight===null?null:round($qty*$weight,6),'source'=>$r['source'],'price'=>$r['price']??null,'amount'=>isset($r['price'])?round($qty*$r['price'],2):null];
        }return $out;
    }
    public static function summary(array $lines): array {return ['amount'=>round(array_sum(array_column($lines,'amount')),2),'unknownPriceLines'=>count(array_filter($lines,fn($l)=>!isset($l['price']))),'items'=>count($lines),'packs'=>array_sum(array_column($lines,'packs')),'qty'=>array_sum(array_column($lines,'qty')),'knownWeightKg'=>round(array_sum(array_column($lines,'weightKg')),6),'unknownWeightLines'=>count(array_filter($lines,fn($l)=>$l['weightKg']===null))];}
    public static function redactPrices(array $result,bool $can): array {
        $result['canViewPrices']=$can;if($can)return $result;
        $walk=function(array &$value)use(&$walk){foreach($value as $key=>&$v){if(in_array($key,['price','amount'],true))$v=null;elseif(is_array($v))$walk($v);}unset($v);};$walk($result);return $result;
    }
    private static function text(mixed $value,int $limit=1000): string {if(!is_string($value)||strlen($value)>$limit)throw new InvalidArgumentException('WS_INPUT');return trim($value);}
    public static function mutate(array &$data,array $state,?int $dealer,string $action,array $p): array {
        $rows=self::products($state,$data,$dealer);
        if($action==='wholesale_favorite'){
            if($dealer===null)throw new RuntimeException('Недостаточно прав.');$art=$p['art']??null;
            if(!is_string($art)||!array_key_exists($art,$state['catalog']['articles']??[])||!is_bool($p['favorite']??null))throw new InvalidArgumentException('WS_INPUT');
            $items=$data['favorites'][(string)$dealer]??[];$items=array_values(array_diff($items,[$art]));if($p['favorite'])$items[]=$art;$data['favorites'][(string)$dealer]=$items;return ['ok'=>true];
        }
        if($action==='wholesale_logistics'){
            if($dealer!==null)throw new RuntimeException('Недостаточно прав.');if(($p['revision']??null)!==$data['logisticsRevision'])throw new InvalidArgumentException('WS_STALE');
            $art=$p['art']??null;$pack=$p['packQty']??null;$weight=$p['unitWeightKg']??null;
            if(!is_string($art)||!isset($state['catalog']['articles'][$art])||!is_int($pack)||$pack<1||$pack>1000000||($weight!==null&&(!is_numeric($weight)||!is_finite((float)$weight)||$weight<=0||$weight>10000)))throw new InvalidArgumentException('WS_INPUT');
            $data['logistics'][$art]=['packQty'=>$pack,'unitWeightKg'=>$weight===null?null:(float)$weight,'source'=>self::text($p['source']??'',500),'updatedAt'=>gmdate('c')];$data['logisticsRevision']++;return ['ok'=>true];
        }
        $id=$p['id']??0;if(!is_int($id)||$id<0)throw new InvalidArgumentException('WS_INPUT');$index=null;
        foreach($data['requests'] as $i=>$r)if($r['id']===$id){$index=$i;break;}
        if($action==='wholesale_save'){
            if($dealer===null)throw new RuntimeException('Недостаточно прав.');
            if(!$id){$key=self::text($p['clientKey']??'',100);if(!preg_match('/^[a-zA-Z0-9-]{16,100}$/D',$key))throw new InvalidArgumentException('WS_INPUT');foreach($data['requests'] as $r)if($r['dealerId']===$dealer&&$r['clientKey']===$key)return ['ok'=>true,'request'=>$r];}
            if($id&&$index===null)throw new RuntimeException('Недостаточно прав.');
            if($index!==null){$old=$data['requests'][$index];if($old['dealerId']!==$dealer)throw new RuntimeException('Недостаточно прав.');if(!in_array($old['status'],['draft','returned'],true))throw new InvalidArgumentException('WS_STATE');if(($p['revision']??null)!==$old['revision'])throw new InvalidArgumentException('WS_STALE');}
            if(($p['catalogRevision']??null)!==self::revision($rows))throw new InvalidArgumentException('WS_CATALOG_CHANGED');
            $lines=self::lines($p['lines']??[],$rows);$name='';foreach($state['nodes'] as $node)if($node['id']===$dealer)$name=$node['name'];
            $r=['id'=>$id?:$data['nextId']++,'clientKey'=>$index===null?$key:$old['clientKey'],'dealerId'=>$dealer,'dealerName'=>$name,'status'=>$index===null?'draft':$old['status'],'revision'=>$index===null?1:$old['revision']+1,'createdAt'=>$index===null?gmdate('c'):$old['createdAt'],'updatedAt'=>gmdate('c'),'comment'=>self::text($p['comment']??''),'lines'=>$lines,'totals'=>self::summary($lines),'catalogRevision'=>self::revision($rows),'history'=>$index===null?[]:$old['history'],'shipmentRef'=>$old['shipmentRef']??'','supplierComment'=>$old['supplierComment']??'','messages'=>$old['messages']??[]];
            if($index!==null&&$old['status']==='returned'&&($old['lines']!==$lines||$old['comment']!==$r['comment']))$r['history'][]=['from'=>'returned','to'=>'returned','event'=>'edited','actor'=>$dealer,'at'=>gmdate('c'),'previousLines'=>$old['lines'],'previousTotals'=>$old['totals'],'comment'=>$old['comment']];
            if($index===null)$data['requests'][]=$r;else $data['requests'][$index]=$r;return ['ok'=>true,'request'=>$r];
        }
        if($index===null)throw new RuntimeException('Недостаточно прав.');$r=$data['requests'][$index];
        if($dealer!==null&&$r['dealerId']!==$dealer)throw new RuntimeException('Недостаточно прав.');
        if(($p['revision']??null)!==$r['revision'])throw new InvalidArgumentException('WS_STALE');
        if($action==='wholesale_message'){
            if($r['status']==='draft')throw new InvalidArgumentException('WS_STATE');
            $text=self::text($p['text']??'');if($text==='')throw new InvalidArgumentException('WS_MESSAGE_REQUIRED');
            $r['messages'][]=['actor'=>$dealer===null?'central':$dealer,'at'=>gmdate('c'),'text'=>$text];
            $r['updatedAt']=gmdate('c');$r['revision']++;$data['requests'][$index]=$r;return ['ok'=>true,'request'=>$r];
        }
        if($action==='wholesale_send'){
            if($dealer===null)throw new RuntimeException('Недостаточно прав.');if(!in_array($r['status'],['draft','returned'],true))throw new InvalidArgumentException('WS_STATE');
            if($r['catalogRevision']!==self::revision($rows))throw new InvalidArgumentException('WS_CATALOG_CHANGED');
            self::lines($r['lines'],$rows);$status='submitted';
        }elseif($action==='wholesale_status'){
            $status=$p['status']??'';
            $allowed=$dealer===null?['submitted'=>['accepted','rejected','returned'],'accepted'=>['shipped','rejected','returned']]:['draft'=>['cancelled'],'submitted'=>['cancelled'],'returned'=>['cancelled']];
            if(!in_array($status,$allowed[$r['status']]??[],true))throw new InvalidArgumentException('WS_STATE');
            if($dealer===null){$r['supplierComment']=self::text($p['supplierComment']??'');$r['shipmentRef']=self::text($p['shipmentRef']??'',150);if($status==='returned'&&$r['supplierComment']==='')throw new InvalidArgumentException('WS_MESSAGE_REQUIRED');if($r['supplierComment']!=='')$r['messages'][]=['actor'=>'central','at'=>gmdate('c'),'text'=>$r['supplierComment']];}
        }else throw new InvalidArgumentException('WS_INPUT');
        $r['history'][]=['from'=>$r['status'],'to'=>$status,'actor'=>$dealer===null?'central':$dealer,'at'=>gmdate('c'),'comment'=>$dealer===null?$r['supplierComment']:''];$r['status']=$status;$r['updatedAt']=gmdate('c');$r['revision']++;$data['requests'][$index]=$r;return ['ok'=>true,'request'=>$r];
    }
}
