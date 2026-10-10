<?php
declare(strict_types=1);

final class CatalogPhotos {
    public const MAX_PER_ARTICLE = 5;
    private const MAX_BYTES = 6 * 1024 * 1024;

    public static function mutate(array &$catalog, array $payload, string $storageDirectory): array {
        $article = trim((string)($payload['article'] ?? ''));
        if ($article === '' || !isset($catalog['articles'][$article]) || !is_array($catalog['articles'][$article])) {
            throw new InvalidArgumentException('Артикул не найден в общем каталоге.');
        }
        $operation = (string)($payload['operation'] ?? '');
        $record =& $catalog['articles'][$article];
        $photos = $record['photos'] ?? [];
        if (!is_array($photos)) $photos = [];

        if ($operation === 'add') {
            $decoded = self::decodePhoto($payload['photo'] ?? null);
            foreach ($photos as $index => $existing) {
                $existingName = is_array($existing) ? (string)($existing['name'] ?? '') : '';
                if ($existingName !== '' && strcasecmp($existingName, $decoded['name']) === 0) {
                    if (self::photoHash($existing, $storageDirectory) === $decoded['sha256']) {
                        return ['added' => false, 'updated' => false, 'photos' => $photos];
                    }
                    [$replacement, $filePath] = self::storePhoto($decoded, $storageDirectory);
                    $oldFile = self::managedFile($existing, $storageDirectory);
                    $photos[$index] = $replacement;
                    $record['photos'] = $photos;
                    return [
                        'added' => false,
                        'updated' => true,
                        'photos' => $photos,
                        'createdFiles' => [$filePath],
                        'removedFiles' => $oldFile === null ? [] : [$oldFile]
                    ];
                }
            }
            if (count($photos) >= self::MAX_PER_ARTICLE) {
                throw new InvalidArgumentException('Для одного артикула можно сохранить не больше пяти фото.');
            }
            [$photo, $filePath] = self::storePhoto($decoded, $storageDirectory);
            $photos[] = $photo;
            $record['photos'] = $photos;
            return ['added' => true, 'updated' => false, 'photos' => $photos, 'createdFiles' => [$filePath]];
        }

        if ($operation === 'remove') {
            $src = (string)($payload['src'] ?? '');
            if ($src === '') throw new InvalidArgumentException('Не указано фото для удаления.');
            $remaining = [];
            $removedFiles = [];
            foreach ($photos as $photo) {
                $existingSrc = is_array($photo) ? (string)($photo['src'] ?? '') : (is_string($photo) ? $photo : '');
                if ($existingSrc === $src) {
                    $managed = self::managedFile($photo, $storageDirectory);
                    if ($managed !== null) $removedFiles[] = $managed;
                    continue;
                }
                $remaining[] = $photo;
            }
            if (count($remaining) === count($photos)) throw new InvalidArgumentException('Фото уже отсутствует в общем каталоге.');
            $record['photos'] = $remaining;
            return ['removed' => true, 'photos' => $remaining, 'removedFiles' => $removedFiles];
        }

        throw new InvalidArgumentException('Неизвестное действие с фото товара.');
    }

    public static function useServerPhotos(array &$catalog, array $serverCatalog): void {
        $serverArticles = is_array($serverCatalog['articles'] ?? null) ? $serverCatalog['articles'] : [];
        foreach ($catalog['articles'] as $article => &$record) {
            if (!is_array($record) || !isset($serverArticles[$article]) || !is_array($serverArticles[$article])) continue;
            $photos = $serverArticles[$article]['photos'] ?? null;
            if (is_array($photos)) $record['photos'] = $photos;
            else unset($record['photos']);
        }
        unset($record);
    }

    public static function migrateEmbedded(array &$catalog, string $storageDirectory): array {
        $createdFiles = [];
        try {
        if (!is_array($catalog['articles'] ?? null)) return [];
        foreach ($catalog['articles'] as $article => &$record) {
            if (!is_array($record) || !is_array($record['photos'] ?? null)) continue;
            $photos = [];
            foreach (array_values($record['photos']) as $index => $photo) {
                $src = is_array($photo) ? (string)($photo['src'] ?? '') : (is_string($photo) ? $photo : '');
                if (!str_starts_with(strtolower($src), 'data:image/')) {
                    $photos[] = $photo;
                    continue;
                }
                $name = is_array($photo) ? (string)($photo['name'] ?? '') : '';
                if ($name === '') $name = (string)$article.'-'.($index + 1).'.jpg';
                $decoded = self::decodePhoto(['name' => $name, 'src' => $src]);
                [$stored, $filePath] = self::storePhoto($decoded, $storageDirectory);
                $photos[] = $stored;
                $createdFiles[] = $filePath;
            }
            $record['photos'] = $photos;
        }
        unset($record);
        return $createdFiles;
        } catch (Throwable $error) {
            unset($record);
            foreach ($createdFiles as $file) if (is_file($file)) @unlink($file);
            throw $error;
        }
    }

