<?php
declare(strict_types=1);
session_start();
require __DIR__.'/../api/src/Store.php';
require __DIR__.'/../api/src/Access.php';
$tmp=sys_get_temp_dir().'/futuruss-test-'.bin2hex(random_bytes(4)).'.json';
$svc=new AccessService(new FuturussStore($tmp));
$checks=0;
function ok(bool $cond,string $msg): void { global $checks; if(!$cond){fwrite(STDERR,"FAIL: $msg\n");@unlink($GLOBALS['tmp']);exit(1);} $checks++; echo "ok $checks - $msg\n"; }
function fails(callable $fn): bool { try{$fn();return false;}catch(RuntimeException|InvalidArgumentException $e){return true;} }

$admin=$svc->createCentral(['login'=>'central','password'=>'central123']);
ok($admin['role']==='central','Central admin created');
$central=['authenticated'=>true,'role'=>'central','nodeId'=>null];

$d1=$svc->createNode($central,['type'=>'dealer','parent_id'=>999,'name'=>'Dealer A','login'=>'dealerA','password'=>'dealerA123','active'=>true,'price_access'=>true])['node'];
ok($d1['parent_id']===null,'Central always creates root Dealer and parent_id is ignored');
ok(fails(fn()=>$svc->createNode($central,['type'=>'client','name'=>'Wrong client'])),'Central cannot create Client');

$dealerA=['authenticated'=>true,'role'=>'dealer','nodeId'=>$d1['id']];
$d2=$svc->createNode($dealerA,['type'=>'dealer','parent_id'=>999,'name'=>'Subdealer B','login'=>'dealerB','password'=>'dealerB123','active'=>true,'price_access'=>true])['node'];
ok((int)$d2['parent_id']===(int)$d1['id'],'Dealer creates Subdealer directly under itself');
$cAres=$svc->createNode($dealerA,['type'=>'client','name'=>'Client A','contact_name'=>'Private A','phone'=>'+77000000001','email'=>'a@example.test','public_info'=>'private','active'=>true,'price_access'=>true]);
$cA=$cAres['node'];
ok((int)$cA['parent_id']===(int)$d1['id'] && str_starts_with((string)$cAres['secretKey'],'FTR-'),'Dealer creates direct Client with secret key');

$dealerB=['authenticated'=>true,'role'=>'dealer','nodeId'=>$d2['id']];
$d3=$svc->createNode($dealerB,['type'=>'dealer','name'=>'Subdealer C','login'=>'dealerC','password'=>'dealerC123','active'=>true,'price_access'=>true])['node'];
ok((int)$d3['parent_id']===(int)$d2['id'],'Subdealer creates deeper Subdealer under itself');
$cBres=$svc->createNode($dealerB,['type'=>'client','name'=>'Client B','phone'=>'+77000000002','active'=>true,'price_access'=>true]);
$cB=$cBres['node'];
ok((int)$cB['parent_id']===(int)$d2['id'],'Subdealer creates Client under itself');

$clientActor=['authenticated'=>true,'role'=>'client','nodeId'=>$cB['id']];
ok(fails(fn()=>$svc->createNode($clientActor,['type'=>'client','name'=>'No child'])),'Client cannot create child users');
ok(fails(fn()=>$svc->updateNode($clientActor,(int)$cB['id'],['price_access'=>false])),'Client cannot manage hierarchy permissions');

ok(fails(fn()=>$svc->updateNode($dealerA,(int)$d3['id'],['active'=>false])),'Dealer cannot directly edit grandchild of Subdealer');
$svc->updateNode($dealerA,(int)$d2['id'],['active'=>false]);
$s=$svc->load();
ok($svc->effectiveActive($s,(int)$d3['id'])===false && $svc->effectiveActive($s,(int)$cB['id'])===false,'Disabling direct Subdealer blocks its whole descendant branch');
$svc->updateNode($dealerA,(int)$d2['id'],['active'=>true]);

$tree=$svc->hierarchy($central);$centralClient=null;foreach($tree as $n)if((int)$n['id']===(int)$cA['id'])$centralClient=$n;
ok($centralClient!==null && !array_key_exists('phone',$centralClient) && !array_key_exists('email',$centralClient) && !array_key_exists('public_info',$centralClient),'Central receives redacted Client data');

