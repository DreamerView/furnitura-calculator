<?php
declare(strict_types=1);

final class FuturussStore {
    private string $path;
    public function __construct(string $path) { $this->path = $path; }
    public function read(): array {
        if (!is_file($this->path)) return $this->defaults();
        $raw = @file_get_contents($this->path);$data = json_decode((string)$raw, true);
        return is_array($data) ? array_replace_recursive($this->defaults(), $data) : $this->defaults();
    }
    public function write(array $data): void {
        $dir = dirname($this->path);if (!is_dir($dir)) @mkdir($dir, 0775, true);$tmp = $this->path . '.tmp';
        $json = json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
        if ($json === false || @file_put_contents($tmp, $json, LOCK_EX) === false) throw new RuntimeException('Не удалось сохранить серверные данные.');
        if (!@rename($tmp, $this->path)) { @unlink($tmp); throw new RuntimeException('Не удалось завершить сохранение серверных данных.'); }
    }
    private function defaults(): array {
        return ['version'=>2,'nextUserId'=>1,'nextNodeId'=>1,'users'=>[],'nodes'=>[],'catalog'=>null,'catalogUpdatedAt'=>null,'settings'=>['theme'=>'default']];
    }
}
