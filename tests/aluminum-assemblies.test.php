<?php
require __DIR__.'/../api/src/AluminumAssemblies.php';
function aluCheck($yes){if(!$yes)throw new RuntimeException('ALU migration assertion failed');}
$root=dirname(__DIR__);$tmp=$root.'/storage/test-alu-'.bin2hex(random_bytes(4));mkdir($tmp);
try{
 foreach(['default-catalog.json','aluminum-assemblies-previous.json'] as $f)copy($root.'/storage/'.$f,$tmp.'/'.$f);
 $seed=json_decode(file_get_contents($tmp.'/default-catalog.json'),true);$old=json_decode(file_get_contents($tmp.'/aluminum-assemblies-previous.json'),true);
 $seed['kits']=array_merge(array_values(array_filter($seed['kits'],fn($k)=>($k['family']??'')!=='aluminum')),array_values($old['kits']));unset($seed['aluminumAssembliesVersion']);
 $seed['articles']['XPO.1200-1']['price']=345;$seed['articles']['XPO.1200-1']['packQty']=17;
 $s=['catalog'=>$seed,'users'=>[['id'=>42]],'priceBooks'=>['untouched']];file_put_contents($tmp.'/state.json',json_encode($s));$before=$s;
 aluCheck(AluminumAssemblies::upgrade($s,$tmp));aluCheck(count(glob($tmp.'/state-before-aluminum-assemblies-*.json'))===1);
 aluCheck(count(array_filter($s['catalog']['kits'],fn($k)=>($k['family']??'')==='aluminum'))===18);
 aluCheck($s['users']===$before['users']&&$s['priceBooks']===$before['priceBooks']);aluCheck($s['catalog']['articles']['XPO.1200-1']===$before['catalog']['articles']['XPO.1200-1']);
 $once=$s;aluCheck(!AluminumAssemblies::upgrade($s,$tmp)&&$once===$s);
 $custom=$before;foreach($custom['catalog']['kits'] as &$k)if($k['id']==='alu-tilt-security'){$k['note']='Manual changes';$k['common'][]=['art'=>'RN','qty'=>9,'role'=>'manual'];$saved=$k;}unset($k);
 AluminumAssemblies::upgrade($custom,$tmp);foreach($custom['catalog']['kits'] as $k)if($k['id']===$saved['id'])aluCheck($k===$saved);
 aluCheck(in_array('catalog-update-alu-tilt-security',array_column($custom['catalog']['kits'],'id'),true));
 echo "ALU migration: backup, repeatability, custom BOMs, accounts and prices preserved.\n";
}finally{foreach(glob($tmp.'/*') as $f)unlink($f);rmdir($tmp);}