$s=$svc->load();ok($svc->effectivePrice($s,(int)$cB['id'])===true,'Price permission inherits through allowed dealer chain');
$svc->updateNode($central,(int)$d1['id'],['price_access'=>false]);$s=$svc->load();
ok($svc->effectivePrice($s,(int)$cB['id'])===false,'Central price denial on root Dealer blocks descendants');
$svc->updateNode($central,(int)$d1['id'],['price_access'=>true]);

$_SESSION=[];$invite=$svc->clientInvite((string)$cBres['secretKey']);ok($invite['valid']===true && $invite['registered']===false,'Secret key validates invitation but does not authenticate Client');
$beforeRegistration=$svc->current($svc->load());ok($beforeRegistration['authenticated']===false,'Secret key alone does not create a Client session');
$clientSession=$svc->registerClient(['key'=>$cBres['secretKey'],'login'=>'clientB','password'=>'clientB123']);ok($clientSession['role']==='client' && $clientSession['authenticated']===true,'Client creates login/password before access is opened');
$_SESSION=[];$clientPasswordSession=$svc->loginPassword('clientB','clientB123');ok($clientPasswordSession['role']==='client','Activated Client signs in with login and password');
$clientTree=$svc->hierarchy(['authenticated'=>true,'role'=>'client','nodeId'=>$cB['id']]);ok(count($clientTree)===0,'Client has no management hierarchy');

$newKey=$svc->rotateSecret($dealerB,(int)$cB['id']);ok(str_starts_with($newKey,'FTR-'),'Immediate Subdealer can rotate direct Client key');
$_SESSION=[];ok(fails(fn()=>$svc->loginPassword('clientB','clientB123')),'Rotating Client key revokes previous Client credentials until reactivation');
ok(fails(fn()=>$svc->rotateSecret($dealerA,(int)$cB['id'])),'Higher Dealer cannot rotate grandchild Client key directly');


$tree=$svc->hierarchy($central);$editableDealer=null;foreach($tree as $n)if((int)$n['id']===(int)$d1['id'])$editableDealer=$n;
ok(($editableDealer['login']??'')==='dealerA','Manageable Dealer hierarchy includes login for edit modal');
$svc->updateNode($central,(int)$d1['id'],['login'=>'dealerA2','password'=>'dealerA456']);
$_SESSION=[];$editedLogin=$svc->loginPassword('dealerA2','dealerA456');ok($editedLogin['role']==='dealer','Dealer login and password can be edited');
ok(fails(fn()=>$svc->updateNode($central,(int)$d1['id'],['login'=>'dealerB'])),'Dealer edit rejects duplicate login');
$available=$svc->loginAvailableForNode('newUniqueLogin');ok($available['available']===true,'Global login availability reports free login');
$taken=$svc->loginAvailableForNode('DEALERB');ok($taken['available']===false,'Global login uniqueness is case-insensitive');
$selfEdit=$svc->loginAvailableForNode('dealerA2',(int)$d1['id']);ok($selfEdit['available']===true,'Edit availability excludes current account');
$_SESSION=[];
$deleteBranch=$svc->createNode($dealerA,['type'=>'dealer','name'=>'Delete Branch','login'=>'deleteBranch','password'=>'deleteBranch123','active'=>true,'price_access'=>true])['node'];
$deleteActor=['authenticated'=>true,'role'=>'dealer','nodeId'=>$deleteBranch['id']];
$deleteChild=$svc->createNode($deleteActor,['type'=>'dealer','name'=>'Delete Child','login'=>'deleteChild','password'=>'deleteChild123','active'=>true,'price_access'=>true])['node'];
$deleteClient=$svc->createNode($deleteActor,['type'=>'client','name'=>'Delete Client','active'=>true,'price_access'=>false])['node'];
ok(fails(fn()=>$svc->deleteNode($dealerB,(int)$deleteBranch['id'])),'Unrelated Subdealer cannot delete another branch');
$deleted=$svc->deleteNode($dealerA,(int)$deleteBranch['id']);ok($deleted===3,'Deleting Subdealer cascades through its complete child branch');
$afterDelete=$svc->load();ok($svc->nodeById($afterDelete,(int)$deleteBranch['id'])===null&&$svc->nodeById($afterDelete,(int)$deleteChild['id'])===null&&$svc->nodeById($afterDelete,(int)$deleteClient['id'])===null,'Deleted branch nodes are removed');
$s=$svc->load();ok($s['catalog']===null,'Fresh project has no embedded catalog/database');
@unlink($tmp);echo "PASS $checks checks\n";
