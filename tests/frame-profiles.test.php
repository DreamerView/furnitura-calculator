<?php
require __DIR__.'/../api/src/FrameProfiles.php';
$catalog=FrameProfiles::withDefaults(['articles'=>[],'kits'=>[]]);
FrameProfiles::validate($catalog['frameProfiles']);
if(count($catalog['frameProfiles'])!==12)throw new Exception('defaults');
if(FrameProfiles::withDefaults(['frameProfiles'=>[]])['frameProfiles']!==[])throw new Exception('deleted rows restored');
foreach([null,-1,1001,'100'] as $bad){$rows=$catalog['frameProfiles'];$rows[0]['widthDeduction']=$bad;try{FrameProfiles::validate($rows);throw new Exception('accepted invalid value');}catch(InvalidArgumentException $expected){}}
$rows=$catalog['frameProfiles'];$rows[0]['source']='javascript:alert(1)';try{FrameProfiles::validate($rows);throw new Exception('unsafe source');}catch(InvalidArgumentException $expected){}
echo "PASS frame profile server validation\n";
