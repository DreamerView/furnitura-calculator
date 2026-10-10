<?php
declare(strict_types=1);

final class AccessService {
    public function __construct(private FuturussStore $store) {}
    public function load(): array { return $this->store->read(); }
    public function save(array $s): void { $this->store->write($s); }
    public function nodeById(array $s, ?int $id): ?array { if (!$id) return null; foreach ($s['nodes'] as $n) if ((int)$n['id']===$id) return $n; return null; }
    public function userById(array $s, ?int $id): ?array { if (!$id) return null; foreach ($s['users'] as $u) if ((int)$u['id']===$id) return $u; return null; }
    public function ancestors(array $s, int $nodeId): array {
        $out=[];$seen=[];$current=$this->nodeById($s,$nodeId);
        while($current && !isset($seen[$current['id']])){$seen[$current['id']]=1;$out[]=$current;$current=$this->nodeById($s,$current['parent_id']??null);} return $out;
    }
    public function isDescendant(array $s, int $candidateId, int $ancestorId): bool {
        if ($candidateId===$ancestorId) return true;
        foreach($this->ancestors($s,$candidateId) as $n) if ((int)$n['id']===$ancestorId) return true;
        return false;
    }
    private function canManageNode(array $actor,array $node): bool {
        $role=(string)($actor['role']??'public');$actorNode=(int)($actor['nodeId']??0);
        if($role==='central') return ($node['type']??'')==='dealer' && $node['parent_id']===null;
        if($role==='dealer') return (int)($node['parent_id']??0)===$actorNode;
        return false;
    }
    private function userForNode(array $s,int $nodeId): ?array { foreach($s['users'] as $u)if((int)($u['node_id']??0)===$nodeId)return $u;return null; }
    private function dealerLogin(array $s,int $nodeId): string { $u=$this->userForNode($s,$nodeId);return ($u&&($u['role']??'')==='dealer')?(string)($u['login']??''):''; }
    public function loginAvailable(array $s,string $login,?int $excludeUserId=null): bool {
        $login=trim($login); if(strlen($login)<3)return false;
        foreach($s['users'] as $u){if($excludeUserId!==null&&(int)($u['id']??0)===$excludeUserId)continue;if(strcasecmp((string)($u['login']??''),$login)===0)return false;}return true;
    }
    public function loginAvailableForNode(string $login,?int $excludeNodeId=null): array {
        $s=$this->load();$excludeUserId=null;if($excludeNodeId){$u=$this->userForNode($s,$excludeNodeId);$excludeUserId=$u?(int)$u['id']:null;}
        return ['login'=>trim($login),'available'=>$this->loginAvailable($s,$login,$excludeUserId),'minLength'=>3];
    }
    public function effectiveActive(array $s, int $nodeId): bool { foreach($this->ancestors($s,$nodeId) as $n) if (empty($n['active'])) return false; return true; }
    public function effectivePrice(array $s, int $nodeId): bool { foreach($this->ancestors($s,$nodeId) as $n) if (empty($n['active']) || empty($n['price_access'])) return false; return true; }
    public function current(array $s): array {
        $uid=$_SESSION['user_id']??null;$role=$_SESSION['role']??'public';$nodeId=$_SESSION['node_id']??null;
        if ($role==='public') return ['authenticated'=>false,'role'=>'public','nodeId'=>null,'canViewPrices'=>false];
        if ($role==='central') return ['authenticated'=>true,'role'=>'central','nodeId'=>null,'canViewPrices'=>true,'user'=>$this->safeUser($this->userById($s,(int)$uid))];
        if ($role==='dealer') {
            $node=$this->nodeById($s,(int)$nodeId); if(!$node||!$this->effectiveActive($s,(int)$nodeId)) return ['authenticated'=>false,'role'=>'public','nodeId'=>null,'canViewPrices'=>false];
            return ['authenticated'=>true,'role'=>'dealer','nodeId'=>(int)$nodeId,'canViewPrices'=>$this->effectivePrice($s,(int)$nodeId),'user'=>$this->safeUser($this->userById($s,(int)$uid)),'node'=>$this->safeNode($node,false)];
        }
        if ($role==='client') {
            $node=$this->nodeById($s,(int)$nodeId);$user=$this->userById($s,(int)$uid);
            if(!$node||!$user||empty($node['registered'])||!$this->effectiveActive($s,(int)$nodeId)) return ['authenticated'=>false,'role'=>'public','nodeId'=>null,'canViewPrices'=>false];
            return ['authenticated'=>true,'role'=>'client','nodeId'=>(int)$nodeId,'canViewPrices'=>$this->effectivePrice($s,(int)$nodeId),'user'=>$this->safeUser($user),'node'=>$this->safeNode($node,false)];
        }
        return ['authenticated'=>false,'role'=>'public','nodeId'=>null,'canViewPrices'=>false];
    }
    public function setupRequired(array $s): bool { foreach($s['users'] as $u) if(($u['role']??'')==='central') return false; return true; }
    public function createCentral(array $payload): array {
        $s=$this->load(); if(!$this->setupRequired($s)) throw new RuntimeException('Администратор Central уже создан.');
        $login=trim((string)($payload['login']??''));$password=(string)($payload['password']??'');
        if(strlen($login)<3) throw new InvalidArgumentException('Логин должен содержать минимум 3 символа.');
        if(!$this->loginAvailable($s,$login)) throw new RuntimeException('Такой логин уже используется.');
        if(strlen($password)<8) throw new InvalidArgumentException('Пароль должен содержать минимум 8 символов.');
        $u=['id'=>$s['nextUserId']++,'role'=>'central','node_id'=>null,'login'=>$login,'password_hash'=>password_hash($password,PASSWORD_DEFAULT),'active'=>true,'created_at'=>date(DATE_ATOM)];$s['users'][]=$u;$this->save($s);return $this->safeUser($u);
    }
    public function loginPassword(string $login,string $password): array {
        $s=$this->load(); foreach($s['users'] as $u){if(strcasecmp((string)($u['login']??''),$login)!==0)continue;if(empty($u['active'])||!password_verify($password,(string)$u['password_hash']))break;
            if(in_array(($u['role']??''),['dealer','client'],true) && !$this->effectiveActive($s,(int)$u['node_id'])) throw new RuntimeException('Доступ деактивирован.');
            if(($u['role']??'')==='client'){ $node=$this->nodeById($s,(int)$u['node_id']);if(!$node||empty($node['registered']))throw new RuntimeException('Регистрация Client не завершена.'); }
            $_SESSION['user_id']=$u['id'];$_SESSION['role']=$u['role'];$_SESSION['node_id']=$u['node_id'];if(!headers_sent()) session_regenerate_id(true);return $this->current($s);
        } throw new RuntimeException('Неверный логин или пароль.');
    }
    public function clientInvite(string $key): array {
        $s=$this->load();$key=trim($key);if($key==='')throw new RuntimeException('Введите секретный ключ.');
        foreach($s['nodes'] as $n){if(($n['type']??'')!=='client'||empty($n['secret_hash']))continue;if(password_verify($key,(string)$n['secret_hash'])){
            if(!$this->effectiveActive($s,(int)$n['id']))throw new RuntimeException('Client деактивирован или заблокирован вышестоящим уровнем.');
            return ['valid'=>true,'nodeId'=>(int)$n['id'],'name'=>(string)$n['name'],'registered'=>!empty($n['registered']),'canReceivePrices'=>$this->effectivePrice($s,(int)$n['id'])];
        }} throw new RuntimeException('Секретный ключ не найден.');
    }
    public function registerClient(array $payload): array {
        $key=(string)($payload['key']??'');$login=trim((string)($payload['login']??''));$password=(string)($payload['password']??'');
        if(strlen($login)<3)throw new InvalidArgumentException('Логин минимум 3 символа.');if(strlen($password)<8)throw new InvalidArgumentException('Пароль минимум 8 символов.');
        $invite=$this->clientInvite($key);$s=$this->load();$nodeId=(int)$invite['nodeId'];
        $idx=null;foreach($s['nodes'] as $i=>$n)if((int)$n['id']===$nodeId){$idx=$i;break;}if($idx===null)throw new RuntimeException('Client не найден.');
        if(!empty($s['nodes'][$idx]['registered'])||$this->userForNode($s,$nodeId))throw new RuntimeException('Этот Client уже зарегистрирован. Войдите по логину и паролю.');
        if(!$this->loginAvailable($s,$login))throw new RuntimeException('Такой логин уже используется.');
        $u=['id'=>$s['nextUserId']++,'role'=>'client','node_id'=>$nodeId,'login'=>$login,'password_hash'=>password_hash($password,PASSWORD_DEFAULT),'active'=>true,'created_at'=>date(DATE_ATOM)];
        $s['users'][]=$u;$s['nodes'][$idx]['registered']=true;$s['nodes'][$idx]['registered_at']=date(DATE_ATOM);$s['nodes'][$idx]['updated_at']=date(DATE_ATOM);$this->save($s);
        $_SESSION['user_id']=$u['id'];$_SESSION['role']='client';$_SESSION['node_id']=$nodeId;if(!headers_sent())session_regenerate_id(true);return $this->current($s);
    }
    public function createNode(array $actor,array $payload): array {
        $s=$this->load();$type=(string)($payload['type']??'');$name=trim((string)($payload['name']??''));
        if(!in_array($type,['dealer','client'],true))throw new InvalidArgumentException('Неизвестный тип пользователя.');if($name==='')throw new InvalidArgumentException('Укажите название.');
        $role=(string)($actor['role']??'public');$actorNode=(int)($actor['nodeId']??0);$parentId=null;
        if($role==='central'){if($type!=='dealer')throw new RuntimeException('Central может создавать только Dealer.');}
        elseif($role==='dealer'){$owner=$this->nodeById($s,$actorNode);if(!$owner||($owner['type']??'')!=='dealer')throw new RuntimeException('Дилерский узел не найден.');$parentId=$actorNode;}
        else throw new RuntimeException('Создавать пользователей могут только Central и Dealer/Subdealer.');
        $node=['id'=>$s['nextNodeId']++,'type'=>$type,'parent_id'=>$parentId,'name'=>$name,'active'=>array_key_exists('active',$payload)?(bool)$payload['active']:true,'price_access'=>array_key_exists('price_access',$payload)?(bool)$payload['price_access']:false,'contact_name'=>(string)($payload['contact_name']??''),'phone'=>(string)($payload['phone']??''),'email'=>(string)($payload['email']??''),'public_info'=>(string)($payload['public_info']??''),'secret_hash'=>null,'secret_hint'=>null,'registered'=>$type==='dealer','created_at'=>date(DATE_ATOM),'updated_at'=>date(DATE_ATOM)];
        $secret=null;
        if($type==='dealer'){
            $login=trim((string)($payload['login']??''));$password=(string)($payload['password']??'');if(strlen($login)<3||strlen($password)<8)throw new InvalidArgumentException('Для Dealer/Subdealer нужны логин от 3 символов и пароль от 8 символов.');if(!$this->loginAvailable($s,$login))throw new RuntimeException('Такой логин уже используется.');
            $s['nodes'][]=$node;$s['users'][]=['id'=>$s['nextUserId']++,'role'=>'dealer','node_id'=>$node['id'],'login'=>$login,'password_hash'=>password_hash($password,PASSWORD_DEFAULT),'active'=>true,'created_at'=>date(DATE_ATOM)];
        } else {$secret=$this->newSecret();$node['secret_hash']=password_hash($secret,PASSWORD_DEFAULT);$node['secret_hint']=substr($secret,-4);$s['nodes'][]=$node;}
        $this->save($s);return ['node'=>$this->safeNode($node,false),'secretKey'=>$secret];
    }
    public function updateNode(array $actor,int $id,array $payload): array {
        $s=$this->load();$idx=null;foreach($s['nodes'] as $i=>$n)if((int)$n['id']===$id){$idx=$i;break;}if($idx===null)throw new RuntimeException('Пользователь не найден.');$node=$s['nodes'][$idx];if(!$this->canManageNode($actor,$node))throw new RuntimeException('Можно изменять только непосредственных пользователей своей ветки.');
        foreach(['name','contact_name','phone','email','public_info'] as $k)if(array_key_exists($k,$payload))$node[$k]=(string)$payload[$k];foreach(['active','price_access'] as $k)if(array_key_exists($k,$payload))$node[$k]=(bool)$payload[$k];$node['updated_at']=date(DATE_ATOM);$s['nodes'][$idx]=$node;
        if(($node['type']??'')==='dealer'){
            foreach($s['users'] as &$u)if((int)($u['node_id']??0)===$id){if(isset($payload['login'])){$login=trim((string)$payload['login']);if(strlen($login)<3)throw new InvalidArgumentException('Логин минимум 3 символа.');if(!$this->loginAvailable($s,$login,(int)$u['id']))throw new RuntimeException('Такой логин уже используется.');$u['login']=$login;}if(isset($payload['password'])&&(string)$payload['password']!==''){if(strlen((string)$payload['password'])<8)throw new InvalidArgumentException('Пароль минимум 8 символов.');$u['password_hash']=password_hash((string)$payload['password'],PASSWORD_DEFAULT);}if(array_key_exists('active',$payload))$u['active']=(bool)$payload['active'];break;}unset($u);
        }
        $this->save($s);$out=$this->safeNode($node,false);if(($node['type']??'')==='dealer')$out['login']=$this->dealerLogin($s,$id);return $out;
    }
    public function deleteNode(array $actor,int $id): int {
        $s=$this->load();$node=$this->nodeById($s,$id);if(!$node)throw new RuntimeException('Пользователь не найден.');if(!$this->canManageNode($actor,$node))throw new RuntimeException('Можно удалять только непосредственных пользователей своей ветки.');
        $ids=[];foreach($s['nodes'] as $candidate)if($this->isDescendant($s,(int)$candidate['id'],$id))$ids[]=(int)$candidate['id'];$set=array_fill_keys($ids,true);$s['nodes']=array_values(array_filter($s['nodes'],fn($n)=>!isset($set[(int)$n['id']])));$s['users']=array_values(array_filter($s['users'],fn($u)=>empty($u['node_id'])||!isset($set[(int)$u['node_id']])));$this->save($s);return count($ids);
    }
    public function rotateSecret(array $actor,int $id): string {
        $s=$this->load();$idx=null;foreach($s['nodes'] as $i=>$n)if((int)$n['id']===$id){$idx=$i;break;}if($idx===null||($s['nodes'][$idx]['type']??'')!=='client')throw new RuntimeException('Client не найден.');if(($actor['role']??'')!=='dealer'||(int)($s['nodes'][$idx]['parent_id']??0)!==(int)($actor['nodeId']??0))throw new RuntimeException('Ключ может перевыпустить только непосредственный Dealer/Subdealer этого Client.');
        $secret=$this->newSecret();$s['nodes'][$idx]['secret_hash']=password_hash($secret,PASSWORD_DEFAULT);$s['nodes'][$idx]['secret_hint']=substr($secret,-4);$s['nodes'][$idx]['registered']=false;$s['nodes'][$idx]['registered_at']=null;$s['nodes'][$idx]['updated_at']=date(DATE_ATOM);$s['users']=array_values(array_filter($s['users'],fn($u)=>(int)($u['node_id']??0)!==$id));$this->save($s);return $secret;
    }
    public function hierarchy(array $actor): array {
        $s=$this->load();$nodes=[];$role=(string)($actor['role']??'public');$actorNode=(int)($actor['nodeId']??0);
        foreach($s['nodes'] as $n){$include=false;$redact=false;if($role==='central'){$include=true;$redact=($n['type']??'')==='client';}elseif($role==='dealer'){$include=$this->isDescendant($s,(int)$n['id'],$actorNode);}if(!$include)continue;$safe=$this->safeNode($n,$redact);$safe['effective_active']=$this->effectiveActive($s,(int)$n['id']);$safe['effective_price_access']=$this->effectivePrice($s,(int)$n['id']);if(($n['type']??'')==='dealer'&&$this->canManageNode($actor,$n))$safe['login']=$this->dealerLogin($s,(int)$n['id']);$nodes[]=$safe;}return $nodes;
    }
    public function safeNode(array $n,bool $redact): array { $out=$n;unset($out['secret_hash'],$out['pricing']);if($redact){unset($out['contact_name'],$out['phone'],$out['email'],$out['public_info'],$out['secret_hint']);$out['redacted']=true;}return $out; }
    private function safeUser(?array $u): ?array { if(!$u)return null;unset($u['password_hash']);return $u; }
    private function newSecret(): string { $hex=strtoupper(bin2hex(random_bytes(8)));return 'FTR-'.implode('-',str_split($hex,4)); }
}
