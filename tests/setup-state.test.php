<?php
declare(strict_types=1);
require __DIR__ . '/../api/src/Store.php';
require __DIR__ . '/../api/src/Access.php';

$path = sys_get_temp_dir() . '/futuruss-setup-' . bin2hex(random_bytes(6)) . '.json';
$store = new FuturussStore($path);
$svc = new AccessService($store);
$checks = 0;
function ok(bool $condition, string $message): void {
    global $checks;
    $checks++;
    if (!$condition) { fwrite(STDERR, "not ok $checks - $message\n"); exit(1); }
    echo "ok $checks - $message\n";
}
try {
    ok($svc->setupRequired($svc->load()), 'Fresh install requires Central administrator');
    $admin = $svc->createCentral(['login'=>'admin','password'=>'password123']);
    ok(($admin['role'] ?? '') === 'central', 'First account is Central');
    ok(!$svc->setupRequired($svc->load()), 'Setup gate is removed after Central creation');
    try { $svc->createCentral(['login'=>'second','password'=>'password123']); ok(false, 'Second Central setup must be rejected'); }
    catch (RuntimeException $e) { ok(str_contains($e->getMessage(), 'уже создан'), 'Setup cannot be repeated'); }
    echo "PASS $checks checks\n";
} finally {
    @unlink($path);
    @unlink($path . '.tmp');
}
