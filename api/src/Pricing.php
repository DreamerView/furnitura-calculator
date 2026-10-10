<?php
declare(strict_types=1);

/** A node owns only its outgoing policy. The Central catalog stays immutable. */
final class Pricing {
    public static function catalog(array $state, AccessService $access, ?int $nodeId): ?array {
        if (!empty($state['priceBooks']) || !empty($state['priceAssignments'])) return PriceCategories::source($state,$access,$nodeId);
        $catalog=$state['catalog']??null;
        if (!is_array($catalog)) return null;
        $chain=$nodeId ? array_reverse($access->ancestors($state,$nodeId)) : [];
        foreach ($catalog['articles'] as $art=>&$record) {
            $record['available']=true;
            foreach ($chain as $node) {
                if (($node['type']??'')!=='dealer') continue;
                $rule=$node['pricing']['articles'][$art]??[];
                $record['available']=$record['available'] && ($rule['enabled']??true);
                if (isset($rule['price'])) $record['price']=$rule['price'];
            }
            // An excluded upstream article must not leak its price downstream.
            if (!$record['available']) $record['price']=0;
        }
        unset($record);
        if ($nodeId) $catalog['pricingApplied']=true;
        return $catalog;
    }
    public static function editor(array $state, AccessService $access, int $nodeId): array {
        $node=$access->nodeById($state,$nodeId);
        if (!$node || $node['type']!=='dealer') throw new RuntimeException('Недостаточно прав.');
        $parent=isset($node['parent_id']) ? (int)$node['parent_id'] : null;
        $source=self::catalog($state,$access,$parent);
        $parentNode=$parent ? $access->nodeById($state,$parent) : null;
        $rows=[];
        foreach (($source['articles']??[]) as $art=>$record) {
            $rule=$node['pricing']['articles'][$art]??[];
            $rows[]=['art'=>(string)$art,'name'=>$record['name'],'group'=>$record['group']??'',
                'sourcePrice'=>$record['price']??0,'sourceAvailable'=>$record['available'],
                'enabled'=>$rule['enabled']??true,'price'=>$rule['price']??null];
        }
        return ['available'=>$source!==null,'sourceName'=>$parentNode['name']??'Istina / Central',
            'sourceRevision'=>hash('sha256',json_encode($source)), 'revision'=>$node['pricing']['revision']??0,'catalogRevision'=>$state['catalogUpdatedAt']??null,
            'rows'=>$rows];
    }
    public static function save(array &$state, AccessService $access, int $nodeId, array $payload): void {
        $editor=self::editor($state,$access,$nodeId);
        if (!$editor['available']) throw new InvalidArgumentException('Данные ещё не загружены.');
        if (($payload['revision']??null)!==$editor['revision'] || ($payload['catalogRevision']??null)!==$editor['catalogRevision'] || ($payload['sourceRevision']??null)!==$editor['sourceRevision'])
            throw new InvalidArgumentException('Цены изменились. Обновите страницу и повторите изменения.');
        $input=$payload['articles']??null;
        if (!is_array($input)) throw new InvalidArgumentException('Некорректная ценовая политика.');
        $rules=[];
        foreach ($input as $art=>$rule) {
            if (!array_key_exists($art,$state['catalog']['articles']) || !is_array($rule) || !is_bool($rule['enabled']??null))
                throw new InvalidArgumentException('Некорректная ценовая политика.');
            $price=$rule['price']??null;
            if ($price!==null && ((!is_int($price)&&!is_float($price)) || !is_finite((float)$price) || $price<0 || $price>1000000000))
                throw new InvalidArgumentException('Введите корректную цену от 0 до 1000000000.');
            if (!$rule['enabled'] || $price!==null) $rules[$art]=['enabled'=>$rule['enabled'],'price'=>$price];
        }
        foreach ($state['nodes'] as &$node) if ((int)$node['id']===$nodeId) {
            $node['pricing']=['articles'=>$rules,'revision'=>$editor['revision']+1,'updatedAt'=>gmdate('c')];break;
        }
        unset($node);
    }
}
