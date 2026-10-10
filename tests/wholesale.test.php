<?php
declare(strict_types=1);
require __DIR__.'/../api/src/Wholesale.php';
function eq($a,$b,$m){if($a!==$b)throw new Exception($m.' '.json_encode([$a,$b]));}
function rejects($fn,$message){try{$fn();}catch(Throwable $e){eq($e->getMessage(),$message,'error');return;}throw new Exception('Expected '.$message);}
$s=['catalog'=>['articles'=>['A'=>['name'=>'Known','packQty'=>20,'unitWeightKg'=>0.15],'B'=>['name'=>'Unknown weight','packQty'=>10],'C'=>['name'=>'Unknown pack']]],'nodes'=>[['id'=>1,'name'=>'Dealer A'],['id'=>2,'name'=>'Dealer B']]];
$d=Wholesale::defaults();$v=Wholesale::view($d,$s,1);$p=['id'=>0,'clientKey'=>'test-request-000001','catalogRevision'=>$v['catalogRevision'],'lines'=>[['art'=>'A','packs'=>2],['art'=>'B','packs'=>1]],'comment'=>'Test'];
$r=Wholesale::mutate($d,$s,1,'wholesale_save',$p)['request'];eq($r['totals']['qty'],50,'qty');eq($r['totals']['knownWeightKg'],2.5,'weight');eq($r['totals']['unknownWeightLines'],0,'unknown');eq(count(Wholesale::view($d,$s,null)['requests']),0,'draft private');eq(count(Wholesale::view($d,$s,2)['requests']),0,'ownership');
Wholesale::mutate($d,$s,1,'wholesale_save',$p);eq(count($d['requests']),1,'idempotency');
foreach([0,-1,1.5,'2'] as $n)rejects(fn()=>Wholesale::lines([['art'=>'A','packs'=>$n]],$v['products']),'WS_MULTIPLE');
eq(Wholesale::lines([['art'=>'A','qty'=>37]],$v['products'])[0]['qty'],37,'nonmultiples allowed');eq(Wholesale::lines([['art'=>'C','qty'=>1]],$v['products'])[0]['qty'],1,'unknown pack allowed');rejects(fn()=>Wholesale::lines('bad',$v['products']),'WS_EMPTY');rejects(fn()=>Wholesale::lines([null],$v['products']),'WS_INPUT');rejects(fn()=>Wholesale::lines([['art'=>'A','packs'=>1],['art'=>'A','packs'=>1]],$v['products']),'WS_ARTICLE');
rejects(fn()=>Wholesale::mutate($d,$s,2,'wholesale_send',['id'=>1,'revision'=>1]),'Недостаточно прав.');rejects(fn()=>Wholesale::mutate($d,$s,1,'wholesale_send',['id'=>1,'revision'=>0]),'WS_STALE');
Wholesale::mutate($d,$s,1,'wholesale_favorite',['art'=>'B','favorite'=>true]);eq(Wholesale::view($d,$s,1)['catalogRevision'],$v['catalogRevision'],'favorite stable revision');
$r=Wholesale::mutate($d,$s,1,'wholesale_send',['id'=>1,'revision'=>1])['request'];eq($r['status'],'submitted','send');eq(count(Wholesale::view($d,$s,null)['requests']),1,'central receives');
rejects(fn()=>Wholesale::mutate($d,$s,1,'wholesale_status',['id'=>1,'revision'=>2,'status'=>'accepted']),'WS_STATE');
$r=Wholesale::mutate($d,$s,null,'wholesale_status',['id'=>1,'revision'=>2,'status'=>'accepted'])['request'];$r=Wholesale::mutate($d,$s,null,'wholesale_status',['id'=>1,'revision'=>3,'status'=>'shipped','shipmentRef'=>'TRUCK-1'])['request'];eq(count($r['history']),3,'history');eq($r['shipmentRef'],'TRUCK-1','shipment');
Wholesale::mutate($d,$s,null,'wholesale_logistics',['revision'=>0,'art'=>'A','packQty'=>30,'unitWeightKg'=>0.2,'source'=>'Supplier']);eq($d['requests'][0]['lines'][0]['packQty'],20,'snapshot immutable');
rejects(fn()=>Wholesale::mutate($d,$s,1,'wholesale_logistics',['revision'=>1,'art'=>'A','packQty'=>1]),'Недостаточно прав.');
echo "Wholesale service: quantity, weights, snapshots, ownership, lifecycle, idempotency, revisions passed.\n";

// Replies, return/correct/resubmit, and audit snapshots share ownership/revision rules.
$d=Wholesale::defaults();$v=Wholesale::view($d,$s,1);
$r=Wholesale::mutate($d,$s,1,'wholesale_save',$p)['request'];
rejects(fn()=>Wholesale::mutate($d,$s,null,'wholesale_message',['id'=>1,'revision'=>1,'text'=>'Private']),'WS_STATE');
$r=Wholesale::mutate($d,$s,1,'wholesale_send',['id'=>1,'revision'=>1])['request'];
rejects(fn()=>Wholesale::mutate($d,$s,2,'wholesale_message',['id'=>1,'revision'=>2,'text'=>'Other']),'Недостаточно прав.');
rejects(fn()=>Wholesale::mutate($d,$s,null,'wholesale_status',['id'=>1,'revision'=>2,'status'=>'returned']),'WS_MESSAGE_REQUIRED');
$r=Wholesale::mutate($d,$s,null,'wholesale_message',['id'=>1,'revision'=>2,'text'=>'No B available'])['request'];eq($r['messages'][0]['actor'],'central','supplier reply');
rejects(fn()=>Wholesale::mutate($d,$s,1,'wholesale_message',['id'=>1,'revision'=>2,'text'=>'Stale']),'WS_STALE');
$r=Wholesale::mutate($d,$s,1,'wholesale_message',['id'=>1,'revision'=>3,'text'=>'Please return'])['request'];eq($r['messages'][1]['actor'],1,'dealer reply');
$r=Wholesale::mutate($d,$s,null,'wholesale_status',['id'=>1,'revision'=>4,'status'=>'returned','supplierComment'=>'Remove B'])['request'];eq($r['status'],'returned','return');
$r=Wholesale::mutate($d,$s,1,'wholesale_save',array_merge($p,['id'=>1,'revision'=>5,'lines'=>[['art'=>'A','qty'=>37]]]))['request'];eq($r['status'],'returned','correction visible to supplier');eq(count($r['messages']),3,'messages preserved');eq($r['history'][2]['previousTotals']['qty'],50,'previous totals');eq(count($r['history'][2]['previousLines']),2,'previous items');eq($r['totals']['qty'],37,'corrected quantity');
$r=Wholesale::mutate($d,$s,1,'wholesale_send',['id'=>1,'revision'=>6])['request'];eq($r['status'],'submitted','resubmit');
$r=Wholesale::mutate($d,$s,null,'wholesale_status',['id'=>1,'revision'=>7,'status'=>'accepted'])['request'];
$r=Wholesale::mutate($d,$s,null,'wholesale_status',['id'=>1,'revision'=>8,'status'=>'returned','supplierComment'=>'Review again'])['request'];eq($r['status'],'returned','accepted may return');
$hidden=Wholesale::redactPrices(['request'=>$r],false);eq($hidden['request']['history'][2]['previousTotals']['amount'],null,'history prices redacted');
echo "Wholesale replies and correction lifecycle passed.\n";