    private static function decodePhoto(mixed $value): array {
        if (!is_array($value)) throw new InvalidArgumentException('Некорректные данные фото.');
        $name = trim(str_replace('\\', '/', (string)($value['name'] ?? '')));
        $name = basename($name);
        $src = (string)($value['src'] ?? '');
        if ($name === '' || strlen($name) > 240) throw new InvalidArgumentException('Укажите имя файла фото длиной до 240 символов.');
        if (!preg_match('~^data:(image/(?:jpeg|png|webp));base64,([A-Za-z0-9+/]+={0,2})$~i', $src, $matches)) {
            throw new InvalidArgumentException('Фото должно быть JPEG, PNG или WebP.');
        }
        $bytes = base64_decode($matches[2], true);
        if ($bytes === false || $bytes === '' || strlen($bytes) > self::MAX_BYTES) {
            throw new InvalidArgumentException('Фото пустое или превышает лимит 6 МБ после обработки.');
        }
        $details = @getimagesizefromstring($bytes);
        if (!is_array($details)) throw new InvalidArgumentException('Сервер не смог проверить содержимое фото.');
        $mime = strtolower((string)($details['mime'] ?? ''));
        if ($mime !== strtolower($matches[1])) throw new InvalidArgumentException('Сервер не смог проверить содержимое фото.');
        $width = (int)($details[0] ?? 0);
        $height = (int)($details[1] ?? 0);
        if ($width < 1 || $height < 1 || $width > 6000 || $height > 6000 || $width * $height > 24000000) {
            throw new InvalidArgumentException('Размер изображения превышает допустимый предел.');
        }
        return ['name' => $name, 'mime' => $mime, 'bytes' => $bytes, 'sha256' => hash('sha256', $bytes)];
    }

    private static function photoHash(mixed $photo, string $storageDirectory): ?string {
        $src = is_array($photo) ? (string)($photo['src'] ?? '') : (is_string($photo) ? $photo : '');
        $file = self::managedFile($photo, $storageDirectory);
        if ($file !== null) {
            $hash = @hash_file('sha256', $file);
            if (is_string($hash)) return strtolower($hash);
        }
        if (str_contains($src, 'api/index.php?action=product_photo')) return null;
        if (is_array($photo)) {
            $storedHash = strtolower((string)($photo['sha256'] ?? ''));
            if (preg_match('/^[a-f0-9]{64}$/', $storedHash)) return $storedHash;
        }
        if (str_starts_with(strtolower($src), 'data:image/')) {
            try {
                return self::decodePhoto([
                    'name' => is_array($photo) ? (string)($photo['name'] ?? 'existing-photo.jpg') : 'existing-photo.jpg',
                    'src' => $src
                ])['sha256'];
            } catch (Throwable) {
                return null;
            }
        }
        return null;
    }

    private static function storePhoto(array $photo, string $storageDirectory): array {
        if (!is_dir($storageDirectory) && !@mkdir($storageDirectory, 0775, true) && !is_dir($storageDirectory)) {
            throw new RuntimeException('Не удалось создать серверную папку фото.');
        }
        $extension = match ($photo['mime']) {
            'image/jpeg' => 'jpg',
            'image/png' => 'png',
            'image/webp' => 'webp',
            default => throw new InvalidArgumentException('Фото должно быть JPEG, PNG или WebP.')
        };
        $id = bin2hex(random_bytes(24));
        $filePath = rtrim($storageDirectory, DIRECTORY_SEPARATOR).DIRECTORY_SEPARATOR.$id.'.'.$extension;
        $written = @file_put_contents($filePath, $photo['bytes'], LOCK_EX);
        if ($written !== strlen($photo['bytes'])) {
            if (is_file($filePath)) @unlink($filePath);
            throw new RuntimeException('Не удалось записать фото на сервер.');
        }
        return [[
            'name' => $photo['name'],
            'src' => 'api/index.php?action=product_photo&id='.$id,
            'storageId' => $id,
            'mime' => $photo['mime'],
            'sha256' => $photo['sha256']
        ], $filePath];
    }

    public static function obsoleteFiles(array $before, array $after, string $storageDirectory): array {
        $existing = [];
        $retained = [];
        foreach ([$before, $after] as $index => $catalog) {
            $articles = is_array($catalog['articles'] ?? null) ? $catalog['articles'] : [];
            foreach ($articles as $record) {
                $photos = is_array($record) && is_array($record['photos'] ?? null) ? $record['photos'] : [];
                foreach ($photos as $photo) {
                    $file = self::managedFile($photo, $storageDirectory);
                    if ($file !== null) {
                        if ($index === 0) $existing[$file] = true;
                        else $retained[$file] = true;
                    }
                }
            }
        }
        return array_values(array_diff(array_keys($existing), array_keys($retained)));
    }

    private static function managedFile(mixed $photo, string $storageDirectory): ?string {
        $src = is_array($photo) ? (string)($photo['src'] ?? '') : (is_string($photo) ? $photo : '');
        if (!str_contains($src, 'api/index.php?action=product_photo')) return null;
        $query = (string)(parse_url($src, PHP_URL_QUERY) ?? '');
        parse_str($query, $params);
        $id = (string)($params['id'] ?? '');
        if (!preg_match('/^[a-f0-9]{48}$/i', $id)) return null;
        foreach (['jpg', 'png', 'webp'] as $extension) {
            $file = rtrim($storageDirectory, DIRECTORY_SEPARATOR).DIRECTORY_SEPARATOR.$id.'.'.$extension;
            if (is_file($file)) return $file;
        }
        return null;
    }
}
