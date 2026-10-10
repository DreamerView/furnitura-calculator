<?php
require __DIR__.'/../api/src/FrameProfiles.php';
$catalog=FrameProfiles::withDefaults(['articles'=>[],'kits'=>[]]);
FrameProfiles::validate($catalog['frameProfiles']);
if(count($catalog['frameProfiles'])!==24)throw new Exception('defaults');
if(FrameProfiles::withDefaults(['frameProfiles'=>[]])['frameProfiles']!==[])throw new Exception('deleted rows restored');
foreach([null,-1,1001,'100'] as $bad){$rows=$catalog['frameProfiles'];$rows[0]['widthDeduction']=$bad;try{FrameProfiles::validate($rows);throw new Exception('accepted invalid value');}catch(InvalidArgumentException $expected){}}
$rows=$catalog['frameProfiles'];$rows[0]['source']='javascript:alert(1)';try{FrameProfiles::validate($rows);throw new Exception('unsafe source');}catch(InvalidArgumentException $expected){}
echo "PASS frame profile server validation\n";

$old=['frameProfiles'=>[['id'=>'rehau-blitz-1555009','name'=>'Custom','widthDeduction'=>105,'heightDeduction'=>107,'enabled'=>true,'source'=>'','note'=>'Manual']]];
$upgraded=FrameProfiles::withDefaults($old);
if(count($upgraded['frameProfiles'])!==13||$upgraded['frameProfiles'][0]['widthDeduction']!==105)throw new Exception('migration overwrote manual value');
if(FrameProfiles::withDefaults($upgraded)!==$upgraded)throw new Exception('migration not idempotent');
$upgraded['frameProfiles']=array_slice($upgraded['frameProfiles'],0,1);
if(count(FrameProfiles::withDefaults($upgraded)['frameProfiles'])!==1)throw new Exception('deleted additions restored');
echo "PASS append-only migration, custom values and deleted groups\n";
